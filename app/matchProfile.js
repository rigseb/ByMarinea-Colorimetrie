import { PROFILES } from "./data";

function roundScore(value) {
  return Number((value ?? 0).toFixed(2));
}

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

function detectValue(counts) {
  if (counts.total === 0) return "indéterminée";
  if (counts.a === counts.total) return "clair";
  if (counts.b === counts.total) return "profond";
  return "moyen";
}

function detectIntensity(counts) {
  if (counts.total === 0) return "indéterminée";
  if (counts.a === counts.total) return "doux";
  if (counts.b === counts.total) return "vif";
  return "modéré";
}

function detectContrastFromCrossedAnswers(answers) {
  const d1 = answers?.D1;
  const d2 = answers?.D2;

  if (!d1 && !d2) return "équilibré";
  if (!d1 || !d2) return "modéré";

  // D1 : Noir (A) vs Blanc pur (B)
  // D2 : Ivoire (A) vs Chocolat (B)
  //
  // Table retenue :
  // B + B = fort
  // A + A = faible
  // A + B = modéré
  // B + A = modéré

  if (d1 === "B" && d2 === "B") return "fort";
  if (d1 === "A" && d2 === "A") return "faible";
  if (d1 === "A" && d2 === "B") return "modéré";
  if (d1 === "B" && d2 === "A") return "modéré";

  return "modéré";
}

function normalizeProfileValue(profileValue) {
  if (!profileValue) return "moyen";
  return profileValue;
}

function normalizeProfileIntensity(profileIntensity) {
  if (!profileIntensity) return "modéré";
  return profileIntensity;
}

function scoreAxis(expected, actual, axisName) {
  if (!expected || !actual) return 0;
  if (actual === "équilibré" || actual === "indéterminée") return 0;

  // Match exact
  if (expected === actual) {
    if (axisName === "temperature") return 5;
    if (axisName === "value") return 2.4;
    if (axisName === "intensity") return 3.4;
    if (axisName === "contrast") return 2.4;
    return 1;
  }

  // Proximités calibrées
  if (axisName === "value") {
    const nearPairs = [
      ["clair", "moyen"],
      ["moyen", "clair"],
      ["profond", "moyen"],
      ["moyen", "profond"],
    ];
    const near = nearPairs.some(([a, b]) => expected === a && actual === b);
    if (near) return 1.15;
  }

  if (axisName === "intensity") {
    // On garde un léger avantage au vif/modéré pour aider Printemps Chaud,
    // mais on réduit un peu l'écart pour ne pas sur-montrer le lumineux.
    if (expected === "vif" && actual === "modéré") return 1.85;
    if (expected === "doux" && actual === "modéré") return 1.65;
    if (expected === "modéré" && actual === "vif") return 1.7;
    if (expected === "modéré" && actual === "doux") return 1.55;
  }

  if (axisName === "contrast") {
    // Modéré favorise franchement modéré,
    // tolère faible, et tolère moins fort qu'avant.
    if (expected === "faible" && actual === "modéré") return 0.9;
    if (expected === "fort" && actual === "modéré") return 0.25;
    if (expected === "modéré" && actual === "faible") return 0.9;
    if (expected === "modéré" && actual === "fort") return 0.4;
  }

  return 0;
}

function scoreProfile(profile, axes) {
  let score = 0;
  const profileAxes = profile?.axes || {};

  score += scoreAxis(profileAxes.temperature, axes.temperature, "temperature");
  score += scoreAxis(
    normalizeProfileValue(profileAxes.value),
    axes.value,
    "value"
  );
  score += scoreAxis(
    normalizeProfileIntensity(profileAxes.intensity),
    axes.intensity,
    "intensity"
  );
  score += scoreAxis(profileAxes.contrast, axes.contrast, "contrast");

  return score;
}

