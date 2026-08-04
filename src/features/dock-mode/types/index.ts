export type ClockSize = 'small' | 'medium' | 'large';
export type TimeFormat = '12h' | '24h';

export type WidgetId = 
  | 'nextAlarm'
  | 'weather'
  | 'battery'
  | 'charging'
  | 'calendar'
  | 'stopwatch'
  | 'timer'
  | 'worldClock'
  | 'media'
  | 'cpu'
  | 'ram';

export interface WidgetConfig {
  id: WidgetId;
  label: string;
  icon: string;
  enabled: boolean;
  position: { x: number; y: number }; // Grid position
  size: 'small' | 'medium' | 'large';
}

export const WIDGET_DEFINITIONS: Record<WidgetId, Omit<WidgetConfig, 'enabled' | 'position' | 'size'>> = {
  nextAlarm: { id: 'nextAlarm', label: 'Next Alarm', icon: 'alarm' },
  weather: { id: 'weather', label: 'Weather', icon: 'cloud-sun' },
  battery: { id: 'battery', label: 'Battery', icon: 'battery' },
  charging: { id: 'charging', label: 'Charging', icon: 'battery-charging' },
  calendar: { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  stopwatch: { id: 'stopwatch', label: 'Stopwatch', icon: 'stopwatch' },
  timer: { id: 'timer', label: 'Timer', icon: 'timer' },
  worldClock: { id: 'worldClock', label: 'World Clock', icon: 'globe' },
  media: { id: 'media', label: 'Now Playing', icon: 'music' },
  cpu: { id: 'cpu', label: 'CPU Usage', icon: 'cpu' },
  ram: { id: 'ram', label: 'RAM Usage', icon: 'memory' },
};

export interface DockSettings {
  clockSize: ClockSize;
  timeFormat: TimeFormat;
  showSeconds: boolean;
  showDate: boolean;
  brightness: number; // 0.1 - 1.0
  animationsEnabled: boolean;
  widgets: Record<WidgetId, WidgetConfig>;
  burnInProtection: boolean;
  autoHideCursor: boolean;
}

export interface DockModeState {
  isActive: boolean;
  settings: DockSettings;
  mouseVisible: boolean;
  lastMouseMove: number;
  burnInOffset: { x: number; y: number };
  windowFocused: boolean;
}

export const DEFAULT_DOCK_SETTINGS: DockSettings = {
  clockSize: 'large',
  timeFormat: '24h',
  showSeconds: true,
  showDate: true,
  brightness: 1.0,
  animationsEnabled: true,
  widgets: {
    nextAlarm: { ...WIDGET_DEFINITIONS.nextAlarm, enabled: false, position: { x: 0, y: 0 }, size: 'medium' },
    weather: { ...WIDGET_DEFINITIONS.weather, enabled: false, position: { x: 1, y: 0 }, size: 'medium' },
    battery: { ...WIDGET_DEFINITIONS.battery, enabled: false, position: { x: 2, y: 0 }, size: 'small' },
    charging: { ...WIDGET_DEFINITIONS.charging, enabled: false, position: { x: 3, y: 0 }, size: 'small' },
    calendar: { ...WIDGET_DEFINITIONS.calendar, enabled: false, position: { x: 0, y: 1 }, size: 'medium' },
    stopwatch: { ...WIDGET_DEFINITIONS.stopwatch, enabled: false, position: { x: 1, y: 1 }, size: 'small' },
    timer: { ...WIDGET_DEFINITIONS.timer, enabled: false, position: { x: 2, y: 1 }, size: 'small' },
    worldClock: { ...WIDGET_DEFINITIONS.worldClock, enabled: false, position: { x: 3, y: 1 }, size: 'medium' },
    media: { ...WIDGET_DEFINITIONS.media, enabled: true, position: { x: 0, y: 0 }, size: 'large' },
    cpu: { ...WIDGET_DEFINITIONS.cpu, enabled: false, position: { x: 1, y: 2 }, size: 'small' },
    ram: { ...WIDGET_DEFINITIONS.ram, enabled: false, position: { x: 2, y: 2 }, size: 'small' },
  },
  burnInProtection: true,
  autoHideCursor: true,
};

export interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
  weekday: string;
  date: string;
  month: string;
  year: string;
}

export interface WidgetData {
  nextAlarm?: { time: string; label: string; enabled: boolean } | null;
  weather?: { temperature: number; condition: string; location: string } | null;
  battery?: { level: number; charging: boolean } | null;
  charging?: { isCharging: boolean; powerSource: string } | null;
  calendar?: Array<{ title: string; time: string; allDay: boolean }> | null;
  stopwatch?: { elapsed: number; running: boolean } | null;
  timer?: { remaining: number; running: boolean } | null;
  worldClock?: Array<{ city: string; time: string; timezone: string }> | null;
  media?: { title: string; artist: string; playing: boolean; artwork?: string } | null;
  cpu?: { usage: number } | null;
  ram?: { used: number; total: number } | null;
}