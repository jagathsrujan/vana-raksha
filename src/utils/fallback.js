// fallback.js — Deterministic fallback engine using quantitative WARD_DB data
// v2.0: Replaces flat tier-to-score lookup with weighted multi-field formula

const TS = { Low: 22, Medium: 50, High: 72, Critical: 88 };
const SOIL_SCORES = {
  "Clay-Loam": 70, "Clay": 75, "Laterite": 40,
  "Sandy": 20, "Sandy-Loam": 30, "Silt-Loam": 50,
  "Loam": 45, "Black-Cotton": 65, "Red-Loam": 50
};

function t2s(t) { return TS[t] || 50; }
function s2t(s) { return s < 30 ? "Low" : s < 55 ? "Medium" : s < 75 ? "High" : "Critical"; }

// Normalize a value to 0–100 range, with optional inversion
function norm(val, min, max, invert = false) {
  if (val == null) return null;
  let n = (val - min) / (max - min);
  n = Math.max(0, Math.min(1, n));
  return Math.round(invert ? (1 - n) * 100 : n * 100);
}

// Weighted average that ignores null values
function wavg(items) {
  const valid = items.filter(i => i.v != null);
  if (!valid.length) return null;
  const totalW = valid.reduce((s, i) => s + i.w, 0);
  return Math.round(valid.reduce((s, i) => s + i.v * i.w, 0) / totalW);
}

// Extract numeric delta from UHI text like "+3.5 degC above city mean"
function parseUHIDelta(text) {
  if (!text) return null;
  const m = text.match(/[+-]?\d+(?:\.\d+)?/);
  return m ? Math.abs(parseFloat(m[0])) : null;
}

// Compute data completeness confidence
function confidence(ward) {
  const expected = 11;
  let present = 0;
  if (ward.flood_events_10yr != null) present++;
  if (ward.impervious_pct != null) present++;
  if (ward.drainage_km_per_sqkm != null) present++;
  if (ward.lake_count != null) present++;
  if (ward.ndvi != null) present++;
  if (ward.pop_density != null) present++;
  if (ward.water_table_depth_m != null) present++;
  if (ward.bwssb_sewer_coverage_pct != null) present++;
  if (ward.has_landfill_nearby != null) present++;
  if (ward.annual_rainage_mm != null) present++;
  if (ward.soil_type != null) present++;
  const r = present / expected;
  return r >= 0.75 ? "High" : r >= 0.4 ? "Medium" : "Low";
}

// ---- Dimension Scorers ----

function floodScore(w) {
  const events  = norm(w.flood_events_10yr, 0, 6, false);
  const imperv  = norm(w.impervious_pct, 0, 100, false);
  const drain   = norm(w.drainage_km_per_sqkm, 0.5, 2.5, true);
  const lakes   = norm(w.lake_count, 0, 6, true);
  const soil    = SOIL_SCORES[w.soil_type] ?? null;
  return wavg([
    { v: events, w: 0.35 },
    { v: imperv, w: 0.25 },
    { v: drain,  w: 0.20 },
    { v: lakes,  w: 0.10 },
    { v: soil,   w: 0.10 },
  ]);
}

function uhiScore(w) {
  const ndvi   = norm(w.ndvi, 0.10, 0.55, true);
  const imperv = norm(w.impervious_pct, 0, 100, false);
  const pop    = norm(w.pop_density, 5000, 40000, false);
  const delta  = parseUHIDelta(w.uhi_delta);
  const uhi    = delta != null ? norm(delta, 0, 6, false) : null;
  return wavg([
    { v: ndvi, w: 0.40 },
    { v: imperv, w: 0.30 },
    { v: pop, w: 0.20 },
    { v: uhi, w: 0.10 },
  ]);
}

function waterScore(w) {
  const gw     = norm(w.water_table_depth_m, 5, 80, true);
  const sewer  = norm(w.bwssb_sewer_coverage_pct, 0, 100, true);
  const landfill = w.has_landfill_nearby === true ? 100 : w.has_landfill_nearby === false ? 0 : null;
  const rain   = norm(w.annual_rainage_mm, 600, 1400, false);
  return wavg([
    { v: gw, w: 0.35 },
    { v: sewer, w: 0.30 },
    { v: landfill, w: 0.20 },
    { v: rain, w: 0.15 },
  ]);
}

// ---- Main Export ----

