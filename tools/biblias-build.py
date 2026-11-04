# Versiones adicionales de la Biblia para Meu Púlpito (todas de dominio público o con licencia libre).
# Fuentes: eBible.org (corpus BibleNLP/ebible, alineado al versículo) y scrollmapper/bible_databases.
# Uso: python3 biblias-build.py <dir ebible> <dir con los .json de scrollmapper>
import json,re,os,sys
EB,SM=sys.argv[1],sys.argv[2]
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia')
V=open(os.path.join(EB,'metadata','vref.txt')).read().split('\n')
BK=[]
for v in V:
    b=v.split(' ')[0]
    if b and b not in BK:BK.append(b)
BK=BK[:66]
def ebible(fid,out):
    L=open(os.path.join(EB,'corpus',fid+'.txt')).read().split('\n')
    res=[[] for _ in BK];bi={b:i for i,b in enumerate(BK)}
    for i,ref in enumerate(V):
        if not ref:continue
        b,cv=ref.split(' ')
        if b not in bi:continue
        c,vn=map(int,cv.split(':'));x=(L[i] if i<len(L) else '').strip()
        if x=='<range>':x=''
        x=x.replace('[[','').replace(']]','')
        x=re.sub(r'\s+',' ',x).strip();x=re.sub(r'([,;:!?])(?=[A-Za-zÀ-ÿ])',r'\1 ',x)
        B=res[bi[b]]
        while len(B)<c:B.append([])
        C=B[c-1]
        while len(C)<vn:C.append('')
        C[vn-1]=x
    for B in res:
        for C in B:
            while C and not C[-1]:C.pop()
    save(res,out)
def scroll(name,out):
    d=json.load(open(os.path.join(SM,name+'.json')));res=[]
    for b in d['books']:
        chs=[]
        for c in b['chapters']:
            n=max(x['verse'] for x in c['verses']);a=['']*n
            for x in c['verses']:a[x['verse']-1]=re.sub(r'\s+',' ',x['text']).strip()
            chs.append(a)
        res.append(chs)
    save(res,out)
def save(res,out):
    n=sum(1 for b in res for c in b for v in c if v)
    json.dump(res,open(os.path.join(OUT,out+'.json'),'w'),ensure_ascii=False,separators=(',',':'))
    print(out,len(res),n)
ebible('por-porbrbsl','pt-bpm')     # Bíblia Portuguesa Mundial — dominio público
ebible('spa-spabes','es-bes')       # La Biblia en Español Sencillo — CC BY 4.0, AudioBiblia.org / Irma Flores
ebible('spa-spapddpt','es-pdt')     # Palabra de Dios para ti — CC BY 4.0, Asociación Bíblica Latinoamericana
ebible('spa-spavbl','es-vbl')       # Versión Biblia Libre — CC BY-SA 4.0, J. Gallagher y S. Barrios de Ávila
ebible('spa-spablm','es-blm')       # Santa Biblia libre para el mundo — dominio público
ebible('eng-engylt','en-ylt')       # Young's Literal Translation — dominio público
scroll('ASV','en-asv')              # American Standard Version (1901) — dominio público
