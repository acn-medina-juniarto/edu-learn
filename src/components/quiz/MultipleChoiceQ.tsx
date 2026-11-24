/**
 * Multiple choice as a native radio group (arrow keys work), styled as .option.
 * Number keys 1–5 pick an option. After checking, options show state with
 * icon + text, not just color.
 */
import { useEffect } from 'preact/hooks';
import type { QuizQuestion } from '@/lib/schemas';
import { CheckIcon, JaText, XIcon } from './Rich';

type MC = Extract<QuizQuestion, { type: 'multiple-choice' }>;

interface Props {
  q: MC;
  /** Display order: indices into q.choices */
  order: number[];
  chosen: number | null;
  onChoose: (choiceIndex: number) => void;
  /** Set after checking */
  revealed: boolean;
}

export function MultipleChoiceQ({ q, order, chosen, onChoose, revealed }: Props) {
  const name = `q-${q.id}`;
  useEffect(() => {
    if (revealed) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') return;
      const n = Number(e.key);
      if (n >= 1 && n <= order.length) onChoose(order[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [order, revealed, onChoose]);

  return (
    <fieldset class="grid gap-3">
      <legend class="sr-only">Choose one answer</legend>
      {order.map((ci, pos) => {
        const c = q.choices[ci];
        const isChosen = chosen === ci;
        const state = !revealed
          ? isChosen
            ? 'selected'
            : 'default'
          : c.correct
            ? 'correct'
            : isChosen
              ? 'incorrect'
              : 'dimmed';
        return (
          <label class="option" data-state={state} key={ci}>
            <input
              type="radio"
              name={name}
              class="sr-only"
              checked={isChosen}
              disabled={revealed}
              onChange={() => onChoose(ci)}
            />
            <span
              class={`option-key ${state === 'correct' ? 'text-success' : state === 'incorrect' ? 'text-error' : ''}`}
              aria-hidden="true"
            >
              {state === 'correct' ? <CheckIcon size={16} /> : state === 'incorrect' ? <XIcon size={16} /> : pos + 1}
            </span>
            <span class="min-w-0 flex-1 text-lg">
              {c.ja ? <JaText text={c.ja} /> : <span>{c.text}</span>}
            </span>
            {state === 'correct' && <span class="text-sm font-semibold text-success">Correct answer</span>}
            {state === 'incorrect' && <span class="text-sm font-semibold text-error">Your answer</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
