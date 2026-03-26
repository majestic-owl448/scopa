import type { Card, GameState, AIVisibleState, GameConfig, PointLandscape } from './types.ts';
import { findCaptures } from './captures.ts';
import { PRIMIERA_VALUES_STANDARD, PRIMIERA_VALUES_VENETO } from './scoring.ts';

export function buildAIVisibleState(state: GameState, playerIndex: number): AIVisibleState {
  const player = state.players[playerIndex]!;
  const diff = player.difficulty;
  const tier = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 4;

  const scopeCards = state.players.map(p => p.scopeMarkerCards);
  const scopeCounts = scopeCards.map(s => s.length);

  let settebelloHolder: number | null = null;
  let reBelloHolder: number | null = null;
  for (let i = 0; i < state.players.length; i++) {
    const p = state.players[i]!;
    if (p.captured.some(c => c.suit === 'coins' && c.rank === 7)) settebelloHolder = i;
    if (state.config.reBello && p.captured.some(c => c.suit === 'coins' && c.rank === 10)) reBelloHolder = i;
  }

  let capturedCounts: number[] = [];
  let coinsCounts: number[] = [];
  let allCaptured: Card[][] = [];
  let seenCards: Card[] = [];
  let unseenCards: Card[] = [];

  if (tier >= 2) {
    capturedCounts = state.players.map(p => p.captured.length);
    coinsCounts = state.players.map(p => p.captured.filter(c => c.suit === 'coins').length);
  }

  if (tier >= 3) {
    allCaptured = state.players.map(p => [...p.captured]);
    seenCards = [
      ...state.table,
      ...state.players.flatMap(p => p.captured),
      ...state.history.map(t => t.cardPlayed),
    ];
  }

  if (tier >= 4) {
    const knownCardIds = new Set([
      ...player.hand.map(c => c.id),
      ...state.table.map(c => c.id),
      ...state.players.flatMap(p => p.captured.map(c => c.id)),
    ]);
    const allCardIds = new Set<string>();
    for (const suit of ['coins', 'cups', 'swords', 'clubs'] as const) {
      for (let r = 1; r <= 10; r++) allCardIds.add(`${suit}-${r}`);
    }
    unseenCards = [...allCardIds]
      .filter(id => !knownCardIds.has(id))
      .map(id => {
        const [suit, rankStr] = id.split('-') as [string, string];
        return { id, suit: suit as Card['suit'], rank: parseInt(rankStr, 10) };
      });
  }

  return {
    myHand: [...player.hand],
    table: [...state.table],
    scopeCards,
    scopeCounts,
    settebelloHolder,
    reBelloHolder,
    totalScores: [...state.totalScores],
    handNumber: state.handNumber,
    capturedCounts,
    coinsCounts,
    allCaptured,
    seenCards,
    unseenCards,
    myPlayerIndex: playerIndex,
    playerHandCounts: state.players.map(p => p.hand.length),
    difficulty: diff,
    config: state.config,
  };
}

/** How many 7s of `suit` this player already holds from their pile (Tier 3 only). */
function mySevenCount(visible: AIVisibleState): number {
  const myCapt = visible.allCaptured[visible.myPlayerIndex];
  if (!myCapt) return 0;
  return myCapt.filter(c => c.rank === 7).length;
}

function primieraValue(rank: number, config: GameConfig): number {
  if (config.primieraValues === 'veneto') return PRIMIERA_VALUES_VENETO[rank] ?? 0;
  if (config.primieraValues === 'milano') {
    // 7s > 6s > Aces; treat as high/medium/low
    if (rank === 7) return 21;
    if (rank === 6) return 15;
    if (rank === 1) return 10;
    return 0;
  }
  return PRIMIERA_VALUES_STANDARD[rank] ?? 0;
}

type ScoreResult = { score: number; breakdown: Record<string, number> };

