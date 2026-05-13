import { useState, useMemo } from "react";
import { WARD_DB, _metadata } from "./data/WARD_DB";
import { matchWard } from "./utils/matchWard";
import { buildSystemPrompt } from "./utils/buildPrompt";
import { buildFallback } from "./utils/fallback";
import { parseAIResponse } from "./utils/parseResult";
import ScoreGauge from "./components/ScoreGauge";
import TierBadge from "./components/TierBadge";
import WardCard from "./components/WardCard";
import StepDot from "./components/StepDot";
import CoverageMap from "./components/CoverageMap";

const TC = { Low:{bg:"#d1fae5",border:"#059669"}, Medium:{bg:"#fef3c7",border:"#d97706"}, High:{bg:"#fee2e2",border:"#dc2626"}, Critical:{bg:"#991b1b",border:"#7f1d1d"} };

export default function VanaRaksha() {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState({address:"", ward:"", pin:""});
  const [propertyType, setPropertyType] = useState("");
  const [userIntent, setUserIntent] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [apiError, setApiError] = useState(null);
  const matchedWard = useMemo(() => matchWard(location.address, location.ward, location.pin), [location]);

  const analyzePhoto = async (photo, ward) => {
    const prompt = buildSystemPrompt(ward);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt},{inline_data:{mime_type:photo.mediaType,data:photo.base64}}]},{role:"user",parts:[{text:"Analyze this photo for climate risk signals. Respond ONLY as valid JSON with flood_signals, heat_signals, water_signals arrays, key_observation, and confidence as Low/Medium/High."}]}],
        generationConfig:{response_mime_type:"application/json",temperature:0.1}})});
      const json = await resp.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? JSON.parse(text) : {flood_signals:[],heat_signals:[],water_signals:[],key_observation:"No data",confidence:"Low"};
    } catch(e) {
      console.error("Photo analysis failed",e);
      return {flood_signals:[],heat_signals:[],water_signals:[],key_observation:"Analysis failed",confidence:"Low"};
    }
  };

  const runSynthesis = async () => {
    const photoSection = photos.map((p,i) => `Photo ${i+1}: ${p.why||'No annotation'} | Tags: ${(p.tags||[]).join(',')}`).join("\\n");
    const testimonySection = testimonies.map(t => `- ${t.who||'Anonymous'} (${t.concern}, credibility ${t.credibility}/5): "${t.said}"`).join("\\n");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `Analyze this Bengaluru property for climate risk.
Location: ${location.address} ${location.ward} ${location.pin}
Ward: ${matchedWard?.label||'Unknown'} | Type: ${propertyType} | Intent: ${userIntent}
Notes: ${notes}

Photos:\\n${photoSection||'None'}

Testimony:\\n${testimonySection||'None'}

Respond ONLY as valid JSON with: composite_score (0-100), composite_tier, flood/uhi/water each with score+tier+confidence+reasoning, compound_risk, executive_summary, flags[], recommendations[], data_sources[]`;

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}], generationConfig:{response_mime_type:"application/json",temperature:0.1}})
    });
    const json = await resp.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : null;
  };

  const handleRunAnalysis = async () => {
    setLoading(true); setApiError(null); setResult(null);
    try {
      const pa = [];
      for (let i = 0; i < Math.min(photos.length, 5); i++) {
        setLoadingMsg(`Analyzing photo ${i+1} of ${Math.min(photos.length,5)}...`);
        pa.push(await analyzePhoto(photos[i], matchedWard));
      }
      setLoadingMsg("Synthesizing risk assessment...");
      const synthesis = await runSynthesis();
      if (synthesis) {
        const parsed = parseAIResponse(JSON.stringify(synthesis), "synthesis");
        setResult(parsed.ok ? parsed.data : buildFallback(matchedWard));
      } else {
        if (matchedWard) setResult(buildFallback(matchedWard));
      }
      setStep(5);
    } catch(e) {
      console.error(e);
      setApiError(e.message);
      if (matchedWard) setResult(buildFallback(matchedWard));
    } finally {
      setLoading(false); setLoadingMsg("");
    }
  };

  const steps = ["","Location","Property","Photos","Testimony","Results"];
  return (
    <div className="vana-raksha">
      <header className="vr-header"><h1>🌿 VanaRaksha</h1><p>Bengaluru Climate Risk Assessment</p></header>
      {step < 5 && <div className="vr-step-indicators">{[0,1,2,3,4].map(s => <StepDot key={s} n={s} current={step} label={steps[s]} />)}</div>}

      {step === 0 && <div className="vr-step vr-landing">
        <h2>Understand Climate Risk for Your Bengaluru Property</h2>
        <p>VanaRaksha analyzes flood, heat island (UHI), and water stress risk using satellite imagery, ward data, and AI.</p>
        <div className="vr-three-pillars">
          <div className="vr-pillar" style={{borderColor:"#dc2626"}}><h3>🌊 Flood Risk</h3><p>Historical flooding, drainage, terrain</p></div>
          <div className="vr-pillar" style={{borderColor:"#dc2626"}}><h3>🌡️ Urban Heat Island</h3><p>Vegetation, impervious surfaces, temperature</p></div>
          <div className="vr-pillar" style={{borderColor:"#dc2626"}}><h3>💧 Water Stress</h3><p>Groundwater, water supply, rainfall</p></div>
        </div>
        <CoverageMap />
        <p className="vr-covered-wards">Covers {Object.keys(WARD_DB).length} wards across all 8 BBMP zones</p>
        <button className="vr-cta" onClick={() => setStep(1)}>Start Assessment →</button>
      </div>}

      {step === 1 && <div className="vr-step">
        <h2>📍 Step 1: Location</h2>
        <div className="vr-form-group"><label>Street Address / Area</label><input type="text" placeholder="e.g., 80 Feet Road, Koramangala" value={location.address} onChange={e => setLocation(p=>({...p,address:e.target.value}))} /></div>
        <div className="vr-form-group"><label>Ward Name (optional)</label><input type="text" placeholder="e.g., Koramangala" value={location.ward} onChange={e => setLocation(p=>({...p,ward:e.target.value}))} /></div>
        <div className="vr-form-group"><label>PIN Code (optional)</label><input type="text" placeholder="e.g., 560034" value={location.pin} onChange={e => setLocation(p=>({...p,pin:e.target.value}))} /></div>
        {matchedWard && <WardCard ward={matchedWard} />}
        {!matchedWard && location.address && <p className="vr-warning">⚠️ Ward not in database. Will use interpolation or city averages.</p>}
        <div className="vr-nav"><button onClick={()=>setStep(0)}>← Back</button><button onClick={()=>setStep(2)} disabled={!location.address}>Next →</button></div>
      </div>}

      {step === 2 && <div className="vr-step">
        <h2>🏠 Step 2: Property Details</h2>
        <div className="vr-form-group"><label>Property Type</label><div className="vr-selector">{["Residential","Commercial","Agricultural","Institutional"].map(t=><button key={t} className={propertyType===t?"active":""} onClick={()=>setPropertyType(t)}>{t}</button>)}</div></div>
        <div className="vr-form-group"><label>Your Intent</label><div className="vr-selector">{["Home Buyer","Seller","Researcher","Planner"].map(i=><button key={i} className={userIntent===i?"active":""} onClick={()=>setUserIntent(i)}>{i}</button>)}</div></div>
        <div className="vr-form-group"><label>Additional Notes</label><textarea placeholder="Any specific concerns..." value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <div className="vr-nav"><button onClick={()=>setStep(1)}>← Back</button><button onClick={()=>setStep(3)} disabled={!propertyType}>Next →</button></div>
      </div>}

      {step === 3 && <div className="vr-step">
        <h2>📸 Step 3: Photo Evidence</h2>
        <p>Upload up to 5 photos showing conditions around the property.</p>
        <div className="vr-photo-grid">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="vr-photo-card">
              <img src={photo.preview} alt={`Evidence ${idx + 1}`} />
              <textarea placeholder="Why did you take this photo?" value={photo.why} onChange={e => setPhotos(prev => prev.map(p => p.id === photo.id ? {...p, why: e.target.value} : p))} />
              <textarea placeholder="Your assessment of risk" value={photo.assessment} onChange={e => setPhotos(prev => prev.map(p => p.id === photo.id ? {...p, assessment: e.target.value} : p))} />
              <button className="vr-remove-btn" onClick={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}>✕ Remove</button>
            </div>
          ))}
        </div>
        {photos.length < 5 && <button className="vr-add-photo-btn" onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.multiple=true;i.onchange=e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>{setPhotos(prev=>[...prev,{id:Date.now()+Math.random(),base64:ev.target.result.split(",")[1],preview:URL.createObjectURL(f),mediaType:f.type,why:"",assessment:"",tags:[]}])};r.readAsDataURL(f)})};i.click()}}>+ Add Photos ({photos.length}/5)</button>}
        <div className="vr-nav"><button onClick={()=>setStep(2)}>← Back</button><button onClick={()=>setStep(4)}>Next →</button></div>
      </div>}

      {step === 4 && <div className="vr-step">
        <h2>🗣️ Step 4: Local Testimony</h2>
        <p>Add statements from residents, officials, or reports.</p>
        {testimonies.map((t, idx) => (
          <div key={t.id} className="vr-testimony-card">
            <input placeholder="Who said this?" value={t.who} onChange={e => setTestimonies(prev => prev.map(item => item.id === t.id ? {...item, who: e.target.value} : item))} />
            <textarea placeholder="What did they report?" value={t.said} onChange={e => setTestimonies(prev => prev.map(item => item.id === t.id ? {...item, said: e.target.value} : item))} />
            <div className="vr-testimony-row">
              <label>Concern:</label>
              <select value={t.concern} onChange={e => setTestimonies(prev => prev.map(item => item.id === t.id ? {...item, concern: e.target.value} : item))}>{["none","low","medium","high"].map(c => <option key={c} value={c}>{c}</option>)}</select>
              <label>Credibility (1–5):</label>
              <input type="range" min={1} max={5} value={t.credibility} onChange={e => setTestimonies(prev => prev.map(item => item.id === t.id ? {...item, credibility: parseInt(e.target.value)} : item))} />
              <span>{t.credibility}</span>
            </div>
            <button className="vr-remove-btn" onClick={() => setTestimonies(prev => prev.filter(item => item.id !== t.id))}>✕</button>
          </div>
        ))}
        <button className="vr-add-btn" onClick={() => setTestimonies(prev => [...prev, {id:Date.now(),who:"",said:"",concern:"medium",credibility:3}])}>+ Add Testimony</button>
        <div className="vr-nav"><button onClick={()=>setStep(3)}>← Back</button><button onClick={handleRunAnalysis} disabled={loading}>{loading ? "Analyzing..." : "🚀 Run AI Analysis"}</button></div>
        {apiError && <div className="vr-error"><strong>Error:</strong> {apiError}{result && <p>Showing fallback results based on ward baseline data.</p>}</div>}
      </div>}

      {step === 5 && result && <div className="vr-step">
        <h2>📊 Risk Assessment Results</h2>
        <div className="vr-result-header"><h3>Overall Risk: {result.composite_score}/100</h3><TierBadge tier={result.composite_tier} /></div>
        <div className="vr-gauges">
          <ScoreGauge score={result.flood_score} tier={result.flood_tier} label="Flood Risk" confidence={result.flood_confidence} />
          <ScoreGauge score={result.uhi_score} tier={result.uhi_tier} label="Heat Island Risk" confidence={result.uhi_confidence} />
          <ScoreGauge score={result.water_score} tier={result.water_tier} label="Water Stress" confidence={result.water_confidence} />
        </div>
        <div className="vr-reasoning-cards">
          <div className="vr-reasoning-card"><h4>🌊 Flood Analysis</h4><p>{result.flood_reasoning}</p></div>
          <div className="vr-reasoning-card"><h4>🌡️ UHI Analysis</h4><p>{result.uhi_reasoning}</p></div>
          <div className="vr-reasoning-card"><h4>💧 Water Stress Analysis</h4><p>{result.water_reasoning}</p></div>
        </div>
        <div className="vr-compound"><h4>🔗 Compound Risk Interactions</h4><p>{result.compound_risk}</p></div>
        <div className="vr-summary"><h4>📝 Executive Summary</h4><p>{result.executive_summary}</p></div>
        <div className="vr-flags"><h4>🔴 Risk Flags</h4><ul>{(result.flags||[]).map((f,i) => <li key={i}>{f}</li>)}</ul></div>
        <div className="vr-recommendations"><h4>✅ Recommendations</h4><ol>{(result.recommendations||[]).map((r,i) => <li key={i}>{r}</li>)}</ol></div>
        <div className="vr-sources"><h4>📚 Data Sources</h4><div className="vr-source-tags">{(result.data_sources||[]).map((s,i) => <span key={i} className="vr-source-tag">{s}</span>)}</div></div>
        <div className="vr-nav"><button onClick={()=>setStep(0)}>New Assessment</button><button onClick={()=>{setStep(3);setResult(null)}}>Refine with More Data</button></div>
      </div>}
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `
  .vana-raksha{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1e293b}
  .vr-header{text-align:center;margin-bottom:30px}.vr-header h1{font-size:2rem;margin:0}.vr-header p{color:#64748b}
  .vr-step-indicators{display:flex;gap:8px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}
  .vr-step{animation:fadeIn 0.3s ease}@keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .vr-form-group{margin-bottom:16px}.vr-form-group label{display:block;font-weight:600;margin-bottom:4px;font-size:.9rem}
  .vr-form-group input,.vr-form-group textarea,.vr-form-group select{width:100%;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:.95rem;box-sizing:border-box;font-family:inherit}
  .vr-form-group textarea{min-height:80px;resize:vertical}
  .vr-selector{display:flex;gap:8px;flex-wrap:wrap}
  .vr-selector button{padding:8px 16px;border:2px solid #cbd5e1;border-radius:8px;background:white;cursor:pointer;font-size:.9rem;transition:all .2s}
  .vr-selector button.active{border-color:#059669;background:#d1fae5;color:#065f46;font-weight:600}
  .vr-nav{display:flex;justify-content:space-between;margin-top:24px;flex-wrap:wrap;gap:8px}
  .vr-nav button{padding:10px 24px;border:none;border-radius:8px;font-size:.95rem;cursor:pointer;font-weight:600;transition:all .2s}
  .vr-nav button:first-child{background:#f1f5f9;color:#475569}.vr-nav button:last-child{background:#059669;color:white}
  .vr-nav button:disabled{opacity:.5;cursor:not-allowed}
  .vr-cta{display:block;width:100%;padding:16px;background:#059669;color:white;border:none;border-radius:12px;font-size:1.2rem;font-weight:700;cursor:pointer;margin-top:24px}
  .vr-warning{background:#fef3c7;padding:12px;border-radius:8px;color:#92400e;font-size:.9rem}
  .vr-error{background:#fee2e2;padding:12px;border-radius:8px;color:#991b1b;font-size:.9rem;margin-top:16px}
  .vr-three-pillars{display:grid;grid-template-columns:1fr;gap:12px;margin:20px 0}
  .vr-pillar{padding:16px;border-radius:12px;border:2px solid #dc2626;background:#fef2f2}
  .vr-pillar h3{margin:0 0 4px;font-size:1rem}.vr-pillar p{margin:0;font-size:.9rem;color:#64748b}
  .vr-covered-wards{color:#64748b;font-size:.85rem;margin-top:12px}
  .vr-photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
  .vr-photo-card{border:1px solid #e2e8f0;border-radius:8px;padding:8px}
  .vr-photo-card img{width:100%;height:150px;object-fit:cover;border-radius:4px}
  .vr-photo-card textarea{width:100%;min-height:40px;margin-top:4px;font-size:.8rem;padding:6px;box-sizing:border-box}
  .vr-remove-btn{background:none;border:none;color:#dc2626;cursor:pointer;font-size:.85rem;padding:4px}
  .vr-add-photo-btn,.vr-add-btn{display:block;width:100%;padding:12px;border:2px dashed #cbd5e1;background:none;border-radius:8px;color:#64748b;cursor:pointer;font-size:.95rem;margin-top:12px}
  .vr-testimony-card{border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:12px}
  .vr-testimony-row{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
  .vr-testimony-row label,.vr-testimony-row select,.vr-testimony-row input[type=range]{font-size:.85rem}
  .vr-result-header{text-align:center;margin-bottom:24px}
  .vr-gauges{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin:24px 0}
  .vr-reasoning-cards{display:grid;grid-template-columns:1fr;gap:12px;margin:20px 0}
  .vr-reasoning-card{background:#f8fafc;border-radius:8px;padding:16px;border-left:4px solid}
  .vr-reasoning-card:nth-child(1){border-color:#2563eb}.vr-reasoning-card:nth-child(2){border-color:#dc2626}.vr-reasoning-card:nth-child(3){border-color:#059669}
  .vr-reasoning-card h4{margin:0 0 8px;font-size:1rem}.vr-reasoning-card p{margin:0;font-size:.9rem;color:#475569;line-height:1.5}
  .vr-compound,.vr-summary{background:#f0fdf4;border-radius:8px;padding:16px;margin:16px 0}
  .vr-compound h4,.vr-summary h4{margin:0 0 8px}
  .vr-flags ul,.vr-recommendations ol{margin:0;padding-left:20px}
  .vr-flags li,.vr-recommendations li{margin-bottom:8px;font-size:.9rem;line-height:1.4}
  .vr-sources{margin:20px 0}.vr-source-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .vr-source-tag{background:#f1f5f9;padding:4px 10px;border-radius:12px;font-size:.8rem}
`;
document.head.appendChild(style);