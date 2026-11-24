/** Fill-in-the-blank: the sentence with an inline Japanese input where ___ is. */
import { useEffect, useRef } from 'preact/hooks';
import type { QuizQuestion } from '@/lib/schemas';
import { JaText } from './Rich';

type FB = Extract<QuizQuestion, { type: 'fill-blank' }>;

interface Props {
  q: FB;
  value: string;
  onInput: (v: string) => void;
  revealed: boolean;
  correct?: boolean;
}

export function FillBlankQ({ q, value, onInput, revealed, correct }: Props) {
  const [before, after] = q.ja.split('___');
  const input = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  // Size the box to the longest accepted answer (+ padding) so it doesn't give the answer away by being exact
  const width = Math.max(4, ...q.answers.map((a) => a.length)) + 2;
  useEffect(() => {
    if (!revealed) input.current?.focus({ preventScroll: true });
  }, [q.id]);

  const state = !revealed ? '' : correct ? 'border-success bg-success-bg' : 'border-error bg-error-bg';
  return (
    <div class="sticker-card p-4 sm:p-5">
      <p class="ja-dialogue leading-[2.4]">
        <JaText text={before} />
        <label class="sr-only" for={`fb-${q.id}`}>
          Your answer for the blank
        </label>
        <input
          ref={input}
          id={`fb-${q.id}`}
          lang="ja"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck={false}
          enterKeyHint="done"
          value={value}
          disabled={revealed}
          onInput={(e) => onInput((e.currentTarget as HTMLInputElement).value)}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={() => {
            // Safari fires the confirming Enter keydown just after compositionend
            window.setTimeout(() => (composing.current = false), 50);
          }}
          onKeyDown={(e) => {
            // Don't submit while a Japanese IME is composing (Enter confirms the kanji)
            if (e.key === 'Enter' && (e.isComposing || composing.current)) e.preventDefault();
          }}
          style={{ width: `${width}em` }}
          class={`mx-1 inline-block min-h-12 max-w-full rounded-[12px] border-2 border-line bg-paper px-3 align-middle text-xl ${state}`}
          aria-describedby={`fb-${q.id}-en`}
        />
        <JaText text={after} />
      </p>
      <p id={`fb-${q.id}-en`} class="en-translation mt-2 text-ink-soft">
        {q.en}
      </p>
      {q.hint && !revealed && (
        <p class="mt-2 text-sm text-ink-soft">
          <span class="font-semibold">Hint:</span> {q.hint}
        </p>
      )}
    </div>
  );
}
