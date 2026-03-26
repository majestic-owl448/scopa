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
    <div className="bg-gray-900 border border-green-700 rounded-xl p-4 flex flex-col gap-4">
      {/* Result banner */}
      <div className={`text-center font-bold text-lg ${correct ? 'text-green-400' : 'text-red-400'}`}>
        {correct ? '✓ Correct!' : '✗ Not the best play'}
      </div>

      {/* Explanation */}
      <div className="text-sm text-green-200 leading-relaxed">
        {resolveCardTokens(problem.explanation.en)}
      </div>

      {/* Best play */}
      <div className="flex flex-col gap-2">
        <div className="text-xs text-green-500 uppercase tracking-wide font-semibold">Best play</div>
        <div className="flex items-center gap-2 flex-wrap">
          {getCard(problem.correctPlay.cardId) && (
            <CardView card={getCard(problem.correctPlay.cardId)} size="sm" />
          )}
          {problem.correctPlay.captureIds.length > 0 ? (
            <>
              <span className="text-green-600 text-xs">captures</span>
              {problem.correctPlay.captureIds.map(id => (
                <CardView key={id} card={getCard(id)} size="sm" />
              ))}
            </>
          ) : (
            <span className="text-green-700 text-xs italic">discard</span>
          )}
        </div>
      </div>

      {/* Ranked plays */}
      {problem.rankedPlays.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs text-green-500 uppercase tracking-wide font-semibold">All options ranked</div>
          {problem.rankedPlays.map((play, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-800 rounded-lg p-2">
              <span className="text-xs text-green-600 font-mono shrink-0">#{i + 1}</span>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  {getCard(play.cardId) && <CardView card={getCard(play.cardId)} size="sm" />}
                  {play.captureIds.map(id => (
                    <CardView key={id} card={getCard(id)} size="sm" />
                  ))}
                  {play.captureIds.length === 0 && (
                    <span className="text-xs text-gray-500 italic">discard</span>
                  )}
                </div>
                <div className="text-xs text-yellow-400 font-semibold">{resolveCardTokens(play.priority.en)}</div>
                <div className="text-xs text-green-300">{resolveCardTokens(play.reason.en)}</div>
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
            className="px-4 py-2 text-sm border border-green-700 text-green-400 rounded-lg hover:bg-green-900/40"
          >
            Try again
          </button>
        )}
        <button
          onClick={onNext}
          className="px-6 py-2 text-sm bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
