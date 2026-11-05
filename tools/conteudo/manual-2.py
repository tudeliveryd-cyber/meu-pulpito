# -*- coding: utf-8 -*-
"""Manual do Ministro (Meu Púlpito): modelos sugeridos de cerimônias, bilíngues [ES, PT].

Gera tools/conteudo/manual-2.json (parte 2) -> {"c":[...]}.
Regras: tools/conteudo/LEIA-ME.md. Rodar: python3 tools/conteudo/manual-2.py
Tudo aqui é MODELO SUGERIDO: o ministro adapta à sua igreja, denominação e à lei local.
"""
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
SAIDA = os.path.join(AQUI, 'manual-2.json')

CATS = {'fam', 'fun', 'ord', 'ded', 'igreja'}

# Observação comum, acrescentada no início de "obs" de cada cerimônia.
OBS_MODELO = [
    'Este es un modelo sugerido: adáptelo a su iglesia, a las normas de su denominación y a la realidad de las personas.',
    'Este é um modelo sugerido: adapte-o à sua igreja, às normas da sua denominação e à realidade das pessoas.',
]


def P(es, pt):
    return [es, pt]


def passo(tes, tpt, des, dpt):
    return {'t': [tes, tpt], 'd': [des, dpt]}


def fala(tes, tpt, xes, xpt):
    return {'t': [tes, tpt], 'x': [xes, xpt]}


C = []

# ---------------------------------------------------------------- casamento

