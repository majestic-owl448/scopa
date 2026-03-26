import { useNavigate } from 'react-router-dom'
import { useLearnStore } from '../store/learnStore.ts'
import { LEARN_NODES } from '../data/nodes.ts'
import LearnMap from '../components/LearnMap.tsx'

export default function LearnHome() {
  const navigate = useNavigate()
  const store = useLearnStore()

  const nodeStates = Object.fromEntries(
    LEARN_NODES.map(n => [n.id, store.getNodeState(n.id)])
  )

  const foundationComplete = ['F-1','F-2','F-3','F-4','F-5','F-6','F-7','F-8','F-9','F-10']
    .every(id => nodeStates[id] === 'completed')

  const completedCount = LEARN_NODES.filter(n => nodeStates[n.id] === 'completed').length
  const totalCount = LEARN_NODES.length

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Learn Scopa</h1>
          <p className="text-xs text-fcc-green">{completedCount} / {totalCount} nodes complete</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-fcc-green hover:text-white text-sm"
        >
          Home
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-fcc-tertiary-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-fcc-green rounded-full transition-all"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Action buttons (unlocked after Foundation) */}
      {foundationComplete && (
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/learn/challenges')}
            className="flex-1 py-2 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow text-sm"
          >
            Challenges Hub
          </button>
          <button
            onClick={() => navigate('/play/setup')}
            className="flex-1 py-2 border border-fcc-quaternary-bg text-fcc-green hover:bg-fcc-secondary-bg/40 rounded-lg text-sm"
          >
            Practice game
          </button>
        </div>
      )}

      {/* Learn map */}
      <LearnMap
        nodeStates={nodeStates}
        nodes={LEARN_NODES}
        onNodeSelect={id => navigate(`/learn/${id}`)}
      />
    </div>
  )
}
