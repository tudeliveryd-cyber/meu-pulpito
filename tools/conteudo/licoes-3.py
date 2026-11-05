# Lições de estudo bíblico para células e Escola Dominical (Meu Púlpito) — parte 3.
# 2 séries x 6 lições: primeiros (novos convertidos), parabolas. Cada texto é um par [ES, PT].
# Cada lição: título, texto-base, objetivo, quebra-gelo, introdução (para o líder ler),
# 3 pontos com explicação e referência, perguntas de discussão, aplicação, versículo para memorizar e oração.
# Uso: python3 tools/conteudo/licoes-3.py          -> valida e grava tools/conteudo/licoes-3.json
#      python3 tools/conteudo/licoes-3.py --print  -> imprime o texto de cada referência nas duas Bíblias
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



# ================================================================ Primeiros passos na fé
S('primeiros','Primeros pasos en la fe','Primeiros passos na fé',
  'Seis estudios para nuevos creyentes: salvación, seguridad, bautismo, oración, Biblia y vida en la iglesia.',
  'Seis estudos para novos convertidos: salvação, segurança, batismo, oração, Bíblia e vida na igreja.')

L('Ef 2:8-10',
  ('La salvación, un regalo de Dios','A salvação, um presente de Deus'),
  ('Entender que la salvación es un regalo que recibimos por fe en Jesús, y no un premio por nuestras obras.',
   'Entender que a salvação é um presente que recebemos pela fé em Jesus, e não um prêmio pelas nossas obras.'),
  ('¿Cuál fue el regalo más inesperado que recibieron alguna vez?',
   'Qual foi o presente mais inesperado que vocês já receberam?'),
  ('Mucha gente piensa que para ir al cielo hay que portarse bien y acumular buenas acciones. Pero la Biblia enseña algo diferente y mucho mejor: la salvación es un regalo de Dios. Pablo escribe a los efesios que somos salvos por gracia, por medio de la fe, y que esto no viene de nosotros. Hoy vamos a ver qué significa recibir este regalo, por qué no se puede comprar y cómo cambia la vida de quien lo recibe.',
   'Muita gente pensa que, para ir para o céu, é preciso se comportar bem e acumular boas ações. Mas a Bíblia ensina algo diferente e muito melhor: a salvação é um presente de Deus. Paulo escreve aos efésios que somos salvos pela graça, por meio da fé, e que isso não vem de nós. Hoje vamos ver o que significa receber esse presente, por que ele não pode ser comprado e como muda a vida de quem o recebe.'),
  [('Por gracia','Pela graça',
    'Gracia es el favor que Dios nos da sin que lo merezcamos. Todos pecamos y estábamos lejos de él, pero Dios nos amó y envió a Jesús a morir en nuestro lugar. La salvación empieza en el corazón de Dios, no en nuestro esfuerzo. Por eso nadie puede decir que la ganó: la recibimos con gratitud, como se recibe un regalo.',
    'Graça é o favor que Deus nos dá sem que mereçamos. Todos pecamos e estávamos longe dele, mas Deus nos amou e enviou Jesus para morrer em nosso lugar. A salvação começa no coração de Deus, não no nosso esforço. Por isso ninguém pode dizer que a conquistou: nós a recebemos com gratidão, como se recebe um presente.','Ef 2:8'),
   ('No por obras','Não por obras',
    'Pablo dice que Dios nos salvó no por obras de justicia que nosotros hubiéramos hecho, sino por su misericordia. Si la salvación dependiera de nuestras obras, nunca sabríamos si hicimos lo suficiente. Las buenas obras son importantes, pero no son el precio de la salvación. Cristo ya pagó el precio completo en la cruz.',
    'Paulo diz que Deus nos salvou não por obras de justiça que nós tivéssemos feito, mas pela sua misericórdia. Se a salvação dependesse das nossas obras, nunca saberíamos se fizemos o suficiente. As boas obras são importantes, mas não são o preço da salvação. Cristo já pagou o preço completo na cruz.','Tt 3:5'),
   ('Para buenas obras','Para boas obras',
    'Aunque no somos salvos por obras, sí somos salvos para hacer buenas obras. Quien recibió el regalo de Dios empieza a vivir de una manera nueva. Pablo dice que si alguno está en Cristo, nueva criatura es: las cosas viejas pasaron. Las buenas obras son el fruto de la salvación, no su raíz.',
    'Embora não sejamos salvos por obras, somos salvos para praticar boas obras. Quem recebeu o presente de Deus começa a viver de um jeito novo. Paulo diz que, se alguém está em Cristo, é nova criatura: as coisas antigas já passaram. As boas obras são o fruto da salvação, não a sua raiz.','2Co 5:17')],
  [('¿Por qué es tan difícil para algunas personas aceptar que la salvación es un regalo?',
    'Por que é tão difícil para algumas pessoas aceitar que a salvação é um presente?'),
   ('¿Qué diferencia hay entre hacer buenas obras para ser salvo y hacerlas porque ya fuimos salvados?',
    'Que diferença há entre fazer boas obras para ser salvo e fazê-las porque já fomos salvos?'),
   ('¿Qué cosas viejas empezaron a pasar en su vida desde que conoció a Cristo?',
    'Que coisas antigas começaram a passar na sua vida desde que você conheceu Cristo?'),
   ('¿Cómo podemos explicar esta verdad a un familiar con palabras sencillas?',
    'Como podemos explicar essa verdade a um familiar com palavras simples?')],
  ('Agradezca a Dios cada día de esta semana por el regalo de la salvación y cuente a una persona lo que Jesús hizo por usted.',
   'Agradeça a Deus todos os dias desta semana pelo presente da salvação e conte a uma pessoa o que Jesus fez por você.'),
  'Ef 2:8',
  ('Padre, gracias por el regalo de la salvación. No lo merecíamos, pero Tú nos amaste en Cristo. Ayúdanos a vivir como nuevas criaturas y a hacer el bien por gratitud. En el nombre de Jesús, amén.',
   'Pai, obrigado pelo presente da salvação. Não merecíamos, mas tu nos amaste em Cristo. Ajuda-nos a viver como novas criaturas e a fazer o bem por gratidão. Em nome de Jesus, amém.'))

