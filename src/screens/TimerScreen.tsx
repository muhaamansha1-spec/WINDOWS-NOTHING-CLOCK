import { useState, useCallback, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon, Badge } from '../components/ui';
import { TimerInput, TimerProgress, TimerControls, TimerPresets } from '../features/timer/components';
import { useTimer } from '../features/timer/hooks/useTimer';
import { parseTimeInput, formatTime } from '../features/timer/types';
import type { ScreenProps } from '../components/layout/types';

export const TimerScreen = memo(function TimerScreen({ className = '' }: ScreenProps) {
  const {
    state,
    start,
    pause,
    resume,
    reset,
    setTime,
    setPreset,
    getProgress,
    getFormattedTime,
  } = useTimer();

  const [inputHours, setInputHours] = useState('0');
  const [inputMinutes, setInputMinutes] = useState('0');
  const [inputSeconds, setInputSeconds] = useState('0');
  const [error, setError] = useState<string | null>(null);

  // Sync inputs with timer state when idle
  useEffect(() => {
    if (state.status === 'idle') {
      const hrs = Math.floor(state.totalSeconds / 3600);
      const mins = Math.floor((state.totalSeconds % 3600) / 60);
      const secs = state.totalSeconds % 60;
      setInputHours(hrs.toString());
      setInputMinutes(mins.toString());
      setInputSeconds(secs.toString());
    }
  }, [state.status, state.totalSeconds]);

  const handleInputChange = useCallback((field: 'hours' | 'minutes' | 'seconds', value: string) => {
    setError(null);
    const numValue = value.replace(/[^0-9]/g, '');
    
    if (field === 'hours') {
      const val = Math.min(parseInt(numValue || '0', 10), 99);
      setInputHours(val.toString());
    } else if (field === 'minutes') {
      const val = Math.min(parseInt(numValue || '0', 10), 59);
      setInputMinutes(val.toString());
    } else {
      const val = Math.min(parseInt(numValue || '0', 10), 59);
      setInputSeconds(val.toString());
    }
  }, []);

  const handleStart = useCallback(() => {
    const total = parseTimeInput(inputHours, inputMinutes, inputSeconds);
    if (total <= 0) {
      setError('Please set a time greater than 0');
      return;
    }
    setTime(total);
    start(total);
  }, [inputHours, inputMinutes, inputSeconds, start, setTime]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleReset = useCallback(() => {
    reset();
    setInputHours('0');
    setInputMinutes('0');
    setInputSeconds('0');
  }, [reset]);

  const handlePresetSelect = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    setInputHours(hrs.toString());
    setInputMinutes(mins.toString());
    setInputSeconds(secs.toString());
    setPreset(seconds);
  }, [setPreset]);

  const showHours = state.totalSeconds >= 3600 || inputHours !== '0';

  const canStart = parseTimeInput(inputHours, inputMinutes, inputSeconds) > 0;

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
              <Icon name="timer" size="md" className="text-text-secondary" />
            </div>
            <div>
              <Typography variant="display-sm" weight="extralight">
                Timer
              </Typography>
              <Typography variant="caption" className="font-mono">
                Countdown timer
              </Typography>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TimerProgress
            size={300}
            strokeWidth={10}
            progress={getProgress()}
            timeText={getFormattedTime(showHours)}
            status={state.status}
          />
        </motion.div>

        {state.status === 'idle' && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <TimerInput
              hours={inputHours}
              minutes={inputMinutes}
              seconds={inputSeconds}
              onChange={handleInputChange}
              error={error ?? undefined}
              disabled={false}
            />
          </motion.div>
        )}

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TimerPresets onSelect={handlePresetSelect} disabled={state.status === 'running'} />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <TimerControls
            status={state.status}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
            disabled={state.status === 'idle' ? !canStart : false}
          />
        </motion.div>

        {state.status === 'completed' && (
          <motion.div
            className="w-full text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          >
            <Badge variant="dot" dotColor="green" size="md" className="inline-flex">
              Timer Complete
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
});

TimerScreen.displayName = 'TimerScreen';