# Sugestões de pregação por ocasião (Meu Púlpito) — parte 2: 16 ocasiões novas x 6 — esboços curtos [ES, PT] para o pastor montar a própria mensagem.
# Cada sugestão: tema, texto-base, ideia central, 3 pontos com referência de apoio e aplicação.
# Uso: python3 tools/conteudo/sugestoes-2.py          -> valida e grava tools/conteudo/sugestoes-2.json
#      python3 tools/conteudo/sugestoes-2.py --print  -> imprime o texto de cada referência nas duas Bíblias
import json,os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__))
BIB=os.path.join(HERE,'..','..','app','biblia')
PT=json.load(open(os.path.join(BIB,'pt-livre.json'),encoding='utf-8'))
ES=json.load(open(os.path.join(BIB,'es-rv1909.json'),encoding='utf-8'))

# Abreviações (só para legibilidade deste arquivo); a saída usa "livro.cap.vers" com livro 0-based.
AB='Gn Ex Lv Nm Dt Js Jz Rt 1Sm 2Sm 1Rs 2Rs 1Cr 2Cr Ed Ne Et Job Sl Pv Ec Ct Is Jr Lm Ez Dn Os Jl Am Ob Jon Mq Na Hc Sf Ag Zc Ml Mt Mc Lc Jo At Rm 1Co 2Co Gl Ef Fp Cl 1Ts 2Ts 1Tm 2Tm Tt Fm Hb Tg 1Pe 2Pe 1Jo 2Jo 3Jo Jd Ap'.split()
BK={a:i for i,a in enumerate(AB)}
def ref(s):
    m=re.fullmatch(r'(\S+) (\d+):(\d+)(?:-(\d+))?',s)
    if not m or m.group(1) not in BK:raise ValueError('ref inválida: '+s)
    b,c,v,w=BK[m.group(1)],int(m.group(2)),int(m.group(3)),m.group(4)
    return '%d.%d.%d'%(b,c,v)+('-'+w if w else '')
def verses(r):
    b,c,v=r.split('.');v1,_,v2=v.partition('-')
    b,c,v1=int(b),int(c),int(v1);v2=int(v2) if v2 else v1
    return [(b,c,x) for x in range(v1,v2+1)]
def exists(bib,b,c,v):
    return 0<=b<len(bib) and 1<=c<=len(bib[b]) and 1<=v<=len(bib[b][c-1]) and bool((bib[b][c-1][v-1] or '').strip())

OCC=[]
def O(k,nes,npt,des,dpt):
    OCC.append({'k':k,'n':[nes,npt],'d':[des,dpt],'s':[]})
def S(v,tes,tpt,ies,ipt,pts,aes,apt):
    OCC[-1]['s'].append({'t':[tes,tpt],'v':v,'i':[ies,ipt],'p':[{'t':[a,b],'v':r} for a,b,r in pts],'a':[aes,apt]})


# ---------------------------------------------------------------- Fé
O('fe','Fe que vence','Fé que vence','Mensajes para fortalecer la fe de la iglesia.','Mensagens para fortalecer a fé da igreja.')
S('Hb 11:1','¿Qué es la fe?','O que é a fé?',
  'La fe es la certeza de lo que se espera y la convicción de lo que no se ve: confiar en Dios y en su palabra antes de ver el resultado.',
  'A fé é a certeza do que se espera e a convicção do que não se vê: confiar em Deus e na sua palavra antes de ver o resultado.',
  [('Sin fe es imposible agradar a Dios','Sem fé é impossível agradar a Deus','Hb 11:6'),
   ('La fe viene por el oír la Palabra','A fé vem pelo ouvir a Palavra','Rm 10:17'),
   ('La fe se demuestra en obras','A fé se demonstra em obras','Tg 2:17-18')],
  'Invite a la iglesia a confiar en una promesa concreta de Dios esta semana y a actuar de acuerdo con ella.',
  'Convide a igreja a confiar numa promessa concreta de Deus nesta semana e a agir de acordo com ela.')
S('Mc 9:23-24','Creo; ayuda mi incredulidad','Eu creio; ajuda a minha incredulidade',
  'Un padre desesperado se acerca a Jesús con una fe débil y sincera, y Jesús no lo rechaza, sino que sana a su hijo.',
  'Um pai desesperado se aproxima de Jesus com uma fé fraca e sincera, e Jesus não o rejeita, mas cura o seu filho.',
  [('Llevar a Jesús lo que nadie pudo resolver','Levar a Jesus o que ninguém conseguiu resolver','Mc 9:17-19'),
   ('Al que cree todo le es posible','Tudo é possível ao que crê','Mc 9:23'),
   ('Una fe pequeña en un Dios grande','Uma fé pequena num Deus grande','Mt 17:20')],
  'Anime a los que se sienten débiles en la fe a ser sinceros con Dios y a seguir buscándolo.',
  'Anime os que se sentem fracos na fé a serem sinceros com Deus e a continuarem buscando-o.')
S('Gn 22:1-2','La fe probada de Abraham','A fé provada de Abraão',
  'Dios probó a Abraham pidiéndole lo más amado, y la fe de Abraham descansó en que Dios proveería.',
  'Deus provou Abraão pedindo o que ele mais amava, e a fé de Abraão descansou na certeza de que Deus proveria.',
  [('Obedecer aunque no entendamos','Obedecer mesmo sem entender','Gn 22:3'),
   ('Dios proveerá','Deus proverá','Gn 22:8'),
   ('Creer que Dios es poderoso','Crer que Deus é poderoso','Hb 11:17-19')],
  'Pregunte qué está pidiendo Dios a cada uno que entregue en sus manos y anime a confiar en su provisión.',
  'Pergunte o que Deus está pedindo a cada um que entregue nas suas mãos e anime a confiar na sua provisão.')
S('Mt 14:28-31','Caminando sobre las aguas','Andando sobre as águas',
  'Pedro caminó sobre el agua mientras miró a Jesús y se hundió cuando miró el viento; aun así, Jesús le extendió la mano.',
  'Pedro andou sobre as águas enquanto olhou para Jesus e afundou quando olhou para o vento; mesmo assim, Jesus lhe estendeu a mão.',
  [('Salir de la barca por la palabra de Jesús','Sair do barco pela palavra de Jesus','Mt 14:29'),
   ('El peligro de mirar el viento','O perigo de olhar para o vento','Mt 14:30'),
   ('La mano que nos levanta','A mão que nos levanta','Mt 14:31')],
  'Invite a fijar los ojos en Jesús en medio de las tormentas presentes.',
  'Convide a fixar os olhos em Jesus no meio das tempestades atuais.')
S('Hb 12:1-2','Los ojos puestos en Jesús','Os olhos fixos em Jesus',
  'Rodeados de una gran nube de testigos, corremos con paciencia mirando a Jesús, el autor y consumador de la fe.',
  'Rodeados de uma grande nuvem de testemunhas, corremos com perseverança olhando para Jesus, autor e consumador da fé.',
  [('Despojarse de todo peso','Livrar-se de todo peso','Hb 12:1'),
   ('Correr con paciencia','Correr com perseverança','Hb 10:36'),
   ('Mirar al que soportó la cruz','Olhar para aquele que suportou a cruz','Hb 12:3')],
  'Anime a la iglesia a identificar el peso que la detiene y entregarlo hoy.',
  'Anime a igreja a identificar o peso que a impede de avançar e entregá-lo hoje.')
S('Rm 4:20-21','Plenamente convencido','Plenamente convencido',
  'Abraham no dudó de la promesa por incredulidad, sino que se fortaleció en la fe, dando gloria a Dios.',
  'Abraão não duvidou da promessa por incredulidade, mas se fortaleceu na fé, dando glória a Deus.',
  [('Considerar la promesa más que las circunstancias','Considerar a promessa mais do que as circunstâncias','Rm 4:19'),
   ('Dar gloria a Dios antes de ver','Dar glória a Deus antes de ver','Rm 4:20'),
   ('Fiel es el que prometió','Fiel é aquele que prometeu','Hb 10:23')],
  'Invite a la iglesia a agradecer a Dios por promesas que todavía no se cumplieron.',
  'Convide a igreja a agradecer a Deus por promessas que ainda não se cumpriram.')

# ---------------------------------------------------------------- Esperança
O('esperanca','Esperanza en tiempos difíciles','Esperança em tempos difíceis','Mensajes para animar en crisis, pérdidas y desánimo.','Mensagens para animar em crises, perdas e desânimo.')
S('Lm 3:21-24','Esto traeré a mi corazón','Isto trarei à memória',
  'En medio de las ruinas, Jeremías decide recordar la misericordia y la fidelidad de Dios, y allí encuentra esperanza.',
  'No meio das ruínas, Jeremias decide lembrar a misericórdia e a fidelidade de Deus, e ali encontra esperança.',
  [('Elegir qué recordar','Escolher o que lembrar','Lm 3:21'),
   ('Misericordias nuevas cada mañana','Misericórdias novas a cada manhã','Lm 3:22-23'),
   ('Mi porción es el Señor','A minha porção é o Senhor','Lm 3:24')],
  'Anime a cada oyente a escribir tres fidelidades de Dios en su vida y recordarlas en los días difíciles.',
  'Anime cada ouvinte a escrever três fidelidades de Deus na sua vida e lembrá-las nos dias difíceis.')
S('Sl 42:5','Alma mía, espera en Dios','Por que estás abatida, ó minha alma?',
  'El salmista habla con su propia alma abatida y la dirige a esperar en Dios.',
  'O salmista fala com a sua própria alma abatida e a conduz a esperar em Deus.',
  [('Reconocer el abatimiento','Reconhecer o abatimento','Sl 42:3'),
   ('Recordar los tiempos de adoración','Lembrar os tempos de adoração','Sl 42:4'),
   ('Esperar en Dios y alabarle','Esperar em Deus e louvá-lo','Sl 42:11')],
  'Ore por los que están abatidos y anímelos a buscar ayuda en la iglesia.',
  'Ore pelos que estão abatidos e anime-os a buscar ajuda na igreja.')
S('Rm 15:13','El Dios de esperanza','O Deus de esperança',
  'Dios mismo es la fuente de la esperanza, y por el Espíritu Santo nos llena de gozo y paz en el creer.',
  'O próprio Deus é a fonte da esperança, e pelo Espírito Santo nos enche de alegria e paz no crer.',
  [('Una esperanza que viene de Dios','Uma esperança que vem de Deus','Rm 15:13'),
   ('Las Escrituras nos dan esperanza','As Escrituras nos dão esperança','Rm 15:4'),
   ('La esperanza no avergüenza','A esperança não decepciona','Rm 5:5')],
  'Termine orando para que el Espíritu Santo llene de esperanza a los desanimados.',
  'Termine orando para que o Espírito Santo encha de esperança os desanimados.')
