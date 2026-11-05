/* Concept Studio Homes · CRM v3 — vistas */
'use strict';
const IC = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  magnet: '<path d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15"/><path d="m5 8 4 4"/><path d="m12 15 4 4"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  pipe: '<path d="M6 3v12"/><path d="M12 3v18"/><path d="M18 3v8"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  team: '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="18" cy="16" r="3"/><path d="M18 11v2m0 6v2m5-5h-2m-6 0h-2"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>', phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  wa: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', check: '<path d="M20 6 9 17l-5-5"/>',
  snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/>', file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  euro: '<path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>', alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  okc: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  tag: '<path d="M12 2H2v10l9.3 9.3a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7" cy="7" r="1.5"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>', clip: '<path d="m21.4 11-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.6-8.6a3.7 3.7 0 0 1 5.2 5.2l-8.6 8.6a1.8 1.8 0 0 1-2.6-2.6l7.9-7.9"/>',
  wand: '<path d="m15 4-1-1M20 9l1 1M15 9l-12 12M17 2v2M22 7h-2M17 12v-2M12 7h2"/>', dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  up: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>', logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>', star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>', print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[n] || ''}</svg>`;

const VIEWS = [
  { k: 'dashboard', l: 'Dashboard', ic: 'grid' },
  { k: 'avisos', l: 'Avisos y cruces', short: 'Avisos', ic: 'bell' },
  { k: 'captacion', l: 'Captación', ic: 'magnet' },
  { k: 'inmuebles', l: 'Inmuebles', ic: 'home' },
  { k: 'clientes', l: 'Clientes CRM', short: 'Clientes', ic: 'users' },
  { k: 'pipeline', l: 'Pipeline operaciones', short: 'Pipeline', ic: 'pipe' },
  { k: 'visitas', l: 'Visitas y agenda', short: 'Agenda', ic: 'cal' },
  { k: 'equipo', l: 'Equipo', ic: 'team' },
  { k: 'datos', l: 'Datos', ic: 'db' }
];
const TAB_MAIN = ['dashboard', 'captacion', 'inmuebles', 'avisos'];

function counts() {
  const m = S._matches || []; const sys = S._sys || [];
  return {
    avisos: m.filter(x => x.estado === 'nuevo').length + sys.filter(a => a.lvl === 'bad').length,
    captacion: list('contacto').filter(c => c.estado === 'Nuevo').length,
    inmuebles: list('inmueble').filter(p => !['Cerrado', 'Descartado'].includes(p.estado)).length,
    clientes: list('contacto').filter(c => c.estado !== 'Perdido').length,
    pipeline: list('operacion').filter(o => !['Cerrada', 'Caída'].includes(o.estado)).length,
    visitas: list('visita').filter(v => v.estado === 'Programada' && (v.fecha || '').slice(0, 10) >= today()).length
  };
}
function renderChrome() {
  S._matches = computeMatches(); S._sys = systemAlerts();
  const n = counts();
  const badge = k => n[k] ? `<span class="badge ${k === 'avisos' || k === 'captacion' ? 'hot' : ''}">${n[k]}</span>` : '';
  $('#nav').innerHTML = VIEWS.map(v => `<button data-go="${v.k}" class="${S.view === v.k ? 'on' : ''}">${ic(v.ic)}<span>${v.l}</span>${badge(v.k)}</button>`).join('');
  $('#tabbar').innerHTML = TAB_MAIN.map(k => VIEWS.find(v => v.k === k)).map(v => `<button data-go="${v.k}" class="${S.view === v.k ? 'on' : ''}">${ic(v.ic)}<span>${v.short || v.l}</span>${n[v.k] && (v.k === 'avisos' || v.k === 'captacion') ? `<span class="badge hot">${n[v.k]}</span>` : ''}</button>`).join('') +
    `<button data-more="1" class="${TAB_MAIN.includes(S.view) ? '' : 'on'}">${ic('more')}<span>Más</span></button>`;
  $('#mobBell').innerHTML = ic('bell') + (n.avisos ? `<span class="badge hot">${n.avisos}</span>` : '');
  const me = S.me || {};
  $('#sideUser').innerHTML = `<div class="av" style="background:${me.color || '#ff7440'}">${esc(me.iniciales || 'U')}</div><div class="who"><b>${esc(me.nombre || S.user?.email || '')}</b><span>${esc(me.rol || '')}</span></div><button class="btn icon ghost" style="color:#8a97ab" data-logout title="Salir">${ic('logout')}</button>`;
  setSync(S.sync);
}
function go(v) { S.view = v; closeMore(); window.scrollTo(0, 0); render(); try { history.replaceState(null, '', '?go=' + v); } catch (e) { } }

function render() {
  if (!S.user) return;
  renderChrome();
  const V = VIEWS.find(v => v.k === S.view) || VIEWS[0];
  $('#pageTitle').textContent = V.l; $('#mobTitle').textContent = V.short || V.l;
  const fabMap = { captacion: () => openContacto(null), clientes: () => openContacto(null), inmuebles: () => openInmueble(null), pipeline: () => openOperacion(null), visitas: () => openVisita(null), dashboard: () => quickAdd(), avisos: () => quickAdd() };
  const fab = $('#fab'); fab.innerHTML = ic('plus'); fab.onclick = fabMap[S.view] || quickAdd; fab.classList.toggle('hidden', !fabMap[S.view]);
  $('#pageActions').innerHTML = ''; const el = $('#view');
  ({ dashboard: vDashboard, avisos: vAvisos, captacion: vCaptacion, inmuebles: vInmuebles, clientes: vClientes, pipeline: vPipeline, visitas: vVisitas, equipo: vEquipo, datos: vDatos }[S.view] || vDashboard)(el);
}
function actions(html) { $('#pageActions').innerHTML = html; }