# ---------------------------------------------------------------- noivado
C.append({
    'k': 'noivado', 'cat': 'fam',
    'n': P('Culto de compromiso (noviazgo)', 'Culto de noivado'),
    'd': P('Presentar a Dios el compromiso de una pareja que se prepara para el matrimonio y pedir su dirección para esta etapa.',
           'Apresentar a Deus o compromisso de um casal que se prepara para o casamento e pedir a sua direção para esta etapa.'),
    'prep': [
        P('Conversar antes con la pareja y con sus familias sobre el sentido del compromiso.', 'Conversar antes com o casal e com as famílias sobre o sentido do noivado.'),
        P('Acordar si habrá entrega de anillos de compromiso y quién los entregará.', 'Combinar se haverá entrega de alianças de noivado e quem as entregará.'),
        P('Proponer a la pareja un calendario de consejería prematrimonial.', 'Propor ao casal um calendário de aconselhamento pré-nupcial.'),
        P('Preparar un espacio sencillo, en la casa de una de las familias o en la iglesia.', 'Preparar um espaço simples, na casa de uma das famílias ou na igreja.'),
    ],
    'ordem': [
        passo('Bienvenida', 'Boas-vindas', 'El ministro saluda a las familias y explica el propósito del encuentro.', 'O ministro saúda as famílias e explica o propósito do encontro.'),
        passo('Oración inicial', 'Oração inicial', 'Se pide la presencia de Dios sobre la pareja y las familias.', 'Pede-se a presença de Deus sobre o casal e as famílias.'),
        passo('Himno o canto', 'Hino ou cântico', 'Un canto de gratitud o de consagración.', 'Um cântico de gratidão ou de consagração.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee uno de los textos sugeridos.', 'Lê-se um dos textos sugeridos.'),
        passo('Palabra breve', 'Palavra breve', 'Mensaje de 5 a 10 minutos sobre el noviazgo con propósito y pureza.', 'Mensagem de 5 a 10 minutos sobre o noivado com propósito e pureza.'),
        passo('Declaración de la pareja', 'Declaração do casal', 'Los novios expresan su compromiso de prepararse para el matrimonio.', 'Os noivos expressam o compromisso de se preparar para o casamento.'),
        passo('Anillos de compromiso', 'Alianças de noivado', 'Si es costumbre, la pareja intercambia los anillos.', 'Se for costume, o casal troca as alianças.'),
        passo('Oración por la pareja y las familias', 'Oração pelo casal e pelas famílias', 'Los padres pueden imponer las manos junto con el ministro.', 'Os pais podem impor as mãos junto com o ministro.'),
        passo('Bendición y confraternización', 'Bênção e confraternização', 'Se despide con la bendición y se comparte un momento de comunión.', 'Despede-se com a bênção e compartilha-se um momento de comunhão.'),
    ],
    'textos': ['0.2.18', '19.18.22', '21.8.6-7', '45.13.4-7', '18.127.1', '51.4.3-4'],
    'falas': [
        fala('Palabras de bienvenida', 'Palavras de boas-vindas',
             'Queridas familias: nos alegra estar reunidos para acompañar a (nombre) y (nombre) en este paso importante. El compromiso no es todavía el matrimonio, pero es un tiempo de preparación delante de Dios. Es una etapa para conocerse mejor, para aprender a dialogar y para edificar la relación sobre la roca de la Palabra. Hoy queremos presentar este compromiso al Señor y pedir su dirección.',
             'Queridas famílias: estamos alegres por estar reunidos para acompanhar (nome) e (nome) neste passo importante. O noivado ainda não é o casamento, mas é um tempo de preparação diante de Deus. É uma etapa para se conhecerem melhor, aprenderem a dialogar e edificarem o relacionamento sobre a rocha da Palavra. Hoje queremos apresentar este compromisso ao Senhor e pedir a sua direção.'),
        fala('Declaración de la pareja', 'Declaração do casal',
             '(Cada uno dice:) Delante de Dios y de nuestras familias, declaro mi deseo de prepararme para el matrimonio con (nombre). Me comprometo a cuidar esta relación con respeto, con pureza y con sinceridad, a buscar la orientación del Señor y de nuestros pastores, y a escuchar el consejo de nuestras familias. Que Dios nos ayude a edificar sobre su Palabra.',
             '(Cada um diz:) Diante de Deus e das nossas famílias, declaro o meu desejo de me preparar para o casamento com (nome). Comprometo-me a cuidar deste relacionamento com respeito, pureza e sinceridade, a buscar a orientação do Senhor e dos nossos pastores, e a ouvir o conselho das nossas famílias. Que Deus nos ajude a edificar sobre a sua Palavra.'),
        fala('Oración por la pareja', 'Oração pelo casal',
             'Señor, te presentamos a (nombre) y (nombre). Gracias por el amor que pusiste en sus corazones. Dales sabiduría en esta etapa de preparación, guárdalos en pureza y enséñales a dialogar con paciencia. Bendice a sus familias y únelas en paz. Si es tu voluntad, prepara el camino para un hogar que te honre. En el nombre de Jesús, amén.',
             'Senhor, apresentamos a ti (nome) e (nome). Obrigado pelo amor que colocaste nos seus corações. Dá-lhes sabedoria nesta etapa de preparação, guarda-os em pureza e ensina-os a dialogar com paciência. Abençoa as suas famílias e une-as em paz. Se for da tua vontade, prepara o caminho para um lar que te honre. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('El compromiso no tiene efecto legal en la mayoría de los países; aclare a la pareja que la boda civil y la religiosa se tratan aparte.', 'O noivado não tem efeito legal na maioria dos países; esclareça ao casal que o casamento civil e o religioso são tratados à parte.'),
        P('Respete las costumbres de cada familia y evite exigir gastos o formalidades.', 'Respeite os costumes de cada família e evite exigir gastos ou formalidades.'),
        P('Si percibe presión o falta de libertad en alguno de los novios, converse en privado antes del culto.', 'Se perceber pressão ou falta de liberdade em algum dos noivos, converse em particular antes do culto.'),
    ],
})

# ---------------------------------------------------------------- culto no lar
C.append({
    'k': 'lar', 'cat': 'fam',
    'n': P('Culto en el hogar', 'Culto no lar'),
    'd': P('Llevar la Palabra y la oración a una familia en su casa, fortaleciendo la fe y la comunión en el hogar.',
           'Levar a Palavra e a oração a uma família em sua casa, fortalecendo a fé e a comunhão no lar.'),
    'prep': [
        P('Combinar con la familia el día, la hora y quiénes estarán presentes.', 'Combinar com a família o dia, a hora e quem estará presente.'),
        P('Preguntar si hay alguna necesidad especial para incluir en la oración.', 'Perguntar se há alguma necessidade especial para incluir na oração.'),
        P('Llevar Biblias o el texto impreso para quien no tenga.', 'Levar Bíblias ou o texto impresso para quem não tiver.'),
        P('Preparar un mensaje corto y sencillo, apropiado también para niños.', 'Preparar uma mensagem curta e simples, adequada também para crianças.'),
    ],
    'ordem': [
        passo('Saludo', 'Saudação', 'El ministro saluda a la familia y agradece la hospitalidad.', 'O ministro saúda a família e agradece a hospitalidade.'),
        passo('Oración inicial', 'Oração inicial', 'Breve oración pidiendo la presencia de Dios en la casa.', 'Breve oração pedindo a presença de Deus na casa.'),
        passo('Canto', 'Cântico', 'Uno o dos cantos conocidos por todos.', 'Um ou dois cânticos conhecidos por todos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Puede leerla un miembro de la familia.', 'Pode ser lida por um membro da família.'),
        passo('Palabra breve', 'Palavra breve', 'Mensaje de 10 minutos aplicado a la vida en familia.', 'Mensagem de 10 minutos aplicada à vida em família.'),
        passo('Momento de diálogo', 'Momento de conversa', 'Se invita a compartir peticiones y motivos de gratitud.', 'Convida-se a compartilhar pedidos e motivos de gratidão.'),
        passo('Oración por la familia', 'Oração pela família', 'Se ora por cada miembro y por las necesidades presentadas.', 'Ora-se por cada membro e pelas necessidades apresentadas.'),
        passo('Bendición', 'Bênção', 'Se despide con la bendición sobre el hogar.', 'Despede-se com a bênção sobre o lar.'),
    ],
    'textos': ['5.24.15', '4.6.6-7', '18.127.1-2', '43.16.31-34', '48.6.1-4', '50.3.16-17', '41.19.5-9'],
    'falas': [
        fala('Saludo a la familia', 'Saudação à família',
             'Paz sea a esta casa. Gracias por abrirnos las puertas de su hogar. Cuando Jesús entraba en una casa, traía salvación, consuelo y alegría. Hoy queremos reunirnos alrededor de su Palabra, orar juntos y pedir que el Señor sea el centro de esta familia. Como dijo Josué: yo y mi casa serviremos a Jehová. Ese es el deseo que presentamos hoy delante de Dios.',
             'Paz seja nesta casa. Obrigado por abrirem as portas do seu lar. Quando Jesus entrava numa casa, trazia salvação, consolo e alegria. Hoje queremos nos reunir ao redor da sua Palavra, orar juntos e pedir que o Senhor seja o centro desta família. Como disse Josué: eu e a minha casa serviremos ao Senhor. Esse é o desejo que apresentamos hoje diante de Deus.'),
        fala('Oración por el hogar', 'Oração pelo lar',
             'Señor, gracias por esta familia y por este hogar. Te pedimos que tu paz habite aquí. Bendice a cada uno: a los padres, a los hijos y a los que viven en esta casa. Protege la salida y la entrada, provee el pan de cada día y guarda la unidad. Que esta casa sea un lugar de oración, de perdón y de alegría. En el nombre de Jesús, amén.',
             'Senhor, obrigado por esta família e por este lar. Pedimos que a tua paz habite aqui. Abençoa cada um: os pais, os filhos e os que moram nesta casa. Protege a saída e a entrada, provê o pão de cada dia e guarda a unidade. Que esta casa seja um lugar de oração, de perdão e de alegria. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Sea breve y respetuoso con el tiempo y la rutina de la familia.', 'Seja breve e respeitoso com o tempo e a rotina da família.'),
        P('Escuche más de lo que habla: muchas veces la visita revela necesidades pastorales.', 'Ouça mais do que fala: muitas vezes a visita revela necessidades pastorais.'),
        P('Si visita solo a una persona del sexo opuesto, vaya acompañado de otro hermano o hermana.', 'Se visitar sozinho uma pessoa do sexo oposto, vá acompanhado de outro irmão ou irmã.'),
    ],
})

# ---------------------------------------------------------------- ação de graças
C.append({
    'k': 'gracas', 'cat': 'fam',
    'n': P('Culto de acción de gracias', 'Culto de ação de graças'),
    'd': P('Agradecer públicamente a Dios por una bendición recibida: una sanidad, una conquista, una casa, un empleo o una respuesta de oración.',
           'Agradecer publicamente a Deus por uma bênção recebida: uma cura, uma conquista, uma casa, um emprego ou uma resposta de oração.'),
    'prep': [
        P('Conversar con la persona o familia sobre el motivo de gratitud.', 'Conversar com a pessoa ou família sobre o motivo de gratidão.'),
        P('Acordar si alguien dará un testimonio breve y cuánto tiempo tendrá.', 'Combinar se alguém dará um testemunho breve e quanto tempo terá.'),
        P('Elegir cantos de alabanza y gratitud.', 'Escolher cânticos de louvor e gratidão.'),
        P('Confirmar si habrá ofrenda especial de gratitud, sin imponerla.', 'Confirmar se haverá oferta especial de gratidão, sem impô-la.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El ministro presenta el motivo del culto.', 'O ministro apresenta o motivo do culto.'),
        passo('Oración de gratitud', 'Oração de gratidão', 'Se agradece a Dios por su fidelidad.', 'Agradece-se a Deus pela sua fidelidade.'),
        passo('Alabanza', 'Louvor', 'Cantos de gratitud.', 'Cânticos de gratidão.'),
        passo('Testimonio', 'Testemunho', 'La persona o la familia cuenta brevemente lo que Dios hizo.', 'A pessoa ou a família conta brevemente o que Deus fez.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los salmos de gratitud sugeridos.', 'Um dos salmos de gratidão sugeridos.'),
        passo('Mensaje', 'Mensagem', 'Mensaje de 10 a 15 minutos sobre la gratitud.', 'Mensagem de 10 a 15 minutos sobre a gratidão.'),
        passo('Ofrenda de gratitud', 'Oferta de gratidão', 'Si se acordó, momento de ofrenda voluntaria.', 'Se foi combinado, momento de oferta voluntária.'),
        passo('Oración y bendición', 'Oração e bênção', 'Se ora por la persona o familia y se despide con la bendición.', 'Ora-se pela pessoa ou família e despede-se com a bênção.'),
    ],
    'textos': ['18.103.1-5', '18.100.1-5', '18.116.12-14', '41.17.15-19', '51.5.16-18', '18.126.1-3'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Hermanos, nos reunimos para dar gracias a Dios. Cuando Jesús sanó a diez leprosos, solo uno volvió para glorificar a Dios en alta voz, y Jesús preguntó por los otros nueve. Hoy no queremos ser de los que olvidan. (Nombre) y su familia quieren reconocer delante de la iglesia lo que el Señor hizo. Unámonos a ellos con alegría, porque la bendición de un hermano es motivo de gozo para todo el cuerpo.',
             'Irmãos, estamos reunidos para dar graças a Deus. Quando Jesus curou dez leprosos, só um voltou para glorificar a Deus em alta voz, e Jesus perguntou pelos outros nove. Hoje não queremos ser dos que esquecem. (Nome) e a sua família querem reconhecer diante da igreja o que o Senhor fez. Vamos nos unir a eles com alegria, porque a bênção de um irmão é motivo de alegria para todo o corpo.'),
        fala('Oración de gratitud', 'Oração de gratidão',
             'Señor, bendecimos tu nombre. Gracias por tu fidelidad y por la respuesta que diste a (nombre). Reconocemos que toda buena dádiva viene de ti. Que esta bendición no nos aleje de ti, sino que nos acerque más. Guarda a esta familia, haz que su gratitud sea constante y que su testimonio anime a otros a confiar en ti. En el nombre de Jesús, amén.',
             'Senhor, bendizemos o teu nome. Obrigado pela tua fidelidade e pela resposta que deste a (nome). Reconhecemos que toda boa dádiva vem de ti. Que esta bênção não nos afaste de ti, mas nos aproxime ainda mais. Guarda esta família, faze que a sua gratidão seja constante e que o seu testemunho anime outros a confiar em ti. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Cuide que el testimonio sea breve, verdadero y centrado en Dios, sin exageraciones.', 'Cuide para que o testemunho seja breve, verdadeiro e centrado em Deus, sem exageros.'),
        P('Si el motivo es una sanidad, evite presentar la medicina como falta de fe.', 'Se o motivo for uma cura, evite apresentar a medicina como falta de fé.'),
        P('Tenga sensibilidad con los presentes que todavía esperan una respuesta parecida.', 'Tenha sensibilidade com os presentes que ainda esperam uma resposta parecida.'),
    ],
})

