# Banco de ilustrações para sermões (Meu Púlpito) — parte 3: 12 temas novos x 5 = 60 ilustrações [ES, PT].
# Regra de honestidade: nada de anedotas sobre pessoas reais, frases atribuídas a famosos, "histórias verídicas"
# ou estatísticas não verificáveis. Tipos permitidos:
#   comparacao — analogia do dia a dia apresentada como imagem
#   cotidiano  — cena curta, declaradamente hipotética ("Imagine…")
#   natureza   — fato conhecido e verificável da natureza/ciência cotidiana, em termos gerais (sem mitos)
#   biblica    — recontagem viva de uma cena bíblica, com referência
# Mitos populares rejeitados de propósito (NÃO usar como fato): a águia que arranca o bico aos 40 anos para se renovar;
# a rã que não percebe a água esquentando aos poucos; a pérola formada por um "grão de areia" (aqui se diz só
# "algo estranho/irritante"); a borboleta que morre se alguém a ajuda a sair do casulo; o bambu chinês que passa
# 5 anos "só criando raiz" e cresce 30 m em semanas; o ourives que só tira a prata do fogo quando vê o rosto refletido;
# o "portão buraco da agulha" de Jerusalém; os gansos que "grasnam para animar" os da frente (só se usa o fato
# estudado da economia de energia no voo em V e do revezamento na ponta).
# Uso: python3 tools/conteudo/ilustracoes-3.py          -> valida e grava tools/conteudo/ilustracoes-3.json
#      python3 tools/conteudo/ilustracoes-3.py --print  -> imprime o texto de cada referência nas duas Bíblias
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

IL=[]
def I(k,tema,tipo,tes,tpt,xes,xpt,aes,apt,*v):
    IL.append({'k':k,'tema':tema,'tipo':tipo,'t':[tes,tpt],'x':[xes,xpt],'ap':[aes,apt],'v':list(v)})

# ================================================================ paz
I('c-paz-lago','paz','natureza','La superficie y el fondo','A superfície e o fundo',
  'Cuando sopla un viento fuerte sobre un lago grande, la superficie se llena de olas y el agua parece estar en guerra. Pero quien ha buceado sabe que, unos metros más abajo, el movimiento es mucho menor y todo se vuelve más quieto. Las olas sacuden lo de arriba, pero no llegan con la misma fuerza a lo profundo. Así es la paz que Cristo da. Las circunstancias pueden agitar la superficie de la vida, pero el creyente que tiene raíces profundas en Dios guarda en lo íntimo una calma que la tormenta no alcanza.',
  'Quando sopra um vento forte sobre um lago grande, a superfície se enche de ondas e a água parece estar em guerra. Mas quem já mergulhou sabe que, alguns metros abaixo, o movimento é bem menor e tudo fica mais quieto. As ondas sacodem o que está em cima, mas não chegam com a mesma força ao fundo. Assim é a paz que Cristo dá. As circunstâncias podem agitar a superfície da vida, mas o crente que tem raízes profundas em Deus guarda no íntimo uma calma que a tempestade não alcança.',
  'La paz de Cristo no depende de que no haya olas, sino de estar arraigados en él.',
  'A paz de Cristo não depende de não haver ondas, mas de estar enraizado nele.',
  'Jo 14:27','Is 26:3')
I('c-paz-barca','paz','biblica','Dormido en la barca','Dormindo no barco',
  'Aquella tarde Jesús dijo a sus discípulos: «Pasemos al otro lado». En medio del lago se levantó una gran tempestad de viento, y las olas entraban en la barca de tal manera que ya se anegaba. Hombres acostumbrados al mar estaban aterrados, y Jesús dormía en la popa sobre un cabezal. Lo despertaron diciendo: «¿No tienes cuidado que perecemos?». Él se levantó, reprendió al viento y dijo al mar: «Calla, enmudece». Y se hizo grande bonanza. La paz no estaba en el agua tranquila, sino en la presencia de aquel que iba en la barca.',
  'Naquela tarde Jesus disse aos discípulos: «Passemos para o outro lado». No meio do lago levantou-se uma grande tempestade de vento, e as ondas entravam no barco a ponto de enchê-lo. Homens acostumados ao mar estavam apavorados, e Jesus dormia na popa, sobre uma almofada. Eles o acordaram dizendo: «Não te importa que pereçamos?». Ele se levantou, repreendeu o vento e disse ao mar: «Cala-te, aquieta-te». E houve grande bonança. A paz não estava na água calma, mas na presença daquele que ia no barco.',
  'Quien lleva a Jesús en su barca puede atravesar la tormenta sin perder la esperanza.',
  'Quem leva Jesus no seu barco pode atravessar a tempestade sem perder a esperança.',
  'Mc 4:37-39')
I('c-paz-colo','paz','cotidiano','Dormido en el regazo','Dormindo no colo',
  'Imagine un ómnibus lleno de ruido en un viaje largo de noche: el motor zumba, la gente conversa, la ruta tiene pozos y el vehículo se sacude. En un asiento, un niño pequeño duerme profundamente en el regazo de su padre. No sabe por dónde van, no conoce el camino ni la hora de llegada, pero descansa. Su paz no viene del silencio del ómnibus, sino de los brazos que lo sostienen. Muchas veces queremos entender todo el camino para recién descansar, y Dios nos invita a confiar en él aunque el viaje siga sacudiéndose.',
  'Imagine um ônibus cheio de barulho numa viagem longa à noite: o motor zumbe, as pessoas conversam, a estrada tem buracos e o veículo balança. Num assento, uma criança pequena dorme profundamente no colo do pai. Não sabe por onde estão passando, não conhece o caminho nem a hora de chegada, mas descansa. A sua paz não vem do silêncio do ônibus, mas dos braços que a seguram. Muitas vezes queremos entender todo o caminho para só então descansar, e Deus nos convida a confiar nele mesmo que a viagem continue balançando.',
  'La paz no nace de entenderlo todo, sino de saber en qué brazos estamos.',
  'A paz não nasce de entender tudo, mas de saber em que braços estamos.',
  'Is 26:3','Sl 4:8')
I('c-paz-tratado','paz','comparacao','El fin de la guerra','O fim da guerra',
  'Cuando dos naciones firman la paz después de una guerra, el cambio no es solo un sentimiento: es una nueva situación. Los que eran enemigos ya no están en conflicto, las fronteras se abren y se puede vivir sin temor a un ataque. La Biblia dice que antes estábamos en enemistad con Dios por causa del pecado. Pero en la cruz Cristo hizo la paz. Por eso la paz con Dios no es primero una emoción que va y viene, sino una realidad firme: el que fue justificado por la fe ya no está en guerra con su Creador.',
  'Quando duas nações assinam a paz depois de uma guerra, a mudança não é só um sentimento: é uma situação nova. Os que eram inimigos já não estão em conflito, as fronteiras se abrem e é possível viver sem medo de um ataque. A Bíblia diz que antes estávamos em inimizade com Deus por causa do pecado. Mas na cruz Cristo fez a paz. Por isso a paz com Deus não é primeiro uma emoção que vai e vem, mas uma realidade firme: quem foi justificado pela fé já não está em guerra com o seu Criador.',
  'Antes de sentir la paz de Dios, necesitamos tener paz con Dios por medio de Cristo.',
  'Antes de sentir a paz de Deus, precisamos ter paz com Deus por meio de Cristo.',
  'Rm 5:1','Cl 1:20')
I('c-paz-centinela','paz','comparacao','El centinela en la puerta','A sentinela na porta',
  'En las ciudades antiguas, de noche se colocaba un centinela en la puerta. Los habitantes podían dormir porque alguien vigilaba la entrada y no dejaba pasar al enemigo. Pablo usa esta imagen cuando dice que la paz de Dios guardará nuestros corazones y pensamientos en Cristo Jesús. La ansiedad intenta entrar a toda hora con sus «¿y si…?», pero cuando presentamos nuestras peticiones a Dios con oración y acción de gracias, su paz se pone de guardia en la puerta del corazón, aunque no entendamos todo lo que está pasando.',
  'Nas cidades antigas, à noite se colocava uma sentinela na porta. Os moradores podiam dormir porque alguém vigiava a entrada e não deixava o inimigo passar. Paulo usa essa imagem quando diz que a paz de Deus guardará o nosso coração e os nossos pensamentos em Cristo Jesus. A ansiedade tenta entrar a toda hora com os seus «e se…?», mas quando apresentamos os nossos pedidos a Deus com oração e ação de graças, a sua paz fica de guarda na porta do coração, mesmo sem entendermos tudo o que está acontecendo.',
  'La oración con gratitud abre espacio para que la paz de Dios guarde el corazón.',
  'A oração com gratidão abre espaço para que a paz de Deus guarde o coração.',
  'Fp 4:6-7')

# ================================================================ alegria
I('c-ale-fuente','alegria','comparacao','La fuente y el camión cisterna','A fonte e o caminhão-pipa',
  'En algunos barrios el agua llega en camión cisterna: cuando el camión pasa hay agua, y cuando se atrasa todos se quedan esperando. Otra cosa es tener una fuente dentro del terreno, que brota sin depender de quién pase por la calle. Mucha alegría humana depende del camión: llega con una buena noticia, un regalo o un elogio, y se va cuando eso se termina. Jesús prometió una fuente de agua que salta para vida eterna. La alegría del Señor brota desde adentro, aun en días en que nada bueno pasa por la calle.',
  'Em alguns bairros a água chega de caminhão-pipa: quando o caminhão passa há água, e quando ele atrasa todos ficam esperando. Outra coisa é ter uma fonte dentro do terreno, que brota sem depender de quem passa pela rua. Muita alegria humana depende do caminhão: chega com uma boa notícia, um presente ou um elogio, e vai embora quando isso acaba. Jesus prometeu uma fonte de água que salta para a vida eterna. A alegria do Senhor brota de dentro, mesmo em dias em que nada de bom passa pela rua.',
  'La alegría que viene de Cristo no depende de lo que llega de afuera.',
  'A alegria que vem de Cristo não depende do que chega de fora.',
  'Jo 4:14','Ne 8:10')
I('c-ale-carcel','alegria','biblica','Una carta alegre desde la prisión','Uma carta alegre da prisão',
  'Cuando Pablo escribió a los filipenses no estaba de vacaciones: estaba preso por causa del evangelio, sin saber si saldría con vida. Algunos predicaban con mala intención para causarle más aflicción. Aun así, esa carta corta habla de gozo y alegría una y otra vez. Pablo dice que sus prisiones sirvieron para el progreso del evangelio y escribe: «Gozaos en el Señor siempre; otra vez digo: Que os gocéis». Su alegría no venía de la celda, sino del Señor que estaba con él en la celda.',
  'Quando Paulo escreveu aos filipenses ele não estava de férias: estava preso por causa do evangelho, sem saber se sairia com vida. Alguns pregavam com má intenção para lhe causar mais aflição. Mesmo assim, essa carta curta fala de alegria uma vez após outra. Paulo diz que as suas prisões serviram para o progresso do evangelho e escreve: «Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos». A sua alegria não vinha da cela, mas do Senhor que estava com ele na cela.',
  'Es posible tener gozo en el Señor aun cuando las circunstancias son una prisión.',
  'É possível ter alegria no Senhor mesmo quando as circunstâncias são uma prisão.',
  'Fp 1:12-13','Fp 4:4')
