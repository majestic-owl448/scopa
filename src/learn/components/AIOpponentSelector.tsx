type Props = {
  maxTier: number         // from learnStore.getAvailableStrategyTiers()
  onSelect: (tier: number) => void
}

const CONFIGURATIONS = [
  { tier: 1,  label: 'Beginner',     knows: 'Basic captures only (S1)' },
  { tier: 4,  label: 'Developing',   knows: 'Captures, key cards, scopa, ori/carte (S1–S4)' },
  { tier: 7,  label: 'Intermediate', knows: '+ Primiera, smart discard, scopa blocking (S1–S7)' },
  { tier: 10, label: 'Advanced',     knows: '+ Key card protection, suit coverage, landscape (S1–S10)' },
  { tier: 12, label: 'Expert',       knows: 'Full strategy: dynamic threshold + lookahead (S1–S12)' },
]

export default function AIOpponentSelector({ maxTier, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-green-300 mb-1">Choose AI Opponent</div>
      {CONFIGURATIONS.map(({ tier, label, knows }) => {
        const unlocked = maxTier >= tier
        return (
          <button
            key={tier}
            onClick={unlocked ? () => onSelect(tier) : undefined}
            disabled={!unlocked}
            className={`text-left rounded-lg border p-3 transition-colors ${
              unlocked
                ? 'bg-gray-800 border-yellow-600 hover:bg-gray-700 cursor-pointer'
                : 'bg-gray-900 border-gray-700 text-gray-500 cursor-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                {label}
              </span>
              {!unlocked && (
                <span className="text-xs text-gray-600">Complete S{tier} to unlock</span>
              )}
            </div>
            <div className={`text-xs mt-0.5 ${unlocked ? 'text-green-400' : 'text-gray-600'}`}>
              {knows}
            </div>
          </button>
        )
      })}
    </div>
  )
}
