# Construye los diccionarios hebreo y griego de Meu Púlpito
# Fuentes: STEPBible.org (TBESH, TBESG, TAHOT, TAGNT) — CC BY 4.0, Tyndale House Cambridge
# Glosas traducidas al español y portugués: gl/map.json (traducción revisada de las glosas de STEP)
import json,re,collections,os,sys
SP="/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/build/"
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia','lex')
os.makedirs(OUT,exist_ok=True)
raw=json.load(open(SP+'lexraw.json'))
gmap={k.lower():v for k,v in json.load(open(SP+'gl/map.json')).items()}
# glosas dos números que só existem divididos em sentidos no léxico (H0310a…), traduzidas à mão
GX=dict(gmap)
for k,v in json.load(open(SP+'gl/extra.json')).items():GX.setdefault(k.lower(),v)
es2pt={}
for en,(es,pt) in gmap.items():
    es2pt.setdefault(es.lower(),pt)
BOOKS=['Gen','Exo','Lev','Num','Deu','Jos','Jdg','Rut','1Sa','2Sa','1Ki','2Ki','1Ch','2Ch','Ezr','Neh','Est','Job','Psa','Pro','Ecc','Sng','Isa','Jer','Lam','Ezk','Dan','Hos','Jol','Amo','Oba','Jon','Mic','Nam','Hab','Zep','Hag','Zec','Mal','Mat','Mrk','Luk','Jhn','Act','Rom','1Co','2Co','Gal','Eph','Php','Col','1Th','2Th','1Ti','2Ti','Tit','Phm','Heb','Jas','1Pe','2Pe','1Jn','2Jn','3Jn','Jud','Rev']
BI={b:i for i,b in enumerate(BOOKS)}
ALT={'Ezek':'Ezk','Joel':'Jol','Nah':'Nam','Song':'Sng','Mar':'Mrk','Mark':'Mrk','John':'Jhn','Phil':'Php','Jude':'Jud','Psalm':'Psa','Ps':'Psa'}

def tr_gloss(g):
    g=(g or '').strip()
    if not g:return None,None
    k=g.lower()
    if k in GX:return GX[k]
    # varias glosas separadas por "|" o "/"
    for sep in ('|','/',', '):
        if sep in g:
            ps=[x.strip() for x in g.split(sep) if x.strip()]
            if ps and all(p.lower() in GX for p in ps):
                return ' / '.join(GX[p.lower()][0] for p in ps),' / '.join(GX[p.lower()][1] for p in ps)
    # "son: descendant" = glosa principal: sentido no contexto
    if ':' in g:
        h=g.split(':')[0].strip().lower()
        if h in GX:return GX[h]
    return None,None

ART_EN=re.compile(r'^(the|a|an|o)\s+')
SUBJ_EN=re.compile(r'^(he|she|i|you|we|they|it|one who|those who|who|that|which)\s+')
AUX_EN=re.compile(r'^((is|are|was|were|will|shall|be|been|being|has|have|had|did|do|does|may|might|let|must|would|should|can|could)\s+)+')
def norm_he_sense(s):
    s=re.sub(r'[\[\]<>{}]','',s or '').strip(' .,;:-?!').lower()
    s=re.sub(r'\s+',' ',s)
    for rx in (ART_EN,SUBJ_EN,AUX_EN,ART_EN):
        s2=rx.sub('',s)
        if s2:s=s2
    s2=re.sub(r'\s+(of|to)$','',s)
    return s2 or s
ART_ES=re.compile(r'^(el|la|los|las|lo|un|una|unos|unas|de el|de la|de los|de las|del|de|a el|a la|a los|a las|al|a|y|pero)\s+')
def norm_gr_sense(s):
    s=re.sub(r'[\[\]<>{}]','',s or '').replace('--','')
    s=re.sub(r'\([^)]*\)','',s).strip(' .,;:-?!¿¡').lower()
    s=re.sub(r'\s+',' ',s)
    for _ in range(2):
        s2=ART_ES.sub('',s)
        if s2 and s2!=s:s=s2
    return s

def clean_me(me):
    refs=[]
    def rf(m):
        r=m.group(1)
        mm=re.match(r'^(\w+)\.(\d+)\.(\d+)',r)
        if mm:
            b=ALT.get(mm.group(1),mm.group(1))
            if b in BI:
                k=f"{BI[b]}.{mm.group(2)}.{mm.group(3)}"
                if k not in refs:refs.append(k)
        return m.group(2)
    t=re.sub(r"<ref='([^']+)'>(.*?)</ref>",rf,me or '')
    t=re.sub(r'<note>.*?</note>','',t)
    t=re.sub(r'(?i)<br\s*/?>','\n',t)
    t=re.sub(r'<[^>]+>','',t)
    t=t.replace('&lt;','<').replace('&gt;','>').replace('&amp;','&').replace('__','')
    t=re.sub(r'[ \t]+',' ',t)
    t='\n'.join(x.strip() for x in t.split('\n') if x.strip())
    return t.strip(),refs

def build(kind):
    lex=raw['he' if kind=='he' else 'gr'];P='H' if kind=='he' else 'G'
    idx=[];chunks=collections.defaultdict(dict)
    for key,e in lex.items():
        n=int(key[1:]);o=raw['occ'].get(key,{'n':0,'refs':[],'s':{}})
        es,pt=tr_gloss(e['gl'])
        # sentidos en contexto
        agg={}
        for s,(c,rs) in o['s'].items():
            ns=norm_he_sense(s) if kind=='he' else norm_gr_sense(s)
            if not ns:continue
            a=agg.setdefault(ns,[0,[]]);a[0]+=c
            for r in rs:
                if r not in a[1] and len(a[1])<6:a[1].append(r)
        senses=sorted(agg.items(),key=lambda x:-x[1][0])[:12]
        sv=[]
        for s,(c,rs) in senses:
            if kind=='he':
                t=gmap.get(s) or gmap.get('to '+s) or gmap.get(re.sub(r'(ed|s|ing)$','',s) and 'to '+re.sub(r'(ed|s|ing)$','',s));sv.append([s,t[0] if t else None,t[1] if t else None,c,rs])
            else:
                sv.append([s,s,es2pt.get(s),c,rs])
        # nombres propios del NT: el nombre en español sale del contexto (TAGNT)
        if e['mo'].startswith('N:') and kind=='gr' and sv:
            es=sv[0][1].title()
        me,mrefs=clean_me(e['me'])
        kw=' '.join(sorted({x for s in sv[:8] for x in (s[1],s[2]) if x}))
        idx.append([n,e['lem'],e['tr'],e['mo'],e['gl'],es or '',pt or '',o['n'],kw])
        chunks[n//500][n]={'me':me,'mr':mrefs[:30],'s':sv,'r':o['refs'][:120],'rn':len(o['refs'])}
    idx.sort(key=lambda x:x[0])
    src='STEPBible.org · Tyndale House, Cambridge (CC BY 4.0) — '+('TBESH (léxico hebreo, basado en BDB/Gesenius), TAHOT' if kind=='he' else 'TBESG (léxico griego, basado en Abbott-Smith), TAGNT')
    json.dump({'src':src,'e':idx},open(f'{OUT}/{kind}-idx.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    for c,d in chunks.items():
        json.dump(d,open(f'{OUT}/{kind}-{c}.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    tr=sum(1 for x in idx if x[5]);print(kind,len(idx),'glosas traducidas',tr,'trozos',len(chunks))
build('he');build('gr')
