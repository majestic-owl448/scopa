import { useState } from 'react'
import type { Card } from '../../engine'
import { findCaptures } from '../../engine'
import type { TrainerProblem } from '../types.ts'
import TrainerBoard from './TrainerBoard.tsx'
import { useCardLabel } from '../../utils/cardLabel.ts'

type Props = {
  problem: TrainerProblem
  onComplete: () => void
}

export default function GuidedStep({ problem, onComplete }: Props) {
  const { resolveCardTokens } = useCardLabel()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedCapture, setSelectedCapture] = useState<Card[]>([])
  const [done, setDone] = useState(false)

  // Build highlight groups: the correct card + correct captures
  const correctCard = problem.hand.find(c => c.id === problem.correctPlay.cardId)
  const correctCaptures = problem.correctPlay.captureIds
    .map(id => problem.table.find(c => c.id === id))
    .filter((c): c is Card => c != null)
  const highlights: Card[][] = []
  if (correctCard) highlights.push([correctCard])
  if (correctCaptures.length > 0) highlights.push(correctCaptures)

  function handleCardSelect(cardId: string) {
    setSelectedCardId(prev => prev === cardId ? null : cardId)
    setSelectedCapture([])
  }

  function handleTableCardClick(card: Card) {
    if (!selectedCardId) return
    const selCard = problem.hand.find(c => c.id === selectedCardId)
    if (!selCard) return
    const combos = findCaptures(selCard, problem.table, problem.config)
    const alreadySelected = selectedCapture.some(c => c.id === card.id)
    if (alreadySelected) {
      setSelectedCapture(prev => prev.filter(c => c.id !== card.id))
    } else {
      setSelectedCapture(prev => [...prev, card])
    }
    // Auto-complete if this click finalises a valid combo
    const newCapture = alreadySelected
      ? selectedCapture.filter(c => c.id !== card.id)
      : [...selectedCapture, card]
    const isValidCombo = combos.some(combo =>
      combo.length === newCapture.length &&
      combo.every(c => newCapture.some(sc => sc.id === c.id))
    )
    if (isValidCombo) {
      setSelectedCapture(newCapture)
    }
  }

  function handlePlay() {
    if (!selectedCardId) return
    setDone(true)
  }

  const selectedCard = problem.hand.find(c => c.id === selectedCardId) ?? null
  const validCaptures = selectedCard ? findCaptures(selectedCard, problem.table, problem.config) : []
  const hasCapture = validCaptures.length > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Goal */}
      <div className="bg-fcc-secondary-bg/40 border border-fcc-quaternary-bg rounded-lg p-3">
        <div className="text-xs text-fcc-blue uppercase tracking-wide font-semibold mb-1">Guided step</div>
        <p className="text-sm text-fcc-blue">
          {resolveCardTokens(problem.description.en)}
        </p>
        <p className="text-xs text-fcc-blue mt-1 italic">
          The correct cards are highlighted. Follow the guide — you can't go wrong here.
        </p>
      </div>

      {done ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-fcc-green text-lg font-bold">✓ Step complete!</div>
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          <TrainerBoard
            hand={problem.hand}
            table={problem.table}
            capturedPiles={problem.capturedPiles}
            config={problem.config}
            selectedCardId={selectedCardId}
            selectedCapture={selectedCapture}
            highlights={highlights}
            onCardSelect={handleCardSelect}
            onTableCardClick={handleTableCardClick}
          />

          {selectedCardId && (
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={handlePlay}
                className="px-6 py-2 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow"
              >
                {hasCapture ? '⚡ Capture' : '→ Discard'}
              </button>
              <button
                onClick={() => { setSelectedCardId(null); setSelectedCapture([]) }}
                className="px-3 py-2 text-fcc-green hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          )}
          {!selectedCardId && (
            <p className="text-center text-xs text-fcc-muted italic">Select the highlighted card to play</p>
          )}
        </>
      )}
    </div>
  )
}
