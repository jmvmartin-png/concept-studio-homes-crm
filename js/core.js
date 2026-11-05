/* Concept Studio Homes · CRM v3 — núcleo: datos, sync, cruce, avisos */
'use strict';
const SB_URL = 'https://rvuoqfsuswjnyytvitqb.supabase.co';
const SB_KEY = 'sb_publishable_7q_dWNCm_UN3-DNw_cK_Ow_fRYG2s07';
const ASSET = SB_URL + '/storage/v1/object/public/csh-public/';
const BUCKET = 'csh-docs';
const sb = supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

const S = { user: null, me: null, equipo: [], recs: new Map(), view: 'dashboard', online: navigator.onLine, sync: 'ok', ui: {} };

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => (v == null ? '' : String(v)).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { if (v === '' || v == null) return null; const n = Number(String(v).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : null; };
const eur = (v, compact) => { if (v == null || v === '' || isNaN(v)) return '—'; v = Number(v);
  if (compact && Math.abs(v) >= 1e6) return (v / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' M€';
  if (compact && Math.abs(v) >= 1e4) return (v / 1e3).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' k€';
  return v.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €'; };
const m2 = v => v == null || v === '' ? '—' : Number(v).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' m²';
const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();
const fdate = d => { if (!d) return '—'; const x = new Date(d.length <= 10 ? d + 'T00:00' : d); return isNaN(x) ? d : x.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' }); };
const fdt = d => { if (!d) return '—'; const x = new Date(d); return isNaN(x) ? d : x.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); };
const ftime = d => { const x = new Date(d); return isNaN(x) ? '' : x.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); };
const daysAgo = d => d ? Math.floor((Date.now() - new Date(d).getTime()) / 864e5) : null;
const uid = p => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const phoneDigits = t => { let d = (t || '').replace(/\D/g, ''); if (d.length === 9) d = '34' + d; return d; };
function toast(msg, ms = 2600) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), ms); }

