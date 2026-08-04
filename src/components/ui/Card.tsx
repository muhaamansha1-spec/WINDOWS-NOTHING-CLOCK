import { motion } from 'framer-motion';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'card' | 'card-lg' | 'full';
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'card',
  className = '',
  ...props
}: CardProps) => {
  const variants = {
    default: 'card',
    hover: 'card card-hover',
    interactive: 'card-interactive',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const radii = {
    card: 'rounded-card',
    'card-lg': 'rounded-card-lg',
    full: 'rounded-full',
  };

  const Component = variant === 'interactive' ? motion.div : 'div';

  return (
    <Component
      className={`${variants[variant]} ${paddings[padding]} ${radii[radius]} ${className}`}
      whileTap={variant === 'interactive' ? { scale: 0.98 } : undefined}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

Card.displayName = 'Card';