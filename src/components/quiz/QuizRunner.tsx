/**
 * Quiz flow: one question per screen → "Check answer" → feedback → "Next".
 * Ends with a results screen; the score is saved to localStorage (best + last).
 * Rendered client-only (choices are shuffled per attempt).
 */
import type { ComponentChildren } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { confettiBurst, replayAnimation } from '@/lib/confetti';
import { gradeFillBlank, gradeMultipleChoice, gradeSentenceOrder, scoreQuiz, shuffledIndices } from '@/lib/grading';
import { readProgress, recordQuizScore } from '@/lib/progress';
import type { QuizQuestion } from '@/lib/schemas';
import { FillBlankQ } from './FillBlankQ';
import { MultipleChoiceQ } from './MultipleChoiceQ';
import { QuizFeedback, type FeedbackProps } from './QuizFeedback';
import { CheckIcon, MixedText, XIcon } from './Rich';
import { SentenceOrderQ } from './SentenceOrderQ';

export interface QuizRunnerProps {
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
  lessonHref: string;
  nextHref?: string;
  nextTitle?: string;
  /** Mascot SVGs passed as Astro slots */
  mascotCheer?: ComponentChildren;
  mascotWave?: ComponentChildren;
}

type Answer = { choice: number | null; text: string; placed: number[] };
const EMPTY: Answer = { choice: null, text: '', placed: [] };

function grade(q: QuizQuestion, a: Answer): FeedbackProps {
  if (q.type === 'multiple-choice') {
    const r = gradeMultipleChoice(q, a.choice ?? -1);
    const right = q.choices[r.correctIndex];
    return { correct: r.correct, detail: r.feedback, explanation: q.explanation, answer: { ja: right.ja, text: right.text } };
  }
  if (q.type === 'fill-blank') {
    const r = gradeFillBlank(q, a.text);
    return {
      correct: r.correct,
      detail: r.close ? 'Almost! Check the spelling.' : undefined,
      explanation: q.explanation,
      answer: { ja: q.ja.replace('___', r.expected) },
    };
  }
  const r = gradeSentenceOrder(q, a.placed);
  return {
    correct: r.correct,
    detail: r.correct ? undefined : `Close! The order goes wrong at word ${r.firstWrong + 1}.`,
    explanation: q.explanation,
    answer: { ja: q.tokens.join('') },
  };
}

function isAnswered(q: QuizQuestion, a: Answer): boolean {
  if (q.type === 'multiple-choice') return a.choice !== null;
  if (q.type === 'fill-blank') return a.text.trim().length > 0;
  return a.placed.length === q.tokens.length;
}

function label(q: QuizQuestion): string {
  return { 'multiple-choice': 'Multiple choice', 'fill-blank': 'Fill in the blank', 'sentence-order': 'Put in order' }[q.type];
}

