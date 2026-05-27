"use client";

import React, { useMemo, useState } from "react";
import { TESTS, OBSERVATION_QUESTIONS } from "./data";
import { getProfile } from "./matchProfile";

/* ====================== */
/* Styles */
/* ====================== */

const pageContainerStyle = {
  padding: 30,
  maxWidth: 1280,
  margin: "0 auto",
  background: "#F8F4F2", // ✅ fond nude très léger
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #E7DFDC",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const darkCardStyle = {
  ...cardStyle,
  background: "#1F1F1F",
  color: "#ffffff",
  border: "none",
};


const buttonStyle = (active) => ({
  border: active ? "2px solid #D4B06A" : "1px solid #ddd",
  background: active ? "#D8B7B1" : "#ffffff",
  color: "#111827",
  borderRadius: 12,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 600,
  width: "100%",
});


const tabButtonStyle = (active) => ({
  border: active ? "2px solid #D4B06A" : "1px solid #ddd",
  background: active ? "#111827" : "#ffffff",
  color: active ? "#ffffff" : "#111827",
  borderRadius: 14,
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 700,
});


const pillStyle = {
  display: "inline-block",
  border: "1px solid #e5e7eb",
  borderRadius: 999,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 700,
  background: "#f8fafc",
  color: "#111827",
};

/* ====================== */
/* Helpers */
/* ====================== */

function groupTests() {
  return TESTS.reduce((acc, test) => {
    if (!acc[test.section]) acc[test.section] = [];
    acc[test.section].push(test);
    return acc;
  }, {});
}

function safeText(value, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return value;
}

function swatchTextColor(hex) {
  const safeHex = (hex || "").toUpperCase();
  const lightHex = ["#FFFFFF", "#FFF2CC", "#FFF0BA", "#F8F8F7", "#F4F3F1"];
  return lightHex.includes(safeHex) ? "#111827" : "#ffffff";
}

function computeObservationAxes(observation) {
  return {
    // Température
    temperature:
      observation.undertone === "warm"
        ? "chaud"
        : observation.undertone === "cold"
        ? "froid"
        : "indéterminée",

    // Contraste
    contrast:
      observation.contrast === "low"
        ? "faible"
        : observation.contrast === "medium"
        ? "modéré"
        : observation.contrast === "high"
        ? "fort"
        : "indéterminée",

    // Intensité
    intensity:
      observation.intensity === "soft"
        ? "doux"
        : observation.intensity === "medium"
        ? "modéré"
        : observation.intensity === "strong"
        ? "vif"
        : "indéterminée",
  };
}

function buildPremiumPitch(result, profile, clientName) {
  if (profile?.pitch) {
    return `${clientName}, ${profile.pitch}`;
  }

  const temperature = safeText(result?.axes?.temperature, "équilibrées");
  const value = safeText(result?.axes?.value, "mesurées");
  const intensity = safeText(result?.axes?.intensity, "nuancées");
  const contrast = safeText(result?.axes?.contrast, "modérés");

  return `${clientName}, votre visage s’exprime naturellement avec des couleurs ${temperature}, plutôt ${value} et ${intensity}, dans un contraste ${contrast}. L’objectif n’est pas d’ajouter de la couleur, mais de révéler votre visage en respectant son équilibre naturel.`;
}

function buildAdvice(result, profile) {
  if (Array.isArray(profile?.advice) && profile.advice.length > 0) {
    return profile.advice;
  }

  const axes = result?.axes || {};
  const out = [];

  if (axes.temperature === "chaud") {
    out.push("Privilégier des teintes visuellement chaudes autour du visage.");
  } else if (axes.temperature === "froid") {
    out.push("Favoriser des couleurs froides et plus nettes pour clarifier les traits.");
  }

  if (axes.value === "clair") {
    out.push("Rester sur des valeurs lumineuses pour éviter d’alourdir l’harmonie.");
  } else if (axes.value === "profond") {
    out.push("S’appuyer sur davantage de profondeur pour créer plus de présence.");
  } else if (axes.value === "moyen") {
    out.push("Maintenir une profondeur modérée sans aller vers des extrêmes.");
  }

  if (axes.intensity === "doux") {
    out.push("Préférer des nuances fondues ou légèrement patinées.");
  } else if (axes.intensity === "vif") {
    out.push("Vous supportez davantage de netteté et d’énergie visuelle.");
  }

  if (axes.contrast === "fort") {
    out.push("Assumer davantage de contraste dans les associations.");
  } else if (axes.contrast === "faible") {
    out.push("Privilégier des contrastes doux et continus.");
  } else if (axes.contrast === "modéré") {
    out.push("Rester sur un contraste modéré : structuré, mais sans rupture trop forte.");
  }

  return out;
}

