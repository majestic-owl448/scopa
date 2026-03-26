import { useState } from 'react'
import { useGameStore, AI_DEBUG } from '../store/gameStore.ts'
import { useCardLabel } from '../utils/cardLabel.ts'

export default function AIDebugPanel() {
  const aiDebugLog = useGameStore(s => s.aiDebugLog)
  const [open, setOpen] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [expandedCombo, setExpandedCombo] = useState<string | null>(null)
  const { cardLabelFromId, cardLabel } = useCardLabel()

  const BREAKDOWN_LABEL: Record<string, string> = {
    scopa: 'Scopa',
    settebello: cardLabel(7, 'coins'),
    re_bello: cardLabel(10, 'coins'),
    rosmarino: cardLabel(8, 'swords'),
    napola: 'Napola',
    settanta: 'Settanta',
    ori: 'Ori',
    primiera: 'Primiera',
    carte: 'Carte',
    size: 'Size pen.',
    scopa_risk: 'Scopa risk',
    scopa_bait: 'Scopa bait',
    ori_bait: 'Ori bait',
    settebello_bait: `${cardLabel(7, 'coins')} bait`,
    re_bello_bait: `${cardLabel(10, 'coins')} bait`,
    rosmarino_bait: `${cardLabel(8, 'swords')} bait`,
    low_value: 'Low value',
  }

  if (!AI_DEBUG) return null

  const entry = selectedEntry !== null ? aiDebugLog[selectedEntry] : aiDebugLog[aiDebugLog.length - 1]

  function handleEntrySelect(i: number) {
    setSelectedEntry(i === aiDebugLog.length - 1 ? null : i)
    setExpandedCombo(null)
  }

  // Group plays by cardId
  const grouped = entry
    ? Object.values(
        entry.plays.reduce<Record<string, typeof entry.plays>>((acc, play) => {
          ;(acc[play.cardId] ??= []).push(play)
          return acc
        }, {}),
      )
    : []

  return (
    <div
      className="fixed bottom-0 right-0 z-50 bg-gray-950 text-green-400 font-mono text-xs border-l border-t border-green-800"
      style={{ width: open ? 360 : 120, maxHeight: '65vh' }}
    >
      <div
        className="flex items-center justify-between px-2 py-1 bg-gray-900 cursor-pointer border-b border-green-800"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-bold text-green-300">🤖 AI Debug ● ON</span>
        <span className="text-green-600">{open ? '▼' : '▲'}</span>
      </div>

      {open && (
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(65vh - 28px)' }}>
          {/* Turn history selector */}
          <div className="flex gap-1 p-1 flex-wrap border-b border-green-900">
            {aiDebugLog.map((e, i) => (
              <button
                key={i}
                onClick={() => handleEntrySelect(i)}
                className={`px-1 rounded ${(selectedEntry === i || (selectedEntry === null && i === aiDebugLog.length - 1)) ? 'bg-green-700 text-white' : 'text-green-600 hover:text-green-300'}`}
              >
                T{e.turn}
              </button>
            ))}
            {aiDebugLog.length === 0 && (
              <span className="text-green-700 italic px-1">waiting for AI turn…</span>
            )}
          </div>

          {entry && (
            <div className="p-2">
              <div className="text-green-300 mb-1.5">
                <span className="text-yellow-400">{entry.playerName}</span> — Turn {entry.turn}
                <span className="text-green-700 ml-1">(click combo for breakdown)</span>
              </div>

              <div className="flex flex-col gap-1">
                {grouped.map(combos => {
                  const cardId = combos[0]!.cardId
                  const isChosenCard = cardId === entry.chosen.cardId
                  const bestScore = Math.max(...combos.map(c => c.score))

                  return (
                    <div
                      key={cardId}
                      className={`rounded border ${isChosenCard ? 'border-green-600 bg-green-950' : 'border-green-900 bg-gray-900/40'}`}
                    >
                      {/* Card header */}
                      <div className={`px-2 py-0.5 font-bold flex justify-between ${isChosenCard ? 'text-yellow-400' : 'text-green-300'}`}>
                        <span>{isChosenCard ? '▶ ' : ''}{cardLabelFromId(cardId)}</span>
                        <span className="text-green-600 font-normal">best: {bestScore.toFixed(1)}</span>
                      </div>

                      {/* Capture combos */}
                      {combos.map((play, ci) => {
                        const isChosen =
                          isChosenCard &&
                          JSON.stringify(play.captureIds.slice().sort()) ===
                            JSON.stringify(entry.chosen.captureIds.slice().sort())
                        const comboKey = `${cardId}-${ci}`
                        const isExpanded = expandedCombo === comboKey

                        return (
                          <div key={ci}>
                            <div
                              onClick={() => setExpandedCombo(isExpanded ? null : comboKey)}
                              className={`flex items-center gap-1.5 px-2 py-0.5 cursor-pointer border-t border-green-900/60 hover:bg-gray-800 ${isChosen ? 'text-white' : 'text-green-500'}`}
                            >
                              <span className="shrink-0 w-3">{isChosen ? '●' : '○'}</span>
                              <span className="flex-1 truncate" title={play.captureIds.map(cardLabelFromId).join(' ')}>
                                {play.captureIds.length > 0
                                  ? play.captureIds.map(cardLabelFromId).join(' ')
                                  : <span className="italic text-green-700">discard</span>
                                }
                              </span>
                              <span className="shrink-0 text-green-600">{play.priorityKey}</span>
                              <span className={`shrink-0 font-bold ${isChosen ? 'text-yellow-400' : ''}`}>
                                {play.score.toFixed(1)}
                              </span>
                            </div>
                            {isExpanded && (
                              <div className="px-3 py-1.5 bg-gray-900 border-t border-green-900/60">
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                  {Object.entries(play.scoreBreakdown).map(([key, val]) => (
                                    <span key={key} className={val > 0 ? 'text-green-400' : 'text-red-400'}>
                                      {BREAKDOWN_LABEL[key] ?? key}: {val > 0 ? '+' : ''}{Number.isInteger(val) ? val : val.toFixed(1)}
                                    </span>
                                  ))}
                                  {Object.keys(play.scoreBreakdown).length === 0 && (
                                    <span className="text-green-700 italic">no scoring components</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
