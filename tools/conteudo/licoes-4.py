# Lições de estudo bíblico para células e Escola Dominical (Meu Púlpito) — parte 4.
# 2 séries x 6 lições: milagres, eusou. Cada texto é um par [ES, PT].
# Cada lição: título, texto-base, objetivo, quebra-gelo, introdução (para o líder ler),
# 3 pontos com explicação e referência, perguntas de discussão, aplicação, versículo para memorizar e oração.
# Uso: python3 tools/conteudo/licoes-4.py          -> valida e grava tools/conteudo/licoes-4.json
#      python3 tools/conteudo/licoes-4.py --print  -> imprime o texto de cada referência nas duas Bíblias
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




# ================================================================ Milagres de Jesus
S('milagres','Los milagros de Jesús','Os milagres de Jesus',
  'Seis estudios sobre señales de Jesús que revelan su poder, su compasión y quién es él.',
  'Seis estudos sobre sinais de Jesus que revelam o seu poder, a sua compaixão e quem ele é.')

L('Jo 2:6-11',
  ('El agua convertida en vino','A água transformada em vinho'),
  ('Ver en la primera señal de Jesús su cuidado por las necesidades de la vida diaria y la importancia de obedecer su palabra.',
   'Ver no primeiro sinal de Jesus o seu cuidado com as necessidades do dia a dia e a importância de obedecer à sua palavra.'),
  ('¿Recuerdan alguna fiesta en la que algo salió mal? ¿Cómo se resolvió?',
   'Vocês se lembram de alguma festa em que algo deu errado? Como foi resolvido?'),
  ('En una boda en Caná de Galilea se terminó el vino. Para la familia de los novios, eso podía ser una gran vergüenza delante de los invitados. María llevó el problema a Jesús y dijo a los sirvientes que hicieran todo lo que él les dijera. Jesús mandó llenar de agua seis tinajas de piedra y llevar al encargado de la fiesta, y el agua se había convertido en un vino excelente. Juan dice que esta fue la primera de sus señales y que sus discípulos creyeron en él.',
   'Num casamento em Caná da Galileia, o vinho acabou. Para a família dos noivos, isso podia ser uma grande vergonha diante dos convidados. Maria levou o problema a Jesus e disse aos serventes que fizessem tudo o que ele mandasse. Jesus mandou encher de água seis talhas de pedra e levar ao mestre-sala, e a água tinha se transformado num vinho excelente. João diz que esse foi o primeiro dos seus sinais e que os seus discípulos creram nele.'),
  [('Llevar el problema a Jesús','Levar o problema a Jesus',
    'María no hizo un discurso largo; simplemente dijo a Jesús: no tienen vino. A veces nuestras oraciones pueden ser así de sencillas: contar a Jesús lo que falta. Él se interesa por los problemas grandes y también por los que parecen pequeños, como una fiesta familiar.',
    'Maria não fez um discurso longo; simplesmente disse a Jesus: eles não têm vinho. Às vezes as nossas orações podem ser assim simples: contar a Jesus o que está faltando. Ele se interessa pelos problemas grandes e também pelos que parecem pequenos, como uma festa de família.','Jo 2:3'),
   ('Haced todo lo que os dijere','Fazei tudo o que ele vos disser',
    'María dijo a los sirvientes que hicieran todo lo que Jesús les dijera. La orden parecía extraña: llenar tinajas de agua cuando faltaba vino. Pero obedecieron hasta arriba. Muchos milagros empiezan con una obediencia que no entendemos del todo. Nuestra parte es obedecer; el poder es de Jesús.',
    'Maria disse aos serventes que fizessem tudo o que Jesus mandasse. A ordem parecia estranha: encher talhas de água quando faltava vinho. Mas eles obedeceram até a borda. Muitos milagres começam com uma obediência que não entendemos totalmente. A nossa parte é obedecer; o poder é de Jesus.','Jo 2:5-7'),
   ('Una señal que lleva a creer','Um sinal que leva a crer',
    'Juan llama a los milagros señales, porque apuntan a algo más grande. El vino nuevo mostró la gloria de Jesús, y sus discípulos creyeron en él. Los milagros no son el fin, sino un medio para que conozcamos quién es Jesús y confiemos en él.',
    'João chama os milagres de sinais, porque apontam para algo maior. O vinho novo mostrou a glória de Jesus, e os seus discípulos creram nele. Os milagres não são o fim, mas um meio para que conheçamos quem é Jesus e confiemos nele.','Jo 2:11')],
  [('¿Qué nos enseña este milagro sobre el interés de Jesús por la vida cotidiana?',
    'O que este milagre nos ensina sobre o interesse de Jesus pela vida cotidiana?'),
   ('¿Por qué a veces nos cuesta obedecer cuando no entendemos lo que Dios pide?',
    'Por que às vezes temos dificuldade de obedecer quando não entendemos o que Deus pede?'),
   ('¿Qué falta hoy en sus casas que pueden presentar a Jesús?',
    'O que está faltando hoje nas suas casas que vocês podem apresentar a Jesus?'),
   ('¿Cómo puede un milagro ayudar a otros a creer en Jesús?',
    'Como um milagre pode ajudar outros a crerem em Jesus?')],
  ('Presente a Jesús esta semana una necesidad concreta de su casa y obedezca lo que él le muestre en su Palabra.',
   'Apresente a Jesus nesta semana uma necessidade concreta da sua casa e obedeça ao que ele mostrar na sua Palavra.'),
  'Jo 2:5',
  ('Señor Jesús, Tú cuidas de nuestra vida diaria. Te presentamos lo que nos falta y queremos hacer todo lo que Tú nos digas. Amén.',
   'Senhor Jesus, tu te interessas pela nossa vida diária. Apresentamos a ti o que nos falta e queremos fazer tudo o que tu nos disseres. Amém.'))

