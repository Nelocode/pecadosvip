# Design QA — experiencia de servicios PecadosVip

Fecha de cierre local: 2026-08-30

## Alcance verificado

- Referencia visual y funcional capturada desde la página de servicios de Felina BCN en escritorio y móvil.
- Inventario de referencia conservado en `docs/reference/felina-route-inventory.json`: 751 rutas únicas observadas (732 en sitemaps y 19 solo en la navegación renderizada).
- Mapa de patrones adaptables y exclusiones conservado en `docs/reference/felina-functional-map.md`.
- Implementación original de PecadosVip con 34 rutas de servicios propias y sin reutilizar los slugs de servicios de la referencia.
- Cuatro proyecciones completas de contenido del preview: español, inglés, francés e italiano.
- Rutas públicas preparadas bajo `/servicios` y `/{locale}/servicios`, sujetas a los controles de publicación existentes.
- Las 751 rutas del referente quedaron inventariadas como evidencia arquitectónica; no se copiaron ni se presentan como 751 rutas ya implementadas. En esta etapa se adaptó la experiencia de servicios y sus 34 detalles propios. Blog, guía, tarifas, contacto y demás familias requieren contenido y alcance originales antes de desarrollarse.

## Comparación visual

La referencia y la implementación fueron abiertas a la vez con el mismo estado y viewport. Se compararon el encabezado, la portada, el catálogo, la jerarquía tipográfica, las tarjetas, las secciones editoriales, las tarifas, las preguntas frecuentes, el directorio y el pie de página. La implementación conserva el patrón editorial observado —cabecera oscura, acento dorado, transición a contenido claro y catálogo denso— dentro de la identidad visual y los tokens existentes de PecadosVip.

Evidencia local:

- `output/design-qa/services-desktop-top.png`
- `output/design-qa/services-desktop-catalog.png`
- `output/design-qa/services-desktop-faq.png`
- `output/design-qa/service-detail-desktop-top.png`
- `output/design-qa/services-mobile-top.png`
- `output/design-qa/service-detail-mobile.png`
- `output/design-qa/service-mobile-menu-open-final.png`
- `output/design-qa/services-desktop-fr-locales.png`
- `output/design-qa/services-reference-vs-implementation.png`
- `output/design-qa/services-symbolic-desktop-top.png`
- `output/design-qa/service-symbolic-detail-desktop.png`
- `output/design-qa/services-symbolic-mobile-top.png`
- `output/design-qa/services-unique-assets-contact-sheet.png`
- `output/design-qa/services-unique-catalog-desktop.png`
- `output/design-qa/services-unique-catalog-mobile.png`
- `output/design-qa/services-reference-vs-implementation-unique.png`

La extensión del 30 de agosto sustituyó los retratos decorativos de servicios por 34 bodegones generados específicamente para la maqueta: uno por cada ruta, sin compartir claves, rutas ni bytes. El mosaico completo permitió comparar silueta, objeto principal y densidad visual de las 34 composiciones; el manifiesto y las pruebas recalculan hashes, formatos y dimensiones desde los archivos reales. La llegada a hotel fue regenerada sin símbolos o trazos semejantes a marcas. La escena de sado consensuado también se regeneró como dos arcos abstractos separados, sin bandas, cierres ni ataduras. Ambos candidatos descartados quedaron aislados fuera del manifiesto y de las rutas.

Se comparó en una sola imagen la referencia gráfica del cliente y la implementación final. La composición conserva el sistema negro, marfil y dorado, la jerarquía editorial, el contraste de superficies y la densidad premium de la referencia, mientras diferencia con claridad servicios y perfiles. “Generada para la maqueta” describe la procedencia técnica y no acredita derechos de publicación.

No quedaron hallazgos P0, P1 o P2 en la muestra visual final relacionada con duplicación o encuadre. Los encuadres de hero, tarjeta y detalle conservan los objetos principales; las insignias no cubren el foco; no hay imágenes estiradas, placeholders, arte CSS ni controles superpuestos. El DOM mostró 34 tarjetas, 34 `src` distintos y cero desbordamiento horizontal en 1440 × 1000 y 390 × 844. La captura de página completa presentó artefactos de cosido del navegador, por lo que el dictamen visual se basó en capturas normales de viewport y en el DOM renderizado.

## Interacciones y responsive

