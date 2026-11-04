# -*- coding: utf-8 -*-
"""Manual do Ministro (Meu Púlpito): modelos sugeridos de cerimônias, bilíngues [ES, PT].

Gera tools/conteudo/manual.json -> {"c":[...]}.
Regras: tools/conteudo/LEIA-ME.md. Rodar: python3 tools/conteudo/manual.py
Tudo aqui é MODELO SUGERIDO: o ministro adapta à sua igreja, denominação e à lei local.
"""
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
SAIDA = os.path.join(AQUI, 'manual.json')

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
C.append({
    'k': 'casam', 'cat': 'fam',
    'n': P('Ceremonia de boda', 'Cerimônia de casamento'),
    'd': P('Celebrar delante de Dios y de la iglesia la unión de un hombre y una mujer en matrimonio, pidiendo la bendición del Señor sobre el nuevo hogar.',
           'Celebrar diante de Deus e da igreja a união de um homem e uma mulher em casamento, pedindo a bênção do Senhor sobre o novo lar.'),
    'prep': [
        P('Tener consejería prematrimonial con la pareja en los meses anteriores.', 'Fazer aconselhamento pré-nupcial com o casal nos meses anteriores.'),
        P('Confirmar la situación del matrimonio civil según la ley de su país.', 'Confirmar a situação do casamento civil conforme a lei do seu país.'),
        P('Ensayar la entrada, la ubicación de los novios, padrinos y el orden del culto.', 'Ensaiar a entrada, a posição dos noivos, padrinhos e a ordem do culto.'),
        P('Anotar los nombres completos de los novios y verificar la pronunciación.', 'Anotar os nomes completos dos noivos e conferir a pronúncia.'),
        P('Coordinar con los músicos los himnos de entrada, de oración y de salida.', 'Combinar com os músicos os hinos de entrada, de oração e de saída.'),
        P('Preparar los anillos, el acta o certificado de la iglesia y la Biblia.', 'Preparar as alianças, a ata ou certificado da igreja e a Bíblia.'),
    ],
    'ordem': [
        passo('Preludio y entrada', 'Prelúdio e entrada', 'Entran el ministro, el novio, los padrinos y, por último, la novia, mientras se canta o se toca un himno.', 'Entram o ministro, o noivo, os padrinhos e, por último, a noiva, enquanto se canta ou se toca um hino.'),
        passo('Palabras de apertura', 'Palavras de abertura', 'El ministro saluda a los presentes y explica el propósito de la ceremonia ante Dios.', 'O ministro saúda os presentes e explica o propósito da cerimônia diante de Deus.'),
        passo('Oración inicial', 'Oração inicial', 'Se pide la presencia y la bendición del Señor sobre el acto.', 'Pede-se a presença e a bênção do Senhor sobre o ato.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee uno de los textos sugeridos, como Génesis 2 o 1 Corintios 13.', 'Lê-se um dos textos sugeridos, como Gênesis 2 ou 1 Coríntios 13.'),
        passo('Mensaje breve', 'Mensagem breve', 'Exhortación de 10 a 15 minutos sobre el matrimonio según la Palabra.', 'Exortação de 10 a 15 minutos sobre o casamento segundo a Palavra.'),
        passo('Votos de los novios', 'Votos dos noivos', 'Cada novio declara su compromiso delante de Dios y de la iglesia.', 'Cada noivo declara seu compromisso diante de Deus e da igreja.'),
        passo('Entrega de los anillos', 'Entrega das alianças', 'Los novios colocan los anillos como señal del pacto asumido.', 'Os noivos colocam as alianças como sinal da aliança assumida.'),
        passo('Declaración y oración de bendición', 'Declaração e oração de bênção', 'El ministro declara la unión ante la iglesia y ora por la pareja con imposición de manos, si es costumbre.', 'O ministro declara a união diante da igreja e ora pelo casal com imposição de mãos, se for costume.'),
        passo('Firma del acta de la iglesia', 'Assinatura da ata da igreja', 'Firman los novios, los testigos y el ministro, si la iglesia lleva ese registro.', 'Assinam os noivos, as testemunhas e o ministro, se a igreja mantém esse registro.'),
        passo('Bendición final y salida', 'Bênção final e saída', 'El ministro presenta a la pareja y despide a la congregación con la bendición.', 'O ministro apresenta o casal e despede a congregação com a bênção.'),
    ],
    'textos': ['0.2.18-24', '39.19.4-6', '48.5.25-33', '45.13.4-8', '20.4.9-12', '7.1.16-17', '50.3.12-14'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amados hermanos y amigos: estamos reunidos en la presencia de Dios para celebrar la unión de (nombre del novio) y (nombre de la novia) en santo matrimonio. El matrimonio fue instituido por Dios desde el principio, cuando dijo que no era bueno que el hombre estuviera solo. Por eso no debe tomarse a la ligera, sino con reverencia, con amor y con temor de Dios. Les invito a acompañar a esta pareja con sus oraciones.',
             'Amados irmãos e amigos: estamos reunidos na presença de Deus para celebrar a união de (nome do noivo) e (nome da noiva) em santo matrimônio. O casamento foi instituído por Deus desde o princípio, quando disse que não era bom que o homem estivesse só. Por isso não deve ser assumido de forma leviana, mas com reverência, com amor e com temor de Deus. Convido vocês a acompanharem este casal com suas orações.'),
        fala('Voto del novio', 'Voto do noivo',
             'Yo, (nombre del novio), delante de Dios y de esta iglesia, recibo a (nombre de la novia) como mi esposa. Prometo amarla como Cristo amó a la iglesia, respetarla, cuidarla y serle fiel, en la abundancia y en la escasez, en la salud y en la enfermedad, en la alegría y en la tristeza, todos los días de mi vida. Con la ayuda del Señor, edificaré con ella un hogar que honre su nombre.',
             'Eu, (nome do noivo), diante de Deus e desta igreja, recebo (nome da noiva) como minha esposa. Prometo amá-la como Cristo amou a igreja, respeitá-la, cuidar dela e ser-lhe fiel, na fartura e na escassez, na saúde e na doença, na alegria e na tristeza, todos os dias da minha vida. Com a ajuda do Senhor, edificarei com ela um lar que honre o seu nome.'),
        fala('Voto de la novia', 'Voto da noiva',
             'Yo, (nombre de la novia), delante de Dios y de esta iglesia, recibo a (nombre del novio) como mi esposo. Prometo amarlo, respetarlo, cuidarlo y serle fiel, en la abundancia y en la escasez, en la salud y en la enfermedad, en la alegría y en la tristeza, todos los días de mi vida. Con la ayuda del Señor, edificaré con él un hogar que honre su nombre.',
             'Eu, (nome da noiva), diante de Deus e desta igreja, recebo (nome do noivo) como meu esposo. Prometo amá-lo, respeitá-lo, cuidar dele e ser-lhe fiel, na fartura e na escassez, na saúde e na doença, na alegria e na tristeza, todos os dias da minha vida. Com a ajuda do Senhor, edificarei com ele um lar que honre o seu nome.'),
        fala('Entrega de los anillos', 'Entrega das alianças',
             'El anillo es un círculo sin fin y nos recuerda que el amor verdadero no se cansa ni se rinde. (Cada novio, al colocar el anillo, dice:) Entrego este anillo como señal de mi amor y de mi fidelidad. Que sea recuerdo del pacto que hoy hago delante de Dios, en el nombre del Padre, del Hijo y del Espíritu Santo.',
             'A aliança é um círculo sem fim e nos lembra que o amor verdadeiro não se cansa nem desiste. (Cada noivo, ao colocar a aliança, diz:) Entrego esta aliança como sinal do meu amor e da minha fidelidade. Que ela lembre o pacto que hoje faço diante de Deus, em nome do Pai, do Filho e do Espírito Santo.'),
        fala('Declaración y bendición', 'Declaração e bênção',
             'Habiendo (nombre del novio) y (nombre de la novia) declarado su compromiso delante de Dios y de esta iglesia, les presento como esposo y esposa. Lo que Dios juntó, no lo separe el hombre. Señor, bendice este hogar; que tu paz habite en él, que tu Palabra sea su fundamento y que tu amor les sostenga todos los días. En el nombre de Jesús, amén.',
             'Tendo (nome do noivo) e (nome da noiva) declarado seu compromisso diante de Deus e desta igreja, eu os apresento como marido e mulher. O que Deus uniu, o homem não separe. Senhor, abençoa este lar; que a tua paz habite nele, que a tua Palavra seja o seu fundamento e que o teu amor os sustente todos os dias. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Los requisitos y efectos del matrimonio civil dependen de la ley de cada país. La ceremonia religiosa puede no sustituir al registro civil: consulte la ley local y oriente a la pareja antes de fijar la fecha.',
          'Os requisitos e efeitos do casamento civil dependem da lei de cada país. A cerimônia religiosa pode não substituir o registro civil: consulte a lei local e oriente o casal antes de marcar a data.'),
        P('Siga las normas de su iglesia o denominación sobre a quién se puede casar y quién puede oficiar.', 'Siga as normas da sua igreja ou denominação sobre quem pode ser casado e quem pode oficiar.'),
        P('Evite bromas o comentarios que avergüencen a los novios o a sus familias.', 'Evite brincadeiras ou comentários que constranjam os noivos ou suas famílias.'),
        P('Cuide el horario: una ceremonia sobria y puntual honra a los invitados.', 'Cuide do horário: uma cerimônia sóbria e pontual honra os convidados.'),
    ],
})

# ---------------------------------------------------------------- bodas
C.append({
    'k': 'bodas', 'cat': 'fam',
    'n': P('Renovación de votos – bodas', 'Renovação de votos – bodas'),
    'd': P('Dar gracias a Dios por los años de matrimonio de una pareja y renovar, delante de la iglesia, el compromiso asumido.',
           'Dar graças a Deus pelos anos de casamento de um casal e renovar, diante da igreja, o compromisso assumido.'),
    'prep': [
        P('Conversar con la pareja sobre su historia y los motivos de gratitud.', 'Conversar com o casal sobre sua história e os motivos de gratidão.'),
        P('Confirmar cuántos años de matrimonio se celebran y los nombres de hijos y nietos.', 'Confirmar quantos anos de casamento se celebram e os nomes de filhos e netos.'),
        P('Definir si habrá testimonio de la pareja o de los hijos y su duración.', 'Definir se haverá testemunho do casal ou dos filhos e quanto tempo terá.'),
        P('Preparar los anillos, si la pareja desea entregarlos de nuevo.', 'Preparar as alianças, se o casal desejar entregá-las de novo.'),
    ],
    'ordem': [
        passo('Entrada de la pareja', 'Entrada do casal', 'La pareja entra acompañada por hijos o nietos, mientras se canta un himno.', 'O casal entra acompanhado de filhos ou netos, enquanto se canta um hino.'),
        passo('Palabras de apertura', 'Palavras de abertura', 'El ministro explica que es un culto de gratitud por la fidelidad de Dios.', 'O ministro explica que é um culto de gratidão pela fidelidade de Deus.'),
        passo('Oración', 'Oração', 'Oración de gratitud por los años vividos juntos.', 'Oração de gratidão pelos anos vividos juntos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee el Salmo 128 o Lamentaciones 3:22-23.', 'Lê-se o Salmo 128 ou Lamentações 3:22-23.'),
        passo('Testimonio', 'Testemunho', 'La pareja o un familiar cuenta brevemente cómo Dios les ha sostenido.', 'O casal ou um familiar conta brevemente como Deus os sustentou.'),
        passo('Mensaje breve', 'Mensagem breve', 'Exhortación sobre la fidelidad de Dios y la perseverancia en el matrimonio.', 'Exortação sobre a fidelidade de Deus e a perseverança no casamento.'),
        passo('Renovación de votos', 'Renovação de votos', 'Los esposos repiten o leen sus votos renovados.', 'Os esposos repetem ou leem seus votos renovados.'),
        passo('Oración de bendición y salida', 'Oração de bênção e saída', 'El ministro ora por la pareja y por su descendencia y despide a la iglesia.', 'O ministro ora pelo casal e por sua descendência e despede a igreja.'),
    ],
    'textos': ['18.128.1-4', '24.3.22-23', '8.7.12', '18.127.1', '45.13.7-8', '20.4.9-12', '18.103.1-5'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Hermanos, hoy damos gracias a Dios por (número) años de matrimonio de (nombre) y (nombre). No celebramos solamente el esfuerzo de dos personas, sino la fidelidad del Señor, que les sostuvo en los días buenos y en los días difíciles. Como Samuel, podemos levantar una piedra de memoria y decir: Hasta aquí nos ayudó el Señor.',
             'Irmãos, hoje damos graças a Deus por (número) anos de casamento de (nome) e (nome). Não celebramos apenas o esforço de duas pessoas, mas a fidelidade do Senhor, que os sustentou nos dias bons e nos dias difíceis. Como Samuel, podemos levantar uma pedra de memória e dizer: Até aqui nos ajudou o Senhor.'),
        fala('Votos renovados del esposo', 'Votos renovados do esposo',
             'Yo, (nombre), delante de Dios y de esta iglesia, agradezco al Señor por (nombre de la esposa) y por los años que hemos vivido juntos. Renuevo hoy mi promesa de amarla, respetarla, cuidarla y serle fiel, en la salud y en la enfermedad, en la abundancia y en la escasez, por todos los días que Dios nos conceda.',
             'Eu, (nome), diante de Deus e desta igreja, agradeço ao Senhor por (nome da esposa) e pelos anos que vivemos juntos. Renovo hoje a minha promessa de amá-la, respeitá-la, cuidar dela e ser-lhe fiel, na saúde e na doença, na fartura e na escassez, por todos os dias que Deus nos conceder.'),
        fala('Votos renovados de la esposa', 'Votos renovados da esposa',
             'Yo, (nombre), delante de Dios y de esta iglesia, agradezco al Señor por (nombre del esposo) y por los años que hemos vivido juntos. Renuevo hoy mi promesa de amarlo, respetarlo, cuidarlo y serle fiel, en la salud y en la enfermedad, en la abundancia y en la escasez, por todos los días que Dios nos conceda.',
             'Eu, (nome), diante de Deus e desta igreja, agradeço ao Senhor por (nome do esposo) e pelos anos que vivemos juntos. Renovo hoje a minha promessa de amá-lo, respeitá-lo, cuidar dele e ser-lhe fiel, na saúde e na doença, na fartura e na escassez, por todos os dias que Deus nos conceder.'),
        fala('Oración de bendición', 'Oração de bênção',
             'Señor, gracias por tu misericordia, que es nueva cada mañana. Gracias por este matrimonio y por todo lo que has hecho en este hogar. Renueva el amor de estos esposos, dales salud, paciencia y alegría, y que su ejemplo inspire a sus hijos, a sus nietos y a la iglesia. En el nombre de Jesús, amén.',
             'Senhor, obrigado pela tua misericórdia, que se renova a cada manhã. Obrigado por este casamento e por tudo o que fizeste neste lar. Renova o amor destes esposos, dá-lhes saúde, paciência e alegria, e que o seu exemplo inspire seus filhos, seus netos e a igreja. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('La renovación de votos no es un nuevo matrimonio civil ni religioso; es un acto de gratitud.', 'A renovação de votos não é um novo casamento civil nem religioso; é um ato de gratidão.'),
        P('Sea discreto si la pareja atravesó crisis: no exponga en público lo que le contaron en privado.', 'Seja discreto se o casal passou por crises: não exponha em público o que foi contado em particular.'),
        P('Si uno de los esposos tiene dificultades de salud, adapte el tiempo de pie y la duración.', 'Se um dos esposos tem dificuldades de saúde, adapte o tempo em pé e a duração.'),
    ],
})

