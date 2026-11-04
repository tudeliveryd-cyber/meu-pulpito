# Curiosidades bíblicas de Meu Púlpito
# Las estadísticas se cuentan aquí mismo sobre las Biblias del app (Reina-Valera 1909 y Bíblia Livre),
# para que cada número diga de qué traducción sale y con qué criterio se contó.
import json,re,os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','biblia')
RV=json.load(open(R+'/es-rv1909.json'));BL=json.load(open(R+'/pt-livre.json'))
W=lambda s:len(re.findall(r"[\wÀ-ÿ]+(?:[-'’][\wÀ-ÿ]+)*",s or ''))
real=lambda v:v and v.strip() not in ('—','-')
def words(B):return sum(W(v) for b in B for c in b for v in c if real(v))
def phrase(B,p):
    n=0;vs=[]
    for bi,b in enumerate(B):
        for ci,c in enumerate(b):
            for vi,v in enumerate(c):
                k=len(re.findall(p,(v or '').lower()))
                if k:n+=k;vs.append(f'{bi}.{ci+1}.{vi+1}')
    return n,vs
def fmt(n):return f'{n:,}'.replace(',','.')
wRV,wBL=words(RV),words(BL)
pRV,vRV=phrase(RV,'palabra de dios');pBL,vBL=phrase(BL,'palavra de deus')
assert sum(len(b) for b in RV)==1189 and len(RV[18])==150 and len(RV[18][118])==176 and len(RV[18][116])==2
assert W(RV[16][7][8])==80 and W(BL[16][7][8])==80
RVn='Reina-Valera 1909';BLn='Bíblia Livre'

