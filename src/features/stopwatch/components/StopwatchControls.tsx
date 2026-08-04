import { memo } from 'react';
import { motion } from 'framer-motion';
import { Button, Icon } from '../../../components/ui';

interface StopwatchControlsProps {
  status: 'idle' | 'running' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onLap: () => void;
  hasLaps: boolean;
}

export const StopwatchControls = memo(function StopwatchControls({ 
  status, 
  onStart, 
  onPause, 
  onResume, 
  onReset, 
  onLap,
  hasLaps,
}: StopwatchControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {status === 'idle' && (
        <>
          <motion.button
            onClick={onStart}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Start stopwatch"
          >
            <Icon name="play" size="lg" />
          </motion.button>
          
          {hasLaps && (
            <motion.button
              onClick={onReset}
              className="btn-ghost w-20 h-20 rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              aria-label="Reset stopwatch"
            >
              <Icon name="refresh-cw" size="lg" />
            </motion.button>
          )}
        </>
      )}

      {status === 'running' && (
        <>
          <motion.button
            onClick={onLap}
            className="btn-secondary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Lap"
          >
            <Icon name="flag" size="lg" />
          </motion.button>
          
          <motion.button
            onClick={onPause}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Pause stopwatch"
          >
            <Icon name="pause" size="lg" />
          </motion.button>
        </>
      )}

      {status === 'paused' && (
        <>
          {hasLaps && (
            <motion.button
              onClick={onReset}
              className="btn-ghost w-20 h-20 rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              aria-label="Reset stopwatch"
            >
              <Icon name="refresh-cw" size="lg" />
            </motion.button>
          )}
          
          <motion.button
            onClick={onResume}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Resume stopwatch"
          >
            <Icon name="play" size="lg" />
          </motion.button>
        </>
      )}
    </div>
  );
});

StopwatchControls.displayName = 'StopwatchControls';