# ---------------------------------------------------------------- 15 anos
C.append({
    'k': 'quinze', 'cat': 'fam',
    'n': P('Culto de acción de gracias por los 15 años', 'Culto de ação de graças pelos 15 anos'),
    'd': P('Agradecer a Dios por la vida de una joven al cumplir 15 años y consagrar su juventud al Señor, con la participación de su familia.',
           'Agradecer a Deus pela vida de uma jovem ao completar 15 anos e consagrar sua juventude ao Senhor, com a participação de sua família.'),
    'prep': [
        P('Conversar con la joven y sus padres sobre el sentido espiritual del culto.', 'Conversar com a jovem e seus pais sobre o sentido espiritual do culto.'),
        P('Acordar la participación de los padres (palabras, oración, entrega de una Biblia).', 'Combinar a participação dos pais (palavras, oração, entrega de uma Bíblia).'),
        P('Elegir himnos y, si se desea, una alabanza especial de la joven o de amigos.', 'Escolher hinos e, se desejar, um louvor especial da jovem ou de amigos.'),
        P('Definir horarios para que el culto no se confunda con la recepción posterior.', 'Definir horários para que o culto não se confunda com a recepção posterior.'),
    ],
    'ordem': [
        passo('Entrada de la joven', 'Entrada da jovem', 'La joven entra acompañada de sus padres mientras se canta un himno.', 'A jovem entra acompanhada dos pais enquanto se canta um hino.'),
        passo('Palabras de apertura', 'Palavras de abertura', 'El ministro explica que es un culto de gratitud a Dios por una vida.', 'O ministro explica que é um culto de gratidão a Deus por uma vida.'),
        passo('Oración y alabanza', 'Oração e louvor', 'Oración de gratitud y uno o dos himnos congregacionales.', 'Oração de gratidão e um ou dois hinos congregacionais.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee el Salmo 139:13-16 o Eclesiastés 12:1.', 'Lê-se o Salmo 139:13-16 ou Eclesiastes 12:1.'),
        passo('Palabras de los padres', 'Palavras dos pais', 'Los padres expresan su gratitud y bendición en pocas palabras.', 'Os pais expressam sua gratidão e bênção em poucas palavras.'),
        passo('Mensaje breve', 'Mensagem breve', 'Mensaje sobre una juventud que honra a Dios.', 'Mensagem sobre uma juventude que honra a Deus.'),
        passo('Entrega de la Biblia', 'Entrega da Bíblia', 'Los padres o el pastor entregan una Biblia como símbolo del camino a seguir.', 'Os pais ou o pastor entregam uma Bíblia como símbolo do caminho a seguir.'),
        passo('Oración de consagración y bendición', 'Oração de consagração e bênção', 'El ministro ora por la joven y despide a la congregación.', 'O ministro ora pela jovem e despede a congregação.'),
    ],
    'textos': ['18.139.13-16', '20.12.1', '53.4.12', '19.31.30', '23.29.11', '18.119.9', '18.103.2'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Queridos hermanos, nos reunimos para dar gracias a Dios por la vida de (nombre), que hoy cumple quince años. Este no es un momento de vanidad, sino de gratitud: cada año de su vida es un regalo del Señor, que la formó desde el vientre de su madre. Hoy también la presentamos delante de Dios para que su juventud sea dedicada a él.',
             'Queridos irmãos, estamos reunidos para dar graças a Deus pela vida de (nome), que hoje completa quinze anos. Este não é um momento de vaidade, mas de gratidão: cada ano de sua vida é um presente do Senhor, que a formou desde o ventre de sua mãe. Hoje também a apresentamos diante de Deus para que sua juventude seja dedicada a ele.'),
        fala('Entrega de la Biblia', 'Entrega da Bíblia',
             '(Nombre), en nombre de sus padres y de esta iglesia, le entregamos esta Biblia. Que ella sea la lámpara de sus pasos en cada decisión: en sus estudios, en sus amistades, en su servicio a Dios y en el futuro que el Señor le prepara. Recuerde siempre que la verdadera belleza es la de una mujer que teme al Señor.',
             '(Nome), em nome dos seus pais e desta igreja, entregamos a você esta Bíblia. Que ela seja a lâmpada dos seus passos em cada decisão: nos estudos, nas amizades, no seu serviço a Deus e no futuro que o Senhor prepara para você. Lembre-se sempre de que a verdadeira beleza é a de uma mulher que teme ao Senhor.'),
        fala('Oración de consagración', 'Oração de consagração',
             'Padre, gracias por la vida de (nombre) y por estos quince años de tu cuidado. Hoy la ponemos en tus manos. Guarda su corazón, su mente y su cuerpo; dale sabiduría para escoger bien y valor para ser ejemplo en palabra, conducta, amor, fe y pureza. Bendice a sus padres y a su familia. Que toda su vida sea para tu gloria. En el nombre de Jesús, amén.',
             'Pai, obrigado pela vida de (nome) e por estes quinze anos do teu cuidado. Hoje a colocamos em tuas mãos. Guarda o seu coração, a sua mente e o seu corpo; dá-lhe sabedoria para escolher bem e coragem para ser exemplo na palavra, no comportamento, no amor, na fé e na pureza. Abençoa seus pais e sua família. Que toda a sua vida seja para a tua glória. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Es un culto de acción de gracias, no una fiesta mundana: oriente a la familia para que la música, la ropa y los bailes no contradigan el testimonio cristiano.',
          'É um culto de ação de graças, não uma festa mundana: oriente a família para que a música, as roupas e as danças não contradigam o testemunho cristão.'),
        P('Cuide de no exaltar la apariencia de la joven; destaque su vida y su relación con Dios.', 'Cuide para não exaltar a aparência da jovem; destaque sua vida e seu relacionamento com Deus.'),
        P('Si la familia no es creyente, aproveche la ocasión para presentar el evangelio con amor y sin presión.', 'Se a família não é crente, aproveite a ocasião para apresentar o evangelho com amor e sem pressão.'),
        P('El mismo modelo puede usarse para un joven varón, ajustando el lenguaje.', 'O mesmo modelo pode ser usado para um rapaz, ajustando a linguagem.'),
    ],
})

# ---------------------------------------------------------------- funeral
C.append({
    'k': 'funeral', 'cat': 'fun',
    'n': P('Culto fúnebre', 'Culto fúnebre'),
    'd': P('Consolar a la familia y a los amigos ante la muerte de un ser querido, honrar su memoria y anunciar la esperanza de la resurrección en Cristo.',
           'Consolar a família e os amigos diante da morte de um ente querido, honrar sua memória e anunciar a esperança da ressurreição em Cristo.'),
    'prep': [
        P('Visitar o llamar a la familia lo antes posible para orar y escuchar.', 'Visitar ou ligar para a família o quanto antes para orar e ouvir.'),
        P('Confirmar el nombre completo del fallecido, fechas y datos que la familia quiera mencionar.', 'Confirmar o nome completo do falecido, datas e dados que a família queira mencionar.'),
        P('Acordar con la familia y la funeraria el lugar, el horario y la duración.', 'Combinar com a família e a funerária o local, o horário e a duração.'),
        P('Elegir himnos de consuelo y esperanza conocidos por la familia.', 'Escolher hinos de consolo e esperança conhecidos pela família.'),
        P('Definir si habrá palabras de un familiar y por cuánto tiempo.', 'Definir se haverá palavras de um familiar e por quanto tempo.'),
    ],
    'ordem': [
        passo('Himno de apertura', 'Hino de abertura', 'Un himno sereno de consuelo mientras la familia se ubica.', 'Um hino sereno de consolo enquanto a família se acomoda.'),
        passo('Palabras de apertura', 'Palavras de abertura', 'El ministro saluda con respeto y explica el propósito del culto.', 'O ministro saúda com respeito e explica o propósito do culto.'),
        passo('Oración', 'Oração', 'Oración pidiendo consuelo para la familia.', 'Oração pedindo consolo para a família.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee el Salmo 23, Juan 14:1-3 o Juan 11:25-26.', 'Lê-se o Salmo 23, João 14:1-3 ou João 11:25-26.'),
        passo('Recuerdo de la vida', 'Lembrança da vida', 'Breves palabras sobre la vida del fallecido, preparadas con la familia.', 'Breves palavras sobre a vida do falecido, preparadas com a família.'),
        passo('Himno', 'Hino', 'Un himno de esperanza en la vida eterna.', 'Um hino de esperança na vida eterna.'),
        passo('Mensaje de consuelo', 'Mensagem de consolo', 'Mensaje corto centrado en Cristo, la resurrección y la esperanza del evangelio.', 'Mensagem curta centrada em Cristo, na ressurreição e na esperança do evangelho.'),
        passo('Oración final', 'Oração final', 'Oración por la familia y bendición, antes de salir hacia el sepelio.', 'Oração pela família e bênção, antes de sair para o sepultamento.'),
    ],
    'textos': ['42.11.25-26', '42.14.1-3', '51.4.13-18', '18.23.1-6', '65.21.4', '46.5.1', '18.90.12', '45.15.54-57'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Querida familia, hermanos y amigos: nos reunimos con el corazón entristecido por la partida de (nombre). No estamos aquí para negar el dolor, porque Jesús también lloró ante la tumba de su amigo. Estamos aquí para recordar una vida, para acompañar a esta familia y para escuchar la Palabra de Dios, que nos da consuelo y esperanza en la hora más difícil.',
             'Querida família, irmãos e amigos: estamos reunidos com o coração entristecido pela partida de (nome). Não estamos aqui para negar a dor, porque Jesus também chorou diante do túmulo do seu amigo. Estamos aqui para lembrar uma vida, para acompanhar esta família e para ouvir a Palavra de Deus, que nos dá consolo e esperança na hora mais difícil.'),
        fala('Palabras de consuelo', 'Palavras de consolo',
             'Jesús dijo: Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá. Esta promesa no depende de nuestras fuerzas, sino del Señor que venció la muerte. La Biblia no nos pide que no lloremos, sino que no nos entristezcamos como los que no tienen esperanza. Dios está cerca de los quebrantados de corazón, y hoy quiere sostener a esta familia con su paz.',
             'Jesus disse: Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá. Esta promessa não depende das nossas forças, mas do Senhor que venceu a morte. A Bíblia não nos pede que não choremos, mas que não nos entristeçamos como os que não têm esperança. Deus está perto dos que têm o coração partido, e hoje quer sustentar esta família com a sua paz.'),
        fala('Oración por la familia', 'Oração pela família',
             'Padre de misericordias y Dios de toda consolación, ponemos delante de ti a esta familia. Tú conoces cada lágrima y cada recuerdo. Dales fuerzas para estos días, consuelo en las noches y personas que les acompañen con amor. Gracias por la vida que nos permitiste compartir con (nombre). Que la esperanza en Cristo sostenga a cada uno. En el nombre de Jesús, amén.',
             'Pai das misericórdias e Deus de toda consolação, colocamos diante de ti esta família. Tu conheces cada lágrima e cada lembrança. Dá-lhes forças para estes dias, consolo nas noites e pessoas que os acompanhem com amor. Obrigado pela vida que nos permitiste compartilhar com (nome). Que a esperança em Cristo sustente cada um. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('No especule sobre la salvación del fallecido ni use el culto para juzgar su vida; concéntrese en el consuelo y en la esperanza del evangelio.',
          'Não especule sobre a salvação do falecido nem use o culto para julgar sua vida; concentre-se no consolo e na esperança do evangelho.'),
        P('Sea breve y sensible: la familia está cansada y emocionalmente frágil.', 'Seja breve e sensível: a família está cansada e emocionalmente fragilizada.'),
        P('Confirme con la familia los datos que se mencionarán; no improvise anécdotas.', 'Confirme com a família os dados que serão mencionados; não improvise histórias.'),
        P('Respete los trámites y horarios fijados por la funeraria y las autoridades locales.', 'Respeite os trâmites e horários definidos pela funerária e pelas autoridades locais.'),
    ],
})

