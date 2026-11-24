import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildQueue,
  daysBetween,
  formatInterval,
  isDue,
  MIN_EASE,
  newCard,
  nextDueDate,
  nextInterval,
  previewIntervals,
  review,
  type CardState,
} from '../../src/lib/srs';
import { EMPTY_DECK, withCards, withoutCard, withReview } from '../../src/lib/deck';

const T = '2026-11-24';

describe('dates', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });
  it('is unaffected by DST changes', () => {
    expect(addDays('2026-03-07', 1)).toBe('2026-03-08');
    expect(addDays('2026-10-31', 2)).toBe('2026-11-02');
    expect(daysBetween('2026-03-01', '2026-04-01')).toBe(31);
  });
});

describe('SM-2 review', () => {
  it('a new card is due immediately', () => {
    expect(isDue(newCard(T), T)).toBe(true);
  });

  it('good grows the interval 1 → 3 → ×ease', () => {
    let c = newCard(T);
    c = review(c, 'good', T);
    expect([c.interval, c.due, c.reps]).toEqual([1, '2026-11-25', 1]);
    c = review(c, 'good', c.due);
    expect([c.interval, c.due]).toEqual([3, '2026-11-28']);
    c = review(c, 'good', c.due);
    expect(c.interval).toBe(8); // round(3 × 2.5)
    expect(c.ease).toBe(2.5);
  });

  it('again is a lapse: resets reps, lowers ease, due today', () => {
    let c = review(review(newCard(T), 'good', T), 'good', '2026-11-25');
    c = review(c, 'again', '2026-11-28');
    expect(c).toMatchObject({ reps: 0, lapses: 1, interval: 0, due: '2026-11-28', ease: 2.3 });
    // after a lapse the card restarts at 1 day
    expect(review(c, 'good', '2026-11-28').interval).toBe(1);
  });

  it('ease never drops below the floor', () => {
    let c: CardState = newCard(T);
    for (let i = 0; i < 20; i++) c = review(c, 'again', T);
    expect(c.ease).toBe(MIN_EASE);
    for (let i = 0; i < 20; i++) c = review(c, 'hard', c.due);
    expect(c.ease).toBe(MIN_EASE);
  });

  it('easy raises ease and jumps ahead', () => {
    const c = review(newCard(T), 'easy', T);
    expect(c.interval).toBe(4);
    expect(c.ease).toBe(2.65);
  });

  it('intervals are always ordered hard < good < easy', () => {
    const states: CardState[] = [newCard(T)];
    let c = newCard(T);
    for (const r of ['good', 'good', 'hard', 'easy', 'good', 'again', 'good', 'good'] as const) {
      c = review(c, r, c.due);
      states.push(c);
    }
    for (const s of states) {
      const h = nextInterval(s, 'hard');
      const g = nextInterval(s, 'good');
      const e = nextInterval(s, 'easy');
      expect(h).toBeGreaterThanOrEqual(1);
      expect(h).toBeLessThan(g + (s.reps === 0 ? 1 : 0)); // first review: hard = good = 1 day
      expect(e).toBeGreaterThan(g);
    }
  });

  it('caps intervals at a year', () => {
    let c = newCard(T);
    for (let i = 0; i < 30; i++) c = review(c, 'easy', c.due);
    expect(c.interval).toBeLessThanOrEqual(365);
  });

  it('does not mutate the input card', () => {
    const c = newCard(T);
    review(c, 'good', T);
    expect(c).toEqual(newCard(T));
  });
});

describe('labels', () => {
  it('formats intervals', () => {
    expect([0, 1, 6, 45, 400].map(formatInterval)).toEqual(['today', '1 day', '6 days', '2 mo', '1 yr']);
  });
  it('previews the four buttons for a new card', () => {
    expect(previewIntervals(newCard(T))).toEqual({ again: 'again today', hard: '1 day', good: '1 day', easy: '4 days' });
  });
});

describe('queue', () => {
  const cards: Record<string, CardState> = {
    newer: { ...newCard('2026-11-23') },
    older: { ...newCard('2026-11-20') },
    review1: { ...newCard('2026-11-01'), reps: 2, interval: 3, due: '2026-11-22', lastReviewed: '2026-11-19' },
    review2: { ...newCard('2026-11-01'), reps: 1, interval: 1, due: '2026-11-24', lastReviewed: '2026-11-23' },
    later: { ...newCard('2026-11-01'), reps: 3, interval: 8, due: '2026-12-02', lastReviewed: '2026-11-24' },
  };
  it('puts overdue reviews first, then new cards oldest first, skipping future cards', () => {
    expect(buildQueue(cards, T)).toEqual(['review1', 'review2', 'older', 'newer']);
  });
  it('skips cards whose vocab no longer exists', () => {
    expect(buildQueue(cards, T, new Set(['older', 'later']))).toEqual(['older']);
  });
  it('finds the next due date', () => {
    expect(nextDueDate(cards, T)).toBe('2026-12-02');
  });
});

describe('deck helpers', () => {
  it('adds only cards not already in the deck', () => {
    const { deck, added } = withCards(EMPTY_DECK, ['a', 'b'], T);
    expect(added).toEqual(['a', 'b']);
    const again = withCards(deck, ['b', 'c'], T);
    expect(again.added).toEqual(['c']);
    expect(Object.keys(again.deck.cards)).toEqual(['a', 'b', 'c']);
  });
  it('records reviews per day', () => {
    let { deck } = withCards(EMPTY_DECK, ['a'], T);
    deck = withReview(deck, 'a', 'good', T);
    deck = withReview(deck, 'a', 'again', T);
    expect(deck.reviewsByDay[T]).toBe(2);
    expect(deck.cards.a.lapses).toBe(1);
  });
  it('removes a card', () => {
    const { deck } = withCards(EMPTY_DECK, ['a'], T);
    expect(withoutCard(deck, 'a').cards).toEqual({});
  });
  it('throws when reviewing a missing card', () => {
    expect(() => withReview(EMPTY_DECK, 'nope', 'good', T)).toThrow();
  });
});
