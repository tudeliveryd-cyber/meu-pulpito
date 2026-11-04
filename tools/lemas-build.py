# Formas das palavras -> palavra de dicionário (lema), só para as palavras que aparecem nas Bíblias do app.
# Serve para a busca nos dicionários achar "cidades" como "cidade", "respondeu" como "responder", "díjole" como "decir".
# Fonte: Lemmatization Lists, Michal Měchura (Open Database License, ODbL) — github.com/michmech/lemmatization-lists
# Uso: python3 lemas-build.py <pasta com lemmatization-pt.txt e lemmatization-es.txt>
import json,os,re,sys,unicodedata,collections
SRC=sys.argv[1];ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
BIB={'pt':['pt-livre','pt-livretr','pt-nva','pt-bpm'],'es':['es-rv1909','es-rv1865','es-pdt','es-bes','es-vbl','es-blm']}
CLIT={'es':['selos','selas','sela','selo','nosla','noslo','mele','mela','melo','tele','les','los','las','nos','me','te','se','le','lo','la','os'],
      'pt':[]}
for L in ('pt','es'):
    forms=collections.Counter()
    for f in BIB[L]:
        for b in json.load(open(os.path.join(ROOT,f+'.json'))):
            for c in b:
                for v in c:
                    for w in re.findall(r"[a-zà-ÿ]+",v.lower()):
                        if len(w)>2:forms[norm(w)]+=1
    lem=collections.defaultdict(list)
    for line in open(os.path.join(SRC,'lemmatization-%s.txt'%L),encoding='utf-8-sig'):
        p=line.rstrip('\r\n').split('\t')
        if len(p)!=2:continue
        a,b=norm(p[0]),norm(p[1])
        if a!=b and a not in lem[b]:lem[b].append(a)
    out={};hit=0;cl=0
    # contrações do português: nele, naquele, daquilo, dentre, numa… -> ele, aquele, aquilo, entre, uma
    CONTR=('ele','ela','eles','elas','este','esta','estes','estas','isto','esse','essa','esses','essas','isso','aquele','aquela','aqueles','aquelas','aquilo','um','uma','uns','umas','entre','outro','outra','outros','outras')
    if L=='pt':
        for w in forms:
            for p in ('n','d'):
                if w.startswith(p) and w[1:] in CONTR:out[w]=[w[1:]]
    for w in forms:
        if w in lem:out[w]=lem[w][:3];hit+=1;continue
        for e in CLIT[L]:  # formas antigas com pronome colado: díjole, levantóse, ruégote
            if w.endswith(e) and len(w)-len(e)>=3:
                base=w[:-len(e)]
                for cand in (base,base+'s'):
                    if cand in lem or cand in forms:
                        out[w]=(lem.get(cand) or [cand])[:3];cl+=1;break
                if w in out:break
    # palavra de dicionário -> nome do verbete em inglês no Dicionário Bíblico (Easton/Smith), tirado das glosas do Strong
    names={r[0].lower():r[0] for r in json.load(open(os.path.join(ROOT,'bib','idx.json')))['e']}
    en={}
    for f in ('he','gr'):
        for r in json.load(open(os.path.join(ROOT,'lex',f+'-idx.json')))['e']:
            g=norm((r[6] if L=='pt' else r[5]) or '').strip();e=(r[4] or '').strip().lower()
            if not g or ' ' in g or not e:continue
            for cand in (e,e[:-1] if e.endswith('s') else ''):
                if cand and cand in names and g not in en:en[g]=names[cand];break
    out={'f':out,'e':en}
    json.dump(out,open(os.path.join(ROOT,'lex','lem-%s.json'%L),'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    print(L,'ingles',len(en),'formas',len(forms),'com lema',hit,'com pronome',cl,'kb',os.path.getsize(os.path.join(ROOT,'lex','lem-%s.json'%L))//1024)