# ---------------------------------------------------------------- consolo
C.append({
    'k': 'consolo', 'cat': 'fun',
    'n': P('Visita y consuelo a la familia enlutada', 'Visita e consolo à família enlutada'),
    'd': P('Acompañar pastoralmente a la familia en los días posteriores a la pérdida, con presencia, escucha, la Palabra y oración.',
           'Acompanhar pastoralmente a família nos dias seguintes à perda, com presença, escuta, a Palavra e oração.'),
    'prep': [
        P('Avisar antes de la visita y preguntar el mejor horario.', 'Avisar antes da visita e perguntar o melhor horário.'),
        P('Ir acompañado de otro hermano o de su esposa, si es posible.', 'Ir acompanhado de outro irmão ou da sua esposa, se possível.'),
        P('Llevar uno o dos textos bíblicos breves ya marcados.', 'Levar um ou dois textos bíblicos breves já marcados.'),
        P('Averiguar si la familia tiene necesidades prácticas (comida, trámites, transporte).', 'Verificar se a família tem necessidades práticas (comida, trâmites, transporte).'),
    ],
    'ordem': [
        passo('Saludo', 'Saudação', 'Saludo sencillo y respetuoso; exprese su pesar sin frases hechas.', 'Saudação simples e respeitosa; expresse seus sentimentos sem frases feitas.'),
        passo('Escucha', 'Escuta', 'Permita que la familia hable de la persona y de lo ocurrido; escuche más de lo que habla.', 'Permita que a família fale da pessoa e do que aconteceu; ouça mais do que fala.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Lea un texto breve, como el Salmo 34:18 o 2 Corintios 1:3-4.', 'Leia um texto breve, como o Salmo 34:18 ou 2 Coríntios 1:3-4.'),
        passo('Palabra de consuelo', 'Palavra de consolo', 'Unas pocas palabras sobre la cercanía de Dios en el dolor.', 'Poucas palavras sobre a proximidade de Deus na dor.'),
        passo('Oración', 'Oração', 'Ore por cada miembro de la familia, si es posible por nombre.', 'Ore por cada membro da família, se possível pelo nome.'),
        passo('Ofrecimiento de ayuda', 'Oferta de ajuda', 'Pregunte qué necesitan y combine cómo la iglesia puede ayudar.', 'Pergunte do que precisam e combine como a igreja pode ajudar.'),
        passo('Despedida y seguimiento', 'Despedida e acompanhamento', 'Despídase sin prisa y fije una nueva visita o llamada.', 'Despeça-se sem pressa e marque uma nova visita ou ligação.'),
    ],
    'textos': ['39.5.4', '46.1.3-4', '18.34.18', '22.41.10', '44.12.15', '18.46.1', '42.11.35'],
    'falas': [
        fala('Palabra de consuelo', 'Palavra de consolo',
             'Hermanos, no tengo palabras que quiten este dolor, pero quiero recordarles lo que dice la Palabra: el Señor está cerca de los quebrantados de corazón. Jesús lloró junto a la familia de Lázaro; él entiende lo que ustedes sienten. No necesitan ser fuertes delante de nosotros. Estamos aquí para llorar con ustedes y para recordarles que Dios no les ha abandonado.',
             'Irmãos, não tenho palavras que tirem esta dor, mas quero lembrar o que diz a Palavra: o Senhor está perto dos que têm o coração partido. Jesus chorou junto à família de Lázaro; ele entende o que vocês sentem. Vocês não precisam ser fortes diante de nós. Estamos aqui para chorar com vocês e para lembrar que Deus não os abandonou.'),
        fala('Oración en el hogar', 'Oração no lar',
             'Señor, Dios de toda consolación, entra en este hogar con tu paz. Tú conoces el vacío que hoy sienten. Consuela a (nombres), fortalece sus cuerpos cansados y guarda sus mentes en los días que vienen. Dales descanso por la noche y fuerzas para cada mañana. Que sientan tu presencia y el amor de la iglesia. En el nombre de Jesús, amén.',
             'Senhor, Deus de toda consolação, entra neste lar com a tua paz. Tu conheces o vazio que hoje sentem. Consola (nomes), fortalece seus corpos cansados e guarda suas mentes nos dias que virão. Dá-lhes descanso à noite e forças para cada manhã. Que sintam a tua presença e o amor da igreja. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Evite frases como "Dios lo quiso así" o "ya no llore"; respete el tiempo del duelo.', 'Evite frases como "Deus quis assim" ou "não chore mais"; respeite o tempo do luto.'),
        P('No especule sobre la salvación del fallecido ni sobre las causas de la muerte.', 'Não especule sobre a salvação do falecido nem sobre as causas da morte.'),
        P('Haga visitas cortas; el duelo continúa por meses, y el seguimiento vale más que una sola visita larga.', 'Faça visitas curtas; o luto continua por meses, e o acompanhamento vale mais do que uma única visita longa.'),
        P('Si percibe señales de depresión profunda o riesgo, oriente a buscar ayuda profesional además del apoyo pastoral.', 'Se perceber sinais de depressão profunda ou risco, oriente a buscar ajuda profissional além do apoio pastoral.'),
    ],
})

# ---------------------------------------------------------------- sepultamento
C.append({
    'k': 'sepult', 'cat': 'fun',
    'n': P('Palabras en el sepelio', 'Palavras no sepultamento'),
    'd': P('Dirigir un momento breve junto a la sepultura, entregando el cuerpo a la tierra y afirmando la esperanza de la resurrección.',
           'Conduzir um momento breve junto à sepultura, entregando o corpo à terra e afirmando a esperança da ressurreição.'),
    'prep': [
        P('Confirmar con la funeraria el horario y el lugar exacto del sepelio.', 'Confirmar com a funerária o horário e o local exato do sepultamento.'),
        P('Preparar palabras breves: al aire libre la atención es menor.', 'Preparar palavras breves: ao ar livre a atenção é menor.'),
        P('Acordar si se cantará un himno y quién lo dirigirá.', 'Combinar se haverá um hino e quem o conduzirá.'),
    ],
    'ordem': [
        passo('Reunión junto a la sepultura', 'Reunião junto à sepultura', 'La familia se ubica cerca; el ministro espera a que todos estén presentes.', 'A família se posiciona perto; o ministro espera que todos estejam presentes.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee 1 Corintios 15:42-44 o Job 19:25-27.', 'Lê-se 1 Coríntios 15:42-44 ou Jó 19:25-27.'),
        passo('Palabras breves', 'Palavras breves', 'Unas pocas frases sobre la esperanza de la resurrección.', 'Algumas poucas frases sobre a esperança da ressurreição.'),
        passo('Palabras de entrega', 'Palavras de entrega', 'Mientras se baja el ataúd, el ministro pronuncia las palabras de entrega.', 'Enquanto o caixão desce, o ministro pronuncia as palavras de entrega.'),
        passo('Himno', 'Hino', 'Un himno conocido de esperanza, si la familia lo desea.', 'Um hino conhecido de esperança, se a família desejar.'),
        passo('Oración y bendición', 'Oração e bênção', 'Oración final por la familia y bendición.', 'Oração final pela família e bênção.'),
    ],
    'textos': ['45.15.42-44', '17.19.25-27', '49.3.20-21', '20.12.7', '45.15.51-52', '51.4.13-18', '42.11.25-26'],
    'falas': [
        fala('Palabras de entrega', 'Palavras de entrega',
             'Ya que agradó a Dios, en su soberanía, permitir que (nombre) partiera de esta vida, entregamos su cuerpo a la tierra: el polvo vuelve a la tierra como era, y el espíritu vuelve a Dios que lo dio. Lo hacemos con dolor, pero mirando a Cristo, que murió y resucitó, y que transformará el cuerpo de nuestra humillación para que sea semejante a su cuerpo glorioso.',
             'Visto que agradou a Deus, em sua soberania, permitir que (nome) partisse desta vida, entregamos o seu corpo à terra: o pó volta à terra como era, e o espírito volta a Deus que o deu. Fazemos isso com dor, mas olhando para Cristo, que morreu e ressuscitou, e que transformará o nosso corpo de humilhação para que seja semelhante ao seu corpo glorioso.'),
        fala('Afirmación de esperanza', 'Afirmação de esperança',
             'Se siembra en corrupción, se levantará en incorrupción; se siembra en debilidad, se levantará en poder. Esta tumba no tiene la última palabra. El Señor Jesús venció la muerte, y un día la muerte será sorbida en victoria. Por eso, aun en medio de las lágrimas, podemos decir: gracias a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo.',
             'Semeia-se em corrupção, ressuscitará em incorrupção; semeia-se em fraqueza, ressuscitará em poder. Este túmulo não tem a última palavra. O Senhor Jesus venceu a morte, e um dia a morte será tragada pela vitória. Por isso, mesmo em meio às lágrimas, podemos dizer: graças a Deus, que nos dá a vitória por meio de nosso Senhor Jesus Cristo.'),
        fala('Bendición final', 'Bênção final',
             'Que el Señor les bendiga y les guarde; que el Señor haga resplandecer su rostro sobre ustedes y tenga de ustedes misericordia; que el Señor alce sobre ustedes su rostro y les dé paz. Vayan en paz, y que el Dios de toda consolación acompañe a esta familia en cada día que viene. Amén.',
             'Que o Senhor os abençoe e os guarde; que o Senhor faça resplandecer o seu rosto sobre vocês e tenha misericórdia de vocês; que o Senhor levante sobre vocês o seu rosto e lhes dê a paz. Vão em paz, e que o Deus de toda consolação acompanhe esta família em cada dia que vem. Amém.'),
    ],
    'obs': [
        P('No especule sobre la salvación del fallecido; las palabras de entrega hablan de la esperanza que Dios ofrece, no de un juicio humano.',
          'Não especule sobre a salvação do falecido; as palavras de entrega falam da esperança que Deus oferece, não de um juízo humano.'),
        P('Sea muy breve: de 5 a 10 minutos suelen bastar junto a la sepultura.', 'Seja muito breve: de 5 a 10 minutos costumam bastar junto à sepultura.'),
        P('Respete las normas del cementerio y las indicaciones del personal.', 'Respeite as normas do cemitério e as orientações dos funcionários.'),
    ],
})

