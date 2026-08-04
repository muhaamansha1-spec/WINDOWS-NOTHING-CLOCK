import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Icon, Button, Card } from '../../../components/ui';
import type { Lap } from '../types';
import { formatLapTime } from '../types';

interface LapsProps {
  laps: Lap[];
  onClear: () => void;
  status: 'idle' | 'running' | 'paused';
}

export const Laps = memo(function Laps({ laps, onClear, status }: LapsProps) {
  if (laps.length === 0) {
    return (
      <motion.div
        className="w-full flex flex-col items-center justify-center py-12 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Icon name="flag" size="xl" className="text-text-tertiary mb-4 opacity-50" />
        <Typography variant="body-sm" className="text-text-tertiary font-mono">
          No laps recorded
        </Typography>
        <Typography variant="caption" className="text-text-tertiary/50 font-mono mt-1">
          Press flag button while running to record a lap
        </Typography>
      </motion.div>
    );
  }

  const fastestLap = laps.reduce((min, lap) => lap.splitTime < min.splitTime ? lap : min, laps[0]);
  const slowestLap = laps.reduce((max, lap) => lap.splitTime > max.splitTime ? lap : max, laps[0]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="overline" className="text-text-secondary">Laps ({laps.length})</Typography>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={status === 'running'}
          className="font-mono text-xs"
        >
          Clear
        </Button>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide pr-2">
        <AnimatePresence>
          {laps.slice().reverse().map((lap, index) => (
            <motion.div
              key={lap.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                lap.id === fastestLap.id ? 'bg-green-600/10 border border-green-600/20' :
                lap.id === slowestLap.id ? 'bg-red-600/10 border border-red-600/20' :
                'bg-bg-tertiary'
              }`}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border-primary flex items-center justify-center font-mono text-xs text-text-secondary flex-shrink-0">
                  #{lap.number}
                </div>
                <div>
                  <Typography variant="body-sm" className="text-text-primary font-mono tabular-nums">
                    {formatLapTime(lap.time)}
                  </Typography>
                  <Typography variant="caption" className="text-text-tertiary font-mono">
                    {lap.id === fastestLap.id && laps.length > 1 ? '⚡ Fastest' : lap.id === slowestLap.id && laps.length > 1 ? '🐢 Slowest' : 'Split'}
                    {laps.length > 1 && ` • ${formatLapTime(lap.splitTime)}`}
                  </Typography>
                </div>
              </div>
              
              <Typography variant="body-sm" className={`font-mono tabular-nums ${
                lap.id === fastestLap.id ? 'text-green-400' :
                lap.id === slowestLap.id ? 'text-red-400' :
                'text-text-secondary'
              }`}>
                {formatLapTime(lap.splitTime)}
              </Typography>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

Laps.displayName = 'Laps';