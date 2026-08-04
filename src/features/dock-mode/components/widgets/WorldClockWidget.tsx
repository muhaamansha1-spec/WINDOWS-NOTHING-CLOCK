import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography, Icon } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const WorldClockWidget = memo(function WorldClockWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['worldClock']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data || data.length === 0) {
    return (
      <div style={style} className="flex items-center justify-center h-full text-white/30">
        <Typography variant="body-sm" className="font-mono">No cities configured</Typography>
      </div>
    );
  }

  return (
    <div style={style} className="space-y-3">
      {data.map((city, index) => (
        <motion.div
          key={city.city}
          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div>
            <Typography variant="body-sm" className="text-white font-mono">
              {city.city}
            </Typography>
            <Typography variant="caption" className="text-white/40 font-mono">
              {city.timezone}
            </Typography>
          </div>
          <Typography variant="display-sm" className="font-thin tabular-nums font-mono text-white">
            {city.time}
          </Typography>
        </motion.div>
      ))}
    </div>
  );
});

WorldClockWidget.displayName = 'WorldClockWidget';