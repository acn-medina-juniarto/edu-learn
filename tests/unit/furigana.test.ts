import { describe, expect, it } from 'vitest';
import { parseFurigana, toPlain, toReading, toRubyHtml } from '../../src/lib/furigana';

describe('parseFurigana', () => {
  it('splits text and ruby segments', () => {
    expect(parseFurigana('{名刺|めいし}を{頂戴|ちょうだい}いたします。')).toEqual([
      { kind: 'ruby', base: '名刺', reading: 'めいし' },
      { kind: 'text', text: 'を' },
      { kind: 'ruby', base: '頂戴', reading: 'ちょうだい' },
      { kind: 'text', text: 'いたします。' },
    ]);
  });

  it('reads an optional vocab id', () => {
    expect(parseFurigana('{名刺|めいし|meishi}')).toEqual([
      { kind: 'ruby', base: '名刺', reading: 'めいし', vocabId: 'meishi' },
    ]);
  });

  it('supports kana-only tappable words with an empty reading', () => {
    expect(parseFurigana('{はじめまして||hajimemashite}')).toEqual([
      { kind: 'ruby', base: 'はじめまして', reading: '', vocabId: 'hajimemashite' },
    ]);
  });

  it('returns plain text when there is no markup', () => {
    expect(parseFurigana('よろしくお願いします')).toEqual([
      { kind: 'text', text: 'よろしくお願いします' },
    ]);
  });
});

describe('toPlain / toReading', () => {
  const s = 'ABC{商事|しょうじ}のスミスと{申|もう}します。';
  it('strips markup', () => expect(toPlain(s)).toBe('ABC商事のスミスと申します。'));
  it('builds a kana reading', () => expect(toReading(s)).toBe('ABCしょうじのスミスともうします。'));
});

describe('toRubyHtml', () => {
  it('renders ruby with rp fallbacks', () => {
    expect(toRubyHtml('{本日|ほんじつ}')).toBe(
      '<ruby>本日<rp>(</rp><rt>ほんじつ</rt><rp>)</rp></ruby>',
    );
  });
  it('wraps linked words in a button', () => {
    expect(toRubyHtml('{名刺|めいし|meishi}')).toContain('data-vocab-id="meishi"');
  });
  it('escapes HTML', () => {
    expect(toRubyHtml('<b>{a|b}</b>')).toBe(
      '&lt;b&gt;<ruby>a<rp>(</rp><rt>b</rt><rp>)</rp></ruby>&lt;/b&gt;',
    );
  });
});