I('c-ale-parto','alegria','biblica','La tristeza que se convierte en gozo','A tristeza que se transforma em alegria',
  'La noche antes de la cruz, Jesús preparó a sus discípulos para días de dolor. Les dijo que llorarían, pero que su tristeza se convertiría en gozo. Y usó una imagen que todos conocían: la mujer que va a dar a luz tiene dolor, porque ha llegado su hora, pero después que nace el niño ya no se acuerda de la angustia, por el gozo de que ha nacido un hombre en el mundo. El dolor no fue mentira, pero no tuvo la última palabra. Así fue la mañana de la resurrección, y así será para los que esperan en Cristo.',
  'Na noite antes da cruz, Jesus preparou os discípulos para dias de dor. Disse que eles chorariam, mas que a tristeza deles se transformaria em alegria. E usou uma imagem que todos conheciam: a mulher que vai dar à luz sente dor, porque chegou a sua hora, mas depois que a criança nasce já não se lembra da angústia, por causa da alegria de ter nascido um ser humano no mundo. A dor não foi mentira, mas não teve a última palavra. Assim foi a manhã da ressurreição, e assim será para os que esperam em Cristo.',
  'En Cristo, el dolor de hoy puede ser el comienzo de un gozo que nadie quitará.',
  'Em Cristo, a dor de hoje pode ser o começo de uma alegria que ninguém tirará.',
  'Jo 16:20-22')
I('c-ale-oveja','alegria','biblica','Una fiesta por una oveja','Uma festa por uma ovelha',
  'Jesús contó de un pastor que tenía cien ovejas y perdió una. Dejó las noventa y nueve en el desierto y fue a buscar la que se había perdido hasta encontrarla. Cuando la halló no la castigó ni la llevó arrastrando: la puso sobre sus hombros gozoso. Al llegar a casa reunió a los amigos y vecinos y les dijo: «Gozaos conmigo, porque he hallado mi oveja que se había perdido». Y Jesús concluyó que así habrá más gozo en el cielo por un pecador que se arrepiente que por noventa y nueve justos que no necesitan arrepentimiento.',
  'Jesus contou de um pastor que tinha cem ovelhas e perdeu uma. Deixou as noventa e nove no deserto e foi atrás da que estava perdida até encontrá-la. Quando a achou, não a castigou nem a levou arrastada: colocou-a sobre os ombros, cheio de alegria. Ao chegar em casa, reuniu os amigos e vizinhos e disse: «Alegrai-vos comigo, porque já achei a minha ovelha perdida». E Jesus concluiu que assim haverá mais alegria no céu por um pecador que se arrepende do que por noventa e nove justos que não precisam de arrependimento.',
  'Cada persona que vuelve a Dios es motivo de fiesta en el cielo y debería serlo en la iglesia.',
  'Cada pessoa que volta para Deus é motivo de festa no céu e deveria ser também na igreja.',
  'Lc 15:4-7')
I('c-ale-cosecha','alegria','cotidiano','Sembrar llorando, cosechar cantando','Semear chorando, colher cantando',
  'Imagine a un agricultor en un año difícil. Las semillas están caras, el dinero no alcanza y él sale al campo con la bolsa de semillas sabiendo que la familia también tiene hambre. Siembra con lágrimas, porque cada puñado que pone en la tierra es algo que hoy no pueden comer. Meses después vuelve al mismo campo y encuentra espigas cargadas. Entonces carga las gavillas cantando. El salmista conocía esta escena y la usó como promesa: los que sembraron con lágrimas, con regocijo segarán.',
  'Imagine um agricultor num ano difícil. As sementes estão caras, o dinheiro não dá e ele sai para o campo com o saco de sementes sabendo que a família também tem fome. Semeia com lágrimas, porque cada punhado que coloca na terra é algo que hoje não podem comer. Meses depois volta ao mesmo campo e encontra espigas carregadas. Então carrega os feixes cantando. O salmista conhecia essa cena e a usou como promessa: os que semearam com lágrimas, com alegria colherão.',
  'Lo que se siembra en fidelidad, aun con lágrimas, Dios lo convierte en cosecha de alegría.',
  'O que se semeia com fidelidade, mesmo com lágrimas, Deus transforma em colheita de alegria.',
  'Sl 126:5-6')

# ================================================================ santidade
I('c-san-blanco','santidade','cotidiano','La ropa blanca en el barro','A roupa branca no barro',
  'Imagine a alguien vestido de blanco para una boda, caminando por una calle de tierra después de la lluvia. No necesita que nadie le diga que tenga cuidado: él mismo elige dónde pisar, esquiva los charcos y se aparta cuando pasa un auto. No lo hace por miedo ni por orgullo, sino porque valora la ropa que lleva y el lugar adonde va. La santidad cristiana es parecida. No es una lista de prohibiciones para sentirse superior, sino el cuidado de quien recibió vestiduras limpias por la gracia y camina hacia el encuentro con su Señor.',
  'Imagine alguém vestido de branco para um casamento, andando por uma rua de terra depois da chuva. Não precisa que ninguém lhe diga para ter cuidado: ele mesmo escolhe onde pisar, desvia das poças e se afasta quando passa um carro. Não faz isso por medo nem por orgulho, mas porque valoriza a roupa que está usando e o lugar para onde vai. A santidade cristã é parecida. Não é uma lista de proibições para se sentir superior, mas o cuidado de quem recebeu vestes limpas pela graça e caminha para o encontro com o seu Senhor.',
  'Quien sabe lo que costó su limpieza cuida dónde pisa.',
  'Quem sabe quanto custou a sua limpeza cuida de onde pisa.',
  '1Pe 1:15-16','Ap 3:4')
I('c-san-vaso','santidade','comparacao','El utensilio separado','O utensílio separado',
  'En muchas casas hay una vajilla que se usa solo en ocasiones especiales. No es de otro material mágico; es separada. Nadie la usa para guardar clavos ni para darle agua al perro, porque fue reservada para servir a la mesa en los días importantes. La palabra santo tiene que ver con esto: algo apartado para Dios. Pablo dice que si alguno se limpia de lo deshonroso será instrumento para honra, santificado y útil al Señor. Santidad es vivir como alguien que fue reservado para el uso de Dios.',
  'Em muitas casas há uma louça que se usa só em ocasiões especiais. Não é feita de algum material mágico; é separada. Ninguém a usa para guardar pregos nem para dar água ao cachorro, porque foi reservada para servir à mesa nos dias importantes. A palavra santo tem a ver com isso: algo separado para Deus. Paulo diz que, se alguém se purificar do que é desonroso, será vaso para honra, santificado e útil ao Senhor. Santidade é viver como alguém que foi reservado para o uso de Deus.',
  'Ser santo es estar apartado para Dios y disponible para su uso.',
  'Ser santo é estar separado para Deus e disponível para o seu uso.',
  '2Tm 2:21')
I('c-san-isaias','santidade','biblica','¡Ay de mí!','Ai de mim!',
  'El año en que murió el rey Uzías, Isaías vio al Señor sentado sobre un trono alto y sublime. Los serafines clamaban: «Santo, santo, santo, Jehová de los ejércitos». Los quiciales de las puertas se estremecieron y la casa se llenó de humo. La primera reacción del profeta no fue entusiasmo, sino quebranto: «¡Ay de mí! que soy muerto; que siendo hombre inmundo de labios». Entonces un serafín tocó su boca con un carbón del altar y le dijo que su pecado había sido limpiado. Solo después Isaías respondió: «Heme aquí, envíame a mí».',
  'No ano em que morreu o rei Uzias, Isaías viu o Senhor assentado sobre um trono alto e sublime. Os serafins clamavam: «Santo, santo, santo é o Senhor dos Exércitos». Os umbrais das portas tremeram e a casa se encheu de fumaça. A primeira reação do profeta não foi entusiasmo, mas quebrantamento: «Ai de mim, que estou perdido, porque sou homem de lábios impuros». Então um serafim tocou a sua boca com uma brasa do altar e disse que o seu pecado tinha sido purificado. Só depois Isaías respondeu: «Eis-me aqui, envia-me a mim».',
  'Ver la santidad de Dios nos humilla, nos limpia y nos dispone para servir.',
  'Ver a santidade de Deus nos humilha, nos purifica e nos dispõe para servir.',
  'Is 6:1-3','Is 6:5-8')
I('c-san-levadura','santidade','comparacao','Un poco de levadura','Um pouco de fermento',
  'Quien hace pan casero sabe que basta un poco de levadura para que toda la masa crezca. No se ve al principio, pero con el tiempo se extiende por todo y cambia el pan entero. Pablo usó esta imagen para advertir a la iglesia de Corinto, que toleraba un pecado grave con indiferencia. Lo que parece pequeño y escondido no se queda quieto; avanza. Por eso la santidad presta atención a las cosas pequeñas: un hábito, una mentira «sin importancia», una amargura guardada. Lo que no se trata a tiempo termina afectando toda la vida.',
  'Quem faz pão caseiro sabe que basta um pouco de fermento para que toda a massa cresça. No começo não se vê, mas com o tempo ele se espalha por tudo e muda o pão inteiro. Paulo usou essa imagem para advertir a igreja de Corinto, que tolerava um pecado grave com indiferença. O que parece pequeno e escondido não fica parado; avança. Por isso a santidade presta atenção às coisas pequenas: um hábito, uma mentira «sem importância», uma amargura guardada. O que não é tratado a tempo acaba afetando a vida inteira.',
  'El pecado tolerado en lo pequeño no se queda pequeño.',
  'O pecado tolerado no pequeno não fica pequeno.',
  '1Co 5:6-7')
I('c-san-daniel','santidade','biblica','Daniel propuso en su corazón','Daniel decidiu no coração',
  'Daniel era un joven llevado cautivo a Babilonia, lejos de su tierra, de su familia y del templo. Le cambiaron el nombre, le dieron otra educación y le ofrecieron la comida del rey. Nadie en su tierra se enteraría de lo que hiciera allí. Pero la Biblia dice que Daniel propuso en su corazón no contaminarse con la porción de la comida del rey. No respondió con arrogancia: pidió con respeto una prueba de diez días. Dios le dio gracia delante del jefe de los eunucos, y aquella decisión firme marcó toda su vida.',
  'Daniel era um jovem levado cativo para a Babilônia, longe da sua terra, da sua família e do templo. Mudaram o seu nome, deram-lhe outra educação e lhe ofereceram a comida do rei. Ninguém na sua terra ficaria sabendo do que ele fizesse ali. Mas a Bíblia diz que Daniel decidiu no coração não se contaminar com a porção da comida do rei. Não respondeu com arrogância: pediu com respeito um teste de dez dias. Deus lhe deu graça diante do chefe dos eunucos, e aquela decisão firme marcou toda a sua vida.',
  'La santidad se decide en el corazón antes de que llegue la presión.',
  'A santidade se decide no coração antes que chegue a pressão.',
  'Dn 1:8-9')

