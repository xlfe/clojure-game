// Web Audio API sound effects and music system

let audioCtx = null;

const SOUNDS = {
  success: { freq: 523.25, duration: 0.1, type: 'sine' },
  error: { freq: 220, duration: 0.2, type: 'sawtooth' },
  pickup: { freq: 659.25, duration: 0.08, type: 'sine' },
  walk: { freq: 150, duration: 0.05, type: 'square' },
};

export function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn('Web Audio not available');
  }
}

function ensureAudio() {
  if (!audioCtx) initAudio();
  if (audioCtx?.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  ensureAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

export function playSound(name) {
  const s = SOUNDS[name];
  if (s) playTone(s.freq, s.duration, s.type);
}

export function playMagicSound() {
  ensureAudio();
  if (!audioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.12), i * 100);
  });
}

export function playWinSound() {
  ensureAudio();
  if (!audioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
  });
}

export function playPuzzleSolved() {
  ensureAudio();
  if (!audioCtx) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.1), i * 120);
  });
}
