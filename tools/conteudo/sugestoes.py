# Sugestões de pregação por ocasião (Meu Púlpito) — esboços curtos [ES, PT] para o pastor montar a própria mensagem.
# Cada sugestão: tema, texto-base, ideia central, 3 pontos com referência de apoio e aplicação.
# Uso: python3 tools/conteudo/sugestoes.py          -> valida e grava tools/conteudo/sugestoes.json
#      python3 tools/conteudo/sugestoes.py --print  -> imprime o texto de cada referência nas duas Bíblias
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

# ---------------------------------------------------------------- Santa Ceia
O('ceia','Santa Cena','Santa Ceia','Mensajes para la celebración de la Cena del Señor.','Mensagens para a celebração da Ceia do Senhor.')
S('1Co 11:23-26','En memoria de mí','Em memória de mim',
  'La Cena es un memorial ordenado por Cristo: recordamos su cuerpo entregado y su sangre derramada, y anunciamos su muerte hasta que él venga.',
  'A Ceia é um memorial ordenado por Cristo: lembramos seu corpo entregue e seu sangue derramado, e anunciamos sua morte até que ele venha.',
  [('Mirar atrás: el sacrificio de la cruz','Olhar para trás: o sacrifício da cruz','Is 53:5'),
   ('Mirar adentro: examinar nuestros caminos','Olhar para dentro: examinar nossos caminhos','Lm 3:40'),
   ('Mirar adelante: la promesa de su venida','Olhar para frente: a promessa da sua vinda','Mt 26:29')],
  'Invite a la iglesia a participar con reverencia, gratitud y esperanza en el regreso del Señor.',
  'Convide a igreja a participar com reverência, gratidão e esperança na volta do Senhor.')
S('Mt 26:26-28','La sangre del nuevo pacto','O sangue da nova aliança',
  'En la copa, Jesús estableció el nuevo pacto en su sangre, derramada para el perdón de los pecados.',
  'No cálice, Jesus estabeleceu a nova aliança em seu sangue, derramado para o perdão dos pecados.',
  [('Un pacto prometido por Dios','Uma aliança prometida por Deus','Jr 31:31'),
   ('Una sangre que trae perdón','Um sangue que traz perdão','Hb 9:22'),
   ('Un camino nuevo hasta la presencia de Dios','Um novo caminho até a presença de Deus','Hb 10:19-20')],
  'Anime a cada creyente a tomar la copa con fe, sabiéndose perdonado y aceptado por medio de Cristo.',
  'Anime cada crente a tomar o cálice com fé, sabendo que está perdoado e aceito por meio de Cristo.')
S('1Co 11:28','Examínese cada uno','Examine-se cada um',
  'Participar dignamente implica examinar el corazón, confesar el pecado y discernir el cuerpo del Señor.',
  'Participar dignamente envolve examinar o coração, confessar o pecado e discernir o corpo do Senhor.',
  [('Una confesión que limpia','Uma confissão que purifica','1Jo 1:9'),
   ('Discernir el cuerpo del Señor','Discernir o corpo do Senhor','1Co 11:29'),
   ('Reconciliarse con el hermano','Reconciliar-se com o irmão','Mt 5:23-24')],
  'Dé un momento de silencio antes de servir los elementos para que cada uno se ponga a cuentas con Dios y con su prójimo.',
  'Dê um momento de silêncio antes de servir os elementos para que cada um acerte as contas com Deus e com o próximo.')
S('Ex 12:13','El Cordero pascual','O Cordeiro pascal',
  'La Pascua en Egipto anticipó a Cristo, nuestro Cordero, cuya sangre nos libra del juicio.',
  'A Páscoa no Egito apontava para Cristo, nosso Cordeiro, cujo sangue nos livra do juízo.',
  [('Un cordero sin defecto','Um cordeiro sem defeito','1Pe 1:18-19'),
   ('Una sangre aplicada en la casa','Um sangue aplicado na casa','Ex 12:7'),
   ('Cristo, nuestra Pascua','Cristo, a nossa Páscoa','1Co 5:7')],
  'Recuerde a la iglesia que estamos seguros no por méritos propios, sino por la sangre del Cordero.',
  'Lembre à igreja que estamos seguros não por méritos próprios, mas pelo sangue do Cordeiro.')
S('1Co 10:16-17','Un solo pan, un solo cuerpo','Um só pão, um só corpo',
  'La Cena expresa nuestra comunión con Cristo y también la unidad de todos los que forman su cuerpo.',
  'A Ceia expressa nossa comunhão com Cristo e também a unidade de todos os que formam o seu corpo.',
  [('Comunión con Cristo','Comunhão com Cristo','Jo 6:56'),
   ('Comunión entre hermanos','Comunhão entre irmãos','At 2:42'),
   ('Una unidad que debemos guardar','Uma unidade que devemos guardar','Ef 4:3')],
  'Anime a la congregación a buscar la paz entre hermanos y a valorar la mesa como señal de unidad.',
  'Anime a congregação a buscar a paz entre os irmãos e a valorizar a mesa como sinal de unidade.')
S('Jo 6:35','El pan de vida','O pão da vida',
  'Jesús satisface el hambre más profunda del ser humano; la Cena nos recuerda que vivimos de él.',
  'Jesus satisfaz a fome mais profunda do ser humano; a Ceia nos lembra que vivemos dele.',
  [('Venir a él sin temor','Vir a ele sem medo','Jo 6:37'),
   ('Alimentarse de él','Alimentar-se dele','Jo 6:51'),
   ('Vivir por la fe en él','Viver pela fé nele','Gl 2:20')],
  'Invite a cada uno a depender de Cristo cada día, no solo en el momento de la Cena.',
  'Convide cada um a depender de Cristo todos os dias, não só no momento da Ceia.')

# ---------------------------------------------------------------- Evangelismo
O('evang','Evangelismo','Evangelismo','Mensajes para presentar el evangelio a quienes todavía no conocen a Cristo.','Mensagens para apresentar o evangelho a quem ainda não conhece a Cristo.')
S('Jo 3:16','El amor que se entrega','O amor que se entrega',
  'El amor de Dios se ve en el regalo de su Hijo; todo el que cree en él tiene vida eterna.',
  'O amor de Deus se vê no presente do seu Filho; todo aquele que nele crê tem a vida eterna.',
  [('Dios nos amó primero','Deus nos amou primeiro','Rm 5:8'),
   ('Todos necesitamos salvación','Todos precisamos de salvação','Rm 3:23'),
   ('La salvación se recibe por fe','A salvação se recebe pela fé','Ef 2:8-9')],
  'Invite a los oyentes a recibir a Cristo hoy por la fe y ore con quienes respondan.',
  'Convide os ouvintes a receber a Cristo hoje pela fé e ore com os que responderem.')
S('Lc 15:20','El hijo que volvió a casa','O filho que voltou para casa',
  'El Padre espera con amor a quien se alejó, y lo recibe por completo cuando regresa arrepentido.',
  'O Pai espera com amor quem se afastou e o recebe por completo quando volta arrependido.',
  [('Lejos del Padre','Longe do Pai','Lc 15:13'),
   ('Volver en sí y decidir regresar','Cair em si e decidir voltar','Lc 15:17-18'),
   ('Recibido con fiesta','Recebido com festa','Lc 15:22-24')],
  'Diga con claridad que no importa cuán lejos haya ido una persona: el Padre la espera hoy.',
  'Diga com clareza que não importa quão longe a pessoa tenha ido: o Pai a espera hoje.')
S('Lc 19:10','Zaqueo: un encuentro que cambia la vida','Zaqueu: um encontro que muda a vida',
  'Jesús vino a buscar y a salvar lo que se había perdido; un encuentro con él transforma la vida entera.',
  'Jesus veio buscar e salvar o que se havia perdido; um encontro com ele transforma a vida inteira.',
  [('Un deseo de ver a Jesús','Um desejo de ver Jesus','Lc 19:3-4'),
   ('Un llamado personal','Um chamado pessoal','Lc 19:5'),
   ('Una vida transformada','Uma vida transformada','Lc 19:8')],
  'Muestre que Jesús conoce a cada persona por su nombre y la llama hoy, sin importar su pasado.',
  'Mostre que Jesus conhece cada pessoa pelo nome e a chama hoje, não importa o seu passado.')
S('Jo 14:6','El camino, la verdad y la vida','O caminho, a verdade e a vida',
  'Jesús no muestra solo un camino entre muchos: él mismo es el camino al Padre.',
  'Jesus não mostra apenas um caminho entre muitos: ele mesmo é o caminho para o Pai.',
  [('Un solo nombre que salva','Um só nome que salva','At 4:12'),
   ('La verdad que hace libres','A verdade que liberta','Jo 8:32'),
   ('Vida en abundancia','Vida em abundância','Jo 10:10')],
  'Presente a Cristo como respuesta personal a la búsqueda de sentido, de verdad y de vida.',
  'Apresente Cristo como resposta pessoal à busca por sentido, por verdade e por vida.')
S('At 16:31','¿Qué debo hacer para ser salvo?','Que devo fazer para ser salvo?',
  'A la pregunta más importante de la vida, el evangelio da una respuesta sencilla: creer en el Señor Jesucristo.',
  'Para a pergunta mais importante da vida, o evangelho dá uma resposta simples: crer no Senhor Jesus Cristo.',
  [('La pregunta correcta','A pergunta certa','At 16:29-30'),
   ('Creer y confesar','Crer e confessar','Rm 10:9'),
   ('Una casa alcanzada por la salvación','Uma casa alcançada pela salvação','At 16:34')],
  'Explique de forma simple cómo recibir a Cristo y anime a la persona a hablar de su fe con su familia.',
  'Explique de forma simples como receber a Cristo e anime a pessoa a falar da sua fé com a família.')
S('2Co 6:2','Hoy es el día de salvación','Hoje é o dia da salvação',
  'Dios llama hoy; la vida es breve y la decisión de seguir a Cristo no debe postergarse.',
  'Deus chama hoje; a vida é breve e a decisão de seguir a Cristo não deve ser adiada.',
  [('Dios habla hoy','Deus fala hoje','Hb 3:15'),
   ('La vida es breve','A vida é breve','Tg 4:14'),
   ('Arrepentirse y convertirse','Arrepender-se e converter-se','At 3:19')],
  'Haga el llamado con respeto y urgencia, sin presionar, confiando en la obra del Espíritu Santo.',
  'Faça o apelo com respeito e urgência, sem pressionar, confiando na obra do Espírito Santo.')

# ---------------------------------------------------------------- Jovens
O('jovens','Jóvenes','Jovens','Mensajes para cultos y encuentros de jóvenes.','Mensagens para cultos e encontros de jovens.')
S('Ec 12:1','Acordarse del Creador en la juventud','Lembrar-se do Criador na juventude',
  'La juventud es el mejor tiempo para entregar la vida a Dios, antes de que lleguen los días difíciles.',
  'A juventude é o melhor tempo para entregar a vida a Deus, antes que cheguem os dias difíceis.',
  [('La juventud es tiempo de decisiones','A juventude é tempo de decisões','Ec 11:9'),
   ('Dios merece lo mejor de nuestros años','Deus merece o melhor dos nossos anos','Rm 12:1'),
   ('Construir sobre un fundamento firme','Construir sobre um alicerce firme','Mt 7:24')],
  'Desafíe a los jóvenes a tomar hoy decisiones que honren a Dios en sus estudios, amistades y planes.',
  'Desafie os jovens a tomar hoje decisões que honrem a Deus nos estudos, nas amizades e nos planos.')
S('1Tm 4:12','Ejemplo de los creyentes','Exemplo dos fiéis',
  'Ser joven no es excusa para una fe pequeña: Dios llama a los jóvenes a ser ejemplo para los demás.',
  'Ser jovem não é desculpa para uma fé pequena: Deus chama os jovens a serem exemplo para os outros.',
  [('Ejemplo en la manera de hablar','Exemplo na maneira de falar','Cl 4:6'),
   ('Ejemplo en las buenas obras','Exemplo nas boas obras','Tt 2:7'),
   ('Ejemplo en la pureza','Exemplo na pureza','2Tm 2:22')],
  'Anime a cada joven a escoger un área concreta en la que quiere ser ejemplo esta semana.',
  'Anime cada jovem a escolher uma área concreta em que quer ser exemplo nesta semana.')
S('Gn 39:9','José: pureza bajo presión','José: pureza sob pressão',
  'José se mantuvo fiel cuando nadie lo veía, porque entendía que el pecado es contra Dios.',
  'José se manteve fiel quando ninguém o via, porque entendia que o pecado é contra Deus.',
  [('Dios estaba con José','Deus estava com José','Gn 39:2'),
   ('Huir de la tentación','Fugir da tentação','Gn 39:12'),
   ('Dios no abandona al fiel','Deus não abandona o fiel','Gn 39:21')],
  'Hable con franqueza sobre las tentaciones de hoy y muestre que la fidelidad siempre vale la pena.',
  'Fale com franqueza sobre as tentações de hoje e mostre que a fidelidade sempre vale a pena.')
S('Dn 1:8','Daniel: convicciones firmes','Daniel: convicções firmes',
  'Daniel decidió en su corazón no contaminarse, y Dios honró su fidelidad en tierra extraña.',
  'Daniel decidiu no coração não se contaminar, e Deus honrou sua fidelidade em terra estranha.',
  [('Dios da gracia ante los demás','Deus dá graça diante dos outros','Dn 1:9'),
   ('Dios da sabiduría al fiel','Deus dá sabedoria ao fiel','Dn 1:17'),
   ('Valentía en la prueba','Coragem na provação','Dn 3:17-18')],
  'Ayude a los jóvenes a definir sus convicciones antes de que llegue la presión del grupo.',
  'Ajude os jovens a definir suas convicções antes que chegue a pressão do grupo.')
S('Sl 119:9','Un camino limpio','Um caminho puro',
  'La Palabra de Dios guardada en el corazón es lo que mantiene limpio el camino del joven.',
  'A Palavra de Deus guardada no coração é o que mantém puro o caminho do jovem.',
  [('La Palabra guardada en el corazón','A Palavra guardada no coração','Sl 119:11'),
   ('La Palabra que ilumina el camino','A Palavra que ilumina o caminho','Sl 119:105'),
   ('La Palabra que hace fuertes','A Palavra que torna fortes','1Jo 2:14')],
  'Proponga un plan sencillo de lectura bíblica diaria para el grupo de jóvenes.',
  'Proponha um plano simples de leitura bíblica diária para o grupo de jovens.')
