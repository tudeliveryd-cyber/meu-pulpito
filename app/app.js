/* Meu Púlpito · v2 — bloc de notas para preparar y predicar sermones */
(function(){
'use strict';

/* =========================================================
   Utilidades
   ========================================================= */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
          set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const ic=(n,cls='')=>`<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const norm=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function todayISO(d=new Date()){return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function addDays(iso,n){const d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+n);return todayISO(d)}
function fmtD(iso){if(!iso)return'';const[y,m,d]=iso.split('-');return`${d}/${m}`}
function fmtSec(x){const m=Math.floor(x/60),s=x%60;return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
let toastT=0;
function toast(msg){const el=$('#toast');el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,2400)}
function copyText(txt){return new Promise(ok=>{const fb=()=>{const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove();ok()};
  try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}})}

/* =========================================================
   Idiomas
   ========================================================= */
const I18N={
es:{ver_l:'Versión',tagline:'PREPARA. ORGANIZA. PREDICA.',nav_home:'Inicio',nav_list:'Sermones',nav_bible:'Biblia',nav_agenda:'Agenda',nav_profile:'Configuración',nav_dic:'Diccionarios',
greet_m:'Buenos días,',greet_a:'Buenas tardes,',greet_n:'Buenas noches,',pastor:'Pastor',
search_ph:'Buscar sermón, versículo o palabra',prepare:'Preparar',new_sermon:'Nuevo sermón',new_desc:'Abre la hoja y empieza a escribir. Se guarda solo.',
st_total:'Sermones',st_done:'Predicados',st_fav:'Favoritos',st_week:'Esta semana',recent:'Recientes',my_sermons:'Mis sermones',favorites:'Favoritos',see_all:'Ver todos',next_preach:'Próxima predicación',
today:'hoy',edited:'editado',edited_c:'Editado',no_prev:'Sin contenido todavía',f_all:'Todos',f_recent:'Recientes',f_fav:'Favoritos',f_done:'Predicados',f_todo:'Pendientes',
category:'Categoría',no_cat:'Sin categoría',points:'puntos',point:'punto',preached:'Predicado',pending:'Sin predicar',
act_edit:'Editar',act_preach:'Predicar',act_fav:'Marcar como favorito',act_unfav:'Quitar de favoritos',act_dup:'Duplicar',act_share:'Compartir',act_del:'Eliminar',act_hist:'Predicaciones registradas',
del_q:'¿Eliminar este sermón para siempre?',cancel:'Cancelar',deleted:'Sermón eliminado',duplicated:'Copia creada. Estás editando la copia.',copy_sfx:'(copia)',
empty_t:'Tu biblioteca está vacía',empty_d:'Toca Nuevo sermón y escribe tu primer mensaje. Todo se guarda solo.',no_res:'Ningún sermón encontrado',res_1:'1 sermón encontrado',res_n:'{n} sermones encontrados',
saved:'Guardado',saving:'Guardando…',untitled:'Sin título',title_ph:'Título del sermón',body_ph:'Empieza a escribir…',
undo:'Deshacer',redo:'Rehacer',preach:'Predicar',tb_size:'Tamaño del texto',tb_style:'Estilo del texto',sy_point:'Punto',sy_sub:'Subtítulo',sy_text:'Texto',sy_big:'Grande',tb_title:'Título o subtítulo',tb_bold:'Negrita',tb_italic:'Cursiva',tb_under:'Subrayado',tb_list:'Lista numerada',tb_hl:'Destacar frase',tb_note:'Recordatorio personal',tb_verse:'Versículo',tb_point:'Nuevo punto',
sel_first:'Selecciona primero el texto que quieres destacar',
ref_ph:'Ej.: Juan 3:16',insert:'Insertar',verse_nf:'No encontré ese versículo. Revisa la cita.',verse_t:'Insertar versículo',verse_hint:'Escribe la cita y aparece el texto (Reina-Valera 1909).',verse_hint_pt:'Escribe la cita y aparece el texto (Bíblia Livre).',
lang_msg:'Idioma del mensaje',more:'Más opciones',
register:'Registrar predicación',place:'Lugar',sede:'Sede',anexo:'Anexo',other:'Otro lugar',place_name:'Nombre del lugar',date:'Fecha',time:'Hora',minutes:'Minutos',notes:'Notas',notes_ph:'Qué funcionó, qué cambiar, cómo respondió la iglesia…',save:'Guardar',registered:'Predicación registrada',
ask_reg:'Predicaste {m} min. ¿Registrar esta predicación?',later:'Después',no_hist:'Todavía no registraste predicaciones de este sermón.',
p_point:'Punto {i} de {n}',p_prev:'Anterior',p_next:'Siguiente punto',p_next2:'Siguiente',p_last:'Es la última parte',p_set:'Ajustes de lectura',p_size:'Tamaño de letra',p_lh:'Espacio entre líneas',p_bg:'Fondo',bg_negro:'Negro',bg_azul:'Azul marino',bg_claro:'Claro',
p_timer:'Cronómetro',show:'Mostrar',hide:'Ocultar',p_goal:'Tiempo del mensaje',free:'Libre',p_outline:'Mostrar',p_full_txt:'Todo el texto',p_only:'Solo puntos',p_tap:'Tocar los lados para cambiar de parte',yes:'Sí',no:'No',p_reset:'Reiniciar cronómetro',p_fs:'Pantalla completa',p_calm:'Ocultar barras',
five:'Faltan 5 minutos',done_t:'Tiempo cumplido',cont:'Continuando donde lo dejaste',tip_tap:'Toca la derecha de la pantalla para la próxima parte',start:'Inicio',note:'Recordatorio',ilu:'Ilustración',base:'Texto base',intro:'Introducción',dev:'Desarrollo',concl:'Conclusión',close:'Cerrar',exit:'Salir',
cont_preach:'Continuar predicando',end:'Terminar',go_on:'Continuar',
bak_t:'Guarda una copia de tus sermones.',bak_d:'Hace más de una semana desde la última.',copy_now:'Copiar ahora',bak_done:'Copia copiada. Pégala en un chat tuyo de WhatsApp o en Notas.',
b_search:'Buscar libro, cita o palabra',chap:'Cap.',vers:'Vers.',copied:'Copiado',fav_add:'Guardado en favoritos',fav_rm:'Quitado de favoritos',ins_s:'Insertar en sermón',choose_s:'¿En qué sermón?',inserted:'Versículo insertado',
b_res:'{n} resultados',b_none:'Sin resultados',b_loading:'Abriendo la Biblia…',b_err:'No pude abrir la Biblia. Revisa la conexión e intenta de nuevo.',b_nofav:'Aún no guardaste versículos. Toca un versículo y la estrella.',b_favs_s:'Favoritos',b_favs:'Versículos favoritos',
schedule:'Programar',upcoming:'Próximas predicaciones',past:'Anteriores',no_ev:'Nada programado. Toca Programar para agregar una predicación.',ev_new:'Nueva predicación',ev_edit:'Editar predicación',
cult:'Tipo de culto',theme:'Tema del mensaje',sermon:'Sermón',later_pick:'Elegir después',pick_s:'Elegir sermón',tbd:'tema por definir',ev_saved:'Predicación programada',ev_del:'Predicación eliminada',
your_name:'Tu nombre',language:'Idioma de la app',appearance:'Apariencia',light:'Claro',dark:'Oscuro',auto:'Auto',def_bible:'Biblia',categories:'Categorías',add_cat:'Nueva categoría',add:'Agregar',
backup:'Copia de seguridad',last_bak:'Última: {d}',never:'nunca',restore:'Restaurar o traer sermones',restore_d:'Pega aquí una copia de seguridad o el texto copiado en «Levar para o app próprio».',import:'Importar',imported:'{n} sermón(es) importado(s)',nothing_new:'Nada nuevo para importar',bad_paste:'No reconocí el texto pegado. Cópialo de nuevo.',
account:'Cuenta',got_it:'Entendido',adm_t:'Panel del administrador',adm_d:'Cuántos se registraron y controlar el acceso',adm_load:'Cargando…',adm_err:'No se pudo cargar. Revisa tu internet.',adm_users:'Registrados',adm_act7:'Activos (7 días)',adm_serms:'Sermones',adm_uses:'Más usado',adm_u_pregar:'Modo Predicar',adm_u_dic:'Diccionario',adm_u_ia:'Asistente IA',adm_n_serm:'{n} sermones',adm_seen:'visto {d}',adm_on:'Activo',adm_off:'Bloqueado',adm_active:'Acceso activado',adm_blocked:'Acceso bloqueado',adm_none:'Todavía nadie se registró.',adm_note:'Solo ves números (sermones, fechas, uso). El contenido de los sermones queda cerrado por las reglas de seguridad: ni tú lo ves desde la app.',blk_t:'Acceso en pausa',blk_d:'Tu acceso a Meu Púlpito está pausado por ahora. Habla con quien te dio el acceso para activarlo de nuevo. Tus sermones están guardados y no se borran.',priv:'Privacidad',priv_d:'Cómo cuidamos tus sermones y tus datos',priv_date:'Política de privacidad · noviembre de 2026',del_acc:'Borrar mi cuenta',del_acc_d:'Borra tu cuenta y todos tus sermones para siempre',del_warn:'Se borrarán tu cuenta, tus sermones, agenda, biblioteca y notas, en la nube y en este celular. No se puede deshacer. Si quieres guardar algo, haz antes una copia en Configuración → Copia de seguridad.',del_type:'Para confirmar, escribe BORRAR',del_word:'BORRAR',del_go:'Borrar todo para siempre',del_doing:'Borrando…',del_done:'Tu cuenta fue borrada',del_relog:'Por seguridad, cierra la sesión, vuelve a entrar y repite este paso.',rec_t:'Recuperar contraseña',rec_d:'Escribe el correo de tu cuenta. Te enviaremos un enlace para crear una contraseña nueva.',rec_send:'Enviar enlace',rec_sending:'Enviando…',rec_ok_t:'Revisa tu correo',rec_ok_d:'Enviamos el enlace a {e}. Ábrelo, crea tu contraseña nueva y vuelve aquí para entrar. Si no aparece, mira en Spam o Promociones.',rec_back:'Volver a entrar',rec_again:'Enviar de nuevo',retry:'Intentar de nuevo',show_pw:'Mostrar contraseña',acc_conn:'Conectando con tu cuenta…',acc_fail:'No se pudo conectar con el sistema de cuentas. Revisa tu internet o abre el app desde el ícono de la pantalla de inicio.',local_only:'Sin cuenta: los sermones quedan solo en este celular.',logout:'Cerrar sesión',login_btn:'Entrar con una cuenta',soon:'Próximamente',s_rec:'Grabar audio',s_tr:'Audio a texto',s_trl:'Traducir ES ↔ PT',s_ai:'Asistente para sermones',
credits:'Biblias: Reina-Valera 1909 y 1865 (dominio público), Bíblia Livre y Bíblia Livre TR (licencia libre), Nova Versão de Acesso Livre, Textus Receptus griego y Códice de Leningrado hebreo (dominio público). Diccionarios: hebreo y griego de STEPBible.org, Tyndale House (CC BY 4.0); Strong (dominio público; datos de Open Scriptures, CC BY-SA); Easton (1897), Smith (1863) y Hitchcock (1869), dominio público (datos NEUU, CC BY 4.0). Traducción automática: MyMemory.',b_read:'Biblia',
cmp:'Comparar versiones',dic_preg:'Diccionario del predicador',dic_eas:'Más en el Diccionario Bíblico de Easton · traducción automática',dic_o:'En el original',dic_vs:'Versículos',dic_bib:'Bíblico',dic_refs:'Pasajes',dic_rest:'Traducir el resto',dic_nref:'{n} pasajes',dic_hint_b:'Busca una palabra para tu predicación (Dios, gracia, fe, amor, salvación…) o personas y lugares (Moisés, Betel…). Verás el significado y la palabra en hebreo y griego.',dic_src_b:'Diccionario del predicador: escrito para Meu Púlpito. Diccionario Bíblico de Easton (1897, dominio público) · datos NEUU (CC BY 4.0), con traducción automática.',lx_wait:'Traduciendo…',lx_auto_b:'Traducción automática. Queda guardada en este celular.',lx_en:'Ver el original en inglés',lx_auto:'Traducción automática del diccionario Strong. Queda guardada en este celular.',lx_off:'Sin internet: se muestra el original en inglés. Con internet aparece traducido.',lx:'Diccionario',lx_ph:'Palabra, griego, hebreo o número (G26, H430)',dict_gr:'Griego',dict_he:'Hebreo',dict_all:'Todo',dict_hint:'Busca una palabra (amor, gracia, fe), una palabra en griego o hebreo, o un número Strong. En «Comparar versiones», toca una palabra en griego o hebreo para ver su significado.',dict_load:'Abriendo el diccionario…',dict_err:'No pude abrir el diccionario. Revisa tu internet e intenta de nuevo.',dict_def:'Definición',dict_kjv:'Traducida en la Biblia como',dict_orig:'Origen',dict_ctx:'En este versículo',dict_en:'Definición original en inglés (Strong, 1890).',dict_tr:'Traducir',dict_trd:'Traducción automática',dict_tr_err:'No se pudo traducir ahora',dict_more:'Buscando también en inglés…',dict_nf:'Esa palabra no está en el diccionario',dict_tap:'Toca una palabra para ver su significado',dict_src:'Diccionario Strong (1890–1894, dominio público) · Open Scriptures (CC BY-SA) · STEPBible.org (CC BY)',cmp_t:'Versiones',orig:'En el original',orig_g:'Griego',orig_h:'Hebreo',translit:'pronunciación aproximada',cmp_load:'Abriendo las versiones…',cmp_none:'Este versículo no está en esta versión.',cmp_tip:'Toca la cita para comparar versiones',
tr_to:'Traducir al {l}',pl_t:'Idioma del sermón',pl_d:'Lea el mismo sermón en el otro idioma sin crear una copia. La traducción queda guardada en el sermón y funciona sin conexión. El original no cambia.',pl_orig:'original',pl_new:'traducir',pl_changed:'Usted editó el sermón después de traducirlo: se traducirá de nuevo.',pl_mm:'Sin la clave de la IA se usa el traductor gratuito MyMemory. Para sermones largos, ponga su correo en Configuración (límite mayor) o la clave de la IA (mejor calidad).',pl_ok:'Sermón en español',pl_see:'Predicar en {l}',tr_t:'Traducir sermón',tr_d:'Se crea una copia traducida; el original no cambia. Los versículos se colocan desde la Biblia del otro idioma. El resto del texto se envía al servicio gratuito MyMemory para traducir.',tr_lim:'Este sermón tiene {n} caracteres. Límite gratuito: unos 5.000 por día, o 50.000 si pones tu correo en Configuración.',tr_go:'Traducir',tr_prog:'Traduciendo… {i} de {n}',tr_done:'Traducción creada. Revísala antes de predicar.',tr_quota:'Se acabó el límite gratuito de hoy. Intenta mañana o pon tu correo en Perfil para tener más.',tr_err:'No pude traducir ahora. Revisa la conexión e intenta de nuevo.',tr_mail:'Correo para traducción',tr_mail_d:'Opcional. Se envía a MyMemory solo para aumentar el límite diario.',
sync_ok:'Guardado en tu cuenta',sync_local:'Guardado en este celular',sync_conn:'Conectando…',sync_off:'Sin señal: usando la copia del celular',sync_pend:'Guardando… se envía cuando haya señal',sync_err:'No pude leer tu cuenta ahora. Queda guardado en el celular.',sync_noperm:'Tu cuenta todavía no puede guardar en la nube. Queda en este celular.',
login_t:'Entra para guardar tus sermones',login_d:'Tus sermones quedan en tu cuenta y aparecen en cualquier celular donde entres.',email:'Correo',pass:'Contraseña',pass_ph:'Mínimo 6 caracteres',enter:'Entrar',create:'Crear cuenta',forgot:'¿Olvidaste tu contraseña?',nologin:'Usar sin cuenta',reset_sent:'Te enviamos un correo para crear una contraseña nueva',
e_email:'Correo inválido. Revisa si lo escribiste bien.',e_pass:'Escribe la contraseña.',e_weak:'La contraseña necesita al menos 6 caracteres.',e_used:'Este correo ya tiene cuenta. Toca Entrar.',e_cred:'Correo o contraseña no coinciden. Intenta de nuevo o toca «¿Olvidaste tu contraseña?».',e_many:'Muchos intentos. Espera unos minutos.',e_net:'Sin internet. Conéctate para entrar la primera vez.',e_gen:'No pude entrar ahora. Intenta de nuevo.',e_reset:'Escribe tu correo arriba y toca otra vez Olvidé la contraseña.',
entering:'Entrando…',creating:'Creando…',
share:'Compartir',full:'Completo',only_points:'Solo puntos',wa:'WhatsApp',copy_txt:'Copiar texto',pdf:'PDF o imprimir',other_apps:'Otras apps',txt_copied:'Texto copiado',pdf_tip:'En la pantalla de impresión, toca Compartir para guardar como PDF.',
wc:'{w} palabras · ~{m} min',models:'Modelos',model_t:'Empezar con un modelo',model_d:'Reemplaza el contenido de la hoja (el título se mantiene). Puedes deshacer.',details:'Detalles',details_t:'Detalles del sermón',organize:'Organizar',org_t:'Organizar el sermón',org_pts:'Puntos',org_par:'Párrafos',org_hint:'Usa las flechas para mover. Puedes deshacer.',org_start:'Inicio del sermón',up:'Subir',down:'Bajar',
versions:'Versiones anteriores',ver_none:'Todavía no hay versiones guardadas. Se guarda una cada vez que editas y sales del sermón.',ver_restore:'Restaurar esta versión',ver_restored:'Versión restaurada',words:'palabras',
trash:'Papelera',trash_n:'Papelera ({n})',trash_empty:'La papelera está vacía.',trash_d:'Lo que eliminas queda aquí 30 días antes de borrarse.',restore_it:'Restaurar',del_forever:'Eliminar para siempre',moved_trash:'Movido a la papelera',restored:'Restaurado',to_trash:'Mover a la papelera',
i_goal:'Objetivo de la predicación',i_aud:'Público',i_dur:'Duración estimada (min)',i_text:'Texto bíblico principal',i_keys:'Palabras clave',i_prep:'Fecha de preparación',i_pred:'Fecha de predicación',i_place:'Iglesia o lugar',optional:'Todos los campos son opcionales.',
lib:'Biblioteca',n_new:'Nueva anotación',n_title:'Título',n_text:'Escribe aquí…',n_ref:'Referencia bíblica (opcional)',n_to_s:'Convertir en sermón',n_empty:'Guarda estudios, frases, ilustraciones e ideas para tus próximos sermones.',n_conv:'Sermón creado a partir de la anotación',all:'Todas',n_type:'Tipo',
nt_estudio:'Estudio bíblico',nt_frase:'Frase',nt_reflexion:'Reflexión',nt_ilustracion:'Ilustración',nt_nota:'Anotación',nt_idea:'Idea para sermón',nt_ref:'Referencia',
hist_all:'Historial',hist_n:'{n} predicaciones registradas',hist_none:'Aquí aparecen las predicaciones que registras al salir del Modo Pregar o desde el menú del sermón.',next_tab:'Próximas',
p_scroll:'Desplazamiento automático',p_speed:'Velocidad',p_font:'Tipo de letra',f_serif:'Clásica',f_sans:'Moderna',f_wide:'Muy legible',p_color:'Color del texto',c_auto:'Auto',p_align:'Alineación',a_left:'Izquierda',a_just:'Justificado',a_center:'Centro',p_margin:'Márgenes',p_pspace:'Espacio entre párrafos',p_dim:'Brillo',bg_sepia:'Sepia',scroll_pause:'Desplazamiento en pausa',scroll_end:'Fin del mensaje',g_read:'Lectura',g_screen:'Pantalla',g_nav:'Predicación',
tp_exp:'Expositivo',tp_tem:'Temático',tp_cena:'Santa Cena',tp_evan:'Evangelístico',tp_est:'Estudio bíblico',
bp_t:'Biblia',bp_ins:'Insertar',bp_ins_n:'Insertar ({n})',bp_pick:'Toca los versículos que quieres insertar',
pdf_print:'PDF para imprimir',pdf_study:'PDF para estudiar',pdf_preach:'PDF para predicar',pdf_points:'PDF solo puntos',pdf_print_d:'Limpio y completo.',pdf_study_d:'Con detalles, recordatorios y espacio para notas.',pdf_preach_d:'Letra grande y puntos destacados.',pdf_points_d:'Una hoja con el esquema.',notes_area:'Notas',
security:'Seguridad',lock:'Bloquear con código',lock_d:'Pide el código al abrir la app.',lock_on:'Bloqueo activado',lock_off:'Bloqueo desactivado',pin_new:'Crea un código de 4 a 6 números',pin_again:'Repite el código',pin_diff:'Los códigos no coinciden. Intenta de nuevo.',pin_short:'Usa de 4 a 6 números.',pin_enter:'Escribe tu código',pin_wrong:'Código incorrecto',unlock:'Desbloquear',bio:'Usar Face ID o huella',bio_use:'Desbloquear con Face ID o huella',bio_on:'Face ID o huella activado',bio_fail:'No se pudo usar Face ID o huella. Usa el código.',forgot_pin:'Olvidé el código',forgot_pin_d:'Para quitar el bloqueo, sal de tu cuenta y entra de nuevo con tu correo y contraseña. Tus sermones siguen guardados en tu cuenta.',forgot_local:'Sin cuenta no es posible quitar el bloqueo sin el código. Por eso, en modo sin cuenta te recomendamos no activarlo.',sign_out_unlock:'Salir y entrar de nuevo',lock_local_warn:'Estás sin cuenta: si olvidas el código no podrás recuperarlo.',
autobak:'Copias automáticas',autobak_d:'Una por día en este celular, últimos 7 días.',autobak_none:'Todavía no hay copias automáticas. La primera se hace hoy.',autobak_rest:'Recuperar de esta copia',autobak_rest_d:'Agrega los sermones, anotaciones y predicaciones que falten o estén en la papelera. No borra nada.',autobak_done:'{n} elementos recuperados',
ai:'Meu Púlpito IA',ai_d:'Asistente para preparar el sermón. No sustituye tu estudio bíblico personal.',ai_key:'Clave de la IA',ai_key_d:'Se guarda solo en este celular. Créala en console.anthropic.com.',ai_test:'Probar',ai_ok:'La IA está lista',ai_nokey:'Para usar la IA, pon tu clave en Configuración → Meu Púlpito IA.',ai_err_key:'La clave no es válida. Revísala en Configuración.',ai_err_rate:'Demasiadas solicitudes. Espera un minuto.',ai_err_busy:'La IA está ocupada. Intenta en unos segundos.',ai_err_credit:'Tu cuenta de la IA no tiene saldo. Agrega créditos en console.anthropic.com.',ai_err:'No pude usar la IA ahora. Revisa la conexión.',
ai_thinking:'Pensando…',ai_intro:'Crear introducción',ai_point:'Desarrollar el punto actual',ai_concl:'Mejorar la conclusión',ai_apps:'Aplicaciones prácticas',ai_ctx:'Contexto bíblico',ai_refs:'Referencias relacionadas',ai_gram:'Corregir gramática',ai_trans:'Traducir el sermón',ai_ask:'Pregunta libre',ai_ask_ph:'Ej.: ¿qué significa «propuso en su corazón»?',ai_send:'Enviar',ai_insert:'Insertar en el sermón',ai_replace:'Reemplazar el texto',ai_again:'Otra respuesta',ai_dropped:'{n} cita(s) no encontradas en la Biblia fueron quitadas.',ai_unver:'(cita no verificada)',ai_inserted:'Agregado al sermón',ai_replaced:'Texto corregido',ai_need_sel:'Coloca el cursor en el párrafo o selecciona el texto que quieres corregir.',ai_tr_ai:'Se usa la IA para traducir (mejor calidad).',
rec:'Audio y dictado',rec_d:'Los audios quedan guardados en este celular.',rec_start:'Grabar',rec_stop:'Detener',rec_saved:'Audio guardado',rec_none:'Todavía no hay audios en este sermón.',rec_none_g:'Todavía no hay notas de voz.',rec_err:'No pude usar el micrófono. Revisa el permiso en Ajustes → Safari → Micrófono.',rec_to_note:'Convertir en anotación',rec_del:'Eliminar audio',rec_title:'Nota de voz {d}',voice_note:'Nota de voz',
dict:'Dictar (voz a texto)',dict_on:'Escuchando… habla con calma',dict_stop:'Terminar dictado',dict_none:'El dictado no está disponible aquí. Usa el micrófono del teclado del iPhone: es igual de rápido.',dict_ins:'Insertar en el sermón',dict_note:'Guardar como anotación',dict_ph:'El texto aparece aquí…',voice_notes:'Notas de voz',
long_t:'El título quedó muy largo. ¿Usar «{t}» como título y pasar el resto al texto?',long_fix:'Arreglar título',long_done:'Título arreglado. El resto quedó debajo; puedes moverlo con Organizar.',
night:'Lectura nocturna',night_d:'Fondo negro, letras blancas y brillo más bajo.',clean:'Interfaz limpia',clean_d:'Esconde los botones. Toca el centro de la pantalla para verlos.',tip_clean:'Toca el centro de la pantalla para ver los controles',index:'Índice',imp:'Punto importante',imp_on:'Marcado como importante',imp_off:'Ya no es importante',imp_need:'Coloca el cursor en un punto (título) para marcarlo',from_start:'Desde el inicio',pinch:'Junta o separa dos dedos para cambiar el tamaño de la letra',photo:'Cambiar foto',crop_t:'Ajusta tu foto',crop_d:'Mueve la foto con el dedo y acerca con dos dedos o con la barra. Queda lo que está dentro del círculo.',use_photo:'Usar foto',photo_add:'Agregar foto',photo_rm:'Quitar foto',photo_ok:'Foto actualizada',photo_err:'No se pudo usar esa imagen',
cats:['Santa Cena','Culto de Enseñanza','Culto de la Familia','Jóvenes','Liderazgo','Evangelismo','Consagración','Mensajes especiales'],
wd:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],months:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
books:['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis']},
pt:{ver_l:'Versão',tagline:'PREPARE. ORGANIZE. PREGUE.',nav_home:'Início',nav_list:'Sermões',nav_bible:'Bíblia',nav_agenda:'Agenda',nav_profile:'Configurações',nav_dic:'Dicionários',
greet_m:'Bom dia,',greet_a:'Boa tarde,',greet_n:'Boa noite,',pastor:'Pastor',
search_ph:'Buscar sermão, versículo ou palavra',prepare:'Preparar',new_sermon:'Novo sermão',new_desc:'Abra a folha e comece a escrever. Salva sozinho.',
st_total:'Sermões',st_done:'Pregados',st_fav:'Favoritos',st_week:'Esta semana',recent:'Recentes',my_sermons:'Meus sermões',favorites:'Favoritos',see_all:'Ver todos',next_preach:'Próxima pregação',
today:'hoje',edited:'editado',edited_c:'Editado',no_prev:'Sem conteúdo ainda',f_all:'Todos',f_recent:'Recentes',f_fav:'Favoritos',f_done:'Pregados',f_todo:'Pendentes',
category:'Categoria',no_cat:'Sem categoria',points:'pontos',point:'ponto',preached:'Pregado',pending:'Não pregado',
act_edit:'Editar',act_preach:'Pregar',act_fav:'Marcar como favorito',act_unfav:'Tirar dos favoritos',act_dup:'Duplicar',act_share:'Compartilhar',act_del:'Excluir',act_hist:'Pregações registradas',
del_q:'Excluir este sermão para sempre?',cancel:'Cancelar',deleted:'Sermão excluído',duplicated:'Cópia criada. Você está editando a cópia.',copy_sfx:'(cópia)',
empty_t:'Sua biblioteca está vazia',empty_d:'Toque em Novo sermão e escreva sua primeira mensagem. Tudo salva sozinho.',no_res:'Nenhum sermão encontrado',res_1:'1 sermão encontrado',res_n:'{n} sermões encontrados',
saved:'Salvo',saving:'Salvando…',untitled:'Sem título',title_ph:'Título do sermão',body_ph:'Comece a escrever…',
undo:'Desfazer',redo:'Refazer',preach:'Pregar',tb_size:'Tamanho do texto',tb_style:'Estilo do texto',sy_point:'Ponto',sy_sub:'Subtítulo',sy_text:'Texto',sy_big:'Grande',tb_title:'Título ou subtítulo',tb_bold:'Negrito',tb_italic:'Itálico',tb_under:'Sublinhado',tb_list:'Lista numerada',tb_hl:'Destacar frase',tb_note:'Lembrete pessoal',tb_verse:'Versículo',tb_point:'Novo ponto',
sel_first:'Selecione primeiro o texto que quer destacar',
ref_ph:'Ex.: João 3:16',insert:'Inserir',verse_nf:'Não encontrei esse versículo. Confira a referência.',verse_t:'Inserir versículo',verse_hint:'Digite a referência e o texto aparece (Reina-Valera 1909).',verse_hint_pt:'Digite a referência e o texto aparece (Bíblia Livre).',
lang_msg:'Idioma da mensagem',more:'Mais opções',
register:'Registrar pregação',place:'Lugar',sede:'Sede',anexo:'Anexo',other:'Outro lugar',place_name:'Nome do lugar',date:'Data',time:'Hora',minutes:'Minutos',notes:'Anotações',notes_ph:'O que funcionou, o que mudar, como a igreja reagiu…',save:'Salvar',registered:'Pregação registrada',
ask_reg:'Você pregou {m} min. Registrar esta pregação?',later:'Depois',no_hist:'Ainda não há pregações registradas deste sermão.',
p_point:'Ponto {i} de {n}',p_prev:'Anterior',p_next:'Próximo ponto',p_next2:'Próximo',p_last:'Esta é a última parte',p_set:'Ajustes de leitura',p_size:'Tamanho da letra',p_lh:'Espaço entre linhas',p_bg:'Fundo',bg_negro:'Preto',bg_azul:'Azul-marinho',bg_claro:'Claro',
p_timer:'Cronômetro',show:'Mostrar',hide:'Esconder',p_goal:'Tempo da mensagem',free:'Livre',p_outline:'Mostrar',p_full_txt:'Todo o texto',p_only:'Só os pontos',p_tap:'Tocar nas laterais para mudar de parte',yes:'Sim',no:'Não',p_reset:'Zerar cronômetro',p_fs:'Tela cheia',p_calm:'Esconder barras',
five:'Faltam 5 minutos',done_t:'Tempo encerrado',cont:'Continuando de onde você parou',tip_tap:'Toque na direita da tela para a próxima parte',start:'Início',note:'Lembrete',ilu:'Ilustração',base:'Texto base',intro:'Introdução',dev:'Desenvolvimento',concl:'Conclusão',close:'Fechar',exit:'Sair',
cont_preach:'Continuar pregando',end:'Encerrar',go_on:'Continuar',
bak_t:'Guarde uma cópia dos seus sermões.',bak_d:'Faz mais de uma semana desde a última.',copy_now:'Copiar agora',bak_done:'Cópia copiada. Cole numa conversa sua no WhatsApp ou nas Notas.',
b_search:'Buscar livro, referência ou palavra',chap:'Cap.',vers:'Vers.',copied:'Copiado',fav_add:'Salvo nos favoritos',fav_rm:'Removido dos favoritos',ins_s:'Inserir no sermão',choose_s:'Em qual sermão?',inserted:'Versículo inserido',
b_res:'{n} resultados',b_none:'Nenhum resultado',b_loading:'Abrindo a Bíblia…',b_err:'Não consegui abrir a Bíblia. Confira a conexão e tente de novo.',b_nofav:'Você ainda não salvou versículos. Toque num versículo e na estrela.',b_favs_s:'Favoritos',b_favs:'Versículos favoritos',
schedule:'Agendar',upcoming:'Próximas pregações',past:'Anteriores',no_ev:'Nada agendado. Toque em Agendar para adicionar uma pregação.',ev_new:'Nova pregação',ev_edit:'Editar pregação',
cult:'Tipo de culto',theme:'Tema da mensagem',sermon:'Sermão',later_pick:'Escolher depois',pick_s:'Escolher sermão',tbd:'tema a definir',ev_saved:'Pregação agendada',ev_del:'Pregação excluída',
your_name:'Seu nome',language:'Idioma do app',appearance:'Aparência',light:'Claro',dark:'Escuro',auto:'Auto',def_bible:'Bíblia',categories:'Categorias',add_cat:'Nova categoria',add:'Adicionar',
backup:'Cópia de segurança',last_bak:'Última: {d}',never:'nunca',restore:'Restaurar ou trazer sermões',restore_d:'Cole aqui uma cópia de segurança ou o texto copiado em «Levar para o app próprio».',import:'Importar',imported:'{n} sermão(ões) importado(s)',nothing_new:'Nada novo para importar',bad_paste:'Não reconheci o texto colado. Copie de novo.',
account:'Conta',got_it:'Entendi',adm_t:'Painel do administrador',adm_d:'Quantos se cadastraram e controlar o acesso',adm_load:'Carregando…',adm_err:'Não consegui carregar. Verifique a internet.',adm_users:'Cadastrados',adm_act7:'Ativos (7 dias)',adm_serms:'Sermões',adm_uses:'Mais usado',adm_u_pregar:'Modo Pregar',adm_u_dic:'Dicionário',adm_u_ia:'Assistente IA',adm_n_serm:'{n} sermões',adm_seen:'visto {d}',adm_on:'Ativo',adm_off:'Bloqueado',adm_active:'Acesso ativado',adm_blocked:'Acesso bloqueado',adm_none:'Ninguém se cadastrou ainda.',adm_note:'Você vê só números (sermões, datas, uso). O conteúdo dos sermões fica fechado pelas regras de segurança: nem você lê pelo app.',blk_t:'Acesso pausado',blk_d:'Seu acesso ao Meu Púlpito está pausado por enquanto. Fale com quem te deu o acesso para ativar de novo. Seus sermões estão guardados e não são apagados.',priv:'Privacidade',priv_d:'Como cuidamos dos seus sermões e dados',priv_date:'Política de privacidade · novembro de 2026',del_acc:'Apagar minha conta',del_acc_d:'Apaga sua conta e todos os seus sermões para sempre',del_warn:'Serão apagados sua conta, seus sermões, agenda, biblioteca e notas, na nuvem e neste celular. Não dá para desfazer. Se quiser guardar algo, faça antes uma cópia em Configurações → Cópia de segurança.',del_type:'Para confirmar, escreva APAGAR',del_word:'APAGAR',del_go:'Apagar tudo para sempre',del_doing:'Apagando…',del_done:'Sua conta foi apagada',del_relog:'Por segurança, saia da conta, entre de novo e repita este passo.',rec_t:'Recuperar senha',rec_d:'Digite o e-mail da sua conta. Vamos enviar um link para criar uma senha nova.',rec_send:'Enviar link',rec_sending:'Enviando…',rec_ok_t:'Confira seu e-mail',rec_ok_d:'Enviamos o link para {e}. Abra, crie sua senha nova e volte aqui para entrar. Se não aparecer, olhe em Spam ou Promoções.',rec_back:'Voltar para entrar',rec_again:'Enviar de novo',retry:'Tentar de novo',show_pw:'Mostrar senha',acc_conn:'Conectando com a sua conta…',acc_fail:'Não foi possível conectar ao sistema de contas. Verifique a internet ou abra o app pelo ícone da tela inicial.',local_only:'Sem conta: os sermões ficam só neste celular.',logout:'Sair da conta',login_btn:'Entrar com uma conta',soon:'Em breve',s_rec:'Gravar áudio',s_tr:'Áudio para texto',s_trl:'Traduzir ES ↔ PT',s_ai:'Assistente de sermões',
credits:'Bíblias: Reina-Valera 1909 e 1865 (domínio público), Bíblia Livre e Bíblia Livre TR (licença livre), Nova Versão de Acesso Livre, Textus Receptus grego e Códice de Leningrado hebraico (domínio público). Dicionários: hebraico e grego de STEPBible.org, Tyndale House (CC BY 4.0); Strong (domínio público; dados de Open Scriptures, CC BY-SA); Easton (1897), Smith (1863) e Hitchcock (1869), domínio público (dados NEUU, CC BY 4.0). Tradução automática: MyMemory.',b_read:'Bíblia',
cmp:'Comparar versões',dic_preg:'Dicionário do pregador',dic_eas:'Mais no Dicionário Bíblico de Easton · tradução automática',dic_o:'No original',dic_vs:'Versículos',dic_bib:'Bíblico',dic_refs:'Passagens',dic_rest:'Traduzir o resto',dic_nref:'{n} passagens',dic_hint_b:'Busque uma palavra para a sua pregação (Deus, graça, fé, amor, salvação…) ou pessoas e lugares (Moisés, Betel…). Você verá o significado e a palavra em hebraico e grego.',dic_src_b:'Dicionário do pregador: escrito para o Meu Púlpito. Dicionário Bíblico de Easton (1897, domínio público) · dados NEUU (CC BY 4.0), com tradução automática.',lx_wait:'Traduzindo…',lx_auto_b:'Tradução automática. Fica guardada neste celular.',lx_en:'Ver o original em inglês',lx_auto:'Tradução automática do dicionário Strong. Fica guardada neste celular.',lx_off:'Sem internet: aparece o original em inglês. Com internet aparece traduzido.',lx:'Dicionário',lx_ph:'Palavra, grego, hebraico ou número (G26, H430)',dict_gr:'Grego',dict_he:'Hebraico',dict_all:'Tudo',dict_hint:'Busque uma palavra (amor, graça, fé), uma palavra em grego ou hebraico, ou um número Strong. Em «Comparar versões», toque numa palavra em grego ou hebraico para ver o significado.',dict_load:'Abrindo o dicionário…',dict_err:'Não consegui abrir o dicionário. Verifique a internet e tente de novo.',dict_def:'Definição',dict_kjv:'Traduzida na Bíblia como',dict_orig:'Origem',dict_ctx:'Neste versículo',dict_en:'Definição original em inglês (Strong, 1890).',dict_tr:'Traduzir',dict_trd:'Tradução automática',dict_tr_err:'Não foi possível traduzir agora',dict_more:'Buscando também em inglês…',dict_nf:'Essa palavra não está no dicionário',dict_tap:'Toque numa palavra para ver o significado',dict_src:'Dicionário Strong (1890–1894, domínio público) · Open Scriptures (CC BY-SA) · STEPBible.org (CC BY)',cmp_t:'Versões',orig:'No original',orig_g:'Grego',orig_h:'Hebraico',translit:'pronúncia aproximada',cmp_load:'Abrindo as versões…',cmp_none:'Este versículo não está nesta versão.',cmp_tip:'Toque na referência para comparar versões',
tr_to:'Traduzir para {l}',pl_t:'Idioma do sermão',pl_d:'Leia o mesmo sermão no outro idioma sem criar uma cópia. A tradução fica guardada no sermão e funciona sem internet. O original não muda.',pl_orig:'original',pl_new:'traduzir',pl_changed:'Você editou o sermão depois de traduzir: ele será traduzido de novo.',pl_mm:'Sem a chave da IA é usado o tradutor grátis MyMemory. Para sermões longos, coloque seu e-mail em Configurações (limite maior) ou a chave da IA (melhor qualidade).',pl_ok:'Sermão em português',pl_see:'Pregar em {l}',tr_t:'Traduzir sermão',tr_d:'É criada uma cópia traduzida; o original não muda. Os versículos vêm da Bíblia do outro idioma. O resto do texto é enviado ao serviço grátis MyMemory para traduzir.',tr_lim:'Este sermão tem {n} caracteres. Limite grátis: uns 5.000 por dia, ou 50.000 se você colocar seu e-mail em Configurações.',tr_go:'Traduzir',tr_prog:'Traduzindo… {i} de {n}',tr_done:'Tradução criada. Revise antes de pregar.',tr_quota:'Acabou o limite grátis de hoje. Tente amanhã ou coloque seu e-mail em Configurações para ter mais.',tr_err:'Não consegui traduzir agora. Confira a conexão e tente de novo.',tr_mail:'E-mail para tradução',tr_mail_d:'Opcional. É enviado ao MyMemory só para aumentar o limite diário.',
sync_ok:'Salvo na sua conta',sync_local:'Salvo neste celular',sync_conn:'Conectando…',sync_off:'Sem sinal: usando a cópia do celular',sync_pend:'Salvando… envia quando tiver sinal',sync_err:'Não consegui ler sua conta agora. Fica salvo no celular.',sync_noperm:'Sua conta ainda não pode guardar na nuvem. Fica neste celular.',
login_t:'Entre para guardar seus sermões',login_d:'Seus sermões ficam na sua conta e aparecem em qualquer celular em que você entrar.',email:'E-mail',pass:'Senha',pass_ph:'Mínimo 6 caracteres',enter:'Entrar',create:'Criar conta',forgot:'Esqueceu a senha?',nologin:'Usar sem conta',reset_sent:'Enviamos um e-mail para criar uma senha nova',
e_email:'E-mail inválido. Confira se digitou certo.',e_pass:'Digite a senha.',e_weak:'A senha precisa ter pelo menos 6 caracteres.',e_used:'Este e-mail já tem conta. Toque em Entrar.',e_cred:'E-mail ou senha não conferem. Tente de novo ou toque em «Esqueceu a senha?».',e_many:'Muitas tentativas. Espere alguns minutos.',e_net:'Sem internet. Conecte-se para entrar pela primeira vez.',e_gen:'Não consegui entrar agora. Tente de novo.',e_reset:'Digite seu e-mail acima e toque de novo em Esqueci a senha.',
entering:'Entrando…',creating:'Criando…',
share:'Compartilhar',full:'Completo',only_points:'Só os pontos',wa:'WhatsApp',copy_txt:'Copiar texto',pdf:'PDF ou imprimir',other_apps:'Outros apps',txt_copied:'Texto copiado',pdf_tip:'Na tela de impressão, toque em Compartilhar para salvar como PDF.',
wc:'{w} palavras · ~{m} min',models:'Modelos',model_t:'Começar com um modelo',model_d:'Substitui o conteúdo da folha (o título fica). Dá para desfazer.',details:'Detalhes',details_t:'Detalhes do sermão',organize:'Organizar',org_t:'Organizar o sermão',org_pts:'Pontos',org_par:'Parágrafos',org_hint:'Use as setas para mover. Dá para desfazer.',org_start:'Início do sermão',up:'Subir',down:'Descer',
versions:'Versões anteriores',ver_none:'Ainda não há versões guardadas. Uma é guardada cada vez que você edita e sai do sermão.',ver_restore:'Restaurar esta versão',ver_restored:'Versão restaurada',words:'palavras',
trash:'Lixeira',trash_n:'Lixeira ({n})',trash_empty:'A lixeira está vazia.',trash_d:'O que você exclui fica aqui 30 dias antes de ser apagado.',restore_it:'Restaurar',del_forever:'Excluir para sempre',moved_trash:'Movido para a lixeira',restored:'Restaurado',to_trash:'Mover para a lixeira',
i_goal:'Objetivo da pregação',i_aud:'Público',i_dur:'Duração estimada (min)',i_text:'Texto bíblico principal',i_keys:'Palavras-chave',i_prep:'Data de preparo',i_pred:'Data da pregação',i_place:'Igreja ou lugar',optional:'Todos os campos são opcionais.',
lib:'Biblioteca',n_new:'Nova anotação',n_title:'Título',n_text:'Escreva aqui…',n_ref:'Referência bíblica (opcional)',n_to_s:'Transformar em sermão',n_empty:'Guarde estudos, frases, ilustrações e ideias para os próximos sermões.',n_conv:'Sermão criado a partir da anotação',all:'Todas',n_type:'Tipo',
nt_estudio:'Estudo bíblico',nt_frase:'Frase',nt_reflexion:'Reflexão',nt_ilustracion:'Ilustração',nt_nota:'Anotação',nt_idea:'Ideia de sermão',nt_ref:'Referência',
hist_all:'Histórico',hist_n:'{n} pregações registradas',hist_none:'Aqui aparecem as pregações que você registra ao sair do Modo Pregar ou pelo menu do sermão.',next_tab:'Próximas',
p_scroll:'Rolagem automática',p_speed:'Velocidade',p_font:'Tipo de letra',f_serif:'Clássica',f_sans:'Moderna',f_wide:'Bem legível',p_color:'Cor do texto',c_auto:'Auto',p_align:'Alinhamento',a_left:'Esquerda',a_just:'Justificado',a_center:'Centro',p_margin:'Margens',p_pspace:'Espaço entre parágrafos',p_dim:'Brilho',bg_sepia:'Sépia',scroll_pause:'Rolagem pausada',scroll_end:'Fim da mensagem',g_read:'Leitura',g_screen:'Tela',g_nav:'Pregação',
tp_exp:'Expositivo',tp_tem:'Temático',tp_cena:'Santa Ceia',tp_evan:'Evangelístico',tp_est:'Estudo bíblico',
bp_t:'Bíblia',bp_ins:'Inserir',bp_ins_n:'Inserir ({n})',bp_pick:'Toque nos versículos que quer inserir',
pdf_print:'PDF para imprimir',pdf_study:'PDF para estudar',pdf_preach:'PDF para pregar',pdf_points:'PDF só os pontos',pdf_print_d:'Limpo e completo.',pdf_study_d:'Com detalhes, lembretes e espaço para anotações.',pdf_preach_d:'Letra grande e pontos em destaque.',pdf_points_d:'Uma folha com o esboço.',notes_area:'Anotações',
security:'Segurança',lock:'Bloquear com código',lock_d:'Pede o código ao abrir o app.',lock_on:'Bloqueio ativado',lock_off:'Bloqueio desativado',pin_new:'Crie um código de 4 a 6 números',pin_again:'Repita o código',pin_diff:'Os códigos não conferem. Tente de novo.',pin_short:'Use de 4 a 6 números.',pin_enter:'Digite seu código',pin_wrong:'Código errado',unlock:'Desbloquear',bio:'Usar Face ID ou digital',bio_use:'Desbloquear com Face ID ou digital',bio_on:'Face ID ou digital ativado',bio_fail:'Não deu para usar Face ID ou digital. Use o código.',forgot_pin:'Esqueci o código',forgot_pin_d:'Para tirar o bloqueio, saia da conta e entre de novo com seu e-mail e senha. Seus sermões continuam guardados na conta.',forgot_local:'Sem conta não é possível tirar o bloqueio sem o código. Por isso, no modo sem conta recomendamos não ativar.',sign_out_unlock:'Sair e entrar de novo',lock_local_warn:'Você está sem conta: se esquecer o código, não dá para recuperar.',
autobak:'Cópias automáticas',autobak_d:'Uma por dia neste celular, últimos 7 dias.',autobak_none:'Ainda não há cópias automáticas. A primeira é feita hoje.',autobak_rest:'Recuperar desta cópia',autobak_rest_d:'Adiciona os sermões, anotações e pregações que faltam ou estão na lixeira. Não apaga nada.',autobak_done:'{n} itens recuperados',
ai:'Meu Púlpito IA',ai_d:'Assistente para preparar o sermão. Não substitui o seu estudo bíblico pessoal.',ai_key:'Chave da IA',ai_key_d:'Fica guardada só neste celular. Crie em console.anthropic.com.',ai_test:'Testar',ai_ok:'A IA está pronta',ai_nokey:'Para usar a IA, coloque sua chave em Configurações → Meu Púlpito IA.',ai_err_key:'A chave não é válida. Confira em Configurações.',ai_err_rate:'Muitos pedidos. Espere um minuto.',ai_err_busy:'A IA está ocupada. Tente em alguns segundos.',ai_err_credit:'Sua conta da IA está sem saldo. Adicione créditos em console.anthropic.com.',ai_err:'Não consegui usar a IA agora. Confira a conexão.',
ai_thinking:'Pensando…',ai_intro:'Criar introdução',ai_point:'Desenvolver o ponto atual',ai_concl:'Melhorar a conclusão',ai_apps:'Aplicações práticas',ai_ctx:'Contexto bíblico',ai_refs:'Referências relacionadas',ai_gram:'Corrigir gramática',ai_trans:'Traduzir o sermão',ai_ask:'Pergunta livre',ai_ask_ph:'Ex.: o que significa «propôs no seu coração»?',ai_send:'Enviar',ai_insert:'Inserir no sermão',ai_replace:'Substituir o texto',ai_again:'Outra resposta',ai_dropped:'{n} referência(s) não encontradas na Bíblia foram retiradas.',ai_unver:'(referência não conferida)',ai_inserted:'Adicionado ao sermão',ai_replaced:'Texto corrigido',ai_need_sel:'Coloque o cursor no parágrafo ou selecione o texto que quer corrigir.',ai_tr_ai:'A IA é usada para traduzir (melhor qualidade).',
rec:'Áudio e ditado',rec_d:'Os áudios ficam guardados neste celular.',rec_start:'Gravar',rec_stop:'Parar',rec_saved:'Áudio guardado',rec_none:'Ainda não há áudios neste sermão.',rec_none_g:'Ainda não há notas de voz.',rec_err:'Não consegui usar o microfone. Confira a permissão em Ajustes → Safari → Microfone.',rec_to_note:'Transformar em anotação',rec_del:'Excluir áudio',rec_title:'Nota de voz {d}',voice_note:'Nota de voz',
dict:'Ditar (voz para texto)',dict_on:'Ouvindo… fale com calma',dict_stop:'Terminar ditado',dict_none:'O ditado não está disponível aqui. Use o microfone do teclado do iPhone: é igualmente rápido.',dict_ins:'Inserir no sermão',dict_note:'Salvar como anotação',dict_ph:'O texto aparece aqui…',voice_notes:'Notas de voz',
long_t:'O título ficou muito longo. Usar «{t}» como título e passar o resto para o texto?',long_fix:'Arrumar título',long_done:'Título arrumado. O resto ficou embaixo; você pode mover com Organizar.',
night:'Leitura noturna',night_d:'Fundo preto, letras brancas e brilho mais baixo.',clean:'Interface limpa',clean_d:'Esconde os botões. Toque no centro da tela para vê-los.',tip_clean:'Toque no centro da tela para ver os controles',index:'Índice',imp:'Ponto importante',imp_on:'Marcado como importante',imp_off:'Não é mais importante',imp_need:'Coloque o cursor num ponto (título) para marcar',from_start:'Do início',pinch:'Junte ou afaste dois dedos para mudar o tamanho da letra',photo:'Trocar foto',crop_t:'Ajuste sua foto',crop_d:'Arraste a foto com o dedo e aproxime com dois dedos ou com a barra. Fica o que está dentro do círculo.',use_photo:'Usar foto',photo_add:'Adicionar foto',photo_rm:'Remover foto',photo_ok:'Foto atualizada',photo_err:'Não foi possível usar essa imagem',
cats:['Santa Ceia','Culto de Ensino','Culto da Família','Jovens','Liderança','Evangelismo','Consagração','Mensagens especiais'],
wd:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],months:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
books:['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cânticos','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oseias','Joel','Amós','Obadias','Jonas','Miqueias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse']}
};
let prefs=Object.assign({ui:/^pt/i.test(navigator.language||'')?'pt':'es',theme:'auto',bibleVer:null,
  p:{fs:30,lh:1.5,bg:'negro',timer:true,goal:30,outline:false,tap:true,font:'serif',color:'auto',align:'left',margin:24,ps:.75,dim:0,speed:3,clean:true}},ls.get('mp.prefs',{}));
prefs.p=Object.assign({fs:30,lh:1.5,bg:'negro',timer:true,goal:30,outline:false,tap:true,font:'serif',color:'auto',align:'left',margin:24,ps:.75,dim:0,speed:3,clean:true},prefs.p||{});
const savePrefs=()=>ls.set('mp.prefs',prefs);
function t(k,vars,lang){const d=I18N[lang||prefs.ui]||I18N.es;let s=d[k]??I18N.es[k]??k;if(vars&&typeof s==='string')s=s.replace(/\{(\w+)\}/g,(_,v)=>vars[v]??'');return s}

/* tema */
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
function applyTheme(){const dark=prefs.theme==='dark'||(prefs.theme==='auto'&&mq&&mq.matches);document.documentElement.dataset.mode=dark?'dark':'light';
  const m=$('meta[name="theme-color"]');if(m)m.content=dark?'#080D16':'#F1F3F6'}
mq&&mq.addEventListener&&mq.addEventListener('change',applyTheme);
applyTheme();document.documentElement.lang=prefs.ui==='pt'?'pt-BR':'es';

/* =========================================================
   Biblia (Reina-Valera 1909 · Bíblia Livre)
   ========================================================= */
const BOOKS=[
['genesis','gn','gen','ge'],['exodo','ex','exo'],['levitico','lv','lev'],['numeros','nm','num'],['deuteronomio','dt','deut','deu'],
['josue','js','jos'],['juizes','jueces','jz','jue','jc'],['rute','rut','rt'],['1samuel','1sm','1sa','1s'],['2samuel','2sm','2sa','2s'],
['1reis','1reyes','1rs','1re','1r'],['2reis','2reyes','2rs','2re','2r'],['1cronicas','1cr','1cro'],['2cronicas','2cr','2cro'],['esdras','ed','esd'],
['neemias','nehemias','ne','neh'],['ester','et','est'],['job','jb'],['salmos','salmo','sl','sal','slm','ps'],['proverbios','pv','pr','prov','pro'],
['eclesiastes','ec','ecl','ecc'],['canticos','cantares','cantico','cantardeloscantares','ct','cnt','cant'],['isaias','is','isa'],['jeremias','jr','jer'],['lamentacoes','lamentaciones','lm','lam'],
['ezequiel','ez','eze'],['daniel','dn','dan','da'],['oseias','oseas','os'],['joel','jl'],['amos','am'],
['obadias','abdias','ob','abd'],['jonas','jon'],['miqueias','miqueas','mq','miq'],['naum','nahum','na','nah'],['habacuque','habacuc','hc','hab'],
['sofonias','sf','sof'],['ageu','hageo','ag','hag'],['zacarias','zc','zac'],['malaquias','ml','mal'],
['mateus','mateo','mt','mat'],['marcos','mc','mr','mar'],['lucas','lc','luc'],['joao','juan','jo','jn','jua'],['atos','hechos','at','hch','hech'],
['romanos','rm','ro','rom'],['1corintios','1co','1cor'],['2corintios','2co','2cor'],['galatas','gl','gal','ga'],['efesios','ef','efe'],
['filipenses','fp','fil','flp'],['colossenses','colosenses','cl','col'],['1tessalonicenses','1tesalonicenses','1ts','1tes'],['2tessalonicenses','2tesalonicenses','2ts','2tes'],
['1timoteo','1tm','1ti','1tim'],['2timoteo','2tm','2ti','2tim'],['tito','tt','tit'],['filemom','filemon','fm','flm'],['hebreus','hebreos','hb','heb'],
['tiago','santiago','tg','stg','sant'],['1pedro','1pe','1pd','1ped'],['2pedro','2pe','2pd','2ped'],['1joao','1juan','1jo','1jn'],['2joao','2juan','2jo','2jn'],['3joao','3juan','3jo','3jn'],
['judas','jd','jud'],['apocalipse','apocalipsis','ap','apoc','apc']];
const BMAP={};BOOKS.forEach((a,i)=>a.forEach(n=>{if(BMAP[n]===undefined)BMAP[n]=i}));
const ROMAN={i:'1',ii:'2',iii:'3'};
function cleanRef(t){return String(t||'').replace(/^[>“"«(\s]+|[”"»).;\s]+$/g,'').trim()}
function parseRef(txt){
  let r=cleanRef(txt).toLowerCase();if(/^jó(?=\s)/.test(r))r=r.replace(/^jó/,'job');
  r=norm(r).replace(/^(san|s\.)\s+/,'').replace(/\./g,' ').replace(/\s+/g,' ').trim();
  const m=r.match(/^((?:[1-3]|i{1,3})\s*)?([a-z]+(?:\s+de\s+los\s+[a-z]+)?)\s+(\d{1,3})(?:\s*[:.]\s*(\d{1,3})((?:\s*[-–,]\s*\d{1,3})*))?$/);
  if(!m)return null;
  const num=m[1]?(ROMAN[m[1].trim()]||m[1].trim()):'';const name=m[2].replace(/\s+/g,'');
  let b=BMAP[num+name];if(b===undefined&&!num)b=BMAP[name];if(b===undefined)return null;
  const ch=+m[3];if(!m[4])return{b,ch,vs:null};
  const vs=[];let last=+m[4];vs.push(last);
  (m[5]||'').replace(/([-–,])\s*(\d{1,3})/g,(_,op,n)=>{n=+n;if(op===','){vs.push(n)}else{for(let x=last+1;x<=n&&x<last+80;x++)vs.push(x)}last=n;return''});
  return{b,ch,vs};
}
const RX_REF=/^((?:[1-3]|i{1,3})\s*)?[A-Za-zÀ-ÿ]{2,}\.?(?:\s+de\s+[A-Za-zÀ-ÿ]+)?\s+\d{1,3}\s*[:.]\s*\d{1,3}(?:\s*[-–,]\s*\d{1,3})*$/i;
function isRef(t){const c=cleanRef(t);return RX_REF.test(c)&&!!parseRef(c)}
const BIB={},BIBP={};
const VFILE={es:'es-rv1909',pt:'pt-livre',es65:'es-rv1865',ptr:'pt-livretr',nva:'pt-nva',grc:'grc-tr',hbo:'hbo-wlc'};
const VNAME={es:'Reina-Valera 1909',pt:'Bíblia Livre',es65:'Reina-Valera 1865',ptr:'Bíblia Livre TR',nva:'Nova Versão de Acesso Livre',grc:'Textus Receptus',hbo:'Códice de Leningrado'};
const vkey=l=>VFILE[l]?l:(l==='pt'?'pt':'es');
function loadBible(l){l=vkey(l);if(BIB[l])return Promise.resolve(BIB[l]);
  if(!BIBP[l])BIBP[l]=fetch('biblia/'+VFILE[l]+'.json').then(r=>{if(!r.ok)throw new Error('bible');return r.json()}).then(d=>BIB[l]=d).catch(e=>{BIBP[l]=null;throw e});
  return BIBP[l]}
function bibleText(ref,l){const B=BIB[vkey(l)];if(!B)return'';const p=parseRef(ref);if(!p||!p.vs)return'';const c=(B[p.b]||[])[p.ch-1];if(!c)return'';
  const parts=p.vs.map(v=>c[v-1]?{v,t:c[v-1]}:null).filter(Boolean);if(!parts.length)return'';
  return parts.length===1?parts[0].t:parts.map(x=>`${x.v} ${x.t}`).join(' ')}
function refName(b,ch,vs,l){const name=t('books',null,l)[b];if(!vs||!vs.length)return`${name} ${ch}`;
  const s=[...vs].sort((a,b)=>a-b);const out=[];let a=s[0],p=s[0];for(let i=1;i<=s.length;i++){if(s[i]===p+1){p=s[i];continue}out.push(a===p?`${a}`:`${a}-${p}`);a=p=s[i]}
  return`${name} ${ch}:${out.join(',')}`}
const verLabel=l=>VNAME[vkey(l)];
/* pronunciación aproximada */
const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','φ':'f','χ':'j','ψ':'ps','ω':'o'};
function translitGr(t){t=t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  return t.replace(/ου/g,'u').replace(/αυ/g,'au').replace(/ευ/g,'eu').replace(/γγ/g,'ng').replace(/γκ/g,'nk').replace(/[α-ως]/g,c=>GRK[c]??c)}
const HC={'א':'','ב':'v','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'j','ט':'t','י':'y','כ':'j','ך':'j','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'','פ':'f','ף':'f','צ':'ts','ץ':'ts','ק':'k','ר':'r','ש':'sh','ת':'t'};
const HV={'ֱ':'e','ֲ':'a','ֳ':'o','ִ':'i','ֵ':'e','ֶ':'e','ַ':'a','ָ':'a','ֹ':'o','ֺ':'o','ֻ':'u','ׇ':'o'};
function translitHe(t){t=t.replace(/[֑-ֽֿ֯׀ׅׄ\/]/g,'');let out='',wordStart=true;
  for(let i=0;i<t.length;i++){const c=t[i];
    if(HC[c]!==undefined){let marks='';let j=i+1;while(j<t.length&&/[ְ-ׇ]/.test(t[j])){marks+=t[j];j++}
      const dag=marks.includes('ּ');let base=HC[c];
      if(dag&&(c==='ב'))base='b';if(dag&&(c==='כ'||c==='ך'))base='k';if(dag&&(c==='פ'||c==='ף'))base='p';
      if(c==='ש'&&marks.includes('ׂ'))base='s';
      if(c==='י'&&!marks&&/[ie]$/.test(out))base='';
      if(c==='ו'&&marks.includes('ֹ')&&!/[ְ-ֻ]/.test(marks.replace('ֹ','')))base='o',marks=marks.replace('ֹ','');
      if(c==='ו'&&dag&&!/[ְ-ֻ]/.test(marks))base='u';
      let v='';for(const m of marks){if(HV[m])v+=HV[m];else if(m==='ְ'&&wordStart)v+='e'}
      out+=base+v;wordStart=false;i=j-1;continue}
    if(c==='־'){out+='-';wordStart=true;continue}
    if(c==='׃'){out+='.';continue}
    if(/\s/.test(c)){out+=' ';wordStart=true;continue}
  }
  return out.replace(/\s+/g,' ').trim()}
/* ---------- Diccionario Strong (griego y hebreo) ---------- */
const STR={g:null,h:null},STRP={};
function loadStrong(k){if(STR[k])return Promise.resolve(STR[k]);
  if(!STRP[k])STRP[k]=fetch('biblia/strong-'+(k==='g'?'gr':'he')+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
    const es={};if(k==='g')Object.values(d.f).forEach(v=>{if(Array.isArray(v)&&v[1]){const s=(es[v[0]]=es[v[0]]||new Set());s.add(v[1].toLowerCase())}});
    d.es=d.e||{};d.ix=Object.entries(d.d).map(([n,e])=>[n,' '+[normG(e[0]),normH(e[0]),norm(e[1]),norm(e[2]),norm(e[3]),norm([...(es[n]||[]),...((d.e||{})[n]||[])].join(' '))].join(' ')+' ']);
    return STR[k]=d}).catch(e=>{STRP[k]=null;throw e});
  return STRP[k]}
function normG(w){return (w||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ς/g,'σ').replace(/[^\u0370-\u03ff]/g,'')}
function normH(w){return (w||'').normalize('NFC').replace(/[\/\\]/g,'').replace(/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C3-\u05C6\u05F3\u05F4\u200D\u034F\u05BE]/g,'').replace(/[^\u0590-\u05FF]/g,'')}
function origWords(tx,k){return tx.split(k==='h'?/([\s\u05be]+)/:/(\s+)/).map(w=>/^[\s\u05be]*$/.test(w)?esc(w):`<button class="ow" data-ow="${esc(w)}" data-k="${k}">${esc(w)}</button>`).join('')}
function strongFind(k,w){const d=STR[k];if(!d)return null;const f=d.f[k==='g'?normG(w):normH(w)];if(f==null)return null;return Array.isArray(f)?{n:f[0],ctx:f[1]}:{n:f}}
const sRef=(k,n)=>(k==='g'?'G':'H')+n;
function strongLinks(txt){return esc(txt).replace(/\b([GH])0*(\d{1,4})\b/g,(m,a,n)=>`<button class="lnk sref" data-sref="${a}${n}">${a}${n}</button>`)}
/* Significados en el idioma del app: primero los preparados (biblia/strong-es|pt.json), luego los ya traducidos en este celular, y si no, traducción automática que queda guardada */
const LXB={},LXBP={};
function lxLang(){return prefs.ui==='pt'?'pt':'es'}
function loadLxBuilt(L){if(LXB[L])return Promise.resolve(LXB[L]);if(!LXBP[L])LXBP[L]=fetch('biblia/strong-'+L+'.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(d=>LXB[L]=d||{});return LXBP[L]}
function lxCache(L){try{return JSON.parse(localStorage.getItem('mp.lxc.'+L)||'{}')}catch(e){return{}}}
function lxSave(L,key,val){try{const c=lxCache(L);c[key]=val;const ks=Object.keys(c);if(ks.length>3000)ks.slice(0,500).forEach(x=>delete c[x]);localStorage.setItem('mp.lxc.'+L,JSON.stringify(c))}catch(e){}}
async function lxGet(key,en,L){if(!en)return'';const b=(LXB[L]||await loadLxBuilt(L))[key];if(b)return b;const c=lxCache(L)[key];if(c)return c;
  if(!navigator.onLine)return null;try{const v=await enTranslate(en,L);if(v&&v!==en){lxSave(L,key,v);return v}}catch(e){}return null}
const DER={es:[[/\bfrom the same as\b/g,'de lo mismo que'],[/\bfrom\b/g,'de'],[/\band\b/g,'y'],[/\bor\b/g,'o'],[/\ba primitive root\b/g,'raíz primitiva'],[/\ba primitive word\b/g,'palabra primitiva'],[/\ba primary verb\b/g,'verbo primario'],[/\ba primary particle\b/g,'partícula primaria'],[/\ba primary word\b/g,'palabra primaria'],[/\bof Hebrew origin\b/g,'de origen hebreo'],[/\bof Chaldee origin\b/g,'de origen arameo'],[/\bof Latin origin\b/g,'de origen latino'],[/\bof foreign origin\b/g,'de origen extranjero'],[/\bof uncertain affinity\b/g,'de afinidad incierta'],[/\bof uncertain derivation\b/g,'de derivación incierta'],[/\bcorresponding to\b/g,'correspondiente a'],[/\(Aramaic\)/g,'(arameo)'],[/\bprobably\b/g,'probablemente'],[/\bperhaps\b/g,'quizás'],[/\bapparently\b/g,'aparentemente'],[/\bakin to\b/g,'afín a'],[/\ba prolonged form of\b/g,'forma prolongada de'],[/\bthe same as\b/g,'lo mismo que'],[/\bfeminine of\b/g,'femenino de'],[/\bplural of\b/g,'plural de'],[/\bcompare\b/gi,'compárese'],[/\bin the sense of\b/g,'en el sentido de'],[/\bthrough the idea of\b/g,'por la idea de'],[/\bthe base of\b/g,'la base de'],[/\bas if\b/g,'como si'],[/\bmasculine\b/g,'masculino'],[/\bneuter\b/g,'neutro'],[/\bpassive\b/g,'pasivo']],
  pt:[[/\bfrom the same as\b/g,'do mesmo que'],[/\bfrom\b/g,'de'],[/\band\b/g,'e'],[/\bor\b/g,'ou'],[/\ba primitive root\b/g,'raiz primitiva'],[/\ba primitive word\b/g,'palavra primitiva'],[/\ba primary verb\b/g,'verbo primário'],[/\ba primary particle\b/g,'partícula primária'],[/\ba primary word\b/g,'palavra primária'],[/\bof Hebrew origin\b/g,'de origem hebraica'],[/\bof Chaldee origin\b/g,'de origem aramaica'],[/\bof Latin origin\b/g,'de origem latina'],[/\bof foreign origin\b/g,'de origem estrangeira'],[/\bof uncertain affinity\b/g,'de afinidade incerta'],[/\bof uncertain derivation\b/g,'de derivação incerta'],[/\bcorresponding to\b/g,'correspondente a'],[/\(Aramaic\)/g,'(aramaico)'],[/\bprobably\b/g,'provavelmente'],[/\bperhaps\b/g,'talvez'],[/\bapparently\b/g,'aparentemente'],[/\bakin to\b/g,'afim a'],[/\ba prolonged form of\b/g,'forma prolongada de'],[/\bthe same as\b/g,'o mesmo que'],[/\bfeminine of\b/g,'feminino de'],[/\bplural of\b/g,'plural de'],[/\bcompare\b/gi,'compare'],[/\bin the sense of\b/g,'no sentido de'],[/\bthrough the idea of\b/g,'pela ideia de'],[/\bthe base of\b/g,'a base de'],[/\bas if\b/g,'como se'],[/\bmasculine\b/g,'masculino'],[/\bneuter\b/g,'neutro'],[/\bpassive\b/g,'passivo']]};
function derLocal(txt,L){let o=txt||'';for(const [a,b] of DER[L])o=o.replace(a,b);return o}
const EN_TR={};
async function enTranslate(text,to){const key=to+'|'+text;if(EN_TR[key])return EN_TR[key];const out=[];
  for(const ch of splitChunks(text)){const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(ch)}&langpair=en|${to==='pt'?'pt-BR':'es'}${prefs.mmEmail?'&de='+encodeURIComponent(prefs.mmEmail):''}`;
    const r=await fetch(url);if(!r.ok)throw 0;const j=await r.json();out.push(j&&j.responseData&&j.responseData.translatedText||ch)}
  return EN_TR[key]=out.join(' ')}
async function toEnglish(q,from){const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from==='pt'?'pt-BR':'es'}|en${prefs.mmEmail?'&de='+encodeURIComponent(prefs.mmEmail):''}`;
  const r=await fetch(url);if(!r.ok)throw 0;const j=await r.json();return (j&&j.responseData&&j.responseData.translatedText||'').toLowerCase()}
document.addEventListener('click',e=>{const b=e.target.closest('.ow');if(!b)return;const k=b.dataset.k;
  loadStrong(k).then(()=>{const f=strongFind(k,b.dataset.ow);if(!f){toast(t('dict_nf'));return}dxOpenLex(k,+f.n)}).catch(()=>toast(t('dict_err')))});
/* =========================================================
   Diccionarios: Bíblico · Hebreo · Griego
   Datos: STEPBible (CC BY 4.0), Strong (Open Scriptures, CC BY-SA), Easton/Smith/Hitchcock (dominio público, NEUU CC BY 4.0)
   ========================================================= */
const DXT={es:{
  dx_t:'Diccionarios',dx_ed:'Consultar diccionarios',dx_b:'Diccionario Bíblico',dx_h:'Diccionario Hebreo',dx_g:'Diccionario Griego',
  dx_bd:'Personajes, lugares, acontecimientos, costumbres y conceptos de la Biblia.',dx_hd:'Las palabras originales del Antiguo Testamento.',dx_gd:'Las palabras originales del Nuevo Testamento.',
  dx_bn:'{n} artículos',dx_wn:'{n} palabras',dx_fav:'Favoritos',dx_hist:'Historial',dx_hclr:'Borrar historial',dx_nofav:'Todavía no guardó favoritos. Abra una palabra y toque la estrella.',dx_nohist:'Sus búsquedas aparecerán aquí.',
  dx_ph_b:'Buscar persona, lugar, tema…',dx_ph_h:'Palabra en español, portugués, hebreo o H7225',dx_ph_g:'Palabra en español, portugués, griego o G26',
  dx_hint_b:'Busque por nombre (Moisés, Jerusalén), tema (gracia, pacto) o costumbre (Pascua, diezmo).',dx_hint_l:'Busque por palabra en español o portugués, por la palabra original o por el número de Strong.',
  dx_load:'Cargando el diccionario…',dx_err:'No se pudo cargar. Revise la conexión.',dx_none:'Sin resultados.',dx_more:'Buscando también en inglés…',
  dx_na:'No disponible en las fuentes.',dx_tr:'Traducción',dx_cat:'Categoría gramatical',dx_pron:'Pronunciación',dx_pron_n:'La sílaba tónica va en mayúsculas.',dx_pron_g:'El acento marca la sílaba tónica.',
  dx_mean:'Significados',dx_mean_n:'Una misma palabra puede tener sentidos distintos según el pasaje. Lea el contexto de cada texto.',dx_ctx:'Cómo se traduce según el contexto',dx_ctx_n:'Veces que aparece con cada sentido en la Biblia.',
  dx_root:'Raíz y formación',dx_strong:'Definición de Strong',dx_kjv:'Usos en la traducción',dx_hist_c:'Contexto histórico y cultural',dx_hist_na:'Las fuentes léxicas no traen contexto histórico para esta palabra.',
  dx_refs:'Referencias bíblicas',dx_refs_n:'Aparece {n} veces.',dx_all:'Ver todas ({n})',dx_ex:'Ejemplos de uso',dx_ex_as:'traducida como «{s}»',dx_past:'Explicación pastoral',dx_past_n:'Escrita por Meu Púlpito a partir de los léxicos.',
  dx_src:'Fuente',dx_auto:'Traducción automática del inglés. El texto original está abajo.',dx_auto_w:'Traduciendo…',dx_orig:'Ver texto original (inglés)',dx_off:'Sin conexión: se muestra el texto original en inglés.',
  dx_def:'Definición',dx_name:'Significado del nombre',dx_other:'Otra fuente: Smith',dx_deep:'Textos para profundizar',dx_rel:'Relacionados',dx_lexw:'Palabras originales',
  dx_ai:'Estudio guiado con IA',dx_ai_btn:'Explicar con IA',dx_ai_lbl:'Generado por IA a partir de las fuentes. Revíselo antes de usarlo.',dx_ai_need:'Para el estudio guiado con IA, agregue su clave en Configuración.',
  dx_copy:'Copiar',dx_ins:'Insertar en el sermón',dx_ins_ok:'Insertado en el sermón',dx_faved:'Guardado en favoritos',dx_unfav:'Quitado de favoritos',dx_back:'Diccionarios',dx_x:'Quitar',
  dx_v:'verbo',dx_n:'sustantivo',dx_a:'adjetivo',dx_adv:'adverbio',dx_prep:'preposición',dx_conj:'conjunción',dx_part:'partícula',dx_intj:'interjección',dx_pron_d:'pronombre demostrativo',dx_pron_p:'pronombre personal',dx_pron_r:'pronombre relativo',dx_pron_i:'pronombre interrogativo',dx_neg:'negación',dx_cond:'condicional',dx_art:'artículo',dx_num:'numeral',dx_pron_x:'pronombre',
  dx_m:'masculino',dx_f:'femenino',dx_nt:'neutro',dx_np:'nombre propio',dx_per:'persona',dx_loc:'lugar',dx_grp:'pueblo o grupo',dx_lh:'hebreo',dx_la:'arameo',dx_lg:'griego',dx_x_times:'{n}×',
  dx_preg:'Meu Púlpito',dx_lexsrc:'Léxico',dx_p_src:'Escrito por Meu Púlpito en español y portugués, con base en los léxicos hebreo y griego.'
},pt:{
  dx_t:'Dicionários',dx_ed:'Consultar dicionários',dx_b:'Dicionário Bíblico',dx_h:'Dicionário Hebraico',dx_g:'Dicionário Grego',
  dx_bd:'Personagens, lugares, acontecimentos, costumes e conceitos da Bíblia.',dx_hd:'As palavras originais do Antigo Testamento.',dx_gd:'As palavras originais do Novo Testamento.',
  dx_bn:'{n} artigos',dx_wn:'{n} palavras',dx_fav:'Favoritos',dx_hist:'Histórico',dx_hclr:'Apagar histórico',dx_nofav:'Você ainda não salvou favoritos. Abra uma palavra e toque na estrela.',dx_nohist:'Suas buscas vão aparecer aqui.',
  dx_ph_b:'Buscar pessoa, lugar, tema…',dx_ph_h:'Palavra em português, espanhol, hebraico ou H7225',dx_ph_g:'Palavra em português, espanhol, grego ou G26',
  dx_hint_b:'Busque por nome (Moisés, Jerusalém), tema (graça, aliança) ou costume (Páscoa, dízimo).',dx_hint_l:'Busque por palavra em português ou espanhol, pela palavra original ou pelo número de Strong.',
  dx_load:'Carregando o dicionário…',dx_err:'Não foi possível carregar. Confira a conexão.',dx_none:'Nenhum resultado.',dx_more:'Buscando também em inglês…',
  dx_na:'Não disponível nas fontes.',dx_tr:'Tradução',dx_cat:'Categoria gramatical',dx_pron:'Pronúncia',dx_pron_n:'A sílaba tônica está em maiúsculas.',dx_pron_g:'O acento marca a sílaba tônica.',
  dx_mean:'Significados',dx_mean_n:'Uma mesma palavra pode ter sentidos diferentes conforme a passagem. Leia o contexto de cada texto.',dx_ctx:'Como é traduzida conforme o contexto',dx_ctx_n:'Vezes que aparece com cada sentido na Bíblia.',
  dx_root:'Raiz e formação',dx_strong:'Definição de Strong',dx_kjv:'Usos na tradução',dx_hist_c:'Contexto histórico e cultural',dx_hist_na:'As fontes léxicas não trazem contexto histórico para esta palavra.',
  dx_refs:'Referências bíblicas',dx_refs_n:'Aparece {n} vezes.',dx_all:'Ver todas ({n})',dx_ex:'Exemplos de uso',dx_ex_as:'traduzida como «{s}»',dx_past:'Explicação pastoral',dx_past_n:'Escrita pelo Meu Púlpito a partir dos léxicos.',
  dx_src:'Fonte',dx_auto:'Tradução automática do inglês. O texto original está abaixo.',dx_auto_w:'Traduzindo…',dx_orig:'Ver texto original (inglês)',dx_off:'Sem conexão: aparece o texto original em inglês.',
  dx_def:'Definição',dx_name:'Significado do nome',dx_other:'Outra fonte: Smith',dx_deep:'Textos para aprofundar',dx_rel:'Relacionados',dx_lexw:'Palavras originais',
  dx_ai:'Estudo guiado com IA',dx_ai_btn:'Explicar com IA',dx_ai_lbl:'Gerado por IA a partir das fontes. Revise antes de usar.',dx_ai_need:'Para o estudo guiado com IA, coloque sua chave em Configurações.',
  dx_copy:'Copiar',dx_ins:'Inserir no sermão',dx_ins_ok:'Inserido no sermão',dx_faved:'Salvo nos favoritos',dx_unfav:'Removido dos favoritos',dx_back:'Dicionários',dx_x:'Remover',
  dx_v:'verbo',dx_n:'substantivo',dx_a:'adjetivo',dx_adv:'advérbio',dx_prep:'preposição',dx_conj:'conjunção',dx_part:'partícula',dx_intj:'interjeição',dx_pron_d:'pronome demonstrativo',dx_pron_p:'pronome pessoal',dx_pron_r:'pronome relativo',dx_pron_i:'pronome interrogativo',dx_neg:'negação',dx_cond:'condicional',dx_art:'artigo',dx_num:'numeral',dx_pron_x:'pronome',
  dx_m:'masculino',dx_f:'feminino',dx_nt:'neutro',dx_np:'nome próprio',dx_per:'pessoa',dx_loc:'lugar',dx_grp:'povo ou grupo',dx_lh:'hebraico',dx_la:'aramaico',dx_lg:'grego',dx_x_times:'{n}×',
  dx_preg:'Meu Púlpito',dx_lexsrc:'Léxico',dx_p_src:'Escrito pelo Meu Púlpito em português e espanhol, com base nos léxicos hebraico e grego.'
}};
Object.keys(DXT).forEach(l=>Object.assign(I18N[l],DXT[l]));

const DX={k:null,view:'hub',q:{b:'',h:'',g:''},en:{},busy:false,err:{},ctx:null};
const lxFile=k=>k==='h'?'he':'gr';
const nWords=x=>' '+norm(x).replace(/[^a-z0-9]+/g,' ').trim()+' ';
const LXI={},LXIP={},LXC={},LXCP={};
function lxIdx(k){if(LXI[k])return Promise.resolve(LXI[k]);
  if(!LXIP[k])LXIP[k]=fetch('biblia/lex/'+lxFile(k)+'-idx.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{d.by={};
    d.ix=d.e.map(r=>{d.by[r[0]]=r;return{o:k==='h'?normH(r[1]):normG(r[1]),tr:norm(r[2]).replace(/[^a-z]/g,''),en:nWords(r[4]),es:nWords(r[5]),pt:nWords(r[6]),kw:nWords(r[8])}});return LXI[k]=d}).catch(e=>{LXIP[k]=null;throw e});
  return LXIP[k]}
function lxChunk(k,n){const c=lxFile(k)+'-'+Math.floor(n/500);if(LXC[c])return Promise.resolve(LXC[c]);
  if(!LXCP[c])LXCP[c]=fetch('biblia/lex/'+c+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>LXC[c]=d).catch(e=>{LXCP[c]=null;throw e});return LXCP[c]}
function lxSearch(k,q){const d=LXI[k];if(!d)return[];q=q.trim();if(!q)return[];
  const m=q.match(/^[GHgh]?\s*0*(\d{1,4})[a-z]?$/);if(m){const r=d.by[+m[1]];return r?[r]:[]}
  const out=[];const L=lxLang();
  if(/[֐-׿Ͱ-Ͽἀ-῿]/.test(q)){const o=k==='h'?normH(q):normG(q);if(!o)return[];
    d.ix.forEach((x,i)=>{if(x.o===o)out.push([i,9]);else if(o.length>1&&x.o.startsWith(o))out.push([i,5])})}
  else{const qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim();if(qn.length<2)return[];const en=DX.en[k+'|'+qn]||'';const tq=qn.replace(/ /g,'');
    const W=(f,full,pre)=>f.includes(' '+qn+' ')?full:(qn.length>2&&f.includes(' '+qn))?pre:0;
    d.ix.forEach((x,i)=>{let s=Math.max(W(L==='pt'?x.pt:x.es,9,5),W(L==='pt'?x.es:x.pt,8,4),W(x.kw,7,3),x.tr===tq?7:0,W(x.en,4,2));
      if(en&&x.en.includes(' '+en+' '))s=Math.max(s,6);if(s)out.push([i,s])})}
  const top=out.some(x=>x[1]>=6)?out.filter(x=>x[1]>=4):out;
  return top.sort((a,b)=>b[1]-a[1]||d.e[b[0]][7]-d.e[a[0]][7]).slice(0,60).map(x=>d.e[x[0]])}
/* categoría gramatical a partir del código de STEPBible */
function lxCat(mo,L){if(!mo)return'';const c=mo.split('/')[0].trim();const [lang,code='']=c.split(':');const T=k=>t(k,null,L);
  const lg={H:'dx_lh',A:'dx_la',G:'dx_lg'}[lang];const p=code.split('-');const b=p[0];
  if(lang==='N'){const k=(p[2]||'');const what=k.startsWith('P')?T('dx_per'):k.startsWith('L')?T('dx_loc'):'';return T('dx_np')+(what?' · '+what:'')+(k.endsWith('G')?' ('+T('dx_grp')+')':'')+(p[1]==='M'?' · '+T('dx_m'):p[1]==='F'?' · '+T('dx_f'):'')}
  const M={V:'dx_v',N:'dx_n',A:'dx_a',ADV:'dx_adv',Adv:'dx_adv',PREP:'dx_prep',Prep:'dx_prep',CONJ:'dx_conj',Conj:'dx_conj',PRT:'dx_part',Part:'dx_part',INJ:'dx_intj',Intj:'dx_intj',D:'dx_pron_d',DemP:'dx_pron_d',P:'dx_pron_p',PerP:'dx_pron_p',R:'dx_pron_r',RelP:'dx_pron_r',Q:'dx_pron_i',I:'dx_pron_i',Intg:'dx_pron_i',Neg:'dx_neg',COND:'dx_cond',Cond:'dx_cond',T:'dx_art',K:'dx_pron_x',S:'dx_pron_x',F:'dx_pron_x',C:'dx_pron_x',X:'dx_pron_x',IndP:'dx_pron_x'}[b];
  if(!M)return lg?T(lg):'';let s=T(M);if(b==='PRT'&&p[1]==='N')s=T('dx_neg');if(b==='A'&&/NUI/.test(p[1]||''))s=T('dx_num');
  const g=(p[1]||'').split('/')[0];if(b==='N'||b==='A'&&g.length===1){s+=g==='M'?' '+T('dx_m'):g==='F'?' '+T('dx_f'):g==='N'?' '+T('dx_nt'):''}
  return s+(lg?' · '+T(lg):'')}
/* pronunciación: sílabas de STEPBible con la tónica marcada por Strong */
function lxPron(k,tr,spron){if(k==='g')return'';const sy=(tr||'').split('.').filter(Boolean);if(!sy.length)return'';
  const sp=(spron||'').split(/[-\s]+/).filter(Boolean);const st=sp.findIndex(x=>x.includes("'"));
  return sy.map((x,i)=>sp.length===sy.length&&i===st?x.toUpperCase():x).join('·')}
const refStr=(r,L)=>easRefStr(r,L);
function easRefStr(r,L){const m=String(r).match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);if(!m)return'';const a=+m[3],z=m[4]?+m[4]:a;const vs=[];for(let v=a;v<=z&&vs.length<30;v++)vs.push(v);return refName(+m[1],+m[2],vs,L)}
function refTags(refs,L,max=24){const s=refs.map(r=>refStr(r,L)).filter(Boolean);if(!s.length)return'';
  const tag=x=>`<button class="tag eref" data-eref="${esc(x)}">${esc(x)}</button>`;
  return`<div class="sd-es">${s.slice(0,max).map(tag).join('')}${s.length>max?`<button class="tag dx-all" data-dx="all">${esc(t('dx_all',{n:s.length}))}</button><span class="dx-rest" hidden>${s.slice(max).map(tag).join('')}</span>`:''}</div>`}
/* Bíblico: Easton + Smith + Hitchcock (índice + un archivo por letra) */
let BIX=null,BIXP=null;const BCH={},BCHP={};
function bibIdx(){if(BIX)return Promise.resolve(BIX);
  if(!BIXP)BIXP=Promise.all([fetch('biblia/bib/idx.json').then(r=>{if(!r.ok)throw 0;return r.json()}),fetch('biblia/bib/alias.json').then(r=>r.ok?r.json():{}).catch(()=>({}))]).then(([d,a])=>{
    d.al={};Object.entries(a).forEach(([k,v])=>d.al[norm(k).trim()]=v);d.nn=d.e.map(r=>nWords(r[0]));d.byName={};d.e.forEach((r,i)=>d.byName[r[0].toLowerCase()]=i);return BIX=d}).catch(e=>{BIXP=null;throw e});return BIXP}
const bLetter=n=>{const c=norm(n).charAt(0);return c>='a'&&c<='z'?c:'0'};
function bibChunk(name){const L=bLetter(name);if(BCH[L])return Promise.resolve(BCH[L]);if(!BCHP[L])BCHP[L]=fetch('biblia/bib/'+L+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>BCH[L]=d).catch(e=>{BCHP[L]=null;throw e});return BCHP[L]}
function bibSearch(q){const d=BIX;if(!d)return[];const qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim();if(qn.length<2)return[];
  const terms=[qn,d.al[qn]?norm(d.al[qn]):'',DX.en['b|'+qn]||''].filter(Boolean).map(x=>x.replace(/[^a-z0-9]+/g,' ').trim()).filter(x=>x.length>1);
  const out=[];d.nn.forEach((nm,i)=>{let sc=0;for(const tm of terms){if(nm===' '+tm+' ')sc=Math.max(sc,6);else if(nm.startsWith(' '+tm))sc=Math.max(sc,5);else if(tm.length>2&&nm.includes(' '+tm))sc=Math.max(sc,3)}if(sc)out.push([i,sc])});
  return out.sort((a,b)=>b[1]-a[1]||d.e[b[0]][1]-d.e[a[0]][1]).slice(0,50).map(x=>x[0])}
/* Diccionario del predicador (escrito en ES/PT): va primero en el Bíblico y aparece como explicación pastoral en hebreo/griego */
let PREG=null,PREGP=null;
function loadPreg(){if(PREG)return Promise.resolve(PREG);if(!PREGP)PREGP=fetch('biblia/dic-pregador.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
    d.ix=d.e.map(e=>[[e[0],...e[6]].map(norm),[e[1],...e[7]].map(norm)]);d.byN={};d.e.forEach((e,i)=>e[4].forEach(o=>{(d.byN[o[0]]=d.byN[o[0]]||[]).push([i,o])}));return PREG=d}).catch(e=>{PREGP=null;throw e});return PREGP}
function pregSearch(q){if(!PREG)return[];const qn=norm(q.trim());if(qn.length<2)return[];const out=[];
  PREG.ix.forEach((ix,i)=>{const sc=ws=>Math.max(0,...ws.map(w=>w===qn?6:w.startsWith(qn)?5:(qn.length>2&&w.split(' ').some(x=>x.startsWith(qn)))?3:0));const s=Math.max(sc(ix[0]),sc(ix[1]));if(s)out.push([i,s])});
  return out.sort((x,y)=>y[1]-x[1]).slice(0,12).map(x=>x[0])}

/* ---------- favoritos e historial (en la cuenta: meta.dicFav / meta.dicHist) ---------- */
const dxFavs=()=>Array.isArray(meta.dicFav)?meta.dicFav:(meta.dicFav=[]);
const dxHists=()=>Array.isArray(meta.dicHist)?meta.dicHist:(meta.dicHist=[]);
const dxIsFav=(k,id)=>dxFavs().some(f=>f.k===k&&String(f.id)===String(id));
function dxFavToggle(it){const F=dxFavs();const i=F.findIndex(f=>f.k===it.k&&String(f.id)===String(it.id));if(i>=0){F.splice(i,1);toast(t('dx_unfav'))}else{F.unshift(Object.assign({at:Date.now()},it));if(F.length>300)F.length=300;toast(t('dx_faved'))}putMeta();return i<0}
function dxHistAdd(k,q){q=String(q||'').trim();if(q.length<2)return;const H=dxHists();const i=H.findIndex(x=>x.k===k&&norm(x.q)===norm(q));if(i>=0)H.splice(i,1);H.unshift({k,q,at:Date.now()});if(H.length>60)H.length=60;putMeta()}

/* ---------- pantalla ---------- */
const DXK=[['b','dx_b','dx_bd'],['h','dx_h','dx_hd'],['g','dx_g','dx_gd']];
const dxGlyph={b:ic('bible'),h:'<span lang="he">א</span>',g:'<span lang="grc">Ω</span>'};
function dxHtml(){const inEd=DX.ctx==='ed';
  if(DX.view==='dic'&&DX.k)return dxDicHtml(DX.k);
  const head=inEd?`<div class="between"><h3>${esc(t('dx_ed'))}</h3><button class="iconbtn" data-dx="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>`:`<h1 class="h">${esc(t('dx_t'))}</h1>`;
  if(DX.view==='fav'||DX.view==='hist')return head+dxListHtml(DX.view);
  const F=dxFavs(),H=dxHists();
  return`${head}<div class="dx-tiles">${DXK.map(([k,tl,d])=>`<button class="dx-tile" data-dx="go" data-k="${k}"><span class="dx-gl dx-gl-${k}">${dxGlyph[k]}</span><span class="dx-tt">${esc(t(tl))}</span><span class="dx-td">${esc(t(d))}</span><span class="dx-go">${ic('next')}</span></button>`).join('')}</div>
   <div class="dx-two"><button class="dx-mini" data-dx="view" data-v="fav">${ic('star')}<span>${esc(t('dx_fav'))}</span><b>${F.length}</b></button><button class="dx-mini" data-dx="view" data-v="hist">${ic('undo')}<span>${esc(t('dx_hist'))}</span><b>${H.length}</b></button></div>
   ${H.length?`<div class="sd-es">${H.slice(0,8).map((h,i)=>`<span class="dx-hc"><button data-dx="hq" data-i="${i}"><small>${esc(h.k==='b'?'B':h.k==='h'?'H':'G')}</small>${esc(h.q)}</button><button data-dx="hdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('x')}</button></span>`).join('')}</div>`:''}`}
function dxListHtml(v){const L=dxHists(),F=dxFavs();const back=`<button class="lnk dx-back" data-dx="hub">${ic('back')}${esc(t('dx_back'))}</button>`;
  if(v==='fav')return back+`<h2 class="dx-h2">${esc(t('dx_fav'))}</h2>`+(F.length?`<div class="res">${F.map((f,i)=>`<div class="dx-row"><button data-dx="open" data-k="${f.k}" data-id="${esc(f.id)}"><b>${esc(t(f.k==='h'?'dx_h':f.k==='g'?'dx_g':'dx_b'))}</b><span ${f.k==='h'?'':''}>${esc(f.t)}</span>${f.s?`<small>${esc(f.s)}</small>`:''}</button><button class="iconbtn" data-dx="fdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('trash')}</button></div>`).join('')}</div>`:`<div class="empty"><p style="margin:0">${esc(t('dx_nofav'))}</p></div>`);
  return back+`<div class="between"><h2 class="dx-h2">${esc(t('dx_hist'))}</h2>${L.length?`<button class="lnk" data-dx="hclr">${esc(t('dx_hclr'))}</button>`:''}</div>`+(L.length?`<div class="res">${L.map((h,i)=>`<div class="dx-row"><button data-dx="hq" data-i="${i}"><b>${esc(t(h.k==='h'?'dx_h':h.k==='g'?'dx_g':'dx_b'))}</b><span>${esc(h.q)}</span><small>${esc(relDate(h.at))}</small></button><button class="iconbtn" data-dx="hdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('x')}</button></div>`).join('')}</div>`:`<div class="empty"><p style="margin:0">${esc(t('dx_nohist'))}</p></div>`)}
function dxDicHtml(k){const tl=k==='b'?'dx_b':k==='h'?'dx_h':'dx_g';
  return`<button class="lnk dx-back" data-dx="hub">${ic('back')}${esc(t('dx_back'))}</button>
   <div class="row"><span class="dx-gl dx-gl-${k} sm">${dxGlyph[k]}</span><h2 class="dx-h2" style="flex:1">${esc(t(tl))}</h2></div>
   <label class="search">${ic('search')}<input class="dx-q" type="search" value="${esc(DX.q[k])}" placeholder="${esc(t('dx_ph_'+k))}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>
   <div class="dx-res">${dxResHtml(k)}</div>
   <p class="sub dx-srcl">${esc(t('dx_src'))}: ${esc(k==='b'?"Easton (1897), Smith (1863), Hitchcock (1869) · Meu Púlpito":'STEPBible.org (Tyndale House, CC BY 4.0) · Strong')}</p>`}
function dxLoad(k){const p=k==='b'?Promise.all([bibIdx(),loadPreg()]):Promise.all([lxIdx(k),loadPreg()]);
  return p.then(()=>{DX.err[k]=false},()=>{DX.err[k]=true})}
function dxResHtml(k){const ready=k==='b'?!!BIX:!!LXI[k];const q=DX.q[k];const L=lxLang();
  if(!ready)return`<div class="empty"><p style="margin:0">${esc(t(DX.err[k]?'dx_err':'dx_load'))}</p>${DX.err[k]?`<button class="btn dark" data-dx="retry">${esc(t('go_on'))}</button>`:''}</div>`;
  if(!q.trim()){const H=dxHists().filter(h=>h.k===k).slice(0,8);return`<p class="sub" style="margin:0;line-height:1.55">${esc(t(k==='b'?'dx_hint_b':'dx_hint_l'))}</p>${H.length?`<div class="sd-es">${H.map(h=>`<span class="dx-hc"><button data-dx="hq" data-i="${dxHists().indexOf(h)}">${esc(h.q)}</button></span>`).join('')}</div>`:''}`}
  if(k==='b'){const pr=pregSearch(q);const r=bibSearch(q);const C=lxCache(L);
    const ph=pr.map(i=>{const e=PREG.e[i];const pt=L==='pt';const m=pt?e[2]:e[3];return`<button data-dx="open" data-k="p" data-id="${i}"><b>${esc(t('dx_preg'))}</b><span class="dx-ti">${esc(pt?e[0]:e[1])}</span><span>${esc(m.length>120?m.slice(0,120).replace(/\s+\S*$/,'')+'…':m)}</span></button>`}).join('');
    const qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim();const viaAl=BIX.al[qn]?BIX.al[qn].toLowerCase():'';
    const bh=r.map(i=>{const e=BIX.e[i];const tt=C['bt'+e[0]]||(viaAl===e[0].toLowerCase()?q.trim().replace(/^./,c=>c.toUpperCase()):'');const nm=e[2]?(C['bn'+e[0]]||''):'';return`<button data-dx="open" data-k="b" data-id="${esc(e[0])}"><span class="dx-ti">${esc(tt&&norm(tt)!==norm(e[0])?tt:e[0])}${tt&&norm(tt)!==norm(e[0])?` <small>· ${esc(e[0])}</small>`:''}</span>${nm?`<span><em>${esc(nm)}</em></span>`:''}${e[1]?`<small>${esc(t('dic_nref',{n:e[1]}))}</small>`:''}</button>`}).join('');
    if(!ph&&!bh)return`<div class="empty"><p style="margin:0">${esc(DX.busy?t('dx_more'):t('dx_none'))}</p></div>`;
    return`<div class="res">${ph}${bh}</div>`}
  const r=lxSearch(k,q);if(!r.length)return`<div class="empty"><p style="margin:0">${esc(DX.busy?t('dx_more'):t('dx_none'))}</p></div>`;
  return`<div class="res">${r.map(e=>{const g=(L==='pt'?e[6]:e[5])||'';return`<button data-dx="open" data-k="${k}" data-id="${e[0]}"><b><span class="sd-num sm">${k==='h'?'H':'G'}${e[0]}</span> ${esc(lxCat(e[3],L))}</b><span class="dx-lrow"><span class="dx-lem" ${k==='h'?'dir="rtl" lang="he"':'lang="grc"'}>${esc(e[1])}</span><span class="dx-trl">${esc(e[2].replace(/\./g,''))}</span></span><span>${g?esc(g):`<span class="sub">${esc(e[4])} (en)</span>`}${e[7]?` <small>· ${esc(t('dx_x_times',{n:e[7]}))}</small>`:''}</span></button>`}).join('')}</div>`}
async function dxQuery(host,k,q){DX.q[k]=q;DX.busy=false;const paint=()=>{const el=$('.dx-res',host);if(el)el.innerHTML=dxResHtml(k)};paint();
  const qq=q.trim();if(qq.length<3||/^[GHgh]?\s*\d/.test(qq)||/[Ͱ-Ͽ֐-׿ἀ-῿]/.test(qq)||!navigator.onLine)return;
  const qn=norm(qq).replace(/[^a-z0-9]+/g,' ').trim();if(DX.en[k+'|'+qn]!==undefined)return;
  const weak=k==='b'?!bibSearch(qq).length&&!pregSearch(qq).length:lxSearch(k,qq).length<3;if(!weak)return;
  DX.busy=true;paint();try{const en=await toEnglish(qq,lxLang());DX.en[k+'|'+qn]=norm(en).replace(/[^a-z0-9]+/g,' ').trim()}catch(e){DX.en[k+'|'+qn]=''}DX.busy=false;if(DX.q[k]===q)paint()}
function dxMount(host){host.innerHTML=dxHtml();
  if(DX.view==='dic'&&DX.k){const k=DX.k;const ready=k==='b'?BIX:LXI[k];if(!ready)dxLoad(k).then(()=>{if(host.isConnected&&DX.k===k){const el=$('.dx-res',host);if(el)el.innerHTML=dxResHtml(k)}})}
  if(host._dx)return;host._dx=1;
  host.addEventListener('input',e=>{const i=e.target.closest('.dx-q');if(!i)return;const k=DX.k,v=i.value;clearTimeout(i._t);i._t=setTimeout(()=>dxQuery(host,k,v),280)});
  host.addEventListener('keydown',e=>{const i=e.target.closest('.dx-q');if(i&&e.key==='Enter'){e.preventDefault();i.blur()}});
  host.addEventListener('click',e=>{const b=e.target.closest('[data-dx]');if(!b||!host.contains(b))return;e.preventDefault();const a=b.dataset.dx;
    if(a==='go'){DX.k=b.dataset.k;DX.view='dic';track('dic');dxMount(host);const i=$('.dx-q',host);if(i&&!('ontouchstart' in window))i.focus()}
    else if(a==='hub'){DX.view='hub';dxMount(host)}
    else if(a==='view'){DX.view=b.dataset.v;dxMount(host)}
    else if(a==='close'){closeSheet()}
    else if(a==='retry'){DX.err[DX.k]=false;dxMount(host)}
    else if(a==='open'){const k=b.dataset.k;if(DX.view==='dic'&&DX.k&&DX.q[DX.k])dxHistAdd(DX.k,DX.q[DX.k]);dxOpen(k,b.dataset.id)}
    else if(a==='hq'){const h=dxHists()[+b.dataset.i];if(!h)return;DX.k=h.k;DX.view='dic';DX.q[h.k]=h.q;dxMount(host);dxQuery(host,h.k,h.q)}
    else if(a==='hdel'){dxHists().splice(+b.dataset.i,1);putMeta();dxMount(host)}
    else if(a==='hclr'){meta.dicHist=[];putMeta();dxMount(host)}
    else if(a==='fdel'){dxFavs().splice(+b.dataset.i,1);putMeta();dxMount(host)}})}
function dxTabHtml(){return`<div id="dxHost" class="dx-host"></div>`}
function dxAfter(){const h=$('#dxHost');if(h){DX.ctx=null;dxMount(h)}}
/* desde el editor: el sermón queda abierto debajo */
function dxEditor(){if(!E)return;edSave();trackRange();DX.ctx='ed';
  const sh=openSheet(`<div class="dx-host"></div>`,{cls:'tall',onClose:()=>{DX.ctx=null}});dxMount($('.dx-host',sh))}

/* ---------- abrir una entrada ---------- */
function dxSec(title,body,cls=''){return`<section class="dx-sec ${cls}"><h4>${esc(title)}</h4>${body}</section>`}
const dxNA=(m)=>`<p class="dx-na">${esc(m||t('dx_na'))}</p>`;
function dxSheet(html){return openSheet(`<div class="dx-entry">${html}</div>`,{cls:'tall'})}
function dxActs(fav){return`<div class="dx-acts"><button class="btn sm ghost" data-x="copy">${ic('copy')}${esc(t('dx_copy'))}</button><button class="btn sm ghost dx-fav" data-x="fav" aria-pressed="${fav}">${ic('star')}${esc(t('dx_fav'))}</button>${DX.ctx==='ed'&&E?`<button class="btn sm gold" data-x="ins">${ic('plus')}${esc(t('dx_ins'))}</button>`:''}</div>`}
/* traduce un texto largo del inglés y lo pinta; el original queda disponible */
async function dxTrInto(sh,sel,key,en,L){const el=$(sel,sh);if(!el||!en)return'';const v=await lxGet(key,en,L);if(!sh.isConnected)return'';
  el.textContent=v||en;const n=el.parentNode.querySelector('.dx-note');if(n){n.textContent=t(v?'dx_auto':'dx_off');n.hidden=false}return v||en}
function dxWire(sh,o){sh.addEventListener('click',ev=>{const b=ev.target.closest('[data-eref]');if(b){compareRef(b.dataset.eref,null,lxLang());return}
  const s=ev.target.closest('[data-sref]');if(s){const r=s.dataset.sref;dxOpen(r[0]==='G'?'g':'h',r.slice(1));return}
  const al=ev.target.closest('[data-dx="all"]');if(al){const r=al.nextElementSibling;if(r){r.hidden=false;r.replaceWith(...r.childNodes)}al.remove();return}
  const rel=ev.target.closest('[data-rel]');if(rel){dxOpen(rel.dataset.k,rel.dataset.rel);return}
  const x=ev.target.closest('[data-x]');if(!x)return;const a=x.dataset.x;
  if(a==='close'){closeSheet();return}
  if(a==='copy'){copyText(o.text()).then(()=>toast(t('copied')))}
  else if(a==='fav'){const on=dxFavToggle(o.fav);x.setAttribute('aria-pressed',String(on))}
  else if(a==='ins'){const html=o.html();while($('.ov'))closeSheet();DX.ctx=null;insertHtmlAfterCaret(html);toast(t('dx_ins_ok'))}
  else if(a==='ai'){o.ai&&o.ai(x)}})}
function dxOpen(k,id){if(k==='p')return dxOpenPreg(+id);if(k==='b')return dxOpenBib(id);return dxOpenLex(k,+id)}

async function dxOpenLex(k,n){if(!dicQuota())return;const L=lxLang();let d,ch;try{[d,ch]=await Promise.all([lxIdx(k),lxChunk(k,n)])}catch(e){toast(t('dx_err'));return}
  const e=d.by[n];if(!e){toast(t('dict_nf'));return}const x=ch[n]||{me:'',s:[],r:[],rn:0,mr:[]};
  let S=null;try{S=(await loadStrong(k)).d[n]||null}catch(err){}
  let P=[];try{P=((await loadPreg()).byN[(k==='h'?'H':'G')+n]||[])}catch(err){}
  const [num,lem,tr,mo,gEN,gES,gPT,cnt]=e;const g=L==='pt'?gPT:gES;const id=(k==='h'?'H':'G')+num;const he=k==='h';
  const pron=he?lxPron(k,tr,S&&S[5]):(S&&S[1])||'';
  const cat=lxCat(mo,L);
  const senses=x.s||[];const sl=s=>L==='pt'?s[2]:s[1];
  const ex=senses.filter(s=>s[4]&&s[4].length).slice(0,3);
  const sh=dxSheet(`<div class="sd-head"><span class="sd-num">${id}</span><span class="sub">${esc(t(he?'dx_h':'dx_g'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <div class="sd-lemma" ${he?'dir="rtl" lang="he"':'lang="grc"'}>${esc(lem)}</div>
    <div class="sd-tr">${esc(tr.replace(/\./g,''))}${S&&S[1]&&norm(S[1])!==norm(tr.replace(/\./g,''))?` <span class="sub">· ${esc(S[1])}</span>`:''}</div>
    ${dxActs(dxIsFav(k,num))}
    ${dxSec(t('dx_tr'),g?`<p class="dx-big">${esc(g)}</p>`:dxNA()+`<p class="sub" style="margin:0">${esc(gEN)} (en)</p>`)}
    <div class="dx-grid">${dxSec(t('dx_cat'),cat?`<p class="sd-p">${esc(cat)}</p>`:dxNA())}${dxSec(t('dx_pron'),pron?`<p class="sd-p dx-pr">${esc(pron)}</p>${!he||/[A-Z]/.test(pron)?`<p class="dx-sm">${esc(t(he?'dx_pron_n':'dx_pron_g'))}</p>`:''}`:dxNA())}</div>
    ${P.length?dxSec(t('dx_past'),P.map(([i,o])=>`<div class="sd-box"><span class="lbl">${esc(L==='pt'?PREG.e[i][0]:PREG.e[i][1])}</span><p class="sd-p" style="margin:0">${esc(L==='pt'?o[3]:o[4])}</p></div>`).join('')+`<p class="dx-sm">${esc(t('dx_past_n'))}</p>`):''}
    ${dxSec(t('dx_mean'),x.me?`<p class="sd-p dx-pre" id="dxMe"><span class="sub">${esc(t('dx_auto_w'))}</span></p><p class="dx-sm dx-note" hidden></p><details class="sd-en"><summary>${esc(t('dx_orig'))}</summary><p class="sd-p dx-pre">${esc(x.me)}</p></details><p class="dx-sm">${esc(t('dx_mean_n'))}</p>`:dxNA())}
    ${dxSec(t('dx_ctx'),senses.length?`<div class="dx-senses" id="dxSn">${senses.map((s,i)=>`<div class="dx-sn"><span class="dx-snw" data-i="${i}">${esc(sl(s)||s[0])}</span><span class="dx-snc">${s[3]}×</span>${s[4].length?`<span class="dx-snr">${s[4].slice(0,3).map(r=>{const z=refStr(r,L);return z?`<button class="tag eref" data-eref="${esc(z)}">${esc(z)}</button>`:''}).join('')}</span>`:''}</div>`).join('')}</div><p class="dx-sm dx-snn">${esc(t('dx_ctx_n'))}</p>`:dxNA())}
    ${dxSec(t('dx_root'),S&&S[4]?`<p class="sd-p">${strongLinks(derLocal(S[4],L))}</p>`:dxNA())}
    ${S?dxSec(t('dx_strong'),`<p class="sd-p" id="dxSd">${esc(S[2])}</p>${S[3]?`<span class="lbl">${esc(t('dx_kjv'))}</span><p class="sd-p" id="dxSk">${esc(S[3])}</p>`:''}<p class="dx-sm dx-note" hidden></p>`):''}
    ${dxSec(t('dx_hist_c'),`<div id="dxAi">${dxNA(t('dx_hist_na'))}${aiKey()?`<button class="btn sm ghost" data-x="ai">${ic('spark')}${esc(t('dx_ai_btn'))}</button>`:`<p class="dx-sm">${esc(t('dx_ai_need'))}</p>`}</div>`)}
    ${dxSec(t('dx_ex'),ex.length?`<div class="dx-ex" id="dxEx">${ex.map(s=>{const z=refStr(s[4][0],L);return`<div class="dx-exi"><button class="tag eref" data-eref="${esc(z)}">${esc(z)}</button><span class="dx-sm">${esc(t('dx_ex_as',{s:sl(s)||s[0]}))}</span><p class="sd-p dx-ext" data-ref="${esc(z)}">…</p></div>`}).join('')}</div>`:dxNA())}
    ${dxSec(t('dx_refs'),x.r&&x.r.length?`<p class="dx-sm" style="margin-top:0">${esc(t('dx_refs_n',{n:cnt}))}</p>`+refTags(x.r,L):dxNA())}
    <p class="dx-src">${esc(t('dx_src'))}: ${esc(d.src)}${S?' · Strong (Open Scriptures, CC BY-SA)':''}</p>`);
  const txt=()=>{const p=[`${lem} (${tr.replace(/\./g,'')}) · ${id}`];if(g)p.push(`${t('dx_tr')}: ${g}`);if(cat)p.push(`${t('dx_cat')}: ${cat}`);const me=$('#dxMe',sh);if(me)p.push(`${t('dx_mean')}: ${me.textContent}`);
    const sn=$$('.dx-snw',sh).map((w,i)=>`${w.textContent} (${senses[i][3]}×)`);if(sn.length)p.push(`${t('dx_ctx')}: ${sn.join('; ')}`);p.push(`${t('dx_src')}: STEPBible.org`);return p.join('\n')};
  dxWire(sh,{fav:{k,id:num,t:`${lem} · ${tr.replace(/\./g,'')}`,s:`${id}${g?' · '+g:''}`},text:txt,
    html:()=>{const sn=$$('.dx-snw',sh).slice(0,5).map((w,i)=>`${w.textContent} (${senses[i][3]}×)`);
      return`<p><b>${esc(lem)}</b> <i>(${esc(tr.replace(/\./g,''))}, ${id})</i>${g?` — ${esc(g)}`:''}${cat?`, ${esc(cat)}`:''}.${sn.length?` ${esc(t('dx_ctx'))}: ${esc(sn.join('; '))}.`:''}</p>`},
    ai:async btn=>{const box=$('#dxAi',sh);btn.disabled=true;btn.innerHTML=`${ic('spark')}${esc(t('ai_thinking'))}`;
      const facts=`Palabra: ${lem} (${tr}), Strong ${id}. Glosa: ${gEN}${g?' / '+g:''}. Categoría: ${mo}.\nLéxico (inglés):\n${x.me.slice(0,1800)}\nTraducciones según contexto: ${senses.slice(0,8).map(s=>s[0]+' ×'+s[3]).join('; ')}`;
      const sys=L==='pt'?'Você ajuda pastores a estudar palavras bíblicas. Escreva em português do Brasil, texto simples, no máximo 170 palavras. Use SOMENTE os dados fornecidos e conhecimento histórico amplamente aceito. NÃO invente significados, raízes, pronúncias, números de Strong, referências bíblicas nem datas. Não cite referências bíblicas. Se os dados não bastarem, diga isso claramente.':'Ayudas a pastores a estudiar palabras bíblicas. Escribe en español, texto simple, máximo 170 palabras. Usa SOLO los datos dados y conocimiento histórico ampliamente aceptado. NO inventes significados, raíces, pronunciaciones, números de Strong, referencias bíblicas ni fechas. No cites referencias bíblicas. Si los datos no alcanzan, dilo claramente.';
      try{const r=await aiCall(sys,(L==='pt'?'Explique o contexto histórico e cultural desta palavra e o que isso ajuda a entender na pregação.\n\n':'Explica el contexto histórico y cultural de esta palabra y qué ayuda a entender en la predicación.\n\n')+facts,700);
        if(!sh.isConnected)return;box.innerHTML=`<p class="dx-ailbl">${ic('spark')}${esc(t('dx_ai_lbl'))}</p><p class="sd-p dx-pre">${esc(r.replace(/\*\*/g,''))}</p>`}catch(err){btn.disabled=false;btn.innerHTML=`${ic('spark')}${esc(t('dx_ai_btn'))}`;toast(aiErr(err))}}});
  // ejemplos con el texto de la Biblia del usuario
  if(ex.length)loadBible(L).then(()=>{$$('.dx-ext',sh).forEach(p=>{p.textContent=bibleText(p.dataset.ref,L)||''})}).catch(()=>{});
  // significados y definición de Strong en el idioma del app
  if(x.me)dxTrInto(sh,'#dxMe','x'+id,x.me,L);
  if(S){Promise.all([lxGet(k+n,S[2],L),S[3]?lxGet(k+n+'k',S[3],L):Promise.resolve('')]).then(([a,c])=>{if(!sh.isConnected)return;if(a)$('#dxSd',sh).textContent=a;if(c&&$('#dxSk',sh))$('#dxSk',sh).textContent=c;const nt=$('#dxSd',sh).parentNode.querySelector('.dx-note');if(nt){nt.textContent=t(a?'dx_auto':'dx_off');nt.hidden=false}})}
  // sentidos sin traducción preparada: una sola traducción automática
  const miss=senses.map((s,i)=>[i,s]).filter(([,s])=>!sl(s));
  if(miss.length&&navigator.onLine){const src=miss.map(([,s])=>s[0]).join(' | ');const v=await lxGet('s'+id,src,L).catch(()=>null);if(!sh.isConnected)return;
    const parts=v?v.split('|').map(z=>z.trim()):[];if(parts.length===miss.length){miss.forEach(([i],j)=>{const w=$(`.dx-snw[data-i="${i}"]`,sh);if(w){w.textContent=parts[j];w.title=senses[i][0]}});const nn=$('.dx-snn',sh);if(nn)nn.textContent=t('dx_ctx_n')+' '+t('lx_auto')}}}

async function dxOpenBib(name){if(!dicQuota())return;const L=lxLang();let d,ch;try{d=await bibIdx();ch=await bibChunk(name)}catch(e){toast(t('dx_err'));return}
  const i=d.byName[String(name).toLowerCase()];const e=i!=null?d.e[i]:[name,0,'',0,0];const [eas,smi,refs]=ch[e[0]]||['','',[]];
  const main=eas||smi;const other=eas&&smi?smi:'';
  // relacionados: "See X" dentro del artículo y palabras originales del predicador
  const rel=[...new Set([...(main+' '+other).matchAll(/\b[Ss]ee\s+([A-Z][A-Za-z'\- ]{2,30}?)(?=[.,;:)]|\s+and\b|$)/g)].map(m=>m[1].trim()))].filter(x=>d.byName[x.toLowerCase()]!=null&&x.toLowerCase()!==e[0].toLowerCase()).slice(0,10);
  const head=main.length>2200?main.slice(0,2200).replace(/\s+\S*$/,'')+'…':main;const deep=refs.slice(0,3);
  const sh=dxSheet(`<div class="sd-head"><span class="sd-num">${esc(t('dx_b'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <h3 class="sd-name" id="dxT">${esc(e[0])}</h3>
    ${dxActs(dxIsFav('b',e[0]))}
    ${e[2]?dxSec(t('dx_name'),`<p class="sd-p"><em id="dxNm">${esc(e[2])}</em></p><p class="dx-sm">Hitchcock (1869)</p>`):''}
    ${dxSec(t('dx_def'),main?`<p class="sd-p dx-pre" id="dxD"><span class="sub">${esc(t('dx_auto_w'))}</span></p>${main.length>2200?`<button class="lnk" id="dxMore" hidden>${esc(t('dic_rest'))}</button>`:''}<p class="dx-sm dx-note" hidden></p><details class="sd-en"><summary>${esc(t('dx_orig'))}</summary><p class="sd-p dx-pre">${esc(main)}</p></details><p class="dx-sm">${esc(eas?"Easton's Bible Dictionary (1897)":"Smith's Bible Dictionary (1863)")}</p>`:dxNA())}
    ${other?`<details class="dx-sec dx-oth"><summary><h4>${esc(t('dx_other'))}</h4></summary><p class="sd-p dx-pre" id="dxO">${esc(other)}</p><button class="lnk" id="dxOt">${esc(t('dx_tr'))}</button></details>`:''}
    ${dxSec(t('dx_ai'),`<div id="dxAi">${aiKey()?`<p class="dx-sm" style="margin-top:0">${esc(t('dx_hist_c'))} · ${esc(L==='pt'?'contexto bíblico · importância espiritual':'contexto bíblico · importancia espiritual')}</p><button class="btn sm ghost" data-x="ai">${ic('spark')}${esc(t('dx_ai_btn'))}</button>`:`<p class="dx-sm" style="margin:0">${esc(t('dx_ai_need'))}</p>`}</div>`)}
    ${deep.length?dxSec(t('dx_deep'),`<div class="dx-ex">${deep.map(r=>{const z=refStr(r,L);return z?`<div class="dx-exi"><button class="tag eref" data-eref="${esc(z)}">${esc(z)}</button><p class="sd-p dx-ext" data-ref="${esc(z)}">…</p></div>`:''}).join('')}</div>`):''}
    ${dxSec(t('dx_refs'),refs.length?refTags(refs,L):dxNA())}
    ${rel.length?dxSec(t('dx_rel'),`<div class="sd-es">${rel.map(r=>`<button class="tag eref" data-rel="${esc(r)}" data-k="b">${esc(r)}</button>`).join('')}</div>`):''}
    <p class="dx-src">${esc(t('dx_src'))}: ${esc(d.src)}</p>`);
  const tx={v:''};
  dxWire(sh,{fav:{k:'b',id:e[0],t:e[0],s:''},text:()=>`${$('#dxT',sh).textContent}\n${$('#dxD',sh)?$('#dxD',sh).textContent:''}\n${t('dx_src')}: ${eas?'Easton':'Smith'}`,
    html:()=>{const m=($('#dxD',sh)||{}).textContent||'';const s=m.length>600?m.slice(0,600).replace(/\s+\S*$/,'')+'…':m;return`<p><b>${esc($('#dxT',sh).textContent)}</b>: ${esc(s.replace(/\n/g,' '))}</p>`},
    ai:async btn=>{const box=$('#dxAi',sh);btn.disabled=true;btn.innerHTML=`${ic('spark')}${esc(t('ai_thinking'))}`;
      const sys=L==='pt'?'Você ajuda pastores a estudar a Bíblia. Escreva em português do Brasil, texto simples, com três títulos exatamente assim: "# Contexto histórico e cultural", "# Contexto bíblico", "# Importância espiritual". No máximo 260 palavras. Baseie-se SOMENTE no artigo fornecido. NÃO invente datas, nomes, referências nem dados históricos. Não cite referências bíblicas. Se o artigo não trouxer algo, escreva "Não disponível no artigo."':'Ayudas a pastores a estudiar la Biblia. Escribe en español, texto simple, con tres títulos exactamente así: "# Contexto histórico y cultural", "# Contexto bíblico", "# Importancia espiritual". Máximo 260 palabras. Básate SOLO en el artículo dado. NO inventes fechas, nombres, referencias ni datos históricos. No cites referencias bíblicas. Si el artículo no trae algo, escribe "No disponible en el artículo."';
      try{const r=await aiCall(sys,`${e[0]}\n\n${(main+'\n\n'+other).slice(0,5000)}`,900);if(!sh.isConnected)return;
        box.innerHTML=`<p class="dx-ailbl">${ic('spark')}${esc(t('dx_ai_lbl'))}</p>`+r.replace(/\*\*/g,'').split('\n').filter(z=>z.trim()).map(z=>/^#\s*/.test(z)?`<h5>${esc(z.replace(/^#\s*/,''))}</h5>`:`<p class="sd-p">${esc(z)}</p>`).join('')}catch(err){btn.disabled=false;btn.innerHTML=`${ic('spark')}${esc(t('dx_ai_btn'))}`;toast(aiErr(err))}}});
  if(deep.length)loadBible(L).then(()=>$$('.dx-ext',sh).forEach(p=>{p.textContent=bibleText(p.dataset.ref,L)||''})).catch(()=>{});
  const ot=$('#dxOt',sh);if(ot)ot.onclick=async()=>{ot.disabled=true;const v=await lxGet('bs'+e[0],other.slice(0,2500),L);if(v){$('#dxO',sh).textContent=v;ot.textContent=t('lx_auto')}else{ot.disabled=false;toast(t('dict_tr_err'))}};
  const [tt,nm]=await Promise.all([lxGet('bt'+e[0],e[0],L),e[2]?lxGet('bn'+e[0],e[2],L):Promise.resolve('')]);if(!sh.isConnected)return;
  if(tt&&norm(tt)!==norm(e[0]))$('#dxT',sh).innerHTML=`${esc(tt)} <span class="sub" style="font-size:15px;font-weight:600">· ${esc(e[0])}</span>`;if(nm&&$('#dxNm',sh))$('#dxNm',sh).textContent=nm;
  if(main){const v=await dxTrInto(sh,'#dxD','b'+e[0],head,L);const mb=$('#dxMore',sh);if(mb&&v!==head){mb.hidden=false;mb.onclick=async()=>{mb.disabled=true;const rest=await lxGet('b'+e[0]+'r',main.slice(head.length-1,head.length+4000),L);if(rest){$('#dxD',sh).textContent=v.replace(/…$/,'')+' '+rest;mb.remove()}else{mb.disabled=false;toast(t('dict_tr_err'))}}}}}

async function dxOpenPreg(i){if(!dicQuota())return;try{await loadPreg()}catch(e){toast(t('dx_err'));return}const e=PREG.e[i];if(!e)return;const L=lxLang();const pt=L==='pt';const [wpt,wes,mpt,mes,o,vs]=e;
  const sh=dxSheet(`<div class="sd-head"><span class="sd-num">${esc(t('dx_b'))}</span><span class="sub">${esc(t('dx_preg'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <h3 class="sd-name">${esc(pt?wpt:wes)}</h3>${dxActs(dxIsFav('p',i))}
    ${dxSec(t('dx_def'),`<p class="sd-p">${esc(pt?mpt:mes)}</p>`)}
    ${dxSec(t('dx_lexw'),o.map(([n,lem,tr,xpt,xes])=>`<button class="sd-box po dx-po" data-sref="${n}"><div class="row" style="gap:10px;align-items:baseline;flex-wrap:wrap"><span class="sd-lemma sm" ${n[0]==='H'?'dir="rtl" lang="he"':'lang="grc"'}>${esc(lem)}</span><span class="sd-tr">${esc(tr)}</span><span class="sd-num sm" style="margin-left:auto">${n}</span></div><span class="dx-sm">${esc(t(n[0]==='H'?'dx_h':'dx_g'))}</span><p class="sd-p" style="margin:0">${esc(pt?xpt:xes)}</p></button>`).join(''))}
    ${vs.length?dxSec(t('dx_deep'),`<div class="dx-ex">${vs.slice(0,6).map(r=>{const z=refStr(r,L);return z?`<div class="dx-exi"><button class="tag eref" data-eref="${esc(z)}">${esc(z)}</button><p class="sd-p dx-ext" data-ref="${esc(z)}">…</p></div>`:''}).join('')}</div>`):''}
    <p class="dx-src">${esc(t('dx_p_src'))}</p>`);
  dxWire(sh,{fav:{k:'p',id:i,t:pt?wpt:wes,s:o.map(x=>x[1]).join(' · ')},
    text:()=>[pt?wpt:wes,pt?mpt:mes,...o.map(([n,lem,tr,xpt,xes])=>`${lem} (${tr}, ${n}): ${pt?xpt:xes}`)].join('\n'),
    html:()=>`<p><b>${esc(pt?wpt:wes)}</b>: ${esc(pt?mpt:mes)}</p>`+o.map(([n,lem,tr,xpt,xes])=>`<p><b>${esc(lem)}</b> <i>(${esc(tr)}, ${n})</i> — ${esc(pt?xpt:xes)}</p>`).join('')});
  loadBible(L).then(()=>$$('.dx-ext',sh).forEach(p=>{p.textContent=bibleText(p.dataset.ref,L)||''})).catch(()=>{})}

/* =========================================================
   Curiosidades bíblicas: preguntas y respuestas guardadas en el app (sin IA y sin conexión)
   ========================================================= */
Object.assign(I18N.es,{cu_t:'Curiosidades bíblicas',cu_d:'Preguntas y respuestas sobre la Biblia, con referencias.',cu_n:'{n} preguntas',cu_ph:'Escriba una pregunta o palabra…',cu_all:'Todas',cu_fav:'Favoritas',cu_none:'No hay una respuesta guardada para esa pregunta.',cu_ans:'Respuesta',cu_exp:'Explicación',cu_refs:'Referencias bíblicas',cu_more:'¿Sabía que…?',cu_crit:'Criterio',cu_ok:'Respuesta verificada · Meu Púlpito',cu_share:'Compartir',cu_ai:'Preguntar a la IA',cu_ai_lbl:'Respuesta generada por IA. No está verificada: confirme las referencias en la Biblia.',cu_ai_need:'Para preguntas nuevas con IA, agregue su clave en Configuración.',cu_back:'Inicio',cu_nofav:'Todavía no guardó preguntas. Abra una y toque la estrella.',cu_dic:'En el Diccionario Bíblico',cu_none2:'No hay una curiosidad guardada con esa pregunta, pero el Diccionario Bíblico tiene estos artículos:'});
Object.assign(I18N.pt,{cu_t:'Curiosidades bíblicas',cu_d:'Perguntas e respostas sobre a Bíblia, com referências.',cu_n:'{n} perguntas',cu_ph:'Escreva uma pergunta ou palavra…',cu_all:'Todas',cu_fav:'Favoritas',cu_none:'Não há uma resposta guardada para essa pergunta.',cu_ans:'Resposta',cu_exp:'Explicação',cu_refs:'Referências bíblicas',cu_more:'Você sabia?',cu_crit:'Critério',cu_ok:'Resposta verificada · Meu Púlpito',cu_share:'Compartilhar',cu_ai:'Perguntar à IA',cu_ai_lbl:'Resposta gerada por IA. Não é verificada: confira as referências na Bíblia.',cu_ai_need:'Para perguntas novas com IA, coloque sua chave em Configurações.',cu_back:'Início',cu_nofav:'Você ainda não salvou perguntas. Abra uma e toque na estrela.',cu_dic:'No Dicionário Bíblico',cu_none2:'Não há uma curiosidade guardada com essa pergunta, mas o Dicionário Bíblico tem estes artigos:'});
let CUR=null,CURP=null;const CV={cat:'',q:''};
function loadCur(){if(CUR)return Promise.resolve(CUR);if(!CURP)CURP=fetch('biblia/curiosidades.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
    d.ix=d.e.map(e=>[nWords(e.q[0]+' '+(e.k?e.k[0]:'')),nWords(e.q[1]+' '+(e.k?e.k[1]:'')),nWords(e.a[0]+' '+e.x[0]),nWords(e.a[1]+' '+e.x[1])]);d.by={};d.e.forEach(e=>d.by[e.id]=e);return CUR=d}).catch(e=>{CURP=null;throw e});return CURP}
const cuL=()=>lxLang()==='pt'?1:0;
const cuFavs=()=>Array.isArray(meta.curFav)?meta.curFav:(meta.curFav=[]);
const CU_STOP=new Set('el la los las de del y o a en un una que cual cuales quien quienes cuanto cuantos cuantas como donde es son se su sus por para con al lo le the o os as do da dos das e um uma qual quem quanto quantos quantas onde foi era no na nos nas pelo pela tem tiene biblia mas más mais muy muito'.split(' '));
function curSearch(q){const d=CUR;const l=cuL();const tk=norm(q).replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(w=>w.length>1&&!CU_STOP.has(w));if(!tk.length)return d.e.slice();
  const out=[];d.ix.forEach((ix,i)=>{let s=0;for(const w of tk){const hq=Math.max(ix[l].includes(' '+w+' ')?3:ix[l].includes(' '+w)?2:0,ix[1-l].includes(' '+w)?1:0);const ha=ix[2+l].includes(' '+w)?1:0;s+=hq||ha}if(s)out.push([i,s])});
  const top=out.length?Math.max(...out.map(x=>x[1])):0;return out.filter(x=>x[1]>=Math.max(1,top*0.5)).sort((a,b)=>b[1]-a[1]).map(x=>d.e[x[0]])}
function curHtml(){const l=cuL();
  const head=`<div class="subhead"><button class="iconbtn" data-act="back" aria-label="${esc(t('close'))}">${ic('back')}</button><h1 class="h">${esc(t('cu_t'))}</h1></div>
   <label class="search cu-search">${ic('search')}<input id="cuQ" type="search" value="${esc(CV.q)}" placeholder="${esc(t('cu_ph'))}" autocomplete="off" enterkeyhint="search"></label>`;
  if(!CUR)return head+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  const chips=`<div class="chips">${[['',t('cu_all')],['fav',t('cu_fav')],...Object.entries(CUR.cats).map(([k,v])=>[k,v[l]])].map(([k,v])=>`<button class="chip" data-cu="cat" data-k="${k}" aria-pressed="${CV.cat===k}">${k==='fav'?ic('star'):''}${esc(v)}</button>`).join('')}</div>`;
  return head+chips+`<div id="cuRes">${curResHtml()}</div>`}
/* lo que no está en las curiosidades se busca también en el Diccionario Bíblico (sin conexión, fuentes verificadas) */
function curDicHtml(){const tk=norm(CV.q).replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(w=>w.length>2&&!CU_STOP.has(w)&&!['significa','quiso','dice','hizo','fue','era','esta','estava'].includes(w));if(!tk.length)return'';
  if(!BIX||!PREG){Promise.all([bibIdx(),loadPreg()]).then(()=>{const r=$('#cuRes');if(r&&view.tab==='cur')r.innerHTML=curResHtml()}).catch(()=>{});return''}
  const L=lxLang(),pt=L==='pt',C=lxCache(L);const seen=new Set();const items=[];
  for(const w of tk){pregSearch(w).slice(0,3).forEach(i=>{if(!seen.has('p'+i)){seen.add('p'+i);const e=PREG.e[i];items.push(`<button class="cu-item" data-cu="dic" data-k="p" data-id="${i}"><span class="cu-q"><b>${esc(pt?e[0]:e[1])}</b><small>${esc((pt?e[2]:e[3]).slice(0,90))}…</small></span>${ic('next')}</button>`)}});
    bibSearch(w).slice(0,3).forEach(i=>{const e=BIX.e[i];if(!seen.has('b'+e[0])){seen.add('b'+e[0]);const al=BIX.al[w]&&BIX.al[w].toLowerCase()===e[0].toLowerCase();const tt=C['bt'+e[0]]||(al?CV.q.trim():'');items.push(`<button class="cu-item" data-cu="dic" data-k="b" data-id="${esc(e[0])}"><span class="cu-q"><b>${esc(tt&&!al?tt:e[0])}</b><small>${esc(t('dx_b'))}${e[1]?' · '+esc(t('dic_nref',{n:e[1]})):''}</small></span>${ic('next')}</button>`)}})}
  return items.length?`<span class="sect cu-sect">${esc(t('cu_dic'))}</span><div class="cu-list">${items.slice(0,8).join('')}</div>`:''}
function curResHtml(){const l=cuL();let list=CV.q.trim()?curSearch(CV.q):CUR.e.slice();const F=cuFavs();
  if(CV.cat==='fav')list=list.filter(e=>F.includes(e.id));else if(CV.cat)list=list.filter(e=>e.cat===CV.cat);
  const dic=CV.q.trim().length>2&&CV.cat!=='fav'?curDicHtml():'';
  if(!list.length)return`${dic?`<p class="sub" style="margin:0">${esc(t('cu_none2'))}</p>`+dic:`<div class="empty"><p style="margin:0">${esc(t(CV.cat==='fav'&&!CV.q?'cu_nofav':'cu_none'))}</p></div>`}${CV.q.trim().length>4?(aiKey()?`<button class="btn gold" data-cu="ai" style="align-self:center">${ic('spark')}${esc(t('cu_ai'))}</button>`:`<p class="dx-sm" style="text-align:center">${esc(t('cu_ai_need'))}</p>`):''}`;
  const groups=CV.q.trim()||CV.cat?[[null,list]]:Object.keys(CUR.cats).map(k=>[k,list.filter(e=>e.cat===k)]);
  return groups.map(([k,items])=>`${k?`<span class="sect cu-sect">${esc(CUR.cats[k][l])}</span>`:''}<div class="cu-list">${items.map(e=>`<button class="cu-item" data-cu="open" data-id="${e.id}"><span class="cu-q">${esc(e.q[l])}</span>${!curFree(e.id)?`<span class="cu-lock" aria-label="Premium">Premium</span>`:''}${F.includes(e.id)?`<span class="cu-st">${ic('star')}</span>`:''}${ic('next')}</button>`).join('')}</div>`).join('')+dic}
function curAfter(){if(!CUR){loadCur().then(()=>{if(view.tab==='cur')render()}).catch(()=>{});return}
  const i=$('#cuQ');if(i){i.oninput=()=>{CV.q=i.value;clearTimeout(i._t);i._t=setTimeout(()=>{const r=$('#cuRes');if(r)r.innerHTML=curResHtml()},180)};i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();i.blur()}}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cu]');if(!b||view.tab!=='cur')return;const a=b.dataset.cu;
  if(a==='cat'){CV.cat=b.dataset.k;$$('[data-cu=cat]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const r=$('#cuRes');if(r)r.innerHTML=curResHtml()}
  else if(a==='open')curOpen(+b.dataset.id);else if(a==='dic')dxOpen(b.dataset.k,b.dataset.id);else if(a==='ai')curAi(CV.q.trim())});
function curText(e,l){return[e.q[l],'',e.a[l],'',e.x[l],e.r.length?'\n'+(l?'Referências: ':'Referencias: ')+(l?e.r:(e.r_es||e.r)).map(r=>refStr(r,l?'pt':'es')).join('; '):'',e.c?'\n'+t('cu_more')+' '+e.c[l]:'','\n— Meu Púlpito'].filter(x=>x!=='').join('\n')}
function curOpen(id){const e=CUR.by[id];if(!e)return;if(!curFree(id)){planGate('cur');return}const l=cuL(),L=l?'pt':'es';const refs=(l?e.r:(e.r_es||e.r));const fav=cuFavs().includes(id);
  const sh=openSheet(`<div class="dx-entry"><div class="sd-head"><span class="sd-num">${esc(CUR.cats[e.cat][l])}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <h3 class="cu-h">${esc(e.q[l])}</h3>
    <div class="cu-ans"><span class="lbl">${esc(t('cu_ans'))}</span><p>${esc(e.a[l])}</p></div>
    <div class="dx-acts"><button class="btn sm ghost dx-fav" data-x="fav" aria-pressed="${fav}">${ic('star')}${esc(t('dx_fav'))}</button><button class="btn sm ghost" data-x="share">${ic('share')}${esc(t('cu_share'))}</button><button class="btn sm ghost" data-x="copy">${ic('copy')}${esc(t('dx_copy'))}</button></div>
    ${dxSec(t('cu_exp'),`<p class="sd-p">${esc(e.x[l])}</p>`)}
    ${refs.length?dxSec(t('cu_refs'),refTags(refs,L)+`<div class="dx-exi" style="margin-top:4px"><p class="sd-p dx-ext" id="cuV" data-ref="${esc(refStr(refs[0],L))}">…</p><span class="dx-sm">${esc(refStr(refs[0],L))} · ${esc(verLabel(L))}</span></div>`):''}
    ${e.c?dxSec(t('cu_more'),`<p class="sd-p">${esc(e.c[l])}</p>`,'cu-more'):''}
    ${e.crit?dxSec(t('cu_crit'),`<p class="dx-sm" style="font-size:13.5px">${esc(e.crit[l])}</p>`):''}
    <p class="cu-ok">${ic('check')}${esc(t('cu_ok'))}</p></div>`,{cls:'tall'});
  sh.addEventListener('click',ev=>{const r=ev.target.closest('[data-eref]');if(r){compareRef(r.dataset.eref,null,L);return}const x=ev.target.closest('[data-x]');if(!x)return;const a=x.dataset.x;
    if(a==='close')closeSheet();
    else if(a==='fav'){const F=cuFavs();const i=F.indexOf(id);if(i>=0){F.splice(i,1);toast(t('dx_unfav'))}else{F.unshift(id);toast(t('dx_faved'))}x.setAttribute('aria-pressed',String(i<0));putMeta();const rr=$('#cuRes');if(rr)rr.innerHTML=curResHtml()}
    else if(a==='copy')copyText(curText(e,l)).then(()=>toast(t('copied')));
    else if(a==='share'){const txt=curText(e,l);if(navigator.share)navigator.share({title:e.q[l],text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')))}});
  loadBible(L).then(()=>{const p=$('#cuV',sh);if(p)p.textContent=bibleText(p.dataset.ref,L)||''}).catch(()=>{})}
async function curAi(q){const l=cuL(),L=l?'pt':'es';const sh=openSheet(`<div class="dx-entry"><div class="sd-head"><span class="sd-num">${esc(t('cu_t'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div><h3 class="cu-h">${esc(q)}</h3><p class="dx-ailbl">${ic('spark')}${esc(t('cu_ai_lbl'))}</p><div id="cuAi"><p class="sub">${esc(t('ai_thinking'))}</p></div></div>`,{cls:'tall'});
  sh.addEventListener('click',ev=>{if(ev.target.closest('[data-x=close]'))closeSheet();const r=ev.target.closest('[data-eref]');if(r)compareRef(r.dataset.eref,null,L)});
  const sys=l?'Você responde curiosidades bíblicas para pastores, em português do Brasil, em no máximo 120 palavras, texto simples. Use a Bíblia protestante. Dê a resposta direta primeiro. Se o número depender da tradução ou do critério de contagem, diga isso e não dê um número inventado. Cite no máximo 3 referências, cada uma numa linha própria começando com "> " seguida só da referência (ex.: > João 3:16). Se não souber com certeza, diga que não tem certeza.':'Respondes curiosidades bíblicas para pastores, en español, en máximo 120 palabras, texto simple. Usa la Biblia protestante. Da primero la respuesta directa. Si el número depende de la traducción o del criterio de conteo, dilo y no inventes un número. Cita como máximo 3 referencias, cada una en una línea propia que empiece con "> " seguida solo de la referencia (ej.: > Juan 3:16). Si no estás seguro, dilo.';
  try{const r=await aiCall(sys,q,600);if(!sh.isConnected)return;const lines=r.replace(/\*\*/g,'').split('\n').filter(x=>x.trim());
    $('#cuAi',sh).innerHTML=lines.map(x=>{const m=x.match(/^\s*>\s*(.+)$/);if(m){const ok=bibleText(m[1],L);return ok?`<button class="tag eref" data-eref="${esc(m[1].trim())}">${esc(m[1].trim())}</button>`:''}return`<p class="sd-p">${esc(x)}</p>`}).join('')}
  catch(err){if(sh.isConnected)$('#cuAi',sh).innerHTML=`<p class="dx-na">${esc(aiErr(err))}</p>`}}

/* comparar versiones */
function compareRef(ref,host,lang){const p=parseRef(ref);if(!p||!p.vs){toast(t('verse_nf'));return}
  const first=lang==='pt'?['pt','ptr','nva','es','es65']:['es','es65','pt','ptr','nva'];const og=p.b>=39?'grc':'hbo';const keys=[...first,og];
  const sh=openSheet(`<h3>${esc(t('cmp_t'))} · ${esc(refName(p.b,p.ch,p.vs,lang))}</h3><div id="cmpBody" class="sub">${esc(t('cmp_load'))}</div>`,{host});
  Promise.all(keys.map(k=>loadBible(k).catch(()=>null))).then(()=>{if(!sh.isConnected)return;
    $('#cmpBody',sh).outerHTML=`<div style="display:flex;flex-direction:column;gap:14px">${keys.map(k=>{const tx=bibleText(ref,k);const orig=k===og;
      return`<div style="display:flex;flex-direction:column;gap:4px;${orig?'border-top:1px solid var(--line);padding-top:12px':''}">
        <span class="lbl" style="color:var(--gold-ink)">${esc(orig?`${t('orig')} · ${t(og==='grc'?'orig_g':'orig_h')}`:VNAME[k])}</span>
        ${tx?`<span ${orig&&og==='hbo'?'dir="rtl" lang="he"':orig?'lang="grc"':''} style="font-family:var(--read);font-size:${orig?19:16.5}px;line-height:1.6">${orig?origWords(tx,og==='grc'?'g':'h'):esc(tx)}</span>${orig?`<span class="sub" style="font-size:12px">${ic('search')} ${esc(t('dict_tap'))}</span>`:''}
        ${orig?`<span class="sub" style="font-style:italic">${esc(og==='grc'?translitGr(tx):translitHe(tx))}</span><span class="sub" style="font-size:11px">${esc(t('translit'))} · ${esc(VNAME[k])}</span>`:''}`
        :`<span class="sub">${esc(t('cmp_none'))}</span>`}</div>`}).join('')}</div>`})}

/* traducción (MyMemory) */
function splitChunks(text,max=450){const out=[];let rest=text.trim();
  while(rest.length>max){let cut=rest.lastIndexOf('. ',max);if(cut<max*.5)cut=rest.lastIndexOf(' ',max);if(cut<1)cut=max;out.push(rest.slice(0,cut+1).trim());rest=rest.slice(cut+1).trim()}
  if(rest)out.push(rest);return out}
async function mmTranslate(text,from,to){const pair=`${from==='pt'?'pt-BR':'es'}|${to==='pt'?'pt-BR':'es'}`;const parts=[];
  for(const ch of splitChunks(text)){const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(ch)}&langpair=${encodeURIComponent(pair)}${prefs.mmEmail?'&de='+encodeURIComponent(prefs.mmEmail):''}`;
    let r;try{r=await fetch(url)}catch(e){throw{code:'net'}}
    if(r.status===429)throw{code:'quota'};if(!r.ok)throw{code:'net'};const j=await r.json();
    const tx=j&&j.responseData&&j.responseData.translatedText||'';
    if(j.quotaFinished||/MYMEMORY WARNING|USED ALL AVAILABLE FREE/i.test(tx))throw{code:'quota'};
    if(+j.responseStatus!==200||!tx)throw{code:'net'};parts.push(tx)}
  return parts.join(' ')}
/* =========================================================
   Meu Púlpito IA (clave propia, guardada en el aparato)
   ========================================================= */
const AIM='claude-sonnet-5-5';
const aiKey=()=>ls.get('mp.aikey','')||'';
async function aiCall(system,msg,max=1600){track('ia');const k=aiKey();if(!k)throw{code:'nokey'};let r;
  try{r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:AIM,max_tokens:max,system,messages:[{role:'user',content:msg}]})})}catch(e){throw{code:'net'}}
  const j=await r.json().catch(()=>({}));
  if(!r.ok){const m=(j.error&&j.error.message)||'';throw{code:r.status===401||r.status===403?'key':r.status===429?'rate':(r.status===529||r.status===503)?'busy':/credit|balance|billing/i.test(m)?'credit':'net'}}
  return(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n').trim()}
const aiErr=e=>t({nokey:'ai_nokey',key:'ai_err_key',rate:'ai_err_rate',busy:'ai_err_busy',credit:'ai_err_credit'}[e&&e.code]||'ai_err');
function aiSystem(l){const es=l!=='pt';return es?
`Eres el asistente "Meu Púlpito IA" de un pastor evangélico. Ayudas a preparar sermones en español. Respetas la teología y el estilo del pastor; eres un asistente de preparación y no reemplazas su estudio bíblico.
REGLAS SOBRE LA BIBLIA (obligatorias):
- Nunca inventes versículos ni referencias. Si no estás seguro de una referencia exacta, no la uses.
- Para citar un versículo escribe una línea que empiece con "> " seguida SOLO de la referencia, por ejemplo: > Juan 3:16 . No escribas el texto del versículo: la aplicación lo coloca desde la Biblia.
FORMATO: texto simple. Usa "# " al inicio de la línea para títulos de puntos y "! " para una frase destacada. No uses ** ni markdown. Sé claro y breve, en el tono de un pastor que predica.`
:`Você é o assistente "Meu Púlpito IA" de um pastor evangélico. Ajuda a preparar sermões em português do Brasil. Respeita a teologia e o estilo do pastor; é um assistente de preparação e não substitui o estudo bíblico dele.
REGRAS SOBRE A BÍBLIA (obrigatórias):
- Nunca invente versículos nem referências. Se não tiver certeza de uma referência exata, não use.
- Para citar um versículo escreva uma linha que comece com "> " seguida SÓ da referência, por exemplo: > João 3:16 . Não escreva o texto do versículo: o aplicativo coloca a partir da Bíblia.
FORMATO: texto simples. Use "# " no começo da linha para títulos de pontos e "! " para uma frase de destaque. Não use ** nem markdown. Seja claro e breve, no tom de um pastor que prega.`}
/* convierte la respuesta en bloques y verifica cada cita en la Biblia del app */
function aiToHtml(txt,l){txt=String(txt||'').replace(/\*\*/g,'').replace(/^\s*[-•]\s+/gm,'');let dropped=0;
  txt=txt.split('\n').filter(line=>{const m=line.match(/^\s*>\s*(.+)$/);if(m&&!bibleText(m[1],l)){dropped++;return false}return true}).join('\n');
  const d=document.createElement('div');d.innerHTML=linesToHtml(txt,{}).html;
  $$('blockquote[data-ref]',d).forEach(b=>{const r=b.getAttribute('data-ref');const v=bibleText(r,l);if(!v){b.remove();dropped++}else{const p=parseRef(r);b.setAttribute('data-ref',refName(p.b,p.ch,p.vs,l));b.textContent=v}});
  $$('h2',d).forEach(h=>{const n=document.createElement('h3');n.textContent=h.textContent;h.replaceWith(n)});
  $$('blockquote:not([data-ref])',d).forEach(b=>{b.replaceWith(Object.assign(document.createElement('p'),{textContent:b.textContent}))});
  const RX=/((?:[1-3]\s?)?[A-ZÁÉÍÓÚ][a-záéíóúñçãõê]+\.?)\s(\d{1,3}):(\d{1,3}(?:\s?[-–]\s?\d{1,3})?)/g;
  $$('p,li,h2,h3',d).forEach(el=>{if(!RX.test(el.textContent))return;RX.lastIndex=0;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>{n.nodeValue=n.nodeValue.replace(RX,(m)=>bibleText(m,l)?m:`${m} ${t('ai_unver',null,l)}`)})});
  return{html:cleanHtml(d.innerHTML),dropped}}
function sectionOf(node){const ed=$('#ed');if(!ed)return'';let b=node;while(b&&b.parentNode!==ed)b=b.parentNode;if(!b)return'';
  let start=b;while(start&&start.tagName!=='H2'&&start.previousElementSibling)start=start.previousElementSibling;
  const out=[];let x=start;while(x){if(x!==start&&x.tagName==='H2')break;out.push(x.textContent.trim());x=x.nextElementSibling}return out.filter(Boolean).join('\n')}
function aiSheet(){if(!E)return;edSave();trackRange();closeSheet();const l=sLang(E.s);
  if(!aiKey()){openSheet(`<h3>${esc(t('ai'))}</h3><p style="margin:0;line-height:1.5">${esc(t('ai_nokey'))}</p><button class="btn gold block" data-act="aiGoKey">${esc(t('nav_profile'))}</button>`);return}
  const A=[['intro','ai_intro'],['point','ai_point'],['concl','ai_concl'],['apps','ai_apps'],['ctx','ai_ctx'],['refs','ai_refs'],['gram','ai_gram'],['trans','ai_trans']];
  const sh=openSheet(`<h3>${esc(t('ai'))}</h3><p class="sub" style="margin:0">${esc(t('ai_d'))}</p>
   <div class="acts">${A.map(([k,lb])=>`<button class="act" data-ai="${k}">${ic(k==='trans'?'lang':k==='gram'?'check':'spark')}${esc(t(lb))}</button>`).join('')}</div>
   <div class="row"><input class="inp" id="aiQ" placeholder="${esc(t('ai_ask_ph'))}"><button class="btn dark" id="aiSend">${esc(t('ai_send'))}</button></div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-ai]');if(b)aiRun(b.dataset.ai)});
  $('#aiSend',sh).onclick=()=>{const q=$('#aiQ',sh).value.trim();if(q)aiRun('ask',q)}}
async function aiRun(kind,q){if(!E)return;const l=sLang(E.s);const ed=$('#ed');const dv=derive(Object.assign({},E.s,{html:cleanHtml(ed.innerHTML)}));
  const full=ed.innerText.slice(0,12000);const sec=E.lastRange?sectionOf(E.lastRange.startContainer):'';
  const sel=E.lastRange&&!E.lastRange.collapsed?E.lastRange.toString():'';
  if(kind==='trans'){closeSheet();edSave(true);const id=E.s.id;closeEditor(()=>{render();translateSermon(id)});return}
  let para='';if(kind==='gram'){if(sel)para=sel;else if(E.lastRange){let n=E.lastRange.startContainer;while(n&&n.parentNode!==ed)n=n.parentNode;para=n?n.textContent.trim():''}if(!para){toast(t('ai_need_sel'));return}}
  const es=l!=='pt';const base=`${es?'Título':'Título'}: ${dv.title||'-'}\n${es?'Texto base':'Texto base'}: ${dv.passage||'-'}\n\n${es?'SERMÓN ACTUAL':'SERMÃO ATUAL'}:\n${full}`;
  const P={intro:es?'Escribe una introducción (2 o 3 párrafos) que conecte con la congregación y lleve al texto base.':'Escreva uma introdução (2 ou 3 parágrafos) que conecte com a congregação e leve ao texto base.',
    point:(es?'Desarrolla este punto del sermón con explicación, una ilustración breve y aplicación. Punto:\n':'Desenvolva este ponto do sermão com explicação, uma ilustração breve e aplicação. Ponto:\n')+(sec||dv.title),
    concl:es?'Escribe una conclusión fuerte con resumen de los puntos y un llamado claro.':'Escreva uma conclusão forte com resumo dos pontos e um apelo claro.',
    apps:es?'Sugiere de 3 a 5 aplicaciones prácticas para la vida diaria, cortas y concretas.':'Sugira de 3 a 5 aplicações práticas para a vida diária, curtas e concretas.',
    ctx:(es?'Explica el contexto histórico, cultural y literario del texto base (autor, destinatarios, época, propósito). Texto: ':'Explique o contexto histórico, cultural e literário do texto base (autor, destinatários, época, propósito). Texto: ')+(sel||dv.passage||dv.title),
    refs:es?'Sugiere de 4 a 6 referencias bíblicas relacionadas con el tema, cada una en su propia línea "> Referencia" y debajo una frase explicando la relación.':'Sugira de 4 a 6 referências bíblicas relacionadas com o tema, cada uma em sua própria linha "> Referência" e abaixo uma frase explicando a relação.',
    gram:(es?'Corrige la ortografía y la gramática del texto sin cambiar el estilo ni el contenido. Responde SOLO con el texto corregido:\n':'Corrija a ortografia e a gramática do texto sem mudar o estilo nem o conteúdo. Responda SÓ com o texto corrigido:\n')+para,
    ask:q||''};
  const msg=kind==='gram'?P.gram:`${base}\n\n${es?'PEDIDO':'PEDIDO'}: ${P[kind]}`;
  closeSheet();const sh=openSheet(`<h3>${esc(kind==='ask'?t('ai_ask'):t('ai_'+kind))}</h3><div id="aiOut" class="doc" style="padding:0;font-size:16.5px"><p class="sub">${esc(t('ai_thinking'))}</p></div><div id="aiBtns"></div>`);
  try{await loadBible(l)}catch(e){}
  let out;try{out=await aiCall(aiSystem(l),msg,kind==='gram'?1200:1800)}catch(e){$('#aiOut',sh).innerHTML=`<p class="err">${esc(aiErr(e))}</p>`;return}
  if(!sh.isConnected)return;
  if(kind==='gram'){$('#aiOut',sh).innerHTML=`<p>${esc(out)}</p>`;
    $('#aiBtns',sh).innerHTML=`<div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn gold" id="aiRep">${esc(t('ai_replace'))}</button></div>`;
    $('#aiRep',sh).onclick=()=>{closeSheet();const s2=getSelection();ed.focus();if(E.lastRange){s2.removeAllRanges();s2.addRange(E.lastRange)}
      if(sel){document.execCommand('insertText',false,out)}else{let n=E.lastRange.startContainer;while(n&&n.parentNode!==ed)n=n.parentNode;if(n){snap();n.textContent=out}}onEdInput();toast(t('ai_replaced'))};return}
  const r=aiToHtml(out,l);
  $('#aiOut',sh).innerHTML=r.html+(r.dropped?`<p class="sub">${esc(t('ai_dropped',{n:r.dropped}))}</p>`:'');
  $('#aiBtns',sh).innerHTML=`<div class="two"><button class="btn ghost" id="aiAg">${esc(t('ai_again'))}</button><button class="btn gold" id="aiIns">${esc(t('ai_insert'))}</button></div><button class="btn ghost block" id="aiCp">${ic('copy')}${esc(t('copy_txt'))}</button>`;
  $('#aiAg',sh).onclick=()=>aiRun(kind,q);
  $('#aiCp',sh).onclick=()=>copyText($('#aiOut',sh).innerText).then(()=>toast(t('copied')));
  $('#aiIns',sh).onclick=()=>{closeSheet();insertHtmlAfterCaret(r.html);toast(t('ai_inserted'))}}
function insertHtmlAfterCaret(html){const ed=$('#ed');ed.focus();if(E&&E.lastRange&&ed.contains(E.lastRange.startContainer)){const s2=getSelection();s2.removeAllRanges();s2.addRange(E.lastRange)}else placeCaret(ed.lastElementChild,1);
  snap();const tmp=document.createElement('div');tmp.innerHTML=html;let b=curBlock();const nodes=[...tmp.children];if(!nodes.length)return;
  if(!b)b=ed.lastElementChild;if(b.tagName==='H1'&&b.nextElementSibling)b=b.nextElementSibling;while(b.nextElementSibling&&b.nextElementSibling.tagName!=='H2')b=b.nextElementSibling;let ref=b;nodes.forEach(n=>{ref.after(n);ref=n});placeCaret(ref,1);onEdInput();snap()}
async function aiTranslateBlocks(texts,from,to){const sys=to==='pt'?'Você traduz sermões do espanhol para o português do Brasil, mantendo o tom de pregação. Responda só com JSON.':'Traduces sermones del portugués al español, manteniendo el tono de predicación. Responde solo con JSON.';
  const out=[];for(let i=0;i<texts.length;i+=40){const part=texts.slice(i,i+40);
    const r=await aiCall(sys,`${to==='pt'?'Traduza cada item deste array JSON e devolva um array JSON com o mesmo número de itens, na mesma ordem. Mantenha MAIÚSCULAS onde houver.':'Traduce cada elemento de este array JSON y devuelve un array JSON con la misma cantidad de elementos, en el mismo orden. Mantén MAYÚSCULAS donde las haya.'}\n${JSON.stringify(part)}`,4000);
    const m=r.match(/\[[\s\S]*\]/);const arr=m?JSON.parse(m[0]):null;if(!Array.isArray(arr)||arr.length!==part.length)throw{code:'net'};out.push(...arr.map(String))}
  return out}
/* traduce el HTML de un sermón (versículos desde la Biblia del otro idioma; el resto con la IA o MyMemory) */
async function translateHtml(s,to,prog){const from=sLang(s);const d=docOf(s);try{await loadBible(to)}catch(e){}
  const isRef=el=>el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')&&(parseRef(el.getAttribute('data-ref'))||{}).vs;
  const work=[];[...d.children].forEach(el=>{if(el.tagName==='OL'||el.tagName==='UL')$$('li',el).forEach(li=>work.push(li));else work.push(el)});
  const items=work.filter(el=>el.textContent.trim()&&!isRef(el));
  const put=(el,tr)=>{const tx=el.textContent.trim();const onlyMark=el.children.length===1&&el.firstElementChild.tagName==='MARK'&&el.firstElementChild.textContent.trim()===tx;el.innerHTML=onlyMark?`<mark>${esc(tr)}</mark>`:esc(tr)};
  let done=false;
  if(aiKey()){try{prog&&prog(t('ai_thinking'));const tr=await aiTranslateBlocks(items.map(el=>el.textContent.trim()),from,to);items.forEach((el,k)=>put(el,tr[k]));done=true}catch(e){}}
  if(!done){let i=0,next=0;const res=new Array(items.length);
    // varios párrafos a la vez (3) para que sea más rápido
    const worker=async()=>{while(next<items.length){const k=next++;res[k]=await mmTranslate(items[k].textContent.trim(),from,to);i++;prog&&prog(t('tr_prog',{i,n:items.length}))}};
    await Promise.all([worker(),worker(),worker()]);items.forEach((el,k)=>put(el,res[k]))}
  work.forEach(el=>{if(isRef(el)){const p=parseRef(el.getAttribute('data-ref'));const nr=refName(p.b,p.ch,p.vs,to);el.setAttribute('data-ref',nr);if(el.textContent.trim())el.textContent=bibleText(nr,to)||el.textContent}});
  return cleanHtml(d.innerHTML)}
const hashStr=x=>{let h=5381;for(let i=0;i<x.length;i++)h=((h<<5)+h+x.charCodeAt(i))|0;return(h>>>0).toString(36)+x.length};
const trCached=(s,to)=>{const c=s.tr&&s.tr[to];return c&&c.h===hashStr(getHtml(s))?c.html:null};
async function translateSermon(id){const s=sermons.find(x=>x.id===id);if(!s)return;if(!canNewSermon())return;closeSheet();const from=sLang(s),to=from==='pt'?'es':'pt';
  const d=docOf(s);const chars=d.textContent.length;
  const sh=openSheet(`<h3>${esc(t('tr_t'))}</h3><p style="margin:0;font-size:15px;line-height:1.5">${esc(t('tr_d'))}</p><p class="sub" style="margin:0">${esc(aiKey()?t('ai_tr_ai'):t('tr_lim',{n:chars.toLocaleString()}))}</p>
    <div class="sub" id="trProg" hidden></div><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn gold" id="trGo">${ic('lang')}${esc(t('tr_go'))}</button></div>`);
  $('#trGo',sh).onclick=async()=>{const go=$('#trGo',sh);go.disabled=true;const pr=$('#trProg',sh);pr.hidden=false;
    try{await loadBible(to)}catch(e){}
    const work=[];[...d.children].forEach(el=>{if(el.tagName==='OL'||el.tagName==='UL')$$('li',el).forEach(li=>work.push(li));else work.push(el)});
    const todo=work.filter(el=>el.textContent.trim()&&!(el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')&&(parseRef(el.getAttribute('data-ref'))||{}).vs));
    let i=0;
    if(aiKey()){try{pr.textContent=t('ai_thinking');const items=work.filter(el=>!(el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')&&(parseRef(el.getAttribute('data-ref'))||{}).vs)&&el.textContent.trim());
        const tr=await aiTranslateBlocks(items.map(el=>el.textContent.trim()),from,to);
        items.forEach((el,k)=>{const tx=el.textContent.trim();const onlyMark=el.children.length===1&&el.firstElementChild.tagName==='MARK'&&el.firstElementChild.textContent.trim()===tx;el.innerHTML=onlyMark?`<mark>${esc(tr[k])}</mark>`:esc(tr[k])});
        work.forEach(el=>{if(el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')){const p=parseRef(el.getAttribute('data-ref'));if(p&&p.vs){const nr=refName(p.b,p.ch,p.vs,to);el.setAttribute('data-ref',nr);if(el.textContent.trim())el.textContent=bibleText(nr,to)||el.textContent}}});
        const c=JSON.parse(JSON.stringify(s));Object.assign(c,{id:uid(),html:cleanHtml(d.innerHTML),lang:to,fav:false,log:[],preached:{},created:Date.now(),v:2,translatedFrom:s.id});delete c.body;
        putSermon(c,{silent:true});closeSheet();openEditor(c.id);toast(t('tr_done'));return}catch(e){pr.textContent=''}}
    try{for(const el of work){
        if(el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')){const p=parseRef(el.getAttribute('data-ref'));
          if(p&&p.vs){const nr=refName(p.b,p.ch,p.vs,to);el.setAttribute('data-ref',nr);if(el.textContent.trim())el.textContent=bibleText(nr,to)||el.textContent;continue}}
        const tx=el.textContent.trim();if(!tx)continue;i++;pr.textContent=t('tr_prog',{i,n:todo.length});
        const out=await mmTranslate(tx,from,to);const onlyMark=el.children.length===1&&el.firstElementChild.tagName==='MARK'&&el.firstElementChild.textContent.trim()===tx;
        el.innerHTML=onlyMark?`<mark>${esc(out)}</mark>`:esc(out)}}
    catch(e){go.disabled=false;pr.hidden=true;toast(t(e&&e.code==='quota'?'tr_quota':'tr_err'));return}
    const c=JSON.parse(JSON.stringify(s));Object.assign(c,{id:uid(),html:cleanHtml(d.innerHTML),lang:to,fav:false,log:[],preached:{},created:Date.now(),v:2,translatedFrom:s.id});delete c.body;
    putSermon(c,{silent:true});closeSheet();openEditor(c.id);toast(t('tr_done'))}}

/* =========================================================
   Modelo del sermón
   ========================================================= */
const RX_T=/^\s*(tema|t[íi]tulo)\s*:\s*(.+)$/i, RX_P=/^\s*texto(\s+base)?\s*:\s*(.+)$/i;
const SEC=[{k:'intro',rx:/^(introdu[cç][aã]o|introducci[oó]n|intro)\b/i},{k:'dev',rx:/^(desenvolvimento|desarrollo|cuerpo)\b/i},
  {k:'concl',rx:/^(conclus[aã]o|conclusi[oó]n|apelo|llamado|aplica[cç][aã]o|aplicaci[oó]n|cierre|ora[cç][aã]o final|oraci[oó]n final)\b/i},
  {k:'base',rx:/^(texto\s*base|vers[ií]culo\s*(base|clave|chave))/i}];
const RX_PT=/^((ponto|punto|t[oó]pico)\s*(\d+|[ivx]+)\b[:.\-–\s]*|\d+[\.\)\-–]\s*|[ivx]+[\.\)\-–]\s+)/i;
const secOf=txt=>{const s=SEC.find(x=>x.rx.test(String(txt).trim()));return s?s.k:null};
function titleCase(x){x=String(x||'').trim();return x&&x===x.toUpperCase()?x.charAt(0)+x.slice(1).toLowerCase():x}
function detectLang(txt){txt=' '+norm(txt).slice(0,4000)+' ';const raw=' '+String(txt).toLowerCase()+' ';
  const es=(raw.match(/ñ|ción|\b(el|los|las|del|pero|muy|hoy|usted|nosotros|también|dios|señor|que no|en su)\b/g)||[]).length;
  const pt=(raw.match(/ção|ções|ã|õ|\b(não|os|as|do|da|mas|muito|hoje|você|nós|deus|senhor|em seu|que não)\b/g)||[]).length;
  return es>pt?'es':'pt'}
/* idioma con seguridad: solo cuando el texto lo deja claro */
function detectSure(txt){const raw=' '+String(txt||'').toLowerCase().slice(0,6000)+' ';
  const es=(raw.match(/ñ|ción|\b(el|los|las|del|pero|muy|hoy|usted|nosotros|también|dios|señor|hacia|nos|una|con|está|para|cuando|porque|pueblo)\b/g)||[]).length;
  const pt=(raw.match(/ção|ções|ã|õ|\b(não|os|do|da|dos|das|mas|muito|hoje|você|nós|deus|senhor|para|um|uma|com|está|quando|porque|povo)\b/g)||[]).length;
  if(es+pt<6)return null;if(es>=pt*1.6)return'es';if(pt>=es*1.6)return'pt';return null}
const LDC=new Map();

/* texto antiguo (bloc de notas con marcas) → documento */
function linesToHtml(text,opts={}){
  const lines=String(text||'').replace(/\r/g,'').split('\n');let title=opts.title||'',passage=opts.passage||'';const out=[];
  const P=x=>`<p>${esc(x)}</p>`;
  for(let i=0;i<lines.length;i++){const l=lines[i].trim();if(!l)continue;
    let m;
    if((m=l.match(RX_T))){if(!title)title=titleCase(m[2]);else if(norm(titleCase(m[2]))!==norm(title))out.push(`<h3>${esc(l)}</h3>`);continue}
    if((m=l.match(RX_P))&&isRef(m[2])){const ref=cleanRef(m[2]);if(!passage)passage=ref;let txt='';
      for(let j=i+1;j<lines.length;j++){const n=lines[j].trim();if(!n)continue;if(/^[>“"«]/.test(n)&&!isRef(n)){txt=n.replace(/^>\s?/,'');i=j}break}
      out.push(`<blockquote data-ref="${esc(ref)}">${esc(txt)}</blockquote>`);continue}
    if(l.startsWith('@')){out.push(`<p class="nt">${esc(l.replace(/^@\s?/,''))}</p>`);continue}
    if(l.startsWith('#')){out.push(`<h2>${esc(l.replace(/^#+\s?/,''))}</h2>`);continue}
    if(l.startsWith('>')){const x=l.replace(/^>\s?/,'');out.push(isRef(x)?`<blockquote data-ref="${esc(cleanRef(x))}"></blockquote>`:`<blockquote>${esc(x)}</blockquote>`);continue}
    if(l.startsWith('!')){out.push(`<p><mark>${esc(l.replace(/^!\s?/,''))}</mark></p>`);continue}
    if(l.startsWith('~')){out.push(`<p class="il">${esc(l.replace(/^~\s?/,''))}</p>`);continue}
    const letters=l.replace(/[^A-Za-zÀ-ÿ]/g,'');const caps=letters.length>2&&l===l.toUpperCase();const head=caps&&l.length<=70&&!/[.!?]$/.test(l);
    const sk=secOf(l.replace(/^[#\s]+/,''));
    if(sk&&(head||/^[^:]{0,30}:/.test(l)||l.split(/\s+/).length<=2)){
      const ci=l.indexOf(':');const lab=ci>0?l.slice(0,ci).trim():l.replace(/:$/,'');const rest=ci>0?l.slice(ci+1).trim():'';
      if(sk==='base'&&rest&&isRef(rest)){out.push(`<h3>${esc(lab)}</h3><blockquote data-ref="${esc(cleanRef(rest))}"></blockquote>`);continue}
      out.push(`<h2>${esc(lab)}</h2>`);if(rest)out.push(P(rest));continue}
    if(RX_PT.test(l)&&(head||l.length<=90)){out.push(`<h2>${esc(l.replace(RX_PT,'').replace(/^[:\-–\s]+/,'')||l)}</h2>`);continue}
    if(/^[“"«]/.test(l)){out.push(`<blockquote>${esc(l)}</blockquote>`);continue}
    if(isRef(l)){out.push(`<blockquote data-ref="${esc(cleanRef(l))}"></blockquote>`);continue}
    if(head){out.push(`<h3>${esc(l)}</h3>`);continue}
    out.push(P(l));
  }
  let html=out.join('');
  if(passage&&!/<blockquote data-ref=/.test(html)&&isRef(passage))html=`<blockquote data-ref="${esc(cleanRef(passage))}"></blockquote>`+html;
  return{title,passage,html};
}
function bodyToHtml(s){const r=linesToHtml(s.body,{title:(s.title||'').trim(),passage:(s.passage||'').trim()});
  return`<h1>${esc(r.title||'')}</h1>`+(r.html||'<p><br></p>')}
const htmlCache=new Map();
function getHtml(s){if(s.html)return s.html;const k=s.id+'|'+(s.updated||0);if(!htmlCache.has(k))htmlCache.set(k,bodyToHtml(s));return htmlCache.get(k)}

/* limpieza: solo las etiquetas del editor */
const ALLOW={H1:'h1',H2:'h2',H3:'h3',P:'p',DIV:'p',OL:'ol',UL:'ul',LI:'li',BLOCKQUOTE:'blockquote',B:'b',STRONG:'b',I:'i',EM:'i',U:'u',MARK:'mark',BR:'br'};
const DROP=/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|SVG|IMG|META|LINK|TEMPLATE|NOSCRIPT|BUTTON|INPUT|SELECT|TEXTAREA|VIDEO|AUDIO|CANVAS)$/i;
const KEEPCLS=new Set(['lg','il','nt','imp']);
const BLOCK=new Set(['h1','h2','h3','p','ol','ul','blockquote']);
function cleanHtml(html){
  const tp=document.createElement('template');tp.innerHTML=String(html||'');const root=document.createElement('div');
  (function walk(src,dst){for(const n of [...src.childNodes]){
    if(n.nodeType===3){dst.appendChild(document.createTextNode(n.nodeValue));continue}
    if(n.nodeType!==1||DROP.test(n.tagName))continue;
    const tag=ALLOW[n.tagName.toUpperCase()];
    if(!tag){walk(n,dst);continue}
    const el=document.createElement(tag);
    for(const c of n.classList||[])if(KEEPCLS.has(c))el.classList.add(c);
    if(tag==='blockquote'){const r=n.getAttribute('data-ref');if(r)el.setAttribute('data-ref',r.slice(0,80))}
    walk(n,el);dst.appendChild(el)}})(tp.content,root);
  // bloques en el primer nivel; texto suelto va dentro de <p>
  const fin=document.createElement('div');let cur=null;
  for(const n of [...root.childNodes]){const isB=n.nodeType===1&&BLOCK.has(n.tagName.toLowerCase());
    if(isB){cur=null;fin.appendChild(n)}else{if(n.nodeType===3&&!n.nodeValue.trim()&&!cur)continue;if(!cur){cur=document.createElement('p');fin.appendChild(cur)}cur.appendChild(n)}}
  // bloques anidados en <p> o <li> se aplanan
  $$('p p, li p, h1 p, h2 p, h3 p',fin).forEach(x=>{x.replaceWith(...x.childNodes)});
  return fin.innerHTML;
}
function docOf(s){const d=document.createElement('div');d.innerHTML=getHtml(s);return d}
function derive(s){
  if(!s.html){const r=linesToHtml(s.body,{title:(s.title||'').trim(),passage:(s.passage||'').trim()});
    return{title:r.title||s.title||'',passage:r.passage||s.passage||'',points:[...r.html.matchAll(/<h2>([^<]*)<\/h2>/g)].filter(m=>!secOf(m[1].replace(/&[a-z#0-9]+;/gi,' '))).length,text:s.body||''}}
  const d=docOf(s);const h1=d.querySelector('h1');let title=(h1?h1.textContent:'').trim();
  if(!title){const f=[...d.children].find(x=>x.textContent.trim());title=f?f.textContent.trim().slice(0,120):''}
  const bq=d.querySelector('blockquote[data-ref]');let passage=bq?bq.getAttribute('data-ref'):'';
  if(!passage){const m=d.textContent.match(/texto\s*base\s*:\s*([^\n]{3,40})/i);if(m&&isRef(m[1]))passage=cleanRef(m[1])}
  const points=$$('h2',d).filter(h=>!secOf(h.textContent)).length;
  return{title,passage,points,text:d.textContent}
}
const isPreached=s=>(s.log&&s.log.length)||Object.keys(s.preached||{}).length;
function lastPreach(s){let best=null;(s.log||[]).forEach(l=>{if(!best||l.date>best.date)best=l});
  if(!best){const p=s.preached||{};Object.keys(p).forEach(k=>{if(!best||p[k]>best.date)best={place:k,date:p[k]}})}return best}
const placeName=l=>l?(l.place==='sede'?t('sede'):l.place==='anexo'?t('anexo'):(l.placeName||t('other'))):'';
const catOf=s=>(s.category??s.series??'').trim();
const sLang=s=>{if(s.langSet&&s.lang)return s.lang;const k=s.id+'|'+(s.updated||0)+'|'+(s.html||'').length;if(!LDC.has(k)){const d=derive(s);LDC.set(k,detectSure(d.title+' '+d.text))}if(LDC.get(k))return LDC.get(k);if(s.lang)return s.lang;const tx=derive(s).text;return tx.trim().length>40?detectLang(tx):(prefs.ui==='pt'?'pt':'es')};

/* =========================================================
   Datos y sincronización
   ========================================================= */
const K={s:'pulpito.v1',a:'pulpito.agenda',m:'pulpito.meta',n:'pulpito.notas'};
let sermons=[],agenda=[],notes=[],meta={},authU=null,localMode=false,cols=null,unsubs=[],sync={ok:false,msg:'sync_conn'},ready=false;
const keyOf=k=>localMode||!authU?K[k]:K[k]+'.'+authU.uid;
function loadLocal(){sermons=ls.get(keyOf('s'),[])||[];notes=ls.get(keyOf('n'),[])||[];agenda=ls.get(keyOf('a'),[])||[];meta=ls.get(keyOf('m'),{})||{};fixMeta()}
function fixMeta(){if(meta.read&&typeof meta.read==='object')prefs.p=Object.assign({},prefs.p,meta.read);if(!Array.isArray(meta.cats))meta.cats=t('cats').slice();if(!Array.isArray(meta.favVerses))meta.favVerses=[];if(!Array.isArray(meta.dicFav))meta.dicFav=[];if(!Array.isArray(meta.dicHist))meta.dicHist=[];if(!Array.isArray(meta.curFav))meta.curFav=[];if(typeof meta.name!=='string')meta.name=''}
function cacheAll(){ls.set(keyOf('n'),notes);ls.set(keyOf('s'),sermons);ls.set(keyOf('a'),agenda);ls.set(keyOf('m'),meta)}
const strip=x=>{const c=JSON.parse(JSON.stringify(x));delete c.id;return c};
function setSync(ok,msg){sync={ok,msg};$$('[data-sync]').forEach(el=>{el.innerHTML=syncHtml()})}
const syncHtml=()=>`<span class="dot ${sync.ok?'ok':''}"></span>${esc(t(sync.msg))}`;

function putSermon(s,{silent,keep}={}){if(!keep)s.updated=Date.now();const i=sermons.findIndex(x=>x.id===s.id);if(i<0)sermons.unshift(s);else sermons[i]=s;cacheAll();
  if(cols)cols.s.doc(s.id).set(strip(s)).catch(()=>setSync(false,'sync_pend'));if(!silent)refreshBg()}
function delSermon(id){const s=sermons.find(x=>x.id===id);if(!s)return;s.deleted=Date.now();putSermon(s)}
function hardDelSermon(id){sermons=sermons.filter(x=>x.id!==id);cacheAll();if(cols)cols.s.doc(id).delete().catch(()=>{});refreshBg()}
const liveS=()=>sermons.filter(s=>!s.deleted),liveN=()=>notes.filter(n=>!n.deleted);
function putNote(n,{silent}={}){n.updated=Date.now();const i=notes.findIndex(x=>x.id===n.id);if(i<0)notes.unshift(n);else notes[i]=n;cacheAll();if(cols&&cols.n)cols.n.doc(n.id).set(strip(n)).catch(()=>{});if(!silent)refreshBg()}
function hardDelNote(id){notes=notes.filter(x=>x.id!==id);cacheAll();if(cols&&cols.n)cols.n.doc(id).delete().catch(()=>{});refreshBg()}
function purgeTrash(){const lim=Date.now()-30*864e5;sermons.filter(s=>s.deleted&&s.deleted<lim).forEach(s=>hardDelSermon(s.id));notes.filter(n=>n.deleted&&n.deleted<lim).forEach(n=>hardDelNote(n.id))}
function putEvent(e){e.updated=Date.now();const i=agenda.findIndex(x=>x.id===e.id);if(i<0)agenda.push(e);else agenda[i]=e;cacheAll();if(cols)cols.a.doc(e.id).set(strip(e)).catch(()=>{})}
function delEvent(id){agenda=agenda.filter(x=>x.id!==id);cacheAll();if(cols)cols.a.doc(id).delete().catch(()=>{})}
function putMeta(){meta.updated=Date.now();cacheAll();if(cols)cols.m.set(JSON.parse(JSON.stringify(meta))).catch(()=>{})}

/* ===== Panel del administrador (solo el dueño) · estadísticas y acceso ===== */
const ADMIN_EMAIL='tudeliveryd@gmail.com';const APP_VER='v68';
function isAdmin(){return !!(authU&&(authU.email||'').toLowerCase()===ADMIN_EMAIL)}
let planState=null,blocked=false;
function track(k){try{const u=ls.get('mp.uses',{});u[k]=(u[k]||0)+1;ls.set('mp.uses',u)}catch(e){}}
// Estadísticas: solo números (sermones, fechas, idioma). NUNCA el contenido de los sermones.
function pushStats(force){if(!cols||!authU||localMode||!window.firebase)return;const now=Date.now();
  const sig=liveS().length+'|'+liveN().length+'|'+agenda.length+'|'+(meta.name||'');const prev=ls.get('mp.stats.sig',{});
  if(!force&&prev.sig===sig&&now-(prev.at||0)<6*3600e3)return;ls.set('mp.stats.sig',{sig,at:now});
  const ck='mp.created.'+authU.uid;const created=ls.get(ck,0)||now;ls.set(ck,created);
  const d={email:(authU.email||'').toLowerCase(),name:meta.name||'',lang:prefs.ui,sermons:liveS().length,
    preached:liveS().filter(isPreached).length,notes:liveN().length,events:agenda.length,
    uses:ls.get('mp.uses',{}),seen:now,created,ver:APP_VER};
  try{firebase.firestore().collection('stats').doc(authU.uid).set(d,{merge:true}).catch(()=>{})}catch(e){}}
let planLoaded=false;
const waitingOk=()=>!!(PCFG.gate&&planLoaded&&!isAdmin()&&!(planState&&(planState.ok||PMON[planState.plan])));
function applyPlan(){const b=!!(planState&&planState.blocked)||waitingOk();if(b===blocked)return;blocked=b;if(b)showBlocked();else if(ready)go(view.tab||'home')}
function watchPlan(u){try{firebase.firestore().collection('planos').doc(u.uid).onSnapshot(d=>{planState=d.exists?d.data():null;planLoaded=true;applyPlan()},()=>{})}catch(e){}}
function showBlocked(){$('#nav').hidden=true;document.documentElement.classList.remove('tabs');const w=!(planState&&planState.blocked);const wa=String(PCFG.wa||'').replace(/\D/g,'');const em=(authU&&authU.email)||'';
  $('#app').innerHTML=`<div class="login"><div class="brand"><img class="b-d" src="logo-name.png" alt="Meu Púlpito"><img class="b-l" src="logo-name-light.png" alt="Meu Púlpito"><div class="tagline"><i></i><span>${esc(t('tagline'))}</span><i></i></div></div><h2>${esc(t(w?'wt_t':'blk_t'))}</h2><p class="sub" style="font-size:15px;line-height:1.55">${esc(t(w?'wt_d':'blk_d'))}</p>${w&&em?`<p class="sub" style="margin:0;font-size:14px">${esc(t('wt_acc'))}: <b>${esc(em)}</b></p>`:''}${w&&wa?`<a class="btn gold block" href="https://wa.me/${wa}?text=${encodeURIComponent(t('wt_msg',{e:em}))}" target="_blank" rel="noopener">${ic('chat')}${esc(t('wt_wa'))}</a>`:''}<button class="btn ghost block" data-act="logout">${esc(t('logout'))}</button></div>`}
/* =========================================================
   Planes: Gratis · Premium mensual · trimestral · anual
   El plan de cada cuenta está en planos/{uid} y SOLO el administrador puede cambiarlo (reglas de Firestore).
   Precios, límites y el «período de pruebas» están en config/app, editables desde el panel.
   ========================================================= */
const PCFG_DEF={test:true,gate:false,grace:3,warn:7,wa:'',p:{m:{pyg:45000,brl:35},t:{pyg:120000,brl:95},a:{pyg:350000,brl:270}},free:{serm:5,dic:5,cur:15}};
let PCFG=Object.assign({},PCFG_DEF,ls.get('mp.pcfg',{}));
function watchCfg(){try{firebase.firestore().collection('config').doc('app').onSnapshot(d=>{if(d.exists){PCFG=Object.assign({},PCFG_DEF,d.data());PCFG.p=Object.assign({},PCFG_DEF.p,PCFG.p||{});PCFG.free=Object.assign({},PCFG_DEF.free,PCFG.free||{});ls.set('mp.pcfg',PCFG);applyPlan();if(ready&&!view.overlay&&!blocked)refreshBg()}},()=>{})}catch(e){}}
const PMON={m:1,t:3,a:12};
function planNow(){const p=planState||{};const until=p.until||0;const now=Date.now();const gr=(+PCFG.grace||0)*864e5;
  const active=PMON[p.plan]&&until>now;const grace=!!(PMON[p.plan]&&until&&until<=now&&until+gr>now);const paid=active||grace;
  return{plan:paid?p.plan:'free',paid,active,grace,graceEnd:until+gr,daysLeft:active?Math.ceil((until-now)/864e5):0,test:!!PCFG.test,premium:paid||!!PCFG.test||isAdmin(),until,since:p.since||0,expired:!!(PMON[p.plan]&&until&&until<=Date.now()),last:p.plan,pays:Array.isArray(p.pays)?p.pays:[]}}
const isPremium=()=>planNow().premium;
const money=(n,c)=>c==='brl'?'R$ '+n.toLocaleString('pt-BR'):'₲ '+n.toLocaleString('es-PY');
const fmtDay=ts=>ts?new Date(ts).toLocaleDateString(prefs.ui==='pt'?'pt-BR':'es-PY',{day:'2-digit',month:'short',year:'numeric'}):'—';
const addMonths=(ts,n)=>{const d=new Date(ts);d.setMonth(d.getMonth()+n);return d.getTime()};
Object.assign(I18N.es,{pl_choose:'Elige tu plan',pl_terms:'Términos de uso',pl_sub:'Use Meu Púlpito gratis o desbloquee todas las herramientas con Premium.',pl_free:'Gratis',pl_m:'Premium Mensual',pl_t:'Premium Trimestral',pl_a:'Premium Anual',pl_best:'MEJOR PRECIO · AHORRA CON EL PLAN ANUAL',
  pl_per_m:'por mes',pl_per_t:'cada 3 meses',pl_per_a:'por año',pl_save:'Ahorra {n}% frente al mensual',pl_eq:'equivale a {v} por mes',
  pl_go_free:'Continuar gratis',pl_go_m:'Elegir Premium Mensual',pl_go_t:'Elegir Premium Trimestral',pl_go_a:'Elegir Premium Anual',
  pl_f1:'Hasta {n} sermones',pl_f2:'Editor, Biblia y Agenda completos',pl_f3:'Modo Predicar básico',pl_f4:'Diccionarios: {n} artículos completos por día',pl_f5:'{n} curiosidades bíblicas',pl_f6:'Favoritos e historial',
  pl_p1:'Sermones sin límite',pl_p2:'Diccionarios Bíblico, Hebreo y Griego completos',pl_p3:'Todas las curiosidades bíblicas',pl_p4:'Modo Predicar avanzado: traducción ES/PT y desplazamiento automático',pl_p5:'Sincronización y respaldo en su cuenta',pl_p6:'Todo lo del plan gratis',
  pl_cond:'Condiciones: el acceso dura el período pagado. Por ahora la renovación no es automática: antes del vencimiento le avisamos para renovar. Si no renueva, vuelve al plan gratis y conserva todos sus sermones.',
  pl_pay_t:'Contratar {p}',pl_pay_d:'Envíe un mensaje al administrador para pagar por transferencia, Pix o billetera. Cuando el administrador confirme el pago, su cuenta pasa a Premium.',pl_pay_wa:'Enviar mensaje por WhatsApp',pl_pay_mail:'Enviar correo',pl_pay_msg:'Hola, quiero contratar {p} de Meu Púlpito ({v}). Mi cuenta: {e}',
  pl_test:'Período de pruebas: todas las funciones están liberadas.',pl_lock_s:'El plan gratis permite hasta {n} sermones. Sus sermones no se pierden; para crear más, pase a Premium.',pl_lock_d:'El plan gratis permite {n} artículos completos por día en los diccionarios. Mañana se liberan de nuevo, o pase a Premium.',pl_lock_c:'Esta curiosidad es del plan Premium.',pl_lock_p:'Esta función del Modo Predicar es del plan Premium.',pl_see:'Ver planes',
  sub_t:'Mi suscripción',sub_plan:'Plan actual',sub_state:'Estado',sub_on:'Activa',sub_exp:'Vencida',sub_freeS:'Gratis',sub_since:'Contratado el',sub_until:'Vence el',sub_pays:'Pagos',sub_nopay:'Sin pagos registrados.',sub_change:'Cambiar de plan',sub_cancel:'Cancelar renovación',sub_cancel_d:'Su plan no se renueva solo: no hay nada que cancelar. Al vencer, vuelve al plan gratis y conserva sus datos.',sub_left:'{n} días restantes',
  ad_plan:'Plan',ad_cfg:'Precios y pruebas',ad_cfg_d:'Precios, límites del plan gratis, contacto y período de pruebas',ad_test:'Período de pruebas (todo liberado)',ad_wa:'WhatsApp para pagos (con código de país)',ad_save:'Guardar',ad_saved:'Guardado',ad_setp:'Plan de {u}',ad_from:'Desde',ad_to:'Hasta',ad_amt:'Monto pagado',ad_note:'Nota (ej.: transferencia Itaú)',ad_act:'Activar',ad_free:'Pasar a gratis',ad_cnt:'{f} gratis · {p} premium · {v} vencidas',ad_lim:'Límites del plan gratis: sermones · artículos por día · curiosidades',ad_done:'Plan actualizado',ad_gate:'Acceso solo con mi liberación',ad_days:'Días de aviso antes del vencimiento · días de gracia después',ad_soon:'Vence el {d}',ad_nsoon:'{n} plan(es) venciendo o en período de gracia: hable con ellos para renovar.',pv_renew:'Renovar',pv_soon:'Su plan Premium vence en {n} días',pv_today:'Su plan Premium vence hoy',pv_soon_d:'Vence el {d}. Renueve para seguir con todas las funciones.',pv_exp:'Su plan venció el {d}',pv_grace:'Le quedan {n} día(s) de gracia con Premium. Después vuelve al plan gratis; sus sermones no se pierden.',pv_free:'Volvió al plan gratis',pv_free_d:'Su Premium terminó. Sus sermones están todos guardados. Renueve cuando quiera para liberar todo de nuevo.',sub_grace:'En período de gracia',ad_gate_d:'Quien cree una cuenta queda esperando hasta que usted la libere en este panel.',ad_gate_on:'Acceso con liberación',ad_pend:'Esperando liberación',ad_npend:'{n} cuenta(s) esperando liberación. Toque «Activo» para liberar o «Bloqueado» para negar.',wt_t:'Su cuenta está esperando liberación',wt_d:'Meu Púlpito está en período de pruebas con acceso por invitación. Su cuenta ya fue creada; en cuanto el administrador la libere, se abre sola.',wt_acc:'Cuenta',wt_wa:'Pedir liberación por WhatsApp',wt_msg:'Hola, creé mi cuenta en Meu Púlpito y quiero pedir la liberación. Mi cuenta: {e}'});
Object.assign(I18N.pt,{pl_choose:'Escolha seu plano',pl_terms:'Termos de uso',pl_sub:'Use o Meu Púlpito grátis ou libere todas as ferramentas com o Premium.',pl_free:'Grátis',pl_m:'Premium Mensal',pl_t:'Premium Trimestral',pl_a:'Premium Anual',pl_best:'MELHOR PREÇO · ECONOMIZE COM O PLANO ANUAL',
  pl_per_m:'por mês',pl_per_t:'a cada 3 meses',pl_per_a:'por ano',pl_save:'Economize {n}% em relação ao mensal',pl_eq:'equivale a {v} por mês',
  pl_go_free:'Continuar grátis',pl_go_m:'Escolher Premium Mensal',pl_go_t:'Escolher Premium Trimestral',pl_go_a:'Escolher Premium Anual',
  pl_f1:'Até {n} sermões',pl_f2:'Editor, Bíblia e Agenda completos',pl_f3:'Modo Pregar básico',pl_f4:'Dicionários: {n} artigos completos por dia',pl_f5:'{n} curiosidades bíblicas',pl_f6:'Favoritos e histórico',
  pl_p1:'Sermões sem limite',pl_p2:'Dicionários Bíblico, Hebraico e Grego completos',pl_p3:'Todas as curiosidades bíblicas',pl_p4:'Modo Pregar avançado: tradução ES/PT e rolagem automática',pl_p5:'Sincronização e backup na sua conta',pl_p6:'Tudo do plano grátis',
  pl_cond:'Condições: o acesso dura o período pago. Por enquanto a renovação não é automática: antes do vencimento avisamos para renovar. Se não renovar, volta ao plano grátis e mantém todos os seus sermões.',
  pl_pay_t:'Contratar {p}',pl_pay_d:'Envie uma mensagem ao administrador para pagar por Pix, transferência ou carteira. Quando o administrador confirmar o pagamento, sua conta passa a Premium.',pl_pay_wa:'Enviar mensagem no WhatsApp',pl_pay_mail:'Enviar e-mail',pl_pay_msg:'Olá, quero contratar o {p} do Meu Púlpito ({v}). Minha conta: {e}',
  pl_test:'Período de testes: todas as funções estão liberadas.',pl_lock_s:'O plano grátis permite até {n} sermões. Seus sermões não se perdem; para criar mais, passe para o Premium.',pl_lock_d:'O plano grátis permite {n} artigos completos por dia nos dicionários. Amanhã libera de novo, ou passe para o Premium.',pl_lock_c:'Esta curiosidade é do plano Premium.',pl_lock_p:'Esta função do Modo Pregar é do plano Premium.',pl_see:'Ver planos',
  sub_t:'Minha assinatura',sub_plan:'Plano atual',sub_state:'Situação',sub_on:'Ativa',sub_exp:'Vencida',sub_freeS:'Grátis',sub_since:'Contratado em',sub_until:'Vence em',sub_pays:'Pagamentos',sub_nopay:'Nenhum pagamento registrado.',sub_change:'Mudar de plano',sub_cancel:'Cancelar renovação',sub_cancel_d:'Seu plano não renova sozinho: não há nada para cancelar. Ao vencer, volta ao plano grátis e mantém seus dados.',sub_left:'{n} dias restantes',
  ad_plan:'Plano',ad_cfg:'Preços e testes',ad_cfg_d:'Preços, limites do plano grátis, contato e período de testes',ad_test:'Período de testes (tudo liberado)',ad_wa:'WhatsApp para pagamentos (com código do país)',ad_save:'Salvar',ad_saved:'Salvo',ad_setp:'Plano de {u}',ad_from:'De',ad_to:'Até',ad_amt:'Valor pago',ad_note:'Nota (ex.: Pix, transferência Itaú)',ad_act:'Ativar',ad_free:'Passar para grátis',ad_cnt:'{f} grátis · {p} premium · {v} vencidas',ad_lim:'Limites do plano grátis: sermões · artigos por dia · curiosidades',ad_done:'Plano atualizado',ad_gate:'Acesso só com a minha liberação',ad_days:'Dias de aviso antes do vencimento · dias de carência depois',ad_soon:'Vence em {d}',ad_nsoon:'{n} plano(s) vencendo ou em carência: fale com eles para renovar.',pv_renew:'Renovar',pv_soon:'Seu plano Premium vence em {n} dias',pv_today:'Seu plano Premium vence hoje',pv_soon_d:'Vence em {d}. Renove para continuar com todas as funções.',pv_exp:'Seu plano venceu em {d}',pv_grace:'Você ainda tem {n} dia(s) de carência com Premium. Depois volta ao plano grátis; seus sermões não se perdem.',pv_free:'Voltou ao plano grátis',pv_free_d:'Seu Premium terminou. Seus sermões estão todos guardados. Renove quando quiser para liberar tudo de novo.',sub_grace:'Em carência',ad_gate_d:'Quem criar uma conta fica aguardando até você liberar neste painel.',ad_gate_on:'Acesso com liberação',ad_pend:'Aguardando liberação',ad_npend:'{n} conta(s) aguardando liberação. Toque em «Ativo» para liberar ou «Bloqueado» para negar.',wt_t:'Sua conta está aguardando liberação',wt_d:'O Meu Púlpito está em período de testes com acesso por convite. Sua conta já foi criada; assim que o administrador liberar, o app abre sozinho.',wt_acc:'Conta',wt_wa:'Pedir liberação no WhatsApp',wt_msg:'Olá, criei minha conta no Meu Púlpito e quero pedir a liberação. Minha conta: {e}'});
const planName=k=>t(k==='free'?'pl_free':'pl_'+k);
const curOrder=()=>prefs.ui==='pt'?['brl','pyg']:['pyg','brl'];
function priceLine(k){return curOrder().map(c=>money(PCFG.p[k][c],c)).join(' · ')}
function planSave(k){const m=PCFG.p.m,x=PCFG.p[k];const c=curOrder()[0];return Math.round((1-x[c]/(m[c]*PMON[k]))*100)}
/* pantalla «Elige tu plan» */
function plansSheet(reason){const N=planNow();const F=PCFG.free;const c=curOrder()[0];
  const feat=a=>`<ul class="pl-f">${a.map(x=>`<li>${ic('check')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const card=k=>{const x=PCFG.p[k];const sv=k==='m'?0:planSave(k);const cur=N.paid&&N.plan===k;
    return`<div class="pl-card ${k==='a'?'best':''}">${k==='a'?`<span class="pl-badge">${esc(t('pl_best'))}</span>`:''}
      <div class="pl-h"><b>${esc(planName(k))}</b>${cur?`<span class="tag ok">${esc(t('sub_on'))}</span>`:''}</div>
      <div class="pl-price">${esc(money(x[c],c))} <small>${esc(t('pl_per_'+k))}</small></div>
      <span class="sub">${esc(money(x[c==='brl'?'pyg':'brl'],c==='brl'?'pyg':'brl'))} ${esc(t('pl_per_'+k))}${k!=='m'?' · '+esc(t('pl_eq',{v:money(Math.round(x[c]/PMON[k]),c)})):''}</span>
      ${sv>0?`<span class="pl-save">${esc(t('pl_save',{n:sv}))}</span>`:''}
      ${k==='m'?feat([t('pl_p1'),t('pl_p2'),t('pl_p3'),t('pl_p4'),t('pl_p5'),t('pl_p6')]):''}
      <button class="btn ${k==='a'?'gold':'dark'} block" data-pl-go="${k}">${esc(t('pl_go_'+k))}</button></div>`};
  const sh=openSheet(`<div class="pl-wrap"><div class="between"><h3 class="pl-t">${esc(t('pl_choose'))}</h3><button class="iconbtn" data-pl-x aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    ${reason?`<p class="pl-why">${esc(reason)}</p>`:`<p class="sub" style="margin:0;font-size:14.5px">${esc(t('pl_sub'))}</p>`}
    ${N.test?`<p class="pl-testn">${ic('check')}${esc(t('pl_test'))}</p>`:''}
    <div class="pl-grid">
    <div class="pl-card"><div class="pl-h"><b>${esc(t('pl_free'))}</b>${!N.paid?`<span class="tag">${esc(t('sub_plan'))}</span>`:''}</div><div class="pl-price">${esc(money(0,c))}</div>
      ${feat([t('pl_f1',{n:F.serm}),t('pl_f2'),t('pl_f3'),t('pl_f4',{n:F.dic}),t('pl_f5',{n:F.cur}),t('pl_f6')])}
      <button class="btn ghost block" data-pl-x>${esc(t('pl_go_free'))}</button></div>
    ${card('m')}${card('t')}${card('a')}</div>
    <p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('pl_cond'))} <a href="/legal.html#terminos" target="_blank" rel="noopener" style="text-decoration:underline">${esc(t('pl_terms'))}</a></p></div>`,{cls:'tall'});
  sh.addEventListener('click',e=>{if(e.target.closest('[data-pl-x]')){closeSheet();return}const b=e.target.closest('[data-pl-go]');if(b)planContact(b.dataset.plGo)})}
function planContact(k){const c=curOrder()[0];const v=money(PCFG.p[k][c],c)+' '+t('pl_per_'+k);const em=(authU&&authU.email)||'';
  const msg=t('pl_pay_msg',{p:planName(k),v,e:em});const wa=String(PCFG.wa||'').replace(/\D/g,'');
  const sh=openSheet(`<h3>${esc(t('pl_pay_t',{p:planName(k)}))}</h3><p class="pl-price" style="margin:0">${esc(v)}</p><p style="margin:0;line-height:1.5">${esc(t('pl_pay_d'))}</p>
    ${wa?`<a class="btn gold block" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ic('chat')}${esc(t('pl_pay_wa'))}</a>`:''}
    <a class="btn ${wa?'ghost':'gold'} block" href="mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Meu Púlpito · '+planName(k))}&body=${encodeURIComponent(msg)}">${esc(t('pl_pay_mail'))}</a>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('pl_cond'))}</p>`)}
/* bloqueo con explicación (los datos nunca se tocan) */
function planGate(kind){if(isPremium())return true;const F=PCFG.free;
  const msg={serm:t('pl_lock_s',{n:F.serm}),dic:t('pl_lock_d',{n:F.dic}),cur:t('pl_lock_c'),preg:t('pl_lock_p')}[kind];plansSheet(msg);return false}
function canNewSermon(){return isPremium()||liveS().length<PCFG.free.serm||planGate('serm')}
function dicQuota(){if(isPremium())return true;const k='mp.dq.'+todayISO();const n=ls.get(k,0);if(n>=PCFG.free.dic)return planGate('dic');ls.set(k,n+1);return true}
const curFree=id=>isPremium()||id<=0||curFreeIds().has(id);
function curFreeIds(){const n=PCFG.free.cur;const out=new Set();if(!CUR)return out;const by={};CUR.e.forEach(e=>(by[e.cat]=by[e.cat]||[]).push(e.id));
  const cats=Object.keys(by);let i=0;while(out.size<Math.min(n,CUR.e.length)){const c=cats[i%cats.length];const l=by[c];const j=Math.floor(i/cats.length);if(j<l.length)out.add(l[j]);i++;if(i>500)break}return out}
/* sección «Mi suscripción» en Configuración */
function subHtml(){const N=planNow();const L=prefs.ui;const left=N.paid?Math.max(0,Math.ceil((N.until-Date.now())/864e5)):0;
  const pays=N.pays.slice().sort((a,b)=>(b.at||0)-(a.at||0));
  return`<div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch;gap:10px">
    <span class="k">${esc(t('sub_t'))}</span>
    <div class="sub-grid"><span>${esc(t('sub_plan'))}</span><b>${esc(N.paid?planName(N.plan):t('pl_free'))}</b>
      <span>${esc(t('sub_state'))}</span><b>${N.grace?`<span class="tag warn">${esc(t('sub_grace'))}</span>`:N.paid?`<span class="tag ok">${esc(t('sub_on'))}</span> <small class="sub">${esc(t('sub_left',{n:left}))}</small>`:N.expired?`<span class="tag warn">${esc(t('sub_exp'))}</span>`:esc(t('sub_freeS'))}</b>
      ${N.since?`<span>${esc(t('sub_since'))}</span><b>${esc(fmtDay(N.since))}</b>`:''}
      ${N.until?`<span>${esc(t('sub_until'))}</span><b>${esc(fmtDay(N.until))}</b>`:''}</div>
    ${N.test?`<p class="pl-testn" style="margin:0">${ic('check')}${esc(t('pl_test'))}</p>`:''}
    ${pays.length?`<span class="s">${esc(t('sub_pays'))}</span>${pays.map(p=>`<div class="sub-pay"><span>${esc(fmtDay(p.at))} · ${esc(planName(p.plan))}</span><b>${esc(p.amt?money(+p.amt,p.cur||'pyg'):'')}</b></div>`).join('')}`:''}
    <div class="two"><button class="btn sm gold" data-act="plans">${esc(t('sub_change'))}</button><button class="btn sm ghost" data-act="subCancel">${esc(t('sub_cancel'))}</button></div>
  </div></div>`}
/* administración */
async function admPlan(uid,label){const db=firebase.firestore();let cur={};try{const d=await db.collection('planos').doc(uid).get();cur=d.exists?d.data():{}}catch(e){}
  const iso=ts=>todayISO(new Date(ts));const today=PMON[cur.plan]&&cur.until>Date.now()?iso(cur.until+864e5/2):todayISO();let k=PMON[cur.plan]?cur.plan:'m';
  const sh=openSheet(`<h3>${esc(t('ad_setp',{u:label}))}</h3>
    <div class="seg" id="apK">${['m','t','a'].map(x=>`<button data-k="${x}" aria-pressed="${x===k}">${esc(planName(x).replace('Premium ',''))}</button>`).join('')}</div>
    <div class="two"><label class="fld"><span class="lb">${esc(t('ad_from'))}</span><input class="inp" type="date" id="apF" value="${today}"></label><label class="fld"><span class="lb">${esc(t('ad_to'))}</span><input class="inp" type="date" id="apT"></label></div>
    <div class="two"><label class="fld"><span class="lb">${esc(t('ad_amt'))}</span><input class="inp" id="apA" inputmode="numeric"></label><label class="fld"><span class="lb">&nbsp;</span><select class="inp" id="apC"><option value="pyg">₲ PYG</option><option value="brl">R$ BRL</option></select></label></div>
    <label class="fld"><span class="lb">${esc(t('ad_note'))}</span><input class="inp" id="apN"></label>
    <button class="btn gold block" id="apGo">${esc(t('ad_act'))}</button>
    ${PMON[cur.plan]?`<button class="btn ghost block" id="apFree">${esc(t('ad_free'))}</button>`:''}`);
  const sync=()=>{const f=new Date($('#apF',sh).value+'T12:00:00').getTime()||Date.now();$('#apT',sh).value=iso(addMonths(f,PMON[k]));const c=$('#apC',sh).value;$('#apA',sh).value=PCFG.p[k][c]};
  $('#apK',sh).onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;k=b.dataset.k;$$('#apK button',sh).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sync()};
  $('#apF',sh).onchange=sync;$('#apC',sh).onchange=sync;sync();
  $('#apGo',sh).onclick=async()=>{const since=new Date($('#apF',sh).value+'T00:00:00').getTime();const until=new Date($('#apT',sh).value+'T23:59:59').getTime();if(!since||!until||until<=since){toast(t('dict_err'));return}
    const pay={at:Date.now(),plan:k,amt:+String($('#apA',sh).value).replace(/\D/g,'')||0,cur:$('#apC',sh).value,note:$('#apN',sh).value.trim(),from:since,to:until};
    try{await db.collection('planos').doc(uid).set({plan:k,since,until,status:'active',updated:Date.now(),pays:firebase.firestore.FieldValue.arrayUnion(pay)},{merge:true});closeSheet();toast(t('ad_done'));closeSheet();adminPanel()}catch(e){toast(t('adm_err'))}};
  const fr=$('#apFree',sh);if(fr)fr.onclick=async()=>{try{await db.collection('planos').doc(uid).set({plan:'free',until:0,status:'free',updated:Date.now()},{merge:true});closeSheet();toast(t('ad_done'));closeSheet();adminPanel()}catch(e){toast(t('adm_err'))}}}
function admCfg(){const P=PCFG.p,F=PCFG.free;const row=k=>`<div class="ac-row"><b>${esc(planName(k).replace('Premium ',''))}</b><input class="inp" data-p="${k}.pyg" value="${P[k].pyg}" inputmode="numeric" aria-label="₲"><input class="inp" data-p="${k}.brl" value="${P[k].brl}" inputmode="numeric" aria-label="R$"></div>`;
  const sh=openSheet(`<h3>${esc(t('ad_cfg'))}</h3>
    <label class="prow" style="padding:0;gap:12px"><span><span class="k">${esc(t('ad_gate'))}</span><span class="s">${esc(t('ad_gate_d'))}</span></span><input type="checkbox" id="acG" ${PCFG.gate?'checked':''} style="width:24px;height:24px;flex:none"></label>
    <label class="prow" style="padding:0"><span class="k">${esc(t('ad_test'))}</span><input type="checkbox" id="acT" ${PCFG.test?'checked':''} style="width:24px;height:24px"></label>
    <div class="ac-row ac-h"><span></span><span>₲ PYG</span><span>R$ BRL</span></div>${row('m')}${row('t')}${row('a')}
    <span class="lbl">${esc(t('ad_lim'))}</span><div class="ac-row ac3"><input class="inp" id="acS" value="${F.serm}" inputmode="numeric"><input class="inp" id="acD" value="${F.dic}" inputmode="numeric"><input class="inp" id="acC" value="${F.cur}" inputmode="numeric"></div>
    <span class="lbl">${esc(t('ad_days'))}</span><div class="ac-row ac3" style="grid-template-columns:1fr 1fr"><input class="inp" id="acWn" value="${PCFG.warn??7}" inputmode="numeric" aria-label="aviso"><input class="inp" id="acGr" value="${PCFG.grace??3}" inputmode="numeric" aria-label="gracia"></div>
    <label class="fld"><span class="lb">${esc(t('ad_wa'))}</span><input class="inp" id="acW" value="${esc(PCFG.wa||'')}" placeholder="595981234567" inputmode="tel"></label>
    <button class="btn gold block" id="acGo">${esc(t('ad_save'))}</button>`);
  $('#acGo',sh).onclick=async()=>{const n=v=>Math.max(0,parseInt(String(v).replace(/\D/g,''),10)||0);const p={m:{},t:{},a:{}};$$('[data-p]',sh).forEach(i=>{const [k,c]=i.dataset.p.split('.');p[k][c]=n(i.value)});
    const cfg={test:$('#acT',sh).checked,gate:$('#acG',sh).checked,warn:n($('#acWn',sh).value),grace:n($('#acGr',sh).value),wa:$('#acW',sh).value.replace(/[^\d]/g,''),p,free:{serm:n($('#acS',sh).value)||5,dic:n($('#acD',sh).value),cur:n($('#acC',sh).value)},updated:Date.now()};
    try{await firebase.firestore().collection('config').doc('app').set(cfg);PCFG=Object.assign({},PCFG_DEF,cfg);ls.set('mp.pcfg',PCFG);closeSheet();toast(t('ad_saved'))}catch(e){toast(t('adm_err'))}}}

/* ---------- Panel del sitio meupulpito.com (solo administrador) ---------- */
async function admSite(){if(!isAdmin())return;let S={};try{const d=await firebase.firestore().collection('config').doc('site').get();S=d.exists?d.data():{}}catch(e){toast(t('adm_err'));return}
  const B=S.bar||{},H=S.hero||{};let TS=(Array.isArray(S.testi)?S.testi:[]).map(x=>Object.assign({q:'',n:'',r:'',on:true},x));
  const tRow=(x,i)=>`<div class="as-t" data-i="${i}"><div class="between"><b style="font-size:14px">${esc(t('as_t_n',{n:i+1}))}</b><span class="row" style="gap:6px"><label class="as-on"><input type="checkbox" data-k="on" ${x.on!==false?'checked':''}>${esc(t('as_show'))}</label><button class="iconbtn sm" data-del="${i}" aria-label="${esc(t('del_forever'))}">${ic('trash')}</button></span></div>
    <textarea class="inp" rows="3" data-k="q" placeholder="${esc(t('as_q_ph'))}">${esc(x.q)}</textarea>
    <input class="inp" data-k="n" value="${esc(x.n)}" placeholder="${esc(t('as_n_ph'))}"><input class="inp" data-k="r" value="${esc(x.r)}" placeholder="${esc(t('as_r_ph'))}"></div>`;
  const sh=openSheet(`<h3>${esc(t('as_btn'))}</h3>
    <span class="lbl">${esc(t('as_bar'))}</span>
    <label class="prow" style="padding:0;gap:12px"><span><span class="k">${esc(t('as_bar_on'))}</span><span class="s">${esc(t('as_bar_d'))}</span></span><input type="checkbox" id="asB" ${B.on?'checked':''} style="width:24px;height:24px;flex:none"></label>
    <input class="inp" id="asBes" value="${esc(B.es||'')}" placeholder="ES · ${esc(t('as_bar_ph_es'))}"><input class="inp" id="asBpt" value="${esc(B.pt||'')}" placeholder="PT · ${esc(t('as_bar_ph_pt'))}">
    <input class="inp" id="asBu" value="${esc(B.url||'')}" placeholder="${esc(t('as_bar_url'))}" inputmode="url" autocapitalize="off">
    <span class="lbl" style="margin-top:6px">${esc(t('as_hero'))}</span><p class="sub" style="margin:-4px 0 0;font-size:12.5px">${esc(t('as_hero_d'))}</p>
    <input class="inp" id="asHes" value="${esc((H.es||{}).t||'')}" placeholder="ES · Prepare y organice sus mensajes en un solo lugar."><textarea class="inp" rows="2" id="asDes" placeholder="ES · ${esc(t('as_sub'))}">${esc((H.es||{}).d||'')}</textarea>
    <input class="inp" id="asHpt" value="${esc((H.pt||{}).t||'')}" placeholder="PT · Prepare e organize suas mensagens em um só lugar."><textarea class="inp" rows="2" id="asDpt" placeholder="PT · ${esc(t('as_sub'))}">${esc((H.pt||{}).d||'')}</textarea>
    <span class="lbl" style="margin-top:6px">${esc(t('as_testi'))}</span><p class="sub" style="margin:-4px 0 0;font-size:12.5px">${esc(t('as_testi_d'))}</p>
    <div id="asTL" style="display:flex;flex-direction:column;gap:10px"></div>
    <button class="btn ghost block" id="asAdd">${ic('plus')}${esc(t('as_add'))}</button>
    <button class="btn gold block" id="asGo">${esc(t('ad_save'))}</button>
    <a class="lnk" href="/" target="_blank" rel="noopener" style="align-self:center;padding:8px">${esc(t('as_view'))}</a>`,{cls:'big ns'});
  const read=()=>{TS=$$('.as-t',sh).map(el=>({q:$('[data-k=q]',el).value.trim(),n:$('[data-k=n]',el).value.trim(),r:$('[data-k=r]',el).value.trim(),on:$('[data-k=on]',el).checked}))};
  const draw=()=>{$('#asTL',sh).innerHTML=TS.length?TS.map(tRow).join(''):`<p class="sub" style="margin:0;font-size:13px">${esc(t('as_none'))}</p>`};draw();
  $('#asAdd',sh).onclick=()=>{read();TS.push({q:'',n:'',r:'',on:true});draw();const l=$$('.as-t textarea',sh).pop();if(l)l.focus()};
  $('#asTL',sh).onclick=e=>{const b=e.target.closest('[data-del]');if(!b)return;read();TS.splice(+b.dataset.del,1);draw()};
  $('#asGo',sh).onclick=async()=>{read();const v=id=>$(id,sh).value.trim();let url=v('#asBu');if(url&&!/^https?:\/\//.test(url))url='https://'+url;
    const site={bar:{on:$('#asB',sh).checked,es:v('#asBes'),pt:v('#asBpt'),url},hero:{es:{t:v('#asHes'),d:v('#asDes')},pt:{t:v('#asHpt'),d:v('#asDpt')}},
      testi:TS.filter(x=>x.q&&x.n).map(x=>({q:x.q.slice(0,600),n:x.n.slice(0,80),r:x.r.slice(0,120),on:x.on})),updated:Date.now()};
    if(site.bar.on&&!site.bar.es&&!site.bar.pt){toast(t('as_bar_need'));return}
    try{await firebase.firestore().collection('config').doc('site').set(site);closeSheet();toast(t('as_saved'))}catch(e){toast(t('adm_err'))}}}
const VK={c:[['cPY','Paraguay'],['cBR','Brasil'],['cAR','Argentina'],['cBO','Bolivia'],['cUS','EE. UU.'],['cOT','other']],r:[['rIG','Instagram'],['rWA','WhatsApp'],['rGG','Google'],['rFB','Facebook'],['rDI','direct']],l:[['es','Español'],['pt','Português']],d:[['mob','mobile'],['dsk','desktop']]};
let visDays=30;
async function admVisits(){if(!isAdmin())return;const sh=openSheet(`<h3>${esc(t('av_btn'))}</h3><div id="avBody"><p class="sub" style="margin:0">${esc(t('adm_load'))}</p></div>`,{cls:'big ns'});
  let rows={};try{const q=await firebase.firestore().collection('siteStats').get();q.docs.forEach(d=>rows[d.id]=d.data())}catch(e){const el=$('#avBody',sh);if(el)el.innerHTML=`<p class="sub" style="margin:0">${esc(t('av_err'))}</p>`;return}
  const dayStr=n=>{const d=new Date(Date.now()-n*864e5);return d.toLocaleDateString('en-CA',{timeZone:'America/Asuncion'})};
  const draw=()=>{const el=$('#avBody',sh);if(!el)return;const N=visDays;const days=Array.from({length:N},(_,i)=>dayStr(N-1-i));
    const sum=(k,ds=days)=>ds.reduce((a,d)=>a+((rows[d]||{})[k]||0),0);const td=rows[dayStr(0)]||{};
    const mx=Math.max(1,...days.map(d=>(rows[d]||{}).v||0));const lab=k=>t('av_'+k)!=='av_'+k?t('av_'+k):k;
    const bars=(list)=>{const tot=list.reduce((a,[k])=>a+sum(k),0)||1;return list.map(([k,nm])=>{const n=sum(k);return n?`<div class="av-b"><span>${esc(['other','direct','mobile','desktop'].includes(nm)?t('av_'+nm):nm)}</span><i style="--w:${Math.round(n/tot*100)}%"></i><b>${n}</b></div>`:''}).join('')||`<p class="sub" style="margin:0;font-size:13px">—</p>`};
    const v=sum('v'),go=sum('go'),wa=sum('wa');
    el.innerHTML=`<div class="seg sm"><button data-n="7" aria-pressed="${N===7}">${esc(t('av_7'))}</button><button data-n="30" aria-pressed="${N===30}">${esc(t('av_30'))}</button></div>
      <div class="stats"><div class="stat"><b>${td.v||0}</b><span>${esc(t('av_today'))}</span></div><div class="stat"><b>${v}</b><span>${esc(t('av_visits'))}</span></div><div class="stat"><b>${sum('u')}</b><span>${esc(t('av_people'))}</span></div></div>
      <div class="stats"><div class="stat"><b>${go}</b><span>${esc(t('av_go'))}</span></div><div class="stat"><b>${wa}</b><span>${esc(t('av_wa'))}</span></div><div class="stat"><b>${v?Math.round(go/v*100):0}%</b><span>${esc(t('av_conv'))}</span></div></div>
      <span class="lbl">${esc(t('av_per_day'))}</span>
      <div class="av-ch" role="img" aria-label="${esc(t('av_per_day'))}">${days.map(d=>{const n=(rows[d]||{}).v||0;return`<div class="av-c" title="${d}: ${n}"><i style="--h:${Math.round(n/mx*100)}%"></i>${N===7?`<span>${d.slice(8)}</span>`:''}</div>`}).join('')}</div>
      ${N===30?`<div class="between" style="margin-top:-6px"><span class="sub" style="font-size:11.5px">${fmtDay(new Date(days[0]+'T12:00:00').getTime())}</span><span class="sub" style="font-size:11.5px">${esc(t('av_today'))}</span></div>`:''}
      <span class="lbl">${esc(t('av_country'))}</span>${bars(VK.c)}
      <span class="lbl">${esc(t('av_from'))}</span>${bars(VK.r)}
      <span class="lbl">${esc(t('av_lang'))} · ${esc(t('av_dev'))}</span>${bars(VK.l)}${bars(VK.d)}
      <p class="sub" style="font-size:11.5px;margin:0">${esc(t('av_note'))}</p>`;
    $$('.seg button',el).forEach(b=>b.onclick=()=>{visDays=+b.dataset.n;draw()})};draw()}
Object.assign(I18N.es,{as_sec:'Sitio meupulpito.com',as_btn:'Textos y testimonios',av_btn:'Visitas del sitio',as_note:'Precios, límites del plan gratis y WhatsApp de «Precios y pruebas» también aparecen en el sitio.',
  as_bar:'Aviso en la parte de arriba',as_bar_on:'Mostrar aviso',as_bar_d:'Una franja dorada arriba del sitio, por ejemplo para una promoción.',as_bar_ph_es:'Ej.: Promoción de lanzamiento: 20% en el plan anual',as_bar_ph_pt:'Ex.: Promoção de lançamento: 20% no plano anual',as_bar_url:'Enlace al tocar (opcional)',as_bar_need:'Escribe el texto del aviso',
  as_hero:'Título principal',as_hero_d:'Deja en blanco para usar el texto original.',as_sub:'Subtítulo',as_testi:'Testimonios',as_testi_d:'Solo testimonios reales, con autorización de la persona. Aparecen en el sitio cuando hay al menos uno marcado.',
  as_t_n:'Testimonio {n}',as_show:'Mostrar',as_q_ph:'Lo que dijo, con sus palabras',as_n_ph:'Nombre (ej.: Pr. Luis Gómez)',as_r_ph:'Iglesia · Ciudad',as_add:'Agregar testimonio',as_none:'Todavía no hay testimonios.',as_saved:'Sitio actualizado',as_view:'Ver el sitio',
  av_7:'7 días',av_30:'30 días',av_today:'Hoy',av_visits:'Visitas',av_people:'Personas',av_go:'Tocaron Acceder',av_wa:'Tocaron WhatsApp',av_conv:'Fueron al app',av_per_day:'Visitas por día',av_country:'País',av_from:'De dónde vinieron',av_lang:'Idioma',av_dev:'Aparato',
  av_other:'Otros',av_direct:'Directo / otro',av_mobile:'Celular',av_desktop:'Computadora',av_err:'No se pudo cargar. Verifique que publicó las reglas nuevas de Firebase.',av_note:'Solo números, sin datos de las personas. No cuenta sus propias visitas desde este celular. «Personas» cuenta cada aparato una vez por día.'});
Object.assign(I18N.pt,{as_sec:'Site meupulpito.com',as_btn:'Textos e depoimentos',av_btn:'Visitas do site',as_note:'Preços, limites do plano grátis e WhatsApp de «Preços e testes» também aparecem no site.',
  as_bar:'Aviso no topo',as_bar_on:'Mostrar aviso',as_bar_d:'Uma faixa dourada no topo do site, por exemplo para uma promoção.',as_bar_ph_es:'Ej.: Promoción de lanzamiento: 20% en el plan anual',as_bar_ph_pt:'Ex.: Promoção de lançamento: 20% no plano anual',as_bar_url:'Link ao tocar (opcional)',as_bar_need:'Escreva o texto do aviso',
  as_hero:'Título principal',as_hero_d:'Deixe em branco para usar o texto original.',as_sub:'Subtítulo',as_testi:'Depoimentos',as_testi_d:'Só depoimentos reais, com autorização da pessoa. Aparecem no site quando há pelo menos um marcado.',
  as_t_n:'Depoimento {n}',as_show:'Mostrar',as_q_ph:'O que a pessoa disse, com as palavras dela',as_n_ph:'Nome (ex.: Pr. Luis Gómez)',as_r_ph:'Igreja · Cidade',as_add:'Adicionar depoimento',as_none:'Ainda não há depoimentos.',as_saved:'Site atualizado',as_view:'Ver o site',
  av_7:'7 dias',av_30:'30 dias',av_today:'Hoje',av_visits:'Visitas',av_people:'Pessoas',av_go:'Tocaram Acessar',av_wa:'Tocaram WhatsApp',av_conv:'Foram ao app',av_per_day:'Visitas por dia',av_country:'País',av_from:'De onde vieram',av_lang:'Idioma',av_dev:'Aparelho',
  av_other:'Outros',av_direct:'Direto / outro',av_mobile:'Celular',av_desktop:'Computador',av_err:'Não foi possível carregar. Confira se publicou as regras novas do Firebase.',av_note:'Só números, sem dados das pessoas. Não conta as suas próprias visitas deste celular. «Pessoas» conta cada aparelho uma vez por dia.'});

async function adminPanel(){if(!isAdmin())return;ADMP.at=0;const sh=openSheet(`<h3>${esc(t('adm_t'))}</h3><div id="admBody"><p class="sub" style="margin:0">${esc(t('adm_load'))}</p></div>`,{cls:'big'});
  let rows=[];try{const db=firebase.firestore();const[q,pq]=await Promise.all([db.collection('stats').get(),db.collection('planos').get()]);
    const pm={};pq.docs.forEach(d=>pm[d.id]=d.data());rows=q.docs.map(d=>Object.assign({uid:d.id},d.data(),{plan:pm[d.id]||null}))}
  catch(e){const el=$('#admBody',sh);if(el)el.innerHTML=`<p class="sub" style="margin:0">${esc(t('adm_err'))}</p>`;return}
  if(!sh.isConnected)return;rows.sort((a,b)=>(b.seen||0)-(a.seen||0));
  const tot=rows.length,totS=rows.reduce((s,r)=>s+(r.sermons||0),0),a7=rows.filter(r=>Date.now()-(r.seen||0)<7*864e5).length;
  const uses={};rows.forEach(r=>Object.entries(r.uses||{}).forEach(([k,v])=>uses[k]=(uses[k]||0)+v));
  const uNames={pregar:t('adm_u_pregar'),dic:t('adm_u_dic'),ia:t('adm_u_ia')};
  const uTop=Object.entries(uses).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${uNames[k]||k}: ${v}`).join(' · ');
  const gr=(+PCFG.grace||0)*864e5,wn=(+PCFG.warn||7)*864e5;
  const pst=r=>{const p=r.plan||{};return PMON[p.plan]&&p.until>Date.now()?'p':PMON[p.plan]&&p.until?'v':'f'};
  const pst2=r=>{const p=r.plan||{};const n=Date.now();if(!PMON[p.plan]||!p.until)return'';if(p.until>n)return p.until-n<wn?'soon':'';return p.until+gr>n?'grace':'exp'};
  const cnt={f:0,p:0,v:0};rows.forEach(r=>cnt[pst(r)]++);const nSoon=rows.filter(r=>pst2(r)==='soon'||pst2(r)==='grace').length;
  const pend=r=>r.email!==ADMIN_EMAIL&&!(r.plan&&(r.plan.ok||r.plan.blocked||PMON[r.plan.plan]));const np=rows.filter(pend).length;
  rows.sort((a,b)=>(pend(b)?1:0)-(pend(a)?1:0));
  const row=r=>{const nm=r.name||r.email||r.uid.slice(0,6);const bl=!!(r.plan&&r.plan.blocked);const ps=pst(r);const pl=r.plan||{};
    return`<div class="adm-row"><div style="flex:1;min-width:0"><b>${esc(nm)}</b><span class="sub" style="display:block;font-size:12.5px;overflow-wrap:anywhere">${esc(r.email||'')}</span>
      <span class="sub" style="font-size:12.5px">${esc(t('adm_n_serm',{n:r.sermons||0}))} · ${esc(t('adm_seen',{d:r.seen?relDate(r.seen):'—'}))} · ${esc((r.lang||'').toUpperCase())}</span>
      <span style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">${pend(r)?`<span class="tag warn adm-pend">${esc(t('ad_pend'))}</span>`:''}${pst2(r)==='soon'?`<span class="tag warn">${esc(t('ad_soon',{d:fmtDay(pl.until)}))}</span>`:pst2(r)==='grace'?`<span class="tag warn">${esc(t('sub_grace'))} · ${esc(fmtDay(pl.until))}</span>`:ps==='p'?`<span class="tag ok">${esc(planName(pl.plan))} · ${esc(fmtDay(pl.until))}</span>`:ps==='v'?`<span class="tag warn">${esc(t('sub_exp'))} · ${esc(fmtDay(pl.until))}</span>`:`<span class="tag">${esc(t('pl_free'))}</span>`}<button class="lnk" data-act="admPlan" data-uid="${esc(r.uid)}" data-l="${esc(nm)}">${esc(t('ad_plan'))}</button></span></div>
      <div class="seg sm adm-seg" data-uid="${esc(r.uid)}"><button data-act="admBlock" data-uid="${esc(r.uid)}" data-b="0" aria-pressed="${!bl&&!pend(r)}">${esc(t('adm_on'))}</button><button data-act="admBlock" data-uid="${esc(r.uid)}" data-b="1" aria-pressed="${bl}">${esc(t('adm_off'))}</button></div></div>`};
  const el=$('#admBody',sh);if(!el)return;
  el.innerHTML=`<div class="stats"><div class="stat"><b>${tot}</b><span>${esc(t('adm_users'))}</span></div><div class="stat"><b>${a7}</b><span>${esc(t('adm_act7'))}</span></div><div class="stat"><b>${totS}</b><span>${esc(t('adm_serms'))}</span></div></div>
    ${uTop?`<p class="sub" style="margin:0;font-size:12.5px">${esc(t('adm_uses'))}: ${esc(uTop)}</p>`:''}
    ${np?`<p class="pl-why" style="margin:0">${esc(t('ad_npend',{n:np}))}</p>`:''}${nSoon?`<p class="pl-why" style="margin:0">${esc(t('ad_nsoon',{n:nSoon}))}</p>`:''}
    <p class="sub" style="margin:0;font-size:13px;font-weight:600">${PCFG.gate?esc(t('ad_gate_on'))+' · ':''}${esc(t('ad_cnt',cnt))}${PCFG.test?' · '+esc(t('ad_test')):''}</p>
    <button class="btn ghost block" data-act="admCfg">${ic('sliders')}${esc(t('ad_cfg'))}</button>
    <span class="lbl" style="margin-top:4px">${esc(t('as_sec'))}</span>
    <div class="adm-site"><button class="btn ghost" data-act="admSite">${ic('pen')}${esc(t('as_btn'))}</button><button class="btn ghost" data-act="admVis">${ic('user')}${esc(t('av_btn'))}</button></div>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('as_note'))}</p>
    <div class="adm-list">${rows.length?rows.map(row).join(''):`<p class="sub">${esc(t('adm_none'))}</p>`}</div>
    <p class="sub" style="font-size:11.5px;margin:0">${esc(t('adm_note'))}</p>`}
let bgT=0;function refreshBg(){clearTimeout(bgT);bgT=setTimeout(()=>{if(!view.tab||view.overlay)return;
  // No redibujar mientras la persona escribe en un campo (se perderían espacios o el cursor); se actualiza al salir del campo
  const a=document.activeElement;if(a&&/^(INPUT|TEXTAREA)$/.test(a.tagName)&&a.type!=='range'&&$('#app').contains(a)){a.addEventListener('blur',()=>refreshBg(),{once:true});return}
  render()},60)}

function subCol(ref,getL,setL,onAny){let first=true;
  return ref.onSnapshot({includeMetadataChanges:true},snap=>{
    const remote=snap.docs.map(d=>Object.assign({},d.data(),{id:d.id}));let arr=null;
    if(first&&!snap.metadata.fromCache){first=false;const map=new Map(remote.map(x=>[x.id,x]));
      getL().forEach(x=>{const r=map.get(x.id);if(!r||(x.updated||0)>(r.updated||0)){map.set(x.id,x);ref.doc(x.id).set(strip(x)).catch(()=>{})}});arr=[...map.values()]}
    else if(!first||remote.length)arr=remote;
    if(arr){setL(arr);cacheAll();onAny&&onAny(snap)}
  },err=>onAny&&onAny(null,err))}
function startCloud(u){authU=u;localMode=false;loadLocal();
  // Recuerda de qué correo es cada copia guardada; al cambiar de proyecto, la misma persona recupera sus sermones de este celular
  const em=(u.email||'').toLowerCase();if(em)ls.set('pulpito.acc.'+u.uid,em);
  if(em&&!ls.get('pulpito.mig.'+u.uid,false)){ls.set('pulpito.mig.'+u.uid,true);
    Object.keys(localStorage).filter(k=>k.startsWith('pulpito.acc.')&&k!=='pulpito.acc.'+u.uid&&ls.get(k,'')===em).map(k=>k.slice(12)).forEach(old=>{
      const add=(arr,k)=>{(ls.get(K[k]+'.'+old,[])||[]).forEach(x=>{if(x&&x.id&&!arr.some(y=>y.id===x.id))arr.push(x)})};
      add(sermons,'s');add(notes,'n');add(agenda,'a');
      const om=ls.get(K.m+'.'+old,null);if(om&&!meta.updated){meta=om;fixMeta()}});
    cacheAll()}
const anon=['s','n','a'].map(k=>(ls.get(K[k],[])||[]).filter(x=>x&&x.id&&!x.deleted));let migrated=false;ready=true;view.tab='home';go('home');setSync(false,'sync_conn');if(!ls.get('mp.onb',0))setTimeout(()=>{if(!blocked&&!$('.ov')&&!E)onboarding()},900);else if(window.__fromLogin)setTimeout(()=>{if(!blocked)toast(t('wb_back',{n:(meta.name||'').trim()||t('pastor')}))},700);window.__fromLogin=false;
  const db=firebase.firestore();
  const P=[()=>({s:db.collection('pulpito').doc(u.uid).collection('sermoes'),a:db.collection('pulpito').doc(u.uid).collection('agenda'),n:db.collection('pulpito').doc(u.uid).collection('notas'),m:db.collection('pulpito').doc(u.uid).collection('meta').doc('main')}),
           ()=>({s:db.collection('empresa').doc('pulpito').collection(u.uid),a:db.collection('empresa').doc('pulpito').collection(u.uid+'_agenda'),n:db.collection('empresa').doc('pulpito').collection(u.uid+'_notas'),m:db.collection('empresa').doc('pulpito').collection(u.uid+'_meta').doc('main')})];
  const PK='pulpito.path.'+u.uid;
  const listen=i=>{unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];
    if(i>=P.length){cols=null;setSync(false,'sync_noperm');return}
    cols=P[i]();
    unsubs.push(subCol(cols.s,()=>sermons,a=>{sermons=a},(snap,err)=>{
      if(err){if(err.code==='permission-denied')listen(i+1);else setSync(false,'sync_err');return}
      ls.set(PK,i);if(!migrated&&!snap.metadata.fromCache){migrated=true;const [as,an,aa]=anon;
        if(as.length||an.length||aa.length){ls.set('pulpito.anon.bak',{s:as,n:an,a:aa,at:Date.now()});
          as.forEach(x=>{if(!sermons.some(y=>y.id===x.id))cols.s.doc(x.id).set(strip(x)).catch(()=>{})});
          an.forEach(x=>{if(!notes.some(y=>y.id===x.id))cols.n.doc(x.id).set(strip(x)).catch(()=>{})});
          aa.forEach(x=>{if(!agenda.some(y=>y.id===x.id))cols.a.doc(x.id).set(strip(x)).catch(()=>{})});
          ['s','n','a'].forEach(k=>ls.set(K[k],[]))}}
      setSync(!snap.metadata.hasPendingWrites&&!snap.metadata.fromCache,snap.metadata.hasPendingWrites?'sync_pend':snap.metadata.fromCache?'sync_off':'sync_ok');refreshBg();if(!snap.metadata.fromCache)pushStats()}));
    unsubs.push(subCol(cols.a,()=>agenda,a=>{agenda=a},()=>refreshBg()));
    unsubs.push(subCol(cols.n,()=>notes,a=>{notes=a},()=>refreshBg()));
    unsubs.push(cols.m.onSnapshot(d=>{if(d.exists){const r=d.data();if((r.updated||0)>=(meta.updated||0)){meta=r;fixMeta();cacheAll();refreshBg()}else putMeta()}else if(meta.updated)putMeta()},()=>{}));
  };
  listen(+ls.get(PK,0)||0);watchPlan(u);watchCfg();
}
// Entrar con cuenta desde el modo sin cuenta: si el sistema de cuentas no cargó, lo intenta cargar de nuevo
function loadScript(u){return new Promise((ok,ko)=>{const sc=document.createElement('script');sc.src=u;sc.onload=ok;sc.onerror=ko;document.head.appendChild(sc);setTimeout(ko,12000)})}
let fbWait=null;
function fbReady(){return !!(window.firebase&&firebase.apps&&firebase.apps.length&&firebase.auth)}
function ensureFb(){if(fbReady())return Promise.resolve(true);if(fbWait)return fbWait;
  fbWait=(async()=>{try{if(!window.firebase||!firebase.auth||!firebase.firestore){for(const n of['app','auth','firestore'])await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-'+n+'-compat.js')}
      if(!firebase.apps.length)firebase.initializeApp(window.FIREBASE_CONFIG);try{firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
      firebase.auth().onAuthStateChanged(u=>{if(u&&!authU){localMode=false;ls.set('pulpito.local',false);startCloud(u)}});return true}
    catch(e){fbWait=null;return false}})();return fbWait}
async function toLogin(){ls.set('pulpito.local',false);localMode=false;showLogin()}
function startLocal(){localMode=true;ls.set('pulpito.local',true);unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;authU=null;loadLocal();ready=true;setSync(false,'sync_local');go(view.tab||'home')}
function anyShown(){return !!$('#app').firstElementChild}
function fallback(){if(anyShown())return;showLogin()}
function initStore(){
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg||!cfg.apiKey||!window.firebase||!firebase.auth||!firebase.firestore){showLogin();return}
  try{firebase.initializeApp(cfg)}catch(e){showLogin();return}
  try{firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  ls.set('pulpito.local',false);
  const tm=setTimeout(()=>{if(!authU&&!localMode)fallback()},2500);
  try{firebase.auth().onAuthStateChanged(u=>{clearTimeout(tm);if(u){if(!localMode||!ready)startCloud(u)}else if(!localMode)showLogin()},()=>{clearTimeout(tm);fallback()})}
  catch(e){clearTimeout(tm);fallback()}
}

/* =========================================================
   Hojas (sheets)
   ========================================================= */
function openSheet(html,{host,cls='',onClose}={}){
  const ov=document.createElement('div');ov.className='ov';ov.innerHTML=`<div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  ov.addEventListener('click',e=>{if(e.target===ov)closeSheet(ov)});ov._onClose=onClose;
  (host||$('#layer')).appendChild(ov);return ov.firstElementChild}
function closeSheet(ov){ov=ov||[...$$('.ov')].pop();if(!ov)return;const f=ov._onClose;ov.remove();f&&f()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.ov'))closeSheet()});

/* =========================================================
   Navegación
   ========================================================= */
const view={tab:'home',overlay:null};
let listState={q:'',f:'all',cat:'',mode:'s',nt:''};
const TABS=[['home','home','nav_home'],['list','doc','nav_list'],['bible','bible','nav_bible'],['dic','dict','nav_dic'],['agenda','cal','nav_agenda']];
function drawNav(){$('#navIn').innerHTML=TABS.map(([k,i,l])=>`<button data-act="tab" data-k="${k}" ${view.tab===k?'aria-current="page"':''}>${ic(i)}${esc(t(l))}</button>`).join('')}
const SUBP=['profile','cur'];
function go(tab){if(SUBP.includes(tab)&&!SUBP.includes(view.tab))view.prev=view.tab;view.tab=tab;view.overlay=null;render(true);window.scrollTo(0,0);$('#app').scrollTop=0}
function render(anim){
  if(!ready)return;if(blocked){showBlocked();return}const sub=SUBP.includes(view.tab);$('#nav').hidden=sub;document.documentElement.classList.toggle('tabs',!sub);document.documentElement.classList.toggle('subp',sub);drawNav();
  const app=$('#app');const keep=app.querySelector('input:focus');const sel=keep?[keep.id,keep.selectionStart]:null;
  const html={home:homeHtml,list:listHtml,bible:bibleHtml,dic:dxTabHtml,cur:curHtml,agenda:agendaHtml,profile:profileHtml}[view.tab]();
  app.innerHTML=`<section class="view ${anim?'enter':''}"><div class="wrap">${html}</div></section>`;
  if(sel&&sel[0]){const el=document.getElementById(sel[0]);if(el){el.focus();try{el.setSelectionRange(sel[1],sel[1])}catch(e){}}}
  if(view.tab==='bible')bibleAfter();
  if(view.tab==='dic')dxAfter();
  if(view.tab==='cur')curAfter();
}

/* =========================================================
   INICIO
   ========================================================= */
function greet(){const h=new Date().getHours();return t(h<12?'greet_m':h<19?'greet_a':'greet_n')}
function sortedByUpd(){return liveS().sort((a,b)=>(b.updated||0)-(a.updated||0))}
function upcoming(){const td=todayISO();return agenda.filter(e=>e.date>=td).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')))}
function relDate(ts){if(!ts)return'';const d=todayISO(new Date(ts));return d===todayISO()?t('today'):fmtD(d)}
function previewOf(s,n){const d=docOf(s);$$('blockquote,h1',d).forEach(x=>x.remove());
  const txt=$$('p,li',d).map(x=>x.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ');return txt.length>n?txt.slice(0,n).replace(/\s+\S*$/,'')+'…':txt}
function statusTag(s){const lp=lastPreach(s);return lp?`<span class="tag ok">${esc(t('preached'))} · ${esc(placeName(lp))} ${esc(fmtD(lp.date))}</span>`:`<span class="tag warn">${esc(t('pending'))}</span>`}
function miniCard(s,right){const d=derive(s);
  return`<button class="mini" data-act="open" data-id="${esc(s.id)}"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px">
    <span class="ti">${esc(d.title||t('untitled'))}</span>${d.passage?`<span class="ref">${esc(d.passage)}</span>`:''}
    <span class="mt">${esc(t('edited_c'))} ${esc(relDate(s.updated))}<span class="sep">·</span>${isPreached(s)?`<span class="ok">${esc(t('preached'))}</span>`:`<span class="warn">${esc(t('pending'))}</span>`}</span></div>${right||''}</button>`}
function favCard(s){const d=derive(s);return`<button class="favc" data-act="preach" data-id="${esc(s.id)}"><span class="st">${ic('star')}</span><span class="ti">${esc(d.title||t('untitled'))}</span>${d.passage?`<span class="ref">${esc(d.passage)}</span>`:''}<span class="go">${ic('lectern')}${esc(t('act_preach'))}</span></button>`}
function avatarIn(){return meta.photo?`<img src="${esc(meta.photo)}" alt="">`:esc((meta.name||t('pastor')).trim().charAt(0).toUpperCase())}
function pickPhoto(){const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.style.display='none';document.body.appendChild(inp);
  inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.remove();if(!f)return;const url=URL.createObjectURL(f);const img=new Image();
    img.onload=()=>cropPhoto(img,url);img.onerror=()=>{URL.revokeObjectURL(url);toast(t('photo_err'))};img.src=url};
  inp.click()}
// Recortar la foto: mover con un dedo, acercar con dos dedos o con la barra; queda solo lo que está dentro del círculo
function cropPhoto(img,url){const W=img.naturalWidth,H=img.naturalHeight;
  const sh=openSheet(`<h3>${esc(t('crop_t'))}</h3><p class="sub" style="margin:-6px 0 0;font-size:14px">${esc(t('crop_d'))}</p>
    <div class="crop" id="cropSt"><img src="${url}" alt="" draggable="false"><div class="crop-mask"></div></div>
    <div class="crop-z">${ic('search')}<input class="rng" type="range" min="1" max="4" step="0.01" value="1" id="cropZ" aria-label="Zoom"></div>
    <div class="row" style="gap:10px"><button class="btn ghost" style="flex:1" id="cropNo">${esc(t('cancel'))}</button><button class="btn gold" style="flex:1" id="cropOk">${esc(t('use_photo'))}</button></div>`,{onClose:()=>URL.revokeObjectURL(url)});
  const st=$('#cropSt',sh),im=st.querySelector('img'),z=$('#cropZ',sh);let S=st.clientWidth,base=S/Math.min(W,H),k=1,x=0,y=0;
  const clamp=()=>{const dw=W*base*k,dh=H*base*k;const mx=(dw-S)/2,my=(dh-S)/2;x=Math.max(-mx,Math.min(mx,x));y=Math.max(-my,Math.min(my,y))};
  const draw=()=>{clamp();const dw=W*base*k,dh=H*base*k;im.style.width=dw+'px';im.style.height=dh+'px';im.style.left=((S-dw)/2+x)+'px';im.style.top=((S-dh)/2+y)+'px';z.value=k};
  const zoomTo=nk=>{nk=Math.max(1,Math.min(4,nk));x*=nk/k;y*=nk/k;k=nk;draw()};
  const pts=new Map();let last=null;
  st.addEventListener('pointerdown',e=>{st.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});last=null});
  st.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId);const nx=e.clientX,ny=e.clientY;
    if(pts.size===1){x+=nx-p.x;y+=ny-p.y;pts.set(e.pointerId,{x:nx,y:ny});draw();return}
    pts.set(e.pointerId,{x:nx,y:ny});const [a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(last)zoomTo(k*d/last);last=d});
  const up=e=>{pts.delete(e.pointerId);last=null};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  st.addEventListener('wheel',e=>{e.preventDefault();zoomTo(k*(e.deltaY<0?1.08:.92))},{passive:false});
  z.oninput=()=>zoomTo(+z.value);
  $('#cropNo',sh).onclick=()=>closeSheet();
  $('#cropOk',sh).onclick=()=>{try{const sc=base*k,dw=W*sc,dh=H*sc;const sx=((dw-S)/2-x)/sc,sy=((dh-S)/2-y)/sc,sw=S/sc;
      const O=360,c=document.createElement('canvas');c.width=c.height=O;c.getContext('2d').drawImage(img,sx,sy,sw,sw,0,0,O,O);
      meta.photo=c.toDataURL('image/jpeg',.85);putMeta();closeSheet();render();toast(t('photo_ok'))}catch(e){toast(t('photo_err'))}};
  requestAnimationFrame(()=>{S=st.clientWidth;base=S/Math.min(W,H);draw()})}
function homeHtml(){
  const S=sortedByUpd();const favs=S.filter(s=>s.fav);const NS=S.length;const up=upcoming();const wk=up.filter(e=>e.date<=addDays(todayISO(),6)).length;
  const ev=up[0];const evS=ev&&sermons.find(s=>s.id===ev.sermonId);
  return`
  <div class="row topbrand">
    <span class="mark"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
    <div class="wordmark" style="flex:1;min-width:0" aria-label="Meu Púlpito"><b><span class="w1">MEU</span> <span class="w2">PÚLPITO</span></b><small>${esc(t('tagline'))}</small></div>
    <button class="iconbtn bg${meta.photo?' hasph':''}" data-act="tab" data-k="profile" aria-label="${esc(t('nav_profile'))}">${meta.photo?`<img src="${esc(meta.photo)}" alt="">`:ic('gear')}</button>
  </div>
  <div class="hello"><span class="sub">${esc(greet())}</span><b>${esc(meta.name||t('pastor'))}</b></div>
  <form class="search" data-form="homeSearch" role="search">${ic('search')}<input id="hq" name="q" type="search" placeholder="${esc(t('search_ph'))}" autocomplete="off" enterkeyhint="search"></form>
  ${bannersHtml()}
  ${soonHtml(ev,evS)}
  <button class="hero" data-act="new"><span><span class="k">${esc(t('prepare'))}</span><span class="t" style="display:block">${esc(t('new_sermon'))}</span><span class="d">${esc(t('new_desc'))}</span></span><span class="plus">${ic('plus')}</span></button>
  <div class="stats">
    <button class="stat" data-act="list" data-f="all"><b>${NS}</b><span>${esc(t('st_total'))}</span></button>
    <button class="stat" data-act="list" data-f="done"><b>${S.filter(isPreached).length}</b><span>${esc(t('st_done'))}</span></button>
    <button class="stat" data-act="list" data-f="fav"><b>${favs.length}</b><span>${esc(t('st_fav'))}</span></button>
  </div>
  <button class="cu-card" data-act="tab" data-k="cur"><span class="dx-gl sm">${ic('chat')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('cu_t'))}</b><span>${esc(t('cu_d'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  ${S.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('recent'))}</span><button class="lnk" data-act="tab" data-k="list">${esc(t('my_sermons'))}</button></div>
    ${S.slice(0,3).map(s=>miniCard(s,`<span class="chev">${ic('next')}</span>`)).join('')}</div>`:''}
  ${favs.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('favorites'))}</span><button class="lnk" data-act="list" data-f="fav">${esc(t('see_all'))}</button></div>
    <div class="favrow">${favs.slice(0,8).map(favCard).join('')}</div></div>`:''}
  ${ev&&!soonDays(ev)?`<div style="display:flex;flex-direction:column;gap:10px"><span class="sect">${esc(t('next_preach'))}</span>
    <button class="mini" data-act="tab" data-k="agenda">${dateBox(ev.date,true)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <b style="font-size:15px">${esc(evPlace(ev))}${ev.type?' · '+esc(ev.type):''}</b><span class="sub">${esc([ev.time,evS?derive(evS).title:(ev.theme||t('tbd'))].filter(Boolean).join(' · '))}</span></div></button></div>`:''}
  <div class="sync" data-sync style="justify-content:center">${syncHtml()}</div>`;
}
/* ---------- recordatorio: la próxima predicación (próximos 7 días) arriba en el Inicio ---------- */
function soonDays(ev){if(!ev)return 0;const n=Math.round((new Date(ev.date+'T12:00:00')-new Date(todayISO()+'T12:00:00'))/864e5);return n<=6?n+1:0}
function soonHtml(ev,s){const k=soonDays(ev);if(!k)return'';const n=k-1;
  const when=n===0?t('sn_today'):n===1?t('sn_tom'):t('sn_in',{n});
  const ti=s?(derive(s).title||t('untitled')):'';
  return`<div class="nextp${n===0?' now':''}"><div class="sn-hd">${ic('cal')}<span>${esc(when)}${ev.time?' · '+esc(ev.time):''}</span></div>
   <div class="sn-tx"><b>${esc(evPlace(ev))}${ev.type?' · '+esc(ev.type):''}</b>${s?`<span class="serif">${esc(ti)}</span>`:`<span>${esc(t('sn_none'))}</span>`}</div>
   <div class="row">${s?`<button class="btn sm ghost" data-act="open" data-id="${esc(s.id)}">${ic('doc')}${esc(t('sn_rev'))}</button><button class="btn sm gold" data-act="preach" data-id="${esc(s.id)}">${ic('lectern')}${esc(t('sn_go'))}</button>`
     :`<button class="btn sm ghost" data-act="tab" data-k="agenda">${esc(t('sn_ag'))}</button><button class="btn sm gold" data-act="evPick" data-id="${esc(ev.id)}">${esc(t('pick_s'))}</button>`}</div></div>`}
Object.assign(I18N.es,{sn_today:'Hoy predicas',sn_tom:'Mañana predicas',sn_in:'Predicas en {n} días',sn_none:'Todavía no elegiste el sermón para este culto.',sn_rev:'Revisar',sn_go:'Predicar',sn_ag:'Ver agenda'});
Object.assign(I18N.pt,{sn_today:'Hoje você prega',sn_tom:'Amanhã você prega',sn_in:'Você prega em {n} dias',sn_none:'Você ainda não escolheu o sermão para este culto.',sn_rev:'Revisar',sn_go:'Pregar',sn_ag:'Ver agenda'});
const RES='mp.resume',RES_MS=6*3600e3,BAK='pulpito.bak',WEEK=7*864e5;
function getResume(){const r=ls.get(RES,null);return r&&r.id&&Date.now()-(r.at||0)<RES_MS?r:null}

/* ---------- aviso al administrador: cuentas esperando liberación ---------- */
let ADMP={n:0,at:0,busy:false};
function admPendCheck(force){if(!isAdmin()||localMode||ADMP.busy)return;if(!force&&Date.now()-ADMP.at<60000)return;ADMP.busy=true;
  const db=firebase.firestore();Promise.all([db.collection('stats').get(),db.collection('planos').get()]).then(([q,pq])=>{const pm={};pq.docs.forEach(d=>pm[d.id]=d.data());
    const n=q.docs.filter(d=>{const r=d.data(),p=pm[d.id];return r.email!==ADMIN_EMAIL&&!(p&&(p.ok||p.blocked||PMON[p.plan]))}).length;
    const ch=n!==ADMP.n;ADMP.n=n;ADMP.at=Date.now();if(ch&&view.tab==='home'&&!view.overlay)refreshBg()}).catch(()=>{}).finally(()=>{ADMP.busy=false})}
setInterval(()=>{if(document.visibilityState==='visible')admPendCheck()},90000);
/* ---------- relatar un problema (WhatsApp o correo del administrador) ---------- */
function reportSheet(){const wa=String(PCFG.wa||'').replace(/\D/g,'');
  const sh=openSheet(`<h3>${esc(t('rp_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('rp_d'))}</p>
    <textarea class="inp" id="rpTx" rows="5" placeholder="${esc(t('rp_ph'))}" style="height:auto;padding:12px;line-height:1.45;resize:vertical"></textarea>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('rp_tip'))}</p>
    <button class="btn gold block" id="rpGo">${ic(wa?'chat':'share')}${esc(t(wa?'rp_wa':'rp_mail'))}</button>`);
  $('#rpGo',sh).onclick=()=>{const tx=$('#rpTx',sh).value.trim();if(!tx){$('#rpTx',sh).focus();return}
    const ua=navigator.userAgent;const dev=/iPhone/.test(ua)?'iPhone':/iPad/.test(ua)?'iPad':/Android/.test(ua)?'Android':/Mac/.test(ua)?'Mac':/Windows/.test(ua)?'Windows':'otro';
    const os=(ua.match(/OS (\d+[_\d]*)/)||ua.match(/Android ([\d.]+)/)||[])[1]||'';const pwa=window.matchMedia&&matchMedia('(display-mode: standalone)').matches?'app':'navegador';
    const info=`\n\n— Meu Púlpito ${APP_VER} · ${dev} ${os.replace(/_/g,'.')} · ${pwa} · ${innerWidth}×${innerHeight} · ${(prefs.ui||'').toUpperCase()} · ${(authU&&authU.email)||'sin cuenta'}`;
    const msg=t('rp_hd')+'\n'+tx+info;closeSheet();
    if(wa)window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,'_blank');else location.href=`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Meu Púlpito · '+t('rp_t'))}&body=${encodeURIComponent(msg)}`}}
/* ---------- bienvenida (primera vez) ---------- */
const ONB=[['__logo','ob0t','ob0d'],['plus','ob1t','ob1d'],['lectern','ob2t','ob2d'],['dict','ob3t','ob3d'],['cal','ob4t','ob4d']];
function onboarding(){let i=0;const sh=openSheet(`<div class="ob"><div id="obIn"></div><div class="ob-dots">${ONB.map((_,k)=>`<i data-k="${k}"></i>`).join('')}</div>
    <div class="two"><button class="btn ghost" id="obSkip">${esc(t('ob_skip'))}</button><button class="btn gold" id="obNext"></button></div></div>`,{onClose:()=>ls.set('mp.onb',1)});
  const paint=()=>{const [icn,tt,dd]=ONB[i];const nm=(meta.name||'').trim();$('#obIn',sh).innerHTML=`${icn==='__logo'?`<span class="ob-logo"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>`:`<span class="ob-ic">${ic(icn)}</span>`}<h3 class="ob-t">${esc(t(tt,{n:nm?', '+nm:''}))}</h3><p class="ob-d">${esc(t(dd))}</p>`;
    $$('.ob-dots i',sh).forEach((d,k)=>d.classList.toggle('on',k===i));$('#obNext',sh).textContent=t(i<ONB.length-1?'ob_next':'ob_go');$('#obSkip',sh).style.visibility=i<ONB.length-1?'visible':'hidden'};
  $('#obNext',sh).onclick=()=>{if(i<ONB.length-1){i++;paint()}else closeSheet()};$('#obSkip',sh).onclick=()=>closeSheet();paint()}
Object.assign(I18N.es,{adp_t:'{n} cuenta(s) esperando liberación',adp_d:'Toque para ver y liberar.',rp_t:'Relatar un problema',rp_d:'Cuéntenos qué pasó y qué estaba haciendo. El mensaje va con la versión del app y el tipo de celular, para corregirlo más rápido.',rp_ph:'Ej.: toqué Predicar y la pantalla quedó en blanco…',rp_tip:'Si puede, después envíe también una captura de pantalla en la misma conversación.',rp_wa:'Enviar por WhatsApp',rp_mail:'Enviar por correo',rp_hd:'Problema en Meu Púlpito:',rp_btn:'Relatar un problema',ob_btn:'Ver la presentación',
  ob0t:'¡Bienvenido a Meu Púlpito{n}!',ob0d:'Su lugar para preparar, organizar y predicar la Palabra. En cuatro pasos le mostramos lo principal.',wb_back:'¡Bienvenido de nuevo, {n}!',ob1t:'Escriba su sermón',ob1d:'Toque «Nuevo sermón». Escriba el título y el texto; con «Versículo» el app coloca el texto bíblico y con «Nuevo punto» organiza el bosquejo. Todo se guarda solo.',
  ob2t:'Predique desde el celular',ob2d:'Toque «Predicar»: letra grande, cronómetro y avance por partes. Puede cambiar el sermón entre español y portugués sin crear una copia.',
  ob3t:'Estudie la Palabra',ob3d:'Biblia en español y portugués, diccionarios Bíblico, Hebreo y Griego, y curiosidades bíblicas. Desde el editor, toque el libro para consultar e insertar en el sermón.',
  ob4t:'Organice su ministerio',ob4d:'Agenda de predicaciones, categorías y favoritos. Sus sermones quedan en su cuenta y aparecen en cualquier celular donde entre.',ob_next:'Siguiente',ob_go:'Comenzar',ob_skip:'Saltar'});
Object.assign(I18N.pt,{adp_t:'{n} conta(s) aguardando liberação',adp_d:'Toque para ver e liberar.',rp_t:'Relatar um problema',rp_d:'Conte o que aconteceu e o que você estava fazendo. A mensagem vai com a versão do app e o tipo de celular, para corrigir mais rápido.',rp_ph:'Ex.: toquei em Pregar e a tela ficou em branco…',rp_tip:'Se puder, depois mande também um print da tela na mesma conversa.',rp_wa:'Enviar pelo WhatsApp',rp_mail:'Enviar por e-mail',rp_hd:'Problema no Meu Púlpito:',rp_btn:'Relatar um problema',ob_btn:'Ver a apresentação',
  ob0t:'Bem-vindo ao Meu Púlpito{n}!',ob0d:'Seu lugar para preparar, organizar e pregar a Palavra. Em quatro passos mostramos o principal.',wb_back:'Bem-vindo de volta, {n}!',ob1t:'Escreva seu sermão',ob1d:'Toque em «Novo sermão». Escreva o título e o texto; com «Versículo» o app coloca o texto bíblico e com «Novo ponto» organiza o esboço. Tudo é salvo sozinho.',
  ob2t:'Pregue pelo celular',ob2d:'Toque em «Pregar»: letra grande, cronômetro e avanço por partes. Você pode trocar o sermão entre português e espanhol sem criar uma cópia.',
  ob3t:'Estude a Palavra',ob3d:'Bíblia em português e espanhol, dicionários Bíblico, Hebraico e Grego, e curiosidades bíblicas. No editor, toque no livro para consultar e inserir no sermão.',
  ob4t:'Organize seu ministério',ob4d:'Agenda de pregações, categorias e favoritos. Seus sermões ficam na sua conta e aparecem em qualquer celular em que você entrar.',ob_next:'Próximo',ob_go:'Começar',ob_skip:'Pular'});

function planBanner(){const N=planNow();if(N.test&&!N.paid)return'';const k=N.plan!=='free'?N.plan:N.last;
  const btn=`<button class="btn sm gold" data-act="planRenew" data-k="${esc(PMON[k]?k:'m')}">${esc(t('pv_renew'))}</button>`;
  if(N.active&&N.daysLeft<=(+PCFG.warn||7))return`<div class="banner pv"><div class="tx"><b>${esc(t(N.daysLeft<=1?'pv_today':'pv_soon',{n:N.daysLeft}))}</b><br>${esc(t('pv_soon_d',{d:fmtDay(N.until)}))}</div><div class="row">${btn}</div></div>`;
  if(N.grace){const g=Math.max(1,Math.ceil((N.graceEnd-Date.now())/864e5));return`<div class="banner pv warn"><div class="tx"><b>${esc(t('pv_exp',{d:fmtDay(N.until)}))}</b><br>${esc(t('pv_grace',{n:g}))}</div><div class="row">${btn}</div></div>`}
  if(N.expired&&!N.paid&&!ls.get('mp.pvx.'+N.until,0))return`<div class="banner pv"><div class="tx"><b>${esc(t('pv_free'))}</b><br>${esc(t('pv_free_d'))}</div><div class="row"><button class="btn sm ghost" data-act="pvHide" data-u="${N.until}">${esc(t('later'))}</button>${btn}</div></div>`;
  return''}
function bannersHtml(){let h=planBanner();if(isAdmin()&&ls.get('mp.adm',0)!==1)ls.set('mp.adm',1);if(canShowInstall()&&!ls.get('mp.instx',0))h+=`<div class="banner inst-bn"><div class="tx"><b>${esc(t('in_t'))}</b><br>${esc(t('in_d'))}</div><div class="row"><button class="btn sm ghost" data-act="instHide">${esc(t('later'))}</button><button class="btn sm gold" data-act="install">${ic('dl')}${esc(t('in_btn').split(' ')[0])}</button></div></div>`;if(isAdmin()){admPendCheck();if(ADMP.n)h+=`<button class="banner adp" data-act="admin"><span class="adp-n">${ADMP.n}</span><div class="tx"><b>${esc(t('adp_t',{n:ADMP.n}))}</b><br>${esc(t('adp_d'))}</div>${ic('next')}</button>`}const r=getResume();const rs=r&&(r.tSec>0||r.top>200)&&sermons.find(x=>x.id===r.id);
  if(rs)h+=`<div class="banner"><div class="tx">${esc(t('cont_preach'))}<br><b class="serif">${esc(derive(rs).title||t('untitled'))}</b>${r.tSec?' · '+fmtSec(r.tSec):''}</div>
    <div class="row"><button class="btn sm ghost" data-act="resNo">${esc(t('end'))}</button><button class="btn sm gold" data-act="resGo">${ic('lectern')}${esc(t('go_on'))}</button></div></div>`;
  if(ls.get(BAK,null)===null)ls.set(BAK,Date.now());
  if(liveS().length&&Date.now()-ls.get(BAK,Date.now())>WEEK)h+=`<div class="banner"><div class="tx"><b>${esc(t('bak_t'))}</b><br>${esc(t('bak_d'))}</div>
    <div class="row"><button class="btn sm ghost" data-act="bakNo">${esc(t('later'))}</button><button class="btn sm dark" data-act="bakGo">${esc(t('copy_now'))}</button></div></div>`;
  return h}
function backupNow(){copyText(JSON.stringify({app:'meu-pulpito',v:2,at:new Date().toISOString(),sermons,agenda,notes,meta})).then(()=>{ls.set(BAK,Date.now());toast(t('bak_done'));if(!view.overlay)render()})}

/* =========================================================
   SERMONES
   ========================================================= */
// Búsqueda: ignora acentos, mayúsculas y signos (juan 3 16 = Juan 3:16); todas las palabras deben estar, en cualquier orden
const nk=x=>norm(x).replace(/[^0-9a-z\u00c0-\uffff]/g,' ');
const qTerms=q=>{const n=nk(q).replace(/\s+/g,' ').trim();return n?{ph:n,ws:[...new Set(n.split(' '))].sort((a,b)=>b.length-a.length)}:null};
function hitLine(s,Q){if(!Q)return'';const d=docOf(s);const keys=[Q.ph,...Q.ws.filter(w=>w.length>1)];
  for(const k of keys)for(const el of $$('h1,h2,h3,p,li,blockquote',d)){const l=el.textContent.trim();const i=nk(l).indexOf(k);
    if(l&&i>=0){const st=Math.max(0,i-30);return`${st?'…':''}${esc(l.slice(st,i))}<mark>${esc(l.slice(i,i+k.length))}</mark>${esc(l.slice(i+k.length,i+k.length+70))}`}}
  const r=$$('blockquote[data-ref]',d).map(b=>b.getAttribute('data-ref')).find(x=>Q.ws.every(w=>nk(x).includes(w)));return r?`<mark>${esc(r)}</mark>`:''}
function filtered(){const Q=qTerms(listState.q);const mon=Date.now()-30*864e5;
  let arr=sortedByUpd();const rank=new Map();
  arr=arr.filter(s=>{if(listState.f==='fav'&&!s.fav)return false;if(listState.f==='done'&&!isPreached(s))return false;if(listState.f==='todo'&&isPreached(s))return false;
    if(listState.f==='recent'&&(s.updated||0)<mon)return false;if(listState.cat&&catOf(s)!==listState.cat)return false;
    if(!Q)return true;const d=derive(s);const inf=s.info||{};const tt=nk(d.title+' '+d.passage);
    const hay=nk([d.title,d.passage,catOf(s),inf.keys,inf.goal,inf.aud,inf.text,d.text,(s.html||'').match(/data-ref="[^"]*"/g)?.join(' ')].join(' '));
    if(!Q.ws.every(w=>hay.includes(w)))return false;
    rank.set(s,(tt.includes(Q.ph)?0:Q.ws.every(w=>tt.includes(w))?1:hay.includes(Q.ph)?2:3));return true});
  if(Q)arr=arr.map((s,i)=>[s,i]).sort((a,b)=>rank.get(a[0])-rank.get(b[0])||a[1]-b[1]).map(x=>x[0]);
  return arr}
function sermonCard(s){const d=derive(s);const c=catOf(s);const Q=qTerms(listState.q);const hit=Q&&!nk(d.title).includes(Q.ph)?hitLine(s,Q):'';const pv=hit?'':previewOf(s,150);
  return`<div class="sm-card">
   <div class="top"><button class="open" data-act="open" data-id="${esc(s.id)}"><span class="ti">${esc(d.title||t('untitled'))}</span>
     ${d.passage?`<span class="ref">${esc(d.passage)}</span>`:''}</button>
     <button class="iconbtn star ${s.fav?'on':''}" data-act="fav" data-id="${esc(s.id)}" aria-label="${esc(t(s.fav?'act_unfav':'act_fav'))}" aria-pressed="${!!s.fav}">${ic('star')}</button>
     <button class="iconbtn" data-act="menu" data-id="${esc(s.id)}" aria-label="${esc(t('more'))}">${ic('more')}</button></div>
   ${hit?`<div class="hit">${hit}</div>`:`<button class="pv" data-act="open" data-id="${esc(s.id)}">${esc(pv||t('no_prev'))}</button>`}
   <div class="ft"><span class="dt">${esc(t('edited_c'))} ${esc(relDate(s.updated))}${c?` · ${esc(c)}`:''}</span>${statusTag(s)}</div>
  </div>`}
function listHtml(){if(listState.mode==='n')return notesHtml();
  const arr=filtered();const cats=[...new Set([...meta.cats,...liveS().map(catOf).filter(Boolean)])];const tr=sermons.filter(s=>s.deleted).length+notes.filter(n=>n.deleted).length;
  const F=[['all','f_all'],['recent','f_recent'],['fav','f_fav'],['done','f_done'],['todo','f_todo']];
  return`<div class="between"><h1 class="h">${esc(t('my_sermons'))}</h1><button class="iconbtn gold" data-act="new" aria-label="${esc(t('new_sermon'))}">${ic('plus')}</button></div>
  ${modeSeg()}
  <label class="search">${ic('search')}<input id="lq" type="search" value="${esc(listState.q)}" placeholder="${esc(t('search_ph'))}" autocomplete="off" data-input="listQ"></label>
  <div class="chips">${F.map(([k,l])=>`<button class="chip" data-act="lf" data-f="${k}" aria-pressed="${listState.f===k}">${esc(t(l))}</button>`).join('')}</div>
  ${cats.length?`<div class="chips"><span class="lbl" style="align-self:center;flex:none">${esc(t('category'))}</span>${cats.map(c=>`<button class="chip cat" data-act="lc" data-c="${esc(c)}" aria-pressed="${listState.cat===c}">${esc(c)}</button>`).join('')}</div>`:''}
  <div class="list">${!liveS().length?`<div class="empty"><img class="logo" src="logo.jpg" alt="" style="width:80px;height:80px;border-radius:20px"><h3>${esc(t('empty_t'))}</h3><p style="margin:0;max-width:34ch">${esc(t('empty_d'))}</p><button class="btn gold" data-act="new">${ic('plus')}${esc(t('new_sermon'))}</button></div>`
    :arr.length?(listState.q.trim()?`<p class="res-n">${esc(t(arr.length===1?'res_1':'res_n',{n:arr.length}))}</p>`:'')+arr.map(sermonCard).join(''):`<div class="empty"><p style="margin:0">${esc(t('no_res'))}</p></div>`}</div>
  ${tr?`<button class="lnk" data-act="trash" style="align-self:center;padding:10px">${ic('trash')} ${esc(t('trash_n',{n:tr}))}</button>`:''}`}
const modeSeg=()=>`<div class="seg"><button data-act="lmode" data-m="s" aria-pressed="${listState.mode==='s'}">${esc(t('nav_list'))}</button><button data-act="lmode" data-m="n" aria-pressed="${listState.mode==='n'}">${esc(t('lib'))}</button></div>`;
/* ---------- Biblioteca personal ---------- */
const NTYPES=['estudio','frase','reflexion','ilustracion','nota','idea','ref'];
function notesHtml(){const q=norm(listState.q.trim());
  let arr=liveN().sort((a,b)=>(b.updated||0)-(a.updated||0)).filter(n=>(!listState.nt||n.type===listState.nt)&&(!q||norm([n.title,n.text,n.ref].join(' ')).includes(q)));
  return`<div class="between"><h1 class="h">${esc(t('lib'))}</h1><button class="iconbtn gold" data-act="nNew" aria-label="${esc(t('n_new'))}">${ic('plus')}</button></div>
  ${modeSeg()}
  <label class="search">${ic('search')}<input id="lq" type="search" value="${esc(listState.q)}" placeholder="${esc(t('search_ph'))}" autocomplete="off" data-input="listQ"></label>
  <button class="btn ghost" data-act="recG">${ic('mic')}${esc(t('voice_notes'))}</button>
  <div class="chips"><button class="chip" data-act="nt" data-t="" aria-pressed="${!listState.nt}">${esc(t('all'))}</button>${NTYPES.map(k=>`<button class="chip" data-act="nt" data-t="${k}" aria-pressed="${listState.nt===k}">${esc(t('nt_'+k))}</button>`).join('')}</div>
  <div class="list">${arr.length?arr.map(n=>`<button class="sm-card" data-act="nOpen" data-id="${esc(n.id)}" style="text-align:left">
     <span class="tags"><span class="tag">${esc(t('nt_'+(n.type||'nota')))}</span>${n.ref?`<span class="tag lang">${esc(n.ref)}</span>`:''}</span>
     ${n.title?`<span class="ti">${esc(n.title)}</span>`:''}<span class="hit" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-wrap">${esc((n.text||'').slice(0,300))}</span>
     <span class="me">${esc(t('edited'))} ${esc(relDate(n.updated))}</span></button>`).join(''):`<div class="empty"><p style="margin:0;max-width:34ch">${esc(t('n_empty'))}</p><button class="btn gold" data-act="nNew">${ic('plus')}${esc(t('n_new'))}</button></div>`}</div>`}
function noteSheet(id){let n=id?notes.find(x=>x.id===id):null;const isNew=!n;if(!n)n={id:uid(),type:listState.nt||'idea',title:'',text:'',ref:'',created:Date.now()};
  const w=JSON.parse(JSON.stringify(n));
  const sh=openSheet(`<div class="fld"><span class="lb">${esc(t('n_type'))}</span><select class="inp" id="nTy">${NTYPES.map(k=>`<option value="${k}" ${w.type===k?'selected':''}>${esc(t('nt_'+k))}</option>`).join('')}</select></div>
    <input class="inp" id="nTi" placeholder="${esc(t('n_title'))}" value="${esc(w.title)}" style="font-family:var(--read);font-size:19px;font-weight:700">
    <textarea class="inp" id="nTx" rows="9" placeholder="${esc(t('n_text'))}" style="font-family:var(--read);font-size:17px">${esc(w.text)}</textarea>
    <input class="inp" id="nRf" placeholder="${esc(t('n_ref'))}" value="${esc(w.ref||'')}">
    ${w.audioId?`<div id="nAud"></div>`:''}
    <div class="two"><button class="btn ghost" id="nConv">${ic('doc')}${esc(t('n_to_s'))}</button><button class="btn gold" id="nOk">${esc(t('save'))}</button></div>
    ${isNew?'':`<button class="btn ghost" id="nDel" style="color:var(--danger)">${ic('trash')}${esc(t('to_trash'))}</button>`}`,{onClose:()=>save(true)});
  let saved=false;
  function read(){w.type=$('#nTy',sh).value;w.title=$('#nTi',sh).value.trim();w.text=$('#nTx',sh).value;w.ref=cleanRef($('#nRf',sh).value)}
  function save(quiet){if(saved)return;read();if(!w.title&&!w.text.trim()&&!w.ref)return;const old=notes.find(x=>x.id===w.id);
    if(old&&old.title===w.title&&old.text===w.text&&old.type===w.type&&(old.ref||'')===w.ref&&!old.deleted)return;
    putNote(Object.assign(old||{},w),{silent:quiet});saved=true}
  $('#nOk',sh).onclick=()=>{save(false);saved=true;closeSheet()};
  $('#nConv',sh).onclick=()=>{read();save(true);saved=true;closeSheet();
    const r=linesToHtml(w.text,{});const ref=w.ref&&isRef(w.ref)?`<blockquote data-ref="${esc(w.ref)}"></blockquote>`:'';
    const s={id:uid(),html:cleanHtml(`<h1>${esc(w.title||r.title||'')}</h1>${ref}${r.html||'<p><br></p>'}`),lang:detectLang(w.text)||prefs.ui,fav:false,created:Date.now(),log:[],v:2,fromNote:w.id};
    putSermon(s,{silent:true});openEditor(s.id);toast(t('n_conv'))};
  const del=$('#nDel',sh);if(del)del.onclick=()=>{saved=true;const o=notes.find(x=>x.id===w.id);if(o){o.deleted=Date.now();putNote(o)}closeSheet();toast(t('moved_trash'))};
  if(w.audioId)audList().then(L=>{const a=L.find(x=>x.id===w.audioId);const box=$('#nAud',sh);if(a&&box){const u=URL.createObjectURL(a.blob);box.innerHTML=`<audio controls src="${u}" style="width:100%"></audio>`}});
  if(isNew)setTimeout(()=>$('#nTx',sh).focus(),80)}
function trashSheet(){const S=sermons.filter(s=>s.deleted),N=notes.filter(n=>n.deleted);
  const row=(kind,x,title)=>`<div class="between" style="border-top:1px solid var(--line);padding-top:10px;gap:8px"><span style="flex:1;min-width:0"><b class="serif">${esc(title||t('untitled'))}</b><span class="sub" style="display:block">${esc(kind)} · ${esc(fmtD(todayISO(new Date(x.deleted))))}</span></span>
    <button class="btn sm ghost" data-act="trRest" data-k="${kind===t('lib')?'n':'s'}" data-id="${esc(x.id)}">${esc(t('restore_it'))}</button><button class="iconbtn" data-act="trKill" data-k="${kind===t('lib')?'n':'s'}" data-id="${esc(x.id)}" aria-label="${esc(t('del_forever'))}" style="color:var(--danger)">${ic('trash')}</button></div>`;
  openSheet(`<h3>${esc(t('trash'))}</h3><p class="sub" style="margin:0">${esc(t('trash_d'))}</p>
   ${S.length||N.length?S.map(s=>row(t('nav_list'),s,derive(s).title)).join('')+N.map(n=>row(t('lib'),n,n.title||(n.text||'').slice(0,40))).join(''):`<p class="sub">${esc(t('trash_empty'))}</p>`}`)}

function sermonMenu(id){const s=sermons.find(x=>x.id===id);if(!s)return;const d=derive(s);
  const sh=openSheet(`<h3 class="serif">${esc(d.title||t('untitled'))}</h3><div class="acts">
   <button class="act" data-act="open" data-id="${esc(id)}">${ic('pen')}${esc(t('act_edit'))}</button>
   <button class="act" data-act="preach" data-id="${esc(id)}">${ic('lectern')}${esc(t('act_preach'))}</button>
   <button class="act" data-act="fav" data-id="${esc(id)}">${ic('star')}${esc(t(s.fav?'act_unfav':'act_fav'))}</button>
   <button class="act" data-act="dup" data-id="${esc(id)}">${ic('copy')}${esc(t('act_dup'))}</button>
   <button class="act" data-act="share" data-id="${esc(id)}">${ic('share')}${esc(t('act_share'))}</button>
   <button class="act" data-act="trans" data-id="${esc(id)}">${ic('lang')}${esc(t('tr_to',{l:sLang(s)==='pt'?'Español':'Português'}))}</button>
   <button class="act" data-act="hist" data-id="${esc(id)}">${ic('cal')}${esc(t('act_hist'))}</button>
   <button class="act red" data-act="delAsk" data-id="${esc(id)}">${ic('trash')}${esc(t('act_del'))}</button></div>`);
  return sh}
function duplicate(id){const s=sermons.find(x=>x.id===id);if(!s)return;if(!canNewSermon())return;const c=JSON.parse(JSON.stringify(s));const d=derive(s);
  Object.assign(c,{id:uid(),fav:false,log:[],preached:{},created:Date.now()});
  const h=document.createElement('div');h.innerHTML=getHtml(s);let h1=h.querySelector('h1');if(!h1){h1=document.createElement('h1');h.prepend(h1)}h1.textContent=`${d.title||t('untitled')} ${t('copy_sfx')}`;c.html=cleanHtml(h.innerHTML);
  putSermon(c,{silent:true});closeSheet();openEditor(c.id);toast(t('duplicated'))}

/* =========================================================
   EDITOR
   ========================================================= */
let E=null;
function newSermon(){if(!canNewSermon())return;const s={id:uid(),html:'',lang:'',category:listState.cat||'',fav:false,created:Date.now(),log:[],v:2};openEditor(null,s)}
function openEditor(id,fresh){
  const s=fresh||sermons.find(x=>x.id===id);if(!s)return;closeSheet();while($('.ov'))closeSheet();
  view.overlay='editor';$('#nav').hidden=true;document.documentElement.classList.remove('tabs');
  const html=s.html||(s.body!=null||s.title?bodyToHtml(s):'');
  E={s:JSON.parse(JSON.stringify(s)),isNew:!!fresh,U:[],R:[],saveT:0,snapT:0,dirty:false};
  const lang=sLang(E.s);
  $('#app').innerHTML=`<div class="ed-view">
   <div class="ed-top"><div class="in">
     <button class="iconbtn" data-act="edBack" aria-label="${esc(t('close'))}">${ic('back')}</button>
     <span class="saved" id="edSaved" role="status">${ic('check')}<span class="st">${esc(t('saved'))}</span></span>
     <button class="iconbtn" data-act="undo" data-keep aria-label="${esc(t('undo'))}">${ic('undo')}</button>
     <button class="iconbtn" data-act="redo" data-keep aria-label="${esc(t('redo'))}">${ic('redo')}</button>
     <button class="iconbtn" data-act="edMenu" aria-label="${esc(t('more'))}">${ic('more')}</button>
     <button class="btn sm gold" data-act="edPreach">${ic('lectern')}${esc(t('act_preach'))}</button>
   </div></div>
   <div class="ed-meta" id="edMeta"></div>
   <div class="doc" id="ed" contenteditable="true" spellcheck="true" autocapitalize="sentences" lang="${lang==='pt'?'pt-BR':'es'}" aria-label="${esc(t('new_sermon'))}"></div>
   <div class="tb" id="tb" role="toolbar" aria-label="Formato"><div class="in">
     <div class="sty" id="tbSty" hidden>${[['h2','sy_point'],['h3','sy_sub'],['p','sy_text'],['lg','sy_big']].map(([k,l])=>`<button data-act="fmtSet" data-s="${k}" data-keep class="s-${k}">${esc(t(l))}</button>`).join('')}</div>
     <div class="fmt">
       <button data-act="fmtStyle" data-keep aria-label="${esc(t('tb_style'))}" aria-expanded="false" id="tbH">Aa</button>
       <button data-act="fmtB" data-keep aria-label="${esc(t('tb_bold'))}" id="tbB">B</button>
       <button data-act="fmtI" data-keep aria-label="${esc(t('tb_italic'))}" id="tbI" style="font-family:var(--read);font-style:italic;font-weight:500">I</button>
       <button data-act="fmtU" data-keep aria-label="${esc(t('tb_under'))}" id="tbU" style="text-decoration:underline;font-weight:600">U</button>
       <button data-act="fmtOl" data-keep aria-label="${esc(t('tb_list'))}">${ic('ol')}</button>
       <button data-act="fmtHl" data-keep aria-label="${esc(t('tb_hl'))}">${ic('hl')}</button>
       <button data-act="fmtNote" data-keep aria-label="${esc(t('tb_note'))}" style="font-size:18px">@</button>
       <button data-act="fmtImp" data-keep aria-label="${esc(t('imp'))}">${ic('star')}</button>
       <button data-act="aiOpen" data-keep aria-label="${esc(t('ai'))}" style="color:var(--gold-ink)">${ic('spark')}</button>
       <button data-act="recE" data-keep aria-label="${esc(t('rec'))}">${ic('mic')}</button>
       <button data-act="dicE" data-keep aria-label="${esc(t('dx_ed'))}">${ic('dict')}</button>
     </div>
     <div class="big"><button class="v" data-act="edVerse" data-keep>${ic('bible')}${esc(t('tb_verse'))}</button><button class="p" data-act="edPoint" data-keep>${ic('plus')}${esc(t('tb_point'))}</button></div>
   </div></div></div>`;
  const ed=$('#ed');ed.innerHTML=html?cleanHtml(html):'<h1></h1><p class="ph"></p>';
  if(!ed.querySelector('h1')){const h=document.createElement('h1');ed.prepend(h)}
  {const et=$('.ed-top'),em=$('#edMeta');if(et)document.documentElement.style.setProperty('--edTop',et.offsetHeight+'px')}
  placeholders();E.U=[ed.innerHTML];E.base=fresh?'':cleanHtml(html);E.baseAt=s.updated||Date.now();E.wasEmpty=!ed.textContent.trim();drawEdMeta();
  ed.addEventListener('input',onEdInput);ed.addEventListener('keydown',onEdKey);ed.addEventListener('paste',onPaste);
  ed.addEventListener('beforeinput',e=>{if(e.inputType==='historyUndo'){e.preventDefault();edUndo()}else if(e.inputType==='historyRedo'){e.preventDefault();edRedo()}});
  document.addEventListener('selectionchange',tbState);document.addEventListener('selectionchange',trackRange);
  window.scrollTo(0,0);fitToolbar();
  if(fresh){setTimeout(()=>{const h1=ed.querySelector('h1');placeCaret(h1,0);ed.focus({preventScroll:true});window.scrollTo(0,0);setTimeout(()=>window.scrollTo(0,0),350)},60)}else setTimeout(()=>window.scrollTo(0,0),60)
}
function placeholders(){const ed=$('#ed');if(!ed)return;const h1=ed.querySelector('h1');if(h1)h1.setAttribute('data-ph',t('title_ph'));
  $$('p.ph',ed).forEach(p=>p.setAttribute('data-ph',t('body_ph')))}
function drawEdMeta(){if(!E)return;const s=E.s;const c=catOf(s);const l=sLang(s);
  const empty=!edText().replace(/\s/g,'');
  $('#edMeta').innerHTML=`<button class="tag star ${s.fav?'on':''}" data-act="edFav" aria-pressed="${!!s.fav}" aria-label="${esc(t(s.fav?'act_unfav':'act_fav'))}" style="width:34px;justify-content:center;padding:0">${ic('star')}</button>
   <button class="tag ${c?'':'add'}" data-act="edCat">${esc(c||'+ '+t('category'))}</button>
   <button class="tag add" data-act="edLang" aria-label="${esc(t('lang_msg'))}">${l==='pt'?'PT':'ES'}</button>
   <button class="tag add" data-act="edInfo">${esc(t('details'))}</button>
   ${empty?`<button class="tag add" data-act="edTpl" style="box-shadow:0 0 0 1.5px var(--gold) inset;color:var(--fg)">${esc(t('models'))}</button>`:`<button class="tag add" data-act="edOrg">${esc(t('organize'))}</button>`}
   <span class="sub" id="edWc" style="margin-left:auto;align-self:center;font-size:12.5px"></span>${longTitleHtml()}`;updWc()
  $$('#edMeta svg').forEach(s=>{s.style.width='16px';s.style.height='16px'})}
function splitLongTitle(){const h1=$('#ed h1');if(!h1)return null;const tx=h1.textContent.trim();if(tx.length<=120)return null;
  const parts=tx.split(/(?<=[.!?…])\s*/).map(x=>x.trim()).filter(Boolean);let title=parts.length>1?parts[parts.length-1]:'';
  if(!title||title.length>110){title=parts[0].length<=110?parts[0]:'';}if(!title)return null;const rest=tx.replace(title,'').trim();return{title,rest}}
function longTitleHtml(){const r=splitLongTitle();return r?`<div class="banner" style="width:100%;margin-top:6px"><div class="tx">${esc(t('long_t',{t:r.title}))}</div><button class="btn sm gold" data-act="fixTitle">${esc(t('long_fix'))}</button></div>`:''}
function numberPts(){const ed=$('#ed');if(!ed)return;let n=0;$$('h2',ed).forEach(h=>{const tx=h.textContent.trim();if(tx&&!secOf(tx)){n++;h.setAttribute('data-n',n+'.')}else h.removeAttribute('data-n')})}
function updWc(){numberPts();const el=$('#edWc');if(!el||!E)return;const w=(edText().match(/\S+/g)||[]).length;el.textContent=w?t('wc',{w,m:Math.max(1,Math.round(w/130))}):''}
function edText(){const ed=$('#ed');return ed?ed.textContent.trim():''}
function onEdInput(e){if(!E)return;E.dirty=true;$('#edSaved').innerHTML=`<span class="st" style="display:inline">${esc(t('saving'))}</span>`;
  if(e&&e.inputType==='insertParagraph'){const b=curBlock();if(b&&/^(H1|H2|H3|DIV|BLOCKQUOTE)$/.test(b.tagName)&&!b.textContent.trim()){document.execCommand('formatBlock',false,'<p>')}}
  clearTimeout(E.saveT);E.saveT=setTimeout(edSave,700);clearTimeout(E.snapT);E.snapT=setTimeout(snap,500)}
function snap(){if(!E)return;const h=$('#ed').innerHTML;if(h!==E.U[E.U.length-1]){E.U.push(h);if(E.U.length>120)E.U.shift();E.R=[]}}
function setEd(h){const ed=$('#ed');ed.innerHTML=h;placeholders();const last=ed.lastElementChild;if(last)placeCaret(last,last.childNodes.length);onEdInput()}
function edUndo(){if(!E)return;clearTimeout(E.snapT);snap();if(E.U.length>1){E.R.push(E.U.pop());setEd(E.U[E.U.length-1])}}
function edRedo(){if(!E||!E.R.length)return;const h=E.R.pop();E.U.push(h);setEd(h)}
function commitHist(){if(!E||!E.base||!E.s.html||E.base===E.s.html)return;const s=sermons.find(x=>x.id===E.s.id);if(!s)return;
  s.hist=[{at:E.baseAt||Date.now(),html:E.base}].concat(s.hist||[]).slice(0,12);E.s.hist=s.hist;E.base=s.html;E.baseAt=Date.now();putSermon(s,{silent:true})}
function edSave(force){if(!E)return;clearTimeout(E.saveT);if(!E.dirty&&!force&&!E.isNew)return;const ed=$('#ed');if(!ed)return;
  const html=cleanHtml(ed.innerHTML);E.s.html=html;E.s.v=2;const d=derive(E.s);E.s.title=d.title;E.s.passage=d.passage;
  if(E.isNew&&!d.text.trim()){return}
  if(!E.s.langSet){const dl=detectSure(d.title+' '+d.text);if(dl)E.s.lang=dl;else if(!E.s.lang)E.s.lang=detectLang(d.text)}
  E.isNew=false;E.dirty=false;const cur=sermons.find(x=>x.id===E.s.id);if(cur&&cur.hist)E.s.hist=cur.hist;putSermon(E.s,{silent:true});updWc();if(E.wasEmpty!==!d.text.trim()){E.wasEmpty=!d.text.trim();drawEdMeta()}const sv=$('#edSaved');if(sv)sv.innerHTML=ic('check')+`<span class="st">${esc(t('saved'))}</span>`}
function closeEditor(then){if(!E)return;bpClose();edSave();commitHist();document.removeEventListener('selectionchange',tbState);document.removeEventListener('selectionchange',trackRange);E=null;view.overlay=null;then?then():render(true)}
function curBlock(){const ed=$('#ed');const sel=getSelection();if(!ed||!sel.rangeCount)return null;let n=sel.anchorNode;if(!ed.contains(n))return null;
  while(n&&n.parentNode!==ed)n=n.parentNode;return n&&n.nodeType===1?n:null}
function placeCaret(el,off){if(!el)return;const r=document.createRange();try{if(off===0){r.setStart(el,0)}else{r.selectNodeContents(el);r.collapse(false)}}catch(e){return}const s=getSelection();s.removeAllRanges();s.addRange(r)}
function onEdKey(e){if((e.metaKey||e.ctrlKey)&&!e.altKey){const k=e.key.toLowerCase();if(k==='z'){e.preventDefault();e.shiftKey?edRedo():edUndo()}else if(k==='y'){e.preventDefault();edRedo()}}
  if(e.key==='Enter'&&!e.shiftKey){const b=curBlock();if(b&&/^H[123]$/.test(b.tagName)){setTimeout(()=>{const n=curBlock();if(n&&n!==b&&!/^(P|LI|OL|UL)$/.test(n.tagName))document.execCommand('formatBlock',false,'<p>')},0)}
    if(b&&b.tagName==='BLOCKQUOTE'){const sel=getSelection();const r=sel.rangeCount&&sel.getRangeAt(0);const atEnd=r&&r.collapsed&&(()=>{const t2=document.createRange();t2.selectNodeContents(b);t2.setStart(r.endContainer,r.endOffset);return!t2.toString().length})();
      if(atEnd){e.preventDefault();const p=document.createElement('p');p.innerHTML='<br>';b.after(p);placeCaret(p,0);onEdInput()}}}}
function onPaste(e){e.preventDefault();const cd=e.clipboardData;if(!cd)return;
  {const b=curBlock();const raw=cd.getData('text/plain')||'';if(b&&b.tagName==='H1'&&(raw.includes('\n')||cd.getData('text/html'))){
    if(!b.textContent.trim()){const first=raw.split('\n').map(x=>x.trim()).find(Boolean)||'';const rest=raw.slice(raw.indexOf(first)+first.length);
      b.textContent=first.replace(RX_T,'$2').trim();const p=document.createElement('p');p.innerHTML='<br>';b.after(p);placeCaret(p,0);if(rest.trim()){document.execCommand('insertHTML',false,linesToHtml(rest,{}).html)}onEdInput();return}
    const p=document.createElement('p');p.innerHTML='<br>';b.after(p);placeCaret(p,0)}}const html=cd.getData('text/html');const txt=cd.getData('text/plain');
  let ins='';
  if(txt&&txt.includes('\n')&&!/<(h[1-3]|blockquote|ol|ul)\b/i.test(html)){
    const r=linesToHtml(txt,{});const h1=$('#ed h1');if(r.title&&h1&&!h1.textContent.trim()){h1.textContent=r.title}ins=r.html}
  else if(html){ins=cleanHtml(html).replace(/<\/?h1>/g,m=>m.replace('h1','h2'))}
  else{document.execCommand('insertText',false,txt||'');return}
  document.execCommand('insertHTML',false,ins);onEdInput()}
function tbState(){if(!E)return;const set=(id,on)=>{const b=document.getElementById(id);if(b)b.setAttribute('aria-pressed',on?'true':'false')};
  const hb=curBlock();const inH=hb&&/^H[123]$/.test(hb.tagName);
  try{set('tbB',!inH&&document.queryCommandState('bold'));set('tbI',document.queryCommandState('italic'));set('tbU',document.queryCommandState('underline'))}catch(e){}
  const b=curBlock();const cur=!b?'':b.tagName==='H2'?'h2':b.tagName==='H3'?'h3':b.classList.contains('lg')?'lg':b.tagName==='P'?'p':'';
  $$('#tbSty [data-s]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.s===cur)))}
function fmt(cmd){const ed=$('#ed');ed.focus();document.execCommand(cmd,false,null);onEdInput();tbState()}
function fmtHead(){const b=curBlock();if(!b)return;if(b.tagName==='H1'){toast(t('tb_title')+': '+t('title_ph'));return}
  const next=b.tagName==='H2'?'<h3>':b.tagName==='H3'?'<p>':'<h2>';document.execCommand('formatBlock',false,next);onEdInput();tbState()}
function fmtStyle(){const r=$('#tbSty'),b=$('#tbH');if(!r)return;r.hidden=!r.hidden;b.setAttribute('aria-expanded',String(!r.hidden));tbState();fitToolbar()}
function fmtSet(k){const b=curBlock();if(!b)return;if(b.tagName==='H1'){toast(t('tb_title')+': '+t('title_ph'));return}
  if(k==='lg'){if(b.tagName!=='P')document.execCommand('formatBlock',false,'<p>');const nb=curBlock();if(nb)nb.classList.toggle('lg')}
  else{document.execCommand('formatBlock',false,'<'+k+'>');const nb=curBlock();if(nb)nb.classList.remove('lg')}
  onEdInput();tbState()}
function fmtSize(){const b=curBlock();if(!b||b.tagName==='H1')return;b.classList.toggle('lg');onEdInput()}
function fmtNote(){const b=curBlock();if(!b||!/^(P|DIV)$/.test(b.tagName))return;b.classList.remove('il');b.classList.toggle('nt');onEdInput()}
function fmtHl(){const sel=getSelection();if(!sel.rangeCount)return;const r=sel.getRangeAt(0);const ed=$('#ed');
  const inMark=(n=>{while(n&&n!==ed){if(n.nodeName==='MARK')return n;n=n.parentNode}return null})(r.commonAncestorContainer);
  if(inMark){inMark.replaceWith(...inMark.childNodes);onEdInput();return}
  if(r.collapsed){toast(t('sel_first'));return}
  const m=document.createElement('mark');m.appendChild(r.extractContents());$$('mark',m).forEach(x=>x.replaceWith(...x.childNodes));r.insertNode(m);
  sel.removeAllRanges();const nr=document.createRange();nr.selectNodeContents(m);nr.collapse(false);sel.addRange(nr);onEdInput()}
function insertBlockAfterCaret(node,focusNew){const ed=$('#ed');let b=curBlock();
  if(b&&b.tagName==='P'&&!b.textContent.trim()&&b!==ed.firstElementChild){b.replaceWith(node)}else if(b){b.after(node)}else ed.appendChild(node);
  let after=node.nextElementSibling;if(!after||focusNew){const p=document.createElement('p');p.innerHTML='<br>';node.after(p);after=p}
  if(focusNew)placeCaret(node,0);else placeCaret(after,0);onEdInput()}
function edPoint(){const h=document.createElement('h2');h.innerHTML='<br>';insertBlockAfterCaret(h,true)}
let savedRange=null;
/* Biblia al lado del editor */
const BP={b:null,c:1,sel:new Set(),q:'',ver:null};
function trackRange(){if(!E)return;const sel=getSelection();const ed=$('#ed');if(sel.rangeCount&&ed&&ed.contains(sel.anchorNode))E.lastRange=sel.getRangeAt(0).cloneRange()}
function bpOpen(){if(!E)return;trackRange();BP.ver=BP.ver||sLang(E.s);if(BP.b==null){const p=parseRef(derive(E.s).passage||'');BP.b=p?p.b:42;BP.c=p?p.ch:1}
  BP.sel.clear();let el=$('#bp');if(!el){el=document.createElement('aside');el.id='bp';el.className='bp';el.setAttribute('aria-label',t('bp_t'));$('.ed-view').appendChild(el)}
  $('.ed-view').classList.add('with-bp');if(document.activeElement)document.activeElement.blur();bpDraw();loadBible(BP.ver).then(bpDraw).catch(()=>{})}
function bpClose(){const el=$('#bp');if(el)el.remove();const v=$('.ed-view');if(v)v.classList.remove('with-bp')}
function bpDraw(){const el=$('#bp');if(!el)return;const l=BP.ver;const B=BIB[vkey(l)];const names=t('books',null,l);let body='';
  if(!B)body=`<p class="sub">${esc(t('b_loading'))}</p>`;
  else if(BP.q&&!parseRef(BP.q)&&BP.q.trim().length>=3){const hits=bibleSearch(BP.q,vkey(l));body=`<div class="res">${hits.slice(0,40).map(h=>`<button data-bpgo="${h.b},${h.c},${h.v}"><b>${esc(names[h.b])} ${h.c}:${h.v}</b><span>${h.html}</span></button>`).join('')||`<p class="sub">${esc(t('b_none'))}</p>`}</div>`}
  else{const ch=(B[BP.b]||[])[BP.c-1]||[];body=`<p class="sub" style="margin:0 0 4px">${esc(t('bp_pick'))}</p><div class="verses" style="padding:6px;font-size:16px">${ch.map((v,i)=>v?`<button class="vs" data-bpv="${i+1}" aria-pressed="${BP.sel.has(i+1)}"><sup>${i+1}</sup>${esc(v)}</button>`:'').join('')}</div>`}
  const chN=B?(B[BP.b]||[]).length:1;const scroll=el.querySelector('.bp-body')?.scrollTop||0;
  el.innerHTML=`<div class="bp-head"><b>${esc(t('bp_t'))}</b><button class="btn sm ghost" data-bpver>${esc(VNAME[vkey(l)])}</button><button class="iconbtn" data-bpclose aria-label="${esc(t('close'))}">${ic('x')}</button></div>
   <input class="inp" id="bpQ" type="search" value="${esc(BP.q)}" placeholder="${esc(t('b_search'))}" autocomplete="off">
   <div class="bsel"><select class="book" id="bpB">${names.map((n,i)=>`<option value="${i}" ${i===BP.b?'selected':''}>${esc(n)}</option>`).join('')}</select><select class="chap" id="bpC">${Array.from({length:chN},(_,i)=>`<option value="${i+1}" ${i+1===BP.c?'selected':''}>${esc(t('chap'))} ${i+1}</option>`).join('')}</select><select class="chap" id="bpV" aria-label="${esc(t('vers'))}"><option value="">${esc(t('vers'))}</option>${Array.from({length:B?((B[BP.b]||[])[BP.c-1]||[]).length:0},(_,i)=>`<option value="${i+1}">${esc(t('vers'))} ${i+1}</option>`).join('')}</select></div>
   <div class="bp-body">${body}</div>
   <button class="btn gold block" data-bpins ${BP.sel.size?'':'disabled style="opacity:.5"'}>${esc(BP.sel.size?t('bp_ins_n',{n:BP.sel.size}):t('bp_ins'))}</button>`;
  const bd=el.querySelector('.bp-body');if(bd)bd.scrollTop=scroll;
  $('#bpB').onchange=e=>{BP.b=+e.target.value;BP.c=1;BP.sel.clear();bpDraw()};$('#bpC').onchange=e=>{BP.c=+e.target.value;BP.sel.clear();bpDraw()};$('#bpV').onchange=e=>{const v=+e.target.value;if(!v)return;BP.sel.add(v);bpDraw();const n=$(`#bp [data-bpv="${v}"]`);n&&n.scrollIntoView({block:'center',behavior:'smooth'})};
  const q=$('#bpQ');q.oninput=()=>{BP.q=q.value;clearTimeout(q._t);q._t=setTimeout(()=>{const p=parseRef(BP.q);if(p){BP.b=p.b;BP.c=Math.max(1,p.ch);BP.sel=new Set(p.vs||[]);BP.q=''}bpDraw();const n=$('#bpQ');if(n&&BP.q){n.focus();n.setSelectionRange(n.value.length,n.value.length)}},350)}}
document.addEventListener('click',e=>{const el=e.target.closest('#bp');if(!el)return;
  if(e.target.closest('[data-bpclose]')){bpClose();return}
  if(e.target.closest('[data-bpver]')){const order=['es','pt','es65','ptr','nva'];BP.ver=order[(order.indexOf(vkey(BP.ver))+1)%order.length];BP.sel.clear();bpDraw();loadBible(BP.ver).then(bpDraw).catch(()=>{});return}
  const v=e.target.closest('[data-bpv]');if(v){const n=+v.dataset.bpv;BP.sel.has(n)?BP.sel.delete(n):BP.sel.add(n);bpDraw();return}
  const g=e.target.closest('[data-bpgo]');if(g){const[b,c,vv]=g.dataset.bpgo.split(',').map(Number);BP.b=b;BP.c=c;BP.q='';BP.sel=new Set([vv]);bpDraw();return}
  if(e.target.closest('[data-bpins]')&&BP.sel.size&&E){const l=BP.ver;const ch=BIB[vkey(l)][BP.b][BP.c-1];const vs=[...BP.sel].sort((a,b)=>a-b);
    const ref=refName(BP.b,BP.c,vs,['pt','ptr','nva'].includes(vkey(l))?'pt':'es');const txt=vs.length===1?ch[vs[0]-1]:vs.map(x=>`${x} ${ch[x-1]}`).join(' ');
    const ed=$('#ed');if(E.lastRange&&ed.contains(E.lastRange.startContainer)){const sl=getSelection();sl.removeAllRanges();sl.addRange(E.lastRange)}else{placeCaret(ed.lastElementChild,1)}
    const bq=document.createElement('blockquote');bq.setAttribute('data-ref',ref);bq.textContent=txt;insertBlockAfterCaret(bq,false);trackRange();BP.sel.clear();bpDraw();toast(t('inserted'))}});
function edVerse(){bpOpen()}
function edVerseQuick(){const sel=getSelection();savedRange=sel.rangeCount?sel.getRangeAt(0).cloneRange():null;const l=sLang(E.s);
  const sh=openSheet(`<h3>${esc(t('verse_t'))}</h3><p class="sub" style="margin:0">${esc(t(l==='pt'?'verse_hint_pt':'verse_hint'))}</p>
   <input class="inp" id="vRef" placeholder="${esc(t('ref_ph'))}" autocomplete="off" autocapitalize="words" enterkeyhint="done">
   <div id="vPrev" class="serif" style="font-style:italic;font-size:16px;line-height:1.55;min-height:24px;color:var(--muted)"></div>
   <button class="btn gold block" data-act="vIns">${esc(t('insert'))}</button>`);
  loadBible(l).catch(()=>{});const inp=$('#vRef',sh);
  inp.addEventListener('input',()=>{const v=inp.value;const p=parseRef(v);$('#vPrev',sh).textContent=p&&p.vs?(bibleText(v,l)||''):''});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();vInsert()}});setTimeout(()=>inp.focus(),80)}
function vInsert(){const inp=$('#vRef');if(!inp)return;const l=sLang(E.s);const ref=cleanRef(inp.value);const p=parseRef(ref);
  if(!p||!p.vs){toast(t('verse_nf'));return}const nice=refName(p.b,p.ch,p.vs,l);const txt=bibleText(ref,l);
  closeSheet();const ed=$('#ed');ed.focus();if(savedRange){const s=getSelection();s.removeAllRanges();s.addRange(savedRange)}
  const bq=document.createElement('blockquote');bq.setAttribute('data-ref',nice);bq.textContent=txt;insertBlockAfterCaret(bq,false)}
/* detalles */
function infoSheet(){if(!E)return;closeSheet();const i=Object.assign({},E.s.info||{});const F=[['goal','i_goal','text'],['aud','i_aud','text'],['dur','i_dur','number'],['text','i_text','text'],['keys','i_keys','text'],['prep','i_prep','date'],['pred','i_pred','date'],['place','i_place','text']];
  if(!i.prep)i.prep=todayISO(new Date(E.s.created||Date.now()));
  const sh=openSheet(`<h3>${esc(t('details_t'))}</h3><p class="sub" style="margin:0">${esc(t('optional'))}</p>
   ${F.map(([k,l,ty])=>`<div class="fld"><label for="if_${k}">${esc(t(l))}</label><input class="inp" id="if_${k}" type="${ty}" ${ty==='number'?'inputmode="numeric" min="0"':''} value="${esc(i[k]||'')}" ${k==='text'?`placeholder="${esc(derive(E.s).passage||t('ref_ph'))}"`:''}></div>`).join('')}
   <button class="btn gold block" id="ifOk">${esc(t('save'))}</button>`);
  $('#ifOk',sh).onclick=()=>{const o={};F.forEach(([k])=>{const v=$('#if_'+k,sh).value.trim();if(v)o[k]=k==='dur'?+v:v});E.s.info=o;E.dirty=true;edSave(true);closeSheet()}}
/* organizar */
function orgSheet(){if(!E)return;closeSheet();let mode='p';
  const sh=openSheet(`<h3>${esc(t('org_t'))}</h3><div class="seg" id="orgSeg"><button data-m="p" aria-pressed="true">${esc(t('org_pts'))}</button><button data-m="b" aria-pressed="false">${esc(t('org_par'))}</button></div>
    <p class="sub" style="margin:0">${esc(t('org_hint'))}</p><div id="orgList" style="display:flex;flex-direction:column;gap:6px"></div><button class="btn gold block" data-act="sheetClose">${esc(t('close'))}</button>`);
  const ed=$('#ed');
  function groups(){const kids=[...ed.children].filter(x=>x.tagName!=='H1');if(mode==='b')return kids.filter(x=>x.textContent.trim()).map(x=>[x]);
    const g=[];let cur=null;kids.forEach(x=>{if(x.tagName==='H2'){cur=[x];g.push(cur)}else if(cur)cur.push(x)});return g}
  function draw(){const G=groups();$('#orgList',sh).innerHTML=G.length?G.map((g,i)=>{const h=g[0];const tx=h.textContent.trim().slice(0,70)||'—';const isH=h.tagName==='H2';
      return`<div class="row" style="background:var(--bg);border-radius:12px;padding:6px 6px 6px 12px"><span style="flex:1;min-width:0;font-size:14.5px;${isH?'font-weight:800':''};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(tx)}${mode==='p'&&g.length>1?` <span class="sub">· ${g.length-1}</span>`:''}</span>
      <button class="iconbtn" data-o="up" data-i="${i}" aria-label="${esc(t('up'))}" ${i===0?'disabled style="opacity:.3"':''}><svg class="i" aria-hidden="true" style="transform:rotate(180deg)"><use href="#i-down"/></svg></button>
      <button class="iconbtn" data-o="dn" data-i="${i}" aria-label="${esc(t('down'))}" ${i===G.length-1?'disabled style="opacity:.3"':''}>${ic('down')}</button></div>`}).join(''):`<p class="sub">—</p>`}
  sh.addEventListener('click',e=>{const sg=e.target.closest('#orgSeg button');if(sg){mode=sg.dataset.m;$$('#orgSeg button',sh).forEach(x=>x.setAttribute('aria-pressed',x===sg));draw();return}
    const b=e.target.closest('[data-o]');if(!b||b.disabled)return;const G=groups();const i=+b.dataset.i;const j=b.dataset.o==='up'?i-1:i+1;if(j<0||j>=G.length)return;
    const a=G[Math.min(i,j)],c=G[Math.max(i,j)];const frag=document.createDocumentFragment();c.forEach(x=>frag.appendChild(x));a[0].before(frag);
    snap();onEdInput();snap();draw()});
  draw()}
/* modelos */
function tplHtml(k,l){const es=l!=='pt';const H=x=>`<h2>${esc(x)}</h2>`,P=x=>`<p>${esc(x)}</p>`,V=r=>`<blockquote data-ref="${esc(r)}"></blockquote>`;
  const T={exp:es?[H('Introducción'),P('Contexto del pasaje y propósito del mensaje.'),H('Primera idea del texto'),P('Explicación.'),P('Aplicación.'),H('Segunda idea del texto'),P('Explicación.'),P('Aplicación.'),H('Tercera idea del texto'),P('Explicación.'),P('Aplicación.'),H('Conclusión'),P('Resumen y llamado.')]
      :[H('Introdução'),P('Contexto da passagem e propósito da mensagem.'),H('Primeira ideia do texto'),P('Explicação.'),P('Aplicação.'),H('Segunda ideia do texto'),P('Explicação.'),P('Aplicação.'),H('Terceira ideia do texto'),P('Explicação.'),P('Aplicação.'),H('Conclusão'),P('Resumo e apelo.')],
    tem:es?[H('Introducción'),P('Presenta el tema y por qué importa hoy.'),H('Primer punto'),P('Versículo de apoyo y explicación.'),H('Segundo punto'),P('Versículo de apoyo y explicación.'),H('Tercer punto'),P('Versículo de apoyo y explicación.'),H('Conclusión'),P('Aplicación práctica y llamado.')]
      :[H('Introdução'),P('Apresente o tema e por que ele importa hoje.'),H('Primeiro ponto'),P('Versículo de apoio e explicação.'),H('Segundo ponto'),P('Versículo de apoio e explicação.'),H('Terceiro ponto'),P('Versículo de apoio e explicação.'),H('Conclusão'),P('Aplicação prática e apelo.')],
    cena:es?[H('Introducción'),V('1 Corintios 11:23-26'),H('El significado del pan'),P(''),H('El significado de la copa'),P(''),H('Examinarse a sí mismo'),V('1 Corintios 11:28'),H('Conclusión'),P('Oración y participación.')]
      :[H('Introdução'),V('1 Coríntios 11:23-26'),H('O significado do pão'),P(''),H('O significado do cálice'),P(''),H('Examinar-se a si mesmo'),V('1 Coríntios 11:28'),H('Conclusão'),P('Oração e participação.')],
    evan:es?[H('Introducción'),P('Una historia o pregunta que conecte con la gente.'),H('El problema: el pecado'),V('Romanos 3:23'),H('La solución: Cristo'),V('Juan 3:16'),H('La respuesta: fe y arrepentimiento'),V('Hechos 3:19'),H('Llamado'),P('Invitación a entregar la vida a Cristo.')]
      :[H('Introdução'),P('Uma história ou pergunta que conecte com as pessoas.'),H('O problema: o pecado'),V('Romanos 3:23'),H('A solução: Cristo'),V('João 3:16'),H('A resposta: fé e arrependimento'),V('Atos 3:19'),H('Apelo'),P('Convite para entregar a vida a Cristo.')],
    est:es?[H('Texto'),P('Escribe la cita del pasaje.'),H('Observación'),P('¿Qué dice el texto?'),H('Interpretación'),P('¿Qué significa?'),H('Aplicación'),P('¿Cómo lo vivo hoy?'),H('Preguntas para el grupo'),'<ol><li>'+esc('Pregunta 1')+'</li><li>'+esc('Pregunta 2')+'</li></ol>']
      :[H('Texto'),P('Escreva a referência da passagem.'),H('Observação'),P('O que o texto diz?'),H('Interpretação'),P('O que significa?'),H('Aplicação'),P('Como vivo isso hoje?'),H('Perguntas para o grupo'),'<ol><li>'+esc('Pergunta 1')+'</li><li>'+esc('Pergunta 2')+'</li></ol>']};
  return(T[k]||[]).join('').replace(/<p><\/p>/g,'<p><br></p>')}
function tplSheet(){if(!E)return;closeSheet();const l=sLang(E.s);
  const sh=openSheet(`<h3>${esc(t('model_t'))}</h3><p class="sub" style="margin:0">${esc(t('model_d'))}</p><div class="acts">${['exp','tem','cena','evan','est'].map(k=>`<button class="act" data-tp="${k}">${ic('doc')}${esc(t('tp_'+k))}</button>`).join('')}</div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-tp]');if(!b)return;const ed=$('#ed');snap();const h1=ed.querySelector('h1');const title=h1?h1.textContent:'';
    ed.innerHTML=`<h1>${esc(title)}</h1>`+tplHtml(b.dataset.tp,l);placeholders();closeSheet();onEdInput();snap();drawEdMeta();placeCaret(ed.querySelector('h1'),0);ed.focus()})}
/* versiones */
function versSheet(){if(!E)return;closeSheet();edSave();commitHist();const s=sermons.find(x=>x.id===E.s.id)||E.s;const H=s.hist||[];
  const wcount=h=>{const d=document.createElement('div');d.innerHTML=h;return(d.textContent.match(/\S+/g)||[]).length};
  const sh=openSheet(`<h3>${esc(t('versions'))}</h3>${H.length?`<div class="acts">${H.map((v,i)=>{const d=new Date(v.at);const tx=(()=>{const x=document.createElement('div');x.innerHTML=v.html;return[...x.children].map(c=>c.textContent.trim()).filter(Boolean).join(' · ').slice(0,90)})();
      return`<button class="act" data-vi="${i}" style="flex-direction:column;align-items:flex-start;gap:2px;padding:10px 0"><b>${esc(d.toLocaleDateString(prefs.ui==='pt'?'pt-BR':'es'))} ${esc(d.toTimeString().slice(0,5))} · ${wcount(v.html)} ${esc(t('words'))}</b><span class="sub">${esc(tx)}</span></button>`}).join('')}</div>`:`<p class="sub">${esc(t('ver_none'))}</p>`}`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-vi]');if(!b)return;const v=H[+b.dataset.vi];closeSheet();
    const pv=openSheet(`<h3>${esc(t('versions'))}</h3><div class="doc" style="padding:0;max-height:50vh;overflow:auto;font-size:15px">${cleanHtml(v.html)}</div><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn gold" id="vRest">${esc(t('ver_restore'))}</button></div>`);
    $('#vRest',pv).onclick=()=>{const ed=$('#ed');snap();ed.innerHTML=cleanHtml(v.html);placeholders();onEdInput();snap();edSave(true);commitHist();closeSheet();toast(t('ver_restored'));drawEdMeta()}})}
function fitToolbar(){const tb=$('#tb');if(!tb||!window.visualViewport)return;const vv=visualViewport;
  const off=Math.max(0,window.innerHeight-vv.height-vv.offsetTop);tb.style.bottom=off+'px';tb.style.paddingBottom=off>0?'8px':''}
/* el cursor nunca queda escondido detrás de las barras fijas de arriba (iPhone mueve la página al abrir el teclado) */
let edVisT=0;function edCaretVis(){if(!E||edVisT)return;edVisT=requestAnimationFrame(()=>{edVisT=0;const ed=$('#ed'),em=$('#edMeta');if(!ed||!em)return;const sel=getSelection();if(!sel.rangeCount||!ed.contains(sel.anchorNode))return;
  let n=sel.anchorNode;while(n&&n.parentNode!==ed)n=n.parentNode;if(n&&n===ed.firstElementChild){if(window.scrollY>0)window.scrollTo(0,0);return}
  let r=sel.getRangeAt(0).getBoundingClientRect();if(!r.height&&n&&n.getBoundingClientRect)r=n.getBoundingClientRect();
  const top=em.getBoundingClientRect().bottom+(window.visualViewport?visualViewport.offsetTop:0)+8;if(r.height&&r.top<top)window.scrollBy(0,r.top-top)})}
document.addEventListener('selectionchange',()=>{if(E)edCaretVis()});
/* sermón corto: la página no tiene por qué moverse; si el iPhone la corre, vuelve al inicio */
function edLockTop(){if(!E||view.overlay!=='editor')return;const se=document.scrollingElement;if(window.scrollY>0&&se.scrollHeight-window.innerHeight<=260)window.scrollTo(0,0)}
window.addEventListener('scroll',edLockTop,{passive:true});if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(edLockTop,80));
if(window.visualViewport){visualViewport.addEventListener('resize',fitToolbar);visualViewport.addEventListener('resize',()=>{if(E)setTimeout(edCaretVis,60)});visualViewport.addEventListener('scroll',fitToolbar)}
function edMenu(){if(!E)return;edSave();if(!sermons.find(x=>x.id===E.s.id)){toast(t('body_ph'));return}const id=E.s.id;
  openSheet(`<div class="acts">
   <button class="act" data-act="share" data-id="${esc(id)}">${ic('share')}${esc(t('act_share'))}</button>
   <button class="act" data-act="edInfo">${ic('doc')}${esc(t('details_t'))}</button>
   <button class="act" data-act="edOrg">${ic('ol')}${esc(t('organize'))}</button>
   <button class="act" data-act="dicE">${ic('dict')}${esc(t('dx_ed'))}</button>
   <button class="act" data-act="aiOpen">${ic('spark')}${esc(t('ai'))}</button>
   <button class="act" data-act="recE">${ic('mic')}${esc(t('rec'))}</button>
   <button class="act" data-act="vers">${ic('undo')}${esc(t('versions'))}</button>
   <button class="act" data-act="dup" data-id="${esc(id)}">${ic('copy')}${esc(t('act_dup'))}</button>
   <button class="act" data-act="trans" data-id="${esc(id)}">${ic('lang')}${esc(t('tr_to',{l:sLang(E.s)==='pt'?'Español':'Português'}))}</button>
   <button class="act" data-act="hist" data-id="${esc(id)}">${ic('cal')}${esc(t('act_hist'))}</button>
   <button class="act red" data-act="delAsk" data-id="${esc(id)}">${ic('trash')}${esc(t('act_del'))}</button></div>`)}
function pickCategory(cb,cur){const cats=[...new Set([...meta.cats,...sermons.map(catOf).filter(Boolean)])];
  const sh=openSheet(`<h3>${esc(t('category'))}</h3><div class="catlist">
   <button class="chip ${!cur?'':''}" data-pc="" aria-pressed="${!cur}">${esc(t('no_cat'))}</button>
   ${cats.map(c=>`<button class="chip" data-pc="${esc(c)}" aria-pressed="${cur===c}">${esc(c)}</button>`).join('')}</div>
   <div class="row"><input class="inp" id="pcNew" placeholder="${esc(t('add_cat'))}"><button class="btn dark" id="pcAdd">${esc(t('add'))}</button></div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pc]');if(b){cb(b.dataset.pc);closeSheet()}});
  $('#pcAdd',sh).onclick=()=>{const v=$('#pcNew',sh).value.trim();if(!v)return;if(!meta.cats.includes(v)){meta.cats.push(v);putMeta()}cb(v);closeSheet()}}

/* =========================================================
   Compartir · PDF
   ========================================================= */
function numberedDoc(s){const d=docOf(s);let n=0;$$('h2',d).forEach(h=>{if(!secOf(h.textContent)){n++;h.dataset.n=n;h.textContent=h.textContent.replace(RX_PT,'').replace(/^[:\-–\s]+/,'')||h.textContent}});return d}
function inlineTxt(el){let o='';el.childNodes.forEach(n=>{if(n.nodeType===3)o+=n.nodeValue;else if(n.nodeType===1){const x=inlineTxt(n);
  if(/^(B|STRONG|MARK)$/.test(n.tagName)&&x.trim())o+=`*${x.trim()}* `;else if(/^(I|EM)$/.test(n.tagName)&&x.trim())o+=`_${x.trim()}_ `;else if(n.tagName==='BR')o+='\n';else o+=x}});return o.replace(/ +\n/g,'\n')}
function sermonText(s,pointsOnly){const d=numberedDoc(s);const l=sLang(s);const out=[];
  for(const el of [...d.children]){const tg=el.tagName;const tx=el.textContent.trim();
    if(tg==='H1'){if(tx)out.push(`*${tx}*`);continue}
    if(tg==='H2'){out.push('');out.push(el.dataset.n?`*${el.dataset.n}. ${tx}*`:`*${tx.toUpperCase()}*`);continue}
    if(tg==='BLOCKQUOTE'){const r=el.getAttribute('data-ref');const v=tx||(r?bibleText(r,l):'');if(pointsOnly){if(r)out.push(`  ${r}`);continue}out.push(r?`_${r}_${v?' — '+v:''}`:`_${v}_`);continue}
    if(pointsOnly)continue;
    if(el.classList.contains('nt'))continue;
    if(tg==='H3'){out.push('');out.push(`*${tx}*`);continue}
    if(tg==='OL'||tg==='UL'){$$('li',el).forEach((li,i)=>out.push(`${tg==='OL'?i+1+'.':'•'} ${inlineTxt(li).trim()}`));continue}
    if(tx)out.push(inlineTxt(el).trim())}
  out.push('');out.push('— Meu Púlpito');return out.join('\n').replace(/\n{3,}/g,'\n\n').trim()}
function shareSheet(id){const s=sermons.find(x=>x.id===id);if(!s)return;closeSheet();let only=false;
  const sh=openSheet(`<h3>${esc(t('share'))}</h3><div class="seg" id="shSeg"><button data-o="0" aria-pressed="true">${esc(t('full'))}</button><button data-o="1" aria-pressed="false">${esc(t('only_points'))}</button></div>
   <div class="acts">
    <button class="act" id="shWa">${ic('chat')}${esc(t('wa'))}</button>
    <button class="act" id="shCp">${ic('copy')}${esc(t('copy_txt'))}</button>
    ${['print','study','preach','points'].map(m=>`<button class="act" data-pdf="${m}">${ic('print')}<span style="display:flex;flex-direction:column"><span>${esc(t('pdf_'+m))}</span><span class="sub">${esc(t('pdf_'+m+'_d'))}</span></span></button>`).join('')}
    ${navigator.share?`<button class="act" id="shOt">${ic('share')}${esc(t('other_apps'))}</button>`:''}</div>`);
  loadBible(sLang(s)).catch(()=>{});
  $('#shSeg',sh).onclick=e=>{const b=e.target.closest('button');if(!b)return;only=b.dataset.o==='1';$$('#shSeg button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('#shWa',sh).onclick=()=>{const a=document.createElement('a');a.href='https://wa.me/?text='+encodeURIComponent(sermonText(s,only));a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()};
  $('#shCp',sh).onclick=()=>copyText(sermonText(s,only)).then(()=>toast(t('txt_copied')));
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pdf]');if(b){closeSheet();printSermon(s,b.dataset.pdf)}});
  const ot=$('#shOt',sh);if(ot)ot.onclick=()=>navigator.share({title:derive(s).title,text:sermonText(s,only)}).catch(()=>{})}
async function printSermon(s,mode){if(mode===true)mode='points';if(!mode||mode===false)mode='print';const l=sLang(s);try{await loadBible(l)}catch(e){}
  const d=numberedDoc(s);const dv=derive(s);const inf=s.info||{};
  $$('blockquote[data-ref]',d).forEach(b=>{if(!b.textContent.trim())b.textContent=bibleText(b.getAttribute('data-ref'),l)});
  $$('p',d).forEach(p=>{if(isRef(p.textContent.trim())){const r=cleanRef(p.textContent.trim());const bq=document.createElement('blockquote');bq.setAttribute('data-ref',r);bq.textContent=bibleText(r,l);p.replaceWith(bq)}});
  $$('h2',d).forEach(h=>{if(h.dataset.n)h.textContent=`${h.dataset.n}. ${h.textContent}`});
  const h1=d.querySelector('h1');if(h1)h1.remove();
  if(mode==='points')[...d.children].forEach(x=>{if(!/^(H2|BLOCKQUOTE)$/.test(x.tagName))x.remove()});
  if(mode!=='study'&&mode!=='preach')$$('.nt',d).forEach(x=>x.remove());
  const L=(k,v)=>v?`<div><b>${esc(t(k))}:</b> ${esc(v)}</div>`:'';
  const infoBox=mode==='study'?`<div class="pinfo">${L('i_goal',inf.goal)}${L('i_aud',inf.aud)}${L('i_keys',inf.keys)}${L('i_place',inf.place)}${L('i_pred',inf.pred&&fmtD(inf.pred))}${L('i_dur',inf.dur&&inf.dur+' min')}</div>`:'';
  const notesArea=mode==='study'?`<div class="pnotes"><b>${esc(t('notes_area'))}</b>${'<i></i>'.repeat(12)}</div>`:'';
  $('#printArea').className='pm-'+mode;
  $('#printArea').innerHTML=`<div class="ph"><span style="display:flex;align-items:center;gap:8pt"><img src="logo.jpg" alt="">Meu Púlpito</span><span>${esc(new Date().toLocaleDateString(l==='pt'?'pt-BR':'es'))}</span></div>
   <h1>${esc(dv.title||t('untitled'))}</h1>${dv.passage&&!d.querySelector('blockquote[data-ref]')?`<div class="ref">${esc(dv.passage)}</div>`:''}${infoBox}<div class="pbody">${d.innerHTML}</div>${notesArea}<div class="pf">Meu Púlpito · ${esc(verLabel(l))}</div>`;
  toast(t('pdf_tip'));setTimeout(()=>window.print(),350)}
function histSheet(id,pre){const s=sermons.find(x=>x.id===id)||(E&&E.s.id===id?E.s:null);if(!s)return;closeSheet();
  const L=(s.log||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const sh=openSheet(`<h3>${esc(t('act_hist'))}</h3>
   ${L.length?L.map(x=>`<div style="border-top:1px solid var(--line);padding-top:10px;display:flex;flex-direction:column;gap:4px">
     <b style="font-size:15px">${esc(placeName(x))} · ${esc(fmtD(x.date))}${x.min?` · ${x.min} min`:''}</b>${x.notes?`<span style="white-space:pre-wrap;font-size:14.5px;line-height:1.5">${esc(x.notes)}</span>`:''}</div>`).join(''):`<p class="sub" style="margin:0">${esc(t('no_hist'))}</p>`}
   <button class="btn gold block" id="hAdd">${ic('plus')}${esc(t('register'))}</button>`);
  $('#hAdd',sh).onclick=()=>regSheet(id,{})}
function regSheet(id,pre){closeSheet();let place=pre.place||'sede';
  const sh=openSheet(`<h3>${esc(t('register'))}</h3>${pre.min?`<p class="sub" style="margin:0">${esc(t('ask_reg',{m:pre.min}))}</p>`:''}
   <div class="seg" id="rgPl">${['sede','anexo','otro'].map(k=>`<button data-p="${k}" aria-pressed="${place===k}">${esc(t(k==='otro'?'other':k))}</button>`).join('')}</div>
   <input class="inp" id="rgOther" placeholder="${esc(t('place_name'))}" ${place==='otro'?'':'hidden'}>
   <div class="two"><div class="fld"><label for="rgDate">${esc(t('date'))}</label><input class="inp" id="rgDate" type="date" value="${todayISO()}"></div>
     <div class="fld"><label for="rgMin">${esc(t('minutes'))}</label><input class="inp" id="rgMin" type="number" inputmode="numeric" min="0" value="${pre.min||''}"></div></div>
   <div class="fld"><label for="rgNotes">${esc(t('notes'))}</label><textarea class="inp" id="rgNotes" rows="4" placeholder="${esc(t('notes_ph'))}"></textarea></div>
   <div class="two"><button class="btn ghost" id="rgNo">${esc(t(pre.min?'later':'cancel'))}</button><button class="btn gold" id="rgOk">${esc(t('save'))}</button></div>`);
  $('#rgPl',sh).onclick=e=>{const b=e.target.closest('button');if(!b)return;place=b.dataset.p;$$('#rgPl button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#rgOther',sh).hidden=place!=='otro'};
  $('#rgNo',sh).onclick=()=>closeSheet();
  $('#rgOk',sh).onclick=()=>{const s=sermons.find(x=>x.id===id);if(!s){closeSheet();return}
    const e={id:uid(),place,placeName:place==='otro'?$('#rgOther',sh).value.trim():'',date:$('#rgDate',sh).value||todayISO(),min:+$('#rgMin',sh).value||null,notes:$('#rgNotes',sh).value.trim()};
    s.log=(s.log||[]).concat(e);s.preached=Object.assign({},s.preached);if(place!=='otro'&&(!s.preached[place]||e.date>s.preached[place]))s.preached[place]=e.date;
    putSermon(s);if(E&&E.s.id===id){E.s.log=s.log;E.s.preached=s.preached}
    const r=getResume();if(r&&r.id===id)ls.set(RES,null);closeSheet();toast(t('registered'))}}

/* =========================================================
   MODO PREGAR
   ========================================================= */
let PG=null;
async function openPreach(id,{resume,want}={}){track('pregar');
  if(E&&E.s.id===id)edSave();const s=sermons.find(x=>x.id===id)||(E&&E.s.id===id?E.s:null);if(!s)return;while($('.ov'))closeSheet();
  const lang=sLang(s);const r=getResume();const fromSaved=r&&r.id===id;
  const pos=(ls.get('mp.pos',{})||{})[id];PG={s,orig:s,lang,tSec:fromSaved?(r.tSec||0):0,run:false,int:0,calm:false,top:fromSaved?(r.top||0):(pos?pos.top:0),wake:null,raf:0};
  const el=document.createElement('div');el.className='pg '+prefs.p.bg;el.id='pg';
  el.innerHTML=`<div class="pg-top">
     <button class="iconbtn" data-act="pgClose" aria-label="${esc(t('exit'))}">${ic('x')}</button>
     <button class="pg-timer" id="pgTimer" data-act="pgTimer" aria-label="${esc(t('p_timer'))}">${ic('play')}<span id="pgT">00:00</span><small id="pgG"></small></button>
     <button class="pg-where" id="pgWhere" data-act="pgIdx" aria-label="${esc(t('index'))}"></button>
     <button class="pg-lang" data-act="pgLang" id="pgLang" aria-label="${esc(t('pl_t'))}">${lang==='pt'?'PT':'ES'}</button>
     <button class="iconbtn" data-act="pgSet" aria-label="${esc(t('p_set'))}" style="color:var(--pfg);font-weight:800;font-size:16px">Aa</button></div>
   <div class="pg-prog"><i id="pgProg"></i></div>
   <div class="pg-scroll" id="pgScroll"><article class="pg-text" id="pgText"></article></div>
   <div class="pg-dim" id="pgDim" aria-hidden="true"></div>
   <div class="pg-bot"><button class="prev" data-act="pgPrev">${ic('back')}${esc(t('p_prev',null,lang))}</button><button class="scr" data-act="pgScr" id="pgScr" aria-label="${esc(t('p_scroll'))}">${ic('down')}</button><button class="next" data-act="pgNext"><span id="pgNextL">${esc(t('p_next',null,lang))}</span>${ic('next')}</button></div>`;
  document.body.appendChild(el);document.body.style.overflow='hidden';
  if(want&&want!==lang){const h=trCached(s,want);if(h){PG.s=Object.assign({},s,{html:h,lang:want});PG.lang=want;$('#pgLang').textContent=want.toUpperCase()}}
  pgRender();pgApply();
  const sc=$('#pgScroll');sc.addEventListener('scroll',pgScroll,{passive:true});
  sc.addEventListener('click',pgTap);
  let pz=null;const dist=ts=>Math.hypot(ts[0].clientX-ts[1].clientX,ts[0].clientY-ts[1].clientY);
  sc.addEventListener('touchstart',e=>{if(e.touches.length===2){pz={d:dist(e.touches),fs:prefs.p.fs};if(PG&&PG.asc)ascStop()}},{passive:true});
  sc.addEventListener('touchmove',e=>{if(pz&&e.touches.length===2){e.preventDefault();const f=Math.round(Math.min(60,Math.max(20,pz.fs*dist(e.touches)/pz.d)));if(f!==prefs.p.fs){const ratio=sc.scrollTop/Math.max(1,sc.scrollHeight);prefs.p.fs=f;pgApply();sc.scrollTop=ratio*sc.scrollHeight}}},{passive:false});
  sc.addEventListener('touchend',e=>{if(e.touches.length<2)pz=null},{passive:true});sc.addEventListener('touchstart',()=>{if(PG&&PG.asc){ascStop();toast(t('scroll_pause',null,PG.lang))}},{passive:true});sc.addEventListener('wheel',()=>{if(PG&&PG.asc)ascStop()},{passive:true});
  requestAnimationFrame(()=>{sc.scrollTop=PG.top});
  try{await loadBible(PG.lang);if(PG){const top=sc.scrollTop;pgRender();sc.scrollTop=top}}catch(e){}
  if(PG&&PG.top)requestAnimationFrame(()=>{sc.scrollTop=PG.top});
  if(prefs.p.tap&&!ls.get('mp.tip',false)){ls.set('mp.tip',true);toast(t('tip_tap',null,lang))}else if(prefs.p.clean&&ls.get('mp.tipc2',0)<3){ls.set('mp.tipc2',ls.get('mp.tipc2',0)+1);toast(t('tip_clean',null,lang))}else if(PG&&PG.top>40)toast(t('cont',null,lang));
  try{PG.wake=await navigator.wakeLock?.request('screen')}catch(e){}
}
function pgRender(){if(!PG)return;const s=PG.s,l=PG.lang;const d=docOf(s);const out=[];let n=0,k=0;PG.secs=[];
  const dv=derive(s);
  for(const el of [...d.children]){const tg=el.tagName,tx=el.textContent.trim(),inner=cleanHtml(el.innerHTML);
    if(tg==='H1'){if(dv.passage&&!d.querySelector('blockquote[data-ref]'))out.push(`<div class="ref-top">${esc(t('base',null,l))} · ${esc(dv.passage)}</div>`);if(tx)out.push(`<h1>${esc(tx)}</h1>`);continue}
    if(tg==='H2'){if(!tx)continue;const sk=secOf(tx);const id='s'+(k++);
      if(sk){out.push(`<h2 class="sec s-${sk}" id="${id}">${esc(tx.replace(/:$/,''))}</h2>`);PG.secs.push({id,label:tx.replace(/:$/,''),pt:0})}
      else{n++;const clean=tx.replace(RX_PT,'').replace(/^[:\-–\s]+/,'')||tx;const imp=el.classList.contains('imp');out.push(`<h2 id="${id}"${imp?' class="imp"':''}><span class="n">${n}.</span><span>${esc(clean)}${imp?` <svg class="i star-i" aria-label="${esc(t('imp',null,l))}" role="img"><use href="#i-star"/></svg>`:''}</span></h2>`);PG.secs.push({id,label:clean,pt:n,imp})}continue}
    if(tg==='H3'){if(tx)out.push(`<h3>${esc(tx)}</h3>`);continue}
    if(tg==='BLOCKQUOTE'){const ref=el.getAttribute('data-ref');const v=tx||(ref?bibleText(ref,l):'');
      if(ref)out.push(`<div class="vq"><button class="r" data-act="cmp" data-ref="${esc(ref)}">${esc(ref)} <span class="cv">· ${esc(t('cmp_t',null,l))} ›</span></button>${v?`<span class="x">${tx?inner:esc(v)}</span>`:''}${!tx&&v?`<span class="src">${esc(verLabel(l))}</span>`:''}</div>`);
      else out.push(`<div class="vq"><span class="x">${inner}</span></div>`);continue}
    if(tg==='P'){if(!tx)continue;
      if(el.classList.contains('nt')||tx.startsWith('@')){out.push(`<p class="nt" data-l="${esc(t('note',null,l))}">${esc(tx.replace(/^@\s?/,''))}</p>`);continue}
      if(isRef(tx)){const v=bibleText(tx,l);out.push(`<div class="vq"><button class="r" data-act="cmp" data-ref="${esc(cleanRef(tx))}">${esc(cleanRef(tx))} <span class="cv">· ${esc(t('cmp_t',null,l))} ›</span></button>${v?`<span class="x">${esc(v)}</span><span class="src">${esc(verLabel(l))}</span>`:''}</div>`);continue}
      const cls=[...el.classList].filter(c=>c==='lg'||c==='il').join(' ');out.push(`<p${cls?` class="${cls}"`:''}>${inner}</p>`);continue}
    out.push(`<${tg.toLowerCase()}>${inner}</${tg.toLowerCase()}>`)}
  PG.npts=n;$('#pgText').innerHTML=out.join('');$('#pgText').classList.toggle('outline',!!prefs.p.outline);pgWhere()}
const PFONT={serif:"var(--read)",sans:"var(--ui)",wide:"'Atkinson Hyperlegible',var(--ui)"};
function pgApply(){if(!PG)return;const p=prefs.p;const el=$('#pg');el.className='pg '+p.bg+(PG.calm?' calm':'')+(PG.asc?' asc':'');
  const tx=$('#pgText');tx.style.setProperty('--fs',p.fs+'px');tx.style.setProperty('--lh',p.lh);tx.classList.toggle('outline',!!p.outline);
  tx.style.setProperty('--ps',p.ps+'em');tx.style.setProperty('--mx',p.margin+'px');tx.style.textAlign=p.align;tx.dataset.al=p.align;tx.lang=PG.lang==='pt'?'pt-BR':'es';tx.style.fontFamily=PFONT[p.font]||PFONT.serif;
  if(p.color&&p.color!=='auto')el.style.setProperty('--pfg',p.color);else el.style.removeProperty('--pfg');
  $('#pgDim').style.opacity=p.dim||0;
  $('#pgTimer').hidden=!p.timer;$('#pgG').textContent=p.goal?`/ ${p.goal}:00`:'';el.classList.toggle('clean',!!p.clean);pgTimerDraw();savePrefs();clearTimeout(pgApply._t);pgApply._t=setTimeout(()=>{if(JSON.stringify(meta.read||{})!==JSON.stringify(prefs.p)){meta.read=Object.assign({},prefs.p);putMeta()}},2000)}
function pgTimerDraw(){if(!PG)return;$('#pgT').textContent=fmtSec(PG.tSec);const gs=prefs.p.goal*60;const ov=!!prefs.p.goal&&PG.tSec>=gs;const wn=!!prefs.p.goal&&!ov&&gs>300&&PG.tSec>=gs-300;
  const b=$('#pgTimer');b.classList.toggle('over',ov);b.classList.toggle('warn',wn);$('#pg').classList.toggle('tw',ov||wn);
  b.querySelector('use').setAttribute('href',PG.run?'#i-pause':'#i-play')}
function pgTimer(){if(!PG)return;PG.run=!PG.run;clearInterval(PG.int);
  if(PG.run)PG.int=setInterval(()=>{if(!PG)return;PG.tSec++;pgTimerDraw();const g=prefs.p.goal*60;
    if(g>300&&PG.tSec===g-300)toast(t('five',null,PG.lang));if(g&&PG.tSec===g)toast(t('done_t',null,PG.lang));if(PG.tSec%10===0)pgSave()},1000);pgTimerDraw()}
function pgSave(){if(!PG)return;ls.set(RES,{id:PG.s.id,top:PG.top,tSec:PG.tSec,at:Date.now()});const m=ls.get('mp.pos',{})||{};m[PG.s.id]={top:PG.top,at:Date.now()};const ks=Object.keys(m);if(ks.length>200)delete m[ks.sort((a,b)=>m[a].at-m[b].at)[0]];ls.set('mp.pos',m)}
let pgST=0;
function pgScroll(){if(!PG)return;const sc=$('#pgScroll');PG.top=sc.scrollTop;const max=Math.max(1,sc.scrollHeight-sc.clientHeight-window.innerHeight*.4);
  $('#pgProg').style.width=Math.min(100,PG.top/max*100)+'%';pgWhere();clearTimeout(pgST);pgST=setTimeout(pgSave,600)}
function pgCur(){const sc=$('#pgScroll');let cur=-1;(PG.secs||[]).forEach((x,i)=>{const h=document.getElementById(x.id);if(h&&h.offsetTop-sc.clientHeight*.4<=sc.scrollTop)cur=i});return cur}
function pgWhere(){if(!PG)return;const i=pgCur();const sc=PG.secs||[];const x=sc[i];
  $('#pgWhere').textContent=x?(x.pt?t('p_point',{i:x.pt,n:PG.npts},PG.lang):x.label):'';
  const nx=sc[i+1];$('#pgNextL').textContent=nx&&nx.pt?t('p_next',null,PG.lang):t('p_next2',null,PG.lang);
  $('.pg-bot .next').style.opacity=nx?'1':'.45'}
function pgGo(dir){if(!PG)return;const sc=$('#pgScroll');const els=(PG.secs||[]).map(x=>document.getElementById(x.id)).filter(Boolean);const y=sc.scrollTop;let tg;
  if(dir>0){const nx=els.find(h=>h.offsetTop-16>y+8);if(!nx){toast(t('p_last',null,PG.lang));return}tg=nx.offsetTop-16}
  else{const pv=els.filter(h=>h.offsetTop-16<y-8);tg=pv.length?pv[pv.length-1].offsetTop-16:0}
  sc.scrollTo({top:Math.max(0,tg),behavior:'smooth'})}
function pgTap(e){if(!PG||e.target.closest('button,a,input'))return;if(String(getSelection()||'').length)return;
  const r=$('#pgScroll').getBoundingClientRect();const x=(e.clientX-r.left)/r.width;if(prefs.p.tap&&x>.62)pgGo(1);else if(prefs.p.tap&&x<.38)pgGo(-1);else pgShowCtl()}
function pgShowCtl(){const el=$('#pg');if(!el||!prefs.p.clean)return;el.classList.add('show');clearTimeout(pgShowCtl._t);pgShowCtl._t=setTimeout(()=>{const e=$('#pg');if(e&&!e.querySelector('.ov'))e.classList.remove('show')},5000)}
function pgIndex(){if(!PG)return;const cur=pgCur();const l=PG.lang;
  const sh=openSheet(`<h3>${esc(t('index',null,l))}</h3><div class="acts"><button class="act" data-ix="top">${ic('home')}${esc(t('from_start',null,l))}</button>
    ${(PG.secs||[]).map((x,i)=>`<button class="act" data-ix="${x.id}" ${i===cur?'style="color:var(--gold)"':''}>${x.pt?`<b style="color:var(--gold);min-width:26px">${x.pt}.</b>`:`<span style="min-width:26px"></span>`}<span style="flex:1;${x.pt?'':'font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:800'}">${esc(x.label)}</span>${x.imp?`<svg class="i" style="fill:var(--gold);stroke:var(--gold)" aria-label="${esc(t('imp',null,l))}" role="img"><use href="#i-star"/></svg>`:''}</button>`).join('')}</div>`,{host:$('#pg')});
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-ix]');if(!b)return;closeSheet();const sc=$('#pgScroll');if(b.dataset.ix==='top'){sc.scrollTo({top:0,behavior:'smooth'});return}const h=document.getElementById(b.dataset.ix);if(h)sc.scrollTo({top:Math.max(0,h.offsetTop-16),behavior:'smooth'})})}
document.addEventListener('keydown',e=>{if(!PG||$('.ov')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
  if(['ArrowRight','PageDown',' ','ArrowDown'].includes(e.key)){e.preventDefault();pgGo(1)}else if(['ArrowLeft','PageUp','ArrowUp'].includes(e.key)){e.preventDefault();pgGo(-1)}});
document.addEventListener('visibilitychange',async()=>{if(PG&&document.visibilityState==='visible'){try{PG.wake=await navigator.wakeLock?.request('screen')}catch(e){}}else if(PG)pgSave()});
/* desplazamiento automático */
function ascStep(ts){if(!PG||!PG.asc)return;const sc=$('#pgScroll');const dt=PG.ascLast?Math.min(100,ts-PG.ascLast):16;PG.ascLast=ts;
  PG.ascAcc+=dt/1000*prefs.p.speed*7*(prefs.p.fs/30);const px=Math.floor(PG.ascAcc);
  if(px>=1){PG.ascAcc-=px;const b=sc.scrollTop;sc.scrollTop=b+px;if(sc.scrollTop<=b&&b>0){ascStop();toast(t('scroll_end',null,PG.lang));return}}
  PG.raf=requestAnimationFrame(ascStep)}
function ascStart(){if(!PG)return;PG.asc=true;PG.ascLast=0;PG.ascAcc=0;ascDraw();PG.raf=requestAnimationFrame(ascStep)}
function ascStop(){if(!PG)return;PG.asc=false;cancelAnimationFrame(PG.raf);ascDraw()}
function ascDraw(){const b=$('#pgScr');if(!b)return;b.classList.toggle('on',!!PG.asc);b.innerHTML=ic(PG.asc?'pause':'down')+(PG.asc?`<small>${prefs.p.speed}</small>`:'');b.setAttribute('aria-pressed',!!PG.asc)}
/* cambiar el idioma del sermón al predicar: la traducción queda guardada en el sermón (también sin conexión) */
function pgShow(lang){if(!PG)return;const sc=$('#pgScroll');const ratio=sc?sc.scrollTop/Math.max(1,sc.scrollHeight):0;
  if(lang===sLang(PG.orig)){PG.s=PG.orig}else{const h=trCached(PG.orig,lang);if(!h)return false;PG.s=Object.assign({},PG.orig,{html:h,lang})}
  PG.lang=lang;$('#pgLang').textContent=lang.toUpperCase();loadBible(lang).catch(()=>{}).then(()=>{pgRender();if(sc)sc.scrollTop=ratio*sc.scrollHeight});return true}
function pgLang(){if(!PG)return;if(!isPremium()){planGate('preg');return}const o=sLang(PG.orig),other=o==='pt'?'es':'pt';const L=PG.lang;const nm=x=>x==='pt'?'Português':'Español';
  const has=!!trCached(PG.orig,other);const old=PG.orig.tr&&PG.orig.tr[other];
  const sh=openSheet(`<h3>${esc(t('pl_t',null,L))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('pl_d',null,L))}</p>
    <div class="seg" style="align-self:stretch"><button data-pl="${o}" aria-pressed="${PG.lang===o}">${esc(nm(o))} · ${esc(t('pl_orig',null,L))}</button><button data-pl="${other}" aria-pressed="${PG.lang===other}">${esc(nm(other))}${has?'':' · '+esc(t('pl_new',null,L))}</button></div>
    ${old&&!has?`<p class="sub" style="margin:0">${esc(t('pl_changed',null,L))}</p>`:''}
    <p class="sub" id="plProg" style="margin:0" hidden></p>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(aiKey()?t('ai_tr_ai',null,L):t('pl_mm',null,L))}</p>`,{host:$('#pg')});
  sh.addEventListener('click',async ev=>{const b=ev.target.closest('[data-pl]');if(!b||b.disabled)return;const to=b.dataset.pl;
    if(to===PG.lang){closeSheet();return}
    if(pgShow(to)){closeSheet();return}
    const pr=$('#plProg',sh);pr.hidden=false;$$('[data-pl]',sh).forEach(x=>x.disabled=true);
    try{const src=PG.orig;const html=await translateHtml(src,to,m=>{pr.textContent=m});
      const real=sermons.find(x=>x.id===src.id);const target=real||src;target.tr=Object.assign({},target.tr||{},{[to]:{h:hashStr(getHtml(target)),html,at:Date.now()}});
      if(real)putSermon(real,{silent:true,keep:true});if(!PG)return;PG.orig=target;closeSheet();pgShow(to);toast(t('pl_ok',null,to))}
    catch(e){$$('[data-pl]',sh).forEach(x=>x.disabled=false);pr.textContent=t(e&&e.code==='quota'?'tr_quota':'tr_err',null,L)}})}
function pgSettings(){if(!PG)return;const p=prefs.p,l=PG.lang;const seg=(k,opts)=>`<div class="seg" data-pk="${k}">${opts.map(([v,lab])=>`<button data-v="${v}" aria-pressed="${String(p[k])===String(v)}">${esc(lab)}</button>`).join('')}</div>`;
  const colors=p.bg==='claro'||p.bg==='sepia'?[['auto',t('c_auto')],['#101827','●'],['#3B2F1E','●'],['#1F3A6B','●']]:[['auto',t('c_auto')],['#FFFFFF','●'],['#F3E9D2','●'],['#FFE08A','●']];
  const sw=k=>`<div class="seg" data-pk="color">${colors.map(([v,l])=>`<button data-v="${v}" aria-pressed="${p.color===v}" ${v!=='auto'?`style="color:${v};font-size:22px" aria-label="${v}"`:''}>${esc(l)}</button>`).join('')}</div>`;
  const rng=(id,k,min,max,step,lab,fmt)=>`<div class="fld"><span class="lb">${esc(lab)} · <span id="${id}V">${fmt(p[k])}</span></span><input class="rng" type="range" min="${min}" max="${max}" step="${step}" value="${p[k]}" data-rk="${k}" data-fmt="${id}" aria-label="${esc(lab)}"></div>`;
  const sh=openSheet(`<h3>${esc(t('p_set'))}</h3>
   <button class="btn block" id="psNight" style="background:#080D16;color:#fff;justify-content:flex-start;padding:0 16px;height:56px;box-shadow:0 0 0 1px rgba(214,173,85,.5) inset"><svg class="i" aria-hidden="true" style="stroke:#D6AD55"><use href="#i-spark"/></svg><span style="display:flex;flex-direction:column;align-items:flex-start;gap:1px"><span>${esc(t('night'))}</span><span style="font-size:12px;font-weight:500;opacity:.75">${esc(t('night_d'))}</span></span></button>
   <div class="fld"><span class="lb">${esc(t('clean'))}</span>${seg('clean',[[true,t('yes')],[false,t('no')]])}<span class="sub" style="font-size:12px">${esc(t('clean_d'))}</span></div>
   <span class="lbl">${esc(t('g_read'))}</span>
   ${rng('psFs','fs',20,60,1,t('p_size'),v=>v)}<span class="sub" style="font-size:12px;margin-top:-6px">${esc(t('pinch'))}</span>
   <div class="fld"><span class="lb">${esc(t('p_font'))}</span>${seg('font',[['serif',t('f_serif')],['sans',t('f_sans')],['wide',t('f_wide')]])}</div>
   <div class="fld"><span class="lb">${esc(t('p_lh'))}</span>${seg('lh',[[1.35,'S'],[1.5,'M'],[1.7,'L'],[1.95,'XL']])}</div>
   <div class="fld"><span class="lb">${esc(t('p_pspace'))}</span>${seg('ps',[[.4,'S'],[.75,'M'],[1.1,'L'],[1.5,'XL']])}</div>
   ${rng('psMx','margin',8,80,4,t('p_margin'),v=>v+'px')}
   <div class="fld"><span class="lb">${esc(t('p_align'))}</span>${seg('align',[['left',t('a_left')],['justify',t('a_just')],['center',t('a_center')]])}</div>
   <div class="fld"><span class="lb">${esc(t('p_outline'))}</span>${seg('outline',[[false,t('p_full_txt')],[true,t('p_only')]])}</div>
   <span class="lbl">${esc(t('g_screen'))}</span>
   <div class="fld"><span class="lb">${esc(t('p_bg'))}</span>${seg('bg',[['negro',t('bg_negro')],['azul',t('bg_azul')],['claro',t('bg_claro')],['sepia',t('bg_sepia')]])}</div>
   <div class="fld"><span class="lb">${esc(t('p_color'))}</span>${sw()}</div>
   ${rng('psDim','dim',0,.6,.05,t('p_dim'),v=>Math.round((1-v)*100)+'%')}
   <span class="lbl">${esc(t('g_nav'))}</span>
   ${rng('psSp','speed',1,10,1,t('p_scroll')+' · '+t('p_speed'),v=>v)}
   <div class="fld"><span class="lb">${esc(t('p_timer'))}</span>${seg('timer',[[true,t('show')],[false,t('hide')]])}</div>
   <div class="fld"><span class="lb">${esc(t('p_goal'))}</span>${seg('goal',[[0,t('free')],[20,'20'],[30,'30'],[40,'40'],[50,'50']])}</div>
   <div class="fld"><span class="lb">${esc(t('p_tap'))}</span>${seg('tap',[[true,t('yes')],[false,t('no')]])}</div>
   <div class="two"><button class="btn ghost" id="psReset" style="background:var(--pchip);color:var(--pfg);box-shadow:none">${ic('undo')}${esc(t('p_reset'))}</button>
     <button class="btn ghost" id="psCalm" style="background:var(--pchip);color:var(--pfg);box-shadow:none">${esc(t('p_calm'))}</button></div>
   ${document.fullscreenEnabled?`<button class="btn ghost" id="psFull" style="background:var(--pchip);color:var(--pfg);box-shadow:none">${ic('expand')}${esc(t('p_fs'))}</button>`:''}
   <button class="btn gold block" data-act="sheetClose">${esc(t('close'))}</button>`,{host:$('#pg')});
  sh.addEventListener('input',e=>{const r=e.target.closest('[data-rk]');if(!r)return;const k=r.dataset.rk;p[k]=+r.value;const f={psFs:v=>v,psMx:v=>v+'px',psDim:v=>Math.round((1-v)*100)+'%',psSp:v=>v}[r.dataset.fmt];$('#'+r.dataset.fmt+'V',sh).textContent=f(p[k]);pgApply();if(k==='speed')ascDraw()});
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pk] button');if(!b)return;const k=b.parentNode.dataset.pk;let v=b.dataset.v;v=v==='true'?true:v==='false'?false:isNaN(+v)?v:+v;p[k]=v;
    $$('button',b.parentNode).forEach(x=>x.setAttribute('aria-pressed',x===b));if(k==='bg'&&p.color!=='auto')p.color='auto';pgApply();if(k==='bg'){closeSheet();pgSettings()}});
  $('#psNight',sh).onclick=()=>{Object.assign(p,{bg:'negro',color:'#FFFFFF',dim:Math.max(p.dim||0,.25)});pgApply();closeSheet();pgSettings()};
  $('#psReset',sh).onclick=()=>{PG.run=false;clearInterval(PG.int);PG.tSec=0;pgTimerDraw();pgSave()};
  $('#psCalm',sh).onclick=()=>{PG.calm=!PG.calm;pgApply();closeSheet()};
  const fs=$('#psFull',sh);if(fs)fs.onclick=()=>{(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{});closeSheet()}}
function closePreach(){if(!PG)return;ascStop();pgSave();clearInterval(PG.int);try{PG.wake&&PG.wake.release()}catch(e){}
  const id=PG.s.id,min=PG.tSec>=60?Math.round(PG.tSec/60):0;$('#pg').remove();document.body.style.overflow='';PG=null;
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  if(!E)render();if(min&&sermons.find(x=>x.id===id))regSheet(id,{min})}

/* =========================================================
   BIBLIA
   ========================================================= */
const BV={ver:null,b:26,c:1,sel:new Set(),q:'',fav:false,err:false};
const bver=()=>BV.ver||prefs.bibleVer||prefs.ui;
function bibleHtml(){const l=bver();const B=BIB[l];const names=t('books',null,l);
  const chN=B?(B[BV.b]||[]).length:1;
  let body='';
  if(BV.fav){const F=meta.favVerses;body=F.length?`<div class="res">${F.map((f,i)=>`<button data-act="bFavOpen" data-i="${i}"><b>${esc(f.ref)} · ${esc(verLabel(f.v))}</b><span>${esc(f.text)}</span></button>`).join('')}</div>`:`<div class="empty"><p style="margin:0">${esc(t('b_nofav'))}</p></div>`}
  else if(!B){body=`<div class="empty"><p style="margin:0">${esc(t(BV.err?'b_err':'b_loading'))}</p>${BV.err?`<button class="btn dark" data-act="bRetry">${esc(t('go_on'))}</button>`:''}</div>`}
  else if(BV.q&&!parseRef(BV.q)&&BV.q.trim().length>=3){const hits=bibleSearch(BV.q,l);
    body=`<div class="sub">${esc(hits.length?t('b_res',{n:hits.length>=80?'80+':hits.length}):t('b_none'))}</div><div class="res">${hits.map(h=>`<button data-act="bGo" data-b="${h.b}" data-c="${h.c}" data-v="${h.v}"><b>${esc(names[h.b])} ${h.c}:${h.v}</b><span>${h.html}</span></button>`).join('')}</div>`}
  else{const ch=(B[BV.b]||[])[BV.c-1]||[];
    body=`<div class="verses">${ch.map((v,i)=>v?`<button class="vs" data-act="bSel" data-v="${i+1}" aria-pressed="${BV.sel.has(i+1)}"><sup>${i+1}</sup>${esc(v)}</button>`:'').join('')}</div>`}
  const sel=[...BV.sel];const head=`<div class="between"><h1 class="h">${esc(t('nav_bible'))}</h1><button class="btn sm ghost" data-act="bVer">${esc(verLabel(l))}${ic('down')}</button></div>`;
  const chips=`<div class="chips"><button class="chip" data-act="bMode" data-f="0" aria-pressed="${!BV.fav}">${esc(t('b_read'))}</button><button class="chip" data-act="bMode" data-f="1" aria-pressed="${BV.fav}">${ic('star')}${esc(t('b_favs_s'))}</button></div>`;
  return`${head}
   <form class="search" data-form="bSearch" role="search">${ic('search')}<input id="bq" type="search" value="${esc(BV.q)}" placeholder="${esc(t('b_search'))}" autocomplete="off" enterkeyhint="search" data-input="bQ"></form>
   ${chips}
   ${!BV.fav?`<div class="bsel"><select class="book" id="bBook" aria-label="Libro">${names.map((n,i)=>`<option value="${i}" ${i===BV.b?'selected':''}>${esc(n)}</option>`).join('')}</select>
     <select class="chap" id="bChap" aria-label="${esc(t('chap'))}">${Array.from({length:chN},(_,i)=>`<option value="${i+1}" ${i+1===BV.c?'selected':''}>${esc(t('chap'))} ${i+1}</option>`).join('')}</select>
     <select class="chap" id="bVers" aria-label="${esc(t('vers'))}"><option value="">${esc(t('vers'))}</option>${Array.from({length:B?((B[BV.b]||[])[BV.c-1]||[]).length:0},(_,i)=>`<option value="${i+1}" ${BV.sel.size===1&&BV.sel.has(i+1)?'selected':''}>${esc(t('vers'))} ${i+1}</option>`).join('')}</select></div>`:''}
   ${body}
   ${sel.length&&!BV.fav?`<div class="vbar"><span class="ref">${esc(refName(BV.b,BV.c,sel,l))}</span>
     <button class="iconbtn" data-act="bCopy" aria-label="${esc(t('copy_txt'))}">${ic('copy')}</button>
     <button class="iconbtn" data-act="bFav" aria-label="${esc(t('act_fav'))}">${ic('star')}</button>
     <button class="iconbtn" data-act="bCmp" aria-label="${esc(t('cmp'))}">${ic('lang')}</button>
     <button class="btn sm gold" data-act="bIns">${esc(t('ins_s'))}</button></div>`:''}`}
function bibleAfter(){const l=bver();if(!BIB[l]&&!BV.err)loadBible(l).then(()=>{if(view.tab==='bible'&&!view.overlay)render()}).catch(()=>{BV.err=true;if(view.tab==='bible')render()});
  const bb=$('#bBook'),bc=$('#bChap');if(bb)bb.onchange=()=>{BV.b=+bb.value;BV.c=1;BV.sel.clear();render()};if(bc)bc.onchange=()=>{BV.c=+bc.value;BV.sel.clear();render()};const bv=$('#bVers');if(bv)bv.onchange=()=>{const v=+bv.value;if(!v)return;BV.sel=new Set([v]);render();setTimeout(()=>{const el=$(`.vs[data-v="${v}"]`);el&&el.scrollIntoView({block:'center',behavior:'smooth'})},60)}}
let BIDX={};
function bibleSearch(q,l){const B=BIB[l];if(!B)return[];if(!BIDX[l]){const idx=[];B.forEach((bk,b)=>bk.forEach((ch,c)=>ch.forEach((v,i)=>{if(v)idx.push([b,c+1,i+1,norm(v),v])})));BIDX[l]=idx}
  const nq=norm(q.trim());const out=[];for(const r of BIDX[l]){const i=r[3].indexOf(nq);if(i>=0){out.push({b:r[0],c:r[1],v:r[2],html:`${esc(r[4].slice(0,i))}<mark>${esc(r[4].slice(i,i+nq.length))}</mark>${esc(r[4].slice(i+nq.length))}`});if(out.length>=80)break}}return out}
function bSelText(){const l=bver();const ch=BIB[l][BV.b][BV.c-1];const vs=[...BV.sel].sort((a,b)=>a-b);
  return{ref:refName(BV.b,BV.c,vs,l),text:vs.length===1?ch[vs[0]-1]:vs.map(v=>`${v} ${ch[v-1]}`).join(' '),v:l}}
function chooseSermon(cb){const S=sortedByUpd();const sh=openSheet(`<h3>${esc(t('choose_s'))}</h3><div class="acts">
   <button class="act" data-cs="__new">${ic('plus')}${esc(t('new_sermon'))}</button>
   ${S.slice(0,40).map(s=>`<button class="act" data-cs="${esc(s.id)}"><span class="serif" style="font-weight:700">${esc(derive(s).title||t('untitled'))}</span></button>`).join('')}</div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-cs]');if(b){closeSheet();cb(b.dataset.cs)}})}
function insertVerseInto(id,ref,text){let s;
  if(id==='__new'){s={id:uid(),html:`<h1></h1><blockquote data-ref="${esc(ref)}">${esc(text)}</blockquote><p><br></p>`,lang:bver(),fav:false,created:Date.now(),log:[],v:2};putSermon(s,{silent:true});openEditor(s.id);toast(t('inserted'));return}
  s=sermons.find(x=>x.id===id);if(!s)return;s.html=cleanHtml(getHtml(s)+`<blockquote data-ref="${esc(ref)}">${esc(text)}</blockquote>`);s.v=2;putSermon(s,{silent:true});openEditor(id);toast(t('inserted'))}

/* =========================================================
   AGENDA
   ========================================================= */
function dateBox(iso,gold){const d=new Date(iso+'T12:00:00');return`<div class="datebox ${gold?'gold':''}"><span>${esc(t('wd')[d.getDay()])}</span><b>${d.getDate()}</b></div>`}
const evPlace=e=>e.place==='sede'?t('sede'):e.place==='anexo'?t('anexo'):(e.placeName||t('other'));
function evCard(e,first){const s=e.sermonId&&sermons.find(x=>x.id===e.sermonId);
  return`<div class="ev"><button class="hd" data-act="evEdit" data-id="${esc(e.id)}">${dateBox(e.date,first)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <b style="font-size:15px">${esc(evPlace(e))}${e.time?' · '+esc(e.time):''}</b><span class="sub">${esc([e.type,e.theme||(!s?t('tbd'):'')].filter(Boolean).join(' · '))}</span></div></button>
    ${s?`<button class="link" data-act="preach" data-id="${esc(s.id)}">${ic('doc')}<span>${esc(derive(s).title||t('untitled'))}</span>${ic('lectern')}</button>`:`<button class="pick" data-act="evPick" data-id="${esc(e.id)}">${esc(t('pick_s'))}</button>`}</div>`}
let agMode='up';
function histAllHtml(){const L=[];liveS().forEach(s=>(s.log||[]).forEach(l=>L.push({s,l})));L.sort((a,b)=>(b.l.date||'').localeCompare(a.l.date||''));
  return`<span class="sub">${esc(t('hist_n',{n:L.length}))}</span><div class="list">${L.length?L.map(({s,l})=>{const d=derive(s);return`<button class="mini" data-act="hist" data-id="${esc(s.id)}">${dateBox(l.date,false)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px"><span class="ti">${esc(d.title||t('untitled'))}</span><span class="sub">${esc([placeName(l),d.passage,l.min?l.min+' min':''].filter(Boolean).join(' · '))}</span></div></button>`}).join(''):`<div class="empty"><p style="margin:0;max-width:34ch">${esc(t('hist_none'))}</p></div>`}</div>`}
function agendaHtml(){const td=todayISO();const d0=new Date(td+'T12:00:00');const mon=addDays(td,-((d0.getDay()+6)%7));
  const days=Array.from({length:7},(_,i)=>addDays(mon,i));const up=upcoming();const past=agenda.filter(e=>e.date<td).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
  const M=t('months');
  return`<div class="between"><div style="display:flex;flex-direction:column;gap:2px"><h1 class="h">${esc(t('nav_agenda'))}</h1><span class="sub">${esc(M[d0.getMonth()])} ${d0.getFullYear()}</span></div>
    <button class="btn gold" data-act="evNew">${ic('plus')}${esc(t('schedule'))}</button></div>
   <div class="week">${days.map(d=>{const x=new Date(d+'T12:00:00');return`<div class="day ${d===td?'today':''} ${agenda.some(e=>e.date===d)?'has':''}"><span>${esc(t('wd')[x.getDay()])}</span><b>${x.getDate()}</b><i></i></div>`}).join('')}</div>
   <div class="seg"><button data-act="agMode" data-m="up" aria-pressed="${agMode==='up'}">${esc(t('next_tab'))}</button><button data-act="agMode" data-m="hist" aria-pressed="${agMode==='hist'}">${esc(t('hist_all'))}</button></div>
   ${agMode==='hist'?histAllHtml():`<span class="sect">${esc(t('upcoming'))}</span>
   <div class="list">${up.length?up.map((e,i)=>evCard(e,i===0)).join(''):`<div class="empty"><p style="margin:0;max-width:34ch">${esc(t('no_ev'))}</p></div>`}</div>
   ${past.length?`<span class="sect">${esc(t('past'))}</span><div class="list">${past.map(e=>evCard(e,false)).join('')}</div>`:''}`}`}
function evForm(id){const e=id?Object.assign({},agenda.find(x=>x.id===id)):{id:uid(),date:addDays(todayISO(),(7-new Date().getDay())%7||7),time:'19:00',place:'sede',placeName:'',type:'',theme:'',sermonId:''};
  const S=sortedByUpd();const cats=[...new Set([...meta.cats,...agenda.map(x=>x.type).filter(Boolean)])];let place=e.place;
  const sh=openSheet(`<h3>${esc(t(id?'ev_edit':'ev_new'))}</h3>
   <div class="two"><div class="fld"><label for="evD">${esc(t('date'))}</label><input class="inp" id="evD" type="date" value="${esc(e.date)}"></div>
     <div class="fld"><label for="evT">${esc(t('time'))}</label><input class="inp" id="evT" type="time" value="${esc(e.time||'')}"></div></div>
   <div class="fld"><span class="lb">${esc(t('place'))}</span><div class="seg" id="evPl">${['sede','anexo','otro'].map(k=>`<button data-p="${k}" aria-pressed="${place===k}">${esc(t(k==='otro'?'other':k))}</button>`).join('')}</div>
     <input class="inp" id="evPn" placeholder="${esc(t('place_name'))}" value="${esc(e.placeName||'')}" ${place==='otro'?'':'hidden'}></div>
   <div class="fld"><label for="evTy">${esc(t('cult'))}</label><select class="inp" id="evTy"><option value="">—</option>${cats.map(c=>`<option ${c===e.type?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
   <div class="fld"><label for="evTh">${esc(t('theme'))}</label><input class="inp" id="evTh" value="${esc(e.theme||'')}"></div>
   <div class="fld"><label for="evS">${esc(t('sermon'))}</label><select class="inp" id="evS"><option value="">${esc(t('later_pick'))}</option>${S.map(s=>`<option value="${esc(s.id)}" ${s.id===e.sermonId?'selected':''}>${esc(derive(s).title||t('untitled'))}</option>`).join('')}</select></div>
   <div class="two">${id?`<button class="btn ghost" id="evDel" style="color:var(--danger)">${ic('trash')}${esc(t('act_del'))}</button>`:`<button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button>`}<button class="btn gold" id="evOk">${esc(t('save'))}</button></div>`);
  $('#evPl',sh).onclick=ev=>{const b=ev.target.closest('button');if(!b)return;place=b.dataset.p;$$('#evPl button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#evPn',sh).hidden=place!=='otro'};
  $('#evOk',sh).onclick=()=>{Object.assign(e,{date:$('#evD',sh).value||todayISO(),time:$('#evT',sh).value,place,placeName:place==='otro'?$('#evPn',sh).value.trim():'',type:$('#evTy',sh).value,theme:$('#evTh',sh).value.trim(),sermonId:$('#evS',sh).value});
    putEvent(e);closeSheet();toast(t('ev_saved'));render()};
  const del=$('#evDel',sh);if(del)del.onclick=()=>{delEvent(e.id);closeSheet();toast(t('ev_del'));render()}}

/* =========================================================
   PERFIL
   ========================================================= */
function profileHtml(){const lb=ls.get(BAK,null);const seg=(act,cur,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button data-act="${act}" data-v="${v}" aria-pressed="${cur===v}">${esc(l)}</button>`).join('')}</div>`;
  return`<div class="subhead"><button class="iconbtn" data-act="back" aria-label="${esc(t('close'))}">${ic('back')}</button><h1 class="h">${esc(t('nav_profile'))}</h1></div>
  <div class="card row" style="gap:14px"><button class="avatar avbtn" data-act="photo" aria-label="${esc(t(meta.photo?'photo':'photo_add'))}">${avatarIn()}<span class="avcam">${ic('cam')}</span></button>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px">${esc(meta.name||t('pastor'))}</b><span class="sub" style="overflow-wrap:anywhere">${esc(localMode?t('local_only'):authU?authU.email:'')}</span>${localMode?`<button class="linkbtn" data-act="toLogin">${esc(t('login_btn'))}</button>`:''}${meta.photo?`<button class="linkbtn" data-act="photoRm">${esc(t('photo_rm'))}</button>`:''}</div></div>
  <div class="pgrp">
    <div class="prow"><label class="k" for="pName">${esc(t('your_name'))}</label><input class="inp" id="pName" value="${esc(meta.name||'')}" placeholder="${esc(t('pastor'))}" style="max-width:220px;height:42px" data-input="pName"></div>
    <div class="prow"><span class="k">${esc(t('language'))}</span>${seg('pUi',prefs.ui,[['es','Español'],['pt','Português']])}</div>
    <div class="prow"><span class="k">${esc(t('appearance'))}</span>${seg('pTheme',prefs.theme,[['light',t('light')],['dark',t('dark')],['auto',t('auto')]])}</div>
    <div class="prow"><span class="k">${esc(t('def_bible'))}</span>${seg('pBible',prefs.bibleVer||prefs.ui,[['es','RV 1909'],['pt','B. Livre']])}</div>
  </div>
  <div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch"><span class="k">${esc(t('categories'))}</span>
    <div class="catlist">${meta.cats.map((c,i)=>`<span class="tag">${esc(c)}<button data-act="catRm" data-i="${i}" aria-label="${esc(t('act_del'))} ${esc(c)}">${ic('x')}</button></span>`).join('')}</div>
    <form class="row" data-form="catAdd"><input class="inp" id="catNew" placeholder="${esc(t('add_cat'))}" style="height:42px"><button class="btn sm dark">${esc(t('add'))}</button></form></div></div>
  <div class="pgrp">
    <div class="prow"><span><span class="k">${esc(t('backup'))}</span><span class="s">${esc(t('last_bak',{d:lb?fmtD(todayISO(new Date(lb))):t('never')}))}</span></span><button class="btn sm ghost" data-act="bakGo">${esc(t('copy_now'))}</button></div>
    <div class="prow"><span><label class="k" for="pMail">${esc(t('tr_mail'))}</label><span class="s">${esc(t('tr_mail_d'))}</span></span><input class="inp" id="pMail" type="email" value="${esc(prefs.mmEmail||'')}" placeholder="—" style="max-width:220px;height:42px" data-input="pMail"></div>
    <div class="prow"><span><span class="k">${esc(t('autobak'))}</span><span class="s">${esc(t('autobak_d'))}</span></span><button class="btn sm ghost" data-act="autoBak">${ic('undo')}${esc(t('restore_it'))}</button></div>
    <div class="prow"><span class="k">${esc(t('restore'))}</span><button class="btn sm ghost" data-act="impOpen">${ic('clip')}${esc(t('import'))}</button></div>
    <div class="prow"><span class="sync" data-sync>${syncHtml()}</span>${localMode?`<button class="btn sm dark" data-act="toLogin">${esc(t('login_btn'))}</button>`:`<button class="btn sm ghost" data-act="logout">${ic('out')}${esc(t('logout'))}</button>`}</div>
  </div>
  <div class="pgrp">
    <div class="prow"><span><span class="k">${esc(t('lock'))}</span><span class="s">${esc(t('lock_d'))}</span></span>${seg('lockT',lockCfg()?'on':'off',[['off',t('no')],['on',t('yes')]])}</div>
    ${lockCfg()&&window.PublicKeyCredential?`<div class="prow"><span class="k">${esc(t('bio'))}</span>${seg('bioT',lockCfg().bio?'on':'off',[['off',t('no')],['on',t('yes')]])}</div>`:''}
  </div>
  ${subHtml()}
  <div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch;gap:8px"><span><span class="k">${ic('spark')} ${esc(t('ai'))}</span><span class="s">${esc(t('ai_d'))}</span></span>
    <label class="s" for="pAi">${esc(t('ai_key'))} · ${esc(t('ai_key_d'))}</label>
    <div class="row"><input class="inp" id="pAi" type="password" autocomplete="off" value="${esc(aiKey())}" placeholder="sk-ant-…" style="height:42px" data-input="pAi"><button class="btn sm dark" data-act="aiTest">${esc(t('ai_test'))}</button></div></div></div>
  ${isAdmin()?`<div class="pgrp"><button class="prow plink" data-act="admin"><span><span class="k">${ic('sliders')} ${esc(t('adm_t'))}</span><span class="s">${esc(t('adm_d'))}</span></span>${ic('next')}</button></div>`:''}
  <div class="pgrp">
    <button class="prow plink" data-act="privacy"><span><span class="k">${esc(t('priv'))}</span><span class="s">${esc(t('priv_d'))}</span></span>${ic('next')}</button>
    ${!localMode&&authU?`<button class="prow plink" data-act="delAcc"><span><span class="k" style="color:var(--danger)">${esc(t('del_acc'))}</span><span class="s">${esc(t('del_acc_d'))}</span></span>${ic('next')}</button>`:''}
  </div>
  <p class="sub" style="margin:0;text-align:center;font-size:12px">${esc(t('credits'))}</p>
  <div class="pgrp"><button class="prow plink" data-act="report"><span><span class="k">${ic('chat')} ${esc(t('rp_btn'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="onb"><span><span class="k">${ic('play')} ${esc(t('ob_btn'))}</span></span>${ic('next')}</button></div>
  ${!localMode&&authU?`<button class="btn ghost block" data-act="logout" style="color:var(--danger)">${ic('out')}${esc(t('logout'))}</button>`:''}
  <div class="foot-brand"><span class="mark sm"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
    <b><span class="w1">MEU</span> <span class="w2">PÚLPITO</span></b><small>${esc(t('tagline'))}</small>
    <a class="ig-link" href="https://instagram.com/meupulpito" target="_blank" rel="noopener">${ic('ig')}<span>@meupulpito</span></a>
    <span class="fb-v">${esc(t('ver_l'))} 1.0 · © ${new Date().getFullYear()}</span></div>`}
const PRIV={es:[['Tus sermones son tuyos','Todo lo que escribes en Meu Púlpito (sermones, agenda, biblioteca y notas) pertenece a ti. Se usa solo para que la app funcione y para que lo veas en cualquier celular donde entres con tu cuenta.'],
  ['Qué guardamos','Tu correo, tu nombre y tu foto (si los pones), tus sermones, agenda, biblioteca, notas y tus preferencias de lectura.'],
  ['Dónde se guarda','En los servidores de Google Firebase, protegidos con tu contraseña. Además queda una copia en tu celular para que funcione sin internet, y una copia de seguridad diaria solo en este celular.'],
  ['Quién puede verlo','Solo tú, con tu cuenta. Las reglas de seguridad impiden que otro usuario vea tus datos. El responsable técnico de la app tiene acceso al sistema para mantenerlo, pero se compromete a no leer tu contenido, salvo que tú lo pidas para recibir ayuda o que la ley lo exija.'],
  ['Lo que no hacemos','No vendemos tus datos, no mostramos publicidad y no usamos tus sermones para nada que no sea la app.'],
  ['Servicios externos','Traducción automática (MyMemory): solo se envía el texto que tú pides traducir. Asistente de IA (Anthropic): solo si tú pones tu propia clave, y solo el texto que tú envías; la clave queda únicamente en tu celular.'],
  ['Borrar tu cuenta','Puedes borrar tu cuenta y todos tus datos cuando quieras, en Configuración → Borrar mi cuenta. Se borran de la nube y de este celular, y no se pueden recuperar.'],
  ['Cambios','Si esta política cambia, te avisaremos en la app.']],
 pt:[['Seus sermões são seus','Tudo o que você escreve no Meu Púlpito (sermões, agenda, biblioteca e notas) pertence a você. É usado só para o app funcionar e para você ver em qualquer celular em que entrar com sua conta.'],
  ['O que guardamos','Seu e-mail, seu nome e sua foto (se você colocar), seus sermões, agenda, biblioteca, notas e suas preferências de leitura.'],
  ['Onde fica guardado','Nos servidores do Google Firebase, protegidos pela sua senha. Também fica uma cópia no seu celular para funcionar sem internet, e uma cópia de segurança diária só neste celular.'],
  ['Quem pode ver','Só você, com a sua conta. As regras de segurança impedem que outro usuário veja seus dados. O responsável técnico do app tem acesso ao sistema para mantê-lo, mas se compromete a não ler o seu conteúdo, a não ser que você peça para receber ajuda ou que a lei exija.'],
  ['O que não fazemos','Não vendemos seus dados, não mostramos propaganda e não usamos seus sermões para nada além do app.'],
  ['Serviços externos','Tradução automática (MyMemory): só é enviado o texto que você pede para traduzir. Assistente de IA (Anthropic): só se você colocar sua própria chave, e só o texto que você envia; a chave fica apenas no seu celular.'],
  ['Apagar sua conta','Você pode apagar sua conta e todos os seus dados quando quiser, em Configurações → Apagar minha conta. Eles são apagados da nuvem e deste celular, e não podem ser recuperados.'],
  ['Mudanças','Se esta política mudar, avisaremos no app.']]};
function privacySheet(){const L=prefs.ui==='pt'?'pt':'es';openSheet(`<h3>${esc(t('priv'))}</h3><p class="sub" style="margin:-6px 0 0;font-size:12.5px">${esc(t('priv_date'))}</p>${PRIV[L].map(([h,p])=>`<div class="fld"><span class="k" style="font-weight:800">${esc(h)}</span><p class="sd-p" style="margin:2px 0 0;font-family:var(--ui);font-size:15px">${esc(p)}</p></div>`).join('')}<button class="btn dark block" data-act="sheetClose">${esc(t('got_it'))}</button>`)}
async function deleteAccount(){const sh=openSheet(`<h3 style="color:var(--danger)">${esc(t('del_acc'))}</h3><p style="margin:0;line-height:1.5">${esc(t('del_warn'))}</p>
    <label class="s" for="delC">${esc(t('del_type'))}</label><input class="inp" id="delC" autocomplete="off" autocapitalize="characters">
    <p class="err" id="delErr" hidden></p><button class="btn block" id="delGo" style="background:var(--danger);color:#fff" disabled>${esc(t('del_go'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('cancel'))}</button>`);
  const word=t('del_word');const c=$('#delC',sh),go=$('#delGo',sh);c.oninput=()=>{go.disabled=c.value.trim().toUpperCase()!==word};
  go.onclick=async()=>{go.disabled=true;go.textContent=t('del_doing');const err=m=>{const e=$('#delErr',sh);e.textContent=m;e.hidden=!m};
    try{const u=firebase.auth().currentUser;if(!u||!cols)throw{code:'x'};
      for(const ref of [cols.s,cols.a,cols.n]){const q=await ref.get();for(const d of q.docs)await d.ref.delete()}
      try{await cols.m.delete()}catch(e){}
      await u.delete();
      const uid=u.uid;Object.keys(localStorage).filter(k=>k.startsWith('pulpito.')&&k.includes(uid)).forEach(k=>localStorage.removeItem(k));
      try{indexedDB.deleteDatabase('meupulpito')}catch(e){}
      unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;authU=null;sermons=[];agenda=[];notes=[];closeSheet();showLogin();toast(t('del_done'))}
    catch(e){go.disabled=false;go.textContent=t('del_go');err(t(e&&e.code==='auth/requires-recent-login'?'del_relog':'e_gen'))}}}
function importSheet(){const sh=openSheet(`<h3>${esc(t('restore'))}</h3><p class="sub" style="margin:0">${esc(t('restore_d'))}</p><textarea class="inp" id="impTa" rows="6"></textarea><button class="btn gold block" id="impGo">${esc(t('import'))}</button>`);
  $('#impGo',sh).onclick=()=>{let o;try{o=JSON.parse($('#impTa',sh).value.trim())}catch(e){toast(t('bad_paste'));return}
    const arr=Array.isArray(o)?o:o&&Array.isArray(o.sermons)?o.sermons:null;if(!arr){toast(t('bad_paste'));return}
    let n=0;arr.forEach(x=>{if(!x||!x.id)return;const i=sermons.findIndex(s=>s.id===x.id);if(i<0||(x.updated||0)>(sermons[i].updated||0)){const c=Object.assign({},x);delete c.example;delete c.compare;putSermon(c,{silent:true});n++}});
    if(o&&Array.isArray(o.notes))o.notes.forEach(x=>{if(x&&x.id&&!notes.find(a=>a.id===x.id))putNote(x,{silent:true})});
    if(o&&Array.isArray(o.agenda))o.agenda.forEach(x=>{if(x&&x.id&&!agenda.find(a=>a.id===x.id))putEvent(x)});
    if(o&&o.meta&&Array.isArray(o.meta.cats)){o.meta.cats.forEach(c=>{if(!meta.cats.includes(c))meta.cats.push(c)});(o.meta.favVerses||[]).forEach(f=>{if(!meta.favVerses.find(x=>x.ref===f.ref&&x.v===f.v))meta.favVerses.push(f)});if(!meta.name&&o.meta.name)meta.name=o.meta.name;putMeta()}
    closeSheet();toast(n?t('imported',{n}):t('nothing_new'));render()}}

/* =========================================================
   Bloqueo (código + Face ID)
   ========================================================= */
const LK='mp.lock';let locked=false,hiddenAt=0;
const b64=buf=>btoa(String.fromCharCode(...new Uint8Array(buf))),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function hashPin(pin,salt){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'|'+pin));return b64(d)}
const lockCfg=()=>ls.get(LK,null);
async function bioAvailable(){try{return !!(window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())}catch(e){return false}}
async function bioRegister(){const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
  const c=await navigator.credentials.create({publicKey:{challenge:rnd(32),rp:{name:'Meu Púlpito'},user:{id:rnd(16),name:'meu-pulpito',displayName:'Meu Púlpito'},
    pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},timeout:60000}});
  return b64(c.rawId)}
async function bioCheck(id){const c=await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:'public-key',id:unb64(id)}],userVerification:'required',timeout:60000}});return !!c}
function showLock(){const cfg=lockCfg();if(!cfg||locked)return;locked=true;const el=document.createElement('div');el.id='lock';el.className='lock';
  el.innerHTML=`<div class="brand"><img class="b-d" src="logo-name.png" alt="Meu Púlpito"><img class="b-l" src="logo-name-light.png" alt="Meu Púlpito"><div class="tagline"><i></i><span>${esc(t('tagline'))}</span><i></i></div></div><h2>${esc(t('pin_enter'))}</h2>
   <input class="inp pin" id="lkPin" type="password" inputmode="numeric" autocomplete="off" maxlength="6" aria-label="${esc(t('pin_enter'))}">
   <p class="err" id="lkErr" hidden></p>
   <button class="btn gold block" id="lkGo">${esc(t('unlock'))}</button>
   ${cfg.bio?`<button class="btn ghost block" id="lkBio">${esc(t('bio_use'))}</button>`:''}
   <button class="lnk" id="lkForgot">${esc(t('forgot_pin'))}</button>`;
  document.body.appendChild(el);document.body.style.overflow='hidden';
  const go=async()=>{const v=$('#lkPin').value;if((await hashPin(v,cfg.salt))===cfg.hash)unlock();else{const e=$('#lkErr');e.textContent=t('pin_wrong');e.hidden=false;$('#lkPin').value=''}};
  $('#lkGo').onclick=go;$('#lkPin').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  $('#lkPin').addEventListener('input',async e=>{const v=e.target.value;if(v.length>=4&&(await hashPin(v,cfg.salt))===cfg.hash)unlock()});
  const bb=$('#lkBio');if(bb)bb.onclick=async()=>{try{if(await bioCheck(cfg.bio))unlock()}catch(e){toast(t('bio_fail'))}};
  $('#lkForgot').onclick=()=>{const cloud=!localMode&&authU;const sh=openSheet(`<h3>${esc(t('forgot_pin'))}</h3><p style="margin:0;line-height:1.5">${esc(t(cloud?'forgot_pin_d':'forgot_local'))}</p>
    ${cloud?`<button class="btn gold block" id="fgOut">${esc(t('sign_out_unlock'))}</button>`:''}<button class="btn ghost block" data-act="sheetClose">${esc(t('close'))}</button>`,{host:el});
    const o=$('#fgOut',sh);if(o)o.onclick=async()=>{ls.set(LK,null);el.remove();locked=false;document.body.style.overflow='';closeSheet();await ACT.logout()}};
  setTimeout(()=>{if(!cfg.bio)$('#lkPin').focus()},200)}
function unlock(){locked=false;const el=$('#lock');if(el)el.remove();if(!PG)document.body.style.overflow=''}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')hiddenAt=Date.now();else if(hiddenAt&&Date.now()-hiddenAt>60000&&lockCfg()&&!PG)showLock()});
async function lockSetup(){const cfg=lockCfg();if(cfg){ls.set(LK,null);toast(t('lock_off'));render();return}
  let first='';const sh=openSheet(`<h3>${esc(t('lock'))}</h3>${localMode?`<p class="err" style="margin:0">${esc(t('lock_local_warn'))}</p>`:''}<p class="sub" style="margin:0" id="lsMsg">${esc(t('pin_new'))}</p>
    <input class="inp pin" id="lsPin" type="password" inputmode="numeric" maxlength="6" autocomplete="off"><p class="err" id="lsErr" hidden></p>
    <button class="btn gold block" id="lsOk">${esc(t('save'))}</button>`);
  const err=m=>{const e=$('#lsErr',sh);e.textContent=m;e.hidden=!m};
  $('#lsOk',sh).onclick=async()=>{const v=$('#lsPin',sh).value.trim();if(!/^\d{4,6}$/.test(v)){err(t('pin_short'));return}
    if(!first){first=v;$('#lsPin',sh).value='';$('#lsMsg',sh).textContent=t('pin_again');err('');return}
    if(v!==first){first='';$('#lsPin',sh).value='';$('#lsMsg',sh).textContent=t('pin_new');err(t('pin_diff'));return}
    const salt=b64(crypto.getRandomValues(new Uint8Array(16)));ls.set(LK,{hash:await hashPin(v,salt),salt,bio:null});closeSheet();toast(t('lock_on'));render()};
  setTimeout(()=>$('#lsPin',sh).focus(),100)}
async function bioToggle(){const cfg=lockCfg();if(!cfg)return;if(cfg.bio){cfg.bio=null;ls.set(LK,cfg);render();return}
  try{cfg.bio=await bioRegister();ls.set(LK,cfg);toast(t('bio_on'));render()}catch(e){toast(t('bio_fail'))}}

/* =========================================================
   Copias automáticas (IndexedDB, una por día)
   ========================================================= */
function idb(){return new Promise((ok,ko)=>{if(!window.indexedDB)return ko();const r=indexedDB.open('meupulpito',2);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('snaps'))db.createObjectStore('snaps',{keyPath:'day'});if(!db.objectStoreNames.contains('audio'))db.createObjectStore('audio',{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)})}
async function snapList(){try{const db=await idb();return await new Promise(ok=>{const q=db.transaction('snaps').objectStore('snaps').getAll();q.onsuccess=()=>ok((q.result||[]).filter(x=>x.who===(authU?authU.uid:'local')).sort((a,b)=>b.day.localeCompare(a.day)));q.onerror=()=>ok([])})}catch(e){return[]}}
async function autoSnap(){if(!ready||(!sermons.length&&!notes.length))return;try{const day=todayISO()+'|'+(authU?authU.uid:'local');const db=await idb();const st=db.transaction('snaps','readwrite').objectStore('snaps');
  st.put({day,who:authU?authU.uid:'local',at:Date.now(),data:JSON.parse(JSON.stringify({sermons,notes,agenda,meta}))});
  const all=await snapList();all.slice(7).forEach(x=>{try{db.transaction('snaps','readwrite').objectStore('snaps').delete(x.day)}catch(e){}})}catch(e){}}
async function autoBakSheet(){const L=await snapList();
  const sh=openSheet(`<h3>${esc(t('autobak'))}</h3><p class="sub" style="margin:0">${esc(t('autobak_d'))}</p>
   ${L.length?`<div class="acts">${L.map((x,i)=>`<button class="act" data-sn="${i}" style="flex-direction:column;align-items:flex-start;gap:2px;padding:10px 0"><b>${esc(new Date(x.at).toLocaleString(prefs.ui==='pt'?'pt-BR':'es'))}</b><span class="sub">${(x.data.sermons||[]).filter(s=>!s.deleted).length} ${esc(t('nav_list').toLowerCase())} · ${(x.data.notes||[]).length} ${esc(t('lib').toLowerCase())}</span></button>`).join('')}</div>`:`<p class="sub">${esc(t('autobak_none'))}</p>`}`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-sn]');if(!b)return;const x=L[+b.dataset.sn];closeSheet();
    const c=openSheet(`<h3>${esc(t('autobak_rest'))}</h3><p style="margin:0;line-height:1.5">${esc(t('autobak_rest_d'))}</p><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn gold" id="snGo">${esc(t('restore_it'))}</button></div>`);
    $('#snGo',c).onclick=()=>{let n=0;
      (x.data.sermons||[]).forEach(o=>{if(o.deleted)return;const cur=sermons.find(s=>s.id===o.id);
        if(!cur){putSermon(o,{silent:true});n++}else if(cur.deleted){delete cur.deleted;putSermon(cur,{silent:true});n++}
        else{const ids=new Set((cur.log||[]).map(l=>l.id));const add=(o.log||[]).filter(l=>!ids.has(l.id));if(add.length){cur.log=(cur.log||[]).concat(add);putSermon(cur,{silent:true});n+=add.length}}});
      (x.data.notes||[]).forEach(o=>{if(o.deleted)return;const cur=notes.find(s=>s.id===o.id);if(!cur){putNote(o,{silent:true});n++}else if(cur.deleted){delete cur.deleted;putNote(cur,{silent:true});n++}});
      (x.data.agenda||[]).forEach(o=>{if(!agenda.find(a=>a.id===o.id)){putEvent(o);n++}});
      closeSheet();toast(t('autobak_done',{n}));render()}})}

/* =========================================================
   Audio y dictado
   ========================================================= */
async function audList(owner){try{const db=await idb();return await new Promise(ok=>{const q=db.transaction('audio').objectStore('audio').getAll();q.onsuccess=()=>ok((q.result||[]).filter(a=>owner===undefined||a.owner===owner).sort((a,b)=>b.at-a.at));q.onerror=()=>ok([])})}catch(e){return[]}}
async function audPut(a){const db=await idb();return new Promise((ok,ko)=>{const tx=db.transaction('audio','readwrite');tx.objectStore('audio').put(a);tx.oncomplete=ok;tx.onerror=()=>ko(tx.error)})}
async function audDel(id){const db=await idb();db.transaction('audio','readwrite').objectStore('audio').delete(id)}
let REC=null;const urls=[];
function recSheet(owner){closeSheet();const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const sh=openSheet(`<h3>${esc(t('rec'))}</h3><p class="sub" style="margin:0">${esc(t('rec_d'))}</p>
   <div class="row" style="justify-content:center;gap:14px;padding:6px 0"><button class="btn gold" id="rcGo" style="height:64px;padding:0 26px;font-size:17px">${ic('mic')}<span id="rcL">${esc(t('rec_start'))}</span></button><b id="rcT" style="font-size:22px;font-variant-numeric:tabular-nums;min-width:70px">00:00</b></div>
   <button class="btn ghost block" id="dcGo">${ic('text')}${esc(t('dict'))}</button>
   <div id="dcBox" hidden><textarea class="inp" id="dcTx" rows="5" placeholder="${esc(t('dict_ph'))}"></textarea><p class="sub" id="dcSt" style="margin:6px 0"></p>
     <div class="two">${E?`<button class="btn dark" id="dcIns">${esc(t('dict_ins'))}</button>`:''}<button class="btn ghost" id="dcNote">${esc(t('dict_note'))}</button></div></div>
   <div id="rcList" style="display:flex;flex-direction:column;gap:8px"></div>`,{onClose:()=>{recStop(true);dictStop();urls.splice(0).forEach(u=>URL.revokeObjectURL(u))}});
  const drawList=async()=>{const L=await audList(owner);const box=$('#rcList',sh);if(!box)return;
    box.innerHTML=L.length?L.map(a=>{const u=URL.createObjectURL(a.blob);urls.push(u);return`<div style="background:var(--bg);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:6px">
      <b style="font-size:14px">${esc(a.title)} · ${fmtSec(Math.round(a.dur||0))}</b><audio controls preload="metadata" src="${u}" style="width:100%"></audio>
      <div class="row"><button class="btn sm ghost" data-rn="${a.id}">${ic('doc')}${esc(t('rec_to_note'))}</button><button class="iconbtn" data-rd="${a.id}" aria-label="${esc(t('rec_del'))}" style="color:var(--danger);margin-left:auto">${ic('trash')}</button></div></div>`}).join(''):`<p class="sub" style="margin:0">${esc(t(owner?'rec_none':'rec_none_g'))}</p>`};
  drawList();
  $('#rcGo',sh).onclick=async()=>{if(REC&&REC.mr){recStop(false);return}
    try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||'';
      const mr=new MediaRecorder(st,mime?{mimeType:mime}:undefined);const chunks=[];const t0=Date.now();
      REC={mr,st,t0,int:setInterval(()=>{const e=$('#rcT');if(e)e.textContent=fmtSec(Math.round((Date.now()-t0)/1000))},500)};
      mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
      mr.onstop=async()=>{st.getTracks().forEach(x=>x.stop());clearInterval(REC&&REC.int);const discard=REC&&REC.discard;REC=null;
        const L=$('#rcL');if(L)L.textContent=t('rec_start');if(discard||!chunks.length)return;
        const blob=new Blob(chunks,{type:mr.mimeType||mime||'audio/mp4'});const d=new Date();
        await audPut({id:uid(),owner:owner||null,blob,mime:blob.type,dur:(Date.now()-t0)/1000,at:Date.now(),title:t('rec_title',{d:`${fmtD(todayISO(d))} ${d.toTimeString().slice(0,5)}`})});toast(t('rec_saved'));drawList()};
      mr.start(1000);$('#rcL').textContent=t('rec_stop')}
    catch(e){toast(t('rec_err'))}};
  $('#dcGo',sh).onclick=()=>{if(!SR){toast(t('dict_none'));return}$('#dcBox',sh).hidden=false;if(DICT){dictStop();return}dictStart(SR,$('#dcTx',sh),$('#dcSt',sh),$('#dcGo',sh))};
  const di=$('#dcIns',sh);if(di)di.onclick=()=>{const tx=$('#dcTx',sh).value.trim();if(!tx)return;dictStop();closeSheet();insertHtmlAfterCaret(linesToHtml(tx,{}).html||`<p>${esc(tx)}</p>`);toast(t('ai_inserted'))};
  $('#dcNote',sh).onclick=()=>{const tx=$('#dcTx',sh).value.trim();if(!tx)return;dictStop();const n={id:uid(),type:'idea',title:t('voice_note'),text:tx,ref:'',created:Date.now()};putNote(n,{silent:true});closeSheet();toast(t('saved'))};
  sh.addEventListener('click',async e=>{const n=e.target.closest('[data-rn]'),d=e.target.closest('[data-rd]');
    if(n){const a=(await audList()).find(x=>x.id===n.dataset.rn);if(!a)return;const no={id:uid(),type:'idea',title:a.title,text:'',ref:'',audioId:a.id,created:Date.now()};putNote(no,{silent:true});closeSheet();listState.mode='n';if(E)closeEditor(()=>{go('list');noteSheet(no.id)});else{go('list');noteSheet(no.id)}}
    if(d){await audDel(d.dataset.rd);drawList()}})}
function recStop(discard){if(REC&&REC.mr&&REC.mr.state!=='inactive'){REC.discard=discard;try{REC.mr.stop()}catch(e){}}}
let DICT=null;
function dictStart(SR,ta,st,btn){const r=new SR();r.lang=(E?sLang(E.s):prefs.ui)==='pt'?'pt-BR':'es-PY';r.continuous=true;r.interimResults=true;let base=ta.value?ta.value+' ':'';
  r.onresult=e=>{let fin='',tmp='';for(let i=e.resultIndex;i<e.results.length;i++){const x=e.results[i];if(x.isFinal)fin+=x[0].transcript;else tmp+=x[0].transcript}if(fin){base+=fin.trim()+' '}ta.value=base+tmp};
  r.onerror=()=>{st.textContent=t('dict_none')};r.onend=()=>{if(DICT===r){DICT=null;btn.innerHTML=ic('text')+esc(t('dict'));st.textContent=''}};
  try{r.start();DICT=r;st.textContent=t('dict_on');btn.innerHTML=ic('pause')+esc(t('dict_stop'))}catch(e){toast(t('dict_none'))}}
function dictStop(){if(DICT){const r=DICT;DICT=null;try{r.stop()}catch(e){}}}

/* =========================================================
   Entrada (login)
   ========================================================= */

/* ---------- instalar el app en el celular ---------- */
let INSTP=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTP=e;$$('.inst-btn').forEach(b=>b.hidden=false)});
window.addEventListener('appinstalled',()=>{INSTP=null;$$('.inst-btn').forEach(b=>b.hidden=true);toast(t('in_ok'))});
const isStandalone=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
const isIOS=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const canShowInstall=()=>!isStandalone()&&(INSTP||isIOS()||/Android/.test(navigator.userAgent));
function instBtn(cls=''){return canShowInstall()?`<button class="btn ghost block inst-btn ${cls}" data-act="install">${ic('dl')}${esc(t('in_btn'))}</button>`:''}
async function installApp(){if(INSTP){INSTP.prompt();try{await INSTP.userChoice}catch(e){}INSTP=null;return}
  const ios=isIOS();const safari=ios&&/Safari/.test(navigator.userAgent)&&!/CriOS|FxiOS|EdgiOS|OPiOS|GSA/.test(navigator.userAgent);
  const steps=ios?[t('in_i1'),t('in_i2'),t('in_i3')]:[t('in_a1'),t('in_a2'),t('in_a3')];
  openSheet(`<div class="inst"><span class="ob-logo"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span><h3 class="ob-t">${esc(t('in_t'))}</h3>
    <p class="sub" style="margin:0;text-align:center;font-size:14.5px;line-height:1.5">${esc(t('in_d'))}</p>
    ${ios&&!safari?`<p class="pl-why" style="margin:0">${esc(t('in_saf'))}</p>`:''}
    <ol class="inst-st">${steps.map((x,i)=>`<li><span class="n">${i+1}</span><span>${x}</span></li>`).join('')}</ol>
    <button class="btn gold block" data-act="sheetClose">${esc(t('got_it'))}</button></div>`)}
Object.assign(I18N.es,{in_btn:'Instalar la aplicación',in_t:'Instale Meu Púlpito',in_d:'Queda en la pantalla de inicio como cualquier aplicación, abre más rápido y funciona sin conexión.',in_ok:'Aplicación instalada',
  in_saf:'En el iPhone, la instalación se hace desde Safari. Abra meupulpito.com/app en Safari y siga los pasos.',
  in_i1:'Toque el botón <b>Compartir</b> <svg class="i" style="width:18px;height:18px;vertical-align:-3px"><use href="#i-share"/></svg> en la barra de Safari.',in_i2:'Elija <b>«Agregar a pantalla de inicio»</b>. Si no aparece, deslice la lista hacia abajo.',in_i3:'Toque <b>Agregar</b>. Meu Púlpito aparece en su pantalla de inicio.',
  in_a1:'Toque el menú <b>⋮</b> del navegador, arriba a la derecha.',in_a2:'Elija <b>«Instalar aplicación»</b> o <b>«Agregar a pantalla principal»</b>.',in_a3:'Confirme. Meu Púlpito aparece en su pantalla de inicio.'});
Object.assign(I18N.pt,{in_btn:'Instalar o aplicativo',in_t:'Instale o Meu Púlpito',in_d:'Fica na tela de início como qualquer aplicativo, abre mais rápido e funciona sem internet.',in_ok:'Aplicativo instalado',
  in_saf:'No iPhone, a instalação é feita pelo Safari. Abra meupulpito.com/app no Safari e siga os passos.',
  in_i1:'Toque no botão <b>Compartilhar</b> <svg class="i" style="width:18px;height:18px;vertical-align:-3px"><use href="#i-share"/></svg> na barra do Safari.',in_i2:'Escolha <b>«Adicionar à Tela de Início»</b>. Se não aparecer, deslize a lista para baixo.',in_i3:'Toque em <b>Adicionar</b>. O Meu Púlpito aparece na sua tela de início.',
  in_a1:'Toque no menu <b>⋮</b> do navegador, no canto de cima.',in_a2:'Escolha <b>«Instalar aplicativo»</b> ou <b>«Adicionar à tela inicial»</b>.',in_a3:'Confirme. O Meu Púlpito aparece na sua tela de início.'});

function showLogin(mode){window.__fromLogin=true;view.tab='home';ready=false;view.overlay='login';$('#nav').hidden=true;document.documentElement.classList.remove('tabs');
  const langSeg=`<div class="seg" style="margin-top:6px">${[['es','Español'],['pt','Português']].map(([v,l])=>`<button data-lg="${v}" aria-pressed="${prefs.ui===v}">${l}</button>`).join('')}</div>`;
  const keepE=(($('#lgE')||{}).value||showLogin._e||'').trim();
  if(mode==='rec'||mode==='sent'){
    $('#app').innerHTML=`<div class="login"><div class="brand"><img class="b-d" src="logo-name.png" alt="Meu Púlpito"><img class="b-l" src="logo-name-light.png" alt="Meu Púlpito"><div class="tagline"><i></i><span>${esc(t('tagline'))}</span><i></i></div></div>
     ${mode==='rec'?`<h2>${esc(t('rec_t'))}</h2><p class="sub" style="margin:0;font-size:15px;line-height:1.5">${esc(t('rec_d'))}</p>
     <div class="fld"><label for="lgE">${esc(t('email'))}</label><input class="inp" id="lgE" type="email" autocomplete="username" inputmode="email" autocapitalize="off" value="${esc(keepE)}" placeholder="${prefs.ui==='pt'?'seu@email.com':'tu@correo.com'}"></div>
     <p class="err" id="lgErr" hidden></p>
     <button class="btn gold block" id="lgSend">${esc(t('rec_send'))}</button>`
     :`<div class="okmark">${ic('check')}</div><h2>${esc(t('rec_ok_t'))}</h2><p class="sub" style="margin:0;font-size:15px;line-height:1.55">${esc(t('rec_ok_d',{e:keepE}))}</p>
     <button class="btn ghost block" id="lgAgain">${esc(t('rec_again'))}</button>`}
     <button class="btn ${mode==='sent'?'gold':'ghost'} block" id="lgBack">${ic('back')}${esc(t('rec_back'))}</button></div>`;
    showLogin._e=keepE;
    $('#lgBack').onclick=()=>showLogin();
    if(mode==='sent'){$('#lgAgain').onclick=()=>showLogin('rec');return}
    const err=m=>{const e=$('#lgErr');e.textContent=m;e.hidden=!m};
    const send=async()=>{const em=$('#lgE').value.trim();if(!em){err(t('e_email'));return}const b=$('#lgSend');b.disabled=true;b.textContent=t('rec_sending');
      if(!await ensureFb()){err(t('acc_fail'));b.disabled=false;b.textContent=t('rec_send');return}
      try{await firebase.auth().sendPasswordResetEmail(em);showLogin._e=em;showLogin('sent')}
      catch(e){const c=e&&e.code||'';err(t(c.includes('invalid-email')?'e_email':c.includes('too-many')?'e_many':c.includes('network')?'e_net':'e_gen'));b.disabled=false;b.textContent=t('rec_send')}};
    $('#lgSend').onclick=send;$('#lgE').addEventListener('keydown',e=>{if(e.key==='Enter')send()});setTimeout(()=>{try{$('#lgE').focus()}catch(e){}},50);return}
  $('#app').innerHTML=`<div class="login"><div class="brand"><img class="b-d" src="logo-name.png" alt="Meu Púlpito"><img class="b-l" src="logo-name-light.png" alt="Meu Púlpito"><div class="tagline"><i></i><span>${esc(t('tagline'))}</span><i></i></div></div><h2>${esc(t('login_t'))}</h2><p class="sub" style="margin:0;font-size:15px;line-height:1.5">${esc(t('login_d'))}</p>
   <div class="fld"><label for="lgE">${esc(t('email'))}</label><input class="inp" id="lgE" type="email" autocomplete="username" inputmode="email" autocapitalize="off" value="${esc(keepE)}" placeholder="${prefs.ui==='pt'?'seu@email.com':'tu@correo.com'}"></div>
   <div class="fld"><label for="lgP">${esc(t('pass'))}</label><div class="pwbox"><input class="inp" id="lgP" type="password" autocomplete="current-password" placeholder="${esc(t('pass_ph'))}"><button class="iconbtn" id="lgEye" type="button" aria-label="${esc(t('show_pw'))}" aria-pressed="false"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>
   <button class="lnk" id="lgF" style="align-self:flex-end;margin-top:-6px">${esc(t('forgot'))}</button>
   <p class="err" id="lgErr" hidden></p>
   <button class="btn gold block" id="lgIn">${esc(t('enter'))}</button><button class="btn ghost block" id="lgUp">${esc(t('create'))}</button>
   ${instBtn()}${langSeg}<a class="ig-link" style="align-self:center" href="https://instagram.com/meupulpito" target="_blank" rel="noopener">${ic('ig')}<span>@meupulpito</span></a></div>`;
  const err=m=>{const e=$('#lgErr');e.textContent=m;e.hidden=!m};
  const msg=e=>{const c=e&&e.code||'';return t(c.includes('invalid-email')?'e_email':c.includes('missing-password')?'e_pass':c.includes('weak-password')?'e_weak':c.includes('email-already-in-use')?'e_used':(c.includes('invalid-credential')||c.includes('wrong-password')||c.includes('user-not-found'))?'e_cred':c.includes('too-many')?'e_many':c.includes('network')?'e_net':'e_gen')};
  const doAuth=async create=>{err('');const em=$('#lgE').value.trim(),pw=$('#lgP').value;const b=create?$('#lgUp'):$('#lgIn');const tx=b.textContent;b.disabled=true;b.textContent=t(create?'creating':'entering');
    if(!await ensureFb()){err(t('acc_fail'));b.disabled=false;b.textContent=tx;return}
    try{ls.set('pulpito.local',false);localMode=false;if(create)await firebase.auth().createUserWithEmailAndPassword(em,pw);else await firebase.auth().signInWithEmailAndPassword(em,pw)}catch(e){err(msg(e))}
    if(document.body.contains(b)){b.disabled=false;b.textContent=tx}};
  $('#lgIn').onclick=()=>doAuth(false);$('#lgUp').onclick=()=>doAuth(true);$('#lgP').addEventListener('keydown',e=>{if(e.key==='Enter')doAuth(false)});
  $('#lgEye').onclick=()=>{const p=$('#lgP'),b=$('#lgEye');const on=p.type==='password';p.type=on?'text':'password';b.setAttribute('aria-pressed',String(on))};
  $('#lgF').onclick=()=>{showLogin._e=$('#lgE').value.trim();showLogin('rec')};
  $$('[data-lg]').forEach(b=>b.onclick=()=>{showLogin._e=$('#lgE').value.trim();prefs.ui=b.dataset.lg;savePrefs();document.documentElement.lang=prefs.ui==='pt'?'pt-BR':'es';showLogin()});
  if(!fbReady())ensureFb()}

/* =========================================================
   Acciones (un solo manejador de toques)
   ========================================================= */
const ACT={
  admSite:()=>admSite(),admVis:()=>admVisits(),
  privacy:()=>privacySheet(),delAcc:()=>deleteAccount(),admin:()=>adminPanel(),
  admBlock:async b=>{if(!isAdmin())return;const uid=b.dataset.uid,blk=b.dataset.b==='1';const seg=b.closest('.adm-seg');
    try{await firebase.firestore().collection('planos').doc(uid).set({blocked:blk,ok:!blk,updated:Date.now(),by:(authU.email||'')},{merge:true});const pe=b.closest('.adm-row');if(pe){const tg=pe.querySelector('.adm-pend');if(tg)tg.remove()}
      if(seg)$$('button',seg).forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.b==='1')===blk)));toast(t(blk?'adm_blocked':'adm_active'))}
    catch(e){toast(t('adm_err'))}},
  photo:()=>pickPhoto(),photoRm:()=>{delete meta.photo;meta.photo=null;putMeta();render()},
  tab:b=>{if(b.dataset.k==='list'){listState.f='all';listState.cat=''}go(b.dataset.k)},
  list:b=>{listState.f=b.dataset.f||'all';listState.cat='';listState.q='';go('list')},
  new:()=>newSermon(),
  open:b=>openEditor(b.dataset.id),
  preach:b=>{closeSheet();openPreach(b.dataset.id)},
  fav:b=>{const s=sermons.find(x=>x.id===b.dataset.id);if(!s)return;s.fav=!s.fav;putSermon(s);closeSheet();toast(t(s.fav?'fav_add':'fav_rm'))},
  menu:b=>sermonMenu(b.dataset.id),
  dup:b=>{if(E){edSave();closeEditor(()=>duplicate(b.dataset.id))}else duplicate(b.dataset.id)},
  share:b=>shareSheet(b.dataset.id),
  trans:b=>{if(E){const id=b.dataset.id;edSave(true);closeEditor(()=>{render();translateSermon(id)})}else translateSermon(b.dataset.id)},
  cmp:b=>compareRef(b.dataset.ref,PG?$('#pg'):null,PG?PG.lang:bver()),
  hist:b=>histSheet(b.dataset.id),
  delAsk:b=>{closeSheet();const id=b.dataset.id;const sh=openSheet(`<h3>${esc(t('del_q'))}</h3><p class="serif" style="margin:0;font-size:17px">${esc(derive(sermons.find(x=>x.id===id)||{}).title||'')}</p><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn danger" id="dYes">${ic('trash')}${esc(t('to_trash'))}</button></div>`);
    $('#dYes',sh).onclick=()=>{closeSheet();if(E&&E.s.id===id){document.removeEventListener('selectionchange',tbState);E=null;view.overlay=null}delSermon(id);render();toast(t('moved_trash'))}},
  sheetClose:()=>closeSheet(),
  lf:b=>{listState.f=b.dataset.f;render()},
  lmode:b=>{listState.mode=b.dataset.m;listState.q='';render()},nt:b=>{listState.nt=b.dataset.t;render()},
  nNew:()=>noteSheet(null),nOpen:b=>noteSheet(b.dataset.id),trash:()=>trashSheet(),
  trRest:b=>{const arr=b.dataset.k==='n'?notes:sermons;const x=arr.find(y=>y.id===b.dataset.id);if(x){delete x.deleted;b.dataset.k==='n'?putNote(x):putSermon(x)}closeSheet();toast(t('restored'));trashSheet()},
  trKill:b=>{b.dataset.k==='n'?hardDelNote(b.dataset.id):hardDelSermon(b.dataset.id);closeSheet();trashSheet()},
  fixTitle:()=>{const r=splitLongTitle();if(!r)return;snap();const h1=$('#ed h1');h1.textContent=r.title;if(r.rest){const p=document.createElement('p');p.textContent=r.rest;h1.after(p)}onEdInput();snap();drawEdMeta();toast(t('long_done'))},
  aiOpen:()=>aiSheet(),recE:()=>{if(E){edSave();trackRange();recSheet(E.s.id)}},recG:()=>recSheet(null),
  aiGoKey:()=>{closeSheet();closeEditor(()=>go('profile'))},
  aiTest:async b=>{b.disabled=true;try{await aiCall('Responde solo: OK','OK',10);toast(t('ai_ok'))}catch(e){toast(aiErr(e))}b.disabled=false},
  edInfo:()=>infoSheet(),edOrg:()=>orgSheet(),edTpl:()=>tplSheet(),vers:()=>versSheet(),
  pgScr:()=>{if(!PG)return;if(!PG.asc&&!isPremium()){planGate('preg');return}PG.asc?ascStop():ascStart()},plans:()=>plansSheet(),install:()=>installApp(),instHide:()=>{ls.set('mp.instx',1);render()},planRenew:b=>planContact(b.dataset.k),pvHide:b=>{ls.set('mp.pvx.'+b.dataset.u,1);render()},back:()=>go(view.prev&&!SUBP.includes(view.prev)?view.prev:'home'),report:()=>reportSheet(),onb:()=>onboarding(),subCancel:()=>openSheet(`<h3>${esc(t('sub_cancel'))}</h3><p style="margin:0;line-height:1.5">${esc(t('sub_cancel_d'))}</p><button class="btn ghost block" data-act="sheetClose">${esc(t('got_it'))}</button>`),admPlan:b=>admPlan(b.dataset.uid,b.dataset.l),admCfg:()=>admCfg(),agMode:b=>{agMode=b.dataset.m;render()},
  lc:b=>{listState.cat=listState.cat===b.dataset.c?'':b.dataset.c;render()},
  resGo:()=>{const r=getResume();if(r)openPreach(r.id,{resume:true})},
  resNo:()=>{ls.set(RES,null);render()},
  bakGo:()=>backupNow(),
  bakNo:()=>{ls.set(BAK,Date.now()-5*864e5);render()},
  // editor
  edBack:()=>closeEditor(),undo:()=>edUndo(),redo:()=>edRedo(),edMenu:()=>edMenu(),
  edPreach:()=>{edSave();if(!sermons.find(x=>x.id===E.s.id)){toast(t('body_ph'));return}openPreach(E.s.id)},
  edFav:()=>{E.s.fav=!E.s.fav;drawEdMeta();edSave(true)},
  edCat:()=>pickCategory(c=>{E.s.category=c;delete E.s.series;drawEdMeta();edSave(true)},catOf(E.s)),
  edLang:()=>{E.s.lang=sLang(E.s)==='pt'?'es':'pt';E.s.langSet=true;drawEdMeta();$('#ed').lang=E.s.lang==='pt'?'pt-BR':'es';edSave(true);toast(t('lang_msg')+': '+(E.s.lang==='pt'?'Português':'Español'))},
  fmtB:()=>fmt('bold'),fmtI:()=>fmt('italic'),fmtU:()=>fmt('underline'),fmtOl:()=>fmt('insertOrderedList'),
  fmtImp:()=>{let b=curBlock();while(b&&b.tagName!=='H2')b=b.previousElementSibling;if(!b){toast(t('imp_need'));return}snap();b.classList.toggle('imp');onEdInput();snap();toast(t(b.classList.contains('imp')?'imp_on':'imp_off'))},
  pgIdx:()=>pgIndex(),pgLang:()=>pgLang(),
  fmtHead:()=>fmtHead(),fmtSize:()=>fmtSize(),fmtStyle:()=>fmtStyle(),fmtSet:b=>fmtSet(b.dataset.s),fmtHl:()=>fmtHl(),fmtNote:()=>fmtNote(),edPoint:()=>edPoint(),edVerse:()=>edVerse(),vIns:()=>vInsert(),
  // predicar
  pgClose:()=>closePreach(),pgTimer:()=>pgTimer(),pgSet:()=>pgSettings(),pgPrev:()=>pgGo(-1),pgNext:()=>pgGo(1),
  // biblia
  bVer:()=>{BV.ver=bver()==='es'?'pt':'es';BV.sel.clear();render()},
  bMode:b=>{BV.fav=b.dataset.f==='1';render()},
  dicE:()=>dxEditor(),
  bRetry:()=>{BV.err=false;render()},
  bSel:b=>{const v=+b.dataset.v;BV.sel.has(v)?BV.sel.delete(v):BV.sel.add(v);render()},
  bGo:b=>{BV.b=+b.dataset.b;BV.c=+b.dataset.c;BV.q='';BV.sel=new Set([+b.dataset.v]);render();setTimeout(()=>{const el=$(`.vs[data-v="${b.dataset.v}"]`);el&&el.scrollIntoView({block:'center'})},50)},
  bCopy:()=>{const x=bSelText();copyText(`${x.text}\n— ${x.ref} (${verLabel(x.v)})`).then(()=>toast(t('copied')))},
  bFav:()=>{const x=bSelText();const i=meta.favVerses.findIndex(f=>f.ref===x.ref&&f.v===x.v);if(i>=0){meta.favVerses.splice(i,1);toast(t('fav_rm'))}else{meta.favVerses.unshift(x);toast(t('fav_add'))}putMeta();BV.sel.clear();render()},
  bCmp:()=>{const x=bSelText();compareRef(x.ref,null,x.v)},
  bIns:()=>{const x=bSelText();chooseSermon(id=>{BV.sel.clear();insertVerseInto(id,x.ref,x.text)})},
  bFavOpen:b=>{const f=meta.favVerses[+b.dataset.i];if(!f)return;const sh=openSheet(`<h3>${esc(f.ref)}</h3><p class="serif" style="margin:0;font-size:17px;line-height:1.6;font-style:italic">${esc(f.text)}</p>
     <div class="acts"><button class="act" id="fvC">${ic('copy')}${esc(t('copy_txt'))}</button><button class="act" id="fvI">${ic('doc')}${esc(t('ins_s'))}</button><button class="act" id="fvK">${ic('lang')}${esc(t('cmp'))}</button><button class="act red" id="fvD">${ic('trash')}${esc(t('act_unfav'))}</button></div>`);
    $('#fvC',sh).onclick=()=>copyText(`${f.text}\n— ${f.ref} (${verLabel(f.v)})`).then(()=>{toast(t('copied'));closeSheet()});
    $('#fvI',sh).onclick=()=>{closeSheet();chooseSermon(id=>insertVerseInto(id,f.ref,f.text))};
    $('#fvK',sh).onclick=()=>{closeSheet();compareRef(f.ref,null,f.v)};
    $('#fvD',sh).onclick=()=>{meta.favVerses.splice(+b.dataset.i,1);putMeta();closeSheet();render()}},
  // agenda
  evNew:()=>evForm(null),evEdit:b=>evForm(b.dataset.id),
  evPick:b=>{const e=agenda.find(x=>x.id===b.dataset.id);chooseSermon(id=>{if(id==='__new'){newSermon();return}e.sermonId=id;putEvent(e);render()})},
  // perfil
  pUi:b=>{prefs.ui=b.dataset.v;savePrefs();document.documentElement.lang=prefs.ui==='pt'?'pt-BR':'es';render()},
  pTheme:b=>{prefs.theme=b.dataset.v;savePrefs();applyTheme();render()},
  pBible:b=>{prefs.bibleVer=b.dataset.v;BV.ver=null;savePrefs();render()},
  catRm:b=>{meta.cats.splice(+b.dataset.i,1);putMeta();render()},
  impOpen:()=>importSheet(),autoBak:()=>autoBakSheet(),
  lockT:b=>{if((b.dataset.v==='on')!==!!lockCfg())lockSetup()},
  bioT:b=>{const c=lockCfg();if(c&&(b.dataset.v==='on')!==!!c.bio)bioAvailable().then(ok=>ok?bioToggle():toast(t('bio_fail')))},
  logout:async()=>{unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;try{await firebase.auth().signOut()}catch(e){}authU=null;sermons=[];agenda=[];view.tab='home';view.prev=null;showLogin()},
  toLogin:()=>toLogin()
};
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-keep]');if(b&&E)e.preventDefault()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const f=ACT[b.dataset.act];if(f){e.preventDefault();f(b,e)}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.input;if(!k)return;
  if(k==='listQ'){listState.q=e.target.value;clearTimeout(e.target._t);e.target._t=setTimeout(render,180)}
  if(k==='bQ'){BV.q=e.target.value;const p=parseRef(BV.q);clearTimeout(e.target._t);e.target._t=setTimeout(()=>{if(p){BV.b=p.b;BV.c=Math.max(1,p.ch);BV.sel=new Set(p.vs||[]);}render()},300)}
  if(k==='pMail'){prefs.mmEmail=e.target.value.trim();savePrefs()}
  if(k==='pAi'){ls.set('mp.aikey',e.target.value.trim())}
  if(k==='pName'){meta.name=e.target.value;clearTimeout(e.target._t);e.target._t=setTimeout(putMeta,600)}});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.input==='pName'){meta.name=e.target.value.replace(/\s+/g,' ').trim();e.target.value=meta.name;putMeta()}});
document.addEventListener('submit',e=>{const f=e.target.dataset.form;if(!f)return;e.preventDefault();
  if(f==='homeSearch'){listState.q=$('#hq').value;listState.f='all';listState.cat='';go('list')}
  if(f==='bSearch'){const inp=$('#bq');inp&&inp.blur()}
  if(f==='catAdd'){const v=$('#catNew').value.trim();if(v&&!meta.cats.includes(v)){meta.cats.push(v);putMeta()}render()}});
window.addEventListener('pagehide',()=>{if(E){edSave();commitHist()}if(PG)pgSave()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&E)edSave()});

/* =========================================================
   Inicio de la app
   ========================================================= */
window.addEventListener('error',()=>setTimeout(fallback,300));
try{initStore()}catch(e){showLogin()}
setTimeout(()=>{try{purgeTrash()}catch(e){}autoSnap()},8000);
if(lockCfg())showLock();
setTimeout(fallback,5000);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
// Biblias sin internet: baja en segundo plano la de español y la de portugués (y la elegida) para que queden guardadas
function offlineBibles(){if(!('caches' in window)||!navigator.onLine)return;
  const want=[...new Set(['es','pt',vkey(prefs.bibleVer||prefs.ui)])].map(k=>new URL('biblia/'+VFILE[k]+'.json',location.href).href);
  (async()=>{for(const u of want){try{if(await caches.match(u,{ignoreVary:true}))continue;const r=await fetch(u);if(r.ok)await r.blob()}catch(e){}}})()}
if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(()=>setTimeout(offlineBibles,4000)).catch(()=>{});
window.addEventListener('online',()=>setTimeout(offlineBibles,4000));
// para pruebas
window.__mp={get notes(){return notes},get sermons(){return sermons},get agenda(){return agenda},get meta(){return meta},linesToHtml,cleanHtml,parseRef,bibleText,loadBible,derive,sermonText};
})();
