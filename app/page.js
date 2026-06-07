"use client";

import React, { useMemo, useState } from "react";
import { TESTS, OBSERVATION_QUESTIONS, PROFILES } from "./data";
import { getProfile } from "./matchProfile";

/* ====================== */
/* Styles */
/* ====================== */

const pageContainerStyle = {
  padding: 30,
  maxWidth: 1280,
  margin: "0 auto",
  background: "#F8F4F2",
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

const printButtonStyle = {
  border: "1px solid #D4B06A",
  background: "#ffffff",
  color: "#111827",
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 15,
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
    temperature:
      observation.undertone === "warm"
        ? "chaud"
        : observation.undertone === "cold"
        ? "froid"
        : "indéterminée",

    contrast:
      observation.contrast === "low"
        ? "faible"
        : observation.contrast === "medium"
        ? "modéré"
        : observation.contrast === "high"
        ? "fort"
        : "indéterminée",

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
          justifyContent: "center",
          alignItems: "center",
          color: "#64748b",
        }}
      >
        {safeHex}
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
  const labels = {
    diagnostic: "Diagnostic",
    resultat: "Résultat",
    secondaire: "Secondaire",
    expert: "Expert",
    palettes: "Palettes",
  };
  const [tab, setTab] = useState("diagnostic");
  const [answers, setAnswers] = useState({});
  const [observation, setObservation] = useState({});
  const [prenom, setPrenom] = useState("Marina");
  const [nom, setNom] = useState("");
  const [dateDiagnostic, setDateDiagnostic] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [phone, setPhone] = useState("06 00 00 00 00");
  const [email, setEmail] = useState("contact@bymarinea.fr");
  const [address, setAddress] = useState("12 rue Exemple, 63000 Clermont-Ferrand");

  const groupedTests = useMemo(() => groupTests(), []);
  const observationAxes = useMemo(() => computeObservationAxes(observation), [observation]);

  const result = useMemo(() => getProfile(answers, observationAxes) || {}, [answers, observationAxes]);

  const profile = result?.profile || null;
const profileName = result?.profileName || "-";

const secondaryProfile = result?.secondaryProfile || null;
const secondaryProfileName = result?.secondaryProfileName || null;

