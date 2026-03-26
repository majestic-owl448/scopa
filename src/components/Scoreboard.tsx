import { useTranslation } from 'react-i18next'

type Props = {
  handScores: number[][]
  totalScores: number[]
  players: { id: string; name: string }[]
  targetScore: number
  onDismiss: () => void
}

export default function Scoreboard({ handScores, totalScores, players, targetScore, onDismiss }: Props) {
  const { t } = useTranslation('game')

  return (
    <div className="fixed inset-0 bg-fcc-primary-bg/70 flex items-end sm:items-center justify-center z-40 p-2 sm:p-4">
      <div className="bg-fcc-secondary-bg rounded-xl border border-fcc-quaternary-bg max-w-sm w-full">
        <div className="px-4 py-3 border-b border-fcc-quaternary-bg flex justify-between items-center">
          <h2 className="font-bold text-lg">{t('scoreboard')}</h2>
          <button
            onClick={onDismiss}
            className="px-4 py-1.5 bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded hover:bg-fcc-yellow text-sm"
          >
            {t('common:close')}
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <table className="w-full">
            <thead>
              <tr className="text-fcc-green text-xs uppercase">
                <th className="text-left pb-2">{t('hand')}</th>
                {players.map(p => (
                  <th key={p.id} className="text-center pb-2 text-fcc-quaternary-fg font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handScores.map((scores, i) => (
                <tr key={i} className="border-t border-fcc-secondary-bg">
                  <td className="py-1.5 text-xs text-fcc-green">{i + 1}</td>
                  {scores.map((s, pi) => (
                    <td key={pi} className="py-1.5 text-center text-sm text-fcc-secondary-fg">+{s}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-fcc-quaternary-bg">
                <td className="py-2 text-xs font-bold text-fcc-quaternary-fg uppercase">{t('total')}</td>
                {totalScores.map((s, i) => (
                  <td key={i} className="py-2 text-center font-bold text-fcc-yellow text-lg">{s}</td>
                ))}
              </tr>
              <tr className="border-t border-fcc-quaternary-bg">
                <td className="py-1.5 text-xs text-fcc-green uppercase">{t('target')}</td>
                {totalScores.map((s, i) => (
                  <td key={i} className="py-1.5 text-center text-sm">
                    {s >= targetScore ? <span className="text-fcc-yellow font-bold">{targetScore} ✓</span> : <span className="text-fcc-muted">{targetScore}</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
