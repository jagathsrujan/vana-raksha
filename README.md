# VanaRaksha — Bengaluru Climate Risk Assessment

**A single-page web app that assesses flood, heat island (UHI), and water stress risk for any Bengaluru property using AI-powered visual analysis and ward-level data.**

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to use the app.

## What It Does

1. **Enter a location** — address, ward name, or PIN code
2. **Add context** — property type, intent, optional photos and witness testimonies
3. **Run AI analysis** — Gemini 2.0 Flash analyzes photos and synthesizes a risk score
4. **Get a risk card** — composite score (0–100), per-dimension breakdowns, flags, and recommendations

## Tech Stack

- **Framework:** React (Vite)
- **AI:** OpenAI GPT-5.4-mini via OpenCode Zen API
- **Proxy:** Cloudflare Worker (hides API key)
- **Styling:** Inline CSS only (zero dependencies)
- **Data:** `src/data/WARD_DB.js` — 25 ward-level climate baselines

## Project Structure

```
├── src/
│   ├── VanaRaksha.jsx           # Main component
│   ├── data/
│   │   └── WARD_DB.js           # Ward-level database (25 wards)
│   ├── utils/
│   │   ├── matchWard.js         # Ward matching + nearest interpolation
│   │   ├── buildPrompt.js       # AI system prompt builder
│   │   ├── fallback.js          # Deterministic fallback engine
│   │   └── parseResult.js       # AI response parser + validator
│   └── components/
│       ├── ScoreGauge.jsx       # SVG donut gauge
│       ├── TierBadge.jsx        # Colored tier pill
│       ├── WardCard.jsx         # Ward baseline display
│       ├── StepDot.jsx          # Step indicator
│       └── CoverageMap.jsx      # SVG coverage map
├── docs/
│   ├── architecture.md          # System architecture
│   ├── data-methodology.md     # Scoring methodology + citations
│   └── data-sources.md         # All data sources with URLs
├── agents/
│   ├── research-prompt.md      # Agent prompt for building WARD_DB
│   └── runs/                   # Past agent run outputs
├── PROGRESS.md                 # Milestone tracker
├── DECISIONS.md                # Decision log with rationale
└── AGENTS.md                   # Agent run instructions & history
```

## API Key Setup

1. Get a free API key from [Google AI Studio](https://aistudio.google.com)
2. Create `.env` file (copy `.env.example`)
3. For production: deploy proxy via Cloudflare Worker (see `docs/architecture.md`)

## Status

| Component | Status |
|---|---|
| Architecture | ✅ Decisions locked |
| WARD_DB v1.0 | 🔄 Agent research in progress |
| Ward matching | 🔄 Pending |
| UI components | 🔄 Pending |
| AI pipeline | 🔄 Pending |
| Integration | 🔄 Pending |

## License

Open source — MIT
