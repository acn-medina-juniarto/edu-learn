/**
 * Flip card. Front: the word only (no reading: that's what you're recalling).
 * Back: reading, meaning, politeness, example, audio. The hidden face is inert
 * so screen readers and Tab never reach the answer early.
 */
import { useEffect, useRef } from 'preact/hooks';
import { JaText } from '@/components/quiz/Rich';
import type { CardData } from './types';

interface Props {
  card: CardData;
  flipped: boolean;
  onFlip: () => void;
}

function frontSize(word: string): string {
  const n = [...word].length;
  return n <= 4 ? 'ja-card' : n <= 7 ? 'text-[2.25rem] leading-[1.9]' : 'text-[1.75rem] leading-[1.9]';
}

export function Flashcard({ card, flipped, onFlip }: Props) {
  const back = useRef<HTMLParagraphElement>(null);
  const hasKanji = /\p{Script=Han}/u.test(card.word);
  const wordMarkup = hasKanji ? `{${card.word}|${card.reading}}` : card.word;

  useEffect(() => {
    if (flipped) back.current?.focus({ preventScroll: true });
  }, [flipped, card.id]);

  return (
    <div class={`flip-card mx-auto cat-${card.category}`} data-flipped={flipped ? 'true' : 'false'} data-card-id={card.id}>
      <div class="flip-inner">
        <button
          type="button"
          class="flip-face sticker-card flex cursor-pointer flex-col items-center justify-center p-6 text-center"
          onClick={onFlip}
          aria-label={`Flashcard: ${card.word}. Show the answer.`}
          {...(flipped ? { inert: true, 'aria-hidden': 'true' } : {})}
        >
          <span class="badge mb-3 !text-xs">{card.lessonTitle}</span>
          <span lang="ja" class={`${frontSize(card.word)} font-medium [word-break:keep-all]`}>
            {card.word}
          </span>
          <span class="mt-3 text-sm text-ink-soft">Recall the reading and meaning, then tap</span>
        </button>

        <div
          class="flip-face flip-back sticker-card flex flex-col justify-center gap-2 p-6"
          {...(!flipped ? { inert: true, 'aria-hidden': 'true' } : {})}
        >
          <div class="flex items-center justify-between gap-2">
            <span class="badge !text-xs">{card.lessonTitle}</span>
            <span class="text-sm text-ink-soft">{card.pos}</span>
          </div>
          <p ref={back} tabIndex={-1} class="outline-none" data-card-back>
            <JaText text={wordMarkup} class="block text-[2rem] font-medium leading-[1.9]" />
            <span class="block font-display text-xl font-semibold">{card.meaning}</span>
          </p>
          {card.politeness && (
            <p class="text-sm text-ink-soft">
              {card.politeness.en} <span lang="ja">{card.politeness.ja}</span>
            </p>
          )}
          <div class="mt-1 rounded-[12px] border-2 border-line bg-surface-2 p-3 text-left">
            <JaText text={card.exampleJa} as="p" class="ja-body" />
            <p class="en-translation mt-1 text-base text-ink-soft">{card.exampleEn}</p>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm self-start"
            data-speak={card.word}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
              <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" />
            </svg>
            Listen
            <span class="sr-only">
              : <span lang="ja">{card.word}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
