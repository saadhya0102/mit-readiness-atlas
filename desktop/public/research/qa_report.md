# MIT Ready data QA

Generated: 2026-07-25T19:01:46.197Z

## Release checks

- Verdict: PASS
- MIT student rows: 1456
- MIT activity rows: 2790
- Classes 2028–2029 verified profiles: 1206/1140 target
- Class 2028 coverage: 587/1124
- Class 2029 coverage: 619/1155
- Debate result rows: 1525
- Distinct retained source URLs: 2591
- URL checks returning 2xx: 2137
- URL checks blocked by 401/403/429: 420
- URL checks returning 404/410: 0
- URL checks with network errors: 20
- MIT rows with unknown flagship: 176
- MIT rows with no publicly documented pre-college activity: 176
- Debate rows with unknown college: 1012
- Fatal errors: 0
- Warnings: 2

## Fatal errors

- None.

## Warnings

- Possible public-name alias retained separately: Aiden H. / Aiden Hurst
- 20 retained source URLs had network errors

## Interpretation guardrails

- The MIT sample is public-source convenience data, not a random or representative sample.
- A flagship signal is a coding choice about documented evidence, not a causal admissions explanation.
- Verified MIT profiles without sourced pre-college activities are retained as unknown, not treated as having no activities.
- Missing debate destinations remain explicit; recent cohorts are especially right-censored.
- Tournament results and speaker awards measure different dimensions and should not be conflated.
