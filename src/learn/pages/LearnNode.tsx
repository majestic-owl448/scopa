import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLearnStore } from '../store/learnStore.ts'
import { useSettingsStore } from '../../store/settingsStore.ts'
import { LEARN_NODES } from '../data/nodes.ts'
import { getProblemsByNode } from '../data/problems/index.ts'
import GuidedStep from '../components/GuidedStep.tsx'
import PracticeQuestion from '../components/PracticeQuestion.tsx'
import ChallengePlayer from '../components/ChallengePlayer.tsx'
import { useCardLabel } from '../../utils/cardLabel.ts'

type Part = 'guide-text' | 'guided' | 'practice' | 'challenges' | 'complete'

// Renders guideText with basic markdown: **bold**, newlines → paragraphs, {{card:...}} → deck-aware labels
function GuideTextView({ text, onContinue }: { text: string; onContinue: () => void }) {
  const { resolveCardTokens } = useCardLabel()
  const resolved = resolveCardTokens(text)
  const paragraphs = resolved.split('\n\n')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {paragraphs.map((para, i) => {
          // Render **bold** inline
          const parts = para.split(/(\*\*[^*]+\*\*)/)
          return (
            <p key={i} className="text-sm text-green-100 leading-relaxed">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                  : <span key={j}>{part}</span>
              )}
            </p>
          )
        })}
      </div>
      <button
        onClick={onContinue}
        className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 mt-2"
      >
        Got it →
      </button>
    </div>
  )
}

