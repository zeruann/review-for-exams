let ctx: AudioContext | null = null;
const KEY = "quiz-sound-enabled";

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== "false";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, String(on));
  } catch {
    /* ignore */
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  if (!isSoundEnabled()) return;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur);
}

export function playCorrect() {
  tone(660, 0, 0.12);
  tone(880, 0.12, 0.2);
}

export function playWrong() {
  tone(220, 0, 0.18, "sawtooth", 0.1);
  tone(150, 0.16, 0.28, "sawtooth", 0.1);
}