# ---------------------------------------------------------------- memorial
C.append({
    'k': 'memorial', 'cat': 'fun',
    'n': P('Culto en memoria', 'Culto em memória'),
    'd': P('Recordar con gratitud la vida de una persona fallecida, semanas o meses después, y consolar a la familia con la esperanza cristiana.',
           'Lembrar com gratidão a vida de uma pessoa falecida, semanas ou meses depois, e consolar a família com a esperança cristã.'),
    'prep': [
        P('Conversar con la familia sobre lo que desean recordar y quién hablará.', 'Conversar com a família sobre o que desejam lembrar e quem vai falar.'),
        P('Elegir himnos de esperanza, si es posible algunos que la persona amaba.', 'Escolher hinos de esperança, se possível alguns que a pessoa amava.'),
        P('Preparar una foto o un recuerdo sencillo, si la familia lo desea.', 'Preparar uma foto ou uma lembrança simples, se a família desejar.'),
        P('Pensar en cómo seguir acompañando a la familia después del culto.', 'Pensar em como continuar acompanhando a família depois do culto.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El ministro recibe a la familia y explica el sentido del culto.', 'O ministro recebe a família e explica o sentido do culto.'),
        passo('Oración', 'Oração', 'Se pide consuelo y paz para los que sufren.', 'Pede-se consolo e paz para os que sofrem.'),
        passo('Himno de esperanza', 'Hino de esperança', 'Un himno sobre la vida eterna o el consuelo de Dios.', 'Um hino sobre a vida eterna ou o consolo de Deus.'),
        passo('Recuerdos de la familia', 'Lembranças da família', 'Un familiar comparte brevemente recuerdos y gratitud.', 'Um familiar compartilha brevemente lembranças e gratidão.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Mensaje de esperanza', 'Mensagem de esperança', 'Mensaje de 10 a 15 minutos sobre la resurrección y el consuelo.', 'Mensagem de 10 a 15 minutos sobre a ressurreição e o consolo.'),
        passo('Oración por la familia', 'Oração pela família', 'Se ora por los familiares por nombre, si es apropiado.', 'Ora-se pelos familiares pelo nome, se for apropriado.'),
        passo('Bendición', 'Bênção', 'Se despide con una palabra de paz.', 'Despede-se com uma palavra de paz.'),
    ],
    'textos': ['51.4.13-14', '42.11.25-26', '18.116.15', '46.1.3-4', '65.21.3-4', '24.3.22-24'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Querida familia y amigos: hace (tiempo) despedimos a (nombre). Hoy volvemos a reunirnos, no para reabrir la herida, sino para dar gracias a Dios por su vida y para recordar que nuestra esperanza está en Cristo. El dolor de la ausencia continúa, y es natural. La Biblia no nos pide que no lloremos, sino que no nos entristezcamos como los que no tienen esperanza. Recordemos juntos con gratitud.',
             'Querida família e amigos: há (tempo) nos despedimos de (nome). Hoje voltamos a nos reunir, não para reabrir a ferida, mas para dar graças a Deus pela sua vida e lembrar que a nossa esperança está em Cristo. A dor da ausência continua, e isso é natural. A Bíblia não nos pede que não choremos, mas que não nos entristeçamos como os que não têm esperança. Vamos lembrar juntos com gratidão.'),
        fala('Oración por la familia', 'Oração pela família',
             'Padre de toda consolación, gracias por la vida de (nombre) y por todo lo bueno que compartió con nosotros. Abraza a esta familia en su dolor. En los días de nostalgia, sé su refugio; en las noches difíciles, dales tu paz. Renueva en nosotros la esperanza de la resurrección en Cristo y ayúdanos a vivir con fe. En el nombre de Jesús, amén.',
             'Pai de toda consolação, obrigado pela vida de (nome) e por tudo de bom que compartilhou conosco. Abraça esta família na sua dor. Nos dias de saudade, sê o seu refúgio; nas noites difíceis, dá-lhes a tua paz. Renova em nós a esperança da ressurreição em Cristo e ajuda-nos a viver com fé. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Siga la doctrina de su iglesia: no se ora por el destino del fallecido, sino por el consuelo de los vivos, si esa es su convicción.', 'Siga a doutrina da sua igreja: não se ora pelo destino do falecido, mas pelo consolo dos vivos, se essa for a sua convicção.'),
        P('No haga afirmaciones sobre la salvación de la persona que usted no pueda sostener.', 'Não faça afirmações sobre a salvação da pessoa que você não possa sustentar.'),
        P('Esté atento a señales de duelo prolongado y sugiera ayuda profesional cuando sea necesario.', 'Fique atento a sinais de luto prolongado e sugira ajuda profissional quando for necessário.'),
    ],
})

