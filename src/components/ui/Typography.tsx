import { forwardRef, type HTMLAttributes, type ReactNode, createElement } from 'react';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'clock-3xl' | 'clock-2xl' | 'clock-xl' | 'clock-lg' | 'clock-base' | 'clock-sm' | 'clock-xs' | 'body-lg' | 'body' | 'body-sm' | 'body-md' | 'caption' | 'overline';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  mono?: boolean;
  dot?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
  align?: 'left' | 'center' | 'right';
  as?: keyof JSX.IntrinsicElements;
  tabularNums?: boolean;
}

const variantClasses = {
  'display-xl': 'text-display-xl font-extralight tracking-tight',
  'display-lg': 'text-display-lg font-extralight tracking-tight',
  'display-md': 'text-display-md font-extralight tracking-tight',
  'display-sm': 'text-display-sm font-light tracking-tight',
  'clock-3xl': 'text-clock-3xl font-thin tabular-nums font-mono',
  'clock-2xl': 'text-clock-2xl font-thin tabular-nums font-mono',
  'clock-xl': 'text-clock-xl font-thin tabular-nums font-mono',
  'clock-lg': 'text-clock-lg font-light tabular-nums font-mono',
  'clock-base': 'text-clock-base font-light tabular-nums font-mono',
  'clock-sm': 'text-clock-sm font-light tabular-nums font-mono',
  'clock-xs': 'text-clock-xs font-light tabular-nums font-mono',
  'body-lg': 'text-lg leading-relaxed',
  'body': 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-normal',
  'body-md': 'text-base leading-relaxed',
  'caption': 'text-xs leading-normal',
  'overline': 'text-xs uppercase tracking-widest font-mono',
};

const weightClasses = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  disabled: 'text-text-disabled',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({
    children,
    variant = 'body',
    weight,
    mono = false,
    dot = false,
    color = 'primary',
    align = 'left',
    className = '',
    as: Component = 'p',
    tabularNums,
    ...props
  }, ref) => {
    const classNameStr = `${variantClasses[variant]} ${weight ? weightClasses[weight] : ''} ${mono ? 'font-mono' : ''} ${dot ? 'font-dot' : ''} ${colorClasses[color]} ${alignClasses[align]} ${tabularNums ? 'tabular-nums' : ''} ${className}`;
    return createElement(Component, { ref, className: classNameStr, ...props }, children);
  }
);

Typography.displayName = 'Typography';

export const Display = ({ children, size = 'md', ...props }: { children: ReactNode; size?: 'xl' | 'lg' | 'md' | 'sm'; } & TypographyProps) => (
  <Typography variant={`display-${size}`} weight="extralight" {...props}>{children}</Typography>
);

export const Clock = ({ children, size = '2xl', ...props }: { children: ReactNode; size?: '3xl' | '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'; } & TypographyProps) => (
  <Typography variant={`clock-${size}`} weight="thin" mono tabularNums {...props}>{children}</Typography>
);

export const Body = ({ children, size = 'md', ...props }: { children: ReactNode; size?: 'lg' | 'md' | 'sm'; } & TypographyProps) => (
  <Typography variant={`body-${size}`} {...props}>{children}</Typography>
);

export const Caption = ({ children, ...props }: { children: ReactNode } & TypographyProps) => (
  <Typography variant="caption" color="tertiary" {...props}>{children}</Typography>
);

export const Overline = ({ children, ...props }: { children: ReactNode } & TypographyProps) => (
  <Typography variant="overline" color="secondary" {...props}>{children}</Typography>
);