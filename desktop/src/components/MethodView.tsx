import {
  ArrowRight,
  Braces,
  CheckCircle2,
  GitCompareArrows,
  Scale,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import {
  dimensionLabels,
  tierMeta,
  type DimensionId,
  type SignalTier,
} from '../domain/types'
import { MethodNote, TierBadge } from './SignalUI'
import { mitBaseline } from '../data/statistics'

const dimensions: Array<{
  id: DimensionId
  description: string
  question: string
}> = [
  {
    id: 'depth',
    description: 'Sustained craft and increasing technical or intellectual difficulty.',
    question: 'Did the work become harder and more sophisticated over time?',
  },
  {
    id: 'validation',
    description: 'Evaluation by a credible body outside the student’s immediate circle.',
    question: 'Who assessed the work, and how selective or independent was that process?',
  },
  {
    id: 'ownership',
    description: 'The student’s personal decisions, responsibility, and original contribution.',
    question: 'What would not have happened without this student?',
  },
  {
    id: 'output',
    description: 'A result that can be inspected: performance, paper, robot, code, or service.',
    question: 'What exists beyond a title or membership line?',
  },
  {
    id: 'impact',
    description: 'Real use, adoption, audience value, or a measurable result.',
    question: 'Who used or benefited from the work, and for how long?',
  },
  {
    id: 'collaboration',
    description: 'Reliable contribution, teaching, teamwork, and shared execution.',
    question: 'How did the student make other people or a team more effective?',
  },
]

export function MethodView({ onStart }: { onStart: () => void }) {
  return (
    <div className="method-view">
      <header className="page-heading method-heading">
        <div>
          <h1>How the comparison works</h1>
          <p>
            Observed research, our rubric, and your own self-report stay separate, so
            none of them passes for the others.
          </p>
        </div>
        <button type="button" className="primary-button" onClick={onStart}>
          Compare my activities
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </header>

      <section className="method-flow" aria-label="Comparison process">
        <div>
          <span aria-hidden="true">
            <Braces size={20} />
          </span>
          <strong>Describe evidence</strong>
          <p>Activity, role, duration, result, validation, and impact.</p>
        </div>
        <ArrowRight aria-hidden="true" />
        <div>
          <span aria-hidden="true">
            <Scale size={20} />
          </span>
          <strong>Apply context</strong>
          <p>Tier examples plus quality modifiers for the relevant domain.</p>
        </div>
        <ArrowRight aria-hidden="true" />
        <div>
          <span aria-hidden="true">
            <GitCompareArrows size={20} />
          </span>
          <strong>Compare shapes</strong>
          <p>Overlap in the relevant domains, scored across six dimensions.</p>
        </div>
      </section>

      <section className="method-section" aria-labelledby="tier-method-title">
        <div className="section-heading-row">
          <div>
            <h2 id="tier-method-title">What the four tiers describe</h2>
          </div>
          <p>
            A tier reports how strong and how rare the evidence is. Tier 1 does not mean
            automatic admission, and Tier 4 does not mean bad.
          </p>
        </div>
        <div className="tier-method-list">
          {([1, 2, 3, 4] as SignalTier[]).map((tier) => (
            <div key={tier}>
              <TierBadge tier={tier} />
              <strong>{tierMeta[tier].label}</strong>
              <p>{tierMeta[tier].description}</p>
              <small>{tierMeta[tier].calibration}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="method-section" aria-labelledby="dimensions-title">
        <div className="section-heading-row">
          <div>
            <h2 id="dimensions-title">A title alone is never enough</h2>
          </div>
          <p>
            A national label can still hide limited ownership. A local project can show
            real initiative and a finished result.
          </p>
        </div>
        <div className="dimension-method-list">
          {dimensions.map((dimension) => (
            <article key={dimension.id}>
              <h3>{dimensionLabels[dimension.id]}</h3>
              <p>{dimension.description}</p>
              <small>{dimension.question}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="method-section evidence-layers" aria-labelledby="layers-title">
        <div className="section-heading-row">
          <div>
            <h2 id="layers-title">Where each part comes from</h2>
          </div>
        </div>
        <div className="layer-list">
          <article>
            <CheckCircle2 size={20} aria-hidden="true" />
            <div>
              <h3>The research release</h3>
              <p>
                1,456 MIT profiles and 2,790 activity records gathered from public
                pages, with separate views that exclude athletics sources.
              </p>
            </div>
            <span>Observed</span>
          </article>
          <article>
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <h3>Program definitions</h3>
              <p>
                Organizer pages establish what a national team, finalist, qualifier, or
                championship award means in a given year.
              </p>
            </div>
            <span>Official</span>
          </article>
          <article>
            <Scale size={20} aria-hidden="true" />
            <div>
              <h3>The comparative rubric</h3>
              <p>
                Tier placements, pattern weights, and overlap bands are our judgments,
                and all of them are open to inspection. The tier you pick for your own
                activity never feeds the match.
              </p>
            </div>
            <span>Our judgment</span>
          </article>
        </div>
      </section>

      <MethodNote>
        <strong>Why there is no admissions percentage</strong>
        <p>
          MIT admitted {mitBaseline.admits.toLocaleString()} of{' '}
          {mitBaseline.applicants.toLocaleString()} applicants for the class of{' '}
          {mitBaseline.classYear}, a {Math.round(mitBaseline.admitRate * 1000) / 10}%
          rate. That describes a pool, not a profile. The research here documents
          activities of students who already enrolled and never tracks who applied and
          was rejected, so any figure attached to your own entries would be made up.
        </p>
      </MethodNote>

      <section className="limitations" aria-labelledby="limitations-title">
        <div className="limitations-icon" aria-hidden="true">
          <TriangleAlert size={22} />
        </div>
        <div>
          <h2 id="limitations-title">Known limitations</h2>
          <ul>
            <li>
              Public profiles only cover achievements that some organization wrote up, so
              unpublished work is missing entirely.
            </li>
            <li>
              MIT Athletics biographies are unusually detailed, so athletics is
              overrepresented. The non-athletics views reduce that skew without erasing it.
            </li>
            <li>
              Debate results, humanities work, and private research contributions are
              thinly covered.
            </li>
            <li>
              Access to coaching, labs, travel, equipment, and free time varies sharply.
              Opportunity is not ability.
            </li>
            <li>
              Your result moves as you add better context. It describes what you have
              written down at the time.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