function add(bd: Record<string, number>, key: string, val: number) {
  if (val !== 0) bd[key] = (bd[key] ?? 0) + val;
}

/** Score a capture in standard (non-inversa) mode. */
function scoreCaptureStandard(played: Card, captured: Card[], visible: AIVisibleState): ScoreResult {
  const config = visible.config;
  const breakdown: Record<string, number> = {};

  const isScopa = captured.length === visible.table.length;
  if (isScopa) add(breakdown, 'scopa', 100);

  for (const c of captured) {
    if (c.suit === 'coins' && c.rank === 7) add(breakdown, 'settebello', 50);
    if (config.reBello && c.suit === 'coins' && c.rank === 10) add(breakdown, 're_bello', 40);
    if (config.rosmarino && c.suit === 'swords' && c.rank === 8) add(breakdown, 'rosmarino', 35);

    if (config.napola && c.suit === 'coins') {
      if (c.rank === 1) add(breakdown, 'napola', 30);
      else if (c.rank === 2) add(breakdown, 'napola', 20);
      else if (c.rank === 3) add(breakdown, 'napola', 15);
      else if (c.rank <= 7) add(breakdown, 'napola', 8);
    }

    if (config.settanta && c.rank === 7) {
      const alreadyHave = mySevenCount(visible);
      const bonus = alreadyHave === 3 ? 60 : alreadyHave === 2 ? 30 : alreadyHave === 1 ? 15 : 10;
      add(breakdown, 'settanta', bonus);
    }

    if (c.suit === 'coins') add(breakdown, 'ori', 5);
    const pv = primieraValue(c.rank, config) / 10;
    if (pv) add(breakdown, 'primiera', pv);
    add(breakdown, 'carte', 1);
  }

  const score = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { score, breakdown };
}

/** Score a capture in inversa mode — capturing is generally bad. */
function scoreCaptureInversa(played: Card, captured: Card[], visible: AIVisibleState): ScoreResult {
  const config = visible.config;
  const breakdown: Record<string, number> = {};

  const isScopa = captured.length === visible.table.length;
  if (isScopa) add(breakdown, 'scopa', -80);

  for (const c of captured) {
    if (c.suit === 'coins' && c.rank === 7) add(breakdown, 'settebello', -50);
    if (config.reBello && c.suit === 'coins' && c.rank === 10) add(breakdown, 're_bello', -40);
    if (config.rosmarino && c.suit === 'swords' && c.rank === 8) add(breakdown, 'rosmarino', -35);
    if (c.suit === 'coins') add(breakdown, 'ori', -5);
    const pv = primieraValue(c.rank, config) / 10;
    if (pv) add(breakdown, 'primiera', -pv);
    add(breakdown, 'carte', -1);
  }
  add(breakdown, 'size', -(captured.length * 2));

  const score = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { score, breakdown };
}

/** Score discarding a card in standard mode. */
function scoreDiscardStandard(card: Card, visible: AIVisibleState): ScoreResult {
  const config = visible.config;
  const breakdown: Record<string, number> = {};

  if (card.suit === 'coins' && card.rank === 7) add(breakdown, 'settebello', -50);
  if (config.reBello && card.suit === 'coins' && card.rank === 10) add(breakdown, 're_bello', -40);
  if (config.rosmarino && card.suit === 'swords' && card.rank === 8) add(breakdown, 'rosmarino', -35);
  if (config.napola && card.suit === 'coins' && card.rank <= 3) add(breakdown, 'napola', -25);

  const pv = primieraValue(card.rank, config) / 5;
  if (pv) add(breakdown, 'primiera', -pv);

  const tableSum = visible.table.reduce((s, c) => s + c.rank, 0) + card.rank;
  if (config.captureTarget === 'quindici') {
    if (tableSum === 15) add(breakdown, 'scopa_risk', -30);
    else if (tableSum <= 14 && tableSum >= 11) add(breakdown, 'scopa_risk', -10);
  } else if (config.captureTarget === 'undici') {
    if (tableSum === 11) add(breakdown, 'scopa_risk', -30);
    else if (tableSum <= 10 && tableSum >= 8) add(breakdown, 'scopa_risk', -10);
  } else {
    if (tableSum <= 10) add(breakdown, 'scopa_risk', -20);
  }

  const score = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { score, breakdown };
}

