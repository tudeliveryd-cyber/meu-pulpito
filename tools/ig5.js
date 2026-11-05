/* ---- desenho profissional dos documentos ---- */
const IG_COLS={navy:['#0F1B33','#1E3160'],vinho:['#4A1424','#6E2236'],verde:['#0F3326','#1C5440'],preto:['#151515','#2B2B2B']};
const igCol=()=>IG_COLS[igCfg().cc]||IG_COLS.navy;
const IG_GOLD='#B8902F';
function igGoldGrad(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#9C7424');g.addColorStop(.35,'#E7C979');g.addColorStop(.55,'#C79A3C');g.addColorStop(.8,'#F0D78F');g.addColorStop(1,'#A67C27');return g}
/* guilhoché: ondas entrelaçadas ao longo de um retângulo */
function igGuil(c,x,y,w,h,col,amp,per,n,lw){const P=2*(w+h);per=P/Math.max(1,Math.round(P/per));c.save();c.strokeStyle=col;c.lineWidth=lw||1.1;
  for(let k=0;k<(n||3);k++){const ph=k*Math.PI*2/(n||3);c.beginPath();for(let s=0;s<=P;s+=2){let px,py,nx,ny;if(s<w){px=x+s;py=y;nx=0;ny=1}else if(s<w+h){px=x+w;py=y+(s-w);nx=-1;ny=0}else if(s<2*w+h){px=x+w-(s-w-h);py=y+h;nx=0;ny=-1}else{px=x;py=y+h-(s-2*w-h);nx=1;ny=0}
    const o=amp*Math.sin(s/per*2*Math.PI+ph);s===0?c.moveTo(px+nx*o,py+ny*o):c.lineTo(px+nx*o,py+ny*o)}c.closePath();c.stroke()}c.restore()}
/* ornamento de canto */
function igCorner(c,x,y,sx,sy,col){c.save();c.translate(x,y);c.scale(sx,sy);c.strokeStyle=col;c.fillStyle=col;c.lineCap='round';
  c.lineWidth=3;c.beginPath();c.moveTo(0,120);c.lineTo(0,0);c.lineTo(120,0);c.stroke();
  c.lineWidth=2;c.beginPath();c.moveTo(16,150);c.bezierCurveTo(16,60,60,16,150,16);c.stroke();
  c.beginPath();c.moveTo(150,16);c.bezierCurveTo(185,16,196,44,174,52);c.bezierCurveTo(160,57,152,42,163,36);c.stroke();
  c.beginPath();c.moveTo(16,150);c.bezierCurveTo(16,185,44,196,52,174);c.bezierCurveTo(57,160,42,152,36,163);c.stroke();
  c.beginPath();c.moveTo(40,40);c.bezierCurveTo(70,40,88,58,96,86);c.stroke();c.beginPath();c.moveTo(40,40);c.bezierCurveTo(40,70,58,88,86,96);c.stroke();
  c.beginPath();c.moveTo(34,22);c.lineTo(46,34);c.lineTo(34,46);c.lineTo(22,34);c.closePath();c.fill();
  c.beginPath();c.arc(100,100,5,0,7);c.fill();c.restore()}
/* divisor com losango */
function igDivider(c,cx,y,w,col){c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2;c.beginPath();c.moveTo(cx-w/2,y);c.lineTo(cx-18,y);c.moveTo(cx+18,y);c.lineTo(cx+w/2,y);c.stroke();
  c.beginPath();c.moveTo(cx,y-10);c.lineTo(cx+10,y);c.lineTo(cx,y+10);c.lineTo(cx-10,y);c.closePath();c.fill();[-1,1].forEach(s=>{c.beginPath();c.arc(cx+s*(w/2+8),y,4,0,7);c.fill()});c.restore()}
/* selo dourado com fitas e texto em volta */
function igSeal(c,cx,cy,r,ink,text,col){c.save();c.translate(cx,cy);
  [-1,1].forEach(s=>{c.fillStyle=col;c.beginPath();c.moveTo(s*r*.18,r*.55);c.lineTo(s*r*.62,r*1.55);c.lineTo(s*r*.44,r*1.42);c.lineTo(s*r*.3,r*1.66);c.lineTo(s*r*-.08,r*.62);c.closePath();c.fill()});
  const g=c.createRadialGradient(-r*.35,-r*.35,r*.08,0,0,r);g.addColorStop(0,'#FBE7A6');g.addColorStop(.55,'#D6AD55');g.addColorStop(1,'#9C7424');c.fillStyle=g;c.beginPath();const n=56;for(let i=0;i<n*2;i++){const a=i*Math.PI/n;const rr=i%2?r*.93:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=2;c.beginPath();c.arc(0,0,r*.8,0,7);c.stroke();c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.arc(0,0,r*.55,0,7);c.stroke();
  const tx=(text||'').toUpperCase().slice(0,46);c.fillStyle=ink;let fs=r*.13;c.font=`800 ${fs}px Manrope, Inter, sans-serif`;const rad=r*.66;let tot=c.measureText(tx).width/rad;if(tot>Math.PI*1.75){fs*=Math.PI*1.75/tot;c.font=`800 ${fs}px Manrope, Inter, sans-serif`;tot=c.measureText(tx).width/rad}
  let a=-Math.PI/2-tot/2;c.textAlign='center';c.textBaseline='middle';for(const ch of tx){const w=c.measureText(ch).width/rad;c.save();c.rotate(a+w/2);c.fillText(ch,0,-rad);c.restore();a+=w}
  c.fillRect(-r*.045,-r*.36,r*.09,r*.68);c.fillRect(-r*.22,-r*.18,r*.44,r*.09);c.restore()}
async function igDrawLogo(c,x,y,h,center){const C=igCfg();if(!C.logo)return 0;try{const im=await loadImg(C.logo);const w=Math.min(h*2.4,im.width*h/im.height);c.drawImage(im,center?x-w/2:x,y,w,h);return w}catch(e){return 0}}
async function igWatermark(c,cx,cy,size,alpha){const C=igCfg();c.save();c.globalAlpha=alpha;if(C.logo){try{const im=await loadImg(C.logo);const s=size/Math.max(im.width,im.height);c.drawImage(im,cx-im.width*s/2,cy-im.height*s/2,im.width*s,im.height*s)}catch(e){}}
  else{c.fillStyle=igCol()[0];c.fillRect(cx-size*.06,cy-size*.45,size*.12,size*.9);c.fillRect(cx-size*.3,cy-size*.22,size*.6,size*.12)}c.restore()}
async function igFonts(){try{await Promise.all(['800 64px Manrope','400 40px Literata','italic 400 40px Literata','italic 700 90px Literata','700 90px Literata','600 30px Inter','700 30px Inter'].map(f=>document.fonts.load(f)))}catch(x){}}
/* certificado: estilo clássico (padrão) ou moderno */
async function igCertMake(k,v){await igFonts();const C=igCfg();const st=C.cst||'cl';const W=2480,H=1754;const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const [ink,ink2]=igCol();const T=igCertText(k,v);const ch=igChurch();
  if(st==='mo')await igCertModern(c,W,H,k,v,T,ink,ink2,C,ch);else await igCertClassic(c,W,H,k,v,T,ink,ink2,C,ch);
  return{cv,name:`${t('ig_cert').toLowerCase()}-${k}-${igName(T.name).replace(/\s+/g,'-').toLowerCase()}.png`,title:igDocName(k)+' — '+T.name,land:true}}
async function igCertClassic(c,W,H,k,v,T,ink,ink2,C,ch){
  const bg=c.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,W*.75);bg.addColorStop(0,'#FFFEF9');bg.addColorStop(1,'#F3EAD3');c.fillStyle=bg;c.fillRect(0,0,W,H);
  c.fillStyle=ink;c.fillRect(0,0,W,H);c.fillStyle=bg;c.fillRect(70,70,W-140,H-140);
  igGuil(c,22,22,W-44,H-44,'rgba(214,173,85,.85)',14,64,3,1.3);igGuil(c,46,46,W-92,H-92,'rgba(214,173,85,.45)',8,40,2,1);
  c.strokeStyle=IG_GOLD;c.lineWidth=5;c.strokeRect(96,96,W-192,H-192);c.lineWidth=1.5;c.strokeRect(112,112,W-224,H-224);
  igGuil(c,128,128,W-256,H-256,'rgba(184,144,47,.22)',6,26,2,1);
  [[124,124,1,1],[W-124,124,-1,1],[124,H-124,1,-1],[W-124,H-124,-1,-1]].forEach(([x,y,sx,sy])=>igCorner(c,x,y,sx,sy,IG_GOLD));
  await igWatermark(c,W/2,H/2+60,780,.05);
  c.textAlign='center';c.textBaseline='alphabetic';let y=230;
  const lw=await igDrawLogo(c,W/2,y-20,150,true);if(lw)y+=180;else y+=40;
  c.fillStyle=ink;c.font="800 44px Manrope, Inter, sans-serif";c.fillText(ch.toUpperCase().split('').join(String.fromCharCode(8202)),W/2,y);
  if(C.den){c.fillStyle='#6B5520';c.font="italic 400 32px Literata, Georgia, serif";c.fillText(C.den,W/2,y+46)}
  y+=C.den?150:120;c.font="700 150px Literata, Georgia, serif";const tt=t('ig_cert').toUpperCase().split('').join(' ');c.fillStyle=igGoldGrad(c,W/2-700,y-140,W/2+700,y);c.fillText(tt,W/2,y);
  c.strokeStyle='rgba(120,90,30,.35)';c.lineWidth=1;c.strokeText(tt,W/2,y);
  y+=70;c.fillStyle=ink;c.font="italic 400 50px Literata, Georgia, serif";c.fillText(t('ig_csub_'+k),W/2,y);
  igDivider(c,W/2,y+52,520,IG_GOLD);
  y+=200;let fs=118;c.font=`italic 700 ${fs}px Literata, Georgia, serif`;while(c.measureText(T.name).width>W-700&&fs>60){fs-=4;c.font=`italic 700 ${fs}px Literata, Georgia, serif`}c.fillStyle=ink2;c.fillText(T.name,W/2,y);
  const nw=Math.min(c.measureText(T.name).width+120,W-600);c.fillStyle=igGoldGrad(c,W/2-nw/2,0,W/2+nw/2,0);c.fillRect(W/2-nw/2,y+34,nw,4);
  y+=140;c.fillStyle='#262E3D';let bf=50;c.font=`400 ${bf}px Literata, Georgia, serif`;let bl=wrapLines(c,T.body,W-760);if(bl.length>3){bf=44;c.font=`400 ${bf}px Literata, Georgia, serif`;bl=wrapLines(c,T.body,W-700)}bl.forEach(s=>{c.fillText(s,W/2,y);y+=bf*1.5});
  y+=20;c.fillStyle='#7A5F22';c.font="italic 400 38px Literata, Georgia, serif";wrapLines(c,T.verse,W-900).forEach(s=>{c.fillText(s,W/2,y);y+=52});
  const sy=H-290;c.fillStyle='#5B6475';c.font="600 32px Inter, sans-serif";c.fillText((C.cid?C.cid+', ':'')+igLongDate(todayISO()),W/2,Math.max(y+40,sy-200));
  igSeal(c,W/2,sy-30,150,ink,ch||'Meu Púlpito',ink2);
  const sig=(x,nm,role)=>{c.strokeStyle=ink;c.lineWidth=2.5;c.beginPath();c.moveTo(x-300,sy);c.lineTo(x+300,sy);c.stroke();c.fillStyle=ink;c.font="700 36px Inter, sans-serif";if(nm)c.fillText(nm,x,sy+50);c.fillStyle='#5B6475';c.font="500 30px Inter, sans-serif";c.fillText(role,x,sy+(nm?92:50))};
  sig(W/2-680,v.mi||igPastor(),t('ig_sig_pas'));sig(W/2+680,C.sec||'',t('ig_sig_sec'))}
async function igCertModern(c,W,H,k,v,T,ink,ink2,C,ch){
  c.fillStyle='#FFFFFF';c.fillRect(0,0,W,H);const BW=620;
  const g=c.createLinearGradient(0,0,BW,H);g.addColorStop(0,ink);g.addColorStop(1,ink2);c.fillStyle=g;c.fillRect(0,0,BW,H);
  c.save();c.globalAlpha=.08;c.strokeStyle='#fff';c.lineWidth=2;for(let i=-H;i<BW+H;i+=34){c.beginPath();c.moveTo(i,0);c.lineTo(i+H*.6,H);c.stroke()}c.restore();
  c.fillStyle=igGoldGrad(c,BW,0,BW+26,0);c.fillRect(BW,0,18,H);c.fillStyle=IG_GOLD;c.fillRect(BW+30,0,4,H);
  c.fillStyle=igGoldGrad(c,W-420,0,W,0);c.beginPath();c.moveTo(W,0);c.lineTo(W-420,0);c.lineTo(W,420);c.closePath();c.fill();c.fillStyle=ink;c.beginPath();c.moveTo(W,0);c.lineTo(W-300,0);c.lineTo(W,300);c.closePath();c.fill();
  c.fillStyle=igGoldGrad(c,BW,H-300,BW+360,H);c.beginPath();c.moveTo(BW+34,H);c.lineTo(BW+34,H-260);c.lineTo(BW+300,H);c.closePath();c.fill();
  c.textAlign='center';let yy=300;
  if(C.logo){c.fillStyle='#fff';c.beginPath();c.arc(BW/2,yy,150,0,7);c.fill();c.strokeStyle=IG_GOLD;c.lineWidth=6;c.stroke();await igDrawLogo(c,BW/2,yy-95,190,true);yy+=260}else yy+=40;
  c.fillStyle='#fff';c.font="800 46px Manrope, Inter, sans-serif";wrapLines(c,ch.toUpperCase(),BW-120).slice(0,4).forEach(s=>{c.fillText(s,BW/2,yy);yy+=58});
  if(C.den){c.fillStyle='#E7C979';c.font="600 30px Inter, sans-serif";wrapLines(c,C.den,BW-140).slice(0,2).forEach(s=>{c.fillText(s,BW/2,yy+10);yy+=40})}
  c.fillStyle='rgba(255,255,255,.75)';c.font="600 28px Inter, sans-serif";wrapLines(c,[C.end,C.cid].filter(Boolean).join(' · '),BW-140).slice(0,3).forEach((s,i)=>c.fillText(s,BW/2,H-210+i*38));
  await igWatermark(c,BW+(W-BW)/2,H/2,720,.045);
  const X=BW+150,R=W-180;c.textAlign='left';let y=330;
  c.fillStyle=IG_GOLD;c.font="800 40px Manrope, Inter, sans-serif";c.fillText(t('ig_cert').toUpperCase().split('').join(String.fromCharCode(8202)+' '),X,y);
  y+=110;c.fillStyle=ink;let tf=96;c.font=`800 ${tf}px Manrope, Inter, sans-serif`;const sub=igCap(t('ig_csub_'+k).replace(/^(de|da|do|del)\s+/i,''));while(c.measureText(sub).width>R-X&&tf>56){tf-=4;c.font=`800 ${tf}px Manrope, Inter, sans-serif`}c.fillText(sub,X,y);
  y+=60;c.fillStyle=igGoldGrad(c,X,0,X+260,0);c.fillRect(X,y,260,8);
  y+=150;c.fillStyle='#5B6475';c.font="600 34px Inter, sans-serif";c.fillText(t('ig_cert_to'),X,y);
  y+=120;let fs=112;c.font=`italic 700 ${fs}px Literata, Georgia, serif`;while(c.measureText(T.name).width>R-X&&fs>60){fs-=4;c.font=`italic 700 ${fs}px Literata, Georgia, serif`}c.fillStyle=ink2;c.fillText(T.name,X,y);
  y+=110;c.fillStyle='#262E3D';c.font="400 44px Literata, Georgia, serif";wrapLines(c,T.body,R-X).forEach(s=>{c.fillText(s,X,y);y+=68});
  y+=24;c.fillStyle='#7A5F22';c.font="italic 400 36px Literata, Georgia, serif";wrapLines(c,T.verse,R-X-200).forEach(s=>{c.fillText(s,X,y);y+=50});
  const sy=H-250;c.fillStyle='#5B6475';c.font="600 30px Inter, sans-serif";c.fillText((C.cid?C.cid+', ':'')+igLongDate(todayISO()),X,Math.max(y+30,sy-150));
  const sig=(x,nm,role)=>{c.textAlign='left';c.strokeStyle=ink;c.lineWidth=2.5;c.beginPath();c.moveTo(x,sy);c.lineTo(x+520,sy);c.stroke();c.fillStyle=ink;c.font="700 34px Inter, sans-serif";if(nm)c.fillText(nm,x,sy+48);c.fillStyle='#5B6475';c.font="500 28px Inter, sans-serif";c.fillText(role,x,sy+(nm?88:48))};
  sig(X,v.mi||igPastor(),t('ig_sig_pas'));sig(X+640,C.sec||'',t('ig_sig_sec'));igSeal(c,R-120,sy-60,140,ink,ch||'Meu Púlpito',ink2)}
/* carteirinha e credencial (85,6 × 54 mm) */
async function igCardMake(v,k){await igFonts();const C=igCfg();const [ink,ink2]=igCol();const W=1012,H=638;const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const r=36;c.save();c.beginPath();c.roundRect?c.roundRect(0,0,W,H,r):c.rect(0,0,W,H);c.clip();
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,ink);g.addColorStop(1,ink2);c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalAlpha=.10;for(let i=0;i<14;i++){c.strokeStyle='#E7C979';c.lineWidth=1;c.beginPath();for(let x=0;x<=W;x+=4){const yy=H*.62+Math.sin(x/70+i*.45)*(40+i*3)+i*6;x?c.lineTo(x,yy):c.moveTo(x,yy)}c.stroke()}c.restore();
  await igWatermark(c,W-170,H/2-10,300,.07);
  c.fillStyle=igGoldGrad(c,0,0,W,0);c.fillRect(0,0,W,10);c.fillRect(0,H-82,W,82);
  let x0=44;const lw=await igDrawLogo(c,x0,36,84,false);if(lw)x0+=lw+20;
  c.textAlign='left';c.fillStyle='#fff';c.font="800 28px Manrope, Inter, sans-serif";const cl=wrapLines(c,(igChurch()||'').toUpperCase(),W-x0-44).slice(0,2);cl.forEach((s,i)=>c.fillText(s,x0,72+i*34));
  if(C.den){c.fillStyle='#E7C979';c.font="600 20px Inter, sans-serif";c.fillText(C.den,x0,72+cl.length*34)}
  const px=44,py=160,pw=220,ph=278;c.fillStyle='rgba(255,255,255,.08)';c.fillRect(px,py,pw,ph);
  if(v.ph){try{const u=await igShrink(v.ph,600);const im=await loadImg(u);const s=Math.max(pw/im.width,ph/im.height);const w=im.width*s,h=im.height*s;c.save();c.beginPath();c.rect(px,py,pw,ph);c.clip();c.drawImage(im,px+(pw-w)/2,py+(ph-h)/2,w,h);c.restore()}catch(e){}}
  else{c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=4;c.beginPath();c.arc(px+pw/2,py+104,50,0,7);c.stroke();c.beginPath();c.arc(px+pw/2,py+280,96,Math.PI*1.15,Math.PI*1.85);c.stroke()}
  c.strokeStyle=igGoldGrad(c,px,py,px+pw,py+ph);c.lineWidth=5;c.strokeRect(px,py,pw,ph);
  const tx=px+pw+40;let y=190;const fld=(lb,val)=>{if(!val)return;c.fillStyle='#E7C979';c.font="700 17px Inter, sans-serif";c.fillText(lb.toUpperCase().split('').join(String.fromCharCode(8202)),tx,y);c.fillStyle='#fff';c.font="700 30px Inter, sans-serif";wrapLines(c,val,W-tx-44).slice(0,2).forEach((s,i)=>c.fillText(s,tx,y+36+i*34));y+=94};
  fld(t('ig_df_n'),v.n);if(k==='cred'){fld(t('ig_df_cargo'),v.c);fld(t('ig_df_val_ate'),v.val?igDay(v.val):'')}else{fld(t('ig_df_funcao'),v.fn||t('ig_s_m'));fld(t('ig_cd_desde'),v.ds?igDay(v.ds):'')}
  c.fillStyle=ink;c.font="800 24px Manrope, Inter, sans-serif";c.fillText((k==='cred'?t('ig_dn_cred'):t('ig_cd_t')).toUpperCase().split('').join(String.fromCharCode(8202)),44,H-32);c.textAlign='right';c.font="600 20px Inter, sans-serif";c.fillText([C.cid,C.tel].filter(Boolean).join(' · '),W-44,H-34);c.restore();
  return{cv,name:`${k==='cred'?'credencial':'carteirinha'}-${igName(v.n).replace(/\s+/g,'-').toLowerCase()}.png`,title:igDocName(k)+' — '+v.n,land:false}}
