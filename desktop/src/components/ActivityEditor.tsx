import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  domainIds,
  domainLabels,
  tierMeta,
  type StudentActivity,
} from '../domain/types'
import { TierBadge } from './SignalUI'

interface ActivityEditorProps {
  activity: StudentActivity
  index: number
  onChange: (activity: StudentActivity) => void
  onDelete: () => void
}

export function ActivityEditor({
  activity,
  index,
  onChange,
  onDelete,
}: ActivityEditorProps) {
  const [isOpen, setIsOpen] = useState(index === 0 || !activity.title)
  const update = <Key extends keyof StudentActivity>(
    key: Key,
    value: StudentActivity[Key],
  ) => onChange({ ...activity, [key]: value })

  return (
    <details
      className="activity-editor"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        <span className="activity-number">{index + 1}</span>
        <span className="activity-summary-copy">
          <strong>{activity.title || 'Describe this activity'}</strong>
          <small>{domainLabels[activity.domain]}</small>
        </span>
        <TierBadge tier={activity.tier} />
      </summary>

      <div className="activity-fields">
        <label className="field field-wide">
          <span>Activity or achievement</span>
          <input
            value={activity.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="Example: FTC mechanical lead and drive-team contributor"
          />
          <small>Use a role and result, not just an organization name.</small>
        </label>

        <label className="field">
          <span>Domain</span>
          <select
            value={activity.domain}
            onChange={(event) =>
              update('domain', event.target.value as StudentActivity['domain'])
            }
          >
            {domainIds.map((domain) => (
              <option key={domain} value={domain}>
                {domainLabels[domain]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Best-fit signal tier</span>
          <select
            value={activity.tier}
            onChange={(event) =>
              update('tier', Number(event.target.value) as StudentActivity['tier'])
            }
          >
            {([1, 2, 3, 4] as const).map((tier) => (
              <option key={tier} value={tier}>
                Tier {tier} · {tierMeta[tier].shortLabel}
              </option>
            ))}
          </select>
          <small>
            Compare against the model students to pick one. Your choice is never added to
            the match.
          </small>
        </label>

        <label className="field">
          <span>Years sustained</span>
          <input
            type="number"
            min={0.25}
            max={8}
            step={0.25}
            value={activity.years}
            onChange={(event) => update('years', Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Typical hours per week</span>
          <input
            type="number"
            min={1}
            max={80}
            value={activity.hoursPerWeek}
            onChange={(event) => update('hoursPerWeek', Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Your role</span>
          <select
            value={activity.role}
            onChange={(event) =>
              update('role', event.target.value as StudentActivity['role'])
            }
          >
            <option value="participant">Participant</option>
            <option value="contributor">Substantive contributor</option>
            <option value="lead">Lead or captain</option>
            <option value="founder">Originator or founder</option>
          </select>
          <small>
            Lead and founder score the same, so pick whichever describes you.
          </small>
        </label>

        <label className="field">
          <span>External validation</span>
          <select
            value={activity.validation}
            onChange={(event) =>
              update(
                'validation',
                event.target.value as StudentActivity['validation'],
              )
            }
          >
            <option value="none">No external result yet</option>
            <option value="local">School or local</option>
            <option value="regional">Regional</option>
            <option value="state">State</option>
            <option value="national">National</option>
            <option value="international">International</option>
          </select>
        </label>

        <label className="field">
          <span>Reach or impact</span>
          <select
            value={activity.impact}
            onChange={(event) =>
              update('impact', event.target.value as StudentActivity['impact'])
            }
          >
            <option value="practice">Personal practice or prototype</option>
            <option value="team">Team or small group</option>
            <option value="school">School or organization</option>
            <option value="community">Community or recurring users</option>
            <option value="broad">Broad adoption or field-level reach</option>
          </select>
        </label>

        <label className="field">
          <span>Evidence quality</span>
          <select
            value={activity.evidence}
            onChange={(event) =>
              update('evidence', event.target.value as StudentActivity['evidence'])
            }
          >
            <option value="self-reported">Self-reported</option>
            <option value="documented">Documented output or result</option>
            <option value="independently-verified">Independently verified</option>
          </select>
        </label>

        <label className="field field-wide">
          <span>What did you personally do?</span>
          <textarea
            rows={3}
            value={activity.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Describe ownership, output, results, collaborators, and constraints."
          />
          <small>Avoid names, contact details, or private information.</small>
        </label>

        <div className="activity-actions field-wide">
          <button type="button" className="danger-text-button" onClick={onDelete}>
            <Trash2 size={16} aria-hidden="true" />
            Delete activity
          </button>
        </div>
      </div>
    </details>
  )
}
