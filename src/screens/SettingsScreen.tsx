import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Button, Toggle, Select, Separator, Icon, Badge, Input } from '../components/ui';
import type { ScreenProps } from '../components/layout/types';
import type { Settings } from '../features/settings/types';
import { useInstalledFonts } from '../hooks/useInstalledFonts';

interface SettingsScreenProps extends ScreenProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onReset: () => void;
}

const timeFormatOptions = [
  { value: '12h', label: '12 Hour (AM/PM)' },
  { value: '24h', label: '24 Hour' },
];

const dateFormatOptions = [
  { value: 'none', label: 'Hidden' },
  { value: 'short', label: 'Short (Mon, Jan 1)' },
  { value: 'long', label: 'Long (Monday, January 1, 2024)' },
];

const clockSizeOptions = [
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: '2X Large' },
  { value: '3xl', label: '3X Large' },
];

const themeOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export const SettingsScreen = memo(function SettingsScreen({
  settings,
  onUpdateSettings,
  onReset,
  className = '',
}: SettingsScreenProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const { fonts: installedFonts, loading: fontsLoading } = useInstalledFonts();

  const fontOptions = useMemo(() => {
    const current = localSettings.font;
    const list = installedFonts.length > 0 ? installedFonts : [current];
    if (list.includes(current)) {
      return list.map((f) => ({ value: f, label: f }));
    }
    return [{ value: current, label: current }, ...list.map((f) => ({ value: f, label: f }))];
  }, [installedFonts, localSettings.font]);

  const handleChange = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdateSettings({ [key]: value } as Partial<Settings>);
  }, [onUpdateSettings]);

  const handleClockChange = useCallback(<K extends keyof Settings['clock']>(key: K, value: Settings['clock'][K]) => {
    setLocalSettings(prev => ({ ...prev, clock: { ...prev.clock, [key]: value } }));
    onUpdateSettings({ clock: { ...localSettings.clock, [key]: value } } as Partial<Settings>);
  }, [localSettings.clock, onUpdateSettings]);

  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <motion.main
      className={`flex-1 overflow-y-auto px-6 py-20 min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-3xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="display-lg" weight="extralight">
            Settings
          </Typography>
          <Typography variant="body" className="mt-2 text-text-secondary max-w-md">
            Customize your Nothing Clock experience
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="display-sm" weight="light">
                Appearance
              </Typography>
              <Badge variant="dot" dotColor="blue" size="sm">Theme</Badge>
            </div>

            <div className="space-y-6">
              <Select
                label="Theme"
                value={localSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value as 'dark' | 'light' | 'system')}
                options={themeOptions}
                placeholder="Select theme"
              />

              <Select
                label="Font"
                value={localSettings.font}
                onChange={(e) => handleChange('font', e.target.value)}
                options={fontOptions}
                placeholder={fontsLoading ? 'Loading fonts…' : 'Select font'}
                helperText="Fonts installed on this device"
              />

              <div
                className="rounded-lg bg-bg-tertiary border border-border-primary px-4 py-3 text-text-primary"
                style={{ fontFamily: `'${localSettings.font.replace(/['"]/g, '')}', 'Inter', system-ui, sans-serif` }}
              >
                AaBbCc 0123456789 — {localSettings.font}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-sm" className="text-text-primary">
                    Reduced Motion
                  </Typography>
                  <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                    Disable animations system-wide
                  </Typography>
                </div>
                <Toggle
                  checked={localSettings.reducedMotion ?? false}
                  onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="display-sm" weight="light">
                Clock
              </Typography>
              <Badge variant="dot" dotColor="green" size="sm">Time</Badge>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Time Format"
                  value={localSettings.clock.timeFormat}
                  onChange={(e) => handleClockChange('timeFormat', e.target.value as '12h' | '24h')}
                  options={timeFormatOptions}
                  placeholder="Select format"
                />

                <Select
                  label="Date Format"
                  value={localSettings.clock.dateFormat}
                  onChange={(e) => handleClockChange('dateFormat', e.target.value as 'none' | 'short' | 'long')}
                  options={dateFormatOptions}
                  placeholder="Select format"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Clock Size"
                  value={localSettings.clock.size}
                  onChange={(e) => handleClockChange('size', e.target.value as 'lg' | 'xl' | '2xl' | '3xl')}
                  options={clockSizeOptions}
                  placeholder="Select size"
                />

                <div>
                  <label className="label">Font Weight</label>
                  <select
                    value={localSettings.clock.fontWeight}
                    onChange={(e) => handleClockChange('fontWeight', parseInt(e.target.value, 10) as 100 | 200 | 300 | 400 | 500 | 600 | 700)}
                    className="input font-mono"
                  >
                    <option value={100}>Thin (100)</option>
                    <option value={200}>Extra Light (200)</option>
                    <option value={300}>Light (300)</option>
                    <option value={400}>Normal (400)</option>
                    <option value={500}>Medium (500)</option>
                    <option value={600}>Semi Bold (600)</option>
                    <option value={700}>Bold (700)</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body-sm" className="text-text-primary">
                      Show Seconds
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                      Display seconds in clock
                    </Typography>
                  </div>
                  <Toggle
                    checked={localSettings.clock.showSeconds}
                    onChange={(e) => handleClockChange('showSeconds', e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body-sm" className="text-text-primary">
                      Show Milliseconds
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                      Smooth millisecond animation
                    </Typography>
                  </div>
                  <Toggle
                    checked={localSettings.clock.showMilliseconds ?? false}
                    onChange={(e) => handleClockChange('showMilliseconds', e.target.checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-sm" className="text-text-primary">
                    Show Date
                  </Typography>
                  <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                    Display date below clock
                    </Typography>
                </div>
                <Toggle
                  checked={localSettings.clock.showDate}
                  onChange={(e) => handleClockChange('showDate', e.target.checked)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="display-sm" weight="light">
                Timer & Alarm
              </Typography>
              <Badge variant="outline" size="sm">Soon</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-border-primary flex items-center justify-center">
                    <Icon name="timer" size="md" className="text-text-tertiary" />
                  </div>
                  <div>
                    <Typography variant="body-sm" className="text-text-primary">
                      Timer
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                      Countdown timer with presets
                    </Typography>
                  </div>
                </div>
                <Badge variant="outline" size="sm">Coming Soon</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-border-primary flex items-center justify-center">
                    <Icon name="alarm" size="md" className="text-text-tertiary" />
                  </div>
                  <div>
                    <Typography variant="body-sm" className="text-text-primary">
                      Alarms
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                      Multiple alarms with labels
                    </Typography>
                  </div>
                </div>
                <Badge variant="outline" size="sm">Coming Soon</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-border-primary flex items-center justify-center">
                    <Icon name="stopwatch" size="md" className="text-text-tertiary" />
                  </div>
                  <div>
                    <Typography variant="body-sm" className="text-text-primary">
                      Stopwatch
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                      Lap timing with export
                    </Typography>
                  </div>
                </div>
                <Badge variant="outline" size="sm">Coming Soon</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Typography variant="display-sm" weight="light">
                About
              </Typography>
              <Badge variant="dot" dotColor="yellow" size="sm">Info</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="body-sm" className="text-text-primary">Version</Typography>
                <Typography variant="body-sm" className="font-mono text-text-tertiary">1.0.0</Typography>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Typography variant="body-sm" className="text-text-primary">Build</Typography>
                <Typography variant="body-sm" className="font-mono text-text-tertiary">Electron + React + TypeScript</Typography>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Typography variant="body-sm" className="text-text-primary">Framework</Typography>
                <Typography variant="body-sm" className="font-mono text-text-tertiary">Vite + TailwindCSS + Framer Motion</Typography>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Typography variant="body-sm" className="text-text-primary">License</Typography>
                <Typography variant="body-sm" className="font-mono text-text-tertiary">MIT</Typography>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleReset} className="flex-1">
              Reset to Defaults
            </Button>
            <Button variant="primary" onClick={() => setLocalSettings(settings)} className="flex-1">
              Apply Changes
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Typography variant="caption" className="text-text-tertiary font-mono">
            Nothing Clock — Designed with precision
          </Typography>
        </motion.div>
      </div>
    </motion.main>
  );
});

SettingsScreen.displayName = 'SettingsScreen';