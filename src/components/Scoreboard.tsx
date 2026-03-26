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
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-40 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl border border-green-700 max-w-sm w-full">
        <div className="px-4 py-3 border-b border-green-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">{t('scoreboard')}</h2>
          <button
            onClick={onDismiss}
            className="px-4 py-1.5 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 text-sm"
          >
            {t('common:close')}
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <table className="w-full">
            <thead>
              <tr className="text-green-500 text-xs uppercase">
                <th className="text-left pb-2">{t('hand')}</th>
                {players.map(p => (
                  <th key={p.id} className="text-center pb-2 text-green-300 font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handScores.map((scores, i) => (
                <tr key={i} className="border-t border-green-900">
                  <td className="py-1.5 text-xs text-green-500">{i + 1}</td>
                  {scores.map((s, pi) => (
                    <td key={pi} className="py-1.5 text-center text-sm text-green-200">+{s}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-green-600">
                <td className="py-2 text-xs font-bold text-green-300 uppercase">{t('total')}</td>
                {totalScores.map((s, i) => (
                  <td key={i} className="py-2 text-center font-bold text-yellow-400 text-lg">{s}</td>
                ))}
              </tr>
              <tr className="border-t border-green-800">
                <td className="py-1.5 text-xs text-green-500 uppercase">{t('target')}</td>
                {totalScores.map((s, i) => (
                  <td key={i} className="py-1.5 text-center text-sm">
                    {s >= targetScore ? <span className="text-yellow-400 font-bold">{targetScore} ✓</span> : <span className="text-green-700">{targetScore}</span>}
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
