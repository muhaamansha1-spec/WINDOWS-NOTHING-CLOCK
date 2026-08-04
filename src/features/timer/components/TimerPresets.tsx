import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon, Typography, Button } from '../../../components/ui';
import type { TimerPreset } from '../types';
import { TIMER_PRESETS } from '../types';

interface TimerPresetsProps {
  onSelect: (seconds: number) => void;
  disabled?: boolean;
}

export const TimerPresets = memo(function TimerPresets({ onSelect, disabled = false }: TimerPresetsProps) {
  const presetGroups = [
    TIMER_PRESETS.slice(0, 4),
    TIMER_PRESETS.slice(4, 8),
    TIMER_PRESETS.slice(8, 12),
  ];

  return (
    <div className="space-y-3" role="group" aria-label="Timer presets">
      {presetGroups.map((group, groupIndex) => (
        <motion.div
          key={groupIndex}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.05 }}
        >
          {group.map((preset) => (
            <motion.button
              key={preset.id}
              type="button"
              onClick={() => !disabled && onSelect(preset.seconds)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-lg font-mono text-xs transition-all duration-fast
                ${disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'}
              `}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              {preset.label}
            </motion.button>
          ))}
        </motion.div>
      ))}
    </div>
  );
});

TimerPresets.displayName = 'TimerPresets';