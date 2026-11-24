/** Study sections: hub, grammar, kanji, reading. */
import { expect, test } from '@playwright/test';

test('study hub links every level to all three sections', async ({ page }) => {
  await page.goto('study');
  for (const l of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    await expect(page.locator(`a[href$="/grammar#${l}"]`)).toHaveCount(1);
    await expect(page.locator(`a[href$="/kanji#${l}"]`)).toHaveCount(1);
    await expect(page.locator(`a[href$="/reading#${l}"]`)).toHaveCount(1);
  }
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Study');
});

test('grammar index lists points under each level', async ({ page }) => {
  await page.goto('grammar');
  for (const l of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    expect(await page.locator(`#${l} li`).count()).toBeGreaterThanOrEqual(2);
  }
  await page.locator('#n2 a', { hasText: '次第' }).click();
  await expect(page).toHaveURL(/grammar\/shidai$/);
});

test('a grammar page renders pattern, examples, body and links', async ({ page }) => {
  await page.goto('grammar/ni-tsuite');
  await expect(page.locator('h1')).toContainText('について');
  await expect(page.locator('.rich')).toContainText('につきまして');
  await expect(page.locator('.rich ruby').first()).toBeVisible();
  await expect(page.locator('main')).not.toContainText('{');
  await expect(page.getByRole('link', { name: '〜ように (N3)' })).toBeVisible();
  // Study pages count as the Study section in the nav
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Study');
});

test('kanji page shows readings with okurigana and examples', async ({ page }) => {
  await page.goto('kanji');
  expect(await page.locator('[id^="kanji-"]').count()).toBeGreaterThanOrEqual(15);
  const kai = page.locator('#kanji-会');
  await expect(kai).toContainText('カイ');
  await expect(kai).toContainText('meet');
  await expect(kai.locator('ruby', { hasText: '会社' })).toBeVisible();
});

test('a reading can be read, toggled and answered', async ({ page }) => {
  await page.goto('reading/n5-office-notice');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  // textContent includes the ruby reading (お知(し)らせ), so match the base text without it
  expect(await page.locator('#text-h').evaluate((el) => {
    const c = el.cloneNode(true) as HTMLElement;
    c.querySelectorAll('rt, rp').forEach((n) => n.remove());
    return c.textContent?.trim();
  })).toBe('お知らせ');
  const en = page.locator('article .en-translation').first();
  await expect(en).toBeVisible();
  await page.locator('[data-lesson-toolbar] [data-pref-toggle="english"]').click();
  await expect(en).toBeHidden();

  const submit = page.locator('form[data-quiz] button[type="submit"]');
  await page.locator('.option', { hasText: 'Next Monday' }).click();
  await submit.click();
  await submit.click();
  await page.locator('.option', { hasText: 'Read the materials' }).click();
  await submit.click();
  await submit.click();
  await expect(page.locator('[data-quiz-results] h2')).toHaveText('2 / 2 correct');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bj:v1:progress') || '{}'));
  expect(saved.quizzes['reading-n5-office-notice']).toEqual({ best: 1, last: 1 });
});
