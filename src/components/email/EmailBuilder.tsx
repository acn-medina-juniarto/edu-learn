/**
 * Email builder: pick a template, fill in the fields, read the explained
 * preview, and copy the finished email. Field values are saved in the browser
 * and shared between templates (bj:v1:email-fields).
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { composeEmail, emptyFields, exampleValues, renderHtml, type Values } from '@/lib/email';
import type { EmailTemplate } from '@/lib/schemas';
import { CheckIcon, JaText, MixedText, XIcon } from '@/components/quiz/Rich';

const STORE_KEY = 'bj:v1:email-fields';
const ROLE_LABEL: Record<string, string> = {
  addressee: 'Addressee 宛名',
  opening: 'Opening 挨拶',
  body: 'Body 本文',
  closing: 'Closing 結び',
  signature: 'Signature 署名',
};
const POLITE_LABEL: Record<string, string> = { casual: 'Casual', teinei: 'Polite です・ます', keigo: 'Keigo 敬語' };
const CATEGORY_LABEL: Record<string, string> = {
  greeting: 'Greeting',
  request: 'Request',
  apology: 'Apology',
  'follow-up': 'Follow-up',
  thanks: 'Thanks',
};

function loadValues(): Values {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') as Values;
  } catch {
    return {};
  }
}
function saveValues(v: Values) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // no clipboard permission: the plain-text box below is the fallback
  }
}

export default function EmailBuilder({ templates }: { templates: EmailTemplate[] }) {
  const [tid, setTid] = useState(templates[0].id);
  const [values, setValues] = useState<Values>({});
  const [explain, setExplain] = useState(true);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const statusTimer = useRef<number | undefined>(undefined);
  const plainBox = useRef<HTMLDetailsElement>(null);
  const t = templates.find((x) => x.id === tid) ?? templates[0];

  // Restore saved values (and template from the URL hash) after hydration
  useEffect(() => {
    setValues(loadValues());
    const fromHash = location.hash.slice(1);
    if (templates.some((x) => x.id === fromHash)) setTid(fromHash);
  }, []);

  const mail = useMemo(() => composeEmail(t, values), [t, values]);
  const missing = useMemo(() => emptyFields(t, values), [t, values]);

  function update(key: string, v: string) {
    setValues((old) => {
      const next = { ...old, [key]: v };
      saveValues(next);
      return next;
    });
  }
  function choose(id: string) {
    setTid(id);
    setStatus(null);
    history.replaceState(null, '', `#${id}`);
  }
  function fillExample() {
    const next = { ...values, ...exampleValues(t) };
    setValues(next);
    saveValues(next);
    flash('Filled with example values.');
  }
  function clearAll() {
    const next = { ...values };
    for (const f of t.fields) delete next[f.key];
    setValues(next);
    saveValues(next);
    flash('Fields cleared.');
  }
  function flash(msg: string, ok = true) {
    setStatus({ msg, ok });
    window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(null), ok ? 4000 : 10000);
  }
  async function copy(which: 'body' | 'subject') {
    const ok = await copyText(which === 'body' ? mail.body : mail.subject);
    if (!ok) {
      if (plainBox.current) plainBox.current.open = true;
      return flash('Your browser blocked copying. The plain text is shown below to copy by hand.', false);
    }
    const warn = which === 'body' && missing.length ? ` ${missing.length} field(s) are still empty and marked 〔 〕.` : '';
    flash(`${which === 'body' ? 'Email' : 'Subject'} copied!${warn}`);
  }

  return (
    <div data-email-builder>
      {/* Template picker */}
      <fieldset class="mb-8">
        <legend class="mb-3 font-display text-xl font-semibold">1. Choose a template</legend>
        <div class="grid gap-3 sm:grid-cols-2">
          {templates.map((x) => (
            <label class="option cat-email !items-start" data-state={x.id === tid ? 'selected' : 'default'} key={x.id}>
              <input type="radio" name="template" class="sr-only" checked={x.id === tid} onChange={() => choose(x.id)} />
              <span class="min-w-0 flex-1">
                <span class="badge mb-1 !text-xs">{CATEGORY_LABEL[x.category]}</span>
                <span class="block font-display text-lg font-semibold">{x.title}</span>
                <JaText text={x.titleJa} class="block text-base" />
                <span class="block text-sm text-ink-soft">{x.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Fields */}
        <section aria-labelledby="fields-h">
          <h2 id="fields-h" class="mb-1 text-xl">
            2. Fill in the details
          </h2>
          <p class="mb-4 text-sm text-ink-soft">Saved in this browser and shared between templates.</p>
          <div class="mb-4 flex flex-wrap gap-2">
            <button type="button" class="btn btn-secondary btn-sm" onClick={fillExample}>
              Fill with example
            </button>
            <button type="button" class="btn btn-ghost btn-sm" onClick={clearAll}>
              Clear fields
            </button>
            <a href="#preview-h" class="btn btn-ghost btn-sm lg:hidden">
              Jump to preview ↓
            </a>
          </div>
          <div class="grid gap-3">
            {t.fields.map((f) => (
              <div key={f.key}>
                <label for={`f-${f.key}`} class="mb-1 block text-sm font-semibold">
                  {f.label}
                </label>
                <input
                  id={`f-${f.key}`}
                  lang="ja"
                  type="text"
                  autocomplete="off"
                  value={values[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onInput={(e) => update(f.key, (e.currentTarget as HTMLInputElement).value)}
                  class="min-h-12 w-full rounded-[12px] border-2 border-line bg-surface px-3 text-lg"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Preview */}
        <section aria-labelledby="preview-h" class="lg:sticky lg:top-20 lg:self-start">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="preview-h" class="scroll-mt-20 text-xl">
              3. Review and copy
            </h2>
            <label class="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                class="h-5 w-5 accent-[var(--primary)]"
                checked={explain}
                onChange={(e) => setExplain((e.currentTarget as HTMLInputElement).checked)}
              />
              Explain each part
            </label>
          </div>

          <div class="sticker-card overflow-hidden" data-email-preview>
            <div class="border-b-2 border-line bg-surface-2 px-4 py-3">
              <span class="text-xs font-semibold uppercase tracking-wider text-ink-soft">Subject 件名</span>
              <p lang="ja" class="ja-body" dangerouslySetInnerHTML={{ __html: renderHtml(t.subject, values, t.fields) }} />
            </div>
            <div class="grid gap-4 p-4">
              {t.blocks.map((b, i) => (
                <div key={`${t.id}-${i}`} class={explain ? 'border-l-4 border-[var(--sunny)] pl-3' : ''}>
                  {explain && (
                    <p class="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-soft">
                      <span>{ROLE_LABEL[b.role]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{POLITE_LABEL[b.politeness]}</span>
                    </p>
                  )}
                  <p
                    lang="ja"
                    class="ja-body whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: renderHtml(b.ja, values, t.fields) }}
                  />
                  {explain && (
                    <div class="mt-1 text-sm leading-relaxed">
                      <p class="en-translation text-ink-soft">{b.en}</p>
                      <MixedText as="p" text={b.explanation} class="mt-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {missing.length > 0 && (
            <p class="mt-3 text-sm text-ink-soft">
              {missing.length} {missing.length === 1 ? 'field is' : 'fields are'} still empty:{' '}
              {missing.map((f) => f.label).join(', ')}.
            </p>
          )}

          <div class="mt-4 flex flex-wrap gap-3">
            <button type="button" class="btn btn-primary" onClick={() => copy('body')} data-copy-body>
              Copy email
            </button>
            <button type="button" class="btn btn-secondary" onClick={() => copy('subject')}>
              Copy subject
            </button>
          </div>
          <p class="mt-2 min-h-6 text-sm font-semibold" role="status" aria-live="polite" data-email-status>
            {status && (
              <span class={`inline-flex items-center gap-1 ${status.ok ? 'text-success' : 'text-error'}`}>
                {status.ok ? <CheckIcon size={16} /> : <XIcon size={16} />} {status.msg}
              </span>
            )}
          </p>
          <details ref={plainBox} class="mt-3 rounded-[12px] border-2 border-line bg-surface">
            <summary class="flex min-h-11 cursor-pointer items-center px-3 text-sm font-semibold">
              Show plain text (no furigana)
            </summary>
            <div class="grid gap-2 px-3 pb-3">
              <label class="text-xs font-semibold text-ink-soft" for="plain-subject">
                Subject
              </label>
              <input id="plain-subject" lang="ja" readOnly value={mail.subject} class="min-h-11 w-full rounded-[8px] border-2 border-line bg-paper px-2" />
              <label class="text-xs font-semibold text-ink-soft" for="plain-body">
                Body
              </label>
              <textarea
                id="plain-body"
                lang="ja"
                readOnly
                rows={14}
                value={mail.body}
                class="w-full rounded-[8px] border-2 border-line bg-paper p-2 leading-relaxed"
              />
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}