- Los enlaces del catálogo y del directorio llevan a las 34 fichas de detalle.
- Los filtros por categoría usan navegación GET y conservan el idioma seleccionado.
- La búsqueda dinámica ignora tildes, combina categoría y ordenación, anuncia el número de resultados y ofrece estado vacío y restablecimiento.
- La selección temporal admite hasta tres fichas, expone `aria-pressed`, puede vaciarse y vive solo en memoria de React: no usa URL, cookies, `localStorage`, `sessionStorage`, analítica ni red.
- Las fichas largas incorporan un índice real de anclas para resumen, proceso, límites, relacionados y perfiles.
- La navegación principal, el logotipo, el selector de idioma, los perfiles y los enlaces relacionados conservan `?lang` en el preview.
- El menú móvil se comporta como diálogo: abre y cierra con control explícito, atrapa el foco, responde a Escape, devuelve el foco al disparador y bloquea el desplazamiento de fondo.
- La portada y las tarjetas usan encuadres que conservan caras completas en escritorio y móvil.
- La nota del preview puede aceptarse y restaurarse; permanece separada de cualquier consentimiento real.
- Los destinos de contacto, reserva, pagos, analítica e indexación permanecen desactivados en esta etapa local.

## Accesibilidad, idiomas y seguridad de publicación

- Existe enlace de salto al contenido, foco visible, nombres accesibles localizados, endónimos de idioma, blancos táctiles y reglas para movimiento reducido y colores forzados.
- El DOM hidratado actualiza `html[lang]`, título y descripción en el preview para ES, EN, FR e IT.
- La envoltura heredada responde inicialmente en español antes de la hidratación; por tratarse de una ruta local, no indexable y no publicable, se documenta como límite del preview. Las rutas públicas localizadas resuelven el idioma del servidor, pero continúan bajo estado de espera.
- La revisión lingüística humana independiente y la revisión jurídica siguen siendo requisitos externos; este QA no constituye certificación legal ni aprobación editorial.

## Verificación técnica final

- `pnpm run release:verify`: aprobado.
- ESLint: aprobado sin errores ni advertencias.
- TypeScript: aprobado.
- Pruebas: 203/203 aprobadas.
- Compilación Vinext y preparación standalone: aprobadas.
- Validación i18n: `PASS_WITH_LIMITS`, 0 problemas estructurales de catálogo.
- Artefactos worker y standalone: 0 infracciones.
- Smoke test standalone: aprobado con publicación desactivada, `robots` bloqueado y sitemap vacío.
- Navegador local final: 0 errores de consola; `noindex, nofollow, nocache` confirmado.

## Extensión visual · siete ciudades

- Madrid, Barcelona, Girona, Tarragona, Toledo, Guadalajara y Segovia cuentan ahora con una referencia horizontal única en la home sintética y el directorio de servicios.
- Los maestros PNG y derivados WebP 1200 × 900 permanecen fuera de `public/`; la ruta local está confinada por slug y por directorio.
- El mosaico `output/design-qa/cities-reference-contact-sheet.png` confirma siete composiciones distintas. `cities-reference-comparison.png` conserva ambos contextos sin recorte; es una comparación contextual, no una comparación píxel a píxel porque las capturas de origen tienen dimensiones distintas.
- Capturas normales de viewport: `cities-reference-desktop.png`, `cities-reference-mobile.png`, `cities-services-desktop.png`, `cities-services-tablet-1024.png`, `cities-services-tablet-768.png` y `cities-services-mobile.png`. Se evitó basar el dictamen en el cosido de página completa.
- El DOM mostró siete `src`, siete alt específicos, un aviso compartido, siete etiquetas IA visibles y dimensiones naturales 1200 × 900. Antes de cada captura se comprobaron `complete` y `naturalWidth > 0` en las siete imágenes. Las secciones no desbordaron a 1440, 1024, 768 ni 390 px; a 320 px se conserva el mínimo global heredado de 320 px y la validación se considera equivalente, no una promesa para un ancho útil menor por scrollbar clásica.
- Las etiquetas por tarjeta tienen 0.75 rem y el aviso completo conserva “cobertura no confirmada”. El control para restaurar el aviso queda en el flujo del documento y no tapa imágenes ni objetivos táctiles.
- ES/EN/FR/IT muestran alt y disclosure localizados sin mojibake. La home legacy mantiene el límite conocido de `html lang=es` para EN/FR/IT; el hub de servicios sí sincroniza el idioma del documento.
- La inspección del navegador no registró errores ni advertencias de aplicación. El contenido sigue siendo local, sintético, no indexable y sin afirmación de cobertura comercial.
- La revisión de derechos, lingüística independiente, jurídica, lector de pantalla, contraste medido y dispositivos físicos sigue pendiente; este cierre visual no autoriza producción.

