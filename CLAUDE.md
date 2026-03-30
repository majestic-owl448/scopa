# Scopa

Web-based implementation of the traditional Italian card game Scopa. Single-player vs AI with multiple difficulty levels, game variants, bilingual support (EN/IT), and an educational Learn mode.

## Tech Stack

- TypeScript 5.4, React 18.3, React Router 6 (HashRouter)
- Vite 5.3 (bundler)
- Tailwind CSS 3.4, Framer Motion 11 (animations)
- Zustand 4.5 (state management with persistence middleware)
- i18next + react-i18next (internationalization)
- freeCodeCamp "Command-line Chic" design system
- Deployed via GitHub Actions to GitHub Pages at `/scopa/`

## Commands

```bash
npm run dev      # dev server
npm run build    # tsc + vite build
npm run preview  # preview production build
```

No test suite configured.

## Project Structure

- `src/pages/` — Route-level page components (Home, Setup, Deal, Game, Rules, Stats, GameOver)
- `src/components/` — Reusable UI (CardView, Scoreboard, HandSummary, AIDebugPanel)
- `src/engine/` — Game logic core:
  - `types.ts` — All type definitions (Card, Player, GameState, GameConfig)
  - `ai.ts` — AI decision engine with difficulty tiers
  - `reducer.ts` — Game state reducer
  - `scoring.ts` — Scoring rules
  - `captures.ts` — Card capture mechanics
  - `dealing.ts`, `deck.ts`, `config.ts`
- `src/store/` — Zustand stores (`gameStore.ts`, `settingsStore.ts`)
- `src/learn/` — Educational mode with its own pages, components, data, store, and utils
- `src/locales/` — Translation files (en, it) with namespaces (common, rules, game, learn, ai_reasons)

## Key Patterns

- **State**: Zustand stores with hooks (`useGameStore`, `useSettingsStore`). Game state uses reducer pattern.
- **AI**: Separated into `AIVisibleState` for fair information visibility. Three difficulty tiers.
- **Components**: Functional with hooks, PascalCase naming, `.tsx` extension.
- **Styling**: Tailwind utility-first with custom fCC dark theme palette. 44px minimum touch targets.
- **i18n**: Namespaced translations. Use `useTranslation('namespace')` hook.