S('Hc 3:17-19','Aunque la higuera no florezca','Ainda que a figueira não floresça',
  'Habacuc imagina un año sin cosecha ni ganado, y aun así decide alegrarse en Dios, su salvación y su fortaleza.',
  'Habacuque imagina um ano sem colheita nem gado, e mesmo assim decide alegrar-se em Deus, sua salvação e sua força.',
  [('Cuando todo falta','Quando tudo falta','Hc 3:17'),
   ('Con todo, me alegraré en Jehová','Todavia me alegrarei no Senhor','Hc 3:18'),
   ('Él da pies de ciervas','Ele dá pés como os da corça','Hc 3:19')],
  'Invite a la iglesia a adorar a Dios aun cuando las circunstancias no cambian.',
  'Convide a igreja a adorar a Deus mesmo quando as circunstâncias não mudam.')
S('Rm 8:28','Todas las cosas ayudan a bien','Todas as coisas cooperam para o bem',
  'Dios obra en todas las cosas, aun en las dolorosas, para el bien de los que le aman y cumplir su propósito.',
  'Deus age em todas as coisas, mesmo nas dolorosas, para o bem dos que o amam e para cumprir o seu propósito.',
  [('Dios obra en medio del dolor','Deus age no meio da dor','Gn 50:20'),
   ('Su propósito es hacernos como Cristo','O seu propósito é nos tornar semelhantes a Cristo','Rm 8:29'),
   ('Nada nos separará de su amor','Nada nos separará do seu amor','Rm 8:38-39')],
  'Invite a entregar a Dios las situaciones que hoy no se entienden.',
  'Convide a entregar a Deus as situações que hoje não se entendem.')
S('Is 40:28-31','Los que esperan en Jehová','Os que esperam no Senhor',
  'El Dios que no se cansa da fuerzas al cansado, y los que esperan en él renuevan sus fuerzas.',
  'O Deus que não se cansa dá força ao cansado, e os que esperam nele renovam as suas forças.',
  [('Dios no desfallece','Deus não se cansa','Is 40:28'),
   ('Él da fuerzas al cansado','Ele dá força ao cansado','Is 40:29'),
   ('Levantarán alas como las águilas','Subirão com asas como águias','Is 40:31')],
  'Ore por los cansados y anímelos a esperar en Dios con oración y Palabra.',
  'Ore pelos cansados e anime-os a esperar em Deus com oração e Palavra.')

# ---------------------------------------------------------------- Perdão
O('perdao','Perdón y reconciliación','Perdão e reconciliação','Mensajes sobre el perdón de Dios y el perdón entre hermanos.','Mensagens sobre o perdão de Deus e o perdão entre irmãos.')
S('Sl 32:1-5','Bienaventurado el perdonado','Bem-aventurado o perdoado',
  'David describe el peso del pecado escondido y la libertad que llegó cuando lo confesó a Dios.',
  'Davi descreve o peso do pecado escondido e a liberdade que veio quando o confessou a Deus.',
  [('El peso del pecado callado','O peso do pecado calado','Sl 32:3-4'),
   ('La confesión que libera','A confissão que liberta','Sl 32:5'),
   ('La alegría del perdonado','A alegria do perdoado','Sl 32:1-2')],
  'Dé un tiempo de confesión personal y anuncie con claridad el perdón que hay en Cristo.',
  'Dê um tempo de confissão pessoal e anuncie com clareza o perdão que há em Cristo.')
S('Mt 18:21-22','¿Cuántas veces perdonaré?','Quantas vezes perdoarei?',
  'Pedro preguntó si bastaba perdonar siete veces, y Jesús respondió que hasta setenta veces siete.',
  'Pedro perguntou se bastava perdoar sete vezes, e Jesus respondeu que até setenta vezes sete.',
  [('El perdón no lleva cuentas','O perdão não guarda contas','1Co 13:5'),
   ('Perdonados para perdonar','Perdoados para perdoar','Mt 18:32-33'),
   ('Perdonar de corazón','Perdoar de coração','Mt 18:35')],
  'Invite a cada uno a nombrar delante de Dios a alguien que necesita perdonar.',
  'Convide cada um a nomear diante de Deus alguém que precisa perdoar.')
S('Gn 45:4-5','José perdona a sus hermanos','José perdoa os seus irmãos',
  'José tuvo poder para vengarse, pero eligió perdonar porque vio la mano de Dios en su historia.',
  'José teve poder para se vingar, mas escolheu perdoar porque viu a mão de Deus na sua história.',
  [('Ver a Dios por encima del daño','Ver Deus acima do mal sofrido','Gn 45:7-8'),
   ('Perdonar y proveer','Perdoar e prover','Gn 50:21'),
   ('Dios lo encaminó a bien','Deus o tornou em bem','Gn 50:20')],
  'Anime a quienes cargan heridas de familia a entregarlas a Dios y dar pasos de reconciliación.',
  'Anime quem carrega feridas de família a entregá-las a Deus e dar passos de reconciliação.')
S('2Co 5:18-20','El ministerio de la reconciliación','O ministério da reconciliação',
  'Dios nos reconcilió consigo por Cristo y nos dio el ministerio de la reconciliación.',
  'Deus nos reconciliou consigo por meio de Cristo e nos deu o ministério da reconciliação.',
  [('Reconciliados con Dios','Reconciliados com Deus','Rm 5:10'),
   ('Embajadores de Cristo','Embaixadores de Cristo','2Co 5:20'),
   ('Bienaventurados los pacificadores','Bem-aventurados os pacificadores','Mt 5:9')],
  'Invite a la iglesia a ser instrumento de paz en sus familias y relaciones.',
  'Convide a igreja a ser instrumento de paz nas suas famílias e relacionamentos.')
S('Ef 4:31-32','Perdonándoos unos a otros','Perdoando-vos uns aos outros',
  'Pablo manda quitar la amargura y el enojo, y perdonar como Dios nos perdonó en Cristo.',
  'Paulo manda tirar a amargura e a ira, e perdoar como Deus nos perdoou em Cristo.',
  [('Quitar la amargura','Tirar a amargura','Hb 12:15'),
   ('Ser benignos y misericordiosos','Ser bondosos e compassivos','Ef 4:32'),
   ('Soportarse unos a otros','Suportar-se uns aos outros','Cl 3:13')],
  'Anime a la iglesia a dejar en el altar las amarguras guardadas.',
  'Anime a igreja a deixar no altar as amarguras guardadas.')
S('Lc 23:33-34','Padre, perdónalos','Pai, perdoa-lhes',
  'Desde la cruz, Jesús oró por los que lo crucificaban: el perdón más grande de la historia.',
  'Da cruz, Jesus orou pelos que o crucificavam: o maior perdão da história.',
  [('Perdón en medio del dolor','Perdão no meio da dor','Lc 23:34'),
   ('Esteban siguió el ejemplo','Estêvão seguiu o exemplo','At 7:59-60'),
   ('Orar por los que nos ofenden','Orar pelos que nos ofendem','Mt 5:44')],
  'Invite a orar por alguien que lo ha herido, como Jesús oró por sus enemigos.',
  'Convide a orar por alguém que o feriu, como Jesus orou pelos seus inimigos.')

# ---------------------------------------------------------------- Santidade
O('santidade','Santidad','Santidade','Mensajes sobre una vida apartada para Dios.','Mensagens sobre uma vida separada para Deus.')
S('1Pe 1:14-16','Sed santos','Sede santos',
  'Dios, que nos llamó, es santo, y nos llama a vivir como hijos obedientes en toda nuestra manera de vivir.',
  'Deus, que nos chamou, é santo, e nos chama a viver como filhos obedientes em todo o nosso procedimento.',
  [('No conformarse a los deseos de antes','Não se conformar com os desejos de antes','1Pe 1:14'),
   ('Santos en toda la manera de vivir','Santos em todo o procedimento','1Pe 1:15'),
   ('Rescatados a gran precio','Resgatados por alto preço','1Pe 1:18-19')],
  'Pregunte en qué área de la vida Dios está llamando a una mayor consagración.',
  'Pergunte em que área da vida Deus está chamando a uma consagração maior.')
S('Rm 12:1-2','Un sacrificio vivo','Um sacrifício vivo',
  'Por las misericordias de Dios, presentamos nuestros cuerpos en sacrificio vivo y somos transformados por la renovación de la mente.',
  'Pelas misericórdias de Deus, apresentamos o nosso corpo em sacrifício vivo e somos transformados pela renovação da mente.',
  [('La entrega del cuerpo','A entrega do corpo','1Co 6:19-20'),
   ('No conformarse al mundo','Não se conformar com o mundo','1Jo 2:15-17'),
   ('Una mente renovada','Uma mente renovada','Fp 4:8')],
  'Invite a la iglesia a un tiempo de consagración personal delante del altar.',
  'Convide a igreja a um tempo de consagração pessoal diante do altar.')
S('Sl 24:3-5','¿Quién subirá al monte de Jehová?','Quem subirá ao monte do Senhor?',
  'Para estar en la presencia de Dios se necesitan manos limpias y corazón puro, que solo él puede dar.',
  'Para estar na presença de Deus são necessárias mãos limpas e coração puro, que só ele pode dar.',
  [('Manos limpias','Mãos limpas','Tg 4:8'),
   ('Corazón puro','Coração puro','Mt 5:8'),
   ('Recibirá bendición de Jehová','Receberá a bênção do Senhor','Sl 24:5')],
  'Dé un momento de confesión y consagración antes de terminar el culto.',
  'Dê um momento de confissão e consagração antes de encerrar o culto.')
S('1Ts 4:3-4','La voluntad de Dios: vuestra santificación','A vontade de Deus: a vossa santificação',
  'Pablo enseña que la santificación incluye la pureza sexual y el dominio propio, para honra de Dios.',
  'Paulo ensina que a santificação inclui a pureza sexual e o domínio próprio, para honra de Deus.',
  [('Apartarse de la inmoralidad','Afastar-se da imoralidade','1Co 6:18'),
   ('Huir de las pasiones juveniles','Fugir das paixões da mocidade','2Tm 2:22'),
   ('Llamados a santificación','Chamados à santificação','1Ts 4:7')],
  'Trate el tema con respeto y ofrezca oración y acompañamiento a quien necesite libertad.',
  'Trate o assunto com respeito e ofereça oração e acompanhamento a quem precisa de libertação.')