## Corrección visual · cierre de filas incompletas

- Fuente visual: `C:\Users\artot\AppData\Local\Temp\codex-clipboard-9ba9b7b2-db56-454b-ace3-b01cf41d2985.png`, captura anotada de 1896 × 811 px que muestra dos tarjetas y dos columnas vacías en la última fila del catálogo.
- Implementación verificada: `output/design-qa/service-grid-balance-20260830/catalog-balanced-desktop-normalized.png`, captura de 1905 × 893 px con viewport solicitado de 1920 × 900 CSS px y densidad normal del navegador.
- Evidencia móvil: `output/design-qa/service-grid-balance-20260830/catalog-balanced-mobile-normalized.png`, captura de 375 × 811 px con viewport solicitado de 390 × 844 CSS px.
- Comparación conjunta: `output/design-qa/service-grid-balance-20260830/comparison-before-after.png`; izquierda, defecto reportado, y derecha, implementación corregida. No se normalizó a equivalencia píxel a píxel porque la fuente es una captura anotada del estado defectuoso, no un mock final. La comparación se centró en el cierre horizontal y la continuidad del borde de la cuadrícula.
- Estado: catálogo en español, 34 servicios, y filtro “Compañía”, 3 servicios. Se probaron el catálogo completo y el filtrado en 1440, 1180, 780 y 390 px.
- Interacciones: selección de categoría, restauración a “Todas” y actualización dinámica de resultados. La consola mostró cero errores de aplicación; las imágenes visibles cargaron correctamente y las restantes conservaron su carga diferida.

### Historial de comparación

- Primera pasada — P2: la cuadrícula de cuatro columnas dejaba dos tracks sin tarjeta al presentar 34 servicios. El fondo beige del grid convertía ese remanente en una superficie vacía de media fila y transmitía una apariencia de contenido incompleto.
- Corrección: el catálogo usa tracks divisibles y selectores de último grupo para distribuir cualquier remanente entre todo el ancho disponible. La cuadrícula de servicios relacionados permanece fuera del alcance del cambio. Las relaciones de aspecto de las tarjetas expandidas se ajustan para conservar aproximadamente la altura de una fila normal.
- Segunda pasada: el borde de la última fila cierra de extremo a extremo. Las mediciones del navegador mostraron márgenes laterales internos simétricos de aproximadamente 0.8 px y cero desbordamiento horizontal en los cuatro anchos probados. El comportamiento también pasó con tres resultados: tres columnas completas en escritorio y una última tarjeta a ancho completo en móvil.

### Superficies de fidelidad

- Tipografía: familias, jerarquía, tamaños, pesos, interlineado y contenido no cambiaron; los títulos conservan su envoltura dentro de tarjetas más anchas.
- Espaciado y ritmo: se eliminó la superficie vacía de la última fila sin introducir huecos, saltos verticales ni desplazamiento horizontal.
- Color y tokens: se conservaron marfil, negro, dorado, bordes y fondo separador existentes; no se añadió un color para ocultar el defecto.
- Imágenes: las tarjetas expandidas usan proporciones panorámicas coherentes con su nuevo ancho, sin estiramiento; el recorte permanece gobernado por las reglas y activos existentes.
- Copia: etiquetas, títulos, descripciones, avisos IA y acciones permanecen sin cambios.

No quedan hallazgos P0, P1 o P2 relacionados con el cierre de filas incompletas. No fue necesario un recorte focal adicional: la comparación conjunta permite leer la geometría completa del defecto y de la corrección, y las capturas individuales conservan suficiente resolución para revisar bordes, imágenes, títulos y acciones.

Verificación posterior: `pnpm run validate` aprobado; ESLint, TypeScript, 203/203 pruebas, compilación Vinext y preparación standalone aprobados.

## Corrección visual · continuidad entre introducción y catálogo

