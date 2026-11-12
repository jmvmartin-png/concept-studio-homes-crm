/* Concept Studio Homes · CRM v3 — fichas, documentos, extracción, firma y arranque */
'use strict';

/* ---------- constructor de formularios ---------- */
const F = (k, l, t = 'text', o = {}) => ({ k, l, t, ...o });
function field(f, v) {
  const id = 'f_' + f.k; const val = v == null ? '' : v; const cls = f.full ? 'fld full' : 'fld';
  const wrap = h => `<div class="${cls}" data-k="${f.k}"${f.side ? ` data-side="${f.side}"` : ''}><label for="${id}">${esc(f.l)}</label>${h}</div>`;
  switch (f.t) {
    case 'select': return wrap(`<select id="${id}" name="${f.k}">${f.blank !== false ? '<option value="">—</option>' : ''}${(f.o || []).map(x => { const [ov, ol] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(ov)}" ${String(val) === String(ov) ? 'selected' : ''}>${esc(ol)}</option>`; }).join('')}</select>`);
    case 'textarea': return wrap(`<textarea id="${id}" name="${f.k}" placeholder="${esc(f.ph || '')}">${esc(val)}</textarea>`);
    case 'pills': { const arr = Array.isArray(val) ? val : []; return `<div class="${cls} full" data-k="${f.k}"${f.side ? ` data-side="${f.side}"` : ''}><label>${esc(f.l)}</label><div class="pills">${(f.o || []).map(x => `<label class="${arr.includes(x) ? 'on' : ''}"><input type="checkbox" name="${f.k}" value="${esc(x)}" ${arr.includes(x) ? 'checked' : ''} onchange="this.parentNode.classList.toggle('on',this.checked)">${esc(x)}</label>`).join('')}</div></div>`; }
    case 'number': return wrap(`<input id="${id}" name="${f.k}" type="text" inputmode="decimal" data-num="1" value="${val === '' ? '' : esc(val)}" placeholder="${esc(f.ph || '')}">`);
    default: return wrap(`<input id="${id}" name="${f.k}" type="${f.t}" value="${esc(val)}" placeholder="${esc(f.ph || '')}" ${f.list ? `list="${f.list}"` : ''}>`);
  }
}
const section = (title, fields, obj, extra = '', attr = '') => `<div class="fs" ${attr}><h3>${title}</h3><div class="fg">${fields.map(f => field(f, obj[f.k])).join('')}</div>${extra}</div>`;
function collect(root, base = {}) {
  const o = { ...base }; const pillKeys = new Set($$('.pills input', root).map(i => i.name).filter(Boolean));
  pillKeys.forEach(k => { o[k] = $$(`.pills input[name="${k}"]:checked`, root).map(i => i.value); });
  $$('input[name],select[name],textarea[name]', root).forEach(i => { if (pillKeys.has(i.name) || i.type === 'file' || i.dataset.skip) return; if (i.type === 'radio') { if (i.checked) o[i.name] = i.value; return; } if (i.type === 'checkbox') o[i.name] = i.checked; else o[i.name] = i.dataset.num ? num(i.value) : i.value.trim(); });
  return o;
}
const agentes = () => S.equipo.map(m => m.nombre);

/* ---------- hoja lateral ---------- */
function openSheet({ title, sub = '', tabs, footer = '', head = '' }) {
  closeSheet(); const ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'sheet';
  ov.innerHTML = `<div class="sheet"><div class="sheet-h"><button class="btn icon ghost" onclick="closeSheet()">${ic('x')}</button><h2>${title}</h2>${head}</div>${sub}${tabs.length > 1 ? `<div class="tabs2">${tabs.map((t, i) => `<button data-tab="${t.k}" class="${i === 0 ? 'on' : ''}">${t.l}</button>`).join('')}</div>` : ''}<div class="sheet-b"></div>${footer ? `<div class="sheet-f">${footer}</div>` : ''}</div>`;
  ov.addEventListener('click', e => { if (e.target === ov) closeSheet(); });
  document.body.appendChild(ov); document.body.style.overflow = 'hidden';
  const body = $('.sheet-b', ov); const panes = {};
  tabs.forEach(t => { const d = document.createElement('div'); d.dataset.pane = t.k; d.innerHTML = t.html; d.classList.toggle('hidden', t !== tabs[0]); body.appendChild(d); panes[t.k] = d; });
  $$('.tabs2 button', ov).forEach(b => b.onclick = () => { $$('.tabs2 button', ov).forEach(x => x.classList.toggle('on', x === b)); Object.entries(panes).forEach(([k, d]) => d.classList.toggle('hidden', k !== b.dataset.tab)); const t = tabs.find(x => x.k === b.dataset.tab); t.onShow && t.onShow(panes[t.k]); body.scrollTop = 0; });
  tabs.forEach(t => t.onMount && t.onMount(panes[t.k]));
  return { ov, panes, tab: k => $(`.tabs2 button[data-tab="${k}"]`, ov)?.click() };
}
function closeSheet() { $('#sheet')?.remove(); document.body.style.overflow = ''; render(); }

/* ---------- documentos adjuntos (todas las fichas) ---------- */
const DOC2CHECK = { 'Nota simple': 'nota', Catastro: 'catastro', CEE: 'cee', 'Ficha comercial': 'ficha', Planos: 'planos', Fotos: 'fotos', 'Encargo / mandato': 'encargo' };
function docsHTML(tipo, id) {
  return `<div class="fs"><h3>Documentación adjunta</h3>
  <div class="drop" data-drop>${ic('clip')}<div style="margin:6px 0 10px">Arrastra archivos aquí o elige una opción</div>
  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><select class="f" data-skip="1" id="docCat">${C.docCats.map(c => `<option>${c}</option>`).join('')}</select>
  <label class="btn blue">${ic('up')} Subir archivos<input type="file" multiple class="hidden" data-skip="1" onchange="uploadDocs('${tipo}','${id}',this.files)"></label>
  <label class="btn">${ic('camera')} Cámara<input type="file" accept="image/*" capture="environment" class="hidden" data-skip="1" onchange="uploadDocs('${tipo}','${id}',this.files)"></label></div></div>
  <div class="docs-list" id="docsList">${docsList(id)}</div></div>`;
}
function docsList(id) {
  const r = get(id); const a = (r?.adjuntos || []).slice().sort((x, y) => (y.ts || '').localeCompare(x.ts || ''));
  if (!a.length) return '<div class="small muted" style="text-align:center;padding:8px">Sin documentos todavía. Nota simple, contratos, planos, fotos, DNI, ofertas… todo queda en la ficha.</div>';
  return a.map((d, i) => { const ext = (d.name.split('.').pop() || '').slice(0, 4).toUpperCase(); return `<div class="doc"><div class="di">${esc(ext)}</div><div class="dn"><b>${esc(d.name)}</b><span class="small muted">${esc(d.cat || '')} · ${Math.round((d.size || 0) / 1024)} KB · ${fdate(d.ts)} · ${esc(d.by || '')}</span></div><button class="btn sm" onclick="openDoc('${esc(d.path)}')">${ic('eye')}</button><button class="btn sm ghost danger" onclick="deleteDoc('${id}','${esc(d.path)}')">${ic('trash')}</button></div>`; }).join('');
}
function bindDrop(pane, tipo, id) {
  const z = $('[data-drop]', pane); if (!z) return;
  z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('over'); });
  z.addEventListener('dragleave', () => z.classList.remove('over'));
  z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('over'); uploadDocs(tipo, id, e.dataTransfer.files); });
}
async function uploadDocs(tipo, id, files) {
  if (!files || !files.length) return; if (!S.online) return toast('Necesitas conexión para subir documentos');
  if (!S.recs.has(id)) { const pending = S._pendingSave; if (pending) await pending(); if (!S.recs.has(id)) return toast('Guarda la ficha antes de adjuntar'); }
  const cat = $('#docCat')?.value || 'Otro'; const r = get(id); r.adjuntos = r.adjuntos || [];
  for (const f of files) {
    toast('Subiendo ' + f.name + '…', 1500);
    const safe = f.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_');
    const path = `${tipo}/${id}/${Date.now()}_${safe}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, f, { contentType: f.type || 'application/octet-stream', upsert: false });
    if (error) { toast('Error al subir ' + f.name + ': ' + error.message); continue; }
    r.adjuntos.push({ path, name: f.name, size: f.size, type: f.type, cat, ts: nowIso(), by: S.me?.nombre });
    if (tipo === 'inmueble' && DOC2CHECK[cat]) { r.docs = r.docs || {}; r.docs[DOC2CHECK[cat]] = true; }
  }
  await save(tipo, r, { silent: true }); logAct(id, `Documentación añadida (${files.length}) · ${cat}`);
  const l = $('#docsList'); if (l) l.innerHTML = docsList(id); toast('Documentos guardados en la ficha');
}
async function openDoc(path) {
  const w = window.open('', '_blank');
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(path, 600);
  if (error) { w && w.close(); return toast('No se pudo abrir: ' + error.message); }
  if (w) w.location = data.signedUrl; else location.href = data.signedUrl;
}
async function deleteDoc(id, path) {
  const r = get(id); const d = (r.adjuntos || []).find(x => x.path === path);
  if (!confirm(`¿Eliminar «${d?.name}» de la ficha? Esta acción no se puede deshacer.`)) return;
  await sb.storage.from(BUCKET).remove([path]); r.adjuntos = r.adjuntos.filter(x => x.path !== path);
  await save(S.recs.get(id).tipo, r, { silent: true }); logAct(id, 'Documento eliminado: ' + (d?.name || ''));
  const l = $('#docsList'); if (l) l.innerHTML = docsList(id);
}

