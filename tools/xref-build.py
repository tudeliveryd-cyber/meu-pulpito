# Referencias cruzadas de Meu Púlpito
# Fuente: OpenBible.info Cross References (CC BY), basadas en el Treasury of Scripture Knowledge (dominio público).
# Copia usada: scrollmapper/bible_databases (MIT), formats/sqlite/extras/cross_references_*.db
import sqlite3,glob,json,os,collections,sys
SRC=sys.argv[1]
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia','xref');os.makedirs(OUT,exist_ok=True)
B=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','I Samuel','II Samuel','I Kings','II Kings','I Chronicles','II Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','I Corinthians','II Corinthians','Galatians','Ephesians','Philippians','Colossians','I Thessalonians','II Thessalonians','I Timothy','II Timothy','Titus','Philemon','Hebrews','James','I Peter','II Peter','I John','II John','III John','Jude','Revelation of John']
def key(n):return n.lower().replace('1 ','i ').replace('2 ','ii ').replace('3 ','iii ').replace('revelation of john','revelation').replace('song of songs','song of solomon').replace('psalm ','psalms ').strip()
BI={key(n):i for i,n in enumerate(B)};BI['revelation']=65;BI['psalm']=18
rows=[];miss=collections.Counter()
for f in sorted(glob.glob(SRC+'/cross_references_*.db')):
    for r in sqlite3.connect(f).execute('select from_book,from_chapter,from_verse,to_book,to_chapter,to_verse_start,to_verse_end,votes from cross_references'):
        a=BI.get(key(r[0]));b=BI.get(key(r[3]))
        if a is None:miss[r[0]]+=1;continue
        if b is None:miss[r[3]]+=1;continue
        rows.append((a,r[1],r[2],b,r[4],r[5],r[6] or r[5],r[7] or 0))
print('filas',len(rows),'sin libro',miss.most_common(5))
by=collections.defaultdict(list)
for a,c,v,b,c2,v1,v2,vo in rows:
    if vo<2:continue
    by[(a,c,v)].append((vo,b,c2,v1,v2))
for k,L in by.items():
    best={}
    for vo,b,c2,v1,v2 in L:
        kk=(b,c2,v1,v2)
        if kk not in best or vo>best[kk]:best[kk]=vo
    by[k]=[(vo,)+kk for kk,vo in best.items()]
books=collections.defaultdict(dict);n=0
for (a,c,v),L in by.items():
    L.sort(key=lambda x:-x[0]);top=[[b,c2,v1]+([v2] if v2!=v1 else []) for vo,b,c2,v1,v2 in L[:14]]
    books[a][f'{c}:{v}']=top;n+=len(top)
for a,d in books.items():json.dump(d,open(f'{OUT}/{a}.json','w'),separators=(',',':'))
print('versiculos',sum(len(d) for d in books.values()),'refs',n,'libros',len(books))
