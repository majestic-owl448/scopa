import type { TrainerProblem } from '../../types.ts'

const BASE_CONFIG = {
  playerCount: 2 as const,
  cardsPerHand: 3 as const,
  rosmarino: false,
  reBello: false,
  settanta: false,
  primieraValues: 'standard' as const,
  captureTarget: 'rank' as const,
  inversa: false,
  scopaDAssi: false,
  aceScoresScopa: false,
  napola: false,
}

// F-2: Captures — identify all valid captures
export const FOUNDATION_PROBLEMS: TrainerProblem[] = [
  {
    id: 'F2-P1',
    nodeId: 'F-2',
    type: 'practice',
    goal: { en: 'Capture the {{card:coins-5}} using the single-card match.', it: 'Cattura il 5 di denari con la carta singola.' },
    requiredNodes: ['F-1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Single-card match', it: 'Presa con carta singola' },
    description: { en: 'You have a 5 in hand. The table has a 5 and a 3+2. Play your 5 to capture the table 5.', it: 'Hai un 5 in mano. Il tavolo ha un 5 e un 3+2. Gioca il tuo 5 per catturare il 5 del tavolo.' },
    hand: [
      { id: 'coins-5', suit: 'coins', rank: 5 },
      { id: 'cups-8', suit: 'cups', rank: 8 },
    ],
    table: [
      { id: 'swords-5', suit: 'swords', rank: 5 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-5', captureIds: ['swords-5'] },
    explanation: { en: 'The {{card:coins-5}} directly matches the {{card:swords-5}} by rank. The single-card match takes priority over any multi-card sum.', it: 'Il 5 di denari corrisponde direttamente al 5 di spade per rango.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-5',
        captureIds: ['swords-5'],
        priority: { en: 'Single-card match (required)', it: 'Presa singola (obbligatoria)' },
        reason: { en: 'A single-card rank match must be taken instead of any multi-card sum.', it: 'Una presa singola deve essere presa invece di una somma.' },
      },
    ],
  },

  // F-2: Subset sum capture
  {
    id: 'F2-P2',
    nodeId: 'F-2',
    type: 'practice',
    goal: { en: 'Capture the {{card:clubs-3}} and {{card:clubs-4}} by playing your 7.', it: 'Cattura il 3 e il 4 di bastoni giocando il tuo 7.' },
    requiredNodes: ['F-1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Subset sum', it: 'Somma di sottoinsiemi' },
    description: { en: 'You have a {{card:cups-7}}. The table has a {{card:clubs-3}} and a {{card:clubs-4}} (sum = 7). Play the 7 to capture them.', it: 'Hai un 7 di coppe. Il tavolo ha un 3 di bastoni e un 4 di bastoni (somma = 7).' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-1', suit: 'swords', rank: 1 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'coins-9', suit: 'coins', rank: 9 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['clubs-3', 'clubs-4'] },
    explanation: { en: '3 + 4 = 7, matching the rank of your {{card:cups-7}}. This is a valid subset sum capture.', it: '3 + 4 = 7, corrisponde al rango del tuo 7 di coppe.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['clubs-3', 'clubs-4'],
        priority: { en: 'Subset sum capture', it: 'Presa con somma' },
        reason: { en: '3 + 4 = 7. A valid multi-card capture.', it: '3 + 4 = 7. Una presa multi-carta valida.' },
      },
    ],
  },

  // F-3: Single-card priority
  {
    id: 'F3-P1',
    nodeId: 'F-3',
    type: 'practice',
    goal: { en: 'Take the {{card:swords-4}} directly — not the 3+1 sum.', it: 'Prendi il 4 di spade direttamente, non la somma 3+1.' },
    requiredNodes: ['F-2'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Single-card takes priority', it: 'La carta singola ha la priorità' },
    description: { en: 'Your 4 matches both the {{card:swords-4}} (single) and a 3+1 sum. The single-card match is mandatory.', it: 'Il tuo 4 corrisponde sia al 4 di spade (singolo) che alla somma 3+1. La presa singola è obbligatoria.' },
    hand: [
      { id: 'coins-4', suit: 'coins', rank: 4 },
      { id: 'cups-6', suit: 'cups', rank: 6 },
    ],
    table: [
      { id: 'swords-4', suit: 'swords', rank: 4 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'clubs-1', suit: 'clubs', rank: 1 },
    ],
    correctPlay: { cardId: 'coins-4', captureIds: ['swords-4'] },
    explanation: { en: 'When a single-card match exists (4 = 4), you must take it. The 3+1 sum is not an option even though it also equals 4.', it: 'Quando esiste una presa singola (4 = 4), devi prenderla.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-4',
        captureIds: ['swords-4'],
        priority: { en: 'Single-card match (mandatory)', it: 'Presa singola (obbligatoria)' },
        reason: { en: 'The single-card rank match must be taken over any subset sum.', it: 'La presa singola deve essere presa invece di qualsiasi somma.' },
      },
    ],
  },

  // F-5: Scopa recognition
  {
    id: 'F5-P1',
    nodeId: 'F-5',
    type: 'practice',
    goal: { en: 'Clear the table — play the card that captures all table cards (scopa).', it: 'Pulisci il tavolo: gioca la carta che cattura tutte le carte del tavolo (scopa).' },
    requiredNodes: ['F-2', 'F-3'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Scopa!', it: 'Scopa!' },
    description: { en: 'The table has a 2 and a 5. You have a 7. Play the 7 to take both and clear the table for a scopa point.', it: 'Il tavolo ha un 2 e un 5. Hai un 7. Gioca il 7 per prendere entrambi e fare scopa.' },
    hand: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    table: [
      { id: 'cups-2', suit: 'cups', rank: 2 },
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
    ],
    correctPlay: { cardId: 'coins-7', captureIds: ['cups-2', 'clubs-5'] },
    explanation: { en: '2 + 5 = 7. Playing the 7 captures both table cards, leaving the table empty — that\'s a scopa! A face-down {{card:coins-7}} is placed as your scopa marker.', it: '2 + 5 = 7. Giocare il 7 cattura entrambe le carte del tavolo: scopa!' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-7',
        captureIds: ['cups-2', 'clubs-5'],
        priority: { en: 'Scopa — clear the table', it: 'Scopa — pulisci il tavolo' },
        reason: { en: '2 + 5 = 7 captures everything; table is empty after the play.', it: '2 + 5 = 7 cattura tutto; il tavolo rimane vuoto.' },
      },
    ],
  },

  // F-4: Discard
  {
    id: 'F4-P1',
    nodeId: 'F-4',
    type: 'practice',
    goal: { en: 'You can\'t capture anything — discard your card.', it: 'Non puoi catturare nulla: scarta la tua carta.' },
    requiredNodes: ['F-2'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Discard', it: 'Scarto' },
    description: { en: 'Your {{card:coins-9}} can\'t capture anything — no table card or combination equals 9. When you can\'t capture, you must discard: play the card to add it to the table.', it: 'Il tuo 9 di denari non può catturare nulla: nessuna carta o combinazione sul tavolo fa 9. Quando non puoi catturare, devi scartare: gioca la carta per aggiungerla al tavolo.' },
    hand: [
      { id: 'coins-9', suit: 'coins', rank: 9 },
    ],
    table: [
      { id: 'swords-3', suit: 'swords', rank: 3 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-9', captureIds: [] },
    explanation: { en: '3+2=5, 3 alone, 2 alone — none equal 9. No capture is possible, so playing the 9 discards it to the table. Discarding is a normal move, not a mistake: sometimes no capture is available.', it: '3+2=5, nessuna combinazione fa 9. Nessuna presa possibile: gioca il 9 per scartarlo sul tavolo. Scartare è una mossa normale quando non ci sono prese disponibili.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-9',
        captureIds: [],
        priority: { en: 'Discard — no capture available', it: 'Scarto — nessuna presa disponibile' },
        reason: { en: 'No card or combination on the table sums to 9.', it: 'Nessuna carta o combinazione sul tavolo fa 9.' },
      },
    ],
  },

  // F-7: Scoring — challenge: identify who wins each category
  {
    id: 'F7-C1',
    nodeId: 'F-7',
    type: 'challenge',
    requiredNodes: ['F-5', 'F-6'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Scoring: Settebello', it: 'Punteggio: Settebello' },
    description: { en: 'Capture the {{card:coins-7}} — the settebello is worth 1 point to whoever holds it at hand end.', it: 'Cattura il 7 di denari: il settebello vale 1 punto a chi lo tiene a fine mano.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'coins-3', suit: 'coins', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['coins-7'] },
    explanation: { en: 'The {{card:coins-7}} (settebello) is worth 1 scoring point to whoever holds it at the end of the hand. Always prioritise capturing it when possible.', it: 'Il 7 di denari (settebello) vale 1 punto di punteggio a chi lo tiene a fine mano.' },
    helpHints: [
      { en: 'The settebello is the {{card:coins-7}} — it\'s worth a scoring point at hand end.', it: 'Il settebello è il 7 di denari: vale un punto a fine mano.' },
      { en: 'Your {{card:cups-7}} matches the {{card:coins-7}} by rank.', it: 'Il tuo 7 di coppe corrisponde al 7 di denari per rango.' },
    ],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Settebello capture', it: 'Presa del settebello' },
        reason: { en: 'The {{card:coins-7}} is a scoring point. Always take it when you can.', it: 'Il 7 di denari vale un punto. Prendilo sempre quando puoi.' },
      },
    ],
  },

  // F-6: End of hand — who gets leftover cards?
  {
    id: 'F6-P1',
    nodeId: 'F-6',
    type: 'practice',
    goal: { en: 'Make a capture — you\'ll be the last to capture and pick up the leftover table card.', it: 'Fai una presa: sarai l\'ultimo a catturare e raccoglierai la carta rimasta sul tavolo.' },
    requiredNodes: ['F-2', 'F-3'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Last capture takes the table', it: 'L\'ultimo prende il tavolo' },
    description: { en: 'This is the last turn of the hand. You capture the {{card:swords-5}} with your 5. After this, no more cards will be dealt — the {{card:clubs-2}} still on the table goes to you automatically as the last captor.', it: 'Ultimo turno della mano. Cattura il 5 di spade: il 2 di bastoni rimasto andrà a te come ultimo a catturare.' },
    hand: [
      { id: 'coins-5', suit: 'coins', rank: 5 },
    ],
    table: [
      { id: 'swords-5', suit: 'swords', rank: 5 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-5', captureIds: ['swords-5'] },
    explanation: { en: 'You captured the {{card:swords-5}}. Because this is the last capture of the hand, the {{card:clubs-2}} (which nobody captured) also goes to you. This is not a scopa — you don\'t earn a scopa point for it, but those cards do count toward your total for Carte and Ori scoring.', it: 'Hai catturato il 5 di spade. Essendo l\'ultima presa della mano, il 2 di bastoni rimasto va anche a te. Non è una scopa.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-5',
        captureIds: ['swords-5'],
        priority: { en: 'Capture (last of the hand)', it: 'Presa (ultima della mano)' },
        reason: { en: 'Single-card rank match. As the last captor, you collect remaining table cards too.', it: 'Presa singola. Come ultimo a catturare, raccogli anche le carte rimaste.' },
      },
    ],
  },

  // F-7: Scoring — practice: identify who wins Carte
  {
    id: 'F7-P1',
    nodeId: 'F-7',
    type: 'practice',
    goal: { en: 'Capture more cards than your opponent to win the Carte point.', it: 'Cattura più carte dell\'avversario per vincere il punto Carte.' },
    requiredNodes: ['F-5', 'F-6'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Scoring: Carte', it: 'Punteggio: Carte' },
    description: { en: 'Carte goes to whoever captures more than 20 cards (more than half the deck). Capture these 2 cards from the table with your 6 — every card captured counts toward your total.', it: 'Carte va a chi cattura più di 20 carte. Cattura queste carte per aumentare il tuo totale.' },
    hand: [
      { id: 'coins-6', suit: 'coins', rank: 6 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
    ],
    table: [
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-6', captureIds: ['clubs-4', 'cups-2'] },
    explanation: { en: '4 + 2 = 6. Playing your 6 captures both table cards, adding 2 to your Carte count. Carte is won by whoever captures strictly more than 20 cards (over half of the 40-card deck). In a tie, nobody scores the Carte point.', it: '4 + 2 = 6. Catturare entrambe le carte aumenta il tuo conteggio Carte. Chi cattura più di 20 carte vince il punto.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-6',
        captureIds: ['clubs-4', 'cups-2'],
        priority: { en: 'Capture more cards', it: 'Cattura più carte' },
        reason: { en: '4 + 2 = 6. Capturing 2 cards beats capturing 0.', it: '4 + 2 = 6. Catturare 2 carte è meglio di non catturarne.' },
      },
    ],
  },

  // F-2: additional challenge — multiple valid captures, choose correctly
  {
    id: 'F2-C1',
    nodeId: 'F-2',
    type: 'challenge',
    requiredNodes: ['F-1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Multiple capture options', it: 'Più opzioni di presa' },
    description: { en: 'Your 8 can capture the table 8, or the 5+3 sum. Which is mandatory?', it: 'Il tuo 8 può catturare l\'8 del tavolo, oppure la somma 5+3. Quale è obbligatoria?' },
    hand: [
      { id: 'cups-8', suit: 'cups', rank: 8 },
      { id: 'swords-1', suit: 'swords', rank: 1 },
    ],
    table: [
      { id: 'coins-8', suit: 'coins', rank: 8 },
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-8', captureIds: ['coins-8'] },
    explanation: { en: 'When a single-card rank match exists (8 = 8), it\'s mandatory — you must take it instead of any multi-card sum. The 5+3 sum is not an option here.', it: 'Quando esiste una presa singola per rango (8 = 8), è obbligatoria: non puoi scegliere la somma 5+3.' },
    helpHints: [
      { en: 'Is there a single table card that matches your 8 by rank?', it: 'C\'è una carta singola sul tavolo che corrisponde al tuo 8 per rango?' },
      { en: 'Single-card rank matches take priority over multi-card sums.', it: 'Le prese singole hanno priorità sulle somme multiple.' },
    ],
    rankedPlays: [
      {
        cardId: 'cups-8',
        captureIds: ['coins-8'],
        priority: { en: 'Single-card match (mandatory)', it: 'Presa singola (obbligatoria)' },
        reason: { en: 'The {{card:coins-8}} matches by rank — this capture is required.', it: 'Il 8 di denari corrisponde per rango: questa presa è obbligatoria.' },
      },
    ],
  },
]
