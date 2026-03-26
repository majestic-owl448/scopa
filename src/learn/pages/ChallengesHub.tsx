import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { GameConfig } from '../../engine'
import { useLearnStore } from '../store/learnStore.ts'
import { LEARN_NODES } from '../data/nodes.ts'
import { getProblemsByNode, AUTHORED_PROBLEMS } from '../data/problems/index.ts'
import { generateChallenge } from '../utils/proceduralGen.ts'
import ChallengePlayer from '../components/ChallengePlayer.tsx'
import type { TrainerProblem } from '../types.ts'

const BASE_CONFIG: GameConfig = {
  playerCount: 2,
  cardsPerHand: 3,
  rosmarino: false,
  reBello: false,
  settanta: false,
  primieraValues: 'standard',
  captureTarget: 'rank',
  inversa: false,
  scopaDAssi: false,
  aceScoresScopa: false,
  napola: false,
}

export default function ChallengesHub() {
  const navigate = useNavigate()
  const store = useLearnStore()
  const [activeProblem, setActiveProblem] = useState<TrainerProblem | null>(null)

  // Collect all completed nodes
  const completedNodes = LEARN_NODES.filter(n => store.getNodeState(n.id) === 'completed')

  // All challenges from completed nodes
  const availableChallenges: TrainerProblem[] = completedNodes
    .flatMap(n => getProblemsByNode(n.id).filter(p => p.type === 'challenge'))

  // Cross-branch authored challenges (where all requiredNodes are completed)
  const crossBranchChallenges = AUTHORED_PROBLEMS.filter(
    p => p.type === 'challenge' && p.requiredNodes.every(id => store.getNodeState(id) === 'completed')
  ).filter(p => !availableChallenges.find(c => c.id === p.id))

  const allChallenges = [...availableChallenges, ...crossBranchChallenges]

  function handlePickRandom() {
    if (allChallenges.length === 0) {
      // Try procedural generation for the highest completed strategy node
      const tier = store.getAvailableStrategyTiers()
      if (tier > 0) {
        const nodeId = `S${tier}`
        const gen = generateChallenge(nodeId, BASE_CONFIG)
        if (gen) { setActiveProblem(gen); return }
      }
      return
    }
    const idx = Math.floor(Math.random() * allChallenges.length)
    setActiveProblem(allChallenges[idx]!)
  }

  function handleComplete(solved: boolean) {
    if (activeProblem) {
      if (solved) store.markChallengeSolved(activeProblem.id)
      else store.markChallengeAttempted(activeProblem.id)
    }
    setActiveProblem(null)
  }

  if (activeProblem) {
    return (
      <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-4 gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveProblem(null)} className="text-fcc-green hover:text-white text-sm">
            ←
          </button>
          <h1 className="text-lg font-bold">Challenges Hub</h1>
        </div>
        <ChallengePlayer problem={activeProblem} onComplete={handleComplete} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/learn')} className="text-fcc-green hover:text-white text-sm">
          ←
        </button>
        <h1 className="text-lg font-bold">Challenges Hub</h1>
      </div>

      <p className="text-sm text-fcc-green">
        Cross-branch challenges drawing on everything you've learned.
        Challenges from all completed nodes are available here.
      </p>

      {completedNodes.length === 0 ? (
        <div className="text-center py-8 text-fcc-muted">
          <p>Complete some nodes first to unlock challenges.</p>
          <button
            onClick={() => navigate('/learn')}
            className="mt-4 text-fcc-green hover:text-white underline text-sm"
          >
            Go to Learn map
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Random challenge button */}
          <button
            onClick={handlePickRandom}
            className="w-full py-3 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow"
          >
            Random challenge
          </button>

          {/* Challenge list */}
          {allChallenges.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="text-xs text-fcc-green uppercase tracking-wide font-semibold">
                Available challenges ({allChallenges.length})
              </div>
              {allChallenges.map(problem => {
                const challengeState = store.challengeStates[problem.id] ?? 'unseen'
                return (
                  <button
                    key={problem.id}
                    onClick={() => setActiveProblem(problem)}
                    className="text-left bg-fcc-tertiary-bg hover:bg-fcc-quaternary-bg border border-fcc-quaternary-bg rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-fcc-green mr-2">{problem.nodeId}</span>
                        <span className="text-sm font-semibold text-white">{problem.title.en}</span>
                      </div>
                      <span className={`text-xs ${
                        challengeState === 'solved' ? 'text-fcc-green' :
                        challengeState === 'attempted' ? 'text-fcc-yellow' :
                        'text-fcc-muted'
                      }`}>
                        {challengeState === 'solved' ? '✓' : challengeState === 'attempted' ? '…' : '●'}
                      </span>
                    </div>
                    <p className="text-xs text-fcc-green mt-0.5 line-clamp-1">{problem.description.en}</p>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-fcc-muted">No authored challenges available yet. Random generation is active.</p>
          )}
        </div>
      )}
    </div>
  )
}