/* ---------- DASHBOARD ---------- */
function vDashboard(el) {
  actions(`<button class="btn" onclick="openExtract()">${ic('wand')} Extraer datos</button><button class="btn pri" onclick="openContacto(null)">${ic('plus')} Nueva captación</button>`);
  const cs = list('contacto'), ps = list('inmueble'), os = list('operacion'), vs = list('visita');
  const mo = today().slice(0, 7);
  const enCurso = os.filter(o => !['Cerrada', 'Caída'].includes(o.estado));
  const honor = o => num(o.honorarios) ?? ((num(o.importe) || 0) * (num(o.honorariosPct) || 0) / 100);
  const cerradasMes = os.filter(o => o.estado === 'Cerrada' && (o.fechaCierre || '').slice(0, 7) === mo);
  const cerradas = os.filter(o => o.estado === 'Cerrada'); const caidas = os.filter(o => o.estado === 'Caída');
  const conv = cerradas.length + caidas.length ? Math.round(cerradas.length / (cerradas.length + caidas.length) * 100) : 0;
  const prevPond = enCurso.reduce((a, o) => a + honor(o) * (num(o.prob) ?? C.opProb[o.estado] ?? 0) / 100, 0);
  const activos = ps.filter(p => !['Cerrado', 'Descartado'].includes(p.estado));
  const wk = new Date(); const wEnd = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const vSem = visitasSemana();
  const nuevos = (S._matches || []).filter(m => m.estado === 'nuevo');
  const hr = new Date().getHours(); const saludo = hr < 14 ? 'Buenos días' : hr < 21 ? 'Buenas tardes' : 'Buenas noches';
  const kpi = (c, l, icn, v, ft, goto) => `<div class="kpi c-${c}" onclick="go('${goto}')"><div class="lbl">${l}<span class="ico">${ic(icn)}</span></div><div class="val">${v}</div><div class="ft">${ft}</div></div>`;

  const leadSt = C.leadEstados.map(s => ({ s, n: cs.filter(c => c.estado === s).length }));
  const opSt = C.opEstados.map(s => ({ s, n: os.filter(o => o.estado === s).length, v: os.filter(o => o.estado === s).reduce((a, o) => a + honor(o), 0) }));
  const porTipo = {}; activos.forEach(p => { porTipo[p.tipo || 'Otro'] = (porTipo[p.tipo || 'Otro'] || 0) + 1; });
  const tipoArr = Object.entries(porTipo).sort((a, b) => b[1] - a[1]); const maxT = Math.max(1, ...tipoArr.map(x => x[1]));
  const porOrigen = {}; cs.forEach(c => { const o = c.origen || 'Sin origen'; porOrigen[o] = (porOrigen[o] || 0) + 1; });
  const oriArr = Object.entries(porOrigen).sort((a, b) => b[1] - a[1]);
  const hoy = agendaItems(0);

  el.innerHTML = `
  <div class="hero">
    <div class="hi">${saludo}, ${esc((S.me?.nombre || '').split(' ')[0] || '')} · ${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
    <h1>Concept Studio Homes</h1>
    <div class="hero-stats">
      <div><b>${eur(activos.reduce((a, p) => a + (num(p.precio) || 0), 0), true)}</b><span>Valor de cartera activa</span></div>
      <div><b>${eur(prevPond, true)}</b><span>Previsión ponderada de honorarios</span></div>
      <div><b>${nuevos.length}</b><span>Cruces nuevos para trabajar</span></div>
      <div><b>${hoy.length}</b><span>Pendientes hoy</span></div>
    </div>
    <div class="hero-act"><button class="btn" onclick="go('avisos')">${ic('bell')} Ver avisos</button><button class="btn pri" onclick="openContacto(null)">${ic('plus')} Captación</button></div>
  </div>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('solid', 'Contactos CRM', 'users', cs.filter(c => c.estado !== 'Perdido').length, cs.filter(c => c.estado === 'Nuevo').length + ' nuevos en captación', 'clientes')}
    ${kpi('dark', 'Operaciones en curso', 'pipe', enCurso.length, eur(enCurso.reduce((a, o) => a + honor(o), 0), true) + ' honorarios previstos', 'pipeline')}
    ${kpi('hot', 'Cierres del mes', 'okc', cerradasMes.length, eur(cerradasMes.reduce((a, o) => a + honor(o), 0)) + ' cobrados', 'pipeline')}
    ${kpi('dark', 'Operaciones caídas', 'alert', caidas.length, eur(caidas.reduce((a, o) => a + honor(o), 0)) + ' perdidos', 'pipeline')}
    ${kpi('hot', 'Cruces nuevos', 'magnet', nuevos.length, (S._matches || []).length + ' cruces activos', 'avisos')}
    ${kpi('dark', semana().proxima ? 'Visitas próx. semana' : 'Visitas esta semana', 'eye', vSem.total, vSem.prog + ' programadas · ' + vSem.hechas + ' realizadas', 'visitas')}
    ${kpi('orange', 'Tasa de conversión', 'trend', conv + '%', cerradas.length + ' cerradas · ' + caidas.length + ' caídas', 'pipeline')}
    ${kpi('solid', 'Honorario medio', 'euro', cerradas.length ? eur(cerradas.reduce((a, o) => a + honor(o), 0) / cerradas.length) : '—', activos.length + ' inmuebles activos', 'inmuebles')}
  </div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><div class="card-h"><h2>Embudo de captación</h2><button class="btn sm ghost" onclick="go('captacion')">Ver</button></div>
      <div class="funnel">${leadSt.filter(x => x.s !== 'Perdido').map(x => `<div class="st" style="background:linear-gradient(160deg,${C.leadColor[x.s]},${C.leadColor[x.s]}cc)"><b>${x.n}</b><span>${x.s}</span></div>`).join('')}</div></div>
    <div class="card"><div class="card-h"><h2>Pipeline de operaciones</h2><button class="btn sm ghost" onclick="go('pipeline')">Ver</button></div>
      <div class="funnel">${opSt.filter(x => x.s !== 'Caída').map(x => `<div class="st" style="background:linear-gradient(160deg,${C.opColor[x.s]},${C.opColor[x.s]}cc)"><b>${x.n}</b><span>${x.s}</span><small>${eur(x.v, true)}</small></div>`).join('')}</div></div>
  </div>
  <div class="grid g3" style="margin-bottom:16px">
    <div class="card"><div class="card-h"><h2>Hoy</h2><span class="chip o">${hoy.length}</span></div>
      ${hoy.length ? hoy.slice(0, 7).map(agendaRow).join('') : `<div class="empty">${ic('okc')}Nada pendiente para hoy</div>`}</div>
    <div class="card"><div class="card-h"><h2>Cartera por tipo</h2></div>
      <div class="bars">${tipoArr.length ? tipoArr.map(([t, n], i) => `<div class="bar-row"><span>${esc(t)}</span><div class="tr"><div class="fl" style="width:${n / maxT * 100}%;background:${C.palette[i % 12]}"></div></div><span class="v">${n}</span></div>`).join('') : '<div class="empty">Sin inmuebles</div>'}</div></div>
    <div class="card"><div class="card-h"><h2>Origen de contactos</h2></div>${donut(oriArr)}</div>
  </div>
  <div class="grid g2">
    <div class="card"><div class="card-h"><h2>Mejores cruces</h2><button class="btn sm ghost" onclick="go('avisos')">Todos</button></div>
      ${(S._matches || []).slice(0, 4).map(m => `<div class="today-item" style="cursor:pointer" onclick="openContacto('${m.c.id}','cruces')"><div class="av" style="background:${scoreColor(m.score)}">${m.score}</div><div style="flex:1;min-width:0"><b style="color:var(--ink)">${esc(m.c.nombre)}</b><div class="small muted">${esc(intentOf(m.c.intent).l)} → ${esc(m.p.ref)} · ${esc(m.p.tipo)} · ${eur(m.p.precio, true)}</div></div>${m.estado === 'nuevo' ? '<span class="chip o">Nuevo</span>' : ''}</div>`).join('') || `<div class="empty">${ic('magnet')}Da de alta demandas en Captación y el CRM cruzará solo con tu cartera.</div>`}</div>
    <div class="card"><div class="card-h"><h2>Visitas de la semana</h2><button class="btn sm ghost" onclick="go('visitas')">Agenda</button></div>${teamRows()}</div>
  </div>`;
}
function donut(arr) {
  const tot = arr.reduce((a, x) => a + x[1], 0); if (!tot) return '<div class="empty">Sin contactos todavía</div>';
  let acc = 0; const R = 42, Cc = 2 * Math.PI * R;
  const segs = arr.map(([k, v], i) => { const l = v / tot * Cc; const s = `<circle r="${R}" cx="60" cy="60" fill="none" stroke="${C.palette[i % 12]}" stroke-width="18" stroke-dasharray="${l} ${Cc - l}" stroke-dashoffset="${-acc}" transform="rotate(-90 60 60)"/>`; acc += l; return s; }).join('');
  return `<div class="donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120">${segs}<text x="60" y="58" text-anchor="middle" font-family="Unbounded" font-size="20" font-weight="500" fill="#111827">${tot}</text><text x="60" y="76" text-anchor="middle" font-size="10" fill="#6b7280">contactos</text></svg><div class="legend">${arr.slice(0, 7).map(([k, v], i) => `<span><i style="background:${C.palette[i % 12]}"></i>${esc(k)} · <b>${v}</b></span>`).join('')}</div></div>`;
}
/* semana de trabajo: lunes a domingo; el domingo ya se muestra la semana siguiente */
function semana() {
  const d = new Date(); d.setHours(0, 0, 0, 0); const dow = d.getDay();
  const ini = new Date(d); ini.setDate(d.getDate() + (dow === 0 ? 1 : 1 - dow));
  const fin = new Date(ini); fin.setDate(ini.getDate() + 6);
  const iso = x => new Date(x - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const lab = x => x.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return { ini: iso(ini), fin: iso(fin), label: lab(ini) + ' – ' + lab(fin), proxima: dow === 0 };
}
function visitasSemana(agente) {
  const w = semana();
  const vs = list('visita').filter(v => { const d = (v.fecha || '').slice(0, 10); return d >= w.ini && d <= w.fin && (!agente || v.agente === agente); });
  return { prog: vs.filter(v => v.estado === 'Programada').length, hechas: vs.filter(v => v.estado === 'Realizada').length, total: vs.filter(v => v.estado !== 'Cancelada').length, lista: vs.filter(v => v.estado === 'Programada').sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '')) };
}
function teamRows() {
  const w = semana();
  const filas = S.equipo.map(m => { const st = visitasSemana(m.nombre); const pct = st.total ? Math.round(st.hechas / st.total * 100) : 0;
    return `<div class="today-item"><div class="av" style="background:${m.color}">${esc(m.iniciales)}</div><div style="flex:1;min-width:0"><b style="color:var(--ink)">${esc(m.nombre)}</b><div class="small muted">${st.prog} programadas · ${st.hechas} realizadas</div><div style="height:6px;background:#efefef;border-radius:9px;margin-top:6px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--orange)"></div></div></div><span class="num" style="font-size:20px;color:var(--ink)">${st.total}</span></div>`; }).join('');
  const t = visitasSemana();
  const prox = t.lista.slice(0, 5).map(v => { const p = get(v.inmuebleId); return `<div class="today-item" style="cursor:pointer" onclick="openVisita('${v.id}')"><span class="tm">${new Date(v.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })} ${ftime(v.fecha)}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink)">${esc(v.cliente || 'Visita')} · ${esc(p?.ref || '')}</span><span class="small muted">${esc(initials(v.agente))}</span></div>`; }).join('');
  return `<div class="small muted" style="padding:0 18px 8px">${w.proxima ? 'Próxima semana · ' : 'Semana · '}${w.label} · ${t.prog} programadas</div>${filas}${prox ? '<div class="small muted" style="padding:10px 18px 2px;font-weight:500">Agenda de visitas</div>' + prox : '<div class="empty small">Sin visitas programadas esta semana</div>'}`;
}
function memberStats(nombre) {
  const honor = o => num(o.honorarios) ?? ((num(o.importe) || 0) * (num(o.honorariosPct) || 0) / 100);
  return { cap: list('contacto').filter(c => c.agente === nombre).length, inm: list('inmueble').filter(p => p.agente === nombre).length, vis: list('visita').filter(v => v.agente === nombre).length, ops: list('operacion').filter(o => o.agente === nombre && !['Caída'].includes(o.estado)).length, hon: list('operacion').filter(o => o.agente === nombre && o.estado === 'Cerrada').reduce((a, o) => a + honor(o), 0) };
}

