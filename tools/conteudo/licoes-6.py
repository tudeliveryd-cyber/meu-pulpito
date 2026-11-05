# Lições de estudo bíblico para células e Escola Dominical (Meu Púlpito) — parte 4.
# 2 séries x 6 lições: milagres, eusou. Cada texto é um par [ES, PT].
# Cada lição: título, texto-base, objetivo, quebra-gelo, introdução (para o líder ler),
# 3 pontos com explicação e referência, perguntas de discussão, aplicação, versículo para memorizar e oração.
# Uso: python3 tools/conteudo/licoes-6.py          -> valida e grava tools/conteudo/licoes-6.json
#      python3 tools/conteudo/licoes-6.py --print  -> imprime o texto de cada referência nas duas Bíblias
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

SER=[]
def S(k,nes,npt,des,dpt):
    SER.append({'k':k,'n':[nes,npt],'d':[des,dpt],'l':[]})
def L(v,t,obj,gelo,intro,pts,perg,apl,mem,ora):
    SER[-1]['l'].append({'t':list(t),'v':v,'obj':list(obj),'gelo':list(gelo),'intro':list(intro),
        'pts':[{'t':[a,b],'x':[c,d],'v':r} for a,b,c,d,r in pts],
        'perg':[list(p) for p in perg],'apl':list(apl),'mem':mem,'or':list(ora)})





# ================================================================ Evangelismo pessoal
S('evangelismo','Evangelismo personal','Evangelismo pessoal',
  'Seis estudios prácticos para compartir el evangelio con naturalidad en la vida diaria.',
  'Seis estudos práticos para compartilhar o evangelho com naturalidade no dia a dia.')

L('Mt 28:16-20',
  ('El mandato de ir','A ordem de ir'),
  ('Entender que la Gran Comisión es para todo creyente y no solo para pastores o misioneros.',
   'Entender que a Grande Comissão é para todo crente e não só para pastores ou missionários.'),
  ('¿Quién les habló de Jesús por primera vez? ¿Cómo fue?',
   'Quem falou de Jesus para vocês pela primeira vez? Como foi?'),
  ('Antes de subir al cielo, Jesús reunió a sus discípulos en un monte de Galilea y les dio una misión: id y haced discípulos a todas las naciones. No era una sugerencia, sino un mandato del que tiene toda potestad en el cielo y en la tierra. Aquellos once hombres sencillos llevaron el evangelio por el mundo conocido. Hoy, cada creyente recibe la misma comisión. Vamos a ver en qué consiste y con qué recursos contamos para cumplirla.',
   'Antes de subir ao céu, Jesus reuniu os seus discípulos num monte da Galileia e lhes deu uma missão: ide e fazei discípulos de todas as nações. Não era uma sugestão, mas uma ordem daquele que tem toda a autoridade no céu e na terra. Aqueles onze homens simples levaram o evangelho pelo mundo conhecido. Hoje, cada crente recebe a mesma comissão. Vamos ver em que ela consiste e com que recursos contamos para cumpri-la.'),
  [('La autoridad de Jesús','A autoridade de Jesus',
    'Jesús comenzó diciendo que toda potestad le es dada en el cielo y en la tierra. No salimos a evangelizar con nuestra propia autoridad ni con nuestras fuerzas, sino en el nombre de aquel que venció la muerte. Esa verdad quita el miedo y nos da confianza para hablar.',
    'Jesus começou dizendo que toda a autoridade lhe foi dada no céu e na terra. Não saímos para evangelizar com a nossa própria autoridade nem com as nossas forças, mas em nome daquele que venceu a morte. Essa verdade tira o medo e nos dá confiança para falar.','Mt 28:18'),
   ('Hacer discípulos, no solo convertidos','Fazer discípulos, não só convertidos',
    'El mandato es hacer discípulos, bautizarlos y enseñarles a guardar todo lo que Jesús mandó. Evangelizar no termina cuando alguien levanta la mano; continúa en el acompañamiento, la enseñanza y la amistad. Cada nuevo creyente necesita alguien que camine a su lado.',
    'A ordem é fazer discípulos, batizá-los e ensiná-los a guardar tudo o que Jesus mandou. Evangelizar não termina quando alguém levanta a mão; continua no acompanhamento, no ensino e na amizade. Cada novo crente precisa de alguém que caminhe ao seu lado.','Mt 28:19-20'),
   ('Testigos con poder','Testemunhas com poder',
    'Jesús prometió que recibirían poder cuando viniera sobre ellos el Espíritu Santo y que serían sus testigos en Jerusalén, Judea, Samaria y hasta lo último de la tierra. El Espíritu nos capacita para ser testigos empezando por nuestra propia ciudad y nuestra propia casa.',
    'Jesus prometeu que receberiam poder quando o Espírito Santo descesse sobre eles e que seriam suas testemunhas em Jerusalém, na Judeia, em Samaria e até os confins da terra. O Espírito nos capacita para sermos testemunhas começando pela nossa própria cidade e pela nossa própria casa.','At 1:8')],
  [('¿Por qué muchos creyentes piensan que evangelizar es tarea de otros?',
    'Por que muitos crentes pensam que evangelizar é tarefa dos outros?'),
   ('¿Qué diferencia hay entre hacer convertidos y hacer discípulos?',
    'Que diferença há entre fazer convertidos e fazer discípulos?'),
   ('¿Cuál es nuestra «Jerusalén», el lugar donde debemos empezar?',
    'Qual é a nossa “Jerusalém”, o lugar onde devemos começar?'),
   ('¿Qué miedos nos impiden hablar de Jesús?',
    'Que medos nos impedem de falar de Jesus?')],
  ('Escriba los nombres de tres personas que no conocen a Cristo y ore por ellas cada día de esta semana.',
   'Escreva o nome de três pessoas que não conhecem Cristo e ore por elas todos os dias desta semana.'),
  'Mt 28:19',
  ('Señor Jesús, gracias porque nos envías con Tu autoridad. Llénanos de Tu Espíritu y danos valor para hacer discípulos empezando donde estamos. Amén.',
   'Senhor Jesus, obrigado porque nos envias com a tua autoridade. Enche-nos do teu Espírito e dá-nos coragem para fazer discípulos começando onde estamos. Amém.'))

