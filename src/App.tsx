import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, Header } from '@/components/layout';
import { HomeScreen, SettingsScreen, TimerScreen, AlarmScreen, StopwatchScreen, WorldClockScreen, DockModeScreen } from '@/screens';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useWindowControls } from '@/hooks/useWindowControls';
import { Icon } from '@/components/ui';
import type { Settings } from '@/features/settings/types';

const screens = {
  home: HomeScreen,
  timer: TimerScreen,
  alarm: AlarmScreen,
  stopwatch: StopwatchScreen,
  dock: DockModeScreen,
  'world-clock': WorldClockScreen,
  settings: SettingsScreen,
} as const;

type ScreenId = keyof typeof screens;

function App() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { settings, updateClockSettings, updateTheme, updateSettings, reset } = useSettings();
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    updateTheme(theme);
  }, [theme, updateTheme]);

  // Apply the selected installed font app-wide via a CSS variable
  useEffect(() => {
    const root = document.documentElement;
    const font = (settings.font || 'Inter').trim();
    if (!font || font === 'Inter') {
      root.style.removeProperty('--app-font');
    } else {
      root.style.setProperty('--app-font', `'${font.replace(/['"]/g, '')}'`);
    }
  }, [settings.font]);

  const handleNavigate = useCallback((screenId: string) => {
    setActiveScreen(screenId as ScreenId);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleSettingsChange = useCallback((partialSettings: Partial<Settings>) => {
    if (partialSettings.clock) {
      updateClockSettings(partialSettings.clock);
    }
    if (partialSettings.theme) {
      updateTheme(partialSettings.theme);
    }
    const { clock, theme, ...rest } = partialSettings;
    if (Object.keys(rest).length > 0) {
      updateSettings(rest as Partial<Settings>);
    }
  }, [updateClockSettings, updateTheme, updateSettings]);

  const handleReset = useCallback(() => {
    reset();
    setActiveScreen('settings');
  }, [reset]);

  const ActiveScreenComponent = useMemo(() => screens[activeScreen], [activeScreen]);

  const screenConfig = useMemo(() => ({
    home: { title: 'Clock', subtitle: 'Current time', icon: 'clock' },
    timer: { title: 'Timer', subtitle: 'Countdown timer', icon: 'timer' },
    alarm: { title: 'Alarms', subtitle: 'Alarm management', icon: 'alarm' },
    stopwatch: { title: 'Stopwatch', subtitle: 'Lap timing', icon: 'stopwatch' },
    dock: { title: 'Dock Mode', subtitle: 'Smart display', icon: 'monitor' },
    'world-clock': { title: 'World Clock', subtitle: 'Multiple time zones', icon: 'globe' },
    settings: { title: 'Settings', subtitle: 'Preferences', icon: 'settings' },
  }), []);

  const currentScreenConfig = screenConfig[activeScreen];

  return (
    <motion.div
      className={`min-h-screen w-full bg-bg-primary text-text-primary transition-colors duration-normal ${resolvedTheme === 'dark' ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: '#000000' }}
    >
      <Sidebar
        activeItem={activeScreen}
        onNavigate={handleNavigate}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-normal ease-out-expo ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header
          title={currentScreenConfig.title}
          subtitle={currentScreenConfig.subtitle}
          onMenuClick={handleToggleSidebar}
          showMenu={true}
          actions={
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
            </motion.button>
          }
        />

        <AnimatePresence mode="wait">
          <ActiveScreenComponent
            key={activeScreen}
            settings={settings}
            onUpdateSettings={handleSettingsChange}
            onReset={handleReset}
            className="pt-16"
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default App;