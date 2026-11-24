/**
 * Japanese text-to-speech via the browser Web Speech API (free, no audio files).
 * Pronunciation and voice availability depend on the browser and OS. For
 * numbers, dates and codes, pass a controlled kana reading (a dialogue line's
 * `reading` field) rather than relying on the engine.
 */

let cachedVoice: SpeechSynthesisVoice | null | undefined;
let sequenceId = 0;

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (!voices.length) return null; // voices may load async; don't cache yet
  cachedVoice =
    voices.find((v) => v.lang === 'ja-JP' && /google|natural|online/i.test(v.name)) ??
    voices.find((v) => v.lang === 'ja-JP') ??
    voices.find((v) => v.lang.startsWith('ja')) ??
    null;
  return cachedVoice;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasJapaneseVoice(): boolean {
  return speechSupported() && pickVoice() !== null;
}

function utterance(text: string, rate: number): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = rate;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  return u;
}

export function stopSpeaking(): void {
  sequenceId++;
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function speak(text: string, rate = 0.9): boolean {
  if (!speechSupported() || !text.trim()) return false;
  stopSpeaking();
  window.speechSynthesis.speak(utterance(text, rate));
  return true;
}

/**
 * Speak several lines in order. `onLine(i)` fires as each line starts and
 * `onLine(-1)` when the sequence ends or is stopped.
 */
export function speakSequence(texts: string[], onLine: (index: number) => void, rate = 0.9): boolean {
  if (!speechSupported() || !texts.length) return false;
  stopSpeaking();
  const id = sequenceId;
  const synth = window.speechSynthesis;
  const next = (i: number) => {
    if (id !== sequenceId) return onLine(-1);
    if (i >= texts.length) return onLine(-1);
    const u = utterance(texts[i], rate);
    u.onstart = () => id === sequenceId && onLine(i);
    u.onend = () => window.setTimeout(() => next(i + 1), 350);
    u.onerror = () => onLine(-1);
    synth.speak(u);
  };
  next(0);
  return true;
}

if (speechSupported()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = undefined;
  });
}
