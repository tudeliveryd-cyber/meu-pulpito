# Lições para células e Escola Dominical (Meu Púlpito) — parte 1: 4 séries x 6 lições [ES, PT].
# Séries: fe, oracao, familia, espirito.
# Cada lição: título, texto-base, objetivo, quebra-gelo, introdução, 3 pontos (com referência),
# perguntas para discussão, aplicação prática, versículo para memorizar e sugestão de oração.
# Uso: python3 tools/conteudo/licoes-1.py          -> valida e grava tools/conteudo/licoes-1.json
#      python3 tools/conteudo/licoes-1.py --print  -> imprime o texto de cada referência nas duas Bíblias
# Convenção: o texto em ES trata o grupo de "usted/ustedes". Nas orações, que se dirigem a Deus,
# os pronomes referentes a Deus vão com maiúscula (Tú, Tu, Ti, Te), como no devocional.
import json,os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__))
BIB=os.path.join(HERE,'..','..','app','biblia')
PT=json.load(open(os.path.join(BIB,'pt-livre.json'),encoding='utf-8'))
ES=json.load(open(os.path.join(BIB,'es-rv1909.json'),encoding='utf-8'))

AB='Gn Ex Lv Nm Dt Js Jz Rt 1Sm 2Sm 1Rs 2Rs 1Cr 2Cr Ed Ne Et Job Sl Pv Ec Ct Is Jr Lm Ez Dn Os Jl Am Ob Jon Mq Na Hc Sf Ag Zc Ml Mt Mc Lc Jo At Rm 1Co 2Co Gl Ef Fp Cl 1Ts 2Ts 1Tm 2Tm Tt Fm Hb Tg 1Pe 2Pe 1Jo 2Jo 3Jo Jd Ap'.split()
BK={a:i for i,a in enumerate(AB)}
def ref(s):
    m=re.fullmatch(r'(\S+) (\d+):(\d+)(?:-(\d+))?',s)
    if not m or m.group(1) not in BK:raise ValueError('ref inválida: '+s)
    b,c,v,w=BK[m.group(1)],int(m.group(2)),int(m.group(3)),m.group(4)
    if w and int(w)<=v:raise ValueError('intervalo inválido: '+s)
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
        'pts':[{'t':list(a),'x':list(b),'v':r} for r,a,b in pts],
        'perg':[list(q) for q in perg],'apl':list(apl),'mem':mem,'or':list(ora)})

# ================================================================ Fundamentos da fé
S('fe','Fundamentos de la fe','Fundamentos da fé',
  'Seis lecciones sobre las bases de la vida cristiana: salvación, gracia, fe, arrepentimiento, seguridad y nueva vida.',
  'Seis lições sobre as bases da vida cristã: salvação, graça, fé, arrependimento, segurança e nova vida.')

L('Jo 3:16-17',('La salvación que Dios ofrece','A salvação que Deus oferece'),
  ('Comprender que la salvación nace del amor de Dios y se recibe creyendo en Jesucristo.',
   'Compreender que a salvação nasce do amor de Deus e é recebida pela fé em Jesus Cristo.'),
  ('¿Alguna vez alguien lo ayudó a salir de un problema del que usted no podía salir solo? ¿Qué sintió?',
   'Alguma vez alguém ajudou você a sair de um problema do qual você não conseguia sair sozinho? O que você sentiu?'),
  ('Juan 3:16 es quizás el versículo más conocido de la Biblia, y con razón: en pocas palabras resume todo el evangelio. Dios amó al mundo, dio a su Hijo y ofrece vida eterna a todo aquel que cree. El versículo siguiente agrega que Dios no envió a su Hijo para condenar al mundo, sino para que el mundo sea salvo por él. En esta lección veremos por qué necesitamos ser salvos, qué hizo Dios para salvarnos y cómo recibimos esa salvación.',
   'João 3:16 talvez seja o versículo mais conhecido da Bíblia, e com razão: em poucas palavras ele resume todo o evangelho. Deus amou o mundo, deu o seu Filho e oferece a vida eterna a todo aquele que crê. O versículo seguinte acrescenta que Deus não enviou o seu Filho para condenar o mundo, mas para que o mundo fosse salvo por ele. Nesta lição veremos por que precisamos ser salvos, o que Deus fez para nos salvar e como recebemos essa salvação.'),
  [('Rm 3:23',('Todos necesitamos salvación','Todos precisamos de salvação'),
    ('La Biblia dice que «todos pecaron» y están destituidos de la gloria de Dios. Nadie queda fuera de esta frase: ni el religioso ni el que vive lejos de Dios. El pecado no es solo hacer cosas malas; es vivir apartado de Dios y de su voluntad. Reconocer esta realidad no es para hundirnos en la culpa, sino para entender por qué necesitamos un Salvador.',
     'A Bíblia diz que “todos pecaram” e estão destituídos da glória de Deus. Ninguém fica de fora dessa frase: nem o religioso nem quem vive longe de Deus. O pecado não é apenas fazer coisas erradas; é viver afastado de Deus e da sua vontade. Reconhecer essa realidade não é para nos afundar na culpa, mas para entender por que precisamos de um Salvador.')),
   ('Rm 6:23',('Un regalo, no un salario','Um presente, não um salário'),
    ('Pablo compara dos cosas: el salario y el regalo. «La paga del pecado es muerte»: eso es lo que merecemos. Pero «la dádiva de Dios es vida eterna en Cristo Jesús». Un salario se gana trabajando; un regalo solo se recibe. La vida eterna no se compra con buenas obras ni con sacrificios personales. Dios la ofrece gratuitamente por medio de su Hijo.',
     'Paulo compara duas coisas: o salário e o presente. “O salário do pecado é a morte”: é isso que merecemos. Mas “o dom gratuito de Deus é a vida eterna em Cristo Jesus”. Um salário se ganha trabalhando; um presente apenas se recebe. A vida eterna não se compra com boas obras nem com sacrifícios pessoais. Deus a oferece gratuitamente por meio do seu Filho.')),
   ('At 4:12',('Solamente en Jesús','Somente em Jesus'),
    ('Pedro afirmó con valentía que no hay otro nombre debajo del cielo en que podamos ser salvos. Esto no es orgullo religioso; es la verdad del evangelio. Jesús es el único que murió por nuestros pecados y resucitó. Por eso la salvación no depende de una iglesia, de una tradición ni de nuestro esfuerzo, sino de creer en él y entregarle la vida.',
     'Pedro afirmou com coragem que não há outro nome debaixo do céu pelo qual devamos ser salvos. Isso não é orgulho religioso; é a verdade do evangelho. Jesus é o único que morreu pelos nossos pecados e ressuscitou. Por isso a salvação não depende de uma igreja, de uma tradição ou do nosso esforço, mas de crer nele e entregar-lhe a vida.'))],
  [('Según Juan 3:16, ¿qué hizo Dios por amor al mundo?','Segundo João 3:16, o que Deus fez por amor ao mundo?'),
   ('¿Por qué cree usted que muchas personas piensan que pueden salvarse por sus propias obras?','Por que você acha que muitas pessoas pensam que podem se salvar pelas próprias obras?'),
   ('¿Qué diferencia hay entre recibir un salario y recibir un regalo? ¿Cómo se aplica esto a la salvación?','Qual é a diferença entre receber um salário e receber um presente? Como isso se aplica à salvação?'),
   ('¿Cómo explicaría usted el camino de la salvación a un vecino, con palabras sencillas?','Como você explicaria o caminho da salvação a um vizinho, com palavras simples?')],
  ('Esta semana, escriba en pocas líneas cómo conoció a Jesús y compártalo con una persona que todavía no lo conoce.',
   'Nesta semana, escreva em poucas linhas como você conheceu Jesus e compartilhe com uma pessoa que ainda não o conhece.'),
  'Jo 3:16',
  ('Padre, gracias por amarnos tanto que diste a Tu Hijo por nosotros. Hoy creemos en Jesús y le entregamos nuestra vida. Usa a cada uno de nosotros para anunciar esta buena noticia. En el nombre de Jesús, amén.',
   'Pai, obrigado por nos amar tanto a ponto de dar o teu Filho por nós. Hoje cremos em Jesus e lhe entregamos a nossa vida. Usa cada um de nós para anunciar esta boa notícia. Em nome de Jesus, amém.'))

L('Ef 2:8-9',('La gracia de Dios','A graça de Deus'),
  ('Entender que somos salvos por la gracia de Dios, no por nuestros méritos, y que esa gracia nos sostiene cada día.',
   'Entender que somos salvos pela graça de Deus, não pelos nossos méritos, e que essa graça nos sustenta a cada dia.'),
  ('¿Recuerda algún regalo que recibió sin merecerlo? ¿Cómo reaccionó?',
   'Você se lembra de algum presente que recebeu sem merecer? Como reagiu?'),
  ('Gracia es una palabra que escuchamos mucho en la iglesia, pero no siempre entendemos lo que significa. Gracia es el favor de Dios que no merecemos. Pablo escribió a los efesios que somos salvos por gracia, por medio de la fe, y que esto no viene de nosotros: es don de Dios. Tampoco es por obras, para que nadie se gloríe. En esta lección veremos cómo la gracia nos alcanza, cómo se demostró en la cruz y cómo nos sostiene en medio de nuestras debilidades.',
   'Graça é uma palavra que ouvimos muito na igreja, mas nem sempre entendemos o que significa. Graça é o favor de Deus que não merecemos. Paulo escreveu aos efésios que somos salvos pela graça, por meio da fé, e que isso não vem de nós: é dom de Deus. Também não é por obras, para que ninguém se orgulhe. Nesta lição veremos como a graça nos alcança, como ela se mostrou na cruz e como nos sustenta em meio às nossas fraquezas.'),
  [('Tt 2:11',('Una gracia para todos','Uma graça para todos'),
    ('Pablo dice que la gracia de Dios, que trae salvación a todos los hombres, se manifestó. Nadie está tan lejos que no pueda ser alcanzado. La gracia no es solo para los que crecieron en la iglesia ni para los que parecen buenos. Es para el que cayó, para el que tiene vergüenza de su pasado y para el que piensa que ya no tiene arreglo.',
     'Paulo diz que a graça salvadora de Deus se manifestou a todos os homens. Ninguém está tão longe que não possa ser alcançado. A graça não é só para quem cresceu na igreja nem para quem parece bom. É para quem caiu, para quem tem vergonha do seu passado e para quem pensa que já não tem mais jeito.')),
   ('Rm 5:8',('Una gracia que se ve en la cruz','Uma graça que se vê na cruz'),
    ('Dios no esperó a que fuéramos mejores para amarnos. Cristo murió por nosotros «siendo aún pecadores». La cruz es la prueba más clara de la gracia: el Justo murió por los injustos. Cuando dudamos del amor de Dios, no debemos mirar nuestras circunstancias, sino la cruz. Allí Dios mostró cuánto vale para él cada persona.',
     'Deus não esperou que fôssemos melhores para nos amar. Cristo morreu por nós “quando ainda éramos pecadores”. A cruz é a prova mais clara da graça: o Justo morreu pelos injustos. Quando duvidamos do amor de Deus, não devemos olhar para as nossas circunstâncias, mas para a cruz. Ali Deus mostrou quanto vale para ele cada pessoa.')),
   ('2Co 12:9',('Una gracia que nos sostiene','Uma graça que nos sustenta'),
    ('La gracia no termina el día de nuestra conversión. Pablo pidió a Dios que le quitara una aflicción, y el Señor le respondió: «Bástate mi gracia». La gracia también es la fuerza de Dios para seguir adelante cuando nos sentimos débiles. No tenemos que fingir fortaleza; en nuestra debilidad, el poder de Cristo se perfecciona.',
     'A graça não termina no dia da nossa conversão. Paulo pediu a Deus que lhe tirasse uma aflição, e o Senhor lhe respondeu: “Minha graça te basta”. A graça também é a força de Deus para seguir em frente quando nos sentimos fracos. Não precisamos fingir força; na nossa fraqueza, o poder de Cristo se aperfeiçoa.'))],
  [('Con sus propias palabras, ¿qué es la gracia de Dios?','Com suas próprias palavras, o que é a graça de Deus?'),
   ('¿Por qué es tan difícil para algunas personas aceptar algo que no pueden ganar?','Por que é tão difícil para algumas pessoas aceitar algo que não podem conquistar?'),
   ('Si somos salvos por gracia, ¿qué lugar tienen las buenas obras en la vida del creyente?','Se somos salvos pela graça, que lugar têm as boas obras na vida do crente?'),
   ('¿En qué momento de su vida experimentó usted la gracia de Dios que sostiene?','Em que momento da sua vida você experimentou a graça de Deus que sustenta?')],
  ('Piense en una persona que necesita conocer la gracia de Dios y busque una oportunidad esta semana para tratarla con la misma gracia que usted recibió.',
   'Pense em uma pessoa que precisa conhecer a graça de Deus e procure uma oportunidade nesta semana para tratá-la com a mesma graça que você recebeu.'),
  'Ef 2:8',
  ('Señor, gracias porque nos salvaste sin que lo mereciéramos. Líbranos del orgullo. Que Tu gracia nos sostenga en la debilidad y nos haga generosos con los demás. En el nombre de Jesús, amén.',
   'Senhor, obrigado porque nos salvaste sem que merecêssemos. Livra-nos do orgulho. Que a tua graça nos sustente na fraqueza e nos faça generosos com os outros. Em nome de Jesus, amém.'))

L('Hb 11:1-6',('Vivir por la fe','Viver pela fé'),
  ('Aprender qué es la fe bíblica, cómo crece y cómo se demuestra en la vida diaria.',
   'Aprender o que é a fé bíblica, como ela cresce e como se demonstra na vida diária.'),
  ('¿En qué cosas o personas confía usted todos los días sin pensarlo mucho? Por ejemplo, una silla o un chofer.',
   'Em que coisas ou pessoas você confia todos os dias sem pensar muito? Por exemplo, uma cadeira ou um motorista.'),
  ('Hebreos 11 es conocido como el capítulo de la fe. Comienza diciendo que la fe es la certeza de lo que se espera y la convicción de lo que no se ve. Luego presenta a hombres y mujeres que confiaron en Dios, como Abel y Enoc. El versículo 6 es muy claro: sin fe es imposible agradar a Dios. La fe no es un sentimiento ni un pensamiento positivo; es confiar en Dios y en lo que él dijo. En esta lección veremos de dónde viene la fe, cómo crece y cómo se demuestra.',
   'Hebreus 11 é conhecido como o capítulo da fé. Ele começa dizendo que a fé é a certeza das coisas que se esperam e a prova das coisas que não se veem. Depois apresenta homens e mulheres que confiaram em Deus, como Abel e Enoque. O versículo 6 é muito claro: sem fé é impossível agradar a Deus. A fé não é um sentimento nem um pensamento positivo; é confiar em Deus e no que ele disse. Nesta lição veremos de onde vem a fé, como ela cresce e como se demonstra.'),
  [('Rm 10:17',('La fe viene por oír la Palabra','A fé vem pelo ouvir a Palavra'),
    ('Pablo enseña que la fe es por el oír, y el oír por la palabra de Dios. La fe no se fabrica con fuerza de voluntad; nace cuando escuchamos lo que Dios dice. Por eso es tan importante leer la Biblia, escuchar la predicación y participar en la célula. Quien se alimenta de la Palabra fortalece su confianza en Dios.',
     'Paulo ensina que a fé vem pelo ouvir, e o ouvir pela palavra de Cristo. A fé não se fabrica com força de vontade; ela nasce quando ouvimos o que Deus diz. Por isso é tão importante ler a Bíblia, ouvir a pregação e participar da célula. Quem se alimenta da Palavra fortalece a sua confiança em Deus.')),
   ('Mc 9:23-24',('Una fe que puede crecer','Uma fé que pode crescer'),
    ('Un padre desesperado trajo a su hijo a Jesús. Cuando Jesús le habló de creer, el hombre respondió con sinceridad: «Creo, ayuda mi incredulidad». Jesús no lo rechazó por tener una fe débil. Dios recibe la fe pequeña y la hace crecer. No necesitamos esconder nuestras dudas; podemos llevarlas a Jesús y pedirle ayuda.',
     'Um pai desesperado trouxe o seu filho a Jesus. Quando Jesus lhe falou sobre crer, o homem respondeu com sinceridade: “Creio! Ajuda-me na minha incredulidade”. Jesus não o rejeitou por ter uma fé fraca. Deus recebe a fé pequena e a faz crescer. Não precisamos esconder as nossas dúvidas; podemos levá-las a Jesus e pedir a sua ajuda.')),
   ('Tg 2:17',('Una fe que se ve en las obras','Uma fé que se vê nas obras'),
    ('Santiago dice que la fe sin obras está muerta. No somos salvos por las obras, pero la fe verdadera siempre produce cambios. Si confiamos en Dios, eso se nota en cómo tratamos a la familia, en cómo trabajamos y en cómo enfrentamos los problemas. La fe que solo queda en palabras no ha echado raíces en el corazón.',
     'Tiago diz que a fé sem obras é morta. Não somos salvos pelas obras, mas a fé verdadeira sempre produz mudanças. Se confiamos em Deus, isso aparece em como tratamos a família, em como trabalhamos e em como enfrentamos os problemas. A fé que fica só nas palavras ainda não criou raízes no coração.'))],
  [('Según Hebreos 11:6, ¿qué necesita creer quien se acerca a Dios?','Segundo Hebreus 11:6, o que precisa crer quem se aproxima de Deus?'),
   ('¿Cuál es la diferencia entre la fe bíblica y el simple «pensar positivo»?','Qual é a diferença entre a fé bíblica e o simples “pensamento positivo”?'),
   ('¿Qué hace usted para alimentar su fe durante la semana?','O que você faz para alimentar a sua fé durante a semana?'),
   ('¿Por qué cree que Jesús no rechazó al padre que dijo «ayuda mi incredulidad»?','Por que você acha que Jesus não rejeitou o pai que disse “ajuda-me na minha incredulidade”?'),
   ('¿Cómo se puede ver la fe de una persona en su vida diaria?','Como se pode ver a fé de uma pessoa na vida diária?')],
  ('Elija una situación difícil que usted está viviendo, busque una promesa de la Biblia sobre ella y ore cada día de esta semana confiando en esa promesa.',
   'Escolha uma situação difícil que você está vivendo, procure uma promessa da Bíblia sobre ela e ore todos os dias desta semana confiando nessa promessa.'),
  'Hb 11:6',
  ('Señor, creemos, pero ayuda nuestra incredulidad. Aumenta nuestra fe por medio de Tu Palabra y danos valor para obedecer aunque no veamos todo el camino. Que nuestra vida muestre que confiamos en Ti. En el nombre de Jesús, amén.',
   'Senhor, nós cremos, mas ajuda a nossa incredulidade. Aumenta a nossa fé pela tua Palavra e dá-nos coragem para obedecer mesmo sem ver todo o caminho. Que a nossa vida mostre que confiamos em ti. Em nome de Jesus, amém.'))

