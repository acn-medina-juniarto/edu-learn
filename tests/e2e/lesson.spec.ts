/** Lesson page behaviour: toggles, word popup, notes rendering, completion. */
import { expect, test } from '@playwright/test';

const LESSON = 'lessons/self-introduction';

test.beforeEach(async ({ page }) => {
  await page.goto(LESSON);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('furigana toggle hides ruby text and is remembered', async ({ page }) => {
  const rt = page.locator('#dialogue rt').first();
  await expect(rt).toBeVisible();
  const toggle = page.locator('[data-lesson-toolbar] [data-pref-toggle="furigana"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(rt).toBeHidden();
  await page.reload();
  await expect(page.locator('#dialogue rt').first()).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-furigana', 'off');
});

test('English toggle hides translations', async ({ page }) => {
  const en = page.locator('#dialogue .en-translation').first();
  await expect(en).toBeVisible();
  await page.locator('[data-lesson-toolbar] [data-pref-toggle="english"]').click();
  await expect(en).toBeHidden();
});

test('tapping a word opens the popup; Escape closes it and restores focus', async ({ page }) => {
  const word = page.locator('#dialogue .vocab-word[data-vocab-id="mousu"]').first();
  await word.click();
  const popup = page.locator('#word-popup');
  await expect(popup).toBeVisible();
  await expect(popup.locator('#word-popup-meaning')).toHaveText(/to say/);
  await expect(page.locator('#word-popup-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(word).toBeFocused();
});

test('word popup works from the keyboard', async ({ page }) => {
  const word = page.locator('#dialogue .vocab-word').first();
  await word.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#word-popup')).toBeVisible();
});

test('notes render Markdown tables with furigana', async ({ page }) => {
  const table = page.locator('#notes table').first();
  await expect(table).toBeVisible();
  await expect(table.locator('ruby').first()).toBeVisible();
  // No raw markup leaked into the page
  await expect(page.locator('main')).not.toContainText('{');
});

test('finishing a lesson saves progress and celebrates', async ({ page }) => {
  await page.locator('[data-finish]').click();
  await expect(page.getByText('Lesson complete!')).toBeVisible();
  await expect(page.locator('[data-completed-badge]')).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bj:v1:progress') || '{}'));
  expect(saved.lessons['self-introduction'].completedAt).toBeTruthy();
  expect(saved.activeDays.length).toBe(1);
  await page.reload();
  await expect(page.getByText('Lesson complete!')).toBeVisible();
});

test('dialogue lines carry controlled speech readings', async ({ page }) => {
  await page.goto('lessons/phone-etiquette');
  const line = page.locator('[data-line-speech*="ゼロサンの"]');
  await expect(line).toHaveCount(2);
});