S('2Tm 1:5','Timoteo: una fe heredada y propia','Timóteo: uma fé herdada e própria',
  'La fe que recibimos de la familia debe convertirse en una fe personal, viva y valiente.',
  'A fé que recebemos da família deve se tornar uma fé pessoal, viva e corajosa.',
  [('Una herencia de fe','Uma herança de fé','2Tm 3:15'),
   ('Avivar el don de Dios','Reavivar o dom de Deus','2Tm 1:6'),
   ('Sin vergüenza del evangelio','Sem vergonha do evangelho','2Tm 1:8')],
  'Anime a los jóvenes a agradecer la fe de sus mayores y a asumir su propio compromiso con Cristo.',
  'Anime os jovens a agradecer a fé dos mais velhos e a assumir o próprio compromisso com Cristo.')

# ---------------------------------------------------------------- Casamento
O('casam','Boda','Casamento','Mensajes para la ceremonia de casamiento.','Mensagens para a cerimônia de casamento.')
S('Gn 2:24','Una sola carne','Uma só carne',
  'El matrimonio es idea de Dios: un hombre y una mujer que dejan, se unen y forman una nueva familia.',
  'O casamento é ideia de Deus: um homem e uma mulher que deixam, se unem e formam uma nova família.',
  [('El matrimonio nace en el corazón de Dios','O casamento nasce no coração de Deus','Gn 2:18'),
   ('Dejar y unirse','Deixar e unir-se','Mt 19:5'),
   ('Lo que Dios juntó','O que Deus uniu','Mt 19:6')],
  'Anime a los novios a ver su unión como un pacto delante de Dios y no solo como un contrato.',
  'Anime os noivos a ver sua união como uma aliança diante de Deus, e não apenas como um contrato.')
S('Ec 4:12','El cordón de tres dobleces','O cordão de três dobras',
  'Un matrimonio con Dios en el centro tiene una fuerza que dos personas solas no tienen.',
  'Um casamento com Deus no centro tem uma força que duas pessoas sozinhas não têm.',
  [('Mejores son dos que uno','Melhor é serem dois do que um','Ec 4:9'),
   ('Levantarse el uno al otro','Levantar um ao outro','Ec 4:10'),
   ('Dios edifica la casa','Deus edifica a casa','Sl 127:1')],
  'Sugiera a la pareja la oración diaria juntos como el hilo que une su matrimonio.',
  'Sugira ao casal a oração diária juntos como o fio que une o seu casamento.')
S('Ef 5:25','Amar como Cristo amó a la iglesia','Amar como Cristo amou a igreja',
  'El modelo del matrimonio cristiano es el amor de Cristo: un amor que se entrega y que respeta.',
  'O modelo do casamento cristão é o amor de Cristo: um amor que se entrega e que respeita.',
  [('Sujetos unos a otros en el temor de Dios','Sujeitos uns aos outros no temor de Deus','Ef 5:21'),
   ('El esposo ama y cuida','O marido ama e cuida','Ef 5:28-29'),
   ('Amor y respeto','Amor e respeito','Ef 5:33')],
  'Pida a los novios que se comprometan a amarse y respetarse siguiendo el ejemplo de Cristo.',
  'Peça aos noivos que se comprometam a amar-se e respeitar-se seguindo o exemplo de Cristo.')
S('1Co 13:4-7','El amor que nunca deja de ser','O amor que nunca falha',
  'El amor verdadero no es solo un sentimiento, sino una decisión diaria que se muestra en actitudes.',
  'O amor verdadeiro não é só um sentimento, mas uma decisão diária que se mostra em atitudes.',
  [('Paciencia y mansedumbre','Paciência e mansidão','Ef 4:2'),
   ('Pensar en el otro antes que en uno mismo','Pensar no outro antes de si mesmo','Fp 2:3-4'),
   ('Un amor que permanece','Um amor que permanece','1Co 13:8')],
  'Anime a los novios a practicar estas actitudes en los días comunes, no solo en el día de la boda.',
  'Anime os noivos a praticar essas atitudes nos dias comuns, não só no dia do casamento.')
S('Jo 2:5','Jesús en las bodas de Caná','Jesus nas bodas de Caná',
  'Cuando Jesús es invitado a la boda y se obedece su palabra, él transforma la escasez en abundancia.',
  'Quando Jesus é convidado para o casamento e sua palavra é obedecida, ele transforma a falta em fartura.',
  [('Invitar a Jesús','Convidar Jesus','Jo 2:2'),
   ('Obedecer su palabra','Obedecer a sua palavra','Jo 2:7'),
   ('Él guarda lo mejor','Ele guarda o melhor','Jo 2:10')],
  'Anime a la pareja a invitar a Jesús a cada etapa del matrimonio, especialmente cuando algo falte.',
  'Anime o casal a convidar Jesus para cada etapa do casamento, especialmente quando faltar alguma coisa.')
S('Rt 4:13','Rut y Booz: un hogar edificado con fidelidad','Rute e Boaz: um lar edificado com fidelidade',
  'La historia de Rut y Booz muestra que Dios bendice los hogares que se forman con lealtad, bondad y temor de Dios.',
  'A história de Rute e Boaz mostra que Deus abençoa os lares que se formam com lealdade, bondade e temor de Deus.',
  [('Lealtad que no abandona','Lealdade que não abandona','Rt 1:16'),
   ('Bajo las alas de Dios','Debaixo das asas de Deus','Rt 2:12'),
   ('Un buen nombre','Um bom nome','Rt 3:11')],
  'Bendiga a la pareja pidiendo que su hogar sea refugio y bendición para las generaciones futuras.',
  'Abençoe o casal pedindo que seu lar seja refúgio e bênção para as gerações futuras.')

# ---------------------------------------------------------------- Culto fúnebre
O('funeral','Culto fúnebre','Culto fúnebre','Mensajes de consuelo y esperanza para la despedida de un ser querido.','Mensagens de consolo e esperança para a despedida de um ente querido.')
S('Jo 11:25','Yo soy la resurrección y la vida','Eu sou a ressurreição e a vida',
  'Ante la muerte, Jesús no ofrece solo palabras: él mismo es la resurrección y la vida.',
  'Diante da morte, Jesus não oferece só palavras: ele mesmo é a ressurreição e a vida.',
  [('Jesús llora con nosotros','Jesus chora conosco','Jo 11:35'),
   ('No nos entristecemos sin esperanza','Não nos entristecemos sem esperança','1Ts 4:13-14'),
   ('Una pregunta para cada corazón','Uma pergunta para cada coração','Jo 11:26')],
  'Dé espacio al dolor de la familia y, con suavidad, señale la esperanza que hay en Cristo.',
  'Dê espaço à dor da família e, com delicadeza, aponte a esperança que há em Cristo.')
S('Jo 14:2','En la casa de mi Padre','Na casa de meu Pai',
  'Jesús prometió preparar un lugar para los suyos; esa promesa trae paz al corazón que sufre.',
  'Jesus prometeu preparar um lugar para os seus; essa promessa traz paz ao coração que sofre.',
  [('Una paz que el mundo no da','Uma paz que o mundo não dá','Jo 14:27'),
   ('Una morada eterna','Uma morada eterna','2Co 5:1'),
   ('Él volverá por los suyos','Ele voltará pelos seus','Jo 14:3')],
  'Hable con sencillez y brevedad; ofrezca a la familia la paz de Cristo y la compañía de la iglesia.',
  'Fale com simplicidade e brevidade; ofereça à família a paz de Cristo e o apoio da igreja.')
S('Sl 23:4','En el valle de sombra de muerte','No vale da sombra da morte',
  'Aun en el valle más oscuro, el Buen Pastor está presente y conduce a los suyos.',
  'Mesmo no vale mais escuro, o Bom Pastor está presente e conduz os seus.',
  [('El Pastor que guía','O Pastor que guia','Sl 23:1-2'),
   ('El Dios de toda consolación','O Deus de toda consolação','2Co 1:3-4'),
   ('Moraremos en su casa','Habitaremos em sua casa','Sl 23:6')],
  'Anime a la familia a apoyarse en el Señor día a día y ofrezca el acompañamiento de la iglesia.',
  'Anime a família a apoiar-se no Senhor dia após dia e ofereça o acompanhamento da igreja.')
S('Ap 21:4','Dios enjugará toda lágrima','Deus enxugará toda lágrima',
  'Dios ve nuestras lágrimas hoy y promete un futuro donde ya no habrá muerte, ni llanto, ni dolor.',
  'Deus vê nossas lágrimas hoje e promete um futuro onde não haverá mais morte, nem pranto, nem dor.',
  [('Dios conoce nuestro dolor','Deus conhece a nossa dor','Sl 56:8'),
   ('Consuelo para hoy','Consolo para hoje','Mt 5:4'),
   ('Todas las cosas hechas nuevas','Todas as coisas feitas novas','Ap 21:5')],
  'Reconozca que el llanto es legítimo y presente la promesa de Dios como ancla para los días que vienen.',
  'Reconheça que o choro é legítimo e apresente a promessa de Deus como âncora para os dias que virão.')
S('Sl 34:18','Cercano está el Señor a los quebrantados','Perto está o Senhor dos quebrantados',
  'En el momento del duelo, Dios no se aleja: se acerca a los que tienen el corazón quebrantado.',
  'No momento do luto, Deus não se afasta: ele se aproxima dos que têm o coração quebrantado.',
  [('Dios está con nosotros en las aguas','Deus está conosco nas águas','Is 43:2'),
   ('Nuestro amparo y fortaleza','Nosso refúgio e fortaleza','Sl 46:1'),
   ('Echar sobre él la ansiedad','Lançar sobre ele a ansiedade','1Pe 5:7')],
  'Invite a los presentes a llevar su dolor a Dios en oración y no cargarlo en soledad.',
  'Convide os presentes a levar sua dor a Deus em oração e não carregá-la sozinhos.')
S('1Co 15:55','La muerte fue vencida','A morte foi vencida',
  'Cristo venció la muerte; para quien está en él, la muerte no es el final.',
  'Cristo venceu a morte; para quem está nele, a morte não é o fim.',
  [('Cristo resucitó primero','Cristo ressuscitou primeiro','1Co 15:20'),
   ('Nada nos separa del amor de Dios','Nada nos separa do amor de Deus','Rm 8:38-39'),
   ('Presentes con el Señor','Presentes com o Senhor','2Co 5:8')],
  'Presente la esperanza con sensibilidad, sin afirmar sobre el difunto lo que no se sabe, e invite a todos a confiar en Cristo.',
  'Apresente a esperança com sensibilidade, sem afirmar sobre o falecido o que não se sabe, e convide todos a confiar em Cristo.')

# ---------------------------------------------------------------- Batismo
O('batismo','Bautismo','Batismo','Mensajes para el culto de bautismo en aguas.','Mensagens para o culto de batismo nas águas.')
S('Rm 6:4','Sepultados y resucitados con Cristo','Sepultados e ressuscitados com Cristo',
  'El bautismo muestra que morimos al pecado y que ahora andamos en una vida nueva con Cristo.',
  'O batismo mostra que morremos para o pecado e que agora andamos em uma vida nova com Cristo.',
  [('Muertos al pecado','Mortos para o pecado','Rm 6:2'),
   ('Una nueva criatura','Uma nova criatura','2Co 5:17'),
   ('Vivos para Dios','Vivos para Deus','Rm 6:11')],
  'Anime a los bautizandos a vivir cada día de acuerdo con la nueva vida que hoy testifican.',
  'Anime os batizandos a viver cada dia de acordo com a nova vida que hoje testemunham.')
S('At 2:38','Arrepentirse y ser bautizado','Arrepender-se e ser batizado',
  'El primer sermón de la iglesia llamó al arrepentimiento y al bautismo, con la promesa del Espíritu Santo.',
  'O primeiro sermão da igreja chamou ao arrependimento e ao batismo, com a promessa do Espírito Santo.',
  [('Un arrepentimiento verdadero','Um arrependimento verdadeiro','Lc 24:47'),
   ('Obedecer el mandato de Cristo','Obedecer à ordem de Cristo','Mt 28:19'),
   ('La promesa es para ustedes','A promessa é para vocês','At 2:39')],
  'Anime a los bautizados a buscar también el bautismo en el Espíritu Santo.',
  'Anime os batizados a buscar também o batismo no Espírito Santo.')
S('Mt 3:16-17','El bautismo de Jesús','O batismo de Jesus',
  'Jesús se bautizó para cumplir toda justicia y darnos ejemplo; el Padre lo aprobó y el Espíritu descendió sobre él.',
  'Jesus foi batizado para cumprir toda a justiça e nos dar exemplo; o Pai o aprovou e o Espírito desceu sobre ele.',
  [('Cumplir toda justicia','Cumprir toda a justiça','Mt 3:15'),
   ('Una vida en oración','Uma vida de oração','Lc 3:21-22'),
   ('Hijos amados de Dios','Filhos amados de Deus','1Jo 3:1')],
  'Recuerde a los bautizandos que siguen los pasos de Jesús y que son amados por el Padre.',
  'Lembre aos batizandos que eles seguem os passos de Jesus e são amados pelo Pai.')
S('At 8:36','¿Qué impide que yo sea bautizado?','Que impede que eu seja batizado?',
  'El funcionario etíope buscó a Dios, entendió el evangelio y no postergó su obediencia.',
  'O oficial etíope buscou a Deus, entendeu o evangelho e não adiou a sua obediência.',
  [('Un corazón que busca','Um coração que busca','At 8:27-28'),
   ('Jesús anunciado en la Escritura','Jesus anunciado na Escritura','At 8:35'),
   ('Gozo después de obedecer','Alegria depois de obedecer','At 8:39')],
  'Invite a quienes ya creyeron y aún no se bautizaron a dar ese paso de obediencia.',
  'Convide os que já creram e ainda não foram batizados a dar esse passo de obediência.')
