# Nombres propios en PT/ES para los diccionarios hebreo, arameo y griego (Meu Púlpito)
# STEPBible solo trae la glosa en inglés para la mayoría de los nombres propios.
# Aquí se agrega la forma tradicional en español (Reina-Valera) y en portugués (Almeida),
# solo para nombres conocidos; los demás quedan con la forma inglesa de STEPBible.
# También: marca los nombres propios arameos (Esdras/Daniel) y agrega «Jesús» como
# palabra clave de Yehoshúa/Yeshúa (Ἰησοῦς es la forma griega de ese nombre).
import json,os,re,glob
LEX=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia','lex')

# inglés: (español, portugués)
N={
'Israel':('Israel','Israel'),'David':('David','Davi'),'Judah':('Judá','Judá'),'Moses':('Moisés','Moisés'),
'Jerusalem':('Jerusalén','Jerusalém'),'Saul':('Saúl','Saul'),'Jacob':('Jacob','Jacó'),'Aaron':('Aarón','Arão'),
'Solomon':('Salomón','Salomão'),'Levi':('Leví','Levi'),'Philistine':('filisteo','filisteu'),'Pharaoh':('Faraón','Faraó'),
'Babylon':('Babilonia','Babilônia'),'Joshua':('Josué','Josué'),'Joseph':('José','José'),'Jordan':('Jordán','Jordão'),
'Moab':('Moab','Moabe'),'Ephraim':('Efraín','Efraim'),'Abraham':('Abraham','Abraão'),'Benjamin':('Benjamín','Benjamim'),
'Zion':('Sion','Sião'),'Assyria':('Asiria','Assíria'),'Jeremiah':('Jeremías','Jeremias'),'Manasseh':('Manasés','Manassés'),
'Joab':('Joab','Joabe'),'Aram':('Aram','Arã'),'Bethel':('Bet-el','Betel'),'Samuel':('Samuel','Samuel'),'Gilead':('Galaad','Gileade'),
'Hezekiah':('Ezequías','Ezequias'),'Negeb':('Neguev','Neguebe'),'Absalom':('Absalón','Absalão'),'Samaria':('Samaria','Samaria'),
'Isaac':('Isaac','Isaque'),'Ammon':('Amón','Amom'),'Jeroboam':('Jeroboam','Jeroboão'),'Edom':('Edom','Edom'),'Esau':('Esaú','Esaú'),
'Ahab':('Acab','Acabe'),'Amorite':('amorreo','amorreu'),'Jehoshaphat':('Josafat','Josafá'),'Bethlehem':('Belén','Belém'),
'Jonathan':('Jonatán','Jônatas'),'Chaldea':('Caldea','Caldeia'),'Eleazar':('Eleazar','Eleazar'),'Gad':('Gad','Gade'),
'Reuben':('Rubén','Rúben'),'Elijah':('Elías','Elias'),'Lebanon':('Líbano','Líbano'),'Dan':('Dan','Dã'),'Beersheba':('Beerseba','Berseba'),
'Abimelech':('Abimelec','Abimeleque'),'Nile':('Nilo','Nilo'),'Abner':('Abner','Abner'),'Zedekiah':('Sedequías','Zedequias'),
'Shechem':('Siquem','Siquém'),'Abram':('Abram','Abrão'),'Bashan':('Basán','Basã'),'Mordecai':('Mardoqueo','Mardoqueu'),
'Nebuchadnezzar':('Nabucodonosor','Nabucodonosor'),'Midian':('Madián','Midiã'),'Job':('Job','Jó'),'Elisha':('Eliseo','Eliseu'),
'Asa':('Asa','Asa'),'Jehu':('Jehú','Jeú'),'Daniel':('Daniel','Daniel'),'Jericho':('Jericó','Jericó'),'Esther':('Ester','Ester'),
'Haman':('Amán','Hamã'),'Josiah':('Josías','Josias'),'Zadok':('Sadoc','Zadoque'),'Naphtali':('Neftalí','Naftali'),
'Rehoboam':('Roboam','Roboão'),'Hittite':('heteo','heteu'),'Ishmael':('Ismael','Ismael'),'Rachel':('Raquel','Raquel'),
'Asaph':('Asaf','Asafe'),'Noah':('Noé','Noé'),'Zebulun':('Zabulón','Zebulom'),'Simeon':('Simeón','Simeão'),'Asher':('Aser','Aser'),
'Balak':('Balac','Balaque'),'Issachar':('Isacar','Issacar'),'Jesse':('Isaí','Jessé'),'Nathan':('Natán','Natã'),'Tyre':('Tiro','Tiro'),
'Gilgal':('Gilgal','Gilgal'),'Jebusite':('jebuseo','jebuseu'),'Ai':('Hai','Ai'),'Gideon':('Gedeón','Gideão'),'Sodom':('Sodoma','Sodoma'),
'Amalek':('Amalec','Amaleque'),'Samson':('Sansón','Sansão'),'Sarah':('Sara','Sara'),'Korah':('Coré','Corá'),'Caleb':('Caleb','Calebe'),
'Sinai':('Sinaí','Sinai'),'Leah':('Lea','Lia'),'Gath':('Gat','Gate'),'Micah':('Miqueas','Miqueias'),'Shiloh':('Silo','Siló'),
'Ahasuerus':('Asuero','Assuero'),'Rebekah':('Rebeca','Rebeca'),'Persia':('Persia','Pérsia'),'Tarshish':('Tarsis','Társis'),
'Uzziah':('Uzías','Uzias'),'Baruch':('Baruc','Baruque'),'Tamar':('Tamar','Tamar'),'Phinehas':('Finees','Fineias'),
'Eve':('Eva','Eva'),'Adam':('Adán','Adão'),'Cain':('Caín','Caim'),'Abel':('Abel','Abel'),'Seth':('Set','Sete'),'Enoch':('Enoc','Enoque'),
'Methuselah':('Matusalén','Matusalém'),'Lot':('Lot','Ló'),'Hagar':('Agar','Agar'),'Laban':('Labán','Labão'),'Dinah':('Dina','Diná'),
'Judah ':('Judá','Judá'),'Miriam':('María','Miriã'),'Joshua ':('Josué','Josué'),'Rahab':('Rahab','Raabe'),'Deborah':('Débora','Débora'),
'Ruth':('Rut','Rute'),'Naomi':('Noemí','Noemi'),'Boaz':('Booz','Boaz'),'Hannah':('Ana','Ana'),'Eli':('Elí','Eli'),'Goliath':('Goliat','Golias'),
'Bathsheba':('Betsabé','Bate-Seba'),'Uriah':('Urías','Urias'),'Jezebel':('Jezabel','Jezabel'),'Isaiah':('Isaías','Isaías'),
'Ezekiel':('Ezequiel','Ezequiel'),'Hosea':('Oseas','Oseias'),'Joel':('Joel','Joel'),'Amos':('Amós','Amós'),'Obadiah':('Abdías','Obadias'),
'Jonah':('Jonás','Jonas'),'Nahum':('Nahúm','Naum'),'Habakkuk':('Habacuc','Habacuque'),'Zephaniah':('Sofonías','Sofonias'),
'Haggai':('Hageo','Ageu'),'Zechariah':('Zacarías','Zacarias'),'Malachi':('Malaquías','Malaquias'),'Ezra':('Esdras','Esdras'),
'Nehemiah':('Nehemías','Neemias'),'Cyrus':('Ciro','Ciro'),'Darius':('Darío','Dario'),'Artaxerxes':('Artajerjes','Artaxerxes'),
'Belshazzar':('Belsasar','Belsazar'),'Shadrach':('Sadrac','Sadraque'),'Meshach':('Mesac','Mesaque'),'Abednego':('Abed-nego','Abede-Nego'),
'Zerubbabel':('Zorobabel','Zorobabel'),'Egypt':('Egipto','Egito'),'Canaan':('Canaán','Canaã'),'Hebron':('Hebrón','Hebrom'),
'Gomorrah':('Gomorra','Gomorra'),'Nineveh':('Nínive','Nínive'),'Carmel':('Carmelo','Carmelo'),'Horeb':('Horeb','Horebe'),
'Eden':('Edén','Éden'),'Goshen':('Gosén','Gósen'),'Ur':('Ur','Ur'),'Haran':('Harán','Harã'),'Damascus':('Damasco','Damasco'),
'Sidon':('Sidón','Sidom'),'Gibeon':('Gabaón','Gibeom'),'Ramah':('Ramá','Ramá'),'Mizpah':('Mizpa','Mispá'),'Jezreel':('Jezreel','Jezreel'),
'Ishmaelite':('ismaelita','ismaelita'),'Hebrew':('hebreo','hebreu'),'Jew':('judío','judeu'),'Jeshua':('Jesúa','Jesua'),
'Melchizedek':('Melquisedec','Melquisedeque'),'Balaam':('Balaam','Balaão'),'Nebat':('Nabat','Nebate'),'Jehoiakim':('Joacim','Jeoaquim'),
'Ahaz':('Acaz','Acaz'),'Joash':('Joás','Joás'),'Amaziah':('Amasías','Amazias'),'Ahaziah':('Ocozías','Acazias'),'Jehoram':('Joram','Jeorão'),
'Amnon':('Amnón','Amnom'),'Adonijah':('Adonías','Adonias'),'Ethiopian':('etíope','etíope'),'Lebanon ':('Líbano','Líbano'),
'Sheba':('Sabá','Sabá'),'Uz':('Uz','Uz'),'Hiram':('Hiram','Hirão'),'Elkanah':('Elcana','Elcana'),'Michal':('Mical','Mical'),
'Abigail':('Abigail','Abigail'),'Mephibosheth':('Mefi-boset','Mefibosete'),'Nabal':('Nabal','Nabal'),'Jethro':('Jetro','Jetro'),
'Zipporah':('Séfora','Zípora'),'Pharez':('Fares','Perez'),'Perez':('Fares','Perez'),'Tubal':('Tubal','Tubal'),'Shem':('Sem','Sem'),
'Ham':('Cam','Cam'),'Japheth':('Jafet','Jafé'),'Nimrod':('Nimrod','Ninrode'),'Terah':('Taré','Terá'),'Bilhah':('Bilha','Bila'),
'Zilpah':('Zilpa','Zilpa'),'Tabor':('Tabor','Tabor'),'Kidron':('Cedrón','Cedrom'),'Euphrates':('Éufrates','Eufrates'),
'Tigris':('Tigris','Tigre'),'Gaza':('Gaza','Gaza'),'Ashdod':('Asdod','Asdode'),'Ekron':('Ecrón','Ecrom'),'Ashkelon':('Ascalón','Asquelom'),
'Jebus':('Jebús','Jebus'),'Megiddo':('Meguido','Megido'),'Shunammite':('sunamita','sunamita'),'Naaman':('Naamán','Naamã'),
'Gehazi':('Giezi','Geazi'),'Vashti':('Vasti','Vasti'),'Hadassah':('Hadasa','Hadassa'),
# griego (Nuevo Testamento)
'Jesus':('Jesús','Jesus'),'Christ':('Cristo','Cristo'),'Peter':('Pedro','Pedro'),'Paul':('Pablo','Paulo'),'John':('Juan','João'),
'James':('Jacobo / Santiago','Tiago'),'Matthew':('Mateo','Mateus'),'Mark':('Marcos','Marcos'),'Luke':('Lucas','Lucas'),
'Andrew':('Andrés','André'),'Philip':('Felipe','Filipe'),'Thomas':('Tomás','Tomé'),'Judas':('Judas','Judas'),'Bartholomew':('Bartolomé','Bartolomeu'),
'Mary':('María','Maria'),'Martha':('Marta','Marta'),'Lazarus':('Lázaro','Lázaro'),'Nicodemus':('Nicodemo','Nicodemos'),
'Zacchaeus':('Zaqueo','Zaqueu'),'Barnabas':('Bernabé','Barnabé'),'Stephen':('Esteban','Estêvão'),'Timothy':('Timoteo','Timóteo'),
'Titus':('Tito','Tito'),'Silas':('Silas','Silas'),'Pilate':('Pilato','Pilatos'),'Herod':('Herodes','Herodes'),'Caesar':('César','César'),
'Galilee':('Galilea','Galileia'),'Nazareth':('Nazaret','Nazaré'),'Capernaum':('Capernaúm','Cafarnaum'),'Bethany':('Betania','Betânia'),
'Rome':('Roma','Roma'),'Corinth':('Corinto','Corinto'),'Ephesus':('Éfeso','Éfeso'),'Antioch':('Antioquía','Antioquia'),
'Judea':('Judea','Judeia'),'Elias':('Elías','Elias'),'Esaias':('Isaías','Isaías'),'Abraham ':('Abraham','Abraão'),
'Simon':('Simón','Simão'),'Cephas':('Cefas','Cefas'),'Satan':('Satanás','Satanás'),'Beelzebul':('Beelzebú','Belzebu'),
'Gabriel':('Gabriel','Gabriel'),'Michael':('Miguel','Miguel'),'Elizabeth':('Elisabet','Isabel'),'Zacharias':('Zacarías','Zacarias'),
'Anna':('Ana','Ana'),'Apollos':('Apolos','Apolo'),'Priscilla':('Priscila','Priscila'),'Aquila':('Aquila','Áquila'),'Lydia':('Lidia','Lídia'),
'Philemon':('Filemón','Filemom'),'Onesimus':('Onésimo','Onésimo'),'Cornelius':('Cornelio','Cornélio'),'Mark ':('Marcos','Marcos'),
'Gethsemane':('Getsemaní','Getsêmani'),'Golgotha':('Gólgota','Gólgota'),'Jordan ':('Jordán','Jordão'),'Macedonia':('Macedonia','Macedônia'),
'Philippi':('Filipos','Filipos'),'Thessalonica':('Tesalónica','Tessalônica'),'Galatia':('Galacia','Galácia'),'Athens':('Atenas','Atenas'),
'Damascus ':('Damasco','Damasco'),'Tarsus':('Tarso','Tarso'),'Samaritan':('samaritano','samaritano'),'Pharisee':('fariseo','fariseu'),
'Sadducee':('saduceo','saduceu'),'Nazarene':('nazareno','nazareno'),'Israelite':('israelita','israelita'),'Messiah':('Mesías','Messias'),
}
N={k.strip():v for k,v in N.items()}

