# Junta o devocional (5 partes), as sugestões e o manual e grava em app/biblia
import json,os,collections
D=os.path.dirname(os.path.abspath(__file__));B=os.path.join(D,'..','..','app','biblia')
e=[]
for i in range(1,6):e+=json.load(open(os.path.join(D,'devocional-%d.json'%i)))
assert len(e)==365,len(e)
refs=collections.Counter(x['v'] for x in e);dup=[r for r,n in refs.items() if n>1];assert not dup,dup
for x in e:assert set(x)>= {'t','v','r','a','o'} and all(len(x[k])==2 and all(x[k]) for k in 'trao'),x
json.dump({'src':'Meu Púlpito','e':e},open(os.path.join(B,'devocional.json'),'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
for f in ('sugestoes','manual'):
    d=json.load(open(os.path.join(D,f+'.json')));json.dump(d,open(os.path.join(B,f+'.json'),'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print('devocional',len(e),'sugestoes',sum(len(o['s']) for o in json.load(open(os.path.join(B,'sugestoes.json')))['occ']),'manual',len(json.load(open(os.path.join(B,'manual.json')))['c']))