# ---------------------------------------------------------------- batismo
C.append({
    'k': 'batismo', 'cat': 'igreja',
    'n': P('Bautismo en las aguas', 'Batismo nas águas'),
    'd': P('Bautizar por inmersión a quienes creyeron en Jesucristo como Señor y Salvador, en obediencia a su mandamiento y como testimonio público de su fe.',
           'Batizar por imersão aqueles que creram em Jesus Cristo como Senhor e Salvador, em obediência ao seu mandamento e como testemunho público da sua fé.'),
    'prep': [
        P('Concluir las clases para bautismo y entrevistar a cada candidato.', 'Concluir as aulas para batismo e entrevistar cada candidato.'),
        P('Hacer la lista con nombres completos y datos para el registro de la iglesia.', 'Fazer a lista com nomes completos e dados para o registro da igreja.'),
        P('Preparar el bautisterio o el lugar con agua, verificando la seguridad.', 'Preparar o batistério ou o local com água, verificando a segurança.'),
        P('Orientar sobre la ropa adecuada, toallas y lugar para cambiarse.', 'Orientar sobre roupas adequadas, toalhas e local para trocar de roupa.'),
        P('Designar ayudantes dentro y fuera del agua.', 'Designar auxiliares dentro e fora da água.'),
    ],
    'ordem': [
        passo('Himno y oración', 'Hino e oração', 'La iglesia canta y el ministro ora por los candidatos.', 'A igreja canta e o ministro ora pelos candidatos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Mateo 28:18-20 o Romanos 6:3-4.', 'Lê-se Mateus 28:18-20 ou Romanos 6:3-4.'),
        passo('Mensaje breve', 'Mensagem breve', 'Explicación del significado del bautismo: identificación con la muerte y resurrección de Cristo.', 'Explicação do significado do batismo: identificação com a morte e ressurreição de Cristo.'),
        passo('Presentación de los candidatos', 'Apresentação dos candidatos', 'Se lee el nombre de cada candidato ante la iglesia.', 'Lê-se o nome de cada candidato diante da igreja.'),
        passo('Preguntas de fe', 'Perguntas de fé', 'Cada candidato confiesa públicamente su fe respondiendo a las preguntas.', 'Cada candidato confessa publicamente sua fé respondendo às perguntas.'),
        passo('Bautismo', 'Batismo', 'El ministro bautiza a cada candidato por inmersión, pronunciando la fórmula bíblica.', 'O ministro batiza cada candidato por imersão, pronunciando a fórmula bíblica.'),
        passo('Oración por los bautizados', 'Oração pelos batizados', 'Se ora por los nuevos bautizados, pidiendo que sean llenos del Espíritu Santo.', 'Ora-se pelos novos batizados, pedindo que sejam cheios do Espírito Santo.'),
        passo('Bienvenida y bendición', 'Boas-vindas e bênção', 'La iglesia recibe a los bautizados con alegría y se despide con la bendición.', 'A igreja recebe os batizados com alegria e encerra com a bênção.'),
    ],
    'textos': ['39.28.18-20', '40.16.15-16', '43.2.38-41', '44.6.3-4', '50.2.12', '47.3.27'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amados hermanos, hoy es un día de fiesta en el cielo y en la iglesia. El Señor Jesús mandó hacer discípulos y bautizarlos en el nombre del Padre, del Hijo y del Espíritu Santo. El bautismo no salva por sí mismo, sino que es la señal pública de una fe que ya fue recibida: quien desciende a las aguas declara que murió al pecado y que ahora vive para Cristo.',
             'Amados irmãos, hoje é dia de festa no céu e na igreja. O Senhor Jesus mandou fazer discípulos e batizá-los em nome do Pai, do Filho e do Espírito Santo. O batismo não salva por si mesmo, mas é o sinal público de uma fé que já foi recebida: quem desce às águas declara que morreu para o pecado e que agora vive para Cristo.'),
        fala('Preguntas al candidato', 'Perguntas ao candidato',
             '¿Cree usted que Jesucristo es el Hijo de Dios, que murió por sus pecados y resucitó al tercer día? (Sí, creo.) ¿Le ha recibido como su Señor y Salvador? (Sí.) ¿Promete, con la ayuda de Dios, vivir conforme a su Palabra y perseverar en la comunión de la iglesia? (Sí, prometo.)',
             'Você crê que Jesus Cristo é o Filho de Deus, que morreu pelos seus pecados e ressuscitou ao terceiro dia? (Sim, creio.) Você o recebeu como seu Senhor e Salvador? (Sim.) Você promete, com a ajuda de Deus, viver de acordo com a sua Palavra e perseverar na comunhão da igreja? (Sim, prometo.)'),
        fala('Fórmula del bautismo', 'Fórmula do batismo',
             '(Nombre completo), por su confesión de fe en el Señor Jesucristo, y en obediencia a su mandamiento, yo le bautizo en el nombre del Padre, y del Hijo, y del Espíritu Santo. (Se sumerge al candidato.) Sepultado con Cristo en el bautismo, levántese para andar en vida nueva. Amén.',
             '(Nome completo), pela sua confissão de fé no Senhor Jesus Cristo, e em obediência ao seu mandamento, eu o batizo em nome do Pai, e do Filho, e do Espírito Santo. (Imerge-se o candidato.) Sepultado com Cristo no batismo, levante-se para andar em novidade de vida. Amém.'),
        fala('Oración por los bautizados', 'Oração pelos batizados',
             'Señor Jesús, gracias por estas vidas que hoy obedecieron tu Palabra. Guárdales en tu camino, aliméntales con tu Palabra y llénales de tu Espíritu Santo, como prometiste a todos los que creen. Que sean fieles hasta el fin y testigos tuyos en su casa, en su trabajo y en su ciudad. En tu nombre oramos, amén.',
             'Senhor Jesus, obrigado por estas vidas que hoje obedeceram à tua Palavra. Guarda-as no teu caminho, alimenta-as com a tua Palavra e enche-as do teu Espírito Santo, como prometeste a todos os que creem. Que sejam fiéis até o fim e tuas testemunhas em sua casa, em seu trabalho e em sua cidade. Em teu nome oramos, amém.'),
    ],
    'obs': [
        P('Siga las normas de su iglesia o denominación sobre requisitos, edad mínima y quién puede bautizar.', 'Siga as normas da sua igreja ou denominação sobre requisitos, idade mínima e quem pode batizar.'),
        P('Cuide la seguridad: profundidad del agua, piso antideslizante, personas mayores o con problemas de salud.', 'Cuide da segurança: profundidade da água, piso antiderrapante, idosos ou pessoas com problemas de saúde.'),
        P('Si el bautismo es en río o lugar público, verifique condiciones, permisos y corriente del agua.', 'Se o batismo for em rio ou local público, verifique condições, autorizações e correnteza.'),
        P('Registre cada bautismo en el libro de la iglesia con fecha y ministro oficiante.', 'Registre cada batismo no livro da igreja com data e ministro oficiante.'),
    ],
})

# ---------------------------------------------------------------- ceia
C.append({
    'k': 'ceia', 'cat': 'igreja',
    'n': P('Santa Cena', 'Santa Ceia'),
    'd': P('Celebrar la Cena del Señor en memoria de su muerte, anunciando su sacrificio hasta que él venga y fortaleciendo la comunión de la iglesia.',
           'Celebrar a Ceia do Senhor em memória de sua morte, anunciando o seu sacrifício até que ele venha e fortalecendo a comunhão da igreja.'),
    'prep': [
        P('Preparar el pan y el jugo de uva (o lo que use su iglesia) con limpieza y anticipación.', 'Preparar o pão e o suco de uva (ou o que sua igreja usa) com limpeza e antecedência.'),
        P('Designar a los diáconos o ayudantes que servirán y ensayar el recorrido.', 'Designar os diáconos ou auxiliares que servirão e ensaiar o percurso.'),
        P('Cubrir la mesa con un mantel y disponer los elementos con orden.', 'Cobrir a mesa com uma toalha e dispor os elementos com ordem.'),
        P('Prever cómo servir a enfermos o personas con movilidad reducida.', 'Prever como servir enfermos ou pessoas com mobilidade reduzida.'),
    ],
    'ordem': [
        passo('Himno', 'Hino', 'Un himno sobre la cruz o la sangre de Cristo.', 'Um hino sobre a cruz ou o sangue de Cristo.'),
        passo('Lectura y exhortación', 'Leitura e exortação', 'Se lee 1 Corintios 11:23-29 y se exhorta al autoexamen.', 'Lê-se 1 Coríntios 11:23-29 e exorta-se ao autoexame.'),
        passo('Momento de examen', 'Momento de exame', 'Silencio y oración personal de confesión.', 'Silêncio e oração pessoal de confissão.'),
        passo('Oración por el pan', 'Oração pelo pão', 'El ministro da gracias por el pan.', 'O ministro dá graças pelo pão.'),
        passo('Distribución del pan', 'Distribuição do pão', 'Los diáconos sirven; se come junto tras las palabras de institución.', 'Os diáconos servem; come-se junto após as palavras da instituição.'),
        passo('Oración por la copa', 'Oração pelo cálice', 'El ministro da gracias por la copa.', 'O ministro dá graças pelo cálice.'),
        passo('Distribución de la copa', 'Distribuição do cálice', 'Se sirve y se bebe junto tras las palabras de institución.', 'Serve-se e bebe-se junto após as palavras da instituição.'),
        passo('Himno y bendición', 'Hino e bênção', 'Se canta un himno de gratitud y se despide a la iglesia.', 'Canta-se um hino de gratidão e despede-se a igreja.'),
    ],
    'textos': ['45.11.23-29', '41.22.19-20', '39.26.26-29', '45.10.16-17', '42.6.35'],
    'falas': [
        fala('Exhortación al examen', 'Exortação ao exame',
             'Hermanos, la Palabra nos dice: pruébese cada uno a sí mismo, y así coma del pan y beba de la copa. Esta mesa no es para los que se creen perfectos, sino para los que fueron lavados por la sangre de Cristo y desean andar en santidad. Tomemos un momento de silencio para examinar el corazón, confesar nuestras faltas al Señor y perdonar a quien nos haya ofendido.',
             'Irmãos, a Palavra nos diz: examine-se cada um a si mesmo, e assim coma do pão e beba do cálice. Esta mesa não é para os que se acham perfeitos, mas para os que foram lavados pelo sangue de Cristo e desejam andar em santidade. Tomemos um momento de silêncio para examinar o coração, confessar nossas faltas ao Senhor e perdoar quem nos tenha ofendido.'),
        fala('Palabras de institución: el pan', 'Palavras da instituição: o pão',
             'El apóstol Pablo nos enseña: el Señor Jesús, la noche que fue entregado, tomó pan; y habiendo dado gracias, lo partió y dijo: Tomad, comed; esto es mi cuerpo que por vosotros es partido; haced esto en memoria de mí. (Después de orar:) Comamos todos juntos, en memoria de él.',
             'O apóstolo Paulo nos ensina: o Senhor Jesus, na noite em que foi traído, tomou o pão; e, tendo dado graças, o partiu e disse: Tomai, comei; isto é o meu corpo que é partido por vós; fazei isto em memória de mim. (Depois de orar:) Comamos todos juntos, em memória dele.'),
        fala('Palabras de institución: la copa', 'Palavras da instituição: o cálice',
             'Asimismo tomó también la copa, después de haber cenado, diciendo: Esta copa es el nuevo pacto en mi sangre; haced esto todas las veces que bebiereis, en memoria de mí. Porque todas las veces que comiereis este pan y bebiereis esta copa, la muerte del Señor anunciáis hasta que venga. (Después de orar:) Bebamos todos juntos.',
             'Da mesma forma tomou também o cálice, depois de cear, dizendo: Este cálice é a nova aliança no meu sangue; fazei isto todas as vezes que beberdes, em memória de mim. Porque todas as vezes que comerdes este pão e beberdes este cálice, anunciais a morte do Senhor até que ele venha. (Depois de orar:) Bebamos todos juntos.'),
        fala('Oración de gratitud', 'Oração de gratidão',
             'Señor Jesús, gracias porque tu cuerpo fue entregado y tu sangre derramada por nosotros. Gracias por el perdón, por la nueva vida y por la esperanza de tu venida. Que esta comunión nos una más a ti y a nuestros hermanos, y que vivamos de manera digna de tu sacrificio hasta el día en que celebremos contigo en tu reino. Amén.',
             'Senhor Jesus, obrigado porque o teu corpo foi entregue e o teu sangue derramado por nós. Obrigado pelo perdão, pela nova vida e pela esperança da tua vinda. Que esta comunhão nos una mais a ti e aos nossos irmãos, e que vivamos de modo digno do teu sacrifício até o dia em que celebrarmos contigo no teu reino. Amém.'),
    ],
    'obs': [
        P('Siga las normas de su iglesia o denominación sobre quién participa, quién oficia y la frecuencia de la Cena.', 'Siga as normas da sua igreja ou denominação sobre quem participa, quem oficia e a frequência da Ceia.'),
        P('Trate los elementos con reverencia, pero sin superstición; lo que sobre se dispone con respeto.', 'Trate os elementos com reverência, mas sem superstição; o que sobrar seja descartado com respeito.'),
        P('Explique a visitantes y niños, con amabilidad, cómo se procede en su iglesia.', 'Explique a visitantes e crianças, com gentileza, como se procede na sua igreja.'),
    ],
})

