import { PROFILES } from "./data";

function countAxisAnswers(answers, keys) {
  let a = 0;
  let b = 0;

  keys.forEach((key) => {
    if (answers[key] === "A") a += 1;
    if (answers[key] === "B") b += 1;
  });

  return { a, b, total: a + b };
}

function detectAxis(counts, leftValue, rightValue, neutralValue = "équilibré") {
  if (counts.total === 0) return neutralValue;
  if (counts.a > counts.b) return leftValue;
  if (counts.b > counts.a) return rightValue;
  return neutralValue;
}

function detectContrast(counts) {
  if (counts.total === 0) return "équilibré";

  if (counts.b > counts.a) {
    if (counts.b - counts.a >= 1) return "fort";
    return "modéré";
  }

  if (counts.a > counts.b) {
    if (counts.a - counts.b >= 1) return "faible";
    return "modéré";
  }

  return "modéré";
}

function normalizeProfileValue(profileValue) {
  if (!profileValue) return "moyen";
  return profileValue;
}

function scoreAxis(expected, actual, axisName) {
  if (!expected || !actual) return 0;
  if (actual === "équilibré") return 0;

  if (expected === actual) {
    if (axisName === "temperature") return 4;
    if (axisName === "value") return 3;
    if (axisName === "intensity") return 3;
    if (axisName === "contrast") return 2;
    return 1;
  }

  if (axisName === "contrast") {
    const nearPairs = [
      ["fort", "modéré"],
      ["modéré", "fort"],
      ["faible", "modéré"],
      ["modéré", "faible"],
    ];

    const near = nearPairs.some(([a, b]) => expected === a && actual === b);
    if (near) return 1;
  }

  return 0;
}

function scoreProfile(profile, axes) {
  let score = 0;
  const profileAxes = profile?.axes || {};

  score += scoreAxis(profileAxes.temperature, axes.temperature, "temperature");
  score += scoreAxis(normalizeProfileValue(profileAxes.value), axes.value, "value");
  score += scoreAxis(profileAxes.intensity, axes.intensity, "intensity");
  score += scoreAxis(profileAxes.contrast, axes.contrast, "contrast");

  return score;
}

function getObservationBonus(profileAxes, observationAxes) {
  if (!observationAxes) return 0;

  let bonus = 0;

  // ✅ température = le plus important
  if (
    observationAxes.temperature &&
    observationAxes.temperature !== "indéterminée" &&
    observationAxes.temperature === profileAxes.temperature
  ) {
    bonus += 2; // 🔥 au lieu de 1
  }

  // ✅ intensité
  if (
    observationAxes.intensity &&
    observationAxes.intensity !== "indéterminée" &&
    observationAxes.intensity === profileAxes.intensity
  ) {
    bonus += 1;
  }

  // ✅ contraste
  if (
    observationAxes.contrast &&
    observationAxes.contrast !== "indéterminée" &&
    observationAxes.contrast === profileAxes.contrast
  ) {
    bonus += 1;
  }

  return bonus;
}

function compareObservation(observation, axes) {
  const checks = [];

  if (observation.temperature && observation.temperature !== "indéterminée") {
    checks.push({
      axis: "Température",
      observation: observation.temperature,
      calculated: axes.temperature,
      match: observation.temperature === axes.temperature,
    });
  }

  if (observation.intensity && observation.intensity !== "indéterminée") {
    checks.push({
      axis: "Intensité",
      observation: observation.intensity,
      calculated: axes.intensity,
      match:
        observation.intensity === axes.intensity ||
        (observation.intensity === "modéré" && axes.intensity === "doux"),
    });
  }

  if (observation.contrast && observation.contrast !== "indéterminée") {
    checks.push({
      axis: "Contraste",
      observation: observation.contrast,
      calculated: axes.contrast,
      match:
        observation.contrast === axes.contrast ||
        (observation.contrast === "modéré" && axes.contrast === "faible"),
    });
  } // ✅ CETTE ACCOLADE MANQUAIT

  const matches = checks.filter((x) => x.match).length;
  const mismatches = checks.filter((x) => !x.match).length;

  let confidence = "Moyen";

  if (checks.length === 0) confidence = "Moyen";
  else if (mismatches >= 2) confidence = "À revalider";
  else if (mismatches === 1) confidence = "Moyen";
  else if (matches >= 2) confidence = "Fort";

  return {
    checks,
    matches,
    mismatches,
    confidence,
  };
}


function buildConfidence(primaryScore, secondaryScore, observationCheck) {
  const gap = primaryScore - secondaryScore;

  let confidenceLabel = "Moyen";
  let confidenceScore = 60;

  if (gap >= 4) {
    confidenceLabel = "Fort";
    confidenceScore = 85;
  } else if (gap <= 1) {
    confidenceLabel = "À confirmer";
    confidenceScore = 45;
  }
  
  // ✅ AJOUT ICI
  if (observationCheck.confidence === "Fort") {
    confidenceScore += 15;
  
    if (confidenceLabel !== "Fort") {
      confidenceLabel = "Moyen";
    }
  }
  

  if (observationCheck.confidence === "À revalider") {
    confidenceScore -= 10;
    confidenceLabel = "À revalider";
  }

  if (confidenceScore > 95) confidenceScore = 95;
  if (confidenceScore < 20) confidenceScore = 20;

  return {
    confidenceLabel,
    confidenceScore,
    scoreGap: gap,
  };
}

export function getProfile(answers, observation = {}) {
  const tempCounts = countAxisAnswers(answers, ["A1", "A2", "A3", "A4"]);
const valueCounts = countAxisAnswers(answers, ["B1", "B2", "B3"]);
const intensityCounts = countAxisAnswers(answers, ["C1", "C2", "C3"]);
const contrastCounts = countAxisAnswers(answers, ["D1", "D2"]);


  const axes = {
    temperature: detectAxis(tempCounts, "chaud", "froid"),
    value: detectAxis(valueCounts, "clair", "profond", "moyen"),
    intensity: detectAxis(intensityCounts, "doux", "vif"),
    contrast: detectContrast(contrastCounts),
  };

  const observationState = {
    temperature: observation.temperature || "indéterminée",
    intensity: observation.intensity || "indéterminée",
    contrast: observation.contrast || "indéterminée",
    value: "indéterminée",
  };


  const visibleProfiles = PROFILES.filter((profile) => !profile.hidden);

  const profileScores = visibleProfiles
    .map((profile) => {
      const baseScore = scoreProfile(profile, axes);
      const observationBonus = getObservationBonus(profile.axes, observationState);

      return {
        name: profile.name,
        profile,
        score: baseScore + observationBonus,
        baseScore,
        observationBonus,
      };
    })
    .sort((a, b) => b.score - a.score);

  const primary = profileScores[0] || null;
  const secondary = profileScores[1] || null;

  const observationCheck = compareObservation(observationState, axes);
  const confidence = buildConfidence(
    primary?.score || 0,
    secondary?.score || 0,
    observationCheck
  );

  return {
    profileName: primary?.name || null,
    profile: primary?.profile || null,

    secondaryProfileName: secondary?.name || null,
    secondaryProfile: secondary?.profile || null,

    axes,
    observation: observationState,
    observationCheck,

    confidenceLabel: confidence.confidenceLabel,
    confidenceScore: confidence.confidenceScore,
    scoreGap: confidence.scoreGap,

    scores: profileScores,

    rawCounts: {
      temperature: tempCounts,
      value: valueCounts,
      intensity: intensityCounts,
      contrast: contrastCounts,
    },
  };
}