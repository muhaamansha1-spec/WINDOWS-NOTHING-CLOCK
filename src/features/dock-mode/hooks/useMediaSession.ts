import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaInfo } from '../../../types/electron';

const EMPTY_INFO: MediaInfo = { hasSession: false, title: '', artist: '', appName: '', status: 'none' };

export function useMediaSession(pollIntervalMs = 3000) {
  const [info, setInfo] = useState<MediaInfo>(EMPTY_INFO);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const next = await window.electronAPI.media.getInfo();
      if (mountedRef.current) {
        setInfo(next);
        setLoading(false);
      }
    } catch {
      // Poll failures are ignored; keep the last known state.
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void refresh();
    const id = window.setInterval(() => void refresh(), pollIntervalMs);
    return () => {
      mountedRef.current = false;
      window.clearInterval(id);
    };
  }, [refresh, pollIntervalMs]);

  const run = useCallback(async (op: 'play' | 'pause' | 'playpause' | 'next' | 'prev') => {
    try {
      await window.electronAPI.media.command(op);
    } finally {
      void refresh();
    }
  }, [refresh]);

  const play = useCallback(() => run('play'), [run]);
  const pause = useCallback(() => run('pause'), [run]);
  const playPause = useCallback(() => run('playpause'), [run]);
  const next = useCallback(() => run('next'), [run]);
  const previous = useCallback(() => run('prev'), [run]);
  const toggle = useCallback(() => run(info.status === 'playing' ? 'pause' : 'play'), [info.status, run]);

  return { info, loading, play, pause, playPause, next, previous, toggle };
}
