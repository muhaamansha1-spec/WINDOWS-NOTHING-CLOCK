import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimeData, TimeFormat } from '../types';

interface UseDockClockOptions {
  timeFormat: TimeFormat;
  showSeconds: boolean;
  showDate: boolean;
}

function formatTimeData(date: Date, options: UseDockClockOptions): TimeData {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  let ampm = '';

  if (options.timeFormat === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes,
    seconds,
    ampm,
    weekday: weekdays[date.getDay()],
    date: date.getDate().toString().padStart(2, '0'),
    month: months[date.getMonth()],
    year: date.getFullYear().toString(),
  };
}

export function useDockClock(options: UseDockClockOptions) {
  const [timeData, setTimeData] = useState<TimeData>(() => formatTimeData(new Date(), options));
  const rafRef = useRef<number>(0);
  const lastSecondRef = useRef<number>(-1);
  const lastMinuteRef = useRef<number>(-1);

  const updateTime = useCallback(() => {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const currentMinute = now.getMinutes();

    // Only update state when second changes
    if (currentSecond !== lastSecondRef.current) {
      lastSecondRef.current = currentSecond;
      setTimeData(formatTimeData(now, options));
    }

    // Schedule next frame
    rafRef.current = requestAnimationFrame(updateTime);
  }, [options.timeFormat, options.showSeconds, options.showDate]);

  useEffect(() => {
    // Initial sync
    setTimeData(formatTimeData(new Date(), options));
    lastSecondRef.current = new Date().getSeconds();
    lastMinuteRef.current = new Date().getMinutes();

    // Start animation loop
    rafRef.current = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateTime, options.timeFormat, options.showSeconds, options.showDate]);

  return timeData;
}