L('Lc 15:17-20',('El arrepentimiento','O arrependimento'),
  ('Comprender que el arrepentimiento es volver a Dios con el corazón sincero y recibir su perdón.',
   'Compreender que o arrependimento é voltar para Deus com o coração sincero e receber o seu perdão.'),
  ('¿Alguna vez tomó un camino equivocado mientras viajaba? ¿Qué hizo cuando se dio cuenta?',
   'Alguma vez você pegou um caminho errado durante uma viagem? O que fez quando percebeu?'),
  ('En la parábola del hijo pródigo, Jesús cuenta la historia de un joven que pidió su herencia, se fue lejos y lo malgastó todo. Cuando llegó al fondo, «volvió en sí» y decidió regresar a su padre. Lo más sorprendente es la reacción del padre: lo vio de lejos, tuvo compasión, corrió a su encuentro y lo besó. Así es Dios con quien se arrepiente. En esta lección veremos qué es el arrepentimiento verdadero, qué produce en nosotros y qué promete Dios a quien vuelve a él.',
   'Na parábola do filho pródigo, Jesus conta a história de um jovem que pediu a sua herança, foi para longe e desperdiçou tudo. Quando chegou ao fundo do poço, caiu em si e decidiu voltar para o seu pai. O mais surpreendente é a reação do pai: ele o viu de longe, teve compaixão, correu ao seu encontro e o beijou. Assim é Deus com quem se arrepende. Nesta lição veremos o que é o arrependimento verdadeiro, o que ele produz em nós e o que Deus promete a quem volta para ele.'),
  [('2Co 7:10',('Una tristeza que lleva a la vida','Uma tristeza que leva à vida'),
    ('Pablo distingue dos tipos de dolor. El dolor del mundo solo produce muerte: culpa, vergüenza y desesperanza. Pero el dolor que es según Dios produce arrepentimiento para salvación. No basta con sentirse mal por las consecuencias del pecado; el arrepentimiento verdadero lamenta haber ofendido a Dios y nos lleva de regreso a él.',
     'Paulo distingue dois tipos de tristeza. A tristeza do mundo só produz morte: culpa, vergonha e desesperança. Mas a tristeza segundo a vontade de Deus produz arrependimento para a salvação. Não basta sentir-se mal pelas consequências do pecado; o arrependimento verdadeiro lamenta ter ofendido a Deus e nos leva de volta para ele.')),
   ('At 3:19',('Cambiar de dirección','Mudar de direção'),
    ('Pedro dijo: «arrepentíos y convertíos». Arrepentirse es cambiar de mente; convertirse es dar media vuelta y caminar en otra dirección. El hijo pródigo no solo pensó en su padre; se levantó y fue. El arrepentimiento incluye decisiones concretas: dejar lo que ofende a Dios y empezar a obedecerle. Y trae una promesa: los pecados son borrados.',
     'Pedro disse: “Arrependei-vos e convertei-vos”. Arrepender-se é mudar de mente; converter-se é dar meia-volta e caminhar em outra direção. O filho pródigo não só pensou no seu pai; ele se levantou e foi. O arrependimento inclui decisões concretas: deixar o que ofende a Deus e começar a obedecê-lo. E traz uma promessa: os pecados são apagados.')),
   ('1Jo 1:9',('La promesa del perdón','A promessa do perdão'),
    ('Juan nos asegura que, si confesamos nuestros pecados, Dios es fiel y justo para perdonarnos y limpiarnos de toda maldad. No tenemos que ganar el perdón ni vivir cargando la culpa. Confesar es reconocer delante de Dios lo que hicimos, sin excusas. Quien se acerca con sinceridad encuentra un Padre dispuesto a recibirlo, como el padre de la parábola.',
     'João nos garante que, se confessarmos os nossos pecados, Deus é fiel e justo para nos perdoar e nos purificar de toda injustiça. Não precisamos conquistar o perdão nem viver carregando a culpa. Confessar é reconhecer diante de Deus o que fizemos, sem desculpas. Quem se aproxima com sinceridade encontra um Pai disposto a recebê-lo, como o pai da parábola.'))],
  [('¿Qué hizo el hijo pródigo cuando «volvió en sí»? ¿Qué nos enseña esto?','O que o filho pródigo fez quando caiu em si? O que isso nos ensina?'),
   ('¿Cuál es la diferencia entre sentir remordimiento y arrepentirse de verdad?','Qual é a diferença entre sentir remorso e arrepender-se de verdade?'),
   ('¿Qué le llama más la atención en la reacción del padre de la parábola?','O que mais chama a sua atenção na reação do pai da parábola?'),
   ('¿Por qué algunas personas siguen cargando culpa aunque ya confesaron su pecado a Dios?','Por que algumas pessoas continuam carregando culpa mesmo depois de confessar o seu pecado a Deus?')],
  ('Tome un momento a solas con Dios esta semana para examinar su corazón, confesar con sinceridad lo que Él le muestre y dar un paso concreto de cambio.',
   'Separe um momento a sós com Deus nesta semana para examinar o seu coração, confessar com sinceridade o que ele mostrar e dar um passo concreto de mudança.'),
  'At 3:19',
  ('Padre, gracias porque corres al encuentro de quien vuelve a Ti. Examina nuestro corazón y muéstranos lo que debemos dejar. Recibimos Tu perdón y queremos caminar en una nueva dirección. En el nombre de Jesús, amén.',
   'Pai, obrigado porque corres ao encontro de quem volta para ti. Examina o nosso coração e mostra-nos o que devemos deixar. Recebemos o teu perdão e queremos caminhar em uma nova direção. Em nome de Jesus, amém.'))

L('1Jo 5:11-13',('La seguridad de la salvación','A segurança da salvação'),
  ('Afirmar que el creyente puede tener la certeza de la vida eterna, basada en Cristo y no en sus sentimientos.',
   'Afirmar que o crente pode ter a certeza da vida eterna, baseada em Cristo e não nos seus sentimentos.'),
  ('Cuando usted firma un contrato o recibe una promesa importante, ¿qué le da seguridad de que se va a cumplir?',
   'Quando você assina um contrato ou recebe uma promessa importante, o que lhe dá segurança de que ela será cumprida?'),
  ('Muchos creyentes viven con dudas: «¿Será que soy salvo de verdad?». Algunos días se sienten cerca de Dios y otros días no. Juan escribió su carta precisamente para que los que creen en el nombre del Hijo de Dios sepan que tienen vida eterna. La seguridad de la salvación no depende de lo que sentimos, sino de lo que Dios dijo. En esta lección veremos en qué se basa esa seguridad: en la obra de Cristo, en el testimonio del Espíritu y en el amor de Dios que no nos suelta.',
   'Muitos crentes vivem com dúvidas: “Será que sou salvo de verdade?”. Em alguns dias se sentem perto de Deus e em outros não. João escreveu a sua carta justamente para que os que creem no nome do Filho de Deus saibam que têm a vida eterna. A segurança da salvação não depende do que sentimos, mas do que Deus disse. Nesta lição veremos em que se baseia essa segurança: na obra de Cristo, no testemunho do Espírito e no amor de Deus que não nos solta.'),
  [('Jo 10:27-29',('En las manos del Buen Pastor','Nas mãos do Bom Pastor'),
    ('Jesús dice que sus ovejas oyen su voz, lo siguen y que él les da vida eterna. Nadie las arrebatará de su mano ni de la mano del Padre. Nuestra seguridad está en quién nos sostiene. Al mismo tiempo, el texto describe a las ovejas como las que oyen y siguen. La seguridad es para quien camina con el Pastor.',
     'Jesus diz que as suas ovelhas ouvem a sua voz, o seguem e que ele lhes dá a vida eterna. Ninguém as arrancará da sua mão nem da mão do Pai. A nossa segurança está em quem nos segura. Ao mesmo tempo, o texto descreve as ovelhas como aquelas que ouvem e seguem. A segurança é para quem caminha com o Pastor.')),
   ('Rm 8:16',('El testimonio del Espíritu','O testemunho do Espírito'),
    ('Dios no solo nos da su Palabra; también nos da su Espíritu. Pablo dice que el mismo Espíritu da testimonio a nuestro espíritu de que somos hijos de Dios. Es una convicción interior que el Espíritu Santo produce en el creyente: Dios es mi Padre y yo le pertenezco. Esa voz interior siempre está de acuerdo con la Biblia.',
     'Deus não nos dá apenas a sua Palavra; ele também nos dá o seu Espírito. Paulo diz que o próprio Espírito dá testemunho com o nosso espírito de que somos filhos de Deus. É uma convicção interior que o Espírito Santo produz no crente: Deus é meu Pai e eu pertenço a ele. Essa voz interior sempre está de acordo com a Bíblia.')),
   ('Rm 8:38-39',('Un amor que no nos suelta','Um amor que não nos solta'),
    ('Pablo hace una lista de todo lo que podría asustarnos: la muerte, la vida, los ángeles, lo presente y lo por venir. Y concluye que nada de eso nos podrá apartar del amor de Dios que es en Cristo Jesús. Las pruebas no significan que Dios nos abandonó. Su amor es más fuerte que cualquier circunstancia.',
     'Paulo faz uma lista de tudo o que poderia nos assustar: a morte, a vida, os anjos, o presente e o futuro. E conclui que nada disso poderá nos separar do amor de Deus que está em Cristo Jesus. As provações não significam que Deus nos abandonou. O seu amor é mais forte do que qualquer circunstância.'))],
  [('Según 1 Juan 5:12, ¿quién tiene la vida eterna?','Segundo 1 João 5:12, quem tem a vida eterna?'),
   ('¿Por qué no es buena idea basar la seguridad de la salvación en los sentimientos?','Por que não é uma boa ideia basear a segurança da salvação nos sentimentos?'),
   ('¿Qué significa para usted estar en las manos de Jesús y del Padre?','O que significa para você estar nas mãos de Jesus e do Pai?'),
   ('¿Qué situaciones hacen que algunas personas duden del amor de Dios?','Que situações fazem algumas pessoas duvidarem do amor de Deus?'),
   ('¿Cómo podemos ayudar a un hermano que vive con miedo de no ser salvo?','Como podemos ajudar um irmão que vive com medo de não ser salvo?')],
  ('Memorice 1 Juan 5:13 y, cuando lleguen las dudas, repítalo en voz alta como respuesta de fe a lo que Dios ya dijo.',
   'Memorize 1 João 5:13 e, quando vierem as dúvidas, repita-o em voz alta como resposta de fé ao que Deus já disse.'),
  '1Jo 5:13',
  ('Padre, gracias por la vida eterna que nos diste en Tu Hijo. Quita de nosotros el miedo. Que Tu Espíritu nos recuerde que somos Tus hijos, y ayúdanos a seguir al Buen Pastor. En el nombre de Jesús, amén.',
   'Pai, obrigado pela vida eterna que nos deste no teu Filho. Tira de nós o medo. Que o teu Espírito nos lembre que somos teus filhos, e ajuda-nos a seguir o Bom Pastor. Em nome de Jesus, amém.'))

L('2Co 5:17-18',('Una nueva vida en Cristo','Uma nova vida em Cristo'),
  ('Descubrir que en Cristo somos nuevas criaturas y aprender a vivir de acuerdo con esa nueva identidad.',
   'Descobrir que em Cristo somos novas criaturas e aprender a viver de acordo com essa nova identidade.'),
  ('Si pudiera empezar de nuevo alguna cosa de su vida, como un trabajo o una costumbre, ¿qué sería?',
   'Se você pudesse recomeçar alguma coisa na sua vida, como um trabalho ou um costume, o que seria?'),
  ('Pablo escribe una de las frases más esperanzadoras de la Biblia: si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron y todas son hechas nuevas. Seguir a Jesús no es solo agregar una actividad religiosa a la semana; es comenzar una vida nueva. Y todo esto viene de Dios, que nos reconcilió consigo por medio de Cristo. En esta lección veremos qué significa esa nueva vida, qué debemos dejar atrás y quién vive ahora en nosotros.',
   'Paulo escreve uma das frases mais cheias de esperança da Bíblia: se alguém está em Cristo, é nova criatura; as coisas velhas já passaram, e tudo se fez novo. Seguir Jesus não é apenas acrescentar uma atividade religiosa à semana; é começar uma vida nova. E tudo isso vem de Deus, que nos reconciliou consigo por meio de Cristo. Nesta lição veremos o que significa essa nova vida, o que devemos deixar para trás e quem vive agora em nós.'),
  [('Rm 6:4',('Andar en novedad de vida','Andar em novidade de vida'),
    ('Pablo explica que el bautismo en agua representa nuestra muerte y resurrección con Cristo. Así como él resucitó, nosotros también andamos en novedad de vida. El bautismo es un testimonio público de que la vida vieja quedó sepultada. Desde entonces, cada día es una oportunidad para caminar de una manera nueva.',
     'Paulo explica que o batismo nas águas representa a nossa morte e ressurreição com Cristo. Assim como ele ressuscitou, nós também andamos em novidade de vida. O batismo é um testemunho público de que a vida velha ficou sepultada. Desde então, cada dia é uma oportunidade para caminhar de um jeito novo.')),
   ('Ef 4:22-24',('Quitarse lo viejo y vestirse de lo nuevo','Despir o velho e vestir o novo'),
    ('Pablo usa la imagen de la ropa: dejar el viejo hombre y vestirse del nuevo, creado conforme a Dios en justicia y santidad. Hay costumbres, palabras y actitudes que ya no combinan con la vida en Cristo. Este cambio comienza en la mente, que necesita ser renovada. No es un proceso de un día, sino un crecimiento constante con la ayuda de Dios.',
     'Paulo usa a imagem da roupa: abandonar o velho ser humano e vestir o novo, criado conforme Deus na verdadeira justiça e santidade. Há costumes, palavras e atitudes que já não combinam com a vida em Cristo. Essa mudança começa na mente, que precisa ser renovada. Não é um processo de um dia, mas um crescimento constante com a ajuda de Deus.')),
   ('Gl 2:20',('Cristo vive en mí','Cristo vive em mim'),
    ('El secreto de la nueva vida no es nuestro esfuerzo, sino la presencia de Cristo. Pablo dice: «vive Cristo en mí». La vida cristiana no es imitar a Jesús desde lejos, sino dejar que él viva en nosotros por medio de la fe. Cuando nos sentimos incapaces de cambiar, recordamos que no estamos solos: el que nos amó y se entregó por nosotros nos da su vida.',
     'O segredo da nova vida não é o nosso esforço, mas a presença de Cristo. Paulo diz: “Cristo vive em mim”. A vida cristã não é imitar Jesus de longe, mas deixar que ele viva em nós por meio da fé. Quando nos sentimos incapazes de mudar, lembramos que não estamos sozinhos: aquele que nos amou e se entregou por nós nos dá a sua vida.'))],
  [('¿Qué significa ser una «nueva criatura» según 2 Corintios 5:17?','O que significa ser uma “nova criatura” segundo 2 Coríntios 5:17?'),
   ('¿Qué representa el bautismo en agua en la vida del creyente?','O que o batismo nas águas representa na vida do crente?'),
   ('¿Qué cosas de la «ropa vieja» le cuesta más dejar a las personas que se convierten?','Quais coisas da “roupa velha” são mais difíceis de deixar para quem se converte?'),
   ('¿Cómo se renueva la mente en la práctica?','Como a mente é renovada na prática?'),
   ('¿Qué cambio ha visto Dios hacer en su vida desde que conoció a Cristo?','Que mudança você viu Deus fazer na sua vida desde que conheceu Cristo?')],
  ('Identifique una actitud o costumbre de la vida vieja que todavía lo acompaña, entréguela a Dios en oración y pida a un hermano de la célula que ore con usted por ella.',
   'Identifique uma atitude ou costume da vida velha que ainda acompanha você, entregue-o a Deus em oração e peça a um irmão da célula que ore com você por isso.'),
  '2Co 5:17',
  ('Señor Jesús, gracias porque en Ti somos nuevas criaturas. Ayúdanos a dejar lo viejo y a vestirnos de lo nuevo. Renueva nuestra mente y vive en nosotros cada día. En Tu nombre, amén.',
   'Senhor Jesus, obrigado porque em ti somos novas criaturas. Ajuda-nos a deixar o velho e a vestir o novo. Renova a nossa mente e vive em nós a cada dia. Em teu nome, amém.'))

