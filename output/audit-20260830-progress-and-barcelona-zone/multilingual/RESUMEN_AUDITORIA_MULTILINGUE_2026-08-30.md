# Auditoría multilingüe actual — ES / EN / FR / IT

Fecha de ejecución: 2026-08-30
Activo: árbol local y servidor `http://localhost:3000`
Locales exactos: `es`, `en`, `fr`, `it` (idiomas base; no se infiere región)
Idioma fuente: `es`
Alcance: auditoría completa de los cuatro catálogos y rastreo HTTP completo del inventario declarado; revisión manual técnica muestral del preview sintético.
Modos aplicados: B (repositorio/catálogos), C (HTTP estático), D (señales lingüísticas sin aprobación humana) y E (regresión/puerta).
Interacción: solo lectura; no se enviaron formularios, reservas, pagos ni datos.
Límites: sin tecnología de asistencia, sin envío de recorridos, sin revisión lingüística humana independiente y sin afirmación sobre despliegue público.

## Dictámenes separados

| Ámbito | Dictamen | Motivo principal |
|---|---|---|
| Catálogos, estructura | `NO DETERMINABLE` | Los 348 segmentos estructurales pasan en los cuatro locales, pero el paquete no acredita UI, build, recorridos ni revisión humana. |
| Runtime HTTP `DEFAULT_DRAFT` | `NO CONFORME` | En el estado seguro no indexable no se emiten canonical ni `hreflang`; además, dos rutas parametrizadas del inventario se probaron literalmente como `{slug}`. |
| Lingüístico | `PENDIENTE DE REVISIÓN HUMANA` | No existe manifiesto de traducción/posedición y segundo revisor independiente para la versión actual. |
| Publicación | `NO APTO` | Hay bloqueadores técnicos abiertos en el runtime observado y falta evidencia humana/funcional. |

Estos dictámenes no constituyen certificación lingüística, WCAG, SEO ni jurídica.

## Resultado 1 — catálogos

- Informe automático: `catalogs-current.json` / `catalogs-current.md`.
- Auditoría `MWA-c8e29dc1abdc`, ejecución `complete`, modo `repository-catalog-regression`.
- 348 segmentos inventariados; los 348 están presentes en `es`, `en`, `fr` e `it`.
- 0 hallazgos de claves, placeholders, marcado o contratos numéricos.
- 0 revisiones humanas registradas.
- La puerta estricta devuelve código `3`: documento válido, pero evidencia insuficiente para publicación.
- El validador interno del proyecto volvió a pasar después de alinear su contrato con `x-default`: `PASS_WITH_LIMITS`, 0 incidencias de catálogo, 17 plantillas de ruta, revisión humana pendiente y publicación no determinable por falta de evidencia.

## Resultado 2 — runtime HTTP localizado

- Informe automático completo: `site-current-full.json` / `site-current-full.md`.
- Auditoría `MWA-2a6a67e78f72`, ejecución `complete`, 71 páginas procesadas.
- 17 grupos de rutas declarados: 15 pasan en los cuatro locales y 2 fallan por usar literalmente `{slug}`.
- 136 hallazgos `major` abiertos, distribuidos de forma simétrica: 34 por locale.
- 60 fallos `SEO-CANONICAL-001` y 60 fallos `SEO-HREFLANG-SELF-001`.
- 8 fallos `SEO-HTTP-001` y 8 fallos `COV-001` corresponden a `/perfiles/{slug}` y `/servicios/{slug}` probados literalmente, no a un slug real.
- `I18N-HTML-LANG-001`, UTF-8, nombres del selector y señales estáticas de accesibilidad del selector pasan en las rutas públicas con prefijo.
- Hidratación, lector de pantalla, foco real, reflow y recorridos con efectos quedan `not-tested` en esta auditoría estática.

La ausencia de canonical y `hreflang` es coherente con el estado intencional `DEFAULT_DRAFT`: el sitio observado está `noindex` y carece de origen publicable aprobado. Es una protección correcta para el borrador, pero sigue siendo un bloqueador de publicación, no evidencia de preparación SEO.

