import { useState, useEffect } from 'react';

export const FALLBACK_FONTS = [
  'Inter',
  'JetBrains Mono',
  'DotGothic16',
  'Segoe UI',
  'Arial',
  'Calibri',
  'Consolas',
  'Courier New',
  'Georgia',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  'Impact',
  'Palatino Linotype',
  'Lucida Console',
  'Microsoft Sans Serif',
  'MS Gothic',
  'Yu Gothic',
  'Meiryo',
  'Cascadia Mono',
  'Cascadia Code',
];

export function useInstalledFonts(): { fonts: string[]; loading: boolean } {
  const [fonts, setFonts] = useState<string[]>(FALLBACK_FONTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const list = await window.electronAPI?.fonts?.list?.();
        if (mounted && Array.isArray(list) && list.length > 0) {
          setFonts(list);
        }
      } catch {
        // Fall back to the curated list
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { fonts, loading };
}