# ================================================================ Vida de oração
S('oracao','Vida de oración','Vida de oração',
  'Seis lecciones para aprender a orar: por qué orar, el Padrenuestro, la perseverancia, la intercesión, el ayuno y escuchar a Dios.',
  'Seis lições para aprender a orar: por que orar, o Pai-Nosso, a perseverança, a intercessão, o jejum e ouvir a Deus.')

L('Fp 4:6-7',('¿Por qué orar?','Por que orar?'),
  ('Entender que la oración es una invitación de Dios a hablar con él y a recibir su paz.',
   'Entender que a oração é um convite de Deus para falar com ele e receber a sua paz.'),
  ('¿Con quién habla usted cuando tiene una preocupación grande? ¿Por qué con esa persona?',
   'Com quem você conversa quando tem uma grande preocupação? Por que com essa pessoa?'),
  ('Muchos creyentes saben que deben orar, pero les cuesta hacerlo. A veces pensamos que Dios ya sabe todo, o que nuestras palabras no importan. Pablo escribió a los filipenses que no se afanaran por nada, sino que presentaran sus peticiones a Dios en toda oración y ruego, con acción de gracias. La promesa es hermosa: la paz de Dios guardará el corazón y los pensamientos. En esta lección veremos que la oración es una invitación de Dios, un acceso abierto por Cristo y un medio por el cual Dios responde.',
   'Muitos crentes sabem que devem orar, mas têm dificuldade de fazê-lo. Às vezes pensamos que Deus já sabe tudo, ou que as nossas palavras não importam. Paulo escreveu aos filipenses que não ficassem ansiosos por coisa alguma, mas que apresentassem os seus pedidos a Deus com oração, súplica e ações de graças. A promessa é linda: a paz de Deus guardará o coração e a mente. Nesta lição veremos que a oração é um convite de Deus, um acesso aberto por Cristo e um meio pelo qual Deus responde.'),
  [('Mt 7:7-8',('Dios nos invita a pedir','Deus nos convida a pedir'),
    ('Jesús dijo: «Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá». Orar no es molestar a Dios; es obedecer su invitación. Él quiere que le contemos lo que necesitamos, aunque ya lo sepa, porque la oración es parte de una relación. Un hijo no deja de hablar con su padre solo porque el padre ya conoce sus necesidades.',
     'Jesus disse: “Pedi, e vos será dado; buscai, e achareis; batei, e vos será aberto”. Orar não é incomodar a Deus; é obedecer ao seu convite. Ele quer que lhe contemos o que precisamos, mesmo que já saiba, porque a oração faz parte de um relacionamento. Um filho não deixa de falar com o pai só porque o pai já conhece as suas necessidades.')),
   ('Hb 4:16',('Tenemos acceso al trono de la gracia','Temos acesso ao trono da graça'),
    ('Por medio de Jesús, podemos acercarnos confiadamente al trono de la gracia. No necesitamos intermediarios ni palabras difíciles. Allí encontramos misericordia para nuestras faltas y ayuda en el momento oportuno. La confianza no viene de lo buenos que somos, sino de lo que Cristo hizo por nosotros.',
     'Por meio de Jesus, podemos nos aproximar com confiança do trono da graça. Não precisamos de intermediários nem de palavras difíceis. Ali encontramos misericórdia para as nossas falhas e socorro no tempo certo. A confiança não vem de quão bons somos, mas do que Cristo fez por nós.')),
   ('Jr 33:3',('Dios responde','Deus responde'),
    ('Dios dijo a Jeremías: «Clama á mí, y te responderé». La oración no es hablar al aire; hay alguien que escucha y responde. A veces la respuesta es sí, a veces es espere, y a veces es otra cosa mejor de lo que pedimos. Pero Dios siempre responde según su sabiduría y su amor, y en la oración también nos revela cosas que no sabíamos.',
     'Deus disse a Jeremias: “Clama a mim, e eu te responderei”. A oração não é falar ao vento; há alguém que ouve e responde. Às vezes a resposta é sim, às vezes é espere, e às vezes é algo melhor do que pedimos. Mas Deus sempre responde segundo a sua sabedoria e o seu amor, e na oração também nos revela coisas que não sabíamos.'))],
  [('¿Qué nos manda hacer Filipenses 4:6 en lugar de afanarnos?','O que Filipenses 4:6 nos manda fazer em vez de ficarmos ansiosos?'),
   ('¿Qué impide que muchas personas oren con frecuencia?','O que impede muitas pessoas de orarem com frequência?'),
   ('¿Por qué cree usted que Dios quiere que le pidamos, si ya sabe lo que necesitamos?','Por que você acha que Deus quer que lhe peçamos, se ele já sabe do que precisamos?'),
   ('¿Puede contar una ocasión en que Dios respondió una oración suya?','Você pode contar uma ocasião em que Deus respondeu a uma oração sua?')],
  ('Separe diez minutos cada día de esta semana, a la misma hora, para orar presentando a Dios sus preocupaciones con acción de gracias.',
   'Separe dez minutos todos os dias desta semana, no mesmo horário, para orar apresentando a Deus as suas preocupações com ações de graças.'),
  'Fp 4:6',
  ('Padre, gracias por invitarnos a hablar Contigo. Ponemos delante de Ti nuestras preocupaciones y Te damos gracias por cada bendición recibida. Guarda nuestro corazón con Tu paz. En el nombre de Jesús, amén.',
   'Pai, obrigado por nos convidar a falar contigo. Colocamos diante de ti as nossas preocupações e te damos graças por cada bênção recebida. Guarda o nosso coração com a tua paz. Em nome de Jesus, amém.'))

L('Mt 6:9-13',('La oración que Jesús enseñó','A oração que Jesus ensinou'),
  ('Aprender del Padrenuestro un modelo de oración que pone a Dios en primer lugar y le presenta nuestras necesidades.',
   'Aprender com o Pai-Nosso um modelo de oração que coloca Deus em primeiro lugar e lhe apresenta as nossas necessidades.'),
  ('¿Recuerda quién le enseñó a orar por primera vez? ¿Cómo fue?',
   'Você se lembra de quem lhe ensinou a orar pela primeira vez? Como foi?'),
  ('Los discípulos veían a Jesús orar y querían aprender. En el Sermón del Monte, Jesús les dio un modelo de oración que conocemos como el Padrenuestro. No es una fórmula mágica para repetir sin pensar, sino una guía que nos enseña qué cosas son importantes al hablar con Dios. Comienza con Dios y su reino, sigue con nuestras necesidades diarias, el perdón y la protección. En esta lección recorreremos esta oración por partes para que aprendamos a orar como Jesús enseñó.',
   'Os discípulos viam Jesus orar e queriam aprender. No Sermão do Monte, Jesus lhes deu um modelo de oração que conhecemos como o Pai-Nosso. Não é uma fórmula mágica para repetir sem pensar, mas um guia que nos ensina o que é importante ao falar com Deus. Começa com Deus e o seu Reino, continua com as nossas necessidades diárias, o perdão e a proteção. Nesta lição percorreremos essa oração por partes para aprendermos a orar como Jesus ensinou.'),
  [('Mt 6:9',('Padre nuestro: una relación','Pai nosso: um relacionamento'),
    ('Jesús nos enseña a llamar a Dios «Padre nuestro». La oración comienza con una relación de hijos, no de extraños. Y dice «nuestro», no «mío»: oramos como parte de una familia. Luego pedimos que su nombre sea santificado, es decir, honrado y respetado. Antes de pedir cosas, reconocemos quién es Dios.',
     'Jesus nos ensina a chamar Deus de “Pai nosso”. A oração começa com um relacionamento de filhos, não de estranhos. E ele diz “nosso”, não “meu”: oramos como parte de uma família. Depois pedimos que o seu nome seja santificado, isto é, honrado e respeitado. Antes de pedir coisas, reconhecemos quem Deus é.')),
   ('Mt 6:10',('Su reino y su voluntad primero','O seu Reino e a sua vontade primeiro'),
    ('Pedir que venga el reino de Dios y que se haga su voluntad es poner nuestros planes en sus manos. Esta parte de la oración cambia nuestro corazón: dejamos de querer que Dios haga lo que nosotros queremos y empezamos a querer lo que él quiere. Es la misma actitud de Jesús en Getsemaní: «no se haga mi voluntad, sino la tuya».',
     'Pedir que venha o Reino de Deus e que seja feita a sua vontade é colocar os nossos planos nas mãos dele. Essa parte da oração muda o nosso coração: deixamos de querer que Deus faça o que nós queremos e começamos a querer o que ele quer. É a mesma atitude de Jesus no Getsêmani: “não se faça minha vontade, mas a tua”.')),
   ('Mt 6:11-13',('Pan, perdón y protección','Pão, perdão e proteção'),
    ('Después Jesús nos enseña a pedir el pan de cada día, el perdón de nuestras deudas y la protección contra la tentación y el mal. Dios se interesa por lo cotidiano: la comida, el trabajo y la salud. También nos recuerda que recibir perdón va unido a perdonar a otros. Y que necesitamos depender de él para no caer.',
     'Depois Jesus nos ensina a pedir o pão de cada dia, o perdão das nossas dívidas e a proteção contra a tentação e o mal. Deus se interessa pelo cotidiano: a comida, o trabalho e a saúde. Ele também nos lembra que receber perdão está ligado a perdoar os outros. E que precisamos depender dele para não cair.'))],
  [('¿Qué significa para usted poder llamar a Dios «Padre»?','O que significa para você poder chamar Deus de “Pai”?'),
   ('¿Por qué cree que Jesús puso el reino y la voluntad de Dios antes de nuestras necesidades?','Por que você acha que Jesus colocou o Reino e a vontade de Deus antes das nossas necessidades?'),
   ('¿Qué nos enseña el pedido del «pan de cada día» sobre la confianza en Dios?','O que o pedido do “pão de cada dia” nos ensina sobre a confiança em Deus?'),
   ('¿Por qué es peligroso repetir el Padrenuestro sin pensar en lo que decimos?','Por que é perigoso repetir o Pai-Nosso sem pensar no que dizemos?'),
   ('¿Qué parte de esta oración le resulta más difícil de vivir?','Qual parte dessa oração é mais difícil para você viver?')],
  ('Esta semana use cada frase del Padrenuestro como guía: lea una línea, deténgase y ore con sus propias palabras sobre ese tema.',
   'Nesta semana use cada frase do Pai-Nosso como guia: leia uma linha, pare e ore com as suas próprias palavras sobre esse tema.'),
  'Mt 6:9',
  ('Padre nuestro, que Tu nombre sea honrado en nosotros. Que venga Tu reino y se haga Tu voluntad en nuestras casas. Danos el pan de hoy, enséñanos a perdonar y líbranos del mal. En el nombre de Jesús, amén.',
   'Pai nosso, que o teu nome seja honrado em nós. Venha o teu Reino e seja feita a tua vontade em nossas casas. Dá-nos o pão de hoje, ensina-nos a perdoar e livra-nos do mal. Em nome de Jesus, amém.'))

L('Lc 11:5-10',('Perseverar en la oración','Perseverar na oração'),
  ('Aprender a orar con perseverancia, sin desanimarse cuando la respuesta tarda.',
   'Aprender a orar com perseverança, sem desanimar quando a resposta demora.'),
  ('¿Alguna vez tuvo que insistir mucho para conseguir algo importante? ¿Valió la pena?',
   'Alguma vez você precisou insistir muito para conseguir algo importante? Valeu a pena?'),
  ('Jesús contó la historia de un hombre que, a medianoche, fue a pedir tres panes a un amigo porque le había llegado una visita. El amigo, ya acostado con sus niños, no quería levantarse. Pero por la insistencia del que pedía, se levantó y le dio lo que necesitaba. Jesús no está diciendo que Dios sea como ese amigo cansado; al contrario, si un amigo responde a la insistencia, cuánto más nuestro Padre. En esta lección aprenderemos a perseverar en la oración sin desmayar.',
   'Jesus contou a história de um homem que, à meia-noite, foi pedir três pães a um amigo porque havia chegado uma visita. O amigo, já deitado com os filhos, não queria se levantar. Mas, por causa da insistência de quem pedia, ele se levantou e lhe deu o que precisava. Jesus não está dizendo que Deus é como esse amigo cansado; pelo contrário, se um amigo responde à insistência, quanto mais o nosso Pai. Nesta lição aprenderemos a perseverar na oração sem desanimar.'),
  [('1Ts 5:17',('Orar sin cesar','Orar sem cessar'),
    ('Pablo nos dice: «Orad sin cesar». Esto no significa estar de rodillas todo el día, sino vivir en una actitud constante de conversación con Dios. Podemos orar mientras trabajamos, viajamos o cuidamos la casa. Además de los momentos especiales de oración, aprendemos a llevar todo a Dios a lo largo del día.',
     'Paulo nos diz: “Orai sem cessar”. Isso não significa ficar de joelhos o dia inteiro, mas viver em uma atitude constante de conversa com Deus. Podemos orar enquanto trabalhamos, viajamos ou cuidamos da casa. Além dos momentos especiais de oração, aprendemos a levar tudo a Deus ao longo do dia.')),
   ('Tg 5:17-18',('El ejemplo de Elías','O exemplo de Elias'),
    ('Santiago nos recuerda que Elías era un hombre como nosotros. Oró para que no lloviera, y no llovió; otra vez oró, y el cielo dio lluvia. Elías no tenía superpoderes; tenía un Dios poderoso y no dejó de orar. Su historia nos anima: Dios también escucha la oración de personas comunes que confían en él.',
     'Tiago nos lembra que Elias era tão humano quanto nós. Orou para que não chovesse, e não choveu; orou outra vez, e o céu deu chuva. Elias não tinha superpoderes; tinha um Deus poderoso e não deixou de orar. A sua história nos anima: Deus também ouve a oração de pessoas comuns que confiam nele.')),
   ('Cl 4:2',('Velar con gratitud','Vigiar com gratidão'),
    ('Pablo dice: «Perseverad en oración, velando en ella con hacimiento de gracias». Perseverar no es repetir palabras vacías, sino seguir confiando. Velar es estar atentos y despiertos espiritualmente. Y la gratitud protege nuestro corazón del desánimo, porque recordamos lo que Dios ya hizo mientras esperamos lo que todavía no vemos.',
     'Paulo diz: “Perseverai na oração, vigiando nela com gratidão”. Perseverar não é repetir palavras vazias, mas continuar confiando. Vigiar é estar atento e desperto espiritualmente. E a gratidão protege o nosso coração do desânimo, porque lembramos do que Deus já fez enquanto esperamos o que ainda não vemos.'))],
  [('¿Qué nos enseña la parábola del amigo a medianoche sobre la oración?','O que a parábola do amigo à meia-noite nos ensina sobre a oração?'),
   ('¿Por qué algunas personas dejan de orar por algo después de un tiempo?','Por que algumas pessoas deixam de orar por alguma coisa depois de um tempo?'),
   ('¿Cómo se puede «orar sin cesar» en medio de un día de trabajo?','Como se pode “orar sem cessar” no meio de um dia de trabalho?'),
   ('¿Qué le enseña el ejemplo de Elías sobre la oración de una persona común?','O que o exemplo de Elias ensina sobre a oração de uma pessoa comum?')],
  ('Haga una lista de tres motivos por los que dejó de orar y vuelva a presentarlos a Dios cada día de esta semana, con gratitud.',
   'Faça uma lista de três motivos pelos quais você deixou de orar e volte a apresentá-los a Deus todos os dias desta semana, com gratidão.'),
  'Lc 18:1',
  ('Señor, perdónanos por las veces que nos cansamos de orar. Danos un corazón perseverante y agradecido. Ayúdanos a seguir llamando a Tu puerta con fe, confiando en Tu bondad de Padre. En el nombre de Jesús, amén.',
   'Senhor, perdoa-nos pelas vezes que nos cansamos de orar. Dá-nos um coração perseverante e agradecido. Ajuda-nos a continuar batendo à tua porta com fé, confiando na tua bondade de Pai. Em nome de Jesus, amém.'))

