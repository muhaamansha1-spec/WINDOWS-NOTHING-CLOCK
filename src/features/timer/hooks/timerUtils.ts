let audioContext: AudioContext | null = null;
let isPlayingTimerSound = false;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playBeep(ctx: AudioContext, frequency: number, duration: number, volume: number, delay: number = 0) {
  if (!isPlayingTimerSound) return;
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.value = volume * 0.3;
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
  
  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);
}

export function playTimerCompleteSound() {
  const ctx = getAudioContext();
  isPlayingTimerSound = true;
  
  // Play a pleasant completion melody: three ascending notes
  playBeep(ctx, 523, 0.3, 0.8, 0);      // C5
  playBeep(ctx, 659, 0.3, 0.8, 0.2);    // E5
  playBeep(ctx, 784, 0.5, 0.8, 0.4);    // G5
  
  // Auto-stop after 2 seconds
  setTimeout(() => {
    isPlayingTimerSound = false;
  }, 2000);
}

export function stopTimerSound() {
  isPlayingTimerSound = false;
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

// Notification
export function showTimerNotification() {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('Timer Complete', {
      body: 'Your timer has finished!',
      icon: '/favicon.svg',
      tag: 'timer-complete',
      requireInteraction: true,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showTimerNotification();
      }
    });
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}