function getObservationBonus(profileAxes, observationAxes) {
  if (!observationAxes) return 0;

  let bonus = 0;

  // Température = axe principal
  if (
    observationAxes.temperature &&
    observationAxes.temperature !== "indéterminée" &&
    observationAxes.temperature === profileAxes.temperature
  ) {
    bonus += 2;
  }

  // Reflets cheveux
  if (
    observationAxes.hairTemperature &&
    observationAxes.hairTemperature !== "indéterminée" &&
    observationAxes.hairTemperature !== "neutre" &&
    observationAxes.hairTemperature === profileAxes.temperature
  ) {
    bonus += 1;
  }

  // Valeur observée
  if (observationAxes.value && observationAxes.value !== "indéterminée") {
    const profileValue = normalizeProfileValue(profileAxes.value);

    if (observationAxes.value === profileValue) {
      bonus += 0.7;
    } else {
      const nearValue =
        (observationAxes.value === "clair" && profileValue === "moyen") ||
        (observationAxes.value === "moyen" && profileValue === "clair") ||
        (observationAxes.value === "profond" && profileValue === "moyen") ||
        (observationAxes.value === "moyen" && profileValue === "profond");

      if (nearValue) bonus += 0.45;
    }
  }

  // Intensité observée
  if (observationAxes.intensity && observationAxes.intensity !== "indéterminée") {
    const profileIntensity = normalizeProfileIntensity(profileAxes.intensity);

    if (observationAxes.intensity === profileIntensity) {
      bonus += 1;
    } else {
      // Modéré aide encore le vif, mais on donne aussi un peu plus au doux
      // pour ne pas sous-estimer Automne Doux.
      if (observationAxes.intensity === "modéré" && profileIntensity === "vif") {
        bonus += 0.65;
      } else if (
        observationAxes.intensity === "modéré" &&
        profileIntensity === "doux"
      ) {
        bonus += 0.5;
      } else if (
        profileIntensity === "modéré" &&
        (observationAxes.intensity === "doux" || observationAxes.intensity === "vif")
      ) {
        bonus += 0.45;
      }
    }
  }

  // Contraste observé
  if (observationAxes.contrast && observationAxes.contrast !== "indéterminée") {
    const profileContrast = profileAxes.contrast;

    if (observationAxes.contrast === profileContrast) {
      bonus += 1;
    } else {
      // Modéré soutient davantage faible que fort
      if (observationAxes.contrast === "modéré" && profileContrast === "faible") {
        bonus += 0.5;
      } else if (
        observationAxes.contrast === "faible" &&
        profileContrast === "modéré"
      ) {
        bonus += 0.4;
      } else if (
        observationAxes.contrast === "modéré" &&
        profileContrast === "fort"
      ) {
        bonus += 0;
      }
    }
  }

  return bonus;
}

function getObservationPenalty(profileAxes, observationAxes) {
  if (!observationAxes) return 0;

  let penalty = 0;

  // Contradiction forte température
  if (
    observationAxes.temperature &&
    observationAxes.temperature !== "indéterminée" &&
    observationAxes.temperature !== profileAxes.temperature
  ) {
    penalty += 4;
  }

  // Contradiction cheveux
  if (
    observationAxes.hairTemperature &&
    observationAxes.hairTemperature !== "indéterminée" &&
    observationAxes.hairTemperature !== "neutre" &&
    observationAxes.hairTemperature !== profileAxes.temperature
  ) {
    penalty += 2;
  }

  // Valeur : on pénalise surtout clair vs profond
  if (observationAxes.value && observationAxes.value !== "indéterminée") {
    const profileValue = normalizeProfileValue(profileAxes.value);

    const hardMismatch =
      (observationAxes.value === "clair" && profileValue === "profond") ||
      (observationAxes.value === "profond" && profileValue === "clair");

    if (hardMismatch) penalty += 1.25;
  }

  // Intensité : modéré n'est pas une contradiction forte
  if (observationAxes.intensity && observationAxes.intensity !== "indéterminée") {
    const profileIntensity = normalizeProfileIntensity(profileAxes.intensity);

    const hardMismatch =
      (observationAxes.intensity === "doux" && profileIntensity === "vif") ||
      (observationAxes.intensity === "vif" && profileIntensity === "doux");

    if (hardMismatch) penalty += 1;
  }

  // Contraste : modéré vs fort est gênant,
  // modéré vs faible reste tolérable
  if (observationAxes.contrast && observationAxes.contrast !== "indéterminée") {
    const profileContrast = profileAxes.contrast;

    const hardMismatch =
      (observationAxes.contrast === "faible" && profileContrast === "fort") ||
      (observationAxes.contrast === "fort" && profileContrast === "faible") ||
      (observationAxes.contrast === "modéré" && profileContrast === "fort");

    if (hardMismatch) penalty += 1.2;
  }

  return penalty;
}