# ================================================================ arrependimento
I('c-arr-contramano','arrependimento','comparacao','La mano equivocada','A contramão',
  'Un conductor entra sin darse cuenta en una calle de contramano. Los otros autos le hacen señas con las luces y tocan la bocina. Él puede seguir adelante pidiendo disculpas por la ventanilla, o puede detenerse, dar la vuelta y tomar la dirección correcta. Solo la segunda opción lo saca del peligro. El arrepentimiento bíblico no es solamente sentir pena ni decir «perdón» y seguir igual. La palabra describe un cambio de mente que lleva a un cambio de dirección: dejar el camino del pecado y volverse a Dios.',
  'Um motorista entra sem perceber numa rua na contramão. Os outros carros piscam os faróis e buzinam. Ele pode continuar em frente pedindo desculpas pela janela, ou pode parar, dar meia-volta e seguir na direção certa. Só a segunda opção o tira do perigo. O arrependimento bíblico não é só sentir pena nem dizer «desculpa» e continuar igual. A palavra descreve uma mudança de mente que leva a uma mudança de direção: deixar o caminho do pecado e voltar-se para Deus.',
  'Arrepentirse es dar media vuelta, no solo lamentar el camino.',
  'Arrepender-se é dar meia-volta, não só lamentar o caminho.',
  'At 3:19','Is 55:7')
I('c-arr-david','arrependimento','biblica','La parábola de Natán','A parábola de Natã',
  'Después de su pecado con Betsabé y de la muerte de Urías, David siguió reinando como si nada hubiera pasado. Entonces Dios envió al profeta Natán, que le contó la historia de un rico que le quitó al pobre su única corderita. David se enfureció y dijo que aquel hombre merecía morir. Natán le respondió: «Tú eres aquel hombre». David no se defendió ni culpó a otros: «Pequé contra Jehová». De ese quebranto nació el Salmo 51, donde pide: «Crea en mí, oh Dios, un corazón limpio».',
  'Depois do seu pecado com Bate-Seba e da morte de Urias, Davi continuou reinando como se nada tivesse acontecido. Então Deus enviou o profeta Natã, que lhe contou a história de um rico que tomou do pobre a sua única cordeirinha. Davi se indignou e disse que aquele homem merecia morrer. Natã respondeu: «Tu és esse homem». Davi não se defendeu nem culpou os outros: «Pequei contra o Senhor». Desse quebrantamento nasceu o Salmo 51, onde ele pede: «Cria em mim, ó Deus, um coração puro».',
  'El arrepentimiento verdadero deja de justificarse y se rinde ante Dios.',
  'O arrependimento verdadeiro para de se justificar e se rende diante de Deus.',
  '2Sm 12:7','2Sm 12:13','Sl 51:10')
I('c-arr-volviendo','arrependimento','biblica','Volviendo en sí','Caindo em si',
  'El hijo menor de la parábola pidió su herencia, se fue lejos y la gastó viviendo perdidamente. Cuando vino el hambre, terminó cuidando cerdos y deseando comer lo que ellos comían. Allí la Biblia usa una expresión preciosa: «volviendo en sí». Recordó que en la casa de su padre hasta los jornaleros tenían pan de sobra. Entonces decidió: «Me levantaré, e iré a mi padre, y le diré: Padre, he pecado contra el cielo y contra ti». El arrepentimiento empezó con la verdad sobre sí mismo y terminó con pasos de regreso a casa.',
  'O filho mais novo da parábola pediu a sua herança, foi para longe e a gastou vivendo de forma dissoluta. Quando veio a fome, acabou cuidando de porcos e desejando comer o que eles comiam. Ali a Bíblia usa uma expressão preciosa: «caindo em si». Ele se lembrou de que na casa do pai até os empregados tinham pão de sobra. Então decidiu: «Levantar-me-ei, irei ao meu pai e lhe direi: Pai, pequei contra o céu e contra ti». O arrependimento começou com a verdade sobre si mesmo e terminou com passos de volta para casa.',
  'Arrepentirse es despertar a la verdad y emprender el camino de regreso al Padre.',
  'Arrepender-se é despertar para a verdade e tomar o caminho de volta ao Pai.',
  'Lc 15:17-20')
I('c-arr-herida','arrependimento','comparacao','Limpiar la herida','Limpar a ferida',
  'Cuando alguien llega al puesto de salud con una herida sucia, el enfermero no la cubre enseguida con una venda bonita. Primero la limpia, aunque arda, porque sabe que una herida cerrada con tierra adentro se infecta. Confesar el pecado se parece a eso. Es incómodo nombrar lo que hicimos, y preferiríamos taparlo con buenas obras o con olvido. Pero Dios promete que si confesamos nuestros pecados, él es fiel y justo para perdonarlos y limpiarnos de toda maldad. La sanidad verdadera comienza cuando dejamos que él limpie la herida.',
  'Quando alguém chega ao posto de saúde com uma ferida suja, o enfermeiro não a cobre logo com um curativo bonito. Primeiro a limpa, mesmo que arda, porque sabe que uma ferida fechada com terra dentro infecciona. Confessar o pecado se parece com isso. É incômodo dar nome ao que fizemos, e preferiríamos cobrir com boas obras ou com esquecimento. Mas Deus promete que, se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar e nos purificar de toda injustiça. A cura verdadeira começa quando deixamos que ele limpe a ferida.',
  'Lo que se confiesa delante de Dios puede ser limpiado; lo que se esconde sigue doliendo.',
  'O que é confessado diante de Deus pode ser purificado; o que é escondido continua doendo.',
  '1Jo 1:9','Pv 28:13')
I('c-arr-ninive','arrependimento','biblica','Una ciudad entera de rodillas','Uma cidade inteira de joelhos',
  'Nínive era una ciudad grande y conocida por su violencia. Jonás, después de huir de Dios, finalmente entró en ella y proclamó: «De aquí a cuarenta días Nínive será destruida». Lo que pasó sorprendió al propio profeta: los hombres de Nínive creyeron a Dios, proclamaron ayuno y se vistieron de saco, desde el mayor hasta el menor. El rey dejó su trono y mandó que cada uno se convirtiera de su mal camino. Y la Biblia dice que vio Dios lo que hicieron, que se convirtieron de su mal camino, y no hizo lo que había anunciado.',
  'Nínive era uma cidade grande e conhecida pela sua violência. Jonas, depois de fugir de Deus, finalmente entrou nela e proclamou: «Ainda quarenta dias, e Nínive será destruída». O que aconteceu surpreendeu o próprio profeta: os homens de Nínive creram em Deus, proclamaram jejum e se vestiram de pano de saco, do maior ao menor. O rei deixou o trono e ordenou que cada um se convertesse do seu mau caminho. E a Bíblia diz que Deus viu o que fizeram, como se converteram do seu mau caminho, e não fez o que tinha anunciado.',
  'Dios responde con misericordia a quien se vuelve de veras de su mal camino.',
  'Deus responde com misericórdia a quem se volta de verdade do seu mau caminho.',
  'Jon 3:4-5','Jon 3:10')

# ================================================================ fidelidade
I('c-fid-amanecer','fidelidade','natureza','Cada mañana','Toda manhã',
  'Nadie se acuesta preocupado pensando si mañana va a salir el sol. Después de cada noche, por larga que sea, viene la mañana. Las estaciones siguen su orden: siembra y cosecha, frío y calor, verano e invierno. Después del diluvio, Dios prometió que mientras la tierra permanezca no cesarán estas cosas. Jeremías, llorando sobre las ruinas de Jerusalén, recordó que las misericordias del Señor son nuevas cada mañana. Cada amanecer es un recordatorio silencioso de que Dios no cambia y cumple lo que promete.',
  'Ninguém vai dormir preocupado pensando se amanhã o sol vai nascer. Depois de cada noite, por mais longa que seja, vem a manhã. As estações seguem a sua ordem: semeadura e colheita, frio e calor, verão e inverno. Depois do dilúvio, Deus prometeu que, enquanto a terra durar, essas coisas não cessarão. Jeremias, chorando sobre as ruínas de Jerusalém, lembrou que as misericórdias do Senhor se renovam a cada manhã. Cada amanhecer é um lembrete silencioso de que Deus não muda e cumpre o que promete.',
  'La fidelidad de Dios es tan constante como la mañana que llega cada día.',
  'A fidelidade de Deus é tão constante quanto a manhã que chega todos os dias.',
  'Gn 8:22','Lm 3:22-23')
I('c-fid-abraham','fidelidade','biblica','La promesa que tardó','A promessa que demorou',
  'Abraham tenía setenta y cinco años cuando Dios le prometió hacer de él una gran nación. Pasaron los años, Sara seguía estéril y la promesa parecía cada vez más imposible. Hubo intentos de ayudar a Dios por caminos humanos, y hubo risas de incredulidad. Pero cuando Abraham tenía cien años, la Biblia dice: «Visitó Jehová a Sara, como había dicho, e hizo Jehová con Sara como había hablado». Nació Isaac, cuyo nombre recuerda la risa. La demora no anuló la promesa, porque fiel es el que prometió.',
  'Abraão tinha setenta e cinco anos quando Deus prometeu fazer dele uma grande nação. Os anos passaram, Sara continuava estéril e a promessa parecia cada vez mais impossível. Houve tentativas de ajudar Deus por caminhos humanos, e houve risos de incredulidade. Mas quando Abraão tinha cem anos, a Bíblia diz: «O Senhor visitou Sara, como tinha dito, e fez a Sara como tinha prometido». Nasceu Isaque, cujo nome lembra o riso. A demora não anulou a promessa, porque fiel é aquele que prometeu.',
  'El tiempo de espera no cancela la palabra de Dios.',
  'O tempo de espera não cancela a palavra de Deus.',
  'Gn 21:1-2','Hb 10:23')
I('c-fid-escuela','fidelidade','cotidiano','El padre que siempre llega','O pai que sempre chega',
  'Imagine a un niño en la puerta de la escuela al final de la tarde. Los compañeros se van uno por uno y el portón ya se está cerrando. Otro niño se pondría nervioso, pero él está tranquilo jugando con una piedrita. Cuando alguien le pregunta si no tiene miedo, responde: «Mi papá dijo que viene. Él nunca me dejó». Su calma no viene de ver el auto en la esquina, sino de conocer a su padre. Así también, la confianza del creyente se apoya en el carácter de Dios, que permanece fiel aunque nosotros fallemos.',
  'Imagine um menino no portão da escola no fim da tarde. Os colegas vão embora um por um e o portão já está fechando. Outra criança ficaria nervosa, mas ele está tranquilo brincando com uma pedrinha. Quando alguém pergunta se ele não tem medo, ele responde: «O meu pai disse que vem. Ele nunca me deixou». A sua calma não vem de ver o carro na esquina, mas de conhecer o pai. Assim também, a confiança do crente se apoia no caráter de Deus, que permanece fiel mesmo quando nós falhamos.',
  'Confiamos en las promesas porque conocemos al que las hizo.',
  'Confiamos nas promessas porque conhecemos aquele que as fez.',
  '2Tm 2:13','Dt 7:9')
