/**
 * Quiz grading. Pure functions, no DOM: unit-tested in tests/unit/grading.test.ts.
 */
import { toPlain } from './furigana';

type MC = { choices: Array<{ correct?: boolean; feedback?: string }> };
type FillBlank = { answers: string[] };
type SentenceOrder = { tokens: string[] };

/** Katakana → hiragana so カシコマリ and かしこまり compare equal. */
function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/**
 * Normalize a typed answer: Unicode NFKC (full/half width), strip furigana
 * markup, all whitespace (incl. full-width), and surrounding punctuation;
 * katakana folded to hiragana. Kanji are kept, so 確認 ≠ かくにん unless
 * both are listed as accepted answers.
 */
export function normalizeAnswer(input: string): string {
  return toHiragana(toPlain(input).normalize('NFKC'))
    .replace(/\s+/gu, '')
    .replace(/^[。、．，.,!！?？「」『』…~〜]+|[。、．，.,!！?？「」『』…~〜]+$/gu, '');
}

export interface MCResult {
  correct: boolean;
  correctIndex: number;
  /** Feedback for the chosen wrong option, if any */
  feedback?: string;
}

export function gradeMultipleChoice(q: MC, chosen: number): MCResult {
  const correctIndex = q.choices.findIndex((c) => c.correct);
  const choice = q.choices[chosen];
  if (!choice) throw new RangeError(`choice ${chosen} out of range`);
  const correct = chosen === correctIndex;
  return { correct, correctIndex, ...(correct ? {} : { feedback: choice.feedback }) };
}

/** Levenshtein distance, small strings only. */
export function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export interface FillBlankResult {
  correct: boolean;
  /** One character off a 3+ character answer: "Almost! Check the spelling." */
  close: boolean;
  /** The accepted answer the input matched (or was closest to) */
  expected: string;
}

export function gradeFillBlank(q: FillBlank, input: string): FillBlankResult {
  const given = normalizeAnswer(input);
  const hit = q.answers.find((a) => normalizeAnswer(a) === given);
  if (hit) return { correct: true, close: false, expected: hit };
  if (!given) return { correct: false, close: false, expected: q.answers[0] };
  const nearest = q.answers
    .map((a) => ({ a, d: editDistance(normalizeAnswer(a), given) }))
    .sort((x, y) => x.d - y.d)[0];
  const close = nearest.d === 1 && normalizeAnswer(nearest.a).length >= 3;
  return { correct: false, close, expected: close ? nearest.a : q.answers[0] };
}

export interface OrderResult {
  correct: boolean;
  /** Index of the first token in the wrong position, or -1 */
  firstWrong: number;
}

/**
 * `order` lists token indices in the learner's order. Correct when the joined
 * text matches, so identical duplicate tokens can be placed either way.
 */
export function gradeSentenceOrder(q: SentenceOrder, order: number[]): OrderResult {
  if (order.length !== q.tokens.length) return { correct: false, firstWrong: Math.min(order.length, q.tokens.length) };
  const expected = q.tokens.map(toPlain);
  const given = order.map((i) => toPlain(q.tokens[i] ?? ''));
  const firstWrong = given.findIndex((t, i) => t !== expected[i]);
  return { correct: firstWrong === -1, firstWrong };
}

/** Deterministic PRNG (mulberry32) for tests; pass Math.random in the UI. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle of 0..n-1. For n > 1 the result never equals the original order. */
export function shuffledIndices(n: number, rand: () => number = Math.random): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return idx;
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    if (idx.some((v, i) => v !== i)) return idx;
  }
  return [...idx.slice(1), idx[0]]; // fallback rotation
}

export interface QuizScore {
  correct: number;
  total: number;
  ratio: number; // 0..1
}

export function scoreQuiz(results: boolean[]): QuizScore {
  const correct = results.filter(Boolean).length;
  const total = results.length;
  return { correct, total, ratio: total ? correct / total : 0 };
}