/* ---------- catálogos ---------- */
const C = {
  estadosInm: ['Captación', 'Documentación', 'Comercialización', 'Negociación', 'Arras / Reserva', 'Cerrado', 'Descartado'],
  tipos: ['Piso', 'Ático', 'Dúplex', 'Estudio / Loft', 'Casa / Chalet', 'Local', 'Oficina', 'Edificio', 'Nave', 'Suelo / Solar', 'Finca rústica', 'Hotel', 'Garaje', 'Trastero'],
  operaciones: ['Venta', 'Alquiler', 'Alquiler con opción a compra'],
  intents: [
    { k: 'comprar', l: 'Comprar', ic: 'key', side: 'demanda' },
    { k: 'alquilar', l: 'Alquilar', ic: 'home', side: 'demanda' },
    { k: 'invertir', l: 'Invertir', ic: 'trend', side: 'demanda' },
    { k: 'vender', l: 'Vender', ic: 'tag', side: 'oferta' },
    { k: 'arrendar', l: 'Poner en alquiler', ic: 'building', side: 'oferta' }],
  leadEstados: ['Nuevo', 'Contactado', 'Cualificado', 'Visitando', 'Negociación', 'Cliente', 'Perdido'],
  leadColor: { Nuevo: '#ff7440', Contactado: '#f59e0b', Cualificado: '#3f6efc', Visitando: '#8b5cf6', 'Negociación': '#ec4899', Cliente: '#10b981', Perdido: '#94a3b8' },
  origenes: ['Idealista', 'Fotocasa', 'Habitaclia', 'Web CSH', 'Instagram', 'LinkedIn', 'WhatsApp', 'Referido', 'Puerta fría', 'Colaborador', 'Llamada', 'Otro'],
  roles: ['Comprador', 'Inquilino', 'Inversor', 'Propietario', 'Colaborador', 'Agencia', 'Intermediario'],
  temps: ['Frío', 'Templado', 'Caliente'],
  financiacion: ['Sin definir', 'Contado', 'Hipoteca preaprobada', 'Necesita hipoteca', 'Fondos / sociedad'],
  plazos: ['Inmediato', '< 3 meses', '3–6 meses', '6–12 meses', 'Sin prisa'],
  extras: ['Ascensor', 'Terraza', 'Garaje', 'Piscina', 'Exterior', 'Trastero', 'Aire acondicionado', 'Jardín', 'Reformado', 'Para reformar', 'Alquilado', 'Licencia'],
  opEstados: ['Propuesta', 'Oferta', 'Negociación', 'Arras', 'Notaría', 'Cerrada', 'Caída'],
  opColor: { Propuesta: '#94a3b8', Oferta: '#f59e0b', 'Negociación': '#3f6efc', Arras: '#8b5cf6', 'Notaría': '#ec4899', Cerrada: '#10b981', 'Caída': '#ef4444' },
  opProb: { Propuesta: 10, Oferta: 25, 'Negociación': 45, Arras: 75, 'Notaría': 90, Cerrada: 100, 'Caída': 0 },
  inmColor: { 'Captación': '#ff7440', 'Documentación': '#f59e0b', 'Comercialización': '#3f6efc', 'Negociación': '#8b5cf6', 'Arras / Reserva': '#ec4899', Cerrado: '#10b981', Descartado: '#94a3b8' },
  visEstados: ['Programada', 'Realizada', 'Cancelada', 'No presentado'],
  intereses: ['Frío', 'Templado', 'Caliente'],
  portales: ['Idealista', 'Fotocasa', 'Habitaclia', 'Pisos.com', 'Web CSH'],
  docCats: ['Nota simple', 'Catastro', 'CEE', 'Ficha comercial', 'Planos', 'Fotos', 'Encargo / mandato', 'Contrato', 'Arras', 'Oferta firmada', 'Identificación', 'Factura', 'Parte de visita', 'Otro'],
  checklist: { nota: 'Nota simple', catastro: 'Catastro', cee: 'CEE', ficha: 'Ficha comercial', planos: 'Planos', fotos: 'Fotos', encargo: 'Encargo' },
  palette: ['#3f6efc', '#ff7440', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#ef4444', '#64748b', '#0ea5e9', '#a855f7', '#84cc16']
};
const intentOf = k => C.intents.find(i => i.k === k) || { l: k || '—', side: '' };
const isDemanda = c => ['comprar', 'alquilar', 'invertir'].includes(c.intent);
const isOferta = c => ['vender', 'arrendar'].includes(c.intent);

/* ---------- registros ---------- */
function list(tipo) { const out = []; for (const r of S.recs.values()) if (r.tipo === tipo) out.push({ ...r.data, id: r.id, _u: r.updated_at, _by: r.updated_by, _c: r.created_at }); return out; }
function get(id) { const r = S.recs.get(id); return r ? { ...r.data, id: r.id, _u: r.updated_at, _by: r.updated_by, _c: r.created_at } : null; }
const clean = o => { const d = { ...o }; delete d.id; delete d._u; delete d._by; delete d._c; return d; };

function cacheSave() { try { localStorage.setItem('csh_cache', JSON.stringify([...S.recs.values()])); } catch (e) { } }
function cacheLoad() { try { const a = JSON.parse(localStorage.getItem('csh_cache') || '[]'); a.forEach(r => S.recs.set(r.id, r)); return a.length; } catch (e) { return 0; } }
function queueGet() { try { return JSON.parse(localStorage.getItem('csh_queue') || '[]'); } catch (e) { return []; } }
function queueSet(q) { try { localStorage.setItem('csh_queue', JSON.stringify(q)); } catch (e) { } }

async function loadAll() {
  setSync('loading');
  const all = []; let from = 0;
  while (true) {
    const { data, error } = await sb.from('csh_registros').select('*').range(from, from + 999);
    if (error) { setSync('err'); console.error(error); return false; }
    all.push(...data); if (data.length < 1000) break; from += 1000;
  }
  S.recs.clear(); all.forEach(r => S.recs.set(r.id, r)); cacheSave();
  const { data: eq } = await sb.from('csh_equipo').select('*').order('created_at');
  if (eq) { S.equipo = eq; try { localStorage.setItem('csh_equipo', JSON.stringify(eq)); } catch (e) { } }
  setSync('ok'); return true;
}

async function save(tipo, obj, { silent } = {}) {
  const id = obj.id || uid(tipo.slice(0, 3));
  const data = clean(obj);
  const prev = S.recs.get(id);
  const rec = { id, tipo, data, created_at: prev?.created_at || nowIso(), updated_at: nowIso(), updated_by: S.user?.email };
  S.recs.set(id, rec); cacheSave();
  if (!S.online) { const q = queueGet(); q.push({ op: 'up', rec }); queueSet(q); setSync('off'); if (!silent) toast('Guardado sin conexión · se sincronizará'); render(); return id; }
  const { error } = await sb.from('csh_registros').upsert({ id, tipo, data });
  if (error) { console.error(error); const q = queueGet(); q.push({ op: 'up', rec }); queueSet(q); setSync('err'); toast('No se pudo guardar en la nube: ' + error.message); }
  else if (!silent) toast('Guardado');
  render(); return id;
}
async function remove(id) {
  S.recs.delete(id); cacheSave();
  if (!S.online) { const q = queueGet(); q.push({ op: 'del', id }); queueSet(q); render(); return; }
  const { error } = await sb.from('csh_registros').delete().eq('id', id);
  if (error) toast('Error al borrar: ' + error.message);
  render();
}
async function flushQueue() {
  const q = queueGet(); if (!q.length || !S.online) return;
  const rest = [];
  for (const it of q) {
    const r = it.op === 'up' ? await sb.from('csh_registros').upsert({ id: it.rec.id, tipo: it.rec.tipo, data: it.rec.data }) : await sb.from('csh_registros').delete().eq('id', it.id);
    if (r.error) rest.push(it);
  }
  queueSet(rest); if (!rest.length) { toast('Cambios sin conexión sincronizados'); setSync('ok'); }
}
function logAct(refId, text, extra = {}) {
  return save('actividad', { refId, text, ts: nowIso(), by: S.me?.nombre || S.user?.email, ...extra }, { silent: true });
}
function acts(refId) { return list('actividad').filter(a => a.refId === refId).sort((a, b) => (b.ts || '').localeCompare(a.ts || '')); }

let rtChannel = null;
function subscribeRealtime() {
  if (rtChannel) sb.removeChannel(rtChannel);
  rtChannel = sb.channel('csh-registros').on('postgres_changes', { event: '*', schema: 'public', table: 'csh_registros' }, p => {
    if (p.eventType === 'DELETE') S.recs.delete(p.old.id); else S.recs.set(p.new.id, p.new);
    cacheSave(); clearTimeout(S._rt); S._rt = setTimeout(() => { if (!document.querySelector('.overlay')) render(); else renderChrome(); }, 300);
  }).subscribe();
}
function setSync(st) {
  S.sync = st; const el = $('#syncState'); if (!el) return;
  const map = { ok: ['', 'Sincronizado en la nube'], loading: ['off', 'Sincronizando…'], off: ['off', 'Sin conexión · cambios en cola'], err: ['err', 'Error de sincronización'] };
  const [c, t] = map[st] || map.ok; el.innerHTML = `<span class="dot ${c}"></span> ${t}`;
}
window.addEventListener('online', () => { S.online = true; flushQueue().then(loadAll).then(render); });
window.addEventListener('offline', () => { S.online = false; setSync('off'); });

/* ---------- motor de cruce oferta ↔ demanda ---------- */
function opCompat(intent, operacion) {
  const op = norm(operacion);
  if (intent === 'comprar' || intent === 'invertir') return op === 'venta' || op.includes('opcion');
  if (intent === 'alquilar') return op.startsWith('alquiler');
  return false;
}
function tipoMatch(wanted, tipo) {
  const t = norm(tipo); return wanted.some(w => { const n = norm(w).split('/').map(x => x.trim()); return n.some(x => x && (t.includes(x) || x.includes(t))); });
}
function zonaMatch(zonas, p) {
  const hay = norm([p.zona, p.municipio, p.direccion, p.provincia, p.cp].join(' '));
  return zonas.some(z => { const n = norm(z); return n && hay.includes(n); });
}
function matchScore(c, p) {
  if (!opCompat(c.intent, p.operacion)) return null;
  if (['Cerrado', 'Descartado'].includes(p.estado) || c.estado === 'Perdido') return null;
  let s = 0; const why = [];
  const tipos = c.tipos || []; const zonas = (c.zonas || '').split(/[,;]+/).map(x => x.trim()).filter(Boolean);
  why.push({ ok: true, t: p.operacion });
  if (tipos.length) { if (tipoMatch(tipos, p.tipo)) { s += 25; why.push({ ok: true, t: p.tipo }); } else return null; } else { s += 15; }
  if (zonas.length) { if (zonaMatch(zonas, p)) { s += 25; why.push({ ok: true, t: p.zona || p.municipio }); } else { why.push({ ok: false, t: 'Zona distinta' }); } } else { s += 12; }
  const max = num(c.precioMax), min = num(c.precioMin), pr = num(p.precio);
  if (pr && max) {
    if (pr <= max && (!min || pr >= min * 0.8)) { s += 30; why.push({ ok: true, t: 'Precio en rango' }); }
    else if (pr <= max * 1.1) { s += 18; why.push({ ok: 'warn', t: '+' + Math.round((pr / max - 1) * 100) + ' % s/ presupuesto' }); }
    else if (pr <= max * 1.2) { s += 8; why.push({ ok: false, t: '+' + Math.round((pr / max - 1) * 100) + ' % s/ presupuesto' }); }
    else return null;
  } else s += pr ? 15 : 10;
  const m = num(c.m2Min), pm = num(p.m2c) || num(p.m2u);
  if (m && pm) { if (pm >= m) { s += 10; why.push({ ok: true, t: m2(pm) }); } else if (pm >= m * 0.9) { s += 5; why.push({ ok: 'warn', t: m2(pm) }); } else why.push({ ok: false, t: 'Menos m²' }); } else s += 6;
  const h = num(c.habMin), ph = num(p.hab);
  if (h && ph != null) { if (ph >= h) { s += 10; why.push({ ok: true, t: ph + ' hab.' }); } else why.push({ ok: false, t: ph + ' hab.' }); } else s += 6;
  const ex = c.extras || []; const pex = p.extras || [];
  if (ex.length && pex.length) { const hit = ex.filter(e => pex.includes(e)); if (hit.length) why.push({ ok: true, t: hit.join(', ') }); }
  return { score: Math.min(100, s), why };
}
function candidatesFromCaptacion() {
  return list('contacto').filter(c => isOferta(c) && !c.inmuebleId && c.estado !== 'Perdido' && c.oTipo).map(c => ({
    id: 'cap:' + c.id, _cap: c.id, ref: 'CAPT', operacion: c.intent === 'vender' ? 'Venta' : 'Alquiler', tipo: c.oTipo, direccion: c.oDireccion || '', zona: c.oZona || '', municipio: c.oMunicipio || '', precio: num(c.oPrecio), m2c: num(c.oM2), hab: num(c.oHab), estado: 'Captación', extras: c.oExtras || [] }));
}
function computeMatches() {
  const dem = list('contacto').filter(isDemanda);
  const inm = list('inmueble').concat(candidatesFromCaptacion());
  const res = [];
  for (const c of dem) for (const p of inm) {
    const m = matchScore(c, p); if (m && m.score >= 60) {
      const key = 'avi_' + c.id + '__' + p.id.replace(/[:]/g, '-');
      const st = get(key);
      res.push({ key, c, p, ...m, estado: st?.estado || 'nuevo', st });
    }
  }
  return res.sort((a, b) => (a.estado === 'nuevo' ? -1 : 0) - (b.estado === 'nuevo' ? -1 : 0) || b.score - a.score);
}
function matchesFor(id) { return (S._matches || []).filter(m => m.c.id === id || m.p.id === id); }

/* ---------- puntuación de lead ---------- */
function leadScore(c) {
  let s = 0;
  if (c.intent) s += 10; if (c.telefono) s += 10; if (c.email) s += 5;
  if (num(c.precioMax) || num(c.oPrecio)) s += 15;
  if (['Contado', 'Hipoteca preaprobada', 'Fondos / sociedad'].includes(c.financiacion)) s += 20; else if (c.financiacion === 'Necesita hipoteca') s += 8;
  if (c.plazo === 'Inmediato' || c.plazo === '< 3 meses') s += 20; else if (c.plazo === '3–6 meses') s += 10;
  if (c.temperatura === 'Caliente') s += 15; else if (c.temperatura === 'Templado') s += 8;
  const v = list('visita').filter(x => x.contactoId === c.id).length; s += Math.min(10, v * 5);
  if (matchesFor(c.id).length) s += 5;
  return Math.min(100, s);
}
const scoreColor = s => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';

/* ---------- avisos del sistema ---------- */
function systemAlerts() {
  const out = []; const t = today();
  for (const c of list('contacto')) {
    if (['Perdido', 'Cliente'].includes(c.estado)) continue;
    if (c.proximaFecha && c.proximaFecha < t) out.push({ k: 'seg', lvl: 'bad', ic: 'clock', t: 'Seguimiento vencido · ' + (c.nombre || 'Contacto'), s: (c.proximaAccion || 'Acción pendiente') + ' · ' + fdate(c.proximaFecha), open: () => openContacto(c.id), tel: c.telefono });
    else if (c.proximaFecha === t) out.push({ k: 'seg', lvl: 'warn', ic: 'clock', t: 'Seguimiento hoy · ' + (c.nombre || 'Contacto'), s: c.proximaAccion || 'Acción pendiente', open: () => openContacto(c.id), tel: c.telefono });
    if (c.estado === 'Nuevo' && daysAgo(c.fechaAlta || c._c) >= 1) out.push({ k: 'lead', lvl: 'warn', ic: 'user', t: 'Lead sin contactar · ' + (c.nombre || ''), s: 'Entró ' + fdate(c.fechaAlta || c._c) + ' · ' + (c.origen || ''), open: () => openContacto(c.id), tel: c.telefono });
  }
  for (const v of list('visita')) if (v.estado === 'Programada' && (v.fecha || '').slice(0, 10) === t) { const p = get(v.inmuebleId); out.push({ k: 'vis', lvl: 'sys', ic: 'eye', t: 'Visita hoy ' + ftime(v.fecha) + ' · ' + (v.cliente || ''), s: p ? p.ref + ' · ' + p.direccion : '', open: () => openVisita(v.id), tel: v.telefono }); }
  for (const x of list('tarea')) if (!x.hecha && x.fecha && x.fecha < t) out.push({ k: 'tar', lvl: 'bad', ic: 'check', t: 'Tarea vencida · ' + x.titulo, s: fdate(x.fecha) + ' · ' + (x.agente || ''), open: () => openTarea(x.id) });
  const vis = list('visita');
  for (const p of list('inmueble')) {
    if (p.estado === 'Comercialización') {
      const last = vis.filter(v => v.inmuebleId === p.id).map(v => v.fecha).sort().pop();
      if (!last || daysAgo(last) > 30) out.push({ k: 'frio', lvl: 'warn', ic: 'snow', t: 'Inmueble frío · ' + p.ref, s: (p.direccion || '') + ' · ' + (last ? 'última visita ' + fdate(last) : 'sin visitas registradas'), open: () => openInmueble(p.id) });
    }
    if (['Comercialización', 'Negociación'].includes(p.estado)) {
      const d = p.docs || {}; const falt = ['nota', 'cee'].filter(k => !d[k]).map(k => C.checklist[k]);
      if (falt.length) out.push({ k: 'doc', lvl: 'sys', ic: 'file', t: 'Documentación pendiente · ' + p.ref, s: 'Falta: ' + falt.join(', '), open: () => openInmueble(p.id, 'docs') });
    }
  }
  for (const o of list('operacion')) if (!['Cerrada', 'Caída'].includes(o.estado) && o.fechaCierre && o.fechaCierre < t) out.push({ k: 'op', lvl: 'bad', ic: 'pipe', t: 'Cierre previsto superado · ' + (o.titulo || ''), s: 'Fecha ' + fdate(o.fechaCierre) + ' · ' + o.estado, open: () => openOperacion(o.id) });
  const ord = { bad: 0, warn: 1, sys: 2 }; return out.sort((a, b) => ord[a.lvl] - ord[b.lvl]);
}

/* ---------- extracción de datos de texto libre ---------- */
function extractData(txt) {
  const r = {}; const t = ' ' + txt.replace(/\s+/g, ' ') + ' '; const n = norm(t);
  const em = t.match(/[\w.+-]+@[\w-]+\.[\w.]+/); if (em) r.email = em[0];
  const tel = t.match(/(?:\+34[\s.-]?)?(?:[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|[6789]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})/); if (tel) r.telefono = tel[0].trim();
  const pr = [...t.matchAll(/(\d{1,3}(?:[.\s]\d{3})+|\d+(?:[,.]\d+)?)\s*(k€|mil\s*€?|millones|m€|€|euros|eur)/gi)].map(m => {
    let v = parseFloat(m[1].replace(/[.\s]/g, '').replace(',', '.')); const u = m[2].toLowerCase(); if (u.startsWith('k') || u.startsWith('mil ') || u === 'mil') v *= 1e3; if (u.startsWith('millon') || u === 'm€') v *= 1e6; return v; }).filter(v => v > 100);
  if (pr.length) r.precio = Math.max(...pr);
  const mm = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metros)/i); if (mm) r.m2 = parseFloat(mm[1].replace(',', '.'));
  const hb = t.match(/(\d+)\s*(?:hab|dormitorio|habitaciones|dorm)/i); if (hb) r.hab = +hb[1];
  const bn = t.match(/(\d+)\s*baños?/i); if (bn) r.banos = +bn[1];
  for (const tp of C.tipos) { const k = norm(tp.split('/')[0]); if (k && n.includes(k)) { r.tipo = tp; break; } }
  if (/casa|chalet|adosado/.test(n)) r.tipo = r.tipo || 'Casa / Chalet';
  if (/busc|necesit|interesad|quiero/.test(n)) { if (/alquil/.test(n)) r.intent = 'alquilar'; else if (/invers|rentabil/.test(n)) r.intent = 'invertir'; else if (/compr/.test(n)) r.intent = 'comprar'; }
  if (!r.intent) { if (/vend|en venta|se vende/.test(n)) r.intent = 'vender'; else if (/se alquila|en alquiler|poner en alquiler|alquilar mi/.test(n)) r.intent = 'arrendar'; else if (/alquil/.test(n)) r.intent = 'alquilar'; else if (/compr/.test(n)) r.intent = 'comprar'; }
  const zn = t.match(/(?:en|zona|barrio)\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ]+(?:\s(?:de|del|la|las|los)?\s?[A-ZÁÉÍÓÚÑ][\wáéíóúñ]+)*)/); if (zn) r.zona = zn[1];
  const nm = t.match(/(?:soy|me llamo|nombre:?)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2})/); if (nm) r.nombre = nm[1];
  for (const e of C.extras) if (n.includes(norm(e))) (r.extras = r.extras || []).push(e);
  for (const o of C.origenes) if (n.includes(norm(o))) { r.origen = o; break; }
  return r;
}

/* ---------- exportación ---------- */
function toCSV(rows, cols) {
  const e = v => { if (v == null) return ''; if (Array.isArray(v)) v = v.map(x => typeof x === 'object' ? (x.name || JSON.stringify(x)) : x).join(' | '); else if (typeof v === 'object') v = JSON.stringify(v); v = String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  cols = cols || [...new Set(rows.flatMap(r => Object.keys(r)))].filter(k => !['firma', '_c'].includes(k));
  return '﻿' + cols.join(';') + '\n' + rows.map(r => cols.map(c => e(r[c])).join(';')).join('\n');
}
function download(name, content, type = 'text/csv;charset=utf-8') { const b = new Blob([content], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