export function buildFallback(mw) {
  // No ward matched — city-wide defaults
  if (!mw || !mw.key) {
    return {
      composite_score: 42, composite_tier: "Medium",
      flood_score: 40, flood_tier: "Medium", flood_confidence: "Very Low",
      flood_reasoning: "No ward data. Using city-wide average.",
      uhi_score: 45, uhi_tier: "Medium", uhi_confidence: "Very Low",
      uhi_reasoning: "No ward data. UHI causes 2–5°C elevation.",
      water_score: 42, water_tier: "Medium", water_confidence: "Very Low",
      water_reasoning: "No ward data. Groundwater depletion.",
      compound_risk: "Medium risk across all dimensions.",
      executive_summary: "City-wide average. Provide address for ward results.",
      flags: ["No ward matched — city-wide averages"],
      recommendations: ["Enter address", "Consult BWSSB", "Check BBMP maps"],
      data_sources: ["BBMP", "KSNDMC", "CGWB", "IMD"],
      _fallback: true,
    };
  }

  const fs = floodScore(mw);
  const us = uhiScore(mw);
  const ws = waterScore(mw);
  const conf = confidence(mw);
  const pen = (mw.isInterpolated && mw.confidencePenaltyPct) ? mw.confidencePenaltyPct : 0;

  // Composite: weighted 40/30/30, with interpolation penalty
  const validDims = [fs, us, ws].filter(v => v != null).length;
  const baseComp = validDims
    ? ((fs ?? 30) * 0.40 + (us ?? 30) * 0.30 + (ws ?? 30) * 0.30)
    : 42;
  const comp = Math.max(0, Math.round(baseComp * (1 - pen / 100)));

  // Per-dimension scores with optional interpolation penalty
  const applyPenalty = (v) => mw.isInterpolated ? Math.max(0, Math.round(v * (1 - pen / 100))) : v;

  const floodPen  = fs != null ? applyPenalty(fs) : null;
  const uhiPen    = us != null ? applyPenalty(us) : null;
  const waterPen  = ws != null ? applyPenalty(ws) : null;

  // Reasoning strings cite actual data
  const floodReasoning = mw.flood_incidents
    ? `${mw.label}: ${mw.flood || "M"} flood tier. ${mw.flood_incidents}. Flood events/10yr: ${mw.flood_events_10yr ?? "N/A"}, impervious: ${mw.impervious_pct ?? "N/A"}%, drainage: ${mw.drainage_km_per_sqkm ?? "N/A"} km/sqkm, soil: ${mw.soil_type ?? "N/A"}, lakes: ${mw.lake_count ?? "N/A"}.`
    : `${mw.label}: ${mw.flood || "M"} flood tier.`;

  const uhiReasoning = mw.uhi_delta
    ? `${mw.label} UHI: ${mw.uhi || "M"}. ${mw.uhi_delta}. NDVI: ${mw.ndvi ?? "N/A"}, impervious: ${mw.impervious_pct ?? "N/A"}%, pop density: ${mw.pop_density ?? "N/A"}/sqkm.`
    : `${mw.label} UHI: ${mw.uhi || "M"}.`;

  const waterReasoning = mw.groundwater
    ? `${mw.label} water: ${mw.water || "M"}. ${mw.groundwater}. Water table: ${mw.water_table_depth_m ?? "N/A"}m, BWSSB: ${mw.bwssb_sewer_coverage_pct ?? "N/A"}%, annual rain: ${mw.annual_rainage_mm ?? "N/A"}mm.`
    : `${mw.label} water: ${mw.water || "M"}.`;

  // Flags
  const flags = [];
  if (pen > 0) flags.push(`Interpolated from ${mw.label} (${pen}% confidence penalty applied)`);
  if (fs == null) flags.push("Flood score: insufficient data");
  if (us == null) flags.push("UHI score: insufficient data");
  if (ws == null) flags.push("Water stress score: insufficient data");

  return {
    composite_score: comp,
    composite_tier: s2t(comp),
    flood_score: floodPen,
    flood_tier: floodPen != null ? s2t(floodPen) : "Unknown",
    flood_confidence: conf,
    flood_reasoning: floodReasoning,
    uhi_score: uhiPen,
    uhi_tier: uhiPen != null ? s2t(uhiPen) : "Unknown",
    uhi_confidence: conf,
    uhi_reasoning: uhiReasoning,
    water_score: waterPen,
    water_tier: waterPen != null ? s2t(waterPen) : "Unknown",
    water_confidence: conf,
    water_reasoning: waterReasoning,
    compound_risk: `${mw.label || "Area"} risk assessed using quantitative ward data.`,
    executive_summary: `${mw.label || "Area"}: ${s2t(comp)} risk level (score: ${comp}/100) based on ward data.`,
    flags: flags,
    recommendations: mw.isInterpolated
      ? ["Consult local ward office", "Verify data with ground survey", "Review BWSSB infrastructure maps"]
      : ["Consult local ward office", "Consider professional assessment", "Review BWSSB infrastructure maps"],
    data_sources: ["BBMP", "CGWB", "IMD", "Sentinel-2", "BWSSB", "KLR Database"],
    _fallback: true,
    _ward: mw.key,
  };
}