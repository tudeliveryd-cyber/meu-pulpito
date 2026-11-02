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
es:{nav_home:'Inicio',nav_list:'Sermones',nav_bible:'Biblia',nav_agenda:'Agenda',nav_profile:'Perfil',
greet_m:'Buenos días,',greet_a:'Buenas tardes,',greet_n:'Buenas noches,',pastor:'Pastor',
search_ph:'Buscar sermón, versículo o palabra',prepare:'Preparar',new_sermon:'Nuevo sermón',new_desc:'Abre la hoja y empieza a escribir. Se guarda solo.',
st_total:'Sermones',st_fav:'Favoritos',st_week:'Esta semana',recent:'Recientes',my_sermons:'Mis sermones',favorites:'Favoritos',see_all:'Ver todos',next_preach:'Próxima predicación',
today:'hoy',edited:'editado',f_all:'Todos',f_recent:'Recientes',f_fav:'Favoritos',f_done:'Predicados',f_todo:'Pendientes',
category:'Categoría',no_cat:'Sin categoría',points:'puntos',point:'punto',preached:'Predicado',pending:'Pendiente',
act_edit:'Editar',act_preach:'Predicar',act_fav:'Marcar como favorito',act_unfav:'Quitar de favoritos',act_dup:'Duplicar',act_share:'Compartir',act_del:'Eliminar',act_hist:'Predicaciones registradas',
del_q:'¿Eliminar este sermón para siempre?',cancel:'Cancelar',deleted:'Sermón eliminado',duplicated:'Copia creada. Estás editando la copia.',copy_sfx:'(copia)',
empty_t:'Tu biblioteca está vacía',empty_d:'Toca Nuevo sermón y escribe tu primera mensaje. Todo se guarda solo.',no_res:'Ningún sermón encontrado',
saved:'Guardado',saving:'Guardando…',untitled:'Sin título',title_ph:'Título del sermón',body_ph:'Empieza a escribir…',
undo:'Deshacer',redo:'Rehacer',preach:'Predicar',tb_size:'Tamaño del texto',tb_title:'Título o subtítulo',tb_bold:'Negrita',tb_italic:'Cursiva',tb_under:'Subrayado',tb_list:'Lista numerada',tb_hl:'Destacar frase',tb_note:'Recordatorio personal',tb_verse:'Versículo',tb_point:'Nuevo punto',
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
b_search:'Buscar libro, cita o palabra',chap:'Cap.',copied:'Copiado',fav_add:'Guardado en favoritos',fav_rm:'Quitado de favoritos',ins_s:'Insertar en sermón',choose_s:'¿En qué sermón?',inserted:'Versículo insertado',
b_res:'{n} resultados',b_none:'Sin resultados',b_loading:'Abriendo la Biblia…',b_err:'No pude abrir la Biblia. Revisa la conexión e intenta de nuevo.',b_nofav:'Aún no guardaste versículos. Toca un versículo y la estrella.',b_favs:'Versículos favoritos',
schedule:'Programar',upcoming:'Próximas predicaciones',past:'Anteriores',no_ev:'Nada programado. Toca Programar para agregar una predicación.',ev_new:'Nueva predicación',ev_edit:'Editar predicación',
cult:'Tipo de culto',theme:'Tema del mensaje',sermon:'Sermón',later_pick:'Elegir después',pick_s:'Elegir sermón',tbd:'tema por definir',ev_saved:'Predicación programada',ev_del:'Predicación eliminada',
your_name:'Tu nombre',language:'Idioma de la app',appearance:'Apariencia',light:'Claro',dark:'Oscuro',auto:'Auto',def_bible:'Biblia',categories:'Categorías',add_cat:'Nueva categoría',add:'Agregar',
backup:'Copia de seguridad',last_bak:'Última: {d}',never:'nunca',restore:'Restaurar o traer sermones',restore_d:'Pega aquí una copia de seguridad o el texto copiado en «Levar para o app próprio».',import:'Importar',imported:'{n} sermón(es) importado(s)',nothing_new:'Nada nuevo para importar',bad_paste:'No reconocí el texto pegado. Cópialo de nuevo.',
account:'Cuenta',local_only:'Sin cuenta: los sermones quedan solo en este celular.',logout:'Cerrar sesión',login_btn:'Entrar con una cuenta',soon:'Próximamente',s_rec:'Grabar audio',s_tr:'Audio a texto',s_trl:'Traducir ES ↔ PT',s_ai:'Asistente para sermones',
credits:'Biblias: Reina-Valera 1909 y 1865 (dominio público), Bíblia Livre y Bíblia Livre TR (licencia libre), Nova Versão de Acesso Livre, Textus Receptus griego y Códice de Leningrado hebreo (dominio público). Traducción automática: MyMemory.',
cmp:'Comparar versiones',cmp_t:'Versiones',orig:'En el original',orig_g:'Griego',orig_h:'Hebreo',translit:'pronunciación aproximada',cmp_load:'Abriendo las versiones…',cmp_none:'Este versículo no está en esta versión.',cmp_tip:'Toca la cita para comparar versiones',
tr_to:'Traducir al {l}',tr_t:'Traducir sermón',tr_d:'Se crea una copia traducida; el original no cambia. Los versículos se colocan desde la Biblia del otro idioma. El resto del texto se envía al servicio gratuito MyMemory para traducir.',tr_lim:'Este sermón tiene {n} caracteres. Límite gratuito: unos 5.000 por día, o 50.000 si pones tu correo en Perfil.',tr_go:'Traducir',tr_prog:'Traduciendo… {i} de {n}',tr_done:'Traducción creada. Revísala antes de predicar.',tr_quota:'Se acabó el límite gratuito de hoy. Intenta mañana o pon tu correo en Perfil para tener más.',tr_err:'No pude traducir ahora. Revisa la conexión e intenta de nuevo.',tr_mail:'Correo para traducción',tr_mail_d:'Opcional. Se envía a MyMemory solo para aumentar el límite diario.',
sync_ok:'Guardado en tu cuenta',sync_local:'Guardado en este celular',sync_conn:'Conectando…',sync_off:'Sin señal: usando la copia del celular',sync_pend:'Guardando… se envía cuando haya señal',sync_err:'No pude leer tu cuenta ahora. Queda guardado en el celular.',sync_noperm:'Tu cuenta todavía no puede guardar en la nube. Queda en este celular.',
login_t:'Entra para guardar tus sermones',login_d:'Tus sermones quedan en tu cuenta y aparecen en cualquier celular donde entres.',email:'Correo',pass:'Contraseña',pass_ph:'Mínimo 6 caracteres',enter:'Entrar',create:'Crear cuenta',forgot:'Olvidé la contraseña',nologin:'Usar sin cuenta',reset_sent:'Te enviamos un correo para crear una contraseña nueva',
e_email:'Correo inválido. Revisa si lo escribiste bien.',e_pass:'Escribe la contraseña.',e_weak:'La contraseña necesita al menos 6 caracteres.',e_used:'Este correo ya tiene cuenta. Toca Entrar.',e_cred:'Correo o contraseña no coinciden. Intenta de nuevo o toca Olvidé la contraseña.',e_many:'Muchos intentos. Espera unos minutos.',e_net:'Sin internet. Conéctate para entrar la primera vez.',e_gen:'No pude entrar ahora. Intenta de nuevo.',e_reset:'Escribe tu correo arriba y toca otra vez Olvidé la contraseña.',
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
cats:['Santa Cena','Culto de Enseñanza','Culto de la Familia','Jóvenes','Liderazgo','Evangelismo','Consagración','Mensajes especiales'],
wd:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],months:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
books:['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis']},
pt:{nav_home:'Início',nav_list:'Sermões',nav_bible:'Bíblia',nav_agenda:'Agenda',nav_profile:'Perfil',
greet_m:'Bom dia,',greet_a:'Boa tarde,',greet_n:'Boa noite,',pastor:'Pastor',
search_ph:'Buscar sermão, versículo ou palavra',prepare:'Preparar',new_sermon:'Novo sermão',new_desc:'Abra a folha e comece a escrever. Salva sozinho.',
st_total:'Sermões',st_fav:'Favoritos',st_week:'Esta semana',recent:'Recentes',my_sermons:'Meus sermões',favorites:'Favoritos',see_all:'Ver todos',next_preach:'Próxima pregação',
today:'hoje',edited:'editado',f_all:'Todos',f_recent:'Recentes',f_fav:'Favoritos',f_done:'Pregados',f_todo:'Pendentes',
category:'Categoria',no_cat:'Sem categoria',points:'pontos',point:'ponto',preached:'Pregado',pending:'Pendente',
act_edit:'Editar',act_preach:'Pregar',act_fav:'Marcar como favorito',act_unfav:'Tirar dos favoritos',act_dup:'Duplicar',act_share:'Compartilhar',act_del:'Excluir',act_hist:'Pregações registradas',
del_q:'Excluir este sermão para sempre?',cancel:'Cancelar',deleted:'Sermão excluído',duplicated:'Cópia criada. Você está editando a cópia.',copy_sfx:'(cópia)',
empty_t:'Sua biblioteca está vazia',empty_d:'Toque em Novo sermão e escreva sua primeira mensagem. Tudo salva sozinho.',no_res:'Nenhum sermão encontrado',
saved:'Salvo',saving:'Salvando…',untitled:'Sem título',title_ph:'Título do sermão',body_ph:'Comece a escrever…',
undo:'Desfazer',redo:'Refazer',preach:'Pregar',tb_size:'Tamanho do texto',tb_title:'Título ou subtítulo',tb_bold:'Negrito',tb_italic:'Itálico',tb_under:'Sublinhado',tb_list:'Lista numerada',tb_hl:'Destacar frase',tb_note:'Lembrete pessoal',tb_verse:'Versículo',tb_point:'Novo ponto',
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
b_search:'Buscar livro, referência ou palavra',chap:'Cap.',copied:'Copiado',fav_add:'Salvo nos favoritos',fav_rm:'Removido dos favoritos',ins_s:'Inserir no sermão',choose_s:'Em qual sermão?',inserted:'Versículo inserido',
b_res:'{n} resultados',b_none:'Nenhum resultado',b_loading:'Abrindo a Bíblia…',b_err:'Não consegui abrir a Bíblia. Confira a conexão e tente de novo.',b_nofav:'Você ainda não salvou versículos. Toque num versículo e na estrela.',b_favs:'Versículos favoritos',
schedule:'Agendar',upcoming:'Próximas pregações',past:'Anteriores',no_ev:'Nada agendado. Toque em Agendar para adicionar uma pregação.',ev_new:'Nova pregação',ev_edit:'Editar pregação',
cult:'Tipo de culto',theme:'Tema da mensagem',sermon:'Sermão',later_pick:'Escolher depois',pick_s:'Escolher sermão',tbd:'tema a definir',ev_saved:'Pregação agendada',ev_del:'Pregação excluída',
your_name:'Seu nome',language:'Idioma do app',appearance:'Aparência',light:'Claro',dark:'Escuro',auto:'Auto',def_bible:'Bíblia',categories:'Categorias',add_cat:'Nova categoria',add:'Adicionar',
backup:'Cópia de segurança',last_bak:'Última: {d}',never:'nunca',restore:'Restaurar ou trazer sermões',restore_d:'Cole aqui uma cópia de segurança ou o texto copiado em «Levar para o app próprio».',import:'Importar',imported:'{n} sermão(ões) importado(s)',nothing_new:'Nada novo para importar',bad_paste:'Não reconheci o texto colado. Copie de novo.',
account:'Conta',local_only:'Sem conta: os sermões ficam só neste celular.',logout:'Sair da conta',login_btn:'Entrar com uma conta',soon:'Em breve',s_rec:'Gravar áudio',s_tr:'Áudio para texto',s_trl:'Traduzir ES ↔ PT',s_ai:'Assistente de sermões',
credits:'Bíblias: Reina-Valera 1909 e 1865 (domínio público), Bíblia Livre e Bíblia Livre TR (licença livre), Nova Versão de Acesso Livre, Textus Receptus grego e Códice de Leningrado hebraico (domínio público). Tradução automática: MyMemory.',
cmp:'Comparar versões',cmp_t:'Versões',orig:'No original',orig_g:'Grego',orig_h:'Hebraico',translit:'pronúncia aproximada',cmp_load:'Abrindo as versões…',cmp_none:'Este versículo não está nesta versão.',cmp_tip:'Toque na referência para comparar versões',
tr_to:'Traduzir para {l}',tr_t:'Traduzir sermão',tr_d:'É criada uma cópia traduzida; o original não muda. Os versículos vêm da Bíblia do outro idioma. O resto do texto é enviado ao serviço grátis MyMemory para traduzir.',tr_lim:'Este sermão tem {n} caracteres. Limite grátis: uns 5.000 por dia, ou 50.000 se você colocar seu e-mail no Perfil.',tr_go:'Traduzir',tr_prog:'Traduzindo… {i} de {n}',tr_done:'Tradução criada. Revise antes de pregar.',tr_quota:'Acabou o limite grátis de hoje. Tente amanhã ou coloque seu e-mail no Perfil para ter mais.',tr_err:'Não consegui traduzir agora. Confira a conexão e tente de novo.',tr_mail:'E-mail para tradução',tr_mail_d:'Opcional. É enviado ao MyMemory só para aumentar o limite diário.',
sync_ok:'Salvo na sua conta',sync_local:'Salvo neste celular',sync_conn:'Conectando…',sync_off:'Sem sinal: usando a cópia do celular',sync_pend:'Salvando… envia quando tiver sinal',sync_err:'Não consegui ler sua conta agora. Fica salvo no celular.',sync_noperm:'Sua conta ainda não pode guardar na nuvem. Fica neste celular.',
login_t:'Entre para guardar seus sermões',login_d:'Seus sermões ficam na sua conta e aparecem em qualquer celular em que você entrar.',email:'E-mail',pass:'Senha',pass_ph:'Mínimo 6 caracteres',enter:'Entrar',create:'Criar conta',forgot:'Esqueci a senha',nologin:'Usar sem conta',reset_sent:'Enviamos um e-mail para criar uma senha nova',
e_email:'E-mail inválido. Confira se digitou certo.',e_pass:'Digite a senha.',e_weak:'A senha precisa ter pelo menos 6 caracteres.',e_used:'Este e-mail já tem conta. Toque em Entrar.',e_cred:'E-mail ou senha não conferem. Tente de novo ou toque em Esqueci a senha.',e_many:'Muitas tentativas. Espere alguns minutos.',e_net:'Sem internet. Conecte-se para entrar pela primeira vez.',e_gen:'Não consegui entrar agora. Tente de novo.',e_reset:'Digite seu e-mail acima e toque de novo em Esqueci a senha.',
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
cats:['Santa Ceia','Culto de Ensino','Culto da Família','Jovens','Liderança','Evangelismo','Consagração','Mensagens especiais'],
wd:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],months:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
books:['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cânticos','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oseias','Joel','Amós','Obadias','Jonas','Miqueias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse']}
};
let prefs=Object.assign({ui:/^pt/i.test(navigator.language||'')?'pt':'es',theme:'auto',bibleVer:null,
  p:{fs:30,lh:1.5,bg:'negro',timer:true,goal:30,outline:false,tap:true,font:'serif',color:'auto',align:'left',margin:24,ps:.75,dim:0,speed:3}},ls.get('mp.prefs',{}));
