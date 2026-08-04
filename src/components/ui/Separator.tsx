import { forwardRef, type HTMLAttributes } from 'react';

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', className = '', ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={`
          border-none bg-border-primary
          ${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';