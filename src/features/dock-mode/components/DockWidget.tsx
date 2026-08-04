import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon } from '../../../components/ui';
import type { WidgetId, WidgetConfig } from '../types';

interface DockWidgetProps {
  config: WidgetConfig;
  children: React.ReactNode;
  brightness: number;
  burnInOffset: { x: number; y: number };
}

const SIZE_CLASSES = {
  small: 'p-4 min-w-[160px]',
  medium: 'p-6 min-w-[280px]',
  large: 'p-8 min-w-[400px]',
};

export const DockWidget = memo(function DockWidget({
  config,
  children,
  brightness,
  burnInOffset,
}: DockWidgetProps) {
  const style = {
    opacity: brightness,
    transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)`,
  };

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card 
        variant="hover" 
        padding="none" 
        className={`${SIZE_CLASSES[config.size]} bg-bg-tertiary/50 border-border-primary/50 backdrop-blur-sm`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon name={config.icon} size="md" className="text-white/60" />
              </div>
              <Typography variant="body-sm" className="font-mono text-white/60 uppercase tracking-wider">
                {config.label}
              </Typography>
            </div>
          </div>
          {children}
        </div>
      </Card>
    </motion.div>
  );
});

DockWidget.displayName = 'DockWidget';