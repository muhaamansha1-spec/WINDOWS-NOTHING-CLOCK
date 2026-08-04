import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography, Icon } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const CpuWidget = memo(function CpuWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['cpu']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) return null;

  const getColor = (usage: number) => {
    if (usage > 80) return '#EF4444';
    if (usage > 50) return '#EAB308';
    return '#22C55E';
  };

  return (
    <div style={style} className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#262626"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke={getColor(data.usage)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 * (1 - data.usage / 100)}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${getColor(data.usage)})` }}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * (1 - data.usage / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Typography variant="display-md" className="font-thin tabular-nums font-mono text-white">
            {data.usage}%
          </Typography>
        </div>
      </div>
      <Typography variant="caption" className="text-white/40 font-mono uppercase tracking-wider">
        CPU Usage
      </Typography>
    </div>
  );
});

CpuWidget.displayName = 'CpuWidget';