import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NodeState, ChallengeState } from '../types.ts'
import { LEARN_NODES, DEPENDENCY_MAP } from '../data/nodes.ts'
import { computeNodeState, getUnlockableNodes } from '../utils/progressUtils.ts'

type LearnState = {
  nodeStates: Record<string, NodeState>
  challengeStates: Record<string, ChallengeState>
  guidedStepDone: Record<string, boolean>
  practiceAnswered: Record<string, boolean[]>
}

// Build the initial nodeStates: F-1 is the only node available at start
function buildInitialNodeStates(): Record<string, NodeState> {
  const states: Record<string, NodeState> = {}
  for (const node of LEARN_NODES) {
    states[node.id] = node.prerequisites.length === 0 ? 'available' : 'locked'
  }
  return states
}

// Count practice questions per node from LEARN_NODES — we use authored problem count
// but the store just tracks a boolean array; length grows as questions are answered
function ensurePracticeArray(
  practiceAnswered: Record<string, boolean[]>,
  nodeId: string,
  index: number
): boolean[] {
  const existing = practiceAnswered[nodeId] ?? []
  if (existing.length > index) return existing
  const extended = [...existing]
  while (extended.length <= index) extended.push(false)
  return extended
}

export const useLearnStore = create<LearnState & {
  markGuidedStepDone(nodeId: string): void
  markPracticeCorrect(nodeId: string, questionIndex: number, totalQuestions: number): void
  markChallengeAttempted(challengeId: string): void
  markChallengeSolved(challengeId: string): void
  getNodeState(nodeId: string): NodeState
  getUnlockedVariants(): Partial<import('../../engine').GameConfig>[]
  getAvailableStrategyTiers(): number
  isHintUnlocked(): boolean
  isManualDealingUnlocked(): boolean
}>()(
  persist(
    (set, get) => ({
      nodeStates: buildInitialNodeStates(),
      challengeStates: {},
      guidedStepDone: {},
      practiceAnswered: {},

      markGuidedStepDone(nodeId) {
        set(state => {
          const current = state.nodeStates[nodeId] ?? 'locked'
          return {
            guidedStepDone: { ...state.guidedStepDone, [nodeId]: true },
            nodeStates: {
              ...state.nodeStates,
              [nodeId]: current === 'available' ? 'in_progress' : current,
            },
          }
        })
      },

      markPracticeCorrect(nodeId, questionIndex, totalQuestions) {
        set(state => {
          const updated = ensurePracticeArray(state.practiceAnswered, nodeId, Math.max(questionIndex, 0))
          if (questionIndex >= 0) updated[questionIndex] = true
          const allDone = totalQuestions === 0 || updated.slice(0, totalQuestions).every(Boolean)
          const newNodeStates = { ...state.nodeStates }
          if (allDone) {
            newNodeStates[nodeId] = 'completed'
            // Unlock dependents
            const unlockable = getUnlockableNodes(newNodeStates, LEARN_NODES)
            for (const id of unlockable) {
              newNodeStates[id] = 'available'
            }
          }
          return {
            practiceAnswered: { ...state.practiceAnswered, [nodeId]: updated },
            nodeStates: newNodeStates,
          }
        })
      },

      markChallengeAttempted(challengeId) {
        set(state => {
          if (state.challengeStates[challengeId] === 'solved') return {}
          return { challengeStates: { ...state.challengeStates, [challengeId]: 'attempted' } }
        })
      },

      markChallengeSolved(challengeId) {
        set(state => ({
          challengeStates: { ...state.challengeStates, [challengeId]: 'solved' },
        }))
      },

      getNodeState(nodeId) {
        return computeNodeState(nodeId, get().nodeStates, DEPENDENCY_MAP)
      },

      getUnlockedVariants() {
        const { nodeStates } = get()
        return LEARN_NODES
          .filter(node =>
            node.id.match(/^V\d+-R$/) &&
            nodeStates[node.id] === 'completed' &&
            node.variantConfig != null
          )
          .map(node => node.variantConfig!)
      },

      getAvailableStrategyTiers() {
        const { nodeStates } = get()
        let highest = 0
        for (let i = 1; i <= 12; i++) {
          if (nodeStates[`S${i}`] === 'completed') highest = i
          else break
        }
        return highest
      },

      isHintUnlocked() {
        const { nodeStates } = get()
        return nodeStates['F-2'] === 'completed' && nodeStates['F-3'] === 'completed'
      },

      isManualDealingUnlocked() {
        const { nodeStates } = get()
        return nodeStates['F-9'] === 'completed' && nodeStates['F-10'] === 'completed'
      },
    }),
    { name: 'scopa_learn' }
  )
)
