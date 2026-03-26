import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { useSettingsStore } from '../store/settingsStore.ts'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function GameOver() {
  const navigate = useNavigate()
  const { gameState, reset } = useGameStore()
  const recordGameResult = useSettingsStore(s => s.recordGameResult)
  const recorded = useRef(false)
  const { t } = useTranslation('game')

  useEffect(() => {
    if (!gameState) navigate('/')
  }, [gameState, navigate])

  // Record game result once when page loads
  useEffect(() => {
    if (!gameState || recorded.current) return
    recorded.current = true
    const players = gameState.players
    const inversa = gameState.config.inversa
    const scores = inversa ? gameState.totalScores.map(s => -s) : gameState.totalScores
    const maxScore = Math.max(...scores)
    const winnerIndex = scores.indexOf(maxScore)
    const humanWon = winnerIndex === 0
    const humanScope = players[0]?.scopeMarkerCards.length ?? 0
    recordGameResult(humanWon, gameState.handNumber, humanScope, 0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!gameState) return null

  const { players, totalScores } = gameState
  const inversa = gameState.config.inversa
  const scores = inversa ? totalScores.map(s => -s) : totalScores
  const maxScore = Math.max(...scores)
  const winnerIndex = scores.indexOf(maxScore)
  const winner = players[winnerIndex]

  function handlePlayAgain() {
    reset()
    navigate('/play/setup')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 p-6">
      <h2 className="text-3xl sm:text-4xl font-bold">{t('game_over')}</h2>
      <div className="text-xl sm:text-2xl text-fcc-yellow">
        {inversa ? '🏅' : '🏆'} {inversa ? t('winner_inversa', { name: winner?.name }) : t('winner', { name: winner?.name })}
      </div>

      <div className="bg-fcc-secondary-bg rounded-lg p-4 w-full max-w-sm">
        <h3 className="text-center font-bold mb-3 text-fcc-quaternary-fg">{t('final_scores')}</h3>
        <div className="flex flex-col gap-2">
          {players.map((p, i) => (
            <div key={i} className={`flex justify-between ${i === winnerIndex ? 'text-fcc-yellow font-bold' : ''}`}>
              <span>{p.name}{i === winnerIndex ? ' 🏆' : ''}</span>
              <span>{t('pts', { n: totalScores[i] })}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlayAgain}
        className="px-8 py-4 bg-fcc-yellow-gold text-fcc-primary-bg font-bold text-xl rounded-lg hover:bg-fcc-yellow"
      >
        {t('common:play_again')}
      </button>
      <button
        onClick={() => { reset(); navigate('/') }}
        className="text-fcc-green hover:text-white"
      >
        {t('common:home')}
      </button>
    </div>
  )
}
