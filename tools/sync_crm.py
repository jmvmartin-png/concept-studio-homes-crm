#!/usr/bin/env python3
"""Sincroniza la carpeta NUESTROS CAPTACION con el CRM de Concept Studio Homes.

Lee las subcarpetas PV-NNNN (inmuebles) y DM-NNNN (demandas) y genera el SQL
para crear en Supabase (tabla csh_registros) solo lo que todavía no existe:
  - inmuebles   -> id inm_PV-NNNN
  - demandas    -> id con_DM-NNNN (contacto de Captación)
  - colaboradores (último tramo del nombre con minúsculas) -> id con_col_<slug>
  - una tarea por cada alta nueva -> id tar_auto_<REF>

Regla de nombres: si el último tramo del nombre de la carpeta lleva minúsculas es
el colaborador; si no, es captación propia.

Uso:
  python3 sync_crm.py --base ".../NUESTROS CAPTACION" --existing ids.txt --agente "Jesús M.V." > nuevo.sql
  (ids.txt: un id por línea, los que ya hay en csh_registros)
No modifica ni borra nada de la carpeta: solo lee.
"""
import argparse, datetime as dt, json, os, re, sys, unicodedata

def norm(s):
    s = unicodedata.normalize('NFD', s or '')
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower().strip()

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', norm(s))

SMALL = {'de', 'del', 'la', 'las', 'los', 'y', 'en', 'el'}
def title(s):
    out = []
    for i, w in enumerate((s or '').lower().split()):
        out.append(w if (w in SMALL and i) else w[:1].upper() + w[1:])
    return ' '.join(out)

TIPOS = [(r'^(BAJO|PISO|VIVIENDA|HABITACION)', 'Piso'), (r'^ATICO', 'Ático'), (r'^DUPLEX', 'Dúplex'),
         (r'(CHALET|UNIFAMILIAR|^CASA)', 'Casa / Chalet'), (r'(ESTUDIO|LOFT)', 'Estudio / Loft'), (r'LOCAL', 'Local'),
         (r'OFICINA', 'Oficina'), (r'NAVE', 'Nave'), (r'(SOLAR|SUELO)', 'Suelo / Solar'), (r'GARAJE', 'Garaje'),
         (r'HOTEL', 'Hotel'), (r'EDIFICIO', 'Edificio'), (r'FINCA', 'Finca rústica')]
def map_tipo(t):
    t = re.sub(r'\bALQUILER\b', '', norm(t).upper()).strip()
    for rx, v in TIPOS:
        if re.search(rx, t):
            return v
    return ''

ZONAS_MULTI = ['NUEVA ESPAÑA', 'ARTURO SORIA', 'CIUDAD LINEAL', 'NUEVOS MINISTERIOS', 'EL VISO', 'CONDE ORGAZ', 'LAS ROZAS',
               'SS REYES', 'CRUZ DEL RAYO', 'SAN BLAS', 'LA FINCA', 'RIOS ROSAS', 'PINTOR ROSALES', 'ZONA NORTE',
               'VALLE DEL TIETAR', 'DENTRO M30', 'ALCALA DE HENARES', 'FUENTE DEL BERRO', 'MADRID PRIME', 'CANTABRICO']
def zonas(z):
    s = ' ' + norm(z).upper() + ' '
    out = []
    for m in ZONAS_MULTI:
        k = ' ' + norm(m).upper() + ' '
        if k in s:
            out.append(m); s = s.replace(k, ' ')
    out += [w for w in s.split() if w not in {'Y', 'DE', 'DEL', 'LA', 'EL', 'NORTE', 'PRIME', 'PERIFERIA', 'CAPITALES'}]
    return ', '.join(title(x) for x in out)