/* ---------- AGENDA helpers ---------- */
function agendaItems(days) {
  const t = today(), end = new Date(Date.now() + days * 864e5).toISOString().slice(0, 10); const out = [];
  list('visita').forEach(v => { const d = (v.fecha || '').slice(0, 10); if (v.estado === 'Programada' && d >= t && d <= end) out.push({ d: v.fecha, k: 'Visita', c: '#212934', t: (v.cliente || 'Visita') + ' · ' + (get(v.inmuebleId)?.ref || ''), open: `openVisita('${v.id}')` }); });
  list('tarea').forEach(x => { if (!x.hecha && x.fecha && x.fecha <= end) out.push({ d: x.fecha + (x.hora ? 'T' + x.hora : ''), k: x.fecha < t ? 'Vencida' : 'Tarea', c: x.fecha < t ? '#e2582a' : '#444444', t: x.titulo, open: `openTarea('${x.id}')` }); });
  list('contacto').forEach(c => { if (c.proximaFecha && c.proximaFecha <= end && !['Perdido', 'Cliente'].includes(c.estado)) out.push({ d: c.proximaFecha, k: c.proximaFecha < t ? 'Vencido' : 'Seguimiento', c: c.proximaFecha < t ? '#e2582a' : '#ff7440', t: (c.proximaAccion || 'Seguimiento') + ' · ' + (c.nombre || ''), open: `openContacto('${c.id}')` }); });
  return out.sort((a, b) => (a.d || '').localeCompare(b.d || ''));
}
const agendaRow = a => `<div class="today-item" style="cursor:pointer" onclick="${a.open}"><span class="tm">${a.d && a.d.length > 10 ? ftime(a.d) : fdate(a.d)}</span><span class="chip" style="background:${a.c}1a;color:${a.c}">${a.k}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink);font-weight:500">${esc(a.t)}</span></div>`;