- Fuente visual: `C:\Users\artot\AppData\Local\Temp\codex-clipboard-89f1e7e7-8857-4203-8899-6d5bcc59afe4.png`, captura anotada de 1956 × 892 px que señala el fondo negro expuesto alrededor del inicio del catálogo.
- Implementación: `output/design-qa/service-section-continuity-20260830/after-continuity-desktop.jpg`, captura del navegador de 1905 × 893 px con viewport solicitado de 1920 × 900 CSS px y escala CSS normal.
- Evidencia móvil: `output/design-qa/service-section-continuity-20260830/after-continuity-mobile.jpg`, captura de 375 × 811 px con viewport solicitado de 390 × 844 CSS px.
- Comparación conjunta: `output/design-qa/service-section-continuity-20260830/comparison-before-after.png`; izquierda, defecto reportado, y derecha, superficie marfil corregida. La fuente anotada y la captura del navegador tienen escalas visuales distintas, por lo que la comparación se normalizó a dos paneles de 960 × 450 px y se evaluó la geometría de la transición, no la fidelidad píxel a píxel.
- Estado: ruta española de servicios, catálogo sin filtros, transición entre `.synthetic-services-intro` y `#service-catalog`. No se modificó contenido ni estado interactivo.

### Historial de comparación

- Primera pasada — P2: la regla genérica `.public-section`, declarada después del CSS de servicios, anulaba el ancho, los márgenes y el padding previstos para el catálogo. El fondo oscuro de la página quedaba visible como dos bloques laterales y cortaba la continuidad con la introducción marfil.
- Corrección: el selector del catálogo se acotó a `.synthetic-services-page .synthetic-services-catalog`. La mayor especificidad conserva la superficie a ancho completo y su padding interno sin cambiar la regla compartida ni las secciones de detalle.
- Segunda pasada: introducción y catálogo midieron el mismo borde izquierdo y derecho en 1440, 1180, 780 y 390 px. La diferencia de superficie fue 0 px en ambos lados y el desbordamiento horizontal fue 0 px en todos los anchos.

### Superficies de fidelidad

- Tipografía: familias, tamaños, pesos, interlineado, envolturas y jerarquía permanecen iguales.
- Espaciado y ritmo: la transición marfil es continua y el contenido conserva padding lateral de 5vw o el máximo editorial configurado; no hay márgenes negros ni saltos horizontales.
- Color y tokens: se conserva `--service-ivory`; no se pintó encima del defecto ni se cambió el fondo oscuro global.
- Imágenes: esta transición no contiene activos visuales; el cambio no altera medios, recortes ni carga diferida.
- Copia: títulos, numeración, descripción y etiquetas permanecen sin cambios.

La captura completa y el panel comparativo permiten revisar claramente la superficie, el divisor, el título y los márgenes; no fue necesario un recorte focal adicional. La consola no registró errores de aplicación y no hubo imágenes visibles rotas.

No quedan hallazgos P0, P1 o P2 relacionados con la continuidad entre introducción y catálogo.

## Corrección visual · cierre del directorio de ciudades

- Fuente visual: `output/design-qa/city-directory-balance-20260830/source-city-directory-gap.png`, copia estable de la captura reportada de 597 × 512 px. El estado muestra las tarjetas 05 y 06 y la última tarjeta, Segovia, dejando vacía la segunda columna.
- Implementación: `output/design-qa/city-directory-balance-20260830/after-city-directory-598x512.png`, captura normal del navegador solicitada a 598 × 512 CSS px. El navegador devolvió 583 × 499 px por su área útil; se normalizó proporcionalmente a 597 × 512 px en `after-city-directory-normalized-597x512.png` para la comparación.
- Comparación conjunta: `output/design-qa/city-directory-balance-20260830/comparison-source-after.png`; izquierda, defecto reportado, y derecha, corrección con Segovia ocupando la fila completa. El mismo encuadre empieza en el copy de Toledo y Guadalajara y conserva idioma, contenido y estado.
- Evidencia responsive adicional: `after-city-directory-1440x900.png`, `after-city-directory-1180x900.png`, `after-city-directory-780x900.png` y `after-city-directory-390x844.png`.
- La vista completa del componente es también el recorte focal: el defecto, los bordes, las tres ciudades y sus imágenes son legibles en una sola región, por lo que no fue necesario un segundo recorte.

### Historial de comparación

- Primera pasada — P2: las siete imágenes estaban cargadas, pero las reglas de cuatro columnas y dos columnas dejaban respectivamente uno de cuatro tracks y uno de dos tracks sin tarjeta. El rectángulo negro era una celda vacía, no una imagen rota.
- Corrección: entre 781 y 1180 px la cuadrícula usa doce tracks; las primeras cuatro tarjetas ocupan tres cada una y las últimas tres ocupan cuatro cada una. Entre 421 y 780 px, una última tarjeta impar ocupa la fila completa. Las proporciones 16:9 y 8:3 preservan la altura visual de las filas expandidas.
- Segunda pasada: a 1180 px las tres tarjetas finales miden 341.4 px y cierran en el borde derecho del grid; su altura de 304.39 px difiere solo 0.15 px de la fila anterior. A 780 px Segovia mide 687.51 px, cierra el ancho interior completo y su altura difiere 0.30 px de las filas pares. A 390 px todas las tarjetas conservan una sola columna de 336.88 px. El desbordamiento horizontal fue 0 px en 1440, 1180, 780 y 390 px.

