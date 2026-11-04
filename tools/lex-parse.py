# Lee los léxicos y las ocurrencias de STEPBible y deja un JSON intermedio
import re,json,glob,collections,sys
D='/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/dl/step/'
OUT='/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/build/'
BOOKS=['Gen','Exo','Lev','Num','Deu','Jos','Jdg','Rut','1Sa','2Sa','1Ki','2Ki','1Ch','2Ch','Ezr','Neh','Est','Job','Psa','Pro','Ecc','Sng','Isa','Jer','Lam','Ezk','Dan','Hos','Jol','Amo','Oba','Jon','Mic','Nam','Hab','Zep','Hag','Zec','Mal','Mat','Mrk','Luk','Jhn','Act','Rom','1Co','2Co','Gal','Eph','Php','Col','1Th','2Th','1Ti','2Ti','Tit','Phm','Heb','Jas','1Pe','2Pe','1Jn','2Jn','3Jn','Jud','Rev']
BI={b:i for i,b in enumerate(BOOKS)}
def base(n):
    m=re.match(r'\{?([GH])0*(\d+)',n or '');return m.group(1)+m.group(2) if m else None
STRONG=json.load(open('/home/claude/meu-pulpito/app/biblia/strong-he.json'))['d']
def lex(f,maxn):
    out={};var=collections.defaultdict(list)
    for l in open(f,encoding='utf-8'):
        c=l.rstrip('\n').split('\t')
        if len(c)<8:continue
        if re.match(r'^[HG]\d{4}[a-z]$',c[0]):
            b=base(c[0])
            if int(b[1:])<=maxn:var[b].append(dict(lem=c[3].strip(),tr=c[4].strip(),mo=c[5].strip(),gl=c[6].strip(),me=c[7].strip()))
            continue
        if not re.match(r'^[HG]\d{4}$',c[0]):continue
        b=base(c[0]);n=int(b[1:])
        if n>maxn or b in out:continue
        out[b]=dict(lem=c[3].strip(),tr=c[4].strip(),mo=c[5].strip(),gl=c[6].strip(),me=c[7].strip())
    # números que no léxico só existem divididos em sentidos (H0310a, H0310b…): o sentido principal é o de explicação mais longa
    for b,vs in var.items():
        if b in out:continue
        sd=STRONG.get(b[1:]) if b[0]=='H' else None
        dw=set(re.findall(r'[a-z]+',(sd[2]+' '+sd[3]).lower())) if sd else set()
        def sc(v):
            gw=[w for w in re.findall(r'[a-z]+',v['gl'].lower()) if len(w)>2 and w not in ('the',)]
            ov=sum(1 for w in gw if w in dw or (len(w)>4 and any(x.startswith(w[:5]) for x in dw)))
            nm=v['mo'].startswith('N:');isnm=bool(sd) and sd[2][:1].isupper()
            return (ov>0, (nm==isnm), ov, 'm.s.' in v['gl'], v['gl'][:1].islower(), len(v['me']))
        p=max(vs,key=sc);e=dict(p)
        for v in vs:
            if v is not p:e['me']+='<br><br>'+v['gl']+': '+v['me']
        out[b]=e
    return out
he=lex(D+'Lexicons/TBESH - Translators Brief lexicon of Extended Strongs for Hebrew - STEPBible.org CC BY.txt',8674)
gr=lex(D+'Lexicons/TBESG - Translators Brief lexicon of Extended Strongs for Greek - STEPBible.org CC BY.txt',5624)
def refkey(r):
    m=re.match(r'^(\w+)\.(\d+)\.(\d+)',r);
    if not m or m.group(1) not in BI:return None
    return f"{BI[m.group(1)]}.{m.group(2)}.{m.group(3)}"
occ=collections.defaultdict(lambda:{'n':0,'refs':[],'s':collections.defaultdict(lambda:[0,[]])})
def add(b,ref,sense):
    o=occ[b];o['n']+=1
    if ref and (not o['refs'] or o['refs'][-1]!=ref):o['refs'].append(ref)
    if sense:
        s=o['s'][sense];s[0]+=1
        if ref and len(s[1])<6 and ref not in s[1]:s[1].append(ref)
for f in glob.glob(D+'Translators Amalgamated OT+NT/TAGNT*.txt'):
    for l in open(f,encoding='utf-8'):
        c=l.rstrip('\n').split('\t')
        if len(c)<12 or '#' not in c[0] or '=' not in c[0]:continue
        if 'K' not in c[0].split('=')[1]:continue
        b=base(c[11] or c[3]);
        if not b:continue
        add(b,refkey(c[0]),re.sub(r'[\[\]]','',c[8]).strip().lower())
for f in glob.glob(D+'Translators Amalgamated OT+NT/TAHOT*.txt'):
    for l in open(f,encoding='utf-8'):
        c=l.rstrip('\n').split('\t')
        if len(c)<9 or '#' not in c[0] or '=' not in c[0]:continue
        b=base(c[8]) if c[8] else None
        if not b:
            m=re.search(r'\{(H\d+)',c[4]);b=base(m.group(1)) if m else None
        if not b:continue
        # sentido en contexto: la parte de la glosa inglesa que corresponde a la palabra principal
        g=c[3].strip();parts=g.split('/');sp=c[4].split('/');mi=next((i for i,x in enumerate(sp) if '{' in x),len(sp)-1)
        part=parts[mi] if len(parts)==len(sp) and mi<len(parts) else parts[-1]
        sense=re.sub(r'[\[\]<>]','',part).strip().lower()
        add(b,refkey(c[0]),sense)
res={'he':he,'gr':gr,'occ':{k:{'n':v['n'],'refs':v['refs'],'s':{s:x for s,x in v['s'].items()}} for k,v in occ.items()}}
json.dump(res,open(OUT+'lexraw.json','w',encoding='utf-8'),ensure_ascii=False)
print(len(he),len(gr),len(res['occ']))
# glosas a traducir (no nombres propios), ordenadas por frecuencia
cnt=collections.Counter()
for d in (he,gr):
    for b,e in d.items():
        if e['mo'].startswith('N:'):continue
        cnt[e['gl']]+=occ[b]['n'] if b in occ else 0
gl=[g for g,_ in cnt.most_common() if g]
json.dump(gl,open(OUT+'gl/all.json','w',encoding='utf-8'),ensure_ascii=False)
print('glosas',len(gl))