L('Mc 2:1-5',
  ('El paralítico y sus cuatro amigos','O paralítico e os seus quatro amigos'),
  ('Aprender de la fe de los amigos que llevaron al paralítico a Jesús y ver que Jesús perdona y sana.',
   'Aprender com a fé dos amigos que levaram o paralítico a Jesus e ver que Jesus perdoa e cura.'),
  ('¿Tienen algún amigo que haría cualquier cosa por ustedes? ¿Qué hizo alguna vez?',
   'Vocês têm algum amigo que faria qualquer coisa por vocês? O que ele já fez?'),
  ('Jesús estaba enseñando en una casa en Capernaum, tan llena que no había lugar ni en la puerta. Cuatro hombres llegaron cargando a un paralítico en una camilla, pero no pudieron entrar. Entonces subieron al techo, lo abrieron y bajaron a su amigo delante de Jesús. Marcos dice que Jesús vio la fe de ellos. Hoy vamos a ver lo que pasó cuando esos amigos no se rindieron y qué nos enseña sobre llevar a otros a Jesús.',
   'Jesus estava ensinando numa casa em Cafarnaum, tão cheia que não havia lugar nem na porta. Quatro homens chegaram carregando um paralítico numa maca, mas não conseguiram entrar. Então subiram no telhado, abriram uma abertura e desceram o amigo diante de Jesus. Marcos diz que Jesus viu a fé deles. Hoje vamos ver o que aconteceu quando esses amigos não desistiram e o que isso nos ensina sobre levar outros a Jesus.'),
  [('Amigos que no se rinden','Amigos que não desistem',
    'El paralítico no podía llegar solo. Sus amigos lo cargaron y, cuando encontraron la puerta cerrada por la multitud, buscaron otro camino. Hay personas que nunca llegarán a Jesús si alguien no las lleva. La perseverancia de un amigo puede cambiar la historia de una vida.',
    'O paralítico não conseguia chegar sozinho. Os seus amigos o carregaram e, quando encontraram a porta fechada pela multidão, procuraram outro caminho. Há pessoas que nunca chegarão a Jesus se alguém não as levar. A perseverança de um amigo pode mudar a história de uma vida.','Mc 2:3-4'),
   ('Primero el perdón','Primeiro o perdão',
    'Lo primero que Jesús dijo no fue «levántate», sino «Hijo, tus pecados te son perdonados». Jesús vio la necesidad más profunda del hombre. La enfermedad era visible, pero el pecado era el problema más grave. Jesús tiene autoridad para perdonar, y eso es más importante que cualquier otra sanidad.',
    'A primeira coisa que Jesus disse não foi levanta-te, mas filho, os teus pecados estão perdoados. Jesus viu a necessidade mais profunda do homem. A doença era visível, mas o pecado era o problema mais grave. Jesus tem autoridade para perdoar, e isso é mais importante do que qualquer outra cura.','Mc 2:5'),
   ('Levántate y anda','Levanta-te e anda',
    'Algunos escribas pensaron que solo Dios puede perdonar pecados. Jesús, para mostrar que tenía esa autoridad, dijo al paralítico que se levantara, tomara su camilla y se fuera a su casa. Él se levantó delante de todos, y todos se asombraron y glorificaron a Dios.',
    'Alguns escribas pensaram que só Deus pode perdoar pecados. Jesus, para mostrar que tinha essa autoridade, disse ao paralítico que se levantasse, pegasse a sua maca e fosse para casa. Ele se levantou diante de todos, e todos ficaram admirados e glorificaram a Deus.','Mc 2:10-12')],
  [('¿Quiénes fueron los amigos que los llevaron a ustedes a Jesús?',
    'Quem foram os amigos que levaram vocês a Jesus?'),
   ('¿Qué obstáculos impiden hoy que algunas personas lleguen a Jesús?',
    'Que obstáculos impedem hoje que algumas pessoas cheguem a Jesus?'),
   ('¿Por qué Jesús perdonó primero los pecados antes de sanar el cuerpo?',
    'Por que Jesus perdoou primeiro os pecados antes de curar o corpo?'),
   ('¿A quién podríamos cargar juntos en oración y llevar a Jesús?',
    'Quem poderíamos carregar juntos em oração e levar a Jesus?')],
  ('Como grupo, elijan a una persona necesitada y comprométanse a orar por ella y visitarla esta semana.',
   'Como grupo, escolham uma pessoa necessitada e se comprometam a orar por ela e visitá-la nesta semana.'),
  'Gl 6:2',
  ('Señor Jesús, gracias por los amigos que nos llevaron a Ti. Haznos amigos perseverantes que lleven a otros a Tu presencia. Amén.',
   'Senhor Jesus, obrigado pelos amigos que nos levaram a ti. Faze de nós amigos perseverantes que levem outros à tua presença. Amém.'))

L('Mc 5:25-29',
  ('La mujer que tocó el borde de su manto','A mulher que tocou na orla do seu manto'),
  ('Ver cómo Jesús responde a la fe de una persona olvidada y le devuelve no solo la salud, sino también la dignidad.',
   'Ver como Jesus responde à fé de uma pessoa esquecida e lhe devolve não só a saúde, mas também a dignidade.'),
  ('¿Alguna vez se sintieron invisibles en un lugar lleno de gente?',
   'Vocês já se sentiram invisíveis num lugar cheio de gente?'),
  ('Una mujer sufría de un flujo de sangre desde hacía doce años. Había gastado todo lo que tenía en médicos y, en lugar de mejorar, estaba peor. Según la ley de aquel tiempo, su enfermedad la dejaba impura y aislada. Ella pensó que si tocaba aunque fuera el manto de Jesús, sería sana. En medio de la multitud, se acercó por detrás y lo tocó. Hoy vamos a ver cómo Jesús respondió a esa fe silenciosa.',
   'Uma mulher sofria de um fluxo de sangue havia doze anos. Tinha gasto tudo o que possuía com médicos e, em vez de melhorar, estava pior. Segundo a lei daquele tempo, a sua doença a deixava impura e isolada. Ela pensou que, se tocasse ainda que fosse no manto de Jesus, ficaria curada. No meio da multidão, aproximou-se por trás e o tocou. Hoje vamos ver como Jesus respondeu a essa fé silenciosa.'),
  [('Doce años de sufrimiento','Doze anos de sofrimento',
    'Marcos cuenta que ella había sufrido mucho de muchos médicos y había gastado todo sin ningún resultado. Muchas personas llegan a Jesús después de intentar todo lo demás. No importa cuánto tiempo hace que una persona sufre: nunca es tarde para acercarse a Jesús.',
    'Marcos conta que ela tinha sofrido muito nas mãos de muitos médicos e gastado tudo sem nenhum resultado. Muitas pessoas chegam a Jesus depois de tentar todo o resto. Não importa há quanto tempo uma pessoa sofre: nunca é tarde para se aproximar de Jesus.','Mc 5:26'),
   ('Una fe que se acerca','Uma fé que se aproxima',
    'Ella no tenía nombre ni posición, y probablemente tenía miedo de ser descubierta. Pero su fe la movió a abrirse paso entre la gente. Muchos apretaban a Jesús, pero solo ella lo tocó con fe. Estar cerca de Jesús no es lo mismo que tocarlo con fe.',
    'Ela não tinha nome nem posição, e provavelmente tinha medo de ser descoberta. Mas a sua fé a levou a abrir caminho entre as pessoas. Muitos apertavam Jesus, mas só ela o tocou com fé. Estar perto de Jesus não é o mesmo que tocá-lo com fé.','Mc 5:27-28'),
   ('Una fe que sana','Uma fé que cura',
    'Jesús se detuvo y preguntó quién lo había tocado. La mujer, temblando, contó toda la verdad. Él no la reprendió: la llamó hija y la despidió en paz. Jesús no quería solo sanar su cuerpo, sino también restaurar su dignidad delante de todos.',
    'Jesus parou e perguntou quem o tinha tocado. A mulher, tremendo, contou toda a verdade. Ele não a repreendeu: chamou-a de filha e a despediu em paz. Jesus não queria só curar o seu corpo, mas também restaurar a sua dignidade diante de todos.','Mc 5:33-34')],
  [('¿Qué nos enseña esta historia sobre las personas que sufren en silencio?',
    'O que esta história nos ensina sobre as pessoas que sofrem em silêncio?'),
   ('¿Cuál es la diferencia entre estar cerca de Jesús y tocarlo con fe?',
    'Qual é a diferença entre estar perto de Jesus e tocá-lo com fé?'),
   ('¿Por qué creen que Jesús quiso que la mujer contara su historia delante de todos?',
    'Por que vocês acham que Jesus quis que a mulher contasse a sua história diante de todos?'),
   ('¿Cómo puede la iglesia devolver dignidad a personas marginadas?',
    'Como a igreja pode devolver dignidade a pessoas marginalizadas?')],
  ('Acérquese esta semana a alguien que está sufriendo en silencio y ofrézcale su compañía y oración.',
   'Aproxime-se nesta semana de alguém que está sofrendo em silêncio e ofereça a sua companhia e oração.'),
  'Hb 4:16',
  ('Señor Jesús, gracias porque nos ves aun en medio de la multitud. Ayúdanos a acercarnos a Ti con fe y a mirar a los que sufren con Tu compasión. Amén.',
   'Senhor Jesus, obrigado porque nos vês mesmo no meio da multidão. Ajuda-nos a nos aproximar de ti com fé e a olhar para os que sofrem com a tua compaixão. Amém.'))

