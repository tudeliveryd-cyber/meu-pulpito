/* Meu Púlpito · Bíblia para as páginas de projeção (gerado a partir do app) */
(function(){
const norm=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
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

const CHN=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const BN={es:['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'],pt:['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cânticos','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oseias','Joel','Amós','Obadias','Jonas','Miqueias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse']};
const VFILE={es:'es-rv1909',pt:'pt-livre',es65:'es-rv1865',ptr:'pt-livretr',nva:'pt-nva',bpm:'pt-bpm',bes:'es-bes',pdt:'es-pdt',vbl:'es-vbl',blm:'es-blm',grc:'grc-tr',hbo:'hbo-wlc'};
const VNAME={es:'Reina-Valera 1909',pt:'Bíblia Livre',es65:'Reina-Valera 1865',ptr:'Bíblia Livre TR',nva:'Nova Versão de Acesso Livre',bpm:'Bíblia Portuguesa Mundial',bes:'Biblia en Español Sencillo',pdt:'Palabra de Dios para ti',vbl:'Versión Biblia Libre',blm:'Biblia Libre para el Mundo',grc:'Textus Receptus',hbo:'Códice de Leningrado'};
const VGROUPS=[['pt',['pt','ptr','nva','bpm']],['es',['es','es65','pdt','bes','vbl','blm']]];
const BIB={},BIBP={};
function load(k){if(!VFILE[k])k='es';if(BIB[k])return Promise.resolve(BIB[k]);if(!BIBP[k])BIBP[k]=fetch('../app/biblia/'+VFILE[k]+'.json').then(r=>{if(!r.ok)throw new Error('bible');return r.json()}).then(d=>BIB[k]=d).catch(e=>{BIBP[k]=null;throw e});return BIBP[k]}
function text(k,p){const B=BIB[k];if(!B||!p)return null;const c=(B[p.b]||[])[p.ch-1];if(!c)return null;const vs=p.vs||c.map((_,i)=>i+1);const parts=vs.map(v=>c[v-1]?{v,t:c[v-1]}:null).filter(Boolean);return parts.length?parts:null}
function label(p,L){const n=(BN[L==='pt'?'pt':'es'][p.b]||'');if(!p.vs)return n+' '+p.ch;const vs=p.vs;const g=[];vs.forEach(v=>{const l=g[g.length-1];if(l&&l.e===v-1)l.e=v;else g.push({s:v,e:v})});return n+' '+p.ch+':'+g.map(x=>x.s+(x.e>x.s?'-'+x.e:'')).join(',')}
window.MPB={parseRef,CHN,BN,VFILE,VNAME,VGROUPS,load,text,label,norm};
})();
