import { useState, useEffect, useCallback, useRef } from 'react';
import type { DockSettings, WidgetId, WidgetConfig } from '../types';
import { DEFAULT_DOCK_SETTINGS } from '../types';

const STORAGE_KEY = 'nothing-clock-dock-settings';

function loadSettings(): DockSettings {
  if (typeof window === 'undefined') return DEFAULT_DOCK_SETTINGS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return deepMerge(DEFAULT_DOCK_SETTINGS, parsed);
    }
  } catch {
    // Ignore parsing errors
  }
  return DEFAULT_DOCK_SETTINGS;
}

function saveSettings(settings: DockSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore save errors
  }
}

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[keyof T];
    }
  }
  
  return result;
}

export function useDockSettings() {
  const [settings, setSettings] = useState<DockSettings>(() => loadSettings());
  const saveTimeoutRef = useRef<number>();

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      saveSettings(settings);
    }, 300);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof DockSettings>(key: K, value: DockSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateWidget = useCallback((widgetId: WidgetId, updates: Partial<WidgetConfig>) => {
    setSettings(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: { ...prev.widgets[widgetId], ...updates },
      },
    }));
  }, []);

  const toggleWidget = useCallback((widgetId: WidgetId) => {
    setSettings(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: { ...prev.widgets[widgetId], enabled: !prev.widgets[widgetId].enabled },
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_DOCK_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    settings,
    updateSetting,
    updateWidget,
    toggleWidget,
    resetSettings,
  };
}