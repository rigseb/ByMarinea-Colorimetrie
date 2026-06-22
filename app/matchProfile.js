import { PROFILES } from "./data";

const AXIS_WEIGHTS = {
  temperature: 7,
  value: 3,
  intensity: 4,
  contrast: 5,
};

const MATRIX_RULES = {
  "Hiver Lumineux": {
    required: { temperature: "froid", contrast: "fort", intensity: "vif" },
    preferred: { value: "clair" },
    familyBonus: 6.2,
    exactBonus: 3.6,
    antiBonus: { lowContrast: -3.5, softIntensity: -2.8 },
  },
  "Hiver Froid": {
    required: { temperature: "froid", contrast: "fort", intensity: "vif" },
    preferred: { value: "moyen" },
    familyBonus: 5.8,
    exactBonus: 3.2,
    antiBonus: { lowContrast: -3.2, softIntensity: -2.5 },
  },
  "Hiver Profond": {
    required: { temperature: "froid", contrast: "fort", intensity: "vif" },
    preferred: { value: "profond" },
    familyBonus: 5.0,
    exactBonus: 2.2,
    antiBonus: { lowContrast: -3.2, softIntensity: -2.5 },
  },

  "Été Clair": {
    required: { temperature: "froid", contrast: "faible", intensity: "doux" },
    preferred: { value: "clair" },
    familyBonus: 4.2,
    exactBonus: 2.4,
    antiBonus: { highContrast: -3.4, vividIntensity: -3.2 },
  },
  "Été Doux": {
    required: { temperature: "froid", contrast: "faible", intensity: "doux" },
    preferred: { value: "moyen" },
    familyBonus: 4.0,
    exactBonus: 2.1,
    antiBonus: { highContrast: -3.4, vividIntensity: -3.0 },
  },
  "Été Froid": {
    required: { temperature: "froid", contrast: "modéré" },
    preferred: { value: "moyen", intensity: "vif" },
    familyBonus: 2.4,
    exactBonus: 1.7,
    antiBonus: { highContrast: -4.2, lowContrast: -1.1 },
  },

  "Printemps Clair": {
    required: { temperature: "chaud", contrast: "faible" },
    preferred: { value: "clair", intensity: "doux" },
    familyBonus: 4.2,
    exactBonus: 2.4,
    antiBonus: { highContrast: -2.5 },
  },
  "Printemps Chaud": {
    required: { temperature: "chaud", contrast: "modéré" },
    preferred: { value: "moyen", intensity: "vif" },
    familyBonus: 3.9,
    exactBonus: 2.3,
    antiBonus: { lowContrast: -1.4 },
  },
  "Printemps Lumineux": {
    required: { temperature: "chaud", contrast: "fort", intensity: "vif" },
    preferred: { value: "clair" },
    familyBonus: 5.1,
    exactBonus: 2.9,
    antiBonus: { softIntensity: -2.3 },
  },

  "Automne Doux": {
    required: { temperature: "chaud", contrast: "faible", intensity: "doux" },
    preferred: { value: "moyen" },
    familyBonus: 4.2,
    exactBonus: 2.2,
    antiBonus: { highContrast: -2.5, vividIntensity: -2.2 },
  },
  "Automne Chaud": {
    required: { temperature: "chaud", contrast: "modéré" },
    preferred: { value: "profond", intensity: "vif" },
    familyBonus: 3.9,
    exactBonus: 2.3,
    antiBonus: { lowContrast: -1.4 },
  },
  "Automne Profond": {
    required: { temperature: "chaud", contrast: "fort" },
    preferred: { value: "profond", intensity: "doux" },
    familyBonus: 4.4,
    exactBonus: 2.5,
    antiBonus: { vividIntensity: -1.1 },
  },
};

function roundScore(value) {
  return Number((value ?? 0).toFixed(2));
}

function countAxisAnswers(answers, keys) {
  let a = 0;
  let b = 0;

  keys.forEach((key) => {
    if (answers?.[key] === "A") a += 1;
    if (answers?.[key] === "B") b += 1;
  });

  return { a, b, total: a + b };
}

