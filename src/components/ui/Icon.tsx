import { forwardRef, type SVGAttributes } from 'react';

interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
}

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const icons: Record<string, React.ReactNode> = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  ),
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  timer: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  alarm: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a63.876 63.876 0 006.212-5.792m-6.212 5.792c0 1.306.539 2.504 1.461 3.395M8.143 17.082a63.876 63.876 0 01-6.212-5.792m6.212 5.792c0 1.306-.539 2.504-1.461 3.395m12.424 0c0-2.261-1.078-4.357-2.822-5.648M18.36 2.163a48.864 48.864 0 00-4.287 4.88M10 6H6a2 2 0 00-2 2v8a2 2 0 002 2h4m14 0h-4m4 0a2 2 0 01-2 2v-8a2 2 0 012-2h4m-14 0a2 2 0 012-2h4m-4 0v8a2 2 0 002 2h4"
    />
  ),
  stopwatch: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v16m8-8H4m15.5-4.822a22.287 22.287 0 00-3.522-2.365A8.56 8.56 0 0012 1.5c-2.5 0-4.847.675-6.978 1.815a22.287 22.287 0 00-3.522 2.365m15.5 3.644a22.43 22.43 0 01-4.087 4.824A8.56 8.56 0 0112 22.5c-2.5 0-4.847-.675-6.978-1.815a22.43 22.43 0 01-4.087-4.824m8.174-21a1 1 0 00-1.414 0l-2.829 2.829a1 1 0 000 1.414l2.829 2.829a1 1 0 001.414 0l2.829-2.829a1 1 0 000-1.414l-2.829-2.829zM6.343 17.657a1 1 0 000 1.414l2.829 2.829a1 1 0 001.414 0l2.829-2.829a1 1 0 00-1.414-1.414l-2.829-2.829a1 1 0 00-1.414 0z"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
  ),
  chevronRight: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  ),
  chevronLeft: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  ),
  chevronDown: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  ),
  chevronUp: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  ),
  minimize: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  ),
  maximize: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1z" />
  ),
  restore: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  ),
  sun: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  ),
  moon: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  ),
  monitor: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
  palette: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a4 4 0 118 0 4 4 0 01-8 0z" />
  ),
  keyboard: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
  ),
  globe: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  ),
  info: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  check: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  ),
  x: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  ),
  menu: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  ),
  dots: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </>
  ),
  toggleLeft: (
    <>
      <rect x="1" y="5" width="22" height="14" rx="7" />
      <circle cx="8" cy="12" r="3" />
    </>
  ),
  toggleRight: (
    <>
      <rect x="1" y="5" width="22" height="14" rx="7" />
      <circle cx="16" cy="12" r="3" />
    </>
  ),
  dot: (
    <circle cx="12" cy="12" r="3" />
  ),
  plus: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  ),
  volume2: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 10M11 5l5 5M11 5l5-5M18.5 12a5.5 5.5 0 010 11M18.5 12a5.5 5.5 0 010-11" />
  ),
  play: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
  ),
  pause: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  ),
  'skip-back': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 20-10-8 10-8v16z" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </>
  ),
  'skip-forward': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 4 10 8-10 8V4z" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </>
  ),
  repeat: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14" />
  ),
  'refresh-cw': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  ),
  flag: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 22h16" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
    </>
  ),
  music: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  cloud: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  ),
  'cloud-sun': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.93 4.93 1.41 1.41" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.07 4.93-1.41 1.41" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </>
  ),
  'cloud-rain': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 19v3" />
    </>
  ),
  'cloud-snow': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 20h.01" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
    </>
  ),
  'battery-charging': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m11 7-3 5h4l-3 5" />
      <line x1="22" x2="22" y1="11" y2="13" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  cpu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </>
  ),
  memory: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 2v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 20v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 15h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 9h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 15h2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', strokeWidth = 1.5, className = '', ...props }, ref) => {
    const iconPath = icons[name];

    if (!iconPath) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    return (
      <svg
        ref={ref}
        className={`${sizes[size]} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {iconPath}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';