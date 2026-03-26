import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DeckStyle = 'french' | 'uno' | 'napoletane'
// french and uno use SVG sprites; napoletane uses individual JPGs

export type Language = 'en' | 'it'

export type GameStats = {
  gamesPlayed: number
  gamesWon: number       // human player won
  gamesLost: number      // human player lost
  handsPlayed: number
  scopeScored: number    // total scope points across all games
  settebelloCaptures: number
}

function detectLanguage(): Language {
  const lang = navigator.language.slice(0, 2)
  return lang === 'it' ? 'it' : 'en'
}

interface SettingsStore {
  deckStyle: DeckStyle
  setDeckStyle: (s: DeckStyle) => void
  language: Language
  setLanguage: (lang: Language) => void
  stats: GameStats
  recordGameResult: (won: boolean, handsPlayed: number, scope: number, settebello: number) => void
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  handsPlayed: 0,
  scopeScored: 0,
  settebelloCaptures: 0,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      deckStyle: 'napoletane',
      setDeckStyle: (deckStyle) => set({ deckStyle }),
      language: detectLanguage(),
      setLanguage: (language) => set({ language }),
      stats: DEFAULT_STATS,
      recordGameResult: (won, handsPlayed, scope, settebello) =>
        set(s => ({
          stats: {
            gamesPlayed: s.stats.gamesPlayed + 1,
            gamesWon: s.stats.gamesWon + (won ? 1 : 0),
            gamesLost: s.stats.gamesLost + (won ? 0 : 1),
            handsPlayed: s.stats.handsPlayed + handsPlayed,
            scopeScored: s.stats.scopeScored + scope,
            settebelloCaptures: s.stats.settebelloCaptures + settebello,
          },
        })),
    }),
    { name: 'scopa_prefs' }
  )
)
