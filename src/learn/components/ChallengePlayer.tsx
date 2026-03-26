import { useState } from 'react'
import type { Card } from '../../engine'
import { findCaptures } from '../../engine'
import type { TrainerProblem } from '../types.ts'
import TrainerBoard from './TrainerBoard.tsx'
import ExplanationPanel from './ExplanationPanel.tsx'
import { useCardLabel } from '../../utils/cardLabel.ts'
import PointLandscapePanel from './PointLandscapePanel.tsx'

type Props = {
  problem: TrainerProblem
  onComplete: (solved: boolean) => void
}

export default function ChallengePlayer({ problem, onComplete }: Props) {
  const { resolveCardTokens } = useCardLabel()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedCapture, setSelectedCapture] = useState<Card[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [play, setPlay] = useState<{ cardId: string; captureIds: string[] } | null>(null)

  function handleCardSelect(cardId: string) {
    if (submitted) return
    setSelectedCardId(prev => prev === cardId ? null : cardId)
    setSelectedCapture([])
  }

  function handleTableCardClick(card: Card) {
    if (submitted || !selectedCardId) return
    const alreadySelected = selectedCapture.some(c => c.id === card.id)
    if (alreadySelected) {
      setSelectedCapture(prev => prev.filter(c => c.id !== card.id))
    } else {
      setSelectedCapture(prev => [...prev, card])
    }
  }

  function handleSubmit() {
    if (!selectedCardId || submitted) return
    const captureIds = selectedCapture.map(c => c.id)
    setPlay({ cardId: selectedCardId, captureIds })
    setSubmitted(true)
  }

  const selectedCard = problem.hand.find(c => c.id === selectedCardId) ?? null
  const validCaptures = selectedCard ? findCaptures(selectedCard, problem.table, problem.config) : []
  const hasCapture = validCaptures.length > 0

  const isSolved = play != null &&
    play.cardId === problem.correctPlay.cardId &&
    play.captureIds.length === problem.correctPlay.captureIds.length &&
    problem.correctPlay.captureIds.every(id => play.captureIds.includes(id))

  return (
    <div className="flex flex-col gap-4">
      {/* Challenge header */}
      <div className="bg-gray-800 border border-yellow-700 rounded-lg p-3">
        <div className="text-xs text-yellow-500 uppercase tracking-wide font-semibold mb-1">Challenge</div>
        <p className="text-sm text-white font-medium">{resolveCardTokens(problem.title.en)}</p>
        <p className="text-xs text-green-400 mt-1">{resolveCardTokens(problem.description.en)}</p>
      </div>

      {/* Help hints */}
      {problem.helpHints.length > 0 && !submitted && (
        <div>
          <button
            onClick={() => setShowHelp(h => !h)}
            className="text-xs text-blue-400 hover:text-blue-200 underline"
          >
            {showHelp ? 'Hide hints' : 'Show hints'}
          </button>
          {showHelp && (
            <ul className="mt-2 flex flex-col gap-1">
              {problem.helpHints.map((hint, i) => (
                <li key={i} className="text-xs text-blue-300 bg-blue-900/30 border border-blue-800 rounded px-2 py-1">
                  {resolveCardTokens(hint.en)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Point landscape if available */}
      {problem.pointLandscape && (
        <PointLandscapePanel landscape={problem.pointLandscape} config={problem.config} />
      )}

      {!submitted ? (
        <>
          <TrainerBoard
            hand={problem.hand}
            table={problem.table}
            capturedPiles={problem.capturedPiles}
            config={problem.config}
            selectedCardId={selectedCardId}
            selectedCapture={selectedCapture}
            showCaptureHints={false}
            onCardSelect={handleCardSelect}
            onTableCardClick={handleTableCardClick}
          />

          {selectedCardId && (
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
              >
                {hasCapture ? '⚡ Submit capture' : '→ Submit discard'}
              </button>
              <button
                onClick={() => { setSelectedCardId(null); setSelectedCapture([]) }}
                className="px-3 py-2 text-green-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          )}
          {!selectedCardId && (
            <p className="text-center text-xs text-green-600 italic">Select a card to play</p>
          )}
        </>
      ) : (
        <ExplanationPanel
          playerPlay={play!}
          problem={problem}
          onRetry={() => {
            setSubmitted(false)
            setPlay(null)
            setSelectedCardId(null)
            setSelectedCapture([])
            setShowHelp(false)
          }}
          onNext={() => onComplete(isSolved)}
        />
      )}
    </div>
  )
}