S('Gl 3:27','Revestidos de Cristo','Revestidos de Cristo',
  'Quien se bautiza en Cristo se reviste de él: una nueva identidad como hijo de Dios.',
  'Quem é batizado em Cristo se reveste dele: uma nova identidade como filho de Deus.',
  [('Hijos de Dios por la fe','Filhos de Deus pela fé','Gl 3:26'),
   ('Todos uno en Cristo','Todos um em Cristo','Gl 3:28'),
   ('Despojarse de lo viejo','Despojar-se do velho','Ef 4:22-24')],
  'Anime a los bautizandos a vivir conforme a su nueva identidad en Cristo.',
  'Anime os batizandos a viver de acordo com sua nova identidade em Cristo.')
S('Mc 16:16','Creer y ser bautizado','Crer e ser batizado',
  'El bautismo es la respuesta pública de quien ya creyó en Cristo.',
  'O batismo é a resposta pública de quem já creu em Cristo.',
  [('Primero creer','Primeiro crer','Jo 20:31'),
   ('Confesar a Cristo delante de los hombres','Confessar a Cristo diante dos homens','Mt 10:32'),
   ('Seguir andando en él','Continuar andando nele','Cl 2:6-7')],
  'Explique que el bautismo no es el final, sino el comienzo de una vida de discipulado en la iglesia.',
  'Explique que o batismo não é o fim, mas o começo de uma vida de discipulado na igreja.')

# ---------------------------------------------------------------- Natal
O('natal','Navidad','Natal','Mensajes para celebrar el nacimiento de Jesús.','Mensagens para celebrar o nascimento de Jesus.')
S('Is 9:6','Un niño nos es nacido','Um menino nos nasceu',
  'Siglos antes, Dios anunció el nacimiento de un niño que sería Dios fuerte y Príncipe de paz.',
  'Séculos antes, Deus anunciou o nascimento de um menino que seria Deus forte e Príncipe da paz.',
  [('Una promesa anunciada siglos antes','Uma promessa anunciada séculos antes','Mq 5:2'),
   ('Un reino que no tendrá fin','Um reino que não terá fim','Is 9:7'),
   ('Paz para los hombres','Paz entre os homens','Lc 2:14')],
  'Invite a la iglesia a celebrar la Navidad recordando quién es el niño que nació.',
  'Convide a igreja a celebrar o Natal lembrando quem é o menino que nasceu.')
S('Mt 1:23','Emanuel: Dios con nosotros','Emanuel: Deus conosco',
  'En Jesús, Dios vino a habitar entre nosotros para salvarnos y nunca dejarnos solos.',
  'Em Jesus, Deus veio habitar entre nós para nos salvar e nunca nos deixar sozinhos.',
  [('Dios se hizo hombre','Deus se fez homem','Jo 1:14'),
   ('Vino a salvar','Veio para salvar','Mt 1:21'),
   ('Con nosotros todos los días','Conosco todos os dias','Mt 28:20')],
  'Anime a quienes pasan la Navidad con soledad o tristeza a recordar que Dios está con ellos.',
  'Anime quem passa o Natal com solidão ou tristeza a lembrar que Deus está com eles.')
S('Lc 2:11','Les ha nacido un Salvador','Vos nasceu um Salvador',
  'El anuncio a los pastores es buena noticia para todo el pueblo: nació el Salvador, Cristo el Señor.',
  'O anúncio aos pastores é boa notícia para todo o povo: nasceu o Salvador, Cristo, o Senhor.',
  [('Nuevas de gran gozo','Novas de grande alegria','Lc 2:10'),
   ('Los pastores fueron a verlo','Os pastores foram vê-lo','Lc 2:15-16'),
   ('Volvieron glorificando a Dios','Voltaram glorificando a Deus','Lc 2:20')],
  'Anime a la iglesia a compartir la buena noticia de Jesús en las reuniones familiares de fin de año.',
  'Anime a igreja a compartilhar a boa notícia de Jesus nos encontros de família de fim de ano.')
S('Mt 2:11','Los magos: buscar y adorar','Os magos: buscar e adorar',
  'Los magos buscaron con esfuerzo, se alegraron al encontrarlo y le ofrecieron lo mejor.',
  'Os magos buscaram com esforço, se alegraram ao encontrá-lo e lhe ofereceram o melhor.',
  [('Seguir la luz que Dios da','Seguir a luz que Deus dá','Mt 2:2'),
   ('Gozo al encontrarlo','Alegria ao encontrá-lo','Mt 2:10'),
   ('Dar a Dios la honra debida','Dar a Deus a honra devida','Sl 96:8')],
  'Pregunte a la iglesia qué ofrenda de adoración presentará a Cristo en esta Navidad.',
  'Pergunte à igreja que oferta de adoração apresentará a Cristo neste Natal.')
S('Lc 2:7','No había lugar para ellos','Não havia lugar para eles',
  'El Rey nació en humildad porque no había lugar; hoy él busca lugar en nuestro corazón.',
  'O Rei nasceu em humildade porque não havia lugar; hoje ele procura lugar em nosso coração.',
  [('Un Rey que se humilló','Um Rei que se humilhou','Fp 2:7'),
   ('Él llama a la puerta','Ele bate à porta','Ap 3:20'),
   ('Recibirlo nos hace hijos','Recebê-lo nos torna filhos','Jo 1:12')],
  'Invite a cada persona a abrir lugar para Cristo en su vida, más allá de la fiesta.',
  'Convide cada pessoa a abrir lugar para Cristo na sua vida, além da festa.')
S('Lc 1:38','María: la sierva del Señor','Maria: a serva do Senhor',
  'María recibió el plan de Dios con fe y disposición, aunque no lo entendía todo.',
  'Maria recebeu o plano de Deus com fé e disposição, mesmo sem entender tudo.',
  [('Nada es imposible para Dios','Nada é impossível para Deus','Lc 1:37'),
   ('Bienaventurada la que creyó','Bem-aventurada a que creu','Lc 1:45'),
   ('Un corazón que adora','Um coração que adora','Lc 1:46-47')],
  'Anime a la iglesia a responder a Dios con la misma disposición: que se haga conforme a su palabra.',
  'Anime a igreja a responder a Deus com a mesma disposição: que se cumpra conforme a sua palavra.')

# ---------------------------------------------------------------- Páscoa
O('pascoa','Resurrección','Páscoa – Ressurreição','Mensajes sobre la muerte y la resurrección de Jesucristo.','Mensagens sobre a morte e a ressurreição de Jesus Cristo.')
S('Mt 28:6','No está aquí, ha resucitado','Não está aqui, ressuscitou',
  'La tumba vacía es el centro de nuestra fe: Jesús vive, tal como lo había dicho.',
  'O túmulo vazio é o centro da nossa fé: Jesus vive, assim como havia dito.',
  [('Una tumba vacía','Um túmulo vazio','Lc 24:2-3'),
   ('Una noticia para contar','Uma notícia para contar','Mt 28:7'),
   ('Un encuentro con el Resucitado','Um encontro com o Ressuscitado','Mt 28:9')],
  'Anime a la iglesia a vivir y a anunciar con gozo que Cristo vive.',
  'Anime a igreja a viver e anunciar com alegria que Cristo vive.')
S('Is 53:5','Herido por nuestras rebeliones','Ferido por nossas transgressões',
  'Isaías describió siglos antes el sufrimiento del Siervo que cargaría con nuestro pecado.',
  'Isaías descreveu séculos antes o sofrimento do Servo que carregaria o nosso pecado.',
  [('Llevó nuestros dolores','Levou as nossas dores','Is 53:4'),
   ('Todos nos descarriamos','Todos nós nos desviamos','Is 53:6'),
   ('Justificará a muchos','Justificará a muitos','Is 53:11')],
  'Lleve a la iglesia a contemplar el precio de su salvación y a responder con gratitud y entrega.',
  'Leve a igreja a contemplar o preço da sua salvação e a responder com gratidão e entrega.')
S('Jo 19:30','Consumado es','Está consumado',
  'En la cruz, Jesús completó la obra de nuestra salvación; no hay nada que añadir.',
  'Na cruz, Jesus completou a obra da nossa salvação; não há nada a acrescentar.',
  [('Un solo sacrificio para siempre','Um só sacrifício para sempre','Hb 10:12'),
   ('El velo se rasgó','O véu se rasgou','Mt 27:51'),
   ('Paz con Dios','Paz com Deus','Rm 5:1')],
  'Anime a quienes viven con culpa a descansar en la obra terminada de Cristo.',
  'Anime quem vive com culpa a descansar na obra consumada de Cristo.')
S('Lc 24:32','Los discípulos de Emaús','Os discípulos de Emaús',
  'El Resucitado camina con los desanimados, les abre las Escrituras y se da a conocer.',
  'O Ressuscitado caminha com os desanimados, lhes abre as Escrituras e se dá a conhecer.',
  [('Jesús camina con nosotros','Jesus caminha conosco','Lc 24:15'),
   ('Las Escrituras hablan de él','As Escrituras falam dele','Lc 24:27'),
   ('Lo reconocieron al partir el pan','Eles o reconheceram ao partir o pão','Lc 24:31')],
  'Anime a los desanimados a volver a la Palabra y a la comunión, donde Cristo se revela.',
  'Anime os desanimados a voltar à Palavra e à comunhão, onde Cristo se revela.')
S('1Co 15:3-4','El evangelio de la resurrección','O evangelho da ressurreição',
  'Cristo murió por nuestros pecados, fue sepultado y resucitó al tercer día: esa es la base de nuestra fe.',
  'Cristo morreu pelos nossos pecados, foi sepultado e ressuscitou ao terceiro dia: essa é a base da nossa fé.',
  [('Entregado y resucitado por nosotros','Entregue e ressuscitado por nós','Rm 4:25'),
   ('Visto por muchos testigos','Visto por muitas testemunhas','1Co 15:6'),
   ('Nuestro trabajo no es en vano','Nosso trabalho não é em vão','1Co 15:58')],
  'Anime a la iglesia a seguir firme en la obra del Señor, sabiendo que Cristo vive.',
  'Anime a igreja a continuar firme na obra do Senhor, sabendo que Cristo vive.')
S('Jo 20:28','Tomás: de la duda a la fe','Tomé: da dúvida à fé',
  'Jesús resucitado no rechazó a Tomás, sino que respondió a su duda y lo llevó a la adoración.',
  'Jesus ressuscitado não rejeitou Tomé, mas respondeu à sua dúvida e o levou à adoração.',
  [('Jesús se presenta en medio de los suyos','Jesus se apresenta no meio dos seus','Jo 20:19'),
   ('Jesús responde a la duda','Jesus responde à dúvida','Jo 20:27'),
   ('Bienaventurados los que creen sin ver','Bem-aventurados os que creem sem ver','Jo 20:29')],
  'Anime a quienes tienen dudas a traerlas con honestidad a Cristo.',
  'Anime quem tem dúvidas a levá-las com honestidade a Cristo.')

# ---------------------------------------------------------------- Dia das Mães
O('maes','Día de la Madre','Dia das Mães','Mensajes para honrar a las madres.','Mensagens para honrar as mães.')
S('Pv 31:10','La mujer virtuosa','A mulher virtuosa',
  'La Escritura honra a la mujer que teme a Dios y cuida de su casa con sabiduría y amor.',
  'A Escritura honra a mulher que teme a Deus e cuida da sua casa com sabedoria e amor.',
  [('Digna de confianza','Digna de confiança','Pv 31:11'),
   ('Generosa con el necesitado','Generosa com o necessitado','Pv 31:20'),
   ('Teme a Dios','Teme a Deus','Pv 31:30')],
  'Honre a las madres presentes y anime a los hijos a expresarles su gratitud.',
  'Honre as mães presentes e anime os filhos a expressar-lhes gratidão.')
S('1Sm 1:27','Ana: una madre que oró','Ana: uma mãe que orou',
  'Ana llevó su dolor a Dios en oración y luego entregó al Señor el hijo que recibió.',
  'Ana levou sua dor a Deus em oração e depois entregou ao Senhor o filho que recebeu.',
  [('Derramar el alma delante de Dios','Derramar a alma diante de Deus','1Sm 1:15'),
   ('Entregar el hijo al Señor','Entregar o filho ao Senhor','1Sm 1:28'),
   ('Dios recuerda a la que confía','Deus se lembra de quem confia','1Sm 2:21')],
  'Anime a las madres a orar por sus hijos y a confiarlos en las manos de Dios.',
  'Anime as mães a orar pelos filhos e a confiá-los nas mãos de Deus.')
S('Hb 11:23','Jocabed: una fe que protege','Joquebede: uma fé que protege',
  'La madre de Moisés actuó con fe en un tiempo peligroso y Dios usó su valentía para un gran propósito.',
  'A mãe de Moisés agiu com fé num tempo perigoso, e Deus usou sua coragem para um grande propósito.',
  [('Ver al hijo con ojos de fe','Ver o filho com olhos de fé','Ex 2:2'),
   ('Poner al hijo en las manos de Dios','Colocar o filho nas mãos de Deus','Ex 2:3'),
   ('Dios devuelve con propósito','Deus devolve com propósito','Ex 2:9-10')],
  'Anime a las madres que atraviesan tiempos difíciles a confiar en el cuidado de Dios sobre sus hijos.',
  'Anime as mães que passam por tempos difíceis a confiar no cuidado de Deus sobre seus filhos.')
S('Ex 20:12','Honrar a la madre','Honrar a mãe',
  'Honrar a los padres es un mandamiento con promesa, que vale en cada etapa de la vida.',
  'Honrar os pais é um mandamento com promessa, que vale em cada fase da vida.',
  [('El mandamiento con promesa','O mandamento com promessa','Ef 6:2-3'),
   ('Escuchar la enseñanza de la madre','Ouvir o ensino da mãe','Pv 1:8'),
   ('Cuidar de la madre','Cuidar da mãe','Jo 19:26-27')],
  'Anime a los hijos a honrar a su madre con palabras, tiempo y cuidado concreto.',
  'Anime os filhos a honrar a mãe com palavras, tempo e cuidado concreto.')
S('Is 66:13','Como una madre consuela','Como uma mãe consola',
  'Dios usa la imagen de una madre para mostrar la ternura con que consuela a su pueblo.',
  'Deus usa a imagem de uma mãe para mostrar a ternura com que consola o seu povo.',
  [('Un amor que no olvida','Um amor que não esquece','Is 49:15'),
   ('Un cuidado que protege','Um cuidado que protege','Mt 23:37'),
   ('Consolados para consolar','Consolados para consolar','2Co 1:4')],
  'Recuerde con sensibilidad a quienes ya no tienen a su madre o viven este día con dolor.',
  'Lembre com sensibilidade de quem já não tem a mãe ou vive este dia com dor.')