L('Jo 6:8-13',
  ('Cinco panes y dos peces','Cinco pães e dois peixes'),
  ('Aprender que Jesús multiplica lo poco que ponemos en sus manos para bendecir a muchos.',
   'Aprender que Jesus multiplica o pouco que colocamos nas suas mãos para abençoar muitos.'),
  ('¿Cuál fue la comida más sencilla y más rica que compartieron con otras personas?',
   'Qual foi a comida mais simples e mais gostosa que vocês já compartilharam com outras pessoas?'),
  ('Una gran multitud seguía a Jesús y ya era tarde. Jesús preguntó a Felipe dónde comprar pan para tanta gente. Felipe hizo cuentas y concluyó que ni doscientos denarios alcanzarían. Andrés encontró a un muchacho con cinco panes de cebada y dos pececillos, pero preguntó: ¿qué es esto para tantos? Jesús tomó lo poco, dio gracias y lo repartió, y todos comieron hasta saciarse. Hoy vamos a ver qué pasa cuando ponemos lo poco en las manos de Jesús.',
   'Uma grande multidão seguia Jesus e já era tarde. Jesus perguntou a Filipe onde comprar pão para tanta gente. Filipe fez as contas e concluiu que nem duzentos denários seriam suficientes. André encontrou um menino com cinco pães de cevada e dois peixinhos, mas perguntou: que é isso para tantos? Jesus tomou o pouco, deu graças e o repartiu, e todos comeram até ficar satisfeitos. Hoje vamos ver o que acontece quando colocamos o pouco nas mãos de Jesus.'),
  [('Cuando las cuentas no cierran','Quando as contas não fecham',
    'Felipe miró el problema con la calculadora y vio que era imposible. No estaba equivocado en las cuentas, pero se olvidó de quién estaba con ellos. Jesús ya sabía lo que iba a hacer; quería probar a sus discípulos. Muchas veces miramos solo nuestros recursos y no el poder de Dios.',
    'Filipe olhou o problema com a calculadora e viu que era impossível. Não estava errado nas contas, mas se esqueceu de quem estava com eles. Jesus já sabia o que ia fazer; queria provar os discípulos. Muitas vezes olhamos só para os nossos recursos e não para o poder de Deus.','Jo 6:6-7'),
   ('Lo poco de un muchacho','O pouco de um menino',
    'Andrés presentó lo que había, aunque dudaba que sirviera de algo. El muchacho entregó su comida sencilla. Dios no necesita que tengamos mucho, sino que entreguemos lo que tenemos. Un pequeño tiempo, un pequeño don o una pequeña ofrenda en las manos de Jesús pueden bendecir a muchos.',
    'André apresentou o que havia, mesmo duvidando que servisse para alguma coisa. O menino entregou a sua comida simples. Deus não precisa que tenhamos muito, mas que entreguemos o que temos. Um pouco de tempo, um pequeno dom ou uma pequena oferta nas mãos de Jesus podem abençoar muitos.','Jo 6:8-9'),
   ('Dar gracias y repartir','Dar graças e repartir',
    'Jesús tomó los panes, dio gracias y los repartió, y lo mismo hizo con los peces, tanto como querían. Después mandó recoger lo que sobró para que nada se perdiera, y llenaron doce cestas. Dios provee con abundancia y también nos enseña a no desperdiciar.',
    'Jesus tomou os pães, deu graças e os repartiu, e fez o mesmo com os peixes, tanto quanto queriam. Depois mandou recolher o que sobrou para que nada se perdesse, e encheram doze cestos. Deus provê com abundância e também nos ensina a não desperdiçar.','Jo 6:11-13')],
  [('¿En qué situaciones se parecen a Felipe, mirando solo las cuentas?',
    'Em que situações vocês se parecem com Filipe, olhando só para as contas?'),
   ('¿Qué cosas pequeñas tienen ustedes que podrían poner en las manos de Jesús?',
    'Que coisas pequenas vocês têm que poderiam colocar nas mãos de Jesus?'),
   ('¿Por qué es importante dar gracias por lo poco antes de verlo multiplicado?',
    'Por que é importante dar graças pelo pouco antes de vê-lo multiplicado?'),
   ('¿Cómo podemos compartir lo que tenemos con los necesitados de nuestro barrio?',
    'Como podemos compartilhar o que temos com os necessitados do nosso bairro?')],
  ('Entregue a Jesús esta semana algo pequeño que usted tiene, un tiempo, un don o una ofrenda, para bendecir a otra persona.',
   'Entregue a Jesus nesta semana algo pequeno que você tem, um tempo, um dom ou uma oferta, para abençoar outra pessoa.'),
  'Fp 4:19',
  ('Señor Jesús, ponemos en Tus manos lo poco que tenemos. Multiplícalo para Tu gloria y para bendecir a muchos. Gracias por Tu provisión. Amén.',
   'Senhor Jesus, colocamos nas tuas mãos o pouco que temos. Multiplica-o para a tua glória e para abençoar muitos. Obrigado pela tua provisão. Amém.'))

