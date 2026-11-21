#!/usr/bin/env python3
"""Vuelca al CRM de Concept Studio Homes las captaciones propias positivas del Excel
maestro de CRUCE Y CAPTACION (alquiler >= 1.500 €/mes, Idealista y Fotocasa).

Condición de subida (la que marca el propio Excel, hoja «Para CRM»):
  «Subir al CRM» = Sí  y  «Ref. CRM» vacía.
  Si además «Resultado captación» es Negativa / Ya alquilado / No interesa, la fila NO se sube
  y se avisa (incoherencia que debe revisar Jesús).

Cada fila crea en public.csh_registros:
  - INMUEBLE  id inm_PV-XXXX (ref PV-XXXX correlativa; operación Alquiler, estado Captación, captación Propia)
  - CONTACTO propietario id con_prop_PV-XXXX (si hay teléfono o nombre de anunciante)
  - TAREA     id tar_auto_PV-XXXX

La numeración PV-XXXX sigue a la mayor entre el CRM y las carpetas PV- de NUESTROS CAPTACION,
para no chocar con las carpetas.

Dos fases:
  1) generar:   python3 excel_captacion_crm.py generar --xlsx X --existing ids.txt --anuncios anuncios.txt
                  --base ".../NUESTROS CAPTACION" --outdir salida --hoy AAAA-MM-DD
     -> salida/excel_parte_N.sql + salida/excel_pendiente.json ; imprime {"partes":N,"filas":M,...}
  2) confirmar: python3 excel_captacion_crm.py confirmar --xlsx X --outdir salida
     (solo después de ejecutar todas las partes SQL sin error) -> escribe la Ref. CRM en el Excel
     (copia de seguridad previa en _sistema/backup). No toca ninguna otra celda.
anuncios.txt: una línea por inmueble ya en el CRM con idAnuncio:  <portal>|<idAnuncio>\t<ref>
"""
import argparse, datetime as dt, json, os, re, shutil, sys, unicodedata

def norm(s):
    s = unicodedata.normalize('NFD', str(s or ''))
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower().strip()

NEGATIVOS = {'negativa', 'ya alquilado', 'no interesa'}
TIPOS = {'piso': 'Piso', 'apartamento': 'Piso', 'bajo con jardin': 'Piso', 'atico': 'Ático', 'duplex': 'Dúplex',
         'estudio': 'Estudio / Loft', 'loft': 'Estudio / Loft', 'casa': 'Casa / Chalet', 'chalet': 'Casa / Chalet'}

def cab(ws):
    return {norm(c.value): c.column for c in ws[1] if c.value}

def col(h, *names):
    for n in names:
        if norm(n) in h:
            return h[norm(n)]
    return None

def num(v):
    if v in (None, ''):
        return None
    if isinstance(v, (int, float)):
        return int(v) if float(v).is_integer() else float(v)
    m = re.search(r'[\d.,]+', str(v))
    if not m:
        return None
    t = m.group(0).replace('.', '').replace(',', '.')
    try:
        f = float(t); return int(f) if f.is_integer() else f
    except ValueError:
        return None

def hojas(wb):
    return [ws for ws in wb.worksheets if ' · ' in ws.title and ws.title.split(' · ')[1] in ('Particulares', 'Profesionales')]

