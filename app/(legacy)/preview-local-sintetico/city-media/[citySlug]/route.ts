import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { NextResponse } from 'next/server';
import { getSyntheticCityMedia, isSyntheticCityMediaSlug } from '../../../../../lib/preview/synthetic-city-media';

export async function GET(request: Request, context: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await context.params;
  if (!isSyntheticCityMediaSlug(citySlug)) return new NextResponse('Not found', { status: 404 });
  const media = getSyntheticCityMedia(citySlug, 'es');
  try {
    const file = await readFile(resolve(process.cwd(), media.sourcePath));
    return new NextResponse(file, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