# ---------------------------------------------------------------- apresentação
C.append({
    'k': 'apres', 'cat': 'fam',
    'n': P('Presentación de niños', 'Apresentação de crianças'),
    'd': P('Presentar un niño al Señor delante de la iglesia, dar gracias por su vida y comprometer a los padres a criarlo en los caminos de Dios.',
           'Apresentar uma criança ao Senhor diante da igreja, dar graças por sua vida e comprometer os pais a criá-la nos caminhos de Deus.'),
    'prep': [
        P('Conversar con los padres sobre el sentido de la presentación (no es bautismo).', 'Conversar com os pais sobre o sentido da apresentação (não é batismo).'),
        P('Anotar el nombre completo del niño, de los padres y la fecha de nacimiento.', 'Anotar o nome completo da criança, dos pais e a data de nascimento.'),
        P('Preparar un certificado de presentación, si la iglesia lo usa.', 'Preparar um certificado de apresentação, se a igreja usa.'),
        P('Definir el momento del culto para que el niño no espere demasiado.', 'Definir o momento do culto para que a criança não espere demais.'),
    ],
    'ordem': [
        passo('Llamado de la familia', 'Chamada da família', 'Los padres pasan al frente con el niño.', 'Os pais vêm à frente com a criança.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Marcos 10:13-16 o 1 Samuel 1:27-28.', 'Lê-se Marcos 10:13-16 ou 1 Samuel 1:27-28.'),
        passo('Palabras breves', 'Palavras breves', 'Explicación del propósito de la presentación.', 'Explicação do propósito da apresentação.'),
        passo('Compromiso de los padres', 'Compromisso dos pais', 'Los padres responden a las preguntas de compromiso.', 'Os pais respondem às perguntas de compromisso.'),
        passo('Compromiso de la iglesia', 'Compromisso da igreja', 'La iglesia se compromete a orar y ser ejemplo.', 'A igreja se compromete a orar e ser exemplo.'),
        passo('Oración y bendición', 'Oração e bênção', 'El ministro toma al niño en brazos, si los padres lo permiten, y ora.', 'O ministro toma a criança nos braços, se os pais permitirem, e ora.'),
        passo('Entrega del certificado', 'Entrega do certificado', 'Se entrega el certificado y la iglesia celebra con un himno.', 'Entrega-se o certificado e a igreja celebra com um hino.'),
    ],
    'textos': ['40.10.13-16', '39.19.13-14', '8.1.27-28', '18.127.3', '4.6.6-7', '19.22.6', '3.6.24-26'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Amados, la Biblia dice que los hijos son herencia del Señor. Jesús tomó a los niños en sus brazos, puso las manos sobre ellos y los bendijo. Hoy (nombres de los padres) presentan a (nombre del niño) delante de Dios y de esta iglesia, para dar gracias por su vida y para asumir el compromiso de criarle en el temor del Señor.',
             'Amados, a Bíblia diz que os filhos são herança do Senhor. Jesus tomou as crianças nos braços, impôs as mãos sobre elas e as abençoou. Hoje (nomes dos pais) apresentam (nome da criança) diante de Deus e desta igreja, para dar graças por sua vida e para assumir o compromisso de criá-la no temor do Senhor.'),
        fala('Compromiso de los padres', 'Compromisso dos pais',
             '¿Reciben ustedes a este niño como un regalo de Dios? (Sí.) ¿Se comprometen, con la ayuda del Señor, a enseñarle la Palabra de Dios, a orar por él y con él, a llevarle a la casa de Dios y a ser ejemplo de vida cristiana en el hogar? (Sí, nos comprometemos.)',
             'Vocês recebem esta criança como um presente de Deus? (Sim.) Vocês se comprometem, com a ajuda do Senhor, a ensinar-lhe a Palavra de Deus, a orar por ela e com ela, a levá-la à casa de Deus e a ser exemplo de vida cristã no lar? (Sim, nos comprometemos.)'),
        fala('Oración y bendición', 'Oração e bênção',
             'Señor Jesús, que dijiste: dejad a los niños venir a mí, te presentamos a (nombre). Gracias por su vida. Guárdale en salud, hazle crecer en sabiduría y en gracia, y que desde pequeño conozca tu amor. Da sabiduría y paciencia a sus padres. El Señor le bendiga y le guarde; haga resplandecer su rostro sobre él y le dé paz. Amén.',
             'Senhor Jesus, que disseste: deixai vir a mim as crianças, apresentamos a ti (nome). Obrigado por sua vida. Guarda-a com saúde, faze-a crescer em sabedoria e em graça, e que desde pequena conheça o teu amor. Dá sabedoria e paciência aos seus pais. O Senhor a abençoe e a guarde; faça resplandecer o seu rosto sobre ela e lhe dê a paz. Amém.'),
    ],
    'obs': [
        P('Deje claro que la presentación no es bautismo ni garantiza la salvación; es gratitud, compromiso de los padres y oración.', 'Deixe claro que a apresentação não é batismo nem garante a salvação; é gratidão, compromisso dos pais e oração.'),
        P('Pida permiso a los padres antes de tomar al niño en brazos.', 'Peça permissão aos pais antes de tomar a criança nos braços.'),
        P('Si uno de los padres no es creyente, trate la situación con respeto y sin exponerle.', 'Se um dos pais não é crente, trate a situação com respeito e sem expô-lo.'),
    ],
})

# ---------------------------------------------------------------- enfermos
C.append({
    'k': 'enfermos', 'cat': 'igreja',
    'n': P('Visita a enfermos y oración', 'Visita a enfermos e oração'),
    'd': P('Visitar al enfermo en su casa o en el hospital, llevar consuelo y la Palabra, y orar con fe por su sanidad, conforme a Santiago 5:14-15.',
           'Visitar o enfermo em casa ou no hospital, levar consolo e a Palavra, e orar com fé pela sua cura, conforme Tiago 5:14-15.'),
    'prep': [
        P('Consultar a la familia el mejor horario y si el enfermo puede recibir visitas.', 'Consultar a família sobre o melhor horário e se o enfermo pode receber visitas.'),
        P('En hospitales, informarse de las reglas de visita e higiene.', 'Em hospitais, informar-se das regras de visita e higiene.'),
        P('Llevar aceite para la unción, si es costumbre de su iglesia.', 'Levar óleo para a unção, se for costume da sua igreja.'),
        P('Preparar uno o dos textos bíblicos breves.', 'Preparar um ou dois textos bíblicos breves.'),
    ],
    'ordem': [
        passo('Saludo', 'Saudação', 'Saludo tranquilo; pregunte cómo se siente sin forzar la conversación.', 'Saudação tranquila; pergunte como se sente sem forçar a conversa.'),
        passo('Escucha', 'Escuta', 'Escuche sus temores y peticiones.', 'Ouça seus medos e pedidos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Lea un texto breve, como el Salmo 103:2-3 o Isaías 41:10.', 'Leia um texto breve, como o Salmo 103:2-3 ou Isaías 41:10.'),
        passo('Palabra de fe', 'Palavra de fé', 'Unas palabras sobre el cuidado y el poder de Dios.', 'Algumas palavras sobre o cuidado e o poder de Deus.'),
        passo('Unción y oración', 'Unção e oração', 'Con el permiso del enfermo, se unge con aceite y se ora por sanidad.', 'Com a permissão do enfermo, unge-se com óleo e ora-se pela cura.'),
        passo('Despedida', 'Despedida', 'Despedida breve, dejando una palabra de ánimo y combinando el seguimiento.', 'Despedida breve, deixando uma palavra de ânimo e combinando o acompanhamento.'),
    ],
    'textos': ['58.5.14-16', '40.16.17-18', '22.53.4-5', '18.103.2-3', '22.41.10', '39.25.36', '46.12.9', '18.91.1-2'],
    'falas': [
        fala('Palabra de fe', 'Palavra de fé',
             'Hermano (nombre), el Señor no se ha olvidado de usted. La Palabra dice que Jesús llevó nuestras enfermedades y sufrió nuestros dolores. Él tiene poder para sanar, y también tiene gracia para sostener en la debilidad. Hoy vamos a orar con fe, conforme nos enseña la Biblia, confiando en que Dios oye y obra según su voluntad perfecta.',
             'Irmão (nome), o Senhor não se esqueceu de você. A Palavra diz que Jesus tomou sobre si as nossas enfermidades e levou as nossas dores. Ele tem poder para curar, e também tem graça para sustentar na fraqueza. Hoje vamos orar com fé, como a Bíblia nos ensina, confiando que Deus ouve e age segundo a sua vontade perfeita.'),
        fala('Oración con unción', 'Oração com unção',
             '(Se unge la frente con un poco de aceite.) Señor Jesús, en tu nombre ungimos a (nombre), como enseña tu Palabra. Tú eres el que sana todas nuestras dolencias. Toca su cuerpo, quita el dolor, da sabiduría a los médicos y fuerzas a la familia. Llena su corazón de paz y de confianza en ti. Recibimos con fe tu respuesta, en el nombre de Jesús. Amén.',
             '(Unge-se a testa com um pouco de óleo.) Senhor Jesus, em teu nome ungimos (nome), como ensina a tua Palavra. Tu és o que sara todas as nossas enfermidades. Toca o seu corpo, tira a dor, dá sabedoria aos médicos e forças à família. Enche o seu coração de paz e de confiança em ti. Recebemos com fé a tua resposta, em nome de Jesus. Amém.'),
    ],
    'obs': [
        P('Nunca aconseje abandonar el tratamiento médico; la oración y la medicina no se oponen.', 'Nunca aconselhe abandonar o tratamento médico; a oração e a medicina não se opõem.'),
        P('No culpe al enfermo por falta de fe ni prometa resultados; Dios es soberano.', 'Não culpe o enfermo por falta de fé nem prometa resultados; Deus é soberano.'),
        P('Respete las normas de higiene y de visita del hospital, y el descanso del paciente.', 'Respeite as normas de higiene e de visita do hospital, e o descanso do paciente.'),
        P('Guarde la confidencialidad sobre el diagnóstico; pida permiso antes de compartirlo como motivo de oración.', 'Guarde sigilo sobre o diagnóstico; peça permissão antes de compartilhá-lo como pedido de oração.'),
    ],
})

# ---------------------------------------------------------------- consagração
C.append({
    'k': 'consag', 'cat': 'ord',
    'n': P('Consagración de obreros: diáconos, presbíteros, evangelistas', 'Consagração de obreiros: diáconos, presbíteros, evangelistas'),
    'd': P('Separar públicamente para el ministerio a hermanos aprobados por la iglesia, con oración e imposición de manos, conforme al ejemplo de Hechos 6 y 13.',
           'Separar publicamente para o ministério irmãos aprovados pela igreja, com oração e imposição de mãos, conforme o exemplo de Atos 6 e 13.'),
    'prep': [
        P('Confirmar que los candidatos fueron aprobados según el proceso de su iglesia o convención.', 'Confirmar que os candidatos foram aprovados conforme o processo da sua igreja ou convenção.'),
        P('Reunirse antes con los candidatos (y sus esposas) para orar y explicar el acto.', 'Reunir-se antes com os candidatos (e suas esposas) para orar e explicar o ato.'),
        P('Preparar los certificados o credenciales que correspondan.', 'Preparar os certificados ou credenciais correspondentes.'),
        P('Invitar a los ministros que participarán en la imposición de manos.', 'Convidar os ministros que participarão da imposição de mãos.'),
        P('Proponer un tiempo de ayuno y oración en la iglesia.', 'Propor um tempo de jejum e oração na igreja.'),
    ],
    'ordem': [
        passo('Apertura y alabanza', 'Abertura e louvor', 'Culto de adoración con himnos y oración.', 'Culto de adoração com hinos e oração.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Hechos 6:3-6 o 1 Timoteo 3.', 'Lê-se Atos 6:3-6 ou 1 Timóteo 3.'),
        passo('Mensaje', 'Mensagem', 'Mensaje sobre el llamado, el carácter y la responsabilidad del obrero.', 'Mensagem sobre o chamado, o caráter e a responsabilidade do obreiro.'),
        passo('Presentación de los candidatos', 'Apresentação dos candidatos', 'Se llama a cada candidato por nombre, con el cargo para el cual será consagrado.', 'Chama-se cada candidato pelo nome, com o cargo para o qual será consagrado.'),
        passo('Compromiso', 'Compromisso', 'Los candidatos responden públicamente a las preguntas de compromiso.', 'Os candidatos respondem publicamente às perguntas de compromisso.'),
        passo('Imposición de manos y oración', 'Imposição de mãos e oração', 'Los ministros imponen las manos y oran por cada uno.', 'Os ministros impõem as mãos e oram por cada um.'),
        passo('Declaración y entrega de credenciales', 'Declaração e entrega de credenciais', 'Se declara a los consagrados en su función y se entregan los certificados.', 'Declaram-se os consagrados em sua função e entregam-se os certificados.'),
        passo('Exhortación a la iglesia y bendición', 'Exortação à igreja e bênção', 'Se exhorta a la iglesia a recibirles y apoyarles, y se despide con la bendición.', 'Exorta-se a igreja a recebê-los e apoiá-los, e encerra-se com a bênção.'),
    ],
    'textos': ['43.6.3-6', '53.3.1-2', '53.3.8-10', '55.1.7-9', '43.13.2-3', '48.4.11-12', '53.4.14', '54.4.1-5'],
    'falas': [
        fala('Preguntas de compromiso', 'Perguntas de compromisso',
             '¿Cree usted que ha sido llamado por Dios para servir como (cargo) en su iglesia? (Sí, lo creo.) ¿Promete, con la ayuda del Señor, guardar una vida irreprensible en su hogar, en su trabajo y en la iglesia? (Sí, prometo.) ¿Promete servir con humildad, sujeto a la Palabra de Dios y a la dirección pastoral, y no por ganancia deshonesta? (Sí, prometo.)',
             'Você crê que foi chamado por Deus para servir como (cargo) em sua igreja? (Sim, creio.) Você promete, com a ajuda do Senhor, manter uma vida irrepreensível em seu lar, em seu trabalho e na igreja? (Sim, prometo.) Você promete servir com humildade, sujeito à Palavra de Deus e à liderança pastoral, e não por ganância? (Sim, prometo.)'),
        fala('Oración de consagración', 'Oração de consagração',
             '(Con imposición de manos.) Señor de la mies, te presentamos a (nombre), a quien llamaste para servir como (cargo). Así como la iglesia apartó a sus siervos con ayuno y oración, hoy le consagramos a tu obra. Llénale de tu Espíritu Santo y de sabiduría, guarda su vida y su hogar, dale un corazón humilde y fiel, y haz fructífero su ministerio para tu gloria. En el nombre de Jesús, amén.',
             '(Com imposição de mãos.) Senhor da seara, apresentamos a ti (nome), a quem chamaste para servir como (cargo). Assim como a igreja separou seus servos com jejum e oração, hoje o consagramos à tua obra. Enche-o do teu Espírito Santo e de sabedoria, guarda sua vida e seu lar, dá-lhe um coração humilde e fiel, e torna frutífero o seu ministério para a tua glória. Em nome de Jesus, amém.'),
        fala('Exhortación a la iglesia', 'Exortação à igreja',
             'Iglesia amada, estos hermanos fueron consagrados para servirles. Recíbanles con respeto, oren por ellos y por sus familias, y colaboren con su trabajo. Ellos no son perfectos; necesitan su apoyo y su oración. Y a ustedes, consagrados, les digo: cumplan su ministerio con fidelidad, sabiendo que servimos a Cristo y que de él recibiremos la recompensa.',
             'Igreja amada, estes irmãos foram consagrados para servir a vocês. Recebam-nos com respeito, orem por eles e por suas famílias, e colaborem com o seu trabalho. Eles não são perfeitos; precisam do apoio e da oração de vocês. E a vocês, consagrados, eu digo: cumpram o seu ministério com fidelidade, sabendo que servimos a Cristo e que dele receberemos a recompensa.'),
    ],
    'obs': [
        P('Siga estrictamente las normas de su iglesia, convención o denominación sobre requisitos, cargos y quién puede consagrar.', 'Siga rigorosamente as normas da sua igreja, convenção ou denominação sobre requisitos, cargos e quem pode consagrar.'),
        P('No consagre por presión ni por amistad: los textos de 1 Timoteo 3 y Tito 1 piden carácter probado.', 'Não consagre por pressão nem por amizade: os textos de 1 Timóteo 3 e Tito 1 pedem caráter provado.'),
        P('Registre la consagración en el acta de la iglesia con fecha y ministros presentes.', 'Registre a consagração na ata da igreja com data e ministros presentes.'),
    ],
})

