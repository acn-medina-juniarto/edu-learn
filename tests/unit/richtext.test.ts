import { describe, expect, it } from 'vitest';
import { renderInline, renderMarkdown } from '../../src/lib/richtext';

describe('renderInline', () => {
  it('wraps Japanese runs in lang="ja" and keeps English plain', () => {
    expect(renderInline('Say かしこまりました to clients.')).toBe(
      'Say <span lang="ja">かしこまりました</span> to clients.',
    );
  });

  it('renders furigana inside the Japanese run', () => {
    expect(renderInline('Use {申|もう}す here')).toBe(
      'Use <span lang="ja"><ruby>申<rp>(</rp><rt>もう</rt><rp>)</rp></ruby>す</span> here',
    );
  });

  it('escapes HTML', () => {
    expect(renderInline('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
  });
});

describe('renderMarkdown', () => {
  it('keeps tables intact even though furigana uses |', () => {
    const md = '| Word | Meaning |\n|---|---|\n| {弊社|へいしゃ} | our company |';
    const html = renderMarkdown(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<ruby>弊社<rp>(</rp><rt>へいしゃ</rt><rp>)</rp></ruby>');
    expect(html.match(/<td>/g)?.length).toBe(2);
  });

  it('keeps bold, lists and blockquotes working around Japanese', () => {
    const html = renderMarkdown('- **{申|もう}す** is humble\n\n> いつもお{世話|せわ}になっております。');
    expect(html).toContain('<li><strong><span lang="ja"><ruby>申');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<span lang="ja">いつもお<ruby>世話');
  });

  it('renders vocab links as buttons', () => {
    expect(renderMarkdown('{名刺|めいし|meishi}')).toContain('data-vocab-id="meishi"');
  });
});
