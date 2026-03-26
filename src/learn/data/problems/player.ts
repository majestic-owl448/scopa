import type { TrainerProblem } from '../../types.ts'

const BASE_2P = {
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

const P3_CONFIG = { ...BASE_2P, playerCount: 3 as const }
const P4_CONFIG = { ...BASE_2P, playerCount: 4 as const }

export const PLAYER_PROBLEMS: TrainerProblem[] = [

  // ── P3: 3-Player Scopa ────────────────────────────────────────────────────────

  {
    id: 'P3-P1',
    nodeId: 'P3',
    type: 'practice',
    goal: { en: 'Capture the Coins card to contest Ori — in 3-player, ties mean nobody scores.', it: 'Cattura la carta di denari per contendere Ori: a tre giocatori, i pareggi non danno punti a nessuno.' },
    requiredNodes: ['F-7'],
    config: P3_CONFIG,
    playerIndex: 0,
    title: { en: 'Contest Ori in a 3-player game', it: 'Contendi Ori a tre giocatori' },
    description: { en: 'In 3-player Scopa, Ori (most Coins) still requires a strict majority — more than 5. Two captures available: one includes a Coins card. Grab the Coins card to stay in the Ori race.', it: 'In Scopa a tre, Ori richiede ancora la maggioranza assoluta (più di 5). Due prese disponibili: una include una carta di denari. Prendila per restare in corsa per Ori.' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    table: [
      { id: 'coins-3', suit: 'coins', rank: 3 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['coins-3', 'clubs-4'] },
    explanation: { en: '3+4=7 works two ways: {{{card:coins-3}}, {{card:clubs-4}}} or {{{card:cups-3}}, {{card:clubs-4}}}. In a 3-player game, Coins cards are split among three players — Ori goes to whoever alone exceeds 5 Coins. Any tie means nobody scores. Prefer the capture that picks up {{card:coins-3}} to build your count. {{card:cups-2}} can only capture via sum=2 (impossible from 3+4) — it must discard.', it: '3+4=7 in due modi. In una partita a tre, le Ori si dividono tra tre giocatori: cattura coins-3 per costruire il tuo conteggio. cups-2 deve scartare.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['coins-3', 'clubs-4'],
        priority: { en: 'Captures Coins card for Ori', it: 'Cattura carta di denari per Ori' },
        reason: { en: 'Picks up {{card:coins-3}}; in 3-player, every Coins card matters for the strict majority.', it: 'Prende coins-3; a tre giocatori, ogni carta di denari conta per la maggioranza assoluta.' },
      },
      {
        cardId: 'swords-7',
        captureIds: ['cups-3', 'clubs-4'],
        priority: { en: 'Same count, no Ori benefit', it: 'Stesso conteggio, nessun beneficio Ori' },
        reason: { en: 'Takes 2 cards but misses the only Coins card on the table.', it: 'Prende 2 carte ma perde l\'unica carta di denari sul tavolo.' },
      },
    ],
  },

  {
    id: 'P3-C1',
    nodeId: 'P3',
    type: 'challenge',
    requiredNodes: ['F-7'],
    config: P3_CONFIG,
    playerIndex: 0,
    title: { en: 'Spot the scopa in 3-player', it: 'Individua la scopa a tre giocatori' },
    description: { en: 'Three players means the table can be more stocked between your turns. Find the card in your hand that clears the table right now.', it: 'Con tre giocatori il tavolo può essere più affollato tra i tuoi turni. Trova la carta che svuota il tavolo adesso.' },
    hand: [
      { id: 'coins-6', suit: 'coins', rank: 6 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    table: [
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-6', captureIds: ['clubs-4', 'swords-2'] },
    explanation: { en: '4+2=6 — playing {{card:coins-6}} captures both table cards and clears the table: scopa! Clearing the table in a 3-player game is especially powerful since two opponents follow before you play again.', it: '4+2=6: giocare coins-6 cattura entrambe le carte del tavolo = scopa! In una partita a tre, la scopa è particolarmente potente perché due avversari giocano prima di te.' },
    helpHints: [
      { en: 'Check whether any hand card can capture ALL table cards in one play.', it: 'Controlla se qualche carta in mano può catturare TUTTE le carte del tavolo in una sola mossa.' },
      { en: 'A scopa clears the table — remember to check sum combinations, not just rank matches.', it: 'Una scopa svuota il tavolo: controlla le somme, non solo i ranghi uguali.' },
    ],
    rankedPlays: [
      {
        cardId: 'coins-6',
        captureIds: ['clubs-4', 'swords-2'],
        priority: { en: 'Scopa — 4+2=6', it: 'Scopa — 4+2=6' },
        reason: { en: 'Clears the table for an immediate scopa point; especially valuable with two opponents still to play.', it: 'Svuota il tavolo per un punto scopa immediato; particolarmente prezioso con due avversari che giocano ancora.' },
      },
    ],
  },

  // ── P4: 4-Player Scopa ────────────────────────────────────────────────────────

  {
    id: 'P4-P1',
    nodeId: 'P4',
    type: 'practice',
    goal: { en: 'In 4-player, capture the settebello immediately — three opponents could take it before your next turn.', it: 'A quattro giocatori, cattura subito il settebello: tre avversari potrebbero prenderlo prima del tuo prossimo turno.' },
    requiredNodes: ['F-7'],
    config: P4_CONFIG,
    playerIndex: 0,
    title: { en: 'Act fast in 4-player', it: 'Agisci veloce a quattro giocatori' },
    description: { en: 'With 4 players, three opponents play between your turns. Key cards on the table vanish quickly. Your {{card:cups-7}} can capture the settebello right now — do it.', it: 'Con 4 giocatori, tre avversari giocano tra i tuoi turni. Le carte chiave sul tavolo spariscono in fretta. Il tuo 7 di coppe cattura subito il settebello.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['coins-7'] },
    explanation: { en: '{{card:cups-7}} must capture {{card:coins-7}} (mandatory rank match) — that is the settebello (1 point). {{card:swords-5}} could capture 3+2=5 (two cards). In 4-player, three opponents play before your next turn: any player holding a 7 will take the settebello if you leave it. Never leave key cards on the table when you can capture them now.', it: 'cups-7 cattura coins-7 (presa obbligatoria) = settebello (1 punto). In una partita a quattro, tre avversari giocano prima di te: non lasciare mai le carte chiave sul tavolo.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Settebello — take it now', it: 'Settebello — prendilo adesso' },
        reason: { en: 'Three opponents between turns; settebello will be gone if you wait.', it: 'Tre avversari tra i turni: il settebello sparirà se aspetti.' },
      },
      {
        cardId: 'swords-5',
        captureIds: ['clubs-3', 'cups-2'],
        priority: { en: '2 cards, settebello at risk', it: '2 carte, settebello a rischio' },
        reason: { en: 'More cards but leaves the settebello for three opponents to capture.', it: 'Più carte ma lascia il settebello a tre avversari.' },
      },
    ],
  },

  {
    id: 'P4-C1',
    nodeId: 'P4',
    type: 'challenge',
    requiredNodes: ['F-7'],
    config: P4_CONFIG,
    playerIndex: 0,
    title: { en: 'Scopa while you can', it: 'Fai scopa finché puoi' },
    description: { en: 'With 4 players, a scopa opportunity might not last one full round. The table sums to a sweepable value right now. Clear it.', it: 'Con 4 giocatori, un\'opportunità di scopa potrebbe non durare un intero giro. Il tavolo ha adesso una somma spazzabile. Svuotalo.' },
    hand: [
      { id: 'coins-9', suit: 'coins', rank: 9 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
    ],
    table: [
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'cups-4', suit: 'cups', rank: 4 },
    ],
    correctPlay: { cardId: 'coins-9', captureIds: ['clubs-5', 'cups-4'] },
    explanation: { en: '5+4=9 — playing {{card:coins-9}} captures both table cards = scopa. {{card:swords-4}} would be a mandatory rank match with {{card:cups-4}} on the table (both rank 4) — but that only takes {{card:cups-4}} and leaves {{card:clubs-5}} for an opponent. {{card:clubs-2}} has no valid captures. Play {{card:coins-9}} for the immediate scopa: in 4-player, three opponents play before you return — someone would have taken those cards otherwise.', it: '5+4=9: giocare coins-9 cattura entrambe le carte = scopa. In una partita a quattro, gioca la scopa subito: tre avversari giocano prima di te.' },
    helpHints: [
      { en: 'Check the sum of all table cards. If it equals a card in your hand, you can scopa.', it: 'Calcola la somma di tutte le carte del tavolo. Se è uguale a una carta in mano, puoi fare scopa.' },
      { en: 'In 4-player, opportunities close fast — act on a scopa immediately.', it: 'A quattro giocatori, le opportunità si chiudono in fretta: cogli subito la scopa.' },
    ],
    rankedPlays: [
      {
        cardId: 'coins-9',
        captureIds: ['clubs-5', 'cups-4'],
        priority: { en: 'Scopa — 5+4=9', it: 'Scopa — 5+4=9' },
        reason: { en: 'Clears the table immediately; in 4-player the chance won\'t survive a full round.', it: 'Svuota il tavolo subito; a quattro giocatori l\'opportunità non sopravviverebbe a un giro completo.' },
      },
    ],
  },
]
