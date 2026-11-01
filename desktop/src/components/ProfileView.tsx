import { useMemo, type CSSProperties } from 'react'
import {
  ArrowRight,
  ClipboardList,
  FlaskConical,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  dimensionLabels,
  type Archetype,
  type ArchetypeId,
  type ArchetypeMatch,
  type AlignmentBand,
  type DimensionId,
  type DocumentationBand,
  type StudentActivity,
  type StudentProfile,
} from '../domain/types'
import { describeAlignment, scoreAllArchetypes } from '../lib/scoring'
import { blankActivity, exampleProfile } from '../data/sampleProfile'
import { ActivityEditor } from './ActivityEditor'
import { DimensionMeter, EvidencePill, MethodNote } from './SignalUI'

interface ProfileViewProps {
  profile: StudentProfile
  archetypes: Archetype[]
  targetId?: ArchetypeId
  onChange: (profile: StudentProfile) => void
  onOpenModel: (id: ArchetypeId) => void
}

const documentationLabels: Record<DocumentationBand, string> = {
  substantial: 'Well documented',
  mixed: 'Partly documented',
  limited: 'Thinly documented',
}

function AlignmentTicks({ band }: { band: AlignmentBand }) {
  const filled: Record<AlignmentBand, number> = {
    early: 0,
    partial: 2,
    strong: 4,
    closest: 5,
  }
  return (
    <span
      className="alignment-ticks"
      aria-label={`${filled[band]} of 5 qualitative evidence-overlap steps`}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index} data-filled={index < filled[band]} />
      ))}
    </span>
  )
}

function MatchDetail({
  match,
  archetype,
  onOpen,
}: {
  match: ArchetypeMatch
  archetype: Archetype
  onOpen: () => void
}) {
  return (
    <article
      className="match-detail"
      style={
        {
          '--model-color': archetype.color,
          '--model-soft': archetype.softColor,
        } as CSSProperties
      }
    >
      <header>
        <span className="match-monogram" aria-hidden="true">
          {archetype.monogram}
        </span>
        <div>
          <p>{describeAlignment(match)}</p>
          <h3>{archetype.shortName}</h3>
        </div>
        <div className="match-signal">
          <AlignmentTicks band={match.band} />
          <EvidencePill
            tone={match.documentation === 'substantial' ? 'verified' : 'neutral'}
          >
            {documentationLabels[match.documentation]}
          </EvidencePill>
        </div>
      </header>

      <div className="match-reasons">
        {match.reasons.map((reason) => (
          <p key={reason}>{reason}</p>
        ))}
      </div>

      <div className="match-columns">
        <div>
          <strong>Strongest dimensions</strong>
          {match.strengths.length ? (
            <ul>
              {match.strengths.map((dimension) => (
                <li key={dimension}>{dimensionLabels[dimension]}</li>
              ))}
            </ul>
          ) : (
            <p>Add more context to show a strength.</p>
          )}
        </div>
        <div>
          <strong>Thinnest dimensions</strong>
          {match.gaps.length ? (
            <ul>
              {match.gaps.map((dimension) => (
                <li key={dimension}>{dimensionLabels[dimension]}</li>
              ))}
            </ul>
          ) : (
            <p>Nothing looks thin from what you have entered.</p>
          )}
        </div>
      </div>

      <div className="match-meters">
        {Object.entries(match.dimensionScores).map(([dimension, value]) => (
          <DimensionMeter
            key={dimension}
            dimension={dimension as DimensionId}
            value={value}
            compact
          />
        ))}
      </div>

      <button type="button" className="text-button" onClick={onOpen}>
        Open this model
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </article>
  )
}

