import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { NextResponse } from 'next/server';
import { getSyntheticServiceMedia, isSyntheticServiceMediaKey } from '../../../../../lib/preview/synthetic-service-media';

export async function GET(request: Request, context: { params: Promise<{ service: string }> }) {
  const { service } = await context.params;
  if (!isSyntheticServiceMediaKey(service)) return new NextResponse('Not found', { status: 404 });
  const media = getSyntheticServiceMedia(service, 'es');
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
