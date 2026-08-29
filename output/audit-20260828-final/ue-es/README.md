# Refresh UE/Espana — PecadosVip — 2026-08-28

## Resultado

La revision pasiva del arbol de trabajo **no habilita publicacion**. La compuerta final sigue en **NO-GO**. Este resultado no es una certificacion de conformidad ni sustituye asesoria juridica.

El perfil se resolvio antes de validar controles. Resultado preliminar: 2 modulos `APPLICABLE`, 7 `UNCERTAIN` y 6 `NOT_APPLICABLE`. Privacidad y baseline tecnico pasivo son aplicables al alcance declarado; cookies, accesibilidad, consumo, DSA y los posibles nexos ENS/ENI conservan incognitas materiales.

## Evidencia de las comprobaciones

| Comprobacion | Exit code | Resultado prudente |
|---|---:|---|
| Resolver aplicabilidad | 0 | 2 `APPLICABLE`, 7 `UNCERTAIN`, 6 `NOT_APPLICABLE` |
| Validar registro y catalogo | 0 | Integro: 56 instrumentos, 46 controles, 56 referencias; 48/48 fuentes vinculantes completas |
| Frescura estricta a 2026-08-28, 30 dias | 1 | 52 `FRESH`, 0 `STALE`, 4 `PENDING_VERIFICATION`; la compuerta falla de forma deliberada y segura |
| Validar esquema del informe vigente | 0 | `compliance/ue-es/audit.json` es estructuralmente valido; esto no actualiza ni prueba sus hechos o conclusiones |

Las cuatro fuentes con estado material pendiente son `EU-DIR-2023-2673`, `EU-GREEN-2024-825`, `EU-NIS2-2022-2555` e `ISO-IEC-25010-2023`. El comprobador solo evalua antiguedad/estado del registro local: no consulta Internet y no interpreta reformas, transposiciones ni aplicabilidad.

## Snapshot y limites

- Observado a `2026-08-29T02:00:48Z` (fecha local de auditoria: 2026-08-28).
- Rama: `codex/pagina-web-checkpoint`.
- HEAD: `35a9f1313c0a044473f8747af415830f469237bc`.
- Arbol de trabajo no limpio: 62 entradas al momento de la captura; el candidato no esta ligado a un commit limpio.
- No se observo ni audito una URL desplegada.
- No se ejecutaron envios de formularios, autenticacion, compras, pagos, escaneo activo, inyeccion, fuzzing ni pruebas contra terceros.
- No se modificaron codigo ni archivos existentes de `compliance/`; las unicas escrituras son estos entregables nuevos bajo `output/audit-20260828-final/ue-es`.

## Motivos que mantienen el NO-GO

Siguen faltando hechos y aprobaciones externas: operador/establecimiento/tamano; clasificacion exacta de la actividad y publicidad; modelo B2C y de contratacion a distancia; inventario autonomico dirigido; finalidades, bases, conservacion, destinatarios, transferencias, derechos, articulo 9 y cribado DPIA; derechos de imagen por persona/activo; inventario real de hosting/CDN/formularios/analitica/cookies/proveedores; textos legales aprobados; alcance y pruebas humanas de accesibilidad; revision linguistica humana identificada para es/en/fr/it; evidencia del origen desplegado; aceptacion y autorizacion de produccion.

## Comandos ejecutados

```text
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-ue-espana\scripts\resolve_applicability.py output\audit-20260828-final\ue-es\profile-input-2026-08-28.json --output output\audit-20260828-final\ue-es\applicability-resolver-2026-08-28.json
# exit 0

python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-ue-espana\scripts\validate_catalog.py --legal-register C:\Users\artot\.codex\skills\auditar-web-ue-espana\references\legal-register.yaml --control-catalog C:\Users\artot\.codex\skills\auditar-web-ue-espana\references\control-catalog.yaml --json
# exit 0; stdout conservado en catalog-validation-2026-08-28.json

python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-ue-espana\scripts\check_source_freshness.py --registry C:\Users\artot\.codex\skills\auditar-web-ue-espana\references\legal-register.yaml --as-of 2026-08-28 --max-age-days 30 --fail-on-stale --fail-on-pending --output output\audit-20260828-final\ue-es\source-freshness-strict-2026-08-28.json
# exit 1: cuatro estados materiales PENDING_VERIFICATION; no hay fuentes STALE

python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-ue-espana\scripts\validate_report.py validate --schema audit --input compliance\ue-es\audit.json --json
# exit 0; stdout conservado en current-report-schema-validation-2026-08-28.json
```

Los cuatro scripts se consultaron primero con `--help`; `validate_report.py validate --help` tambien se ejecuto antes de la validacion.