/* ---------- actividad ---------- */
function actHTML(id) {
  return `<div class="fs"><h3>Añadir nota o llamada</h3><div class="fld"><textarea id="newNote" data-skip="1" placeholder="Ej.: Llamado, quiere visitar el sábado…"></textarea></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn sm blue" onclick="addNote('${id}','Nota')">Añadir nota</button><button class="btn sm" onclick="addNote('${id}','Llamada')">${ic('phone')} Registrar llamada</button></div></div>
  <div class="fs"><h3>Historial</h3><div class="timeline" id="tl">${tlHTML(id)}</div></div>`;
}
const tlHTML = id => acts(id).map(a => `<div class="tl"><span class="tld"></span><div><div style="color:var(--ink)">${esc(a.text)}</div><div class="small muted">${fdt(a.ts)} · ${esc(a.by || '')}</div></div></div>`).join('') || '<div class="small muted">Sin actividad</div>';
async function addNote(id, kind) { const t = $('#newNote').value.trim(); if (!t) return; await logAct(id, kind + ': ' + t); $('#newNote').value = ''; $('#tl').innerHTML = tlHTML(id); }

/* ---------- INMUEBLE ---------- */
function nextRef() { const n = list('inmueble').map(p => parseInt((p.ref || '').replace(/\D/g, '')) || 0); return 'PV-' + String(Math.max(0, ...n) + 1).padStart(4, '0'); }
function openInmueble(id, tab, preset = {}) {
  const isNew = !id; const p = get(id) || { id: 'inm_' + nextRef(), ref: nextRef(), estado: 'Captación', captacion: 'Propia', operacion: 'Venta', fecha: today(), agente: S.me?.nombre, prioridad: 'Media', exclusiva: 'No', docs: {}, portales: {}, adjuntos: [], ...preset };
  const ms = matchesFor(p.id); const vis = list('visita').filter(v => v.inmuebleId === p.id).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const chk = `<div class="fs"><h3>Checklist documental</h3><div class="pills">${Object.entries(C.checklist).map(([k, l]) => `<label class="${p.docs?.[k] ? 'on' : ''}"><input type="checkbox" data-doc="${k}" data-skip="1" ${p.docs?.[k] ? 'checked' : ''} onchange="this.parentNode.classList.toggle('on',this.checked)">${l}</label>`).join('')}</div></div>`;
  const portRow = x => { const v = p.portales?.[x] || {}; const icn = x === 'Instagram' ? 'instagram' : x === 'LinkedIn' ? 'linkedin' : 'globe'; return `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><label class="pills"><label class="${v.on ? 'on' : ''}" style="min-width:130px">${ic(icn).replace('<svg', '<svg width="15" height="15"')}<input type="checkbox" data-portal="${x}" data-skip="1" ${v.on ? 'checked' : ''} onchange="this.parentNode.classList.toggle('on',this.checked)">${x}</label></label><input class="f" style="flex:1;min-width:0" data-portal-url="${x}" data-skip="1" placeholder="${C.rrss.includes(x) ? 'Enlace de la publicación' : 'Enlace del anuncio'}" value="${esc(v.url || '')}">${v.fecha && v.on ? `<span class="small muted nowrap">${fdate(v.fecha)}</span>` : ''}</div>`; };
  const port = `<div class="fs"><h3>Publicación en portales</h3>${C.portales.filter(x => !C.rrss.includes(x)).map(portRow).join('')}<h3 style="margin-top:14px">Redes sociales</h3>${C.rrss.map(portRow).join('')}</div>`;
  const ficha = `
    ${section('Identificación', [F('ref', 'Referencia'), F('estado', 'Estado', 'select', { o: C.estadosInm, blank: false }), F('operacion', 'Operación', 'select', { o: C.operaciones, blank: false }), F('tipo', 'Tipo de inmueble', 'select', { o: C.tipos }), F('agente', 'Agente', 'select', { o: agentes() }), F('fecha', 'Fecha captación', 'date'), F('exclusiva', 'Exclusiva', 'select', { o: ['No', 'Sí', 'Por confirmar'] }), F('prioridad', 'Prioridad', 'select', { o: ['Alta', 'Media', 'Baja'] })], p)}
    ${section('Localización', [F('direccion', 'Dirección', 'text', { full: true }), F('zona', 'Zona / barrio'), F('municipio', 'Municipio'), F('provincia', 'Provincia'), F('cp', 'C.P.'), F('refCatastral', 'Ref. catastral', 'text', { full: true })], p)}
    ${section('Superficies y distribución', [F('m2c', 'm² construidos', 'number'), F('m2u', 'm² útiles', 'number'), F('parcela', 'm² parcela', 'number'), F('hab', 'Habitaciones', 'number'), F('banos', 'Baños', 'number'), F('planta', 'Planta'), F('extras', 'Características', 'pills', { o: C.extras })], p)}
    ${section('Económico', [F('precio', p.operacion === 'Venta' ? 'Precio (€)' : 'Renta / precio (€)', 'number', { ph: '285000' }), F('honorarios', 'Honorarios'), F('rentabilidad', 'Rentabilidad / notas inversión', 'text', { full: true })], p, `<div class="small muted" style="margin-top:8px">€/m²: <b>${p.precio && p.m2c ? eur(p.precio / p.m2c) : '—'}</b></div>`)}
    ${section('Captación', [F('captacion', 'Origen de la captación', 'select', { o: [['Propia', 'Propia (Concept Studio Homes)'], ['Colaborador', 'De colaborador']], blank: false }), F('colaboradorId', 'Colaborador', 'select', { o: colaboradores().map(c => [c.id, c.nombre]) })], p, `<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${p.colaboradorId ? `<button type="button" class="btn sm" onclick="openContacto('${p.colaboradorId}')">${ic('user')} Abrir ficha del colaborador</button>` : ''}<button type="button" class="btn sm" onclick="openContacto(null,null,{roles:['Colaborador'],estado:'Cliente',origen:'Colaborador',intent:''})">${ic('plus')} Nuevo colaborador</button></div>`)}
    ${section('Propiedad / contacto', [F('contacto', 'Nombre'), F('rol', 'Rol', 'select', { o: ['Propietario', 'Agencia', 'Intermediario', 'Colaborador'] }), F('telefono', 'Teléfono', 'tel'), F('email', 'Email', 'email')], p)}
    ${chk}${port}
    ${section('Notas', [F('notas', 'Descripción y notas', 'textarea', { full: true }), F('carpeta', 'Carpeta OneDrive', 'text', { full: true })], p)}`;
  const cruces = `<div class="fs"><h3>Contactos que buscan algo así (${ms.length})</h3>${ms.map(matchCard).join('') || '<div class="small muted">Ningún contacto de captación encaja todavía. En cuanto entre una demanda compatible aparecerá aquí y en Avisos.</div>'}</div>`;
  const visH = `<div class="fs"><h3>Visitas (${vis.length})</h3><button class="btn sm blue" style="margin-bottom:10px" onclick="openVisita(null,{inmuebleId:'${p.id}'})">${ic('plus')} Nueva visita</button>${vis.map(v => `<div class="doc" style="cursor:pointer" onclick="openVisita('${v.id}')"><div class="di" style="background:var(--purple-soft);color:var(--purple)">${ic('eye')}</div><div class="dn"><b>${esc(v.cliente || '')} ${v.firma ? '· firmado' : ''}</b><span class="small muted">${fdt(v.fecha)} · ${esc(v.estado)} · ${esc(v.interes || '')}</span></div></div>`).join('') || '<div class="small muted">Sin visitas</div>'}</div>`;
  const sh = openSheet({
    title: (isNew ? 'Nuevo inmueble · ' : '') + esc(p.ref) + (p.direccion ? ' · ' + esc(p.direccion) : ''),
    sub: `<div style="display:flex;gap:6px;padding:8px 18px;background:#fff;border-bottom:1px solid var(--line);flex-wrap:wrap;align-items:center">${tipoBadge(p.tipo)}<span class="chip" style="background:${C.inmColor[p.estado]}22;color:${C.inmColor[p.estado]}">${esc(p.estado || '')}</span>${pubChips(p)}</div>`,
    head: `${p.telefono ? `<a class="btn icon" href="tel:${esc(p.telefono)}">${ic('phone')}</a>` : ''}<button class="btn icon" title="Extraer de anuncio" onclick="openExtract('inmueble')">${ic('wand')}</button>`,
    tabs: [{ k: 'ficha', l: 'Ficha', html: `<form id="frm">${ficha}</form>` }, { k: 'cruces', l: `Cruces${ms.length ? ' · ' + ms.length : ''}`, html: cruces }, { k: 'visitas', l: `Visitas · ${vis.length}`, html: visH }, { k: 'docs', l: `Documentos · ${(p.adjuntos || []).length}`, html: docsHTML('inmueble', p.id), onMount: pn => bindDrop(pn, 'inmueble', p.id) }, { k: 'act', l: 'Actividad', html: actHTML(p.id) }],
    footer: `${!isNew ? `<button class="btn ghost danger" onclick="delRec('${p.id}','inmueble')">${ic('trash')}</button>` : ''}<button class="btn" onclick="shareInm('${p.id}')">${ic('send')} Compartir</button><button class="btn" onclick="openOperacion(null,{inmuebleId:'${p.id}',titulo:${esc(JSON.stringify((p.operacion || '') + ' ' + p.ref))},importe:${num(p.precio) || 'null'}})">${ic('pipe')} Operación</button><button class="btn pri" onclick="saveInm()">${ic('check')} Guardar</button>`
  });
  S._form = { tipo: 'inmueble', base: p, isNew };
  S._pendingSave = () => saveInm(true);
  if (tab) sh.tab(tab);
}
async function saveInm(keepOpen) {
  const { base } = S._form; const fr = $('#frm'); const o = collect(fr, base);
  o.docs = {}; $$('[data-doc]', fr).forEach(i => o.docs[i.dataset.doc] = i.checked);
  o.portales = {}; C.portales.forEach(x => { o.portales[x] = { on: $(`[data-portal="${x}"]`, fr).checked, url: $(`[data-portal-url="${x}"]`, fr).value.trim(), fecha: base.portales?.[x]?.fecha || ($(`[data-portal="${x}"]`, fr).checked ? today() : '') }; });
  if (!o.ref) return toast('La referencia es obligatoria');
  if (o.captacion !== 'Colaborador') o.colaboradorId = ''; else if (!o.colaboradorId) return toast('Elige el colaborador o marca la captación como propia');
  const prev = get(base.id);
  await save('inmueble', o);
  if (!prev) logAct(base.id, 'Inmueble dado de alta'); else { if (prev.estado !== o.estado) logAct(base.id, `Estado: ${prev.estado} → ${o.estado}`); if (num(prev.precio) !== num(o.precio)) logAct(base.id, `Precio: ${eur(prev.precio)} → ${eur(o.precio)}`); }
  S._form.base = get(base.id);
  if (!keepOpen) closeSheet();
}
function shareInm(id) {
  const p = get(id); const txt = `${p.tipo} en ${p.operacion?.toLowerCase()} · ${p.direccion || ''} ${p.zona ? '(' + p.zona + ')' : ''}\n${p.m2c ? m2(p.m2c) + ' · ' : ''}${p.hab ? p.hab + ' hab. · ' : ''}${eur(p.precio)}\nRef. ${p.ref} · Concept Studio Homes`;
  if (navigator.share) navigator.share({ title: 'Concept Studio Homes · ' + p.ref, text: txt }).catch(() => { }); else { navigator.clipboard?.writeText(txt); toast('Ficha copiada al portapapeles'); }
}
async function delRec(id, tipo) {
  const r = get(id); if (!confirm(`¿Eliminar este registro (${r?.ref || r?.nombre || r?.titulo || id})? Esta acción no se puede deshacer. Los documentos adjuntos también se borrarán.`)) return;
  const paths = (r.adjuntos || []).map(a => a.path); if (paths.length) await sb.storage.from(BUCKET).remove(paths);
  await remove(id); closeSheet(); toast('Eliminado');
}

