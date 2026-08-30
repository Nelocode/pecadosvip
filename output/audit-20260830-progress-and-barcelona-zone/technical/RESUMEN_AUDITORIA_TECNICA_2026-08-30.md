# Resumen de auditoría técnica — PecadosVip

Fecha: **2026-08-30**
Base Git observada: `ec6190ecc23a29d6cbdd0b3977cdfb3f09a1b3a9`
Estado del árbol: cambios tracked y artefactos untracked; no es un commit candidato limpio
Método de este resumen: reconciliación de evidencia y reejecución local de la puerta técnica; sin red externa ni despliegue

## Resultado ejecutivo

La base de ingeniería local es avanzada y conserva el scorecard **98/100**, pero esa cifra mide exclusivamente ejecución técnica local. La verificación contractual estricta permanece en **2/20 requisitos**: **2 `VERIFIED`, 12 `PARTIAL`, 5 `BLOCKED` y 1 `AT_RISK`**.

No existe un porcentaje único honesto que combine ingeniería, producto, legal, idiomas, infraestructura y aceptación. La decisión pública sigue **NO-GO**.

## Tablero de estados separados

| Eje | Estado | Qué acredita | Qué no acredita |
|---|---|---|---|
| Ingeniería técnica local | **98/100 — `LOCAL_TARGET_EARNED`** | Inventario 15/15, arquitectura 9/10, implementación 45/45, QA 24/25 y handoff 5/5. | Requisitos aceptados, legalidad, WCAG, operación o producción. |
| Requisitos estrictos | **2/20 verificados** | Dos contratos de modelo de perfil están acreditados. | Los 18 requisitos restantes. |
| Puerta local registrada tras zona Barcelona | **PASS según evidencia** | `release:verify`: lint, TypeScript, 204/204 pruebas, build, i18n, scorecard, SBOM, worker/standalone y smoke fail-closed. | Nueva captura commit-bound, Docker Linux, staging o producción. |
| Runtime público por defecto | **Fail-closed / holding** | `DEFAULT_DRAFT`, publicación e indexación cerradas. | Experiencia pública real activada. |
| Multilingüe | **NO CONFORME / PENDIENTE HUMANA / NO APTO** | Catálogos completos y varios contratos estáticos. | Equivalencia funcional/lingüística y publicación. |
| UE/España | **NO-GO** | Controles defensivos y matriz preliminar. | Dictamen jurídico o autorización comercial. |
| Live desplegado | **NO PROBADO / SIN CAMBIOS** | Ninguno en esta auditoría. | Deploy, TLS/proxy, DNS, observabilidad, E2E o rollback real. |

## Evidencia técnica local disponible

- `PROJECT_CONTROL.md:80-98` separa 98/100 de los 2/20 requisitos y del NO-GO.
- `RELEASE_CHECKLIST.md:14` registra el ciclo local final con **204/204** pruebas y todos los subgates locales en PASS.
- `design-qa.md:167-178` registra Sitges, cuatro viewports, controles del flujo y ausencia de errores de aplicación observados.
- `README.md:32-34` conserva el checkpoint durable 98 y aclara que el score no habilita producción.
- `REQUIREMENTS_TRACEABILITY.csv` contiene 20 filas: 2 `VERIFIED`, 12 `PARTIAL`, 5 `BLOCKED`, 1 `AT_RISK`.
- El árbol actual está basado en `ec6190...` con cambios locales posteriores; por tanto, la evidencia nueva de Barcelona no debe describirse como release inmutable.

## Requisitos estrictos

| Estado | Cantidad | Lectura correcta |
|---|---:|---|
| `VERIFIED` | 2 | Esquema de perfil y ausencia de límite arquitectónico a ocho perfiles. |
| `PARTIAL` | 12 | Existe implementación o evidencia incompleta; todavía falta criterio de aceptación pleno. |
| `BLOCKED` | 5 | Cobertura real, SEO por evidencia, canales reales, marca/diseño aprobado y legales/edad. |
| `AT_RISK` | 1 | Plazo contractual histórico sin cierre integral de aceptación. |

No se transforma `2/20` en “10 % de producto listo”: es solo la proporción de requisitos con estado `VERIFIED`.

## Arquitectura y ejecución

### Sitio público

- Next/Vinext con rutas localizadas, proyecciones públicas y release gate agregado.
- El snapshot por defecto contiene borrador, cero perfiles/servicios públicos y publicación deshabilitada.
- Robots, sitemap, contactos y rutas públicas fallan cerrados mientras el release no está aprobado.
- El holding local es una protección correcta; no es una experiencia comercial terminada.

### CMS y contenido

- Workbench separado, solo desarrollo/pruebas, loopback y tokens admin/editor.
- Persistencia JSON y medios locales en texto plano; no hay IdP/MFA, base transaccional, CDN/objetos ni CMS productivo.
- Exportador de candidato local minimiza datos y fija `productionActivation:false`.

