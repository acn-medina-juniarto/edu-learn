/**
 * Cross-field checks Zod can't express on its own. Run at build time (the
 * lessons index page throws on errors) and in unit tests against /content.
 */
import { parseFurigana } from './furigana';
import { placeholderKeys, withoutPlaceholders } from './email';
import type { EmailTemplate, GrammarPoint, KanjiFile, KeigoFile, Lesson, QuizQuestion, ReadingPassage } from './schemas';

function quizErrors(prefix: string, quiz: QuizQuestion[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  quiz.forEach((q, i) => {
    if (ids.has(q.id)) errors.push(`${prefix} duplicate question id "${q.id}"`);
    ids.add(q.id);
    if (q.type === 'multiple-choice') {
      const correct = q.choices.filter((c) => c.correct).length;
      if (correct !== 1) errors.push(`${prefix} questions[${i}] needs exactly one correct choice (has ${correct})`);
      q.choices.forEach((c, j) => {
        if (!c.ja && !c.text) errors.push(`${prefix} questions[${i}].choices[${j}] needs ja or text`);
        if (!c.correct && !c.feedback) errors.push(`${prefix} questions[${i}].choices[${j}] wrong choice needs feedback`);
      });
    }
  });
  return errors;
}

/** Grammar points: unique ids, folder matches level, related ids exist, markup valid. */
export function checkGrammar(points: Array<GrammarPoint & { file?: string }>, lessonIds: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const ids = new Set(points.map((p) => p.id));
  const seen = new Set<string>();
  for (const p of points) {
    const tag = `[grammar ${p.id}]`;
    if (seen.has(p.id)) errors.push(`${tag} duplicate id`);
    seen.add(p.id);
    if (p.file && !p.file.toLowerCase().startsWith(`${p.level.toLowerCase()}/`)) {
      errors.push(`${tag} file "${p.file}" is not in the ${p.level.toLowerCase()}/ folder`);
    }
    for (const r of p.related) if (!ids.has(r)) errors.push(`${tag} related id "${r}" not found`);
    if (p.lesson && !lessonIds.has(p.lesson)) errors.push(`${tag} lesson "${p.lesson}" not found`);
    errors.push(...markupErrors(`${tag} pattern`, p.pattern), ...markupErrors(`${tag} formation`, p.formation));
    p.examples.forEach((x, i) => errors.push(...markupErrors(`${tag} examples[${i}]`, x.ja)));
  }
  const orders = new Map<string, string>();
  for (const p of points) {
    const k = `${p.level}#${p.order}`;
    if (orders.has(k)) errors.push(`[grammar ${p.id}] order ${p.order} in ${p.level} also used by ${orders.get(k)}`);
    orders.set(k, p.id);
  }
  return errors;
}

/** Kanji: one file per level, no kanji listed twice. */
export function checkKanji(files: KanjiFile[]): string[] {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  const levels = new Set<string>();
  for (const f of files) {
    if (levels.has(f.level)) errors.push(`[kanji] two files for ${f.level}`);
    levels.add(f.level);
    for (const k of f.kanji) {
      if (seen.has(k.char)) errors.push(`[kanji] ${k.char} is in both ${seen.get(k.char)} and ${f.level}`);
      seen.set(k.char, f.level);
      if (!k.examples.some((x) => x.word.includes(k.char))) errors.push(`[kanji] ${k.char}: no example uses the kanji`);
    }
  }
  return errors;
}

export function checkReading(passages: ReadingPassage[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const r of passages) {
    const tag = `[reading ${r.id}]`;
    if (seen.has(r.id)) errors.push(`${tag} duplicate id`);
    seen.add(r.id);
    errors.push(...markupErrors(`${tag} titleJa`, r.titleJa));
    r.paragraphs.forEach((p, i) => errors.push(...markupErrors(`${tag} paragraphs[${i}]`, p.ja)));
    errors.push(...quizErrors(tag, r.questions));
  }
  return errors;
}

/** Shared markup check: balanced braces and no ruby that repeats its base. */
function markupErrors(path: string, text: string): string[] {
  const errors: string[] = [];
  const segs = parseFurigana(text);
  const leftover = segs.map((s) => (s.kind === 'text' ? s.text : '')).join('');
  if (/[{}]/.test(leftover)) errors.push(`${path}: malformed furigana markup in "${text}"`);
  for (const s of segs) {
    if (s.kind === 'ruby' && s.reading && s.reading === s.base) {
      errors.push(`${path}: ruby reading repeats the base "${s.base}"`);
    }
  }
  return errors;
}

export function checkKeigo(file: KeigoFile, name = 'keigo'): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  file.entries.forEach((e, i) => {
    if (seen.has(e.id)) errors.push(`[${name}] duplicate entry id "${e.id}"`);
    seen.add(e.id);
    if (!e.sonkeigo.length && !e.kenjougo.length) errors.push(`[${name}] ${e.id}: needs at least one special form`);
    const strings: Array<[string, string]> = [
      [`entries[${i}].plain`, e.plain],
      [`entries[${i}].teineigo`, e.teineigo],
      ...e.sonkeigo.map((s, j): [string, string] => [`entries[${i}].sonkeigo[${j}]`, s]),
      ...e.kenjougo.map((s, j): [string, string] => [`entries[${i}].kenjougo[${j}]`, s]),
      ...e.examples.map((x, j): [string, string] => [`entries[${i}].examples[${j}]`, x.ja]),
    ];
    for (const [p, t] of strings) errors.push(...markupErrors(`[${name}] ${p}`, t));
  });
  file.notes.forEach((n, i) => errors.push(...markupErrors(`[${name}] notes[${i}]`, n.body)));
  return errors;
}

