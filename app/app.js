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
search_ph:'Buscar en sus sermones',prepare:'Preparar',new_sermon:'Nuevo sermón',new_desc:'Abra la hoja y empiece a escribir. Se guarda solo.',
st_total:'Sermones',st_done:'Predicados',st_fav:'Favoritos',st_week:'Esta semana',recent:'Recientes',my_sermons:'Mis sermones',favorites:'Favoritos',see_all:'Ver todos',next_preach:'Próxima predicación',
today:'hoy',edited:'editado',edited_c:'Editado',no_prev:'Sin contenido todavía',f_all:'Todos',f_recent:'Recientes',f_fav:'Favoritos',f_done:'Predicados',f_todo:'Pendientes',
category:'Categoría',no_cat:'Sin categoría',points:'puntos',point:'punto',preached:'Predicado',pending:'Sin predicar',
act_edit:'Editar',act_preach:'Predicar',act_fav:'Marcar como favorito',act_unfav:'Quitar de favoritos',act_dup:'Duplicar',act_share:'Compartir',act_del:'Eliminar',act_hist:'Predicaciones registradas',
del_q:'¿Eliminar este sermón para siempre?',cancel:'Cancelar',deleted:'Sermón eliminado',duplicated:'Copia creada. Está editando la copia.',copy_sfx:'(copia)',
empty_t:'Su biblioteca está vacía',empty_d:'Toque Nuevo sermón y escriba su primer mensaje. Todo se guarda solo.',no_res:'Ningún sermón encontrado',res_1:'1 sermón encontrado',res_n:'{n} sermones encontrados',
saved:'Guardado',saving:'Guardando…',untitled:'Sin título',title_ph:'Título del sermón',body_ph:'Empiece a escribir…',
undo:'Deshacer',redo:'Rehacer',preach:'Predicar',tb_size:'Tamaño del texto',tb_style:'Estilo del texto',sy_point:'Punto',sy_sub:'Subtítulo',sy_text:'Texto',sy_big:'Grande',tb_title:'Título o subtítulo',tb_bold:'Negrita',tb_italic:'Cursiva',tb_under:'Subrayado',tb_list:'Lista numerada',tb_hl:'Destacar frase',tb_note:'Recordatorio personal',tb_verse:'Versículo',tb_point:'Nuevo punto',
sel_first:'Seleccione primero el texto que quiere destacar',
ref_ph:'Ej.: Juan 3:16',insert:'Insertar',verse_nf:'No encontré ese versículo. Revise la cita.',verse_t:'Insertar versículo',verse_hint:'Escriba la cita y aparece el texto (Reina-Valera 1909).',verse_hint_pt:'Escriba la cita y aparece el texto (Bíblia Livre).',
lang_msg:'Idioma del mensaje',more:'Más opciones',
register:'Registrar predicación',place:'Lugar',sede:'Sede',anexo:'Anexo',other:'Otro lugar',place_name:'Nombre del lugar',date:'Fecha',time:'Hora',minutes:'Minutos',notes:'Notas',notes_ph:'Qué funcionó, qué cambiar, cómo respondió la iglesia…',save:'Guardar',registered:'Predicación registrada',
ask_reg:'Predicaste {m} min. ¿Registrar esta predicación?',later:'Después',no_hist:'Todavía no registraste predicaciones de este sermón.',
p_point:'Punto {i} de {n}',p_prev:'Anterior',p_next:'Siguiente punto',p_next2:'Siguiente',p_last:'Es la última parte',p_set:'Ajustes de lectura',p_size:'Tamaño de letra',p_lh:'Espacio entre líneas',p_bg:'Fondo',bg_negro:'Negro',bg_azul:'Azul marino',bg_claro:'Claro',
p_timer:'Cronómetro',show:'Mostrar',hide:'Ocultar',p_goal:'Tiempo del mensaje',free:'Libre',p_outline:'Mostrar',p_full_txt:'Todo el texto',p_only:'Solo puntos',p_tap:'Tocar los lados para cambiar de parte',yes:'Sí',no:'No',p_reset:'Reiniciar cronómetro',p_fs:'Pantalla completa',p_calm:'Ocultar barras',
five:'Faltan 5 minutos',done_t:'Tiempo cumplido',cont:'Continuando donde lo dejaste',tip_tap:'Toque la derecha de la pantalla para la próxima parte',start:'Inicio',note:'Recordatorio',ilu:'Ilustración',base:'Texto base',intro:'Introducción',dev:'Desarrollo',concl:'Conclusión',close:'Cerrar',exit:'Salir',
cont_preach:'Continuar predicando',end:'Terminar',go_on:'Continuar',
bak_t:'Guarde una copia de sus sermones.',bak_d:'Hace más de una semana desde la última.',copy_now:'Copiar ahora',bak_done:'Copia copiada. Péguela en un chat suyo de WhatsApp o en Notas.',
b_search:'Buscar libro, cita o palabra',chap:'Cap.',vers:'Vers.',copied:'Copiado',fav_add:'Guardado en favoritos',fav_rm:'Quitado de favoritos',ins_s:'Insertar en sermón',choose_s:'¿En qué sermón?',inserted:'Versículo insertado',
b_res:'{n} resultados',b_none:'Sin resultados',b_loading:'Abriendo la Biblia…',b_err:'No pude abrir la Biblia. Revise la conexión e intente de nuevo.',b_nofav:'Aún no guardó versículos. Toque un versículo y la estrella.',b_favs_s:'Favoritos',b_favs:'Versículos favoritos',
schedule:'Programar',upcoming:'Próximas predicaciones',past:'Anteriores',no_ev:'Nada programado. Toque Programar para agregar una predicación.',ev_new:'Nueva predicación',ev_edit:'Editar predicación',
cult:'Tipo de culto',theme:'Tema del mensaje',sermon:'Sermón',later_pick:'Elegir después',pick_s:'Elegir sermón',tbd:'tema por definir',ev_saved:'Predicación programada',ev_del:'Predicación eliminada',
your_name:'Su nombre',language:'Idioma de la app',appearance:'Apariencia',light:'Claro',dark:'Oscuro',auto:'Auto',def_bible:'Biblia',categories:'Categorías',add_cat:'Nueva categoría',add:'Agregar',
backup:'Copia de seguridad',last_bak:'Última: {d}',never:'nunca',restore:'Restaurar o traer sermones',restore_d:'Pega aquí una copia de seguridad o el texto copiado en «Levar para o app próprio».',import:'Importar',imported:'{n} sermón(es) importado(s)',nothing_new:'Nada nuevo para importar',bad_paste:'No reconocí el texto pegado. Cópialo de nuevo.',
account:'Cuenta',got_it:'Entendido',adm_t:'Panel del administrador',adm_d:'Cuántos se registraron y controlar el acceso',adm_load:'Cargando…',adm_err:'No se pudo cargar. Revise su internet.',adm_users:'Registrados',adm_act7:'Activos (7 días)',adm_serms:'Sermones',adm_uses:'Más usado',adm_u_pregar:'Modo Predicar',adm_u_dic:'Diccionario',adm_u_ia:'Asistente IA',adm_n_serm:'{n} sermones',adm_seen:'visto {d}',adm_on:'Activo',adm_off:'Bloqueado',adm_active:'Acceso activado',adm_blocked:'Acceso bloqueado',adm_none:'Todavía nadie se registró.',adm_note:'Solo ves números (sermones, fechas, uso). El contenido de los sermones queda cerrado por las reglas de seguridad: ni tú lo ves desde la app.',blk_t:'Acceso en pausa',blk_d:'Su acceso a Meu Púlpito está pausado por ahora. Hable con quien le dio el acceso para activarlo de nuevo. Sus sermones están guardados y no se borran.',priv:'Privacidad',priv_d:'Cómo cuidamos sus sermones y sus datos',priv_date:'Política de privacidad · noviembre de 2026',del_acc:'Borrar mi cuenta',del_acc_d:'Borre su cuenta y todos sus sermones para siempre',del_warn:'Se borrarán su cuenta, sus sermones, agenda, biblioteca y notas, en la nube y en este celular. No se puede deshacer. Si quiere guardar algo, haga antes una copia en Configuración → Copia de seguridad.',del_type:'Para confirmar, escriba BORRAR',del_word:'BORRAR',del_go:'Borrar todo para siempre',del_doing:'Borrando…',del_done:'Su cuenta fue borrada',del_relog:'Por seguridad, cierre la sesión, vuelva a entrar y repita este paso.',rec_t:'Recuperar contraseña',rec_d:'Escriba el correo de su cuenta. Le enviaremos un enlace para crear una contraseña nueva.',rec_send:'Enviar enlace',rec_sending:'Enviando…',rec_ok_t:'Revise su correo',rec_ok_d:'Enviamos el enlace a {e}. Ábralo, cree su contraseña nueva y vuelva aquí para entrar. Si no aparece, mire en Spam o Promociones.',rec_back:'Volver a entrar',rec_again:'Enviar de nuevo',retry:'Intentar de nuevo',show_pw:'Mostrar contraseña',acc_conn:'Conectando con su cuenta…',acc_fail:'No se pudo conectar con el sistema de cuentas. Revise su internet o abra el app desde el ícono de la pantalla de inicio.',local_only:'Sin cuenta: los sermones quedan solo en este celular.',logout:'Cerrar sesión',login_btn:'Entrar con una cuenta',soon:'Próximamente',s_rec:'Grabar audio',s_tr:'Audio a texto',s_trl:'Traducir ES ↔ PT',s_ai:'Asistente para sermones',
src_t:'Fuentes y licencias',credits:'Biblias: Reina-Valera 1909 y 1865 (dominio público), Bíblia Livre y Bíblia Livre TR (licencia libre), Nova Versão de Acesso Livre, Bíblia Portuguesa Mundial, y Biblia Libre para el Mundo (dominio público); Palabra de Dios para ti (Asociación Bíblica Latinoamericana, CC BY 4.0), Biblia en Español Sencillo (AudioBiblia.org / Irma Flores, CC BY 4.0), Versión Biblia Libre (J. Gallagher y S. Barrios de Ávila, CC BY-SA 4.0), vía eBible.org, Textus Receptus griego y Códice de Leningrado hebreo (dominio público). Diccionarios: hebreo y griego de STEPBible.org, Tyndale House (CC BY 4.0); Strong (dominio público; datos de Open Scriptures, CC BY-SA); Easton (1897), Smith (1863) y Hitchcock (1869), dominio público (datos NEUU, CC BY 4.0). Referencias cruzadas: OpenBible.info (CC BY). Traducción automática: MyMemory. Formas de las palabras: Lemmatization Lists de Michal Měchura (Open Database License).',b_read:'Biblia',
cmp:'Comparar versiones',dic_preg:'Diccionario del predicador',dic_eas:'Más en el Diccionario Bíblico de Easton · traducción automática',dic_o:'En el original',dic_vs:'Versículos',dic_bib:'Bíblico',dic_refs:'Pasajes',dic_rest:'Traducir el resto',dic_nref:'{n} pasajes',dic_hint_b:'Busque una palabra para su predicación (Dios, gracia, fe, amor, salvación…) o personas y lugares (Moisés, Betel…). Verá el significado y la palabra en hebreo y griego.',dic_src_b:'Diccionario del predicador: escrito para Meu Púlpito. Diccionario Bíblico de Easton (1897, dominio público) · datos NEUU (CC BY 4.0), con traducción automática.',lx_wait:'Traduciendo…',lx_auto_b:'Traducción automática. Queda guardada en este celular.',lx_en:'Ver el original en inglés',lx_auto:'Traducción automática del diccionario Strong. Queda guardada en este celular.',lx_off:'Sin internet: se muestra el original en inglés. Con internet aparece traducido.',lx:'Diccionario',lx_ph:'Palabra, griego, hebreo o número (G26, H430)',dict_gr:'Griego',dict_he:'Hebreo',dict_all:'Todo',dict_hint:'Busque una palabra (amor, gracia, fe), una palabra en griego o hebreo, o un número Strong. En «Comparar versiones», toque una palabra en griego o hebreo para ver su significado.',dict_load:'Abriendo el diccionario…',dict_err:'No pude abrir el diccionario. Revise su internet e intente de nuevo.',dict_def:'Definición',dict_kjv:'Traducida en la Biblia como',dict_orig:'Origen',dict_ctx:'En este versículo',dict_en:'Definición original en inglés (Strong, 1890).',dict_tr:'Traducir',dict_trd:'Traducción automática',dict_tr_err:'No se pudo traducir ahora',dict_more:'Buscando también en inglés…',dict_nf:'Esa palabra no está en el diccionario',dict_tap:'Toque una palabra para ver su significado',dict_src:'Diccionario Strong (1890–1894, dominio público) · Open Scriptures (CC BY-SA) · STEPBible.org (CC BY)',cmp_t:'Versiones',orig:'En el original',orig_g:'Griego',orig_h:'Hebreo',translit:'pronunciación aproximada',cmp_load:'Abriendo las versiones…',cmp_none:'Este versículo no está en esta versión.',cmp_tip:'Toque la cita para comparar versiones',
tr_to:'Traducir al {l}',pgl_t:'Idioma del sermón',pl_d:'Lea el mismo sermón en el otro idioma sin crear una copia. La traducción queda guardada en el sermón y funciona sin conexión. El original no cambia.',pl_orig:'original',pl_new:'traducir',pl_changed:'Usted editó el sermón después de traducirlo: se traducirá de nuevo.',pl_mm:'La traducción es automática: revísela antes de predicar. Los versículos se toman de la Biblia del otro idioma.',pl_ok:'Sermón en español',pgl_see:'Predicar en {l}',tr_t:'Traducir sermón',tr_d:'Se crea una copia traducida; el original no cambia. Los versículos se colocan desde la Biblia del otro idioma. El resto del texto se envía al servicio gratuito MyMemory para traducir.',tr_lim:'Este sermón tiene {n} caracteres. Límite gratuito: unos 5.000 por día, o 50.000 si pone su correo en Configuración.',tr_go:'Traducir',tr_prog:'Traduciendo… {i} de {n}',tr_done:'Traducción creada. Revísela antes de predicar.',tr_quota:'Se alcanzó el límite de traducciones de hoy. Intente de nuevo mañana.',tr_err:'No pude traducir ahora. Revise la conexión e intente de nuevo.',tr_mail:'Correo para traducción',tr_mail_d:'Opcional. Se envía a MyMemory solo para aumentar el límite diario.',
sync_ok:'Guardado en su cuenta',sync_local:'Guardado en este celular',sync_conn:'Conectando…',sync_off:'Sin señal: usando la copia del celular',sync_pend:'Guardando… se envía cuando haya señal',sync_err:'No pude leer su cuenta ahora. Queda guardado en el celular.',sync_noperm:'Su cuenta todavía no puede guardar en la nube. Queda en este celular.',
login_t:'Entre para guardar sus sermones',login_d:'Sus sermones quedan en su cuenta y aparecen en cualquier celular donde entre.',email:'Correo',pass:'Contraseña',pass_ph:'Mínimo 6 caracteres',enter:'Entrar',create:'Crear cuenta',forgot:'¿Olvidó su contraseña?',nologin:'Usar sin cuenta',reset_sent:'Le enviamos un correo para crear una contraseña nueva',
e_email:'Correo inválido. Revise si lo escribió bien.',e_pass:'Escriba la contraseña.',e_weak:'La contraseña necesita al menos 6 caracteres.',e_used:'Este correo ya tiene cuenta. Toque Entrar.',e_cred:'Correo o contraseña no coinciden. Intente de nuevo o toque «¿Olvidó su contraseña?».',e_many:'Muchos intentos. Espera unos minutos.',e_net:'Sin internet. Conéctate para entrar la primera vez.',e_gen:'No pude entrar ahora. Intente de nuevo.',e_reset:'Escriba su correo arriba y toque otra vez «¿Olvidó su contraseña?».',
entering:'Entrando…',creating:'Creando…',
share:'Compartir',full:'Completo',only_points:'Solo puntos',wa:'WhatsApp',copy_txt:'Copiar texto',pdf:'PDF o imprimir',other_apps:'Otras apps',txt_copied:'Texto copiado',pdf_tip:'En la pantalla de impresión, toque Compartir para guardar como PDF.',
wc:'{w} palabras · ~{m} min',models:'Modelos',model_t:'Empezar con un modelo',model_d:'Reemplaza el contenido de la hoja (el título se mantiene). Puede deshacer.',details:'Detalles',details_t:'Detalles del sermón',organize:'Organizar',org_t:'Organizar el sermón',org_pts:'Puntos',org_par:'Párrafos',org_hint:'Use las flechas para mover. Puede deshacer.',org_start:'Inicio del sermón',up:'Subir',down:'Bajar',
versions:'Versiones anteriores',ver_none:'Todavía no hay versiones guardadas. Se guarda una cada vez que edita y sale del sermón.',ver_restore:'Restaurar esta versión',ver_restored:'Versión restaurada',words:'palabras',
trash:'Papelera',trash_n:'Papelera ({n})',trash_empty:'La papelera está vacía.',trash_d:'Lo que eliminas queda aquí 30 días antes de borrarse.',restore_it:'Restaurar',del_forever:'Eliminar para siempre',moved_trash:'Movido a la papelera',restored:'Restaurado',to_trash:'Mover a la papelera',
i_goal:'Objetivo de la predicación',i_aud:'Público',i_dur:'Duración estimada (min)',i_text:'Texto bíblico principal',i_keys:'Palabras clave',i_prep:'Fecha de preparación',i_pred:'Fecha de predicación',i_place:'Iglesia o lugar',optional:'Todos los campos son opcionales.',
lib:'Biblioteca',n_new:'Nueva anotación',n_title:'Título',n_text:'Escriba aquí…',n_ref:'Referencia bíblica (opcional)',n_to_s:'Convertir en sermón',n_empty:'Guarde estudios, frases, ilustraciones e ideas para sus próximos sermones.',n_conv:'Sermón creado a partir de la anotación',all:'Todas',n_type:'Tipo',
nt_estudio:'Estudio bíblico',nt_frase:'Frase',nt_reflexion:'Reflexión',nt_ilustracion:'Ilustración',nt_nota:'Anotación',nt_idea:'Idea para sermón',nt_ref:'Referencia',
hist_all:'Historial',hist_n:'{n} predicaciones registradas',hist_none:'Aquí aparecen las predicaciones que registras al salir del Modo Pregar o desde el menú del sermón.',next_tab:'Próximas',
p_scroll:'Desplazamiento automático',p_speed:'Velocidad',p_font:'Tipo de letra',f_serif:'Clásica',f_sans:'Moderna',f_wide:'Muy legible',p_color:'Color del texto',c_auto:'Auto',p_align:'Alineación',a_left:'Izquierda',a_just:'Justificado',a_center:'Centro',p_margin:'Márgenes',p_pspace:'Espacio entre párrafos',p_dim:'Brillo',bg_sepia:'Sepia',scroll_pause:'Desplazamiento en pausa',scroll_end:'Fin del mensaje',g_read:'Lectura',g_screen:'Pantalla',g_nav:'Predicación',
tp_exp:'Expositivo',tp_tem:'Temático',tp_cena:'Santa Cena',tp_evan:'Evangelístico',tp_est:'Estudio bíblico',
bp_t:'Biblia',bp_ins:'Insertar',bp_ins_n:'Insertar ({n})',bp_pick:'Toque los versículos que quiere insertar',
pdf_print:'PDF para imprimir',pdf_study:'PDF para estudiar',pdf_preach:'PDF para predicar',pdf_points:'PDF solo puntos',pdf_print_d:'Limpio y completo.',pdf_study_d:'Con detalles, recordatorios y espacio para notas.',pdf_preach_d:'Letra grande y puntos destacados.',pdf_points_d:'Una hoja con el esquema.',notes_area:'Notas',
security:'Seguridad',lock:'Bloquear con código',lock_d:'Pide el código al abrir la app.',lock_on:'Bloqueo activado',lock_off:'Bloqueo desactivado',pin_new:'Cree un código de 4 a 6 números',pin_again:'Repita el código',pin_diff:'Los códigos no coinciden. Intente de nuevo.',pin_short:'Use de 4 a 6 números.',pin_enter:'Escriba su código',pin_wrong:'Código incorrecto',unlock:'Desbloquear',bio:'Usar Face ID o huella',bio_use:'Desbloquear con Face ID o huella',bio_on:'Face ID o huella activado',bio_fail:'No se pudo usar Face ID o huella. Use el código.',forgot_pin:'Olvidé el código',forgot_pin_d:'Para quitar el bloqueo, salga de su cuenta y entre de nuevo con su correo y contraseña. Sus sermones siguen guardados en su cuenta.',forgot_local:'Sin cuenta no es posible quitar el bloqueo sin el código. Por eso, en modo sin cuenta le recomendamos no activarlo.',sign_out_unlock:'Salir y entrar de nuevo',lock_local_warn:'Está sin cuenta: si olvida el código no podrá recuperarlo.',
autobak:'Copias automáticas',autobak_d:'Una por día en este celular, últimos 7 días.',autobak_none:'Todavía no hay copias automáticas. La primera se hace hoy.',autobak_rest:'Recuperar de esta copia',autobak_rest_d:'Agrega los sermones, anotaciones y predicaciones que falten o estén en la papelera. No borra nada.',autobak_done:'{n} elementos recuperados',
ai:'Meu Púlpito IA',ai_d:'Asistente para preparar el sermón. No sustituye su estudio bíblico personal.',ai_key:'Clave de la IA',ai_key_d:'Se guarda solo en este celular. Créela en console.anthropic.com.',ai_test:'Probar',ai_ok:'La IA está lista',ai_nokey:'Para usar la IA, ponga su clave en Configuración → Meu Púlpito IA.',ai_err_key:'La clave no es válida. Revísela en Configuración.',ai_err_rate:'Demasiadas solicitudes. Espera un minuto.',ai_err_busy:'La IA está ocupada. Intente en unos segundos.',ai_err_credit:'Su cuenta de la IA no tiene saldo. Agregue créditos en console.anthropic.com.',ai_err:'No pude usar la IA ahora. Revise la conexión.',
ai_thinking:'Pensando…',ai_intro:'Crear introducción',ai_point:'Desarrollar el punto actual',ai_concl:'Mejorar la conclusión',ai_apps:'Aplicaciones prácticas',ai_ctx:'Contexto bíblico',ai_refs:'Referencias relacionadas',ai_gram:'Corregir gramática',ai_trans:'Traducir el sermón',ai_ask:'Pregunta libre',ai_ask_ph:'Ej.: ¿qué significa «propuso en su corazón»?',ai_send:'Enviar',ai_insert:'Insertar en el sermón',ai_replace:'Reemplazar el texto',ai_again:'Otra respuesta',ai_dropped:'{n} cita(s) no encontradas en la Biblia fueron quitadas.',ai_unver:'(cita no verificada)',ai_inserted:'Agregado al sermón',ai_replaced:'Texto corregido',ai_need_sel:'Coloque el cursor en el párrafo o seleccione el texto que quiere corregir.',ai_tr_ai:'Se usa la IA para traducir (mejor calidad).',
rec:'Audio y dictado',aud_d:'Los audios quedan guardados en este celular.',rc_tr:'Transcribir mientras grabo',rc_tr_d:'El texto se guarda junto con el audio y puede convertirse en un sermón. Funciona en el idioma del app y necesita internet.',rc_tr_prem:'Premium',rc_txt:'Texto de la grabación',rc_serm:'Crear sermón con este texto',rc_tr_none:'La transcripción no está disponible en este aparato; el audio se guarda igual.',rc_tr_on:'Transcribiendo…',rec_start:'Grabar',rec_stop:'Detener',rec_saved:'Audio guardado',rec_none:'Todavía no hay audios en este sermón.',rec_none_g:'Todavía no hay notas de voz.',rec_err:'No pude usar el micrófono. Revise el permiso en Ajustes → Safari → Micrófono.',rec_to_note:'Convertir en anotación',rec_del:'Eliminar audio',rec_title:'Nota de voz {d}',voice_note:'Nota de voz',
dict:'Dictar (voz a texto)',dict_on:'Escuchando… hable con calma',dict_stop:'Terminar dictado',dict_none:'El dictado no está disponible aquí. Use el micrófono del teclado del iPhone: es igual de rápido.',dict_ins:'Insertar en el sermón',dict_note:'Guardar como anotación',dict_ph:'El texto aparece aquí…',voice_notes:'Notas de voz',
long_t:'El título quedó muy largo. ¿Usar «{t}» como título y pasar el resto al texto?',long_fix:'Arreglar título',long_done:'Título arreglado. El resto quedó debajo; puede moverlo con Organizar.',
night:'Lectura nocturna',night_d:'Fondo negro, letras blancas y brillo más bajo.',clean:'Interfaz limpia',clean_d:'Esconde los botones. Toque el centro de la pantalla para verlos.',tip_clean:'Toque el centro de la pantalla para ver los controles',index:'Índice',imp:'Punto importante',imp_on:'Marcado como importante',imp_off:'Ya no es importante',imp_need:'Coloque el cursor en un punto (título) para marcarlo',from_start:'Desde el inicio',pinch:'Junta o separa dos dedos para cambiar el tamaño de la letra',photo:'Cambiar foto',crop_t:'Ajuste su foto',crop_d:'Mueve la foto con el dedo y acerca con dos dedos o con la barra. Queda lo que está dentro del círculo.',use_photo:'Usar foto',photo_add:'Agregar foto',photo_rm:'Quitar foto',photo_ok:'Foto actualizada',photo_err:'No se pudo usar esa imagen',
cats:['Santa Cena','Culto de Enseñanza','Culto de la Familia','Jóvenes','Liderazgo','Evangelismo','Consagración','Mensajes especiales'],
wd:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],months:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
books:['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis']},
pt:{ver_l:'Versão',tagline:'PREPARE. ORGANIZE. PREGUE.',nav_home:'Início',nav_list:'Sermões',nav_bible:'Bíblia',nav_agenda:'Agenda',nav_profile:'Configurações',nav_dic:'Dicionários',
greet_m:'Bom dia,',greet_a:'Boa tarde,',greet_n:'Boa noite,',pastor:'Pastor',
search_ph:'Buscar nos seus sermões',prepare:'Preparar',new_sermon:'Novo sermão',new_desc:'Abra a folha e comece a escrever. Salva sozinho.',
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
src_t:'Fontes e licenças',credits:'Bíblias: Reina-Valera 1909 e 1865 (domínio público), Bíblia Livre e Bíblia Livre TR (licença livre), Nova Versão de Acesso Livre, Bíblia Portuguesa Mundial, e Biblia Libre para el Mundo (domínio público); Palabra de Dios para ti (Asociación Bíblica Latinoamericana, CC BY 4.0), Biblia en Español Sencillo (AudioBiblia.org / Irma Flores, CC BY 4.0), Versión Biblia Libre (J. Gallagher e S. Barrios de Ávila, CC BY-SA 4.0), via eBible.org, Textus Receptus grego e Códice de Leningrado hebraico (domínio público). Dicionários: hebraico e grego de STEPBible.org, Tyndale House (CC BY 4.0); Strong (domínio público; dados de Open Scriptures, CC BY-SA); Easton (1897), Smith (1863) e Hitchcock (1869), domínio público (dados NEUU, CC BY 4.0). Referências cruzadas: OpenBible.info (CC BY). Tradução automática: MyMemory. Formas das palavras: Lemmatization Lists de Michal Měchura (Open Database License).',b_read:'Bíblia',
cmp:'Comparar versões',dic_preg:'Dicionário do pregador',dic_eas:'Mais no Dicionário Bíblico de Easton · tradução automática',dic_o:'No original',dic_vs:'Versículos',dic_bib:'Bíblico',dic_refs:'Passagens',dic_rest:'Traduzir o resto',dic_nref:'{n} passagens',dic_hint_b:'Busque uma palavra para a sua pregação (Deus, graça, fé, amor, salvação…) ou pessoas e lugares (Moisés, Betel…). Você verá o significado e a palavra em hebraico e grego.',dic_src_b:'Dicionário do pregador: escrito para o Meu Púlpito. Dicionário Bíblico de Easton (1897, domínio público) · dados NEUU (CC BY 4.0), com tradução automática.',lx_wait:'Traduzindo…',lx_auto_b:'Tradução automática. Fica guardada neste celular.',lx_en:'Ver o original em inglês',lx_auto:'Tradução automática do dicionário Strong. Fica guardada neste celular.',lx_off:'Sem internet: aparece o original em inglês. Com internet aparece traduzido.',lx:'Dicionário',lx_ph:'Palavra, grego, hebraico ou número (G26, H430)',dict_gr:'Grego',dict_he:'Hebraico',dict_all:'Tudo',dict_hint:'Busque uma palavra (amor, graça, fé), uma palavra em grego ou hebraico, ou um número Strong. Em «Comparar versões», toque numa palavra em grego ou hebraico para ver o significado.',dict_load:'Abrindo o dicionário…',dict_err:'Não consegui abrir o dicionário. Verifique a internet e tente de novo.',dict_def:'Definição',dict_kjv:'Traduzida na Bíblia como',dict_orig:'Origem',dict_ctx:'Neste versículo',dict_en:'Definição original em inglês (Strong, 1890).',dict_tr:'Traduzir',dict_trd:'Tradução automática',dict_tr_err:'Não foi possível traduzir agora',dict_more:'Buscando também em inglês…',dict_nf:'Essa palavra não está no dicionário',dict_tap:'Toque numa palavra para ver o significado',dict_src:'Dicionário Strong (1890–1894, domínio público) · Open Scriptures (CC BY-SA) · STEPBible.org (CC BY)',cmp_t:'Versões',orig:'No original',orig_g:'Grego',orig_h:'Hebraico',translit:'pronúncia aproximada',cmp_load:'Abrindo as versões…',cmp_none:'Este versículo não está nesta versão.',cmp_tip:'Toque na referência para comparar versões',
tr_to:'Traduzir para {l}',pgl_t:'Idioma do sermão',pl_d:'Leia o mesmo sermão no outro idioma sem criar uma cópia. A tradução fica guardada no sermão e funciona sem internet. O original não muda.',pl_orig:'original',pl_new:'traduzir',pl_changed:'Você editou o sermão depois de traduzir: ele será traduzido de novo.',pl_mm:'A tradução é automática: revise antes de pregar. Os versículos vêm da Bíblia do outro idioma.',pl_ok:'Sermão em português',pgl_see:'Pregar em {l}',tr_t:'Traduzir sermão',tr_d:'É criada uma cópia traduzida; o original não muda. Os versículos vêm da Bíblia do outro idioma. O resto do texto é enviado ao serviço grátis MyMemory para traduzir.',tr_lim:'Este sermão tem {n} caracteres. Limite grátis: uns 5.000 por dia, ou 50.000 se você colocar seu e-mail em Configurações.',tr_go:'Traduzir',tr_prog:'Traduzindo… {i} de {n}',tr_done:'Tradução criada. Revise antes de pregar.',tr_quota:'O limite de traduções de hoje acabou. Tente de novo amanhã.',tr_err:'Não consegui traduzir agora. Confira a conexão e tente de novo.',tr_mail:'E-mail para tradução',tr_mail_d:'Opcional. É enviado ao MyMemory só para aumentar o limite diário.',
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
rec:'Áudio e ditado',aud_d:'Os áudios ficam guardados neste celular.',rc_tr:'Transcrever enquanto gravo',rc_tr_d:'O texto fica guardado junto com o áudio e pode virar um sermão. Funciona no idioma do app e precisa de internet.',rc_tr_prem:'Premium',rc_txt:'Texto da gravação',rc_serm:'Criar sermão com este texto',rc_tr_none:'A transcrição não está disponível neste aparelho; o áudio é salvo mesmo assim.',rc_tr_on:'Transcrevendo…',rec_start:'Gravar',rec_stop:'Parar',rec_saved:'Áudio guardado',rec_none:'Ainda não há áudios neste sermão.',rec_none_g:'Ainda não há notas de voz.',rec_err:'Não consegui usar o microfone. Confira a permissão em Ajustes → Safari → Microfone.',rec_to_note:'Transformar em anotação',rec_del:'Excluir áudio',rec_title:'Nota de voz {d}',voice_note:'Nota de voz',
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
const VFILE={es:'es-rv1909',pt:'pt-livre',es65:'es-rv1865',ptr:'pt-livretr',nva:'pt-nva',bpm:'pt-bpm',bes:'es-bes',pdt:'es-pdt',vbl:'es-vbl',blm:'es-blm',grc:'grc-tr',hbo:'hbo-wlc'};
const VNAME={es:'Reina-Valera 1909',pt:'Bíblia Livre',es65:'Reina-Valera 1865',ptr:'Bíblia Livre TR',nva:'Nova Versão de Acesso Livre',bpm:'Bíblia Portuguesa Mundial',bes:'Biblia en Español Sencillo',pdt:'Palabra de Dios para ti',vbl:'Versión Biblia Libre',blm:'Biblia Libre para el Mundo',grc:'Textus Receptus',hbo:'Códice de Leningrado'};
// Versiones para leer: agrupadas por idioma. Gratis: la principal de cada idioma (RV 1909 y Bíblia Livre); las demás, Premium.
const VGROUPS=[['pt',['pt','ptr','nva','bpm']],['es',['es','es65','pdt','bes','vbl','blm']]];
const VLANG={};VGROUPS.forEach(([g,ks])=>ks.forEach(k=>VLANG[k]=g));
const FREEV=['es','pt'];
const vl=k=>VLANG[vkey(k)]||prefs.ui;
const vOk=k=>FREEV.includes(vkey(k))||isPremium();
function verSheet(cur,cb){cur=vkey(cur);const LN={pt:'Português',es:'Español'};
  const sh=openSheet(`<h3>${esc(t('bv_t'))}</h3><div class="bv">${VGROUPS.map(([g,ks])=>`<span class="sect">${LN[g]} <small class="bv-n">${ks.length}</small></span><div class="bv-g">${ks.map(k=>`<button class="bv-o" data-bv="${k}" aria-pressed="${k===cur}"><span class="bv-tx"><b>${esc(VNAME[k])}</b><small>${esc(t('bvi_'+k))}</small></span>${vOk(k)?(k===cur?ic('check'):''):`<span class="prem sm">${ic('lock')}PREMIUM</span>`}</button>`).join('')}</div>`).join('')}</div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-bv]');if(!b)return;const k=b.dataset.bv;closeSheet();if(!vOk(k)){planGate('bv');return}cb(k)})}
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
function origWords(tx,k){return tx.split((k==='h'||k==='a')?/([\s\u05be]+)/:/(\s+)/).map(w=>/^[\s\u05be]*$/.test(w)?esc(w):`<button class="ow" data-ow="${esc(w)}" data-k="${k}">${esc(w)}</button>`).join('')}
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
  dx_load:'Cargando el diccionario…',dx_err:'No se pudo cargar. Revise la conexión.',dx_none:'Sin resultados.',bv_t:'Versiones de la Biblia',pk_bv:'Lea y compare todas las versiones de la Biblia: 6 en español y 4 en portugués.',pk_cmp_more:'Compare con {n} versiones más',
bvi_pt:'Portugués · versión principal',bvi_ptr:'Portugués · basada en el Textus Receptus',bvi_nva:'Portugués · lenguaje actual',bvi_es:'Español · versión principal',bvi_es65:'Español · revisión de 1865',bvi_bpm:'Portugués · lenguaje actual',bvi_pdt:'Español · lenguaje sencillo',bvi_bes:'Español · lenguaje sencillo',bvi_vbl:'Español · lenguaje actual',bvi_blm:'Español · traducción libre',dx_sug:'Sugerencias',dx_dym:'¿Quiso decir?',dx_none_here:'No está en este diccionario. Lo encontramos en:',dx_jesus:'Jesús (Ἰησοῦς) es la forma griega del nombre hebreo Yehoshúa / Yeshúa (el mismo de Josué), que significa «el Señor es salvación».',dx_more:'Buscando también en inglés…',
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
  dx_load:'Carregando o dicionário…',dx_err:'Não foi possível carregar. Confira a conexão.',dx_none:'Nenhum resultado.',bv_t:'Versões da Bíblia',pk_bv:'Leia e compare todas as versões da Bíblia: 4 em português e 6 em espanhol.',pk_cmp_more:'Compare com mais {n} versões',
bvi_pt:'Português · versão principal',bvi_ptr:'Português · baseada no Textus Receptus',bvi_nva:'Português · linguagem atual',bvi_es:'Espanhol · versão principal',bvi_es65:'Espanhol · revisão de 1865',bvi_bpm:'Português · linguagem atual',bvi_pdt:'Espanhol · linguagem simples',bvi_bes:'Espanhol · linguagem simples',bvi_vbl:'Espanhol · linguagem atual',bvi_blm:'Espanhol · tradução livre',dx_sug:'Sugestões',dx_dym:'Você quis dizer?',dx_none_here:'Não está neste dicionário. Encontramos em:',dx_jesus:'Jesus (Ἰησοῦς) é a forma grega do nome hebraico Yehoshúa / Yeshúa (o mesmo de Josué), que significa “o Senhor é salvação”.',dx_more:'Buscando também em inglês…',
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

const DX={k:null,view:'hub',q:{b:'',h:'',a:'',g:''},en:{},busy:false,err:{},ctx:null};
const isHe=k=>k==='h'||k==='a';
const lxFile=k=>isHe(k)?'he':'gr';
const nWords=x=>' '+norm(x).replace(/[^a-z0-9]+/g,' ').trim()+' ';
const LXI={},LXIP={},LXC={},LXCP={};
function lxIdx(k){if(LXI[k])return Promise.resolve(LXI[k]);
  if(!LXIP[k])LXIP[k]=fetch('biblia/lex/'+lxFile(k)+'-idx.json?v=2').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{const all=d.e;if(k==='a'){const A=new Set(d.ar||[]);d=Object.assign({},d,{e:d.e.filter(r=>/^A:/.test(r[3])||A.has(r[0]))})}d.by={};all.forEach(r=>d.by[r[0]]=r);
    d.ix=d.e.map(r=>{d.by[r[0]]=r;return{o:isHe(k)?normH(r[1]):normG(r[1]),tr:norm(r[2]).replace(/[^a-z]/g,''),en:nWords(r[4]),es:nWords(r[5]),pt:nWords(r[6]),kw:nWords(r[8])}});return LXI[k]=d}).catch(e=>{LXIP[k]=null;throw e});
  return LXIP[k]}
function lxChunk(k,n){const c=lxFile(k)+'-'+Math.floor(n/500);if(LXC[c])return Promise.resolve(LXC[c]);
  if(!LXCP[c])LXCP[c]=fetch('biblia/lex/'+c+'.json?v=2').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>LXC[c]=d).catch(e=>{LXCP[c]=null;throw e});return LXCP[c]}
function lxSearch0(k,q){const d=LXI[k];if(!d)return[];q=q.trim();if(!q)return[];
  const m=q.match(/^[GHgh]?\s*0*(\d{1,4})[a-z]?$/);if(m){const r=d.by[+m[1]];return r?[r]:[]}
  const out=[];const L=lxLang();
  if(/[֐-׿Ͱ-Ͽἀ-῿]/.test(q)){const o=isHe(k)?normH(q):normG(q);if(!o)return[];
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
    d.al=Object.create(null);Object.entries(a).forEach(([k,v])=>d.al[norm(k).trim()]=v);d.nn=d.e.map(r=>nWords(r[0]));d.byName={};d.e.forEach((r,i)=>d.byName[r[0].toLowerCase()]=i);return BIX=d}).catch(e=>{BIXP=null;throw e});return BIXP}
const bLetter=n=>{const c=norm(n).charAt(0);return c>='a'&&c<='z'?c:'0'};
function bibChunk(name){const L=bLetter(name);if(BCH[L])return Promise.resolve(BCH[L]);if(!BCHP[L])BCHP[L]=fetch('biblia/bib/'+L+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>BCH[L]=d).catch(e=>{BCHP[L]=null;throw e});return BCHP[L]}
function bibSearch0(q){const d=BIX;if(!d)return[];const qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim();if(qn.length<2)return[];
  const terms=[qn,d.al[qn]?norm(d.al[qn]):'',DX.en['b|'+qn]||''].filter(Boolean).map(x=>x.replace(/[^a-z0-9]+/g,' ').trim()).filter(x=>x.length>1);
  const out=[];d.nn.forEach((nm,i)=>{let sc=0;for(const tm of terms){if(nm===' '+tm+' ')sc=Math.max(sc,6);else if(nm.startsWith(' '+tm))sc=Math.max(sc,5);else if(tm.length>2&&nm.includes(' '+tm))sc=Math.max(sc,3)}if(sc)out.push([i,sc])});
  return out.sort((a,b)=>b[1]-a[1]||d.e[b[0]][1]-d.e[a[0]][1]).slice(0,50).map(x=>x[0])}
/* Formas das palavras -> palavra de dicionário (cidades→cidade, respondeu→responder, díjole→decir) */
const LEMD={},LEMP={};
const own=(o,k)=>o&&Object.prototype.hasOwnProperty.call(o,k)&&Array.isArray(o[k])?o[k]:[];
let ALN=null,ALNP=null;
function alnLoad(){if(ALN)return Promise.resolve(ALN);if(!ALNP)ALNP=fetch('biblia/lex/alinh.json?v=1').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>ALN=d).catch(()=>{ALNP=null;return null});return ALNP}
// palavra que o dicionário não traz como tradução: o que o texto original traz nos mesmos versículos
function alnOf(q){if(!ALN)return[];const qn=norm(q).replace(/[^a-z]+/g,' ').trim();if(!qn||qn.includes(' '))return[];const L=lxLang(),O=L==='pt'?'es':'pt';
  for(const w of [qn,...lemOf(q)]){const r=own(ALN[L],w).length?own(ALN[L],w):own(ALN[O],w);if(r.length)return r}return[]}
function lemLoad(L){L=L||lxLang();if(LEMD[L])return Promise.resolve(LEMD[L]);if(!LEMP[L])LEMP[L]=fetch('biblia/lex/lem-'+L+'.json?v=1').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>LEMD[L]=d).catch(()=>{LEMP[L]=null;return null});return LEMP[L]}
function lemOf(q){const qn=norm(q).replace(/[^a-z]+/g,' ').trim();if(!qn||qn.includes(' ')||qn.length<3)return[];const L=lxLang(),O=L==='pt'?'es':'pt';
  const D=(LEMD[L]||{}).f,D2=(LEMD[O]||{}).f;const out=[...own(D,qn),...own(D2,qn)];
  if(qn.length>4)[[/oes$/,'ao'],[/aes$/,'ao'],[/ns$/,'m'],[/is$/,'l'],[/ces$/,'z'],[/es$/,''],[/s$/,'']].forEach(([a,b])=>{if(a.test(qn))out.push(qn.replace(a,b))});
  return[...new Set(out)].filter(x=>x&&x!==qn&&x.length>2)}
const LREV={};
// todas as formas da mesma palavra na Bíblia: cidade → cidade, cidades
function lemFam(q){const L=lxLang();const D=(LEMD[L]||{}).f;const qn=norm(q).replace(/[^a-z]+/g,' ').trim();if(!D||!qn||qn.includes(' '))return[];
  if(!LREV[L]){const m=Object.create(null);Object.entries(D).forEach(([f,ls])=>ls.forEach(l=>{(m[l]=m[l]||[]).push(f)}));LREV[L]=m}
  const lem=new Set([qn,...own(D,qn)]);const out=new Set();lem.forEach(l=>{out.add(l);(LREV[L][l]||[]).forEach(f=>out.add(f))});
  // só formas cujo lema é um dos lemas buscados (evita juntar palavras diferentes)
  return[...out].filter(f=>f===qn||lem.has(f)||own(D,f).some(l=>lem.has(l)))}
const lemEn=w=>{const n=norm(w).trim();for(const L of [lxLang(),lxLang()==='pt'?'es':'pt']){const e=(LEMD[L]||{}).e;if(e&&Object.prototype.hasOwnProperty.call(e,n))return e[n]}return''};
const noLem=q=>/[֐-׿Ͱ-Ͽἀ-῿\d]/.test(q);
function lxSearch(k,q){const r=lxSearch0(k,q);if(r.length||noLem(q))return r;for(const l of lemOf(q)){const x=lxSearch0(k,l);if(x.length){x.via=l;return x}}
  const d=LXI[k];if(d){const P=k==='g'?'G':'H';const x=alnOf(q).filter(a=>a[0][0]===P).map(a=>d.e.find(e=>e[0]===+a[0].slice(1))).filter(Boolean);if(x.length){x.aln=q.trim();return x}}return r}
function bibSearch(q){let r=bibSearch0(q);if(r.length||noLem(q))return r;const tries=[[lemEn(q),''],...lemOf(q).flatMap(l=>[[l,l],[lemEn(l),l]])];
  for(const [w,v] of tries){if(!w)continue;r=bibSearch0(w);if(r.length){r.via=v;r.en=w;return r}}
  for(const a of alnOf(q)){if(!/^[A-Z]/.test(a[1]))continue;r=bibSearch0(a[1]);if(r.length){r.en=a[1];return r}}return r}
function pregSearch(q){const r=pregSearch0(q);if(r.length||noLem(q))return r;for(const l of lemOf(q)){const x=pregSearch0(l);if(x.length){x.via=l;return x}}return r}
/* Diccionario del predicador (escrito en ES/PT): va primero en el Bíblico y aparece como explicación pastoral en hebreo/griego */
let PREG=null,PREGP=null;
function loadPreg(){if(PREG)return Promise.resolve(PREG);if(!PREGP)PREGP=fetch('biblia/dic-pregador.json?v=5').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
    d.ix=d.e.map(e=>[[e[0],...e[6]].map(norm),[e[1],...e[7]].map(norm)]);d.byN={};d.e.forEach((e,i)=>e[4].forEach(o=>{(d.byN[o[0]]=d.byN[o[0]]||[]).push([i,o])}));return PREG=d}).catch(e=>{PREGP=null;throw e});return PREGP}
function pregSearch0(q){if(!PREG)return[];const qn=norm(q.trim());if(qn.length<2)return[];const out=[];
  PREG.ix.forEach((ix,i)=>{const sc=ws=>Math.max(0,...ws.map(w=>w===qn?6:w.startsWith(qn)?5:(qn.length>2&&w.split(' ').some(x=>x.startsWith(qn)))?3:0));const s=Math.max(sc(ix[0]),sc(ix[1]));if(s)out.push([i,s])});
  return out.sort((x,y)=>y[1]-x[1]).slice(0,12).map(x=>x[0])}

/* ---------- favoritos e historial (en la cuenta: meta.dicFav / meta.dicHist) ---------- */
const dxFavs=()=>Array.isArray(meta.dicFav)?meta.dicFav:(meta.dicFav=[]);
const dxHists=()=>Array.isArray(meta.dicHist)?meta.dicHist:(meta.dicHist=[]);
const dxIsFav=(k,id)=>dxFavs().some(f=>f.k===k&&String(f.id)===String(id));
function dxFavToggle(it){const F=dxFavs();const i=F.findIndex(f=>f.k===it.k&&String(f.id)===String(it.id));if(i>=0){F.splice(i,1);toast(t('dx_unfav'))}else{F.unshift(Object.assign({at:Date.now()},it));if(F.length>300)F.length=300;toast(t('dx_faved'))}putMeta();return i<0}
function dxHistAdd(k,q){q=String(q||'').trim();if(q.length<2)return;const H=dxHists();const i=H.findIndex(x=>x.k===k&&norm(x.q)===norm(q));if(i>=0)H.splice(i,1);H.unshift({k,q,at:Date.now()});if(H.length>60)H.length=60;putMeta()}

/* ---------- pantalla ---------- */
const DXK=[['b','dx_b','dx_bd'],['h','dx_h','dx_hd'],['a','dx_ar','dx_ard'],['g','dx_g','dx_gd']];
const dxGlyph={b:ic('bible'),h:'<span lang="he">א</span>',a:'<span lang="arc">ד</span>',g:'<span lang="grc">Ω</span>'};
function dxHtml(){const inEd=DX.ctx==='ed';
  if(DX.view==='dic'&&DX.k)return dxDicHtml(DX.k);
  const head=inEd?`<div class="between"><h3>${esc(t('dx_ed'))}</h3><button class="iconbtn" data-dx="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>`:`<h1 class="h">${esc(t('dx_t'))}</h1>`;
  if(DX.view==='fav'||DX.view==='hist')return head+dxListHtml(DX.view);
  const F=dxFavs(),H=dxHists();
  return`${head}<label class="search">${ic('search')}<input class="dx-qa" type="search" value="${esc(DX.qa||'')}" placeholder="${esc(t('dx_all_ph'))}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>
   ${!isPremium()?`<button class="dx-free" data-act="plans">${ic('lock')}<span>${esc(t('dx_free',{n:PCFG.free.dic}))}</span><span class="prem">PREMIUM</span></button>`:''}
   <div class="dx-allres">${(DX.qa||'').trim()?dxAllHtml():''}</div><div class="dx-tiles">${DXK.map(([k,tl,d])=>`<button class="dx-tile" data-dx="go" data-k="${k}"><span class="dx-gl dx-gl-${k}">${dxGlyph[k]}</span><span class="dx-tt">${esc(t(tl))}</span><span class="dx-td">${esc(t(d))}</span><span class="dx-go">${ic('next')}</span></button>`).join('')}</div>
   <div class="dx-two"><button class="dx-mini" data-dx="view" data-v="fav">${ic('star')}<span>${esc(t('dx_fav'))}</span><b>${F.length}</b></button><button class="dx-mini" data-dx="view" data-v="hist">${ic('undo')}<span>${esc(t('dx_hist'))}</span><b>${H.length}</b></button></div>
   ${H.length?`<div class="sd-es">${H.slice(0,8).map((h,i)=>`<span class="dx-hc"><button data-dx="hq" data-i="${i}"><small>${esc(h.k==='b'?'B':h.k==='h'?'H':h.k==='a'?'A':'G')}</small>${esc(h.q)}</button><button data-dx="hdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('x')}</button></span>`).join('')}</div>`:''}`}
// Búsqueda en los tres diccionarios a la vez (desde la pantalla principal de Diccionarios)
function dxAllHtml(){return DXK.map(([k,tl])=>`<div class="dx-allsec"><div class="between"><span class="sect">${esc(t(tl))}</span><button class="lnk" data-dx="seeall" data-k="${k}">${esc(t('see_all'))}</button></div>${dxResHtml(k)}</div>`).join('')}
async function dxAll(host,q){DX.qa=q;DXK.forEach(([k])=>DX.q[k]=q);const paint=()=>{const el=$('.dx-allres',host);if(el)el.innerHTML=q.trim()?dxAllHtml():''};paint();
  if(!q.trim())return;const miss=DXK.map(x=>x[0]).filter(k=>!(k==='b'?BIX:LXI[k]));if(miss.length){await Promise.all(miss.map(dxLoad));if(DX.qa===q)paint()}}
function dxListHtml(v){const L=dxHists(),F=dxFavs();const back=`<button class="lnk dx-back" data-dx="hub">${ic('back')}${esc(t('dx_back'))}</button>`;
  if(v==='fav')return back+`<h2 class="dx-h2">${esc(t('dx_fav'))}</h2>`+(F.length?`<div class="res">${F.map((f,i)=>`<div class="dx-row"><button data-dx="open" data-k="${f.k}" data-id="${esc(f.id)}"><b>${esc(t(f.k==='h'?'dx_h':f.k==='a'?'dx_ar':f.k==='g'?'dx_g':'dx_b'))}</b><span ${f.k==='h'?'':''}>${esc(f.t)}</span>${f.s?`<small>${esc(f.s)}</small>`:''}</button><button class="iconbtn" data-dx="fdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('trash')}</button></div>`).join('')}</div>`:`<div class="empty"><p style="margin:0">${esc(t('dx_nofav'))}</p></div>`);
  return back+`<div class="between"><h2 class="dx-h2">${esc(t('dx_hist'))}</h2>${L.length?`<button class="lnk" data-dx="hclr">${esc(t('dx_hclr'))}</button>`:''}</div>`+(L.length?`<div class="res">${L.map((h,i)=>`<div class="dx-row"><button data-dx="hq" data-i="${i}"><b>${esc(t(h.k==='h'?'dx_h':h.k==='a'?'dx_ar':h.k==='g'?'dx_g':'dx_b'))}</b><span>${esc(h.q)}</span><small>${esc(relDate(h.at))}</small></button><button class="iconbtn" data-dx="hdel" data-i="${i}" aria-label="${esc(t('dx_x'))}">${ic('x')}</button></div>`).join('')}</div>`:`<div class="empty"><p style="margin:0">${esc(t('dx_nohist'))}</p></div>`)}
function dxDicHtml(k){const tl=k==='b'?'dx_b':k==='h'?'dx_h':k==='a'?'dx_ar':'dx_g';
  return`<button class="lnk dx-back" data-dx="hub">${ic('back')}${esc(t('dx_back'))}</button>
   <div class="row"><span class="dx-gl dx-gl-${k} sm">${dxGlyph[k]}</span><h2 class="dx-h2" style="flex:1">${esc(t(tl))}</h2></div>
   <label class="search">${ic('search')}<input class="dx-q" type="search" value="${esc(DX.q[k])}" placeholder="${esc(t('dx_ph_'+k))}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>
   <div class="dx-res">${dxResHtml(k)}</div>
   <p class="sub dx-srcl">${esc(t('dx_src'))}: ${esc(k==='b'?"Easton (1897), Smith (1863), Hitchcock (1869) · Meu Púlpito":'STEPBible.org (Tyndale House, CC BY 4.0) · Strong')}</p>`}
function dxLoad(k){const p=k==='b'?Promise.all([bibIdx(),loadPreg(),lemLoad(),alnLoad()]):Promise.all([lxIdx(k),loadPreg(),lemLoad(),alnLoad()]);
  return p.then(()=>{DX.err[k]=false},()=>{DX.err[k]=true})}
function dxResHtml(k){const ready=k==='b'?!!BIX:!!LXI[k];const q=DX.q[k];const L=lxLang();
  if(!ready)return`<div class="empty"><p style="margin:0">${esc(t(DX.err[k]?'dx_err':'dx_load'))}</p>${DX.err[k]?`<button class="btn dark" data-dx="retry">${esc(t('go_on'))}</button>`:''}</div>`;
  if(!q.trim()){const H=dxHists().filter(h=>h.k===k).slice(0,8);return`<p class="sub" style="margin:0;line-height:1.55">${esc(t(k==='b'?'dx_hint_b':'dx_hint_l'))}</p>${H.length?`<div class="sd-es">${H.map(h=>`<span class="dx-hc"><button data-dx="hq" data-i="${dxHists().indexOf(h)}">${esc(h.q)}</button></span>`).join('')}</div>`:''}${dxSugHtml(k,'dx_sug',(DX_SUG[k]||{})[L]||[])}`}
  if(k==='b'){const pr=pregSearch(q);const r=bibSearch(q);const C=lxCache(L);
    const ph=pr.map(i=>{const e=PREG.e[i];const pt=L==='pt';const m=pt?e[2]:e[3];return`<button data-dx="open" data-k="p" data-id="${i}"><b>${esc(t('dx_preg'))}</b><span class="dx-ti">${esc(pt?e[0]:e[1])}</span><span>${esc(m.length>120?m.slice(0,120).replace(/\s+\S*$/,'')+'…':m)}</span></button>`}).join('');
    const qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim();const viaAl=BIX.al[qn]?BIX.al[qn].toLowerCase():r.en?r.en.toLowerCase():'';
    const bh=r.map(i=>{const e=BIX.e[i];const tt=C['bt'+e[0]]||(viaAl===e[0].toLowerCase()?(r.via||q.trim()).replace(/^./,c=>c.toUpperCase()):'');const nm=e[2]?(C['bn'+e[0]]||''):'';return`<button data-dx="open" data-k="b" data-id="${esc(e[0])}"><span class="dx-ti">${esc(tt&&norm(tt)!==norm(e[0])?tt:e[0])}${tt&&norm(tt)!==norm(e[0])?` <small>· ${esc(e[0])}</small>`:''}</span>${nm?`<span><em>${esc(nm)}</em></span>`:''}${e[1]?`<small>${esc(t('dic_nref',{n:e[1]}))}</small>`:''}</button>`}).join('');
    if(!ph&&!bh)return`<div class="empty"><p style="margin:0">${esc(DX.busy?t('dx_more'):t('dx_none'))}</p></div>`;
    const via=(ph&&pr.via)||(!ph&&r.via)||'';
    return`${via?`<p class="dx-note">${esc(t('dx_via',{w:via}))}</p>`:''}<div class="res">${ph}${bh}</div>`}
  const r=lxSearch(k,q);const jn=isHe(k)&&/^(jesus|jesus cristo|jesucristo|yeshua)$/.test(norm(q).replace(/[^a-z]+/g,' ').trim())?`<p class="dx-note">${esc(t('dx_jesus'))} <button class="lnk" data-dx="open" data-k="g" data-id="2424">G2424 Ἰησοῦς</button></p>`:'';
  if(!r.length){if(DX.busy)return`<div class="empty"><p style="margin:0">${esc(t('dx_more'))}</p></div>`;const o=dxOther(k,q);
    return jn+`<div class="empty"><p style="margin:0">${esc(t(o?'dx_none_here':'dx_none'))}</p></div>`+(o||dxSugHtml(k,'dx_dym',dxNear(k,q)))}
  return jn+(r.via?`<p class="dx-note">${esc(t('dx_via',{w:r.via}))}</p>`:'')+(r.aln?`<p class="dx-note">${esc(t('dx_aln',{w:r.aln}))}</p>`:'')+`<div class="res">${r.map(e=>lxRow(k,e)).join('')}</div>`}
function lxRow(k,e){const L=lxLang();const g=(L==='pt'?e[6]||e[5]:e[5]||e[6])||'';return`<button data-dx="open" data-k="${k}" data-id="${e[0]}"><b><span class="sd-num sm">${isHe(k)?'H':'G'}${e[0]}</span> ${esc(lxCat(e[3],L))}</b><span class="dx-lrow"><span class="dx-lem" ${isHe(k)?'dir="rtl" lang="he"':'lang="grc"'}>${esc(e[1])}</span><span class="dx-trl">${esc(e[2].replace(/\./g,''))}</span></span><span>${g?esc(g):`<span class="sub">${esc(e[4])} (en)</span>`}${e[7]?` <small>· ${esc(t('dx_x_times',{n:e[7]}))}</small>`:''}</span></button>`}
// Sugerencias de búsqueda: palabras de estudio y predicación que existen en cada diccionario
const DX_SUG={
 h:{pt:['amor','graça','paz','fé','salvação','aliança','misericórdia','santo','glória','espírito','coração','alma','justiça','louvar','bênção','Senhor','ungido','Jesus','Davi','Sião'],
    es:['amor','gracia','paz','fe','salvación','pacto','misericordia','santo','gloria','espíritu','corazón','alma','justicia','alabar','bendición','Señor','ungido','Jesús','David','Sion']},
 a:{pt:['rei','reino','Deus','céu','sonho','sabedoria','mistério','fogo','leão','imagem','ouro','decreto','Daniel','Babilônia','Nabucodonosor','Jerusalém','casa','adorar'],
    es:['rey','reino','Dios','cielo','sueño','sabiduría','misterio','fuego','león','imagen','oro','decreto','Daniel','Babilonia','Nabucodonosor','Jerusalén','casa','adorar']},
 g:{pt:['amor','graça','fé','paz','igreja','evangelho','espírito','salvação','reino','palavra','esperança','alegria','poder','perdão','arrependimento','glória','Jesus','Cristo'],
    es:['amor','gracia','fe','paz','iglesia','evangelio','espíritu','salvación','reino','palabra','esperanza','gozo','poder','perdón','arrepentimiento','gloria','Jesús','Cristo']}};
function dxSugHtml(k,tl,W){W=W.filter(w=>lxSearch(k,w).length);if(!W.length)return'';
  return`<div class="dx-sug"><span class="sect">${esc(t(tl))}</span><div class="sd-es">${W.map(w=>`<span class="dx-hc"><button data-dx="sq" data-k="${k}" data-q="${esc(w)}">${esc(w)}</button></span>`).join('')}</div></div>`}
// «¿Quiso decir…?»: palabras del diccionario parecidas a lo escrito (errores de tipeo)
function dxEd(a,b,m){if(Math.abs(a.length-b.length)>m)return m+1;let p=[...Array(b.length+1).keys()];
  for(let i=1;i<=a.length;i++){const c=[i];let lo=i;for(let j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<lo)lo=c[j]}if(lo>m)return m+1;p=c}return p[b.length]}
function dxNear(k,q){const d=LXI[k];if(!d)return[];const L=lxLang();const qn=norm(q).replace(/[^a-z]+/g,'');if(qn.length<3)return[];
  const m=qn.length>5?2:1;const best={};
  d.e.forEach(r=>{const g=(L==='pt'?r[6]||r[5]:r[5]||r[6])||'';g.split(/[^A-Za-zÀ-ÿ]+/).forEach(w=>{if(w.length<3)return;const wn=norm(w);if(wn===qn)return;const e=dxEd(qn,wn,m);if(e<=m){const sc=e*100000-r[7];if(!best[wn]||sc<best[wn].s)best[wn]={w:w.toLowerCase(),s:sc}}})});
  return Object.values(best).sort((a,b)=>a.s-b.s).slice(0,6).map(x=>x.w)}
// Sin resultados en este diccionario: mostrar lo que hay en los otros
function dxOther(k,q){const L=lxLang();const T={h:'dx_h',a:'dx_ar',g:'dx_g'};let h='';
  ['h','a','g'].filter(x=>x!==k&&LXI[x]).forEach(x=>{const r=lxSearch(x,q).slice(0,3);if(r.length)h+=`<span class="sect">${esc(t(T[x]))}</span><div class="res">${r.map(e=>lxRow(x,e)).join('')}</div>`});
  if(PREG){const pr=pregSearch(q).slice(0,2);if(pr.length)h+=`<span class="sect">${esc(t('dx_b'))}</span><div class="res">${pr.map(i=>{const e=PREG.e[i];const pt=L==='pt';const m=pt?e[2]:e[3];return`<button data-dx="open" data-k="p" data-id="${i}"><b>${esc(t('dx_preg'))}</b><span class="dx-ti">${esc(pt?e[0]:e[1])}</span><span>${esc(m.length>120?m.slice(0,120).replace(/\s+\S*$/,'')+'…':m)}</span></button>`}).join('')}</div>`}
  return h?`<div class="dx-other">${h}</div>`:''}
async function dxQuery(host,k,q){DX.q[k]=q;DX.busy=false;const paint=()=>{const el=$('.dx-res',host);if(el)el.innerHTML=dxResHtml(k)};paint();
  const qq=q.trim();if(k!=='b'&&qq.length>1&&!lxSearch(k,qq).length){const miss=['h','a','g'].filter(x=>x!==k&&!LXI[x]);if(miss.length)Promise.all(miss.map(dxLoad)).then(()=>{if(DX.q[k]===q)paint()})}
  if(qq.length<3||/^[GHgh]?\s*\d/.test(qq)||/[Ͱ-Ͽ֐-׿ἀ-῿]/.test(qq)||!navigator.onLine)return;
  const qn=norm(qq).replace(/[^a-z0-9]+/g,' ').trim();if(DX.en[k+'|'+qn]!==undefined)return;
  const weak=k==='b'?!bibSearch(qq).length&&!pregSearch(qq).length:lxSearch(k,qq).length<3;if(!weak)return;
  DX.busy=true;paint();try{const en=await toEnglish(qq,lxLang());DX.en[k+'|'+qn]=norm(en).replace(/[^a-z0-9]+/g,' ').trim()}catch(e){DX.en[k+'|'+qn]=''}DX.busy=false;if(DX.q[k]===q)paint()}
function dxMount(host){host.innerHTML=dxHtml();
  if(DX.view==='dic'&&DX.k){const k=DX.k;const ready=k==='b'?BIX:LXI[k];if(!ready)dxLoad(k).then(()=>{if(host.isConnected&&DX.k===k){const el=$('.dx-res',host);if(el)el.innerHTML=dxResHtml(k)}})}
  if(host._dx)return;host._dx=1;
  host.addEventListener('input',e=>{const qa=e.target.closest('.dx-qa');if(qa){clearTimeout(qa._t);const v=qa.value;qa._t=setTimeout(()=>dxAll(host,v),280);return}
    const i=e.target.closest('.dx-q');if(!i)return;const k=DX.k,v=i.value;clearTimeout(i._t);i._t=setTimeout(()=>dxQuery(host,k,v),280)});
  host.addEventListener('keydown',e=>{const i=e.target.closest('.dx-q,.dx-qa');if(i&&e.key==='Enter'){e.preventDefault();i.blur()}});
  host.addEventListener('click',e=>{const b=e.target.closest('[data-dx]');if(!b||!host.contains(b))return;e.preventDefault();const a=b.dataset.dx;
    if(a==='go'){DX.k=b.dataset.k;DX.view='dic';track('dic');dxMount(host);const i=$('.dx-q',host);if(i&&!('ontouchstart' in window))i.focus()}
    else if(a==='hub'){DX.view='hub';dxMount(host)}
    else if(a==='seeall'){const k=b.dataset.k;DX.k=k;DX.view='dic';DX.q[k]=DX.qa||'';dxMount(host);dxQuery(host,k,DX.q[k])}
    else if(a==='view'){DX.view=b.dataset.v;dxMount(host)}
    else if(a==='close'){closeSheet()}
    else if(a==='retry'){DX.err[DX.k]=false;dxMount(host)}
    else if(a==='open'){const k=b.dataset.k;if(DX.view==='dic'&&DX.k&&DX.q[DX.k])dxHistAdd(DX.k,DX.q[DX.k]);else if(DX.view!=='dic'&&(DX.qa||'').trim()){const hk=b.closest('.dx-allsec')&&b.closest('.dx-allsec').querySelector('[data-dx=seeall]');if(hk)dxHistAdd(hk.dataset.k,DX.qa)}dxOpen(k,b.dataset.id)}
    else if(a==='sq'){const k=b.dataset.k,q=b.dataset.q;DX.k=k;DX.view='dic';DX.q[k]=q;dxMount(host);dxQuery(host,k,q)}
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
  else if(a==='ins'){const html=o.html();[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));DX.ctx=null;insertHtmlAfterCaret(html);toast(t('dx_ins_ok'))}
  else if(a==='ai'){o.ai&&o.ai(x)}})}
function dxOpen(k,id){if(k==='p')return dxOpenPreg(+id);if(k==='b')return dxOpenBib(id);return dxOpenLex(k,+id)}

async function dxOpenLex(k,n){if(!dicQuota())return;const L=lxLang();let d,ch;try{[d,ch]=await Promise.all([lxIdx(k),lxChunk(k,n)])}catch(e){toast(t('dx_err'));return}
  const e=d.by[n];if(!e){toast(t('dict_nf'));return}const x=ch[n]||{me:'',s:[],r:[],rn:0,mr:[]};
  let S=null;try{S=(await loadStrong(k)).d[n]||null}catch(err){}
  let P=[];try{P=((await loadPreg()).byN[(isHe(k)?'H':'G')+n]||[])}catch(err){}
  const [num,lem,tr,mo,gEN,gES,gPT,cnt]=e;const g=L==='pt'?gPT:gES;const id=(isHe(k)?'H':'G')+num;const he=isHe(k);
  const pron=he?lxPron(k,tr,S&&S[5]):(S&&S[1])||'';
  const cat=lxCat(mo,L);
  const senses=x.s||[];const sl=s=>L==='pt'?s[2]:s[1];
  const ex=senses.filter(s=>s[4]&&s[4].length).slice(0,3);
  const sh=dxSheet(`<div class="sd-head"><span class="sd-num">${id}</span><span class="sub">${esc(t(/^A:/.test(mo||'')?'dx_ar':he?'dx_h':'dx_g'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
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
    ${dxSec(t('dx_hist_c'),`<div id="dxAi">${dxNA(t('dx_hist_na'))}${aiKey()?`<button class="btn sm ghost" data-x="ai">${ic('spark')}${esc(t('dx_ai_btn'))}</button>`:''}</div>`)}
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
    ${!aiKey()?'':dxSec(t('dx_ai'),`<div id="dxAi">${aiKey()?`<p class="dx-sm" style="margin-top:0">${esc(t('dx_hist_c'))} · ${esc(L==='pt'?'contexto bíblico · importância espiritual':'contexto bíblico · importancia espiritual')}</p><button class="btn sm ghost" data-x="ai">${ic('spark')}${esc(t('dx_ai_btn'))}</button>`:`<p class="dx-sm" style="margin:0">${esc(t('dx_ai_need'))}</p>`}</div>`)}
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

async function dxOpenPreg(i){if(!dicQuota())return;try{await loadPreg()}catch(e){toast(t('dx_err'));return}const e=PREG.e[i];if(!e)return;const L=lxLang();const pt=L==='pt';const [wpt,wes,mpt,mes,o,vs]=e;const X=e[8]||{};const xs=k=>X[k]?(pt?X[k][0]:X[k][1]):'';
  const sh=dxSheet(`<div class="sd-head"><span class="sd-num">${esc(t('dx_b'))}</span><span class="sub">${esc(t('dx_preg'))}</span><button class="iconbtn" style="margin-left:auto" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <h3 class="sd-name">${esc(pt?wpt:wes)}</h3>${dxActs(dxIsFav('p',i))}
    ${dxSec(t('dx_def'),`<p class="sd-p">${esc(pt?mpt:mes)}</p>`)}
    ${xs('h')?dxSec(t('dx_hctx'),`<p class="sd-p">${esc(xs('h'))}</p>`):''}${xs('b')?dxSec(t('dx_bctx'),`<p class="sd-p">${esc(xs('b'))}</p>`):''}${xs('s')?dxSec(t('dx_spir'),`<p class="sd-p">${esc(xs('s'))}</p>`):''}
    ${dxSec(t('dx_lexw'),o.map(([n,lem,tr,xpt,xes])=>`<button class="sd-box po dx-po" data-sref="${n}"><div class="row" style="gap:10px;align-items:baseline;flex-wrap:wrap"><span class="sd-lemma sm" ${n[0]==='H'?'dir="rtl" lang="he"':'lang="grc"'}>${esc(lem)}</span><span class="sd-tr">${esc(tr)}</span><span class="sd-num sm" style="margin-left:auto">${n}</span></div><span class="dx-sm">${esc(t(n[0]==='H'?'dx_h':'dx_g'))}</span><p class="sd-p" style="margin:0">${esc(pt?xpt:xes)}</p></button>`).join(''))}
    ${vs.length?dxSec(t('dx_deep'),`<div class="dx-ex">${vs.slice(0,6).map(r=>{const z=refStr(r,L);return z?`<div class="dx-exi"><button class="tag eref" data-eref="${esc(z)}">${esc(z)}</button><p class="sd-p dx-ext" data-ref="${esc(z)}">…</p></div>`:''}).join('')}</div>`):''}
    <p class="dx-src">${esc(t('dx_p_src'))}</p>`);
  dxWire(sh,{fav:{k:'p',id:i,t:pt?wpt:wes,s:o.map(x=>x[1]).join(' · ')},
    text:()=>[pt?wpt:wes,pt?mpt:mes,...['h','b','s'].map(xs).filter(Boolean),...o.map(([n,lem,tr,xpt,xes])=>`${lem} (${tr}, ${n}): ${pt?xpt:xes}`)].join('\n'),
    html:()=>`<p><b>${esc(pt?wpt:wes)}</b>: ${esc(pt?mpt:mes)}</p>`+['h','b','s'].map(k=>xs(k)?`<p>${esc(xs(k))}</p>`:'').join('')+o.map(([n,lem,tr,xpt,xes])=>`<p><b>${esc(lem)}</b> <i>(${esc(tr)}, ${n})</i> — ${esc(pt?xpt:xes)}</p>`).join('')});
  loadBible(L).then(()=>$$('.dx-ext',sh).forEach(p=>{p.textContent=bibleText(p.dataset.ref,L)||''})).catch(()=>{})}

/* =========================================================
   Curiosidades bíblicas: preguntas y respuestas guardadas en el app (sin IA y sin conexión)
   ========================================================= */
Object.assign(I18N.es,{cu_t:'Curiosidades bíblicas',cu_d:'Preguntas y respuestas sobre la Biblia, con referencias.',cu_n:'{n} preguntas',cu_ph:'Pregunte algo de la Biblia…',cu_all:'Todas',cu_fav:'Favoritas',cu_none:'No hay una respuesta guardada para esa pregunta.',cu_ans:'Respuesta',cu_exp:'Explicación',cu_refs:'Referencias bíblicas',cu_more:'¿Sabía que…?',cu_crit:'Criterio',cu_ok:'Respuesta verificada · Meu Púlpito',cu_share:'Compartir',cu_ai:'Preguntar a la IA',cu_ai_lbl:'Respuesta generada por IA. No está verificada: confirme las referencias en la Biblia.',cu_ai_need:'Para preguntas nuevas con IA, agregue su clave en Configuración.',cu_back:'Inicio',cu_nofav:'Todavía no guardó preguntas. Abra una y toque la estrella.',cu_dic:'En el Diccionario Bíblico',cu_none2:'No hay una curiosidad guardada con esa pregunta, pero el Diccionario Bíblico tiene estos artículos:'});
Object.assign(I18N.pt,{cu_t:'Curiosidades bíblicas',cu_d:'Perguntas e respostas sobre a Bíblia, com referências.',cu_n:'{n} perguntas',cu_ph:'Pergunte algo da Bíblia…',cu_all:'Todas',cu_fav:'Favoritas',cu_none:'Não há uma resposta guardada para essa pergunta.',cu_ans:'Resposta',cu_exp:'Explicação',cu_refs:'Referências bíblicas',cu_more:'Você sabia?',cu_crit:'Critério',cu_ok:'Resposta verificada · Meu Púlpito',cu_share:'Compartilhar',cu_ai:'Perguntar à IA',cu_ai_lbl:'Resposta gerada por IA. Não é verificada: confira as referências na Bíblia.',cu_ai_need:'Para perguntas novas com IA, coloque sua chave em Configurações.',cu_back:'Início',cu_nofav:'Você ainda não salvou perguntas. Abra uma e toque na estrela.',cu_dic:'No Dicionário Bíblico',cu_none2:'Não há uma curiosidade guardada com essa pergunta, mas o Dicionário Bíblico tem estes artigos:'});
let CUR=null,CURP=null;const CV={cat:'',q:''};
function loadCur(){if(CUR)return Promise.resolve(CUR);if(!CURP)CURP=fetch('biblia/curiosidades.json?v=3').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
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
  const chips=`<div class="chips">${[['',t('cu_all')],['fav',t('cu_fav')],['hist',t('cu_hist')],...Object.entries(CUR.cats).map(([k,v])=>[k,v[l]])].map(([k,v])=>`<button class="chip" data-cu="cat" data-k="${k}" aria-pressed="${CV.cat===k}">${k==='fav'?ic('star'):k==='hist'?ic('undo'):''}${esc(v)}</button>`).join('')}</div>`;
  return head+chips+`<div id="cuRes">${curResHtml()}</div>`}
/* lo que no está en las curiosidades se busca también en el Diccionario Bíblico (sin conexión, fuentes verificadas) */
function curDicHtml(){lemLoad();const tk=norm(CV.q).replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(w=>w.length>2&&!CU_STOP.has(w)&&!['significa','quiso','dice','hizo','fue','era','esta','estava'].includes(w));if(!tk.length)return'';
  if(!BIX||!PREG){Promise.all([bibIdx(),loadPreg()]).then(()=>{const r=$('#cuRes');if(r&&view.tab==='cur')r.innerHTML=curResHtml()}).catch(()=>{});return''}
  const L=lxLang(),pt=L==='pt',C=lxCache(L);const seen=new Set();const items=[];
  for(const w of tk){pregSearch(w).slice(0,3).forEach(i=>{if(!seen.has('p'+i)){seen.add('p'+i);const e=PREG.e[i];items.push(`<button class="cu-item" data-cu="dic" data-k="p" data-id="${i}"><span class="cu-q"><b>${esc(pt?e[0]:e[1])}</b><small>${esc((pt?e[2]:e[3]).slice(0,90))}…</small></span>${ic('next')}</button>`)}});
    bibSearch(w).slice(0,3).forEach(i=>{const e=BIX.e[i];if(!seen.has('b'+e[0])){seen.add('b'+e[0]);const al=BIX.al[w]&&BIX.al[w].toLowerCase()===e[0].toLowerCase();const tt=C['bt'+e[0]]||(al?CV.q.trim():'');items.push(`<button class="cu-item" data-cu="dic" data-k="b" data-id="${esc(e[0])}"><span class="cu-q"><b>${esc(tt&&!al?tt:e[0])}</b><small>${esc(t('dx_b'))}${e[1]?' · '+esc(t('dic_nref',{n:e[1]})):''}</small></span>${ic('next')}</button>`)}})}
  return items.length?`<span class="sect cu-sect">${esc(t('cu_dic'))}</span><div class="cu-list">${items.slice(0,8).join('')}</div>`:''}
/* ---------- Busca en toda la Biblia desde Curiosidades: «¿cuántas veces aparece…?», números, palabras y frases (sin conexión) ---------- */
function numWords(n,L){const out=new Set();if(!(n>=0&&n<1e6))return[];
  if(L==='pt'){const U=['zero','um','dois','tres','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','catorze','quinze','dezesseis','dezessete','dezoito','dezenove'],
      T=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'],H=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
    const f=x=>x<20?U[x]:x<100?T[x/10|0]+(x%10?' e '+U[x%10]:''):x<1000?(x===100?'cem':H[x/100|0]+(x%100?' e '+f(x%100):'')):((x/1000|0)===1?'mil':f(x/1000|0)+' mil')+(x%1000?((x%1000)<100||x%100===0?' e ':' ')+f(x%1000):'');
    const m=f(n);out.add(m);out.add(m.replace(/\bum\b/g,'uma').replace(/\bdois\b/g,'duas').replace(/entos\b/g,'entas'));out.add(m.replace('catorze','quatorze').replace('dezesseis','dezasseis'))}
  else{const U=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciseis','diecisiete','dieciocho','diecinueve'],
      T=['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'],H=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
    const f=(x,old)=>x<16?U[x]:x<20?(old?'diez y '+U[x-10]:U[x]):x<30&&x>20?(old?'veinte y '+U[x-20]:'veinti'+U[x-20]):x<100?T[x/10|0]+(x%10?' y '+U[x%10]:''):x<1000?(x===100?'cien':H[x/100|0]+(x%100?' '+f(x%100,old):'')):((x/1000|0)===1?'mil':f(x/1000|0,old)+' mil')+(x%1000?' '+f(x%1000,old):'');
    [f(n,0),f(n,1)].forEach(m=>{out.add(m);out.add(m.replace(/\buno$/,'un'));out.add(m.replace(/\buno$/,'una').replace(/ientos\b/g,'ientas'))})}
  return[...out]}
const BQ_STOP=new Set(('quantas quantos quanta quanto vezes vez aparece aparecem aparecer apareceu esta estao mencionado mencionada mencionados mencionadas mencionam menciona citado citada cita escrito escrita '+
  'numero numeros palavra palavras termo nome nomes biblia biblico toda todo inteira na no nas nos em da do das dos de a o as os e que qual quais onde fala falam sobre texto textos versiculo versiculos '+
  'cuantas cuantos cuanta cuanto veces se menciona mencionan esta estan la el los las en del al y donde habla hablan sobre dice diz aparecen escrita versiculos todo toda entera '+
  'me mostre mostra mostrar busca buscar procure encontrar quero quiero saber existe existem hay tem um uma un una').split(' '));
const NW_PT=new Set('um uma dois duas tres quatro cinco seis sete oito nove dez onze doze treze catorze quatorze quinze dezesseis dezasseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento duzentos duzentas trezentos trezentas quatrocentos quatrocentas quinhentos quinhentas seiscentos seiscentas setecentos setecentas oitocentos oitocentas novecentos novecentas mil'.split(' '));
const NW_ES=new Set('uno una un dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento doscientos doscientas trescientos trescientas cuatrocientos cuatrocientas quinientos quinientas seiscientos seiscientas setecientos setecientas ochocientos ochocientas novecientos novecientas mil'.split(' '));
const BN={};
function bibNorm(L){if(BN[L])return BN[L];const B=BIB[vkey(L)];if(!B)return null;const a=[];
  B.forEach((bk,b)=>(bk||[]).forEach((ch,c)=>(ch||[]).forEach((v,i)=>{if(v)a.push([b,c+1,i+1,' '+norm(v).replace(/[^a-z0-9]+/g,' ')+' '])})));return BN[L]=a}
function bqParse(q,L){const n=norm(q).replace(/[^a-z0-9]+/g,' ').trim();if(!n)return null;const how=/\b(quant[ao]s? vez|cuant[ao]s? vec|quantas|cuantas|quantos|cuantos)\b/.test(n);
  const tk=n.split(' ').filter(w=>w&&!BQ_STOP.has(w));if(!tk.length)return null;
  const nums=tk.filter(w=>/^\d+$/.test(w));if(nums.length===1&&tk.length<=2){const k=+nums[0];const ws=numWords(k,L).map(x=>norm(x));return{how,num:k,alts:[...new Set(ws)],label:`${k} (${ws[0]})`}}
  return{how,tk:tk.filter(w=>!/^\d+$/.test(w)||w.length<4),label:tk.join(' ')}}
function bqRun(P,L){const V=bibNorm(L);if(!V)return null;const hit=[];let total=0,mode='phrase';
  const count=(s,alts)=>{let c=0;for(const a of alts){let i=s.indexOf(' '+a+' ');while(i>=0){c++;i=s.indexOf(' '+a+' ',i+a.length+1)}}return c};
  if(P.fam){V.forEach(v=>{const c=count(v[3],P.fam);if(c){total+=c;hit.push(v)}})}
  else if(P.alts){const al=P.alts.slice().sort((a,b)=>b.length-a.length);const NW=L==='pt'?NW_PT:NW_ES;
    // el número solo: no cuenta 42 («cuarenta y dos»), 140 («ciento cuarenta») ni 40.000 («cuarenta mil»)
    const part=(s,i,k)=>{const b=s.slice(0,i).trim().split(' ').slice(-2),a=s.slice(i+k.length).trim().split(' ').slice(0,2);const isN=w=>NW.has(w)||/^veinti/.test(w);
      return isN(b[b.length-1])||((b[b.length-1]==='e'||b[b.length-1]==='y')&&isN(b[0]))||isN(a[0])||((a[0]==='e'||a[0]==='y')&&isN(a[1]))};
    V.forEach(v=>{let s=v[3];let c=0;for(const a of al){const k=' '+a+' ';let i=s.indexOf(k);while(i>=0){if(!part(s,i,k))c++;s=s.slice(0,i)+' # '+s.slice(i+k.length);i=s.indexOf(k)}}if(c){total+=c;hit.push(v)}})}
  else{const ph=P.tk.join(' ');V.forEach(v=>{const c=count(v[3],[ph]);if(c){total+=c;hit.push(v)}});
    if(!hit.length&&P.tk.length>1){mode='all';V.forEach(v=>{if(P.tk.every(w=>v[3].includes(' '+w+' ')))hit.push(v)});
      if(!hit.length){mode='one';const w=P.tk.slice().sort((a,b)=>b.length-a.length)[0];P.one=w;V.forEach(v=>{const c=count(v[3],[w]);if(c){total+=c;hit.push(v)}})}}}
  const books={};hit.forEach(v=>books[v[0]]=(books[v[0]]||0)+1);const ot=hit.filter(v=>v[0]<39).length;
  return{hit,total:total||hit.length,mode,ot,nt:hit.length-ot,top:Object.entries(books).sort((a,b)=>b[1]-a[1]).slice(0,5)}}
let BQ={q:'',n:30};
function curBibleHtml(){const q=CV.q.trim();if(q.length<2)return'';const L=lxLang();const P=bqParse(q,L);if(!P)return'';
  if(!BIB[vkey(L)]){loadBible(L).then(()=>{const r=$('#cuRes');if(r&&view.tab==='cur')r.innerHTML=curResHtml()}).catch(()=>{});return`<span class="sect cu-sect">${esc(t('bq_t'))}</span><p class="sub" style="margin:0">${esc(t('dx_load'))}</p>`}
  const R=bqRun(P,L);if(!R)return'';if(BQ.q!==q)BQ={q,n:30};
  const orig=w=>w.split(' ').map(x=>(q.split(/[^0-9A-Za-zÀ-ÿ]+/).find(o=>norm(o)===x))||x).join(' ');
  const term=P.alts?`${P.num} · ${numWords(P.num,L)[0].replace(/\bdieciseis\b/,'dieciséis').replace(/\bveinti(dos|tres|seis)\b/,(m,x)=>'veinti'+{dos:'dós',tres:'trés',seis:'séis'}[x]).replace(/\btres\b/g,L==='pt'?'três':'tres')}`:orig(R.mode==='one'?P.one:P.tk.join(' '));const ver=verLabel(L);
  const head=!R.hit.length?t('bq_none',{w:term,v:ver}):R.mode==='all'?t('bq_all',{n:R.hit.length,w:P.tk.map(orig).join(', '),v:ver}):t(R.total===1?'bq_cnt1':'bq_cnt',{w:term,n:R.total,m:R.hit.length,v:ver});
  const hl=(txt)=>{let h=esc(txt);const keys=P.alts||(R.mode==='one'?[P.one]:R.mode==='all'?P.tk:[P.tk.join(' ')]);
    const nt=norm(txt);const marks=[];keys.forEach(k=>{const rx=new RegExp('(^|[^a-z0-9])('+k.split(' ').map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('[^a-z0-9]+')+')(?=[^a-z0-9]|$)','g');let m;while((m=rx.exec(nt))){marks.push([m.index+m[1].length,m.index+m[0].length])}});
    if(!marks.length)return h;marks.sort((a,b)=>a[0]-b[0]);let o='',p=0;marks.forEach(([a,b])=>{if(a<p)return;o+=esc(txt.slice(p,a))+'<mark>'+esc(txt.slice(a,b))+'</mark>';p=b});return o+esc(txt.slice(p))};
  const B=BIB[vkey(L)];const rows=R.hit.slice(0,BQ.n).map(v=>{const ref=refName(v[0],v[1],[v[2]],L);return`<button class="cu-item bq-v" data-cu="vref" data-ref="${esc(ref)}"><span class="cu-q"><b>${esc(ref)}</b><small>${hl(B[v[0]][v[1]-1][v[2]-1])}</small></span></button>`}).join('');
  return`<span class="sect cu-sect">${esc(t('bq_t'))}</span>
   <div class="bq-card"><p class="bq-h">${esc(head)}</p>
    ${R.hit.length?`<p class="bq-s">${esc(t('bq_ot',{a:R.ot,b:R.nt}))}</p><p class="bq-s">${esc(t('bq_top'))}: ${esc(R.top.map(([b,n])=>`${t('books',null,L)[b]} (${n})`).join(' · '))}</p>`:''}
    ${(()=>{if(P.alts||P.tk.length!==1||R.mode!=='phrase')return'';const fam=lemFam(P.tk[0]);if(fam.length<2)return'';const R2=bqRun({fam},L);if(!R2||R2.total<=R.total)return'';
      return`<p class="bq-s">${esc(t('bq_fam',{f:fam.slice(0,6).join(', ')+(fam.length>6?'…':''),n:R2.total,m:R2.hit.length}))}</p>`})()}
    <p class="bq-note">${esc(t(P.alts?'bq_note_n':'bq_note'))}</p>
    ${R.hit.length?`<div class="row" style="gap:8px"><button class="btn sm ghost" data-cu="bqshare">${ic('share')}${esc(t('cu_share'))}</button></div>`:''}</div>
   ${R.hit.length&&!isPremium()?`<button class="pk-card" data-cu="bqlock">${ic('lock')}<span><b>${esc(t('pk_bqv',{n:R.hit.length}))} <span class="prem sm">PREMIUM</span></b><span>${esc(t('pk_bq'))}</span></span></button>`:''}
   ${R.hit.length&&isPremium()?`<div class="cu-list">${rows}</div>${R.hit.length>BQ.n?`<button class="btn ghost block" data-cu="bqmore">${esc(t('bq_more',{n:R.hit.length-BQ.n}))}</button>`:''}`:''}`}
Object.assign(I18N.es,{bq_fam:'Contando también las otras formas de la palabra ({f}): {n} veces en {m} versículos.',bq_t:'En toda la Biblia',bq_cnt:'«{w}» aparece {n} veces en {m} versículos ({v}).',bq_cnt1:'«{w}» aparece 1 vez ({v}).',bq_all:'{n} versículos tienen las palabras {w} ({v}).',bq_none:'«{w}» no aparece en la {v}.',
  bq_ot:'Antiguo Testamento: {a} versículos · Nuevo Testamento: {b}',bq_top:'Libros donde más aparece',bq_note:'Cuenta la palabra exacta en esta traducción. Otras versiones pueden variar un poco.',bq_note_n:'Cuenta el número solo, escrito con letras en esta traducción (por ejemplo «cuarenta»). No cuenta números mayores que lo contienen, como 42, 140 o 40.000. Otras versiones pueden variar un poco.',bq_more:'Ver {n} versículos más'});
Object.assign(I18N.pt,{bq_fam:'Contando também as outras formas da palavra ({f}): {n} vezes em {m} versículos.',bq_t:'Em toda a Bíblia',bq_cnt:'«{w}» aparece {n} vezes em {m} versículos ({v}).',bq_cnt1:'«{w}» aparece 1 vez ({v}).',bq_all:'{n} versículos têm as palavras {w} ({v}).',bq_none:'«{w}» não aparece na {v}.',
  bq_ot:'Antigo Testamento: {a} versículos · Novo Testamento: {b}',bq_top:'Livros onde mais aparece',bq_note:'Conta a palavra exata nesta tradução. Outras versões podem variar um pouco.',bq_note_n:'Conta o número sozinho, escrito por extenso nesta tradução (por exemplo «quarenta»). Não conta números maiores que o contêm, como 42, 140 ou 40 mil. Outras versões podem variar um pouco.',bq_more:'Ver mais {n} versículos'});
function curResHtml(){const l=cuL();let list=CV.q.trim()?curSearch(CV.q):CUR.e.slice();const F=cuFavs();
  if(CV.cat==='fav')list=list.filter(e=>F.includes(e.id));else if(CV.cat==='hist'){const H=cuHist();list=H.map(id=>CUR.by[id]).filter(Boolean).filter(e=>list.includes(e));if(!list.length)return`<div class="empty"><p style="margin:0">${esc(t('cu_nohist'))}</p></div>`}else if(CV.cat)list=list.filter(e=>e.cat===CV.cat);
  const dic=CV.q.trim().length>2&&CV.cat!=='fav'?curDicHtml():'';const bq=CV.q.trim().length>1&&CV.cat!=='fav'?curBibleHtml():'';
  if(!list.length)return bq+`${dic?(bq?'':`<p class="sub" style="margin:0">${esc(t('cu_none2'))}</p>`)+dic:(bq?'':`<div class="empty"><p style="margin:0">${esc(t(CV.cat==='fav'&&!CV.q?'cu_nofav':'cu_none'))}</p></div>`)}${CV.q.trim().length>4?(aiKey()?`<button class="btn gold" data-cu="ai" style="align-self:center">${ic('spark')}${esc(t('cu_ai'))}</button>`:''):''}`;
  const groups=CV.q.trim()||CV.cat?[[null,list]]:Object.keys(CUR.cats).map(k=>[k,list.filter(e=>e.cat===k)]);
  const dy=!CV.q.trim()&&!CV.cat?CUR.by[curDayId()]:null;
  const dayHtml=dy?`<button class="cu-day" data-cu="open" data-id="${dy.id}"><span class="cu-day-k">${ic('spark')}${esc(t('cu_day'))}</span><b>${esc(dy.q[l])}</b><span>${esc(t('cu_day_tap'))}</span></button>`:'';
  const bqFirst=bq&&/\b(quant[ao]s|cuant[ao]s|numero|vezes|veces)\b|\d/.test(norm(CV.q));
  return dayHtml+(bqFirst?bq:'')+groups.map(([k,items])=>`${k?`<span class="sect cu-sect">${esc(CUR.cats[k][l])}</span>`:''}<div class="cu-list">${items.map(e=>`<button class="cu-item" data-cu="open" data-id="${e.id}"><span class="cu-q">${esc(e.q[l])}</span>${!curFree(e.id)?`<span class="cu-lock" aria-label="Premium">Premium</span>`:''}${F.includes(e.id)?`<span class="cu-st">${ic('star')}</span>`:''}${ic('next')}</button>`).join('')}</div>`).join('')+(bqFirst?'':bq)+dic}
function curAfter(){if(!CUR){loadCur().then(()=>{if(view.tab==='cur')render()}).catch(()=>{});return}
  const i=$('#cuQ');if(i){i.oninput=()=>{CV.q=i.value;clearTimeout(i._t);i._t=setTimeout(()=>{const r=$('#cuRes');if(r)r.innerHTML=curResHtml()},180)};i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();i.blur()}}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cu]');if(!b||view.tab!=='cur')return;const a=b.dataset.cu;
  if(a==='cat'){CV.cat=b.dataset.k;$$('[data-cu=cat]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const r=$('#cuRes');if(r)r.innerHTML=curResHtml()}
  else if(a==='open')curOpen(+b.dataset.id);else if(a==='dic')dxOpen(b.dataset.k,b.dataset.id);else if(a==='ai')curAi(CV.q.trim())
  else if(a==='vref')compareRef(b.dataset.ref,null,lxLang())
  else if(a==='bqlock')planGate('bq')
  else if(a==='bqmore'){BQ.n+=50;const r=$('#cuRes');if(r)r.innerHTML=curResHtml()}
  else if(a==='bqshare'){const c=$('.bq-card');const txt=[CV.q.trim(),'',c?c.querySelector('.bq-h').textContent:'',...(c?[...c.querySelectorAll('.bq-s')].map(x=>x.textContent):[]),'','— Meu Púlpito'].join('\n');if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')))}});
function curText(e,l){return[e.q[l],'',e.a[l],'',e.x[l],e.r.length?'\n'+(l?'Referências: ':'Referencias: ')+(l?e.r:(e.r_es||e.r)).map(r=>refStr(r,l?'pt':'es')).join('; '):'',e.c?'\n'+t('cu_more')+' '+e.c[l]:'','\n— Meu Púlpito'].filter(x=>x!=='').join('\n')}
function curOpen(id){const e=CUR.by[id];if(!e)return;if(!curFree(id)){planGate('cur');return}cuHistAdd(id);const l=cuL(),L=l?'pt':'es';const refs=(l?e.r:(e.r_es||e.r));const fav=cuFavs().includes(id);
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
function compareRef(ref,host,lang){lang=vl(lang);const p=parseRef(ref);if(!p||!p.vs){toast(t('verse_nf'));return}
  // todas las versiones del idioma + la principal de los otros (para no descargar 15 Biblias de una vez)
  const grp=g=>VGROUPS.find(x=>x[0]===g)[1];const all=lang==='pt'?[...grp('pt'),'es']:[...grp('es'),'pt'];const first=all.filter(vOk);const lockN=all.length-first.length;const og=p.b>=39?'grc':'hbo';const keys=[...first,og];
  const sh=openSheet(`<h3>${esc(t('cmp_t'))} · ${esc(refName(p.b,p.ch,p.vs,lang))}</h3><div id="cmpBody" class="sub">${esc(t('cmp_load'))}</div>`,{host});
  Promise.all(keys.map(k=>loadBible(k).catch(()=>null))).then(()=>{if(!sh.isConnected)return;
    $('#cmpBody',sh).outerHTML=`<div style="display:flex;flex-direction:column;gap:14px">${keys.map(k=>{const tx=bibleText(ref,k);const orig=k===og;
      return`<div style="display:flex;flex-direction:column;gap:4px;${orig?'border-top:1px solid var(--line);padding-top:12px':''}">
        <span class="lbl" style="color:var(--gold-ink)">${esc(orig?`${t('orig')} · ${t(og==='grc'?'orig_g':'orig_h')}`:VNAME[k])}</span>
        ${tx?`<span ${orig&&og==='hbo'?'dir="rtl" lang="he"':orig?'lang="grc"':''} style="font-family:var(--read);font-size:${orig?19:16.5}px;line-height:1.6">${orig?origWords(tx,og==='grc'?'g':'h'):esc(tx)}</span>${orig?`<span class="sub" style="font-size:12px">${ic('search')} ${esc(t('dict_tap'))}</span>`:''}
        ${orig?`<span class="sub" style="font-style:italic">${esc(og==='grc'?translitGr(tx):translitHe(tx))}</span><span class="sub" style="font-size:11px">${esc(t('translit'))} · ${esc(VNAME[k])}</span>`:''}`
        :`<span class="sub">${esc(t('cmp_none'))}</span>`}</div>`}).join('')}</div>${lockN?`<button class="pk-card" data-pkc="1">${ic('lock')}<span><b>${esc(t('pk_cmp_more',{n:lockN}))} <span class="prem sm">PREMIUM</span></b><span>${esc(t('pk_bv'))}</span></span></button>`:''}<div id="cmpXr"></div>`;
    const pc=$('[data-pkc]',sh);if(pc)pc.onclick=()=>planGate('bv');
    xrLoad(p.b).then(()=>{const box=$('#cmpXr',sh);if(!box)return;const L=xrList(p.b,p.ch,p.vs[0]);if(!L.length)return;
      box.innerHTML=`<div class="xr-sec"><span class="lbl" style="color:var(--gold-ink)">${ic('link')} ${esc(t('xr_t'))}</span><div class="xr-list">${xrItemsHtml(L,lang,isPremium()?5:3)}</div>${L.length>(isPremium()?5:3)?`<button class="btn ghost block sm" data-xrall="1">${esc(t('xr_more',{n:L.length}))}</button>`:''}</div>`;
      box.onclick=e=>{if(e.target.closest('[data-xrall]')){xrSheet(p.b,p.ch,p.vs[0],lang);return}const it=e.target.closest('[data-xr]');if(it)xrGo(it.dataset.xr)}}).catch(()=>{})})}

/* ---------- Referencias cruzadas (OpenBible.info, CC BY · basadas en el Treasury of Scripture Knowledge) ---------- */
const XR={},XRP={};
function xrLoad(b){if(XR[b])return Promise.resolve(XR[b]);if(!XRP[b])XRP[b]=fetch('biblia/xref/'+b+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>XR[b]=d).catch(e=>{XRP[b]=null;throw e});return XRP[b]}
function xrList(b,c,v){const d=XR[b];const L=(d&&d[c+':'+v])||[];const out=[];
  L.forEach(([b2,c2,v1,v2])=>{const vs=[];for(let x=v1;x<=(v2||v1)&&vs.length<12;x++)vs.push(x);
    const prev=out.find(o=>o.b===b2&&o.c===c2&&(vs[0]===o.vs[o.vs.length-1]+1||o.vs[0]===vs[vs.length-1]+1));
    if(prev){prev.vs=[...new Set([...prev.vs,...vs])].sort((a,b)=>a-b)}else if(!out.some(o=>o.b===b2&&o.c===c2&&vs.every(x=>o.vs.includes(x))))out.push({b:b2,c:c2,vs})});
  return out}
function xrItemsHtml(list,lang,max){return list.slice(0,max).map(o=>{const r=refName(o.b,o.c,o.vs,lang);const tx=bibleText(r,lang);
  return`<button class="xr-i" data-xr="${o.b}.${o.c}.${o.vs.join(',')}"><b>${esc(r)}</b><span>${esc(tx.length>220?tx.slice(0,220).replace(/\s+\S*$/,'')+'…':tx)}</span></button>`}).join('')}
async function xrSheet(b,c,v,lang){lang=lang||lxLang();const sh=openSheet(`<div class="between"><h3>${esc(t('xr_t'))} · ${esc(refName(b,c,[v],lang))}</h3><button class="iconbtn" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div><div id="xrBody"><p class="sub">${esc(t('dx_load'))}</p></div>`,{cls:'big ns'});
  try{await Promise.all([xrLoad(b),loadBible(lang)])}catch(e){const el=$('#xrBody',sh);if(el)el.innerHTML=`<p class="sub">${esc(t('dx_err'))}</p>`;return}
  const L=xrList(b,c,v);const el=$('#xrBody',sh);if(!el)return;
  const FR=isPremium()?40:3;el.innerHTML=L.length?`<p class="sub" style="margin:0 0 10px;font-size:13px">${esc(t('xr_d',{n:L.length}))}</p><div class="xr-list">${xrItemsHtml(L,lang,FR)}</div>${L.length>FR?`<button class="pk-card" data-pk="xr">${ic('lock')}<span><b>${esc(t('pk_more',{n:L.length-FR}))} <span class="prem sm">PREMIUM</span></b><span>${esc(t('pk_xr'))}</span></span></button>`:''}<p class="sub" style="font-size:11.5px;margin:12px 0 0">${esc(t('xr_src'))}</p>`:`<p class="sub">${esc(t('xr_none'))}</p>`;
  sh.addEventListener('click',e=>{if(e.target.closest('[data-x=close]')){closeSheet();return}if(e.target.closest('[data-pk]')){planGate('xr');return}const it=e.target.closest('[data-xr]');if(!it)return;xrGo(it.dataset.xr)})}
function xrGo(code){const [b,c,vs]=code.split('.');[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));BV.fav=false;BV.b=+b;BV.c=+c;BV.sel=new Set(vs.split(',').map(Number));
  if(view.overlay==='editor'||view.overlay==='preach'){toast(refName(+b,+c,[...BV.sel],lxLang()));return}
  go('bible');setTimeout(()=>{const el=$(`.vs[data-v="${vs.split(',')[0]}"]`);el&&el.scrollIntoView({block:'center',behavior:'smooth'})},250)}
Object.assign(I18N.es,{xr_t:'Versículos relacionados',xr_d:'{n} textos que se relacionan con este versículo, los más citados primero. Toque para abrir en la Biblia.',xr_none:'No hay referencias cruzadas para este versículo.',xr_src:'Referencias cruzadas: OpenBible.info (CC BY), basadas en el Treasury of Scripture Knowledge.',xr_more:'Ver todos los relacionados ({n})',xr_btn:'Relacionados'});
Object.assign(I18N.pt,{xr_t:'Versículos relacionados',xr_d:'{n} textos que se relacionam com este versículo, os mais citados primeiro. Toque para abrir na Bíblia.',xr_none:'Não há referências cruzadas para este versículo.',xr_src:'Referências cruzadas: OpenBible.info (CC BY), baseadas no Treasury of Scripture Knowledge.',xr_more:'Ver todos os relacionados ({n})',xr_btn:'Relacionados'});

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
const aiVis=()=>!!aiKey()||(typeof isAdmin==='function'&&isAdmin());
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
function cacheAll(){ls.set(keyOf('n'),notes);ls.set(keyOf('s'),sermons);ls.set(keyOf('a'),agenda);ls.set(keyOf('m'),meta);try{pubTouch()}catch(e){}}
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
const ADMIN_EMAIL='tudeliveryd@gmail.com';const APP_VER='v169';
function isAdmin(){return !!(authU&&(authU.email||'').toLowerCase()===ADMIN_EMAIL)}
let planState=null,blocked=false;
function track(k){try{const u=ls.get('mp.uses',{});u[k]=(u[k]||0)+1;ls.set('mp.uses',u)}catch(e){}}
// Estadísticas: solo números (sermones, fechas, idioma). NUNCA el contenido de los sermones.
function pushStats(force){if(!cols||!authU||localMode||!window.firebase)return;const now=Date.now();
  const sig=liveS().length+'|'+liveN().length+'|'+agenda.length+'|'+(meta.name||'')+'|'+(meta.wa||'');const prev=ls.get('mp.stats.sig',{});
  if(!force&&prev.sig===sig&&now-(prev.at||0)<6*3600e3)return;ls.set('mp.stats.sig',{sig,at:now});
  const ck='mp.created.'+authU.uid;const created=ls.get(ck,0)||now;ls.set(ck,created);
  const d={email:(authU.email||'').toLowerCase(),name:meta.name||'',lang:prefs.ui,sermons:liveS().length,
    preached:liveS().filter(isPreached).length,notes:liveN().length,events:agenda.length,
    uses:ls.get('mp.uses',{}),seen:now,created,ver:APP_VER,wa:meta.wa||''};
  if(freshAccount(authU)){const r=refIn();if(r){d.ref=r;if(!meta.refBy){meta.refBy=r;putMeta()}}}
  try{firebase.firestore().collection('stats').doc(authU.uid).set(d,{merge:true}).catch(()=>{})}catch(e){}}
/* presença: avisa a cada 2 min, só com o app aberto na tela, que o pastor está usando (para o Escritório ver quem está online) */
function beat(force){if(!authU||localMode||!window.firebase||document.hidden)return;const now=Date.now();if(!force&&now-(beat._at||0)<55e3)return;beat._at=now;
  const sec=E?'editor':PG?'pregar':view.tab||'home';try{firebase.firestore().collection('stats').doc(authU.uid).set({on:now,seen:now,sec,ver:APP_VER},{merge:true}).catch(()=>{})}catch(e){}}
setInterval(()=>beat(),120e3);document.addEventListener('visibilitychange',()=>{if(!document.hidden)beat(true)});
let planLoaded=false;
const waitingOk=()=>!!(PCFG.gate&&planLoaded&&!isAdmin()&&!(planState&&(planState.ok||PMON[planState.plan])));
function applyPlan(){const b=!!(planState&&planState.blocked)||waitingOk();if(b===blocked)return;blocked=b;if(b)showBlocked();else if(ready)go(view.tab||'home')}
// Si el plan cambia (el administrador lo pasa a gratis, vence o se activa), la pantalla se actualiza en el momento
let lastPrem=null;
let cfgLoaded=false;
function premWatch(){if(!planLoaded||!cfgLoaded)return;const p=isPremium();if(lastPrem===null){lastPrem=p;return}if(p===lastPrem)return;const was=lastPrem;lastPrem=p;
  if(PREC&&!p){try{pRecStop()}catch(e){}}
  if(ready&&!blocked&&!E&&!PG&&!view.overlay)refreshBg();
  if(was&&!p&&!isAdmin()){const N=planNow();const k='mp.down.'+(planState&&(planState.until||planState.trial)||0);if(ls.get(k,0))return;ls.set(k,1);
    const go=()=>{if(E||PG||$('.ov')){setTimeout(go,3000);return}
      const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('lock')}</span><h3>${esc(t('dn_t'))}</h3><p>${esc(t('dn_d'))}</p>
        <button class="btn gold block" id="dnGo">${esc(t('dn_go'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('dn_no'))}</button></div>`);
      $('#dnGo',sh).onclick=()=>{closeSheet();plansSheet()}};setTimeout(go,600)}}
setInterval(premWatch,30000);
function watchPlan(u){let first=true;try{unsubs.push(firebase.firestore().collection('planos').doc(u.uid).onSnapshot(d=>{planState=d.exists?d.data():null;planLoaded=true;applyPlan();premWatch();
    if(first){first=false;if(!d.exists&&freshAccount(u))trialStart(u);else welcomeCheck()}else welcomeCheck();thxCheck();trialTick()},()=>{}))}catch(e){}}
/* ---------- Prueba Premium automática de 72 horas para cuentas nuevas (una sola vez: las reglas de Firestore solo permiten crearla si la cuenta no tiene plan) ---------- */
const TRIAL_MS=72*3600e3;
/* ---------- WhatsApp del pastor (para bienvenida y avisos del plan, enviados por el administrador) ---------- */
const WA_CC=[['595','Paraguay'],['55','Brasil'],['54','Argentina'],['591','Bolivia'],['598','Uruguay'],['56','Chile'],['51','Perú'],['57','Colombia'],['593','Ecuador'],['58','Venezuela'],['52','México'],['506','Costa Rica'],['503','El Salvador'],['502','Guatemala'],['504','Honduras'],['505','Nicaragua'],['507','Panamá'],['1','EE. UU. / Canadá'],['34','España'],['351','Portugal'],['39','Italia'],['44','Reino Unido'],['81','Japón']];
function waDefCC(){const c=MC.code();return c==='PYG'?'595':c==='BRL'?'55':c==='ARS'?'54':c==='BOB'?'591':c==='UYU'?'598':c==='USD'?'1':c==='EUR'?'34':prefs.ui==='pt'?'55':'595'}
function waNorm(cc,n){n=String(n||'').replace(/\D/g,'');if(n.startsWith(cc)&&n.length>cc.length+7)n=n.slice(cc.length);n=n.replace(/^0+/,'');return n.length>=6&&n.length<=13?'+'+cc+n:''}
function waShow(v){const m=String(v||'').match(/^\+(\d+)$/);return m?v:''}
function waSheet(required,done){const cur=meta.wa||'';const cc0=(WA_CC.find(([c])=>cur.startsWith('+'+c))||[waDefCC()])[0];const num0=cur?cur.slice(cc0.length+1):'';
  const sh=openSheet(`<div class="wa-ask"><span class="pk-ic">${ic('chat')}</span><h3>${esc(t('wa_t'))}</h3><p class="sub" style="margin:0;font-size:14.5px;line-height:1.5">${esc(t('wa_d'))}</p>
    <div class="wa-row"><select class="inp" id="waCC" aria-label="${esc(t('wa_cc'))}">${WA_CC.map(([c,n])=>`<option value="${c}" ${c===cc0?'selected':''}>+${c} ${esc(n)}</option>`).join('')}</select>
    <input class="inp" id="waN" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="${esc(t('wa_ph'))}" value="${esc(num0)}"></div>
    <p class="err" id="waErr" hidden></p>
    <button class="btn gold block" id="waOk">${esc(t('wa_save'))}</button>${required?'':`<button class="btn ghost block" id="waNo">${esc(t('wa_later'))}</button>`}
    <p class="sub" style="margin:0;font-size:12.5px;text-align:center">${esc(t('wa_priv'))}</p></div>`,{lock:required});
  $('#waOk',sh).onclick=()=>{const v=waNorm($('#waCC',sh).value,$('#waN',sh).value);const e=$('#waErr',sh);if(!v){e.textContent=t('wa_bad');e.hidden=false;return}
    meta.wa=v;putMeta();pushStats(true);closeSheet(sh.parentNode);waCheck._t=0;toast(t('wa_ok'));done&&done();if(view.tab==='profile')render()};
  const no=$('#waNo',sh);if(no)no.onclick=()=>{ls.set('mp.wa.later',Date.now());closeSheet(sh.parentNode);waCheck._t=0;done&&done()};
  setTimeout(()=>{try{$('#waN',sh).focus()}catch(e){}},80)}
// Cuentas nuevas: obligatorio. Cuentas que ya existían: se pide una vez (puede dejarlo para después).
function waCheck(){if(waCheck._t)return;waCheck._t=setInterval(()=>{if(!ready||blocked||E||!authU||localMode){return}
  if(meta.wa||isAdmin()){clearInterval(waCheck._t);return}if($('.ov'))return;
  const fresh=freshAccount(authU);if(!fresh&&ls.get('mp.wa.later',0)){clearInterval(waCheck._t);return}
  clearInterval(waCheck._t);waSheet(fresh)},2500)}
function freshAccount(u){try{const c=Date.parse(u.metadata&&u.metadata.creationTime);return c&&Date.now()-c<6*3600e3}catch(e){return false}}
async function trialStart(u){const now=Date.now();try{await firebase.firestore().collection('planos').doc(u.uid).set({trialFrom:now,trial:now+TRIAL_MS,trialAuto:true,trialState:'active',updated:now})}catch(e){}}
// Agradecimiento al activar un plan pago (una vez por cada activación o renovación)
function thxCheck(){const p=planState||{};if(isAdmin()||!PMON[p.plan]||!(+p.until>Date.now()))return;const key=String(p.until);
  if(meta.thx===key||ls.get('mp.thx.'+key,0)||thxCheck._on===key)return;
  const lp=(p.pays||[]).slice(-1)[0];const at=(lp&&lp.at)||p.updated||0;if(at&&Date.now()-at>7*864e5){meta.thx=key;putMeta();return} // planes activados antes de esta función: no mostrar
  thxCheck._on=key;
  const go=()=>{if(blocked||E){setTimeout(go,4000);return}if($('.ov')){setTimeout(go,2500);return}
    const ren=(p.pays||[]).length>1;const L=prefs.ui;
    const sh=openSheet(`<div class="wel"><span class="mark wel-mk"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
      <h2>${esc(t(ren?'thx_t2':'thx_t',{p:planName(p.plan)}))}</h2><p class="wel-s">${esc(t('thx_s'))}</p>
      <div class="wel-gift">${ic('star')}<b>${esc(t('thx_until',{p:planName(p.plan),d:fmtDay(p.until)}))}</b></div>
      <ul class="pl-f thx-l">${['pl_p1','pl_p7','pl_p2','pl_p3','pl_p4','pl_p8','pl_p5'].map(k=>`<li>${ic('check')}<span>${esc(t(k))}</span></li>`).join('')}</ul>
      <p>${esc(t('thx_d'))}</p>
      <button class="btn gold block" id="thxGo">${esc(t('thx_go'))}</button>
      <p class="wel-n">Pr. Jean Carlos · Meu Púlpito</p></div>`,{cls:'big ns',onClose:()=>{meta.thx=key;ls.set('mp.thx.'+key,1);putMeta()}});
    $('#thxGo',sh).onclick=()=>closeSheet()};
  setTimeout(go,900)}
function welcomeCheck(){const p=planState||{};if(!p.trialAuto||meta.welcomed||ls.get('mp.wel.'+p.trialFrom,0)||!(+p.trial>Date.now()))return;if(welcomeCheck._on)return;welcomeCheck._on=1;
  setTimeout(()=>{if(blocked)return;[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));
    const sh=openSheet(`<div class="wel"><span class="mark wel-mk"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
      <h2>${esc(t('wl_t'))}</h2><p class="wel-s">${esc(t('wl_s'))}</p>
      <div class="wel-gift">${ic('star')}<b>${esc(t('wl_gift'))}</b></div>
      <p>${esc(t('wl_d'))}</p>
      <button class="btn gold block" id="welGo">${esc(t('wl_go'))}</button>
      <p class="wel-n">${esc(t('wl_note'))}</p></div>`,{cls:'big ns',onClose:()=>{meta.welcomed=Date.now();ls.set('mp.wel.'+p.trialFrom,1);putMeta()}});
    $('#welGo',sh).onclick=()=>{closeSheet();if(!ls.get('mp.onb',0))setTimeout(onboarding,300)}},700)}
function trialLeftTxt(ms){const h=Math.max(0,Math.ceil(ms/3600e3));const d=Math.floor(h/24),r=h%24;return d?t('tl_dh',{d,h:r}):t('tl_h',{h})}
function trialTick(){const N=planNow();if(!N.trial)return;const left=N.trialEnd-Date.now();
  [[24,'tw24'],[3,'tw3']].forEach(([h,k])=>{if(left<=h*3600e3&&!ls.get('mp.'+k+'.'+N.trialEnd,0)){ls.set('mp.'+k+'.'+N.trialEnd,1);setTimeout(()=>toast(t(h===3?'tw_3':'tw_24')),1500)}});
  clearTimeout(trialTick._t);if(left>0)trialTick._t=setTimeout(()=>{applyPlan&&applyPlan();trialTick();if(ready&&!view.overlay)refreshBg()},Math.min(left+1000,30*60e3))}
function showBlocked(){$('#nav').hidden=true;document.documentElement.classList.remove('tabs');const w=!(planState&&planState.blocked);const wa=String(PCFG.wa||'').replace(/\D/g,'');const em=(authU&&authU.email)||'';
  $('#app').innerHTML=`<div class="login"><div class="brand"><img class="b-d" src="logo-name.png" alt="Meu Púlpito"><img class="b-l" src="logo-name-light.png" alt="Meu Púlpito"><div class="tagline"><i></i><span>${esc(t('tagline'))}</span><i></i></div></div><h2>${esc(t(w?'wt_t':'blk_t'))}</h2><p class="sub" style="font-size:15px;line-height:1.55">${esc(t(w?'wt_d':'blk_d'))}</p>${w&&em?`<p class="sub" style="margin:0;font-size:14px">${esc(t('wt_acc'))}: <b>${esc(em)}</b></p>`:''}${w&&wa?`<a class="btn gold block" href="https://wa.me/${wa}?text=${encodeURIComponent(t('wt_msg',{e:em}))}" target="_blank" rel="noopener">${ic('chat')}${esc(t('wt_wa'))}</a>`:''}<button class="btn ghost block" data-act="logout">${esc(t('logout'))}</button></div>`}
/* =========================================================
   Planes: Gratis · Premium mensual · trimestral · anual
   El plan de cada cuenta está en planos/{uid} y SOLO el administrador puede cambiarlo (reglas de Firestore).
   Precios, límites y el «período de pruebas» están en config/app, editables desde el panel.
   ========================================================= */
const PCFG_DEF={test:true,gate:false,grace:3,warn:7,wa:'',p:{m:{pyg:45000,brl:35},t:{pyg:120000,brl:95},a:{pyg:350000,brl:270},mi:{pyg:75000,brl:59},ti:{pyg:200000,brl:155},ai:{pyg:600000,brl:460}},free:{serm:2,dic:3,cur:10},
  pay:{}};  // dados de pagamento: só na configuração do painel (Formas de pagamento), não no código
let PCFG=Object.assign({},PCFG_DEF,ls.get('mp.pcfg',{}));
function watchCfg(){try{unsubs.push(firebase.firestore().collection('config').doc('app').onSnapshot(d=>{if(d.exists&&isAdmin()&&!d.data().pay&&!watchCfg._mig){watchCfg._mig=1;const old=(ls.get('mp.pcfg',{})||{}).pay;if(old&&(old.bk||old.pix))d.ref.set({pay:old},{merge:true}).catch(()=>{})}if(d.exists){PCFG=Object.assign({},PCFG_DEF,d.data());PCFG.p=Object.assign({},PCFG_DEF.p,PCFG.p||{});PCFG.free=Object.assign({},PCFG_DEF.free,PCFG.free||{});ls.set('mp.pcfg',PCFG);cfgLoaded=true;applyPlan();premWatch();if(ready&&!view.overlay&&!blocked)refreshBg()}},()=>{}))}catch(e){}}
const PMON={m:1,t:3,a:12,mi:1,ti:3,ai:12};
function planNow(){const p=planState||{};const until=p.until||0;const now=Date.now();const gr=(+PCFG.grace||0)*864e5;
  const active=PMON[p.plan]&&until>now;const grace=!!(PMON[p.plan]&&until&&until<=now&&until+gr>now);const paid=active||grace;
  const tr=+p.trial||0;const trial=!paid&&tr>now;const trialEnded=!paid&&tr>0&&tr<=now;
  return{plan:paid?p.plan:'free',paid,active,grace,graceEnd:until+gr,daysLeft:active?Math.ceil((until-now)/864e5):0,trial,trialEnd:tr,trialLeft:trial?Math.ceil((tr-now)/864e5):0,trialEnded,test:!!PCFG.test,igreja:(paid&&/i$/.test(p.plan))||(!!PCFG.test&&!localMode)||isAdmin(),premium:paid||trial||(!!PCFG.test&&!localMode)||isAdmin(),until,since:p.since||0,expired:!!(PMON[p.plan]&&until&&until<=Date.now()),last:p.plan,pays:Array.isArray(p.pays)?p.pays:[]}}
const isPremium=()=>planNow().premium;
const money=(n,c)=>c==='brl'?'R$ '+n.toLocaleString('pt-BR'):'₲ '+n.toLocaleString('es-PY');
const fmtDay=ts=>ts?new Date(ts).toLocaleDateString(prefs.ui==='pt'?'pt-BR':'es-PY',{day:'2-digit',month:'short',year:'numeric'}):'—';
Object.assign(I18N.es,{pl_fx:'Valores aproximados en {c}, según la cotización del día (ExchangeRate-API). El pago se combina por WhatsApp.',pl_choose:'Elija su plan',pl_terms:'Términos de uso',pl_sub:'Use Meu Púlpito gratis o desbloquee todas las herramientas con Premium.',pl_free:'Gratis',pl_m:'Premium Mensual',pl_t:'Premium Trimestral',pl_a:'Premium Anual',pl_best:'MEJOR PRECIO',
  pl_per_m:'por mes',pl_per_t:'cada 3 meses',pl_per_a:'por año',pl_save:'Ahorre {n}% frente al mensual',pl_eq:'equivale a {v} por mes',
  pl_go_free:'Continuar gratis',pl_go_m:'Elegir Premium Mensual',pl_go_t:'Elegir Premium Trimestral',pl_go_a:'Elegir Premium Anual',
  pl_f1:'Hasta {n} sermones',pl_f2:'Editor y Agenda completos',pl_f7:'Biblia: Reina-Valera 1909 y Bíblia Livre',pl_f3:'Modo Predicar básico',pl_f4:'Diccionarios: {n} artículos completos por día',pl_f5:'{n} curiosidades bíblicas',pl_f6:'Favoritos e historial',
  pl_p1:'Sermones sin límite',pl_p8:'Grabación de audio sin límite, dictado por voz y video con teleprompter',pl_p2:'Diccionarios Bíblico, Hebreo, Arameo y Griego completos',pl_p3:'Todas las curiosidades bíblicas',pl_p4:'Modo Predicar avanzado: traducción ES/PT, desplazamiento automático y grabación',pl_p5:'Series de sermones, todos los modelos de PDF y versículos relacionados completos',pl_p6:'Todo lo del plan gratis',pl_p7:'Las 10 versiones de la Biblia y la comparación completa',
  pl_cond:'Condiciones: el acceso dura el período pagado. Por ahora la renovación no es automática: antes del vencimiento le avisamos para renovar. Si no renueva, vuelve al plan gratis y conserva todos sus sermones.',
  pl_pay_t:'Contratar {p}',pl_pay_d:'Envíe un mensaje al administrador para pagar por transferencia, Pix o billetera. Cuando el administrador confirme el pago, su cuenta pasa a Premium.',pl_pay_wa:'Enviar mensaje por WhatsApp',pl_pay_mail:'Enviar correo',pl_pay_msg:'Hola, quiero contratar {p} de Meu Púlpito ({v}). Mi cuenta: {e}',
  pl_test:'Período de pruebas: todas las funciones están liberadas.',pl_lock_s:'El plan gratis permite hasta {n} sermones. Sus sermones no se pierden; para crear más, pase a Premium.',pl_lock_d:'El plan gratis permite {n} artículos completos por día en los diccionarios. Mañana se liberan de nuevo, o pase a Premium.',pl_lock_c:'Esta curiosidad es del plan Premium.',pl_lock_p:'Esta función del Modo Predicar es del plan Premium.',pl_see:'Ver planes',
  sub_t:'Mi suscripción',sub_plan:'Plan actual',sub_state:'Estado',sub_on:'Activa',sub_exp:'Vencida',sub_freeS:'Gratis',sub_since:'Contratado el',sub_until:'Vence el',sub_pays:'Pagos',sub_nopay:'Sin pagos registrados.',sub_change:'Cambiar de plan',sub_cancel:'Cancelar renovación',sub_cancel_d:'Su plan no se renueva solo: no hay nada que cancelar. Al vencer, vuelve al plan gratis y conserva sus datos.',sub_left:'{n} días restantes',
  ad_plan:'Plan',ad_cfg:'Precios y pruebas',ad_cfg_d:'Precios, límites del plan gratis, contacto y período de pruebas',ad_test:'Todo liberado para todos (período de pruebas)',ad_wa:'WhatsApp para pagos (con código de país)',ad_save:'Guardar',ad_saved:'Guardado',ad_setp:'Plan de {u}',ad_from:'Desde',ad_to:'Hasta',ad_amt:'Monto pagado',ad_note:'Nota (ej.: transferencia Itaú)',ad_act:'Activar',ad_free:'Pasar a gratis',ad_cnt:'{f} gratis · {tr} en prueba · {p} premium · {v} vencidas',ad_lim:'Límites del plan gratis: sermones · artículos por día · curiosidades',ad_done:'Plan actualizado',ad_gate:'Acceso solo con mi liberación',ad_days:'Días de aviso antes del vencimiento · días de gracia después',ad_soon:'Vence el {d}',ad_nsoon:'{n} plan(es) venciendo o en período de gracia: hable con ellos para renovar.',pv_renew:'Renovar',pv_soon:'Su plan Premium vence en {n} días',pv_today:'Su plan Premium vence hoy',pv_soon_d:'Vence el {d}. Renueve para seguir con todas las funciones.',pv_exp:'Su plan venció el {d}',pv_grace:'Le quedan {n} día(s) de gracia con Premium. Después vuelve al plan gratis; sus sermones no se pierden.',pv_free:'Volvió al plan gratis',pv_free_d:'Su Premium terminó. Sus sermones están todos guardados. Renueve cuando quiera para liberar todo de nuevo.',sub_grace:'En período de gracia',ad_gate_d:'Quien cree una cuenta queda esperando hasta que usted la libere en este panel.',ad_gate_on:'Acceso con liberación',ad_pend:'Esperando liberación',ad_npend:'{n} cuenta(s) esperando liberación. Toque «Activo» para liberar o «Bloqueado» para negar.',wt_t:'Su cuenta está esperando liberación',wt_d:'Meu Púlpito está en período de pruebas con acceso por invitación. Su cuenta ya fue creada; en cuanto el administrador la libere, se abre sola.',wt_acc:'Cuenta',wt_wa:'Pedir liberación por WhatsApp',wt_msg:'Hola, creé mi cuenta en Meu Púlpito y quiero pedir la liberación. Mi cuenta: {e}'});
Object.assign(I18N.pt,{pl_fx:'Valores aproximados em {c}, pela cotação do dia (ExchangeRate-API). O pagamento é combinado pelo WhatsApp.',pl_choose:'Escolha seu plano',pl_terms:'Termos de uso',pl_sub:'Use o Meu Púlpito grátis ou libere todas as ferramentas com o Premium.',pl_free:'Grátis',pl_m:'Premium Mensal',pl_t:'Premium Trimestral',pl_a:'Premium Anual',pl_best:'MELHOR PREÇO',
  pl_per_m:'por mês',pl_per_t:'a cada 3 meses',pl_per_a:'por ano',pl_save:'Economize {n}% em relação ao mensal',pl_eq:'equivale a {v} por mês',
  pl_go_free:'Continuar grátis',pl_go_m:'Escolher Premium Mensal',pl_go_t:'Escolher Premium Trimestral',pl_go_a:'Escolher Premium Anual',
  pl_f1:'Até {n} sermões',pl_f2:'Editor e Agenda completos',pl_f7:'Bíblia: Bíblia Livre e Reina-Valera 1909',pl_f3:'Modo Pregar básico',pl_f4:'Dicionários: {n} artigos completos por dia',pl_f5:'{n} curiosidades bíblicas',pl_f6:'Favoritos e histórico',
  pl_p1:'Sermões sem limite',pl_p8:'Gravação de áudio sem limite, ditado por voz e vídeo com teleprompter',pl_p2:'Dicionários Bíblico, Hebraico, Aramaico e Grego completos',pl_p3:'Todas as curiosidades bíblicas',pl_p4:'Modo Pregar avançado: tradução ES/PT, rolagem automática e gravação',pl_p5:'Séries de sermões, todos os modelos de PDF e versículos relacionados completos',pl_p6:'Tudo do plano grátis',pl_p7:'As 10 versões da Bíblia e a comparação completa',
  pl_cond:'Condições: o acesso dura o período pago. Por enquanto a renovação não é automática: antes do vencimento avisamos para renovar. Se não renovar, volta ao plano grátis e mantém todos os seus sermões.',
  pl_pay_t:'Contratar {p}',pl_pay_d:'Envie uma mensagem ao administrador para pagar por Pix, transferência ou carteira. Quando o administrador confirmar o pagamento, sua conta passa a Premium.',pl_pay_wa:'Enviar mensagem no WhatsApp',pl_pay_mail:'Enviar e-mail',pl_pay_msg:'Olá, quero contratar o {p} do Meu Púlpito ({v}). Minha conta: {e}',
  pl_test:'Período de testes: todas as funções estão liberadas.',pl_lock_s:'O plano grátis permite até {n} sermões. Seus sermões não se perdem; para criar mais, passe para o Premium.',pl_lock_d:'O plano grátis permite {n} artigos completos por dia nos dicionários. Amanhã libera de novo, ou passe para o Premium.',pl_lock_c:'Esta curiosidade é do plano Premium.',pl_lock_p:'Esta função do Modo Pregar é do plano Premium.',pl_see:'Ver planos',
  sub_t:'Minha assinatura',sub_plan:'Plano atual',sub_state:'Situação',sub_on:'Ativa',sub_exp:'Vencida',sub_freeS:'Grátis',sub_since:'Contratado em',sub_until:'Vence em',sub_pays:'Pagamentos',sub_nopay:'Nenhum pagamento registrado.',sub_change:'Mudar de plano',sub_cancel:'Cancelar renovação',sub_cancel_d:'Seu plano não renova sozinho: não há nada para cancelar. Ao vencer, volta ao plano grátis e mantém seus dados.',sub_left:'{n} dias restantes',
  ad_plan:'Plano',ad_cfg:'Preços e testes',ad_cfg_d:'Preços, limites do plano grátis, contato e período de testes',ad_test:'Tudo liberado para todos (período de testes)',ad_wa:'WhatsApp para pagamentos (com código do país)',ad_save:'Salvar',ad_saved:'Salvo',ad_setp:'Plano de {u}',ad_from:'De',ad_to:'Até',ad_amt:'Valor pago',ad_note:'Nota (ex.: Pix, transferência Itaú)',ad_act:'Ativar',ad_free:'Passar para grátis',ad_cnt:'{f} grátis · {tr} em teste · {p} premium · {v} vencidas',ad_lim:'Limites do plano grátis: sermões · artigos por dia · curiosidades',ad_done:'Plano atualizado',ad_gate:'Acesso só com a minha liberação',ad_days:'Dias de aviso antes do vencimento · dias de carência depois',ad_soon:'Vence em {d}',ad_nsoon:'{n} plano(s) vencendo ou em carência: fale com eles para renovar.',pv_renew:'Renovar',pv_soon:'Seu plano Premium vence em {n} dias',pv_today:'Seu plano Premium vence hoje',pv_soon_d:'Vence em {d}. Renove para continuar com todas as funções.',pv_exp:'Seu plano venceu em {d}',pv_grace:'Você ainda tem {n} dia(s) de carência com Premium. Depois volta ao plano grátis; seus sermões não se perdem.',pv_free:'Voltou ao plano grátis',pv_free_d:'Seu Premium terminou. Seus sermões estão todos guardados. Renove quando quiser para liberar tudo de novo.',sub_grace:'Em carência',ad_gate_d:'Quem criar uma conta fica aguardando até você liberar neste painel.',ad_gate_on:'Acesso com liberação',ad_pend:'Aguardando liberação',ad_npend:'{n} conta(s) aguardando liberação. Toque em «Ativo» para liberar ou «Bloqueado» para negar.',wt_t:'Sua conta está aguardando liberação',wt_d:'O Meu Púlpito está em período de testes com acesso por convite. Sua conta já foi criada; assim que o administrador liberar, o app abre sozinho.',wt_acc:'Conta',wt_wa:'Pedir liberação no WhatsApp',wt_msg:'Olá, criei minha conta no Meu Púlpito e quero pedir a liberação. Minha conta: {e}'});
const planName=k=>t(k==='free'?'pl_free':'pl_'+k);
const MC=window.MP_CUR||{code:()=>'',fixed:()=>true,local:()=>null,load:cb=>cb&&cb(),fmt:(v,c)=>c+' '+v,name:c=>c};
const curOrder=()=>{const c=MC.code();return c==='BRL'?['brl','pyg']:c==='PYG'?['pyg','brl']:prefs.ui==='pt'?['brl','pyg']:['pyg','brl']};
// precio aproximado en la moneda del país (fuera de Paraguay y Brasil)
const locMoney=pyg=>{const x=MC.local(pyg);return x?'≈ '+MC.fmt(x.v,x.c,prefs.ui):''};
function priceLine(k){const c=curOrder()[0];return locMoney(PCFG.p[k].pyg)||money(PCFG.p[k][c],c)}
function planSave(k){const m=PCFG.p[/i$/.test(k)?'mi':'m'],x=PCFG.p[k];const c=curOrder()[0];return Math.round((1-x[c]/(m[c]*PMON[k]))*100)}
/* pantalla «Elija su plan» */
function plansSheet(reason,retried){if(!retried&&!MC.fixed()&&!MC.local(1e5)){let done=0;const go=()=>{if(!done){done=1;plansSheet(reason,true)}};MC.load(go);setTimeout(go,2500);return}
  const N=planNow();const F=PCFG.free;const c=curOrder()[0];const fx=!!MC.local(1e5);
  const feat=a=>`<ul class="pl-f">${a.map(x=>`<li>${ic('check')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const card=k=>{const x=PCFG.p[k];const sv=PMON[k]===1?0:planSave(k);const cur=N.paid&&N.plan===k;
    return`<div class="pl-card ${k==='a'?'best':''}">${k==='a'?`<span class="pl-badge">${esc(t('pl_best'))}</span>`:''}
      <div class="pl-h"><b>${esc(planName(k))}</b>${cur?`<span class="tag ok">${esc(t('sub_on'))}</span>`:''}</div>
      ${fx?`<div class="pl-price">${esc(locMoney(x.pyg))} <small>${esc(t('pl_per_'+k))}</small></div>
      ${PMON[k]>1?`<span class="sub">${esc(t('pl_eq',{v:locMoney(x.pyg/PMON[k])}))}</span>`:''}`
      :`<div class="pl-price">${esc(money(x[c],c))} <small>${esc(t('pl_per_'+k))}</small></div>
      ${PMON[k]>1?`<span class="sub">${esc(t('pl_eq',{v:money(Math.round(x[c]/PMON[k]),c)}))}</span>`:''}`}
      ${sv>0?`<span class="pl-save">${esc(t('pl_save',{n:sv}))}</span>`:''}
      ${rolDisc()?`<span class="pl-save rl-tag">${esc(t('rl_card',{p:rolDisc(),v:fx?locMoney(rolPrice(x.pyg,'pyg',rolDisc())):money(rolPrice(x[c],c,rolDisc()),c)}))}</span>`:''}
      ${k==='mi'?feat([t('pl_i0'),t('ig_f10'),t('ig_f11'),t('ig_f1'),t('ig_f2'),t('ig_f3'),t('ig_f4'),t('ig_f6'),t('ig_f7'),t('ig_f8'),t('ig_f9'),t('ig_f5')]):''}${k==='m'?feat([t('pl_p1'),t('pl_p7'),t('pl_p2'),t('pl_p3'),t('pl_p4'),t('pl_p8'),t('pl_p5'),t('pl_p6')]):''}
      <button class="btn ${k==='a'?'gold':'dark'} block" data-pl-go="${k}">${esc(t('pl_go_'+k))}</button></div>`};
  const sh=openSheet(`<div class="pl-wrap"><div class="between"><h3 class="pl-t">${esc(t('pl_choose'))}</h3><button class="iconbtn" data-pl-x aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    ${reason?`<p class="pl-why">${esc(reason)}</p>`:`<p class="sub" style="margin:0;font-size:14.5px">${esc(t('pl_sub'))}</p>`}
    ${meta.refBy&&!ROL&&!planNow().pays.length&&authU&&!localMode?`<button class="pk-card" data-pl-rl>${ic('star')}<span><b>${esc(t('rl_t'))}</b><span>${esc(t('rl_d'))}</span></span></button>`:''}
    ${rolDisc()?`<p class="pl-testn">${ic('check')}${esc(t('rl_have',{p:rolDisc()}))}</p>`:''}
    ${N.test?`<p class="pl-testn">${ic('check')}${esc(t('pl_test'))}</p>`:N.trial?`<p class="pl-testn">${ic('check')}${esc(t('tr_on',{d:fmtDay(N.trialEnd)}))}</p>`:''}
    ${!N.paid&&!N.trial&&!N.trialEnd&&!N.test&&PCFG.wa?`<a class="btn ghost block" href="https://wa.me/${esc(String(PCFG.wa).replace(/\D/g,''))}?text=${encodeURIComponent(t('tr_ask_msg',{e:(authU&&authU.email)||''}))}" target="_blank" rel="noopener">${ic('chat')}${esc(t('tr_ask'))}</a>`:''}
    <div class="pl-grid">
    <div class="pl-card"><div class="pl-h"><b>${esc(t('pl_free'))}</b>${!N.paid?`<span class="tag">${esc(t('sub_plan'))}</span>`:''}</div><div class="pl-price">${esc(fx?MC.fmt(0,MC.code(),prefs.ui):money(0,c))}</div>
      ${feat([t('pl_f1',{n:F.serm}),t('pl_f7'),t('pl_f2'),t('pl_f3'),t('pl_f4',{n:F.dic}),t('pl_f5',{n:F.cur}),t('pl_f6')])}
      <button class="btn ghost block" data-pl-x>${esc(t('pl_go_free'))}</button></div>
    ${card('m')}${card('t')}${card('a')}</div>
    <div class="pl-sec"><span class="prem">${esc(t('ig_pl').toUpperCase())}</span><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('pl_i_d'))}</p></div>
    <div class="pl-grid">${card('mi')}${card('ti')}${card('ai')}</div>
    ${fx?`<p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('pl_fx',{c:MC.name(MC.code(),prefs.ui)}))}</p>`:''}
    <p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('pl_cond'))} <a href="/legal.html#terminos" target="_blank" rel="noopener" style="text-decoration:underline">${esc(t('pl_terms'))}</a></p></div>`,{cls:'tall'});
  sh.addEventListener('click',e=>{if(e.target.closest('[data-pl-x]')){closeSheet();return}if(e.target.closest('[data-pl-rl]')){closeSheet();rolSheet();return}const b=e.target.closest('[data-pl-go]');if(b)planContact(b.dataset.plGo)})}
/* ---------- Formas de pago (datos que el administrador carga en el panel) ---------- */
function payCfg(){const P=PCFG.pay||{};const bk=P.bk||{},pix=P.pix||{},card=P.card||{};
  const tg=P.tigo||{};const okImg=u=>/^data:image\/(png|jpeg|webp);base64,/.test(u||'')&&u.length<200000;const Q=PAYQR||{};
  return{bk:(bk.alias||bk.acc||bk.doc)?bk:null,pix:pix.key?pix:null,tigo:tg.num?tg:null,qrPy:okImg(Q.py)?Q.py:'',qrBr:okImg(Q.br)?Q.br:'',card:['m','t','a'].some(k=>/^https:\/\//.test(card[k]||''))?card:null}}
let PAY_CTRY=null,PAYQR=null;function payQrLoad(cb){if((PAYQR&&(PAYQR.py||PAYQR.br||Date.now()-(PAYQR._t||0)<60000))||localMode){cb();return}PAYQR=null;let done=0;const go=()=>{if(!done){done=1;cb()}};try{firebase.firestore().collection('config').doc('payqr').get().then(d=>{PAYQR=Object.assign({_t:Date.now()},d.exists?d.data():{});go()}).catch(()=>{PAYQR={_t:Date.now()};go()})}catch(e){PAYQR={_t:Date.now()};go()}setTimeout(()=>{if(!PAYQR)PAYQR={_t:Date.now()};go()},4000)}function payCtry(){if(PAY_CTRY)return PAY_CTRY;const c=MC.code();return c==='BRL'?'br':c==='PYG'?'py':(prefs.ui==='pt'?'br':'py')}
/* ---------- Segunda tela do Modo Pregar (tablet/TV acompanha o celular) ---------- */
let CAST={on:false,t:0,un:null,view:false};
function castDoc(){try{if(!authU||localMode)return null;return firebase.firestore().collection('pulpito').doc(authU.uid).collection('tela').doc('cur')}catch(e){return null}}
function castPush(force){if(!CAST.on||!PG||CAST.view)return;const now=Date.now();if(!force&&now-CAST.t<250){clearTimeout(CAST._t);CAST._t=setTimeout(()=>castPush(true),260);return}CAST.t=now;const sc=$('#pgScroll');if(!sc)return;const max=Math.max(1,sc.scrollHeight-sc.clientHeight);const d=castDoc();if(!d)return;
  d.set({id:PG.s.id,lang:PG.lang,r:Math.min(1,sc.scrollTop/max),fs:prefs.p.fs,font:prefs.p.font,bg:prefs.p.bg,outline:!!prefs.p.outline,at:now}).catch(()=>{})}
function castStart(){if(!isPremium()){planGate('preg');return}const d=castDoc();if(!d){toast(t('pb_need_acc'));return}CAST.on=true;castPush(true);toast(t('cs_on_t'))}
function castStop(){CAST.on=false;const d=castDoc();if(d)d.set({id:null,at:Date.now()}).catch(()=>{})}
function castView(){const d=castDoc();if(!d){toast(t('pb_need_acc'));return}if(!isPremium()){planGate('preg');return}closeSheet();if(E)closeEditor();
  const w=document.createElement('div');w.className='pg negro';w.id='castWait';w.innerHTML=`<div class="pg-top"><button class="iconbtn" data-cast="exit" aria-label="${esc(t('cs_exit'))}">${ic('x')}</button></div><div class="pg-scroll" style="display:flex;align-items:center;justify-content:center;text-align:center;padding:24px"><div><p style="font-size:22px;font-weight:800;margin:0 0 8px">${esc(t('cs_wait'))}</p><p class="sub" style="font-size:15px;margin:0;max-width:360px">${esc(t('cs_wait_d'))}</p></div></div>`;
  document.body.appendChild(w);document.body.style.overflow='hidden';CAST.view=true;
  w.addEventListener('click',e=>{if(e.target.closest('[data-cast=exit]'))castViewStop()});
  CAST.un=d.onSnapshot(snap=>{const x=snap.exists?snap.data():null;const wait=$('#castWait');
    if(!x||!x.id||!sermons.find(s=>s.id===x.id)){if(PG&&PG.cast){closePreach()}if(wait)wait.style.display='';return}
    if(!PG||PG.s.id!==x.id||PG.lang!==x.lang){if(PG)closePreach();openPreach(x.id,{want:x.lang}).then(()=>{if(!PG)return;PG.cast=true;const el=$('#pg');if(el)el.classList.add('cast');castApply(x)});return}
    castApply(x)},()=>{})}
function castApply(x){if(!PG||!PG.cast)return;const wait=$('#castWait');if(wait)wait.style.display='none';let ch=false;['fs','font','bg','outline'].forEach(k=>{if(x[k]!=null&&prefs.p[k]!==x[k]){prefs.p[k]=x[k];ch=true}});if(ch){pgApply();if(x.outline!=null)pgRender()}
  const sc=$('#pgScroll');if(!sc)return;const max=Math.max(0,sc.scrollHeight-sc.clientHeight);const y=Math.round((+x.r||0)*max);if(Math.abs(sc.scrollTop-y)>2)sc.scrollTo({top:y,behavior:'smooth'})}
function castViewStop(){if(CAST.un){try{CAST.un()}catch(e){}CAST.un=null}CAST.view=false;const w=$('#castWait');if(w)w.remove();if(PG&&PG.cast)closePreach();document.body.style.overflow='';render()}
/* ---------- Página pública do pastor (meupulpito.com/p/#uid) ---------- */
function pubCfg(){return meta.pub||{}}
function pubUrl(){return authU?'https://meupulpito.com/p/#'+authU.uid:''}
function pubData(){const c=pubCfg();const tr=v=>String(v||'').trim();let ig={};try{if(typeof IGR!=='undefined'&&IGR&&IGR.g)ig=IGR.g.find(x=>x.id==='dados')||{}}catch(e){}
  const today=todayISO();const ev=c.ev===false?[]:agenda.filter(e=>e.date>=today).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))).slice(0,6).map(e=>({d:e.date,t:e.time||'',p:e.place==='otro'?tr(e.placeName).slice(0,60):(e.place||''),n:c.theme&&e.theme?tr(e.theme).slice(0,80):''}));
  const R=meta.rp&&meta.rp.k&&c.rp!==false?{k:meta.rp.k,start:meta.rp.start}:null;
  return{on:!!c.on,n:tr(meta.name).slice(0,80),ch:tr(c.ch||ig.n).slice(0,80),city:tr(c.city||ig.cid).slice(0,60),msg:tr(c.msg).slice(0,300),wa:c.wa===false?'':String(meta.wa||'').replace(/\D/g,'').slice(0,20),ig:tr(c.ig).replace(/^@/,'').slice(0,40),ev,lang:prefs.ui==='pt'?'pt':'es',photo:(meta.photo&&meta.photo.length<90000)?meta.photo:'',rp:R,upd:Date.now()}}
function pubSync(force){if(!authU||localMode)return Promise.resolve();const d=pubData();if(!d.on&&!force&&!pubSync._was)return Promise.resolve();const sig=JSON.stringify(Object.assign({},d,{upd:0}));if(!force&&sig===pubSync._sig)return Promise.resolve();pubSync._sig=sig;pubSync._was=d.on;
  try{return firebase.firestore().collection('pub').doc(authU.uid).set(d).catch(()=>{})}catch(e){return Promise.resolve()}}
function pubTouch(){clearTimeout(pubTouch._t);pubTouch._t=setTimeout(()=>{if(pubCfg().on)pubSync()},4000)}
function pubSheet(){if(!authU||localMode){toast(t('pb_need_acc'));return}const c=Object.assign({on:false,ev:true,theme:false,wa:true,rp:true,ch:'',city:'',msg:'',ig:''},pubCfg());const url=pubUrl();
  const chk=(id,lb,on)=>`<label class="row" style="gap:10px;align-items:flex-start"><input type="checkbox" id="${id}" ${on?'checked':''} style="width:22px;height:22px;flex:none;margin-top:1px"><span style="font-size:14px;line-height:1.4">${esc(lb)}</span></label>`;
  const sh=openSheet(`<h3>${esc(t('pb_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('pb_d'))}</p>
    <div class="pk-card" style="cursor:default"><label class="row" style="gap:10px;align-items:flex-start;width:100%"><input type="checkbox" id="pbOn" ${c.on?'checked':''} style="width:22px;height:22px;flex:none;margin-top:1px"><span style="display:flex;flex-direction:column;gap:2px"><b>${esc(t('pb_sw'))}</b><span class="s">${esc(t('pb_sw_d'))}</span></span></label></div>
    <label class="s">${esc(t('pb_ch'))}<input class="inp" id="pbCh" value="${esc(c.ch)}" autocomplete="off"></label>
    <label class="s">${esc(t('pb_city'))}<input class="inp" id="pbCity" value="${esc(c.city)}" autocomplete="off"></label>
    <label class="s">${esc(t('pb_msg'))}<textarea class="inp" id="pbMsg" rows="2" maxlength="300" placeholder="${esc(t('pb_msg_ph'))}">${esc(c.msg)}</textarea></label>
    <label class="s">${esc(t('pb_ign'))}<input class="inp" id="pbIg" value="${esc(c.ig)}" placeholder="@" autocomplete="off" autocapitalize="off"></label>
    ${chk('pbEv',t('pb_ev'),c.ev!==false)}${chk('pbTh',t('pb_theme'),!!c.theme)}${chk('pbWa',t('pb_wa'),c.wa!==false)}${chk('pbRp',t('pb_rp'),c.rp!==false)}
    ${meta.wa?'':`<p class="sub" style="margin:0;font-size:12.5px">${esc(t('pb_need_wa'))}</p>`}
    <div class="pk-card" style="cursor:default;flex-direction:column;align-items:stretch;gap:8px"><span class="s">${esc(t('pb_link'))}</span><b style="overflow-wrap:anywhere;user-select:all;-webkit-user-select:all">${esc(url)}</b>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-pb="copy">${ic('copy')}${esc(t('pb_copy'))}</button><button class="btn sm ghost" data-pb="share">${ic('share')}${esc(t('pb_share'))}</button><a class="btn sm ghost" href="${esc(url)}" target="_blank" rel="noopener">${esc(t('pb_open'))}</a></div></div>
    <button class="btn gold block" data-pb="save">${ic('check')}${esc(t('save'))}</button>`,{cls:'tall'});
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pb]');if(!b)return;const a=b.dataset.pb;
    if(a==='copy'){copyText(url).then(()=>toast(t('copied')));return}
    if(a==='share'){const txt=t('pb_share_msg',{u:url});if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')));return}
    if(a==='save'){const g=id=>$('#'+id,sh);meta.pub={on:g('pbOn').checked,ch:g('pbCh').value.trim(),city:g('pbCity').value.trim(),msg:g('pbMsg').value.trim(),ig:g('pbIg').value.trim(),ev:g('pbEv').checked,theme:g('pbTh').checked,wa:g('pbWa').checked,rp:g('pbRp').checked};putMeta();b.disabled=true;
      pubSync(true).then(()=>{closeSheet();toast(meta.pub.on?t('pb_saved'):t('pb_off'));render()})}})}
/* ============ Projeção e sala de reunião ============ */
function igGate(){if(planNow().igreja)return true;const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('lock')}</span><span class="prem">${esc(t('ig_pl').toUpperCase())}</span><h3>${esc(t('ig_lock_t'))}</h3><p>${esc(t('ig_lock_d'))}</p>
    <button class="btn gold block" id="pkGo">${esc(t('pk_go'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('pk_no'))}</button></div>`);$('#pkGo',sh).onclick=()=>{closeSheet();plansSheet()};return false}
function pjT(p,ms){return Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej({code:'timeout'}),ms||12000))])}
function projCfg(){return meta.proj||{}}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function projAccSave(email,pw){const em=String(email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))throw{code:'email'};if(String(pw||'').length<6)throw{code:'pw'};
  const d=await projEnsure();if(!d)throw{code:'acc'};const key=(await sha('mp:'+em)).slice(0,40);const h=await sha(key+':'+pw);const db=firebase.firestore();
  const old=(meta.proj||{}).acck;await db.collection('projacc').doc(key).set({uid:authU.uid,pid:projCfg().pid,h,at:Date.now()});
  if(old&&old!==key)db.collection('projacc').doc(old).delete().catch(()=>{});meta.proj=Object.assign({},meta.proj,{acck:key,acce:em});putMeta()}
function projCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';const r=new Uint32Array(16);try{crypto.getRandomValues(r)}catch(e){for(let i=0;i<16;i++)r[i]=Math.floor(Math.random()*1e9)}for(let i=0;i<16;i++)s+=A[r[i]%A.length];return s}
function projUrl(){const c=projCfg();return c.pid?'https://meupulpito.com/projetar/#'+c.pid:''}
function projDoc(){try{const c=projCfg();if(!authU||localMode||!c.pid)return null;return firebase.firestore().collection('proj').doc(c.pid)}catch(e){return null}}
function projBase(){const c=projCfg();let ig={};try{if(typeof IGR!=='undefined'&&IGR&&IGR.g)ig=IGR.g.find(x=>x.id==='dados')||{}}catch(e){}
  return{uid:authU.uid,ig:!!planNow().igreja,ch:String(c.ch||pubCfg().ch||ig.n||'').trim().slice(0,80),sub:String(c.sub||'').trim().slice(0,80),logo:(c.logo&&c.logo.length<90000)?c.logo:'',lang:prefs.ui==='pt'?'pt':'es',at:Date.now()}}
function projEnsure(){if(!authU||localMode)return Promise.resolve(null);let c=meta.proj||{};if(!c.pid){c=Object.assign({},c,{pid:projCode()});meta.proj=c;putMeta();
    const d=projDoc();return d.set(Object.assign(projBase(),{now:{type:'logo'},cfg:{fs:1,bg:'b'}})).then(()=>d)}
  const d=projDoc();let fix={};try{fix={live:firebase.firestore.FieldValue.delete()}}catch(e){}return d.set(Object.assign(projBase(),fix),{merge:true}).then(()=>d).catch(()=>d)}
function projRenew(){const old=projDoc();const oldPid=projCfg().pid;meta.proj=Object.assign({},meta.proj,{pid:projCode()});putMeta();
  const d=projDoc();const base=Object.assign(projBase(),{now:{type:'logo'},cfg:{fs:1,bg:'b'}});
  const p=d.set(base).then(()=>{if(!old)return;return old.collection('itens').get().then(s=>Promise.all(s.docs.map(x=>d.collection('itens').doc(x.id).set(x.data()).then(()=>x.ref.delete().catch(()=>{}))))).then(()=>old.delete().catch(()=>{}))}).catch(()=>{});
  if(pubCfg().on)pubSync(true);return p}
function projSheet(){if(!authU||localMode){toast(t('pb_need_acc'));return}if(!igGate())return;const IG=true;const c=projCfg();
  const sh=openSheet(`<h3>${esc(t('pj_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('pj_d_ig'))}</p>
    <div class="pk-card" style="cursor:default;flex-direction:column;align-items:stretch;gap:8px" id="pjBox"><b>${esc(t('pj_acc'))}</b><span class="s">${esc(t('pj_acc_d'))}</span>
      <label class="s">${esc(t('pj_email'))}<input class="inp" id="pjEm" type="email" inputmode="email" autocapitalize="off" autocomplete="off" value="${esc(c.acce||authU.email||'')}"></label>
      <label class="s">${esc(t('pj_pw'))}<input class="inp" id="pjPw" type="text" autocapitalize="off" autocomplete="off" placeholder="${esc(c.acck?t('pj_pw_set'):t('pj_pw_ph'))}"></label>
      <button class="btn sm gold" data-pj="acc" style="align-self:flex-start">${esc(c.acck?t('pj_acc_upd'):t('pj_acc_save'))}</button>
      <span class="s" style="overflow-wrap:anywhere;user-select:all;-webkit-user-select:all">meupulpito.com/projetar</span>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-pj="copy">${ic('copy')}${esc(t('pb_copy'))}</button><button class="btn sm ghost" data-pj="share">${ic('share')}${esc(t('pb_share'))}</button><a class="btn sm ghost" data-ext="1" href="${esc(projUrl()||'#')}" id="pjOpen" target="_blank" rel="noopener">${esc(t('pj_open'))}</a></div>
      <p class="sub" style="margin:0;font-size:12.5px">${esc(t('pj_how'))}</p></div>
    ${IG?`<label class="s">${esc(t('pj_ch'))}<input class="inp" id="pjCh" value="${esc(c.ch||pubCfg().ch||'')}" autocomplete="off"></label>
    <label class="s">${esc(t('pj_sub'))}<input class="inp" id="pjSub" value="${esc(c.sub||'')}" autocomplete="off" placeholder="${esc(t('pj_sub_ph'))}"></label>
    <div class="row" style="gap:10px;align-items:center"><img id="pjLogo" src="${esc(c.logo||'')}" alt="" style="width:56px;height:56px;object-fit:contain;border-radius:12px;background:#0B1220;${c.logo?'':'display:none'}"><label class="btn sm ghost" style="cursor:pointer">${ic('img')}${esc(c.logo?t('pj_logo_ch'):t('pj_logo'))}<input type="file" accept="image/*" id="pjLogoF" hidden></label>${c.logo?`<button class="btn sm ghost" data-pj="nologo">${esc(t('pj_logo_rm'))}</button>`:''}</div>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('pj_tela_d'))}</p>`:''}
    ${IG?`<div class="pk-card" style="cursor:default;flex-direction:column;align-items:stretch;gap:6px"><b>${esc(t('sl_t'))}</b><span class="s">${esc(t('sl_d'))}</span><button class="btn sm ghost" data-act="salaSheet" style="align-self:flex-start">${ic('group')}${esc(t('sl_open'))}</button></div>`:''}
    <button class="btn gold block" data-pj="save">${ic('check')}${esc(t('save'))}</button>
`,{cls:'tall'});
  const fill=()=>{const u=projUrl();$('#pjOpen',sh).href=u||'#'};
  if(!c.pid)projEnsure().then(fill).catch(e=>toast(t('pj_off')+(e&&e.code?' ('+e.code+')':'')));
  const lf=$('#pjLogoF',sh);if(lf)lf.onchange=()=>{const f=lf.files[0];if(!f)return;const img=new Image(),u=URL.createObjectURL(f);img.onload=()=>{const M=320,r=Math.min(1,M/Math.max(img.width,img.height));const cv=document.createElement('canvas');cv.width=Math.round(img.width*r);cv.height=Math.round(img.height*r);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);let d=cv.toDataURL('image/png');if(d.length>85000)d=cv.toDataURL('image/jpeg',.8);URL.revokeObjectURL(u);if(d.length>85000){toast(t('pj_logo_big'));return}meta.proj=Object.assign({},meta.proj,{logo:d});putMeta();const im=$('#pjLogo',sh);im.src=d;im.style.display=''};img.src=u};
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pj]');if(!b)return;const a=b.dataset.pj;const u=projUrl();
    if(a==='acc'){const em=$('#pjEm',sh).value,pw=$('#pjPw',sh).value;if(!pw&&c.acck){toast(t('pj_pw_need'));return}b.disabled=true;pjT(projAccSave(em,pw)).then(()=>{toast(t('pj_acc_ok'));closeSheet();projSheet()}).catch(e=>{b.disabled=false;toast(e&&e.code==='email'?t('pj_bad_email'):e&&e.code==='pw'?t('pj_bad_pw'):t('pj_off')+(e&&e.code?' ('+e.code+')':''))});return}
    if(a==='copy'){copyText(t('pj_share_msg',{e:c.acce||''})).then(()=>toast(t('copied')));return}
    if(a==='share'){const txt=t('pj_share_msg',{e:c.acce||''});if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')));return}
    if(a==='nologo'){meta.proj=Object.assign({},meta.proj,{logo:''});putMeta();const im=$('#pjLogo',sh);im.src='';im.style.display='none';return}
    if(a==='save'){const g=id=>$('#'+id,sh);if(IG){meta.proj=Object.assign({},meta.proj,{ch:g('pjCh').value.trim(),sub:g('pjSub').value.trim()});putMeta()}b.disabled=true;pjT(projEnsure()).then(()=>{closeSheet();toast(t('saved'));render()}).catch(e=>{b.disabled=false;toast(t('pj_off')+(e&&e.code?' ('+e.code+')':''))})}})}
/* --- enviar o sermão (só título, texto base e pontos) para a projeção --- */
function projPoints(s){const d=docOf(s);const dv=derive(s);const pts=[];$$('h2',d).forEach(h=>{if(secOf(h.textContent))return;let v='';let n=h.nextElementSibling;for(let i=0;i<3&&n&&!/^H[12]$/.test(n.tagName);i++,n=n.nextElementSibling){const bq=n.matches&&n.matches('blockquote[data-ref]')?n:n.querySelector&&n.querySelector('blockquote[data-ref]');if(bq){v=bq.getAttribute('data-ref');break}}
    pts.push({t:h.textContent.trim().slice(0,200),v:String(v||'').slice(0,60)})});return{n:(dv.title||t('untitled')).slice(0,120),v:String(dv.passage||'').slice(0,60),pts:pts.slice(0,40)}}
function projSendSermon(id){const s=sermons.find(x=>x.id===id);if(!s)return;if(!authU||localMode){toast(t('pb_need_acc'));return}if(!igGate())return;
  const p=projPoints(s);projEnsure().then(d=>{if(!d)throw 0;return d.collection('itens').doc(id).set({t:'sermao',n:p.n,v:p.v,pts:p.pts,at:Date.now()})}).then(()=>{closeSheet();toast(t('pj_sent',{n:p.pts.length}))}).catch(e=>toast(t('pj_off')+(e&&e.code?' ('+e.code+')':'')))}
/* --- sala de reunião: link + código, até 6 pessoas, direto entre os aparelhos --- */
function salaCfg(){return meta.sala||{}}
function salaUrl(){const c=salaCfg();return c.rid?'https://meupulpito.com/reuniao/#'+c.rid:''}
function salaDoc(){try{const c=salaCfg();if(!authU||localMode||!c.rid)return null;return firebase.firestore().collection('sala').doc(c.rid)}catch(e){return null}}
function salaSheet(){if(!authU||localMode){toast(t('pb_need_acc'));return}if(!igGate())return;let c=salaCfg();
  if(!c.rid){c={rid:projCode().slice(0,12),code:String(Math.floor(1000+Math.random()*9000)),on:false};meta.sala=c;putMeta()}
  const sh=openSheet(`<h3>${esc(t('sl_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('sl_d'))}</p>
    <div class="pk-card" style="cursor:default;flex-direction:column;align-items:stretch;gap:8px"><span class="s">${esc(t('pb_link'))}</span><b style="overflow-wrap:anywhere;user-select:all;-webkit-user-select:all">${esc(salaUrl())}</b><span class="s">${esc(t('sl_code'))}</span><b id="slCode" style="letter-spacing:.2em;font-size:22px">${esc(c.code)}</b>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-sl="copy">${ic('copy')}${esc(t('pb_copy'))}</button><button class="btn sm ghost" data-sl="share">${ic('share')}${esc(t('pb_share'))}</button><button class="btn sm ghost" data-sl="newcode">${esc(t('sl_newcode'))}</button></div></div>
    <label class="s">${esc(t('sl_name'))}<input class="inp" id="slN" value="${esc(c.n||meta.name||'')}" autocomplete="off" maxlength="40"></label>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('sl_how'))}</p><p class="sub" style="margin:0;font-size:12.5px">${esc(t('sl_lim'))}</p>
    ${c.on?`<p class="sub" style="margin:0;font-weight:700;color:var(--gold)">${esc(t('sl_on'))}</p><a class="btn gold block" data-ext="1" href="${esc(salaUrl())}" target="_blank" rel="noopener">${esc(t('sl_enter'))}</a><button class="btn ghost block" data-sl="off">${esc(t('sl_off'))}</button>`:`<button class="btn gold block" data-sl="on">${esc(t('sl_start'))}</button>`}`,{cls:'tall'});
  const save=on=>{const prev=salaCfg();const n=$('#slN',sh).value.trim().slice(0,40);c=Object.assign({},prev,{n,on});meta.sala=c;putMeta();const d=salaDoc();if(!d)return Promise.resolve();return d.set({uid:authU.uid,code:c.code,n,on,max:6,at:Date.now()}).catch(e=>{meta.sala=prev;c=prev;putMeta();throw e})};
  if(c.on){const d=salaDoc();if(d)d.set({uid:authU.uid,code:c.code,n:c.n||'',on:true,max:6,at:Date.now()}).catch(()=>{meta.sala=Object.assign({},c,{on:false});putMeta();closeSheet();salaSheet()})}
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-sl]');if(!b)return;const a=b.dataset.sl;
    if(a==='copy'){copyText(t('sl_share_msg',{u:salaUrl(),c:c.code})).then(()=>toast(t('copied')));return}
    if(a==='share'){const txt=t('sl_share_msg',{u:salaUrl(),c:c.code});if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')));return}
    if(a==='newcode'){c=Object.assign({},salaCfg(),{code:String(Math.floor(1000+Math.random()*9000))});meta.sala=c;putMeta();$('#slCode',sh).textContent=c.code;if(c.on)save(true);return}
    b.disabled=true;pjT(save(a==='on')).then(()=>{closeSheet();if(a==='on'){toast(t('sl_on'));salaSheet()}else toast(t('sl_ended'))}).catch(e=>{b.disabled=false;toast(t('pj_off')+(e&&e.code?' ('+e.code+')':''))})})}
Object.assign(I18N.es,{pj_t:'Proyección y reunión',pj_home:'Pantalla para el culto y sala de reunión',pj_d_ig:'Un acceso (correo y contraseña) para el equipo de medios: desde su propio celular o la computadora, proyectan Biblia, himnos, imágenes, avisos y los puntos del sermón. Sin la contraseña del pastor.',pj_acc:'Acceso del equipo de medios',pj_acc_d:'Cree un correo y una contraseña para el equipo. Con ellos entran en meupulpito.com/projetar, en la computadora o en el celular, sin su contraseña del app.',pj_email:'Correo de acceso',pj_pw:'Contraseña del equipo (mínimo 6)',pj_pw_ph:'Elija una contraseña',pj_pw_set:'Ya definida · escriba una nueva para cambiarla',pj_acc_save:'Guardar acceso',pj_acc_upd:'Actualizar acceso',pj_acc_ok:'Acceso guardado',pj_pw_need:'Escriba la contraseña nueva.',pj_bad_email:'Revise el correo.',pj_bad_pw:'La contraseña debe tener al menos 6 caracteres.',pj_open:'Abrir el panel',pj_how:'En la computadora conectada al proyector (o en el navegador de la TV), entre con ese correo y contraseña y abra «Pantalla». En el celular del equipo, entre con los mismos datos: es el control.',pj_ch:'Nombre de la iglesia (aparece en la pantalla)',pj_sub:'Línea de abajo (opcional)',pj_sub_ph:'Ej.: Bienvenidos',pj_logo:'Logo de la iglesia',pj_logo_ch:'Cambiar logo',pj_logo_big:'Logo muy grande; use una imagen menor.',pj_tela_d:'La pantalla muestra el logo y el nombre cuando no hay nada proyectado.',pj_share_msg:'Panel de proyección de nuestra iglesia (Meu Púlpito): meupulpito.com/projetar · correo: {e} · la contraseña se la paso aparte',pj_send:'Enviar a la proyección',pj_sent:'Sermón enviado a la proyección ({n} puntos)',
  sl_t:'Sala de reunión',sl_d:'Reunión por video con hasta 6 personas: líderes, obreros o pastores. Enlace y código; funciona en el celular o la computadora, sin instalar nada.',sl_code:'Código de entrada',sl_name:'Su nombre en la reunión',sl_how:'Envíe el enlace y el código. Cada persona abre el enlace, escribe el código y su nombre, y entra con cámara y micrófono.',sl_lim:'La conexión es directa entre los aparatos. En algunas redes de empresa o con datos móviles muy restringidos, un participante puede no conectar.',sl_start:'Abrir la sala',sl_enter:'Entrar en la reunión',sl_off:'Cerrar la sala',sl_on:'Sala abierta',sl_ended:'Sala cerrada',sl_open:'Abrir sala de reunión',sl_newcode:'Nuevo código',sl_share_msg:'Reunión por video (Meu Púlpito): {u}\nCódigo: {c}',pj_off:'Sin conexión. Intente de nuevo.',pj_logo_rm:'Quitar'});
Object.assign(I18N.pt,{pj_t:'Projeção e reunião',pj_home:'Tela para o culto e sala de reunião',pj_d_ig:'Um acesso (e-mail e senha) para a equipe de mídia: do próprio celular ou do computador, eles projetam Bíblia, hinos, imagens, avisos e os pontos do sermão. Sem a senha do pastor.',pj_acc:'Acesso da equipe de mídia',pj_acc_d:'Crie um e-mail e uma senha para a equipe. Com eles, entram em meupulpito.com/projetar, no computador ou no celular, sem a sua senha do app.',pj_email:'E-mail de acesso',pj_pw:'Senha da equipe (mínimo 6)',pj_pw_ph:'Escolha uma senha',pj_pw_set:'Já definida · digite uma nova para trocar',pj_acc_save:'Salvar acesso',pj_acc_upd:'Atualizar acesso',pj_acc_ok:'Acesso salvo',pj_pw_need:'Digite a senha nova.',pj_bad_email:'Confira o e-mail.',pj_bad_pw:'A senha precisa ter pelo menos 6 caracteres.',pj_open:'Abrir o painel',pj_how:'No computador ligado ao projetor (ou no navegador da TV), entre com esse e-mail e senha e abra «Tela». No celular da equipe, entre com os mesmos dados: é o controle.',pj_ch:'Nome da igreja (aparece na tela)',pj_sub:'Linha de baixo (opcional)',pj_sub_ph:'Ex.: Seja bem-vindo',pj_logo:'Logo da igreja',pj_logo_ch:'Trocar logo',pj_logo_big:'Logo muito grande; use uma imagem menor.',pj_tela_d:'A tela mostra o logo e o nome quando não há nada projetado.',pj_share_msg:'Painel de projeção da nossa igreja (Meu Púlpito): meupulpito.com/projetar · e-mail: {e} · a senha eu passo à parte',pj_send:'Enviar para a projeção',pj_sent:'Sermão enviado para a projeção ({n} pontos)',
  sl_t:'Sala de reunião',sl_d:'Reunião por vídeo com até 6 pessoas: líderes, obreiros ou pastores. Link e código; funciona no celular ou no computador, sem instalar nada.',sl_code:'Código de entrada',sl_name:'Seu nome na reunião',sl_how:'Envie o link e o código. Cada pessoa abre o link, digita o código e o nome, e entra com câmera e microfone.',sl_lim:'A conexão é direta entre os aparelhos. Em algumas redes de empresa ou com dados móveis muito restritos, um participante pode não conectar.',sl_start:'Abrir a sala',sl_enter:'Entrar na reunião',sl_off:'Fechar a sala',sl_on:'Sala aberta',sl_ended:'Sala fechada',sl_open:'Abrir sala de reunião',sl_newcode:'Novo código',sl_share_msg:'Reunião por vídeo (Meu Púlpito): {u}\nCódigo: {c}',pj_off:'Sem conexão. Tente de novo.',pj_logo_rm:'Remover'});
function payReqSend(k,m,v){if(!authU||localMode)return;const d={payReq:{plan:k,m,v,at:Date.now(),ver:APP_VER}};try{firebase.firestore().collection('stats').doc(authU.uid).set(d,{merge:true}).catch(()=>{})}catch(e){}try{ls.set('mp.payreq',d.payReq)}catch(e){}}
function copyTxt(v){try{navigator.clipboard.writeText(v).then(()=>toast(t('py_copied')),()=>toast(v))}catch(e){toast(v)}}
function planContact(k,loaded){if(!loaded&&!PAYQR)return payQrLoad(()=>planContact(k,true));const C=payCfg();if(!C.bk&&!C.pix&&!C.tigo&&!C.qrPy&&!C.qrBr&&!(C.card&&C.card[k]))return planContactWa(k);const ctry=payCtry();
  const DS=rolDisc();const x0=PCFG.p[k];const x=DS?{pyg:rolPrice(x0.pyg,'pyg',DS),brl:rolPrice(x0.brl,'brl',DS)}:x0;const cc=MC.code();const em=(authU&&authU.email)||'';const wa=String(PCFG.wa||'').replace(/\D/g,'');
  const row=(lb,v,cp)=>v?`<div class="py-r"><span>${esc(lb)}</span><b>${esc(v)}</b>${cp?`<button class="iconbtn" data-cp="${esc(typeof cp==='string'?cp:v)}" aria-label="${esc(t('copy_txt'))}">${ic('copy')}</button>`:''}</div>`:'';
  const secs=[];
  if(C.bk)secs.push(['bk',`<div class="py-c"><div class="py-h">${ic('copy')}<b>${esc(t('py_bk'))}</b><span class="py-v">${esc(money(x.pyg,'pyg'))}</span></div>
    ${row(t('py_bank'),C.bk.bank,0)}${row(t('py_holder'),C.bk.name,0)}${row(t('py_acc'),C.bk.acc,1)}${row(/^\d{6,9}-\d$/.test(C.bk.alias||'')?'Alias (RUC)':'Alias',C.bk.alias,1)}${row(t('py_doc'),C.bk.doc,1)}${row(t('py_cur'),'Guaraní (₲)',0)}${C.bk.obs?`<p class="sub" style="margin:0;font-size:13px;line-height:1.45;border-top:1px solid var(--line);padding-top:8px">${esc(C.bk.obs)}</p>`:''}</div>`]);
  if(C.tigo)secs.push(['tigo',`<div class="py-c"><div class="py-h">${ic('phone')}<b>${esc(t('py_tigo'))}</b><span class="py-v">${esc(money(x.pyg,'pyg'))}</span></div><p class="sub" style="margin:0;font-size:13px;line-height:1.45">${esc(t('py_tigo_d'))}</p>
    ${row(t('py_num'),C.tigo.num,C.tigo.num.replace(/\D/g,''))}${row(t('py_holder'),C.tigo.name,0)}${row(t('py_doc'),C.tigo.doc,1)}</div>`]);
  const qrBox=(img,v)=>`<div class="py-c"><div class="py-h">${ic('qr')}<b>${esc(t('py_qr'))}</b><span class="py-v">${esc(v)}</span></div><img class="py-qr" src="${img}" alt="QR" width="220" height="220"><p class="sub" style="margin:0;font-size:12.5px;line-height:1.45">${esc(t('py_qr_d'))}</p><a class="btn sm ghost" href="${img}" download="qr-meupulpito.png">${ic('dl')}${esc(t('py_qr_save'))}</a></div>`;
  const qp=(PAYQR&&/^data:image\/(png|jpeg|webp);base64,/.test(PAYQR['py_'+k]||'')&&PAYQR['py_'+k].length<200000)?PAYQR['py_'+k]:C.qrPy;
  if(qp)secs.push(['qrpy',qrBox(qp,money(x.pyg,'pyg'))]);
  if(C.qrBr)secs.push(['qrbr',qrBox(C.qrBr,money(x.brl,'brl'))]);
  if(C.pix)secs.push(['pix',`<div class="py-c"><div class="py-h">${ic('copy')}<b>Pix</b><span class="py-v">${esc(money(x.brl,'brl'))}</span></div>
    ${row(t('py_pixkey'),C.pix.key,/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(C.pix.key)?C.pix.key.replace(/\D/g,''):1)}${row(t('py_holder'),C.pix.name,0)}${row(t('py_bank'),C.pix.bank,0)}${row(t('py_cur'),'Real (R$)',0)}</div>`]);
  if(C.card&&/^https:\/\//.test(C.card[k]||''))secs.push(['card',`<div class="py-c"><div class="py-h">${ic('lock')}<b>${esc(t('py_card'))}</b><span class="py-v">${esc(money(x.pyg,'pyg'))}</span></div>
    <p class="sub" style="margin:0;font-size:13px">${esc(t('py_card_d'))}</p><a class="btn dark block" href="${esc(C.card[k])}" target="_blank" rel="noopener">${esc(t('py_card_go'))}</a></div>`]);
  const PY=['qrpy','bk','tigo','card'],BR=['pix','qrbr','card'];const ord=ctry==='br'?BR:PY;const shown=secs.filter(x=>ord.includes(x[0])).sort((a,b)=>ord.indexOf(a[0])-ord.indexOf(b[0]));const hasOther=secs.some(x=>!ord.includes(x[0])&&x[0]!=='card');
  const sel=`<div class="py-ctry"><span>${esc(t('py_ctry'))}</span><div class="seg"><button data-pyc="py" aria-pressed="${ctry==='py'}">${esc(t('py_py'))}</button><button data-pyc="br" aria-pressed="${ctry==='br'}">${esc(t('py_br'))}</button></div></div>`;
  const pend=ls.get('mp.payreq',null);const pendTxt=pend&&pend.plan===k&&Date.now()-pend.at<10*864e5&&!planNow().paid?`<p class="pl-testn">${ic('check')}${esc(t('py_pend',{d:fmtDay(pend.at)}))}</p>`:'';
  const pcur=ctry==='br'?'brl':'pyg';const lm=PAY_CTRY?null:locMoney(x.pyg);const vtxt=lm?lm+' ('+money(x.pyg,'pyg')+')':money(x[pcur],pcur);
  const lm0=PAY_CTRY?null:locMoney(x0.pyg);const vtxt0=lm0?lm0+' ('+money(x0.pyg,'pyg')+')':money(x0[pcur],pcur);
  const msg=t('py_sent_msg',{p:planName(k),v:vtxt+' '+(DS?t('rl_first'):t('pl_per_'+k)),e:em})+(DS?'\n'+t('rl_msg',{p:DS}):'');
  const sh=openSheet(`<h3>${esc(t('pl_pay_t',{p:planName(k)}))}</h3>${DS?`<p class="rl-old">${esc(vtxt0)}</p>`:''}<p class="pl-price" style="margin:0">${esc(vtxt)} <small>${esc(DS?t('rl_first'):t('pl_per_'+k))}</small></p>${DS?`<p class="sub" style="margin:-4px 0 0;font-size:13px">${esc(t('rl_after',{v:vtxt0+' '+t('pl_per_'+k)}))}</p>`:''}
    ${DS?`<div class="rl-pay">${ic('check')}<span><b>${esc(t('rl_pay',{p:DS,v:vtxt}))}</b><span>${esc(t('rl_pay_d'))}</span></span></div>`:''}
    <p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('py_how'))}</p>${pendTxt}${(hasOther||secs.some(x=>!ord.includes(x[0])))?sel:''}
    ${shown.length?shown.map(x=>x[1]).join(''):secs.map(x=>x[1]).join('')}${DS&&secs.some(x=>x[0]==='card')?`<p class="sub" style="margin:0;font-size:12.5px">${esc(t('rl_card_note'))}</p>`:''}
    ${wa?`<a class="btn gold block" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" data-paid="${k}">${ic('chat')}${esc(t('py_sent'))}</a>`:`<button class="btn gold block" data-paid="${k}">${ic('check')}${esc(t('py_sent'))}</button>`}
    ${wa?`<a class="btn ghost block" href="https://wa.me/${wa}?text=${encodeURIComponent(t('pl_pay_msg',{p:planName(k),v:vtxt,e:em}))}" target="_blank" rel="noopener">${esc(t('py_other'))}</a>`:''}
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('pl_cond'))}</p>`,{cls:'tall'});
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-cp]');if(b){copyTxt(b.dataset.cp);return}const c=e.target.closest('[data-pyc]');if(c){PAY_CTRY=c.dataset.pyc;closeSheet();planContact(k);return}const pd=e.target.closest('[data-paid]');if(pd){payReqSend(k,ctry,vtxt);toast(t('py_req_ok'));if(pd.tagName==='BUTTON')closeSheet()}})}
function planContactWa(k){const c=curOrder()[0];const lm=locMoney(PCFG.p[k].pyg);const v=(lm?lm+' ('+money(PCFG.p[k].pyg,'pyg')+')':money(PCFG.p[k][c],c))+' '+t('pl_per_'+k);const em=(authU&&authU.email)||'';
  const msg=t('pl_pay_msg',{p:planName(k),v,e:em});const wa=String(PCFG.wa||'').replace(/\D/g,'');
  const sh=openSheet(`<h3>${esc(t('pl_pay_t',{p:planName(k)}))}</h3><p class="pl-price" style="margin:0">${esc(v)}</p><p style="margin:0;line-height:1.5">${esc(t('pl_pay_d'))}</p>
    ${wa?`<a class="btn gold block" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ic('chat')}${esc(t('pl_pay_wa'))}</a>`:''}
    <a class="btn ${wa?'ghost':'gold'} block" href="mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Meu Púlpito · '+planName(k))}&body=${encodeURIComponent(msg)}">${esc(t('pl_pay_mail'))}</a>
    <p class="sub" style="margin:0;font-size:12.5px">${esc(t('pl_cond'))}</p>`)}
/* bloqueo con explicación (los datos nunca se tocan) */
function planGate(kind){if(isPremium())return true;const F=PCFG.free;
  const msg={sug:t('pk_sug'),man:t('pk_man'),lic:t('pk_lic'),il:t('pk_il'),serm:t('pl_lock_s',{n:F.serm}),dic:t('pl_lock_d',{n:F.dic}),cur:t('pl_lock_c'),preg:t('pl_lock_p'),rec:t('pk_rec'),aud:t('pk_aud'),vid:t('pk_vid'),ser:t('pk_ser'),pdf:t('pk_pdf'),xr:t('pk_xr'),bq:t('pk_bq'),bv:t('pk_bv')}[kind]||'';
  const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('lock')}</span><span class="prem">PREMIUM</span><h3>${esc(t('pk_t'))}</h3><p>${esc(t('pk_d'))}</p>${msg?`<p class="pk-why">${esc(msg)}</p>`:''}
    <button class="btn gold block" id="pkGo">${esc(t('pk_go'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('pk_no'))}</button></div>`);
  $('#pkGo',sh).onclick=()=>{closeSheet();plansSheet()};return false}
const premTag=()=>isPremium()?'':`<span class="prem sm">${ic('lock')}PREMIUM</span>`;
function canNewSermon(){return isPremium()||liveS().length<PCFG.free.serm||planGate('serm')}
function dicQuota(){if(isPremium())return true;const k='mp.dq.'+todayISO();const n=ls.get(k,0);if(n>=PCFG.free.dic)return planGate('dic');ls.set(k,n+1);return true}
const curFree=id=>isPremium()||id<=0||curFreeIds().has(id)||id===curDayId();
function curDayId(){if(!CUR||!CUR.e.length)return 0;const d=Math.floor((new Date(todayISO()+'T12:00:00')-new Date('2026-01-01T12:00:00'))/864e5);const L=CUR.e;return L[((d*37)%L.length+L.length)%L.length].id}
const cuHist=()=>Array.isArray(meta.curHist)?meta.curHist:(meta.curHist=[]);
function cuHistAdd(id){const H=cuHist();const i=H.indexOf(id);if(i>=0)H.splice(i,1);H.unshift(id);if(H.length>40)H.length=40;putMeta()}
function curFreeIds(){const n=PCFG.free.cur;const out=new Set();if(!CUR)return out;const by={};CUR.e.forEach(e=>(by[e.cat]=by[e.cat]||[]).push(e.id));
  const cats=Object.keys(by);let i=0;while(out.size<Math.min(n,CUR.e.length)){const c=cats[i%cats.length];const l=by[c];const j=Math.floor(i/cats.length);if(j<l.length)out.add(l[j]);i++;if(i>500)break}return out}
/* sección «Mi suscripción» en Configuración */
function subHtml(){const N=planNow();const L=prefs.ui;const left=N.paid?Math.max(0,Math.ceil((N.until-Date.now())/864e5)):0;
  const pays=N.pays.filter(x=>!x.test).sort((a,b)=>(b.at||0)-(a.at||0));
  return`<div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch;gap:10px">
    <span class="k">${esc(t('sub_t'))}</span>
    <div class="sub-grid"><span>${esc(t('sub_plan'))}</span><b>${esc(N.paid?planName(N.plan):N.trial?t('tr_name'):t('pl_free'))}</b>
      <span>${esc(t('sub_state'))}</span><b>${N.trial?`<span class="tag ok">${esc(t('tr_until',{d:fmtDay(N.trialEnd)}))}</span>`:N.grace?`<span class="tag warn">${esc(t('sub_grace'))}</span>`:N.paid?`<span class="tag ok">${esc(t('sub_on'))}</span> <small class="sub">${esc(t('sub_left',{n:left}))}</small>`:N.expired?`<span class="tag warn">${esc(t('sub_exp'))}</span>`:esc(t('sub_freeS'))}</b>
      ${N.since?`<span>${esc(t('sub_since'))}</span><b>${esc(fmtDay(N.since))}</b>`:''}
      ${N.until?`<span>${esc(t('sub_until'))}</span><b>${esc(fmtDay(N.until))}</b>`:''}</div>
    ${N.test?`<p class="pl-testn" style="margin:0">${ic('check')}${esc(t('pl_test'))}</p>`:''}
    ${pays.length?`<span class="s">${esc(t('sub_pays'))}</span>${pays.map(p=>`<div class="sub-pay"><span>${esc(fmtDay(p.at))} · ${esc(planName(p.plan))}</span><b>${esc(p.amt?money(+p.amt,p.cur||'pyg'):'')}</b></div>`).join('')}`:''}
    ${(()=>{const q=ls.get('mp.payreq',null);return q&&Date.now()-q.at<10*864e5&&!planNow().paid?`<p class="pl-testn" style="margin:0">${ic('check')}${esc(t('py_pend',{d:fmtDay(q.at)}))}</p>`:''})()}
    <button class="btn sm gold block" data-act="plans">${esc(t('sub_change'))}</button><p class="sub" style="margin:0;font-size:12.5px">${esc(t('sub_cancel_d'))}</p>
  </div></div>`}
/* administración */

Object.assign(I18N.es,{as_sec:'Sitio meupulpito.com',as_btn:'Textos y testimonios',av_btn:'Visitas del sitio',as_note:'Precios, límites del plan gratis y WhatsApp de «Precios y pruebas» también aparecen en el sitio.',
  as_bar:'Aviso en la parte de arriba',as_bar_on:'Mostrar aviso',as_bar_d:'Una franja dorada arriba del sitio, por ejemplo para una promoción.',as_bar_ph_es:'Ej.: Promoción de lanzamiento: 20% en el plan anual',as_bar_ph_pt:'Ex.: Promoção de lançamento: 20% no plano anual',as_bar_url:'Enlace al tocar (opcional)',as_bar_need:'Escriba el texto del aviso',
  as_hero:'Título principal',as_hero_d:'Deje en blanco para usar el texto original.',as_sub:'Subtítulo',as_testi:'Testimonios',as_testi_d:'Solo testimonios reales, con autorización de la persona. Aparecen en el sitio cuando hay al menos uno marcado.',
  as_t_n:'Testimonio {n}',as_show:'Mostrar',as_q_ph:'Lo que dijo, con sus palabras',as_n_ph:'Nombre (ej.: Pr. Luis Gómez)',as_r_ph:'Iglesia · Ciudad',as_add:'Agregar testimonio',as_v_ph:'Video (opcional): link de YouTube o de un archivo .mp4',as_v_bad:'El link del video debe empezar con https://',as_none:'Todavía no hay testimonios.',as_saved:'Sitio actualizado',as_view:'Ver el sitio',
  av_7:'7 días',av_30:'30 días',av_today:'Hoy',av_visits:'Visitas',av_people:'Personas',av_go:'Tocaron Acceder',av_wa:'Tocaron WhatsApp',av_conv:'Fueron al app',av_per_day:'Visitas por día',av_country:'País',av_from:'De dónde vinieron',av_lang:'Idioma',av_dev:'Aparato',
  av_other:'Otros',av_direct:'Directo / otro',av_mobile:'Celular',av_desktop:'Computadora',av_err:'No se pudo cargar. Verifique que publicó las reglas nuevas de Firebase.',av_note:'Solo números, sin datos de las personas. No cuenta sus propias visitas desde este celular. «Personas» cuenta cada aparato una vez por día.'});
Object.assign(I18N.pt,{as_sec:'Site meupulpito.com',as_btn:'Textos e depoimentos',av_btn:'Visitas do site',as_note:'Preços, limites do plano grátis e WhatsApp de «Preços e testes» também aparecem no site.',
  as_bar:'Aviso no topo',as_bar_on:'Mostrar aviso',as_bar_d:'Uma faixa dourada no topo do site, por exemplo para uma promoção.',as_bar_ph_es:'Ej.: Promoción de lanzamiento: 20% en el plan anual',as_bar_ph_pt:'Ex.: Promoção de lançamento: 20% no plano anual',as_bar_url:'Link ao tocar (opcional)',as_bar_need:'Escreva o texto do aviso',
  as_hero:'Título principal',as_hero_d:'Deixe em branco para usar o texto original.',as_sub:'Subtítulo',as_testi:'Depoimentos',as_testi_d:'Só depoimentos reais, com autorização da pessoa. Aparecem no site quando há pelo menos um marcado.',
  as_t_n:'Depoimento {n}',as_show:'Mostrar',as_q_ph:'O que a pessoa disse, com as palavras dela',as_n_ph:'Nome (ex.: Pr. Luis Gómez)',as_r_ph:'Igreja · Cidade',as_add:'Adicionar depoimento',as_v_ph:'Vídeo (opcional): link do YouTube ou de um arquivo .mp4',as_v_bad:'O link do vídeo deve começar com https://',as_none:'Ainda não há depoimentos.',as_saved:'Site atualizado',as_view:'Ver o site',
  av_7:'7 dias',av_30:'30 dias',av_today:'Hoje',av_visits:'Visitas',av_people:'Pessoas',av_go:'Tocaram Acessar',av_wa:'Tocaram WhatsApp',av_conv:'Foram ao app',av_per_day:'Visitas por dia',av_country:'País',av_from:'De onde vieram',av_lang:'Idioma',av_dev:'Aparelho',
  av_other:'Outros',av_direct:'Direto / outro',av_mobile:'Celular',av_desktop:'Computador',av_err:'Não foi possível carregar. Confira se publicou as regras novas do Firebase.',av_note:'Só números, sem dados das pessoas. Não conta as suas próprias visitas deste celular. «Pessoas» conta cada aparelho uma vez por dia.'});

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
const anon=['s','n','a'].map(k=>(ls.get(K[k],[])||[]).filter(x=>x&&x.id&&!x.deleted));let migrated=false;ready=true;view.tab='home';go('home');setTimeout(pwaShortcut,400);setTimeout(()=>MC.load(),3000);setSync(false,'sync_conn');if(!ls.get('mp.onb',0))setTimeout(()=>{if(!blocked&&!$('.ov')&&!E)onboarding()},900);else if(window.__fromLogin&&!(authU&&freshAccount(authU)))setTimeout(()=>{if(!blocked)toast(t('wb_back',{n:(meta.name||'').trim()||t('pastor')}))},700);window.__fromLogin=false;newsCheck();waCheck();depoCheck();chCheck();rolCheck();
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
  listen(+ls.get(PK,0)||0);watchPlan(u);setTimeout(()=>beat(true),5000);watchCfg();supWatch(u);
}
// Entrar con cuenta desde el modo sin cuenta: si el sistema de cuentas no cargó, lo intenta cargar de nuevo
function loadScript(u){return new Promise((ok,ko)=>{const sc=document.createElement('script');sc.src=u;sc.onload=ok;sc.onerror=ko;document.head.appendChild(sc);setTimeout(ko,12000)})}
let fbWait=null;
function fbReady(){return !!(window.firebase&&firebase.apps&&firebase.apps.length&&firebase.auth)}
function ensureFb(){if(fbReady())return Promise.resolve(true);if(fbWait)return fbWait;
  fbWait=(async()=>{try{if(!window.firebase||!firebase.auth||!firebase.firestore){for(const n of['app','auth','firestore'])await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-'+n+'-compat.js')}
      if(!firebase.apps.length)firebase.initializeApp(window.FIREBASE_CONFIG);try{firebase.firestore().settings({experimentalForceLongPolling:true,merge:true})}catch(e){}try{firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
      firebase.auth().onAuthStateChanged(u=>{if(u&&!authU){localMode=false;ls.set('pulpito.local',false);startCloud(u)}});return true}
    catch(e){fbWait=null;return false}})();return fbWait}
async function toLogin(){ls.set('pulpito.local',false);localMode=false;showLogin()}
function startLocal(){localMode=true;ls.set('pulpito.local',true);unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;authU=null;loadLocal();ready=true;setSync(false,'sync_local');go(view.tab||'home');chCheck()}
function anyShown(){return !!$('#app').firstElementChild}
function fallback(){if(anyShown())return;showLogin()}
function initStore(){
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg||!cfg.apiKey||!window.firebase||!firebase.auth||!firebase.firestore){showLogin();return}
  try{firebase.initializeApp(cfg)}catch(e){showLogin();return}
  try{firebase.firestore().settings({experimentalForceLongPolling:true,merge:true})}catch(e){}try{firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  ls.set('pulpito.local',false);
  const tm=setTimeout(()=>{if(!authU&&!localMode)fallback()},2500);
  try{firebase.auth().onAuthStateChanged(u=>{clearTimeout(tm);if(u){if(!localMode||!ready)startCloud(u)}else if(!localMode)showLogin()},()=>{clearTimeout(tm);fallback()})}
  catch(e){clearTimeout(tm);fallback()}
}

/* =========================================================
   Hojas (sheets)
   ========================================================= */
function openSheet(html,{host,cls='',onClose,lock}={}){
  const ov=document.createElement('div');ov.className='ov';ov.innerHTML=`<div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  ov.addEventListener('click',e=>{if(e.target===ov&&!lock)closeSheet(ov)});ov._onClose=onClose;ov._lock=!!lock;
  (host||$('#layer')).appendChild(ov);return ov.firstElementChild}
function closeSheet(ov){ov=ov||[...$$('.ov')].filter(o=>!o._lock).pop();if(!ov)return;const f=ov._onClose;ov.remove();f&&f()}
document.addEventListener('keydown',e=>{const o=[...$$('.ov')].pop();if(e.key==='Escape'&&o&&!o._lock)closeSheet()});

/* =========================================================
   Navegación
   ========================================================= */
const view={tab:'home',overlay:null};
let listState={q:'',f:'all',cat:'',mode:'s',nt:'',ser:''};
const TABS=[['home','home','nav_home'],['list','doc','nav_list'],['bible','bible','nav_bible'],['dic','dict','nav_dic'],['agenda','cal','nav_agenda']];
const WIDE=matchMedia('(min-width:768px) and (min-height:560px)');
function drawNav(){$('#navIn').innerHTML=`<div class="nav-brand" aria-hidden="true"><span class="mark"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span><span class="wordmark"><b><span class="w1">MEU</span> <span class="w2">PÚLPITO</span></b><small class="nb-tag">${esc(t('tagline'))}</small></span></div><button class="nav-new" data-act="new">${ic('plus')}<span>${esc(t('new_sermon'))}</span></button>`
  +TABS.map(([k,i,l])=>`<button data-act="tab" data-k="${k}" ${view.tab===k||(k==='home'&&view.tab==='cur')?'aria-current="page"':''}>${ic(i)}<span>${esc(t(l))}</span></button>`).join('')
  +`<button class="nav-set" data-act="tab" data-k="profile" ${view.tab==='profile'?'aria-current="page"':''}>${ic('gear')}<span>${esc(t('nav_profile'))}</span></button>`}
try{WIDE.addEventListener('change',()=>{if(ready&&!blocked&&!E&&!PG&&!view.overlay)render()})}catch(e){}
const SUBP=['profile','cur','devo','sug','man','lic','il','igr'];
// Accesos directos del ícono instalado (mantener presionado en Android): ./#new, ./#bible, ./#agenda, ./#dic
function pwaShortcut(){const h=(location.hash||'').slice(1);if(!h)return;try{history.replaceState(null,'',location.pathname)}catch(e){}
  if(blocked)return;if(h==='new')newSermon();else if(['bible','agenda','dic','list','devo','sug','man','lic','il','igr','cur'].includes(h))go(h)}
function go(tab){if(SUBP.includes(tab)&&!SUBP.includes(view.tab))view.prev=view.tab;view.tab=tab;view.overlay=null;render(true);window.scrollTo(0,0);$('#app').scrollTop=0}
function render(anim){
  if(!ready)return;if(blocked){showBlocked();return}const sub=SUBP.includes(view.tab);$('#nav').hidden=sub&&!WIDE.matches;document.documentElement.classList.toggle('tabs',!sub);document.documentElement.classList.toggle('subp',sub);drawNav();
  const app=$('#app');const keep=app.querySelector('input:focus');const sel=keep?[keep.id,keep.selectionStart]:null;
  const html={home:homeHtml,list:listHtml,bible:bibleHtml,dic:dxTabHtml,cur:curHtml,agenda:agendaHtml,profile:profileHtml,devo:devoHtml,sug:sugHtml,man:manHtml,lic:licHtml,il:ilHtml,igr:igrHtml}[view.tab]();
  app.innerHTML=`<section class="view ${anim?'enter':''}" data-tab="${view.tab}"><div class="wrap">${html}</div></section>`;
  if(sel&&sel[0]){const el=document.getElementById(sel[0]);if(el){el.focus();try{el.setSelectionRange(sel[1],sel[1])}catch(e){}}}
  if(view.tab==='bible')bibleAfter();
  if(view.tab==='dic')dxAfter();
  if(view.tab==='cur')curAfter();
  if(MINT.includes(view.tab))minAfter();
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

/* ---------- Plan de lectura bíblica (progreso en la cuenta: meta.rp) ---------- */
const CHN=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const RPLANS={y1:{days:365,from:0,to:65},nt90:{days:90,from:39,to:65},ev30:{days:30,from:39,to:42},ps60:{days:60,books:[18,19]}};
function rpChapters(k){const P=RPLANS[k];const bs=P.books||Array.from({length:P.to-P.from+1},(_,i)=>P.from+i);const out=[];bs.forEach(b=>{for(let c=1;c<=CHN[b];c++)out.push([b,c])});return out}
function rpDay(k,d){const C=rpChapters(k),N=RPLANS[k].days;return C.slice(Math.floor(d*C.length/N),Math.floor((d+1)*C.length/N))}
function rpLabel(chs,L){if(!chs.length)return'';const names=t('books',null,L);const g=[];chs.forEach(([b,c])=>{const l=g[g.length-1];if(l&&l.b===b&&l.e===c-1)l.e=c;else g.push({b,s:c,e:c})});
  return g.map(x=>`${names[x.b]} ${x.s}${x.e>x.s?'–'+x.e:''}`).join('; ')}
const rpGet=()=>meta.rp&&RPLANS[meta.rp.k]?meta.rp:null;
function rpToday(){const R=rpGet();if(!R)return null;const N=RPLANS[R.k].days;const done=new Set(R.done||[]);
  const el=Math.floor((new Date(todayISO()+'T12:00:00')-new Date(R.start+'T12:00:00'))/864e5);const cur=Math.min(N-1,Math.max(0,el));
  let d=0;while(d<N&&done.has(d))d++;return{R,N,done,day:d,cur,behind:Math.max(0,cur-d),fin:d>=N}}
function rpCardHtml(){const x=rpToday();const L=lxLang();
  if(!x)return`<button class="cu-card" data-act="rpOpen"><span class="dx-gl sm">${ic('bible')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('rpl_t'))}</b><span>${esc(t('rp_inv'))}</span></span><span class="dx-go2">${ic('next')}</span></button>`;
  if(x.fin)return`<button class="cu-card" data-act="rpOpen"><span class="dx-gl sm">${ic('check')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('rp_fin'))}</b><span>${esc(t('rp_'+x.R.k))}</span></span><span class="dx-go2">${ic('next')}</span></button>`;
  const chs=rpDay(x.R.k,x.day);
  return`<div class="rp-card"><div class="between"><span class="sn-hd">${ic('bible')}<span>${esc(t('rp_today',{d:x.day+1,n:x.N}))}</span></span><button class="lnk" data-act="rpOpen">${esc(t('rp_plan'))}</button></div>
   <b class="serif rp-ref">${esc(rpLabel(chs,L))}</b>${x.behind?`<span class="sub" style="font-size:12.5px">${esc(t('rp_behind',{n:x.behind}))}</span>`:''}
   <span class="ser-bar"><i style="width:${Math.round(x.done.size/x.N*100)}%"></i></span>
   <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn sm ghost" data-act="rpRead" data-d="${x.day}">${ic('bible')}${esc(t('rp_read'))}</button><button class="btn sm gold" data-act="rpDone" data-d="${x.day}">${ic('check')}${esc(t('rp_mark'))}</button></div></div>`}
function rpMark(d,on){const R=rpGet();if(!R)return;const S=new Set(R.done||[]);on?S.add(+d):S.delete(+d);R.done=[...S].sort((a,b)=>a-b);putMeta()}
function rpRead(d){const R=rpGet();if(!R)return;const chs=rpDay(R.k,+d);if(!chs.length)return;[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));BV.fav=false;BV.b=chs[0][0];BV.c=chs[0][1];BV.sel=new Set();go('bible')}
function rpSermon(d){const R=rpGet();if(!R||!canNewSermon())return;const chs=rpDay(R.k,+d);const L=lxLang();[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));
  const s={id:uid(),html:`<h1><br></h1><p>${esc(t('rp_base'))}: ${esc(rpLabel(chs,L))}</p><p><br></p>`,lang:'',category:'',fav:false,created:Date.now(),log:[],v:2};openEditor(null,s)}
function rpSheet(){const L=lxLang();const R=rpGet();
  if(!R){const sh=openSheet(`<h3>${esc(t('rpl_t'))}</h3><p class="sub" style="margin:0">${esc(t('rp_choose'))}</p>
     <div class="acts">${Object.keys(RPLANS).map(k=>`<button class="act" data-rp="${k}">${ic('bible')}<span style="display:flex;flex-direction:column"><span>${esc(t('rp_'+k))}</span><span class="s">${esc(t('rp_'+k+'_d',{n:(Math.round(rpChapters(k).length/RPLANS[k].days*10)/10).toLocaleString(prefs.ui==='pt'?'pt-BR':'es')}))}</span></span></button>`).join('')}</div>`);
    sh.addEventListener('click',e=>{const b=e.target.closest('[data-rp]');if(!b)return;meta.rp={k:b.dataset.rp,start:todayISO(),done:[]};putMeta();closeSheet();toast(t('rp_started'));render()});return}
  const x=rpToday();const N=x.N;
  const sh=openSheet(`<div class="between"><h3>${esc(t('rp_'+R.k))}</h3><button class="iconbtn" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <p class="sub" style="margin:0">${esc(t('rp_prog',{d:x.done.size,n:N}))}</p><span class="ser-bar"><i style="width:${Math.round(x.done.size/N*100)}%"></i></span>
    <div class="rp-list">${Array.from({length:N},(_,d)=>{const ok=x.done.has(d);return`<div class="rp-row${ok?' ok':''}${d===x.day?' cur':''}" data-d="${d}"><button class="rp-ck" data-y="mark" aria-pressed="${ok}" aria-label="${esc(t('rp_mark'))}">${ic('check')}</button><button class="rp-tx" data-y="read"><small>${esc(t('rp_dayn',{d:d+1}))}</small><span>${esc(rpLabel(rpDay(R.k,d),L))}</span></button><button class="iconbtn" data-y="serm" aria-label="${esc(t('rp_serm'))}">${ic('pen')}</button></div>`}).join('')}</div>
    <p class="sub" style="font-size:12px;margin:0">${ic('pen')} ${esc(t('rp_serm_d'))}</p>
    <button class="btn gold block" data-y="share">${ic('share')}${esc(t('rp_share'))}</button><p class="sub" style="font-size:12px;margin:-4px 0 0;text-align:center">${esc(t('rp_share_d'))}</p>
    <button class="btn ghost block" data-y="stop" style="color:var(--danger)">${esc(t('rp_stop'))}</button>`,{cls:'big ns'});
  setTimeout(()=>{const c=$('.rp-row.cur',sh);c&&c.scrollIntoView({block:'center'})},60);
  sh.addEventListener('click',e=>{if(e.target.closest('[data-x=close]')){closeSheet();return}const b=e.target.closest('[data-y]');if(!b)return;const y=b.dataset.y;const row=b.closest('[data-d]');const d=row?+row.dataset.d:0;
    if(y==='mark'){const on=b.getAttribute('aria-pressed')!=='true';rpMark(d,on);b.setAttribute('aria-pressed',String(on));row.classList.toggle('ok',on);const z=rpToday();if(z){$('.ser-bar i',sh).style.width=Math.round(z.done.size/N*100)+'%';sh.querySelector('p.sub').textContent=t('rp_prog',{d:z.done.size,n:N})}refreshBg()}
    else if(y==='read')rpRead(d);else if(y==='serm')rpSermon(d);
    else if(y==='share'){const z=rpToday();const dd=z?z.cur:0;const lbl=rpLabel(rpDay(R.k,dd),L);const link=pubCfg().on&&authU?pubUrl():'https://meupulpito.com/';const txt=t('rp_share_msg',{p:t('rp_'+R.k),d:dd+1,n:N,l:lbl})+'\n'+link;if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')))}
    else if(y==='stop'){if(!confirmTap(b))return;delete meta.rp;putMeta();closeSheet();render()}})}
Object.assign(I18N.es,{rp_share:'Enviar la lectura de hoy a la iglesia',rp_share_d:'Mensaje listo para el grupo o el Estado de WhatsApp, con el enlace para acompañar cada día.',rp_share_msg:'Lectura bíblica de hoy · {p} · día {d} de {n}\n{l}\n\nLea con nosotros y acompañe cada día aquí:',rpl_t:'Plan de lectura bíblica',rp_inv:'Lea la Biblia con un plan diario y marque su progreso.',rp_choose:'Elija un plan. Su progreso queda guardado en su cuenta.',rp_y1:'La Biblia en un año',rp_y1_d:'Toda la Biblia en orden · unos {n} capítulos por día',rp_nt90:'Nuevo Testamento en 90 días',rp_nt90_d:'De Mateo a Apocalipsis · unos {n} capítulos por día',rp_ev30:'Evangelios en 30 días',rp_ev30_d:'Mateo, Marcos, Lucas y Juan · unos {n} capítulos por día',rp_ps60:'Salmos y Proverbios en 60 días',rp_ps60_d:'Para la devoción diaria · unos {n} capítulos por día',
  rp_started:'Plan iniciado. ¡Buena lectura!',rp_today:'Lectura de hoy · día {d} de {n}',rp_plan:'Ver plan',rp_read:'Leer',rp_mark:'Leído',rp_behind:'Está {n} día(s) atrasado. Sin prisa: siga desde aquí.',rp_fin:'¡Plan completado!',rp_prog:'{d} de {n} días leídos',rp_dayn:'Día {d}',rp_serm:'Preparar un sermón con esta lectura',rp_serm_d:'Toque el lápiz para preparar un sermón con la lectura del día.',rp_stop:'Terminar este plan',rp_base:'Texto base'});
Object.assign(I18N.pt,{rp_share:'Enviar a leitura de hoje para a igreja',rp_share_d:'Mensagem pronta para o grupo ou o Status do WhatsApp, com o link para acompanhar cada dia.',rp_share_msg:'Leitura bíblica de hoje · {p} · dia {d} de {n}\n{l}\n\nLeia conosco e acompanhe cada dia aqui:',rpl_t:'Plano de leitura bíblica',rp_inv:'Leia a Bíblia com um plano diário e marque seu progresso.',rp_choose:'Escolha um plano. Seu progresso fica guardado na sua conta.',rp_y1:'A Bíblia em um ano',rp_y1_d:'A Bíblia toda em ordem · uns {n} capítulos por dia',rp_nt90:'Novo Testamento em 90 dias',rp_nt90_d:'De Mateus a Apocalipse · uns {n} capítulos por dia',rp_ev30:'Evangelhos em 30 dias',rp_ev30_d:'Mateus, Marcos, Lucas e João · uns {n} capítulos por dia',rp_ps60:'Salmos e Provérbios em 60 dias',rp_ps60_d:'Para o devocional diário · uns {n} capítulos por dia',
  rp_started:'Plano iniciado. Boa leitura!',rp_today:'Leitura de hoje · dia {d} de {n}',rp_plan:'Ver plano',rp_read:'Ler',rp_mark:'Lido',rp_behind:'Você está {n} dia(s) atrasado. Sem pressa: siga daqui.',rp_fin:'Plano concluído!',rp_prog:'{d} de {n} dias lidos',rp_dayn:'Dia {d}',rp_serm:'Preparar um sermão com esta leitura',rp_serm_d:'Toque no lápis para preparar um sermão com a leitura do dia.',rp_stop:'Encerrar este plano',rp_base:'Texto base'});
function homeHtml(){if(!CUR&&!homeHtml._cl){homeHtml._cl=1;loadCur().then(()=>{if(view.tab==='home'&&!view.overlay)refreshBg()}).catch(()=>{})}
  const S=sortedByUpd();const favs=S.filter(s=>s.fav);const NS=S.length;const up=upcoming();const wk=up.filter(e=>e.date<=addDays(todayISO(),6)).length;
  const ev=up[0];const evS=ev&&sermons.find(s=>s.id===ev.sermonId);
  return`
  <div class="row topbrand">
    <span class="mark"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
    <div class="wordmark" style="flex:1;min-width:0" aria-label="Meu Púlpito"><b><span class="w1">MEU</span> <span class="w2">PÚLPITO</span></b><small>${esc(t('tagline'))}</small></div>
    <button class="iconbtn bg${meta.photo?' hasph':''}${SUP.uu?' dot':''}" data-act="tab" data-k="profile" aria-label="${esc(t('nav_profile'))}">${meta.photo?`<img src="${esc(meta.photo)}" alt="">`:ic('gear')}</button>
  </div>
  <div class="hello"><span class="sub">${esc(greet())}</span><b>${esc(meta.name||t('pastor'))}</b></div>
  <form class="search" data-form="homeSearch" role="search">${ic('search')}<input id="hq" name="q" type="search" placeholder="${esc(t('search_ph'))}" autocomplete="off" enterkeyhint="search"></form>
  ${bannersHtml()}
  <div class="h-col">${soonHtml(ev,evS)}
  ${devoCardHtml()}
  <button class="hero" data-act="new"><span><span class="k">${esc(t('prepare'))}</span><span class="t" style="display:block">${esc(t('new_sermon'))}</span><span class="d">${esc(t('new_desc'))}</span></span><span class="plus">${ic('plus')}</span></button>
  <div class="rec2"><button data-act="recG"><span class="rc-ic">${ic('mic')}</span><span class="rc-tx"><b>${esc(t('rc2_a'))}${isPremium()?'':audLeft()?` <span class="cu-lock">${esc(t('aud_tag',{n:audLeft()}))}</span>`:` <span class="cu-lock" aria-label="Premium">Premium</span>`}</b><span>${esc(t('rc2_ad'))}</span></span></button>
    <button data-act="video"><span class="rc-ic">${ic('video')}</span><span class="rc-tx"><b>${esc(t('rc2_v'))}${isPremium()?'':` <span class="cu-lock" aria-label="Premium">Premium</span>`}</b><span>${esc(t('rc2_vd'))}</span></span></button></div>
  <div class="stats">
    <button class="stat" data-act="list" data-f="all"><b>${NS}</b><span>${esc(t('st_total'))}</span></button>
    <button class="stat" data-act="list" data-f="done"><b>${S.filter(isPreached).length}</b><span>${esc(t('st_done'))}</span></button>
    <button class="stat" data-act="list" data-f="fav"><b>${favs.length}</b><span>${esc(t('st_fav'))}</span></button>
  </div>
  ${rpCardHtml()}
  ${!localMode&&authU&&!ls.get('mp.rfx',0)&&liveS().length>=1?`<div class="rp-card rf-home"><div class="between"><span class="sn-hd">${ic('star')}<span>${esc(t('rf_h_eye'))}</span></span><button class="iconbtn sm" data-act="rfHide" aria-label="${esc(t('close'))}">${ic('x')}</button></div><b class="rp-ref" style="font-family:var(--head);font-size:17px">${esc(t('rf_h_t'))}</b><span class="sub" style="font-size:13px;line-height:1.45">${esc(t('rf_h_d'))}</span><div class="row" style="justify-content:flex-end"><button class="btn sm gold" data-act="refer">${ic('share')}${esc(t('rf_h_go'))}</button></div></div>`:''}
  ${igHomeHtml()}
  <span class="sect" style="margin-top:4px">${esc(t('min_sec'))}</span>
  <span class="sect sect-sm">${esc(t('min_p'))}</span>
  <button class="cu-card" data-act="video"><span class="dx-gl sm">${ic('video')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('vd_t'))}${isPremium()?'':` <span class="cu-lock" aria-label="Premium">Premium</span>`}</b><span>${esc(t('vd_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  <button class="cu-card" data-act="tab" data-k="sug"><span class="dx-gl sm">${ic('lectern')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('sg_t'))}</b><span>${esc(t('sg_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  <button class="cu-card" data-act="tab" data-k="il"><span class="dx-gl sm">${ic('bulb')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('il_t'))}</b><span>${esc(t('il_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  <button class="cu-card" data-act="tab" data-k="cur"><span class="dx-gl sm">${ic('chat')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('cu_t'))}</b><span>${CUR&&CUR.by[curDayId()]?esc(t('cu_home_day',{q:CUR.by[curDayId()].q[cuL()]})):esc(t('cu_d'))}</span></span><span class="dx-go2">${ic('next')}</span></button></div><div class="h-col">
  <span class="sect sect-sm">${esc(t('min_e'))}</span>
  <button class="cu-card" data-act="tab" data-k="lic"><span class="dx-gl sm">${ic('bible')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('lc_t'))}</b><span>${esc(t('lc_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  <span class="sect sect-sm">${esc(t('min_g'))}</span>
  <button class="cu-card" data-act="tab" data-k="man"><span class="dx-gl sm">${ic('doc')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('mn_t'))}</b><span>${esc(t('mn_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  <button class="cu-card" data-act="tab" data-k="igr"><span class="dx-gl sm">${ic('group')}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(t('ig_t'))}${planNow().igreja?'':` <span class="cu-lock">${esc(t('ig_pl'))}</span>`}</b><span>${esc(t('ig_home'))}</span></span><span class="dx-go2">${ic('next')}</span></button>
  ${S.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('recent'))}</span><button class="lnk" data-act="tab" data-k="list">${esc(t('my_sermons'))}</button></div>
    ${S.slice(0,3).map(s=>miniCard(s,`<span class="chev">${ic('next')}</span>`)).join('')}</div>`:''}
  ${favs.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('favorites'))}</span><button class="lnk" data-act="list" data-f="fav">${esc(t('see_all'))}</button></div>
    <div class="favrow">${favs.slice(0,8).map(favCard).join('')}</div></div>`:''}
  ${ev&&!soonDays(ev)?`<div style="display:flex;flex-direction:column;gap:10px"><span class="sect">${esc(t('next_preach'))}</span>
    <button class="mini" data-act="tab" data-k="agenda">${dateBox(ev.date,true)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <b style="font-size:15px">${esc(evPlace(ev))}${ev.type?' · '+esc(ev.type):''}</b><span class="sub">${esc([ev.time,evS?derive(evS).title:(ev.theme||t('tbd'))].filter(Boolean).join(' · '))}</span></div></button></div>`:''}
  </div><div class="sync" data-sync style="justify-content:center">${syncHtml()}</div>`;
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
Object.assign(I18N.es,{dx_hctx:'Contexto histórico',dx_bctx:'Contexto bíblico',dx_spir:'Importancia espiritual',cu_hist:'Historial',cu_nohist:'Aquí aparecen las curiosidades que abra.',cu_day:'Curiosidad del día',cu_day_tap:'Toque para ver la respuesta',cu_home_day:'Hoy: {q}',dx_free:'Plan gratis: {n} artículos completos por día. Con Premium, sin límite.',pk_t:'Función exclusiva del plan PREMIUM',pk_d:'Esta función está disponible exclusivamente en el plan PREMIUM. Actualice su plan para desbloquear todas las herramientas de estudio bíblico de Meu Púlpito.',pk_go:'ACTUALIZAR A PREMIUM',pk_no:'Ahora no',pk_rec:'Grabe notas de voz y sus predicaciones en audio sin límite, y dicte por voz, para escuchar y compartir.',pk_aud:'Ya usó las 2 grabaciones de audio del plan gratis. Con Premium graba sin límite y usa el dictado por voz.',pk_ser:'Organice sus mensajes en series y vea el avance de cada una.',pk_pdf:'Exporte el sermón en modelos de estudio, para predicar y solo los puntos.',pk_xr:'Vea todos los versículos relacionados con cada texto.',pk_bq:'Vea la lista completa de versículos donde aparece la palabra.',pk_more:'{n} versículos relacionados más',pk_bqv:'Ver los {n} versículos',wl_t:'¡Bienvenido a Meu Púlpito!',wl_s:'Nos alegra tenerle con nosotros.',wl_gift:'¡Tiene 3 días de acceso PREMIUM completamente gratis!',wl_d:'Durante este período podrá disfrutar de todas las herramientas disponibles para preparar, organizar y predicar sus mensajes.',wl_go:'COMENZAR MI EXPERIENCIA',wl_note:'No necesita tarjeta. No se realizarán cobros automáticos. Al finalizar la prueba podrá elegir si desea contratar Premium o continuar con el plan gratis.',tl_t:'Premium gratis',tl_left:'Le quedan {x} de prueba. Todas las funciones están liberadas.',tl_24:'Su prueba termina en {x}. Elija un plan para no perder las funciones Premium.',tl_3:'¡Faltan solo {x}! Elija un plan para seguir con Premium. Sus sermones quedan guardados.',tl_dh:'{d} d {h} h',tl_h:'{h} h',tw_24:'Quedan 24 horas de su prueba Premium',tw_3:'Quedan 3 horas de su prueba Premium',ad_sell:'Para empezar a vender: en «Precios y pruebas» apague «Todo liberado para todos». Así cada cuenta usa su plan (gratis, prueba o Premium).',tr_name:'Prueba gratis',tr_auto:'automática',tr_short:'Prueba',tr_until:'hasta el {d}',atr_d:'La persona tiene todo liberado durante estos días. Al terminar vuelve sola al plan gratis, sin perder nada.',tr_24h:'24 h',tr_days:'días',atr_go:'Liberar prueba',tr_stop:'Terminar la prueba ahora',atr_done:'Prueba liberada hasta el {d}',tr_soon:'Su prueba gratis termina en {n} días',tr_today:'Su prueba gratis termina hoy',tr_soon_d:'Elija un plan para seguir con todas las funciones. Sus sermones quedan guardados.',tr_end:'Su prueba gratis terminó',tr_end_d:'Ahora está en el plan gratis y sus sermones siguen guardados. Elija un plan para liberar todo de nuevo.',tr_on:'Prueba gratis: todo liberado hasta el {d}.',tr_ask:'Pedir una prueba gratis',tr_ask_msg:'Hola, quiero probar Meu Púlpito Premium antes de contratar. Mi cuenta: {e}',dx_ar:'Diccionario Arameo',dx_ard:'Las palabras en arameo del Antiguo Testamento: partes de Daniel y Esdras, y algunos versículos más.',dx_ph_a:'Palabra en español, portugués, arameo o H2',lib_ph:'Buscar en su biblioteca',dx_all_ph:'Buscar en todos los diccionarios',sn_today:'Hoy predicas',sn_tom:'Mañana predicas',sn_in:'Predicas en {n} días',sn_none:'Todavía no elegiste el sermón para este culto.',sn_rev:'Revisar',sn_go:'Predicar',sn_ag:'Ver agenda'});
Object.assign(I18N.pt,{dx_hctx:'Contexto histórico',dx_bctx:'Contexto bíblico',dx_spir:'Importância espiritual',cu_hist:'Histórico',cu_nohist:'Aqui aparecem as curiosidades que você abrir.',cu_day:'Curiosidade do dia',cu_day_tap:'Toque para ver a resposta',cu_home_day:'Hoje: {q}',dx_free:'Plano grátis: {n} artigos completos por dia. Com o Premium, sem limite.',pk_t:'Função exclusiva do plano PREMIUM',pk_d:'Esta função está disponível exclusivamente no plano PREMIUM. Atualize seu plano para desbloquear todas as ferramentas de estudo bíblico do Meu Púlpito.',pk_go:'ATUALIZAR PARA PREMIUM',pk_no:'Agora não',pk_rec:'Grave notas de voz e suas pregações em áudio sem limite, e dite por voz, para ouvir e compartilhar.',pk_aud:'Você já usou as 2 gravações de áudio do plano grátis. Com o Premium, grave sem limite e use o ditado por voz.',pk_ser:'Organize suas mensagens em séries e veja o andamento de cada uma.',pk_pdf:'Exporte o sermão em modelos de estudo, para pregar e só os pontos.',pk_xr:'Veja todos os versículos relacionados a cada texto.',pk_bq:'Veja a lista completa de versículos onde a palavra aparece.',pk_more:'Mais {n} versículos relacionados',pk_bqv:'Ver os {n} versículos',wl_t:'Bem-vindo ao Meu Púlpito!',wl_s:'Que alegria ter você conosco.',wl_gift:'Você tem 3 dias de acesso PREMIUM totalmente grátis!',wl_d:'Durante este período você poderá aproveitar todas as ferramentas disponíveis para preparar, organizar e pregar suas mensagens.',wl_go:'COMEÇAR MINHA EXPERIÊNCIA',wl_note:'Você não precisa de cartão. Não haverá cobranças automáticas. Ao terminar o teste, você poderá escolher se quer assinar o Premium ou continuar no plano grátis.',tl_t:'Premium grátis',tl_left:'Restam {x} de teste. Todas as funções estão liberadas.',tl_24:'Seu teste termina em {x}. Escolha um plano para não perder as funções Premium.',tl_3:'Faltam só {x}! Escolha um plano para continuar com o Premium. Seus sermões ficam guardados.',tl_dh:'{d} d {h} h',tl_h:'{h} h',tw_24:'Faltam 24 horas do seu teste Premium',tw_3:'Faltam 3 horas do seu teste Premium',ad_sell:'Para começar a vender: em «Preços e testes» desligue «Tudo liberado para todos». Assim cada conta usa o seu plano (grátis, teste ou Premium).',tr_name:'Teste grátis',tr_auto:'automático',tr_short:'Teste',tr_until:'até {d}',atr_d:'A pessoa tem tudo liberado durante estes dias. Ao terminar, volta sozinha ao plano grátis, sem perder nada.',tr_24h:'24 h',tr_days:'dias',atr_go:'Liberar teste',tr_stop:'Encerrar o teste agora',atr_done:'Teste liberado até {d}',tr_soon:'Seu teste grátis termina em {n} dias',tr_today:'Seu teste grátis termina hoje',tr_soon_d:'Escolha um plano para continuar com todas as funções. Seus sermões ficam guardados.',tr_end:'Seu teste grátis terminou',tr_end_d:'Agora você está no plano grátis e seus sermões continuam guardados. Escolha um plano para liberar tudo de novo.',tr_on:'Teste grátis: tudo liberado até {d}.',tr_ask:'Pedir um teste grátis',tr_ask_msg:'Olá, quero testar o Meu Púlpito Premium antes de assinar. Minha conta: {e}',dx_ar:'Dicionário Aramaico',dx_ard:'As palavras em aramaico do Antigo Testamento: partes de Daniel e Esdras, e alguns versículos a mais.',dx_ph_a:'Palavra em português, espanhol, aramaico ou H2',lib_ph:'Buscar na sua biblioteca',dx_all_ph:'Buscar em todos os dicionários',sn_today:'Hoje você prega',sn_tom:'Amanhã você prega',sn_in:'Você prega em {n} dias',sn_none:'Você ainda não escolheu o sermão para este culto.',sn_rev:'Revisar',sn_go:'Pregar',sn_ag:'Ver agenda'});
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
/* ---------- Novedades de la versión y Ayuda ---------- */
Object.assign(I18N.es,{wa_rem:'Enviar recordatorio',wa_rem_ok:'Recordatorio enviado',wam_rem:'¡Hola{n}! Paso a recordarle que su {p} de Meu Púlpito vence el {d}. Para seguir con todas las herramientas, solo tiene que renovar: en el app, toque Configuración → Mi suscripción → Cambiar de plan, o responda este mensaje. ¡Dios le bendiga!\n\nPr. Jean Carlos · Meu Púlpito',wam_exp:'¡Hola{n}! Su {p} de Meu Púlpito venció el {d}. Sus sermones siguen guardados. Para volver a tener todas las herramientas, solo tiene que renovar: en el app, toque Configuración → Mi suscripción → Cambiar de plan, o responda este mensaje. ¡Dios le bendiga!\n\nPr. Jean Carlos · Meu Púlpito',wa_t:'Su WhatsApp',wa_d:'Para darle la bienvenida, avisarle sobre su plan y ayudarle cuando lo necesite. No enviamos publicidad.',wa_cc:'País',wa_ph:'Número con código de área',wa_save:'Guardar',wa_later:'Ahora no',wa_priv:'Solo el equipo de Meu Púlpito ve este número.',wa_bad:'Revise el número: escriba el código de área y el número, sin el código del país.',wa_ok:'WhatsApp guardado',wa_add:'Agregar',wa_wel:'Enviar bienvenida',wa_wel_ok:'Bienvenida enviada',wa_cong:'Enviar felicitación',wa_cong_ok:'Felicitación enviada',wa_none:'Sin WhatsApp registrado',
 wam_wel:'¡Hola{n}! Le damos la bienvenida a Meu Púlpito. ¡Qué alegría tenerle con nosotros! Aquí puede preparar sus sermones, estudiar con la Biblia y los diccionarios bíblico, hebreo, arameo y griego, y predicar desde el celular. Si tiene alguna duda, responda este mensaje. ¡Dios bendiga su ministerio!\n\nPr. Jean Carlos · Meu Púlpito',
 wam_wel_tr:'¡Hola{n}! Le damos la bienvenida a Meu Púlpito. ¡Qué alegría tenerle con nosotros! Tiene Premium gratis hasta el {d} para conocer todo: las 10 versiones de la Biblia, los diccionarios bíblico, hebreo, arameo y griego, y el Modo Predicar. Si tiene alguna duda, responda este mensaje. ¡Dios bendiga su ministerio!\n\nPr. Jean Carlos · Meu Púlpito',
 wam_cong:'¡Hola{n}! Felicitaciones por adquirir el {p} de Meu Púlpito. Su acceso Premium ya está activo hasta el {d}: sermones sin límite, las 10 versiones de la Biblia, los 4 diccionarios completos y el Modo Predicar avanzado. ¡Gracias por su confianza! Estoy a su disposición.\n\nPr. Jean Carlos · Meu Púlpito'});
Object.assign(I18N.pt,{wa_rem:'Enviar lembrete',wa_rem_ok:'Lembrete enviado',wam_rem:'Olá{n}! Passando para lembrar que o seu {p} do Meu Púlpito vence em {d}. Para continuar com todas as ferramentas, é só renovar: no app, toque em Configurações → Minha assinatura → Mudar de plano, ou responda esta mensagem. Deus abençoe!\n\nPr. Jean Carlos · Meu Púlpito',wam_exp:'Olá{n}! O seu {p} do Meu Púlpito venceu em {d}. Seus sermões continuam guardados. Para voltar a ter todas as ferramentas, é só renovar: no app, toque em Configurações → Minha assinatura → Mudar de plano, ou responda esta mensagem. Deus abençoe!\n\nPr. Jean Carlos · Meu Púlpito',wa_t:'Seu WhatsApp',wa_d:'Para darmos as boas-vindas, avisar sobre o seu plano e ajudar quando você precisar. Não enviamos propaganda.',wa_cc:'País',wa_ph:'Número com DDD',wa_save:'Salvar',wa_later:'Agora não',wa_priv:'Só a equipe do Meu Púlpito vê este número.',wa_bad:'Confira o número: escreva o DDD e o número, sem o código do país.',wa_ok:'WhatsApp salvo',wa_add:'Adicionar',wa_wel:'Enviar boas-vindas',wa_wel_ok:'Boas-vindas enviadas',wa_cong:'Enviar parabéns',wa_cong_ok:'Parabéns enviados',wa_none:'Sem WhatsApp cadastrado',
 wam_wel:'Olá{n}! Boas-vindas ao Meu Púlpito! Que alegria ter você conosco. Aqui você prepara seus sermões, estuda com a Bíblia e os dicionários bíblico, hebraico, aramaico e grego, e prega pelo celular. Qualquer dúvida, é só responder esta mensagem. Deus abençoe o seu ministério!\n\nPr. Jean Carlos · Meu Púlpito',
 wam_wel_tr:'Olá{n}! Boas-vindas ao Meu Púlpito! Que alegria ter você conosco. Você tem Premium grátis até {d} para conhecer tudo: as 10 versões da Bíblia, os dicionários bíblico, hebraico, aramaico e grego, e o Modo Pregar. Qualquer dúvida, é só responder esta mensagem. Deus abençoe o seu ministério!\n\nPr. Jean Carlos · Meu Púlpito',
 wam_cong:'Olá{n}! Parabéns por adquirir o {p} do Meu Púlpito. Seu acesso Premium já está ativo até {d}: sermões sem limite, as 10 versões da Bíblia, os 4 dicionários completos e o Modo Pregar avançado. Obrigado pela confiança! Estou à disposição.\n\nPr. Jean Carlos · Meu Púlpito'});
Object.assign(I18N.es,{thx_t:'¡Gracias por adquirir el {p}!',thx_t2:'¡Gracias por renovar su plan!',thx_s:'Es una alegría caminar junto a usted en su ministerio.',thx_until:'{p} activo hasta el {d}',thx_d:'Todas las herramientas de Meu Púlpito ya están liberadas en su cuenta. Que Dios bendiga cada mensaje que va a preparar y predicar.',thx_go:'CONTINUAR'});
Object.assign(I18N.pt,{thx_t:'Obrigado por adquirir o {p}!',thx_t2:'Obrigado por renovar o seu plano!',thx_s:'É uma alegria caminhar junto com você no seu ministério.',thx_until:'{p} ativo até {d}',thx_d:'Todas as ferramentas do Meu Púlpito já estão liberadas na sua conta. Que Deus abençoe cada mensagem que você vai preparar e pregar.',thx_go:'CONTINUAR'});
Object.assign(I18N.es,{dn_t:'Su plan Premium terminó',dn_d:'Su cuenta pasó al plan gratis. Todos sus sermones siguen guardados. Para volver a usar todas las herramientas, renueve su plan.',dn_go:'VER PLANES',dn_no:'Seguir con el plan gratis'});
Object.assign(I18N.pt,{dn_t:'Seu plano Premium terminou',dn_d:'Sua conta passou para o plano grátis. Todos os seus sermões continuam guardados. Para voltar a usar todas as ferramentas, renove o seu plano.',dn_go:'VER PLANOS',dn_no:'Continuar no plano grátis'});
Object.assign(I18N.es,{py_adm:'Formas de pago',py_adm_d:'Estos datos aparecen para el pastor cuando toca «Elegir Premium». Deje en blanco lo que no use.',cs_t:'Segunda pantalla',cs_d:'El sermón aparece en una tablet, computadora o TV y sigue lo que usted lee en el celular.',cs_on:'Enviar a la segunda pantalla',cs_off:'Dejar de enviar',cs_on_t:'Enviando a la segunda pantalla',cs_how:'En el otro aparato, entre con su misma cuenta y toque en Configuración → Segunda pantalla.',cs_view:'Mostrar aquí lo que predico en el celular',cs_wait:'Esperando el celular…',cs_wait_d:'Abra un sermón en Modo Predicar en el celular y toque Aa → Segunda pantalla.',cs_exit:'Salir',cs_prem:'La segunda pantalla es del plan Premium.',ig_f6:'Diezmos y ofrendas, con saldo e informe del mes',ig_f7:'Células y escalas del mes',ig_f8:'Agenda, avisos, pedidos de oración y visitas',ig_f9:'11 certificados, 12 cartas y declaraciones, recibo, oficio, acta, fichas, carné y credencial',ig_t:'Mi Iglesia',ig_pl:'Premium Iglesia',ig_lock_t:'Administre su iglesia en la app',ig_lock_d:'Con el plan Premium Iglesia usted tiene todo el Premium, el panel de proyección para el culto, la sala de reunión por video y Mi Iglesia: los datos de su congregación organizados en el celular, solo para usted.',ig_f10:'Panel de proyección para el culto: Biblia, himnos, imágenes, avisos y puntos del sermón, con acceso propio del equipo de medios',ig_f11:'Sala de reunión por video con hasta 6 personas',ig_f1:'Registro de miembros y congregados',ig_f2:'Cumpleaños del mes, con felicitación por WhatsApp',ig_f3:'Visitantes y seguimiento',ig_f4:'Asistencia en cultos, células y Escuela Dominical',ig_f5:'Informe de la iglesia para compartir',pl_mi:'Premium Iglesia Mensual',pl_ti:'Premium Iglesia Trimestral',pl_ai:'Premium Iglesia Anual',pl_per_mi:'por mes',pl_per_ti:'cada 3 meses',pl_per_ai:'por año',pl_go_mi:'Elegir Iglesia Mensual',pl_go_ti:'Elegir Iglesia Trimestral',pl_go_ai:'Elegir Iglesia Anual',pl_i_d:'Todo el Premium, el panel de proyección para el culto, la sala de reunión y Mi Iglesia: miembros, cumpleaños, visitantes, asistencia, diezmos y ofrendas, células, escalas, agenda, oración, visitas, certificados, cartas e informe.',pl_i0:'Todo lo del Premium',pb_t:'Mi página pública',pb_d:'Un enlace suyo para compartir: devocional del día, próximas predicaciones y su contacto',pb_on:'Página activada',pb_off:'Página desactivada',pb_sw:'Publicar mi página',pb_sw_d:'Cualquiera con el enlace puede verla. Sus sermones nunca aparecen.',pb_ch:'Iglesia',pb_city:'Ciudad',pb_msg:'Mensaje corto (opcional)',pb_msg_ph:'Ej.: Lo esperamos los domingos a las 19:00.',pb_ev:'Mostrar mis próximas predicaciones (fecha, hora y lugar)',pb_theme:'Mostrar también el tema anotado en la agenda',pb_wa:'Mostrar botón de WhatsApp',pb_ign:'Instagram (opcional)',pb_rp:'Mostrar la lectura bíblica del día de mi plan',pb_link:'Su enlace',pb_copy:'Copiar enlace',pb_share:'Compartir',pb_open:'Ver mi página',pb_saved:'Página actualizada',pb_need_wa:'Agregue su WhatsApp en Configuración para mostrar el botón.',pb_need_acc:'Cree una cuenta para tener su página pública.',pb_share_msg:'Vea el devocional de hoy, mis próximas predicaciones y mi contacto: {u}',py_bk:'Transferencia bancaria (Paraguay)',py_tigo:'Billetera (Paraguay)',py_tigo_d:'Tigo Money, Billetera Personal o Zimple: envíe el valor a este número.',py_num:'Número',py_qr:'Pague con QR',py_qr_d:'Abra la app de su banco o billetera, toque en «Pagar con QR» y escanee. Para pagar desde este mismo celular, guarde la imagen y elija «Desde la galería».',py_qr_save:'Guardar imagen del QR',py_ctry:'País del pago',py_py:'Paraguay',py_br:'Brasil',py_req_ok:'Aviso enviado. En cuanto confirmemos el pago, activamos su plan.',py_pend:'Pago informado el {d}. Estamos confirmando.',py_bank:'Banco',py_holder:'Titular',py_acc:'Número de cuenta',py_doc:'Cédula',py_cur:'Moneda',py_pixkey:'Clave Pix',py_card:'Tarjeta de crédito o débito',py_card_d:'Pague con tarjeta en la página segura de pago.',py_card_go:'Pagar con tarjeta',py_card_adm:'Pegue el link de pago de cada plan (Bancard, Pagopar u otro). Debe empezar con https://',py_bad_link:'Revise los links: deben empezar con https://',py_copied:'Copiado',py_how:'Elija cómo pagar. Después envíe el comprobante por WhatsApp y activamos su plan.',py_sent:'Ya pagué · enviar comprobante',py_other:'Prefiero combinar por WhatsApp',py_sent_msg:'Hola, ya pagué el {p} de Meu Púlpito ({v}). Mi cuenta: {e}. Le envío el comprobante.'});
Object.assign(I18N.pt,{py_adm:'Formas de pagamento',py_adm_d:'Estes dados aparecem para o pastor quando ele toca em «Escolher Premium». Deixe em branco o que não usar.',cs_t:'Segunda tela',cs_d:'O sermão aparece num tablet, computador ou TV e acompanha o que você lê no celular.',cs_on:'Enviar para a segunda tela',cs_off:'Parar de enviar',cs_on_t:'Enviando para a segunda tela',cs_how:'No outro aparelho, entre com a mesma conta e toque em Configurações → Segunda tela.',cs_view:'Mostrar aqui o que prego no celular',cs_wait:'Aguardando o celular…',cs_wait_d:'Abra um sermão no Modo Pregar no celular e toque em Aa → Segunda tela.',cs_exit:'Sair',cs_prem:'A segunda tela é do plano Premium.',ig_f6:'Dízimos e ofertas, com saldo e relatório do mês',ig_f7:'Células e escalas do mês',ig_f8:'Agenda, avisos, pedidos de oração e visitas',ig_f9:'11 certificados, 12 cartas e declarações, recibo, ofício, ata, fichas, carteirinha e credencial',ig_t:'Minha Igreja',ig_pl:'Premium Igreja',ig_lock_t:'Administre sua igreja pelo app',ig_lock_d:'Com o plano Premium Igreja você tem todo o Premium, o painel de projeção para o culto, a sala de reunião por vídeo e o Minha Igreja: os dados da sua congregação organizados no celular, só para você.',ig_f10:'Painel de projeção para o culto: Bíblia, hinos, imagens, avisos e pontos do sermão, com acesso próprio da equipe de mídia',ig_f11:'Sala de reunião por vídeo com até 6 pessoas',ig_f1:'Cadastro de membros e congregados',ig_f2:'Aniversariantes do mês, com parabéns pelo WhatsApp',ig_f3:'Visitantes e acompanhamento',ig_f4:'Presença nos cultos, células e Escola Dominical',ig_f5:'Relatório da igreja para compartilhar',pl_mi:'Premium Igreja Mensal',pl_ti:'Premium Igreja Trimestral',pl_ai:'Premium Igreja Anual',pl_per_mi:'por mês',pl_per_ti:'a cada 3 meses',pl_per_ai:'por ano',pl_go_mi:'Escolher Igreja Mensal',pl_go_ti:'Escolher Igreja Trimestral',pl_go_ai:'Escolher Igreja Anual',pl_i_d:'Todo o Premium, o painel de projeção para o culto, a sala de reunião e o Minha Igreja: membros, aniversários, visitantes, presença, dízimos e ofertas, células, escalas, agenda, oração, visitas, certificados, cartas e relatório.',pl_i0:'Tudo do Premium',pb_t:'Minha página pública',pb_d:'Um link seu para compartilhar: devocional do dia, próximas pregações e seu contato',pb_on:'Página ativada',pb_off:'Página desativada',pb_sw:'Publicar minha página',pb_sw_d:'Qualquer pessoa com o link pode ver. Seus sermões nunca aparecem.',pb_ch:'Igreja',pb_city:'Cidade',pb_msg:'Mensagem curta (opcional)',pb_msg_ph:'Ex.: Esperamos você aos domingos às 19h.',pb_ev:'Mostrar minhas próximas pregações (data, hora e lugar)',pb_theme:'Mostrar também o tema anotado na agenda',pb_wa:'Mostrar botão de WhatsApp',pb_ign:'Instagram (opcional)',pb_rp:'Mostrar a leitura bíblica do dia do meu plano',pb_link:'Seu link',pb_copy:'Copiar link',pb_share:'Compartilhar',pb_open:'Ver minha página',pb_saved:'Página atualizada',pb_need_wa:'Adicione seu WhatsApp em Configurações para mostrar o botão.',pb_need_acc:'Crie uma conta para ter a sua página pública.',pb_share_msg:'Veja o devocional de hoje, minhas próximas pregações e meu contato: {u}',py_bk:'Transferência bancária (Paraguai)',py_tigo:'Carteira digital (Paraguai)',py_tigo_d:'Tigo Money, Billetera Personal ou Zimple: envie o valor para este número.',py_num:'Número',py_qr:'Pague com QR',py_qr_d:'Abra o app do seu banco ou carteira, toque em «Pagar com QR» e escaneie. Para pagar deste mesmo celular, salve a imagem e escolha «Da galeria».',py_qr_save:'Salvar imagem do QR',py_ctry:'País do pagamento',py_py:'Paraguai',py_br:'Brasil',py_req_ok:'Aviso enviado. Assim que confirmarmos o pagamento, ativamos o seu plano.',py_pend:'Pagamento informado em {d}. Estamos confirmando.',py_bank:'Banco',py_holder:'Titular',py_acc:'Número da conta',py_doc:'Cédula',py_cur:'Moeda',py_pixkey:'Chave Pix',py_card:'Cartão de crédito ou débito',py_card_d:'Pague com cartão na página segura de pagamento.',py_card_go:'Pagar com cartão',py_card_adm:'Cole o link de pagamento de cada plano (Bancard, Pagopar ou outro). Deve começar com https://',py_bad_link:'Confira os links: devem começar com https://',py_copied:'Copiado',py_how:'Escolha como pagar. Depois envie o comprovante pelo WhatsApp e ativamos o seu plano.',py_sent:'Já paguei · enviar comprovante',py_other:'Prefiro combinar pelo WhatsApp',py_sent_msg:'Olá, já paguei o {p} do Meu Púlpito ({v}). Minha conta: {e}. Segue o comprovante.'});
const NEWS_VER='v158';
const NEWS={es:[['Panel de proyección para el culto (Premium Iglesia)','En Configuración → Proyección y reunión, cree el acceso del equipo (correo y contraseña). En meupulpito.com/projetar, la computadora del proyector (o la smart TV) abre la «Pantalla» y el celular del equipo de medios es el control: Biblia en 10 versiones, himnos que la iglesia escribe, imágenes, avisos, cuenta regresiva y los puntos del sermón (menú del sermón → Enviar a la proyección). Sin la contraseña del pastor.'],['Sala de reunión (Premium Iglesia)','Reunión por video con hasta 6 personas, con enlace y código, en el celular o la computadora, sin instalar nada. En Configuración → Proyección y reunión → Sala de reunión.'],['Pago por país','Al elegir un plan, la app muestra la forma de pago de su país: transferencia, billetera o QR en Paraguay; Pix en Brasil. Después de pagar, toque «Ya pagué» y avisamos al Escritório.'],['Mi página pública','En Configuración → Mi página pública: un enlace suyo con el devocional del día, sus próximas predicaciones, la lectura bíblica del día y su WhatsApp, para compartir con la iglesia.'],['Segunda pantalla al predicar','En Modo Predicar, toque Aa → Segunda pantalla: una tablet, computadora o TV con su cuenta sigue lo que usted lee en el celular (Premium).'],['Transcribir mientras graba','Al grabar audio, marque «Transcribir»: el texto queda junto con el audio y puede convertirse en sermón (Premium).'],['Escuela Dominical en Mi Iglesia','Clases con maestro, alumnos, asistencia y la lección de la semana de cada serie (Premium Iglesia).'],['Búsqueda en todo el contenido','Sugerencias, lecciones y Manual del ministro ahora tienen buscador: escriba un tema, una palabra o un texto bíblico y encuentre la idea en segundos.'],['Mucho más contenido','Ahora son 240 ilustraciones, 240 sugerencias de predicación, 96 lecciones en 16 series (nuevas: Primeros pasos, Parábolas, Milagros, «Yo soy», Héroes de la fe, Mujeres de la Biblia, Evangelismo y Finanzas) y 30 modelos en el Manual del ministro.'],['Video con teleprompter (Premium)','Grabe un mensaje o meditación mirando a la cámara: el texto va pasando en la pantalla y puede salir como subtítulo en el video. En el Inicio, toque «Grabar video».'],['Grabar audio y video en el Inicio','Los dos botones quedan lado a lado, debajo de «Nuevo sermón». En el plan gratis, 2 grabaciones de audio para probar.'],['Descargar todo','En Configuración, guarde en un archivo sus sermones, agenda, anotaciones y los datos de Mi Iglesia.'],['Mi Iglesia (Premium Iglesia)','Nuevo plan para el pastor que administra su iglesia: miembros, cumpleaños, visitantes, asistencia, diezmos y ofrendas, células, escalas, agenda y avisos, pedidos de oración, visitas pastorales, 11 certificados, 12 cartas y declaraciones (incluye recibo, oficio y acta), fichas, carné y credencial de ministro e informe.'],['Imagen para divulgar','En Recomiende a un pastor, una imagen lista con su enlace para su Estado o Instagram.'],['Lecciones para células y Escuela Dominical','16 series con 96 lecciones listas: objetivo, rompehielos, puntos con textos, preguntas, aplicación y oración. Envíelas al grupo o ábralas como documento.'],['Banco de ilustraciones','240 comparaciones e imágenes para sus sermones, en 48 temas, con búsqueda.'],['Devocional como imagen','Comparta el devocional del día como imagen para su Estado o Instagram.'],['Devocional diario','Un devocional para cada día del año en el Inicio: versículo, reflexión, un paso práctico y oración.'],['Sugerencias de predicación y Manual del ministro','Ideas de mensajes para 40 ocasiones y modelos para bodas, 15 años, cultos fúnebres, bautismo, Santa Cena, consagraciones y más.'],['Hable con el soporte','En Configuración ahora puede escribirnos directamente desde la app. La respuesta llega aquí mismo, con un aviso.'],['54 curiosidades nuevas','Ahora son 148 preguntas en Curiosidades: personajes, lugares, animales, costumbres y significados, con los números contados en la propia Biblia.'],['Diccionarios más completos','Ahora encuentra también las palabras como aparecen en la Biblia: «ciudades», «respondió», «díjole» llevan a la palabra de diccionario. Más de 500 palabras hebreas que faltaban (como «hijo», «ciudad», «después») y nombres como Labán.'],['Recomiende a un pastor','En Configuración encontrará su enlace personal. Por cada pastor que cree su cuenta con él y active un plan Premium, usted gana días de Premium gratis.'],['Más personajes y lugares','El Diccionario del predicador ahora trae más personajes y lugares de la Biblia, con contexto histórico, bíblico y espiritual.'],['10 versiones de la Biblia','En la Biblia, toque el nombre de la versión: 6 en español y 4 en portugués. Reina-Valera 1909 y Bíblia Livre son gratis; las demás, Premium.'],['Diccionarios más fáciles','Sugerencias de palabras, «¿Quiso decir?» cuando hay un error al escribir, y lo que existe en los otros diccionarios cuando la palabra no está en el que abrió.'],['Curiosidad del día','Cada día una curiosidad bíblica nueva en el Inicio y en Curiosidades, con historial de lo que ya abrió.'],['Agenda con vista del mes','Vea el mes entero, agregue una descripción y un recordatorio, y guarde la predicación en el calendario del celular.'],['Versículos relacionados','En la Biblia, elija un versículo y toque el ícono de enlace: verá los textos que se relacionan con él (referencias cruzadas).'],['Series de sermones','En el sermón toque «+ Serie» para agrupar mensajes. En Sermones → Series vea el avance de cada serie.'],['Grabe su predicación','En el Modo Predicar, toque el micrófono. Las grabaciones quedan en el celular y puede compartirlas.'],['Plan de lectura bíblica','En el Inicio elija un plan (la Biblia en un año, el NT en 90 días…) y marque cada día leído.'],['Nuevo Diccionario Arameo','Las palabras en arameo del Antiguo Testamento (partes de Daniel y Esdras), con su sentido, pronunciación y versículos.'],['Pregunte cualquier cosa de la Biblia','En Curiosidades: «¿cuántas veces aparece el número 40?» muestra el total, los libros y los versículos.'],['Busque en todos los diccionarios a la vez','En Diccionarios, una sola búsqueda en el Bíblico, el Hebreo, el Arameo y el Griego.'],['Aviso de su próxima predicación','Si tiene un culto en la Agenda esta semana, aparece arriba en el Inicio con «Predicar».'],['Búsqueda más inteligente en sus sermones','Por título, versículo o cualquier palabra del texto, sin importar acentos ni el orden.'],['Nueva pantalla de apertura','El app instalado abre con el logo de Meu Púlpito.']],
  pt:[['Painel de projeção para o culto (Premium Igreja)','Em Configurações → Projeção e reunião, crie o acesso da equipe (e-mail e senha). Em meupulpito.com/projetar, o computador do projetor (ou a smart TV) abre a «Tela» e o celular da equipe de mídia é o controle: Bíblia em 10 versões, hinos que a igreja digita, imagens, avisos, contagem regressiva e os pontos do sermão (menu do sermão → Enviar para a projeção). Sem a senha do pastor.'],['Sala de reunião (Premium Igreja)','Reunião por vídeo com até 6 pessoas, com link e código, no celular ou no computador, sem instalar nada. Em Configurações → Projeção e reunião → Sala de reunião.'],['Pagamento por país','Ao escolher um plano, o app mostra a forma de pagamento do seu país: transferência, carteira ou QR no Paraguai; Pix no Brasil. Depois de pagar, toque em «Já paguei» e avisamos o Escritório.'],['Minha página pública','Em Configurações → Minha página pública: um link seu com o devocional do dia, suas próximas pregações, a leitura bíblica do dia e seu WhatsApp, para compartilhar com a igreja.'],['Segunda tela ao pregar','No Modo Pregar, toque em Aa → Segunda tela: um tablet, computador ou TV com a sua conta acompanha o que você lê no celular (Premium).'],['Transcrever enquanto grava','Ao gravar áudio, marque «Transcrever»: o texto fica junto com o áudio e pode virar sermão (Premium).'],['Escola Dominical no Minha Igreja','Turmas com professor, alunos, presença e a lição da semana de cada série (Premium Igreja).'],['Busca em todo o conteúdo','Sugestões, lições e Manual do ministro agora têm busca: escreva um tema, uma palavra ou um texto bíblico e encontre a ideia em segundos.'],['Muito mais conteúdo','Agora são 240 ilustrações, 240 sugestões de pregação, 96 lições em 16 séries (novas: Primeiros passos, Parábolas, Milagres, “Eu sou”, Heróis da fé, Mulheres da Bíblia, Evangelismo e Finanças) e 30 modelos no Manual do ministro.'],['Vídeo com teleprompter (Premium)','Grave uma mensagem ou meditação olhando para a câmera: o texto vai passando na tela e pode sair como legenda no vídeo. No Início, toque em «Gravar vídeo».'],['Gravar áudio e vídeo no Início','Os dois botões ficam lado a lado, abaixo de «Novo sermão». No plano grátis, 2 gravações de áudio para experimentar.'],['Baixar tudo','Em Configurações, guarde num arquivo seus sermões, agenda, anotações e os dados do Minha Igreja.'],['Minha Igreja (Premium Igreja)','Plano novo para o pastor que administra a igreja: membros, aniversários, visitantes, presença, dízimos e ofertas, células, escalas, agenda e avisos, pedidos de oração, visitas pastorais, 11 certificados, 12 cartas e declarações (inclui recibo, ofício e ata), fichas, carteirinha e credencial de ministro e relatório.'],['Imagem para divulgar','Em Indique um pastor, uma imagem pronta com o seu link para o Status ou o Instagram.'],['Lições para células e Escola Dominical','16 séries com 96 lições prontas: objetivo, quebra-gelo, pontos com textos, perguntas, aplicação e oração. Envie ao grupo ou abra como documento.'],['Banco de ilustrações','240 comparações e imagens para seus sermões, em 48 temas, com busca.'],['Devocional como imagem','Compartilhe o devocional do dia como imagem para o Status ou o Instagram.'],['Devocional diário','Um devocional para cada dia do ano no Início: versículo, reflexão, um passo prático e oração.'],['Sugestões de pregação e Manual do ministro','Ideias de mensagens para 40 ocasiões e modelos para casamento, 15 anos, culto fúnebre, batismo, Santa Ceia, consagrações e mais.'],['Fale com o suporte','Em Configurações agora você pode falar com a gente direto pelo app. A resposta chega aqui mesmo, com um aviso.'],['54 curiosidades novas','Agora são 148 perguntas em Curiosidades: personagens, lugares, animais, costumes e significados, com os números contados na própria Bíblia.'],['Dicionários mais completos','Agora você encontra também as palavras como aparecem na Bíblia: «cidades», «respondeu», «moradores» levam à palavra de dicionário. Mais de 500 palavras hebraicas que faltavam (como «filho», «cidade», «depois») e nomes como Labão.'],['Indique um pastor','Em Configurações você encontra seu link pessoal. Para cada pastor que criar a conta por ele e ativar um plano Premium, você ganha dias de Premium grátis.'],['Mais personagens e lugares','O Dicionário do pregador agora traz mais personagens e lugares da Bíblia, com contexto histórico, bíblico e espiritual.'],['10 versões da Bíblia','Na Bíblia, toque no nome da versão: 4 em português e 6 em espanhol. Bíblia Livre e Reina-Valera 1909 são grátis; as outras, Premium.'],['Dicionários mais fáceis','Sugestões de palavras, «Você quis dizer?» quando há erro de digitação, e o que existe nos outros dicionários quando a palavra não está no que você abriu.'],['Curiosidade do dia','Todo dia uma curiosidade bíblica nova no Início e em Curiosidades, com histórico do que você já abriu.'],['Agenda com visão do mês','Veja o mês inteiro, adicione uma descrição e um lembrete, e salve a pregação no calendário do celular.'],['Versículos relacionados','Na Bíblia, escolha um versículo e toque no ícone de corrente: você verá os textos que se relacionam com ele (referências cruzadas).'],['Séries de sermões','No sermão toque em «+ Série» para agrupar mensagens. Em Sermões → Séries veja o andamento de cada série.'],['Grave sua pregação','No Modo Pregar, toque no microfone. As gravações ficam no celular e você pode compartilhá-las.'],['Plano de leitura bíblica','No Início escolha um plano (a Bíblia em um ano, o NT em 90 dias…) e marque cada dia lido.'],['Novo Dicionário Aramaico','As palavras em aramaico do Antigo Testamento (partes de Daniel e Esdras), com sentido, pronúncia e versículos.'],['Pergunte qualquer coisa da Bíblia','Em Curiosidades: «quantas vezes aparece o número 40?» mostra o total, os livros e os versículos.'],['Busque em todos os dicionários de uma vez','Em Dicionários, uma só busca no Bíblico, no Hebraico, no Aramaico e no Grego.'],['Aviso da sua próxima pregação','Se você tem um culto na Agenda nesta semana, ele aparece no topo do Início com «Pregar».'],['Busca mais inteligente nos seus sermões','Por título, versículo ou qualquer palavra do texto, sem se importar com acentos nem com a ordem.'],['Nova tela de abertura','O app instalado abre com o logo do Meu Púlpito.']]};
function newsSheet(){const L=lxLang();ls.set('mp.news',NEWS_VER);
  openSheet(`<div class="between"><h3>${esc(t('nw_t'))}</h3><button class="iconbtn" data-act="sheetClose" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
   <div class="nw-list">${NEWS[L].map(([a,b])=>`<div class="nw-i"><span class="nw-dot">${ic('check')}</span><span><b>${esc(a)}</b><span>${esc(b)}</span></span></div>`).join('')}</div>
   <button class="btn gold block" data-act="sheetClose">${esc(t('got_it'))}</button>`)}
function newsCheck(){const s=ls.get('mp.news',null);if(!ls.get('mp.onb',0)){ls.set('mp.news',NEWS_VER);return}if(s!==NEWS_VER)setTimeout(()=>{if(!blocked&&!$('.ov'))newsSheet();else ls.set('mp.news',NEWS_VER)},1600)}
const HELP={es:[['Proyección en el culto','En Configuración → Proyección y reunión, cree el correo y la contraseña del equipo de medios. En meupulpito.com/projetar, la computadora del proyector (o el navegador de la smart TV) entra con esos datos y abre «Pantalla»; el celular del equipo entra con los mismos datos y es el control, con la vista previa en la computadora. El proyector se conecta por cable HDMI (por Bluetooth no pasa video). Para proyectar los puntos del sermón: menú del sermón → Enviar a la proyección. Plan Premium Iglesia.'],['Sala de reunión','Configuración → Proyección y reunión → Sala de reunión: abra la sala y envíe el enlace con el código. Hasta 6 personas, en el celular o la computadora. La conexión es directa entre los aparatos; en redes muy restringidas alguien puede no conectar. Premium Iglesia.'],['Versículos relacionados','En la Biblia toque un versículo y luego el ícono de enlace. Verá los textos relacionados, los más citados primero. También aparecen al comparar versiones.'],['Series, grabaciones y plan de lectura','Series: en el sermón toque «+ Serie». Grabar: en el Modo Predicar toque el micrófono (las grabaciones quedan en este celular, en Configuración → Mis grabaciones). Plan de lectura: en el Inicio elija un plan y marque cada día.'],['Instalar en el celular','En la pantalla de acceso toque «Instalar la aplicación». En iPhone use Safari: Compartir → «Agregar a pantalla de inicio». Queda como cualquier aplicación y abre más rápido.'],
  ['Escribir un sermón','Toque «Nuevo sermón». La primera línea es el título. Con «Versículo» escriba la cita (ej.: Juan 3:16) y el texto bíblico se coloca solo. Con «Nuevo punto» organiza el bosquejo. En «Modelos» hay estructuras listas. Todo se guarda solo.'],
  ['Predicar desde el celular','En el sermón toque «Predicar». Ajuste el tamaño de letra con «Aa», use el cronómetro y avance por partes. El botón ES/PT muestra el mismo sermón en el otro idioma sin crear una copia; revise la traducción antes.'],
  ['Programar dónde va a predicar','En Agenda toque «Programar», elija fecha, hora, lugar y el sermón. En la semana del culto aparece un aviso en el Inicio. Al predicar, queda en el historial.'],
  ['Estudiar con los diccionarios','En Diccionarios busque en español, en portugués, en hebreo, arameo o griego, o por número de Strong. Desde el editor, toque el libro para consultar e insertar en el sermón sin cerrar lo que escribe.'],
  ['Contar palabras y números en la Biblia','En Curiosidades escriba, por ejemplo, «¿cuántas veces aparece el número 40?» o «Golias». Verá el total, los libros y los versículos.'],
  ['Copia de seguridad','Sus sermones quedan guardados en su cuenta y aparecen en cualquier celular donde entre. En Configuración → «Copiar ahora» puede guardar además una copia propia.'],
  ['Cambiar idioma y apariencia','En Configuración elija Español o Português, y el tema Claro, Oscuro o Automático.'],
  ['Planes y pago','En Configuración → «Mi suscripción» elija un plan y envíe el pedido por WhatsApp. El plan no se renueva solo: le avisamos antes del vencimiento.']],
 pt:[['Projeção no culto','Em Configurações → Projeção e reunião, crie o e-mail e a senha da equipe de mídia. Em meupulpito.com/projetar, o computador do projetor (ou o navegador da smart TV) entra com esses dados e abre a «Tela»; o celular da equipe entra com os mesmos dados e é o controle, com prévia no computador. O projetor liga por cabo HDMI (por Bluetooth não passa vídeo). Para projetar os pontos do sermão: menu do sermão → Enviar para a projeção. Plano Premium Igreja.'],['Sala de reunião','Configurações → Projeção e reunião → Sala de reunião: abra a sala e envie o link com o código. Até 6 pessoas, no celular ou no computador. A conexão é direta entre os aparelhos; em redes muito restritas alguém pode não conectar. Premium Igreja.'],['Versículos relacionados','Na Bíblia toque num versículo e depois no ícone de corrente. Você verá os textos relacionados, os mais citados primeiro. Eles também aparecem ao comparar versões.'],['Séries, gravações e plano de leitura','Séries: no sermão toque em «+ Série». Gravar: no Modo Pregar toque no microfone (as gravações ficam neste celular, em Configurações → Minhas gravações). Plano de leitura: no Início escolha um plano e marque cada dia.'],['Instalar no celular','Na tela de acesso toque em «Instalar o aplicativo». No iPhone use o Safari: Compartilhar → «Adicionar à Tela de Início». Fica como qualquer aplicativo e abre mais rápido.'],
  ['Escrever um sermão','Toque em «Novo sermão». A primeira linha é o título. Com «Versículo» escreva a referência (ex.: João 3:16) e o texto bíblico é colocado sozinho. Com «Novo ponto» você organiza o esboço. Em «Modelos» há estruturas prontas. Tudo é salvo sozinho.'],
  ['Pregar pelo celular','No sermão toque em «Pregar». Ajuste o tamanho da letra em «Aa», use o cronômetro e avance por partes. O botão PT/ES mostra o mesmo sermão no outro idioma sem criar uma cópia; revise a tradução antes.'],
  ['Agendar onde vai pregar','Na Agenda toque em «Agendar», escolha data, hora, lugar e o sermão. Na semana do culto aparece um aviso no Início. Ao pregar, fica no histórico.'],
  ['Estudar com os dicionários','Em Dicionários busque em português, em espanhol, em hebraico, aramaico ou grego, ou pelo número de Strong. No editor, toque no livro para consultar e inserir no sermão sem fechar o que está escrevendo.'],
  ['Contar palavras e números na Bíblia','Em Curiosidades escreva, por exemplo, «quantas vezes aparece o número 40?» ou «Golias». Você verá o total, os livros e os versículos.'],
  ['Cópia de segurança','Seus sermões ficam guardados na sua conta e aparecem em qualquer celular em que você entrar. Em Configurações → «Copiar agora» você pode guardar também uma cópia sua.'],
  ['Trocar idioma e aparência','Em Configurações escolha Español ou Português, e o tema Claro, Escuro ou Automático.'],
  ['Planos e pagamento','Em Configurações → «Minha assinatura» escolha um plano e envie o pedido pelo WhatsApp. O plano não renova sozinho: avisamos antes do vencimento.']]};
function helpSheet(){const L=lxLang();
  openSheet(`<div class="between"><h3>${esc(t('hp_t'))}</h3><button class="iconbtn" data-act="sheetClose" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
   <div class="hp-list">${HELP[L].map(([q,a])=>`<details class="hp-i"><summary>${esc(q)}${ic('down')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
   <p class="sub" style="margin:4px 0 0;font-size:13.5px">${esc(t('hp_more'))}</p>
   <div class="two"><button class="btn ghost" data-act="report">${ic('chat')}${esc(t('hp_contact'))}</button><button class="btn ghost" data-act="onb">${ic('play')}${esc(t('ob_btn'))}</button></div>`,{cls:'big ns'})}
Object.assign(I18N.es,{nw_t:'Novedades de Meu Púlpito',hp_t:'Ayuda',hp_d:'Cómo usar cada función',hp_more:'¿No encontró lo que buscaba? Escríbanos y le respondemos.',hp_contact:'Hablar con nosotros',nw_btn:'Novedades'});
Object.assign(I18N.pt,{nw_t:'Novidades do Meu Púlpito',hp_t:'Ajuda',hp_d:'Como usar cada função',hp_more:'Não encontrou o que procurava? Escreva para nós que respondemos.',hp_contact:'Falar com a gente',nw_btn:'Novidades'});
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
/* ---------- Devocional diário, Sugestões de pregação e Manual do Ministro ---------- */
const MIN={dv:null,dvp:null,sg:null,sgp:null,mn:null,mnp:null};
const minLoad=(k,f)=>MIN[k]?Promise.resolve(MIN[k]):(MIN[k+'p']||(MIN[k+'p']=fetch('biblia/'+f+'?v=1').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>MIN[k]=d).catch(e=>{MIN[k+'p']=null;throw e})));
const mL=()=>prefs.ui==='pt'?1:0;
const MINT=['devo','sug','man','lic','il'];
const MAN_FREE=['ceia','enfermos'];
let DV={d:null},SG={k:null,q:''},MN={k:null,q:''};
const ctBox=(id,ph,v)=>`<label class="search">${ic('search')}<input id="${id}" type="search" placeholder="${esc(ph)}" value="${esc(v)}" autocomplete="off" enterkeyhint="search"></label>`;
// dia do devocional (1–365); no ano bissexto o 29 de fevereiro repete o dia 28 e o resto do ano segue igual
const isLeap=y=>y%4===0&&(y%100!==0||y%400===0);
function doy(dt){const d=dt||new Date();const y=d.getFullYear();let n=Math.floor((new Date(y,d.getMonth(),d.getDate())-new Date(y,0,1))/864e5)+1;if(isLeap(y)&&n>=60)n--;return Math.min(365,Math.max(1,n))}
function doyDate(n){const y=new Date().getFullYear();return new Date(y,0,n+(isLeap(y)&&n>=60?1:0))}
function vText(ref,L){const B=BIB[vkey(prefs.bibleVer||L)]||BIB[vkey(L)];const m=String(ref).match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/);if(!B||!m)return'';const c=(B[+m[1]]||[])[+m[2]-1]||[];const out=[];for(let v=+m[3];v<=(+m[4]||+m[3]);v++)if(c[v-1])out.push(c[v-1]);return out.join(' ')}
const eref=(r,L)=>`<button class="tag eref" data-eref="${esc(refStr(r,L))}">${esc(refStr(r,L))}</button>`;
function minNeedBible(){const L=lxLang();const k=vkey(prefs.bibleVer||L);if(!BIB[k])loadBible(prefs.bibleVer||L).then(()=>{if(MINT.includes(view.tab))render()}).catch(()=>{})}
function minHead(title){return`<div class="subhead"><button class="iconbtn" data-act="back" aria-label="${esc(t('close'))}">${ic('back')}</button><h1 class="h">${esc(title)}</h1></div>`}
function minNewSermon(title,html){if(!canNewSermon())return;[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));openEditor(null,{id:uid(),html:`<h1>${esc(title)}</h1>${html}`,lang:'',category:'',fav:false,created:Date.now(),log:[],v:2})}
/* Devocional como imagem para Status (1080×1920) e Instagram (1080×1350) */
function loadImg(src){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src})}
function wrapLines(ctx,text,maxW){const words=String(text).split(/\s+/);const lines=[];let cur='';words.forEach(w=>{const tst=cur?cur+' '+w:w;if(ctx.measureText(tst).width>maxW&&cur){lines.push(cur);cur=w}else cur=tst});if(cur)lines.push(cur);return lines}
async function dvImage(n,fmt){const L=lxLang(),l=mL();const e=MIN.dv&&MIN.dv.e[n-1];if(!e)return;try{await loadBible(prefs.bibleVer||L)}catch(x){}
  try{await Promise.all(['800 64px Manrope','600 32px Inter','400 56px Literata','700 38px Manrope'].map(f=>document.fonts.load(f)))}catch(x){}
  const W=1080,H=fmt==='st'?1920:1350;const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0B1220');g.addColorStop(.55,'#13213D');g.addColorStop(1,'#0B1220');c.fillStyle=g;c.fillRect(0,0,W,H);
  const rg=c.createRadialGradient(W*.85,H*.1,10,W*.85,H*.1,W*.75);rg.addColorStop(0,'rgba(214,173,85,.22)');rg.addColorStop(1,'rgba(214,173,85,0)');c.fillStyle=rg;c.fillRect(0,0,W,H);
  const M=96,gold='#D6AD55',top=fmt==='st'?200:110,bottom=H-(fmt==='st'?260:190);
  const d=doyDate(n).toLocaleDateString(L==='pt'?'pt-BR':'es',{day:'numeric',month:'long'});
  const vt='«'+(vText(e.v,L)||'')+'»';
  // medir o bloco: cabeçalho, título, linha, versículo e referência
  c.font="800 68px Manrope, Inter, sans-serif";const tl=wrapLines(c,e.t[l],W-2*M).slice(0,3);
  const headH=52+40+40+tl.length*82+40+6+60;const refH=40+90;
  let fs=fmt==='st'?66:56,lines=[];const room=bottom-top-headH-refH;
  for(;fs>=34;fs-=2){c.font=`400 ${fs}px Literata, Georgia, serif`;lines=wrapLines(c,vt,W-2*M);if(lines.length*fs*1.45<=room)break}
  const blockH=headH+lines.length*fs*1.45+refH;let y=top+Math.max(0,(bottom-top-blockH)/2)+40;
  c.textBaseline='alphabetic';c.fillStyle=gold;c.font="800 34px Manrope, Inter, sans-serif";c.fillText(t('dv_today').toUpperCase(),M,y);
  c.fillStyle='rgba(255,255,255,.6)';c.font="600 32px Inter, sans-serif";c.fillText(d.charAt(0).toUpperCase()+d.slice(1),M,y+52);y+=52+40+40+60;
  c.fillStyle='#fff';c.font="800 68px Manrope, Inter, sans-serif";tl.forEach(x=>{c.fillText(x,M,y);y+=82});
  y+=4;c.fillStyle=gold;c.fillRect(M,y-30,120,6);y+=60;
  c.fillStyle='#fff';c.font=`400 ${fs}px Literata, Georgia, serif`;lines.forEach(x=>{c.fillText(x,M,y);y+=fs*1.45});
  y+=20;c.fillStyle=gold;c.font="700 40px Manrope, Inter, sans-serif";c.fillText(refStr(e.v,L),M,y);c.fillStyle='rgba(255,255,255,.55)';c.font="500 28px Inter, sans-serif";c.fillText(verLabel(prefs.bibleVer||L),M,y+46);
  const fy=H-(fmt==='st'?170:110);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(M,fy-56,W-2*M,2);
  try{const mk=await loadImg('mark.png');const mh=86,mw=mk.width*mh/mk.height;c.drawImage(mk,M,fy-20,mw,mh);
    c.font="800 40px Manrope, Inter, sans-serif";c.fillStyle='#fff';c.fillText('MEU',M+mw+22,fy+30);const w1=c.measureText('MEU ').width;c.fillStyle=gold;c.fillText('PÚLPITO',M+mw+22+w1,fy+30);
    c.fillStyle='#D6AD55';c.font="700 32px Inter, sans-serif";c.fillText('meupulpito.com',M+mw+22,fy+72)}catch(x){c.fillStyle='#fff';c.font="800 40px Manrope, sans-serif";c.fillText('MEU PÚLPITO · meupulpito.com',M,fy+40)}
  return shareCanvas(cv,`devocional-${n}-${fmt==='st'?'status':'instagram'}.png`,e.t[l]+' — meupulpito.com',t('dv_img_t'))}
async function shareCanvas(cv,name,text,title){const blob=await new Promise(ok=>cv.toBlob(ok,'image/png'));const file=new File([blob],name,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],text})}catch(x){}return}
  const url=URL.createObjectURL(blob);openSheet(`<h3>${esc(title)}</h3><img src="${url}" alt="" style="width:100%;border-radius:14px"><p class="sub" style="margin:0;font-size:13px">${esc(t('dv_img_save'))}</p><a class="btn gold block" href="${url}" download="${name}">${ic('dl')}${esc(t('dv_img_dl'))}</a><button class="btn ghost block" data-act="sheetClose">${esc(t('close'))}</button>`)}
/* Imagem de divulgação com o link de indicação (Status 1080×1920 / Instagram 1080×1350) */
async function refImage(fmt){const l=mL(),link=refLink();const W=1080,H=fmt==='st'?1920:1350,st=fmt==='st';
  try{await Promise.all(['800 64px Manrope','600 32px Inter','700 38px Manrope'].map(f=>document.fonts.load(f)))}catch(x){}
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0B1220');g.addColorStop(.55,'#13213D');g.addColorStop(1,'#0B1220');c.fillStyle=g;c.fillRect(0,0,W,H);
  const rg=c.createRadialGradient(W*.5,H*.05,10,W*.5,H*.05,W*.8);rg.addColorStop(0,'rgba(214,173,85,.22)');rg.addColorStop(1,'rgba(214,173,85,0)');c.fillStyle=rg;c.fillRect(0,0,W,H);
  const gold='#D6AD55',M=96;c.textAlign='center';c.textBaseline='alphabetic';let y=st?190:90;
  try{const mk=await loadImg('mark.png');const mh=st?190:150,mw=mk.width*mh/mk.height;c.drawImage(mk,(W-mw)/2,y,mw,mh);y+=mh+(st?80:62)}catch(x){y+=120}
  c.font=`800 ${st?76:64}px Manrope, Inter, sans-serif`;const w1=c.measureText('MEU ').width,w2=c.measureText('PÚLPITO').width;let x0=(W-w1-w2)/2;c.textAlign='left';c.fillStyle='#fff';c.fillText('MEU',x0,y);c.fillStyle=gold;c.fillText('PÚLPITO',x0+w1,y);c.textAlign='center';
  y+=st?58:48;c.fillStyle='rgba(255,255,255,.7)';c.font=`700 ${st?28:24}px Inter, sans-serif`;c.fillText(t('tagline').split('').join(String.fromCharCode(8202)),W/2,y);
  y+=st?120:84;c.fillStyle='#fff';c.font=`800 ${st?60:52}px Manrope, Inter, sans-serif`;wrapLines(c,t('ri_h'),W-2*M).forEach(s=>{c.fillText(s,W/2,y);y+=st?74:64});
  y+=st?40:16;c.textAlign='left';const items=t('ri_items').split('|');const fs=st?38:33,lh=st?84:66;c.font=`600 ${fs}px Inter, sans-serif`;
  const iw=Math.max(...items.map(s=>c.measureText(s).width))+70;const ix=Math.max(M,(W-iw)/2);
  items.forEach(s=>{c.strokeStyle=gold;c.lineWidth=6;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(ix+4,y-fs*.32);c.lineTo(ix+16,y-fs*.32+12);c.lineTo(ix+38,y-fs*.32-14);c.stroke();c.fillStyle='rgba(255,255,255,.92)';c.fillText(s,ix+70,y);y+=lh});
  // caixa do convite
  const bh=st?330:262,by=H-(st?150:70)-bh;c.fillStyle='rgba(214,173,85,.12)';c.strokeStyle='rgba(214,173,85,.55)';c.lineWidth=3;c.beginPath();c.roundRect?c.roundRect(M,by,W-2*M,bh,36):c.rect(M,by,W-2*M,bh);c.fill();c.stroke();
  c.textAlign='center';let yy=by+(st?82:66);c.fillStyle=gold;c.font=`800 ${st?48:42}px Manrope, Inter, sans-serif`;c.fillText(t('ri_free'),W/2,yy);
  yy+=st?66:56;c.fillStyle='#fff';c.font=`700 ${st?40:36}px Inter, sans-serif`;let lk=link.replace('https://','');while(c.measureText(lk).width>W-2*M-60)c.font=c.font.replace(/\d+px/,m=>(parseInt(m)-2)+'px');c.fillText(lk,W/2,yy);
  yy+=st?60:52;c.fillStyle='rgba(255,255,255,.75)';c.font=`500 ${st?30:27}px Inter, sans-serif`;wrapLines(c,t('ri_rol'),W-2*M-80).slice(0,2).forEach(s=>{c.fillText(s,W/2,yy);yy+=st?40:35});
  const nm=(meta&&meta.name||'').trim();if(nm){c.fillStyle='rgba(255,255,255,.6)';c.font=`600 ${st?30:26}px Inter, sans-serif`;c.fillText(t('ri_by',{n:nm}),W/2,by+bh+(st?70:50))}
  return shareCanvas(cv,`meu-pulpito-${st?'status':'instagram'}.png`,t('rf_msg',{l:link}),t('ri_t'))}
/* Devocional */
function devoCardHtml(){const L=lxLang(),l=mL();if(!MIN.dv){if(!devoCardHtml._l){devoCardHtml._l=1;minLoad('dv','devocional.json').then(()=>{if(view.tab==='home'&&!view.overlay)refreshBg()}).catch(()=>{})}return''}
  const e=MIN.dv.e[doy()-1];if(!e)return'';const read=ls.get('mp.dv.read','')===todayISO();
  return`<button class="dv-card" data-act="tab" data-k="devo"><span class="dv-k">${ic('bible')}${esc(t('dv_today'))}${read?` · ${esc(t('dv_read'))}`:''}</span><b>${esc(e.t[l])}</b><span>${esc(refStr(e.v,L))}</span></button>`}
function devoHtml(){const L=lxLang(),l=mL();if(!MIN.dv)return minHead(t('dv_t'))+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  minNeedBible();const n=DV.d||doy();const e=MIN.dv.e[n-1];const today=n===doy();if(today)ls.set('mp.dv.read',todayISO());
  const d=doyDate(n);const vt=vText(e.v,L);
  return minHead(t('dv_t'))+`<div class="dv-page">
   <div class="between"><button class="iconbtn" data-dv="prev" aria-label="${esc(t('dv_prev'))}" ${n<=1?'disabled':''}>${ic('back')}</button><span class="dv-date">${esc((today?t('dv_today')+' · ':'')+d.toLocaleDateString(L==='pt'?'pt-BR':'es',{weekday:'long',day:'numeric',month:'long'}))}</span><button class="iconbtn" data-dv="next" aria-label="${esc(t('dv_next'))}" ${n>=365?'disabled':''}>${ic('next')}</button></div>
   <h2 class="dv-title">${esc(e.t[l])}</h2>
   <blockquote class="dv-verse">${vt?esc(vt):esc(t('dx_load'))}<cite>${eref(e.v,L)} <small>${esc(verLabel(prefs.bibleVer||L))}</small></cite></blockquote>
   <p class="dv-text">${esc(e.r[l])}</p>
   <div class="dv-box"><span class="lbl">${esc(t('dv_app'))}</span><p>${esc(e.a[l])}</p></div>
   <div class="dv-box pray"><span class="lbl">${esc(t('dv_pray'))}</span><p>${esc(e.o[l])}</p></div>
   <div class="row" style="gap:8px;flex-wrap:wrap">${!today?`<button class="btn sm ghost" data-dv="today">${esc(t('dv_go_today'))}</button>`:''}<button class="btn sm ghost" data-dv="share">${ic('share')}${esc(t('cu_share'))}</button><button class="btn sm ghost" data-dv="st">${ic('cam')}${esc(t('dv_img_st'))}</button><button class="btn sm ghost" data-dv="ig">${ic('cam')}${esc(t('dv_img_ig'))}</button><button class="btn sm ghost" data-dv="vid">${ic('video')}${esc(t('vd_act'))}</button><button class="btn sm gold" data-dv="serm">${ic('pen')}${esc(t('dv_serm'))}</button></div>
   <a class="dv-ch" href="https://whatsapp.com/channel/0029Vb9d3dXFHWpvOk3CTm3J" target="_blank" rel="noopener">${ic('chat')}<span><b>${esc(t('dv_ch_t'))}</b><span>${esc(t('dv_ch_d'))}</span></span>${ic('next')}</a>
   <p class="sub" style="font-size:12px;margin:0">${esc(t('dv_day',{n}))}</p></div>`}
/* Sugestões de pregação */
function sugHtml(){const L=lxLang(),l=mL();if(!MIN.sg)return minHead(t('sg_t'))+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  const O=MIN.sg.occ;const o=SG.k&&O.find(x=>x.k===SG.k);
  const sq=ilNorm(SG.q.trim());
  if(!o&&sq){const hits=[];O.forEach(oc=>oc.s.forEach((x,i)=>{if(ilNorm([oc.n[l],x.t[l],refStr(x.v,L),x.i[l],x.a[l],...x.p.map(p=>p.t[l]+' '+refStr(p.v,L))].join(' ')).includes(sq))hits.push({oc,x,i})}));
    return minHead(t('sg_t'))+ctBox('sgQ',t('sg_ph'),SG.q)+`<p class="sub" style="margin:0;font-size:12px">${esc(t(hits.length===1?'ct_res1':'ct_res',{n:hits.length}))}</p><div class="sg-list">${hits.length?hits.map(h=>`<button class="sg-card lc-it" data-sg="occ" data-k="${esc(h.oc.k)}" data-i="${h.i}"><span class="il-tag">${esc(h.oc.n[l])}</span><div class="between"><b>${esc(h.x.t[l])}</b>${isPremium()||h.i===0?'':`<span class="cu-lock">Premium</span>`}</div><span class="sg-v">${esc(refStr(h.x.v,L))}</span><span class="sub" style="font-size:13px;line-height:1.45">${esc(h.x.p.map(p=>p.t[l]).join(' · '))}</span></button>`).join(''):`<div class="empty"><p style="margin:0">${esc(t('sg_none'))}</p></div>`}</div>`}
  if(!o)return minHead(t('sg_t'))+`<p class="sub" style="margin:0 0 4px;line-height:1.5">${esc(t('sg_d'))}</p>`+ctBox('sgQ',t('sg_ph'),SG.q)+`<div class="mn-grid">${O.map(x=>`<button class="mn-it" data-sg="occ" data-k="${esc(x.k)}"><b>${esc(x.n[l])}</b><span>${esc(x.d[l])}</span></button>`).join('')}</div>`;
  return minHead(o.n[l])+`<button class="lnk dx-back" data-sg="back">${ic('back')}${esc(t('sg_all'))}</button><p class="sub" style="margin:0;line-height:1.5">${esc(o.d[l])}</p>
   <div class="sg-list">${o.s.map((x,i)=>{const free=isPremium()||i===0;return`<div class="sg-card${free?'':' sg-lk'}" id="sg${i}"><div class="between"><b>${esc(x.t[l])}</b>${free?'':`<span class="cu-lock">Premium</span>`}</div><span class="sg-v">${eref(x.v,L)}</span>
     ${free?`<p>${esc(x.i[l])}</p><ol>${x.p.map(p=>`<li><span>${esc(p.t[l])}</span> ${eref(p.v,L)}</li>`).join('')}</ol><p class="sg-ap"><b>${esc(t('sg_ap'))}:</b> ${esc(x.a[l])}</p><button class="btn sm gold" data-sg="use" data-i="${i}">${ic('pen')}${esc(t('sg_use'))}</button>`:`<button class="btn sm ghost" data-sg="lock">${ic('lock')}${esc(t('sg_unlock'))}</button>`}</div>`}).join('')}</div>`}
/* Manual do Ministro */
function manHtml(){const L=lxLang(),l=mL();if(!MIN.mn)return minHead(t('mn_t'))+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  const C=MIN.mn.c;const c=MN.k&&C.find(x=>x.k===MN.k);
  const mq=ilNorm(MN.q.trim());
  if(!c&&mq){const hits=C.filter(x=>ilNorm(x.n[l]+' '+x.d[l]+' '+t('mn_cat_'+x.cat)+' '+x.ordem.map(o=>o.t[l]).join(' ')).includes(mq));
    return minHead(t('mn_t'))+ctBox('mnQ',t('mn_ph'),MN.q)+`<p class="sub" style="margin:0;font-size:12px">${esc(t(hits.length===1?'ct_res1':'ct_res',{n:hits.length}))}</p><div class="mn-grid">${hits.length?hits.map(x=>`<button class="mn-it" data-mn="open" data-k="${esc(x.k)}"><span class="il-tag">${esc(t('mn_cat_'+x.cat))}</span><b>${esc(x.n[l])}</b><span>${esc(x.d[l])}</span>${isPremium()||MAN_FREE.includes(x.k)?'':`<span class="cu-lock">Premium</span>`}</button>`).join(''):`<div class="empty"><p style="margin:0">${esc(t('mn_none'))}</p></div>`}</div>`}
  if(!c){const cats=[...new Set(C.map(x=>x.cat))];return minHead(t('mn_t'))+`<p class="sub" style="margin:0 0 4px;line-height:1.5">${esc(t('mn_d'))}</p>`+ctBox('mnQ',t('mn_ph'),MN.q)+cats.map(k=>`<span class="sect">${esc(t('mn_cat_'+k))}</span><div class="mn-grid">${C.filter(x=>x.cat===k).map(x=>`<button class="mn-it" data-mn="open" data-k="${esc(x.k)}"><b>${esc(x.n[l])}</b><span>${esc(x.d[l])}</span>${isPremium()||MAN_FREE.includes(x.k)?'':`<span class="cu-lock">Premium</span>`}</button>`).join('')}</div>`).join('')}
  return minHead(c.n[l])+`<button class="lnk dx-back" data-mn="back">${ic('back')}${esc(t('mn_all'))}</button><div class="mn-page">
   <p class="mn-d">${esc(c.d[l])}</p>
   <span class="lbl">${esc(t('mn_prep'))}</span><ul class="mn-ck">${c.prep.map(x=>`<li>${ic('check')}<span>${esc(x[l])}</span></li>`).join('')}</ul>
   <span class="lbl">${esc(t('mn_ord'))}</span><ol class="mn-ord">${c.ordem.map(x=>`<li><b>${esc(x.t[l])}</b><span>${esc(x.d[l])}</span></li>`).join('')}</ol>
   <span class="lbl">${esc(t('mn_txt'))}</span><div class="sd-es">${c.textos.map(r=>eref(r,L)).join('')}</div>
   <span class="lbl">${esc(t('mn_fal'))}</span>${c.falas.map((f,i)=>`<details class="mn-f"${i===0?' open':''}><summary>${esc(f.t[l])}</summary><p>${esc(f.x[l]).replace(/\n/g,'<br>')}</p><button class="btn sm ghost" data-mn="copy" data-i="${i}">${ic('copy')}${esc(t('copy_txt'))}</button></details>`).join('')}
   <span class="lbl">${esc(t('mn_obs'))}</span><ul class="mn-obs">${c.obs.map(x=>`<li>${esc(x[l])}</li>`).join('')}</ul>
   <button class="btn gold block" data-mn="doc">${ic('pen')}${esc(t('mn_doc'))}</button>
   <p class="sub" style="margin:0;font-size:12px;text-align:center">${esc(t('mn_model'))}</p></div>`}
/* Lições para células e Escola Dominical: a 1ª lição de cada série é grátis */
let LC={s:null,i:null,q:''},IL={tema:'',q:'',lim:30};
function licOk(i){return isPremium()||i===0}
function licText(x,L,l){const o=[x.t[l],t('rp_base')+': '+refStr(x.v,L),'',t('lc_obj')+': '+x.obj[l],'',t('lc_gelo')+': '+x.gelo[l],'',x.intro[l],''];
  x.pts.forEach((p,i)=>{o.push((i+1)+'. '+p.t[l]+' ('+refStr(p.v,L)+')',p.x[l],'')});
  o.push(t('lc_perg')+':');x.perg.forEach((p,i)=>o.push((i+1)+') '+p[l]));o.push('',t('lc_apl')+': '+x.apl[l],'',t('lc_mem')+': '+refStr(x.mem,L),'',t('dv_pray')+': '+x.or[l],'','— Meu Púlpito · meupulpito.com');return o.join('\n')}
function licHtml(){const L=lxLang(),l=mL();if(!MIN.lc)return minHead(t('lc_t'))+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  const SS=MIN.lc.series;const sr=LC.s&&SS.find(x=>x.k===LC.s);
  const lq=ilNorm(LC.q.trim());
  if(!sr&&lq){const hits=[];SS.forEach(se=>se.l.forEach((y,i)=>{if(ilNorm([se.n[l],y.t[l],refStr(y.v,L),y.obj[l],...y.pts.map(p=>p.t[l])].join(' ')).includes(lq))hits.push({se,y,i})}));
    return minHead(t('lc_t'))+ctBox('lcQ',t('lc_ph'),LC.q)+`<p class="sub" style="margin:0;font-size:12px">${esc(t(hits.length===1?'ct_res1':'ct_res',{n:hits.length}))}</p><div class="sg-list">${hits.length?hits.map(h=>`<button class="sg-card lc-it" data-lc="go" data-k="${esc(h.se.k)}" data-i="${h.i}"><span class="il-tag">${esc(h.se.n[l])} · ${esc(t('lc_les',{n:h.i+1,m:h.se.l.length}))}</span><div class="between"><b>${esc(h.y.t[l])}</b>${licOk(h.i)?'':`<span class="cu-lock">Premium</span>`}</div><span class="sg-v">${esc(refStr(h.y.v,L))}</span><span class="sub" style="font-size:13px;line-height:1.45">${esc(h.y.obj[l])}</span></button>`).join(''):`<div class="empty"><p style="margin:0">${esc(t('lc_none'))}</p></div>`}</div>`}
  if(!sr)return minHead(t('lc_t'))+`<p class="sub" style="margin:0 0 4px;line-height:1.5">${esc(t('lc_d'))}</p>`+ctBox('lcQ',t('lc_ph'),LC.q)+`<div class="mn-grid">${SS.map(x=>`<button class="mn-it" data-lc="ser" data-k="${esc(x.k)}"><b>${esc(x.n[l])}</b><span>${esc(x.d[l])}</span><span class="sub" style="font-size:12px">${esc(t('lc_n',{n:x.l.length}))}</span></button>`).join('')}</div>`;
  const x=LC.i!=null&&sr.l[LC.i];
  if(!x)return minHead(sr.n[l])+`<button class="lnk dx-back" data-lc="back">${ic('back')}${esc(t('lc_all'))}</button><p class="sub" style="margin:0;line-height:1.5">${esc(sr.d[l])}</p>
   <div class="sg-list">${sr.l.map((y,i)=>`<button class="sg-card lc-it" data-lc="open" data-i="${i}"><div class="between"><b>${i+1}. ${esc(y.t[l])}</b>${licOk(i)?'':`<span class="cu-lock">Premium</span>`}</div><span class="sg-v">${esc(refStr(y.v,L))}</span><span class="sub" style="font-size:13px;line-height:1.45">${esc(y.obj[l])}</span></button>`).join('')}</div>`;
  minNeedBible();const vt=vText(x.v,L);
  return minHead(sr.n[l])+`<button class="lnk dx-back" data-lc="list">${ic('back')}${esc(t('lc_back'))}</button><div class="mn-page lc-page">
   <span class="lbl">${esc(t('lc_les',{n:LC.i+1,m:sr.l.length}))}</span><h2 class="dv-title">${esc(x.t[l])}</h2>
   <blockquote class="dv-verse">${vt?esc(vt):esc(t('dx_load'))}<cite>${eref(x.v,L)} <small>${esc(verLabel(prefs.bibleVer||L))}</small></cite></blockquote>
   <div class="dv-box"><span class="lbl">${esc(t('lc_obj'))}</span><p>${esc(x.obj[l])}</p></div>
   <div class="dv-box"><span class="lbl">${esc(t('lc_gelo'))}</span><p>${esc(x.gelo[l])}</p></div>
   <span class="lbl">${esc(t('lc_intro'))}</span><p class="dv-text">${esc(x.intro[l])}</p>
   <ol class="mn-ord lc-pts">${x.pts.map(p=>`<li><b>${esc(p.t[l])}</b><span>${eref(p.v,L)}</span><span>${esc(p.x[l])}</span></li>`).join('')}</ol>
   <span class="lbl">${esc(t('lc_perg'))}</span><ol class="lc-q">${x.perg.map(p=>`<li>${esc(p[l])}</li>`).join('')}</ol>
   <div class="dv-box"><span class="lbl">${esc(t('lc_apl'))}</span><p>${esc(x.apl[l])}</p></div>
   <div class="dv-box"><span class="lbl">${esc(t('lc_mem'))}</span><p>${vText(x.mem,L)?'«'+esc(vText(x.mem,L))+'» ':''}${eref(x.mem,L)}</p></div>
   <div class="dv-box pray"><span class="lbl">${esc(t('dv_pray'))}</span><p>${esc(x.or[l])}</p></div>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-lc="share">${ic('share')}${esc(t('lc_share'))}</button><button class="btn sm ghost" data-lc="copy">${ic('copy')}${esc(t('copy_txt'))}</button><button class="btn sm gold" data-lc="doc">${ic('pen')}${esc(t('lc_doc'))}</button></div>
   <div class="between">${LC.i>0?`<button class="btn sm ghost" data-lc="prev">${ic('back')}${esc(t('lc_prev'))}</button>`:'<span></span>'}${LC.i<sr.l.length-1?`<button class="btn sm ghost" data-lc="next">${esc(t('lc_next'))}${ic('next')}</button>`:''}</div></div>`}
/* Banco de ilustrações: 2 grátis por tema */
const IL_FREE=2;
function ilOk(x){if(isPremium())return true;const T=MIN.il.il.filter(y=>y.tema===x.tema);return T.indexOf(x)<IL_FREE}
const ilNorm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function ilText(x,L,l){return[x.t[l],'',x.x[l],'',t('il_ap')+': '+x.ap[l],'',x.v.map(r=>refStr(r,L)).join(' · '),'','— Meu Púlpito · meupulpito.com'].join('\n')}
function ilHtml(){const L=lxLang(),l=mL();if(!MIN.il)return minHead(t('il_t'))+`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`;
  const A=MIN.il.il;const temas=[...new Set(A.map(x=>x.tema))];const q=ilNorm(IL.q.trim());
  const list=A.filter(x=>(!IL.tema||x.tema===IL.tema)&&(!q||ilNorm(x.t[l]+' '+x.x[l]+' '+x.ap[l]+' '+t('ilt_'+x.tema)).includes(q)));
  return minHead(t('il_t'))+`<p class="sub" style="margin:0 0 4px;line-height:1.5">${esc(t('il_d'))}</p>
   <label class="search">${ic('search')}<input id="ilQ" type="search" placeholder="${esc(t('il_ph'))}" value="${esc(IL.q)}" autocomplete="off" enterkeyhint="search"></label>
   <div class="chips"><button class="chip" data-il="tema" data-k="" aria-pressed="${!IL.tema}">${esc(t('il_all'))}</button>${temas.map(k=>`<button class="chip" data-il="tema" data-k="${k}" aria-pressed="${IL.tema===k}">${esc(t('ilt_'+k))}</button>`).join('')}</div>
   <p class="sub" style="margin:0;font-size:12px">${esc(t('il_cnt',{n:list.length}))}</p>
   <div class="sg-list">${list.length?list.slice(0,IL.lim).map(x=>{const ok=ilOk(x);const i=A.indexOf(x);return`<div class="sg-card il-card${ok?'':' sg-lk'}"><div class="between"><b>${esc(x.t[l])}</b>${ok?'':`<span class="cu-lock">Premium</span>`}</div><span class="il-tag">${esc(t('ilt_'+x.tema))} · ${esc(t('ilk_'+x.tipo))}</span>
     ${ok?`<p>${esc(x.x[l])}</p><p class="sg-ap"><b>${esc(t('il_ap'))}:</b> ${esc(x.ap[l])}</p><span class="sg-v">${x.v.map(r=>eref(r,L)).join('')}</span><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" data-il="copy" data-i="${i}">${ic('copy')}${esc(t('copy_txt'))}</button><button class="btn sm gold" data-il="use" data-i="${i}">${ic('pen')}${esc(t('il_use'))}</button></div>`:`<button class="btn sm ghost" data-il="lock">${ic('lock')}${esc(t('il_unlock'))}</button>`}</div>`}).join(''):`<div class="empty"><p style="margin:0">${esc(t('il_none'))}</p></div>`}</div>
   ${list.length>IL.lim?`<button class="btn ghost block" data-il="more">${esc(t('il_more',{n:list.length-IL.lim}))}</button>`:''}
   <p class="sub" style="margin:0;font-size:12px;text-align:center">${esc(t('il_note'))}</p>`}
document.addEventListener('input',e=>{const M={ilQ:['il',IL],sgQ:['sug',SG],lcQ:['lic',LC],mnQ:['man',MN]}[e.target.id];if(!M||view.tab!==M[0])return;M[1].q=e.target.value;if(M[1]===IL)IL.lim=30;clearTimeout(ilHtml._t);ilHtml._t=setTimeout(()=>{if(view.tab===M[0])render()},250)});
document.addEventListener('click',e=>{const L=lxLang(),l=mL();
  const lc=e.target.closest('[data-lc]');if(lc&&view.tab==='lic'){const a=lc.dataset.lc;const sr=MIN.lc&&LC.s&&MIN.lc.series.find(x=>x.k===LC.s);const x=sr&&LC.i!=null&&sr.l[LC.i];
    if(a==='ser'){LC.s=lc.dataset.k;LC.i=null;render();scrollTo(0,0)}else if(a==='go'){const i=+lc.dataset.i;if(!licOk(i)){planGate('lic');return}LC.s=lc.dataset.k;LC.i=i;render();scrollTo(0,0)}else if(a==='back'){LC.s=null;LC.i=null;render()}else if(a==='list'){LC.i=null;render();scrollTo(0,0)}
    else if(a==='open'||a==='prev'||a==='next'){const i=a==='open'?+lc.dataset.i:LC.i+(a==='next'?1:-1);if(!licOk(i)){planGate('lic');return}LC.i=i;render();scrollTo(0,0)}
    else if(a==='share'&&x){const txt=licText(x,L,l);if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')))}
    else if(a==='copy'&&x)copyText(licText(x,L,l)).then(()=>toast(t('copied')))
    else if(a==='doc'&&x)minNewSermon(x.t[l],`<p>${esc(t('rp_base'))}: ${esc(refStr(x.v,L))}</p><h2>${esc(t('lc_obj'))}</h2><p>${esc(x.obj[l])}</p><h2>${esc(t('lc_gelo'))}</h2><p>${esc(x.gelo[l])}</p><h2>${esc(t('lc_intro'))}</h2><p>${esc(x.intro[l])}</p>${x.pts.map((p,i)=>`<h2>${i+1}. ${esc(p.t[l])}</h2><p>${esc(refStr(p.v,L))}</p><p>${esc(p.x[l])}</p>`).join('')}<h2>${esc(t('lc_perg'))}</h2><ol>${x.perg.map(p=>`<li>${esc(p[l])}</li>`).join('')}</ol><h2>${esc(t('lc_apl'))}</h2><p>${esc(x.apl[l])}</p><p>${esc(t('lc_mem'))}: ${esc(refStr(x.mem,L))}</p><h2>${esc(t('dv_pray'))}</h2><p>${esc(x.or[l])}</p>`);return}
  const il=e.target.closest('[data-il]');if(il&&view.tab==='il'){const a=il.dataset.il;const x=MIN.il&&MIN.il.il[+il.dataset.i];
    if(a==='tema'){IL.tema=il.dataset.k;IL.lim=30;render()}else if(a==='more'){IL.lim+=30;render()}else if(a==='lock')planGate('il')
    else if(a==='copy'&&x)copyText(ilText(x,L,l)).then(()=>toast(t('copied')))
    else if(a==='use'&&x)minNewSermon(x.t[l],`<p><br></p><h2>${esc(t('il_one'))}</h2><p>${esc(x.x[l])}</p><p>${esc(t('il_ap'))}: ${esc(x.ap[l])}</p><p>${x.v.map(r=>esc(refStr(r,L))).join(' · ')}</p>`);return}});
Object.assign(I18N.es,{es_t:'Escritorio',es_d:'Pastores, pagos, precios, sitio, avisos y atención',rl_test_d:'Vea la ruleta como la ve un pastor invitado'});
Object.assign(I18N.pt,{es_t:'Escritório',es_d:'Pastores, pagamentos, preços, site, avisos e atendimento',rl_test_d:'Veja a roleta como um pastor indicado vê'});
Object.assign(I18N.es,{bk_all:'Descargar todo',bk_all_d:'Sermones, agenda, anotaciones y datos de la iglesia en un solo archivo.',bk_dl:'Descargar',bk_prep:'Preparando el archivo…',bk_has:'El archivo contiene',bk_s:'Sermones',bk_a:'Eventos en la agenda',bk_n:'Anotaciones',bk_i:'Registros de Mi Iglesia',bk_save:'Guardar archivo',bk_tip:'En el iPhone, elija «Guardar en Archivos» o envíelo a usted mismo por WhatsApp. Para recuperarlo, toque «Importar» aquí en la configuración y elija este archivo.',bk_all_ok:'Copia guardada',bk_pick:'Elegir archivo',bk_or:'O pegue el texto de una copia',bk_bad:'Este archivo no es una copia de Meu Púlpito',bk_ig_ok:'Datos de la iglesia restaurados ({n})',bk_ig_lock:'los datos de la iglesia solo se restauran con el plan Premium Iglesia',restore_d:'Elija el archivo guardado en «Descargar todo» o pegue el texto de una copia de seguridad.'});
Object.assign(I18N.pt,{bk_all:'Baixar tudo',bk_all_d:'Sermões, agenda, anotações e dados da igreja num arquivo só.',bk_dl:'Baixar',bk_prep:'Preparando o arquivo…',bk_has:'O arquivo contém',bk_s:'Sermões',bk_a:'Eventos na agenda',bk_n:'Anotações',bk_i:'Registros do Minha Igreja',bk_save:'Salvar arquivo',bk_tip:'No iPhone, escolha «Salvar em Arquivos» ou envie para você mesmo no WhatsApp. Para recuperar, toque em «Importar» aqui nas configurações e escolha este arquivo.',bk_all_ok:'Cópia salva',bk_pick:'Escolher arquivo',bk_or:'Ou cole o texto de uma cópia',bk_bad:'Este arquivo não é uma cópia do Meu Púlpito',bk_ig_ok:'Dados da igreja restaurados ({n})',bk_ig_lock:'os dados da igreja só são restaurados com o plano Premium Igreja',restore_d:'Escolha o arquivo salvo em «Baixar tudo» ou cole o texto de uma cópia de segurança.'});
/* ============ Minha Igreja: o código fica em igreja.js e só é baixado quando o pastor abre ============ */
Object.assign(I18N.es,{ig_t:"Mi Iglesia",ig_pl:"Premium Iglesia",ig_home:"Miembros, diezmos, células, escalas, agenda y más",ig_f1:"Registro de miembros y congregados",ig_f2:"Cumpleaños del mes, con felicitación por WhatsApp",ig_f3:"Visitantes y seguimiento",ig_f4:"Asistencia en cultos, células y Escuela Dominical",ig_f5:"Informe de la iglesia para compartir",ig_f6:"Diezmos y ofrendas, con saldo e informe del mes",ig_f7:"Células y escalas del mes",ig_f8:"Agenda, avisos, pedidos de oración y visitas",ig_f9:"11 certificados, 12 cartas y declaraciones, recibo, oficio, acta, fichas, carné y credencial",ig_ld_err:"No fue posible abrir Mi Iglesia ahora. Verifique la conexión a internet e intente de nuevo."});Object.assign(I18N.pt,{ig_t:"Minha Igreja",ig_pl:"Premium Igreja",ig_home:"Membros, dízimos, células, escalas, agenda e mais",ig_f1:"Cadastro de membros e congregados",ig_f2:"Aniversariantes do mês, com parabéns pelo WhatsApp",ig_f3:"Visitantes e acompanhamento",ig_f4:"Presença nos cultos, células e Escola Dominical",ig_f5:"Relatório da igreja para compartilhar",ig_f6:"Dízimos e ofertas, com saldo e relatório do mês",ig_f7:"Células e escalas do mês",ig_f8:"Agenda, avisos, pedidos de oração e visitas",ig_f9:"11 certificados, 12 cartas e declarações, recibo, ofício, ata, fichas, carteirinha e credencial",ig_ld_err:"Não foi possível abrir o Minha Igreja agora. Verifique a internet e tente de novo."});
let IGM=null,IGP=null,IGE=false;
const igWant=()=>!!planNow().igreja&&!!authU&&!localMode;
function igLoad(){if(IGM)return Promise.resolve(IGM);
  if(!IGP)IGP=fetch('igreja.js').then(r=>{if(!r.ok)throw new Error('igreja.js '+r.status);return r.text()}).then(src=>{IGM=eval(src+'\n//# sourceURL=igreja.js');IGE=false;return IGM}).catch(e=>{IGP=null;IGE=true;throw e});
  return IGP}
function igrHtml(){if(IGM)return IGM.igrHtml();
  if(!IGE)igLoad().then(()=>{if(view.tab==='igr')render()},()=>{if(view.tab==='igr')render()});
  return minHead(t('ig_t'))+(IGE?`<div class="empty"><p style="margin:0">${esc(t('ig_ld_err'))}</p><button class="btn gold" data-act="igRetry">${esc(t('retry'))}</button></div>`:`<div class="empty"><p style="margin:0">${esc(t('dx_load'))}</p></div>`)}
function igHomeHtml(){if(IGM)return IGM.igHomeHtml();
  if(igWant()&&!IGE&&!IGP)setTimeout(()=>{if(igWant()&&!IGM)igLoad().then(()=>{if(view.tab==='home')refreshBg()},()=>{})},1500);return''}
function igBackup(){return igWant()?igLoad().then(m=>m.igBackup()):Promise.resolve(null)}
function igRestore(o){return igWant()&&o?igLoad().then(m=>m.igRestore(o)):Promise.resolve(0)}

function minAfter(){const k={devo:['dv','devocional.json'],sug:['sg','sugestoes.json'],man:['mn','manual.json'],lic:['lc','licoes.json'],il:['il','ilustracoes.json']}[view.tab];const tab=view.tab;if(k&&!MIN[k[0]])minLoad(k[0],k[1]).then(()=>{if(view.tab===tab)render()}).catch(()=>{const a=$('#app .empty p');if(a)a.textContent=t('dict_err')})}
document.addEventListener('click',e=>{const L=lxLang(),l=mL();
  const r=e.target.closest('[data-eref]');if(r&&MINT.includes(view.tab)&&!r.closest('.ov')){compareRef(r.dataset.eref,null,L);return}
  const dv=e.target.closest('[data-dv]');if(dv&&view.tab==='devo'){const a=dv.dataset.dv,n=DV.d||doy();const ent=MIN.dv&&MIN.dv.e[n-1];
    if(a==='prev'){DV.d=Math.max(1,n-1);render();scrollTo(0,0)}else if(a==='next'){DV.d=Math.min(365,n+1);render();scrollTo(0,0)}else if(a==='today'){DV.d=null;render()}
    else if(a==='share'&&ent){const vt=vText(ent.v,L);const txt=[ent.t[l],'',vt?'«'+vt+'» — '+refStr(ent.v,L):refStr(ent.v,L),'',ent.r[l],'',t('dv_app')+': '+ent.a[l],'','— '+t('dv_t')+' · Meu Púlpito','https://meupulpito.com'].join('\n');if(navigator.share)navigator.share({text:txt}).catch(()=>{});else copyText(txt).then(()=>toast(t('copied')))}
    else if(a==='vid'&&ent){if(!isPremium()){planGate('vid');return}loadBible(prefs.bibleVer||lxLang()).catch(()=>{}).then(()=>videoSheet(vdDevo(ent)))}
    else if((a==='st'||a==='ig')&&ent){dv.disabled=true;dvImage(n,a).finally(()=>{dv.disabled=false})}
    else if(a==='serm'&&ent)minNewSermon(ent.t[l],`<p>${esc(t('rp_base'))}: ${esc(refStr(ent.v,L))}</p><p>${esc(ent.r[l])}</p><p><br></p>`);return}
  const sg=e.target.closest('[data-sg]');if(sg&&view.tab==='sug'){const a=sg.dataset.sg;
    if(a==='occ'){SG.k=sg.dataset.k;render();scrollTo(0,0);if(sg.dataset.i){const el=document.getElementById('sg'+sg.dataset.i);if(el)setTimeout(()=>el.scrollIntoView({block:'start',behavior:'smooth'}),50)}}else if(a==='back'){SG.k=null;render()}else if(a==='lock')planGate('sug')
    else if(a==='use'){const o=MIN.sg.occ.find(x=>x.k===SG.k);const x=o&&o.s[+sg.dataset.i];if(!x)return;
      minNewSermon(x.t[l],`<p>${esc(t('rp_base'))}: ${esc(refStr(x.v,L))}</p><p>${esc(x.i[l])}</p>${x.p.map((p,i)=>`<h2>${i+1}. ${esc(p.t[l])}</h2><p>${esc(refStr(p.v,L))}</p><p><br></p>`).join('')}<h2>${esc(t('sg_ap'))}</h2><p>${esc(x.a[l])}</p>`)}return}
  const mn=e.target.closest('[data-mn]');if(mn&&view.tab==='man'){const a=mn.dataset.mn;const c=MIN.mn&&MN.k&&MIN.mn.c.find(x=>x.k===MN.k);
    if(a==='open'){const k=mn.dataset.k;if(!isPremium()&&!MAN_FREE.includes(k)){planGate('man');return}MN.k=k;render();scrollTo(0,0)}else if(a==='back'){MN.k=null;render()}
    else if(a==='copy'&&c){const f=c.falas[+mn.dataset.i];copyText(f.x[l]).then(()=>toast(t('copied')))}
    else if(a==='doc'&&c)minNewSermon(c.n[l],`<h2>${esc(t('mn_ord'))}</h2><ol>${c.ordem.map(x=>`<li><b>${esc(x.t[l])}</b> — ${esc(x.d[l])}</li>`).join('')}</ol><h2>${esc(t('mn_txt'))}</h2><p>${c.textos.map(r=>esc(refStr(r,L))).join(' · ')}</p>${c.falas.map(f=>`<h2>${esc(f.t[l])}</h2><p>${esc(f.x[l]).replace(/\n/g,'<br>')}</p>`).join('')}`);return}});
Object.assign(I18N.es,{lc_t:'Lecciones para células y Escuela Dominical',lc_home:'Series de estudios listas para enseñar en grupo',lc_d:'Series de estudios bíblicos para células, Escuela Dominical y grupos pequeños. Cada lección trae objetivo, rompehielos, puntos con textos, preguntas, aplicación, versículo para memorizar y oración. La primera lección de cada serie es gratis.',lc_n:'{n} lecciones',lc_all:'Todas las series',lc_les:'Lección {n} de {m}',lc_obj:'Objetivo',lc_gelo:'Para romper el hielo',lc_intro:'Introducción (para el líder)',lc_perg:'Preguntas para conversar',lc_apl:'Aplicación',lc_mem:'Versículo para memorizar',lc_share:'Enviar al grupo',lc_doc:'Abrir como documento',lc_back:'Volver a las lecciones',lc_prev:'Anterior',lc_next:'Siguiente',pk_lic:'Acceda a todas las lecciones de cada serie para células y Escuela Dominical.',il_t:'Banco de ilustraciones',il_home:'Comparaciones e imágenes para sus sermones, por tema',il_d:'Ilustraciones para aclarar un punto del sermón: comparaciones de la vida diaria, escenas, imágenes de la naturaleza y escenas bíblicas. Dos por tema son gratis.',il_ph:'Buscar una ilustración',il_more:'Mostrar más ({n})',sg_ph:'Buscar una sugerencia (tema, texto o palabra)',sg_none:'No encontramos sugerencias con esa búsqueda.',lc_ph:'Buscar una lección (tema o palabra)',lc_none:'No encontramos lecciones con esa búsqueda.',mn_ph:'Buscar una ceremonia',mn_none:'No encontramos ceremonias con esa búsqueda.',ct_res:'{n} resultados',ct_res1:'1 resultado',il_all:'Todos',il_cnt:'{n} ilustraciones',il_ap:'Aplicación',il_use:'Usar en un sermón',il_unlock:'Ver con Premium',il_none:'No encontramos ilustraciones con esa búsqueda.',il_one:'Ilustración',il_note:'Sin historias inventadas atribuidas a personas reales: son comparaciones e imágenes para usar con libertad.',pk_il:'Acceda a todas las ilustraciones del banco, en todos los temas.',ilt_fe:'Fe',ilt_oracao:'Oración',ilt_perdao:'Perdón',ilt_sabedoria:'Sabiduría',ilt_trabalho:'Trabajo',ilt_paciencia:'Paciencia',ilt_contentamento:'Contentamiento',ilt_orgulho:'Orgullo y soberbia',ilt_juventude:'Juventud',ilt_casamento:'Matrimonio',ilt_vitoria:'Victoria',ilt_chamado:'Llamado',ilt_misericordia:'Misericordia',ilt_volta:'Segunda venida',ilt_restauracao:'Restauración',ilt_paz:'Paz',ilt_alegria:'Gozo y alegría',ilt_santidade:'Santidad',ilt_arrependimento:'Arrepentimiento',ilt_fidelidade:'Fidelidad de Dios',ilt_adoracao:'Adoración',ilt_discipulado:'Discipulado',ilt_lingua:'Palabras y lengua',ilt_ansiedade:'Ansiedad y preocupación',ilt_ceu:'Cielo y eternidad',ilt_cruz:'La cruz de Cristo',ilt_evangelismo:'Evangelismo',ilt_graca:'Gracia',ilt_amor:'Amor',ilt_esperanca:'Esperanza',ilt_perseveranca:'Perseverancia',ilt_humildade:'Humildad',ilt_familia:'Familia',ilt_salvacao:'Salvación',ilt_obediencia:'Obediencia',ilt_gratidao:'Gratitud',ilt_espirito:'Espíritu Santo',ilt_igreja:'Iglesia y unidad',ilt_servico:'Servicio',ilt_mordomia:'Mayordomía y generosidad',ilt_tentacao:'Tentación',ilt_sofrimento:'Sufrimiento',ilt_medo:'Miedo y ansiedad',ilt_tempo:'Tiempo y eternidad',ilt_palavra:'Palabra de Dios',ilt_testemunho:'Testimonio y evangelismo',ilt_lideranca:'Liderazgo',ilt_mudanca:'Vida nueva',ilk_comparacao:'Comparación',ilk_cotidiano:'Situación cotidiana',ilk_natureza:'Naturaleza',ilk_biblica:'Escena bíblica'});Object.assign(I18N.pt,{lc_t:'Lições para células e Escola Dominical',lc_home:'Séries de estudos prontas para ensinar em grupo',lc_d:'Séries de estudos bíblicos para células, Escola Dominical e pequenos grupos. Cada lição traz objetivo, quebra-gelo, pontos com textos, perguntas, aplicação, versículo para memorizar e oração. A primeira lição de cada série é grátis.',lc_n:'{n} lições',lc_all:'Todas as séries',lc_les:'Lição {n} de {m}',lc_obj:'Objetivo',lc_gelo:'Quebra-gelo',lc_intro:'Introdução (para o líder)',lc_perg:'Perguntas para conversar',lc_apl:'Aplicação',lc_mem:'Versículo para memorizar',lc_share:'Enviar ao grupo',lc_doc:'Abrir como documento',lc_back:'Voltar às lições',lc_prev:'Anterior',lc_next:'Próxima',pk_lic:'Acesse todas as lições de cada série para células e Escola Dominical.',il_t:'Banco de ilustrações',il_home:'Comparações e imagens para seus sermões, por tema',il_d:'Ilustrações para clarear um ponto do sermão: comparações do dia a dia, cenas, imagens da natureza e cenas bíblicas. Duas por tema são grátis.',il_ph:'Buscar uma ilustração',il_more:'Mostrar mais ({n})',sg_ph:'Buscar uma sugestão (tema, texto ou palavra)',sg_none:'Não encontramos sugestões com essa busca.',lc_ph:'Buscar uma lição (tema ou palavra)',lc_none:'Não encontramos lições com essa busca.',mn_ph:'Buscar uma cerimônia',mn_none:'Não encontramos cerimônias com essa busca.',ct_res:'{n} resultados',ct_res1:'1 resultado',il_all:'Todos',il_cnt:'{n} ilustrações',il_ap:'Aplicação',il_use:'Usar num sermão',il_unlock:'Ver com Premium',il_none:'Não encontramos ilustrações com essa busca.',il_one:'Ilustração',il_note:'Sem histórias inventadas atribuídas a pessoas reais: são comparações e imagens para usar à vontade.',pk_il:'Acesse todas as ilustrações do banco, em todos os temas.',ilt_fe:'Fé',ilt_oracao:'Oração',ilt_perdao:'Perdão',ilt_sabedoria:'Sabedoria',ilt_trabalho:'Trabalho',ilt_paciencia:'Paciência',ilt_contentamento:'Contentamento',ilt_orgulho:'Orgulho e soberba',ilt_juventude:'Juventude',ilt_casamento:'Casamento',ilt_vitoria:'Vitória',ilt_chamado:'Chamado',ilt_misericordia:'Misericórdia',ilt_volta:'Volta de Cristo',ilt_restauracao:'Restauração',ilt_paz:'Paz',ilt_alegria:'Alegria',ilt_santidade:'Santidade',ilt_arrependimento:'Arrependimento',ilt_fidelidade:'Fidelidade de Deus',ilt_adoracao:'Adoração',ilt_discipulado:'Discipulado',ilt_lingua:'Palavras e língua',ilt_ansiedade:'Ansiedade e preocupação',ilt_ceu:'Céu e eternidade',ilt_cruz:'A cruz de Cristo',ilt_evangelismo:'Evangelismo',ilt_graca:'Graça',ilt_amor:'Amor',ilt_esperanca:'Esperança',ilt_perseveranca:'Perseverança',ilt_humildade:'Humildade',ilt_familia:'Família',ilt_salvacao:'Salvação',ilt_obediencia:'Obediência',ilt_gratidao:'Gratidão',ilt_espirito:'Espírito Santo',ilt_igreja:'Igreja e unidade',ilt_servico:'Serviço',ilt_mordomia:'Mordomia e generosidade',ilt_tentacao:'Tentação',ilt_sofrimento:'Sofrimento',ilt_medo:'Medo e ansiedade',ilt_tempo:'Tempo e eternidade',ilt_palavra:'Palavra de Deus',ilt_testemunho:'Testemunho e evangelismo',ilt_lideranca:'Liderança',ilt_mudanca:'Vida nova',ilk_comparacao:'Comparação',ilk_cotidiano:'Situação do dia a dia',ilk_natureza:'Natureza',ilk_biblica:'Cena bíblica'});
Object.assign(I18N.es,{ri_lbl:'Imagen para divulgar',ri_st:'Para Estado',ri_ig:'Para Instagram',ri_t:'Imagen para divulgar',ri_tag:'PREPARE. ORGANICE. PREDIQUE.',ri_h:'La app del pastor para preparar, organizar y predicar',ri_items:'Biblia, hebreo y griego y 4 diccionarios|Devocional diario|Lecciones para células y Escuela Dominical|Manual del ministro y sugerencias|Modo Predicar en el púlpito',ri_free:'Pruébela gratis',ri_rol:'Entre por este enlace y gire la ruleta: descuento en su primera compra.',ri_by:'Recomendado por {n}',});Object.assign(I18N.pt,{ri_lbl:'Imagem para divulgar',ri_st:'Para Status',ri_ig:'Para Instagram',ri_t:'Imagem para divulgar',ri_tag:'PREPARE. ORGANIZE. PREGUE.',ri_h:'O app do pastor para preparar, organizar e pregar',ri_items:'Bíblia, hebraico e grego e 4 dicionários|Devocional diário|Lições para células e Escola Dominical|Manual do ministro e sugestões|Modo Pregar no púlpito',ri_free:'Experimente grátis',ri_rol:'Entre por este link e gire a roleta: desconto na primeira compra.',ri_by:'Indicado por {n}',});
Object.assign(I18N.es,{ann_more:'Ver más',dev_by:'Desarrollado por',ch_t:'Siga el canal oficial',dv_ch_t:'Reciba el devocional cada día',dv_ch_d:'Siga el canal oficial de Meu Púlpito en WhatsApp',ch_d:'Devocional diario, consejos y novedades en WhatsApp'});Object.assign(I18N.pt,{ann_more:'Saiba mais',dev_by:'Desenvolvido por',ch_t:'Siga o canal oficial',dv_ch_t:'Receba o devocional todo dia',dv_ch_d:'Siga o canal oficial do Meu Púlpito no WhatsApp',ch_d:'Devocional diário, dicas e novidades no WhatsApp'});
Object.assign(I18N.es,{dv_img_st:'Imagen para Estado',dv_img_ig:'Imagen para Instagram',dv_img_t:'Imagen del devocional',dv_img_save:'Toque y mantenga la imagen para guardarla, o use el botón de descargar.',dv_img_dl:'Descargar imagen',dv_t:'Devocional diario',dv_today:'Devocional de hoy',dv_read:'leído',dv_prev:'Día anterior',dv_next:'Día siguiente',dv_go_today:'Volver a hoy',dv_app:'Para hoy',dv_pray:'Oración',dv_serm:'Preparar un sermón',dv_day:'Día {n} de 365',
  sg_t:'Sugerencias de predicación',sg_d:'Ideas para cada ocasión: tema, texto base, tres puntos y aplicación. Úselas como punto de partida para su propio mensaje.',sg_all:'Todas las ocasiones',sg_ap:'Aplicación',sg_use:'Usar como base del sermón',sg_unlock:'Ver con Premium',
  mn_t:'Manual del ministro',mn_d:'Modelos para ceremonias y momentos pastorales: preparación, orden del culto, textos bíblicos y palabras sugeridas. Adapte cada modelo a su iglesia.',mn_all:'Todas las ceremonias',mn_prep:'Preparación',mn_ord:'Orden del culto (sugerido)',mn_txt:'Textos bíblicos',mn_fal:'Palabras sugeridas',mn_obs:'Cuidados pastorales',mn_doc:'Crear un guion editable',mn_model:'Modelo sugerido. Ajuste los nombres, el orden y las palabras a su iglesia.',
  mn_cat_fam:'Familia',mn_cat_fun:'Luto y consuelo',mn_cat_ord:'Ordenación e instalación',mn_cat_ded:'Consagraciones y dedicaciones',mn_cat_igreja:'Iglesia y ordenanzas',
  min_sec:'Para su ministerio',min_p:'Para predicar',min_e:'Para enseñar',min_g:'Para pastorear',sg_home:'Santa Cena, evangelismo, jóvenes, bodas y más',mn_home:'Bodas, 15 años, cultos fúnebres, bautismo, consagraciones',pk_sug:'Vea todas las sugerencias de predicación para cada ocasión.',pk_man:'Acceda a todos los modelos del Manual del ministro: bodas, cultos fúnebres, consagraciones y más.'});
Object.assign(I18N.pt,{dv_img_st:'Imagem para Status',dv_img_ig:'Imagem para Instagram',dv_img_t:'Imagem do devocional',dv_img_save:'Toque e segure a imagem para salvar, ou use o botão de baixar.',dv_img_dl:'Baixar imagem',dv_t:'Devocional diário',dv_today:'Devocional de hoje',dv_read:'lido',dv_prev:'Dia anterior',dv_next:'Próximo dia',dv_go_today:'Voltar para hoje',dv_app:'Para hoje',dv_pray:'Oração',dv_serm:'Preparar um sermão',dv_day:'Dia {n} de 365',
  sg_t:'Sugestões de pregação',sg_d:'Ideias para cada ocasião: tema, texto base, três pontos e aplicação. Use como ponto de partida para a sua própria mensagem.',sg_all:'Todas as ocasiões',sg_ap:'Aplicação',sg_use:'Usar como base do sermão',sg_unlock:'Ver com Premium',
  mn_t:'Manual do ministro',mn_d:'Modelos para cerimônias e momentos pastorais: preparação, ordem do culto, textos bíblicos e palavras sugeridas. Adapte cada modelo à sua igreja.',mn_all:'Todas as cerimônias',mn_prep:'Preparação',mn_ord:'Ordem do culto (sugerida)',mn_txt:'Textos bíblicos',mn_fal:'Palavras sugeridas',mn_obs:'Cuidados pastorais',mn_doc:'Criar um roteiro editável',mn_model:'Modelo sugerido. Ajuste os nomes, a ordem e as palavras à sua igreja.',
  mn_cat_fam:'Família',mn_cat_fun:'Luto e consolo',mn_cat_ord:'Consagração e posse',mn_cat_ded:'Consagrações e dedicações',mn_cat_igreja:'Igreja e ordenanças',
  min_sec:'Para o seu ministério',min_p:'Para pregar',min_e:'Para ensinar',min_g:'Para pastorear',sg_home:'Santa Ceia, evangelismo, jovens, casamento e mais',mn_home:'Casamento, 15 anos, cultos fúnebres, batismo, consagrações',pk_sug:'Veja todas as sugestões de pregação para cada ocasião.',pk_man:'Acesse todos os modelos do Manual do ministro: casamentos, cultos fúnebres, consagrações e mais.'});
/* ---------- Atendimento: conversa com o suporte (o administrador responde pelo Escritório) ---------- */
let SUP={uu:0,open:false,seen:0};
function supRef(){return firebase.firestore().collection('suporte').doc(authU.uid)}
function supWatch(u){try{unsubs.push(firebase.firestore().collection('suporte').doc(u.uid).onSnapshot(d=>{const x=d.exists?d.data():{};const n=+x.uu||0;
  if(n>SUP.uu&&!SUP.open&&ready)toast(t('su_new'));SUP.uu=n;const b=$('#supBadge');if(b){b.textContent=n;b.hidden=!n}
  const g=$('.topbrand .iconbtn');if(g)g.classList.toggle('dot',n>0);if(SUP.open&&n)supRef().set({uu:0},{merge:true}).catch(()=>{})},()=>{}))}catch(e){}}
function supSheet(){if(localMode||!authU){toLogin();return}SUP.open=true;let msgs=[],tm=0;
  const sh=openSheet(`<div class="between"><h3>${esc(t('su_t'))}</h3><button class="iconbtn" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
    <p class="sub" style="margin:0;font-size:13.5px;line-height:1.45">${esc(t('su_d'))}</p>
    <div class="su-list" id="suL"><p class="sub" style="margin:auto;text-align:center">${esc(t('dx_load'))}</p></div>
    <form class="su-form" id="suF"><textarea class="inp" id="suT" rows="2" maxlength="2000" placeholder="${esc(t('su_ph'))}"></textarea><button class="btn gold" aria-label="${esc(t('su_send'))}">${ic('next')}</button></form>`,
    {cls:'big ns',onClose:()=>{SUP.open=false;clearInterval(tm)}});
  const L=$('#suL',sh);
  const draw=()=>{if(!msgs.length){L.innerHTML=`<p class="sub" style="margin:auto;text-align:center;font-size:13.5px">${esc(t('su_empty'))}</p>`;return}
    const atB=L.scrollHeight-L.scrollTop-L.clientHeight<40;
    L.innerHTML=msgs.map(m=>`<div class="su-m ${m.f==='a'?'a':'u'}"><span>${esc(m.t).replace(/\n/g,'<br>')}</span><small>${m.f==='a'?esc(t('su_team'))+' · ':''}${esc(new Date(m.at).toLocaleString(prefs.ui==='pt'?'pt-BR':'es-PY',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))}</small></div>`).join('');
    if(atB||!draw._d){L.scrollTop=L.scrollHeight;draw._d=1}};
  const load=()=>supRef().collection('m').orderBy('at').get().then(q=>{msgs=q.docs.map(d=>d.data()).sort((a,b)=>a.at-b.at).slice(-150);draw()}).catch(()=>{if(!msgs.length)L.innerHTML=`<p class="sub" style="margin:auto;text-align:center">${esc(t('su_off'))}</p>`});
  load();tm=setInterval(load,7000);supRef().set({uu:0},{merge:true}).catch(()=>{});
  sh.addEventListener('click',e=>{if(e.target.closest('[data-x=close]'))closeSheet()});
  $('#suF',sh).onsubmit=async e=>{e.preventDefault();const ta=$('#suT',sh);const tx=ta.value.trim();if(!tx)return;const now=Date.now();
    msgs.push({t:tx,f:'u',at:now});ta.value='';draw._d=0;draw();
    try{await supRef().collection('m').doc(uid()).set({t:tx.slice(0,2000),f:'u',at:now});
      await supRef().set({...(meta.name?{n:meta.name.slice(0,80)}:{}),e:(authU.email||'').toLowerCase().slice(0,120),l:prefs.ui==='pt'?'pt':'es',last:tx.slice(0,200),at:now,ua:firebase.firestore.FieldValue.increment(1),uu:0},{merge:true})}
    catch(err){toast(t('su_err'));msgs=msgs.filter(m=>m.at!==now);ta.value=tx;draw()}}}
Object.assign(I18N.es,{su_t:'Hable con el soporte',su_d:'Escriba su duda o problema. Le respondemos aquí mismo; cuando llegue la respuesta, verá un aviso al abrir la app.',su_ph:'Escriba su mensaje…',su_send:'Enviar',su_empty:'Todavía no hay mensajes. ¿En qué podemos ayudarle?',su_team:'Soporte Meu Púlpito',su_err:'No se pudo enviar. Revise su internet e intente de nuevo.',su_off:'No se pudo cargar la conversación. Revise su internet.',su_new:'Tiene una respuesta nueva del soporte',su_btn:'Hable con el soporte',su_btn_d:'Dudas, ayuda y sugerencias'});
Object.assign(I18N.pt,{su_t:'Fale com o suporte',su_d:'Escreva sua dúvida ou problema. Respondemos aqui mesmo; quando chegar a resposta, você verá um aviso ao abrir o app.',su_ph:'Escreva sua mensagem…',su_send:'Enviar',su_empty:'Ainda não há mensagens. Como podemos ajudar?',su_team:'Suporte Meu Púlpito',su_err:'Não foi possível enviar. Verifique a internet e tente de novo.',su_off:'Não foi possível carregar a conversa. Verifique a internet.',su_new:'Você tem uma resposta nova do suporte',su_btn:'Fale com o suporte',su_btn_d:'Dúvidas, ajuda e sugestões'});
/* ---------- Indique um pastor ---------- */
const REF_RX=/^[A-Za-z0-9]{6,12}$/;
(function(){try{const r=new URLSearchParams(location.search).get('r');if(r&&REF_RX.test(r)){ls.set('mp.ref',{c:r,at:Date.now()});history.replaceState(null,'',location.pathname+location.hash)}}catch(e){}})();
const refCode=()=>authU?authU.uid.slice(0,8):'';
const refLink=()=>'https://meupulpito.com/?r='+refCode();
function refIn(){const r=ls.get('mp.ref',null);if(!r||!REF_RX.test(r.c||'')||Date.now()-(r.at||0)>60*864e5)return'';return r.c===refCode()?'':r.c}
const refN=()=>Math.max(1,+PCFG.refN||3);
function refSheet(){if(localMode||!authU){toLogin();return}const L=refLink();const n=refN();const P=planState||{};const got=+P.refMonths||0,buy=+P.refBuy||0;const msg=t('rf_msg',{l:L});
  const left=n-(buy%n);
  const sh=openSheet(`<h3>${esc(t('rf_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('rf_d',{n}))}</p>
    <div class="rf-steps">${Array.from({length:n},(_,i)=>`<span class="${i<buy%n?'on':''}">${ic(i<buy%n?'check':'user')}</span>`).join('')}</div>
    <p class="sub" style="margin:0;font-size:13px;text-align:center">${esc(t('rf_prog',{b:buy%n,n,l:left}))}</p>
    <div class="rf-link"><span>${esc(L.replace('https://',''))}</span><button class="btn sm ghost" id="rfCp">${ic('copy')}${esc(t('rf_copy'))}</button></div>
    <div class="two"><a class="btn dark" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ic('chat')}WhatsApp</a><button class="btn gold" id="rfSh">${ic('share')}${esc(t('rf_share'))}</button></div>
    <span class="lbl" style="margin-top:4px">${esc(t('ri_lbl'))}</span><div class="two"><button class="btn ghost" data-ri="st">${ic('cam')}${esc(t('ri_st'))}</button><button class="btn ghost" data-ri="ig">${ic('cam')}${esc(t('ri_ig'))}</button></div>
    ${got?`<p class="pl-testn" style="margin:0">${ic('check')}${esc(t('rf_got',{n:got}))}</p>`:''}
    <p class="sub" style="margin:0;font-size:12.5px;line-height:1.45">${esc(t('rf_how',{n}))}</p>`);
  $('#rfCp',sh).onclick=()=>copyText(L).then(()=>toast(t('rf_copied')));
  $$('[data-ri]',sh).forEach(b=>b.onclick=()=>{b.disabled=true;refImage(b.dataset.ri).finally(()=>{b.disabled=false})});
  $('#rfSh',sh).onclick=()=>{if(navigator.share)navigator.share({title:'Meu Púlpito',text:t('rf_msg0'),url:L}).catch(()=>{});else copyText(msg).then(()=>toast(t('rf_copied')))}}
/* ---------- Roleta de desconto: para quem entrou pelo link de um pastor ---------- */
const RL_P=[5,10,15,20,30,50],RL_W=[35,30,18,10,5,2];
let ROL=null;
function rolGet(){if(!authU||localMode)return Promise.resolve(null);const k='mp.rol.'+authU.uid;const c=ls.get(k,null);if(c){ROL=c;return Promise.resolve(c)}
  return firebase.firestore().collection('roleta').doc(authU.uid).get().then(d=>{ROL=d.exists?d.data():null;if(ROL)ls.set(k,ROL);return ROL}).catch(()=>null)}
// desconto válido: ganhou na roleta e ainda não fez nenhum pagamento
function rolDisc(){const N=planNow();return ROL&&RL_P.includes(+ROL.p)&&!N.pays.some(x=>!x.test)?+ROL.p:0}
const rolPrice=(v,c,p)=>{const x=v*(100-p)/100;return c==='pyg'?Math.floor(x/1000)*1000:Math.floor(x)};
function rolWheel(){const n=RL_P.length,R=120,cx=130,cy=130;const seg=(i)=>{const a0=(i*360/n-90-180/n)*Math.PI/180,a1=((i+1)*360/n-90-180/n)*Math.PI/180;
    return`M${cx},${cy} L${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)} A${R},${R} 0 0 1 ${cx+R*Math.cos(a1)},${cy+R*Math.sin(a1)} Z`};
  const lab=i=>{const a=(i*360/n-90)*Math.PI/180;return[cx+78*Math.cos(a),cy+78*Math.sin(a),i*360/n]};
  return`<div class="rl-box"><span class="rl-pin" aria-hidden="true"></span><svg class="rl-w" viewBox="0 0 260 260" aria-hidden="true"><g class="rl-g">
    ${RL_P.map((p,i)=>`<path d="${seg(i)}" class="${i%2?'a':'b'}"/>`).join('')}
    ${RL_P.map((p,i)=>{const[x,y,r]=lab(i);return`<text class="${i%2?'a':'b'}" x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" text-anchor="middle" dominant-baseline="middle">${p}%</text>`}).join('')}
    <circle cx="130" cy="130" r="${R}" class="rl-rim"/></g><circle cx="130" cy="130" r="22" class="rl-hub"/></svg></div>`}
async function rolSheet(demo){if(!demo&&(!authU||localMode||!meta.refBy))return;if(!demo)await rolGet();const SV=demo?null:ROL;
  const done=p=>`<p class="rl-res">${esc(t('rl_won',{p}))}</p><p class="sub" style="margin:0;font-size:13.5px;line-height:1.5;text-align:center">${esc(t('rl_use'))}</p><button class="btn gold block" data-rl="plans">${esc(t('rl_see'))}</button>`;
  const sh=openSheet(`<h3 style="text-align:center">${esc(t('rl_t'))}</h3><p class="sub" style="margin:0;text-align:center;font-size:14px;line-height:1.5">${esc(t('rl_d'))}</p>
    ${demo?`<p class="pl-why" style="margin:0;text-align:center">${esc(t('rl_demo'))}</p>`:''}${rolWheel()}<div id="rlOut">${SV?done(SV.p):`<button class="btn gold block" id="rlGo">${esc(t('rl_go'))}</button>`}</div>
    <p class="sub" style="margin:0;font-size:11.5px;text-align:center">${esc(t('rl_note'))}</p>`,{cls:'ns'});
  const g=$('.rl-g',sh);const n=RL_P.length;const angle=i=>-(i*360/n);
  if(SV){g.style.transform=`rotate(${angle(RL_P.indexOf(+SV.p))}deg)`}
  let turns=0;
  sh.addEventListener('click',e=>{if(e.target.closest('[data-rl=plans]')){closeSheet();if(!demo)plansSheet()}if(e.target.closest('[data-rl=again]')){closeSheet();rolSheet(true)}});
  const go=$('#rlGo',sh);if(go)go.onclick=async()=>{go.disabled=true;
    const ex=demo?null:await rolGet();let p;if(ex)p=+ex.p;else if(demo){let r=Math.random()*RL_W.reduce((a,b)=>a+b,0);let i=0;while(r>=RL_W[i]){r-=RL_W[i];i++}p=RL_P[i]}else{let r=Math.random()*RL_W.reduce((a,b)=>a+b,0);let i=0;while(r>=RL_W[i]){r-=RL_W[i];i++}p=RL_P[i];
      try{await firebase.firestore().collection('roleta').doc(authU.uid).set({p,at:Date.now(),ref:String(meta.refBy).slice(0,12)});ROL={p,at:Date.now()};ls.set('mp.rol.'+authU.uid,ROL)}catch(err){go.disabled=false;toast(t('rl_err'));return}}
    const i=RL_P.indexOf(p);g.style.transition='transform 4.6s cubic-bezier(.12,.7,.1,1)';g.style.transform=`rotate(${360*6+angle(i)}deg)`;
    setTimeout(()=>{const o=$('#rlOut',sh);if(o)o.innerHTML=demo?`<p class="rl-res">${esc(t('rl_won',{p}))}</p><button class="btn gold block" data-rl="again">${esc(t('rl_again'))}</button>`:done(p);if(!demo&&ROL)render()},4800)}}
function rolCheck(){if(rolCheck._t)return;let n=0;rolCheck._t=setInterval(()=>{if(++n>40){clearInterval(rolCheck._t);return}
  if(!ready||blocked||E||!authU||localMode)return;if(!meta.refBy||isAdmin()){if(n>8)clearInterval(rolCheck._t);return}
  if(ls.get('mp.rol.seen.'+authU.uid,0)){clearInterval(rolCheck._t);rolGet();return}
  if($('.ov')||view.overlay)return;clearInterval(rolCheck._t);ls.set('mp.rol.seen.'+authU.uid,1);rolSheet()},3000)}
/* ---------- Depoimentos ---------- */
function depoSheet(auto){if(localMode||!authU){toLogin();return}let sent=false;
  const sh=openSheet(`<h3>${esc(t(auto?'dp_ask':'dp_t'))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('dp_d'))}</p>
    <textarea class="inp" id="dpQ" rows="5" maxlength="600" placeholder="${esc(t('dp_ph'))}" style="height:auto;padding:12px;line-height:1.45;resize:vertical"></textarea>
    <input class="inp" id="dpN" maxlength="80" value="${esc(meta.name||'')}" placeholder="${esc(t('dp_n'))}">
    <input class="inp" id="dpR" maxlength="120" placeholder="${esc(t('dp_r'))}">
    <label class="dp-ok"><input type="checkbox" id="dpOk" checked><span>${esc(t('dp_auth'))}</span></label>
    <button class="btn gold block" id="dpGo">${ic('check')}${esc(t('dp_send'))}</button>
    ${auto?`<button class="btn ghost block" id="dpLater">${esc(t('dp_later'))}</button>`:''}`,{onClose:()=>{if(auto&&!sent){ls.set('mp.dep.later',Date.now());ls.set('mp.dep.n',(ls.get('mp.dep.n',0)||0)+1)}}});
  const lt=$('#dpLater',sh);if(lt)lt.onclick=()=>closeSheet();
  $('#dpGo',sh).onclick=async()=>{const q=$('#dpQ',sh).value.trim(),n=$('#dpN',sh).value.trim();
    if(q.length<10){$('#dpQ',sh).focus();toast(t('dp_short'));return}if(!n){$('#dpN',sh).focus();toast(t('dp_n_need'));return}
    const b=$('#dpGo',sh);b.disabled=true;
    try{await firebase.firestore().collection('depo').doc(authU.uid).set({q:q.slice(0,600),n:n.slice(0,80),r:$('#dpR',sh).value.trim().slice(0,120),ok:$('#dpOk',sh).checked,lang:prefs.ui==='pt'?'pt':'es',email:(authU.email||'').toLowerCase().slice(0,120),at:Date.now()});
      sent=true;meta.dep=Date.now();putMeta();closeSheet();toast(t('dp_thx'))}catch(e){b.disabled=false;toast(t('dp_err'))}}}
/* convite para o canal oficial no WhatsApp: aparece no Início, uma vez (e no máximo mais uma, 7 dias depois de «Agora não») */
const CH_URL='https://whatsapp.com/channel/0029Vb9d3dXFHWpvOk3CTm3J';
function chCheck(){if(chCheck._t)return;let n=0;chCheck._t=setInterval(()=>{if(++n>60){clearInterval(chCheck._t);return}
  if(ls.get('mp.ch.ok',0)||meta.chOk||(ls.get('mp.ch.n',0)||0)>=2){clearInterval(chCheck._t);return}const later=ls.get('mp.ch.later',0);if(later&&Date.now()-later<7*864e5){clearInterval(chCheck._t);return}
  if(n<4||!ready||blocked||E||!ls.get('mp.onb',0)||$('.ov')||view.tab!=='home'||view.overlay)return;
  clearInterval(chCheck._t);chSheet()},4000)}
function chDone(){ls.set('mp.ch.ok',1);if(authU&&!localMode&&!meta.chOk){meta.chOk=Date.now();putMeta()}}
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(a&&a.href===CH_URL)chDone()});
function chSheet(){ls.set('mp.ch.n',(ls.get('mp.ch.n',0)||0)+1);
  const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('chat')}</span><h3>${esc(t('chi_t'))}</h3><p>${esc(t('chi_d'))}</p>
    <ul class="pl-f" style="align-self:stretch;text-align:left">${['chi_1','chi_2','chi_3'].map(k=>`<li>${ic('check')}<span>${esc(t(k))}</span></li>`).join('')}</ul>
    <a class="btn gold block" id="chGo" href="${CH_URL}" target="_blank" rel="noopener">${ic('chat')}${esc(t('chi_go'))}</a><button class="btn ghost block" id="chNo">${esc(t('chi_no'))}</button></div>`);
  $('#chGo',sh).onclick=()=>{chDone();setTimeout(()=>closeSheet(),300)};$('#chNo',sh).onclick=()=>{ls.set('mp.ch.later',Date.now());closeSheet()}}
Object.assign(I18N.es,{chi_t:'Siga el canal oficial',chi_d:'Reciba en su WhatsApp, gratis, lo mejor de Meu Púlpito para su ministerio.',chi_1:'El devocional de cada día',chi_2:'Consejos para preparar y predicar',chi_3:'Novedades y promociones de la app',chi_go:'Entrar al canal',chi_no:'Ahora no'});
Object.assign(I18N.pt,{chi_t:'Siga o canal oficial',chi_d:'Receba no seu WhatsApp, grátis, o melhor do Meu Púlpito para o seu ministério.',chi_1:'O devocional de cada dia',chi_2:'Dicas para preparar e pregar',chi_3:'Novidades e promoções do app',chi_go:'Entrar no canal',chi_no:'Agora não'});
function depoCheck(){if(depoCheck._t)return;let n=0;depoCheck._t=setInterval(()=>{if(++n>40){clearInterval(depoCheck._t);return}
  if(!ready||blocked||E||!authU||localMode)return;
  const later=ls.get('mp.dep.later',0);
  if(meta.dep||isAdmin()||(ls.get('mp.dep.n',0)||0)>=2||(later&&Date.now()-later<30*864e5)){clearInterval(depoCheck._t);return}
  const ck=ls.get('mp.created.'+authU.uid,0);if(!ck||Date.now()-ck<5*864e5||liveS().length<5)return;
  if($('.ov')||view.tab!=='home'||view.overlay)return;
  clearInterval(depoCheck._t);depoSheet(true)},4000)}
Object.assign(I18N.es,{rf_h_eye:'Recomiende y gane',rf_h_t:'Recomiende 3 pastores y gane 1 mes gratis',rf_h_d:'Y quien entra por su enlace gira la ruleta y gana un descuento en su primera compra.',rf_h_go:'Ver mi enlace',ad_test_pay:'Prueba o cortesía (no cuenta como venta)',es_open:'Abrir el Escritorio (atención, pagos y pastores)',rl_pay:'Su descuento de {p}% ya está aplicado: pague solo {v}.',rl_pay_d:'Transfiera este valor y envíe el comprobante. El descuento vale solo en esta primera compra; las renovaciones son al precio normal.',rl_first:'en esta primera compra',rl_after:'Después, precio normal: {v}.',rl_test:'Probar la ruleta de descuento',rl_demo:'Modo de prueba: el resultado no se guarda y nadie recibe descuento.',rl_again:'Girar de nuevo (prueba)',dx_aln:'«{w}» no aparece como traducción en este diccionario. En los versículos donde aparece, el texto original trae:',dx_via:'Resultados para «{w}», la forma de diccionario de la palabra buscada.',rf_t:'Recomiende a un pastor',rf_d:'A cada {n} pastores que creen su cuenta con su enlace y activen un plan Premium, usted gana 1 mes de Premium gratis. Y quien entra por su enlace gira la ruleta y gana un descuento en su primera compra.',rf_copy:'Copiar',rf_copied:'Enlace copiado',rf_share:'Compartir',
  rf_msg0:'Pastor, le recomiendo Meu Púlpito: una app para preparar, organizar y predicar sus sermones, con Biblia y diccionarios. Pruébela gratis:',rf_msg:'Pastor, le recomiendo Meu Púlpito: una app para preparar, organizar y predicar sus sermones, con Biblia y diccionarios. Pruébela gratis: {l}',
  rf_got:'Ya ganó {n} mes(es) de Premium por recomendaciones. ¡Gracias!',rf_how:'El mes se suma a su plan cuando se completan {n} compras de pastores recomendados por usted. Si está en el plan gratis, recibe 30 días de Premium.',
  rf_by:'Recomendado por {n}',rf_cnt:'Recomendó a {n} · {b} compraron',rf_give:'Dar 1 mes a {n}',rf_sure:'¿Confirmar? Toque de nuevo',rf_given:'Listo: 1 mes de Premium entregado',rf_paid:'Premio de recomendación entregado',rf_cfg:'Compras de recomendados para ganar 1 mes gratis',rf_btn:'Recomiende a un pastor',rf_btn_d:'Gane días de Premium compartiendo la app',
  dp_t:'Deje su testimonio',dp_ask:'¿Le está gustando Meu Púlpito?',dp_d:'Cuéntenos en pocas palabras cómo la app le ayuda en su ministerio. Con su autorización, su testimonio puede aparecer en el sitio meupulpito.com.',dp_ph:'Ejemplo: Ahora preparo mis sermones en la mitad del tiempo y predico más tranquilo…',dp_n:'Su nombre (como quiere que aparezca)',dp_r:'Iglesia y ciudad (opcional)',dp_auth:'Autorizo publicar mi testimonio con mi nombre en el sitio de Meu Púlpito.',dp_send:'Enviar testimonio',dp_later:'Ahora no',dp_short:'Escriba un poco más, por favor',dp_n_need:'Escriba su nombre',dp_thx:'¡Gracias por su testimonio! Dios le bendiga.',dp_err:'No se pudo enviar ahora. Revise su internet e intente de nuevo.',dp_btn:'Deje su testimonio',dp_btn_d:'Cuéntenos cómo la app le ayuda',
  dp_recv:'Testimonios recibidos en la app ({n})',dp_use:'Usar en el sitio',dp_used:'Ya está en la lista',dp_noauth:'Sin autorización para publicar',dp_added:'Agregado a la lista. Toque Guardar para publicarlo.',
  ve_t:'Su correo de administrador no está verificado',ve_d:'Verificarlo protege el panel. Toque el botón, abra el correo que llegará a {e} y toque el enlace. Después cierre sesión y entre de nuevo.',ve_go:'Enviar correo de verificación',ve_sent:'Correo enviado. Revise también la carpeta de spam.',ve_ok:'Correo de administrador verificado',rf_prog:'{b} de {n} pastores recomendados ya compraron. Faltan {l} para su próximo mes gratis.',rl_t:'Ruleta de descuento',rl_d:'Usted llegó por la recomendación de un pastor. Gire la ruleta y gane un descuento en su primera compra del Premium.',rl_go:'Girar la ruleta',rl_won:'¡Usted ganó {p}% de descuento!',rl_use:'El descuento vale para su primera compra de cualquier plan Premium. Ya aparece en los precios.',rl_see:'Ver los planes',rl_note:'Un solo giro por cuenta. El descuento vale solo para la primera compra.',rl_err:'No se pudo girar ahora. Revise su internet e intente de nuevo.',rl_card:'Con su descuento de {p}%: {v} en la primera compra',rl_have:'Usted tiene {p}% de descuento en su primera compra (ruleta de recomendación).',rl_msg:'Descuento de la ruleta: {p}% (primera compra).',rl_card_note:'El descuento de la ruleta vale para transferencia y Pix. Con tarjeta, consulte por WhatsApp.',rl_adm:'Ruleta: {p}% en la 1ª compra'});
Object.assign(I18N.pt,{rf_h_eye:'Indique e ganhe',rf_h_t:'Indique 3 pastores e ganhe 1 mês grátis',rf_h_d:'E quem entra pelo seu link gira a roleta e ganha um desconto na primeira compra.',rf_h_go:'Ver meu link',ad_test_pay:'Teste ou cortesia (não conta como venda)',es_open:'Abrir o Escritório (atendimento, pagamentos e pastores)',rl_pay:'Seu desconto de {p}% já está aplicado: pague só {v}.',rl_pay_d:'Transfira este valor e envie o comprovante. O desconto vale só nesta primeira compra; as renovações são pelo preço normal.',rl_first:'nesta primeira compra',rl_after:'Depois, preço normal: {v}.',rl_test:'Testar a roleta de desconto',rl_demo:'Modo de teste: o resultado não é salvo e ninguém recebe desconto.',rl_again:'Girar de novo (teste)',dx_aln:'«{w}» não aparece como tradução neste dicionário. Nos versículos onde ela aparece, o texto original traz:',dx_via:'Resultados para «{w}», a forma de dicionário da palavra buscada.',rf_t:'Indique um pastor',rf_d:'A cada {n} pastores que criarem a conta pelo seu link e ativarem um plano Premium, você ganha 1 mês de Premium grátis. E quem entra pelo seu link gira a roleta e ganha um desconto na primeira compra.',rf_copy:'Copiar',rf_copied:'Link copiado',rf_share:'Compartilhar',
  rf_msg0:'Pastor, recomendo o Meu Púlpito: um app para preparar, organizar e pregar seus sermões, com Bíblia e dicionários. Experimente grátis:',rf_msg:'Pastor, recomendo o Meu Púlpito: um app para preparar, organizar e pregar seus sermões, com Bíblia e dicionários. Experimente grátis: {l}',
  rf_got:'Você já ganhou {n} mês(es) de Premium por indicações. Obrigado!',rf_how:'O mês é somado ao seu plano quando completam {n} compras de pastores indicados por você. Se você está no plano grátis, recebe 30 dias de Premium.',
  rf_by:'Indicado por {n}',rf_cnt:'Indicou {n} · {b} compraram',rf_give:'Dar 1 mês a {n}',rf_sure:'Confirmar? Toque de novo',rf_given:'Pronto: 1 mês de Premium entregue',rf_paid:'Prêmio da indicação entregue',rf_cfg:'Compras de indicados para ganhar 1 mês grátis',rf_btn:'Indique um pastor',rf_btn_d:'Ganhe dias de Premium compartilhando o app',
  dp_t:'Deixe seu depoimento',dp_ask:'Está gostando do Meu Púlpito?',dp_d:'Conte em poucas palavras como o app ajuda no seu ministério. Com a sua autorização, o depoimento pode aparecer no site meupulpito.com.',dp_ph:'Exemplo: Agora preparo meus sermões na metade do tempo e prego mais tranquilo…',dp_n:'Seu nome (como quer que apareça)',dp_r:'Igreja e cidade (opcional)',dp_auth:'Autorizo publicar meu depoimento com meu nome no site do Meu Púlpito.',dp_send:'Enviar depoimento',dp_later:'Agora não',dp_short:'Escreva um pouco mais, por favor',dp_n_need:'Escreva seu nome',dp_thx:'Obrigado pelo seu depoimento! Deus abençoe.',dp_err:'Não foi possível enviar agora. Verifique a internet e tente de novo.',dp_btn:'Deixe seu depoimento',dp_btn_d:'Conte como o app ajuda você',
  dp_recv:'Depoimentos recebidos no app ({n})',dp_use:'Usar no site',dp_used:'Já está na lista',dp_noauth:'Sem autorização para publicar',dp_added:'Adicionado à lista. Toque em Salvar para publicar.',
  ve_t:'Seu e-mail de administrador não está verificado',ve_d:'Verificar protege o painel. Toque no botão, abra o e-mail que vai chegar em {e} e toque no link. Depois saia da conta e entre de novo.',ve_go:'Enviar e-mail de verificação',ve_sent:'E-mail enviado. Olhe também a pasta de spam.',ve_ok:'E-mail de administrador verificado',rf_prog:'{b} de {n} pastores indicados já compraram. Faltam {l} para o seu próximo mês grátis.',rl_t:'Roleta de desconto',rl_d:'Você chegou pela indicação de um pastor. Gire a roleta e ganhe um desconto na sua primeira compra do Premium.',rl_go:'Girar a roleta',rl_won:'Você ganhou {p}% de desconto!',rl_use:'O desconto vale para a sua primeira compra de qualquer plano Premium. Já aparece nos preços.',rl_see:'Ver os planos',rl_note:'Um giro só por conta. O desconto vale apenas para a primeira compra.',rl_err:'Não foi possível girar agora. Verifique a internet e tente de novo.',rl_card:'Com seu desconto de {p}%: {v} na primeira compra',rl_have:'Você tem {p}% de desconto na primeira compra (roleta da indicação).',rl_msg:'Desconto da roleta: {p}% (primeira compra).',rl_card_note:'O desconto da roleta vale para transferência e Pix. No cartão, consulte pelo WhatsApp.',rl_adm:'Roleta: {p}% na 1ª compra'});
/* ---------- bienvenida (primera vez) ---------- */
const ONB=[['__logo','ob0t','ob0d'],['plus','ob1t','ob1d'],['lectern','ob2t','ob2d'],['dict','ob3t','ob3d'],['cal','ob4t','ob4d']];
function onboarding(){let i=0;const sh=openSheet(`<div class="ob"><div id="obIn"></div><div class="ob-dots">${ONB.map((_,k)=>`<i data-k="${k}"></i>`).join('')}</div>
    <div class="two"><button class="btn ghost" id="obSkip">${esc(t('ob_skip'))}</button><button class="btn gold" id="obNext"></button></div></div>`,{onClose:()=>ls.set('mp.onb',1)});
  const paint=()=>{const [icn,tt,dd]=ONB[i];const nm=(meta.name||'').trim();$('#obIn',sh).innerHTML=`${icn==='__logo'?`<span class="ob-logo"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>`:`<span class="ob-ic">${ic(icn)}</span>`}<h3 class="ob-t">${esc(t(tt,{n:nm?', '+nm:''}))}</h3><p class="ob-d">${esc(t(dd))}</p>`;
    $$('.ob-dots i',sh).forEach((d,k)=>d.classList.toggle('on',k===i));$('#obNext',sh).textContent=t(i<ONB.length-1?'ob_next':'ob_go');$('#obSkip',sh).style.visibility=i<ONB.length-1?'visible':'hidden'};
  $('#obNext',sh).onclick=()=>{if(i<ONB.length-1){i++;paint()}else closeSheet()};$('#obSkip',sh).onclick=()=>closeSheet();paint()}
Object.assign(I18N.es,{adp_t:'{n} cuenta(s) esperando liberación',adp_d:'Toque para abrir el Escritorio y liberarlos.',rp_t:'Relatar un problema',rp_d:'Cuéntenos qué pasó y qué estaba haciendo. El mensaje va con la versión del app y el tipo de celular, para corregirlo más rápido.',rp_ph:'Ej.: toqué Predicar y la pantalla quedó en blanco…',rp_tip:'Si puede, después envíe también una captura de pantalla en la misma conversación.',rp_wa:'Enviar por WhatsApp',rp_mail:'Enviar por correo',rp_hd:'Problema en Meu Púlpito:',rp_btn:'Relatar un problema',ob_btn:'Ver la presentación',
  ob0t:'¡Bienvenido a Meu Púlpito{n}!',ob0d:'Su lugar para preparar, organizar y predicar la Palabra. En cuatro pasos le mostramos lo principal.',wb_back:'¡Bienvenido de nuevo, {n}!',ob1t:'Escriba su sermón',ob1d:'Toque «Nuevo sermón». Escriba el título y el texto; con «Versículo» el app coloca el texto bíblico y con «Nuevo punto» organiza el bosquejo. Todo se guarda solo.',
  ob2t:'Predique desde el celular',ob2d:'Toque «Predicar»: letra grande, cronómetro y avance por partes. Puede cambiar el sermón entre español y portugués sin crear una copia.',
  ob3t:'Estudie la Palabra',ob3d:'Biblia en español y portugués, diccionarios Bíblico, Hebreo, Arameo y Griego, y curiosidades bíblicas. Desde el editor, toque el libro para consultar e insertar en el sermón.',
  ob4t:'Organice su ministerio',ob4d:'Agenda de predicaciones, categorías y favoritos. Sus sermones quedan en su cuenta y aparecen en cualquier celular donde entre.',ob_next:'Siguiente',ob_go:'Comenzar',ob_skip:'Saltar'});
Object.assign(I18N.pt,{adp_t:'{n} conta(s) aguardando liberação',adp_d:'Toque para abrir o Escritório e liberar.',rp_t:'Relatar um problema',rp_d:'Conte o que aconteceu e o que você estava fazendo. A mensagem vai com a versão do app e o tipo de celular, para corrigir mais rápido.',rp_ph:'Ex.: toquei em Pregar e a tela ficou em branco…',rp_tip:'Se puder, depois mande também um print da tela na mesma conversa.',rp_wa:'Enviar pelo WhatsApp',rp_mail:'Enviar por e-mail',rp_hd:'Problema no Meu Púlpito:',rp_btn:'Relatar um problema',ob_btn:'Ver a apresentação',
  ob0t:'Bem-vindo ao Meu Púlpito{n}!',ob0d:'Seu lugar para preparar, organizar e pregar a Palavra. Em quatro passos mostramos o principal.',wb_back:'Bem-vindo de volta, {n}!',ob1t:'Escreva seu sermão',ob1d:'Toque em «Novo sermão». Escreva o título e o texto; com «Versículo» o app coloca o texto bíblico e com «Novo ponto» organiza o esboço. Tudo é salvo sozinho.',
  ob2t:'Pregue pelo celular',ob2d:'Toque em «Pregar»: letra grande, cronômetro e avanço por partes. Você pode trocar o sermão entre português e espanhol sem criar uma cópia.',
  ob3t:'Estude a Palavra',ob3d:'Bíblia em português e espanhol, dicionários Bíblico, Hebraico, Aramaico e Grego, e curiosidades bíblicas. No editor, toque no livro para consultar e inserir no sermão.',
  ob4t:'Organize seu ministério',ob4d:'Agenda de pregações, categorias e favoritos. Seus sermões ficam na sua conta e aparecem em qualquer celular em que você entrar.',ob_next:'Próximo',ob_go:'Começar',ob_skip:'Pular'});

function planBanner(){const N=planNow();
  if(N.trial){const left=N.trialEnd-Date.now();const urg=left<=24*3600e3;
    return`<div class="banner trial${urg?' pv warn':''}"><div class="tx"><b>${ic('star')} ${esc(t('tl_t'))}</b><br>${esc(t(left<=3*3600e3?'tl_3':urg?'tl_24':'tl_left',{x:trialLeftTxt(left)}))}</div><div class="row"><button class="btn sm ${urg?'gold':'ghost'}" data-act="plans">${esc(t('pl_see'))}</button></div></div>`}
  if(N.trialEnded&&!PCFG.test&&!ls.get('mp.trx.'+N.trialEnd,0))return`<div class="banner pv"><div class="tx"><b>${esc(t('tr_end'))}</b><br>${esc(t('tr_end_d'))}</div><div class="row"><button class="btn sm ghost" data-act="pvHide" data-u="tr${N.trialEnd}">${esc(t('later'))}</button><button class="btn sm gold" data-act="plans">${esc(t('pl_see'))}</button></div></div>`;
  if(N.test&&!N.paid)return'';const k=N.plan!=='free'?N.plan:N.last;
  const btn=`<button class="btn sm gold" data-act="planRenew" data-k="${esc(PMON[k]?k:'m')}">${esc(t('pv_renew'))}</button>`;
  if(N.active&&N.daysLeft<=(+PCFG.warn||7))return`<div class="banner pv"><div class="tx"><b>${esc(t(N.daysLeft<=1?'pv_today':'pv_soon',{n:N.daysLeft}))}</b><br>${esc(t('pv_soon_d',{d:fmtDay(N.until)}))}</div><div class="row">${btn}</div></div>`;
  if(N.grace){const g=Math.max(1,Math.ceil((N.graceEnd-Date.now())/864e5));return`<div class="banner pv warn"><div class="tx"><b>${esc(t('pv_exp',{d:fmtDay(N.until)}))}</b><br>${esc(t('pv_grace',{n:g}))}</div><div class="row">${btn}</div></div>`}
  if(N.expired&&!N.paid&&!ls.get('mp.pvx.'+N.until,0))return`<div class="banner pv"><div class="tx"><b>${esc(t('pv_free'))}</b><br>${esc(t('pv_free_d'))}</div><div class="row"><button class="btn sm ghost" data-act="pvHide" data-u="${N.until}">${esc(t('later'))}</button>${btn}</div></div>`;
  return''}
/* aviso do administrador para todos (config/app.ann, editado no Escritório) */
function annGet(){const A=PCFG.ann;if(!A||!A.on||!A.id)return null;if(A.until&&todayISO()>A.until)return null;const pt=prefs.ui==='pt';
  const tt=(pt?A.tpt||A.tes:A.tes||A.tpt)||'',tx=(pt?A.pt||A.es:A.es||A.pt)||'';if(!tt&&!tx)return null;
  return{id:A.id,t:tt,x:tx,url:/^https:\/\//.test(A.url||'')?A.url:'',b:(pt?A.bpt:A.bes)||t('ann_more'),pop:!!A.pop}}
function annHtml(){const A=annGet();if(!A||ls.get('mp.ann.x',0)===A.id)return'';
  return`<div class="banner ann"><div class="tx">${A.t?`<b>${ic('star')} ${esc(A.t)}</b><br>`:''}${esc(A.x)}</div><div class="row"><button class="btn sm ghost" data-act="annX">${esc(t('close'))}</button>${A.url?`<a class="btn sm gold" href="${esc(A.url)}" target="_blank" rel="noopener">${esc(A.b)}</a>`:''}</div></div>`}
function annPop(){const A=annGet();if(!A||!A.pop||ls.get('mp.ann.p',0)===A.id||ls.get('mp.ann.x',0)===A.id)return;if(!ready||blocked||E||$('.ov')||view.tab!=='home')return;ls.set('mp.ann.p',A.id);
  const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('star')}</span>${A.t?`<h3>${esc(A.t)}</h3>`:''}<p style="white-space:pre-line">${esc(A.x)}</p>${A.url?`<a class="btn gold block" href="${esc(A.url)}" target="_blank" rel="noopener">${esc(A.b)}</a>`:''}<button class="btn ghost block" data-act="sheetClose">${esc(t('close'))}</button></div>`)}
setInterval(()=>{try{annPop()}catch(e){}},5000);
function bannersHtml(){let h=annHtml()+planBanner();if(isAdmin()&&ls.get('mp.adm',0)!==1)ls.set('mp.adm',1);if(canShowInstall()&&!ls.get('mp.instx',0))h+=`<div class="banner inst-bn"><div class="tx"><b>${esc(t('in_t'))}</b><br>${esc(t('in_d'))}</div><div class="row"><button class="btn sm ghost" data-act="instHide">${esc(t('later'))}</button><button class="btn sm gold" data-act="install">${ic('dl')}${esc(t('in_btn').split(' ')[0])}</button></div></div>`;if(isAdmin()){admPendCheck();if(ADMP.n)h+=`<a class="banner adp" href="/escritorio/#pastores" data-ext="1" rel="noopener"><span class="adp-n">${ADMP.n}</span><div class="tx"><b>${esc(t('adp_t',{n:ADMP.n}))}</b><br>${esc(t('adp_d'))}</div>${ic('next')}</a>`}const r=getResume();const rs=r&&(r.tSec>0||r.top>200)&&sermons.find(x=>x.id===r.id);
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
   <div class="ft"><span class="dt">${s.serie?`<span class="ser-tag">${esc(s.serie.n)} · ${s.serie.p||1}</span> `:''}${esc(t('edited_c'))} ${esc(relDate(s.updated))}${c?` · ${esc(c)}`:''}</span>${statusTag(s)}</div>
  </div>`}

/* ---------- Series de sermones ---------- */
function seriesAll(){const m={};liveS().forEach(x=>{const r=x.serie;if(!r||!r.n)return;const k=r.n.trim();(m[k]=m[k]||[]).push(x)});
  return Object.entries(m).map(([n,L])=>({n,L:L.sort((a,b)=>(a.serie.p||0)-(b.serie.p||0)),done:L.filter(isPreached).length,upd:Math.max(...L.map(x=>x.updated||0))})).sort((a,b)=>b.upd-a.upd)}
function pickSeries(s,cb){const S=seriesAll();const cur=s.serie;const nextP=n=>{const x=S.find(z=>z.n===n);return x?Math.max(0,...x.L.filter(y=>y.id!==s.id).map(y=>y.serie.p||0))+1:1};
  const sh=openSheet(`<h3>${esc(t('ser_t'))}</h3><p class="sub" style="margin:0">${esc(t('ser_d'))}</p>
   ${S.length?`<div class="catlist">${S.map(x=>`<button class="chip" data-sn="${esc(x.n)}" aria-pressed="${!!cur&&cur.n===x.n}">${esc(x.n)} <span class="sub">· ${x.L.length}</span></button>`).join('')}</div>`:''}
   <div class="fld"><label for="srN">${esc(t('ser_name'))}</label><input class="inp" id="srN" value="${esc(cur?cur.n:'')}" placeholder="${esc(t('ser_ph'))}"></div>
   <div class="fld"><label for="srP">${esc(t('ser_part'))}</label><input class="inp" id="srP" type="number" inputmode="numeric" min="1" value="${cur?cur.p||1:1}" style="max-width:120px"></div>
   <button class="btn gold block" id="srOk">${esc(t('save'))}</button>${cur?`<button class="btn ghost block" id="srRm" style="color:var(--danger)">${esc(t('ser_rm'))}</button>`:''}`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-sn]');if(!b)return;$('#srN',sh).value=b.dataset.sn;$('#srP',sh).value=cur&&cur.n===b.dataset.sn?cur.p:nextP(b.dataset.sn);$$('[data-sn]',sh).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
  $('#srOk',sh).onclick=()=>{const n=$('#srN',sh).value.trim().slice(0,80);if(!n){cb(null);closeSheet();return}cb({n,p:Math.max(1,parseInt($('#srP',sh).value,10)||nextP(n))});closeSheet();toast(t('ser_saved'))};
  const rm=$('#srRm',sh);if(rm)rm.onclick=()=>{cb(null);closeSheet()}}
function newSermonInSeries(n){if(!canNewSermon())return;const x=seriesAll().find(z=>z.n===n);const p=x?Math.max(0,...x.L.map(y=>y.serie.p||0))+1:1;
  const s={id:uid(),html:'',lang:'',category:'',fav:false,created:Date.now(),log:[],v:2,serie:{n,p}};openEditor(null,s)}
function seriesHtml(){const S=seriesAll();if(!isPremium()&&!S.length)return`<div class="pk-card" data-act="plans">${ic('lock')}<span><b>${esc(t('ser_t'))} <span class="prem sm">PREMIUM</span></b><span>${esc(t('pk_ser'))}</span></span></div>`;
  if(!S.length)return`<div class="empty"><p style="margin:0;max-width:36ch">${esc(t('ser_empty'))}</p></div>`;
  return`<div class="list">${S.map(x=>{const pc=Math.round(x.done/x.L.length*100);return`<button class="sm-card ser-card" data-act="serOpen" data-n="${esc(x.n)}" style="text-align:left">
    <span class="ti">${esc(x.n)}</span><span class="sub">${esc(t(x.L.length===1?'ser_count1':'ser_count',{n:x.L.length,d:x.done}))}</span>
    <span class="ser-bar"><i style="width:${pc}%"></i></span></button>`}).join('')}</div>`}
function serieDetailHtml(n){const x=seriesAll().find(z=>z.n===n);
  return`<button class="lnk dx-back" data-act="serBack">${ic('back')}${esc(t('ser_all'))}</button>
   <div class="between"><h2 class="dx-h2" style="margin:0">${esc(n)}</h2></div>
   ${x?`<p class="sub" style="margin:0">${esc(t(x.L.length===1?'ser_count1':'ser_count',{n:x.L.length,d:x.done}))}</p><span class="ser-bar"><i style="width:${Math.round(x.done/x.L.length*100)}%"></i></span>
   <div class="list">${x.L.map(sermonCard).join('')}</div>`:''}
   <button class="btn ghost block" data-act="serNew">${ic('plus')}${esc(t('ser_add'))}</button>`}
Object.assign(I18N.es,{series:'Series',ser_one:'Serie',ser_pn:'parte {n}',ser_t:'Serie de sermones',ser_d:'Agrupe mensajes de una misma serie, por ejemplo «La vida de José». Elija una serie o escriba una nueva.',ser_name:'Nombre de la serie',ser_ph:'Ej.: La vida de José',ser_part:'Parte',ser_rm:'Quitar de la serie',ser_saved:'Serie guardada',
  ser_empty:'Todavía no hay series. En un sermón, toque «+ Serie» para comenzar una.',ser_count:'{n} mensajes · {d} predicados',ser_count1:'1 mensaje · {d} predicado',ser_all:'Todas las series',ser_add:'Nuevo sermón en esta serie',f_ser:'Series'});
Object.assign(I18N.pt,{series:'Séries',ser_one:'Série',ser_pn:'parte {n}',ser_t:'Série de sermões',ser_d:'Agrupe mensagens de uma mesma série, por exemplo «A vida de José». Escolha uma série ou escreva uma nova.',ser_name:'Nome da série',ser_ph:'Ex.: A vida de José',ser_part:'Parte',ser_rm:'Tirar da série',ser_saved:'Série salva',
  ser_empty:'Ainda não há séries. Num sermão, toque em «+ Série» para começar uma.',ser_count:'{n} mensagens · {d} pregadas',ser_count1:'1 mensagem · {d} pregada',ser_all:'Todas as séries',ser_add:'Novo sermão nesta série',f_ser:'Séries'});
function listHtml(){if(listState.mode==='n')return notesHtml();
  const arr=filtered();const cats=[...new Set([...meta.cats,...liveS().map(catOf).filter(Boolean)])];const tr=sermons.filter(s=>s.deleted).length+notes.filter(n=>n.deleted).length;
  const F=[['all','f_all'],['ser','f_ser'],['recent','f_recent'],['fav','f_fav'],['done','f_done'],['todo','f_todo']];
  return`<div class="between"><h1 class="h">${esc(t('my_sermons'))}</h1><button class="iconbtn gold" data-act="new" aria-label="${esc(t('new_sermon'))}">${ic('plus')}</button></div>
  ${modeSeg()}
  <label class="search">${ic('search')}<input id="lq" type="search" value="${esc(listState.q)}" placeholder="${esc(t('search_ph'))}" autocomplete="off" data-input="listQ"></label>
  <div class="chips">${F.map(([k,l])=>`<button class="chip" data-act="lf" data-f="${k}" aria-pressed="${listState.f===k}">${esc(t(l))}</button>`).join('')}</div>
  ${cats.length?`<div class="chips"><span class="lbl" style="align-self:center;flex:none">${esc(t('category'))}</span>${cats.map(c=>`<button class="chip cat" data-act="lc" data-c="${esc(c)}" aria-pressed="${listState.cat===c}">${esc(c)}</button>`).join('')}</div>`:''}
  ${listState.f==='ser'?(listState.ser?serieDetailHtml(listState.ser):seriesHtml()):`<div class="list">${!liveS().length?`<div class="empty"><img class="logo" src="logo.jpg" alt="" style="width:80px;height:80px;border-radius:20px"><h3>${esc(t('empty_t'))}</h3><p style="margin:0;max-width:34ch">${esc(t('empty_d'))}</p><button class="btn gold" data-act="new">${ic('plus')}${esc(t('new_sermon'))}</button></div>`
    :arr.length?(listState.q.trim()?`<p class="res-n">${esc(t(arr.length===1?'res_1':'res_n',{n:arr.length}))}</p>`:'')+arr.map(sermonCard).join(''):`<div class="empty"><p style="margin:0">${esc(t('no_res'))}</p></div>`}</div>`}
  ${tr?`<button class="lnk" data-act="trash" style="align-self:center;padding:10px">${ic('trash')} ${esc(t('trash_n',{n:tr}))}</button>`:''}`}
const modeSeg=()=>`<div class="seg"><button data-act="lmode" data-m="s" aria-pressed="${listState.mode==='s'}">${esc(t('nav_list'))}</button><button data-act="lmode" data-m="n" aria-pressed="${listState.mode==='n'}">${esc(t('lib'))}</button></div>`;
/* ---------- Biblioteca personal ---------- */
const NTYPES=['estudio','frase','reflexion','ilustracion','nota','idea','ref'];
function notesHtml(){const q=norm(listState.q.trim());
  let arr=liveN().sort((a,b)=>(b.updated||0)-(a.updated||0)).filter(n=>(!listState.nt||n.type===listState.nt)&&(!q||norm([n.title,n.text,n.ref].join(' ')).includes(q)));
  return`<div class="between"><h1 class="h">${esc(t('lib'))}</h1><button class="iconbtn gold" data-act="nNew" aria-label="${esc(t('n_new'))}">${ic('plus')}</button></div>
  ${modeSeg()}
  <label class="search">${ic('search')}<input id="lq" type="search" value="${esc(listState.q)}" placeholder="${esc(t('lib_ph'))}" autocomplete="off" data-input="listQ"></label>
  <div class="two"><button class="btn ghost" data-act="recG">${ic('mic')}${esc(t('voice_notes'))}</button><button class="btn ghost" data-act="video">${ic('video')}${esc(t('rc2_v'))}</button></div>
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
   <button class="act" data-act="video" data-id="${esc(id)}">${ic('video')}${esc(t('vd_act'))}</button>
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
  const s=fresh||sermons.find(x=>x.id===id);if(!s)return;closeSheet();[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));
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
       ${aiVis()?`<button data-act="aiOpen" data-keep aria-label="${esc(t('ai'))}" style="color:var(--gold-ink)">${ic('spark')}</button>`:''}
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
   <button class="tag ${s.serie?'ser':'add'}" data-act="edSer">${s.serie?esc(s.serie.n)+' · '+esc(t('ser_pn',{n:s.serie.p||1})):(isPremium()?'+ ':'')+esc(t('ser_one'))+(isPremium()?'':' '+ic('lock'))}</button>
   <button class="tag add" data-act="edLang" aria-label="${esc(t('lang_msg'))}">${l==='pt'?'PT':'ES'}</button>
   <button class="tag add" data-act="edInfo">${esc(t('details'))}</button>
   ${empty?`<button class="tag add" data-act="edTpl" style="box-shadow:0 0 0 1.5px var(--gold) inset;color:var(--fg)">${esc(t('models'))}</button>`:`<button class="tag add" data-act="edOrg">${esc(t('organize'))}</button>`}
   <span class="sub" id="edWc" style="margin-left:auto;align-self:center;font-size:12.5px"></span>${longTitleHtml()}`;updWc()
  $$('#edMeta svg').forEach(s=>{s.style.width='16px';s.style.height='16px'})}
function splitLongTitle(){const h1=$('#ed h1');if(!h1)return null;const tx=h1.textContent.trim();if(tx.length<=120)return null;
  const parts=(tx.match(/[^.!?…]+[.!?…]*/g)||[tx]).map(x=>x.trim()).filter(Boolean);let title=parts.length>1?parts[parts.length-1]:'';
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
function bpDraw(){const el=$('#bp');if(!el)return;if(!vOk(BP.ver))BP.ver=vl(BP.ver);const l=BP.ver;const B=BIB[vkey(l)];const names=t('books',null,vl(l));let body='';
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
  if(e.target.closest('[data-bpver]')){verSheet(BP.ver,k=>{BP.ver=k;BP.sel.clear();bpDraw();loadBible(k).then(bpDraw).catch(()=>{})});return}
  const v=e.target.closest('[data-bpv]');if(v){const n=+v.dataset.bpv;BP.sel.has(n)?BP.sel.delete(n):BP.sel.add(n);bpDraw();return}
  const g=e.target.closest('[data-bpgo]');if(g){const[b,c,vv]=g.dataset.bpgo.split(',').map(Number);BP.b=b;BP.c=c;BP.q='';BP.sel=new Set([vv]);bpDraw();return}
  if(e.target.closest('[data-bpins]')&&BP.sel.size&&E){const l=BP.ver;const ch=BIB[vkey(l)][BP.b][BP.c-1];const vs=[...BP.sel].sort((a,b)=>a-b);
    const ref=refName(BP.b,BP.c,vs,vl(l));const txt=vs.length===1?ch[vs[0]-1]:vs.map(x=>`${x} ${ch[x-1]}`).join(' ');
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
   ${planNow().igreja&&authU&&!localMode?`<button class="act" data-act="projSend" data-id="${esc(id)}">${ic('tv')}${esc(t('pj_send'))}</button>`:''}
   <button class="act" data-act="edOrg">${ic('ol')}${esc(t('organize'))}</button>
   <button class="act" data-act="recList">${ic('mic')}${esc(t('rc_list'))}</button>
   <button class="act" data-act="dicE">${ic('dict')}${esc(t('dx_ed'))}</button>
   ${aiVis()?`<button class="act" data-act="aiOpen">${ic('spark')}${esc(t('ai'))}</button>`:''}
   <button class="act" data-act="recE">${ic('mic')}${esc(t('rec'))}</button>
   <button class="act" data-act="vers">${ic('undo')}${esc(t('versions'))}</button>
   <button class="act" data-act="dup" data-id="${esc(id)}">${ic('copy')}${esc(t('act_dup'))}</button>
   <button class="act" data-act="trans" data-id="${esc(id)}">${ic('lang')}${esc(t('tr_to',{l:sLang(E.s)==='pt'?'Español':'Português'}))}</button>
   <button class="act" data-act="video" data-id="${esc(id)}">${ic('video')}${esc(t('vd_act'))}</button>
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
    ${['print','study','preach','points'].map(m=>`<button class="act" data-pdf="${m}">${ic(m==='print'||isPremium()?'print':'lock')}<span style="display:flex;flex-direction:column"><span>${esc(t('pdf_'+m))}${m!=='print'?premTag():''}</span><span class="sub">${esc(t('pdf_'+m+'_d'))}</span></span></button>`).join('')}
    ${navigator.share?`<button class="act" id="shOt">${ic('share')}${esc(t('other_apps'))}</button>`:''}</div>`);
  loadBible(sLang(s)).catch(()=>{});
  $('#shSeg',sh).onclick=e=>{const b=e.target.closest('button');if(!b)return;only=b.dataset.o==='1';$$('#shSeg button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('#shWa',sh).onclick=()=>{const a=document.createElement('a');a.href='https://wa.me/?text='+encodeURIComponent(sermonText(s,only));a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()};
  $('#shCp',sh).onclick=()=>copyText(sermonText(s,only)).then(()=>toast(t('txt_copied')));
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-pdf]');if(b){if(b.dataset.pdf!=='print'&&!isPremium()){closeSheet();planGate('pdf');return}closeSheet();printSermon(s,b.dataset.pdf)}});
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
  if(E&&E.s.id===id)edSave();const s=sermons.find(x=>x.id===id)||(E&&E.s.id===id?E.s:null);if(!s)return;[...$$('.ov')].filter(o=>!o._lock).forEach(o=>closeSheet(o));
  const lang=sLang(s);const r=getResume();const fromSaved=r&&r.id===id;
  const pos=(ls.get('mp.pos',{})||{})[id];PG={s,orig:s,lang,tSec:fromSaved?(r.tSec||0):0,run:false,int:0,calm:false,top:fromSaved?(r.top||0):(pos?pos.top:0),wake:null,raf:0};
  const el=document.createElement('div');el.className='pg '+prefs.p.bg;el.id='pg';
  el.innerHTML=`<div class="pg-top">
     <button class="iconbtn" data-act="pgClose" aria-label="${esc(t('exit'))}">${ic('x')}</button>
     <button class="pg-timer" id="pgTimer" data-act="pgTimer" aria-label="${esc(t('p_timer'))}">${ic('play')}<span id="pgT">00:00</span><small id="pgG"></small></button>
     <button class="pg-where" id="pgWhere" data-act="pgIdx" aria-label="${esc(t('index'))}"></button>
     <button class="pg-rec${PREC?' on':''}${isPremium()?'':' lk'}" id="pgRec" data-act="pgRec" aria-label="${esc(t('rc_btn'))}">${ic(isPremium()?'mic':'lock')}<span id="pgRecT"></span></button>
     <button class="pg-lang" data-act="pgLang" id="pgLang" aria-label="${esc(t('pgl_t'))}">${lang==='pt'?'PT':'ES'}</button>
     <button class="iconbtn" data-act="pgSet" aria-label="${esc(t('p_set'))}" style="color:var(--pfg);font-weight:800;font-size:16px">Aa</button></div>
   <div class="pg-prog"><i id="pgProg"></i></div>
   <div class="pg-scroll" id="pgScroll"><article class="pg-text" id="pgText"></article></div>
   <div class="pg-dim" id="pgDim" aria-hidden="true"></div>
   <div class="pg-bot"><button class="prev" data-act="pgPrev">${ic('back')}${esc(t('p_prev',null,lang))}</button><button class="scr" data-act="pgScr" id="pgScr" aria-label="${esc(t('p_scroll'))}">${ic('down')}</button><button class="next" data-act="pgNext"><span id="pgNextL">${esc(t('p_next',null,lang))}</span>${ic('next')}</button></div>`;
  document.body.appendChild(el);document.body.style.overflow='hidden';
  if(want&&want!==lang){const h=trCached(s,want);if(h){PG.s=Object.assign({},s,{html:h,lang:want});PG.lang=want;$('#pgLang').textContent=want.toUpperCase()}}
  pgRender();pgApply();if(CAST.on&&!CAST.view)setTimeout(()=>castPush(true),300);
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
  $('#pgProg').style.width=Math.min(100,PG.top/max*100)+'%';pgWhere();clearTimeout(pgST);pgST=setTimeout(pgSave,600);if(CAST.on)castPush()}
function pgCur(){const sc=$('#pgScroll');let cur=-1;(PG.secs||[]).forEach((x,i)=>{const h=document.getElementById(x.id);if(h&&h.offsetTop-sc.clientHeight*.4<=sc.scrollTop)cur=i});return cur}
function pgWhere(){if(!PG)return;const i=pgCur();const sc=PG.secs||[];const x=sc[i];
  $('#pgWhere').textContent=x?(x.pt?t('p_point',{i:x.pt,n:PG.npts},PG.lang):x.label):'';
  const nx=sc[i+1];$('#pgNextL').textContent=nx&&nx.pt?t('p_next',null,PG.lang):t('p_next2',null,PG.lang);
  $('.pg-bot .next').style.opacity=nx?'1':'.45'}
function pgGo(dir){if(!PG)return;const sc=$('#pgScroll');const els=(PG.secs||[]).map(x=>document.getElementById(x.id)).filter(Boolean);const y=sc.scrollTop;let tg;
  if(dir>0){const nx=els.find(h=>h.offsetTop-16>y+8);if(!nx){toast(t('p_last',null,PG.lang));return}tg=nx.offsetTop-16}
  else{const pv=els.filter(h=>h.offsetTop-16<y-8);tg=pv.length?pv[pv.length-1].offsetTop-16:0}
  sc.scrollTo({top:Math.max(0,tg),behavior:'smooth'})}
function pgTap(e){if(!PG||PG.cast||e.target.closest('button,a,input'))return;if(String(getSelection()||'').length)return;
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
  const sh=openSheet(`<h3>${esc(t('pgl_t',null,L))}</h3><p class="sub" style="margin:0;font-size:14px;line-height:1.5">${esc(t('pl_d',null,L))}</p>
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
   ${PG.cast?'':`<span class="lbl">${esc(t('cs_t'))}</span><p class="sub" style="font-size:12.5px;margin:-4px 0 0">${esc(t('cs_d'))} ${esc(t('cs_how'))}</p><button class="btn ${CAST.on?'ghost':'dark'} block" data-cast="${CAST.on?'off':'on'}">${ic('tab')}${esc(CAST.on?t('cs_off'):t('cs_on'))}</button>`}
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
  sh.addEventListener('click',e=>{const cb=e.target.closest('[data-cast]');if(cb){if(cb.dataset.cast==='on')castStart();else castStop();closeSheet();return}const b=e.target.closest('[data-pk] button');if(!b)return;const k=b.parentNode.dataset.pk;let v=b.dataset.v;v=v==='true'?true:v==='false'?false:isNaN(+v)?v:+v;p[k]=v;
    $$('button',b.parentNode).forEach(x=>x.setAttribute('aria-pressed',x===b));if(k==='bg'&&p.color!=='auto')p.color='auto';pgApply();if(k==='bg'){closeSheet();pgSettings()}});
  $('#psNight',sh).onclick=()=>{Object.assign(p,{bg:'negro',color:'#FFFFFF',dim:Math.max(p.dim||0,.25)});pgApply();closeSheet();pgSettings()};
  $('#psReset',sh).onclick=()=>{PG.run=false;clearInterval(PG.int);PG.tSec=0;pgTimerDraw();pgSave()};
  $('#psCalm',sh).onclick=()=>{PG.calm=!PG.calm;pgApply();closeSheet()};
  const fs=$('#psFull',sh);if(fs)fs.onclick=()=>{(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{});closeSheet()}}

/* ---------- Grabar la predicación (audio guardado solo en este celular, IndexedDB) ---------- */
let RDB=null;function pRecDb(){if(RDB)return RDB;RDB=new Promise((ok,ko)=>{const r=indexedDB.open('mp-rec',1);r.onupgradeneeded=()=>{const st=r.result.createObjectStore('rec',{keyPath:'id'});st.createIndex('sid','sid')};r.onsuccess=()=>ok(r.result);r.onerror=()=>{RDB=null;ko(r.error)}});return RDB}
async function pRecTx(mode,fn){const db=await pRecDb();return new Promise((ok,ko)=>{const tx=db.transaction('rec',mode);const st=tx.objectStore('rec');let out;Promise.resolve(fn(st)).then(v=>out=v);tx.oncomplete=()=>ok(out);tx.onerror=()=>ko(tx.error)})}
const pRecAll=()=>pRecTx('readonly',st=>new Promise(ok=>{const q=st.getAll();q.onsuccess=()=>ok(q.result||[])}));
const pRecPut=o=>pRecTx('readwrite',st=>{st.put(o)});const pRecDel=id=>pRecTx('readwrite',st=>{st.delete(id)});
let PREC=null;
async function pRecToggle(){const now=Date.now();if(now-(pRecToggle._t||0)<700)return;pRecToggle._t=now;if(PREC){pRecStop();return}
  if(!navigator.mediaDevices||!window.MediaRecorder){toast(t('rc_nosup'));return}
  let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:true,autoGainControl:true}})}catch(e){toast(t('rc_perm'));return}
  const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(m=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||'';
  let mr;try{mr=new MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:64000}:{})}catch(e){stream.getTracks().forEach(x=>x.stop());toast(t('rc_nosup'));return}
  const R={mr,stream,chunks:[],start:Date.now(),sid:PG?PG.s.id:'',title:PG?(derive(PG.s).title||t('untitled')):'',int:0};PREC=R;
  mr.ondataavailable=e=>{if(e.data&&e.data.size)R.chunks.push(e.data)};mr.start(5000);
  PREC.int=setInterval(pRecBadge,1000);pRecBadge();toast(t('rc_on'))}
function pRecBadge(){const b=$('#pgRec');if(!b)return;b.classList.toggle('on',!!PREC);const sp=$('#pgRecT');if(sp)sp.textContent=PREC?fmtSec(Math.round((Date.now()-PREC.start)/1000)):''}
function pRecStop(){if(!PREC)return Promise.resolve();const R=PREC;PREC=null;clearInterval(R.int);pRecBadge();
  return new Promise(ok=>{R.mr.onstop=async()=>{R.stream.getTracks().forEach(x=>x.stop());const type=(R.mr.mimeType||R.chunks[0]&&R.chunks[0].type||'audio/mp4').split(';')[0];
      const blob=new Blob(R.chunks,{type});const dur=Math.round((Date.now()-R.start)/1000);
      if(dur>=3&&blob.size){try{await pRecPut({id:uid(),sid:R.sid,title:R.title,at:R.start,dur,type,blob});toast(t('rc_saved'))}catch(e){toast(t('rc_err'))}}ok()};
    try{R.mr.stop()}catch(e){ok()}})}
function pRecExt(type){return /mp4|aac|m4a/.test(type)?'m4a':/webm/.test(type)?'webm':/ogg/.test(type)?'ogg':'audio'}
async function pRecSheet(sid){let L=[];try{L=(await pRecAll()).filter(r=>!sid||r.sid===sid).sort((a,b)=>b.at-a.at)}catch(e){}
  const sh=openSheet(`<div class="between"><h3>${esc(t('rc_t'))}</h3><button class="iconbtn" data-x="close" aria-label="${esc(t('close'))}">${ic('x')}</button></div>
   <p class="sub" style="margin:0;font-size:13px">${esc(t('rc_d'))}</p><div id="rcL" class="rc-list"></div>`,{cls:'big ns'});
  const urls=[];const draw=()=>{$('#rcL',sh).innerHTML=L.length?L.map(r=>{const u=URL.createObjectURL(r.blob);urls.push(u);return`<div class="rc-i" data-id="${esc(r.id)}"><div class="between"><b>${esc(r.title||t('untitled'))}</b><span class="sub" style="font-size:12.5px">${esc(fmtSec(r.dur))}</span></div>
     <span class="sub" style="font-size:12.5px">${esc(new Date(r.at).toLocaleString(prefs.ui==='pt'?'pt-BR':'es-PY',{dateStyle:'medium',timeStyle:'short'}))} · ${(r.blob.size/1048576).toFixed(1)} MB</span>
     <audio controls preload="metadata" src="${u}"></audio>
     <div class="row" style="gap:8px"><button class="btn sm ghost" data-rx="share">${ic('share')}${esc(t('cu_share'))}</button><button class="btn sm ghost" data-rx="del" style="color:var(--danger)">${ic('trash')}${esc(t('rc_del'))}</button></div></div>`}).join(''):`<div class="empty"><p style="margin:0;max-width:34ch">${esc(t('rc_none'))}</p></div>`};draw();
  sh.addEventListener('click',async e=>{if(e.target.closest('[data-x=close]')){closeSheet();return}const b=e.target.closest('[data-rx]');if(!b)return;const it=b.closest('[data-id]');const r=L.find(x=>x.id===it.dataset.id);if(!r)return;
    if(b.dataset.rx==='del'){if(!confirmTap(b))return;await pRecDel(r.id);L=L.filter(x=>x!==r);draw();toast(t('rc_deleted'))}
    else{const name=(r.title||'Meu Púlpito').replace(/[^\p{L}\p{N} ._-]+/gu,'').slice(0,60)+'.'+pRecExt(r.type);const f=new File([r.blob],name,{type:r.type});
      if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:r.title}).catch(()=>{})}else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=name;a.click()}}});
  const ov=sh.parentNode;const prev=ov._onClose;ov._onClose=()=>{urls.forEach(u=>URL.revokeObjectURL(u));prev&&prev()}}
function confirmTap(b){if(b.dataset.sure)return true;b.dataset.sure='1';const o=b.innerHTML;b.innerHTML=esc(t('rc_sure'));setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.innerHTML=o}},3000);return false}
Object.assign(I18N.es,{rc_t:'Grabaciones',rc_d:'Las grabaciones de sus predicaciones quedan guardadas solo en este celular. Compártalas para guardarlas en otro lugar o enviarlas a quien faltó.',rc_none:'Todavía no hay grabaciones. En el Modo Predicar, toque el micrófono para grabar.',
  rc_on:'Grabando la predicación',rc_saved:'Grabación guardada en Grabaciones',rc_err:'No se pudo guardar la grabación',rc_perm:'Permita el micrófono para grabar',rc_nosup:'Este navegador no permite grabar audio',rc_del:'Borrar',rc_deleted:'Grabación borrada',rc_sure:'¿Borrar? Toque de nuevo',rc_btn:'Grabar la predicación',rc_list:'Grabaciones de este sermón',rc_all:'Mis grabaciones'});
Object.assign(I18N.pt,{rc_t:'Gravações',rc_d:'As gravações das suas pregações ficam guardadas só neste celular. Compartilhe para guardar em outro lugar ou mandar para quem faltou.',rc_none:'Ainda não há gravações. No Modo Pregar, toque no microfone para gravar.',
  rc_on:'Gravando a pregação',rc_saved:'Gravação salva em Gravações',rc_err:'Não foi possível salvar a gravação',rc_perm:'Permita o microfone para gravar',rc_nosup:'Este navegador não permite gravar áudio',rc_del:'Apagar',rc_deleted:'Gravação apagada',rc_sure:'Apagar? Toque de novo',rc_btn:'Gravar a pregação',rc_list:'Gravações deste sermão',rc_all:'Minhas gravações'});
function closePreach(){if(!PG)return;if(PREC)pRecStop();ascStop();pgSave();clearInterval(PG.int);if(CAST.on&&!PG.cast)castStop();try{PG.wake&&PG.wake.release()}catch(e){}
  const id=PG.s.id,min=PG.tSec>=60?Math.round(PG.tSec/60):0;$('#pg').remove();document.body.style.overflow='';PG=null;
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  if(!E)render();if(min&&sermons.find(x=>x.id===id))regSheet(id,{min})}

/* =========================================================
   BIBLIA
   ========================================================= */
const BV={ver:null,b:26,c:1,sel:new Set(),q:'',fav:false,err:false};
const bver=()=>{const v=vkey(BV.ver||prefs.bibleVer||prefs.ui);return vOk(v)?v:vkey(prefs.ui)};
function bibleHtml(){const l=bver();const B=BIB[l];const names=t('books',null,vl(l));
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
   ${sel.length&&!BV.fav?`<div class="vbar"><span class="ref">${esc(refName(BV.b,BV.c,sel,vl(l)))}</span>
     <button class="iconbtn" data-act="bCopy" aria-label="${esc(t('copy_txt'))}">${ic('copy')}</button>
     <button class="iconbtn" data-act="bFav" aria-label="${esc(t('act_fav'))}">${ic('star')}</button>
     <button class="iconbtn" data-act="bCmp" aria-label="${esc(t('cmp'))}">${ic('lang')}</button>
     <button class="iconbtn" data-act="bXr" aria-label="${esc(t('xr_t'))}">${ic('link')}</button>
     <button class="btn sm gold" data-act="bIns">${esc(t('ins_s'))}</button></div>`:''}`}
function bibleAfter(){const l=bver();if(!BIB[l]&&!BV.err)loadBible(l).then(()=>{if(view.tab==='bible'&&!view.overlay)render()}).catch(()=>{BV.err=true;if(view.tab==='bible')render()});
  const bb=$('#bBook'),bc=$('#bChap');if(bb)bb.onchange=()=>{BV.b=+bb.value;BV.c=1;BV.sel.clear();render()};if(bc)bc.onchange=()=>{BV.c=+bc.value;BV.sel.clear();render()};const bv=$('#bVers');if(bv)bv.onchange=()=>{const v=+bv.value;if(!v)return;BV.sel=new Set([v]);render();setTimeout(()=>{const el=$(`.vs[data-v="${v}"]`);el&&el.scrollIntoView({block:'center',behavior:'smooth'})},60)}}
let BIDX={};
function bibleSearch(q,l){const B=BIB[l];if(!B)return[];if(!BIDX[l]){const idx=[];B.forEach((bk,b)=>bk.forEach((ch,c)=>ch.forEach((v,i)=>{if(v)idx.push([b,c+1,i+1,norm(v),v])})));BIDX[l]=idx}
  const nq=norm(q.trim());const out=[];for(const r of BIDX[l]){const i=r[3].indexOf(nq);if(i>=0){out.push({b:r[0],c:r[1],v:r[2],html:`${esc(r[4].slice(0,i))}<mark>${esc(r[4].slice(i,i+nq.length))}</mark>${esc(r[4].slice(i+nq.length))}`});if(out.length>=80)break}}return out}
function bSelText(){const l=bver();const ch=BIB[l][BV.b][BV.c-1];const vs=[...BV.sel].sort((a,b)=>a-b);
  return{ref:refName(BV.b,BV.c,vs,vl(l)),text:vs.length===1?ch[vs[0]-1]:vs.map(v=>`${v} ${ch[v-1]}`).join(' '),v:l}}
function chooseSermon(cb){const S=sortedByUpd();const sh=openSheet(`<h3>${esc(t('choose_s'))}</h3><div class="acts">
   <button class="act" data-cs="__new">${ic('plus')}${esc(t('new_sermon'))}</button>
   ${S.slice(0,40).map(s=>`<button class="act" data-cs="${esc(s.id)}"><span class="serif" style="font-weight:700">${esc(derive(s).title||t('untitled'))}</span></button>`).join('')}</div>`);
  sh.addEventListener('click',e=>{const b=e.target.closest('[data-cs]');if(b){closeSheet();cb(b.dataset.cs)}})}
function insertVerseInto(id,ref,text){let s;
  if(id==='__new'){s={id:uid(),html:`<h1></h1><blockquote data-ref="${esc(ref)}">${esc(text)}</blockquote><p><br></p>`,lang:vl(bver()),fav:false,created:Date.now(),log:[],v:2};putSermon(s,{silent:true});openEditor(s.id);toast(t('inserted'));return}
  s=sermons.find(x=>x.id===id);if(!s)return;s.html=cleanHtml(getHtml(s)+`<blockquote data-ref="${esc(ref)}">${esc(text)}</blockquote>`);s.v=2;putSermon(s,{silent:true});openEditor(id);toast(t('inserted'))}

/* =========================================================
   AGENDA
   ========================================================= */
function dateBox(iso,gold){const d=new Date(iso+'T12:00:00');return`<div class="datebox ${gold?'gold':''}"><span>${esc(t('wd')[d.getDay()])}</span><b>${d.getDate()}</b></div>`}
const evPlace=e=>e.place==='sede'?t('sede'):e.place==='anexo'?t('anexo'):(e.placeName||t('other'));
function evCard(e,first){const s=e.sermonId&&sermons.find(x=>x.id===e.sermonId);
  return`<div class="ev"><button class="hd" data-act="evEdit" data-id="${esc(e.id)}">${dateBox(e.date,first)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <b style="font-size:15px">${esc(evPlace(e))}${e.time?' · '+esc(e.time):''}</b><span class="sub">${esc([e.type,e.theme||(!s?t('tbd'):'')].filter(Boolean).join(' · '))}</span>${e.desc?`<span class="sub ev-desc">${esc(e.desc)}</span>`:''}</div></button><button class="iconbtn ev-cal" data-act="evCal" data-id="${esc(e.id)}" aria-label="${esc(t('ev_cal'))}">${ic('cal')}</button>
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
   <div class="seg"><button data-act="agMode" data-m="up" aria-pressed="${agMode==='up'}">${esc(t('next_tab'))}</button><button data-act="agMode" data-m="month" aria-pressed="${agMode==='month'}">${esc(t('ag_month'))}</button><button data-act="agMode" data-m="hist" aria-pressed="${agMode==='hist'}">${esc(t('hist_all'))}</button></div>
   ${agMode==='month'?monthHtml():agMode==='hist'?histAllHtml():`<span class="sect">${esc(t('upcoming'))}</span>
   <div class="list">${up.length?up.map((e,i)=>evCard(e,i===0)).join(''):`<div class="empty"><p style="margin:0;max-width:34ch">${esc(t('no_ev'))}</p></div>`}</div>
   ${past.length?`<span class="sect">${esc(t('past'))}</span><div class="list">${past.map(e=>evCard(e,false)).join('')}</div>`:''}`}`}

/* ---------- Agenda: recordatorio en el calendario del celular (.ics) y vista mensual ---------- */
function evSaved(e){if(!+e.rem){toast(t('ev_saved'));return}
  const sh=openSheet(`<div class="pk"><span class="pk-ic">${ic('cal')}</span><h3>${esc(t('ev_saved'))}</h3><p>${esc(t('ev_cal_d'))}</p>
    <button class="btn gold block" id="evIcs">${ic('cal')}${esc(t('ev_cal'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('pk_no'))}</button></div>`);
  $('#evIcs',sh).onclick=()=>{closeSheet();evIcs(e)}}
function icsEsc(x){return String(x||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1')}
function evIcs(e){const s=e.sermonId&&sermons.find(x=>x.id===e.sermonId);const d=e.date.replace(/-/g,'');const tm=(e.time||'19:00').replace(':','')+'00';
  const st=new Date(e.date+'T'+(e.time||'19:00')+':00');const en=new Date(st.getTime()+2*3600e3);const p=n=>String(n).padStart(2,'0');
  const fl=x=>`${x.getFullYear()}${p(x.getMonth()+1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
  const now=new Date();const stamp=`${now.getUTCFullYear()}${p(now.getUTCMonth()+1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}00Z`;
  const title=[t('ev_ics_t'),evPlace(e),e.type].filter(Boolean).join(' · ');
  const desc=[s?t('sermon')+': '+(derive(s).title||t('untitled')):e.theme,e.desc,'Meu Púlpito'].filter(Boolean).join('\n');
  const rem=+e.rem||60;const trig=rem>=1440?'-P1D':`-PT${rem}M`;
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Meu Pulpito//Agenda//PT','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:${e.id}@meupulpito.com`,`DTSTAMP:${stamp}`,`DTSTART:${fl(st)}`,`DTEND:${fl(en)}`,
    `SUMMARY:${icsEsc(title)}`,`LOCATION:${icsEsc(evPlace(e))}`,`DESCRIPTION:${icsEsc(desc)}`,'BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${icsEsc(title)}`,`TRIGGER:${trig}`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const name='meu-pulpito-'+e.date+'.ics';const f=new File([ics],name,{type:'text/calendar'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title}).catch(()=>{})}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)}}
let agMonth=null;
function monthHtml(){const td=todayISO();if(!agMonth)agMonth=td.slice(0,7);const [Y,Mo]=agMonth.split('-').map(Number);const M=t('months');
  const first=new Date(Y,Mo-1,1,12);const off=(first.getDay()+6)%7;const n=new Date(Y,Mo,0).getDate();const sel=agMonth===td.slice(0,7)?td:agMonth+'-01';const pick=monthHtml._d&&monthHtml._d.startsWith(agMonth)?monthHtml._d:sel;
  const iso=d=>`${Y}-${String(Mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const wd=t('wd');const hd=[1,2,3,4,5,6,0].map(i=>`<span>${esc(wd[i].slice(0,3))}</span>`).join('');
  const cells=Array.from({length:off},()=>'<span></span>').join('')+Array.from({length:n},(_,i)=>{const d=iso(i+1);const k=agenda.filter(e=>e.date===d).length;
    return`<button class="mc ${d===td?'today':''} ${d===pick?'sel':''}" data-act="agDay" data-d="${d}">${i+1}${k?`<i>${k>1?k:''}</i>`:''}</button>`}).join('');
  const evs=agenda.filter(e=>e.date===pick).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
  return`<div class="mwrap"><div class="mcal"><div class="mhead"><button class="iconbtn" data-act="agMon" data-n="-1" aria-label="${esc(t('ag_prev'))}">${ic('back')}</button><b>${esc(M[Mo-1])} ${Y}</b><button class="iconbtn" data-act="agMon" data-n="1" aria-label="${esc(t('ag_next'))}">${ic('next')}</button></div>
   <div class="mgrid">${hd}${cells}</div></div><div class="mday">
   <div class="between"><span class="sect">${esc(fmtDay(new Date(pick+'T12:00:00').getTime()))}</span><button class="lnk" data-act="evNewDay" data-d="${pick}">${ic('plus')} ${esc(t('schedule'))}</button></div>
   <div class="list">${evs.length?evs.map(e=>evCard(e,false)).join(''):`<div class="empty"><p style="margin:0">${esc(t('ag_none_day'))}</p></div>`}</div></div></div>`}
Object.assign(I18N.es,{ev_desc:'Descripción',ev_desc_ph:'Ej.: llevar la Biblia de estudio, culto con Santa Cena…',ev_rem:'Recordatorio',ev_r0:'Sin recordatorio',ev_r60:'1 hora antes',ev_r180:'3 horas antes',ev_r1440:'1 día antes',ev_cal:'Agregar al calendario del celular',ev_cal_d:'Para recibir el aviso en el celular, agregue esta predicación al calendario. El calendario le avisará a la hora elegida.',ev_ics_t:'Predicación',ag_month:'Mes',ag_prev:'Mes anterior',ag_next:'Mes siguiente',ag_none_day:'No hay predicaciones este día.',ev_add_cal:'Calendario'});
Object.assign(I18N.pt,{ev_desc:'Descrição',ev_desc_ph:'Ex.: levar a Bíblia de estudo, culto com Santa Ceia…',ev_rem:'Lembrete',ev_r0:'Sem lembrete',ev_r60:'1 hora antes',ev_r180:'3 horas antes',ev_r1440:'1 dia antes',ev_cal:'Adicionar ao calendário do celular',ev_cal_d:'Para receber o aviso no celular, adicione esta pregação ao calendário. O calendário vai avisar no horário escolhido.',ev_ics_t:'Pregação',ag_month:'Mês',ag_prev:'Mês anterior',ag_next:'Próximo mês',ag_none_day:'Não há pregações neste dia.',ev_add_cal:'Calendário'});
function evForm(id,day){const e=id?Object.assign({},agenda.find(x=>x.id===id)):{id:uid(),date:day||addDays(todayISO(),(7-new Date().getDay())%7||7),time:'19:00',place:'sede',placeName:'',type:'',theme:'',sermonId:'',desc:'',rem:60};
  const S=sortedByUpd();const cats=[...new Set([...meta.cats,...agenda.map(x=>x.type).filter(Boolean)])];let place=e.place;
  const sh=openSheet(`<h3>${esc(t(id?'ev_edit':'ev_new'))}</h3>
   <div class="two"><div class="fld"><label for="evD">${esc(t('date'))}</label><input class="inp" id="evD" type="date" value="${esc(e.date)}"></div>
     <div class="fld"><label for="evT">${esc(t('time'))}</label><input class="inp" id="evT" type="time" value="${esc(e.time||'')}"></div></div>
   <div class="fld"><span class="lb">${esc(t('place'))}</span><div class="seg" id="evPl">${['sede','anexo','otro'].map(k=>`<button data-p="${k}" aria-pressed="${place===k}">${esc(t(k==='otro'?'other':k))}</button>`).join('')}</div>
     <input class="inp" id="evPn" placeholder="${esc(t('place_name'))}" value="${esc(e.placeName||'')}" ${place==='otro'?'':'hidden'}></div>
   <div class="fld"><label for="evTy">${esc(t('cult'))}</label><select class="inp" id="evTy"><option value="">—</option>${cats.map(c=>`<option ${c===e.type?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
   <div class="fld"><label for="evTh">${esc(t('theme'))}</label><input class="inp" id="evTh" value="${esc(e.theme||'')}"></div>
   <div class="fld"><label for="evDs">${esc(t('ev_desc'))}</label><textarea class="inp" id="evDs" rows="2" placeholder="${esc(t('ev_desc_ph'))}">${esc(e.desc||'')}</textarea></div>
   <div class="fld"><label for="evR">${esc(t('ev_rem'))}</label><select class="inp" id="evR">${[[0,'ev_r0'],[60,'ev_r60'],[180,'ev_r180'],[1440,'ev_r1440']].map(([v,k])=>`<option value="${v}" ${+(e.rem??60)===v?'selected':''}>${esc(t(k))}</option>`).join('')}</select></div>
   <div class="fld"><label for="evS">${esc(t('sermon'))}</label><select class="inp" id="evS"><option value="">${esc(t('later_pick'))}</option>${S.map(s=>`<option value="${esc(s.id)}" ${s.id===e.sermonId?'selected':''}>${esc(derive(s).title||t('untitled'))}</option>`).join('')}</select></div>
   <div class="two">${id?`<button class="btn ghost" id="evDel" style="color:var(--danger)">${ic('trash')}${esc(t('act_del'))}</button>`:`<button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button>`}<button class="btn gold" id="evOk">${esc(t('save'))}</button></div>`);
  $('#evPl',sh).onclick=ev=>{const b=ev.target.closest('button');if(!b)return;place=b.dataset.p;$$('#evPl button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#evPn',sh).hidden=place!=='otro'};
  $('#evOk',sh).onclick=()=>{Object.assign(e,{date:$('#evD',sh).value||todayISO(),time:$('#evT',sh).value,place,placeName:place==='otro'?$('#evPn',sh).value.trim():'',type:$('#evTy',sh).value,theme:$('#evTh',sh).value.trim(),sermonId:$('#evS',sh).value,desc:$('#evDs',sh).value.trim().slice(0,600),rem:+$('#evR',sh).value});
    putEvent(e);closeSheet();render();evSaved(e)};
  const del=$('#evDel',sh);if(del)del.onclick=()=>{if(!confirmTap(del))return;delEvent(e.id);closeSheet();toast(t('ev_del'));render()}}

/* =========================================================
   PERFIL
   ========================================================= */
function profileHtml(){const lb=ls.get(BAK,null);const seg=(act,cur,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button data-act="${act}" data-v="${v}" aria-pressed="${cur===v}">${esc(l)}</button>`).join('')}</div>`;
  return`<div class="subhead"><button class="iconbtn" data-act="back" aria-label="${esc(t('close'))}">${ic('back')}</button><h1 class="h">${esc(t('nav_profile'))}</h1></div>
  <div class="card row" style="gap:14px"><button class="avatar avbtn" data-act="photo" aria-label="${esc(t(meta.photo?'photo':'photo_add'))}">${avatarIn()}<span class="avcam">${ic('cam')}</span></button>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px">${esc(meta.name||t('pastor'))}</b><span class="sub" style="overflow-wrap:anywhere">${esc(localMode?t('local_only'):authU?authU.email:'')}</span>${localMode?`<button class="linkbtn" data-act="toLogin">${esc(t('login_btn'))}</button>`:''}${meta.photo?`<button class="linkbtn" data-act="photoRm">${esc(t('photo_rm'))}</button>`:''}</div></div>
  <div class="pgrp">
    <div class="prow"><label class="k" for="pName">${esc(t('your_name'))}</label><input class="inp" id="pName" value="${esc(meta.name||'')}" placeholder="${esc(t('pastor'))}" style="max-width:220px;height:42px" data-input="pName"></div>
    ${!localMode?`<div class="prow"><span class="k">WhatsApp</span><button class="btn sm ghost" data-act="waEdit">${meta.wa?esc(waShow(meta.wa)):esc(t('wa_add'))}</button></div>`:''}
    <div class="prow"><span class="k">${esc(t('language'))}</span>${seg('pUi',prefs.ui,[['es','Español'],['pt','Português']])}</div>
    <div class="prow"><span class="k">${esc(t('appearance'))}</span>${seg('pTheme',prefs.theme,[['light',t('light')],['dark',t('dark')],['auto',t('auto')]])}</div>
    <div class="prow"><span class="k">${esc(t('def_bible'))}</span><button class="btn sm ghost" data-act="pBibleSel">${esc(VNAME[vkey(prefs.bibleVer||prefs.ui)])}${ic('down')}</button></div>
  </div>
  <div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch"><span class="k">${esc(t('categories'))}</span>
    <div class="catlist">${meta.cats.map((c,i)=>`<span class="tag">${esc(c)}<button data-act="catRm" data-i="${i}" aria-label="${esc(t('act_del'))} ${esc(c)}">${ic('x')}</button></span>`).join('')}</div>
    <form class="row" data-form="catAdd"><input class="inp" id="catNew" placeholder="${esc(t('add_cat'))}" style="height:42px"><button class="btn sm dark">${esc(t('add'))}</button></form></div></div>
  <div class="pgrp">
    <div class="prow"><span><span class="k">${esc(t('backup'))}</span><span class="s">${esc(t('last_bak',{d:lb?fmtD(todayISO(new Date(lb))):t('never')}))}</span></span><button class="btn sm ghost" data-act="bakGo">${esc(t('copy_now'))}</button></div>
    <div class="prow"><span><span class="k">${esc(t('bk_all'))}</span><span class="s">${esc(t('bk_all_d'))}</span></span><button class="btn sm gold" data-act="bakFile">${ic('dl')}${esc(t('bk_dl'))}</button></div>
    ${isAdmin()||prefs.mmEmail?`<div class="prow"><span><label class="k" for="pMail">${esc(t('tr_mail'))}</label><span class="s">${esc(t('tr_mail_d'))}</span></span><input class="inp" id="pMail" type="email" value="${esc(prefs.mmEmail||'')}" placeholder="—" style="max-width:220px;height:42px" data-input="pMail"></div>`:''}
    <div class="prow"><span><span class="k">${esc(t('autobak'))}</span><span class="s">${esc(t('autobak_d'))}</span></span><button class="btn sm ghost" data-act="autoBak">${ic('undo')}${esc(t('restore_it'))}</button></div>
    <div class="prow"><span class="k">${esc(t('restore'))}</span><button class="btn sm ghost" data-act="impOpen">${ic('clip')}${esc(t('import'))}</button></div>
    <div class="prow"><span class="sync" data-sync>${syncHtml()}</span>${localMode?`<button class="btn sm dark" data-act="toLogin">${esc(t('login_btn'))}</button>`:''}</div>
  </div>
  <div class="pgrp">
    <div class="prow"><span><span class="k">${esc(t('lock'))}</span><span class="s">${esc(t('lock_d'))}</span></span>${seg('lockT',lockCfg()?'on':'off',[['off',t('no')],['on',t('yes')]])}</div>
    ${lockCfg()&&window.PublicKeyCredential?`<div class="prow"><span class="k">${esc(t('bio'))}</span>${seg('bioT',lockCfg().bio?'on':'off',[['off',t('no')],['on',t('yes')]])}</div>`:''}
  </div>
  ${subHtml()}
  ${aiVis()?`<div class="pgrp"><div class="prow" style="flex-direction:column;align-items:stretch;gap:8px"><span><span class="k">${ic('spark')} ${esc(t('ai'))}</span><span class="s">${esc(t('ai_d'))}</span></span>
    <label class="s" for="pAi">${esc(t('ai_key'))} · ${esc(t('ai_key_d'))}</label>
    <div class="row"><input class="inp" id="pAi" type="password" autocomplete="off" value="${esc(aiKey())}" placeholder="sk-ant-…" style="height:42px" data-input="pAi"><button class="btn sm dark" data-act="aiTest">${esc(t('ai_test'))}</button></div></div></div>`:''}
  ${isAdmin()?`<div class="pgrp"><a class="prow plink" href="/escritorio/" data-ext="1" rel="noopener"><span><span class="k">${ic('sliders')} ${esc(t('es_t'))}</span><span class="s">${esc(t('es_d'))}</span></span>${ic('next')}</a><button class="prow plink" data-act="rlDemo"><span><span class="k">${ic('star')} ${esc(t('rl_test'))}</span><span class="s">${esc(t('rl_test_d'))}</span></span>${ic('next')}</button></div>`:''}
  <div class="pgrp">
    <a class="prow plink" href="https://whatsapp.com/channel/0029Vb9d3dXFHWpvOk3CTm3J" target="_blank" rel="noopener"><span><span class="k">${esc(t('ch_t'))}</span><span class="s">${esc(t('ch_d'))}</span></span>${ic('next')}</a>
    <button class="prow plink" data-act="privacy"><span><span class="k">${esc(t('priv'))}</span><span class="s">${esc(t('priv_d'))}</span></span>${ic('next')}</button>
    ${!localMode&&authU?`<button class="prow plink" data-act="delAcc"><span><span class="k" style="color:var(--danger)">${esc(t('del_acc'))}</span><span class="s">${esc(t('del_acc_d'))}</span></span>${ic('next')}</button>`:''}
  </div>
  <details class="credits"><summary>${esc(t('src_t'))}</summary><p class="sub" style="margin:8px 0 0;font-size:12px;line-height:1.5">${esc(t('credits'))}</p></details>
  ${!localMode&&authU?`<div class="pgrp"><button class="prow plink" data-act="castView"><span><span class="k">${ic('tab')} ${esc(t('cs_t'))}</span><span class="s">${esc(t('cs_view'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="projPage"><span><span class="k">${ic('tv')} ${esc(t('pj_t'))}</span><span class="s">${esc(t('pj_home'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="pubPage"><span><span class="k">${ic('globe')} ${esc(t('pb_t'))}</span><span class="s">${esc(pubCfg().on?t('pb_on'):t('pb_d'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="refer"><span><span class="k">${ic('share')} ${esc(t('rf_btn'))}</span><span class="s">${esc(t('rf_btn_d'))}</span></span>${ic('next')}</button>${isAdmin()?'':`<button class="prow plink" data-act="depo"><span><span class="k">${ic('star')} ${esc(t('dp_btn'))}</span><span class="s">${esc(t('dp_btn_d'))}</span></span>${ic('next')}</button>`}</div>`:''}
  <div class="pgrp"><button class="prow plink" data-act="recAll"><span><span class="k">${ic('mic')} ${esc(t('rc_all'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="video"><span><span class="k">${ic('video')} ${esc(t('vd_t'))}</span><span class="s">${esc(t('vd_home'))}</span></span>${ic('next')}</button></div>
  ${!localMode&&authU?`<div class="pgrp"><button class="prow plink" data-act="support"><span><span class="k">${ic('chat')} ${esc(t('su_btn'))} <span class="su-badge" id="supBadge" ${SUP.uu?'':'hidden'}>${SUP.uu}</span></span><span class="s">${esc(t('su_btn_d'))}</span></span>${ic('next')}</button></div>`:''}
  <div class="pgrp"><button class="prow plink" data-act="help"><span><span class="k">${ic('doc')} ${esc(t('hp_t'))}</span><span class="s">${esc(t('hp_d'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="news"><span><span class="k">${ic('spark')} ${esc(t('nw_btn'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="report"><span><span class="k">${ic('chat')} ${esc(t('rp_btn'))}</span></span>${ic('next')}</button><button class="prow plink" data-act="onb"><span><span class="k">${ic('play')} ${esc(t('ob_btn'))}</span></span>${ic('next')}</button></div>
  ${!localMode&&authU?`<button class="btn ghost block" data-act="logout" style="color:var(--danger)">${ic('out')}${esc(t('logout'))}</button>`:''}
  <div class="foot-brand"><span class="mark sm"><img class="b-d" src="mark.png" alt=""><img class="b-l" src="mark-light.png" alt=""></span>
    <b><span class="w1">MEU</span> <span class="w2">PÚLPITO</span></b><small>${esc(t('tagline'))}</small>
    <a class="ig-link" href="https://instagram.com/meupulpito" target="_blank" rel="noopener">${ic('ig')}<span>@meupulpito</span></a>
    <span class="fb-v">${esc(t('ver_l'))} 1.0 · © ${new Date().getFullYear()}<br>${esc(t('dev_by'))} <b style="color:var(--gold-ink)">Araújo Tech</b></span></div>`}
const PRIV={es:[['Sus sermones son suyos','Todo lo que escribe en Meu Púlpito (sermones, agenda, biblioteca y notas) le pertenece. Se usa solo para que la aplicación funcione y para que usted lo vea en cualquier dispositivo donde entre con su cuenta.'],
 ['Qué guardamos','Su correo, su nombre y su foto (si los agrega), su número de WhatsApp (si lo informa; se usa solo para la bienvenida y los avisos de su plan), sus sermones, agenda, biblioteca, notas y preferencias de lectura, el plan contratado, su historial de pagos y los mensajes que usted envía al soporte. También guardamos estadísticas de uso sin contenido (por ejemplo, cuántos sermones tiene, cuándo usó la app por última vez y en qué sección estaba), para dar soporte y mejorar el servicio.'],
 ['Dónde se guarda','En los servidores de Google Firebase, protegidos por su contraseña. Además queda una copia en su celular para que funcione sin internet. Las grabaciones de audio del Modo Predicar quedan solo en su celular y no se suben a la nube. Los videos grabados con el teleprompter tampoco: la cámara y el micrófono se usan solo mientras graba, y el video queda en su aparato hasta que usted lo comparta o lo guarde.'],
 ['Quién puede verlo','Solo usted, con su cuenta. Las reglas de seguridad impiden que otros usuarios, y también el administrador desde la aplicación, lean el contenido de sus sermones. El responsable técnico se compromete a no acceder a su contenido, salvo que usted lo pida para recibir ayuda o que la ley lo exija. Las únicas excepciones son lo que usted mismo decide publicar en su página pública y lo que comparte con el acceso del equipo de proyección (vea abajo).'],
 ['Lo que no hacemos','No vendemos sus datos, no mostramos publicidad y no usamos sus sermones para nada que no sea la aplicación.'],
 ['Servicios externos','Traducción automática (MyMemory): solo se envía el texto que usted pide traducir. Asistente de inteligencia artificial (Anthropic): solo si usted coloca su propia clave, y solo el texto que usted envía; la clave queda únicamente en su celular. Cotización de monedas (ExchangeRate-API): el sitio consulta el tipo de cambio del día para mostrar precios aproximados fuera de Paraguay y Brasil, sin enviar datos personales. Tipografías de Google Fonts en el sitio. Videos de testimonios: se cargan desde YouTube (modo sin cookies) solo cuando usted toca Reproducir.'],
 ['Estadísticas del sitio','Contamos las visitas a meupulpito.com de forma anónima (idioma, tipo de aparato, país aproximado por el huso horario y de dónde llegó), sin datos personales. También usamos Google Analytics para ver cuántas personas visitan el sitio y la aplicación (páginas vistas, país y tipo de aparato, con la IP anonimizada). El contenido de sus sermones nunca se envía.'],
 ['Mi Iglesia (datos de su congregación)','Si usted usa Mi Iglesia (plan Premium Iglesia), los datos que registra de los miembros y visitantes —nombre, WhatsApp, fechas de nacimiento y de bautismo, estado civil, ministerio, observaciones y asistencia— y también los diezmos y ofrendas, células, escalas, agenda, pedidos de oración, visitas pastorales y los datos y el logo de la iglesia, se guardan en su cuenta con la misma protección que sus sermones: solo usted los ve. Nosotros no los leemos, no los usamos y no los compartimos. Usted es responsable de registrar solo lo necesario para el cuidado pastoral y de contar con el permiso de las personas. Puede corregir o borrar cualquier registro cuando quiera, y todo se borra junto con su cuenta.'],['Página pública','Su página pública (meupulpito.com/p) solo existe si usted la activa en Configuración. Muestra lo que usted elige: su nombre, iglesia, ciudad, mensaje, foto, WhatsApp, Instagram, las fechas de sus próximas predicaciones y la lectura bíblica del día de su plan. Sus sermones nunca aparecen. Cualquier persona con el enlace puede verla, y usted puede desactivarla cuando quiera.'],['Proyección en el culto','La sala de proyección se abre con el correo y la contraseña que usted define en la app para su equipo (guardamos solo una huella cifrada de la contraseña). Quien tenga esos datos puede ver y cambiar lo que está en la pantalla y los himnos, imágenes y avisos guardados; por eso compártalos solo con personas de confianza y cambie la contraseña cuando lo necesite. Al usar «Enviar a la proyección» se envían solo el título, el texto base y los puntos del sermón, nunca el cuerpo del mensaje. Las letras de himnos que la iglesia escribe son responsabilidad de la iglesia (use letras de dominio público o con autorización). Todo se borra al borrar su cuenta.'],['Sala de reunión','En la sala de reunión, el video y el audio viajan directamente entre los aparatos de los participantes y no pasan por nuestros servidores ni se graban. Solo guardamos, mientras dura la reunión, el nombre que cada persona escribe y las señales técnicas necesarias para conectar los aparatos; se borran al salir. Para conectar, el navegador consulta un servidor STUN de Google, que recibe la dirección de red del aparato. Quien tenga el enlace y el código puede entrar; cambie el código cuando quiera.'],['Grabaciones, transcripción y video','Las grabaciones de audio y los videos con teleprompter quedan solo en su celular; no los subimos. La transcripción mientras graba usa el reconocimiento de voz del propio aparato (Apple o Google, según el celular, bajo sus condiciones), y el texto solo va a su sermón si usted lo elige. Los subtítulos del video se generan en el aparato.'],['Pagos','Cuando usted toca «Ya pagué», guardamos en su cuenta el plan, el valor y la fecha informados, solo para confirmar el pago. El comprobante lo envía usted por WhatsApp. No guardamos datos de tarjetas: si paga con tarjeta, el pago se hace en la página segura del proveedor. Los datos bancarios y el QR que aparecen son los de Meu Púlpito.'],
 ['Testimonios y recomendaciones','Si usted envía un testimonio desde la aplicación, guardamos el texto, el nombre y la iglesia que usted escribió. Solo se publica en meupulpito.com si usted lo autoriza, y puede pedir que se retire en cualquier momento. Si usted crea su cuenta con el enlace de recomendación de otro pastor, guardamos solo un código de ese enlace para entregarle a él el premio, y el resultado de su giro en la ruleta de descuento.'],
 ['Atención y mensajes','Las conversaciones de «Hable con el soporte» en la app (texto, nombre, correo e idioma) solo las ven usted y el administrador, para responderle. Los mensajes del formulario «Escríbanos» del sitio (nombre, WhatsApp y mensaje) solo los ve el administrador, para responder. Puede pedir que se borren en cualquier momento.'],
 ['Borrar su cuenta','Puede borrar su cuenta y todos sus datos cuando quiera, en Configuración → Borrar mi cuenta. Se eliminan de la nube y del celular y no se pueden recuperar. Si también quiere borrar sus conversaciones con el soporte, pídalo por el mismo soporte o por correo.'],
 ['Contacto','Para cualquier consulta sobre sus datos, escriba a contato@meupulpito.com.'],
 ['Cambios','Si esta política cambia, le avisaremos en la app. La versión completa también está en meupulpito.com/legal.html.']],
 pt:[['Seus sermões são seus','Tudo o que você escreve no Meu Púlpito (sermões, agenda, biblioteca e notas) pertence a você. É usado só para o aplicativo funcionar e para você ver em qualquer aparelho em que entrar com sua conta.'],
 ['O que guardamos','Seu e-mail, seu nome e sua foto (se você colocar), seu número de WhatsApp (se informar; usado só para as boas-vindas e os avisos do seu plano), seus sermões, agenda, biblioteca, notas e preferências de leitura, o plano contratado, seu histórico de pagamentos e as mensagens que você envia ao suporte. Também guardamos estatísticas de uso sem conteúdo (por exemplo, quantos sermões você tem, quando usou o app pela última vez e em que seção estava), para dar suporte e melhorar o serviço.'],
 ['Onde fica guardado','Nos servidores do Google Firebase, protegidos pela sua senha. Também fica uma cópia no seu celular para funcionar sem internet. As gravações de áudio do Modo Pregar ficam só no seu celular e não vão para a nuvem. Os vídeos gravados com o teleprompter também não: a câmera e o microfone são usados só enquanto você grava, e o vídeo fica no seu aparelho até você compartilhar ou salvar.'],
 ['Quem pode ver','Só você, com a sua conta. As regras de segurança impedem que outros usuários, e também o administrador pelo aplicativo, leiam o conteúdo dos seus sermões. O responsável técnico se compromete a não acessar o seu conteúdo, a não ser que você peça para receber ajuda ou que a lei exija. As únicas exceções são o que você mesmo decide publicar na sua página pública e o que compartilha com o acesso da equipe de projeção (veja abaixo).'],
 ['O que não fazemos','Não vendemos seus dados, não mostramos propaganda e não usamos seus sermões para nada além do aplicativo.'],
 ['Serviços externos','Tradução automática (MyMemory): só é enviado o texto que você pede para traduzir. Assistente de inteligência artificial (Anthropic): só se você colocar sua própria chave, e só o texto que você envia; a chave fica apenas no seu celular. Cotação de moedas (ExchangeRate-API): o site consulta o câmbio do dia para mostrar preços aproximados fora do Paraguai e do Brasil, sem enviar dados pessoais. Fontes de texto do Google Fonts no site. Vídeos de depoimentos: são carregados do YouTube (modo sem cookies) só quando você toca em Reproduzir.'],
 ['Estatísticas do site','Contamos as visitas a meupulpito.com de forma anônima (idioma, tipo de aparelho, país aproximado pelo fuso horário e de onde veio), sem dados pessoais. Também usamos o Google Analytics para ver quantas pessoas visitam o site e o aplicativo (páginas vistas, país e tipo de aparelho, com o IP anonimizado). O conteúdo dos seus sermões nunca é enviado.'],
 ['Minha Igreja (dados da sua congregação)','Se você usa o Minha Igreja (plano Premium Igreja), os dados que cadastra dos membros e visitantes —nome, WhatsApp, datas de nascimento e de batismo, estado civil, ministério, observações e presença— e também os dízimos e ofertas, células, escalas, agenda, pedidos de oração, visitas pastorais e os dados e o logo da igreja, ficam na sua conta com a mesma proteção dos seus sermões: só você vê. Nós não lemos, não usamos e não compartilhamos. Você é responsável por cadastrar só o necessário para o cuidado pastoral e por ter a permissão das pessoas. Pode corrigir ou apagar qualquer registro quando quiser, e tudo é apagado junto com a sua conta.'],['Página pública','Sua página pública (meupulpito.com/p) só existe se você a ativar em Configurações. Ela mostra o que você escolhe: seu nome, igreja, cidade, mensagem, foto, WhatsApp, Instagram, as datas das suas próximas pregações e a leitura bíblica do dia do seu plano. Seus sermões nunca aparecem. Qualquer pessoa com o link pode ver, e você pode desativar quando quiser.'],['Projeção no culto','A sala de projeção é aberta com o e-mail e a senha que você define no app para a sua equipe (guardamos só uma impressão cifrada da senha). Quem tem esses dados pode ver e mudar o que está na tela e os hinos, imagens e avisos guardados; por isso compartilhe só com pessoas de confiança e troque a senha quando precisar. Ao usar «Enviar para a projeção» vão só o título, o texto base e os pontos do sermão, nunca o corpo da mensagem. As letras de hinos que a igreja digita são responsabilidade da igreja (use letras de domínio público ou com autorização). Tudo é apagado ao apagar a sua conta.'],['Sala de reunião','Na sala de reunião, o vídeo e o áudio vão direto entre os aparelhos dos participantes e não passam pelos nossos servidores nem são gravados. Guardamos, só enquanto dura a reunião, o nome que cada pessoa digita e os sinais técnicos necessários para conectar os aparelhos; são apagados ao sair. Para conectar, o navegador consulta um servidor STUN do Google, que recebe o endereço de rede do aparelho. Quem tem o link e o código pode entrar; troque o código quando quiser.'],['Gravações, transcrição e vídeo','As gravações de áudio e os vídeos com teleprompter ficam só no seu celular; não os enviamos. A transcrição enquanto grava usa o reconhecimento de voz do próprio aparelho (Apple ou Google, conforme o celular, nas condições deles), e o texto só vai para o seu sermão se você escolher. As legendas do vídeo são geradas no aparelho.'],['Pagamentos','Quando você toca em «Já paguei», guardamos na sua conta o plano, o valor e a data informados, só para confirmar o pagamento. O comprovante é você quem envia pelo WhatsApp. Não guardamos dados de cartão: se pagar com cartão, o pagamento é feito na página segura do provedor. Os dados bancários e o QR que aparecem são os do Meu Púlpito.'],
 ['Depoimentos e indicações','Se você envia um depoimento pelo aplicativo, guardamos o texto, o nome e a igreja que você escreveu. Ele só é publicado em meupulpito.com se você autorizar, e você pode pedir para retirá-lo a qualquer momento. Se você cria sua conta pelo link de indicação de outro pastor, guardamos só um código desse link para entregar o prêmio a ele, e o resultado do seu giro na roleta de desconto.'],
 ['Atendimento e mensagens','As conversas do «Fale com o suporte» no app (texto, nome, e-mail e idioma) só são vistas por você e pelo administrador, para responder. As mensagens do formulário «Escreva para nós» do site (nome, WhatsApp e mensagem) só são vistas pelo administrador, para responder. Você pode pedir para apagá-las a qualquer momento.'],
 ['Apagar sua conta','Você pode apagar sua conta e todos os seus dados quando quiser, em Configurações → Apagar minha conta. Eles são apagados da nuvem e do celular e não podem ser recuperados. Se também quiser apagar suas conversas com o suporte, peça pelo próprio suporte ou por e-mail.'],
 ['Contato','Para qualquer dúvida sobre seus dados, escreva para contato@meupulpito.com.'],
 ['Mudanças','Se esta política mudar, avisaremos no app. A versão completa também está em meupulpito.com/legal.html.']]};
function privacySheet(){const L=prefs.ui==='pt'?'pt':'es';openSheet(`<h3>${esc(t('priv'))}</h3><p class="sub" style="margin:-6px 0 0;font-size:12.5px">${esc(t('priv_date'))}</p>${PRIV[L].map(([h,p])=>`<div class="fld"><span class="k" style="font-weight:800">${esc(h)}</span><p class="sd-p" style="margin:2px 0 0;font-family:var(--ui);font-size:15px">${esc(p)}</p></div>`).join('')}<button class="btn dark block" data-act="sheetClose">${esc(t('got_it'))}</button>`)}
async function deleteAccount(){const sh=openSheet(`<h3 style="color:var(--danger)">${esc(t('del_acc'))}</h3><p style="margin:0;line-height:1.5">${esc(t('del_warn'))}</p>
    <label class="s" for="delC">${esc(t('del_type'))}</label><input class="inp" id="delC" autocomplete="off" autocapitalize="characters">
    <p class="err" id="delErr" hidden></p><button class="btn block" id="delGo" style="background:var(--danger);color:#fff" disabled>${esc(t('del_go'))}</button><button class="btn ghost block" data-act="sheetClose">${esc(t('cancel'))}</button>`);
  const word=t('del_word');const c=$('#delC',sh),go=$('#delGo',sh);c.oninput=()=>{go.disabled=c.value.trim().toUpperCase()!==word};
  go.onclick=async()=>{go.disabled=true;go.textContent=t('del_doing');const err=m=>{const e=$('#delErr',sh);e.textContent=m;e.hidden=!m};
    try{const u=firebase.auth().currentUser;if(!u||!cols)throw{code:'x'};
      for(const ref of [cols.s,cols.a,cols.n]){const q=await ref.get();for(const d of q.docs)await d.ref.delete()}
      try{await cols.m.delete()}catch(e){}
      try{await firebase.firestore().collection('stats').doc(u.uid).delete()}catch(e){}try{await firebase.firestore().collection('depo').doc(u.uid).delete()}catch(e){}await u.delete();
      const uid=u.uid;Object.keys(localStorage).filter(k=>k.startsWith('pulpito.')&&k.includes(uid)).forEach(k=>localStorage.removeItem(k));
      try{indexedDB.deleteDatabase('meupulpito')}catch(e){}
      unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;authU=null;sermons=[];agenda=[];notes=[];planState=null;planLoaded=false;cfgLoaded=false;lastPrem=null;blocked=false;waCheck._t=0;depoCheck._t=0;rolCheck._t=0;ROL=null;SUP={uu:0,open:false,seen:0};welcomeCheck._on=0;thxCheck._on=null;notes=[];closeSheet();showLogin();toast(t('del_done'))}
    catch(e){go.disabled=false;go.textContent=t('del_go');err(t(e&&e.code==='auth/requires-recent-login'?'del_relog':'e_gen'))}}}
function importSheet(){const sh=openSheet(`<h3>${esc(t('restore'))}</h3><p class="sub" style="margin:0">${esc(t('restore_d'))}</p>
   <label class="btn ghost block">${ic('clip')}${esc(t('bk_pick'))}<input type="file" id="impF" accept=".json,application/json,text/plain" hidden></label>
   <span class="lbl">${esc(t('bk_or'))}</span><textarea class="inp" id="impTa" rows="5"></textarea><button class="btn gold block" id="impGo">${esc(t('import'))}</button>`);
  $('#impF',sh).onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{let o;try{o=JSON.parse(String(r.result).trim())}catch(x){toast(t('bk_bad'));return}importApply(o)};r.onerror=()=>toast(t('bk_bad'));r.readAsText(f)};
  $('#impGo',sh).onclick=()=>{let o;try{o=JSON.parse($('#impTa',sh).value.trim())}catch(e){toast(t('bad_paste'));return}importApply(o)}}
async function importApply(o){
    const arr=Array.isArray(o)?o:o&&Array.isArray(o.sermons)?o.sermons:null;const ig=o&&!Array.isArray(o)&&o.igreja&&typeof o.igreja==='object'?o.igreja:null;
    if(!arr&&!ig){toast(t('bad_paste'));return}
    let n=0;(arr||[]).forEach(x=>{if(!x||!x.id)return;const i=sermons.findIndex(s=>s.id===x.id);if(i<0||(x.updated||0)>(sermons[i].updated||0)){const c=Object.assign({},x);delete c.example;delete c.compare;putSermon(c,{silent:true});n++}});
    if(o&&Array.isArray(o.notes))o.notes.forEach(x=>{if(x&&x.id&&!notes.find(a=>a.id===x.id))putNote(x,{silent:true})});
    if(o&&Array.isArray(o.agenda))o.agenda.forEach(x=>{if(x&&x.id&&!agenda.find(a=>a.id===x.id))putEvent(x)});
    if(o&&o.meta&&Array.isArray(o.meta.cats)){o.meta.cats.forEach(c=>{if(!meta.cats.includes(c))meta.cats.push(c)});(o.meta.favVerses||[]).forEach(f=>{if(!meta.favVerses.find(x=>x.ref===f.ref&&x.v===f.v))meta.favVerses.push(f)});if(!meta.name&&o.meta.name)meta.name=o.meta.name;putMeta()}
    closeSheet();const M=[];if(n)M.push(t('imported',{n}));let lock=false;
    if(ig){if(igWant()){const k=await igRestore(ig).catch(()=>0);if(k)M.push(t('bk_ig_ok',{n:k}))}else lock=true}
    if(!M.length)M.push(t('nothing_new'));if(lock)M.push(t('bk_ig_lock'));toast(M.join(' · '));render()}
/* Baixar tudo: um arquivo com sermões, agenda, anotações e, no Premium Igreja, os dados da igreja */
function backupFileSheet(){
  const sh=openSheet(`<h3>${esc(t('bk_all'))}</h3><div id="bkB"><p class="sub" style="margin:0">${esc(t('bk_prep'))}</p></div>`);
  const S=sermons.filter(x=>!x.deleted).length,A=agenda.filter(x=>!x.deleted).length,N=notes.filter(x=>!x.deleted).length;
  igBackup().catch(()=>null).then(ig=>{const box=$('#bkB',sh);if(!box||!box.isConnected)return;
    const o={app:'meu-pulpito',v:3,at:new Date().toISOString(),sermons,agenda,notes,meta};let I=0;if(ig){o.igreja=ig;I=Object.values(ig).reduce((a,x)=>a+(Array.isArray(x)?x.length:0),0)}
    const name='meu-pulpito-'+todayISO()+'.json';const file=new File([JSON.stringify(o)],name,{type:'application/json'});
    const row=(l,v)=>`<div class="ig-ri"><span>${esc(l)}</span><b>${v}</b></div>`;
    box.innerHTML=`<div class="ig-rel"><span class="lbl">${esc(t('bk_has'))}</span>${row(t('bk_s'),S)}${row(t('bk_a'),A)}${row(t('bk_n'),N)}${ig?row(t('bk_i'),I):''}</div>
      <button class="btn gold block" id="bkGo">${ic('dl')}${esc(t('bk_save'))}</button><p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('bk_tip'))}</p>`;
    const dl=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)};
    const ok=()=>{ls.set(BAK,Date.now());closeSheet();toast(t('bk_all_ok'));render()};
    $('#bkGo',sh).onclick=async()=>{if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});ok()}catch(e){if(e&&e.name==='AbortError')return;dl();ok()}}else{dl();ok()}}})}

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
   Vídeo com teleprompter (Premium): o pastor grava uma mensagem lendo o texto na tela.
   O vídeo não fica guardado no app: no fim ele compartilha ou salva na Galeria.
   ========================================================= */
const VD_MAX=10*60e3;
// divide o texto em trechos curtos: cada trecho é uma linha do teleprompter e uma legenda do vídeo
function vdChunks(text){const out=[];String(text||'').split(/\n\s*\n/).forEach((par,pi)=>{const W=par.replace(/\s+/g,' ').trim().split(' ').filter(Boolean);let cur=[];
  const push=()=>{if(cur.length){out.push({t:cur.join(' '),p:pi>0&&!out.some(x=>x.pi===pi),pi});cur=[]}};
  W.forEach(w=>{cur.push(w);const len=cur.join(' ').length;if(len>=34||(/[.!?;:]$/.test(w)&&len>=14)||(/,$/.test(w)&&len>=24))push()});push()});return out}
const vdClean=x=>String(x||'').replace(/[*_]/g,'').replace(/\n{3,}/g,'\n\n').trim();
const vdDevo=e=>{const L=lxLang(),l=mL();const vt=vText(e.v,L);return[e.t[l],'',vt?vt+' ('+refStr(e.v,L)+')':refStr(e.v,L),'',e.r[l],'',e.a[l]].join('\n')};
function videoSheet(txt){if(!isPremium()){planGate('vid');return}const pr=ls.get('mp.vd',{});
  const sh=openSheet(`<h3>${esc(t('vd_t'))}</h3><p class="sub" style="margin:0;line-height:1.5">${esc(t('vd_d'))}</p>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" id="vdDv">${ic('cal')}${esc(t('vd_from_dv'))}</button>${liveS().length?`<button class="btn sm ghost" id="vdS">${ic('doc')}${esc(t('vd_from_s'))}</button>`:''}</div>
   <textarea class="inp" id="vdT" rows="8" placeholder="${esc(t('vd_ph'))}">${esc(txt||pr.last||'')}</textarea>
   <button class="btn gold block" id="vdGo">${ic('video')}${esc(t('vd_open'))}</button>
   <p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('vd_tip'))}</p>`,{cls:'tall'});
  const ta=$('#vdT',sh);
  $('#vdDv',sh).onclick=async()=>{try{await minLoad('dv','devocional.json');await loadBible(prefs.bibleVer||lxLang())}catch(e){}const e=MIN.dv&&MIN.dv.e[doy()-1];if(e)ta.value=vdDevo(e);else toast(t('dict_err'))};
  const sb=$('#vdS',sh);if(sb)sb.onclick=()=>{const L=liveS().slice().sort((a,b)=>(b.updated||0)-(a.updated||0)).slice(0,40);
    const s2=openSheet(`<h3>${esc(t('vd_pick'))}</h3><div class="acts">${L.map(x=>`<button class="act" data-vs="${esc(x.id)}">${ic('doc')}<span style="flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(derive(x).title||t('untitled'))}</span></button>`).join('')}</div>`);
    s2.onclick=e=>{const b=e.target.closest('[data-vs]');if(!b)return;const x=sermons.find(y=>y.id===b.dataset.vs);if(x)ta.value=vdClean(sermonText(x));closeSheet()}};
  $('#vdGo',sh).onclick=()=>{const v=ta.value.trim();const p=ls.get('mp.vd',{});p.last=v.slice(0,20000);ls.set('mp.vd',p);closeSheet();vdOpen(v)}}
async function vdOpen(text){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast(t('vd_nosup'));return}
  const P=Object.assign({fs:30,sp:3,face:'user',cc:true},ls.get('mp.vd',{}));const CH=vdChunks(text);if(!CH.length)P.cc=false;
  const ov=document.createElement('div');ov.className='vr';ov.setAttribute('role','dialog');ov.setAttribute('aria-label',t('vd_t'));
  ov.innerHTML=`<video class="vr-cam" playsinline muted autoplay></video>
   <div class="vr-top"><button class="vr-ib" data-v="x" aria-label="${esc(t('close'))}">${ic('x')}</button><span class="vr-tm" hidden><i></i><b>0:00</b></span><span class="row" style="gap:8px">${CH.length?`<button class="vr-ib vr-cc" data-v="cc" aria-pressed="${!!P.cc}" aria-label="${esc(t('vd_cc'))}">CC</button>`:''}<button class="vr-ib" data-v="flip" aria-label="${esc(t('vd_flip'))}">${ic('undo')}</button></span></div>
   <div class="vr-cap" hidden></div>
   <div class="vr-pr" data-v="pause"><div class="vr-tx">${CH.map((c,i)=>`<span class="vr-c${c.p?' p':''}${i?'':' on'}">${esc(c.t)}</span>`).join('')}</div></div>
   <div class="vr-cd" hidden></div>
   <div class="vr-bot"><div class="vr-adj"><span>${esc(t('vd_speed'))}</span><div class="row"><button class="vr-ib sm" data-v="sp-" aria-label="−">−</button><b class="vr-sp"></b><button class="vr-ib sm" data-v="sp+" aria-label="+">+</button></div></div>
     <button class="vr-rec" data-v="rec" aria-label="${esc(t('vd_rec'))}"><i></i></button>
     <div class="vr-adj"><span>${esc(t('vd_size'))}</span><div class="row"><button class="vr-ib sm" data-v="fs-" aria-label="A−">A−</button><button class="vr-ib sm" data-v="fs+" aria-label="A+">A+</button></div></div></div>
   <p class="vr-hint">${esc(CH.length?t('vd_tap'):t('vd_notext'))}</p>`;
  document.body.appendChild(ov);document.documentElement.classList.add('vr-on');
  const cam=$('.vr-cam',ov),pr=$('.vr-pr',ov),tx=$('.vr-tx',ov),tm=$('.vr-tm',ov),cd=$('.vr-cd',ov),capEl=$('.vr-cap',ov);const spans=$$('.vr-c',ov);let cur=0,cv=null,cx=null,drawT=0,actx=null,asrc=null;
  if(!CH.length)pr.hidden=true;
  let stream=null,mr=null,chunks=[],t0=0,tick=0,raf=0,y=0,paused=false,last=0,wake=null,busy=false,url='';
  const save=()=>{const p=ls.get('mp.vd',{});p.fs=P.fs;p.sp=P.sp;p.face=P.face;if(CH.length)p.cc=P.cc;ls.set('mp.vd',p)};
  const showCap=()=>{const on=P.cc&&CH.length;capEl.hidden=!on;if(on)capEl.textContent=CH[cur].t;const b=$('.vr-cc',ov);if(b)b.setAttribute('aria-pressed',String(!!P.cc))};
  const style=()=>{tx.style.fontSize=P.fs+'px';tx.style.paddingTop=Math.round(pr.clientHeight*0.28)+'px';$('.vr-sp',ov).textContent=P.sp;cam.classList.toggle('mir',P.face==='user');showCap()};
  // trecho que está na linha de leitura (um pouco acima do meio da faixa)
  const readAt=()=>{const line=y+pr.clientHeight*0.28+P.fs*0.7;let i=cur;while(i+1<spans.length&&spans[i+1].offsetTop<=line)i++;while(i>0&&spans[i].offsetTop>line)i--;
    if(i!==cur){spans[cur]&&spans[cur].classList.remove('on');cur=i;spans[cur].classList.add('on');showCap()}};style();
  const stopCam=()=>{if(stream)stream.getTracks().forEach(x=>x.stop());stream=null};
  async function start(){stopCam();try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:P.face,width:{ideal:1920},height:{ideal:1080},aspectRatio:{ideal:16/9}},audio:{echoCancellation:true,noiseSuppression:true}})}
    catch(e){toast(t('vd_perm'));close();return false}if(!ov.isConnected){stopCam();return false}cam.srcObject=stream;try{await cam.play()}catch(e){}return true}
  const scroll=ts=>{if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(!paused){y+=P.sp*14*dt;const mx=Math.max(0,tx.scrollHeight-pr.clientHeight*0.5);if(y>mx)y=mx;tx.style.transform=`translateY(${-y}px)`;readAt()}raf=requestAnimationFrame(scroll)};
  const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  function close(){cancelAnimationFrame(raf);cancelAnimationFrame(drawT);clearInterval(tick);try{if(asrc)asrc.disconnect();if(actx)actx.close()}catch(e){}if(mr){mr.onstop=null;try{if(mr.state!=='inactive')mr.stop()}catch(e){}}stopCam();if(url)URL.revokeObjectURL(url);try{wake&&wake.release()}catch(e){}
    ov.remove();document.documentElement.classList.remove('vr-on')}
  async function rec(){if(busy||!stream)return;busy=true;
    for(const n of [3,2,1]){cd.hidden=false;cd.textContent=n;await new Promise(r=>setTimeout(r,800));if(!ov.isConnected)return}cd.hidden=true;
    const mime=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||'';
    let rs=stream;cur=0;spans.forEach((x,i)=>x.classList.toggle('on',!i));showCap();
    if(P.cc&&CH.length){const w=cam.videoWidth||1080,h=cam.videoHeight||1920;cv=document.createElement('canvas');cv.width=w;cv.height=h;cx=cv.getContext('2d');
      if(cv.captureStream){const draw=()=>{vdFrame(cx,cam,w,h,CH[cur].t);drawT=requestAnimationFrame(draw)};draw();
        // Safari (iPhone) perde o áudio ao juntar vídeo do canvas com o microfone; passar o áudio pelo Web Audio resolve
        let aud=stream.getAudioTracks();try{const AC=window.AudioContext||window.webkitAudioContext;if(AC&&aud.length){actx=actx||new AC();if(actx.state==='suspended')await actx.resume();const src=actx.createMediaStreamSource(new MediaStream(aud));const dst=actx.createMediaStreamDestination();src.connect(dst);aud=dst.stream.getAudioTracks();asrc=src}}catch(e){}
        rs=new MediaStream([...cv.captureStream(30).getVideoTracks(),...aud])}else{toast(t('vd_cc_no'));cv=null}}
    try{mr=new MediaRecorder(rs,Object.assign({videoBitsPerSecond:4e6},mime?{mimeType:mime}:{}))}catch(e){cancelAnimationFrame(drawT);busy=false;toast(t('vd_nosup'));return}
    chunks=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};mr.onstop=done;mr.start(1000);
    try{wake=await navigator.wakeLock?.request('screen')}catch(e){}
    t0=Date.now();y=0;paused=false;last=0;pr.classList.remove('paused');tx.style.transform='translateY(0)';ov.classList.add('rec');tm.hidden=false;$('b',tm).textContent='0:00';
    tick=setInterval(()=>{const ms=Date.now()-t0;$('b',tm).textContent=fmt(ms);if(ms>=VD_MAX){toast(t('vd_max'));stop()}},250);
    cancelAnimationFrame(raf);if(text)raf=requestAnimationFrame(scroll);busy=false}
  function stop(){if(!mr||mr.state!=='recording')return;clearInterval(tick);cancelAnimationFrame(raf);ov.classList.remove('rec');try{mr.stop()}catch(e){}setTimeout(()=>cancelAnimationFrame(drawT),300)}
  function done(){const type=(mr&&mr.mimeType)||(chunks[0]&&chunks[0].type)||'video/mp4';const blob=new Blob(chunks,{type});chunks=[];stopCam();try{wake&&wake.release()}catch(e){}
    if(!blob.size){toast(t('vd_err'));start();return}
    const ext=/mp4/.test(type)?'mp4':'webm';const nw=new Date();const name='meu-pulpito-'+todayISO()+'-'+String(nw.getHours()).padStart(2,'0')+String(nw.getMinutes()).padStart(2,'0')+'.'+ext;
    const file=new File([blob],name,{type:type.split(';')[0]});url=URL.createObjectURL(blob);const dur=fmt(Date.now()-t0),mb=(blob.size/1048576).toFixed(1).replace('.',prefs.ui==='pt'?',':',');
    ov.classList.add('done');ov.innerHTML=`<div class="vr-res"><div class="between"><b style="font-size:18px">${esc(t('vd_ready'))}</b><span class="sub">${esc(dur)} · ${mb} MB</span></div>
      <video class="vr-pv" src="${url}" playsinline controls></video>
      <button class="btn gold block" data-v="share">${ic('share')}${esc(t('vd_share'))}</button>
      <div class="two"><button class="btn ghost" data-v="again">${ic('video')}${esc(t('vd_again'))}</button><button class="btn ghost" data-v="x2">${esc(t('close'))}</button></div>
      <p class="sub" style="margin:0;font-size:12.5px;line-height:1.5">${esc(t('vd_tip'))}</p></div>`;
    ov._file=file}
  ov.addEventListener('click',async e=>{const b=e.target.closest('[data-v]');if(!b)return;const v=b.dataset.v;
    if(v==='x'){if(mr&&mr.state==='recording'&&!confirmTap(b))return;close()}
    else if(v==='x2'){if(!b.dataset.sure){b.dataset.sure='1';b.textContent=t('vd_discard');setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=t('close')}},3000);return}close()}
    else if(v==='cc'){if(mr&&mr.state==='recording')return;P.cc=!P.cc;save();showCap();toast(t(P.cc?'vd_cc_on':'vd_cc_off'))}
    else if(v==='flip'){if(mr&&mr.state==='recording')return;P.face=P.face==='user'?'environment':'user';save();style();start()}
    else if(v==='rec'){if(mr&&mr.state==='recording')stop();else rec()}
    else if(v==='pause'){if(!(mr&&mr.state==='recording'))return;paused=!paused;pr.classList.toggle('paused',paused)}
    else if(v==='sp-'||v==='sp+'){P.sp=Math.max(1,Math.min(10,P.sp+(v==='sp+'?1:-1)));save();style()}
    else if(v==='fs-'||v==='fs+'){P.fs=Math.max(20,Math.min(54,P.fs+(v==='fs+'?4:-4)));save();style()}
    else if(v==='share'){const f=ov._file;if(!f)return;
      if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]})}catch(err){if(err&&err.name!=='AbortError')vdDl(f)}}else vdDl(f)}
    else if(v==='again'){close();vdOpen(text)}});
  await start()}
// um quadro do vídeo com a legenda embaixo (fundo escuro arredondado, letra branca)
function vdFrame(cx,cam,w,h,txt){cx.drawImage(cam,0,0,w,h);if(!txt)return;const fs=Math.round(Math.min(w,h)*0.058);cx.font=`700 ${fs}px -apple-system,"Inter",system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
  const max=w*0.84,W=txt.split(' '),L=[];let ln='';W.forEach(x=>{const tr=ln?ln+' '+x:x;if(cx.measureText(tr).width>max&&ln){L.push(ln);ln=x}else ln=tr});if(ln)L.push(ln);
  const lh=fs*1.3,bh=L.length*lh+fs*0.7,bw=Math.min(w*0.92,Math.max(...L.map(x=>cx.measureText(x).width))+fs*1.2),bx=(w-bw)/2,by=h*0.8-bh/2,r=fs*0.45;
  cx.fillStyle='rgba(0,0,0,.62)';cx.beginPath();if(cx.roundRect)cx.roundRect(bx,by,bw,bh,r);else cx.rect(bx,by,bw,bh);cx.fill();
  cx.fillStyle='#fff';L.forEach((x,i)=>cx.fillText(x,w/2,by+fs*0.35+lh*(i+0.5)))}
function vdDl(f){const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)}
Object.assign(I18N.es,{vd_t:'Video con teleprompter',vd_home:'Grabe un mensaje leyendo el texto en la pantalla',vd_d:'Escriba o pegue el texto. Va pasando cerca de la cámara mientras usted habla mirando al frente, y el video queda listo para enviar por WhatsApp o publicar.',
  vd_from_dv:'Devocional de hoy',vd_from_s:'De un sermón',vd_pick:'Elija el sermón',vd_ph:'Texto del mensaje…',vd_open:'Abrir la cámara',vd_tip:'El video no queda guardado en la app. Para guardarlo en la Galería, toque «Compartir o guardar» y elija «Guardar video».',
  vd_nosup:'No es posible grabar video en este navegador.',vd_perm:'No pude usar la cámara. Revise el permiso de cámara y micrófono en Ajustes → Safari.',vd_err:'No se grabó el video. Intente de nuevo.',
  vd_rec:'Grabar',vd_flip:'Cambiar de cámara',vd_speed:'Velocidad',vd_size:'Letra',vd_tap:'Toque el texto para pausarlo mientras graba',vd_notext:'Sin texto: solo la cámara',vd_max:'Se alcanzó el límite de 10 minutos',
  vd_ready:'Video listo',vd_share:'Compartir o guardar',vd_again:'Grabar de nuevo',vd_discard:'¿Descartar? Toque de nuevo',vd_act:'Grabar en video',rc2_a:'Grabar audio',aud_free:'Plan gratis: le quedan {n} de {m} grabaciones de audio. Con Premium, sin límite y con dictado por voz.',aud_tag:'{n} gratis',rc2_ad:'Nota de voz o predicación',rc2_v:'Grabar video',rc2_vd:'Mensaje con teleprompter',vd_cc:'Subtítulos',vd_cc_on:'Subtítulos activados: el texto que lee aparece en el video',vd_cc_off:'Subtítulos desactivados',vd_cc_no:'Este aparato no permite subtítulos en el video. Se grabará sin ellos.',
  pk_vid:'Grabe mensajes en video leyendo el texto en la pantalla, listos para WhatsApp e Instagram.'});
Object.assign(I18N.pt,{vd_t:'Vídeo com teleprompter',vd_home:'Grave uma mensagem lendo o texto na tela',vd_d:'Escreva ou cole o texto. Ele vai passando perto da câmera enquanto você fala olhando para frente, e o vídeo fica pronto para enviar no WhatsApp ou postar.',
  vd_from_dv:'Devocional de hoje',vd_from_s:'De um sermão',vd_pick:'Escolha o sermão',vd_ph:'Texto da mensagem…',vd_open:'Abrir a câmera',vd_tip:'O vídeo não fica guardado no app. Para guardar na Galeria, toque em «Compartilhar ou salvar» e escolha «Salvar vídeo».',
  vd_nosup:'Não é possível gravar vídeo neste navegador.',vd_perm:'Não consegui usar a câmera. Confira a permissão de câmera e microfone em Ajustes → Safari.',vd_err:'O vídeo não foi gravado. Tente de novo.',
  vd_rec:'Gravar',vd_flip:'Trocar de câmera',vd_speed:'Velocidade',vd_size:'Letra',vd_tap:'Toque no texto para pausar enquanto grava',vd_notext:'Sem texto: só a câmera',vd_max:'Chegou ao limite de 10 minutos',
  vd_ready:'Vídeo pronto',vd_share:'Compartilhar ou salvar',vd_again:'Gravar de novo',vd_discard:'Descartar? Toque de novo',vd_act:'Gravar em vídeo',rc2_a:'Gravar áudio',aud_free:'Plano grátis: restam {n} de {m} gravações de áudio. Com o Premium, sem limite e com ditado por voz.',aud_tag:'{n} grátis',rc2_ad:'Nota de voz ou pregação',rc2_v:'Gravar vídeo',rc2_vd:'Mensagem com teleprompter',vd_cc:'Legendas',vd_cc_on:'Legendas ligadas: o texto que você lê aparece no vídeo',vd_cc_off:'Legendas desligadas',vd_cc_no:'Este aparelho não permite legendas no vídeo. Vai gravar sem elas.',
  pk_vid:'Grave mensagens em vídeo lendo o texto na tela, prontas para o WhatsApp e o Instagram.'});

/* =========================================================
   Audio y dictado
   ========================================================= */
async function audList(owner){try{const db=await idb();return await new Promise(ok=>{const q=db.transaction('audio').objectStore('audio').getAll();q.onsuccess=()=>ok((q.result||[]).filter(a=>owner===undefined||a.owner===owner).sort((a,b)=>b.at-a.at));q.onerror=()=>ok([])})}catch(e){return[]}}
async function audPut(a){const db=await idb();return new Promise((ok,ko)=>{const tx=db.transaction('audio','readwrite');tx.objectStore('audio').put(a);tx.oncomplete=ok;tx.onerror=()=>ko(tx.error)})}
async function audDel(id){const db=await idb();db.transaction('audio','readwrite').objectStore('audio').delete(id)}
let REC=null;const urls=[];
// plano grátis: 2 gravações de áudio para experimentar; depois, Premium
const AUD_FREE=2;const audLeft=()=>isPremium()?Infinity:Math.max(0,AUD_FREE-(+ls.get('mp.aud.n',0)||0));
function recSheet(owner){closeSheet();if(!audLeft()){planGate('aud');return}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const sh=openSheet(`<h3>${esc(t('rec'))}</h3><p class="sub" style="margin:0">${esc(t('aud_d'))}</p>${isPremium()?'':`<p class="pl-why" id="rcFree" style="margin:0">${esc(t('aud_free',{n:audLeft(),m:AUD_FREE}))}</p>`}
   <div class="row" style="justify-content:center;gap:14px;padding:6px 0"><button class="btn gold" id="rcGo" style="height:64px;padding:0 26px;font-size:17px">${ic('mic')}<span id="rcL">${esc(t('rec_start'))}</span></button><b id="rcT" style="font-size:22px;font-variant-numeric:tabular-nums;min-width:70px">00:00</b></div>
   ${SR?`<label class="row" style="gap:10px;align-items:flex-start"><input type="checkbox" id="rcTr" ${ls.get('mp.rctr',false)?'checked':''} style="width:22px;height:22px;flex:none;margin-top:1px"><span style="font-size:14px;line-height:1.4"><b>${esc(t('rc_tr'))}</b>${isPremium()?'':` <span class="cu-lock">${esc(t('rc_tr_prem'))}</span>`}<span class="s" style="display:block">${esc(t('rc_tr_d'))}</span></span></label>`:''}
   <button class="btn ghost block" id="dcGo">${ic('text')}${esc(t('dict'))}</button>
   <div id="dcBox" hidden><textarea class="inp" id="dcTx" rows="5" placeholder="${esc(t('dict_ph'))}"></textarea><p class="sub" id="dcSt" style="margin:6px 0"></p>
     <div class="two">${E?`<button class="btn dark" id="dcIns">${esc(t('dict_ins'))}</button>`:''}<button class="btn ghost" id="dcNote">${esc(t('dict_note'))}</button></div></div>
   <div id="rcList" style="display:flex;flex-direction:column;gap:8px"></div>`,{onClose:()=>{recStop(true);dictStop();urls.splice(0).forEach(u=>URL.revokeObjectURL(u))}});
  const drawList=async()=>{const L=await audList(owner);const box=$('#rcList',sh);if(!box)return;
    box.innerHTML=L.length?L.map(a=>{const u=URL.createObjectURL(a.blob);urls.push(u);return`<div style="background:var(--bg);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:6px">
      <b style="font-size:14px">${esc(a.title)} · ${fmtSec(Math.round(a.dur||0))}</b><audio controls preload="metadata" src="${u}" style="width:100%"></audio>
      ${a.text?`<details class="mn-f"><summary>${esc(t('rc_txt'))}</summary><p style="font-size:14px;line-height:1.5;margin:6px 0">${esc(a.text)}</p><button class="btn sm gold" data-rs="${a.id}">${ic('pen')}${esc(t('rc_serm'))}</button></details>`:''}
      <div class="row"><button class="btn sm ghost" data-rn="${a.id}">${ic('doc')}${esc(t('rec_to_note'))}</button><button class="iconbtn" data-rd="${a.id}" aria-label="${esc(t('rec_del'))}" style="color:var(--danger);margin-left:auto">${ic('trash')}</button></div></div>`}).join(''):`<p class="sub" style="margin:0">${esc(t(owner?'rec_none':'rec_none_g'))}</p>`};
  drawList();
  $('#rcGo',sh).onclick=async()=>{if(REC&&REC.mr){recStop(false);return}if(!audLeft()){closeSheet();planGate('aud');return}
    try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||'';
      const mr=new MediaRecorder(st,mime?{mimeType:mime}:undefined);const chunks=[];const t0=Date.now();
      REC={mr,st,t0,int:setInterval(()=>{const e=$('#rcT');if(e)e.textContent=fmtSec(Math.round((Date.now()-t0)/1000))},500),tx:''};
      const trk=$('#rcTr',sh);if(trk&&trk.checked){ls.set('mp.rctr',true);if(!isPremium()){trk.checked=false;toast(t('pk_rec'))}else if(SR){try{const r=new SR();r.lang=prefs.ui==='pt'?'pt-BR':'es-PY';r.continuous=true;r.interimResults=false;let acc='';r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const x=e.results[i];if(x.isFinal)acc+=x[0].transcript.trim()+' '}if(REC)REC.tx=acc.trim()};r.onerror=()=>{};r.onend=()=>{if(REC&&REC.sr===r&&REC.mr.state==='recording'){try{r.start()}catch(e){}}};r.start();REC.sr=r;const st2=$('#dcSt',sh);if(st2)st2.textContent=t('rc_tr_on')}catch(e){toast(t('rc_tr_none'))}}}else if(trk)ls.set('mp.rctr',false);
      mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
      mr.onstop=async()=>{st.getTracks().forEach(x=>x.stop());clearInterval(REC&&REC.int);const discard=REC&&REC.discard;const text=(REC&&REC.tx)||'';if(REC&&REC.sr){const r=REC.sr;REC.sr=null;try{r.stop()}catch(e){}}REC=null;const st2=$('#dcSt',sh);if(st2&&st2.textContent===t('rc_tr_on'))st2.textContent='';
        const L=$('#rcL');if(L)L.textContent=t('rec_start');if(discard||!chunks.length)return;
        const blob=new Blob(chunks,{type:mr.mimeType||mime||'audio/mp4'});const d=new Date();
        await audPut({id:uid(),owner:owner||null,blob,mime:blob.type,dur:(Date.now()-t0)/1000,at:Date.now(),text,title:t('rec_title',{d:`${fmtD(todayISO(d))} ${d.toTimeString().slice(0,5)}`})});
        if(!isPremium()){ls.set('mp.aud.n',(+ls.get('mp.aud.n',0)||0)+1);const f=$('#rcFree',sh);if(f)f.textContent=t('aud_free',{n:audLeft(),m:AUD_FREE})}toast(t('rec_saved'));drawList()};
      mr.start(1000);$('#rcL').textContent=t('rec_stop')}
    catch(e){toast(t('rec_err'))}};
  $('#dcGo',sh).onclick=()=>{if(!isPremium()){closeSheet();planGate('rec');return}if(!SR){toast(t('dict_none'));return}$('#dcBox',sh).hidden=false;if(DICT){dictStop();return}dictStart(SR,$('#dcTx',sh),$('#dcSt',sh),$('#dcGo',sh))};
  const di=$('#dcIns',sh);if(di)di.onclick=()=>{const tx=$('#dcTx',sh).value.trim();if(!tx)return;dictStop();closeSheet();insertHtmlAfterCaret(linesToHtml(tx,{}).html||`<p>${esc(tx)}</p>`);toast(t('ai_inserted'))};
  $('#dcNote',sh).onclick=()=>{const tx=$('#dcTx',sh).value.trim();if(!tx)return;dictStop();const n={id:uid(),type:'idea',title:t('voice_note'),text:tx,ref:'',created:Date.now()};putNote(n,{silent:true});closeSheet();toast(t('saved'))};
  sh.addEventListener('click',async e=>{const n=e.target.closest('[data-rn]'),d=e.target.closest('[data-rd]'),rs=e.target.closest('[data-rs]');
    if(rs){const a=(await audList()).find(x=>x.id===rs.dataset.rs);if(!a||!a.text)return;if(!canNewSermon())return;const paras=a.text.split(/(?:[.!?]\s+)(?=[A-ZÁÉÍÓÚÑÂÊÔÃÕÇ])/).reduce((o,p)=>{if(o.length&&(o[o.length-1].length<400))o[o.length-1]+=(o[o.length-1].endsWith('.')?' ':'. ')+p;else o.push(p);return o},[]);const html=paras.map(p=>`<p>${esc(p.trim())}</p>`).join('');closeSheet();if(E)closeEditor(()=>openEditor(null,{id:uid(),html:`<h1><br></h1>${html}`,lang:'',category:'',fav:false,created:Date.now(),log:[],v:2}));else openEditor(null,{id:uid(),html:`<h1><br></h1>${html}`,lang:'',category:'',fav:false,created:Date.now(),log:[],v:2});return}
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
document.addEventListener('click',e=>{const a=e.target.closest('a[data-ext]');if(!a)return;e.preventDefault();if(isStandalone())location.href=a.href;else{const w=window.open(a.href,'_blank','noopener');if(!w)location.href=a.href}});
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
  waEdit:()=>waSheet(false),
  privacy:()=>privacySheet(),delAcc:()=>deleteAccount(),admin:()=>{location.href='/escritorio/'},pubPage:()=>pubSheet(),castView:()=>castView(),projPage:()=>projSheet(),salaSheet:()=>salaSheet(),projSend:(b)=>projSendSermon(b.dataset.id),
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
  hist:b=>histSheet(b.dataset.id),video:b=>{const x=b.dataset.id&&sermons.find(y=>y.id===b.dataset.id);if(b.closest('.ov'))closeSheet();videoSheet(x?vdClean(sermonText(x)):'')},
  delAsk:b=>{closeSheet();const id=b.dataset.id;const sh=openSheet(`<h3>${esc(t('del_q'))}</h3><p class="serif" style="margin:0;font-size:17px">${esc(derive(sermons.find(x=>x.id===id)||{}).title||'')}</p><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn danger" id="dYes">${ic('trash')}${esc(t('to_trash'))}</button></div>`);
    $('#dYes',sh).onclick=()=>{closeSheet();if(E&&E.s.id===id){document.removeEventListener('selectionchange',tbState);E=null;view.overlay=null}delSermon(id);render();toast(t('moved_trash'))}},
  sheetClose:()=>closeSheet(),
  lf:b=>{listState.f=b.dataset.f;listState.ser='';render()},
  lmode:b=>{listState.mode=b.dataset.m;listState.q='';render()},nt:b=>{listState.nt=b.dataset.t;render()},
  nNew:()=>noteSheet(null),nOpen:b=>noteSheet(b.dataset.id),trash:()=>trashSheet(),
  trRest:b=>{const arr=b.dataset.k==='n'?notes:sermons;const x=arr.find(y=>y.id===b.dataset.id);if(x){delete x.deleted;b.dataset.k==='n'?putNote(x):putSermon(x)}closeSheet();toast(t('restored'));trashSheet()},
  trKill:b=>{b.dataset.k==='n'?hardDelNote(b.dataset.id):hardDelSermon(b.dataset.id);closeSheet();trashSheet()},
  fixTitle:()=>{const r=splitLongTitle();if(!r)return;snap();const h1=$('#ed h1');h1.textContent=r.title;if(r.rest){const p=document.createElement('p');p.textContent=r.rest;h1.after(p)}onEdInput();snap();drawEdMeta();toast(t('long_done'))},
  aiOpen:()=>aiSheet(),recE:()=>{if(E){edSave();trackRange();recSheet(E.s.id)}},recG:()=>recSheet(null),
  aiGoKey:()=>{closeSheet();closeEditor(()=>go('profile'))},
  aiTest:async b=>{b.disabled=true;try{await aiCall('Responde solo: OK','OK',10);toast(t('ai_ok'))}catch(e){toast(aiErr(e))}b.disabled=false},
  edInfo:()=>infoSheet(),edOrg:()=>orgSheet(),edTpl:()=>tplSheet(),vers:()=>versSheet(),
  pgScr:()=>{if(!PG)return;if(!PG.asc&&!isPremium()){planGate('preg');return}PG.asc?ascStop():ascStart()},plans:()=>plansSheet(),install:()=>installApp(),annX:()=>{const A=annGet();if(A)ls.set('mp.ann.x',A.id);render()},instHide:()=>{ls.set('mp.instx',1);render()},planRenew:b=>planContact(b.dataset.k),pvHide:b=>{const u=b.dataset.u;ls.set(/^tr/.test(u)?'mp.trx.'+u.slice(2):'mp.pvx.'+u,1);render()},back:()=>go(view.prev&&!SUBP.includes(view.prev)?view.prev:'home'),report:()=>reportSheet(),rfHide:()=>{ls.set('mp.rfx',1);render()},support:()=>supSheet(),rlDemo:()=>rolSheet(true),refer:()=>refSheet(),depo:()=>depoSheet(false),veSend:b=>{b.disabled=true;try{authU.sendEmailVerification().then(()=>toast(t('ve_sent')),()=>{b.disabled=false;toast(t('adm_err'))})}catch(e){b.disabled=false}},onb:()=>{closeSheet();onboarding()},help:()=>helpSheet(),news:()=>newsSheet(),subCancel:()=>openSheet(`<h3>${esc(t('sub_cancel'))}</h3><p style="margin:0;line-height:1.5">${esc(t('sub_cancel_d'))}</p><button class="btn ghost block" data-act="sheetClose">${esc(t('got_it'))}</button>`),agMode:b=>{agMode=b.dataset.m;render()},
  lc:b=>{listState.cat=listState.cat===b.dataset.c?'':b.dataset.c;render()},
  resGo:()=>{const r=getResume();if(r)openPreach(r.id,{resume:true})},
  resNo:()=>{ls.set(RES,null);render()},
  bakGo:()=>backupNow(),
  bakNo:()=>{ls.set(BAK,Date.now()-5*864e5);render()},
  // editor
  edBack:()=>closeEditor(),undo:()=>edUndo(),redo:()=>edRedo(),edMenu:()=>edMenu(),
  edPreach:()=>{edSave();if(!sermons.find(x=>x.id===E.s.id)){toast(t('body_ph'));return}openPreach(E.s.id)},
  edFav:()=>{E.s.fav=!E.s.fav;drawEdMeta();edSave(true)},
  edSer:()=>{if(!isPremium()&&!E.s.serie){planGate('ser');return}pickSeries(E.s,v=>{if(v)E.s.serie=v;else delete E.s.serie;drawEdMeta();E.dirty=true;edSave(true)})},
  serOpen:b=>{listState.ser=b.dataset.n;listState.f='ser';render();window.scrollTo(0,0)},serBack:()=>{listState.ser='';render()},serNew:()=>{if(!planGate('ser'))return;newSermonInSeries(listState.ser)},
  edCat:()=>pickCategory(c=>{E.s.category=c;delete E.s.series;drawEdMeta();edSave(true)},catOf(E.s)),
  edLang:()=>{E.s.lang=sLang(E.s)==='pt'?'es':'pt';E.s.langSet=true;drawEdMeta();$('#ed').lang=E.s.lang==='pt'?'pt-BR':'es';edSave(true);toast(t('lang_msg')+': '+(E.s.lang==='pt'?'Português':'Español'))},
  fmtB:()=>fmt('bold'),fmtI:()=>fmt('italic'),fmtU:()=>fmt('underline'),fmtOl:()=>fmt('insertOrderedList'),
  fmtImp:()=>{let b=curBlock();while(b&&b.tagName!=='H2')b=b.previousElementSibling;if(!b){toast(t('imp_need'));return}snap();b.classList.toggle('imp');onEdInput();snap();toast(t(b.classList.contains('imp')?'imp_on':'imp_off'))},
  pgIdx:()=>pgIndex(),pgLang:()=>pgLang(),
  fmtHead:()=>fmtHead(),fmtSize:()=>fmtSize(),fmtStyle:()=>fmtStyle(),fmtSet:b=>fmtSet(b.dataset.s),fmtHl:()=>fmtHl(),fmtNote:()=>fmtNote(),edPoint:()=>edPoint(),edVerse:()=>edVerse(),vIns:()=>vInsert(),
  // predicar
  rpOpen:()=>rpSheet(),rpRead:b=>rpRead(b.dataset.d),rpDone:b=>{rpMark(b.dataset.d,true);toast(t('rp_mark'));render()},
  pgClose:()=>{if(PG&&PG.cast)castViewStop();else closePreach()},pgRec:()=>{if(!PREC&&!isPremium()){planGate('rec');return}pRecToggle()},recList:()=>{closeSheet();pRecSheet(E?E.s.id:'')},recAll:()=>pRecSheet(''),pgTimer:()=>pgTimer(),pgSet:()=>pgSettings(),pgPrev:()=>pgGo(-1),pgNext:()=>pgGo(1),
  // biblia
  bVer:()=>verSheet(bver(),k=>{BV.ver=k;BV.sel.clear();BV.err=false;render()}),
  pBibleSel:()=>verSheet(prefs.bibleVer||prefs.ui,k=>{prefs.bibleVer=k;BV.ver=null;savePrefs();render()}),
  bMode:b=>{BV.fav=b.dataset.f==='1';render()},
  dicE:()=>dxEditor(),
  bRetry:()=>{BV.err=false;render()},
  bSel:b=>{const v=+b.dataset.v;BV.sel.has(v)?BV.sel.delete(v):BV.sel.add(v);render()},
  bGo:b=>{BV.b=+b.dataset.b;BV.c=+b.dataset.c;BV.q='';BV.sel=new Set([+b.dataset.v]);render();setTimeout(()=>{const el=$(`.vs[data-v="${b.dataset.v}"]`);el&&el.scrollIntoView({block:'center'})},50)},
  bCopy:()=>{const x=bSelText();copyText(`${x.text}\n— ${x.ref} (${verLabel(x.v)})`).then(()=>toast(t('copied')))},
  bFav:()=>{const x=bSelText();const i=meta.favVerses.findIndex(f=>f.ref===x.ref&&f.v===x.v);if(i>=0){meta.favVerses.splice(i,1);toast(t('fav_rm'))}else{meta.favVerses.unshift(x);toast(t('fav_add'))}putMeta();BV.sel.clear();render()},
  bCmp:()=>{const x=bSelText();compareRef(x.ref,null,x.v)},bXr:()=>{const v=Math.min(...BV.sel);xrSheet(BV.b,BV.c,v,vl(bver()))},
  bIns:()=>{const x=bSelText();chooseSermon(id=>{BV.sel.clear();insertVerseInto(id,x.ref,x.text)})},
  bFavOpen:b=>{const f=meta.favVerses[+b.dataset.i];if(!f)return;const sh=openSheet(`<h3>${esc(f.ref)}</h3><p class="serif" style="margin:0;font-size:17px;line-height:1.6;font-style:italic">${esc(f.text)}</p>
     <div class="acts"><button class="act" id="fvC">${ic('copy')}${esc(t('copy_txt'))}</button><button class="act" id="fvI">${ic('doc')}${esc(t('ins_s'))}</button><button class="act" id="fvK">${ic('lang')}${esc(t('cmp'))}</button><button class="act red" id="fvD">${ic('trash')}${esc(t('act_unfav'))}</button></div>`);
    $('#fvC',sh).onclick=()=>copyText(`${f.text}\n— ${f.ref} (${verLabel(f.v)})`).then(()=>{toast(t('copied'));closeSheet()});
    $('#fvI',sh).onclick=()=>{closeSheet();chooseSermon(id=>insertVerseInto(id,f.ref,f.text))};
    $('#fvK',sh).onclick=()=>{closeSheet();compareRef(f.ref,null,f.v)};
    $('#fvD',sh).onclick=()=>{meta.favVerses.splice(+b.dataset.i,1);putMeta();closeSheet();render()}},
  // agenda
  evNew:()=>evForm(null),evEdit:b=>evForm(b.dataset.id),evNewDay:b=>evForm(null,b.dataset.d),agDay:b=>{monthHtml._d=b.dataset.d;render()},agMon:b=>{const [y,m]=(agMonth||todayISO().slice(0,7)).split('-').map(Number);const d=new Date(y,m-1+(+b.dataset.n),1,12);agMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;monthHtml._d=null;render()},evCal:b=>{const e=agenda.find(x=>x.id===b.dataset.id);if(e)evIcs(e)},
  evPick:b=>{const e=agenda.find(x=>x.id===b.dataset.id);chooseSermon(id=>{if(id==='__new'){newSermon();return}e.sermonId=id;putEvent(e);render()})},
  // perfil
  pUi:b=>{prefs.ui=b.dataset.v;savePrefs();document.documentElement.lang=prefs.ui==='pt'?'pt-BR':'es';render()},
  pTheme:b=>{prefs.theme=b.dataset.v;savePrefs();applyTheme();render()},
  pBible:b=>{prefs.bibleVer=b.dataset.v;BV.ver=null;savePrefs();render()},
  catRm:b=>{meta.cats.splice(+b.dataset.i,1);putMeta();render()},
  impOpen:()=>importSheet(),bakFile:()=>backupFileSheet(),igRetry:()=>{IGE=false;render()},autoBak:()=>autoBakSheet(),
  lockT:b=>{if((b.dataset.v==='on')!==!!lockCfg())lockSetup()},
  bioT:b=>{const c=lockCfg();if(c&&(b.dataset.v==='on')!==!!c.bio)bioAvailable().then(ok=>ok?bioToggle():toast(t('bio_fail')))},
  logout:async()=>{unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;try{await firebase.auth().signOut()}catch(e){}authU=null;sermons=[];agenda=[];planState=null;planLoaded=false;cfgLoaded=false;lastPrem=null;blocked=false;waCheck._t=0;depoCheck._t=0;rolCheck._t=0;ROL=null;SUP={uu:0,open:false,seen:0};welcomeCheck._on=0;thxCheck._on=null;notes=[];view.tab='home';view.prev=null;showLogin()},
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
