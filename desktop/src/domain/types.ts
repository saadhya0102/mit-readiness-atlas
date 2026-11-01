export const domainIds = [
  'olympiad',
  'research',
  'robotics',
  'debateQuiz',
  'athletics',
  'humanities',
  'arts',
  'builder',
  'serviceLeadership',
  'coursework',
] as const

export type DomainId = (typeof domainIds)[number]

export const domainLabels: Record<DomainId, string> = {
  olympiad: 'Olympiad & problem solving',
  research: 'Research & science fair',
  robotics: 'Robotics & engineering',
  debateQuiz: 'Debate, speech & quiz bowl',
  athletics: 'Athletics',
  humanities: 'Humanities & writing',
  arts: 'Arts & performance',
  builder: 'Building & entrepreneurship',
  serviceLeadership: 'Service & leadership',
  coursework: 'Academic foundation',
}

/* Compact forms for tags, where the full label does not fit. */
export const domainShortLabels: Record<DomainId, string> = {
  olympiad: 'Olympiad',
  research: 'Research',
  robotics: 'Robotics',
  debateQuiz: 'Debate',
  athletics: 'Athletics',
  humanities: 'Humanities',
  arts: 'Arts',
  builder: 'Builder',
  serviceLeadership: 'Service',
  coursework: 'Academics',
}

export type ArchetypeId =
  | 'olympiad'
  | 'research'
  | 'robotics'
  | 'debate'
  | 'athlete'
  | 'humanities'
  | 'arts'
  | 'builder'

export type SignalTier = 1 | 2 | 3 | 4

export const tierMeta: Record<
  SignalTier,
  {
    label: string
    shortLabel: string
    description: string
    // How rare the signal is, so a tier means something concrete without
    // implying an admission chance the research cannot support.
    calibration: string
  }
> = {
  1: {
    label: 'Exceptional signal',
    shortLabel: 'Exceptional',
    description:
      'Rare international, national-team, top-prize, or equivalent original-work distinction.',
    calibration:
      'A handful to a couple of dozen students per subject each year, selected through several rounds of national competition.',
  },
  2: {
    label: 'National distinction',
    shortLabel: 'National',
    description:
      'Selective national recognition, finalist status, or unusually strong independently validated work.',
    calibration:
      'Roughly twenty to a hundred students per subject each year, at a national stage such as a training camp or a top scoring band.',
  },
  3: {
    label: 'Strong signal',
    shortLabel: 'Strong',
    description:
      'Meaningful state, regional, or sustained high-level work with clear depth, ownership, or results.',
    calibration:
      'Several hundred to a thousand students per subject each year. Many students at highly selective universities land here in their strongest activity, and the surrounding context can push it up or down.',
  },
  4: {
    label: 'Developing signal',
    shortLabel: 'Developing',
    description:
      'Real participation or local achievement that shows a foundation but needs more depth or validation.',
    calibration:
      'Common, and still a real starting point. Added depth, ownership, or an outside result moves it up.',
  },
}

export type DimensionId =
  | 'depth'
  | 'validation'
  | 'ownership'
  | 'output'
  | 'impact'
  | 'collaboration'

export const dimensionLabels: Record<DimensionId, string> = {
  depth: 'Depth',
  validation: 'External validation',
  ownership: 'Ownership',
  output: 'Concrete output',
  impact: 'Use or impact',
  collaboration: 'Collaboration',
}

export interface EvidenceSource {
  id: string
  title: string
  publisher: string
  url: string
  kind: 'official-guidance' | 'official-program' | 'research-release' | 'method'
  verifies: string
  caveat?: string
  accessed: string
}

export interface SignalExample {
  id: string
  name: string
  domain: DomainId
  tier: SignalTier
  summary: string
  sourceIds: string[]
  context?: string
}

export interface TierGroup {
  tier: SignalTier
  interpretation: string
  examples: SignalExample[]
}

export interface QualityModifier {
  id: DimensionId | 'selectivity' | 'access'
  label: string
  question: string
  strong: string
  caution: string
}

export interface Archetype {
  id: ArchetypeId
  name: string
  shortName: string
  monogram: string
  tagline: string
  description: string
  signature: string
  color: string
  softColor: string
  primaryDomains: DomainId[]
  domainWeights: Partial<Record<DomainId, number>>
  dimensionWeights: Record<DimensionId, number>
  profileShape: Record<DimensionId, number>
  tierGroups: TierGroup[]
  modifiers: QualityModifier[]
  combinations: string[]
  nextMoves: string[]
  evidenceNote: string
  sourceIds: string[]
}

export type ActivityRole = 'participant' | 'contributor' | 'lead' | 'founder'
export type ValidationLevel =
  | 'none'
  | 'local'
  | 'regional'
  | 'state'
  | 'national'
  | 'international'
export type ImpactLevel = 'practice' | 'team' | 'school' | 'community' | 'broad'
export type EvidenceLevel =
  | 'self-reported'
  | 'documented'
  | 'independently-verified'

export interface StudentActivity {
  id: string
  title: string
  domain: DomainId
  tier: SignalTier
  years: number
  hoursPerWeek: number
  role: ActivityRole
  validation: ValidationLevel
  impact: ImpactLevel
  evidence: EvidenceLevel
  notes: string
}

export interface StudentProfile {
  version: 1
  activities: StudentActivity[]
  updatedAt: string
}

export type AlignmentBand = 'closest' | 'strong' | 'partial' | 'early'
export type DocumentationBand = 'substantial' | 'mixed' | 'limited'

export interface ArchetypeMatch {
  archetypeId: ArchetypeId
  score: number
  band: AlignmentBand
  documentation: DocumentationBand
  dimensionScores: Record<DimensionId, number>
  strengths: DimensionId[]
  gaps: DimensionId[]
  reasons: string[]
}
