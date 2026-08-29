# Design QA — PecadosVip

Fecha: 2026-08-27

## Alcance observado

- Referencia 1: `WhatsApp Image 2026-08-26 at 5.19.36 PM.jpeg` (portada, listado y ficha).
- Referencia 2: `WhatsApp Image 2026-08-26 at 5.33.18 PM.jpeg` (portada responsive alternativa).
- Referencia 3: `WhatsApp Image 2026-08-26 at 5.38.50 PM.jpeg` (portada responsive y servicios alternativa).
- Render verificado: holding productivo fail-closed en 320 y 1920 px.
- Harness verificado: preview sintético local en 320 px; no es un candidato visual para publicación.

## Decisión de comparación

Las tres referencias son materialmente distintas y ninguna fuente suministrada contiene una selección inequívoca del cliente. La documentación del proyecto recomienda provisionalmente 5:38:50 para portada y 5:19:36 para listado/ficha, pero conserva esa combinación como decisión pendiente.

No se ejecutó una comparación de fidelidad ni se ajustó la interfaz para aparentar conformidad con una opción no aprobada. El holding y el harness sintético prueban seguridad, reflow y estados; no sustituyen la portada final ni autorizan activos visibles.

## Evidencia técnica que sí cerró

- Holding sin desbordamiento horizontal a 320 y 1920 px.
- Preview sintético con cuatro estados, vacío y error sin desbordamiento a 320 px.
- Enlace de salto operable por teclado y foco transferido a `main-content`.
- Consola sin errores o advertencias de aplicación.
- Solicitudes del holding limitadas al origen local.

## Para desbloquear

1. Seleccionar por nombre de archivo una referencia principal o aprobar explícitamente la combinación recomendada.
2. Confirmar logo, tipografías, fotografías y derechos de uso.
3. Proporcionar el estado y viewport exactos que constituirán la referencia de aceptación.
4. Comparar referencia y render juntos, corregir diferencias visibles y repetir la captura.

Final result: **blocked**
