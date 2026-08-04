export type StopwatchStatus = 'idle' | 'running' | 'paused';

export interface Lap {
  id: string;
  number: number;
  time: number; // milliseconds
  splitTime: number; // milliseconds from previous lap
  createdAt: number;
}

export interface StopwatchState {
  status: StopwatchStatus;
  elapsedTime: number; // milliseconds
  startedAt: number | null;
  pausedAt: number | null;
  laps: Lap[];
}

export const defaultStopwatchState: StopwatchState = {
  status: 'idle',
  elapsedTime: 0,
  startedAt: null,
  pausedAt: null,
  laps: [],
};

export function formatStopwatchTime(ms: number): { hours: string; minutes: string; seconds: string; milliseconds: string } {
  const totalMs = Math.floor(ms);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(3, '0'),
  };
}

export function formatLapTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}