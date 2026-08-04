import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input, Icon, Typography } from '../../../components/ui';

interface TimerInputProps {
  hours: string;
  minutes: string;
  seconds: string;
  onChange: (field: 'hours' | 'minutes' | 'seconds', value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const TimerInput = memo(function TimerInput({ 
  hours, 
  minutes, 
  seconds, 
  onChange, 
  disabled = false,
  error 
}: TimerInputProps) {
  const [focused, setFocused] = useState<'hours' | 'minutes' | 'seconds' | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, field: 'hours' | 'minutes' | 'seconds') => {
    if (e.key === 'ArrowRight' || e.key === 'Tab') {
      e.preventDefault();
      const next = field === 'hours' ? 'minutes' : field === 'minutes' ? 'seconds' : null;
      if (next) {
        const input = document.getElementById(`timer-${next}`);
        input?.focus();
      }
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = field === 'seconds' ? 'minutes' : field === 'minutes' ? 'hours' : null;
      if (prev) {
        const input = document.getElementById(`timer-${prev}`);
        input?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label="Timer input">
      <div className="relative">
        <Input
          id="timer-hours"
          type="number"
          min="0"
          max="99"
          value={hours}
          onChange={(e) => onChange('hours', e.target.value)}
          onFocus={() => setFocused('hours')}
          onBlur={() => setFocused(null)}
          onKeyDown={(e) => handleKeyDown(e, 'hours')}
          disabled={disabled}
          className="w-20 text-center font-mono text-3xl lg:text-4xl py-2 px-0 bg-transparent border-0 focus:ring-0 focus:border-transparent text-text-primary placeholder:text-text-tertiary"
          placeholder="00"
          aria-label="Hours"
        />
        <Typography variant="caption" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-text-tertiary font-mono">H</Typography>
      </div>

      <motion.span
        className="font-mono text-3xl lg:text-4xl text-text-secondary"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        aria-hidden="true"
      >
        :
      </motion.span>

      <div className="relative">
        <Input
          id="timer-minutes"
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => onChange('minutes', e.target.value)}
          onFocus={() => setFocused('minutes')}
          onBlur={() => setFocused(null)}
          onKeyDown={(e) => handleKeyDown(e, 'minutes')}
          disabled={disabled}
          className="w-20 text-center font-mono text-3xl lg:text-4xl py-2 px-0 bg-transparent border-0 focus:ring-0 focus:border-transparent text-text-primary placeholder:text-text-tertiary"
          placeholder="00"
          aria-label="Minutes"
        />
        <Typography variant="caption" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-text-tertiary font-mono">M</Typography>
      </div>

      <motion.span
        className="font-mono text-3xl lg:text-4xl text-text-secondary"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        aria-hidden="true"
      >
        :
      </motion.span>

      <div className="relative">
        <Input
          id="timer-seconds"
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => onChange('seconds', e.target.value)}
          onFocus={() => setFocused('seconds')}
          onBlur={() => setFocused(null)}
          onKeyDown={(e) => handleKeyDown(e, 'seconds')}
          disabled={disabled}
          className="w-20 text-center font-mono text-3xl lg:text-4xl py-2 px-0 bg-transparent border-0 focus:ring-0 focus:border-transparent text-text-primary placeholder:text-text-tertiary"
          placeholder="00"
          aria-label="Seconds"
        />
        <Typography variant="caption" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-text-tertiary font-mono">S</Typography>
      </div>

      {error && (
        <motion.p className="text-red-400 text-sm font-mono mt-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}
    </div>
  );
});

TimerInput.displayName = 'TimerInput';