import { memo } from 'react';
import { motion } from 'framer-motion';
import { Typography, Icon } from '../../../components/ui';

interface BatteryProps {
  level: number;
  charging: boolean;
  supported: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const batterySizes = {
  sm: { width: 40, height: 20, radius: 4, terminal: 3 },
  md: { width: 48, height: 24, radius: 5, terminal: 4 },
  lg: { width: 60, height: 30, radius: 6, terminal: 5 },
};

export const Battery = memo(function Battery({ level, charging, supported, size = 'md' }: BatteryProps) {
  if (!supported) return null;

  const s = batterySizes[size];
  const clampedLevel = Math.max(0, Math.min(1, level));
  const fillWidth = Math.max(2, (s.width - 8) * clampedLevel);
  const isLow = clampedLevel <= 0.2 && !charging;

  return (
    <div className="flex items-center gap-3" role="img" aria-label={`Battery: ${Math.round(clampedLevel * 100)}%${charging ? ', charging' : ''}`}>
      <motion.svg
        width={s.width}
        height={s.height}
        viewBox={`0 0 ${s.width} ${s.height}`}
        fill="none"
        className="flex-shrink-0"
        animate={{
          opacity: charging ? [1, 0.5, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: charging ? Infinity : 0 }}
      >
        <rect
          x={0}
          y={0}
          width={s.width - s.terminal}
          height={s.height}
          rx={s.radius}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x={s.width - s.terminal}
          y={s.height / 2 - s.terminal / 2}
          width={s.terminal}
          height={s.terminal}
          rx={1}
          fill="currentColor"
        />
        <motion.rect
          x={4}
          y={4}
          width={fillWidth}
          height={s.height - 8}
          rx={Math.max(0, s.radius - 2)}
          fill={isLow ? '#EF4444' : charging ? '#22C55E' : 'currentColor'}
          initial={{ width: 0 }}
          animate={{ width: fillWidth }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {charging && (
          <motion.path
            d={`M${s.width / 2 - 3} ${s.height / 2 + 3} L${s.width / 2} ${s.height / 2 - 3} L${s.width / 2 + 3} ${s.height / 2 + 3}`}
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
        )}
      </motion.svg>
      <Typography variant="body-sm" className="font-mono tabular-nums text-text-secondary" style={{ minWidth: '3.5ch' }}>
        {Math.round(clampedLevel * 100)}%
      </Typography>
    </div>
  );
});

Battery.displayName = 'Battery';