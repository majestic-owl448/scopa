import { useSettingsStore } from '../store/settingsStore.ts'
import type { DeckStyle } from '../store/settingsStore.ts'

export const SUIT_SYMBOLS: Record<DeckStyle, Record<string, string>> = {
  napoletane: { cups: '🏆', swords: '🗡️', coins: '🪙', clubs: '🪄' },
  uno:        { cups: '🟥', coins: '🟨', clubs: '🟩', swords: '🟦' },
  french:     { coins: '♦', cups: '♥', swords: '♠', clubs: '♣' },
}

export function rankLabelForDeck(rank: number, deckStyle: DeckStyle): string {
  if (deckStyle === 'napoletane' || deckStyle === 'uno') return String(rank)
  if (rank === 1) return 'A'
  if (rank === 8) return 'J'
  if (rank === 9) return 'Q'
  if (rank === 10) return 'K'
  return String(rank)
}

export function useCardLabel() {
  const deckStyle = useSettingsStore(s => s.deckStyle)
  const suitSymbols = SUIT_SYMBOLS[deckStyle]

  function rankLabel(rank: number): string {
    return rankLabelForDeck(rank, deckStyle)
  }

  function cardLabel(rank: number, suit: string): string {
    return `${rankLabel(rank)}${suitSymbols[suit] ?? ''}`
  }

  function cardLabelFromId(id: string): string {
    const [suit, rankStr] = id.split('-')
    const rank = parseInt(rankStr ?? '0', 10)
    return cardLabel(rank, suit ?? '')
  }

  /** Replace {{card:suit-rank}} tokens in text with deck-aware labels */
  function resolveCardTokens(text: string): string {
    return text.replace(/\{\{card:([^}]+)\}\}/g, (_, id: string) => cardLabelFromId(id))
  }

  return { rankLabel, cardLabel, cardLabelFromId, resolveCardTokens, suitSymbols, deckStyle }
}
