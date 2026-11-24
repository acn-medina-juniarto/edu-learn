import { describe, expect, it } from 'vitest';
import { composeEmail, emptyFields, exampleValues, placeholderKeys, renderHtml, renderText, type TemplateDef } from '../../src/lib/email';

const t: TemplateDef = {
  id: 't',
  subject: '{件名|けんめい}（{{name}}）',
  fields: [
    { key: 'company', label: 'Company', placeholder: '株式会社〇〇', exampleJa: '北山工業' },
    { key: 'name', label: 'Name', placeholder: '〇〇', exampleJa: '田中' },
  ],
  blocks: [
    { role: 'addressee', ja: '{{company}}\n{{name}}{様|さま}', en: '', explanation: '', politeness: 'keigo' },
    { role: 'opening', ja: 'いつもお{世話|せわ}になっております。', en: '', explanation: '', politeness: 'keigo' },
  ],
};

describe('email templates', () => {
  it('finds placeholder keys', () => {
    expect(placeholderKeys('{{a}} and {{b2}} and {{a}}')).toEqual(['a', 'b2', 'a']);
  });

  it('renders plain text with values and 〔markers〕 for empty fields', () => {
    expect(renderText('{{company}}の{{name}}{様|さま}', { company: '北山工業' }, t.fields)).toBe('北山工業の〔〇〇〕様');
  });

  it('renders HTML with ruby and escaped user values', () => {
    const html = renderHtml('{{name}}{様|さま}', { name: '<script>x</script>' }, t.fields);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('<ruby>様<rp>(</rp><rt>さま</rt>');
  });

  it('marks empty fields in HTML', () => {
    expect(renderHtml('{{name}}', {}, t.fields)).toContain('email-field-empty');
  });

  it('composes subject + body for copying', () => {
    const mail = composeEmail(t, exampleValues(t));
    expect(mail.subject).toBe('件名（田中）');
    expect(mail.body).toBe('北山工業\n田中様\n\nいつもお世話になっております。');
  });

  it('lists empty fields, ignoring whitespace-only values', () => {
    expect(emptyFields(t, { company: '  ' }).map((f) => f.key)).toEqual(['company', 'name']);
    expect(emptyFields(t, exampleValues(t))).toEqual([]);
  });
});
