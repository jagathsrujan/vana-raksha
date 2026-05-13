import { useState } from "react";
import { WARD_DB } from "../data/WARD_DB";

const BND = {minLat:12.85,maxLat:13.2,minLon:77.4,maxLon:77.85};
const MW=700,MH=500,PD=40;
function gp(lat,lon){return{x:PD+((lon-BND.minLon)/(BND.maxLon-BND.minLon))*(MW-2*PD),y:PD+((BND.maxLat-lat)/(BND.maxLat-BND.minLat))*(MH-2*PD)}};
const WC={whitefield:{lat:12.9698,lon:77.7497},varthur:{lat:12.9882,lon:77.7638},mahavadevapura:{lat:12.9895,lon:77.6972},krishnarajapuram:{lat:12.9523,lon:77.7014},hoodi:{lat:12.9728,lon:77.7389},koramangala:{lat:12.9352,lon:77.6245},bommanahalli:{lat:12.9144,lon:77.6239},btm_layout:{lat:12.9158,lon:77.6101},hsr_layout:{lat:12.9196,lon:77.6489},begur:{lat:12.8981,lon:77.6169},rajajinagar:{lat:12.9753,lon:77.5546},vijayanagar:{lat:12.9657,lon:77.5311},basaveshwaranagar:{lat:12.9778,lon:77.5383},nagarbhavi:{lat:12.9616,lon:77.5136},mahalakshmi_layout:{lat:12.9724,lon:77.5474},yelahanka:{lat:13.1381,lon:77.5919},hebbal:{lat:13.0432,lon:77.5964},jakkur:{lat:13.0694,lon:77.5925},dasarahalli:{lat:13.0447,lon:77.5693},mathikere:{lat:13.0297,lon:77.5841},jayanagar:{lat:12.9367,lon:77.5575},jp_nagar:{lat:12.9091,lon:77.5578},wilson_garden:{lat:12.9502,lon:77.5834},banashankari:{lat:12.9247,lon:77.5455},girinagar:{lat:12.9277,lon:77.5287},kengeri:{lat:12.9887,lon:77.482},uttarahalli:{lat:12.9119,lon:77.5334}};

export default function CoverageMap({userLat,userLon,matchStatus}) {
  const cw=Object.keys(WARD_DB).filter(k=>WARD_DB[k].flood!=null).length,tc=Object.keys(WARD_DB).length;
  return (<div style={{marginTop:20}}>
    <div style={{fontSize:"0.85rem",color:"#6b7280",marginBottom:8}}>Coverage: {cw}/{tc} wards ({(cw/tc*100).toFixed(0)}%)</div>
    <svg width="100%" viewBox={`0 0 ${MW} ${MH}`} style={{maxWidth:700,borderRadius:12,border:"1px solid #e5e7eb",background:"#f8fafc"}}>
      <rect x={20} y={20} width={MW-40} height={MH-40} rx={60} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8,4"/>
      <text x={MW/2} y={25} textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="600">Bengaluru Ward Coverage</text>
      {Object.entries(WARD_DB).map(([k,w]) => {
        const c = WC[k]; if (!c) return null;
        const {x,y} = gp(c.lat,c.lon);
        const hd = w.flood != null && w.ndvi != null;
        return <circle key={k} cx={x} cy={y} r={k==="koramangala" ? 7 : 5} fill={!hd ? "#d1d5db" : k==="koramangala" ? "#059669" : "#3b82f6"} stroke="white" strokeWidth={1} opacity={0.9} />;
      })}
      {userLat && userLon && <circle cx={gp(userLat,userLon).x} cy={gp(userLat,userLon).y} r={10} fill="none" stroke="#ef4444" strokeWidth={3} strokeDasharray="4,3" />}
      <g transform={`translate(${MW-180},${MH-80})`}>
        <rect x={0} y={-20} width={170} height={90} rx={6} fill="white" stroke="#e5e7eb" opacity={0.95}/>
        <circle cx={12} cy={0} r={5} fill="#059669"/><text x={24} y={4} fontSize="10" fill="#1e293b">Verified</text>
        <circle cx={12} cy={20} r={5} fill="#3b82f6"/><text x={24} y={24} fontSize="10" fill="#1e293b">In DB</text>
        <circle cx={12} cy={40} r={5} fill="#d1d5db"/><text x={24} y={44} fontSize="10" fill="#1e293b">Uncovered</text>
      </g>
    </svg>
  </div>);
}