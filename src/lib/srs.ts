/**
 * Spaced repetition, SM-2 style. Pure functions on plain data; dates are local
 * calendar days ("YYYY-MM-DD"), so a review at 23:59 and one at 00:01 are on
 * different days, the way learners think about "today".
 *
 * Ratings map to SM-2 quality: again = 0, hard = 3, good = 4, easy = 5.
 *  - again: lapse. Repetitions reset, ease -0.20, due today (shown again this session).
 *  - hard:  ease -0.14, interval grows slowly (×1.2, at least +1 day).
 *  - good:  ease unchanged, intervals 1 → 3 → previous × ease.
 *  - easy:  ease +0.15, interval 4 days first time, then previous × ease × 1.3.
 * Ease never drops below 1.3. Intervals always satisfy hard < good < easy.
 */

export type Rating = 'again' | 'hard' | 'good' | 'easy';
export const RATINGS: Rating[] = ['again', 'hard', 'good', 'easy'];

export interface CardState {
  ease: number;
  /** Days until next review (0 = today) */
  interval: number;
  /** Successful reviews in a row */
  reps: number;
  lapses: number;
  /** Local date the card is next due, YYYY-MM-DD */
  due: string;
  /** Local date the card was added */
  added: string;
  /** Local date of the latest review */
  lastReviewed?: string;
}

export const START_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_INTERVAL = 365;

// ---------------------------------------------------------------- dates
export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12); // noon: immune to DST shifts
}

export function addDays(key: string, days: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseKey(b).getTime() - parseKey(a).getTime()) / 86_400_000);
}

// ---------------------------------------------------------------- cards
export function newCard(today: string): CardState {
  return { ease: START_EASE, interval: 0, reps: 0, lapses: 0, due: today, added: today };
}

export function isNew(c: CardState): boolean {
  return c.reps === 0 && c.lapses === 0 && !c.lastReviewed;
}

export function isDue(c: CardState, today: string): boolean {
  return c.due <= today;
}

const round = (n: number) => Math.round(n);
const clampEase = (e: number) => Math.max(MIN_EASE, Math.round(e * 100) / 100);
const clampInterval = (n: number) => Math.min(MAX_INTERVAL, Math.max(0, n));

/** Interval (days) a rating would give, without changing the card. */
export function nextInterval(c: CardState, rating: Rating): number {
  const prev = c.interval;
  if (rating === 'again') return 0;
  let good: number;
  if (c.reps === 0) good = 1;
  else if (c.reps === 1) good = 3;
  else good = Math.max(prev + 1, round(prev * c.ease));

  if (rating === 'good') return clampInterval(good);
  if (rating === 'hard') {
    const hard = c.reps === 0 ? 1 : Math.max(prev + 1, round(prev * 1.2));
    return clampInterval(Math.min(hard, Math.max(1, good - 1)) || 1);
  }
  const easy = c.reps === 0 ? 4 : round(Math.max(prev, 1) * c.ease * 1.3);
  return clampInterval(Math.max(easy, good + 1));
}

export function review(c: CardState, rating: Rating, today: string): CardState {
  const interval = nextInterval(c, rating);
  if (rating === 'again') {
    return {
      ...c,
      ease: clampEase(c.ease - 0.2),
      interval: 0,
      reps: 0,
      lapses: c.lapses + 1,
      due: today,
      lastReviewed: today,
    };
  }
  const easeDelta = rating === 'hard' ? -0.14 : rating === 'easy' ? 0.15 : 0;
  return {
    ...c,
    ease: clampEase(c.ease + easeDelta),
    interval,
    reps: c.reps + 1,
    due: addDays(today, interval),
    lastReviewed: today,
  };
}

/** Button labels: "today", "1 day", "5 days", "2 mo", "1 yr". */
export function formatInterval(days: number): string {
  if (days <= 0) return 'today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} mo`;
  return `${Math.round(days / 365)} yr`;
}

export function previewIntervals(c: CardState): Record<Rating, string> {
  return {
    again: 'again today',
    hard: formatInterval(nextInterval(c, 'hard')),
    good: formatInterval(nextInterval(c, 'good')),
    easy: formatInterval(nextInterval(c, 'easy')),
  };
}

/**
 * Today's queue: due review cards (oldest first), then new cards in the order
 * they were added. `ids` restricts the queue to cards that still exist in content.
 */
export function buildQueue(cards: Record<string, CardState>, today: string, ids?: ReadonlySet<string>): string[] {
  const entries = Object.entries(cards).filter(([id, c]) => (!ids || ids.has(id)) && isDue(c, today));
  const reviews = entries.filter(([, c]) => !isNew(c)).sort((a, b) => a[1].due.localeCompare(b[1].due));
  const fresh = entries.filter(([, c]) => isNew(c)).sort((a, b) => a[1].added.localeCompare(b[1].added));
  return [...reviews, ...fresh].map(([id]) => id);
}

/** Earliest future due date, for "next review" messages. */
export function nextDueDate(cards: Record<string, CardState>, today: string): string | undefined {
  return Object.values(cards)
    .map((c) => c.due)
    .filter((d) => d > today)
    .sort()[0];
}