L('Jo 10:27-29',
  ('La seguridad de la salvación','A segurança da salvação'),
  ('Ayudar al nuevo creyente a tener certeza de su salvación, basada en las promesas de Dios y no en sus emociones.',
   'Ajudar o novo convertido a ter certeza da sua salvação, baseada nas promessas de Deus e não nas suas emoções.'),
  ('¿En qué cosas de la vida diaria confiamos sin pensarlo dos veces?',
   'Em que coisas do dia a dia confiamos sem pensar duas vezes?'),
  ('Muchos nuevos creyentes tienen días en que se sienten cerca de Dios y otros en que dudan si de verdad son salvos. Las emociones cambian con el cansancio, los problemas o el clima. Por eso Juan escribió su carta para que los creyentes supieran que tienen vida eterna. La seguridad de la salvación no se apoya en lo que sentimos, sino en lo que Dios dijo y en lo que Cristo hizo. Hoy vamos a estudiar tres razones para tener esta certeza.',
   'Muitos novos convertidos têm dias em que se sentem perto de Deus e outros em que duvidam se são mesmo salvos. As emoções mudam com o cansaço, os problemas ou o clima. Por isso João escreveu a sua carta para que os crentes soubessem que têm a vida eterna. A segurança da salvação não se apoia no que sentimos, mas no que Deus disse e no que Cristo fez. Hoje vamos estudar três razões para ter essa certeza.'),
  [('La promesa de Dios','A promessa de Deus',
    'Juan dice que Dios nos ha dado vida eterna, y esta vida está en su Hijo. El que tiene al Hijo tiene la vida. No dice que tal vez la tenga, sino que la tiene. Cuando dudamos, debemos volver a lo que Dios prometió. Su palabra es más firme que nuestros sentimientos de un día.',
    'João diz que Deus nos deu a vida eterna, e essa vida está no seu Filho. Quem tem o Filho tem a vida. Não diz que talvez tenha, mas que tem. Quando duvidamos, devemos voltar ao que Deus prometeu. A sua palavra é mais firme do que os nossos sentimentos de um dia.','1Jo 5:11-12'),
   ('La mano de Jesús','A mão de Jesus',
    'Jesús dijo que da vida eterna a sus ovejas y que nadie las arrebatará de su mano, ni de la mano de su Padre. Nuestra seguridad no depende de lo fuerte que nosotros nos agarramos de Dios, sino de lo fuerte que él nos sostiene. El creyente puede descansar en las manos del Buen Pastor.',
    'Jesus disse que dá a vida eterna às suas ovelhas e que ninguém as arrebatará da sua mão, nem da mão do seu Pai. A nossa segurança não depende de quão forte nós nos seguramos em Deus, mas de quão forte ele nos sustenta. O crente pode descansar nas mãos do Bom Pastor.','Jo 10:28-29'),
   ('El testimonio del Espíritu','O testemunho do Espírito',
    'Pablo escribe que el Espíritu mismo da testimonio a nuestro espíritu de que somos hijos de Dios. Además de la promesa escrita, Dios pone en el corazón del creyente una convicción interior y lo va transformando. El deseo de agradar a Dios, de orar y de estar con los hermanos son señales de que su Espíritu vive en nosotros.',
    'Paulo escreve que o próprio Espírito dá testemunho ao nosso espírito de que somos filhos de Deus. Além da promessa escrita, Deus coloca no coração do crente uma convicção interior e vai transformando a sua vida. O desejo de agradar a Deus, de orar e de estar com os irmãos são sinais de que o seu Espírito vive em nós.','Rm 8:16')],
  [('¿En qué momentos es más común dudar de la salvación?',
    'Em que momentos é mais comum duvidar da salvação?'),
   ('¿Por qué no es seguro basar la salvación en lo que sentimos?',
    'Por que não é seguro basear a salvação no que sentimos?'),
   ('¿Qué cambia en nuestra vida saber que Jesús nos sostiene en su mano?',
    'O que muda na nossa vida saber que Jesus nos segura na sua mão?'),
   ('¿Qué señales de la obra del Espíritu pueden ver en sus vidas?',
    'Que sinais da obra do Espírito vocês conseguem ver na sua vida?')],
  ('Memorice 1 Juan 5:13 y repítalo en voz alta cada vez que aparezca la duda esta semana.',
   'Memorize 1 João 5:13 e repita em voz alta toda vez que a dúvida aparecer nesta semana.'),
  '1Jo 5:13',
  ('Señor Jesús, gracias porque en Ti tenemos vida eterna. Cuando lleguen las dudas, recuérdanos Tus promesas. Gracias porque nadie nos arrebatará de Tu mano. Amén.',
   'Senhor Jesus, obrigado porque em ti temos a vida eterna. Quando vierem as dúvidas, lembra-nos das tuas promessas. Obrigado porque ninguém nos arrebatará da tua mão. Amém.'))

L('Rm 6:3-4',
  ('El bautismo en las aguas','O batismo nas águas'),
  ('Comprender el significado del bautismo en las aguas como obediencia a Jesús y testimonio público de la nueva vida.',
   'Compreender o significado do batismo nas águas como obediência a Jesus e testemunho público da nova vida.'),
  ('¿Recuerdan alguna ceremonia importante de su vida, como una graduación o una boda? ¿Qué representaba?',
   'Vocês se lembram de alguma cerimônia importante da sua vida, como uma formatura ou um casamento? O que ela representava?'),
  ('Cuando una persona recibe a Cristo, una de las primeras preguntas es: ¿y ahora qué hago? Uno de los primeros pasos que la Biblia muestra es el bautismo en las aguas. En el libro de Hechos, los que creían eran bautizados. El bautismo no es lo que nos salva, pero es un mandamiento de Jesús y una señal visible de lo que pasó por dentro. Hoy vamos a estudiar por qué bautizarnos y qué significa este acto.',
   'Quando uma pessoa recebe Cristo, uma das primeiras perguntas é: e agora, o que faço? Um dos primeiros passos que a Bíblia mostra é o batismo nas águas. No livro de Atos, os que criam eram batizados. O batismo não é o que nos salva, mas é um mandamento de Jesus e um sinal visível do que aconteceu por dentro. Hoje vamos estudar por que nos batizar e o que significa esse ato.'),
  [('Un mandamiento de Jesús','Um mandamento de Jesus',
    'Antes de subir al cielo, Jesús mandó a sus discípulos hacer discípulos de todas las naciones y bautizarlos en el nombre del Padre, del Hijo y del Espíritu Santo. El bautismo no es una costumbre de la iglesia, sino una orden del Señor. Quien ama a Jesús desea obedecerle también en este paso.',
    'Antes de subir ao céu, Jesus mandou os discípulos fazerem discípulos de todas as nações e batizá-los em nome do Pai, do Filho e do Espírito Santo. O batismo não é um costume da igreja, mas uma ordem do Senhor. Quem ama Jesus deseja obedecer a ele também nesse passo.','Mt 28:19'),
   ('Muerte y vida nueva','Morte e vida nova',
    'Pablo explica que el bautismo representa nuestra unión con Cristo en su muerte y resurrección. Al entrar en el agua mostramos que la vida vieja fue sepultada; al salir, que resucitamos para andar en vida nueva. Es una imagen poderosa de lo que Dios ya hizo en nosotros por la fe.',
    'Paulo explica que o batismo representa a nossa união com Cristo na sua morte e ressurreição. Ao entrar na água mostramos que a vida velha foi sepultada; ao sair, que ressuscitamos para andar em novidade de vida. É uma imagem poderosa do que Deus já fez em nós pela fé.','Rm 6:4'),
   ('Un testimonio público','Um testemunho público',
    'El funcionario etíope escuchó el evangelio de Felipe y, al ver agua, preguntó qué le impedía ser bautizado. Felipe respondió que, si creía de todo corazón, podía hacerlo. El bautismo es una declaración delante de la iglesia, la familia y los amigos: ahora pertenezco a Jesús y quiero seguirlo.',
    'O oficial etíope ouviu o evangelho de Filipe e, ao ver água, perguntou o que o impedia de ser batizado. Filipe respondeu que, se ele cresse de todo o coração, poderia ser. O batismo é uma declaração diante da igreja, da família e dos amigos: agora eu pertenço a Jesus e quero segui-lo.','At 8:36-38')],
  [('¿Por qué el bautismo no es lo que nos salva, pero sigue siendo importante?',
    'Por que o batismo não é o que nos salva, mas continua sendo importante?'),
   ('¿Qué significa para ustedes la imagen de ser sepultados y resucitar con Cristo?',
    'O que significa para vocês a imagem de ser sepultado e ressuscitar com Cristo?'),
   ('¿Qué cosas pueden hacer que una persona postergue su bautismo?',
    'Que coisas podem fazer uma pessoa adiar o seu batismo?'),
   ('¿A quiénes les gustaría invitar a su bautismo como testimonio?',
    'Quem vocês gostariam de convidar para o seu batismo como testemunho?')],
  ('Si todavía no se bautizó, converse esta semana con su pastor o líder sobre el próximo bautismo.',
   'Se você ainda não se batizou, converse nesta semana com o seu pastor ou líder sobre o próximo batismo.'),
  'Rm 6:4',
  ('Señor, gracias por la nueva vida en Cristo. Danos valor para obedecerte en el bautismo y para mostrar a todos que Te pertenecemos. En el nombre de Jesús, amén.',
   'Senhor, obrigado pela nova vida em Cristo. Dá-nos coragem para te obedecer no batismo e para mostrar a todos que pertencemos a ti. Em nome de Jesus, amém.'))

