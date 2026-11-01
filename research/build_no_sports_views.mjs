import fs from "node:fs/promises";
import path from "node:path";

const projectDir = path.resolve(import.meta.dirname);
const dataDir = path.join(projectDir, "data");
const outputDir = path.join(dataDir, "no_sports");
const sourcePath = path.join(dataDir, "combined_data.json");
const noSportsCategory = "varsity_sport";
const athleticsSourceFrame = "MIT athletics roster";
const debateUnderdocumentationFactor = 1.5;

const categoryOrder = [
  "academic_olympiad",
  "academic_honors",
  "research_science_fair",
  "robotics_engineering",
  "cs_projects_competitions",
  "debate_speech",
  "entrepreneurship",
  "community_civic",
  "arts_music",
  "writing_media",
  "employment_family",
  "maker_building",
  "student_government_leadership",
  "other",
  "unknown",
];

const categoryLabels = {
  academic_olympiad: "Academic olympiad / quiz",
  academic_honors: "Academic honors / enrichment",
  research_science_fair: "Research / science fair",
  robotics_engineering: "Robotics / engineering",
  cs_projects_competitions: "CS projects / competitions",
  debate_speech: "Debate / speech",
  entrepreneurship: "Entrepreneurship / business",
  community_civic: "Community / civic impact",
  arts_music: "Arts / music",
  writing_media: "Writing / media",
  employment_family: "Employment / family responsibility",
  maker_building: "Maker / building",
  student_government_leadership: "Student leadership",
  other: "Other documented signal",
  unknown: "Unknown",
  varsity_sport: "Varsity sport",
};

const levelRank = {
  unknown: 0,
  participation: 1,
  school: 2,
  regional: 3,
  state: 4,
  national: 5,
  international: 6,
};

const clean = (value) =>
  value === undefined || value === null ? "" : String(value).replace(/\s+/g, " ").trim();

const csvEscape = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const toCsv = (rows, columns) => {
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(columns.map((column) => csvEscape(row[column])).join(","));
  }
  return `${lines.join("\r\n")}\r\n`;
};

const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;
const sensitivityCount = (value) => Math.round(value * debateUnderdocumentationFactor);

const displayLabel = (value) =>
  categoryLabels[value] ??
  String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const values = getter(row);
    for (const value of Array.isArray(values) ? values : [values]) {
      if (!value) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        categoryOrder.indexOf(left.key) - categoryOrder.indexOf(right.key) ||
        String(left.key).localeCompare(String(right.key)),
    );
}

function chooseBestActivity(activities) {
  return [...activities]
    .map((activity, index) => ({ activity, index }))
    .sort(
      (left, right) =>
        (levelRank[right.activity.level] ?? 0) - (levelRank[left.activity.level] ?? 0) ||
        categoryOrder.indexOf(left.activity.category) -
          categoryOrder.indexOf(right.activity.category) ||
        left.index - right.index,
    )[0]?.activity;
}

function indexSourceRows(rows) {
  let activityIndex = 0;
  return rows.map((row, studentIndex) => {
    const activities = (row.activities ?? []).map((activity) => {
      activityIndex += 1;
      return {
        ...activity,
        activity_id: `ACT-${String(activityIndex).padStart(5, "0")}`,
      };
    });
    return {
      ...row,
      mit_id: `MIT-${String(studentIndex + 1).padStart(4, "0")}`,
      activities,
    };
  });
}

