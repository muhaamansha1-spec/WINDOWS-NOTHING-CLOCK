import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon, Button, Badge } from '../components/ui';
import type { ScreenProps } from '../components/layout/types';

function PlaceholderScreen({ title, icon, description, shortcut }: { title: string; icon: string; description: string; shortcut: string }) {
  return (
    <motion.main
      className="flex-1 flex items-center justify-center px-6 py-20 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-md text-center">
        <motion.div
          className="w-20 h-20 rounded-card-lg bg-bg-card border border-border-primary flex items-center justify-center mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 0.1 }}
        >
          <Icon name={icon} size="xl" className="text-text-secondary" />
        </motion.div>

        <Typography variant="display-md" weight="extralight" className="mb-3">
          {title}
        </Typography>
        <Typography variant="body" className="text-text-secondary mb-8 max-w-sm mx-auto">
          {description}
        </Typography>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge variant="outline" size="md">Coming Soon</Badge>
          <Typography variant="caption" className="text-text-tertiary font-mono self-center">
            Shortcut: {shortcut}
          </Typography>
        </div>

        <Card variant="hover" padding="md" className="max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-border-primary flex items-center justify-center">
                <Icon name="info" size="md" className="text-text-tertiary" />
              </div>
              <div>
                <Typography variant="body-sm" className="text-text-primary">
                  Feature Status
                </Typography>
                <Typography variant="caption" className="text-text-tertiary font-mono mt-1">
                  In development
                </Typography>
              </div>
            </div>
            <Icon name="chevronRight" size="md" className="text-text-tertiary" />
          </div>
        </Card>
      </div>
    </motion.main>
  );
}

export const TimerScreen = memo(() => (
  <PlaceholderScreen
    title="Timer"
    icon="timer"
    description="Set countdown timers with custom durations and presets. Perfect for cooking, workouts, or focus sessions."
    shortcut="⌘2"
  />
));

export const StopwatchScreen = memo(() => (
  <PlaceholderScreen
    title="Stopwatch"
    icon="stopwatch"
    description="Precise stopwatch with lap timing, split times, and export capabilities. Ideal for sports and timing tasks."
    shortcut="⌘4"
  />
));

export const WorldClockScreen = memo(() => (
  <PlaceholderScreen
    title="World Clock"
    icon="globe"
    description="Track time across multiple time zones. Add cities and see their current time at a glance."
    shortcut="⌘5"
  />
));

TimerScreen.displayName = 'TimerScreen';
StopwatchScreen.displayName = 'StopwatchScreen';
WorldClockScreen.displayName = 'WorldClockScreen';