# Recursos de marca

`favicon-source.svg` es la fuente original entregada por el cliente el 2026-08-30. Se conserva fuera del runtime público para mantener trazabilidad y permitir regenerar derivados.

Ejecutar:

```powershell
node --experimental-strip-types scripts/prepare-brand-favicon.ts
```

El script identifica y elimina únicamente la ruta negra de lienzo completo incluida en el SVG, sin alterar las rutas doradas del símbolo. Después genera `app/icon.png` (256 × 256) y `app/apple-icon.png` (180 × 180) con canal RGBA real. La generación falla si no encuentra exactamente un fondo opaco conocido, si las cuatro esquinas no tienen alfa 0, si no existe al menos un píxel opaco o si las dimensiones cambian.

Los PNG no incorporan scripts, enlaces externos ni metadatos XMP del SVG de origen. Next/Vinext publica estos archivos mediante sus convenciones de metadatos; `/favicon.ico` redirige localmente a `/icon.png`.
