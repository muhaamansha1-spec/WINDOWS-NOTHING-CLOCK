import { useEffect, useRef, useState, useCallback } from 'react';

interface TimeData {
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

interface UseClockOptions {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  showMilliseconds: boolean;
}

function formatTime(date: Date, options: UseClockOptions): TimeData {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds();
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
    milliseconds,
    ampm,
    day: date.getDate().toString().padStart(2, '0'),
    date: date.getDate().toString().padStart(2, '0'),
    month: months[date.getMonth()],
    year: date.getFullYear().toString(),
    weekday: weekdays[date.getDay()],
  };
}

export function useClock(options: UseClockOptions) {
  const [timeData, setTimeData] = useState<TimeData>(() => formatTime(new Date(), options));
  const rafId = useRef<number>(0);
  const lastSecond = useRef<number>(-1);
  const lastMinute = useRef<number>(-1);

  const updateTime = useCallback(() => {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const currentMinute = now.getMinutes();

    // Only update state when second changes (or millisecond for smooth animation)
    if (currentSecond !== lastSecond.current || options.showMilliseconds) {
      lastSecond.current = currentSecond;
      setTimeData(formatTime(now, options));
    }

    // Schedule next frame
    rafId.current = requestAnimationFrame(updateTime);
  }, [options.showMilliseconds, options.showSeconds, options.timeFormat]);

  useEffect(() => {
    // Initial sync
    setTimeData(formatTime(new Date(), options));
    lastSecond.current = new Date().getSeconds();
    lastMinute.current = new Date().getMinutes();

    // Start animation loop
    rafId.current = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [updateTime, options.timeFormat, options.showSeconds, options.showMilliseconds]);

  return timeData;
}

export function useBattery() {
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
    supported: boolean;
  }>({
    level: 1,
    charging: false,
    supported: false,
  });

  useEffect(() => {
    // Check if Battery API is available
    if ('getBattery' in navigator) {
      const nav = navigator as Navigator & { getBattery: () => Promise<BatteryManager> };
      
      nav.getBattery().then((batteryManager) => {
        setBattery({
          level: batteryManager.level,
          charging: batteryManager.charging,
          supported: true,
        });

        const handleChange = () => {
          setBattery({
            level: batteryManager.level,
            charging: batteryManager.charging,
            supported: true,
          });
        };

        batteryManager.addEventListener('levelchange', handleChange);
        batteryManager.addEventListener('chargingchange', handleChange);

        return () => {
          batteryManager.removeEventListener('levelchange', handleChange);
          batteryManager.removeEventListener('chargingchange', handleChange);
        };
      }).catch(() => {
        setBattery({ level: 1, charging: false, supported: false });
      });
    } else {
      // Mock battery for desktop
      setBattery({ level: 0.87, charging: false, supported: false });
    }
  }, []);

  return battery;
}