S('2Co 7:1','Limpiémonos de toda contaminación','Purifiquemo-nos de toda impureza',
  'Teniendo promesas tan grandes, nos limpiamos de toda impureza, perfeccionando la santidad en el temor de Dios.',
  'Tendo promessas tão grandes, nos purificamos de toda impureza, aperfeiçoando a santidade no temor de Deus.',
  [('Las promesas que nos motivan','As promessas que nos motivam','2Co 6:16-18'),
   ('Limpieza de carne y espíritu','Purificação da carne e do espírito','Sl 51:10'),
   ('Santidad en el temor de Dios','Santidade no temor de Deus','Pv 8:13')],
  'Invite a revisar hábitos, conversaciones y lo que se mira, a la luz de la Palabra.',
  'Convide a rever hábitos, conversas e o que se assiste, à luz da Palavra.')
S('Hb 12:14','Sin santidad nadie verá al Señor','Sem santidade ninguém verá o Senhor',
  'La santidad y la paz con todos son marcas del creyente que camina hacia la presencia de Dios.',
  'A santidade e a paz com todos são marcas do crente que caminha para a presença de Deus.',
  [('Seguir la paz con todos','Seguir a paz com todos','Rm 12:18'),
   ('Seguir la santidad','Seguir a santificação','Hb 12:10'),
   ('Cuidar que nadie se aparte de la gracia','Cuidar para que ninguém se afaste da graça','Hb 12:15')],
  'Anime a la iglesia a buscar la santidad juntos, cuidándose unos a otros con amor.',
  'Anime a igreja a buscar a santidade juntos, cuidando uns dos outros com amor.')

# ---------------------------------------------------------------- Liderança
O('lideranca','Liderazgo cristiano','Liderança cristã','Mensajes para líderes, obreros y equipos de la iglesia.','Mensagens para líderes, obreiros e equipes da igreja.')
S('Mc 10:42-45','El que quiera ser grande','Quem quiser ser grande',
  'En el reino de Dios, el grande es el que sirve, siguiendo a Jesús, que vino a servir y dar su vida.',
  'No reino de Deus, o grande é aquele que serve, seguindo Jesus, que veio para servir e dar a sua vida.',
  [('No como los gobernantes del mundo','Não como os governantes do mundo','Mc 10:42'),
   ('Grande es el que sirve','Grande é o que serve','Mc 10:43-44'),
   ('El ejemplo del Hijo del Hombre','O exemplo do Filho do Homem','Jo 13:14-15')],
  'Invite a los líderes a servir de una manera concreta esta semana sin buscar reconocimiento.',
  'Convide os líderes a servir de forma concreta nesta semana sem buscar reconhecimento.')
S('Ex 18:17-21','El consejo de Jetro','O conselho de Jetro',
  'Moisés estaba agotándose solo, y Jetro le aconsejó elegir hombres capaces y repartir la carga.',
  'Moisés estava se esgotando sozinho, e Jetro o aconselhou a escolher homens capazes e dividir a carga.',
  [('El peligro de hacerlo todo solo','O perigo de fazer tudo sozinho','Ex 18:18'),
   ('Elegir personas capaces y temerosas de Dios','Escolher pessoas capazes e tementes a Deus','Ex 18:21'),
   ('Compartir la carga','Dividir a carga','Ex 18:22')],
  'Anime a los líderes a formar y confiar responsabilidades a otros.',
  'Anime os líderes a formar outros e confiar-lhes responsabilidades.')
S('1Tm 3:1-3','Un líder irreprensible','Um líder irrepreensível',
  'Pablo describe el carácter que Dios espera de quien sirve como obispo: más carácter que talento.',
  'Paulo descreve o caráter que Deus espera de quem serve como bispo: mais caráter do que talento.',
  [('Irreprensible en la vida','Irrepreensível na vida','1Tm 3:2'),
   ('Que gobierne bien su casa','Que governe bem a sua casa','1Tm 3:4-5'),
   ('Con buen testimonio de los de afuera','Com bom testemunho dos de fora','1Tm 3:7')],
  'Invite a los líderes a evaluar su carácter delante de Dios y a pedir ayuda donde sea necesario.',
  'Convide os líderes a avaliar o seu caráter diante de Deus e a pedir ajuda onde for necessário.')
S('Ne 2:17-18','Levantémonos y edifiquemos','Levantemo-nos e edifiquemos',
  'Nehemías vio la necesidad, oró, presentó la visión al pueblo y lo animó a trabajar juntos.',
  'Neemias viu a necessidade, orou, apresentou a visão ao povo e o animou a trabalhar junto.',
  [('Un líder que llora y ora','Um líder que chora e ora','Ne 1:4'),
   ('Presentar la visión con claridad','Apresentar a visão com clareza','Ne 2:17'),
   ('Perseverar ante la oposición','Perseverar diante da oposição','Ne 4:9')],
  'Comparta una necesidad concreta de la iglesia e invite a todos a sumarse al trabajo.',
  'Compartilhe uma necessidade concreta da igreja e convide todos a se unirem ao trabalho.')
S('1Pe 5:2-4','Apacentad la grey','Apascentai o rebanho',
  'Pedro exhorta a los ancianos a cuidar del rebaño voluntariamente, con ánimo pronto y siendo ejemplo.',
  'Pedro exorta os presbíteros a cuidar do rebanho de boa vontade, com prontidão e sendo exemplo.',
  [('Cuidar con voluntad, no por obligación','Cuidar de boa vontade, não por obrigação','1Pe 5:2'),
   ('Ejemplo, no señores','Exemplo, não dominadores','1Pe 5:3'),
   ('La corona del Príncipe de los pastores','A coroa do Supremo Pastor','1Pe 5:4')],
  'Ore por los pastores y líderes de la iglesia y anímelos en su servicio.',
  'Ore pelos pastores e líderes da igreja e anime-os no seu serviço.')
S('Js 1:6-9','Esfuérzate y sé valiente','Sê forte e corajoso',
  'Al dar a Josué el liderazgo de Israel, Dios le mandó ser fuerte, meditar en su Palabra y confiar en su presencia.',
  'Ao dar a Josué a liderança de Israel, Deus lhe ordenou ser forte, meditar na sua Palavra e confiar na sua presença.',
  [('Valor para la tarea','Coragem para a tarefa','Js 1:6'),
   ('Meditar en la Palabra de día y de noche','Meditar na Palavra de dia e de noite','Js 1:8'),
   ('Dios estará con nosotros','Deus estará conosco','Js 1:9')],
  'Ore por los líderes que asumen nuevas responsabilidades este año.',
  'Ore pelos líderes que assumem novas responsabilidades neste ano.')

# ---------------------------------------------------------------- Idosos
O('idosos','Tercera edad','Terceira idade','Mensajes para honrar y animar a los mayores de la iglesia.','Mensagens para honrar e animar os idosos da igreja.')
S('Sl 92:12-15','Aun en la vejez fructificarán','Na velhice ainda darão frutos',
  'El justo plantado en la casa de Jehová sigue dando fruto aun en la vejez.',
  'O justo plantado na casa do Senhor continua dando fruto mesmo na velhice.',
  [('Plantados en la casa de Dios','Plantados na casa de Deus','Sl 92:13'),
   ('Fruto en la vejez','Fruto na velhice','Sl 92:14'),
   ('Para anunciar que Jehová es recto','Para anunciar que o Senhor é reto','Sl 92:15')],
  'Honre públicamente a los mayores y anímelos a seguir sirviendo con sus dones.',
  'Honre publicamente os idosos e anime-os a continuar servindo com os seus dons.')
S('Is 46:3-4','Hasta la vejez yo mismo','Até à velhice eu serei o mesmo',
  'Dios promete llevar a su pueblo desde el vientre hasta las canas: él cargará y librará.',
  'Deus promete carregar o seu povo desde o ventre até as cãs: ele carregará e livrará.',
  [('Dios nos llevó desde el principio','Deus nos carregou desde o princípio','Is 46:3'),
   ('El mismo hasta las canas','O mesmo até as cãs','Is 46:4'),
   ('Él cargará y librará','Ele carregará e livrará','Sl 71:9')],
  'Ore por los mayores que enfrentan enfermedad o soledad y anime a la iglesia a visitarlos.',
  'Ore pelos idosos que enfrentam doença ou solidão e anime a igreja a visitá-los.')
S('Lc 2:25-30','Simeón vio la salvación','Simeão viu a salvação',
  'Simeón, hombre justo y piadoso, esperó toda la vida y finalmente tomó en brazos al niño Jesús.',
  'Simeão, homem justo e piedoso, esperou a vida toda e finalmente tomou nos braços o menino Jesus.',
  [('Una vida de espera fiel','Uma vida de espera fiel','Lc 2:25'),
   ('Guiado por el Espíritu','Guiado pelo Espírito','Lc 2:26-27'),
   ('Despedirse en paz','Partir em paz','Lc 2:29-30')],
  'Anime a los mayores a seguir esperando en Dios y bendiciendo a las nuevas generaciones.',
  'Anime os idosos a continuar esperando em Deus e abençoando as novas gerações.')
S('Sl 71:17-18','No me desampares en la vejez','Não me desampares na velhice',
  'El salmista pide a Dios no ser abandonado en la vejez, para anunciar su poder a la generación venidera.',
  'O salmista pede a Deus para não ser abandonado na velhice, para anunciar o seu poder à geração vindoura.',
  [('Enseñados desde la juventud','Ensinados desde a juventude','Sl 71:17'),
   ('Anunciar a la próxima generación','Anunciar à próxima geração','Sl 71:18'),
   ('Las canas, corona de honra','As cãs, coroa de honra','Pv 16:31')],
  'Invite a los mayores a contar su testimonio a los jóvenes en la iglesia o en casa.',
  'Convide os idosos a contar o seu testemunho aos jovens na igreja ou em casa.')
S('Js 14:10-12','Dame este monte','Dá-me este monte',
  'A los ochenta y cinco años, Caleb seguía con la misma fe y pidió la tierra que Dios le había prometido.',
  'Aos oitenta e cinco anos, Calebe continuava com a mesma fé e pediu a terra que Deus lhe tinha prometido.',
  [('Dios guardó su vida','Deus guardou a sua vida','Js 14:10'),
   ('La misma fuerza para servir','A mesma força para servir','Js 14:11'),
   ('Seguir cumplido a Jehová','Perseverar em seguir o Senhor','Js 14:14')],
  'Anime a los mayores a no retirarse del propósito de Dios mientras tengan vida.',
  'Anime os idosos a não se aposentarem do propósito de Deus enquanto tiverem vida.')
