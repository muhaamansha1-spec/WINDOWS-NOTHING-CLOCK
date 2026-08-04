import { memo, useMemo } from 'react';
import { NextAlarmWidget } from './widgets/NextAlarmWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { BatteryWidget } from './widgets/BatteryWidget';
import { ChargingWidget } from './widgets/ChargingWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { StopwatchWidget } from './widgets/StopwatchWidget';
import { TimerWidget } from './widgets/TimerWidget';
import { WorldClockWidget } from './widgets/WorldClockWidget';
import { MediaWidget } from './widgets/MediaWidget';
import { CpuWidget } from './widgets/CpuWidget';
import { RamWidget } from './widgets/RamWidget';
import { DockWidget } from './DockWidget';
import type { WidgetId, WidgetConfig, WidgetData } from '../types';

interface WidgetRendererProps {
  id: WidgetId;
  config: WidgetConfig;
  data: WidgetData;
  brightness: number;
  burnInOffset: { x: number; y: number };
}

const widgetComponents: Record<WidgetId, React.ComponentType<any>> = {
  nextAlarm: NextAlarmWidget,
  weather: WeatherWidget,
  battery: BatteryWidget,
  charging: ChargingWidget,
  calendar: CalendarWidget,
  stopwatch: StopwatchWidget,
  timer: TimerWidget,
  worldClock: WorldClockWidget,
  media: MediaWidget,
  cpu: CpuWidget,
  ram: RamWidget,
};

export const WidgetRenderer = memo(function WidgetRenderer({ 
  id, 
  config, 
  data, 
  brightness, 
  burnInOffset 
}: WidgetRendererProps) {
  const Component = widgetComponents[id];
  
  if (!Component) {
    return (
      <DockWidget
        config={{ id, label: id, icon: 'help', enabled: true, position: { x: 0, y: 0 }, size: 'medium' }}
        brightness={brightness}
        burnInOffset={burnInOffset}
      >
        <div className="flex items-center justify-center h-full text-white/30">
          Unknown widget: {id}
        </div>
      </DockWidget>
    );
  }

  return (
    <DockWidget
      config={config}
      brightness={brightness}
      burnInOffset={burnInOffset}
    >
      <Component data={data[id]} brightness={brightness} burnInOffset={burnInOffset} />
    </DockWidget>
  );
});

WidgetRenderer.displayName = 'WidgetRenderer';