function applyUltraFinalTuning(profile, axes, observationAxes) {
  let tuning = 0;
  const profileAxes = profile?.axes || {};
  const profileValue = normalizeProfileValue(profileAxes.value);
  const profileIntensity = normalizeProfileIntensity(profileAxes.intensity);
  const profileContrast = profileAxes.contrast;

  // On ne touche qu'aux profils chauds pour ne pas casser les profils froids
  if (axes.temperature !== "chaud") return tuning;

  // 1) Favoriser légèrement Printemps Chaud quand on est
  // chaud + moyen + modéré + modéré
  if (
    axes.value === "moyen" &&
    axes.intensity === "modéré" &&
    axes.contrast === "modéré"
  ) {
    if (
      profileAxes.temperature === "chaud" &&
      profileValue === "moyen" &&
      profileIntensity === "vif" &&
      profileContrast === "modéré"
    ) {
      tuning += 0.35;
    }
  }

  // 2) Calmer un peu les profils forts si le contraste calculé n'est pas fort
  if (axes.contrast === "modéré" && profileContrast === "fort") {
    tuning -= 0.35;
  }

  // 3) Aider légèrement Automne Doux si on est chaud + moyen/clair + modéré
  if (
    axes.temperature === "chaud" &&
    (axes.value === "moyen" || axes.value === "clair") &&
    observationAxes?.intensity === "modéré" &&
    observationAxes?.contrast === "modéré"
  ) {
    if (
      profileAxes.temperature === "chaud" &&
      profileValue === "moyen" &&
      profileIntensity === "doux" &&
      profileContrast === "faible"
    ) {
      tuning += 0.25;
    }
  }

  // 4) Réduire légèrement Automne Chaud si l'observation ne confirme pas le profond
  if (
    profileAxes.temperature === "chaud" &&
    profileValue === "profond" &&
    profileIntensity === "vif" &&
    observationAxes?.value === "clair"
  ) {
    tuning -= 0.3;
  }

  return tuning;
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

  if (
    observation.hairTemperature &&
    observation.hairTemperature !== "indéterminée" &&
    observation.hairTemperature !== "neutre"
  ) {
    checks.push({
      axis: "Reflets cheveux",
      observation: observation.hairTemperature,
      calculated: axes.temperature,
      match: observation.hairTemperature === axes.temperature,
    });
  }

  if (observation.value && observation.value !== "indéterminée") {
    checks.push({
      axis: "Valeur",
      observation: observation.value,
      calculated: axes.value,
      match:
        observation.value === axes.value ||
        (observation.value === "clair" && axes.value === "moyen") ||
        (observation.value === "moyen" && axes.value === "clair") ||
        (observation.value === "profond" && axes.value === "moyen") ||
        (observation.value === "moyen" && axes.value === "profond"),
    });
  }

  if (observation.intensity && observation.intensity !== "indéterminée") {
    checks.push({
      axis: "Intensité",
      observation: observation.intensity,
      calculated: axes.intensity,
      match:
        observation.intensity === axes.intensity ||
        (observation.intensity === "modéré" &&
          (axes.intensity === "doux" || axes.intensity === "vif")) ||
        (axes.intensity === "modéré" &&
          (observation.intensity === "doux" || observation.intensity === "vif")),
    });
  }

  if (observation.contrast && observation.contrast !== "indéterminée") {
    checks.push({
      axis: "Contraste",
      observation: observation.contrast,
      calculated: axes.contrast,
      match:
        observation.contrast === axes.contrast ||
        (observation.contrast === "modéré" && axes.contrast === "faible") ||
        (observation.contrast === "faible" && axes.contrast === "modéré"),
    });
  }

  const matches = checks.filter((x) => x.match).length;
  const mismatches = checks.filter((x) => !x.match).length;

  let confidence = "Moyen";

  if (checks.length === 0) confidence = "Moyen";
  else if (mismatches >= 2) confidence = "À revalider";
  else if (mismatches === 1) confidence = "Moyen";
  else if (matches >= 3) confidence = "Fort";

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

  if (confidenceScore > 95) confidenceScore = 100;
  if (confidenceScore < 20) confidenceScore = 20;

  if (observationCheck.confidence === "Fort" && primaryScore - secondaryScore >= 3) {
    confidenceScore = 100;
    confidenceLabel = "Fort";
  }

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
    value: detectValue(valueCounts),
    intensity: detectIntensity(intensityCounts),
    contrast: detectContrastFromCrossedAnswers(answers),
  };

  const observationState = {
    temperature: observation.temperature || "indéterminée",
    hairTemperature: observation.hairTemperature || "indéterminée",
    intensity: observation.intensity || "indéterminée",
    contrast: observation.contrast || "indéterminée",
    value: observation.value || "indéterminée",
  };

  const visibleProfiles = PROFILES.filter((profile) => !profile.hidden);

  const profileScores = visibleProfiles
    .map((profile) => {
      const baseScore = scoreProfile(profile, axes);
      const observationBonus = getObservationBonus(profile.axes, observationState);
      const observationPenalty = getObservationPenalty(profile.axes, observationState);
      const tuningBonus = applyUltraFinalTuning(profile, axes, observationState);

      const finalScore = Math.max(
        0,
        baseScore + observationBonus - observationPenalty + tuningBonus
      );

      return {
        name: profile.name,
        profile,
        score: roundScore(finalScore),
        baseScore: roundScore(baseScore),
        observationBonus: roundScore(observationBonus),
        observationPenalty: roundScore(observationPenalty),
        tuningBonus: roundScore(tuningBonus),
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

  const gap = (primary?.score || 0) - (secondary?.score || 0);

  const secondaryConfidenceScore = secondary
    ? Math.max(30, confidence.confidenceScore - gap * 15)
    : 0;

  return {
    profileName: primary?.name || null,
    profile: primary?.profile || null,
    secondaryProfileName: secondary?.name || null,
    secondaryProfile: secondary?.profile || null,
    secondaryConfidenceScore: roundScore(secondaryConfidenceScore),
    axes,
    observation: observationState,
    observationCheck,
    confidenceLabel: confidence.confidenceLabel,
    confidenceScore: roundScore(confidence.confidenceScore),
    scoreGap: roundScore(confidence.scoreGap),
    scores: profileScores,
    rawCounts: {
      temperature: tempCounts,
      value: valueCounts,
      intensity: intensityCounts,
      contrast: contrastCounts,
    },
  };
}
