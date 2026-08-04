import { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon, Badge } from '../components/ui';
import { StopwatchDisplay, Laps, StopwatchControls } from '../features/stopwatch/components';
import { useStopwatch } from '../features/stopwatch/hooks/useStopwatch';
import type { ScreenProps } from '../components/layout/types';

export const StopwatchScreen = memo(function StopwatchScreen({ className = '' }: ScreenProps) {
  const {
    state,
    start,
    pause,
    resume,
    reset,
    addLap,
    clearLaps,
    getFormattedTime,
  } = useStopwatch();

  const { hours, minutes, seconds, milliseconds } = getFormattedTime();
  const hasLaps = state.laps.length > 0;

  const handleStart = useCallback(() => start(), [start]);
  const handlePause = useCallback(() => pause(), [pause]);
  const handleResume = useCallback(() => resume(), [resume]);
  const handleReset = useCallback(() => {
    reset();
    clearLaps();
  }, [reset, clearLaps]);
  const handleLap = useCallback(() => addLap(), [addLap]);

  return (
    <motion.main
      className={`flex-1 flex flex-col items-center justify-center px-6 py-10 min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        <motion.div
          className="w-full flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-primary flex items-center justify-center">
              <Icon name="stopwatch" size="md" className="text-text-secondary" />
            </div>
            <div>
              <Typography variant="display-sm" weight="extralight">
                Stopwatch
              </Typography>
              <Typography variant="caption" className="font-mono">
                Precise timing
              </Typography>
            </div>
          </div>
          {hasLaps && (
            <Badge variant="dot" dotColor="green" size="sm" className="flex items-center gap-1">
              {state.laps.length} lap{state.laps.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StopwatchDisplay
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            milliseconds={milliseconds}
            status={state.status}
          />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <StopwatchControls
            status={state.status}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
            onLap={handleLap}
            hasLaps={hasLaps}
          />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Laps
            laps={state.laps}
            onClear={clearLaps}
            status={state.status}
          />
        </motion.div>
      </div>
    </motion.main>
  );
});

StopwatchScreen.displayName = 'StopwatchScreen';