L('1Tm 2:1-4',('Orar por los demás','Orar pelos outros'),
  ('Comprender el llamado a interceder por otras personas y practicarlo en la célula.',
   'Compreender o chamado para interceder por outras pessoas e praticá-lo na célula.'),
  ('¿Alguna vez supo que alguien estaba orando por usted? ¿Cómo se sintió?',
   'Alguma vez você soube que alguém estava orando por você? Como se sentiu?'),
  ('Pablo pidió a Timoteo que, ante todas las cosas, se hicieran rogativas, oraciones, peticiones y acciones de gracias por todos los hombres, incluso por los reyes y las autoridades. Interceder es orar a favor de otra persona, presentarla delante de Dios. Es uno de los servicios más poderosos que un creyente puede hacer, y cualquiera puede hacerlo. El texto termina recordando que Dios quiere que todos sean salvos. En esta lección veremos qué es la intercesión, su poder y el ejemplo de Jesús.',
   'Paulo pediu a Timóteo que, antes de tudo, se fizessem pedidos, orações, intercessões e ações de graças por todas as pessoas, inclusive pelos reis e pelas autoridades. Interceder é orar em favor de outra pessoa, apresentá-la diante de Deus. É um dos serviços mais poderosos que um crente pode fazer, e qualquer um pode fazê-lo. O texto termina lembrando que Deus quer que todos sejam salvos. Nesta lição veremos o que é a intercessão, o seu poder e o exemplo de Jesus.'),
  [('Ez 22:30',('Ponerse en la brecha','Colocar-se na brecha'),
    ('Dios buscó a alguien que se pusiera en la brecha delante de él a favor de la tierra, y no lo halló. La imagen es la de un muro roto que necesita a alguien parado en el hueco. El intercesor se pone entre Dios y la necesidad de su pueblo. Hoy Dios sigue buscando personas dispuestas a orar por su familia, su barrio y su nación.',
     'Deus buscou alguém que se colocasse na brecha diante dele em favor da terra, e não achou ninguém. A imagem é a de um muro quebrado que precisa de alguém de pé na abertura. O intercessor se coloca entre Deus e a necessidade do seu povo. Hoje Deus continua buscando pessoas dispostas a orar pela sua família, pelo seu bairro e pela sua nação.')),
   ('Tg 5:16',('La oración unos por otros','A oração uns pelos outros'),
    ('Santiago nos manda orar unos por otros y afirma que la oración del justo, obrando eficazmente, puede mucho. La célula es un lugar ideal para esto: compartimos cargas y oramos juntos. No hace falta ser un líder ni hablar bonito. Lo que da poder a la oración es el Dios que la escucha.',
     'Tiago nos manda orar uns pelos outros e afirma que a oração de um justo muito pode efetuar. A célula é um lugar ideal para isso: compartilhamos fardos e oramos juntos. Não é preciso ser líder nem falar bonito. O que dá poder à oração é o Deus que a ouve.')),
   ('Hb 7:25',('Jesús, nuestro intercesor','Jesus, o nosso intercessor'),
    ('El mayor ejemplo de intercesión es Jesús mismo. La carta a los Hebreos dice que él vive siempre para interceder por los que se acercan a Dios por medio de él. En este momento, Cristo está orando por nosotros. Cuando intercedemos por otros, estamos imitando a nuestro Señor y participando de su obra.',
     'O maior exemplo de intercessão é o próprio Jesus. A carta aos Hebreus diz que ele vive para sempre para interceder pelos que se aproximam de Deus por meio dele. Neste momento, Cristo está orando por nós. Quando intercedemos pelos outros, estamos imitando o nosso Senhor e participando da sua obra.'))],
  [('Según 1 Timoteo 2:1-2, ¿por quiénes debemos orar?','Segundo 1 Timóteo 2:1-2, por quem devemos orar?'),
   ('¿Por qué es importante orar también por las autoridades?','Por que é importante orar também pelas autoridades?'),
   ('¿Qué significa «ponerse en la brecha» por alguien?','O que significa “colocar-se na brecha” por alguém?'),
   ('¿Cómo podemos organizarnos en la célula para orar unos por otros durante la semana?','Como podemos nos organizar na célula para orar uns pelos outros durante a semana?'),
   ('¿Qué siente al saber que Jesús intercede por usted?','O que você sente ao saber que Jesus intercede por você?')],
  ('Escriba los nombres de cinco personas que todavía no conocen a Cristo y ore por ellas cada día; al final de la reunión, formen parejas de oración para la semana.',
   'Escreva os nomes de cinco pessoas que ainda não conhecem Cristo e ore por elas todos os dias; no final do encontro, formem duplas de oração para a semana.'),
  'Tg 5:16',
  ('Señor, haznos intercesores. Ponemos delante de Ti a nuestras familias, a nuestros vecinos y a las autoridades de nuestra nación. Salva a los que todavía no Te conocen. Gracias porque Jesús intercede por nosotros. En Su nombre, amén.',
   'Senhor, faze de nós intercessores. Colocamos diante de ti as nossas famílias, os nossos vizinhos e as autoridades da nossa nação. Salva os que ainda não te conhecem. Obrigado porque Jesus intercede por nós. Em seu nome, amém.'))

L('Mt 6:16-18',('El ayuno','O jejum'),
  ('Entender el propósito bíblico del ayuno y cómo practicarlo con un corazón sincero.',
   'Entender o propósito bíblico do jejum e como praticá-lo com um coração sincero.'),
  ('¿Qué es lo que más le costaría dejar por un día: la comida, el celular o la televisión? ¿Por qué?',
   'O que seria mais difícil para você deixar por um dia: a comida, o celular ou a televisão? Por quê?'),
  ('En el Sermón del Monte, Jesús habló del ayuno junto con la oración y la ofrenda. Fíjese que dijo «cuando ayunáis», no «si ayunáis»: daba por sentado que sus discípulos ayunarían. Pero advirtió contra el ayuno para ser visto por los demás. El ayuno bíblico es dejar voluntariamente la comida por un tiempo para buscar a Dios con mayor intensidad. No es una manera de comprar favores de Dios, sino de humillarnos delante de él. En esta lección veremos su propósito, su práctica y su fruto.',
   'No Sermão do Monte, Jesus falou do jejum junto com a oração e a oferta. Observe que ele disse “quando jejuardes”, e não “se jejuardes”: ele dava por certo que os seus discípulos jejuariam. Mas advertiu contra o jejum para ser visto pelos outros. O jejum bíblico é deixar voluntariamente a comida por um tempo para buscar a Deus com mais intensidade. Não é uma forma de comprar favores de Deus, mas de nos humilharmos diante dele. Nesta lição veremos o seu propósito, a sua prática e o seu fruto.'),
  [('Jl 2:12',('Volver a Dios de todo corazón','Voltar para Deus de todo o coração'),
    ('Por medio del profeta Joel, Dios llamó a su pueblo: «convertíos á mí con todo vuestro corazón, con ayuno y lloro y llanto». El ayuno acompaña el arrepentimiento y la búsqueda sincera de Dios. Al dejar el alimento, decimos con nuestro cuerpo que Dios es más importante. Es un tiempo para examinar el corazón y acercarnos más a él.',
     'Por meio do profeta Joel, Deus chamou o seu povo: “Convertei-vos a mim com todo o vosso coração, com jejum, choro e pranto”. O jejum acompanha o arrependimento e a busca sincera de Deus. Ao deixar o alimento, dizemos com o nosso corpo que Deus é mais importante. É um tempo para examinar o coração e nos aproximarmos mais dele.')),
   ('At 13:2-3',('Ayuno y dirección de Dios','Jejum e direção de Deus'),
    ('En la iglesia de Antioquía, mientras los líderes ministraban al Señor y ayunaban, el Espíritu Santo habló y apartó a Bernabé y a Saulo para la obra misionera. Luego ayunaron y oraron otra vez antes de enviarlos. La iglesia ayunaba cuando necesitaba escuchar a Dios y tomar decisiones importantes. Puede ser una buena práctica antes de decisiones grandes.',
     'Na igreja de Antioquia, enquanto os líderes serviam ao Senhor e jejuavam, o Espírito Santo falou e separou Barnabé e Saulo para a obra missionária. Depois eles jejuaram e oraram outra vez antes de enviá-los. A igreja jejuava quando precisava ouvir a Deus e tomar decisões importantes. Essa pode ser uma boa prática antes de decisões grandes.')),
   ('Is 58:6-7',('El ayuno que agrada a Dios','O jejum que agrada a Deus'),
    ('En Isaías, Dios corrige a un pueblo que ayunaba pero seguía oprimiendo a otros. El ayuno que él escogió incluye desatar ligaduras de impiedad, compartir el pan con el hambriento y recibir en casa a los pobres. El ayuno verdadero no nos hace más religiosos por fuera, sino más compasivos por dentro. Se nota en cómo tratamos a los demás.',
     'Em Isaías, Deus corrige um povo que jejuava mas continuava oprimindo os outros. O jejum que ele escolheu inclui soltar os nós da perversidade, repartir o pão com o faminto e recolher em casa os pobres. O jejum verdadeiro não nos torna mais religiosos por fora, mas mais compassivos por dentro. Ele aparece em como tratamos os outros.'))],
  [('¿Por qué Jesús dijo que no debemos ayunar para ser vistos?','Por que Jesus disse que não devemos jejuar para sermos vistos?'),
   ('¿Cuál es la diferencia entre ayunar y simplemente hacer dieta?','Qual é a diferença entre jejuar e simplesmente fazer dieta?'),
   ('¿En qué situaciones de la Biblia el pueblo de Dios ayunaba?','Em que situações da Bíblia o povo de Deus jejuava?'),
   ('Según Isaías 58, ¿cómo se demuestra que nuestro ayuno es verdadero?','Segundo Isaías 58, como se demonstra que o nosso jejum é verdadeiro?')],
  ('Planifique un ayuno sencillo esta semana, por ejemplo saltear una comida, y dedique ese tiempo a orar y leer la Biblia; quien tenga problemas de salud puede consultar a su médico y ayunar de otra forma.',
   'Planeje um jejum simples nesta semana, por exemplo deixar de fazer uma refeição, e dedique esse tempo a orar e ler a Bíblia; quem tem problemas de saúde pode consultar o médico e jejuar de outra forma.'),
  'Jl 2:12',
  ('Señor, queremos buscarte de todo corazón. Enséñanos a ayunar con sinceridad, sin buscar la aprobación de los hombres. Que nuestro ayuno nos acerque a Ti y nos haga más compasivos con los necesitados. En el nombre de Jesús, amén.',
   'Senhor, queremos te buscar de todo o coração. Ensina-nos a jejuar com sinceridade, sem buscar a aprovação dos homens. Que o nosso jejum nos aproxime de ti e nos torne mais compassivos com os necessitados. Em nome de Jesus, amém.'))

L('1Sm 3:8-10',('Escuchar a Dios','Ouvir a Deus'),
  ('Aprender que la oración también es escuchar a Dios, principalmente por medio de su Palabra, y obedecer lo que él dice.',
   'Aprender que a oração também é ouvir a Deus, principalmente por meio da sua Palavra, e obedecer ao que ele diz.'),
  ('En una conversación, ¿le resulta más fácil hablar o escuchar? ¿Por qué?',
   'Em uma conversa, para você é mais fácil falar ou ouvir? Por quê?'),
  ('El joven Samuel servía en el templo con el sacerdote Elí. Una noche, Dios lo llamó por su nombre, pero Samuel pensó que era Elí. Después de la tercera vez, Elí entendió que era el Señor y le enseñó a responder: «Habla, que tu siervo oye». Muchas veces nuestra oración es solo hablar; pero orar también es escuchar. En esta lección veremos que Dios habla, principalmente por su Palabra, que necesitamos aquietarnos para oírlo y que escuchar de verdad lleva a obedecer.',
   'O jovem Samuel servia no templo com o sacerdote Eli. Certa noite, Deus o chamou pelo nome, mas Samuel pensou que era Eli. Depois da terceira vez, Eli entendeu que era o Senhor e lhe ensinou a responder: “Fala, Senhor, que o teu servo ouve”. Muitas vezes a nossa oração é só falar; mas orar também é ouvir. Nesta lição veremos que Deus fala, principalmente pela sua Palavra, que precisamos nos aquietar para ouvi-lo e que ouvir de verdade leva a obedecer.'),
  [('Jo 10:27',('Las ovejas conocen la voz del Pastor','As ovelhas conhecem a voz do Pastor'),
    ('Jesús dijo: «Mis ovejas oyen mi voz». Dios habla a sus hijos. La manera principal en que lo hace es por medio de la Biblia; por eso, cuanto más conocemos la Palabra, mejor reconocemos su voz. Cualquier impresión que sintamos debe estar de acuerdo con lo que la Escritura enseña, porque Dios nunca se contradice.',
     'Jesus disse: “Minhas ovelhas ouvem minha voz”. Deus fala com os seus filhos. A principal forma como ele faz isso é por meio da Bíblia; por isso, quanto mais conhecemos a Palavra, melhor reconhecemos a sua voz. Qualquer impressão que sentirmos deve estar de acordo com o que a Escritura ensina, porque Deus nunca se contradiz.')),
   ('Hc 2:1',('Aquietarse para oír','Aquietar-se para ouvir'),
    ('El profeta Habacuc dijo que se pondría en su puesto de guardia para ver qué le hablaría Dios. Escuchar requiere tiempo y silencio. Vivimos rodeados de ruido: el celular, la televisión y las preocupaciones. Para oír a Dios, necesitamos apartar momentos tranquilos, leer con calma y quedarnos un tiempo en silencio delante de él.',
     'O profeta Habacuque disse que ficaria no seu posto de vigia para ver o que Deus lhe falaria. Ouvir exige tempo e silêncio. Vivemos cercados de barulho: o celular, a televisão e as preocupações. Para ouvir a Deus, precisamos separar momentos tranquilos, ler com calma e ficar um tempo em silêncio diante dele.')),
   ('Tg 1:22',('Escuchar y obedecer','Ouvir e obedecer'),
    ('Santiago advierte: «sed hacedores de la palabra, y no tan solamente oidores». Escuchar a Dios no es solo recibir información; es estar dispuesto a obedecer. Samuel no solo escuchó: transmitió fielmente lo que Dios le dijo, aunque era difícil. Cuando obedecemos lo que ya entendimos, Dios nos sigue hablando.',
     'Tiago adverte: “sede praticantes da palavra, e não somente ouvintes”. Ouvir a Deus não é só receber informação; é estar disposto a obedecer. Samuel não apenas ouviu: transmitiu fielmente o que Deus lhe disse, mesmo sendo difícil. Quando obedecemos ao que já entendemos, Deus continua falando conosco.'))],
  [('¿Qué aprendemos de la respuesta de Samuel: «Habla, que tu siervo oye»?','O que aprendemos com a resposta de Samuel: “Fala, que o teu servo está ouvindo”?'),
   ('¿Cuál es la manera principal en que Dios nos habla hoy?','Qual é a principal maneira como Deus nos fala hoje?'),
   ('¿Cómo podemos saber si una impresión viene de Dios o no?','Como podemos saber se uma impressão vem de Deus ou não?'),
   ('¿Qué ruidos le impiden a usted escuchar a Dios?','Que barulhos impedem você de ouvir a Deus?'),
   ('¿Qué hizo usted la última vez que sintió que Dios le hablaba por su Palabra?','O que você fez da última vez que sentiu que Deus lhe falava pela sua Palavra?')],
  ('Cada día de esta semana, lea un pasaje corto de la Biblia, quédese unos minutos en silencio y anote una cosa concreta que Dios le enseñó para obedecer.',
   'Todos os dias desta semana, leia uma passagem curta da Bíblia, fique alguns minutos em silêncio e anote uma coisa concreta que Deus lhe ensinou para obedecer.'),
  'Sl 46:10',
  ('Señor, habla, que Tus siervos oyen. Aquieta nuestro corazón en medio del ruido y abre nuestros oídos a Tu Palabra. Danos disposición para obedecer todo lo que nos muestres. En el nombre de Jesús, amén.',
   'Senhor, fala, que os teus servos ouvem. Aquieta o nosso coração no meio do barulho e abre os nossos ouvidos à tua Palavra. Dá-nos disposição para obedecer a tudo o que nos mostrares. Em nome de Jesus, amém.'))

# ================================================================ Família segundo Deus
S('familia','Familia según Dios','Família segundo Deus',
  'Seis lecciones sobre la familia a la luz de la Biblia: matrimonio, hijos, honra a los padres, perdón, finanzas y servicio.',
  'Seis lições sobre a família à luz da Bíblia: casamento, filhos, honra aos pais, perdão, finanças e serviço.')