L('Mc 10:47-52',
  ('Bartimeo, el ciego que gritó','Bartimeu, o cego que gritou'),
  ('Aprender de la fe persistente de Bartimeo y de la atención de Jesús a quien clama.',
   'Aprender com a fé persistente de Bartimeu e com a atenção de Jesus a quem clama.'),
  ('¿Alguna vez tuvieron que insistir mucho para conseguir algo importante?',
   'Vocês já tiveram que insistir muito para conseguir algo importante?'),
  ('Cuando Jesús salía de Jericó con una gran multitud, un ciego llamado Bartimeo estaba sentado junto al camino pidiendo limosna. Al oír que era Jesús de Nazaret, comenzó a gritar: Jesús, Hijo de David, ten misericordia de mí. Muchos lo reprendían para que callara, pero él gritaba mucho más. Jesús se detuvo y lo mandó llamar. Hoy vamos a ver cómo la fe de un hombre que no veía cambió su vida para siempre.',
   'Quando Jesus saía de Jericó com uma grande multidão, um cego chamado Bartimeu estava sentado à beira do caminho pedindo esmola. Ao ouvir que era Jesus de Nazaré, começou a gritar: Jesus, Filho de Davi, tem misericórdia de mim. Muitos o repreendiam para que se calasse, mas ele gritava ainda mais. Jesus parou e mandou chamá-lo. Hoje vamos ver como a fé de um homem que não enxergava mudou a sua vida para sempre.'),
  [('Una fe que no se calla','Uma fé que não se cala',
    'Bartimeo no podía ver, pero reconoció quién era Jesús: el Hijo de David, el Mesías prometido. Cuando lo mandaron callar, gritó más fuerte. Hay momentos en que la fe tiene que insistir aunque otros no entiendan. Jesús no se molesta con quien clama por misericordia.',
    'Bartimeu não podia ver, mas reconheceu quem Jesus era: o Filho de Davi, o Messias prometido. Quando mandaram que se calasse, gritou ainda mais forte. Há momentos em que a fé precisa insistir mesmo que outros não entendam. Jesus não se incomoda com quem clama por misericórdia.','Mc 10:47-48'),
   ('Arrojar la capa','Lançar fora a capa',
    'Cuando le dijeron que Jesús lo llamaba, Bartimeo arrojó su capa, se levantó y fue a Jesús. Para un mendigo, la capa podía ser su abrigo y el lugar donde recibía las monedas. Él dejó atrás lo que tenía para ir rápido a Jesús. A veces debemos soltar algo para responder a su llamado.',
    'Quando lhe disseram que Jesus o chamava, Bartimeu lançou fora a sua capa, levantou-se e foi até Jesus. Para um mendigo, a capa podia ser o seu agasalho e o lugar onde recebia as moedas. Ele deixou para trás o que tinha para ir depressa até Jesus. Às vezes precisamos soltar algo para responder ao seu chamado.','Mc 10:49-50'),
   ('La pregunta de Jesús','A pergunta de Jesus',
    'Jesús le preguntó qué quería que le hiciera, aunque la respuesta parecía obvia. Bartimeo respondió con claridad: que recobre la vista. Jesús le dijo que su fe lo había salvado, y enseguida recobró la vista y siguió a Jesús en el camino. Fue sanado y se convirtió en seguidor.',
    'Jesus lhe perguntou o que queria que lhe fizesse, embora a resposta parecesse óbvia. Bartimeu respondeu com clareza: que eu volte a ver. Jesus lhe disse que a sua fé o tinha salvado, e imediatamente ele voltou a ver e seguiu Jesus pelo caminho. Foi curado e se tornou um seguidor.','Mc 10:51-52')],
  [('¿Qué voces intentan hacernos callar cuando clamamos a Dios?',
    'Que vozes tentam nos fazer calar quando clamamos a Deus?'),
   ('¿Qué capa necesitamos arrojar para ir más rápido a Jesús?',
    'Que capa precisamos lançar fora para ir mais depressa até Jesus?'),
   ('¿Por qué Jesús hizo una pregunta cuya respuesta parecía obvia?',
    'Por que Jesus fez uma pergunta cuja resposta parecia óbvia?'),
   ('Si Jesús les preguntara hoy qué quieren que les haga, ¿qué responderían?',
    'Se Jesus perguntasse hoje o que vocês querem que ele faça, o que responderiam?')],
  ('Escriba con claridad su petición más importante y preséntela a Jesús cada día de esta semana con fe.',
   'Escreva com clareza o seu pedido mais importante e apresente-o a Jesus todos os dias desta semana com fé.'),
  'Sl 34:6',
  ('Jesús, Hijo de David, ten misericordia de nosotros. Queremos soltar lo que nos detiene y seguirte en el camino con fe. Amén.',
   'Jesus, Filho de Davi, tem misericórdia de nós. Queremos soltar o que nos detém e seguir-te pelo caminho com fé. Amém.'))

L('Jo 11:39-44',
  ('Lázaro, sal fuera','Lázaro, vem para fora'),
  ('Afirmar que Jesús es la resurrección y la vida, y que tiene poder aun sobre la muerte.',
   'Afirmar que Jesus é a ressurreição e a vida, e que tem poder até sobre a morte.'),
  ('¿Qué situación de la vida les parece imposible de cambiar?',
   'Que situação da vida parece a vocês impossível de mudar?'),
  ('Lázaro, amigo de Jesús, enfermó gravemente. Sus hermanas, Marta y María, avisaron a Jesús, pero él llegó cuando Lázaro ya llevaba cuatro días en la tumba. Las hermanas lloraban y pensaban que era demasiado tarde. Jesús lloró con ellas y luego fue al sepulcro. Mandó quitar la piedra, oró al Padre y clamó a gran voz: Lázaro, sal fuera. Y el que había muerto salió. Hoy vamos a ver que con Jesús nunca es demasiado tarde.',
   'Lázaro, amigo de Jesus, ficou gravemente doente. As suas irmãs, Marta e Maria, avisaram Jesus, mas ele chegou quando Lázaro já estava havia quatro dias no túmulo. As irmãs choravam e achavam que era tarde demais. Jesus chorou com elas e depois foi ao sepulcro. Mandou tirar a pedra, orou ao Pai e clamou em alta voz: Lázaro, vem para fora. E o que tinha morrido saiu. Hoje vamos ver que com Jesus nunca é tarde demais.'),
  [('Cuando Dios parece llegar tarde','Quando Deus parece chegar atrasado',
    'Marta y María dijeron lo mismo a Jesús: si hubieras estado aquí, mi hermano no habría muerto. Sentían que Jesús había llegado tarde. Pero él tenía un propósito mayor: mostrar la gloria de Dios. Los tiempos de Dios no siempre coinciden con los nuestros, pero su amor nunca falla.',
    'Marta e Maria disseram a mesma coisa a Jesus: se estivesses aqui, o meu irmão não teria morrido. Sentiam que Jesus tinha chegado atrasado. Mas ele tinha um propósito maior: mostrar a glória de Deus. Os tempos de Deus nem sempre coincidem com os nossos, mas o seu amor nunca falha.','Jo 11:21'),
   ('Yo soy la resurrección y la vida','Eu sou a ressurreição e a vida',
    'Antes del milagro, Jesús hizo una declaración: él es la resurrección y la vida; el que cree en él, aunque esté muerto, vivirá. Luego preguntó a Marta: ¿crees esto? La fe no es solo creer que Jesús puede hacer algo, sino creer en quién es él.',
    'Antes do milagre, Jesus fez uma declaração: ele é a ressurreição e a vida; quem crê nele, ainda que esteja morto, viverá. Depois perguntou a Marta: crês isto? A fé não é só crer que Jesus pode fazer algo, mas crer em quem ele é.','Jo 11:25-26'),
   ('Quitar la piedra y desatar','Tirar a pedra e desatar',
    'Jesús mandó quitar la piedra, aunque Marta dijo que ya olía mal. Después de resucitar a Lázaro, mandó que lo desataran. Jesús hizo lo imposible, pero pidió a las personas que hicieran su parte: mover la piedra y quitar las vendas. La iglesia también ayuda a desatar a los que Jesús levanta.',
    'Jesus mandou tirar a pedra, embora Marta dissesse que já cheirava mal. Depois de ressuscitar Lázaro, mandou que o desatassem. Jesus fez o impossível, mas pediu às pessoas que fizessem a sua parte: remover a pedra e tirar as faixas. A igreja também ajuda a desatar os que Jesus levanta.','Jo 11:39')],
  [('¿Cuándo sintieron que Dios llegaba tarde a una situación?',
    'Quando vocês sentiram que Deus estava chegando atrasado a uma situação?'),
   ('¿Qué significa para ustedes que Jesús es la resurrección y la vida?',
    'O que significa para vocês que Jesus é a ressurreição e a vida?'),
   ('¿Qué piedras debemos quitar para ver la obra de Dios?',
    'Que pedras precisamos tirar para ver a obra de Deus?'),
   ('¿Cómo podemos ayudar a desatar a los nuevos creyentes de su pasado?',
    'Como podemos ajudar a desatar os novos convertidos do seu passado?')],
  ('Ore esta semana por una situación que parece muerta y pregunte a Dios cuál es la piedra que usted puede quitar.',
   'Ore nesta semana por uma situação que parece morta e pergunte a Deus qual é a pedra que você pode tirar.'),
  'Jo 11:25',
  ('Señor Jesús, Tú eres la resurrección y la vida. Creemos que no hay nada imposible para Ti. Danos fe para esperar Tu tiempo y obedecer Tu voz. Amén.',
   'Senhor Jesus, tu és a ressurreição e a vida. Cremos que nada é impossível para ti. Dá-nos fé para esperar o teu tempo e obedecer à tua voz. Amém.'))

