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

// S1: Capture Recognition — spot all valid captures
export const STRATEGY_PROBLEMS: TrainerProblem[] = [
  {
    id: 'S1-P1',
    nodeId: 'S1',
    type: 'practice',
    goal: { en: 'Play the {{card:cups-7}} — but which table card does it capture?', it: 'Gioca il 7 di coppe — ma quale carta del tavolo cattura?' },
    requiredNodes: ['F-7'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Rank match is mandatory', it: 'La presa singola è obbligatoria' },
    description: { en: 'Your {{card:cups-7}} could match the {{card:clubs-7}} on the table (rank match), or capture 1+2+4=7 (subset sum, 3 cards). The rank match takes priority — you must take it. Play the 7 and capture the {{card:clubs-7}}.', it: 'Il tuo 7 di coppe può prendere il 7 di bastoni (rango uguale) oppure 1+2+4=7 (somma). La presa singola è obbligatoria: prendi il 7 di bastoni.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'clubs-7', suit: 'clubs', rank: 7 },
      { id: 'coins-1', suit: 'coins', rank: 1 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['clubs-7'] },
    explanation: { en: 'When a single-card rank match exists (your 7 vs the {{card:clubs-7}}), you MUST take it — subset sums are not an option. The correct play is the forced rank match: {{card:cups-7}} captures {{card:clubs-7}}. You get 1 card, not 3 — but there is no choice. Understanding this rule is the foundation of capture recognition.', it: 'Quando esiste una presa singola dello stesso rango, DEVI prenderla. La presa obbligatoria esclude la somma 1+2+4.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['clubs-7'],
        priority: { en: 'Mandatory rank match', it: 'Presa singola obbligatoria' },
        reason: { en: 'A same-rank card on the table must be taken; subset sums are forbidden when a rank match exists.', it: 'Una carta dello stesso rango sul tavolo deve essere presa; le somme sono vietate se esiste una presa singola.' },
      },
    ],
  },

  {
    id: 'S1-P2',
    nodeId: 'S1',
    type: 'practice',
    goal: { en: 'Find the only valid capture in this position.', it: 'Trova l\'unica presa valida in questa posizione.' },
    requiredNodes: ['F-7'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Find the sum', it: 'Trova la somma' },
    description: { en: 'No card on the table matches your hand ranks. Find the subset sum that lets you capture.', it: 'Nessuna carta sul tavolo corrisponde ai tuoi ranghi. Trova la somma che ti permette di catturare.' },
    hand: [
      { id: 'coins-9', suit: 'coins', rank: 9 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    table: [
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
      { id: 'cups-6', suit: 'cups', rank: 6 },
    ],
    correctPlay: { cardId: 'coins-9', captureIds: ['clubs-5', 'swords-4'] },
    explanation: { en: '5 + 4 = 9, so the {{card:coins-9}} captures the {{card:clubs-5}} and {{card:swords-4}}. The 3 in hand doesn\'t match any single card or valid sum on this table (there is no pair or triple summing to 3). The 9 also can\'t capture the 6 (9 ≠ 6 and no complement exists). Only 5+4=9 works.', it: '5 + 4 = 9: il 9 di denari cattura il 5 di bastoni e il 4 di spade. Il 3 non ha prese valide in questa posizione.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-9',
        captureIds: ['clubs-5', 'swords-4'],
        priority: { en: 'Subset sum 5+4=9', it: 'Somma 5+4=9' },
        reason: { en: '5 + 4 = 9 is the only valid capture available.', it: '5 + 4 = 9 è l\'unica presa disponibile.' },
      },
    ],
  },

  {
    id: 'S1-C1',
    nodeId: 'S1',
    type: 'challenge',
    requiredNodes: ['F-7'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Multiple captures, one choice', it: 'Prese multiple, una scelta' },
    description: { en: 'Your card can capture in two different ways. Only one group maximises your card count — pick the better capture.', it: 'La tua carta può catturare in due modi. Solo uno massimizza le tue carte: scegli la presa migliore.' },
    hand: [
      { id: 'clubs-6', suit: 'clubs', rank: 6 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    table: [
      { id: 'coins-6', suit: 'coins', rank: 6 },
      { id: 'cups-1', suit: 'cups', rank: 1 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    correctPlay: { cardId: 'clubs-6', captureIds: ['coins-6'] },
    explanation: { en: 'The {{card:clubs-6}} can seem to offer two options: capture the {{card:coins-6}} (rank match) OR capture 1+5=6 (subset sum). But when a single-card rank match exists, it is mandatory — you MUST take the {{card:coins-6}}. The subset sum 1+5 is not available because the rank-6 match takes priority. No choice here: rank match wins.', it: 'Il 6 di bastoni sembra offrire due opzioni: prendere il 6 di denari (presa singola) oppure 1+5=6 (somma). Ma la presa singola è obbligatoria: devi prendere il 6 di denari.' },
    helpHints: [
      { en: 'Check whether any table card has the same rank as your played card.', it: 'Controlla se qualche carta sul tavolo ha lo stesso rango della carta che giochi.' },
      { en: 'The single-card match rule is mandatory — no exceptions.', it: 'La regola della presa singola è obbligatoria, senza eccezioni.' },
      { en: 'After identifying the mandatory capture, look at what remains on the table.', it: 'Dopo aver identificato la presa obbligatoria, guarda cosa rimane sul tavolo.' },
    ],
    rankedPlays: [
      {
        cardId: 'clubs-6',
        captureIds: ['coins-6'],
        priority: { en: 'Mandatory rank match', it: 'Presa singola obbligatoria' },
        reason: { en: 'The {{card:coins-6}} must be taken when playing a 6; subset sums are blocked.', it: 'Il 6 di denari deve essere preso giocando un 6; le somme sono bloccate.' },
      },
      {
        cardId: 'clubs-6',
        captureIds: ['cups-1', 'swords-5'],
        priority: { en: 'Invalid — rank match exists', it: 'Non valida — esiste presa singola' },
        reason: { en: '1+5=6 is not available because a rank-6 card is on the table.', it: '1+5=6 non è disponibile perché c\'è un 6 sul tavolo.' },
      },
    ],
  },

  // S2: Key card priority — settebello first
  {
    id: 'S2-P1',
    nodeId: 'S2',
    type: 'practice',
    goal: { en: 'Capture the settebello — it\'s worth 1 point at hand end.', it: 'Cattura il settebello: vale 1 punto a fine mano.' },
    requiredNodes: ['S1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Settebello first', it: 'Settebello prima' },
    description: { en: 'Your {{card:cups-7}} rank-matches the {{card:coins-7}} (mandatory, 1 card). A sum 4+3=7 also exists but the rank match takes priority. Take the settebello.', it: 'Il tuo 7 di coppe ha una presa obbligatoria con il 7 di denari (1 carta). Esiste anche la somma 4+3=7, ma la presa singola ha la priorità. Prendi il settebello.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['coins-7'] },
    explanation: { en: 'The settebello ({{card:coins-7}}) is worth 1 scoring point to whoever holds it at hand end. Always capture it when a choice exists — it outweighs capturing more cards in most situations.', it: 'Il settebello vale 1 punto. Catturalo sempre quando puoi.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Settebello capture', it: 'Presa del settebello' },
        reason: { en: 'The {{card:coins-7}} scores 1 point at hand end regardless of who has more cards.', it: 'Il 7 di denari vale 1 punto a fine mano indipendentemente da chi ha più carte.' },
      },
    ],
  },

  // S2-C1: Settebello vs scopa tension — challenge
  {
    id: 'S2-C1',
    nodeId: 'S2',
    type: 'challenge',
    requiredNodes: ['S1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Settebello or scopa?', it: 'Settebello o scopa?' },
    description: { en: 'One card takes the settebello (1 point). The other scores a scopa AND captures the settebello too. Which play is worth more?', it: 'Una carta prende il settebello (1 punto). L\'altra fa scopa E cattura anche il settebello. Quale vale di più?' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'coins-9', suit: 'coins', rank: 9 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-9', captureIds: ['coins-7', 'clubs-2'] },
    explanation: { en: '{{card:coins-9}} can capture 7+2=9 (subset sum — no rank-9 card on table so no rank match conflict). That capture takes both table cards, clearing the table: scopa! And it captures the settebello too. 2 points in one play. {{card:cups-7}} has a mandatory rank match with {{card:coins-7}} — takes the settebello (1 pt) but leaves {{card:clubs-2}} on the table. The {{card:coins-9}} play scores twice as much.', it: 'coins-9 cattura 7+2=9 (somma, nessun 9 sul tavolo per la presa singola). Prende entrambe le carte: scopa! E include anche il settebello. 2 punti in un\'unica mossa. cups-7 prende solo il settebello (presa obbligatoria) ma lascia il 2 sul tavolo.' },
    helpHints: [
      { en: 'Check whether {{card:coins-9}} can capture the whole table via a subset sum.', it: 'Controlla se coins-9 può catturare l\'intero tavolo tramite una somma.' },
      { en: 'A scopa clears the table — but first check if the total equals a card in your hand.', it: 'Una scopa svuota il tavolo: controlla se la somma totale corrisponde a una carta in mano.' },
      { en: 'The settebello is already included in the scopa capture — you don\'t have to choose.', it: 'Il settebello è già incluso nella presa scopa: non devi scegliere.' },
    ],
    rankedPlays: [
      {
        cardId: 'coins-9',
        captureIds: ['coins-7', 'clubs-2'],
        priority: { en: 'Scopa + settebello — 2 points', it: 'Scopa + settebello — 2 punti' },
        reason: { en: '7+2=9 clears the table (scopa) and captures the settebello in one play.', it: '7+2=9 svuota il tavolo (scopa) e cattura il settebello in una mossa sola.' },
      },
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Settebello only — 1 point', it: 'Solo settebello — 1 punto' },
        reason: { en: 'Mandatory rank match captures the settebello but misses the scopa.', it: 'Presa obbligatoria: cattura il settebello ma non fa scopa.' },
      },
    ],
  },

  // S3: Scopa recognition
  {
    id: 'S3-P1',
    nodeId: 'S3',
    type: 'practice',
    goal: { en: 'Play the card that scores a scopa.', it: 'Gioca la carta che fa scopa.' },
    requiredNodes: ['S1'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Spot the scopa', it: 'Individua la scopa' },
    description: { en: 'One card in your hand can clear the table. Find it and play it.', it: 'Una carta in mano può pulire il tavolo. Trovala e giocala.' },
    hand: [
      { id: 'coins-6', suit: 'coins', rank: 6 },
      { id: 'swords-10', suit: 'swords', rank: 10 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    table: [
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-6', captureIds: ['clubs-4', 'swords-2'] },
    explanation: { en: '4 + 2 = 6. Playing the 6 captures both table cards and clears the table — scopa! The 3 has no valid capture (3≠4, 3≠2, and no subset sums to 3), and the 10 has none either (10≠4, 10≠2, 4+2=6≠10). Only the 6 clears the table.', it: '4 + 2 = 6. Giocare il 6 cattura entrambe le carte: scopa! Il 3 e il 10 non hanno prese valide.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-6',
        captureIds: ['clubs-4', 'swords-2'],
        priority: { en: 'Scopa', it: 'Scopa' },
        reason: { en: '4 + 2 = 6 captures everything on the table.', it: '4 + 2 = 6 cattura tutto il tavolo.' },
      },
    ],
  },

  // S4: Ori & Carte Awareness — track coin and card counts
  {
    id: 'S4-P1',
    nodeId: 'S4',
    type: 'practice',
    goal: { en: 'Pick the capture that secures the Ori point — you need one more Coins card to win it.', it: 'Scegli la presa che ti assicura il punto Ori: ti serve ancora una carta di denari per vincerlo.' },
    requiredNodes: ['S3'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Secure Ori', it: 'Assicura gli Ori' },
    description: { en: 'You have 5 Coins cards captured so far and your opponent has 4. One more Coins card wins Ori. The {{card:cups-5}} can capture two ways — one group includes the Coins card. The {{card:swords-7}} has no captures here.', it: 'Hai 5 carte di denari, l\'avversario ne ha 4. Ancora una carta di denari vince Ori. Il 5 di coppe può catturare in due modi: uno include la carta di denari. Il 7 di spade non ha prese.' },
    hand: [
      { id: 'cups-5', suit: 'cups', rank: 5 },
      { id: 'swords-7', suit: 'swords', rank: 7 },
    ],
    table: [
      { id: 'coins-3', suit: 'coins', rank: 3 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    capturedPiles: [
      [],
      [],
    ],
    correctPlay: { cardId: 'cups-5', captureIds: ['coins-3', 'clubs-2'] },
    explanation: { en: 'Playing the {{card:cups-5}} captures 3+2=5. Two capture groups both sum to 5: {{{card:coins-3}}, {{card:clubs-2}}} or {{{card:cups-3}}, {{card:clubs-2}}}. Take the group with {{card:coins-3}} — that\'s your 6th Coins card, clinching Ori (you need strictly more than 5). The {{card:swords-7}} has no valid captures: no rank-7 on the table, and no subset of {3, 2, 3} sums to 7 (3+2=5, 3+3=6, 3+2+3=8). Must discard.', it: 'Il 5 di coppe cattura 3+2=5 in due modi: {coins-3, clubs-2} o {cups-3, clubs-2}. Prendi quello con coins-3 — il tuo 6° denaro, che assicura Ori. Il 7 di spade non ha prese valide.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-5',
        captureIds: ['coins-3', 'clubs-2'],
        priority: { en: 'Ori-clinching capture', it: 'Presa che assicura Ori' },
        reason: { en: 'Takes {{card:coins-3}} — 6th Coins card, strictly more than half.', it: 'Prende coins-3: 6° carta di denari, la maggioranza assoluta.' },
      },
      {
        cardId: 'cups-5',
        captureIds: ['cups-3', 'clubs-2'],
        priority: { en: 'Same count, no Ori benefit', it: 'Stesso conteggio, nessun beneficio Ori' },
        reason: { en: 'Also sums to 5 but misses the only Coins card on the table.', it: 'Somma anch\'essa a 5, ma perde l\'unica carta di denari sul tavolo.' },
      },
    ],
  },

  // S5: Primiera Basics — value table and suit coverage
  {
    id: 'S5-P1',
    nodeId: 'S5',
    type: 'practice',
    goal: { en: 'Capture the card that fills your missing suit slot for Primiera.', it: 'Cattura la carta che riempie il seme mancante nella Primiera.' },
    requiredNodes: ['S4'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Fill the missing suit', it: 'Riempi il seme mancante' },
    description: { en: 'You have cards in Cups, Coins, and Swords, but nothing in Clubs. Your Primiera score for Clubs is 0. A Clubs card is on the table — prioritise capturing it.', it: 'Hai carte in Coppe, Denari e Spade, ma nulla in Bastoni. Il tuo punteggio Primiera per Bastoni è 0. C\'è un Bastoni sul tavolo: catturalo.' },
    hand: [
      { id: 'cups-6', suit: 'cups', rank: 6 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    table: [
      { id: 'clubs-6', suit: 'clubs', rank: 6 },
      { id: 'coins-4', suit: 'coins', rank: 4 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-6', captureIds: ['clubs-6'] },
    explanation: { en: 'Playing the {{card:cups-6}} captures the {{card:clubs-6}} — mandatory rank match. This fills your empty Clubs slot with 18 primiera points. Even if you already had a {{card:cups-6}} (18 pts in that suit), getting 18 in Clubs is far better than leaving Clubs at 0. The {{card:swords-3}} can only capture 2+... nothing (no valid sum for 3 here). The 6 capture is both mandatory and the right strategic choice.', it: 'Giocare il 6 di coppe cattura il 6 di bastoni (presa obbligatoria). Riempie il seme Bastoni con 18 punti Primiera invece di 0.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-6',
        captureIds: ['clubs-6'],
        priority: { en: 'Fills missing Clubs slot (+18 primiera pts)', it: 'Riempie Bastoni mancante (+18 punti primiera)' },
        reason: { en: 'Going from 0 to 18 in a missing suit is the highest-value primiera play available.', it: 'Passare da 0 a 18 in un seme mancante è la giocata Primiera di maggior valore.' },
      },
    ],
  },

  // S6: Smart discard — avoid leaving exact matches
  {
    id: 'S6-P1',
    nodeId: 'S6',
    type: 'practice',
    goal: { en: 'Discard the card that leaves the table impossible to capture from.', it: 'Scarta la carta che rende il tavolo impossibile da catturare.' },
    requiredNodes: ['S5'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Safe discard', it: 'Scarto sicuro' },
    description: { en: 'You must discard — neither card can capture. Think about what you leave behind. One discard creates dangerous sums on the table; the other makes all table sums exceed 10, blocking every multi-card capture.', it: 'Devi scartare: nessuna carta cattura. Pensa a cosa lasci sul tavolo. Un scarto crea somme pericolose; l\'altro fa sì che tutte le somme superino 10, bloccando ogni presa multipla.' },
    hand: [
      { id: 'swords-4', suit: 'swords', rank: 4 },
      { id: 'cups-9', suit: 'cups', rank: 9 },
    ],
    table: [
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'coins-6', suit: 'coins', rank: 6 },
    ],
    correctPlay: { cardId: 'cups-9', captureIds: [] },
    explanation: { en: 'Neither card captures: no rank matches (table has 5 and 6), and 5+6=11≠4 or 9. Both are valid discards. Discard {{card:swords-4}}: table becomes {5, 6, 4}. Now 5+4=9 (opponent with 9 captures two cards) and 6+4=10 (opponent with 10 captures two cards) — two dangerous captures open up. Discard {{card:cups-9}}: table becomes {5, 6, 9}. Every subset sum exceeds 10 (5+6=11, 5+9=14, 6+9=15). No multi-card captures are possible. Discard the 9 and lock the table.', it: 'Nessuna presa: 5+6=11≠4 e ≠9. Scartare il 4: {5,6,4}, 5+4=9 e 6+4=10 sono prese valide. Scartare il 9: {5,6,9}, tutte le somme >10. Nessuna presa multipla possibile.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-9',
        captureIds: [],
        priority: { en: 'Safe discard — all sums > 10', it: 'Scarto sicuro — tutte le somme > 10' },
        reason: { en: 'Table {5, 6, 9}: every subset sum exceeds 10, no multi-card captures possible.', it: 'Tavolo {5, 6, 9}: tutte le somme superano 10, nessuna presa multipla.' },
      },
      {
        cardId: 'swords-4',
        captureIds: [],
        priority: { en: 'Risky discard — opens sum captures', it: 'Scarto rischioso — apre catture per somma' },
        reason: { en: 'Table {5, 6, 4}: opponent can capture 5+4=9 or 6+4=10.', it: 'Tavolo {5, 6, 4}: l\'avversario può catturare 5+4=9 o 6+4=10.' },
      },
    ],
  },

  // S7: Scopa Blocking — avoid leaving a sweepable table
  {
    id: 'S7-P1',
    nodeId: 'S7',
    type: 'practice',
    goal: { en: 'Discard the card that makes the table impossible to sweep in one play.', it: 'Scarta la carta che rende il tavolo impossibile da spazzare in una mossa.' },
    requiredNodes: ['S6'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Block the scopa', it: 'Blocca la scopa' },
    description: { en: 'You must discard — neither card can capture. The table has a 3 and a 4 (sum=7). One discard would leave the table sum at 9 — an opponent with a 9 can sweep everything in one play. The other leaves sum=16 — impossible to sweep (max rank is 10). Choose wisely.', it: 'Devi scartare: nessuna carta cattura. Il tavolo ha un 3 e un 4 (somma=7). Uno scarto lascia somma=9 (spazzabile con un 9); l\'altro lascia somma=16 (impossibile da spazzare). Scegli con attenzione.' },
    hand: [
      { id: 'cups-2', suit: 'cups', rank: 2 },
      { id: 'cups-9', suit: 'cups', rank: 9 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    correctPlay: { cardId: 'cups-9', captureIds: [] },
    explanation: { en: 'Table: 3+4=7. If you discard the 2: table becomes {3, 4, 2}, sum=9. An opponent holding a 9 captures all three in one play — scopa! If you discard the 9: table becomes {3, 4, 9}, sum=16. No card of rank 16 exists; the opponent can capture subsets (9+4=13? no; 9+3=12? no; 4+3=7 yes, but 9 remains). A full sweep is impossible. Discard the 9 to make the table un-sweepable.', it: 'Scartare il 2: somma=9, spazzabile con un 9. Scartare il 9: somma=16, impossibile da spazzare. Scarta il 9 per bloccare la scopa avversaria.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-9',
        captureIds: [],
        priority: { en: 'Safe discard — sweep impossible', it: 'Scarto sicuro — spazzata impossibile' },
        reason: { en: 'Table sum becomes 16; no card rank exists to sweep all three.', it: 'La somma diventa 16: nessun rango di carta può spazzare tutte e tre.' },
      },
      {
        cardId: 'cups-2',
        captureIds: [],
        priority: { en: 'Risky discard — opponent can scopa with a 9', it: 'Scarto rischioso — l\'avversario può fare scopa con un 9' },
        reason: { en: 'Table sum becomes 9; opponent plays a 9 to sweep everything.', it: 'La somma diventa 9: l\'avversario gioca un 9 per spazzare tutto.' },
      },
    ],
  },

  {
    id: 'S7-C1',
    nodeId: 'S7',
    type: 'challenge',
    requiredNodes: ['S6'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Both discards look dangerous', it: 'Entrambi gli scarti sembrano pericolosi' },
    description: { en: 'You must discard — no captures available. Two cards in hand. Figure out which discard leaves the opponent the harder scopa opportunity.', it: 'Devi scartare — nessuna presa disponibile. Quale scarto rende più difficile la scopa per l\'avversario?' },
    hand: [
      { id: 'swords-3', suit: 'swords', rank: 3 },
      { id: 'cups-8', suit: 'cups', rank: 8 },
    ],
    table: [
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
      { id: 'coins-5', suit: 'coins', rank: 5 },
    ],
    correctPlay: { cardId: 'cups-8', captureIds: [] },
    explanation: { en: 'Neither card captures: {{card:swords-3}} (3≠2, 3≠5, 2+5=7≠3) and {{card:cups-8}} (8≠2, 8≠5, 2+5=7≠8) — both must discard. Table: 2, 5 (sum=7). Discard {{card:swords-3}}: table becomes {2, 5, 3} (sum=10). Opponent can sweep all three with any 10 — scopa. Discard {{card:cups-8}}: table becomes {2, 5, 8} (sum=15). No card of rank 15 exists; a full sweep is impossible. Discarding the 8 removes the scopa threat.', it: 'Nessuna presa: swords-3 (3≠2, 3≠5, 2+5=7≠3) e cups-8 (8≠2, 8≠5, 2+5=7≠8). Scartare il 3: somma=10, spazzabile con un 10. Scartare l\'8: somma=15, nessuna spazzata possibile.' },
    helpHints: [
      { en: 'Add up the table sum after each potential discard.', it: 'Calcola la somma del tavolo dopo ogni possibile scarto.' },
      { en: 'A scopa requires capturing ALL table cards in one play.', it: 'Una scopa richiede di catturare TUTTE le carte del tavolo in una sola mossa.' },
      { en: 'Maximum card rank is 10 — if the total table sum exceeds 10, no single card can sweep everything.', it: 'Il rango massimo è 10: se la somma totale del tavolo supera 10, nessuna carta può spazzare tutto in una mossa.' },
    ],
    rankedPlays: [
      {
        cardId: 'cups-8',
        captureIds: [],
        priority: { en: 'Better discard — sweep impossible', it: 'Scarto migliore — spazzata impossibile' },
        reason: { en: 'Table sum becomes 15 — no card can sweep in one play (max rank = 10).', it: 'La somma diventa 15: nessuna carta può spazzare in una mossa (rango max = 10).' },
      },
      {
        cardId: 'swords-3',
        captureIds: [],
        priority: { en: 'Riskier discard — sweep with 10 possible', it: 'Scarto più rischioso — spazzata con 10 possibile' },
        reason: { en: 'Table sum becomes 10 — opponent can sweep all three cards with any 10.', it: 'La somma diventa 10: l\'avversario può spazzare tutte e tre le carte con qualsiasi 10.' },
      },
    ],
  },

  // S8: Key Card Protection — never discard key cards
  {
    id: 'S8-P1',
    nodeId: 'S8',
    type: 'practice',
    goal: { en: 'You must discard. Choose the card that is least harmful to your scoring position.', it: 'Devi scartare. Scegli la carta meno dannosa per il tuo punteggio.' },
    requiredNodes: ['S2', 'S6'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Which card to sacrifice?', it: 'Quale carta sacrificare?' },
    description: { en: 'No captures are available. You must discard one of three cards. Two are strong primiera cards in suits you need; one is a face card (low primiera value, no special scoring). Discard the face card.', it: 'Nessuna presa disponibile. Devi scartare una delle tre carte. Due sono forti per la Primiera; una è una figura (basso valore primiera). Scarta la figura.' },
    hand: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'cups-6', suit: 'cups', rank: 6 },
      { id: 'swords-10', suit: 'swords', rank: 10 },
    ],
    table: [
      { id: 'clubs-1', suit: 'clubs', rank: 1 },
      { id: 'cups-4', suit: 'cups', rank: 4 },
    ],
    correctPlay: { cardId: 'swords-10', captureIds: [] },
    explanation: { en: 'The {{card:coins-7}} is the settebello — never discard it. The {{card:cups-6}} is worth 18 primiera points in Cups — a strong card not to give up. The {{card:swords-10}} is worth only 10 primiera points and has no special scoring. It\'s the least valuable discard. Sacrifice the face card to keep your key cards.', it: 'Il 7 di denari è il settebello: mai scartarlo. Il 6 di coppe vale 18 punti primiera. Il 10 di spade vale solo 10 punti primiera: è il sacrificio meno costoso.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-10',
        captureIds: [],
        priority: { en: 'Least valuable discard', it: 'Scarto meno prezioso' },
        reason: { en: '{{card:swords-10}} = 10 primiera pts, no special scoring. Sacrifice it over the 7 or 6.', it: '10 di spade = 10 punti primiera, nessun punteggio speciale. Sacrificalo rispetto al 7 o al 6.' },
      },
      {
        cardId: 'cups-6',
        captureIds: [],
        priority: { en: 'Costly discard', it: 'Scarto costoso' },
        reason: { en: '{{card:cups-6}} = 18 primiera pts — losing it weakens your Cups coverage.', it: '6 di coppe = 18 punti primiera: perderlo indebolisce la copertura di Coppe.' },
      },
      {
        cardId: 'coins-7',
        captureIds: [],
        priority: { en: 'Never discard', it: 'Mai scartare' },
        reason: { en: 'Settebello on the table = free point for the opponent.', it: 'Il settebello sul tavolo = punto gratis per l\'avversario.' },
      },
    ],
  },

  // S9: Primiera Suit Coverage — weakest slot first
  {
    id: 'S9-P1',
    nodeId: 'S9',
    type: 'practice',
    goal: { en: 'Two captures available. Choose the one that improves your weakest primiera suit slot.', it: 'Due prese disponibili. Scegli quella che migliora il tuo seme più debole nella Primiera.' },
    requiredNodes: ['S5'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Weakest suit wins', it: 'Il seme più debole vince' },
    description: { en: 'You have Cups (7=21pts), Coins (6=18pts), Swords (3=13pts) — but nothing in Clubs. Your Clubs slot is 0 pts. Both captures available: one takes a Clubs card, the other doesn\'t. Go for the missing suit.', it: 'Hai Coppe (7=21), Denari (6=18), Spade (3=13), ma nulla in Bastoni (0 punti). Due prese: una include Bastoni, l\'altra no. Scegli quella che riempie Bastoni.' },
    hand: [
      { id: 'cups-9', suit: 'cups', rank: 9 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    table: [
      { id: 'clubs-9', suit: 'clubs', rank: 9 },
      { id: 'coins-2', suit: 'coins', rank: 2 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-9', captureIds: ['clubs-9'] },
    explanation: { en: 'Playing the {{card:cups-9}} takes the {{card:clubs-9}} (mandatory rank match). That fills your empty Clubs slot with 10 primiera points — far better than leaving it at 0. The {{card:swords-4}} can capture 2+2=4, giving you two non-Clubs cards that don\'t help your weakest slot. The rank-match rule forces the 9 capture anyway, but even if you had a choice, filling the empty slot is correct.', it: 'Giocare il 9 di coppe prende il 9 di bastoni (presa obbligatoria). Riempie il seme Bastoni con 10 punti invece di 0.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-9',
        captureIds: ['clubs-9'],
        priority: { en: 'Fills empty Clubs slot', it: 'Riempie il seme Bastoni vuoto' },
        reason: { en: '0 → 10 primiera pts in Clubs; mandatory rank match anyway.', it: '0 → 10 punti primiera in Bastoni; presa obbligatoria comunque.' },
      },
      {
        cardId: 'swords-4',
        captureIds: ['coins-2', 'cups-2'],
        priority: { en: 'More cards, no suit help', it: 'Più carte, nessun aiuto ai semi' },
        reason: { en: 'Captures 2 cards but neither fills the missing Clubs slot.', it: 'Cattura 2 carte ma nessuna riempie il seme Bastoni mancante.' },
      },
    ],
  },

  // S10: Point Landscape — secured/lost/contested
  {
    id: 'S10-P1',
    nodeId: 'S10',
    type: 'practice',
    goal: { en: 'You must discard. Pick the discard that best serves the contested categories (Scope and Carte).', it: 'Devi scartare. Scegli lo scarto che serve meglio le categorie contese (Scope e Carte).' },
    requiredNodes: ['S9'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Read the landscape', it: 'Leggi la mappa dei punti' },
    description: { en: 'Mid-game: you captured 14 cards (4 Coins) and hold the settebello. Opponent: 10 cards, 6 Coins, 1 scopa. No captures available. Point landscape: Settebello = secured; Ori = lost; Scope and Carte = contested. Discard to protect those contested categories.', it: 'A metà partita: 14 carte (4 denari) e settebello. Avversario: 10 carte, 6 denari, 1 scopa. Nessuna presa. Scarta per proteggere le categorie contese.' },
    hand: [
      { id: 'cups-5', suit: 'cups', rank: 5 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    table: [
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
      { id: 'coins-4', suit: 'coins', rank: 4 },
    ],
    capturedPiles: [
      [{ id: 'coins-7', suit: 'coins', rank: 7 }],
      [],
    ],
    correctPlay: { cardId: 'cups-5', captureIds: [] },
    explanation: { en: 'Neither hand card can capture (5 ≠ 2, 5 ≠ 4, 2+4=6; 3 ≠ 2, 3 ≠ 4, no pair sums to 3). You must discard. Point landscape: Settebello = SECURED (you have it). Ori = LOST (opponent 6 Coins vs your 4 — majority secured, no catching up). Scope = CONTESTED (1–0, many turns left). Carte = CONTESTED (14 vs 10, 14 cards remain). Stop caring about Ori. Focus every remaining move on Scope and Carte. Between the two discards: discarding 5 leaves table 2, 4, 5 (sum=11 — no single-card sweep). Discarding 3 leaves table 2, 4, 3 (sum=9 — opponent can sweep with any 9, giving them a scopa point). Discard the 5; protect the scope lead.', it: 'Nessuna presa possibile. Mappa: Settebello assicurato, Ori perso, Scope e Carte contesi. Scartare il 5 lascia somma=11 (nessuna spazzata); scartare il 3 lascia somma=9 (scopa con un 9). Scarta il 5.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-5',
        captureIds: [],
        priority: { en: 'Safer discard — protects Scope', it: 'Scarto più sicuro — protegge Scope' },
        reason: { en: 'Table sum becomes 11 — no single-card sweep possible; opponent cannot score a scopa.', it: 'La somma diventa 11: nessuna spazzata possibile, l\'avversario non può fare scopa.' },
      },
      {
        cardId: 'swords-3',
        captureIds: [],
        priority: { en: 'Riskier — sweep with 9 possible', it: 'Più rischioso — spazzata con 9 possibile' },
        reason: { en: 'Table sum becomes 9 — opponent can sweep with any 9, scoring a scopa in a contested category.', it: 'La somma diventa 9: l\'avversario può fare scopa con un 9, segnando in una categoria contesa.' },
      },
    ],
  },

  // S11: Opponent Modeling — predict what the opponent has
  {
    id: 'S11-P1',
    nodeId: 'S11',
    type: 'practice',
    goal: { en: 'Deduce from what has been played whether the opponent is likely to hold a 7.', it: 'Deduci dalle carte già giocate se è probabile che l\'avversario abbia un 7.' },
    requiredNodes: ['S10'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Track what is left', it: 'Tieni traccia di ciò che rimane' },
    description: { en: 'Three 7s have been played/captured already ({{card:cups-7}}, {{card:clubs-7}}, {{card:swords-7}}). The {{card:coins-7}} (settebello) is still on the table. Your {{card:cups-7}} is in hand — capture it before the opponent can.', it: 'Tre 7 sono già stati giocati/catturati. Il settebello è ancora sul tavolo. Prendilo prima che lo faccia l\'avversario.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['coins-7'] },
    explanation: { en: 'Three 7s are accounted for. The only remaining 7 is the settebello on the table. You have the {{card:cups-7}} — play it to capture the settebello (mandatory rank match). This is opponent modeling at its simplest: you know the settebello is capturable right now, and you have the card to do it. Take it.', it: 'Tre 7 sono già fuori. L\'unico 7 rimasto è il settebello sul tavolo. Prendilo con il 7 di coppe (presa obbligatoria).' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Capture settebello — now or never', it: 'Cattura il settebello — ora o mai' },
        reason: { en: 'All other 7s are gone. This is your only chance to secure the settebello point.', it: 'Tutti gli altri 7 sono fuori. È la tua unica occasione per il punto settebello.' },
      },
    ],
  },

  // S12: Lookahead — consider the opponent's best response
  {
    id: 'S12-P1',
    nodeId: 'S12',
    type: 'practice',
    goal: { en: 'Play the card that sweeps the table — and prevents the opponent from scopaing next turn.', it: 'Gioca la carta che spazza il tavolo: impedisce all\'avversario di fare scopa al turno dopo.' },
    requiredNodes: ['S11'],
    config: BASE_CONFIG,
    playerIndex: 0,
    title: { en: 'Think one step ahead', it: 'Pensa un passo avanti' },
    description: { en: 'Two plays available: {{card:cups-3}} takes the {{card:clubs-3}} (mandatory rank match), leaving the {{card:swords-6}} on the table. {{card:coins-9}} sweeps both cards (3+6=9) for a scopa. Ask yourself: if I play {{card:cups-3}}, what does the opponent do next turn?', it: 'Due giocate: cups-3 prende il 3 di bastoni (presa obbligatoria) lasciando il 6 di spade sul tavolo. coins-9 spazza tutto (3+6=9) per una scopa. Chiediti: se gioco cups-3, cosa fa l\'avversario al turno dopo?' },
    hand: [
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'coins-9', suit: 'coins', rank: 9 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'swords-6', suit: 'swords', rank: 6 },
    ],
    correctPlay: { cardId: 'coins-9', captureIds: ['clubs-3', 'swords-6'] },
    explanation: { en: '{{card:coins-9}}: no rank-9 on table, so 3+6=9 subset sum applies. Captures both cards, clears the table — scopa! Table is empty; the opponent must discard next turn. {{card:cups-3}}: mandatory rank match with {{card:clubs-3}}. Takes only {{card:clubs-3}}, leaving {{card:swords-6}} on the table alone. The opponent plays any 6 to take it — and since {{card:swords-6}} is the only card left, that\'s a scopa for them. Lookahead reveals: play {{card:cups-3}} → gift the opponent a scopa. Play {{card:coins-9}} → you score instead. The scopa play wins.', it: 'coins-9: 3+6=9 (somma, nessun 9 sul tavolo). Spazza tutto = scopa! cups-3: presa obbligatoria con clubs-3, lascia swords-6 — l\'avversario fa scopa con un 6. Il ragionamento anticipa le conseguenze: coins-9 è la mossa giusta.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-9',
        captureIds: ['clubs-3', 'swords-6'],
        priority: { en: 'Scopa — blocks opponent\'s response', it: 'Scopa — blocca la risposta avversaria' },
        reason: { en: '3+6=9 clears the table; opponent has nothing to sweep next turn.', it: '3+6=9 svuota il tavolo; l\'avversario non ha nulla da spazzare al turno dopo.' },
      },
      {
        cardId: 'cups-3',
        captureIds: ['clubs-3'],
        priority: { en: 'Leaves {{card:swords-6}} alone — opponent scopas', it: 'Lascia swords-6 solo — l\'avversario fa scopa' },
        reason: { en: 'Mandatory rank match takes {{card:clubs-3}}; {{card:swords-6}} alone on table lets any 6 sweep it.', it: 'Presa obbligatoria su clubs-3; swords-6 rimasto solo è spazzabile da qualsiasi 6.' },
      },
    ],
  },
]
