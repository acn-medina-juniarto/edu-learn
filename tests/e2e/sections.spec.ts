/**
 * Close-up screenshots of each /design section at phone width, both themes,
 * saved to screenshots/sections/<theme>-<section>.png for visual review.
 */
import { test } from '@playwright/test';

const SECTIONS = ['buttons', 'badges', 'cards', 'furigana', 'quiz', 'flashcards', 'mascot', 'themes'];

for (const [width, theme] of [
  [375, 'light'],
  [375, 'dark'],
  [1280, 'light'],
] as const) {
  test(`lesson sections @${width}px ${theme}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('lessons/self-introduction');
    await p.evaluate(() => document.fonts.ready);
    const dir = `screenshots/lesson/${width}-${theme}`;
    await p.locator('main > header').screenshot({ path: `${dir}-header.png` });
    await p.locator('#dialogue').screenshot({ path: `${dir}-dialogue.png` });
    await p.locator('#vocabulary').screenshot({ path: `${dir}-vocab.png` });
    await p.locator('#notes').screenshot({ path: `${dir}-notes.png` });
    await p.locator('#dialogue .vocab-word').nth(1).click();
    await p.screenshot({ path: `${dir}-popup.png` });
    await p.keyboard.press('Escape');
    await p.locator('[data-finish]').click();
    await p.locator('#finish').screenshot({ path: `${dir}-finish.png` });
    await ctx.close();
  });
}

for (const [width, theme] of [
  [375, 'light'],
  [375, 'dark'],
  [1280, 'light'],
] as const) {
  test(`quiz states @${width}px ${theme}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('lessons/self-introduction/quiz');
    await p.evaluate(() => document.fonts.ready);
    const dir = `screenshots/quiz/${width}-${theme}`;
    const submit = p.locator('form[data-quiz] button[type="submit"]');
    await p.screenshot({ path: `${dir}-1-mc.png` });
    await p.locator('.option', { hasText: 'だよ' }).click();
    await submit.click();
    await p.screenshot({ path: `${dir}-2-mc-wrong.png`, fullPage: true });
    await submit.click();
    await p.locator('.option', { hasText: '頂戴' }).click();
    await submit.click();
    await p.screenshot({ path: `${dir}-3-mc-right.png`, fullPage: true });
    await submit.click();
    await p.locator('.option', { hasText: '弊社' }).click();
    await submit.click();
    await submit.click();
    await p.locator('form[data-quiz] input[type="text"]').fill('おります');
    await p.screenshot({ path: `${dir}-4-fill.png` });
    await submit.click();
    await submit.click();
    await p.locator('form[data-quiz] input[type="text"]').fill('なって');
    await submit.click();
    await submit.click();
    await p.getByRole('group', { name: 'Word bank' }).getByRole('button', { name: /本日/ }).click();
    await p.screenshot({ path: `${dir}-5-order.png` });
    for (const w of [/時間/, /いただき/, /ありがとう/]) {
      await p.getByRole('group', { name: 'Word bank' }).getByRole('button', { name: w }).click();
    }
    await submit.click();
    await submit.click();
    await p.screenshot({ path: `${dir}-6-results.png`, fullPage: true });
    await ctx.close();
  });
}

for (const [width, theme] of [
  [375, 'light'],
  [375, 'dark'],
  [1280, 'light'],
] as const) {
  test(`flashcard states @${width}px ${theme}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('flashcards');
    await p.evaluate(() => localStorage.clear());
    await p.reload();
    await p.evaluate(() => document.fonts.ready);
    const dir = `screenshots/flashcards/${width}-${theme}`;
    await p.screenshot({ path: `${dir}-1-empty.png`, fullPage: true });
    await p.locator('[data-add-lesson="phone-etiquette"]').click();
    await p.screenshot({ path: `${dir}-2-front.png` });
    await p.locator('[data-show-answer]').click();
    await p.screenshot({ path: `${dir}-3-back.png` });
    await p.locator('[data-rating="good"]').click(); // first card is already flipped
    for (let i = 0; i < 10; i++) {
      await p.locator('[data-show-answer]').click();
      await p.locator('[data-rating="good"]').click();
    }
    await p.screenshot({ path: `${dir}-4-done.png` });
    await ctx.close();
  });
}

for (const [width, theme] of [
  [375, 'light'],
  [375, 'dark'],
  [1280, 'light'],
] as const) {
  test(`home + progress with data @${width}px ${theme}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('');
    await p.evaluate(() => {
      const key = (o: number) => {
        const d = new Date();
        d.setDate(d.getDate() + o);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };
      const iso = new Date().toISOString();
      localStorage.setItem(
        'bj:v1:progress',
        JSON.stringify({
          version: 1,
          lessons: { 'self-introduction': { completedAt: iso, lastStudiedAt: iso }, 'phone-etiquette': { completedAt: iso, lastStudiedAt: iso } },
          activeDays: [key(-3), key(-2), key(-1), key(0)],
          quizzes: { 'self-introduction': { best: 0.83, last: 0.83 }, 'phone-etiquette': { best: 1, last: 1 } },
        }),
      );
      const reviews: Record<string, number> = {};
      [0, 1, 2, 3, 5, 8, 9, 12].forEach((o, i) => (reviews[key(-o)] = [7, 12, 4, 9, 3, 11, 6, 2][i]));
      const card = { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: key(0), added: key(0) };
      localStorage.setItem('bj:v1:deck', JSON.stringify({ version: 1, cards: { meishi: card, heisha: card, mousu: card }, reviewsByDay: reviews }));
    });
    await p.reload();
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `screenshots/home/${width}-${theme}-home.png`, fullPage: true });
    await p.goto('progress');
    await p.locator('[data-progress]').waitFor();
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `screenshots/home/${width}-${theme}-progress.png`, fullPage: true });
    await ctx.close();
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`design sections @375px ${theme}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 900 },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    const p = await ctx.newPage();
    await p.goto('design');
    await p.evaluate(() => document.fonts.ready);
    for (const id of SECTIONS) {
      const section = p.locator(`section[aria-labelledby="${id}"]`);
      await section.screenshot({ path: `screenshots/sections/${theme}-${id}.png` });
    }
    await ctx.close();
  });
}
