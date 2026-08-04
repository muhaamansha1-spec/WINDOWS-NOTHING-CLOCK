export type ThemeMode = 'dark' | 'light' | 'system';
export type ClockSize = 'lg' | 'xl' | '2xl' | '3xl';
export type DateFormat = 'none' | 'short' | 'long';
export type TimeFormat = '12h' | '24h';

export interface ClockSettings {
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  showSeconds: boolean;
  showMilliseconds: boolean;
  showDate: boolean;
  size: ClockSize;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

export interface Settings {
  theme: ThemeMode;
  reducedMotion: boolean;
  font: string;
  clock: ClockSettings;
}

export const defaultSettings: Settings = {
  theme: 'dark',
  reducedMotion: false,
  font: 'Inter',
  clock: {
    timeFormat: '24h',
    dateFormat: 'short',
    showSeconds: true,
    showMilliseconds: false,
    showDate: true,
    size: '2xl',
    fontWeight: 300,
  },
};