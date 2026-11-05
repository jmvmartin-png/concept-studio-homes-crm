# PROMPT — CRM Concept Studio Homes · Versión 3 (app móvil)

**Fecha:** 5 de noviembre de 2026 · **Autor:** Jesús Martín Vara

## 1. Orden original

> En el CRM, meter un apartado de CAPTACIÓN donde se pueda dar de alta el nombre del contacto, lo que busca (alquilar, comprar, vender…) y sus datos. Que se pueda adjuntar documentación en todas las fichas y extraer datos. Que el CRM haga solo el cruce de datos (si un contacto quiere alquilar una casa de un tipo determinado y la tenemos en cartera, que avise con alertas claras y trabajables). Buscar opciones en otros CRM para hacer el mejor CRM posible (nivel 10/10). Generar el prompt y ejecutarlo. Hacerlo como app y subirla a Supabase y GitHub para descargarla en el móvil, pensada para verla y manejarla allí. En "Equipo" deben figurar las dos personas con acceso: Jesús Romero y Jesús M.V. Dar más color al dashboard. El icono en el móvil debe llevar el logo y el nombre de Concept Studio Homes, no el icono genérico de Chrome.

## 2. Prompt optimizado

```
ROL
Arquitecto de producto proptech y desarrollador full-stack senior (PWA + Supabase).

CONTEXTO
Concept Studio Homes (www.conceptstudiohomes.com): inmobiliaria boutique de intermediación,
inversión y reformas en Madrid. Equipo con acceso: Jesús M.V. (dirección) y Jesús Romero
(comercial). Cartera inicial: 10 inmuebles (PV-0001…PV-0010) del CRM v2.

OBJETIVO
Convertir el CRM en una app instalable en el móvil (PWA), multiusuario y en la nube, con
captación de demanda/oferta, cruce automático con la cartera y documentación en todas las fichas.

MÓDULOS
1. Dashboard con color: KPIs (contactos, operaciones en curso y honorarios previstos,
   cierres del mes y cobrado, caídas y perdido, tasa de conversión, honorario medio, cruces
   nuevos, visitas de la semana), embudo de operaciones, origen de leads, cartera por tipo,
   ranking del equipo y "Hoy": visitas, tareas y seguimientos vencidos.
2. Avisos / Cruces: centro de alertas. Cada cruce demanda↔inmueble con % de afinidad y
   motivos ("operación ✔, tipo ✔, zona ✔, precio +4 %"). Acciones: llamar, WhatsApp con
   mensaje prefabricado, enviar ficha, agendar visita, marcar contactado o descartar.
   Avisos de sistema: seguimientos vencidos, visitas de hoy, inmuebles sin visitas en 30 días,
   documentación pendiente, leads nuevos sin contactar en 24 h.
3. Captación: alta rápida de contactos con intención (Comprar, Alquilar, Invertir, Vender,
   Poner en alquiler). Demanda: tipos, zonas, municipio, precio mín./máx., m², habitaciones,
   baños, extras, financiación, plazo. Oferta: dirección, tipo, m², precio deseado (con botón
   "Convertir en inmueble"). Origen, agente, temperatura, puntuación automática del lead,
   embudo Kanban (Nuevo → Contactado → Cualificado → Visitando → Negociación → Cliente/Perdido),
   próxima acción con fecha. "Extraer datos": pegar un anuncio, email o WhatsApp y rellenar
   automáticamente teléfono, email, precio, m², habitaciones, tipo, operación y zona.
4. Inmuebles: ficha completa (v2) + portales + documentación + cruces con demandas.
5. Clientes: directorio de todos los contactos (compradores, propietarios, inversores,
   colaboradores) con línea de tiempo.
6. Pipeline de operaciones: Kanban (Propuesta → Oferta → Negociación → Arras → Notaría →
   Cerrada · Caída) con importe, honorarios, probabilidad y previsión ponderada.
7. Visitas y agenda: visitas con parte firmado en pantalla, feedback e interés; agenda de
   hoy/7 días; tareas.
8. Equipo: Jesús M.V. y Jesús Romero, con su actividad, cartera, visitas y honorarios.
9. Datos: exportación CSV (Excel) y JSON por módulo, importación JSON, estado de la nube.

TRANSVERSAL
- Documentos adjuntos en TODAS las fichas (inmueble, contacto, operación, visita) con
  categoría, cámara del móvil, vista previa y descarga segura (Supabase Storage privado).
- Supabase: Auth (email + contraseña, solo emails del equipo), Postgres con RLS,
  tiempo real entre los dos usuarios, caché offline y cola de cambios sin conexión.
- PWA: manifest con el logo de Concept Studio Homes, nombre "Concept Studio" bajo el
  icono, modo standalone, service worker, barra inferior en móvil.
- Identidad: Unbounded + Inter, naranja #ff7440, azul #3f6efc, marino #212934, con
  degradados y tarjetas de color en el dashboard.

RESTRICCIONES
- No inventar datos. Sin DNI de titulares en la base salvo en el parte de visita firmado.
- Datos solo accesibles para el equipo (RLS). Código público sin secretos.

ENTREGABLES
App publicada en GitHub Pages, repositorio en GitHub, base de datos en Supabase y copia
de todos los archivos en "BASE DE DATOS CRM - NOV-2026".
```

## 3. Benchmark: qué se incorpora de cada CRM

| CRM | Función de referencia | Cómo queda en CSH CRM |
|---|---|---|
| Inmovilla / Witei (España) | Cruce oferta-demanda, partes de visita | Motor de cruce con % de afinidad y parte de visita firmado |
| Sooprema / Mobilia | Captación de propietarios y estados de comercialización | Captación con intención Vender/Alquilar y "Convertir en inmueble" |
| Follow Up Boss | Smart Lists ("a quién llamo ahora") y Action Plans | Avisos priorizados + próxima acción con fecha en cada contacto |
| kvCORE / BoomTown | Lead scoring y app móvil completa | Puntuación automática del lead y PWA instalable |
| Lofty | Alertas de inmuebles al comprador | WhatsApp prefabricado con la ficha del inmueble que cruza |
| Pipedrive | Pipeline visual y previsión ponderada | Kanban de operaciones con honorarios × probabilidad |
| Wise Agent | Checklists de transacción y documentos | Documentación adjunta por ficha y checklist documental |

## 4. Motor de cruce (afinidad 0–100)

| Criterio | Peso | Regla |
|---|---|---|
| Operación | Filtro | Comprar/Invertir ↔ Venta · Alquilar ↔ Alquiler |
| Tipo de inmueble | 25 | Coincide con algún tipo buscado (sin preferencia = 15) |
| Zona / municipio | 25 | Coincide zona, barrio o municipio (sin preferencia = 12) |
| Precio | 30 | Dentro del rango = 30; hasta +10 % = 18; hasta +20 % = 8 |
| m² | 10 | ≥ mínimo = 10; ≥ 90 % = 5 |
| Habitaciones / baños | 10 | ≥ mínimo = 10 |

Se avisa a partir de **60 %**. Los inmuebles Cerrados o Descartados y los contactos Perdidos no cruzan.