L('Jo 4:7-10',
  ('Jesús y la samaritana: conversar con propósito','Jesus e a samaritana: conversar com propósito'),
  ('Aprender de Jesús a iniciar conversaciones espirituales partiendo de la vida diaria.',
   'Aprender com Jesus a iniciar conversas espirituais a partir da vida diária.'),
  ('¿Sobre qué temas conversan con facilidad con personas que no conocen?',
   'Sobre que assuntos vocês conversam com facilidade com pessoas que não conhecem?'),
  ('Jesús, cansado del camino, se sentó junto al pozo de Sicar al mediodía. Llegó una mujer samaritana a sacar agua, y él le pidió de beber. Los judíos no se trataban con los samaritanos, y un rabino no solía hablar a solas con una mujer en público. Pero Jesús rompió esas barreras y, partiendo de algo tan común como el agua, llevó la conversación a su necesidad más profunda. Hoy vamos a aprender cómo conversar con propósito.',
   'Jesus, cansado da viagem, sentou-se junto ao poço de Sicar ao meio-dia. Chegou uma mulher samaritana para tirar água, e ele lhe pediu de beber. Os judeus não se davam com os samaritanos, e um rabino não costumava falar a sós com uma mulher em público. Mas Jesus quebrou essas barreiras e, partindo de algo tão comum como a água, levou a conversa à sua necessidade mais profunda. Hoje vamos aprender a conversar com propósito.'),
  [('Romper barreras','Quebrar barreiras',
    'La mujer se sorprendió de que un judío le pidiera agua a una samaritana. Jesús no dejó que los prejuicios de su tiempo le impidieran acercarse. El evangelio cruza barreras de cultura, clase y pasado. Para evangelizar necesitamos acercarnos a personas diferentes de nosotros.',
    'A mulher se surpreendeu de que um judeu pedisse água a uma samaritana. Jesus não deixou que os preconceitos do seu tempo o impedissem de se aproximar. O evangelho atravessa barreiras de cultura, classe e passado. Para evangelizar precisamos nos aproximar de pessoas diferentes de nós.','Jo 4:9'),
   ('Del agua al agua viva','Da água à água viva',
    'Jesús usó la sed física para hablar de una sed más profunda: el que bebiere del agua que yo le daré, no tendrá sed jamás. Partió de lo cotidiano para llegar a lo eterno. Las conversaciones sobre trabajo, familia o preocupaciones pueden abrir puertas para hablar de Jesús.',
    'Jesus usou a sede física para falar de uma sede mais profunda: quem beber da água que eu lhe der nunca mais terá sede. Partiu do cotidiano para chegar ao eterno. As conversas sobre trabalho, família ou preocupações podem abrir portas para falar de Jesus.','Jo 4:13-14'),
   ('Una testigo inmediata','Uma testemunha imediata',
    'La mujer dejó su cántaro, fue a la ciudad y dijo: venid, ved a un hombre que me ha dicho todo cuanto he hecho. No tenía formación teológica, pero contó lo que vivió. Muchos samaritanos creyeron por su testimonio. No hace falta saberlo todo para invitar a otros a conocer a Jesús.',
    'A mulher deixou o seu cântaro, foi à cidade e disse: vinde ver um homem que me disse tudo o que eu fiz. Não tinha formação teológica, mas contou o que viveu. Muitos samaritanos creram pelo seu testemunho. Não é preciso saber tudo para convidar outros a conhecer Jesus.','Jo 4:28-30')],
  [('¿Qué barreras nos separan hoy de ciertas personas?',
    'Que barreiras nos separam hoje de certas pessoas?'),
   ('¿Cómo pasar de una conversación común a una conversación espiritual sin forzar?',
    'Como passar de uma conversa comum para uma conversa espiritual sem forçar?'),
   ('¿Qué «sed» perciben en las personas de su alrededor?',
    'Que “sede” vocês percebem nas pessoas ao seu redor?'),
   ('¿Por qué un testimonio sencillo puede ser tan poderoso?',
    'Por que um testemunho simples pode ser tão poderoso?')],
  ('Inicie esta semana una conversación con alguien nuevo y escuche con atención sus necesidades.',
   'Inicie nesta semana uma conversa com alguém novo e ouça com atenção as suas necessidades.'),
  'Jo 4:14',
  ('Señor Jesús, enséñanos a acercarnos a las personas como Tú lo hiciste. Abre puertas en nuestras conversaciones para hablar de Tu agua viva. Amén.',
   'Senhor Jesus, ensina-nos a nos aproximar das pessoas como tu fizeste. Abre portas nas nossas conversas para falar da tua água viva. Amém.'))

L('Mc 5:18-20',
  ('Contar lo que Dios hizo','Contar o que Deus fez'),
  ('Descubrir el valor del testimonio personal como herramienta sencilla de evangelismo.',
   'Descobrir o valor do testemunho pessoal como ferramenta simples de evangelismo.'),
  ('¿Cuál es la mejor noticia que alguna vez tuvieron ganas de contar a todos?',
   'Qual foi a melhor notícia que vocês já tiveram vontade de contar para todo mundo?'),
  ('En la región de los gadarenos vivía un hombre atormentado por muchos demonios, que habitaba entre los sepulcros y se hería con piedras. Jesús lo libertó, y la gente lo encontró sentado, vestido y en su juicio cabal. Cuando Jesús se iba, el hombre le rogó que lo dejara ir con él. Pero Jesús le dio otra misión: volver a su casa y contar lo que el Señor había hecho. Hoy vamos a ver el poder de un testimonio sencillo.',
   'Na região dos gadarenos vivia um homem atormentado por muitos demônios, que morava entre os sepulcros e se feria com pedras. Jesus o libertou, e o povo o encontrou sentado, vestido e em perfeito juízo. Quando Jesus estava indo embora, o homem lhe pediu para ir com ele. Mas Jesus lhe deu outra missão: voltar para casa e contar o que o Senhor tinha feito. Hoje vamos ver o poder de um testemunho simples.'),
  [('Una vida transformada es un mensaje','Uma vida transformada é uma mensagem',
    'La gente conocía bien a este hombre y su condición. Cuando lo vieron sentado, vestido y en su juicio, el cambio habló más que mil palabras. Nuestra vida transformada es el primer mensaje que otros leen. El testimonio comienza con lo que la gente ve en nosotros.',
    'O povo conhecia bem aquele homem e a sua condição. Quando o viram sentado, vestido e em perfeito juízo, a mudança falou mais do que mil palavras. A nossa vida transformada é a primeira mensagem que os outros leem. O testemunho começa com o que as pessoas veem em nós.','Mc 5:15'),
   ('Empezar por casa','Começar por casa',
    'Jesús le dijo: «vete a tu casa, a los tuyos, y cuéntales cuán grandes cosas el Señor ha hecho contigo». No lo envió primero a un lugar lejano, sino a su familia y conocidos. El evangelismo personal empieza con las personas que ya forman parte de nuestra vida.',
    'Jesus lhe disse: vai para a tua casa, para os teus, e conta-lhes quão grandes coisas o Senhor te fez. Não o enviou primeiro a um lugar distante, mas à sua família e aos seus conhecidos. O evangelismo pessoal começa com as pessoas que já fazem parte da nossa vida.','Mc 5:19'),
   ('Antes, ahora y cómo','Antes, agora e como',
    'Pablo contaba su testimonio de manera sencilla: cómo vivía antes, cómo encontró a Jesús y cómo es su vida ahora. Un buen testimonio es breve, verdadero y centrado en Cristo, no en nosotros. Todos tenemos una historia que contar sobre la gracia de Dios.',
    'Paulo contava o seu testemunho de forma simples: como vivia antes, como encontrou Jesus e como é a sua vida agora. Um bom testemunho é breve, verdadeiro e centrado em Cristo, não em nós. Todos temos uma história para contar sobre a graça de Deus.','At 26:9-11')],
  [('¿Qué cambios hizo Jesús en su vida que otros pueden notar?',
    'Que mudanças Jesus fez na sua vida que os outros podem notar?'),
   ('¿Por qué a veces es más difícil hablar de Jesús con la propia familia?',
    'Por que às vezes é mais difícil falar de Jesus com a própria família?'),
   ('¿Cómo resumirían su testimonio en tres minutos?',
    'Como vocês resumiriam o seu testemunho em três minutos?'),
   ('¿Qué errores debemos evitar al contar nuestro testimonio?',
    'Que erros devemos evitar ao contar o nosso testemunho?')],
  ('Escriba su testimonio en tres partes (antes, cómo conoció a Jesús, ahora) y compártalo con alguien esta semana.',
   'Escreva o seu testemunho em três partes (antes, como conheceu Jesus, agora) e compartilhe com alguém nesta semana.'),
  'Mc 5:19',
  ('Señor, gracias por todo lo que hiciste en nuestra vida. Danos valor y sencillez para contar a los nuestros las grandes cosas que Tú hiciste. Amén.',
   'Senhor, obrigado por tudo o que fizeste na nossa vida. Dá-nos coragem e simplicidade para contar aos nossos as grandes coisas que tu fizeste. Amém.'))