def generar(a):
    import openpyxl
    wb = openpyxl.load_workbook(a.xlsx)  # fórmulas intactas; solo lectura en esta fase
    existing = set(l.strip() for l in open(a.existing, encoding='utf-8') if l.strip())
    anuncios = {}
    if a.anuncios and os.path.exists(a.anuncios):
        for l in open(a.anuncios, encoding='utf-8'):
            if '\t' in l:
                k, v = l.rstrip('\n').split('\t', 1); anuncios[k.strip()] = v.strip()
    nums = [int(m.group(1)) for i in existing for m in [re.match(r'inm_PV-(\d+)$', i)] if m]
    if a.base and os.path.isdir(a.base):
        nums += [int(m.group(1)) for n in os.listdir(a.base) for m in [re.match(r'^PV\s*-?\s*(\d+)', n, re.I)] if m]
    sig = max(nums or [0]) + 1
    rows, pend, res = [], [], {'subidas': [], 'yaEnCRM': [], 'incoherentes': []}
    for ws in hojas(wb):
        h = cab(ws)
        c_sub, c_ref = col(h, 'Subir al CRM'), col(h, 'Ref. CRM')
        if not c_sub or not c_ref:
            continue
        distrito = ws.title.split(' · ')[0]
        g = lambda r, *n: (ws.cell(r, col(h, *n)).value if col(h, *n) else None)
        for r in range(2, ws.max_row + 1):
            if norm(ws.cell(r, c_sub).value) not in ('si', 'sí'):
                continue
            if str(ws.cell(r, c_ref).value or '').strip():
                continue
            portal = str(g(r, 'Portal') or '').strip()
            ida = str(g(r, 'ID anuncio') or '').strip()
            resultado = str(g(r, 'Resultado captación') or '').strip()
            fila = f'{ws.title} fila {r}'
            if norm(resultado) in NEGATIVOS:
                res['incoherentes'].append(f'{fila}: Subir al CRM = Sí pero Resultado = {resultado}')
                continue
            if f'{portal}|{ida}' in anuncios:  # ya subido antes: solo devolver la ref al Excel
                pend.append({'hoja': ws.title, 'fila': r, 'ref': anuncios[f'{portal}|{ida}'], 'ida': ida})
                res['yaEnCRM'].append(f'{fila} -> {anuncios[f"{portal}|{ida}"]}')
                continue
            while f'inm_PV-{sig:04d}' in existing:
                sig += 1
            ref = f'PV-{sig:04d}'; sig += 1
            existing.add('inm_' + ref)
            enl = ws.cell(r, col(h, 'Enlace')) if col(h, 'Enlace') else None
            url = (enl.hyperlink.target if enl is not None and enl.hyperlink else '') or \
                  (str(enl.value) if enl is not None and str(enl.value or '').startswith('http') else '')
            if not url and portal == 'Idealista' and ida:
                url = f'https://www.idealista.com/inmueble/{ida}/'
            fecha_c = g(r, 'Fecha contacto')
            fecha_c = fecha_c.date().isoformat() if hasattr(fecha_c, 'date') else (str(fecha_c or '')[:10] or a.hoy)
            portales = {portal: {'on': True, 'url': url, 'fecha': fecha_c}} if portal else {}
            tamb = str(g(r, 'También publicado en') or '')
            m = re.search(r'(Fotocasa|Idealista):\s*(https?://\S+)', tamb)
            if m and m.group(1) not in portales:
                portales[m.group(1)] = {'on': True, 'url': m.group(2), 'fecha': fecha_c}
            anunciante = str(g(r, 'Anunciante') or '').strip()
            nombre = '' if norm(anunciante) in ('particular', 'profesional', '') else anunciante
            tel = str(g(r, 'Teléfono') or '').strip()
            barrio = str(g(r, 'Barrio') or '').strip()
            exc = str(g(r, 'Exclusiva') or '').strip()
            hon = g(r, 'Honorarios %', 'Honorarios')
            notas = '\n'.join(x for x in [
                f'Captación propia · {portal} {ida} · {distrito} · {ws.title.split(" · ")[1]}',
                f'Resultado captación: {resultado}' if resultado else '',
                f'Contactado el {fecha_c}',
                str(g(r, 'Notas seguimiento') or '').strip(),
                str(g(r, 'Observaciones') or '').strip(),
                f'Excel: N01 CRUCE Y CAPTACION · {fila}'] if x)
            prop_id = 'con_prop_' + ref if (tel or nombre) else ''
            inm = {'ref': ref, 'estado': 'Captación', 'operacion': 'Alquiler', 'captacion': 'Propia',
                   'tipo': TIPOS.get(norm(g(r, 'Tipo inmueble')), str(g(r, 'Tipo inmueble') or '')),
                   'precio': num(g(r, 'Precio €/mes')), 'm2c': num(g(r, 'm²')), 'hab': num(g(r, 'Dorm.')),
                   'banos': num(g(r, 'Baños')), 'planta': str(g(r, 'Planta') or ''),
                   'direccion': str(g(r, 'Dirección') or ''), 'zona': ' · '.join(x for x in [barrio, distrito] if x),
                   'municipio': 'Madrid', 'provincia': 'Madrid', 'contacto': nombre or ('Propietario particular' if tel else ''),
                   'rol': 'Propietario', 'telefono': tel, 'exclusiva': 'Sí' if norm(exc) in ('si', 'sí') else 'No',
                   'honorarios': '' if hon in (None, '') else str(hon), 'origen': portal, 'portales': portales,
                   'idAnuncio': ida, 'portalAnuncio': portal, 'propietarioId': prop_id, 'colaboradorId': '',
                   'agente': a.agente, 'fecha': a.hoy, 'prioridad': 'Alta', 'docs': {}, 'adjuntos': [], 'extras': [],
                   'nDocs': 0, 'nFotos': 0, 'notas': notas, 'carpeta': ''}
            rows.append(('inm_' + ref, 'inmueble', inm))
            if prop_id:
                rows.append((prop_id, 'contacto', {'nombre': nombre or f'Propietario {ref}', 'telefono': tel,
                             'roles': ['Propietario'], 'estado': 'Cliente', 'origen': portal, 'agente': a.agente,
                             'fechaAlta': a.hoy, 'inmuebleId': 'inm_' + ref, 'intent': '', 'tipos': [], 'extras': [],
                             'adjuntos': [], 'proximaAccion': '', 'proximaFecha': '',
                             'notas': f'Propietario de {ref} · {inm["direccion"]} · captación propia {portal}'}))
            rows.append(('tar_auto_' + ref, 'tarea', {'titulo': f'Nueva captación propia {ref} · {inm["direccion"] or barrio}: preparar encargo y fotos',
                         'fecha': a.hoy, 'agente': a.agente, 'refId': 'inm_' + ref, 'hecha': False,
                         'notas': 'Alta automática desde el Excel de CRUCE Y CAPTACION'}))
            pend.append({'hoja': ws.title, 'fila': r, 'ref': ref, 'ida': ida})
            res['subidas'].append(f'{ref} · {distrito} · {barrio} · {inm["precio"]} €/mes · {fila}')
    os.makedirs(a.outdir, exist_ok=True)
    for f in os.listdir(a.outdir):
        if f.startswith('excel_parte_') and f.endswith('.sql'):
            os.remove(os.path.join(a.outdir, f))
    partes, act, tam = [], [], 0
    for i, t, d in rows:
        v = "('%s','%s',$j$%s$j$::jsonb)" % (i.replace("'", "''"), t, json.dumps(d, ensure_ascii=False, default=str))
        if act and tam + len(v) > 25000:
            partes.append(act); act, tam = [], 0
        act.append(v); tam += len(v)
    if act:
        partes.append(act)
    for k, p in enumerate(partes, 1):
        with open(os.path.join(a.outdir, f'excel_parte_{k}.sql'), 'w', encoding='utf-8') as fh:
            fh.write('insert into public.csh_registros (id, tipo, data) values\n' + ',\n'.join(p) + '\non conflict (id) do nothing;\n')
    json.dump(pend, open(os.path.join(a.outdir, 'excel_pendiente.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(json.dumps({'partes': len(partes), 'filas': len(rows), 'subidas': len(res['subidas']),
                      'refsAEscribir': len(pend), 'incoherentes': len(res['incoherentes'])}))
    sys.stderr.write(json.dumps(res, ensure_ascii=False, indent=1) + '\n')

