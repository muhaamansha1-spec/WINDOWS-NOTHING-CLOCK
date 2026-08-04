export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export type AlarmSound = 'default' | 'gentle' | 'digital' | 'classic';

export interface Alarm {
  id: string;
  time: string; // HH:mm format (24h)
  label: string;
  enabled: boolean;
  repeatDays: DayOfWeek[];
  sound: AlarmSound;
  volume: number; // 0-1
  createdAt: number;
  updatedAt: number;
}

export interface AlarmFormData {
  time: string;
  label: string;
  repeatDays: DayOfWeek[];
  sound: AlarmSound;
  volume: number;
}

export const ALARM_SOUNDS: { id: AlarmSound; name: string; frequency: number; pattern: 'single' | 'double' | 'triple' | 'continuous' }[] = [
  { id: 'default', name: 'Default', frequency: 880, pattern: 'double' },      // A5 - standard beep
  { id: 'gentle', name: 'Gentle', frequency: 523, pattern: 'single' },        // C5 - softer tone
  { id: 'digital', name: 'Digital', frequency: 1046, pattern: 'triple' },     // C6 - higher pitch
  { id: 'classic', name: 'Classic', frequency: 440, pattern: 'continuous' },  // A4 - lower, continuous
];

export const defaultAlarmFormData: AlarmFormData = {
  time: '07:00',
  label: 'Alarm',
  repeatDays: [],
  sound: 'default',
  volume: 0.8,
};

export function createAlarm(formData: AlarmFormData): Alarm {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    ...formData,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function isAlarmDue(alarm: Alarm, now: Date = new Date()): boolean {
  if (!alarm.enabled) return false;

  const [hours, minutes] = alarm.time.split(':').map(Number);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours !== hours || currentMinutes !== minutes) return false;

  // Check repeat days
  if (alarm.repeatDays.length === 0) {
    // One-time alarm - check if it's for today (we'll handle dismissal separately)
    return true;
  }

  const today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()] as DayOfWeek;
  return alarm.repeatDays.includes(today);
}

export function getNextAlarmTime(alarm: Alarm, from: Date = new Date()): Date | null {
  if (!alarm.enabled) return null;

  const [hours, minutes] = alarm.time.split(':').map(Number);
  
  if (alarm.repeatDays.length === 0) {
    // One-time alarm
    const next = new Date(from);
    next.setHours(hours, minutes, 0, 0);
    if (next <= from) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  }

  // Repeating alarm - find next matching day
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayIndex = from.getDay();
  
  for (let i = 0; i < 7; i++) {
    const checkDayIndex = (currentDayIndex + i) % 7;
    const checkDay = dayOrder[checkDayIndex] as DayOfWeek;
    
    if (alarm.repeatDays.includes(checkDay)) {
      const next = new Date(from);
      next.setDate(from.getDate() + i);
      next.setHours(hours, minutes, 0, 0);
      
      if (i === 0 && next <= from) {
        continue; // Already passed today, check next occurrence
      }
      return next;
    }
  }
  
  return null;
}

export function formatAlarmTime(time: string, timeFormat: '12h' | '24h'): string {
  const [hours, minutes] = time.split(':').map(Number);
  
  if (timeFormat === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatRepeatDays(days: DayOfWeek[]): string {
  if (days.length === 0) return 'Once';
  if (days.length === 7) return 'Daily';
  if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday')) return 'Weekdays';
  if (days.length === 2 && days.includes('saturday') && days.includes('sunday')) return 'Weekends';
  
  return days.map(d => DAYS_OF_WEEK.find(day => day.key === d)?.short).join(', ');
}