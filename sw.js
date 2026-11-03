// El app ahora vive en /app/. Este archivo retira el service worker viejo de la raíz.
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith("pulpito-")).map(k=>caches.delete(k)));await self.registration.unregister();const cs=await self.clients.matchAll({type:"window"});cs.forEach(c=>c.navigate(c.url))})())});