I('c-fid-mana','fidelidade','biblica','El maná de cada mañana','O maná de cada manhã',
  'En el desierto no había campos, ni mercados, ni depósitos de comida para un pueblo entero. Y aun así, cada mañana, durante cuarenta años, el maná apareció alrededor del campamento. Dios no les dio la provisión de un año de una sola vez; les daba lo de cada día, y lo que guardaban de más se echaba a perder, salvo para el día de reposo. El maná cesó recién cuando entraron en Canaán y comieron del fruto de la tierra. Cuarenta años de mañanas seguidas enseñaron a Israel que Dios no se olvida de sus hijos.',
  'No deserto não havia lavouras, nem mercados, nem depósitos de comida para um povo inteiro. Mesmo assim, toda manhã, durante quarenta anos, o maná apareceu ao redor do acampamento. Deus não lhes deu a provisão de um ano de uma só vez; dava a de cada dia, e o que guardavam a mais estragava, exceto para o sábado. O maná só cessou quando entraram em Canaã e comeram do fruto da terra. Quarenta anos de manhãs seguidas ensinaram a Israel que Deus não se esquece dos seus filhos.',
  'Dios es fiel en proveer lo necesario para cada día del camino.',
  'Deus é fiel em prover o necessário para cada dia do caminho.',
  'Ex 16:35','Js 5:12')
I('c-fid-marea','fidelidade','natureza','Las mareas','As marés',
  'Quien vive cerca del mar sabe que la marea sube y baja con un ritmo que se puede anticipar. Los pescadores consultan las tablas de mareas y planifican su salida días antes, porque el mar obedece a un orden que no depende del humor de nadie. Por medio del profeta Jeremías, Dios señaló el sol, la luna, las estrellas y el mar que brama, y dijo que si esas leyes fallaran delante de él, entonces fallaría también su compromiso con su pueblo. El orden de la creación es un testimonio de la fidelidad del Creador.',
  'Quem mora perto do mar sabe que a maré sobe e desce com um ritmo que pode ser previsto. Os pescadores consultam a tábua de marés e planejam a saída com dias de antecedência, porque o mar obedece a uma ordem que não depende do humor de ninguém. Por meio do profeta Jeremias, Deus apontou o sol, a lua, as estrelas e o mar que brama, e disse que, se essas leis falhassem diante dele, então falharia também o seu compromisso com o seu povo. A ordem da criação é um testemunho da fidelidade do Criador.',
  'El mismo Dios que sostiene el orden del universo sostiene sus promesas.',
  'O mesmo Deus que sustenta a ordem do universo sustenta as suas promessas.',
  'Jr 31:35-36')

# ================================================================ adoracao
I('c-ado-perfume','adoracao','biblica','El perfume derramado','O perfume derramado',
  'Seis días antes de la Pascua, en Betania, hicieron una cena para Jesús. María tomó una libra de nardo puro, de mucho precio, ungió los pies de Jesús y los secó con sus cabellos. La casa se llenó del olor del perfume. Judas protestó diciendo que se podría haber vendido por trescientos denarios, casi el salario de un año de un trabajador. Pero Jesús la defendió. Para algunos fue un desperdicio; para María, nada era demasiado para su Señor. La adoración verdadera no calcula lo mínimo, derrama lo mejor.',
  'Seis dias antes da Páscoa, em Betânia, fizeram um jantar para Jesus. Maria pegou uma libra de nardo puro, de muito valor, ungiu os pés de Jesus e os enxugou com os seus cabelos. A casa se encheu do cheiro do perfume. Judas reclamou dizendo que poderia ter sido vendido por trezentos denários, quase o salário de um ano de um trabalhador. Mas Jesus a defendeu. Para alguns foi desperdício; para Maria, nada era demais para o seu Senhor. A adoração verdadeira não calcula o mínimo, derrama o melhor.',
  'Adorar es darle a Jesús lo mejor, aunque otros no lo entiendan.',
  'Adorar é dar a Jesus o melhor, mesmo que outros não entendam.',
  'Jo 12:3-7')
I('c-ado-luz','adoracao','natureza','Las plantas buscan la luz','As plantas buscam a luz',
  'Si se deja una planta en maceta junto a una ventana, en pocos días se nota que sus tallos y hojas se inclinan hacia el lado de donde viene la luz. Nadie la empujó: la planta crece orientada hacia lo que le da vida. Si se la gira, con el tiempo vuelve a inclinarse hacia la ventana. El corazón que adora funciona así. No se vuelve a Dios solo cuando alguien lo empuja en el culto, sino que se orienta hacia él naturalmente, porque sabe de dónde viene su vida. Los que miran a él son alumbrados.',
  'Se deixarmos um vaso de planta perto de uma janela, em poucos dias se percebe que os caules e as folhas se inclinam para o lado de onde vem a luz. Ninguém a empurrou: a planta cresce voltada para aquilo que lhe dá vida. Se o vaso for girado, com o tempo ela volta a se inclinar para a janela. O coração que adora funciona assim. Não se volta para Deus só quando alguém o empurra no culto, mas se orienta para ele naturalmente, porque sabe de onde vem a sua vida. Os que olham para ele são iluminados.',
  'Adorar es vivir orientado hacia Dios, la fuente de nuestra vida.',
  'Adorar é viver voltado para Deus, a fonte da nossa vida.',
  'Sl 34:5','Sl 16:8')
I('c-ado-afinar','adoracao','comparacao','Afinados por la misma nota','Afinados pela mesma nota',
  'Antes de un concierto, los músicos de una orquesta afinan sus instrumentos tomando como referencia la misma nota. Si cada uno afinara por su cuenta, el resultado sería un ruido desordenado, aunque todos fueran buenos músicos. Cuando todos se ajustan a la misma referencia, distintos instrumentos producen una sola música. En la adoración pasa algo parecido. Cada creyente tiene su voz, su historia y su manera de expresarse, pero la referencia no es el gusto personal, sino Dios mismo. Jesús dijo que el Padre busca adoradores que le adoren en espíritu y en verdad.',
  'Antes de um concerto, os músicos de uma orquestra afinam os instrumentos tomando como referência a mesma nota. Se cada um afinasse por conta própria, o resultado seria um barulho desordenado, mesmo que todos fossem bons músicos. Quando todos se ajustam à mesma referência, instrumentos diferentes produzem uma só música. Na adoração acontece algo parecido. Cada crente tem a sua voz, a sua história e o seu jeito de se expressar, mas a referência não é o gosto pessoal, e sim o próprio Deus. Jesus disse que o Pai procura adoradores que o adorem em espírito e em verdade.',
  'La adoración que agrada a Dios se afina por su verdad, no por nuestros gustos.',
  'A adoração que agrada a Deus se afina pela sua verdade, não pelos nossos gostos.',
  'Jo 4:23-24')
I('c-ado-david','adoracao','biblica','David danzaba con toda su fuerza','Davi dançava com todas as forças',
  'Cuando el arca del Señor fue llevada a Jerusalén, el rey David no se quedó en el palacio mirando desde la ventana. Se quitó las ropas reales, se vistió con un efod de lino y danzaba con toda su fuerza delante de Jehová, entre gritos de júbilo y sonido de trompetas. Su esposa Mical lo despreció por eso y le reprochó que se había humillado delante del pueblo. David respondió que lo hacía delante del Señor, que lo había elegido, y que estaba dispuesto a ser aún más humilde. Para él, la presencia de Dios valía más que la apariencia de rey.',
  'Quando a arca do Senhor foi levada para Jerusalém, o rei Davi não ficou no palácio olhando pela janela. Tirou as vestes reais, vestiu um éfode de linho e dançava com todas as forças diante do Senhor, entre gritos de alegria e som de trombetas. Sua esposa Mical o desprezou por isso e o repreendeu por ter se humilhado diante do povo. Davi respondeu que fazia aquilo diante do Senhor, que o tinha escolhido, e que estava disposto a se humilhar ainda mais. Para ele, a presença de Deus valia mais do que a aparência de rei.',
  'Quien valora la presencia de Dios no adora pensando en lo que otros dirán.',
  'Quem valoriza a presença de Deus não adora pensando no que os outros vão dizer.',
  '2Sm 6:14-15','2Sm 6:21-22')
I('c-ado-celular','adoracao','cotidiano','La visita y el celular','A visita e o celular',
  'Imagine que una persona muy querida viaja desde lejos para visitarlo. Usted la recibe en la sala, le sirve café, pero durante toda la visita no deja de mirar el celular, responde mensajes y apenas levanta la vista cuando ella habla. Al final usted dice: «Qué lindo que viniste». La visita se va sabiendo que estuvo en la casa, pero no en su corazón. Jesús citó al profeta Isaías: «Este pueblo de labios me honra; mas su corazón lejos está de mí». La adoración no es solo estar en el culto, sino estar presente delante de Dios.',
  'Imagine que uma pessoa muito querida viaja de longe para visitá-lo. Você a recebe na sala, serve um café, mas durante toda a visita não para de olhar o celular, responde mensagens e mal levanta os olhos quando ela fala. No final você diz: «Que bom que você veio». A visita vai embora sabendo que esteve na casa, mas não no seu coração. Jesus citou o profeta Isaías: «Este povo me honra com os lábios, mas o seu coração está longe de mim». Adoração não é só estar no culto, mas estar presente diante de Deus.',
  'Dios no busca solo nuestra asistencia, sino nuestra atención y nuestro corazón.',
  'Deus não busca só a nossa presença no culto, mas a nossa atenção e o nosso coração.',
  'Mt 15:8')

# ================================================================ discipulado
I('c-dis-aprendiz','discipulado','comparacao','El aprendiz del carpintero','O aprendiz do carpinteiro',
  'Antiguamente nadie aprendía un oficio solo con libros. El aprendiz pasaba años al lado del maestro carpintero: miraba cómo tomaba la herramienta, cómo medía dos veces antes de cortar, cómo corregía un error. Al principio solo barría el taller y alcanzaba las piezas. Con el tiempo empezaba a hacer trabajos pequeños bajo la mirada del maestro, hasta que un día podía enseñar a otro. Así es el discipulado. Jesús no solo dio clases: llamó a doce para que estuvieran con él. Y Pablo pidió a Timoteo que enseñara a hombres fieles que a su vez enseñaran a otros.',
  'Antigamente ninguém aprendia um ofício só com livros. O aprendiz passava anos ao lado do mestre carpinteiro: observava como ele segurava a ferramenta, como media duas vezes antes de cortar, como corrigia um erro. No começo só varria a oficina e alcançava as peças. Com o tempo começava a fazer trabalhos pequenos sob o olhar do mestre, até que um dia podia ensinar outro. Assim é o discipulado. Jesus não só deu aulas: chamou doze para que estivessem com ele. E Paulo pediu a Timóteo que ensinasse homens fiéis que também ensinassem outros.',
  'El discipulado se aprende caminando al lado de alguien y se completa enseñando a otros.',
  'O discipulado se aprende caminhando ao lado de alguém e se completa ensinando outros.',
  'Mc 3:14','2Tm 2:2')
