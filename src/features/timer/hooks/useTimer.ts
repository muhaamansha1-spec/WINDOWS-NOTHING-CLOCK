import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState, TimerStatus } from '../types';
import { defaultTimerState } from '../types';
import { showTimerNotification, requestNotificationPermission, playTimerCompleteSound, stopTimerSound } from './timerUtils';

const TICK_INTERVAL = 100; // 100ms for smooth progress

export function useTimer() {
  const [state, setState] = useState<TimerState>(defaultTimerState);
  const [presetSeconds, setPresetSeconds] = useState<number>(0);
  const rafRef = useRef<number>(0);
  const intervalRef = useRef<number>();
  const lastTickRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Animation loop for smooth progress
  const tick = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    const elapsed = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    setState(prev => {
      if (prev.status !== 'running') return prev;
      
      const newRemaining = Math.max(0, prev.remainingSeconds - elapsed);
      const completed = newRemaining <= 0;
      
      if (completed) {
        playTimerCompleteSound();
        showTimerNotification();
        return {
          ...prev,
          status: 'completed',
          remainingSeconds: 0,
        };
      }
      
      return {
        ...prev,
        remainingSeconds: newRemaining,
      };
    });

    if (isMountedRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // Start animation loop when running
  useEffect(() => {
    if (state.status === 'running') {
      lastTickRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.status, tick]);

  // Secondary interval for notification check (backup)
  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = window.setInterval(() => {
        // This is a backup - the RAF handles the actual countdown
      }, TICK_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status]);

  const start = useCallback((seconds?: number) => {
    setState(prev => {
      const total = seconds ?? prev.totalSeconds;
      if (total <= 0) return prev;
      
      return {
        ...prev,
        status: 'running',
        totalSeconds: total,
        remainingSeconds: prev.status === 'paused' ? prev.remainingSeconds : total,
        startedAt: Date.now(),
        pausedAt: null,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'running') return prev;
      return {
        ...prev,
        status: 'paused',
        pausedAt: Date.now(),
      };
    });
  }, []);

  const resume = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'paused') return prev;
      return {
        ...prev,
        status: 'running',
        pausedAt: null,
      };
    });
  }, []);

  const reset = useCallback(() => {
    stopTimerSound();
    cancelAnimationFrame(rafRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState(defaultTimerState);
  }, []);

  const setTime = useCallback((seconds: number) => {
    if (seconds < 0) return;
    setState(prev => ({
      ...prev,
      totalSeconds: seconds,
      remainingSeconds: prev.status === 'idle' || prev.status === 'completed' ? seconds : prev.remainingSeconds,
    }));
  }, []);

  const setPreset = useCallback((seconds: number) => {
    setPresetSeconds(seconds);
    setState(prev => ({
      ...prev,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      status: 'idle',
    }));
  }, []);

  const getProgress = useCallback(() => {
    if (state.totalSeconds === 0) return 0;
    return 1 - (state.remainingSeconds / state.totalSeconds);
  }, [state.totalSeconds, state.remainingSeconds]);

  const getFormattedTime = useCallback((showHours = true) => {
    const { remainingSeconds } = state;
    const hrs = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = Math.floor(remainingSeconds % 60);
    
    if (showHours && (hrs > 0 || state.totalSeconds >= 3600)) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [state.remainingSeconds, state.totalSeconds]);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    setTime,
    setPreset,
    presetSeconds,
    getProgress,
    getFormattedTime,
  };
}