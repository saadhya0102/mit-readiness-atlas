import type { EvidenceSource } from '../domain/types'

const accessed = '2026-07-25'

export const sources: EvidenceSource[] = [
  {
    id: 'mit-what-we-look-for',
    title: 'What we look for',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/apply/process/what-we-look-for/',
    kind: 'official-guidance',
    verifies:
      'MIT describes holistic match, initiative, collaboration, hands-on creativity, balance, and quality over quantity.',
    caveat: 'Guidance describes values, not a checklist or scoring formula.',
    accessed,
  },
  {
    id: 'mit-chances',
    title: 'What are my chances of admission?',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/help/faq/what-does-mit-look-for-chances/',
    kind: 'official-guidance',
    verifies:
      'MIT says it cannot advise individual chances, has no formula, and reviews the complete application in context.',
    accessed,
  },
  {
    id: 'mit-extracurriculars',
    title: 'How does MIT consider extracurriculars?',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/help/faq/extracurriculars/',
    kind: 'official-guidance',
    verifies:
      'MIT values a few genuinely motivating activities and evaluates access to opportunities in context.',
    accessed,
  },
  {
    id: 'mit-activities',
    title: 'Extracurricular activities',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/apply/prepare/activities/',
    kind: 'official-guidance',
    verifies:
      'MIT asks for up to four important activities and explicitly says there are no right activity answers.',
    accessed,
  },
  {
    id: 'mit-selection',
    title: 'How does MIT select students for admission?',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/help/faq/selection-process/',
    kind: 'official-guidance',
    verifies:
      'The selection process is holistic, student-centered, contextual, and based on achievement plus institutional match.',
    accessed,
  },
  {
    id: 'mit-recruited-athletes',
    title: 'Does MIT recruit athletes?',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/help/faq/does-mit-recruit-athletes/',
    kind: 'official-guidance',
    verifies:
      'MIT coaches may advocate, but there are no coach slots, signings, or likely letters; athletes undergo the same academically focused process.',
    caveat: 'Coach advocacy is not an admission guarantee.',
    accessed,
  },
  {
    id: 'mit-admission-stats',
    title: 'Admissions statistics',
    publisher: 'MIT Admissions',
    url: 'https://mitadmissions.org/apply/process/stats/',
    kind: 'official-guidance',
    verifies:
      'Applicant, admit, and enrolled counts for the entering class, and the resulting admit rate.',
    caveat:
      'A rate for an entire applicant pool says nothing about any individual profile.',
    accessed,
  },
  {
    id: 'mit-facts',
    title: 'MIT Facts',
    publisher: 'Massachusetts Institute of Technology',
    url: 'https://facts.mit.edu/wp-content/uploads/2025/11/MIT-Facts-2025-Accessible-with-Map-and-Cover.pdf',
    kind: 'official-guidance',
    verifies:
      'Institute-published enrollment figures, including the share of undergraduates who compete on a team.',
    accessed,
  },
  {
    id: 'research-summary',
    title: 'MIT Ready public-evidence study',
    publisher: 'Local audited research release',
    url: '/research/README.md',
    kind: 'research-release',
    verifies:
      'Release scope, cohort rules, 1,456 profiles, 2,790 activities, source definitions, and interpretation guardrails.',
    caveat: 'A public-source convenience sample is not representative of all MIT students.',
    accessed,
  },
  {
    id: 'research-qa',
    title: 'MIT Ready data QA',
    publisher: 'Local audited research release',
    url: '/research/qa_report.md',
    kind: 'research-release',
    verifies:
      'The rebuilt release passes fatal checks, retains unknowns, and reports blocked or unreachable URLs.',
    accessed,
  },
  {
    id: 'research-no-sports',
    title: 'Sports-excluded sensitivity views',
    publisher: 'Local audited research release',
    url: '/research/REPORT_NO_SPORTS.md',
    kind: 'research-release',
    verifies:
      'Athletics-source overrepresentation and category frequencies after two different sports exclusions.',
    caveat: 'Neither sensitivity view is population-representative.',
    accessed,
  },
  {
    id: 'maa-invitational',
    title: 'MAA Invitational Competitions',
    publisher: 'Mathematical Association of America',
    url: 'https://www.maa.org/maa-invitational-competitions',
    kind: 'official-program',
    verifies:
      'AIME, USAMO/USAJMO, MOP, Team Selection Tests, and the U.S. IMO/EGMO selection sequence.',
    accessed,
  },
  {
    id: 'maa-usamo-2026',
    title: '2026 USAMO and USAJMO Invitations Determined',
    publisher: 'Mathematical Association of America',
    url: 'https://maa.org/news/2026-usamo-and-usajmo-invitations-determined/',
    kind: 'official-program',
    verifies:
      'The 2026 olympiad invitations and their relationship to AIME performance.',
    caveat: 'Invitation cutoffs and counts change by year.',
    accessed,
  },
  {
    id: 'imo',
    title: 'International Mathematical Olympiad',
    publisher: 'IMO Foundation',
    url: 'https://www.imo-official.org/',
    kind: 'official-program',
    verifies: 'Official international team competition, participants, results, and medals.',
    accessed,
  },
  {
    id: 'usaco-details',
    title: 'USACO contest and training-camp details',
    publisher: 'USA Computing Olympiad',
    url: 'https://usaco.org/index.php?page=details',
    kind: 'official-program',
    verifies:
      'Gold/Platinum certified competition, finalist camp, and selection of four U.S. IOI team members.',
    caveat: 'USACO changed its season and advancement structure in 2025–2026.',
    accessed,
  },
  {
    id: 'usaco-camp',
    title: '2025–2026 USACO finalists and camp',
    publisher: 'USA Computing Olympiad',
    url: 'https://usaco.org/index.php?page=camp',
    kind: 'official-program',
    verifies:
      'Current camp-finalist status, proctored U.S. Open emphasis, and IOI/EGOI team selection.',
    accessed,
  },
  {
    id: 'ioi',
    title: 'International Olympiad in Informatics',
    publisher: 'IOI',
    url: 'https://ioinformatics.org/',
    kind: 'official-program',
    verifies: 'Official international computing olympiad structure and results.',
    accessed,
  },
  {
    id: 'usapho',
    title: '2026 U.S. Physics Team',
    publisher: 'American Association of Physics Teachers',
    url: 'https://www.aapt.org/aboutaapt/2026-U-S-Physics-Team-Announced.cfm',
    kind: 'official-program',
    verifies:
      'The 2026 F=ma, USAPhO Plus, EuPhO traveler, and 17-member training-camp structure.',
    caveat:
      'The physics pathway and international destination changed in 2026; historical IPhO wording must be year-tagged.',
    accessed,
  },
  {
    id: 'eupho-2026-result',
    title: '2026 U.S. Physics Team Medals at the 2026 EuPhO',
    publisher: 'American Association of Physics Teachers',
    url: 'https://www.aapt.org/aboutaapt/2026-U-S-Physics-Team-Medals-at-the-2026-EUPhO.cfm',
    kind: 'official-program',
    verifies:
      'Five U.S. travelers competed at the 10th European Physics Olympiad in Gothenburg on June 12–16, 2026, and individual medals were awarded there rather than at IPhO.',
    caveat:
      'This documents one season only. Record the year and the actual international competition instead of assuming an IPhO pathway.',
    accessed,
  },
  {
    id: 'usnco',
    title: 'U.S. National Chemistry Olympiad',
    publisher: 'American Chemical Society',
    url: 'https://www.acs.org/education/olympiad.html',
    kind: 'official-program',
    verifies: 'Local exam, national exam, study camp, and IChO team pathway.',
    accessed,
  },
  {
    id: 'usabo',
    title: 'USA Biology Olympiad',
    publisher: 'Center for Excellence in Education',
    url: 'https://www.usabo-trc.org/',
    kind: 'official-program',
    verifies: 'Open exam, semifinal, national finals, and IBO team pathway.',
    accessed,
  },
  {
    id: 'usabo-exams',
    title: 'USABO: About the Exams',
    publisher: 'Center for Excellence in Education',
    url: 'https://usabo-trc.org/usabo-about-exams',
    kind: 'official-program',
    verifies:
      'Open Exam recognition at the top 20% and top 30%, Semifinal recognition as Academic Excellence for the top 50 scores followed by the next 75 and next 100, and National Finals attendance for the top 20 scores within that top 50.',
    caveat:
      'The Semifinal Exam requires U.S. citizenship or permanent residency, so advancement past the Open Exam is an eligibility boundary rather than a measure of ability.',
    accessed,
  },
  {
    id: 'sts-2026-rules',
    title: 'Regeneron Science Talent Search 2026 Official Rules',
    publisher: 'Society for Science',
    url: 'https://sspcdn.blob.core.windows.net/files/Documents/SEP/STS/2026/Application/Official-Rules.pdf',
    kind: 'official-program',
    verifies:
      'Original-research eligibility, 300 scholar recognitions, 40 finalists, and finalist judging.',
    accessed,
  },
  {
    id: 'sts-2026-awards',
    title: 'Regeneron STS 2026 Top Awards',
    publisher: 'Society for Science',
    url: 'https://www.societyforscience.org/press-release/regeneron-sts-2026-top-awards/',
    kind: 'official-program',
    verifies: 'Top-ten awards and the national finalist cohort.',
    accessed,
  },
  {
    id: 'isef',
    title: 'Regeneron International Science and Engineering Fair',
    publisher: 'Society for Science',
    url: 'https://www.societyforscience.org/isef/',
    kind: 'official-program',
    verifies: 'Affiliated-fair qualification and international finalist competition.',
    caveat:
      'Affiliated fairs qualify students for ISEF. Team and individual projects are not interchangeable.',
    accessed,
  },
  {
    id: 'isef-awards',
    title: 'ISEF Awards',
    publisher: 'Society for Science',
    url: 'https://www.societyforscience.org/isef/awards/',
    kind: 'official-program',
    verifies:
      'Named Top Awards, category Grand Awards, and separately administered Special Awards.',
    caveat:
      'Special Awards come from independent organizations and vary too widely to share one automatic tier.',
    accessed,
  },
  {
    id: 'jshs',
    title: 'Junior Science and Humanities Symposium',
    publisher: 'National JSHS',
    url: 'https://jshs.org/',
    kind: 'official-program',
    verifies: 'The program homepage and current restart status.',
    caveat:
      'Current national rules and results were not fully republished by July 2026; use only dated historical awards with exact year and place.',
    accessed,
  },
  {
    id: 'first-championship',
    title: 'FIRST Championship Eligibility',
    publisher: 'FIRST Robotics Competition',
    url: 'https://www.firstinspires.org/resources/library/frc/championship-eligibility',
    kind: 'official-program',
    verifies:
      '2026 championship eligibility, district and regional advancement, and FIRST Impact Award status.',
    caveat: 'Team qualification does not identify an individual student’s contribution.',
    accessed,
  },
  {
    id: 'first-awards',
    title: 'FIRST Robotics Competition Awards',
    publisher: 'FIRST',
    url: 'https://www.firstinspires.org/resources/library/frc/awards',
    kind: 'official-program',
    verifies:
      'Official team and individual award definitions, including the FIRST Leadership Award name used from 2025–2026.',
    caveat:
      'FIRST Impact recognizes sustained team mission and community impact, not robot engineering. Award criteria can change by season.',
    accessed,
  },
  {
    id: 'first-leadership',
    title: 'FIRST Leadership Award Winners',
    publisher: 'FIRST',
    url: 'https://www.firstinspires.org/resources/library/frc/first-leadership-award-winners',
    kind: 'official-program',
    verifies:
      'The current individual leadership award, formerly called the FIRST Dean’s List Award.',
    accessed,
  },
  {
    id: 'vex-worlds',
    title: 'VEX Robotics Official Competition Path',
    publisher: 'VEX Robotics',
    url: 'https://www.vexrobotics.com/official-path',
    kind: 'official-program',
    verifies:
      'The VEX Robotics competition path and its 2027 VEX Robotics World Championship.',
    caveat:
      'VEX and RECF separated pathways beginning in 2026. Record the exact program, season, team result, and student role.',
    accessed,
  },
  {
    id: 'recf-robotics',
    title: 'RECF Robotics Competition Qualifying Criteria',
    publisher: 'Robotics Education & Competition Foundation',
    url: 'https://kb.roboticseducation.org/hc/en-us/articles/5474199602071-Qualifying-Criteria-for-RECF-Robotics-Competition-Events',
    kind: 'official-program',
    verifies: 'Current RECF Robotics event qualification criteria after the 2026 split.',
    caveat:
      'RECF team qualification does not identify an individual student’s technical contribution.',
    accessed,
  },
  {
    id: 'nsda-2026',
    title: '2026 National Speech & Debate Tournament',
    publisher: 'National Speech & Debate Association',
    url: 'https://www.speechanddebate.org/national-tournament-2026/',
    kind: 'official-program',
    verifies: 'The official 2026 national tournament and high-school event structure.',
    caveat:
      'Attendance can include district qualifiers, Last-Chance qualifiers, and supplemental entries; record the exact high-school main event and pathway.',
    accessed,
  },
  {
    id: 'nsda-qualification',
    title: 'National Tournament Qualification',
    publisher: 'National Speech & Debate Association',
    url: 'https://www.speechanddebate.org/nsdaqualifier/',
    kind: 'official-program',
    verifies: 'District and Last-Chance qualification routes for high-school main events.',
    accessed,
  },
  {
    id: 'toc',
    title: 'Tournament of Champions',
    publisher: 'University of Kentucky',
    url: 'https://ci.uky.edu/debate/toc',
    kind: 'official-program',
    verifies: 'Official high-school debate Tournament of Champions program.',
    caveat:
      'Bid structures vary by event and season; qualification can attach to an individual, intact partnership, or team.',
    accessed,
  },
  {
    id: 'naqt-hsnct',
    title: '2026 High School National Championship Tournament',
    publisher: 'National Academic Quiz Tournaments',
    url: 'https://www.naqt.com/hsnct/2026/details.jsp',
    kind: 'official-program',
    verifies: 'NAQT’s overall high-school championship and qualification context.',
    caveat: 'Team finish and individual scoring are distinct evidence.',
    accessed,
  },
  {
    id: 'pace-nsc',
    title: '2026 National Scholastic Championship',
    publisher: 'Partnership for Academic Competition Excellence',
    url: 'https://www.pace-nsc.org/national-scholastic-championship/',
    kind: 'official-program',
    verifies: 'PACE’s 2026 national high-school quiz-bowl championship and entry pathways.',
    caveat:
      'The 2026 field opened to all teams on May 1, and qualified schools could change rosters. Attendance does not prove qualification or individual contribution.',
    accessed,
  },
  {
    id: 'nhd',
    title: 'National History Day National Contest',
    publisher: 'National History Day',
    url: 'https://nhd.org/en/contest/national-contest/',
    kind: 'official-program',
    verifies:
      'The affiliate-to-national pathway, Junior and Senior Divisions, and individual or group categories.',
    caveat:
      'Category places and topic-specific special prizes have different pools and must be recorded separately.',
    accessed,
  },
  {
    id: 'scholastic-2026',
    title: '2026 National Teen Medalists',
    publisher: 'Scholastic Art & Writing Awards',
    url: 'https://www.scholastic.com/newsroom/all-news/press-release/the-scholastic-art---writing-awards-announce-2026-class-of-natio.html',
    kind: 'official-program',
    verifies:
      'National medals, Gold Medal Portfolio Awards, grade eligibility, and the size of the entry pool.',
    caveat: 'Regional keys and national medals are materially different distinctions.',
    accessed,
  },
  {
    id: 'youngarts',
    title: 'National Competition Winners and Recognition Levels',
    publisher: 'YoungArts',
    url: 'https://youngarts.org/winners/',
    kind: 'official-program',
    verifies:
      'YoungArts Award and Award With Distinction criteria across ten artistic disciplines.',
    accessed,
  },
  {
    id: 'inventteams',
    title: '2025–2026 InvenTeams',
    publisher: 'Lemelson-MIT',
    url: 'https://lemelson.mit.edu/inventeams',
    kind: 'official-program',
    verifies:
      'Eight selected school teams, year-long invention work, prototypes, and $7,500 team grants.',
    caveat:
      'Selection and team membership do not establish an individual student’s ownership, prototype contribution, adoption, or impact.',
    accessed,
  },
  {
    id: 'diamond',
    title: 'Diamond Challenge Competition',
    publisher: 'University of Delaware Horn Entrepreneurship',
    url: 'https://diamondchallenge.org/competition/',
    kind: 'official-program',
    verifies: 'International business and social venture concept tracks, pitch process, and named finalist awards.',
    caveat:
      'A finalist or winner result is team-level concept validation, not proof of deployment, adoption, revenue, or impact.',
    accessed,
  },
  {
    id: 'conrad',
    title: 'The Conrad Challenge',
    publisher: 'Conrad Foundation',
    url: 'https://conrad.spacecenter.org/the-challenge/',
    kind: 'official-program',
    verifies: 'Activation, Innovation, and Innovation Summit stages.',
    caveat:
      'Team awards recognize different criteria; Pete Conrad Scholar, Power Pitch, Citizenship, and Expo awards are not interchangeable product-validation signals.',
    accessed,
  },
  {
    id: 'ncaa-recruiting',
    title: 'NCAA Recruiting',
    publisher: 'NCAA',
    url: 'https://www.ncaa.org/eligibility-center/recruiting/',
    kind: 'official-program',
    verifies: 'Official college-sport eligibility and recruiting resources.',
    caveat:
      'Recruiting standards differ sharply by sport, division, institution, and year; “high-priority recruit” is not a standardized NCAA category.',
    accessed,
  },
  {
    id: 'nfhs-participation',
    title: 'High School Participation Survey Archive',
    publisher: 'National Federation of State High School Associations',
    url: 'https://nfhs.org/resources/sports/high-school-participation-survey-archive',
    kind: 'method',
    verifies: 'National participation context by sport and year.',
    caveat:
      'Participation prevalence does not rank performance, leadership, recruiting value, or multi-sport achievement.',
    accessed,
  },
  {
    id: 'rubric-method',
    title: 'Archetype comparison rubric v1',
    publisher: 'MIT Readiness Atlas',
    url: '#method',
    kind: 'method',
    verifies:
      'The authored tier labels, six quality dimensions, domain weights, documentation bands, and non-predictive interpretation.',
    caveat: 'This is a transparent heuristic, not a validated admissions instrument.',
    accessed,
  },
]

export const sourceById = new Map(sources.map((source) => [source.id, source]))
