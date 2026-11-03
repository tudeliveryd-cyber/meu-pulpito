import json,glob,re,collections
D='/tmp/claude-0/-home-claude/bc3af29e-25b3-57fb-8d3a-55ee1453ea10/scratchpad/dl/bdd/data/02_sources/easton/'
B=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation']
AL={'Psalm':18,'Song of Songs':21,'Canticles':21,'Revelations':65}
idx={b:i for i,b in enumerate(B)};idx.update(AL)
rows=[];bad=collections.Counter()
for f in sorted(glob.glob(D+'[a-z].json')):
    for k,e in json.load(open(f)).items():
        txt='\n'.join(re.sub(r'\s+',' ',x['text']).strip() for x in e.get('definitions',[]) if x.get('text'))
        if not txt:continue
        refs=[]
        for r in e.get('scripture_refs',[]):
            m=re.match(r'^(.+?)\s+(\d+):(\d+)(?:-(\d+))?',r.get('reference',''))
            if not m: continue
            b=idx.get(m.group(1))
            if b is None: bad[m.group(1)]+=1;continue
            s=f"{b}.{m.group(2)}.{m.group(3)}"+(f"-{m.group(4)}" if m.group(4) else '')
            if s not in refs:refs.append(s)
        rows.append([e['name'],txt,refs[:40]])
rows.sort(key=lambda r:r[0].lower())
json.dump({'src':"Easton's Bible Dictionary (1897, dominio público) · datos: NEUU bible-dictionary-dataset (CC BY 4.0) / CCEL",'e':rows},open('/home/claude/meu-pulpito/biblia/dic-easton.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(rows),bad.most_common(10))