/** Score discarding a card in inversa mode — leaving good bait for the opponent. */
function scoreDiscardInversa(card: Card, visible: AIVisibleState): ScoreResult {
  const config = visible.config;
  const breakdown: Record<string, number> = {};

  const tableSum = visible.table.reduce((s, c) => s + c.rank, 0) + card.rank;
  if (config.captureTarget === 'quindici') {
    if (tableSum === 15) add(breakdown, 'scopa_bait', 30);
  } else if (config.captureTarget === 'undici') {
    if (tableSum === 11) add(breakdown, 'scopa_bait', 30);
  } else {
    if (tableSum <= 10) add(breakdown, 'scopa_bait', 20);
  }

  if (card.suit === 'coins') add(breakdown, 'ori_bait', 10);
  if (card.suit === 'coins' && card.rank === 7) add(breakdown, 'settebello_bait', 40);
  if (config.reBello && card.suit === 'coins' && card.rank === 10) add(breakdown, 're_bello_bait', 30);
  if (config.rosmarino && card.suit === 'swords' && card.rank === 8) add(breakdown, 'rosmarino_bait', 25);

  const pv = primieraValue(card.rank, config) / 5;
  add(breakdown, 'low_value', 10 - pv);

  const score = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return { score, breakdown };
}

type PlayEvaluation = {
  cardId: string;
  captureIds: string[];
  priorityKey: string;
  reasonKey: string;
  score: number;
  scoreBreakdown: Record<string, number>;
};

// Maps capture-context breakdown keys to the learn-mode module that unlocks them.
// When evaluateAllPlays is called with a modules list, components not covered by
// any active module are zeroed out — the AI reasons only with what the player knows.
const CAPTURE_KEY_MODULE: Record<string, string> = {
  carte:     'S1',
  size:      'S1',    // inversa: penalty for capturing many cards
  scopa:     'S3',
  settebello:'S2',
  re_bello:  'S2',
  rosmarino: 'S2',
  ori:       'S4',
  primiera:  'S5',
  settanta:  'V3-S1',
  napola:    'V2-S1',
};

// Maps discard-context breakdown keys to the required module.
const DISCARD_KEY_MODULE: Record<string, string> = {
  scopa_risk:      'S7',
  settebello:      'S8',
  re_bello:        'S8',
  rosmarino:       'S8',
  napola:          'S8',
  primiera:        'S8',
  // Inversa discard (bait scoring)
  scopa_bait:      'V10-S2',
  ori_bait:        'V10-S1',
  settebello_bait: 'V10-S1',
  re_bello_bait:   'V10-S1',
  rosmarino_bait:  'V10-S1',
  low_value:       'V10-S1',
};

function applyModuleFilter(
  breakdown: Record<string, number>,
  moduleSet: Set<string>,
  keyModule: Record<string, string>,
): { breakdown: Record<string, number>; score: number } {
  const filtered: Record<string, number> = {};
  for (const [key, val] of Object.entries(breakdown)) {
    const mod = keyModule[key];
    if (!mod || moduleSet.has(mod)) filtered[key] = val;
  }
  const score = Object.values(filtered).reduce((s, v) => s + v, 0);
  return { breakdown: filtered, score };
}

