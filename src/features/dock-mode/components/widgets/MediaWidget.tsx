import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon, Typography } from '../../../../components/ui';
import { useMediaSession } from '../../hooks/useMediaSession';

interface MediaWidgetProps {
  brightness?: number;
  burnInOffset?: { x: number; y: number };
}

export const MediaWidget = memo(function MediaWidget({
  brightness = 1,
  burnInOffset = { x: 0, y: 0 },
}: MediaWidgetProps) {
  const { info, loading, toggle, next, previous } = useMediaSession();
  const style = { opacity: brightness, transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)` };

  const isPlaying = info.status === 'playing';
  const hasTrack = info.hasSession && (info.title || info.artist);

  return (
    <motion.div
      style={style}
      className="w-full h-full flex flex-col items-center justify-center px-8 lg:px-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-white animate-pulse-dot' : 'bg-white/30'}`} />
        <Typography variant="overline" className="text-[11px] uppercase tracking-widest text-white/40 truncate">
          {info.appName || 'Windows Media'}
        </Typography>
      </div>

      <p className="mt-2 text-3xl lg:text-5xl font-light tracking-tight text-white truncate text-center">
        {info.title || (loading ? 'Loading…' : 'Nothing playing')}
      </p>

      <p className="text-lg lg:text-2xl font-light text-white/50 truncate text-center">
        {info.artist || (hasTrack ? '' : 'Open a music app to show the now playing track')}
      </p>

      <div className="mt-5 lg:mt-7 flex items-center justify-center gap-5 lg:gap-7">
        <motion.button
          onClick={() => void previous()}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          className="p-3 lg:p-4 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Previous track"
        >
          <Icon name="skip-back" size="lg" className="lg:w-8 lg:h-8" />
        </motion.button>

        <motion.button
          onClick={() => void toggle()}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className="p-5 lg:p-6 rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-colors hover:bg-white/90"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size="lg" className="lg:w-8 lg:h-8" />
        </motion.button>

        <motion.button
          onClick={() => void next()}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          className="p-3 lg:p-4 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Next track"
        >
          <Icon name="skip-forward" size="lg" className="lg:w-8 lg:h-8" />
        </motion.button>
      </div>
    </motion.div>
  );
});

MediaWidget.displayName = 'MediaWidget';
