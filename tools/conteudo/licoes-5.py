# Lições de estudo bíblico para células e Escola Dominical (Meu Púlpito) — parte 4.
# 2 séries x 6 lições: milagres, eusou. Cada texto é um par [ES, PT].
# Cada lição: título, texto-base, objetivo, quebra-gelo, introdução (para o líder ler),
# 3 pontos com explicação e referência, perguntas de discussão, aplicação, versículo para memorizar e oração.
# Uso: python3 tools/conteudo/licoes-5.py          -> valida e grava tools/conteudo/licoes-5.json
#      python3 tools/conteudo/licoes-5.py --print  -> imprime o texto de cada referência nas duas Bíblias
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





# ================================================================ Heróis da fé
S('herois','Héroes de la fe','Heróis da fé',
  'Seis estudios sobre hombres y mujeres de Hebreos 11 que confiaron en Dios en tiempos difíciles.',
  'Seis estudos sobre homens e mulheres de Hebreus 11 que confiaram em Deus em tempos difíceis.')

L('Gn 6:13-14',
  ('Noé: obedecer cuando nadie entiende','Noé: obedecer quando ninguém entende'),
  ('Aprender de Noé a obedecer a Dios con fe aunque la mayoría se burle o no entienda.',
   'Aprender com Noé a obedecer a Deus com fé mesmo quando a maioria zomba ou não entende.'),
  ('¿Alguna vez hicieron algo correcto que los demás consideraron extraño?',
   'Vocês já fizeram algo certo que os outros acharam estranho?'),
  ('En tiempos de Noé, la tierra estaba llena de violencia y corrupción. Dios le habló de un juicio que vendría y le mandó construir un arca de madera, con medidas precisas, para salvar a su familia y a los animales. Construir un barco tan grande lejos del mar debió parecer una locura. Hebreos dice que por la fe Noé, advertido por Dios de cosas que aún no se veían, preparó el arca. Hoy vamos a ver cómo la obediencia de un hombre cambió la historia.',
   'No tempo de Noé, a terra estava cheia de violência e corrupção. Deus lhe falou de um juízo que viria e mandou que construísse uma arca de madeira, com medidas precisas, para salvar a sua família e os animais. Construir um barco tão grande longe do mar deve ter parecido loucura. Hebreus diz que pela fé Noé, avisado por Deus de coisas que ainda não se viam, preparou a arca. Hoje vamos ver como a obediência de um homem mudou a história.'),
  [('Un hombre justo en una generación corrupta','Um homem justo numa geração corrompida',
    'La Biblia dice que Noé halló gracia ante los ojos de Jehová y que era un varón justo que caminaba con Dios. No vivía como todos vivían. Ser diferente no es fácil, pero es posible cuando caminamos con Dios cada día, aun en medio de una sociedad que se aleja de él.',
    'A Bíblia diz que Noé achou graça aos olhos do Senhor e que era um homem justo que andava com Deus. Ele não vivia como todos viviam. Ser diferente não é fácil, mas é possível quando andamos com Deus todos os dias, mesmo no meio de uma sociedade que se afasta dele.','Gn 6:8-9'),
   ('Obediencia en los detalles','Obediência nos detalhes',
    'Dios dio instrucciones precisas: material, medidas, ventana y puerta. La Biblia dice que Noé hizo conforme a todo lo que Dios le mandó. La fe verdadera no obedece a medias ni cambia las instrucciones a su gusto. Muchas bendiciones dependen de la obediencia en lo que parece pequeño.',
    'Deus deu instruções precisas: material, medidas, janela e porta. A Bíblia diz que Noé fez conforme tudo o que Deus lhe mandou. A fé verdadeira não obedece pela metade nem muda as instruções a seu gosto. Muitas bênçãos dependem da obediência no que parece pequeno.','Gn 6:22'),
   ('Una fe que salva a la familia','Uma fé que salva a família',
    'Hebreos dice que Noé preparó el arca para la salvación de su casa. Su obediencia no lo benefició solo a él: su esposa, sus hijos y sus nueras entraron en el arca. La fe de un padre o de una madre puede ser el refugio que Dios usa para proteger a toda la familia.',
    'Hebreus diz que Noé preparou a arca para a salvação da sua casa. A sua obediência não beneficiou só a ele: a sua esposa, os seus filhos e as suas noras entraram na arca. A fé de um pai ou de uma mãe pode ser o refúgio que Deus usa para proteger a família inteira.','Hb 11:7')],
  [('¿Qué cosas hace hoy la mayoría que un creyente no debería hacer?',
    'Que coisas a maioria faz hoje que um crente não deveria fazer?'),
   ('¿Por qué es importante obedecer a Dios también en los detalles?',
    'Por que é importante obedecer a Deus também nos detalhes?'),
   ('¿Cómo afecta nuestra fe a las personas de nuestra casa?',
    'Como a nossa fé afeta as pessoas da nossa casa?'),
   ('¿Qué arca les está pidiendo Dios construir en este tiempo?',
    'Que arca Deus está pedindo que vocês construam neste tempo?')],
  ('Identifique una instrucción de la Palabra que viene postergando y obedézcala esta semana.',
   'Identifique uma instrução da Palavra que você vem adiando e obedeça a ela nesta semana.'),
  'Hb 11:7',
  ('Señor, danos la fe de Noé para obedecerte aunque otros no entiendan. Que nuestra obediencia sea refugio y bendición para nuestras familias. Amén.',
   'Senhor, dá-nos a fé de Noé para te obedecer mesmo quando outros não entendem. Que a nossa obediência seja refúgio e bênção para as nossas famílias. Amém.'))

