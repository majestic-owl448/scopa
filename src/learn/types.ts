import type { Card, GameConfig, PointLandscape } from '../engine'

export type LocalisedString = { en: string; it: string }

export type NodeState = 'locked' | 'available' | 'in_progress' | 'completed'

export type ChallengeState = 'unseen' | 'attempted' | 'solved'

export type LearnNode = {
  id: string
  name: LocalisedString
  description: LocalisedString
  guideText?: LocalisedString   // rich explanatory content shown before/instead of the interactive step
  prerequisites: string[]   // node IDs that must be completed first
  hasChallenges: boolean    // whether Part 3 is present for this node
  variantConfig?: Partial<GameConfig>  // rules context for this node's RulesGuide filter
}

export type TrainerProblem = {
  id: string
  nodeId: string              // e.g. 'S2', 'V1-R', 'F-7'
  type: 'practice' | 'challenge'
  goal?: LocalisedString      // practice only — explicit objective; undefined for challenges
  requiredNodes: string[]     // nodes the player is expected to have completed

  config: GameConfig
  playerIndex: number         // which player the human plays as in this problem

  title: LocalisedString
  description: LocalisedString
  hand: Card[]
  table: Card[]

  // Optional — progressively richer in advanced problems
  capturedPiles?: Card[][]        // per player index; length = config.playerCount
  scopeMarkerCards?: Card[][]     // per player index
  remainingDeckCount?: number
  runningScores?: number[]        // per player index
  pointLandscape?: PointLandscape // pre-computed; settanta field present only when config.settanta

  correctPlay: {
    cardId: string
    captureIds: string[]    // empty = discard
  }
  explanation: LocalisedString
  helpHints: LocalisedString[]   // challenges only; names relevant rules without giving answer
  rankedPlays: {
    cardId: string
    captureIds: string[]
    priority: LocalisedString    // e.g. { en: 'Settebello capture', it: 'Presa del settebello' }
    reason: LocalisedString
  }[]
}
