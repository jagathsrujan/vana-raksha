# VanaRaksha — Decision Log

Every architectural and design decision is recorded here with date, rationale, and trade-offs.

---

## 2026-05-13 — Session 1: Architecture & Core Decisions

### D1: No Backend (Static Frontend Only)
- **Decision:** Pure client-side React app, no server/backend.
- **Rationale:** Competition demo, time-limited, free hosting on Vercel/Netlify.
- **Trade-off:** API key must be proxied (see D2). No persistent user accounts or history.

### D2: API Key Security via Cloudflare Worker Proxy
- **Decision:** All API calls route through a Cloudflare Worker (free tier, 100K req/day).
- **Rationale:** Client-side API keys are trivially extractable. Worker acts as thin proxy, key stored as Cloudflare secret.
- **Trade-off:** Adds one deployment step. Acceptable for competition window.

### D3: LLM Provider — Google Gemini 2.0 Flash
- **Decision:** Primary model is Google Gemini 2.0 Flash via AI Studio (free).
- **Rationale:** Free, supports vision + JSON mode, fast, generous rate limits. Groq as fallback for text-only synthesis.
- **Trade-off:** Gemini's reasoning depth may be slightly less than Claude Sonnet. Acceptable for demo.

### D4: Scoring Methodology — AI-Dynamic Weights + Published Citations
- **Decision:** No fixed formula. AI assigns dynamic weights per case. Output cites published research and data sources.
- **Rationale:** Domain expert judges will challenge static formulas. Dynamic weighting + citations shows methodological rigor.
- **Trade-off:** Less deterministic, harder to unit-test. Mitigated by JSON schema validation.

### D5: WARD_DB — Single File, 25 Wards
- **Decision:** One `WARD_DB.js` file containing all 25 wards. Expand coverage via nearest-zone interpolation.
- **Rationale:** Single file is easier to audit, version control, and import. 25 wards cover largest/most significant areas.
- **Trade-off:** File will be 50–100KB when fully populated. Split when scaling past 80 wards.

### D6: Ward Selection — 25 Largest/Most Significant
- **Decision:** 25 wards spanning all 8 BBMP zones, prioritized by population and climate significance.
- **Rationale:** Covers maximum population exposure and all major risk zones. Domain experts expect geographic diversity.
- **Trade-off:** 87% of Bengaluru wards not individually covered. Interpolation + coverage map mitigates.

### D7: Nearest-Zone Interpolation with Confidence Penalty
- **Decision:** Unmatched wards find nearest WARD_DB ward by haversine distance. Score penalized -5% per km (max -30%).
- **Rationale:** Shows spatial reasoning and intellectual honesty. Judges will appreciate transparency about data gaps.
- **Trade-off:** Penalty formula is heuristic. Could be refined with actual spatial analysis later.

### D8: Progress Tracking in Repo
- **Decision:** PROGRESS.md, DECISIONS.md, AGENTS.md track all milestones, decisions, and agent runs.
- **Rationale:** Enables multiple agents/iterations without losing context. Judges can audit decision history.
- **Trade-off:** Requires discipline to update after every change. Worth it for competition rigor.