L('Gn 2:22-24',('El matrimonio según Dios','O casamento segundo Deus'),
  ('Comprender que el matrimonio es una idea de Dios, un pacto de unidad entre un hombre y una mujer que debe ser cuidado.',
   'Compreender que o casamento é uma ideia de Deus, uma aliança de unidade entre um homem e uma mulher que precisa ser cuidada.'),
  ('¿Qué consejo sobre el matrimonio recibió alguna vez y le pareció muy sabio?',
   'Qual conselho sobre casamento você já recebeu e achou muito sábio?'),
  ('El matrimonio no fue inventado por la sociedad ni por la iglesia; nació en el corazón de Dios. En el huerto del Edén, Dios formó a la mujer y la trajo al hombre. Adán la recibió con alegría, y la Biblia declara que el hombre dejará a su padre y a su madre, se unirá a su mujer y serán una sola carne. En esta lección veremos que el matrimonio es un pacto que Dios une, que se sostiene con amor y respeto, y que es más fuerte cuando los dos caminan juntos.',
   'O casamento não foi inventado pela sociedade nem pela igreja; ele nasceu no coração de Deus. No jardim do Éden, Deus formou a mulher e a trouxe ao homem. Adão a recebeu com alegria, e a Bíblia declara que o homem deixará o seu pai e a sua mãe, se unirá à sua mulher e serão uma só carne. Nesta lição veremos que o casamento é uma aliança que Deus une, que se sustenta com amor e respeito, e que é mais forte quando os dois caminham juntos.'),
  [('Mt 19:6',('Un pacto que Dios une','Uma aliança que Deus une'),
    ('Jesús citó el Génesis y añadió: «lo que Dios juntó, no lo aparte el hombre». El matrimonio no es un contrato que se rompe cuando deja de convenir, sino un pacto delante de Dios. Por eso merece ser protegido de todo lo que puede dividir: la infidelidad, el orgullo, el descuido y la interferencia de otras personas.',
     'Jesus citou Gênesis e acrescentou: “O que Deus juntou, o ser humano não separe”. O casamento não é um contrato que se rompe quando deixa de ser conveniente, mas uma aliança diante de Deus. Por isso ele merece ser protegido de tudo o que pode dividir: a infidelidade, o orgulho, o descuido e a interferência de outras pessoas.')),
   ('Ef 5:33',('Amor y respeto','Amor e respeito'),
    ('Pablo resume la vida matrimonial en dos actitudes: el marido ame a su mujer como a sí mismo, y la mujer respete a su marido. El amor del que habla es el de Cristo, que se entrega y cuida. El respeto valora y honra. Cuando cada uno se concentra en cumplir su parte, en vez de exigir la del otro, el hogar se fortalece.',
     'Paulo resume a vida conjugal em duas atitudes: o marido ame a sua esposa como a si mesmo, e a mulher respeite o marido. O amor de que ele fala é o de Cristo, que se entrega e cuida. O respeito valoriza e honra. Quando cada um se concentra em cumprir a sua parte, em vez de exigir a do outro, o lar se fortalece.')),
   ('Ec 4:9-10',('Mejor son dos que uno','Melhor é serem dois do que um'),
    ('Eclesiastés enseña que dos son mejor que uno, porque si uno cae, el otro lo levanta. El matrimonio es un equipo. Los esposos no compiten; se ayudan. Y cuando Dios está en el centro, la unión se hace más firme, como el cordón de tres dobleces que no se rompe pronto. Orar juntos es una de las mejores maneras de mantener esa unidad.',
     'Eclesiastes ensina que dois são melhores do que um, porque se um cair, o outro o levanta. O casamento é uma equipe. Os cônjuges não competem; eles se ajudam. E quando Deus está no centro, a união fica mais firme, como o cordão de três dobras que não se quebra tão depressa. Orar juntos é uma das melhores maneiras de manter essa unidade.'))],
  [('Según Génesis 2:24, ¿qué significa dejar padre y madre y unirse al cónyuge?','Segundo Gênesis 2:24, o que significa deixar pai e mãe e unir-se ao cônjuge?'),
   ('¿Qué cosas pueden «separar» lo que Dios unió en un matrimonio hoy?','Que coisas podem “separar” o que Deus uniu em um casamento hoje?'),
   ('¿Por qué cree usted que Pablo pidió amor al marido y respeto a la mujer?','Por que você acha que Paulo pediu amor ao marido e respeito à mulher?'),
   ('¿Cómo puede una pareja poner a Dios en el centro de su relación en la práctica?','Como um casal pode colocar Deus no centro do seu relacionamento na prática?'),
   ('¿Cómo puede la célula apoyar a los matrimonios que están pasando por dificultades?','Como a célula pode apoiar os casais que estão passando por dificuldades?')],
  ('Si es casado, separe un momento esta semana para orar junto con su cónyuge y expresarle una palabra de gratitud; si no lo es, ore por un matrimonio de la iglesia.',
   'Se você é casado, separe um momento nesta semana para orar junto com o seu cônjuge e expressar uma palavra de gratidão; se não é, ore por um casal da igreja.'),
  'Mt 19:6',
  ('Señor, gracias por el regalo del matrimonio. Bendice a los matrimonios de nuestra célula y de nuestra iglesia. Llena los hogares de amor, respeto y unidad, y protege lo que Tú uniste. En el nombre de Jesús, amén.',
   'Senhor, obrigado pelo presente do casamento. Abençoa os casais da nossa célula e da nossa igreja. Enche os lares de amor, respeito e unidade, e protege o que tu uniste. Em nome de Jesus, amém.'))

L('Dt 6:5-7',('Criar a los hijos en el Señor','Criar os filhos no Senhor'),
  ('Reconocer que los hijos son un regalo de Dios y que los padres son los primeros responsables de enseñarles la fe.',
   'Reconhecer que os filhos são um presente de Deus e que os pais são os primeiros responsáveis por lhes ensinar a fé.'),
  ('¿Qué enseñanza de sus padres o abuelos recuerda hasta hoy?',
   'Que ensinamento dos seus pais ou avós você lembra até hoje?'),
  ('Antes de que Israel entrara en la tierra prometida, Moisés les dio una orden muy práctica: amar a Dios con todo el corazón y enseñar sus palabras a los hijos. No solo en reuniones especiales, sino en casa, en el camino, al acostarse y al levantarse. La fe se transmite en la vida diaria. La iglesia y la escuela dominical ayudan, pero el primer lugar donde los niños aprenden de Dios es el hogar. En esta lección veremos el valor de los hijos, la tarea de enseñarles y la manera correcta de corregirlos.',
   'Antes de Israel entrar na terra prometida, Moisés deu uma ordem muito prática: amar a Deus de todo o coração e ensinar as suas palavras aos filhos. Não só em reuniões especiais, mas em casa, pelo caminho, ao deitar e ao levantar. A fé se transmite na vida diária. A igreja e a escola dominical ajudam, mas o primeiro lugar onde as crianças aprendem sobre Deus é o lar. Nesta lição veremos o valor dos filhos, a tarefa de ensiná-los e a maneira correta de corrigi-los.'),
  [('Sl 127:3',('Los hijos son herencia de Dios','Os filhos são herança de Deus'),
    ('El salmista dice que los hijos son herencia de Jehová. No son una carga ni una propiedad de los padres; son un regalo que Dios confía a la familia. Esto cambia la manera de verlos: los padres son administradores de una vida que pertenece a Dios. Cada hijo merece amor, tiempo y atención.',
     'O salmista diz que os filhos são um presente do Senhor. Eles não são um fardo nem uma propriedade dos pais; são um presente que Deus confia à família. Isso muda a maneira de vê-los: os pais são administradores de uma vida que pertence a Deus. Cada filho merece amor, tempo e atenção.')),
   ('Pv 22:6',('Instruir en el camino','Instruir no caminho'),
    ('Proverbios aconseja instruir al niño en su camino, con la promesa de que aun cuando sea viejo no se apartará de él. Instruir es más que dar órdenes: es enseñar con paciencia, explicar y dar el ejemplo. Los niños aprenden más de lo que ven que de lo que escuchan. Leer la Biblia y orar juntos en casa deja marcas para toda la vida.',
     'Provérbios aconselha instruir a criança no seu caminho, com a promessa de que, mesmo quando envelhecer, não se desviará dele. Instruir é mais do que dar ordens: é ensinar com paciência, explicar e dar o exemplo. As crianças aprendem mais com o que veem do que com o que ouvem. Ler a Bíblia e orar juntos em casa deixa marcas para toda a vida.')),
   ('Ef 6:4',('Corregir sin provocar a ira','Corrigir sem provocar à ira'),
    ('Pablo dice a los padres que no provoquen a ira a sus hijos, sino que los críen en disciplina y amonestación del Señor. La disciplina es necesaria, pero debe hacerse con amor, sin humillar, sin gritos constantes y sin violencia. El objetivo no es descargar el enojo, sino formar el carácter. Un hijo corregido con amor aprende a respetar.',
     'Paulo diz aos pais que não provoquem à ira os seus filhos, mas que os criem na disciplina e correção do Senhor. A disciplina é necessária, mas deve ser feita com amor, sem humilhar, sem gritos constantes e sem violência. O objetivo não é descarregar a raiva, mas formar o caráter. Um filho corrigido com amor aprende a respeitar.'))],
  [('Según Deuteronomio 6:7, ¿en qué momentos los padres deben hablar de Dios con sus hijos?','Segundo Deuteronômio 6:7, em que momentos os pais devem falar de Deus com os filhos?'),
   ('¿Por qué el ejemplo de los padres es tan importante en la formación de los hijos?','Por que o exemplo dos pais é tão importante na formação dos filhos?'),
   ('¿Qué cosas pueden provocar a ira a un hijo?','Que coisas podem provocar um filho à ira?'),
   ('¿Qué ideas prácticas tiene para enseñar la Biblia a los niños en casa?','Que ideias práticas você tem para ensinar a Bíblia às crianças em casa?')],
  ('Esta semana, reúna a su familia al menos una vez para leer un pasaje corto de la Biblia y orar juntos; si no tiene hijos, ore por los niños de su célula.',
   'Nesta semana, reúna a sua família pelo menos uma vez para ler uma passagem curta da Bíblia e orar juntos; se você não tem filhos, ore pelas crianças da sua célula.'),
  'Pv 22:6',
  ('Padre, gracias por los niños que nos confiaste. Danos sabiduría y paciencia para enseñarles Tu Palabra con amor. Que nuestro ejemplo los acerque a Ti, y guárdalos todos los días de su vida. En el nombre de Jesús, amén.',
   'Pai, obrigado pelas crianças que nos confiaste. Dá-nos sabedoria e paciência para ensinar-lhes a tua Palavra com amor. Que o nosso exemplo as aproxime de ti, e guarda-as todos os dias da sua vida. Em nome de Jesus, amém.'))

L('Ef 6:1-3',('Honrar a los padres','Honrar os pais'),
  ('Entender que honrar a los padres es un mandamiento con promesa que se vive en todas las etapas de la vida.',
   'Entender que honrar os pais é um mandamento com promessa que se vive em todas as fases da vida.'),
  ('¿Qué es lo que más admira de su padre, de su madre o de quien lo crió?',
   'O que você mais admira no seu pai, na sua mãe ou em quem criou você?'),
  ('Pablo recuerda a los hijos el mandamiento de honrar al padre y a la madre, y destaca que es el primer mandamiento con promesa: que les vaya bien y tengan larga vida sobre la tierra. Honrar es más que obedecer cuando somos niños; es valorar, respetar y cuidar a nuestros padres durante toda la vida. Esto vale aunque nuestros padres no hayan sido perfectos. En esta lección veremos cómo Jesús honró a sus padres y cómo podemos hacerlo nosotros en cada etapa.',
   'Paulo lembra aos filhos o mandamento de honrar pai e mãe, e destaca que é o primeiro mandamento com promessa: que lhes vá bem e vivam muito tempo sobre a terra. Honrar é mais do que obedecer quando somos crianças; é valorizar, respeitar e cuidar dos nossos pais durante toda a vida. Isso vale mesmo que os nossos pais não tenham sido perfeitos. Nesta lição veremos como Jesus honrou os seus pais e como podemos fazer o mesmo em cada fase.'),
  [('Lc 2:51',('Jesús obedeció a sus padres','Jesus obedeceu aos seus pais'),
    ('Después de quedarse en el templo a los doce años, Jesús volvió a Nazaret con José y María y estaba sujeto a ellos. El Hijo de Dios, que sabía más que ellos, aprendió a obedecer en su hogar. Si Jesús honró a sus padres, nosotros también podemos hacerlo, con una actitud humilde y respetuosa.',
     'Depois de ficar no templo aos doze anos, Jesus voltou para Nazaré com José e Maria e lhes era obediente. O Filho de Deus, que sabia mais do que eles, aprendeu a obedecer no seu lar. Se Jesus honrou os seus pais, nós também podemos fazê-lo, com uma atitude humilde e respeitosa.')),
   ('Jo 19:26-27',('Jesús cuidó de su madre','Jesus cuidou da sua mãe'),
    ('Aun en la cruz, en medio del dolor, Jesús se preocupó por su madre. La confió al discípulo amado, y desde aquella hora él la recibió consigo. Honrar a los padres incluye cuidarlos cuando se vuelven mayores o necesitan ayuda. Ningún compromiso, ni siquiera el ministerio, nos libra de esa responsabilidad.',
     'Mesmo na cruz, em meio à dor, Jesus se preocupou com a sua mãe. Ele a confiou ao discípulo amado, e desde aquela hora o discípulo a recebeu em sua casa. Honrar os pais inclui cuidar deles quando envelhecem ou precisam de ajuda. Nenhum compromisso, nem mesmo o ministério, nos livra dessa responsabilidade.')),
   ('1Tm 5:4',('Recompensar a los padres','Retribuir aos pais'),
    ('Pablo enseña que los hijos y nietos deben aprender a recompensar a sus padres, porque esto es agradable delante de Dios. Recompensar es devolver algo del cuidado que recibimos: visitarlos, escucharlos, ayudarlos en sus necesidades y orar por ellos. La fe se demuestra primero en casa.',
     'Paulo ensina que os filhos e netos devem aprender a retribuir aos seus pais, porque isso é agradável diante de Deus. Retribuir é devolver algo do cuidado que recebemos: visitá-los, ouvi-los, ajudá-los nas suas necessidades e orar por eles. A fé se demonstra primeiro em casa.'))],
  [('¿Qué significa «honrar» a los padres para un niño, para un joven y para un adulto?','O que significa “honrar” os pais para uma criança, para um jovem e para um adulto?'),
   ('¿Qué promesa acompaña este mandamiento según Efesios 6:3?','Que promessa acompanha este mandamento segundo Efésios 6:3?'),
   ('¿Cómo se puede honrar a padres que cometieron errores graves?','Como é possível honrar pais que cometeram erros graves?'),
   ('¿Qué nos enseña la actitud de Jesús en la cruz hacia su madre?','O que a atitude de Jesus na cruz em relação à sua mãe nos ensina?'),
   ('¿Qué puede hacer la iglesia por los ancianos que están solos?','O que a igreja pode fazer pelos idosos que estão sozinhos?')],
  ('Esta semana, haga algo concreto para honrar a sus padres o a una persona mayor de la iglesia: una visita, una llamada, una ayuda o una palabra de gratitud.',
   'Nesta semana, faça algo concreto para honrar os seus pais ou uma pessoa idosa da igreja: uma visita, uma ligação, uma ajuda ou uma palavra de gratidão.'),
  'Ex 20:12',
  ('Señor, gracias por nuestros padres y por quienes nos criaron. Ayúdanos a honrarlos con palabras y con hechos. Sana las heridas que haya en nuestras familias y danos un corazón agradecido. En el nombre de Jesús, amén.',
   'Senhor, obrigado pelos nossos pais e por aqueles que nos criaram. Ajuda-nos a honrá-los com palavras e com atitudes. Cura as feridas que houver em nossas famílias e dá-nos um coração agradecido. Em nome de Jesus, amém.'))

