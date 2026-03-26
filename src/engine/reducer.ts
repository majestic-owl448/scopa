import type { GameState, GameConfig, Player, Card, RoundScore } from './types.ts';
import { validateGameConfig, targetScore } from './config.ts';
import { dealClean, redeal } from './dealing.ts';
import { findCaptures, isScopaCapture } from './captures.ts';
import { scoreHand } from './scoring.ts';

export type GameAction =
  | { type: 'PLAY_CARD'; playerIndex: number; cardId: string }
  | { type: 'SELECT_CAPTURE'; combinationIndex: number }
  | { type: 'ADVANCE' };

function removeCardFromHand(hand: Card[], cardId: string): { card: Card | null; newHand: Card[] } {
  const idx = hand.findIndex(c => c.id === cardId);
  if (idx === -1) return { card: null, newHand: hand };
  const card = hand[idx]!;
  return { card, newHand: [...hand.slice(0, idx), ...hand.slice(idx + 1)] };
}

function removeCardsFromTable(table: Card[], captureIds: Set<string>): Card[] {
  return table.filter(c => !captureIds.has(c.id));
}

/** Resolve end-of-hand: give remaining table to last capturer, score, return updated state fields. */
function resolveHandEnd(
  players: Player[],
  table: Card[],
  lastCapturePlayerIndex: number | null,
  config: GameConfig,
  totalScores: number[]
): { finalPlayers: Player[]; roundScores: RoundScore[]; newTotalScores: number[]; handPoints: number[] } {
  let finalPlayers = players;
  if (lastCapturePlayerIndex !== null && table.length > 0) {
    finalPlayers = players.map((p, i) =>
      i === lastCapturePlayerIndex
        ? { ...p, captured: [...p.captured, ...table] }
        : p
    );
  }
  const roundScores = scoreHand(finalPlayers, config);
  const newTotalScores = totalScores.map((s, i) => s + (roundScores[i]?.total ?? 0));
  const handPoints = roundScores.map(rs => rs.total);
  return { finalPlayers, roundScores, newTotalScores, handPoints };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY_CARD': {
      if (state.phase !== 'playing') return state;
      if (action.playerIndex !== state.currentPlayerIndex) return state;

      const player = state.players[action.playerIndex]!;
      const { card: playedCard, newHand } = removeCardFromHand(player.hand, action.cardId);
      if (!playedCard) return state;

      const captures = findCaptures(playedCard, state.table, state.config);

      if (captures.length === 0) {
        // Discard
        const updatedPlayer: Player = { ...player, hand: newHand };
        const newTable = [...state.table, playedCard];
        const newPlayers = state.players.map((p, i) =>
          i === action.playerIndex ? updatedPlayer : p
        );
        const turn = { playerIndex: action.playerIndex, cardPlayed: playedCard, cardsCaptured: [], isScopa: false };
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        const allHandsEmpty = newPlayers.every(p => p.hand.length === 0);

        if (allHandsEmpty && state.deck.length === 0) {
          // BUG FIX: must score the hand here too
          const { finalPlayers, roundScores, newTotalScores, handPoints } = resolveHandEnd(
            newPlayers, newTable, state.lastCapturePlayerIndex, state.config, state.totalScores
          );
          return {
            ...state,
            players: finalPlayers,
            table: [],
            history: [...state.history, turn],
            phase: 'hand-end',
            currentPlayerIndex: nextPlayerIndex,
            totalScores: newTotalScores,
            handScores: [...state.handScores, handPoints],
            lastRoundScores: roundScores,
            pendingCaptures: [],
            pendingCard: null,
          };
        }

        if (allHandsEmpty && state.deck.length > 0) {
          const { hands, remaining } = redeal(state.deck, state.players.length, state.config.cardsPerHand);
          const redealtPlayers = newPlayers.map((p, i) => ({ ...p, hand: hands[i] ?? [] }));
          return {
            ...state,
            players: redealtPlayers,
            deck: remaining,
            table: newTable,
            history: [...state.history, turn],
            currentPlayerIndex: nextPlayerIndex,
          };
        }

        return {
          ...state,
          players: newPlayers,
          table: newTable,
          history: [...state.history, turn],
          currentPlayerIndex: nextPlayerIndex,
        };
      }

      if (captures.length === 1) {
        return executeCapture(state, action.playerIndex, playedCard, captures[0]!, newHand);
      }

      // Multiple options — capture-select phase
      return {
        ...state,
        phase: 'capture-select',
        pendingCard: playedCard,
        pendingCaptures: captures,
        players: state.players.map((p, i) =>
          i === action.playerIndex ? { ...p, hand: newHand } : p
        ),
      };
    }

    case 'SELECT_CAPTURE': {
      if (state.phase !== 'capture-select') return state;
      if (!state.pendingCard) return state;
      const capture = state.pendingCaptures[action.combinationIndex];
      if (!capture) return state;
      const player = state.players[state.currentPlayerIndex]!;
      return executeCapture(state, state.currentPlayerIndex, state.pendingCard, capture, player.hand);
    }

    case 'ADVANCE': {
      if (state.phase !== 'hand-end') return state;

      const target = targetScore(state.config.playerCount as 2 | 3 | 4);
      const scores = state.totalScores;
      const maxScore = Math.max(...scores);
      if (maxScore >= target && scores.filter(s => s === maxScore).length === 1) {
        return { ...state, phase: 'game-over' };
      }

      const { hands, table, remaining } = dealClean(state.config.playerCount, state.config.cardsPerHand);
      const nextDealer = (state.dealerIndex + 1) % state.players.length;
      const firstPlayer = (nextDealer + 1) % state.players.length;

      return {
        ...state,
        phase: 'playing',
        players: state.players.map((p, i) => ({
          ...p,
          hand: hands[i] ?? [],
          captured: [],
          scopeMarkerCards: [],
        })),
        deck: remaining,
        table,
        history: [],
        handNumber: state.handNumber + 1,
        dealerIndex: nextDealer,
        lastCapturePlayerIndex: null,
        pendingCaptures: [],
        pendingCard: null,
        currentPlayerIndex: firstPlayer,
      };
    }

    default:
      return state;
  }
}