S('Lc 2:19','María guardaba todo en su corazón','Maria guardava tudo no coração',
  'María fue una madre que meditaba en lo que Dios hacía y acompañó a su Hijo hasta la cruz.',
  'Maria foi uma mãe que meditava no que Deus fazia e acompanhou seu Filho até a cruz.',
  [('Una madre que medita','Uma mãe que medita','Lc 2:51'),
   ('Una madre que señala a Jesús','Uma mãe que aponta para Jesus','Jo 2:5'),
   ('Una madre fiel en el dolor','Uma mãe fiel na dor','Jo 19:25')],
  'Anime a las madres a llevar a sus hijos a Jesús con su ejemplo y su palabra.',
  'Anime as mães a levar seus filhos a Jesus com o exemplo e a palavra.')

# ---------------------------------------------------------------- Dia dos Pais
O('pais','Día del Padre','Dia dos Pais','Mensajes para honrar a los padres y animarlos en su misión.','Mensagens para honrar os pais e animá-los em sua missão.')
S('Js 24:15','Yo y mi casa serviremos al Señor','Eu e a minha casa serviremos ao Senhor',
  'Josué tomó una decisión clara por su familia: servir al Señor, aunque otros escogieran diferente.',
  'Josué tomou uma decisão clara pela família: servir ao Senhor, ainda que outros escolhessem diferente.',
  [('Decidir sin vacilar','Decidir sem vacilar','1Rs 18:21'),
   ('Instruir al hijo en el camino','Instruir o filho no caminho','Pv 22:6'),
   ('Servir con integridad','Servir com integridade','Js 24:14')],
  'Desafíe a los padres a liderar espiritualmente su hogar con decisión y ejemplo.',
  'Desafie os pais a liderar espiritualmente o seu lar com decisão e exemplo.')
S('Ef 6:4','Criar en la disciplina del Señor','Criar na disciplina do Senhor',
  'Dios llama a los padres a corregir con amor y a enseñar a sus hijos el camino del Señor.',
  'Deus chama os pais a corrigir com amor e a ensinar aos filhos o caminho do Senhor.',
  [('Corregir con amor, como Dios corrige','Corrigir com amor, como Deus corrige','Pv 3:12'),
   ('No desanimar a los hijos','Não desanimar os filhos','Cl 3:21'),
   ('Enseñar lo que Dios hizo','Ensinar o que Deus fez','Dt 4:9')],
  'Anime a los padres a dedicar tiempo de calidad a sus hijos y a hablarles de Dios.',
  'Anime os pais a dedicar tempo de qualidade aos filhos e a falar-lhes de Deus.')
S('Sl 103:13','Como el padre se compadece','Como um pai se compadece',
  'El corazón de Dios es corazón de Padre; en él los padres terrenales encuentran su modelo.',
  'O coração de Deus é coração de Pai; nele os pais terrenos encontram o seu modelo.',
  [('Un Padre que nos conoce','Um Pai que nos conhece','Sl 103:14'),
   ('Un Padre que da buenas cosas','Um Pai que dá boas coisas','Mt 7:11'),
   ('Hijos que claman: Abba, Padre','Filhos que clamam: Aba, Pai','Rm 8:15')],
  'Recuerde a quienes no tuvieron un buen padre que en Dios tienen un Padre perfecto.',
  'Lembre a quem não teve um bom pai que em Deus tem um Pai perfeito.')
S('Gn 18:19','Abraham: un padre de fe','Abraão: um pai de fé',
  'Dios escogió a Abraham para que mandara a sus hijos y a su casa guardar el camino del Señor.',
  'Deus escolheu Abraão para que ordenasse a seus filhos e à sua casa guardar o caminho do Senhor.',
  [('Creer a Dios','Crer em Deus','Gn 15:6'),
   ('Obedecer aunque cueste','Obedecer mesmo quando custa','Hb 11:8'),
   ('Poner a Dios por encima de todo','Colocar Deus acima de tudo','Gn 22:12')],
  'Anime a los padres a dejar a sus hijos el ejemplo de una fe obediente.',
  'Anime os pais a deixar aos filhos o exemplo de uma fé obediente.')
S('Mt 1:24','José: un padre justo y obediente','José: um pai justo e obediente',
  'José escuchó a Dios y obedeció sin demora para proteger a María y al niño.',
  'José ouviu a Deus e obedeceu sem demora para proteger Maria e o menino.',
  [('Un hombre justo','Um homem justo','Mt 1:19'),
   ('Atento a la voz de Dios','Atento à voz de Deus','Mt 2:13'),
   ('Obediencia que protege a la familia','Obediência que protege a família','Mt 2:14')],
  'Anime a los padres a proteger a su familia escuchando y obedeciendo a Dios.',
  'Anime os pais a proteger a família ouvindo e obedecendo a Deus.')
S('Pv 13:22','Dejar un legado','Deixar um legado',
  'El padre bueno deja a sus hijos una herencia que va más allá de los bienes: fe, integridad y bendición.',
  'O pai bom deixa aos filhos uma herança que vai além dos bens: fé, integridade e bênção.',
  [('Un legado de fe','Um legado de fé','Sl 78:4'),
   ('Un legado de integridad','Um legado de integridade','Pv 20:7'),
   ('Un legado de bendición','Um legado de bênção','Sl 112:1-2')],
  'Pregunte a los padres qué herencia espiritual están dejando y anímelos a comenzar hoy.',
  'Pergunte aos pais que herança espiritual estão deixando e anime-os a começar hoje.')

# ---------------------------------------------------------------- Família
O('familia','Familia','Família','Mensajes sobre el hogar cristiano.','Mensagens sobre o lar cristão.')
S('Sl 127:1','Si el Señor no edifica la casa','Se o Senhor não edificar a casa',
  'Un hogar firme no depende solo del esfuerzo humano, sino de que Dios sea quien lo edifique.',
  'Um lar firme não depende só do esforço humano, mas de que Deus seja quem o edifica.',
  [('La casa se edifica con sabiduría','A casa se edifica com sabedoria','Pv 24:3'),
   ('Los hijos son herencia del Señor','Os filhos são herança do Senhor','Sl 127:3'),
   ('Bienaventurado el que teme al Señor','Bem-aventurado o que teme ao Senhor','Sl 128:1')],
  'Anime a las familias a poner a Dios en el centro con un tiempo de oración en casa.',
  'Anime as famílias a colocar Deus no centro com um tempo de oração em casa.')
S('Dt 6:6-7','La fe se enseña en casa','A fé se ensina em casa',
  'Dios encargó a los padres enseñar su Palabra en la vida diaria del hogar.',
  'Deus encarregou os pais de ensinar a sua Palavra na vida diária do lar.',
  [('Amar a Dios primero','Amar a Deus em primeiro lugar','Dt 6:5'),
   ('La Palabra presente en la casa','A Palavra presente na casa','Dt 6:9'),
   ('Contar a los hijos lo que Dios hizo','Contar aos filhos o que Deus fez','Js 4:6-7')],
  'Sugiera a las familias un momento semanal para leer la Biblia y orar juntos.',
  'Sugira às famílias um momento semanal para ler a Bíblia e orar juntos.')
S('Mt 7:24-25','La casa sobre la roca','A casa sobre a rocha',
  'Las tormentas llegan a todos los hogares; permanece el que está fundado en la obediencia a Cristo.',
  'As tempestades chegam a todos os lares; permanece o que está fundado na obediência a Cristo.',
  [('Oír y practicar la Palabra','Ouvir e praticar a Palavra','Tg 1:22'),
   ('Cristo, el único fundamento','Cristo, o único fundamento','1Co 3:11'),
   ('Quien construye sobre la arena','Quem constrói sobre a areia','Mt 7:26-27')],
  'Anime a cada familia a revisar sobre qué fundamento está construyendo su hogar.',
  'Anime cada família a avaliar sobre que alicerce está construindo o seu lar.')
S('Cl 3:13','El perdón en el hogar','O perdão no lar',
  'En la familia nos herimos unos a otros; por eso el perdón, como Cristo nos perdonó, es indispensable.',
  'Na família ferimos uns aos outros; por isso o perdão, como Cristo nos perdoou, é indispensável.',
  [('Revestirse de amor','Revestir-se de amor','Cl 3:14'),
   ('Que la paz de Cristo gobierne','Que a paz de Cristo governe','Cl 3:15'),
   ('Palabras que edifican','Palavras que edificam','Ef 4:29')],
  'Invite a los miembros de cada familia a pedir y conceder perdón donde haya heridas.',
  'Convide os membros de cada família a pedir e conceder perdão onde houver feridas.')
S('At 10:2','Cornelio: una casa que buscaba a Dios','Cornélio: uma casa que buscava a Deus',
  'Cornelio y toda su casa temían a Dios, y el Señor envió su Palabra y su Espíritu a ese hogar.',
  'Cornélio e toda a sua casa temiam a Deus, e o Senhor enviou a sua Palavra e o seu Espírito àquele lar.',
  [('Oraciones que suben delante de Dios','Orações que sobem diante de Deus','At 10:4'),
   ('Una casa reunida para oír','Uma casa reunida para ouvir','At 10:33'),
   ('El Espíritu sobre los que oyen','O Espírito sobre os que ouvem','At 10:44')],
  'Anime a las familias a abrir su casa para la oración y la Palabra.',
  'Anime as famílias a abrir a casa para a oração e a Palavra.')
S('Sl 133:1','La bendición de la unidad','A bênção da unidade',
  'Dios se agrada de la unidad entre hermanos y allí envía su bendición.',
  'Deus se agrada da unidade entre irmãos e ali envia a sua bênção.',
  [('Amarse con cariño fraternal','Amar-se com amor fraternal','Rm 12:10'),
   ('La respuesta suave','A resposta branda','Pv 15:1'),
   ('Allí envía el Señor bendición','Ali o Senhor ordena a bênção','Sl 133:3')],
  'Anime a las familias a cuidar sus palabras y a buscar la reconciliación.',
  'Anime as famílias a cuidar das palavras e a buscar a reconciliação.')

# ---------------------------------------------------------------- Crianças
O('criancas','Niños','Crianças','Mensajes sencillos para predicar a los niños.','Mensagens simples para pregar às crianças.')
S('Mc 10:14','Jesús ama a los niños','Jesus ama as crianças',
  'Jesús quiere que los niños se acerquen a él; ellos son importantes para Dios.',
  'Jesus quer que as crianças se aproximem dele; elas são importantes para Deus.',
  [('Jesús abraza y bendice a los niños','Jesus abraça e abençoa as crianças','Mc 10:16'),
   ('Confiar como un niño','Confiar como uma criança','Mt 18:3'),
   ('Dios nos hizo con cuidado','Deus nos fez com cuidado','Sl 139:14')],
  'Pregunte a los niños quién quiere acercarse a Jesús hoy y ore con ellos de forma sencilla.',
  'Pergunte às crianças quem quer se aproximar de Jesus hoje e ore com elas de forma simples.')
S('1Sm 17:45','David y Goliat: Dios es más grande','Davi e Golias: Deus é maior',
  'David era pequeño, pero confiaba en un Dios más grande que cualquier gigante.',
  'Davi era pequeno, mas confiava em um Deus maior do que qualquer gigante.',
  [('David confió en Dios','Davi confiou em Deus','1Sm 17:37'),
   ('David usó lo que tenía','Davi usou o que tinha','1Sm 17:40'),
   ('Dios le dio la victoria','Deus lhe deu a vitória','1Sm 17:50')],
  'Pida a los niños que nombren un "gigante" (miedo o problema) y oren juntos confiando en Dios.',
  'Peça às crianças que digam um "gigante" (medo ou problema) e orem juntos confiando em Deus.')
S('Jo 6:9','El niño que compartió su comida','O menino que repartiu o seu lanche',
  'Un niño dio cinco panes y dos peces, y Jesús los usó para alimentar a una multitud.',
  'Um menino deu cinco pães e dois peixes, e Jesus os usou para alimentar uma multidão.',
  [('Jesús dio gracias','Jesus deu graças','Jo 6:11'),
   ('Hubo para todos y sobró','Houve para todos e sobrou','Jo 6:12-13'),
   ('Es mejor dar que recibir','É melhor dar do que receber','At 20:35')],
  'Anime a los niños a compartir lo que tienen y a entregar sus talentos a Jesús.',
  'Anime as crianças a repartir o que têm e a entregar seus talentos a Jesus.')
S('1Sm 3:10','Samuel escucha la voz de Dios','Samuel ouve a voz de Deus',
  'Dios habló al niño Samuel, y Samuel aprendió a escuchar y obedecer.',
  'Deus falou com o menino Samuel, e Samuel aprendeu a ouvir e obedecer.',
  [('Dios llama a los niños','Deus chama as crianças','1Sm 3:4'),
   ('Aprender de los mayores','Aprender com os mais velhos','1Sm 3:8-9'),
   ('Dios estaba con Samuel','Deus estava com Samuel','1Sm 3:19')],
  'Enseñe a los niños a hacer una oración corta pidiendo a Dios un corazón que escucha.',
  'Ensine as crianças a fazer uma oração curta pedindo a Deus um coração que ouve.')
S('Dn 6:22','Daniel en el foso de los leones','Daniel na cova dos leões',
  'Daniel oraba siempre a Dios, y Dios lo protegió en el foso de los leones.',
  'Daniel orava sempre a Deus, e Deus o protegeu na cova dos leões.',
  [('Daniel oraba todos los días','Daniel orava todos os dias','Dn 6:10'),
   ('El ángel del Señor nos cuida','O anjo do Senhor nos guarda','Sl 34:7'),
   ('Todos supieron que Dios es grande','Todos souberam que Deus é grande','Dn 6:26')],
  'Anime a los niños a orar cada día, en casa y en la escuela.',
  'Anime as crianças a orar todos os dias, em casa e na escola.')