/* ---------- AVISOS ---------- */
function vAvisos(el) {
  const f = S.ui.avf || 'nuevo';
  const ms = S._matches || [], sys = S._sys || [];
  const shown = ms.filter(m => f === 'todos' ? m.estado !== 'descartado' : f === 'nuevo' ? m.estado === 'nuevo' : m.estado === f);
  actions(`<button class="btn" onclick="render()">${ic('trend')} Recalcular cruces</button>`);
  el.innerHTML = `
  <div class="grid g4" style="margin-bottom:14px">
    <div class="kpi c-hot" onclick="S.ui.avf='nuevo';render()"><div class="lbl">Cruces nuevos<span class="ico">${ic('magnet')}</span></div><div class="val">${ms.filter(m => m.estado === 'nuevo').length}</div><div class="ft">Demanda ↔ cartera</div></div>
    <div class="kpi c-solid" onclick="S.ui.avf='contactado';render()"><div class="lbl">Trabajados<span class="ico">${ic('send')}</span></div><div class="val">${ms.filter(m => m.estado === 'contactado').length}</div><div class="ft">Ya ofrecidos al cliente</div></div>
    <div class="kpi c-orange"><div class="lbl">Urgentes<span class="ico">${ic('alert')}</span></div><div class="val">${sys.filter(a => a.lvl === 'bad').length}</div><div class="ft">Vencidos y caducados</div></div>
    <div class="kpi c-dark"><div class="lbl">Atención<span class="ico">${ic('clock')}</span></div><div class="val">${sys.filter(a => a.lvl !== 'bad').length}</div><div class="ft">Hoy, fríos y documentación</div></div>
  </div>
  <div class="grid g2">
    <div>
      <div class="toolbar"><h2 style="flex:1">Cruces automáticos</h2><div class="seg">${['nuevo', 'contactado', 'todos', 'descartado'].map(k => `<button class="${f === k ? 'on' : ''}" onclick="S.ui.avf='${k}';render()">${{ nuevo: 'Nuevos', contactado: 'Trabajados', todos: 'Todos', descartado: 'Descartados' }[k]}</button>`).join('')}</div></div>
      ${shown.map(matchCard).join('') || `<div class="card empty">${ic('magnet')}${ms.length ? 'No hay cruces en este filtro.' : 'Sin cruces todavía. Da de alta lo que busca cada contacto en Captación (tipo, zona, presupuesto) y el CRM avisará aquí en cuanto haya un inmueble compatible.'}</div>`}
    </div>
    <div>
      <div class="toolbar"><h2 style="flex:1">Avisos del sistema</h2><span class="chip n">${sys.length}</span></div>
      ${sys.map((a, i) => `<div class="alert ${a.lvl}"><div class="alert-ic" style="background:${a.lvl === 'bad' ? 'var(--red-soft)' : a.lvl === 'warn' ? 'var(--amber-soft)' : 'var(--blue-soft)'};color:${a.lvl === 'bad' ? 'var(--red)' : a.lvl === 'warn' ? 'var(--amber)' : 'var(--blue)'}">${ic(a.ic)}</div><div class="bd"><div class="ttl">${esc(a.t)}</div><div class="small muted">${esc(a.s)}</div><div class="acts"><button class="btn sm" onclick="S._sys[${i}].open()">Abrir</button>${a.tel ? `<a class="btn sm" href="tel:${esc(a.tel)}">${ic('phone')} Llamar</a>` : ''}</div></div></div>`).join('') || `<div class="card empty">${ic('okc')}Todo al día</div>`}
    </div>
  </div>`;
}
function matchCard(m) {
  const p = m.p, c = m.c; const isCap = !!p._cap;
  const chip = w => `<span class="chip ${w.ok === true ? 'g' : w.ok === 'warn' ? 'a' : 'r'}">${w.ok === true ? '✓' : w.ok === 'warn' ? '≈' : '✕'} ${esc(w.t)}</span>`;
  return `<div class="alert" style="border-left-color:${scoreColor(m.score)}">
    <div class="score" style="background:conic-gradient(${scoreColor(m.score)} ${m.score * 3.6}deg,#eef0f4 0)"><span style="background:#fff;width:44px;height:44px;border-radius:50%;display:grid;place-items:center">${m.score}%</span></div>
    <div class="bd"><div class="ttl">${esc(c.nombre || 'Contacto')} <span class="muted" style="font-weight:500">quiere ${esc(intentOf(c.intent).l.toLowerCase())}</span> ${m.estado === 'nuevo' ? '<span class="chip o">Nuevo</span>' : m.estado === 'contactado' ? '<span class="chip b">Ofrecido</span>' : ''}</div>
      <div class="small" style="margin-top:3px"><b class="ref">${esc(p.ref)}</b> · ${esc(p.tipo)} · ${esc(p.direccion || p.zona || '')} · <b>${eur(p.precio, true)}</b>${isCap ? ' · <span class="chip a">captación sin convertir</span>' : ''}</div>
      <div class="why">${m.why.map(chip).join('')}</div>
      <div class="acts">
        ${c.telefono ? `<a class="btn sm" href="tel:${esc(c.telefono)}" onclick="markMatch('${m.key}','contactado')">${ic('phone')} Llamar</a><a class="btn sm green" target="_blank" href="${waLink(c, p)}" onclick="markMatch('${m.key}','contactado')">${ic('wa')} WhatsApp</a>` : ''}
        ${c.email ? `<a class="btn sm" href="${mailLink(c, p)}" onclick="markMatch('${m.key}','contactado')">${ic('mail')}</a>` : ''}
        <button class="btn sm" onclick="openVisita(null,{inmuebleId:'${isCap ? '' : p.id}',contactoId:'${c.id}',cliente:${esc(JSON.stringify(c.nombre || ''))},telefono:${esc(JSON.stringify(c.telefono || ''))}})">${ic('cal')} Visita</button>
        <button class="btn sm" onclick="${isCap ? `openContacto('${p._cap}')` : `openInmueble('${p.id}')`}">${ic('home')}</button>
        <button class="btn sm" onclick="openContacto('${c.id}')">${ic('user')}</button>
        ${m.estado !== 'contactado' ? `<button class="btn sm blue" onclick="markMatch('${m.key}','contactado')">${ic('check')} Trabajado</button>` : ''}
        ${m.estado !== 'descartado' ? `<button class="btn sm ghost danger" onclick="markMatch('${m.key}','descartado')">Descartar</button>` : `<button class="btn sm" onclick="markMatch('${m.key}','nuevo')">Reactivar</button>`}
      </div></div></div>`;
}
function waLink(c, p) {
  const txt = `Hola ${(c.nombre || '').split(' ')[0]}, soy ${S.me?.nombre || ''} de Concept Studio Homes. Tenemos un inmueble que encaja con lo que buscas: ${p.tipo} en ${p.zona || p.municipio || p.direccion}${p.m2c ? ', ' + m2(p.m2c) : ''}${p.hab ? ', ' + p.hab + ' hab.' : ''}, ${p.operacion === 'Venta' ? 'precio' : 'renta'} ${eur(p.precio)}. Ref. ${p.ref}. ¿Te envío la ficha y organizamos una visita?`;
  return 'https://wa.me/' + phoneDigits(c.telefono) + '?text=' + encodeURIComponent(txt);
}
function mailLink(c, p) { return `mailto:${c.email}?subject=${encodeURIComponent('Concept Studio Homes · ' + p.tipo + ' ' + (p.zona || p.municipio || '') + ' (' + p.ref + ')')}&body=${encodeURIComponent(`Hola ${(c.nombre || '').split(' ')[0]},\n\nTenemos un inmueble que encaja con tu búsqueda:\n\n· ${p.tipo} en ${p.direccion || p.zona}\n· ${p.m2c ? m2(p.m2c) : ''} ${p.hab ? '· ' + p.hab + ' hab.' : ''}\n· ${p.operacion}: ${eur(p.precio)}\n· Ref. ${p.ref}\n\n¿Te parece si organizamos una visita esta semana?\n\nUn saludo,\n${S.me?.nombre || ''}\nConcept Studio Homes`)}`; }
async function markMatch(key, estado) {
  const [cId] = key.replace('avi_', '').split('__');
  await save('aviso', { id: key, estado, ts: nowIso(), by: S.me?.nombre }, { silent: true });
  if (estado === 'contactado') logAct(cId, 'Cruce ofrecido al cliente (' + key.split('__')[1].replace('inm_', '') + ')');
}

