# Imágenes sintéticas de servicios

Este directorio contiene imágenes editoriales originales que simbolizan las familias de servicios del preview local de PecadosVip. No representan una prestación activa, una ubicación real, una disponibilidad confirmada ni personas reales.

## Estado y límites

- Uso actual: únicamente `/preview-local-sintetico`, con `noindex` y acceso limitado a loopback durante desarrollo.
- Publicación: bloqueada. `public_path` permanece vacío en `ASSET_MANIFEST.csv`.
- Revisión humana: pendiente.
- Revisión jurídica/editorial para publicación: pendiente.
- Contenido: ambientes y objetos; sin personas, desnudez, actos explícitos, marcas, hoteles identificables o texto incrustado.
- Transparencia visible: la interfaz muestra un disclosure localizado de imagen simbólica generada con IA.

## Estructura

- `master/`: PNG originales de 1122 × 1402 px. Se conservan sin sobrescribir.
- `selected/`: WebP de 960 × 1200 px, calidad 86, preparados para la maqueta local.
- `ASSET_MANIFEST.csv`: rutas, fechas y SHA-256 de cada maestro y derivado.
- `PROMPTS_V1.md`: especificación de generación reproducible y mapeo editorial.

Los assets se sirven mediante una allowlist local en `scripts/vite-local-synthetic-media.ts`; no se copian a `public/` antes de aprobación.

## Regeneración

La primera tanda se produjo con el ImageGen integrado en Codex. Los prompts quedan versionados en `PROMPTS_V1.md`. Para repetir el lote con el CLI de OpenAI, configure `OPENAI_API_KEY` localmente y nunca incluya la clave en el repositorio, el ZIP o el chat.

## Aprobación previa a publicación

1. Revisar visualmente cada maestro y derivado a tamaño completo.
2. Confirmar que no hay texto, marcas, personas, lugares identificables ni objetos no previstos.
3. Validar licencias, disclosure, textos alternativos y encaje jurídico con asesoría humana.
4. Actualizar el manifiesto y los gates de publicación.
5. Solo entonces preparar variantes públicas optimizadas.