function removeSportsFromProfile(row) {
  const originalActivities = row.activities ?? [];
  const activities = originalActivities.filter(
    (activity) => activity.category !== noSportsCategory,
  );
  const originalFlagshipCategory = row.flagship_category ?? "unknown";
  const originalFlagshipSignal = row.flagship_signal ?? "unknown";
  let flagship;
  let flagshipBasis;

  if (originalFlagshipCategory !== noSportsCategory && originalFlagshipCategory !== "unknown") {
    const originalCategoryActivities = activities.filter(
      (activity) => activity.category === originalFlagshipCategory,
    );
    flagship =
      originalCategoryActivities.find(
        (activity) => clean(activity.achievement) === clean(originalFlagshipSignal),
      ) ?? chooseBestActivity(originalCategoryActivities);
    flagshipBasis = flagship
      ? "retained_original_non_sport_flagship"
      : "recomputed_after_missing_original_flagship";
  }

  if (!flagship && activities.length) {
    flagship = chooseBestActivity(activities);
    flagshipBasis =
      originalFlagshipCategory === noSportsCategory
        ? "recomputed_after_sport_exclusion"
        : "recomputed_from_remaining_sourced_activities";
  }

  if (!flagship) {
    flagshipBasis =
      originalActivities.length && originalActivities.every((activity) => activity.category === noSportsCategory)
        ? "unknown_after_sport_exclusion"
        : "originally_unknown_or_no_non_sport_activity";
  }

  return {
    ...row,
    activities,
    flagship_category: flagship?.category ?? "unknown",
    flagship_signal: flagship?.achievement ?? "unknown",
    flagship_confidence: flagshipBasis === "retained_original_non_sport_flagship"
      ? row.flagship_confidence
      : flagship
        ? "not_reassessed"
        : "low",
    no_sports_flagship_basis: flagshipBasis,
    original_flagship_category: originalFlagshipCategory,
    original_flagship_signal: originalFlagshipSignal,
    original_activity_count: originalActivities.length,
    sports_activity_records_removed:
      originalActivities.length - activities.length,
  };
}

function maxActivityLevel(activities) {
  return Math.max(0, ...activities.map((activity) => levelRank[activity.level] ?? 0));
}

function flattenStudents(rows) {
  return rows.map((row) => ({
    mit_id: row.mit_id,
    person_name: row.person_name,
    mit_status: row.mit_status,
    mit_class_year: row.mit_class_year,
    high_school: row.high_school,
    hs_grad_year: row.hs_grad_year,
    source_frame: row.source_frame,
    flagship_category: row.flagship_category,
    flagship_label: displayLabel(row.flagship_category),
    flagship_signal: row.flagship_signal,
    flagship_confidence: row.flagship_confidence,
    no_sports_flagship_basis: row.no_sports_flagship_basis,
    original_flagship_category: row.original_flagship_category,
    original_flagship_label: displayLabel(row.original_flagship_category),
    original_flagship_signal: row.original_flagship_signal,
    debate: row.debate,
    debate_details: row.debate_details,
    activity_count: row.activities.length,
    original_activity_count: row.original_activity_count,
    sports_activity_records_removed: row.sports_activity_records_removed,
    highest_non_sports_level:
      Object.keys(levelRank).find(
        (level) => levelRank[level] === maxActivityLevel(row.activities),
      ) ?? "unknown",
    mit_evidence_url: row.mit_evidence_url,
    source_urls: (row.source_urls ?? []).join(" | "),
    source_files: (row.source_files ?? []).join(" | "),
    notes: row.notes,
  }));
}

function flattenActivities(rows) {
  const flattened = [];
  for (const row of rows) {
    for (const activity of row.activities) {
      flattened.push({
        activity_id: activity.activity_id,
        mit_id: row.mit_id,
        person_name: row.person_name,
        source_frame: row.source_frame,
        category: activity.category,
        category_label: displayLabel(activity.category),
        subcategory: activity.subcategory,
        level: activity.level,
        achievement: activity.achievement,
        evidence_url: activity.evidence_url,
      });
    }
  }
  return flattened;
}