C=[
# ---------- A. Estadísticas ----------
dict(cat='est',q=('¿Cuántos libros tiene la Biblia?','Quantos livros tem a Bíblia?'),
 a=('66 libros: 39 en el Antiguo Testamento y 27 en el Nuevo.','66 livros: 39 no Antigo Testamento e 27 no Novo.'),
 x=('Es el número de la Biblia que usan las iglesias evangélicas (canon protestante). Las Biblias católicas tienen 73 y las ortodoxas algunos más, porque incluyen los libros llamados deuterocanónicos.','É o número da Bíblia usada pelas igrejas evangélicas (cânon protestante). As Bíblias católicas têm 73 e as ortodoxas alguns a mais, porque incluem os livros chamados deuterocanônicos.'),
 r=['0.1.1','65.22.21'],k=('canon libros','cânon livros'),
 crit=('Canon protestante, el mismo de la Reina-Valera y de la Bíblia Livre del app.','Cânon protestante, o mesmo da Reina-Valera e da Bíblia Livre do app.'),
 c=('Los 66 libros fueron escritos en unos 1.500 años, en tres idiomas: hebreo, arameo y griego.','Os 66 livros foram escritos ao longo de uns 1.500 anos, em três idiomas: hebraico, aramaico e grego.')),
dict(cat='est',q=('¿Cuántos capítulos tiene la Biblia?','Quantos capítulos tem a Bíblia?'),
 a=('1.189 capítulos: 929 en el Antiguo Testamento y 260 en el Nuevo.','1.189 capítulos: 929 no Antigo Testamento e 260 no Novo.'),
 x=('La división en capítulos no es del texto original: la hizo Esteban Langton, arzobispo de Canterbury, a comienzos del siglo XIII, para facilitar la consulta.','A divisão em capítulos não é do texto original: foi feita por Estêvão Langton, arcebispo de Cantuária, no começo do século XIII, para facilitar a consulta.'),
 r=[],crit=(f'Contado en la {RVn} y en la {BLn} del app (las dos dan 1.189).',f'Contado na {RVn} e na {BLn} do app (as duas dão 1.189).'),
 c=('El capítulo que está en el medio de la Biblia protestante es el Salmo 117, que además es el más corto.','O capítulo que fica no meio da Bíblia protestante é o Salmo 117, que também é o mais curto.')),
dict(cat='est',q=('¿Cuántos versículos tiene la Biblia?','Quantos versículos tem a Bíblia?'),
 a=('31.102 versículos en la numeración más usada: 23.145 en el Antiguo Testamento y 7.957 en el Nuevo.','31.102 versículos na numeração mais usada: 23.145 no Antigo Testamento e 7.957 no Novo.'),
 x=('La división en versículos es de Robert Estienne (1551) para el Nuevo Testamento y se completó en la Biblia de Ginebra (1560). Algunas ediciones numeran un poco distinto ciertos pasajes, por eso el total puede cambiar en unos pocos versículos.','A divisão em versículos é de Robert Estienne (1551) para o Novo Testamento e foi completada na Bíblia de Genebra (1560). Algumas edições numeram um pouco diferente certas passagens, por isso o total pode mudar em poucos versículos.'),
 r=[],crit=('Numeración estándar de las Biblias protestantes. Las Biblias del app pueden variar en pocos versículos porque numeran distinto algunos pasajes (por ejemplo, 3 Juan tiene 14 o 15).','Numeração padrão das Bíblias protestantes. As Bíblias do app podem variar em poucos versículos porque numeram diferente algumas passagens (por exemplo, 3 João tem 14 ou 15).'),
 c=('Hasta el siglo XVI la Biblia no tenía versículos numerados: se citaba por libro y, desde el siglo XIII, por capítulo.','Até o século XVI a Bíblia não tinha versículos numerados: citava-se pelo livro e, desde o século XIII, pelo capítulo.')),
dict(cat='est',q=('¿Cuántos libros tiene el Antiguo Testamento?','Quantos livros tem o Antigo Testamento?'),
 a=('39 libros, de Génesis a Malaquías.','39 livros, de Gênesis a Malaquias.'),
 x=('Se agrupan en Pentateuco (5), libros históricos (12), poéticos (5), profetas mayores (5) y profetas menores (12).','São agrupados em Pentateuco (5), livros históricos (12), poéticos (5), profetas maiores (5) e profetas menores (12).'),
 r=['0.1.1','38.4.6'],crit=('Canon protestante.','Cânon protestante.'),
 c=('En la Biblia hebrea son los mismos textos, pero se cuentan como 24 libros, porque varios van juntos (por ejemplo, los 12 profetas menores forman un solo libro).','Na Bíblia hebraica são os mesmos textos, mas contados como 24 livros, porque vários vão juntos (por exemplo, os 12 profetas menores formam um só livro).')),
dict(cat='est',q=('¿Cuántos libros tiene el Nuevo Testamento?','Quantos livros tem o Novo Testamento?'),
 a=('27 libros, de Mateo a Apocalipsis.','27 livros, de Mateus a Apocalipse.'),
 x=('Son 4 evangelios, Hechos, 21 cartas (epístolas) y Apocalipsis.','São 4 evangelhos, Atos, 21 cartas (epístolas) e Apocalipse.'),
 r=['39.1.1','65.22.21'],crit=('Igual en las Biblias evangélicas, católicas y ortodoxas.','Igual nas Bíblias evangélicas, católicas e ortodoxas.'),
 c=('La lista de los 27 libros aparece completa por primera vez en una carta de Atanasio de Alejandría, del año 367.','A lista dos 27 livros aparece completa pela primeira vez numa carta de Atanásio de Alexandria, do ano 367.')),
dict(cat='est',q=('¿Cuál es el libro con más capítulos?','Qual é o livro com mais capítulos?'),
 a=('Salmos, con 150 capítulos (salmos).','Salmos, com 150 capítulos (salmos).'),
 x=('Le siguen Isaías (66), Jeremías (52) y Génesis (50).','Depois vêm Isaías (66), Jeremias (52) e Gênesis (50).'),
 r=['18.1.1','18.150.6'],crit=(f'Contado en la {RVn} y la {BLn}.',f'Contado na {RVn} e na {BLn}.'),
 c=('En el Nuevo Testamento, el libro con más capítulos es Mateo, con 28 (igual que Hechos).','No Novo Testamento, o livro com mais capítulos é Mateus, com 28 (igual a Atos).')),
dict(cat='est',q=('¿Cuál es el libro con menos capítulos?','Qual é o livro com menos capítulos?'),
 a=('Hay cinco libros con un solo capítulo: Abdías, Filemón, 2 Juan, 3 Juan y Judas.','Há cinco livros com um só capítulo: Obadias, Filemom, 2 João, 3 João e Judas.'),
 x=('Si se cuentan los versículos, el más corto es 2 Juan (13). 3 Juan tiene 14 en la Reina-Valera 1909 del app y 15 en otras ediciones.','Contando os versículos, o mais curto é 2 João (13). 3 João tem 15 na Bíblia Livre do app e 14 em outras edições.'),
 r=['30.1.1','56.1.1','62.1.1','63.1.1','64.1.1'],crit=(f'Contado en la {RVn} y la {BLn}.',f'Contado na {RVn} e na {BLn}.'),
 c=('Abdías es el libro más corto del Antiguo Testamento: 21 versículos.','Obadias é o livro mais curto do Antigo Testamento: 21 versículos.')),
dict(cat='est',q=('¿Cuántas palabras contiene la Biblia?','Quantas palavras tem a Bíblia?'),
 a=(f'En la {RVn} del app: {fmt(wRV)} palabras. En la {BLn}: {fmt(wBL)}.',f'Na {BLn} do app: {fmt(wBL)} palavras. Na {RVn}: {fmt(wRV)}.'),
 x=('No hay un número único: cada traducción usa palabras distintas, y el texto original en hebreo, arameo y griego tiene otra cantidad. Por eso siempre hay que decir de qué Biblia se habla.','Não existe um número único: cada tradução usa palavras diferentes, e o texto original em hebraico, aramaico e grego tem outra quantidade. Por isso é preciso dizer sempre de qual Bíblia se fala.'),
 r=[],crit=('Se contó cada palabra del texto bíblico, sin números de versículo ni títulos. Las palabras unidas por guion cuentan como una.','Foi contada cada palavra do texto bíblico, sem números de versículo nem títulos. Palavras unidas por hífen contam como uma.'),
 c=('Los números que circulan por internet (como «773.692» o «783.137») corresponden a la King James en inglés, no a las Biblias en español o portugués.','Os números que circulam na internet (como «773.692» ou «783.137») são da King James em inglês, não das Bíblias em português ou espanhol.')),
dict(cat='est',q=('¿Cuántas veces aparece la expresión «Palabra de Dios»?','Quantas vezes aparece a expressão «Palavra de Deus»?'),
 a=(f'{pRV} veces en la {RVn} (en {len(vRV)} versículos). En la {BLn}, «palavra de Deus» aparece {pBL} veces.',f'{pBL} vezes na {BLn} (em {len(vBL)} versículos). Na {RVn}, «palabra de Dios» aparece {pRV} vezes.'),
 x=('El número cambia según la traducción, porque a veces se traduce «palabra del Señor», «palabra de Jehová» o solo «la palabra». Esas formas no se contaron aquí.','O número muda conforme a tradução, porque às vezes se traduz «palavra do Senhor», «palavra de Jeová» ou só «a palavra». Essas formas não foram contadas aqui.'),
 r=['42.10.35','57.4.12','48.6.17','65.19.13'],crit=('Búsqueda de la expresión exacta, sin distinguir mayúsculas.','Busca da expressão exata, sem diferenciar maiúsculas.'),
 c=('En Apocalipsis 19:13, «El Verbo de Dios» o «a Palavra de Deus» es el nombre de Jesucristo.','Em Apocalipse 19:13, «a Palavra de Deus» é o nome de Jesus Cristo.')),
# ---------- B. Récords ----------
dict(cat='rec',q=('¿Cuál es el versículo más largo?','Qual é o versículo mais longo?'),
 a=('Ester 8:9, con 80 palabras en la Reina-Valera 1909 y en la Bíblia Livre.','Ester 8:9, com 80 palavras na Bíblia Livre e na Reina-Valera 1909.'),
 x=('Describe el decreto del rey Asuero que permitió a los judíos defenderse, escrito a las 127 provincias, desde la India hasta Etiopía.','Descreve o decreto do rei Assuero que permitiu aos judeus se defenderem, escrito às 127 províncias, da Índia até a Etiópia.'),
 r=['16.8.9'],crit=('Se contaron las palabras de cada versículo. En otras traducciones puede variar.','Foram contadas as palavras de cada versículo. Em outras traduções pode variar.'),
 c=('Es el mismo versículo que se cita como el más largo en la mayoría de las traducciones.','É o mesmo versículo citado como o mais longo na maioria das traduções.')),
dict(cat='rec',q=('¿Cuál es el versículo más corto?','Qual é o versículo mais curto?'),
 a=('Depende de la traducción. En la Reina-Valera 1909, los más cortos tienen 2 palabras: «No matarás» y «No hurtarás» (Éxodo 20:13 y 20:15). En la Bíblia Livre, «Jesus chorou» (Juan 11:35) también tiene 2.','Depende da tradução. Na Bíblia Livre, «Jesus chorou» (João 11:35) tem 2 palavras, empatado com «Não furtarás» (Êxodo 20:15). Na Reina-Valera 1909, Juan 11:35 tem 3 palavras («Y lloró Jesús»).'),
 x=('Juan 11:35 es el que más se cita como «el versículo más corto», porque en muchas traducciones tiene solo dos palabras. Muestra a Jesús llorando ante la tumba de Lázaro.','João 11:35 é o mais citado como «o versículo mais curto», porque em muitas traduções tem só duas palavras. Mostra Jesus chorando diante do túmulo de Lázaro.'),
 r=['42.11.35','1.20.13','1.20.15'],crit=('Se contaron las palabras de cada versículo en las Biblias del app.','Foram contadas as palavras de cada versículo nas Bíblias do app.'),
 c=('En el texto griego, el versículo más corto del Nuevo Testamento es 1 Tesalonicenses 5:16: «Estad siempre gozosos» (dos palabras en griego).','No texto grego, o versículo mais curto do Novo Testamento é 1 Tessalonicenses 5:16: «Alegrai-vos sempre» (duas palavras em grego).')),
dict(cat='rec',q=('¿Cuál es el capítulo más largo?','Qual é o capítulo mais longo?'),
 a=('El Salmo 119, con 176 versículos.','O Salmo 119, com 176 versículos.'),
 x=('Es un salmo acróstico: tiene 22 estrofas de 8 versículos, una por cada letra del alfabeto hebreo, y casi todos sus versículos hablan de la Palabra de Dios.','É um salmo acróstico: tem 22 estrofes de 8 versículos, uma para cada letra do alfabeto hebraico, e quase todos os versículos falam da Palavra de Deus.'),
 r=['18.119.1','18.119.105'],crit=('Contado por número de versículos.','Contado pelo número de versículos.'),
 c=('El segundo capítulo más largo es Números 7, con 89 versículos.','O segundo capítulo mais longo é Números 7, com 89 versículos.')),
dict(cat='rec',q=('¿Cuál es el capítulo más corto?','Qual é o capítulo mais curto?'),
 a=('El Salmo 117, con solo 2 versículos.','O Salmo 117, com apenas 2 versículos.'),
 x=('Es una invitación a todas las naciones a alabar al Señor por su misericordia y su fidelidad.','É um convite a todas as nações para louvar o Senhor por sua misericórdia e fidelidade.'),
 r=['18.117.1','18.117.2'],crit=('Contado por número de versículos.','Contado pelo número de versículos.'),
 c=('Pablo cita el Salmo 117:1 en Romanos 15:11 para mostrar que el evangelio es también para los gentiles.','Paulo cita o Salmo 117:1 em Romanos 15:11 para mostrar que o evangelho é também para os gentios.')),
dict(cat='rec',q=('¿Cuál es el salmo más largo?','Qual é o salmo mais longo?'),
 a=('El Salmo 119, con 176 versículos. También es el capítulo más largo de la Biblia.','O Salmo 119, com 176 versículos. Também é o capítulo mais longo da Bíblia.'),
 x=('Repite con distintas palabras —ley, testimonios, mandamientos, estatutos, palabra— el amor del salmista por la Palabra de Dios.','Repete com palavras diferentes —lei, testemunhos, mandamentos, estatutos, palavra— o amor do salmista pela Palavra de Deus.'),
 r=['18.119.11','18.119.105'],crit=('Contado por número de versículos.','Contado pelo número de versículos.'),
 c=('El salmo más corto es el 117, que está justo dos salmos antes.','O salmo mais curto é o 117, que fica apenas dois salmos antes.')),
dict(cat='rec',q=('¿Quién vivió más años según la Biblia?','Quem viveu mais anos segundo a Bíblia?'),
 k=('edad viejo anciano longevo Matusalén','idade velho idoso longevo Matusalém'),
 a=('Matusalén, que vivió 969 años.','Matusalém, que viveu 969 anos.'),
 x=('Era hijo de Enoc y abuelo de Noé. Le siguen Jared (962 años) y Noé (950 años).','Era filho de Enoque e avô de Noé. Depois vêm Jarede (962 anos) e Noé (950 anos).'),
 r=['0.5.27','0.5.20','0.9.29'],crit=('Edades que da el texto de Génesis 5 y 9.','Idades dadas no texto de Gênesis 5 e 9.'),
 c=('Su padre, Enoc, no murió: «caminó con Dios, y desapareció, porque le llevó Dios» (Génesis 5:24).','Seu pai, Enoque, não morreu: «andou com Deus, e não apareceu mais, porque Deus o levou» (Gênesis 5:24).')),
dict(cat='rec',q=('¿Quién fue el más joven en llegar a rey?','Quem foi o mais jovem a se tornar rei?'),
 a=('Joás, rey de Judá, que comenzó a reinar a los 7 años.','Joás, rei de Judá, que começou a reinar aos 7 anos.'),
 x=('Fue escondido en el templo durante seis años por su tía Josaba y el sacerdote Joiada, y después proclamado rey. Josías también fue rey muy joven: a los 8 años.','Foi escondido no templo durante seis anos por sua tia Jeoseba e pelo sacerdote Joiada, e depois proclamado rei. Josias também foi rei muito jovem: aos 8 anos.'),
 r=['11.11.21','11.12.1','13.34.1'],crit=('La pregunta original es amplia; aquí se toma el caso de la edad para reinar, que el texto indica con exactitud.','A pergunta original é ampla; aqui se toma o caso da idade para reinar, que o texto indica com exatidão.'),
 c=('Otros jóvenes destacados: Samuel servía a Dios desde niño (1 Samuel 3) y David era el menor de sus hermanos cuando fue ungido (1 Samuel 16).','Outros jovens de destaque: Samuel servia a Deus desde menino (1 Samuel 3) e Davi era o mais novo dos irmãos quando foi ungido (1 Samuel 16).')),
# ---------- C. Personajes ----------
dict(cat='per',q=('¿Quién fue el primer hombre?','Quem foi o primeiro homem?'),
 a=('Adán.','Adão.'),x=('Dios lo formó del polvo de la tierra y sopló en su nariz aliento de vida. Su nombre está relacionado con la palabra hebrea adamá, «tierra».','Deus o formou do pó da terra e soprou em suas narinas o fôlego de vida. Seu nome está relacionado com a palavra hebraica adamá, «terra».'),
 r=['0.2.7','0.5.1'],c=('Pablo llama a Jesús «el postrer Adán» (1 Corintios 15:45).','Paulo chama Jesus de «o último Adão» (1 Coríntios 15:45).')),
dict(cat='per',q=('¿Quién fue la primera mujer?','Quem foi a primeira mulher?'),
 a=('Eva.','Eva.'),x=('Fue formada de una costilla de Adán. Adán la llamó Eva «por cuanto ella era madre de todos los vivientes».','Foi formada de uma costela de Adão. Adão a chamou Eva «porque ela era mãe de todos os viventes».'),
 r=['0.2.22','0.3.20'],c=('El nombre Eva (Javá en hebreo) se relaciona con la palabra «vida».','O nome Eva (Havá em hebraico) está relacionado com a palavra «vida».')),
dict(cat='per',q=('¿Quién construyó el arca?','Quem construiu a arca?'),
 a=('Noé, por orden de Dios.','Noé, por ordem de Deus.'),x=('Noé «halló gracia ante los ojos de Jehová» y construyó el arca según las medidas que Dios le dio, para salvar a su familia y a los animales del diluvio.','Noé «achou graça aos olhos do Senhor» e construiu a arca segundo as medidas que Deus lhe deu, para salvar sua família e os animais do dilúvio.'),
 r=['0.6.8','0.6.14','0.6.22','57.11.7'],c=('El arca medía 300 codos de largo, 50 de ancho y 30 de alto: unos 135 × 22 × 13 metros, si se toma el codo de unos 45 cm.','A arca media 300 côvados de comprimento, 50 de largura e 30 de altura: uns 135 × 22 × 13 metros, tomando o côvado de uns 45 cm.')),
dict(cat='per',q=('¿Quién fue el hombre más fuerte?','Quem foi o homem mais forte?'),
 a=('Sansón, juez de Israel.','Sansão, juiz de Israel.'),x=('Su fuerza venía del Espíritu de Jehová y estaba ligada a su voto de nazareo. Mató a un león con las manos y derribó el templo de Dagón.','Sua força vinha do Espírito do Senhor e estava ligada ao seu voto de nazireu. Matou um leão com as mãos e derrubou o templo de Dagom.'),
 r=['6.14.6','6.16.17','6.16.30'],c=('Sansón figura en la lista de los héroes de la fe de Hebreos 11:32.','Sansão aparece na lista dos heróis da fé de Hebreus 11:32.')),
dict(cat='per',q=('¿Quién fue conocido por su sabiduría?','Quem foi conhecido por sua sabedoria?'),
 a=('El rey Salomón, hijo de David.','O rei Salomão, filho de Davi.'),x=('Pidió a Dios un corazón entendido para gobernar, y Dios le dio sabiduría como a nadie antes ni después de él. La reina de Sabá viajó para comprobarla.','Pediu a Deus um coração entendido para governar, e Deus lhe deu sabedoria como ninguém antes nem depois dele. A rainha de Sabá viajou para comprová-la.'),
 r=['10.3.9','10.3.12','10.4.29','10.10.1'],c=('Según 1 Reyes 4:32 compuso 3.000 proverbios y 1.005 cantares.','Segundo 1 Reis 4:32 compôs 3.000 provérbios e 1.005 cânticos.')),
dict(cat='per',q=('¿Quién fue el primer rey de Israel?','Quem foi o primeiro rei de Israel?'),
 a=('Saúl, de la tribu de Benjamín.','Saul, da tribo de Benjamim.'),x=('El pueblo pidió un rey «como todas las naciones». Samuel ungió a Saúl, pero por su desobediencia Dios lo rechazó y escogió a David.','O povo pediu um rei «como todas as nações». Samuel ungiu Saul, mas por sua desobediência Deus o rejeitou e escolheu Davi.'),
 r=['8.8.5','8.10.1','8.10.24','8.15.23'],c=('Saúl era más alto que todo el pueblo «de los hombros arriba» (1 Samuel 9:2).','Saul era mais alto que todo o povo «dos ombros para cima» (1 Samuel 9:2).')),
dict(cat='per',q=('¿Quién fue el discípulo que negó a Jesús?','Quem foi o discípulo que negou Jesus?'),
 a=('Pedro, que lo negó tres veces la noche en que Jesús fue arrestado.','Pedro, que o negou três vezes na noite em que Jesus foi preso.'),x=('Jesús se lo había anunciado: antes que el gallo cantara, lo negaría tres veces. Después de la resurrección, Jesús lo restauró preguntándole tres veces: «¿Me amas?».','Jesus o havia avisado: antes que o galo cantasse, ele o negaria três vezes. Depois da ressurreição, Jesus o restaurou perguntando três vezes: «Tu me amas?».'),
 r=['39.26.34','39.26.75','42.21.17'],c=('El mismo Pedro predicó en Pentecostés y se convirtieron unas tres mil personas (Hechos 2:41).','O mesmo Pedro pregou no Pentecostes e se converteram umas três mil pessoas (Atos 2:41).')),
dict(cat='per',q=('¿Qué apóstol escribió más cartas del Nuevo Testamento?','Qual apóstolo escreveu mais cartas do Novo Testamento?'),
 a=('Pablo: 13 cartas llevan su nombre, de Romanos a Filemón.','Paulo: 13 cartas levam seu nome, de Romanos a Filemom.'),x=('Algunos le atribuyen también Hebreos, que no dice quién la escribió; por eso se habla de 13 o de 14 cartas.','Alguns também atribuem a ele Hebreus, que não diz quem a escreveu; por isso se fala de 13 ou de 14 cartas.'),
 r=['44.1.1','56.1.1','45.16.21'],crit=('Se cuentan las cartas que nombran a Pablo como autor.','Contam-se as cartas que nomeiam Paulo como autor.'),c=('Varias cartas las escribió desde la prisión: Efesios, Filipenses, Colosenses y Filemón.','Várias cartas ele escreveu na prisão: Efésios, Filipenses, Colossenses e Filemom.')),
# ---------- D. Acontecimientos ----------
dict(cat='acon',q=('¿Cuántos días duró el diluvio?','Quantos dias durou o dilúvio?'),
 a=('Llovió 40 días y 40 noches; las aguas prevalecieron 150 días, y Noé estuvo en el arca un poco más de un año.','Choveu 40 dias e 40 noites; as águas prevaleceram 150 dias, e Noé ficou na arca pouco mais de um ano.'),
 x=('Noé entró en el arca el día 17 del mes segundo del año 600 de su vida y salió el día 27 del mes segundo del año siguiente.','Noé entrou na arca no dia 17 do segundo mês do ano 600 de sua vida e saiu no dia 27 do segundo mês do ano seguinte.'),
 r=['0.7.11','0.7.12','0.7.24','0.8.14'],crit=('La respuesta depende de qué se cuente: la lluvia, el tiempo de las aguas o la estadía en el arca. El texto da los tres datos.','A resposta depende do que se conta: a chuva, o tempo das águas ou a permanência na arca. O texto dá os três dados.'),
 c=('Después del diluvio Dios puso el arco iris como señal de su pacto (Génesis 9:13).','Depois do dilúvio Deus pôs o arco-íris como sinal da sua aliança (Gênesis 9:13).')),
dict(cat='acon',q=('¿Cuántos días estuvo Jesús en el desierto?','Quantos dias Jesus ficou no deserto?'),
 a=('40 días y 40 noches, en ayuno, y allí fue tentado por el diablo.','40 dias e 40 noites, em jejum, e ali foi tentado pelo diabo.'),
 x=('Respondió cada tentación con la Escritura: «Escrito está». Después volvió en el poder del Espíritu a Galilea.','Respondeu a cada tentação com a Escritura: «Está escrito». Depois voltou no poder do Espírito para a Galileia.'),
 r=['39.4.1','39.4.2','41.4.1','41.4.14'],c=('El número 40 aparece en otros tiempos de prueba: Moisés en el monte (Éxodo 34:28), Elías camino al Horeb (1 Reyes 19:8) e Israel 40 años en el desierto.','O número 40 aparece em outros tempos de prova: Moisés no monte (Êxodo 34:28), Elias a caminho do Horebe (1 Reis 19:8) e Israel 40 anos no deserto.')),
dict(cat='acon',q=('¿Cuántas plagas hubo en Egipto?','Quantas pragas houve no Egito?'),
 a=('Diez plagas.','Dez pragas.'),
 x=('Agua en sangre, ranas, piojos, moscas, peste en el ganado, úlceras, granizo, langostas, tinieblas y la muerte de los primogénitos.','Água em sangue, rãs, piolhos, moscas, peste nos animais, úlceras, granizo, gafanhotos, trevas e a morte dos primogênitos.'),
 r=['1.7.20','1.12.29','1.12.31'],c=('La última plaga dio origen a la Pascua: la sangre del cordero en los postes de la puerta (Éxodo 12:13).','A última praga deu origem à Páscoa: o sangue do cordeiro nos batentes da porta (Êxodo 12:13).')),
dict(cat='acon',q=('¿Cuántas vueltas dieron los israelitas alrededor de Jericó?','Quantas voltas os israelitas deram ao redor de Jericó?'),
 a=('13 vueltas en total: una por día durante seis días y siete el séptimo día.','13 voltas no total: uma por dia durante seis dias e sete no sétimo dia.'),
 x=('Al final de la séptima vuelta del séptimo día, los sacerdotes tocaron las bocinas, el pueblo gritó y los muros cayeron.','No fim da sétima volta do sétimo dia, os sacerdotes tocaram as trombetas, o povo gritou e as muralhas caíram.'),
 r=['5.6.3','5.6.4','5.6.15','5.6.20'],c=('Rahab y su familia fueron salvados por el cordón de grana en la ventana (Josué 6:25).','Raabe e sua família foram salvos pelo cordão vermelho na janela (Josué 6:25).')),
dict(cat='acon',q=('¿En cuántos días creó Dios el mundo, según Génesis?','Em quantos dias Deus criou o mundo, segundo Gênesis?'),
 a=('En seis días; el séptimo día reposó.','Em seis dias; no sétimo dia descansou.'),
 x=('Génesis 1 describe lo creado cada día y Génesis 2:2-3 dice que Dios bendijo y santificó el séptimo día.','Gênesis 1 descreve o que foi criado em cada dia e Gênesis 2:2-3 diz que Deus abençoou e santificou o sétimo dia.'),
 r=['0.1.31','0.2.2','1.20.11'],c=('El mandamiento del día de reposo se basa en estos días de la creación (Éxodo 20:11).','O mandamento do sábado se baseia nesses dias da criação (Êxodo 20:11).')),
dict(cat='acon',q=('¿Cuántos días estuvo Jonás dentro del gran pez?','Quantos dias Jonas ficou dentro do grande peixe?'),
 a=('Tres días y tres noches.','Três dias e três noites.'),
 x=('Jonás oró desde el vientre del pez, y Dios mandó al pez que lo vomitara en tierra. Jesús usó este hecho como señal de su muerte y resurrección.','Jonas orou do ventre do peixe, e Deus mandou o peixe vomitá-lo em terra. Jesus usou esse fato como sinal de sua morte e ressurreição.'),
 r=['31.1.17','31.2.10','39.12.40'],r_es=['31.2.1','31.2.10','39.12.40'],crit=('En la Reina-Valera 1909 del app, como en la Biblia hebrea, este versículo es Jonás 2:1; en otras ediciones es Jonás 1:17.','Na Bíblia Livre do app este versículo é Jonas 1:17; na Bíblia hebraica e em algumas edições é Jonas 2:1.'),
 c=('El texto dice «un gran pez», no especifica que fuera una ballena.','O texto diz «um grande peixe»; não diz que fosse uma baleia.')),
# ---------- E. Lugares y objetos ----------
dict(cat='lug',q=('¿Dónde nació Jesús?','Onde Jesus nasceu?'),
 a=('En Belén de Judea.','Em Belém da Judeia.'),x=('José y María fueron de Nazaret a Belén por el censo de Augusto. Así se cumplió la profecía de Miqueas 5:2.','José e Maria foram de Nazaré a Belém por causa do recenseamento de Augusto. Assim se cumpriu a profecia de Miqueias 5:2.'),
 r=['39.2.1','41.2.4','41.2.7','32.5.2'],c=('Belén significa «casa del pan»; allí nació el que dijo: «Yo soy el pan de vida» (Juan 6:35).','Belém significa «casa do pão»; ali nasceu aquele que disse: «Eu sou o pão da vida» (João 6:35).')),
dict(cat='lug',q=('¿Dónde fue crucificado Jesús?','Onde Jesus foi crucificado?'),
 a=('En el Gólgota, el «lugar de la Calavera», fuera de la ciudad de Jerusalén.','No Gólgota, o «lugar da Caveira», fora da cidade de Jerusalém.'),
 x=('Gólgota es la palabra aramea para «calavera»; «Calvario» viene de la traducción latina (calvaria). El lugar estaba cerca de la ciudad.','Gólgota é a palavra aramaica para «caveira»; «Calvário» vem da tradução latina (calvaria). O lugar ficava perto da cidade.'),
 r=['42.19.17','42.19.20','41.23.33','57.13.12'],c=('Hebreos 13:12 recuerda que Jesús «padeció fuera de la puerta».','Hebreus 13:12 lembra que Jesus «padeceu fora da porta».')),
dict(cat='lug',q=('¿Dónde recibió Moisés los Diez Mandamientos?','Onde Moisés recebeu os Dez Mandamentos?'),
 a=('En el monte Sinaí, también llamado Horeb.','No monte Sinai, também chamado Horebe.'),
 x=('Dios habló al pueblo desde el monte y entregó a Moisés las dos tablas de piedra «escritas con el dedo de Dios».','Deus falou ao povo do monte e entregou a Moisés as duas tábuas de pedra «escritas pelo dedo de Deus».'),
 r=['1.19.20','1.20.1','1.31.18','4.5.2'],c=('Moisés rompió las primeras tablas al ver el becerro de oro, y Dios le dio otras (Éxodo 32:19; 34:1).','Moisés quebrou as primeiras tábuas ao ver o bezerro de ouro, e Deus lhe deu outras (Êxodo 32:19; 34:1).')),
dict(cat='lug',q=('¿Cómo se llamaba el jardín donde vivían Adán y Eva?','Como se chamava o jardim onde viviam Adão e Eva?'),
 a=('El huerto (jardín) del Edén.','O jardim do Éden.'),
 x=('Dios plantó un huerto en Edén, al oriente, y puso allí al hombre para que lo labrara y lo guardara. Un río salía de Edén y se repartía en cuatro brazos.','Deus plantou um jardim no Éden, ao oriente, e pôs ali o homem para cultivá-lo e guardá-lo. Um rio saía do Éden e se dividia em quatro braços.'),
 r=['0.2.8','0.2.10','0.2.15','0.3.23'],c=('Dos de los ríos mencionados, el Tigris (Hidekel) y el Éufrates, existen hasta hoy.','Dois dos rios mencionados, o Tigre (Hidequel) e o Eufrates, existem até hoje.')),
dict(cat='obj',q=('¿Qué materiales se usaron para construir el arca de Noé?','Que materiais foram usados para construir a arca de Noé?'),
 a=('Madera de gofer, cubierta con brea por dentro y por fuera.','Madeira de gofer, coberta com betume por dentro e por fora.'),
 x=('No se sabe con certeza qué árbol era el «gofer»: la palabra aparece solo aquí en la Biblia. El arca tenía tres pisos, aposentos, una ventana y una puerta lateral.','Não se sabe com certeza que árvore era o «gofer»: a palavra aparece só aqui na Bíblia. A arca tinha três andares, compartimentos, uma janela e uma porta lateral.'),
 r=['0.6.14','0.6.15','0.6.16'],c=('La misma palabra hebrea traducida «brea» se relaciona con «cubrir», la raíz de «expiación».','A mesma palavra hebraica traduzida por «betume» está relacionada a «cobrir», a raiz de «expiação».')),
dict(cat='lug',q=('¿Dónde estaba el templo de Salomón?','Onde ficava o templo de Salomão?'),
 a=('En Jerusalén, sobre el monte Moriah, en la era de Ornán jebuseo.','Em Jerusalém, sobre o monte Moriá, na eira de Ornã, o jebuseu.'),
 x=('Es el lugar donde Jehová se apareció a David y donde él había preparado el terreno. La construcción duró siete años.','É o lugar onde o Senhor apareceu a Davi e onde ele havia preparado o terreno. A construção durou sete anos.'),
 r=['13.3.1','9.24.18','10.6.38'],c=('Génesis 22:2 llama «tierra de Moriah» al lugar donde Abraham fue a ofrecer a Isaac.','Gênesis 22:2 chama de «terra de Moriá» o lugar onde Abraão foi oferecer Isaque.')),
# ---------- F. Enseñanzas ----------
dict(cat='ens',q=('¿Qué significa Emanuel?','O que significa Emanuel?'),
 a=('«Dios con nosotros».','«Deus conosco».'),x=('Es el nombre anunciado por Isaías para el hijo de la virgen, y Mateo lo aplica al nacimiento de Jesús.','É o nome anunciado por Isaías para o filho da virgem, e Mateus o aplica ao nascimento de Jesus.'),
 r=['22.7.14','39.1.23'],c=('En hebreo: Immanu-El, de immanu («con nosotros») y El («Dios»).','Em hebraico: Immanu-El, de immanu («conosco») e El («Deus»).')),
dict(cat='ens',q=('¿Qué significa Aleluya?','O que significa Aleluia?'),
 a=('«Alabad a Jah», es decir, «alaben al Señor».','«Louvai a Jah», ou seja, «louvem o Senhor».'),x=('Viene del hebreo hallelu («alabad») y Yah, forma corta del nombre de Dios. Aparece en los Salmos y en el Apocalipsis.','Vem do hebraico hallelu («louvai») e Yah, forma curta do nome de Deus. Aparece nos Salmos e no Apocalipse.'),
 r=['18.150.6','65.19.1','65.19.6'],c=('En el Nuevo Testamento la palabra «Aleluya» solo aparece en Apocalipsis 19.','No Novo Testamento a palavra «Aleluia» só aparece em Apocalipse 19.')),
dict(cat='ens',q=('¿Qué significa Mesías?','O que significa Messias?'),
 a=('«Ungido».','«Ungido».'),x=('Viene del hebreo mashíaj. En griego se traduce Cristós, de donde viene «Cristo». Los reyes y sacerdotes eran ungidos con aceite; Jesús es el Ungido prometido.','Vem do hebraico mashíach. Em grego se traduz Christós, de onde vem «Cristo». Reis e sacerdotes eram ungidos com óleo; Jesus é o Ungido prometido.'),
 r=['42.1.41','42.4.25','43.10.38'],c=('Decir «Jesucristo» es decir «Jesús, el Mesías».','Dizer «Jesus Cristo» é dizer «Jesus, o Messias».')),
dict(cat='ens',q=('¿Qué significa Maranata?','O que significa Maranata?'),
 a=('Es arameo y puede leerse «El Señor viene» o «Señor nuestro, ven».','É aramaico e pode ser lido «O Senhor vem» ou «Senhor nosso, vem».'),x=('Pablo la usa al final de 1 Corintios. La idea es la misma que la oración final de la Biblia: «Ven, Señor Jesús».','Paulo a usa no final de 1 Coríntios. A ideia é a mesma da oração final da Bíblia: «Vem, Senhor Jesus».'),
 r=['45.16.22','65.22.20'],crit=('Los dos sentidos dependen de cómo se separen las palabras arameas (maran atha o marana tha).','Os dois sentidos dependem de como se separam as palavras aramaicas (maran atha ou marana tha).'),c=('Es una de las pocas expresiones arameas que el Nuevo Testamento conserva sin traducir, como «Abba» y «Talita cumi».','É uma das poucas expressões aramaicas que o Novo Testamento conserva sem traduzir, como «Aba» e «Talitá cumi».')),
dict(cat='ens',q=('¿Qué significa la palabra Evangelio?','O que significa a palavra Evangelho?'),
 a=('«Buenas noticias» o «buena nueva».','«Boas notícias» ou «boa nova».'),x=('Viene del griego euangélion. Es el anuncio de lo que Dios hizo en Jesucristo para salvar a todo el que cree.','Vem do grego euangélion. É o anúncio do que Deus fez em Jesus Cristo para salvar todo aquele que crê.'),
 r=['40.1.1','40.1.15','44.1.16','45.15.3'],c=('Por eso a los cuatro primeros libros del Nuevo Testamento se les llama evangelios.','Por isso os quatro primeiros livros do Novo Testamento são chamados de evangelhos.')),
dict(cat='ens',q=('¿Qué representa el aceite en la Biblia?','O que o azeite representa na Bíblia?'),
 a=('Según el pasaje: consagración (unción), sanidad, luz y alegría. Muchas veces se relaciona con la acción del Espíritu Santo.','Conforme a passagem: consagração (unção), cura, luz e alegria. Muitas vezes está relacionado com a ação do Espírito Santo.'),
 x=('Con aceite se ungía a sacerdotes y reyes (Éxodo 30; 1 Samuel 16:13); se usaba para curar (Lucas 10:34; Santiago 5:14); alimentaba las lámparas (Éxodo 27:20; Mateo 25) y es imagen de gozo (Salmo 45:7). Cuando Samuel ungió a David, «el Espíritu de Jehová vino sobre David».','Com azeite se ungiam sacerdotes e reis (Êxodo 30; 1 Samuel 16:13); era usado para curar (Lucas 10:34; Tiago 5:14); alimentava as lâmpadas (Êxodo 27:20; Mateus 25) e é imagem de alegria (Salmo 45:7). Quando Samuel ungiu Davi, «o Espírito do Senhor se apoderou de Davi».'),
 r=['1.30.30','8.16.13','58.5.14','39.25.4','18.45.7'],crit=('El significado depende del contexto de cada pasaje.','O significado depende do contexto de cada passagem.'),c=('En Israel el aceite era de oliva: una de las riquezas de la tierra prometida (Deuteronomio 8:8).','Em Israel o azeite era de oliva: uma das riquezas da terra prometida (Deuteronômio 8:8).')),
dict(cat='ens',q=('¿Qué simboliza el desierto en la Biblia?','O que o deserto simboliza na Bíblia?'),
 a=('Según el relato: lugar de prueba, de formación, de dependencia de Dios y de encuentro con Él.','Conforme o relato: lugar de prova, de formação, de dependência de Deus e de encontro com Ele.'),
 x=('Israel pasó 40 años en el desierto para ser probado y aprender a depender de Dios (Deuteronomio 8:2-3). Allí Dios dio el maná. Moisés encontró a Dios en la zarza en el desierto, Elías fue sostenido allí y Jesús fue tentado en el desierto.','Israel passou 40 anos no deserto para ser provado e aprender a depender de Deus (Deuteronômio 8:2-3). Ali Deus deu o maná. Moisés encontrou Deus na sarça no deserto, Elias foi sustentado ali e Jesus foi tentado no deserto.'),
 r=['4.8.2','1.16.35','1.3.1','10.19.4','39.4.1','27.2.14'],crit=('El significado depende del contexto de cada pasaje.','O significado depende do contexto de cada passagem.'),c=('Juan el Bautista predicó en el desierto, cumpliendo Isaías 40:3: «Voz que clama en el desierto».','João Batista pregou no deserto, cumprindo Isaías 40:3: «Voz do que clama no deserto».')),
]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'curiosidades-2.py'),encoding='utf-8').read());C+=N
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'curiosidades-3.py'),encoding='utf-8').read());C+=N3
# validar referencias en las dos Biblias
def ok(B,r):
    b,c,v=map(int,r.split('-')[0].split('.'))
    try:return bool(B[b][c-1][v-1])
    except IndexError:return False
for i,e in enumerate(C):
    e['id']=i+1
    for r in e.get('r_es',e['r']):
        assert ok(RV,r),('es',e['q'][0],r)
    for r in e['r']:
        assert ok(BL,r),('pt',e['q'][0],r)
out={'src':'Meu Púlpito · estadísticas contadas en la Reina-Valera 1909 y la Bíblia Livre del app','cats':{'est':['Estadísticas de la Biblia','Estatísticas da Bíblia'],'rec':['Récords bíblicos','Recordes bíblicos'],'per':['Personajes bíblicos','Personagens bíblicos'],'acon':['Acontecimientos bíblicos','Acontecimentos bíblicos'],'lug':['Lugares y ciudades','Lugares e cidades'],'cos':['Costumbres y tradiciones','Costumes e tradições'],'obj':['Objetos bíblicos','Objetos bíblicos'],'ani':['Animales y naturaleza','Animais e natureza'],'ens':['Significados y enseñanzas','Significados e ensinos'],'hist':['Curiosidades históricas','Curiosidades históricas']},'e':C}
json.dump(out,open(R+'/curiosidades.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(C),'curiosidades',wRV,wBL,pRV,pBL)
