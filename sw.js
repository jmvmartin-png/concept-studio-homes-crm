const V='csh-crm-v3.1.7';
const CORE=['./','./index.html','./styles.css?v=3.1.7','./js/core.js?v=3.1.7','./js/views.js?v=3.1.7','./js/forms.js?v=3.1.7','./vendor/supabase.js','./manifest.webmanifest',
 'https://rvuoqfsuswjnyytvitqb.supabase.co/storage/v1/object/public/csh-public/logo.png',
 'https://rvuoqfsuswjnyytvitqb.supabase.co/storage/v1/object/public/csh-public/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.hostname.endsWith('supabase.co')&&!u.pathname.includes('/csh-public/'))return; // datos: siempre red
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();if(r.ok||r.type==='opaque')caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
