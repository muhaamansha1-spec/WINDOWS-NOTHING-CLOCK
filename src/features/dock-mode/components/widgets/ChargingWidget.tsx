import { memo } from 'react';
import { Typography, Icon, Badge } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const ChargingWidget = memo(function ChargingWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['charging']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) return null;

  return (
    <div style={style} className="flex flex-col items-center justify-center gap-2 text-center">
      <Icon 
        name={data.isCharging ? 'battery-charging' : 'battery'} 
        size="xl" 
        className={data.isCharging ? 'text-green-400' : 'text-white/40'} 
      />
      <Typography variant="body-sm" className="font-mono text-white/60 capitalize">
        {data.isCharging ? 'Charging' : 'On Battery'}
      </Typography>
      {data.isCharging && (
        <Badge variant="dot" dotColor="green" size="sm">Power Connected</Badge>
      )}
    </div>
  );
});

ChargingWidget.displayName = 'ChargingWidget';