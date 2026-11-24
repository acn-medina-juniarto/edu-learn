/**
 * Browser-side summary of everything the learner has done, combining
 * progress (lessons, quizzes, active days) and the flashcard deck.
 */
import { readDeck, today as todayKey } from './deck';
import { readProgress } from './progress';
import { buildQueue } from './srs';
import { computeStreak, type Streak } from './streak';

export interface Activity {
  today: string;
  completed: Set<string>;
  quizBest: Record<string, number>;
  deckSize: number;
  due: number;
  reviewsByDay: Record<string, number>;
  studyDays: string[];
  streak: Streak;
}

export function readActivity(validCardIds?: ReadonlySet<string>): Activity {
  const today = todayKey();
  const p = readProgress();
  const d = readDeck();
  const cardIds = Object.keys(d.cards).filter((id) => !validCardIds || validCardIds.has(id));
  // A study day = finished a lesson, took a quiz, or reviewed a flashcard
  const studyDays = [...new Set([...p.activeDays, ...Object.keys(d.reviewsByDay)])].sort();
  return {
    today,
    completed: new Set(Object.keys(p.lessons)),
    quizBest: Object.fromEntries(Object.entries(p.quizzes ?? {}).map(([k, v]) => [k, v.best ?? 0])),
    deckSize: cardIds.length,
    due: buildQueue(d.cards, today, validCardIds).length,
    reviewsByDay: d.reviewsByDay,
    studyDays,
    streak: computeStreak(studyDays, today),
  };
}