def parse_ficha(txt):
    r = {}
    if not txt:
        return r
    g = lambda rx: (re.search(rx, txt, re.M).group(1).strip() if re.search(rx, txt, re.M) else '')
    r['titulo'] = g(r'^#\s*(.+)$')
    r['telefono'] = re.sub('(?i)ver en el grupo', '', g(r'\*\*Teléfono:\*\*\s*(.+)$')).strip()
    r['operacion'] = g(r'\*\*Operación:\*\*\s*(\w+)')
    r['origen'] = g(r'\*\*Origen:\*\*\s*(.+)$')
    r['fecha'] = g(r'\*\*Fecha publicación:\*\*\s*(\d{4}-\d{2}-\d{2})')
    pr = g(r'\*\*Precio detectado:\*\*\s*([\d.]+)\s*€')
    r['precio'] = int(pr.replace('.', '')) if pr else None
    mm = g(r'\*\*m²:\*\*\s*([\d.,]+)')
    r['m2'] = float(mm.replace(',', '.')) if mm else None
    hb = g(r'\*\*Hab\.:\*\*\s*(\d+)')
    r['hab'] = int(hb) if hb else None
    msg = txt.split('## Mensaje original', 1)[1] if '## Mensaje original' in txt else ''
    r['mensaje'] = msg.replace('**', '').strip()[:1500]
    return r

def read_ficha(path):
    f = os.path.join(path, 'FICHA.md')
    try:
        return open(f, encoding='utf-8').read()
    except Exception:
        return ''

def count_files(path):
    nd = nf = 0
    for root, dirs, files in os.walk(path):
        for fn in files:
            if fn == 'FICHA.md':
                continue
            if re.search(r'\.(jpe?g|png|webp|heic)$', fn, re.I) or re.search('foto', root, re.I):
                nf += 1
            else:
                nd += 1
    return nd, nf