I('c-dis-redes','discipulado','biblica','Dejando las redes','Deixando as redes',
  'Pedro y Andrés estaban trabajando, echando la red en el mar de Galilea. Era su oficio, su sustento y su seguridad. Jesús pasó y les dijo: «Venid en pos de mí, y os haré pescadores de hombres». La Biblia dice que ellos, dejando luego las redes, le siguieron. Un poco más adelante, Jacobo y Juan dejaron la barca y a su padre. No sabían todo lo que vendría, pero sabían a quién seguían. Ser discípulo comienza cuando Jesús deja de ser un tema interesante y pasa a ser el Señor que define nuestro camino.',
  'Pedro e André estavam trabalhando, lançando a rede no mar da Galileia. Era o seu ofício, o seu sustento e a sua segurança. Jesus passou e lhes disse: «Vinde após mim, e eu vos farei pescadores de homens». A Bíblia diz que eles, deixando imediatamente as redes, o seguiram. Um pouco adiante, Tiago e João deixaram o barco e o pai. Não sabiam tudo o que viria, mas sabiam a quem estavam seguindo. Ser discípulo começa quando Jesus deixa de ser um assunto interessante e passa a ser o Senhor que define o nosso caminho.',
  'Seguir a Jesús implica dejar algo atrás para ir tras él.',
  'Seguir Jesus implica deixar algo para trás para ir após ele.',
  'Mt 4:19-22')
I('c-dis-tutor','discipulado','comparacao','El tutor de la planta','O tutor da muda',
  'Quien planta un arbolito joven suele clavar a su lado una estaca y atar el tallo con cuidado. Ese tutor no es para siempre, pero en los primeros tiempos evita que el viento lo quiebre o lo deje torcido. Mientras tanto, las raíces van profundizando. Cuando el árbol ya está firme, la estaca se retira y él sigue creciendo derecho. Los nuevos creyentes necesitan algo parecido: alguien que camine cerca, ore, enseñe la Palabra y ayude en los primeros vientos. El objetivo es que estén arraigados y sobreedificados en Cristo, firmes en la fe.',
  'Quem planta uma árvore jovem costuma fincar ao lado uma estaca e amarrar o caule com cuidado. Esse tutor não é para sempre, mas nos primeiros tempos evita que o vento quebre a muda ou a deixe torta. Enquanto isso, as raízes vão se aprofundando. Quando a árvore já está firme, a estaca é retirada e ela continua crescendo reta. Os novos crentes precisam de algo parecido: alguém que caminhe perto, ore, ensine a Palavra e ajude nos primeiros ventos. O objetivo é que estejam enraizados e edificados em Cristo, firmes na fé.',
  'Acompañar a un nuevo creyente en sus primeros pasos ayuda a que crezca firme y derecho.',
  'Acompanhar um novo crente nos primeiros passos ajuda a que ele cresça firme e reto.',
  'Cl 2:6-7')
I('c-dis-pisadas','discipulado','cotidiano','Pisando en las huellas','Pisando nas pegadas',
  'Imagine a un padre caminando por la arena de la playa con su hijo pequeño detrás. El niño se divierte poniendo sus pies exactamente en las huellas que deja el padre. Tiene que estirar las piernas, a veces se tambalea, pero no pierde el camino porque sigue las marcas que van delante. Pedro escribió que Cristo nos dejó ejemplo para que sigamos sus pisadas. Y Pablo se atrevió a decir: «Sed imitadores de mí, así como yo de Cristo». El discípulo no inventa su propio camino; aprende a poner los pies donde Jesús los puso.',
  'Imagine um pai andando pela areia da praia com o filho pequeno atrás. A criança se diverte colocando os pés exatamente nas pegadas que o pai deixa. Precisa esticar as pernas, às vezes cambaleia, mas não perde o caminho porque segue as marcas que vão à frente. Pedro escreveu que Cristo nos deixou exemplo para que sigamos os seus passos. E Paulo se atreveu a dizer: «Sede meus imitadores, como também eu sou de Cristo». O discípulo não inventa o próprio caminho; aprende a colocar os pés onde Jesus os colocou.',
  'Ser discípulo es seguir las pisadas de Jesús, aunque a veces cueste el paso.',
  'Ser discípulo é seguir os passos de Jesus, mesmo quando o passo custa.',
  '1Pe 2:21','1Co 11:1')
I('c-dis-torre','discipulado','biblica','Calcular el costo','Calcular o custo',
  'Mucha gente seguía a Jesús por los caminos, y él se volvió para hablarles con claridad. Les preguntó quién de ellos, queriendo edificar una torre, no se sienta primero a calcular los gastos para ver si tiene lo necesario. Porque si pone el cimiento y no puede terminarla, todos se burlarán diciendo: «Este hombre comenzó a edificar, y no pudo acabar». Jesús no escondió el precio del discipulado para conseguir más seguidores. Invitó a seguirlo con los ojos abiertos, sabiendo que él vale más que todo lo que se deja atrás.',
  'Muita gente seguia Jesus pelos caminhos, e ele se voltou para falar com clareza. Perguntou quem deles, querendo construir uma torre, não se senta primeiro para calcular as despesas e ver se tem o necessário. Porque, se lançar o alicerce e não puder terminá-la, todos zombarão dizendo: «Este homem começou a construir e não pôde acabar». Jesus não escondeu o preço do discipulado para conseguir mais seguidores. Convidou a segui-lo com os olhos abertos, sabendo que ele vale mais do que tudo o que se deixa para trás.',
  'Seguir a Cristo cuesta, pero quien conoce su valor sabe que vale la pena.',
  'Seguir Cristo custa, mas quem conhece o seu valor sabe que vale a pena.',
  'Lc 14:27-30')

# ================================================================ lingua
I('c-len-timon','lingua','comparacao','El timón del barco','O leme do navio',
  'Un barco grande puede pesar miles de toneladas y ser empujado por vientos fuertes. Sin embargo, la dirección que toma depende de una pieza relativamente pequeña en la parte de atrás: el timón. Quien gobierna el timón gobierna el rumbo. Santiago usa esta imagen para hablar de la lengua. Es un miembro pequeño, pero las palabras que decimos van definiendo el rumbo de una familia, de una amistad, de una iglesia y de nuestra propia vida. Por eso quien aprende a gobernar su lengua, con la ayuda de Dios, aprende a gobernar mucho más.',
  'Um navio grande pode pesar milhares de toneladas e ser empurrado por ventos fortes. No entanto, a direção que ele toma depende de uma peça relativamente pequena na parte de trás: o leme. Quem governa o leme governa o rumo. Tiago usa essa imagem para falar da língua. É um membro pequeno, mas as palavras que dizemos vão definindo o rumo de uma família, de uma amizade, de uma igreja e da nossa própria vida. Por isso quem aprende a governar a língua, com a ajuda de Deus, aprende a governar muito mais.',
  'Las palabras pequeñas definen rumbos grandes.',
  'Palavras pequenas definem rumos grandes.',
  'Tg 3:4-5')
I('c-len-pasta','lingua','comparacao','La pasta de dientes','A pasta de dente',
  'Es muy fácil apretar un tubo de pasta de dientes y sacar todo el contenido. Lo difícil, casi imposible, es volver a meterlo en el tubo. Con las palabras pasa algo parecido. En un momento de enojo salen frases que hieren, críticas exageradas o comentarios sobre la vida de otros. Después pedimos perdón, y debemos hacerlo, pero lo dicho ya fue escuchado y a veces repetido. Por eso la Biblia aconseja ser pronto para oír y tardo para hablar, y que ninguna palabra corrompida salga de nuestra boca, sino la que sea buena para edificación.',
  'É muito fácil apertar um tubo de pasta de dente e tirar todo o conteúdo. O difícil, quase impossível, é colocá-lo de volta no tubo. Com as palavras acontece algo parecido. Num momento de raiva saem frases que ferem, críticas exageradas ou comentários sobre a vida dos outros. Depois pedimos perdão, e devemos fazê-lo, mas o que foi dito já foi ouvido e às vezes repetido. Por isso a Bíblia aconselha ser pronto para ouvir e tardio para falar, e que nenhuma palavra torpe saia da nossa boca, mas só a que for boa para edificação.',
  'Antes de hablar, conviene pensar que las palabras no vuelven al tubo.',
  'Antes de falar, convém pensar que as palavras não voltam para o tubo.',
  'Tg 1:19','Ef 4:29')
I('c-len-chispa','lingua','natureza','Una chispa en el pastizal','Uma faísca no capim',
  'En época de sequía, una sola chispa puede iniciar un incendio que consume hectáreas de campo. A veces todo empieza con una brasa mal apagada o con una quema que se descontroló. El fuego avanza con el viento, salta de un lugar a otro y es mucho más difícil de apagar que de encender. Santiago escribe: «He aquí, un pequeño fuego ¡cuán grande bosque enciende!». Un chisme, una burla o una media verdad pueden encender divisiones que llevan años sanar. La prudencia con las palabras es una forma de cuidar a los demás.',
  'Em época de seca, uma única faísca pode começar um incêndio que consome hectares de campo. Às vezes tudo começa com uma brasa mal apagada ou com uma queimada que saiu do controle. O fogo avança com o vento, salta de um lugar para outro e é muito mais difícil de apagar do que de acender. Tiago escreve: «Vede quão grande bosque um pequeno fogo incendeia». Uma fofoca, uma zombaria ou uma meia verdade podem acender divisões que levam anos para sarar. A prudência com as palavras é uma forma de cuidar dos outros.',
  'Una palabra descuidada puede encender un fuego que otros tendrán que apagar.',
  'Uma palavra descuidada pode acender um fogo que outros terão de apagar.',
  'Tg 3:5-6','Pv 26:20')
I('c-len-abigail','lingua','biblica','Las palabras de Abigail','As palavras de Abigail',
  'Nabal había respondido con desprecio a los hombres de David, y David, enojado, salió con cuatrocientos hombres armados para vengarse. Abigail, la esposa de Nabal, se enteró y salió a su encuentro con alimentos. Se postró delante de David y le habló con humildad y sabiduría, recordándole que no le convenía derramar sangre ni vengarse por su propia mano. David respondió: «Bendito sea Jehová Dios de Israel, que te envió para que hoy me encontrases, y bendito sea tu razonamiento». Unas palabras sabias evitaron una tragedia.',
  'Nabal tinha respondido com desprezo aos homens de Davi, e Davi, irado, saiu com quatrocentos homens armados para se vingar. Abigail, mulher de Nabal, soube do caso e foi ao seu encontro levando alimentos. Prostrou-se diante de Davi e lhe falou com humildade e sabedoria, lembrando-lhe que não lhe convinha derramar sangue nem se vingar com a própria mão. Davi respondeu: «Bendito seja o Senhor, Deus de Israel, que hoje te enviou ao meu encontro, e bendita seja a tua prudência». Algumas palavras sábias evitaram uma tragédia.',
  'Una palabra blanda y sabia puede apagar la ira y evitar grandes males.',
  'Uma palavra branda e sábia pode apagar a ira e evitar grandes males.',
  '1Sm 25:32-33','Pv 15:1')
