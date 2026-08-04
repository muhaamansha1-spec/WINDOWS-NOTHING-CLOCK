import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Icon } from '../../../components/ui';
import type { TimeData } from '../types';

interface DockClockProps {
  timeData: TimeData;
  clockSize: 'small' | 'medium' | 'large';
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  showDate: boolean;
  showAmpm: boolean;
  brightness: number;
  animationsEnabled: boolean;
  burnInOffset: { x: number; y: number };
}

const SIZE_CLASSES = {
  small: { clock: 'text-6xl lg:text-7xl', seconds: 'text-3xl lg:text-4xl', date: 'text-xl lg:text-2xl' },
  medium: { clock: 'text-8xl lg:text-9xl', seconds: 'text-4xl lg:text-5xl', date: 'text-2xl lg:text-3xl' },
  large: { clock: 'text-9xl lg:text-[10rem]', seconds: 'text-5xl lg:text-6xl', date: 'text-3xl lg:text-4xl' },
};

export const DockClock = memo(function DockClock({
  timeData,
  clockSize,
  timeFormat,
  showSeconds,
  showDate,
  showAmpm = true,
  brightness = 1,
  animationsEnabled = true,
  burnInOffset,
}: DockClockProps) {
  const sizes = SIZE_CLASSES[clockSize];

  const colonAnimation = animationsEnabled
    ? { opacity: [1, 0.3, 1], transition: { duration: 1, repeat: Infinity } }
    : { opacity: 1 };

  const style = {
    opacity: brightness,
    transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)`,
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] w-full"
      style={style}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-end gap-1">
        <Typography
          variant="clock-2xl"
          className={`${sizes.clock} font-thin tabular-nums font-mono tracking-tight text-white`}
          weight="thin"
        >
          {timeData.hours}
        </Typography>
        
        <AnimatePresence mode="wait">
          <motion.span
            key={timeData.minutes}
            className={`${sizes.clock} font-thin tabular-nums font-mono tracking-tight text-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: animationsEnabled ? 0.3 : 0, ease: 'easeOut' }}
          >
            :
          </motion.span>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.span
            key={timeData.minutes}
            className={`${sizes.clock} font-thin tabular-nums font-mono tracking-tight text-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: animationsEnabled ? 0.3 : 0, ease: 'easeOut' }}
          >
            {timeData.minutes}
          </motion.span>
        </AnimatePresence>

        {showSeconds && (
          <>
            <motion.span
              className={`${sizes.clock} font-thin tabular-nums font-mono tracking-tight text-white/60`}
              animate={colonAnimation}
            >
              :
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={timeData.seconds}
                className={`${sizes.seconds} font-thin tabular-nums font-mono tracking-tight text-white/60`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: animationsEnabled ? 0.15 : 0, ease: 'easeOut' }}
              >
                {timeData.seconds}
              </motion.span>
            </AnimatePresence>
          </>
        )}

        {timeFormat === '12h' && showAmpm && timeData.ampm && (
          <Typography
            variant="caption"
            className="ml-3 font-mono text-white/40 self-end mb-2"
          >
            {timeData.ampm}
          </Typography>
        )}
      </div>

      {showDate && (
        <motion.div
          className="mt-8 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="caption"
            className="font-mono uppercase tracking-widest text-white/40"
          >
            {timeData.weekday}
          </Typography>
          <Typography
            variant="display-sm"
            className="font-light tracking-wide text-white/80"
          >
            {timeData.month} {timeData.date}, {timeData.year}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
});

DockClock.displayName = 'DockClock';