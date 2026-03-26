import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, GameConfig, Card } from '../engine'
import {
  createInitialState,
  gameReducer,
  buildAIVisibleState,
  selectMove,
  evaluateAllPlays,
  findCaptures,
} from '../engine'

// Set VITE_AI_DEBUG=true in .env.local to enable the AI debug panel
export const AI_DEBUG = import.meta.env.VITE_AI_DEBUG === 'true'

export type AIDebugEntry = {
  playerIndex: number
  playerName: string
  turn: number
  plays: {
    cardId: string
    captureIds: string[]
    priorityKey: string
    reasonKey: string
    score: number
    scoreBreakdown: Record<string, number>
  }[]
  chosen: { cardId: string; captureIds: string[] }
}

export type LastAIPlay = {
  playerName: string
  card: Card
  captures: Card[]
}

interface GameStore {
  gameState: GameState | null
  mode: 'idle' | 'singleplayer'
  aiDebugLog: AIDebugEntry[]
  lastAIPlay: LastAIPlay | null
  startGame: (config: GameConfig, playerNames: string[], humanCount: number, difficulty: 'easy' | 'medium' | 'hard') => void
  playCard: (cardId: string) => void
  selectCapture: (combinationIndex: number) => void
  advance: () => void
  reset: () => void
  resumeAI: () => void
}

function scheduleAI(get: () => GameStore, set: (fn: (s: GameStore) => GameStore) => void) {
  const state = get().gameState
  if (!state) return
  if (state.phase !== 'playing') return

  const player = state.players[state.currentPlayerIndex]
  if (!player || player.isHuman) return

  const delay = AI_DEBUG ? 1200 + Math.random() * 400 : 800 + Math.random() * 400

  setTimeout(() => {
    const current = get().gameState
    if (!current) return
    if (current.phase !== 'playing') return
    const cp = current.players[current.currentPlayerIndex]
    if (!cp || cp.isHuman) return

    const visible = buildAIVisibleState(current, current.currentPlayerIndex)
    const allPlays = evaluateAllPlays(visible)
    const { cardToPlay, captureIndex } = selectMove(visible)

    if (AI_DEBUG) {
      const entry: AIDebugEntry = {
        playerIndex: current.currentPlayerIndex,
        playerName: cp.name,
        turn: current.history.length + 1,
        plays: allPlays,
        chosen: {
          cardId: cardToPlay.id,
          captureIds: captureIndex !== null
            ? (allPlays.find(p => p.cardId === cardToPlay.id)?.captureIds ?? [])
            : [],
        },
      }
      console.group(`[AI Debug] ${cp.name} — Turn ${entry.turn}`)
      console.log('All evaluated plays (sorted by score):')
      console.table(allPlays.map(p => ({
        card: p.cardId,
        captures: p.captureIds.join(', ') || '—',
        priority: p.priorityKey,
        reason: p.reasonKey,
        score: p.score.toFixed(2),
      })))
      console.log('▶ Chosen:', cardToPlay.id, captureIndex !== null ? `(capture idx ${captureIndex})` : '(discard)')
      console.groupEnd()

      set(s => ({ ...s, aiDebugLog: [...s.aiDebugLog.slice(-19), entry] }))
    }

    // Determine what cards will be captured for the lastAIPlay record
    const captures = captureIndex !== null
      ? (findCaptures(cardToPlay, current.table, current.config)[captureIndex] ?? [])
      : []
    const lastAIPlay: LastAIPlay = { playerName: cp.name, card: cardToPlay, captures }

    set(s => {
      if (!s.gameState) return s
      let newState = gameReducer(s.gameState, {
        type: 'PLAY_CARD',
        playerIndex: current.currentPlayerIndex,
        cardId: cardToPlay.id,
      })

      if (newState.phase === 'capture-select' && captureIndex !== null) {
        newState = gameReducer(newState, {
          type: 'SELECT_CAPTURE',
          combinationIndex: captureIndex,
        })
      }

      // Only surface the play when the next turn is human (so multi-AI games skip intermediate)
      const nextPlayer = newState.players[newState.currentPlayerIndex]
      const showPlay = newState.phase === 'playing' && nextPlayer?.isHuman
      return { ...s, gameState: newState, lastAIPlay: showPlay ? lastAIPlay : s.lastAIPlay }
    })

    setTimeout(() => scheduleAI(get, set), 50)
  }, delay)
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      mode: 'idle',
      aiDebugLog: [],
      lastAIPlay: null,

      startGame(config, playerNames, humanCount, difficulty) {
        const players = playerNames.map((name, i) => ({
          id: `player-${i}`,
          name,
          isHuman: i < humanCount,
          ...(i >= humanCount ? { difficulty } : {}),
        }))

        const state = createInitialState(config, players)
        set({ gameState: state, mode: 'singleplayer', aiDebugLog: [], lastAIPlay: null })
        setTimeout(() => scheduleAI(get, set), 100)
      },

      playCard(cardId) {
        set(s => {
          if (!s.gameState) return s
          const playerIndex = s.gameState.currentPlayerIndex
          const newState = gameReducer(s.gameState, { type: 'PLAY_CARD', playerIndex, cardId })
          return { ...s, gameState: newState, lastAIPlay: null }
        })
        setTimeout(() => scheduleAI(get, set), 50)
      },

      selectCapture(combinationIndex) {
        set(s => {
          if (!s.gameState) return s
          const newState = gameReducer(s.gameState, { type: 'SELECT_CAPTURE', combinationIndex })
          return { ...s, gameState: newState }
        })
        setTimeout(() => scheduleAI(get, set), 50)
      },

      advance() {
        set(s => {
          if (!s.gameState) return s
          const newState = gameReducer(s.gameState, { type: 'ADVANCE' })
          return { ...s, gameState: newState }
        })
        setTimeout(() => scheduleAI(get, set), 100)
      },

      reset() {
        set({ gameState: null, mode: 'idle', aiDebugLog: [], lastAIPlay: null })
      },

      resumeAI() {
        scheduleAI(get, set)
      },
    }),
    {
      name: 'scopa_game',
      partialize: (s) => ({ gameState: s.gameState, mode: s.mode }),
    }
  )
)