I('c-len-hijo','lingua','cotidiano','Lo que el hijo escuchó','O que o filho ouviu',
  'Imagine a un niño que derrama la leche en la mesa y escucha de su padre, cansado: «Vos no servís para nada». El padre se olvida de la frase al rato. El niño no. Años después, ya adulto, cada vez que se equivoca en el trabajo, esa voz vuelve a sonar adentro. Ahora imagine que en otra casa, frente a la misma leche derramada, el padre dice: «Tranquilo, limpiemos juntos; la próxima vez lo vas a lograr». Proverbios dice que hay quienes hablan como golpes de espada, pero la lengua de los sabios es medicina.',
  'Imagine um menino que derrama o leite na mesa e ouve do pai, cansado: «Você não serve para nada». O pai esquece a frase pouco depois. O menino não. Anos mais tarde, já adulto, cada vez que erra no trabalho, aquela voz volta a soar por dentro. Agora imagine que em outra casa, diante do mesmo leite derramado, o pai diz: «Calma, vamos limpar juntos; da próxima vez você vai conseguir». Provérbios diz que há quem fale como pontas de espada, mas a língua dos sábios é saúde.',
  'Nuestras palabras pueden herir por años o sanar por años.',
  'As nossas palavras podem ferir por anos ou curar por anos.',
  'Pv 12:18')

# ================================================================ ansiedade
I('c-ans-aves','ansiedade','biblica','Mirad las aves','Olhai as aves',
  'En el Sermón del Monte, Jesús habló a gente sencilla que se preocupaba por la comida del día y por la ropa. Señaló las aves del cielo, que no siembran ni siegan ni guardan en graneros, y dijo que el Padre celestial las alimenta. Luego mostró los lirios del campo, que no trabajan ni hilan, y sin embargo están vestidos con más belleza que Salomón. Su conclusión fue clara: si Dios cuida así de las aves y de la hierba, cuánto más de sus hijos. Por eso no os afanéis por el día de mañana, porque cada día tiene su propio afán.',
  'No Sermão do Monte, Jesus falou a gente simples que se preocupava com a comida do dia e com a roupa. Apontou para as aves do céu, que não semeiam, não colhem nem ajuntam em celeiros, e disse que o Pai celestial as alimenta. Depois mostrou os lírios do campo, que não trabalham nem fiam, e mesmo assim estão vestidos com mais beleza do que Salomão. A sua conclusão foi clara: se Deus cuida assim das aves e da erva, quanto mais dos seus filhos. Por isso não vos inquieteis com o dia de amanhã, pois cada dia tem o seu próprio mal.',
  'El Padre que alimenta a las aves no se olvida de sus hijos.',
  'O Pai que alimenta as aves não se esquece dos seus filhos.',
  'Mt 6:26','Mt 6:34')
I('c-ans-mecedora','ansiedade','comparacao','La mecedora','A cadeira de balanço',
  'La preocupación se parece a una mecedora: nos mantiene ocupados todo el tiempo, nos da la sensación de que estamos haciendo algo, pero no nos lleva a ningún lugar. Podemos pasar la noche entera meciéndonos en los mismos pensamientos y llegar a la mañana cansados y en el mismo punto. Jesús preguntó: «¿Quién de vosotros podrá, por mucho que se afane, añadir a su estatura un codo?». Él no nos pide que seamos irresponsables, sino que cambiemos la mecedora de la preocupación por el lugar de la oración, donde dejamos la carga en manos de Dios.',
  'A preocupação se parece com uma cadeira de balanço: mantém a gente ocupado o tempo todo, dá a sensação de que estamos fazendo alguma coisa, mas não nos leva a lugar nenhum. Podemos passar a noite inteira balançando nos mesmos pensamentos e chegar à manhã cansados e no mesmo ponto. Jesus perguntou: «Qual de vós, por mais ansioso que esteja, pode acrescentar um côvado à sua estatura?». Ele não nos pede que sejamos irresponsáveis, mas que troquemos a cadeira de balanço da preocupação pelo lugar da oração, onde deixamos a carga nas mãos de Deus.',
  'Preocuparse mucho no resuelve nada; orar pone el problema en las manos correctas.',
  'Preocupar-se muito não resolve nada; orar coloca o problema nas mãos certas.',
  'Mt 6:27','Fp 4:6')
I('c-ans-maleta','ansiedade','cotidiano','La maleta en las rodillas','A mala no colo',
  'Imagine a un pasajero que sube a un ómnibus de larga distancia con una maleta pesada. El conductor le dice que puede dejarla en el portaequipajes, pero él prefiere llevarla sobre las rodillas todo el viaje. Llega a destino con las piernas adormecidas y la espalda dolorida, y la maleta llegó igual que habría llegado abajo. Muchos creyentes viajan así con sus preocupaciones: ya oraron, pero las siguen cargando. Pedro escribió: «Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros». Echar es soltar la carga y dejarla donde Dios la puede llevar.',
  'Imagine um passageiro que entra num ônibus de viagem longa com uma mala pesada. O motorista diz que ele pode deixá-la no bagageiro, mas ele prefere levá-la no colo a viagem inteira. Chega ao destino com as pernas dormentes e as costas doendo, e a mala chegou do mesmo jeito que teria chegado lá embaixo. Muitos crentes viajam assim com as suas preocupações: já oraram, mas continuam carregando. Pedro escreveu: «Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós». Lançar é soltar a carga e deixá-la onde Deus pode levá-la.',
  'Orar es entregar la carga, no seguir cargándola después del amén.',
  'Orar é entregar a carga, não continuar carregando depois do amém.',
  '1Pe 5:7')
I('c-ans-elias','ansiedade','biblica','Elías debajo del enebro','Elias debaixo do zimbro',
  'Elías acababa de ver fuego del cielo en el monte Carmelo, pero cuando Jezabel lo amenazó, huyó por su vida. Caminó un día entero por el desierto, se sentó debajo de un enebro y pidió morir: «Basta ya, oh Jehová». Agotado, se durmió. Dios no lo reprendió en ese momento. Un ángel lo tocó y le dijo: «Levántate, come». Había una torta cocida y una vasija de agua. Comió, bebió y volvió a dormir, y el ángel vino otra vez. Con la fuerza de aquella comida caminó cuarenta días. A veces la primera respuesta de Dios a la angustia es cuidado, descanso y pan.',
  'Elias tinha acabado de ver fogo do céu no monte Carmelo, mas quando Jezabel o ameaçou, fugiu para salvar a vida. Caminhou um dia inteiro pelo deserto, sentou-se debaixo de um zimbro e pediu para morrer: «Já basta, ó Senhor». Exausto, adormeceu. Deus não o repreendeu naquele momento. Um anjo o tocou e lhe disse: «Levanta-te e come». Havia um pão cozido e uma botija de água. Ele comeu, bebeu e voltou a dormir, e o anjo veio outra vez. Com a força daquela comida caminhou quarenta dias. Às vezes a primeira resposta de Deus à angústia é cuidado, descanso e pão.',
  'Dios cuida del cuerpo cansado antes de hablar al corazón angustiado.',
  'Deus cuida do corpo cansado antes de falar ao coração angustiado.',
  '1Rs 19:4-8')
I('c-ans-pronostico','ansiedade','comparacao','Mojarse con la lluvia de mañana','Molhar-se com a chuva de amanhã',
  'Sería extraño ver a alguien abrir el paraguas dentro de la casa, en un día de sol, porque el pronóstico dijo que tal vez llueva el jueves. Sin embargo, muchas veces hacemos eso con la ansiedad: sufrimos hoy por problemas que todavía no llegaron y que quizás nunca lleguen. Gastamos las fuerzas de hoy peleando las batallas de la semana que viene. Jesús dijo que cada día tiene su propio afán. Dios da la gracia para el día que estamos viviendo; la fuerza para mañana vendrá mañana, junto con el problema, si es que llega.',
  'Seria estranho ver alguém abrir o guarda-chuva dentro de casa, num dia de sol, porque a previsão disse que talvez chova na quinta-feira. No entanto, muitas vezes fazemos isso com a ansiedade: sofremos hoje por problemas que ainda não chegaram e que talvez nunca cheguem. Gastamos as forças de hoje lutando as batalhas da semana que vem. Jesus disse que cada dia tem o seu próprio mal. Deus dá a graça para o dia que estamos vivendo; a força para amanhã virá amanhã, junto com o problema, se é que ele vier.',
  'La gracia de Dios alcanza para hoy; mañana tendrá la suya.',
  'A graça de Deus é suficiente para hoje; amanhã terá a sua.',
  'Mt 6:34','Lm 3:22-23')

# ================================================================ ceu
I('c-cie-ciudadania','ceu','comparacao','Ciudadanos de otra patria','Cidadãos de outra pátria',
  'Quien vive en el extranjero puede trabajar, pagar impuestos y tener amigos en el país donde está, pero lleva en el bolsillo el documento de otra nación. Habla con acento distinto, sigue las noticias de su tierra y sueña con volver. Pablo escribió a los filipenses, que vivían en una ciudad orgullosa de su relación con Roma, que nuestra ciudadanía está en los cielos, de donde esperamos al Salvador. El creyente vive con responsabilidad en este mundo, pero no se siente dueño de él. Su documento verdadero dice: ciudadano del cielo.',
  'Quem vive no exterior pode trabalhar, pagar impostos e ter amigos no país onde está, mas leva no bolso o documento de outra nação. Fala com outro sotaque, acompanha as notícias da sua terra e sonha em voltar. Paulo escreveu aos filipenses, que moravam numa cidade orgulhosa da sua ligação com Roma, que a nossa cidadania está nos céus, de onde esperamos o Salvador. O crente vive com responsabilidade neste mundo, mas não se sente dono dele. O seu documento verdadeiro diz: cidadão do céu.',
  'Vivimos aquí con responsabilidad, pero nuestra patria verdadera está en el cielo.',
  'Vivemos aqui com responsabilidade, mas a nossa pátria verdadeira está no céu.',
  'Fp 3:20','Hb 11:16')
I('c-cie-casa','ceu','comparacao','La casa preparada','A casa preparada',
  'Cuando un hijo que vive lejos avisa que va a volver, la madre empieza días antes a preparar todo: cambia la ropa de la cama, cocina la comida que a él le gusta y deja la luz de la entrada encendida. El hijo todavía está viajando, pero ya hay un lugar listo esperándolo. Jesús usó una imagen de casa cuando consoló a sus discípulos: «En la casa de mi Padre muchas moradas hay… voy, pues, a preparar lugar para vosotros». La esperanza del cielo no es un lugar frío y desconocido, sino la casa del Padre, preparada por el Hijo.',
  'Quando um filho que mora longe avisa que vai voltar, a mãe começa dias antes a preparar tudo: troca a roupa de cama, cozinha a comida de que ele gosta e deixa a luz da entrada acesa. O filho ainda está viajando, mas já há um lugar pronto esperando por ele. Jesus usou uma imagem de casa quando consolou os discípulos: «Na casa de meu Pai há muitas moradas… vou preparar-vos lugar». A esperança do céu não é um lugar frio e desconhecido, mas a casa do Pai, preparada pelo Filho.',
  'El cielo es la casa del Padre, donde Jesús nos preparó lugar.',
  'O céu é a casa do Pai, onde Jesus nos preparou lugar.',
  'Jo 14:2-3')
