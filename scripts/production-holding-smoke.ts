import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { lstat } from 'node:fs/promises';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCatalog } from '../lib/i18n/catalog.ts';
import {
  localizedPath,
  SUPPORTED_LOCALES,
} from '../lib/i18n/locales.ts';

const READY_TIMEOUT_MS = 20_000;
const REQUEST_TIMEOUT_MS = 5_000;
const MAX_SERVER_LOG_CHARS = 64 * 1024;
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const standaloneServer = resolve(repositoryRoot, 'dist', 'standalone', 'server.js');

function delay(milliseconds: number) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function findLoopbackPort() {
  const reservation = createServer();
  reservation.unref();
  reservation.listen({ host: '127.0.0.1', port: 0, exclusive: true });
  await once(reservation, 'listening');
  const address = reservation.address();
  assert(address && typeof address === 'object', 'Could not reserve a loopback port.');
  const port = address.port;
  reservation.close();
  await once(reservation, 'close');
  return port;
}

function collectBoundedLog(
  stream: NodeJS.ReadableStream | null,
  append: (chunk: string) => void,
) {
  stream?.setEncoding('utf8');
  stream?.on('data', (chunk: string) => append(chunk));
}

async function waitForServer(origin: string, child: ChildProcess) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let lastError: unknown;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`The production server exited before readiness with code ${child.exitCode}.`);
    }
    try {
      const response = await fetch(origin, {
        redirect: 'manual',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.status > 0) return;
    } catch (error) {
      lastError = error;
    }
    await delay(200);
  }

  throw new Error(`Timed out waiting for the production server: ${String(lastError)}`);
}

async function request(origin: string, path: string) {
  const response = await fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return {
    path,
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  };
}