S('Lc 15:4','El pastor que busca la oveja perdida','O pastor que procura a ovelha perdida',
  'Jesús es como un pastor que busca a la oveja perdida hasta encontrarla, porque cada una es importante.',
  'Jesus é como um pastor que procura a ovelha perdida até encontrá-la, porque cada uma é importante.',
  [('Dios no quiere que ningún niño se pierda','Deus não quer que nenhuma criança se perca','Mt 18:14'),
   ('Jesús nos lleva en sus hombros','Jesus nos leva nos ombros','Lc 15:5'),
   ('Hay fiesta en el cielo','Há festa no céu','Lc 15:7')],
  'Use un muñeco de oveja o un dibujo para que los niños recuerden que Jesús los cuida.',
  'Use uma ovelha de pelúcia ou um desenho para que as crianças lembrem que Jesus cuida delas.')

# ---------------------------------------------------------------- Mulheres
O('mulheres','Mujeres','Mulheres','Mensajes para cultos y encuentros de mujeres.','Mensagens para cultos e encontros de mulheres.')
S('Et 4:14','Ester: para un tiempo como este','Ester: para um tempo como este',
  'Dios colocó a Ester en un lugar estratégico para un propósito; ella respondió con oración y valentía.',
  'Deus colocou Ester num lugar estratégico para um propósito; ela respondeu com oração e coragem.',
  [('Orar y ayunar antes de actuar','Orar e jejuar antes de agir','Et 4:16'),
   ('Dios abre puertas','Deus abre portas','Et 5:2'),
   ('Un pueblo librado','Um povo livrado','Et 8:16')],
  'Anime a las mujeres a ver su lugar actual como una oportunidad que Dios les dio.',
  'Anime as mulheres a ver o lugar onde estão como uma oportunidade que Deus lhes deu.')
S('Jo 4:29','La mujer samaritana','A mulher samaritana',
  'Jesús buscó a una mujer marcada por su pasado, le ofreció agua viva y la convirtió en testigo.',
  'Jesus buscou uma mulher marcada pelo passado, ofereceu-lhe água viva e a tornou testemunha.',
  [('Jesús fue a su encuentro','Jesus foi ao seu encontro','Jo 4:7'),
   ('El agua que sacia para siempre','A água que sacia para sempre','Jo 4:14'),
   ('Un testimonio que alcanzó la ciudad','Um testemunho que alcançou a cidade','Jo 4:39')],
  'Anime a las mujeres a dejar que su historia con Cristo se convierta en testimonio.',
  'Anime as mulheres a deixar que sua história com Cristo se torne testemunho.')
S('Lc 10:42','María escogió la buena parte','Maria escolheu a boa parte',
  'En medio de muchas tareas, lo más necesario es sentarse a los pies de Jesús.',
  'No meio de muitas tarefas, o mais necessário é sentar-se aos pés de Jesus.',
  [('Sentarse a escuchar','Sentar-se para ouvir','Lc 10:39'),
   ('Afanadas con muchas cosas','Ansiosas com muitas coisas','Lc 10:41'),
   ('Una sola cosa he pedido','Uma coisa pedi','Sl 27:4')],
  'Anime a las mujeres a reservar un tiempo diario a solas con Dios.',
  'Anime as mulheres a separar um tempo diário a sós com Deus.')
S('Mc 5:34','Una fe que toca a Jesús','Uma fé que toca em Jesus',
  'Una mujer agotada por años de enfermedad se acercó a Jesús con fe y fue restaurada.',
  'Uma mulher esgotada por anos de doença se aproximou de Jesus com fé e foi restaurada.',
  [('Años de lucha','Anos de luta','Mc 5:25-26'),
   ('Decidir acercarse','Decidir se aproximar','Mc 5:27-28'),
   ('Sanada al instante','Curada no mesmo instante','Mc 5:29')],
  'Invite a las mujeres cansadas a acercarse a Jesús con fe, sin vergüenza.',
  'Convide as mulheres cansadas a se aproximar de Jesus com fé, sem vergonha.')
S('Jz 5:7','Débora: una mujer que se levantó','Débora: uma mulher que se levantou',
  'Débora se levantó con sabiduría y fe en un tiempo difícil y animó al pueblo a confiar en Dios.',
  'Débora se levantou com sabedoria e fé num tempo difícil e animou o povo a confiar em Deus.',
  [('Sabiduría para aconsejar','Sabedoria para aconselhar','Jz 4:5'),
   ('Animar a otros a avanzar','Animar outros a avançar','Jz 4:14'),
   ('Cantar la victoria de Dios','Cantar a vitória de Deus','Jz 5:3')],
  'Anime a las mujeres a usar sus dones para fortalecer a la iglesia y a su comunidad.',
  'Anime as mulheres a usar seus dons para fortalecer a igreja e a comunidade.')
S('At 9:36','Dorcas: llena de buenas obras','Dorcas: cheia de boas obras',
  'Dorcas sirvió con sus manos a los necesitados y su vida dejó una huella en muchos.',
  'Dorcas serviu com as mãos aos necessitados, e sua vida deixou marca em muitos.',
  [('Un servicio que se ve','Um serviço que se vê','At 9:39'),
   ('No cansarse de hacer el bien','Não se cansar de fazer o bem','Gl 6:9'),
   ('Dios trajo vida y muchos creyeron','Deus trouxe vida e muitos creram','At 9:41-42')],
  'Proponga a las mujeres una acción concreta de servicio a personas necesitadas.',
  'Proponha às mulheres uma ação concreta de serviço a pessoas necessitadas.')

# ---------------------------------------------------------------- Homens
O('homens','Hombres','Homens','Mensajes para cultos y encuentros de hombres.','Mensagens para cultos e encontros de homens.')
S('1Rs 2:2-3','Esforzarse y ser hombre','Esforçar-se e ser homem',
  'El consejo de David a Salomón muestra que la verdadera hombría está en andar en los caminos de Dios.',
  'O conselho de Davi a Salomão mostra que a verdadeira masculinidade está em andar nos caminhos de Deus.',
  [('Hacer justicia, amar la misericordia','Praticar a justiça, amar a misericórdia','Mq 6:8'),
   ('Firmes en la fe','Firmes na fé','1Co 16:13'),
   ('Meditar en la Palabra','Meditar na Palavra','Js 1:8')],
  'Desafíe a los hombres a ser firmes en la fe y fieles en su casa, trabajo e iglesia.',
  'Desafie os homens a serem firmes na fé e fiéis em casa, no trabalho e na igreja.')
S('Ne 2:18','Nehemías: levantarse y edificar','Neemias: levantar-se e edificar',
  'Nehemías vio la necesidad, oró y movilizó al pueblo para reconstruir el muro.',
  'Neemias viu a necessidade, orou e mobilizou o povo para reconstruir o muro.',
  [('Llorar y orar por la necesidad','Chorar e orar pela necessidade','Ne 1:4'),
   ('Trabajar con ánimo y en unidad','Trabalhar com ânimo e unidade','Ne 4:6'),
   ('Orar y vigilar','Orar e vigiar','Ne 4:9')],
  'Anime a los hombres a asumir un área concreta de servicio en la iglesia.',
  'Anime os homens a assumir uma área concreta de serviço na igreja.')
S('Js 1:9','Valientes con la presencia de Dios','Corajosos com a presença de Deus',
  'Josué recibió una tarea enorme, pero también la promesa de que Dios estaría con él.',
  'Josué recebeu uma tarefa enorme, mas também a promessa de que Deus estaria com ele.',
  [('Dios no nos deja','Deus não nos deixa','Js 1:5'),
   ('Guardar la Palabra para prosperar','Guardar a Palavra para prosperar','Dt 29:9'),
   ('No temer, Dios sostiene','Não temer, Deus sustenta','Is 41:10')],
  'Anime a los hombres que enfrentan desafíos a avanzar confiando en la presencia de Dios.',
  'Anime os homens que enfrentam desafios a avançar confiando na presença de Deus.')
S('At 13:22','Un hombre conforme al corazón de Dios','Um homem segundo o coração de Deus',
  'David no fue perfecto, pero buscó a Dios, se arrepintió de sus faltas y lo adoró de corazón.',
  'Davi não foi perfeito, mas buscou a Deus, arrependeu-se de suas faltas e o adorou de coração.',
  [('Un hombre que busca a Dios','Um homem que busca a Deus','Sl 63:1'),
   ('Un corazón quebrantado','Um coração quebrantado','Sl 51:17'),
   ('Un hombre que bendice su casa','Um homem que abençoa a sua casa','2Sm 6:20')],
  'Anime a los hombres a ser adoradores y a bendecir a su familia.',
  'Anime os homens a serem adoradores e a abençoar a família.')
S('Job 1:1','Job: íntegro en la prueba','Jó: íntegro na provação',
  'Job era íntegro y temía a Dios; aun en la pérdida mantuvo su fe, y Dios lo restauró.',
  'Jó era íntegro e temia a Deus; mesmo na perda manteve sua fé, e Deus o restaurou.',
  [('Interceder por la familia','Interceder pela família','Job 1:5'),
   ('Adorar en medio de la pérdida','Adorar no meio da perda','Job 1:20-21'),
   ('Dios restaura','Deus restaura','Job 42:10')],
  'Anime a los hombres que atraviesan pruebas a mantener la integridad y a orar por los suyos.',
  'Anime os homens que passam por provações a manter a integridade e a orar pelos seus.')
S('1Tm 2:8','Hombres que oran','Homens que oram',
  'Dios quiere hombres que oren en todo lugar, con manos limpias y sin ira.',
  'Deus quer homens que orem em todo lugar, com mãos limpas e sem ira.',
  [('Tarde, mañana y mediodía','De tarde, de manhã e ao meio-dia','Sl 55:17'),
   ('Lentos para la ira','Tardios para se irar','Tg 1:19-20'),
   ('Orar siempre y no desmayar','Orar sempre e nunca desanimar','Lc 18:1')],
  'Proponga a los hombres un tiempo fijo de oración, solos y en grupo.',
  'Proponha aos homens um horário fixo de oração, a sós e em grupo.')

# ---------------------------------------------------------------- Missões
O('missoes','Misiones','Missões','Mensajes para despertar a la iglesia a la obra misionera.','Mensagens para despertar a igreja para a obra missionária.')
S('Mt 28:19-20','La Gran Comisión','A Grande Comissão',
  'Jesús envió a su iglesia a hacer discípulos de todas las naciones, con su autoridad y su presencia.',
  'Jesus enviou sua igreja a fazer discípulos de todas as nações, com sua autoridade e sua presença.',
  [('Toda autoridad es de Cristo','Toda autoridade é de Cristo','Mt 28:18'),
   ('Ir por todo el mundo','Ir por todo o mundo','Mc 16:15'),
   ('Gente de toda nación delante del trono','Gente de toda nação diante do trono','Ap 7:9')],
  'Desafíe a la iglesia a participar en las misiones yendo, orando u ofrendando.',
  'Desafie a igreja a participar de missões indo, orando ou ofertando.')
S('Is 6:8','Heme aquí, envíame a mí','Eis-me aqui, envia-me a mim',
  'Quien ve la santidad de Dios y recibe su perdón responde con disposición a su llamado.',
  'Quem vê a santidade de Deus e recebe o seu perdão responde com disposição ao seu chamado.',
  [('Una visión de la santidad de Dios','Uma visão da santidade de Deus','Is 6:3'),
   ('Un corazón purificado','Um coração purificado','Is 6:7'),
   ('Una respuesta inmediata','Uma resposta imediata','Mc 1:17-18')],
  'Haga un llamado a quienes sienten el llamado misionero a ponerse a disposición de Dios.',
  'Faça um apelo aos que sentem o chamado missionário a se colocar à disposição de Deus.')
S('Rm 10:14','¿Cómo oirán sin quien les predique?','Como ouvirão sem quem pregue?',
  'La salvación es para todo el que invoca al Señor, pero para invocarlo alguien tiene que anunciar el evangelio.',
  'A salvação é para todo aquele que invoca o Senhor, mas para invocá-lo alguém precisa anunciar o evangelho.',
  [('Todo el que invoque será salvo','Todo aquele que invocar será salvo','Rm 10:13'),
   ('Hermosos los pies de los que anuncian','Formosos os pés dos que anunciam','Rm 10:15'),
   ('La fe viene por el oír','A fé vem pelo ouvir','Rm 10:17')],
  'Anime a la iglesia a sostener a los misioneros con oración y ofrendas fieles.',
  'Anime a igreja a sustentar os missionários com oração e ofertas fiéis.')
S('Mt 9:37-38','La mies es mucha','A seara é grande',
  'Jesús vio a las multitudes con compasión y pidió a sus discípulos que oraran por obreros.',
  'Jesus viu as multidões com compaixão e pediu aos discípulos que orassem por trabalhadores.',
  [('Mirar con compasión','Olhar com compaixão','Mt 9:36'),
   ('Rogar al Señor de la mies','Rogar ao Senhor da seara','Lc 10:2'),
   ('Los campos están listos','Os campos estão prontos','Jo 4:35')],
  'Proponga a la iglesia orar cada semana por un país o un misionero en particular.',
  'Proponha à igreja orar toda semana por um país ou um missionário em particular.')
S('At 1:8','Testigos hasta lo último de la tierra','Testemunhas até os confins da terra',
  'El poder del Espíritu Santo nos hace testigos, comenzando cerca y llegando hasta lo lejos.',
  'O poder do Espírito Santo nos torna testemunhas, começando perto e chegando até longe.',
  [('Revestidos de poder','Revestidos de poder','Lc 24:49'),
   ('Anunciar por donde vayamos','Anunciar por onde formos','At 8:4'),
   ('Una iglesia que envía','Uma igreja que envia','At 13:2-3')],
  'Anime a cada creyente a ser testigo en su barrio y a apoyar la obra en otras naciones.',
  'Anime cada crente a ser testemunha em seu bairro e a apoiar a obra em outras nações.')
S('Jon 4:11','Jonás y Nínive: Dios ama a las naciones','Jonas e Nínive: Deus ama as nações',
  'Dios tuvo compasión de una ciudad enemiga y enseñó a Jonás a mirar a los perdidos con su corazón.',
  'Deus teve compaixão de uma cidade inimiga e ensinou Jonas a olhar os perdidos com o seu coração.',
  [('Dios llama a ir','Deus chama para ir','Jon 1:2'),
   ('Dios da una segunda oportunidad','Deus dá uma segunda chance','Jon 3:1-2'),
   ('Dios es clemente y misericordioso','Deus é clemente e misericordioso','Jon 4:2')],
  'Desafíe a la iglesia a dejar los prejuicios y a amar a los pueblos que Dios ama.',
  'Desafie a igreja a deixar os preconceitos e a amar os povos que Deus ama.')

