import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDockSettings } from './useDockSettings';
import { useDockClock } from './useDockClock';
import { useBurnInProtection } from './useBurnInProtection';
import { useAutoHideCursor } from './useAutoHideCursor';
import { useWindowFocus, useFullscreen } from './useDockWindow';
import { useWidgetData } from './useWidgetData';
import type { DockSettings, DockModeState, TimeData, WidgetId } from '../types';

export function useDockMode() {
  const { settings, updateSetting, updateWidget, toggleWidget, resetSettings } = useDockSettings();
  const timeData = useDockClock({
    timeFormat: settings.timeFormat,
    showSeconds: settings.showSeconds,
    showDate: settings.showDate,
  });
  const burnInOffset = useBurnInProtection({
    enabled: settings.burnInProtection,
    intervalMs: 60000,
    maxOffset: 4,
  });
  const { visible: cursorVisible, showCursor } = useAutoHideCursor({
    enabled: settings.autoHideCursor,
    delayMs: 5000,
  });
  const windowFocused = useWindowFocus();
  const { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  const widgetData = useWidgetData();

  const [isActive, setIsActive] = useState(false);
  const [mouseVisible, setMouseVisible] = useState(true);
  const lastMouseMoveRef = useRef<number>(Date.now());

  // Handle mouse move for cursor auto-hide
  useEffect(() => {
    if (!settings.autoHideCursor) return;

    const handleMouseMove = () => {
      lastMouseMoveRef.current = Date.now();
      setMouseVisible(true);
      showCursor();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.autoHideCursor, showCursor]);

  const enterDockMode = useCallback(async () => {
    setIsActive(true);
    await enterFullscreen();
  }, [enterFullscreen]);

  const exitDockMode = useCallback(async () => {
    await exitFullscreen();
    setIsActive(false);
  }, [exitFullscreen]);

  const toggleDockMode = useCallback(async () => {
    if (isActive) {
      await exitDockMode();
    } else {
      await enterDockMode();
    }
  }, [isActive, enterDockMode, exitDockMode]);

  // Handle F11 key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleDockMode();
      }
      if (e.key === 'Escape' && isActive) {
        exitDockMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, toggleDockMode, exitDockMode]);

  // Get enabled widgets sorted by position
  const enabledWidgets = useMemo(() => {
    return Object.entries(settings.widgets)
      .filter(([, config]) => config.enabled)
      .sort((a, b) => {
        if (a[1].position.y !== b[1].position.y) {
          return a[1].position.y - b[1].position.y;
        }
        return a[1].position.x - b[1].position.x;
      }) as Array<[WidgetId, any]>;
  }, [settings.widgets]);

  const state: DockModeState = useMemo(() => ({
    isActive,
    settings,
    mouseVisible,
    lastMouseMove: lastMouseMoveRef.current,
    burnInOffset,
    windowFocused,
  }), [isActive, settings, mouseVisible, burnInOffset, windowFocused]);

  return {
    // State
    state,
    timeData,
    widgetData,
    enabledWidgets,
    isFullscreen,
    cursorVisible,
    windowFocused,

    // Actions
    enterDockMode,
    exitDockMode,
    toggleDockMode,
    updateSetting,
    updateWidget,
    toggleWidget,
    resetSettings,

    // Settings getters
    clockSize: settings.clockSize,
    timeFormat: settings.timeFormat,
    showSeconds: settings.showSeconds,
    showDate: settings.showDate,
    brightness: settings.brightness,
    animationsEnabled: settings.animationsEnabled,
  };
}