export function evaluateAllPlays(
  visible: AIVisibleState,
  modules?: string[]
): PlayEvaluation[] {
  const results: PlayEvaluation[] = [];
  const inversa = visible.config.inversa;
  const moduleSet = modules ? new Set(modules) : null;

  for (const card of visible.myHand) {
    const captures = findCaptures(card, visible.table, visible.config);

    if (captures.length === 0) {
      const raw = inversa
        ? scoreDiscardInversa(card, visible)
        : scoreDiscardStandard(card, visible);
      const { breakdown, score } = moduleSet
        ? applyModuleFilter(raw.breakdown, moduleSet, DISCARD_KEY_MODULE)
        : raw;
      results.push({
        cardId: card.id,
        captureIds: [],
        priorityKey: 'discard',
        reasonKey: 'no_capture_available',
        score,
        scoreBreakdown: breakdown,
      });
    } else {
      for (const capture of captures) {
        const raw = inversa
          ? scoreCaptureInversa(card, capture, visible)
          : scoreCaptureStandard(card, capture, visible);
        const { breakdown, score } = moduleSet
          ? applyModuleFilter(raw.breakdown, moduleSet, CAPTURE_KEY_MODULE)
          : raw;
        const isScopa = capture.length === visible.table.length;
        results.push({
          cardId: card.id,
          captureIds: capture.map(c => c.id),
          priorityKey: isScopa ? 'scopa' : 'capture',
          reasonKey: isScopa ? 'scopa_opportunity' : 'best_capture',
          score,
          scoreBreakdown: breakdown,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function evaluateCaptures(
  played: Card,
  captures: Card[][],
  visible: AIVisibleState
): number[] {
  const inversa = visible.config.inversa;
  return captures.map(c =>
    inversa
      ? scoreCaptureInversa(played, c, visible).score
      : scoreCaptureStandard(played, c, visible).score
  );
}

export function evaluateDiscard(card: Card, visible: AIVisibleState): number {
  return visible.config.inversa
    ? scoreDiscardInversa(card, visible).score
    : scoreDiscardStandard(card, visible).score;
}

export function computeLandscape(visible: AIVisibleState): PointLandscape {
  const config = visible.config;
  const myIdx = visible.myPlayerIndex;
  const allCaptured = visible.allCaptured;

  if (allCaptured.length === 0) {
    return {
      settebello: 'contested',
      ori: 'contested',
      carte: 'contested',
      primiera: 'contested',
      ...(config.settanta ? { settanta: 'contested' as const } : {}),
    };
  }

  let settebello: PointLandscape['settebello'] = 'contested';
  if (visible.settebelloHolder === myIdx) settebello = 'secured';
  else if (visible.settebelloHolder !== null) settebello = 'lost';

  let ori: PointLandscape['ori'] = 'contested';
  if (visible.coinsCounts.length > 0) {
    const myCoinCount = visible.coinsCounts[myIdx] ?? 0;
    const maxOther = Math.max(...visible.coinsCounts.filter((_, i) => i !== myIdx));
    const coinsLeft = 10 - visible.coinsCounts.reduce((a, b) => a + b, 0);
    if (myCoinCount > maxOther + coinsLeft) ori = 'secured';
    else if (maxOther > myCoinCount + coinsLeft) ori = 'lost';
  }

  let carte: PointLandscape['carte'] = 'contested';
  if (visible.capturedCounts.length > 0) {
    const myCount = visible.capturedCounts[myIdx] ?? 0;
    const maxOther = Math.max(...visible.capturedCounts.filter((_, i) => i !== myIdx));
    const cardsLeft = 40 - visible.capturedCounts.reduce((a, b) => a + b, 0);
    if (myCount > maxOther + cardsLeft) carte = 'secured';
    else if (maxOther > myCount + cardsLeft) carte = 'lost';
  }

  return {
    settebello,
    ori,
    carte,
    primiera: 'contested',
    ...(config.settanta ? { settanta: 'contested' as const } : {}),
  };
}

// ── Hard AI helpers ──────────────────────────────────────────────────────────

/** Generate all C(n, k) combinations from arr (iterative). */
function combinations<T>(arr: T[], k: number): T[][] {
  const n = arr.length;
  if (k > n || k < 0) return [];
  if (k === 0) return [[]];
  const result: T[][] = [];
  const indices = Array.from({ length: k }, (_, i) => i);
  while (true) {
    result.push(indices.map(i => arr[i]!));
    let i = k - 1;
    while (i >= 0 && indices[i]! >= n - k + i) i--;
    if (i < 0) break;
    indices[i]!++;
    for (let j = i + 1; j < k; j++) indices[j] = indices[j - 1]! + 1;
  }
  return result;
}

function estimateCombinations(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0) return 1;
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return Math.round(r);
}

function applyPlayToTable(card: Card, capture: Card[], table: Card[]): Card[] {
  if (capture.length === 0) return [...table, card];
  const capIds = new Set(capture.map(c => c.id));
  return table.filter(c => !capIds.has(c.id));
}

/** Best play for `hand` on `table`, scored from `playerIdx`'s perspective. */
function bestPlayOnTable(
  hand: Card[],
  table: Card[],
  baseVisible: AIVisibleState,
  playerIdx: number,
): { card: Card; capture: Card[]; score: number } {
  const config = baseVisible.config;
  const fakeVisible: AIVisibleState = { ...baseVisible, myHand: hand, table, myPlayerIndex: playerIdx };
  let best = { card: hand[0]!, capture: [] as Card[], score: -Infinity };

  for (const card of hand) {
    const caps = findCaptures(card, table, config);
    if (caps.length === 0) {
      const { score } = config.inversa
        ? scoreDiscardInversa(card, fakeVisible)
        : scoreDiscardStandard(card, fakeVisible);
      if (score > best.score) best = { card, capture: [], score };
    } else {
      for (const cap of caps) {
        const { score } = config.inversa
          ? scoreCaptureInversa(card, cap, fakeVisible)
          : scoreCaptureStandard(card, cap, fakeVisible);
        if (score > best.score) best = { card, capture: cap, score };
      }
    }
  }
  return best;
}

function resolvePlay(
  play: PlayEvaluation,
  hand: Card[],
  table: Card[],
  config: GameConfig,
): { cardToPlay: Card; captureIndex: number | null } {
  const cardToPlay = hand.find(c => c.id === play.cardId)!;
  if (play.captureIds.length === 0) return { cardToPlay, captureIndex: null };
  const captures = findCaptures(cardToPlay, table, config);
  const captureIndex = captures.findIndex(combo => {
    const ids = new Set(combo.map(c => c.id));
    return play.captureIds.every(id => ids.has(id)) && ids.size === play.captureIds.length;
  });
  return { cardToPlay, captureIndex: captureIndex >= 0 ? captureIndex : 0 };
}

/** Pick the primary opponent index to model: highest total score, ties broken by most captured cards. */
function primaryOpponentIndex(visible: AIVisibleState): number {
  const myIdx = visible.myPlayerIndex;
  const n = visible.playerHandCounts.length;
  let bestIdx = (myIdx + 1) % n;
  let bestScore = visible.totalScores[bestIdx] ?? 0;
  let bestCaptured = visible.capturedCounts[bestIdx] ?? 0;
  for (let i = 0; i < n; i++) {
    if (i === myIdx) continue;
    const s = visible.totalScores[i] ?? 0;
    const c = visible.capturedCounts[i] ?? 0;
    if (s > bestScore || (s === bestScore && c > bestCaptured)) {
      bestScore = s; bestCaptured = c; bestIdx = i;
    }
  }
  return bestIdx;
}

function selectHardMove(visible: AIVisibleState): { cardToPlay: Card; captureIndex: number | null } {
  const { myHand, table, unseenCards, config } = visible;
  const allPlays = evaluateAllPlays(visible);
  if (allPlays.length === 0) return { cardToPlay: myHand[0]!, captureIndex: null };

  const fallback = () => resolvePlay(allPlays[0]!, myHand, table, config);

  if (unseenCards.length === 0) return fallback();

  const myIdx = visible.myPlayerIndex;
  const playerCount = visible.playerHandCounts.length;
  const is2Player = playerCount === 2;

  const oppIdx = is2Player ? 1 - myIdx : primaryOpponentIndex(visible);
  const oppHandCount = visible.playerHandCounts[oppIdx] ?? 0;
  if (oppHandCount === 0) return fallback();

  const N = unseenCards.length;
  const combCount = estimateCombinations(N, oppHandCount);
  // For 3+ players use tighter budget since the model is only an approximation
  const budgetLimit = is2Player ? 10_000 : 3_000;
  if (combCount > budgetLimit) return fallback();

  // 2-ply followup only for 2-player games within budget
  const use2Ply = is2Player && myHand.length > 1 && combCount <= 6_000;
  const oppHands = combinations(unseenCards, oppHandCount);

  let bestScore = -Infinity;
  let bestPlay = allPlays[0]!;

  for (const aiPlay of allPlays.slice(0, 3)) {
    const aiCard = myHand.find(c => c.id === aiPlay.cardId)!;

    // Find actual capture combo
    let aiCapture: Card[] = [];
    if (aiPlay.captureIds.length > 0) {
      const caps = findCaptures(aiCard, table, config);
      const idx = caps.findIndex(c => {
        const ids = new Set(c.map(x => x.id));
        return aiPlay.captureIds.every(id => ids.has(id)) && ids.size === aiPlay.captureIds.length;
      });
      aiCapture = caps[idx] ?? [];
    }

    const tableAfterAI = applyPlayToTable(aiCard, aiCapture, table);
    const remainingHand = myHand.filter(c => c.id !== aiCard.id);

    let totalOppGain = 0;
    let totalFollowupGain = 0;

    for (const oppHand of oppHands) {
      const opp = bestPlayOnTable(oppHand, tableAfterAI, visible, oppIdx);
      totalOppGain += opp.score;

      if (use2Ply && remainingHand.length > 0) {
        const tableAfterOpp = applyPlayToTable(opp.card, opp.capture, tableAfterAI);
        const followup = bestPlayOnTable(remainingHand, tableAfterOpp, visible, myIdx);
        totalFollowupGain += followup.score;
      }
    }

    const n = oppHands.length;
    const avgOppGain = totalOppGain / n;
    const avgFollowup = use2Ply ? totalFollowupGain / n : 0;
    const totalScore = aiPlay.score - avgOppGain + (use2Ply ? avgFollowup * 0.5 : 0);

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPlay = aiPlay;
    }
  }

  return resolvePlay(bestPlay, myHand, table, config);
}

export function selectMove(
  visible: AIVisibleState
): { cardToPlay: Card; captureIndex: number | null } {
  if (visible.difficulty === 'hard') {
    return selectHardMove(visible);
  }

  const plays = evaluateAllPlays(visible);

  if (plays.length === 0) {
    return { cardToPlay: visible.myHand[0]!, captureIndex: null };
  }

  const pool = visible.difficulty === 'easy' ? plays.slice(0, Math.min(3, plays.length)) : plays.slice(0, 1);
  const bestPlay = pool[Math.floor(Math.random() * pool.length)]!;
  const cardToPlay = visible.myHand.find(c => c.id === bestPlay.cardId)!;

  if (bestPlay.captureIds.length === 0) {
    return { cardToPlay, captureIndex: null };
  }

  const captures = findCaptures(cardToPlay, visible.table, visible.config);
  const captureIndex = captures.findIndex(combo => {
    const ids = new Set(combo.map(c => c.id));
    const bestIds = new Set(bestPlay.captureIds);
    return ids.size === bestIds.size && [...ids].every(id => bestIds.has(id));
  });

  return { cardToPlay, captureIndex: captureIndex >= 0 ? captureIndex : 0 };
}