S('Lv 19:32','Honra al anciano','Honra o ancião',
  'La ley de Dios manda levantarse delante de las canas y honrar el rostro del anciano.',
  'A lei de Deus manda levantar-se diante das cãs e honrar a face do ancião.',
  [('Honrar a los mayores es temer a Dios','Honrar os idosos é temer a Deus','Lv 19:32'),
   ('Cuidar de los padres ancianos','Cuidar dos pais idosos','1Tm 5:4'),
   ('Los jóvenes aprenden de los mayores','Os jovens aprendem com os mais velhos','Tt 2:2-4')],
  'Proponga un gesto concreto de la iglesia para cuidar y honrar a sus mayores.',
  'Proponha um gesto concreto da igreja para cuidar e honrar os seus idosos.')

# ---------------------------------------------------------------- Dia do pastor
O('pastor','Día del pastor','Dia do pastor','Mensajes para honrar el ministerio pastoral y orar por los pastores.','Mensagens para honrar o ministério pastoral e orar pelos pastores.')
S('Jr 3:15','Pastores según mi corazón','Pastores segundo o meu coração',
  'Dios promete dar a su pueblo pastores según su corazón, que lo apacienten con ciencia e inteligencia.',
  'Deus promete dar ao seu povo pastores segundo o seu coração, que o apascentem com conhecimento e inteligência.',
  [('Un regalo de Dios para su pueblo','Um presente de Deus para o seu povo','Ef 4:11-12'),
   ('Pastores según el corazón de Dios','Pastores segundo o coração de Deus','Jr 3:15'),
   ('Apacentar con conocimiento','Apascentar com conhecimento','At 20:28')],
  'Ore por los pastores de la iglesia y agradezca a Dios por su vida.',
  'Ore pelos pastores da igreja e agradeça a Deus pela vida deles.')
S('Jo 10:11-14','El buen pastor','O bom pastor',
  'Jesús es el buen pastor que conoce a sus ovejas y da su vida por ellas; todo pastor humano sirve bajo él.',
  'Jesus é o bom pastor que conhece as suas ovelhas e dá a vida por elas; todo pastor humano serve sob ele.',
  [('El pastor da su vida','O pastor dá a sua vida','Jo 10:11'),
   ('No como el asalariado','Não como o mercenário','Jo 10:12-13'),
   ('Conoce a sus ovejas','Conhece as suas ovelhas','Jo 10:14')],
  'Recuerde que el pastor también es oveja del Buen Pastor y necesita cuidado y oración.',
  'Lembre que o pastor também é ovelha do Bom Pastor e precisa de cuidado e oração.')
S('1Ts 5:12-13','Reconoced a los que trabajan entre vosotros','Reconhecei os que trabalham entre vós',
  'Pablo pide a la iglesia reconocer y tener en mucha estima por amor a los que la presiden en el Señor.',
  'Paulo pede à igreja que reconheça e tenha em grande estima, por amor, os que a lideram no Senhor.',
  [('Reconocer su trabajo','Reconhecer o seu trabalho','1Ts 5:12'),
   ('Estimarlos por amor','Estimá-los por amor','1Ts 5:13'),
   ('Obedecer con gozo, no con queja','Obedecer com alegria, não com queixa','Hb 13:17')],
  'Anime a la iglesia a expresar gratitud a sus pastores con palabras y actitudes.',
  'Anime a igreja a expressar gratidão aos seus pastores com palavras e atitudes.')
S('2Tm 4:1-2','Que prediques la palabra','Que pregues a palavra',
  'Pablo encarga a Timoteo predicar la Palabra a tiempo y fuera de tiempo, con paciencia y doctrina.',
  'Paulo encarrega Timóteo de pregar a Palavra a tempo e fora de tempo, com paciência e doutrina.',
  [('Un encargo delante de Dios','Um encargo diante de Deus','2Tm 4:1'),
   ('Instar a tiempo y fuera de tiempo','Insistir a tempo e fora de tempo','2Tm 4:2'),
   ('Cumplir el ministerio','Cumprir o ministério','2Tm 4:5')],
  'Ore para que el pastor sea fortalecido en la predicación fiel de la Palabra.',
  'Ore para que o pastor seja fortalecido na pregação fiel da Palavra.')
S('Ex 17:11-12','Sosteniendo los brazos','Sustentando os braços',
  'Mientras Moisés tenía las manos alzadas, Israel vencía; Aarón y Hur sostuvieron sus brazos hasta la victoria.',
  'Enquanto Moisés mantinha as mãos levantadas, Israel vencia; Arão e Hur sustentaram os seus braços até a vitória.',
  [('También los líderes se cansan','Os líderes também se cansam','Ex 17:12'),
   ('Sostener con oración','Sustentar com oração','Ef 6:18-19'),
   ('La victoria es de todos','A vitória é de todos','Ex 17:13')],
  'Invite a la iglesia a formar un grupo de oración constante por su pastor y su familia.',
  'Convide a igreja a formar um grupo de oração constante pelo pastor e pela sua família.')
S('At 20:28','Mirad por vosotros y por el rebaño','Cuidai de vós mesmos e do rebanho',
  'Pablo pidió a los ancianos de Éfeso cuidar de sí mismos y del rebaño, comprado con la sangre de Cristo.',
  'Paulo pediu aos presbíteros de Éfeso que cuidassem de si mesmos e do rebanho, comprado com o sangue de Cristo.',
  [('Cuidar de la propia vida','Cuidar da própria vida','1Tm 4:16'),
   ('Cuidar del rebaño','Cuidar do rebanho','At 20:28'),
   ('Encomendados a Dios y a su Palabra','Encomendados a Deus e à sua Palavra','At 20:32')],
  'Ore por la salud espiritual, física y familiar de los pastores.',
  'Ore pela saúde espiritual, física e familiar dos pastores.')

# ---------------------------------------------------------------- Louvor
O('louvor','Alabanza y adoración','Louvor e adoração','Mensajes para cultos de alabanza, ministerios de música y adoración.','Mensagens para cultos de louvor, ministérios de música e adoração.')
S('Sl 100:1-5','Entrad por sus puertas con acción de gracias','Entrai pelas suas portas com ação de graças',
  'El salmo llama a toda la tierra a servir a Jehová con alegría, reconociendo quién es él.',
  'O salmo chama toda a terra a servir ao Senhor com alegria, reconhecendo quem ele é.',
  [('Servir con alegría','Servir com alegria','Sl 100:2'),
   ('Reconocer que él es Dios','Reconhecer que ele é Deus','Sl 100:3'),
   ('Porque Jehová es bueno','Porque o Senhor é bom','Sl 100:5')],
  'Abra un tiempo de alabanza espontánea dando gracias por quién es Dios.',
  'Abra um tempo de louvor espontâneo dando graças por quem Deus é.')
S('2Cr 20:21-22','Alabanza que precede la victoria','O louvor que antecede a vitória',
  'Josafat puso cantores delante del ejército, y cuando comenzaron a alabar, Jehová puso emboscadas contra los enemigos.',
  'Josafá pôs cantores à frente do exército, e quando começaram a louvar, o Senhor pôs emboscadas contra os inimigos.',
  [('Buscar a Dios ante la amenaza','Buscar a Deus diante da ameaça','2Cr 20:3-4'),
   ('Creer en sus profetas','Crer nos seus profetas','2Cr 20:20'),
   ('Alabar antes de ver la victoria','Louvar antes de ver a vitória','2Cr 20:22')],
  'Invite a la iglesia a alabar a Dios por la victoria en las luchas que todavía enfrenta.',
  'Convide a igreja a louvar a Deus pela vitória nas lutas que ainda enfrenta.')
S('Hb 13:15','Sacrificio de alabanza','Sacrifício de louvor',
  'Por medio de Cristo ofrecemos siempre a Dios sacrificio de alabanza, fruto de labios que confiesan su nombre.',
  'Por meio de Cristo oferecemos sempre a Deus sacrifício de louvor, fruto de lábios que confessam o seu nome.',
  [('Alabanza por medio de Cristo','Louvor por meio de Cristo','Hb 13:15'),
   ('Alabar siempre, no solo en los días buenos','Louvar sempre, não só nos dias bons','Sl 34:1'),
   ('Hacer el bien también es ofrenda','Fazer o bem também é oferta','Hb 13:16')],
  'Anime a la iglesia a alabar a Dios aun en medio de dificultades.',
  'Anime a igreja a louvar a Deus mesmo no meio das dificuldades.')
S('Is 6:1-4','Santo, santo, santo','Santo, santo, santo',
  'La visión de Isaías muestra el centro de la adoración: la santidad y la gloria de Dios.',
  'A visão de Isaías mostra o centro da adoração: a santidade e a glória de Deus.',
  [('Ver al Señor en su trono','Ver o Senhor no seu trono','Is 6:1'),
   ('La adoración del cielo','A adoração do céu','Ap 4:8'),
   ('Adoración que transforma','Adoração que transforma','Is 6:5-8')],
  'Lleve a la iglesia a contemplar la santidad de Dios en un tiempo de reverencia.',
  'Leve a igreja a contemplar a santidade de Deus num tempo de reverência.')
S('Cl 3:16','Cantando con gracia en vuestros corazones','Cantando com graça no coração',
  'La palabra de Cristo que mora en nosotros se expresa en salmos, himnos y cánticos espirituales.',
  'A palavra de Cristo que habita em nós se expressa em salmos, hinos e cânticos espirituais.',
  [('La Palabra en abundancia','A Palavra em abundância','Cl 3:16'),
   ('Cantar con entendimiento','Cantar com entendimento','1Co 14:15'),
   ('Edificarse unos a otros al cantar','Edificar uns aos outros ao cantar','Ef 5:19')],
  'Anime al ministerio de alabanza a elegir canciones fieles a la Palabra.',
  'Anime o ministério de louvor a escolher cânticos fiéis à Palavra.')
S('Sl 150:1-6','Todo lo que respira alabe a Jehová','Tudo o que tem fôlego louve ao Senhor',
  'El último salmo invita a alabar a Dios en todo lugar, con todo instrumento y con todo aliento.',
  'O último salmo convida a louvar a Deus em todo lugar, com todo instrumento e com todo fôlego.',
  [('Dónde alabar: en su santuario','Onde louvar: no seu santuário','Sl 150:1'),
   ('Por qué alabar: por sus proezas','Por que louvar: pelos seus feitos','Sl 150:2'),
   ('Quién alaba: todo lo que respira','Quem louva: tudo o que tem fôlego','Sl 150:6')],
  'Termine con un tiempo de alabanza de toda la iglesia.',
  'Termine com um tempo de louvor de toda a igreja.')

