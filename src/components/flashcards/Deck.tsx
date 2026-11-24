/**
 * Flashcard review session (Preact island, client-only: the deck lives in localStorage).
 * States: empty deck → nothing due → session → session complete.
 * Keys: Space/Enter shows the answer; 1–4 rate Again / Hard / Good / Easy.
 */
import type { ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { confettiBurst } from '@/lib/confetti';
import { addCards, readDeck, today as todayKey, withReview, writeDeck, type Deck as DeckData } from '@/lib/deck';
import { buildQueue, daysBetween, nextDueDate, previewIntervals, RATINGS, type Rating } from '@/lib/srs';
import { Flashcard } from './Flashcard';
import type { CardData, LessonInfo } from './types';

interface Props {
  cards: CardData[];
  lessons: LessonInfo[];
  lessonsHref: string;
  mascotSleepy?: ComponentChildren;
  mascotCheer?: ComponentChildren;
}

const RATING_UI: Record<Rating, { label: string; fill: string; key: string }> = {
  again: { label: 'Again', fill: 'bg-sakura', key: '1' },
  hard: { label: 'Hard', fill: 'bg-sunny', key: '2' },
  good: { label: 'Good', fill: 'bg-matcha', key: '3' },
  easy: { label: 'Easy', fill: 'bg-ramune', key: '4' },
};

/** "Again" cards come back at most this many extra times per session. */
const MAX_REQUEUE = 2;

function friendlyDate(key: string, today: string): string {
  const d = daysBetween(today, key);
  if (d === 1) return 'tomorrow';
  if (d < 7) return `in ${d} days`;
  const [y, m, day] = key.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Deck({ cards, lessons, lessonsHref, mascotSleepy, mascotCheer }: Props) {
  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const ids = useMemo(() => new Set(cards.map((c) => c.id)), [cards]);
  const [today] = useState(todayKey);
  const [deck, setDeck] = useState<DeckData>(() => readDeck());
  const [queue, setQueue] = useState<string[]>(() => buildQueue(readDeck().cards, todayKey(), ids));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [requeued, setRequeued] = useState<Record<string, number>>({});
  const showBtn = useRef<HTMLButtonElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);

  const deckSize = Object.keys(deck.cards).filter((id) => ids.has(id)).length;
  const current = queue[pos] ? byId.get(queue[pos]) : undefined;
  const inSession = !!current;
  const finished = reviewed > 0 && !inSession;

  function rate(r: Rating) {
    if (!current || !flipped) return;
    const next = withReview(deck, current.id, r, today);
    writeDeck(next);
    setDeck(next);
    setReviewed((n) => n + 1);
    if (r === 'again' && (requeued[current.id] ?? 0) < MAX_REQUEUE) {
      setQueue((q) => [...q, current.id]);
      setRequeued((m) => ({ ...m, [current.id]: (m[current.id] ?? 0) + 1 }));
    }
    setFlipped(false);
    setPos((p) => p + 1);
  }

  function addLesson(l: LessonInfo) {
    addCards(l.vocabIds);
    const d = readDeck();
    setDeck(d);
    if (!inSession) {
      setQueue(buildQueue(d.cards, today, ids));
      setPos(0);
      setReviewed(0);
      // Bring the new session into view and put focus on its primary action
      window.setTimeout(() => {
        const btn = document.querySelector<HTMLElement>('[data-show-answer]');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelector('[data-deck]')?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
        btn?.focus({ preventScroll: true });
      }, 0);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, summary')) return;
      if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
        if (t.closest('button, a')) return; // the focused control handles it
        e.preventDefault();
        setFlipped(true);
      } else if (flipped) {
        const r = RATINGS[Number(e.key) - 1];
        if (r) {
          e.preventDefault();
          rate(r);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Focus management
  useEffect(() => {
    if (inSession && !flipped && pos > 0) showBtn.current?.focus({ preventScroll: true });
  }, [pos, flipped]);
  useEffect(() => {
    if (finished && doneHeading.current) {
      doneHeading.current.focus();
      confettiBurst(doneHeading.current, 16);
    }
  }, [finished]);

  const nextDue = nextDueDate(deck.cards, today);
  const remaining = queue.length - pos;

  return (
    <div data-deck>
      {/* ---------------- session */}
      {inSession && current && (
        <section aria-label="Review session" data-session>
          <div class="mx-auto mb-5 max-w-md">
            <div class="mb-1.5 flex items-baseline justify-between text-sm font-medium">
              <span data-remaining>
                {remaining} {remaining === 1 ? 'card' : 'cards'} left
              </span>
              <span class="text-ink-soft">{reviewed} reviewed</span>
            </div>
            <div
              role="progressbar"
              aria-label="Session progress"
              aria-valuemin={0}
              aria-valuemax={queue.length}
              aria-valuenow={pos}
              class="cat-primary h-4 overflow-hidden rounded-full border-2 border-line bg-surface"
            >
              <div
                class="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${Math.round((pos / queue.length) * 100)}%` }}
              />
            </div>
          </div>

          <Flashcard card={current} flipped={flipped} onFlip={() => setFlipped(true)} />

          <div class="mx-auto mt-6 max-w-md">
            {!flipped ? (
              <button ref={showBtn} type="button" class="btn btn-primary w-full" onClick={() => setFlipped(true)} data-show-answer>
                Show answer <span class="text-sm font-medium opacity-80">· Space</span>
              </button>
            ) : (
              <div>
                <p class="mb-2 text-center text-sm font-semibold text-ink-soft" id="rate-label">
                  How well did you remember it?
                </p>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-labelledby="rate-label">
                  {RATINGS.map((r) => {
                    const ui = RATING_UI[r];
                    const preview = previewIntervals(deck.cards[current.id])[r];
                    return (
                      <button
                        type="button"
                        key={r}
                        class={`btn !flex-col !gap-0 !py-2 text-on-accent ${ui.fill}`}
                        onClick={() => rate(r)}
                        data-rating={r}
                      >
                        <span>{ui.label}</span>
                        <span class="text-xs font-medium opacity-80">
                          <span class="sr-only">, next review </span>
                          {preview} · key {ui.key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------- session complete */}
      {finished && (
        <section class="sticker-card mx-auto max-w-md p-6 text-center" aria-labelledby="deck-done-h" data-session-done>
          <div class="flex justify-center">{mascotCheer}</div>
          <h2 id="deck-done-h" ref={doneHeading} tabIndex={-1} class="mt-3 text-3xl">
            Session complete!
          </h2>
          <p class="mt-1 text-lg text-ink-soft">
            You reviewed {reviewed} {reviewed === 1 ? 'card' : 'cards'}. <span lang="ja">おつかれさまでした！</span>
          </p>
          {nextDue && <p class="mt-1 text-sm text-ink-soft">Next cards are due {friendlyDate(nextDue, today)}.</p>}
          <a href={lessonsHref} class="btn btn-primary mt-5">
            Continue learning →
          </a>
        </section>
      )}

      {/* ---------------- nothing to review */}
      {!inSession && !finished && (
        <section class="sticker-card mx-auto flex max-w-md flex-col items-center gap-2 p-8 text-center" data-empty>
          {mascotSleepy}
          {deckSize === 0 ? (
            <>
              <h2 class="text-2xl">Your deck is empty</h2>
              <p class="text-ink-soft">
                Finish a lesson to add its words automatically, or add a lesson's words below.
              </p>
            </>
          ) : (
            <>
              <h2 class="text-2xl">No cards due today</h2>
              <p class="text-ink-soft">
                Pon-san is taking a nap. {deckSize} {deckSize === 1 ? 'card is' : 'cards are'} in your deck
                {nextDue ? `, and the next ones are due ${friendlyDate(nextDue, today)}.` : '.'}
              </p>
            </>
          )}
          <a href={lessonsHref} class="btn btn-primary mt-3">
            Browse lessons
          </a>
        </section>
      )}

      {/* ---------------- deck manager */}
      <section class="mx-auto mt-10 max-w-2xl" aria-labelledby="manage-h">
        <h2 id="manage-h" class="mb-3 text-xl">
          Your deck <span class="text-base font-medium text-ink-soft">· {deckSize} cards</span>
        </h2>
        <ul class="grid gap-3">
          {lessons.map((l) => {
            const inDeck = l.vocabIds.filter((id) => deck.cards[id]).length;
            const all = inDeck === l.vocabIds.length;
            return (
              <li class={`sticker-card cat-${l.category} flex flex-wrap items-center justify-between gap-3 p-4`} key={l.id}>
                <div class="min-w-0">
                  <a href={l.href} class="inline-flex min-h-11 items-center font-display text-lg font-semibold underline-offset-4 hover:underline">
                    {l.order}. {l.title}
                  </a>
                  <p class="text-sm text-ink-soft">
                    {inDeck} / {l.vocabIds.length} words in your deck
                  </p>
                </div>
                {all ? (
                  <span class="badge !bg-success-bg !text-success">✓ All added</span>
                ) : (
                  <button type="button" class="btn btn-secondary btn-sm" onClick={() => addLesson(l)} data-add-lesson={l.id}>
                    Add {l.vocabIds.length - inDeck} words
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
