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

final result: passed
