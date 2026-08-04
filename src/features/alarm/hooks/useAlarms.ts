import { useState, useEffect, useCallback, useRef } from 'react';
import type { Alarm, AlarmFormData, DayOfWeek, AlarmSound } from '../types';
import { createAlarm, isAlarmDue, getNextAlarmTime, ALARM_SOUNDS } from '../types';

const STORAGE_KEY = 'nothing-clock-alarms';

function loadAlarms(): Alarm[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }
  return [];
}

function saveAlarms(alarms: Alarm[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch {
    // Ignore save errors
  }
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => loadAlarms());
  const [isChecking, setIsChecking] = useState(false);
  const checkIntervalRef = useRef<number>();
  const triggeredAlarmsRef = useRef<Map<string, number>>(new Map());

  // Persist to localStorage
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  // Check alarms every second
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      
      alarms.forEach(alarm => {
        if (isAlarmDue(alarm, now)) {
          const alarmKey = `${alarm.id}-${now.getHours()}:${now.getMinutes()}`;
          
          if (!triggeredAlarmsRef.current.has(alarmKey)) {
            triggeredAlarmsRef.current.set(alarmKey, Date.now());
            triggerAlarm(alarm);
          }
        }
      });

      // Clean up old triggered alarms (older than 2 minutes)
      const cutoff = Date.now() - 2 * 60 * 1000;
      triggeredAlarmsRef.current = new Map(
        Array.from(triggeredAlarmsRef.current.entries()).filter(([, timestamp]) => timestamp > cutoff)
      );
    };

    checkAlarms();
    checkIntervalRef.current = window.setInterval(checkAlarms, 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [alarms]);

  const triggerAlarm = useCallback((alarm: Alarm) => {
    // Play sound
    playAlarmSound(alarm.sound, alarm.volume);
    
    // Show notification
    showAlarmNotification(alarm);
    
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('alarm-triggered', { detail: alarm }));
  }, []);

  const addAlarm = useCallback((formData: AlarmFormData) => {
    const newAlarm = createAlarm(formData);
    setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    return newAlarm;
  }, []);

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id 
        ? { ...alarm, ...updates, updatedAt: Date.now() }
        : alarm
    ).sort((a, b) => a.time.localeCompare(b.time)));
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id 
        ? { ...alarm, enabled: !alarm.enabled, updatedAt: Date.now() }
        : alarm
    ));
  }, []);

  const getAlarm = useCallback((id: string) => {
    return alarms.find(a => a.id === id);
  }, [alarms]);

  const getNextAlarms = useCallback(() => {
    const now = new Date();
    return alarms
      .filter(a => a.enabled)
      .map(a => ({ alarm: a, nextTime: getNextAlarmTime(a, now) }))
      .filter(({ nextTime }) => nextTime !== null)
      .sort((a, b) => (a.nextTime!.getTime() - b.nextTime!.getTime()))
      .slice(0, 5);
  }, [alarms]);

  return {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getAlarm,
    getNextAlarms,
    sounds: ALARM_SOUNDS,
    playTestSound: playAlarmSound,
  };
}

// Sound playback using Web Audio API
let audioContext: AudioContext | null = null;
let isPlayingAlarm = false;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playAlarmSound(soundId: AlarmSound, volume: number) {
  const sound = ALARM_SOUNDS.find(s => s.id === soundId);
  if (!sound) return;

  const ctx = getAudioContext();
  isPlayingAlarm = true;

  const playPattern = (pattern: 'single' | 'double' | 'triple' | 'continuous', frequency: number, vol: number) => {
    const playBeep = (delay: number, duration: number = 0.5) => {
      if (!isPlayingAlarm) return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.value = vol * 0.3;
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      
      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + duration);
    };

    const baseDelay = 0.1;
    
    switch (pattern) {
      case 'single':
        playBeep(baseDelay, 0.8);
        break;
      case 'double':
        playBeep(baseDelay, 0.5);
        playBeep(baseDelay + 0.7, 0.5);
        break;
      case 'triple':
        playBeep(baseDelay, 0.3);
        playBeep(baseDelay + 0.4, 0.3);
        playBeep(baseDelay + 0.8, 0.3);
        break;
      case 'continuous':
        // Play continuous beeps every 1.5 seconds
        const playContinuous = () => {
          if (!isPlayingAlarm) return;
          playBeep(0, 1.0);
          setTimeout(playContinuous, 1500);
        };
        playContinuous();
        break;
    }
  };

  playPattern(sound.pattern, sound.frequency, volume);

  // Auto-stop after 30 seconds
  setTimeout(() => {
    isPlayingAlarm = false;
  }, 30000);
}

export function stopAlarmSound() {
  isPlayingAlarm = false;
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

// Notification
export function showAlarmNotification(alarm: Alarm) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('Alarm', {
      body: `${alarm.label} - ${alarm.time}`,
      icon: '/favicon.svg',
      tag: `alarm-${alarm.id}`,
      requireInteraction: true,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showAlarmNotification(alarm);
      }
    });
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}