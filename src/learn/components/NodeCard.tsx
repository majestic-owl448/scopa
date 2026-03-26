import type { LearnNode, NodeState } from '../types.ts'
import { useCardLabel } from '../../utils/cardLabel.ts'

type Props = {
  node: LearnNode
  state: NodeState
  onClick: () => void
}

const STATE_CLASSES: Record<NodeState, string> = {
  completed: 'bg-green-800 border-green-500 text-white',
  available: 'bg-gray-800 border-yellow-500 text-white cursor-pointer hover:bg-gray-700',
  in_progress: 'bg-blue-900 border-blue-500 text-white cursor-pointer hover:bg-blue-800',
  locked: 'bg-gray-900 border-gray-700 text-gray-600 cursor-default',
}

export default function NodeCard({ node, state, onClick }: Props) {
  const { resolveCardTokens } = useCardLabel()
  const isLocked = state === 'locked'

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`rounded-lg border p-3 text-left w-full transition-colors ${STATE_CLASSES[state]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono text-green-400 shrink-0">{node.id}</span>
        {state === 'completed' && <span className="text-green-400 text-xs">✓</span>}
        {state === 'in_progress' && <span className="text-blue-300 text-xs">…</span>}
        {state === 'locked' && <span className="text-gray-600 text-xs">🔒</span>}
      </div>
      {isLocked ? (
        <div className="mt-1 h-3 bg-gray-700 rounded w-3/4" />
      ) : (
        <div className="mt-1 text-sm font-semibold">{node.name.en}</div>
      )}
      {!isLocked && (
        <div className="mt-0.5 text-xs opacity-70 line-clamp-2">{resolveCardTokens(node.description.en)}</div>
      )}
    </button>
  )
}
