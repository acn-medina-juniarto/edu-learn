/**
 * Learner progress, stored in localStorage under bj:v1:progress.
 * Pure functions (withLessonComplete, withActiveDay, localDateKey) are unit-tested;
 * read/write wrappers handle storage being unavailable.
 */
export const PROGRESS_KEY = 'bj:v1:progress';

export interface LessonProgress {
  completedAt: string; // ISO timestamp of first completion
  lastStudiedAt: string; // ISO timestamp of latest completion
  bestQuizScore?: number; // 0..1
  lastQuizScore?: number; // 0..1
}

export interface QuizAttempt {
  best?: number;
  last?: number;
}

export interface Progress {
  version: 1;
  lessons: Record<string, LessonProgress>;
  /** Quiz scores per lesson; kept separate so a quiz can be taken before "Finish lesson" */
  quizzes?: Record<string, QuizAttempt>;
  /** Local dates (YYYY-MM-DD) with any study activity; used for streaks */
  activeDays: string[];
}

export const EMPTY_PROGRESS: Progress = { version: 1, lessons: {}, activeDays: [] };

/** YYYY-MM-DD in the learner's local time zone. */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function withActiveDay(p: Progress, now: Date): Progress {
  const key = localDateKey(now);
  if (p.activeDays.includes(key)) return p;
  return { ...p, activeDays: [...p.activeDays, key].sort() };
}

export function withLessonComplete(p: Progress, lessonId: string, now: Date): Progress {
  const iso = now.toISOString();
  const prev = p.lessons[lessonId];
  const lessons = {
    ...p.lessons,
    [lessonId]: prev ? { ...prev, lastStudiedAt: iso } : { completedAt: iso, lastStudiedAt: iso },
  };
  return withActiveDay({ ...p, lessons }, now);
}

/** Record a quiz score (0..1). Keeps the best; the latest is stored too. */
export function withQuizScore(p: Progress, lessonId: string, ratio: number, now: Date): Progress {
  const r = Math.max(0, Math.min(1, ratio));
  const prev = p.quizzes?.[lessonId];
  const quizzes = { ...(p.quizzes ?? {}), [lessonId]: { best: Math.max(prev?.best ?? 0, r), last: r } };
  return withActiveDay({ ...p, quizzes }, now);
}

export function recordQuizScore(lessonId: string, ratio: number, now = new Date()): Progress {
  const next = withQuizScore(readProgress(), lessonId, ratio, now);
  writeProgress(next);
  return next;
}

function isProgress(v: unknown): v is Progress {
  return (
    typeof v === 'object' &&
    v !== null &&
    (v as Progress).version === 1 &&
    typeof (v as Progress).lessons === 'object' &&
    Array.isArray((v as Progress).activeDays)
  );
}

export function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isProgress(parsed) ? parsed : structuredClone(EMPTY_PROGRESS);
  } catch {
    return structuredClone(EMPTY_PROGRESS);
  }
}

export function writeProgress(p: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: progress is kept for this page only */
  }
}

export function markLessonComplete(lessonId: string, now = new Date()): Progress {
  const next = withLessonComplete(readProgress(), lessonId, now);
  writeProgress(next);
  return next;
}
