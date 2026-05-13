import { useMemo } from "react";

export default function ScoreGauge({ score = 0, tier = "Medium", label = "", confidence = "Medium" }) {
  const size = 160, strokeWidth = 14, radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius, offset = circumference - (score / 100) * circumference;
  const TC = { Low: "#059669", Medium: "#d97706", High: "#dc2626", Critical: "#7f1d1d" };
  const TCbg = { Low: "#d1fae5", Medium: "#fef3c7", High: "#fee2e2", Critical: "#991b1b" };
  const tierColor = TC[tier] || "#6b7280", tierBg = TCbg[tier] || "#f3f4f6";
  const confidenceOpacity = confidence === "High" ? 1 : confidence === "Medium" ? 0.7 : 0.4;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} opacity={0.3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={tierColor} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} opacity={confidenceOpacity}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        {[0, 25, 50, 75, 100].map(tick => {
          const angle = (tick / 100) * 2 * Math.PI;
          const x1 = size / 2 + (radius + strokeWidth / 2 + 2) * Math.cos(angle - Math.PI / 2);
          const y1 = size / 2 + (radius + strokeWidth / 2 + 2) * Math.sin(angle - Math.PI / 2);
          const x2 = size / 2 + (radius + strokeWidth / 2 + 7) * Math.cos(angle - Math.PI / 2);
          const y2 = size / 2 + (radius + strokeWidth / 2 + 7) * Math.sin(angle - Math.PI / 2);
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="1" />;
        })}
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontSize: "1.8rem", fontWeight: "800", color: tierColor, lineHeight: 1 }}>{Math.round(score)}</div>
        <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "2px" }}>/ 100</div>
      </div>
      <div style={{ marginTop: "8px" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{label}</div>
        <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: tierBg, color: tierColor, marginTop: "4px" }}>{tier}</span>
        <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>Confidence: {confidence}</div>
      </div>
    </div>
  );
}