L('Mt 6:6-8',
  ('Aprender a orar cada día','Aprender a orar todos os dias'),
  ('Animar al nuevo creyente a desarrollar una vida de oración sencilla, sincera y diaria.',
   'Animar o novo convertido a desenvolver uma vida de oração simples, sincera e diária.'),
  ('¿Con quién hablan más seguido en su día? ¿Por qué esa conversación es tan natural?',
   'Com quem vocês mais conversam no dia a dia? Por que essa conversa é tão natural?'),
  ('Orar es hablar con Dios. Algunos nuevos creyentes piensan que necesitan palabras difíciles o mucho tiempo para orar bien, y por eso se sienten inseguros. Jesús enseñó que la oración no es un espectáculo ni una repetición de frases, sino una conversación sincera con un Padre que ya conoce nuestras necesidades. Hoy vamos a ver cómo empezar una vida de oración diaria, sencilla y verdadera.',
   'Orar é conversar com Deus. Alguns novos convertidos acham que precisam de palavras difíceis ou de muito tempo para orar bem, e por isso se sentem inseguros. Jesus ensinou que a oração não é um espetáculo nem uma repetição de frases, mas uma conversa sincera com um Pai que já conhece as nossas necessidades. Hoje vamos ver como começar uma vida de oração diária, simples e verdadeira.'),
  [('Un lugar a solas con Dios','Um lugar a sós com Deus',
    'Jesús habló de entrar en el aposento y cerrar la puerta para orar al Padre en secreto. No se refiere solo a un cuarto, sino a un momento apartado, sin distracciones. Puede ser temprano a la mañana, en el camino al trabajo o antes de dormir. Lo importante es separar un tiempo para estar con Dios cada día.',
    'Jesus falou de entrar no quarto e fechar a porta para orar ao Pai em secreto. Não se refere só a um cômodo, mas a um momento separado, sem distrações. Pode ser cedo de manhã, no caminho para o trabalho ou antes de dormir. O importante é separar um tempo para estar com Deus todos os dias.','Mt 6:6'),
   ('Con palabras sinceras','Com palavras sinceras',
    'Jesús advirtió que no usemos vanas repeticiones, como si Dios nos oyera por hablar mucho. El Padre sabe lo que necesitamos antes de que se lo pidamos. Podemos hablarle con nuestras propias palabras, como un hijo habla con su padre: agradecer, pedir perdón, contar nuestras luchas y presentar nuestras necesidades.',
    'Jesus advertiu para não usarmos vãs repetições, como se Deus nos ouvisse por falarmos muito. O Pai sabe do que precisamos antes de pedirmos. Podemos falar com ele com as nossas próprias palavras, como um filho fala com o pai: agradecer, pedir perdão, contar as nossas lutas e apresentar as nossas necessidades.','Mt 6:7-8'),
   ('Orar sin cesar','Orar sem cessar',
    'Pablo escribe a los tesalonicenses: orad sin cesar. Esto no significa estar de rodillas todo el día, sino vivir en una actitud de conversación constante con Dios. Además del tiempo a solas, podemos orar en cualquier momento: antes de una decisión, en medio de un problema o al recibir una buena noticia.',
    'Paulo escreve aos tessalonicenses: orai sem cessar. Isso não significa ficar de joelhos o dia todo, mas viver numa atitude de conversa constante com Deus. Além do tempo a sós, podemos orar a qualquer momento: antes de uma decisão, no meio de um problema ou ao receber uma boa notícia.','1Ts 5:17')],
  [('¿Qué les impide a veces orar todos los días?',
    'O que às vezes impede vocês de orar todos os dias?'),
   ('¿Qué momento del día es mejor para que cada uno tenga su tiempo con Dios?',
    'Que momento do dia é melhor para cada um ter o seu tempo com Deus?'),
   ('¿Por qué Dios quiere que oremos si ya sabe lo que necesitamos?',
    'Por que Deus quer que oremos se ele já sabe do que precisamos?'),
   ('¿Cómo podemos orar en medio de las tareas del día?',
    'Como podemos orar no meio das tarefas do dia?')],
  ('Elija un horario fijo y separe por lo menos diez minutos cada día de esta semana para orar.',
   'Escolha um horário fixo e separe pelo menos dez minutos todos os dias desta semana para orar.'),
  'Jr 33:3',
  ('Padre, gracias porque podemos hablar Contigo como hijos. Enséñanos a orar con sinceridad y a buscarte cada día. Queremos conocerte más. En el nombre de Jesús, amén.',
   'Pai, obrigado porque podemos falar contigo como filhos. Ensina-nos a orar com sinceridade e a buscar-te todos os dias. Queremos te conhecer mais. Em nome de Jesus, amém.'))

