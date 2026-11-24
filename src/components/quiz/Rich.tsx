/** Small render helpers for Preact islands (safe: all text is escaped by the renderers). */
import { h } from 'preact';
import { toRubyHtml } from '@/lib/furigana';
import { renderInline } from '@/lib/inline';

type Tag = 'span' | 'p' | 'div' | 'h2' | 'h3';
interface TextProps {
  text: string;
  as?: Tag;
  class?: string;
}

/** Text that is entirely Japanese, in furigana markup. */
export function JaText({ text, as = 'span', class: cls }: TextProps) {
  return h(as, { lang: 'ja', class: cls, dangerouslySetInnerHTML: { __html: toRubyHtml(text) } });
}

/** English with Japanese phrases inside; Japanese runs get lang="ja". */
export function MixedText({ text, as = 'span', class: cls }: TextProps) {
  return h(as, { class: cls, dangerouslySetInnerHTML: { __html: renderInline(text) } });
}

export function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
