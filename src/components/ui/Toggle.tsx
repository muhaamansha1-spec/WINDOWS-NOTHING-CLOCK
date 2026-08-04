import { forwardRef, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { track: 'w-8 h-5', thumb: 'w-4 h-4', translate: 'translate-x-3' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, size = 'md', className = '', id, checked, onChange, disabled, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const s = sizes[size];

    return (
      <label className={`inline-flex items-start cursor-pointer ${className}`} htmlFor={toggleId}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={`
              relative ${s.track} rounded-full transition-colors duration-normal ease-out-expo
              peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black
              peer-disabled:opacity-40 peer-disabled:cursor-not-allowed
              ${checked ? 'bg-white' : 'bg-border-primary'}
            `}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: checked ? '#FFFFFF' : '#262626',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.span
              className={`
                absolute top-0.5 left-0.5 ${s.thumb} rounded-full bg-black transition-transform duration-normal ease-spring
                ${checked ? s.translate : 'translate-x-0'}
              `}
              animate={{ x: checked ? parseInt(s.translate.replace('translate-x-', '')) * 4 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className="block text-sm font-medium text-text-primary">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-sm text-text-tertiary font-mono mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';