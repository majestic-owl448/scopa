import type { LearnNode } from '../types.ts'

export const LEARN_NODES: LearnNode[] = [
  // ── Foundation ──────────────────────────────────────────────────────────────
  {
    id: 'F-1',
    name: { en: 'The Deck', it: 'Il Mazzo' },
    description: { en: '40 cards, 4 suits, ranks 1–10; face card names.', it: '40 carte, 4 semi, ranghi 1–10; nomi delle figure.' },
    guideText: { en: `Scopa uses a 40-card deck — not the usual 52-card deck.

**The four suits:**
- 🪙 Coins (Denari) — gold coins
- 🏆 Cups (Coppe) — golden cups
- ⚔️ Swords (Spade) — crossed swords
- 🪵 Clubs (Bastoni) — wooden clubs

**Ranks 1–10 in each suit.** That's 4 × 10 = 40 cards total.

**The face cards** (8, 9, 10) have special names in the traditional Napoletane deck:
- 8 = Fante (Jack)
- 9 = Cavallo (Knight)
- 10 = Re (King)

Their numeric value for captures is still 8, 9, and 10 respectively. No special rules — they behave exactly like any other card.

**The most important card** in the deck is the **{{card:coins-7}}** (Sette di Denari), also called the **Settebello** ("beautiful seven"). Whoever captures it earns a bonus point at the end of the hand.`, it: 'Il mazzo italiano da 40 carte: 4 semi (Denari, Coppe, Spade, Bastoni), ranghi 1–10. Il 7 di denari (settebello) vale un punto bonus.' },
    prerequisites: [],
    hasChallenges: false,
  },
  {
    id: 'F-2',
    name: { en: 'Captures', it: 'Le Prese' },
    description: { en: 'Single-card rank match and subset sum captures.', it: 'Presa con carta uguale e con somma di carte.' },
    prerequisites: ['F-1'],
    hasChallenges: true,
  },
  {
    id: 'F-3',
    name: { en: 'Single-Card Priority', it: 'Priorità della Carta Singola' },
    description: { en: 'When a single card matches, you must take it rather than a multi-card sum.', it: 'Quando una carta singola corrisponde, deve essere presa invece di una somma.' },
    prerequisites: ['F-2'],
    hasChallenges: true,
  },
  {
    id: 'F-4',
    name: { en: 'Discard', it: 'Lo Scarto' },
    description: { en: 'Playing a card when no capture is possible.', it: 'Giocare una carta quando non è possibile prendere.' },
    prerequisites: ['F-2'],
    hasChallenges: true,
  },
  {
    id: 'F-5',
    name: { en: 'Scopa', it: 'La Scopa' },
    description: { en: 'Clearing the table earns a scopa point; a face-up card marks the capture.', it: 'Pulire il tavolo vale un punto scopa; una carta scoperta segna la cattura.' },
    prerequisites: ['F-2'],
    hasChallenges: true,
  },
  {
    id: 'F-6',
    name: { en: 'End of Hand', it: 'Fine della Mano' },
    description: { en: 'The last player to capture takes any remaining table cards; this is not a scopa.', it: 'L\'ultimo a prendere raccoglie le carte rimaste sul tavolo; questo non è una scopa.' },
    guideText: { en: `When all players run out of cards, the hand ends.

**The leftover rule:** Any cards still on the table go to the last player who made a capture. This is not a scopa — no scopa point is awarded, even if it clears the table.

**Why it matters:** Those leftover cards count toward Carte (most cards) and Ori (most Coins). A player who captures last picks them all up, which can swing both categories.

**Example:** You make the last capture on turn 14, then neither you nor your opponent can capture anything more. The 3 cards still on the table go to you — even though you never "played" them.`, it: 'A fine mano, le carte rimaste sul tavolo vanno all\'ultimo che ha catturato. Non è una scopa.' },
    prerequisites: ['F-2'],
    hasChallenges: true,
  },
  {
    id: 'F-7',
    name: { en: 'Scoring', it: 'Il Punteggio' },
    description: { en: 'All 5 base categories; target score 11; tie-breaker hands.', it: 'Le 5 categorie base; punteggio obiettivo 11; mani di spareggio.' },
    prerequisites: ['F-5', 'F-6'],
    hasChallenges: true,
  },
  {
    id: 'F-8',
    name: { en: 'Dealing', it: 'La Distribuzione' },
    description: { en: 'Card distribution rotation; re-dealing when all hands are empty.', it: 'Rotazione del mazziere; ridistribuzione quando tutte le mani sono vuote.' },
    guideText: { en: `Before each hand, the deck is shuffled, cut, and dealt.

**How cards are distributed:**
1. The dealer gives each player 3 cards, one at a time, going around the table
2. Then 4 cards are placed face-up on the table
3. Players take turns playing cards. When everyone runs out, the dealer distributes another round of 3 cards each (no new table cards)
4. This continues until the deck is empty

**The dealer rotates** after each hand — the player to the dealer's left becomes the new dealer.

**Re-dealing:** If the initial 4 table cards are all the same rank (e.g. four 7s), the hand is void and redealt. This is extremely rare but it does happen.

**Who goes first?** The player to the dealer's left plays first each hand.`, it: 'Il mazziere distribuisce 3 carte a testa e 4 sul tavolo. Il mazziere ruota dopo ogni mano.' },
    prerequisites: ['F-1'],
    hasChallenges: false,
  },
  {
    id: 'F-9',
    name: { en: 'You Deal', it: 'Dai Tu' },
    description: { en: 'Interactive: shuffle, cut, and deal; hand off to auto-deal at any point.', it: 'Interattivo: mescola, taglia e distribuisci; puoi passare alla distribuzione automatica.' },
    guideText: { en: `When it's your turn to deal, you handle the full ritual:

1. **Shuffle** — the deck is randomised (Fisher-Yates algorithm: every permutation equally likely)
2. **Cut** — another player splits the deck at a chosen point and the two halves are swapped
3. **Deal** — 3 cards to each player one at a time (round-robin), then 4 face-up to the table

In the app, the Deal screen shows this animation automatically. You can skip it at any time with the Skip link, or watch the full ritual unfold.

**Why the cut?** Tradition — and it prevents the dealer from stacking the deck. In a physical game, the player to the dealer's right cuts. In the app, if you're the dealer, an opponent cuts automatically.`, it: 'Quando distribuisci: mescola, taglia, poi 3 carte a testa e 4 sul tavolo.' },
    prerequisites: ['F-8'],
    hasChallenges: false,
  },
  {
    id: 'F-10',
    name: { en: 'Opponent Deals', it: 'Dà l\'Avversario' },
    description: { en: 'Interactive: the AI deals; you cut; choose to play the hand or exit.', it: 'Interattivo: il computer distribuisce; tu tagli; scegli se giocare la mano o uscire.' },
    guideText: { en: `When an opponent is the dealer, they handle the shuffle and deal — but **you cut**.

Cutting is simple: you choose where to split the deck (any point from position 1 to 38), and the two halves are swapped.

In the app: when a CPU is the dealer, you're offered the chance to cut interactively on the Deal screen. You can also decline and let the CPU cut at a random position — the animation still plays either way.

**Strategic note:** In a real game, you might cut to a specific position hoping to influence the distribution. In this app, the shuffle is already complete before the cut, so the cut position has no strategic effect — it's purely ceremonial.

After the cut, cards are dealt and the hand begins as normal.`, it: 'Quando l\'avversario distribuisce, sei tu a tagliare il mazzo.' },
    prerequisites: ['F-8'],
    hasChallenges: false,
  },

  // ── Core Strategy ────────────────────────────────────────────────────────────
  {
    id: 'S1',
    name: { en: 'Capture Recognition', it: 'Riconoscere le Prese' },
    description: { en: 'All valid captures in a position; subset sum under pressure.', it: 'Tutte le prese valide in una posizione; somma di sottoinsiemi sotto pressione.' },
    guideText: { en: `Before you can play well, you need to see every legal move quickly.

**Rank match:** Any table card with the same rank as your played card is a valid single-card capture. You must take it if it exists — subset sums are not an option when a rank match is present.

**Subset sum:** If no single-card match exists, you may capture a group of table cards whose ranks sum to your played card's rank. You can capture multiple groups in one turn only if each group sums correctly on its own — you pick exactly one group.

**Multiple valid captures:** When your card creates several possible capture groups (e.g. 7 in hand, table has 7, 3+4, 2+5), you must take the single-card match if it exists. If there is no single card match and multiple subset sums exist, you choose which group to take.

**You must capture if you can.** Discarding when a legal capture exists is not allowed.

The practice problems below will test your ability to spot every legal capture — including tricky multi-card sums under time pressure.`, it: 'Devi vedere tutte le prese legali rapidamente. Presa singola obbligatoria se esiste; altrimenti scegli la somma.' },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
  },
  {
    id: 'S2',
    name: { en: 'Key Card Priority', it: 'Priorità delle Carte Chiave' },
    description: { en: 'Take the settebello first; re bello and rosmarino when active.', it: 'Prendi prima il settebello; re bello e rosmarino quando attivi.' },
    guideText: { en: `Not all cards are equal. Some are worth a scoring point regardless of who else captures more of anything.

**The settebello ({{card:coins-7}})** is the most important card in the deck. It scores 1 point at hand end for whoever holds it — no counting, no competition. It's binary: you have it, you score it.

**Priority rule:** When you have a choice between capturing the settebello and capturing something else, take the settebello. Even if the alternative capture gives you more cards, the guaranteed point almost always wins.

**Other key cards** (when those variants are active):
- **Re Bello** — {{card:coins-10}}: +1 point, treat like a second settebello
- **Rosmarino** — {{card:swords-8}}: +1 point

**Exception:** A scopa (clearing the table) is also 1 point and additionally leaves the table empty, forcing the opponent to discard. When a scopa opportunity and the settebello are in direct tension, the scopa is usually better — but only by a thin margin.`, it: 'Il settebello (7 di denari) vale 1 punto garantito. Prendilo sempre quando puoi.' },
    prerequisites: ['S1'],
    hasChallenges: true,
  },
  {
    id: 'S3',
    name: { en: 'Scopa Recognition', it: 'Riconoscere la Scopa' },
    description: { en: 'Spot scopa opportunities before your opponent does.', it: 'Individua le opportunità di scopa prima dell\'avversario.' },
    guideText: { en: `A scopa clears the table and earns 1 point. It also leaves the table empty, forcing the next player to discard — a double advantage.

**How to spot a scopa:** Look at the table cards. For each card in your hand, ask: is there a combination of table cards that (a) I can capture with this card and (b) equals all the cards on the table?

**The easy case:** Table has one card, you have a matching rank → automatic scopa.

**The tricky case:** Table has multiple cards. You need a single play that sweeps them all. Example: table has 2, 3, 5 (sum = 10). You have a 10 in hand → scopa. But if the table has 2, 4, 5, 8 (sum = 19), you'd need a 19 — impossible in this deck (max rank is 10).

**Why it matters:** Against a good opponent, leaving the table in a state where they can scopa is a serious mistake. Recognising their opportunities (not just yours) is the next step — that's Scopa Blocking (S7).`, it: 'La scopa svuota il tavolo e vale 1 punto. Individua quando puoi farlo — e quando l\'avversario potrebbe farlo.' },
    prerequisites: ['S1'],
    hasChallenges: true,
  },
  {
    id: 'S4',
    name: { en: 'Ori & Carte Awareness', it: 'Consapevolezza di Ori e Carte' },
    description: { en: 'Track coin and card counts; recognise when each category is contested.', it: 'Tieni traccia di ori e carte; riconosci quando una categoria è contesa.' },
    guideText: { en: `Two of the five base scoring categories come down to raw counts:

**Carte** — 1 point to whoever captures strictly more than 20 cards (more than half). In a tie, nobody scores.

**Ori** — 1 point to whoever captures strictly more than 5 Coins cards (more than half of the 10 Coins). Tie = nobody scores.

**Why track them?** A single capture decision can swing both categories. If you're at 19 cards and your opponent is at 18, a 2-card capture puts you at 21 — Carte secured. If you're at 5 Coins and they're at 4, one more Coins card clinches Ori.

**When to care:** In the early and middle game, these categories are usually contested. In the late game, one player often has a clear lead — at that point, focus effort on the contested categories, not the secured or lost ones.

**The {{card:coins-7}}** counts toward Ori (it's a Coins card) AND scores the settebello point. It's the most valuable card for two independent reasons.`, it: 'Tieni traccia di Carte (>20) e Ori (>5 denari). Una presa può decidere entrambe le categorie.' },
    prerequisites: ['S2', 'S3'],
    hasChallenges: true,
  },
  {
    id: 'S5',
    name: { en: 'Primiera Basics', it: 'Basi della Primiera' },
    description: { en: 'Value table; suit coverage; the cost of missing a suit.', it: 'Tabella dei valori; copertura dei semi; il costo di un seme mancante.' },
    guideText: { en: `Primiera is the most complex scoring category — and the one most players misplay.

**The rule:** Each player takes their best card per suit from their captured pile. The player whose four best cards have the highest combined primiera value wins the point.

**Standard primiera values:**
- 7 = 21 pts (best)
- 6 = 18 pts
- 1 (Ace) = 16 pts
- 5 = 15 pts
- 4 = 14 pts
- 3 = 13 pts
- 2 = 12 pts
- 8/9/10 (face cards) = 10 pts each (worst)

**The critical insight:** If you have zero captured cards in any suit, your primiera value for that suit is 0. Missing an entire suit is almost always fatal to winning Primiera — your score is effectively capped.

**Implication:** Capturing a low-value card in a missing suit (e.g. a 10, worth only 10 primiera points) is often better than capturing a high-value card in a suit you already cover well.

**What to aim for:** A 7 in every suit = 84 points total. In practice, securing a 7 or 6 in each suit is the target.`, it: 'La primiera assegna valori a ogni carta (7=21, 6=18, A=16...). Vince chi ha il totale più alto con un seme per ogni colore. Un seme mancante è quasi sempre fatale.' },
    prerequisites: ['S4'],
    hasChallenges: true,
  },
  {
    id: 'S6',
    name: { en: 'Smart Discard', it: 'Lo Scarto Intelligente' },
    description: { en: 'When discarding, avoid creating easy captures — think about what you leave behind.', it: 'Quando scarti, evita di creare prese facili: pensa a cosa lasci sul tavolo.' },
    guideText: { en: `When you must discard (no captures available), your choice of card matters — you're building the opponent's next opportunity.

Note: if a table card matches your hand card's rank, you *must* capture it — you can't discard into a rank match. So the discard decision is always between cards that genuinely have no captures.

**Rule 1: Think about the sum you're creating.** Check what the table will look like after your discard. If table cards + your discarded card form a sum ≤ 10, the opponent may be able to sweep everything. Higher table sums (> 10) block all multi-card captures.

**Rule 2: Prefer ranks that are hard to sum to.** High ranks (8, 9, 10) push the table sum up and create fewer capturable combinations. Discarding a 9 is generally safer than discarding a 2.

**Rule 3: Avoid helping the opponent's primiera.** If the opponent is clearly missing the {{card:clubs-7}}, don't discard a {{card:clubs-7}}. Even a 6 in that suit is a gift.

The goal isn't to find a perfect discard — it's to find the least harmful one.`, it: 'Quando scarti, controlla la somma del tavolo risultante. Se supera 10, nessuna spazzata multipla è possibile. Preferisci scarti con ranghi alti.' },
    prerequisites: ['S5'],
    hasChallenges: true,
  },
  {
    id: 'S7',
    name: { en: 'Scopa Blocking', it: 'Bloccare la Scopa' },
    description: { en: 'Avoid leaving a table sum ≤ threshold after discarding.', it: 'Evita di lasciare una somma sul tavolo ≤ soglia dopo lo scarto.' },
    guideText: { en: `After your turn (capture or discard), check what you're leaving on the table. If the remaining table cards can all be captured in one play, your opponent gets a scopa.

**The threshold rule:** If the sum of all remaining table cards is ≤ 10 (the max card rank), the opponent could potentially sweep them. The smaller the sum, the more likely they have a matching card.

**When you capture:** After taking your cards, look at what's left. If 2 cards remain summing to 7, every player with a 7 in hand can scopa you.

**When you discard:** The card you add joins the table. Check the new table sum before committing.

**Practical heuristic:** After your play, count the remaining table cards and their sum. If sum ≤ 7 with few cards, you're in danger. If the table has many cards with a high sum, you're safer.

**You can't always avoid it** — sometimes every option leaves a scopa opportunity. In that case, pick the card that leaves the hardest-to-match sum (fewest ranks in the deck that could sweep).`, it: 'Dopo la tua giocata, controlla che le carte rimaste sul tavolo non possano essere spazzate in una sola mossa dall\'avversario.' },
    prerequisites: ['S3', 'S6'],
    hasChallenges: true,
  },
  {
    id: 'S8',
    name: { en: 'Key Card Protection', it: 'Proteggere le Carte Chiave' },
    description: { en: 'Never discard key cards or strong primiera cards.', it: 'Non scartare mai carte chiave o carte primiera forti.' },
    guideText: { en: `Some cards are too valuable to ever put on the table voluntarily.

**Never discard:**
- The **{{card:coins-7}}** (settebello) — putting it on the table gives the opponent a free scoring point
- The **7 of any suit** — these are your best primiera cards (21 pts each)
- The **6 of any suit** — second-best primiera cards (18 pts)
- **Key variant cards** when active: Re Bello ({{card:coins-10}}), Rosmarino ({{card:swords-8}})

**Why it matters:** If you discard a 7 and the opponent captures it, you've handed them both a primiera advantage and denied yourself one. The swing is double the face value — you lose it AND they gain it.

**The dilemma:** Sometimes you're forced to choose between two bad discards. In that case, discard the one with lower scoring impact. A face card (8/9/10, worth only 10 primiera pts) is a better discard than an Ace (16 pts) or a 5 (15 pts) in a suit you don't cover.

**Exception:** If capturing requires using a {{card:coins-7}} to take a worthless table card while the opponent can't score anything anyway, it can make sense. But this is rare — default to protecting key cards.`, it: 'Non scartare mai il settebello, i 7, i 6 o le carte chiave di variante. Il danno è doppio: tu perdi, l\'avversario guadagna.' },
    prerequisites: ['S2', 'S6'],
    hasChallenges: true,
  },
  {
    id: 'S9',
    name: { en: 'Primiera Suit Coverage', it: 'Copertura dei Semi nella Primiera' },
    description: { en: 'Focus on your weakest suit slot; diminishing returns beyond parity.', it: 'Concentrati sul seme più debole; i ritorni diminuiscono oltre la parità.' },
    guideText: { en: `Once you understand primiera values (S5), the next step is knowing which captures to prioritise.

**Weakest slot principle:** Your primiera score is determined by your single best card per suit. Improving a suit where you have nothing (0 pts) is far more valuable than improving a suit where you already have a 7 (21 pts).

**Example:** You have 7♣ (21), 6♥ (18), 3♦ (13), nothing in ♠ (0). Your primiera total = 21+18+13+0 = 52. Capturing the 10♠ raises it to 62 (+10). Capturing the 8♣ does nothing — you already have 7♣ which beats it.

**The capture decision:** When two captures are available and neither is a key card, ask: which one fills my weakest suit slot?

**Diminishing returns:** Once you have a 7 in a suit (21 pts), capturing any other card in that suit for primiera purposes is worthless. The marginal value of additional cards in covered suits is zero — only the best card counts.

**Corollary:** When discarding (S6), discarding a card in a suit you're already winning primiera doesn't hurt you much. Discarding your only card in a missing suit is devastating.`, it: 'Migliora sempre il seme più debole. Avere un 7 in un seme già coperto non vale nulla — hai già il massimo da quel seme.' },
    prerequisites: ['S5'],
    hasChallenges: true,
  },
  {
    id: 'S10',
    name: { en: 'Point Landscape', it: 'Mappa dei Punti' },
    description: { en: 'Secured, lost, and contested categories; redirect effort accordingly.', it: 'Categorie assicurate, perse e contese; ridirige l\'impegno di conseguenza.' },
    guideText: { en: `At any point in the hand, each scoring category is in one of four states:

- **Secured** — you have an insurmountable lead; the opponent cannot catch up even with perfect play
- **Lost** — the opponent has a lead you cannot overturn
- **Contested** — either player could win with the right plays
- **Irrelevant** — the category doesn't apply to the current config

**How to use this:** Stop spending effort on secured or lost categories. Redirect every capture decision toward contested ones.

**Example mid-game assessment:**
- Scope: 2 vs 1 → contested
- Settebello: you have it → secured
- Carte: 12 vs 10 with 16 cards left → contested (either player can reach 21)
- Ori: 6 vs 2 → secured (opponent needs 4 of 4 remaining Coins)
- Primiera: you're missing Swords entirely → likely lost

In this state, don't waste turns chasing Ori (secured) or Swords primiera (lost). Focus on Carte and Scope.

The app's AI uses this landscape internally. The PointLandscapePanel in advanced challenges shows you the assessment in real time.`, it: 'Ogni categoria è assicurata, persa, contesa o irrilevante. Concentra le decisioni sulle categorie contese, non su quelle già vinte o perse.' },
    prerequisites: ['S4', 'S9'],
    hasChallenges: true,
  },
  {
    id: 'S11',
    name: { en: 'Dynamic Threshold', it: 'Soglia Dinamica' },
    description: { en: 'Adjust scopa-blocking threshold based on remaining ranks in the deck.', it: 'Adatta la soglia anti-scopa in base ai ranghi rimanenti nel mazzo.' },
    guideText: { en: `S7 taught a static scopa-blocking rule: avoid leaving table sums ≤ 10. But this oversimplifies — the real risk depends on what ranks are still in play.

**The dynamic adjustment:** If rank 7 has been exhausted (all four 7s are captured), a table sum of 7 is no longer a scopa risk. Similarly, if many high cards are gone, the remaining deck skews low, making high table sums safer.

**Practical approach:**
1. Track which ranks have been seen (captured or discarded)
2. When a table sum equals an exhausted rank, that sum is safe
3. When the deck is nearly empty, only the opponent's known hand cards matter

**Late-game precision:** In the final few turns, you may be able to calculate exactly what the opponent holds (if you've tracked the deck well). A table sum that matches a card they definitely don't have is completely safe.

**Against easier opponents:** A static threshold is good enough at lower levels. The dynamic adjustment becomes important against opponents who track the deck — they'll exploit a fixed threshold by playing toward the sums you've left "safe" by accident.`, it: 'La soglia anti-scopa non è fissa: adattala in base ai ranghi esauriti. Una somma uguale a un rango scomparso è sicura.' },
    prerequisites: ['S7', 'S10'],
    hasChallenges: true,
  },
  {
    id: 'S12',
    name: { en: 'Lookahead', it: 'Anticipo' },
    description: { en: 'Consider the opponent\'s best response to each candidate move.', it: 'Considera la risposta migliore dell\'avversario per ogni mossa candidata.' },
    guideText: { en: `The difference between intermediate and expert play is asking not just "what's good for me?" but "what does this allow the opponent to do?"

**One-ply lookahead:** For each candidate move, simulate the opponent's best response and evaluate the resulting position — not just the position after your move.

**What to look for:**
- Does this leave a scopa opportunity? (S7/S11)
- Does this give them the settebello or another key card? (S2/S8)
- Does my capture give them a Coins lead? (S4)
- Does my discard fill their weakest primiera suit? (S9)

**Common mistake:** Optimising your own immediate gain while ignoring that the opponent's best response negates it. Example: you capture 3 cards for a Carte lead, but you leave a scopa — they sweep the table, score a point, and leave it empty.

**The bait:** Sometimes the best play intentionally looks weak in order to bait the opponent. Discarding a card that looks capturable (but isn't their key card) to set up your own future position.

This is the hardest concept in Scopa strategy — it requires holding multiple game states in mind simultaneously. The practice challenges for this node all involve positions where the naive best move is clearly wrong once you think one step ahead.`, it: 'Anticipa la risposta migliore dell\'avversario a ogni tua mossa candidata. La mossa ottimale per te ora potrebbe aprire opportunità fatali per l\'avversario.' },
    prerequisites: ['S10', 'S11'],
    hasChallenges: true,
  },

  // ── Player Count Variants ────────────────────────────────────────────────────
  {
    id: 'P3',
    name: { en: '3-Player Scopa', it: 'Scopa a Tre' },
    description: { en: 'Dealing order, scoring ties, and strategic differences in 3-player games.', it: 'Ordine di distribuzione, pareggi nel punteggio e differenze strategiche a tre.' },
    guideText: { en: `Scopa works the same with three players — with a few important differences.

**Dealing:** Each player gets 3 cards per round (same as 2-player). 4 cards go face-up on the table at the start of each hand.

**Turn order:** Players take turns in a fixed rotation. Three players means two opponents play between your turns.

**Scoring — ties:** Each scoring category still goes to whoever has the most. But with 3 players, ties are much more common. If two players are tied for the most Coins (e.g. 4 each), **neither scores Ori** — even if the third player has fewer. Same for Carte and Primiera. Scope points are never tied (each is scored at the moment it happens).

**Strategic impact:** Because two opponents play before you return, key cards on the table (settebello, low Coins for Napola) disappear faster. Scopa opportunities can close in a single round. Act quickly on anything critical.

**Primiera with 3:** 10 Coins cards split three ways means the Ori fight is usually closer. A player needs strictly more than one-third to avoid a tie — which is harder to guarantee.`, it: 'A tre giocatori le regole sono le stesse, ma i pareggi sono più frequenti: in caso di parità nelle categorie (Ori, Carte, Primiera) nessuno segna. Due avversari giocano tra i tuoi turni.' },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { playerCount: 3 },
  },
  {
    id: 'P4',
    name: { en: '4-Player Scopa', it: 'Scopa a Quattro' },
    description: { en: 'Dealing order and scoring in 4-player games.', it: 'Ordine di distribuzione e punteggio a quattro.' },
    guideText: { en: `Four players, same rules — but the pace changes completely.

**Dealing:** 10 cards each per hand (4 × 10 = 40), dealt 3 at a time with 4 on the table. With 4 players there are more rounds per hand.

**Turn order:** Three opponents play between your turns. Anything left on the table for more than one full round is nearly gone.

**Scoring — ties:** Same tie-break rules as 3-player. With 4 players sharing 40 cards, Carte (most cards = more than 20) can be extremely tight. Primiera is similarly contested.

**Strategic impact:** Urgency is higher. Take the settebello on your first opportunity — you may not get a second. Scopa opportunities rarely survive a full round of four players. Key low Coins cards (for Napola) get snapped up fast.

**Alliances:** Official tournament play can use teams (2v2), but the app's 4-player mode is every-player-for-themselves by default. Scoring is individual.`, it: 'A quattro giocatori, tre avversari giocano tra i tuoi turni. La velocità è molto più alta: cogli subito il settebello e le opportunità di scopa, oppure scompariranno.' },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { playerCount: 4 },
  },

  // ── Variant: V1 — Scopa d'Assi ───────────────────────────────────────────────
  {
    id: 'V1-R',
    name: { en: 'Scopa d\'Assi: Rules', it: 'Scopa d\'Assi: Regole' },
    description: { en: 'Ace captures the whole table; Ace on empty table; Ace scopa point.', it: 'L\'asso cattura tutto il tavolo; asso su tavolo vuoto; punto scopa con l\'asso.' },
    guideText: { en: `Scopa d'Assi adds one powerful rule on top of standard Scopa.

**The Ace sweep:** When you play an Ace (any suit), it captures **every card currently on the table** — not just a rank match or subset sum. All of them, in one play.

**It scores a scopa:** The Ace sweep counts as a scopa point, just like clearing the table with a sum capture. You receive a face-down marker card.

**On an empty table:** If you play an Ace and the table is empty, nothing is captured — the Ace goes face-up on the table. This is the one case where the sweep doesn't fire.

**Everything else is unchanged:** Rank matches, subset sums, mandatory captures, scoring categories — all standard rules apply when you are not playing an Ace.

**Strategic implication:** The Ace becomes one of the most powerful cards in the game. Never discard it; protect it; time it for when the table is fullest.`, it: 'In Scopa d\'Assi, giocare un asso cattura tutte le carte sul tavolo e vale un punto scopa. Su tavolo vuoto, l\'asso va sul tavolo senza catturare nulla.' },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { scopaDAssi: true, aceScoresScopa: true },
  },
  {
    id: 'V1-S1',
    name: { en: 'Scopa d\'Assi: Never Discard the Ace', it: 'Scopa d\'Assi: Non Scartare l\'Asso' },
    description: { en: 'Never discard the Ace when the table is non-empty.', it: 'Non scartare mai l\'asso quando il tavolo non è vuoto.' },
    prerequisites: ['V1-R'],
    hasChallenges: true,
    variantConfig: { scopaDAssi: true, aceScoresScopa: true },
  },
  {
    id: 'V1-S2',
    name: { en: 'Scopa d\'Assi: Ace Timing', it: 'Scopa d\'Assi: Tempistica dell\'Asso' },
    description: { en: 'Hold the Ace vs play it immediately — reading the right moment.', it: 'Tenere l\'asso o giocarlo subito — leggere il momento giusto.' },
    prerequisites: ['V1-R', 'S6'],
    hasChallenges: true,
    variantConfig: { scopaDAssi: true, aceScoresScopa: true },
  },

  // ── Variant: V2 — Napola ─────────────────────────────────────────────────────
  {
    id: 'V2-R',
    name: { en: 'Napola: Rules', it: 'Napola: Regole' },
    description: { en: 'Consecutive Coins run from the Ace; 3+ cards earns points; each extra card adds one.', it: 'Sequenza di denari dall\'asso; 3+ carte valgono punti; ogni carta extra aggiunge uno.' },
    guideText: { en: `Napola adds a bonus scoring category based on the Coins suit.

**The run:** At hand end, count how many Coins you captured starting from the Ace — Ace, then {{card:coins-2}}, then {{card:coins-3}}, and so on without any gap. This unbroken sequence is your Napola.

**Scoring:** A run of 3 cards (Ace + 2 + 3) scores **3 points**. Every additional Coins card that continues the run adds 1 more point. So Ace through 4 = 4 points, Ace through 5 = 5 points, and so on up to a maximum of 10.

**The key cards:** The {{card:coins-1}}, {{card:coins-2}}, and {{card:coins-3}} are essential — without all three, you score nothing for Napola no matter how many other Coins you hold. Treat these three like key cards: capture them when you can, and think carefully before letting an opponent take them.

**Interaction with the Coins category:** Napola is independent of the standard Coins scoring point. You can win both, either, or neither.`, it: `La Napola aggiunge una categoria di punteggio bonus basata sul seme di denari.

**La sequenza:** A fine mano, conta quanti denari hai catturato a partire dall'asso — asso, poi 2 di denari, poi 3 di denari, e così via senza interruzioni. Questa sequenza ininterrotta è la tua Napola.

**Punteggio:** Una sequenza di 3 carte (asso + 2 + 3) vale **3 punti**. Ogni carta di denari aggiuntiva che continua la sequenza aggiunge 1 punto in più. Quindi dall'asso al 4 = 4 punti, dall'asso al 5 = 5 punti, e così via fino a un massimo di 10.

**Le carte chiave:** L'asso, il 2 e il 3 di denari sono essenziali — senza tutti e tre, non ottieni nulla per la Napola indipendentemente da quanti altri denari possiedi. Trattali come carte chiave: catturale quando puoi, e rifletti attentamente prima di lasciarle prendere all'avversario.

**Interazione con la categoria Denari:** La Napola è indipendente dal punto standard dei denari. Puoi vincere entrambi, uno solo, o nessuno.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { napola: true },
  },
  {
    id: 'V2-S1',
    name: { en: 'Napola: Build the Run', it: 'Napola: Costruire la Sequenza' },
    description: { en: 'Build and protect the Coins run; {{card:coins-1}}, {{card:coins-2}}, and {{card:coins-3}} are key cards.', it: 'Costruisci e proteggi la sequenza di denari; asso, 2 e 3 di denari sono carte chiave.' },
    prerequisites: ['V2-R'],
    hasChallenges: true,
    variantConfig: { napola: true },
  },
  {
    id: 'V2-S2',
    name: { en: 'Napola: Block the Run', it: 'Napola: Bloccare la Sequenza' },
    description: { en: 'Break the opponent\'s run by capturing low Coins cards early.', it: 'Interrompi la sequenza dell\'avversario catturando le basse carte di denari per prime.' },
    prerequisites: ['V2-R', 'S10'],
    hasChallenges: true,
    variantConfig: { napola: true },
  },

  // ── Variant: V3 — Settanta ───────────────────────────────────────────────────
  {
    id: 'V3-R',
    name: { en: 'Settanta: Rules', it: 'Settanta: Regole' },
    description: { en: 'Capturing all four 7s earns a bonus point; stacks with primiera.', it: 'Catturare tutti e quattro i 7 vale un punto bonus; si cumula con la primiera.' },
    guideText: { en: `Settanta adds one simple rule: capturing all four 7s scores a bonus point.

**The rule:** If you capture the {{card:coins-7}}, {{card:cups-7}}, {{card:swords-7}}, and {{card:clubs-7}} — all four — you earn **1 extra point** at hand end. If your opponent captures even one of them, neither of you scores it.

**Why it matters:** 7s are already the most valuable primiera cards (worth 21 points each in the primiera calculation). Settanta makes them doubly important: now they affect both the primiera category and this new bonus category.

**Strategy tip:** You don't need to win the primiera to score Settanta, and vice versa. But since 7s drive both, the two are tightly linked — protecting your 7s and contesting your opponent's 7s is even more critical in Settanta games.`, it: `Settanta aggiunge una regola semplice: catturare tutti e quattro i 7 vale un punto bonus.

**La regola:** Se catturi il 7 di denari, coppe, spade e bastoni — tutti e quattro — ottieni **1 punto extra** a fine mano. Se l'avversario ne cattura anche solo uno, nessuno dei due lo segna.

**Perché è importante:** I 7 sono già le carte più preziose per la primiera (valgono 21 punti ciascuno nel calcolo della primiera). La Settanta li rende doppiamente importanti: ora influenzano sia la categoria primiera che questa nuova categoria bonus.

**Consiglio strategico:** Non devi vincere la primiera per segnare la Settanta, e viceversa. Ma siccome i 7 guidano entrambe, le due sono strettamente collegate — proteggere i tuoi 7 e contrastare quelli dell'avversario è ancora più critico nelle partite con Settanta.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'S5'],
    hasChallenges: true,
    variantConfig: { settanta: true },
  },
  {
    id: 'V3-S1',
    name: { en: 'Settanta: 7s Are Critical', it: 'Settanta: I 7 Sono Critici' },
    description: { en: '7s become more valuable; denying the 4th 7 can swing the game.', it: 'I 7 diventano più preziosi; negare il 4° 7 può cambiare le sorti del gioco.' },
    prerequisites: ['V3-R'],
    hasChallenges: true,
    variantConfig: { settanta: true },
  },

  // ── Variant: V4 — Re Bello ───────────────────────────────────────────────────
  {
    id: 'V4-R',
    name: { en: 'Re Bello: Rules', it: 'Re Bello: Regole' },
    description: { en: 'Capturing the {{card:coins-10}} earns 1 point; treat it like a second settebello.', it: 'Catturare il 10 di denari vale 1 punto; trattalo come un secondo settebello.' },
    guideText: { en: `Re Bello adds one extra scoring card to the game.

**The rule:** The {{card:coins-10}} (the highest-rank card in the Coins suit) is worth **1 point** to whoever captures it at hand end. This point is scored in addition to all other categories.

**Why it matters:** You already know the {{card:coins-7}} (settebello) scores a point. Re Bello adds a second individually-valued card in the same suit. The {{card:coins-10}} becomes a key card — contest it the same way you would contest the settebello.

**Combined with standard play:** Re Bello doesn't change any capture rules. It only adds one scoring entry at hand end. All other categories — Coins, Primiera, Scope, Settebello — work exactly as normal.`, it: `Il Re Bello aggiunge una carta di punteggio extra al gioco.

**La regola:** Il Re di denari (la carta di rango più alto nel seme di denari) vale **1 punto** per chi lo cattura a fine mano. Questo punto si somma a tutte le altre categorie.

**Perché è importante:** Sai già che il 7 di denari (settebello) vale un punto. Il Re Bello aggiunge una seconda carta di valore individuale nello stesso seme. Il re di denari diventa una carta chiave — contendila nello stesso modo in cui contenderesti il settebello.

**Combinato col gioco standard:** Il Re Bello non cambia nessuna regola di cattura. Aggiunge solo una voce di punteggio a fine mano. Tutte le altre categorie — Denari, Primiera, Scope, Settebello — funzionano esattamente come al solito.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { reBello: true },
  },
  {
    id: 'V4-S1',
    name: { en: 'Re Bello: Key Card Priority', it: 'Re Bello: Priorità delle Carte Chiave' },
    description: { en: 'Re Bello joins the key card priority list alongside the settebello.', it: 'Il re bello si aggiunge alla lista delle carte chiave insieme al settebello.' },
    prerequisites: ['V4-R', 'S2'],
    hasChallenges: true,
    variantConfig: { reBello: true },
  },

  // ── Variant: V5 — Rosmarino ──────────────────────────────────────────────────
  {
    id: 'V5-R',
    name: { en: 'Rosmarino: Rules', it: 'Rosmarino: Regole' },
    description: { en: 'Capturing the {{card:swords-8}} earns 1 point.', it: 'Catturare l\'8 di spade vale 1 punto.' },
    guideText: { en: `Rosmarino adds one extra scoring card, similar to Re Bello but in a different suit.

**The rule:** The {{card:swords-8}} (rank 8 in the Swords suit) is worth **1 point** to whoever captures it. This is scored at hand end alongside all other categories.

**The name:** "Rosmarino" means rosemary in Italian — the {{card:swords-8}} is sometimes depicted holding a sprig of rosemary in traditional Napoletane decks, giving the variant its name.

**Strategy:** The {{card:swords-8}} joins the key card list. When it appears on the table, treat it with the same urgency as the settebello: if you can capture it, do so; if you must discard into a position where your opponent can take it, think twice.

**Combined with standard play:** All normal rules remain. Rosmarino only adds one additional scoring entry at hand end.`, it: `Il Rosmarino aggiunge una carta di punteggio extra, simile al Re Bello ma in un seme diverso.

**La regola:** Il Fante di spade (rango 8 nel seme di spade) vale **1 punto** per chi lo cattura. Viene segnato a fine mano insieme a tutte le altre categorie.

**Il nome:** "Rosmarino" indica la pianta aromatica — il fante di spade è talvolta raffigurato con un rametto di rosmarino nei mazzi napoletani tradizionali, da cui il nome della variante.

**Strategia:** Il fante di spade entra nella lista delle carte chiave. Quando appare sul tavolo, trattalo con la stessa urgenza del settebello: se puoi catturarlo, fallo; se devi scartare in una posizione in cui l'avversario può prenderlo, pensaci due volte.

**Combinato col gioco standard:** Tutte le regole normali rimangono. Il Rosmarino aggiunge solo una voce di punteggio aggiuntiva a fine mano.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { rosmarino: true },
  },
  {
    id: 'V5-S1',
    name: { en: 'Rosmarino: Key Card Priority', it: 'Rosmarino: Priorità delle Carte Chiave' },
    description: { en: 'Rosmarino joins the key card priority list; suit choice when multiple 8s are on the table.', it: 'Il rosmarino si aggiunge alla lista delle carte chiave; scelta del seme con più 8 sul tavolo.' },
    prerequisites: ['V5-R', 'S2'],
    hasChallenges: true,
    variantConfig: { rosmarino: true },
  },

  // ── Variant: V6 — Primiera Veneto ────────────────────────────────────────────
  {
    id: 'V6-R',
    name: { en: 'Veneto Primiera: Rules', it: 'Primiera Veneta: Regole' },
    description: { en: 'Nominative values; face cards are worth 0; adjusted priority order.', it: 'Valori nominativi; le figure valgono 0; ordine di priorità modificato.' },
    guideText: { en: `The Veneto region plays primiera with different card values than the standard rules.

**Standard primiera recap:** Each suit contributes one card; you pick the best card per suit using fixed point values (7=21, 6=18, Ace=16, 5=15, 4=14, 3=13, 2=12, face cards=10). Whoever has the highest total across all four suits wins the primiera point.

**Veneto change:** Face cards (Jack, Queen, King) are worth **0** instead of 10. All other cards use their face value: 7=7, 6=6, 5=5, 4=4, 3=3, 2=2, Ace=1. There are no special primiera multipliers — the rank value is the primiera value.

**What changes strategically:** Face cards become worthless for primiera — if you hold only face cards in a suit, that suit contributes 0. The 7 remains the best card, but 6 is now second (6 points vs. 5 for a 5). Aces are nearly as bad as 2s. Face cards become ideal discard candidates.`, it: `La regione Veneto gioca la primiera con valori di carte diversi dalle regole standard.

**Riepilogo primiera standard:** Ogni seme contribuisce una carta; scegli la carta migliore per seme usando valori fissi (7=21, 6=18, Asso=16, 5=15, 4=14, 3=13, 2=12, figure=10). Chi ha il totale più alto tra tutti e quattro i semi vince il punto primiera.

**Variazione veneta:** Le figure (fante, cavallo, re) valgono **0** invece di 10. Tutte le altre carte usano il loro valore nominale: 7=7, 6=6, 5=5, 4=4, 3=3, 2=2, Asso=1. Non ci sono moltiplicatori speciali per la primiera — il valore del rango è il valore della primiera.

**Cosa cambia strategicamente:** Le figure diventano inutili per la primiera — se hai solo figure in un seme, quel seme contribuisce 0. Il 7 rimane la carta migliore, ma il 6 è ora secondo (6 punti vs. 5 per un 5). Gli assi sono quasi inutili come i 2. Le figure diventano candidati ideali per lo scarto.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'S5'],
    hasChallenges: true,
    variantConfig: { primieraValues: 'veneto' },
  },
  {
    id: 'V6-S1',
    name: { en: 'Veneto Primiera: Discard Figures', it: 'Primiera Veneta: Scartare le Figure' },
    description: { en: 'Figures are ideal discard candidates; 7 and 6 protection becomes more critical.', it: 'Le figure sono candidati ideali per lo scarto; la protezione di 7 e 6 diventa più critica.' },
    prerequisites: ['V6-R'],
    hasChallenges: true,
    variantConfig: { primieraValues: 'veneto' },
  },

  // ── Variant: V7 — Primiera Milano ────────────────────────────────────────────
  {
    id: 'V7-R',
    name: { en: 'Milano Primiera: Rules', it: 'Primiera Milanese: Regole' },
    description: { en: 'Count-based primiera: most 7s first, then 6s, then Aces as tiebreaker.', it: 'Primiera basata sul conteggio: più 7, poi 6, poi assi come spareggio.' },
    guideText: { en: `Milano primiera completely replaces the standard point-calculation method with a counting approach.

**How it works:** Instead of adding up primiera values per suit, you count raw card totals:

1. **Most 7s wins.** Whoever captured more 7s wins the primiera point. If you have 3 sevens and your opponent has 1, you win.
2. **Tiebreak: most 6s.** If you're tied on 7s, whoever has more 6s wins.
3. **Tiebreak: most Aces.** If still tied, whoever has more Aces wins.
4. **Still tied: both score.** If all three counts are equal, both players score the primiera point.

**What changes strategically:** Individual suit composition no longer matters — all 7s are equally valuable regardless of suit. There is no "best card per suit" calculation. Winning primiera is now purely about collecting more 7s than your opponent, then 6s, then Aces as a last resort.

**Note:** Milano primiera and Settanta (V3) are mutually exclusive — they both involve 7s in incompatible ways.`, it: `La primiera milanese sostituisce completamente il metodo standard di calcolo dei punti con un approccio conteggio.

**Come funziona:** Invece di sommare i valori della primiera per seme, si contano i totali grezzi delle carte:

1. **Chi ha più 7 vince.** Chi ha catturato più 7 vince il punto primiera. Se hai 3 sette e l'avversario ne ha 1, vinci tu.
2. **Spareggio: più 6.** Se siete in parità sui 7, vince chi ha più 6.
3. **Spareggio: più Assi.** Se ancora in parità, vince chi ha più assi.
4. **Ancora in parità: entrambi segnano.** Se tutti e tre i conteggi sono uguali, entrambi i giocatori segnano il punto primiera.

**Cosa cambia strategicamente:** La composizione per seme non conta più — tutti i 7 sono ugualmente preziosi indipendentemente dal seme. Non c'è più il calcolo della "carta migliore per seme". Vincere la primiera è ora puramente una questione di raccogliere più 7 dell'avversario, poi 6, poi assi come ultima risorsa.

**Nota:** La primiera milanese e la Settanta (V3) si escludono a vicenda — entrambe coinvolgono i 7 in modi incompatibili.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'S5'],
    hasChallenges: true,
    variantConfig: { primieraValues: 'milano' },
  },
  {
    id: 'V7-S1',
    name: { en: 'Milano Primiera: Every 7 Matters', it: 'Primiera Milanese: Ogni 7 Conta' },
    description: { en: 'Every 7 has equal weight; tiebreaker chain awareness is essential.', it: 'Ogni 7 ha uguale peso; la consapevolezza della catena di spareggio è essenziale.' },
    prerequisites: ['V7-R'],
    hasChallenges: true,
    variantConfig: { primieraValues: 'milano' },
  },

  // ── Variant: V8 — Scopa a Quindici ──────────────────────────────────────────
  {
    id: 'V8-R',
    name: { en: 'Scopa a Quindici: Rules', it: 'Scopa a Quindici: Regole' },
    description: { en: 'Captures must sum to 15 with the played card.', it: 'Le prese devono sommare a 15 con la carta giocata.' },
    guideText: { en: `Scopa a Quindici replaces the standard capture rule with a new target sum.

**The rule:** When you play a card, any capture you make must total exactly **15** when you add the played card's rank to the captured cards' ranks. If no combination totalling 15 is possible, you must discard instead.

**Rank values:** Ace=1, 2=2, 3=3, 4=4, 5=5, 6=6, 7=7, Jack=8, Queen=9, King=10. These are the same rank values used throughout the game.

**Example:** You play a 7. To capture, you need table cards summing to 8 — for instance, an 8 alone, or a 3+5, or a 2+6. You cannot capture a 7 with a 7 (7+7=14, not 15).

**Fewest-cards priority:** If multiple valid combinations reach 15, you must take the one using the fewest table cards. If those also tie in size, you choose.

**Important:** The mandatory-rank-match rule from standard Scopa does NOT apply here. Every capture must reach 15 — matching ranks is irrelevant.`, it: `Scopa a Quindici sostituisce la regola di cattura standard con un nuovo totale obiettivo.

**La regola:** Quando giochi una carta, qualsiasi cattura che fai deve totalizzare esattamente **15** sommando il rango della carta giocata ai ranghi delle carte catturate. Se nessuna combinazione che arriva a 15 è possibile, devi scartare invece.

**Valori di rango:** Asso=1, 2=2, 3=3, 4=4, 5=5, 6=6, 7=7, Fante=8, Cavallo=9, Re=10. Sono gli stessi valori di rango usati in tutto il gioco.

**Esempio:** Giochi un 7. Per catturare, hai bisogno di carte sul tavolo che sommino a 8 — per esempio, un 8 da solo, o un 3+5, o un 2+6. Non puoi catturare un 7 con un 7 (7+7=14, non 15).

**Priorità al minor numero di carte:** Se più combinazioni valide arrivano a 15, devi prendere quella che usa il minor numero di carte del tavolo. Se anche queste pareggiano in numero, scegli tu.

**Importante:** La regola della corrispondenza obbligatoria di rango della Scopa standard NON si applica qui. Ogni cattura deve raggiungere 15 — la corrispondenza di rango è irrilevante.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { captureTarget: 'quindici' },
  },
  {
    id: 'V8-S1',
    name: { en: 'Quindici: Fewest-Cards Priority', it: 'Quindici: Priorità al Minor Numero di Carte' },
    description: { en: 'When multiple captures sum to 15, you must take the group using the fewest table cards.', it: 'Quando più prese sommano a 15, devi prendere il gruppo che usa il minor numero di carte del tavolo.' },
    prerequisites: ['V8-R', 'S6'],
    hasChallenges: true,
    variantConfig: { captureTarget: 'quindici' },
  },

  // ── Variant: V9 — Scopa a Undici ────────────────────────────────────────────
  {
    id: 'V9-R',
    name: { en: 'Scopa a Undici: Rules', it: 'Scopa a Undici: Regole' },
    description: { en: 'Captures must sum to 11; complement pairs (1↔10, 2↔9, etc.).', it: 'Le prese devono sommare a 11; coppie complementari (1↔10, 2↔9, ecc.).' },
    guideText: { en: `Scopa a Undici uses the same structure as Quindici, but the target is 11.

**The rule:** Every capture must total exactly **11** (played card + table cards). If no 11-sum is possible, discard instead.

**Complement pairs:** Since the target is 11, every single-card capture is a complement pair: Ace captures 10 (1+10=11), 2 captures 9 (2+9=11), 3 captures 8 (3+8=11), 4 captures 7 (4+7=11), 5 captures 6 (5+6=11). That's it for single-card captures — every rank from 1 to 10 has exactly one complement, and no card can capture its own rank (e.g. 6+6=12≠11).

**Multi-card captures:** A 2 can capture a 3+6 (2+3+6=11), a 4+5 (2+4+5=11), and so on. Many combinations are possible.

**Fewest-cards priority:** Same as Quindici — fewest table cards wins. If tied, you choose.

**Important:** The mandatory-rank-match rule does NOT apply. Only the sum matters.`, it: `Scopa a Undici usa la stessa struttura della Quindici, ma il totale obiettivo è 11.

**La regola:** Ogni cattura deve totalizzare esattamente **11** (carta giocata + carte del tavolo). Se non è possibile arrivare a 11, scarta invece.

**Coppie complementari:** Poiché il totale obiettivo è 11, ogni cattura con una singola carta è una coppia complementare: asso cattura 10 (1+10=11), 2 cattura 9 (2+9=11), 3 cattura 8 (3+8=11), 4 cattura 7 (4+7=11), 5 cattura 6 (5+6=11). Queste sono le catture con singola carta — non ci sono altre opzioni da singola carta.

**Catture multi-carta:** Un 2 può catturare un 3+6 (2+3+6=11), un 4+5 (2+4+5=11), e così via. Molte combinazioni sono possibili.

**Priorità al minor numero di carte:** Come nella Quindici — vince il minor numero di carte del tavolo. In caso di parità, scegli tu.

**Importante:** La regola della corrispondenza obbligatoria di rango NON si applica. Conta solo la somma.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { captureTarget: 'undici' },
  },
  {
    id: 'V9-S1',
    name: { en: 'Undici: Fewest-Cards Priority', it: 'Undici: Priorità al Minor Numero di Carte' },
    description: { en: 'When multiple captures sum to 11, you must take the group using the fewest table cards.', it: 'Quando più prese sommano a 11, devi prendere il gruppo che usa il minor numero di carte del tavolo.' },
    prerequisites: ['V9-R', 'S6'],
    hasChallenges: true,
    variantConfig: { captureTarget: 'undici' },
  },

  // ── Variant: V10 — Scopa Inversa ─────────────────────────────────────────────
  {
    id: 'V10-R',
    name: { en: 'Scopa Inversa: Rules', it: 'Scopa Inversa: Regole' },
    description: { en: 'Reversed win condition: lowest score wins; scope become negative; must still capture.', it: 'Condizione di vittoria invertita: vince il punteggio più basso; le scope diventano negative; si deve ancora prendere.' },
    guideText: { en: `Scopa Inversa flips the win condition: **lowest score wins**.

**The reversal:** Every scoring category works in reverse. Capturing more Coins, taking the settebello, winning primiera, or sweeping the table — these all score points that hurt you. The player with the fewest points at the end wins.

**Scope count against you:** When you clear the table, you earn a scopa — but now that means one more point on your score, which is bad. Scope become something to avoid giving yourself and, ideally, something to engineer for your opponent.

**You must still capture:** The mandatory capture rules are completely unchanged. If you can capture, you must. You cannot voluntarily discard to avoid accumulating points.

**Strategy flip:** Everything you learned about the standard game applies in reverse. The settebello, the Coins cards, extra Scope — all liabilities. Your goal is to force captures onto your opponent while discarding safely yourself.

**Note:** Inversa is incompatible with Scopa d'Assi (V1) — they cannot be combined.`, it: `Scopa Inversa ribalta la condizione di vittoria: **vince il punteggio più basso**.

**Il ribaltamento:** Ogni categoria di punteggio funziona al contrario. Catturare più denari, prendere il settebello, vincere la primiera, o fare una scopa — tutto questo segna punti che ti danneggiano. Vince il giocatore con meno punti alla fine.

**Le scope contano contro di te:** Quando svuoti il tavolo, fai una scopa — ma ora significa un punto in più sul tuo punteggio, il che è negativo. Le scope diventano qualcosa da evitare per te e, idealmente, qualcosa da far ottenere all'avversario.

**Devi ancora catturare:** Le regole di cattura obbligatoria sono completamente invariate. Se puoi catturare, devi farlo. Non puoi scartare volontariamente per evitare di accumulare punti.

**Ribaltamento della strategia:** Tutto ciò che hai imparato sul gioco standard si applica al contrario. Il settebello, le carte di denari, le scope extra — tutto è una passività. Il tuo obiettivo è forzare le catture sull'avversario mentre scarti tu in sicurezza.

**Nota:** L'Inversa è incompatibile con la Scopa d'Assi (V1) — non possono essere combinate.` },
    prerequisites: ['F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10'],
    hasChallenges: true,
    variantConfig: { inversa: true },
  },
  {
    id: 'V10-S1',
    name: { en: 'Inversa: Avoid Captures', it: 'Inversa: Evitare le Prese' },
    description: { en: 'Avoid captures; force opponents to take; choose the worst capture when forced.', it: 'Evita le prese; forza gli avversari a prendere; scegli la presa peggiore quando sei costretto.' },
    prerequisites: ['V10-R'],
    hasChallenges: true,
    variantConfig: { inversa: true },
  },
  {
    id: 'V10-S2',
    name: { en: 'Inversa: Inverted Scopa Blocking', it: 'Inversa: Blocco Scopa Invertito' },
    description: { en: 'Want table sum ≤ threshold so the opponent gets a scopa (which hurts them).', it: 'Vuoi che la somma sul tavolo sia ≤ soglia così l\'avversario fa una scopa (che gli fa male).' },
    prerequisites: ['V10-R', 'S7'],
    hasChallenges: true,
    variantConfig: { inversa: true },
  },
]

// O(1) prerequisite lookup: nodeId → list of prerequisite IDs
export const DEPENDENCY_MAP: Record<string, string[]> = Object.fromEntries(
  LEARN_NODES.map(node => [node.id, node.prerequisites])
)
