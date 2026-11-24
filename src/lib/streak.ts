/**
 * Study streaks from the list of local study days (YYYY-MM-DD).
 * Messages are always kind: a missed day is "Welcome back!", never guilt.
 *
 *  - active:  studied today; current = consecutive days ending today
 *  - pending: studied yesterday, not yet today; streak still alive
 *  - broken:  last study day was before yesterday; current = 0
 *  - none:    never studied
 */
import { addDays, daysBetween } from './srs';

export type StreakStatus = 'active' | 'pending' | 'broken' | 'none';

export interface Streak {
  status: StreakStatus;
  current: number;
  longest: number;
  lastActive?: string;
  /** Days studied in the 7 days ending today (for the week row) */
  week: Array<{ date: string; studied: boolean }>;
}

function runEndingAt(days: Set<string>, end: string): number {
  let n = 0;
  let d = end;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

function longestRun(sorted: string[]): number {
  let best = 0;
  let run = 0;
  let prev: string | undefined;
  for (const d of sorted) {
    run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function computeStreak(activeDays: string[], today: string): Streak {
  const sorted = [...new Set(activeDays)].filter((d) => d <= today).sort();
  const set = new Set(sorted);
  const yesterday = addDays(today, -1);
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return { date, studied: set.has(date) };
  });
  const lastActive = sorted[sorted.length - 1];
  const longest = longestRun(sorted);

  if (!lastActive) return { status: 'none', current: 0, longest: 0, week };
  if (set.has(today)) return { status: 'active', current: runEndingAt(set, today), longest, lastActive, week };
  if (set.has(yesterday)) return { status: 'pending', current: runEndingAt(set, yesterday), longest, lastActive, week };
  return { status: 'broken', current: 0, longest, lastActive, week };
}

export function streakMessage(s: Streak): { title: string; body: string } {
  const days = (n: number) => `${n}-day streak`;
  switch (s.status) {
    case 'active':
      return {
        title: days(s.current),
        body: s.current === 1 ? 'Great start. See you tomorrow!' : 'Nice and steady. You studied today.',
      };
    case 'pending':
      return { title: days(s.current), body: 'A quick session today keeps it going.' };
    case 'broken':
      return { title: 'Welcome back!', body: 'Every day is a fresh start.' };
    default:
      return { title: 'Ready when you are', body: 'Finish a lesson to start your streak.' };
  }
}
