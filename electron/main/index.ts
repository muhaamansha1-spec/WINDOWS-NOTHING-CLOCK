import { app, BrowserWindow, ipcMain, nativeTheme, screen } from 'electron';
import { execFile } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import * as path from 'path';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

let mainWindow: BrowserWindow | null = null;
let windowState: WindowState = {
  width: 400,
  height: 500,
  isMaximized: false,
};

function createWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const x = windowState.x ?? Math.round((screenWidth - windowState.width) / 2);
  const y = windowState.y ?? Math.round((screenHeight - windowState.height) / 2);

  mainWindow = new BrowserWindow({
    x,
    y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 320,
    minHeight: 400,
    show: false,
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    vibrancy: 'mica' as any,
    backgroundMaterial: 'mica' as any,
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  mainWindow.on('close', () => {
    saveWindowState();
  });

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-state-changed', { isMaximized: true });
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-state-changed', { isMaximized: false });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function saveWindowState(): void {
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    windowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: mainWindow.isMaximized(),
    };
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() ?? false;
});

ipcMain.handle('get-theme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

ipcMain.on('set-theme', (_event, theme: 'dark' | 'light' | 'system') => {
  if (theme === 'system') {
    nativeTheme.themeSource = 'system';
  } else {
    nativeTheme.themeSource = theme;
  }
});

ipcMain.handle('get-system-theme', () => {
  return nativeTheme.themeSource;
});

// --- Installed fonts ---

let cachedFonts: string[] | null = null;

const FONT_SUFFIXES = [
  ' (TrueType)',
  ' (OpenType)',
  ' (All Res)',
  ' (Mono Truetype)',
  ' (SimSun)',
];

function cleanFontFamily(name: string): string {
  let family = name.trim();
  const suffix = FONT_SUFFIXES.find(s => family.endsWith(s));
  if (suffix) {
    family = family.slice(0, -suffix.length).trim();
  }
  return family;
}

async function queryRegistryFonts(keyPath: string): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync('reg.exe', ['query', keyPath]);
    const families: string[] = [];
    for (const line of stdout.split(/\r?\n/)) {
      const match = line.match(/^\s*(\S.*?)\s+REG_SZ\s+\S.*$/);
      if (!match) continue;
      const family = cleanFontFamily(match[1]);
      if (family) families.push(family);
    }
    return families;
  } catch {
    return [];
  }
}

async function listInstalledFonts(): Promise<string[]> {
  if (cachedFonts) return cachedFonts;

  const [userFonts, machineFonts] = await Promise.all([
    queryRegistryFonts('HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'),
    queryRegistryFonts('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'),
  ]);

  cachedFonts = Array.from(new Set([...userFonts, ...machineFonts]))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  return cachedFonts;
}

ipcMain.handle('fonts-list', () => listInstalledFonts());

// --- Windows media session (GlobalSystemMediaTransportControlsSession) ---

export interface MediaInfo {
  hasSession: boolean;
  title: string;
  artist: string;
  appName: string;
  status: 'playing' | 'paused' | 'stopped' | 'closed' | 'opened' | 'changing' | 'none';
}

const MEDIA_SCRIPT = `
param([string]$Op = "info")
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1' })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null
$m = Await ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
$s = $m.GetCurrentSession()
if ($null -eq $s) {
    Write-Output "NO_SESSION"
    exit 0
}
if ($Op -ne "info") {
    switch ($Op) {
        "play"      { $null = Await ($s.TryPlayAsync()) ([bool]) }
        "pause"     { $null = Await ($s.TryPauseAsync()) ([bool]) }
        "playpause" { $null = Await ($s.TryPlayPauseAsync()) ([bool]) }
        "next"      { $null = Await ($s.TrySkipNextAsync()) ([bool]) }
        "prev"      { $null = Await ($s.TrySkipPreviousAsync()) ([bool]) }
    }
    exit 0
}
try {
    $p = Await ($s.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
    $pi = $s.GetPlaybackInfo()
    Write-Output ("APP=" + $s.SourceAppUserModelId)
    Write-Output ("TITLE=" + $p.Title)
    Write-Output ("ARTIST=" + $p.Artist)
    Write-Output ("STATUS=" + $pi.PlaybackStatus)
} catch {
    Write-Output "ERR"
}
`;

let mediaScriptPath: string | null = null;

async function ensureMediaScript(): Promise<string> {
  if (mediaScriptPath) return mediaScriptPath;
  mediaScriptPath = path.join(app.getPath('temp'), 'nothing-clock-media-session.ps1');
  await writeFile(mediaScriptPath, MEDIA_SCRIPT, 'utf8');
  return mediaScriptPath;
}

async function runMediaCommand(op: string): Promise<string> {
  const scriptPath = await ensureMediaScript();
  const { stdout } = await execFileAsync(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, '-Op', op],
    { timeout: 15000, windowsHide: true }
  );
  return stdout;
}

function parseMediaOutput(output: string): MediaInfo {
  const lines = output.split(/\r?\n/);
  const read = (key: string): string => {
    const prefix = `${key}=`;
    const line = lines.find(l => l.startsWith(prefix));
    return line ? line.slice(prefix.length).trim() : '';
  };
  const statusRaw = read('STATUS').toLowerCase();
  const valid = ['playing', 'paused', 'stopped', 'closed', 'opened', 'changing'] as const;
  const status = (valid as readonly string[]).includes(statusRaw)
    ? (statusRaw as MediaInfo['status'])
    : 'none';
  return {
    hasSession: !output.includes('NO_SESSION') && !output.includes('ERR'),
    title: read('TITLE'),
    artist: read('ARTIST'),
    appName: read('APP'),
    status,
  };
}

const EMPTY_MEDIA: MediaInfo = { hasSession: false, title: '', artist: '', appName: '', status: 'none' };

ipcMain.handle('media:get-info', async (): Promise<MediaInfo> => {
  try {
    return parseMediaOutput(await runMediaCommand('info'));
  } catch {
    return EMPTY_MEDIA;
  }
});

ipcMain.handle('media:command', async (_event, op: string): Promise<boolean> => {
  try {
    await runMediaCommand(op);
    return true;
  } catch {
    return false;
  }
});