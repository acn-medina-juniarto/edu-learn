/** Keigo reference search and the email builder. */
import { expect, test } from '@playwright/test';

test.describe('keigo reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('keigo');
  });

  const visible = (page: import('@playwright/test').Page) => page.locator('[data-keigo-entry]:not([hidden])');

  test('lists every verb with all three columns', async ({ page }) => {
    const total = await page.locator('[data-keigo-entry]').count();
    expect(total).toBeGreaterThanOrEqual(20);
    await expect(page.locator('#keigo-count')).toHaveText(`Showing ${total} of ${total} verbs`);
    await expect(page.locator('#keigo-iu')).toContainText('おっしゃる');
    await expect(page.locator('#keigo-iu')).toContainText('申す');
  });

  test('search works by reading, English and keigo form', async ({ page }) => {
    const box = page.locator('#keigo-search');
    await box.fill('いう');
    await expect(visible(page)).toHaveCount(1);
    await expect(visible(page).first()).toHaveAttribute('id', 'keigo-iu');
    await box.fill('say');
    await expect(visible(page).first()).toHaveAttribute('id', 'keigo-iu');
    await box.fill('伺う');
    // filtering is debounced, so poll until it settles
    await expect
      .poll(() => visible(page).evaluateAll((els) => els.map((e) => e.id).sort()))
      .toEqual(['keigo-iku', 'keigo-kiku', 'keigo-kuru']);
  });

  test('no results shows a friendly message and Clear resets', async ({ page }) => {
    await page.locator('#keigo-search').fill('zzzz');
    await expect(page.locator('#keigo-empty')).toBeVisible();
    await page.locator('#keigo-clear').click();
    await expect(page.locator('#keigo-empty')).toBeHidden();
    await expect(page.locator('#keigo-search')).toBeFocused();
  });

  test('"/" jumps to the search box', async ({ page }) => {
    await page.locator('h2').first().click();
    await page.keyboard.press('/');
    await expect(page.locator('#keigo-search')).toBeFocused();
  });
});

test.describe('email builder', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('email');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator('[data-email-builder]')).toBeVisible();
  });

  test('empty fields show as 〔placeholders〕 and example fill completes them', async ({ page }) => {
    const preview = page.locator('[data-email-preview]');
    await expect(preview.locator('.email-field-empty').first()).toBeVisible();
    await page.getByRole('button', { name: 'Fill with example' }).click();
    await expect(preview.locator('.email-field-empty')).toHaveCount(0);
    await expect(preview).toContainText('北山工業株式会社');
  });

  test('typed values are escaped, not rendered as HTML', async ({ page }) => {
    await page.getByLabel("Client's surname").fill('<b>田中</b>');
    await expect(page.locator('[data-email-preview] mark[data-field="clientName"]').first()).toHaveText('<b>田中</b>');
    await expect(page.locator('[data-email-preview] b')).toHaveCount(0);
  });

  test('copy puts plain text (no furigana) on the clipboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Fill with example' }).click();
    await page.locator('[data-copy-body]').click();
    await expect(page.locator('[data-email-status]')).toContainText('Email copied!');
    // Windows' clipboard stores CRLF line endings
    const text = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
    expect(text.startsWith('北山工業株式会社\n購買部 田中様')).toBe(true);
    expect(text).toContain('いつもお世話になっております。');
    expect(text).not.toContain('せわ'); // no readings leaked into the copy
  });

  test('field values carry over between templates', async ({ page }) => {
    await page.getByLabel("Client's surname").fill('佐々木');
    await page.locator('label.option', { hasText: 'Apologizing for a delayed delivery' }).click();
    await expect(page.getByLabel("Client's surname")).toHaveValue('佐々木');
    await expect(page.locator('[data-email-preview]')).toContainText('お詫び');
    await page.reload();
    await expect(page.getByLabel("Client's surname")).toHaveValue('佐々木');
  });

  test('"Explain each part" can be switched off', async ({ page }) => {
    const toggle = page.getByLabel('Explain each part');
    await expect(page.locator('[data-email-preview]')).toContainText(/largest to smallest/i);
    await toggle.uncheck();
    await expect(page.locator('[data-email-preview]')).not.toContainText(/largest to smallest/i);
  });
});
