/**
 * Progress page (client-only: everything lives in localStorage).
 * Streak + week row, stat tiles, activity chart, per-lesson table, and
 * backup / restore / reset.
 */
import type { ComponentChildren } from 'preact';
import { useMemo, useRef, useState } from 'preact/hooks';
import { readActivity } from '@/lib/activity';
import { buildBackup, describeBackup, parseBackup, resetAll, restoreBackup, type BackupFile } from '@/lib/backup';
import { parseKey } from '@/lib/srs';
import { streakMessage } from '@/lib/streak';
import { readProgress } from '@/lib/progress';
import { CheckIcon, JaText, XIcon } from '@/components/quiz/Rich';
import { ActivityChart } from './ActivityChart';

export interface LessonRow {
  id: string;
  order: number;
  title: string;
  titleJa: string;
  category: string;
  href: string;
  vocabIds: string[];
}

interface Props {
  lessons: LessonRow[];
  lessonsHref: string;
  mascotSleepy?: ComponentChildren;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export default function ProgressDashboard({ lessons, lessonsHref, mascotSleepy }: Props) {
  const ids = useMemo(() => new Set(lessons.flatMap((l) => l.vocabIds)), [lessons]);
  const [a] = useState(() => readActivity(ids));
  const [progress] = useState(() => readProgress());
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const restoreDialog = useRef<HTMLDialogElement>(null);
  const resetDialog = useRef<HTMLDialogElement>(null);

  const msg = streakMessage(a.streak);
  const bests = Object.values(a.quizBest);
  const avgQuiz = bests.length ? Math.round((bests.reduce((x, y) => x + y, 0) / bests.length) * 100) : null;
  const reviewsTotal = Object.values(a.reviewsByDay).reduce((x, y) => x + y, 0);
  const isEmpty = a.studyDays.length === 0 && a.deckSize === 0 && bests.length === 0;

  function exportBackup() {
    const b = buildBackup(localStorage);
    const blob = new Blob([JSON.stringify(b, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `biz-nihongo-backup-${a.today}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage({ ok: true, text: 'Backup downloaded. Keep the file somewhere safe.' });
  }

  async function onFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const r = parseBackup(await file.text());
    if (!r.ok) return setMessage({ ok: false, text: r.error });
    setPending(r.backup);
    restoreDialog.current?.showModal();
  }

  function confirmRestore() {
    if (!pending) return;
    restoreBackup(localStorage, pending);
    restoreDialog.current?.close();
    location.reload();
  }

  function confirmReset() {
    resetAll(localStorage);
    resetDialog.current?.close();
    location.reload();
  }

  const summary = pending ? describeBackup(pending) : null;
  const tiles = [
    { label: 'Lessons completed', value: `${a.completed.size}`, sub: `of ${lessons.length}` },
    { label: 'Best quiz average', value: avgQuiz === null ? '—' : `${avgQuiz}%`, sub: `${bests.length} quizzes taken` },
    { label: 'Cards in deck', value: `${a.deckSize}`, sub: `${a.due} due today` },
    { label: 'Study days', value: `${a.studyDays.length}`, sub: `longest streak ${a.streak.longest}` },
  ];

  return (
    <div data-progress>
      {isEmpty && (
        <section class="sticker-card mb-8 flex flex-col items-center gap-2 p-8 text-center" data-progress-empty>
          {mascotSleepy}
          <h2 class="text-2xl">No progress yet</h2>
          <p class="max-w-sm text-ink-soft">Finish your first lesson and your streak, scores and cards will appear here.</p>
          <a href={lessonsHref} class="btn btn-primary mt-3">
            Start lesson 1 →
          </a>
        </section>
      )}

      {/* Streak */}
      <section class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Streak">
        <div
          class={`inline-flex rotate-[-2deg] items-center gap-3 self-start rounded-[16px] border-2 border-line px-4 py-2.5 text-on-accent shadow-[4px_4px_0_var(--shadow)] ${a.streak.status === 'active' || a.streak.status === 'pending' ? 'bg-sunny' : 'bg-ramune'}`}
          data-streak-status={a.streak.status}
        >
          <span class="font-display text-3xl font-semibold tabular-nums">{a.streak.current}</span>
          <span class="leading-tight">
            <span class="block font-display text-lg font-semibold">{msg.title}</span>
            <span class="block text-sm">{msg.body}</span>
          </span>
        </div>
        <div>
          <p class="mb-2 text-sm font-semibold text-ink-soft">Last 7 days</p>
          <ol class="flex gap-2" aria-label="Study days this week">
            {a.streak.week.map((d) => {
              const label = parseKey(d.date).toLocaleDateString(undefined, { weekday: 'short' });
              return (
                <li class="flex flex-col items-center gap-1" key={d.date}>
                  <span
                    class={`grid h-9 w-9 place-items-center rounded-full border-2 ${d.studied ? 'border-success bg-success-bg text-success' : 'border-line/40 text-ink-soft'}`}
                  >
                    {d.studied ? <CheckIcon size={16} /> : <span aria-hidden="true">·</span>}
                  </span>
                  <span class={`text-xs ${d.date === a.today ? 'font-bold' : 'text-ink-soft'}`}>{label}</span>
                  <span class="sr-only">{d.studied ? 'studied' : 'no study'}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Stat tiles */}
      <section class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
        {tiles.map((t) => (
          <div class="sticker-card p-4" key={t.label}>
            <p class="text-sm font-semibold text-ink-soft">{t.label}</p>
            <p class="font-display text-4xl font-semibold tabular-nums">{t.value}</p>
            <p class="text-sm text-ink-soft">{t.sub}</p>
          </div>
        ))}
      </section>

      {/* Chart */}
      <section class="mb-8" aria-label="Activity">
        <ActivityChart reviewsByDay={a.reviewsByDay} studyDays={a.studyDays} today={a.today} />
        <p class="mt-2 text-sm text-ink-soft">{reviewsTotal} flashcard reviews since you started.</p>
      </section>

      {/* Lessons */}
      <section class="mb-10" aria-labelledby="lessons-h">
        <h2 id="lessons-h" class="mb-3 text-xl">
          Lessons
        </h2>
        <ul class="grid gap-3">
          {lessons.map((l) => {
            const done = progress.lessons[l.id];
            const best = a.quizBest[l.id];
            const pct = best === undefined ? null : Math.round(best * 100);
            const wordCount = l.vocabIds.length;
            return (
              <li class={`sticker-card cat-${l.category} grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center`} key={l.id}>
                <div class="min-w-0">
                  <a href={l.href} class="inline-flex min-h-11 items-center font-display text-lg font-semibold underline-offset-4 hover:underline">
                    {l.order}. {l.title}
                  </a>
                  <JaText text={l.titleJa} class="block text-ink-soft" />
                  <p class="mt-1 flex items-center gap-1.5 text-sm">
                    {done ? (
                      <>
                        <span class="text-success">
                          <CheckIcon size={16} />
                        </span>
                        Completed {shortDate(done.completedAt)}
                      </>
                    ) : (
                      <span class="text-ink-soft">Not finished yet · {wordCount} words</span>
                    )}
                  </p>
                </div>
                <div>
                  <p class="mb-1 flex justify-between text-sm">
                    <span class="font-semibold">Best quiz</span>
                    <span class="tabular-nums text-ink-soft">{pct === null ? 'not taken' : `${pct}%`}</span>
                  </p>
                  <div
                    role="progressbar"
                    aria-label={`Best quiz score for ${l.title}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct ?? 0}
                    class="h-3 overflow-hidden rounded-full border-2 border-line bg-surface"
                  >
                    <div class="h-full bg-accent" style={{ width: `${pct ?? 0}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Backup */}
      <section class="sticker-card p-5" aria-labelledby="backup-h">
        <h2 id="backup-h" class="text-xl">
          Back up your progress
        </h2>
        <p class="mt-1 max-w-prose text-ink-soft">
          Your progress is stored only in this browser. Download a backup file to keep it safe, or to move it to another
          device. Nothing is uploaded anywhere.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="btn btn-primary" onClick={exportBackup} data-export>
            Download backup
          </button>
          <button type="button" class="btn btn-secondary" onClick={() => fileInput.current?.click()} data-import>
            Restore from file
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" class="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFile} data-import-input />
          <button type="button" class="btn btn-danger" onClick={() => resetDialog.current?.showModal()} data-reset>
            Reset progress
          </button>
        </div>
        <p class="mt-3 min-h-6 text-sm font-semibold" role="status" aria-live="polite" data-backup-status>
          {message && (
            <span class={`inline-flex items-center gap-1 ${message.ok ? 'text-success' : 'text-error'}`}>
              {message.ok ? <CheckIcon size={16} /> : <XIcon size={16} />} {message.text}
            </span>
          )}
        </p>
      </section>

      {/* Restore confirm */}
      <dialog ref={restoreDialog} class="sticker-card m-auto w-[min(28rem,calc(100vw-2rem))] p-6 text-ink backdrop:bg-black/40" aria-labelledby="restore-h">
        <h2 id="restore-h" class="text-xl">
          Restore this backup?
        </h2>
        {pending && summary && (
          <p class="mt-2 text-ink-soft">
            From {shortDate(pending.exportedAt)}: {summary.lessons} lessons completed, {summary.cards} flashcards, {summary.days} study
            days. This replaces the progress currently in this browser.
          </p>
        )}
        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" class="btn btn-secondary" onClick={() => restoreDialog.current?.close()}>
            Cancel
          </button>
          <button type="button" class="btn btn-primary" onClick={confirmRestore} data-confirm-restore>
            Restore
          </button>
        </div>
      </dialog>

      {/* Reset confirm */}
      <dialog ref={resetDialog} class="sticker-card m-auto w-[min(28rem,calc(100vw-2rem))] p-6 text-ink backdrop:bg-black/40" aria-labelledby="reset-h">
        <h2 id="reset-h" class="text-xl">
          Reset all progress?
        </h2>
        <p class="mt-2 text-ink-soft">
          This deletes your lessons, quiz scores, flashcards, streak and saved email details from this browser. It can't be undone. Download a
          backup first if you might want it later.
        </p>
        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" class="btn btn-secondary" onClick={() => resetDialog.current?.close()}>
            Keep my progress
          </button>
          <button type="button" class="btn btn-danger" onClick={confirmReset} data-confirm-reset>
            Reset everything
          </button>
        </div>
      </dialog>
    </div>
  );
}