/* ====================== */
/* Small UI components */
/* ====================== */

function Swatch({ hex, label }) {
  const safeHex = hex || "#e5e7eb";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          height: 70,
          background: safeHex,
          color: swatchTextColor(safeHex),
          display: "flex",
          alignItems: "flex-end",
          padding: 8,
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        {safeText(label, "")}
      </div>

      <div
        style={{
          padding: 8,
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          color: "#475569",
        }}
      >
        
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 11,
    color: "#64748b",
  }}
>
  {safeHex}
</div>


      </div>
    </div>
  );
}

function AxisCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#ffffff",
        color: "#111827",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 700, marginTop: 4 }}>{safeText(value)}</div>
    </div>
  );
}

function ResultMetricCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 12,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{label}</div>
      <div style={{ fontWeight: 700, marginTop: 4 }}>{safeText(value)}</div>
    </div>
  );
}

function PaletteSection({ title, colors }) {
  const safeColors = Array.isArray(colors) ? colors : [];

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ marginBottom: 10 }}>{title}</h4>

      {safeColors.length === 0 ? (
        <div style={{ color: "#64748b" }}>Aucune couleur disponible</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          
{safeColors.map((color, i) => (
  <Swatch
    key={`${title}-${i}`}
    hex={typeof color === "string" ? color : color.hex}
    label={typeof color === "string" ? "" : color.nom}
  />
))}

        </div>
      )}
    </div>
  );
}

function CoherenceItem({ item }) {
  const isMatch = !!item?.match;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: isMatch ? "#f0fdf4" : "#fff7ed",
      }}
    >
      <div style={{ fontWeight: 700 }}>{safeText(item?.axis)}</div>
      <div style={{ marginTop: 6 }}>
        Observation : <strong>{safeText(item?.observation)}</strong>
      </div>
      <div>
        Calcul : <strong>{safeText(item?.calculated)}</strong>
      </div>
      <div style={{ marginTop: 8, fontWeight: 700 }}>
        {isMatch ? "✔ Cohérent" : "⚠ À vérifier"}
      </div>
    </div>
  );
}

function RankingItem({ item, index }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: index === 0 ? "#eff6ff" : "#ffffff",
        fontWeight: index === 0 ? 700 : 500,
      }}
    >
      #{index + 1} — {safeText(item?.name)} : {safeText(item?.score)}
    </div>
  );
}