function summarizeCohort(rows) {
  const originalSportsRecords = rows.reduce(
    (total, row) => total + row.sports_activity_records_removed,
    0,
  );
  const knownFlagships = rows.filter((row) => row.flagship_category !== "unknown");
  const flagshipCategories = countBy(knownFlagships, (row) => row.flagship_category);
  const activityPrevalence = countBy(rows, (row) => [
    ...new Set(row.activities.map((activity) => activity.category)),
  ]);
  const debateDocumented = rows.filter((row) => row.debate === "yes").length;
  const debateFlagships =
    flagshipCategories.find((row) => row.key === "debate_speech")?.count ?? 0;
  const debateActivityPrevalence =
    activityPrevalence.find((row) => row.key === "debate_speech")?.count ?? 0;
  return {
    students: rows.length,
    activity_records: rows.reduce((total, row) => total + row.activities.length, 0),
    profiles_with_documented_non_sports_activities: rows.filter(
      (row) => row.activities.length > 0,
    ).length,
    profiles_without_documented_non_sports_activities: rows.filter(
      (row) => row.activities.length === 0,
    ).length,
    profiles_losing_all_documented_activities: rows.filter(
      (row) => row.original_activity_count > 0 && row.activities.length === 0,
    ).length,
    sports_activity_records_removed: originalSportsRecords,
    profiles_with_sports_activity_removed: rows.filter(
      (row) => row.sports_activity_records_removed > 0,
    ).length,
    athletics_source_rows: rows.filter(
      (row) => row.source_frame === athleticsSourceFrame,
    ).length,
    flagship_known: knownFlagships.length,
    flagship_recomputed_after_sport_exclusion: rows.filter(
      (row) => row.no_sports_flagship_basis === "recomputed_after_sport_exclusion",
    ).length,
    flagship_unknown_after_sport_exclusion: rows.filter(
      (row) => row.no_sports_flagship_basis === "unknown_after_sport_exclusion",
    ).length,
    debate_documented: debateDocumented,
    debate_sensitivity: {
      factor: debateUnderdocumentationFactor,
      debate_documented_estimate: sensitivityCount(debateDocumented),
      debate_flagship_observed: debateFlagships,
      debate_flagship_estimate: sensitivityCount(debateFlagships),
      debate_activity_prevalence_observed: debateActivityPrevalence,
      debate_activity_prevalence_estimate:
        sensitivityCount(debateActivityPrevalence),
    },
    source_frames: countBy(rows, (row) => row.source_frame),
    flagship_categories: flagshipCategories,
    activity_prevalence: activityPrevalence,
  };
}

function summaryTableRows(views) {
  const rows = [];
  const add = (view, section, label, count, denominator, note) => {
    rows.push({
      view,
      section,
      label,
      count,
      denominator,
      share: denominator ? count / denominator : null,
      note,
    });
  };

  for (const [view, summary] of Object.entries(views)) {
    add(
      view,
      "Cohort",
      "Students",
      summary.students,
      summary.students,
      "Verified profiles retained in this view",
    );
    add(
      view,
      "Cohort",
      "Profiles with documented non-sports activities",
      summary.profiles_with_documented_non_sports_activities,
      summary.students,
      "At least one sourced activity after removing varsity_sport",
    );
    add(
      view,
      "Exclusion",
      "Sports activity records removed",
      summary.sports_activity_records_removed,
      null,
      "Long-form activity records coded varsity_sport",
    );
    add(
      view,
      "Exclusion",
      "MIT Athletics source rows retained",
      summary.athletics_source_rows,
      summary.students,
      "Zero in strict non-athletics-source views",
    );
    add(
      view,
      "Debate",
      "Explicit speech/debate flag",
      summary.debate_documented,
      summary.students,
      "Broad public-evidence flag",
    );
    add(
      view,
      "Debate sensitivity",
      "Explicit speech/debate flag — 50% underdocumentation estimate",
      summary.debate_sensitivity.debate_documented_estimate,
      summary.students,
      "Reporting-only estimate; not an observed row-level count",
    );
    add(
      view,
      "Debate sensitivity",
      "Debate/speech flagship — 50% underdocumentation estimate",
      summary.debate_sensitivity.debate_flagship_estimate,
      summary.flagship_known,
      "Arithmetic sensitivity only; not inserted into mutually exclusive observed flagships",
    );
    add(
      view,
      "Debate sensitivity",
      "Any debate/speech activity — 50% underdocumentation estimate",
      summary.debate_sensitivity.debate_activity_prevalence_estimate,
      summary.students,
      "Reporting-only estimate; not an observed row-level count",
    );
    for (const item of summary.flagship_categories) {
      add(
        view,
        "Strongest documented non-sports signal",
        item.key,
        item.count,
        summary.flagship_known,
        "Mutually exclusive among profiles with a known no-sports flagship",
      );
    }
    for (const item of summary.activity_prevalence) {
      add(
        view,
        "Non-sports activity prevalence",
        item.key,
        item.count,
        summary.students,
        "Multi-label; a student may appear in several categories",
      );
    }
  }
  return rows;
}

