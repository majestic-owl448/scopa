import type { Card, GameConfig } from './types.ts';

function subsetsWithSum(cards: Card[], target: number): Card[][] {
  const results: Card[][] = [];

  function backtrack(start: number, current: Card[], currentSum: number) {
    if (currentSum === target) {
      results.push([...current]);
      return;
    }
    if (currentSum > target) return;
    for (let i = start; i < cards.length; i++) {
      const card = cards[i]!;
      current.push(card);
      backtrack(i + 1, current, currentSum + card.rank);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return results;
}

export function findCaptures(played: Card, table: Card[], config: GameConfig): Card[][] {
  if (table.length === 0) return [];

  // Scopa d'Assi: Ace captures everything
  if (config.scopaDAssi && played.rank === 1 && table.length > 0) {
    return [[...table]];
  }

  if (config.captureTarget === 'quindici') {
    const target = 15 - played.rank;
    if (target <= 0) return [];
    const allCombos = subsetsWithSum(table, target);
    if (allCombos.length === 0) return [];
    const minLen = Math.min(...allCombos.map(c => c.length));
    return allCombos.filter(c => c.length === minLen);
  }

  if (config.captureTarget === 'undici') {
    const target = 11 - played.rank;
    if (target <= 0) return [];
    const allCombos = subsetsWithSum(table, target);
    if (allCombos.length === 0) return [];
    const minLen = Math.min(...allCombos.map(c => c.length));
    return allCombos.filter(c => c.length === minLen);
  }

  // Standard 'rank' capture
  const results: Card[][] = [];

  // Single-card rank match takes priority: find all single cards matching the rank
  const singleMatches = table.filter(c => c.rank === played.rank);
  if (singleMatches.length > 0) {
    // Must take single-card match; if multiple, player chooses which one
    return singleMatches.map(c => [c]);
  }

  // No single match: find all subset-sum combinations
  const subsets = subsetsWithSum(table, played.rank);
  for (const subset of subsets) {
    if (subset.length >= 2) {
      results.push(subset);
    }
  }

  return results;
}

export function mustCapture(played: Card, table: Card[], config: GameConfig): boolean {
  return findCaptures(played, table, config).length > 0;
}

export function isScopaCapture(captured: Card[], table: Card[]): boolean {
  if (captured.length !== table.length) return false;
  const capturedIds = new Set(captured.map(c => c.id));
  return table.every(c => capturedIds.has(c.id));
}