L('Rm 10:13-15',
  ('El mensaje que salva','A mensagem que salva'),
  ('Conocer los puntos centrales del evangelio para poder explicarlo con claridad.',
   'Conhecer os pontos centrais do evangelho para poder explicá-lo com clareza.'),
  ('Si alguien les preguntara hoy qué es el evangelio, ¿qué dirían en un minuto?',
   'Se alguém perguntasse hoje o que é o evangelho, o que vocês diriam em um minuto?'),
  ('Pablo escribe a los romanos que todo aquel que invocare el nombre del Señor será salvo. Pero luego hace una serie de preguntas: ¿cómo invocarán a aquel en el cual no han creído? ¿Y cómo creerán en aquel de quien no han oído? ¿Y cómo oirán sin haber quien les predique? La salvación es por fe, y la fe viene por el oír la palabra de Dios. Hoy vamos a repasar los puntos centrales del mensaje que tenemos el privilegio de anunciar.',
   'Paulo escreve aos romanos que todo aquele que invocar o nome do Senhor será salvo. Mas depois faz uma série de perguntas: como invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram falar? E como ouvirão se não houver quem pregue? A salvação é pela fé, e a fé vem pelo ouvir a palavra de Deus. Hoje vamos repassar os pontos centrais da mensagem que temos o privilégio de anunciar.'),
  [('Todos pecaron','Todos pecaram',
    'Pablo dice que todos pecaron y están destituidos de la gloria de Dios, y que la paga del pecado es muerte. El evangelio comienza con una mala noticia necesaria: no podemos salvarnos solos. Nadie busca un médico si no reconoce que está enfermo.',
    'Paulo diz que todos pecaram e estão destituídos da glória de Deus, e que o salário do pecado é a morte. O evangelho começa com uma má notícia necessária: não podemos nos salvar sozinhos. Ninguém procura um médico se não reconhece que está doente.','Rm 3:23'),
   ('Cristo murió por nosotros','Cristo morreu por nós',
    'La buena noticia es que Dios muestra su amor para con nosotros en que, siendo aún pecadores, Cristo murió por nosotros. Jesús pagó el precio que nosotros debíamos y resucitó al tercer día. La salvación es un regalo de la gracia de Dios, no un premio por nuestras obras.',
    'A boa notícia é que Deus prova o seu amor para conosco em que Cristo morreu por nós quando ainda éramos pecadores. Jesus pagou o preço que nós devíamos e ressuscitou ao terceiro dia. A salvação é um presente da graça de Deus, não um prêmio pelas nossas obras.','Rm 5:8'),
   ('Confesar y creer','Confessar e crer',
    'Pablo explica que si confesamos con la boca que Jesús es el Señor y creemos en el corazón que Dios le levantó de los muertos, seremos salvos. La respuesta al evangelio es arrepentirse, creer y entregar la vida a Jesús como Señor. Debemos invitar a las personas a dar ese paso.',
    'Paulo explica que, se confessarmos com a boca que Jesus é o Senhor e crermos no coração que Deus o ressuscitou dos mortos, seremos salvos. A resposta ao evangelho é arrepender-se, crer e entregar a vida a Jesus como Senhor. Devemos convidar as pessoas a dar esse passo.','Rm 10:9-10')],
  [('¿Por qué es importante hablar del pecado al presentar el evangelio?',
    'Por que é importante falar do pecado ao apresentar o evangelho?'),
   ('¿Cómo explicarían la gracia a alguien que nunca escuchó esa palabra?',
    'Como vocês explicariam a graça para alguém que nunca ouviu essa palavra?'),
   ('¿Qué significa confesar a Jesús como Señor?',
    'O que significa confessar Jesus como Senhor?'),
   ('¿Qué versículos podrían memorizar para explicar el evangelio?',
    'Que versículos vocês poderiam memorizar para explicar o evangelho?')],
  ('Memorice Romanos 3:23, 6:23, 5:8 y 10:9 y practique explicarlos con un hermano del grupo.',
   'Memorize Romanos 3:23, 6:23, 5:8 e 10:9 e pratique explicá-los com um irmão do grupo.'),
  'Rm 6:23',
  ('Padre, gracias por el regalo de la salvación en Cristo. Ayúdanos a conocer bien el evangelio y a anunciarlo con claridad y amor a los que aún no lo oyeron. Amén.',
   'Pai, obrigado pelo presente da salvação em Cristo. Ajuda-nos a conhecer bem o evangelho e a anunciá-lo com clareza e amor aos que ainda não ouviram. Amém.'))

L('At 8:30-35',
  ('Felipe y el etíope: guiados por el Espíritu','Filipe e o etíope: guiados pelo Espírito'),
  ('Aprender a ser sensibles a la guía del Espíritu y a explicar las Escrituras partiendo de las preguntas de las personas.',
   'Aprender a ser sensíveis à direção do Espírito e a explicar as Escrituras a partir das perguntas das pessoas.'),
  ('¿Alguna vez sintieron un impulso fuerte de hablar con alguien y después entendieron por qué?',
   'Vocês já sentiram um impulso forte de falar com alguém e depois entenderam por quê?'),
  ('Felipe estaba en medio de un avivamiento en Samaria cuando un ángel le dijo que fuera al camino desierto que baja de Jerusalén a Gaza. Allí pasaba un funcionario etíope, tesorero de la reina Candace, que volvía de adorar y leía al profeta Isaías en su carro. El Espíritu dijo a Felipe que se acercara. Felipe corrió y le preguntó: ¿entiendes lo que lees? Hoy vamos a ver cómo el Espíritu prepara encuentros y cómo debemos aprovecharlos.',
   'Filipe estava no meio de um avivamento em Samaria quando um anjo lhe disse para ir ao caminho deserto que desce de Jerusalém a Gaza. Ali passava um funcionário etíope, tesoureiro da rainha Candace, que voltava de adorar e lia o profeta Isaías na sua carruagem. O Espírito disse a Filipe que se aproximasse. Filipe correu e lhe perguntou: entendes o que lês? Hoje vamos ver como o Espírito prepara encontros e como devemos aproveitá-los.'),
  [('Obediencia a la guía de Dios','Obediência à direção de Deus',
    'Felipe dejó un lugar de mucho fruto para ir a un camino desierto, sin saber por qué. Obedeció de inmediato y llegó en el momento exacto. Dios prepara personas y nos envía a ellas. Debemos estar atentos y disponibles a la guía del Espíritu en nuestro día a día.',
    'Filipe deixou um lugar de muito fruto para ir a um caminho deserto, sem saber por quê. Obedeceu imediatamente e chegou no momento exato. Deus prepara pessoas e nos envia a elas. Devemos estar atentos e disponíveis à direção do Espírito no nosso dia a dia.','At 8:26-29'),
   ('Escuchar antes de hablar','Ouvir antes de falar',
    'Felipe no comenzó con un sermón, sino con una pregunta sobre lo que el etíope leía. El hombre respondió: ¿cómo podré, si alguno no me enseñare? Las preguntas sinceras abren el corazón. Escuchar las dudas de las personas nos muestra por dónde empezar a hablar.',
    'Filipe não começou com um sermão, mas com uma pergunta sobre o que o etíope lia. O homem respondeu: como poderei entender, se alguém não me ensinar? As perguntas sinceras abrem o coração. Ouvir as dúvidas das pessoas nos mostra por onde começar a falar.','At 8:30-31'),
   ('De la Escritura a Jesús','Da Escritura a Jesus',
    'El etíope leía Isaías 53. Felipe, comenzando desde esa escritura, le anunció el evangelio de Jesús. Toda la Biblia apunta a Cristo. Al llegar a agua, el etíope pidió ser bautizado y siguió su camino gozoso. Conocer la Palabra nos ayuda a llevar a las personas a Jesús.',
    'O etíope lia Isaías 53. Filipe, começando por essa escritura, lhe anunciou o evangelho de Jesus. Toda a Bíblia aponta para Cristo. Ao chegarem a um lugar com água, o etíope pediu para ser batizado e seguiu o seu caminho cheio de alegria. Conhecer a Palavra nos ajuda a levar as pessoas a Jesus.','At 8:35-39')],
  [('¿Cómo podemos estar más atentos a la guía del Espíritu en la rutina?',
    'Como podemos estar mais atentos à direção do Espírito na rotina?'),
   ('¿Por qué hacer preguntas puede ser mejor que dar un discurso?',
    'Por que fazer perguntas pode ser melhor do que fazer um discurso?'),
   ('¿Qué pasajes bíblicos usarían para presentar a Jesús?',
    'Que passagens bíblicas vocês usariam para apresentar Jesus?'),
   ('¿Por qué es importante dar el siguiente paso, como el bautismo, con quien cree?',
    'Por que é importante dar o próximo passo, como o batismo, com quem crê?')],
  ('Comience cada día de esta semana pidiendo a Dios que le muestre a una persona con quien hablar, y esté atento.',
   'Comece cada dia desta semana pedindo a Deus que lhe mostre uma pessoa com quem falar, e fique atento.'),
  'At 8:35',
  ('Espíritu Santo, haznos sensibles a Tu voz. Guíanos a las personas que Tú preparaste y danos sabiduría para llevarlas de la Palabra a Jesús. Amén.',
   'Espírito Santo, torna-nos sensíveis à tua voz. Guia-nos às pessoas que tu preparaste e dá-nos sabedoria para levá-las da Palavra a Jesus. Amém.'))