prefs.p=Object.assign({fs:30,lh:1.5,bg:'negro',timer:true,goal:30,outline:false,tap:true,font:'serif',color:'auto',align:'left',margin:24,ps:.75,dim:0,speed:3},prefs.p||{});
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
/* comparar versiones */
function compareRef(ref,host,lang){const p=parseRef(ref);if(!p||!p.vs){toast(t('verse_nf'));return}
  const first=lang==='pt'?['pt','ptr','nva','es','es65']:['es','es65','pt','ptr','nva'];const og=p.b>=39?'grc':'hbo';const keys=[...first,og];
  const sh=openSheet(`<h3>${esc(t('cmp_t'))} · ${esc(refName(p.b,p.ch,p.vs,lang))}</h3><div id="cmpBody" class="sub">${esc(t('cmp_load'))}</div>`,{host});
  Promise.all(keys.map(k=>loadBible(k).catch(()=>null))).then(()=>{if(!sh.isConnected)return;
    $('#cmpBody',sh).outerHTML=`<div style="display:flex;flex-direction:column;gap:14px">${keys.map(k=>{const tx=bibleText(ref,k);const orig=k===og;
      return`<div style="display:flex;flex-direction:column;gap:4px;${orig?'border-top:1px solid var(--line);padding-top:12px':''}">
        <span class="lbl" style="color:var(--gold-ink)">${esc(orig?`${t('orig')} · ${t(og==='grc'?'orig_g':'orig_h')}`:VNAME[k])}</span>
        ${tx?`<span ${orig&&og==='hbo'?'dir="rtl" lang="he"':orig?'lang="grc"':''} style="font-family:var(--read);font-size:${orig?19:16.5}px;line-height:1.6">${esc(tx)}</span>
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
async function translateSermon(id){const s=sermons.find(x=>x.id===id);if(!s)return;closeSheet();const from=sLang(s),to=from==='pt'?'es':'pt';
  const d=docOf(s);const chars=d.textContent.length;
  const sh=openSheet(`<h3>${esc(t('tr_t'))}</h3><p style="margin:0;font-size:15px;line-height:1.5">${esc(t('tr_d'))}</p><p class="sub" style="margin:0">${esc(t('tr_lim',{n:chars.toLocaleString()}))}</p>
    <div class="sub" id="trProg" hidden></div><div class="two"><button class="btn ghost" data-act="sheetClose">${esc(t('cancel'))}</button><button class="btn gold" id="trGo">${ic('lang')}${esc(t('tr_go'))}</button></div>`);
  $('#trGo',sh).onclick=async()=>{const go=$('#trGo',sh);go.disabled=true;const pr=$('#trProg',sh);pr.hidden=false;
    try{await loadBible(to)}catch(e){}
    const work=[];[...d.children].forEach(el=>{if(el.tagName==='OL'||el.tagName==='UL')$$('li',el).forEach(li=>work.push(li));else work.push(el)});
    const todo=work.filter(el=>el.textContent.trim()&&!(el.tagName==='BLOCKQUOTE'&&el.getAttribute('data-ref')&&(parseRef(el.getAttribute('data-ref'))||{}).vs));
    let i=0;
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
const KEEPCLS=new Set(['lg','il','nt']);
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
const sLang=s=>s.lang||detectLang(derive(s).text);

/* =========================================================
   Datos y sincronización
   ========================================================= */
const K={s:'pulpito.v1',a:'pulpito.agenda',m:'pulpito.meta',n:'pulpito.notas'};
let sermons=[],agenda=[],notes=[],meta={},authU=null,localMode=false,cols=null,unsubs=[],sync={ok:false,msg:'sync_conn'},ready=false;
const keyOf=k=>localMode||!authU?K[k]:K[k]+'.'+authU.uid;
function loadLocal(){sermons=ls.get(keyOf('s'),[])||[];notes=ls.get(keyOf('n'),[])||[];agenda=ls.get(keyOf('a'),[])||[];meta=ls.get(keyOf('m'),{})||{};fixMeta()}
function fixMeta(){if(!Array.isArray(meta.cats))meta.cats=t('cats').slice();if(!Array.isArray(meta.favVerses))meta.favVerses=[];if(typeof meta.name!=='string')meta.name=''}
function cacheAll(){ls.set(keyOf('n'),notes);ls.set(keyOf('s'),sermons);ls.set(keyOf('a'),agenda);ls.set(keyOf('m'),meta)}
const strip=x=>{const c=JSON.parse(JSON.stringify(x));delete c.id;return c};
function setSync(ok,msg){sync={ok,msg};$$('[data-sync]').forEach(el=>{el.innerHTML=syncHtml()})}
const syncHtml=()=>`<span class="dot ${sync.ok?'ok':''}"></span>${esc(t(sync.msg))}`;

function putSermon(s,{silent}={}){s.updated=Date.now();const i=sermons.findIndex(x=>x.id===s.id);if(i<0)sermons.unshift(s);else sermons[i]=s;cacheAll();
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
let bgT=0;function refreshBg(){clearTimeout(bgT);bgT=setTimeout(()=>{if(view.tab&&!view.overlay)render()},60)}

function subCol(ref,getL,setL,onAny){let first=true;
  return ref.onSnapshot({includeMetadataChanges:true},snap=>{
    const remote=snap.docs.map(d=>Object.assign({},d.data(),{id:d.id}));let arr=null;
    if(first&&!snap.metadata.fromCache){first=false;const map=new Map(remote.map(x=>[x.id,x]));
      getL().forEach(x=>{const r=map.get(x.id);if(!r||(x.updated||0)>(r.updated||0)){map.set(x.id,x);ref.doc(x.id).set(strip(x)).catch(()=>{})}});arr=[...map.values()]}
    else if(!first||remote.length)arr=remote;
    if(arr){setL(arr);cacheAll();onAny&&onAny(snap)}
  },err=>onAny&&onAny(null,err))}
function startCloud(u){authU=u;localMode=false;loadLocal();ready=true;go(view.tab||'home');setSync(false,'sync_conn');
  const db=firebase.firestore();
  const P=[()=>({s:db.collection('pulpito').doc(u.uid).collection('sermoes'),a:db.collection('pulpito').doc(u.uid).collection('agenda'),n:db.collection('pulpito').doc(u.uid).collection('notas'),m:db.collection('pulpito').doc(u.uid).collection('meta').doc('main')}),
           ()=>({s:db.collection('empresa').doc('pulpito').collection(u.uid),a:db.collection('empresa').doc('pulpito').collection(u.uid+'_agenda'),n:db.collection('empresa').doc('pulpito').collection(u.uid+'_notas'),m:db.collection('empresa').doc('pulpito').collection(u.uid+'_meta').doc('main')})];
  const PK='pulpito.path.'+u.uid;
  const listen=i=>{unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];
    if(i>=P.length){cols=null;setSync(false,'sync_noperm');return}
    cols=P[i]();
    unsubs.push(subCol(cols.s,()=>sermons,a=>{sermons=a},(snap,err)=>{
      if(err){if(err.code==='permission-denied')listen(i+1);else setSync(false,'sync_err');return}
      ls.set(PK,i);setSync(!snap.metadata.hasPendingWrites&&!snap.metadata.fromCache,snap.metadata.hasPendingWrites?'sync_pend':snap.metadata.fromCache?'sync_off':'sync_ok');refreshBg()}));
    unsubs.push(subCol(cols.a,()=>agenda,a=>{agenda=a},()=>refreshBg()));
    unsubs.push(subCol(cols.n,()=>notes,a=>{notes=a},()=>refreshBg()));
    unsubs.push(cols.m.onSnapshot(d=>{if(d.exists){const r=d.data();if((r.updated||0)>=(meta.updated||0)){meta=r;fixMeta();cacheAll();refreshBg()}else putMeta()}else if(meta.updated)putMeta()},()=>{}));
  };
  listen(+ls.get(PK,0)||0);
}
function startLocal(){localMode=true;ls.set('pulpito.local',true);unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;authU=null;loadLocal();ready=true;setSync(false,'sync_local');go(view.tab||'home')}
function anyShown(){return !!$('#app').firstElementChild}
function fallback(){if(anyShown())return;if(window.firebase&&firebase.apps&&firebase.apps.length)showLogin();else startLocal()}
function initStore(){
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg||!cfg.apiKey||!window.firebase||!firebase.auth||!firebase.firestore){startLocal();return}
  try{firebase.initializeApp(cfg)}catch(e){startLocal();return}
  try{firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  if(ls.get('pulpito.local',false))startLocal();
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
const TABS=[['home','home','nav_home'],['list','doc','nav_list'],['bible','bible','nav_bible'],['agenda','cal','nav_agenda'],['profile','user','nav_profile']];
function drawNav(){$('#navIn').innerHTML=TABS.map(([k,i,l])=>`<button data-act="tab" data-k="${k}" ${view.tab===k?'aria-current="page"':''}>${ic(i)}${esc(t(l))}</button>`).join('')}
function go(tab){view.tab=tab;view.overlay=null;render(true);window.scrollTo(0,0)}
function render(anim){
  if(!ready)return;$('#nav').hidden=false;drawNav();
  const app=$('#app');const keep=app.querySelector('input:focus');const sel=keep?[keep.id,keep.selectionStart]:null;
  const html={home:homeHtml,list:listHtml,bible:bibleHtml,agenda:agendaHtml,profile:profileHtml}[view.tab]();
  app.innerHTML=`<section class="view ${anim?'enter':''}"><div class="wrap">${html}</div></section>`;
  if(sel&&sel[0]){const el=document.getElementById(sel[0]);if(el){el.focus();try{el.setSelectionRange(sel[1],sel[1])}catch(e){}}}
  if(view.tab==='bible')bibleAfter();
}

/* =========================================================
   INICIO
   ========================================================= */
function greet(){const h=new Date().getHours();return t(h<12?'greet_m':h<19?'greet_a':'greet_n')}
function sortedByUpd(){return liveS().sort((a,b)=>(b.updated||0)-(a.updated||0))}
function upcoming(){const td=todayISO();return agenda.filter(e=>e.date>=td).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')))}
function relDate(ts){if(!ts)return'';const d=todayISO(new Date(ts));return d===todayISO()?t('today'):fmtD(d)}
function miniCard(s,right){const d=derive(s);const c=catOf(s);
  return`<button class="mini" data-act="open" data-id="${esc(s.id)}"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
    <span class="ti">${esc(d.title||t('untitled'))}</span><span class="sub">${esc([d.passage,c].filter(Boolean).join(' · ')||t('edited')+' '+relDate(s.updated))}</span></div>${right||''}</button>`}
function homeHtml(){
  const S=sortedByUpd();const favs=S.filter(s=>s.fav);const NS=S.length;const up=upcoming();const wk=up.filter(e=>e.date<=addDays(todayISO(),6)).length;
  const ev=up[0];const evS=ev&&sermons.find(s=>s.id===ev.sermonId);
  return`
  <div class="row">
    <img class="logo" src="logo.jpg" alt="Meu Púlpito">
    <div class="hello" style="flex:1;min-width:0"><span class="sub">${esc(greet())}</span><b>${esc(meta.name||t('pastor'))}</b></div>
    <button class="iconbtn bg" data-act="tab" data-k="profile" aria-label="${esc(t('nav_profile'))}">${ic('user')}</button>
  </div>
  <form class="search" data-form="homeSearch" role="search">${ic('search')}<input id="hq" name="q" type="search" placeholder="${esc(t('search_ph'))}" autocomplete="off" enterkeyhint="search"></form>
  ${bannersHtml()}
  <button class="hero" data-act="new"><span><span class="k">${esc(t('prepare'))}</span><span class="t" style="display:block">${esc(t('new_sermon'))}</span><span class="d">${esc(t('new_desc'))}</span></span><span class="plus">${ic('plus')}</span></button>
  <div class="stats">
    <button class="stat" data-act="list" data-f="all"><b>${NS}</b><span>${esc(t('st_total'))}</span></button>
    <button class="stat" data-act="list" data-f="fav"><b>${favs.length}</b><span>${esc(t('st_fav'))}</span></button>
    <button class="stat" data-act="tab" data-k="agenda"><b>${wk}</b><span>${esc(t('st_week'))}</span></button>
  </div>
  ${S.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('recent'))}</span><button class="lnk" data-act="tab" data-k="list">${esc(t('my_sermons'))}</button></div>
    ${S.slice(0,3).map(s=>miniCard(s,s.fav?`<span class="star on">${ic('star')}</span>`:'')).join('')}</div>`:''}
  ${favs.length?`<div style="display:flex;flex-direction:column;gap:10px">
    <div class="between"><span class="sect">${esc(t('favorites'))}</span><button class="lnk" data-act="list" data-f="fav">${esc(t('see_all'))}</button></div>
    ${favs.slice(0,3).map(s=>miniCard(s,`<span class="iconbtn gold" aria-hidden="true">${ic('lectern')}</span>`).replace('data-act="open"','data-act="preach"')).join('')}</div>`:''}
  ${ev?`<div style="display:flex;flex-direction:column;gap:10px"><span class="sect">${esc(t('next_preach'))}</span>
    <button class="mini" data-act="tab" data-k="agenda">${dateBox(ev.date,true)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
    <b style="font-size:15px">${esc(evPlace(ev))}${ev.type?' · '+esc(ev.type):''}</b><span class="sub">${esc([ev.time,evS?derive(evS).title:(ev.theme||t('tbd'))].filter(Boolean).join(' · '))}</span></div></button></div>`:''}
  <div class="sync" data-sync style="justify-content:center">${syncHtml()}</div>`;
}
const RES='mp.resume',RES_MS=6*3600e3,BAK='pulpito.bak',WEEK=7*864e5;
function getResume(){const r=ls.get(RES,null);return r&&r.id&&Date.now()-(r.at||0)<RES_MS?r:null}
function bannersHtml(){let h='';const r=getResume();const rs=r&&(r.tSec>0||r.top>200)&&sermons.find(x=>x.id===r.id);
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
function hitLine(s,q){if(!q)return'';const d=docOf(s);
  for(const el of $$('h1,h2,h3,p,li,blockquote',d)){const l=el.textContent.trim();const i=norm(l).indexOf(q);
    if(l&&i>=0){const st=Math.max(0,i-30);return`${st?'…':''}${esc(l.slice(st,i))}<mark>${esc(l.slice(i,i+q.length))}</mark>${esc(l.slice(i+q.length,i+q.length+70))}`}}
  const r=$$('blockquote[data-ref]',d).map(b=>b.getAttribute('data-ref')).find(x=>norm(x).includes(q));return r?`<mark>${esc(r)}</mark>`:''}
function filtered(){const q=norm(listState.q.trim());const mon=Date.now()-30*864e5;
  let arr=sortedByUpd();
  arr=arr.filter(s=>{if(listState.f==='fav'&&!s.fav)return false;if(listState.f==='done'&&!isPreached(s))return false;if(listState.f==='todo'&&isPreached(s))return false;
    if(listState.f==='recent'&&(s.updated||0)<mon)return false;if(listState.cat&&catOf(s)!==listState.cat)return false;
    if(!q)return true;const d=derive(s);const inf=s.info||{};return norm([d.title,d.passage,catOf(s),inf.keys,inf.goal,inf.aud,inf.text,d.text,(s.html||'').match(/data-ref="[^"]*"/g)?.join(' ')].join(' ')).includes(q)});
  return arr}
function sermonCard(s){const d=derive(s);const c=catOf(s);const lp=lastPreach(s);const q=norm(listState.q.trim());const hit=q&&!norm(d.title).includes(q)?hitLine(s,q):'';
  return`<div class="sm-card">
   <div class="top"><button class="open" data-act="open" data-id="${esc(s.id)}"><span class="ti">${esc(d.title||t('untitled'))}</span>
     <span class="me">${esc([d.passage,d.points?`${d.points} ${t(d.points>1?'points':'point')}`:'',sLang(s).toUpperCase()].filter(Boolean).join(' · '))}</span></button>
     <button class="iconbtn star ${s.fav?'on':''}" data-act="fav" data-id="${esc(s.id)}" aria-label="${esc(t(s.fav?'act_unfav':'act_fav'))}" aria-pressed="${!!s.fav}">${ic('star')}</button>
     <button class="iconbtn" data-act="menu" data-id="${esc(s.id)}" aria-label="${esc(t('more'))}">${ic('more')}</button></div>
   ${hit?`<div class="hit">${hit}</div>`:''}
   <div class="tags">${c?`<span class="tag">${esc(c)}</span>`:''}${lp?`<span class="tag ok">${esc(t('preached'))} · ${esc(placeName(lp))} ${esc(fmtD(lp.date))}</span>`:`<span class="tag warn">${esc(t('pending'))}</span>`}</div>
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
    :arr.length?arr.map(sermonCard).join(''):`<div class="empty"><p style="margin:0">${esc(t('no_res'))}</p></div>`}</div>
  ${tr?`<button class="lnk" data-act="trash" style="align-self:center;padding:10px">${ic('trash')} ${esc(t('trash_n',{n:tr}))}</button>`:''}`}
const modeSeg=()=>`<div class="seg"><button data-act="lmode" data-m="s" aria-pressed="${listState.mode==='s'}">${esc(t('nav_list'))}</button><button data-act="lmode" data-m="n" aria-pressed="${listState.mode==='n'}">${esc(t('lib'))}</button></div>`;
/* ---------- Biblioteca personal ---------- */
const NTYPES=['estudio','frase','reflexion','ilustracion','nota','idea','ref'];
function notesHtml(){const q=norm(listState.q.trim());
  let arr=liveN().sort((a,b)=>(b.updated||0)-(a.updated||0)).filter(n=>(!listState.nt||n.type===listState.nt)&&(!q||norm([n.title,n.text,n.ref].join(' ')).includes(q)));
  return`<div class="between"><h1 class="h">${esc(t('lib'))}</h1><button class="iconbtn gold" data-act="nNew" aria-label="${esc(t('n_new'))}">${ic('plus')}</button></div>
  ${modeSeg()}
  <label class="search">${ic('search')}<input id="lq" type="search" value="${esc(listState.q)}" placeholder="${esc(t('search_ph'))}" autocomplete="off" data-input="listQ"></label>
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
function duplicate(id){const s=sermons.find(x=>x.id===id);if(!s)return;const c=JSON.parse(JSON.stringify(s));const d=derive(s);
  Object.assign(c,{id:uid(),fav:false,log:[],preached:{},created:Date.now()});
  const h=document.createElement('div');h.innerHTML=getHtml(s);let h1=h.querySelector('h1');if(!h1){h1=document.createElement('h1');h.prepend(h1)}h1.textContent=`${d.title||t('untitled')} ${t('copy_sfx')}`;c.html=cleanHtml(h.innerHTML);
  putSermon(c,{silent:true});closeSheet();openEditor(c.id);toast(t('duplicated'))}

/* =========================================================
   EDITOR
   ========================================================= */
let E=null;
function newSermon(){const s={id:uid(),html:'',lang:prefs.ui,category:listState.cat||'',fav:false,created:Date.now(),log:[],v:2};openEditor(null,s)}
function openEditor(id,fresh){
  const s=fresh||sermons.find(x=>x.id===id);if(!s)return;closeSheet();while($('.ov'))closeSheet();
  view.overlay='editor';$('#nav').hidden=true;
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
     <button class="btn sm gold" data-act="edPreach">${ic('lectern')}${esc(t('preach'))}</button>
   </div></div>
   <div class="ed-meta" id="edMeta"></div>
   <div class="doc" id="ed" contenteditable="true" spellcheck="true" autocapitalize="sentences" lang="${lang==='pt'?'pt-BR':'es'}" aria-label="${esc(t('new_sermon'))}"></div>
   <div class="tb" id="tb" role="toolbar" aria-label="Formato"><div class="in">
     <div class="fmt">
       <button data-act="fmtSize" data-keep aria-label="${esc(t('tb_size'))}">Aa</button>
       <button data-act="fmtHead" data-keep aria-label="${esc(t('tb_title'))}" id="tbH">T</button>
       <button data-act="fmtB" data-keep aria-label="${esc(t('tb_bold'))}" id="tbB">B</button>
       <button data-act="fmtI" data-keep aria-label="${esc(t('tb_italic'))}" id="tbI" style="font-family:var(--read);font-style:italic;font-weight:500">I</button>
       <button data-act="fmtU" data-keep aria-label="${esc(t('tb_under'))}" id="tbU" style="text-decoration:underline;font-weight:600">U</button>
       <button data-act="fmtOl" data-keep aria-label="${esc(t('tb_list'))}">${ic('ol')}</button>
       <button data-act="fmtHl" data-keep aria-label="${esc(t('tb_hl'))}">${ic('hl')}</button>
       <button data-act="fmtNote" data-keep aria-label="${esc(t('tb_note'))}" style="font-size:18px">@</button>
     </div>
     <div class="big"><button class="v" data-act="edVerse" data-keep>${ic('bible')}${esc(t('tb_verse'))}</button><button class="p" data-act="edPoint" data-keep>${ic('plus')}${esc(t('tb_point'))}</button></div>
   </div></div></div>`;
  const ed=$('#ed');ed.innerHTML=html?cleanHtml(html):'<h1></h1><p class="ph"></p>';
  if(!ed.querySelector('h1')){const h=document.createElement('h1');ed.prepend(h)}
  placeholders();E.U=[ed.innerHTML];E.base=fresh?'':cleanHtml(html);E.baseAt=s.updated||Date.now();E.wasEmpty=!ed.textContent.trim();drawEdMeta();
  ed.addEventListener('input',onEdInput);ed.addEventListener('keydown',onEdKey);ed.addEventListener('paste',onPaste);
  ed.addEventListener('beforeinput',e=>{if(e.inputType==='historyUndo'){e.preventDefault();edUndo()}else if(e.inputType==='historyRedo'){e.preventDefault();edRedo()}});
  document.addEventListener('selectionchange',tbState);
  window.scrollTo(0,0);fitToolbar();
  if(fresh){setTimeout(()=>{const h1=ed.querySelector('h1');placeCaret(h1,0);ed.focus()},60)}
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
   <span class="sub" id="edWc" style="margin-left:auto;align-self:center;font-size:12.5px"></span>`;updWc()
  $$('#edMeta svg').forEach(s=>{s.style.width='16px';s.style.height='16px'})}
function updWc(){const el=$('#edWc');if(!el||!E)return;const w=(edText().match(/\S+/g)||[]).length;el.textContent=w?t('wc',{w,m:Math.max(1,Math.round(w/130))}):''}
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
  if(!E.s.lang)E.s.lang=detectLang(d.text);
  E.isNew=false;E.dirty=false;const cur=sermons.find(x=>x.id===E.s.id);if(cur&&cur.hist)E.s.hist=cur.hist;putSermon(E.s,{silent:true});updWc();if(E.wasEmpty!==!d.text.trim()){E.wasEmpty=!d.text.trim();drawEdMeta()}const sv=$('#edSaved');if(sv)sv.innerHTML=ic('check')+`<span class="st">${esc(t('saved'))}</span>`}
function closeEditor(then){if(!E)return;edSave();commitHist();document.removeEventListener('selectionchange',tbState);E=null;view.overlay=null;then?then():render(true)}
function curBlock(){const ed=$('#ed');const sel=getSelection();if(!ed||!sel.rangeCount)return null;let n=sel.anchorNode;if(!ed.contains(n))return null;
  while(n&&n.parentNode!==ed)n=n.parentNode;return n&&n.nodeType===1?n:null}
function placeCaret(el,off){if(!el)return;const r=document.createRange();try{if(off===0){r.setStart(el,0)}else{r.selectNodeContents(el);r.collapse(false)}}catch(e){return}const s=getSelection();s.removeAllRanges();s.addRange(r)}
function onEdKey(e){if((e.metaKey||e.ctrlKey)&&!e.altKey){const k=e.key.toLowerCase();if(k==='z'){e.preventDefault();e.shiftKey?edRedo():edUndo()}else if(k==='y'){e.preventDefault();edRedo()}}
  if(e.key==='Enter'&&!e.shiftKey){const b=curBlock();if(b&&/^H[123]$/.test(b.tagName)){setTimeout(()=>{const n=curBlock();if(n&&n!==b&&!/^(P|LI|OL|UL)$/.test(n.tagName))document.execCommand('formatBlock',false,'<p>')},0)}
    if(b&&b.tagName==='BLOCKQUOTE'){const sel=getSelection();const r=sel.rangeCount&&sel.getRangeAt(0);const atEnd=r&&r.collapsed&&(()=>{const t2=document.createRange();t2.selectNodeContents(b);t2.setStart(r.endContainer,r.endOffset);return!t2.toString().length})();
      if(atEnd){e.preventDefault();const p=document.createElement('p');p.innerHTML='<br>';b.after(p);placeCaret(p,0);onEdInput()}}}}
function onPaste(e){e.preventDefault();const cd=e.clipboardData;if(!cd)return;const html=cd.getData('text/html');const txt=cd.getData('text/plain');
  let ins='';
  if(txt&&txt.includes('\n')&&!/<(h[1-3]|blockquote|ol|ul)\b/i.test(html)){
    const r=linesToHtml(txt,{});const h1=$('#ed h1');if(r.title&&h1&&!h1.textContent.trim()){h1.textContent=r.title}ins=r.html}
  else if(html){ins=cleanHtml(html).replace(/<\/?h1>/g,m=>m.replace('h1','h2'))}
  else{document.execCommand('insertText',false,txt||'');return}
  document.execCommand('insertHTML',false,ins);onEdInput()}
function tbState(){if(!E)return;const set=(id,on)=>{const b=document.getElementById(id);if(b)b.setAttribute('aria-pressed',on?'true':'false')};
  const hb=curBlock();const inH=hb&&/^H[123]$/.test(hb.tagName);
  try{set('tbB',!inH&&document.queryCommandState('bold'));set('tbI',document.queryCommandState('italic'));set('tbU',document.queryCommandState('underline'))}catch(e){}
  const b=curBlock();set('tbH',b&&/^H[23]$/.test(b.tagName))}
function fmt(cmd){const ed=$('#ed');ed.focus();document.execCommand(cmd,false,null);onEdInput();tbState()}
function fmtHead(){const b=curBlock();if(!b)return;if(b.tagName==='H1'){toast(t('tb_title')+': '+t('title_ph'));return}
  const next=b.tagName==='H2'?'<h3>':b.tagName==='H3'?'<p>':'<h2>';document.execCommand('formatBlock',false,next);onEdInput();tbState()}
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
function edVerse(){const sel=getSelection();savedRange=sel.rangeCount?sel.getRangeAt(0).cloneRange():null;const l=sLang(E.s);
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
if(window.visualViewport){visualViewport.addEventListener('resize',fitToolbar);visualViewport.addEventListener('scroll',fitToolbar)}
function edMenu(){if(!E)return;edSave();if(!sermons.find(x=>x.id===E.s.id)){toast(t('body_ph'));return}const id=E.s.id;
  openSheet(`<div class="acts">
   <button class="act" data-act="share" data-id="${esc(id)}">${ic('share')}${esc(t('act_share'))}</button>
   <button class="act" data-act="edInfo">${ic('doc')}${esc(t('details_t'))}</button>
   <button class="act" data-act="edOrg">${ic('ol')}${esc(t('organize'))}</button>
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
    <button class="act" id="shPdf">${ic('print')}${esc(t('pdf'))}</button>
    ${navigator.share?`<button class="act" id="shOt">${ic('share')}${esc(t('other_apps'))}</button>`:''}</div>`);
  loadBible(sLang(s)).catch(()=>{});
  $('#shSeg',sh).onclick=e=>{const b=e.target.closest('button');if(!b)return;only=b.dataset.o==='1';$$('#shSeg button',sh).forEach(x=>x.setAttribute('aria-pressed',x===b))};
  $('#shWa',sh).onclick=()=>{const a=document.createElement('a');a.href='https://wa.me/?text='+encodeURIComponent(sermonText(s,only));a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()};
  $('#shCp',sh).onclick=()=>copyText(sermonText(s,only)).then(()=>toast(t('txt_copied')));
  $('#shPdf',sh).onclick=()=>{closeSheet();printSermon(s,only)};
  const ot=$('#shOt',sh);if(ot)ot.onclick=()=>navigator.share({title:derive(s).title,text:sermonText(s,only)}).catch(()=>{})}
async function printSermon(s,only){const l=sLang(s);try{await loadBible(l)}catch(e){}
  const d=numberedDoc(s);const dv=derive(s);
  $$('blockquote[data-ref]',d).forEach(b=>{if(!b.textContent.trim())b.textContent=bibleText(b.getAttribute('data-ref'),l)});
  $$('h2',d).forEach(h=>{if(h.dataset.n)h.textContent=`${h.dataset.n}. ${h.textContent}`});
  const h1=d.querySelector('h1');if(h1)h1.remove();
  if(only)[...d.children].forEach(x=>{if(!/^(H2|BLOCKQUOTE)$/.test(x.tagName))x.remove()});
  $('#printArea').innerHTML=`<div class="ph"><span style="display:flex;align-items:center;gap:8pt"><img src="logo.jpg" alt="">Meu Púlpito</span><span>${esc(new Date().toLocaleDateString(l==='pt'?'pt-BR':'es'))}</span></div>
   <h1>${esc(dv.title||t('untitled'))}</h1>${dv.passage?`<div class="ref">${esc(dv.passage)}</div>`:''}${d.innerHTML}<div class="pf">Meu Púlpito · ${esc(verLabel(l))}</div>`;
  toast(t('pdf_tip'));setTimeout(()=>window.print(),350)}

/* =========================================================
   Historial de predicaciones
   ========================================================= */
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
async function openPreach(id,{resume}={}){
  if(E&&E.s.id===id)edSave();const s=sermons.find(x=>x.id===id)||(E&&E.s.id===id?E.s:null);if(!s)return;while($('.ov'))closeSheet();
  const lang=sLang(s);const r=getResume();const fromSaved=r&&r.id===id;
  PG={s,lang,tSec:fromSaved?(r.tSec||0):0,run:false,int:0,calm:false,top:fromSaved?(r.top||0):0,wake:null,raf:0};
  const el=document.createElement('div');el.className='pg '+prefs.p.bg;el.id='pg';
  el.innerHTML=`<div class="pg-top">
     <button class="iconbtn" data-act="pgClose" aria-label="${esc(t('exit'))}">${ic('x')}</button>
     <button class="pg-timer" id="pgTimer" data-act="pgTimer" aria-label="${esc(t('p_timer'))}">${ic('play')}<span id="pgT">00:00</span><small id="pgG"></small></button>
     <span class="pg-where" id="pgWhere"></span>
     <button class="iconbtn" data-act="pgSet" aria-label="${esc(t('p_set'))}" style="color:var(--pfg);font-weight:800;font-size:16px">Aa</button></div>
   <div class="pg-prog"><i id="pgProg"></i></div>
   <div class="pg-scroll" id="pgScroll"><article class="pg-text" id="pgText"></article></div>
   <div class="pg-dim" id="pgDim" aria-hidden="true"></div>
   <div class="pg-bot"><button class="prev" data-act="pgPrev">${ic('back')}${esc(t('p_prev',null,lang))}</button><button class="scr" data-act="pgScr" id="pgScr" aria-label="${esc(t('p_scroll'))}">${ic('down')}</button><button class="next" data-act="pgNext"><span id="pgNextL">${esc(t('p_next',null,lang))}</span>${ic('next')}</button></div>`;
  document.body.appendChild(el);document.body.style.overflow='hidden';
  pgRender();pgApply();
  const sc=$('#pgScroll');sc.addEventListener('scroll',pgScroll,{passive:true});
  sc.addEventListener('click',pgTap);sc.addEventListener('touchstart',()=>{if(PG&&PG.asc){ascStop();toast(t('scroll_pause',null,PG.lang))}},{passive:true});sc.addEventListener('wheel',()=>{if(PG&&PG.asc)ascStop()},{passive:true});
  requestAnimationFrame(()=>{sc.scrollTop=PG.top});
  try{await loadBible(lang);if(PG){const top=sc.scrollTop;pgRender();sc.scrollTop=top}}catch(e){}
  if(PG&&PG.top)requestAnimationFrame(()=>{sc.scrollTop=PG.top});
  if(prefs.p.tap&&!ls.get('mp.tip',false)){ls.set('mp.tip',true);toast(t('tip_tap',null,lang))}else if(fromSaved&&(r.top>40||r.tSec))toast(t('cont',null,lang));
  try{PG.wake=await navigator.wakeLock?.request('screen')}catch(e){}
}
function pgRender(){if(!PG)return;const s=PG.s,l=PG.lang;const d=docOf(s);const out=[];let n=0,k=0;PG.secs=[];
  const dv=derive(s);
  for(const el of [...d.children]){const tg=el.tagName,tx=el.textContent.trim(),inner=cleanHtml(el.innerHTML);
    if(tg==='H1'){if(dv.passage&&!d.querySelector('blockquote[data-ref]'))out.push(`<div class="ref-top">${esc(t('base',null,l))} · ${esc(dv.passage)}</div>`);if(tx)out.push(`<h1>${esc(tx)}</h1>`);continue}
    if(tg==='H2'){if(!tx)continue;const sk=secOf(tx);const id='s'+(k++);
      if(sk){out.push(`<h2 class="sec s-${sk}" id="${id}">${esc(tx.replace(/:$/,''))}</h2>`);PG.secs.push({id,label:tx.replace(/:$/,''),pt:0})}
      else{n++;const clean=tx.replace(RX_PT,'').replace(/^[:\-–\s]+/,'')||tx;out.push(`<h2 id="${id}"><span class="n">${n}.</span><span>${esc(clean)}</span></h2>`);PG.secs.push({id,label:clean,pt:n})}continue}
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
  $('#pgTimer').hidden=!p.timer;$('#pgG').textContent=p.goal?`/ ${p.goal}:00`:'';pgTimerDraw();savePrefs()}
function pgTimerDraw(){if(!PG)return;$('#pgT').textContent=fmtSec(PG.tSec);const gs=prefs.p.goal*60;const ov=!!prefs.p.goal&&PG.tSec>=gs;const wn=!!prefs.p.goal&&!ov&&gs>300&&PG.tSec>=gs-300;
  const b=$('#pgTimer');b.classList.toggle('over',ov);b.classList.toggle('warn',wn);$('#pg').classList.toggle('tw',ov||wn);
  b.querySelector('use').setAttribute('href',PG.run?'#i-pause':'#i-play')}
function pgTimer(){if(!PG)return;PG.run=!PG.run;clearInterval(PG.int);
  if(PG.run)PG.int=setInterval(()=>{if(!PG)return;PG.tSec++;pgTimerDraw();const g=prefs.p.goal*60;
    if(g>300&&PG.tSec===g-300)toast(t('five',null,PG.lang));if(g&&PG.tSec===g)toast(t('done_t',null,PG.lang));if(PG.tSec%10===0)pgSave()},1000);pgTimerDraw()}
function pgSave(){if(!PG)return;ls.set(RES,{id:PG.s.id,top:PG.top,tSec:PG.tSec,at:Date.now()})}
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
function pgTap(e){if(!PG||!prefs.p.tap||e.target.closest('button,a,input'))return;if(String(getSelection()||'').length)return;
  const r=$('#pgScroll').getBoundingClientRect();const x=(e.clientX-r.left)/r.width;if(x>.62)pgGo(1);else if(x<.38)pgGo(-1)}
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
function pgSettings(){if(!PG)return;const p=prefs.p,l=PG.lang;const seg=(k,opts)=>`<div class="seg" data-pk="${k}">${opts.map(([v,lab])=>`<button data-v="${v}" aria-pressed="${String(p[k])===String(v)}">${esc(lab)}</button>`).join('')}</div>`;
  const colors=p.bg==='claro'||p.bg==='sepia'?[['auto',t('c_auto')],['#101827','●'],['#3B2F1E','●'],['#1F3A6B','●']]:[['auto',t('c_auto')],['#FFFFFF','●'],['#F3E9D2','●'],['#FFE08A','●']];
  const sw=k=>`<div class="seg" data-pk="color">${colors.map(([v,l])=>`<button data-v="${v}" aria-pressed="${p.color===v}" ${v!=='auto'?`style="color:${v};font-size:22px" aria-label="${v}"`:''}>${esc(l)}</button>`).join('')}</div>`;
  const rng=(id,k,min,max,step,lab,fmt)=>`<div class="fld"><span class="lb">${esc(lab)} · <span id="${id}V">${fmt(p[k])}</span></span><input class="rng" type="range" min="${min}" max="${max}" step="${step}" value="${p[k]}" data-rk="${k}" data-fmt="${id}" aria-label="${esc(lab)}"></div>`;
  const sh=openSheet(`<h3>${esc(t('p_set'))}</h3>
   <span class="lbl">${esc(t('g_read'))}</span>
   ${rng('psFs','fs',20,60,1,t('p_size'),v=>v)}
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
  const sel=[...BV.sel];
  return`<div class="between"><h1 class="h">${esc(t('nav_bible'))}</h1><button class="btn sm ghost" data-act="bVer">${esc(verLabel(l))}${ic('down')}</button></div>
   <form class="search" data-form="bSearch" role="search">${ic('search')}<input id="bq" type="search" value="${esc(BV.q)}" placeholder="${esc(t('b_search'))}" autocomplete="off" enterkeyhint="search" data-input="bQ"></form>
   <div class="chips"><button class="chip" data-act="bMode" data-f="0" aria-pressed="${!BV.fav}">${esc(verLabel(l))}</button><button class="chip" data-act="bMode" data-f="1" aria-pressed="${BV.fav}">${ic('star')}${esc(t('b_favs'))}</button></div>
   ${!BV.fav?`<div class="bsel"><select class="book" id="bBook" aria-label="Libro">${names.map((n,i)=>`<option value="${i}" ${i===BV.b?'selected':''}>${esc(n)}</option>`).join('')}</select>
     <select class="chap" id="bChap" aria-label="${esc(t('chap'))}">${Array.from({length:chN},(_,i)=>`<option value="${i+1}" ${i+1===BV.c?'selected':''}>${esc(t('chap'))} ${i+1}</option>`).join('')}</select></div>`:''}
   ${body}
   ${sel.length&&!BV.fav?`<div class="vbar"><span class="ref">${esc(refName(BV.b,BV.c,sel,l))}</span>
     <button class="iconbtn" data-act="bCopy" aria-label="${esc(t('copy_txt'))}">${ic('copy')}</button>
     <button class="iconbtn" data-act="bFav" aria-label="${esc(t('act_fav'))}">${ic('star')}</button>
     <button class="iconbtn" data-act="bCmp" aria-label="${esc(t('cmp'))}">${ic('lang')}</button>
     <button class="btn sm gold" data-act="bIns">${esc(t('ins_s'))}</button></div>`:''}`}
function bibleAfter(){const l=bver();if(!BIB[l]&&!BV.err)loadBible(l).then(()=>{if(view.tab==='bible'&&!view.overlay)render()}).catch(()=>{BV.err=true;if(view.tab==='bible')render()});
  const bb=$('#bBook'),bc=$('#bChap');if(bb)bb.onchange=()=>{BV.b=+bb.value;BV.c=1;BV.sel.clear();render()};if(bc)bc.onchange=()=>{BV.c=+bc.value;BV.sel.clear();render()}}
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
  return`<h1 class="h">${esc(t('nav_profile'))}</h1>
  <div class="card row" style="gap:14px"><div class="avatar">${esc((meta.name||t('pastor')).trim().charAt(0).toUpperCase())}</div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px">${esc(meta.name||t('pastor'))}</b><span class="sub" style="overflow-wrap:anywhere">${esc(localMode?t('local_only'):authU?authU.email:'')}</span></div></div>
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
    <div class="prow"><span class="k">${esc(t('restore'))}</span><button class="btn sm ghost" data-act="impOpen">${ic('clip')}${esc(t('import'))}</button></div>
    <div class="prow"><span class="sync" data-sync>${syncHtml()}</span>${localMode?(window.firebase&&firebase.apps&&firebase.apps.length?`<button class="btn sm dark" data-act="toLogin">${esc(t('login_btn'))}</button>`:''):`<button class="btn sm ghost" data-act="logout">${ic('out')}${esc(t('logout'))}</button>`}</div>
  </div>
  <span class="lbl" style="padding:4px 4px 0">${esc(t('soon'))}</span>
  <div class="soon"><div>${ic('mic')}${esc(t('s_rec'))}</div><div>${ic('text')}${esc(t('s_tr'))}</div><div>${ic('spark')}${esc(t('s_ai'))}</div></div>
  <p class="sub" style="margin:0;text-align:center;font-size:12px">${esc(t('credits'))}</p>`}
function importSheet(){const sh=openSheet(`<h3>${esc(t('restore'))}</h3><p class="sub" style="margin:0">${esc(t('restore_d'))}</p><textarea class="inp" id="impTa" rows="6"></textarea><button class="btn gold block" id="impGo">${esc(t('import'))}</button>`);
  $('#impGo',sh).onclick=()=>{let o;try{o=JSON.parse($('#impTa',sh).value.trim())}catch(e){toast(t('bad_paste'));return}
    const arr=Array.isArray(o)?o:o&&Array.isArray(o.sermons)?o.sermons:null;if(!arr){toast(t('bad_paste'));return}
    let n=0;arr.forEach(x=>{if(!x||!x.id)return;const i=sermons.findIndex(s=>s.id===x.id);if(i<0||(x.updated||0)>(sermons[i].updated||0)){const c=Object.assign({},x);delete c.example;delete c.compare;putSermon(c,{silent:true});n++}});
    if(o&&Array.isArray(o.notes))o.notes.forEach(x=>{if(x&&x.id&&!notes.find(a=>a.id===x.id))putNote(x,{silent:true})});
    if(o&&Array.isArray(o.agenda))o.agenda.forEach(x=>{if(x&&x.id&&!agenda.find(a=>a.id===x.id))putEvent(x)});
    if(o&&o.meta&&Array.isArray(o.meta.cats)){o.meta.cats.forEach(c=>{if(!meta.cats.includes(c))meta.cats.push(c)});(o.meta.favVerses||[]).forEach(f=>{if(!meta.favVerses.find(x=>x.ref===f.ref&&x.v===f.v))meta.favVerses.push(f)});if(!meta.name&&o.meta.name)meta.name=o.meta.name;putMeta()}
    closeSheet();toast(n?t('imported',{n}):t('nothing_new'));render()}}

/* =========================================================
   Entrada (login)
   ========================================================= */
function showLogin(){ready=false;view.overlay='login';$('#nav').hidden=true;
  $('#app').innerHTML=`<div class="login"><img class="logo" src="logo.jpg" alt="Meu Púlpito"><h2>${esc(t('login_t'))}</h2><p class="sub" style="margin:0;font-size:15px;line-height:1.5">${esc(t('login_d'))}</p>
   <div class="fld"><label for="lgE">${esc(t('email'))}</label><input class="inp" id="lgE" type="email" autocomplete="username" inputmode="email" placeholder="tu@correo.com"></div>
   <div class="fld"><label for="lgP">${esc(t('pass'))}</label><input class="inp" id="lgP" type="password" autocomplete="current-password" placeholder="${esc(t('pass_ph'))}"></div>
   <p class="err" id="lgErr" hidden></p>
   <button class="btn gold block" id="lgIn">${esc(t('enter'))}</button><button class="btn ghost block" id="lgUp">${esc(t('create'))}</button>
   <div class="between"><button class="lnk" id="lgF">${esc(t('forgot'))}</button><button class="lnk" id="lgL">${esc(t('nologin'))}</button></div>
   <div class="seg" style="margin-top:10px">${[['es','Español'],['pt','Português']].map(([v,l])=>`<button data-lg="${v}" aria-pressed="${prefs.ui===v}">${l}</button>`).join('')}</div></div>`;
  const err=m=>{const e=$('#lgErr');e.textContent=m;e.hidden=!m};
  const msg=e=>{const c=e&&e.code||'';return t(c.includes('invalid-email')?'e_email':c.includes('missing-password')?'e_pass':c.includes('weak-password')?'e_weak':c.includes('email-already-in-use')?'e_used':(c.includes('invalid-credential')||c.includes('wrong-password')||c.includes('user-not-found'))?'e_cred':c.includes('too-many')?'e_many':c.includes('network')?'e_net':'e_gen')};
  const doAuth=async create=>{err('');const em=$('#lgE').value.trim(),pw=$('#lgP').value;const b=create?$('#lgUp'):$('#lgIn');const tx=b.textContent;b.disabled=true;b.textContent=t(create?'creating':'entering');
    try{ls.set('pulpito.local',false);localMode=false;if(create)await firebase.auth().createUserWithEmailAndPassword(em,pw);else await firebase.auth().signInWithEmailAndPassword(em,pw)}catch(e){err(msg(e))}
    if(document.body.contains(b)){b.disabled=false;b.textContent=tx}};
  $('#lgIn').onclick=()=>doAuth(false);$('#lgUp').onclick=()=>doAuth(true);$('#lgP').addEventListener('keydown',e=>{if(e.key==='Enter')doAuth(false)});
  $('#lgF').onclick=async()=>{const em=$('#lgE').value.trim();if(!em){err(t('e_reset'));return}try{await firebase.auth().sendPasswordResetEmail(em);err('');toast(t('reset_sent'))}catch(e){err(msg(e))}};
  $('#lgL').onclick=()=>{view.overlay=null;startLocal()};
  $$('[data-lg]').forEach(b=>b.onclick=()=>{prefs.ui=b.dataset.lg;savePrefs();document.documentElement.lang=prefs.ui==='pt'?'pt-BR':'es';showLogin()})}

/* =========================================================
   Acciones (un solo manejador de toques)
   ========================================================= */
const ACT={
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
  edInfo:()=>infoSheet(),edOrg:()=>orgSheet(),edTpl:()=>tplSheet(),vers:()=>versSheet(),
  pgScr:()=>{PG&&(PG.asc?ascStop():ascStart())},agMode:b=>{agMode=b.dataset.m;render()},
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
  edLang:()=>{E.s.lang=sLang(E.s)==='pt'?'es':'pt';drawEdMeta();$('#ed').lang=E.s.lang==='pt'?'pt-BR':'es';edSave(true);toast(t('lang_msg')+': '+(E.s.lang==='pt'?'Português':'Español'))},
  fmtB:()=>fmt('bold'),fmtI:()=>fmt('italic'),fmtU:()=>fmt('underline'),fmtOl:()=>fmt('insertOrderedList'),
  fmtHead:()=>fmtHead(),fmtSize:()=>fmtSize(),fmtHl:()=>fmtHl(),fmtNote:()=>fmtNote(),edPoint:()=>edPoint(),edVerse:()=>edVerse(),vIns:()=>vInsert(),
  // predicar
  pgClose:()=>closePreach(),pgTimer:()=>pgTimer(),pgSet:()=>pgSettings(),pgPrev:()=>pgGo(-1),pgNext:()=>pgGo(1),
  // biblia
  bVer:()=>{BV.ver=bver()==='es'?'pt':'es';BV.sel.clear();render()},
  bMode:b=>{BV.fav=b.dataset.f==='1';render()},
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
  impOpen:()=>importSheet(),
  logout:async()=>{unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];cols=null;try{await firebase.auth().signOut()}catch(e){}authU=null;sermons=[];agenda=[];showLogin()},
  toLogin:()=>{ls.set('pulpito.local',false);localMode=false;showLogin()}
};
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-keep]');if(b&&E)e.preventDefault()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const f=ACT[b.dataset.act];if(f){e.preventDefault();f(b,e)}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.input;if(!k)return;
  if(k==='listQ'){listState.q=e.target.value;clearTimeout(e.target._t);e.target._t=setTimeout(render,180)}
  if(k==='bQ'){BV.q=e.target.value;const p=parseRef(BV.q);clearTimeout(e.target._t);e.target._t=setTimeout(()=>{if(p){BV.b=p.b;BV.c=Math.max(1,p.ch);BV.sel=new Set(p.vs||[]);}render()},300)}
  if(k==='pMail'){prefs.mmEmail=e.target.value.trim();savePrefs()}
  if(k==='pName'){meta.name=e.target.value.trim();clearTimeout(e.target._t);e.target._t=setTimeout(putMeta,600)}});
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
try{initStore()}catch(e){startLocal()}
setTimeout(()=>{try{purgeTrash()}catch(e){}},8000);
setTimeout(fallback,5000);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
// para pruebas
window.__mp={get notes(){return notes},get sermons(){return sermons},get agenda(){return agenda},get meta(){return meta},linesToHtml,cleanHtml,parseRef,bibleText,loadBible,derive,sermonText};
})();
