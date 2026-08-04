import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon } from '../components/ui';
import { useClock, useBattery } from '../features/clock/hooks/useClock';
import { TimeDisplay, DateDisplay, Battery, FullscreenButton } from '../features/clock/components';
import type { ScreenProps } from '../components/layout/types';
import type { Settings } from '../features/settings/types';

interface HomeScreenProps extends ScreenProps {
  settings: Settings;
}

export const HomeScreen = memo(function HomeScreen({ settings, className = '' }: HomeScreenProps) {
  const clockSettings = settings.clock;

  const timeData = useClock({
    timeFormat: clockSettings.timeFormat,
    showSeconds: clockSettings.showSeconds,
    showMilliseconds: clockSettings.showMilliseconds,
  });

  const battery = useBattery();

  const clockSize = useMemo(() => clockSettings.size, [clockSettings.size]);

  return (
    <motion.main
      className={`flex-1 flex flex-col items-center justify-center px-6 py-20 min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <motion.div
          className="w-full flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-primary flex items-center justify-center">
              <Icon name="clock" size="md" className="text-text-secondary" />
            </div>
            <div>
              <Typography variant="display-sm" weight="extralight">
                Clock
              </Typography>
              <Typography variant="caption" className="font-mono">
                Current time
              </Typography>
            </div>
          </div>
          <FullscreenButton />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TimeDisplay
            hours={timeData.hours}
            minutes={timeData.minutes}
            seconds={timeData.seconds}
            milliseconds={timeData.milliseconds}
            ampm={timeData.ampm}
            showSeconds={clockSettings.showSeconds}
            showMilliseconds={clockSettings.showMilliseconds}
            timeFormat={clockSettings.timeFormat}
            size={clockSize}
          />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <DateDisplay
            weekday={timeData.weekday}
            day={timeData.day}
            month={timeData.month}
            year={timeData.year}
          />
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card variant="hover" padding="md" className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center">
                  <Icon name="monitor" size="md" className="text-text-secondary" />
                </div>
                <div>
                  <Typography variant="overline" className="text-text-secondary">
                    Display
                  </Typography>
                  <Typography variant="body-sm" className="font-mono text-text-primary">
                    {clockSettings.timeFormat === '12h' ? '12 Hour' : '24 Hour'}
                  </Typography>
                </div>
              </div>
              <span className="px-3 py-1 rounded-pill bg-border-primary text-text-tertiary font-mono text-xs">
                {clockSettings.showSeconds ? 'Seconds ON' : 'Seconds OFF'}
                {clockSettings.showMilliseconds && ' • MS ON'}
              </span>
            </div>
          </Card>

          <Card variant="hover" padding="md" className="flex-1 min-w-0 ml-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center">
                  <Icon name="info" size="md" className="text-text-secondary" />
                </div>
                <div>
                  <Typography variant="overline" className="text-text-secondary">
                    Battery
                  </Typography>
                  <Typography variant="body-sm" className="font-mono text-text-primary">
                    {battery.supported ? 'System' : 'Mock Data'}
                  </Typography>
                </div>
              </div>
              <Battery level={battery.level} charging={battery.charging} supported={battery.supported} size="md" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="w-full flex items-center justify-center gap-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Typography variant="caption" className="text-text-tertiary font-mono">
            Press F11 for fullscreen
          </Typography>
          <motion.div className="w-px h-4 bg-border-primary" />
          <Typography variant="caption" className="text-text-tertiary font-mono">
            Nothing Clock v1.0.0
          </Typography>
        </motion.div>
      </div>
    </motion.main>
  );
});

HomeScreen.displayName = 'HomeScreen';