L('Sl 1:1-3',
  ('Alimentarse de la Palabra','Alimentar-se da Palavra'),
  ('Motivar al nuevo creyente a leer y meditar en la Biblia cada día para crecer espiritualmente.',
   'Motivar o novo convertido a ler e meditar na Bíblia todos os dias para crescer espiritualmente.'),
  ('¿Cuál es su comida favorita? ¿Qué pasaría si comieran solo una vez por semana?',
   'Qual é a sua comida favorita? O que aconteceria se vocês comessem só uma vez por semana?'),
  ('Así como el cuerpo necesita alimento todos los días, el espíritu necesita la Palabra de Dios. Muchos creyentes escuchan la Biblia solo en el culto del domingo y después pasan la semana sin abrirla. El primer salmo describe a una persona feliz y firme porque se deleita en la ley de Dios y medita en ella de día y de noche. Hoy vamos a ver cómo la Palabra nos hace crecer y cómo empezar a leerla.',
   'Assim como o corpo precisa de alimento todos os dias, o espírito precisa da Palavra de Deus. Muitos crentes ouvem a Bíblia só no culto de domingo e depois passam a semana sem abri-la. O primeiro salmo descreve uma pessoa feliz e firme porque tem prazer na lei de Deus e medita nela de dia e de noite. Hoje vamos ver como a Palavra nos faz crescer e como começar a lê-la.'),
  [('Deleitarse en la Palabra','Ter prazer na Palavra',
    'El salmista dice que el bienaventurado tiene su delicia en la ley de Jehová. La Biblia no es un libro para leer por obligación, sino la voz de nuestro Padre. Al principio puede costar, pero con el tiempo la lectura se vuelve un encuentro esperado. Pida a Dios que despierte en usted hambre por su Palabra.',
    'O salmista diz que o bem-aventurado tem prazer na lei do Senhor. A Bíblia não é um livro para ler por obrigação, mas a voz do nosso Pai. No começo pode ser difícil, mas com o tempo a leitura se torna um encontro esperado. Peça a Deus que desperte em você fome pela sua Palavra.','Sl 1:2'),
   ('Raíces junto al agua','Raízes junto às águas',
    'Quien medita en la Palabra es como un árbol plantado junto a corrientes de aguas, que da fruto a su tiempo y su hoja no cae. Las raíces no se ven, pero sostienen al árbol cuando llega la sequía. La lectura diaria de la Biblia nos da firmeza para los días difíciles.',
    'Quem medita na Palavra é como uma árvore plantada junto a ribeiros de águas, que dá fruto no seu tempo e cuja folha não cai. As raízes não se veem, mas sustentam a árvore quando chega a seca. A leitura diária da Bíblia nos dá firmeza para os dias difíceis.','Sl 1:3'),
   ('Leche para crecer','Leite para crescer',
    'Pedro compara a los nuevos creyentes con niños recién nacidos que desean la leche espiritual para crecer. Un bebé no necesita entenderlo todo para alimentarse; solo necesita tomar la leche cada día. Empiece leyendo un capítulo por día, por ejemplo el Evangelio de Juan, y pregunte a su líder lo que no entienda.',
    'Pedro compara os novos convertidos com crianças recém-nascidas que desejam o leite espiritual para crescer. Um bebê não precisa entender tudo para se alimentar; só precisa tomar o leite todos os dias. Comece lendo um capítulo por dia, por exemplo o Evangelho de João, e pergunte ao seu líder o que não entender.','1Pe 2:2')],
  [('¿Qué dificultades encuentran para leer la Biblia todos los días?',
    'Que dificuldades vocês encontram para ler a Bíblia todos os dias?'),
   ('¿Qué diferencia hay entre leer la Biblia y meditar en ella?',
    'Que diferença há entre ler a Bíblia e meditar nela?'),
   ('¿Cómo se ve en la vida de una persona que tiene raíces profundas en la Palabra?',
    'Como se percebe na vida de uma pessoa que tem raízes profundas na Palavra?'),
   ('¿Qué libro de la Biblia les gustaría empezar a leer y por qué?',
    'Que livro da Bíblia vocês gostariam de começar a ler e por quê?')],
  ('Empiece esta semana a leer un capítulo por día del Evangelio de Juan y anote una frase que le haya hablado.',
   'Comece nesta semana a ler um capítulo por dia do Evangelho de João e anote uma frase que falou com você.'),
  'Sl 119:105',
  ('Señor, gracias por Tu Palabra. Danos hambre de conocerla y constancia para leerla cada día. Que nuestras raíces se afirmen en Ti. En el nombre de Jesús, amén.',
   'Senhor, obrigado pela tua Palavra. Dá-nos fome de conhecê-la e constância para lê-la todos os dias. Que as nossas raízes se firmem em ti. Em nome de Jesus, amém.'))

L('Hb 10:23-25',
  ('La vida en la iglesia','A vida na igreja'),
  ('Mostrar que la vida cristiana se vive en comunidad y que cada creyente tiene un lugar en la familia de la fe.',
   'Mostrar que a vida cristã é vivida em comunidade e que cada crente tem um lugar na família da fé.'),
  ('¿Qué cosas son más difíciles de hacer solos que en grupo?',
   'Que coisas são mais difíceis de fazer sozinho do que em grupo?'),
  ('Algunas personas dicen que pueden ser cristianas sin ir a la iglesia. Pero en el Nuevo Testamento los creyentes se reunían, aprendían juntos, oraban unos por otros y compartían la vida. Hebreos anima a no dejar de congregarnos, sino a estimularnos al amor y a las buenas obras. La iglesia no es solo un edificio, sino la familia de Dios. Hoy vamos a ver por qué necesitamos de los hermanos y cómo encontrar nuestro lugar en el cuerpo de Cristo.',
   'Algumas pessoas dizem que podem ser cristãs sem ir à igreja. Mas no Novo Testamento os crentes se reuniam, aprendiam juntos, oravam uns pelos outros e compartilhavam a vida. Hebreus anima a não deixar de nos congregar, mas a nos estimular ao amor e às boas obras. A igreja não é só um prédio, mas a família de Deus. Hoje vamos ver por que precisamos dos irmãos e como encontrar o nosso lugar no corpo de Cristo.'),
  [('No dejar de congregarnos','Não deixar de nos congregar',
    'El autor de Hebreos advierte contra la costumbre de algunos de abandonar las reuniones. Cuando nos alejamos de los hermanos, nos enfriamos, como una brasa que sale del fuego. Reunirse con la iglesia en los cultos y en los grupos pequeños nos protege, nos anima y nos ayuda a crecer.',
    'O autor de Hebreus adverte contra o costume de alguns de abandonar as reuniões. Quando nos afastamos dos irmãos, esfriamos, como uma brasa que sai do fogo. Reunir-se com a igreja nos cultos e nos grupos pequenos nos protege, nos anima e nos ajuda a crescer.','Hb 10:25'),
   ('Miembros de un mismo cuerpo','Membros de um mesmo corpo',
    'Pablo dice que somos el cuerpo de Cristo y miembros cada uno en particular. Así como el cuerpo necesita de todos sus miembros, la iglesia necesita de cada creyente. Nadie es demasiado pequeño ni demasiado nuevo para pertenecer. Usted no es un visitante en la casa de Dios: es parte de la familia.',
    'Paulo diz que somos o corpo de Cristo e membros cada um em particular. Assim como o corpo precisa de todos os seus membros, a igreja precisa de cada crente. Ninguém é pequeno demais nem novo demais para pertencer. Você não é um visitante na casa de Deus: faz parte da família.','1Co 12:27'),
   ('Servir con lo que recibimos','Servir com o que recebemos',
    'Pedro enseña que cada uno debe servir a los demás según el don que ha recibido. En la iglesia hay muchas formas de servir: recibir a las personas, ayudar con los niños, cantar, limpiar, orar, visitar. Pregunte a su líder dónde puede empezar. Servir nos hace sentir parte del cuerpo y nos ayuda a crecer.',
    'Pedro ensina que cada um deve servir aos outros conforme o dom que recebeu. Na igreja há muitas formas de servir: receber as pessoas, ajudar com as crianças, cantar, limpar, orar, visitar. Pergunte ao seu líder onde pode começar. Servir nos faz sentir parte do corpo e nos ajuda a crescer.','1Pe 4:10')],
  [('¿Por qué es peligroso vivir la fe de manera aislada?',
    'Por que é perigoso viver a fé de forma isolada?'),
   ('¿Cómo pueden animarse unos a otros durante la semana, fuera del culto?',
    'Como vocês podem se animar uns aos outros durante a semana, fora do culto?'),
   ('¿Qué dones o habilidades ven en los demás integrantes del grupo?',
    'Que dons ou habilidades vocês veem nos outros participantes do grupo?'),
   ('¿En qué área de la iglesia les gustaría empezar a servir?',
    'Em que área da igreja vocês gostariam de começar a servir?')],
  ('Converse esta semana con su líder sobre un área de servicio y envíe un mensaje de ánimo a un hermano.',
   'Converse nesta semana com o seu líder sobre uma área de serviço e envie uma mensagem de ânimo a um irmão.'),
  'Sl 133:1',
  ('Señor, gracias por la familia de la fe. Ayúdanos a no alejarnos de los hermanos, a animarnos unos a otros y a servir con los dones que nos diste. Amén.',
   'Senhor, obrigado pela família da fé. Ajuda-nos a não nos afastar dos irmãos, a animar uns aos outros e a servir com os dons que nos deste. Amém.'))

