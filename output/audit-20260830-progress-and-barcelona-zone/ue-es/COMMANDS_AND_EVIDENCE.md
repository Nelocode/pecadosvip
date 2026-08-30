# Comandos y evidencia — auditoría UE/España 2026-08-30

Alcance: árbol local en `ec6190ecc23a29d6cbdd0b3977cdfb3f09a1b3a9` con cambios sin commit y preview sintético de loopback. No se autenticó, no se envió ningún formulario, no se ejecutaron compras/pagos ni pruebas activas.

## Herramientas de la skill

Antes de usarlos se ejecutó `--help` para:

- `resolve_applicability.py`
- `check_source_freshness.py`
- `validate_catalog.py`
- `noninvasive_collect.py`
- `validate_report.py`, incluidos `validate`, `schema-check` y `finding-id`

Comandos reproducibles principales, ejecutados con `python -B -X utf8`:

```powershell
python -B -X utf8 <skill>/scripts/resolve_applicability.py profile-20260830.json --output resolver-output-20260830.json --overwrite
python -B -X utf8 <skill>/scripts/validate_catalog.py --legal-register <skill>/references/legal-register.yaml --control-catalog <skill>/references/control-catalog.yaml --json
python -B -X utf8 <skill>/scripts/check_source_freshness.py --registry <skill>/references/legal-register.yaml --as-of 2026-08-30 --max-age-days 30 --fail-on-stale --fail-on-pending --output source-freshness-20260830.json
python -B -X utf8 <skill>/scripts/noninvasive_collect.py --fixture <screenshot> --output evidence/<manifest>.json --max-bytes 2000000
python -B -X utf8 <skill>/scripts/validate_report.py schema-check --schema-dir <skill>/references/schemas
python -B -X utf8 <skill>/scripts/validate_report.py validate --schema finding --input findings/<id>.json --schema-dir <skill>/references/schemas --json
python -B -X utf8 <skill>/scripts/validate_report.py validate --schema audit --input audit-20260830.json --schema-dir <skill>/references/schemas --json
```

## Resultados

- Resolver: completado; su salida es preliminar y fue revisada manualmente.
- Catálogo: `ok=true`; 56 instrumentos, 46 controles, 56 referencias y 48/48 leyes vinculantes completas.
- Freshness: 52 `FRESH`, 4 `PENDING_VERIFICATION`; salida deliberadamente no cero con `--fail-on-pending`. Los pendientes son transposición/detalle legítimamente abierto, no fuentes antiguas.
- Esquemas: sintaxis y `$ref` válidos.
- Hallazgos: 6/6 JSON válidos con IDs deterministas.
- Tests enfocados: 16/16 `PASS` en contratos de accesibilidad, contacto y legales.

## Recolección no invasiva

Se creó `local-get-authorization.json` con presupuesto de tres GET pasivos al host exacto `127.0.0.1`. Los tres intentos terminaron con `WinError 10061`; el proceso de auditoría no pudo alcanzar el servidor de loopback que estaba disponible en el contexto del navegador. No se persistió cuerpo HTTP y los controles de red/almacenamiento dependientes quedaron `NOT_TESTED`.

Como alternativa dentro del alcance, `noninvasive_collect.py --fixture` generó manifiestos y SHA-256 de tres capturas existentes del navegador:

- cobertura: `468c42b7dc4f37f33ea8135e78966e46b3a99a78265aeb883df3ce2658c4190e`
- servicios: `db1ea0fdc0c8b538fffbc9b9cd68fe13c64e490713a4113d54813592830d29d5`
- perfil Sofía: `a47070612f5797f0d7e58b266ba9c109f96815945f52523987d72579c0fea4d6`

La evidencia visual se utilizó solo para confirmar señales visibles —preview local/no publicar, perfil ficticio, etiquetado IA, cobertura no confirmada y contacto desactivado—, no para inferir comportamiento backend.

## Fuentes oficiales reabiertas el 2026-08-30

- EUR-Lex RGPD consolidado: `CELEX:02016R0679-20160504`.
- BOE LOPDGDD: `BOE-A-2018-16673`.
- BOE LSSI: `BOE-A-2002-13758`, incluidos arts. 10 y 22.2.
- BOE Ley 11/2023: `BOE-A-2023-11022`, alcance de servicios de comercio electrónico y excepción de microempresas prestadoras de servicios.
- BOE RD 193/2023: `BOE-A-2023-7417`, calendario de la disposición final sexta.
- EUR-Lex AI Act consolidado tras Reglamento 2026/1744: `CELEX:02024R1689-20260727`, arts. 50, 111 y 113.
- EUR-Lex DSA: Reglamento (UE) 2022/2065.
- BOE Ley General de Publicidad: `BOE-A-1988-26156`, arts. 2, 3 y 6.
- BOE Ley Orgánica 10/2022: `BOE-A-2022-14630`, art. 11.

El contenido oficial fue usado para alcance, vigencia y disposiciones; esta auditoría no sustituye revisión jurídica profesional.
