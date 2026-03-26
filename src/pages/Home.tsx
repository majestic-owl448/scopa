import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../store/settingsStore.ts'

export default function Home() {
  const navigate = useNavigate()
  const { gameState, reset } = useGameStore()
  const { t } = useTranslation()
  const { language, setLanguage } = useSettingsStore()

  const hasActiveGame = gameState && (gameState.phase === 'playing' || gameState.phase === 'capture-select' || gameState.phase === 'hand-end')
  const isGameOver = gameState?.phase === 'game-over'

  function handleNewGame() {
    reset()
    navigate('/play/setup')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-widest">SCOPA</h1>
      <p className="text-fcc-quaternary-fg text-base sm:text-lg italic">{t('the_italian_card_game')}</p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {hasActiveGame && (
          <button
            onClick={() => navigate('/play/game')}
            className="w-full px-8 py-4 bg-fcc-yellow-gold text-fcc-primary-bg font-bold text-xl rounded-lg hover:bg-fcc-yellow transition-colors"
          >
            {t('continue_game')}
          </button>
        )}
        {isGameOver && (
          <button
            onClick={() => navigate('/play/game/over')}
            className="w-full px-8 py-4 bg-fcc-yellow-gold text-fcc-primary-bg font-bold text-xl rounded-lg hover:bg-fcc-yellow transition-colors"
          >
            {t('view_results')}
          </button>
        )}
        <button
          onClick={handleNewGame}
          className={`w-full px-8 py-4 font-bold text-xl rounded-lg transition-colors ${
            hasActiveGame || isGameOver
              ? 'bg-fcc-tertiary-bg hover:bg-fcc-quaternary-bg text-white'
              : 'bg-fcc-yellow-gold text-fcc-primary-bg hover:bg-fcc-yellow'
          }`}
        >
          {t('new_game')}
        </button>
        <button
          onClick={() => navigate('/learn')}
          className="w-full px-8 py-4 bg-fcc-quaternary-bg hover:bg-fcc-quaternary-bg text-white font-bold text-xl rounded-lg transition-colors"
        >
          {t('learn')}
        </button>
        <button
          onClick={() => navigate('/rules')}
          className="text-fcc-green hover:text-white text-sm underline"
        >
          {t('how_to_play')}
        </button>
        <button
          onClick={() => navigate('/stats')}
          className="text-fcc-muted hover:text-fcc-green text-sm underline"
        >
          {t('stats')}
        </button>
        <button
          onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
          className="text-fcc-muted hover:text-fcc-green text-sm mt-2"
        >
          {language === 'en' ? 'Italiano' : 'English'}
        </button>
      </div>
    </div>
  )
}
