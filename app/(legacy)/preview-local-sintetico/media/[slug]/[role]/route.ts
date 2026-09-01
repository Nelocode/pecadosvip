import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSyntheticPreviewAsset } from '../../../../../../lib/preview/synthetic-preview';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; role: string }> }
) {
  const { slug, role } = await params;
  const asset = getSyntheticPreviewAsset(slug, role);

  if (!asset) {
    return new NextResponse('Asset not found', { status: 404 });
  }

  const publicPath = path.join(process.cwd(), 'public', asset.sourcePath);
  const fallbackPath = path.join(process.cwd(), asset.sourcePath);
  const filePath = fs.existsSync(publicPath) ? publicPath : fallbackPath;

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found on disk', { status: 404 });
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
