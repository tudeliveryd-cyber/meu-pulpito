# Devocional para o site: um arquivo pequeno por mês, com o texto do versículo já pronto
# (Reina-Valera 1909 em espanhol, Bíblia Livre em português), para o site não precisar baixar as Bíblias.
import json,os,re,datetime
D=os.path.dirname(os.path.abspath(__file__));B=os.path.join(D,'..','..','app','biblia')
E=json.load(open(os.path.join(B,'devocional.json')))['e']
BIB={'es':json.load(open(os.path.join(B,'es-rv1909.json'))),'pt':json.load(open(os.path.join(B,'pt-livre.json')))}
def vt(ref,L):
    m=re.match(r'^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$',ref);b,c,v1=int(m[1]),int(m[2]),int(m[3]);v2=int(m[4] or v1)
    return ' '.join(x for x in BIB[L][b][c-1][v1-1:v2] if x)
APP=open(os.path.join(D,'..','..','app','app.js'),encoding='utf-8').read()
BK=[json.loads(x.replace("'",'"')) for x in re.findall(r"books:(\[(?:'[^']*',?)+\])",APP)[:2]]  # [es, pt]
def lab(ref,i):
    m=re.match(r'^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$',ref);return '%s %s:%s%s'%(BK[i][int(m[1])],m[2],m[3],'-'+m[4] if m[4] else '')
OUT=os.path.join(B,'devo');os.makedirs(OUT,exist_ok=True)
base=datetime.date(2025,1,1)  # ano não bissexto: dia 1..365 -> mês
mon={}
for i,e in enumerate(E):
    d=base+datetime.timedelta(days=i);mon.setdefault(d.month,{})[i+1]=dict(t=e['t'],v=e['v'],x=[vt(e['v'],'es'),vt(e['v'],'pt')],n=[lab(e['v'],0),lab(e['v'],1)],r=e['r'],a=e['a'],o=e['o'])
for m,dd in mon.items():
    json.dump(dd,open(os.path.join(OUT,'%02d.json'%m),'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print({m:len(d) for m,d in mon.items()})