# ---------------------------------------------------------------- envio de missionários
C.append({
    'k': 'missao', 'cat': 'ord',
    'n': P('Envío de misioneros', 'Envio de missionários'),
    'd': P('Comisionar y despedir a hermanos enviados a la obra misionera, comprometiendo a la iglesia a sostenerlos en oración y apoyo.',
           'Comissionar e despedir irmãos enviados à obra missionária, comprometendo a igreja a sustentá-los em oração e apoio.'),
    'prep': [
        P('Confirmar con el liderazgo el campo, el tiempo y la forma de sostén.', 'Confirmar com a liderança o campo, o tempo e a forma de sustento.'),
        P('Pedir a los misioneros un testimonio breve sobre su llamado.', 'Pedir aos missionários um testemunho breve sobre o seu chamado.'),
        P('Preparar una forma de que la iglesia se comprometa a orar (lista, tarjeta, grupo).', 'Preparar uma forma de a igreja se comprometer a orar (lista, cartão, grupo).'),
        P('Invitar a los familiares de los misioneros a estar presentes.', 'Convidar os familiares dos missionários a estarem presentes.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El ministro presenta el motivo del culto.', 'O ministro apresenta o motivo do culto.'),
        passo('Alabanza', 'Louvor', 'Cantos sobre la misión y la entrega.', 'Cânticos sobre a missão e a entrega.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Testimonio de los misioneros', 'Testemunho dos missionários', 'Cuentan cómo Dios los llamó y a dónde van.', 'Contam como Deus os chamou e para onde vão.'),
        passo('Mensaje', 'Mensagem', 'Mensaje de 15 minutos sobre la misión de la iglesia.', 'Mensagem de 15 minutos sobre a missão da igreja.'),
        passo('Compromiso de la iglesia', 'Compromisso da igreja', 'La congregación se compromete a orar y sostener.', 'A congregação se compromete a orar e sustentar.'),
        passo('Oración de envío', 'Oração de envio', 'Los líderes imponen las manos sobre los misioneros.', 'Os líderes impõem as mãos sobre os missionários.'),
        passo('Bendición y despedida', 'Bênção e despedida', 'Se despide con la bendición y un tiempo de saludo.', 'Despede-se com a bênção e um tempo de saudação.'),
    ],
    'textos': ['43.13.1-3', '39.28.18-20', '22.6.8', '44.10.14-15', '43.1.8', '49.1.3-5'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amada iglesia: en Antioquía, mientras los hermanos ministraban al Señor y ayunaban, el Espíritu Santo dijo: apartadme a Bernabé y a Saulo para la obra a que los he llamado. Hoy vivimos un momento parecido. (Nombres) responden al llamado de Dios para servir en (lugar). No los enviamos solos: los enviamos como iglesia, con nuestras oraciones, nuestro cuidado y nuestro apoyo.',
             'Amada igreja: em Antioquia, enquanto os irmãos ministravam ao Senhor e jejuavam, o Espírito Santo disse: separai-me Barnabé e Saulo para a obra a que os tenho chamado. Hoje vivemos um momento parecido. (Nomes) respondem ao chamado de Deus para servir em (lugar). Não os enviamos sozinhos: nós os enviamos como igreja, com as nossas orações, o nosso cuidado e o nosso apoio.'),
        fala('Compromiso de la iglesia', 'Compromisso da igreja',
             '(El ministro pregunta a la congregación:) ¿Se comprometen ustedes a orar con constancia por estos hermanos, a cuidarlos, a escribirles y a sostener esta obra según sus posibilidades, para que el nombre de Cristo sea anunciado en (lugar)? (La congregación responde:) Sí, con la ayuda de Dios, nos comprometemos.',
             '(O ministro pergunta à congregação:) Vocês se comprometem a orar com constância por estes irmãos, a cuidar deles, a escrever para eles e a sustentar esta obra conforme as suas possibilidades, para que o nome de Cristo seja anunciado em (lugar)? (A congregação responde:) Sim, com a ajuda de Deus, nós nos comprometemos.'),
        fala('Oración de envío', 'Oração de envio',
             'Señor de la mies, te presentamos a (nombres), a quienes llamaste para tu obra. Llénalos de tu Espíritu, guárdalos en el camino, dales salud, sabiduría y fruto abundante. Abre puertas para el evangelio y prepara corazones en (lugar). Cuida a sus familias y mantén a esta iglesia fiel en la oración y el sostén. Los enviamos en el nombre de Jesús. Amén.',
             'Senhor da seara, apresentamos a ti (nomes), a quem chamaste para a tua obra. Enche-os do teu Espírito, guarda-os no caminho, dá-lhes saúde, sabedoria e fruto abundante. Abre portas para o evangelho e prepara corações em (lugar). Cuida das suas famílias e mantém esta igreja fiel na oração e no sustento. Nós os enviamos em nome de Jesus. Amém.'),
    ],
    'obs': [
        P('No prometa en público un sostén que la iglesia no haya aprobado.', 'Não prometa em público um sustento que a igreja não tenha aprovado.'),
        P('Si el destino es un lugar sensible, evite publicar detalles en redes sociales o transmisiones.', 'Se o destino for um lugar sensível, evite publicar detalhes em redes sociais ou transmissões.'),
        P('Defina quién será el contacto pastoral de los misioneros mientras estén en el campo.', 'Defina quem será o contato pastoral dos missionários enquanto estiverem no campo.'),
    ],
})

# ---------------------------------------------------------------- despedida de pastor
C.append({
    'k': 'despedida', 'cat': 'ord',
    'n': P('Despedida de pastor', 'Despedida de pastor'),
    'd': P('Agradecer a Dios por el ministerio de un pastor que deja la iglesia, por traslado o jubilación, y bendecirlo en su nueva etapa.',
           'Agradecer a Deus pelo ministério de um pastor que deixa a igreja, por transferência ou aposentadoria, e abençoá-lo na sua nova etapa.'),
    'prep': [
        P('Coordinar con el liderazgo la fecha y quién presidirá el culto.', 'Combinar com a liderança a data e quem vai presidir o culto.'),
        P('Invitar a algunas personas a dar palabras breves de gratitud.', 'Convidar algumas pessoas para dar palavras breves de gratidão.'),
        P('Preparar, si la iglesia lo desea, un recuerdo o una carta de gratitud.', 'Preparar, se a igreja desejar, uma lembrança ou uma carta de gratidão.'),
        P('Informar con claridad a la congregación sobre la transición pastoral.', 'Informar com clareza a congregação sobre a transição pastoral.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'Un líder presenta el propósito del culto.', 'Um líder apresenta o propósito do culto.'),
        passo('Alabanza', 'Louvor', 'Cantos de gratitud y fidelidad de Dios.', 'Cânticos de gratidão e fidelidade de Deus.'),
        passo('Palabras de gratitud', 'Palavras de gratidão', 'Representantes de la iglesia hablan brevemente.', 'Representantes da igreja falam brevemente.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Palabra del pastor', 'Palavra do pastor', 'El pastor que se despide comparte un mensaje final.', 'O pastor que se despede compartilha uma mensagem final.'),
        passo('Entrega de recuerdo', 'Entrega de lembrança', 'Si se preparó, se entrega el recuerdo o la carta.', 'Se foi preparado, entrega-se a lembrança ou a carta.'),
        passo('Oración de bendición', 'Oração de bênção', 'Los líderes oran por el pastor y su familia.', 'Os líderes oram pelo pastor e pela sua família.'),
        passo('Bendición final', 'Bênção final', 'El pastor despide a la iglesia con la bendición.', 'O pastor despede a igreja com a bênção.'),
    ],
    'textos': ['43.20.32', '54.4.7-8', '49.1.3-6', '51.2.7-8', '57.13.7', '3.6.24-26'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amada iglesia: hoy vivimos un momento de emoción y de gratitud. Durante (tiempo), el pastor (nombre) y su familia sirvieron entre nosotros con la Palabra, con oración y con cuidado. Cuando Pablo se despidió de los ancianos de Éfeso, los encomendó a Dios y a la palabra de su gracia. Así también queremos despedir a nuestro pastor: agradeciendo a Dios y encomendándolo a su cuidado.',
             'Amada igreja: hoje vivemos um momento de emoção e de gratidão. Durante (tempo), o pastor (nome) e a sua família serviram entre nós com a Palavra, com oração e com cuidado. Quando Paulo se despediu dos anciãos de Éfeso, ele os encomendou a Deus e à palavra da sua graça. Assim também queremos despedir o nosso pastor: agradecendo a Deus e entregando-o ao seu cuidado.'),
        fala('Oración de bendición', 'Oração de bênção',
             'Señor, gracias por la vida y el ministerio del pastor (nombre) y de su familia. Gracias por cada palabra sembrada, por cada visita y por cada oración. Bendícelos en su nueva etapa, guárdalos en salud y renueva sus fuerzas. Y a esta iglesia, guíala en la transición, dale unidad y un corazón dispuesto a recibir a quien tú envíes. En el nombre de Jesús, amén.',
             'Senhor, obrigado pela vida e pelo ministério do pastor (nome) e da sua família. Obrigado por cada palavra semeada, por cada visita e por cada oração. Abençoa-os na sua nova etapa, guarda-os em saúde e renova as suas forças. E a esta igreja, guia-a na transição, dá-lhe unidade e um coração disposto a receber quem tu enviares. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Si la salida tuvo conflictos, evite mencionarlos en el culto y priorice la paz.', 'Se a saída teve conflitos, evite mencioná-los no culto e priorize a paz.'),
        P('Siga las normas de su denominación sobre la transición y la entrega de responsabilidades.', 'Siga as normas da sua denominação sobre a transição e a entrega de responsabilidades.'),
        P('Cuide el tiempo de las palabras de gratitud para que el culto no se extienda demasiado.', 'Cuide do tempo das palavras de gratidão para que o culto não se estenda demais.'),
    ],
})

