import type { Card, Suit } from './types.ts';

export const SUITS: Suit[] = ['coins', 'cups', 'swords', 'clubs'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 10; rank++) {
      deck.push({ id: `${suit}-${rank}`, suit, rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

export function cut(deck: Card[], position?: number): Card[] {
  const k = position ?? (1 + Math.floor(Math.random() * (deck.length - 2)));
  return [...deck.slice(k), ...deck.slice(0, k)];
}
