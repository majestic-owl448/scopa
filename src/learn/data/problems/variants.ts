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

const V1_CONFIG = { ...BASE_CONFIG, scopaDAssi: true, aceScoresScopa: true }
const V2_CONFIG = { ...BASE_CONFIG, napola: true }
const V3_CONFIG = { ...BASE_CONFIG, settanta: true }
const V4_CONFIG = { ...BASE_CONFIG, reBello: true }
const V5_CONFIG = { ...BASE_CONFIG, rosmarino: true }
const V6_CONFIG = { ...BASE_CONFIG, primieraValues: 'veneto' as const }
const V7_CONFIG = { ...BASE_CONFIG, primieraValues: 'milano' as const }
const V8_CONFIG = { ...BASE_CONFIG, captureTarget: 'quindici' as const }
const V9_CONFIG = { ...BASE_CONFIG, captureTarget: 'undici' as const }
const V10_CONFIG = { ...BASE_CONFIG, inversa: true }

export const VARIANT_PROBLEMS: TrainerProblem[] = [

  // ── V1: Scopa d'Assi ─────────────────────────────────────────────────────────

  {
    id: 'V1-R-P1',
    nodeId: 'V1-R',
    type: 'practice',
    goal: { en: 'Play the Ace to sweep the entire table for a scopa.', it: 'Gioca l\'asso per spazzare tutto il tavolo e fare scopa.' },
    requiredNodes: ['F-7'],
    config: V1_CONFIG,
    playerIndex: 0,
    title: { en: 'Ace sweeps everything', it: 'L\'asso spazza tutto' },
    description: { en: 'In Scopa d\'Assi, playing an Ace captures every card on the table — and scores a scopa point. Use it now to take all three table cards.', it: 'In Scopa d\'Assi, l\'asso cattura tutte le carte sul tavolo e vale una scopa. Usalo per prendere tutte e tre le carte.' },
    hand: [
      { id: 'cups-1', suit: 'cups', rank: 1 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'coins-4', suit: 'coins', rank: 4 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-1', captureIds: ['clubs-3', 'coins-4', 'cups-2'] },
    explanation: { en: 'The Ace (in Scopa d\'Assi) captures ALL table cards in one play and scores a scopa point. The {{card:swords-5}} could capture 3+2=5 (two cards), but the Ace sweep gets three cards plus a scopa. Always prefer the Ace sweep over a partial capture.', it: 'L\'asso cattura tutte le carte del tavolo e vale una scopa. Il 5 potrebbe prendere 3+2=5 (due carte), ma l\'asso prende tre carte e una scopa.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-1',
        captureIds: ['clubs-3', 'coins-4', 'cups-2'],
        priority: { en: 'Ace sweep — 3 cards + scopa', it: 'Spazzata con l\'asso — 3 carte + scopa' },
        reason: { en: 'Takes every table card and scores a scopa point.', it: 'Prende tutte le carte del tavolo e vale un punto scopa.' },
      },
      {
        cardId: 'swords-5',
        captureIds: ['clubs-3', 'cups-2'],
        priority: { en: 'Partial capture — 2 cards, no scopa', it: 'Presa parziale — 2 carte, nessuna scopa' },
        reason: { en: '3+2=5 captures two cards but wastes the Ace advantage.', it: '3+2=5 cattura due carte ma non sfrutta il vantaggio dell\'asso.' },
      },
    ],
  },

  {
    id: 'V1-S1-P1',
    nodeId: 'V1-S1',
    type: 'practice',
    goal: { en: 'The table is empty — you must discard. Keep the Ace.', it: 'Il tavolo è vuoto: devi scartare. Tieni l\'asso.' },
    requiredNodes: ['V1-R'],
    config: V1_CONFIG,
    playerIndex: 0,
    title: { en: 'Never discard the Ace', it: 'Non scartare mai l\'asso' },
    description: { en: 'The table is empty — neither card can capture. You must discard one. Never put the Ace on the table: the opponent could capture it. Discard the other card.', it: 'Il tavolo è vuoto: nessuna carta può catturare. Devi scartare. Non mettere mai l\'asso sul tavolo: l\'avversario potrebbe prenderlo.' },
    hand: [
      { id: 'cups-1', suit: 'cups', rank: 1 },
      { id: 'swords-8', suit: 'swords', rank: 8 },
    ],
    table: [],
    correctPlay: { cardId: 'swords-8', captureIds: [] },
    explanation: { en: 'With an empty table, no captures are possible — you must discard. Never discard the Ace: if it sits on the table, the opponent plays their Ace and sweeps it along with every other card that accumulates. The {{card:swords-8}} is the sacrifice. Keep the Ace for when the table is stocked.', it: 'Con il tavolo vuoto devi scartare. Mai l\'asso: se finisce sul tavolo l\'avversario può spazzarlo. Sacrifica l\'8 di spade.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-8',
        captureIds: [],
        priority: { en: 'Safe discard — Ace protected', it: 'Scarto sicuro — asso protetto' },
        reason: { en: 'Sacrifices a low-value card; keeps the Ace for a future sweep.', it: 'Sacrifica una carta di basso valore; conserva l\'asso per una spazzata futura.' },
      },
      {
        cardId: 'cups-1',
        captureIds: [],
        priority: { en: 'Never — Ace on table is a gift', it: 'Mai — l\'asso sul tavolo è un regalo' },
        reason: { en: 'The opponent\'s Ace will sweep it along with everything else that accumulates.', it: 'L\'asso avversario lo spazzerà insieme a tutto ciò che si accumula.' },
      },
    ],
  },

  {
    id: 'V1-S2-P1',
    nodeId: 'V1-S2',
    type: 'practice',
    goal: { en: 'Save the Ace for later — use the other card to capture now.', it: 'Conserva l\'asso per dopo: usa l\'altra carta per catturare adesso.' },
    requiredNodes: ['V1-R', 'S6'],
    config: V1_CONFIG,
    playerIndex: 0,
    title: { en: 'Ace timing', it: 'Tempistica dell\'asso' },
    description: { en: 'Table has one card. You can sweep it with the Ace (1 card + scopa), or capture it with the matching card instead — saving the Ace for when the table is fuller.', it: 'Il tavolo ha una carta. Puoi spazzarla con l\'asso (1 carta + scopa), oppure catturarla con la carta corrispettiva — conservando l\'asso per quando il tavolo sarà più pieno.' },
    hand: [
      { id: 'cups-1', suit: 'cups', rank: 1 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    table: [
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
    ],
    correctPlay: { cardId: 'swords-4', captureIds: ['clubs-4'] },
    explanation: { en: 'Playing {{card:swords-4}} captures {{card:clubs-4}} via mandatory rank match — same result as the Ace sweep (1 card), but the Ace is preserved. A future sweep over 3–4 table cards scores far more than this single-card table. Save the Ace for a high-value moment.', it: 'Il 4 di spade cattura il 4 di bastoni (presa obbligatoria) — stesso risultato dell\'asso, ma l\'asso è conservato per una spazzata più ricca in futuro.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-4',
        captureIds: ['clubs-4'],
        priority: { en: 'Save the Ace', it: 'Conserva l\'asso' },
        reason: { en: 'Captures the only table card without spending the Ace; Ace is more valuable later.', it: 'Cattura l\'unica carta del tavolo senza spendere l\'asso; l\'asso vale di più in futuro.' },
      },
      {
        cardId: 'cups-1',
        captureIds: ['clubs-4'],
        priority: { en: 'Wastes the Ace on a 1-card sweep', it: 'Spreca l\'asso per una spazzata di 1 carta' },
        reason: { en: 'Same result as using {{card:swords-4}} but burns the Ace prematurely.', it: 'Stesso risultato del 4 di spade ma brucia l\'asso prematuramente.' },
      },
    ],
  },

  // ── V2: Napola ────────────────────────────────────────────────────────────────

  {
    id: 'V2-R-P1',
    nodeId: 'V2-R',
    type: 'practice',
    goal: { en: 'Two captures available — choose the one that picks up a low Coins card for the Napola run.', it: 'Due prese disponibili: scegli quella che prende una bassa carta di denari per la Napola.' },
    requiredNodes: ['F-7'],
    config: V2_CONFIG,
    playerIndex: 0,
    title: { en: 'Start the Napola run', it: 'Inizia la sequenza Napola' },
    description: { en: 'Napola scores 1+ points for holding A–2–3 of Coins (and more for each extra consecutive Coins card). Two captures are available with your 7. Pick the one that grabs the {{card:coins-3}}.', it: 'La Napola dà punti per la sequenza A–2–3 di denari (e di più per ogni carta consecutiva extra). Due prese con il tuo 7: scegli quella che prende il 3 di denari.' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    table: [
      { id: 'coins-3', suit: 'coins', rank: 3 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['coins-3', 'clubs-4'] },
    explanation: { en: '3+4=7 works two ways: {{{card:coins-3}}, {{card:clubs-4}}} or {{{card:swords-3}}, {{card:clubs-4}}}. Both capture 2 cards. The difference is whether you pick up the {{card:coins-3}}. Under Napola, low Coins cards (A, 2, 3...) are the building blocks of the run. The {{card:coins-3}} is essential — it extends to or completes a run starting from the Ace. Always prefer the Coins card when the card count is equal.', it: '3+4=7 si fa in due modi: con il 3 di denari o il 3 di spade. Prendi il 3 di denari: è fondamentale per costruire la sequenza Napola.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['coins-3', 'clubs-4'],
        priority: { en: 'Napola card captured', it: 'Carta Napola catturata' },
        reason: { en: 'Picks up the {{card:coins-3}} — key card for the A-2-3 Coins run.', it: 'Prende il 3 di denari: carta chiave per la sequenza A-2-3 di denari.' },
      },
      {
        cardId: 'swords-7',
        captureIds: ['swords-3', 'clubs-4'],
        priority: { en: 'Same count, no Napola benefit', it: 'Stesso numero, nessun beneficio Napola' },
        reason: { en: 'Takes 2 cards but misses the Coins card needed for the run.', it: 'Prende 2 carte ma perde il denaro necessario per la sequenza.' },
      },
    ],
  },

  {
    id: 'V2-S1-P1',
    nodeId: 'V2-S1',
    type: 'practice',
    goal: { en: 'Capture with the non-Napola card — keep your {{card:coins-2}} safe in hand.', it: 'Cattura con l\'altra carta: tieni il 2 di denari al sicuro in mano.' },
    requiredNodes: ['V2-R'],
    config: V2_CONFIG,
    playerIndex: 0,
    title: { en: 'Protect the Napola cards', it: 'Proteggi le carte Napola' },
    description: { en: 'Your {{card:coins-2}} is a critical Napola card. You can capture with it (discard move — puts it on the table) or capture with the {{card:swords-9}} instead. Use the 9 to capture, keep the {{card:coins-2}} safe.', it: 'Il 2 di denari è una carta Napola critica. Puoi catturare con esso oppure con il 9 di spade. Usa il 9 per catturare e tieni il 2 di denari.' },
    hand: [
      { id: 'coins-2', suit: 'coins', rank: 2 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
    ],
    table: [
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'clubs-6', suit: 'clubs', rank: 6 },
    ],
    correctPlay: { cardId: 'swords-9', captureIds: ['cups-3', 'clubs-6'] },
    explanation: { en: '{{card:swords-9}} captures 3+6=9 — both table cards. {{card:coins-2}} cannot capture anything here (2≠3, 2≠6, 3+6=9≠2). But if you played {{card:coins-2}} as a discard, you\'d lose a Napola card. Use {{card:swords-9}} to capture; keep {{card:coins-2}} safely in hand for when it can be used to extend or complete the Napola run.', it: 'Il 9 di spade cattura 3+6=9. Non usare mai il 2 di denari come scarto: è una carta Napola. Usa il 9.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-9',
        captureIds: ['cups-3', 'clubs-6'],
        priority: { en: 'Capture with non-Napola card', it: 'Cattura con la carta non-Napola' },
        reason: { en: 'Takes both table cards; preserves the {{card:coins-2}} for the run.', it: 'Prende entrambe le carte del tavolo; conserva il 2 di denari per la sequenza.' },
      },
    ],
  },

  {
    id: 'V2-S2-P1',
    nodeId: 'V2-S2',
    type: 'practice',
    goal: { en: 'Two captures available — take the one that steals the opponent\'s {{card:coins-2}}.', it: 'Due prese disponibili: scegli quella che sottrae il 2 di denari all\'avversario.' },
    requiredNodes: ['V2-R', 'S10'],
    config: V2_CONFIG,
    playerIndex: 0,
    title: { en: 'Block the Napola run', it: 'Blocca la sequenza Napola' },
    description: { en: 'The opponent is building a Napola run — they already have the {{card:coins-1}}. The {{card:coins-2}} is on the table. Two captures available: one takes the {{card:coins-2}} (blocking their run), the other doesn\'t.', it: 'L\'avversario sta costruendo la Napola: ha già l\'asso di denari. Il 2 di denari è sul tavolo. Due prese: una lo prende (bloccando la sequenza), l\'altra no.' },
    hand: [
      { id: 'cups-6', suit: 'cups', rank: 6 },
    ],
    table: [
      { id: 'coins-2', suit: 'coins', rank: 2 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-6', captureIds: ['coins-2', 'clubs-4'] },
    explanation: { en: '2+4=6 works two ways: {{{card:coins-2}}, {{card:clubs-4}}} or {{{card:swords-2}}, {{card:clubs-4}}}. The opponent already has the {{card:coins-1}}. Letting them have the {{card:coins-2}} completes A-2 and gets them one step from A-2-3. Capture {{{card:coins-2}}, {{card:clubs-4}}} to deny their run. The {{card:swords-2}} is irrelevant to their Napola.', it: '2+4=6 in due modi. L\'avversario ha già l\'asso di denari. Prendi {2 di denari, 4 di bastoni} per bloccare la loro sequenza.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-6',
        captureIds: ['coins-2', 'clubs-4'],
        priority: { en: 'Blocks opponent\'s Napola run', it: 'Blocca la sequenza Napola avversaria' },
        reason: { en: 'Denies the {{card:coins-2}} — opponent can\'t complete A-2-3 without it.', it: 'Nega il 2 di denari: l\'avversario non può completare A-2-3 senza di esso.' },
      },
      {
        cardId: 'cups-6',
        captureIds: ['swords-2', 'clubs-4'],
        priority: { en: 'Misses the blocking opportunity', it: 'Perde l\'opportunità di blocco' },
        reason: { en: 'Leaves the {{card:coins-2}} on the table for the opponent to take.', it: 'Lascia il 2 di denari sul tavolo per l\'avversario.' },
      },
    ],
  },

  // ── V3: Settanta ──────────────────────────────────────────────────────────────

  {
    id: 'V3-R-P1',
    nodeId: 'V3-R',
    type: 'practice',
    goal: { en: 'Two captures available — capture the 7 (critical for Settanta and Primiera).', it: 'Due prese disponibili: cattura il 7 (critico per Settanta e Primiera).' },
    requiredNodes: ['F-7', 'S5'],
    config: V3_CONFIG,
    playerIndex: 0,
    title: { en: '7s are the most critical cards', it: 'I 7 sono le carte più critiche' },
    description: { en: 'Under Settanta, capturing all four 7s earns a bonus point. Each 7 also has the highest primiera value (21 pts). You have two plays — one captures a 7, the other doesn\'t.', it: 'Con Settanta, catturare tutti e quattro i 7 vale un punto bonus. Ogni 7 vale anche 21 punti primiera. Hai due giocate: una cattura un 7, l\'altra no.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-3', suit: 'swords', rank: 3 },
    ],
    table: [
      { id: 'clubs-7', suit: 'clubs', rank: 7 },
      { id: 'coins-4', suit: 'coins', rank: 4 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['clubs-7'] },
    explanation: { en: '{{card:cups-7}} must capture {{card:clubs-7}} (mandatory rank match). {{card:swords-3}} must capture {{card:cups-3}} (mandatory rank match). Both plays are forced, but which CARD do you choose to play? Playing {{card:cups-7}} captures {{card:clubs-7}} — a second 7 toward Settanta. Playing {{card:swords-3}} captures {{card:cups-3}} — a 3 with no special value. Prioritise the 7 capture every time.', it: 'cups-7 cattura clubs-7 (presa obbligatoria). swords-3 cattura cups-3. Scegli cups-7: il 7 di bastoni vale per Settanta e per Primiera.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['clubs-7'],
        priority: { en: 'Captures a 7 — Settanta + Primiera value', it: 'Cattura un 7 — valore Settanta + Primiera' },
        reason: { en: 'Every 7 captured is progress toward the Settanta bonus and 21 primiera points.', it: 'Ogni 7 catturato è progresso verso il bonus Settanta e 21 punti primiera.' },
      },
      {
        cardId: 'swords-3',
        captureIds: ['cups-3'],
        priority: { en: 'Captures a 3 — no special value', it: 'Cattura un 3 — nessun valore speciale' },
        reason: { en: 'A 3 has no Settanta relevance and low primiera value (13 pts).', it: 'Un 3 non ha rilevanza per Settanta e basso valore primiera (13 punti).' },
      },
    ],
  },

  {
    id: 'V3-S1-C1',
    nodeId: 'V3-S1',
    type: 'challenge',
    requiredNodes: ['V3-R'],
    config: V3_CONFIG,
    playerIndex: 0,
    title: { en: 'Deny the 4th 7', it: 'Nega il 4° 7' },
    description: { en: 'The opponent has captured three 7s — if they get the 4th, they win Settanta. The {{card:swords-7}} is on the table. Capture it before they do.', it: 'L\'avversario ha catturato tre 7: se prende il 4°, vince Settanta. Il 7 di spade è sul tavolo. Prendilo prima di loro.' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
      { id: 'cups-4', suit: 'cups', rank: 4 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'swords-4', suit: 'swords', rank: 4 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['coins-7'] },
    explanation: { en: '{{card:swords-7}} must capture {{card:coins-7}} (mandatory rank match). {{card:cups-4}} must capture {{card:swords-4}} (mandatory rank match). Which to play first? The opponent has three 7s — they score Settanta if they get the 4th. By playing {{card:swords-7}} now, you deny them {{card:coins-7}}. You also gain a 7 for yourself (potentially contesting Settanta). The 4-capture is still available next turn.', it: 'swords-7 cattura coins-7 (presa obbligatoria). Giocalo subito: l\'avversario ha tre 7 e il 4° gli darebbe Settanta. Nega il punto.' },
    helpHints: [
      { en: 'Count how many 7s the opponent has captured.', it: 'Conta quanti 7 ha catturato l\'avversario.' },
      { en: 'In Settanta, the 4th 7 scores the bonus point — getting there first matters.', it: 'In Settanta, il 4° 7 vale il punto bonus: arrivarci prima è fondamentale.' },
    ],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['coins-7'],
        priority: { en: 'Denies opponent\'s Settanta', it: 'Nega Settanta all\'avversario' },
        reason: { en: 'Takes the 4th 7 before the opponent; blocks their bonus point.', it: 'Prende il 4° 7 prima dell\'avversario; blocca il loro punto bonus.' },
      },
      {
        cardId: 'cups-4',
        captureIds: ['swords-4'],
        priority: { en: 'Leaves the 7 — opponent wins Settanta', it: 'Lascia il 7 — l\'avversario vince Settanta' },
        reason: { en: 'The opponent takes {{card:coins-7}} on their next turn and completes Settanta.', it: 'L\'avversario prende coins-7 al prossimo turno e completa Settanta.' },
      },
    ],
  },

  // ── V4: Re Bello ─────────────────────────────────────────────────────────────

  {
    id: 'V4-R-P1',
    nodeId: 'V4-R',
    type: 'practice',
    goal: { en: 'Capture the Re Bello ({{card:coins-10}}) — it scores 1 point.', it: 'Cattura il Re Bello (10 di denari): vale 1 punto.' },
    requiredNodes: ['F-7'],
    config: V4_CONFIG,
    playerIndex: 0,
    title: { en: 'The Re Bello scores a point', it: 'Il Re Bello vale un punto' },
    description: { en: 'In Re Bello, capturing the {{card:coins-10}} earns 1 point — just like the settebello. Your {{card:cups-10}} matches it by rank. Capture the Re Bello now.', it: 'Nel Re Bello, catturare il 10 di denari vale 1 punto come il settebello. Il tuo 10 di coppe lo cattura per rango. Prendilo adesso.' },
    hand: [
      { id: 'cups-10', suit: 'cups', rank: 10 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'coins-10', suit: 'coins', rank: 10 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'clubs-2', suit: 'clubs', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-10', captureIds: ['coins-10'] },
    explanation: { en: '{{card:cups-10}} must capture {{card:coins-10}} (mandatory rank match) — and that capture picks up the Re Bello for 1 scoring point. {{card:swords-5}} could capture 3+2=5 (two cards), but it misses the Re Bello. Always prioritise key card captures over raw card count.', it: 'cups-10 cattura coins-10 (presa obbligatoria) e prende il Re Bello per 1 punto. Il 5 di spade potrebbe prendere 3+2=5 ma perde il punto chiave.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-10',
        captureIds: ['coins-10'],
        priority: { en: 'Re Bello — 1 point', it: 'Re Bello — 1 punto' },
        reason: { en: 'Captures the {{card:coins-10}} for an immediate guaranteed point.', it: 'Cattura il 10 di denari per un punto garantito.' },
      },
      {
        cardId: 'swords-5',
        captureIds: ['cups-3', 'clubs-2'],
        priority: { en: '2 cards, misses Re Bello', it: '2 carte, perde il Re Bello' },
        reason: { en: 'Takes more cards but leaves the Re Bello for the opponent.', it: 'Prende più carte ma lascia il Re Bello all\'avversario.' },
      },
    ],
  },

  {
    id: 'V4-S1-P1',
    nodeId: 'V4-S1',
    type: 'practice',
    goal: { en: 'Capture the Re Bello before the opponent can take it.', it: 'Cattura il Re Bello prima che l\'avversario lo prenda.' },
    requiredNodes: ['V4-R', 'S2'],
    config: V4_CONFIG,
    playerIndex: 0,
    title: { en: 'Re Bello in the priority list', it: 'Re Bello nella lista delle priorità' },
    description: { en: 'With Re Bello active, you have two key card targets: settebello ({{card:coins-7}}) and Re Bello ({{card:coins-10}}). Both are on the table. Your {{card:cups-10}} captures the Re Bello now — do it.', it: 'Con Re Bello attivo, hai due obiettivi chiave: settebello e Re Bello. Entrambi sono sul tavolo. Il tuo 10 di coppe cattura il Re Bello adesso.' },
    hand: [
      { id: 'cups-10', suit: 'cups', rank: 10 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
    ],
    table: [
      { id: 'coins-10', suit: 'coins', rank: 10 },
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-9', suit: 'clubs', rank: 9 },
    ],
    correctPlay: { cardId: 'cups-10', captureIds: ['coins-10'] },
    explanation: { en: '{{card:cups-10}} must capture {{card:coins-10}} (mandatory rank match) = Re Bello (1 pt). {{card:swords-9}} must capture {{card:clubs-9}} (mandatory rank match) = nothing special. The settebello ({{card:coins-7}}) stays on the table — it can be taken next turn. Re Bello and settebello are both 1-point guaranteed cards; get whichever you can reach first.', it: 'cups-10 cattura coins-10 (presa obbligatoria) = Re Bello (1 punto). swords-9 cattura clubs-9. Il settebello resta per il turno dopo. Prendi prima il Re Bello.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-10',
        captureIds: ['coins-10'],
        priority: { en: 'Re Bello — 1 point now', it: 'Re Bello — 1 punto adesso' },
        reason: { en: 'Captures the Re Bello immediately; settebello can follow next turn.', it: 'Cattura il Re Bello subito; il settebello può seguire al prossimo turno.' },
      },
      {
        cardId: 'swords-9',
        captureIds: ['clubs-9'],
        priority: { en: 'Misses Re Bello this turn', it: 'Perde il Re Bello questo turno' },
        reason: { en: 'Takes a plain 9; Re Bello stays on table for opponent to capture.', it: 'Prende un 9 normale; il Re Bello resta per l\'avversario.' },
      },
    ],
  },

  // ── V5: Rosmarino ─────────────────────────────────────────────────────────────

  {
    id: 'V5-R-P1',
    nodeId: 'V5-R',
    type: 'practice',
    goal: { en: 'Capture the Rosmarino ({{card:swords-8}}) — it scores 1 point.', it: 'Cattura il Rosmarino (8 di spade): vale 1 punto.' },
    requiredNodes: ['F-7'],
    config: V5_CONFIG,
    playerIndex: 0,
    title: { en: 'The {{card:swords-8}} scores a point', it: 'L\'8 di spade vale un punto' },
    description: { en: 'In Rosmarino, capturing the {{card:swords-8}} earns 1 point. Your {{card:cups-8}} matches it by rank. Capture the Rosmarino now.', it: 'Nel Rosmarino, catturare l\'8 di spade vale 1 punto. Il tuo 8 di coppe lo cattura per rango. Prendilo adesso.' },
    hand: [
      { id: 'cups-8', suit: 'cups', rank: 8 },
      { id: 'coins-5', suit: 'coins', rank: 5 },
    ],
    table: [
      { id: 'swords-8', suit: 'swords', rank: 8 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-8', captureIds: ['swords-8'] },
    explanation: { en: '{{card:cups-8}} must capture {{card:swords-8}} (mandatory rank match) — and that is the Rosmarino, worth 1 point. {{card:coins-5}} could capture 3+2=5 (two cards), but that misses the guaranteed point. Rosmarino joins settebello on the key card priority list.', it: 'cups-8 cattura swords-8 (presa obbligatoria) = Rosmarino (1 punto). Il 5 di denari potrebbe prendere 3+2=5 ma perde il punto.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-8',
        captureIds: ['swords-8'],
        priority: { en: 'Rosmarino — 1 point', it: 'Rosmarino — 1 punto' },
        reason: { en: 'Captures the {{card:swords-8}} for an immediate guaranteed point.', it: 'Cattura l\'8 di spade per un punto garantito.' },
      },
      {
        cardId: 'coins-5',
        captureIds: ['clubs-3', 'cups-2'],
        priority: { en: '2 cards, misses Rosmarino', it: '2 carte, perde il Rosmarino' },
        reason: { en: 'More cards but leaves the Rosmarino for the opponent.', it: 'Più carte ma lascia il Rosmarino all\'avversario.' },
      },
    ],
  },

  {
    id: 'V5-S1-P1',
    nodeId: 'V5-S1',
    type: 'practice',
    goal: { en: 'Prioritise capturing the Rosmarino over a bigger card-count capture.', it: 'Dai priorità al Rosmarino rispetto a una presa con più carte.' },
    requiredNodes: ['V5-R', 'S2'],
    config: V5_CONFIG,
    playerIndex: 0,
    title: { en: 'Rosmarino over quantity', it: 'Rosmarino prima della quantità' },
    description: { en: 'You have two cards to play. One can capture the Rosmarino (1 point). The other captures two non-special cards. Play the Rosmarino capture first.', it: 'Hai due carte da giocare. Una cattura il Rosmarino (1 punto). L\'altra cattura due carte non speciali. Gioca prima la presa del Rosmarino.' },
    hand: [
      { id: 'coins-8', suit: 'coins', rank: 8 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'swords-8', suit: 'swords', rank: 8 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-2', suit: 'cups', rank: 2 },
    ],
    correctPlay: { cardId: 'coins-8', captureIds: ['swords-8'] },
    explanation: { en: '{{card:coins-8}} must capture {{card:swords-8}} (mandatory rank match) — that is the Rosmarino (1 pt). {{card:swords-5}} can capture 3+2=5 (two cards, no special value). The Rosmarino point outweighs one extra card in almost every situation. If the opponent takes it before you, you lose a guaranteed point.', it: 'coins-8 cattura swords-8 (presa obbligatoria) = Rosmarino (1 punto). swords-5 prenderebbe 3+2=5 (due carte). Il punto Rosmarino vale più di una carta extra.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'coins-8',
        captureIds: ['swords-8'],
        priority: { en: 'Rosmarino — guaranteed point', it: 'Rosmarino — punto garantito' },
        reason: { en: 'The {{card:swords-8}} scores 1 point; never leave it for the opponent.', it: 'L\'8 di spade vale 1 punto; non lasciarlo mai all\'avversario.' },
      },
      {
        cardId: 'swords-5',
        captureIds: ['clubs-3', 'cups-2'],
        priority: { en: 'More cards, point lost', it: 'Più carte, punto perso' },
        reason: { en: 'Takes 2 cards but the Rosmarino stays on table for the opponent.', it: 'Prende 2 carte ma il Rosmarino resta per l\'avversario.' },
      },
    ],
  },

  // ── V6: Veneto Primiera ───────────────────────────────────────────────────────

  {
    id: 'V6-R-P1',
    nodeId: 'V6-R',
    type: 'practice',
    goal: { en: 'You must discard. In Veneto primiera, face cards (8/9/10) are worth 0 pts — discard the face card.', it: 'Devi scartare. Nella primiera veneta, le figure (8/9/10) valgono 0 punti: scarta la figura.' },
    requiredNodes: ['F-7', 'S5'],
    config: V6_CONFIG,
    playerIndex: 0,
    title: { en: 'Face cards are worthless in Veneto primiera', it: 'Le figure non valgono nulla nella primiera veneta' },
    description: { en: 'In Veneto primiera, face cards (8, 9, 10) score 0 primiera points. No captures available. You must discard — sacrifice the face card and keep the 7 (21 pts in any primiera system).', it: 'Nella primiera veneta, 8, 9 e 10 valgono 0 punti primiera. Nessuna presa disponibile. Devi scartare: sacrifica la figura e tieni il 7 (21 punti in ogni sistema primiera).' },
    hand: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'swords-10', suit: 'swords', rank: 10 },
    ],
    table: [
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'clubs-6', suit: 'clubs', rank: 6 },
    ],
    correctPlay: { cardId: 'swords-10', captureIds: [] },
    explanation: { en: 'Neither hand card can capture (7≠3, 7≠6, 3+6=9≠7; 10≠3, 10≠6, 3+6=9≠10). You must discard. In Veneto primiera, the {{card:swords-10}} is worth 0 primiera points — discarding it costs you nothing in that category. The {{card:coins-7}} is worth 21 pts AND is the settebello (1 scoring point). Never sacrifice it.', it: 'Nessuna presa possibile. Nella primiera veneta il 10 vale 0 punti primiera: scartarlo non costa nulla. Il 7 di denari vale 21 punti primiera ed è il settebello.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-10',
        captureIds: [],
        priority: { en: 'Ideal discard — 0 primiera pts in Veneto', it: 'Scarto ideale — 0 punti primiera in Veneto' },
        reason: { en: 'Face card with zero primiera value; costs nothing to discard.', it: 'Figura con valore primiera zero: scartarla non ha costo.' },
      },
      {
        cardId: 'coins-7',
        captureIds: [],
        priority: { en: 'Never discard — 21 pts + settebello', it: 'Mai scartare — 21 punti + settebello' },
        reason: { en: 'The {{card:coins-7}} is worth 21 primiera points AND scores the settebello point.', it: 'Il 7 di denari vale 21 punti primiera E il punto settebello.' },
      },
    ],
  },

  {
    id: 'V6-S1-P1',
    nodeId: 'V6-S1',
    type: 'practice',
    goal: { en: 'Must discard. In Veneto, the {{card:cups-9}} = 0 primiera pts. The {{card:coins-6}} = 18 pts. Discard the 9.', it: 'Devi scartare. In Veneto il 9 di coppe = 0 punti primiera. Il 6 di denari = 18 punti. Scarta il 9.' },
    requiredNodes: ['V6-R'],
    config: V6_CONFIG,
    playerIndex: 0,
    title: { en: 'Protect the 6, sacrifice the 9', it: 'Proteggi il 6, sacrifica il 9' },
    description: { en: 'In standard primiera, the 9 is worth 10 pts. In Veneto primiera, it\'s worth 0. So discarding the 9 costs you nothing in Veneto — while discarding the {{card:coins-6}} (18 pts) would be a real loss.', it: 'Nella primiera standard il 9 vale 10 punti; in quella veneta vale 0. Scartare il 9 non costa nulla in Veneto, mentre perdere il 6 di denari (18 punti) sarebbe una perdita reale.' },
    hand: [
      { id: 'cups-9', suit: 'cups', rank: 9 },
      { id: 'coins-6', suit: 'coins', rank: 6 },
    ],
    table: [
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-9', captureIds: [] },
    explanation: { en: 'Neither card can capture (9≠5, 9≠2, 5+2=7≠9; 6≠5, 6≠2, 5+2=7≠6). You must discard. In Veneto primiera, face cards (8, 9, 10) score 0 — so the {{card:cups-9}} contributes nothing to primiera regardless. Discard it freely. The {{card:coins-6}} is worth 18 primiera points in every system.', it: 'Nessuna presa possibile. Nella primiera veneta il 9 vale 0: scartarlo non costa nulla. Il 6 di denari vale 18 punti in ogni sistema.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-9',
        captureIds: [],
        priority: { en: 'Free discard in Veneto — 0 primiera pts', it: 'Scarto gratuito in Veneto — 0 punti primiera' },
        reason: { en: '9 is a face card worth 0 in Veneto primiera; losing it is costless.', it: 'Il 9 è una figura che vale 0 in Veneto: perderlo non ha costo.' },
      },
      {
        cardId: 'coins-6',
        captureIds: [],
        priority: { en: 'Costly discard — 18 primiera pts', it: 'Scarto costoso — 18 punti primiera' },
        reason: { en: 'The {{card:coins-6}} is worth 18 points in every primiera system including Veneto.', it: 'Il 6 di denari vale 18 punti in ogni sistema primiera, Veneto incluso.' },
      },
    ],
  },

  // ── V7: Milano Primiera ───────────────────────────────────────────────────────

  {
    id: 'V7-R-P1',
    nodeId: 'V7-R',
    type: 'practice',
    goal: { en: 'In Milano primiera, every 7 matters equally. Capture the 7 over the 4.', it: 'Nella primiera milanese, ogni 7 conta allo stesso modo. Cattura il 7 invece del 4.' },
    requiredNodes: ['F-7', 'S5'],
    config: V7_CONFIG,
    playerIndex: 0,
    title: { en: 'Most 7s wins Milano primiera', it: 'Chi ha più 7 vince la primiera milanese' },
    description: { en: 'In Milano primiera, the player with the most 7s wins. Ties go to most 6s, then most Aces. Every single 7 has equal weight — none is more valuable than another. Both plays are forced rank matches: pick the one that captures a 7.', it: 'Nella primiera milanese, vince chi ha più 7. Parità: più 6, poi più assi. Ogni 7 ha uguale peso. Entrambe le giocate sono prese obbligatorie: scegli quella che cattura un 7.' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
      { id: 'cups-4', suit: 'cups', rank: 4 },
    ],
    table: [
      { id: 'clubs-7', suit: 'clubs', rank: 7 },
      { id: 'coins-4', suit: 'coins', rank: 4 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['clubs-7'] },
    explanation: { en: '{{card:swords-7}} must capture {{card:clubs-7}} (rank match). {{card:cups-4}} must capture {{card:coins-4}} (rank match). In Milano primiera, the win condition is count of 7s — not primiera point totals. Capturing {{card:clubs-7}} puts you at 2 sevens; the opponent needs to match or exceed that. The 4 capture is irrelevant to the Milano system.', it: 'swords-7 cattura clubs-7 (presa obbligatoria). Nella primiera milanese conta il numero di 7: catturare clubs-7 ti porta a 2 sette. Il 4 non conta.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['clubs-7'],
        priority: { en: '+1 seven toward Milano primiera', it: '+1 sette verso la primiera milanese' },
        reason: { en: 'More 7s = winning the Milano primiera tiebreaker chain.', it: 'Più 7 = vincere la catena di spareggio della primiera milanese.' },
      },
      {
        cardId: 'cups-4',
        captureIds: ['coins-4'],
        priority: { en: 'Irrelevant to Milano primiera', it: 'Irrilevante per la primiera milanese' },
        reason: { en: '4s don\'t factor into the 7-6-Ace tiebreaker chain.', it: 'I 4 non rientrano nella catena di spareggio 7-6-Asso.' },
      },
    ],
  },

  {
    id: 'V7-S1-P1',
    nodeId: 'V7-S1',
    type: 'practice',
    goal: { en: 'Two captures available: one takes a 7, the other takes more cards. Capture the 7.', it: 'Due prese disponibili: una prende un 7, l\'altra prende più carte. Cattura il 7.' },
    requiredNodes: ['V7-R'],
    config: V7_CONFIG,
    playerIndex: 0,
    title: { en: 'Every 7 is equal weight', it: 'Ogni 7 ha uguale peso' },
    description: { en: 'Your {{card:cups-7}} can capture the {{card:clubs-7}} (rank match — mandatory) or a sum equal to 7. The rank match wins here — and it captures a 7 which is the most important card in Milano primiera.', it: 'Il tuo 7 di coppe cattura il 7 di bastoni (presa obbligatoria). La presa singola prevale — e cattura un 7, la carta più importante nella primiera milanese.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-6', suit: 'swords', rank: 6 },
    ],
    table: [
      { id: 'clubs-7', suit: 'clubs', rank: 7 },
      { id: 'coins-3', suit: 'coins', rank: 3 },
      { id: 'cups-4', suit: 'cups', rank: 4 },
    ],
    correctPlay: { cardId: 'cups-7', captureIds: ['clubs-7'] },
    explanation: { en: '{{card:cups-7}} has a rank match with {{card:clubs-7}} — mandatory. The 3+4=7 subset sum is forbidden when a rank match exists. {{card:swords-6}} has no capture. Best play: {{card:cups-7}} takes {{card:clubs-7}} (1 seven for Milano primiera). {{card:swords-6}} will be discarded next turn — 6s are second in the tiebreaker chain, so they matter if 7 counts are tied.', it: 'cups-7 cattura clubs-7 (presa obbligatoria). La somma 3+4=7 è vietata con la presa singola. swords-6 non cattura. Cattura il 7: è il punteggio più importante nella primiera milanese.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-7',
        captureIds: ['clubs-7'],
        priority: { en: 'Mandatory rank match — captures a 7', it: 'Presa obbligatoria — cattura un 7' },
        reason: { en: 'Rank match is forced; result is optimal for Milano primiera anyway.', it: 'La presa singola è obbligatoria; il risultato è comunque ottimale per la primiera milanese.' },
      },
    ],
  },

  // ── V8: Scopa a Quindici ──────────────────────────────────────────────────────

  {
    id: 'V8-R-P1',
    nodeId: 'V8-R',
    type: 'practice',
    goal: { en: 'Find the capture where your card + the table card(s) = 15.', it: 'Trova la presa in cui la tua carta + le carte del tavolo = 15.' },
    requiredNodes: ['F-7'],
    config: V8_CONFIG,
    playerIndex: 0,
    title: { en: 'Captures must sum to 15', it: 'Le prese devono sommare a 15' },
    description: { en: 'In Scopa a Quindici, your played card plus the captured card(s) must total exactly 15. Your {{card:swords-7}} plus which table card(s) = 15?', it: 'In Scopa a Quindici, la tua carta più le carte catturate deve fare esattamente 15. Il tuo 7 di spade più quali carte del tavolo fa 15?' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    table: [
      { id: 'coins-8', suit: 'coins', rank: 8 },
      { id: 'clubs-7', suit: 'clubs', rank: 7 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['coins-8'] },
    explanation: { en: 'In Quindici, your card + captured group = 15. {{card:swords-7}}: 7+8=15 ✓ captures {{card:coins-8}}. 7+7=14≠15. 7+2=9≠15. No other group sums to 8 from {7, 2}. Only {{{card:coins-8}}} works. {{card:cups-3}}: 3+8=11≠15. 3+7=10≠15. 3+2=5≠15. 3+8+7=18≠15. 3+8+2=13≠15. 3+7+2=12≠15. No valid capture for {{card:cups-3}} — it must discard. Play {{card:swords-7}} to capture {{card:coins-8}}.', it: 'In Quindici, carta + catturate = 15. swords-7: 7+8=15 ✓ cattura coins-8. cups-3 non ha prese valide: deve scartare.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['coins-8'],
        priority: { en: '7 + 8 = 15', it: '7 + 8 = 15' },
        reason: { en: 'The only valid capture: played card plus captured card must total 15.', it: 'L\'unica presa valida: carta giocata più carta catturata deve fare 15.' },
      },
    ],
  },

  {
    id: 'V8-S1-P1',
    nodeId: 'V8-S1',
    type: 'practice',
    goal: { en: 'Two captures sum to 15. Fewest-cards priority applies — take the 1-card group.', it: 'Due prese sommano a 15. Vige la priorità al minor numero di carte: prendi il gruppo di 1 carta.' },
    requiredNodes: ['V8-R', 'S6'],
    config: V8_CONFIG,
    playerIndex: 0,
    title: { en: 'Fewest-cards priority', it: 'Priorità al minor numero di carte' },
    description: { en: '7 + 8 = 15 (one card). 7 + 5 + 3 = 15 (two cards). Both are valid in Quindici — but you must take the group that uses the fewest table cards. The 1-card capture is mandatory.', it: '7 + 8 = 15 (una carta). 7 + 5 + 3 = 15 (due carte). Entrambe valide in Quindici, ma devi prendere il gruppo con il minor numero di carte. La presa da 1 carta è obbligatoria.' },
    hand: [
      { id: 'swords-7', suit: 'swords', rank: 7 },
    ],
    table: [
      { id: 'coins-8', suit: 'coins', rank: 8 },
      { id: 'clubs-5', suit: 'clubs', rank: 5 },
      { id: 'cups-3', suit: 'cups', rank: 3 },
    ],
    correctPlay: { cardId: 'swords-7', captureIds: ['coins-8'] },
    explanation: { en: '{{card:swords-7}} has two valid captures: {{{card:coins-8}}} (7+8=15, 1 card) or {{{card:clubs-5}}, {{card:cups-3}}} (7+5+3=15, 2 cards). In Quindici, fewest-cards priority applies: when multiple valid combinations exist, you MUST take the one using the fewest table cards. {{{card:coins-8}}} uses 1 card; {{{card:clubs-5}}, {{card:cups-3}}} uses 2 cards. You must take {{{card:coins-8}}}. Only when two groups tie on card count do you get to choose.', it: 'Due prese valide: {coins-8} (1 carta) o {clubs-5, cups-3} (2 carte). In Quindici vale la priorità al minor numero di carte: devi prendere {coins-8}. Solo se due gruppi hanno lo stesso numero di carte puoi scegliere.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-7',
        captureIds: ['coins-8'],
        priority: { en: '7+8=15 — 1 card (mandatory)', it: '7+8=15 — 1 carta (obbligatorio)' },
        reason: { en: 'Fewest-cards priority: 1 card < 2 cards; this capture is required.', it: 'Priorità al minor numero di carte: 1 < 2; questa presa è obbligatoria.' },
      },
      {
        cardId: 'swords-7',
        captureIds: ['clubs-5', 'cups-3'],
        priority: { en: '7+5+3=15 — 2 cards (not allowed)', it: '7+5+3=15 — 2 carte (non consentito)' },
        reason: { en: 'More cards but violates fewest-cards priority when a 1-card capture exists.', it: 'Più carte ma viola la priorità al minor numero di carte quando esiste una presa da 1 carta.' },
      },
    ],
  },

  // ── V9: Scopa a Undici ────────────────────────────────────────────────────────

  {
    id: 'V9-R-P1',
    nodeId: 'V9-R',
    type: 'practice',
    goal: { en: 'Find the capture where your card + the table card(s) = 11.', it: 'Trova la presa in cui la tua carta + le carte del tavolo = 11.' },
    requiredNodes: ['F-7'],
    config: V9_CONFIG,
    playerIndex: 0,
    title: { en: 'Captures must sum to 11', it: 'Le prese devono sommare a 11' },
    description: { en: 'In Scopa a Undici, your played card plus the captured card(s) must total exactly 11. Complement pairs: 1↔10, 2↔9, 3↔8, 4↔7, 5↔6. Your 4 pairs with the 7 on the table.', it: 'In Scopa a Undici, carta giocata + catturate = 11. Coppie complementari: 1↔10, 2↔9, 3↔8, 4↔7, 5↔6. Il tuo 4 si abbina al 7 sul tavolo.' },
    hand: [
      { id: 'swords-4', suit: 'swords', rank: 4 },
      { id: 'cups-6', suit: 'cups', rank: 6 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
      { id: 'cups-8', suit: 'cups', rank: 8 },
    ],
    correctPlay: { cardId: 'swords-4', captureIds: ['coins-7'] },
    explanation: { en: '{{card:swords-4}}: 4+7=11 ✓ captures {{card:coins-7}}. 4+3=7≠11. 4+8=12≠11. {{card:cups-6}}: 6+... 6+3=9≠11. 6+7=13≠11. 6+8=14≠11. 6+3+... 6+3+2? No 2. No valid capture for {{card:cups-6}}. Play {{card:swords-4}} to capture {{card:coins-7}} (the settebello — especially valuable in Undici too!).', it: 'swords-4: 4+7=11 ✓ cattura coins-7 (il settebello!). cups-6 non ha prese valide. Gioca il 4 di spade.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-4',
        captureIds: ['coins-7'],
        priority: { en: '4 + 7 = 11 — captures settebello', it: '4 + 7 = 11 — cattura il settebello' },
        reason: { en: 'Complement pair 4+7=11; also captures the settebello for 1 scoring point.', it: 'Coppia complementare 4+7=11; cattura anche il settebello per 1 punto.' },
      },
    ],
  },

  {
    id: 'V9-S1-P1',
    nodeId: 'V9-S1',
    type: 'practice',
    goal: { en: 'Two captures sum to 11. Fewest-cards priority applies — take the 1-card group.', it: 'Due prese sommano a 11. Si applica la priorità al minor numero di carte — prendi il gruppo da 1 carta.' },
    requiredNodes: ['V9-R', 'S6'],
    config: V9_CONFIG,
    playerIndex: 0,
    title: { en: 'Fewest-cards priority in Undici', it: 'Priorità al minor numero di carte in Undici' },
    description: { en: 'Your 5 can capture {{{card:coins-6}}} (5+6=11, 1 card) or {{{card:clubs-4}}, {{card:swords-2}}} (5+4+2=11, 2 cards). Both sum to 11, but in Undici fewest-cards priority applies: you must take the group with fewer table cards.', it: 'Il tuo 5 può prendere {coins-6} (5+6=11, 1 carta) o {clubs-4, swords-2} (5+4+2=11, 2 carte). Entrambe sommano a 11, ma in Undici si applica la priorità al minor numero di carte: devi prendere il gruppo con meno carte.' },
    hand: [
      { id: 'cups-5', suit: 'cups', rank: 5 },
    ],
    table: [
      { id: 'coins-6', suit: 'coins', rank: 6 },
      { id: 'clubs-4', suit: 'clubs', rank: 4 },
      { id: 'swords-2', suit: 'swords', rank: 2 },
    ],
    correctPlay: { cardId: 'cups-5', captureIds: ['coins-6'] },
    explanation: { en: '{{card:cups-5}} has two valid Undici captures: {{{card:coins-6}}} (5+6=11, 1 card) and {{{card:clubs-4}}, {{card:swords-2}}} (5+4+2=11, 2 cards). In Undici, fewest-cards priority applies: when multiple valid combinations exist, you MUST take the one using the fewest table cards. {{{card:coins-6}}} uses 1 card; {{{card:clubs-4}}, {{card:swords-2}}} uses 2 cards. You must take {{{card:coins-6}}}. Only when two groups tie on card count can you choose freely.', it: 'cups-5 ha due prese valide: {coins-6} (1 carta) e {clubs-4, swords-2} (2 carte). Si applica la priorità al minor numero di carte: {coins-6} da 1 carta è obbligatorio.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-5',
        captureIds: ['coins-6'],
        priority: { en: '5+6=11 — 1 card (mandatory)', it: '5+6=11 — 1 carta (obbligatorio)' },
        reason: { en: 'Fewest-cards priority: 1 card < 2 cards; this capture is required.', it: 'Priorità al minor numero di carte: 1 carta < 2 carte; questa presa è obbligatoria.' },
      },
      {
        cardId: 'cups-5',
        captureIds: ['clubs-4', 'swords-2'],
        priority: { en: '5+4+2=11 — 2 cards (not allowed)', it: '5+4+2=11 — 2 carte (non consentito)' },
        reason: { en: 'More cards but violates fewest-cards priority when a 1-card capture exists.', it: 'Più carte ma viola la priorità al minor numero di carte quando esiste una presa da 1 carta.' },
      },
    ],
  },

  // ── V10: Scopa Inversa ────────────────────────────────────────────────────────

  {
    id: 'V10-R-P1',
    nodeId: 'V10-R',
    type: 'practice',
    goal: { en: 'In Inversa, lowest score wins. Avoid the scopa — play the card that doesn\'t clear the table.', it: 'In Inversa, vince il punteggio più basso. Evita la scopa: gioca la carta che non svuota il tavolo.' },
    requiredNodes: ['F-7'],
    config: V10_CONFIG,
    playerIndex: 0,
    title: { en: 'Scopa hurts you in Inversa', it: 'La scopa fa male in Inversa' },
    description: { en: 'In Scopa Inversa, a scopa scores a point for YOU — which is bad since lowest score wins. Table has one card. Your {{card:cups-3}} matches it (rank match → scopa). Your {{card:swords-5}} doesn\'t capture — it discards. Play the 5 to avoid the scopa.', it: 'In Inversa, fare scopa ti dà un punto — il che è un danno perché vince chi ha meno punti. Il tuo 3 di coppe fa scopa. Il 5 di spade scarta. Gioca il 5.' },
    hand: [
      { id: 'cups-3', suit: 'cups', rank: 3 },
      { id: 'swords-5', suit: 'swords', rank: 5 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
    ],
    correctPlay: { cardId: 'swords-5', captureIds: [] },
    explanation: { en: 'Playing {{card:cups-3}} captures {{card:clubs-3}} (rank match) and clears the table — that\'s a scopa worth 1 point. In Inversa, 1 point is bad for you. Playing {{card:swords-5}} finds no capture (5≠3, no sum) and discards to the table. That adds a card without scoring — the safer play in Inversa.', it: 'Giocare cups-3 fa scopa (1 punto per te — un danno in Inversa). Giocare swords-5 scarta senza prendere: più sicuro.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-5',
        captureIds: [],
        priority: { en: 'Safe discard — no scopa', it: 'Scarto sicuro — nessuna scopa' },
        reason: { en: 'Adds a card to the table without scoring a harmful point.', it: 'Aggiunge una carta al tavolo senza segnare un punto dannoso.' },
      },
      {
        cardId: 'cups-3',
        captureIds: ['clubs-3'],
        priority: { en: 'Scopa — scores a point (bad in Inversa)', it: 'Scopa — segna un punto (dannoso in Inversa)' },
        reason: { en: 'Clears the table but the scopa point works against you in Inversa.', it: 'Svuota il tavolo ma il punto scopa è contro di te in Inversa.' },
      },
    ],
  },

  {
    id: 'V10-S1-P1',
    nodeId: 'V10-S1',
    type: 'practice',
    goal: { en: 'Two rank matches available. In Inversa, avoid capturing the settebello — it scores a point against you.', it: 'Due prese obbligatorie disponibili. In Inversa, evita il settebello: ti vale un punto contro.' },
    requiredNodes: ['V10-R'],
    config: V10_CONFIG,
    playerIndex: 0,
    title: { en: 'Avoid key cards in Inversa', it: 'Evita le carte chiave in Inversa' },
    description: { en: 'Both hand cards have rank matches. One captures the settebello ({{card:coins-7}} = 1 point — BAD in Inversa). The other captures a plain 9. Choose the play that avoids the harmful point.', it: 'Entrambe le carte hanno prese obbligatorie. Una cattura il settebello (1 punto — MALE in Inversa). L\'altra cattura un 9 normale. Scegli la giocata che evita il punto dannoso.' },
    hand: [
      { id: 'cups-7', suit: 'cups', rank: 7 },
      { id: 'swords-9', suit: 'swords', rank: 9 },
    ],
    table: [
      { id: 'coins-7', suit: 'coins', rank: 7 },
      { id: 'clubs-9', suit: 'clubs', rank: 9 },
    ],
    correctPlay: { cardId: 'swords-9', captureIds: ['clubs-9'] },
    explanation: { en: '{{card:cups-7}} must capture {{card:coins-7}} (rank match = settebello = 1 point — harmful in Inversa). {{card:swords-9}} must capture {{card:clubs-9}} (rank match, no special points). In Inversa, each scoring point hurts the player who earns it. Play {{card:swords-9}} to pick up the harmless 9; leave the settebello capture for the opponent to suffer.', it: 'cups-7 cattura il settebello (1 punto = danno in Inversa). swords-9 cattura clubs-9 (nessun punto speciale). Gioca il 9: lascia il settebello all\'avversario.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'swords-9',
        captureIds: ['clubs-9'],
        priority: { en: 'Harmless capture — no special points', it: 'Presa innocua — nessun punto speciale' },
        reason: { en: 'Takes a plain 9; no scoring impact in Inversa.', it: 'Prende un 9 normale; nessun impatto sul punteggio in Inversa.' },
      },
      {
        cardId: 'cups-7',
        captureIds: ['coins-7'],
        priority: { en: 'Settebello — 1 point against you', it: 'Settebello — 1 punto contro di te' },
        reason: { en: 'Capturing the settebello in Inversa scores a point that hurts your standing.', it: 'Catturare il settebello in Inversa ti dà un punto che ti penalizza.' },
      },
    ],
  },

  {
    id: 'V10-S2-P1',
    nodeId: 'V10-S2',
    type: 'practice',
    goal: { en: 'In Inversa, you WANT the opponent to scopa. Discard the card that leaves the table sweepable.', it: 'In Inversa, VUOI che l\'avversario faccia scopa. Scarta la carta che lascia il tavolo spazzabile.' },
    requiredNodes: ['V10-R', 'S7'],
    config: V10_CONFIG,
    playerIndex: 0,
    title: { en: 'Inverted scopa blocking', it: 'Blocco scopa invertito' },
    description: { en: 'Normal Scopa: avoid leaving a sweepable table. Inversa: do the opposite — leave the table in a state where the opponent CAN sweep it (giving them a harmful scopa point). Must discard. Which card leaves sum=8 (opponent can sweep with an 8)?', it: 'Scopa normale: evita il tavolo spazzabile. Inversa: fai il contrario — lascia il tavolo spazzabile per dare all\'avversario una scopa dannosa. Devi scartare. Quale carta lascia somma=8?' },
    hand: [
      { id: 'cups-5', suit: 'cups', rank: 5 },
      { id: 'swords-8', suit: 'swords', rank: 8 },
    ],
    table: [
      { id: 'clubs-3', suit: 'clubs', rank: 3 },
    ],
    correctPlay: { cardId: 'cups-5', captureIds: [] },
    explanation: { en: 'Discard {{card:cups-5}}: table becomes {{{card:clubs-3}}, {{card:cups-5}}}, sum=8. Opponent with an 8 can capture both (3+5=8 = scopa) — scoring a point that hurts them. Discard {{card:swords-8}}: table becomes {{{card:clubs-3}}, {{card:swords-8}}}, sum=11. No sweep possible (max rank = 10). In Inversa, you want the opponent to sweep — so leave sum ≤ 10 to bait them into a scopa.', it: 'Scartare cups-5: tavolo = {clubs-3, cups-5}, somma=8. L\'avversario con un 8 fa scopa (3+5=8) — un punto che gli fa male. Scartare swords-8: somma=11, nessuna spazzata possibile.' },
    helpHints: [],
    rankedPlays: [
      {
        cardId: 'cups-5',
        captureIds: [],
        priority: { en: 'Leaves sum=8 — baits opponent scopa', it: 'Lascia somma=8 — esca per la scopa avversaria' },
        reason: { en: 'Table sum=8; opponent with an 8 sweeps (scopa point hurts them in Inversa).', it: 'Somma tavolo=8: l\'avversario con un 8 fa scopa (punto che fa male in Inversa).' },
      },
      {
        cardId: 'swords-8',
        captureIds: [],
        priority: { en: 'Leaves sum=11 — no sweep possible', it: 'Lascia somma=11 — nessuna spazzata possibile' },
        reason: { en: 'Table sum=11; opponent cannot sweep in one play. Misses the Inversa opportunity.', it: 'Somma tavolo=11: l\'avversario non può spazzare. Perde l\'opportunità Inversa.' },
      },
    ],
  },
]
