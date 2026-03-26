import type { PointLandscape, GameConfig } from '../../engine'

type Props = {
  landscape: PointLandscape
  config: GameConfig
}

const STATUS_COLOR: Record<string, string> = {
  secured: 'text-fcc-green',
  lost: 'text-fcc-red',
  contested: 'text-fcc-yellow',
  irrelevant: 'text-fcc-muted',
}

const STATUS_LABEL: Record<string, string> = {
  secured: 'Secured',
  lost: 'Lost',
  contested: 'Contested',
  irrelevant: '—',
}

function Row({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-fcc-secondary-bg last:border-0">
      <span className="text-xs text-fcc-green">{label}</span>
      <span className={`text-xs font-semibold ${STATUS_COLOR[status] ?? 'text-fcc-muted'}`}>
        {STATUS_LABEL[status] ?? status}
      </span>
    </div>
  )
}

export default function PointLandscapePanel({ landscape, config }: Props) {
  return (
    <div className="bg-fcc-secondary-bg border border-fcc-quaternary-bg rounded-lg p-3 text-sm min-w-40">
      <div className="text-xs text-fcc-green uppercase tracking-wide mb-2 font-semibold">Point Landscape</div>
      <Row label="Settebello" status={landscape.settebello} />
      <Row label="Ori" status={landscape.ori} />
      <Row label="Carte" status={landscape.carte} />
      <Row label="Primiera" status={landscape.primiera} />
      {config.settanta && landscape.settanta && (
        <Row label="Settanta" status={landscape.settanta} />
      )}
    </div>
  )
}
