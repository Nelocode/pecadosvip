import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { NextResponse } from 'next/server';
import { getSyntheticDecorMedia, isSyntheticDecorMediaKey } from '../../../../../lib/preview/synthetic-decor-media';

export async function GET(request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!isSyntheticDecorMediaKey(key)) return new NextResponse('Not found', { status: 404 });
  const media = getSyntheticDecorMedia(key);
  try {
    const file = await readFile(resolve(process.cwd(), media.sourcePath));
    return new NextResponse(file, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}