def apply(fn,greek):
    p=os.path.join(LEX,fn);d=json.load(open(p))
    n=0
    for x in d['e']:
        if not x[3].startswith('N:'):continue
        v=N.get(x[4].strip())
        if not v:continue
        es,pt=v
        if not x[5]:x[5]=es;n+=1
        if not x[6]:x[6]=pt;n+=1
        kw=set((x[8] or '').split())
        for w in (es+' '+pt).lower().replace('/',' ').split():kw.add(w)
        x[8]=' '.join(sorted(kw))
    return d,p,n

he,hp,n1=apply('he-idx.json',False)
gr,gp,n2=apply('gr-idx.json',True)

# Jesús = Yehoshúa / Yeshúa (forma hebrea y aramea del nombre griego Ἰησοῦς)
for x in he['e']:
    if x[0] in (3091,3442,3443):
        kw=set((x[8] or '').split())|{'jesus','jesús','yeshua','yehoshua'};x[8]=' '.join(sorted(kw))

# Cristo = Mesías: Χριστός traduce el hebreo מָשִׁיחַ (ungido)
for x in he['e']:
    if x[0]==4899:
        kw=set((x[8] or '').split())|{'cristo','messias','mesías','messiah'};x[8]=' '.join(sorted(kw))

# nombres propios arameos: los que STEPBible describe como «Aramaic of …»
ar=set()
for f in glob.glob(os.path.join(LEX,'he-[0-9]*.json')):
    for k,v in json.load(open(f)).items():
        if 'Aramaic of' in (v.get('me') or ''):ar.add(int(k))
he['ar']=sorted(n for n in ar if any(x[0]==n and not x[3].startswith('A:') for x in he['e']))

for d,p in ((he,hp),(gr,gp)):
    json.dump(d,open(p,'w'),ensure_ascii=False,separators=(',',':'))
print('glosas añadidas',n1,n2,'arameos extra',len(he['ar']))