/* timbre das cartas e fichas */
function igHeadHtml(){const C=igCfg();const [ink]=igCol();return`<div class="lt-band" style="background:${ink}"></div>${C.logo?`<img class="lt-wm" src="${C.logo}" alt="">`:''}<div class="lt-h" style="--ink:${ink}">${C.logo?`<img src="${C.logo}" alt="">`:''}<div><b>${esc(igChurch())}</b>${C.den?`<span class="lt-den">${esc(C.den)}</span>`:''}<span>${esc([C.end,C.cid].filter(Boolean).join(' · '))}</span>${C.tel?`<span>${esc(C.tel)}</span>`:''}</div></div>`}
function igFootHtml(){const C=igCfg();const [ink]=igCol();return`<div class="lt-f" style="border-color:${ink}"><span>${esc(igChurch())}</span><span>${esc([C.end,C.cid,C.tel].filter(Boolean).join(' · '))}</span></div>`}
function igLetterMake(k,v){const P=igLetterParts(k,v);const [ink]=igCol();
  const html=`<div class="lt" style="--ink:${ink}">${igHeadHtml()}<h1>${esc(P.title)}</h1><div class="lt-orn"><i></i><b></b><i></i></div>${P.pre.filter(Boolean).map(p=>`<p class="lt-pre">${esc(p)}</p>`).join('')}${P.body.map(p=>`<p>${esc(p)}</p>`).join('')}${P.end?`<p>${esc(P.end)}</p>`:''}<p class="lt-pl">${esc(P.place)}</p>${igSigsHtml(P.sigs)}${igFootHtml()}</div>`;
  const txt=[igChurch(),'',P.title.toUpperCase(),'',...P.pre.filter(Boolean),...(P.pre.length?['']:[]),...P.body.flatMap(p=>[p,'']),...(P.end?[P.end,'']:[]),P.place,'',...P.sigs.flatMap(([n,r])=>['______________________',n,r,''])].join('\n').trim();
  return{title:P.title,html,txt}}
