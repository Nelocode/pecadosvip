import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import test from 'node:test';

import sharp from 'sharp';

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
import {
  getSyntheticServiceCatalog,
  getSyntheticServiceMessages,
  getSyntheticService,
  syntheticServiceGroups,
} from '../lib/preview/synthetic-services.ts';
import {
  getSyntheticServiceMedia,
  syntheticServiceMediaKeys,
} from '../lib/preview/synthetic-service-media.ts';
import {
  getSyntheticCityMedia,
  getSyntheticCityPresentation,
  syntheticCityMediaSlugs,
} from '../lib/preview/synthetic-city-media.ts';
import { parseLocalRequestPathname } from '../scripts/vite-local-synthetic-media.ts';

function fileSha256(path: string): string {
  return createHash('sha256')
    .update(readFileSync(resolve(path)))
    .digest('hex')
    .toUpperCase();
}

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
  assert.match(pageSource, /name="lang" type="hidden" value=\{locale\}/);
  assert.match(pageSource, /servicios\?lang=\$\{locale\}/);
  assert.match(detailSource, /\?lang=\$\{locale\}&foto=\$\{candidate\.role\}/);
  assert.match(detailSource, /Contactar · no disponible en preview/);
  assert.match(detailSource, /button type="button" disabled/);
  assert.match(detailSource, /<PublicProfileMedia/);
  assert.match(mediaMiddlewareSource, /apply: 'serve'/);
  assert.match(mediaMiddlewareSource, /isSyntheticPreviewRequestAllowed/);
  assert.match(mediaMiddlewareSource, /syntheticCityMediaPattern/);
  assert.match(mediaMiddlewareSource, /isSyntheticCityMediaSlug/);
  assert.match(mediaMiddlewareSource, /'synthetic-cities'/);
  assert.match(mediaMiddlewareSource, /assetRoot/);
  assert.match(mediaMiddlewareSource, /private, no-store/);
  assert.match(mediaMiddlewareSource, /noimageindex/);
  assert.match(viteConfigSource, /localSyntheticMediaPlugin\(\)/);
  assert.match(viteConfigSource, /ignored:\s*\['\*\*\/stage-archives\/\*\*'\]/);
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

  for (const anchor of ['inicio', 'cobertura', 'perfiles', 'seguridad']) {
    assert.match(pageSource, new RegExp(`href="#${anchor}"`));
  }
  assert.match(pageSource, /id="servicios"/);
  assert.match(
    pageSource,
    /href=\{`\/preview-local-sintetico\/servicios\?lang=\$\{locale\}`\}/,
  );
  for (const [slug, city] of [
    ['madrid', 'Madrid'],
    ['barcelona', 'Barcelona'],
    ['girona', 'Girona'],
    ['tarragona', 'Tarragona'],
    ['toledo', 'Toledo'],
    ['guadalajara', 'Guadalajara'],
    ['segovia', 'Segovia'],
    ['sitges', 'Sitges'],
  ]) {
    assert.match(pageSource, new RegExp(`${slug}: '${city}'`));
  }
  assert.match(pageSource, /getSyntheticPreviewProfiles/);
  assert.match(pageSource, /<PublicProfileMedia/);
  assert.match(pageSource, /Imagen generada con IA/);
  assert.match(pageSource, /cityPresentation\.coverageTitle/);
  assert.match(pageSource, /getSyntheticCityMedia/);
  assert.match(pageSource, /cityMedia\.shortDisclosure/);
  assert.match(pageSource, /id=\{`city-\$\{citySlug\}`\}/);
  assert.match(pageSource, /Servicios exclusivos · propuesta/);
  assert.match(pageSource, /synthetic-preview-hero-title-primary/);
  assert.match(pageSource, /synthetic-preview-hero-title-secondary/);
  assert.match(pageSource, /Reserva desactivada/);
  assert.match(pageSource, /Contactar · no disponible/);
  assert.match(pageSource, /type="button"\s+disabled/);
  assert.doesNotMatch(
    pageSource,
    /ContactOptions|formActionUrl|mailto:|tel:|https?:\/\/(?:t\.me|wa\.me)/,
  );

  assert.match(publicCssSource, /\.synthetic-preview-hero\s*\{/);
  assert.match(
    publicCssSource,
    /\.synthetic-preview-hero-title-primary\s*\{[\s\S]*?line-height:\s*1\.15/,
  );
  assert.match(
    publicCssSource,
    /\.synthetic-preview-hero-title-secondary\s*\{[\s\S]*?line-height:\s*1\.15/,
  );
  assert.match(publicCssSource, /\.synthetic-preview-coverage-groups\s*\{/);
  assert.match(publicCssSource, /\.synthetic-preview-service-grid\s*\{/);
  assert.match(publicCssSource, /@media \(max-width: 480px\)/);
  assert.match(publicCssSource, /@media \(prefers-reduced-motion: reduce\)/);
});

test('service preview exposes 34 PecadosVip routes in four complete locale projections', () => {
  const slugs = getSyntheticServiceCatalog('es').map((service) => service.slug);
  const referenceInventory = JSON.parse(
    readFileSync('docs/reference/felina-route-inventory.json', 'utf8'),
  ) as { routes: Array<{ family: string; locale: string; path: string; routeType: string }> };
  const referenceServiceSlugs = new Set(
    referenceInventory.routes
      .filter(
        (route) =>
          route.family === 'services' &&
          route.locale === 'es' &&
          route.routeType === 'detail',
      )
      .map((route) => route.path.split('/').at(-1)),
  );
  assert.equal(slugs.length, 34);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.deepEqual(
    slugs.filter((slug) => referenceServiceSlugs.has(slug)),
    [],
    'PecadosVip route slugs must remain distinct from the reference inventory',
  );
  assert.equal(syntheticServiceGroups.length, 6);

  for (const locale of ['es', 'en', 'fr', 'it'] as const) {
    const catalog = getSyntheticServiceCatalog(locale);
    const messages = getSyntheticServiceMessages(locale);
    assert.equal(catalog.length, 34);
    assert.equal(catalog.every((service) => service.name.trim() && service.teaser.trim()), true);
    assert.equal(messages.faqs.length, 4);
    const knownService = getSyntheticService('compania-privada', locale);
    assert.ok(knownService);
    assert.equal(knownService.name.trim().length > 0, true);
  }
  assert.equal(getSyntheticService('../secret', 'es'), undefined);
});

test('service catalogue maps every route to reviewed local symbolic media', () => {
  const catalog = getSyntheticServiceCatalog('es');
  const assignedMediaKeys = catalog.map((service) => service.mediaKey);
  assert.equal(syntheticServiceMediaKeys.length, 34);
  assert.equal(new Set(syntheticServiceMediaKeys).size, 34);
  assert.equal(
    new Set(assignedMediaKeys).size,
    catalog.length,
    'every service route must use its own symbolic image',
  );
  assert.equal(catalog.every((service) => syntheticServiceMediaKeys.includes(service.mediaKey)), true);

  for (const key of syntheticServiceMediaKeys) {
    const media = getSyntheticServiceMedia(key, 'es');
    assert.match(media.desktopUrl, /^\/preview-local-sintetico\/service-media\//);
    assert.equal(media.contentType, 'image/webp');
    assert.match(media.alt, /\S/);
    assert.equal(existsSync(resolve(media.sourcePath)), true, media.sourcePath);
    assert.doesNotMatch(media.sourcePath, /public[\\/]/i);
  }
});

test('eight unique city references are localized and remain local-only', () => {
  assert.deepEqual(
    [...syntheticCityMediaSlugs],
    ['madrid', 'barcelona', 'girona', 'tarragona', 'toledo', 'guadalajara', 'segovia', 'sitges'],
  );
  assert.equal(new Set(syntheticCityMediaSlugs).size, 8);

  const expectedDisclosure = {
    es: 'Imagen de referencia generada con IA · cobertura no confirmada',
    en: 'AI-generated reference image · coverage not confirmed',
    fr: 'Image de référence générée par IA · couverture non confirmée',
    it: 'Immagine di riferimento generata con IA · copertura non confermata',
  } as const;
  const expectedShortDisclosure = {
    es: 'Generada con IA',
    en: 'AI-generated',
    fr: 'Générée par IA',
    it: 'Generata con IA',
  } as const;

  for (const locale of ['es', 'en', 'fr', 'it'] as const) {
    const presentation = getSyntheticCityPresentation(locale);
    assert.match(presentation.coverageTitle, /\S/);
    assert.match(presentation.pendingStatus, /\S/);
    for (const citySlug of syntheticCityMediaSlugs) {
      const media = getSyntheticCityMedia(citySlug, locale);
      assert.equal(media.citySlug, citySlug);
      assert.equal(media.contentType, 'image/webp');
      assert.equal(media.disclosure, expectedDisclosure[locale]);
      assert.equal(media.shortDisclosure, expectedShortDisclosure[locale]);
      assert.match(media.alt, /\S/);
      assert.match(
        media.desktopUrl,
        new RegExp(`^/preview-local-sintetico/city-media/${citySlug}$`, 'u'),
      );
      assert.equal(existsSync(resolve(media.sourcePath)), true, media.sourcePath);
      assert.doesNotMatch(media.sourcePath, /public[\\/]/i);
    }
  }
});

test('service hub and detail remain local-only, noindex, contact-free and interactive', () => {
  const hub = readFileSync(
    'app/(legacy)/preview-local-sintetico/servicios/page.tsx',
    'utf8',
  );
  const detail = readFileSync(
    'app/(legacy)/preview-local-sintetico/servicios/[slug]/page.tsx',
    'utf8',
  );
  const notice = readFileSync(
    'app/components/SyntheticPreviewNotice.tsx',
    'utf8',
  );
  const explorer = readFileSync(
    'app/components/SyntheticServiceExplorer.tsx',
    'utf8',
  );
  const card = readFileSync(
    'app/components/SyntheticServiceCard.tsx',
    'utf8',
  );
  const css = readFileSync('app/service-pages.css', 'utf8');

  for (const source of [hub, detail]) {
    assert.match(source, /robots:\s*\{[\s\S]*index:\s*false/);
    assert.match(source, /isSyntheticPreviewRequestAllowed/);
    assert.match(source, /VITE_PECADOSVIP_LOCAL_SYNTHETIC_PREVIEW/);
    assert.doesNotMatch(
      source,
      /ContactOptions|formActionUrl|mailto:|tel:|https?:\/\/(?:wa\.me|t\.me)/,
    );
  }
  assert.match(explorer, /name="category"/);
  assert.match(explorer, /role="search"/);
  assert.match(explorer, /type="search"/);
  assert.match(explorer, /aria-live="polite"/);
  assert.match(explorer, /aria-pressed=/);
  assert.match(explorer, /current\.length >= 3/);
  assert.doesNotMatch(explorer, /localStorage|sessionStorage|navigator\.share/);
  assert.match(card, /className="synthetic-service-card-select"/);
  assert.match(card, /aria-pressed=\{selection\.selected\}/);
  assert.match(hub, /<details/);
  assert.match(hub, /SyntheticPreviewNotice/);
  assert.match(hub, /#city-\$\{citySlug\}/);
  assert.match(hub, /cityMedia\.shortDisclosure/);
  assert.match(hub, /syntheticCityMediaSlugs\.map/);
  assert.match(hub, /<PublicProfileMedia/);
  assert.match(hub, /media=\{cityMedia\}/);
  assert.match(hub, /preserveFullImage=\{false\}/);
  assert.match(detail, /generateStaticParams/);
  assert.match(detail, /getRelatedSyntheticServices/);
  assert.match(notice, /window\.localStorage/);
  assert.match(css, /\.synthetic-services-grid\s*\{/);
  assert.match(
    css,
    /\.synthetic-services-hero h1\s*\{[\s\S]*?line-height:\s*1\.15/,
  );
  assert.match(
    css,
    /\.synthetic-service-detail-copy h1\s*\{[\s\S]*?line-height:\s*1\.15/,
  );
  assert.match(css, /grid-template-columns:\s*repeat\(4/);
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(
    css,
    /\.synthetic-services-page \.synthetic-services-catalog\s*\{\s*width:\s*100%;\s*max-width:\s*none;\s*margin:\s*0;/,
  );
  assert.match(
    css,
    /\.synthetic-services-catalog \.synthetic-services-grid\s*\{\s*grid-template-columns:\s*repeat\(12/,
  );
  assert.match(css, /last-child:nth-child\(4n \+ 2\)/);
  assert.match(css, /last-child:nth-child\(3n \+ 2\)/);
  assert.match(css, /last-child:nth-child\(2n \+ 1\)/);
  assert.match(css, /aspect-ratio:\s*8 \/ 5/);
  assert.match(css, /\.synthetic-services-city-directory\s*\{[\s\S]*?repeat\(8/);
  assert.match(css, /@media \(min-width: 781px\) and \(max-width: 1180px\)/);
  assert.match(
    css,
    /@media \(min-width: 781px\) and \(max-width: 1180px\)[\s\S]*?\.synthetic-services-city-directory\s*\{\s*grid-template-columns:\s*repeat\(4/,
  );
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
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

test('service image manifest remains non-public and pending human/legal review', async () => {
  const manifest = readFileSync(
    'assets/synthetic-services/ASSET_MANIFEST.csv',
    'utf8',
  );
  const rows = manifest.trim().split(/\r?\n/).slice(1);
  const columns = rows.map((row) => row.split(','));
  assert.equal(rows.length, 34);
  assert.deepEqual(
    columns.map((row) => row[0]),
    [...syntheticServiceMediaKeys],
  );
  assert.equal(
    new Set(columns.map((row) => row[7])).size,
    34,
    'master files must not repeat the same image bytes',
  );
  assert.equal(
    new Set(columns.map((row) => row[8])).size,
    34,
    'selected files must not repeat the same image bytes',
  );
  for (const row of columns) {
    assert.match(
      row[3]!,
      new RegExp(`^assets/synthetic-services/selected/${row[0]}-v\\d{2}\\.webp$`, 'u'),
    );
    assert.equal(
      row[2],
      row[3]!.replace('/selected/', '/master/').replace(/\.webp$/u, '.png'),
    );
    assert.equal(existsSync(resolve(row[2]!)), true, row[2]);
    assert.equal(existsSync(resolve(row[3]!)), true, row[3]);
    assert.equal(fileSha256(row[2]!), row[7], `${row[0]} master hash`);
    assert.equal(fileSha256(row[3]!), row[8], `${row[0]} selected hash`);
    const [masterMetadata, selectedMetadata] = await Promise.all([
      sharp(resolve(row[2]!)).metadata(),
      sharp(resolve(row[3]!)).metadata(),
    ]);
    assert.equal(masterMetadata.format, 'png', `${row[0]} master format`);
    assert.equal(selectedMetadata.format, 'webp', `${row[0]} selected format`);
    assert.equal(selectedMetadata.width, 960, `${row[0]} selected width`);
    assert.equal(selectedMetadata.height, 1200, `${row[0]} selected height`);
    assert.equal(
      `${masterMetadata.width}x${masterMetadata.height}`,
      row[9],
      `${row[0]} master dimensions`,
    );
    assert.equal(`${selectedMetadata.width}x${selectedMetadata.height}`, row[10]);
    assert.equal(row[4], '', 'public_path must remain empty before approval');
    assert.equal(row[12], 'PASS_HASH_DIMENSION_FORMAT_UNIQUE');
    assert.equal(row[13], 'PENDING');
    assert.equal(row[14], 'PENDING');
  }
});

test('city image manifest validates eight unique 4:3 WebP derivatives', async () => {
  const manifest = readFileSync(
    'assets/synthetic-cities/ASSET_MANIFEST.csv',
    'utf8',
  );
  const rows = manifest.trim().split(/\r?\n/).slice(1);
  const columns = rows.map((row) => row.split(','));
  assert.equal(rows.length, 8);
  assert.deepEqual(columns.map((row) => row[0]), [...syntheticCityMediaSlugs]);
  assert.equal(new Set(columns.map((row) => row[9])).size, 8);
  assert.equal(new Set(columns.map((row) => row[10])).size, 8);

  for (const row of columns) {
    assert.equal(row[1], 'reference');
    assert.equal(row[4], '', 'public_path must remain empty before approval');
    assert.equal(row[5], 'v1');
    assert.equal(row[8], 'UNKNOWN');
    assert.equal(row[13], 'image/png');
    assert.equal(row[14], 'image/webp');
    assert.equal(row[15], 'true');
    assert.equal(row[16], 'PASS_HASH_DIMENSION_FORMAT_UNIQUE');
    assert.equal(row[17], 'PENDING');
    assert.equal(row[18], 'PENDING');
    assert.equal(row[19], 'PENDING');
    assert.equal(row[20], 'PENDING');
    assert.equal(existsSync(resolve(row[2]!)), true, row[2]);
    assert.equal(existsSync(resolve(row[3]!)), true, row[3]);
    assert.equal(fileSha256(row[2]!), row[9], `${row[0]} master hash`);
    assert.equal(fileSha256(row[3]!), row[10], `${row[0]} selected hash`);

    const [masterMetadata, selectedMetadata] = await Promise.all([
      sharp(resolve(row[2]!)).metadata(),
      sharp(resolve(row[3]!)).metadata(),
    ]);
    assert.equal(masterMetadata.format, 'png');
    assert.equal(selectedMetadata.format, 'webp');
    assert.equal(selectedMetadata.width, 1200);
    assert.equal(selectedMetadata.height, 900);
    assert.equal(`${masterMetadata.width}x${masterMetadata.height}`, row[11]);
    assert.equal(`${selectedMetadata.width}x${selectedMetadata.height}`, row[12]);
  }
});
