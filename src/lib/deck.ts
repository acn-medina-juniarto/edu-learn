/**
 * The learner's flashcard deck in localStorage (bj:v1:deck). Card ids are vocab
 * ids. Pure helpers (withCards, withReview) are unit-tested; read/write wrap storage.
 */
import { dateKey, newCard, review, type CardState, type Rating } from './srs';

export const DECK_KEY = 'bj:v1:deck';
export const DECK_EVENT = 'deck:change';

export interface Deck {
  version: 1;
  cards: Record<string, CardState>;
  /** Reviews done per local day, for the progress page */
  reviewsByDay: Record<string, number>;
}

export const EMPTY_DECK: Deck = { version: 1, cards: {}, reviewsByDay: {} };

export function withCards(d: Deck, ids: string[], today: string): { deck: Deck; added: string[] } {
  const added = ids.filter((id) => !d.cards[id]);
  if (!added.length) return { deck: d, added };
  const cards = { ...d.cards };
  for (const id of added) cards[id] = newCard(today);
  return { deck: { ...d, cards }, added };
}

export function withoutCard(d: Deck, id: string): Deck {
  if (!d.cards[id]) return d;
  const cards = { ...d.cards };
  delete cards[id];
  return { ...d, cards };
}

export function withReview(d: Deck, id: string, rating: Rating, today: string): Deck {
  const card = d.cards[id];
  if (!card) throw new Error(`Card "${id}" is not in the deck`);
  return {
    ...d,
    cards: { ...d.cards, [id]: review(card, rating, today) },
    reviewsByDay: { ...d.reviewsByDay, [today]: (d.reviewsByDay[today] ?? 0) + 1 },
  };
}

function isDeck(v: unknown): v is Deck {
  return typeof v === 'object' && v !== null && (v as Deck).version === 1 && typeof (v as Deck).cards === 'object';
}

export function readDeck(): Deck {
  try {
    const raw = localStorage.getItem(DECK_KEY);
    const v: unknown = raw ? JSON.parse(raw) : null;
    return isDeck(v) ? { ...v, reviewsByDay: v.reviewsByDay ?? {} } : structuredClone(EMPTY_DECK);
  } catch {
    return structuredClone(EMPTY_DECK);
  }
}

export function writeDeck(d: Deck): void {
  try {
    localStorage.setItem(DECK_KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable */
  }
  document.dispatchEvent(new CustomEvent(DECK_EVENT));
}

export function addCards(ids: string[], now = new Date()): string[] {
  const { deck, added } = withCards(readDeck(), ids, dateKey(now));
  if (added.length) writeDeck(deck);
  return added;
}

export function removeCard(id: string): void {
  writeDeck(withoutCard(readDeck(), id));
}

export function today(): string {
  return dateKey(new Date());
}