## Resultado 3 — preview sintético por query

Comprobación HTTP muestral de:

- `/preview-local-sintetico?lang=es`
- `/preview-local-sintetico?lang=en`
- `/preview-local-sintetico?lang=fr`
- `/preview-local-sintetico?lang=it`

Las cuatro URLs responden HTTP 200, pero el documento se sirve siempre con `<html lang="es">`. Por tanto, las variantes `en`, `fr` e `it` no declaran correctamente el idioma de página y presentan riesgo de desacuerdo entre SSR e hidratación.

Además:

- La portada del preview conserva en español la marca secundaria, navegación, hero, filtros, catálogo de perfiles, bloques de servicios, controles y pie; solo la sección de ciudades y sus textos auxiliares cambian parcialmente con `lang`.
- El hub y detalle de servicios sí consumen un catálogo localizado y marcan su contenedor con `lang={locale}`, pero el `<html>` exterior continúa en español.
- Las fichas sintéticas de perfiles preservan `lang` en los enlaces, pero el contenido visible y los nombres accesibles siguen hardcodeados en español.
- El título del preview también permanece en español para las cuatro variantes.
- Al ser un harness local no indexable, no se exige canonical/hreflang para publicarlo; si se convierte en producto público, necesita URLs estables por locale, metadatos equivalentes y señales SEO completas.

Por ello, no puede afirmarse que todo el preview esté disponible en inglés, francés e italiano. El catálogo de servicios tiene avance real; la portada y las fichas de perfiles todavía no alcanzan equivalencia funcional ni lingüística.

## Hallazgos priorizados

### P0 — antes de una publicación multilingüe

1. Externalizar y traducir todo el texto hardcodeado de la portada y de las fichas sintéticas de perfiles.
2. Resolver el idioma del documento en SSR: preferiblemente rutas con prefijo (`/es/...`, `/en/...`, `/fr/...`, `/it/...`) o una arquitectura que genere `<html lang>` correcto desde la solicitud.
3. Reemplazar `{slug}` por slugs concretos de prueba en el inventario de auditoría, o incorporar un formato de plantillas que el rastreador pueda materializar de forma determinista.
4. Mantener el sitio `noindex` hasta que exista origen HTTPS aprobado y activación explícita; en ese momento retestar canonical, autorreferencia, reciprocidad, destinos y `x-default`.

### P1 — calidad y equivalencia

5. Ejecutar recorrido de selector, navegación, filtros, búsqueda, estados vacíos, detalle y retorno en los cuatro locales con navegador.
6. Probar expansión de texto, 200 %/400 %, teclado, foco y una muestra con tecnología de asistencia.
7. Revisar formatos, tono, terminología, copy SEO y texto legal con personas competentes por idioma y, donde corresponda, especialista sectorial.

### P2 — proceso editorial

8. Registrar hash de fuente aprobada, traductor/poseditor, segundo revisor independiente, fechas, alcance y hashes de destino.
9. Invalidar solo los segmentos afectados cuando cambie la fuente y repetir las pruebas de las páginas/recorridos que los consumen.

## Evidencia y retest

- Catálogos: `catalogs-current.json`, `catalogs-current.md`.
- Sitio completo: `site-current-full.json`, `site-current-full.md`.
- Primera ejecución parcial conservada: `site-current.json`, `site-current.md`; agotó `max-requests=100` y no debe sustituir el informe completo.
- Comandos y códigos: `COMANDOS_Y_RESULTADOS.md`.

Comando de retest del paquete:

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\validate_report.py validate --input output/audit-20260830-progress-and-barcelona-zone/multilingual/catalogs-current.json --enforce-gate
```

Comando de retest del sitio:

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\validate_report.py validate --input output/audit-20260830-progress-and-barcelona-zone/multilingual/site-current-full.json --enforce-gate
```