# ---------------------------------------------------------------- Volta de Cristo
O('volta','Segunda venida de Cristo','Volta de Cristo','Mensajes sobre la esperanza del regreso del Señor.','Mensagens sobre a esperança da volta do Senhor.')
S('Jo 14:1-3','Vendré otra vez','Virei outra vez',
  'Jesús consoló a sus discípulos con la promesa de que iría a preparar lugar y volvería para llevarlos consigo.',
  'Jesus consolou os discípulos com a promessa de que iria preparar lugar e voltaria para levá-los consigo.',
  [('No se turbe vuestro corazón','Não se turbe o vosso coração','Jo 14:1'),
   ('Un lugar preparado','Um lugar preparado','Jo 14:2'),
   ('Para que donde yo estoy, vosotros estéis','Para que onde eu estiver, estejais vós também','Jo 14:3')],
  'Anime a la iglesia a vivir con la esperanza viva del regreso de Jesús.',
  'Anime a igreja a viver com a esperança viva da volta de Jesus.')
S('1Ts 4:16-18','El Señor mismo descenderá','O próprio Senhor descerá',
  'Pablo describe la venida del Señor, la resurrección de los muertos en Cristo y el encuentro con él en el aire.',
  'Paulo descreve a vinda do Senhor, a ressurreição dos mortos em Cristo e o encontro com ele nos ares.',
  [('Los muertos en Cristo resucitarán','Os mortos em Cristo ressuscitarão','1Ts 4:16'),
   ('Estaremos siempre con el Señor','Estaremos sempre com o Senhor','1Ts 4:17'),
   ('Consolaos con estas palabras','Consolai-vos com estas palavras','1Ts 4:18')],
  'Use el mensaje para consolar a los que perdieron seres queridos en el Señor.',
  'Use a mensagem para consolar os que perderam entes queridos no Senhor.')
S('Mt 24:42-44','Velad','Vigiai',
  'Jesús enseñó que nadie sabe el día ni la hora de su venida, por eso debemos estar preparados.',
  'Jesus ensinou que ninguém sabe o dia nem a hora da sua vinda, por isso devemos estar preparados.',
  [('Nadie sabe el día ni la hora','Ninguém sabe o dia nem a hora','Mt 24:36'),
   ('Como en los días de Noé','Como nos dias de Noé','Mt 24:37-39'),
   ('Estad preparados','Estai preparados','Mt 24:44')],
  'Haga un llamado a reconciliarse con Dios hoy, sin dejar para después.',
  'Faça um apelo para se reconciliar com Deus hoje, sem deixar para depois.')
S('Tt 2:11-13','Aguardando la esperanza bienaventurada','Aguardando a bendita esperança',
  'La gracia de Dios nos enseña a vivir sobria, justa y piadosamente mientras esperamos la manifestación gloriosa de Cristo.',
  'A graça de Deus nos ensina a viver de forma sensata, justa e piedosa enquanto esperamos a manifestação gloriosa de Cristo.',
  [('La gracia que salva','A graça que salva','Tt 2:11'),
   ('La gracia que enseña a vivir','A graça que ensina a viver','Tt 2:12'),
   ('La esperanza que nos mueve','A esperança que nos move','Tt 2:13')],
  'Invite a la iglesia a revisar cómo la esperanza de la venida de Cristo afecta su vida diaria.',
  'Convide a igreja a rever como a esperança da vinda de Cristo afeta a sua vida diária.')
S('Ap 22:12-13','He aquí, yo vengo pronto','Eis que venho sem demora',
  'Al final de la Biblia, Jesús promete venir pronto con su galardón, como el Alfa y la Omega.',
  'No final da Bíblia, Jesus promete vir sem demora com o seu galardão, como o Alfa e o Ômega.',
  [('Él viene pronto','Ele vem sem demora','Ap 22:12'),
   ('Bienaventurados los que lavan sus ropas','Bem-aventurados os que lavam as suas vestes','Ap 22:14'),
   ('Amén; sí, ven, Señor Jesús','Amém; vem, Senhor Jesus','Ap 22:20')],
  'Termine con una oración de entrega y el clamor «Ven, Señor Jesús».',
  'Termine com uma oração de entrega e o clamor «Vem, Senhor Jesus».')
S('2Pe 3:10-14','Cielos nuevos y tierra nueva','Novos céus e nova terra',
  'Pedro anuncia el día del Señor y llama a vivir en santidad, esperando cielos nuevos y tierra nueva.',
  'Pedro anuncia o dia do Senhor e chama a viver em santidade, esperando novos céus e nova terra.',
  [('El día del Señor vendrá','O dia do Senhor virá','2Pe 3:10'),
   ('¿Cómo debemos vivir?','Como devemos viver?','2Pe 3:11'),
   ('Hallados en paz, sin mancha','Achados em paz, sem mácula','2Pe 3:14')],
  'Anime a la iglesia a esperar la venida del Señor con una vida santa y en paz.',
  'Anime a igreja a esperar a vinda do Senhor com uma vida santa e em paz.')

# ---------------------------------------------------------------- Batalha espiritual
O('batalha','Guerra espiritual','Batalha espiritual','Mensajes sobre la lucha espiritual y la victoria en Cristo.','Mensagens sobre a luta espiritual e a vitória em Cristo.')
S('Ef 6:10-12','Fortaleceos en el Señor','Fortalecei-vos no Senhor',
  'Nuestra lucha no es contra carne y sangre, y por eso necesitamos la fuerza del Señor y toda su armadura.',
  'A nossa luta não é contra carne e sangue, e por isso precisamos da força do Senhor e de toda a sua armadura.',
  [('Fortalecidos en su poder','Fortalecidos no seu poder','Ef 6:10'),
   ('Conocer al verdadero enemigo','Conhecer o verdadeiro inimigo','Ef 6:12'),
   ('Estar firmes','Ficar firmes','Ef 6:13')],
  'Invite a la iglesia a enfrentar sus luchas con oración y no con armas humanas.',
  'Convide a igreja a enfrentar as suas lutas com oração e não com armas humanas.')
S('Ef 6:14-17','La armadura de Dios','A armadura de Deus',
  'Pablo describe cada pieza de la armadura de Dios para resistir en el día malo.',
  'Paulo descreve cada peça da armadura de Deus para resistir no dia mau.',
  [('Verdad y justicia','Verdade e justiça','Ef 6:14'),
   ('El evangelio de la paz y el escudo de la fe','O evangelho da paz e o escudo da fé','Ef 6:15-16'),
   ('La espada del Espíritu','A espada do Espírito','Ef 6:17')],
  'Anime a cada creyente a vestirse cada día de la armadura con oración y Palabra.',
  'Anime cada crente a vestir-se todos os dias da armadura com oração e Palavra.')
S('Mt 4:1-4','Escrito está','Está escrito',
  'Jesús venció las tentaciones del diablo en el desierto respondiendo con la Palabra de Dios.',
  'Jesus venceu as tentações do diabo no deserto respondendo com a Palavra de Deus.',
  [('La tentación llega en la debilidad','A tentação chega na fraqueza','Mt 4:2-3'),
   ('No solo de pan vivirá el hombre','Nem só de pão viverá o homem','Mt 4:4'),
   ('Adorar solo a Dios','Ao Senhor teu Deus adorarás','Mt 4:10')],
  'Anime a memorizar versículos para usar en los momentos de tentación.',
  'Anime a memorizar versículos para usar nos momentos de tentação.')
S('Tg 4:7-8','Resistid al diablo','Resisti ao diabo',
  'Someterse a Dios y resistir al diablo van juntos; cuando nos acercamos a Dios, él se acerca a nosotros.',
  'Sujeitar-se a Deus e resistir ao diabo andam juntos; quando nos aproximamos de Deus, ele se aproxima de nós.',
  [('Someterse a Dios','Sujeitar-se a Deus','Tg 4:7'),
   ('Resistir firmes en la fe','Resistir firmes na fé','1Pe 5:8-9'),
   ('Acercarse a Dios','Aproximar-se de Deus','Tg 4:8')],
  'Haga un llamado a dejar prácticas que abren puertas al enemigo y a acercarse a Dios.',
  'Faça um apelo a deixar práticas que abrem portas ao inimigo e a se aproximar de Deus.')
S('2Co 10:3-5','Las armas de nuestra milicia','As armas da nossa milícia',
  'Nuestras armas no son carnales, sino poderosas en Dios para derribar fortalezas y llevar cautivo todo pensamiento a Cristo.',
  'As nossas armas não são carnais, mas poderosas em Deus para destruir fortalezas e levar cativo todo pensamento a Cristo.',
  [('No militamos según la carne','Não militamos segundo a carne','2Co 10:3'),
   ('Derribar fortalezas','Destruir fortalezas','2Co 10:4'),
   ('Pensamientos cautivos a Cristo','Pensamentos cativos a Cristo','2Co 10:5')],
  'Ayude a identificar pensamientos de mentira y a sustituirlos por la verdad de Dios.',
  'Ajude a identificar pensamentos de mentira e a substituí-los pela verdade de Deus.')
S('Cl 2:13-15','Cristo triunfó en la cruz','Cristo triunfou na cruz',
  'En la cruz Cristo canceló el acta contra nosotros y despojó a los principados, exhibiéndolos públicamente.',
  'Na cruz Cristo cancelou o escrito de dívida contra nós e despojou os principados, expondo-os publicamente.',
  [('Perdonados de todos los pecados','Perdoados de todos os pecados','Cl 2:13'),
   ('El acta clavada en la cruz','O escrito de dívida cravado na cruz','Cl 2:14'),
   ('Más que vencedores','Mais que vencedores','Rm 8:37')],
  'Anime a la iglesia a pelear desde la victoria de Cristo, no hacia ella.',
  'Anime a igreja a lutar a partir da vitória de Cristo, e não em busca dela.')

