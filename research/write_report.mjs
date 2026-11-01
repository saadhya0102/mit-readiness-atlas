import fs from "node:fs/promises";
import path from "node:path";

const projectDir = path.resolve(import.meta.dirname);
const summary = JSON.parse(await fs.readFile(path.join(projectDir, "data", "summary.json"), "utf8"));
const debateUnderdocumentationFactor = 1.5;
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;
const countRange = (lower, upper) => (lower === upper ? String(upper) : `${lower}–${upper}`);
const sensitivityCount = (value) => Math.round(value * debateUnderdocumentationFactor);
const sensitivityRange = (lower, upper) =>
  countRange(sensitivityCount(lower), sensitivityCount(upper));
const countFor = (items, key) => items.find((row) => row.key === key)?.count ?? 0;
const label = (value) =>
  String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .replace(/\bCs\b/g, "CS")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bIoi\b/g, "IOI")
    .replace(/\bUsaco\b/g, "USACO")
    .replace(/\bUsapho\b/g, "USAPhO")
    .replace(/\bUsnco\b/g, "USNCO")
    .replace(/\bUsabo\b/g, "USABO")
    .replace(/\bAnd\b/g, "and");

const mit = summary.mit_sample;
const debate = summary.debate_pipeline;
const underclass = mit.underclass_expansion;
const topFlagships = mit.flagship_categories.slice(0, 10);
const topNonAthletics = mit.flagship_categories_non_athletics.slice(0, 10);
const topActivities = mit.activity_prevalence.slice(0, 10);
const topSports = mit.sport_breakdown.slice(0, 12);
const topAcademic = mit.academic_competition_breakdown.slice(0, 10);
const topResearch = mit.research_field_breakdown.slice(0, 8);
const debateDetails = mit.debate_speech_breakdown;
const topUnderclassFlagships = underclass.flagship_categories.slice(0, 10);
const topUnderclassNonAthletics = underclass.flagship_categories_non_athletics.slice(0, 10);
const topUnderclassActivities = underclass.activity_prevalence.slice(0, 10);
const debateFlagshipCount = countFor(mit.flagship_categories, "debate_speech");
const debateNonAthleticsFlagshipCount = countFor(
  mit.flagship_categories_non_athletics,
  "debate_speech",
);
const debateActivityCount = countFor(mit.activity_prevalence, "debate_speech");
const underclassDebateFlagshipCount = countFor(
  underclass.flagship_categories,
  "debate_speech",
);
const underclassDebateNonAthleticsFlagshipCount = countFor(
  underclass.flagship_categories_non_athletics,
  "debate_speech",
);
const underclassDebateActivityCount = countFor(
  underclass.activity_prevalence,
  "debate_speech",
);
const tier = new Map(debate.rank_thresholds.map((row) => [row.threshold, row]));
const performanceTierBullets = (items, metric) =>
  items
    .map(
      (row) =>
        `- ${metric} top ${row.threshold}: ${row.unique_people} performers; ${row.confirmed_destinations} confirmed destinations; ${row.top_10_confirmed} at a Forbes top-10 college (${pct(row.top_10_rate_among_confirmed)} of confirmed)`,
    )
    .join("\n");
const nsdaSurvey = summary.external_debate_evidence.filter((row) =>
  row.evidence_id.startsWith("NSDA2019_TOP"),
);
const toc2016 = summary.external_debate_evidence.find((row) => row.evidence_id === "VBI2016_COHORT");
const tocKnown = summary.external_debate_evidence.find(
  (row) => row.evidence_id === "VBI2016_COLLEGE_KNOWN",
);
const tocHarvard = summary.external_debate_evidence.find(
  (row) => row.evidence_id === "VBI2016_HARVARD",
);

const countBullets = (items, denominator, note = "") =>
  items
    .map(
      (row) =>
        `- ${label(row.key)}: ${row.count} (${pct(row.count / denominator)})${note}`,
    )
    .join("\n");

