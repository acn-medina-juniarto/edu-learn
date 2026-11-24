import { describe, expect, it } from 'vitest';
import { matches, normalizeSearch, searchIndex } from '../../src/lib/search';

describe('keigo search', () => {
  const idx = searchIndex(['{言|い}う', 'to say', 'おっしゃる', '{申|もう}す']);
  it('finds by kanji, reading, keigo form and English', () => {
    expect(matches(idx, '言う')).toBe(true);
    expect(matches(idx, 'いう')).toBe(true);
    expect(matches(idx, 'もうす')).toBe(true);
    expect(matches(idx, 'SAY')).toBe(true);
  });
  it('folds katakana and full-width input', () => {
    expect(matches(idx, 'オッシャル')).toBe(true);
    expect(normalizeSearch('ＳＡＹ')).toBe('say');
  });
  it('requires every term and ignores extra spaces', () => {
    expect(matches(idx, '  to   say ')).toBe(true);
    expect(matches(idx, 'say eat')).toBe(false);
  });
  it('an empty query matches everything', () => {
    expect(matches(idx, '')).toBe(true);
  });
});
