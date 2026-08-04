import { useState, useEffect, useCallback } from 'react';
import type { WidgetData } from '../types';

export function useWidgetData() {
  const [data, setData] = useState<WidgetData>({});

  // Mock data generators
  const generateMockData = useCallback(() => {
    const now = new Date();
    const batteryLevel = Math.floor(Math.random() * 100);
    const isCharging = Math.random() > 0.7;
    
    return {
      nextAlarm: Math.random() > 0.3 ? {
        time: `${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        label: ['Morning', 'Work', 'Meeting', 'Gym', 'Reminder'][Math.floor(Math.random() * 5)],
        enabled: true,
      } : null,

      weather: Math.random() > 0.2 ? {
        temperature: Math.floor(Math.random() * 30) + 5,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Snowy'][Math.floor(Math.random() * 5)],
        location: 'Current Location',
      } : null,

      battery: {
        level: batteryLevel,
        charging: isCharging,
      },

      charging: {
        isCharging,
        powerSource: isCharging ? 'AC Power' : 'Battery',
      },

      calendar: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => ({
        title: ['Meeting', 'Lunch', 'Call', 'Appointment', 'Deadline'][Math.floor(Math.random() * 5)],
        time: `${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
        allDay: Math.random() > 0.9,
      })),

      stopwatch: Math.random() > 0.5 ? {
        elapsed: Math.floor(Math.random() * 3600000),
        running: Math.random() > 0.5,
      } : null,

      timer: Math.random() > 0.5 ? {
        remaining: Math.floor(Math.random() * 3600),
        running: Math.random() > 0.5,
      } : null,

      worldClock: [
        { city: 'New York', time: new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' })).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), timezone: 'EST' },
        { city: 'London', time: new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), timezone: 'GMT' },
        { city: 'Tokyo', time: new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), timezone: 'JST' },
      ],

      media: Math.random() > 0.5 ? {
        title: ['Song Title', 'Another Track', 'Music Name', 'Audio File'][Math.floor(Math.random() * 4)],
        artist: ['Artist Name', 'Band Name', 'Creator', 'Producer'][Math.floor(Math.random() * 4)],
        playing: Math.random() > 0.5,
        artwork: undefined,
      } : null,

      cpu: { usage: Math.floor(Math.random() * 100) },
      ram: { used: Math.floor(Math.random() * 16) + 4, total: 16 },
    };
  }, []);

  useEffect(() => {
    setData(generateMockData());
    
    // Update data periodically
    const interval = window.setInterval(() => {
      setData(generateMockData());
    }, 5000);

    return () => clearInterval(interval);
  }, [generateMockData]);

  return data;
}