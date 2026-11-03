// Meu Púlpito: guarda o app e as Bíblias para abrir sem sinal.
// Busca a versão nova primeiro; se a internet estiver lenta (mais de 3 s), abre a cópia guardada.
const CACHE="pulpito-v63";
const SHELL=["./","index.html","app.js","app.css","firebase-config.js","manifest.webmanifest","logo.jpg","logo-full.png","logo-name.png","logo-name-light.png","mark.png","mark-light.png","logo-full-light.png","icon-192.png","icon-512.png","apple-touch-icon.png"];
const LIBS=["app","auth","firestore"].map(n=>"https://www.gstatic.com/firebasejs/10.12.2/firebase-"+n+"-compat.js");
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(SHELL);
  await Promise.all(LIBS.map(u=>fetch(u,{mode:"no-cors"}).then(r=>c.put(u,r)).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const ks=await caches.keys();const c=await caches.open(CACHE);
  // leva as Bíblias e libs já baixadas para a cópia nova
  for(const k of ks){if(k===CACHE)continue;const old=await caches.open(k);for(const req of await old.keys()){if(/\/biblia\/|gstatic|fonts\./.test(req.url)&&!(await c.match(req))){const r=await old.match(req);if(r)await c.put(req,r)}}}
  await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  const same=u.origin===location.origin;
  if(!(same||u.host==="www.gstatic.com"||u.host==="fonts.googleapis.com"||u.host==="fonts.gstatic.com"))return;
  const put=r=>{if(r&&(r.ok||r.type==="opaque")){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r};
  // Bíblias, imagens e bibliotecas: primeiro a cópia guardada (não mudam)
  if(!same||/\/biblia\/|\.(png|jpg|jpeg|webp|svg|ico)$/i.test(u.pathname)){
    e.respondWith(caches.match(e.request,{ignoreVary:true}).then(c=>c||fetch(e.request).then(put)));return}
  const net=fetch(e.request.url,{cache:"no-store"}).then(put);
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(c=>{
    if(!c)return net.catch(()=>caches.match("index.html"));
    return Promise.race([net.catch(()=>c),new Promise(ok=>setTimeout(()=>ok(c),3000))]);
  }));
  e.waitUntil(net.catch(()=>{}));
});
