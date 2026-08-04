import { useState, useCallback, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Button, Icon, Badge } from '../components/ui';
import { AlarmList, AlarmForm } from '../features/alarm/components';
import { useAlarms, requestNotificationPermission } from '../features/alarm/hooks/useAlarms';
import type { Alarm, AlarmFormData } from '../features/alarm/types';
import { formatAlarmTime, formatRepeatDays, getNextAlarmTime } from '../features/alarm/types';
import type { ScreenProps } from '../components/layout/types';
import type { Settings } from '../features/settings/types';

interface AlarmScreenProps extends ScreenProps {
  settings: Settings;
  className?: string;
}

export const AlarmScreen = memo(function AlarmScreen({ settings, className = '' }: AlarmScreenProps) {
  const {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getNextAlarms,
    sounds,
    playTestSound,
  } = useAlarms();

  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nextAlarms, setNextAlarms] = useState<{ alarm: Alarm; nextTime: Date }[]>([]);

  useEffect(() => {
    requestNotificationPermission();
    updateNextAlarms();
    const interval = setInterval(updateNextAlarms, 60000);
    return () => clearInterval(interval);
  }, [alarms]);

  const updateNextAlarms = useCallback(() => {
    setNextAlarms(getNextAlarms().filter((n): n is { alarm: Alarm; nextTime: Date } => n.nextTime !== null));
  }, [getNextAlarms]);

  const handleAddAlarm = useCallback(() => {
    setEditingAlarm(null);
    setIsFormOpen(true);
  }, []);

  const handleEditAlarm = useCallback((alarm: Alarm) => {
    setEditingAlarm(alarm);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData: AlarmFormData) => {
    setIsFormSubmitting(true);
    try {
      if (editingAlarm) {
        updateAlarm(editingAlarm.id, formData);
      } else {
        addAlarm(formData);
      }
    } finally {
      setIsFormSubmitting(false);
      setEditingAlarm(null);
      setIsFormOpen(false);
    }
  }, [editingAlarm, addAlarm, updateAlarm]);

  const handleDeleteAlarm = useCallback((id: string) => {
    deleteAlarm(id);
  }, [deleteAlarm]);

  const handleToggleAlarm = useCallback((id: string) => {
    toggleAlarm(id);
  }, [toggleAlarm]);

  const handleTestSound = useCallback((sound: string, volume: number) => {
    playTestSound(sound as any, volume);
  }, [playTestSound]);

  const enabledCount = alarms.filter((a: Alarm) => a.enabled).length;

  return (
    <motion.main
      className={`flex-1 flex flex-col overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex-1 flex flex-col h-full">
        <motion.div
          className="px-6 py-6 border-b border-border-primary flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-primary flex items-center justify-center">
                <Icon name="alarm" size="md" className="text-text-secondary" />
              </div>
              <div>
                <Typography variant="display-sm" weight="extralight">
                  Alarms
                </Typography>
                <Typography variant="caption" className="font-mono">
                  {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} • {enabledCount} enabled
                </Typography>
              </div>
            </div>
            <motion.button
              onClick={handleAddAlarm}
              className="btn-primary"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              <Icon name="plus" size="sm" />
              <span>New Alarm</span>
            </motion.button>
          </div>

          {nextAlarms.length > 0 && (
            <motion.div
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {nextAlarms.slice(0, 3).map(({ alarm, nextTime }) => (
                <Card key={alarm.id} padding="sm" variant="hover" className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                    <Icon name="clock" size="sm" className="text-text-tertiary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography variant="body-sm" className="text-text-primary font-mono tabular-nums">
                      {formatAlarmTime(alarm.time, settings.clock.timeFormat)}
                    </Typography>
                    <Typography variant="caption" className="text-text-tertiary truncate">
                      {alarm.label} • {formatRepeatDays(alarm.repeatDays)}
                    </Typography>
                  </div>
                  <Typography variant="caption" className="text-text-tertiary font-mono whitespace-nowrap">
                    {nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Card>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="flex-1 overflow-y-auto px-6 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AlarmList
            alarms={alarms}
            timeFormat={settings.clock.timeFormat}
            onToggle={handleToggleAlarm}
            onEdit={handleEditAlarm}
            onDelete={handleDeleteAlarm}
            onTestSound={handleTestSound}
          />
        </motion.div>
      </div>

      {isFormOpen && (
        <AlarmForm
          alarm={editingAlarm}
          onSubmit={handleFormSubmit}
          onCancel={() => { setEditingAlarm(null); setIsFormOpen(false); }}
          onTestSound={handleTestSound}
          isSubmitting={isFormSubmitting}
        />
      )}
    </motion.main>
  );
});

AlarmScreen.displayName = 'AlarmScreen';