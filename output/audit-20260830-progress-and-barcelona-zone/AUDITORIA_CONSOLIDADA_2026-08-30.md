# Auditoría consolidada — progreso, zona Barcelona y readiness de PecadosVip

Fecha: **2026-08-30**
Base Git observada: `ec6190ecc23a29d6cbdd0b3977cdfb3f09a1b3a9` con cambios locales posteriores
Alcance: producto/UX, ingeniería local, arquitectura de seguridad, multilingüe y UE/España
Modo: consolidación de evidencia y revalidación local; sin commit, push, deploy ni cambios externos

## Decisión ejecutiva

La corrección visual de la cuarta zona Barcelona está cerrada en el preview local y la evidencia técnica registra una puerta local completa en PASS. Sin embargo, PecadosVip **no está listo para publicación ni operación comercial**.

No se presenta un porcentaje único falso. Los ejes válidos son:

| Eje | Estado actual | Lectura correcta |
|---|---|---|
| Ingeniería técnica local | **98/100** | Proxy de ejecución técnica local, no readiness global. |
| Requisitos estrictos | **2/20 `VERIFIED`**; 12 `PARTIAL`, 5 `BLOCKED`, 1 `AT_RISK` | La mayoría del encargo aún no tiene aceptación completa. |
| Producto/UX sintético | **PASS WITH LIMITS local** | Flujo y zona Barcelona observados; no es producto real. |
| Multilingüe técnico | **NO CONFORME** | Runtime observado conserva bloqueadores técnicos. |
| Revisión lingüística | **PENDIENTE DE REVISIÓN HUMANA** | No hay aprobación independiente de EN/FR/IT. |
| Publicación multilingüe | **NO APTO** | No existe equivalencia ni evidencia suficiente para publicar. |
| UE/España | **NO-GO** | Faltan clasificación jurídica, operador, privacidad y decisiones materiales. |
| Seguridad | **Arquitectura defensiva con preguntas abiertas** | No equivale a SAST, pentest ni validación live. |
| Producción configurada | **Holding fail-closed** | Publicación, indexación y contacto permanecen cerrados. |
| Despliegue live | **NO PROBADO / SIN CAMBIOS** | No se desplegó ni modificó infraestructura externa. |

## Qué avanzó realmente

1. **Zona Barcelona:** Sitges completa una cuadrícula 2 × 2 junto a Barcelona, Tarragona y Girona; desaparece la celda vacía.
2. **Responsive:** cobertura y directorio de servicios cuentan con evidencia a 1440, 1180, 780 y 390 px sin overflow visible.
3. **Flujo local:** búsqueda, filtros, orden, selección limitada, ficha/FAQ, perfiles Barcelona, Sofía, selector de idiomas y menú móvil operaron según `design-qa.md`.
4. **Puerta técnica:** la evidencia registrada para esta etapa reporta lint, TypeScript, **204/204** pruebas, build, i18n, scorecard, SBOM, worker/standalone y smoke fail-closed en PASS.
5. **Tipografía y marca:** títulos con interlineado seguro y mediciones sin solapamiento; favicon dorado con transparencia real y derivados deterministas.
6. **Fail-safe:** el runtime público permanece en `DEFAULT_DRAFT`; contacto, reserva, indexación y contenido real no se abrieron.

Nada de lo anterior prueba un deployment, aceptación contractual, conformidad jurídica, WCAG o publicación multilingüe.

## Requisitos: estado exacto

| Estado | Cantidad | Ejemplos materiales |
|---|---:|---|
| `VERIFIED` | 2 | Esquema de perfiles; arquitectura no limitada a ocho perfiles. |
| `PARTIAL` | 12 | Sitio/rutas, copy, CMS local, medios, handoff, documentación, SEO inicial y flujo de perfiles. |
| `BLOCKED` | 5 | Cobertura real, keyword research, canales reales, marca/diseño aprobado y paquete legal/edad. |
| `AT_RISK` | 1 | Plazo contractual histórico. |

La cifra **98/100** y el resultado **2/20** miden cosas distintas y deben mantenerse separados.

## Producto y UX

### Estado positivo local

- Jerarquía visual premium coherente.
- Disclosure visible de contenido ficticio/IA y cobertura no confirmada.
- Sitges corrige la asimetría de Barcelona.
- Flujo navegable y responsive en el harness local.
- Menú móvil con controles de foco documentados.

### Límites

- No hay diseño controlador formalmente aprobado.
- El contenido real, las áreas operativas, las condiciones y los perfiles no están aprobados.
- Faltan teclado completo, zoom 200/400 %, AT, contraste/targets y UAT por locale.
- El flujo público termina en holding; contacto y reserva están desactivados.

Informe: [Auditoría de producto y UX](product-design/AUDITORIA_PRODUCTO_Y_UX_2026-08-30.md).

## Ingeniería técnica

- El scorecard local conserva **98/100**.
- La evidencia final de la etapa registra **204/204** pruebas y subgates locales en PASS.
- El árbol contiene cambios sin commit; la nueva evidencia no es un release inmutable.
- Worker y standalone están validados localmente; Docker Linux/EasyPanel no están probados.
- No hay staging, E2E live, observabilidad ni rollback real.

