import { useState } from 'react'
import type { Card } from '../../engine'
import { findCaptures } from '../../engine'
import type { TrainerProblem } from '../types.ts'
import TrainerBoard from './TrainerBoard.tsx'
import { useCardLabel } from '../../utils/cardLabel.ts'

type Props = {
  problem: TrainerProblem
  onCorrect: () => void
}

type State = 'playing' | 'wrong' | 'correct'

export default function PracticeQuestion({ problem, onCorrect }: Props) {
  const { resolveCardTokens } = useCardLabel()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [selectedCapture, setSelectedCapture] = useState<Card[]>([])
  const [uiState, setUiState] = useState<State>('playing')

  function handleCardSelect(cardId: string) {
    if (uiState !== 'playing') return
    setSelectedCardId(prev => prev === cardId ? null : cardId)
    setSelectedCapture([])
  }

  function handleTableCardClick(card: Card) {
    if (uiState !== 'playing' || !selectedCardId) return
    const selCard = problem.hand.find(c => c.id === selectedCardId)
    if (!selCard) return
    const alreadySelected = selectedCapture.some(c => c.id === card.id)
    if (alreadySelected) {
      setSelectedCapture(prev => prev.filter(c => c.id !== card.id))
    } else {
      setSelectedCapture(prev => [...prev, card])
    }
  }

  function handlePlay() {
    if (!selectedCardId || uiState !== 'playing') return

    const captureIds = selectedCapture.map(c => c.id)
    const correct = selectedCardId === problem.correctPlay.cardId &&
      captureIds.length === problem.correctPlay.captureIds.length &&
      problem.correctPlay.captureIds.every(id => captureIds.includes(id))

    if (correct) {
      setUiState('correct')
      setTimeout(onCorrect, 900)
    } else {
      setUiState('wrong')
      setTimeout(() => {
        setUiState('playing')
        setSelectedCardId(null)
        setSelectedCapture([])
      }, 1200)
    }
  }

  const selectedCard = problem.hand.find(c => c.id === selectedCardId) ?? null
  const validCaptures = selectedCard ? findCaptures(selectedCard, problem.table, problem.config) : []
  const hasCapture = validCaptures.length > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Goal */}
      <div className="bg-fcc-tertiary-bg border border-fcc-quaternary-bg rounded-lg p-3">
        <div className="text-xs text-fcc-green uppercase tracking-wide font-semibold mb-1">Practice question</div>
        {problem.goal && (
          <p className="text-sm text-white font-medium">{resolveCardTokens(problem.goal.en)}</p>
        )}
        <p className="text-xs text-fcc-green mt-1">{resolveCardTokens(problem.description.en)}</p>
      </div>

      {uiState === 'correct' && (
        <div className="text-center text-fcc-green font-bold py-2 animate-pulse">✓ Correct!</div>
      )}
      {uiState === 'wrong' && (
        <div className="text-center text-fcc-red font-bold py-2">Not quite — try again</div>
      )}

      <TrainerBoard
        hand={problem.hand}
        table={problem.table}
        capturedPiles={problem.capturedPiles}
        config={problem.config}
        selectedCardId={selectedCardId}
        selectedCapture={selectedCapture}
        onCardSelect={handleCardSelect}
        onTableCardClick={handleTableCardClick}
        disabled={uiState !== 'playing'}
      />

      {uiState === 'playing' && selectedCardId && (
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
      {uiState === 'playing' && !selectedCardId && (
        <p className="text-center text-xs text-fcc-muted italic">Select a card to play</p>
      )}
    </div>
  )
}