L('Gn 12:1-4',
  ('Abraham: salir sin saber a dónde','Abraão: sair sem saber para onde'),
  ('Aprender de Abraham a confiar en Dios cuando nos llama a dejar lo conocido.',
   'Aprender com Abraão a confiar em Deus quando ele nos chama a deixar o que é conhecido.'),
  ('¿Se mudaron alguna vez de ciudad o de casa? ¿Qué fue lo más difícil?',
   'Vocês já se mudaram de cidade ou de casa? O que foi mais difícil?'),
  ('Abram vivía en Harán con su familia cuando Dios le habló: «vete de tu tierra y de tu parentela a la tierra que te mostraré». No le dio un mapa ni una fecha de llegada, pero sí una promesa: haría de él una gran nación y en él serían benditas todas las familias de la tierra. Abram salió con setenta y cinco años. Hebreos dice que salió sin saber a dónde iba. Hoy vamos a ver cómo es la fe que se pone en camino.',
   'Abrão vivia em Harã com a sua família quando Deus lhe falou: sai da tua terra e da tua parentela para a terra que eu te mostrarei. Não lhe deu um mapa nem uma data de chegada, mas deu uma promessa: faria dele uma grande nação e nele seriam benditas todas as famílias da terra. Abrão saiu com setenta e cinco anos. Hebreus diz que ele saiu sem saber para onde ia. Hoje vamos ver como é a fé que se põe a caminho.'),
  [('El llamado a salir','O chamado para sair',
    'Dios llamó a Abram a dejar su tierra, su parentela y la casa de su padre. Seguir a Dios a veces implica dejar seguridades, costumbres o relaciones que nos atan. Abram no sabía todo, pero conocía a quien lo llamaba. La fe no es tener todas las respuestas, sino confiar en quien las tiene.',
    'Deus chamou Abrão para deixar a sua terra, a sua parentela e a casa do seu pai. Seguir Deus às vezes implica deixar seguranças, costumes ou relacionamentos que nos prendem. Abrão não sabia tudo, mas conhecia quem o chamava. A fé não é ter todas as respostas, mas confiar em quem as tem.','Gn 12:1'),
   ('Bendecido para bendecir','Abençoado para abençoar',
    'La promesa de Dios no era solo para Abram: en él serían benditas todas las familias de la tierra. Pablo explica que esa bendición llegó a todas las naciones por medio de Cristo, descendiente de Abraham. Dios nos bendice para que seamos canal de bendición para otros.',
    'A promessa de Deus não era só para Abrão: nele seriam benditas todas as famílias da terra. Paulo explica que essa bênção chegou a todas as nações por meio de Cristo, descendente de Abraão. Deus nos abençoa para que sejamos canal de bênção para os outros.','Gl 3:8-9'),
   ('Peregrinos con la mirada en la ciudad de Dios','Peregrinos com o olhar na cidade de Deus',
    'Hebreos dice que Abraham habitó en tiendas como extranjero, porque esperaba la ciudad que tiene fundamentos, cuyo arquitecto y constructor es Dios. Vivía en la tierra prometida, pero sabía que su esperanza final estaba más allá. El creyente también vive como peregrino, con la mirada puesta en lo eterno.',
    'Hebreus diz que Abraão habitou em tendas como estrangeiro, porque esperava a cidade que tem fundamentos, da qual Deus é o arquiteto e construtor. Vivia na terra prometida, mas sabia que a sua esperança final estava mais além. O crente também vive como peregrino, com o olhar posto no que é eterno.','Hb 11:8-10')],
  [('¿Qué cosas nos cuesta dejar cuando Dios nos llama a avanzar?',
    'Que coisas temos dificuldade de deixar quando Deus nos chama a avançar?'),
   ('¿Por qué Dios no siempre nos muestra todo el camino de antemano?',
    'Por que Deus nem sempre nos mostra todo o caminho de antemão?'),
   ('¿De qué manera podemos ser bendición para nuestras familias y vecinos?',
    'De que maneira podemos ser bênção para as nossas famílias e vizinhos?'),
   ('¿Qué significa vivir como peregrinos en este mundo?',
    'O que significa viver como peregrinos neste mundo?')],
  ('Pregunte a Dios esta semana qué paso de fe le está pidiendo dar y comparta con su grupo la respuesta.',
   'Pergunte a Deus nesta semana que passo de fé ele está pedindo que você dê e compartilhe a resposta com o seu grupo.'),
  'Hb 11:8',
  ('Señor, como Abraham queremos salir cuando Tú nos llamas, aunque no sepamos todo el camino. Haznos bendición para otros y guárdanos con la mirada en lo eterno. Amén.',
   'Senhor, como Abraão queremos sair quando tu nos chamas, mesmo sem saber todo o caminho. Faze de nós bênção para os outros e guarda-nos com o olhar no que é eterno. Amém.'))

L('Ex 2:11-15',
  ('Moisés: de la huida al llamado','Moisés: da fuga ao chamado'),
  ('Ver cómo Dios formó a Moisés en el desierto y lo usó a pesar de sus fracasos y temores.',
   'Ver como Deus formou Moisés no deserto e o usou apesar dos seus fracassos e medos.'),
  ('¿Qué experiencia difícil terminó preparándolos para algo bueno después?',
   'Que experiência difícil acabou preparando vocês para algo bom depois?'),
  ('Moisés creció en el palacio del faraón, pero sabía que era hebreo. Un día, al ver que un egipcio golpeaba a un hebreo, quiso hacer justicia con sus propias manos y lo mató. Tuvo que huir al desierto de Madián, donde pasó cuarenta años cuidando ovejas. Parecía que su historia había terminado. Pero Hebreos dice que por la fe Moisés escogió ser maltratado con el pueblo de Dios antes que gozar de los deleites del pecado. Hoy vamos a ver cómo Dios convirtió su fracaso en formación.',
   'Moisés cresceu no palácio do faraó, mas sabia que era hebreu. Um dia, ao ver um egípcio espancando um hebreu, quis fazer justiça com as próprias mãos e o matou. Teve que fugir para o deserto de Midiã, onde passou quarenta anos cuidando de ovelhas. Parecia que a sua história tinha terminado. Mas Hebreus diz que pela fé Moisés preferiu ser maltratado com o povo de Deus a desfrutar dos prazeres do pecado. Hoje vamos ver como Deus transformou o seu fracasso em formação.'),
  [('Una elección de fe','Uma escolha de fé',
    'Moisés podía haber disfrutado de las riquezas de Egipto, pero eligió identificarse con su pueblo esclavizado. Hebreos dice que tenía por mayores riquezas el vituperio de Cristo que los tesoros de los egipcios, porque miraba la recompensa. La fe nos ayuda a elegir lo eterno por encima de lo pasajero.',
    'Moisés podia ter desfrutado das riquezas do Egito, mas escolheu se identificar com o seu povo escravizado. Hebreus diz que ele considerou o opróbrio de Cristo maior riqueza do que os tesouros do Egito, porque tinha em vista a recompensa. A fé nos ajuda a escolher o eterno acima do passageiro.','Hb 11:24-26'),
   ('Formado en el desierto','Formado no deserto',
    'Moisés intentó liberar a su pueblo a su manera y fracasó. En el desierto aprendió a cuidar ovejas, a conocer el terreno y a esperar. Dios no desperdicia los años de desierto: allí forma el carácter de sus siervos. Lo que parece un tiempo perdido puede ser la escuela de Dios.',
    'Moisés tentou libertar o seu povo do seu jeito e fracassou. No deserto aprendeu a cuidar de ovelhas, a conhecer o terreno e a esperar. Deus não desperdiça os anos de deserto: ali ele forma o caráter dos seus servos. O que parece tempo perdido pode ser a escola de Deus.','Ex 3:1'),
   ('«Yo estaré contigo»','Eu serei contigo',
    'Cuando Dios lo llamó desde la zarza, Moisés presentó muchas excusas. La respuesta de Dios no fue una lista de cualidades de Moisés, sino una promesa: «yo estaré contigo». El llamado de Dios no depende de nuestra capacidad, sino de su presencia. Él capacita a quien llama.',
    'Quando Deus o chamou da sarça, Moisés apresentou muitas desculpas. A resposta de Deus não foi uma lista das qualidades de Moisés, mas uma promessa: eu serei contigo. O chamado de Deus não depende da nossa capacidade, mas da sua presença. Ele capacita quem ele chama.','Ex 3:11-12')],
  [('¿Qué riquezas o placeres compiten hoy con nuestra fidelidad a Dios?',
    'Que riquezas ou prazeres competem hoje com a nossa fidelidade a Deus?'),
   ('¿Qué desiertos han vivido y qué aprendieron en ellos?',
    'Que desertos vocês já viveram e o que aprenderam neles?'),
   ('¿Por qué a veces queremos hacer la obra de Dios a nuestra manera?',
    'Por que às vezes queremos fazer a obra de Deus do nosso jeito?'),
   ('¿Qué excusas solemos poner cuando Dios nos llama a servir?',
    'Que desculpas costumamos dar quando Deus nos chama para servir?')],
  ('Escriba una excusa que usted pone a Dios y cámbiela por una de sus promesas durante esta semana.',
   'Escreva uma desculpa que você dá a Deus e troque-a por uma das suas promessas durante esta semana.'),
  'Ex 3:12',
  ('Señor, gracias porque no desperdicias nuestros desiertos. Forma nuestro carácter, quita nuestras excusas y envíanos con la certeza de Tu presencia. Amén.',
   'Senhor, obrigado porque não desperdiças os nossos desertos. Forma o nosso caráter, tira as nossas desculpas e envia-nos com a certeza da tua presença. Amém.'))

