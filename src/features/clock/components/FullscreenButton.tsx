import { useEffect, useRef, useState } from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Button, Icon, Typography } from '../../../components/ui';

interface FullscreenButtonProps {
  onToggle?: () => void;
}

export const FullscreenButton = memo(function FullscreenButton({ onToggle }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if fullscreen API is supported
    const doc = document as Document & { webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => Promise<void> };
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
    
    setIsSupported(!!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled));
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(doc.fullscreenElement || (doc as any).webkitFullscreenElement));
    };

    doc.addEventListener('fullscreenchange', handleFullscreenChange);
    doc.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      doc.removeEventListener('fullscreenchange', handleFullscreenChange);
      doc.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!isSupported) return;

    try {
      const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
      const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      
      if (isFullscreen) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } else {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen toggle failed:', error);
    }
    
    onToggle?.();
  };

  if (!isSupported) return null;

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleFullscreen}
      className="btn-ghost p-3 rounded-lg"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-pressed={isFullscreen}
    >
      <Icon name={isFullscreen ? 'restore' : 'maximize'} size="md" />
      <Typography variant="caption" className="hidden sm:inline font-mono">
        {isFullscreen ? 'Exit' : 'Fullscreen'}
      </Typography>
    </motion.button>
  );
});

FullscreenButton.displayName = 'FullscreenButton';