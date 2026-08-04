import { motion } from 'framer-motion';
import { Icon } from '../ui';
import { Typography } from '../ui';
import { useWindowControls } from '../../hooks/useWindowControls';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function Header({
  title,
  subtitle,
  actions,
  onMenuClick,
  showMenu = true,
}: HeaderProps) {
  const { isMaximized, minimize, maximize, close } = useWindowControls();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary flex items-center justify-between px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {showMenu && onMenuClick && (
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Toggle menu"
          >
            <Icon name="menu" size="md" />
          </motion.button>
        )}
        <div>
          <Typography variant="display-sm" weight="extralight" className="truncate">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" className="mt-0.5 truncate max-w-xs">
              {subtitle}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {actions}
        <div className="flex items-center gap-1 ml-4">
          <motion.button
            onClick={minimize}
            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Minimize"
          >
            <Icon name="minimize" size="sm" />
          </motion.button>
          <motion.button
            onClick={maximize}
            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Icon name={isMaximized ? 'restore' : 'maximize'} size="sm" />
          </motion.button>
          <motion.button
            onClick={close}
            className="w-8 h-8 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-600/20 transition-colors duration-fast flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Close"
          >
            <Icon name="close" size="sm" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}