import type { ArchetypeId, DomainId, SignalTier } from '../domain/types'

/*
 * Eight invented students, one per archetype, each built to show a different
 * shape of evidence rather than a different level of talent. Names, schools, and
 * results are fictional. Nothing here is drawn from the research release, which
 * describes real people and is never surfaced as an example profile.
 *
 * The names are deliberately plain placeholders. A distinctive name reads as a
 * specific person, which is the opposite of what these profiles are for. Keep
 * first initials distinct, since the list renders one as a monogram.
 *
 * Tiers match the rubric in the archetype files. When an achievement sits
 * outside a published ladder, the entry says so instead of guessing.
 */

export interface StudentSignal {
  label: string
  tier: SignalTier
  domain: DomainId
  note?: string
}

export interface ModelStudent {
  id: string
  name: string
  /** One line on who they are, before any results. */
  headline: string
  archetypeId: ArchetypeId
  /** The characterization a counselor should take away. */
  shape: string
  bio: string
  signals: StudentSignal[]
}

export const modelStudents: ModelStudent[] = [
  {
    id: 'olympiad-competitive-programmer',
    name: 'John Smith',
    headline: 'Competitive programmer with one subject and no hedging',
    archetypeId: 'olympiad',
    shape: 'A national spike with genuine depth underneath it, all in one subject.',
    bio: 'Started in Bronze in ninth grade and moved up a division every season. Spends most of his practice time on graph problems and writes editorials for the contests he competes in. Applied without a second area and without leadership titles.',
    signals: [
      {
        label: 'USACO training-camp finalist',
        tier: 2,
        domain: 'olympiad',
        note: 'Roughly two dozen finalists nationally in a season.',
      },
      {
        label: 'Platinum certified in two consecutive seasons',
        tier: 3,
        domain: 'olympiad',
      },
      {
        label: 'Division placement at an online informatics invitational',
        tier: 4,
        domain: 'olympiad',
        note: 'Invitationals sit outside the official selection ladder, so this supports the record rather than anchoring it.',
      },
      {
        label: 'Hackathon win, with the tool later used by a school club',
        tier: 4,
        domain: 'builder',
      },
    ],
  },
  {
    id: 'debate-mock-trial-champion',
    name: 'Bob Stewart',
    headline: 'National mock trial champion with nothing beneath the title',
    archetypeId: 'debate',
    shape: 'A single national title and no supporting record. The spike is real and the depth is missing.',
    bio: 'Lead attorney on a team that won a national mock trial championship in his senior year. Competed three seasons on the varsity squad without advancing far in any circuit event, and did not compete outside his state after that season.',
    signals: [
      {
        label: 'National mock trial championship, winning team, lead attorney',
        tier: 2,
        domain: 'debateQuiz',
        note: 'Mock trial runs outside the NSDA and TOC ladders, so this is placed by manual comparison rather than a published stage.',
      },
      {
        label: 'State qualifier in Lincoln-Douglas',
        tier: 4,
        domain: 'debateQuiz',
      },
      {
        label: 'Varsity competitor and captain across three seasons',
        tier: 4,
        domain: 'debateQuiz',
      },
    ],
  },
  {
    id: 'research-isef-top-award',
    name: 'Mary Johnson',
    headline: 'One of the rarest results in the atlas, and little else written down',
    archetypeId: 'research',
    shape: 'A single tier 1 result with almost nothing documented around it.',
    bio: 'Built a low-cost assay for detecting a water contaminant, worked on it across two years in a school lab and a borrowed university bench, and took a named Top Award at an international fair. Holds no other competitive result and led no organization.',
    signals: [
      {
        label: 'Named ISEF Top Award',
        tier: 1,
        domain: 'research',
        note: 'Selected from category first-place winners, so a small number worldwide each year.',
      },
      {
        label: 'Local fair project with complete method and results',
        tier: 4,
        domain: 'research',
      },
      {
        label: 'Course research extended well past the assignment',
        tier: 4,
        domain: 'research',
      },
    ],
  },
  {
    id: 'robotics-two-national-signals',
    name: 'David Miller',
    headline: 'Two independent national signals that reinforce each other',
    archetypeId: 'robotics',
    shape: 'Two tier 2 results, one individual and one team, each verifiable on its own.',
    bio: 'Owned the swerve drivetrain on a team that reached the world championship, and drove during elimination matches. Recognized individually for leadership in the same period, which is unusual because the two awards are judged on different things.',
    signals: [
      {
        label: 'FIRST Leadership Award Finalist',
        tier: 2,
        domain: 'robotics',
        note: 'An individual recognition, formerly the Dean\u2019s List.',
      },
      {
        label: 'Championship team member owning the drivetrain and driving eliminations',
        tier: 2,
        domain: 'robotics',
        note: 'Championship qualification is a team result, so the subsystem ownership is what makes it individual evidence.',
      },
      {
        label: 'District Excellence in Engineering award',
        tier: 3,
        domain: 'robotics',
      },
      {
        label: 'Mentored two rookie teams through their first build season',
        tier: 4,
        domain: 'serviceLeadership',
      },
    ],
  },
  {
    id: 'athlete-breadth-no-spike',
    name: 'Sarah Brown',
    headline: 'Consistent state-level results and a real second area',
    archetypeId: 'athlete',
    shape: 'Three tier 3 results and no national spike, with a second area that is genuinely developed.',
    bio: 'Ran the 800m to all-state in two seasons and captained a squad that improved every year she led it. Spent two summers on a sports-science project measuring recovery in distance runners, which she wrote up but never entered into a fair.',
    signals: [
      {
        label: 'All-state in the 800m across two seasons',
        tier: 3,
        domain: 'athletics',
      },
      {
        label: 'Captain with documented team improvement',
        tier: 3,
        domain: 'athletics',
      },
      {
        label: 'State-level sport alongside a sustained independent study',
        tier: 3,
        domain: 'athletics',
      },
      {
        label: 'Mentored lab work with a specific verified contribution',
        tier: 4,
        domain: 'research',
      },
    ],
  },
  {
    id: 'humanities-consistent-mid-tier',
    name: 'Tom Wilson',
    headline: 'Three tier 3 results and nothing above them',
    archetypeId: 'humanities',
    shape: 'Repeated tier 3 recognition across writing and editing, with no national medal.',
    bio: 'Writes criticism and long-form reporting. Took a national Silver Medal for a critical essay, placed work in a literary magazine that rejects most of what it reads, and ran a school paper that roughly doubled its output while he edited it.',
    signals: [
      {
        label: 'Scholastic national Silver Medal in critical essay',
        tier: 3,
        domain: 'humanities',
      },
      {
        label: 'Selective publication with substantive editorial review',
        tier: 3,
        domain: 'humanities',
      },
      {
        label: 'Editor of a demonstrably stronger publication',
        tier: 3,
        domain: 'humanities',
      },
      {
        label: 'Regional Scholastic Gold Key',
        tier: 4,
        domain: 'humanities',
      },
    ],
  },
  {
    id: 'arts-national-plus-record',
    name: 'Anna Clark',
    headline: 'National recognition sitting on a long performance record',
    archetypeId: 'arts',
    shape: 'One tier 2 award with a sustained tier 3 performance record beneath it.',
    bio: 'Classical voice. Recognized nationally after a multi-round panel review, held a principal chair at all-state, and was selected for a regional festival that auditions widely. Has sung in the same community ensemble since ninth grade.',
    signals: [
      {
        label: 'YoungArts Award With Distinction in classical voice',
        tier: 2,
        domain: 'arts',
      },
      {
        label: 'All-state principal chair',
        tier: 3,
        domain: 'arts',
      },
      {
        label: 'Selected for a juried regional festival',
        tier: 3,
        domain: 'arts',
      },
      {
        label: 'Multi-year ensemble contributor with real responsibility',
        tier: 4,
        domain: 'arts',
      },
    ],
  },
  {
    id: 'builder-adoption-without-awards',
    name: 'Kevin Davis',
    headline: 'No award of any kind, and software other people depend on',
    archetypeId: 'builder',
    shape: 'Entirely tier 3 and below, carried by verifiable outside use rather than any prize.',
    bio: 'Wrote a scheduling tool for student-run tutoring after his own school\u2019s system kept double-booking rooms. Four schools now run it, and he maintains it during term. Entered no competitions, so every signal here rests on adoption a reader can check.',
    signals: [
      {
        label: 'Product with a stable base of recurring users across four schools',
        tier: 3,
        domain: 'builder',
        note: 'Adoption is the evidence here, so the user count and the maintenance history carry the claim.',
      },
      {
        label: 'Open-source library adopted by other student teams',
        tier: 3,
        domain: 'builder',
      },
      {
        label: 'Working prototype tested with real users before release',
        tier: 4,
        domain: 'builder',
      },
    ],
  },
]

/** Counts by tier, used so the displayed shape cannot drift from the signals. */
export function tierTally(student: ModelStudent) {
  return ([1, 2, 3, 4] as SignalTier[]).map((tier) => ({
    tier,
    count: student.signals.filter((signal) => signal.tier === tier).length,
  }))
}