function detectAxis(counts, leftValue, rightValue, neutralValue = "équilibré") {
  if (!counts?.total) return neutralValue;
  if (counts.a > counts.b) return leftValue;
  if (counts.b > counts.a) return rightValue;
  return neutralValue;
}

function detectValue(counts) {
  if (!counts?.total) return "indéterminée";
  if (counts.a === counts.total) return "clair";
  if (counts.b === counts.total) return "profond";
  return "moyen";
}

function detectIntensity(counts) {
  if (!counts?.total) return "indéterminée";
  if (counts.a === counts.total) return "doux";
  if (counts.b === counts.total) return "vif";
  return "modéré";
}

function detectContrastFromCrossedAnswers(answers) {
  const d1 = answers?.D1;
  const d2 = answers?.D2;

  if (!d1 && !d2) return "équilibré";
  if (!d1 || !d2) return "modéré";

  // D1 = Noir (A) / Blanc pur (B)
  // D2 = Ivoire (A) / Chocolat (B)
  //
  // Nouvelle logique :
  // - D1 pilote le niveau de contraste
  // - D2 affine seulement le rendu
  //
  // A + B = Noir + Chocolat => fort
  // A + A = Noir + Ivoire   => fort
  // B + B = Blanc + Chocolat => modéré
  // B + A = Blanc + Ivoire   => faible
  if (d1 === "A" && d2 === "B") return "fort";
  if (d1 === "A" && d2 === "A") return "fort";
  if (d1 === "B" && d2 === "B") return "modéré";
  if (d1 === "B" && d2 === "A") return "faible";

  return "modéré";
}

function normalizeProfileValue(profileValue) {
  return profileValue || "moyen";
}

function normalizeProfileIntensity(profileIntensity) {
  return profileIntensity || "modéré";
}

function axisExactMatch(expected, actual) {
  return expected && actual && expected === actual;
}

function axisNearScore(axisName, expected, actual) {
  if (!expected || !actual) return 0;
  if (actual === "équilibré" || actual === "indéterminée") return 0;
  if (expected === actual) return AXIS_WEIGHTS[axisName] ?? 0;

  if (axisName === "value") {
    const nearPairs = new Set([
      "clair|moyen",
      "moyen|clair",
      "moyen|profond",
      "profond|moyen",
    ]);
    if (nearPairs.has(`${expected}|${actual}`)) return 1.5;
  }

  if (axisName === "intensity") {
    const nearPairs = new Set([
      "doux|modéré",
      "modéré|doux",
      "vif|modéré",
      "modéré|vif",
    ]);
    if (nearPairs.has(`${expected}|${actual}`)) return 2.0;
  }

  if (axisName === "contrast") {
    const nearPairs = new Set([
      "faible|modéré",
      "modéré|faible",
      "fort|modéré",
      "modéré|fort",
    ]);
    if (nearPairs.has(`${expected}|${actual}`)) return 1.6;
  }

  return 0;
}

function scoreProfileBase(profile, axes) {
  const profileAxes = profile?.axes || {};

  return (
    axisNearScore("temperature", profileAxes.temperature, axes.temperature) +
    axisNearScore("value", normalizeProfileValue(profileAxes.value), axes.value) +
    axisNearScore(
      "intensity",
      normalizeProfileIntensity(profileAxes.intensity),
      axes.intensity
    ) +
    axisNearScore("contrast", profileAxes.contrast, axes.contrast)
  );
}

