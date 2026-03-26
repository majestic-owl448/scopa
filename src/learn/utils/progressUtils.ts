import type { NodeState, LearnNode } from '../types.ts'

/**
 * Recomputes the state of a single node from stored states and the dependency map.
 * Returns 'locked' if any prerequisite is not 'completed'; otherwise returns the stored state.
 */
export function computeNodeState(
  nodeId: string,
  nodeStates: Record<string, NodeState>,
  dependencyMap: Record<string, string[]>
): NodeState {
  const prereqs = dependencyMap[nodeId] ?? []
  const anyLocked = prereqs.some(pid => nodeStates[pid] !== 'completed')
  if (anyLocked) return 'locked'
  return nodeStates[nodeId] ?? 'locked'
}

/**
 * Returns IDs of nodes whose prerequisites are all completed but whose own state is still 'locked'.
 * Called by learnStore after each markPracticeCorrect to find newly unlockable nodes.
 */
export function getUnlockableNodes(
  nodeStates: Record<string, NodeState>,
  nodes: LearnNode[]
): string[] {
  return nodes
    .filter(node => {
      if (nodeStates[node.id] !== 'locked') return false
      return node.prerequisites.every(pid => nodeStates[pid] === 'completed')
    })
    .map(node => node.id)
}
