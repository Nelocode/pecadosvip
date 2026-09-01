import sharp from 'sharp';
import { purgeExifMetadata, applyWatermark } from './production-media-processor.ts';

export type ResponsiveVariantsResult = {
  smWebp: Buffer; // 320px
  mdWebp: Buffer; // 640px
  lgWebp: Buffer; // 1200px
  smAvif: Buffer;
  mdAvif: Buffer;
  lgAvif: Buffer;
  srcsetWebp: string;
  srcsetAvif: string;
};

/**
 * Generates 3-tier responsive srcset image variants (320px, 640px, 1200px) in WebP and AVIF formats using Sharp.
 */
export async function generateResponsiveVariants(
  imageBuffer: Buffer,
  baseFilenameKey: string
): Promise<ResponsiveVariantsResult> {
  const cleanBuffer = await purgeExifMetadata(imageBuffer);
  const watermarkedBuffer = await applyWatermark(cleanBuffer);

  const smWebp = await sharp(watermarkedBuffer).resize({ width: 320 }).webp({ quality: 80 }).toBuffer();
  const mdWebp = await sharp(watermarkedBuffer).resize({ width: 640 }).webp({ quality: 82 }).toBuffer();
  const lgWebp = await sharp(watermarkedBuffer).resize({ width: 1200 }).webp({ quality: 85 }).toBuffer();

  const smAvif = await (sharp(watermarkedBuffer).resize({ width: 320 }) as any).avif({ quality: 70 }).toBuffer();
  const mdAvif = await (sharp(watermarkedBuffer).resize({ width: 640 }) as any).avif({ quality: 75 }).toBuffer();
  const lgAvif = await (sharp(watermarkedBuffer).resize({ width: 1200 }) as any).avif({ quality: 80 }).toBuffer();

  const baseName = baseFilenameKey.replace(/\.[^/.]+$/, '');

  const srcsetWebp = `${baseName}-320.webp 320w, ${baseName}-640.webp 640w, ${baseName}-1200.webp 1200w`;
  const srcsetAvif = `${baseName}-320.avif 320w, ${baseName}-640.avif 640w, ${baseName}-1200.avif 1200w`;

  return {
    smWebp,
    mdWebp,
    lgWebp,
    smAvif,
    mdAvif,
    lgAvif,
    srcsetWebp,
    srcsetAvif,
  };
}