L('1Pe 3:15-16',
  ('Responder con mansedumbre','Responder com mansidão'),
  ('Prepararse para responder a preguntas y objeciones sobre la fe con respeto y buen testimonio.',
   'Preparar-se para responder a perguntas e objeções sobre a fé com respeito e bom testemunho.'),
  ('¿Qué preguntas sobre la fe les han hecho que no supieron responder?',
   'Que perguntas sobre a fé já fizeram a vocês que não souberam responder?'),
  ('Pedro escribió a creyentes que sufrían críticas y persecución por su fe. En lugar de animarlos a esconderse o a responder con enojo, les dijo que estuvieran siempre preparados para presentar defensa ante todo el que les demandara razón de la esperanza que hay en ellos. Pero añadió algo importante: con mansedumbre y reverencia, y con buena conciencia. Hoy vamos a ver cómo responder a las preguntas difíciles sin perder el amor ni el testimonio.',
   'Pedro escreveu a crentes que sofriam críticas e perseguição por causa da sua fé. Em vez de animá-los a se esconder ou a responder com raiva, disse-lhes que estivessem sempre preparados para responder a todo aquele que lhes pedisse a razão da esperança que há neles. Mas acrescentou algo importante: com mansidão e temor, e com boa consciência. Hoje vamos ver como responder às perguntas difíceis sem perder o amor nem o testemunho.'),
  [('Cristo como Señor en el corazón','Cristo como Senhor no coração',
    'Antes de hablar de respuestas, Pedro dice: santificad a Dios el Señor en vuestros corazones. La mejor defensa de la fe nace de una vida rendida a Cristo. Si él no es Señor en nuestro corazón, nuestras palabras pierden fuerza, por más correctas que sean.',
    'Antes de falar de respostas, Pedro diz: santificai a Cristo, como Senhor, no vosso coração. A melhor defesa da fé nasce de uma vida rendida a Cristo. Se ele não é Senhor no nosso coração, as nossas palavras perdem força, por mais corretas que sejam.','1Pe 3:15'),
   ('Preparados para explicar','Preparados para explicar',
    'Pablo dice que nuestra palabra sea siempre con gracia, sazonada con sal, para que sepamos cómo debemos responder a cada uno. Estudiar la Biblia y conocer bien lo que creemos nos ayuda a responder. No necesitamos ganar discusiones, sino dar razones con claridad y gracia.',
    'Paulo diz que a nossa palavra seja sempre agradável, temperada com sal, para que saibamos como devemos responder a cada um. Estudar a Bíblia e conhecer bem aquilo em que cremos nos ajuda a responder. Não precisamos vencer discussões, mas dar razões com clareza e graça.','Cl 4:5-6'),
   ('Mansedumbre y buena conducta','Mansidão e bom comportamento',
    'Pedro insiste en responder con mansedumbre y reverencia, para que los que critican nuestra buena conducta en Cristo sean avergonzados. El tono importa tanto como el contenido. Una respuesta orgullosa o agresiva puede cerrar una puerta que la mansedumbre habría abierto.',
    'Pedro insiste em responder com mansidão e temor, para que os que criticam o nosso bom comportamento em Cristo fiquem envergonhados. O tom importa tanto quanto o conteúdo. Uma resposta orgulhosa ou agressiva pode fechar uma porta que a mansidão teria aberto.','1Pe 3:16')],
  [('¿Cuáles son las objeciones a la fe que más escuchan hoy?',
    'Quais são as objeções à fé que vocês mais ouvem hoje?'),
   ('¿Cómo responder cuando no sabemos la respuesta a una pregunta?',
    'Como responder quando não sabemos a resposta a uma pergunta?'),
   ('¿Por qué la mansedumbre es tan importante al defender la fe?',
    'Por que a mansidão é tão importante ao defender a fé?'),
   ('¿Cómo puede nuestra conducta confirmar o contradecir lo que decimos?',
    'Como o nosso comportamento pode confirmar ou contradizer o que dizemos?')],
  ('Elija una pregunta difícil sobre la fe, estúdiela en la Biblia esta semana y traiga una respuesta sencilla al grupo.',
   'Escolha uma pergunta difícil sobre a fé, estude-a na Bíblia nesta semana e traga uma resposta simples para o grupo.'),
  '1Pe 3:15',
  ('Señor, sé Tú el Señor de nuestro corazón. Prepáranos para dar razón de nuestra esperanza con gracia, mansedumbre y una vida que confirme lo que decimos. Amén.',
   'Senhor, sê tu o Senhor do nosso coração. Prepara-nos para dar a razão da nossa esperança com graça, mansidão e uma vida que confirme o que dizemos. Amém.'))

# ================================================================ Finanças e mordomia
S('financas','Finanzas y mayordomía','Finanças e mordomia',
  'Seis estudios sobre cómo administrar el dinero y los bienes según los principios de la Palabra.',
  'Seis estudos sobre como administrar o dinheiro e os bens segundo os princípios da Palavra.')

