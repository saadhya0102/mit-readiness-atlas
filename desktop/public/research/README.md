# MIT Ready public-evidence study

This project assembles two auditable descriptive datasets:

1. Publicly documented high-school activities of verified current or very recent MIT undergraduates.
2. College destinations of top U.S. high-school debate performers.

It does **not** identify why MIT admitted an individual, estimate admission odds, or claim that an activity caused a college outcome.

## Current release snapshot

- 1,456 deduplicated MIT profiles and 2,790 sourced pre-college activity records.
- 1,206 verified Class of 2028–2029 profiles: 587/1,124 for 2028 and 619/1,155 for 2029, exceeding the balanced half-cohort target in each class.
- 1,032 underclass profiles have at least one sourced activity; 174 remain activity-unknown rather than being dropped.
- 1,152 unique top debate performers, with 244 confirmed college destinations and two confirmed MIT destinations in the forward cohort.

## Primary outputs

- `data/mit_students.csv` — one deduplicated row per MIT student, with the coded flagship signal, confidence, source frame, debate flag, and source URLs.
- `data/mit_activities.csv` — one row per documented high-school activity or achievement. This is the correct file for multi-activity prevalence.
- `data/mit_underclass_2028_2029.csv` — the verified half-cohort coverage sample for the Classes of 2028 and 2029, including activity-unknown profiles.
- `data/mit_underclass_activities.csv` — long-form sourced activities for that underclass coverage sample.
- `data/debate_results.csv` — one row per person, event, season, and tournament, with placement/speaker rank, college destination, confidence, and source URLs.
- `data/source_index.csv` — claim-to-URL audit index.
- `data/url_validation.csv` — live HTTP reachability check for retained source URLs.
- `data/excluded_dead_urls.json` — persistent 404/410 exclusions applied during normalization.
- `data/external_debate_evidence.csv` — separately reported NSDA survey, Boston, Houston, and 2016 TOC evidence; these incompatible studies are not pooled.
- `data/summary.json` — computed counts, coverage, sensitivity statistics, MIT admissions baseline, and the skill-tree model.
- `data/summary_tables.csv` — chart-ready long-form summary counts and denominators.
- `data/combined_data.json` — complete normalized JSON release.
- `REPORT_NO_SPORTS.md` — dedicated sensitivity report with sports activities removed, including a stricter view that also excludes MIT Athletics source profiles.
- `data/no_sports/` — sports-excluded student, activity, underclass, summary-table, and machine-readable datasets for both sensitivity definitions.
- `data/expanded_audit_analysis.json` — structural checks for aliases, class conflicts, duplicate activities, missingness, source-frame bias, and privacy fields.
- `data/expanded_audit_samples.json` — deterministic stratified evidence sample with live-page support classifications.
- `data/expanded_audit_review_queue.json` — sampled records that merit manual follow-up because evidence was blocked, ambiguous, or incomplete.
- `qa_report.md` — release validation and interpretation guardrails.

The raw JSONL files live in `raw/` so the research workspace is self-contained and every normalization step can be reproduced. Imported prior-study tables live in `speech-debate-college-research/data/`. Two interrupted buffers (`mit_worker_44_org_roster_gaps.jsonl`, `mit_worker_45_team_program_gaps.jsonl`) and two completions received after the release freeze (`mit_worker_51_2029_af_extra.jsonl`, `mit_worker_52_2029_gl_extra.jsonl`) are preserved for audit but explicitly excluded.

## MIT cohort rules

- MIT attendance/status must have direct public evidence. Profiles with no sourced pre-college activity are retained with an empty activity list and an `unknown` flagship so the cohort is not selected only for unusually visible achievements.
- Target class years are 2026-2030. An unknown class year stays unknown.
- Activity claims come from official MIT profiles, MIT Athletics biographies, official competition pages, schools, organizations, reputable news, and public institutional biographies.
- Publicly indexed, unauthenticated LinkedIn pages may be used as leads or self-reported evidence. Authenticated-session automation, login/CAPTCHA/bot-control bypasses, data brokers, contact collection, and name-only inference are excluded.
- `flagship_signal` is the strongest documented signal found under the coding rubric. It is not an admissions rationale.
- Every activity remains in the long-form activity file even when it is not chosen as the flagship.

## MIT categories

- Academic olympiad / quiz
- Academic honors / enrichment
- Research / science fair
- Robotics / engineering
- CS projects / competitions
- Debate / speech
- Entrepreneurship / business
- Community / civic impact
- Arts / music
- Writing / media
- Varsity sport
- Employment / family responsibility
- Maker / building
- Student leadership
- Other documented signal
- Unknown

Achievement levels are `participation`, `school`, `regional`, `state`, `national`, `international`, or `unknown`.

## Debate cohort rules

- Official NSDA National Tournament results (2007–2025, with broader finalist/speaker coverage from 2022 onward) and official Tournament of Champions results (2019–2025) define the row-level performance cohort. Incompatible older aggregate studies are reported separately as context.
- Team entries are split into one row per individual.
- Tournament final place and speaker rank are retained separately because they measure different things.
- College destinations require public identity-linked evidence. `unknown` is retained rather than dropped.
- `confirmed` is the primary analysis; `confirmed + probable` is a sensitivity view.
- Recent cohorts are right-censored because some competitors are still in high school or have not publicly established a destination.
- Forbes 2025-2026 ranks are used only as a reporting convention for MIT/T1/T10/T25/T50/T100 cutoffs.

## Sampling warning

MIT Athletics profiles are unusually structured and detailed, so athletes, captaincy, state/national sports results, formal awards, and students comfortable with public biographies are overrepresented. Use the source-stratified and non-athletics views in `summary.json`; do not read the raw overall category distribution as the population distribution of MIT students.

`REPORT_NO_SPORTS.md` separates two questions that should not be conflated:

1. What does the dataset show after removing every activity coded `varsity_sport` while retaining all verified profiles?
2. What does it show after also removing every profile whose source frame is an MIT Athletics roster?

The first view still inherits the documentation advantage of athletics biographies. The second reduces that source-frame bias but changes the cohort and discards legitimate non-sports evidence attached to those profiles.

Both reports preserve the auditable observed debate counts and separately show a reporting-only 1.5× underdocumentation sensitivity for non-public protected records. The multiplier is labeled, is not independently auditable from this release, and does not modify row-level student or activity data.

## MIT-readiness skill tree

The skill tree combines MIT's published qualitative themes with the observed evidence categories:

1. Explore an authentic interest.
2. Build sustained practice and fundamentals.
3. Produce, perform, compete, research, build, work, or serve.
4. Earn external validation or measurable use.
5. Take ownership, collaborate, lead, teach, or scale impact.

Cross-cutting skills are collaboration, initiative, hands-on creativity, communication, resilience, ethical contribution, and sustained depth. There is no required branch and no implication that national awards are necessary.

## Rebuild

From this directory:

```powershell
node aggregate_data.mjs
node validate_urls.mjs
node aggregate_data.mjs
node validate_urls.mjs
node qa_data.mjs
node write_report.mjs
node build_no_sports_views.mjs
```

Repeat the aggregate/validate pair if a validation pass discovers new 404/410 URLs. The release should not be presented unless `qa_report.md` says `PASS`.
