/**
 * Screen checks for every page at 375 / 768 / 1280px in light and dark mode:
 *  - full-page screenshot saved to screenshots/<page>-<width>-<theme>.png
 *  - no horizontal page overflow
 *  - every interactive element is at least 44x44px (inline vocab words excepted)
 * Run: npm run test:e2e
 */
import { expect, test } from '@playwright/test';

const PAGES = [
  { name: 'home', path: '' },
  { name: 'design', path: 'design' },
  { name: 'lessons', path: 'lessons' },
  { name: 'review', path: 'review' },
  { name: 'lesson-1', path: 'lessons/self-introduction' },
  { name: 'lesson-2', path: 'lessons/phone-etiquette' },
  { name: 'lesson-4', path: 'lessons/polite-requests' },
  { name: 'quiz-1', path: 'lessons/self-introduction/quiz' },
  { name: 'flashcards', path: 'flashcards' },
  { name: 'keigo', path: 'keigo' },
  { name: 'email', path: 'email' },
  { name: 'progress', path: 'progress' },
  { name: 'study', path: 'study' },
  { name: 'grammar', path: 'grammar' },
  { name: 'grammar-n2', path: 'grammar/ni-motozuite' },
  { name: 'kanji', path: 'kanji' },
  { name: 'reading', path: 'reading' },
  { name: 'reading-n1', path: 'reading/n1-office-relocation' },
];
const WIDTHS = [375, 768, 1280];
const THEMES = ['light', 'dark'] as const;

for (const page of PAGES) {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      test(`${page.name} @${width}px ${theme}`, async ({ browser }) => {
        const ctx = await browser.newContext({
          viewport: { width, height: 900 },
          colorScheme: theme,
          reducedMotion: 'reduce',
        });
        const p = await ctx.newPage();
        // Worst case for the header: a cards-due badge is showing
        await p.addInitScript(() => {
          const d = new Date();
          const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!localStorage.getItem('bj:v1:deck')) {
            const c = { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: k, added: k };
            localStorage.setItem('bj:v1:deck', JSON.stringify({ version: 1, cards: { meishi: c, heisha: c }, reviewsByDay: {} }));
          }
        });
        await p.goto(page.path);
        await p.waitForLoadState('networkidle'); // client-only islands have rendered
        await p.evaluate(() => document.fonts.ready);

        await p.screenshot({ path: `screenshots/${page.name}-${width}-${theme}.png`, fullPage: true });

        const result = await p.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const overflow = document.documentElement.scrollWidth - vw;
          const small = [
            ...document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, [role="button"]'),
          ]
            // .stretched-link covers its whole card via ::after, so measure the card.
            // A checkbox/radio inside a <label> is hit via the label, so measure the label.
            .map((el) => {
              if (el.classList.contains('stretched-link')) return { el, box: el.closest('.sticker-card') ?? el };
              const isToggle = el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio');
              return { el, box: isToggle ? el.closest('label') ?? el : el };
            })
            .filter(({ el, box }) => {
              const r = box.getBoundingClientRect();
              if (r.width === 0 || el.classList.contains('vocab-word') || el.closest('.sr-only')) return false;
              // WCAG 2.5.8 inline exception: links inside running text
              if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li')) return false;
              return r.width < 44 || r.height < 44;
            })
            .map(({ el, box }) => {
              const r = box.getBoundingClientRect();
              return `${el.tagName} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
            });
          // Rendered text contrast on filled chips/buttons (catches token misuse like dark-on-dark)
          const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
          const lum = ([r, g, b]: number[]) =>
            [r, g, b]
              .map((v) => v / 255)
              .map((s) => (s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4))
              .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0);
          const lowContrast = [...document.querySelectorAll<HTMLElement>('.badge, .btn, .option')]
            .filter((el) => el.getBoundingClientRect().width > 0 && !el.closest('[data-state="dimmed"], .sr-only'))
            .filter((el) => !(el as HTMLButtonElement).disabled && el.getAttribute('aria-disabled') !== 'true')
            .map((el) => {
              const cs = getComputedStyle(el);
              const bg = rgb(cs.backgroundColor);
              if (bg.length === 4 && bg[3] < 1) return null; // transparent: sits on page/card
              const a = lum(rgb(cs.color));
              const b = lum(bg);
              const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
              return ratio < 4.5 ? `${el.className.slice(0, 40)} "${el.textContent?.trim().slice(0, 20)}" ${ratio.toFixed(2)}` : null;
            })
            .filter(Boolean);
          return { overflow, small, lowContrast, theme: document.documentElement.dataset.theme };
        });

        expect(result.theme).toBe(theme);
        expect(result.overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(0);
        expect(result.small, 'tap targets smaller than 44px').toEqual([]);
        expect(result.lowContrast, 'text contrast below 4.5:1 on filled chips/buttons').toEqual([]);
        await ctx.close();
      });
    }
  }
}