# ---------------------------------------------------------------- posse de líderes
C.append({
    'k': 'lideres', 'cat': 'ord',
    'n': P('Instalación de líderes de ministerios', 'Posse de líderes de ministérios'),
    'd': P('Presentar a la iglesia a los nuevos líderes de departamentos o ministerios y orar por ellos al iniciar su servicio.',
           'Apresentar à igreja os novos líderes de departamentos ou ministérios e orar por eles ao iniciarem o seu serviço.'),
    'prep': [
        P('Confirmar la lista de líderes y ministerios aprobada por la iglesia.', 'Confirmar a lista de líderes e ministérios aprovada pela igreja.'),
        P('Conversar con cada líder sobre sus responsabilidades antes del culto.', 'Conversar com cada líder sobre as suas responsabilidades antes do culto.'),
        P('Preparar el orden de presentación y la ubicación de los líderes al frente.', 'Preparar a ordem de apresentação e o lugar dos líderes à frente.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El pastor explica el propósito de la instalación.', 'O pastor explica o propósito da posse.'),
        passo('Alabanza', 'Louvor', 'Cantos de consagración y servicio.', 'Cânticos de consagração e serviço.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Mensaje', 'Mensagem', 'Mensaje breve sobre el liderazgo como servicio.', 'Mensagem breve sobre a liderança como serviço.'),
        passo('Presentación de los líderes', 'Apresentação dos líderes', 'Se llama a cada líder por nombre y ministerio.', 'Chama-se cada líder pelo nome e pelo ministério.'),
        passo('Compromiso de los líderes', 'Compromisso dos líderes', 'Los líderes responden a las preguntas de compromiso.', 'Os líderes respondem às perguntas de compromisso.'),
        passo('Oración de consagración', 'Oração de consagração', 'El pastor y los líderes anteriores oran por ellos.', 'O pastor e os líderes anteriores oram por eles.'),
        passo('Bendición', 'Bênção', 'Se despide a la iglesia con la bendición.', 'Despede-se a igreja com a bênção.'),
    ],
    'textos': ['39.20.26-28', '44.12.6-8', '59.4.10-11', '45.4.1-2', '53.4.12', '50.3.23-24'],
    'falas': [
        fala('Compromiso de los líderes', 'Compromisso dos líderes',
             '(El pastor pregunta:) ¿Reciben ustedes este servicio como un llamado de Dios y no como un título? ¿Se comprometen a servir con humildad, a trabajar en unidad con el pastor y los demás ministerios, a cuidar de las personas a su cargo y a dar buen ejemplo en palabra y conducta? (Los líderes responden:) Sí, con la ayuda de Dios, nos comprometemos.',
             '(O pastor pergunta:) Vocês recebem este serviço como um chamado de Deus e não como um título? Comprometem-se a servir com humildade, a trabalhar em unidade com o pastor e os demais ministérios, a cuidar das pessoas sob a sua responsabilidade e a dar bom exemplo em palavra e conduta? (Os líderes respondem:) Sim, com a ajuda de Deus, nós nos comprometemos.'),
        fala('Oración de consagración', 'Oração de consagração',
             'Señor, te presentamos a estos hermanos que hoy asumen el servicio en tu iglesia. Dales un corazón humilde, sabiduría para guiar y amor para cuidar. Que cada ministerio sirva para tu gloria y para la edificación del cuerpo. Guárdalos del orgullo y del desánimo, y danos a todos unidad. En el nombre de Jesús, amén.',
             'Senhor, apresentamos a ti estes irmãos que hoje assumem o serviço na tua igreja. Dá-lhes um coração humilde, sabedoria para guiar e amor para cuidar. Que cada ministério sirva para a tua glória e para a edificação do corpo. Guarda-os do orgulho e do desânimo, e dá a todos nós unidade. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Agradezca públicamente a los líderes que terminan su período.', 'Agradeça publicamente aos líderes que terminam o seu período.'),
        P('Entregue por escrito a cada líder sus responsabilidades y a quién debe rendir cuentas.', 'Entregue por escrito a cada líder as suas responsabilidades e a quem deve prestar contas.'),
    ],
})

# ---------------------------------------------------------------- aniversário da igreja
C.append({
    'k': 'anivigreja', 'cat': 'igreja',
    'n': P('Aniversario de la iglesia', 'Aniversário da igreja'),
    'd': P('Celebrar los años de la iglesia recordando la fidelidad de Dios en su historia y renovando el compromiso con su misión.',
           'Celebrar os anos da igreja lembrando a fidelidade de Deus na sua história e renovando o compromisso com a sua missão.'),
    'prep': [
        P('Reunir datos verdaderos de la historia de la iglesia: fecha de fundación, fundadores y hechos importantes.', 'Reunir dados verdadeiros da história da igreja: data de fundação, fundadores e fatos importantes.'),
        P('Invitar a miembros antiguos y, si es posible, a los fundadores o sus familiares.', 'Convidar membros antigos e, se possível, os fundadores ou seus familiares.'),
        P('Preparar fotos o una breve presentación histórica.', 'Preparar fotos ou uma breve apresentação histórica.'),
        P('Definir un desafío concreto para el próximo año.', 'Definir um desafio concreto para o próximo ano.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El pastor da la bienvenida y presenta el motivo de la celebración.', 'O pastor dá as boas-vindas e apresenta o motivo da celebração.'),
        passo('Alabanza', 'Louvor', 'Cantos de gratitud por la fidelidad de Dios.', 'Cânticos de gratidão pela fidelidade de Deus.'),
        passo('Memoria histórica', 'Memória histórica', 'Breve relato de la historia de la iglesia.', 'Breve relato da história da igreja.'),
        passo('Homenaje', 'Homenagem', 'Reconocimiento a fundadores o miembros antiguos.', 'Reconhecimento a fundadores ou membros antigos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Mensaje', 'Mensagem', 'Mensaje sobre la fidelidad de Dios y la misión de la iglesia.', 'Mensagem sobre a fidelidade de Deus e a missão da igreja.'),
        passo('Renovación del compromiso', 'Renovação do compromisso', 'La iglesia renueva su compromiso con la misión.', 'A igreja renova o seu compromisso com a missão.'),
        passo('Oración y bendición', 'Oração e bênção', 'Oración por la iglesia y bendición final.', 'Oração pela igreja e bênção final.'),
    ],
    'textos': ['8.7.12', '4.8.2-3', '18.126.3', '39.16.18', '43.2.42-47', '48.3.20-21'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amada iglesia: hoy celebramos (número) años de la fidelidad de Dios en esta congregación. Cuando Samuel levantó una piedra después de una victoria, la llamó Ebenezer y dijo: hasta aquí nos ayudó Jehová. Esa es nuestra confesión hoy. Recordamos con gratitud a los que comenzaron esta obra, a los que sirvieron y a los que ya partieron con el Señor. Y miramos hacia adelante con fe.',
             'Amada igreja: hoje celebramos (número) anos da fidelidade de Deus nesta congregação. Quando Samuel levantou uma pedra depois de uma vitória, chamou-a de Ebenézer e disse: até aqui nos ajudou o Senhor. Essa é a nossa confissão hoje. Lembramos com gratidão dos que começaram esta obra, dos que serviram e dos que já partiram para estar com o Senhor. E olhamos para frente com fé.'),
        fala('Oración de renovación del compromiso', 'Oração de renovação do compromisso',
             '(El pastor invita a la iglesia a ponerse de pie y decir juntos:) Señor, agradecemos tu fidelidad en todos estos años. Renovamos nuestro compromiso de perseverar en la doctrina de los apóstoles, en la comunión, en el partimiento del pan y en las oraciones. Queremos anunciar el evangelio en nuestra ciudad, cuidar unos de otros y servir con alegría. Que tu nombre sea glorificado en esta iglesia. Amén.',
             '(O pastor convida a igreja a ficar de pé e dizer junto:) Senhor, agradecemos a tua fidelidade em todos estes anos. Renovamos o nosso compromisso de perseverar na doutrina dos apóstolos, na comunhão, no partir do pão e nas orações. Queremos anunciar o evangelho na nossa cidade, cuidar uns dos outros e servir com alegria. Que o teu nome seja glorificado nesta igreja. Amém.'),
    ],
    'obs': [
        P('Verifique cada dato histórico antes de mencionarlo; no improvise fechas ni nombres.', 'Confira cada dado histórico antes de mencioná-lo; não improvise datas nem nomes.'),
        P('Evite que el homenaje se convierta en culto a personas: la gloria es de Dios.', 'Evite que a homenagem se transforme em culto a pessoas: a glória é de Deus.'),
        P('Tenga cuidado de no olvidar a grupos o ministerios que también formaron parte de la historia.', 'Tenha cuidado para não esquecer grupos ou ministérios que também fizeram parte da história.'),
    ],
})

