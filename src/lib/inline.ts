/**
 * Inline mixed English/Japanese rendering with no Markdown dependency, so it
 * can ship inside client islands (quiz) without pulling in the Markdown parser.
 * renderInline: escapes HTML, wraps Japanese runs in lang="ja", renders furigana.
 */
import { toRubyHtml } from './furigana';

export const OPEN = '';
export const CLOSE = '';
const PLACEHOLDER = new RegExp(`${OPEN}(\\d+)${CLOSE}`, 'g');
const TOKEN = /\{[^{}|]+\|[^{}|]*(?:\|[^{}|]+)?\}/g;

// A Japanese run: placeholders, kana, kanji, and Japanese punctuation.
const JA_RUN = new RegExp(
  `(?:${OPEN}\\d+${CLOSE}|[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー々〆〜・、。「」『』【】（）？！])+`,
  'gu',
);

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function protect(src: string): { text: string; tokens: string[] } {
  const tokens: string[] = [];
  const text = src.replace(TOKEN, (m) => {
    tokens.push(m);
    return `${OPEN}${tokens.length - 1}${CLOSE}`;
  });
  return { text, tokens };
}

export function restore(html: string, tokens: string[]): string {
  return html.replace(PLACEHOLDER, (_, i: string) => toRubyHtml(tokens[Number(i)]));
}

export function wrapJa(text: string): string {
  return text.replace(JA_RUN, (run) => `<span lang="ja">${run}</span>`);
}

export function renderInline(src: string): string {
  const { text, tokens } = protect(src);
  return restore(wrapJa(escapeHtml(text)), tokens);
}
