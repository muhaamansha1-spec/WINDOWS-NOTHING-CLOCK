import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../../../components/ui';

interface DateDisplayProps {
  weekday: string;
  day: string;
  month: string;
  year: string;
  showYear?: boolean;
}

export const DateDisplay = memo(function DateDisplay({
  weekday,
  day,
  month,
  year,
  showYear = true,
}: DateDisplayProps) {
  return (
    <div className="flex items-center gap-4 mt-8">
      <motion.div
        className="flex flex-col items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Typography variant="overline" className="text-text-secondary">
          {weekday}
        </Typography>
        <Typography variant="display-md" weight="extralight" className="text-text-primary -mt-1">
          {day}
        </Typography>
      </motion.div>

      <motion.div className="w-px h-12 bg-border-primary" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />

      <motion.div
        className="flex flex-col items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Typography variant="overline" className="text-text-secondary">
          {month}
        </Typography>
        {showYear && (
          <Typography variant="body-lg" className="text-text-tertiary font-mono -mt-1">
            {year}
          </Typography>
        )}
      </motion.div>
    </div>
  );
});

DateDisplay.displayName = 'DateDisplay';