# ================================================================ Eu sou
S('eusou','Los «Yo soy» de Jesús','Os “Eu sou” de Jesus',
  'Seis estudios sobre las declaraciones de Jesús en el Evangelio de Juan que revelan quién es él.',
  'Seis estudos sobre as declarações de Jesus no Evangelho de João que revelam quem ele é.')

L('Jo 6:32-35',
  ('Yo soy el pan de vida','Eu sou o pão da vida'),
  ('Descubrir que solo Jesús satisface el hambre más profunda del ser humano.',
   'Descobrir que só Jesus satisfaz a fome mais profunda do ser humano.'),
  ('¿Qué comida les recuerda la casa de su infancia?',
   'Que comida lembra a vocês a casa da infância?'),
  ('Un día después de la multiplicación de los panes, la multitud buscó a Jesús otra vez. Él les dijo con franqueza que lo buscaban porque habían comido pan y se habían saciado. Ellos recordaron el maná que Dios dio en el desierto. Entonces Jesús declaró: Yo soy el pan de vida; el que a mí viene nunca tendrá hambre. En la Biblia, el pan representa lo esencial para vivir. Hoy vamos a ver por qué Jesús es el alimento que el alma necesita.',
   'Um dia depois da multiplicação dos pães, a multidão procurou Jesus de novo. Ele lhes disse com franqueza que o procuravam porque tinham comido pão e ficado satisfeitos. Eles se lembraram do maná que Deus deu no deserto. Então Jesus declarou: Eu sou o pão da vida; quem vem a mim nunca terá fome. Na Bíblia, o pão representa o essencial para viver. Hoje vamos ver por que Jesus é o alimento de que a alma precisa.'),
  [('Buscar a Jesús por lo que da','Buscar Jesus pelo que ele dá',
    'Jesús dijo que lo buscaban no por las señales, sino porque comieron pan. Es posible seguir a Jesús solo por los beneficios que esperamos. Él nos invita a trabajar no por la comida que perece, sino por la que permanece para vida eterna. Jesús es más que un proveedor: es el regalo mismo.',
    'Jesus disse que o procuravam não pelos sinais, mas porque comeram pão. É possível seguir Jesus só pelos benefícios que esperamos. Ele nos convida a trabalhar não pela comida que perece, mas pela que permanece para a vida eterna. Jesus é mais do que um provedor: é o próprio presente.','Jo 6:26-27'),
   ('El verdadero pan del cielo','O verdadeiro pão do céu',
    'El maná alimentó a Israel en el desierto, pero los que lo comieron murieron. Jesús dijo que el verdadero pan del cielo es el que da vida al mundo. El maná fue una provisión temporal; Jesús es la provisión eterna de Dios. En él encontramos la vida que no se acaba.',
    'O maná alimentou Israel no deserto, mas os que o comeram morreram. Jesus disse que o verdadeiro pão do céu é aquele que dá vida ao mundo. O maná foi uma provisão temporária; Jesus é a provisão eterna de Deus. Nele encontramos a vida que não acaba.','Jo 6:49-51'),
   ('Venir y creer','Vir e crer',
    'Jesús dijo que el que viene a él nunca tendrá hambre y el que cree en él nunca tendrá sed. Comer el pan de vida es venir a Jesús y creer en él cada día. El alma vacía no se llena con cosas, logros ni placeres, sino con una relación viva con Cristo.',
    'Jesus disse que quem vem a ele nunca terá fome e quem crê nele nunca terá sede. Comer o pão da vida é vir a Jesus e crer nele todos os dias. A alma vazia não se enche com coisas, conquistas nem prazeres, mas com um relacionamento vivo com Cristo.','Jo 6:35')],
  [('¿Con qué cosas intentan las personas llenar el vacío del alma?',
    'Com que coisas as pessoas tentam preencher o vazio da alma?'),
   ('¿Cómo saber si seguimos a Jesús por él o solo por lo que nos da?',
    'Como saber se seguimos Jesus por ele ou só pelo que ele nos dá?'),
   ('¿Qué significa en la práctica alimentarse de Jesús cada día?',
    'O que significa na prática alimentar-se de Jesus todos os dias?'),
   ('¿Cómo podemos compartir el pan de vida con otros?',
    'Como podemos compartilhar o pão da vida com os outros?')],
  ('Antes de cada comida de esta semana, agradezca a Dios por Jesús, el pan de vida, y no solo por el alimento.',
   'Antes de cada refeição desta semana, agradeça a Deus por Jesus, o pão da vida, e não só pelo alimento.'),
  'Jo 6:35',
  ('Señor Jesús, Tú eres el pan de vida. Perdónanos por buscarte solo por lo que das. Queremos buscarte por quién eres y alimentarnos de Ti cada día. Amén.',
   'Senhor Jesus, tu és o pão da vida. Perdoa-nos por te buscar só pelo que dás. Queremos te buscar por quem tu és e nos alimentar de ti todos os dias. Amém.'))