FUERA = re.compile(r'MALAGA|MALLORCA|ALBACETE|CANTABRIA|ALICANTE|LUGO|PARLA|MOSTOLES|ALCOBENDAS|TRES CANTOS|LAS ROZAS|GUADALIX|MURCIA|AGUILAS', re.I)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True)
    ap.add_argument('--existing', required=True)
    ap.add_argument('--agente', default='Jesús M.V.')
    ap.add_argument('--hoy', default=dt.date.today().isoformat())
    a = ap.parse_args()
    existing = set(l.strip() for l in open(a.existing, encoding='utf-8') if l.strip())
    hoy = a.hoy
    rows = []          # (id, tipo, data)
    resumen = {'inmuebles': [], 'demandas': [], 'colaboradores': []}

    def add(id_, tipo, data):
        if id_ in existing:
            return False
        existing.add(id_); rows.append((id_, tipo, data)); return True

    def colaborador(nombre, tel):
        cid = 'con_col_' + slug(nombre)
        if add(cid, 'contacto', {'nombre': nombre, 'telefono': tel or '', 'roles': ['Colaborador'], 'estado': 'Cliente',
                                 'origen': 'Colaborador', 'agente': a.agente, 'fechaAlta': hoy, 'intent': '', 'tipos': [],
                                 'extras': [], 'adjuntos': [], 'notas': 'Colaborador · creado desde la carpeta NUESTROS CAPTACION'}):
            resumen['colaboradores'].append(nombre)
        return cid

    for name in sorted(os.listdir(a.base)):
        path = os.path.join(a.base, name)
        if not os.path.isdir(path):
            continue
        m_dm = re.match(r'^DM\s*-?\s*(\d+)', name, re.I)
        m_pv = re.match(r'^PV\s*-?\s*(\d+)', name, re.I)
        if m_dm:
            ref = 'DM-' + m_dm.group(1).zfill(4)
            if 'con_' + ref in existing:
                continue
            segs = [x.strip() for x in re.split(r'\s+-\s+', name[m_dm.end():]) if x.strip()]
            nombre = segs.pop() if len(segs) > 1 and re.search('[a-záéíóúñ]', segs[-1]) else ref
            op = segs[0] if segs else ''
            tipo = segs[1] if len(segs) > 1 else ''
            zona = ' '.join(segs[2:])
            fi = parse_ficha(read_ficha(path))
            T = norm(tipo).upper()
            intent = 'alquilar' if ('ALQUILER' in op.upper() and 'COMPRA' not in op.upper()) else \
                     ('invertir' if re.search('INVERSION|FLIP|HOTEL|SUELO|EDIFICIO', T) else 'comprar')
            tp = map_tipo(tipo)
            tipos = ['Suelo / Solar', 'Edificio'] if 'SUELOS Y EDIFICIOS' in T else ['Piso', 'Casa / Chalet'] if 'PISO O CHALET' in T \
                else ['Ático', 'Piso'] if 'ATICO O PISO' in T else ([tp] if tp else [])
            data = {'nombre': nombre, 'telefono': fi.get('telefono', ''), 'intent': intent, 'tipos': tipos, 'zonas': zonas(zona),
                    'precioMax': fi.get('precio'), 'm2Min': fi.get('m2'), 'habMin': fi.get('hab'), 'estado': 'Nuevo',
                    'temperatura': 'Templado', 'origen': 'WhatsApp', 'agente': a.agente, 'fechaAlta': fi.get('fecha') or hoy,
                    'roles': ['Inquilino' if intent == 'alquilar' else 'Inversor' if intent == 'invertir' else 'Comprador'],
                    'extras': [], 'adjuntos': [], 'dmRef': ref, 'carpeta': 'NUESTROS CAPTACION\\' + name,
                    'notas': (('Origen: ' + fi['origen'] + '\n\n') if fi.get('origen') else '') + fi.get('mensaje', ''),
                    'proximaAccion': 'Contactar y cualificar', 'proximaFecha': ''}
            if add('con_' + ref, 'contacto', data):
                resumen['demandas'].append(name)
                add('tar_auto_' + ref, 'tarea', {'titulo': f'Contactar demanda {ref} · {nombre}', 'fecha': hoy, 'agente': a.agente,
                                                 'refId': 'con_' + ref, 'hecha': False, 'notas': 'Alta automática desde la carpeta'})
        elif m_pv:
            ref = 'PV-' + m_pv.group(1).zfill(4)
            if 'inm_' + ref in existing:
                continue
            segs = [x.strip() for x in re.split(r'\s*-\s*', name[m_pv.end():]) if x.strip()]
            colab = segs.pop() if segs and re.search('[a-záéíóúñ]', segs[-1]) else None
            tseg = re.split(r'\s+-\s+', name)
            tipo_seg = tseg[-2] if colab and len(tseg) >= 3 else ''
            tipo = map_tipo(tipo_seg) or next((map_tipo(s) for s in segs if map_tipo(s)), '')
            fi = parse_ficha(read_ficha(path))
            direccion = fi['titulo'].split(' · ')[-1] if fi.get('titulo') else ' '.join(s for s in segs if not map_tipo(s))
            nd, nf = count_files(path)
            cid = colaborador(colab, fi.get('telefono')) if colab else ''
            data = {'ref': ref, 'estado': 'Captación', 'operacion': fi.get('operacion') or ('Alquiler' if 'ALQUILER' in name.upper() else 'Venta'),
                    'tipo': tipo, 'direccion': title(direccion), 'zona': '', 'municipio': '' if FUERA.search(name) else 'Madrid',
                    'provincia': '', 'precio': fi.get('precio'), 'm2c': fi.get('m2'), 'hab': fi.get('hab'),
                    'captacion': 'Colaborador' if colab else 'Propia', 'colaboradorId': cid, 'contacto': colab or '',
                    'rol': 'Colaborador' if colab else '', 'telefono': fi.get('telefono', ''), 'agente': a.agente,
                    'fecha': fi.get('fecha') or hoy, 'prioridad': 'Media', 'exclusiva': 'No', 'docs': {}, 'portales': {},
                    'adjuntos': [], 'extras': [], 'nDocs': nd, 'nFotos': nf, 'origen': fi.get('origen', ''),
                    'notas': fi.get('mensaje', ''), 'carpeta': 'NUESTROS CAPTACION\\' + name}
            if add('inm_' + ref, 'inmueble', data):
                resumen['inmuebles'].append(name)
                quien = f' con {colab}' if colab else ''
                add('tar_auto_' + ref, 'tarea', {'titulo': f'Revisar nuevo inmueble {ref}{quien}', 'fecha': hoy, 'agente': a.agente,
                                                 'refId': 'inm_' + ref, 'hecha': False, 'notas': 'Alta automática desde la carpeta'})
    if rows:
        vals = ',\n'.join("('%s','%s',$j$%s$j$::jsonb)" % (i.replace("'", "''"), t, json.dumps(d, ensure_ascii=False)) for i, t, d in rows)
        print('insert into public.csh_registros (id, tipo, data) values\n' + vals + '\non conflict (id) do nothing;')
    else:
        print('-- sin novedades')
    sys.stderr.write(json.dumps({k: len(v) for k, v in resumen.items()}, ensure_ascii=False) + '\n')
    sys.stderr.write(json.dumps(resumen, ensure_ascii=False) + '\n')

if __name__ == '__main__':
    main()
