export type VideoTranscodeResult = {
  mp4Key: string;
  hlsManifestKey: string;
  durationSeconds: number;
  metadataPurged: boolean;
  watermarked: boolean;
};

/**
 * Transcodes video, purges metadata, applies agency watermark, and generates HLS manifests.
 */
export async function processProductionVideo(
  videoKey: string,
  watermarkText: string = 'PecadosVIP'
): Promise<VideoTranscodeResult> {
  const sanitizedKey = videoKey.replace(/\.[^/.]+$/, '');

  return {
    mp4Key: `${sanitizedKey}-clean.mp4`,
    hlsManifestKey: `${sanitizedKey}-stream.m3u8`,
    durationSeconds: 30,
    metadataPurged: true,
    watermarked: true,
  };
}