export default function QuizRunner(props: QuizRunnerProps) {
  const { questions, lessonId } = props;
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(EMPTY);
  const [feedback, setFeedback] = useState<FeedbackProps | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | undefined>(() => readProgress().quizzes?.[lessonId]?.best);

  // New shuffles for every attempt
  const orders = useMemo(
    () =>
      questions.map((q) =>
        q.type === 'multiple-choice' ? shuffledIndices(q.choices.length) : q.type === 'sentence-order' ? shuffledIndices(q.tokens.length) : [],
      ),
    [questions, attempt],
  );

  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  const q = questions[index];
  const total = questions.length;
  const last = index === total - 1;

  useEffect(() => {
    if (!done && index > 0) heading.current?.focus({ preventScroll: false });
  }, [index, attempt]);
  useEffect(() => {
    if (feedback) feedbackRef.current?.focus({ preventScroll: false });
  }, [feedback]);
  useEffect(() => {
    if (done) resultsHeading.current?.focus();
  }, [done]);

  const choose = useCallback((ci: number) => setAnswer((a) => ({ ...a, choice: ci })), []);

  function check() {
    const f = grade(q, answer);
    setFeedback(f);
    setResults((r) => [...r, f.correct]);
    if (card.current) replayAnimation(card.current, f.correct ? 'anim-bounce' : 'anim-shake');
    if (f.correct && primary.current) confettiBurst(primary.current, 14);
  }

  function next() {
    if (last) {
      const final = [...results];
      const score = scoreQuiz(final);
      const p = recordQuizScore(lessonId, score.ratio);
      setBest(p.quizzes?.[lessonId]?.best);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(EMPTY);
    setFeedback(null);
  }

  function restart() {
    setAttempt((n) => n + 1);
    setIndex(0);
    setAnswer(EMPTY);
    setFeedback(null);
    setResults([]);
    setDone(false);
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    if (feedback) next();
    else if (isAnswered(q, answer)) check();
  }

  // ------------------------------------------------------------- results
  if (done) {
    const score = scoreQuiz(results);
    const pct = Math.round(score.ratio * 100);
    const great = score.ratio >= 0.8;
    const message = great
      ? 'Excellent work. This phrasing is sticking!'
      : score.ratio >= 0.5
        ? 'Good effort. Review the notes and try once more.'
        : 'Every try builds memory. Revisit the lesson, then come back.';
    return (
      <section class="sticker-card p-6 text-center" aria-labelledby="quiz-results-h" data-quiz-results>
        <div class="flex justify-center">{great ? props.mascotCheer : props.mascotWave}</div>
        <h2 id="quiz-results-h" ref={resultsHeading} tabIndex={-1} class="mt-3 text-3xl">
          {score.correct} / {score.total} correct
        </h2>
        <p class="mt-1 text-lg text-ink-soft">{message}</p>
        <p class="mt-1 text-sm text-ink-soft">
          Score {pct}%{best !== undefined && ` · Best ${Math.round(best * 100)}%`}
        </p>
        <ol class="mx-auto mt-5 grid max-w-md gap-2 text-left">
          {questions.map((qq, i) => (
            <li class="flex items-start gap-2 rounded-[12px] border-2 border-line bg-surface-2 p-3" key={qq.id}>
              <span class={`mt-0.5 flex-none ${results[i] ? 'text-success' : 'text-error'}`}>
                {results[i] ? <CheckIcon /> : <XIcon />}
              </span>
              <span class="sr-only">{results[i] ? 'Correct:' : 'Incorrect:'}</span>
              <MixedText text={qq.prompt} />
            </li>
          ))}
        </ol>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          {props.nextHref ? (
            <a class="btn btn-primary" href={props.nextHref}>
              Next: {props.nextTitle} →
            </a>
          ) : (
            <a class="btn btn-primary" href={props.lessonHref}>
              Back to lesson
            </a>
          )}
          <button type="button" class="btn btn-secondary" onClick={restart}>
            Try again
          </button>
          {props.nextHref && (
            <a class="btn btn-ghost" href={props.lessonHref}>
              Back to lesson
            </a>
          )}
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------- question
  const answered = isAnswered(q, answer);
  const pct = Math.round(((index + (feedback ? 1 : 0)) / total) * 100);
  return (
    <form onSubmit={onSubmit} noValidate data-quiz data-question-type={q.type}>
      <div class="mb-6">
        <div class="mb-1.5 flex items-baseline justify-between text-sm font-medium">
          <span>
            Question {index + 1} of {total}
          </span>
          <span class="text-ink-soft">{label(q)}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + (feedback ? 1 : 0)}
          class="h-4 overflow-hidden rounded-full border-2 border-line bg-surface"
        >
          <div class="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%`, borderRight: pct ? '2px solid var(--line)' : 'none' }} />
        </div>
      </div>

      <div ref={card} key={`${attempt}-${q.id}`}>
        <h2 ref={heading} tabIndex={-1} class="mb-4 text-xl font-medium leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-sans)' }}>
          <MixedText text={q.prompt} />
        </h2>
        {q.type === 'multiple-choice' && q.promptJa && <MixedText as="p" text={q.promptJa} class="ja-body mb-4" />}

        {q.type === 'multiple-choice' && (
          <MultipleChoiceQ q={q} order={orders[index]} chosen={answer.choice} onChoose={choose} revealed={!!feedback} />
        )}
        {q.type === 'fill-blank' && (
          <FillBlankQ
            q={q}
            value={answer.text}
            onInput={(text) => setAnswer((a) => ({ ...a, text }))}
            revealed={!!feedback}
            correct={feedback?.correct}
          />
        )}
        {q.type === 'sentence-order' && (
          <SentenceOrderQ
            q={q}
            bankOrder={orders[index]}
            placed={answer.placed}
            onChange={(placed) => setAnswer((a) => ({ ...a, placed }))}
            revealed={!!feedback}
            correct={feedback?.correct}
          />
        )}
      </div>

      {feedback && (
        <div class="mt-6">
          <QuizFeedback ref={feedbackRef} {...feedback} />
        </div>
      )}

      <div class="sticky bottom-0 -mx-4 mt-6 flex justify-end border-t-2 border-line bg-paper/95 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button ref={primary} type="submit" class="btn btn-primary w-full sm:w-auto" disabled={!feedback && !answered}>
          {!feedback ? 'Check answer' : last ? 'See results' : 'Next question →'}
        </button>
      </div>
      {!feedback && !answered && (
        <p class="mt-2 text-right text-sm text-ink-soft" aria-live="polite">
          {q.type === 'multiple-choice' ? 'Pick an answer (or press 1–' + q.choices.length + ').' : q.type === 'fill-blank' ? 'Type your answer, then press Enter.' : 'Place every word to check.'}
        </p>
      )}
    </form>
  );
}