Informe: [Resumen técnico](technical/RESUMEN_AUDITORIA_TECNICA_2026-08-30.md).

## Multilingüe

- 348 segmentos estructurales aparecen en ES/EN/FR/IT y no hay fallos de claves/placeholders en catálogos.
- El runtime HTTP `DEFAULT_DRAFT` queda **NO CONFORME**: sin canonical/hreflang y con dos plantillas `{slug}` probadas literalmente.
- El preview por query mantiene `<html lang="es">` y copy español fuera de ES.
- Dictámenes: **NO CONFORME**, **PENDIENTE DE REVISIÓN HUMANA**, **NO APTO**.

Informe: [Resumen multilingüe](multilingual/RESUMEN_AUDITORIA_MULTILINGUE_2026-08-30.md).

## UE/España

La decisión permanece **NO-GO**, sin afirmar que el servicio sea ilícito. Falta una clasificación jurídica escrita de actividad/publicidad, identidad del operador, gobierno RGPD/LOPDGDD, LSSI, cookies/terminal, accesibilidad aplicable, reglas Madrid/Catalunya y procedencia/uso de imágenes IA.

Informe: [Auditoría UE/España](ue-es/AUDITORIA_UE_ES_2026-08-30.md).

## Seguridad

### Controles fuertes

- Release y activación fail-closed.
- Contactos con normalización, aprobaciones y coincidencia exacta.
- CMS local loopback con roles, Origin, idempotencia y límites.
- Paths/hashes/staging para estado, medios, backups y candidatos.
- Contexto Docker mínimo, base por digest y runtime no-root.

### Preguntas prioritarias

1. Alinear headers de build con el snapshot activado en runtime.
2. Exigir igualdad entre canonical aprobado y `NEXT_PUBLIC_SITE_URL`.
3. Resolver medios HTTPS frente a CSP/Next Image.
4. Definir contenido persistente para worker o usar un binding adecuado.
5. Cerrar custodia cifrada del ZIP fuera de OneDrive.

Informe: [Resumen de arquitectura de seguridad](security/RESUMEN_ARQUITECTURA_SEGURIDAD_2026-08-30.md).

## Gate de publicación

El sitio debe permanecer en **holding, noindex y sin contacto** hasta cerrar simultáneamente:

1. Commit candidato limpio y artefacto ligado a SHA/digest.
2. Contenido/cobertura/perfiles reales con derechos y consentimiento.
3. Legales, actividad/publicidad, operador y privacidad aprobados.
4. Equivalencia lingüística y revisión humana ES/EN/FR/IT.
5. Accesibilidad manual y tecnología de asistencia.
6. Docker/staging/EasyPanel, secretos, TLS/proxy, observabilidad y rollback.
7. E2E, seguridad/performance desplegadas, UAT y aceptación.
8. Autorizaciones separadas de merge, deploy e indexación.

## Roadmap consolidado

### P0 — mantener NO-GO y cerrar evidencia material

1. Mantener fail-closed el runtime público.
2. Seleccionar referencia visual, contenido, cobertura y perfiles aprobados.
3. Obtener clasificación jurídica española, textos legales, gobierno de datos y derechos de medios/personas.
4. Corregir equivalencia multilingüe, `<html lang>` y revisión humana.
5. Congelar commit/snapshot/orígenes/contactos/headers en un único manifiesto de release.
6. Repetir la puerta completa y la auditoría sobre el SHA candidato limpio.

### P1 — staging y aceptación

1. Construir Docker Linux y desplegar staging ligado a SHA/digest.
2. Implementar IdP/MFA, almacenamiento productivo, CDN/media, cifrado, backup y restore.
3. Ejecutar E2E por locale, HAR, headers, SEO, privacidad/CMP, accesibilidad y performance.
4. Ejecutar SAST/alcanzabilidad y pentest según exposición.
5. Cerrar UAT y GO conjunto de cliente, producto, seguridad, privacidad, accesibilidad y asesor jurídico.

### P2 — operación sostenible

1. Corregir documentación desactualizada sobre locks, variantes de imagen y digest Docker.
2. Automatizar trazabilidad, retests y custodia segura de paquetes.
3. Mantener regresión visual de Barcelona y de los cuatro viewports.
4. Definir observabilidad, alertas, rollback y revisión periódica de proveedores/dependencias.

## Archivos del paquete

- `product-design/AUDITORIA_PRODUCTO_Y_UX_2026-08-30.md`
- `technical/RESUMEN_AUDITORIA_TECNICA_2026-08-30.md`
- `security/RESUMEN_ARQUITECTURA_SEGURIDAD_2026-08-30.md`
- `multilingual/RESUMEN_AUDITORIA_MULTILINGUE_2026-08-30.md`
- `ue-es/AUDITORIA_UE_ES_2026-08-30.md`

## Cierre

**La etapa mejora claramente el preview local y conserva una base técnica 98/100, pero el resultado operativo sigue siendo 2/20 requisitos verificados, NO-GO UE/España, NO APTO multilingüe, producción fail-closed y live no probado/sin cambios.**