L('Sl 24:1-2',
  ('Todo es de Dios','Tudo é de Deus'),
  ('Entender que somos administradores, y no dueños, de todo lo que tenemos.',
   'Entender que somos administradores, e não donos, de tudo o que temos.'),
  ('¿Alguna vez cuidaron algo que no era de ustedes, como una casa o un auto prestado?',
   'Vocês já cuidaram de algo que não era seu, como uma casa ou um carro emprestado?'),
  ('El salmista declara: de Jehová es la tierra y su plenitud; el mundo y los que en él habitan. Esa verdad cambia la manera de ver el dinero y los bienes. Si todo es de Dios, nosotros somos mayordomos, es decir, administradores de lo que él nos confió. En tiempos de Jesús, el mayordomo cuidaba los bienes de su señor y un día rendía cuentas. Hoy vamos a ver qué significa vivir como administradores fieles de lo que Dios nos dio.',
   'O salmista declara: ao Senhor pertence a terra e tudo o que nela se contém; o mundo e os que nele habitam. Essa verdade muda a maneira de ver o dinheiro e os bens. Se tudo é de Deus, nós somos mordomos, isto é, administradores daquilo que ele nos confiou. No tempo de Jesus, o mordomo cuidava dos bens do seu senhor e um dia prestava contas. Hoje vamos ver o que significa viver como administradores fiéis do que Deus nos deu.'),
  [('Dios es el dueño','Deus é o dono',
    'David reconoció ante el pueblo que las riquezas y la gloria proceden de Dios, y que todo lo que ofrecían ya era de él. Cuando entendemos que Dios es el dueño, el dinero deja de ser nuestro señor y se convierte en una herramienta que usamos según su voluntad.',
    'Davi reconheceu diante do povo que as riquezas e a glória vêm de Deus, e que tudo o que ofereciam já pertencia a ele. Quando entendemos que Deus é o dono, o dinheiro deixa de ser o nosso senhor e se torna uma ferramenta que usamos segundo a sua vontade.','1Cr 29:11-12'),
   ('Fieles en lo poco','Fiéis no pouco',
    'Jesús enseñó que el que es fiel en lo muy poco, también en lo más es fiel. La manera en que administramos pequeñas cantidades revela nuestro carácter. Dios observa nuestra fidelidad con lo que tenemos hoy, y no con lo que soñamos tener algún día.',
    'Jesus ensinou que quem é fiel no mínimo também é fiel no muito. A maneira como administramos pequenas quantias revela o nosso caráter. Deus observa a nossa fidelidade com o que temos hoje, e não com o que sonhamos ter um dia.','Lc 16:10-11'),
   ('Rendiremos cuentas','Prestaremos contas',
    'En la parábola de los talentos, el señor volvió y pidió cuentas a cada siervo. Los que trabajaron con lo recibido oyeron: bien, buen siervo y fiel. Un día daremos cuenta a Dios de cómo usamos nuestros recursos. Esa perspectiva nos ayuda a decidir mejor hoy.',
    'Na parábola dos talentos, o senhor voltou e pediu contas a cada servo. Os que trabalharam com o que receberam ouviram: muito bem, servo bom e fiel. Um dia prestaremos contas a Deus de como usamos os nossos recursos. Essa perspectiva nos ajuda a decidir melhor hoje.','Mt 25:19-21')],
  [('¿Qué cambia en nuestras decisiones si creemos que todo es de Dios?',
    'O que muda nas nossas decisões se cremos que tudo é de Deus?'),
   ('¿Por qué la fidelidad en lo poco es tan importante?',
    'Por que a fidelidade no pouco é tão importante?'),
   ('¿Cómo se nota que el dinero se ha convertido en señor de alguien?',
    'Como se percebe que o dinheiro se tornou o senhor de alguém?'),
   ('¿Qué recursos, además del dinero, Dios nos confió para administrar?',
    'Que recursos, além do dinheiro, Deus nos confiou para administrar?')],
  ('Haga una lista de lo que Dios le confió (tiempo, bienes, dinero, talentos) y ore entregándolo a él.',
   'Faça uma lista do que Deus lhe confiou (tempo, bens, dinheiro, talentos) e ore entregando tudo a ele.'),
  'Sl 24:1',
  ('Señor, reconocemos que todo lo que tenemos es Tuyo. Haznos administradores fieles en lo poco y en lo mucho, para que un día oigamos Tu aprobación. Amén.',
   'Senhor, reconhecemos que tudo o que temos é teu. Faze de nós administradores fiéis no pouco e no muito, para que um dia ouçamos a tua aprovação. Amém.'))

L('Ml 3:8-10',
  ('Diezmos y ofrendas','Dízimos e ofertas'),
  ('Comprender la enseñanza bíblica sobre diezmos y ofrendas como expresión de gratitud y confianza.',
   'Compreender o ensino bíblico sobre dízimos e ofertas como expressão de gratidão e confiança.'),
  ('¿Qué sienten cuando alguien les da un regalo con alegría?',
   'O que vocês sentem quando alguém lhes dá um presente com alegria?'),
  ('En tiempos del profeta Malaquías, el pueblo había regresado del exilio, pero se había enfriado espiritualmente. Los sacerdotes ofrecían animales defectuosos y el pueblo había dejado de traer los diezmos al templo. Dios los confrontó con una pregunta fuerte: ¿robará el hombre a Dios? Y luego los desafió a probarlo, trayendo los diezmos al alfolí. Hoy vamos a ver lo que la Biblia enseña sobre dar, y por qué el corazón es más importante que la cantidad.',
   'No tempo do profeta Malaquias, o povo tinha voltado do exílio, mas tinha esfriado espiritualmente. Os sacerdotes ofereciam animais defeituosos e o povo tinha deixado de trazer os dízimos ao templo. Deus os confrontou com uma pergunta forte: roubará o homem a Deus? E depois os desafiou a prová-lo, trazendo os dízimos à casa do tesouro. Hoje vamos ver o que a Bíblia ensina sobre dar, e por que o coração é mais importante do que a quantia.'),
  [('Dar es reconocer a Dios','Dar é reconhecer a Deus',
    'Mucho antes de la ley, Abram dio a Melquisedec los diezmos de todo, reconociendo al Dios Altísimo, creador de los cielos y de la tierra. Dar a Dios es una manera de decir que él es el dueño y el proveedor. No damos para que Dios nos ame, sino porque ya nos ama.',
    'Muito antes da lei, Abrão deu a Melquisedeque o dízimo de tudo, reconhecendo o Deus Altíssimo, criador dos céus e da terra. Dar a Deus é uma maneira de dizer que ele é o dono e o provedor. Não damos para que Deus nos ame, mas porque ele já nos ama.','Gn 14:18-20'),
   ('Probar la fidelidad de Dios','Provar a fidelidade de Deus',
    'Dios dijo: probadme ahora en esto, si no os abriré las ventanas de los cielos. Dar con fidelidad es un acto de fe: confiamos en que Dios proveerá lo necesario. La bendición de Dios no siempre es financiera, pero él nunca abandona a quien confía en él.',
    'Deus disse: provai-me nisto, se eu não vos abrir as janelas do céu. Dar com fidelidade é um ato de fé: confiamos que Deus proverá o necessário. A bênção de Deus nem sempre é financeira, mas ele nunca abandona quem confia nele.','Ml 3:10'),
   ('Con alegría y sin presión','Com alegria e sem pressão',
    'Pablo enseña que cada uno dé como propuso en su corazón, no con tristeza ni por necesidad, porque Dios ama al dador alegre. La ofrenda no debe ser fruto de presión o manipulación, sino de gratitud. Dios mira el corazón de quien da más que la cantidad.',
    'Paulo ensina que cada um contribua segundo propôs no seu coração, não com tristeza ou por obrigação, porque Deus ama quem dá com alegria. A oferta não deve ser fruto de pressão ou manipulação, mas de gratidão. Deus olha o coração de quem dá mais do que a quantia.','2Co 9:6-7')],
  [('¿Por qué dar a Dios es una cuestión de confianza?',
    'Por que dar a Deus é uma questão de confiança?'),
   ('¿Qué actitudes del corazón agradan a Dios al ofrendar?',
    'Que atitudes do coração agradam a Deus ao ofertar?'),
   ('¿Cómo responder a quien dice que la iglesia solo quiere dinero?',
    'Como responder a quem diz que a igreja só quer dinheiro?'),
   ('¿Qué testimonios de provisión de Dios pueden compartir?',
    'Que testemunhos da provisão de Deus vocês podem compartilhar?')],
  ('Ore esta semana sobre su forma de dar a Dios y decida con su familia cómo ser fieles y alegres en eso.',
   'Ore nesta semana sobre a sua forma de dar a Deus e decida com a sua família como serem fiéis e alegres nisso.'),
  '2Co 9:7',
  ('Señor, gracias por todo lo que nos das. Queremos darte con alegría y confianza, reconociendo que eres nuestro dueño y proveedor. Amén.',
   'Senhor, obrigado por tudo o que nos dás. Queremos te dar com alegria e confiança, reconhecendo que és o nosso dono e provedor. Amém.'))

