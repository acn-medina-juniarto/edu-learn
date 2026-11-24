/**
 * Mixed English/Japanese rich text (build time).
 *
 * Content strings (notes, explanations, dialogue notes) are English with
 * Japanese phrases in furigana markup. renderMarkdown:
 *  1. swaps furigana tokens for private-use placeholders (so `|` and `{}` never
 *     reach the Markdown parser, e.g. inside tables),
 *  2. wraps every run of Japanese in <span lang="ja">,
 *  3. parses Markdown,
 *  4. puts the ruby HTML back in.
 * Inline-only rendering lives in ./inline (no Markdown dependency, island-safe).
 */
import { marked } from 'marked';
import { parseFurigana } from './furigana';
import { protect, restore, wrapJa } from './inline';

export { renderInline } from './inline';

/** Markdown with furigana and lang="ja". Content is ours (/content), so raw HTML is trusted. */
export function renderMarkdown(src: string): string {
  const { text, tokens } = protect(src);
  // Wrap Japanese runs line by line, skipping Markdown syntax at line starts.
  const wrapped = text
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\s*(?:>\s?)*(?:[-*+]\s|\d+\.\s)?)(.*)$/);
      const [prefix, rest] = m ? [m[1], m[2]] : ['', line];
      return prefix + wrapJa(rest);
    })
    .join('\n');
  const html = marked.parse(wrapped, { async: false, gfm: true, breaks: false }) as string;
  return restore(html, tokens);
}

/** True when the string contains any furigana token. */
export function hasFurigana(src: string): boolean {
  return parseFurigana(src).some((s) => s.kind === 'ruby');
}
