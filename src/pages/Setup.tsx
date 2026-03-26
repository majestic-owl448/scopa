import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { useSettingsStore } from '../store/settingsStore.ts'
import type { GameConfig } from '../engine'
import { useCardLabel } from '../utils/cardLabel.ts'
import { useTranslation } from 'react-i18next'

type VariantKey = 'rosmarino' | 'reBello' | 'settanta' | 'scopaDAssi' | 'aceScoresScopa' | 'napola' | 'inversa'

export default function Setup() {
  const navigate = useNavigate()
  const startGame = useGameStore(s => s.startGame)
  const { deckStyle, setDeckStyle } = useSettingsStore()
  const { cardLabel } = useCardLabel()
  const { t } = useTranslation('game')

  const VARIANT_INFO: Record<VariantKey, { label: string; desc: string }> = {
    rosmarino:      { label: 'Rosmarino',          desc: t('rosmarino_desc', { card: cardLabel(8, 'swords') }) },
    reBello:        { label: 'Re Bello',            desc: t('re_bello_desc', { card: cardLabel(10, 'coins') }) },
    settanta:       { label: 'Settanta',            desc: t('settanta_desc') },
    scopaDAssi:     { label: "Scopa d'Assi",        desc: t('scopa_d_assi_desc') },
    aceScoresScopa: { label: 'Ace scores scopa',    desc: t('ace_scores_scopa_desc') },
    napola:         { label: 'Napola',              desc: t('napola_desc', { a1: cardLabel(1, 'coins'), a2: cardLabel(2, 'coins'), a3: cardLabel(3, 'coins') }) },
    inversa:        { label: 'Inversa',             desc: t('inversa_desc') },
  }

  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [variants, setVariants] = useState<Record<VariantKey, boolean>>({
    rosmarino: false,
    reBello: false,
    settanta: false,
    scopaDAssi: false,
    aceScoresScopa: false,
    napola: false,
    inversa: false,
  })
  const [primieraValues, setPrimieraValues] = useState<'standard' | 'veneto' | 'milano'>('standard')
  const [captureTarget, setCaptureTarget] = useState<'rank' | 'quindici' | 'undici'>('rank')

  const validHandSizes: Record<number, number[]> = {
    2: [3, 6, 9, 18],
    3: [3, 6],
    4: [3, 9],
  }
  const handSizeOptions = validHandSizes[playerCount] ?? [3]
  const [cardsPerHand, setCardsPerHand] = useState<number>(3)

  function handleStart() {
    const config: GameConfig = {
      playerCount,
      cardsPerHand: cardsPerHand as 3 | 6 | 9 | 18,
      primieraValues,
      captureTarget,
      ...variants,
    }
    const names = [t('common:you'), ...Array.from({ length: playerCount - 1 }, (_, i) => t('common:cpu', { n: i + 1 }))]
    startGame(config, names, 1, difficulty)
    navigate('/play/deal')
  }

  function toggle(key: VariantKey) {
    setVariants(v => {
      const next = { ...v, [key]: !v[key] }
      // Mutual exclusions
      if (key === 'inversa' && next.inversa) {
        next.scopaDAssi = false
        next.aceScoresScopa = false
      }
      if (key === 'scopaDAssi' && !next.scopaDAssi) {
        next.aceScoresScopa = false
      }
      if (key === 'settanta' && next.settanta && primieraValues === 'milano') {
        setPrimieraValues('standard')
      }
      return next
    })
  }

  function handlePrimieraChange(val: 'standard' | 'veneto' | 'milano') {
    if (val === 'milano') {
      setVariants(v => ({ ...v, settanta: false }))
    }
    setPrimieraValues(val)
  }

  const difficultyDesc = difficulty === 'easy' ? t('easy_desc') : difficulty === 'medium' ? t('medium_desc') : t('hard_desc')
  const captureDesc = captureTarget === 'rank' ? t('capture_rule_rank_desc')
    : captureTarget === 'quindici' ? t('capture_rule_quindici_desc')
    : t('capture_rule_undici_desc')

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 min-h-dvh pb-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-green-300 hover:text-white">{t('common:back')}</button>
        <h2 className="text-2xl font-bold">{t('game_setup')}</h2>
      </div>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('players')}</h3>
        <div className="flex gap-2">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => { setPlayerCount(n as 2|3|4); setCardsPerHand(3) }}
              className={`flex-1 py-2 rounded font-bold ${playerCount === n ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
            >
              {n}P
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('cards_per_hand')}</h3>
        <div className="flex gap-2">
          {handSizeOptions.map(n => (
            <button
              key={n}
              onClick={() => setCardsPerHand(n)}
              className={`flex-1 py-2 rounded font-bold ${cardsPerHand === n ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('cpu_difficulty')}</h3>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded font-bold ${difficulty === d ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
            >
              {t(d)}
            </button>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-1">{difficultyDesc}</p>
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('capture_rule')}</h3>
        <div className="flex gap-2">
          {([
            ['rank', t('standard'), t('match_by_rank')],
            ['quindici', t('quindici'), t('cards_sum_15')],
            ['undici', t('undici'), t('cards_sum_11')],
          ] as const).map(([val, label, hint]) => (
            <button
              key={val}
              onClick={() => setCaptureTarget(val)}
              className={`flex-1 py-2 rounded font-bold text-sm ${captureTarget === val ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
              title={hint}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-1">{captureDesc}</p>
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('primiera_values')}</h3>
        <div className="flex gap-2">
          {([
            ['standard', t('primiera_standard'), t('primiera_standard_hint')],
            ['veneto', t('primiera_veneto'), t('primiera_veneto_hint')],
            ['milano', t('primiera_milano'), t('primiera_milano_hint')],
          ] as const).map(([val, label, hint]) => (
            <button
              key={val}
              onClick={() => handlePrimieraChange(val)}
              className={`flex-1 py-2 rounded font-bold text-sm ${primieraValues === val ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
              title={hint}
            >
              {label}
            </button>
          ))}
        </div>
        {primieraValues === 'milano' && (
          <p className="text-xs text-orange-500 mt-1">{t('milano_disables_settanta')}</p>
        )}
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('variants')}</h3>
        <div className="flex flex-col gap-2">
          {(Object.keys(variants) as VariantKey[]).map(key => {
            const disabled = (key === 'aceScoresScopa' && !variants.scopaDAssi)
            const blocked = (key === 'scopaDAssi' && variants.inversa) || (key === 'inversa' && variants.scopaDAssi)
            return (
              <label
                key={key}
                className={`flex items-start gap-3 ${disabled || blocked ? 'opacity-50' : 'cursor-pointer'}`}
              >
                <input
                  type="checkbox"
                  checked={variants[key]}
                  onChange={() => !disabled && toggle(key)}
                  disabled={disabled}
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <div>
                  <span className="font-semibold text-sm">{VARIANT_INFO[key].label}</span>
                  {key === 'aceScoresScopa' && !variants.scopaDAssi && (
                    <span className="text-xs text-green-700 ml-2">{t('requires_scopa_d_assi')}</span>
                  )}
                  <p className="text-xs text-green-500">{VARIANT_INFO[key].desc}</p>
                </div>
              </label>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase text-green-400 mb-2">{t('card_style')}</h3>
        <div className="flex gap-2">
          {([
            ['napoletane', t('naples'), t('naples_hint')],
            ['french', t('french'), t('french_hint')],
            ['uno', t('colorful'), t('colorful_hint')],
          ] as const).map(([val, label, hint]) => (
            <button
              key={val}
              onClick={() => setDeckStyle(val)}
              className={`flex-1 py-2 rounded font-bold text-sm ${deckStyle === val ? 'bg-yellow-500 text-black' : 'bg-green-800 hover:bg-green-700'}`}
              title={hint}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleStart}
        className="mt-auto py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
      >
        {t('common:start_game')}
      </button>
    </div>
  )
}