function executeCapture(
  state: GameState,
  playerIndex: number,
  playedCard: Card,
  capture: Card[],
  newHand: Card[]
): GameState {
  const player = state.players[playerIndex]!;
  const captureIds = new Set(capture.map(c => c.id));
  const newTable = removeCardsFromTable(state.table, captureIds);

  const allHandsEmptyAfter = [...state.players.slice(0, playerIndex), { hand: newHand }, ...state.players.slice(playerIndex + 1)].every(p => p.hand.length === 0);
  const isLastCaptureOfHand = allHandsEmptyAfter && state.deck.length === 0;

  // Scopa d'Assi with aceScoresScopa:false → ace sweep does not award a scopa point
  const aceNoScopa = state.config.scopaDAssi && playedCard.rank === 1 && !state.config.aceScoresScopa;
  // Scopa is NOT awarded on the last capture of the hand, nor on an ace sweep when aceScoresScopa is off
  const isScopa = !isLastCaptureOfHand && !aceNoScopa && isScopaCapture(capture, state.table);

  const capturedCards = [...player.captured, ...capture, playedCard];
  const scopeMarkerCards = isScopa
    ? [...player.scopeMarkerCards, playedCard]
    : player.scopeMarkerCards;

  const updatedPlayer: Player = { ...player, hand: newHand, captured: capturedCards, scopeMarkerCards };
  const newPlayers = state.players.map((p, i) => i === playerIndex ? updatedPlayer : p);
  const turn = { playerIndex, cardPlayed: playedCard, cardsCaptured: capture, isScopa };
  const nextPlayerIndex = (playerIndex + 1) % state.players.length;
  const allHandsEmpty = newPlayers.every(p => p.hand.length === 0);

  if (allHandsEmpty && state.deck.length === 0) {
    const { finalPlayers, roundScores, newTotalScores, handPoints } = resolveHandEnd(
      newPlayers, newTable, playerIndex, state.config, state.totalScores
    );
    return {
      ...state,
      phase: 'hand-end',
      players: finalPlayers,
      table: [],
      history: [...state.history, turn],
      lastCapturePlayerIndex: playerIndex,
      currentPlayerIndex: nextPlayerIndex,
      totalScores: newTotalScores,
      handScores: [...state.handScores, handPoints],
      lastRoundScores: roundScores,
      pendingCaptures: [],
      pendingCard: null,
    };
  }

  if (allHandsEmpty && state.deck.length > 0) {
    const { hands, remaining } = redeal(state.deck, state.players.length, state.config.cardsPerHand);
    const redealtPlayers = newPlayers.map((p, i) => ({ ...p, hand: hands[i] ?? [] }));
    return {
      ...state,
      phase: 'playing',
      players: redealtPlayers,
      deck: remaining,
      table: newTable,
      history: [...state.history, turn],
      lastCapturePlayerIndex: playerIndex,
      currentPlayerIndex: nextPlayerIndex,
      pendingCaptures: [],
      pendingCard: null,
    };
  }

  return {
    ...state,
    phase: 'playing',
    players: newPlayers,
    table: newTable,
    history: [...state.history, turn],
    lastCapturePlayerIndex: playerIndex,
    currentPlayerIndex: nextPlayerIndex,
    pendingCaptures: [],
    pendingCard: null,
  };
}

export function createInitialState(
  config: GameConfig,
  players: Omit<Player, 'hand' | 'captured' | 'scopeMarkerCards'>[]
): GameState {
  const errors = validateGameConfig(config);
  if (errors.length > 0) throw new Error(errors.join('; '));

  for (const p of players) {
    if (!p.isHuman && p.difficulty !== undefined && p.modules !== undefined) {
      throw new Error(`Player ${p.id} cannot have both difficulty and modules set`);
    }
  }

  const { hands, table, remaining } = dealClean(config.playerCount, config.cardsPerHand);
  const dealerIndex = Math.floor(Math.random() * config.playerCount);
  const firstPlayer = (dealerIndex + 1) % config.playerCount;

  return {
    config,
    phase: 'playing',
    players: players.map((p, i) => ({
      ...p,
      hand: hands[i] ?? [],
      captured: [],
      scopeMarkerCards: [],
    })),
    deck: remaining,
    table,
    currentPlayerIndex: firstPlayer,
    dealerIndex,
    lastCapturePlayerIndex: null,
    handNumber: 1,
    totalScores: players.map(() => 0),
    handScores: [],
    history: [],
    pendingCaptures: [],
    pendingCard: null,
    lastRoundScores: null,
  };
}

export type { GameConfig } from './types.ts';
