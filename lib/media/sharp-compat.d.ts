declare module 'sharp' {
  export type SharpMetadata = {
    format?: string;
    width?: number;
    height?: number;
    pages?: number;
    exif?: Buffer;
    iptc?: Buffer;
    xmp?: Buffer;
  };

  export type SharpOutputInfo = {
    width: number;
    height: number;
  };

  export type SharpInstance = {
    metadata(): Promise<SharpMetadata>;
    rotate(): SharpInstance;
    resize(options: {
      width: number;
      height: number;
      fit: 'inside';
      withoutEnlargement: boolean;
    }): SharpInstance;
    toColourspace(colourspace: 'srgb'): SharpInstance;
    webp(options: {
      quality: number;
      effort: number;
      smartSubsample: boolean;
    }): SharpInstance;
    jpeg(options?: { quality?: number }): SharpInstance;
    png(): SharpInstance;
    withMetadata(options: {
      exif?: Record<string, Record<string, string>>;
    }): SharpInstance;
    toBuffer(): Promise<Buffer>;
    toBuffer(options: {
      resolveWithObject: true;
    }): Promise<{ data: Buffer; info: SharpOutputInfo }>;
  };

  export type SharpInput =
    | Uint8Array
    | {
        create: {
          width: number;
          height: number;
          channels: 3 | 4;
          background: string;
        };
      };

  export type SharpOptions = {
    failOn?: 'none' | 'truncated' | 'error' | 'warning';
    limitInputPixels?: number;
    sequentialRead?: boolean;
  };

  export default function sharp(
    input: SharpInput,
    options?: SharpOptions,
  ): SharpInstance;
}
