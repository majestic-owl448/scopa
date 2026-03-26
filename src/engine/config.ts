import type { GameConfig, ConfigValidationError } from './types.ts';

export function validateGameConfig(config: GameConfig): ConfigValidationError[] {
  const errors: ConfigValidationError[] = [];

  if (config.settanta && config.primieraValues === 'milano') {
    errors.push("Settanta and Milano primiera are mutually exclusive — disable one before enabling the other");
  }

  if (config.inversa && config.scopaDAssi) {
    errors.push("Scopa Inversa and Scopa d'Assi are mutually exclusive — disable one before enabling the other");
  }

  if (config.aceScoresScopa && !config.scopaDAssi) {
    errors.push("Ace scores scopa requires Scopa d'Assi to be active");
  }

  const validHandSizes: Record<number, number[]> = {
    2: [3, 6, 9, 18],
    3: [3, 6],
    4: [3, 9],
  };
  const valid = validHandSizes[config.playerCount];
  if (!valid || !valid.includes(config.cardsPerHand)) {
    errors.push(`cardsPerHand=${config.cardsPerHand} is not valid for playerCount=${config.playerCount}`);
  }

  return errors;
}

export function targetScore(playerCount: 2 | 3 | 4): number {
  if (playerCount === 2) return 11;
  if (playerCount === 3) return 16;
  return 21;
}
