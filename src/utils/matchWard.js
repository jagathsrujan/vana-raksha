import { WARD_DB } from "../data/WARD_DB";

const KEYWORD_MAP = {
  koramangala: ["koramangala", "kormangala", "koraman", "80th junction", "80 feet road", "kc valley", "dairy circle"],
  bommanahalli: ["bommanahalli", "bommanahalli ext", "bommana halli"],
  btm_layout: ["btm", "btm layout", "btm 2nd stage"],
  hsr_layout: ["hsr", "hsr layout", "hsr extension", "agaram"],
  whitefield: ["whitefield", "white field", "itpl", "kadugodi", "hopefarm"],
  varthur: ["varthur", "varthur road", "vathur"],
  mahadevapura: ["mahavadevapura", "mahadevapura"],
  krishnarajapuram: ["krishnarajapuram", "krishnaraja puram", "krpuram"],
  hoodi: ["hoodi", "hoodi circle"],
  rajajinagar: ["rajajinagar", "raja jainagar"],
  vijayanagar: ["vijayanagar", "vijay nagar"],
  basaveshwaranagar: ["basaveshwaranagar", "basavanagar"],
  nagarbhavi: ["nagarbhavi", "nagarabhavi"],
  mahalakshmi_layout: ["mahalakshmi layout", "ml layout"],
  yelahanka: ["yelahanka", "yelahanka new town"],
  hebbal: ["hebbal", "hebbalu"],
  jakkur: ["jakkur", "jakkuru"],
  dasarahalli: ["dasarahalli"],
  mathikere: ["mathikere"],
  jayanagar: ["jayanagar", "jay nagar"],
  jp_nagar: ["jp nagar", "jp nagara"],
  wilson_garden: ["wilson garden"],
  banashankari: ["banashankari"],
  girinagar: ["girinagar"],
  kengeri: ["kengeri"],
  uttarahalli: ["uttarahalli"],
};

export function matchWard(address = "", ward = "", pin = "") {
  const combined = `${address} ${ward} ${pin}`.toLowerCase().trim();
  if (!combined || combined === " ") return null;

  for (const [key, data] of Object.entries(WARD_DB)) {
    if (!data.pins) continue;
    if (data.pins.some(p => combined.includes(p.replace(/\s/g, "")))) {
      return { ...data, isInterpolated: false, matchType: "pin" };
    }
  }

  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(kw => combined.includes(kw.toLowerCase()))) {
      const wardData = WARD_DB[key];
      if (wardData) return { ...wardData, isInterpolated: false, matchType: "keyword" };
    }
  }

  const nearest = findNearestWard(combined);
  if (nearest) {
    const wardData = WARD_DB[nearest.key];
    if (wardData) {
      const distanceKm = nearest.distance;
      const penalty = Math.min(Math.floor(distanceKm * 5), 30);
      return { ...wardData, isInterpolated: true, matchType: "nearest", interpolationDistanceKm: distanceKm, confidencePenaltyPct: penalty, interpolationNote: `Nearest: ${wardData.label} (${distanceKm.toFixed(1)} km). Penalty: ${penalty}%` };
    }
  }
  return null;
}

function findNearestWard(combined) {
  const words = combined.split(/\s+/);
  for (const word of words) {
    for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
      for (const kw of keywords) {
        if (word.length >= 4 && kw.includes(word)) return { key, distance: 5 };
        if (word.length >= 4 && levenshtein(word, kw) <= 2) return { key, distance: 5 };
      }
    }
  }
  return null;
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) { matrix[i][j] = matrix[i - 1][j - 1]; }
      else { matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1); }
    }
  }
  return matrix[b.length][a.length];
}