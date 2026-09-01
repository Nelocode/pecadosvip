# PecadosVip Beta 0.1.0-beta.1

- Fecha de congelación local: 31 de agosto de 2026.
- Identificador semántico: `0.1.0-beta.1`.
- Etiqueta Git local: `v0.1.0-beta.1`.
Rama de origen: `codex/design-sync-20260829`

## Qué conserva esta Beta

Esta Beta congela el estado local actual del proyecto PecadosVip, incluidos:

- el preview sintético navegable con perfiles ficticios adultos;
- inicio, perfiles, servicios y coberturas enlazadas;
- contenidos técnicos para español, inglés, francés e italiano;
- imágenes sintéticas y simbólicas seleccionadas;
- ciudades y zonas con sus imágenes de referencia;
- favicon transparente;
- correcciones tipográficas y de composición responsive;
- mosaico dorado de fondo completo, tenue en reposo y con iluminación localizada en equipos compatibles;
- pruebas, controles fail-closed, documentación y guías de publicación.

## Estado de la Beta

Esta denominación representa un checkpoint técnico local recuperable. No significa que el sitio esté publicado, aceptado por el cliente, certificado legalmente ni aprobado para producción.

- `productionActivation`: `false`.
- Indexación pública: cerrada por defecto.
- Contacto, reservas y canales externos: permanecen sujetos a sus gates y aprobaciones.
- Revisión lingüística humana final: pendiente.
- Aceptación formal del cliente: pendiente.
- Push a GitHub y despliegue: no forman parte automática de este checkpoint.

## Verificación ejecutada antes de congelar

El comando `pnpm run release:verify` terminó correctamente sobre la candidata Beta:

- lint y TypeScript: aprobados;
- pruebas automatizadas: 205 de 205 aprobadas;
- compilación Vinext: cinco de cinco entornos aprobados;
- validación multilingüe técnica: `PASS_WITH_LIMITS` para `es`, `en`, `fr` e `it`;
- scorecard técnico local: 98 de 100;
- SBOM CycloneDX: 612 componentes, SHA-256 `c24507655ee24704ff7cb6b9af3bbd44387e10155f907a5027af9f44a4c274d33`;
- artefacto worker: 0 violaciones, reporte SHA-256 `e5f2b5c1ab0ddfc5df5d45624970a1ffddb11f1ec89260ae2aa2f73a6716391fd`;
- artefacto standalone: 0 violaciones, reporte SHA-256 `c87dd43f758bbeaaeea414f27f580f13b4143c8cbbdd4c17d5379f370458ab3ef`;
- smoke productivo local: `PASS`, manteniendo `productionActivation:false`, `robotsDisallowAll:true` y las rutas del preview bloqueadas en producción.

Esta verificación se ejecutó en loopback local. No es una prueba del servidor Easypanel, una aceptación de usuario ni una auditoría legal concluyente.

## Cómo recuperar esta versión

Después de crear la etiqueta local, el estado versionado se recupera en una rama nueva con:

```powershell
git switch -c recuperacion-beta-0.1.0 v0.1.0-beta.1
```

Este comando no borra el trabajo actual. Antes de usarlo, conviene confirmar que el árbol de trabajo no tenga cambios sin guardar mediante `git status`.

## Cómo comprobarla

Desde la raíz del proyecto:

```powershell
pnpm install
pnpm run release:verify
pnpm run dev:preview
```

Luego abre:

`http://localhost:3000/preview-local-sintetico?lang=es#inicio`

## Archivos de entrega

El ZIP cuyo nombre contiene `beta-0-1-0-beta-1` es la copia sanitizada para traslado. Incluye el código y las instrucciones de publicación, pero excluye `.git`, dependencias instaladas, compilaciones temporales, otros ZIP, secretos, archivos `.env`, datos reales del CMS y carpetas privadas.

El SHA-256, tamaño y conteo exactos del ZIP se calculan después de su creación y deben acompañarlo siempre que se copie o comparta.