# ================================================================ Parábolas de Jesus
S('parabolas','Las parábolas de Jesús','As parábolas de Jesus',
  'Seis estudios sobre historias que Jesús contó para enseñar las verdades del reino de Dios.',
  'Seis estudos sobre histórias que Jesus contou para ensinar as verdades do reino de Deus.')

L('Mt 13:3-8',
  ('El sembrador y los cuatro terrenos','O semeador e os quatro terrenos'),
  ('Examinar cómo recibimos la Palabra de Dios y qué impide que dé fruto en nuestra vida.',
   'Examinar como recebemos a Palavra de Deus e o que impede que ela dê fruto na nossa vida.'),
  ('¿Alguno de ustedes plantó algo alguna vez? ¿Qué necesitó para crecer?',
   'Algum de vocês já plantou alguma coisa? Do que ela precisou para crescer?'),
  ('Jesús contó la historia de un sembrador que salió a sembrar. La misma semilla cayó en cuatro tipos de terreno: junto al camino, en pedregales, entre espinos y en buena tierra. Solo en la buena tierra dio fruto abundante. Después él mismo explicó que la semilla es la Palabra del reino y los terrenos son distintos corazones. Hoy vamos a preguntarnos con sinceridad qué tipo de terreno es nuestro corazón cuando escuchamos la Palabra.',
   'Jesus contou a história de um semeador que saiu para semear. A mesma semente caiu em quatro tipos de terreno: à beira do caminho, em lugares pedregosos, entre espinhos e em boa terra. Só na boa terra ela deu fruto abundante. Depois ele mesmo explicou que a semente é a Palavra do reino e os terrenos são corações diferentes. Hoje vamos nos perguntar com sinceridade que tipo de terreno é o nosso coração quando ouvimos a Palavra.'),
  [('El corazón distraído','O coração distraído',
    'La semilla junto al camino representa a quien oye la Palabra y no la entiende, y viene el malo y arrebata lo sembrado. Es el corazón endurecido por la rutina o distraído por mil cosas. Escuchamos un mensaje, pero a los pocos minutos ya lo olvidamos. Necesitamos recibir la Palabra con atención y con deseo de entenderla.',
    'A semente à beira do caminho representa quem ouve a Palavra e não a entende, e vem o maligno e arrebata o que foi semeado. É o coração endurecido pela rotina ou distraído por mil coisas. Ouvimos uma mensagem, mas poucos minutos depois já a esquecemos. Precisamos receber a Palavra com atenção e com desejo de entendê-la.','Mt 13:19'),
   ('Piedras y espinos','Pedras e espinhos',
    'En los pedregales la semilla brota rápido, pero se seca porque no tiene raíz: es quien recibe la Palabra con alegría y abandona cuando viene la prueba. Entre espinos la planta crece, pero es ahogada por las preocupaciones del mundo y el engaño de las riquezas. Ambos terrenos empiezan bien, pero no llegan al fruto.',
    'Nos lugares pedregosos a semente brota rápido, mas seca porque não tem raiz: é quem recebe a Palavra com alegria e desiste quando vem a prova. Entre os espinhos a planta cresce, mas é sufocada pelas preocupações do mundo e pela sedução das riquezas. Os dois terrenos começam bem, mas não chegam ao fruto.','Mt 13:20-22'),
   ('La buena tierra','A boa terra',
    'La buena tierra es quien oye la Palabra, la entiende y da fruto, a ciento, a sesenta y a treinta por uno. Lucas añade que la retiene con corazón bueno y recto y da fruto con paciencia. La buena tierra no es perfecta, pero está dispuesta: recibe la semilla, deja que eche raíz y persevera hasta la cosecha.',
    'A boa terra é quem ouve a Palavra, a entende e dá fruto, a cem, a sessenta e a trinta por um. Lucas acrescenta que a retém com coração bom e reto e dá fruto com perseverança. A boa terra não é perfeita, mas está disposta: recebe a semente, deixa criar raiz e persevera até a colheita.','Mt 13:23')],
  [('¿Con cuál de los terrenos se identificaron más en alguna etapa de su vida?',
    'Com qual dos terrenos vocês mais se identificaram em alguma fase da vida?'),
   ('¿Qué distracciones nos impiden prestar atención a la Palabra?',
    'Que distrações nos impedem de prestar atenção à Palavra?'),
   ('¿Cuáles son los espinos más comunes que ahogan la fe hoy?',
    'Quais são os espinhos mais comuns que sufocam a fé hoje?'),
   ('¿Qué podemos hacer para que nuestro corazón sea buena tierra?',
    'O que podemos fazer para que o nosso coração seja boa terra?')],
  ('Esta semana, después de escuchar un mensaje o leer la Biblia, escriba una decisión práctica y póngala en acción.',
   'Nesta semana, depois de ouvir uma mensagem ou ler a Bíblia, escreva uma decisão prática e coloque-a em ação.'),
  'Lc 8:15',
  ('Señor, queremos ser buena tierra. Quita las piedras y los espinos de nuestro corazón, y haz que Tu Palabra eche raíz y dé fruto en nosotros. Amén.',
   'Senhor, queremos ser boa terra. Tira as pedras e os espinhos do nosso coração, e faze com que a tua Palavra crie raiz e dê fruto em nós. Amém.'))