async function stopServer(child: ChildProcess) {
  if (child.exitCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([once(child, 'exit'), delay(5_000)]);
  if (child.exitCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
}

async function main() {
  const serverStats = await lstat(standaloneServer);
  assert(
    serverStats.isFile() && !serverStats.isSymbolicLink(),
    'The validated standalone server entrypoint is absent or unsafe.',
  );
  const port = await findLoopbackPort();
  const origin = `http://127.0.0.1:${port}`;
  let serverLog = '';
  const appendLog = (chunk: string) => {
    serverLog = `${serverLog}${chunk}`.slice(-MAX_SERVER_LOG_CHARS);
  };
  const child = spawn(
    process.execPath,
    [standaloneServer],
    {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        HOST: '127.0.0.1',
        NODE_ENV: 'production',
        PORT: String(port),
        PECADOSVIP_ENABLE_DRAFT_PREVIEW: 'true',
        PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW: 'true',
        VITE_PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW: 'true',
        NEXT_PUBLIC_CONTACT_APPROVED: 'true',
        NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED: 'true',
        NEXT_PUBLIC_WHATSAPP_URL: 'https://example.org/blocked-smoke-destination',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    },
  );
  collectBoundedLog(child.stdout, appendLog);
  collectBoundedLog(child.stderr, appendLog);

  try {
    await waitForServer(origin, child);
    const legacyHoldingPaths = [
      '/',
      '/madrid',
      '/barcelona',
      '/perfiles',
      '/contacto',
    ];
    const localizedSemanticPaths = [
      '/',
      '/madrid',
      '/barcelona',
      '/perfiles',
      '/contacto',
      '/legal/aviso-legal',
      '/legal/privacidad',
      '/legal/cookies',
      '/legal/terminos-del-servicio',
    ] as const;
    const holdingResults = [];
    const requiredHeaders = [
      'content-security-policy',
      'cross-origin-opener-policy',
      'permissions-policy',
      'referrer-policy',
      'x-content-type-options',
      'x-frame-options',
      'x-robots-tag',
    ];

    for (const path of legacyHoldingPaths) {
      const result = await request(origin, path);
      assert.equal(result.status, 200, `${path} must render the neutral holding page.`);
      assert.match(result.body, /Contenido en preparaci[oó]n/u, `${path} lacks the holding state.`);
      assert.doesNotMatch(result.body, /blocked-smoke-destination|example\.org/iu);
      assert.doesNotMatch(result.body, /href=["'][^"']*(?:whatsapp|telegram|tel:)/iu);
      assert.match(result.headers.get('content-type') ?? '', /^text\/html\b/iu);

      for (const header of requiredHeaders) {
        assert(result.headers.has(header), `${path} is missing ${header}.`);
      }
      assert.equal(result.headers.has('x-powered-by'), false, `${path} exposes x-powered-by.`);
      assert.match(result.headers.get('x-robots-tag') ?? '', /noindex/iu);
      assert.match(result.headers.get('content-security-policy') ?? '', /default-src 'self'/u);
      assert.match(result.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/u);
      assert.match(result.headers.get('content-security-policy') ?? '', /form-action 'self'/u);
      holdingResults.push({ path, status: result.status, holding: true });
    }

    for (const locale of SUPPORTED_LOCALES) {
      const messages = getCatalog(locale);
      for (const semanticPath of localizedSemanticPaths) {
        const path = localizedPath(locale, semanticPath);
        const result = await request(origin, path);
        assert.equal(result.status, 200, `${path} must render the neutral holding page.`);
        assert.ok(
          result.body.includes(messages.holding.title),
          `${path} lacks its localized holding state.`,
        );
        assert.doesNotMatch(result.body, /blocked-smoke-destination|example\.org/iu);
        assert.doesNotMatch(result.body, /href=["'][^"']*(?:whatsapp|telegram|tel:)/iu);
        assert.match(result.headers.get('content-type') ?? '', /^text\/html\b/iu);

        for (const header of requiredHeaders) {
          assert(result.headers.has(header), `${path} is missing ${header}.`);
        }
        assert.equal(result.headers.has('x-powered-by'), false, `${path} exposes x-powered-by.`);
        assert.match(result.headers.get('x-robots-tag') ?? '', /noindex/iu);
        holdingResults.push({ path, status: result.status, holding: true });
      }
    }

    const localizedNotFoundResults = [];
    for (const locale of SUPPORTED_LOCALES) {
      const path = localizedPath(locale, '/perfiles/no-existe');
      const result = await request(origin, path);
      assert.equal(result.status, 404, `${path} must remain unavailable.`);
      assert.ok(
        result.body.includes(getCatalog(locale).notFound.title),
        `${path} lacks its localized not-found state.`,
      );
      assert.match(result.headers.get('x-robots-tag') ?? '', /noindex/iu);
      localizedNotFoundResults.push({ path, status: result.status, localized: true });
    }

    const legal = await request(origin, '/legal/privacidad');
    assert.equal(legal.status, 404, 'Blocked legal copy must not be exposed.');
    const preview = await request(origin, '/preview-local-sintetico');
    assert.equal(preview.status, 404, 'The synthetic preview must remain unavailable in production.');
    const previewMedia = await request(
      origin,
      '/preview-local-sintetico/media/valeria/cover',
    );
    assert.equal(
      previewMedia.status,
      404,
      'Synthetic preview media must remain unavailable in production.',
    );

    const robots = await request(origin, '/robots.txt');
    assert.equal(robots.status, 200);
    assert.match(robots.headers.get('content-type') ?? '', /^text\/plain\b/iu);
    assert.match(robots.body, /^User-Agent:\s*\*\s*$/imu);
    assert.match(robots.body, /^Disallow:\s*\/\s*$/imu);
    assert.doesNotMatch(robots.body, /^Allow:/imu);
    assert.doesNotMatch(robots.body, /Sitemap:/iu);

    const sitemap = await request(origin, '/sitemap.xml');
    assert.equal(sitemap.status, 200);
    assert.match(
      sitemap.headers.get('content-type') ?? '',
      /^(?:application|text)\/xml\b/iu,
    );
    assert.match(sitemap.body, /<urlset\b[^>]*>/iu);
    assert.match(sitemap.body, /<\/urlset>/iu);
    assert.doesNotMatch(sitemap.body, /<url>/iu);
    assert.doesNotMatch(sitemap.body, /<loc>/iu);

    console.log(
      JSON.stringify({
        schema: 'pecadosvip.production-holding-smoke',
        version: 1,
        result: 'PASS',
        productionActivation: false,
        origin,
        holdingRoutes: holdingResults,
        blockedRoutes: [
          { path: legal.path, status: legal.status },
          { path: preview.path, status: preview.status },
          { path: previewMedia.path, status: previewMedia.status },
          ...localizedNotFoundResults,
        ],
        robotsDisallowAll: true,
        sitemapUrlCount: 0,
        limits: [
          'Local loopback Vinext standalone runtime only; no Docker engine or deployed runtime was tested.',
          'This smoke proves the fail-closed holding boundary, not legal approval, UAT or production readiness.',
        ],
      }),
    );
  } catch (error) {
    console.error(serverLog);
    throw error;
  } finally {
    await stopServer(child);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