### Superficies de fidelidad

- Tipografía: nombres, numeración, estado, familias, tamaños, pesos y espaciado permanecen iguales; ninguna etiqueta se truncó.
- Espaciado y ritmo: desapareció la celda vacía y las alturas se mantienen alineadas dentro de 0.30 px; los bordes cierran de extremo a extremo.
- Color y tokens: no se cubrió el defecto con un relleno. Se conservaron negro, dorado, bordes y estados existentes.
- Imágenes: las siete referencias cargaron con `complete=true`, ancho natural de 1200 px y alt específico. El cambio modifica únicamente el encuadre panorámico de la tarjeta expandida, sin estirar el archivo fuente.
- Copia: ciudades, numeración, aviso IA y estado pendiente permanecen sin cambios.

Los siete enlaces conservaron `href`, orden de tabulación y destino; no se modificó el flujo de navegación. La consola registró solo mensajes informativos de Vite y React, sin errores ni advertencias de aplicación. No quedan hallazgos P0, P1 o P2 relacionados con el directorio de ciudades.

Verificación posterior: `pnpm run validate` aprobado; ESLint, TypeScript, 203/203 pruebas, compilación Vinext y preparación standalone aprobados.

## Corrección visual · cuarta zona Barcelona y auditoría de flujo

- Estado anterior: `output/audit-20260830-progress-and-barcelona-zone/product-design/before/02-cobertura-hueco-barcelona-antes.jpg`; Barcelona terminaba con tres tarjetas y una cuarta celda vacía.
- Estado final: `output/audit-20260830-progress-and-barcelona-zone/product-design/after/01-cobertura-desktop-1440.jpg`; Sitges completa una cuadrícula 2 × 2 equilibrada junto a Barcelona, Tarragona y Girona.
- Recurso: `assets/synthetic-cities/master/sitges-reference-v01.png` y derivado técnico `assets/synthetic-cities/selected/sitges-reference-v01.webp`, ambos únicos y etiquetados como referencia generada con IA, cobertura sin confirmar y revisión humana/legal pendiente.
- Responsive: portada y directorio de servicios verificados a 1440, 1180, 780 y 390 px; ocho tarjetas, cero recursos visibles rotos y cero desbordamiento horizontal.
- Flujo: búsqueda, filtros, orden, selección temporal hasta tres servicios, límite anunciado, ficha individual, FAQ, perfiles Barcelona, ficha Sofía, selector ES/EN/FR/IT y menú móvil operaron en el navegador local.
- Accesibilidad: el diálogo móvil atrapa/restaura foco, bloquea el scroll y vuelve `inert`/`aria-hidden` el fondo mientras está abierto. El campo de respuesta usa `type=email`.
- Tipografía: el hero separa título y subtítulo en bloques balanceados con interlineado `1.15`; los encabezados de servicios y secciones editoriales usan interlineado seguro, kerning normal y no presentan intersección de líneas ni overflow en las mediciones de escritorio/móvil. Evidencia posterior: `output/audit-20260830-progress-and-barcelona-zone/product-design/typography/02-hero-es-390-despues.jpg`.
- Marca: `app/icon.png` y `app/apple-icon.png` conservan el símbolo dorado y tienen transparencia real (`alpha 0–255`, cuatro esquinas transparentes); el SVG fuente permanece preservado bajo `assets/brand/`.
- Entrega local: Vite ignora `stage-archives/**`; se generó un ZIP de 153 MB con el preview activo y el servidor continuó respondiendo HTTP 200, cerrando el `EBUSY` observado con OneDrive.
- Consola: solo mensajes informativos de Vite/React; no se observaron errores ni advertencias de aplicación.
- Verificación técnica: `pnpm run release:verify` aprobado con lint, TypeScript, 204/204 pruebas, build, i18n, scorecard, SBOM, artefactos worker/standalone y smoke fail-closed.

No quedan hallazgos P0, P1 o P2 vinculados al hueco de la zona Barcelona ni al funcionamiento local de los controles auditados. La cobertura, los perfiles, los servicios y los medios continúan siendo sintéticos y locales; este cierre visual no autoriza publicación comercial.

final result: passed
