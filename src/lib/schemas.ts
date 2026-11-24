/**
 * Content schemas (Zod). Used by src/content.config.ts at build time and by
 * tests/unit/content.test.ts, so a broken content file fails both.
 *
 * Japanese strings use furigana markup: {漢字|かんじ} or {漢字|かんじ|vocabId}.
 * Every file carries `reviewed: false` until a native speaker checks it, and any
 * item may carry `needsReview: "note"` for something uncertain.
 */
import { z } from 'astro/zod';

// ---------------------------------------------------------------- shared
export const politeness = z.enum(['casual', 'teinei', 'keigo']);
export const vocabPoliteness = z.enum(['neutral', 'casual', 'teinei', 'keigo']);
export const jlptLevel = z.enum(['N5', 'N4', 'N3', 'N2', 'N1']);
export const category = z.enum(['meetings', 'phone', 'email', 'keigo']);
export const partOfSpeech = z.enum([
  'noun',
  'suru-noun',
  'verb-godan',
  'verb-ichidan',
  'verb-irregular',
  'i-adj',
  'na-adj',
  'adverb',
  'expression',
  'counter',
  'prefix',
  'suffix',
  'pronoun',
  'conjunction',
]);

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are lowercase-kebab-case');
const ja = z.string().min(1); // furigana markup
const needsReview = z.string().min(1).optional();

export const example = z.object({
  ja,
  en: z.string().min(1),
  politeness,
  needsReview,
});

// ---------------------------------------------------------------- vocab
export const vocabItem = z.object({
  id, // unique across the whole site; doubles as the flashcard id
  word: z.string().min(1), // as written, e.g. 名刺
  reading: z.string().regex(/^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u, 'reading must be kana'),
  meaning: z.string().min(1),
  pos: partOfSpeech,
  politeness: vocabPoliteness,
  example,
  /** e.g. the plain form a keigo word comes from */
  related: z.string().optional(),
  needsReview,
});

// ---------------------------------------------------------------- dialogue
export const speaker = z.object({
  id,
  name: z.string().min(1),
  nameJa: ja,
  role: z.string().min(1),
});

export const dialogueLine = z.object({
  speaker: id,
  ja,
  en: z.string().min(1),
  politeness,
  /**
   * Controlled kana reading. Normally derived from the furigana markup; set it
   * when that is wrong or when pronunciation must be controlled (phone numbers,
   * dates, codes). When set, it is also the text sent to speech, because Web
   * Speech pronunciation of digits varies by browser and OS.
   */
  reading: z.string().optional(),
  note: z.string().optional(),
  needsReview,
});

export const dialogue = z.object({
  setting: z.string().min(1),
  speakers: z.array(speaker).min(2),
  lines: z.array(dialogueLine).min(4),
});

// ---------------------------------------------------------------- notes
export const note = z.object({
  type: z.enum(['grammar', 'keigo', 'culture']),
  title: z.string().min(1),
  level: jlptLevel.optional(),
  body: z.string().min(1), // Markdown + furigana markup
  needsReview,
});

// ---------------------------------------------------------------- quiz
const choice = z.object({
  ja: z.string().optional(), // furigana markup
  text: z.string().optional(), // English option
  correct: z.boolean().optional(),
  /** Shown when this wrong choice is picked ("Close! ...") */
  feedback: z.string().optional(),
});

export const multipleChoice = z.object({
  id,
  type: z.literal('multiple-choice'),
  prompt: z.string().min(1),
  promptJa: ja.optional(),
  choices: z.array(choice).min(2).max(5),
  explanation: z.string().min(1),
  needsReview,
});

export const fillBlank = z.object({
  id,
  type: z.literal('fill-blank'),
  prompt: z.string().min(1),
  /** Sentence with exactly one ___ blank */
  ja: ja.refine((s) => s.split('___').length === 2, 'fill-blank needs exactly one ___'),
  en: z.string().min(1),
  answers: z.array(z.string().min(1)).min(1), // accepted answers, kana and/or kanji
  hint: z.string().optional(),
  explanation: z.string().min(1),
  needsReview,
});

export const sentenceOrder = z.object({
  id,
  type: z.literal('sentence-order'),
  prompt: z.string().min(1),
  /** Tokens in the correct order; shuffled at runtime */
  tokens: z.array(ja).min(3).max(8),
  en: z.string().min(1),
  explanation: z.string().min(1),
  needsReview,
});

export const quizQuestion = z.discriminatedUnion('type', [multipleChoice, fillBlank, sentenceOrder]);

// ---------------------------------------------------------------- lesson
export const lesson = z.object({
  id,
  order: z.number().int().positive(),
  title: z.string().min(1),
  titleJa: ja,
  summary: z.string().min(1),
  category,
  level: jlptLevel,
  politeness,
  minutes: z.number().int().min(3).max(20),
  objectives: z.array(z.string().min(1)).min(1).max(5),
  reviewed: z.boolean(),
  vocab: z.array(vocabItem).min(8).max(12),
  dialogue,
  notes: z.array(note).min(1),
  quiz: z.array(quizQuestion).min(3),
});

