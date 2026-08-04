import type { TimeFormat, DateFormat, TimeData } from '../features/clock/types';

export function formatTime(date: Date, timeFormat: TimeFormat, showSeconds: boolean): Pick<TimeData, 'hours' | 'minutes' | 'seconds' | 'ampm'> {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  let ampm = '';

  if (timeFormat === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes,
    seconds,
    ampm,
  };
}

export function formatDate(date: Date, dateFormat: DateFormat): { date: string; day: string; month: string; year: string; weekday: string } {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: dateFormat === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: dateFormat === 'long' ? 'numeric' : undefined,
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat('en-US', { month: dateFormat === 'long' ? 'long' : 'short' }).format(date);
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

  return { date: formatted, day, month, year, weekday };
}

export function getTimeData(
  date: Date,
  timeFormat: TimeFormat,
  dateFormat: DateFormat,
  showSeconds: boolean,
  showDate: boolean
): TimeData {
  const time = formatTime(date, timeFormat, showSeconds);
  const dateData = showDate ? formatDate(date, dateFormat) : { date: '', day: '', month: '', year: '', weekday: '' };
  const milliseconds = date.getMilliseconds();

  return {
    ...time,
    ...dateData,
    milliseconds,
  };
}

export function getClockFontSize(size: 'small' | 'medium' | 'large' | 'xlarge'): string {
  const sizes = {
    small: 'clock-lg',
    medium: 'clock-xl',
    large: 'clock-2xl',
    xlarge: 'clock-3xl',
  };
  return sizes[size];
}