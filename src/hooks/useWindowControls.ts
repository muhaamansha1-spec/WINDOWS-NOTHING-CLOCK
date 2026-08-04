import { useEffect, useState, useCallback } from 'react';

export function useWindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  const minimize = useCallback(async () => {
    await window.electronAPI.window.minimize();
  }, []);

  const maximize = useCallback(async () => {
    await window.electronAPI.window.maximize();
  }, []);

  const close = useCallback(async () => {
    await window.electronAPI.window.close();
  }, []);

  const checkMaximized = useCallback(async () => {
    const maximized = await window.electronAPI.window.isMaximized();
    setIsMaximized(maximized);
  }, []);

  useEffect(() => {
    checkMaximized();

    const cleanup = window.electronAPI.window.onStateChanged((state) => {
      setIsMaximized(state.isMaximized);
    });

    return cleanup;
  }, [checkMaximized]);

  return {
    isMaximized,
    minimize,
    maximize,
    close,
    checkMaximized,
  };
}