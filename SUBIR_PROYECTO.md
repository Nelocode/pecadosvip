# Guía muy fácil para subir PecadosVip

Esta guía separa dos acciones distintas:

1. Guardar el código en un repositorio privado de GitHub.
2. Publicar una vista web cuando exista autorización expresa.

El estado actual sigue siendo **NO-GO público**. El candidato 98 es técnico local y multilingüe, no un release. Esta guía no ejecuta ni autoriza push, despliegue, perfiles reales, contacto, analítica, indexación, DNS o producción.

## Opción A — guardar el proyecto en GitHub privado

Usa solamente la carpeta `repository` del ZIP. No subas el ZIP completo ni `project-inputs`.

1. Confirma que cuentas con autorización expresa para crear o actualizar el repositorio remoto.
2. En GitHub crea un repositorio y marca **Private**.
3. No añadas README, licencia ni `.gitignore` desde GitHub.
4. Abre PowerShell dentro de `repository` y prepara la copia local, una línea cada vez:

       git init
       git add .
       git status --short
       git commit -m "PecadosVip checkpoint"
       git branch -M main

5. Detente antes de añadir el remoto o hacer push. Verifica por separado el propietario, nombre, historial y visibilidad `PRIVATE`.
6. Solo una autorización expresa para ese remoto permite continuar. Si ya tiene historial o existe cualquier duda, detente; nunca uses `--force` ni `--force-with-lease`.

## Opción B — abrirla como página web en este PC

Dentro de `repository` ejecuta:

    pnpm install --frozen-lockfile
    pnpm run release:verify
    pnpm run dev

Abre únicamente la dirección local que muestre la terminal. Detén el servidor con `Ctrl+C`.

La vista pública real permanece cerrada por diseño. Para revisar datos ficticios y no indexables usa:

    pnpm run dev:preview

No introduzcas datos, imágenes, documentos, teléfonos ni credenciales reales.

Comprueba las rutas locales `/es`, `/en`, `/fr` y `/it`. Los borradores EN/FR/IT no están aprobados lingüísticamente; perfiles dinámicos y cuerpos legales permanecen cerrados fuera de ES.

## Opción C — desplegar el holding en EasyPanel con Docker

Esta ruta corrige el error `open Dockerfile: no such file or directory`. Ese mensaje significa que EasyPanel descargó una rama/commit que no contiene `Dockerfile` en la raíz configurada. No basta con tener el archivo en otro branch local: el SHA seleccionado por EasyPanel debe incluirlo.

El contenedor sirve el **holding neutral y no indexable** por el puerto `3000`. No abre perfiles, contacto, legales, analítica ni producción comercial. Antes de ejecutar un deploy confirma autorización, rama y commit exactos.

1. Comprueba localmente el candidato que quieres enviar:

       git status --short
       git rev-parse HEAD
       pnpm install --frozen-lockfile
       pnpm run release:verify

2. Confirma que ese mismo commit está en el repositorio privado remoto. El push sigue requiriendo autorización expresa y nunca debe usar `--force`.
3. En EasyPanel selecciona la rama que contiene ese commit. No uses un `main` antiguo solo porque sea la rama predeterminada.
4. Configura el servicio como aplicación construida desde `Dockerfile` con:

       Build context / Root directory: /
       Dockerfile: Dockerfile
       Container port: 3000

5. EasyPanel puede proporcionar `GIT_SHA` como build argument; la imagen lo registra en la etiqueta OCI `org.opencontainers.image.revision`. No pongas secretos en build arguments.
6. El contenedor ya fija `NODE_ENV=production`, `HOST=0.0.0.0` y `PORT=3000`. Las variables `NEXT_PUBLIC_*` son de compilación: añadirlas solo después como variables de runtime no recompila el cliente.
7. Ejecuta el deploy autorizado y verifica en los logs que la imagen se construye, arranca `node server.js` y pasa el healthcheck. Después compara el SHA desplegado con el commit esperado.
8. En la URL de prueba verifica el holding, las cabeceras, `robots.txt`, sitemap vacío y los 404 de `/legal/privacidad` y `/preview-local-sintetico`.
9. Si falla, vuelve al SHA/digest anterior desde EasyPanel; no cambies DNS, indexación ni contenido real como parte de ese rollback.

La validación local actual cubre el build standalone, inventarios y el arranque Node en loopback. Si el equipo no tiene Docker, la construcción real de la imagen sigue `NOT_TESTED` hasta que la ejecute EasyPanel u otro host con Docker. El despliegue, TLS/proxy, observabilidad y smoke externo también permanecen separados.

Referencia: [constructores](https://easypanel.io/docs/builders) y [servicios de aplicación](https://easypanel.io/docs/services/app) de EasyPanel.

## Opción D — preparar Cloudflare más adelante

El proyecto usa Vinext. Su destino nativo más directo es Cloudflare Workers, pero este repositorio todavía no tiene seleccionada ni aprobada una infraestructura. GitHub Pages no es la ruta recomendada porque la aplicación usa rutas y renderizado de servidor.

No ejecutes esta opción con el candidato 98. Es solo una referencia futura y requiere aprobación escrita del diseño controlador, contenido, derechos y consentimientos, revisión humana EN/FR/IT, textos legales localizados, dominio, canales, infraestructura, seguridad, UAT y autorización de despliegue.

1. Crea una rama separada:

       git switch -c deploy/cloudflare-preview

2. Comprueba el proyecto:

       pnpm install --frozen-lockfile
       pnpm run release:verify
       pnpm exec vinext check

3. Prepara la integración de Cloudflare en esa rama:

       pnpm exec vinext init --platform=cloudflare

4. Revisa todos los cambios y valida de nuevo:

       git status --short
       git diff --check
       pnpm run release:verify

5. Autentícate de forma interactiva. No pegues tokens en el chat ni los confirmes en Git:

       pnpm exec wrangler login
       pnpm exec wrangler whoami

6. Configura el identificador de la cuenta por el mecanismo aprobado para el entorno. No confirmes secretos ni archivos `.env`.
7. Antes de publicar, prepara y revisa el paquete sin desplegar:

       pnpm dlx @vinext/cloudflare deploy --dry-run

8. Pide autorización expresa para el despliegue de prueba. Solo después, ejecuta el comando de despliegue acordado y registra URL, commit, configuración y hora.
9. En esa URL repite seguridad, accesibilidad, rendimiento, SEO, privacidad/cookies y el flujo E2E. Mantén `noindex` y el holding neutral hasta que se levante el NO-GO.
10. Producción, dominio, indexación y datos reales requieren autorizaciones separadas.

Referencia técnica primaria: [documentación oficial de Vinext](https://github.com/cloudflare/vinext/blob/main/README.md#deployment).

## Regla corta

- GitHub privado: preparar localmente es posible; añadir remoto y hacer push requieren autorización expresa y verificación de visibilidad.
- Vista local: permitida con datos ficticios.
- Hosting del holding en EasyPanel: requiere autorización, commit remoto correcto y verificación postdespliegue; no activa el producto.
- Internet, DNS, indexación o producción comercial: requieren autorizaciones separadas y cierre de todos los gates.
