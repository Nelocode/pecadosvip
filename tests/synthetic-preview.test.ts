import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import test from 'node:test';

import {
  filterSyntheticPreviewProfiles,
  getSyntheticPreviewAsset,
  getSyntheticPreviewProfile,
  getSyntheticPreviewProfiles,
  isSyntheticPreviewEnabled,
  isSyntheticPreviewRequestAllowed,
  SYNTHETIC_PREVIEW_PATH,
  syntheticPreviewAssetRoles,
} from '../lib/preview/synthetic-preview.ts';
import { parseLocalRequestPathname } from '../scripts/vite-local-synthetic-media.ts';

test('the local preview middleware fails closed on malformed request URLs', () => {
  assert.equal(parseLocalRequestPathname('/preview-local-sintetico'), '/preview-local-sintetico');
  assert.equal(parseLocalRequestPathname(undefined), '/');
  assert.equal(parseLocalRequestPathname('//'), null);
});

test('preview requires the explicit flag and a development loopback request', () => {
  const enabled = {
    NODE_ENV: 'development',
    PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW: '1',
  };
  assert.equal(isSyntheticPreviewEnabled(enabled), true);
  assert.equal(isSyntheticPreviewRequestAllowed('127.0.0.1:3000', enabled), true);
  assert.equal(isSyntheticPreviewRequestAllowed('localhost:3000', enabled), true);
  assert.equal(isSyntheticPreviewRequestAllowed('[::1]:3000', enabled), true);
  assert.equal(isSyntheticPreviewRequestAllowed('preview.example.com', enabled), false);
  assert.equal(isSyntheticPreviewRequestAllowed('localhost,example.com', enabled), false);
  assert.equal(
    isSyntheticPreviewRequestAllowed('localhost:3000', {
      ...enabled,
      NODE_ENV: 'production',
    }),
    false,
  );
  assert.equal(
    isSyntheticPreviewRequestAllowed('localhost:3000', {
      ...enabled,
      NODE_ENV: 'test',
    }),
    false,
  );
  assert.equal(
    isSyntheticPreviewRequestAllowed('localhost:3000', {
      ...enabled,
      PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW: 'true',
    }),
    false,
  );
});

test('preview integrates the six synthetic identities and only reviewed technical derivatives', () => {
  const first = getSyntheticPreviewProfiles();
  const second = getSyntheticPreviewProfiles();
  assert.notEqual(first, second);
  first[0]!.displayName = 'mutated outside';
  assert.notEqual(second[0]!.displayName, first[0]!.displayName);
  assert.deepEqual(
    second.map((profile) => profile.slug),
    ['valeria', 'sofia', 'lucia', 'julia', 'mia', 'alicia'],
  );
  assert.deepEqual(
    second.map((profile) => profile.displayName),
    ['Valeria', 'Sofía', 'Lucía', 'Julia', 'Mia', 'Alicia'],
  );

  const assetRoot = resolve('assets', 'synthetic-profiles');
  for (const profile of second) {
    assert.equal(profile.syntheticNotice, 'Perfil ficticio generado con IA');
    assert.equal(profile.media.length, 4);
    assert.deepEqual(
      profile.media.map((asset) => asset.role),
      syntheticPreviewAssetRoles,
    );
    assert.equal(profile.cover.desktopUrl, profile.media[0]!.desktopUrl);
    for (const asset of profile.media) {
      assert.match(
        asset.desktopUrl,
        new RegExp(`^${SYNTHETIC_PREVIEW_PATH}/media/${profile.slug}/`),
      );
      assert.doesNotMatch(asset.desktopUrl, /https?:|data:/i);
      assert.match(asset.alt.toLowerCase(), /ficticia generada con ia/);
      const source = resolve(asset.sourcePath);
      assert.ok(source.startsWith(`${assetRoot}${sep}`));
      assert.equal(existsSync(source), true, `${asset.sourcePath} must exist`);
      assert.doesNotMatch(asset.sourcePath, /public[\\/]/i);
      assert.doesNotMatch(asset.sourcePath, /alicia-gallery-02-v01\.png$/);
    }
  }
});

test('preview filtering, detail lookup and media allowlist are deterministic', () => {
  assert.deepEqual(
    filterSyntheticPreviewProfiles({ city: 'madrid' }).map((profile) => profile.slug),
    ['valeria', 'lucia', 'alicia'],
  );
  assert.deepEqual(
    filterSyntheticPreviewProfiles({ city: 'barcelona' }).map((profile) => profile.slug),
    ['sofia', 'lucia', 'mia'],
  );
  assert.deepEqual(
    filterSyntheticPreviewProfiles({ availability: 'available' }).map(
      (profile) => profile.slug,
    ),
    ['valeria', 'sofia', 'mia'],
  );
  assert.deepEqual(
    filterSyntheticPreviewProfiles({
      city: 'barcelona',
      availability: 'limited',
    }).map((profile) => profile.slug),
    ['lucia'],
  );
  assert.equal(getSyntheticPreviewProfile('sofia')?.displayName, 'Sofía');
  assert.equal(getSyntheticPreviewProfile('missing'), undefined);
  assert.match(
    getSyntheticPreviewAsset('alicia', 'gallery-02')?.sourcePath ?? '',
    /alicia-gallery-02-v02\.png$/,
  );
  assert.equal(getSyntheticPreviewAsset('alicia', '../../secret'), undefined);
  assert.equal(getSyntheticPreviewAsset('../alicia', 'cover'), undefined);
});

