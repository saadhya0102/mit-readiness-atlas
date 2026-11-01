import {
  dimensionLabels,
  domainLabels,
  type Archetype,
  type ArchetypeMatch,
  type DimensionId,
  type DocumentationBand,
  type StudentActivity,
} from '../domain/types'

const dimensions: DimensionId[] = [
  'depth',
  'validation',
  'ownership',
  'output',
  'impact',
  'collaboration',
]

// These values organize a qualitative reflection. They are not learned from
// admission outcomes and are deliberately not exposed as precise probabilities.
const roleValue = {
  participant: 0.28,
  contributor: 0.58,
  lead: 0.8,
  founder: 0.8,
} as const
const validationValue = {
  none: 0.08,
  local: 0.28,
  regional: 0.46,
  state: 0.62,
  national: 0.8,
  international: 0.94,
} as const
const impactValue = {
  practice: 0.18,
  team: 0.38,
  school: 0.54,
  community: 0.72,
  broad: 0.88,
} as const
const evidenceValue = {
  'self-reported': 0.42,
  documented: 0.72,
  'independently-verified': 0.92,
} as const

const collaborativeDomains = new Set([
  'robotics',
  'debateQuiz',
  'athletics',
  'arts',
  'serviceLeadership',
])

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function isComplete(activity: StudentActivity) {
  return activity.title.trim().length >= 3 && activity.notes.trim().length >= 20
}

function activityDimensions(activity: StudentActivity): Record<DimensionId, number> {
  const years = Number.isFinite(activity.years) ? activity.years : 0
  const hours = Number.isFinite(activity.hoursPerWeek) ? activity.hoursPerWeek : 0
  const duration = clamp(0.12 + years * 0.2)
  const intensity = clamp(Math.log2(Math.max(hours, 0) + 1) / 4.5)
  const role = roleValue[activity.role]
  const validation = validationValue[activity.validation]
  const impact = impactValue[activity.impact]
  const evidence = evidenceValue[activity.evidence]
  const teamBase = collaborativeDomains.has(activity.domain) ? 0.56 : 0.36

  const raw: Record<DimensionId, number> = {
    depth: 100 * (duration * 0.58 + intensity * 0.27 + evidence * 0.15),
    validation: 100 * (validation * 0.76 + evidence * 0.24),
    ownership: 100 * (role * 0.72 + evidence * 0.28),
    output:
      100 *
      (evidence * 0.45 + role * 0.2 + duration * 0.18 + impact * 0.17),
    impact: 100 * (impact * 0.76 + evidence * 0.24),
    collaboration: 100 * clamp(teamBase + role * 0.22 + duration * 0.08),
  }

  // A self-report can create a useful reflection, but it cannot produce a
  // high-strength result by selecting ambitious labels alone.
  const cap =
    activity.evidence === 'self-reported'
      ? activity.validation === 'none'
        ? 52
        : 62
      : 100

  return Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      Math.min(cap, Math.round(raw[dimension])),
    ]),
  ) as Record<DimensionId, number>
}

function activityStrength(activity: StudentActivity) {
  if (!isComplete(activity)) return 0
  const scores = activityDimensions(activity)
  return (
    scores.depth * 0.2 +
    scores.validation * 0.2 +
    scores.ownership * 0.17 +
    scores.output * 0.17 +
    scores.impact * 0.16 +
    scores.collaboration * 0.1
  )
}

function relevantActivities(
  archetype: Archetype,
  activities: StudentActivity[],
) {
  const complete = activities.filter(
    (activity) =>
      isComplete(activity) && (archetype.domainWeights[activity.domain] ?? 0) > 0,
  )

  if (archetype.id !== 'athlete') return complete

  const athletic = complete.filter((activity) => activity.domain === 'athletics')
  const secondPillar = complete
    .filter((activity) => activity.domain !== 'athletics')
    .map((activity) => ({ activity, strength: activityStrength(activity) }))
    .filter(({ strength }) => strength >= 52)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 1)
    .map(({ activity }) => activity)

  return [...athletic, ...secondPillar]
}

function aggregateDimensions(
  archetype: Archetype,
  activities: StudentActivity[],
): Record<DimensionId, number> {
  const relevant = relevantActivities(archetype, activities)
  const maxDomainWeight = Math.max(
    ...Object.values(archetype.domainWeights).map((weight) => weight ?? 0),
    0.01,
  )

  return Object.fromEntries(
    dimensions.map((dimension) => {
      const values = relevant
        .map((activity) => {
          const relevance =
            (archetype.domainWeights[activity.domain] ?? 0) / maxDomainWeight
          return activityDimensions(activity)[dimension] * (0.6 + relevance * 0.4)
        })
        .sort((a, b) => b - a)
      const aggregate = (values[0] ?? 0) + (values[1] ?? 0) * 0.16
      return [dimension, Math.min(100, Math.round(aggregate))]
    }),
  ) as Record<DimensionId, number>
}

