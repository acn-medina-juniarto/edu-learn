/**
 * Feedback after "Check answer". Icon + heading text + explanation, so color is
 * never the only signal. Wrong answers always explain why and show the answer.
 */
import { forwardRef } from 'preact/compat';
import { CheckIcon, JaText, MixedText, XIcon } from './Rich';

export interface FeedbackProps {
  correct: boolean;
  /** Specific feedback (e.g. for the chosen wrong option) */
  detail?: string;
  explanation: string;
  /** Correct answer to show when wrong (furigana markup or English) */
  answer?: { ja?: string; text?: string };
}

export const QuizFeedback = forwardRef<HTMLDivElement, FeedbackProps>(function QuizFeedback(
  { correct, detail, explanation, answer },
  ref,
) {
  const heading = correct ? 'Correct!' : detail?.startsWith('Close') || detail?.startsWith('Almost') ? 'Close!' : 'Not quite';
  // Avoid repeating "Close!" when the detail text already starts with it
  const body = detail?.replace(/^(Close!|Almost!)\s*/, '');
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      class={`rounded-[16px] border-2 p-4 ${correct ? 'border-success bg-success-bg' : 'border-error bg-error-bg'}`}
      data-feedback={correct ? 'correct' : 'incorrect'}
    >
      <p class={`flex items-center gap-2 font-display text-lg font-semibold ${correct ? 'text-success' : 'text-error'}`}>
        <span class={`grid h-8 w-8 place-items-center rounded-full border-2 ${correct ? 'border-success' : 'border-error'}`}>
          {correct ? <CheckIcon /> : <XIcon />}
        </span>
        {heading}
      </p>
      {body && <MixedText as="p" text={body} class="mt-2 text-base leading-relaxed text-ink" />}
      {!correct && answer && (
        <p class="mt-2 text-ink">
          <span class="text-sm font-semibold">Answer: </span>
          {answer.ja ? <JaText text={answer.ja} class="ja-body" /> : <span>{answer.text}</span>}
        </p>
      )}
      <MixedText as="p" text={explanation} class="mt-2 text-base leading-relaxed text-ink" />
    </div>
  );
});