# ---------------------------------------------------------------- posse
C.append({
    'k': 'posse', 'cat': 'ord',
    'n': P('Instalación de pastor', 'Posse de pastor'),
    'd': P('Presentar e instalar oficialmente a un pastor al frente de una iglesia, con el compromiso mutuo del pastor y de la congregación delante de Dios.',
           'Apresentar e empossar oficialmente um pastor à frente de uma igreja, com o compromisso mútuo do pastor e da congregação diante de Deus.'),
    'prep': [
        P('Confirmar la decisión según el proceso de su convención, campo o denominación.', 'Confirmar a decisão conforme o processo da sua convenção, campo ou denominação.'),
        P('Coordinar con el ministro que presidirá la instalación y con el pastor saliente, si lo hay.', 'Combinar com o ministro que presidirá a posse e com o pastor anterior, se houver.'),
        P('Preparar el acta y los documentos de la iglesia que deban firmarse.', 'Preparar a ata e os documentos da igreja que devam ser assinados.'),
        P('Planificar la presentación de la familia pastoral.', 'Planejar a apresentação da família pastoral.'),
    ],
    'ordem': [
        passo('Apertura y alabanza', 'Abertura e louvor', 'Culto de adoración dirigido por la iglesia local.', 'Culto de adoração conduzido pela igreja local.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Hechos 20:28 o 1 Pedro 5:2-4.', 'Lê-se Atos 20:28 ou 1 Pedro 5:2-4.'),
        passo('Mensaje', 'Mensagem', 'Mensaje del ministro presidente sobre el pastorado.', 'Mensagem do ministro presidente sobre o pastorado.'),
        passo('Presentación del pastor y su familia', 'Apresentação do pastor e sua família', 'Se presenta al nuevo pastor y a su familia ante la iglesia.', 'Apresenta-se o novo pastor e sua família diante da igreja.'),
        passo('Compromiso del pastor', 'Compromisso do pastor', 'El pastor responde a las preguntas de compromiso.', 'O pastor responde às perguntas de compromisso.'),
        passo('Compromiso de la iglesia', 'Compromisso da igreja', 'La congregación, de pie, expresa su compromiso.', 'A congregação, de pé, expressa seu compromisso.'),
        passo('Oración de instalación', 'Oração de posse', 'Los ministros imponen las manos sobre el pastor y oran.', 'Os ministros impõem as mãos sobre o pastor e oram.'),
        passo('Firma del acta y bendición', 'Assinatura da ata e bênção', 'Se firma el acta y el nuevo pastor despide a la iglesia con la bendición.', 'Assina-se a ata e o novo pastor despede a igreja com a bênção.'),
    ],
    'textos': ['43.20.28', '59.5.2-4', '23.3.15', '57.13.17', '54.4.1-5', '42.21.15-17'],
    'falas': [
        fala('Compromiso del pastor', 'Compromisso do pastor',
             '¿Acepta usted, delante de Dios y de esta iglesia, el cuidado pastoral de esta congregación? (Sí, acepto.) ¿Promete predicar la Palabra con fidelidad, apacentar el rebaño no por obligación ni por ganancia, sino con amor, y ser ejemplo para la grey? (Sí, prometo.) ¿Promete guardar la doctrina y el orden de su iglesia? (Sí, prometo, con la ayuda del Señor.)',
             'Você aceita, diante de Deus e desta igreja, o cuidado pastoral desta congregação? (Sim, aceito.) Você promete pregar a Palavra com fidelidade, pastorear o rebanho não por obrigação nem por ganância, mas com amor, e ser exemplo para o rebanho? (Sim, prometo.) Você promete guardar a doutrina e a ordem da sua igreja? (Sim, prometo, com a ajuda do Senhor.)'),
        fala('Compromiso de la iglesia', 'Compromisso da igreja',
             'Iglesia, ¿reciben ustedes a (nombre) como su pastor, enviado por el Señor? (Sí, le recibimos.) ¿Prometen orar por él y por su familia, honrarle, colaborar con su ministerio y seguir su liderazgo conforme a la Palabra de Dios? (Sí, prometemos.) Que el Señor les ayude a cumplir lo que hoy prometen.',
             'Igreja, vocês recebem (nome) como seu pastor, enviado pelo Senhor? (Sim, recebemos.) Vocês prometem orar por ele e por sua família, honrá-lo, colaborar com seu ministério e seguir sua liderança conforme a Palavra de Deus? (Sim, prometemos.) Que o Senhor os ajude a cumprir o que hoje prometem.'),
        fala('Oración de instalación', 'Oração de posse',
             '(Con imposición de manos.) Señor, Príncipe de los pastores, hoy ponemos en tus manos a tu siervo (nombre) y a esta iglesia que le recibe. Dale un corazón según el tuyo, para apacentar con ciencia y con inteligencia. Unge su boca para predicar tu Palabra, guarda su hogar y dale sabiduría para guiar. Que esta iglesia crezca en santidad y en número para tu gloria. En el nombre de Jesús, amén.',
             '(Com imposição de mãos.) Senhor, Supremo Pastor, hoje colocamos em tuas mãos o teu servo (nome) e esta igreja que o recebe. Dá-lhe um coração segundo o teu, para apascentar com conhecimento e com inteligência. Unge a sua boca para pregar a tua Palavra, guarda o seu lar e dá-lhe sabedoria para conduzir. Que esta igreja cresça em santidade e em número para a tua glória. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Siga las normas de su convención o denominación sobre quién instala al pastor y qué documentos se firman.', 'Siga as normas da sua convenção ou denominação sobre quem dá posse ao pastor e quais documentos são assinados.'),
        P('Si hay un pastor saliente, hónrelo públicamente y evite comparaciones.', 'Se houver um pastor anterior, honre-o publicamente e evite comparações.'),
        P('Los cambios legales en la representación de la iglesia (personería jurídica, cuentas) se hacen según la ley local, no solo con el culto.', 'As mudanças legais na representação da igreja (estatuto, CNPJ, contas) se fazem conforme a lei local, não apenas com o culto.'),
    ],
})

# ---------------------------------------------------------------- templo
C.append({
    'k': 'templo', 'cat': 'ded',
    'n': P('Dedicación de templo', 'Dedicação de templo'),
    'd': P('Dedicar a Dios un templo terminado o renovado, dando gracias por su provisión y consagrando el lugar a la adoración, la predicación y la oración.',
           'Dedicar a Deus um templo concluído ou reformado, dando graças por sua provisão e consagrando o lugar à adoração, à pregação e à oração.'),
    'prep': [
        P('Invitar a autoridades de la convención, pastores vecinos y a quienes colaboraron en la obra.', 'Convidar autoridades da convenção, pastores vizinhos e quem colaborou na obra.'),
        P('Preparar un breve histórico de la construcción con datos confirmados.', 'Preparar um breve histórico da construção com dados confirmados.'),
        P('Organizar la cinta, la placa o la llave, si se usarán en la apertura.', 'Organizar a fita, a placa ou a chave, se forem usadas na abertura.'),
        P('Verificar la seguridad del local: salidas, electricidad y capacidad.', 'Verificar a segurança do local: saídas, eletricidade e capacidade.'),
    ],
    'ordem': [
        passo('Apertura de las puertas', 'Abertura das portas', 'Acto simbólico en la entrada (cinta o llave) y entrada de la iglesia cantando.', 'Ato simbólico na entrada (fita ou chave) e entrada da igreja cantando.'),
        passo('Invocación', 'Invocação', 'Oración pidiendo que la gloria de Dios llene la casa.', 'Oração pedindo que a glória de Deus encha a casa.'),
        passo('Alabanza', 'Louvor', 'Himnos de gratitud y adoración.', 'Hinos de gratidão e adoração.'),
        passo('Histórico de la obra', 'Histórico da obra', 'Relato breve de la construcción y agradecimientos.', 'Relato breve da construção e agradecimentos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee 1 Reyes 8:27-30 o 2 Crónicas 7:1-3.', 'Lê-se 1 Reis 8:27-30 ou 2 Crônicas 7:1-3.'),
        passo('Mensaje', 'Mensagem', 'Mensaje sobre la casa de Dios como casa de oración.', 'Mensagem sobre a casa de Deus como casa de oração.'),
        passo('Declaración de dedicación', 'Declaração de dedicação', 'El ministro, con la iglesia de pie, declara el templo dedicado al Señor.', 'O ministro, com a igreja de pé, declara o templo dedicado ao Senhor.'),
        passo('Oración de dedicación', 'Oração de dedicação', 'Oración de consagración del templo.', 'Oração de consagração do templo.'),
        passo('Descubrimiento de la placa y bendición', 'Descerramento da placa e bênção', 'Si la hay, se descubre la placa; se despide a la iglesia con la bendición.', 'Se houver, descerra-se a placa; despede-se a igreja com a bênção.'),
    ],
    'textos': ['10.8.27-30', '13.7.1-3', '13.7.14-16', '18.84.1-2', '18.122.1', '36.2.9', '39.21.13', '45.3.10-11'],
    'falas': [
        fala('Declaración de dedicación', 'Declaração de dedicação',
             'Hermanos, sabemos que ni los cielos de los cielos pueden contener a Dios; él no habita en templos hechos por manos como si los necesitara. Pero hoy, con gratitud, separamos este edificio para su servicio. En el nombre del Padre, del Hijo y del Espíritu Santo, dedicamos este templo al Señor, para la adoración, la predicación de su Palabra, la oración y la salvación de las almas.',
             'Irmãos, sabemos que nem os céus dos céus podem conter a Deus; ele não habita em templos feitos por mãos como se precisasse deles. Mas hoje, com gratidão, separamos este edifício para o seu serviço. Em nome do Pai, do Filho e do Espírito Santo, dedicamos este templo ao Senhor, para a adoração, a pregação da sua Palavra, a oração e a salvação das almas.'),
        fala('Oración de dedicación', 'Oração de dedicação',
             'Señor, como oró Salomón, te pedimos: que tus ojos estén abiertos día y noche sobre esta casa. Cuando tu pueblo ore en este lugar, oye desde los cielos y perdona. Que aquí los perdidos encuentren salvación, los enfermos sanidad, los tristes consuelo y los creyentes la llenura de tu Espíritu. Que esta sea casa de oración para todos. En el nombre de Jesús, amén.',
             'Senhor, como orou Salomão, nós te pedimos: que os teus olhos estejam abertos dia e noite sobre esta casa. Quando o teu povo orar neste lugar, ouve dos céus e perdoa. Que aqui os perdidos encontrem salvação, os enfermos cura, os tristes consolo e os crentes a plenitude do teu Espírito. Que esta seja casa de oração para todos. Em nome de Jesus, amém.'),
        fala('Compromiso de la iglesia', 'Compromisso da igreja',
             'Iglesia, ¿se comprometen ustedes a cuidar esta casa con reverencia, a reunirse aquí para adorar al Señor, a sostener su obra con fidelidad y a abrir estas puertas para recibir a todos los que buscan a Dios? (Sí, nos comprometemos.) Que el Señor confirme la obra de nuestras manos.',
             'Igreja, vocês se comprometem a cuidar desta casa com reverência, a reunir-se aqui para adorar ao Senhor, a sustentar a sua obra com fidelidade e a abrir estas portas para receber todos os que buscam a Deus? (Sim, nos comprometemos.) Que o Senhor confirme a obra das nossas mãos.'),
    ],
    'obs': [
        P('Antes de la inauguración, verifique que el edificio cumpla las exigencias municipales y de seguridad según la ley local.', 'Antes da inauguração, verifique se o edifício cumpre as exigências municipais e de segurança conforme a lei local.'),
        P('Siga el protocolo de su convención o denominación para la dedicación.', 'Siga o protocolo da sua convenção ou denominação para a dedicação.'),
        P('Agradezca a todos con equidad; evite destacar solo a quienes dieron más dinero.', 'Agradeça a todos com equidade; evite destacar apenas quem deu mais dinheiro.'),
    ],
})