function CountBox({ title, counts }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 12,
        background: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 4, fontSize: 14 }}>
        <div>A : {counts?.a ?? 0}</div>
        <div>B : {counts?.b ?? 0}</div>
        <div>Total : {counts?.total ?? 0}</div>
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  const safeProgress = Number.isFinite(progress) ? progress : 0;

  return (
    <div
      style={{
        width: "100%",
        height: 10,
        background: "#e5e7eb",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${safeProgress}%`,
          height: "100%",
          background: "#f59e0b",
        }}
      />
    </div>
  );
}

/* ====================== */
/* Page */
/* ====================== */

export default function Page() {
  const [tab, setTab] = useState("diagnostic");
  const [answers, setAnswers] = useState({});
  const [observation, setObservation] = useState({});
  const [prenom, setPrenom] = useState("Marina");
const [nom, setNom] = useState("");
const [dateDiagnostic, setDateDiagnostic] = useState(
  new Date().toISOString().split("T")[0]
);

  const groupedTests = useMemo(() => groupTests(), []);
  const observationAxes = useMemo(
    () => computeObservationAxes(observation),
    [observation]
  );
  
  const result = useMemo(
    () => getProfile(answers, observationAxes) || {},
    [answers, observationAxes]
  );
  

  const profile = result?.profile || null;
  const profileName = result?.profileName || "-";
  const secondaryProfileName = result?.secondaryProfileName || null;
  const axes = result?.axes || {};
  const confidenceLabel = result?.confidenceLabel || "-";
  const confidenceScore =
    result?.confidenceScore !== undefined && result?.confidenceScore !== null
      ? `${result.confidenceScore}%`
      : "-";

      const clientFullName = `${prenom} ${nom}`.trim();

      const pitch = useMemo(
        () => buildPremiumPitch(result, profile, clientFullName || prenom),
        [result, profile, clientFullName, prenom]
      );
      
  const advice = useMemo(() => buildAdvice(result, profile), [result, profile]);

  const answeredCount = Object.keys(answers).length;
  const observationCount = Object.keys(observation).length;
  const totalQuestions = TESTS.length + OBSERVATION_QUESTIONS.length;

  const progress = Math.round(((answeredCount + observationCount) / totalQuestions) * 100);

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setObservationAnswer = (key, value) => {
    setObservation((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadDemo = () => {
    setObservation({
      undertone: "warm",
      contrast: "low",
      intensity: "soft",
    });

    setAnswers({
      A1: "A",
      A2: "A",
      A3: "A",
      A4: "A",
      B1: "A",
      B2: "A",
      B3: "A",
      C1: "A",
      C2: "A",
      C3: "B",
      D1: "A",
      D2: "A",
    });

    setTab("resultat");
  };

  return (
    <div style={pageContainerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 20 }}>
  <img src="/logo.png" alt="By Marinea" style={{ height: 60 }} />
  <div>
    <div style={{ fontSize: 24, fontWeight: 700 }}>By Marinea</div>
    <div style={{ fontSize: 12, opacity: 0.6 }}>
      Diagnostic colorimétrique personnalisé
    </div>
  </div>
</div>

      {/* Barre du haut */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
  {/* Prénom */}
  <div>
    <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
      Prénom
    </label>
    <input
      value={prenom}
      onChange={(e) => setPrenom(e.target.value)}
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        width: 260,
        maxWidth: "100%",
      }}
    />
  </div>

  {/* Nom */}
  <div>
    <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
      Nom
    </label>
    <input
      value={nom}
      onChange={(e) => setNom(e.target.value)}
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        width: 260,
        maxWidth: "100%",
      }}
    />
  </div>

  {/* Date */}
  <div>
    <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
      Date
    </label>
    <input
      type="date"
      value={dateDiagnostic}
      onChange={(e) => setDateDiagnostic(e.target.value)}
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        width: 260,
      }}
    />
  </div>
</div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {["diagnostic", "resultat", "expert"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tabButtonStyle(tab === t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Progression + exemple */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>Progression : {progress}%</div>
        <ProgressBar progress={progress} />

        <button
          onClick={loadDemo}
          style={{
            marginTop: 15,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            borderRadius: 12,
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Charger un exemple
        </button>
      </div>

      {/* ================= DIAGNOSTIC ================= */}
      {tab === "diagnostic" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Observation initiale */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Observation initiale</h2>

            {OBSERVATION_QUESTIONS.map((q) => (
              <div key={q.key} style={{ marginBottom: 15 }}>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>{q.title}</div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
  {q.options.map((opt) => (
    <button
      key={opt.value}
      style={buttonStyle(observation[q.key] === opt.value)}
      onClick={() => setObservationAnswer(q.key, opt.value)}
    >
      {opt.label}
    </button>
  ))}
</div>

              </div>
            ))}
          </div>

          {/* Tests par section */}
          {Object.entries(groupedTests).map(([section, tests]) => (
            <div key={section} style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>{section}</h2>

              {tests.map((test) => (
                <div key={test.key} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{test.key}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{test.title}</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button
                      style={buttonStyle(answers[test.key] === "A")}
                      onClick={() => setAnswer(test.key, "A")}
                    >
                      {test.optionA}
                    </button>

                    <button
                      style={buttonStyle(answers[test.key] === "B")}
                      onClick={() => setAnswer(test.key, "B")}
                    >
                      {test.optionB}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ================= RESULTAT ================= */}
      {tab === "resultat" && profile && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Profil */}
          <div
style={{
  ...darkCardStyle,
  borderTop: "4px solid #D4B06A",
}}
>
<div style={{ marginBottom: 10, fontSize: 14, opacity: 0.8 }}>
  {prenom}{nom ? ` ${nom}` : ""} — {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
</div>

<h2 style={{ color: "#D4B06A", letterSpacing: 1 }}>
  {profileName}
</h2>
            {/* Pitch premium 3.3 */}
            <div style={{ marginTop: 20, lineHeight: 1.7 }}>
              <h3 style={{ marginBottom: 10 }}>Pitch By Marinea</h3>
              <p style={{ margin: 0 }}>{pitch}</p>
            </div>

            {/* Conseils personnalisés */}
            <div style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 10 }}>Conseils personnalisés</h3>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {advice.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            {/* Conseils profil issus du fichier data */}
            <div style={{ marginTop: 20, lineHeight: 1.7 }}>
              <h3 style={{ marginBottom: 10 }}>Application concrète</h3>

              <div>
                <strong>Tops :</strong>
                <br />
                {(profile.examples?.tops || []).join(", ") || "-"}
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>Vestes :</strong>
                <br />
                {(profile.examples?.jackets || []).join(", ") || "-"}
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>Accessoires :</strong>
                <br />
                {(profile.examples?.accessories || []).join(", ") || "-"}
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>À éviter :</strong>
                <br />
                {(profile.avoid || []).join(", ") || "-"}
              </div>
            </div>

            {/* Confiance */}
            <div style={{ marginTop: 20 }}>
              <strong>Confiance :</strong> {confidenceLabel} ({confidenceScore})
            </div>

            {secondaryProfileName && (
              <div style={{ marginTop: 6 }}>
                <strong>Profil secondaire :</strong> {secondaryProfileName}
              </div>
            )}

            {/* Axes */}
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 10,
              }}
            >
              <ResultMetricCard label="Température" value={axes.temperature} />
              <ResultMetricCard label="Valeur" value={axes.value} />
              <ResultMetricCard label="Intensité" value={axes.intensity} />
              <ResultMetricCard label="Contraste" value={axes.contrast} />
            </div>
            <div style={{ marginTop: 30, fontSize: 11, opacity: 0.5 }}>
  Diagnostic réalisé par By Marinea
</div>
          </div>

          {/* Palette */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Palette complète</h3>

            <PaletteSection title="Base : couleurs signature (haut, robe, pièces visibles)" colors={profile?.palettes?.base} />
            <PaletteSection title="Accents : détail / contraste (accessoires, petites touches)" colors={profile?.palettes?.accents} />
            <PaletteSection title="Neutres : fond de dressing (pantalon, manteau, veste)" colors={profile?.palettes?.neutres} />
            
          </div>
        </div>
      )}

      {/* ================= EXPERT ================= */}
      {tab === "expert" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Axes */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Analyse des axes</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              <AxisCard label="Température" value={axes.temperature} />
              <AxisCard label="Valeur" value={axes.value} />
              <AxisCard label="Intensité" value={axes.intensity} />
              <AxisCard label="Contraste" value={axes.contrast} />
            </div>
          </div>

          {/* Cohérence */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Cohérence observation / calcul</h2>

            {result?.observationCheck?.checks?.length ? (
              <div style={{ display: "grid", gap: 10 }}>
                {result.observationCheck.checks.map((c) => (
                  <CoherenceItem key={c.axis} item={c} />
                ))}
              </div>
            ) : (
              <div>Aucune observation saisie.</div>
            )}
          </div>

          {/* Classement */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Classement des profils</h2>

            {result?.scores?.length ? (
              <div style={{ display: "grid", gap: 10 }}>
                {result.scores.map((s, i) => (
                  <RankingItem key={s.name} item={s} index={i} />
                ))}
              </div>
            ) : (
              <div>Aucun score disponible.</div>
            )}
          </div>

          {/* Comptage brut */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Comptage brut par axe</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              <CountBox title="Température" counts={result?.rawCounts?.temperature} />
              <CountBox title="Valeur" counts={result?.rawCounts?.value} />
              <CountBox title="Intensité" counts={result?.rawCounts?.intensity} />
              <CountBox title="Contraste" counts={result?.rawCounts?.contrast} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
``