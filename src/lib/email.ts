/**
 * Email template rendering. Templates use furigana markup plus {{fieldKey}}
 * placeholders. Pure functions, unit-tested; used by the email builder island.
 * User-typed values are always escaped in HTML output.
 */
import { toPlain, toRubyHtml } from './furigana';
import { escapeHtml } from './inline';

export interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  exampleJa: string;
}
export interface BlockDef {
  role: string;
  ja: string;
  en: string;
  explanation: string;
  politeness: string;
}
export interface TemplateDef {
  id: string;
  subject: string;
  fields: FieldDef[];
  blocks: BlockDef[];
}
export type Values = Record<string, string>;

const PLACEHOLDER = /\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g;

/** Field keys used in a template string, in order (duplicates kept). */
export function placeholderKeys(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map((m) => m[1]);
}

/** Text with {{placeholders}} removed, for furigana checks. */
export function withoutPlaceholders(text: string): string {
  return text.replace(PLACEHOLDER, '');
}

function split(text: string): Array<{ kind: 'text'; text: string } | { kind: 'field'; key: string }> {
  const out: Array<{ kind: 'text'; text: string } | { kind: 'field'; key: string }> = [];
  let last = 0;
  for (const m of text.matchAll(PLACEHOLDER)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ kind: 'text', text: text.slice(last, i) });
    out.push({ kind: 'field', key: m[1] });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

const value = (values: Values, key: string) => (values[key] ?? '').trim();
const marker = (fields: FieldDef[], key: string) => `〔${fields.find((f) => f.key === key)?.placeholder ?? key}〕`;

/** HTML preview: ruby for template text, <mark> for filled/empty fields. */
export function renderHtml(text: string, values: Values, fields: FieldDef[]): string {
  return split(text)
    .map((p) => {
      if (p.kind === 'text') return toRubyHtml(p.text);
      const v = value(values, p.key);
      return v
        ? `<mark class="email-field" data-field="${p.key}">${escapeHtml(v)}</mark>`
        : `<mark class="email-field email-field-empty" data-field="${p.key}">${escapeHtml(marker(fields, p.key))}</mark>`;
    })
    .join('');
}

/** Plain text for copying: no furigana, fields filled (empty ones as 〔placeholder〕). */
export function renderText(text: string, values: Values, fields: FieldDef[]): string {
  return split(text)
    .map((p) => (p.kind === 'text' ? toPlain(p.text) : value(values, p.key) || marker(fields, p.key)))
    .join('');
}

export function composeEmail(t: TemplateDef, values: Values): { subject: string; body: string } {
  return {
    subject: renderText(t.subject, values, t.fields),
    body: t.blocks.map((b) => renderText(b.ja, values, t.fields)).join('\n\n'),
  };
}

/** Fields that appear in the template but have no value yet. */
export function emptyFields(t: TemplateDef, values: Values): FieldDef[] {
  const used = new Set([t.subject, ...t.blocks.map((b) => b.ja)].flatMap(placeholderKeys));
  return t.fields.filter((f) => used.has(f.key) && !value(values, f.key));
}

export function exampleValues(t: TemplateDef): Values {
  return Object.fromEntries(t.fields.map((f) => [f.key, f.exampleJa]));
}
