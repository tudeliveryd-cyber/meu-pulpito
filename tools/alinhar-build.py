# Palavras das Bíblias em português/espanhol que os dicionários não acham pela glosa
# (nomes como Labão/Labán, e palavras como "moradores", "pestilência") ligadas ao número Strong
# pelo próprio texto bíblico: em quais versículos a palavra aparece e qual palavra hebraica/grega
# aparece nesses mesmos versículos (coeficiente de Dice e proporção de versículos em comum).
# Só fica a ligação quando ela é forte e clara. Uso: python3 alinhar-build.py <miss-pt.json> <miss-es.json>
import json,os,re,sys,unicodedata,collections
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
def normH(w):
    w=unicodedata.normalize('NFC',w);w=re.sub('[/\\\\]','',w)
    w=re.sub('[֑-ֽֿ֯׀׃-׆׳״‍͏־]','',w)
    return re.sub('[^֐-׿]','',w)
def normG(w):return re.sub('[^Ͱ-Ͽ]','',''.join(c for c in unicodedata.normalize('NFD',w) if unicodedata.category(c)!='Mn').lower().replace('ς','σ'))
SH=json.load(open(ROOT+'/strong-he.json'));SG=json.load(open(ROOT+'/strong-gr.json'))
fh=SH['f'];fg=SG['f']
IDX={}
for f,P in (('he','H'),('gr','G')):
    for r in json.load(open(ROOT+'/lex/%s-idx.json'%f))['e']:IDX[P+str(r[0])]=r
WLC=json.load(open(ROOT+'/hbo-wlc.json'));TR=json.load(open(ROOT+'/grc-tr.json'))
ORIG={};tot=hit=0
for b in range(66):
    src=WLC if b<39 else TR
    for ci,ch in enumerate(src[b]):
        for vi,v in enumerate(ch):
            s=set()
            for w in re.split(r'[\s־]+',v or ''):
                if not w:continue
                tot+=1
                if b<39:
                    x=fh.get(normH(w))
                    if x is not None:s.add('H'+str(x[0] if isinstance(x,list) else x))
                else:
                    x=fg.get(normG(w))
                    if x is not None:s.add('G'+str(x[0] if isinstance(x,list) else x))
            if s:hit+=1
            ORIG[(b,ci,vi)]=s
print('versículos originais',len(ORIG))
BIB={'pt':['pt-livre','pt-livretr','pt-nva','pt-bpm'],'es':['es-rv1909','es-rv1865','es-pdt','es-bes','es-vbl','es-blm']}
out={}
for L,mf in (('pt',sys.argv[1]),('es',sys.argv[2])):
    want={w for w,n in json.load(open(mf)) if len(w)>2}
    fw=collections.Counter();fs=collections.Counter();co=collections.defaultdict(collections.Counter)
    for f in BIB[L]:
        B=json.load(open(ROOT+'/'+f+'.json'))
        for b in range(min(66,len(B))):
            for ci,ch in enumerate(B[b]):
                for vi,v in enumerate(ch):
                    if not v:continue
                    ctx=set()
                    ctx|=ORIG.get((b,ci,vi),set())
                    if not ctx:continue
                    for s in ctx:fs[s]+=1
                    ws={norm(w) for w in re.findall(r'[a-zà-ÿ]+',v.lower())}&want
                    for w in ws:
                        fw[w]+=1;co[w].update(ctx)
    NV=sum(1 for f in BIB[L] for _ in [0])  # versões
    tv=max(fs.values())/0.35 if fs else 1   # nº aproximado de versículos com contexto
    tot_ctx=sum(1 for _ in ORIG)*len(BIB[L])
    res={}
    for w,C in co.items():
        if fw[w]<2:continue
        sc=[]
        for s,c in C.items():
            d=2*c/(fw[w]+fs[s]);p=c/fw[w];share=fs[s]/tot_ctx
            nm=(IDX.get(s) or ['','','',''])[3].startswith('N:')
            ok=(nm and c>=2 and d>=0.5) or (c>=4 and d>=0.45) or (c>=8 and p>=0.65 and share<0.05)
            if ok and s in IDX:sc.append((d,p,s))
        if not sc:continue
        sc.sort(reverse=True);best=sc[0][0]
        keep=[sc[0][2]]+[s for d,p,s in sc[1:] if d>=0.8*best and d>=0.35][:1]
        res[w]=keep
    # segunda passada: a ligação tem de valer também no sentido contrário
    # (para essa palavra hebraica/grega, a nossa palavra precisa estar entre as que mais aparecem com ela)
    cand={x for v in res.values() for x in v}
    fa=collections.Counter();ca=collections.defaultdict(collections.Counter)
    for f in BIB[L]:
        B=json.load(open(ROOT+'/'+f+'.json'))
        for b in range(min(66,len(B))):
            for ci,ch in enumerate(B[b]):
                for vi,v in enumerate(ch):
                    if not v:continue
                    ctx=ORIG.get((b,ci,vi),set())&cand
                    if not ctx:continue
                    ws={norm(w) for w in re.findall(r'[a-zà-ÿ]+',v.lower()) if len(w)>2}
                    for w in ws:fa[w]+=1
                    for x in ctx:ca[x].update(ws)
    best={x:max(2*c/(fa[w]+fs[x]) for w,c in C.items()) for x,C in ca.items()}
    for w in list(res):
        keep=[x for x in res[w] if 2*ca[x][w]/(fa[w]+fs[x])>=0.3*best[x]]
        if keep:res[w]=keep
        else:del res[w]
    print(L,'depois da volta',len(res))
    out[L]=res
    print(L,'pedidas',len(want),'com contexto',len(co),'ligadas',len(res))
    for w in ['moradores','pestilencia','parede','levedura','labao','simei','caldeus','direito','gente','duque','lhe','vos','moradores','ninguem','laban','simiente','potestad','ciencia','mancebos','cautividad','vosotros']:
        if w in res:print('  ',w,'->',[(x,(IDX.get(x) or [0]*7)[4]) for x in res[w]])
out={L:{w:[[x,re.sub(r'\s*\(.*?\)\s*','',re.split(r'[:/;,]',IDX[x][4])[0]).strip()] for x in v] for w,v in R.items()} for L,R in out.items()}
json.dump(out,open(os.path.join(ROOT,'lex','alinh.json'),'w'),ensure_ascii=False,separators=(',',':'))
