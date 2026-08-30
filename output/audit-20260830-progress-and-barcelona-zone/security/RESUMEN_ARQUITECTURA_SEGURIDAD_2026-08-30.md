# Resumen de arquitectura de seguridad — PecadosVip

Fecha: **2026-08-30**
Repositorio revisado: árbol actual basado en `ec6190ecc23a29d6cbdd0b3977cdfb3f09a1b3a9`
Alcance: arquitectura y controles del repositorio; inspección offline de fuente y evidencia existente
Límite: **no es un pentest, no valida el despliegue y no afirma ausencia de vulnerabilidades**

## Conclusión ejecutiva

La arquitectura tiene un patrón defensivo coherente: borrador cerrado por defecto, activación explícita, proyección pública mínima, contactos con múltiples gates, CMS local separado, rutas y archivos acotados, artefactos diferenciados y contenedor no-root. El estado de producción declarado sigue en **holding fail-closed**.

Las preguntas más importantes no están en un bypass remoto ya demostrado, sino en la coherencia entre valores de build y runtime, la falta de infraestructura productiva observable y varias diferencias entre documentación y código. Esas preguntas deben resolverse antes de convertir el holding en release.

## Componentes y controles propietarios

| Componente o flujo | Recurso/autoridad | Control que realmente lo protege | Estado observado |
|---|---|---|---|
| Sitio público Next/Vinext | Contenido, rutas, SEO y contacto | Release gate agregado y proyección pública | Cerrado por defecto. |
| Activación runtime Node | Snapshot aprobado | Root/source absolutos, no symlink, límites, hash, schema, evidencia, `productionActivation` y activación explícita | Soportado condicionalmente; no hay snapshot desplegado verificado. |
| OpenAI Sites/Cloudflare | Worker | `nodejs_compat`; D1/R2 no configurados | Persistencia/FS efectiva no resuelta. |
| Contactos públicos | WhatsApp, Telegram, teléfono, email y formulario | Normalización por canal, aprobación de contacto/privacidad, release y coincidencia exacta snapshot/env | Vacíos y deshabilitados en defaults. |
| SEO/canonical/headers | Navegador y crawlers | HTTPS normalizado, flags de indexación, release, CSP y `X-Robots-Tag` | `noindex`, robots cerrado y sitemap vacío. |
| CMS local | Perfil, evidencia, aprobación y medios | Loopback, bearer token digerido, roles server-side, Origin exacto, idempotencia y revisión optimista | Solo desarrollo/pruebas. |
| Persistencia local | `profiles.json`, medios y locks | Paths absolutos, no symlink, schema, hashes, escrituras durables y locks cooperativos | Texto plano; no distribuido. |
| Backup/restore | Copia y reemplazo de estado | Rutas disjuntas, manifest/hashes, staging, overwrite explícito y rollback | Local; sin cifrado. |
| Candidato de publicación | Proyección pública | Minimización, release gate, hash y `productionActivation:false` | Solo revisión local. |
| Standalone/Docker | Código ejecutable | Contexto deny-all, lockfile, validadores, base por digest y usuario no-root | Validado localmente; Docker Linux no probado. |
| ZIP de etapa | Código, evidencia e insumos del cliente | Allowlist/exclusiones, secret patterns, hashes e inventario | Custodia posterior manual. |

## Activos protegidos

- Perfiles, evidencia de mayoría de edad, consentimiento, derechos y aprobación.
- Medios, hashes, referencias de derechos y auditoría.
- Tokens admin/editor y las capacidades que conceden.
- Destinos de contacto y datos enviados por visitantes al formulario.
- Snapshot de contenido, evidencia de release y origen canónico.
- Estado local, backups, candidatos y ZIPs confidenciales.
- Código, lockfile, artefactos worker/standalone e imagen candidata.

## Límites de confianza esenciales

1. **Internet → sitio público.** El visitante controla rutas y query, no estado CMS, rol, aprobación ni activación.
2. **Proceso público → snapshot runtime.** El filesystem configurado se vuelve autoridad de publicación solo si pasan todos los controles.
3. **Build → runtime.** Variables `NEXT_PUBLIC_*` y headers se calculan en build/config; el snapshot puede resolverse después.
4. **Sitio → terceros de contacto.** Cada canal tiene destinatario y autoridad independientes.
5. **Operador local → workbench.** El token concede rol; no representa identidad humana ni MFA.
6. **Workbench → filesystem.** Datos y medios locales permanecen en texto plano y dependen también de controles del host.
7. **Repositorio → builder/container.** El contexto y artefacto deben permanecer ligados al SHA/digest exacto.
8. **Repositorio/insumos externos → ZIP/revisor.** El archivo puede contener material confidencial aunque el script filtre secretos conocidos.

## Controles efectivos confirmados por fuente

- `lib/content/runtime-content-activation.ts:833-940`: cualquier fallo conserva el draft; el candidato local nunca activa producción.
- `lib/content/runtime-content-source.ts:194-351`: paths absolutos/contenidos, no symlink, límites y fallo cerrado si no existe IO runtime.
- `lib/content/runtime-publication.ts:39-90`: los contactos renderizados provienen del snapshot aprobado y deben coincidir exactamente con entorno.
- `lib/contact-destinations.ts:5-68`: hosts/esquemas acotados por canal.
- `next.config.ts:12-85`: CSP, framing, MIME sniffing, permisos, referrer y noindex global.
- `lib/workbench/local-cms-workbench.ts:212-325`: bearer digest, comparación timing-safe, Origin exacto y límites JSON.
- `lib/content/repository.ts:848-943`: evidencia, aprobación y auditoría requieren admin.
- `.dockerignore:1-65`, `Dockerfile:1-47`: contexto mínimo, denegación final de credenciales, base por digest y runtime no-root.

