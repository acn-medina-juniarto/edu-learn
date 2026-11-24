import { describe, expect, it } from 'vitest';
import {
  EMPTY_PROGRESS,
  localDateKey,
  withActiveDay,
  withLessonComplete,
  withQuizScore,
} from '../../src/lib/progress';

describe('progress', () => {
  const day1 = new Date(2026, 10, 24, 9, 0); // local time
  const day2 = new Date(2026, 10, 25, 23, 30);

  it('formats local date keys', () => {
    expect(localDateKey(day1)).toBe('2026-11-24');
  });

  it('records an active day once', () => {
    const p = withActiveDay(withActiveDay(EMPTY_PROGRESS, day1), day1);
    expect(p.activeDays).toEqual(['2026-11-24']);
  });

  it('marks a lesson complete and keeps the first completion date', () => {
    const p1 = withLessonComplete(EMPTY_PROGRESS, 'phone-etiquette', day1);
    const p2 = withLessonComplete(p1, 'phone-etiquette', day2);
    expect(p2.lessons['phone-etiquette'].completedAt).toBe(day1.toISOString());
    expect(p2.lessons['phone-etiquette'].lastStudiedAt).toBe(day2.toISOString());
    expect(p2.activeDays).toEqual(['2026-11-24', '2026-11-25']);
  });

  it('keeps the best quiz score and the latest one', () => {
    const p1 = withQuizScore(EMPTY_PROGRESS, 'email-basics', 0.8, day1);
    const p2 = withQuizScore(p1, 'email-basics', 0.4, day2);
    expect(p2.quizzes?.['email-basics']).toEqual({ best: 0.8, last: 0.4 });
    expect(p2.activeDays).toEqual(['2026-11-24', '2026-11-25']);
  });

  it('clamps quiz scores to 0..1', () => {
    expect(withQuizScore(EMPTY_PROGRESS, 'x', 1.5, day1).quizzes?.x.best).toBe(1);
  });

  it('does not mutate the input', () => {
    withLessonComplete(EMPTY_PROGRESS, 'x', day1);
    expect(EMPTY_PROGRESS.lessons).toEqual({});
    expect(EMPTY_PROGRESS.activeDays).toEqual([]);
  });
});
