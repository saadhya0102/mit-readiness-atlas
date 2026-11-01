import type {
  DomainId,
  QualityModifier,
  SignalExample,
  SignalTier,
} from '../domain/types'

export function signal(
  id: string,
  name: string,
  domain: DomainId,
  tier: SignalTier,
  summary: string,
  sourceIds: string[],
  context?: string,
): SignalExample {
  return { id, name, domain, tier, summary, sourceIds, context }
}

export const ownershipModifier: QualityModifier = {
  id: 'ownership',
  label: 'Personal ownership',
  question: 'What did the student decide, design, prove, write, build, or lead?',
  strong:
    'The contribution is specific, difficult to replace, and supported by artifacts or collaborator testimony.',
  caution:
    'Membership, lab affiliation, team prestige, or a title is doing most of the work in the description.',
}

export const validationModifier: QualityModifier = {
  id: 'validation',
  label: 'Independent validation',
  question: 'Who evaluated the work, using what process?',
  strong:
    'A credible external body used transparent criteria, meaningful competition, review, or real-world adoption.',
  caution:
    'The recognition is pay-to-enter, internally awarded, loosely selective, or impossible to distinguish from participation.',
}

export const depthModifier: QualityModifier = {
  id: 'depth',
  label: 'Sustained depth',
  question: 'Did the work compound over time?',
  strong:
    'Several years of increasing difficulty, iteration, and responsibility show a visible development arc.',
  caution:
    'A short burst, one-off event, or late title has no evidence of practice, growth, or harder follow-through.',
}

export const outputModifier: QualityModifier = {
  id: 'output',
  label: 'Inspectable output',
  question: 'What can another person inspect, test, read, watch, or use?',
  strong:
    'The work produced a paper, proof, performance, robot, codebase, publication, dataset, or repeatable service.',
  caution:
    'The description names effort or attendance but no artifact, result, performance, or completed responsibility.',
}

export const impactModifier: QualityModifier = {
  id: 'impact',
  label: 'Use and impact',
  question: 'Who used or benefited from the work, and did the effect persist?',
  strong:
    'Adoption, audience, outcomes, or recurring use are measured with an honest denominator and timeframe.',
  caution:
    'Large reach claims rely on impressions, one-time attendance, vague beneficiaries, or numbers without a baseline.',
}

export const collaborationModifier: QualityModifier = {
  id: 'collaboration',
  label: 'Team contribution',
  question: 'How did the student make collaborators more capable?',
  strong:
    'The student owned a clear role, communicated tradeoffs, taught others, and improved shared execution.',
  caution:
    'A team result is attributed to the individual without separating personal work from the group’s achievement.',
}

export const selectivityModifier: QualityModifier = {
  id: 'selectivity',
  label: 'Selection context',
  question: 'What did it take to qualify or be chosen?',
  strong:
    'The pathway, eligible pool, rounds, and selection criteria are known and independently published.',
  caution:
    'Prestigious branding substitutes for the actual acceptance, qualification, or judging process.',
}

export const accessModifier: QualityModifier = {
  id: 'access',
  label: 'Opportunity context',
  question: 'What resources, constraints, and obligations shaped the work?',
  strong:
    'The comparison credits resourcefulness, family or work responsibilities, and what the student did with available options.',
  caution:
    'The rubric treats expensive coaching, travel, lab access, equipment, or free time as if they were raw ability.',
}
