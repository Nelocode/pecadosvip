import { createHmac, timingSafeEqual } from 'node:crypto';
import sharp from 'sharp';

export type WatermarkPosition = 'center' | 'top-right' | 'bottom-right' | 'diagonal';

export type WatermarkOptions = {
  opacity?: number; // 0.1 to 1.0 (default: 0.3)
  position?: WatermarkPosition;
  textLogo?: string; // Fallback text watermark if SVG/PNG logo buffer is omitted
};

export type ProcessedMediaOutput = {
  webpBuffer: Buffer;
  avifBuffer: Buffer;
  width: number;
  height: number;
  exifPurged: boolean;
  watermarked: boolean;
};

/**
 * Purges all EXIF, GPS, camera model, and device metadata from an image buffer using Sharp.
 */
export async function purgeExifMetadata(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .withMetadata(false) // Purges all metadata, ICC profile defaults, GPS, EXIF
    .rotate() // Auto-rotates based on EXIF orientation before stripping
    .toBuffer();
}

/**
 * Applies an agency watermark overlay onto an image buffer using Sharp composition.
 */
export async function applyWatermark(
  imageBuffer: Buffer,
  watermarkLogoBuffer?: Buffer,
  options: WatermarkOptions = {}
): Promise<Buffer> {
  const { opacity = 0.3, position = 'bottom-right', textLogo = 'PecadosVIP' } = options;

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  let watermarkBufferToUse: Buffer;

  if (watermarkLogoBuffer) {
    watermarkBufferToUse = watermarkLogoBuffer;
  } else {
    // Generate SVG text watermark buffer
    const fontSize = Math.max(24, Math.round(width * 0.04));
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .watermark {
            fill: rgba(255, 255, 255, ${opacity});
            font-size: ${fontSize}px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
          }
        </style>
        ${
          position === 'diagonal'
            ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="watermark" transform="rotate(-30, ${width / 2}, ${height / 2})">${textLogo}</text>`
            : position === 'top-right'
            ? `<text x="${width - 30}" y="40" text-anchor="end" class="watermark">${textLogo}</text>`
            : `<text x="${width - 30}" y="${height - 30}" text-anchor="end" class="watermark">${textLogo}</text>`
        }
      </svg>
    `;
    watermarkBufferToUse = Buffer.from(svgText);
  }

  return image
    .composite([
      {
        input: watermarkBufferToUse,
        gravity: position === 'diagonal' ? 'center' : position === 'top-right' ? 'northeast' : 'southeast',
      },
    ])
    .toBuffer();
}

/**
 * Full production pipeline for image processing:
 * 1. Purges EXIF/GPS metadata
 * 2. Applies adaptive agency watermark
 * 3. Transcodes to WebP and AVIF formats
 */
export async function processProductionImage(
  imageBuffer: Buffer,
  watermarkOptions?: WatermarkOptions
): Promise<ProcessedMediaOutput> {
  // Step 1: Purge EXIF
  const cleanBuffer = await purgeExifMetadata(imageBuffer);

  // Step 2: Apply Watermark
  const watermarkedBuffer = await applyWatermark(cleanBuffer, undefined, watermarkOptions);

  const baseImage = sharp(watermarkedBuffer);
  const metadata = await baseImage.metadata();

  // Step 3: Transcode WebP and AVIF
  const webpBuffer = await sharp(watermarkedBuffer).webp({ quality: 82 }).toBuffer();
  const avifBuffer = await sharp(watermarkedBuffer).avif({ quality: 75 }).toBuffer();

  return {
    webpBuffer,
    avifBuffer,
    width: metadata.width || 0,
    height: metadata.height || 0,
    exifPurged: true,
    watermarked: true,
  };
}

/**
 * Generates an HMAC-SHA256 signed temporary URL token for anti-scraping & direct download protection.
 */
export function generateSignedMediaToken(
  mediaId: string,
  secretKey: string,
  expiresAtUnixSeconds: number
): string {
  const payload = `${mediaId}:${expiresAtUnixSeconds}`;
  const hmac = createHmac('sha256', secretKey).update(payload).digest('hex');
  return `${expiresAtUnixSeconds}.${hmac}`;
}

/**
 * Verifies a signed media URL token.
 */
export function verifySignedMediaToken(
  mediaId: string,
  token: string,
  secretKey: string,
  currentUnixSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
  if (!token || !token.includes('.')) return false;

  const [expiresStr, signatureHex] = token.split('.');
  const expiresAt = parseInt(expiresStr, 10);

  if (isNaN(expiresAt) || currentUnixSeconds > expiresAt) {
    return false; // Token expired
  }

  const expectedPayload = `${mediaId}:${expiresAt}`;
  const expectedHmac = createHmac('sha256', secretKey).update(expectedPayload).digest('hex');

  const sigBuffer = Buffer.from(signatureHex, 'hex');
  const expectedBuffer = Buffer.from(expectedHmac, 'hex');

  if (sigBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(sigBuffer, expectedBuffer);
}