# ---------------------------------------------------------------- Unidade
O('unidade','Unidad de la iglesia','Unidade da igreja','Mensajes para fortalecer la comunión y la unidad del cuerpo de Cristo.','Mensagens para fortalecer a comunhão e a unidade do corpo de Cristo.')
S('Sl 133:1-3','Habitar juntos en armonía','Viver juntos em união',
  'La unidad de los hermanos es buena y deliciosa, y allí Dios envía bendición y vida.',
  'A união dos irmãos é boa e agradável, e ali Deus ordena a bênção e a vida.',
  [('Buena y deliciosa','Boa e agradável','Sl 133:1'),
   ('Como el aceite que desciende','Como o óleo que desce','Sl 133:2'),
   ('Allí envía Jehová bendición','Ali o Senhor ordena a bênção','Sl 133:3')],
  'Invite a la iglesia a orar por la unidad y a buscar a alguien con quien esté distanciado.',
  'Convide a igreja a orar pela unidade e a procurar alguém de quem esteja distante.')
S('Jo 17:20-23','Que todos sean uno','Que todos sejam um',
  'Jesús oró por la unidad de los que creerían, para que el mundo crea que el Padre lo envió.',
  'Jesus orou pela unidade dos que creriam, para que o mundo creia que o Pai o enviou.',
  [('Jesús oró por nosotros','Jesus orou por nós','Jo 17:20'),
   ('Uno como el Padre y el Hijo','Um como o Pai e o Filho','Jo 17:21'),
   ('La unidad que da testimonio','A unidade que dá testemunho','Jo 17:23')],
  'Recuerde que la unidad de la iglesia es parte del testimonio ante la ciudad.',
  'Lembre que a unidade da igreja faz parte do testemunho diante da cidade.')
S('Ef 4:1-3','Guardar la unidad del Espíritu','Guardar a unidade do Espírito',
  'Pablo ruega andar como es digno del llamado, con humildad, mansedumbre y paciencia, guardando la unidad.',
  'Paulo roga que andemos de modo digno do chamado, com humildade, mansidão e paciência, guardando a unidade.',
  [('Con toda humildad y mansedumbre','Com toda humildade e mansidão','Ef 4:2'),
   ('Vestidos de amor, vínculo perfecto','Revestidos de amor, vínculo da perfeição','Cl 3:14'),
   ('Un cuerpo y un Espíritu','Um corpo e um Espírito','Ef 4:4-6')],
  'Anime a cada miembro a cuidar la unidad con sus palabras y actitudes.',
  'Anime cada membro a cuidar da unidade com as suas palavras e atitudes.')
S('1Co 12:12-14','Un cuerpo, muchos miembros','Um corpo, muitos membros',
  'La iglesia es como un cuerpo: muchos miembros distintos, todos necesarios y unidos por un mismo Espíritu.',
  'A igreja é como um corpo: muitos membros diferentes, todos necessários e unidos por um mesmo Espírito.',
  [('Bautizados en un mismo cuerpo','Batizados em um só corpo','1Co 12:13'),
   ('Ningún miembro es innecesario','Nenhum membro é desnecessário','1Co 12:21-22'),
   ('Sufrir y gozarse juntos','Sofrer e alegrar-se juntos','1Co 12:26')],
  'Invite a cada uno a ocupar su lugar en el cuerpo y valorar a los demás.',
  'Convide cada um a ocupar o seu lugar no corpo e valorizar os outros.')
S('Fp 2:1-4','Sintiendo lo mismo','Tendo o mesmo sentimento',
  'Pablo pide a los filipenses tener un mismo sentir y considerar a los demás como superiores a sí mismos.',
  'Paulo pede aos filipenses que tenham o mesmo sentimento e considerem os outros superiores a si mesmos.',
  [('Un mismo amor y un mismo sentir','O mesmo amor e o mesmo sentimento','Fp 2:2'),
   ('Nada por contienda ni vanagloria','Nada por partidarismo ou vanglória','Fp 2:3'),
   ('El sentir que hubo en Cristo','O sentimento que houve em Cristo','Fp 2:5')],
  'Pida a la iglesia gestos concretos de humildad y cuidado mutuo.',
  'Peça à igreja gestos concretos de humildade e cuidado mútuo.')
S('At 2:42-47','Una iglesia unánime','Uma igreja unânime',
  'La iglesia primitiva perseveraba en la doctrina, la comunión, el partimiento del pan y las oraciones, y el Señor añadía cada día.',
  'A igreja primitiva perseverava na doutrina, na comunhão, no partir do pão e nas orações, e o Senhor acrescentava a cada dia.',
  [('Perseveraban en la doctrina','Perseveravam na doutrina','At 2:42'),
   ('Tenían todas las cosas en común','Tinham tudo em comum','At 2:44-45'),
   ('El Señor añadía cada día','O Senhor acrescentava a cada dia','At 2:47')],
  'Anime a la iglesia a vivir la comunión también fuera del templo.',
  'Anime a igreja a viver a comunhão também fora do templo.')

# ---------------------------------------------------------------- Discipulado
O('discipulado','Discipulado','Discipulado','Mensajes sobre seguir a Jesús y hacer discípulos.','Mensagens sobre seguir Jesus e fazer discípulos.')
S('Mt 28:18-20','Haced discípulos','Fazei discípulos',
  'Con toda autoridad, Jesús mandó hacer discípulos de todas las naciones, bautizarlos y enseñarles a guardar todo.',
  'Com toda a autoridade, Jesus mandou fazer discípulos de todas as nações, batizá-los e ensiná-los a guardar tudo.',
  [('Toda potestad le es dada','Toda autoridade lhe foi dada','Mt 28:18'),
   ('Hacer discípulos, no solo convertidos','Fazer discípulos, não só convertidos','Mt 28:19'),
   ('Él está con nosotros todos los días','Ele está conosco todos os dias','Mt 28:20')],
  'Invite a cada miembro a acompañar a un nuevo creyente durante este año.',
  'Convide cada membro a acompanhar um novo crente durante este ano.')
S('Lc 9:23-24','Niéguese a sí mismo','Negue-se a si mesmo',
  'Seguir a Jesús implica negarse a sí mismo, tomar la cruz cada día y seguirlo.',
  'Seguir Jesus implica negar-se a si mesmo, tomar a cruz cada dia e segui-lo.',
  [('Negarse a sí mismo','Negar-se a si mesmo','Lc 9:23'),
   ('Tomar la cruz cada día','Tomar a cruz cada dia','Gl 2:20'),
   ('Perder la vida para ganarla','Perder a vida para ganhá-la','Lc 9:24')],
  'Pregunte qué está pidiendo Jesús que cada uno deje para seguirlo mejor.',
  'Pergunte o que Jesus está pedindo que cada um deixe para segui-lo melhor.')
S('Jo 15:4-8','Permaneced en mí','Permanecei em mim',
  'El discípulo da fruto cuando permanece unido a Jesús, como la rama a la vid.',
  'O discípulo dá fruto quando permanece unido a Jesus, como o ramo à videira.',
  [('Sin mí nada podéis hacer','Sem mim nada podeis fazer','Jo 15:5'),
   ('Las palabras de Jesús en nosotros','As palavras de Jesus em nós','Jo 15:7'),
   ('Fruto que glorifica al Padre','Fruto que glorifica o Pai','Jo 15:8')],
  'Anime a establecer un tiempo diario con Dios en oración y Palabra.',
  'Anime a estabelecer um tempo diário com Deus em oração e Palavra.')
S('2Tm 2:1-2','Enseñar a otros','Ensinar a outros',
  'Pablo pide a Timoteo fortalecerse en la gracia y encargar lo aprendido a hombres fieles que enseñen también a otros.',
  'Paulo pede a Timóteo que se fortaleça na graça e confie o que aprendeu a homens fiéis que ensinem também a outros.',
  [('Esforzarse en la gracia','Fortalecer-se na graça','2Tm 2:1'),
   ('Encargar a hombres fieles','Confiar a homens fiéis','2Tm 2:2'),
   ('Sufrir como buen soldado','Sofrer como bom soldado','2Tm 2:3')],
  'Anime a los líderes a formar a otros que puedan continuar el trabajo.',
  'Anime os líderes a formar outros que possam continuar o trabalho.')
S('Lc 10:38-42','A los pies de Jesús','Aos pés de Jesus',
  'María eligió la buena parte: sentarse a los pies de Jesús y oír su palabra, mientras Marta se afanaba.',
  'Maria escolheu a boa parte: sentar-se aos pés de Jesus e ouvir a sua palavra, enquanto Marta se afadigava.',
  [('Muy ocupados para escuchar','Ocupados demais para ouvir','Lc 10:40'),
   ('Una sola cosa es necesaria','Uma só coisa é necessária','Lc 10:42'),
   ('Elegir la buena parte','Escolher a boa parte','Sl 27:4')],
  'Invite a la iglesia a revisar su agenda y apartar tiempo para estar con Jesús.',
  'Convide a igreja a rever a sua agenda e separar tempo para estar com Jesus.')
S('Tg 1:22-25','Hacedores de la Palabra','Praticantes da Palavra',
  'Santiago advierte que oír la Palabra sin practicarla es engañarse a sí mismo, como quien se mira al espejo y se olvida.',
  'Tiago adverte que ouvir a Palavra sem praticá-la é enganar a si mesmo, como quem se olha no espelho e esquece.',
  [('Oír y engañarse','Ouvir e enganar-se','Tg 1:22'),
   ('El espejo de la Palabra','O espelho da Palavra','Tg 1:23-24'),
   ('Bienaventurado en lo que hace','Bem-aventurado no que faz','Tg 1:25')],
  'Pida a cada uno una decisión práctica de obediencia para esta semana.',
  'Peça a cada um uma decisão prática de obediência para esta semana.')
# ---------------------------------------------------------------- Paixão
O('paixao','Pasión de Cristo – Viernes Santo','Paixão de Cristo – Sexta-feira Santa','Mensajes sobre la cruz, el sufrimiento y la entrega de Jesús.','Mensagens sobre a cruz, o sofrimento e a entrega de Jesus.')
S('Is 53:3-6','Varón de dolores','Homem de dores',
  'Siglos antes, Isaías describió al Siervo sufriente que cargaría nuestros dolores y sería herido por nuestras rebeliones.',
  'Séculos antes, Isaías descreveu o Servo sofredor que carregaria as nossas dores e seria ferido pelas nossas transgressões.',
  [('Despreciado y desechado','Desprezado e rejeitado','Is 53:3'),
   ('Llevó nuestras enfermedades','Levou as nossas enfermidades','Is 53:4'),
   ('Jehová cargó en él el pecado de todos','O Senhor fez cair sobre ele a iniquidade de todos','Is 53:6')],
  'Lleve a la iglesia a un tiempo de gratitud silenciosa por lo que Cristo sufrió.',
  'Leve a igreja a um tempo de gratidão silenciosa pelo que Cristo sofreu.')
