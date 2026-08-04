import { motion, AnimatePresence } from 'framer-motion';
import type { TimeData } from '../types';
import { getClockFontSize } from '../../../utils/time';

interface ClockDisplayProps {
  timeData: TimeData;
  settings: {
    timeFormat: '12h' | '24h';
    showSeconds: boolean;
    showDate: boolean;
    size: 'small' | 'medium' | 'large' | 'xlarge';
    fontWeight: number;
  };
}

const fontWeights = {
  100: 'font-thin',
  200: 'font-extralight',
  300: 'font-light',
  400: 'font-normal',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
  800: 'font-extrabold',
  900: 'font-black',
};

export function ClockDisplay({ timeData, settings }: ClockDisplayProps) {
  const clockFontSize = getClockFontSize(settings.size);
  const fontWeightClass = fontWeights[settings.fontWeight as keyof typeof fontWeights] || 'font-light';

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${timeData.hours}:${timeData.minutes}`}
          className={`font-mono ${clockFontSize} ${fontWeightClass} tabular-nums tracking-tight`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-white dark:text-white">{timeData.hours}</span>
          <motion.span
            key={timeData.minutes}
            className="text-white dark:text-white"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
          >
            :
          </motion.span>
          <span className="text-white dark:text-white">{timeData.minutes}</span>
          {settings.showSeconds && (
            <>
              <span className="text-white dark:text-white">:</span>
              <span className="text-white dark:text-white text-opacity-70">{timeData.seconds}</span>
            </>
          )}
          {settings.timeFormat === '12h' && timeData.ampm && (
            <span className="ml-2 text-sm font-normal tracking-wide opacity-70">
              {timeData.ampm}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {settings.showDate && (timeData.date || timeData.day) && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${timeData.date}-${timeData.day}`}
            className="mt-6 text-lg font-light tracking-wide opacity-60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          >
            {timeData.day && (
              <span className="capitalize mr-2">{timeData.day}</span>
            )}
            <span>{timeData.date}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}