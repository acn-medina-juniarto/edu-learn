import { describe, expect, it } from 'vitest';
import { computeStreak, streakMessage } from '../../src/lib/streak';
import { buildBackup, describeBackup, parseBackup, resetAll, restoreBackup } from '../../src/lib/backup';

const T = '2026-11-24';

describe('streak', () => {
  it('none when never studied', () => {
    const s = computeStreak([], T);
    expect(s).toMatchObject({ status: 'none', current: 0, longest: 0 });
    expect(s.week).toHaveLength(7);
    expect(streakMessage(s).title).toBe('Ready when you are');
  });

  it('active: counts consecutive days ending today', () => {
    const s = computeStreak(['2026-11-20', '2026-11-22', '2026-11-23', '2026-11-24'], T);
    expect(s).toMatchObject({ status: 'active', current: 3, longest: 3 });
    expect(streakMessage(s).title).toBe('3-day streak');
  });

  it('pending: studied yesterday, streak still alive', () => {
    const s = computeStreak(['2026-11-22', '2026-11-23'], T);
    expect(s).toMatchObject({ status: 'pending', current: 2 });
    expect(streakMessage(s).body).toContain('keeps it going');
  });

  it('broken: a gap gives a kind welcome back, and keeps the longest', () => {
    const s = computeStreak(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-20'], T);
    expect(s).toMatchObject({ status: 'broken', current: 0, longest: 3, lastActive: '2026-11-20' });
    expect(streakMessage(s).title).toBe('Welcome back!');
  });

  it('works across month boundaries and ignores duplicates / future dates', () => {
    const s = computeStreak(['2026-10-31', '2026-11-01', '2026-11-01', '2026-12-25'], '2026-11-01');
    expect(s).toMatchObject({ status: 'active', current: 2 });
  });

  it('builds the 7-day week row ending today', () => {
    const s = computeStreak(['2026-11-24', '2026-11-18'], T);
    expect(s.week[0]).toEqual({ date: '2026-11-18', studied: true });
    expect(s.week[6]).toEqual({ date: '2026-11-24', studied: true });
    expect(s.week.filter((d) => d.studied)).toHaveLength(2);
  });
});

function memStorage(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return {
    get length() {
      return m.size;
    },
    key: (i: number) => [...m.keys()][i] ?? null,
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    dump: () => Object.fromEntries(m),
  };
}

describe('backup', () => {
  const progress = { version: 1, lessons: { a: { completedAt: 'x', lastStudiedAt: 'x' } }, activeDays: [T] };

  it('exports only site keys', () => {
    const s = memStorage({ 'bj:v1:progress': JSON.stringify(progress), other: '"x"' });
    const b = buildBackup(s, new Date('2026-11-24T00:00:00Z'));
    expect(Object.keys(b.data)).toEqual(['bj:v1:progress']);
    expect(b).toMatchObject({ app: 'biz-nihongo', version: 1, exportedAt: '2026-11-24T00:00:00.000Z' });
    expect(describeBackup(b)).toEqual({ lessons: 1, cards: 0, days: 1 });
  });

  it('round-trips through JSON and replaces existing data', () => {
    const src = memStorage({ 'bj:v1:progress': JSON.stringify(progress) });
    const text = JSON.stringify(buildBackup(src));
    const dest = memStorage({ 'bj:v1:deck': '{"version":1,"cards":{}}', keep: '1' });
    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) restoreBackup(dest, parsed.backup);
    expect(dest.dump()).toEqual({ keep: '1', 'bj:v1:progress': JSON.stringify(progress) });
  });

  it('rejects files that are not backups', () => {
    expect(parseBackup('not json')).toMatchObject({ ok: false });
    expect(parseBackup('{"app":"other"}')).toMatchObject({ ok: false });
    expect(parseBackup('{"app":"biz-nihongo","version":2,"data":{}}')).toMatchObject({ ok: false });
    expect(parseBackup('{"app":"biz-nihongo","version":1,"data":{"evil":1}}')).toMatchObject({ ok: false });
  });

  it('reset removes only site keys', () => {
    const s = memStorage({ 'bj:v1:progress': '{}', other: '1' });
    resetAll(s);
    expect(s.dump()).toEqual({ other: '1' });
  });
});
