import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

import type { Plugin } from 'vite';

import {
  getSyntheticPreviewAsset,
  isSyntheticPreviewRequestAllowed,
} from '../lib/preview/synthetic-preview.ts';

const syntheticMediaPattern =
  /^\/preview-local-sintetico\/media\/([a-z0-9-]+)\/([a-z0-9-]+)$/;
const blockedHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, noimageindex',
};

export function parseLocalRequestPathname(requestUrl: string | undefined): string | null {
  try {
    return new URL(requestUrl ?? '/', 'http://localhost').pathname;
  } catch {
    return null;
  }
}

export function localSyntheticMediaPlugin(): Plugin {
  return {
    name: 'pecadosvip-local-synthetic-media',
    apply: 'serve',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = parseLocalRequestPathname(request.url);
        if (pathname === null) {
          response.writeHead(400, blockedHeaders);
          response.end();
          return;
        }
        const match = syntheticMediaPattern.exec(pathname);
        if (!match) {
          next();
          return;
        }

        const hostHeader =
          typeof request.headers.host === 'string'
            ? request.headers.host
            : undefined;
        const environment = {
          NODE_ENV: 'development',
          PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW:
            process.env.PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW,
        };
        if (!isSyntheticPreviewRequestAllowed(hostHeader, environment)) {
          response.writeHead(404, blockedHeaders);
          response.end();
          return;
        }

        const candidate = getSyntheticPreviewAsset(match[1]!, match[2]!);
        if (!candidate) {
          response.writeHead(404, blockedHeaders);
          response.end();
          return;
        }

        const assetRoot = resolve(process.cwd(), 'assets', 'synthetic-profiles');
        const filePath = resolve(process.cwd(), candidate.sourcePath);
        if (!filePath.startsWith(`${assetRoot}${sep}`)) {
          response.writeHead(404, blockedHeaders);
          response.end();
          return;
        }

        try {
          const bytes = await readFile(filePath);
          response.writeHead(200, {
            ...blockedHeaders,
            'Content-Length': String(bytes.byteLength),
            'Content-Type': candidate.contentType,
          });
          response.end(bytes);
        } catch {
          response.writeHead(404, blockedHeaders);
          response.end();
        }
      });
    },
  };
}
