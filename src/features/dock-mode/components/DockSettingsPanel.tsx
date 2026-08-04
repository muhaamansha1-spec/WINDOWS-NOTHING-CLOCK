import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Typography, Button, Toggle, Select, Input, Icon, Separator, Badge, Slider } from '../../../components/ui';
import type { DockSettings, ClockSize, TimeFormat, WidgetId } from '../types';
import { DEFAULT_DOCK_SETTINGS, WIDGET_DEFINITIONS } from '../types';

interface DockSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DockSettings;
  onUpdateSetting: <K extends keyof DockSettings>(key: K, value: DockSettings[K]) => void;
  onUpdateWidget: (widgetId: WidgetId, updates: Partial<DockSettings['widgets'][WidgetId]>) => void;
  onToggleWidget: (widgetId: WidgetId) => void;
  onReset: () => void;
}

export const DockSettingsPanel = memo(function DockSettingsPanel({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onUpdateWidget,
  onToggleWidget,
  onReset,
}: DockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'clock' | 'widgets' | 'display' | 'advanced'>('clock');

  if (!isOpen) return null;

  const clockSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12 Hour (AM/PM)' },
    { value: '24h', label: '24 Hour' },
  ];

  const tabs = [
    { id: 'clock', label: 'Clock', icon: 'clock' },
    { id: 'widgets', label: 'Widgets', icon: 'grid' },
    { id: 'display', label: 'Display', icon: 'monitor' },
    { id: 'advanced', label: 'Advanced', icon: 'settings' },
  ] as const;

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
        aria-labelledby="dock-settings-title"
      >
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] bg-bg-primary border border-border-primary rounded-card-lg shadow-2xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-border-primary flex-shrink-0">
            <Typography id="dock-settings-title" variant="display-sm" weight="light">
              Dock Mode Settings
            </Typography>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              aria-label="Close settings"
            >
              <Icon name="x" size="md" />
            </motion.button>
          </div>

          <div className="flex border-b border-border-primary flex-shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-colors duration-fast whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-text-primary border-b-2 border-white'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <Icon name={tab.icon} size="sm" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'clock' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <Typography variant="display-sm" weight="light" className="mb-6">Clock Appearance</Typography>
                  <div className="space-y-4">
                    <Select
                      label="Clock Size"
                      value={settings.clockSize}
                      onChange={(e) => onUpdateSetting('clockSize', e.target.value as ClockSize)}
                      options={clockSizeOptions}
                    />
                    <Select
                      label="Time Format"
                      value={settings.timeFormat}
                      onChange={(e) => onUpdateSetting('timeFormat', e.target.value as TimeFormat)}
                      options={timeFormatOptions}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body-sm" className="text-text-primary">Show Seconds</Typography>
                        <Typography variant="caption" className="text-text-tertiary font-mono mt-1">Display seconds in clock</Typography>
                      </div>
                      <Toggle
                        checked={settings.showSeconds}
                        onChange={(e) => onUpdateSetting('showSeconds', e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body-sm" className="text-text-primary">Show Date</Typography>
                        <Typography variant="caption" className="text-text-tertiary font-mono mt-1">Display date below clock</Typography>
                      </div>
                      <Toggle
                        checked={settings.showDate}
                        onChange={(e) => onUpdateSetting('showDate', e.target.checked)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'widgets' && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Typography variant="overline" className="text-text-secondary mb-4">Only the music controls widget is available in Dock Mode</Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(WIDGET_DEFINITIONS)
                    .filter(([id]) => id === 'media')
                    .map(([id, def]) => {
                    const widgetConfig = settings.widgets[id as WidgetId];
                    return (
                      <Card key={id} variant="hover" padding="md" className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center">
                            <Icon name={def.icon} size="md" className="text-text-tertiary" />
                          </div>
                          <div>
                            <Typography variant="body-sm" className="text-text-primary">{def.label}</Typography>
                            <Typography variant="caption" className="text-text-tertiary font-mono">
                              {widgetConfig.size}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={widgetConfig.enabled}
                            onChange={() => onToggleWidget(id as WidgetId)}
                            size="sm"
                          />
                          <Select
                            value={widgetConfig.size}
                            onChange={(e) => onUpdateWidget(id as WidgetId, { size: e.target.value as 'small' | 'medium' | 'large' })}
                            options={[
                              { value: 'small', label: 'Small' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'large', label: 'Large' },
                            ]}
                            className="w-32"
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'display' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <Typography variant="display-sm" weight="light" className="mb-6">Display Settings</Typography>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="body-sm" className="text-text-primary">Brightness</Typography>
                        <Typography variant="caption" className="font-mono text-text-tertiary">
                          {Math.round(settings.brightness * 100)}%
                        </Typography>
                      </div>
                      <Slider
                        value={settings.brightness}
                        onChange={(e) => onUpdateSetting('brightness', parseFloat(e.target.value))}
                        min={0.1}
                        max={1}
                        step={0.05}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body-sm" className="text-text-primary">Animations</Typography>
                        <Typography variant="caption" className="text-text-tertiary font-mono mt-1">Enable smooth transitions</Typography>
                      </div>
                      <Toggle
                        checked={settings.animationsEnabled}
                        onChange={(e) => onUpdateSetting('animationsEnabled', e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body-sm" className="text-text-primary">Burn-in Protection</Typography>
                        <Typography variant="caption" className="text-text-tertiary font-mono mt-1">Subtle layout shift every minute</Typography>
                      </div>
                      <Toggle
                        checked={settings.burnInProtection}
                        onChange={(e) => onUpdateSetting('burnInProtection', e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body-sm" className="text-text-primary">Auto-hide Cursor</Typography>
                        <Typography variant="caption" className="text-text-tertiary font-mono mt-1">Hide mouse after 5s inactivity</Typography>
                      </div>
                      <Toggle
                        checked={settings.autoHideCursor}
                        onChange={(e) => onUpdateSetting('autoHideCursor', e.target.checked)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'advanced' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card variant="hover" padding="md" className="border-red-500/20 bg-red-600/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body-sm" className="text-red-400">Reset All Settings</Typography>
                      <Typography variant="caption" className="text-red-400/70 font-mono mt-1">Restore default Dock Mode configuration</Typography>
                    </div>
                    <Button variant="danger" onClick={onReset}>Reset</Button>
                  </div>
                </Card>

                <Card>
                  <Typography variant="display-sm" weight="light" className="mb-4">Keyboard Shortcuts</Typography>
                  <div className="space-y-3">
                    {[
                      { key: 'F11', action: 'Toggle Dock Mode' },
                      { key: 'Esc', action: 'Exit Dock Mode / Close Settings' },
                      { key: 'Tab', action: 'Navigate between widgets' },
                      { key: 'Enter/Space', action: 'Activate focused widget' },
                    ].map((shortcut, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary">
                        <kbd className="px-2 py-1 rounded bg-bg-card border border-border-primary font-mono text-xs text-text-secondary">{shortcut.key}</kbd>
                        <Typography variant="body-sm" className="text-text-secondary">{shortcut.action}</Typography>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-border-primary flex gap-3 flex-shrink-0">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={onClose} className="flex-1">Done</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DockSettingsPanel.displayName = 'DockSettingsPanel';