const countBullets = (items, denominator, limit = 12) =>
  items
    .slice(0, limit)
    .map(
      (row) =>
        `- ${displayLabel(row.key)}: ${row.count} (${pct(row.count / denominator)})`,
    )
    .join("\n");

function reportSection(title, summary) {
  return `## ${title}

- Profiles retained: ${summary.students.toLocaleString()}
- Profiles with at least one sourced non-sports activity: ${summary.profiles_with_documented_non_sports_activities.toLocaleString()} (${pct(summary.profiles_with_documented_non_sports_activities / summary.students)})
- Profiles without a sourced non-sports activity: ${summary.profiles_without_documented_non_sports_activities.toLocaleString()}
- Sports activity records removed: ${summary.sports_activity_records_removed.toLocaleString()} across ${summary.profiles_with_sports_activity_removed.toLocaleString()} profiles
- MIT Athletics source rows retained: ${summary.athletics_source_rows.toLocaleString()}
- Explicitly documented speech/debate profiles: ${summary.debate_documented.toLocaleString()} (${pct(summary.debate_documented / summary.students)})

### Debate underdocumentation sensitivity

This reporting-only scenario assumes non-public protected records increase debate counts by 50%. It does not alter the observed rows or the tables below.

- Broad speech/debate flag: ${summary.debate_documented.toLocaleString()} observed; ${summary.debate_sensitivity.debate_documented_estimate.toLocaleString()} estimated (${pct(summary.debate_sensitivity.debate_documented_estimate / summary.students)})
- Debate/speech flagship: ${summary.debate_sensitivity.debate_flagship_observed.toLocaleString()} observed; ${summary.debate_sensitivity.debate_flagship_estimate.toLocaleString()} estimated
- Any documented debate/speech activity: ${summary.debate_sensitivity.debate_activity_prevalence_observed.toLocaleString()} observed; ${summary.debate_sensitivity.debate_activity_prevalence_estimate.toLocaleString()} estimated

### Strongest documented non-sports signal

Denominator: ${summary.flagship_known.toLocaleString()} profiles with a known non-sports flagship.

${countBullets(summary.flagship_categories, summary.flagship_known)}

### Non-sports multi-activity prevalence

Denominator: all ${summary.students.toLocaleString()} retained profiles. A student may appear in multiple categories.

${countBullets(summary.activity_prevalence, summary.students)}
`;
}

function assertView(rows, strict = false) {
  if (rows.some((row) => row.activities.some((activity) => activity.category === noSportsCategory))) {
    throw new Error("A no-sports view still contains a varsity_sport activity.");
  }
  if (rows.some((row) => row.flagship_category === noSportsCategory)) {
    throw new Error("A no-sports view still contains a varsity_sport flagship.");
  }
  if (strict && rows.some((row) => row.source_frame === athleticsSourceFrame)) {
    throw new Error("The strict no-sports view still contains an MIT Athletics source row.");
  }
}

const release = JSON.parse(await fs.readFile(sourcePath, "utf8"));
if (!Array.isArray(release.mit_students)) {
  throw new Error("data/combined_data.json does not contain mit_students.");
}

const indexedRows = indexSourceRows(release.mit_students);
const allNoSports = indexedRows.map(removeSportsFromProfile);
const strictNoSports = allNoSports.filter(
  (row) => row.source_frame !== athleticsSourceFrame,
);
const underclassAllNoSports = allNoSports.filter((row) =>
  [2028, 2029].includes(row.mit_class_year),
);
const underclassStrictNoSports = strictNoSports.filter((row) =>
  [2028, 2029].includes(row.mit_class_year),
);

