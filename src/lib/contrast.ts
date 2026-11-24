/**
 * WCAG contrast helpers + the list of color pairings the design system uses.
 * Shared by the /design page and `npm run contrast` (node runs this file
 * directly via type stripping, so keep it import-free and erasable-syntax only).
 */

export type TokenMap = Record<string, string>;
export interface ThemeTokens {
  light: TokenMap;
  dark: TokenMap;
}

/** [foreground token, background token, minimum ratio, what it is used for] */
export const PAIRINGS: ReadonlyArray<readonly [string, string, number, string]> = [
  ['ink', 'paper', 4.5, 'Body text on page'],
  ['ink', 'surface', 4.5, 'Body text on cards'],
  ['ink', 'surface-2', 4.5, 'Text on tinted panels'],
  ['ink-soft', 'paper', 4.5, 'Secondary text on page'],
  ['ink-soft', 'surface', 4.5, 'Secondary text / furigana on cards'],
  ['on-primary', 'primary', 4.5, 'Primary button label'],
  ['ink', 'primary-soft', 4.5, 'Selected option'],
  ['on-accent', 'sakura', 4.5, 'Keigo badge / fill'],
  ['on-accent', 'sunny', 4.5, 'Email badge / fill'],
  ['on-accent', 'matcha', 4.5, 'Meetings badge / fill'],
  ['on-accent', 'ramune', 4.5, 'Phone badge / fill'],
  ['success', 'surface', 4.5, 'Success text on card'],
  ['success', 'success-bg', 4.5, 'Success text in feedback panel'],
  ['error', 'surface', 4.5, 'Error text on card'],
  ['error', 'error-bg', 4.5, 'Error text in feedback panel'],
  ['ink', 'success-bg', 4.5, 'Body text in success panel'],
  ['ink', 'error-bg', 4.5, 'Body text in error panel'],
  ['line', 'paper', 3, 'Outlines vs page (non-text, 3:1)'],
  ['focus', 'paper', 3, 'Focus ring vs page (non-text, 3:1)'],
];

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((x) => x + x).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function parseBlock(body: string): TokenMap {
  const out: TokenMap = {};
  for (const m of body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    out[m[1]] = m[2].toLowerCase();
  }
  return out;
}

/** Extract light/dark hex tokens from global.css. */
export function parseThemeTokens(css: string): ThemeTokens {
  const light = css.match(/:root,\s*\[data-theme='light'\]\s*\{([^}]*)\}/);
  const dark = css.match(/\n\[data-theme='dark'\]\s*\{([^}]*)\}/);
  if (!light || !dark) throw new Error('Could not find theme token blocks in global.css');
  return { light: parseBlock(light[1]), dark: parseBlock(dark[1]) };
}

export interface PairResult {
  theme: 'light' | 'dark';
  fg: string;
  bg: string;
  fgHex: string;
  bgHex: string;
  ratio: number;
  min: number;
  pass: boolean;
  use: string;
}

export function checkPairings(tokens: ThemeTokens): PairResult[] {
  const results: PairResult[] = [];
  for (const theme of ['light', 'dark'] as const) {
    const t = tokens[theme];
    for (const [fg, bg, min, use] of PAIRINGS) {
      const fgHex = t[fg];
      const bgHex = t[bg];
      if (!fgHex || !bgHex) throw new Error(`Missing token ${fg} or ${bg} in ${theme}`);
      const ratio = contrastRatio(fgHex, bgHex);
      results.push({ theme, fg, bg, fgHex, bgHex, ratio, min, pass: ratio >= min, use });
    }
  }
  return results;
}