/* ---------- CONTACTO / CAPTACIÓN ---------- */
function openContacto(id, tab, preset = {}) {
  const isNew = !id; const c = get(id) || { id: uid('con'), estado: 'Nuevo', intent: 'comprar', agente: S.me?.nombre, fechaAlta: today(), temperatura: 'Templado', roles: [], tipos: [], extras: [], adjuntos: [], ...preset };
  const ms = matchesFor(c.id); const sc = leadScore(c);
  const intentSel = `<div class="fs"><h3>¿Qué busca el contacto?</h3><div class="intent">${C.intents.map(i => `<label class="${c.intent === i.k ? 'on' : ''}"><input type="radio" name="intent" value="${i.k}" ${c.intent === i.k ? 'checked' : ''} onchange="intentChange(this)">${ic(i.ic)}${i.l}</label>`).join('')}</div></div>`;
  const dem = section('Lo que busca (demanda)', [F('tipos', 'Tipo de inmueble', 'pills', { o: C.tipos }), F('zonas', 'Zonas / barrios / municipios', 'text', { full: true, ph: 'Chamberí, Salamanca, Pozuelo…' }), F('precioMin', 'Presupuesto mín. (€)', 'number'), F('precioMax', 'Presupuesto máx. (€)', 'number'), F('m2Min', 'm² mínimos', 'number'), F('habMin', 'Habitaciones mín.', 'number'), F('banosMin', 'Baños mín.', 'number'), F('financiacion', 'Financiación', 'select', { o: C.financiacion }), F('plazo', 'Plazo', 'select', { o: C.plazos }), F('extras', 'Imprescindibles', 'pills', { o: C.extras })], c, '', `data-side="demanda" ${!isDemanda(c) ? 'style="display:none"' : ''}`);
  const apo = aportados(c.id);
  const apoH = (apo.length || esColaborador(c)) ? `<div class="fs"><h3>Inmuebles aportados como colaborador (${apo.length})</h3>${apo.map(p => `<div class="doc clk" onclick="openInmueble('${p.id}')"><div class="di">${ic('home')}</div><div class="dn"><b>${esc(p.ref)} · ${esc(p.tipo || '')}</b><span class="small muted">${esc(p.direccion || '')} · ${esc(p.estado)} · ${eur(p.precio, true)}</span></div></div>`).join('') || '<div class="small muted">Todavía no hay inmuebles enlazados a este colaborador.</div>'}</div>` : '';
  const ofe = section('Lo que ofrece (inmueble a vender / alquilar)', [F('oTipo', 'Tipo', 'select', { o: C.tipos }), F('oDireccion', 'Dirección'), F('oZona', 'Zona / barrio'), F('oMunicipio', 'Municipio'), F('oM2', 'm²', 'number'), F('oHab', 'Habitaciones', 'number'), F('oPrecio', 'Precio deseado (€)', 'number'), F('motivo', 'Motivo / urgencia'), F('oExtras', 'Características', 'pills', { o: C.extras })], c, c.inmuebleId ? `<div class="small" style="margin-top:8px">Convertido en inmueble: <a href="#" onclick="openInmueble('${c.inmuebleId}');return false">${esc(get(c.inmuebleId)?.ref || '')}</a></div>` : '', `data-side="oferta" ${isDemanda(c) ? 'style="display:none"' : ''}`);
  const ficha = `${esColaborador(c) ? apoH : ''}${intentSel}
    ${section('Datos del contacto', [F('nombre', 'Nombre y apellidos', 'text', { full: true }), F('telefono', 'Teléfono', 'tel'), F('email', 'Email', 'email'), F('empresa', 'Empresa / sociedad'), F('origen', 'Origen del lead', 'select', { o: C.origenes }), F('agente', 'Agente asignado', 'select', { o: agentes() }), F('estado', 'Estado', 'select', { o: C.leadEstados, blank: false }), F('temperatura', 'Temperatura', 'select', { o: C.temps }), F('fechaAlta', 'Fecha de alta', 'date'), F('roles', 'Perfil', 'pills', { o: C.roles })], c)}
    ${esColaborador(c) ? '' : apoH}${dem}${ofe}
    ${section('Seguimiento', [F('proximaAccion', 'Próxima acción', 'text', { ph: 'Llamar, enviar fichas, visita…' }), F('proximaFecha', 'Fecha', 'date'), F('notas', 'Notas', 'textarea', { full: true })], c)}`;
  const cruces = `<div class="fs"><h3>Inmuebles que encajan (${ms.length})</h3>${ms.map(matchCard).join('') || '<div class="small muted">Sin coincidencias en cartera con estos criterios. Prueba a ampliar zonas o presupuesto. El CRM seguirá vigilando y avisará cuando entre un inmueble compatible.</div>'}</div>`;
  const vis = list('visita').filter(v => v.contactoId === c.id);
  const sh = openSheet({
    title: isNew ? 'Nueva captación' : esc(c.nombre || 'Contacto'),
    sub: !isNew ? `<div style="display:flex;gap:6px;padding:8px 18px;background:#fff;border-bottom:1px solid var(--line);flex-wrap:wrap;align-items:center"><span class="chip" style="background:${scoreColor(sc)}1f;color:${scoreColor(sc)}">★ Score ${sc}</span><span class="chip ${isOferta(c) || esColaborador(c) ? 'p' : 'b'}">${esc(intentLabel(c))}</span><span class="chip" style="background:${C.leadColor[c.estado]}22;color:${C.leadColor[c.estado]}">${esc(c.estado)}</span>${ms.length ? `<span class="chip o">${ms.length} cruces</span>` : ''}<span style="flex:1"></span>${c.telefono ? `<a class="btn sm" href="tel:${esc(c.telefono)}">${ic('phone')}</a><a class="btn sm green" target="_blank" href="https://wa.me/${phoneDigits(c.telefono)}">${ic('wa')}</a>` : ''}${c.email ? `<a class="btn sm" href="mailto:${esc(c.email)}">${ic('mail')}</a>` : ''}</div>` : '',
    head: `<button class="btn icon" title="Extraer datos de un texto" onclick="openExtract('contacto')">${ic('wand')}</button>`,
    tabs: [{ k: 'ficha', l: 'Ficha', html: `<form id="frm">${ficha}</form>` }, { k: 'cruces', l: `Cruces${ms.length ? ' · ' + ms.length : ''}`, html: cruces }, { k: 'docs', l: `Documentos · ${(c.adjuntos || []).length}`, html: docsHTML('contacto', c.id), onMount: pn => bindDrop(pn, 'contacto', c.id) }, { k: 'act', l: `Actividad${vis.length ? ' · ' + vis.length + ' visitas' : ''}`, html: actHTML(c.id) }],
    footer: `${!isNew ? `<button class="btn ghost danger" onclick="delRec('${c.id}','contacto')">${ic('trash')}</button>` : ''}${isOferta(c) && !c.inmuebleId && !isNew ? `<button class="btn" onclick="convertToInm('${c.id}')">${ic('home')} Convertir en inmueble</button>` : ''}${!isNew ? `<button class="btn" onclick="openVisita(null,{contactoId:'${c.id}',cliente:${esc(JSON.stringify(c.nombre || ''))},telefono:${esc(JSON.stringify(c.telefono || ''))}})">${ic('cal')} Visita</button>` : ''}<button class="btn pri" onclick="saveCon()">${ic('check')} Guardar</button>`
  });
  S._form = { tipo: 'contacto', base: c, isNew }; S._pendingSave = () => saveCon(true);
  if (tab) sh.tab(tab);
}
function intentChange(inp) {
  $$('.intent label').forEach(l => l.classList.toggle('on', l.contains(inp)));
  const side = intentOf(inp.value).side;
  $$('[data-side]').forEach(s => s.style.display = s.dataset.side === side ? '' : 'none');
}
async function saveCon(keepOpen) {
  const { base } = S._form; const o = collect($('#frm'), base); o.intent = $('input[name="intent"]:checked')?.value || o.intent;
  if (!o.nombre) return toast('Indica el nombre del contacto');
  const prev = get(base.id);
  await save('contacto', o);
  if (!prev) logAct(base.id, `Captación: ${intentOf(o.intent).l} · ${o.origen || 'sin origen'}`); else if (prev.estado !== o.estado) logAct(base.id, `Estado: ${prev.estado} → ${o.estado}`);
  const nm = matchesFor(base.id).filter(m => m.estado === 'nuevo').length;
  if (nm) toast(`🔔 ${nm} inmueble(s) de la cartera encajan con ${o.nombre}`, 4000);
  S._form.base = get(base.id);
  if (!keepOpen) closeSheet();
}
async function convertToInm(cid) {
  const c = get(cid); const ref = nextRef(); const id = 'inm_' + ref;
  const p = { ref, estado: 'Captación', operacion: c.intent === 'vender' ? 'Venta' : 'Alquiler', tipo: c.oTipo, direccion: c.oDireccion, zona: c.oZona, municipio: c.oMunicipio, provincia: 'Madrid', m2c: num(c.oM2), hab: num(c.oHab), precio: num(c.oPrecio), extras: c.oExtras || [], contacto: c.nombre, rol: 'Propietario', telefono: c.telefono, email: c.email, agente: c.agente, fecha: today(), docs: {}, portales: {}, adjuntos: [], notas: [c.motivo, c.notas].filter(Boolean).join('\n'), captacionId: cid, exclusiva: 'No', prioridad: 'Media' };
  await save('inmueble', { id, ...p }, { silent: true }); c.inmuebleId = id; c.estado = c.estado === 'Nuevo' ? 'Cualificado' : c.estado; await save('contacto', c, { silent: true });
  logAct(id, 'Inmueble creado desde captación de ' + c.nombre); logAct(cid, 'Convertido en inmueble ' + ref);
  toast('Inmueble ' + ref + ' creado'); openInmueble(id);
}

