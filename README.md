# Meu Púlpito

Bloc de notas para preparar sermones y predicar con ellos.

- **Inicio**: nuevo sermón, búsqueda, recientes, favoritos y próxima predicación.
- **Editor**: escribe sin formularios; títulos, negrita, cursiva, subrayado, listas, frases destacadas, versículos, recordatorios (@), deshacer/rehacer y guardado automático.
- **Modo Pregar**: letra grande y ajustable, fondo negro/azul/claro, cronómetro con avisos, barra de progreso, avanzar/retroceder por puntos (botones, toques laterales o control Bluetooth), solo puntos, continuar donde lo dejaste y pantalla siempre encendida.
- **Sermones**: filtros (recientes, favoritos, predicados, pendientes), categorías, buscar en título y contenido, duplicar, compartir (WhatsApp, texto, PDF) y eliminar.
- **Biblia**: Reina-Valera 1909 y Bíblia Livre sin internet; buscar citas y palabras, favoritos, copiar e insertar en sermones.
- **Comparar versiones**: RV 1909, RV 1865, Bíblia Livre, Bíblia Livre TR, Nova Versão de Acesso Livre y el original (Textus Receptus griego / Códice de Leningrado hebreo) con pronunciación aproximada.
- **Traducir ES ↔ PT**: crea una copia traducida; los versículos vienen de la Biblia del otro idioma y el resto pasa por el servicio gratuito MyMemory.
- **Agenda** y **Perfil** (idioma ES/PT, tema claro/oscuro/auto, categorías, copia de seguridad).

Datos en Firebase (proyecto de Tú Delivery): `pulpito/{uid}` o, si esa regla no existe, `empresa/pulpito/{uid}`. Los sermones antiguos se convierten al abrir; el texto original (`body`) se conserva.

## Etapa 3
- **Meu Púlpito IA**: el usuario pone su propia clave de Anthropic en Perfil (queda solo en el aparato, no se sincroniza ni entra en copias). Las llamadas van directo a la API desde el navegador. La IA nunca escribe el texto de los versículos: solo la referencia, y el app la verifica y completa desde la Biblia incluida; las citas que no existen se quitan o se marcan.
- **Audio y dictado**: grabación con el micrófono, guardada en IndexedDB del aparato (no se sube a la nube); dictado con el reconocimiento de voz del navegador cuando está disponible.