function igFichaMake(k,v){const m=v.n&&igByName(v.n);const [ink]=igCol();const row=(lb,val)=>`<tr><th>${esc(lb)}</th><td>${esc(val||'')}</td></tr>`;
  const civ=m&&m.civ?t('ig_c_'+m.civ):'';let rows,decl,sigs;
  if(k==='fmem'){rows=[[t('ig_df_n'),m?igName(m.n):v.n],[t('ig_f_nasc'),m&&m.nasc?igDay(m.nasc):''],[t('ig_f_civ'),civ],['WhatsApp',m&&m.wa],[t('ig_c_end'),''],[t('ig_g_cid'),''],[t('ig_fi_doc'),''],[t('ig_f_bat'),m&&m.bat?igDay(m.bat):''],[t('ig_fi_esp'),''],[t('ig_fi_proc'),''],[t('ig_f_min'),m&&m.min],[t('ig_f_sit'),m?igSit(m.sit):''],[t('ig_f_obs'),m&&m.obs]];decl=t('ig_fi_mem_decl');sigs=[[m?igName(m.n):v.n,t('ig_sig_mem')],[igPastor(),t('ig_sig_pas')]]}
  else{rows=[[t('ig_df_n'),m?igName(m.n):v.n],[t('ig_f_nasc'),m&&m.nasc?igDay(m.nasc):''],[t('ig_c_end'),''],[t('ig_g_tel'),m&&m.wa],[t('ig_fi_conv'),''],[t('ig_fi_freq'),''],[t('ig_fi_prev'),t('ig_fi_simnao')],[t('ig_fi_quem'),'']];decl=t('ig_fi_bat_decl');sigs=[[m?igName(m.n):v.n,t('ig_sig_cand')],[igPastor(),t('ig_sig_pas')]]}
  const C=igCfg();const html=`<div class="lt" style="--ink:${ink}">${igHeadHtml()}<h1>${esc(igDocName(k))}</h1><div class="lt-orn"><i></i><b></b><i></i></div><div class="lt-photo">${esc(t('ig_fi_foto'))}</div><table class="lt-tb">${rows.map(r=>row(r[0],r[1])).join('')}</table><p>${esc(decl)}</p><p class="lt-pl">${esc((C.cid?C.cid+', ':'')+'____ / ____ / ________')}</p>${igSigsHtml(sigs)}${igFootHtml()}</div>`;
  return{title:igDocName(k),html,txt:''}}
