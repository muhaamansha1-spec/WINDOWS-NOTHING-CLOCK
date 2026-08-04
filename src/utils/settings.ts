import type { Settings } from '../features/settings/types';
import { defaultSettings } from '../features/settings/types';

const SETTINGS_KEY = 'nothing-clock-settings';

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed, clock: { ...defaultSettings.clock, ...parsed.clock } };
    }
  } catch {
    // Ignore parsing errors
  }
  return defaultSettings;
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore save errors
  }
}

export function resetSettings(): Settings {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SETTINGS_KEY);
  }
  return defaultSettings;
}