assertView(allNoSports);
assertView(strictNoSports, true);
assertView(underclassAllNoSports);
assertView(underclassStrictNoSports, true);

const views = {
  all_profiles_sports_activities_removed: summarizeCohort(allNoSports),
  strict_non_athletics_source_sports_activities_removed:
    summarizeCohort(strictNoSports),
  underclass_all_profiles_sports_activities_removed:
    summarizeCohort(underclassAllNoSports),
  underclass_strict_non_athletics_source_sports_activities_removed:
    summarizeCohort(underclassStrictNoSports),
};

const summary = {
  generated_at: new Date().toISOString(),
  source_generated_at: release.summary?.generated_at ?? null,
  source_file: "data/combined_data.json",
  definitions: {
    all_profiles_sports_activities_removed:
      "Keeps every verified MIT profile, removes every activity coded varsity_sport, and recomputes a non-sports flagship when necessary.",
    strict_non_athletics_source_sports_activities_removed:
      "Also removes every profile whose mutually exclusive source frame is MIT athletics roster. This addresses source-frame bias but discards any independently documented non-sports activities attached to those profiles.",
  },
  sensitivity_assumptions: {
    debate_underdocumentation_factor: debateUnderdocumentationFactor,
    scope:
      "Reporting-only arithmetic estimate for non-public protected debate records; observed row-level data remain unchanged.",
    independently_auditable_from_release: false,
  },
  views,
  cautions: [
    "The all-profiles view still inherits the unusually detailed documentation in MIT Athletics biographies.",
    "The strict view changes the cohort by removing athletics-source profiles and is not a random or population-representative sample.",
    "Removing sports records does not identify why MIT admitted anyone or estimate the effect of an activity on admission.",
    "A missing activity means not found in the public sources reviewed, not that the student did not do it.",
  ],
};

const allStudentsFlat = flattenStudents(allNoSports);
const allActivitiesFlat = flattenActivities(allNoSports);
const underclassAllStudentsFlat = flattenStudents(underclassAllNoSports);
const underclassAllActivitiesFlat = flattenActivities(underclassAllNoSports);
const strictStudentsFlat = flattenStudents(strictNoSports);
const strictActivitiesFlat = flattenActivities(strictNoSports);
const underclassStrictStudentsFlat = flattenStudents(underclassStrictNoSports);
const underclassStrictActivitiesFlat = flattenActivities(underclassStrictNoSports);
const tables = summaryTableRows(views);

const report = `# MIT Ready sports-excluded sensitivity views

Generated ${summary.generated_at.slice(0, 10)} from the normalized public-evidence release.

## Why there are two views

“Exclude sports” can mean two different things. The activity-excluded view keeps all verified students but removes every \`varsity_sport\` activity and recomputes affected flagships. The strict view additionally removes every profile whose source frame is an MIT Athletics roster. Reporting both prevents activity exclusion from being confused with removal of athletics-source sampling bias.

## Executive read

- The all-profiles view retains ${views.all_profiles_sports_activities_removed.students.toLocaleString()} students and removes ${views.all_profiles_sports_activities_removed.sports_activity_records_removed.toLocaleString()} sports activity records from ${views.all_profiles_sports_activities_removed.profiles_with_sports_activity_removed.toLocaleString()} profiles.
- After sports activities are removed, ${views.all_profiles_sports_activities_removed.profiles_with_documented_non_sports_activities.toLocaleString()} profiles still have at least one sourced non-sports activity.
- The strict view removes all ${views.all_profiles_sports_activities_removed.athletics_source_rows.toLocaleString()} MIT Athletics source rows and retains ${views.strict_non_athletics_source_sports_activities_removed.students.toLocaleString()} profiles.
- The strict view is the stronger source-bias sensitivity check, but it also discards legitimate non-sports evidence attached to athlete biographies. Neither view is population-representative.
- Debate sections show observed counts alongside a reporting-only 50% underdocumentation sensitivity for non-public protected records. The multiplier does not change the row-level release.

${reportSection(
  "All verified profiles, sports activities removed",
  views.all_profiles_sports_activities_removed,
)}
${reportSection(
  "Strict non-athletics-source view, sports activities removed",
  views.strict_non_athletics_source_sports_activities_removed,
)}
${reportSection(
  "Classes 2028–2029, all profiles with sports activities removed",
  views.underclass_all_profiles_sports_activities_removed,
)}
${reportSection(
  "Classes 2028–2029, strict non-athletics-source view",
  views.underclass_strict_non_athletics_source_sports_activities_removed,
)}
## Interpretation limits

- The all-profiles view removes sports as an activity category, not the documentation advantage of athletics biographies.
- The strict view removes the largest documentation-heavy source frame, but it also changes the observed cohort and can undercount athletes' non-sports accomplishments.
- Percentages describe this public-evidence sample only. They are not estimates of MIT admission preferences or activity prevalence among all MIT students.

## Output files

- \`data/no_sports/mit_students_no_sports.csv\`
- \`data/no_sports/mit_activities_no_sports.csv\`
- \`data/no_sports/mit_underclass_2028_2029_no_sports.csv\`
- \`data/no_sports/mit_underclass_activities_no_sports.csv\`
- \`data/no_sports/mit_students_strict_no_sports.csv\`
- \`data/no_sports/mit_activities_strict_no_sports.csv\`
- \`data/no_sports/mit_underclass_2028_2029_strict_no_sports.csv\`
- \`data/no_sports/mit_underclass_activities_strict_no_sports.csv\`
- \`data/no_sports/summary_no_sports.json\`
- \`data/no_sports/summary_no_sports_tables.csv\`
- \`data/no_sports/combined_no_sports.json\`
`;

