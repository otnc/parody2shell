// Types for the cf-workers-og renderer chunk aliased in astro.config.mjs.
declare module 'cf-workers-og-renderer' {
  import type { ReactNode } from 'react';

  type FontOptions = { name: string; data: ArrayBuffer; weight?: number; style?: 'normal' | 'italic' };
  type RenderOptions = {
    width: number;
    height: number;
    fonts: FontOptions[];
    /** Satori asks for an image data URL when `languageCode` is "emoji" and for fonts otherwise. */
    loadAdditionalAsset?: (languageCode: string, segment: string) => Promise<string | FontOptions[]>;
  };

  /** Render a React element to PNG bytes. */
  export const a: (element: ReactNode, options: RenderOptions) => Promise<Uint8Array<ArrayBuffer>>;
}
