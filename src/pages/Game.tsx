import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { findCaptures } from '../engine'
import { useState, useEffect, useRef } from 'react'
import type { Card } from '../engine'
import CardView from '../components/CardView.tsx'
import HandSummary from '../components/HandSummary.tsx'
import Scoreboard from '../components/Scoreboard.tsx'
import AIDebugPanel from '../components/AIDebugPanel.tsx'
import { useSettingsStore } from '../store/settingsStore.ts'
import { useCardLabel } from '../utils/cardLabel.ts'
import { useTranslation } from 'react-i18next'

const SUIT_COLOR: Record<string, string> = {
  coins: 'text-yellow-400', cups: 'text-red-400', swords: 'text-gray-300', clubs: 'text-green-400',
}

function CardLabel({ card }: { card: Card }) {
  const { rankLabel, suitSymbols } = useCardLabel()
  return (
    <span>
      {rankLabel(card.rank)}
      <span className={SUIT_COLOR[card.suit]}>{suitSymbols[card.suit]}</span>
    </span>
  )
}

/**
 * Shows a CardView(sm, 52x86) rotated 90 inside an 86x52 container.
 */
function ScopeCardPeek({ card }: { card: Card }) {
  return (
    <div style={{ width: 86, height: 52, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{
        position: 'absolute',
        left: 17,
        top: -17,
        transform: 'rotate(90deg)',
        transformOrigin: 'center center',
      }}>
        <CardView card={card} size="sm" />
      </div>
    </div>
  )
}

function CapturedPile({ capturedCards, scopeMarkerCards }: { capturedCards: Card[]; scopeMarkerCards: Card[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const count = capturedCards.length
  if (count === 0 && scopeMarkerCards.length === 0) return null

  return (
    <div className="flex items-center">
      {count > 0 && (
        <div className="relative flex-shrink-0" style={{ width: 30, height: 50 }}>
          {count >= 3 && (
            <div className="absolute rounded" style={{ width: 26, height: 44, top: 4, left: 2, background: '#14532d', border: '1px solid #166534' }} />
          )}
          {count >= 2 && (
            <div className="absolute rounded" style={{ width: 26, height: 44, top: 2, left: 1, background: '#1c3d5a', border: '1px solid #1e4a7d' }} />
          )}
          <div className="absolute rounded flex items-center justify-center" style={{ width: 26, height: 44, top: 0, left: 0, background: '#1e3a6b', border: '1px solid #3b82f6' }}>
            <span className="text-blue-300 font-bold" style={{ fontSize: 10 }}>{count}</span>
          </div>
        </div>
      )}
      {scopeMarkerCards.map((card, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            marginLeft: i === 0 ? (count > 0 ? -4 : 0) : -(86 - 16),
            flexShrink: 0,
            zIndex: hoveredIdx === i ? 10 : 0,
          }}
          onPointerEnter={() => setHoveredIdx(i)}
          onPointerLeave={() => setHoveredIdx(null)}
        >
          <ScopeCardPeek card={card} />
        </div>
      ))}
    </div>
  )
}

export default function Game() {
  const navigate = useNavigate()
  const { gameState, playCard, selectCapture, advance, resumeAI, reset, lastAIPlay } = useGameStore()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [hoveredTableCardId, setHoveredTableCardId] = useState<string | null>(null)
  const [captureFilter, setCaptureFilter] = useState<number[] | null>(null)
  const pendingAutoCaptureRef = useRef<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [showCaptured, setShowCaptured] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const { suitSymbols, cardLabel } = useCardLabel()
  const { t } = useTranslation('game')

  useEffect(() => { if (!gameState) navigate('/') }, [gameState, navigate])
  useEffect(() => { resumeAI() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (gameState?.phase === 'game-over') navigate('/play/game/over')
  }, [gameState?.phase, navigate])
  useEffect(() => {
    if (gameState?.phase === 'hand-end') setShowSummary(true)
  }, [gameState?.phase])
  const isCapturePhaseCurrent = gameState?.phase === 'capture-select' && gameState?.currentPlayerIndex === 0
  useEffect(() => {
    if (isCapturePhaseCurrent && pendingAutoCaptureRef.current !== null) {
      const idx = pendingAutoCaptureRef.current
      pendingAutoCaptureRef.current = null
      setCaptureFilter(null)
      selectCapture(idx)
    }
  }, [isCapturePhaseCurrent, selectCapture])

  if (!gameState) return null

  const { players, table, phase, currentPlayerIndex, config, totalScores, deck, pendingCaptures, lastRoundScores, handNumber, handScores } = gameState
  const humanPlayer = players[0]!
  const isHumanTurn = currentPlayerIndex === 0 && phase === 'playing'
  const isCaptureSelect = phase === 'capture-select' && currentPlayerIndex === 0

  function handleHandCardClick(cardId: string) {
    if (!isHumanTurn) return
    setSelectedCardId(prev => prev === cardId ? null : cardId)
    setHoveredTableCardId(null)
    setCaptureFilter(null)
  }

  function handleTableCardClick(card: Card) {
    if (!isHumanTurn || !selectedCardId) return
    const selCard = humanPlayer.hand.find(c => c.id === selectedCardId)
    if (!selCard) return
    const captures = findCaptures(selCard, table, config)
    const containingIndices = captures
      .map((combo, idx) => ({ combo, idx }))
      .filter(({ combo }) => combo.some(c => c.id === card.id))
      .map(({ idx }) => idx)
    if (containingIndices.length === 0) return
    if (containingIndices.length === 1) {
      if (captures.length === 1) {
        playCard(selectedCardId)
      } else {
        pendingAutoCaptureRef.current = containingIndices[0]!
        playCard(selectedCardId)
      }
      setSelectedCardId(null)
    } else {
      setCaptureFilter(containingIndices)
      playCard(selectedCardId)
      setSelectedCardId(null)
    }
  }

  function handlePlay() {
    if (!selectedCardId) return
    playCard(selectedCardId)
    setSelectedCardId(null)
  }

  function handleCaptureSelect(idx: number) {
    selectCapture(idx)
    setSelectedCardId(null)
  }

  function handleSummaryDismiss() {
    setShowSummary(false)
    setShowScoreboard(true)
  }

  function handleScoreboardDismiss() {
    setShowScoreboard(false)
    advance()
  }

  const selectedCard = humanPlayer.hand.find(c => c.id === selectedCardId) ?? null
  const validCaptures = selectedCard ? findCaptures(selectedCard, table, config) : []
  const capturableIds = new Set(validCaptures.flatMap(combo => combo.map(c => c.id)))
  const hoveredComboCardIds = (() => {
    if (!hoveredTableCardId || !selectedCard) return new Set<string>()
    const ids = new Set<string>()
    for (const combo of validCaptures) {
      if (combo.some(c => c.id === hoveredTableCardId)) {
        combo.forEach(c => ids.add(c.id))
      }
    }
    return ids
  })()
  const target = config.playerCount === 2 ? 11 : config.playerCount === 3 ? 16 : 21
  const { deckStyle, setDeckStyle } = useSettingsStore()

  function handleQuit() {
    if (confirm(t('quit_confirm'))) {
      reset()
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-1 sm:p-2 gap-1.5 sm:gap-2 pb-4">
      {/* Header: scores */}
      <div className="flex gap-1 bg-green-900/80 rounded-lg p-2">
        {players.map((p, i) => (
          <div key={p.id} className={`flex-1 flex flex-col items-center rounded p-1 ${i === currentPlayerIndex && phase === 'playing' ? 'bg-yellow-500/20 ring-1 ring-yellow-400' : ''}`}>
            <span className="font-bold text-sm truncate max-w-full">{p.name}</span>
            <span className="text-lg font-bold text-yellow-400">{totalScores[i] ?? 0}</span>
            <span className="text-xs text-green-400">/ {target}</span>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center px-2 text-green-500 gap-0.5">
          <span className="text-xs">{t('deck')}</span>
          <span className="font-mono font-bold">{deck.length}</span>
          <span className="text-xs">{t('hand_n', { n: handNumber })}</span>
          <button
            onClick={() => setShowScoreboard(true)}
            className="text-xs text-green-600 hover:text-green-400 underline min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('scoreboard')}
          >
            {t('scores')}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const styles = ['napoletane', 'french', 'uno'] as const
                const idx = styles.indexOf(deckStyle as 'napoletane' | 'french' | 'uno')
                setDeckStyle(styles[(idx + 1) % styles.length]!)
              }}
              className="text-xs text-green-600 hover:text-green-400 underline min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Switch deck style"
            >
              {deckStyle === 'napoletane' ? 'Na' : deckStyle === 'french' ? 'Fr' : 'Col'}
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="text-xs text-blue-400 hover:text-blue-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={t('rules_reference')}
            >
              ? {t('common:rules')}
            </button>
          </div>
          <button
            onClick={handleQuit}
            className="text-xs text-red-700 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t('quit')}
          >
            ✕ {t('quit')}
          </button>
        </div>
      </div>

      {/* Opponents: hand + captured pile */}
      {players.slice(1).map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-2 px-1 bg-green-900/30 rounded-lg py-1.5">
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-green-500">{t('n_in_hand', { n: p.hand.length })}</div>
            <div className="flex gap-1">
              {p.hand.map((_, idx) => (
                <CardView key={idx} card={null} faceDown size="sm" />
              ))}
            </div>
          </div>
          <CapturedPile capturedCards={p.captured} scopeMarkerCards={p.scopeMarkerCards} />
        </div>
      ))}

      {/* Last AI play record */}
      {isHumanTurn && lastAIPlay && (
        <div className="flex items-center gap-2 bg-green-950/60 border border-green-800 rounded-lg px-3 py-2 text-sm">
          <span className="text-green-500 text-xs shrink-0">{t('played', { name: lastAIPlay.playerName })}</span>
          <CardView card={lastAIPlay.card} size="sm" />
          {lastAIPlay.captures.length > 0 ? (
            <>
              <span className="text-green-600 text-xs shrink-0">{t('took')}</span>
              <div className="flex gap-1 flex-wrap">
                {lastAIPlay.captures.map(c => <CardView key={c.id} card={c} size="sm" />)}
              </div>
            </>
          ) : (
            <span className="text-green-700 text-xs italic">{t('discarded')}</span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 min-h-32">
        <div className="text-xs text-green-500 uppercase tracking-wide">{t('table')}</div>
        <div className="flex gap-2 flex-wrap justify-center items-center" style={{minHeight: 119}}>
          {table.length === 0 ? (
            <span className="text-green-700 text-sm italic">{t('empty_table')}</span>
          ) : (
            table.map(card => (
              <CardView
                key={card.id}
                card={card}
                capturable={capturableIds.has(card.id) && !hoveredComboCardIds.has(card.id)}
                highlighted={hoveredComboCardIds.has(card.id)}
                onClick={() => handleTableCardClick(card)}
                onPointerEnter={() => capturableIds.has(card.id) ? setHoveredTableCardId(card.id) : undefined}
                onPointerLeave={() => setHoveredTableCardId(null)}
                size="md"
              />
            ))
          )}
        </div>
      </div>

      {/* Capture-select */}
      {isCaptureSelect && (
        <div className="bg-green-900 rounded-lg p-3 border border-yellow-600">
          <div className="text-sm text-yellow-400 mb-2 font-semibold">{t('choose_capture')}</div>
          <div className="flex flex-col gap-1.5">
            {pendingCaptures.map((combo, idx) => {
              if (captureFilter && !captureFilter.includes(idx)) return null
              return (
                <button
                  key={idx}
                  onClick={() => handleCaptureSelect(idx)}
                  className="flex gap-1.5 items-center bg-green-800 hover:bg-green-700 rounded p-2 border border-green-600"
                >
                  {combo.map(c => <CardView key={c.id} card={c} size="sm" />)}
                  <span className="ml-2 text-xs text-green-400">
                    {combo.map(c => <CardLabel key={c.id} card={c} />)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Status bar when waiting for AI */}
      {!isHumanTurn && phase === 'playing' && (
        <div className="text-center text-green-400 text-sm py-1 animate-pulse">
          {t('thinking', { name: players[currentPlayerIndex]?.name })}
        </div>
      )}

      {/* Human hand */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-green-500 uppercase tracking-wide">{t('your_hand')}</div>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {humanPlayer.hand.map(card => (
            <CardView
              key={card.id}
              card={card}
              selected={selectedCardId === card.id}
              onClick={() => handleHandCardClick(card.id)}
              disabled={!isHumanTurn}
              size="lg"
            />
          ))}
        </div>

        {isHumanTurn && selectedCardId && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              {validCaptures.length > 0 ? `⚡ ${t('common:capture')}` : `→ ${t('common:discard')}`}
            </button>
            <button
              onClick={() => setSelectedCardId(null)}
              className="px-3 py-2 text-green-400 hover:text-white text-sm"
            >
              {t('common:cancel')}
            </button>
          </div>
        )}

        {isHumanTurn && !selectedCardId && (
          <div className="text-xs text-green-600 italic">{t('select_card_to_play')}</div>
        )}
      </div>

      {/* Captured pile viewer */}
      {humanPlayer.captured.length > 0 && (
        <div className="border border-green-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowCaptured(c => !c)}
            className="w-full flex justify-between items-center px-3 py-2 text-xs text-green-500 hover:bg-green-900/40"
          >
            <CapturedPile capturedCards={humanPlayer.captured} scopeMarkerCards={humanPlayer.scopeMarkerCards} />
            <span>{showCaptured ? '▲' : '▼'}</span>
          </button>
          {showCaptured && (
            <div className="px-3 pb-3 bg-green-950/40">
              {(['coins', 'cups', 'swords', 'clubs'] as const).map(suit => {
                const cards = humanPlayer.captured.filter(c => c.suit === suit).sort((a, b) => a.rank - b.rank)
                if (cards.length === 0) return null
                return (
                  <div key={suit} className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className={`text-xs w-4 ${SUIT_COLOR[suit]}`}>{suitSymbols[suit]}</span>
                    {cards.map(c => (
                      <CardView key={c.id} card={c} size="sm" />
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Hand Summary modal */}
      {showSummary && lastRoundScores && (
        <HandSummary
          roundScores={lastRoundScores}
          players={players}
          config={config}
          handNumber={handNumber}
          totalScores={totalScores}
          onDismiss={handleSummaryDismiss}
        />
      )}

      {/* Scoreboard modal */}
      {showScoreboard && (
        <Scoreboard
          handScores={handScores}
          totalScores={totalScores}
          players={players}
          targetScore={target}
          onDismiss={handleScoreboardDismiss}
        />
      )}

      {/* In-game rules overlay */}
      {showRules && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-40 p-4" onClick={() => setShowRules(false)}>
          <div
            className="bg-gray-900 rounded-xl border border-blue-700 w-full max-w-lg max-h-[75vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-blue-800 flex justify-between items-center sticky top-0 bg-gray-900">
              <h2 className="font-bold text-lg text-blue-200">{t('rules_reference')}</h2>
              <button onClick={() => setShowRules(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-4 text-sm text-green-200 flex flex-col gap-3">
              <section>
                <h3 className="text-blue-300 font-semibold mb-1">{t('common:rules')}</h3>
                <p>{t('turn_rules')}</p>
              </section>
              <section>
                <h3 className="text-blue-300 font-semibold mb-1">{t('capture_rules_title')}</h3>
                {config.captureTarget === 'rank' && <p>{t('capture_rules_rank')}</p>}
                {config.captureTarget === 'quindici' && <p>{t('capture_rules_quindici')}</p>}
                {config.captureTarget === 'undici' && <p>{t('capture_rules_undici')}</p>}
                {config.scopaDAssi && <p className="mt-1"><strong>Scopa d'Assi:</strong> {t('scopa_d_assi_rule')}</p>}
                {config.inversa && <p className="mt-1 text-orange-300"><strong>Inversa:</strong> {t('inversa_rule')}</p>}
              </section>
              <section>
                <h3 className="text-blue-300 font-semibold mb-1">{t('scoring_rules_title')}</h3>
                <ul className="list-disc list-inside space-y-0.5 text-green-300">
                  <li>{t('scoring_scope')}</li>
                  <li>{t('scoring_carte')}</li>
                  <li>{t('scoring_ori')}</li>
                  <li>{t('scoring_settebello', { card: cardLabel(7, 'coins') })}</li>
                  <li>{config.primieraValues === 'milano' ? t('scoring_primiera_milano') : config.primieraValues === 'veneto' ? t('scoring_primiera_veneto') : t('scoring_primiera_standard')}</li>
                  {config.reBello && <li>{t('scoring_re_bello', { card: cardLabel(10, 'coins') })}</li>}
                  {config.rosmarino && <li>{t('scoring_rosmarino', { card: cardLabel(8, 'swords') })}</li>}
                  {config.settanta && <li>{t('scoring_settanta')}</li>}
                  {config.napola && <li>{t('scoring_napola', { cards: `${cardLabel(1, 'coins')}+${cardLabel(2, 'coins')}+${cardLabel(3, 'coins')}` })}</li>}
                </ul>
              </section>
              <section>
                <h3 className="text-blue-300 font-semibold mb-1">{t('target')}</h3>
                <p>{t('target_score_info', { target, count: config.playerCount })}</p>
              </section>
            </div>
          </div>
        </div>
      )}

      <AIDebugPanel />
    </div>
  )
}
