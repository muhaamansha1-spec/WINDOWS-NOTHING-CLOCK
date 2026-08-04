import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface WindowState {
  isMaximized: boolean;
}

interface Theme {
  theme: 'dark' | 'light' | 'system';
}

interface MediaInfo {
  hasSession: boolean;
  title: string;
  artist: string;
  appName: string;
  status: 'playing' | 'paused' | 'stopped' | 'closed' | 'opened' | 'changing' | 'none';
}

const electronAPI = {
  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke('window-minimize'),
    maximize: (): Promise<void> => ipcRenderer.invoke('window-maximize'),
    close: (): Promise<void> => ipcRenderer.invoke('window-close'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window-is-maximized'),
    onStateChanged: (callback: (state: WindowState) => void): (() => void) => {
      const listener = (_event: IpcRendererEvent, state: WindowState) => callback(state);
      ipcRenderer.on('window-state-changed', listener);
      return () => ipcRenderer.removeListener('window-state-changed', listener);
    },
  },
  theme: {
    get: (): Promise<'dark' | 'light'> => ipcRenderer.invoke('get-theme'),
    set: (theme: 'dark' | 'light' | 'system'): Promise<void> => ipcRenderer.invoke('set-theme', theme),
    getSystem: (): Promise<'dark' | 'light' | 'system'> => ipcRenderer.invoke('get-system-theme'),
  },
  fonts: {
    list: (): Promise<string[]> => ipcRenderer.invoke('fonts-list'),
  },
  media: {
    getInfo: (): Promise<MediaInfo> => ipcRenderer.invoke('media:get-info'),
    command: (op: 'play' | 'pause' | 'playpause' | 'next' | 'prev'): Promise<boolean> => ipcRenderer.invoke('media:command', op),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}