/** Home personalization, streak messages, progress page, and backup/restore/reset. */
import { expect, test, type Page } from '@playwright/test';

const key = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const iso = new Date().toISOString();

async function seed(page: Page, data: Record<string, unknown>) {
  await page.evaluate((d) => {
    localStorage.clear();
    for (const [k, v] of Object.entries(d)) localStorage.setItem(k, JSON.stringify(v));
  }, data);
  await page.reload();
}
const progress = (lessons: string[], activeDays: string[], quizzes: Record<string, object> = {}) => ({
  version: 1,
  lessons: Object.fromEntries(lessons.map((l) => [l, { completedAt: iso, lastStudiedAt: iso }])),
  activeDays,
  quizzes,
});
const card = (due: string) => ({ ease: 2.5, interval: 0, reps: 0, lapses: 0, due, added: due });

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('a first visit points to lesson 1', async ({ page }) => {
    await expect(page.locator('[data-continue-kicker]')).toHaveText('Start here');
    await expect(page.locator('[data-continue-cta]')).toHaveText('Start lesson');
    await expect(page.locator('[data-continue-link]')).toHaveAttribute('href', /lessons\/self-introduction$/);
    await expect(page.locator('[data-path-count]')).toHaveText('0 of 5 lessons complete');
    await expect(page.locator('[data-live-streak] [data-streak-title]')).toHaveText('Ready when you are');
  });

  test('after lesson 1 it continues with lesson 2 and shows the streak', async ({ page }) => {
    await seed(page, { 'bj:v1:progress': progress(['self-introduction'], [key()], { 'self-introduction': { best: 0.83, last: 0.83 } }) });
    await expect(page.locator('[data-continue-kicker]')).toHaveText('Continue where you left off');
    await expect(page.locator('[data-continue-title]')).toHaveText('2. Phone etiquette');
    await expect(page.locator('[data-path-item="self-introduction"]')).toHaveAttribute('data-state', 'done');
    await expect(page.locator('[data-path-item="self-introduction"] [data-path-status]')).toHaveText('✓ Done · quiz 83%');
    await expect(page.locator('[data-path-item="phone-etiquette"]')).toHaveAttribute('data-state', 'next');
    await expect(page.locator('[data-live-streak] [data-streak-title]')).toHaveText('1-day streak');
  });

  test('shows cards due today', async ({ page }) => {
    await seed(page, { 'bj:v1:deck': { version: 1, cards: { meishi: card(key()), heisha: card(key()), mousu: card(key(3)) }, reviewsByDay: {} } });
    await expect(page.locator('[data-due-number]')).toHaveText('2');
    await expect(page.locator('[data-due-cta]')).toHaveText('Review 2 cards');
    await expect(page.locator('[data-due-count]')).toHaveText('2'); // header badge agrees
  });

  test('a broken streak is a kind welcome back', async ({ page }) => {
    await seed(page, { 'bj:v1:progress': progress([], [key(-10), key(-9)]) });
    await expect(page.locator('[data-live-streak] [data-streak-title]')).toHaveText('Welcome back!');
    await expect(page.locator('[data-live-streak]')).toContainText('fresh start');
  });

  test('flashcard reviews count as study days for the streak', async ({ page }) => {
    await seed(page, {
      'bj:v1:progress': progress([], [key(-1)]),
      'bj:v1:deck': { version: 1, cards: {}, reviewsByDay: { [key()]: 4 } },
    });
    await expect(page.locator('[data-live-streak] [data-streak-title]')).toHaveText('2-day streak');
  });

  test('all lessons done switches the main action to review', async ({ page }) => {
    const all = ['self-introduction', 'phone-etiquette', 'email-basics', 'polite-requests', 'apology-gratitude'];
    await seed(page, { 'bj:v1:progress': progress(all, [key()]) });
    await expect(page.locator('[data-continue-kicker]')).toHaveText('All lessons complete!');
    await expect(page.locator('[data-continue-cta]')).toHaveText('Review flashcards');
  });
});

test.describe('progress page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('progress');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('empty state for a new learner', async ({ page }) => {
    await expect(page.locator('[data-progress-empty]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No progress yet' })).toBeVisible();
  });

  test('shows stats, the 14-day chart and lesson scores', async ({ page }) => {
    await seed(page, {
      'bj:v1:progress': progress(['self-introduction'], [key(-1), key()], { 'self-introduction': { best: 1, last: 1 } }),
      'bj:v1:deck': { version: 1, cards: { meishi: card(key()) }, reviewsByDay: { [key()]: 7, [key(-2)]: 3 } },
    });
    await expect(page.locator('[data-progress-empty]')).toHaveCount(0);
    await expect(page.locator('[data-streak-status]')).toHaveAttribute('data-streak-status', 'active');
    await expect(page.getByText('Lessons completed')).toBeVisible();
    await expect(page.locator('[data-chart-day]')).toHaveCount(14);
    await expect(page.locator(`[data-chart-day="${key()}"]`)).toHaveAttribute('aria-label', /7 reviews, studied/);
    await expect(page.getByText('10 in total')).toBeVisible();
    await page.locator(`[data-chart-day="${key()}"]`).focus();
    await expect(page.getByRole('tooltip')).toContainText('7 reviews');
    await expect(page.getByRole('progressbar', { name: /Self-introduction/ })).toHaveAttribute('aria-valuenow', '100');
  });

  test('backup → reset → restore round-trips all data', async ({ page }) => {
    await seed(page, {
      'bj:v1:progress': progress(['self-introduction'], [key()]),
      'bj:v1:deck': { version: 1, cards: { meishi: card(key()) }, reviewsByDay: {} },
    });
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-export]').click()]);
    expect(download.suggestedFilename()).toMatch(/^biz-nihongo-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const path = await download.path();

    await page.locator('[data-reset]').click();
    await page.locator('[data-confirm-reset]').click();
    await expect(page.locator('[data-progress-empty]')).toBeVisible();

    await page.locator('[data-import-input]').setInputFiles(path!);
    await expect(page.getByRole('dialog', { name: 'Restore this backup?' })).toContainText('1 lessons completed, 1 flashcards');
    await page.locator('[data-confirm-restore]').click();
    await expect(page.locator('[data-progress-empty]')).toHaveCount(0);
    const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('bj:v1:progress') || '{}'));
    expect(Object.keys(restored.lessons)).toEqual(['self-introduction']);
  });

  test('an invalid file is rejected with a clear message', async ({ page }) => {
    await page.locator('[data-import-input]').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":1}') });
    await expect(page.locator('[data-backup-status]')).toContainText("doesn't look like a Biz Nihongo backup");
  });

  test('cancelling reset keeps progress', async ({ page }) => {
    await seed(page, { 'bj:v1:progress': progress(['self-introduction'], [key()]) });
    await page.locator('[data-reset]').click();
    await page.getByRole('button', { name: 'Keep my progress' }).click();
    expect(await page.evaluate(() => localStorage.getItem('bj:v1:progress'))).not.toBeNull();
  });
});