L('Lc 10:30-35',
  ('El buen samaritano','O bom samaritano'),
  ('Aprender que el amor al prójimo se demuestra con misericordia práctica hacia quien lo necesita.',
   'Aprender que o amor ao próximo se demonstra com misericórdia prática para com quem precisa.'),
  ('¿Recuerdan alguna vez en que un desconocido los ayudó?',
   'Vocês se lembram de alguma vez em que um desconhecido ajudou vocês?'),
  ('Un intérprete de la ley preguntó a Jesús qué debía hacer para heredar la vida eterna. La respuesta fue amar a Dios con todo el corazón y al prójimo como a uno mismo. Pero él, queriendo justificarse, preguntó: ¿y quién es mi prójimo? Jesús respondió con una historia que sorprendió a todos, porque el héroe era un samaritano, alguien despreciado por los judíos. Hoy vamos a ver qué significa ser prójimo en la práctica.',
   'Um intérprete da lei perguntou a Jesus o que devia fazer para herdar a vida eterna. A resposta foi amar a Deus de todo o coração e ao próximo como a si mesmo. Mas ele, querendo se justificar, perguntou: e quem é o meu próximo? Jesus respondeu com uma história que surpreendeu a todos, porque o herói era um samaritano, alguém desprezado pelos judeus. Hoje vamos ver o que significa ser próximo na prática.'),
  [('La pregunta equivocada','A pergunta errada',
    'El intérprete preguntó quién era su prójimo, buscando un límite: a quiénes estaba obligado a amar y a quiénes no. Jesús cambió la pregunta. Al final no preguntó quién merece mi ayuda, sino quién se comportó como prójimo. El amor de Dios no busca excusas para no ayudar, sino oportunidades para servir.',
    'O intérprete perguntou quem era o seu próximo, buscando um limite: a quem estava obrigado a amar e a quem não. Jesus mudou a pergunta. No final não perguntou quem merece a minha ajuda, mas quem agiu como próximo. O amor de Deus não procura desculpas para não ajudar, mas oportunidades para servir.','Lc 10:29'),
   ('Pasar de largo','Passar de largo',
    'Un sacerdote y un levita, hombres religiosos, vieron al herido y pasaron por el otro lado. Tal vez tenían prisa, miedo o compromisos en el templo. Es posible estar muy ocupado con la religión y no tener tiempo para el que sufre al costado del camino. Jesús nos invita a examinar nuestras prioridades.',
    'Um sacerdote e um levita, homens religiosos, viram o ferido e passaram pelo outro lado. Talvez tivessem pressa, medo ou compromissos no templo. É possível estar muito ocupado com a religião e não ter tempo para quem sofre à beira do caminho. Jesus nos convida a examinar as nossas prioridades.','Lc 10:31-32'),
   ('Usar misericordia','Agir com misericórdia',
    'El samaritano se acercó, vendó las heridas, lo llevó a un mesón y pagó por su cuidado. Su misericordia fue práctica, costosa y comprometida. Cuando el intérprete reconoció que el prójimo fue el que usó de misericordia, Jesús le dijo: «Ve, y haz tú lo mismo». La pregunta es para nosotros también.',
    'O samaritano se aproximou, atou as feridas, levou-o a uma hospedaria e pagou pelo seu cuidado. A sua misericórdia foi prática, custosa e comprometida. Quando o intérprete reconheceu que o próximo foi o que usou de misericórdia, Jesus lhe disse: vai e faze o mesmo. A pergunta é para nós também.','Lc 10:36-37')],
  [('¿Por qué creen que Jesús eligió a un samaritano como el héroe de la historia?',
    'Por que vocês acham que Jesus escolheu um samaritano como o herói da história?'),
   ('¿Qué excusas usamos a veces para no ayudar a alguien?',
    'Que desculpas às vezes usamos para não ajudar alguém?'),
   ('¿Quiénes están heridos al costado del camino en nuestro barrio?',
    'Quem está ferido à beira do caminho no nosso bairro?'),
   ('¿Qué podríamos hacer como grupo para mostrar misericordia esta semana?',
    'O que poderíamos fazer como grupo para mostrar misericórdia nesta semana?')],
  ('Identifique a una persona necesitada cerca de usted y haga algo concreto para ayudarla esta semana.',
   'Identifique uma pessoa necessitada perto de você e faça algo concreto para ajudá-la nesta semana.'),
  'Lc 10:27',
  ('Señor, perdónanos por las veces que pasamos de largo. Danos ojos para ver al que sufre y un corazón dispuesto a ayudar con misericordia. En el nombre de Jesús, amén.',
   'Senhor, perdoa-nos pelas vezes em que passamos de largo. Dá-nos olhos para ver quem sofre e um coração disposto a ajudar com misericórdia. Em nome de Jesus, amém.'))

L('Lc 15:20-24',
  ('El padre que espera','O pai que espera'),
  ('Contemplar el amor del Padre que recibe al que se arrepiente y vuelve a casa.',
   'Contemplar o amor do Pai que recebe quem se arrepende e volta para casa.'),
  ('¿Cómo es la sensación de volver a casa después de un viaje largo?',
   'Como é a sensação de voltar para casa depois de uma viagem longa?'),
  ('Esta parábola es conocida como la del hijo pródigo, pero el personaje central es el padre. Un hijo pidió su herencia, se fue lejos y la malgastó. Cuando todo se terminó, volvió en sí y decidió regresar, pensando en pedir un lugar de empleado. Pero su padre lo vio de lejos, corrió, lo abrazó y organizó una fiesta. Jesús contó esta historia para mostrar cómo es el corazón de Dios con los que vuelven a él.',
   'Esta parábola é conhecida como a do filho pródigo, mas o personagem central é o pai. Um filho pediu a sua herança, foi para longe e a desperdiçou. Quando tudo acabou, caiu em si e decidiu voltar, pensando em pedir um lugar de empregado. Mas o seu pai o viu de longe, correu, o abraçou e organizou uma festa. Jesus contou essa história para mostrar como é o coração de Deus com os que voltam para ele.'),
  [('Lejos de casa','Longe de casa',
    'El hijo menor quería la herencia sin el padre. Se fue a una provincia apartada y desperdició todo viviendo perdidamente. El pecado promete libertad y diversión, pero termina en hambre y soledad. El joven que no quería obedecer en casa terminó sirviendo a un extraño y cuidando cerdos.',
    'O filho mais novo queria a herança sem o pai. Foi para uma terra distante e desperdiçou tudo vivendo de forma dissoluta. O pecado promete liberdade e diversão, mas termina em fome e solidão. O jovem que não queria obedecer em casa acabou servindo a um estranho e cuidando de porcos.','Lc 15:12-13'),
   ('Volver en sí','Cair em si',
    'En medio de la miseria, el hijo volvió en sí y recordó la casa de su padre. Decidió levantarse e ir a él reconociendo su pecado. El arrepentimiento empieza con la verdad sobre nosotros mismos y continúa con una decisión: dejar el lugar del pecado y caminar de regreso hacia Dios.',
    'No meio da miséria, o filho caiu em si e se lembrou da casa do pai. Decidiu levantar-se e ir até ele reconhecendo o seu pecado. O arrependimento começa com a verdade sobre nós mesmos e continua com uma decisão: deixar o lugar do pecado e caminhar de volta para Deus.','Lc 15:17-18'),
   ('El hermano mayor','O irmão mais velho',
    'Cuando el hijo mayor oyó la música, se enojó y no quiso entrar. Había servido muchos años, pero no compartía la alegría del padre. Jesús contó esta parte para los religiosos que criticaban que él recibiera a los pecadores. Es posible estar en la casa y aun así estar lejos del corazón del Padre.',
    'Quando o filho mais velho ouviu a música, ficou irado e não quis entrar. Tinha servido muitos anos, mas não compartilhava a alegria do pai. Jesus contou essa parte para os religiosos que criticavam o fato de ele receber os pecadores. É possível estar dentro de casa e mesmo assim estar longe do coração do Pai.','Lc 15:28-32')],
  [('¿Qué nos enseña la actitud del padre sobre la manera en que Dios nos recibe?',
    'O que a atitude do pai nos ensina sobre a maneira como Deus nos recebe?'),
   ('¿Qué cosas prometen libertad hoy, pero terminan en vacío?',
    'Que coisas prometem liberdade hoje, mas terminam em vazio?'),
   ('¿Por qué es difícil para algunos alegrarse cuando otro vuelve a Dios?',
    'Por que é difícil para alguns se alegrar quando outra pessoa volta para Deus?'),
   ('¿Con cuál de los dos hijos se identifican más en este momento?',
    'Com qual dos dois filhos vocês se identificam mais neste momento?')],
  ('Ore esta semana por una persona que está lejos de Dios y, si es posible, invítela a la célula o al culto.',
   'Ore nesta semana por uma pessoa que está longe de Deus e, se possível, convide-a para a célula ou o culto.'),
  'Lc 15:10',
  ('Padre, gracias porque corres a nuestro encuentro cuando volvemos a Ti. Líbranos del orgullo del hermano mayor y danos un corazón que se alegre con cada persona que regresa. Amén.',
   'Pai, obrigado porque corres ao nosso encontro quando voltamos para ti. Livra-nos do orgulho do irmão mais velho e dá-nos um coração que se alegre com cada pessoa que volta. Amém.'))

