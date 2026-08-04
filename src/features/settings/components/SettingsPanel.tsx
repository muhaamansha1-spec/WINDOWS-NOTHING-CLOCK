import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import type { Settings, ClockSettings, ThemeMode } from '../types';
import { defaultSettings } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateClockSettings: (settings: Partial<ClockSettings>) => void;
  onUpdateTheme: (theme: ThemeMode) => void;
  onReset: () => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onUpdateClockSettings,
  onUpdateTheme,
  onReset,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<ClockSettings>(settings.clock);
  const [localTheme, setLocalTheme] = useState<ThemeMode>(settings.theme);

  const handleClockSettingChange = <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onUpdateClockSettings(newSettings);
  };

  const handleThemeChange = (theme: ThemeMode) => {
    setLocalTheme(theme);
    onUpdateTheme(theme);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="settings-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          </div>

          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
            <section>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Appearance
              </h3>
              <div className="space-y-4">
                <Select
                  label="Theme"
                  value={localTheme}
                  onChange={(e) => handleThemeChange(e.target.value as ThemeMode)}
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                    { value: 'system', label: 'System' },
                  ]}
                />
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Clock
              </h3>
              <div className="space-y-4">
                <Select
                  label="Time Format"
                  value={localSettings.timeFormat}
                  onChange={(e) => handleClockSettingChange('timeFormat', e.target.value as '12h' | '24h')}
                  options={[
                    { value: '12h', label: '12 Hour (AM/PM)' },
                    { value: '24h', label: '24 Hour' },
                  ]}
                />

                <Select
                  label="Date Format"
                  value={localSettings.dateFormat}
                  onChange={(e) => handleClockSettingChange('dateFormat', e.target.value as 'short' | 'long' | 'none')}
                  options={[
                    { value: 'none', label: 'Hide Date' },
                    { value: 'short', label: 'Short (Mon, Jan 1)' },
                    { value: 'long', label: 'Long (Monday, January 1, 2024)' },
                  ]}
                />

                <Select
                  label="Clock Size"
                  value={localSettings.size}
                  onChange={(e) => handleClockSettingChange('size', e.target.value as 'lg' | 'xl' | '2xl' | '3xl')}
                  options={[
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' },
                    { value: '2xl', label: '2X Large' },
                    { value: '3xl', label: '3X Large' },
                  ]}
                />

                <Select
                  label="Font Weight"
                  value={localSettings.fontWeight.toString()}
                  onChange={(e) => handleClockSettingChange('fontWeight', parseInt(e.target.value, 10) as 100 | 200 | 300 | 400 | 500 | 600 | 700)}
                  options={[
                    { value: '100', label: 'Thin (100)' },
                    { value: '200', label: 'Extra Light (200)' },
                    { value: '300', label: 'Light (300)' },
                    { value: '400', label: 'Normal (400)' },
                    { value: '500', label: 'Medium (500)' },
                    { value: '600', label: 'Semi Bold (600)' },
                    { value: '700', label: 'Bold (700)' },
                  ]}
                />

                <Toggle
                  label="Show Seconds"
                  description="Display seconds in the clock"
                  checked={localSettings.showSeconds}
                  onChange={(e) => handleClockSettingChange('showSeconds', e.target.checked)}
                />

                <Toggle
                  label="Show Date"
                  description="Display the current date below the time"
                  checked={localSettings.showDate}
                  onChange={(e) => handleClockSettingChange('showDate', e.target.checked)}
                />
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Actions
              </h3>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onReset} className="flex-1">
                  Reset to Defaults
                </Button>
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Done
                </Button>
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}