L('Js 2:8-11',
  ('Rahab: una fe que cambia la historia','Raabe: uma fé que muda a história'),
  ('Ver cómo Dios salvó y usó a una mujer extranjera con un pasado difícil por su fe.',
   'Ver como Deus salvou e usou uma mulher estrangeira com um passado difícil por causa da sua fé.'),
  ('¿Conocen a alguien cuya vida cambió de manera sorprendente al conocer a Dios?',
   'Vocês conhecem alguém cuja vida mudou de forma surpreendente ao conhecer Deus?'),
  ('Antes de que Israel entrara en Canaán, Josué envió dos espías a Jericó. Ellos llegaron a la casa de Rahab, una mujer cananea con mala reputación. Sorprendentemente, ella los escondió y les dijo que sabía que Jehová les había dado la tierra, porque había oído de lo que Dios hizo en el mar Rojo. Rahab pidió que salvaran a su familia y colgó un cordón de grana en su ventana. Hoy vamos a ver cómo su fe la llevó a formar parte del pueblo de Dios.',
   'Antes de Israel entrar em Canaã, Josué enviou dois espias a Jericó. Eles chegaram à casa de Raabe, uma mulher cananeia com má reputação. Surpreendentemente, ela os escondeu e lhes disse que sabia que o Senhor lhes tinha dado a terra, porque tinha ouvido falar do que Deus fez no mar Vermelho. Raabe pediu que salvassem a sua família e pendurou um cordão de escarlate na sua janela. Hoje vamos ver como a sua fé a levou a fazer parte do povo de Deus.'),
  [('Una fe que nace al oír','Uma fé que nasce ao ouvir',
    'Rahab nunca había visto los milagros de Egipto, pero había oído de ellos y creyó que Jehová es Dios arriba en los cielos y abajo en la tierra. Toda Jericó oyó lo mismo y tuvo miedo, pero solo ella respondió con fe. Oír sobre Dios no basta; es necesario responder a lo que oímos.',
    'Raabe nunca tinha visto os milagres do Egito, mas tinha ouvido falar deles e creu que o Senhor é Deus em cima nos céus e embaixo na terra. Toda Jericó ouviu a mesma coisa e teve medo, mas só ela respondeu com fé. Ouvir sobre Deus não basta; é necessário responder ao que ouvimos.','Js 2:11'),
   ('El cordón de grana','O cordão de escarlate',
    'Los espías le dijeron que atara el cordón de grana a la ventana y reuniera a su familia en la casa. Cuando Jericó cayó, Rahab y toda su familia fueron salvados. El cordón rojo era la señal del pacto, y la casa de Rahab se convirtió en refugio para los suyos.',
    'Os espias lhe disseram para amarrar o cordão de escarlate na janela e reunir a sua família na casa. Quando Jericó caiu, Raabe e toda a sua família foram salvos. O cordão vermelho era o sinal do pacto, e a casa de Raabe se tornou refúgio para os seus.','Js 6:25'),
   ('Un pasado que no define el futuro','Um passado que não define o futuro',
    'Hebreos menciona a Rahab entre los héroes de la fe, y Mateo la incluye en la genealogía de Jesús, como madre de Booz. Su pasado era conocido, pero Dios no la definió por lo que fue, sino por su fe. La gracia de Dios puede escribir una historia nueva en cualquier vida.',
    'Hebreus menciona Raabe entre os heróis da fé, e Mateus a inclui na genealogia de Jesus, como mãe de Boaz. O seu passado era conhecido, mas Deus não a definiu pelo que ela foi, mas pela sua fé. A graça de Deus pode escrever uma história nova em qualquer vida.','Mt 1:5')],
  [('¿Por qué muchos oyen hablar de Dios, pero pocos responden con fe?',
    'Por que muitos ouvem falar de Deus, mas poucos respondem com fé?'),
   ('¿Qué nos enseña Rahab sobre interceder por nuestra familia?',
    'O que Raabe nos ensina sobre interceder pela nossa família?'),
   ('¿Cómo debe la iglesia recibir a personas con un pasado difícil?',
    'Como a igreja deve receber pessoas com um passado difícil?'),
   ('¿Qué parte de su historia Dios quiere transformar en testimonio?',
    'Que parte da sua história Deus quer transformar em testemunho?')],
  ('Ore cada día de esta semana por cada miembro de su familia que todavía no conoce a Cristo.',
   'Ore todos os dias desta semana por cada membro da sua família que ainda não conhece Cristo.'),
  'Hb 11:31',
  ('Señor, gracias porque Tu gracia es más grande que nuestro pasado. Danos una fe que responda a Tu palabra y que alcance a toda nuestra familia. Amén.',
   'Senhor, obrigado porque a tua graça é maior do que o nosso passado. Dá-nos uma fé que responda à tua palavra e que alcance toda a nossa família. Amém.'))

