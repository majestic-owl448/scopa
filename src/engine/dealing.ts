import type { Card } from './types.ts';
import { createDeck, shuffle, cut } from './deck.ts';

export function isVoidDeal(deck: Card[], playerCount: number, cardsPerHand: number): boolean {
  const tableStart = cardsPerHand * playerCount;
  let kingCount = 0;
  for (let i = tableStart; i < tableStart + 4; i++) {
    const card = deck[i];
    if (card && card.rank === 10) kingCount++;
  }
  return kingCount >= 3;
}

export function dealHand(
  deck: Card[],
  playerCount: number,
  cardsPerHand: number
): { hands: Card[][]; table: Card[]; remaining: Card[] } {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  let idx = 0;

  for (let round = 0; round < cardsPerHand; round++) {
    for (let p = 0; p < playerCount; p++) {
      const card = deck[idx++];
      if (card) hands[p]!.push(card);
    }
  }

  const table = deck.slice(idx, idx + 4);
  const remaining = deck.slice(idx + 4);

  return { hands, table, remaining };
}

export function dealClean(
  playerCount: number,
  cardsPerHand: number
): { hands: Card[][]; table: Card[]; remaining: Card[] } {
  let deck = shuffle(createDeck());
  deck = cut(deck);
  while (isVoidDeal(deck, playerCount, cardsPerHand)) {
    deck = shuffle(createDeck());
    deck = cut(deck);
  }
  return dealHand(deck, playerCount, cardsPerHand);
}

export function redeal(
  deck: Card[],
  playerCount: number,
  cardsPerHand: number
): { hands: Card[][]; remaining: Card[] } {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  let idx = 0;

  for (let round = 0; round < cardsPerHand; round++) {
    for (let p = 0; p < playerCount; p++) {
      const card = deck[idx++];
      if (card) hands[p]!.push(card);
    }
  }

  return { hands, remaining: deck.slice(idx) };
}