# ---------------------------------------------------------------- pedra fundamental
C.append({
    'k': 'pedra', 'cat': 'ded',
    'n': P('Piedra fundamental', 'Lançamento da pedra fundamental'),
    'd': P('Iniciar la construcción de un templo o edificio de la iglesia con un acto de fe, reconociendo que Cristo es el fundamento y que el Señor edifica la casa.',
           'Iniciar a construção de um templo ou edifício da igreja com um ato de fé, reconhecendo que Cristo é o fundamento e que o Senhor edifica a casa.'),
    'prep': [
        P('Definir con el responsable de la obra el lugar exacto de la piedra.', 'Definir com o responsável pela obra o local exato da pedra.'),
        P('Preparar la piedra o bloque, la herramienta y, si se usa, una caja con Biblia, acta y fecha.', 'Preparar a pedra ou bloco, a ferramenta e, se for usada, uma caixa com Bíblia, ata e data.'),
        P('Prever sonido, sombra y lugares para personas mayores.', 'Prever som, sombra e lugares para idosos.'),
        P('Tener a mano los documentos del terreno y del proyecto.', 'Ter em mãos os documentos do terreno e do projeto.'),
    ],
    'ordem': [
        passo('Reunión en el terreno', 'Reunião no terreno', 'La iglesia se reúne alrededor del lugar de la piedra cantando un himno.', 'A igreja se reúne ao redor do local da pedra cantando um hino.'),
        passo('Oración', 'Oração', 'Oración de gratitud por el terreno y por el proyecto.', 'Oração de gratidão pelo terreno e pelo projeto.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee el Salmo 127:1 o Esdras 3:10-11.', 'Lê-se o Salmo 127:1 ou Esdras 3:10-11.'),
        passo('Palabra breve', 'Palavra breve', 'Mensaje sobre Cristo como fundamento.', 'Mensagem sobre Cristo como fundamento.'),
        passo('Lectura del acta', 'Leitura da ata', 'Se lee el acta con fecha, nombre de la iglesia y del pastor.', 'Lê-se a ata com data, nome da igreja e do pastor.'),
        passo('Colocación de la piedra', 'Colocação da pedra', 'El pastor y los invitados colocan la piedra y la caja, si la hay.', 'O pastor e os convidados colocam a pedra e a caixa, se houver.'),
        passo('Oración de consagración y bendición', 'Oração de consagração e bênção', 'Oración por la obra, los obreros y los recursos, y bendición final.', 'Oração pela obra, pelos trabalhadores e pelos recursos, e bênção final.'),
    ],
    'textos': ['18.127.1', '45.3.10-11', '22.28.16', '48.2.19-22', '14.3.10-11', '59.2.4-6', '39.7.24-25'],
    'falas': [
        fala('Declaración', 'Declaração',
             'Hoy, (fecha), la iglesia (nombre de la iglesia), bajo el cuidado pastoral de (nombre del pastor), coloca la piedra fundamental de este templo. Lo hacemos con fe, reconociendo que nadie puede poner otro fundamento que el que está puesto, el cual es Jesucristo. Si el Señor no edifica la casa, en vano trabajan los que la edifican; por eso ponemos esta obra en sus manos.',
             'Hoje, (data), a igreja (nome da igreja), sob o cuidado pastoral de (nome do pastor), lança a pedra fundamental deste templo. Fazemos isso com fé, reconhecendo que ninguém pode pôr outro fundamento além do que já está posto, o qual é Jesus Cristo. Se o Senhor não edificar a casa, em vão trabalham os que a edificam; por isso colocamos esta obra em suas mãos.'),
        fala('Oración por la obra', 'Oração pela obra',
             'Señor, tú eres la piedra viva, escogida y preciosa. Te entregamos este terreno y esta construcción. Provee los recursos, guarda a los obreros de todo accidente, da sabiduría a los responsables y unidad a la iglesia. Que lo que hoy comenzamos con fe sea terminado para tu gloria, y que en este lugar muchas vidas sean edificadas sobre la Roca. En el nombre de Jesús, amén.',
             'Senhor, tu és a pedra viva, escolhida e preciosa. Entregamos a ti este terreno e esta construção. Provê os recursos, guarda os trabalhadores de todo acidente, dá sabedoria aos responsáveis e união à igreja. Que o que hoje começamos com fé seja concluído para a tua glória, e que neste lugar muitas vidas sejam edificadas sobre a Rocha. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Antes del acto, verifique que el terreno y el proyecto estén en regla según la ley y las normas municipales de su lugar.', 'Antes do ato, verifique se o terreno e o projeto estão regularizados conforme a lei e as normas municipais do seu lugar.'),
        P('Evite prometer fechas de conclusión que dependan de recursos aún no confirmados.', 'Evite prometer datas de conclusão que dependam de recursos ainda não confirmados.'),
        P('Cuide la seguridad en el terreno: zanjas, materiales y herramientas.', 'Cuide da segurança no terreno: valas, materiais e ferramentas.'),
    ],
})

