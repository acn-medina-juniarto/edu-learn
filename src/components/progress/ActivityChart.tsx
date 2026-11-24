/**
 * Flashcard reviews per day, last N days. Single series, so no legend: the
 * title names it. Thin bars, 4px rounded tops on a shared baseline, a 2px gap,
 * recessive gridlines, direct labels only on today and the busiest day, a
 * hover/focus tooltip per day (the hit target is the whole column), and a
 * table view for screen readers and anyone who prefers numbers.
 */
import { useState } from 'preact/hooks';
import { addDays, parseKey } from '@/lib/srs';

interface Props {
  reviewsByDay: Record<string, number>;
  studyDays: string[];
  today: string;
  days?: number;
}

function niceMax(n: number): number {
  if (n <= 5) return 5;
  if (n <= 10) return 10;
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / p) * p;
}

export function ActivityChart({ reviewsByDay, studyDays, today, days = 14 }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const studied = new Set(studyDays);
  const data = Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i - (days - 1));
    const d = parseKey(date);
    return {
      date,
      value: reviewsByDay[date] ?? 0,
      studied: studied.has(date),
      day: d.getDate(),
      long: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  });
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const total = data.reduce((n, d) => n + d.value, 0);
  const H = 160;

  return (
    <figure class="sticker-card p-4 sm:p-5" aria-labelledby="chart-title">
      <figcaption class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span id="chart-title" class="font-display text-lg font-semibold">
          Flashcard reviews, last {days} days
        </span>
        <span class="text-sm text-ink-soft">{total} in total</span>
      </figcaption>

      <div class="relative" style={{ height: `${H + 28}px` }}>
        {/* gridlines: baseline + max, recessive */}
        <div class="pointer-events-none absolute inset-x-0" style={{ top: 0, height: `${H}px` }} aria-hidden="true">
          <div class="absolute inset-x-0 top-0 border-t border-dashed" style={{ borderColor: 'color-mix(in srgb, var(--ink) 18%, transparent)' }} />
          <div class="absolute inset-x-0 border-t border-dashed" style={{ top: `${H / 2}px`, borderColor: 'color-mix(in srgb, var(--ink) 12%, transparent)' }} />
          <div class="absolute inset-x-0 bottom-0 border-t-2" style={{ borderColor: 'var(--line)' }} />
          <span class="absolute right-0 -top-2.5 bg-surface pl-1 text-xs text-ink-soft">{max}</span>
        </div>

        <ol class="absolute inset-x-0 top-0 flex items-end gap-[2px] pr-6" style={{ height: `${H}px` }} aria-label="Reviews per day">
          {data.map((d, i) => {
            const h = d.value ? Math.max(4, Math.round((d.value / max) * H)) : 0;
            const showLabel = d.value > 0 && (i === days - 1 || i === peak);
            return (
              <li
                key={d.date}
                class="relative flex h-full min-w-0 flex-1 cursor-default flex-col items-center justify-end outline-none"
                tabIndex={0}
                aria-label={`${d.long}: ${d.value} ${d.value === 1 ? 'review' : 'reviews'}${d.studied ? ', studied' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-chart-day={d.date}
              >
                {showLabel && <span class="mb-0.5 text-xs font-semibold tabular-nums text-ink">{d.value}</span>}
                <span
                  class="block w-full max-w-7 rounded-t-[4px]"
                  style={{
                    height: `${h}px`,
                    background: active === i ? 'color-mix(in srgb, var(--primary) 75%, var(--ink))' : 'var(--primary)',
                  }}
                />
                {active === i && (
                  <span
                    class="absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-[8px] border-2 border-line bg-surface px-2 py-1 text-xs font-semibold text-ink shadow-[2px_2px_0_var(--shadow)]"
                    style={i > days / 2 ? { right: 0 } : { left: 0 }}
                    role="tooltip"
                  >
                    {d.long} · {d.value} {d.value === 1 ? 'review' : 'reviews'}
                    {d.studied && d.value === 0 ? ' · studied' : ''}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* x labels: day of month; today emphasized; dot = a study day */}
        <ol class="absolute inset-x-0 flex gap-[2px] pr-6" style={{ top: `${H + 4}px` }} aria-hidden="true">
          {data.map((d, i) => (
            <li key={d.date} class="flex min-w-0 flex-1 flex-col items-center text-[11px] leading-none text-ink-soft">
              <span class={i === days - 1 ? 'font-bold text-ink' : ''}>{d.day}</span>
              <span class={`mt-1 h-1.5 w-1.5 rounded-full ${d.studied ? 'bg-ink' : ''}`} />
            </li>
          ))}
        </ol>
      </div>
      <p class="mt-1 text-xs text-ink-soft">Bold date = today. A dot under a date = you studied that day.</p>

      <details class="mt-3 rounded-[12px] border-2 border-line bg-surface-2">
        <summary class="flex min-h-11 cursor-pointer items-center px-3 text-sm font-semibold">Show as table</summary>
        <div class="max-h-72 overflow-auto px-3 pb-3">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">Flashcard reviews per day</caption>
            <thead>
              <tr class="border-b-2 border-line">
                <th scope="col" class="py-1.5">Date</th>
                <th scope="col" class="py-1.5 text-right">Reviews</th>
                <th scope="col" class="py-1.5 text-right">Studied</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date} class="border-b border-line/20">
                  <td class="py-1.5">{d.long}</td>
                  <td class="py-1.5 text-right tabular-nums">{d.value}</td>
                  <td class="py-1.5 text-right">{d.studied ? 'Yes' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