function getObservationBonus(profileAxes, observationAxes) {
  if (!observationAxes) return 0;

  let bonus = 0;
  const profileValue = normalizeProfileValue(profileAxes.value);
  const profileIntensity = normalizeProfileIntensity(profileAxes.intensity);

  if (
    observationAxes.temperature &&
    observationAxes.temperature !== "indéterminée" &&
    observationAxes.temperature === profileAxes.temperature
  ) {
    bonus += 2.2;
  }

  if (
    observationAxes.hairTemperature &&
    observationAxes.hairTemperature !== "indéterminée" &&
    observationAxes.hairTemperature !== "neutre" &&
    observationAxes.hairTemperature === profileAxes.temperature
  ) {
    bonus += 1.3;
  }

  if (observationAxes.value && observationAxes.value !== "indéterminée") {
    if (observationAxes.value === profileValue) {
      bonus += 0.8;
    } else {
      const nearValue = new Set([
        "clair|moyen",
        "moyen|clair",
        "moyen|profond",
        "profond|moyen",
      ]);
      if (nearValue.has(`${observationAxes.value}|${profileValue}`)) {
        bonus += 0.35;
      }
    }
  }

  if (observationAxes.intensity && observationAxes.intensity !== "indéterminée") {
    if (observationAxes.intensity === profileIntensity) {
      bonus += 1.2;
    } else {
      const nearIntensity = new Set([
        "doux|modéré",
        "modéré|doux",
        "modéré|vif",
        "vif|modéré",
      ]);
      if (nearIntensity.has(`${observationAxes.intensity}|${profileIntensity}`)) {
        bonus += 0.45;
      }
    }
  }

  if (observationAxes.contrast && observationAxes.contrast !== "indéterminée") {
    if (observationAxes.contrast === profileAxes.contrast) {
      bonus += 1.4;
    } else {
      const nearContrast = new Set([
        "faible|modéré",
        "modéré|faible",
        "modéré|fort",
        "fort|modéré",
      ]);
      if (nearContrast.has(`${observationAxes.contrast}|${profileAxes.contrast}`)) {
        bonus += 0.35;
      }
    }
  }

  return bonus;
}

function getObservationPenalty(profileAxes, observationAxes) {
  if (!observationAxes) return 0;

  let penalty = 0;
  const profileValue = normalizeProfileValue(profileAxes.value);
  const profileIntensity = normalizeProfileIntensity(profileAxes.intensity);

  if (
    observationAxes.temperature &&
    observationAxes.temperature !== "indéterminée" &&
    observationAxes.temperature !== profileAxes.temperature
  ) {
    penalty += 4.8;
  }

  if (
    observationAxes.hairTemperature &&
    observationAxes.hairTemperature !== "indéterminée" &&
    observationAxes.hairTemperature !== "neutre" &&
    observationAxes.hairTemperature !== profileAxes.temperature
  ) {
    penalty += 2.4;
  }

  const hardValueMismatch = new Set(["clair|profond", "profond|clair"]);
  if (
    observationAxes.value &&
    observationAxes.value !== "indéterminée" &&
    hardValueMismatch.has(`${observationAxes.value}|${profileValue}`)
  ) {
    penalty += 1.2;
  }

  const hardIntensityMismatch = new Set(["doux|vif", "vif|doux"]);
  if (
    observationAxes.intensity &&
    observationAxes.intensity !== "indéterminée" &&
    hardIntensityMismatch.has(`${observationAxes.intensity}|${profileIntensity}`)
  ) {
    penalty += 1.2;
  }

  const hardContrastMismatch = new Set(["faible|fort", "fort|faible"]);
  if (
    observationAxes.contrast &&
    observationAxes.contrast !== "indéterminée" &&
    hardContrastMismatch.has(`${observationAxes.contrast}|${profileAxes.contrast}`)
  ) {
    penalty += 1.8;
  }

  return penalty;
}