L('Pv 22:7',
  ('Libres de deudas','Livres das dívidas'),
  ('Reconocer los peligros de las deudas y buscar caminos sabios para salir de ellas.',
   'Reconhecer os perigos das dívidas e buscar caminhos sábios para sair delas.'),
  ('¿Qué compras hacemos muchas veces por impulso?',
   'Que compras fazemos muitas vezes por impulso?'),
  ('Proverbios dice que el rico se enseñorea de los pobres, y el que toma prestado es siervo del que presta. Las deudas pueden comenzar con algo pequeño, como una cuota o una tarjeta, y terminar robando la paz de una familia entera. La Biblia no prohíbe todo préstamo, pero advierte sobre la esclavitud que producen las deudas mal manejadas. Hoy vamos a ver principios bíblicos para evitar deudas y para salir de ellas con sabiduría.',
   'Provérbios diz que o rico domina sobre o pobre, e o que toma emprestado é servo do que empresta. As dívidas podem começar com algo pequeno, como uma parcela ou um cartão, e terminar roubando a paz de uma família inteira. A Bíblia não proíbe todo empréstimo, mas adverte sobre a escravidão que as dívidas mal administradas produzem. Hoje vamos ver princípios bíblicos para evitar dívidas e para sair delas com sabedoria.'),
  [('La deuda esclaviza','A dívida escraviza',
    'El proverbio usa una palabra fuerte: siervo. Quien debe mucho pierde libertad para decidir, para ayudar a otros y hasta para servir a Dios con tranquilidad. Pablo dice: no debáis a nadie nada, sino el amaros unos a otros. La única deuda permanente del creyente es el amor.',
    'O provérbio usa uma palavra forte: servo. Quem deve muito perde a liberdade para decidir, para ajudar os outros e até para servir a Deus com tranquilidade. Paulo diz: a ninguém fiqueis devendo coisa alguma, a não ser o amor com que vos ameis uns aos outros. A única dívida permanente do crente é o amor.','Rm 13:8'),
   ('Planificar antes de gastar','Planejar antes de gastar',
    'Jesús habló de quien quiere edificar una torre y primero se sienta a calcular los gastos, para ver si tiene lo necesario. Planificar es sabiduría, no falta de fe. Un presupuesto sencillo ayuda a vivir dentro de lo que se gana y a evitar compras impulsivas.',
    'Jesus falou de quem quer construir uma torre e primeiro se senta para calcular as despesas, para ver se tem o necessário. Planejar é sabedoria, não falta de fé. Um orçamento simples ajuda a viver dentro do que se ganha e a evitar compras por impulso.','Lc 14:28-30'),
   ('Pagar con honestidad','Pagar com honestidade',
    'El salmista dice que el impío toma prestado y no paga, pero el justo tiene misericordia y da. El creyente honra sus compromisos. Salir de las deudas exige reconocer el problema, conversar con los acreedores, cortar gastos y pagar con constancia. Es un testimonio de integridad.',
    'O salmista diz que o ímpio toma emprestado e não paga, mas o justo se compadece e dá. O crente honra os seus compromissos. Sair das dívidas exige reconhecer o problema, conversar com os credores, cortar gastos e pagar com constância. É um testemunho de integridade.','Sl 37:21')],
  [('¿Por qué las deudas afectan tanto la paz de una familia?',
    'Por que as dívidas afetam tanto a paz de uma família?'),
   ('¿Qué diferencia hay entre una deuda planificada y una deuda por impulso?',
    'Que diferença há entre uma dívida planejada e uma dívida por impulso?'),
   ('¿Qué pasos prácticos ayudan a salir de las deudas?',
    'Que passos práticos ajudam a sair das dívidas?'),
   ('¿Cómo puede la iglesia apoyar a familias endeudadas sin juzgarlas?',
    'Como a igreja pode apoiar famílias endividadas sem julgá-las?')],
  ('Anote durante esta semana todos sus gastos y converse con su familia sobre qué se puede reducir.',
   'Anote durante esta semana todos os seus gastos e converse com a sua família sobre o que se pode reduzir.'),
  'Rm 13:8',
  ('Señor, danos sabiduría para administrar nuestros recursos. Líbranos de la esclavitud de las deudas y ayúdanos a vivir con honestidad y paz. Amén.',
   'Senhor, dá-nos sabedoria para administrar os nossos recursos. Livra-nos da escravidão das dívidas e ajuda-nos a viver com honestidade e paz. Amém.'))

L('Fp 4:11-13',
  ('El secreto del contentamiento','O segredo do contentamento'),
  ('Aprender a estar satisfechos en Cristo, en la abundancia y en la escasez.',
   'Aprender a estar satisfeitos em Cristo, na fartura e na escassez.'),
  ('¿Qué cosa deseaban mucho y, cuando la tuvieron, no los hizo tan felices como pensaban?',
   'Que coisa vocês desejavam muito e, quando conseguiram, não os fez tão felizes quanto pensavam?'),
  ('Pablo escribió a los filipenses desde la prisión. Ellos le habían enviado una ofrenda, y él les agradeció, pero aclaró algo: había aprendido a contentarse cualquiera que fuera su situación. Sabía vivir humildemente y sabía tener abundancia; en todo y por todo estaba enseñado. Vivimos en una cultura que siempre nos dice que necesitamos más. Hoy vamos a descubrir el secreto que Pablo aprendió y que nos libera de la ansiedad por tener.',
   'Paulo escreveu aos filipenses da prisão. Eles lhe tinham enviado uma oferta, e ele agradeceu, mas esclareceu algo: tinha aprendido a viver contente em toda e qualquer situação. Sabia viver humildemente e sabia ter fartura; em tudo e por tudo estava instruído. Vivemos numa cultura que sempre nos diz que precisamos de mais. Hoje vamos descobrir o segredo que Paulo aprendeu e que nos liberta da ansiedade de ter.'),
  [('El contentamiento se aprende','O contentamento se aprende',
    'Pablo dice dos veces que aprendió. El contentamiento no es natural; se aprende en las experiencias de la vida, con Dios. Cada situación, de escasez o de abundancia, es una escuela donde aprendemos a depender de él y no de las cosas.',
    'Paulo diz duas vezes que aprendeu. O contentamento não é algo natural; ele se aprende nas experiências da vida, com Deus. Cada situação, de escassez ou de fartura, é uma escola onde aprendemos a depender dele e não das coisas.','Fp 4:11-12'),
   ('Cuidado con la avaricia','Cuidado com a avareza',
    'Jesús advirtió: mirad, y guardaos de toda avaricia; porque la vida del hombre no consiste en la abundancia de los bienes que posee. Luego contó la historia del rico que construyó graneros mayores y murió esa misma noche. Acumular sin pensar en Dios es una forma de necedad.',
    'Jesus advertiu: tende cuidado e guardai-vos de toda avareza; porque a vida de um homem não consiste na abundância dos bens que ele possui. Depois contou a história do rico que construiu celeiros maiores e morreu naquela mesma noite. Acumular sem pensar em Deus é uma forma de insensatez.','Lc 12:15'),
   ('Gran ganancia es la piedad','Grande ganho é a piedade',
    'Pablo escribió a Timoteo que gran ganancia es la piedad acompañada de contentamiento, porque nada trajimos a este mundo y nada podremos sacar. Teniendo sustento y abrigo, estemos contentos. Los que quieren enriquecerse caen en tentaciones. La verdadera riqueza es Cristo.',
    'Paulo escreveu a Timóteo que grande fonte de lucro é a piedade com contentamento, porque nada trouxemos para este mundo e nada podemos levar dele. Tendo sustento e com que nos vestir, estejamos contentes. Os que querem ficar ricos caem em tentações. A verdadeira riqueza é Cristo.','1Tm 6:6-9')],
  [('¿Por qué es tan difícil estar contentos con lo que tenemos?',
    'Por que é tão difícil estar contentes com o que temos?'),
   ('¿Cómo influye la publicidad y las redes sociales en nuestros deseos?',
    'Como a publicidade e as redes sociais influenciam os nossos desejos?'),
   ('¿Qué diferencia hay entre trabajar para progresar y vivir con avaricia?',
    'Que diferença há entre trabalhar para progredir e viver com avareza?'),
   ('¿En qué situaciones necesitan aprender a contentarse?',
    'Em que situações vocês precisam aprender a ter contentamento?')],
  ('Escriba cada día de esta semana tres cosas por las que está agradecido y evite compras que no sean necesarias.',
   'Escreva todos os dias desta semana três coisas pelas quais você é grato e evite compras que não sejam necessárias.'),
  'Fp 4:13',
  ('Señor, enséñanos el secreto del contentamiento. Líbranos de la avaricia y ayúdanos a encontrar en Ti nuestra verdadera riqueza. Amén.',
   'Senhor, ensina-nos o segredo do contentamento. Livra-nos da avareza e ajuda-nos a encontrar em ti a nossa verdadeira riqueza. Amém.'))