L('Cl 3:12-14',('El perdón en el hogar','O perdão no lar'),
  ('Aprender a practicar el perdón en la familia, siguiendo el ejemplo de cómo Cristo nos perdonó.',
   'Aprender a praticar o perdão na família, seguindo o exemplo de como Cristo nos perdoou.'),
  ('¿Por qué cree que a veces es más difícil perdonar a alguien de la familia que a un desconocido?',
   'Por que você acha que às vezes é mais difícil perdoar alguém da família do que um desconhecido?'),
  ('La convivencia en familia trae alegrías, pero también roces. Vivir bajo el mismo techo significa ver de cerca las fallas de los demás. Por eso Pablo nos llama a vestirnos de misericordia, benignidad, humildad, mansedumbre y tolerancia, soportándonos y perdonándonos unos a otros. La medida es alta: de la manera que Cristo nos perdonó. Y sobre todo, el amor, que une todo. En esta lección veremos cómo resolver los enojos a tiempo, cuántas veces perdonar y cómo Dios puede usar aun las heridas familiares para bien.',
   'A convivência em família traz alegrias, mas também atritos. Viver debaixo do mesmo teto significa ver de perto as falhas dos outros. Por isso Paulo nos chama a nos revestirmos de misericórdia, bondade, humildade, mansidão e paciência, suportando-nos e perdoando-nos uns aos outros. A medida é alta: assim como o Senhor nos perdoou. E acima de tudo, o amor, que une tudo. Nesta lição veremos como resolver as mágoas a tempo, quantas vezes perdoar e como Deus pode usar até as feridas familiares para o bem.'),
  [('Ef 4:26-27',('No dejar que el sol se ponga','Não deixar o sol se pôr'),
    ('Pablo reconoce que podemos enojarnos, pero nos pide no pecar y no dejar que el sol se ponga sobre nuestro enojo. El enojo guardado se convierte en amargura y abre lugar al diablo. En el hogar, esto significa no acumular resentimientos: hablar a tiempo, pedir perdón pronto y no irse a dormir peleados.',
     'Paulo reconhece que podemos ficar irados, mas nos pede que não pequemos e que o sol não se ponha sobre a nossa ira. A raiva guardada se transforma em amargura e dá lugar ao diabo. No lar, isso significa não acumular ressentimentos: conversar a tempo, pedir perdão logo e não ir dormir brigados.')),
   ('Mt 18:21-22',('Perdonar sin llevar la cuenta','Perdoar sem fazer contas'),
    ('Pedro preguntó si bastaba perdonar siete veces, y Jesús respondió: hasta setenta veces siete. No quiso dar un número para contar, sino enseñar que el perdón no tiene límite. En la familia, las mismas fallas se repiten. Perdonar no significa aprobar el mal ni callar ante el abuso; quien sufre violencia debe buscar protección y la ayuda del pastor. Pero el perdón libra el corazón.',
     'Pedro perguntou se bastava perdoar sete vezes, e Jesus respondeu: até setenta vezes sete. Ele não quis dar um número para contar, mas ensinar que o perdão não tem limite. Na família, as mesmas falhas se repetem. Perdoar não significa aprovar o mal nem se calar diante do abuso; quem sofre violência deve buscar proteção e a ajuda do pastor. Mas o perdão liberta o coração.')),
   ('Gn 50:19-21',('El perdón que restaura','O perdão que restaura'),
    ('José fue vendido por sus propios hermanos. Años después, cuando tuvo poder para vengarse, les dijo: «Vosotros pensasteis mal sobre mí, mas Dios lo encaminó á bien». Y prometió sustentarlos a ellos y a sus hijos. José no negó el daño, pero vio la mano de Dios y eligió bendecir. El perdón abrió camino para restaurar a toda la familia.',
     'José foi vendido pelos próprios irmãos. Anos depois, quando tinha poder para se vingar, ele lhes disse: “Vós pensastes mal sobre mim, mas Deus o encaminhou para o bem”. E prometeu sustentar a eles e aos seus filhos. José não negou o mal sofrido, mas viu a mão de Deus e escolheu abençoar. O perdão abriu caminho para restaurar toda a família.'))],
  [('Según Colosenses 3:13, ¿cuál es la medida de nuestro perdón?','Segundo Colossenses 3:13, qual é a medida do nosso perdão?'),
   ('¿Qué sucede en un hogar cuando los enojos se acumulan día tras día?','O que acontece em um lar quando as mágoas se acumulam dia após dia?'),
   ('¿Cuál es la diferencia entre perdonar y aceptar el abuso?','Qual é a diferença entre perdoar e aceitar o abuso?'),
   ('¿Qué le llama la atención en la actitud de José hacia sus hermanos?','O que chama a sua atenção na atitude de José para com os seus irmãos?'),
   ('¿Por qué es importante que los padres también pidan perdón a sus hijos cuando se equivocan?','Por que é importante que os pais também peçam perdão aos filhos quando erram?')],
  ('Si hay alguna ofensa pendiente en su familia, dé el primer paso esta semana: pida perdón o exprese su perdón, con humildad y sin reproches.',
   'Se existe alguma ofensa pendente na sua família, dê o primeiro passo nesta semana: peça perdão ou ofereça o seu perdão, com humildade e sem acusações.'),
  'Ef 4:32',
  ('Padre, gracias por perdonarnos en Cristo. Quita de nuestro corazón toda amargura y enséñanos a perdonar como Tú nos perdonaste. Sana las relaciones heridas en nuestras familias y llena nuestros hogares de paz. En el nombre de Jesús, amén.',
   'Pai, obrigado por nos perdoar em Cristo. Tira do nosso coração toda amargura e ensina-nos a perdoar como tu nos perdoaste. Cura os relacionamentos feridos em nossas famílias e enche os nossos lares de paz. Em nome de Jesus, amém.'))

L('Pv 3:9-10',('Las finanzas en el hogar','As finanças no lar'),
  ('Aprender principios bíblicos para administrar el dinero en familia: honrar a Dios, planificar, evitar deudas y vivir con contentamiento.',
   'Aprender princípios bíblicos para administrar o dinheiro em família: honrar a Deus, planejar, evitar dívidas e viver com contentamento.'),
  ('¿Qué aprendió de niño sobre el dinero en su casa?',
   'O que você aprendeu sobre dinheiro na sua casa quando era criança?'),
  ('El dinero es una de las causas más frecuentes de discusiones en el hogar. La Biblia habla mucho de este tema porque nuestra manera de usar el dinero revela dónde está nuestro corazón. Proverbios nos manda honrar a Dios con nuestros bienes y con las primicias de todos nuestros frutos. Cuando Dios ocupa el primer lugar, lo demás se ordena. En esta lección veremos cuatro principios sencillos: dar a Dios primero, planificar con diligencia, cuidarse de las deudas y aprender a vivir contentos.',
   'O dinheiro é uma das causas mais frequentes de discussões no lar. A Bíblia fala muito desse assunto porque a nossa maneira de usar o dinheiro revela onde está o nosso coração. Provérbios nos manda honrar ao Senhor com os nossos bens e com a primeira parte de toda a nossa renda. Quando Deus ocupa o primeiro lugar, o resto se organiza. Nesta lição veremos quatro princípios simples: dar a Deus primeiro, planejar com empenho, cuidar-se das dívidas e aprender a viver contente.'),
  [('Pv 21:5',('Planificar con diligencia','Planejar com empenho'),
    ('Proverbios dice que los pensamientos del diligente van a la abundancia, pero el apresurado va a la pobreza. Planificar es parte de la buena administración. Saber cuánto entra y cuánto sale, hablar en pareja sobre los gastos y evitar compras impulsivas son decisiones sabias. Dios bendice el trabajo y la organización.',
     'Provérbios diz que os planos de quem trabalha com empenho levam à abundância, mas os do apressado levam à pobreza. Planejar faz parte da boa administração. Saber quanto entra e quanto sai, conversar como casal sobre os gastos e evitar compras por impulso são decisões sábias. Deus abençoa o trabalho e a organização.')),
   ('Pv 22:7',('Cuidado con las deudas','Cuidado com as dívidas'),
    ('La Biblia advierte que el que toma prestado es siervo del que presta. Las deudas sin control quitan la paz, causan peleas y limitan la generosidad. No toda deuda es pecado, pero debemos ser prudentes, no comprar lo que no podemos pagar y esforzarnos por cumplir nuestros compromisos. Salir de las deudas puede ser un acto de fe y obediencia.',
     'A Bíblia adverte que quem toma emprestado é servo daquele que empresta. As dívidas sem controle tiram a paz, causam brigas e limitam a generosidade. Nem toda dívida é pecado, mas devemos ser prudentes, não comprar o que não podemos pagar e nos esforçar para cumprir os nossos compromissos. Sair das dívidas pode ser um ato de fé e obediência.')),
   ('1Tm 6:6-8',('Aprender a vivir contentos','Aprender a viver contente'),
    ('Pablo enseña que gran ganancia es la piedad acompañada de contentamiento. Nada trajimos al mundo y nada podremos sacar. Teniendo sustento y con qué cubrirnos, estemos contentos. Muchas deudas nacen de querer tener lo que otros tienen. El contentamiento no es conformismo; es gratitud y confianza en que Dios cuida de nosotros.',
     'Paulo ensina que grande lucro é a devoção acompanhada de contentamento. Nada trouxemos ao mundo e nada podemos levar dele. Tendo alimento e com que nos cobrir, estejamos contentes. Muitas dívidas nascem de querer ter o que os outros têm. O contentamento não é acomodação; é gratidão e confiança de que Deus cuida de nós.'))],
  [('¿Qué significa honrar a Dios con las primicias, según Proverbios 3:9?','O que significa honrar a Deus com a primeira parte da renda, segundo Provérbios 3:9?'),
   ('¿Por qué el dinero causa tantas discusiones en las familias?','Por que o dinheiro causa tantas discussões nas famílias?'),
   ('¿Qué prácticas sencillas ayudan a una familia a organizar sus gastos?','Que práticas simples ajudam uma família a organizar os seus gastos?'),
   ('¿Cómo influye la comparación con otros en nuestras decisiones de compra?','Como a comparação com os outros influencia as nossas decisões de compra?')],
  ('Esta semana, anote todos los gastos de su familia y, si es casado, converse con su cónyuge sobre cómo honrar a Dios primero y cómo reducir gastos o deudas.',
   'Nesta semana, anote todos os gastos da sua família e, se você é casado, converse com o seu cônjuge sobre como honrar a Deus primeiro e como reduzir gastos ou dívidas.'),
  'Hb 13:5',
  ('Señor, todo lo que tenemos viene de Ti. Enséñanos a honrarte con nuestros bienes, a administrar con sabiduría y a vivir contentos. Libra a nuestras familias de las deudas y de la avaricia. En el nombre de Jesús, amén.',
   'Senhor, tudo o que temos vem de ti. Ensina-nos a te honrar com os nossos bens, a administrar com sabedoria e a viver contentes. Livra as nossas famílias das dívidas e da ganância. Em nome de Jesus, amém.'))

L('Js 24:15',('Una familia que sirve a Dios','Uma família que serve a Deus'),
  ('Animar a cada familia a servir juntos al Señor en la iglesia y en la comunidad.',
   'Animar cada família a servir juntos ao Senhor na igreja e na comunidade.'),
  ('¿Qué actividad le gusta hacer junto con su familia?',
   'Que atividade você gosta de fazer junto com a sua família?'),
  ('Al final de su vida, Josué reunió al pueblo de Israel y le pidió que decidiera a quién iba a servir. Luego hizo una declaración que muchas familias tienen escrita en la pared: «yo y mi casa serviremos á Jehová». Servir a Dios no es solo una decisión personal; también puede ser un proyecto de familia. En esta lección veremos ejemplos del Nuevo Testamento de familias que creyeron juntas, abrieron su casa y se dedicaron al servicio de los santos.',
   'No final da sua vida, Josué reuniu o povo de Israel e lhe pediu que decidisse a quem iria servir. Depois fez uma declaração que muitas famílias têm escrita na parede: “Eu e minha casa serviremos ao Senhor”. Servir a Deus não é apenas uma decisão pessoal; também pode ser um projeto de família. Nesta lição veremos exemplos do Novo Testamento de famílias que creram juntas, abriram a sua casa e se dedicaram ao serviço dos santos.'),
  [('At 16:32-34',('Una casa que cree junta','Uma casa que crê junta'),
    ('El carcelero de Filipos escuchó la palabra del Señor junto con todos los de su casa. Esa misma noche se bautizaron, y él se gozó de que con toda su casa había creído a Dios. La salvación es personal, pero Dios desea alcanzar a toda la familia. Además, el carcelero enseguida puso la mesa para servir a Pablo y Silas.',
     'O carcereiro de Filipos ouviu a palavra do Senhor junto com todos os de sua casa. Naquela mesma noite foram batizados, e ele se alegrou muito por ter crido em Deus com toda a sua casa. A salvação é pessoal, mas Deus deseja alcançar toda a família. Além disso, o carcereiro logo pôs a mesa para servir Paulo e Silas.')),
   ('Rm 16:3-5',('Una casa abierta','Uma casa aberta'),
    ('Priscila y Aquila eran un matrimonio que servía a Dios unido. Pablo los llama sus colaboradores en Cristo Jesús y saluda a la iglesia que se reunía en su casa. Ellos abrieron su hogar para la obra de Dios. Hoy, una familia que recibe una célula en su casa sigue este mismo ejemplo de hospitalidad y servicio.',
     'Priscila e Áquila eram um casal que servia a Deus unido. Paulo os chama de seus cooperadores em Cristo Jesus e saúda a igreja que se reunia na casa deles. Eles abriram o seu lar para a obra de Deus. Hoje, uma família que recebe uma célula em sua casa segue esse mesmo exemplo de hospitalidade e serviço.')),
   ('1Co 16:15',('Una casa dedicada al servicio','Uma casa dedicada ao serviço'),
    ('Pablo menciona la casa de Estéfanas, los primeros convertidos de Acaya, que se habían dedicado al ministerio de los santos. Toda la familia encontró su lugar sirviendo a los hermanos. Servir juntos une a la familia, enseña a los hijos con el ejemplo y bendice a la iglesia. Cada miembro, grande o pequeño, puede aportar algo.',
     'Paulo menciona a casa de Estéfanas, os primeiros convertidos da Acaia, que tinham se dedicado ao trabalho dos santos. Toda a família encontrou o seu lugar servindo aos irmãos. Servir juntos une a família, ensina os filhos pelo exemplo e abençoa a igreja. Cada membro, grande ou pequeno, pode contribuir com alguma coisa.'))],
  [('¿Qué decisión tomó Josué para él y su casa? ¿Por qué es importante decidirlo?','Que decisão Josué tomou para si e para a sua casa? Por que é importante decidir isso?'),
   ('¿Qué podemos aprender de la reacción del carcelero después de creer?','O que podemos aprender com a reação do carcereiro depois de crer?'),
   ('¿Qué bendiciones trae a una familia abrir su casa para una célula?','Que bênçãos uma família recebe ao abrir a sua casa para uma célula?'),
   ('¿De qué maneras puede una familia servir junta en la iglesia o en el barrio?','De que maneiras uma família pode servir junta na igreja ou no bairro?'),
   ('¿Cómo podemos animar a los niños y jóvenes a servir a Dios desde temprano?','Como podemos animar as crianças e os jovens a servir a Deus desde cedo?')],
  ('Reúnase con su familia y elijan juntos una forma concreta de servir este mes: recibir la célula, visitar a un enfermo, ayudar en la limpieza del templo u otra.',
   'Reúna-se com a sua família e escolham juntos uma forma concreta de servir neste mês: receber a célula, visitar um enfermo, ajudar na limpeza do templo ou outra.'),
  'Js 24:15',
  ('Señor, como Josué, declaramos que nosotros y nuestras casas Te serviremos. Salva a los que faltan en nuestras familias y muéstranos cómo servirte juntos. Que nuestros hogares sean lugares abiertos para Tu obra. En el nombre de Jesús, amén.',
   'Senhor, como Josué, declaramos que nós e as nossas casas te serviremos. Salva os que faltam em nossas famílias e mostra-nos como te servir juntos. Que nossos lares sejam lugares abertos para a tua obra. Em nome de Jesus, amém.'))

# ================================================================ O Espírito Santo
S('espirito','El Espíritu Santo','O Espírito Santo',
  'Seis lecciones sobre la persona y la obra del Espíritu Santo: quién es, el bautismo en el Espíritu, el fruto, los dones, la dirección y el poder para testificar.',
  'Seis lições sobre a pessoa e a obra do Espírito Santo: quem ele é, o batismo no Espírito, o fruto, os dons, a direção e o poder para testemunhar.')

L('Jo 14:16-17',('¿Quién es el Espíritu Santo?','Quem é o Espírito Santo?'),
  ('Conocer al Espíritu Santo como una persona divina que vive en el creyente, y no como una simple fuerza.',
   'Conhecer o Espírito Santo como uma pessoa divina que habita no crente, e não como uma simples força.'),
  ('Cuando usted era niño, ¿quién lo acompañaba o lo ayudaba cuando tenía miedo?',
   'Quando você era criança, quem acompanhava ou ajudava você quando tinha medo?'),
  ('Antes de ir a la cruz, Jesús preparó a sus discípulos para su partida. Les prometió que rogaría al Padre y que él les daría otro Consolador, el Espíritu de verdad, para que estuviera con ellos para siempre. «Otro» quiere decir alguien como Jesús mismo. El Espíritu Santo no es una energía ni un sentimiento; es una persona, la tercera persona de la Trinidad. En esta lección veremos que él es Dios, que tiene sentimientos y que nos guía a toda la verdad.',
   'Antes de ir para a cruz, Jesus preparou os seus discípulos para a sua partida. Prometeu que rogaria ao Pai e que ele lhes daria outro Consolador, o Espírito de verdade, para ficar com eles para sempre. “Outro” quer dizer alguém como o próprio Jesus. O Espírito Santo não é uma energia nem um sentimento; é uma pessoa, a terceira pessoa da Trindade. Nesta lição veremos que ele é Deus, que tem sentimentos e que nos guia em toda a verdade.'),
  [('At 5:3-4',('El Espíritu Santo es Dios','O Espírito Santo é Deus'),
    ('Cuando Ananías mintió sobre el precio de su propiedad, Pedro le dijo que había mentido al Espíritu Santo, y luego añadió: «No has mentido á los hombres, sino á Dios». Mentir al Espíritu es mentir a Dios. Así la Biblia muestra que el Espíritu Santo es Dios, igual al Padre y al Hijo, digno de nuestra adoración y obediencia.',
     'Quando Ananias mentiu sobre o valor da sua propriedade, Pedro lhe disse que ele havia mentido ao Espírito Santo, e depois acrescentou: “Não mentiste aos seres humanos, mas sim a Deus”. Mentir ao Espírito é mentir a Deus. Assim a Bíblia mostra que o Espírito Santo é Deus, igual ao Pai e ao Filho, digno da nossa adoração e obediência.')),
   ('Ef 4:30',('Una persona que puede ser contristada','Uma pessoa que pode ser entristecida'),
    ('Pablo nos pide que no contristemos al Espíritu Santo de Dios. Solo una persona puede entristecerse; una fuerza no siente. El Espíritu se entristece con el pecado, las palabras que hieren y la amargura, como muestran los versículos que rodean este texto. Saber que él vive en nosotros nos lleva a cuidar nuestras actitudes.',
     'Paulo nos pede que não entristeçamos o Espírito Santo de Deus. Só uma pessoa pode se entristecer; uma força não sente. O Espírito se entristece com o pecado, as palavras que ferem e a amargura, como mostram os versículos ao redor desse texto. Saber que ele habita em nós nos leva a cuidar das nossas atitudes.')),
   ('Jo 16:13',('El que nos guía a la verdad','Aquele que nos guia em toda a verdade'),
    ('Jesús llamó al Espíritu Santo «Espíritu de verdad» y prometió que él nos guiaría a toda verdad. El Espíritu no habla por su propia cuenta, sino que glorifica a Jesús y nos ayuda a entender la Palabra. Por eso, cuando abrimos la Biblia, podemos pedir su ayuda. Nada que venga del Espíritu contradice lo que él mismo inspiró en las Escrituras.',
     'Jesus chamou o Espírito Santo de “Espírito de verdade” e prometeu que ele nos guiaria em toda a verdade. O Espírito não fala por si mesmo, mas glorifica Jesus e nos ajuda a entender a Palavra. Por isso, quando abrimos a Bíblia, podemos pedir a sua ajuda. Nada que venha do Espírito contradiz o que ele mesmo inspirou nas Escrituras.'))],
  [('¿Qué significa que Jesús llamó al Espíritu Santo «otro Consolador»?','O que significa que Jesus chamou o Espírito Santo de “outro Consolador”?'),
   ('¿Por qué es importante entender que el Espíritu Santo es una persona y no una fuerza?','Por que é importante entender que o Espírito Santo é uma pessoa e não uma força?'),
   ('¿Qué actitudes pueden contristar al Espíritu Santo en nuestra vida diaria?','Que atitudes podem entristecer o Espírito Santo na nossa vida diária?'),
   ('¿Cómo nos ayuda el Espíritu Santo cuando leemos la Biblia?','Como o Espírito Santo nos ajuda quando lemos a Bíblia?')],
  ('Antes de leer la Biblia cada día de esta semana, pida al Espíritu Santo que le ayude a entender y aplicar lo que lee.',
   'Antes de ler a Bíblia todos os dias desta semana, peça ao Espírito Santo que ajude você a entender e aplicar o que lê.'),
  'Jo 14:16',
  ('Padre, gracias por enviarnos al Espíritu Santo, nuestro Consolador. Queremos conocerlo más y no contristarlo. Espíritu de verdad, guíanos en la Palabra y glorifica a Jesús en nuestra vida. En el nombre de Jesús, amén.',
   'Pai, obrigado por nos enviar o Espírito Santo, o nosso Consolador. Queremos conhecê-lo mais e não entristecê-lo. Espírito de verdade, guia-nos na Palavra e glorifica Jesus em nossa vida. Em nome de Jesus, amém.'))

