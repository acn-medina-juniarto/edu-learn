/**
 * Furigana markup used in every Japanese string in /content:
 *
 *   {名刺|めいし}            → ruby: 名刺 with めいし above
 *   {名刺|めいし|meishi}     → same, and tappable: links to vocab id "meishi"
 *   {はじめまして||greeting} → no ruby (kana only), but tappable
 *
 * Plain text outside braces is passed through unchanged.
 */

export type JaSegment =
  | { kind: 'text'; text: string }
  | { kind: 'ruby'; base: string; reading: string; vocabId?: string };

const TOKEN = /\{([^{}|]+)\|([^{}|]*)(?:\|([^{}|]+))?\}/g;

export function parseFurigana(input: string): JaSegment[] {
  const out: JaSegment[] = [];
  let last = 0;
  for (const m of input.matchAll(TOKEN)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ kind: 'text', text: input.slice(last, idx) });
    const [, base, reading, vocabId] = m;
    out.push({
      kind: 'ruby',
      base: base.trim(),
      reading: reading.trim(),
      ...(vocabId ? { vocabId: vocabId.trim() } : {}),
    });
    last = idx + m[0].length;
  }
  if (last < input.length) out.push({ kind: 'text', text: input.slice(last) });
  return out;
}

/** Plain Japanese with markup removed: "{名刺|めいし}です" → "名刺です". Used for speech + search. */
export function toPlain(input: string): string {
  return parseFurigana(input)
    .map((s) => (s.kind === 'text' ? s.text : s.base))
    .join('');
}

/** Kana reading: "{名刺|めいし}です" → "めいしです". Segments without a reading keep their base. */
export function toReading(input: string): string {
  return parseFurigana(input)
    .map((s) => (s.kind === 'text' ? s.text : s.reading || s.base))
    .join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render markup to HTML string (ruby + optional vocab buttons).
 * Output is safe: all content is escaped.
 */
export function toRubyHtml(input: string): string {
  return parseFurigana(input)
    .map((s) => {
      if (s.kind === 'text') return escapeHtml(s.text);
      const inner = s.reading
        ? `<ruby>${escapeHtml(s.base)}<rp>(</rp><rt>${escapeHtml(s.reading)}</rt><rp>)</rp></ruby>`
        : escapeHtml(s.base);
      if (!s.vocabId) return inner;
      return `<button type="button" class="vocab-word" data-vocab-id="${escapeHtml(s.vocabId)}">${inner}</button>`;
    })
    .join('');
}