S('Mt 26:36-39','Getsemaní','Getsêmani',
  'En Getsemaní Jesús oró con angustia y se sometió a la voluntad del Padre: no como yo quiero, sino como quiere el Padre.',
  'No Getsêmani Jesus orou com angústia e se submeteu à vontade do Pai: não como eu quero, mas como tu queres.',
  [('Angustia verdadera','Angústia verdadeira','Mt 26:38'),
   ('No como yo quiero','Não como eu quero','Mt 26:39'),
   ('Velad y orad','Vigiai e orai','Mt 26:41')],
  'Invite a rendir a Dios la propia voluntad en las decisiones difíciles.',
  'Convide a render a Deus a própria vontade nas decisões difíceis.')
S('Lc 23:39-43','Hoy estarás conmigo en el paraíso','Hoje estarás comigo no paraíso',
  'Uno de los malhechores reconoció su culpa y pidió a Jesús que se acordara de él, y recibió una promesa.',
  'Um dos malfeitores reconheceu a sua culpa e pediu a Jesus que se lembrasse dele, e recebeu uma promessa.',
  [('Dos respuestas ante la cruz','Duas respostas diante da cruz','Lc 23:39-40'),
   ('Acuérdate de mí','Lembra-te de mim','Lc 23:42'),
   ('Hoy, conmigo','Hoje, comigo','Lc 23:43')],
  'Haga un llamado a quienes todavía no se entregaron a Cristo: nunca es tarde para pedirle.',
  'Faça um apelo aos que ainda não se entregaram a Cristo: nunca é tarde para pedir a ele.')
S('Jo 19:25-27','El cuidado de Jesús por su madre','O cuidado de Jesus pela sua mãe',
  'Aun en la cruz, Jesús cuidó de su madre y la encomendó al discípulo amado.',
  'Mesmo na cruz, Jesus cuidou da sua mãe e a confiou ao discípulo amado.',
  [('Junto a la cruz','Junto à cruz','Jo 19:25'),
   ('El cuidado de Jesús por los suyos','O cuidado de Jesus pelos seus','Jo 19:26-27'),
   ('Una nueva familia en Cristo','Uma nova família em Cristo','Mc 3:34-35')],
  'Anime a la iglesia a cuidar unos de otros como familia, siguiendo el ejemplo de Jesús.',
  'Anime a igreja a cuidar uns dos outros como família, seguindo o exemplo de Jesus.')
S('Mc 15:33-34','El clamor desde la cruz','O clamor da cruz',
  'En las tinieblas del mediodía, Jesús clamó las palabras del Salmo 22, cargando el peso de nuestro pecado.',
  'Nas trevas do meio-dia, Jesus clamou as palavras do Salmo 22, carregando o peso do nosso pecado.',
  [('Tinieblas sobre la tierra','Trevas sobre a terra','Mc 15:33'),
   ('El clamor del Salmo 22','O clamor do Salmo 22','Sl 22:1'),
   ('Hecho pecado por nosotros','Feito pecado por nós','2Co 5:21')],
  'Ayude a la iglesia a valorar el precio que Cristo pagó para que nunca seamos desamparados.',
  'Ajude a igreja a valorizar o preço que Cristo pagou para que nunca sejamos desamparados.')
S('Jo 3:14-16','Levantado como la serpiente','Levantado como a serpente',
  'Así como Moisés levantó la serpiente en el desierto, Jesús fue levantado para que todo el que cree tenga vida eterna.',
  'Assim como Moisés levantou a serpente no deserto, Jesus foi levantado para que todo aquele que crê tenha a vida eterna.',
  [('La serpiente en el desierto','A serpente no deserto','Nm 21:8-9'),
   ('Mirar y vivir','Olhar e viver','Jo 3:14-15'),
   ('De tal manera amó Dios','Deus amou de tal maneira','Jo 3:16')],
  'Haga un llamado a mirar a Cristo con fe y recibir la vida eterna.',
  'Faça um apelo a olhar para Cristo com fé e receber a vida eterna.')

# ---------------------------------------------------------------- Consolo
O('consolo','Consuelo en las pruebas','Consolo nas provações','Mensajes para quienes atraviesan enfermedad, pérdidas o crisis.','Mensagens para quem atravessa doença, perdas ou crises.')
S('2Co 1:3-4','El Dios de toda consolación','O Deus de toda consolação',
  'Dios nos consuela en todas nuestras tribulaciones para que podamos consolar a otros.',
  'Deus nos consola em todas as nossas tribulações para que possamos consolar os outros.',
  [('Padre de misericordias','Pai de misericórdias','2Co 1:3'),
   ('Consolados en toda tribulación','Consolados em toda tribulação','2Co 1:4'),
   ('Consolar a otros','Consolar os outros','2Co 1:6')],
  'Invite a la iglesia a visitar y acompañar a quienes están sufriendo.',
  'Convide a igreja a visitar e acompanhar os que estão sofrendo.')
S('Sl 34:17-19','Cercano está Jehová a los quebrantados','Perto está o Senhor dos que têm o coração quebrantado',
  'Dios oye el clamor de los justos, está cerca de los quebrantados de corazón y los libra.',
  'Deus ouve o clamor dos justos, está perto dos que têm o coração quebrantado e os livra.',
  [('Dios oye el clamor','Deus ouve o clamor','Sl 34:17'),
   ('Cerca de los quebrantados','Perto dos quebrantados','Sl 34:18'),
   ('Muchas aflicciones, pero él libra','Muitas aflições, mas ele livra','Sl 34:19')],
  'Ore por los que están con el corazón quebrantado y ofrezca la ayuda pastoral.',
  'Ore pelos que estão com o coração quebrantado e ofereça a ajuda pastoral.')
S('Is 43:1-3','Cuando pases por las aguas','Quando passares pelas águas',
  'Dios no promete que no pasaremos por aguas y fuego, sino que él estará con nosotros.',
  'Deus não promete que não passaremos por águas e fogo, mas que ele estará conosco.',
  [('No temas: Dios nos redimió','Não temas, eu te remi','Is 43:1'),
   ('Dios estará con nosotros','Eu serei contigo','Is 43:2'),
   ('Yo soy Jehová, vuestro Dios','Eu sou o Senhor teu Deus','Is 43:3')],
  'Anime a los que pasan por pruebas a confiar en la presencia de Dios.',
  'Anime os que passam por provações a confiar na presença de Deus.')
S('Jo 11:32-35','Jesús lloró','Jesus chorou',
  'Ante la tumba de Lázaro, Jesús lloró con Marta y María, aunque sabía que lo resucitaría.',
  'Diante do túmulo de Lázaro, Jesus chorou com Marta e Maria, mesmo sabendo que o ressuscitaria.',
  [('El dolor es real','A dor é real','Jo 11:33'),
   ('Jesús se conmueve','Jesus se comove','Jo 11:35'),
   ('Yo soy la resurrección y la vida','Eu sou a ressurreição e a vida','Jo 11:25')],
  'Recuerde a los que lloran que Jesús comprende su dolor y tiene la última palabra.',
  'Lembre aos que choram que Jesus compreende a sua dor e tem a última palavra.')
S('2Co 4:16-18','No desmayamos','Não desanimamos',
  'Aunque el hombre exterior se va desgastando, el interior se renueva, porque miramos lo eterno.',
  'Ainda que o homem exterior se desgaste, o interior se renova, porque olhamos para o que é eterno.',
  [('Renovados de día en día','Renovados dia após dia','2Co 4:16'),
   ('Una tribulación momentánea y leve','Uma tribulação momentânea e leve','2Co 4:17'),
   ('Mirar lo que no se ve','Olhar para o que não se vê','2Co 4:18')],
  'Anime a los enfermos y cansados a fijar la mirada en lo eterno.',
  'Anime os doentes e cansados a fixar o olhar no que é eterno.')
S('Sl 46:1-2','Nuestro amparo y fortaleza','O nosso refúgio e fortaleza',
  'Aunque la tierra tiemble y los montes se traspasen, Dios es nuestro refugio y pronto auxilio en las tribulaciones.',
  'Ainda que a terra trema e os montes se abalem, Deus é o nosso refúgio e socorro bem presente na angústia.',
  [('Pronto auxilio en las tribulaciones','Socorro bem presente na angústia','Sl 46:1'),
   ('Por tanto, no temeremos','Portanto, não temeremos','Sl 46:2'),
   ('Estad quietos y conoced que yo soy Dios','Aquietai-vos e sabei que eu sou Deus','Sl 46:10')],
  'Ore por las familias que atraviesan enfermedad o luto.',
  'Ore pelas famílias que atravessam doença ou luto.')
# ---------------------------------------------------------------- Estudantes
O('estudantes','Estudiantes','Estudantes','Mensajes para inicio de clases, exámenes y graduaciones.','Mensagens para início das aulas, provas e formaturas.')
S('Pv 2:1-6','Si buscares la sabiduría','Se buscares a sabedoria',
  'Quien busca la sabiduría como a la plata encontrará el conocimiento de Dios, porque él da la sabiduría.',
  'Quem busca a sabedoria como a prata encontrará o conhecimento de Deus, porque ele dá a sabedoria.',
  [('Inclinar el oído y el corazón','Inclinar o ouvido e o coração','Pv 2:2'),
   ('Buscar como tesoro','Buscar como tesouro','Pv 2:4'),
   ('Jehová da la sabiduría','O Senhor dá a sabedoria','Pv 2:6')],
  'Ore por los estudiantes al comienzo del año escolar.',
  'Ore pelos estudantes no começo do ano letivo.')
S('Dn 1:17-20','Diez veces mejores','Dez vezes melhores',
  'Dios dio a Daniel y sus compañeros conocimiento e inteligencia en todas las letras y ciencias.',
  'Deus deu a Daniel e aos seus companheiros conhecimento e inteligência em todas as letras e ciências.',
  [('Fieles a Dios en una escuela extranjera','Fiéis a Deus numa escola estrangeira','Dn 1:8'),
   ('Dios dio entendimiento','Deus deu entendimento','Dn 1:17'),
   ('Excelencia que da testimonio','Excelência que dá testemunho','Dn 1:20')],
  'Anime a los estudiantes a ser excelentes y fieles a Dios en sus estudios.',
  'Anime os estudantes a serem excelentes e fiéis a Deus nos estudos.')
