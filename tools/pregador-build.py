# Une os lotes do Dicionário do Pregador e completa palavra original e pronúncia a partir do Strong
import json,sys,glob
g=json.load(open('biblia/strong-gr.json'))['d'];h=json.load(open('biblia/strong-he.json'))['d']
out=[]
for f in sys.argv[1:]:
    for e in json.load(open(f)):
        o=[]
        for n,pt,es in e['o']:
            d=(g if n[0]=='G' else h)[n[1:]];o.append([n,d[0],d[1],pt,es])
        out.append([e['pt'],e['es'],e['mpt'],e['mes'],o,e['v'],e['apt'],e['aes']])
json.dump({'src':'Diccionario del predicador · Meu Púlpito','e':out},open('biblia/dic-pregador.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(out))