export function checkEmail(t: EmailTemplate): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`[email ${t.id}] ${m}`);
  const keys = t.fields.map((f) => f.key);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length) err(`duplicate field keys: ${dup.join(', ')}`);
  const texts: Array<[string, string]> = [['subject', t.subject], ...t.blocks.map((b, i): [string, string] => [`blocks[${i}]`, b.ja])];
  const used = new Set<string>();
  for (const [path, text] of texts) {
    for (const k of placeholderKeys(text)) {
      used.add(k);
      if (!keys.includes(k)) err(`${path}: {{${k}}} has no matching field`);
    }
    errors.push(...markupErrors(`[email ${t.id}] ${path}`, withoutPlaceholders(text)));
  }
  for (const k of keys) if (!used.has(k)) err(`field "${k}" is never used`);
  return errors;
}

/** All furigana-markup strings in a lesson, with a path for error messages. */
export function jaStrings(l: Lesson): Array<[path: string, text: string]> {
  const out: Array<[string, string]> = [['titleJa', l.titleJa]];
  l.vocab.forEach((v, i) => out.push([`vocab[${i}].example.ja`, v.example.ja]));
  l.dialogue.speakers.forEach((s, i) => out.push([`dialogue.speakers[${i}].nameJa`, s.nameJa]));
  l.dialogue.lines.forEach((d, i) => {
    out.push([`dialogue.lines[${i}].ja`, d.ja]);
    if (d.note) out.push([`dialogue.lines[${i}].note`, d.note]);
  });
  l.notes.forEach((n, i) => out.push([`notes[${i}].body`, n.body]));
  l.quiz.forEach((q, i) => {
    if (q.type === 'multiple-choice') {
      if (q.promptJa) out.push([`quiz[${i}].promptJa`, q.promptJa]);
      q.choices.forEach((c, j) => c.ja && out.push([`quiz[${i}].choices[${j}].ja`, c.ja]));
    } else if (q.type === 'fill-blank') {
      out.push([`quiz[${i}].ja`, q.ja]);
    } else {
      q.tokens.forEach((t, j) => out.push([`quiz[${i}].tokens[${j}]`, t]));
    }
  });
  return out;
}

/** Checks one lesson. `knownVocab` = vocab ids from all lessons (for cross-links). */
export function checkLesson(l: Lesson, knownVocab: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(`[${l.id}] ${msg}`);

  // vocab ids unique within the lesson
  const seen = new Set<string>();
  for (const v of l.vocab) {
    if (seen.has(v.id)) err(`duplicate vocab id "${v.id}"`);
    seen.add(v.id);
  }

  // speakers
  const speakers = new Set(l.dialogue.speakers.map((s) => s.id));
  l.dialogue.lines.forEach((d, i) => {
    if (!speakers.has(d.speaker)) err(`dialogue.lines[${i}] unknown speaker "${d.speaker}"`);
  });

  // markup: balanced braces + vocab links resolve
  for (const [path, text] of jaStrings(l)) {
    const leftover = parseFurigana(text)
      .filter((s) => s.kind === 'text')
      .map((s) => (s.kind === 'text' ? s.text : ''))
      .join('');
    // `|` is allowed outside markup (Markdown tables in note bodies)
    if (/[{}]/.test(leftover)) err(`${path}: malformed furigana markup in "${text}"`);
    for (const s of parseFurigana(text)) {
      if (s.kind === 'ruby' && s.reading && s.reading === s.base) {
        err(`${path}: ruby reading repeats the base "${s.base}"; use {${s.base}||id} or plain text`);
      }
      if (s.kind === 'ruby' && s.vocabId && !knownVocab.has(s.vocabId)) {
        err(`${path}: links to unknown vocab id "${s.vocabId}"`);
      }
    }
  }

  // quiz
  const qids = new Set<string>();
  l.quiz.forEach((q, i) => {
    if (qids.has(q.id)) err(`duplicate quiz id "${q.id}"`);
    qids.add(q.id);
    if (q.type === 'multiple-choice') {
      const correct = q.choices.filter((c) => c.correct).length;
      if (correct !== 1) err(`quiz[${i}] needs exactly one correct choice (has ${correct})`);
      q.choices.forEach((c, j) => {
        if (!c.ja && !c.text) err(`quiz[${i}].choices[${j}] needs ja or text`);
        if (!c.correct && !c.feedback) err(`quiz[${i}].choices[${j}] wrong choice needs feedback`);
      });
    }
  });
  return errors;
}

/** Checks all lessons together (global vocab-id uniqueness, unique order). */
export function checkLessons(lessons: Lesson[]): string[] {
  const errors: string[] = [];
  const owner = new Map<string, string>();
  for (const l of lessons) {
    for (const v of l.vocab) {
      const prev = owner.get(v.id);
      if (prev && prev !== l.id) errors.push(`vocab id "${v.id}" used in both ${prev} and ${l.id}`);
      owner.set(v.id, l.id);
    }
  }
  const orders = new Map<number, string>();
  for (const l of lessons) {
    if (orders.has(l.order)) errors.push(`lesson order ${l.order} used by ${orders.get(l.order)} and ${l.id}`);
    orders.set(l.order, l.id);
  }
  const known = new Set(owner.keys());
  for (const l of lessons) errors.push(...checkLesson(l, known));
  return errors;
}