I('c-cie-semilla','ceu','natureza','La semilla y la planta','A semente e a planta',
  'Si alguien que nunca vio una planta mirara una semilla de girasol, no imaginaría jamás lo que puede salir de ella. La semilla es pequeña, seca y sin belleza. Se entierra, desaparece de la vista y parece perdida. Pero de ella brota un tallo alto con una flor grande, muy distinta de lo que se sembró. Pablo usa esta imagen para hablar de la resurrección del cuerpo: se siembra en corrupción, resucitará en incorrupción; se siembra en debilidad, resucitará en poder. Lo que se entierra con lágrimas, Dios lo levantará con gloria.',
  'Se alguém que nunca viu uma planta olhasse para uma semente de girassol, jamais imaginaria o que pode sair dela. A semente é pequena, seca e sem beleza. É enterrada, some de vista e parece perdida. Mas dela brota um caule alto com uma flor grande, muito diferente do que foi semeado. Paulo usa essa imagem para falar da ressurreição do corpo: semeia-se em corrupção, ressuscitará em incorrupção; semeia-se em fraqueza, ressuscitará em poder. O que é enterrado com lágrimas, Deus levantará com glória.',
  'La resurrección es la promesa de que la tumba no es el final para el creyente.',
  'A ressurreição é a promessa de que o túmulo não é o fim para o crente.',
  '1Co 15:42-44')
I('c-cie-lagrimas','ceu','biblica','Ya no habrá llanto','Não haverá mais choro',
  'Juan, anciano y desterrado en la isla de Patmos, recibió una visión del final de la historia. Vio un cielo nuevo y una tierra nueva, y la santa ciudad descendiendo de Dios. Oyó una gran voz que decía que el tabernáculo de Dios estaría con los hombres. Y entonces vino una de las frases más consoladoras de la Biblia: «Limpiará Dios toda lágrima de los ojos de ellos; y la muerte no será más; y no habrá más llanto, ni clamor, ni dolor». En un mundo donde todos hemos llorado, Dios promete un día en que él mismo secará cada lágrima.',
  'João, idoso e exilado na ilha de Patmos, recebeu uma visão do final da história. Viu um novo céu e uma nova terra, e a santa cidade descendo de Deus. Ouviu uma grande voz que dizia que o tabernáculo de Deus estaria com os homens. E então veio uma das frases mais consoladoras da Bíblia: «Deus enxugará dos olhos deles toda lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor». Num mundo onde todos já choramos, Deus promete um dia em que ele mesmo enxugará cada lágrima.',
  'La esperanza del cielo sostiene al creyente en medio de las lágrimas de hoy.',
  'A esperança do céu sustenta o crente no meio das lágrimas de hoje.',
  'Ap 21:1-4')
I('c-cie-estudiante','ceu','cotidiano','Contando los días para volver','Contando os dias para voltar',
  'Imagine a un joven del interior que se fue a estudiar a la capital. Vive en una pensión, tiene compañeros y se esfuerza en la facultad, pero en la pared de su cuarto hay un calendario donde tacha cada día que pasa. Sabe que, al final del semestre, va a volver a casa. Eso no lo hace perezoso en los estudios; al contrario, le da fuerzas para seguir. Así vive el creyente. Trabaja, sirve y ama en este mundo, pero sabe que está de paso. La certeza de volver a casa le da ánimo para ser fiel hasta el final.',
  'Imagine um jovem do interior que foi estudar na capital. Mora numa pensão, tem colegas e se esforça na faculdade, mas na parede do quarto há um calendário onde ele risca cada dia que passa. Sabe que, no fim do semestre, vai voltar para casa. Isso não o deixa preguiçoso nos estudos; ao contrário, lhe dá forças para continuar. Assim vive o crente. Trabalha, serve e ama neste mundo, mas sabe que está de passagem. A certeza de voltar para casa lhe dá ânimo para ser fiel até o fim.',
  'Saber que vamos a casa nos da fuerzas para ser fieles en el camino.',
  'Saber que estamos indo para casa nos dá forças para ser fiéis no caminho.',
  '2Co 5:6-9')

# ================================================================ cruz
I('c-cru-sustituto','cruz','cotidiano','Otro pagó en mi lugar','Outro pagou no meu lugar',
  'Imagine a un hombre condenado por una deuda enorme que nunca podría pagar. El día del juicio, cuando el juez está por dictar la sentencia, alguien se levanta en la sala, se acerca y dice: «Yo pago todo lo que él debe». El juez no finge que la deuda no existe; la deuda es real y alguien la paga por completo. El hombre sale libre, no porque fuera inocente, sino porque otro tomó su lugar. Isaías lo profetizó siglos antes de la cruz: «Él herido fue por nuestras rebeliones… y por su llaga fuimos nosotros curados».',
  'Imagine um homem condenado por uma dívida enorme que nunca conseguiria pagar. No dia do julgamento, quando o juiz está para pronunciar a sentença, alguém se levanta na sala, se aproxima e diz: «Eu pago tudo o que ele deve». O juiz não finge que a dívida não existe; a dívida é real e alguém a paga por completo. O homem sai livre, não porque fosse inocente, mas porque outro tomou o seu lugar. Isaías profetizou isso séculos antes da cruz: «Ele foi ferido por causa das nossas transgressões… e pelas suas feridas fomos sarados».',
  'En la cruz, Cristo tomó nuestro lugar y pagó lo que nosotros debíamos.',
  'Na cruz, Cristo tomou o nosso lugar e pagou o que nós devíamos.',
  'Is 53:5','2Co 5:21')
I('c-cru-pascua','cruz','biblica','La sangre en los dinteles','O sangue nos umbrais',
  'La noche en que Dios iba a herir a los primogénitos de Egipto, cada familia israelita debía sacrificar un cordero sin defecto y poner su sangre en los dos postes y en el dintel de la puerta. No bastaba con ser buena persona ni con tener miedo. Dios dijo: «Veré la sangre y pasaré de vosotros». Las casas protegidas no eran las más bonitas, sino las que estaban marcadas por la sangre del cordero. Siglos después, Pablo escribió: «Nuestra pascua, que es Cristo, fue sacrificada por nosotros». La salvación está en la sangre de Jesús.',
  'Na noite em que Deus ia ferir os primogênitos do Egito, cada família israelita devia sacrificar um cordeiro sem defeito e colocar o seu sangue nos dois umbrais e na verga da porta. Não bastava ser boa pessoa nem ter medo. Deus disse: «Vendo eu o sangue, passarei por cima de vós». As casas protegidas não eram as mais bonitas, mas as que estavam marcadas pelo sangue do cordeiro. Séculos depois, Paulo escreveu: «Cristo, nossa Páscoa, foi sacrificado por nós». A salvação está no sangue de Jesus.',
  'Lo que nos protege del juicio no son nuestros méritos, sino la sangre del Cordero.',
  'O que nos protege do juízo não são os nossos méritos, mas o sangue do Cordeiro.',
  'Ex 12:13','1Co 5:7')
I('c-cru-velo','cruz','biblica','El velo rasgado','O véu rasgado',
  'En el templo de Jerusalén había un velo que separaba el lugar santísimo. Solo el sumo sacerdote podía entrar allí, una vez al año, y no sin sangre. Ese velo enseñaba que el pecado separa al hombre de la presencia de Dios. Cuando Jesús clamó en la cruz y entregó el espíritu, la Biblia dice que el velo del templo se rasgó en dos, de arriba abajo. No lo rasgó una mano humana desde abajo, sino Dios desde arriba. La carta a los Hebreos explica que ahora tenemos libertad para entrar al santuario por la sangre de Jesús, por el camino nuevo y vivo.',
  'No templo de Jerusalém havia um véu que separava o lugar santíssimo. Só o sumo sacerdote podia entrar ali, uma vez por ano, e não sem sangue. Esse véu ensinava que o pecado separa o homem da presença de Deus. Quando Jesus clamou na cruz e entregou o espírito, a Bíblia diz que o véu do templo se rasgou em dois, de alto a baixo. Não foi uma mão humana que o rasgou de baixo, mas Deus de cima. A carta aos Hebreus explica que agora temos liberdade para entrar no santuário pelo sangue de Jesus, pelo novo e vivo caminho.',
  'Por la cruz, el camino a la presencia de Dios quedó abierto para todos los que creen.',
  'Pela cruz, o caminho para a presença de Deus ficou aberto para todos os que creem.',
  'Mt 27:50-51','Hb 10:19-20')
I('c-cru-rescate','cruz','comparacao','El precio del rescate','O preço do resgate',
  'En tiempos antiguos, cuando alguien caía prisionero o era vendido como esclavo, podía ser liberado si alguien pagaba por él un rescate. El preso no tenía cómo comprar su propia libertad; dependía de que otro pagara el precio. Jesús usó esta palabra para explicar su misión: el Hijo del Hombre no vino para ser servido, sino para servir y dar su vida en rescate por muchos. Pedro agregó que no fuimos rescatados con oro ni plata, sino con la sangre preciosa de Cristo. La libertad del creyente costó la vida del Hijo de Dios.',
  'Nos tempos antigos, quando alguém era feito prisioneiro ou vendido como escravo, podia ser libertado se alguém pagasse por ele um resgate. O preso não tinha como comprar a própria liberdade; dependia de outro pagar o preço. Jesus usou essa palavra para explicar a sua missão: o Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate de muitos. Pedro acrescentou que não fomos resgatados com ouro ou prata, mas com o precioso sangue de Cristo. A liberdade do crente custou a vida do Filho de Deus.',
  'Fuimos liberados a un precio altísimo: la vida de Jesús.',
  'Fomos libertados por um preço altíssimo: a vida de Jesus.',
  'Mc 10:45','1Pe 1:18-19')
I('c-cru-consumado','cruz','biblica','Consumado es','Está consumado',
  'Después de horas de sufrimiento en la cruz, Jesús tomó el vinagre y dijo: «Consumado es». Y, habiendo inclinado la cabeza, entregó el espíritu. No fue el grito de alguien derrotado que no pudo terminar su obra, sino la declaración de que la había completado. Todo lo que hacía falta para nuestra salvación estaba hecho. Por eso la carta a los Hebreos dice que Cristo, habiendo ofrecido una sola vez un sacrificio por los pecados, se sentó a la diestra de Dios. Nadie necesita agregar nada a la cruz; solo recibir por fe lo que Jesús terminó.',
  'Depois de horas de sofrimento na cruz, Jesus tomou o vinagre e disse: «Está consumado». E, inclinando a cabeça, entregou o espírito. Não foi o grito de alguém derrotado que não conseguiu terminar a sua obra, mas a declaração de que a tinha completado. Tudo o que era necessário para a nossa salvação estava feito. Por isso a carta aos Hebreus diz que Cristo, tendo oferecido um único sacrifício pelos pecados, assentou-se à direita de Deus. Ninguém precisa acrescentar nada à cruz; só receber pela fé o que Jesus terminou.',
  'La obra de la salvación está completa; se recibe por fe, no se completa con esfuerzo.',
  'A obra da salvação está completa; é recebida pela fé, não completada com esforço.',
  'Jo 19:30','Hb 10:12')