# ---------------------------------------------------------------- Espírito Santo
O('espirito','Espíritu Santo – Pentecostés','Espírito Santo – Pentecostes','Mensajes sobre la persona y la obra del Espíritu Santo.','Mensagens sobre a pessoa e a obra do Espírito Santo.')
S('At 2:4','El día de Pentecostés','O dia de Pentecostes',
  'En Pentecostés, la iglesia fue llena del Espíritu Santo y recibió poder para testificar.',
  'No Pentecostes, a igreja foi cheia do Espírito Santo e recebeu poder para testemunhar.',
  [('Unánimes en un mismo lugar','Unânimes no mesmo lugar','At 2:1'),
   ('La promesa cumplida','A promessa cumprida','At 2:16-17'),
   ('Fruto del poder: almas salvas','Fruto do poder: almas salvas','At 2:41')],
  'Invite a la iglesia a buscar con fe el bautismo en el Espíritu Santo y a orar por los que lo buscan.',
  'Convide a igreja a buscar com fé o batismo no Espírito Santo e ore pelos que o buscam.')
S('Jl 2:28','Derramaré mi Espíritu','Derramarei o meu Espírito',
  'Dios prometió derramar su Espíritu sobre toda carne, sin distinción de edad, sexo o condición.',
  'Deus prometeu derramar seu Espírito sobre toda carne, sem distinção de idade, sexo ou condição.',
  [('También sobre los siervos y las siervas','Também sobre os servos e as servas','Jl 2:29'),
   ('Agua sobre el sediento','Água sobre o sedento','Is 44:3'),
   ('Todo el que invoque será salvo','Todo aquele que invocar será salvo','Jl 2:32')],
  'Anime a jóvenes y mayores a buscar la llenura del Espíritu, porque la promesa es para todos.',
  'Anime jovens e idosos a buscar o enchimento do Espírito, porque a promessa é para todos.')
S('Jo 14:16-17','El Consolador','O Consolador',
  'Jesús prometió otro Consolador que estaría siempre con nosotros: el Espíritu de verdad.',
  'Jesus prometeu outro Consolador que estaria sempre conosco: o Espírito da verdade.',
  [('Él enseña y recuerda','Ele ensina e faz lembrar','Jo 14:26'),
   ('Él guía a toda verdad','Ele guia a toda a verdade','Jo 16:13'),
   ('Él convence de pecado','Ele convence do pecado','Jo 16:8')],
  'Anime a la iglesia a depender del Espíritu Santo en la oración, la lectura y el testimonio.',
  'Anime a igreja a depender do Espírito Santo na oração, na leitura e no testemunho.')
S('Gl 5:22-23','El fruto del Espíritu','O fruto do Espírito',
  'La vida llena del Espíritu se nota en el carácter: amor, gozo, paz y dominio propio.',
  'A vida cheia do Espírito se nota no caráter: amor, alegria, paz e domínio próprio.',
  [('Andar en el Espíritu','Andar no Espírito','Gl 5:16'),
   ('Permanecer en la vid','Permanecer na videira','Jo 15:5'),
   ('Por sus frutos se conocen','Pelos frutos se conhecem','Mt 7:20')],
  'Invite a cada creyente a pedir al Espíritu que forme en él el carácter de Cristo.',
  'Convide cada crente a pedir ao Espírito que forme nele o caráter de Cristo.')
S('Ef 5:18','Sean llenos del Espíritu','Enchei-vos do Espírito',
  'Ser lleno del Espíritu no es una experiencia de un solo día, sino una vida continua bajo su dirección.',
  'Ser cheio do Espírito não é uma experiência de um único dia, mas uma vida contínua sob a sua direção.',
  [('No entristecer al Espíritu','Não entristecer o Espírito','Ef 4:30'),
   ('Una vida de alabanza','Uma vida de louvor','Ef 5:19-20'),
   ('No apagar el Espíritu','Não apagar o Espírito','1Ts 5:19')],
  'Anime a la iglesia a buscar una llenura diaria del Espíritu Santo.',
  'Anime a igreja a buscar um enchimento diário do Espírito Santo.')
S('Jo 7:38','Ríos de agua viva','Rios de água viva',
  'Jesús invita a los sedientos a venir a él; de quien cree en él correrán ríos de agua viva.',
  'Jesus convida os sedentos a virem a ele; de quem nele crê correrão rios de água viva.',
  [('Tener sed de Dios','Ter sede de Deus','Jo 7:37'),
   ('Venir y beber','Vir e beber','Is 55:1'),
   ('El Espíritu dado a los que creen','O Espírito dado aos que creem','Jo 7:39')],
  'Invite a los sedientos a venir a Cristo y a dejar que el Espíritu fluya a través de ellos.',
  'Convide os sedentos a vir a Cristo e a deixar que o Espírito flua através deles.')

# ---------------------------------------------------------------- Oração
O('oracao','Oración y vigilia','Oração e vigília','Mensajes para cultos de oración y vigilias.','Mensagens para cultos de oração e vigílias.')
S('Mt 26:41','Velen y oren','Vigiai e orai',
  'En Getsemaní, Jesús enseñó que la oración vigilante nos guarda de caer en tentación.',
  'No Getsêmani, Jesus ensinou que a oração vigilante nos guarda de cair em tentação.',
  [('Jesús oró en la hora difícil','Jesus orou na hora difícil','Mt 26:39'),
   ('Orar sin cesar','Orar sem cessar','1Ts 5:17'),
   ('Perseverar velando con gratitud','Perseverar vigiando com gratidão','Cl 4:2')],
  'Anime a la iglesia a perseverar en la vigilia y a hacer de la oración un hábito diario.',
  'Anime a igreja a perseverar na vigília e a fazer da oração um hábito diário.')
S('Mt 7:7','Pidan, busquen, llamen','Pedi, buscai, batei',
  'Jesús nos invita a orar con perseverancia y confianza, porque tenemos un Padre que responde.',
  'Jesus nos convida a orar com perseverança e confiança, porque temos um Pai que responde.',
  [('Pedir conforme a su voluntad','Pedir segundo a sua vontade','1Jo 5:14'),
   ('Buscar de todo corazón','Buscar de todo o coração','Jr 29:13'),
   ('Un Padre que da el Espíritu Santo','Um Pai que dá o Espírito Santo','Lc 11:13')],
  'Anime a cada creyente a presentar sus peticiones con fe y a perseverar.',
  'Anime cada crente a apresentar seus pedidos com fé e a perseverar.')
S('Tg 5:16','La oración eficaz del justo','A oração eficaz do justo',
  'La oración del justo tiene mucho poder; Elías era un hombre como nosotros y Dios lo escuchó.',
  'A oração do justo pode muito; Elias era um homem como nós, e Deus o ouviu.',
  [('Orar en la aflicción','Orar na aflição','Tg 5:13'),
   ('Elías oró y Dios respondió','Elias orou e Deus respondeu','Tg 5:17-18'),
   ('Orar por todos los santos','Orar por todos os santos','Ef 6:18')],
  'Organice momentos para orar unos por otros durante la vigilia.',
  'Organize momentos para orar uns pelos outros durante a vigília.')
S('Lc 5:16','Jesús se apartaba a orar','Jesus se retirava para orar',
  'Si Jesús necesitaba apartarse para orar, cuánto más nosotros.',
  'Se Jesus precisava se retirar para orar, quanto mais nós.',
  [('Orar de madrugada','Orar de madrugada','Mc 1:35'),
   ('Orar en lo secreto','Orar em secreto','Mt 6:6'),
   ('Orar antes de decidir','Orar antes de decidir','Lc 6:12-13')],
  'Proponga a la iglesia un lugar y un horario fijo para orar cada día.',
  'Proponha à igreja um lugar e um horário fixo para orar todos os dias.')
S('At 16:25','Pablo y Silas a medianoche','Paulo e Silas à meia-noite',
  'En la cárcel y a medianoche, Pablo y Silas oraron y cantaron, y Dios intervino.',
  'Na prisão e à meia-noite, Paulo e Silas oraram e cantaram, e Deus interveio.',
  [('Alabar en la noche','Louvar na noite','Sl 42:8'),
   ('Cadenas que se sueltan','Correntes que se soltam','At 16:26'),
   ('Una familia alcanzada','Uma família alcançada','At 16:33')],
  'Anime a quienes viven su "medianoche" a orar y alabar en lugar de rendirse.',
  'Anime quem vive a sua "meia-noite" a orar e louvar em vez de desistir.')
S('Mt 6:9','La oración que Jesús enseñó','A oração que Jesus ensinou',
  'El Padre Nuestro es un modelo de oración: adoración, entrega, dependencia y perdón.',
  'O Pai Nosso é um modelo de oração: adoração, entrega, dependência e perdão.',
  [('Que se haga su voluntad','Que seja feita a sua vontade','Mt 6:10'),
   ('El pan de cada día','O pão de cada dia','Mt 6:11'),
   ('Perdonar como somos perdonados','Perdoar como somos perdoados','Mt 6:12')],
  'Guíe a la iglesia a orar siguiendo cada parte del Padre Nuestro.',
  'Guie a igreja a orar seguindo cada parte do Pai Nosso.')

# ---------------------------------------------------------------- Gratidão / Ano-novo
O('gratidao','Acción de gracias – Año nuevo','Ação de graças – Ano-novo','Mensajes para cultos de acción de gracias y de inicio de año.','Mensagens para cultos de ação de graças e de início de ano.')
S('1Sm 7:12','Hasta aquí nos ayudó el Señor','Até aqui nos ajudou o Senhor',
  'Samuel levantó una piedra para recordar la ayuda de Dios; mirar atrás nos da fe para seguir.',
  'Samuel levantou uma pedra para lembrar a ajuda de Deus; olhar para trás nos dá fé para seguir.',
  [('Recordar las obras de Dios','Lembrar as obras de Deus','Sl 77:11'),
   ('Sus misericordias son nuevas cada mañana','Suas misericórdias se renovam cada manhã','Lm 3:22-23'),
   ('Él completará la obra','Ele completará a obra','Fp 1:6')],
  'Pida a la iglesia que comparta testimonios de lo que Dios hizo durante el año.',
  'Peça à igreja que compartilhe testemunhos do que Deus fez durante o ano.')
S('1Ts 5:18','Dar gracias en todo','Dar graças em tudo',
  'La gratitud es la voluntad de Dios para nosotros, también en los días difíciles.',
  'A gratidão é a vontade de Deus para nós, também nos dias difíceis.',
  [('Gratitud en lugar de ansiedad','Gratidão em lugar de ansiedade','Fp 4:6'),
   ('Bendecir en todo tiempo','Bendizer em todo tempo','Sl 34:1'),
   ('Entrar con acción de gracias','Entrar com ações de graças','Sl 100:4')],
  'Anime a cada creyente a anotar motivos de gratitud y a expresarlos a Dios.',
  'Anime cada crente a anotar motivos de gratidão e a expressá-los a Deus.')
S('Lc 17:17','Los diez leprosos','Os dez leprosos',
  'Diez fueron sanados, pero solo uno volvió a dar gracias; la gratitud completa el milagro.',
  'Dez foram curados, mas só um voltou para agradecer; a gratidão completa o milagre.',
  [('Todos recibieron','Todos receberam','Lc 17:14'),
   ('Uno volvió a dar gloria a Dios','Um voltou para dar glória a Deus','Lc 17:15-16'),
   ('Una fe que salva','Uma fé que salva','Lc 17:19')],
  'Anime a la iglesia a volver a Jesús con gratitud por cada bendición recibida.',
  'Anime a igreja a voltar a Jesus com gratidão por cada bênção recebida.')
S('Fp 3:13','Olvidando lo que queda atrás','Esquecendo-me das coisas que ficaram para trás',
  'Para comenzar un nuevo año, debemos soltar el pasado y proseguir hacia la meta en Cristo.',
  'Para começar um novo ano, precisamos soltar o passado e prosseguir para o alvo em Cristo.',
  [('Dios hace algo nuevo','Deus faz algo novo','Is 43:18-19'),
   ('Proseguir a la meta','Prosseguir para o alvo','Fp 3:14'),
   ('Confiar el camino al Señor','Confiar o caminho ao Senhor','Pv 3:5-6')],
  'Invite a la iglesia a entregar a Dios los planes del nuevo año.',
  'Convide a igreja a entregar a Deus os planos do novo ano.')
S('Sl 90:12','Enséñanos a contar nuestros días','Ensina-nos a contar os nossos dias',
  'Reconocer que la vida es breve nos ayuda a vivir con sabiduría y a buscar a Dios.',
  'Reconhecer que a vida é breve nos ajuda a viver com sabedoria e a buscar a Deus.',
  [('Dios es eterno','Deus é eterno','Sl 90:2'),
   ('La vida es breve','A vida é breve','Sl 90:10'),
   ('Que Dios confirme nuestra obra','Que Deus confirme a nossa obra','Sl 90:17')],
  'Anime a la iglesia a usar bien el tiempo del nuevo año.',
  'Anime a igreja a usar bem o tempo do novo ano.')
S('Sl 103:1-2','Bendecir al Señor con toda el alma','Bendizer ao Senhor com toda a alma',
  'David se exhorta a sí mismo a bendecir a Dios y a no olvidar ninguno de sus beneficios.',
  'Davi exorta a si mesmo a bendizer a Deus e a não esquecer nenhum de seus benefícios.',
  [('Él perdona y sana','Ele perdoa e sara','Sl 103:3'),
   ('Él rescata y corona','Ele resgata e coroa','Sl 103:4'),
   ('Su misericordia es eterna','Sua misericórdia é eterna','Sl 103:17')],
  'Dirija a la iglesia en un tiempo de alabanza nombrando los beneficios de Dios.',
  'Dirija a igreja num tempo de louvor citando os benefícios de Deus.')