/* ---------- CAPTACIÓN ---------- */
function vCaptacion(el) {
  const mode = S.ui.capMode || 'kanban'; const q = norm(S.ui.capQ || ''); const fi = S.ui.capI || '';
  const all = list('contacto').filter(c => (!fi || c.intent === fi) && (!q || norm([c.nombre, c.telefono, c.email, c.zonas, c.oDireccion, c.notas].join(' ')).includes(q)));
  actions(`<button class="btn" onclick="openExtract()">${ic('wand')} Extraer de texto</button><button class="btn pri" onclick="openContacto(null)">${ic('plus')} Nueva captación</button>`);
  const intentBtns = `<div class="seg"><button class="${!fi ? 'on' : ''}" onclick="S.ui.capI='';render()">Todos</button>${C.intents.map(i => `<button class="${fi === i.k ? 'on' : ''}" onclick="S.ui.capI='${i.k}';render()">${i.l}</button>`).join('')}</div>`;
  el.innerHTML = `
  <div class="toolbar"><div class="search">${ic('search')}<input placeholder="Buscar nombre, teléfono, zona…" value="${esc(S.ui.capQ || '')}" oninput="S.ui.capQ=this.value;clearTimeout(S._t);S._t=setTimeout(()=>{render();const i=$('.search input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)"></div>
  <div class="seg"><button class="${mode === 'kanban' ? 'on' : ''}" onclick="S.ui.capMode='kanban';render()">Embudo</button><button class="${mode === 'lista' ? 'on' : ''}" onclick="S.ui.capMode='lista';render()">Lista</button></div>
  <button class="btn" onclick="openExtract()">${ic('wand')}<span class="btn-label"> Extraer</span></button></div>
  <div class="toolbar" style="overflow-x:auto;flex-wrap:nowrap">${intentBtns}</div>
  ${mode === 'kanban' ? kanban(C.leadEstados, C.leadColor, all, 'estado', c => `<div class="kcard" draggable="true" data-id="${c.id}" style="border-top-color:${scoreColor(leadScore(c))}" onclick="openContacto('${c.id}')">
      <div class="t">${esc(c.nombre || 'Sin nombre')}</div><div class="s">${esc(intentOf(c.intent).l)} · ${esc(resumenBusca(c))}</div>
      <div class="r"><span class="chip" style="background:${scoreColor(leadScore(c))}1f;color:${scoreColor(leadScore(c))}">★ ${leadScore(c)}</span>${matchesFor(c.id).length ? `<span class="chip o">${ic('magnet', '').replace('<svg', '<svg width="12" height="12"')} ${matchesFor(c.id).length}</span>` : ''}<span class="small muted">${esc(initials(c.agente))}</span></div></div>`, 'contacto')
      : contactTable(all)}`;
  bindKanban('contacto', 'estado');
}
function resumenBusca(c) {
  if (isOferta(c)) return [c.oTipo, c.oZona || c.oMunicipio, c.oPrecio ? eur(num(c.oPrecio), true) : ''].filter(Boolean).join(' · ') || 'Datos del inmueble pendientes';
  return [(c.tipos || []).join('/'), c.zonas, c.precioMax ? '≤ ' + eur(num(c.precioMax), true) : ''].filter(Boolean).join(' · ') || 'Preferencias pendientes';
}
const initials = n => (S.equipo.find(m => m.nombre === n)?.iniciales) || (n || '').split(' ').map(x => x[0]).join('').slice(0, 3);
function contactTable(rows) {
  rows = rows.sort((a, b) => (b._u || '').localeCompare(a._u || ''));
  if (!rows.length) return `<div class="card empty">${ic('users')}Sin contactos. Pulsa <b>Nueva captación</b>.</div>`;
  return `<div class="card"><div class="tbl-wrap resp"><table class="tbl"><thead><tr><th>Contacto</th><th>Intención</th><th>Busca / ofrece</th><th>Estado</th><th>Score</th><th>Cruces</th><th>Próxima acción</th><th>Agente</th></tr></thead><tbody>
  ${rows.map(c => `<tr class="click" onclick="openContacto('${c.id}')"><td><b style="color:var(--ink)">${esc(c.nombre)}</b><div class="small muted">${esc(c.telefono || c.email || '')}</div></td><td><span class="chip ${isOferta(c) ? 'p' : 'b'}">${esc(intentOf(c.intent).l)}</span></td><td class="small">${esc(resumenBusca(c))}</td><td><span class="chip" style="background:${C.leadColor[c.estado] || '#94a3b8'}22;color:${C.leadColor[c.estado] || '#64748b'}">${esc(c.estado || '—')}</span></td><td><b style="color:${scoreColor(leadScore(c))}">${leadScore(c)}</b></td><td>${matchesFor(c.id).length ? `<span class="chip o">${matchesFor(c.id).length}</span>` : '—'}</td><td class="small ${c.proximaFecha && c.proximaFecha < today() ? '' : 'muted'}" style="${c.proximaFecha && c.proximaFecha < today() ? 'color:var(--red);font-weight:500' : ''}">${esc(c.proximaAccion || '')} ${c.proximaFecha ? fdate(c.proximaFecha) : ''}</td><td>${esc(initials(c.agente))}</td></tr>`).join('')}</tbody></table></div>
  <div class="lcards">${rows.map(c => `<div class="lcard" onclick="openContacto('${c.id}')"><div class="ic" style="background:${isOferta(c) ? 'var(--purple-soft)' : 'var(--blue-soft)'};color:${isOferta(c) ? 'var(--purple)' : 'var(--blue)'}">${ic(intentOf(c.intent).ic || 'user')}</div><div class="bd"><div class="t">${esc(c.nombre)}</div><div class="s">${esc(intentOf(c.intent).l)} · ${esc(resumenBusca(c))}</div><div class="chips"><span class="chip" style="background:${C.leadColor[c.estado] || '#94a3b8'}22;color:${C.leadColor[c.estado] || '#64748b'}">${esc(c.estado)}</span>${matchesFor(c.id).length ? `<span class="chip o">${matchesFor(c.id).length} cruces</span>` : ''}${c.proximaFecha ? `<span class="chip ${c.proximaFecha < today() ? 'r' : 'n'}">${fdate(c.proximaFecha)}</span>` : ''}</div></div><div class="rt"><b style="color:${scoreColor(leadScore(c))}" class="num">${leadScore(c)}</b></div></div>`).join('')}</div></div>`;
}