L('At 2:1-4',('El bautismo en el Espíritu Santo','O batismo no Espírito Santo'),
  ('Comprender la promesa del bautismo en el Espíritu Santo, su propósito y cómo buscarlo con fe.',
   'Compreender a promessa do batismo no Espírito Santo, o seu propósito e como buscá-lo com fé.'),
  ('¿Alguna vez esperó con mucha ilusión que se cumpliera una promesa? ¿Cómo fue la espera?',
   'Alguma vez você esperou com muita expectativa o cumprimento de uma promessa? Como foi a espera?'),
  ('En el día de Pentecostés, los discípulos estaban todos unánimes juntos. De repente vino un estruendo del cielo como de un viento recio, aparecieron lenguas como de fuego y todos fueron llenos del Espíritu Santo y comenzaron a hablar en otras lenguas, como el Espíritu les daba que hablasen. Todo creyente recibe al Espíritu Santo cuando se convierte; pero la Biblia también habla de ser bautizados o llenos del Espíritu para recibir poder. En esta lección veremos la promesa, para quiénes es y cómo recibirla.',
   'No dia de Pentecostes, os discípulos estavam todos reunidos no mesmo lugar. De repente veio do céu um ruído como de um vento forte, apareceram línguas como de fogo e todos foram cheios do Espírito Santo e começaram a falar em outras línguas, conforme o Espírito lhes concedia que falassem. Todo crente recebe o Espírito Santo quando se converte; mas a Bíblia também fala de ser batizado ou cheio do Espírito para receber poder. Nesta lição veremos a promessa, para quem ela é e como recebê-la.'),
  [('At 1:4-5',('Una promesa del Padre','Uma promessa do Pai'),
    ('Antes de subir al cielo, Jesús mandó a los discípulos que no se fueran de Jerusalén, sino que esperaran la promesa del Padre. Les dijo que Juan bautizó con agua, pero que ellos serían bautizados con el Espíritu Santo. El bautismo en el Espíritu no fue una idea humana; es una promesa de Dios. En Hechos, la señal que acompañó a quienes lo recibieron fue hablar en otras lenguas (Hechos 2:4; 19:6).',
     'Antes de subir ao céu, Jesus mandou os discípulos não saírem de Jerusalém, mas esperarem a promessa do Pai. Disse-lhes que João batizou com água, mas que eles seriam batizados com o Espírito Santo. O batismo no Espírito não foi uma ideia humana; é uma promessa de Deus. Em Atos, o sinal que acompanhou os que o receberam foi falar em outras línguas (Atos 2:4; 19:6).')),
   ('At 2:38-39',('Una promesa para todos','Uma promessa para todos'),
    ('En su sermón de Pentecostés, Pedro dijo: «para vosotros es la promesa, y para vuestros hijos, y para todos los que están lejos». El bautismo en el Espíritu no fue solo para los apóstoles ni solo para aquel tiempo. Es para todo creyente, hombre o mujer, joven o anciano. No es un premio para los más santos, sino un regalo para los que Dios llamó.',
     'No seu sermão de Pentecostes, Pedro disse: “A promessa é para vós, e para vossos filhos, e para todos que ainda estão longe”. O batismo no Espírito não foi apenas para os apóstolos nem apenas para aquele tempo. É para todo crente, homem ou mulher, jovem ou idoso. Não é um prêmio para os mais santos, mas um presente para aqueles que Deus chamou.')),
   ('Lc 11:13',('Pedir con confianza','Pedir com confiança'),
    ('Jesús comparó a Dios con un padre bueno: si nosotros, siendo malos, sabemos dar buenas cosas a nuestros hijos, cuánto más el Padre celestial dará el Espíritu Santo a los que se lo pidan. No hay que tener miedo ni ansiedad. Buscamos con fe, en oración, con un corazón sincero, y confiamos en que el Padre cumple lo que promete en su tiempo.',
     'Jesus comparou Deus a um pai bom: se nós, sendo maus, sabemos dar bons presentes aos nossos filhos, quanto mais o Pai celestial dará o Espírito Santo àqueles que lhe pedirem. Não é preciso ter medo nem ansiedade. Buscamos com fé, em oração, com um coração sincero, e confiamos que o Pai cumpre o que promete no seu tempo.'))],
  [('¿Qué sucedió con los discípulos en el día de Pentecostés, según Hechos 2:1-4?','O que aconteceu com os discípulos no dia de Pentecostes, segundo Atos 2:1-4?'),
   ('¿Por qué Jesús pidió a los discípulos que esperaran antes de salir a predicar?','Por que Jesus pediu aos discípulos que esperassem antes de sair para pregar?'),
   ('Según Hechos 2:39, ¿para quiénes es la promesa del Espíritu?','Segundo Atos 2:39, para quem é a promessa do Espírito?'),
   ('¿Qué temores o dudas tienen algunas personas acerca del bautismo en el Espíritu Santo?','Que medos ou dúvidas algumas pessoas têm sobre o batismo no Espírito Santo?'),
   ('Si alguno ya fue bautizado en el Espíritu, ¿qué cambió en su vida?','Se alguém já foi batizado no Espírito, o que mudou na sua vida?')],
  ('Si usted todavía no fue bautizado en el Espíritu Santo, búsquelo en oración cada día con fe y sin ansiedad; si ya lo fue, ore por los que esperan y procure ser lleno cada día.',
   'Se você ainda não foi batizado no Espírito Santo, busque-o em oração todos os dias com fé e sem ansiedade; se já foi, ore pelos que esperam e procure ser cheio a cada dia.'),
  'At 2:4',
  ('Padre, gracias por la promesa del Espíritu Santo para nosotros y para nuestros hijos. Bautiza con Tu Espíritu a los que lo buscan y llénanos de nuevo. Queremos Tu poder para servirte. En el nombre de Jesús, amén.',
   'Pai, obrigado pela promessa do Espírito Santo para nós e para os nossos filhos. Batiza com o teu Espírito os que o buscam e enche-nos de novo. Queremos o teu poder para te servir. Em nome de Jesus, amém.'))

L('Gl 5:22-25',('El fruto del Espíritu','O fruto do Espírito'),
  ('Entender que el carácter de Cristo crece en nosotros como fruto del Espíritu cuando permanecemos en él.',
   'Entender que o caráter de Cristo cresce em nós como fruto do Espírito quando permanecemos nele.'),
  ('¿Tiene alguna planta o árbol frutal en su casa? ¿Qué necesita para dar fruto?',
   'Você tem alguma planta ou árvore frutífera em casa? Do que ela precisa para dar fruto?'),
  ('Pablo hace una lista de nueve virtudes que forman el fruto del Espíritu: amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre y templanza. Es interesante que dice «el fruto», en singular: no elegimos una virtud y dejamos las demás; todas crecen juntas, porque son el carácter de Cristo formándose en nosotros. El fruto no se fabrica con esfuerzo humano; crece cuando vivimos unidos a Jesús y andamos en el Espíritu. En esta lección veremos cómo crece, qué lo amenaza y cuál es su centro.',
   'Paulo faz uma lista de nove virtudes que formam o fruto do Espírito: amor, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão e domínio próprio. É interessante que ele diz “o fruto”, no singular: não escolhemos uma virtude e deixamos as outras; todas crescem juntas, porque são o caráter de Cristo sendo formado em nós. O fruto não se fabrica com esforço humano; ele cresce quando vivemos unidos a Jesus e andamos no Espírito. Nesta lição veremos como ele cresce, o que o ameaça e qual é o seu centro.'),
  [('Jo 15:5',('Permanecer en la vid','Permanecer na videira'),
    ('Jesús dijo: «Yo soy la vid, vosotros los pámpanos». La rama no se esfuerza para producir uvas; simplemente permanece unida a la planta. Así también el fruto del Espíritu crece cuando permanecemos en Cristo por medio de la oración, la Palabra y la obediencia. Separados de él, nada podemos hacer.',
     'Jesus disse: “Eu sou a videira, vós sois os ramos”. O ramo não se esforça para produzir uvas; ele simplesmente permanece ligado à planta. Assim também o fruto do Espírito cresce quando permanecemos em Cristo por meio da oração, da Palavra e da obediência. Separados dele, nada podemos fazer.')),
   ('Gl 5:16',('Andar en el Espíritu','Andar no Espírito'),
    ('Pablo enseña que hay una lucha interior entre los deseos de la carne y el Espíritu. La solución no es solo decir no al pecado, sino andar en el Espíritu: depender de él en cada decisión. Cuanto más alimentamos la vida espiritual, menos espacio tiene la carne. El fruto crece en quien camina cada día con Dios.',
     'Paulo ensina que existe uma luta interior entre os desejos da carne e o Espírito. A solução não é apenas dizer não ao pecado, mas andar no Espírito: depender dele em cada decisão. Quanto mais alimentamos a vida espiritual, menos espaço a carne tem. O fruto cresce em quem caminha todos os dias com Deus.')),
   ('1Co 13:4-7',('El amor en el centro','O amor no centro'),
    ('La primera virtud de la lista es el amor, y 1 Corintios 13 lo describe: es sufrido, es benigno, no tiene envidia, no se irrita, no piensa el mal y todo lo soporta. El amor es la raíz de las demás virtudes. Una persona llena del Espíritu se reconoce más por su manera de amar que por sus palabras o experiencias.',
     'A primeira virtude da lista é o amor, e 1 Coríntios 13 o descreve: é paciente, é bondoso, não é invejoso, não se ira, não é rancoroso e tudo suporta. O amor é a raiz das outras virtudes. Uma pessoa cheia do Espírito se reconhece mais pela sua maneira de amar do que pelas suas palavras ou experiências.'))],
  [('¿Por qué cree que Pablo habla de «fruto» en singular y no de «frutos»?','Por que você acha que Paulo fala de “fruto” no singular e não de “frutos”?'),
   ('¿Qué diferencia hay entre esforzarse para ser bueno y dejar que el Espíritu produzca su fruto?','Qual é a diferença entre se esforçar para ser bom e deixar o Espírito produzir o seu fruto?'),
   ('¿Cuál de las nueve virtudes le resulta más difícil de vivir? ¿Por qué?','Qual das nove virtudes é mais difícil para você viver? Por quê?'),
   ('¿Cómo se nota el fruto del Espíritu en el hogar y en el trabajo?','Como o fruto do Espírito aparece no lar e no trabalho?')],
  ('Elija una de las virtudes del fruto del Espíritu en la que necesita crecer, ore por ella cada día y practíquela de manera concreta con una persona esta semana.',
   'Escolha uma das virtudes do fruto do Espírito na qual você precisa crescer, ore por ela todos os dias e pratique-a de forma concreta com uma pessoa nesta semana.'),
  'Gl 5:22-23',
  ('Espíritu Santo, produce en nosotros Tu fruto: amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre y templanza. Ayúdanos a permanecer en Jesús y a andar Contigo cada día. En el nombre de Jesús, amén.',
   'Espírito Santo, produz em nós o teu fruto: amor, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão e domínio próprio. Ajuda-nos a permanecer em Jesus e a andar contigo a cada dia. Em nome de Jesus, amém.'))

L('1Co 12:4-7',('Los dones del Espíritu','Os dons do Espírito'),
  ('Conocer los dones espirituales, buscarlos con amor y usarlos para la edificación de la iglesia.',
   'Conhecer os dons espirituais, buscá-los com amor e usá-los para a edificação da igreja.'),
  ('Si pudiera aprender una habilidad nueva para ayudar a otras personas, ¿cuál sería?',
   'Se você pudesse aprender uma nova habilidade para ajudar outras pessoas, qual seria?'),
  ('La iglesia de Corinto tenía muchos dones espirituales, pero también muchos problemas: orgullo, divisiones y desorden. Pablo no les dijo que dejaran los dones, sino que aprendieran a usarlos bien. Enseñó que hay diversidad de dones, pero un mismo Espíritu; diversidad de ministerios, pero un mismo Señor. Y que a cada uno le es dada la manifestación del Espíritu para provecho de todos. En esta lección veremos qué dones menciona la Biblia, por qué el amor es indispensable y para qué sirven.',
   'A igreja de Corinto tinha muitos dons espirituais, mas também muitos problemas: orgulho, divisões e desordem. Paulo não lhes disse que deixassem os dons, mas que aprendessem a usá-los bem. Ensinou que há variedade de dons, mas o Espírito é o mesmo; variedade de serviços, mas o Senhor é o mesmo. E que a cada um é dada a manifestação do Espírito para o bem de todos. Nesta lição veremos que dons a Bíblia menciona, por que o amor é indispensável e para que eles servem.'),
  [('1Co 12:8-11',('Diversidad de dones','Variedade de dons'),
    ('Pablo menciona palabra de sabiduría, palabra de ciencia, fe, dones de sanidades, operaciones de milagros, profecía, discernimiento de espíritus, géneros de lenguas e interpretación de lenguas. Todos son obra del mismo Espíritu, que los reparte a cada uno como él quiere. Nadie tiene todos los dones y nadie queda sin función: nos necesitamos unos a otros.',
     'Paulo menciona palavra de sabedoria, palavra de conhecimento, fé, dons de curas, operações de milagres, profecia, discernimento de espíritos, variedade de línguas e interpretação de línguas. Todos são obra do mesmo Espírito, que os reparte a cada um como quer. Ninguém tem todos os dons e ninguém fica sem função: precisamos uns dos outros.')),
   ('1Co 13:1-2',('Dones con amor','Dons com amor'),
    ('Entre los capítulos de los dones, Pablo colocó el capítulo del amor. Si alguien habla lenguas humanas y angélicas, o tiene profecía y toda la fe, pero no tiene amor, nada es. Los dones no prueban que una persona sea más espiritual. Sin amor, el don más impresionante pierde su valor delante de Dios.',
     'Entre os capítulos dos dons, Paulo colocou o capítulo do amor. Se alguém fala as línguas dos homens e dos anjos, ou tem o dom de profecia e toda a fé, mas não tem amor, nada é. Os dons não provam que uma pessoa seja mais espiritual. Sem amor, o dom mais impressionante perde o seu valor diante de Deus.')),
   ('1Co 14:12',('Para edificar a la iglesia','Para edificar a igreja'),
    ('Pablo dice: «pues que anheláis espirituales dones, procurad ser excelentes para la edificación de la iglesia». Los dones no son para exhibirse, sino para fortalecer, consolar y animar a los hermanos. Por eso deben usarse con orden y bajo la orientación del pastor, porque Dios no es Dios de disensión, sino de paz.',
     'Paulo diz: “dado que desejais os dons espirituais, procurai neles abundar, para edificação da igreja”. Os dons não são para exibição, mas para fortalecer, consolar e animar os irmãos. Por isso devem ser usados com ordem e sob a orientação do pastor, porque Deus não é Deus de confusão, mas de paz.'))],
  [('Según 1 Corintios 12:7, ¿con qué propósito se da la manifestación del Espíritu?','Segundo 1 Coríntios 12:7, com que propósito é dada a manifestação do Espírito?'),
   ('¿Por qué Pablo puso el capítulo del amor en medio de la enseñanza sobre los dones?','Por que Paulo colocou o capítulo do amor no meio do ensino sobre os dons?'),
   ('¿Qué peligros existen cuando los dones se usan sin orden o para llamar la atención?','Que perigos existem quando os dons são usados sem ordem ou para chamar a atenção?'),
   ('¿Cómo podemos buscar los dones espirituales de una manera sana?','Como podemos buscar os dons espirituais de uma maneira saudável?'),
   ('¿Cómo puede la célula ser un lugar donde los dones edifiquen a los hermanos?','Como a célula pode ser um lugar onde os dons edificam os irmãos?')],
  ('Pida a Dios esta semana que le muestre cómo puede edificar a otros con lo que el Espíritu le dio, y anime a un hermano de la célula con una palabra o una acción.',
   'Peça a Deus nesta semana que mostre como você pode edificar outros com o que o Espírito lhe deu, e anime um irmão da célula com uma palavra ou uma ação.'),
  '1Co 14:1',
  ('Señor, gracias por los dones de Tu Espíritu. Queremos desearlos con sinceridad y usarlos siempre con amor, en orden y para edificar a Tu iglesia. Que toda la gloria sea para Ti. En el nombre de Jesús, amén.',
   'Senhor, obrigado pelos dons do teu Espírito. Queremos desejá-los com sinceridade e usá-los sempre com amor, com ordem e para edificar a tua igreja. Que toda a glória seja para ti. Em nome de Jesus, amém.'))

