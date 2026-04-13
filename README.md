# Scopa

A web implementation of the traditional Italian card game Scopa, built with React + TypeScript.

The app is currently focused on single-player matches against CPU opponents, plus a Learn mode for studying rules and strategy.

## Current Features

- 2/3/4-player tables (you + CPU opponents)
- CPU difficulty levels: easy, medium, hard
- Configurable capture rules: rank, sum-to-15, sum-to-11
- Variants: Rosmarino, Re Bello, Settanta, Scopa d'Assi, Ace scores scopa, Napola, Inversa
- Primiera modes: standard, veneto, milano
- Deck styles: Napoletane, French, Colorful
- Bilingual UI: English / Italian
- Persisted game, settings, stats, and Learn progress via Zustand persist
- Learn mode with node progression, guided practice, authored challenges, and procedural challenge generation fallback

## Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- Zustand
- i18next / react-i18next
- Framer Motion

## Run Locally

```bash
npm install
npm run dev
```

## Build & Validation

```bash
npm run lint
npm run test
npm run build
```

Validation status: lint, test, and production build pass.

## Performance Notes

- Route-level lazy loading is enabled in `src/App.tsx` to reduce initial bundle size.
- The previous >500 kB single-chunk warning is resolved by code-splitting route/page modules.

## Deployment

- Vite base path is configured as `/scopa/` (`vite.config.ts`) for GitHub Pages deployment.