L('Jo 8:12',
  ('Yo soy la luz del mundo','Eu sou a luz do mundo'),
  ('Entender que Jesús nos saca de la oscuridad y nos llama a caminar en su luz.',
   'Entender que Jesus nos tira das trevas e nos chama a andar na sua luz.'),
  ('¿Cómo se sintieron alguna vez cuando se cortó la luz de noche?',
   'Como vocês se sentiram alguma vez quando faltou luz à noite?'),
  ('Jesús hizo esta declaración en el templo de Jerusalén, en el contexto de una gran fiesta. Dijo: Yo soy la luz del mundo; el que me sigue no andará en tinieblas, sino que tendrá la luz de la vida. La oscuridad en la Biblia representa el pecado, la ignorancia de Dios y la confusión. La luz representa la verdad, la salvación y la presencia de Dios. Hoy vamos a ver qué significa seguir a Jesús como luz y reflejar esa luz a otros.',
   'Jesus fez essa declaração no templo de Jerusalém, no contexto de uma grande festa. Disse: Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida. A escuridão na Bíblia representa o pecado, a ignorância de Deus e a confusão. A luz representa a verdade, a salvação e a presença de Deus. Hoje vamos ver o que significa seguir Jesus como luz e refletir essa luz para os outros.'),
  [('La luz que vino al mundo','A luz que veio ao mundo',
    'Juan escribe que la luz verdadera, que alumbra a todo hombre, venía a este mundo. Pero también dice que los hombres amaron más las tinieblas que la luz, porque sus obras eran malas. La luz de Jesús revela lo que está escondido, no para avergonzarnos, sino para sanarnos.',
    'João escreve que a luz verdadeira, que ilumina todo homem, estava vindo ao mundo. Mas também diz que os homens amaram mais as trevas do que a luz, porque as suas obras eram más. A luz de Jesus revela o que está escondido, não para nos envergonhar, mas para nos curar.','Jo 3:19-21'),
   ('Seguir la luz','Seguir a luz',
    'Jesús prometió que el que lo sigue no andará en tinieblas. Seguir a Jesús es caminar de acuerdo con su palabra cada día. Cuando nos apartamos de él, volvemos a tropezar en la oscuridad. Cuando lo seguimos de cerca, aun en tiempos difíciles, sabemos por dónde caminar.',
    'Jesus prometeu que quem o segue não andará em trevas. Seguir Jesus é caminhar de acordo com a sua palavra todos os dias. Quando nos afastamos dele, voltamos a tropeçar na escuridão. Quando o seguimos de perto, mesmo em tempos difíceis, sabemos por onde andar.','1Jo 1:7'),
   ('«Vosotros sois la luz del mundo»','Vós sois a luz do mundo',
    'En el Sermón del Monte, Jesús dijo a sus discípulos que ellos eran la luz del mundo. La luna no tiene luz propia, pero refleja la luz del sol. Del mismo modo, el creyente refleja la luz de Cristo con sus buenas obras, para que otros glorifiquen al Padre.',
    'No Sermão do Monte, Jesus disse aos discípulos que eles eram a luz do mundo. A lua não tem luz própria, mas reflete a luz do sol. Do mesmo modo, o crente reflete a luz de Cristo com as suas boas obras, para que outros glorifiquem o Pai.','Mt 5:14-16')],
  [('¿Qué tinieblas ven hoy en la sociedad y en las familias?',
    'Que trevas vocês veem hoje na sociedade e nas famílias?'),
   ('¿Por qué algunas personas prefieren quedarse en la oscuridad?',
    'Por que algumas pessoas preferem ficar na escuridão?'),
   ('¿Qué significa caminar en la luz en el trabajo o en la escuela?',
    'O que significa andar na luz no trabalho ou na escola?'),
   ('¿Cómo podemos reflejar la luz de Cristo en nuestro barrio?',
    'Como podemos refletir a luz de Cristo no nosso bairro?')],
  ('Haga esta semana una buena obra discreta para alguien que está pasando por un momento oscuro.',
   'Faça nesta semana uma boa obra discreta para alguém que está passando por um momento escuro.'),
  'Jo 8:12',
  ('Señor Jesús, Tú eres la luz del mundo. Ilumina lo que está escondido en nosotros y ayúdanos a reflejar Tu luz donde vivimos y trabajamos. Amén.',
   'Senhor Jesus, tu és a luz do mundo. Ilumina o que está escondido em nós e ajuda-nos a refletir a tua luz onde moramos e trabalhamos. Amém.'))

L('Jo 10:7-10',
  ('Yo soy la puerta','Eu sou a porta'),
  ('Entender que Jesús es el único acceso a la salvación y a la vida abundante.',
   'Entender que Jesus é o único acesso à salvação e à vida abundante.'),
  ('¿Cuántas llaves llevan normalmente con ustedes? ¿Qué puertas abren?',
   'Quantas chaves vocês costumam carregar? Que portas elas abrem?'),
  ('En tiempos de Jesús, los pastores reunían las ovejas por la noche en un redil, un corral de piedras con una sola entrada. Esa abertura era el único lugar por donde las ovejas entraban y salían. Jesús usó esa imagen y dijo: Yo soy la puerta; el que por mí entrare, será salvo, y entrará y saldrá, y hallará pastos. Hoy vamos a ver qué significa que Jesús sea la puerta y qué clase de vida hay del otro lado.',
   'No tempo de Jesus, os pastores reuniam as ovelhas à noite num aprisco, um curral de pedras com uma única entrada. Essa abertura era o único lugar por onde as ovelhas entravam e saíam. Jesus usou essa imagem e disse: Eu sou a porta; se alguém entrar por mim, será salvo; entrará, sairá e achará pastagens. Hoje vamos ver o que significa Jesus ser a porta e que tipo de vida há do outro lado.'),
  [('Una sola puerta','Uma só porta',
    'Jesús no dijo que es una puerta entre muchas, sino la puerta. Pedro predicó que en ningún otro hay salvación, porque no hay otro nombre bajo el cielo dado a los hombres en que podamos ser salvos. Esta verdad no nos hace orgullosos, sino urgentes para mostrar la puerta a otros.',
    'Jesus não disse que é uma porta entre muitas, mas a porta. Pedro pregou que em nenhum outro há salvação, porque não há outro nome debaixo do céu, dado aos homens, pelo qual devamos ser salvos. Essa verdade não nos torna orgulhosos, mas nos dá urgência para mostrar a porta aos outros.','At 4:12'),
   ('Seguridad y pasto','Segurança e pasto',
    'Jesús prometió que quien entra por él será salvo, entrará y saldrá y hallará pastos. Dentro del redil hay protección; fuera, con el pastor, hay alimento. La vida con Jesús no es encierro, sino seguridad y provisión. Él cuida y alimenta a sus ovejas.',
    'Jesus prometeu que quem entra por ele será salvo, entrará e sairá e achará pastagens. Dentro do aprisco há proteção; fora, com o pastor, há alimento. A vida com Jesus não é prisão, mas segurança e provisão. Ele protege e alimenta as suas ovelhas.','Jo 10:9'),
   ('Vida en abundancia','Vida em abundância',
    'Jesús comparó al ladrón, que viene para hurtar, matar y destruir, con su propia misión: yo he venido para que tengan vida, y para que la tengan en abundancia. La vida abundante no es tener todo lo que queremos, sino una vida plena en comunión con Dios, aun en medio de las dificultades.',
    'Jesus comparou o ladrão, que vem para roubar, matar e destruir, com a sua própria missão: eu vim para que tenham vida, e a tenham em abundância. A vida abundante não é ter tudo o que queremos, mas uma vida plena em comunhão com Deus, mesmo no meio das dificuldades.','Jo 10:10')],
  [('¿Por qué a algunas personas les molesta que Jesús sea la única puerta?',
    'Por que algumas pessoas se incomodam com o fato de Jesus ser a única porta?'),
   ('¿Qué ladrones intentan robar la paz y la fe hoy?',
    'Que ladrões tentam roubar a paz e a fé hoje?'),
   ('¿Cómo describirían la vida abundante que Jesús ofrece?',
    'Como vocês descreveriam a vida abundante que Jesus oferece?'),
   ('¿A quién podemos mostrar la puerta esta semana?',
    'A quem podemos mostrar a porta nesta semana?')],
  ('Comparta esta semana con alguien, con palabras sencillas, cómo encontró en Jesús la puerta de la salvación.',
   'Compartilhe nesta semana com alguém, com palavras simples, como você encontrou em Jesus a porta da salvação.'),
  'Jo 10:9',
  ('Señor Jesús, gracias porque Tú eres la puerta. Gracias por la salvación, la protección y la vida abundante que hay en Ti. Ayúdanos a mostrar el camino a otros. Amén.',
   'Senhor Jesus, obrigado porque tu és a porta. Obrigado pela salvação, pela proteção e pela vida abundante que há em ti. Ajuda-nos a mostrar o caminho aos outros. Amém.'))

