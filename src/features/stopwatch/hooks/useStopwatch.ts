import { useState, useEffect, useCallback, useRef } from 'react';
import type { StopwatchState, Lap, StopwatchStatus } from '../types';
import { defaultStopwatchState } from '../types';

export function useStopwatch() {
  const [state, setState] = useState<StopwatchState>(defaultStopwatchState);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Animation loop for smooth updates
  const tick = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    setState(prev => {
      if (prev.status !== 'running') return prev;
      return {
        ...prev,
        elapsedTime: prev.elapsedTime + Math.max(0, delta),
      };
    });

    if (isMountedRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    if (state.status === 'running') {
      lastTimeRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.status, tick]);

  const start = useCallback(() => {
    setState(prev => {
      if (prev.status === 'running') return prev;
      
      const now = Date.now();
      return {
        ...prev,
        status: 'running',
        startedAt: now,
        pausedAt: null,
        elapsedTime: prev.status === 'paused' ? prev.elapsedTime : 0,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'running') return prev;
      
      const now = Date.now();
      return {
        ...prev,
        status: 'paused',
        pausedAt: now,
        elapsedTime: prev.elapsedTime + Math.max(0, now - lastTimeRef.current),
      };
    });
  }, []);

  const resume = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'paused') return prev;
      
      return {
        ...prev,
        status: 'running',
        startedAt: Date.now(),
        pausedAt: null,
      };
    });
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setState(defaultStopwatchState);
  }, []);

  const addLap = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'running') return prev;
      
      const now = Date.now();
      const currentElapsed = prev.elapsedTime + Math.max(0, now - lastTimeRef.current);
      const previousLapTime = prev.laps.length > 0 ? prev.laps[prev.laps.length - 1].time : 0;
      const splitTime = currentElapsed - previousLapTime;
      
      const newLap: Lap = {
        id: crypto.randomUUID(),
        number: prev.laps.length + 1,
        time: currentElapsed,
        splitTime,
        createdAt: now,
      };
      
      return {
        ...prev,
        laps: [...prev.laps, newLap],
      };
    });
  }, []);

  const clearLaps = useCallback(() => {
    setState(prev => ({
      ...prev,
      laps: [],
    }));
  }, []);

  const getFormattedTime = useCallback(() => {
    const { elapsedTime, status } = state;
    let currentElapsed = elapsedTime;
    
    if (status === 'running') {
      currentElapsed += Math.max(0, Date.now() - lastTimeRef.current);
    }
    
    return formatStopwatchTime(currentElapsed);
  }, [state.elapsedTime, state.status]);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    addLap,
    clearLaps,
    getFormattedTime,
  };
}

// Helper function (defined here to avoid circular import)
function formatStopwatchTime(ms: number): { hours: string; minutes: string; seconds: string; milliseconds: string } {
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