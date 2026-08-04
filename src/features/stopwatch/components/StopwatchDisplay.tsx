import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography, Icon } from '../../../components/ui';

interface StopwatchDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
  status: 'idle' | 'running' | 'paused';
}

export const StopwatchDisplay = memo(function StopwatchDisplay({ 
  hours, 
  minutes, 
  seconds, 
  milliseconds, 
  status 
}: StopwatchDisplayProps) {
  return (
    <div className="flex items-end gap-1" role="timer" aria-live="off">
      <span className="font-mono tabular-nums text-text-primary" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 100, letterSpacing: '-0.02em' }}>
        {hours}
      </span>
      <motion.span
        className="font-mono tabular-nums text-text-primary"
        style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 100, letterSpacing: '-0.02em' }}
        animate={{ opacity: status === 'running' ? [1, 0.3, 1] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        :
      </motion.span>
      <span className="font-mono tabular-nums text-text-primary" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 100, letterSpacing: '-0.02em' }}>
        {minutes}
      </span>
      <motion.span
        className="font-mono tabular-nums text-text-primary"
        style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 100, letterSpacing: '-0.02em' }}
        animate={{ opacity: status === 'running' ? [1, 0.3, 1] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        :
      </motion.span>
      <span className="font-mono tabular-nums text-text-primary" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 100, letterSpacing: '-0.02em' }}>
        {seconds}
      </span>
      <span className="font-mono tabular-nums text-text-tertiary" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 200, marginBottom: '0.5em', marginLeft: '0.25em' }}>
        .{milliseconds.slice(0, 2)}
      </span>
    </div>
  );
});

StopwatchDisplay.displayName = 'StopwatchDisplay';