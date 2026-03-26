import type React from 'react'
import type { Card } from '../engine'
import { useSettingsStore } from '../store/settingsStore.ts'

// ── Napoletane ──────────────────────────────────────────────────────────────

const BASE = import.meta.env.BASE_URL

function napoletaneSrc(card: Card): string {
  return `${BASE}napoletane/${card.suit}-${card.rank}.jpg`
}

// ── French SVG sprite ────────────────────────────────────────────────────────
// Source: English_pattern_playing_cards_deck_PLUS_CC0.svg
// SVG dimensions: 5109×2882px
// Card face size: 359×539px
// Row order (top→bottom): Spades, Hearts, Diamonds, Clubs → Italian: Swords, Cups, Coins, Clubs
// Column: col 0 (x=30)=Ace, cols 1–9 (x=420,810,...,3540)=2–10, col 10=Jack, col 11=Queen, col 12=King
// Note: French 8,9,10 (cols 7,8,9) are NOT in Italian deck; Italian 8,9,10 = Jack,Queen,King

const FRENCH_SVG_W = 5109
const FRENCH_SVG_H = 2882
const FRENCH_CARD_W = 359
const FRENCH_CARD_H = 539

const FRENCH_COL_X: Record<number, number> = {
  // Italian rank → SVG x of card (col * 390 but col 0 starts at x=30)
  1: 30, 2: 420, 3: 810, 4: 1200, 5: 1590, 6: 1980, 7: 2370,
  8: 3930,  // Jack  (Italian Fante)
  9: 4320,  // Queen (Italian Regina)
  10: 4710, // King  (Italian Re)
}

const FRENCH_ROW_Y: Record<string, number> = {
  swords: 30,   // Spades
  cups:   600,  // Hearts
  coins:  1170, // Diamonds
  clubs:  1740, // Clubs
}

// ── Uno SVG sprite ───────────────────────────────────────────────────────────
// Source: UNO_cards_deck.svg
// SVG dimensions: 3362×2882px
// Each card cell: 240×360px, starting at offset (1,1), spaced 240×360
// Rows 0–3: Red (#ff5555)=Cups, Yellow (#ffaa00)=Coins, Green (#55aa55)=Clubs, Blue (#5555ff)=Swords
// Col: 0=rank10, 1=rank1, 2=rank2, ..., 9=rank9; col 10-12=action cards
// All rows have 14 columns (0–13)
// Col layout per color row: 0=rank10, 1–9=ranks1-9, 10=Skip, 11=Reverse, 12=DrawTwo, 13=ColorChange
// Card back: row 0, col 13 (Red Color Change card — last cell in the first row, not used in Scopa)

const UNO_SVG_W = 3362
const UNO_SVG_H = 2882
const UNO_CARD_W = 240
const UNO_CARD_H = 360

const UNO_ROW: Record<string, number> = {
  cups: 0, coins: 1, clubs: 2, swords: 3,
}

function unoCol(rank: number): number {
  return rank === 10 ? 0 : rank // rank 1–9 → col 1–9; rank 10 → col 0
}

// ── Shared sizes ─────────────────────────────────────────────────────────────

// Aspect ratio from source images: 1324×2188 ≈ 0.605
// Base sizes (used on screens >= 400px)
const SIZES_BASE = {
  sm: { w: 52,  h: 86  },   // opponent backs, capture-select list
  md: { w: 72,  h: 119 },   // table cards
  lg: { w: 90,  h: 149 },   // player hand
}

// Compact sizes for narrow screens (< 400px)
const SIZES_COMPACT = {
  sm: { w: 40,  h: 66  },
  md: { w: 56,  h: 93  },
  lg: { w: 72,  h: 119 },
}

function useSizes() {
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 400
  return isNarrow ? SIZES_COMPACT : SIZES_BASE
}

// ── Types ────────────────────────────────────────────────────────────────────

