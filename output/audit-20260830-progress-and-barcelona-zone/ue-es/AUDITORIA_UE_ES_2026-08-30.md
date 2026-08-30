# Auditoría preliminar web UE/España — PecadosVip

Fecha efectiva: **2026-08-30**
Activo: árbol local con base `ec6190ecc23a29d6cbdd0b3977cdfb3f09a1b3a9` y cambios sin commit + preview sintético de loopback
Modo: repositorio y evidencia pasiva; sin autenticación, envíos, compras, pagos, despliegue ni prueba activa

> Esta evaluación no es certificación, dictamen jurídico ni garantía de cumplimiento. Separa aplicabilidad, resultado técnico y necesidad de revisión humana o jurídica.

## Decisión ejecutiva

**NO-GO para publicación/comercialización pública por falta de evidencia y decisiones materiales.** El NO-GO no afirma que el sitio o el servicio sean ilícitos: significa que aún no existe base suficiente para abrir el release con riesgo razonablemente controlado.

El preview local está bien protegido: se declara sintético, no autorizado para publicación, no indexable y sin contacto/reserva. Sin embargo, ese aislamiento no resuelve el marco del producto final.

El bloqueo más importante no es visual ni de código: la oferta exacta debe recibir una **clasificación jurídica escrita**. La [Ley General de Publicidad, arts. 2 y 3](https://www.boe.es/eli/es/l/1988/11/11/34/con) define la publicidad y sitúa dentro de la publicidad ilícita la que promueva la prostitución; la [Ley Orgánica 10/2022, art. 11](https://www.boe.es/eli/es/lo/2022/09/06/10/con) contiene la rama sectorial relacionada. La auditoría no determina que el servicio proyectado encaje en esa categoría: precisamente por no estar clasificado, toda publicación debe seguir cerrada hasta revisión de abogado español cualificado.

## Matriz de regímenes

| Régimen | Aplicabilidad | Resultado observado | Revisión | Prioridad |
|---|---|---|---|---|
| Publicidad del servicio adulto: LGP + LO 10/2022 | `UNCERTAIN` | `INCONCLUSIVE` | `REQUIRES_LEGAL_COUNSEL` | **P0** |
| RGPD + LOPDGDD para perfiles/contacto futuros | `APPLICABLE` | `PARTIAL` | `REQUIRES_LEGAL_COUNSEL` | **P0** |
| LSSI: operador, aviso legal, comunicaciones y contratación | `UNCERTAIN` | `INCONCLUSIVE` | `REQUIRES_LEGAL_COUNSEL` | **P0** |
| LSSI/ePrivacy: cookies y almacenamiento | `UNCERTAIN` | `NOT_TESTED` en entorno desplegado | `REQUIRES_HUMAN_REVIEW` | **P0/P1** |
| Ley 11/2023 (EAA) para servicio cubierto | `UNCERTAIN` | `INCONCLUSIVE` | `REQUIRES_HUMAN_REVIEW` | P1, o P0 si aplica |
| RD 193/2023, accesibilidad de servicios al público | `UNCERTAIN` y transitorio | `INCONCLUSIVE` | `REQUIRES_HUMAN_REVIEW` | P1 |
| TRLGDCU/competencia desleal, B2C y distancia | `UNCERTAIN` | `NOT_TESTED` porque no hay contratación activa | `REQUIRES_LEGAL_COUNSEL` | P0 antes de contratar |
| DSA | `NOT_APPLICABLE` al diseño actual | `NOT_APPLICABLE` | Reabrir si hay UGC/marketplace/hosting | P2 |
| AI Act en el runtime web estático | Sin sistema IA en runtime | `NOT_APPLICABLE` a inferencia web | Reabrir si se integra IA | P2 |
| AI Act en la cadena de producción de imágenes | `UNCERTAIN` | `INCONCLUSIVE`; disclosure visible presente | `REQUIRES_LEGAL_COUNSEL` | P1 |
| WAD/RD 1112, ENS y ENI | `UNCERTAIN` por falta de operador/contrato público positivo | `NOT_TESTED` | Confirmación de operador/contrato | P1 |
| Finanzas, pagos, MiCA, DORA, CRA, NIS, Data Act, eIDAS | `NOT_APPLICABLE` al alcance actual | `NOT_APPLICABLE` | Reabrir si cambia producto | P2 |
| Madrid/Catalunya y reglas regionales/municipales | `UNCERTAIN` | `NOT_TESTED` | `REQUIRES_LEGAL_COUNSEL` | **P0** antes de operar |

## Fortalezas reales del árbol

- La publicación integral está cerrada hasta que el snapshot completo pasa el release gate.
- Los cuatro documentos legales solo se proyectan cuando tienen contenido y aprobación trazable.
- Contacto exige simultáneamente release, aprobación de contacto, aprobación de privacidad y coincidencia exacta de destinos.
- Los destinos externos se normalizan y se rechazan en modo fail-closed.
- Los perfiles públicos futuros exigen mayoría de edad, consentimiento, derechos, evidencia y aprobación.
- El preview actual declara perfiles ficticios e imágenes generadas con IA, marca cobertura no confirmada y desactiva contacto/reserva.
- Indexación, sitemap y metadata permanecen cerrados mientras el release no está aprobado.
- La suite enfocada de accesibilidad, contacto y legales pasó **16/16**.

Estas fortalezas prueban controles de ingeniería; no sustituyen bases jurídicas, textos aprobados, contratos, derechos, revisión accesible humana ni evidencia del entorno desplegado.

## Hallazgos trazables

1. **F-378fb158f9b8fde9 — clasificación sectorial de la publicidad.** P0. El producto no debe publicarse hasta contar con una clasificación escrita del servicio y aprobación línea por línea de copy e imágenes.
2. **F-57c5d62f5d2e98b8 — gobierno de datos personales.** P0. Faltan responsable/encargados, finalidades, bases, retención, destinatarios/transferencias, derechos, privacidad, análisis de categorías especiales y cribado de EIPD.
3. **F-c50061b394b6617e — operador y aviso legal LSSI.** P0. La arquitectura legal está cerrada de forma correcta, pero aún no contiene identidad de operador ni textos aprobados.
4. **F-184b6e6ef073d33e — tecnologías de terminal y consentimiento.** El source usa un `localStorage` para recordar el aviso del preview; no se ha clasificado como tecnología sujeta. Falta inventario desplegado en cuatro estados. El recolector HTTP no alcanzó el loopback desde este contexto, por lo que el control queda `NOT_TESTED`, no conforme ni no conforme.
5. **F-17b3bddca0f6c35a — alcance y evidencia de accesibilidad.** Hay buena base automatizada y responsive, pero faltan lector de pantalla, teclado completo, zoom/reflow, errores y flujos críticos por locale.
6. **F-85954728d90a3c12 — rol y procedencia de medios IA.** El disclosure visible es positivo. Faltan rol del generador/proveedor, fecha, términos y evidencia de marcado legible por máquina/procedencia conforme a la rama aplicable del [AI Act consolidado](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02024R1689-20260727).

Los seis JSON individuales validan contra el esquema de la skill.

## Aplicabilidad y fuentes materiales

- El [RGPD consolidado](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02016R0679-20160504) sigue en vigor y cubre el tratamiento automatizado/no automatizado en fichero dentro de sus ámbitos material y territorial. La futura publicación de perfiles identificables y la recepción de contacto activan la rama; el preview ficticio local reduce tratamiento actual, no el deber de diseñar producción correctamente.
- La [LSSI, art. 10](https://www.boe.es/eli/es/l/2002/07/11/34/con) exige información del prestador si el servicio entra en su ámbito; el art. 22.2 condiciona almacenamiento/acceso en terminal salvo la excepción aplicable. Sin operador ni inventario desplegado no procede dictamen categórico.
- La [Ley 11/2023](https://www.boe.es/eli/es/l/2023/05/08/11/con) incluye servicios de comercio electrónico definidos por celebración de contrato con consumidor y contempla excepción para microempresas que presten servicios. Aún faltan ambos hechos.
- El [RD 193/2023](https://www.boe.es/eli/es/rd/2023/03/21/193/con) tiene calendario diferenciado: para el resto de nuevos bienes/servicios privados, 2029; para existentes privados ordinarios susceptibles de ajustes razonables, 2030. La categoría concreta del servicio debe confirmarse; el calendario no justifica aplazar buenas prácticas.
- El DSA no se activa por una web promocional propia sin función intermediaria. Debe reabrirse si perfiles o terceros pasan a subir/almacenar contenido o si surge marketplace.

## Evidencia y cobertura

- Catálogo de la skill: 56 instrumentos, 46 controles, sin errores de integridad; 48/48 entradas de ley vinculante completas.
- Freshness al 2026-08-30: 52 fuentes `FRESH`, 4 `PENDING_VERIFICATION`. El gate estricto salió no cero por pendientes legítimos —transposición/detalle—, no por envejecimiento.
- Los instrumentos materiales citados arriba fueron reabiertos en EUR-Lex o BOE el 2026-08-30.
- El universo de 46 controles fue cribado; 10 recibieron evidencia directa en esta subauditoría. Doce controles permanecen no probados y catorce fueron no aplicables; los demás dependen de hechos abiertos. No se calcula un porcentaje de “cumplimiento legal”.
- La recolección GET al loopback falló tres veces con `WinError 10061`; se conservaron el error y las limitaciones. Tres capturas existentes se hashearon como fixtures, sin persistir cuerpo HTTP.

## Plan recomendado

### Inmediato — antes de cualquier publicación

1. Mantener `release`, indexación, contacto, reserva y perfiles reales cerrados.
2. Obtener clasificación jurídica escrita del servicio, publicidad y modelo operativo, incluyendo Madrid, Catalunya y municipios objetivo.
3. Confirmar operador: razón social/nombre, NIF, domicilio, registro, email, autorizaciones, establecimiento, tamaño y relación pública si existiera.
4. Definir si existe B2C y dónde se celebra el contrato; documentar precio total, condiciones, cancelación/desistimiento cuando proceda, reclamaciones y atención.
5. Aprobar el paquete de privacidad y derechos de imagen/persona para cada perfil y medio.

### Próximos 30 días

1. Cerrar mapa de datos, proveedores, bases, retención, transferencias, derechos, seguridad, Art. 9 y cribado EIPD.
2. Inventariar cookies, almacenamiento, SDK y red en primera carga, rechazo, aceptación granular y retirada sobre staging autorizado.
3. Resolver EAA/Ley 11/2023 y RD 193/2023 por servicio, consumidor, microempresa y fecha.
4. Ejecutar pruebas manuales de teclado, zoom/reflow y lector de pantalla en ES/EN/FR/IT; la aprobación lingüística/legal debe ser humana e independiente.
5. Registrar procedencia y términos del generador IA; comprobar que optimización no elimina marcado/provenance cuando exista.

### 60–90 días / antes de GO

1. Ejecutar UAT y auditoría pasiva sobre el build exacto desplegado: headers, red, almacenamiento, 404, legales, sitemap/robots, contacto y errores.
2. Congelar un commit limpio y vincularlo a hashes de textos legales, perfiles/medios, proveedores, dominios y aprobaciones.
3. Retestar los seis IDs sin perder trazabilidad; documentar delta y riesgo residual.
4. Autorizar despliegue solo con GO conjunto de producto, seguridad, privacidad, accesibilidad y asesor jurídico.

## Archivos

- `audit-20260830.json`: documento de auditoría validado.
- `profile-20260830.json` y `resolver-output-20260830.json`: perfil y matriz preliminar.
- `source-freshness-20260830.json`: vigencia del registro.
- `findings/*.json`: seis hallazgos con IDs deterministas.
- `COMMANDS_AND_EVIDENCE.md`: comandos, resultados, fallos y hashes.
- `evidence/*.json`: manifiestos de fixtures visuales.

Resultado final: **preparación técnica defensiva sólida, pero publicación jurídica/operativa no habilitada**.
