import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home.tsx'))
const Setup = lazy(() => import('./pages/Setup.tsx'))
const Deal = lazy(() => import('./pages/Deal.tsx'))
const Game = lazy(() => import('./pages/Game.tsx'))
const GameOver = lazy(() => import('./pages/GameOver.tsx'))
const Rules = lazy(() => import('./pages/Rules.tsx'))
const Stats = lazy(() => import('./pages/Stats.tsx'))
const LearnHome = lazy(() => import('./learn/pages/LearnHome.tsx'))
const LearnNode = lazy(() => import('./learn/pages/LearnNode.tsx'))
const ChallengesHub = lazy(() => import('./learn/pages/ChallengesHub.tsx'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-dvh grid place-items-center text-fcc-green">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/setup" element={<Setup />} />
        <Route path="/play/deal" element={<Deal />} />
        <Route path="/play/game" element={<Game />} />
        <Route path="/play/game/over" element={<GameOver />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/learn" element={<LearnHome />} />
        <Route path="/learn/challenges" element={<ChallengesHub />} />
        <Route path="/learn/:nodeId" element={<LearnNode />} />
      </Routes>
    </Suspense>
  )
}