L('Ef 4:28',
  ('Trabajo y provisión','Trabalho e provisão'),
  ('Valorar el trabajo honrado como medio de provisión y de bendición para otros.',
   'Valorizar o trabalho honesto como meio de provisão e de bênção para os outros.'),
  ('¿Cuál fue su primer trabajo? ¿Qué aprendieron en él?',
   'Qual foi o primeiro trabalho de vocês? O que aprenderam nele?'),
  ('Desde el principio, Dios puso al hombre en el huerto de Edén para que lo labrara y lo guardase. El trabajo no es un castigo, sino parte del diseño de Dios. Pablo, escribiendo a los efesios, dice que el que hurtaba no hurte más, sino que trabaje con sus manos en algo bueno, para que tenga qué compartir con el que padece necesidad. Hoy vamos a ver cómo el trabajo honrado honra a Dios, sostiene a la familia y bendice a otros.',
   'Desde o princípio, Deus colocou o homem no jardim do Éden para cultivá-lo e guardá-lo. O trabalho não é um castigo, mas parte do plano de Deus. Paulo, escrevendo aos efésios, diz que aquele que furtava não furte mais, antes trabalhe com as próprias mãos em algo bom, para que tenha o que repartir com o que tem necessidade. Hoje vamos ver como o trabalho honesto honra a Deus, sustenta a família e abençoa os outros.'),
  [('El trabajo es parte del plan de Dios','O trabalho é parte do plano de Deus',
    'Antes del pecado, Dios ya había dado al hombre la tarea de labrar y guardar el huerto. Trabajar es participar en el cuidado de la creación. Por eso el creyente no desprecia ningún trabajo honrado, sea manual o intelectual, sencillo o complejo.',
    'Antes do pecado, Deus já tinha dado ao homem a tarefa de cultivar e guardar o jardim. Trabalhar é participar do cuidado da criação. Por isso o crente não despreza nenhum trabalho honesto, seja manual ou intelectual, simples ou complexo.','Gn 2:15'),
   ('Trabajar como para el Señor','Trabalhar como para o Senhor',
    'Pablo dice: todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres. El creyente trabaja con excelencia y honestidad aunque nadie lo vea, porque sirve a Cristo. Nuestro trabajo diario puede ser un acto de adoración y un testimonio.',
    'Paulo diz: tudo o que fizerdes, fazei-o de coração, como para o Senhor e não para os homens. O crente trabalha com excelência e honestidade mesmo quando ninguém vê, porque serve a Cristo. O nosso trabalho diário pode ser um ato de adoração e um testemunho.','Cl 3:23-24'),
   ('Trabajar para compartir','Trabalhar para repartir',
    'La meta del trabajo no es solo sostenernos, sino tener qué compartir con el que padece necesidad. Pablo también dijo a los tesalonicenses que procuraran tener tranquilidad y trabajar con sus manos, para no depender de nadie. El trabajo nos da dignidad y la oportunidad de ser generosos.',
    'O objetivo do trabalho não é só nos sustentar, mas ter o que repartir com quem tem necessidade. Paulo também disse aos tessalonicenses que procurassem viver tranquilos e trabalhar com as próprias mãos, para não dependerem de ninguém. O trabalho nos dá dignidade e a oportunidade de sermos generosos.','1Ts 4:11-12')],
  [('¿Cómo cambia nuestra actitud si vemos el trabajo como parte del plan de Dios?',
    'Como muda a nossa atitude se vemos o trabalho como parte do plano de Deus?'),
   ('¿Qué significa trabajar como para el Señor en su empleo actual?',
    'O que significa trabalhar como para o Senhor no seu emprego atual?'),
   ('¿Qué tentaciones de deshonestidad aparecen en el trabajo?',
    'Que tentações de desonestidade aparecem no trabalho?'),
   ('¿Cómo podemos ayudar a hermanos que buscan trabajo?',
    'Como podemos ajudar irmãos que estão procurando trabalho?')],
  ('Haga esta semana su trabajo con excelencia, como para el Señor, y ore por sus compañeros o clientes.',
   'Faça nesta semana o seu trabalho com excelência, como para o Senhor, e ore pelos seus colegas ou clientes.'),
  'Cl 3:23',
  ('Señor, gracias por el trabajo y por la provisión. Ayúdanos a trabajar con honestidad y excelencia, como para Ti, y a compartir con los que tienen necesidad. Amén.',
   'Senhor, obrigado pelo trabalho e pela provisão. Ajuda-nos a trabalhar com honestidade e excelência, como para ti, e a repartir com os que têm necessidade. Amém.'))