S('Lc 2:46-52','Jesús crecía en sabiduría','Jesus crescia em sabedoria',
  'Desde niño Jesús escuchaba y preguntaba a los maestros, y crecía en sabiduría, estatura y gracia.',
  'Desde menino Jesus ouvia e perguntava aos mestres, e crescia em sabedoria, estatura e graça.',
  [('Escuchar y preguntar','Ouvir e perguntar','Lc 2:46-47'),
   ('Sujeción a los padres','Submissão aos pais','Lc 2:51'),
   ('Crecer en todas las áreas','Crescer em todas as áreas','Lc 2:52')],
  'Invite a los estudiantes a crecer también en la gracia delante de Dios y de los hombres.',
  'Convide os estudantes a crescerem também em graça diante de Deus e dos homens.')
S('Pv 3:5-7','Fíate de Jehová','Confia no Senhor',
  'La verdadera sabiduría comienza con confiar en Dios de todo corazón y no apoyarse en la propia prudencia.',
  'A verdadeira sabedoria começa com confiar em Deus de todo o coração e não se apoiar no próprio entendimento.',
  [('Confiar de todo corazón','Confiar de todo o coração','Pv 3:5'),
   ('Reconocerlo en todos los caminos','Reconhecê-lo em todos os caminhos','Pv 3:6'),
   ('No ser sabio en la propia opinión','Não ser sábio aos próprios olhos','Pv 3:7')],
  'Ore por los estudiantes que deben elegir carrera o enfrentar exámenes importantes.',
  'Ore pelos estudantes que devem escolher uma profissão ou enfrentar provas importantes.')
S('Sl 119:9-11','El joven y la Palabra','O jovem e a Palavra',
  'El salmista pregunta cómo el joven puede guardar su camino y responde: guardándolo conforme a la Palabra de Dios.',
  'O salmista pergunta como o jovem pode guardar o seu caminho e responde: guardando-o conforme a Palavra de Deus.',
  [('Un camino limpio','Um caminho puro','Sl 119:9'),
   ('Buscar a Dios de todo corazón','Buscar a Deus de todo o coração','Sl 119:10'),
   ('La Palabra guardada en el corazón','A Palavra guardada no coração','Sl 119:11')],
  'Anime a los estudiantes a cuidar su fe en medio de nuevas ideas y presiones.',
  'Anime os estudantes a cuidar da sua fé no meio de novas ideias e pressões.')
S('Cl 2:6-8','Arraigados en Cristo','Enraizados em Cristo',
  'Pablo advierte contra filosofías vanas y anima a andar en Cristo, arraigados y confirmados en la fe.',
  'Paulo adverte contra filosofias vãs e anima a andar em Cristo, enraizados e confirmados na fé.',
  [('Andar en Cristo','Andar em Cristo','Cl 2:6'),
   ('Arraigados y sobreedificados','Enraizados e edificados','Cl 2:7'),
   ('Cuidado con las filosofías vanas','Cuidado com as filosofias vãs','Cl 2:8')],
  'Ore por los universitarios para que permanezcan firmes en la fe.',
  'Ore pelos universitários para que permaneçam firmes na fé.')

# ---------------------------------------------------------------- Palavra de Deus
O('palavra','La Palabra de Dios – Día de la Biblia','A Palavra de Deus – Dia da Bíblia','Mensajes sobre el valor, la autoridad y el poder de las Escrituras.','Mensagens sobre o valor, a autoridade e o poder das Escrituras.')
S('2Tm 3:14-17','Toda la Escritura es inspirada','Toda a Escritura é inspirada',
  'Las Escrituras, inspiradas por Dios, nos hacen sabios para la salvación y nos preparan para toda buena obra.',
  'As Escrituras, inspiradas por Deus, nos tornam sábios para a salvação e nos preparam para toda boa obra.',
  [('Aprendidas desde la niñez','Aprendidas desde a infância','2Tm 3:15'),
   ('Inspiradas por Dios','Inspiradas por Deus','2Tm 3:16'),
   ('Preparados para toda buena obra','Preparados para toda boa obra','2Tm 3:17')],
  'Anime a la iglesia a un plan de lectura bíblica diaria.',
  'Anime a igreja a um plano de leitura bíblica diária.')
S('Sl 119:105','Lámpara es a mis pies','Lâmpada para os meus pés',
  'La Palabra de Dios ilumina los pasos y el camino del creyente en la oscuridad.',
  'A Palavra de Deus ilumina os passos e o caminho do crente na escuridão.',
  [('Lámpara para el próximo paso','Lâmpada para o próximo passo','Sl 119:105'),
   ('Guardada en el corazón','Guardada no coração','Sl 119:11'),
   ('Más deseable que el oro','Mais desejável que o ouro','Sl 19:10')],
  'Invite a memorizar un versículo por semana en familia.',
  'Convide a memorizar um versículo por semana em família.')
S('Hb 4:12','Viva y eficaz','Viva e eficaz',
  'La Palabra de Dios es viva y penetrante, y discierne los pensamientos y las intenciones del corazón.',
  'A Palavra de Deus é viva e penetrante, e discerne os pensamentos e as intenções do coração.',
  [('Una palabra viva','Uma palavra viva','Hb 4:12'),
   ('Más cortante que espada','Mais cortante que espada','Ef 6:17'),
   ('Discierne el corazón','Discerne o coração','Hb 4:13')],
  'Dé un momento para que la iglesia responda a lo que Dios habló por su Palabra.',
  'Dê um momento para que a igreja responda ao que Deus falou pela sua Palavra.')
S('Is 55:10-11','No volverá a mí vacía','Não voltará para mim vazia',
  'Como la lluvia riega la tierra y la hace producir, la palabra de Dios cumple el propósito para el cual fue enviada.',
  'Como a chuva rega a terra e a faz produzir, a palavra de Deus cumpre o propósito para o qual foi enviada.',
  [('Como la lluvia y la nieve','Como a chuva e a neve','Is 55:10'),
   ('Hará lo que Dios quiere','Fará o que Deus deseja','Is 55:11'),
   ('Sembrar la Palabra con fe','Semear a Palavra com fé','Sl 126:6')],
  'Anime a compartir la Palabra con confianza, sabiendo que Dios la hace fructificar.',
  'Anime a compartilhar a Palavra com confiança, sabendo que Deus a faz frutificar.')
S('Ne 8:1-3','Leyeron en el libro de la ley','Leram no livro da lei',
  'El pueblo se reunió como un solo hombre y escuchó atentamente la lectura de la ley desde la mañana hasta el mediodía.',
  'O povo se reuniu como um só homem e ouviu atentamente a leitura da lei desde a manhã até o meio-dia.',
  [('Hambre de la Palabra','Fome da Palavra','Ne 8:1'),
   ('Leer y explicar el sentido','Ler e explicar o sentido','Ne 8:8'),
   ('El gozo del Señor es nuestra fuerza','A alegria do Senhor é a nossa força','Ne 8:10')],
  'Valore la lectura pública de la Biblia en el culto y la enseñanza clara.',
  'Valorize a leitura pública da Bíblia no culto e o ensino claro.')
S('Mt 24:35','Mis palabras no pasarán','As minhas palavras não passarão',
  'Todo en este mundo pasa, pero la palabra de Jesús permanece para siempre.',
  'Tudo neste mundo passa, mas a palavra de Jesus permanece para sempre.',
  [('El cielo y la tierra pasarán','O céu e a terra passarão','Mt 24:35'),
   ('La palabra del Señor permanece','A palavra do Senhor permanece','1Pe 1:24-25'),
   ('Edificar sobre lo que permanece','Edificar sobre o que permanece','Mt 7:24')],
  'Invite a la iglesia a basar sus decisiones en la Palabra que no cambia.',
  'Convide a igreja a basear as suas decisões na Palavra que não muda.')

# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas)\b',re.I)
KEYS='fe esperanca perdao santidade lideranca idosos pastor louvor volta batalha unidade discipulado paixao consolo estudantes palavra'.split()
OLD=json.load(open(os.path.join(HERE,'sugestoes.json'),encoding='utf-8'))['occ']
OLDB={s['v']:o['k'] for o in OLD for s in o['s']}
OLDK={o['k'] for o in OLD}
def main():
    err=[];refs=[];bases={}
    # converte e valida
    for o in OCC:
        if len(o['s'])!=6:err.append('%s: %d sugestões'%(o['k'],len(o['s'])))
        for i,s in enumerate(o['s']):
            where='%s#%d'%(o['k'],i+1)
            if len(s['p'])!=3:err.append(where+': %d pontos'%len(s['p']))
            s['v']=ref(s['v']);refs.append((where+' base',s['v']))
            bases.setdefault(s['v'],[]).append(where)
            for j,p in enumerate(s['p']):
                p['v']=ref(p['v']);refs.append((where+' p%d'%(j+1),p['v']))
            # ES: sem formas de "tú"
            es=[o['n'][0],o['d'][0],s['t'][0],s['i'][0],s['a'][0]]+[p['t'][0] for p in s['p']]
            for t in es:
                m=TU.search(t)
                if m:err.append(where+': forma de "tú" em ES: %r em %r'%(m.group(0),t))
            for t in [s['t'],s['i'],s['a']]+[p['t'] for p in s['p']]:
                if len(t)!=2 or not all(x.strip() for x in t):err.append(where+': par ES/PT incompleto')
    if [o['k'] for o in OCC]!=KEYS:err.append('ordem/chaves das ocasiões diferente do pedido')
    for w,r in refs:
        for b,c,v in verses(r):
            for nome,bib in (('PT',PT),('ES',ES)):
                if not exists(bib,b,c,v):err.append('%s: %s não existe em %s'%(w,r,nome))
    for o in OCC:
        if o['k'] in OLDK:err.append('ocasião já existe: '+o['k'])
    for r,ws in bases.items():
        if r in OLDB:err.append('texto-base já usado na parte 1 (%s): %s'%(OLDB[r],r))
        if len(ws)>1:err.append('texto-base repetido %s: %s'%(r,', '.join(ws)))
    if '--print' in sys.argv:
        for w,r in refs:
            print('==',w,r)
            for b,c,v in verses(r):
                print('  PT %d:%d %s'%(c,v,PT[b][c-1][v-1]));print('  ES %d:%d %s'%(c,v,ES[b][c-1][v-1]))
    if err:
        print('\n'.join(err));sys.exit(1)
    out=os.path.join(HERE,'sugestoes-2.json')
    json.dump({'occ':OCC},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['s']) for o in OCC)
    print('ok: %d ocasiões x 6 = %d sugestões, %d referências -> %s'%(len(OCC),n,len(refs),out))
if __name__=='__main__':main()