const axes = result?.axes || {};
  const confidenceLabel = result?.confidenceLabel || "-";
  const confidenceScore =
    result?.confidenceScore !== undefined && result?.confidenceScore !== null
      ? `${result.confidenceScore}%`
      : "-";
      const secondaryConfidenceScore =
      result?.secondaryConfidenceScore !== undefined
        ? `${result.secondaryConfidenceScore}%`
        : "-";

  const clientFullName = `${prenom} ${nom}`.trim();

  const pitch = useMemo(
    () => buildPremiumPitch(result, profile, clientFullName || prenom),
    [result, profile, clientFullName, prenom]
  );
  
  const advice = useMemo(() => buildAdvice(result, profile), [result, profile]);
  
  const secondaryPitch = useMemo(
    () => buildPremiumPitch(result, secondaryProfile, clientFullName || prenom),
    [result, secondaryProfile, clientFullName, prenom]
  );
  
  const secondaryAdvice = useMemo(
    () => buildAdvice(result, secondaryProfile),
    [result, secondaryProfile]
  );

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
    <>
      <style jsx global>{`
        .print-only {
          display: none;
        }

        .screen-only {
          display: block;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-only {
            display: block !important;
          }

          .screen-only {
            display: none !important;
          }

          .no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .cover-page {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 90vh;
            page-break-after: always;
          }

          body * {
            visibility: hidden !important;
          }

          #pdf-print,
          #pdf-print * {
            visibility: visible !important;
          }

          #pdf-print {
            position: static !important;
            width: 100% !important;
            display: block !important;
          }

          #pdf-print .print-section {
            display: block !important;
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 24px;
          }

          #pdf-print .print-result-grid {
            display: block !important;
          }

          #pdf-print .print-result-grid > div {
            margin-bottom: 20px !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div style={pageContainerStyle}>
        {/* HEADER ECRAN */}
        <div
          className="screen-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginBottom: 20,
          }}
        >
          <img src="/logo.png" alt="By Marinea" style={{ height: 80 }} />

          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>By Marinea</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              Diagnostic colorimétrique personnalisé
            </div>
          </div>
        </div>

        {/* Barre du haut */}
        <div
          className="screen-only"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 20,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* COLONNE GAUCHE */}
            <div style={{ display: "grid", gap: 10 }}>
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
                    width: "100%",
                  }}
                />
              </div>

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
                    width: "100%",
                  }}
                />
              </div>

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
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* COLONNE DROITE */}
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
                  Téléphone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, color: "#64748b" }}>
                  Adresse
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          

          {["diagnostic", "resultat", "secondaire", "expert", "palettes"].map((t) => (
  <button key={t} onClick={() => setTab(t)} style={tabButtonStyle(tab === t)}>
    {t}
  </button>
))}
          </div>
        </div>

        {/* Progression + exemple */}
        <div className="screen-only" style={{ marginBottom: 20 }}>
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

        {/* Bouton export PDF */}
        <div className="screen-only" style={{ marginBottom: 20 }}>
          <button onClick={() => window.print()} style={printButtonStyle}>
            🖨️ Export PDF
          </button>
        </div>

        {/* DIAGNOSTIC (écran) */}
        {tab === "diagnostic" && (
          <div className="screen-only" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

            {Object.entries(groupedTests).map(([section, tests]) => (
              <div key={section} style={cardStyle}>
                <h2 style={{ marginTop: 0 }}>{section}</h2>

                {tests.map((test) => (
                  <div key={test.key} style={{ marginBottom: 12 }}>
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

        {/* RESULTAT (écran) */}
        {tab === "resultat" && profile && (
          <div
            className="screen-only"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <div
              className="no-break"
              style={{
                ...darkCardStyle,
                borderTop: "4px solid #D4B06A",
              }}
            >
              <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.8 }}>
                {prenom}
                {nom ? ` ${nom}` : ""} —{" "}
                {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
              </div>

              <h2 style={{ color: "#D4B06A", letterSpacing: 1 }}>{profileName}</h2>

              <div style={{ marginTop: 20, lineHeight: 1.7 }}>
                <h3 style={{ marginBottom: 10 }}>Pitch By Marinea</h3>
                <p style={{ margin: 0 }}>{pitch}</p>
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 10 }}>Conseils personnalisés</h3>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {advice.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>

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

              <div style={{ marginTop: 20 }}>
                <strong>Confiance :</strong> {confidenceLabel} ({confidenceScore})
              </div>

              {secondaryProfileName && (
                <div style={{ marginTop: 6 }}>
                  <strong>Profil secondaire :</strong> {secondaryProfileName}
                </div>
              )}

              {/* Ligne 1 */}
              <div
                className="no-break"
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <ResultMetricCard label="Température" value={axes.temperature} />
                <ResultMetricCard label="Valeur" value={axes.value} />
              </div>

              {/* Ligne 2 */}
              <div
                className="no-break"
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <ResultMetricCard label="Intensité" value={axes.intensity} />
                <ResultMetricCard label="Contraste" value={axes.contrast} />
              </div>

              <div style={{ marginTop: 30, fontSize: 11, opacity: 0.5 }}>
                Diagnostic réalisé par By Marinea
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Palette complète</h3>

              <PaletteSection
                title="Base : couleurs signature (haut, robe, pièces visibles)"
                colors={profile?.palettes?.base}
              />
              <PaletteSection
                title="Accents : détail / contraste (accessoires, petites touches)"
                colors={profile?.palettes?.accents}
              />
              <PaletteSection
                title="Neutres : fond de dressing (pantalon, manteau, veste)"
                colors={profile?.palettes?.neutres}
              />
            </div>
          </div>
        )}

{/* RESULTAT SECONDAIRE (écran) */}
{tab === "secondaire" && secondaryProfile && (
  <div
    className="screen-only"
    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
  >
    <div
      className="no-break"
      style={{
        ...darkCardStyle,
        borderTop: "4px solid #D4B06A",
      }}
    >
      <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.8 }}>
        {prenom}
        {nom ? ` ${nom}` : ""} —{" "}
        {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
      </div>

      <h2 style={{ color: "#D4B06A", letterSpacing: 1 }}>
        {secondaryProfileName}
      </h2>
      
<div style={{ marginTop: 6, opacity: 0.7 }}>
  Alternative proche de votre profil principal
</div>


      <div style={{ marginTop: 20, lineHeight: 1.7 }}>
        <h3 style={{ marginBottom: 10 }}>Pitch By Marinea</h3>
        <p style={{ margin: 0 }}>{secondaryPitch}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 10 }}>Conseils personnalisés</h3>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          {secondaryAdvice.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 20, lineHeight: 1.7 }}>
        <h3 style={{ marginBottom: 10 }}>Application concrète</h3>

        <div>
          <strong>Tops :</strong>
          <br />
          {(secondaryProfile.examples?.tops || []).join(", ") || "-"}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Vestes :</strong>
          <br />
          {(secondaryProfile.examples?.jackets || []).join(", ") || "-"}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Accessoires :</strong>
          <br />
          {(secondaryProfile.examples?.accessories || []).join(", ") || "-"}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>À éviter :</strong>
          <br />
          {(secondaryProfile.avoid || []).join(", ") || "-"}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
      <strong>Confiance :</strong> {secondaryConfidenceScore}
      </div>

      <div style={{ marginTop: 6 }}>
        <strong>Profil principal :</strong> {profileName}
      </div>

      {/* Ligne 1 */}
      <div
        className="no-break"
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <ResultMetricCard label="Température" value={axes.temperature} />
        <ResultMetricCard label="Valeur" value={axes.value} />
      </div>

      {/* Ligne 2 */}
      <div
        className="no-break"
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <ResultMetricCard label="Intensité" value={axes.intensity} />
        <ResultMetricCard label="Contraste" value={axes.contrast} />
      </div>

      <div style={{ marginTop: 30, fontSize: 11, opacity: 0.5 }}>
        Diagnostic réalisé par By Marinea
      </div>
    </div>

    <div style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Palette complète</h3>

      <PaletteSection
        title="Base : couleurs signature (haut, robe, pièces visibles)"
        colors={secondaryProfile?.palettes?.base}
      />
      <PaletteSection
        title="Accents : détail / contraste (accessoires, petites touches)"
        colors={secondaryProfile?.palettes?.accents}
      />
      <PaletteSection
        title="Neutres : fond de dressing (pantalon, manteau, veste)"
        colors={secondaryProfile?.palettes?.neutres}
      />
    </div>
  </div>
)}

        {/* EXPERT (écran) */}
        {tab === "expert" && (
          <div className="screen-only" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Analyse des axes</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                <AxisCard label="Température" value={axes.temperature} />
                <AxisCard label="Valeur" value={axes.value} />
                <AxisCard label="Intensité" value={axes.intensity} />
                <AxisCard label="Contraste" value={axes.contrast} />
              </div>
            </div>

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

{/* PALETTES (écran uniquement) */}
{tab === "palettes" && (
  <div className="screen-only" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

    <h2 style={{ marginTop: 0 }}>Palettes des 12 saisons</h2>

    {Object.entries(PROFILES).map(([name, profile]) => (
      <div key={name} style={cardStyle}>

        <h3 style={{ marginTop: 0 }}>{profile.name}</h3>

        <PaletteSection
          title="Base"
          colors={profile?.palettes?.base}
        />

        <PaletteSection
          title="Accents"
          colors={profile?.palettes?.accents}
        />

        <PaletteSection
          title="Neutres"
          colors={profile?.palettes?.neutres}
        />

      </div>
    ))}
  </div>
)}
        {/* CONTENEUR PDF CACHÉ */}
        <div id="pdf-print" className="print-only">
          {/* PAGE DE GARDE */}
          <div className="print-section cover-page">
            <div
              className="cover-content"
              style={{
                textAlign: "center",
              }}
            >
              <img src="/logo.png" alt="By Marinea" style={{ height: 120, marginBottom: 20 }} />

              <div style={{ fontSize: 36, fontWeight: 700 }}>By Marinea</div>

              <div style={{ fontSize: 16, opacity: 0.7, marginTop: 10 }}>
                Diagnostic colorimétrique personnalisé
              </div>

              <div style={{ marginTop: 30, fontSize: 16, fontWeight: 600 }}>
                {prenom} {nom}
              </div>

              <div style={{ marginTop: 5, fontSize: 12, opacity: 0.7 }}>
                {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
              </div>

              <div
                style={{
                  marginTop: 30,
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                <div>📞 {phone}</div>
                <div>📧 {email}</div>
                <div>📍 {address}</div>
              </div>
            </div>
          </div>

          {/* DIAGNOSTIC PDF */}
          <div className="print-section">
            <h2 style={sectionTitleStyle}>Diagnostic</h2>

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Observation initiale</h3>

              {OBSERVATION_QUESTIONS.map((q) => {
                const selected = q.options?.find((opt) => observation[q.key] === opt.value);

                return (
                  <div key={q.key} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700 }}>{q.title}</div>
                    <div style={{ marginTop: 4, color: "#475569" }}>
                      {selected ? selected.label : "Non renseigné"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ height: 16 }} />

            {Object.entries(groupedTests).map(([section, tests]) => (
              <div key={section} style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>{section}</h3>

                {tests.map((test) => (
                  <div key={test.key} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>{test.title}</div>
                    <div style={{ marginTop: 4, color: "#475569" }}>
                      {answers[test.key] === "A"
                        ? test.optionA
                        : answers[test.key] === "B"
                        ? test.optionB
                        : "Non renseigné"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

{/* RESULTAT PDF */}
{profile && (
  <div className="print-section">
    <div className="print-result-grid">

      {/* ✅ BLOC PRINCIPAL */}
      <div
        className="no-break"
        style={{
          ...darkCardStyle,
          borderTop: "4px solid #D4B06A",
        }}
      >
        <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.8 }}>
          {prenom}
          {nom ? ` ${nom}` : ""} —{" "}
          {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
        </div>

        <h2 style={{ color: "#D4B06A", letterSpacing: 1, marginTop: 0 }}>
          {profileName}
        </h2>

        <div style={{ marginTop: 20, lineHeight: 1.7 }}>
          <h3 style={{ marginBottom: 10 }}>Pitch By Marinea</h3>
          <p style={{ margin: 0 }}>{pitch}</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Conseils personnalisés</h3>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            {advice.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 20, lineHeight: 1.7 }}>
          <h3 style={{ marginBottom: 10 }}>Application concrète</h3>

          <div><strong>Tops :</strong><br />{(profile.examples?.tops || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>Vestes :</strong><br />{(profile.examples?.jackets || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>Accessoires :</strong><br />{(profile.examples?.accessories || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>À éviter :</strong><br />{(profile.avoid || []).join(", ") || "-"}</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <strong>Confiance :</strong> {confidenceLabel} ({confidenceScore})
        </div>

        {secondaryProfileName && (
          <div style={{ marginTop: 6 }}>
            <strong>Profil secondaire :</strong> {secondaryProfileName}
          </div>
        )}
      </div>

      {/* ✅ METRICS PRINCIPAL */}
      <div
        className="no-break"
        style={{
          ...darkCardStyle,
          borderTop: "4px solid #D4B06A",
          marginTop: 10,
        }}
      >
        <div style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}>
          <ResultMetricCard label="Température" value={axes.temperature} />
          <ResultMetricCard label="Valeur" value={axes.value} />
          <ResultMetricCard label="Intensité" value={axes.intensity} />
          <ResultMetricCard label="Contraste" value={axes.contrast} />
        </div>

        <div style={{ marginTop: 20, fontSize: 11, opacity: 0.5 }}>
          Diagnostic réalisé par By Marinea
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Palette complète</h3>
        <PaletteSection title="Base" colors={profile?.palettes?.base} />
        <PaletteSection title="Accents" colors={profile?.palettes?.accents} />
        <PaletteSection title="Neutres" colors={profile?.palettes?.neutres} />
      </div>

    </div>
  </div>
)}

{/* RESULTAT SECONDAIRE PDF */}
{secondaryProfile && (
  <div className="print-section" style={{ pageBreakBefore: "always" }}>
    <div className="print-result-grid">

      {/* ✅ BLOC PRINCIPAL SECONDAIRE */}
      <div
        className="no-break"
        style={{
          ...darkCardStyle,
          borderTop: "4px solid #D4B06A",
        }}
      >
        <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.8 }}>
          {prenom}
          {nom ? ` ${nom}` : ""} —{" "}
          {new Date(dateDiagnostic).toLocaleDateString("fr-FR")}
        </div>

        <h2 style={{ color: "#D4B06A", letterSpacing: 1, marginTop: 0 }}>
          {secondaryProfileName}
        </h2>

        <div style={{ marginTop: 6, opacity: 0.7 }}>
          Alternative proche de votre profil principal
        </div>

        <div style={{ marginTop: 20, lineHeight: 1.7 }}>
          <h3 style={{ marginBottom: 10 }}>Pitch By Marinea</h3>
          <p style={{ margin: 0 }}>{secondaryPitch}</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Conseils personnalisés</h3>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            {secondaryAdvice.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 20, lineHeight: 1.7 }}>
          <h3 style={{ marginBottom: 10 }}>Application concrète</h3>

          <div><strong>Tops :</strong><br />{(secondaryProfile.examples?.tops || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>Vestes :</strong><br />{(secondaryProfile.examples?.jackets || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>Accessoires :</strong><br />{(secondaryProfile.examples?.accessories || []).join(", ") || "-"}</div>
          <div style={{ marginTop: 10 }}><strong>À éviter :</strong><br />{(secondaryProfile.avoid || []).join(", ") || "-"}</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <strong>Confiance :</strong> {secondaryConfidenceScore}
        </div>

        <div style={{ marginTop: 6 }}>
          <strong>Profil principal :</strong> {profileName}
        </div>
      </div>

      {/* ✅ METRICS SECONDAIRE */}
      <div
        className="no-break"
        style={{
          ...darkCardStyle,
          borderTop: "4px solid #D4B06A",
          marginTop: 10,
        }}
      >
        <div style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}>
          <ResultMetricCard label="Température" value={axes.temperature} />
          <ResultMetricCard label="Valeur" value={axes.value} />
          <ResultMetricCard label="Intensité" value={axes.intensity} />
          <ResultMetricCard label="Contraste" value={axes.contrast} />
        </div>

        <div style={{ marginTop: 20, fontSize: 11, opacity: 0.5 }}>
          Diagnostic réalisé par By Marinea
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Palette complète</h3>
        <PaletteSection title="Base" colors={secondaryProfile?.palettes?.base} />
        <PaletteSection title="Accents" colors={secondaryProfile?.palettes?.accents} />
        <PaletteSection title="Neutres" colors={secondaryProfile?.palettes?.neutres} />
      </div>

    </div>
  </div>
)}

          {/* EXPERT PDF */}
          <div className="print-section">
            <h2 style={sectionTitleStyle}>Analyse experte</h2>

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Analyse des axes</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                <AxisCard label="Température" value={axes.temperature} />
                <AxisCard label="Valeur" value={axes.value} />
                <AxisCard label="Intensité" value={axes.intensity} />
                <AxisCard label="Contraste" value={axes.contrast} />
              </div>
            </div>

            <div style={{ height: 16 }} />

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Cohérence observation / calcul</h3>

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

            <div style={{ height: 16 }} />

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Classement des profils</h3>

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

            <div style={{ height: 16 }} />

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Comptage brut par axe</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                <CountBox title="Température" counts={result?.rawCounts?.temperature} />
                <CountBox title="Valeur" counts={result?.rawCounts?.value} />
                <CountBox title="Intensité" counts={result?.rawCounts?.intensity} />
                <CountBox title="Contraste" counts={result?.rawCounts?.contrast} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}