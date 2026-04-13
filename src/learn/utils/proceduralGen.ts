import type { GameConfig } from '../../engine'
import { createDeck, shuffle, findCaptures, evaluateAllPlays } from '../../engine'
import type { TrainerProblem } from '../types.ts'
import { DEPENDENCY_MAP } from '../data/nodes.ts'

// Minimum score gap between best and second-best play for a quality challenge
const MIN_SCORE_GAP = 0.5

/**
 * Generate a single procedural challenge for a given node.
 * Returns null if quality check fails after several attempts.
 *
 * NOTE: The `modules` filtering in evaluateAllPlays is not yet implemented in the engine —
 * all strategies are applied regardless of the modules parameter. Procedural generation
 * will work correctly once module filtering is implemented.
 */
export function generateChallenge(
  nodeId: string,
  config: GameConfig,
): TrainerProblem | null {
  const modules = collectModules(nodeId)
  const MAX_ATTEMPTS = 20

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const state = generateState(config)
    if (!state) continue

    const { hand, table, capturedPiles } = state

    // Build a minimal AIVisibleState for evaluation
    const visible = buildVisible(hand, table, capturedPiles, config)
    const plays = evaluateAllPlays(visible, modules)

    if (!meetsQualityBar(plays)) continue

    const best = plays[0]!
    const problem: TrainerProblem = {
      id: `proc-${nodeId}-${Date.now()}-${attempt}`,
      nodeId,
      type: 'challenge',
      requiredNodes: DEPENDENCY_MAP[nodeId] ?? [],
      config,
      playerIndex: 0,
      title: { en: `${nodeId} Challenge`, it: `Sfida ${nodeId}` },
      description: { en: 'What is the best play in this position?', it: 'Qual è la mossa migliore in questa posizione?' },
      hand,
      table,
      capturedPiles,
      correctPlay: {
        cardId: best.cardId,
        captureIds: best.captureIds,
      },
      explanation: {
        en: `Best play: ${best.priorityKey}. ${best.reasonKey}`,
        it: `Mossa migliore: ${best.priorityKey}. ${best.reasonKey}`,
      },
      helpHints: buildHints(plays),
      rankedPlays: plays.slice(0, 4).map(p => ({
        cardId: p.cardId,
        captureIds: p.captureIds,
        priority: { en: p.priorityKey, it: p.priorityKey },
        reason: { en: p.reasonKey, it: p.reasonKey },
      })),
    }

    return problem
  }

  return null
}

/**
 * Generate 2–3 variations of a base state by modifying captured pile context.
 * Returns null if no variation changes the optimal move (makes for a poor same-situation set).
 */
export function generateSameSituationSet(
  nodeId: string,
  config: GameConfig
): TrainerProblem[] | null {
  const base = generateChallenge(nodeId, config)
  if (!base) return null

  const variations: TrainerProblem[] = [base]

  // Produce variations by re-generating with fresh random states
  for (let i = 1; i <= 2; i++) {
    const variant = generateChallenge(nodeId, config)
    if (!variant) continue
    // Only keep if the best play differs from the base
    if (
      variant.correctPlay.cardId !== base.correctPlay.cardId ||
      variant.correctPlay.captureIds.join(',') !== base.correctPlay.captureIds.join(',')
    ) {
      variations.push(variant)
    }
  }

  if (variations.length < 2) return null
  return variations
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function collectModules(nodeId: string): string[] {
  const prereqs = DEPENDENCY_MAP[nodeId] ?? []
  return [nodeId, ...prereqs].filter(id => /^S\d+$/.test(id))
}

function generateState(config: GameConfig) {
  const deck = shuffle(createDeck())
  const handSize = 2 + Math.floor(Math.random() * 2) // 2 or 3 cards
  const tableSize = 3 + Math.floor(Math.random() * 4) // 3–6 cards

  if (deck.length < handSize + tableSize) return null

  const hand = deck.splice(0, handSize)
  const table = deck.splice(0, tableSize)
  const capturedPiles: typeof hand[] = Array.from({ length: config.playerCount }, () => [])

  // Ensure at least one capture exists
  const hasCapture = hand.some(card => findCaptures(card, table, config).length > 0)
  if (!hasCapture) return null

  return { hand, table, capturedPiles }
}

function buildVisible(
  hand: ReturnType<typeof createDeck>,
  table: ReturnType<typeof createDeck>,
  capturedPiles: ReturnType<typeof createDeck>[],
  config: GameConfig
) {
  return {
    myHand: hand,
    table,
    scopeCards: capturedPiles.map(() => []),
    scopeCounts: capturedPiles.map(() => 0),
    settebelloHolder: null,
    reBelloHolder: null,
    totalScores: capturedPiles.map(() => 0),
    handNumber: 1,
    capturedCounts: capturedPiles.map(p => p.length),
    coinsCounts: capturedPiles.map(p => p.filter(c => c.suit === 'coins').length),
    allCaptured: capturedPiles,
    seenCards: capturedPiles.flat(),
    unseenCards: [],
    myPlayerIndex: 0,
    playerHandCounts: capturedPiles.map(() => 3),
    difficulty: 'hard' as const,
    config,
  }
}

function meetsQualityBar(plays: ReturnType<typeof evaluateAllPlays>): boolean {
  if (plays.length < 2) return false
  const gap = plays[0]!.score - plays[1]!.score
  return gap >= MIN_SCORE_GAP
}

function buildHints(
  plays: ReturnType<typeof evaluateAllPlays>
): { en: string; it: string }[] {
  const hints: { en: string; it: string }[] = []
  if (plays[0]) {
    hints.push({
      en: `The best play category is: ${plays[0].priorityKey}`,
      it: `La categoria della mossa migliore è: ${plays[0].priorityKey}`,
    })
  }
  return hints
}
