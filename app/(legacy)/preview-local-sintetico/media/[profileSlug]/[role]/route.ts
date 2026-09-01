import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { NextResponse } from 'next/server';
import { getSyntheticPreviewAsset } from '../../../../../../lib/preview/synthetic-preview';

export async function GET(request: Request, context: { params: Promise<{ profileSlug: string, role: string }> }) {
  const { profileSlug, role } = await context.params;
  const media = getSyntheticPreviewAsset(profileSlug, role);
  if (!media) return new NextResponse('Not found', { status: 404 });
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
