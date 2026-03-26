export type Suit = 'coins' | 'cups' | 'swords' | 'clubs';

export type Card = {
  id: string;       // e.g. 'coins-7'
  suit: Suit;
  rank: number;     // 1–10
};

export type Player = {
  id: string;
  name: string;
  isHuman: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  modules?: string[];
  hand: Card[];
  captured: Card[];
  scopeMarkerCards: Card[];
};

export type GamePhase =
  | 'setup'
  | 'playing'
  | 'capture-select'
  | 'hand-end'
  | 'game-over';

export type Turn = {
  playerIndex: number;
  cardPlayed: Card;
  cardsCaptured: Card[];
  isScopa: boolean;
};

export type PrimieraDetails = {
  bestPerSuit: (Card | null)[];
  suitValues: (number | null)[];
  total: number | null;
  milanoCounts?: { sevens: number; sixes: number; aces: number };
};

export type RoundScore = {
  playerIndex: number;
  scope: number;
  carte: boolean;
  ori: boolean;
  settebello: boolean;
  primiera: boolean;
  primieraDetails: PrimieraDetails;
  reBello: boolean;
  rosmarino: boolean;
  settanta: boolean;
  napola: number;
  total: number;
};

export type GameConfig = {
  playerCount: 2 | 3 | 4;
  cardsPerHand: 3 | 6 | 9 | 18;
  rosmarino: boolean;
  reBello: boolean;
  settanta: boolean;
  primieraValues: 'standard' | 'veneto' | 'milano';
  captureTarget: 'rank' | 'quindici' | 'undici';
  inversa: boolean;
  scopaDAssi: boolean;
  aceScoresScopa: boolean;
  napola: boolean;
};

export type ConfigValidationError = string;

export type GameState = {
  config: GameConfig;
  phase: GamePhase;
  players: Player[];
  deck: Card[];
  table: Card[];
  currentPlayerIndex: number;
  dealerIndex: number;
  lastCapturePlayerIndex: number | null;
  handNumber: number;
  totalScores: number[];
  handScores: number[][];
  history: Turn[];
  pendingCaptures: Card[][];
  pendingCard: Card | null;
  lastRoundScores: RoundScore[] | null;
};

export type PointLandscape = {
  settebello: 'secured' | 'lost' | 'contested' | 'irrelevant';
  ori: 'secured' | 'lost' | 'contested' | 'irrelevant';
  carte: 'secured' | 'lost' | 'contested' | 'irrelevant';
  primiera: 'secured' | 'lost' | 'contested' | 'irrelevant';
  settanta?: 'secured' | 'lost' | 'contested' | 'irrelevant';
};

export type AIVisibleState = {
  myHand: Card[];
  table: Card[];
  scopeCards: Card[][];
  scopeCounts: number[];
  settebelloHolder: number | null;
  reBelloHolder: number | null;
  totalScores: number[];
  handNumber: number;
  capturedCounts: number[];
  coinsCounts: number[];
  allCaptured: Card[][];
  seenCards: Card[];
  unseenCards: Card[];
  myPlayerIndex: number;
  playerHandCounts: number[];
  difficulty?: 'easy' | 'medium' | 'hard';
  config: GameConfig;
};

export type PublicPlayer = {
  id: string;
  name: string;
  isHuman: boolean;
  handCount: number;
  captured: Card[];          // public info — all players can see captured piles
  scopeMarkerCards: Card[];
};

export type PublicGameState = {
  config: GameConfig;
  phase: GamePhase;
  players: PublicPlayer[];
  myHand: Card[];            // own hand only; other hands are redacted to handCount
  deckCount: number;         // deck length only; card identities are hidden
  table: Card[];
  currentPlayerIndex: number;
  dealerIndex: number;
  lastCapturePlayerIndex: number | null;
  handNumber: number;
  totalScores: number[];
  handScores: number[][];
  pendingCaptures: Card[][];
  pendingCard: Card | null;
  lastRoundScores: RoundScore[] | null;
};

export type ClientMessage =
  | { type: 'PLAY_CARD'; cardId: string }
  | { type: 'SELECT_CAPTURE'; combinationIndex: number }
  | { type: 'READY' }                           // sent on joining a room before game starts
  | { type: 'READY_FOR_NEXT_HAND' }
  | { type: 'RECONNECT'; gameId: string; sessionToken: string };

export type ServerMessage =
  | { type: 'STATE_UPDATE'; state: PublicGameState }
  | { type: 'PLAYER_JOINED'; playerIndex: number; name: string }
  | { type: 'GAME_STARTED' }
  | { type: 'ERROR'; message: string }
  | { type: 'WAITING_FOR_PLAYERS'; readyCount: number; totalCount: number }
  | { type: 'PLAYER_DISCONNECTED'; playerIndex: number }
  | { type: 'PLAYER_RECONNECTED'; playerIndex: number }
  | { type: 'GAME_SUSPENDED'; expiresAt: number }  // unix ms
  | { type: 'SESSION_TOKEN'; token: string; playerIndex: number };
