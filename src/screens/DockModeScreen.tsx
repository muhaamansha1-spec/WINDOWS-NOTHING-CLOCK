import { memo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, Typography, Badge, Button } from '../components/ui';
import { DockClock } from '../features/dock-mode/components/DockClock';
import { MediaWidget } from '../features/dock-mode/components/widgets/MediaWidget';
import { DockSettingsPanel } from '../features/dock-mode/components/DockSettingsPanel';
import { useDockMode } from '../features/dock-mode/hooks/useDockMode';
import type { ScreenProps } from '../components/layout/types';

export const DockModeScreen = memo(function DockModeScreen({ className = '' }: ScreenProps) {
  const {
    state,
    timeData,
    isFullscreen,
    cursorVisible,
    windowFocused,
    enterDockMode,
    exitDockMode,
    toggleDockMode,
    updateSetting,
    updateWidget,
    toggleWidget,
    resetSettings,
    clockSize,
    timeFormat,
    showSeconds,
    showDate,
    brightness,
    animationsEnabled,
  } = useDockMode();

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    enterDockMode();
    return () => {
      exitDockMode();
    };
  }, [enterDockMode, exitDockMode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'F11') {
      e.preventDefault();
      toggleDockMode();
    }
    if (e.key === 'Escape') {
      if (settingsOpen) {
        setSettingsOpen(false);
      } else {
        exitDockMode();
      }
    }
  }, [toggleDockMode, exitDockMode, settingsOpen]);

  if (!state.isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="dock-mode"
        className={`fixed inset-0 z-[100] bg-black w-full h-full flex flex-col overflow-hidden ${!cursorVisible ? 'cursor-none' : ''}`}
        style={{ backgroundColor: '#000000' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="flex-1 flex flex-col w-full">
          {/* Top bar - minimal */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-between pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: windowFocused ? 1 : 0.3, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pointer-events-auto flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon name="monitor" size="md" className="text-white/60" />
              </div>
              <Typography variant="caption" className="font-mono text-white/40 uppercase tracking-wider">
                Dock Mode
              </Typography>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <Badge variant="outline" size="sm" className="font-mono">
                F11 to exit
              </Badge>
              <motion.button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Open Dock Mode settings"
              >
                <Icon name="settings" size="md" />
              </motion.button>
              <motion.button
                onClick={exitDockMode}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Exit Dock Mode"
              >
                <Icon name="maximize" size="md" />
              </motion.button>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="flex-1 flex flex-col w-full relative">
            {/* Clock — 5 parts */}
            <div className="flex-[5] min-h-0 relative w-full flex items-center justify-center">
              <DockClock
                timeData={timeData}
                clockSize={clockSize}
                timeFormat={timeFormat}
                showSeconds={showSeconds}
                showDate={showDate}
                showAmpm={timeFormat === '12h'}
                brightness={brightness}
                animationsEnabled={animationsEnabled}
                burnInOffset={state.burnInOffset}
              />
            </div>

            {/* Music controls — 2 parts, full width */}
            <div className="flex-[2] min-h-0 relative w-full pb-10">
              <MediaWidget brightness={brightness} burnInOffset={state.burnInOffset} />
            </div>
          </div>

          {/* Bottom hint */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: windowFocused ? 0.4 : 0, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="caption" className="font-mono text-white/30 text-center">
              Press F11 or Escape to exit Dock Mode
            </Typography>
          </motion.div>
        </div>

        {/* Settings Panel */}
        <DockSettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={state.settings}
          onUpdateSetting={updateSetting}
          onUpdateWidget={updateWidget}
          onToggleWidget={toggleWidget}
          onReset={resetSettings}
        />
      </motion.div>
    </AnimatePresence>
  );
});

DockModeScreen.displayName = 'DockModeScreen';