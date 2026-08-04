/// <reference types="vite/client" />
/// <reference types="electron" />

declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

// Extend CSSStyleDeclaration for custom properties
interface CSSStyleDeclaration {
  WebkitAppRegion?: string;
}

// Battery Status API
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: 'chargingchange' | 'levelchange', listener: (this: BatteryManager, ev: Event) => any): void;
  removeEventListener(type: 'chargingchange' | 'levelchange', listener: (this: BatteryManager, ev: Event) => any): void;
}

interface Navigator {
  getBattery(): Promise<BatteryManager>;
}

// Fullscreen API extensions
interface Document {
  fullscreenEnabled: boolean;
  exitFullscreen(): Promise<void>;
  webkitFullscreenEnabled: boolean;
  webkitExitFullscreen(): Promise<void>;
}

interface Element {
  requestFullscreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
}