/* ---------- KANBAN genérico ---------- */
function kanban(states, colors, rows, field, card, tipo, sumFn) {
  return `<div class="kanban" data-tipo="${tipo}">${states.map(s => { const r = rows.filter(x => (x[field] || states[0]) === s); return `<div class="col" data-st="${esc(s)}"><div class="col-h"><i style="background:${colors[s]}"></i>${esc(s)} <span class="chip n">${r.length}</span>${sumFn ? `<span class="sum">${sumFn(r)}</span>` : ''}</div>${r.map(card).join('') || '<div class="small muted" style="padding:10px">—</div>'}</div>`; }).join('')}</div>`;
}
function bindKanban(tipo, field) {
  $$('.kcard[draggable]').forEach(k => k.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', k.dataset.id); }));
  $$('.kanban .col').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', async e => { e.preventDefault(); col.classList.remove('over'); const id = e.dataTransfer.getData('text/plain'); const r = get(id); if (!r || r[field] === col.dataset.st) return; const old = r[field]; r[field] = col.dataset.st; if (tipo === 'operacion') { r.prob = C.opProb[r[field]]; if (r[field] === 'Cerrada' && !r.fechaCierre) r.fechaCierre = today(); } await save(tipo, r, { silent: true }); logAct(id, `Estado: ${old || '—'} → ${r[field]}`); toast('Movido a ' + r[field]); });
  });
}