# ================================================================ evangelismo
I('c-eva-pan','evangelismo','comparacao','Mostrar dónde hay pan','Mostrar onde há pão',
  'Imaginemos a alguien que pasó días con hambre y finalmente encontró un lugar donde reparten pan gratis. Al salir, ve a otros con la misma necesidad por la calle. No necesita ser un gran orador ni un experto en nutrición para ayudarlos; basta con contar lo que encontró y llevarlos hasta la puerta. Evangelizar no es mostrarse superior a nadie. Es un necesitado que encontró gracia contándole a otro necesitado dónde la encontró. Andrés, apenas conoció a Jesús, fue a buscar a su hermano Simón y lo trajo a Jesús.',
  'Imaginemos alguém que passou dias com fome e finalmente encontrou um lugar onde distribuem pão de graça. Ao sair, vê outros com a mesma necessidade pela rua. Não precisa ser um grande orador nem um especialista em nutrição para ajudá-los; basta contar o que encontrou e levá-los até a porta. Evangelizar não é se mostrar superior a ninguém. É um necessitado que encontrou graça contando a outro necessitado onde a encontrou. André, assim que conheceu Jesus, foi procurar o seu irmão Simão e o levou a Jesus.',
  'Evangelizar es contar a otros dónde encontramos el pan de vida.',
  'Evangelizar é contar aos outros onde encontramos o pão da vida.',
  'Jo 1:41-42','Jo 6:35')
I('c-eva-faro','evangelismo','comparacao','El faro en la costa','O farol na costa',
  'Un faro no corre detrás de los barcos ni hace discursos. Simplemente está en su lugar y brilla, noche tras noche, mostrando a los navegantes dónde están las rocas y cuál es el camino seguro al puerto. Si un día el faro se apaga para ahorrar energía, el mar no se vuelve más seguro; se vuelve más peligroso. Jesús dijo: «Vosotros sois la luz del mundo». La vida del creyente, su manera de trabajar, de tratar a la familia y de enfrentar las pruebas, es una luz que señala el camino a Cristo, mucho antes de que pronunciemos una palabra.',
  'Um farol não corre atrás dos barcos nem faz discursos. Simplesmente fica no seu lugar e brilha, noite após noite, mostrando aos navegantes onde estão as rochas e qual é o caminho seguro para o porto. Se um dia o farol se apaga para economizar energia, o mar não fica mais seguro; fica mais perigoso. Jesus disse: «Vós sois a luz do mundo». A vida do crente, a sua maneira de trabalhar, de tratar a família e de enfrentar as provas, é uma luz que aponta o caminho para Cristo, muito antes de dizermos uma palavra.',
  'Nuestra vida diaria es la primera predicación que muchos van a escuchar.',
  'A nossa vida diária é a primeira pregação que muitos vão ouvir.',
  'Mt 5:14-16')
I('c-eva-felipe','evangelismo','biblica','Felipe en el camino del desierto','Filipe no caminho do deserto',
  'Felipe estaba en medio de un avivamiento en Samaria cuando un ángel le dijo que fuera al camino desierto que baja de Jerusalén a Gaza. Allí pasaba un funcionario etíope en su carro, leyendo al profeta Isaías. El Espíritu dijo a Felipe que se acercara. Felipe corrió y preguntó: «¿Entiendes lo que lees?». El hombre respondió: «¿Y cómo podré, si alguno no me enseñare?». Felipe subió al carro y, comenzando desde esa escritura, le anunció el evangelio de Jesús. Ese mismo día aquel hombre fue bautizado y siguió su camino gozoso.',
  'Filipe estava no meio de um avivamento em Samaria quando um anjo lhe disse que fosse ao caminho deserto que desce de Jerusalém para Gaza. Ali passava um oficial etíope no seu carro, lendo o profeta Isaías. O Espírito disse a Filipe que se aproximasse. Filipe correu e perguntou: «Entendes o que lês?». O homem respondeu: «Como poderei entender, se alguém não me ensinar?». Filipe subiu no carro e, começando por aquela escritura, anunciou-lhe o evangelho de Jesus. Naquele mesmo dia aquele homem foi batizado e seguiu o seu caminho cheio de alegria.',
  'El Espíritu Santo prepara encuentros; nosotros debemos estar dispuestos a acercarnos.',
  'O Espírito Santo prepara encontros; nós precisamos estar dispostos a nos aproximar.',
  'At 8:26-30','At 8:35')
I('c-eva-samaritana','evangelismo','biblica','La mujer que dejó el cántaro','A mulher que deixou o cântaro',
  'La mujer samaritana fue al pozo al mediodía y encontró a Jesús sentado allí, cansado del camino. Él le habló de agua viva y le mostró que conocía toda su vida, y aun así no la rechazó. Ella dejó su cántaro, fue a la ciudad y dijo a la gente: «Venid, ved a un hombre que me ha dicho todo lo que he hecho; ¿no será este el Cristo?». No era teóloga ni tenía buena reputación, pero contó lo que Jesús hizo con ella. Muchos samaritanos de aquella ciudad creyeron en él por la palabra de la mujer.',
  'A mulher samaritana foi ao poço ao meio-dia e encontrou Jesus sentado ali, cansado da viagem. Ele lhe falou de água viva e mostrou que conhecia toda a sua vida, e mesmo assim não a rejeitou. Ela deixou o seu cântaro, foi à cidade e disse ao povo: «Vinde ver um homem que me disse tudo o que tenho feito; não será este o Cristo?». Ela não era teóloga nem tinha boa reputação, mas contou o que Jesus fez com ela. Muitos samaritanos daquela cidade creram nele por causa da palavra da mulher.',
  'Un testimonio sincero de lo que Jesús hizo puede abrir los ojos de una ciudad.',
  'Um testemunho sincero do que Jesus fez pode abrir os olhos de uma cidade.',
  'Jo 4:28-30','Jo 4:39')
I('c-eva-remedio','evangelismo','cotidiano','El remedio guardado','O remédio guardado',
  'Imagine a alguien que descubre un remedio que lo curó de una enfermedad grave. Sabe que su vecino, su primo y un compañero de trabajo tienen exactamente el mismo problema. Pero no les dice nada, por vergüenza o para no parecer insistente, y guarda el frasco en el cajón. Nadie diría que esa persona es amable por no molestar. Los leprosos que encontraron comida en el campamento de los sirios dijeron: «No hacemos bien; hoy es día de buena nueva, y nosotros callamos». Quien conoció la gracia de Jesús no puede guardarla en el cajón.',
  'Imagine alguém que descobre um remédio que o curou de uma doença grave. Sabe que o vizinho, o primo e um colega de trabalho têm exatamente o mesmo problema. Mas não lhes diz nada, por vergonha ou para não parecer insistente, e guarda o frasco na gaveta. Ninguém diria que essa pessoa é gentil por não incomodar. Os leprosos que encontraram comida no acampamento dos sírios disseram: «Não fazemos bem; este dia é dia de boas-novas, e nós nos calamos». Quem conheceu a graça de Jesus não pode guardá-la na gaveta.',
  'Callar las buenas nuevas no es prudencia cuando otros las necesitan.',
  'Calar as boas-novas não é prudência quando outros precisam delas.',
  '2Rs 7:9','Rm 10:14')

# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas|sálvame|enséñanos)\b',re.I)
TEMAS='paz alegria santidade arrependimento fidelidade adoracao discipulado lingua ansiedade ceu cruz evangelismo'.split()
TIPOS={'comparacao','cotidiano','natureza','biblica'}
def wc(s):return len(re.findall(r"[\wÀ-ÿ'-]+",s))
def main():
    err=[];refs=[]
    if len(IL)!=60:err.append('total %d (esperado 60)'%len(IL))
    ks=[o['k'] for o in IL]
    for k in set(ks):
        if ks.count(k)>1:err.append('k repetido: '+k)
    for t in TEMAS:
        n=sum(1 for o in IL if o['tema']==t)
        if n!=5:err.append('tema %s: %d itens'%(t,n))
    for o in IL:
        w=o['k']
        if not w.startswith('c-'):err.append(w+': k sem prefixo c-')
        if o['tema'] not in TEMAS:err.append(w+': tema inválido')
        if o['tipo'] not in TIPOS:err.append(w+': tipo inválido')
        for f in ('t','x','ap'):
            if len(o[f])!=2 or not all(s.strip() for s in o[f]):err.append(w+': par ES/PT incompleto em '+f)
        for i,lg in enumerate(('ES','PT')):
            n=wc(o['x'][i])
            if not 70<=n<=130:err.append('%s: x %s com %d palavras'%(w,lg,n))
            if o['ap'][i].count('.')>1 or not o['ap'][i].endswith('.'):err.append('%s: ap %s não é uma frase'%(w,lg))
        if o['tipo']=='cotidiano' and not (o['x'][0].startswith('Imagine') and o['x'][1].startswith('Imagine')):
            err.append(w+': cotidiano deve começar com "Imagine"')
        for s in (o['t'][0],o['x'][0],o['ap'][0]):
            m=TU.search(re.sub(r'«[^»]*»','',s))  # citações bíblicas entre « » mantêm o texto da Bíblia
            if m:err.append('%s: forma de "tú" em ES: %r'%(w,m.group(0)))
        if not 1<=len(o['v'])<=3:err.append(w+': %d refs'%len(o['v']))
        o['v']=[ref(r) for r in o['v']]
        refs+=[(w,r) for r in o['v']]
    for w,r in refs:
        for b,c,v in verses(r):
            for nome,bib in (('PT',PT),('ES',ES)):
                if not exists(bib,b,c,v):err.append('%s: %s não existe em %s'%(w,r,nome))
    if '--print' in sys.argv:
        for w,r in refs:
            print('==',w,r)
            for b,c,v in verses(r):
                print('  PT %d:%d %s'%(c,v,PT[b][c-1][v-1]));print('  ES %d:%d %s'%(c,v,ES[b][c-1][v-1]))
    if err:
        print('\n'.join(err));sys.exit(1)
    out=os.path.join(HERE,'ilustracoes-3.json')
    json.dump({'il':IL},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    tipos={t:sum(1 for o in IL if o['tipo']==t) for t in sorted(TIPOS)}
    pal=[wc(o['x'][i]) for o in IL for i in (0,1)]
    print('ok: %d ilustrações, 12 temas x 5, %d referências, palavras %d–%d, tipos %s -> %s'%(len(IL),len(refs),min(pal),max(pal),tipos,out))
if __name__=='__main__':main()