L('Jo 10:11-15',
  ('Yo soy el buen pastor','Eu sou o bom pastor'),
  ('Conocer a Jesús como el buen pastor que da su vida por sus ovejas, las conoce y las guía.',
   'Conhecer Jesus como o bom pastor que dá a vida pelas suas ovelhas, as conhece e as guia.'),
  ('¿Alguna vez cuidaron un animal? ¿Qué necesitaba de ustedes?',
   'Vocês já cuidaram de algum animal? Do que ele precisava?'),
  ('En Israel todos conocían el trabajo del pastor: cuidaba el rebaño de día y de noche, buscaba pasto y agua, curaba a las ovejas heridas y las defendía de los lobos. David, que fue pastor, escribió: Jehová es mi pastor; nada me faltará. Jesús tomó esa imagen y dijo: Yo soy el buen pastor. Hoy vamos a ver tres cosas que hace el buen pastor y qué significa para nosotros ser sus ovejas.',
   'Em Israel todos conheciam o trabalho do pastor: cuidava do rebanho de dia e de noite, procurava pasto e água, tratava das ovelhas feridas e as defendia dos lobos. Davi, que foi pastor, escreveu: O Senhor é o meu pastor; nada me faltará. Jesus tomou essa imagem e disse: Eu sou o bom pastor. Hoje vamos ver três coisas que o bom pastor faz e o que significa para nós ser suas ovelhas.'),
  [('Da su vida','Dá a sua vida',
    'Jesús dijo que el buen pastor da su vida por las ovejas. El asalariado huye cuando ve venir al lobo, porque las ovejas no son suyas. Jesús no huyó: fue a la cruz por nosotros. Ningún otro líder, religión o maestro hizo esto. Su amor fue probado con su propia vida.',
    'Jesus disse que o bom pastor dá a vida pelas ovelhas. O mercenário foge quando vê o lobo chegar, porque as ovelhas não são suas. Jesus não fugiu: foi para a cruz por nós. Nenhum outro líder, religião ou mestre fez isso. O seu amor foi provado com a sua própria vida.','Jo 10:11-13'),
   ('Conoce a sus ovejas','Conhece as suas ovelhas',
    'El buen pastor conoce a sus ovejas, y ellas lo conocen a él. Jesús no nos ve como un número en la multitud. Conoce nuestra historia, nuestras heridas y nuestras luchas. Y nos invita a conocerlo cada día más, aprendiendo a reconocer su voz en su Palabra.',
    'O bom pastor conhece as suas ovelhas, e elas o conhecem. Jesus não nos vê como um número na multidão. Conhece a nossa história, as nossas feridas e as nossas lutas. E nos convida a conhecê-lo cada dia mais, aprendendo a reconhecer a sua voz na sua Palavra.','Jo 10:14'),
   ('Guía y provee','Guia e provê',
    'El Salmo 23 describe al pastor que lleva a pastos delicados, junto a aguas de reposo, y guía por sendas de justicia. Aun en el valle de sombra de muerte, su vara y su cayado infunden aliento. Las ovejas no necesitan conocer todo el camino; necesitan seguir al pastor.',
    'O Salmo 23 descreve o pastor que leva a pastos verdejantes, junto a águas tranquilas, e guia pelas veredas da justiça. Mesmo no vale da sombra da morte, a sua vara e o seu cajado consolam. As ovelhas não precisam conhecer todo o caminho; precisam seguir o pastor.','Sl 23:1-4')],
  [('¿Qué diferencia hay entre un pastor y un asalariado?',
    'Que diferença há entre um pastor e um mercenário?'),
   ('¿Cómo se siente saber que Jesús nos conoce personalmente?',
    'Como é saber que Jesus nos conhece pessoalmente?'),
   ('¿Cómo podemos aprender a reconocer la voz del buen pastor?',
    'Como podemos aprender a reconhecer a voz do bom pastor?'),
   ('¿Qué parte del Salmo 23 les habla más en este momento?',
    'Que parte do Salmo 23 fala mais com vocês neste momento?')],
  ('Lea el Salmo 23 cada mañana de esta semana y entregue al buen pastor una preocupación diferente cada día.',
   'Leia o Salmo 23 todas as manhãs desta semana e entregue ao bom pastor uma preocupação diferente a cada dia.'),
  'Sl 23:1',
  ('Señor Jesús, Tú eres nuestro buen pastor. Gracias por dar Tu vida por nosotros y por conocernos. Enséñanos a oír Tu voz y a seguirte. Amén.',
   'Senhor Jesus, tu és o nosso bom pastor. Obrigado por dar a tua vida por nós e por nos conhecer. Ensina-nos a ouvir a tua voz e a seguir-te. Amém.'))

L('Jo 14:4-6',
  ('Yo soy el camino, la verdad y la vida','Eu sou o caminho, a verdade e a vida'),
  ('Afirmar que Jesús es el camino al Padre, la verdad que libera y la vida que permanece.',
   'Afirmar que Jesus é o caminho para o Pai, a verdade que liberta e a vida que permanece.'),
  ('¿Alguna vez se perdieron buscando una dirección? ¿Cómo encontraron el camino?',
   'Vocês já se perderam procurando um endereço? Como encontraram o caminho?'),
  ('En la última cena, Jesús habló a sus discípulos sobre su partida y la casa del Padre. Tomás, con sinceridad, dijo: Señor, no sabemos a dónde vas; ¿cómo podemos saber el camino? Jesús respondió con una de sus declaraciones más conocidas: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre sino por mí. Hoy vamos a ver cada una de estas tres palabras y lo que significan para nuestra vida.',
   'Na última ceia, Jesus falou aos discípulos sobre a sua partida e a casa do Pai. Tomé, com sinceridade, disse: Senhor, não sabemos para onde vais; como podemos saber o caminho? Jesus respondeu com uma das suas declarações mais conhecidas: Eu sou o caminho, a verdade e a vida; ninguém vem ao Pai senão por mim. Hoje vamos ver cada uma dessas três palavras e o que elas significam para a nossa vida.'),
  [('El camino','O caminho',
    'Jesús no dijo que conoce el camino o que enseña el camino, sino que él es el camino. No llegamos al Padre por una lista de reglas, sino por una persona. Seguir a Jesús es caminar con él. Tomás tenía dudas, y Jesús no lo despreció: le dio una respuesta.',
    'Jesus não disse que conhece o caminho ou que ensina o caminho, mas que ele é o caminho. Não chegamos ao Pai por uma lista de regras, mas por uma pessoa. Seguir Jesus é caminhar com ele. Tomé tinha dúvidas, e Jesus não o desprezou: deu-lhe uma resposta.','Jo 14:6'),
   ('La verdad','A verdade',
    'En un mundo de opiniones cambiantes, Jesús se presenta como la verdad. Él dijo que si permanecemos en su palabra seremos verdaderamente sus discípulos, conoceremos la verdad y la verdad nos hará libres. La verdad de Jesús libera de las mentiras sobre Dios, sobre nosotros y sobre la vida.',
    'Num mundo de opiniões que mudam, Jesus se apresenta como a verdade. Ele disse que, se permanecermos na sua palavra, seremos verdadeiramente seus discípulos, conheceremos a verdade e a verdade nos libertará. A verdade de Jesus liberta das mentiras sobre Deus, sobre nós e sobre a vida.','Jo 8:31-32'),
   ('La vida','A vida',
    'Jesús es la vida porque en él está la vida eterna, que empieza ahora y no termina con la muerte. Juan escribe que la vida eterna es conocer al único Dios verdadero y a Jesucristo, a quien él envió. No es solo vivir para siempre, sino vivir en relación con Dios.',
    'Jesus é a vida porque nele está a vida eterna, que começa agora e não termina com a morte. João escreve que a vida eterna é conhecer o único Deus verdadeiro e Jesus Cristo, a quem ele enviou. Não é só viver para sempre, mas viver em relacionamento com Deus.','Jo 17:3')],
  [('¿Qué dudas como las de Tomás tienen las personas hoy sobre el camino a Dios?',
    'Que dúvidas como as de Tomé as pessoas têm hoje sobre o caminho para Deus?'),
   ('¿Qué mentiras comunes sobre Dios o sobre nosotros mismos necesitamos dejar?',
    'Que mentiras comuns sobre Deus ou sobre nós mesmos precisamos abandonar?'),
   ('¿Qué diferencia hay entre conocer sobre Jesús y conocer a Jesús?',
    'Que diferença há entre conhecer sobre Jesus e conhecer Jesus?'),
   ('¿Cómo podemos responder con amor a quien dice que todos los caminos llevan a Dios?',
    'Como podemos responder com amor a quem diz que todos os caminhos levam a Deus?')],
  ('Memorice Juan 14:6 y piense en una persona con quien pueda compartir este versículo con respeto y amor.',
   'Memorize João 14:6 e pense numa pessoa com quem possa compartilhar esse versículo com respeito e amor.'),
  'Jo 14:6',
  ('Señor Jesús, Tú eres el camino, la verdad y la vida. Gracias porque por Ti llegamos al Padre. Guíanos en Tu verdad y llénanos de Tu vida. Amén.',
   'Senhor Jesus, tu és o caminho, a verdade e a vida. Obrigado porque por ti chegamos ao Pai. Guia-nos na tua verdade e enche-nos da tua vida. Amém.'))