L('Mt 25:19-23',
  ('Los talentos','Os talentos'),
  ('Reconocer que todo lo que tenemos viene de Dios y que él espera que lo usemos con fidelidad.',
   'Reconhecer que tudo o que temos vem de Deus e que ele espera que o usemos com fidelidade.'),
  ('Si alguien les confiara su casa o su negocio por un mes, ¿cómo lo cuidarían?',
   'Se alguém confiasse a vocês a sua casa ou o seu negócio por um mês, como vocês cuidariam?'),
  ('En la parábola de los talentos, un hombre que se iba lejos entregó sus bienes a tres siervos, a cada uno según su capacidad: cinco, dos y un talento. Un talento era una suma muy grande de dinero. Cuando volvió, pidió cuentas. Dos habían negociado y duplicado lo recibido; el tercero lo había enterrado por miedo. Jesús enseña que somos administradores de lo que Dios nos confía: tiempo, dones, oportunidades y recursos.',
   'Na parábola dos talentos, um homem que ia viajar entregou os seus bens a três servos, a cada um segundo a sua capacidade: cinco, dois e um talento. Um talento era uma quantia muito grande de dinheiro. Quando voltou, pediu contas. Dois tinham negociado e dobrado o que receberam; o terceiro o tinha enterrado por medo. Jesus ensina que somos administradores do que Deus nos confia: tempo, dons, oportunidades e recursos.'),
  [('Dones diferentes','Dons diferentes',
    'El señor dio a cada siervo conforme a su capacidad. No todos recibimos lo mismo, y eso no es injusticia, sino sabiduría de Dios. No necesitamos compararnos con otros ni sentirnos menos. Lo importante no es cuánto recibimos, sino qué hacemos con lo que recibimos.',
    'O senhor deu a cada servo conforme a sua capacidade. Nem todos recebemos o mesmo, e isso não é injustiça, mas sabedoria de Deus. Não precisamos nos comparar com os outros nem nos sentir menores. O importante não é quanto recebemos, mas o que fazemos com o que recebemos.','Mt 25:15'),
   ('Fieles en lo poco','Fiéis no pouco',
    'Los dos primeros siervos escucharon la misma alabanza: «Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré». El que ganó dos talentos recibió el mismo elogio que el que ganó cinco. Dios valora la fidelidad más que la cantidad. Las pequeñas tareas hechas con fidelidad tienen gran valor para él.',
    'Os dois primeiros servos ouviram o mesmo elogio: muito bem, servo bom e fiel; foste fiel no pouco, sobre o muito te colocarei. O que ganhou dois talentos recebeu o mesmo elogio que o que ganhou cinco. Deus valoriza mais a fidelidade do que a quantidade. As pequenas tarefas feitas com fidelidade têm grande valor para ele.','Mt 25:21'),
   ('El miedo que entierra','O medo que enterra',
    'El tercer siervo dijo que tuvo miedo y escondió el talento en la tierra. Tenía una imagen equivocada de su señor y prefirió no arriesgar nada. El miedo al fracaso, a la crítica o a equivocarnos puede hacernos enterrar los dones que Dios nos dio. No usar lo que Dios confió también es una forma de infidelidad.',
    'O terceiro servo disse que teve medo e escondeu o talento na terra. Tinha uma imagem errada do seu senhor e preferiu não arriscar nada. O medo do fracasso, da crítica ou de errar pode nos fazer enterrar os dons que Deus nos deu. Não usar o que Deus confiou também é uma forma de infidelidade.','Mt 25:24-25')],
  [('¿Qué talentos, dones u oportunidades les confió Dios?',
    'Que talentos, dons ou oportunidades Deus confiou a vocês?'),
   ('¿Por qué a veces nos comparamos con los que parecen tener más?',
    'Por que às vezes nos comparamos com os que parecem ter mais?'),
   ('¿Qué miedos nos llevan a enterrar nuestros dones?',
    'Que medos nos levam a enterrar os nossos dons?'),
   ('¿En qué cosas pequeñas podemos ser más fieles esta semana?',
    'Em que coisas pequenas podemos ser mais fiéis nesta semana?')],
  ('Elija un don o habilidad que tiene guardado y úselo esta semana para servir a alguien.',
   'Escolha um dom ou habilidade que você tem guardado e use-o nesta semana para servir a alguém.'),
  '1Co 4:2',
  ('Señor, todo lo que tenemos viene de Ti. Líbranos del miedo que entierra los dones y ayúdanos a ser fieles en lo poco y en lo mucho. Amén.',
   'Senhor, tudo o que temos vem de ti. Livra-nos do medo que enterra os dons e ajuda-nos a ser fiéis no pouco e no muito. Amém.'))

L('Lc 12:16-21',
  ('El rico insensato','O rico insensato'),
  ('Reflexionar sobre la avaricia y aprender a ser ricos para con Dios.',
   'Refletir sobre a ganância e aprender a ser ricos para com Deus.'),
  ('Si recibieran de repente una gran cantidad de dinero, ¿qué sería lo primero que harían?',
   'Se vocês recebessem de repente uma grande quantia de dinheiro, qual seria a primeira coisa que fariam?'),
  ('Un hombre pidió a Jesús que ordenara a su hermano repartir la herencia con él. Jesús se negó a ser juez de ese caso, pero aprovechó para advertir: guardaos de toda avaricia, porque la vida del hombre no consiste en la abundancia de los bienes que posee. Luego contó la parábola de un rico cuya cosecha fue tan grande que decidió construir graneros mayores. Hoy vamos a ver por qué Dios lo llamó necio y qué significa ser rico para con Dios.',
   'Um homem pediu a Jesus que mandasse o seu irmão repartir a herança com ele. Jesus se recusou a ser juiz desse caso, mas aproveitou para advertir: guardai-vos de toda avareza, porque a vida de um homem não consiste na abundância dos bens que possui. Depois contou a parábola de um rico cuja colheita foi tão grande que ele decidiu construir celeiros maiores. Hoje vamos ver por que Deus o chamou de insensato e o que significa ser rico para com Deus.'),
  [('Cuidado con la avaricia','Cuidado com a avareza',
    'Jesús advirtió que la vida no consiste en la abundancia de bienes. La avaricia es querer siempre más y poner la seguridad en lo que tenemos. Puede afectar tanto al rico como al pobre, porque está en el corazón. No es pecado tener bienes, pero sí lo es vivir para ellos.',
    'Jesus advertiu que a vida não consiste na abundância de bens. A avareza é querer sempre mais e colocar a segurança no que temos. Pode afetar tanto o rico quanto o pobre, porque está no coração. Não é pecado ter bens, mas é pecado viver para eles.','Lc 12:15'),
   ('Yo, mis graneros, mi alma','Eu, meus celeiros, minha alma',
    'Al leer el razonamiento del rico, se repite mucho la palabra mi: mis frutos, mis graneros, mis bienes, mi alma. No hay lugar para Dios ni para los demás. Planificó todo para muchos años, pero no contó con que esa misma noche le pedirían el alma. La seguridad que no incluye a Dios es una ilusión.',
    'Ao ler o raciocínio do rico, a palavra meu se repete muito: meus frutos, meus celeiros, meus bens, minha alma. Não há lugar para Deus nem para os outros. Ele planejou tudo para muitos anos, mas não contou que naquela mesma noite lhe pediriam a alma. A segurança que não inclui Deus é uma ilusão.','Lc 12:18-20'),
   ('Ricos para con Dios','Ricos para com Deus',
    'Jesús concluyó que así es el que hace para sí tesoro y no es rico para con Dios. Ser rico para con Dios es usar lo que tenemos para su reino, ser generosos con los necesitados y poner el corazón en lo eterno. Jesús enseñó a hacer tesoros en el cielo, porque donde esté nuestro tesoro estará también nuestro corazón.',
    'Jesus concluiu que assim é aquele que ajunta tesouros para si mesmo e não é rico para com Deus. Ser rico para com Deus é usar o que temos para o seu reino, ser generoso com os necessitados e colocar o coração no que é eterno. Jesus ensinou a ajuntar tesouros no céu, porque onde estiver o nosso tesouro, aí estará também o nosso coração.','Lc 12:21')],
  [('¿Cómo se manifiesta la avaricia en la vida diaria, aun en personas con poco dinero?',
    'Como a avareza se manifesta no dia a dia, até em pessoas com pouco dinheiro?'),
   ('¿Por qué es peligroso planificar la vida sin contar con Dios?',
    'Por que é perigoso planejar a vida sem contar com Deus?'),
   ('¿Qué significa en la práctica ser rico para con Dios?',
    'O que significa na prática ser rico para com Deus?'),
   ('¿Qué cambio podríamos hacer en el uso de nuestros recursos este mes?',
    'Que mudança poderíamos fazer no uso dos nossos recursos neste mês?')],
  ('Separe esta semana una parte de sus recursos para ayudar a alguien necesitado o para la obra de Dios.',
   'Separe nesta semana uma parte dos seus recursos para ajudar alguém necessitado ou para a obra de Deus.'),
  'Mt 6:21',
  ('Señor, líbranos de la avaricia. Enséñanos a confiar en Ti y no en lo que tenemos, y a usar nuestros bienes para Tu reino y para bendecir a otros. Amén.',
   'Senhor, livra-nos da avareza. Ensina-nos a confiar em ti e não no que temos, e a usar os nossos bens para o teu reino e para abençoar os outros. Amém.'))