/* ---------- OPERACIÓN ---------- */
function openOperacion(id, preset = {}) {
  const isNew = !id; const o = get(id) || { id: uid('ope'), estado: 'Propuesta', tipoOp: 'Venta', agente: S.me?.nombre, prob: 10, honorariosPct: 3, adjuntos: [], ...preset };
  const inms = list('inmueble').map(p => [p.id, p.ref + ' · ' + (p.tipo || '') + ' · ' + (p.direccion || '')]);
  const cons = list('contacto').map(c => [c.id, c.nombre + (c.telefono ? ' · ' + c.telefono : '')]);
  const honor = num(o.honorarios) ?? ((num(o.importe) || 0) * (num(o.honorariosPct) || 0) / 100);
  const ficha = `${section('Operación', [F('titulo', 'Título', 'text', { full: true, ph: 'Venta PV-0005 a inversor X' }), F('estado', 'Etapa', 'select', { o: C.opEstados, blank: false }), F('tipoOp', 'Tipo', 'select', { o: C.operaciones }), F('inmuebleId', 'Inmueble', 'select', { o: inms, full: true }), F('compradorId', 'Comprador / inquilino', 'select', { o: cons, full: true }), F('vendedorId', 'Vendedor / propietario', 'select', { o: cons, full: true }), F('agente', 'Agente', 'select', { o: agentes() }), F('fechaCierre', 'Cierre previsto / real', 'date')], o)}
    ${section('Económico', [F('importe', 'Importe operación (€)', 'number'), F('honorariosPct', 'Honorarios (%)', 'number'), F('honorarios', 'Honorarios (€) · vacío = automático', 'number'), F('prob', 'Probabilidad (%)', 'number')], o, `<div class="small muted" style="margin-top:8px">Honorarios calculados: <b>${eur(honor)}</b> · Ponderado: <b>${eur(honor * (num(o.prob) ?? C.opProb[o.estado]) / 100)}</b></div>`)}
    ${section('Notas', [F('motivoCaida', 'Motivo si cae'), F('notas', 'Notas', 'textarea', { full: true })], o)}`;
  openSheet({ title: isNew ? 'Nueva operación' : esc(o.titulo || 'Operación'), tabs: [{ k: 'ficha', l: 'Ficha', html: `<form id="frm">${ficha}</form>` }, { k: 'docs', l: `Documentos · ${(o.adjuntos || []).length}`, html: docsHTML('operacion', o.id), onMount: pn => bindDrop(pn, 'operacion', o.id) }, { k: 'act', l: 'Actividad', html: actHTML(o.id) }],
    footer: `${!isNew ? `<button class="btn ghost danger" onclick="delRec('${o.id}','operacion')">${ic('trash')}</button>` : ''}<button class="btn pri" onclick="saveOp()">${ic('check')} Guardar</button>` });
  S._form = { tipo: 'operacion', base: o, isNew }; S._pendingSave = () => saveOp(true);
}
async function saveOp(keepOpen) {
  const { base } = S._form; const o = collect($('#frm'), base); const prev = get(base.id);
  if (prev && prev.estado !== o.estado && num(o.prob) === num(prev.prob)) o.prob = C.opProb[o.estado];
  if (o.estado === 'Cerrada' && !o.fechaCierre) o.fechaCierre = today();
  if (!o.titulo) { const p = get(o.inmuebleId); o.titulo = (o.tipoOp || 'Operación') + (p ? ' ' + p.ref : ''); }
  await save('operacion', o);
  if (!prev) logAct(base.id, 'Operación creada · ' + o.estado); else if (prev.estado !== o.estado) logAct(base.id, `Etapa: ${prev.estado} → ${o.estado}`);
  if (o.inmuebleId && ['Arras', 'Notaría'].includes(o.estado)) { const p = get(o.inmuebleId); if (p && !['Arras / Reserva', 'Cerrado'].includes(p.estado)) { p.estado = 'Arras / Reserva'; save('inmueble', p, { silent: true }); } }
  if (o.inmuebleId && o.estado === 'Cerrada') { const p = get(o.inmuebleId); if (p && p.estado !== 'Cerrado') { p.estado = 'Cerrado'; save('inmueble', p, { silent: true }); logAct(p.id, 'Cerrado por operación ' + o.titulo); } }
  S._form.base = get(base.id); if (!keepOpen) closeSheet();
}