const report = `# MIT Ready public-evidence study

Generated ${summary.generated_at.slice(0, 10)}.

## Executive read

- MIT reported ${summary.official_mit_baseline.applicants.toLocaleString()} applicants and ${summary.official_mit_baseline.admits.toLocaleString()} admits for the Class of ${summary.official_mit_baseline.class_year}, a ${pct(summary.official_mit_baseline.admit_rate)} admit rate. MIT explicitly says these statistics are outcomes of a holistic process, not an admissions formula.
- MIT does not publish a distribution of admitted students' high-school activities or an individual “reason admitted.” The categories below are coded from public biographies and competition records.
- The research release contains ${mit.students.toLocaleString()} deduplicated current/recent MIT students and ${mit.activity_records.toLocaleString()} sourced high-school activity records. The long-form activity file preserves every sourced activity.
- ${mit.profiles_with_documented_activities.toLocaleString()} profiles have at least one sourced pre-college activity; ${mit.profiles_activity_unknown.toLocaleString()} verified MIT profiles are retained with activity unknown so documentation availability does not determine cohort membership.
- ${mit.resolved_name_alias_pairs.length} high-confidence display-name variants are merged before counting; unresolved ambiguous names remain separate and are disclosed in QA.
- Two interrupted roster buffers and two post-freeze completions are preserved for audit but excluded from every release count.
- The Classes of 2028–2029 expansion currently contains ${underclass.verified_profiles.toLocaleString()} verified profiles: ${underclass.class_2028} from 2028 (${pct(underclass.class_2028_coverage)}) and ${underclass.class_2029} from 2029 (${pct(underclass.class_2029_coverage)}). This covers ${pct(underclass.denominator_coverage)} of the Registrar's ${underclass.enrolled_denominator.toLocaleString()}-student Fall 2025 class-standing denominator and ${pct(underclass.target_completion)} of the ${underclass.profile_target.toLocaleString()}-profile half-cohort target.
- Within the underclass cohort, ${underclass.profiles_with_documented_activities.toLocaleString()} profiles have sourced pre-college activities and ${underclass.profiles_activity_unknown.toLocaleString()} remain unknown. ${underclass.athletics_source_rows.toLocaleString()} (${pct(underclass.athletics_source_share)}) were found through MIT Athletics, versus MIT Facts' statement that approximately ${pct(summary.official_mit_baseline.undergraduate_team_participation, 0)} of undergraduates join a team; the sampling frame is therefore about ${(underclass.athletics_source_share / summary.official_mit_baseline.undergraduate_team_participation).toFixed(1)}× athletics-heavy. ${underclass.pure_athletics_profiles.toLocaleString()} have only athletics documented and are reported as a separate stratum.
- ${mit.athletics_source_rows.toLocaleString()} MIT rows (${pct(mit.athletics_source_share)}) come from unusually detailed athletics profiles. The overall flagship distribution is therefore not a population estimate.
- High-school speech/debate participation is explicitly flagged for ${countRange(mit.debate_documented_unique_sensitivity, mit.debate_documented)} MIT students in this sample. ${countRange(mit.competitive_debate_documented_unique_sensitivity, mit.competitive_debate_documented)} have a named debate format, debate tournament, club, partner, or debate-specific result; ${countRange(mit.competitive_debate_national_or_international_unique_sensitivity, mit.competitive_debate_national_or_international)} of those have national/international evidence. These are public-evidence lower bounds; absence from a biography is not proof that a student never debated.
- A separate reporting-only sensitivity assumes non-public protected records would increase debate counts by 50%. It produces an estimated ${sensitivityRange(mit.debate_documented_unique_sensitivity, mit.debate_documented)} broad debate flags, but does not alter the observed row-level release.
- The forward debate cohort currently contains ${debate.unique_people.toLocaleString()} unique top performers. ${debate.confirmed_destinations.toLocaleString()} destinations are confirmed (${pct(debate.confirmed_coverage)} coverage); ${debate.confirmed_plus_probable_destinations.toLocaleString()} are confirmed or probable (${pct(debate.confirmed_plus_probable_coverage)}).
- ${debate.mit_destinations_confirmed_or_probable} forward-cohort debater${debate.mit_destinations_confirmed_or_probable === 1 ? "" : "s"} ${debate.mit_destinations_confirmed_or_probable === 1 ? "has" : "have"} a confirmed/probable MIT destination. This statistic is separate from the reverse MIT-student lookup above.

## Debate underdocumentation sensitivity

This reporting-only scenario applies a 1.5× multiplier to observed debate counts to account for non-public protected records described outside the auditable release. The repository cannot independently verify or classify those records, so observed counts remain canonical in the datasets and tables.

- Broad speech/debate flag: ${countRange(mit.debate_documented_unique_sensitivity, mit.debate_documented)} observed; ${sensitivityRange(mit.debate_documented_unique_sensitivity, mit.debate_documented)} estimated.
- Named competitive format, club, tournament, partner, or result: ${countRange(mit.competitive_debate_documented_unique_sensitivity, mit.competitive_debate_documented)} observed; ${sensitivityRange(mit.competitive_debate_documented_unique_sensitivity, mit.competitive_debate_documented)} estimated.
- National/international competitive evidence: ${countRange(mit.competitive_debate_national_or_international_unique_sensitivity, mit.competitive_debate_national_or_international)} observed; ${sensitivityRange(mit.competitive_debate_national_or_international_unique_sensitivity, mit.competitive_debate_national_or_international)} estimated.
- Debate/speech flagship: ${debateFlagshipCount} observed; ${sensitivityCount(debateFlagshipCount)} estimated.
- Any documented debate/speech activity: ${debateActivityCount} observed; ${sensitivityCount(debateActivityCount)} estimated.
- Classes 2028–2029 broad debate flag: ${underclass.debate_documented} observed; ${sensitivityCount(underclass.debate_documented)} estimated.
- Classes 2028–2029 named competitive evidence: ${underclass.competitive_debate_documented} observed; ${sensitivityCount(underclass.competitive_debate_documented)} estimated.

The adjusted flagship figures are arithmetic sensitivities only. They are not inserted into the mutually exclusive flagship tables because doing so would require record-level reclassification of the other categories.

## Classes 2028–2029 coverage cohort

Source frames, using all ${underclass.verified_profiles.toLocaleString()} verified profiles as the denominator:

${countBullets(underclass.source_frames, underclass.verified_profiles)}

Pre-college activity documentation by source frame:

${underclass.source_frame_breakdown
  .map(
    (row) =>
      `- ${row.frame}: ${row.activity_known}/${row.students} profiles with a sourced activity (${pct(row.activity_documentation_rate)})`,
  )
  .join("\n")}

This completeness gap is a major selection effect: athletics biographies usually include detailed high-school histories, while many MIT organization rosters provide only identity and class year.

Strongest documented signal among the ${underclass.flagship_known.toLocaleString()} profiles with a known flagship:

${countBullets(topUnderclassFlagships, underclass.flagship_known)}

Debate/speech sensitivity: ${underclassDebateFlagshipCount} observed flagships; ${sensitivityCount(underclassDebateFlagshipCount)} estimated under the 50% adjustment.

Non-athletics-source sensitivity view among ${underclass.flagship_known_non_athletics.toLocaleString()} known flagships:

${countBullets(topUnderclassNonAthletics, underclass.flagship_known_non_athletics)}

Debate/speech sensitivity: ${underclassDebateNonAthleticsFlagshipCount} observed flagships; ${sensitivityCount(underclassDebateNonAthleticsFlagshipCount)} estimated under the 50% adjustment.

Multi-activity prevalence, using the full underclass cohort so unknown documentation remains in the denominator:

${countBullets(topUnderclassActivities, underclass.verified_profiles)}

Debate/speech activity sensitivity: ${underclassDebateActivityCount} observed profiles; ${sensitivityCount(underclassDebateActivityCount)} estimated under the 50% adjustment.

Under the strict reverse-lookup coding, ${underclass.debate_documented} underclass profiles have documented speech/debate participation; ${underclass.competitive_debate_documented} have a named competitive debate format, club, tournament, partner, or result, and ${underclass.competitive_debate_national_or_international} have national/international evidence. These are public-evidence lower bounds, not prevalence estimates.

## Strongest documented MIT signals

These are mutually exclusive coded flagship signals, not reasons for admission.

${countBullets(topFlagships, mit.flagship_known)}

Debate/speech sensitivity: ${debateFlagshipCount} observed flagships; ${sensitivityCount(debateFlagshipCount)} estimated under the 50% adjustment.

### Non-athletics-source sensitivity view

The non-athletics source frame contains ${mit.non_athletics_source_rows} students, of whom ${mit.flagship_known_non_athletics} have a sourced flagship. It reduces, but does not eliminate, source-selection bias.

${countBullets(topNonAthletics, mit.flagship_known_non_athletics)}

Debate/speech sensitivity: ${debateNonAthleticsFlagshipCount} observed flagships; ${sensitivityCount(debateNonAthleticsFlagshipCount)} estimated under the 50% adjustment.

## Multi-activity prevalence

A student may appear in several categories.

${countBullets(topActivities, mit.students)}

Debate/speech activity sensitivity: ${debateActivityCount} observed profiles; ${sensitivityCount(debateActivityCount)} estimated under the 50% adjustment.

### Sport detail

These keyword-derived counts are multi-label and strongly affected by the athletics sampling frame.

${countBullets(topSports, mit.students)}

### Academic competition detail

${countBullets(topAcademic, mit.students)}

### Research-field detail

${countBullets(topResearch, mit.students)}

### Debate and speech detail inside the MIT sample

These multi-label counts include speech, mock trial, and Model UN when publicly documented. The strict \`debate=yes\` count above is narrower.

${countBullets(debateDetails, mit.students)}

Verified named-format/result debate records:

${mit.competitive_debate_records
  .map(
    (row) =>
      `- ${row.person_name}: ${row.documented_level}; ${row.achievement} Source: ${row.evidence_url}`,
  )
  .join("\n")}

${mit.possible_debate_alias_pairs.length ? `Identity sensitivity note: ${mit.possible_debate_alias_pairs.map((pair) => pair.join(" / ")).join("; ")} may be the same person, but the public sources do not conclusively expose the abbreviated identity, so both rows remain auditable.` : ""}

## Debate-to-college pipeline

The row-level cohort includes NSDA national champions for 2007–2021, expanded NSDA finalist/speaker cohorts for 2022–2025, TOC Policy and Public Forum top-32 cohorts for 2019–2025, and TOC Lincoln-Douglas top-16 cohorts for 2019–2025, with available speaker lists retained separately.

Among confirmed destinations in the forward cohort:

- MIT / Forbes rank 1: ${tier.get(1)?.count ?? 0} (${pct(tier.get(1)?.known_rate ?? 0)})
- Forbes top 5: ${tier.get(5)?.count ?? 0} (${pct(tier.get(5)?.known_rate ?? 0)})
- Forbes top 10: ${tier.get(10)?.count ?? 0} (${pct(tier.get(10)?.known_rate ?? 0)})
- Forbes top 25: ${tier.get(25)?.count ?? 0} (${pct(tier.get(25)?.known_rate ?? 0)})
- Forbes top 50: ${tier.get(50)?.count ?? 0} (${pct(tier.get(50)?.known_rate ?? 0)})
- Forbes top 100: ${tier.get(100)?.count ?? 0} (${pct(tier.get(100)?.known_rate ?? 0)})

These percentages use confirmed known destinations as the denominator. The release also stores all-cohort lower bounds and broad unresolved-record upper bounds.

### Direct MIT destination match

${debate.mit_destination_records.length
  ? debate.mit_destination_records
      .map(
        (row) =>
          `- ${row.person_name}: ${row.season} ${row.tournament} ${row.event}${row.final_place ? `, final place ${row.final_place}` : ""}${row.speaker_rank ? `, speaker rank ${row.speaker_rank}` : ""}; ${row.college_match_status} MIT destination. Results: ${row.result_url} Destination evidence: ${row.college_evidence_url}`,
      )
      .join("\n")
  : "- No confirmed or probable MIT destination was found in the defined forward cohort."}

### Destination coverage by tournament

${debate.destination_coverage_by_tournament
  .map(
    (row) =>
      `- ${row.tournament}: ${row.unique_people} unique performers; ${row.confirmed} confirmed destinations (${pct(row.confirmed_rate)}); ${row.confirmed_plus_probable} confirmed or probable (${pct(row.confirmed_plus_probable_rate)}).`,
  )
  .join("\n")}

Tournament cohorts overlap, so their unique-person counts are not additive.

### Results by debate-performance cutoff

Final tournament place:

${performanceTierBullets(debate.final_place_thresholds, "Final-place")}

Speaker rank:

${performanceTierBullets(debate.speaker_rank_thresholds, "Speaker-rank")}

Final place and speaker rank are kept separate because they measure different outcomes. Recent competitors also have substantially lower destination coverage.

### External contextual evidence

${nsdaSurvey
  .map(
    (row) =>
      `- NSDA class-of-2019 survey: ${row.debate_value}% of ${row.sample_size_debate.toLocaleString()} respondents reported ${row.outcome.toLowerCase()}, versus an uncited ${row.comparison_value}% national benchmark. This is Tier 4 self-report evidence with undisclosed response and ranking methods.`,
  )
  .join("\n")}
- A 2016 Tournament of Champions study enumerated ${toc2016?.debate_value ?? 438} competitors and identified ${tocKnown?.debate_value ?? 401} colleges. It reported ${tocHarvard?.debate_value ?? 33} Harvard attendees (${pct((tocHarvard?.debate_value ?? 33) / (toc2016?.debate_value ?? 438))} of the full cohort). The row-level data were removed, so this result is not independently reproducible.

## MIT-readiness skill tree

The descriptive progression is:

1. Explore an authentic interest.
2. Build sustained practice and fundamentals.
3. Produce, perform, compete, research, build, work, or serve.
4. Earn external validation or measurable use.
5. Take ownership, collaborate, lead, teach, or scale impact.

Branches include academic problem-solving, research, engineering/making, communication/argument, team performance, and initiative/contribution. Cross-cutting skills are collaboration, initiative, hands-on creativity, communication, resilience, ethical contribution, and sustained depth.

This is not a checklist. MIT's own guidance emphasizes holistic fit, collaboration, initiative, hands-on creativity, risk-taking, and contribution rather than a required activity.

## What the study cannot establish

- It cannot identify the reason an individual was admitted.
- It cannot estimate an activity's causal effect on admission.
- It is not representative of all MIT students.
- Public profiles favor unusually accomplished, institutionally featured, and easily matched students.
- Athletics bios are more complete than most other sources.
- Recent debate cohorts are right-censored, and selective-college destinations may be easier to find.
- College rankings are a presentation convention, not a measure of an individual's quality.

## Audit files

- MIT student rows: \`data/mit_students.csv\`
- MIT long-form activities: \`data/mit_activities.csv\`
- Classes 2028–2029 coverage cohort: \`data/mit_underclass_2028_2029.csv\`
- Classes 2028–2029 long-form activities: \`data/mit_underclass_activities.csv\`
- Debate results and destinations: \`data/debate_results.csv\`
- Claim-to-source audit: \`data/source_index.csv\`
- Source URL reachability: \`data/url_validation.csv\`
- Expanded-cohort structural audit: \`data/expanded_audit_analysis.json\`
- Stratified evidence audit: \`data/expanded_audit_samples.json\`
- Manual-review queue: \`data/expanded_audit_review_queue.json\`
- Chart-ready summaries: \`data/summary_tables.csv\`
- Machine-readable release: \`data/combined_data.json\`
- Sports-excluded sensitivity report: \`REPORT_NO_SPORTS.md\`
- Sports-excluded datasets and summaries: \`data/no_sports/\`
- Validation: \`qa_report.md\`

## Primary official sources

- MIT admissions statistics: https://mitadmissions.org/apply/process/stats/
- MIT first-year class profile: https://mitadmissions.org/apply/process/profile/
- MIT qualitative guidance: https://mitadmissions.org/apply/process/what-we-look-for/
- MIT 2025-26 Common Data Set: https://ir.mit.edu/projects/2025-26-common-data-set/
- NSDA national history: https://www.speechanddebate.org/nationals-history/
`;

await fs.writeFile(path.join(projectDir, "REPORT.md"), report);
console.log(`Wrote REPORT.md (${report.length} characters)`);
