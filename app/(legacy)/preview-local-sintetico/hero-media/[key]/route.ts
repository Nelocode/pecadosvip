import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { NextResponse } from 'next/server';
import {
  getSyntheticHeroMedia,
  isSyntheticHeroMediaKey,
} from '../../../../../lib/preview/synthetic-hero-media';

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { key } = await context.params;
  if (!isSyntheticHeroMediaKey(key)) {
    return new NextResponse('Not found', { status: 404 });
  }
  const media = getSyntheticHeroMedia(key);
  try {
    const file = await readFile(resolve(process.cwd(), media.sourcePath));
    return new NextResponse(file, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
