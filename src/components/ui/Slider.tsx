import { forwardRef, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, min = 0, max = 1, step = 0.01, showValue = true, className = '', id, ...props }, ref) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={className}>
        {label && (
          <label htmlFor={sliderId} className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            className={`
              w-full h-2 bg-border-primary rounded-full appearance-none cursor-pointer
              accent-white
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
            {...props}
          />
          {showValue && (
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-bg-card border border-border-primary text-xs font-mono text-text-secondary whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {props.value}
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';