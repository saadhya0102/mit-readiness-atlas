import type { ArchetypeId, SignalTier } from '../domain/types'

/*
 * Every figure here is a count over a stated denominator from the local research
 * release, or a rate MIT publishes itself. To change a figure, edit the count
 * and denominator and the displayed share recomputes.
 *
 * These describe how common something is among MIT students. They do not
 * describe the chance of admission, which would need a sample of applicants and
 * their outcomes rather than a sample of enrolled students.
 */

export interface Measure {
  /** Omitted when a rate is published directly rather than counted here. */
  count?: number
  denominator?: number
  /** Set only for an externally published rate. */
  rate?: number
  /** Where the number comes from, shown to the reader so it stays checkable. */
  basis: string
  sourceIds: string[]
  caveat?: string
}

export function share(measure: Measure) {
  if (measure.rate !== undefined) return measure.rate
  if (!measure.count || !measure.denominator) return 0
  return measure.count / measure.denominator
}

export function formatShare(measure: Measure) {
  const percent = share(measure) * 100
  return `${percent < 10 ? percent.toFixed(1) : Math.round(percent)}%`
}

const allProfiles = 1456
/**
 * Athletics biographies are unusually complete, which inflates every other
 * category's share when measured across the whole sample. Rates are therefore
 * estimated from the profiles that were not sourced from athletics pages.
 */
const nonAthleticsProfiles = 850

/** MIT's own published figures, for context the local sample cannot provide. */
export const mitBaseline = {
  classYear: 2029,
  applicants: 29281,
  admits: 1334,
  admitRate: 0.046,
  enrolled: 1155,
  teamParticipation: 0.25,
  sourceIds: ['mit-admission-stats', 'mit-facts'],
}

const sampled = (count: number, caveat?: string): Measure => ({
  count,
  denominator: nonAthleticsProfiles,
  basis: `Estimated from ${count} of ${nonAthleticsProfiles} sampled profiles that were not sourced from athletics pages, out of ${allProfiles.toLocaleString()} in the release.`,
  sourceIds: ['research-no-sports', 'research-summary'],
  caveat,
})

/**
 * How often each pattern's core domain appears in a student's documented record.
 * Multi-label: one student can count toward several domains.
 */
export const archetypePrevalence: Record<ArchetypeId, Measure> = {
  olympiad: sampled(199),
  research: sampled(117),
  robotics: sampled(52),
  debate: sampled(
    31,
    'Debate coverage in the local sample is thin, so the real share is probably higher.',
  ),
  athlete: {
    rate: 0.25,
    basis: 'MIT publishes this figure directly.',
    sourceIds: ['mit-facts'],
    caveat:
      'The local sample shows 40% because athletics biographies are unusually complete, so the published figure is the one to trust.',
  },
  humanities: sampled(
    24,
    'Writing and humanities work is rarely written up publicly, so the real share is probably higher.',
  ),
  arts: sampled(55),
  builder: sampled(
    11,
    'Independent building is rarely written up by an organization, so the real share is probably higher.',
  ),
}

/**
 * The highest level any of a student's documented activities reached. Mutually
 * exclusive and complete: the four bands plus 181 profiles whose level could not
 * be coded account for all 1,456.
 */
export const tierObservedLevel: Record<
  SignalTier,
  Measure & { levelLabel: string }
> = {
  1: {
    levelLabel: 'peak at an international result',
    count: 211,
    denominator: allProfiles,
    basis: 'documented profiles',
    sourceIds: ['research-summary'],
  },
  2: {
    levelLabel: 'peak at a national result',
    count: 491,
    denominator: allProfiles,
    basis: 'documented profiles',
    sourceIds: ['research-summary'],
  },
  3: {
    levelLabel: 'peak at a state or regional result',
    count: 315,
    denominator: allProfiles,
    basis: 'documented profiles',
    sourceIds: ['research-summary'],
  },
  4: {
    levelLabel: 'peak at a school-level result',
    count: 258,
    denominator: allProfiles,
    basis: 'documented profiles',
    sourceIds: ['research-summary'],
  },
}

/**
 * Which subjects the olympiad signals come from. Keyword-derived and
 * multi-label, so treat the ordering as reliable and the counts as approximate.
 */
export const olympiadSubjects: Array<{ label: string; count: number }> = [
  { label: 'Mathematics', count: 131 },
  { label: 'Science Olympiad', count: 65 },
  { label: 'Computing', count: 59 },
  { label: 'Chemistry', count: 31 },
  { label: 'Physics', count: 31 },
  { label: 'Biology', count: 26 },
  { label: 'Astronomy', count: 10 },
]
