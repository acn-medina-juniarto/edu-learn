/**
 * Global handler for [data-add-card="vocabId"] buttons (vocab cards, word popup).
 * Toggles between "Add to flashcards" and "In your deck ✓" and keeps every
 * button for the same card in sync. Loaded once from Base.astro.
 */
import { addCards, DECK_EVENT, readDeck } from '@/lib/deck';

function sync() {
  const cards = readDeck().cards;
  document.querySelectorAll<HTMLButtonElement>('[data-add-card]').forEach((b) => {
    const id = b.dataset.addCard ?? '';
    const inDeck = !!cards[id];
    b.dataset.inDeck = String(inDeck);
    const label = b.querySelector('[data-add-label]');
    if (label) label.textContent = inDeck ? 'In your deck' : 'Add to flashcards';
  });
}

document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-add-card]');
  if (!b || b.dataset.inDeck === 'true') return;
  addCards([b.dataset.addCard ?? '']);
});
document.addEventListener(DECK_EVENT, sync);
document.addEventListener('deck:sync', sync); // for UI that changes data-add-card dynamically
sync();
