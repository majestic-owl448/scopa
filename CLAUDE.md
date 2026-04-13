# Scopa

Web-based implementation of the traditional Italian card game Scopa.

Current app status: single-player vs CPU is fully playable, with multiple rule variants, bilingual UI (English/Italian), persistent player stats, and an educational Learn mode with guided nodes, practice questions, and challenge scenarios.

## Tech Stack

- TypeScript 5.4, React 18.3, React Router 6 (`HashRouter`)
- Vite 5.3 (`base: /scopa/` for GitHub Pages)
- Tailwind CSS 3.4, Framer Motion 11
- Zustand 4.5 with persistence middleware
- i18next + react-i18next (namespaces: `common`, `rules`, `game`, `learn`, `ai_reasons`)

## Commands

```bash
npm run dev      # start dev server
npm run lint     # run ESLint
npm run test     # run Vitest
npm run build    # type-check + production build
npm run preview  # preview production build locally
```

Validation status:

- `npm run lint` passes.
- `npm run test` passes.
- `npm run build` passes.

## Gameplay Features

- Player counts: 2, 3, or 4 (1 human + CPU opponents)
- CPU difficulty levels: easy, medium, hard
- Capture rules: rank match, sum-to-15, sum-to-11
- Primiera modes: standard, veneto, milano
- Rule variants:
  - Rosmarino
  - Re Bello
  - Settanta
  - Scopa d'Assi
  - Ace scores scopa (requires Scopa d'Assi)
  - Napola
  - Inversa
- Deck styles: Napoletane, French, Colorful/Uno
- In-game overlays: hand summary, full scoreboard, rules reference, AI debug panel (env-guarded)

## Learn Mode Features

- Node-based progression map with prerequisite unlocking
- Guided steps + practice questions per node
- Authored challenge scenarios unlocked from completed nodes
- Procedural challenge fallback for strategy tiers
- Learn progress persisted in local storage

## Persistence

- `scopa_game`: active game state and mode
- `scopa_prefs`: deck style, language, cumulative stats
- `scopa_learn`: node/challenge progress and practice completion

## Project Structure

- `src/pages/` - main game routes (`Home`, `Setup`, `Deal`, `Game`, `Rules`, `Stats`, `GameOver`)
- `src/components/` - shared UI (`CardView`, `Scoreboard`, `HandSummary`, `AIDebugPanel`)
- `src/engine/` - game logic core (`reducer`, `ai`, `captures`, `scoring`, `dealing`, `deck`, `config`, `types`)
- `src/store/` - app stores (`gameStore`, `settingsStore`)
- `src/learn/` - Learn mode pages/components/data/store/utils
- `src/locales/` - English and Italian translation namespaces

## Notes

- Route-level lazy loading is enabled in `src/App.tsx` to reduce initial JS payload.
- The app is configured for deployment to GitHub Pages at `/scopa/`.