/* ---------- INMUEBLES ---------- */
function vInmuebles(el) {
  const q = norm(S.ui.inQ || ''), fe = S.ui.inE || '', fo = S.ui.inO || '', ft = S.ui.inT || '';
  const rows = list('inmueble').filter(p => (!fe || p.estado === fe) && (!fo || p.operacion === fo) && (!ft || p.tipo === ft) && (!q || norm([p.ref, p.direccion, p.zona, p.municipio, p.contacto, p.notas].join(' ')).includes(q))).sort((a, b) => (b.ref || '').localeCompare(a.ref || ''));
  actions(`<button class="btn" onclick="exportTipo('inmueble')">${ic('dl')} CSV</button><button class="btn pri" onclick="openInmueble(null)">${ic('plus')} Nuevo inmueble</button>`);
  const sel = (k, opts, lab) => `<select class="f" onchange="S.ui.${k}=this.value;render()"><option value="">${lab}</option>${opts.map(o => `<option ${S.ui[k] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  const pubN = p => C.portales.filter(x => (p.portales || {})[x]?.on).length;
  el.innerHTML = `<div class="toolbar"><div class="search">${ic('search')}<input placeholder="Ref., dirección, zona, contacto…" value="${esc(S.ui.inQ || '')}" oninput="S.ui.inQ=this.value;clearTimeout(S._t);S._t=setTimeout(()=>{render();const i=$('.search input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)"></div>${sel('inE', C.estadosInm, 'Estado')}${sel('inO', C.operaciones, 'Operación')}${sel('inT', C.tipos, 'Tipo')}</div>
  <div class="card">${rows.length ? `<div class="tbl-wrap resp"><table class="tbl"><thead><tr><th>Ref.</th><th>Inmueble</th><th>Operación</th><th>m²</th><th>Precio</th><th>€/m²</th><th>Estado</th><th>Portales</th><th>Docs</th><th>Cruces</th></tr></thead><tbody>
  ${rows.map(p => `<tr class="click" onclick="openInmueble('${p.id}')"><td class="ref">${esc(p.ref)}</td><td><b style="color:var(--ink)">${esc(p.tipo)}</b> · ${esc(p.direccion)}<div class="small muted">${esc([p.zona, p.municipio].filter(Boolean).join(' · '))}</div></td><td><span class="chip ${p.operacion === 'Venta' ? 'b' : 'p'}">${esc(p.operacion)}</span></td><td class="nowrap">${m2(p.m2c)}</td><td class="nowrap"><b>${eur(p.precio)}</b></td><td class="nowrap small">${p.precio && p.m2c ? eur(p.precio / p.m2c) : '—'}</td><td><span class="chip" style="background:${C.inmColor[p.estado]}22;color:${C.inmColor[p.estado]}">${esc(p.estado)}</span></td><td>${pubN(p) ? `<span class="chip g">Publicado · ${pubN(p)}</span>` : '<span class="chip n">No publicado</span>'}</td><td>${(p.adjuntos || []).length + (p.nDocs || 0)}</td><td>${matchesFor(p.id).length ? `<span class="chip o">${matchesFor(p.id).length}</span>` : '—'}</td></tr>`).join('')}</tbody></table></div>
  <div class="lcards">${rows.map(p => `<div class="lcard" onclick="openInmueble('${p.id}')"><div class="ic" style="background:${C.inmColor[p.estado]}1f;color:${C.inmColor[p.estado]}">${ic(['Local', 'Oficina', 'Edificio', 'Nave', 'Hotel'].includes(p.tipo) ? 'building' : 'home')}</div><div class="bd"><div class="t"><span class="ref">${esc(p.ref)}</span> · ${esc(p.tipo)}</div><div class="s">${esc(p.direccion)}${p.zona ? ' · ' + esc(p.zona) : ''}</div><div class="chips"><span class="chip" style="background:${C.inmColor[p.estado]}22;color:${C.inmColor[p.estado]}">${esc(p.estado)}</span><span class="chip n">${m2(p.m2c)}</span>${pubN(p) ? '<span class="chip g">Publicado</span>' : ''}${matchesFor(p.id).length ? `<span class="chip o">${matchesFor(p.id).length} cruces</span>` : ''}</div></div><div class="rt"><b class="num" style="font-size:13px">${eur(p.precio, true)}</b><div class="small muted">${esc(p.operacion)}</div></div></div>`).join('')}</div>` : `<div class="empty">${ic('home')}Sin inmuebles con esos filtros</div>`}</div>`;
}

/* ---------- CLIENTES ---------- */
function vClientes(el) {
  const q = norm(S.ui.clQ || ''), fr = S.ui.clR || '';
  const rows = list('contacto').filter(c => (!fr || (c.roles || []).includes(fr) || c.estado === fr) && (!q || norm([c.nombre, c.telefono, c.email, c.empresa, c.notas].join(' ')).includes(q)));
  actions(`<button class="btn" onclick="exportTipo('contacto')">${ic('dl')} CSV</button><button class="btn pri" onclick="openContacto(null)">${ic('plus')} Nuevo contacto</button>`);
  el.innerHTML = `<div class="toolbar"><div class="search">${ic('search')}<input placeholder="Buscar en la cartera de clientes…" value="${esc(S.ui.clQ || '')}" oninput="S.ui.clQ=this.value;clearTimeout(S._t);S._t=setTimeout(()=>{render();const i=$('.search input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)"></div>
  <select class="f" onchange="S.ui.clR=this.value;render()"><option value="">Todos los perfiles</option>${C.roles.map(r => `<option ${fr === r ? 'selected' : ''}>${r}</option>`).join('')}<option ${fr === 'Cliente' ? 'selected' : ''}>Cliente</option></select></div>${contactTable(rows)}`;
}

/* ---------- PIPELINE ---------- */
function vPipeline(el) {
  const honor = o => num(o.honorarios) ?? ((num(o.importe) || 0) * (num(o.honorariosPct) || 0) / 100);
  actions(`<button class="btn" onclick="exportTipo('operacion')">${ic('dl')} CSV</button><button class="btn pri" onclick="openOperacion(null)">${ic('plus')} Nueva operación</button>`);
  const os = list('operacion');
  el.innerHTML = kanban(C.opEstados, C.opColor, os, 'estado', o => { const p = get(o.inmuebleId); return `<div class="kcard" draggable="true" data-id="${o.id}" style="border-top-color:${C.opColor[o.estado]}" onclick="openOperacion('${o.id}')"><div class="t">${esc(o.titulo || 'Operación')}</div><div class="s">${esc(p ? p.ref + ' · ' + p.tipo : '')}${o.compradorId ? ' · ' + esc(get(o.compradorId)?.nombre || '') : ''}</div><div class="r"><b class="num" style="font-size:13px">${eur(num(o.importe), true)}</b><span class="chip g">${eur(honor(o), true)}</span><span class="small muted">${num(o.prob) ?? C.opProb[o.estado]}% · ${esc(initials(o.agente))}</span></div></div>`; }, 'operacion', r => eur(r.reduce((a, o) => a + honor(o), 0), true))
    + (os.length ? '' : `<div class="card empty" style="margin-top:12px">${ic('pipe')}Crea una operación cuando un cliente haga una oferta sobre un inmueble. Arrastra las tarjetas entre columnas.</div>`);
  bindKanban('operacion', 'estado');
}

/* ---------- VISITAS ---------- */
function vVisitas(el) {
  const tab = S.ui.viT || 'agenda';
  actions(`<button class="btn" onclick="openTarea(null)">${ic('check')} Nueva tarea</button><button class="btn pri" onclick="openVisita(null)">${ic('plus')} Nueva visita</button>`);
  const seg = `<div class="toolbar"><div class="seg">${[['agenda', 'Agenda 7 días'], ['visitas', 'Visitas'], ['tareas', 'Tareas']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" onclick="S.ui.viT='${k}';render()">${l}</button>`).join('')}</div><span style="flex:1"></span><button class="btn" onclick="openTarea(null)">${ic('check')}<span class="btn-label"> Tarea</span></button></div>`;
  if (tab === 'agenda') { const a = agendaItems(7); el.innerHTML = seg + `<div class="card">${a.length ? a.map(agendaRow).join('') : `<div class="empty">${ic('cal')}Agenda libre los próximos 7 días</div>`}</div>`; return; }
  if (tab === 'tareas') {
    const ts = list('tarea').sort((a, b) => (a.hecha - b.hecha) || (a.fecha || '9').localeCompare(b.fecha || '9'));
    el.innerHTML = seg + `<div class="card">${ts.map(x => `<div class="today-item"><input type="checkbox" ${x.hecha ? 'checked' : ''} onchange="toggleTarea('${x.id}',this.checked)" style="width:20px;height:20px"><div style="flex:1;cursor:pointer" onclick="openTarea('${x.id}')"><b style="color:var(--ink);${x.hecha ? 'text-decoration:line-through;opacity:.5' : ''}">${esc(x.titulo)}</b><div class="small muted">${fdate(x.fecha)} ${esc(x.hora || '')} · ${esc(x.agente || '')}</div></div>${!x.hecha && x.fecha && x.fecha < today() ? '<span class="chip r">Vencida</span>' : ''}</div>`).join('') || `<div class="empty">${ic('check')}Sin tareas</div>`}</div>`; return;
  }
  const vs = list('visita').sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const col = { Programada: 'b', Realizada: 'g', Cancelada: 'n', 'No presentado': 'r' };
  el.innerHTML = seg + `<div class="card">${vs.length ? vs.map(v => { const p = get(v.inmuebleId); return `<div class="lcard" style="cursor:pointer;display:flex" onclick="openVisita('${v.id}')"><div class="ic" style="background:var(--purple-soft);color:var(--purple)">${ic('eye')}</div><div class="bd"><div class="t">${esc(v.cliente || 'Visitante')} ${v.firma ? '<span class="chip g">Firmado</span>' : ''}</div><div class="s">${p ? esc(p.ref + ' · ' + p.direccion) : ''}</div><div class="chips"><span class="chip ${col[v.estado] || 'n'}">${esc(v.estado)}</span>${v.interes ? `<span class="chip ${v.interes === 'Caliente' ? 'o' : 'n'}">${esc(v.interes)}</span>` : ''}${num(v.oferta) ? `<span class="chip p">Oferta ${eur(num(v.oferta), true)}</span>` : ''}</div></div><div class="rt"><b class="small">${fdt(v.fecha)}</b><div class="small muted">${esc(initials(v.agente))}</div></div></div>`; }).join('') : `<div class="empty">${ic('eye')}Sin visitas registradas</div>`}</div>`;
}
async function toggleTarea(id, v) { const t = get(id); t.hecha = v; await save('tarea', t, { silent: true }); }

/* ---------- EQUIPO ---------- */
function vEquipo(el) {
  el.innerHTML = `<div class="grid g2">${S.equipo.map(m => { const st = memberStats(m.nombre); const vw = visitasSemana(m.nombre); return `<div class="card pad" style="background:linear-gradient(160deg,#fff 50%,${m.color}14)">
    <div style="display:flex;gap:14px;align-items:center"><div class="av lg" style="background:linear-gradient(135deg,${m.color},${m.color}bb)">${esc(m.iniciales)}</div><div style="flex:1"><h2>${esc(m.nombre)}</h2><div class="muted small">${esc(m.rol || '')}</div><div class="small" style="margin-top:4px">${m.email ? `<span class="chip g">${ic('okc').replace('<svg', '<svg width="12" height="12"')} Acceso activo · ${esc(m.email)}</span>` : '<span class="chip a">Pendiente de email de acceso</span>'}</div></div></div>
    <div class="grid g4" style="margin-top:16px;gap:8px">${[['Visitas semana', vw.total, 1], ['Programadas', vw.prog, 0], ['Realizadas', vw.hechas, 0], ['Captaciones', st.cap, 1]].map(([l, v, o]) => `<div style="background:${o ? '#fff1ea' : '#efefef'};border-radius:14px;padding:10px"><div class="num" style="font-size:17px;color:${o ? '#ff7440' : '#212934'}">${v}</div><div class="small muted">${l}</div></div>`).join('')}</div>
    <div class="fg" style="margin-top:14px"><div class="fld"><label>Email de acceso</label><input id="eqm_${m.id}" type="email" value="${esc(m.email || '')}" placeholder="email@…"></div><div class="fld"><label>Teléfono</label><input id="eqt_${m.id}" value="${esc(m.telefono || '')}"></div></div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm blue" onclick="saveMember('${m.id}')">Guardar</button>${m.telefono ? `<a class="btn sm" href="tel:${esc(m.telefono)}">${ic('phone')} Llamar</a>` : ''}</div></div>`; }).join('')}</div>
  <div class="card pad" style="margin-top:16px"><h3 style="margin-bottom:6px">Cómo entra Jesús Romero</h3><p class="small muted" style="margin:0">1) Escribe aquí su email y guarda. 2) Él abre la app, pulsa <b>Crear acceso</b> con ese email y elige su contraseña. 3) Instala la app desde el menú del navegador → <b>Añadir a pantalla de inicio</b>. Solo los emails de este equipo pueden ver los datos.</p></div>`;
}
async function saveMember(id) {
  const email = $('#eqm_' + id).value.trim().toLowerCase() || null, telefono = $('#eqt_' + id).value.trim() || null;
  const { error } = await sb.from('csh_equipo').update({ email, telefono }).eq('id', id);
  if (error) return toast('Error: ' + error.message); toast('Equipo actualizado'); await loadAll(); render();
}

/* ---------- DATOS ---------- */
function vDatos(el) {
  const tipos = [['inmueble', 'Inmuebles'], ['contacto', 'Captación y clientes'], ['operacion', 'Operaciones'], ['visita', 'Visitas'], ['tarea', 'Tareas'], ['actividad', 'Actividad']];
  el.innerHTML = `<div class="grid g3">${tipos.map(([t, l], i) => `<div class="card pad"><div style="display:flex;align-items:center;gap:10px"><div class="alert-ic" style="background:${C.palette[i]}1f;color:${C.palette[i]}">${ic('db')}</div><div style="flex:1"><b style="color:var(--ink)">${l}</b><div class="small muted">${list(t).length} registros</div></div></div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm" onclick="exportTipo('${t}')">${ic('dl')} Excel (CSV)</button><button class="btn sm" onclick="download('csh_${t}.json',JSON.stringify(list('${t}'),null,1),'application/json')">JSON</button></div></div>`).join('')}</div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card pad"><h3>Copia de seguridad completa</h3><p class="small muted">Descarga todo el CRM en un archivo JSON. Guárdalo en «BASE DE DATOS CRM - NOV-2026».</p><button class="btn blue" onclick="download('CSH_CRM_backup_'+today()+'.json',JSON.stringify({version:3,fecha:nowIso(),registros:[...S.recs.values()]},null,1),'application/json')">${ic('dl')} Descargar copia</button>
      <label class="btn" style="margin-left:8px">${ic('up')} Importar JSON<input type="file" accept=".json" class="hidden" onchange="importJSON(this.files[0])"></label></div>
    <div class="card pad"><h3>Estado</h3><p class="small">Nube: <b>Supabase</b> · ${S.sync === 'ok' ? '<span class="chip g">Sincronizado</span>' : '<span class="chip a">' + S.sync + '</span>'}</p><p class="small">Usuario: <b>${esc(S.user?.email)}</b></p><p class="small muted">Cambios en cola sin conexión: ${queueGet().length}</p><button class="btn" onclick="loadAll().then(render)">${ic('trend')} Recargar datos</button> <button class="btn ghost danger" onclick="logout()">${ic('logout')} Cerrar sesión</button></div>
  </div>`;
}
function exportTipo(t) { const rows = list(t).map(r => { const o = { ...r }; delete o.firma; if (o.adjuntos) o.adjuntos = o.adjuntos.map(a => a.name); return o; }); download('CSH_' + t + '_' + today() + '.csv', toCSV(rows)); }
async function importJSON(file) {
  if (!file) return; const j = JSON.parse(await file.text()); const regs = j.registros || [];
  if (!confirm(`Importar ${regs.length} registros? Los que tengan el mismo identificador se sobrescribirán.`)) return;
  for (let i = 0; i < regs.length; i += 200) { const { error } = await sb.from('csh_registros').upsert(regs.slice(i, i + 200).map(r => ({ id: r.id, tipo: r.tipo, data: r.data }))); if (error) return toast('Error: ' + error.message); }
  await loadAll(); render(); toast('Importación completada');
}

/* ---------- "Más" (móvil) ---------- */
function openMore() {
  closeMore(); const n = counts(); const d = document.createElement('div'); d.id = 'more';
  d.innerHTML = `<div class="overlay" style="justify-content:center;align-items:flex-end" onclick="closeMore()"></div><div class="more-sheet"><div class="more-grid">${VIEWS.map(v => `<button onclick="go('${v.k}')">${ic(v.ic)}${v.short || v.l}${n[v.k] ? `<span class="badge hot">${n[v.k]}</span>` : ''}</button>`).join('')}<button onclick="openExtract();closeMore()">${ic('wand')}Extraer datos</button><button onclick="openTarea(null);closeMore()">${ic('check')}Nueva tarea</button><button onclick="logout()">${ic('logout')}Salir</button></div></div>`;
  document.body.appendChild(d);
}
function closeMore() { $('#more')?.remove(); }
function quickAdd() {
  closeMore(); const d = document.createElement('div'); d.id = 'more';
  d.innerHTML = `<div class="overlay" style="justify-content:center;align-items:flex-end" onclick="closeMore()"></div><div class="more-sheet"><h3 style="margin:0 0 12px">Crear</h3><div class="more-grid">
  <button onclick="closeMore();openContacto(null)">${ic('magnet')}Captación</button><button onclick="closeMore();openInmueble(null)">${ic('home')}Inmueble</button><button onclick="closeMore();openVisita(null)">${ic('eye')}Visita</button><button onclick="closeMore();openOperacion(null)">${ic('pipe')}Operación</button><button onclick="closeMore();openTarea(null)">${ic('check')}Tarea</button><button onclick="closeMore();openExtract()">${ic('wand')}Extraer datos</button></div></div>`;
  document.body.appendChild(d);
}
