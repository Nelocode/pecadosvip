import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSyntheticCityMedia } from '../../../../../lib/preview/synthetic-city-media';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const asset = getSyntheticCityMedia(slug as any, 'es');

  if (!asset) {
    return new NextResponse('City asset not found', { status: 404 });
  }

  const publicPath = path.join(process.cwd(), 'public', asset.sourcePath);
  const fallbackPath = path.join(process.cwd(), asset.sourcePath);
  const filePath = fs.existsSync(publicPath) ? publicPath : fallbackPath;

  if (!fs.existsSync(filePath)) {
    return new NextResponse('City file not found on disk', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')
    ? 'image/jpeg'
    : filePath.endsWith('.webp')
    ? 'image/webp'
    : 'image/png';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