L('Lc 18:9-14',
  ('El fariseo y el publicano','O fariseu e o publicano'),
  ('Aprender que Dios recibe al humilde que reconoce su necesidad y resiste al que confía en su propia justicia.',
   'Aprender que Deus recebe o humilde que reconhece a sua necessidade e resiste ao que confia na própria justiça.'),
  ('¿Alguna vez se compararon con otra persona para sentirse mejores? ¿Cómo terminó?',
   'Vocês já se compararam com outra pessoa para se sentir melhores? Como terminou?'),
  ('Jesús contó esta parábola a algunos que confiaban en sí mismos como justos y menospreciaban a los otros. Dos hombres subieron al templo a orar: un fariseo, respetado por su religiosidad, y un publicano, cobrador de impuestos considerado traidor y pecador. El resultado sorprendió a los oyentes, porque el que volvió justificado fue el publicano. Hoy vamos a ver qué tipo de oración agrada a Dios y por qué la humildad es tan importante.',
   'Jesus contou esta parábola a alguns que confiavam em si mesmos como justos e desprezavam os outros. Dois homens subiram ao templo para orar: um fariseu, respeitado pela sua religiosidade, e um publicano, cobrador de impostos considerado traidor e pecador. O resultado surpreendeu os ouvintes, porque quem voltou justificado foi o publicano. Hoje vamos ver que tipo de oração agrada a Deus e por que a humildade é tão importante.'),
  [('Confiar en uno mismo','Confiar em si mesmo',
    'Lucas explica que la parábola fue para los que confiaban en sí mismos como justos. Es fácil caer en esa trampa cuando llevamos años en la iglesia: empezamos a mirar a los demás desde arriba. La justicia que vale delante de Dios no es la nuestra, sino la que recibimos por gracia.',
    'Lucas explica que a parábola foi para os que confiavam em si mesmos como justos. É fácil cair nessa armadilha quando estamos há anos na igreja: começamos a olhar os outros de cima. A justiça que vale diante de Deus não é a nossa, mas a que recebemos pela graça.','Lc 18:9'),
   ('Una oración orgullosa','Uma oração orgulhosa',
    'El fariseo oraba consigo mismo y daba gracias porque no era como los otros hombres, ni como aquel publicano. Contó sus ayunos y diezmos. No pidió nada, porque creía no necesitar nada. Su oración era más un informe de sus méritos que un encuentro con Dios.',
    'O fariseu orava consigo mesmo e dava graças porque não era como os outros homens, nem como aquele publicano. Contou os seus jejuns e dízimos. Não pediu nada, porque achava que não precisava de nada. A sua oração era mais um relatório dos seus méritos do que um encontro com Deus.','Lc 18:11-12'),
   ('Una oración humilde','Uma oração humilde',
    'El publicano, desde lejos, no se atrevía ni a alzar los ojos. Se golpeaba el pecho y decía: «Dios, sé propicio a mí pecador». Jesús afirmó que este descendió a su casa justificado. Dios no resiste al que se reconoce necesitado; lo levanta. El camino hacia Dios siempre empieza con humildad.',
    'O publicano, de longe, não se atrevia nem a levantar os olhos. Batia no peito e dizia: ó Deus, tem misericórdia de mim, pecador. Jesus afirmou que este desceu justificado para a sua casa. Deus não resiste a quem se reconhece necessitado; ele o levanta. O caminho até Deus sempre começa com humildade.','Lc 18:13-14')],
  [('¿Por qué la comparación con los demás es peligrosa en la vida espiritual?',
    'Por que a comparação com os outros é perigosa na vida espiritual?'),
   ('¿Cómo se nota el orgullo religioso en una persona o en una iglesia?',
    'Como se percebe o orgulho religioso numa pessoa ou numa igreja?'),
   ('¿Qué nos enseña la oración del publicano sobre cómo acercarnos a Dios?',
    'O que a oração do publicano nos ensina sobre como nos aproximar de Deus?'),
   ('¿Cómo podemos recibir con humildad a los que llegan a la iglesia con un pasado difícil?',
    'Como podemos receber com humildade os que chegam à igreja com um passado difícil?')],
  ('Durante esta semana, cada vez que se compare con alguien, ore por esa persona y agradezca a Dios por su gracia.',
   'Durante esta semana, toda vez que você se comparar com alguém, ore por essa pessoa e agradeça a Deus pela sua graça.'),
  'Tg 4:10',
  ('Dios, sé propicio a nosotros, pecadores. Líbranos del orgullo que se compara y danos un corazón humilde que dependa de Tu gracia cada día. Amén.',
   'Ó Deus, tem misericórdia de nós, pecadores. Livra-nos do orgulho que se compara e dá-nos um coração humilde que dependa da tua graça todos os dias. Amém.'))

# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas|vosotros)\b',re.I)
TU_CS=re.compile(r'\b(tú|tu|tus|te|ti|contigo)\b')  # na oração (dirigida a Deus) só se aceita a forma com maiúscula: Tú, Tu, Te, Ti
QUOTE=re.compile(r'«[^»]*»')
KEYS='primeiros parabolas'.split()
OLDB={}
for _f in ('licoes-1.json','licoes-2.json'):
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
    out=os.path.join(HERE,'licoes-3.json')
    json.dump({'series':SER},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['l']) for o in SER)
    print('ok: %d séries, %d lições, %d referências -> %s'%(len(SER),n,len(refs),out))
if __name__=='__main__':main()
