import { useState, useEffect, useCallback, useRef } from 'react';

interface UseBurnInProtectionOptions {
  enabled: boolean;
  intervalMs?: number;
  maxOffset?: number;
}

export function useBurnInProtection({ enabled, intervalMs = 60000, maxOffset = 4 }: UseBurnInProtectionOptions) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<number>();
  const rafRef = useRef<number>();
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });

  const generateRandomOffset = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * maxOffset;
    return {
      x: Math.round(Math.cos(angle) * distance),
      y: Math.round(Math.sin(angle) * distance),
    };
  }, [maxOffset]);

  const animateToTarget = useCallback(() => {
    currentOffsetRef.current.x += (targetOffsetRef.current.x - currentOffsetRef.current.x) * 0.05;
    currentOffsetRef.current.y += (targetOffsetRef.current.y - currentOffsetRef.current.y) * 0.05;

    setOffset({
      x: Math.round(currentOffsetRef.current.x * 100) / 100,
      y: Math.round(currentOffsetRef.current.y * 100) / 100,
    });

    const dx = Math.abs(targetOffsetRef.current.x - currentOffsetRef.current.x);
    const dy = Math.abs(targetOffsetRef.current.y - currentOffsetRef.current.y);

    if (dx > 0.01 || dy > 0.01) {
      rafRef.current = requestAnimationFrame(animateToTarget);
    }
  }, []);

  const shift = useCallback(() => {
    if (!enabled) return;
    const newOffset = generateRandomOffset();
    targetOffsetRef.current = newOffset;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [enabled, generateRandomOffset, animateToTarget]);

  useEffect(() => {
    if (!enabled) {
      setOffset({ x: 0, y: 0 });
      targetOffsetRef.current = { x: 0, y: 0 };
      currentOffsetRef.current = { x: 0, y: 0 };
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    // Initial shift
    shift();

    // Periodic shifts
    intervalRef.current = window.setInterval(shift, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, intervalMs, shift]);

  return offset;
}