import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../store/settingsStore.ts'
import { useTranslation } from 'react-i18next'

export default function Stats() {
  const navigate = useNavigate()
  const { stats } = useSettingsStore()
  const { t } = useTranslation('game')

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0

  const avgScope = stats.gamesPlayed > 0
    ? (stats.scopeScored / stats.gamesPlayed).toFixed(1)
    : '—'

  function StatRow({ label, value }: { label: string; value: string | number }) {
    return (
      <div className="flex justify-between items-center py-3 border-b border-fcc-quaternary-bg">
        <span className="text-fcc-quaternary-fg">{label}</span>
        <span className="font-bold text-white text-lg">{value}</span>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-5 min-h-dvh">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-fcc-quaternary-fg hover:text-white">{t('common:back')}</button>
        <h2 className="text-2xl font-bold">{t('common:stats')}</h2>
      </div>

      {stats.gamesPlayed === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-fcc-muted gap-3">
          <div className="text-5xl">🃏</div>
          <p className="text-center">{t('no_games_yet')}</p>
          <button
            onClick={() => navigate('/play/setup')}
            className="px-6 py-3 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow"
          >
            {t('play_a_game')}
          </button>
        </div>
      ) : (
        <div className="bg-fcc-secondary-bg/40 rounded-xl border border-fcc-quaternary-bg p-4">
          <StatRow label={t('games_played')} value={stats.gamesPlayed} />
          <StatRow label={t('games_won')} value={stats.gamesWon} />
          <StatRow label={t('games_lost')} value={stats.gamesLost} />
          <StatRow label={t('win_rate')} value={`${winRate}%`} />
          <StatRow label={t('hands_played')} value={stats.handsPlayed} />
          <StatRow label={t('scope_scored')} value={stats.scopeScored} />
          <StatRow label={t('avg_scope')} value={avgScope} />
        </div>
      )}
    </div>
  )
}