# ---------------------------------------------------------------- casa / comércio
C.append({
    'k': 'casa', 'cat': 'ded',
    'n': P('Dedicación de casa o negocio', 'Consagração de casa ou comércio'),
    'd': P('Orar con una familia o un emprendedor para consagrar al Señor su nuevo hogar o su negocio, pidiendo su paz, su protección y su dirección.',
           'Orar com uma família ou um empreendedor para consagrar ao Senhor seu novo lar ou seu comércio, pedindo a sua paz, a sua proteção e a sua direção.'),
    'prep': [
        P('Combinar el horario con la familia o el dueño del negocio.', 'Combinar o horário com a família ou o dono do comércio.'),
        P('Preguntar si desean invitar a vecinos, clientes o empleados.', 'Perguntar se desejam convidar vizinhos, clientes ou funcionários.'),
        P('Preparar uno o dos textos bíblicos y, si se desea, un himno.', 'Preparar um ou dois textos bíblicos e, se desejarem, um hino.'),
    ],
    'ordem': [
        passo('Saludo de paz', 'Saudação de paz', 'Al entrar, el ministro saluda: Paz sea a esta casa.', 'Ao entrar, o ministro saúda: Paz seja nesta casa.'),
        passo('Himno', 'Hino', 'Un himno conocido por todos.', 'Um hino conhecido por todos.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Josué 24:15 (casa) o Deuteronomio 8:18 (negocio).', 'Lê-se Josué 24:15 (casa) ou Deuteronômio 8:18 (comércio).'),
        passo('Palabra breve', 'Palavra breve', 'Mensaje corto sobre poner la casa o el trabajo en manos de Dios.', 'Mensagem curta sobre colocar a casa ou o trabalho nas mãos de Deus.'),
        passo('Declaración de la familia o del dueño', 'Declaração da família ou do dono', 'Los dueños expresan su deseo de servir a Dios en ese lugar.', 'Os donos expressam seu desejo de servir a Deus naquele lugar.'),
        passo('Oración de consagración', 'Oração de consagração', 'El ministro ora por el lugar y por quienes lo usarán.', 'O ministro ora pelo lugar e por quem o usará.'),
        passo('Bendición y confraternización', 'Bênção e confraternização', 'Bendición final y, si la familia lo desea, un momento de comunión.', 'Bênção final e, se a família desejar, um momento de comunhão.'),
    ],
    'textos': ['5.24.15', '41.10.5', '18.127.1', '19.24.3-4', '41.19.9', '4.8.18', '19.3.9-10', '18.90.17'],
    'falas': [
        fala('Declaración de la familia', 'Declaração da família',
             '(La familia dice:) Nosotros, (nombres), reconocemos que todo lo que tenemos viene de Dios. Hoy consagramos este hogar al Señor. Queremos que aquí se lea su Palabra, se ore, se viva en paz y se reciba a otros con amor. Como dijo Josué, nosotros y nuestra casa serviremos al Señor.',
             '(A família diz:) Nós, (nomes), reconhecemos que tudo o que temos vem de Deus. Hoje consagramos este lar ao Senhor. Queremos que aqui se leia a sua Palavra, se ore, se viva em paz e se receba o próximo com amor. Como disse Josué, nós e a nossa casa serviremos ao Senhor.'),
        fala('Oración por un hogar', 'Oração por um lar',
             'Señor, que tu paz repose sobre esta casa y sobre todos los que viven en ella. Guarda sus entradas y salidas, protege a la familia de todo mal y que este sea un lugar de oración, de perdón y de alegría. Si tú no edificas la casa, en vano trabajan los que la edifican; por eso la ponemos en tus manos. En el nombre de Jesús, amén.',
             'Senhor, que a tua paz repouse sobre esta casa e sobre todos os que moram nela. Guarda as suas entradas e saídas, protege a família de todo mal e que este seja um lugar de oração, de perdão e de alegria. Se tu não edificares a casa, em vão trabalham os que a edificam; por isso a colocamos em tuas mãos. Em nome de Jesus, amém.'),
        fala('Oración por un negocio', 'Oração por um comércio',
             'Señor, tú das el poder para trabajar y prosperar. Te consagramos este negocio. Da sabiduría a (nombre) para administrar con honestidad, trato justo a clientes y empleados, y fidelidad para honrarte con sus bienes. Confirma la obra de sus manos, guárdalo de pérdidas y de la tentación del dinero fácil, y que este lugar sea un testimonio de tu bondad. En el nombre de Jesús, amén.',
             'Senhor, tu dás a força para trabalhar e prosperar. Consagramos a ti este comércio. Dá sabedoria a (nome) para administrar com honestidade, tratar com justiça clientes e funcionários, e fidelidade para te honrar com seus bens. Confirma a obra das suas mãos, guarda-o de perdas e da tentação do dinheiro fácil, e que este lugar seja um testemunho da tua bondade. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('No presente la dedicación como garantía de lucro ni como amuleto de protección; es un acto de fe y de entrega.', 'Não apresente a consagração como garantia de lucro nem como amuleto de proteção; é um ato de fé e de entrega.'),
        P('Si el negocio vende productos o servicios contrarios a la fe, converse con el dueño antes del acto.', 'Se o comércio vende produtos ou serviços contrários à fé, converse com o dono antes do ato.'),
        P('Sea breve si es en horario comercial, para no perjudicar la atención al público.', 'Seja breve se for em horário comercial, para não prejudicar o atendimento ao público.'),
    ],
})

# ---------------------------------------------------------------- membros
C.append({
    'k': 'membros', 'cat': 'igreja',
    'n': P('Recepción de nuevos miembros', 'Recepção de novos membros'),
    'd': P('Recibir públicamente en la comunión de la iglesia a nuevos miembros, por bautismo, carta de traslado o reconciliación, según las normas de la iglesia.',
           'Receber publicamente na comunhão da igreja novos membros, por batismo, carta de transferência ou reconciliação, conforme as normas da igreja.'),
    'prep': [
        P('Confirmar la lista de nuevos miembros y la forma de ingreso de cada uno.', 'Confirmar a lista de novos membros e a forma de ingresso de cada um.'),
        P('Verificar cartas de traslado o la aprobación de la iglesia, según su reglamento.', 'Verificar cartas de transferência ou a aprovação da igreja, conforme o seu regimento.'),
        P('Preparar los datos para el registro y, si se usan, las tarjetas de miembro.', 'Preparar os dados para o registro e, se usadas, as carteirinhas de membro.'),
        P('Elegir a hermanos que acompañarán a cada nuevo miembro en sus primeras semanas.', 'Escolher irmãos que acompanharão cada novo membro nas primeiras semanas.'),
    ],
    'ordem': [
        passo('Llamado al frente', 'Chamada à frente', 'Se llama a los nuevos miembros por nombre.', 'Chamam-se os novos membros pelo nome.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Hechos 2:41-42 o Efesios 2:19-22.', 'Lê-se Atos 2:41-42 ou Efésios 2:19-22.'),
        passo('Palabras breves', 'Palavras breves', 'Explicación de lo que significa ser parte del cuerpo de Cristo en una iglesia local.', 'Explicação do que significa fazer parte do corpo de Cristo numa igreja local.'),
        passo('Compromiso de los nuevos miembros', 'Compromisso dos novos membros', 'Responden a las preguntas de compromiso.', 'Respondem às perguntas de compromisso.'),
        passo('Compromiso de la iglesia', 'Compromisso da igreja', 'La iglesia, de pie, expresa su bienvenida.', 'A igreja, de pé, expressa suas boas-vindas.'),
        passo('Oración', 'Oração', 'Oración por los nuevos miembros.', 'Oração pelos novos membros.'),
        passo('Bienvenida', 'Boas-vindas', 'Saludo fraterno de la iglesia y entrega de tarjetas, si las hay.', 'Saudação fraterna da igreja e entrega de carteirinhas, se houver.'),
    ],
    'textos': ['43.2.41-42', '43.2.47', '48.2.19-22', '44.12.4-5', '45.12.27', '57.10.24-25', '18.133.1', '44.15.7'],
    'falas': [
        fala('Compromiso de los nuevos miembros', 'Compromisso dos novos membros',
             '¿Confiesan ustedes a Jesucristo como su Señor y Salvador? (Sí.) ¿Desean formar parte de esta iglesia, perseverando en la doctrina de los apóstoles, en la comunión, en el partimiento del pan y en las oraciones? (Sí.) ¿Prometen, con la ayuda de Dios, congregarse con fidelidad, sostener la obra del Señor y vivir en amor y santidad? (Sí, prometemos.)',
             'Vocês confessam Jesus Cristo como seu Senhor e Salvador? (Sim.) Vocês desejam fazer parte desta igreja, perseverando na doutrina dos apóstolos, na comunhão, no partir do pão e nas orações? (Sim.) Vocês prometem, com a ajuda de Deus, congregar com fidelidade, sustentar a obra do Senhor e viver em amor e santidade? (Sim, prometemos.)'),
        fala('Bienvenida de la iglesia', 'Boas-vindas da igreja',
             'Hermanos, ya no son extranjeros ni advenedizos, sino miembros de la familia de Dios. En nombre de esta iglesia les damos la bienvenida. Iglesia, ¿reciben ustedes a estos hermanos con amor, prometiendo orar por ellos, animarles y caminar juntos en la fe? (Sí, les recibimos.) Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía.',
             'Irmãos, vocês já não são estrangeiros nem forasteiros, mas membros da família de Deus. Em nome desta igreja damos a vocês as boas-vindas. Igreja, vocês recebem estes irmãos com amor, prometendo orar por eles, encorajá-los e caminhar juntos na fé? (Sim, recebemos.) Vejam como é bom e agradável que os irmãos vivam em união.'),
    ],
    'obs': [
        P('Siga el reglamento de su iglesia o denominación sobre requisitos de membresía y formas de ingreso.', 'Siga o regimento da sua igreja ou denominação sobre requisitos de membresia e formas de ingresso.'),
        P('No exponga públicamente los motivos de una reconciliación; basta mencionar que el hermano es recibido.', 'Não exponha publicamente os motivos de uma reconciliação; basta mencionar que o irmão é recebido.'),
        P('Proteja los datos personales del registro de miembros.', 'Proteja os dados pessoais do registro de membros.'),
    ],
})

# ---------------------------------------------------------------- aniversário
C.append({
    'k': 'aniv', 'cat': 'fam',
    'n': P('Culto de cumpleaños', 'Culto de aniversário'),
    'd': P('Dar gracias a Dios por un año más de vida de un hermano, en su casa o en la iglesia, y pedir su bendición para el nuevo año.',
           'Dar graças a Deus por mais um ano de vida de um irmão, em sua casa ou na igreja, e pedir a sua bênção para o novo ano.'),
    'prep': [
        P('Confirmar con la familia el lugar, el horario y quiénes participarán.', 'Confirmar com a família o local, o horário e quem participará.'),
        P('Preguntar motivos de gratitud y de oración del cumpleañero.', 'Perguntar motivos de gratidão e de oração do aniversariante.'),
        P('Elegir himnos sencillos que todos conozcan.', 'Escolher hinos simples que todos conheçam.'),
    ],
    'ordem': [
        passo('Himno de apertura', 'Hino de abertura', 'Un himno de gratitud.', 'Um hino de gratidão.'),
        passo('Oración', 'Oração', 'Oración de gratitud por la vida del cumpleañero.', 'Oração de gratidão pela vida do aniversariante.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee el Salmo 103:1-5 o el Salmo 90:12.', 'Lê-se o Salmo 103:1-5 ou o Salmo 90:12.'),
        passo('Testimonio', 'Testemunho', 'El cumpleañero o un familiar comparte un motivo de gratitud.', 'O aniversariante ou um familiar compartilha um motivo de gratidão.'),
        passo('Mensaje breve', 'Mensagem breve', 'Palabra corta sobre contar los días con sabiduría.', 'Palavra curta sobre contar os dias com sabedoria.'),
        passo('Oración de bendición', 'Oração de bênção', 'El ministro ora por el nuevo año de vida.', 'O ministro ora pelo novo ano de vida.'),
        passo('Bendición y confraternización', 'Bênção e confraternização', 'Bendición final y momento de comunión.', 'Bênção final e momento de comunhão.'),
    ],
    'textos': ['18.90.12', '18.103.1-5', '18.118.24', '24.3.22-23', '19.3.1-2', '18.91.16', '3.6.24-26'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Estamos reunidos para dar gracias a Dios por la vida de (nombre). Cada año es un regalo de su misericordia, que es nueva cada mañana. La Biblia nos enseña a contar nuestros días de tal modo que traigamos al corazón sabiduría. Por eso hoy no celebramos solo una fecha, sino la fidelidad del Señor que le ha sostenido hasta aquí.',
             'Estamos reunidos para dar graças a Deus pela vida de (nome). Cada ano é um presente da sua misericórdia, que se renova a cada manhã. A Bíblia nos ensina a contar os nossos dias de tal maneira que alcancemos um coração sábio. Por isso hoje não celebramos apenas uma data, mas a fidelidade do Senhor que o sustentou até aqui.'),
        fala('Oración de bendición', 'Oração de bênção',
             'Señor, gracias por (nombre) y por un año más de vida. Gracias por cada beneficio, por la salud, el sustento y la familia. Bendice este nuevo año: guárdale en tus caminos, dale sabiduría en sus decisiones y alegría en tu servicio. El Señor le bendiga y le guarde; haga resplandecer su rostro sobre usted y le dé paz. En el nombre de Jesús, amén.',
             'Senhor, obrigado por (nome) e por mais um ano de vida. Obrigado por cada benefício, pela saúde, pelo sustento e pela família. Abençoa este novo ano: guarda-o nos teus caminhos, dá-lhe sabedoria nas decisões e alegria no teu serviço. O Senhor o abençoe e o guarde; faça resplandecer o seu rosto sobre você e lhe dê a paz. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Si el cumpleañero está enfermo o en edad avanzada, sea breve y adapte el horario.', 'Se o aniversariante estiver doente ou em idade avançada, seja breve e adapte o horário.'),
        P('Mantenga el carácter de culto: la comida y la fiesta vienen después, con sobriedad.', 'Mantenha o caráter de culto: a comida e a festa vêm depois, com sobriedade.'),
    ],
})

# ---------------------------------------------------------------- formatura
C.append({
    'k': 'formatura', 'cat': 'fam',
    'n': P('Culto de graduación', 'Culto de formatura'),
    'd': P('Agradecer a Dios por la conclusión de una etapa de estudios y consagrar al Señor el futuro profesional de los graduados.',
           'Agradecer a Deus pela conclusão de uma etapa de estudos e consagrar ao Senhor o futuro profissional dos formandos.'),
    'prep': [
        P('Confirmar los nombres de los graduados, la carrera o nivel concluido y la institución.', 'Confirmar os nomes dos formandos, o curso ou nível concluído e a instituição.'),
        P('Definir si habrá testimonio de un graduado o palabras de los padres.', 'Definir se haverá testemunho de um formando ou palavras dos pais.'),
        P('Preparar, si se desea, un recuerdo (Biblia, versículo o certificado de la iglesia).', 'Preparar, se desejar, uma lembrança (Bíblia, versículo ou certificado da igreja).'),
    ],
    'ordem': [
        passo('Entrada de los graduados', 'Entrada dos formandos', 'Los graduados entran mientras se canta un himno.', 'Os formandos entram enquanto se canta um hino.'),
        passo('Oración de apertura', 'Oração de abertura', 'Gratitud a Dios por la etapa concluida.', 'Gratidão a Deus pela etapa concluída.'),
        passo('Lectura bíblica', 'Leitura bíblica', 'Se lee Proverbios 3:5-6 o Colosenses 3:23-24.', 'Lê-se Provérbios 3:5-6 ou Colossenses 3:23-24.'),
        passo('Testimonio', 'Testemunho', 'Un graduado comparte cómo Dios le ayudó en sus estudios.', 'Um formando compartilha como Deus o ajudou nos estudos.'),
        passo('Mensaje', 'Mensagem', 'Mensaje sobre servir a Dios con la profesión y la sabiduría que viene de él.', 'Mensagem sobre servir a Deus com a profissão e a sabedoria que vem dele.'),
        passo('Oración de consagración', 'Oração de consagração', 'Los graduados, de pie, reciben oración por su futuro.', 'Os formandos, de pé, recebem oração por seu futuro.'),
        passo('Entrega de recuerdos y bendición', 'Entrega de lembranças e bênção', 'Se entregan los recuerdos y se despide con la bendición.', 'Entregam-se as lembranças e encerra-se com a bênção.'),
    ],
    'textos': ['19.3.5-6', '19.2.6', '50.3.23-24', '58.1.5', '26.1.17', '18.37.5', '19.16.3', '8.7.12'],
    'falas': [
        fala('Palabras de apertura', 'Palavras de abertura',
             'Hermanos, hoy celebramos con (nombres) la conclusión de sus estudios. Detrás de este logro hay esfuerzo, noches de estudio y el sacrificio de muchas familias, pero sobre todo la mano de Dios, que da la sabiduría. Como Samuel, decimos: hasta aquí nos ayudó el Señor. Y como Daniel y sus compañeros, deseamos que estos jóvenes usen su conocimiento para honrar a Dios.',
             'Irmãos, hoje celebramos com (nomes) a conclusão dos seus estudos. Por trás desta conquista há esforço, noites de estudo e o sacrifício de muitas famílias, mas sobretudo a mão de Deus, que dá a sabedoria. Como Samuel, dizemos: até aqui nos ajudou o Senhor. E como Daniel e seus companheiros, desejamos que estes jovens usem o seu conhecimento para honrar a Deus.'),
        fala('Oración de consagración', 'Oração de consagração',
             'Señor, gracias por esta etapa concluida. Te consagramos el futuro de estos graduados. Abre puertas de trabajo, dales sabiduría para decidir, integridad en su profesión y humildad en el éxito. Que todo lo que hagan, lo hagan de corazón, como para ti y no para los hombres. Que sean luz en su lugar de trabajo y sirvan a su prójimo con excelencia. En el nombre de Jesús, amén.',
             'Senhor, obrigado por esta etapa concluída. Consagramos a ti o futuro destes formandos. Abre portas de trabalho, dá-lhes sabedoria para decidir, integridade na profissão e humildade no sucesso. Que tudo o que fizerem, façam de coração, como para ti e não para as pessoas. Que sejam luz no seu lugar de trabalho e sirvam ao próximo com excelência. Em nome de Jesus, amém.'),
    ],
    'obs': [
        P('Honre a todos los graduados por igual, cualquiera sea el nivel (primaria, secundaria, técnico o universitario).', 'Honre todos os formandos por igual, qualquer que seja o nível (fundamental, médio, técnico ou superior).'),
        P('Evite prometer éxito económico; enfatice la vocación y el servicio.', 'Evite prometer sucesso financeiro; enfatize a vocação e o serviço.'),
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
