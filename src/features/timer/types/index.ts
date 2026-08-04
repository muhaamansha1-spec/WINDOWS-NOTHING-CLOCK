export type TimerPreset = 
  | '1m' | '3m' | '5m' | '10m' | '15m' | '20m' | '25m' | '30m'
  | '45m' | '1h' | '1h30m' | '2h';

export const TIMER_PRESETS: { id: TimerPreset; label: string; seconds: number }[] = [
  { id: '1m', label: '1 min', seconds: 60 },
  { id: '3m', label: '3 min', seconds: 180 },
  { id: '5m', label: '5 min', seconds: 300 },
  { id: '10m', label: '10 min', seconds: 600 },
  { id: '15m', label: '15 min', seconds: 900 },
  { id: '20m', label: '20 min', seconds: 1200 },
  { id: '25m', label: '25 min', seconds: 1500 },
  { id: '30m', label: '30 min', seconds: 1800 },
  { id: '45m', label: '45 min', seconds: 2700 },
  { id: '1h', label: '1 hour', seconds: 3600 },
  { id: '1h30m', label: '1.5 hours', seconds: 5400 },
  { id: '2h', label: '2 hours', seconds: 7200 },
];

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerState {
  status: TimerStatus;
  totalSeconds: number;
  remainingSeconds: number;
  startedAt: number | null;
  pausedAt: number | null;
}

export const defaultTimerState: TimerState = {
  status: 'idle',
  totalSeconds: 0,
  remainingSeconds: 0,
  startedAt: null,
  pausedAt: null,
};

export function formatTime(seconds: number, showHours = true): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (showHours && hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeVerbose(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);
  return parts.join(' ');
}

export function parseTimeInput(hours: string, minutes: string, seconds: string): number {
  const h = parseInt(hours || '0', 10) || 0;
  const m = parseInt(minutes || '0', 10) || 0;
  const s = parseInt(seconds || '0', 10) || 0;
  return h * 3600 + m * 60 + s;
}

export function getProgress(total: number, remaining: number): number {
  if (total === 0) return 0;
  return 1 - (remaining / total);
}