export function ProfileView({
  profile,
  archetypes,
  targetId,
  onChange,
  onOpenModel,
}: ProfileViewProps) {
  const matches = useMemo(
    () => scoreAllArchetypes(archetypes, profile.activities),
    [archetypes, profile.activities],
  )
  const target = archetypes.find((archetype) => archetype.id === targetId)

  const updateActivities = (activities: StudentActivity[]) =>
    onChange({ version: 1, activities, updatedAt: new Date().toISOString() })

  const addActivity = () => updateActivities([...profile.activities, blankActivity()])
  const updateActivity = (index: number, activity: StudentActivity) =>
    updateActivities(
      profile.activities.map((current, currentIndex) =>
        currentIndex === index ? activity : current,
      ),
    )
  const deleteActivity = (index: number) =>
    updateActivities(profile.activities.filter((_, currentIndex) => currentIndex !== index))

  return (
    <div className="profile-view">
      <header className="page-heading">
        <div>
          <h1>My comparison</h1>
          <p>
            Describe each activity in enough detail to tell participation apart from
            depth, ownership, output, validation, and impact.
          </p>
        </div>
        {target && (
          <div className="target-lens">
            <span
              style={{ background: target.softColor, color: target.color }}
              aria-hidden="true"
            >
              {target.monogram}
            </span>
            <div>
              <small>Starting lens</small>
              <strong>{target.shortName}</strong>
            </div>
          </div>
        )}
      </header>

      <MethodNote>
        <strong>What counts here</strong>
        <p>
          An entry joins the comparison once it has a title and a note about what you did.
          The tier you pick is shown back to you but never raises the match.
        </p>
      </MethodNote>

      {profile.activities.length === 0 ? (
        <section className="profile-empty" aria-labelledby="empty-profile-title">
          <div className="empty-symbol" aria-hidden="true">
            <ClipboardList size={29} strokeWidth={1.6} />
          </div>
          <div>
            <h2 id="empty-profile-title">Start with one activity you know well</h2>
            <p>
              A useful entry says what you made or achieved, what you personally owned,
              and who validated or used it.
            </p>
            <div className="button-row">
              <button type="button" className="primary-button" onClick={addActivity}>
                <Plus size={17} aria-hidden="true" />
                Add my first activity
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  onChange({ ...exampleProfile, updatedAt: new Date().toISOString() })
                }
              >
                <FlaskConical size={17} aria-hidden="true" />
                Load a fictional example
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="profile-workspace">
          <section className="activity-column" aria-labelledby="activity-list-title">
            <div className="column-heading">
              <div>
                <h2 id="activity-list-title">
                  {profile.activities.length}{' '}
                  {profile.activities.length === 1 ? 'activity' : 'activities'}
                </h2>
              </div>
              <div className="button-row">
                <button type="button" className="secondary-button" onClick={addActivity}>
                  <Plus size={16} aria-hidden="true" />
                  Add activity
                </button>
                <button
                  type="button"
                  className="icon-text-button"
                  onClick={() => updateActivities([])}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Start over
                </button>
              </div>
            </div>

            <div className="activity-list">
              {profile.activities.map((activity, index) => (
                <ActivityEditor
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onChange={(next) => updateActivity(index, next)}
                  onDelete={() => deleteActivity(index)}
                />
              ))}
            </div>

            <div className="privacy-reminder">
              <ShieldAlert size={18} aria-hidden="true" />
              <p>
                <strong>Keep it anonymous.</strong> Do not enter names, contact details,
                application IDs, or private records.
              </p>
            </div>
          </section>

          <aside className="results-column" aria-labelledby="results-title">
            <div className="column-heading">
              <h2 id="results-title">Closest patterns</h2>
              <Sparkles size={19} aria-hidden="true" />
            </div>

            <div className="match-stack" aria-live="polite">
              {matches.slice(0, 3).map((match) => {
                const archetype = archetypes.find(
                  (candidate) => candidate.id === match.archetypeId,
                )
                if (!archetype) return null
                return (
                  <MatchDetail
                    key={match.archetypeId}
                    match={match}
                    archetype={archetype}
                    onOpen={() => onOpenModel(archetype.id)}
                  />
                )
              })}
            </div>

            <details className="full-ranking">
                <summary>See all eight patterns</summary>
                <ul>
                {matches.map((match) => {
                  const archetype = archetypes.find(
                    (candidate) => candidate.id === match.archetypeId,
                  )
                  return (
                    <li key={match.archetypeId}>
                      <span>{archetype?.shortName}</span>
                      <span>{describeAlignment(match)}</span>
                      <AlignmentTicks band={match.band} />
                    </li>
                  )
                })}
                </ul>
            </details>
          </aside>
        </div>
      )}
    </div>
  )
}
