import type { RoundScore, Card, GameConfig } from '../engine'
import { PRIMIERA_VALUES_STANDARD, PRIMIERA_VALUES_VENETO } from '../engine'
import CardView from './CardView.tsx'
import { useCardLabel } from '../utils/cardLabel.ts'
import { useTranslation } from 'react-i18next'

const SUITS = ['coins', 'cups', 'swords', 'clubs'] as const
const SUIT_COLOR: Record<string, string> = {
  coins: 'text-yellow-400', cups: 'text-red-400', swords: 'text-gray-300', clubs: 'text-green-400',
}

function Check() {
  return <span className="text-green-400 font-bold">✓</span>
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-green-800">
      <td className="py-1.5 pr-3 text-green-400 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{label}</td>
      {children}
    </tr>
  )
}

function Cell({ children, winner }: { children: React.ReactNode; winner?: boolean }) {
  return (
    <td className={`py-1.5 px-2 text-sm text-center ${winner ? 'font-bold text-white' : 'text-green-300'}`}>
      {children}
    </td>
  )
}

type PlayerLike = { id: string; name: string; captured: Card[] }

type Props = {
  roundScores: RoundScore[]
  players: PlayerLike[]
  config: GameConfig
  handNumber: number
  totalScores: number[]
  onDismiss: () => void
}

