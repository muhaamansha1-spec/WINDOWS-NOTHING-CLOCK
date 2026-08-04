import { memo } from 'react';
import { motion } from 'framer-motion';
import { Button, Icon, Typography } from '../../../components/ui';

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const TimerControls = memo(function TimerControls({ 
  status, 
  onStart, 
  onPause, 
  onResume, 
  onReset,
  disabled = false,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {status === 'idle' && (
        <>
          <motion.button
            onClick={onStart}
            disabled={disabled}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Start timer"
          >
            <Icon name="play" size="lg" />
          </motion.button>
          
          <motion.button
            onClick={onReset}
            disabled={disabled}
            className="btn-ghost w-20 h-20 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Reset timer"
          >
            <Icon name="refresh-cw" size="lg" />
          </motion.button>
        </>
      )}

      {status === 'running' && (
        <>
          <motion.button
            onClick={onPause}
            className="btn-secondary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Pause timer"
          >
            <Icon name="pause" size="lg" />
          </motion.button>
          
          <motion.button
            onClick={onReset}
            className="btn-ghost w-20 h-20 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Reset timer"
          >
            <Icon name="refresh-cw" size="lg" />
          </motion.button>
        </>
      )}

      {status === 'paused' && (
        <>
          <motion.button
            onClick={onResume}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Resume timer"
          >
            <Icon name="play" size="lg" />
          </motion.button>
          
          <motion.button
            onClick={onReset}
            className="btn-ghost w-20 h-20 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Reset timer"
          >
            <Icon name="refresh-cw" size="lg" />
          </motion.button>
        </>
      )}

      {status === 'completed' && (
        <>
          <motion.button
            onClick={onReset}
            className="btn-primary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Start new timer"
          >
            <Icon name="refresh-cw" size="lg" />
          </motion.button>
          
          <motion.button
            onClick={onStart}
            disabled={disabled}
            className="btn-secondary w-20 h-20 rounded-full flex items-center justify-center text-xl"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            aria-label="Repeat timer"
          >
            <Icon name="repeat" size="lg" />
          </motion.button>
        </>
      )}
    </div>
  );
});

TimerControls.displayName = 'TimerControls';