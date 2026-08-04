import { useState, useEffect, useCallback } from 'react';
import type { Settings, ClockSettings } from '../types';
import { loadSettings, saveSettings } from '@/utils/settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateClockSettings = useCallback((clockSettings: Partial<ClockSettings>) => {
    setSettings((prev) => ({
      ...prev,
      clock: { ...prev.clock, ...clockSettings },
    }));
  }, []);

  const updateTheme = useCallback((theme: Settings['theme']) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const updateReducedMotion = useCallback((reducedMotion: boolean) => {
    setSettings((prev) => ({ ...prev, reducedMotion }));
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    const defaults = loadSettings();
    setSettings(defaults);
  }, []);

  return {
    settings,
    updateClockSettings,
    updateTheme,
    updateReducedMotion,
    updateSettings,
    reset,
  };
}