export default function HandSummary({ roundScores, players, config, handNumber, totalScores, onDismiss }: Props) {
  const primValues = config.primieraValues === 'veneto' ? PRIMIERA_VALUES_VENETO : PRIMIERA_VALUES_STANDARD
  const { rankLabel, cardLabel, suitSymbols } = useCardLabel()
  const { t } = useTranslation('game')

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
      <div className="bg-gray-900 rounded-xl border border-green-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-green-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">{t('hand_summary_title', { n: handNumber })}</h2>
          <button
            onClick={onDismiss}
            className="px-4 py-1.5 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 text-sm"
          >
            {t('common:continue_arrow')}
          </button>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-green-500 text-xs uppercase">
                <th className="text-left pb-2"></th>
                {players.map(p => (
                  <th key={p.id} className="text-center pb-2 text-green-300 font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Scope */}
              <Row label={t('scope')}>
                {roundScores.map((rs, i) => (
                  <Cell key={i} winner={rs.scope > 0}>
                    {rs.scope > 0 ? `${rs.scope} pt${rs.scope > 1 ? 's' : ''}` : '—'}
                  </Cell>
                ))}
              </Row>

              {/* Settebello */}
              <Row label={t('settebello')}>
                {roundScores.map((rs, i) => (
                  <Cell key={i} winner={rs.settebello}>
                    {rs.settebello ? <><Check /> <span className="text-yellow-400">{cardLabel(7, 'coins')}</span></> : '—'}
                  </Cell>
                ))}
              </Row>

              {/* Re Bello */}
              {config.reBello && (
                <Row label={t('re_bello')}>
                  {roundScores.map((rs, i) => (
                    <Cell key={i} winner={rs.reBello}>
                      {rs.reBello ? <><Check /> <span className="text-yellow-400">{cardLabel(10, 'coins')}</span></> : '—'}
                    </Cell>
                  ))}
                </Row>
              )}

              {/* Rosmarino */}
              {config.rosmarino && (
                <Row label={t('rosmarino')}>
                  {roundScores.map((rs, i) => (
                    <Cell key={i} winner={rs.rosmarino}>
                      {rs.rosmarino ? <><Check /> <span className="text-gray-300">{cardLabel(8, 'swords')}</span></> : '—'}
                    </Cell>
                  ))}
                </Row>
              )}

              {/* Carte */}
              <Row label={t('carte')}>
                {roundScores.map((rs, i) => (
                  <Cell key={i} winner={rs.carte}>
                    {t('n_cards', { n: players[i]!.captured.length })} {rs.carte ? <Check /> : ''}
                  </Cell>
                ))}
              </Row>

              {/* Ori */}
              <Row label={t('ori')}>
                {roundScores.map((rs, i) => (
                  <Cell key={i} winner={rs.ori}>
                    {t('n_coins', { n: players[i]!.captured.filter(c => c.suit === 'coins').length })} {rs.ori ? <Check /> : ''}
                  </Cell>
                ))}
              </Row>

              {/* Primiera header */}
              <Row label={t('primiera')}>
                {roundScores.map((rs, i) => (
                  <Cell key={i} winner={rs.primiera}>
                    {rs.primiera ? <Check /> : '—'}
                  </Cell>
                ))}
              </Row>

              {/* Primiera per-suit breakdown */}
              {config.primieraValues !== 'milano' && SUITS.map((suit, si) => (
                <tr key={suit} className="bg-gray-950/40">
                  <td className="pl-4 py-0.5 text-xs">
                    <span className={SUIT_COLOR[suit]}>{suitSymbols[suit]}</span>
                  </td>
                  {roundScores.map((rs, pi) => {
                    const card = rs.primieraDetails.bestPerSuit[si]
                    const val = rs.primieraDetails.suitValues[si]
                    return (
                      <td key={pi} className="py-0.5 px-2 text-center">
                        {card ? (
                          <span className="text-xs text-green-300">
                            {rankLabel(card.rank)}
                            <span className={SUIT_COLOR[card.suit]}>{suitSymbols[card.suit]}</span>
                            <span className="text-green-600 ml-1">({val})</span>
                          </span>
                        ) : (
                          <span className="text-green-800 text-xs">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {config.primieraValues !== 'milano' && (
                <tr className="bg-gray-950/40">
                  <td className="pl-4 py-0.5 text-xs text-green-600">{t('total')}</td>
                  {roundScores.map((rs, i) => (
                    <td key={i} className="py-0.5 px-2 text-center text-xs text-green-300">
                      {rs.primieraDetails.total ?? '—'}
                    </td>
                  ))}
                </tr>
              )}

              {config.primieraValues === 'milano' && roundScores[0]?.primieraDetails.milanoCounts && (
                <>
                  {(['sevens', 'sixes', 'aces'] as const).map(key => (
                    <tr key={key} className="bg-gray-950/40">
                      <td className="pl-4 py-0.5 text-xs text-green-600">{t(key)}</td>
                      {roundScores.map((rs, i) => (
                        <td key={i} className="py-0.5 px-2 text-center text-xs text-green-300">
                          {rs.primieraDetails.milanoCounts?.[key] ?? 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {/* Settanta */}
              {config.settanta && (
                <Row label={t('settanta')}>
                  {roundScores.map((rs, i) => (
                    <Cell key={i} winner={rs.settanta}>
                      {rs.settanta ? <Check /> : '—'}
                    </Cell>
                  ))}
                </Row>
              )}

              {/* Napola */}
              {config.napola && (
                <Row label={t('napola')}>
                  {roundScores.map((rs, i) => (
                    <Cell key={i} winner={rs.napola > 0}>
                      {rs.napola > 0 ? t('pts', { n: rs.napola }) : '—'}
                    </Cell>
                  ))}
                </Row>
              )}

              {/* Hand total */}
              <tr className="border-t-2 border-green-600 bg-green-950/40">
                <td className="py-2 pr-3 text-xs font-bold uppercase text-green-300">{t('hand')}</td>
                {roundScores.map((rs, i) => (
                  <td key={i} className="py-2 px-2 text-center font-bold text-white">
                    +{rs.total}
                  </td>
                ))}
              </tr>

              {/* Running total */}
              <tr className="border-t border-green-800">
                <td className="py-2 pr-3 text-xs font-bold uppercase text-green-300">{t('total')}</td>
                {players.map((_, i) => (
                  <td key={i} className="py-2 px-2 text-center font-bold text-yellow-400 text-lg">
                    {totalScores[i] ?? 0}
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
