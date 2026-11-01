import { useMemo, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronRight, Info } from 'lucide-react'
import {
  domainShortLabels,
  tierMeta,
  type Archetype,
  type ArchetypeId,
} from '../domain/types'
import { modelStudents, tierTally, type ModelStudent } from '../data/modelStudents'
import { MethodNote, TierBadge } from './SignalUI'

interface ModelStudentsViewProps {
  archetypes: Archetype[]
  onOpenArchetype: (id: ArchetypeId) => void
}

function ShapeTally({ student }: { student: ModelStudent }) {
  const tally = tierTally(student).filter((entry) => entry.count > 0)
  return (
    <ul className="shape-tally" aria-label="Signals by tier">
      {tally.map((entry) => (
        <li key={entry.tier}>
          <TierBadge tier={entry.tier} />
          <span>
            {entry.count}
            <span className="sr-only">
              {' '}
              {entry.count === 1 ? 'signal' : 'signals'} at{' '}
              {tierMeta[entry.tier].label}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ModelStudentsView({
  archetypes,
  onOpenArchetype,
}: ModelStudentsViewProps) {
  const [selectedId, setSelectedId] = useState(modelStudents[0].id)
  const selected = useMemo(
    () => modelStudents.find((student) => student.id === selectedId) ?? modelStudents[0],
    [selectedId],
  )
  const archetype = archetypes.find(
    (candidate) => candidate.id === selected.archetypeId,
  )

  return (
    <div className="atlas-view">
      <section className="model-index" aria-labelledby="students-title">
        <div className="section-intro compact-intro">
          <h1 id="students-title">Model students</h1>
          <p>
            Eight invented students, each carrying a different shape of evidence
            rather than a different amount of talent.
          </p>
        </div>

        <div className="model-list">
          {modelStudents.map((student) => {
            const theirArchetype = archetypes.find(
              (candidate) => candidate.id === student.archetypeId,
            )
            return (
              <button
                key={student.id}
                type="button"
                className="model-list-item"
                data-active={student.id === selected.id}
                onClick={() => setSelectedId(student.id)}
              >
                <span
                  className="model-monogram"
                  style={
                    {
                      '--model-color': theirArchetype?.color,
                      '--model-soft': theirArchetype?.softColor,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                >
                  {student.name.charAt(0)}
                </span>
                <span>
                  <strong>{student.name}</strong>
                  <small>{theirArchetype?.shortName}</small>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            )
          })}
        </div>

        <MethodNote>
          <strong>All eight are fictional.</strong>
          <p>
            Names, schools, and results are invented to illustrate the rubric. None
            of them describes a real student.
          </p>
        </MethodNote>
      </section>

      <article
        className="model-detail"
        style={
          {
            '--model-color': archetype?.color,
            '--model-soft': archetype?.softColor,
          } as CSSProperties
        }
      >
        <header className="model-header">
          <div className="model-title-row">
            <span className="detail-monogram" aria-hidden="true">
              {selected.name.charAt(0)}
            </span>
            <div>
              <div className="header-pills">
                <span className="evidence-pill" data-tone="caution">
                  Fictional
                </span>
                <span className="evidence-pill">{archetype?.shortName} pattern</span>
              </div>
              <h2>{selected.name}</h2>
              <p className="model-tagline">{selected.headline}</p>
            </div>
          </div>
          {archetype && (
            <button
              type="button"
              className="primary-button"
              onClick={() => onOpenArchetype(archetype.id)}
            >
              Open the archetype
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          )}
        </header>

        <div className="student-shape">
          <ShapeTally student={selected} />
          <p>{selected.shape}</p>
        </div>

        <p className="model-description">{selected.bio}</p>

        <section className="signal-ladder" aria-labelledby="student-record-title">
          <div className="subsection-heading">
            <h3 id="student-record-title">What is on the record</h3>
            <Info size={19} aria-hidden="true" />
          </div>
          <div className="signal-list student-record">
            {[...selected.signals]
              .sort((a, b) => a.tier - b.tier)
              .map((signal) => (
                <article key={signal.label} className="signal-row">
                  <div className="signal-tier-slot">
                    <TierBadge tier={signal.tier} />
                  </div>
                  <div>
                    <h4>{signal.label}</h4>
                    {signal.note && <small>{signal.note}</small>}
                  </div>
                  <span className="domain-tag">
                    {domainShortLabels[signal.domain]}
                  </span>
                </article>
              ))}
          </div>
        </section>
      </article>
    </div>
  )
}
