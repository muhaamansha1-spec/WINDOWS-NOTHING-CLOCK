import { memo } from 'react';
import { Typography, Icon, Badge } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const NextAlarmWidget = memo(function NextAlarmWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['nextAlarm']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) {
    return (
      <div style={style} className="flex items-center justify-center h-full text-white/30">
        <Typography variant="body-sm" className="font-mono">No alarms set</Typography>
      </div>
    );
  }

  return (
    <div style={style}>
      <div className="flex items-baseline gap-2 mb-2">
        <Typography variant="display-md" className="font-thin tabular-nums font-mono text-white">
          {data.time}
        </Typography>
        {data.enabled && <Badge variant="dot" dotColor="green" size="sm">Active</Badge>}
      </div>
      <Typography variant="body-sm" className="text-white/60 font-mono truncate">
        {data.label}
      </Typography>
    </div>
  );
});

NextAlarmWidget.displayName = 'NextAlarmWidget';