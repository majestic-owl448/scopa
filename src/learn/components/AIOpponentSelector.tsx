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
      <div className="text-sm font-semibold text-fcc-quaternary-fg mb-1">Choose AI Opponent</div>
      {CONFIGURATIONS.map(({ tier, label, knows }) => {
        const unlocked = maxTier >= tier
        return (
          <button
            key={tier}
            onClick={unlocked ? () => onSelect(tier) : undefined}
            disabled={!unlocked}
            className={`text-left rounded-lg border p-3 transition-colors ${
              unlocked
                ? 'bg-fcc-tertiary-bg border-fcc-yellow hover:bg-fcc-quaternary-bg cursor-pointer'
                : 'bg-fcc-secondary-bg border-fcc-quaternary-bg text-fcc-muted cursor-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-fcc-muted'}`}>
                {label}
              </span>
              {!unlocked && (
                <span className="text-xs text-fcc-muted">Complete S{tier} to unlock</span>
              )}
            </div>
            <div className={`text-xs mt-0.5 ${unlocked ? 'text-fcc-green' : 'text-fcc-muted'}`}>
              {knows}
            </div>
          </button>
        )
      })}
    </div>
  )
}
