import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Typography, Icon } from '../../../components/ui';

interface TimeDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: number;
  ampm: string;
  showSeconds: boolean;
  showMilliseconds: boolean;
  timeFormat: '12h' | '24h';
  size: '3xl' | '2xl' | 'xl' | 'lg';
}

// Separate component for seconds/milliseconds to avoid re-rendering hours/minutes
const SecondsDisplay = memo(function SecondsDisplay({
  seconds,
  milliseconds,
  showSeconds,
  showMilliseconds,
  timeFormat,
}: {
  seconds: string;
  milliseconds: number;
  showSeconds: boolean;
  showMilliseconds: boolean;
  timeFormat: '12h' | '24h';
}) {
  if (!showSeconds) return null;

  const ms = showMilliseconds ? (milliseconds / 1000).toFixed(3).slice(1) : '';

  return (
    <span className="relative flex items-end">
      <AnimatePresence mode="wait">
        <motion.span
          key={seconds}
          className="text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          :{seconds}
        </motion.span>
      </AnimatePresence>
      {showMilliseconds && (
        <motion.span
          className="absolute bottom-0 right-[-2.5rem] font-mono tabular-nums text-text-tertiary"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {ms}
        </motion.span>
      )}
    </span>
  );
});

const AMPMDisplay = memo(function AMPMDisplay({
  ampm,
  timeFormat,
}: {
  ampm: string;
  timeFormat: '12h' | '24h';
}) {
  if (timeFormat !== '12h' || !ampm) return null;

  return (
    <motion.span
      className="ml-3 font-mono tabular-nums text-text-secondary"
      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {ampm}
    </motion.span>
  );
});

export const TimeDisplay = memo(function TimeDisplay({
  hours,
  minutes,
  seconds,
  milliseconds,
  ampm,
  showSeconds,
  showMilliseconds,
  timeFormat,
  size = '2xl',
}: TimeDisplayProps) {
  const sizeClasses = {
    '3xl': 'text-clock-3xl',
    '2xl': 'text-clock-2xl',
    xl: 'text-clock-xl',
    lg: 'text-clock-lg',
  };

  return (
    <div className="flex items-end gap-1">
      <span className={`${sizeClasses[size]} font-thin tabular-nums font-mono text-text-primary`}>
        {hours}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={minutes}
          className={`${sizeClasses[size]} font-thin tabular-nums font-mono text-text-primary`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          :{minutes}
        </motion.span>
      </AnimatePresence>
      <SecondsDisplay
        seconds={seconds}
        milliseconds={milliseconds}
        showSeconds={showSeconds}
        showMilliseconds={showMilliseconds}
        timeFormat={timeFormat}
      />
      <AMPMDisplay ampm={ampm} timeFormat={timeFormat} />
    </div>
  );
});

TimeDisplay.displayName = 'TimeDisplay';