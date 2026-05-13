export default function StepDot({ n, current, label }) {
  const done = n < current, active = n === current;
  let bg = "#9ca3af", bc = "#d1d5db", tc = "#6b7280";
  if (done) { bg = "#059669"; bc = "#059669"; tc = "#fff"; }
  else if (active) { bg = "#d97706"; bc = "#d97706"; tc = "#fff"; }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: active || done ? bg : "#f3f4f6", border: `2px solid ${bc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "700", color: tc }}>
        {done ? "\u2713" : n + 1}
      </div>
      <span style={{ fontSize: "0.7rem", color: active ? "#d97706" : done ? "#059669" : "#9ca3af", fontWeight: active ? "600" : "400" }}>{label}</span>
    </div>
  );
}