test('catalog, detail and media middleware stay local-only, noindex and contact-free', () => {
  const pageSource = readFileSync(
    'app/(legacy)/preview-local-sintetico/page.tsx',
    'utf8',
  );
  const detailSource = readFileSync(
    'app/(legacy)/preview-local-sintetico/perfiles/[slug]/page.tsx',
    'utf8',
  );
  const mediaMiddlewareSource = readFileSync(
    'scripts/vite-local-synthetic-media.ts',
    'utf8',
  );
  const publicCssSource = readFileSync('app/public-site.css', 'utf8');
  const viteConfigSource = readFileSync('vite.config.ts', 'utf8');
  const profileCardSource = readFileSync('app/components/ProfileCard.tsx', 'utf8');
  const profileMediaSource = readFileSync(
    'app/components/PublicProfileMedia.tsx',
    'utf8',
  );
  assert.equal(SYNTHETIC_PREVIEW_PATH, '/preview-local-sintetico');
  for (const source of [pageSource, detailSource]) {
    assert.match(source, /robots:\s*\{[\s\S]*index:\s*false/);
    assert.match(source, /isSyntheticPreviewRequestAllowed/);
    assert.match(source, /import\.meta\.env\.DEV/);
    assert.match(source, /VITE_PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW/);
    assert.doesNotMatch(source, /ContactOptions|https?:\/\//);
  }
  assert.match(pageSource, /<ProfileCard/);
  assert.match(pageSource, /disclosure=\{candidate\.syntheticNotice\}/);
  assert.match(pageSource, /preserveFullImage/);
  assert.match(pageSource, /profileHref=\{`\/preview-local-sintetico\/perfiles\//);
  assert.match(detailSource, /Contactar · no disponible en preview/);
  assert.match(detailSource, /button type="button" disabled/);
  assert.match(detailSource, /<PublicProfileMedia/);
  assert.match(mediaMiddlewareSource, /apply: 'serve'/);
  assert.match(mediaMiddlewareSource, /isSyntheticPreviewRequestAllowed/);
  assert.match(mediaMiddlewareSource, /assetRoot/);
  assert.match(mediaMiddlewareSource, /private, no-store/);
  assert.match(mediaMiddlewareSource, /noimageindex/);
  assert.match(viteConfigSource, /localSyntheticMediaPlugin\(\)/);
  assert.match(profileCardSource, /disclosure\?: string/);
  assert.match(profileCardSource, /preserveFullImage\?: boolean/);
  assert.match(profileCardSource, /<PublicProfileMedia/);
  assert.match(profileMediaSource, /preserveFullImage \? \('contain' as const\)/);
  assert.match(profileMediaSource, /objectPosition: 'center top'/);
  assert.match(
    publicCssSource,
    /\.synthetic-profile-grid \.profile-card-media\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4/,
  );
  assert.match(
    publicCssSource,
    /\.synthetic-profile-active-image\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4/,
  );
});

test('local preview exposes the complete internal home flow without enabling conversion', () => {
  const pageSource = readFileSync(
    'app/(legacy)/preview-local-sintetico/page.tsx',
    'utf8',
  );
  const publicCssSource = readFileSync('app/public-site.css', 'utf8');

  for (const anchor of ['inicio', 'cobertura', 'perfiles', 'servicios', 'seguridad']) {
    assert.match(pageSource, new RegExp(`href="#${anchor}"`));
  }
  for (const [slug, city] of [
    ['madrid', 'Madrid'],
    ['barcelona', 'Barcelona'],
    ['girona', 'Girona'],
    ['tarragona', 'Tarragona'],
    ['toledo', 'Toledo'],
    ['guadalajara', 'Guadalajara'],
    ['segovia', 'Segovia'],
  ]) {
    assert.match(pageSource, new RegExp(`${slug}: '${city}'`));
  }
  assert.match(pageSource, /getSyntheticPreviewProfiles/);
  assert.match(pageSource, /<PublicProfileMedia/);
  assert.match(pageSource, /Imagen generada con IA/);
  assert.match(pageSource, /Siete ciudades en la experiencia propuesta/);
  assert.match(pageSource, /Servicios exclusivos · propuesta/);
  assert.match(pageSource, /Reserva desactivada/);
  assert.match(pageSource, /Contactar · no disponible/);
  assert.match(pageSource, /type="button"\s+disabled/);
  assert.doesNotMatch(
    pageSource,
    /ContactOptions|formActionUrl|mailto:|tel:|https?:\/\/(?:t\.me|wa\.me)/,
  );

  assert.match(publicCssSource, /\.synthetic-preview-hero\s*\{/);
  assert.match(publicCssSource, /\.synthetic-preview-coverage-groups\s*\{/);
  assert.match(publicCssSource, /\.synthetic-preview-service-grid\s*\{/);
  assert.match(publicCssSource, /@media \(max-width: 480px\)/);
  assert.match(publicCssSource, /@media \(prefers-reduced-motion: reduce\)/);
});

test('manifest keeps synthetic candidates outside public production paths', () => {
  const manifest = readFileSync(
    'assets/synthetic-profiles/ASSET_MANIFEST.csv',
    'utf8',
  );
  const rows = manifest.trim().split(/\r?\n/).slice(1);
  assert.ok(rows.length >= 30);
  for (const row of rows) {
    const columns = row.split(',');
    assert.equal(columns[3], '', 'public_path must remain empty before approval');
  }
});
