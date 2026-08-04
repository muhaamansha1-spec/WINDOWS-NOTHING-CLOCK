import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Toggle, Icon, Typography, Badge } from '../../../components/ui';
import type { Alarm } from '../types';
import { formatAlarmTime, formatRepeatDays } from '../types';

interface AlarmCardProps {
  alarm: Alarm;
  timeFormat: '12h' | '24h';
  onToggle: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onTestSound: (sound: string, volume: number) => void;
}

export const AlarmCard = memo(function AlarmCard({
  alarm,
  timeFormat,
  onToggle,
  onEdit,
  onDelete,
  onTestSound,
}: AlarmCardProps) {
  return (
    <motion.div
      key={alarm.id}
      className="w-full"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="hover" padding="md" className="relative group">
        <div className="flex items-start justify-between gap-4">
          <motion.button
            onClick={() => onEdit(alarm)}
            className="flex-1 flex items-center gap-4 pr-4 text-left"
            whileTap={{ scale: 0.99 }}
            aria-label={`Edit alarm ${alarm.label}`}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-bg-tertiary flex-shrink-0">
              <Icon name={alarm.enabled ? 'alarm' : 'clock'} size="lg" className={alarm.enabled ? 'text-text-primary' : 'text-text-tertiary'} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.span
                  className="font-mono tabular-nums text-text-primary"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                >
                  {formatAlarmTime(alarm.time, timeFormat)}
                </motion.span>
                <motion.span
                  className="font-mono text-text-tertiary text-sm px-2 py-0.5 rounded-full bg-border-primary"
                >
                  {alarm.enabled ? 'ON' : 'OFF'}
                </motion.span>
              </div>
              <Typography variant="body-sm" className="text-text-primary truncate mt-1" style={{ maxWidth: '100%' }}>
                {alarm.label}
              </Typography>
              <Typography variant="caption" className="text-text-tertiary font-mono mt-0.5">
                {formatRepeatDays(alarm.repeatDays)}
              </Typography>
            </div>
          </motion.button>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              onClick={() => onTestSound(alarm.sound, alarm.volume)}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              aria-label="Test alarm sound"
            >
              <Icon name="volume2" size="md" />
            </motion.button>

            <Toggle
              checked={alarm.enabled}
              onChange={() => onToggle(alarm.id)}
              size="md"
              className="ml-2"
            />

            <motion.button
              onClick={() => onDelete(alarm.id)}
              className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-600/20 transition-colors duration-fast opacity-0 group-hover:opacity-100"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              aria-label="Delete alarm"
            >
              <Icon name="x" size="md" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

AlarmCard.displayName = 'AlarmCard';