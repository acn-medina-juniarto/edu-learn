import { describe, expect, it } from 'vitest';
import {
  editDistance,
  gradeFillBlank,
  gradeMultipleChoice,
  gradeSentenceOrder,
  normalizeAnswer,
  scoreQuiz,
  seededRandom,
  shuffledIndices,
} from '../../src/lib/grading';

describe('normalizeAnswer', () => {
  it('strips spaces (incl. full-width) and edge punctuation', () => {
    expect(normalizeAnswer('　ございます。 ')).toBe('ございます');
    expect(normalizeAnswer('お 願 い')).toBe('お願い');
  });
  it('folds full-width ASCII and katakana', () => {
    expect(normalizeAnswer('ＯＫ')).toBe('OK');
    expect(normalizeAnswer('カシコマリ')).toBe('かしこまり');
  });
  it('strips furigana markup', () => {
    expect(normalizeAnswer('{伺|うかが}って')).toBe('伺って');
  });
});

describe('gradeMultipleChoice', () => {
  const q = {
    choices: [{ correct: true }, { feedback: 'Too casual' }, { feedback: 'Wrong verb' }],
  };
  it('marks the correct choice', () => {
    expect(gradeMultipleChoice(q, 0)).toEqual({ correct: true, correctIndex: 0 });
  });
  it('returns the chosen option feedback when wrong', () => {
    expect(gradeMultipleChoice(q, 2)).toEqual({ correct: false, correctIndex: 0, feedback: 'Wrong verb' });
  });
  it('throws for an out-of-range choice', () => {
    expect(() => gradeMultipleChoice(q, 5)).toThrow(RangeError);
  });
});

describe('gradeFillBlank', () => {
  const q = { answers: ['伺って', 'うかがって'] };
  it('accepts any listed answer, kanji or kana', () => {
    expect(gradeFillBlank(q, '伺って').correct).toBe(true);
    expect(gradeFillBlank(q, 'うかがって').correct).toBe(true);
    expect(gradeFillBlank(q, 'ウカガッテ').correct).toBe(true);
    expect(gradeFillBlank(q, ' うかがって。').correct).toBe(true);
  });
  it('flags a one-character slip as close', () => {
    const r = gradeFillBlank(q, 'うかがて');
    expect(r).toEqual({ correct: false, close: true, expected: 'うかがって' });
  });
  it('does not call a different word close', () => {
    expect(gradeFillBlank(q, 'きいて')).toMatchObject({ correct: false, close: false });
  });
  it('treats an empty answer as wrong, not close', () => {
    expect(gradeFillBlank(q, '   ')).toMatchObject({ correct: false, close: false });
  });
  it('only calls answers of 3+ characters close', () => {
    expect(gradeFillBlank({ answers: ['なって'] }, 'なて').close).toBe(true);
    expect(gradeFillBlank({ answers: ['は'] }, 'が').close).toBe(false);
    expect(gradeFillBlank({ answers: ['です'] }, 'でう').close).toBe(false);
  });
});

describe('gradeSentenceOrder', () => {
  const q = { tokens: ['{本日|ほんじつ}は', 'お{時間|じかん}を', 'いただき', 'ありがとうございます'] };
  it('accepts the original order', () => {
    expect(gradeSentenceOrder(q, [0, 1, 2, 3])).toEqual({ correct: true, firstWrong: -1 });
  });
  it('reports the first wrong position', () => {
    expect(gradeSentenceOrder(q, [0, 2, 1, 3])).toEqual({ correct: false, firstWrong: 1 });
  });
  it('rejects incomplete answers', () => {
    expect(gradeSentenceOrder(q, [0, 1]).correct).toBe(false);
  });
  it('allows identical duplicate tokens in either order', () => {
    const dup = { tokens: ['よろしく', 'お願い', 'お願い'] };
    expect(gradeSentenceOrder(dup, [0, 2, 1]).correct).toBe(true);
  });
});

describe('shuffledIndices', () => {
  it('is a permutation and never the identity for n > 1', () => {
    for (let seed = 1; seed < 200; seed++) {
      const r = shuffledIndices(4, seededRandom(seed));
      expect([...r].sort()).toEqual([0, 1, 2, 3]);
      expect(r).not.toEqual([0, 1, 2, 3]);
    }
  });
  it('is deterministic with a seed', () => {
    expect(shuffledIndices(5, seededRandom(42))).toEqual(shuffledIndices(5, seededRandom(42)));
  });
  it('handles n = 0 and 1', () => {
    expect(shuffledIndices(0)).toEqual([]);
    expect(shuffledIndices(1)).toEqual([0]);
  });
});

describe('scoreQuiz / editDistance', () => {
  it('scores', () => {
    expect(scoreQuiz([true, false, true, true])).toEqual({ correct: 3, total: 4, ratio: 0.75 });
    expect(scoreQuiz([])).toEqual({ correct: 0, total: 0, ratio: 0 });
  });
  it('measures edit distance', () => {
    expect(editDistance('ございます', 'ございます')).toBe(0);
    expect(editDistance('ございます', 'ござます')).toBe(1);
  });
});