function getMatrixSignatureBonus(profile, axes) {
  const profileAxes = profile?.axes || {};
  const rule = MATRIX_RULES[profile?.name];
  if (!rule) return { bonus: 0, details: [] };

  let bonus = 0;
  const details = [];

  const requiredEntries = Object.entries(rule.required || {});
  const preferredEntries = Object.entries(rule.preferred || {});

  const requiredMatches = requiredEntries.filter(([axis, value]) => axes?.[axis] === value).length;
  const requiredRatio = requiredEntries.length
    ? requiredMatches / requiredEntries.length
    : 0;

  if (requiredRatio === 1) {
    bonus += rule.familyBonus || 0;
    details.push(`signature familiale validée (+${roundScore(rule.familyBonus || 0)})`);
  } else if (requiredRatio >= 0.67) {
    const partial = roundScore((rule.familyBonus || 0) * 0.4);
    bonus += partial;
    details.push(`signature familiale partielle (+${partial})`);
  }

  const preferredMatches = preferredEntries.filter(([axis, value]) => axes?.[axis] === value).length;
  if (preferredEntries.length && preferredMatches === preferredEntries.length) {
    bonus += rule.exactBonus || 0;
    details.push(`sous-type exact (+${roundScore(rule.exactBonus || 0)})`);
  } else if (preferredEntries.length && preferredMatches > 0) {
    const partial = roundScore((rule.exactBonus || 0) * 0.45);
    bonus += partial;
    details.push(`sous-type partiel (+${partial})`);
  }

  if (rule.antiBonus?.highContrast && axes.contrast === "fort") {
    bonus += rule.antiBonus.highContrast;
    details.push(`ajustement fort contraste (${roundScore(rule.antiBonus.highContrast)})`);
  }
  if (rule.antiBonus?.lowContrast && axes.contrast === "faible") {
    bonus += rule.antiBonus.lowContrast;
    details.push(`ajustement faible contraste (${roundScore(rule.antiBonus.lowContrast)})`);
  }
  if (rule.antiBonus?.softIntensity && axes.intensity === "doux") {
    bonus += rule.antiBonus.softIntensity;
    details.push(`ajustement intensité douce (${roundScore(rule.antiBonus.softIntensity)})`);
  }
  if (rule.antiBonus?.vividIntensity && axes.intensity === "vif") {
    bonus += rule.antiBonus.vividIntensity;
    details.push(`ajustement intensité vive (${roundScore(rule.antiBonus.vividIntensity)})`);
  }

  const exactAxesCount = [
    axisExactMatch(profileAxes.temperature, axes.temperature),
    axisExactMatch(normalizeProfileValue(profileAxes.value), axes.value),
    axisExactMatch(normalizeProfileIntensity(profileAxes.intensity), axes.intensity),
    axisExactMatch(profileAxes.contrast, axes.contrast),
  ].filter(Boolean).length;

  if (exactAxesCount === 4) {
    bonus += 1.2;
    details.push("alignement 4 axes (+1.2)");
  }

  return { bonus, details };
}