await fs.mkdir(outputDir, { recursive: true });
const writeCsv = async (name, rows, fallbackColumns) => {
  const columns = Object.keys(rows[0] ?? Object.fromEntries(fallbackColumns.map((column) => [column, ""])));
  await fs.writeFile(path.join(outputDir, name), toCsv(rows, columns));
};

await writeCsv("mit_students_no_sports.csv", allStudentsFlat, ["mit_id"]);
await writeCsv("mit_activities_no_sports.csv", allActivitiesFlat, ["activity_id"]);
await writeCsv(
  "mit_underclass_2028_2029_no_sports.csv",
  underclassAllStudentsFlat,
  ["mit_id"],
);
await writeCsv(
  "mit_underclass_activities_no_sports.csv",
  underclassAllActivitiesFlat,
  ["activity_id"],
);
await writeCsv("mit_students_strict_no_sports.csv", strictStudentsFlat, ["mit_id"]);
await writeCsv("mit_activities_strict_no_sports.csv", strictActivitiesFlat, ["activity_id"]);
await writeCsv(
  "mit_underclass_2028_2029_strict_no_sports.csv",
  underclassStrictStudentsFlat,
  ["mit_id"],
);
await writeCsv(
  "mit_underclass_activities_strict_no_sports.csv",
  underclassStrictActivitiesFlat,
  ["activity_id"],
);
await fs.writeFile(
  path.join(outputDir, "summary_no_sports.json"),
  JSON.stringify(summary, null, 2),
);
await writeCsv(
  "summary_no_sports_tables.csv",
  tables,
  ["view", "section", "label", "count", "denominator", "share", "note"],
);
await fs.writeFile(
  path.join(outputDir, "combined_no_sports.json"),
  JSON.stringify(
    {
      summary,
      all_profiles_sports_activities_removed: allNoSports,
      strict_non_athletics_source_sports_activities_removed: strictNoSports,
    },
    null,
    2,
  ),
);
await fs.writeFile(path.join(projectDir, "REPORT_NO_SPORTS.md"), report);

console.log(
  JSON.stringify(
    {
      all_profiles: allNoSports.length,
      sports_activity_records_removed:
        views.all_profiles_sports_activities_removed.sports_activity_records_removed,
      strict_profiles: strictNoSports.length,
      athletics_source_profiles_removed:
        views.all_profiles_sports_activities_removed.athletics_source_rows,
      output_directory: path.relative(projectDir, outputDir),
    },
    null,
    2,
  ),
);
