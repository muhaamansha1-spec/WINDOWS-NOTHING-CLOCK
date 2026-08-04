import { forwardRef, type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  dotColor?: 'white' | 'red' | 'green' | 'blue' | 'yellow';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', dotColor = 'white', className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-border-secondary text-text-secondary',
      outline: 'bg-transparent border border-border-primary text-text-secondary',
      dot: 'relative pl-6',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-mono rounded-pill
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {variant === 'dot' && (
          <span
            className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: dotColor === 'white' ? '#FFFFFF' :
                dotColor === 'red' ? '#EF4444' :
                dotColor === 'green' ? '#22C55E' :
                dotColor === 'blue' ? '#3B82F6' : '#EAB308',
            }}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';