L('Jo 15:1-5',
  ('Yo soy la vid verdadera','Eu sou a videira verdadeira'),
  ('Comprender que la vida cristiana fructífera depende de permanecer unidos a Jesús.',
   'Compreender que a vida cristã frutífera depende de permanecer unido a Jesus.'),
  ('¿Qué pasa con una rama cuando se corta de la planta?',
   'O que acontece com um galho quando é cortado da planta?'),
  ('En su última noche con los discípulos, Jesús usó una imagen conocida en Israel: la vid. Dijo: Yo soy la vid verdadera, y mi Padre es el labrador. Los creyentes son las ramas. Una rama no da fruto por esfuerzo propio, sino por estar unida a la vid, de donde recibe la savia. Jesús repitió muchas veces la palabra permanecer. Hoy vamos a ver qué significa permanecer en Cristo y por qué el Padre poda las ramas que dan fruto.',
   'Na sua última noite com os discípulos, Jesus usou uma imagem conhecida em Israel: a videira. Disse: Eu sou a videira verdadeira, e meu Pai é o agricultor. Os crentes são os ramos. Um ramo não dá fruto por esforço próprio, mas por estar unido à videira, de onde recebe a seiva. Jesus repetiu muitas vezes a palavra permanecer. Hoje vamos ver o que significa permanecer em Cristo e por que o Pai poda os ramos que dão fruto.'),
  [('Permanecer en él','Permanecer nele',
    'Jesús dijo: «Permaneced en mí, y yo en vosotros». Como la rama no puede llevar fruto por sí misma, tampoco nosotros si no permanecemos en él. Permanecer es mantener una relación diaria con Jesús: oración, Palabra, obediencia y comunión con los hermanos.',
    'Jesus disse: permanecei em mim, e eu em vós. Como o ramo não pode dar fruto por si mesmo, assim também nós, se não permanecermos nele. Permanecer é manter um relacionamento diário com Jesus: oração, Palavra, obediência e comunhão com os irmãos.','Jo 15:4'),
   ('La poda del Padre','A poda do Pai',
    'El Padre limpia las ramas que dan fruto para que den más fruto. La poda duele, porque corta lo que estorba. A veces Dios usa pruebas, correcciones y pérdidas para quitar lo que nos impide crecer. Su propósito no es destruirnos, sino hacernos más fructíferos.',
    'O Pai limpa os ramos que dão fruto para que deem mais fruto. A poda dói, porque corta o que atrapalha. Às vezes Deus usa provas, correções e perdas para tirar o que nos impede de crescer. O seu propósito não é nos destruir, mas nos tornar mais frutíferos.','Jo 15:2'),
   ('Sin mí nada podéis hacer','Sem mim nada podeis fazer',
    'Jesús fue claro: separados de él nada podemos hacer. Podemos estar muy ocupados con actividades, pero sin la vida de Cristo no habrá fruto que permanezca. Esto nos libra del orgullo y del cansancio de intentar todo con nuestras fuerzas. El fruto es obra de él en nosotros.',
    'Jesus foi claro: separados dele nada podemos fazer. Podemos estar muito ocupados com atividades, mas sem a vida de Cristo não haverá fruto que permaneça. Isso nos livra do orgulho e do cansaço de tentar tudo com as nossas forças. O fruto é obra dele em nós.','Jo 15:5')],
  [('¿Qué señales muestran que una persona está permaneciendo en Cristo?',
    'Que sinais mostram que uma pessoa está permanecendo em Cristo?'),
   ('¿Qué podas de Dios vivieron y qué fruto produjeron después?',
    'Que podas de Deus vocês viveram e que fruto elas produziram depois?'),
   ('¿Por qué es tan fácil intentar dar fruto con nuestras propias fuerzas?',
    'Por que é tão fácil tentar dar fruto com as nossas próprias forças?'),
   ('¿Qué hábito les ayudaría a permanecer más unidos a Jesús?',
    'Que hábito ajudaria vocês a permanecer mais unidos a Jesus?')],
  ('Identifique algo que está robando su tiempo con Jesús y entréguelo a Dios esta semana.',
   'Identifique algo que está roubando o seu tempo com Jesus e entregue-o a Deus nesta semana.'),
  'Jo 15:5',
  ('Señor Jesús, Tú eres la vid y nosotros las ramas. Ayúdanos a permanecer en Ti cada día. Padre, poda lo que estorba para que demos más fruto. Amén.',
   'Senhor Jesus, tu és a videira e nós os ramos. Ajuda-nos a permanecer em ti todos os dias. Pai, poda o que atrapalha para que demos mais fruto. Amém.'))

# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas|vosotros)\b',re.I)
TU_CS=re.compile(r'\b(tú|tu|tus|te|ti|contigo)\b')  # na oração (dirigida a Deus) só se aceita a forma com maiúscula: Tú, Tu, Te, Ti
QUOTE=re.compile(r'«[^»]*»')
KEYS='milagres eusou'.split()
OLDB={}
for _f in ('licoes-1.json','licoes-2.json','licoes-3.json'):
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
    out=os.path.join(HERE,'licoes-4.json')
    json.dump({'series':SER},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['l']) for o in SER)
    print('ok: %d séries, %d lições, %d referências -> %s'%(len(SER),n,len(refs),out))
if __name__=='__main__':main()
