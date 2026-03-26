import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Player } from '../engine'
import { useTranslation } from 'react-i18next'

// ── Cut animation ─────────────────────────────────────────────────────────────

function DeckCutAnimation({ onComplete }: { onComplete: () => void }) {
  const cardStyle = {
    width: 52,
    height: 86,
    borderRadius: 6,
    background: '#1e40af',
    border: '2px solid #3b82f6',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  }
  return (
    <div style={{ position: 'relative', width: 140, height: 100 }}>
      {/* Bottom half — shifts left then crosses above */}
      <motion.div
        style={{ ...cardStyle, position: 'absolute', left: 44, top: 7 }}
        animate={{ x: [-40, -40, 40, 0], zIndex: [1, 1, 2, 1] }}
        transition={{ duration: 1.6, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' }}
      />
      {/* Top half — shifts right then crosses under */}
      <motion.div
        style={{ ...cardStyle, position: 'absolute', left: 44, top: 7 }}
        animate={{ x: [40, 40, -40, 0], zIndex: [2, 2, 1, 2] }}
        transition={{ duration: 1.6, times: [0, 0.35, 0.65, 1], ease: 'easeInOut', onComplete }}
      />
    </div>
  )
}

// ── Card-back chip used in dealing zones ──────────────────────────────────────

function DealtCard({ faceUp }: { faceUp: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{
        width: 28,
        height: 46,
        borderRadius: 4,
        flexShrink: 0,
        background: faceUp ? '#f8fafc' : '#1e40af',
        border: faceUp ? '1.5px solid #cbd5e1' : '1.5px solid #3b82f6',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}
    />
  )
}

// ── One player zone ───────────────────────────────────────────────────────────

function DealZone({
  label,
  count,
  faceUp,
  isCurrentTarget,
}: {
  label: string
  count: number
  faceUp?: boolean
  isCurrentTarget: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg p-2 transition-colors duration-300 ${
        isCurrentTarget ? 'bg-green-800/60 ring-1 ring-yellow-400' : 'bg-green-900/30'
      }`}
    >
      <span className="text-xs text-green-400 font-medium">{label}</span>
      <div className="flex gap-1 flex-wrap min-h-[50px] items-center">
        <AnimatePresence>
          {Array.from({ length: count }).map((_, i) => (
            <DealtCard key={i} faceUp={faceUp ?? false} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Dealing sequence logic ────────────────────────────────────────────────────

function buildDealSequence(playerCount: number, cardsPerHand: number): ('player' | 'table')[] {
  const seq: ('player' | 'table')[] = []
  for (let round = 0; round < cardsPerHand; round++) {
    for (let p = 0; p < playerCount; p++) seq.push('player')
  }
  for (let t = 0; t < 4; t++) seq.push('table')
  return seq
}

// ── Dealing animation ─────────────────────────────────────────────────────────

function DealingAnimation({
  players,
  cardsPerHand,
  onComplete,
}: {
  players: Player[]
  cardsPerHand: number
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)
  const { t } = useTranslation('game')
  const seq = buildDealSequence(players.length, cardsPerHand)
  const total = seq.length

  useEffect(() => {
    if (step >= total) { onComplete(); return }
    const timer = setTimeout(() => setStep(s => s + 1), 300)
    return () => clearTimeout(timer)
  }, [step, total, onComplete])

  // Count cards dealt to each player and table so far
  const playerCounts = Array.from({ length: players.length }, (_, pi) => {
    let n = 0
    for (let i = 0; i < step; i++) {
      if (seq[i] === 'player') {
        const playerStep = (() => {
          let ps = 0
          for (let j = 0; j < i; j++) if (seq[j] === 'player') ps++
          return ps
        })()
        if (playerStep % players.length === pi) n++
      }
    }
    return n
  })

  const tableCount = seq.slice(0, step).filter(s => s === 'table').length

  // Which zone gets the next card?
  const nextZone = seq[step]
  const nextPlayerStep = (() => {
    let ps = 0
    for (let j = 0; j < step; j++) if (seq[j] === 'player') ps++
    return ps
  })()
  const nextPlayerIdx = nextZone === 'player' ? nextPlayerStep % players.length : null

  const deckRemaining = 40 - step

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Opponents */}
      {players.slice(1).map((p, i) => (
        <DealZone
          key={p.id}
          label={p.name}
          count={playerCounts[i + 1] ?? 0}
          isCurrentTarget={nextPlayerIdx === i + 1}
        />
      ))}

      {/* Table + deck side by side */}
      <div className="flex gap-3 items-start">
        <DealZone
          label={t('table')}
          count={tableCount}
          faceUp
          isCurrentTarget={nextZone === 'table'}
        />
        <div className="flex flex-col items-center gap-1 ml-auto">
          <span className="text-xs text-green-600">{t('deck')}</span>
          <div
            style={{
              width: 34,
              height: 54,
              borderRadius: 5,
              background: '#1e3a6b',
              border: '1.5px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-blue-300 font-bold" style={{ fontSize: 10 }}>
              {deckRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Human player */}
      <DealZone
        label={players[0]?.name ?? t('common:you')}
        count={playerCounts[0] ?? 0}
        isCurrentTarget={nextPlayerIdx === 0}
      />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Stage = 'cutting' | 'dealing' | 'ready'

export default function Deal() {
  const navigate = useNavigate()
  const gameState = useGameStore(s => s.gameState)
  const [stage, setStage] = useState<Stage>('cutting')
  const { t } = useTranslation('game')

  useEffect(() => {
    if (!gameState) navigate('/')
  }, [gameState, navigate])

  const onCutDone = useCallback(() => setStage('dealing'), [])
  const onDealDone = useCallback(() => setStage('ready'), [])

  if (!gameState) return null

  const { players, dealerIndex, config } = gameState
  const dealerName = players[dealerIndex]?.name ?? 'Dealer'
  const cutterIndex = (dealerIndex - 1 + players.length) % players.length
  const cutDescription =
    cutterIndex === 0
      ? t('cut_the_deck')
      : t('name_cuts_deck', { name: players[cutterIndex]?.name ?? 'CPU' })

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-4 gap-5 pb-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-0.5 pt-4">
        <span className="text-green-400 text-xs uppercase tracking-widest">
          {stage === 'cutting' ? t('cutting') : stage === 'dealing' ? t('dealing') : t('ready')}
        </span>
        <p className="text-white text-base">
          <span className="font-bold text-yellow-400">{dealerName}</span> {t('dealer_deals', { name: '' }).trim()}
        </p>
        {stage === 'cutting' && (
          <p className="text-green-400 text-sm">{cutDescription}</p>
        )}
      </div>

      {/* Cut animation */}
      {stage === 'cutting' && (
        <div className="flex flex-col items-center gap-4">
          <DeckCutAnimation onComplete={onCutDone} />
          <button
            onClick={() => setStage('dealing')}
            className="text-xs text-green-700 hover:text-green-500 underline"
          >
            {t('common:skip_cut')}
          </button>
        </div>
      )}

      {/* Dealing animation */}
      {stage === 'dealing' && (
        <DealingAnimation
          players={players}
          cardsPerHand={config.cardsPerHand}
          onComplete={onDealDone}
        />
      )}

      {/* Placeholder layout while ready (keeps height stable) */}
      {stage === 'ready' && (
        <div className="flex-1" />
      )}

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        {stage === 'ready' && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/play/game')}
            className="px-8 py-3 bg-yellow-500 text-black font-bold text-lg rounded-lg hover:bg-yellow-400 transition-colors"
          >
            {t('common:start_playing')}
          </motion.button>
        )}
        <button
          onClick={() => navigate('/play/game')}
          className="text-xs text-green-700 hover:text-green-500 underline"
        >
          {stage === 'ready' ? t('common:go_to_game') : t('common:skip')}
        </button>
      </div>
    </div>
  )
}
