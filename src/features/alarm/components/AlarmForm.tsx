import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Toggle, Select, Input, Icon, Typography, Separator, Badge } from '../../../components/ui';
import type { Alarm, AlarmFormData, DayOfWeek } from '../types';
import { DAYS_OF_WEEK, ALARM_SOUNDS, defaultAlarmFormData } from '../types';

interface AlarmFormProps {
  alarm?: Alarm | null;
  onSubmit: (data: AlarmFormData) => void;
  onCancel: () => void;
  onTestSound: (sound: string, volume: number) => void;
  isSubmitting?: boolean;
}

export const AlarmForm = memo(function AlarmForm({
  alarm,
  onSubmit,
  onCancel,
  onTestSound,
  isSubmitting = false,
}: AlarmFormProps) {
  const isEditing = !!alarm;
  const [formData, setFormData] = useState<AlarmFormData>(() => {
    if (alarm) {
      return {
        time: alarm.time,
        label: alarm.label,
        repeatDays: [...alarm.repeatDays],
        sound: alarm.sound,
        volume: alarm.volume,
      };
    }
    return defaultAlarmFormData;
  });
  const [testingSound, setTestingSound] = useState<string | null>(null);

  useEffect(() => {
    if (alarm) {
      setFormData({
        time: alarm.time,
        label: alarm.label,
        repeatDays: [...alarm.repeatDays],
        sound: alarm.sound,
        volume: alarm.volume,
      });
    }
  }, [alarm]);

  const handleChange = useCallback(<K extends keyof AlarmFormData>(key: K, value: AlarmFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleDay = useCallback((day: DayOfWeek) => {
    setFormData(prev => ({
      ...prev,
      repeatDays: prev.repeatDays.includes(day)
        ? prev.repeatDays.filter(d => d !== day)
        : [...prev.repeatDays, day],
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTestSound = (soundId: string) => {
    const volume = formData.volume;
    setTestingSound(soundId);
    onTestSound(soundId, volume);
    setTimeout(() => setTestingSound(null), 1000);
  };

  const quickDaySets = [
    { label: 'Weekdays', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as DayOfWeek[] },
    { label: 'Weekends', days: ['saturday', 'sunday'] as DayOfWeek[] },
    { label: 'Daily', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[] },
    { label: 'Clear', days: [] as DayOfWeek[] },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alarm-form-title"
      >
        <motion.div
          className="relative w-full max-w-md bg-bg-primary border border-border-primary rounded-card-lg shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-6 border-b border-border-primary">
              <Typography id="alarm-form-title" variant="display-sm" weight="light">
                {isEditing ? 'Edit Alarm' : 'New Alarm'}
              </Typography>
              <motion.button
                onClick={onCancel}
                className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Close form"
                type="button"
              >
                <Icon name="x" size="md" />
              </motion.button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="alarm-time" className="label">Time</label>
                <Input
                  id="alarm-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="font-mono text-lg"
                  required
                />
              </div>

              <Input
                label="Label"
                id="alarm-label"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Alarm"
                maxLength={30}
              />

              <Separator />

              <div>
                <Typography variant="overline" className="text-text-secondary mb-3">Repeat</Typography>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickDaySets.map((set, i) => (
                    <motion.button
                      key={set.label}
                      type="button"
                      onClick={() => handleChange('repeatDays', set.days)}
                      className={`px-3 py-1.5 rounded-pill text-xs font-mono transition-colors duration-fast ${
                        formData.repeatDays.length === set.days.length && 
                        set.days.every(d => formData.repeatDays.includes(d))
                          ? 'bg-white text-black'
                          : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card-hover'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {set.label}
                    </motion.button>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label
                      key={day.key}
                      className="flex flex-col items-center gap-1.5 cursor-pointer p-3 rounded-lg bg-bg-tertiary hover:bg-bg-card-hover transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.repeatDays.includes(day.key)}
                        onChange={() => toggleDay(day.key)}
                        className="sr-only"
                      />
                      <span className={formData.repeatDays.includes(day.key) ? 'text-text-primary font-medium' : 'text-text-tertiary'}>
                        {day.short}
                      </span>
                      <motion.div
                        className="w-2 h-2 rounded-full transition-colors"
                        animate={{
                          backgroundColor: formData.repeatDays.includes(day.key) ? '#FFFFFF' : '#262626',
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Typography variant="overline" className="text-text-secondary mb-3">Sound</Typography>
                <div className="space-y-2">
                  {ALARM_SOUNDS.map((sound) => (
                    <motion.button
                      key={sound.id}
                      type="button"
                      onClick={() => handleTestSound(sound.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-fast ${
                        formData.sound === sound.id
                          ? 'border-white bg-bg-card'
                          : 'border-border-primary bg-bg-tertiary hover:bg-bg-card-hover'
                      }`}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="font-mono text-sm">{sound.name}</span>
                      <motion.button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleTestSound(sound.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          testingSound === sound.id
                            ? 'bg-white/20 text-white'
                            : 'text-text-tertiary hover:text-text-primary hover:bg-bg-card'
                        }`}
                        whileTap={{ scale: 0.9 }}
                        aria-label={testingSound === sound.id ? 'Stop' : `Test ${sound.name}`}
                      >
                        <Icon name={testingSound === sound.id ? 'x' : 'volume2'} size="sm" className={testingSound === sound.id ? 'animate-spin' : ''} />
                      </motion.button>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="overline" className="text-text-secondary">Volume</Typography>
                  <Typography variant="caption" className="font-mono text-text-tertiary">
                    {Math.round(formData.volume * 100)}%
                  </Typography>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.volume}
                  onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                  className="w-full accent-white h-2"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border-primary flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="flex-1"
              >
                {isEditing ? 'Save Changes' : 'Create Alarm'}
              </Button>
            </div>
          </form>
        </motion.div>
        
        <AnimatePresence>
          {testingSound && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCancel}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
});

AlarmForm.displayName = 'AlarmForm';