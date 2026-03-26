import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Setup from './pages/Setup.tsx'
import Deal from './pages/Deal.tsx'
import Game from './pages/Game.tsx'
import GameOver from './pages/GameOver.tsx'
import Rules from './pages/Rules.tsx'
import Stats from './pages/Stats.tsx'
import LearnHome from './learn/pages/LearnHome.tsx'
import LearnNode from './learn/pages/LearnNode.tsx'
import ChallengesHub from './learn/pages/ChallengesHub.tsx'

export default function App() {
  return (
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
  )
}
