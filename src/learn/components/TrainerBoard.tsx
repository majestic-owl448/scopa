import { useState } from 'react'
import type { Card, GameConfig } from '../../engine'
import { findCaptures } from '../../engine'
import CardView from '../../components/CardView.tsx'

type Props = {
  hand: Card[]
  table: Card[]
  capturedPiles?: Card[][]
  config: GameConfig
  selectedCardId: string | null
  selectedCapture: Card[]
  highlights?: Card[][]       // groups of cards to highlight distinctly (guided step pointers)
  showCaptureHints?: boolean  // show capturable/hover highlights; true for guided+practice, false for challenges
  onCardSelect: (cardId: string) => void
  onTableCardClick: (card: Card) => void
  disabled?: boolean
}

export default function TrainerBoard({
  hand,
  table,
  config,
  selectedCardId,
  selectedCapture,
  highlights = [],
  showCaptureHints = true,
  onCardSelect,
  onTableCardClick,
  disabled = false,
}: Props) {
  const [hoveredTableCardId, setHoveredTableCardId] = useState<string | null>(null)

  const selectedCard = hand.find(c => c.id === selectedCardId) ?? null
  const validCaptures = selectedCard ? findCaptures(selectedCard, table, config) : []
  const capturableIds = new Set(validCaptures.flatMap(combo => combo.map(c => c.id)))

  // Cards that are part of any highlight group
  const highlightedIds = new Set(highlights.flatMap(g => g.map(c => c.id)))

  // Combo hover: all cards in the same combo as the hovered card
  const hoveredComboIds = (() => {
    if (!hoveredTableCardId || !selectedCard) return new Set<string>()
    const ids = new Set<string>()
    for (const combo of validCaptures) {
      if (combo.some(c => c.id === hoveredTableCardId)) {
        combo.forEach(c => ids.add(c.id))
      }
    }
    return ids
  })()

  // Cards already chosen as part of the current capture selection
  const selectedCaptureIds = new Set(selectedCapture.map(c => c.id))

  return (
    <div className="flex flex-col gap-3">
      {/* Table */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-fcc-green uppercase tracking-wide">Table</div>
        <div className="flex gap-2 flex-wrap justify-center items-center min-h-[119px]">
          {table.length === 0 ? (
            <span className="text-fcc-muted text-sm italic">Empty table</span>
          ) : (
            table.map(card => (
              <CardView
                key={card.id}
                card={card}
                selected={selectedCaptureIds.has(card.id)}
                highlighted={
                  highlightedIds.has(card.id) ||
                  (showCaptureHints && hoveredComboIds.has(card.id))
                }
                capturable={
                  showCaptureHints &&
                  capturableIds.has(card.id) &&
                  !hoveredComboIds.has(card.id) &&
                  !selectedCaptureIds.has(card.id)
                }
                disabled={disabled}
                onClick={() => !disabled && onTableCardClick(card)}
                onPointerEnter={() => {
                  if (!disabled && capturableIds.has(card.id)) setHoveredTableCardId(card.id)
                }}
                onPointerLeave={() => setHoveredTableCardId(null)}
                size="md"
              />
            ))
          )}
        </div>
      </div>

      {/* Hand */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-fcc-green uppercase tracking-wide">Your hand</div>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {hand.map(card => (
            <CardView
              key={card.id}
              card={card}
              selected={selectedCardId === card.id}
              highlighted={highlightedIds.has(card.id)}
              disabled={disabled}
              onClick={() => !disabled && onCardSelect(card.id)}
              size="lg"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