def confirmar(a):
    import openpyxl
    pend = json.load(open(os.path.join(a.outdir, 'excel_pendiente.json'), encoding='utf-8'))
    if not pend:
        print(json.dumps({'escritas': 0})); return
    try:
        open(a.xlsx, 'r+b').close()
    except PermissionError:
        print(json.dumps({'error': 'EXCEL_ABIERTO'})); sys.exit(3)
    bdir = os.path.join(os.path.dirname(a.xlsx), '_sistema', 'backup')
    os.makedirs(bdir, exist_ok=True)
    shutil.copy2(a.xlsx, os.path.join(bdir, 'antes_refCRM_' + dt.datetime.now().strftime('%Y%m%d_%H%M%S') + '.xlsx'))
    wb = openpyxl.load_workbook(a.xlsx)
    n = 0
    for p in pend:
        ws = wb[p['hoja']]
        h = cab(ws)
        c_ref, c_id = col(h, 'Ref. CRM'), col(h, 'ID anuncio')
        if c_id and str(ws.cell(p['fila'], c_id).value or '').strip() != p['ida']:
            sys.stderr.write(f"Fila movida, no escribo: {p}\n"); continue
        if not str(ws.cell(p['fila'], c_ref).value or '').strip():
            ws.cell(p['fila'], c_ref).value = p['ref']; n += 1
    wb.save(a.xlsx)
    os.remove(os.path.join(a.outdir, 'excel_pendiente.json'))
    print(json.dumps({'escritas': n}))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('fase', choices=['generar', 'confirmar'])
    ap.add_argument('--xlsx', required=True)
    ap.add_argument('--existing')
    ap.add_argument('--anuncios')
    ap.add_argument('--base')
    ap.add_argument('--agente', default='Jesús M.V.')
    ap.add_argument('--hoy', default=dt.date.today().isoformat())
    ap.add_argument('--outdir', default='.')
    a = ap.parse_args()
    generar(a) if a.fase == 'generar' else confirmar(a)
