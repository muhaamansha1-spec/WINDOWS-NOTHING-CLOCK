import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { WidgetRenderer } from './WidgetRenderer';
import type { WidgetId, DockSettings } from '../types';

interface DockLayoutProps {
  enabledWidgets: Array<[WidgetId, any]>;
  widgetData: any;
  brightness: number;
  burnInOffset: { x: number; y: number };
  settings: DockSettings;
}

export const DockLayout = memo(function DockLayout({
  enabledWidgets,
  widgetData,
  brightness,
  burnInOffset,
  settings,
}: DockLayoutProps) {
  const gridCols = useMemo(() => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 1024) return 2;
    if (width < 1440) return 3;
    if (width < 1920) return 4;
    return 5;
  }, []);

  // Group widgets by row based on their position
  const rows = useMemo(() => {
    const rowMap = new Map<number, Array<[WidgetId, any]>>();
    
    enabledWidgets.forEach(([id, config]) => {
      const y = config.position.y;
      if (!rowMap.has(y)) {
        rowMap.set(y, []);
      }
      rowMap.get(y)!.push([id, config]);
    });

    // Sort rows by y position
    return Array.from(rowMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, widgets]) => widgets.sort((a, b) => a[1].position.x - b[1].position.x));
  }, [enabledWidgets]);

  return (
    <motion.div
      className="w-full px-8 lg:px-16 py-8 lg:py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-6 lg:space-y-8">
        {rows.map((rowWidgets, rowIndex) => (
          <motion.div
            key={rowIndex}
            className={`grid gap-4 lg:gap-6 ${gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : gridCols === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + rowIndex * 0.05 }}
          >
            {rowWidgets.map(([id, config]) => (
              <WidgetRenderer
                key={id}
                id={id}
                config={config}
                data={widgetData}
                brightness={brightness}
                burnInOffset={burnInOffset}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

DockLayout.displayName = 'DockLayout';