// ---------------------------------------------------------------- study sections (content arrives later)
/** content/grammar/<level>/<id>.md: frontmatter + Markdown body (the explanation) */
export const grammarPoint = z.object({
  id,
  order: z.number().int().positive(), // order within its level
  pattern: ja, // e.g. 〜に{基|もと}づいて
  level: jlptLevel,
  meaning: z.string().min(1),
  formation: z.string().min(1), // may contain furigana markup
  politeness, // register of the examples
  examples: z.array(example).min(2),
  related: z.array(id).default([]), // other grammar ids
  lesson: id.optional(), // a lesson that uses this pattern
  reviewed: z.boolean(),
  needsReview,
});

const kana = z.string().regex(/^[\p{Script=Hiragana}\p{Script=Katakana}ー・.\-]+$/u, 'readings must be kana');

export const kanjiEntry = z.object({
  char: z.string().regex(/^\p{Script=Han}$/u, 'one kanji'),
  meanings: z.array(z.string().min(1)).min(1),
  onyomi: z.array(kana).default([]), // katakana
  kunyomi: z.array(kana).default([]), // hiragana; "-" marks okurigana: あ-う
  strokes: z.number().int().positive(),
  examples: z
    .array(z.object({ word: z.string().min(1), reading: kana, meaning: z.string().min(1) }))
    .min(1),
  businessCommon: z.boolean().default(false),
  needsReview,
});
/** content/kanji/<level>.json */
export const kanjiFile = z.object({ level: jlptLevel, reviewed: z.boolean(), kanji: z.array(kanjiEntry).min(1) });

/** content/reading/<level>-<slug>.md: a short graded reading with questions */
export const readingPassage = z.object({
  id,
  level: jlptLevel,
  title: z.string().min(1),
  titleJa: ja,
  summary: z.string().min(1),
  genre: z.enum(['notice', 'email', 'memo', 'letter', 'article', 'chat']),
  politeness,
  minutes: z.number().int().min(1).max(20),
  paragraphs: z.array(z.object({ ja, en: z.string().min(1), needsReview })).min(2),
  glossary: z.array(z.object({ word: z.string().min(1), reading: kana, meaning: z.string().min(1) })).min(2),
  questions: z.array(quizQuestion).min(2),
  reviewed: z.boolean(),
  needsReview,
});

export const keigoEntry = z.object({
  id,
  plain: ja,
  meaning: z.string().min(1),
  sonkeigo: z.array(ja), // 尊敬語 (raising the other person); [] = no special form
  kenjougo: z.array(ja), // 謙譲語 (lowering yourself); [] = no special form
  teineigo: ja, // 丁寧語 (です・ます)
  examples: z.array(example).default([]),
  notes: z.string().optional(),
  needsReview,
});

/** content/keigo/*.json: one file = { reviewed, notes, entries } */
export const keigoFile = z.object({
  reviewed: z.boolean(),
  notes: z.array(note).default([]),
  entries: z.array(keigoEntry).min(1),
});

export const emailField = z.object({
  key: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/, 'field keys are camelCase letters/digits'),
  label: z.string().min(1),
  placeholder: z.string().min(1), // shown as 〔placeholder〕 when empty
  exampleJa: z.string().min(1), // used by "Fill with example"
});

export const emailBlock = z.object({
  role: z.enum(['addressee', 'opening', 'body', 'closing', 'signature']),
  ja, // furigana markup; may contain {{fieldKey}} and \n
  en: z.string().min(1),
  explanation: z.string().min(1),
  politeness,
  needsReview,
});

export const emailTemplate = z.object({
  id,
  order: z.number().int().positive(),
  category: z.enum(['greeting', 'request', 'apology', 'follow-up', 'thanks']),
  title: z.string().min(1),
  titleJa: ja,
  summary: z.string().min(1),
  subject: ja, // may contain {{fieldKey}}
  fields: z.array(emailField).min(1),
  blocks: z.array(emailBlock).min(3),
  reviewed: z.boolean(),
  needsReview,
});

// ---------------------------------------------------------------- types
export type Lesson = z.infer<typeof lesson>;
export type VocabItem = z.infer<typeof vocabItem>;
export type DialogueLine = z.infer<typeof dialogueLine>;
export type QuizQuestion = z.infer<typeof quizQuestion>;
export type Note = z.infer<typeof note>;
export type GrammarPoint = z.infer<typeof grammarPoint>;
export type KanjiEntry = z.infer<typeof kanjiEntry>;
export type KanjiFile = z.infer<typeof kanjiFile>;
export type ReadingPassage = z.infer<typeof readingPassage>;
export type KeigoEntry = z.infer<typeof keigoEntry>;
export type KeigoFile = z.infer<typeof keigoFile>;
export type EmailTemplate = z.infer<typeof emailTemplate>;
export type EmailField = z.infer<typeof emailField>;
export type EmailBlock = z.infer<typeof emailBlock>;