L('Jz 6:11-16',
  ('Gedeón: el más pequeño en manos de Dios','Gideão: o menor nas mãos de Deus'),
  ('Aprender que Dios llama y usa a los que se sienten pequeños e incapaces.',
   'Aprender que Deus chama e usa os que se sentem pequenos e incapazes.'),
  ('¿Alguna vez les pidieron algo para lo cual no se sentían preparados?',
   'Já pediram a vocês algo para o qual não se sentiam preparados?'),
  ('Israel estaba oprimido por los madianitas, que cada año destruían las cosechas. Gedeón estaba sacudiendo el trigo a escondidas en un lagar, por miedo. Allí el ángel de Jehová se le apareció y lo llamó varón esforzado y valiente. Gedeón respondió con quejas y dudas: su familia era la más pobre y él era el menor en la casa de su padre. Hoy vamos a ver cómo Dios ve lo que nosotros no vemos y cómo usa a los pequeños para su gloria.',
   'Israel estava oprimido pelos midianitas, que todo ano destruíam as colheitas. Gideão estava malhando o trigo escondido num lagar, por medo. Ali o anjo do Senhor lhe apareceu e o chamou de homem valente. Gideão respondeu com queixas e dúvidas: a sua família era a mais pobre e ele era o menor na casa do seu pai. Hoje vamos ver como Deus vê o que nós não vemos e como usa os pequenos para a sua glória.'),
  [('Dios ve lo que no vemos','Deus vê o que não vemos',
    'El ángel saludó a Gedeón como varón esforzado y valiente, aunque él estaba escondido por miedo. Dios no lo llamó por lo que era en ese momento, sino por lo que él haría con Gedeón. Muchas veces nos vemos pequeños, pero Dios ve el propósito que puso en nosotros.',
    'O anjo saudou Gideão como homem valente, embora ele estivesse escondido por medo. Deus não o chamou pelo que ele era naquele momento, mas pelo que ele faria com Gideão. Muitas vezes nos vemos pequenos, mas Deus vê o propósito que colocou em nós.','Jz 6:12'),
   ('Ir con la fuerza que tenemos','Ir com a força que temos',
    'Gedeón preguntó por qué les habían pasado tantas desgracias. Dios no respondió con explicaciones, sino con un envío: «ve con esta tu fuerza, y salvarás a Israel; ¿no te envío yo?» Dios no espera que tengamos toda la fuerza; nos envía con lo que tenemos y con su compañía.',
    'Gideão perguntou por que tantas desgraças tinham acontecido. Deus não respondeu com explicações, mas com um envio: vai nesta tua força e livrarás Israel; não fui eu que te enviei? Deus não espera que tenhamos toda a força; ele nos envia com o que temos e com a sua companhia.','Jz 6:14'),
   ('Para que la gloria sea de Dios','Para que a glória seja de Deus',
    'Dios redujo el ejército de Gedeón de treinta y dos mil a trescientos hombres, para que Israel no dijera que se salvó por su propia mano. La victoria con tan pocos mostró que la gloria era de Dios. Cuando Dios usa a los pequeños, nadie puede robarle la gloria.',
    'Deus reduziu o exército de Gideão de trinta e dois mil para trezentos homens, para que Israel não dissesse que se salvou pela própria mão. A vitória com tão poucos mostrou que a glória era de Deus. Quando Deus usa os pequenos, ninguém pode roubar a sua glória.','Jz 7:2')],
  [('¿Por qué es tan común sentirse demasiado pequeño para servir a Dios?',
    'Por que é tão comum se sentir pequeno demais para servir a Deus?'),
   ('¿Qué ve Dios en ustedes que ustedes todavía no ven?',
    'O que Deus vê em vocês que vocês ainda não veem?'),
   ('¿Qué significa ir con la fuerza que tenemos?',
    'O que significa ir com a força que temos?'),
   ('¿Por qué Dios a veces reduce nuestros recursos antes de darnos la victoria?',
    'Por que Deus às vezes reduz os nossos recursos antes de nos dar a vitória?')],
  ('Acepte esta semana una tarea pequeña en la iglesia o en la célula, confiando en que Dios va con usted.',
   'Aceite nesta semana uma pequena tarefa na igreja ou na célula, confiando que Deus vai com você.'),
  '2Co 12:9',
  ('Señor, a veces nos sentimos pequeños y débiles. Gracias porque ves en nosotros lo que Tú puedes hacer. Envíanos con Tu fuerza y que toda la gloria sea Tuya. Amén.',
   'Senhor, às vezes nos sentimos pequenos e fracos. Obrigado porque vês em nós o que tu podes fazer. Envia-nos com a tua força e que toda a glória seja tua. Amém.'))

L('Hb 11:32-34',
  ('Los que por la fe conquistaron reinos','Os que pela fé conquistaram reinos'),
  ('Animar a la iglesia a seguir el ejemplo de fe de los que nos precedieron y a correr su propia carrera.',
   'Animar a igreja a seguir o exemplo de fé dos que vieram antes e a correr a sua própria carreira.'),
  ('¿Quién fue un ejemplo de fe para ustedes en su familia o en la iglesia?',
   'Quem foi um exemplo de fé para vocês na família ou na igreja?'),
  ('Después de hablar de Abel, Enoc, Noé, Abraham, Moisés y Rahab, el autor de Hebreos dice: ¿qué más digo? Porque el tiempo me faltaría contando de Gedeón, de Barac, de Sansón, de Jefté, de David, de Samuel y de los profetas. Algunos vieron grandes victorias; otros sufrieron persecución y murieron sin ver cumplidas todas las promesas. Todos tienen algo en común: vivieron por fe. Hoy vamos a ver cómo su ejemplo nos anima a correr nuestra carrera.',
   'Depois de falar de Abel, Enoque, Noé, Abraão, Moisés e Raabe, o autor de Hebreus diz: e que mais direi? Pois me faltaria tempo para falar de Gideão, de Baraque, de Sansão, de Jefté, de Davi, de Samuel e dos profetas. Alguns viram grandes vitórias; outros sofreram perseguição e morreram sem ver cumpridas todas as promessas. Todos têm algo em comum: viveram pela fé. Hoje vamos ver como o exemplo deles nos anima a correr a nossa carreira.'),
  [('Fe que vence','Fé que vence',
    'Hebreos dice que por la fe conquistaron reinos, hicieron justicia, alcanzaron promesas, taparon bocas de leones y apagaron fuegos impetuosos. Daniel en el foso y sus amigos en el horno son ejemplos. La fe en Dios puede enfrentar enemigos y situaciones que parecen invencibles.',
    'Hebreus diz que pela fé conquistaram reinos, praticaram a justiça, alcançaram promessas, fecharam a boca de leões e apagaram a força do fogo. Daniel na cova e os seus amigos na fornalha são exemplos. A fé em Deus pode enfrentar inimigos e situações que parecem invencíveis.','Hb 11:33-34'),
   ('Fe que resiste','Fé que resiste',
    'Pero Hebreos también menciona a otros que fueron azotados, encarcelados, perseguidos y que anduvieron de un lado a otro sin nada. No todos vieron la liberación en esta vida, y aun así fueron fieles. La fe no siempre cambia las circunstancias, pero siempre nos mantiene fieles en ellas.',
    'Mas Hebreus também menciona outros que foram açoitados, presos, perseguidos e que andaram de um lado para outro sem nada. Nem todos viram a libertação nesta vida, e mesmo assim foram fiéis. A fé nem sempre muda as circunstâncias, mas sempre nos mantém fiéis nelas.','Hb 11:36-38'),
   ('Una nube de testigos','Uma nuvem de testemunhas',
    'Después de esta lista, Hebreos dice que estamos rodeados de una gran nube de testigos. Su ejemplo nos anima a dejar todo peso y correr con paciencia, con los ojos puestos en Jesús. Ellos terminaron su carrera; ahora nos toca correr la nuestra en nuestra generación.',
    'Depois dessa lista, Hebreus diz que estamos rodeados de uma grande nuvem de testemunhas. O exemplo deles nos anima a deixar todo peso e correr com perseverança, com os olhos fixos em Jesus. Eles terminaram a sua carreira; agora é a nossa vez de correr na nossa geração.','Hb 12:1-2')],
  [('¿Qué historia de Hebreos 11 les inspira más? ¿Por qué?',
    'Que história de Hebreus 11 mais inspira vocês? Por quê?'),
   ('¿Cómo mantener la fe cuando Dios no cambia la situación?',
    'Como manter a fé quando Deus não muda a situação?'),
   ('¿Qué pesos nos impiden correr con libertad?',
    'Que pesos nos impedem de correr com liberdade?'),
   ('¿Qué ejemplo de fe queremos dejar a la próxima generación?',
    'Que exemplo de fé queremos deixar para a próxima geração?')],
  ('Escriba un mensaje de gratitud a una persona que fue ejemplo de fe para usted.',
   'Escreva uma mensagem de gratidão a uma pessoa que foi exemplo de fé para você.'),
  'Hb 12:1',
  ('Señor, gracias por los que nos dejaron un ejemplo de fe. Ayúdanos a correr nuestra carrera con paciencia, con los ojos puestos en Jesús, y a dejar un buen ejemplo a los que vienen. Amén.',
   'Senhor, obrigado pelos que nos deixaram um exemplo de fé. Ajuda-nos a correr a nossa carreira com perseverança, com os olhos fixos em Jesus, e a deixar um bom exemplo para os que virão. Amém.'))

# ================================================================ Mulheres da Bíblia
S('mulheres','Mujeres de la Biblia','Mulheres da Bíblia',
  'Seis estudios sobre mujeres de fe en la Biblia y lo que enseñan a toda la iglesia.',
  'Seis estudos sobre mulheres de fé na Bíblia e o que elas ensinam a toda a igreja.')

