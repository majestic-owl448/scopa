export type {
  Suit,
  Card,
  Player,
  GamePhase,
  Turn,
  PrimieraDetails,
  RoundScore,
  GameConfig,
  ConfigValidationError,
  GameState,
  PointLandscape,
  AIVisibleState,
  PublicPlayer,
  PublicGameState,
  ClientMessage,
  ServerMessage,
} from './types.ts';

export { validateGameConfig, targetScore } from './config.ts';
export { createDeck, shuffle, SUITS } from './deck.ts';
export { findCaptures, mustCapture, isScopaCapture } from './captures.ts';
export {
  scoreHand,
  PRIMIERA_VALUES_STANDARD,
  PRIMIERA_VALUES_VENETO,
} from './scoring.ts';
export {
  selectMove,
  buildAIVisibleState,
  evaluateCaptures,
  evaluateDiscard,
  evaluateAllPlays,
  computeLandscape,
} from './ai.ts';
export { gameReducer, createInitialState } from './reducer.ts';
export type { GameAction } from './reducer.ts';
