export interface ElectronAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
    onStateChanged: (callback: (state: { isMaximized: boolean }) => void) => () => void;
  };
  theme: {
    get: () => Promise<'dark' | 'light'>;
    set: (theme: 'dark' | 'light' | 'system') => Promise<void>;
    getSystem: () => Promise<'dark' | 'light' | 'system'>;
  };
  fonts: {
    list: () => Promise<string[]>;
  };
  media: {
    getInfo: () => Promise<MediaInfo>;
    command: (op: 'play' | 'pause' | 'playpause' | 'next' | 'prev') => Promise<boolean>;
  };
}

export interface MediaInfo {
  hasSession: boolean;
  title: string;
  artist: string;
  appName: string;
  status: 'playing' | 'paused' | 'stopped' | 'closed' | 'opened' | 'changing' | 'none';
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}