L('Rt 1:15-18',
  ('Rut: fidelidad en tiempos de pérdida','Rute: fidelidade em tempos de perda'),
  ('Aprender de Rut la fidelidad, el amor que se compromete y la confianza en el Dios de Israel.',
   'Aprender com Rute a fidelidade, o amor que se compromete e a confiança no Deus de Israel.'),
  ('¿Quién estuvo con ustedes en un momento difícil de su vida?',
   'Quem esteve com vocês num momento difícil da vida?'),
  ('Noemí había perdido a su esposo y a sus dos hijos en Moab. Decidió volver a Belén y animó a sus nueras, Orfa y Rut, a quedarse en su tierra. Orfa se despidió llorando, pero Rut se quedó con ella y dijo palabras que hasta hoy emocionan: «tu pueblo será mi pueblo, y tu Dios mi Dios». Rut era extranjera y viuda, sin garantías. Hoy vamos a ver cómo su fidelidad abrió un camino que llegó hasta el rey David y hasta Jesús.',
   'Noemi tinha perdido o marido e os dois filhos em Moabe. Decidiu voltar para Belém e animou as suas noras, Orfa e Rute, a ficarem na sua terra. Orfa se despediu chorando, mas Rute ficou com ela e disse palavras que até hoje emocionam: o teu povo é o meu povo, e o teu Deus é o meu Deus. Rute era estrangeira e viúva, sem garantias. Hoje vamos ver como a sua fidelidade abriu um caminho que chegou até o rei Davi e até Jesus.'),
  [('Una decisión de fidelidad','Uma decisão de fidelidade',
    'Rut tenía razones para volver a su casa, pero eligió acompañar a Noemí en su dolor. Su amor no fue solo un sentimiento, sino una decisión que le costó dejar su tierra. La fidelidad se prueba en los tiempos de pérdida, cuando acompañar no trae ningún beneficio.',
    'Rute tinha motivos para voltar para casa, mas escolheu acompanhar Noemi na sua dor. O seu amor não foi só um sentimento, mas uma decisão que lhe custou deixar a sua terra. A fidelidade é provada nos tempos de perda, quando acompanhar não traz nenhum benefício.','Rt 1:16-17'),
   ('Trabajo humilde y honrado','Trabalho humilde e honesto',
    'En Belén, Rut salió a recoger espigas detrás de los segadores para alimentar a su suegra. No esperó que las cosas cayeran del cielo: trabajó con humildad. Booz notó su esfuerzo y su buen testimonio, y la bendijo. Dios muchas veces abre puertas mientras somos fieles en las tareas sencillas.',
    'Em Belém, Rute saiu para recolher espigas atrás dos ceifeiros para alimentar a sua sogra. Não esperou que as coisas caíssem do céu: trabalhou com humildade. Boaz notou o seu esforço e o seu bom testemunho, e a abençoou. Muitas vezes Deus abre portas enquanto somos fiéis nas tarefas simples.','Rt 2:2-3'),
   ('Bajo las alas de Dios','Debaixo das asas de Deus',
    'Booz le dijo a Rut que Jehová le pagara su obra, el Dios de Israel bajo cuyas alas había venido a refugiarse. Rut, la extranjera, encontró refugio en el Dios de Israel. Más tarde fue bisabuela del rey David y forma parte de la genealogía de Jesús.',
    'Boaz disse a Rute que o Senhor recompensasse a sua obra, o Deus de Israel, debaixo de cujas asas ela tinha vindo se abrigar. Rute, a estrangeira, encontrou refúgio no Deus de Israel. Mais tarde foi bisavó do rei Davi e faz parte da genealogia de Jesus.','Rt 2:12')],
  [('¿Qué significa ser fiel a alguien cuando no hay ningún beneficio?',
    'O que significa ser fiel a alguém quando não há nenhum benefício?'),
   ('¿Cómo podemos acompañar a personas que atraviesan duelos y pérdidas?',
    'Como podemos acompanhar pessoas que passam por lutos e perdas?'),
   ('¿Qué nos enseña Rut sobre el valor del trabajo humilde?',
    'O que Rute nos ensina sobre o valor do trabalho humilde?'),
   ('¿Cómo ven la mano de Dios en esta historia, aunque no se mencionen milagros?',
    'Como vocês veem a mão de Deus nesta história, mesmo sem milagres mencionados?')],
  ('Visite o llame esta semana a una persona que atraviesa una pérdida y ofrézcale su compañía.',
   'Visite ou ligue nesta semana para uma pessoa que está passando por uma perda e ofereça a sua companhia.'),
  'Rt 1:16',
  ('Señor, danos un corazón fiel como el de Rut. Ayúdanos a acompañar a los que sufren y a refugiarnos bajo Tus alas en todo tiempo. Amén.',
   'Senhor, dá-nos um coração fiel como o de Rute. Ajuda-nos a acompanhar os que sofrem e a nos abrigar debaixo das tuas asas em todo tempo. Amém.'))

