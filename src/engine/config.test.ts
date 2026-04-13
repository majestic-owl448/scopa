import { describe, it, expect } from 'vitest'
import { validateGameConfig, targetScore } from './config.ts'

describe('config validation', () => {
  it('flags mutually exclusive variants', () => {
    const errors = validateGameConfig({
      playerCount: 2,
      cardsPerHand: 3,
      rosmarino: false,
      reBello: false,
      settanta: true,
      primieraValues: 'milano',
      captureTarget: 'rank',
      inversa: true,
      scopaDAssi: true,
      aceScoresScopa: false,
      napola: false,
    })

    expect(errors.some(e => e.includes('Settanta'))).toBe(true)
    expect(errors.some(e => e.includes('Scopa Inversa'))).toBe(true)
  })

  it('returns expected target score per player count', () => {
    expect(targetScore(2)).toBe(11)
    expect(targetScore(3)).toBe(16)
    expect(targetScore(4)).toBe(21)
  })
})
