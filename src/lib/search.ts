/**
 * Search normalization shared by build-time indexing and the browser:
 * NFKC, lower-case, katakana → hiragana, furigana markup expanded to both the
 * written form and its reading (so "いう" finds 言う).
 */
import { toPlain, toReading } from './furigana';

export function normalizeSearch(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Index text for a list of furigana-markup / English strings. */
export function searchIndex(parts: Array<string | undefined>): string {
  return normalizeSearch(
    parts
      .filter((p): p is string => !!p)
      .flatMap((p) => [toPlain(p), toReading(p)])
      .join(' | '),
  );
}

/** Every whitespace-separated query term must appear in the index. */
export function matches(index: string, query: string): boolean {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  return terms.every((t) => index.includes(t));
}
