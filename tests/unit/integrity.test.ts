import { describe, expect, it } from 'vitest';
import { checkLesson, checkLessons } from '../../src/lib/integrity';
import type { Lesson } from '../../src/lib/schemas';

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  const vocab = Array.from({ length: 8 }, (_, i) => ({
    id: `word-${i}`,
    word: '言葉',
    reading: 'ことば',
    meaning: 'word',
    pos: 'noun' as const,
    politeness: 'neutral' as const,
    example: { ja: '{言葉|ことば}です。', en: "It's a word.", politeness: 'teinei' as const },
  }));
  return {
    id: 'test-lesson',
    order: 1,
    title: 'Test',
    titleJa: 'テスト',
    summary: 'Test lesson',
    category: 'meetings',
    level: 'N4',
    politeness: 'keigo',
    minutes: 5,
    objectives: ['Test'],
    reviewed: false,
    vocab,
    dialogue: {
      setting: 'Office',
      speakers: [
        { id: 'a', name: 'A', nameJa: 'エー', role: 'You' },
        { id: 'b', name: 'B', nameJa: 'ビー', role: 'Client' },
      ],
      lines: [
        { speaker: 'a', ja: '{言葉|ことば|word-0}です。', en: 'Word.', politeness: 'teinei' },
        { speaker: 'b', ja: 'はい。', en: 'Yes.', politeness: 'teinei' },
      ],
    },
    notes: [{ type: 'culture', title: 'Note', body: 'Body' }],
    quiz: [
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'Pick',
        choices: [{ ja: 'はい', correct: true }, { ja: 'うん', feedback: 'Too casual' }],
        explanation: 'Because',
      },
    ],
    ...overrides,
  };
}

const known = new Set(Array.from({ length: 8 }, (_, i) => `word-${i}`));

describe('checkLesson', () => {
  it('accepts a valid lesson', () => {
    expect(checkLesson(makeLesson(), known)).toEqual([]);
  });

  it('flags an unknown vocab link', () => {
    const l = makeLesson();
    l.dialogue.lines[0].ja = '{言葉|ことば|nope}';
    expect(checkLesson(l, known)).toEqual([expect.stringContaining('unknown vocab id "nope"')]);
  });

  it('flags an unknown speaker', () => {
    const l = makeLesson();
    l.dialogue.lines[1].speaker = 'zzz';
    expect(checkLesson(l, known)[0]).toContain('unknown speaker');
  });

  it('flags malformed markup', () => {
    const l = makeLesson();
    l.dialogue.lines[0].ja = '{言葉|ことば です';
    expect(checkLesson(l, known)[0]).toContain('malformed furigana');
  });

  it('flags ruby that repeats its base', () => {
    const l = makeLesson();
    l.dialogue.lines[0].ja = '{はい|はい}';
    expect(checkLesson(l, known)[0]).toContain('repeats the base');
  });

  it('requires exactly one correct choice and feedback on wrong ones', () => {
    const l = makeLesson({
      quiz: [
        {
          id: 'q1',
          type: 'multiple-choice',
          prompt: 'Pick',
          choices: [{ ja: 'はい', correct: true }, { ja: 'うん', correct: true }, { ja: 'ええ' }],
          explanation: 'x',
        },
      ],
    });
    const errs = checkLesson(l, known);
    expect(errs.some((e) => e.includes('exactly one correct'))).toBe(true);
    expect(errs.some((e) => e.includes('needs feedback'))).toBe(true);
  });
});

describe('checkLessons', () => {
  it('flags vocab ids reused across lessons and duplicate order', () => {
    const errs = checkLessons([makeLesson(), makeLesson({ id: 'other' })]);
    expect(errs.some((e) => e.includes('used in both'))).toBe(true);
    expect(errs.some((e) => e.includes('lesson order 1'))).toBe(true);
  });
});
