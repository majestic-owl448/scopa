import type { TrainerProblem } from '../../types.ts'
import { FOUNDATION_PROBLEMS } from './foundation.ts'
import { STRATEGY_PROBLEMS } from './strategy.ts'
import { VARIANT_PROBLEMS } from './variants.ts'
import { PLAYER_PROBLEMS } from './player.ts'

export const AUTHORED_PROBLEMS: TrainerProblem[] = [
  ...FOUNDATION_PROBLEMS,
  ...STRATEGY_PROBLEMS,
  ...VARIANT_PROBLEMS,
  ...PLAYER_PROBLEMS,
]

export function getProblemsByNode(nodeId: string): TrainerProblem[] {
  return AUTHORED_PROBLEMS.filter(p => p.nodeId === nodeId)
}
