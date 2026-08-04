import { useEffect, useState, useCallback } from 'react';
import type { ThemeMode } from '../features/settings/types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
    window.electronAPI.theme.set(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const initTheme = async () => {
      const systemTheme = await window.electronAPI.theme.getSystem();
      const currentTheme = await window.electronAPI.theme.get();

      if (systemTheme !== 'system') {
        setTheme(systemTheme);
      } else {
        setTheme(currentTheme);
      }
      setResolvedTheme(currentTheme);
    };

    initTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newResolved = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        document.documentElement.classList.toggle('dark', newResolved === 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [theme]);

  return { theme, resolvedTheme, setTheme: applyTheme, toggleTheme };
}