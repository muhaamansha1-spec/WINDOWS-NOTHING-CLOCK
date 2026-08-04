import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon, Typography, Badge, Button } from '../../../components/ui';
import { AlarmCard } from './AlarmCard';
import type { Alarm } from '../types';

interface AlarmListProps {
  alarms: Alarm[];
  timeFormat: '12h' | '24h';
  onToggle: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onTestSound: (sound: string, volume: number) => void;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const AlarmList = memo(function AlarmList({
  alarms,
  timeFormat,
  onToggle,
  onEdit,
  onDelete,
  onTestSound,
  isEmpty = false,
  emptyMessage = 'No alarms set. Tap + to create one.',
}: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <motion.div
        className="w-full flex flex-col items-center justify-center py-16 px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-20 h-20 rounded-card bg-bg-card border border-border-primary flex items-center justify-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        >
          <Icon name="alarm" size="xl" className="text-text-tertiary" />
        </motion.div>
        <Typography variant="display-sm" weight="extralight" className="mb-2">
          No Alarms
        </Typography>
        <Typography variant="body" className="text-text-secondary max-w-sm mx-auto mb-6">
          {emptyMessage}
        </Typography>
        <Badge variant="dot" dotColor="green" size="md">
          Alarms work even when app is closed
        </Badge>
      </motion.div>
    );
  }

  const enabledAlarms = alarms.filter(a => a.enabled);
  const disabledAlarms = alarms.filter(a => !a.enabled);

  return (
    <div className="w-full space-y-6">
      {enabledAlarms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Typography variant="overline" className="text-text-secondary">Enabled ({enabledAlarms.length})</Typography>
            <Badge variant="dot" dotColor="green" size="sm">ON</Badge>
          </div>
          <div className="space-y-3">
            {enabledAlarms.map((alarm, index) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                timeFormat={timeFormat}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onTestSound={onTestSound}
              />
            ))}
          </div>
        </motion.div>
      )}

      {disabledAlarms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Typography variant="overline" className="text-text-secondary">Disabled ({disabledAlarms.length})</Typography>
            <Badge variant="outline" size="sm">OFF</Badge>
          </div>
          <div className="space-y-3">
            {disabledAlarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                timeFormat={timeFormat}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onTestSound={onTestSound}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});

AlarmList.displayName = 'AlarmList';