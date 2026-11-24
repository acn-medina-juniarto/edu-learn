/**
 * Build-time content access. Loads lessons, runs integrity checks once,
 * and fails the build with a readable message if anything is wrong.
 */
import { getCollection } from 'astro:content';
import { checkEmail, checkGrammar, checkKanji, checkKeigo, checkLessons, checkReading, jaStrings } from './integrity';
import type { EmailTemplate, GrammarPoint, KanjiEntry, KeigoFile, Lesson, ReadingPassage } from './schemas';
import { LEVEL_IDS, type Level } from './levels';

const byLevelThen = <T extends { level: Level }>(get: (x: T) => number | string) => (a: T, b: T) =>
  LEVEL_IDS.indexOf(a.level) - LEVEL_IDS.indexOf(b.level) || (get(a) < get(b) ? -1 : get(a) > get(b) ? 1 : 0);

/** Grammar points N5 → N1 (validated), with their collection entry for rendering the body. */
export async function getGrammar() {
  const entries = await getCollection('grammar');
  const lessons = await getLessons();
  const points = entries.map((e) => ({ ...e.data, file: e.id }));
  const errors = checkGrammar(points, new Set(lessons.map((l) => l.id)));
  if (errors.length) fail('Grammar', errors);
  return entries
    .map((entry) => ({ entry, point: entry.data as GrammarPoint }))
    .sort((a, b) => byLevelThen<GrammarPoint>((p) => p.order)(a.point, b.point));
}

export async function getKanji(): Promise<Array<{ level: Level; reviewed: boolean; kanji: KanjiEntry[] }>> {
  const entries = await getCollection('kanji');
  const files = entries.map((e) => e.data);
  const errors = checkKanji(files);
  if (errors.length) fail('Kanji', errors);
  return files.sort((a, b) => LEVEL_IDS.indexOf(a.level) - LEVEL_IDS.indexOf(b.level));
}

export async function getReading(): Promise<ReadingPassage[]> {
  const entries = await getCollection('reading');
  const passages = entries.map((e) => e.data);
  const errors = checkReading(passages);
  if (errors.length) fail('Reading', errors);
  return passages.sort(byLevelThen<ReadingPassage>((p) => p.id));
}

function fail(kind: string, errors: string[]): never {
  throw new Error(`${kind} content has ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
}

/** All keigo files merged (validated). */
export async function getKeigo(): Promise<KeigoFile & { files: string[] }> {
  const entries = await getCollection('keigo');
  const errors = entries.flatMap((e) => checkKeigo(e.data, e.id));
  if (errors.length) fail('Keigo', errors);
  return {
    files: entries.map((e) => e.id),
    reviewed: entries.every((e) => e.data.reviewed),
    notes: entries.flatMap((e) => e.data.notes),
    entries: entries.flatMap((e) => e.data.entries),
  };
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const entries = await getCollection('emails');
  const templates = entries.map((e) => e.data).sort((a, b) => a.order - b.order);
  const errors = templates.flatMap(checkEmail);
  if (errors.length) fail('Email template', errors);
  return templates;
}

let cache: Lesson[] | undefined;

export async function getLessons(): Promise<Lesson[]> {
  if (cache) return cache;
  const entries = await getCollection('lessons');
  const lessons = entries.map((e) => e.data).sort((a, b) => a.order - b.order);
  const errors = checkLessons(lessons);
  if (errors.length) {
    throw new Error(`Lesson content has ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  }
  cache = lessons;
  return lessons;
}

export interface ReviewItem {
  path: string;
  note: string;
  context?: string;
}

/** Every needsReview note in a lesson, with the Japanese text it refers to. */
export function reviewItems(l: Lesson): ReviewItem[] {
  const items: ReviewItem[] = [];
  l.vocab.forEach((v, i) => {
    if (v.needsReview) items.push({ path: `vocab[${i}] ${v.word}`, note: v.needsReview, context: v.example.ja });
    if (v.example.needsReview) items.push({ path: `vocab[${i}].example`, note: v.example.needsReview, context: v.example.ja });
  });
  l.dialogue.lines.forEach((d, i) => {
    if (d.needsReview) items.push({ path: `dialogue line ${i + 1}`, note: d.needsReview, context: d.ja });
  });
  l.notes.forEach((n) => {
    if (n.needsReview) items.push({ path: `note: ${n.title}`, note: n.needsReview });
  });
  l.quiz.forEach((q) => {
    if (q.needsReview) items.push({ path: `quiz ${q.id}`, note: q.needsReview });
  });
  return items;
}

/** Number of Japanese strings in a lesson (shown on the review page). */
export function jaStringCount(l: Lesson): number {
  return jaStrings(l).length + l.vocab.length;
}
