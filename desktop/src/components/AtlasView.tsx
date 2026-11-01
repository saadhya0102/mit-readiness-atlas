import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Scale,
  Sparkles,
} from 'lucide-react'
import {
  domainShortLabels,
  tierMeta,
  type Archetype,
  type ArchetypeId,
  type DimensionId,
  type SignalTier,
} from '../domain/types'
import { DimensionMeter, EvidencePill, MethodNote, TierBadge } from './SignalUI'
import {
  archetypePrevalence,
  formatShare,
  olympiadSubjects,
  tierObservedLevel,
} from '../data/statistics'

const dimensions: DimensionId[] = [
  'depth',
  'validation',
  'ownership',
  'output',
  'impact',
  'collaboration',
]

function PrevalenceNote({ archetypeId }: { archetypeId: ArchetypeId }) {
  const measure = archetypePrevalence[archetypeId]
  const isAthlete = archetypeId === 'athlete'
  return (
    <div className="prevalence-note">
      <p className="prevalence-figure">
        Approximately <strong>{formatShare(measure)}</strong>{' '}
        {isAthlete
          ? 'of MIT undergraduates compete on a team.'
          : 'of MIT students show activity in this area.'}
      </p>
      <small>{measure.basis}</small>
      {measure.caveat && <small>{measure.caveat}</small>}
      {archetypeId === 'olympiad' && (
        <ul className="prevalence-breakdown">
          {olympiadSubjects.slice(0, 5).map((subject) => (
            <li key={subject.label}>
              <span>{subject.label}</span>
              <span>{subject.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface AtlasViewProps {
  archetypes: Archetype[]
  selectedId: ArchetypeId
  onSelect: (id: ArchetypeId) => void
  onCompare: (id: ArchetypeId) => void
  onOpenSources: () => void
}

export function AtlasView({
  archetypes,
  selectedId,
  onSelect,
  onCompare,
  onOpenSources,
}: AtlasViewProps) {
  const selected = useMemo(
    () => archetypes.find((archetype) => archetype.id === selectedId) ?? archetypes[0],
    [archetypes, selectedId],
  )
  const [activeTier, setActiveTier] = useState<SignalTier>(2)

  useEffect(() => setActiveTier(2), [selectedId])

  const tier = selected.tierGroups.find((group) => group.tier === activeTier)

  return (
    <div className="atlas-view">
      <section className="model-index" aria-labelledby="model-index-title">
        <div className="section-intro compact-intro">
          <h1 id="model-index-title">Archetypes</h1>
          <p>
            Eight patterns drawn from documented public profiles, each with its own
            rubric for what counts and how rare it is.
          </p>
        </div>

        <div className="model-list">
          {archetypes.map((archetype) => (
            <button
              key={archetype.id}
              type="button"
              className="model-list-item"
              data-active={archetype.id === selected.id}
              onClick={() => onSelect(archetype.id)}
            >
              <span
                className="model-monogram"
                style={
                  {
                    '--model-color': archetype.color,
                    '--model-soft': archetype.softColor,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                {archetype.monogram}
              </span>
              <span>
                <strong>{archetype.shortName}</strong>
                <small>{archetype.signature}</small>
              </span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>

        <MethodNote>
          <strong>Patterns overlap.</strong>
          <p>
            Strong students often combine two or three of these, and the mix rarely
            matches one pattern exactly.
          </p>
        </MethodNote>
      </section>

      <article
        className="model-detail"
        style={
          {
            '--model-color': selected.color,
            '--model-soft': selected.softColor,
          } as CSSProperties
        }
      >
        <header className="model-header">
          <div className="model-title-row">
            <span className="detail-monogram" aria-hidden="true">
              {selected.monogram}
            </span>
            <div>
              <div className="header-pills">
                <EvidencePill tone="verified">Synthetic composite</EvidencePill>
                <EvidencePill>{selected.primaryDomains.length} core domains</EvidencePill>
              </div>
              <h2>{selected.name}</h2>
              <p className="model-tagline">{selected.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => onCompare(selected.id)}
          >
            Compare my activities
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="model-opening">
          <div>
            <p className="model-description">{selected.description}</p>
            <PrevalenceNote archetypeId={selected.id} />
          </div>
          <section className="profile-shape" aria-labelledby="profile-shape-title">
            <div className="subsection-heading">
              <h3 id="profile-shape-title">Where this pattern is strongest</h3>
              <Scale size={19} aria-hidden="true" />
            </div>
            <div className="dimension-grid">
              {dimensions.map((dimension) => (
                <DimensionMeter
                  key={dimension}
                  dimension={dimension}
                  value={selected.profileShape[dimension]}
                  compact
                />
              ))}
            </div>
          </section>
        </div>

        <section className="signal-ladder" aria-labelledby="signal-ladder-title">
          <div className="subsection-heading">
            <h3 id="signal-ladder-title">What counts at each tier</h3>
            <BookOpen size={19} aria-hidden="true" />
          </div>

          <div className="tier-switcher" aria-label="Signal tier">
            {([1, 2, 3, 4] as SignalTier[]).map((tierNumber) => (
              <button
                key={tierNumber}
                type="button"
                data-active={tierNumber === activeTier}
                onClick={() => setActiveTier(tierNumber)}
                aria-pressed={tierNumber === activeTier}
              >
                <span>T{tierNumber}</span>
                {tierMeta[tierNumber].shortLabel}
              </button>
            ))}
          </div>

          {tier && (
            <div className="tier-panel">
              <div className="tier-panel-intro">
                <TierBadge tier={tier.tier} />
                <div>
                  <p>{tier.interpretation}</p>
                  <p className="tier-calibration">
                    {tierMeta[tier.tier].calibration}
                  </p>
                  <p className="tier-observed">
                    <strong>{formatShare(tierObservedLevel[tier.tier])}</strong>{' '}
                    of documented MIT profiles{' '}
                    {tierObservedLevel[tier.tier].levelLabel}.
                  </p>
                </div>
              </div>
              <div className="signal-list">
                {tier.examples.map((example) => (
                  <article key={example.id} className="signal-row">
                    <div className="signal-check" aria-hidden="true">
                      <Check size={14} strokeWidth={2.4} />
                    </div>
                    <div>
                      <h4>{example.name}</h4>
                      <p>{example.summary}</p>
                      {example.context && <small>{example.context}</small>}
                    </div>
                    <span className="domain-tag">
                      {domainShortLabels[example.domain]}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="quality-section" aria-labelledby="quality-title">
          <div className="subsection-heading">
            <h3 id="quality-title">Why the same activity can mean different things</h3>
            <Sparkles size={19} aria-hidden="true" />
          </div>
          <div className="modifier-list">
            {selected.modifiers.map((modifier) => (
              <details key={modifier.id} className="modifier-row">
                <summary>
                  <span>{modifier.label}</span>
                  <small>{modifier.question}</small>
                </summary>
                <div className="modifier-comparison">
                  <div>
                    <strong>Stronger evidence</strong>
                    <p>{modifier.strong}</p>
                  </div>
                  <div>
                    <strong>Needs context</strong>
                    <p>{modifier.caution}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="model-footer-grid">
          <section>
            <h3>Common combinations</h3>
            <ul className="plain-list">
              {selected.combinations.map((combination) => (
                <li key={combination}>{combination}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Where to go next</h3>
            <ul className="plain-list">
              {selected.nextMoves.map((move) => (
                <li key={move}>{move}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="evidence-footer">
          <div>
            <strong>Evidence note</strong>
            <p>{selected.evidenceNote}</p>
          </div>
          <button type="button" className="text-button" onClick={onOpenSources}>
            Review {selected.sourceIds.length} linked sources
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </footer>
      </article>
    </div>
  )
}
