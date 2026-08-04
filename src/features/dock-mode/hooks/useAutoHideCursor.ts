import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoHideCursorOptions {
  enabled: boolean;
  delayMs?: number;
}

export function useAutoHideCursor({ enabled, delayMs = 5000 }: UseAutoHideCursorOptions) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number>();
  const lastMoveRef = useRef<number>(Date.now());

  const showCursor = useCallback(() => {
    if (!enabled) return;
    setVisible(true);
    lastMoveRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, delayMs);
  }, [enabled, delayMs]);

  const hideCursor = useCallback(() => {
    if (!enabled) return;
    setVisible(false);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    const handleMouseMove = () => {
      showCursor();
    };

    const handleMouseLeave = () => {
      hideCursor();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initial timeout
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, delayMs);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, delayMs, showCursor, hideCursor]);

  return { visible, showCursor, hideCursor };
}