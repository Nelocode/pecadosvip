# Comandos y resultados reproducibles

Fecha: 2026-08-30

## Comparación de catálogos

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\compare_locales.py --source-locale es --locales es,en,fr,it --catalog es=compliance/multilingual/catalogs/es.json --catalog en=compliance/multilingual/catalogs/en.json --catalog fr=compliance/multilingual/catalogs/fr.json --catalog it=compliance/multilingual/catalogs/it.json --allowlist compliance/multilingual/allowlist.txt --content-contracts compliance/multilingual/content-contracts.json --output-json output/audit-20260830-progress-and-barcelona-zone/multilingual/catalogs-current.json --output-markdown output/audit-20260830-progress-and-barcelona-zone/multilingual/catalogs-current.md --overwrite
```

Resultado: código `3`; 0 hallazgos; publicación `NO DETERMINABLE POR FALTA DE EVIDENCIA` debido a ausencia de revisión humana y por tratarse solo del paquete de traducción.

## Rastreo HTTP completo

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\audit_site.py --base-url http://localhost:3000 --source-locale es --locales es,en,fr,it --locale-path es=/es/ --locale-path en=/en/ --locale-path fr=/fr/ --locale-path it=/it/ --inventory compliance/multilingual/route-inventory.json --allowed-host localhost --allow-private-hosts --max-urls 100 --max-requests 220 --max-depth 0 --rate-limit 0 --timeout 5 --max-bytes 1048576 --max-redirects 3 --method GET --render-mode http --output-json output/audit-20260830-progress-and-barcelona-zone/multilingual/site-current-full.json --output-markdown output/audit-20260830-progress-and-barcelona-zone/multilingual/site-current-full.md --overwrite
```

Resultado: código `1`; ejecución `complete`; 71 páginas; 136 bloqueadores `major`; publicación `NO APTO`.

## Validación estricta

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\validate_report.py validate --input output/audit-20260830-progress-and-barcelona-zone/multilingual/catalogs-current.json --enforce-gate
```

Resultado: código `3`; `PARTIAL: informe válido, pero la evidencia no permite aprobar publicación.`

```powershell
python -B -X utf8 C:\Users\artot\.codex\skills\auditar-web-multilingue\scripts\validate_report.py validate --input output/audit-20260830-progress-and-barcelona-zone/multilingual/site-current-full.json --enforce-gate
```

Resultado: código `1`; `BLOCK: informe válido con 136 bloqueador(es).`

## Validador interno del proyecto

```powershell
pnpm run i18n:validate
```

Resultado actual: código `0`; `PASS_WITH_LIMITS`; locales `es,en,fr,it`; 0 incidencias de catálogo; 17 plantillas de ruta; revisión lingüística `PENDIENTE DE REVISIÓN HUMANA`; publicación `NO DETERMINABLE POR FALTA DE EVIDENCIA`.

Durante la auditoría, este comando detectó una expectativa obsoleta que rechazaba `x-default`. El contrato fue alineado por el agente principal y la repetición documentada arriba pasó. Esto prueba el validador local actual, no el sitio publicado ni la aprobación lingüística.

## Preview por query

Se solicitaron por HTTP las cuatro variantes de `/preview-local-sintetico?lang=<locale>`. Todas respondieron 200. En las cuatro respuestas se observó `<html lang="es">`; el título fue `PecadosVip · Previsualización local sintética | PecadosVip`; no se observaron canonical ni `hreflang`, coherente con el harness local no indexable.