# ---------------------------------------------------------------- passagem de ano
C.append({
    'k': 'anonovo', 'cat': 'igreja',
    'n': P('Culto de fin de año', 'Culto de passagem de ano'),
    'd': P('Despedir el año con gratitud y recibir el nuevo con oración, consagración y esperanza.',
           'Despedir o ano com gratidão e receber o novo com oração, consagração e esperança.'),
    'prep': [
        P('Definir el horario de inicio y de cierre, considerando la seguridad de la salida.', 'Definir o horário de início e de encerramento, considerando a segurança da saída.'),
        P('Preparar momentos de testimonio breves y organizados.', 'Preparar momentos de testemunho breves e organizados.'),
        P('Elegir un versículo o tema para el nuevo año.', 'Escolher um versículo ou tema para o novo ano.'),
        P('Coordinar la Santa Cena, si la iglesia la celebra en este culto.', 'Combinar a Santa Ceia, se a igreja a celebra neste culto.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El pastor saluda y presenta el propósito del culto.', 'O pastor saúda e apresenta o propósito do culto.'),
        passo('Alabanza', 'Louvor', 'Cantos de gratitud.', 'Cânticos de gratidão.'),
        passo('Testimonios del año', 'Testemunhos do ano', 'Algunos hermanos comparten brevemente lo que Dios hizo.', 'Alguns irmãos compartilham brevemente o que Deus fez.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Uno de los textos sugeridos.', 'Um dos textos sugeridos.'),
        passo('Mensaje', 'Mensagem', 'Mensaje sobre la fidelidad de Dios y el año que comienza.', 'Mensagem sobre a fidelidade de Deus e o ano que começa.'),
        passo('Tiempo de oración', 'Tempo de oração', 'Oración de gratitud, arrepentimiento y consagración.', 'Oração de gratidão, arrependimento e consagração.'),
        passo('Santa Cena (opcional)', 'Santa Ceia (opcional)', 'Si la iglesia lo acostumbra.', 'Se a igreja tiver esse costume.'),
        passo('Palabra para el nuevo año', 'Palavra para o novo ano', 'Se presenta el versículo o tema elegido.', 'Apresenta-se o versículo ou tema escolhido.'),
        passo('Bendición', 'Bênção', 'Se despide a la iglesia con la bendición.', 'Despede-se a igreja com a bênção.'),
    ],
    'textos': ['24.3.22-23', '18.90.12', '22.43.18-19', '49.3.13-14', '18.65.11', '19.3.5-6'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amada iglesia: llegamos al final de un año más. Hubo alegrías y lágrimas, victorias y luchas, pero en todo podemos decir con Jeremías que las misericordias del Señor nunca se terminaron y que son nuevas cada mañana. Esta noche queremos agradecer lo que pasó, entregar a Dios lo que nos pesa y comenzar el nuevo año en su presencia.',
             'Amada igreja: chegamos ao final de mais um ano. Houve alegrias e lágrimas, vitórias e lutas, mas em tudo podemos dizer com Jeremias que as misericórdias do Senhor não têm fim e se renovam a cada manhã. Esta noite queremos agradecer pelo que passou, entregar a Deus o que nos pesa e começar o novo ano na sua presença.'),
        fala('Oración de consagración', 'Oração de consagração',
             'Señor, gracias por tu fidelidad en este año. Perdona nuestras faltas y sana nuestras heridas. Hoy te entregamos el año que comienza: nuestras familias, nuestros trabajos, nuestra salud y esta iglesia. Enséñanos a contar nuestros días y a vivir con sabiduría. Que en cada mes busquemos primero tu reino. En el nombre de Jesús, amén.',
             'Senhor, obrigado pela tua fidelidade neste ano. Perdoa as nossas faltas e cura as nossas feridas. Hoje entregamos a ti o ano que começa: as nossas famílias, os nossos trabalhos, a nossa saúde e esta igreja. Ensina-nos a contar os nossos dias e a viver com sabedoria. Que em cada mês busquemos primeiro o teu reino. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Evite «profecías» o promesas específicas para el año que no estén en la Palabra.', 'Evite “profecias” ou promessas específicas para o ano que não estejam na Palavra.'),
        P('Organice la salida con cuidado si el culto termina a medianoche, sobre todo con niños y ancianos.', 'Organize a saída com cuidado se o culto terminar à meia-noite, principalmente com crianças e idosos.'),
    ],
})

# ---------------------------------------------------------------- natal
C.append({
    'k': 'natal', 'cat': 'igreja',
    'n': P('Culto de Navidad', 'Culto de Natal'),
    'd': P('Celebrar el nacimiento de Jesús, centrando la fiesta en el Salvador y abriendo las puertas a familias y visitantes.',
           'Celebrar o nascimento de Jesus, centrando a festa no Salvador e abrindo as portas para famílias e visitantes.'),
    'prep': [
        P('Planificar la participación de niños, coros o grupos con tiempo.', 'Planejar a participação de crianças, corais ou grupos com antecedência.'),
        P('Preparar un mensaje claro del evangelio para los visitantes.', 'Preparar uma mensagem clara do evangelho para os visitantes.'),
        P('Organizar la recepción de visitantes y una forma de contacto posterior.', 'Organizar a recepção de visitantes e uma forma de contato posterior.'),
        P('Evaluar una acción solidaria con familias necesitadas.', 'Avaliar uma ação solidária com famílias necessitadas.'),
    ],
    'ordem': [
        passo('Bienvenida', 'Boas-vindas', 'Saludo especial a las familias y visitantes.', 'Saudação especial às famílias e visitantes.'),
        passo('Cantos de Navidad', 'Cânticos de Natal', 'Himnos y cantos sobre el nacimiento de Jesús.', 'Hinos e cânticos sobre o nascimento de Jesus.'),
        passo('Lectura del relato', 'Leitura da narrativa', 'Lectura de Lucas 2 o Mateo 1, por varias voces si se desea.', 'Leitura de Lucas 2 ou Mateus 1, por várias vozes, se desejar.'),
        passo('Participación de niños', 'Participação das crianças', 'Presentación o canto de los niños.', 'Apresentação ou cântico das crianças.'),
        passo('Mensaje', 'Mensagem', 'Mensaje de 15 minutos sobre el sentido de la Navidad.', 'Mensagem de 15 minutos sobre o sentido do Natal.'),
        passo('Invitación', 'Convite', 'Invitación a recibir a Cristo y a volver a la iglesia.', 'Convite para receber Cristo e voltar à igreja.'),
        passo('Oración', 'Oração', 'Oración por las familias presentes.', 'Oração pelas famílias presentes.'),
        passo('Bendición y confraternización', 'Bênção e confraternização', 'Bendición final y saludo a los visitantes.', 'Bênção final e saudação aos visitantes.'),
    ],
    'textos': ['41.2.8-14', '22.9.6', '39.1.21-23', '42.1.14', '42.3.16', '47.4.4-5'],
    'falas': [
        fala('Palabras de bienvenida', 'Palavras de boas-vindas',
             'Sean todos bienvenidos a esta celebración. Hace más de dos mil años, unos pastores que cuidaban sus rebaños de noche oyeron la noticia más grande de la historia: os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor. Esta noche queremos celebrar esa buena noticia. Que entre las luces, los regalos y las comidas, no se olvide el centro de la fiesta: Jesús.',
             'Sejam todos bem-vindos a esta celebração. Há mais de dois mil anos, uns pastores que cuidavam dos seus rebanhos à noite ouviram a maior notícia da história: hoje vos nasceu, na cidade de Davi, o Salvador, que é Cristo, o Senhor. Esta noite queremos celebrar essa boa notícia. Que entre as luzes, os presentes e as comidas, não seja esquecido o centro da festa: Jesus.'),
        fala('Oración por las familias', 'Oração pelas famílias',
             'Padre, gracias porque enviaste a tu Hijo al mundo. Gracias porque Jesús vino como Salvador. Te pedimos por cada familia aquí presente: trae paz a los hogares, consuelo a los que extrañan a alguien y esperanza a los que sufren. Que muchos reciban hoy el mejor regalo, que es Cristo. En su nombre, amén.',
             'Pai, obrigado porque enviaste o teu Filho ao mundo. Obrigado porque Jesus veio como Salvador. Pedimos por cada família aqui presente: traz paz aos lares, consolo aos que sentem saudade de alguém e esperança aos que sofrem. Que muitos recebam hoje o melhor presente, que é Cristo. Em seu nome, amém.'),
    ],
    'obs': [
        P('Recuerde que para algunas personas la Navidad es un tiempo de dolor por pérdidas recientes.', 'Lembre que para algumas pessoas o Natal é um tempo de dor por perdas recentes.'),
        P('Cuide que la presentación de los niños no reemplace el mensaje del evangelio.', 'Cuide para que a apresentação das crianças não substitua a mensagem do evangelho.'),
        P('Tenga un equipo para saludar y registrar a los visitantes que deseen contacto.', 'Tenha uma equipe para saudar e registrar os visitantes que desejarem contato.'),
    ],
})

