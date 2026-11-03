import json,re,unicodedata,glob,collections,sys
D='/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/dl/'
OUT='/home/claude/meu-pulpito/biblia/'
def loadjs(p,var):
    t=open(p,encoding='utf-8').read();i=t.index('{',t.index(var));j=t.rindex('}')
    return json.loads(t[i:j+1])
gr=loadjs(D+'strongs/greek/strongs-greek-dictionary.js','strongsGreekDictionary')
he=loadjs(D+'strongs/hebrew/strongs-hebrew-dictionary.js','strongsHebrewDictionary')
def base(n):
    m=re.match(r'([GH])0*(\d+)',n); return m.group(1)+m.group(2) if m else None
def normg(w):
    w=unicodedata.normalize('NFD',w.lower());w=''.join(c for c in w if not unicodedata.combining(c))
    w=w.replace('ς','σ');return re.sub(r'[^Ͱ-Ͽ]','',w)
HEB_DROP=set(range(0x0591,0x05B0))|{0x05BD,0x05BF,0x05C0,0x05C3,0x05C4,0x05C5,0x05C6,0x05F3,0x05F4,0x200D,0x034F}
def normh(w):
    w=unicodedata.normalize('NFC',w.replace('/','').replace('\\',''))
    w=''.join(c for c in w if ord(c) not in HEB_DROP and (0x0590<=ord(c)<=0x05FF or c=='־'))
    return w.replace('־','')
# Greek forms
gforms=collections.defaultdict(collections.Counter)
for f in glob.glob(D+'step/Translators Amalgamated OT+NT/TAGNT*.txt'):
    for l in open(f,encoding='utf-8'):
        c=l.rstrip('\n').split('\t')
        if len(c)<12 or '#' not in c[0] or '=' not in c[0]:continue
        if 'K' not in c[0].split('=')[1]:continue
        w=c[1].split(' (')[0];n=base(c[11] or c[3]);
        if not n:continue
        gforms[normg(w)][(n,c[8].strip())]+=1
hforms=collections.defaultdict(collections.Counter)
for f in glob.glob(D+'step/Translators Amalgamated OT+NT/TAHOT*.txt'):
    for l in open(f,encoding='utf-8'):
        c=l.rstrip('\n').split('\t')
        if len(c)<9 or '#' not in c[0] or '=' not in c[0]:continue
        n=base(c[8]) if c[8] else None
        if not n:
            m=re.search(r'\{(H\d+)',c[4]);n=base(m.group(1)) if m else None
        if not n:continue
        hforms[normh(c[1])][n]+=1
def clean(s):return re.sub(r'\s+',' ',(s or '').strip())
G={k[1:]:[v.get('lemma',''),v.get('translit',''),clean(v.get('strongs_def')),clean(v.get('kjv_def')),clean(v.get('derivation'))] for k,v in gr.items()}
H={k[1:]:[v.get('lemma',''),v.get('xlit',''),clean(v.get('strongs_def')),clean(v.get('kjv_def')),clean(v.get('derivation')),v.get('pron','')] for k,v in he.items()}
GC=collections.Counter();[GC.update({n[1:]:c}) for cnt in gforms.values() for (n,es),c in cnt.items()]
HC=collections.Counter();[HC.update({n[1:]:c}) for cnt in hforms.values() for n,c in cnt.items()]
GE=collections.defaultdict(collections.Counter)
for cnt in gforms.values():
    for (n,es),c in cnt.items():
        g=re.sub(r'[\[\]()]','',es).strip().lower()
        if g:GE[n[1:]][g]+=c
GEt={n:[g for g,_ in c.most_common(5)] for n,c in GE.items()}
GF={}
for f,cnt in gforms.items():
    (n,es),_=cnt.most_common(1)[0];GF[f]=[n[1:],es] if es else n[1:]
HF={f:cnt.most_common(1)[0][0][1:] for f,cnt in hforms.items() if f}
src_g='Strong 1890 (dominio público; JSON Open Scriptures, CC BY-SA) + formas y glosas en español de STEPBible TAGNT (CC BY)'
src_h='Strong 1894 (dominio público; JSON Open Scriptures, CC BY-SA) + formas de STEPBible TAHOT (CC BY)'
json.dump({'src':src_g,'d':G,'f':GF,'c':dict(GC),'e':GEt},open(OUT+'strong-gr.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
json.dump({'src':src_h,'d':H,'f':HF,'c':dict(HC)},open(OUT+'strong-he.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(G),len(H),len(GF),len(HF))
# coverage check vs our texts
g=json.load(open(OUT+'grc-tr.json'));h=json.load(open(OUT+'hbo-wlc.json'))
def cov(bible,norm,forms):
    tot=hit=0;miss=collections.Counter()
    for b in bible:
        for ch in b:
            for v in ch:
                for w in re.split(r'[\s\u05be]+',v or ''):
                    k=norm(w)
                    if not k:continue
                    tot+=1
                    if k in forms:hit+=1
                    else:miss[k]+=1
    return hit/tot,miss.most_common(8)
print('gr',cov(g[39:],normg,GF));print('he',cov(h[:39],normh,HF))
