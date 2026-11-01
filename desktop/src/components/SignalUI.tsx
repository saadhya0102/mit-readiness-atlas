import type { CSSProperties, ReactNode } from 'react'
import { CircleDot, Info } from 'lucide-react'
import {
  dimensionLabels,
  tierMeta,
  type DimensionId,
  type SignalTier,
} from '../domain/types'

export function TierBadge({ tier }: { tier: SignalTier }) {
  return (
    <span className="tier-badge" data-tier={tier}>
      <span aria-hidden="true">T{tier}</span>
      {tierMeta[tier].shortLabel}
    </span>
  )
}

function qualitativeDimension(value: number) {
  if (value >= 80) return { label: 'Very high', scale: 1 }
  if (value >= 60) return { label: 'High', scale: 0.75 }
  if (value >= 38) return { label: 'Moderate', scale: 0.5 }
  if (value > 0) return { label: 'Emerging', scale: 0.25 }
  return { label: 'No evidence', scale: 0 }
}

export function DimensionMeter({
  dimension,
  value,
  compact = false,
}: {
  dimension: DimensionId
  value: number
  compact?: boolean
}) {
  const level = qualitativeDimension(value)
  return (
    <div className="dimension-meter" data-compact={compact}>
      <div className="dimension-label">
        <span>{dimensionLabels[dimension]}</span>
        <span>{level.label}</span>
      </div>
      <div
        className="meter-track"
        role="img"
        aria-label={`${dimensionLabels[dimension]}: ${level.label}`}
      >
        <span
          className="meter-fill"
          style={{ '--meter-scale': level.scale } as CSSProperties}
        />
      </div>
    </div>
  )
}

export function MethodNote({ children }: { children: ReactNode }) {
  return (
    <div className="method-note">
      <Info size={18} strokeWidth={1.8} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function EvidencePill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'verified' | 'caution'
}) {
  return (
    <span className="evidence-pill" data-tone={tone}>
      <CircleDot size={12} strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  )
}
