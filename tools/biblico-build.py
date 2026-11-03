# Diccionario Bíblico de Meu Púlpito
# Fuentes (dominio público): Easton's Bible Dictionary (1897), Smith's Bible Dictionary (1863),
# Hitchcock's Bible Names Dictionary (1869). Datos estructurados: NEUU bible-dictionary-dataset (CC BY 4.0).
# Nombres en español del NT: STEPBible TAGNT (CC BY 4.0).
import json,glob,re,collections,os,unicodedata
SP='/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/'
D=SP+'dl/bdd/data/02_sources/'
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','biblia')
OUT=ROOT+'/bib';os.makedirs(OUT,exist_ok=True)
B=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation']
idx={b:i for i,b in enumerate(B)};idx.update({'Psalm':18,'Song of Songs':21,'Canticles':21,'Revelations':65})
def refs_of(e):
    out=[]
    for r in e.get('scripture_refs',[]):
        m=re.match(r'^(.+?)\s+(\d+):(\d+)(?:-(\d+))?',r.get('reference',''))
        if not m:continue
        b=idx.get(m.group(1))
        if b is None:continue
        s=f"{b}.{m.group(2)}.{m.group(3)}"+(f"-{m.group(4)}" if m.group(4) else '')
        if s not in out:out.append(s)
    return out[:60]
def load(src):
    o={}
    for f in sorted(glob.glob(D+src+'/[a-z].json')):
        for k,e in json.load(open(f)).items():
            txt='\n'.join(re.sub(r'\s+',' ',x['text']).strip() for x in e.get('definitions',[]) if x.get('text'))
            if txt:o[k.upper()]=(e['name'],txt,refs_of(e))
    return o
E=load('easton');S=load('smith');H=load('hitchcock')
keys=sorted(set(E)|set(S),key=lambda k:k.lower())
def letter(name):
    c=unicodedata.normalize('NFD',name)[0].lower()
    return c if 'a'<=c<='z' else '0'
ix=[];ch=collections.defaultdict(dict)
for k in keys:
    e=E.get(k);s=S.get(k);h=H.get(k)
    name=(e or s)[0]
    refs=list(dict.fromkeys((e[2] if e else [])+(s[2] if s else [])))
    L=letter(name)
    ix.append([name,len(refs),h[1] if h else '',1 if e else 0,1 if s else 0])
    ch[L][name]=[e[1] if e else '',s[1] if s else '',refs[:60]]
# solo Hitchcock (nombres sin artículo en Easton/Smith)
for k,h in H.items():
    if k in E or k in S:continue
    ix.append([h[0],0,h[1],0,0])
ix.sort(key=lambda r:r[0].lower())
json.dump({'src':"Easton's Bible Dictionary (1897), Smith's Bible Dictionary (1863), Hitchcock's Bible Names (1869) — dominio público · datos: NEUU bible-dictionary-dataset (CC BY 4.0)",'e':ix},open(OUT+'/idx.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
for L,d in ch.items():
    json.dump(d,open(f'{OUT}/{L}.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
# alias en español/portugués -> nombre del artículo
al=json.load(open(ROOT+'/dic-alias.json'))
lex=json.load(open(ROOT+'/lex/gr-idx.json'))['e']
names={r[0].lower() for r in ix}
def nrm(x):return ''.join(c for c in unicodedata.normalize('NFD',x.lower()) if unicodedata.category(c)!='Mn')
add=0
for r in lex:
    if not r[3].startswith('N:') or not r[5]:continue
    en=r[4].split('|')[0].split('@')[0].strip();es=nrm(r[5])
    if en.lower() in names and es!=nrm(en) and es not in al and re.match(r'^[a-z ]{3,}$',es):
        al[es]=en;add+=1
json.dump(al,open(OUT+'/alias.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print('entradas',len(ix),'letras',len(ch),'alias',len(al),'+',add)
