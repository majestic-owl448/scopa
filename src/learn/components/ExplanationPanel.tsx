import type { TrainerProblem } from '../types.ts'
import CardView from '../../components/CardView.tsx'
import { useCardLabel } from '../../utils/cardLabel.ts'

type Props = {
  playerPlay: { cardId: string; captureIds: string[] }
  problem: TrainerProblem
  onRetry?: () => void
  onNext: () => void
}

export default function ExplanationPanel({ playerPlay, problem, onRetry, onNext }: Props) {
  const { resolveCardTokens } = useCardLabel()
  const allCards = [...problem.hand, ...problem.table]
  const correct = playerPlay.cardId === problem.correctPlay.cardId &&
    playerPlay.captureIds.length === problem.correctPlay.captureIds.length &&
    problem.correctPlay.captureIds.every(id => playerPlay.captureIds.includes(id))

  function getCard(id: string) {
    return allCards.find(c => c.id === id) ?? null
  }

  return (
    <div className="bg-fcc-secondary-bg border border-fcc-quaternary-bg rounded-xl p-4 flex flex-col gap-4">
      {/* Result banner */}
      <div className={`text-center font-bold text-lg ${correct ? 'text-fcc-green' : 'text-fcc-red'}`}>
        {correct ? '✓ Correct!' : '✗ Not the best play'}
      </div>

      {/* Explanation */}
      <div className="text-sm text-fcc-secondary-fg leading-relaxed">
        {resolveCardTokens(problem.explanation.en)}
      </div>

      {/* Best play */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-fcc-green uppercase tracking-wide font-semibold">Best play</div>
        <div className="flex items-center gap-2 flex-wrap">
          {getCard(problem.correctPlay.cardId) && (
            <CardView card={getCard(problem.correctPlay.cardId)} size="sm" />
          )}
          {problem.correctPlay.captureIds.length > 0 ? (
            <>
              <span className="text-fcc-muted text-xs">captures</span>
              {problem.correctPlay.captureIds.map(id => (
                <CardView key={id} card={getCard(id)} size="sm" />
              ))}
            </>
          ) : (
            <span className="text-fcc-muted text-xs italic">discard</span>
          )}
        </div>
      </div>

      {/* Ranked plays */}
      {problem.rankedPlays.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs text-fcc-green uppercase tracking-wide font-semibold">All options ranked</div>
          {problem.rankedPlays.map((play, i) => (
            <div key={i} className="flex items-start gap-2 bg-fcc-tertiary-bg rounded-lg p-2">
              <span className="text-xs text-fcc-muted font-mono shrink-0">#{i + 1}</span>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  {getCard(play.cardId) && <CardView card={getCard(play.cardId)} size="sm" />}
                  {play.captureIds.map(id => (
                    <CardView key={id} card={getCard(id)} size="sm" />
                  ))}
                  {play.captureIds.length === 0 && (
                    <span className="text-xs text-fcc-muted italic">discard</span>
                  )}
                </div>
                <div className="text-xs text-fcc-yellow font-semibold">{resolveCardTokens(play.priority.en)}</div>
                <div className="text-xs text-fcc-quaternary-fg">{resolveCardTokens(play.reason.en)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {onRetry && !correct && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm border border-fcc-quaternary-bg text-fcc-green rounded-lg hover:bg-fcc-secondary-bg/40"
          >
            Try again
          </button>
        )}
        <button
          onClick={onNext}
          className="px-6 py-2 text-sm bg-fcc-yellow-gold text-fcc-primary-bg font-bold rounded-lg hover:bg-fcc-yellow"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
