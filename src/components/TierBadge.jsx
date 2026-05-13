export default function TierBadge({ tier = "Medium", size = "md" }) {
  const TC = { Low:{bg:"#d1fae5",border:"#059669",text:"#065f46"}, Medium:{bg:"#fef3c7",border:"#d97706",text:"#92400e"}, High:{bg:"#fee2e2",border:"#dc2626",text:"#991b1b"}, Critical:{bg:"#7f1d1d",border:"#991b1b",text:"#fca5a5"} };
  const s = TC[tier] || TC.Medium;
  const sz = {sm:{p:"2px 8px",f:"0.75rem",br:"4px"},md:{p:"4px 12px",f:"0.85rem",br:"6px"},lg:{p:"6px 16px",f:"1rem",br:"8px"}}[size];
  return <span style={{display:"inline-block",backgroundColor:s.bg,border:`2px solid ${s.border}`,color:s.text,fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.5px",padding:sz.p,fontSize:sz.f,borderRadius:sz.br}}>{tier}</span>;
}