export default function LearnNode() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()
  const { getNodeState, markGuidedStepDone, markPracticeCorrect, markChallengeSolved, markChallengeAttempted } = useLearnStore()
  const { deckStyle, setDeckStyle } = useSettingsStore()

  const node = LEARN_NODES.find(n => n.id === nodeId)
  const allProblems = nodeId ? getProblemsByNode(nodeId) : []
  const guidedProblem = allProblems.find(p => p.type === 'practice') ?? null
  const practiceProblems = allProblems.filter(p => p.type === 'practice')
  const challengeProblems = allProblems.filter(p => p.type === 'challenge')

  // Determine starting part
  const initialPart: Part = node?.guideText ? 'guide-text' : guidedProblem ? 'guided' : 'practice'
  const [part, setPart] = useState<Part>(initialPart)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [challengeIndex, setChallengeIndex] = useState(0)

  if (!node || !nodeId) {
    return (
      <div className="flex flex-col min-h-dvh items-center justify-center p-4">
        <p className="text-red-400">Node not found.</p>
        <button onClick={() => navigate('/learn')} className="mt-4 text-green-400 hover:text-white underline text-sm">
          ← Back to Learn
        </button>
      </div>
    )
  }

  const nodeState = getNodeState(nodeId)
  if (nodeState === 'locked') {
    return (
      <div className="flex flex-col min-h-dvh items-center justify-center p-4">
        <p className="text-gray-400">This node is locked. Complete its prerequisites first.</p>
        <button onClick={() => navigate('/learn')} className="mt-4 text-green-400 hover:text-white underline text-sm">
          ← Back to Learn
        </button>
      </div>
    )
  }

  function afterGuideText() {
    if (guidedProblem) {
      setPart('guided')
    } else if (practiceProblems.length > 0) {
      setPart('practice')
    } else {
      // Informational-only node: mark complete immediately
      markGuidedStepDone(nodeId!)
      markPracticeCorrect(nodeId!, 0, 0)
      setPart('complete')
    }
  }

  function handleGuidedComplete() {
    markGuidedStepDone(nodeId!)
    if (practiceProblems.length > 0) {
      setPart('practice')
    } else if (challengeProblems.length > 0 && node!.hasChallenges) {
      setPart('challenges')
    } else {
      setPart('complete')
    }
  }

  function handlePracticeCorrect() {
    markPracticeCorrect(nodeId!, practiceIndex, practiceProblems.length)
    const next = practiceIndex + 1
    if (next < practiceProblems.length) {
      setPracticeIndex(next)
    } else if (challengeProblems.length > 0 && node!.hasChallenges) {
      setPart('challenges')
    } else {
      setPart('complete')
    }
  }

  function handleChallengeComplete(solved: boolean) {
    const problem = challengeProblems[challengeIndex]
    if (problem) {
      if (solved) markChallengeSolved(problem.id)
      else markChallengeAttempted(problem.id)
    }
    const next = challengeIndex + 1
    if (next < challengeProblems.length) {
      setChallengeIndex(next)
    } else {
      setPart('complete')
    }
  }

  // Build progress bar steps (only show relevant parts)
  const steps: Part[] = [
    ...(node.guideText ? ['guide-text' as const] : []),
    ...(guidedProblem ? ['guided' as const] : []),
    ...(practiceProblems.length > 0 ? ['practice' as const] : []),
    ...(node.hasChallenges && challengeProblems.length > 0 ? ['challenges' as const] : []),
  ]
  const stepLabels: Record<string, string> = {
    'guide-text': 'Read',
    guided: 'Demo',
    practice: 'Practice',
    challenges: 'Challenges',
  }
  const partOrder = ['guide-text', 'guided', 'practice', 'challenges', 'complete']
  const currentIndex = partOrder.indexOf(part)

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto p-4 gap-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/learn')} className="text-green-500 hover:text-white text-sm">
          ←
        </button>
        <div className="flex-1">
          <span className="text-xs font-mono text-green-500">{node.id}</span>
          <h1 className="text-lg font-bold">{node.name.en}</h1>
        </div>
        <button
          onClick={() => {
            const styles = ['napoletane', 'french', 'uno'] as const
            const idx = styles.indexOf(deckStyle as 'napoletane' | 'french' | 'uno')
            setDeckStyle(styles[(idx + 1) % styles.length]!)
          }}
          className="text-xs text-green-600 hover:text-green-400 underline shrink-0"
          title="Switch deck style"
        >
          {deckStyle === 'napoletane' ? 'Na' : deckStyle === 'french' ? 'Fr' : 'Col'}
        </button>
      </div>

      {/* Progress indicator */}
      {steps.length > 0 && (
        <div className="flex gap-1 text-xs">
          {steps.map((step) => {
            const stepIndex = partOrder.indexOf(step)
            const isDone = currentIndex > stepIndex
            const isCurrent = part === step
            return (
              <span
                key={step}
                className={`px-2 py-0.5 rounded font-semibold ${
                  isCurrent ? 'bg-yellow-500 text-black' :
                  isDone ? 'bg-green-800 text-green-300' :
                  'bg-gray-800 text-gray-500'
                }`}
              >
                {stepLabels[step] ?? step}
              </span>
            )
          })}
        </div>
      )}

      {/* Content */}
      {part === 'guide-text' && node.guideText && (
        <GuideTextView text={node.guideText.en} onContinue={afterGuideText} />
      )}

      {part === 'guided' && guidedProblem && (
        <GuidedStep problem={guidedProblem} onComplete={handleGuidedComplete} />
      )}

      {part === 'practice' && practiceProblems[practiceIndex] && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-green-500 text-right">
            Question {practiceIndex + 1} / {practiceProblems.length}
          </div>
          <PracticeQuestion
            key={practiceProblems[practiceIndex]!.id}
            problem={practiceProblems[practiceIndex]!}
            onCorrect={handlePracticeCorrect}
          />
        </div>
      )}

      {part === 'challenges' && challengeProblems[challengeIndex] && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-green-500 text-right">
            Challenge {challengeIndex + 1} / {challengeProblems.length}
          </div>
          <ChallengePlayer
            key={challengeProblems[challengeIndex]!.id}
            problem={challengeProblems[challengeIndex]!}
            onComplete={handleChallengeComplete}
          />
        </div>
      )}

      {part === 'complete' && (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="text-4xl">🎉</div>
          <div className="text-xl font-bold text-green-400">{node.name.en} complete!</div>
          <p className="text-sm text-green-300 text-center">
            New nodes may now be unlocked on the Learn map.
          </p>
          <button
            onClick={() => navigate('/learn')}
            className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
          >
            Back to Learn map
          </button>
        </div>
      )}
    </div>
  )
}
