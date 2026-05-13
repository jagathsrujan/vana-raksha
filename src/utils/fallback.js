// fallback.js — Deterministic fallback engine
const TS={Low:22,Medium:50,High:72,Critical:88};
const W={flood:0.4,uhi:0.3,water:0.3};
function t2s(t){return TS[t]||30;}
function s2t(s){return s<35?"Low":s<55?"Medium":s<75?"High":"Critical";}
function ec(w){const r=["flood","uhi","water"].filter(f=>w[f]!=null).length/3;return r>=0.66?"High":r>=0.33?"Medium":"Low";}

export function buildFallback(mw){
  if(!mw||!mw.key){
    return{composite_score:42,composite_tier:"Medium",
      flood_score:40,flood_tier:"Medium",flood_confidence:"Very Low",
      flood_reasoning:"No ward data. Using city-wide average.",
      uhi_score:45,uhi_tier:"Medium",uhi_confidence:"Very Low",
      uhi_reasoning:"No ward data. UHI causes 2-5C elevation.",
      water_score:42,water_tier:"Medium",water_confidence:"Very Low",
      water_reasoning:"No ward data. Groundwater depletion.",
      compound_risk:"Medium risk across all dimensions.",
      executive_summary:"City-wide average. Provide address for ward results.",
      flags:["No ward matched - city-wide averages"],
      recommendations:["Enter address","Consult BWSSB","Check BBMP maps"],
      data_sources:["BBMP","KSNDMC","CGWB","IMD"],_fallback:true};
  }
  const w=mw,fs=t2s(w.flood||"Medium"),us=t2s(w.uhi||"Medium"),ws=t2s(w.water||"Medium");
  const pen=(w.isInterpolated&&w.confidencePenaltyPct)?w.confidencePenaltyPct:0;
  const comp=Math.max(0,Math.round((fs*.4+us*.3+ws*.3)*(1-pen/100)));
  const conf=ec(w);
  return{
    composite_score:comp,composite_tier:s2t(comp),
    flood_score:w.isInterpolated?Math.max(0,Math.round(fs*(1-pen/100))):fs,
    flood_tier:s2t(fs),flood_confidence:conf,
    flood_reasoning:w.flood_incidents?`${w.label}: ${w.flood||"M"}. ${w.flood_incidents}`:`${w.label}: ${w.flood||"M"}`,
    uhi_score:w.isInterpolated?Math.max(0,Math.round(us*(1-pen/100))):us,
    uhi_tier:s2t(us),uhi_confidence:conf,
    uhi_reasoning:w.uhi_delta?`${w.label} UHI: ${w.uhi||"M"}. ${w.uhi_delta}`:`${w.label} UHI: ${w.uhi||"M"}`,
    water_score:w.isInterpolated?Math.max(0,Math.round(ws*(1-pen/100))):ws,
    water_tier:s2t(ws),water_confidence:conf,
    water_reasoning:w.groundwater?`${w.label} water: ${w.water||"M"}. ${w.groundwater}`:`${w.label} water: ${w.water||"M"}`,
    compound_risk:`${w.label||"Area"} risk assessed.`,
    executive_summary:`${w.label||"Area"}: ${s2t(comp)} risk level.`,
    flags:[],
    recommendations:["Consult local ward office","Consider professional assessment"],
    data_sources:["BBMP","CGWB"],_fallback:true,_ward:w.key
  };
}