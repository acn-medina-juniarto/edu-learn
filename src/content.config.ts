/**
 * Content collections. Files live in /content (outside src/) so content can be
 * edited without touching code. Schemas are in src/lib/schemas.ts.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { emailTemplate, grammarPoint, kanjiFile, keigoFile, lesson, readingPassage } from './lib/schemas';

const lessons = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/lessons' }),
  schema: lesson,
});

const keigo = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/keigo' }),
  schema: keigoFile,
});

const emails = defineCollection({
  // Only numbered files (01-greeting.md); README.md is documentation
  loader: glob({ pattern: '[0-9]*.md', base: './content/emails' }),
  schema: emailTemplate,
});

// Study sections, JLPT N5 → N1
const grammar = defineCollection({
  loader: glob({ pattern: 'n[1-5]/*.md', base: './content/grammar' }),
  schema: grammarPoint,
});

const kanji = defineCollection({
  loader: glob({ pattern: 'n[1-5].json', base: './content/kanji' }),
  schema: kanjiFile,
});

const reading = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/reading' }),
  schema: readingPassage,
});

export const collections = { lessons, keigo, emails, grammar, kanji, reading };
