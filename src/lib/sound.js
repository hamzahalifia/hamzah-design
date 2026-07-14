let audioCtx = null;
let _soundEnabled = true;

export function setSoundEnabled(enabled) {
  _soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('soundEnabled', String(enabled));
  }
}

export function isSoundEnabled() {
  return _soundEnabled;
}

// Init from localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('soundEnabled');
  if (saved !== null) {
    _soundEnabled = saved === 'true';
  }
}

const SFX_FREQUENCIES = {
  tick: 660, // Digunakan untuk hover & klik standar
  key: 820,
  open: 520, // Digunakan untuk transisi membuka / light mode
  close: 420, // Digunakan untuk transisi menutup / dark mode
  boop: 560,
  pop: 900,
  nav: 700, // Digunakan khusus untuk scroll
};

// Mode suara bawaan dari web: 'soft' (sine) atau 'mech' (triangle)
const SOUND_MODE = "soft";

function getAudioContext() {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    // Trik pemicu awal pasif dari skrip asli untuk membuka gerbang autoplay browser
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();

        // Memancing browser dengan gain super kecil di awal
        let dummyGain = audioCtx.createGain();
        dummyGain.gain.value = 1e-4;
        let dummyOsc = audioCtx.createOscillator();
        dummyOsc.connect(dummyGain).connect(audioCtx.destination);
        dummyOsc.start();
        dummyOsc.stop(audioCtx.currentTime + 0.03);
      }
    } catch (err) {
      console.warn("Failed to initialize AudioContext:", err);
    }
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

/**
 * Fungsi Inti Generator SFX
 */
function runOscillatorGenerator(type) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Prevent queued sounds from playing later when context is resumed:
  // Only allow click (tick) and theme toggles (open/close) if context is suspended
  if (ctx.state === "suspended") {
    if (type !== "tick" && type !== "open" && type !== "close") return;
  } else if (ctx.state !== "running") {
    return;
  }

  const isSoft = SOUND_MODE === "soft";
  const startTime = ctx.currentTime + 0.01;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Menentukan frekuensi dasar & dikalikan 0.8 jika dalam mode 'soft'
  let frequency = (SFX_FREQUENCIES[type] || 600) * (isSoft ? 0.8 : 1);

  osc.type = isSoft ? "sine" : "triangle";
  osc.frequency.setValueAtTime(frequency, startTime);

  // Efek transisi khusus pitch geser (slide) untuk menu open/close
  if (type === "open") {
    osc.frequency.exponentialRampToValueAtTime(
      1.5 * frequency,
      startTime + 0.07,
    );
  }
  if (type === "close") {
    osc.frequency.exponentialRampToValueAtTime(
      0.62 * frequency,
      startTime + 0.07,
    );
  }

  // Pengaturan Envelope Volume (Attack 0.004 detik, Decay 0.07-0.1 detik)
  let peakVolume = isSoft ? 0.04 : 0.055;
  let decayDuration = isSoft ? 0.1 : 0.07;

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakVolume, startTime + 0.004);
  gainNode.gain.exponentialRampToValueAtTime(1e-4, startTime + decayDuration);

  osc.connect(gainNode).connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.14);
}

/**
 * Play a subtle hover sound (660Hz * 0.8 = 528Hz jika mode soft)
 */
export function playHoverSound() {
  if (!isSoundEnabled()) return;
  if (audioCtx && audioCtx.state === "running") {
    runOscillatorGenerator("tick");
  }
}

/**
 * Play a snappy click/tap sound
 */
export function playClickSound() {
  if (!isSoundEnabled()) return;
  runOscillatorGenerator("tick");
}

/**
 * Play a short scroll dial tick sound (700Hz * 0.8 = 560Hz jika mode soft)
 */
export function playScrollSound() {
  if (!isSoundEnabled()) return;
  if (audioCtx && audioCtx.state === "running") {
    runOscillatorGenerator("nav");
  }
}

/**
 * Play a theme transition sweep sound (Menggunakan trigger 'open' dan 'close')
 * @param {boolean} toDark - True jika masuk ke dark mode, false ke light mode
 */
export function playThemeToggleSound(toDark) {
  if (!isSoundEnabled()) return;
  runOscillatorGenerator(toDark ? "close" : "open");
}

// One-time listener to resume AudioContext on first user interaction anywhere
if (typeof window !== "undefined") {
  const resumeAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
  };
  document.addEventListener("click", resumeAudio, { once: true });
  document.addEventListener("touchstart", resumeAudio, { once: true });
}