L('1Sm 1:9-11',
  ('Ana: derramar el alma delante de Dios','Ana: derramar a alma diante de Deus'),
  ('Aprender de Ana a llevar el dolor a Dios en oración sincera y a cumplir lo que le prometemos.',
   'Aprender com Ana a levar a dor a Deus em oração sincera e a cumprir o que prometemos a ele.'),
  ('¿Tienen algún pedido que llevan mucho tiempo presentando a Dios?',
   'Vocês têm algum pedido que estão apresentando a Deus há muito tempo?'),
  ('Ana era una de las dos esposas de Elcana. La otra, Penina, tenía hijos y la mortificaba porque Ana era estéril. Cada año, cuando subían a Silo para adorar, Ana lloraba y no comía. Un día se levantó, fue al templo y oró con amargura de alma. Sus labios se movían, pero no se oía su voz, y el sacerdote Elí pensó que estaba ebria. Hoy vamos a ver cómo Dios respondió a una mujer que derramó su alma delante de él.',
   'Ana era uma das duas esposas de Elcana. A outra, Penina, tinha filhos e a provocava porque Ana era estéril. Todo ano, quando subiam a Siló para adorar, Ana chorava e não comia. Um dia ela se levantou, foi ao templo e orou com amargura de alma. Os seus lábios se moviam, mas não se ouvia a sua voz, e o sacerdote Eli achou que ela estava embriagada. Hoje vamos ver como Deus respondeu a uma mulher que derramou a sua alma diante dele.'),
  [('Un dolor que se presenta a Dios','Uma dor que é apresentada a Deus',
    'Ana sufría por su esterilidad y por las provocaciones de Penina. En lugar de responder con amargura, llevó su dolor al lugar correcto: la presencia de Dios. Cuando Elí la acusó, ella explicó que había derramado su alma delante de Jehová. Dios recibe nuestras lágrimas sinceras.',
    'Ana sofria pela sua esterilidade e pelas provocações de Penina. Em vez de responder com amargura, levou a sua dor ao lugar certo: a presença de Deus. Quando Eli a acusou, ela explicou que tinha derramado a sua alma diante do Senhor. Deus recebe as nossas lágrimas sinceras.','1Sm 1:15-16'),
   ('Paz después de orar','Paz depois de orar',
    'Después de orar y recibir la bendición de Elí, Ana se fue, comió, y su rostro no estuvo más triste. Todavía no tenía al hijo, pero ya tenía paz. La oración no siempre cambia la situación de inmediato, pero cambia el corazón de quien ora y lo llena de esperanza.',
    'Depois de orar e receber a bênção de Eli, Ana foi embora, comeu, e o seu semblante já não estava triste. Ainda não tinha o filho, mas já tinha paz. A oração nem sempre muda a situação imediatamente, mas muda o coração de quem ora e o enche de esperança.','1Sm 1:17-18'),
   ('Cumplir el voto','Cumprir o voto',
    'Dios dio a Ana un hijo, Samuel, y ella cumplió su promesa: cuando el niño fue destetado, lo llevó al templo y lo dedicó a Jehová. No olvidó lo que había prometido en el momento de la necesidad. Samuel llegó a ser un gran profeta. La gratitud se demuestra cumpliendo lo que prometimos a Dios.',
    'Deus deu a Ana um filho, Samuel, e ela cumpriu a sua promessa: quando o menino foi desmamado, levou-o ao templo e o dedicou ao Senhor. Não se esqueceu do que tinha prometido no momento da necessidade. Samuel se tornou um grande profeta. A gratidão se demonstra cumprindo o que prometemos a Deus.','1Sm 1:27-28')],
  [('¿Cómo reaccionamos normalmente cuando alguien nos provoca en un punto de dolor?',
    'Como costumamos reagir quando alguém nos provoca num ponto de dor?'),
   ('¿Qué significa derramar el alma delante de Dios?',
    'O que significa derramar a alma diante de Deus?'),
   ('¿Por qué Ana tuvo paz antes de ver la respuesta?',
    'Por que Ana teve paz antes de ver a resposta?'),
   ('¿Hay alguna promesa que hicieron a Dios y todavía no cumplieron?',
    'Há alguma promessa que vocês fizeram a Deus e ainda não cumpriram?')],
  ('Separe un tiempo a solas esta semana para presentar a Dios, con sinceridad, el dolor que más le pesa.',
   'Separe um tempo a sós nesta semana para apresentar a Deus, com sinceridade, a dor que mais pesa em você.'),
  'Sl 62:8',
  ('Señor, gracias porque podemos derramar nuestra alma delante de Ti. Recibe nuestras lágrimas, llénanos de Tu paz y ayúdanos a ser fieles a lo que Te prometemos. Amén.',
   'Senhor, obrigado porque podemos derramar a nossa alma diante de ti. Recebe as nossas lágrimas, enche-nos da tua paz e ajuda-nos a ser fiéis ao que te prometemos. Amém.'))

L('Et 4:13-16',
  ('Ester: para esta hora','Ester: para esta hora'),
  ('Descubrir que Dios nos pone en lugares estratégicos para servir a su propósito con valor.',
   'Descobrir que Deus nos coloca em lugares estratégicos para servir ao seu propósito com coragem.'),
  ('¿Recuerdan algún momento en que estaban en el lugar justo para ayudar a alguien?',
   'Vocês se lembram de algum momento em que estavam no lugar certo para ajudar alguém?'),
  ('Ester era una joven judía huérfana, criada por su primo Mardoqueo, que llegó a ser reina de Persia. Amán, un alto funcionario, consiguió un decreto para exterminar a todos los judíos. Mardoqueo pidió a Ester que intercediera ante el rey, pero entrar sin ser llamada podía costarle la vida. Él le dijo: «¿y quién sabe si para esta hora has llegado al reino?» Hoy vamos a ver cómo Ester respondió con oración, valor y sabiduría.',
   'Ester era uma jovem judia órfã, criada pelo seu primo Mardoqueu, que se tornou rainha da Pérsia. Hamã, um alto funcionário, conseguiu um decreto para exterminar todos os judeus. Mardoqueu pediu a Ester que intercedesse diante do rei, mas entrar sem ser chamada podia lhe custar a vida. Ele lhe disse: e quem sabe se não foi para uma hora como esta que chegaste ao reino? Hoje vamos ver como Ester respondeu com oração, coragem e sabedoria.'),
  [('Un lugar con propósito','Um lugar com propósito',
    'Ester no llegó al palacio por casualidad. Mardoqueo entendió que Dios la había puesto allí para un momento decisivo. Así también, nuestro trabajo, escuela, barrio y familia pueden ser el lugar donde Dios nos colocó para influir y servir. Ningún lugar es demasiado pequeño para su propósito.',
    'Ester não chegou ao palácio por acaso. Mardoqueu entendeu que Deus a tinha colocado ali para um momento decisivo. Assim também, o nosso trabalho, a escola, o bairro e a família podem ser o lugar onde Deus nos colocou para influenciar e servir. Nenhum lugar é pequeno demais para o seu propósito.','Et 4:14'),
   ('Preparación con ayuno y oración','Preparo com jejum e oração',
    'Antes de presentarse ante el rey, Ester pidió a los judíos que ayunaran por ella tres días, y ella y sus doncellas también ayunaron. No confió solo en su belleza ni en su posición. Las grandes decisiones deben prepararse en la presencia de Dios y con el apoyo de los hermanos.',
    'Antes de se apresentar ao rei, Ester pediu aos judeus que jejuassem por ela três dias, e ela e as suas servas também jejuaram. Não confiou só na sua beleza nem na sua posição. As grandes decisões devem ser preparadas na presença de Deus e com o apoio dos irmãos.','Et 4:16'),
   ('Valor para actuar','Coragem para agir',
    'Ester dijo: entraré a ver al rey, aunque no sea conforme a la ley; y si perezco, que perezca. El rey extendió hacia ella el cetro de oro, y Dios usó su valor y su sabiduría para librar a su pueblo. La fe no elimina el miedo, pero nos da valor para obedecer a pesar de él.',
    'Ester disse: irei ao rei, embora isso não seja segundo a lei; e se eu perecer, pereci. O rei estendeu para ela o cetro de ouro, e Deus usou a sua coragem e a sua sabedoria para livrar o seu povo. A fé não elimina o medo, mas nos dá coragem para obedecer apesar dele.','Et 5:1-2')],
  [('¿En qué lugares los ha puesto Dios para influir en otros?',
    'Em que lugares Deus colocou vocês para influenciar outras pessoas?'),
   ('¿Por qué es importante buscar a Dios antes de tomar decisiones grandes?',
    'Por que é importante buscar a Deus antes de tomar decisões grandes?'),
   ('¿Qué situaciones exigen hoy valor para defender lo correcto?',
    'Que situações exigem hoje coragem para defender o que é certo?'),
   ('¿Cómo podemos apoyar en oración a un hermano que enfrenta un desafío?',
    'Como podemos apoiar em oração um irmão que enfrenta um desafio?')],
  ('Piense en una situación donde Dios lo puso para hacer una diferencia y dé un paso concreto esta semana.',
   'Pense numa situação em que Deus colocou você para fazer diferença e dê um passo concreto nesta semana.'),
  'Et 4:14',
  ('Señor, gracias porque nos pusiste en el lugar donde estamos con un propósito. Danos valor y sabiduría para actuar en la hora que Tú preparaste. Amén.',
   'Senhor, obrigado porque nos colocaste no lugar onde estamos com um propósito. Dá-nos coragem e sabedoria para agir na hora que tu preparaste. Amém.'))