# ---------------------------------------------------------------- restauração de membro
C.append({
    'k': 'restaur', 'cat': 'igreja',
    'n': P('Restauración de un miembro', 'Restauração de um membro'),
    'd': P('Recibir de nuevo en la comunión a un hermano que se había apartado y volvió arrepentido, con amor y sin exposición innecesaria.',
           'Receber de novo na comunhão um irmão que tinha se afastado e voltou arrependido, com amor e sem exposição desnecessária.'),
    'prep': [
        P('Conversar en privado con la persona y confirmar su deseo sincero de volver.', 'Conversar em particular com a pessoa e confirmar o seu desejo sincero de voltar.'),
        P('Seguir el proceso de la iglesia o denominación sobre restauración de miembros.', 'Seguir o processo da igreja ou denominação sobre restauração de membros.'),
        P('Acordar con la persona qué se dirá en público y qué quedará en privado.', 'Combinar com a pessoa o que será dito em público e o que ficará em particular.'),
        P('Designar a un hermano maduro para acompañarla en los primeros meses.', 'Designar um irmão maduro para acompanhá-la nos primeiros meses.'),
    ],
    'ordem': [
        passo('Contexto', 'Contexto', 'Durante el culto regular, el pastor presenta el momento con sencillez.', 'Durante o culto regular, o pastor apresenta o momento com simplicidade.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee la parábola del hijo pródigo u otro texto sugerido.', 'Lê-se a parábola do filho pródigo ou outro texto sugerido.'),
        passo('Palabra breve', 'Palavra breve', 'Palabra sobre el perdón y la gracia de Dios.', 'Palavra sobre o perdão e a graça de Deus.'),
        passo('Declaración del hermano', 'Declaração do irmão', 'La persona declara brevemente su deseo de volver a caminar con Cristo.', 'A pessoa declara brevemente o seu desejo de voltar a caminhar com Cristo.'),
        passo('Recepción por la iglesia', 'Recepção pela igreja', 'La iglesia expresa que la recibe con amor.', 'A igreja expressa que a recebe com amor.'),
        passo('Oración', 'Oração', 'El pastor y los líderes oran por la persona.', 'O pastor e os líderes oram pela pessoa.'),
        passo('Saludo fraternal', 'Saudação fraterna', 'Los hermanos saludan a la persona al final del culto.', 'Os irmãos saúdam a pessoa no final do culto.'),
    ],
    'textos': ['41.15.20-24', '61.1.9', '47.6.1-2', '18.51.10-12', '41.15.7', '27.14.4'],
    'falas': [
        fala('Palabras del pastor', 'Palavras do pastor',
             'Amada iglesia: Jesús contó que, cuando el hijo menor volvió a casa, el padre lo vio de lejos, corrió, lo abrazó y lo besó. No le pidió explicaciones delante de todos; le devolvió su lugar en la familia. Hoy (nombre) vuelve a la casa del Padre. No vamos a hablar de su pasado, porque Dios ya lo perdonó. Vamos a celebrar que hay gozo en el cielo por un pecador que se arrepiente.',
             'Amada igreja: Jesus contou que, quando o filho mais novo voltou para casa, o pai o viu de longe, correu, o abraçou e o beijou. Não lhe pediu explicações diante de todos; devolveu-lhe o seu lugar na família. Hoje (nome) volta para a casa do Pai. Não vamos falar do seu passado, porque Deus já perdoou. Vamos celebrar que há alegria no céu por um pecador que se arrepende.'),
        fala('Oración por el hermano', 'Oração pelo irmão',
             'Padre, gracias por tu amor que nunca se rinde. Gracias porque trajiste de vuelta a (nombre). Afírmalo en tu gracia, sana sus heridas y dale fuerza para permanecer. Ayuda a esta iglesia a recibirlo con amor, a cuidarlo y a caminar a su lado. Que tu Espíritu complete la obra que comenzaste. En el nombre de Jesús, amén.',
             'Pai, obrigado pelo teu amor que nunca desiste. Obrigado porque trouxeste de volta (nome). Firma-o na tua graça, cura as suas feridas e dá-lhe força para permanecer. Ajuda esta igreja a recebê-lo com amor, a cuidar dele e a caminhar ao seu lado. Que o teu Espírito complete a obra que começaste. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Nunca exponga en público detalles del pecado o de la vida privada de la persona.', 'Nunca exponha em público detalhes do pecado ou da vida particular da pessoa.'),
        P('Si la persona lo prefiere, la restauración puede hacerse solo ante el liderazgo.', 'Se a pessoa preferir, a restauração pode ser feita só diante da liderança.'),
        P('Si hubo daño a terceros, oriente la reparación y el cuidado de las víctimas antes del acto público.', 'Se houve dano a terceiros, oriente a reparação e o cuidado das vítimas antes do ato público.'),
    ],
})

