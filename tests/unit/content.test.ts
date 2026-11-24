/**
 * Validates every file in content/lessons against the Zod schema and the
 * cross-field integrity checks. `npm test` fails if any lesson is broken.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { emailTemplate, grammarPoint, kanjiFile, keigoFile, lesson, readingPassage, type Lesson } from '../../src/lib/schemas';
import { checkEmail, checkGrammar, checkKanji, checkKeigo, checkLessons, checkReading } from '../../src/lib/integrity';

const dir = join(__dirname, '../../content/lessons');
const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

function frontmatter(file: string): unknown {
  const src = readFileSync(join(dir, file), 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`${file}: missing frontmatter`);
  return parse(m[1]);
}

describe('lesson content', () => {
  const parsed: Lesson[] = [];

  it('has the five starter lessons', () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  for (const file of files) {
    it(`${file} matches the lesson schema`, () => {
      const result = lesson.safeParse(frontmatter(file));
      if (!result.success) {
        const msgs = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
        throw new Error(`${file}\n  ${msgs.join('\n  ')}`);
      }
      parsed.push(result.data);
      expect(result.data.reviewed).toBe(false); // flip to true only after native review
    });
  }

  it('passes integrity checks (ids, links, quiz answers)', () => {
    expect(parsed.length).toBe(files.length);
    expect(checkLessons(parsed)).toEqual([]);
  });

  it('keigo reference files are valid', () => {
    const kdir = join(__dirname, '../../content/keigo');
    const kfiles = readdirSync(kdir).filter((f) => f.endsWith('.json'));
    expect(kfiles.length).toBeGreaterThan(0);
    for (const f of kfiles) {
      const r = keigoFile.safeParse(JSON.parse(readFileSync(join(kdir, f), 'utf8')));
      if (!r.success) throw new Error(`${f}\n  ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ')}`);
      expect(r.data.reviewed).toBe(false);
      expect(checkKeigo(r.data, f)).toEqual([]);
    }
  });

  it('email templates are valid and every placeholder has a field', () => {
    const edir = join(__dirname, '../../content/emails');
    const efiles = readdirSync(edir).filter((f) => /^\d.*\.md$/.test(f));
    expect(efiles.length).toBe(4);
    for (const f of efiles) {
      const src = readFileSync(join(edir, f), 'utf8');
      const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const r = emailTemplate.safeParse(parse(m![1]));
      if (!r.success) throw new Error(`${f}\n  ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ')}`);
      expect(r.data.reviewed).toBe(false);
      expect(checkEmail(r.data)).toEqual([]);
    }
  });

  it('study sections (grammar, kanji, reading) are valid for every JLPT level', () => {
    const root = join(__dirname, '../../content');
    const fm = (path: string) => parse(readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]);
    const fail = (f: string, issues: Array<{ path: PropertyKey[]; message: string }>) => {
      throw new Error(`${f}\n  ${issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ')}`);
    };

    const points = [];
    for (const level of ['n5', 'n4', 'n3', 'n2', 'n1']) {
      const files = readdirSync(join(root, 'grammar', level)).filter((f) => f.endsWith('.md'));
      expect(files.length, `grammar ${level}`).toBeGreaterThanOrEqual(2);
      for (const f of files) {
        const r = grammarPoint.safeParse(fm(join(root, 'grammar', level, f)));
        if (!r.success) fail(f, r.error.issues);
        expect(r.data!.reviewed).toBe(false);
        points.push({ ...r.data!, file: `${level}/${f.replace(/\.md$/, '')}` });
      }
    }
    expect(checkGrammar(points, new Set(parsed.map((l) => l.id)))).toEqual([]);

    const kanji = readdirSync(join(root, 'kanji')).map((f) => {
      const r = kanjiFile.safeParse(JSON.parse(readFileSync(join(root, 'kanji', f), 'utf8')));
      if (!r.success) fail(f, r.error.issues);
      expect(r.data!.kanji.length).toBeGreaterThanOrEqual(3);
      return r.data!;
    });
    expect(kanji.map((k) => k.level).sort()).toEqual(['N1', 'N2', 'N3', 'N4', 'N5']);
    expect(checkKanji(kanji)).toEqual([]);

    const readings = readdirSync(join(root, 'reading')).map((f) => {
      const r = readingPassage.safeParse(fm(join(root, 'reading', f)));
      if (!r.success) fail(f, r.error.issues);
      return r.data!;
    });
    expect(new Set(readings.map((r) => r.level)).size).toBe(5);
    expect(checkReading(readings)).toEqual([]);
  });

  it('every lesson has 8-12 vocab items and one dialogue', () => {
    for (const l of parsed) {
      expect(l.vocab.length).toBeGreaterThanOrEqual(8);
      expect(l.vocab.length).toBeLessThanOrEqual(12);
      expect(l.dialogue.lines.length).toBeGreaterThan(0);
    }
  });
});
