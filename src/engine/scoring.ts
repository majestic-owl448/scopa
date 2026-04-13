import type { Card, Player, GameConfig, RoundScore, PrimieraDetails } from './types.ts';

export const PRIMIERA_VALUES_STANDARD: Record<number, number> = {
  7: 21,
  6: 18,
  1: 16,
  5: 15,
  4: 14,
  3: 13,
  2: 12,
  8: 10,
  9: 10,
  10: 10,
};

export const PRIMIERA_VALUES_VENETO: Record<number, number> = {
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 5,
  8: 0,
  9: 0,
  10: 0,
};

export function scoreCarte(players: Player[]): number | null {
  const counts = players.map(p => p.captured.length);
  const max = Math.max(...counts);
  const winners = counts.filter(c => c === max).length;
  if (winners > 1) return null;
  return counts.indexOf(max);
}

export function scoreOri(players: Player[]): number | null {
  const counts = players.map(p => p.captured.filter(c => c.suit === 'coins').length);
  const max = Math.max(...counts);
  const winners = counts.filter(c => c === max).length;
  if (winners > 1) return null;
  return counts.indexOf(max);
}

export function scoreSettebello(players: Player[]): number | null {
  for (let i = 0; i < players.length; i++) {
    const p = players[i]!;
    if (p.captured.some(c => c.suit === 'coins' && c.rank === 7)) return i;
  }
  return null;
}

export function scoreReBello(players: Player[]): number | null {
  for (let i = 0; i < players.length; i++) {
    const p = players[i]!;
    if (p.captured.some(c => c.suit === 'coins' && c.rank === 10)) return i;
  }
  return null;
}

export function scoreRosmarino(players: Player[]): number | null {
  for (let i = 0; i < players.length; i++) {
    const p = players[i]!;
    if (p.captured.some(c => c.suit === 'swords' && c.rank === 8)) return i;
  }
  return null;
}

export function scorePrimiera(
  players: Player[],
  config: GameConfig
): { winner: number | null; details: PrimieraDetails[] } {
  if (config.primieraValues === 'milano') {
    return scorePrimieraMilano(players);
  }

  const values = config.primieraValues === 'veneto' ? PRIMIERA_VALUES_VENETO : PRIMIERA_VALUES_STANDARD;
  const suits: Array<'coins' | 'cups' | 'swords' | 'clubs'> = ['coins', 'cups', 'swords', 'clubs'];

  const details: PrimieraDetails[] = players.map(p => {
    const bestPerSuit: (Card | null)[] = suits.map(suit => {
      const cards = p.captured.filter(c => c.suit === suit);
      if (cards.length === 0) return null;
      return cards.reduce((best, c) => {
        const bv = values[best.rank] ?? 0;
        const cv = values[c.rank] ?? 0;
        return cv > bv ? c : best;
      });
    });

    const suitValues = bestPerSuit.map(c => c ? (values[c.rank] ?? 0) : 0);
    const total = suitValues.reduce((a, b) => a + (b ?? 0), 0);

    return { bestPerSuit, suitValues, total };
  });

  const totals = details.map(d => d.total ?? 0);
  const max = Math.max(...totals);
  const winners = totals.filter(t => t === max).length;

  return {
    winner: winners > 1 ? null : totals.indexOf(max),
    details,
  };
}

function scorePrimieraMilano(
  players: Player[]
): { winner: number | null; details: PrimieraDetails[] } {
  const details: PrimieraDetails[] = players.map(p => {
    const sevens = p.captured.filter(c => c.rank === 7).length;
    const sixes = p.captured.filter(c => c.rank === 6).length;
    const aces = p.captured.filter(c => c.rank === 1).length;
    return {
      bestPerSuit: [null, null, null, null],
      suitValues: [null, null, null, null],
      total: null,
      milanoCounts: { sevens, sixes, aces },
    };
  });

  let candidates = players.map((_, i) => i);

  for (const key of ['sevens', 'sixes', 'aces'] as const) {
    const counts = candidates.map(i => details[i]!.milanoCounts![key]);
    const max = Math.max(...counts);
    candidates = candidates.filter(i => details[i]!.milanoCounts![key] === max);
    if (candidates.length === 1) {
      return { winner: candidates[0]!, details };
    }
  }

  return { winner: null, details };
}

export function scoreSettanta(players: Player[]): number | null {
  for (let i = 0; i < players.length; i++) {
    const p = players[i]!;
    const suits: Suit[] = ['coins', 'cups', 'swords', 'clubs'];
    const hasAll = suits.every(suit => p.captured.some(c => c.suit === suit && c.rank === 7));
    if (hasAll) return i;
  }
  return null;
}

type Suit = 'coins' | 'cups' | 'swords' | 'clubs';

export function scoreNapola(players: Player[]): number[] {
  return players.map(p => {
    const coinCards = new Set(p.captured.filter(c => c.suit === 'coins').map(c => c.rank));
    if (!coinCards.has(1) || !coinCards.has(2) || !coinCards.has(3)) return 0;
    let count = 3;
    for (let r = 4; r <= 10; r++) {
      if (coinCards.has(r)) count++;
      else break;
    }
    return count;
  });
}

export function scoreHand(players: Player[], config: GameConfig): RoundScore[] {
  const carteWinner = scoreCarte(players);
  const oriWinner = scoreOri(players);
  const settebelloWinner = scoreSettebello(players);
  const { winner: primieraWinner, details: primieraDetails } = scorePrimiera(players, config);
  const reBelloWinner = config.reBello ? scoreReBello(players) : null;
  const rosarinoWinner = config.rosmarino ? scoreRosmarino(players) : null;
  const settantaWinner = config.settanta ? scoreSettanta(players) : null;
  const napolaPoints = config.napola ? scoreNapola(players) : players.map(() => 0);

  return players.map((p, i) => {
    const scope = p.scopeMarkerCards.length;
    const carte = carteWinner === i;
    const ori = oriWinner === i;
    const settebello = settebelloWinner === i;
    const primiera = primieraWinner === i;
    const reBello = reBelloWinner === i;
    const rosmarino = rosarinoWinner === i;
    const settanta = settantaWinner === i;
    const napola = napolaPoints[i] ?? 0;

    const total =
      scope +
      (carte ? 1 : 0) +
      (ori ? 1 : 0) +
      (settebello ? 1 : 0) +
      (primiera ? 1 : 0) +
      (reBello ? 1 : 0) +
      (rosmarino ? 1 : 0) +
      (settanta ? 1 : 0) +
      napola;

    return {
      playerIndex: i,
      scope,
      carte,
      ori,
      settebello,
      primiera,
      primieraDetails: primieraDetails[i]!,
      reBello,
      rosmarino,
      settanta,
      napola,
      total,
    };
  });
}
