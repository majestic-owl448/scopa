import type { LearnNode, NodeState } from '../types.ts'
import NodeCard from './NodeCard.tsx'

type Props = {
  nodeStates: Record<string, NodeState>
  nodes: LearnNode[]
  onNodeSelect: (nodeId: string) => void
}

// Group nodes by track for layout
function groupNodes(nodes: LearnNode[]) {
  const foundation = nodes.filter(n => n.id.startsWith('F-'))
  const strategy = nodes.filter(n => n.id.startsWith('S'))
  const playerCount = nodes.filter(n => n.id === 'P3' || n.id === 'P4')
  const variants: Record<string, LearnNode[]> = {}
  for (const n of nodes) {
    const m = n.id.match(/^(V\d+)-/)
    if (m) {
      const key = m[1]!
      variants[key] ??= []
      variants[key]!.push(n)
    }
  }
  return { foundation, strategy, playerCount, variants }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-fcc-green uppercase tracking-wide font-semibold border-b border-fcc-quaternary-bg pb-1">
        {title}
      </div>
      {children}
    </div>
  )
}

export default function LearnMap({ nodeStates, nodes, onNodeSelect }: Props) {
  const { foundation, strategy, playerCount, variants } = groupNodes(nodes)

  return (
    <div className="flex flex-col gap-6">
      {/* Foundation */}
      <Section title="Foundation">
        <div className="grid grid-cols-2 gap-2">
          {foundation.map(node => (
            <NodeCard
              key={node.id}
              node={node}
              state={nodeStates[node.id] ?? 'locked'}
              onClick={() => onNodeSelect(node.id)}
            />
          ))}
        </div>
      </Section>

      {/* Strategy + Player Count side by side */}
      <div className="grid grid-cols-2 gap-4">
        <Section title="Strategy">
          <div className="flex flex-col gap-2">
            {strategy.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                state={nodeStates[node.id] ?? 'locked'}
                onClick={() => onNodeSelect(node.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Player Counts">
          <div className="flex flex-col gap-2">
            {playerCount.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                state={nodeStates[node.id] ?? 'locked'}
                onClick={() => onNodeSelect(node.id)}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Variants */}
      <Section title="Variants">
        <div className="flex flex-col gap-4">
          {Object.entries(variants).map(([variantKey, variantNodes]) => (
            <div key={variantKey} className="flex flex-col gap-1.5">
              <div className="text-xs text-fcc-muted font-mono">{variantKey}</div>
              <div className="grid grid-cols-1 gap-1.5">
                {variantNodes.map(node => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    state={nodeStates[node.id] ?? 'locked'}
                    onClick={() => onNodeSelect(node.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
