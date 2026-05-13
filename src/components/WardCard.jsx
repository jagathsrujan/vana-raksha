import TierBadge from "./TierBadge";

export default function WardCard({ ward, isInterpolated = false }) {
  if (!ward) return null;
  return (
    <div style={{marginTop:16,padding:16,borderRadius:12,backgroundColor:isInterpolated?"#fffbeb":"#f0fdf4",border:`1px solid ${isInterpolated?"#f59e0b":"#bbf7d0"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h3 style={{margin:0,fontSize:"1.1rem"}}>{ward.label}{isInterpolated && <span style={{fontSize:"0.75rem",fontWeight:"normal",color:"#b45309",marginLeft:8}}>(~{ward.interpolationDistanceKm||"?"} km away, -{ward.confidencePenaltyPct||0}%)</span>}</h3>
        <TierBadge tier={ward.flood} />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
        {["\ud83c\udf0a Flood","\ud83c\udf21\ufe0f UHI","\ud83d\udca7 Water"].map((l,i) => {
          const t = [ward.flood,ward.uhi,ward.water][i];
          return <div key={i} style={{fontSize:"0.8rem",textAlign:"center"}}><div style={{fontWeight:"600",color:"#dc2626"}}>{l}</div><TierBadge tier={t} size="sm" /></div>;
        })}
      </div>
      {ward.notes && <p style={{fontSize:"0.85rem",color:"#4b5563",margin:0,fontStyle:"italic"}}>{ward.notes}</p>}
      {isInterpolated && <div style={{marginTop:8,padding:8,backgroundColor:"#fef3c7",borderRadius:6,fontSize:"0.8rem",color:"#92400e"}}>\u26a0\ufe0f {ward.interpolationNote||"Interpolated from nearest zone"}</div>}
    </div>
  );
}