# ---------------------------------------------------------------- lava-pés
C.append({
    'k': 'lavapes', 'cat': 'igreja',
    'n': P('Lavamiento de pies', 'Lava-pés'),
    'd': P('Recordar el ejemplo de humildad y servicio de Jesús, en las iglesias que practican el lavamiento de pies.',
           'Lembrar o exemplo de humildade e serviço de Jesus, nas igrejas que praticam o lava-pés.'),
    'prep': [
        P('Confirmar que la práctica forma parte de las costumbres de su iglesia o denominación.', 'Confirmar que a prática faz parte dos costumes da sua igreja ou denominação.'),
        P('Preparar recipientes, agua, toallas y sillas en número suficiente.', 'Preparar bacias, água, toalhas e cadeiras em número suficiente.'),
        P('Definir si hombres y mujeres participarán en grupos separados, según la costumbre local.', 'Definir se homens e mulheres participarão em grupos separados, conforme o costume local.'),
        P('Explicar con anticipación el sentido de la ceremonia a los nuevos miembros.', 'Explicar com antecedência o sentido da cerimônia aos novos membros.'),
    ],
    'ordem': [
        passo('Apertura', 'Abertura', 'El pastor explica el sentido del acto.', 'O pastor explica o sentido do ato.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Juan 13.', 'Lê-se João 13.'),
        passo('Meditación', 'Meditação', 'Palabra breve sobre la humildad y el servicio.', 'Palavra breve sobre a humildade e o serviço.'),
        passo('Oración', 'Oração', 'Se pide un corazón humilde y reconciliado.', 'Pede-se um coração humilde e reconciliado.'),
        passo('Lavamiento de pies', 'Lava-pés', 'Los hermanos lavan los pies unos a otros mientras se canta en voz baja.', 'Os irmãos lavam os pés uns dos outros enquanto se canta em voz baixa.'),
        passo('Momento de reconciliación', 'Momento de reconciliação', 'Espacio para pedir perdón y abrazarse.', 'Espaço para pedir perdão e se abraçar.'),
        passo('Himno y bendición', 'Hino e bênção', 'Se concluye con un himno de servicio y la bendición.', 'Conclui-se com um hino de serviço e a bênção.'),
    ],
    'textos': ['42.13.3-5', '42.13.12-15', '49.2.5-8', '39.20.26-28', '47.5.13', '59.5.5'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Hermanos: la noche antes de la cruz, Jesús se levantó de la cena, se quitó el manto, tomó una toalla y comenzó a lavar los pies de sus discípulos. Era una tarea de siervos, y el Maestro la hizo. Después dijo: os he dado ejemplo, para que como yo os he hecho, vosotros también hagáis. Este acto no nos limpia del pecado, sino que nos recuerda que fuimos llamados a servir con humildad.',
             'Irmãos: na noite antes da cruz, Jesus se levantou da ceia, tirou a sua capa, pegou uma toalha e começou a lavar os pés dos seus discípulos. Era uma tarefa de servos, e o Mestre a fez. Depois disse: eu vos dei o exemplo, para que, como eu vos fiz, façais vós também. Este ato não nos purifica do pecado, mas nos lembra que fomos chamados a servir com humildade.'),
        fala('Oración', 'Oração',
             'Señor Jesús, tú que siendo Maestro te hiciste siervo, quita de nosotros el orgullo. Enséñanos a servir sin buscar reconocimiento, a perdonar y a pedir perdón. Que al lavar los pies de nuestros hermanos, también nuestro corazón sea limpiado de toda ofensa. Haz de esta iglesia una familia de siervos. Amén.',
             'Senhor Jesus, tu que, sendo Mestre, te fizeste servo, tira de nós o orgulho. Ensina-nos a servir sem buscar reconhecimento, a perdoar e a pedir perdão. Que, ao lavar os pés dos nossos irmãos, também o nosso coração seja limpo de toda ofensa. Faze desta igreja uma família de servos. Amém.'),
    ],
    'obs': [
        P('Respete a quien no se sienta cómodo para participar; la participación debe ser voluntaria.', 'Respeite quem não se sentir à vontade para participar; a participação deve ser voluntária.'),
        P('Cuide la higiene: agua limpia y toallas individuales.', 'Cuide da higiene: água limpa e toalhas individuais.'),
        P('Tenga sillas y ayuda para ancianos o personas con dificultades de movilidad.', 'Tenha cadeiras e ajuda para idosos ou pessoas com dificuldades de locomoção.'),
    ],
})

# ================================================================ validação
def carregar(nome):
    with open(os.path.join(RAIZ, 'app', 'biblia', nome), encoding='utf-8') as f:
        return json.load(f)


def versos(bib, ref):
    m = re.fullmatch(r'(\d+)\.(\d+)\.(\d+)(?:-(\d+))?', ref)
    if not m:
        raise ValueError('formato inválido')
    b, c, a, z = int(m[1]), int(m[2]), int(m[3]), int(m[4] or m[3])
    if z < a:
        raise ValueError('intervalo invertido')
    cap = bib[b][c - 1]
    if c < 1 or a < 1 or z > len(cap):
        raise ValueError('fora do capítulo')
    out = [cap[i - 1] for i in range(a, z + 1)]
    for t in out:
        if not t or not t.strip() or t.strip() in ('—', '-'):
            raise ValueError('versículo vazio')
    return out


ES_TU = re.compile(r'\b(tú|ti|contigo|tu|tus|vos)\b', re.I)
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿]')


def validar(C, pt, es, imprimir=False):
    erros = []

    def par(x, onde):
        if not (isinstance(x, list) and len(x) == 2 and all(isinstance(s, str) and s.strip() for s in x)):
            erros.append(f'{onde}: par [ES,PT] inválido')
            return
        for s in x:
            if EMOJI.search(s):
                erros.append(f'{onde}: emoji')

    def faixa(lst, lo, hi, onde):
        if not (lo <= len(lst) <= hi):
            erros.append(f'{onde}: {len(lst)} itens (esperado {lo}-{hi})')

    chaves = [c['k'] for c in C]
    if len(set(chaves)) != len(chaves):
        erros.append('chaves duplicadas')
    for c in C:
        k = c['k']
        if set(c) != {'k', 'cat', 'n', 'd', 'prep', 'ordem', 'textos', 'falas', 'obs'}:
            erros.append(f'{k}: campos {sorted(c)}')
        if c['cat'] not in CATS:
            erros.append(f'{k}: cat {c["cat"]}')
        par(c['n'], f'{k}.n')
        par(c['d'], f'{k}.d')
        faixa(c['prep'], 3, 6, f'{k}.prep')
        for i, p in enumerate(c['prep']):
            par(p, f'{k}.prep[{i}]')
        faixa(c['ordem'], 6, 10, f'{k}.ordem')
        for i, o in enumerate(c['ordem']):
            par(o['t'], f'{k}.ordem[{i}].t')
            par(o['d'], f'{k}.ordem[{i}].d')
        faixa(c['textos'], 4, 8, f'{k}.textos')
        for r in c['textos']:
            for nome, bib in (('pt', pt), ('es', es)):
                try:
                    v = versos(bib, r)
                    if imprimir:
                        print(f'  {k} {r} [{nome}] ' + ' | '.join(v)[:160])
                except (ValueError, IndexError) as e:
                    erros.append(f'{k}: ref {r} em {nome}: {e}')
        faixa(c['falas'], 2, 5, f'{k}.falas')
        for i, f in enumerate(c['falas']):
            par(f['t'], f'{k}.falas[{i}].t')
            par(f['x'], f'{k}.falas[{i}].x')
            for lang, s in zip(('es', 'pt'), f['x']):
                n = len(s.split())
                if not (40 <= n <= 160):
                    erros.append(f'{k}.falas[{i}] {lang}: {n} palavras')
        faixa(c['obs'], 2, 5, f'{k}.obs')
        for i, o in enumerate(c['obs']):
            par(o, f'{k}.obs[{i}]')
        # Espanhol: tratamento de "usted" (sem tú/ti/tu). Orações dirigidas a Deus
        # usam a 2a pessoa ("tu paz", "bendice"), o que é aceito: só checamos
        # textos que não são orações a Deus.
        textos_es = [c['n'][0], c['d'][0]] + [p[0] for p in c['prep']] + [p[0] for p in c['obs']]
        textos_es += [o['t'][0] for o in c['ordem']] + [o['d'][0] for o in c['ordem']]
        textos_es += [f['x'][0] for f in c['falas'] if not re.search(r'oraci|bendici', f['t'][0], re.I)]
        for s in textos_es:
            m = ES_TU.search(s)
            if m:
                erros.append(f'{k}: ES usa "{m.group(0)}": {s[:70]}')
    return erros


def main():
    pt = carregar('pt-livre.json')
    es = carregar('es-rv1909.json')
    for c in C:
        c['obs'] = [list(OBS_MODELO)] + c['obs']
    erros = validar(C, pt, es, imprimir='-v' in sys.argv)
    velhas = {c['k'] for c in json.load(open(os.path.join(AQUI, 'manual.json'), encoding='utf-8'))['c']}
    erros += [f'chave já usada na parte 1: {c["k"]}' for c in C if c['k'] in velhas]
    if erros:
        print('ERROS:')
        for e in erros:
            print(' -', e)
        sys.exit(1)
    with open(SAIDA, 'w', encoding='utf-8') as f:
        json.dump({'c': C}, f, ensure_ascii=False, separators=(',', ':'))
    print(f'OK: {len(C)} cerimônias -> {os.path.relpath(SAIDA, RAIZ)}')


if __name__ == '__main__':
    main()
