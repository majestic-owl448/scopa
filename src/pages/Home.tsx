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
      <h1 className="text-6xl font-bold tracking-widest">SCOPA</h1>
      <p className="text-green-300 text-lg italic">{t('the_italian_card_game')}</p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {hasActiveGame && (
          <button
            onClick={() => navigate('/play/game')}
            className="w-full px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
          >
            {t('continue_game')}
          </button>
        )}
        {isGameOver && (
          <button
            onClick={() => navigate('/play/game/over')}
            className="w-full px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
          >
            {t('view_results')}
          </button>
        )}
        <button
          onClick={handleNewGame}
          className={`w-full px-8 py-4 font-bold text-xl rounded-lg transition-colors ${
            hasActiveGame || isGameOver
              ? 'bg-green-800 hover:bg-green-700 text-white'
              : 'bg-yellow-500 text-black hover:bg-yellow-400'
          }`}
        >
          {t('new_game')}
        </button>
        <button
          onClick={() => navigate('/learn')}
          className="w-full px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xl rounded-lg transition-colors"
        >
          {t('learn')}
        </button>
        <button
          onClick={() => navigate('/rules')}
          className="text-green-400 hover:text-white text-sm underline"
        >
          {t('how_to_play')}
        </button>
        <button
          onClick={() => navigate('/stats')}
          className="text-green-600 hover:text-green-400 text-sm underline"
        >
          {t('stats')}
        </button>
        <button
          onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
          className="text-green-600 hover:text-green-400 text-sm mt-2"
        >
          {language === 'en' ? 'Italiano' : 'English'}
        </button>
      </div>
    </div>
  )
}