# ---------------------------------------------------------------- Aniversário da igreja
O('aniv','Aniversario de la iglesia','Aniversário da igreja','Mensajes para celebrar el aniversario de la iglesia local.','Mensagens para celebrar o aniversário da igreja local.')
S('Mt 16:18','Edificaré mi iglesia','Edificarei a minha igreja',
  'La iglesia pertenece a Cristo: él mismo la edifica, y ningún poder prevalecerá contra ella.',
  'A igreja pertence a Cristo: ele mesmo a edifica, e nenhum poder prevalecerá contra ela.',
  [('Cristo, el Hijo del Dios viviente','Cristo, o Filho do Deus vivo','Mt 16:16'),
   ('Comprada con su sangre','Comprada com o seu sangue','At 20:28'),
   ('Un edificio que crece','Um edifício que cresce','Ef 2:20-22')],
  'Anime a la iglesia a celebrar dando la gloria a Cristo, el Señor de la iglesia.',
  'Anime a igreja a celebrar dando a glória a Cristo, o Senhor da igreja.')
S('At 2:42','Una iglesia que persevera','Uma igreja que persevera',
  'La primera iglesia perseveraba en la doctrina, la comunión, el partimiento del pan y la oración.',
  'A primeira igreja perseverava na doutrina, na comunhão, no partir do pão e nas orações.',
  [('Generosidad entre hermanos','Generosidade entre irmãos','At 2:44-45'),
   ('Unidad y alegría','Unidade e alegria','At 2:46'),
   ('El Señor añadía','O Senhor acrescentava','At 2:47')],
  'Invite a la iglesia a renovar su compromiso con estos pilares para la nueva etapa.',
  'Convide a igreja a renovar seu compromisso com esses pilares para a nova etapa.')
S('Fp 1:6','El que comenzó la buena obra','Aquele que começou a boa obra',
  'Dios comenzó esta obra y la llevará hasta el final; eso nos llena de gratitud y confianza.',
  'Deus começou esta obra e a levará até o fim; isso nos enche de gratidão e confiança.',
  [('Gratitud por los hermanos','Gratidão pelos irmãos','Fp 1:3'),
   ('Compañeros en el evangelio','Companheiros no evangelho','Fp 1:5'),
   ('Crecer en amor','Crescer em amor','Fp 1:9')],
  'Honre a quienes sirvieron en la historia de la iglesia y anime a la nueva generación.',
  'Honre os que serviram na história da igreja e anime a nova geração.')
S('1Co 12:12','Un cuerpo, muchos miembros','Um corpo, muitos membros',
  'La iglesia es un cuerpo con muchos miembros; cada uno es necesario para que crezca.',
  'A igreja é um corpo com muitos membros; cada um é necessário para que ela cresça.',
  [('Diversidad de dones','Diversidade de dons','1Co 12:4'),
   ('Ningún miembro sobra','Nenhum membro sobra','1Co 12:21'),
   ('Cuidarse unos a otros','Cuidar uns dos outros','1Co 12:26')],
  'Anime a cada miembro a descubrir y usar su don en la iglesia.',
  'Anime cada membro a descobrir e usar seu dom na igreja.')
S('Sl 126:3','Grandes cosas ha hecho el Señor','Grandes coisas fez o Senhor',
  'Al celebrar un nuevo año de la iglesia, recordamos con alegría las grandes cosas que Dios hizo.',
  'Ao celebrar mais um ano da igreja, lembramos com alegria as grandes coisas que Deus fez.',
  [('Recordar el camino recorrido','Lembrar o caminho percorrido','Dt 8:2'),
   ('Sembrar con lágrimas, cosechar con gozo','Semear com lágrimas, colher com alegria','Sl 126:5-6'),
   ('Una gloria mayor por delante','Uma glória maior pela frente','Ag 2:9')],
  'Invite a la iglesia a dar gracias por el pasado y a mirar con fe hacia el futuro.',
  'Convide a igreja a agradecer pelo passado e a olhar com fé para o futuro.')
S('Ap 3:8','Una puerta abierta','Uma porta aberta',
  'A una iglesia con poca fuerza pero fiel, Cristo le promete una puerta abierta que nadie puede cerrar.',
  'A uma igreja com pouca força, mas fiel, Cristo promete uma porta aberta que ninguém pode fechar.',
  [('Guardar su palabra con paciencia','Guardar a sua palavra com paciência','Ap 3:10'),
   ('Retener lo que tenemos','Reter o que temos','Ap 3:11'),
   ('Columnas en el templo de Dios','Colunas no templo de Deus','Ap 3:12')],
  'Anime a la iglesia a permanecer fiel y a aprovechar las puertas que Dios abre.',
  'Anime a igreja a permanecer fiel e a aproveitar as portas que Deus abre.')

# ---------------------------------------------------------------- Consagração de obreiros
O('consag','Consagración de obreros','Consagração de obreiros','Mensajes para la consagración e instalación de obreros, diáconos y ministros.','Mensagens para a consagração e posse de obreiros, diáconos e ministros.')
S('1Tm 3:2','El carácter del obrero','O caráter do obreiro',
  'Antes de los dones, Dios mira el carácter: el obrero debe ser irreprensible en su vida y en su casa.',
  'Antes dos dons, Deus olha o caráter: o obreiro deve ser irrepreensível na vida e na casa.',
  [('Irreprensible como administrador de Dios','Irrepreensível como despenseiro de Deus','Tt 1:7'),
   ('Gobernar bien la propia casa','Governar bem a própria casa','1Tm 3:4-5'),
   ('Probados primero','Provados primeiro','1Tm 3:10')],
  'Exhorte a los consagrados a cuidar su testimonio en público y en privado.',
  'Exorte os consagrados a cuidar do seu testemunho em público e em particular.')
S('At 6:3','Llenos del Espíritu y de sabiduría','Cheios do Espírito e de sabedoria',
  'Los primeros diáconos fueron escogidos por su buen testimonio, su llenura del Espíritu y su sabiduría.',
  'Os primeiros diáconos foram escolhidos pelo bom testemunho, por serem cheios do Espírito e pela sabedoria.',
  [('Servir para que la Palabra avance','Servir para que a Palavra avance','At 6:4'),
   ('Hombres llenos de fe','Homens cheios de fé','At 6:5'),
   ('La Palabra crecía','A Palavra crescia','At 6:7')],
  'Anime a los consagrados a ver su servicio como parte del avance del evangelio.',
  'Anime os consagrados a ver seu serviço como parte do avanço do evangelho.')
S('1Pe 5:2','Apacienten la grey','Apascentai o rebanho',
  'El liderazgo en la iglesia es cuidar del rebaño de Dios con buena voluntad y sin buscar ganancia.',
  'A liderança na igreja é cuidar do rebanho de Deus de boa vontade e sem buscar ganho.',
  [('Ejemplo para la grey','Exemplo para o rebanho','1Pe 5:3'),
   ('La corona del Príncipe de los pastores','A coroa do Sumo Pastor','1Pe 5:4'),
   ('Revestidos de humildad','Revestidos de humildade','1Pe 5:5')],
  'Exhorte a los consagrados a servir con humildad, recordando que rendirán cuentas al Señor.',
  'Exorte os consagrados a servir com humildade, lembrando que prestarão contas ao Senhor.')
S('2Tm 2:15','Obrero aprobado','Obreiro aprovado',
  'Dios busca obreros que no tengan de qué avergonzarse y que usen bien la Palabra de verdad.',
  'Deus busca obreiros que não tenham do que se envergonhar e que manejem bem a Palavra da verdade.',
  [('Fortalecidos en la gracia','Fortalecidos na graça','2Tm 2:1'),
   ('Soldados que soportan','Soldados que suportam','2Tm 2:3'),
   ('Predicar la Palabra a tiempo y fuera de tiempo','Pregar a Palavra a tempo e fora de tempo','2Tm 4:2')],
  'Anime a los consagrados a dedicarse al estudio de la Biblia y a la oración.',
  'Anime os consagrados a se dedicar ao estudo da Bíblia e à oração.')
S('Jo 13:14-15','Servir como Jesús','Servir como Jesus',
  'Jesús lavó los pies de sus discípulos y nos dejó el ejemplo: el líder del Reino es un siervo.',
  'Jesus lavou os pés dos discípulos e nos deixou o exemplo: o líder do Reino é um servo.',
  [('El mayor es el que sirve','O maior é o que serve','Mc 10:43-44'),
   ('El sentir de Cristo','O sentimento de Cristo','Fp 2:5'),
   ('Bienaventurados si lo hacen','Bem-aventurados se o praticarem','Jo 13:17')],
  'Recuerde a los consagrados que el cargo es una oportunidad para servir, no un título.',
  'Lembre aos consagrados que o cargo é uma oportunidade para servir, não um título.')
S('1Co 4:2','Fieles en lo encomendado','Fiéis no que foi confiado',
  'Lo que Dios pide a sus administradores no es fama ni éxito, sino fidelidad.',
  'O que Deus pede aos seus despenseiros não é fama nem sucesso, mas fidelidade.',
  [('Servidores de Cristo','Ministros de Cristo','1Co 4:1'),
   ('El siervo fiel y prudente','O servo fiel e prudente','Mt 24:45'),
   ('Bien, siervo bueno y fiel','Muito bem, servo bom e fiel','Mt 25:21')],
  'Anime a los consagrados a ser fieles en lo pequeño, sabiendo que el Señor recompensa.',
  'Anime os consagrados a serem fiéis no pequeno, sabendo que o Senhor recompensa.')

# ---------------------------------------------------------------- 15 anos
O('quinze','Quince años','15 anos','Mensajes para la celebración de los quince años de una joven.','Mensagens para a celebração dos 15 anos de uma jovem.')
S('Jr 29:11','Una vida en las manos de Dios','Uma vida nas mãos de Deus',
  'Dios tiene pensamientos de paz y un futuro con esperanza para la joven que confía en él.',
  'Deus tem pensamentos de paz e um futuro com esperança para a jovem que confia nele.',
  [('Dios la conoció desde el principio','Deus a conheceu desde o princípio','Sl 139:16'),
   ('Los que buscan a Dios lo hallan','Os que buscam a Deus o acham','Pv 8:17'),
   ('Encomendar el camino al Señor','Entregar o caminho ao Senhor','Sl 37:5')],
  'Ore por la quinceañera entregando su futuro en las manos de Dios.',
  'Ore pela aniversariante entregando o seu futuro nas mãos de Deus.')
S('1Pe 3:3-4','La belleza que agrada a Dios','A beleza que agrada a Deus',
  'La verdadera belleza no está solo en lo exterior, sino en un corazón que agrada a Dios.',
  'A verdadeira beleza não está só no exterior, mas em um coração que agrada a Deus.',
  [('Dios mira el corazón','Deus olha o coração','1Sm 16:7'),
   ('La gracia que trae honra','A graça que traz honra','Pv 11:16'),
   ('Vestirse de bondad','Vestir-se de bondade','Cl 3:12')],
  'Anime a la joven a cuidar su corazón tanto como cuida su apariencia.',
  'Anime a jovem a cuidar do coração tanto quanto cuida da aparência.')
S('Lc 2:52','Crecer como Jesús','Crescer como Jesus',
  'Jesús crecía en sabiduría, en estatura y en gracia con Dios y con los hombres: un modelo para crecer.',
  'Jesus crescia em sabedoria, em estatura e em graça diante de Deus e dos homens: um modelo para crescer.',
  [('Crecer en sabiduría','Crescer em sabedoria','Pv 4:7'),
   ('Cuidar el cuerpo, templo del Espíritu','Cuidar do corpo, templo do Espírito','1Co 6:19-20'),
   ('Gracia delante de Dios y de los hombres','Graça diante de Deus e dos homens','Pv 3:3-4')],
  'Anime a la joven a crecer de forma equilibrada en lo espiritual, lo personal y lo social.',
  'Anime a jovem a crescer de forma equilibrada no espiritual, no pessoal e no social.')
S('Pv 4:23','Guardar el corazón','Guardar o coração',
  'De lo que guardamos en el corazón depende el rumbo de toda la vida.',
  'Daquilo que guardamos no coração depende o rumo de toda a vida.',
  [('Cuidar lo que se escucha','Cuidar do que se ouve','Pv 4:20-21'),
   ('Cuidar lo que se mira','Cuidar do que se olha','Pv 4:25'),
   ('Cuidar por dónde se anda','Cuidar por onde se anda','Pv 4:26')],
  'Anime a la joven a elegir con cuidado lo que alimenta su corazón.',
  'Anime a jovem a escolher com cuidado o que alimenta o seu coração.')
S('Pv 13:20','Amistades que edifican','Amizades que edificam',
  'Las amistades influyen en el futuro; quien anda con sabios se hace sabio.',
  'As amizades influenciam o futuro; quem anda com os sábios se torna sábio.',
  [('Compañeros de los que temen a Dios','Companheiros dos que temem a Deus','Sl 119:63'),
   ('Las malas compañías','As más companhias','1Co 15:33'),
   ('Jesús, el amigo fiel','Jesus, o amigo fiel','Jo 15:14-15')],
  'Anime a la joven a rodearse de amistades que la acerquen a Dios.',
  'Anime a jovem a cercar-se de amizades que a aproximem de Deus.')
S('Sl 1:3','Como árbol plantado junto a las aguas','Como árvore plantada junto às águas',
  'La joven que se aparta del mal y ama la Palabra de Dios será como un árbol que da fruto.',
  'A jovem que se afasta do mal e ama a Palavra de Deus será como uma árvore que dá fruto.',
  [('Lo que se evita','O que se evita','Sl 1:1'),
   ('Lo que se ama','O que se ama','Sl 1:2'),
   ('Raíces junto a las aguas','Raízes junto às águas','Jr 17:7-8')],
  'Anime a la joven a echar raíces en la Palabra de Dios desde ahora.',
  'Anime a jovem a criar raízes na Palavra de Deus desde agora.')

# ---------------------------------------------------------------- Fé e cura
O('cura','Fe y sanidad','Fé e cura','Mensajes sobre la fe y el poder de Dios para sanar.','Mensagens sobre a fé e o poder de Deus para curar.')
S('Ex 15:26','El Señor que sana','O Senhor que sara',
  'Dios se reveló a su pueblo como el Señor que sana; su poder alcanza el cuerpo y el alma.',
  'Deus se revelou ao seu povo como o Senhor que sara; seu poder alcança o corpo e a alma.',
  [('Él sana a los quebrantados de corazón','Ele sara os quebrantados de coração','Sl 147:3'),
   ('Jesús sanaba toda enfermedad','Jesus curava toda enfermidade','Mt 4:23'),
   ('Por sus heridas fuimos sanados','Pelas suas feridas fomos sarados','1Pe 2:24')],
  'Ore por los enfermos con fe y anímelos a confiar en el Dios que sana.',
  'Ore pelos enfermos com fé e anime-os a confiar no Deus que sara.')