/* ---------- VISITA + parte firmado ---------- */
const CLAUSULA = 'El visitante declara haber conocido el inmueble indicado a través de Concept Studio Homes y se compromete a que cualquier negociación, oferta o adquisición/arrendamiento del mismo, directa o por persona interpuesta, durante los 12 meses siguientes se realice a través de Concept Studio Homes, que devengará los honorarios pactados. Información RGPD: los datos se tratan para gestionar la visita y la intermediación; puede ejercer sus derechos de acceso, rectificación y supresión escribiendo a la agencia.';
function openVisita(id, preset = {}) {
  const isNew = !id; const dt = new Date(Date.now() + 864e5); dt.setMinutes(0);
  const v = get(id) || { id: uid('vis'), estado: 'Programada', agente: S.me?.nombre, fecha: new Date(dt - dt.getTimezoneOffset() * 6e4).toISOString().slice(0, 16), adjuntos: [], ...preset };
  const inms = list('inmueble').filter(p => !['Cerrado', 'Descartado'].includes(p.estado) || p.id === v.inmuebleId).map(p => [p.id, p.ref + ' · ' + (p.tipo || '') + ' · ' + (p.direccion || '')]);
  const cons = list('contacto').map(c => [c.id, c.nombre]);
  const ficha = `${section('Visita', [F('inmuebleId', 'Inmueble', 'select', { o: inms, full: true }), F('contactoId', 'Contacto del CRM', 'select', { o: cons, full: true }), F('cliente', 'Nombre del visitante'), F('telefono', 'Teléfono', 'tel'), F('email', 'Email', 'email'), F('fecha', 'Fecha y hora', 'datetime-local'), F('estado', 'Estado', 'select', { o: C.visEstados, blank: false }), F('agente', 'Agente', 'select', { o: agentes() })], v)}
    ${section('Resultado', [F('interes', 'Interés', 'select', { o: C.intereses }), F('oferta', 'Oferta (€)', 'number'), F('feedback', 'Feedback del visitante', 'textarea', { full: true }), F('proximoPaso', 'Próximo paso'), F('fechaSeg', 'Fecha seguimiento', 'date')], v)}`;
  const parte = `<div class="fs"><h3>Parte de visita</h3>${v.firma ? `<div class="chip g" style="margin-bottom:10px">Firmado el ${fdt(v.firmadoTs)}</div><img src="${v.firma}" style="width:100%;max-width:420px;border:1px solid var(--line);border-radius:12px;background:#fff">` : ''}
    <div class="fg" style="margin-top:10px"><div class="fld"><label>DNI / NIE del visitante</label><input id="pDni" data-skip="1" value="${esc(v.dni || '')}"></div><div class="fld"><label>Acompañantes</label><input id="pAcomp" data-skip="1" value="${esc(v.acompanantes || '')}"></div></div>
    <p class="small" style="background:var(--bg);padding:12px;border-radius:12px;margin:12px 0">${esc(CLAUSULA)}</p>
    <label class="small" style="display:flex;gap:8px;align-items:center;margin-bottom:10px"><input type="checkbox" id="pOk" data-skip="1" ${v.firma ? 'checked' : ''} style="width:20px;height:20px"> El visitante acepta la cláusula de intermediación y la información RGPD</label>
    <canvas class="sig" id="sig"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn sm" onclick="sigClear()">Borrar firma</button><button class="btn sm pri" onclick="saveFirma()">${ic('check')} Guardar firma</button>${v.firma ? `<button class="btn sm" onclick="printParte('${v.id}')">${ic('print')} Imprimir / PDF</button>` : ''}</div></div>`;
  openSheet({ title: isNew ? 'Nueva visita' : 'Visita · ' + esc(v.cliente || ''), tabs: [{ k: 'ficha', l: 'Ficha', html: `<form id="frm">${ficha}</form>` }, { k: 'parte', l: v.firma ? 'Parte firmado ✓' : 'Parte de visita', html: parte, onShow: () => sigInit() }, { k: 'docs', l: `Documentos · ${(v.adjuntos || []).length}`, html: docsHTML('visita', v.id), onMount: pn => bindDrop(pn, 'visita', v.id) }],
    footer: `${!isNew ? `<button class="btn ghost danger" onclick="delRec('${v.id}','visita')">${ic('trash')}</button>` : ''}<button class="btn pri" onclick="saveVis()">${ic('check')} Guardar</button>` });
  S._form = { tipo: 'visita', base: v, isNew }; S._pendingSave = () => saveVis(true);
  const sel = $('#f_contactoId'); if (sel) sel.addEventListener('change', () => { const c = get(sel.value); if (c) { $('#f_cliente').value = c.nombre || ''; $('#f_telefono').value = c.telefono || ''; $('#f_email').value = c.email || ''; } });
}
async function saveVis(keepOpen) {
  const { base } = S._form; const o = collect($('#frm'), base); const prev = get(base.id);
  if (!o.inmuebleId && !o.cliente) return toast('Indica inmueble o visitante');
  await save('visita', o);
  const p = get(o.inmuebleId);
  if (!prev) { logAct(o.inmuebleId, `Visita ${o.estado.toLowerCase()} · ${o.cliente || ''} · ${fdt(o.fecha)}`); if (o.contactoId) logAct(o.contactoId, `Visita a ${p?.ref || ''} · ${fdt(o.fecha)}`); }
  else if (prev.estado !== o.estado) logAct(o.inmuebleId, `Visita ${o.cliente || ''}: ${prev.estado} → ${o.estado}`);
  if (o.contactoId) { const c = get(o.contactoId); if (c && ['Nuevo', 'Contactado', 'Cualificado'].includes(c.estado)) { c.estado = 'Visitando'; if (o.fechaSeg) { c.proximaFecha = o.fechaSeg; c.proximaAccion = o.proximoPaso || 'Seguimiento tras visita'; } save('contacto', c, { silent: true }); } }
  S._form.base = get(base.id); if (!keepOpen) closeSheet();
}
let SIG = null;
function sigInit() {
  const cv = $('#sig'); if (!cv || cv._init) return; cv._init = 1; const r = cv.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  cv.width = r.width * dpr; cv.height = r.height * dpr; const x = cv.getContext('2d'); x.scale(dpr, dpr); x.lineWidth = 2.4; x.lineCap = 'round'; x.strokeStyle = '#111827';
  let down = false, last = null; SIG = { cv, x, dirty: false };
  const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  cv.addEventListener('pointerdown', e => { down = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!down) return; const p = pos(e); x.beginPath(); x.moveTo(...last); x.lineTo(...p); x.stroke(); last = p; SIG.dirty = true; });
  cv.addEventListener('pointerup', () => down = false);
}
function sigClear() { if (SIG) { SIG.x.clearRect(0, 0, SIG.cv.width, SIG.cv.height); SIG.dirty = false; } }
async function saveFirma() {
  if (!$('#pOk').checked) return toast('El visitante debe aceptar la cláusula');
  if (!SIG || !SIG.dirty) return toast('Falta la firma');
  if (!S.recs.has(S._form.base.id)) await saveVis(true);
  const v = get(S._form.base.id); v.firma = SIG.cv.toDataURL('image/png'); v.firmadoTs = nowIso(); v.dni = $('#pDni').value.trim(); v.acompanantes = $('#pAcomp').value.trim(); v.clausula = CLAUSULA; v.dispositivo = navigator.userAgent.slice(0, 120);
  if (v.estado === 'Programada') v.estado = 'Realizada';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v.firma + v.firmadoTs + (v.cliente || '') + v.dni)); v.huella = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  await save('visita', v); logAct(v.inmuebleId, 'Parte de visita firmado · ' + (v.cliente || '')); toast('Parte firmado y guardado'); openVisita(v.id);
}
function printParte(id) {
  const v = get(id), p = get(v.inmuebleId) || {}; const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Parte de visita ${esc(p.ref || '')}</title><style>body{font-family:Arial;padding:30px;color:#111;max-width:760px;margin:auto}h1{font-size:18px}td{padding:6px 10px;border-bottom:1px solid #ddd}p{font-size:12px;line-height:1.5}</style></head><body><img src="${ASSET}logo.png" style="width:220px"><h1>PARTE DE VISITA</h1><table><tr><td>Inmueble</td><td><b>${esc(p.ref || '')}</b> · ${esc(p.tipo || '')} · ${esc(p.direccion || '')}</td></tr><tr><td>Visitante</td><td>${esc(v.cliente || '')} · DNI/NIE ${esc(v.dni || '')}</td></tr><tr><td>Contacto</td><td>${esc(v.telefono || '')} ${esc(v.email || '')}</td></tr><tr><td>Acompañantes</td><td>${esc(v.acompanantes || '')}</td></tr><tr><td>Fecha visita</td><td>${fdt(v.fecha)}</td></tr><tr><td>Agente</td><td>${esc(v.agente || '')}</td></tr></table><p>${esc(v.clausula || CLAUSULA)}</p><p><b>Firma del visitante</b> (${fdt(v.firmadoTs)})</p><img src="${v.firma}" style="width:320px;border:1px solid #ccc"><p style="font-size:10px;color:#666">Huella SHA-256: ${esc(v.huella || '')}</p><script>setTimeout(()=>print(),400)<\/script></body></html>`); w.document.close();
}

/* ---------- TAREA ---------- */
function openTarea(id, preset = {}) {
  const isNew = !id; const t = get(id) || { id: uid('tar'), fecha: today(), agente: S.me?.nombre, hecha: false, ...preset };
  openSheet({ title: isNew ? 'Nueva tarea' : esc(t.titulo), tabs: [{ k: 'f', l: 'Tarea', html: `<form id="frm">${section('Tarea', [F('titulo', 'Qué hay que hacer', 'text', { full: true }), F('fecha', 'Fecha', 'date'), F('hora', 'Hora', 'time'), F('agente', 'Responsable', 'select', { o: agentes() }), F('notas', 'Notas', 'textarea', { full: true })], t)}<label class="fs" style="display:flex;gap:10px;align-items:center"><input type="checkbox" name="hecha" ${t.hecha ? 'checked' : ''} style="width:20px;height:20px"> Hecha</label></form>` }],
    footer: `${!isNew ? `<button class="btn ghost danger" onclick="delRec('${t.id}','tarea')">${ic('trash')}</button>` : ''}<button class="btn pri" onclick="saveTarea()">${ic('check')} Guardar</button>` });
  S._form = { tipo: 'tarea', base: t, isNew };
}
async function saveTarea() { const o = collect($('#frm'), S._form.base); if (!o.titulo) return toast('Escribe la tarea'); await save('tarea', o); closeSheet(); }

/* ---------- EXTRAER DATOS ---------- */
function openExtract(target) {
  const d = document.createElement('div'); d.className = 'overlay'; d.id = 'extract'; d.style.cssText = 'justify-content:center;align-items:center;padding:16px;z-index:70';
  d.innerHTML = `<div class="card pad" style="width:min(620px,100%);max-height:90vh;overflow:auto"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="flex:1">${ic('wand').replace('<svg', '<svg width="20" height="20" style="vertical-align:-4px;color:var(--orange)"')} Extraer datos</h2><button class="btn icon ghost" onclick="$('#extract').remove()">${ic('x')}</button></div>
  <p class="small muted" style="margin-top:0">Pega un anuncio de Idealista/Fotocasa, un email, un WhatsApp o tus notas de una llamada. El CRM detecta teléfono, email, precio, m², habitaciones, tipo, operación y zona.</p>
  <div class="fld"><textarea id="exTxt" style="min-height:150px" placeholder="Ej.: Hola, soy Laura Gómez, busco piso para comprar en Chamberí, 3 habitaciones, unos 90 m², hasta 650.000 €. Tengo hipoteca preaprobada. 612 345 678"></textarea></div>
  <div id="exOut" style="margin:10px 0"></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button class="btn" onclick="runExtract()">Analizar</button>${target === 'contacto' || target === 'inmueble' ? `<button class="btn pri" onclick="applyExtract('${target}')">Rellenar ficha abierta</button>` : `<button class="btn blue" onclick="applyExtract('newinm')">Crear inmueble</button><button class="btn pri" onclick="applyExtract('newcon')">Crear captación</button>`}</div></div>`;
  d.addEventListener('click', e => { if (e.target === d) d.remove(); }); document.body.appendChild(d); $('#exTxt').focus();
}
function runExtract() {
  const r = extractData($('#exTxt').value); S._ex = r;
  const lab = { nombre: 'Nombre', telefono: 'Teléfono', email: 'Email', intent: 'Intención', tipo: 'Tipo', zona: 'Zona', precio: 'Precio', m2: 'm²', hab: 'Hab.', banos: 'Baños', extras: 'Extras', origen: 'Origen' };
  $('#exOut').innerHTML = Object.keys(r).length ? `<div class="pills">${Object.entries(r).map(([k, v]) => `<span class="chip o">${lab[k] || k}: ${esc(k === 'precio' ? eur(v) : k === 'intent' ? intentOf(v).l : Array.isArray(v) ? v.join(', ') : v)}</span>`).join('')}</div>` : '<span class="small muted">No he detectado datos. Revisa el texto.</span>';
  return r;
}
function applyExtract(target) {
  const r = S._ex || runExtract(); const txt = $('#exTxt').value.trim(); if (!Object.keys(r).length && !txt) return;
  const demanda = !['vender', 'arrendar'].includes(r.intent);
  const con = { nombre: r.nombre, telefono: r.telefono, email: r.email, intent: r.intent || 'comprar', origen: r.origen, notas: txt };
  if (demanda) Object.assign(con, { tipos: r.tipo ? [r.tipo] : [], zonas: r.zona, precioMax: r.precio, m2Min: r.m2, habMin: r.hab, banosMin: r.banos, extras: r.extras || [] });
  else Object.assign(con, { oTipo: r.tipo, oZona: r.zona, oPrecio: r.precio, oM2: r.m2, oHab: r.hab, oExtras: r.extras || [] });
  const inm = { tipo: r.tipo, zona: r.zona, precio: r.precio, m2c: r.m2, hab: r.hab, banos: r.banos, extras: r.extras || [], telefono: r.telefono, email: r.email, contacto: r.nombre, operacion: /alquil|arrend/.test(r.intent || '') ? 'Alquiler' : 'Venta', notas: txt };
  $('#extract').remove();
  if (target === 'newcon') return openContacto(null, null, Object.fromEntries(Object.entries(con).filter(([, v]) => v != null && v !== '')));
  if (target === 'newinm') return openInmueble(null, null, Object.fromEntries(Object.entries(inm).filter(([, v]) => v != null && v !== '')));
  const src = target === 'contacto' ? con : inm; const fr = $('#frm'); if (!fr) return;
  for (const [k, v] of Object.entries(src)) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    if (Array.isArray(v)) { $$(`.pills input[name="${k}"]`, fr).forEach(i => { if (v.includes(i.value)) { i.checked = true; i.parentNode.classList.add('on'); } }); continue; }
    if (k === 'intent') { const i = $(`input[name="intent"][value="${v}"]`, fr); if (i) { i.checked = true; intentChange(i); } continue; }
    const el = $(`[name="${k}"]`, fr); if (el && (!el.value || k === 'notas')) el.value = k === 'notas' && el.value ? el.value + '\n' + v : v;
  }
  toast('Datos aplicados · revisa y guarda');
}

