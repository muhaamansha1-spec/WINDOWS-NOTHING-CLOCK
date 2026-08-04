import { memo } from 'react';
import { Typography, Icon, Badge } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const WeatherWidget = memo(function WeatherWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['weather']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) {
    return (
      <div style={style} className="flex items-center justify-center h-full text-white/30">
        <Typography variant="body-sm" className="font-mono">Weather unavailable</Typography>
      </div>
    );
  }

  const conditionIcons: Record<string, string> = {
    Sunny: 'sun',
    Cloudy: 'cloud',
    Rainy: 'cloud-rain',
    'Partly Cloudy': 'cloud-sun',
    Snowy: 'cloud-snow',
  };

  return (
    <div style={style}>
      <div className="flex items-center justify-between mb-2">
        <Typography variant="display-lg" className="font-thin tabular-nums font-mono text-white">
          {data.temperature}°
        </Typography>
        <Icon name={conditionIcons[data.condition] || 'cloud'} size="xl" className="text-white/60" />
      </div>
      <Typography variant="body-sm" className="text-white/60 font-mono capitalize">
        {data.condition}
      </Typography>
      <Typography variant="caption" className="text-white/40 font-mono mt-1">
        {data.location}
      </Typography>
    </div>
  );
});

WeatherWidget.displayName = 'WeatherWidget';