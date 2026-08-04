export type TimeFormat = '12h' | '24h';
export type DateFormat = 'none' | 'short' | 'long';
export type ClockSize = 'lg' | 'xl' | '2xl' | '3xl';

export interface ClockSettings {
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  showSeconds: boolean;
  showMilliseconds: boolean;
  showDate: boolean;
  size: ClockSize;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

export interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: number;
  ampm: string;
  day: string;
  date: string;
  month: string;
  year: string;
  weekday: string;
}