/* ---------- AUTENTICACIÓN Y ARRANQUE ---------- */
let loginMode = 'in';
function showLogin(msg) {
  $('#app').classList.add('hidden'); $('#login').classList.remove('hidden');
  if (msg) $('#loginMsg').innerHTML = msg;
}
$$('#login .tabs button').forEach(b => b.onclick = () => {
  loginMode = b.dataset.m; $$('#login .tabs button').forEach(x => x.classList.toggle('on', x === b));
  $('#pwFld').classList.toggle('hidden', loginMode === 're'); $('#loginBtn').textContent = { in: 'Entrar', up: 'Crear mi acceso', re: 'Enviar enlace de recuperación' }[loginMode];
  $('#loginMsg').textContent = '';
});
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const fd = new FormData(e.target); const email = fd.get('email').trim().toLowerCase(), password = fd.get('password');
  const msg = $('#loginMsg'); msg.style.color = 'var(--muted)'; msg.textContent = 'Un momento…';
  const redirect = location.origin + location.pathname;
  let r;
  if (loginMode === 'in') r = await sb.auth.signInWithPassword({ email, password });
  else if (loginMode === 'up') { if (!password || password.length < 6) { msg.textContent = 'La contraseña debe tener al menos 6 caracteres'; return; } r = await sb.auth.signUp({ email, password, options: { emailRedirectTo: redirect } }); if (!r.error && !r.data.session) { msg.style.color = 'var(--green)'; msg.textContent = 'Acceso creado. Revisa tu email para confirmarlo y vuelve a entrar.'; return; } }
  else { r = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirect }); if (!r.error) { msg.style.color = 'var(--green)'; msg.textContent = 'Te hemos enviado un enlace para crear una nueva contraseña.'; return; } }
  if (r.error) { msg.style.color = 'var(--red)'; const em = r.error.message || '', code = r.error.code || '';
    msg.textContent = em === 'Invalid login credentials' ? 'Email o contraseña incorrectos'
      : (code === 'over_email_send_rate_limit' || /rate limit/i.test(em)) ? 'Se ha alcanzado el límite de emails por hora del servidor. Espera 1 hora e inténtalo UNA sola vez (cada intento reinicia la espera).'
      : (code === 'email_address_invalid' || /is invalid/i.test(em)) ? 'Ese email no es válido. Revisa que esté bien escrito (p. ej. @conceptstudiohomes.com).'
      : /Email not confirmed/i.test(em) ? 'Tu email aún no está confirmado: abre el enlace que te llegó por correo.'
      : /already registered/i.test(em) ? 'Ese email ya tiene acceso: usa la pestaña Entrar.'
      : em; }
});
async function logout() { await sb.auth.signOut(); S.user = null; S.recs.clear(); try { localStorage.removeItem('csh_cache'); } catch (e) { } location.reload(); }