L('Mt 6:19-21',
  ('Tesoros en el cielo','Tesouros no céu'),
  ('Aprender a usar los bienes de esta vida con una perspectiva eterna y generosa.',
   'Aprender a usar os bens desta vida com uma perspectiva eterna e generosa.'),
  ('Si tuvieran que salir de su casa en cinco minutos, ¿qué se llevarían?',
   'Se vocês tivessem que sair de casa em cinco minutos, o que levariam?'),
  ('En el Sermón del Monte, Jesús habló directamente sobre el dinero y los bienes. Dijo que no hagamos tesoros en la tierra, donde la polilla y el orín corrompen y los ladrones minan y hurtan, sino tesoros en el cielo. Y concluyó con una frase que revela todo: donde esté vuestro tesoro, allí estará también vuestro corazón. Hoy vamos a ver cómo usar los bienes de esta vida para lo que dura para siempre.',
   'No Sermão do Monte, Jesus falou diretamente sobre o dinheiro e os bens. Disse que não ajuntemos tesouros na terra, onde a traça e a ferrugem corroem e os ladrões arrombam e roubam, mas tesouros no céu. E concluiu com uma frase que revela tudo: onde estiver o vosso tesouro, aí estará também o vosso coração. Hoje vamos ver como usar os bens desta vida para aquilo que dura para sempre.'),
  [('Los tesoros terrenales son pasajeros','Os tesouros terrenos são passageiros',
    'Jesús mencionó la polilla, el orín y los ladrones: todo lo material se desgasta o se pierde. Disfrutar de lo que Dios nos da no es pecado, pero poner la seguridad en las cosas es una ilusión. Lo que hoy parece tan importante un día quedará atrás.',
    'Jesus mencionou a traça, a ferrugem e os ladrões: tudo o que é material se desgasta ou se perde. Desfrutar do que Deus nos dá não é pecado, mas colocar a segurança nas coisas é uma ilusão. O que hoje parece tão importante um dia ficará para trás.','Mt 6:19'),
   ('No se puede servir a dos señores','Ninguém pode servir a dois senhores',
    'Jesús dijo que ninguno puede servir a dos señores: no podéis servir a Dios y a las riquezas. El dinero es un buen siervo, pero un pésimo señor. Cuando el dinero ocupa el centro, desplaza a Dios. Debemos decidir quién gobierna nuestro corazón.',
    'Jesus disse que ninguém pode servir a dois senhores: não podeis servir a Deus e às riquezas. O dinheiro é um bom servo, mas um péssimo senhor. Quando o dinheiro ocupa o centro, ele desloca Deus. Precisamos decidir quem governa o nosso coração.','Mt 6:24'),
   ('Ricos en buenas obras','Ricos em boas obras',
    'Pablo pide a los ricos que no pongan la esperanza en las riquezas inciertas, sino en Dios, y que sean ricos en buenas obras, dadivosos y generosos, atesorando para sí buen fundamento para lo por venir. La generosidad transforma bienes temporales en tesoros eternos.',
    'Paulo pede aos ricos que não ponham a esperança na incerteza das riquezas, mas em Deus, e que sejam ricos em boas obras, generosos e prontos a repartir, acumulando para si um bom fundamento para o futuro. A generosidade transforma bens temporais em tesouros eternos.','1Tm 6:17-19')],
  [('¿Qué revela nuestro uso del dinero sobre dónde está nuestro corazón?',
    'O que o nosso uso do dinheiro revela sobre onde está o nosso coração?'),
   ('¿Cómo saber si el dinero se ha convertido en nuestro señor?',
    'Como saber se o dinheiro se tornou o nosso senhor?'),
   ('¿Qué significa hacer tesoros en el cielo en la vida práctica?',
    'O que significa ajuntar tesouros no céu na vida prática?'),
   ('¿Qué obra de generosidad podríamos hacer juntos como grupo?',
    'Que obra de generosidade poderíamos fazer juntos como grupo?')],
  ('Elija esta semana una forma concreta de ser generoso con alguien que tiene necesidad.',
   'Escolha nesta semana uma forma concreta de ser generoso com alguém que tem necessidade.'),
  'Mt 6:21',
  ('Señor, queremos que nuestro corazón esté en Ti. Líbranos del amor al dinero y haznos ricos en buenas obras, haciendo tesoros que duren para siempre. Amén.',
   'Senhor, queremos que o nosso coração esteja em ti. Livra-nos do amor ao dinheiro e faze-nos ricos em boas obras, ajuntando tesouros que durem para sempre. Amém.'))
# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas|vosotros)\b',re.I)
TU_CS=re.compile(r'\b(tú|tu|tus|te|ti|contigo)\b')  # na oração (dirigida a Deus) só se aceita a forma com maiúscula: Tú, Tu, Te, Ti
QUOTE=re.compile(r'«[^»]*»')
KEYS='evangelismo financas'.split()
OLDB={}
for _f in ('licoes-1.json','licoes-2.json','licoes-3.json','licoes-4.json','licoes-5.json'):
    for _s in json.load(open(os.path.join(HERE,_f),encoding='utf-8'))['series']:
        for _l in _s['l']:OLDB[_l['v']]=_s['k']
def nw(s):return len(s.split())
def main():
    err=[];refs=[];bases={}
    for o in SER:
        for t in (o['n'],o['d']):
            if len(t)!=2 or not all(x.strip() for x in t):err.append(o['k']+': nome/descrição incompletos')
        for t in (o['n'][0],o['d'][0]):
            m=TU.search(t)
            if m:err.append(o['k']+': forma de "tú" em ES: %r'%m.group(0))
        if len(o['l'])!=6:err.append('%s: %d lições'%(o['k'],len(o['l'])))
        for i,l in enumerate(o['l']):
            w='%s#%d'%(o['k'],i+1)
            if len(l['pts'])!=3:err.append(w+': %d pontos'%len(l['pts']))
            if not 4<=len(l['perg'])<=5:err.append(w+': %d perguntas'%len(l['perg']))
            l['v']=ref(l['v']);refs.append((w+' base',l['v']));bases.setdefault(l['v'],[]).append(w)
            if len(verses(l['v']))>6:err.append(w+': texto-base com mais de 6 versículos')
            l['mem']=ref(l['mem']);refs.append((w+' mem',l['mem']))
            for j,p in enumerate(l['pts']):
                p['v']=ref(p['v']);refs.append((w+' p%d'%(j+1),p['v']))
            pares=[l['t'],l['obj'],l['gelo'],l['intro'],l['apl'],l['or']]+[p['t'] for p in l['pts']]+[p['x'] for p in l['pts']]+l['perg']
            for t in pares:
                if len(t)!=2 or not all(isinstance(x,str) and x.strip() for x in t):err.append(w+': par ES/PT incompleto: %r'%(t,))
            # tamanhos (palavras)
            for k,lo,hi in (('intro',60,100),('or',20,40)):
                for n,x in zip(('ES','PT'),l[k]):
                    if not lo<=nw(x)<=hi:err.append('%s %s %s: %d palavras (%d-%d)'%(w,k,n,nw(x),lo,hi))
            for j,p in enumerate(l['pts']):
                for n,x in zip(('ES','PT'),p['x']):
                    if not 40<=nw(x)<=80:err.append('%s p%d %s: %d palavras (40-80)'%(w,j+1,n,nw(x)))
            # ES: sem formas de "tú" fora de citações «...»
            es=[l['t'][0],l['obj'][0],l['gelo'][0],l['intro'][0],l['apl'][0]]+[p['t'][0] for p in l['pts']]+[p['x'][0] for p in l['pts']]+[q[0] for q in l['perg']]
            for t in es:
                m=TU.search(QUOTE.sub('',t))
                if m:err.append(w+': forma de "tú" em ES: %r em %r'%(m.group(0),t))
            m=TU_CS.search(QUOTE.sub('',l['or'][0]))
            if m:err.append(w+': pronome de Deus em minúscula na oração ES: %r'%m.group(0))
            # PT: citações em aspas curvas, não «»
            for x in [l['intro'][1],l['apl'][1]]+[p['x'][1] for p in l['pts']]+[q[1] for q in l['perg']]:
                if '«' in x or '»' in x:err.append(w+': «» em PT')
    if [o['k'] for o in SER]!=KEYS:err.append('ordem/chaves das séries diferente do pedido')
    for w,r in refs:
        for b,c,v in verses(r):
            for nome,bib in (('PT',PT),('ES',ES)):
                if not exists(bib,b,c,v):err.append('%s: %s não existe em %s'%(w,r,nome))
    for r in bases:
        if r in OLDB:err.append('texto-base já usado em %s: %s'%(OLDB[r],r))
    for r,ws in bases.items():
        if len(ws)>1:err.append('texto-base repetido %s: %s'%(r,', '.join(ws)))
    if '--print' in sys.argv:
        for w,r in refs:
            print('==',w,r)
            for b,c,v in verses(r):
                print('  PT %d:%d %s'%(c,v,PT[b][c-1][v-1]));print('  ES %d:%d %s'%(c,v,ES[b][c-1][v-1]))
    if err:
        print('\n'.join(err));sys.exit(1)
    out=os.path.join(HERE,'licoes-6.json')
    json.dump({'series':SER},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['l']) for o in SER)
    print('ok: %d séries, %d lições, %d referências -> %s'%(len(SER),n,len(refs),out))
if __name__=='__main__':main()
