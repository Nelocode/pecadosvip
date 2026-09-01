import assert from 'node:assert/strict';
import { test } from 'node:test';
import sharp from 'sharp';
import {
  applyWatermark,
  generateSignedMediaToken,
  processProductionImage,
  purgeExifMetadata,
  verifySignedMediaToken,
} from '../lib/media/production-media-processor.ts';

test('purgeExifMetadata strips EXIF/GPS metadata using Sharp', async () => {
  // Create a minimal PNG buffer using sharp
  const rawPng = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const clean = await purgeExifMetadata(rawPng);
  assert.ok(clean.length > 0);

  const meta = await sharp(clean).metadata();
  assert.equal(meta.format, 'png');
  assert.equal(meta.width, 100);
});

test('applyWatermark overlays text watermark onto image', async () => {
  const rawPng = await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 4,
      background: { r: 0, g: 100, b: 200, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const watermarked = await applyWatermark(rawPng, undefined, {
    textLogo: 'PECADOSVIP_TEST',
    position: 'bottom-right',
  });

  assert.ok(watermarked.length > 0);
  const meta = await sharp(watermarked).metadata();
  assert.equal(meta.width, 200);
});

test('processProductionImage generates WebP and AVIF variants with EXIF purging and watermarking', async () => {
  const rawImage = await sharp({
    create: {
      width: 150,
      height: 150,
      channels: 3,
      background: { r: 50, g: 50, b: 50 },
    },
  })
    .jpeg()
    .toBuffer();

  const result = await processProductionImage(rawImage);

  assert.equal(result.exifPurged, true);
  assert.equal(result.watermarked, true);
  assert.equal(result.width, 150);
  assert.equal(result.height, 150);
  assert.ok(result.webpBuffer.length > 0);
  assert.ok(result.avifBuffer.length > 0);

  const webpMeta = await sharp(result.webpBuffer).metadata();
  assert.equal(webpMeta.format, 'webp');

  const avifMeta = await sharp(result.avifBuffer).metadata();
  assert.ok(['avif', 'heif'].includes(avifMeta.format || ''));
});

test('generateSignedMediaToken and verifySignedMediaToken validate anti-scraping signed URLs', () => {
  const secretKey = 'media-signing-secret-key-12345';
  const mediaId = 'media-asset-789';
  const nowUnix = Math.floor(Date.now() / 1000);
  const validUntilUnix = nowUnix + 300; // 5 minutes valid

  const token = generateSignedMediaToken(mediaId, secretKey, validUntilUnix);

  assert.ok(token.length > 0);

  // Verification with valid token
  assert.equal(verifySignedMediaToken(mediaId, token, secretKey, nowUnix), true);

  // Verification with expired timestamp
  const expiredUnix = validUntilUnix + 10;
  assert.equal(verifySignedMediaToken(mediaId, token, secretKey, expiredUnix), false);

  // Verification with tampered mediaId
  assert.equal(verifySignedMediaToken('different-media-id', token, secretKey, nowUnix), false);

  // Verification with wrong secret key
  assert.equal(verifySignedMediaToken(mediaId, token, 'wrong-secret', nowUnix), false);
});