L('Lc 1:41-45',
  ('María: he aquí la sierva del Señor','Maria: eis aqui a serva do Senhor'),
  ('Aprender de María la disposición humilde para aceptar la voluntad de Dios y creer en sus promesas.',
   'Aprender com Maria a disposição humilde para aceitar a vontade de Deus e crer nas suas promessas.'),
  ('¿Alguna vez recibieron una noticia que cambió por completo sus planes?',
   'Vocês já receberam uma notícia que mudou completamente os seus planos?'),
  ('María era una joven de Nazaret, comprometida para casarse con José. El ángel Gabriel le anunció que concebiría por el Espíritu Santo y daría a luz al Hijo del Altísimo. Era una noticia gloriosa, pero también difícil: podía traerle vergüenza, malentendidos y riesgo. María preguntó cómo sería, y después respondió: «he aquí la sierva del Señor; hágase conmigo conforme a tu palabra». Hoy vamos a ver su fe, su humildad y su alabanza.',
   'Maria era uma jovem de Nazaré, prometida em casamento a José. O anjo Gabriel lhe anunciou que conceberia pelo Espírito Santo e daria à luz o Filho do Altíssimo. Era uma notícia gloriosa, mas também difícil: podia lhe trazer vergonha, mal-entendidos e risco. Maria perguntou como isso aconteceria e depois respondeu: eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra. Hoje vamos ver a sua fé, a sua humildade e o seu louvor.'),
  [('Disposición humilde','Disposição humilde',
    'María no entendía todo, pero se puso a disposición de Dios. Su respuesta no fue una exigencia de garantías, sino una entrega: he aquí la sierva del Señor. Rendirse a la voluntad de Dios no es pasividad, sino confianza activa en que él sabe lo que hace.',
    'Maria não entendia tudo, mas se colocou à disposição de Deus. A sua resposta não foi uma exigência de garantias, mas uma entrega: eis aqui a serva do Senhor. Render-se à vontade de Deus não é passividade, mas confiança ativa de que ele sabe o que faz.','Lc 1:38'),
   ('Bienaventurada la que creyó','Bem-aventurada a que creu',
    'Cuando María visitó a su parienta Elisabet, esta, llena del Espíritu Santo, la llamó bienaventurada porque creyó que se cumplirían las cosas que le fueron dichas de parte del Señor. La fe de María no se basaba en lo que veía, sino en la palabra de Dios.',
    'Quando Maria visitou a sua parenta Isabel, esta, cheia do Espírito Santo, a chamou de bem-aventurada porque creu que se cumpririam as coisas que lhe foram ditas da parte do Senhor. A fé de Maria não se baseava no que via, mas na palavra de Deus.','Lc 1:45'),
   ('Un canto de alabanza','Um cântico de louvor',
    'María respondió con un canto: engrandece mi alma al Señor, y mi espíritu se alegra en Dios mi Salvador. Reconoció que Dios miró la bajeza de su sierva y que hace grandes cosas. Su alabanza muestra que ella misma necesitaba al Salvador y que toda la gloria era de Dios.',
    'Maria respondeu com um cântico: a minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador. Reconheceu que Deus olhou para a humildade da sua serva e que faz grandes coisas. O seu louvor mostra que ela mesma precisava do Salvador e que toda a glória era de Deus.','Lc 1:46-49')],
  [('¿Qué nos cuesta más: entender la voluntad de Dios o aceptarla?',
    'O que é mais difícil para nós: entender a vontade de Deus ou aceitá-la?'),
   ('¿Qué riesgos aceptó María al decir sí a Dios?',
    'Que riscos Maria aceitou ao dizer sim a Deus?'),
   ('¿Cómo nos animamos unos a otros como hicieron María y Elisabet?',
    'Como podemos nos animar uns aos outros como fizeram Maria e Isabel?'),
   ('¿Qué grandes cosas ha hecho Dios en su vida por las cuales pueden alabarlo?',
    'Que grandes coisas Deus fez na sua vida pelas quais vocês podem louvá-lo?')],
  ('Lea Lucas 1:46-55 en voz alta y escriba su propio canto de gratitud por lo que Dios hizo en su vida.',
   'Leia Lucas 1:46-55 em voz alta e escreva o seu próprio cântico de gratidão pelo que Deus fez na sua vida.'),
  'Lc 1:38',
  ('Señor, aquí estamos como siervos Tuyos. Haz en nosotros conforme a Tu palabra. Danos fe para creer en Tus promesas y un corazón que Te alabe. Amén.',
   'Senhor, aqui estamos como teus servos. Faze em nós segundo a tua palavra. Dá-nos fé para crer nas tuas promessas e um coração que te louve. Amém.'))

L('Lc 10:38-42',
  ('Marta y María: lo único necesario','Marta e Maria: a única coisa necessária'),
  ('Equilibrar el servicio con la devoción, poniendo a Jesús en el centro de lo que hacemos.',
   'Equilibrar o serviço com a devoção, colocando Jesus no centro do que fazemos.'),
  ('¿Qué tareas del día los dejan más cansados o preocupados?',
   'Que tarefas do dia deixam vocês mais cansados ou preocupados?'),
  ('Jesús entró en una aldea y una mujer llamada Marta lo recibió en su casa. Su hermana María se sentó a los pies de Jesús y escuchaba su palabra. Marta, en cambio, se preocupaba con muchos quehaceres y finalmente se quejó: «Señor, ¿no te da cuidado que mi hermana me deje servir sola?» Jesús le respondió con cariño, pero con claridad. Hoy vamos a ver cómo equilibrar el servicio y la devoción, sin perder lo más importante.',
   'Jesus entrou numa aldeia e uma mulher chamada Marta o recebeu em sua casa. A sua irmã Maria sentou-se aos pés de Jesus e ouvia a sua palavra. Marta, ao contrário, se preocupava com muitos afazeres e finalmente reclamou: Senhor, não te importas que a minha irmã me deixe servir sozinha? Jesus lhe respondeu com carinho, mas com clareza. Hoje vamos ver como equilibrar o serviço e a devoção, sem perder o mais importante.'),
  [('Servir es bueno','Servir é bom',
    'Marta no estaba haciendo algo malo: estaba sirviendo a Jesús con hospitalidad. La iglesia necesita personas dispuestas a trabajar. En otra ocasión, después de la muerte de Lázaro, Marta mostró una gran confesión de fe. El problema no era el servicio, sino la ansiedad y la queja.',
    'Marta não estava fazendo algo errado: estava servindo Jesus com hospitalidade. A igreja precisa de pessoas dispostas a trabalhar. Em outra ocasião, depois da morte de Lázaro, Marta fez uma grande confissão de fé. O problema não era o serviço, mas a ansiedade e a queixa.','Jo 11:27'),
   ('Afanada y turbada','Ansiosa e agitada',
    'Jesús dijo: «Marta, Marta, afanada y turbada estás con muchas cosas». Cuando el servicio nos aleja de Jesús, se vuelve una carga y nos lleva a criticar a otros. Podemos estar muy ocupados en la obra de Dios y olvidarnos del Dios de la obra.',
    'Jesus disse: Marta, Marta, estás ansiosa e agitada com muitas coisas. Quando o serviço nos afasta de Jesus, ele se torna um peso e nos leva a criticar os outros. Podemos estar muito ocupados com a obra de Deus e esquecer o Deus da obra.','Lc 10:41'),
   ('La buena parte','A boa parte',
    'Jesús dijo que una sola cosa es necesaria y que María escogió la buena parte, la cual no le será quitada. Estar a los pies de Jesús, escuchando su palabra, es la fuente de todo servicio verdadero. Quien primero se sienta con Jesús, después sirve con alegría y sin queja.',
    'Jesus disse que uma só coisa é necessária e que Maria escolheu a boa parte, a qual não lhe será tirada. Estar aos pés de Jesus, ouvindo a sua palavra, é a fonte de todo serviço verdadeiro. Quem primeiro se senta com Jesus, depois serve com alegria e sem queixa.','Lc 10:42')],
  [('¿Con cuál de las dos hermanas se identifican más? ¿Por qué?',
    'Com qual das duas irmãs vocês se identificam mais? Por quê?'),
   ('¿Qué señales muestran que el servicio se está volviendo una carga?',
    'Que sinais mostram que o serviço está se tornando um peso?'),
   ('¿Cómo podemos sentarnos a los pies de Jesús en medio de una vida ocupada?',
    'Como podemos nos sentar aos pés de Jesus no meio de uma vida ocupada?'),
   ('¿Qué cambiaría en nuestro servicio si primero pasamos tiempo con Jesús?',
    'O que mudaria no nosso serviço se primeiro passarmos tempo com Jesus?')],
  ('Antes de empezar sus tareas cada día de esta semana, separe unos minutos para leer la Palabra y orar.',
   'Antes de começar as suas tarefas todos os dias desta semana, separe alguns minutos para ler a Palavra e orar.'),
  'Lc 10:42',
  ('Señor Jesús, perdónanos cuando el afán nos aleja de Ti. Enséñanos a sentarnos a Tus pies y a servir desde allí con alegría. Amén.',
   'Senhor Jesus, perdoa-nos quando a ansiedade nos afasta de ti. Ensina-nos a sentar aos teus pés e a servir a partir dali com alegria. Amém.'))

