import { memo } from 'react';
import { Typography, Icon, Badge } from '../../../../components/ui';
import type { WidgetData } from '../../types';

export const BatteryWidget = memo(function BatteryWidget({ 
  data, 
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: { 
  data: WidgetData['battery']; 
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}) {
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  if (!data) return null;

  const isLow = data.level <= 20 && !data.charging;

  return (
    <div style={style} className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-20 h-10">
        <svg width="80" height="40" viewBox="0 0 80 40">
          <rect x="0" y="0" width="74" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/40" />
          <rect x="74" y="10" width="6" height="20" rx="1" fill="currentColor" className="text-white/40" />
          <rect
            x="4"
            y="4"
            width={Math.max(2, 66 * (data.level / 100))}
            height="32"
            rx="2"
            fill={isLow ? '#EF4444' : data.charging ? '#22C55E' : 'currentColor'}
            className="text-white"
          />
          {data.charging && (
            <text x="40" y="28" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold" fontFamily="monospace">⚡</text>
          )}
        </svg>
      </div>
      <Typography variant="display-sm" className="font-thin tabular-nums font-mono text-white">
        {data.level}%
      </Typography>
      {data.charging && (
        <Badge variant="dot" dotColor="green" size="sm">Charging</Badge>
      )}
    </div>
  );
});

BatteryWidget.displayName = 'BatteryWidget';