/**
 * Automated accessibility audit (axe-core, WCAG 2.2 A/AA rules) on every page,
 * in light and dark mode, at phone and desktop width, plus the interactive
 * states that only exist after a click (popup, feedback, dialogs, card back).
 * Any violation fails the test, with a readable summary.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  '',
  'lessons',
  'lessons/self-introduction',
  'lessons/phone-etiquette',
  'lessons/email-basics',
  'lessons/polite-requests',
  'lessons/apology-gratitude',
  'lessons/self-introduction/quiz',
  'flashcards',
  'keigo',
  'email',
  'progress',
  'study',
  'grammar',
  'grammar/ni-tsuite',
  'kanji',
  'reading',
  'reading/n1-office-relocation',
  'review',
  'design',
  '404',
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function audit(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(TAGS)
    // The style guide deliberately renders a "disabled" sample and a forced-light/dark sampler
    .exclude('[data-axe-skip]')
    .analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.impact?.toUpperCase()} ${v.id}: ${v.help}\n` +
      v.nodes
        .slice(0, 4)
        .map((n) => `    ${n.target.join(' ')}  ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`)
        .join('\n'),
  );
  expect(summary, `${label}\n${summary.join('\n')}`).toEqual([]);
}

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of ['light', 'dark'] as const) {
  for (const width of [375, 1280]) {
    test.describe(`${theme} @${width}px`, () => {
      test.use({ colorScheme: theme, viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      for (const path of PAGES) {
        test(`page /${path}`, async ({ page }) => {
          await open(page, path);
          await audit(page, `/${path} ${theme} ${width}px`);
        });
      }
    });
  }
}

test.describe('interactive states', () => {
  for (const theme of ['light', 'dark'] as const) {
    test.describe(theme, () => {
      test.use({ colorScheme: theme, reducedMotion: 'reduce' });

      test('word popup open', async ({ page }) => {
        await open(page, 'lessons/self-introduction');
        await page.locator('#dialogue .vocab-word').first().click();
        await expect(page.locator('#word-popup')).toBeVisible();
        await audit(page, 'word popup');
      });

      test('quiz feedback (wrong) and results', async ({ page }) => {
        await open(page, 'lessons/self-introduction/quiz');
        await page.locator('.option', { hasText: 'だよ' }).click();
        await page.locator('form[data-quiz] button[type="submit"]').click();
        await audit(page, 'quiz feedback');
      });

      test('flashcard back + ratings', async ({ page }) => {
        await open(page, 'flashcards');
        await page.locator('[data-add-lesson="self-introduction"]').click();
        await page.locator('[data-show-answer]').click();
        await audit(page, 'flashcard back');
      });

      test('progress reset dialog', async ({ page }) => {
        await open(page, 'progress');
        await page.locator('[data-reset]').click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await audit(page, 'reset dialog');
      });

      test('keigo search with no results', async ({ page }) => {
        await open(page, 'keigo');
        await page.locator('#keigo-search').fill('zzzz');
        await expect(page.locator('#keigo-empty')).toBeVisible();
        await audit(page, 'keigo empty');
      });

      test('furigana and English hidden', async ({ page }) => {
        await open(page, 'reading/n2-price-revision');
        await page.locator('[data-lesson-toolbar] [data-pref-toggle="furigana"]').click();
        await page.locator('[data-lesson-toolbar] [data-pref-toggle="english"]').click();
        await audit(page, 'toggles off');
      });
    });
  }
});

test('keyboard: skip link is the first stop and moves focus to main', async ({ page }) => {
  await open(page, 'lessons/self-introduction');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('every page sets lang="ja" on Japanese text', async ({ page }) => {
  for (const path of ['lessons/phone-etiquette', 'keigo', 'kanji', 'reading/n3-remote-work']) {
    await open(page, path);
    // Any element whose own text contains kana/kanji must sit inside a lang="ja" ancestor
    const offenders = await page.evaluate(() => {
      const re = /[぀-ヿ一-鿿]/;
      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.textContent ?? '';
        if (!re.test(t)) continue;
        const el = n.parentElement!;
        if (el.closest('script, style, [aria-hidden="true"], .sr-only')) continue;
        if (!el.closest('[lang="ja"]')) out.push(`${el.tagName}: ${t.trim().slice(0, 20)}`);
      }
      return out.slice(0, 10);
    });
    expect(offenders, path).toEqual([]);
  }
});
