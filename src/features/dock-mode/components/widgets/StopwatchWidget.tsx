import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography, Icon, Button } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const StopwatchWidget = memo(function StopwatchWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['stopwatch']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) {
    return (
      <div style={style} className="flex flex-col items-center justify-center gap-3 h-full">
        <Icon name="stopwatch" size="xl" className="text-white/30" />
        <Typography variant="body-sm" className="font-mono text-white/40">Stopwatch</Typography>
        <Button variant="ghost" size="sm" className="font-mono text-xs">Open</Button>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const total = Math.floor(ms);
    const mins = Math.floor(total / 60000);
    const secs = Math.floor((total % 60000) / 1000);
    const cs = Math.floor((total % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={style} className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className="font-mono tabular-nums text-white"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        animate={data.running ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {formatTime(data.elapsed)}
      </motion.div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="font-mono text-xs">
          {data.running ? 'Pause' : 'Resume'}
        </Button>
        <Button variant="secondary" size="sm" className="font-mono text-xs">
          Reset
        </Button>
      </div>
    </div>
  );
});

StopwatchWidget.displayName = 'StopwatchWidget';