S('Mc 2:5','El paralítico y sus cuatro amigos','O paralítico e seus quatro amigos',
  'Cuatro amigos llevaron a un paralítico a Jesús, y él le dio perdón y sanidad.',
  'Quatro amigos levaram um paralítico a Jesus, e ele lhe deu perdão e cura.',
  [('Amigos que llevan a Jesús','Amigos que levam a Jesus','Mc 2:3-4'),
   ('Autoridad para perdonar','Autoridade para perdoar','Mc 2:10'),
   ('Levántate y anda','Levanta-te e anda','Mc 2:11-12')],
  'Anime a la iglesia a llevar en oración a los enfermos y necesitados hasta Jesús.',
  'Anime a igreja a levar em oração os enfermos e necessitados até Jesus.')
S('Mc 10:47','Bartimeo: una fe que clama','Bartimeu: uma fé que clama',
  'Bartimeo clamó a Jesús aunque otros lo mandaban callar, y recibió la vista.',
  'Bartimeu clamou a Jesus mesmo quando outros o mandavam calar, e recebeu a vista.',
  [('Clamar con más fuerza','Clamar ainda mais','Mc 10:48'),
   ('Dejar el manto y acercarse','Largar a capa e se aproximar','Mc 10:50'),
   ('Ver y seguir a Jesús','Ver e seguir a Jesus','Mc 10:52')],
  'Invite a quienes necesitan un milagro a clamar a Jesús con fe perseverante.',
  'Convide os que precisam de um milagre a clamar a Jesus com fé perseverante.')
S('Tg 5:14-15','La oración de fe por el enfermo','A oração da fé pelo enfermo',
  'La Escritura enseña a llamar a los ancianos de la iglesia para orar y ungir al enfermo con fe.',
  'A Escritura ensina a chamar os presbíteros da igreja para orar e ungir o enfermo com fé.',
  [('Señales que siguen a los que creen','Sinais que seguem os que creem','Mc 16:17-18'),
   ('Por la fe en su nombre','Pela fé em seu nome','At 3:16'),
   ('Clamar a Dios por sanidad','Clamar a Deus por cura','Sl 30:2')],
  'Haga un tiempo de oración y unción por los enfermos con orden y reverencia.',
  'Faça um tempo de oração e unção pelos enfermos com ordem e reverência.')
S('Hb 13:8','Jesucristo es el mismo','Jesus Cristo é o mesmo',
  'El Jesús que sanaba en los evangelios es el mismo hoy; su compasión y su poder no cambiaron.',
  'O Jesus que curava nos evangelhos é o mesmo hoje; sua compaixão e seu poder não mudaram.',
  [('En el nombre de Jesús','Em nome de Jesus','At 3:6'),
   ('Su compasión por los enfermos','Sua compaixão pelos enfermos','Mt 14:14'),
   ('Todo es posible para el que cree','Tudo é possível ao que crê','Mc 9:23')],
  'Anime a la iglesia a orar con fe, sabiendo que Jesús sigue obrando hoy.',
  'Anime a igreja a orar com fé, sabendo que Jesus continua agindo hoje.')
S('2Co 12:9','Su gracia es suficiente','A sua graça basta',
  'Dios sana, y también sostiene con su gracia a quien todavía espera la respuesta.',
  'Deus cura, e também sustenta com sua graça quem ainda espera a resposta.',
  [('Pablo oró con insistencia','Paulo orou com insistência','2Co 12:8'),
   ('Fuertes en la debilidad','Fortes na fraqueza','2Co 12:10'),
   ('Todo obra para bien','Todas as coisas cooperam para o bem','Rm 8:28')],
  'Con sensibilidad, anime a quienes siguen enfermos a no perder la fe ni la esperanza.',
  'Com sensibilidade, anime os que continuam enfermos a não perder a fé nem a esperança.')

# ---------------------------------------------------------------- Mordomia
O('mordomia','Mayordomía y ofrendas','Mordomia e ofertas','Mensajes sobre la administración fiel de los bienes, los diezmos y las ofrendas.','Mensagens sobre a administração fiel dos bens, dos dízimos e das ofertas.')
S('Ml 3:10','Traigan todos los diezmos','Trazei todos os dízimos',
  'El diezmo es una expresión de fidelidad y confianza en Dios, que promete cuidar de su pueblo.',
  'O dízimo é uma expressão de fidelidade e confiança em Deus, que promete cuidar do seu povo.',
  [('Dios es el dueño de todo','Deus é o dono de tudo','Sl 24:1'),
   ('Abraham dio el diezmo','Abraão deu o dízimo','Hb 7:2'),
   ('Dios guarda el fruto','Deus guarda o fruto','Ml 3:11')],
  'Anime a la iglesia a ser fiel en los diezmos como acto de adoración, no por obligación.',
  'Anime a igreja a ser fiel nos dízimos como ato de adoração, não por obrigação.')
S('2Co 9:7','Dios ama al dador alegre','Deus ama quem dá com alegria',
  'Dios no mira solo cuánto damos, sino la alegría y la disposición con que damos.',
  'Deus não olha só quanto damos, mas a alegria e a disposição com que damos.',
  [('Quien siembra con generosidad','Quem semeia com fartura','2Co 9:6'),
   ('Dios es poderoso para proveer','Deus é poderoso para prover','2Co 9:8'),
   ('Dar produce acción de gracias','Dar produz ações de graças','2Co 9:11-12')],
  'Anime a cada creyente a dar con alegría, según lo que decidió en su corazón.',
  'Anime cada crente a dar com alegria, conforme decidiu no coração.')
S('Mc 12:43','La ofrenda de la viuda','A oferta da viúva',
  'Jesús valoró la ofrenda de la viuda porque dio todo lo que tenía, con fe.',
  'Jesus valorizou a oferta da viúva porque ela deu tudo o que tinha, com fé.',
  [('Jesús mira cómo damos','Jesus observa como damos','Mc 12:41'),
   ('Dar lo que cuesta','Dar o que custa','2Sm 24:24'),
   ('Dar con fe','Dar com fé','Mc 12:44')],
  'Anime a la iglesia a ofrendar con sinceridad, sin compararse con los demás.',
  'Anime a igreja a ofertar com sinceridade, sem se comparar com os outros.')
S('Lc 16:10','Fieles en lo poco','Fiéis no pouco',
  'La manera en que administramos el dinero muestra nuestra fidelidad a Dios.',
  'A maneira como administramos o dinheiro mostra a nossa fidelidade a Deus.',
  [('Todo viene de Dios','Tudo vem de Deus','1Cr 29:14'),
   ('No servir a dos señores','Não servir a dois senhores','Lc 16:13'),
   ('Tesoros en el cielo','Tesouros no céu','Mt 6:20-21')],
  'Anime a la iglesia a administrar sus finanzas con orden, honestidad y generosidad.',
  'Anime a igreja a administrar suas finanças com ordem, honestidade e generosidade.')
S('2Co 8:5','Primero se dieron al Señor','Primeiro se deram ao Senhor',
  'Las iglesias de Macedonia dieron con generosidad en medio de la pobreza porque primero se entregaron a Dios.',
  'As igrejas da Macedônia deram com generosidade no meio da pobreza porque primeiro se entregaram a Deus.',
  [('Generosos en la pobreza','Generosos na pobreza','2Co 8:2'),
   ('Dar de buena voluntad','Dar de boa vontade','2Co 8:3'),
   ('El ejemplo de Cristo','O exemplo de Cristo','2Co 8:9')],
  'Recuerde que la ofrenda comienza con una vida entregada al Señor.',
  'Lembre que a oferta começa com uma vida entregue ao Senhor.')
S('Pv 3:9-10','Honrar a Dios con los bienes','Honrar a Deus com os bens',
  'Honrar a Dios con las primicias es reconocer que él provee y confiar en su cuidado.',
  'Honrar a Deus com as primícias é reconhecer que ele provê e confiar no seu cuidado.',
  [('Dios suple toda necesidad','Deus supre toda necessidade','Fp 4:19'),
   ('Gran ganancia es la piedad con contentamiento','Grande ganho é a piedade com contentamento','1Tm 6:6-8'),
   ('Buscar primero el Reino','Buscar primeiro o Reino','Mt 6:33')],
  'Anime a la iglesia a poner a Dios en primer lugar en sus finanzas.',
  'Anime a igreja a colocar Deus em primeiro lugar nas finanças.')

# ---------------------------------------------------------------- Avivamento
O('avivamento','Avivamiento','Avivamento','Mensajes para cultos de avivamiento y renovación espiritual.','Mensagens para cultos de avivamento e renovação espiritual.')
S('2Cr 7:14','Si mi pueblo se humilla','Se o meu povo se humilhar',
  'El avivamiento comienza cuando el pueblo de Dios se humilla, ora, busca su rostro y se aparta del pecado.',
  'O avivamento começa quando o povo de Deus se humilha, ora, busca a sua face e se afasta do pecado.',
  [('Humillarse delante de Dios','Humilhar-se diante de Deus','Tg 4:10'),
   ('Buscar su rostro','Buscar a sua face','Sl 27:8'),
   ('Dejar los malos caminos','Deixar os maus caminhos','Is 55:7')],
  'Convoque a la iglesia a un tiempo de humillación y oración.',
  'Convoque a igreja a um tempo de humilhação e oração.')
S('Hc 3:2','Una oración por avivamiento','Uma oração por avivamento',
  'Habacuc pidió a Dios que avivara su obra en medio de los tiempos; el avivamiento se pide en oración.',
  'Habacuque pediu a Deus que avivasse a sua obra no meio dos anos; o avivamento se pede em oração.',
  [('Clamar por nueva vida','Clamar por nova vida','Sl 85:6'),
   ('No dar descanso en la oración','Não dar descanso na oração','Is 62:6-7'),
   ('Nuevas fuerzas para los que esperan','Novas forças para os que esperam','Is 40:31')],
  'Anime a la iglesia a orar con perseverancia por un avivamiento.',
  'Anime a igreja a orar com perseverança por um avivamento.')
S('Ez 37:5','El valle de los huesos secos','O vale dos ossos secos',
  'Donde no hay esperanza, la Palabra y el Espíritu de Dios pueden traer nueva vida.',
  'Onde não há esperança, a Palavra e o Espírito de Deus podem trazer nova vida.',
  [('Dios conoce la sequedad','Deus conhece a sequidão','Ez 37:2-3'),
   ('Profetizar la Palabra','Profetizar a Palavra','Ez 37:7'),
   ('El Espíritu da vida','O Espírito dá vida','Ez 37:10')],
  'Anime a quienes se sienten secos espiritualmente a esperar una obra nueva de Dios.',
  'Anime quem se sente seco espiritualmente a esperar uma nova obra de Deus.')
S('Ap 2:4','Volver al primer amor','Voltar ao primeiro amor',
  'Una iglesia puede trabajar mucho y aun así haber dejado su primer amor; Cristo la llama a volver.',
  'Uma igreja pode trabalhar muito e mesmo assim ter deixado o primeiro amor; Cristo a chama a voltar.',
  [('Recordar, arrepentirse y volver','Lembrar, arrepender-se e voltar','Ap 2:5'),
   ('Una tristeza que lleva al arrepentimiento','Uma tristeza que leva ao arrependimento','2Co 7:10'),
   ('Buscar las sendas antiguas','Buscar as veredas antigas','Jr 6:16')],
  'Invite a la iglesia a renovar su amor por Cristo con arrepentimiento sincero.',
  'Convide a igreja a renovar seu amor por Cristo com arrependimento sincero.')
S('Sl 51:10','Un corazón limpio y renovado','Um coração puro e renovado',
  'El avivamiento personal comienza con un corazón que reconoce su pecado y pide ser renovado.',
  'O avivamento pessoal começa com um coração que reconhece seu pecado e pede para ser renovado.',
  [('Reconocer el pecado','Reconhecer o pecado','Sl 51:3-4'),
   ('Volver al gozo de la salvación','Voltar à alegria da salvação','Sl 51:12'),
   ('Enseñar a otros los caminos de Dios','Ensinar a outros os caminhos de Deus','Sl 51:13')],
  'Dé un tiempo para la confesión personal y la renovación delante de Dios.',
  'Dê um tempo para a confissão pessoal e a renovação diante de Deus.')
S('Lv 6:13','El fuego del altar no se apagará','O fogo do altar não se apagará',
  'Así como el fuego del altar debía arder siempre, la vida espiritual necesita cuidado constante.',
  'Assim como o fogo do altar devia arder sempre, a vida espiritual precisa de cuidado constante.',
  [('Fervientes en espíritu','Fervorosos no espírito','Rm 12:11'),
   ('El peligro de la tibieza','O perigo da mornidão','Ap 3:15-16'),
   ('Un sacrificio vivo','Um sacrifício vivo','Rm 12:1')],
  'Anime a la iglesia a mantener encendido el fuego con oración, Palabra y servicio diarios.',
  'Anime a igreja a manter o fogo aceso com oração, Palavra e serviço diários.')

# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas)\b',re.I)
KEYS='ceia evang jovens casam funeral batismo natal pascoa maes pais familia criancas mulheres homens missoes espirito oracao gratidao aniv consag quinze cura mordomia avivamento'.split()
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
    for r,ws in bases.items():
        if len(ws)>1:err.append('texto-base repetido %s: %s'%(r,', '.join(ws)))
    if '--print' in sys.argv:
        for w,r in refs:
            print('==',w,r)
            for b,c,v in verses(r):
                print('  PT %d:%d %s'%(c,v,PT[b][c-1][v-1]));print('  ES %d:%d %s'%(c,v,ES[b][c-1][v-1]))
    if err:
        print('\n'.join(err));sys.exit(1)
    out=os.path.join(HERE,'sugestoes.json')
    json.dump({'occ':OCC},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['s']) for o in OCC)
    print('ok: %d ocasiões x 6 = %d sugestões, %d referências -> %s'%(len(OCC),n,len(refs),out))
if __name__=='__main__':main()