### Build y entrega

- Artefactos worker y standalone tienen validadores locales.
- Dockerfile multi-stage usa runtime no-root y base Node fijada por digest.
- El contexto Docker usa deny-all/allowlist y excluye credenciales, datos CMS y evidencia no necesaria.
- No se construyó ni ejecutó aquí una imagen en Docker Linux; EasyPanel, proxy/TLS, health externo y rollback siguen `NOT_TESTED`.

## Cambios locales relevantes de esta etapa

- Sitges completa la cuarta tarjeta de la zona Barcelona.
- Cobertura y directorio de servicios se observaron a 1440, 1180, 780 y 390 px sin overflow visible.
- El flujo sintético local cubre búsqueda, filtros, orden, selección limitada, ficha, FAQ, perfiles Barcelona, Sofía, selector de locales y menú móvil.
- El favicon/brand y ajustes de accesibilidad/SEO forman parte del árbol modificado, no de un release desplegado.
- Los títulos del hero, servicios y secciones editoriales fueron reespaciados; las mediciones DOM a 1280 y 390 px registraron separación entre líneas y `0 px` de overflow horizontal.
- El watcher de desarrollo excluye `stage-archives/**`; la generación de un ZIP de 153 MB dejó el preview activo y una comprobación posterior respondió HTTP 200.

## Multilingüe

La evidencia debe conservar tres dictámenes independientes:

- Técnico HTTP actual: **`NO CONFORME`**.
- Lingüístico: **`PENDIENTE DE REVISIÓN HUMANA`**.
- Publicación: **`NO APTO`**.

Los 348 segmentos estructurales aparecen en ES/EN/FR/IT y los catálogos no presentan fallos de claves/placeholders, pero el runtime `DEFAULT_DRAFT` no emite canonical/hreflang, dos plantillas se rastrearon literalmente con `{slug}` y el preview por query mantiene `<html lang="es">` y copy español fuera de ES.

## Seguridad técnica: lectura prudente

- Existen controles efectivos de release, rutas, contacto, origen, CSP, roles locales, tamaños, hashes y paths.
- La arquitectura deja preguntas abiertas sobre valores calculados en build frente a snapshots activados en runtime, equivalencia de orígenes canónicos, medios HTTPS frente a CSP, filesystem en worker y custodia manual de archivos de etapa.
- El checklist registra que el escaneo integrado anterior quedó `FAILED / NOT_TESTED`; no debe marcarse PASS por una revisión manual ni por un SCA sin hallazgos críticos.
- La revisión de arquitectura no reemplaza SAST exitoso, alcanzabilidad, pentest ni verificación del build desplegado.

## Bloqueadores de release

1. Commit candidato limpio e inmutable con evidencia regenerada.
2. Contenido real, cobertura y perfiles con edad, consentimiento y derechos.
3. Clasificación jurídica de la actividad/publicidad y textos legales aprobados.
4. Revisión humana ES/EN/FR/IT y pruebas accesibles por locale.
5. Dominio, contacto, privacidad/CMP, analítica, infraestructura y responsables.
6. Docker/staging/EasyPanel, observabilidad, rollback, E2E y UAT.
7. Autorizaciones separadas de merge, despliegue e indexación.

## Roadmap

### P0 — cerrar antes de GO

1. Congelar un commit candidato limpio y repetir evidencia técnica, multilingüe y de seguridad sobre ese SHA.
2. Mantener holding/noindex/contacto cerrado hasta contenido, derechos, legal, privacidad y cobertura aprobados.
3. Resolver las discrepancias build/runtime de headers, canonical y contacto con un E2E del mismo artefacto y snapshot.
4. Obtener GO humano conjunto: producto, legal, privacidad, accesibilidad, seguridad y cliente.

### P1 — staging y operación

1. Construir la imagen en Docker Linux y desplegar a staging ligado al SHA/digest.
2. Ejecutar E2E público, HAR, headers, canonical/hreflang, robots/sitemap, contacto, almacenamiento y errores.
3. Completar IdP/MFA, persistencia productiva, medios/CDN, backup/restore, observabilidad y rollback.
4. Ejecutar SAST/alcanzabilidad y pruebas manuales de accesibilidad por locale.

### P2 — mejora continua

1. Actualizar documentación que contradice el código actual.
2. Mantener regresiones visuales de cobertura y flujo.
3. Automatizar trazabilidad de aprobaciones, hashes y retests sin mezclarla con la decisión de publicación.

## Conclusión

**Ingeniería local: 98/100. Requisitos: 2/20 verificados. Release: NO-GO. Producción: fail-closed holding. Live: no probado y no modificado.**