L('Rm 8:14-16',('Guiados por el Espíritu','Guiados pelo Espírito'),
  ('Aprender a ser guiados por el Espíritu Santo con sensibilidad, obediencia y discernimiento bíblico.',
   'Aprender a ser guiados pelo Espírito Santo com sensibilidade, obediência e discernimento bíblico.'),
  ('¿Alguna vez usó un GPS o pidió indicaciones y llegó a un lugar desconocido? ¿Cómo fue?',
   'Alguma vez você usou um GPS ou pediu informações e chegou a um lugar desconhecido? Como foi?'),
  ('Pablo afirma que todos los que son guiados por el Espíritu de Dios son hijos de Dios. El Espíritu no solo nos da la seguridad de ser hijos, sino que también nos dirige en el camino. El libro de Hechos muestra cómo los primeros cristianos se dejaban guiar: él abría y cerraba puertas, y les indicaba a quién hablar. Pero también la Biblia nos enseña a probar los espíritus. En esta lección veremos cómo el Espíritu guía, cómo responder con obediencia y cómo discernir con sabiduría.',
   'Paulo afirma que todos os que são guiados pelo Espírito de Deus são filhos de Deus. O Espírito não só nos dá a segurança de sermos filhos, mas também nos dirige no caminho. O livro de Atos mostra como os primeiros cristãos se deixavam guiar: ele abria e fechava portas e lhes indicava com quem falar. Mas a Bíblia também nos ensina a provar os espíritos. Nesta lição veremos como o Espírito guia, como responder com obediência e como discernir com sabedoria.'),
  [('At 16:6-7',('Puertas que se cierran','Portas que se fecham'),
    ('Pablo y sus compañeros querían predicar en Asia y luego en Bitinia, pero el Espíritu Santo no se lo permitió. Poco después, Dios les mostró que debían ir a Macedonia. A veces la dirección de Dios llega como un «no» o una puerta cerrada. No es un rechazo, sino una manera de llevarnos al lugar correcto en el momento correcto.',
     'Paulo e os seus companheiros queriam pregar na Ásia e depois na Bitínia, mas o Espírito Santo não lhes permitiu. Pouco depois, Deus lhes mostrou que deviam ir para a Macedônia. Às vezes a direção de Deus vem como um “não” ou uma porta fechada. Não é uma rejeição, mas uma forma de nos levar ao lugar certo no momento certo.')),
   ('At 8:29',('Obedecer a la voz del Espíritu','Obedecer à voz do Espírito'),
    ('El Espíritu dijo a Felipe que se acercara al carro de un funcionario etíope. Felipe obedeció de inmediato, le explicó las Escrituras y aquel hombre creyó en Jesús. Ser guiado por el Espíritu incluye estar atentos a las oportunidades que Dios pone en el camino: una conversación, una visita o una ayuda. La obediencia sencilla abre puertas para la salvación de otros.',
     'O Espírito disse a Filipe que se aproximasse da carruagem de um oficial etíope. Filipe obedeceu imediatamente, explicou-lhe as Escrituras e aquele homem creu em Jesus. Ser guiado pelo Espírito inclui estar atento às oportunidades que Deus coloca no caminho: uma conversa, uma visita ou uma ajuda. A obediência simples abre portas para a salvação de outros.')),
   ('1Jo 4:1',('Probar los espíritus','Provar os espíritos'),
    ('Juan advierte: «no creáis á todo espíritu, sino probad los espíritus si son de Dios». No toda voz interior ni toda palabra que alguien dice en nombre de Dios viene de él. La guía del Espíritu siempre está de acuerdo con la Biblia, glorifica a Jesús y produce paz y santidad. Por eso es sabio confirmar las decisiones importantes con la Palabra, la oración y el consejo pastoral.',
     'João adverte: “não creiais em todo espírito, mas provai se os espíritos são da parte de Deus”. Nem toda voz interior nem toda palavra que alguém diz em nome de Deus vem dele. A direção do Espírito sempre está de acordo com a Bíblia, glorifica Jesus e produz paz e santidade. Por isso é sábio confirmar as decisões importantes com a Palavra, a oração e o conselho pastoral.'))],
  [('Según Romanos 8:14, ¿qué caracteriza a los hijos de Dios?','Segundo Romanos 8:14, o que caracteriza os filhos de Deus?'),
   ('¿Alguna vez Dios le cerró una puerta que después entendió que fue para bien?','Alguma vez Deus fechou uma porta para você e depois você entendeu que foi para o bem?'),
   ('¿Qué nos enseña la rapidez con que Felipe obedeció?','O que a rapidez com que Filipe obedeceu nos ensina?'),
   ('¿Cómo podemos saber si una dirección viene realmente de Dios?','Como podemos saber se uma direção vem realmente de Deus?'),
   ('¿Por qué es importante buscar consejo pastoral en las decisiones grandes?','Por que é importante buscar conselho pastoral nas decisões grandes?')],
  ('Presente a Dios una decisión que necesita tomar, examínela a la luz de la Biblia, ore por ella esta semana y, si es importante, pida consejo a su líder o pastor.',
   'Apresente a Deus uma decisão que você precisa tomar, examine-a à luz da Bíblia, ore por ela nesta semana e, se for importante, peça conselho ao seu líder ou pastor.'),
  'Rm 8:14',
  ('Espíritu Santo, queremos ser guiados por Ti. Danos oídos atentos para escuchar, corazón dispuesto para obedecer y sabiduría para discernir. Abre y cierra las puertas según Tu voluntad. En el nombre de Jesús, amén.',
   'Espírito Santo, queremos ser guiados por ti. Dá-nos ouvidos atentos para ouvir, coração disposto para obedecer e sabedoria para discernir. Abre e fecha as portas segundo a tua vontade. Em nome de Jesus, amém.'))

L('At 1:8',('Poder para testificar','Poder para testemunhar'),
  ('Entender que el poder del Espíritu Santo nos es dado para ser testigos de Jesús donde vivimos y hasta lo último de la tierra.',
   'Entender que o poder do Espírito Santo nos é dado para sermos testemunhas de Jesus onde vivemos e até os confins da terra.'),
  ('¿Qué le da más vergüenza o temor a la hora de hablar de Jesús con otra persona?',
   'O que dá mais vergonha ou medo na hora de falar de Jesus com outra pessoa?'),
  ('Las últimas palabras de Jesús antes de subir al cielo fueron una promesa y una misión: recibirían poder cuando viniera sobre ellos el Espíritu Santo, y serían sus testigos en Jerusalén, en Judea, en Samaria y hasta lo último de la tierra. El poder del Espíritu no es para exhibirse, sino para testificar. Pedro, que antes había negado a Jesús por miedo, predicó con valentía después de Pentecostés. En esta lección veremos cómo el Espíritu transforma a personas comunes en testigos valientes.',
   'As últimas palavras de Jesus antes de subir ao céu foram uma promessa e uma missão: eles receberiam poder quando o Espírito Santo viesse sobre eles, e seriam suas testemunhas em Jerusalém, na Judeia, em Samaria e até os confins da terra. O poder do Espírito não é para exibição, mas para testemunhar. Pedro, que antes tinha negado Jesus por medo, pregou com coragem depois do Pentecostes. Nesta lição veremos como o Espírito transforma pessoas comuns em testemunhas corajosas.'),
  [('At 4:13',('Personas comunes que estuvieron con Jesús','Pessoas comuns que estiveram com Jesus'),
    ('Las autoridades se maravillaron de la valentía de Pedro y Juan, porque eran hombres sin letras y del pueblo. Pero reconocían que habían estado con Jesús. Dios no necesita personas con muchos estudios para dar testimonio; necesita personas que pasen tiempo con Jesús y estén llenas de su Espíritu. Lo que vivimos con él es nuestro mensaje.',
     'As autoridades ficaram admiradas com a ousadia de Pedro e João, porque eram homens sem instrução e do povo. Mas reconheciam que eles tinham estado com Jesus. Deus não precisa de pessoas com muito estudo para dar testemunho; precisa de pessoas que passem tempo com Jesus e estejam cheias do seu Espírito. O que vivemos com ele é a nossa mensagem.')),
   ('At 4:31',('Llenos de nuevo para hablar con valor','Cheios de novo para falar com ousadia'),
    ('Cuando los discípulos fueron amenazados, no se escondieron: se reunieron a orar. El lugar tembló, todos fueron llenos del Espíritu Santo y hablaron la palabra de Dios con confianza. Ellos ya habían sido llenos en Pentecostés, pero necesitaban ser llenos de nuevo. La valentía para testificar se renueva en la oración.',
     'Quando os discípulos foram ameaçados, eles não se esconderam: reuniram-se para orar. O lugar tremeu, todos foram cheios do Espírito Santo e falavam a palavra de Deus com ousadia. Eles já tinham sido cheios no Pentecostes, mas precisavam ser cheios de novo. A coragem para testemunhar se renova na oração.')),
   ('2Tm 1:7',('Un espíritu de poder, no de temor','Um espírito de poder, não de medo'),
    ('Pablo recordó a Timoteo que Dios no nos ha dado espíritu de temor, sino de fortaleza, de amor y de templanza. El miedo a hablar de Jesús es normal, pero no tiene que dominarnos. El Espíritu nos da fuerza para hablar, amor por las personas y dominio propio para hacerlo con respeto. Testificar no es discutir; es contar lo que Jesús hizo.',
     'Paulo lembrou a Timóteo que Deus não nos deu espírito de medo, mas de força, de amor e de moderação. O medo de falar de Jesus é normal, mas não precisa nos dominar. O Espírito nos dá força para falar, amor pelas pessoas e domínio próprio para fazê-lo com respeito. Testemunhar não é discutir; é contar o que Jesus fez.'))],
  [('Según Hechos 1:8, ¿para qué recibimos el poder del Espíritu Santo?','Segundo Atos 1:8, para que recebemos o poder do Espírito Santo?'),
   ('¿Quiénes serían hoy nuestra «Jerusalén», nuestra «Judea» y nuestra «Samaria»?','Quem seriam hoje a nossa “Jerusalém”, a nossa “Judeia” e a nossa “Samaria”?'),
   ('¿Qué cambió en Pedro entre la noche en que negó a Jesús y el día de Pentecostés?','O que mudou em Pedro entre a noite em que negou Jesus e o dia de Pentecostes?'),
   ('¿Qué hicieron los discípulos cuando fueron amenazados? ¿Qué aprendemos de eso?','O que os discípulos fizeram quando foram ameaçados? O que aprendemos com isso?'),
   ('¿Cómo podemos dar testimonio de Jesús con respeto, sin discutir?','Como podemos dar testemunho de Jesus com respeito, sem discutir?')],
  ('Ore pidiendo una oportunidad y, esta semana, cuente a una persona lo que Jesús hizo en su vida; luego invítela a la próxima reunión de la célula.',
   'Ore pedindo uma oportunidade e, nesta semana, conte a uma pessoa o que Jesus fez na sua vida; depois convide-a para o próximo encontro da célula.'),
  'At 1:8',
  ('Señor, llénanos de nuevo con Tu Espíritu Santo. Quita el temor de nuestro corazón y danos valor, amor y sabiduría para hablar de Jesús en nuestras casas, en el trabajo y en el barrio. En el nombre de Jesús, amén.',
   'Senhor, enche-nos de novo com o teu Espírito Santo. Tira o medo do nosso coração e dá-nos coragem, amor e sabedoria para falar de Jesus em nossas casas, no trabalho e no bairro. Em nome de Jesus, amém.'))

# ================================================================ validação e saída
TU=r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas)\b'
TU_ANY=re.compile(TU,re.I)      # textos ao grupo: nenhuma forma de "tú", nem com maiúscula
TU_LOW=re.compile(TU)           # orações (dirigidas a Deus): pronomes de Deus só com maiúscula
QUOTE=re.compile(r'«[^»]*»|“[^”]*”|"[^"]*"')
def words(s):return len(s.split())
KEYS=['fe','oracao','familia','espirito']
def main():
    err=[];refs=[];bases={}
    def chk_pair(where,p,lo=None,hi=None):
        if not(isinstance(p,list) and len(p)==2 and all(isinstance(x,str) and x.strip() for x in p)):
            err.append(where+': par ES/PT incompleto');return
        if lo:
            for lang,x in zip(('ES','PT'),p):
                n=words(x)
                if not lo<=n<=hi:err.append('%s %s: %d palavras (esperado %d-%d)'%(where,lang,n,lo,hi))
    def chk_es(where,s,pat):
        m=pat.search(QUOTE.sub(' ',s))
        if m:err.append('%s: forma de "tú" em ES: %r em %r'%(where,m.group(0),s))
    for o in SER:
        chk_pair(o['k']+' nome',o['n']);chk_pair(o['k']+' desc',o['d'])
        if len(o['l'])!=6:err.append('%s: %d lições'%(o['k'],len(o['l'])))
        for i,l in enumerate(o['l']):
            w='%s#%d'%(o['k'],i+1)
            if len(l['pts'])!=3:err.append(w+': %d pontos'%len(l['pts']))
            if not 4<=len(l['perg'])<=5:err.append(w+': %d perguntas'%len(l['perg']))
            for k in ('t','obj','gelo','apl'):chk_pair(w+' '+k,l[k])
            chk_pair(w+' intro',l['intro'],60,100)
            chk_pair(w+' or',l['or'],20,40)
            for j,p in enumerate(l['pts']):
                chk_pair('%s p%d t'%(w,j+1),p['t']);chk_pair('%s p%d x'%(w,j+1),p['x'],40,80)
            for j,q in enumerate(l['perg']):chk_pair('%s q%d'%(w,j+1),q)
            # ES: textos ao grupo sem "tú"; oração só com pronomes de Deus em maiúscula
            es=[l['t'][0],l['obj'][0],l['gelo'][0],l['intro'][0],l['apl'][0]]+[p['t'][0] for p in l['pts']]+[p['x'][0] for p in l['pts']]+[q[0] for q in l['perg']]
            for s in es:chk_es(w,s,TU_ANY)
            chk_es(w+' or',l['or'][0],TU_LOW)
            # referências
            n=len(verses(ref(l['v'])))
            if not 1<=n<=6:err.append(w+': texto-base com %d versículos'%n)
            l['v']=ref(l['v']);refs.append((w+' base',l['v']));bases.setdefault(l['v'],[]).append(w)
            l['mem']=ref(l['mem']);refs.append((w+' mem',l['mem']))
            for j,p in enumerate(l['pts']):
                p['v']=ref(p['v']);refs.append((w+' p%d'%(j+1),p['v']))
        for s in [o['n'][0],o['d'][0]]:chk_es(o['k'],s,TU_ANY)
    if [o['k'] for o in SER]!=KEYS:err.append('ordem/chaves das séries diferente do pedido')
    for w,r in refs:
        for b,c,v in verses(r):
            for nome,bib in (('PT',PT),('ES',ES)):
                if not exists(bib,b,c,v):err.append('%s: %s não existe em %s'%(w,r,nome))
    for r,ws in bases.items():
        if len(ws)>1:err.append('texto-base repetido %s: %s'%(r,', '.join(ws)))
    if '--print' in sys.argv:
        for w,r in refs:
            print('==',w,r)
            for b,c,v in verses(r):
                print('  PT %d:%d %s'%(c,v,PT[b][c-1][v-1]));print('  ES %d:%d %s'%(c,v,ES[b][c-1][v-1]))
    if err:
        print('\n'.join(err));sys.exit(1)
    out=os.path.join(HERE,'licoes-1.json')
    json.dump({'series':SER},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['l']) for o in SER)
    print('ok: %d séries x 6 = %d lições, %d referências -> %s'%(len(SER),n,len(refs),out))
if __name__=='__main__':main()