async function start(session) {
  if (S.user && S.user.id === session.user.id) return;
  S.user = session.user;
  try { S.equipo = JSON.parse(localStorage.getItem('csh_equipo') || '[]'); } catch (e) { }
  cacheLoad();
  $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
  const p = new URLSearchParams(location.search); if (p.get('go')) S.view = p.get('go');
  S.me = S.equipo.find(m => (m.email || '').toLowerCase() === S.user.email.toLowerCase()) || null;
  render();
  if (S.online) { await flushQueue(); await loadAll(); }
  S.me = S.equipo.find(m => (m.email || '').toLowerCase() === S.user.email.toLowerCase()) || null;
  if (!S.me && S.online) { $('#app').classList.add('hidden'); showLogin(`<span style="color:var(--red)">El email <b>${esc(S.user.email)}</b> no está autorizado en el equipo de Concept Studio Homes.</span><br><a href="#" onclick="logout();return false">Cerrar sesión</a>`); return; }
  render(); subscribeRealtime();
  if (p.get('new') === '1' && S.view === 'captacion') openContacto(null);
}

document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  if (e.target.closest('[data-more]')) { openMore(); return; }
  if (e.target.closest('[data-logout]')) { logout(); return; }
  if (e.target.closest('#mobBell')) { go('avisos'); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if ($('#extract')) $('#extract').remove(); else if ($('#sheet')) closeSheet(); else closeMore(); } });

(async function init() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
  const hp = new URLSearchParams((location.hash || '').replace(/^#/, '') || location.search);
  const hashErr = hp.get('error_description') || hp.get('error');
  const { data: { session } } = await sb.auth.getSession();
  if (location.hash && /access_token|error/.test(location.hash)) history.replaceState(null, '', location.pathname);
  if (session) start(session);
  else if (hashErr) showLogin(`<span style="color:var(--orange-dk)">${/expired|invalid|not found/i.test(hashErr) ? 'Ese enlace ya se ha usado o ha caducado. Si ya confirmaste tu email, entra directamente con tu email y contraseña.' : esc(hashErr)}</span>`);
  else showLogin();
  sb.auth.onAuthStateChange((ev, s) => { if (ev === 'PASSWORD_RECOVERY') { const np = prompt('Escribe tu nueva contraseña (mín. 6 caracteres)'); if (np) sb.auth.updateUser({ password: np }).then(r => toast(r.error ? r.error.message : 'Contraseña actualizada')); } if (s && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION')) start(s); });
})();