## Discrepancias y preguntas abiertas

Estas son superficies de endurecimiento o verificación; **no se presentan como vulnerabilidades explotables confirmadas**.

### 1. Headers de build frente a snapshot runtime — P0

`next.config.ts:58-68` calcula `X-Robots-Tag` y `form-action` usando el estado visible durante build/config. Las páginas pueden volver a resolver un snapshot montado en runtime. No se observó un binding que garantice que headers, contacto y release pertenecen al mismo snapshot.

Prerequisito de impacto: activar en runtime un snapshot distinto del usado para construir el artefacto.

### 2. Dos orígenes canónicos sin igualdad explícita — P0

El snapshot exige `settings.canonicalOrigin`, mientras `NEXT_PUBLIC_SITE_URL` controla canonical/sitemap. Ambos se validan como HTTPS, pero no aparece una comparación exacta equivalente a la de contactos.

Prerequisito de impacto: dos valores válidos diferentes y release/indexación abiertos.

### 3. Media HTTPS frente a CSP/Next Image — P1

La validación permite URLs HTTPS sin credenciales, pero CSP declara `img-src 'self' data:` y `media-src 'self'`; `next.config` no declara allowlist remota. Debe definirse si producción usará solo rutas same-origin o un CDN explícitamente autorizado.

### 4. Runtime content en worker — P1

El adaptador necesita builtins Node/FS; el worker declara `nodejs_compat`, sin D1/R2. El código falla cerrado si IO no está disponible, pero falta demostrar el mecanismo de contenido efectivo en la plataforma.

### 5. Documentación de locks desactualizada — P2

README/arquitectura dicen serialización solo in-process; el código actual usa locks por archivo para procesos cooperativos. Aun así no hay lease distribuido, limpieza automática de locks huérfanos ni transacción global perfiles/medios.

### 6. Documentación de transformación de imágenes desactualizada — P2

README/runbook dicen que no hay variantes; el store actual genera WebP desktop/mobile y elimina metadatos. El control efectivo es mejor que el texto, pero la operación necesita documentación correcta.

### 7. Digest Docker documentado de forma contradictoria — P2

README afirma base no fijada; el Dockerfile actual sí fija digest en build y runner. Falta construir la imagen real y registrar su digest resultante.

### 8. Custodia del ZIP de etapa — P1

El script escribe primero el ZIP confidencial bajo el checkout OneDrive. Moverlo a almacenamiento cifrado/no sincronizado y eliminar la copia inicial es una instrucción manual, no un control automático.

## Ausencias que permanecen explícitas

- No hay CMS productivo, IdP/MFA, base transaccional, almacenamiento de objetos/CDN ni cifrado en reposo.
- No hay evidencia de TLS/proxy, WAF, secretos de plataforma, observabilidad, alertas o rollback desplegados.
- No hay build Docker Linux observado, staging, E2E live, pentest ni tecnología de asistencia.
- El SCA por versión conserva advisories de `image-size@2.0.2`; existe parche/VEX y exclusión del standalone, pero ello no equivale a auditoría limpia.
- Un escaneo integrado anterior quedó `FAILED / NOT_TESTED`; esta arquitectura no debe usarse para marcar SAST como PASS.

## Roadmap de endurecimiento

### P0 — requisito para abrir release

1. Construir un único manifiesto de release que ate SHA/digest, variables de build, snapshot, origen canónico, contactos, headers y aprobaciones.
2. Rebuild desde el snapshot aprobado; después validar runtime y headers del mismo artefacto.
3. Exigir igualdad exacta entre `canonicalOrigin` aprobado y `NEXT_PUBLIC_SITE_URL` efectivo.
4. Mantener holding/noindex/contacto cerrado hasta resolver legal, privacidad, contenido, derechos y operación.

### P1 — staging seguro

1. Definir almacenamiento productivo de contenido/media: same-origin o CDN allowlisted con CSP e integración Next coherentes.
2. Probar worker y standalone por separado; si worker no soporta FS, usar un binding persistente diseñado para esa plataforma.
3. Implementar IdP/MFA, autorización y auditoría productivas; cifrado, backup/restore y secretos administrados.
4. Automatizar custodia cifrada del ZIP o generar directamente fuera de carpetas sincronizadas.
5. Ejecutar SAST/alcanzabilidad, revisión de dependencias y pentest según exposición real.

### P2 — consistencia operativa

1. Corregir README/runbooks sobre locks, variantes de imagen y digest Docker.
2. Documentar recuperación segura de locks huérfanos y límites de concurrencia.
3. Mantener tabla de recursos efectivos por despliegue para evitar que nuevas rutas oculten cambios de autoridad.

## Estado final

- Arquitectura local defensiva: **sólida con preguntas abiertas**.
- Producción por defecto: **holding fail-closed**.
- Vulnerabilidades remotas confirmadas por este documento: **no evaluadas como conjunto; no se afirma ausencia**.
- Entorno desplegado/live: **no probado y no modificado**.