L('Jo 20:14-18',
  ('María Magdalena: la primera testigo','Maria Madalena: a primeira testemunha'),
  ('Ver cómo Jesús se reveló primero a una mujer transformada y la envió a anunciar su resurrección.',
   'Ver como Jesus se revelou primeiro a uma mulher transformada e a enviou para anunciar a sua ressurreição.'),
  ('¿Recuerdan una vez en que alguien los llamó por su nombre y eso los hizo sentir especiales?',
   'Vocês se lembram de uma vez em que alguém chamou vocês pelo nome e isso os fez sentir especiais?'),
  ('María Magdalena había sido libertada por Jesús de siete demonios y lo siguió desde entonces, sirviéndolo con sus bienes. Estuvo junto a la cruz y fue al sepulcro muy temprano el primer día de la semana. Al encontrarlo vacío, se quedó llorando afuera. Jesús resucitado se le apareció, pero ella pensó que era el hortelano, hasta que él la llamó por su nombre. Hoy vamos a ver cómo una mujer transformada fue la primera en anunciar la resurrección.',
   'Maria Madalena tinha sido libertada por Jesus de sete demônios e o seguiu desde então, servindo-o com os seus bens. Esteve junto à cruz e foi ao sepulcro bem cedo no primeiro dia da semana. Ao encontrá-lo vazio, ficou chorando do lado de fora. Jesus ressuscitado lhe apareceu, mas ela pensou que era o jardineiro, até que ele a chamou pelo nome. Hoje vamos ver como uma mulher transformada foi a primeira a anunciar a ressurreição.'),
  [('Una vida transformada','Uma vida transformada',
    'Lucas cuenta que María Magdalena había sido libre de siete demonios y que, junto con otras mujeres, servía a Jesús con sus bienes. Su gratitud se convirtió en servicio y fidelidad. Quien ha sido mucho perdonado y libertado ama mucho y sigue a Jesús de cerca.',
    'Lucas conta que Maria Madalena tinha sido libertada de sete demônios e que, junto com outras mulheres, servia Jesus com os seus bens. A sua gratidão se transformou em serviço e fidelidade. Quem foi muito perdoado e libertado ama muito e segue Jesus de perto.','Lc 8:2-3'),
   ('Llamada por su nombre','Chamada pelo nome',
    'María no reconoció a Jesús hasta que él dijo: María. Al oír su nombre, ella respondió: Raboni, que quiere decir Maestro. Jesús conoce a sus ovejas por nombre. En medio del llanto y la confusión, su voz personal trae consuelo y reconocimiento.',
    'Maria não reconheceu Jesus até que ele disse: Maria. Ao ouvir o seu nome, ela respondeu: Raboni, que quer dizer Mestre. Jesus conhece as suas ovelhas pelo nome. No meio do choro e da confusão, a sua voz pessoal traz consolo e reconhecimento.','Jo 20:16'),
   ('Enviada a anunciar','Enviada a anunciar',
    'Jesús envió a María a decir a sus hermanos que él subía al Padre. Ella fue y anunció a los discípulos: he visto al Señor. En una cultura que muchas veces no valoraba el testimonio de las mujeres, Jesús la eligió como primera testigo de su resurrección. Todo creyente es llamado a contar lo que vio.',
    'Jesus enviou Maria para dizer aos seus irmãos que ele subia para o Pai. Ela foi e anunciou aos discípulos: vi o Senhor. Numa cultura que muitas vezes não valorizava o testemunho das mulheres, Jesus a escolheu como primeira testemunha da sua ressurreição. Todo crente é chamado a contar o que viu.','Jo 20:17-18')],
  [('¿Qué nos enseña la historia de María Magdalena sobre la gratitud?',
    'O que a história de Maria Madalena nos ensina sobre a gratidão?'),
   ('¿Qué significa para ustedes que Jesús los conozca por nombre?',
    'O que significa para vocês que Jesus os conheça pelo nome?'),
   ('¿Por qué creen que Jesús eligió a María como primera testigo?',
    'Por que vocês acham que Jesus escolheu Maria como primeira testemunha?'),
   ('¿A quién pueden decir esta semana «he visto al Señor obrar en mi vida»?',
    'A quem vocês podem dizer nesta semana “eu vi o Senhor agir na minha vida”?')],
  ('Cuente esta semana a una persona lo que Jesús hizo en su vida, con sus propias palabras.',
   'Conte nesta semana a uma pessoa o que Jesus fez na sua vida, com as suas próprias palavras.'),
  'Jo 20:18',
  ('Señor Jesús, gracias porque nos llamas por nombre y nos transformas. Danos un corazón agradecido y valor para anunciar que Tú vives. Amén.',
   'Senhor Jesus, obrigado porque nos chamas pelo nome e nos transformas. Dá-nos um coração agradecido e coragem para anunciar que tu vives. Amém.'))
# ================================================================ validação e saída
TU=re.compile(r'\b(tú|tu|tus|te|ti|contigo|tuyo|tuya|tuyos|tuyas|eres|tienes|puedes|quieres|sabes|estás|has|haz|debes|necesitas|vosotros)\b',re.I)
TU_CS=re.compile(r'\b(tú|tu|tus|te|ti|contigo)\b')  # na oração (dirigida a Deus) só se aceita a forma com maiúscula: Tú, Tu, Te, Ti
QUOTE=re.compile(r'«[^»]*»')
KEYS='herois mulheres'.split()
OLDB={}
for _f in ('licoes-1.json','licoes-2.json','licoes-3.json','licoes-4.json'):
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
    out=os.path.join(HERE,'licoes-5.json')
    json.dump({'series':SER},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
    n=sum(len(o['l']) for o in SER)
    print('ok: %d séries, %d lições, %d referências -> %s'%(len(SER),n,len(refs),out))
if __name__=='__main__':main()