export type CardViewProps = {
  card: Card | null
  faceDown?: boolean
  selected?: boolean
  highlighted?: boolean
  capturable?: boolean
  rotated?: boolean
  onClick?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

// ── CardView ─────────────────────────────────────────────────────────────────

export default function CardView(props: CardViewProps) {
  const deckStyle = useSettingsStore(s => s.deckStyle)
  if (deckStyle === 'french') return <FrenchCard {...props} />
  if (deckStyle === 'uno') return <UnoCard {...props} />
  return <NapoletaneCard {...props} />
}

// ── Napoletane card ───────────────────────────────────────────────────────────

function NapoletaneCard({
  card, faceDown = false, selected = false, highlighted = false, capturable = false,
  rotated = false, onClick, onPointerEnter, onPointerLeave, size = 'md', disabled = false,
}: CardViewProps) {
  const SIZES = useSizes()
  const { w, h } = SIZES[size]
  const src = faceDown || !card ? `${BASE}napoletane/back.jpg` : napoletaneSrc(card)

  const outlineColor = selected ? '#f1be32' : highlighted ? '#acd157' : capturable ? '#99c9ff' : undefined
  const outlineWidth = outlineColor ? 3 : 0

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role={onClick ? 'button' : undefined}
      aria-label={card ? `${card.rank} of ${card.suit}` : 'card back'}
      style={{
        width: rotated ? h : w,
        height: rotated ? w : h,
        flexShrink: 0,
        borderRadius: 4,
        overflow: 'hidden',
        transform: `translateY(${selected ? -8 : 0}px)${rotated ? ' rotate(90deg)' : ''}`,
        transition: 'transform 0.15s ease',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        outline: outlineColor ? `${outlineWidth}px solid ${outlineColor}` : undefined,
        boxShadow: selected
          ? '0 0 10px 3px rgba(250,204,21,0.7)'
          : highlighted
          ? '0 0 10px 3px rgba(74,222,128,0.7)'
          : capturable
          ? '0 0 8px 2px rgba(96,165,250,0.6)'
          : '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      <img
        src={src}
        alt={card ? `${card.rank} of ${card.suit}` : 'card back'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
    </div>
  )
}

// ── Shared sprite helper ─────────────────────────────────────────────────────

function spriteStyle(
  spriteUrl: string,
  svgW: number,
  svgH: number,
  cellW: number,
  cellH: number,
  col: number,
  row: number,
  targetW: number,
  targetH: number,
) {
  const scaleX = targetW / cellW
  const scaleY = targetH / cellH
  return {
    backgroundImage: `url('${spriteUrl}')`,
    backgroundSize: `${svgW * scaleX}px ${svgH * scaleY}px`,
    backgroundPosition: `-${col * targetW}px -${row * targetH}px`,
    backgroundRepeat: 'no-repeat' as const,
  }
}

// ── French card ───────────────────────────────────────────────────────────────

function FrenchCard({
  card, faceDown = false, selected = false, highlighted = false, capturable = false,
  rotated = false, onClick, onPointerEnter, onPointerLeave, size = 'md', disabled = false,
}: CardViewProps) {
  const SIZES = useSizes()
  const { w, h } = SIZES[size]

  const outlineColor = selected ? '#f1be32' : highlighted ? '#acd157' : capturable ? '#99c9ff' : undefined
  const shadow = selected
    ? '0 0 10px 3px rgba(250,204,21,0.7)'
    : highlighted
    ? '0 0 10px 3px rgba(74,222,128,0.7)'
    : capturable
    ? '0 0 8px 2px rgba(96,165,250,0.6)'
    : '0 1px 3px rgba(0,0,0,0.4)'

  function getSprite(): React.CSSProperties {
    if (faceDown || !card) {
      // Use CSS card back (blue pattern) — no card back sprite available yet
      return {
        background: '#1b1b32',
        backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 0,transparent 50%)',
        backgroundSize: '8px 8px',
      }
    }
    const cardX = FRENCH_COL_X[card.rank] ?? 30
    const cardY = FRENCH_ROW_Y[card.suit] ?? 30
    // Convert card absolute position to sprite col/row for the background-position formula
    // We treat the sprite as a grid of cells, but the French grid has irregular first step
    // Use direct pixel-based background-position instead:
    const scaleX = w / FRENCH_CARD_W
    const scaleY = h / FRENCH_CARD_H
    return {
      backgroundImage: `url('${BASE}french-cards-cc0.svg')`,
      backgroundSize: `${FRENCH_SVG_W * scaleX}px ${FRENCH_SVG_H * scaleY}px`,
      backgroundPosition: `-${cardX * scaleX}px -${cardY * scaleY}px`,
      backgroundRepeat: 'no-repeat',
    }
  }

  const sprite = getSprite()
  const displayW = rotated ? h : w
  const displayH = rotated ? w : h

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role={onClick ? 'button' : undefined}
      aria-label={card ? `${card.rank} of ${card.suit}` : 'card back'}
      style={{
        width: displayW,
        height: displayH,
        flexShrink: 0,
        borderRadius: 4,
        overflow: 'hidden',
        transform: `translateY(${selected ? -8 : 0}px)${rotated ? ' rotate(90deg)' : ''}`,
        transition: 'transform 0.15s ease',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        outline: outlineColor ? `3px solid ${outlineColor}` : undefined,
        boxShadow: shadow,
        ...sprite,
      }}
    />
  )
}

// ── Uno card ──────────────────────────────────────────────────────────────────

function UnoCard({
  card, faceDown = false, selected = false, highlighted = false, capturable = false,
  rotated = false, onClick, onPointerEnter, onPointerLeave, size = 'md', disabled = false,
}: CardViewProps) {
  const SIZES = useSizes()
  const { w, h } = SIZES[size]

  const outlineColor = selected ? '#f1be32' : highlighted ? '#acd157' : capturable ? '#99c9ff' : undefined
  const shadow = selected
    ? '0 0 10px 3px rgba(250,204,21,0.7)'
    : highlighted
    ? '0 0 10px 3px rgba(74,222,128,0.7)'
    : capturable
    ? '0 0 8px 2px rgba(96,165,250,0.6)'
    : '0 1px 3px rgba(0,0,0,0.4)'

  function getSprite(): React.CSSProperties {
    const row = faceDown || !card ? 0 : (UNO_ROW[card.suit] ?? 0)
    const col = faceDown || !card ? 13 : unoCol(card.rank)
    const scaleX = w / UNO_CARD_W
    const scaleY = h / UNO_CARD_H
    return {
      backgroundImage: `url('${BASE}uno-cards.svg')`,
      backgroundSize: `${UNO_SVG_W * scaleX}px ${UNO_SVG_H * scaleY}px`,
      backgroundPosition: `-${(1 + col * UNO_CARD_W) * scaleX}px -${(1 + row * UNO_CARD_H) * scaleY}px`,
      backgroundRepeat: 'no-repeat',
    }
  }

  const sprite = getSprite()
  const displayW = rotated ? h : w
  const displayH = rotated ? w : h

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role={onClick ? 'button' : undefined}
      aria-label={card ? `${card.rank} of ${card.suit}` : 'card back'}
      style={{
        width: displayW,
        height: displayH,
        flexShrink: 0,
        borderRadius: 4,
        overflow: 'hidden',
        transform: `translateY(${selected ? -8 : 0}px)${rotated ? ' rotate(90deg)' : ''}`,
        transition: 'transform 0.15s ease',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        outline: outlineColor ? `3px solid ${outlineColor}` : undefined,
        boxShadow: shadow,
        ...sprite,
      }}
    />
  )
}

