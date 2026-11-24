/**
 * Sentence ordering: tap tokens in the word bank to build the sentence; tap a
 * placed token to send it back. Fully keyboard operable (they are buttons).
 */
import type { QuizQuestion } from '@/lib/schemas';
import { JaText } from './Rich';

type SO = Extract<QuizQuestion, { type: 'sentence-order' }>;

interface Props {
  q: SO;
  /** Shuffled display order of the bank */
  bankOrder: number[];
  placed: number[];
  onChange: (placed: number[]) => void;
  revealed: boolean;
  correct?: boolean;
}

export function SentenceOrderQ({ q, bankOrder, placed, onChange, revealed, correct }: Props) {
  const remaining = bankOrder.filter((i) => !placed.includes(i));
  const answerState = !revealed ? 'border-dashed bg-paper' : correct ? 'border-success bg-success-bg' : 'border-error bg-error-bg';

  return (
    <div class="grid gap-4">
      <p class="text-lg">
        <span class="text-sm font-semibold text-ink-soft">Meaning: </span>
        {q.en}
      </p>
      <div>
        <p class="mb-2 text-sm font-semibold text-ink-soft" id={`so-${q.id}-answer`}>
          Your sentence
        </p>
        <div
          class={`flex min-h-[4.5rem] flex-wrap items-center gap-2 rounded-[16px] border-2 border-line p-3 ${answerState}`}
          role="group"
          aria-labelledby={`so-${q.id}-answer`}
        >
          {placed.length === 0 && <span class="text-ink-soft">Tap the words below in order.</span>}
          {placed.map((ti, pos) => (
            <button
              type="button"
              key={`p-${ti}`}
              class="btn btn-secondary btn-sm !font-sans"
              disabled={revealed}
              onClick={() => onChange(placed.filter((x) => x !== ti))}
              aria-label={`Remove word ${pos + 1}`}
            >
              <JaText text={q.tokens[ti]} class="text-lg font-medium" />
            </button>
          ))}
        </div>
      </div>
      {!revealed && (
        <div>
          <p class="mb-2 text-sm font-semibold text-ink-soft" id={`so-${q.id}-bank`}>
            Word bank
          </p>
          <div class="flex min-h-[3.5rem] flex-wrap gap-2" role="group" aria-labelledby={`so-${q.id}-bank`}>
            {remaining.map((ti) => (
              <button
                type="button"
                key={`b-${ti}`}
                class="btn btn-secondary btn-sm !font-sans"
                onClick={() => onChange([...placed, ti])}
              >
                <JaText text={q.tokens[ti]} class="text-lg font-medium" />
              </button>
            ))}
            {remaining.length === 0 && <span class="text-sm text-ink-soft">All words placed.</span>}
          </div>
          {placed.length > 0 && (
            <button type="button" class="btn btn-ghost btn-sm mt-2" onClick={() => onChange([])}>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
