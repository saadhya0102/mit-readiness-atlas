import type { StudentActivity, StudentProfile } from '../domain/types'

export const blankActivity = (): StudentActivity => ({
  id: crypto.randomUUID(),
  title: '',
  domain: 'olympiad',
  tier: 4,
  years: 1,
  hoursPerWeek: 3,
  role: 'participant',
  validation: 'local',
  impact: 'practice',
  evidence: 'self-reported',
  notes: '',
})

export const exampleProfile: StudentProfile = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  activities: [
    {
      id: 'sample-robotics',
      title: 'FTC mechanical lead and drive-team contributor',
      domain: 'robotics',
      tier: 3,
      years: 3,
      hoursPerWeek: 8,
      role: 'lead',
      validation: 'state',
      impact: 'team',
      evidence: 'documented',
      notes:
        'Owned the intake redesign, kept an engineering notebook, and mentored two new builders.',
    },
    {
      id: 'sample-research',
      title: 'Independent water-quality sensor study',
      domain: 'research',
      tier: 3,
      years: 2,
      hoursPerWeek: 5,
      role: 'founder',
      validation: 'regional',
      impact: 'community',
      evidence: 'documented',
      notes:
        'Designed the protocol, published code and calibration data, and presented results to a watershed group.',
    },
    {
      id: 'sample-service',
      title: 'Neighborhood repair workshops',
      domain: 'serviceLeadership',
      tier: 3,
      years: 2,
      hoursPerWeek: 3,
      role: 'founder',
      validation: 'local',
      impact: 'community',
      evidence: 'documented',
      notes:
        'Ran monthly repair sessions with a library partner and tracked repeat attendance.',
    },
  ],
}
