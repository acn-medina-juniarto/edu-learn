/** Quiz flow for lesson 1 (self-introduction): 3 MC, 2 fill-blank, 1 sentence order. */
import { expect, test, type Page } from '@playwright/test';

const QUIZ = 'lessons/self-introduction/quiz';
const primary = (p: Page) => p.locator('form[data-quiz] button[type="submit"]');

async function pick(p: Page, text: string) {
  await p.locator('.option', { hasText: text }).click();
}
async function fill(p: Page, text: string) {
  await p.locator('form[data-quiz] input[type="text"]').fill(text);
}
async function order(p: Page, parts: string[]) {
  for (const part of parts) {
    await p.getByRole('group', { name: 'Word bank' }).getByRole('button', { name: new RegExp(part) }).click();
  }
}
async function checkAndNext(p: Page) {
  await primary(p).click(); // Check answer
  await expect(p.locator('[data-feedback]')).toBeVisible();
  await primary(p).click(); // Next / See results
}

test.beforeEach(async ({ page }) => {
  await page.goto(QUIZ);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('form[data-quiz]')).toBeVisible();
});

test('a perfect run scores 6/6 and saves the best score', async ({ page }) => {
  await pick(page, '申');
  await checkAndNext(page);
  await pick(page, '頂戴');
  await checkAndNext(page);
  await pick(page, '弊社');
  await checkAndNext(page);
  await fill(page, 'おります');
  await checkAndNext(page);
  await fill(page, 'なって');
  await checkAndNext(page);
  await order(page, ['本日', '時間', 'いただき', 'ありがとう']);
  await checkAndNext(page);

  await expect(page.locator('[data-quiz-results] h2')).toHaveText('6 / 6 correct');
  await expect(page.locator('[data-quiz-results] h2')).toBeFocused();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bj:v1:progress') || '{}'));
  expect(saved.quizzes['self-introduction']).toEqual({ best: 1, last: 1 });

  await page.goto('lessons/self-introduction');
  await expect(page.locator('[data-quiz-badge]')).toHaveText('Best quiz score 100%');
});

test('a wrong answer explains why and shows the right answer', async ({ page }) => {
  await pick(page, 'だよ');
  await primary(page).click();
  const fb = page.locator('[data-feedback="incorrect"]');
  await expect(fb).toBeVisible();
  await expect(fb).toContainText('Close!');
  await expect(fb).toContainText('casual');
  await expect(fb).toContainText('Answer:');
  await expect(page.locator('.option[data-state="correct"]')).toContainText('Correct answer');
  await expect(page.locator('.option[data-state="incorrect"]')).toContainText('Your answer');
  await expect(primary(page)).toHaveText(/Next question/);
});

test('Check answer stays disabled until an answer is given', async ({ page }) => {
  await expect(primary(page)).toBeDisabled();
  await pick(page, '申');
  await expect(primary(page)).toBeEnabled();
});

test('keyboard: number keys pick an option and Enter checks', async ({ page }) => {
  await page.locator('form[data-quiz] h2').click(); // focus inside the quiz, not an input
  await page.keyboard.press('2');
  await expect(page.locator('.option[data-state="selected"]')).toHaveCount(1);
  await page.locator('.option[data-state="selected"] input').press('Enter');
  await expect(page.locator('[data-feedback]')).toBeVisible();
});

test('a one-character slip in fill-in-the-blank is called close', async ({ page }) => {
  for (const t of ['申', '頂戴', '弊社']) {
    await pick(page, t);
    await checkAndNext(page);
  }
  await fill(page, 'おりま');
  await primary(page).click();
  await expect(page.locator('[data-feedback="incorrect"]')).toContainText('Almost! Check the spelling.'.replace('Almost! ', ''));
  await expect(page.locator('[data-feedback="incorrect"]')).toContainText('Close!');
});

test('Try again resets the quiz', async ({ page }) => {
  for (const t of ['だよ', 'どうも', '御社']) {
    await pick(page, t);
    await checkAndNext(page);
  }
  await fill(page, 'います');
  await checkAndNext(page);
  await fill(page, 'して');
  await checkAndNext(page);
  await order(page, ['ありがとう', '本日', '時間', 'いただき']);
  await checkAndNext(page);
  await expect(page.locator('[data-quiz-results] h2')).toHaveText('0 / 6 correct');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('Question 1 of 6')).toBeVisible();
});
