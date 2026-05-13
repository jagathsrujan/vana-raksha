// buildPrompt.js — System prompt builder for Gemini API
const CITY_BASELINE = `BENGALURU CITY CONTEXT...`;
export function buildSystemPrompt(matchedWard) {
  let p = `You are VanaRaksha...`;
  if (matchedWard && matchedWard.key) { p += `\nWARD: ${matchedWard.label.toUpperCase()}`; }
  else { p += `\nNO WARD MATCHED.`; }
  return p;
}