function domainAlignment(archetype: Archetype, activities: StudentActivity[]) {
  const relevant = relevantActivities(archetype, activities)

  if (archetype.id === 'athlete') {
    const athletic = relevant
      .filter((activity) => activity.domain === 'athletics')
      .map(activityStrength)
      .sort((a, b) => b - a)[0] ?? 0
    const secondPillar = relevant
      .filter((activity) => activity.domain !== 'athletics')
      .map(activityStrength)
      .sort((a, b) => b - a)[0] ?? 0
    return athletic * 0.72 + secondPillar * 0.28
  }

  const weighted = Object.entries(archetype.domainWeights)
  const totalWeight = weighted.reduce((sum, [, weight]) => sum + (weight ?? 0), 0)
  if (totalWeight === 0) return 0

  const earned = weighted.reduce((sum, [domain, weight]) => {
    const scores = relevant
      .filter((activity) => activity.domain === domain)
      .map(activityStrength)
      .sort((a, b) => b - a)
    const domainScore = Math.min(100, (scores[0] ?? 0) + (scores[1] ?? 0) * 0.16)
    return sum + domainScore * (weight ?? 0)
  }, 0)

  return earned / totalWeight
}

function dimensionAlignment(
  archetype: Archetype,
  actual: Record<DimensionId, number>,
) {
  const totalWeight = dimensions.reduce(
    (sum, dimension) => sum + archetype.dimensionWeights[dimension],
    0,
  )

  return (
    dimensions.reduce((sum, dimension) => {
      const target = archetype.profileShape[dimension]
      const usefulCeiling = Math.max(target, 72)
      const coverage = Math.min(actual[dimension] / usefulCeiling, 1)
      return sum + coverage * 100 * archetype.dimensionWeights[dimension]
    }, 0) / totalWeight
  )
}

function documentationFor(
  archetype: Archetype,
  activities: StudentActivity[],
): DocumentationBand {
  const relevant = relevantActivities(archetype, activities)
  if (!relevant.length) return 'limited'

  const documented = relevant.filter(
    (activity) => activity.evidence !== 'self-reported',
  ).length
  const externallyValidated = relevant.some(
    (activity) => validationValue[activity.validation] >= 0.62,
  )

  if (documented >= 2 && externallyValidated) return 'substantial'
  if (documented >= 1 || externallyValidated) return 'mixed'
  return 'limited'
}

function reasonsFor(archetype: Archetype, activities: StudentActivity[]) {
  const relevant = relevantActivities(archetype, activities)
  const matchingDomains = Object.entries(archetype.domainWeights)
    .map(([domain, weight]) => {
      const best = relevant
        .filter((activity) => activity.domain === domain)
        .map(activityStrength)
        .sort((a, b) => b - a)[0]
      return { domain, contribution: (best ?? 0) * (weight ?? 0) }
    })
    .filter(({ contribution }) => contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 2)

  if (matchingDomains.length === 0) {
    return ['Nothing you have entered maps to this pattern yet.']
  }

  const [first, second] = matchingDomains.map(
    ({ domain }) => domainLabels[domain as keyof typeof domainLabels],
  )

  return [
    second
      ? `Mostly your ${first} work, with some ${second}.`
      : `Mostly your ${first} work.`,
  ]
}

export function scoreArchetype(
  archetype: Archetype,
  activities: StudentActivity[],
): ArchetypeMatch {
  const relevant = relevantActivities(archetype, activities)
  const dimensionScores = aggregateDimensions(archetype, activities)
  const domainScore = domainAlignment(archetype, activities)
  const dimensionScore = dimensionAlignment(archetype, dimensionScores)
  const score =
    relevant.length === 0
      ? 0
      : Math.round(Math.min(100, domainScore * 0.68 + dimensionScore * 0.32))

  const band =
    score >= 72 ? 'closest' : score >= 56 ? 'strong' : score >= 36 ? 'partial' : 'early'
  const rankedDimensions = [...dimensions].sort(
    (a, b) => dimensionScores[b] - dimensionScores[a],
  )
  const strengths = rankedDimensions
    .filter((dimension) => dimensionScores[dimension] >= 58)
    .slice(0, 2)
  const gaps = [...dimensions]
    .sort((a, b) => {
      const aGap = archetype.profileShape[a] - dimensionScores[a]
      const bGap = archetype.profileShape[b] - dimensionScores[b]
      return bGap - aGap
    })
    .filter(
      (dimension) => archetype.profileShape[dimension] - dimensionScores[dimension] > 18,
    )
    .slice(0, 2)

  return {
    archetypeId: archetype.id,
    score,
    band,
    documentation: documentationFor(archetype, activities),
    dimensionScores,
    strengths,
    gaps,
    reasons: [
      ...reasonsFor(archetype, activities),
      ...(strengths.length
        ? [`${dimensionLabels[strengths[0]]} is your strongest dimension here.`]
        : []),
    ],
  }
}

export function scoreAllArchetypes(
  archetypes: Archetype[],
  activities: StudentActivity[],
) {
  const bandRank: Record<ArchetypeMatch['band'], number> = {
    closest: 3,
    strong: 2,
    partial: 1,
    early: 0,
  }

  return archetypes
    .map((archetype, index) => ({
      match: scoreArchetype(archetype, activities),
      index,
    }))
    .sort(
      (a, b) =>
        bandRank[b.match.band] - bandRank[a.match.band] || a.index - b.index,
    )
    .map(({ match }) => match)
}

export function describeAlignment(match: ArchetypeMatch) {
  const labels = {
    closest: 'Closest match',
    strong: 'Strong overlap',
    partial: 'Some overlap',
    early: 'Little overlap so far',
  } as const
  return labels[match.band]
}
