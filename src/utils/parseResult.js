// parseResult.js — AI response parser + JSON schema validator

const PHOTO_SCHEMA = {
  flood_signals:"array", heat_signals:"array", water_signals:"array",
  key_observation:"string", confidence:["Low","Medium","High"]
};

const SYNTHESIS_SCHEMA = {
  composite_score:"number", composite_tier:["Low","Medium","High","Critical"],
  flood_score:"number", flood_tier:["Low","Medium","High","Critical"],
  flood_confidence:["Low","Medium","High"], flood_reasoning:"string",
  uhi_score:"number", uhi_tier:["Low","Medium","High","Critical"],
  uhi_confidence:["Low","Medium","High"], uhi_reasoning:"string",
  water_score:"number", water_tier:["Low","Medium","High","Critical"],
  water_confidence:["Low","Medium","High"], water_reasoning:"string",
  compound_risk:"string", executive_summary:"string",
  flags:"array", recommendations:"array", data_sources:"array"
};

function validate(obj, schema) {
  const errors = [];
  for (const [field, expected] of Object.entries(schema)) {
    if (!(field in obj)) { errors.push(`Missing: ${field}`); continue; }
    const v = obj[field];
    if (Array.isArray(expected)) { if (!expected.includes(v)) errors.push(`Bad ${field}: ${v}`); }
    else if (expected==="number") {
      if (typeof v!=="number"||isNaN(v)) errors.push(`Not number: ${field}`);
      if ((field.includes("_score")||field==="composite_score")&&(v<0||v>100)) errors.push(`Range: ${field}`);
    }
    else if (expected==="string") { if (typeof v!=="string") errors.push(`Not string: ${field}`); else if (!v.trim()) errors.push(`Empty: ${field}`); }
    else if (expected==="array" && !Array.isArray(v)) errors.push(`Not array: ${field}`);
  }
  return { ok: !errors.length, errors };
}

function safeParse(raw) {
  if (!raw||typeof raw!=="string") return { data:null, error:"Empty" };
  let t = raw.replace(/```(?:json)?\n?/g,"").trim().replace(/^\uFEFF/,"");
  const si=t.indexOf("{"), ei=t.lastIndexOf("}");
  if (si===-1||ei===-1||ei<=si) return { data:null, error:"No JSON found" };
  let j = t.substring(si,ei+1)
    .replace(/,\s*([}\]])/g,"$1")
    .replace(/'([^']*)'\s*:/g,'"$1":')
    .replace(/:\s*'([^']*)'/g,':"$1"');
  try { return { data:JSON.parse(j), error:null }; }
  catch(e) {
    try { return { data:JSON.parse(t), error:null }; }
    catch(e2) { return { data:null, error:`Parse: ${e.message}` }; }
  }
}

export function parsePhotoAnalysis(raw) {
  const { data, error } = safeParse(raw);
  if (!data) return { ok:false, data:null, error:`Photo: ${error}`, raw:raw?.substring(0,500) };
  const v = validate(data, PHOTO_SCHEMA);
  if (!v.ok) return { ok:false, data:null, error:`Photo schema: ${v.errors.join(";")}`, raw:raw?.substring(0,500) };
  return { ok:true, data, error:null };
}

export function parseSynthesis(raw) {
  const { data, error } = safeParse(raw);
  if (!data) return { ok:false, data:null, error:`Synthesis: ${error}`, raw:raw?.substring(0,1000) };
  const v = validate(data, SYNTHESIS_SCHEMA);
  if (!v.ok) return { ok:false, data:null, error:`Schema: ${v.errors.join(";")}`, raw:raw?.substring(0,1000) };
  const warnings = [];
  if (data.composite_score>0 && data.composite_score<10) warnings.push("Score very low");
  if (data.flood_score+data.uhi_score+data.water_score===0) warnings.push("All scores zero");
  data.flags = Array.isArray(data.flags)?data.flags:[data.flags].filter(Boolean);
  data.recommendations = Array.isArray(data.recommendations)?data.recommendations:[data.recommendations].filter(Boolean);
  data.data_sources = Array.isArray(data.data_sources)?data.data_sources:[data.data_sources].filter(Boolean);
  return { ok:true, data, error:null, warnings };
}

export function parseAIResponse(raw, type="synthesis") {
  return type==="photo" ? parsePhotoAnalysis(raw) : parseSynthesis(raw);
}