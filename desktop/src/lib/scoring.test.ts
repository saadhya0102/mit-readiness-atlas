import { describe, expect, it } from 'vitest'
import { archetypes } from '../data/archetypes'
import type { StudentActivity } from '../domain/types'
import { scoreAllArchetypes, scoreArchetype } from './scoring'

const activity = (
  overrides: Partial<StudentActivity> = {},
): StudentActivity => ({
  id: 'test-activity',
  title: 'Test activity',
  domain: 'olympiad',
  tier: 3,
  years: 2,
  hoursPerWeek: 6,
  role: 'contributor',
  validation: 'state',
  impact: 'team',
  evidence: 'documented',
  notes: 'A specific contribution with inspectable evidence.',
  ...overrides,
})

describe('archetype scoring', () => {
  it('keeps an empty profile limited and early-stage', () => {
    const matches = scoreAllArchetypes(archetypes, [])
    expect(matches).toHaveLength(8)
    expect(matches.every((match) => match.documentation === 'limited')).toBe(true)
    expect(matches.every((match) => match.band === 'early')).toBe(true)
    expect(matches.every((match) => match.score === 0)).toBe(true)
  })

  it('places a deeply documented olympiad result in the highest olympiad band', () => {
    const matches = scoreAllArchetypes(archetypes, [
      activity({
        years: 4,
        hoursPerWeek: 14,
        role: 'lead',
        validation: 'international',
        impact: 'community',
        evidence: 'independently-verified',
      }),
    ])

    expect(matches[0].archetypeId).toBe('olympiad')
    expect(matches[0].band).not.toBe('early')
  })

  it('does not score incomplete activity shells', () => {
    const research = archetypes.find((archetype) => archetype.id === 'research')!
    const match = scoreArchetype(research, [
      activity({
        title: 'Research assistant',
        domain: 'research',
        notes: '',
      }),
    ])

    expect(match.score).toBe(0)
    expect(match.band).toBe('early')
  })

  it('rewards documented context rather than an identical title', () => {
    const research = archetypes.find((archetype) => archetype.id === 'research')!
    const vague = scoreArchetype(research, [
      activity({
        title: 'Research assistant',
        domain: 'research',
        role: 'participant',
        validation: 'none',
        impact: 'practice',
        evidence: 'self-reported',
        notes: 'Helped with a project, but the exact contribution is not documented.',
      }),
    ])
    const owned = scoreArchetype(research, [
      activity({
        title: 'Research assistant',
        domain: 'research',
        role: 'founder',
        validation: 'national',
        impact: 'community',
        evidence: 'independently-verified',
        notes: 'Designed the method, released code, and defended the limitations.',
      }),
    ])

    expect(owned.score).toBeGreaterThan(vague.score + 10)
    expect(owned.dimensionScores.ownership).toBeGreaterThan(
      vague.dimensionScores.ownership,
    )
  })

  it('does not let a self-selected tier increase overlap', () => {
    const builder = archetypes.find((archetype) => archetype.id === 'builder')!
    const base = activity({
      domain: 'builder',
      tier: 4,
      notes: 'Built and tested a small tool with three recurring users.',
    })

    const developing = scoreArchetype(builder, [base])
    const exceptional = scoreArchetype(builder, [{ ...base, tier: 1 }])

    expect(exceptional.score).toBe(developing.score)
  })

  it('does not reward a founder title over equivalent lead behavior', () => {
    const builder = archetypes.find((archetype) => archetype.id === 'builder')!
    const base = activity({
      domain: 'builder',
      role: 'lead',
      notes: 'Owned the same product decisions, testing, release, and maintenance.',
    })

    const lead = scoreArchetype(builder, [base])
    const founder = scoreArchetype(builder, [{ ...base, role: 'founder' }])

    expect(founder.score).toBe(lead.score)
  })

  it('does not reward weak unrelated filler in the athlete pattern', () => {
    const athlete = archetypes.find((archetype) => archetype.id === 'athlete')!
    const sport = activity({
      domain: 'athletics',
      validation: 'state',
      impact: 'team',
      notes: 'Competed for three seasons with documented state-level results.',
    })
    const filler = ['arts', 'research', 'builder'].map((domain, index) =>
      activity({
        id: `filler-${index}`,
        domain: domain as StudentActivity['domain'],
        years: 0.25,
        hoursPerWeek: 1,
        role: 'participant',
        validation: 'none',
        impact: 'practice',
        evidence: 'self-reported',
        notes: 'Attended a few meetings without a completed result or defined role.',
      }),
    )

    expect(scoreArchetype(athlete, [sport, ...filler]).score).toBe(
      scoreArchetype(athlete, [sport]).score,
    )
  })

  it('caps ambitious self-reported and unvalidated entries below meaningful overlap', () => {
    const builder = archetypes.find((archetype) => archetype.id === 'builder')!
    const match = scoreArchetype(builder, [
      activity({
        domain: 'builder',
        tier: 1,
        role: 'founder',
        validation: 'none',
        impact: 'broad',
        evidence: 'self-reported',
        notes: 'Claims broad impact without independent records or user documentation.',
      }),
    ])

    expect(match.band).not.toBe('strong')
    expect(match.band).not.toBe('closest')
  })
})
