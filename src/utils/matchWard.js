import { useMemo } from "react";
import { WARD_DB } from "../data/WARD_DB";

const KEYWORD_MAP = {
  koramangala:["koramangala","kormangala","kc valley","80 feet road","dairy circle"],
  bommanahalli:["bommanahalli"], btm_layout:["btm","btm layout"],
  hsr_layout:["hsr","hsr layout"], whitefield:["whitefield","itpl","kadugodi"],
  varthur:["varthur"], mahadevapura:["mahavadevapura"],
  krishnarajapuram:["krishnarajapuram","krpuram"], hoodi:["hoodi"],
  rajajinagar:["rajajinagar"], vijayanagar:["vijayanagar"],
  basaveshwaranagar:["basaveshwaranagar"], nagarbhavi:["nagarbhavi"],
  mahalakshmi_layout:["mahalakshmi layout"], yelahanka:["yelahanka"],
  hebbal:["hebbal"], jakkur:["jakkur"], dasarahalli:["dasarahalli"],
  mathikere:["mathikere"], jayanagar:["jayanagar"],
  jp_nagar:["jp nagar"], wilson_garden:["wilson garden"],
  banashankari:["banashankari"], girinagar:["girinagar"],
  kengeri:["kengeri"], uttarahalli:["uttarahalli"]
};

function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b.charAt(i-1)===a.charAt(j-1)?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length];}

export function matchWard(address="",ward="",pin=""){
  const c=(address+" "+ward+" "+pin).toLowerCase().trim();
  if(!c||c===" ")return null;
  for(const[k,d]of Object.entries(WARD_DB)){if(!d.pins)continue;if(d.pins.some(p=>c.includes(p.replace(/\s/g,""))))return{...d,isInterpolated:false,matchType:"pin"};}
  for(const[k,ks]of Object.entries(KEYWORD_MAP)){if(ks.some(kw=>c.includes(kw.toLowerCase()))){const d=WARD_DB[k];if(d)return{...d,isInterpolated:false,matchType:"keyword"};} }
  for(const wd of c.split(/\s+/)){for(const[k,ks]of Object.entries(KEYWORD_MAP)){for(const kw of ks){if(wd.length>=4&&(kw.includes(wd)||lev(wd,kw)<=2)){const d=WARD_DB[k];if(d)return{...d,isInterpolated:true,matchType:"fuzzy",confidencePenaltyPct:15,interpolationNote:`Fuzzy match to ${d.label}`};}}} }
  return null;
}