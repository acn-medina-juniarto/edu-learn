/**
 * Display preferences stored in localStorage and mirrored as data-* attributes
 * on <html> (data-theme, data-furigana, data-english). CSS reacts to the attributes.
 * The inline script in Base.astro applies them before first paint (no flash).
 */
export const PREFS_KEY = 'bj:v1:prefs';

export type Theme = 'light' | 'dark';
export interface Prefs {
  theme?: Theme; // undefined = follow system
  furigana: boolean;
  english: boolean;
}

export const DEFAULT_PREFS: Prefs = { furigana: true, english: true };

export function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writePrefs(patch: Partial<Prefs>): Prefs {
  const next = { ...readPrefs(), ...patch };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode): keep in-memory only */
  }
  applyPrefs(next);
  return next;
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyPrefs(p: Prefs): void {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = p.theme ?? (systemDark ? 'dark' : 'light');
  root.dataset.furigana = p.furigana ? 'on' : 'off';
  root.dataset.english = p.english ? 'on' : 'off';
}