function getHybridRuleBonus(profile, axes, observationAxes) {
  const name = profile?.name;
  let bonus = 0;
  const details = [];

  const observedContrast = observationAxes?.contrast;
  const observedIntensity = observationAxes?.intensity;
  const observedValue = observationAxes?.value;

  // =========================
  // FAMILLE HIVER
  // =========================
  if (axes.temperature === "froid" && axes.contrast === "fort" && axes.intensity === "vif") {
    if (["Hiver Lumineux", "Hiver Froid", "Hiver Profond"].includes(name)) {
      bonus += 5.2;
      details.push("famille hiver très dominante (+5.2)");
    }

    if (["Été Clair", "Été Doux"].includes(name)) {
      bonus -= 4.2;
      details.push("été incompatible avec fort + vif (-4.2)");
    }

    if (name === "Été Froid") {
      bonus -= 5.3;
      details.push("été froid fortement pénalisé si contraste fort (-5.3)");
    }

    if (axes.value === "clair") {
      if (name === "Hiver Lumineux") {
        bonus += 4.2;
        details.push("clair + hiver => hiver lumineux (+4.2)");
      }
      if (name === "Hiver Profond") {
        bonus -= 2.6;
        details.push("profond moins cohérent si valeur claire (-2.6)");
      }
    }

    if (axes.value === "moyen") {
      if (name === "Hiver Froid") {
        bonus += 4.8;
        details.push("moyen + froid + fort + vif => hiver froid (+4.8)");
      }
      if (name === "Hiver Lumineux") {
        bonus += 1.6;
        details.push("lumineux reste possible (+1.6)");
      }
      if (name === "Hiver Profond") {
        bonus -= 1.8;
        details.push("profond moins prioritaire avec valeur moyenne (-1.8)");
      }
    }

    if (axes.value === "profond") {
      if (name === "Hiver Profond") {
        bonus += 2.2;
        details.push("profond + hiver => hiver profond (+2.2)");
      }
      if (name === "Hiver Lumineux" && observedContrast === "fort" && observedIntensity === "vif") {
        bonus += 1.2;
        details.push("lumineux reste maintenu par contraste/intensité (+1.2)");
      }
    }
  }

  // =========================
  // FAMILLE ÉTÉ
  // =========================
  if (axes.temperature === "froid" && axes.contrast === "faible" && axes.intensity === "doux") {
    if (["Été Clair", "Été Doux", "Été Froid"].includes(name)) {
      bonus += 3.0;
      details.push("famille été activée (+3)");
    }

    if (["Hiver Lumineux", "Hiver Froid", "Hiver Profond"].includes(name)) {
      bonus -= 3.4;
      details.push("hiver trop fort pour signature été (-3.4)");
    }

    if (axes.value === "clair" && name === "Été Clair") {
      bonus += 3.0;
      details.push("clair + doux + froid => été clair (+3.0)");
    }

    if (axes.value === "moyen" && name === "Été Doux") {
      bonus += 2.5;
      details.push("moyen + doux + froid => été doux (+2.5)");
    }
  }

  if (axes.temperature === "froid" && axes.contrast === "modéré" && axes.intensity === "vif") {
    if (name === "Été Froid") {
      bonus += 2.0;
      details.push("été froid possible en froid + modéré + vif (+2.0)");
    }
    if (name === "Hiver Froid") {
      bonus += 1.2;
      details.push("hiver froid reste envisageable (+1.2)");
    }
  }

  // =========================
  // FAMILLE PRINTEMPS
  // =========================
  if (axes.temperature === "chaud" && axes.intensity === "vif") {
    if (["Printemps Clair", "Printemps Chaud", "Printemps Lumineux"].includes(name)) {
      bonus += 2.8;
      details.push("famille printemps activée (+2.8)");
    }

    if (["Automne Doux", "Automne Profond"].includes(name) && axes.contrast !== "fort") {
      bonus -= 1.2;
      details.push("automne moins probable sous intensité vive (-1.2)");
    }

    if (axes.contrast === "fort" && axes.value === "clair" && name === "Printemps Lumineux") {
      bonus += 2.8;
      details.push("chaud + clair + vif + fort => printemps lumineux (+2.8)");
    }

    if (axes.contrast === "modéré" && axes.value === "moyen" && name === "Printemps Chaud") {
      bonus += 2.3;
      details.push("chaud + moyen + vif + modéré => printemps chaud (+2.3)");
    }

    if (axes.contrast === "faible" && axes.value === "clair" && name === "Printemps Clair") {
      bonus += 2.5;
      details.push("chaud + clair + faible => printemps clair (+2.5)");
    }
  }

  // =========================
  // FAMILLE AUTOMNE
  // =========================
  if (axes.temperature === "chaud" && axes.intensity === "doux") {
    if (["Automne Doux", "Automne Chaud", "Automne Profond"].includes(name)) {
      bonus += 2.8;
      details.push("famille automne activée (+2.8)");
    }

    if (["Printemps Lumineux", "Printemps Chaud"].includes(name) && axes.contrast !== "fort") {
      bonus -= 1.2;
      details.push("printemps moins probable sous douceur dominante (-1.2)");
    }

    if (axes.value === "moyen" && axes.contrast === "faible" && name === "Automne Doux") {
      bonus += 2.5;
      details.push("chaud + doux + faible => automne doux (+2.5)");
    }

    if (axes.value === "profond" && axes.contrast === "fort" && name === "Automne Profond") {
      bonus += 2.8;
      details.push("chaud + profond + fort => automne profond (+2.8)");
    }
  }

  if (axes.temperature === "chaud" && axes.contrast === "modéré" && axes.intensity === "vif") {
    if (name === "Automne Chaud") {
      bonus += 2.1;
      details.push("chaud + modéré + vif => automne chaud (+2.1)");
    }
    if (name === "Printemps Chaud") {
      bonus += 1.2;
      details.push("printemps chaud reste plausible (+1.2)");
    }
  }

  // Renfort observation pour hiver froid / lumineux
  if (name === "Hiver Froid") {
    if (observedContrast === "fort") {
      bonus += 1.4;
      details.push("observation : contraste fort hivernal (+1.4)");
    }
    if (observedIntensity === "vif") {
      bonus += 1.1;
      details.push("observation : intensité vive hivernale (+1.1)");
    }
    if (observedValue === "moyen") {
      bonus += 1.0;
      details.push("observation : valeur moyenne compatible hiver froid (+1.0)");
    }
  }

  if (name === "Hiver Lumineux") {
    if (observedContrast === "fort") {
      bonus += 1.0;
      details.push("observation : contraste fort (+1.0)");
    }
    if (observedIntensity === "vif") {
      bonus += 0.9;
      details.push("observation : intensité vive (+0.9)");
    }
    if (observedValue === "clair") {
      bonus += 0.8;
      details.push("observation : valeur claire (+0.8)");
    }
  }

  return { bonus, details };
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
    const nearValue = new Set([
      "clair|moyen",
      "moyen|clair",
      "moyen|profond",
      "profond|moyen",
    ]);

    checks.push({
      axis: "Valeur",
      observation: observation.value,
      calculated: axes.value,
      match:
        observation.value === axes.value ||
        nearValue.has(`${observation.value}|${axes.value}`),
    });
  }

  if (observation.intensity && observation.intensity !== "indéterminée") {
    const nearIntensity = new Set([
      "doux|modéré",
      "modéré|doux",
      "vif|modéré",
      "modéré|vif",
    ]);

    checks.push({
      axis: "Intensité",
      observation: observation.intensity,
      calculated: axes.intensity,
      match:
        observation.intensity === axes.intensity ||
        nearIntensity.has(`${observation.intensity}|${axes.intensity}`),
    });
  }

  if (observation.contrast && observation.contrast !== "indéterminée") {
    const nearContrast = new Set([
      "faible|modéré",
      "modéré|faible",
      "fort|modéré",
      "modéré|fort",
    ]);

    checks.push({
      axis: "Contraste",
      observation: observation.contrast,
      calculated: axes.contrast,
      match:
        observation.contrast === axes.contrast ||
        nearContrast.has(`${observation.contrast}|${axes.contrast}`),
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
    if (confidenceLabel !== "Fort") confidenceLabel = "Moyen";
  }

  if (observationCheck.confidence === "À revalider") {
    confidenceScore -= 10;
    confidenceLabel = "À revalider";
  }

  if (confidenceScore > 100) confidenceScore = 100;
  if (confidenceScore < 20) confidenceScore = 20;

  if (observationCheck.confidence === "Fort" && gap >= 3) {
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
      const baseScore = scoreProfileBase(profile, axes);
      const observationBonus = getObservationBonus(profile.axes, observationState);
      const observationPenalty = getObservationPenalty(profile.axes, observationState);
      const matrixResult = getMatrixSignatureBonus(profile, axes);
      const hybridRuleResult = getHybridRuleBonus(profile, axes, observationState);

      const finalScore = Math.max(
        0,
        baseScore +
          observationBonus -
          observationPenalty +
          matrixResult.bonus +
          hybridRuleResult.bonus
      );

      return {
        name: profile.name,
        profile,
        score: roundScore(finalScore),
        baseScore: roundScore(baseScore),
        observationBonus: roundScore(observationBonus),
        observationPenalty: roundScore(observationPenalty),
        matrixBonus: roundScore(matrixResult.bonus),
        matrixDetails: matrixResult.details,
        hybridRuleBonus: roundScore(hybridRuleResult.bonus),
        hybridRuleDetails: hybridRuleResult.details,
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
    hybrid: {
      method: "base + observation + matrice + règles",
      primaryMatrixBonus: roundScore(primary?.matrixBonus || 0),
      primaryHybridRuleBonus: roundScore(primary?.hybridRuleBonus || 0),
      secondaryMatrixBonus: roundScore(secondary?.matrixBonus || 0),
      secondaryHybridRuleBonus: roundScore(secondary?.hybridRuleBonus || 0),
    },
    rawCounts: {
      temperature: tempCounts,
      value: valueCounts,
      intensity: intensityCounts,
      contrast: contrastCounts,
    },
  };
}