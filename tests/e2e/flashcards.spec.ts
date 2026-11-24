/** Flashcards: deck building, review session, SM-2 scheduling, and add-to-deck buttons. */
import { expect, test, type Page } from '@playwright/test';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

async function seedDeck(page: Page, cards: Record<string, object>) {
  await page.evaluate((c) => {
    localStorage.setItem('bj:v1:deck', JSON.stringify({ version: 1, cards: c, reviewsByDay: {} }));
  }, cards);
}
const deck = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('bj:v1:deck') || '{}'));
const card = (due: string, extra: object = {}) => ({ ease: 2.5, interval: 0, reps: 0, lapses: 0, due, added: due, ...extra });

test.beforeEach(async ({ page }) => {
  await page.goto('flashcards');
  await page.evaluate(() => localStorage.clear());
});

test('an empty deck explains how to add cards', async ({ page }) => {
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your deck is empty' })).toBeVisible();
  await expect(page.locator('[data-due-badge]')).toBeHidden();
});

test('adding a lesson starts a session and updates the header badge', async ({ page }) => {
  await page.reload();
  await page.locator('[data-add-lesson="self-introduction"]').click();
  await expect(page.locator('[data-remaining]')).toHaveText('12 cards left');
  await expect(page.locator('[data-due-count]')).toHaveText('12');
  await expect(page.locator('[data-add-lesson="self-introduction"]')).toHaveCount(0);
});

test('front hides the answer; Space shows it; Good schedules tomorrow', async ({ page }) => {
  await seedDeck(page, { meishi: card(todayKey()) });
  await page.reload();
  const back = page.locator('.flip-back');
  await expect(back).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.flip-face').first()).toContainText('名刺');
  await page.keyboard.press('Space');
  await expect(back).not.toHaveAttribute('aria-hidden', 'true');
  await expect(back).toContainText('business card');
  await expect(page.locator('[data-rating="good"]')).toContainText('1 day');
  await page.keyboard.press('3');
  await expect(page.getByRole('heading', { name: 'Session complete!' })).toBeVisible();
  await expect(page.getByText('Next cards are due tomorrow.')).toBeVisible();
  const d = await deck(page);
  expect(d.cards.meishi).toMatchObject({ reps: 1, interval: 1 });
  expect(Object.values(d.reviewsByDay)).toEqual([1]);
});

test('Again brings the card back later in the same session', async ({ page }) => {
  await seedDeck(page, { meishi: card(todayKey()), heisha: card(todayKey()) });
  await page.reload();
  await expect(page.locator('[data-remaining]')).toHaveText('2 cards left');
  await page.locator('[data-show-answer]').click();
  await page.locator('[data-rating="again"]').click();
  await expect(page.locator('[data-remaining]')).toHaveText('2 cards left'); // 1 left + the requeued card
  const d = await deck(page);
  expect(Object.values(d.cards).some((c) => (c as { lapses: number }).lapses === 1)).toBe(true);
});

test('cards due later show a friendly "nothing due" state', async ({ page }) => {
  await seedDeck(page, { meishi: card('2999-01-01', { reps: 3, interval: 20, lastReviewed: todayKey() }) });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'No cards due today' })).toBeVisible();
  await expect(page.getByText('1 card is in your deck')).toBeVisible();
});

test('finishing a lesson adds its words to the deck', async ({ page }) => {
  await page.goto('lessons/phone-etiquette');
  await page.locator('[data-finish]').click();
  await expect(page.getByText('11 words added to your flashcards')).toBeVisible();
  await expect(page.locator('[data-due-count]')).toHaveText('11');
  await expect(page.locator('#vocab-odenwa [data-add-card]')).toHaveAttribute('data-in-deck', 'true');
  await expect(page.locator('#vocab-odenwa [data-add-label]')).toHaveText('In your deck');
});

test('the word popup and vocab cards can add a single word', async ({ page }) => {
  await page.goto('lessons/self-introduction');
  await page.locator('#dialogue .vocab-word[data-vocab-id="mousu"]').first().click();
  const add = page.locator('#word-popup-add');
  await expect(add).toHaveAttribute('data-add-card', 'mousu');
  await add.click();
  await expect(add).toContainText('In your deck');
  await expect(page.locator('#vocab-mousu [data-add-label]')).toHaveText('In your deck');
  expect(Object.keys((await deck(page)).cards)).toEqual(['mousu']);
});
