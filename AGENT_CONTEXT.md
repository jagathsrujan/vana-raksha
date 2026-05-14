# AGENT_CONTEXT.md
# VanaRaksha — AI Agent Context Document
# READ THIS FILE FIRST before making any changes to the repo.

═══════════════════════════════════════════════════════════════════
1. PROJECT SUMMARY
═══════════════════════════════════════════════════════════════════

VanaRaksha is a single-page React web app that assesses climate risk
for any Bengaluru property across three dimensions:
  - Flood Risk
  - Urban Heat Island (UHI) Risk
  - Water Stress

Target users: domain expert judges (urban planners, climate researchers).

Architecture: static React SPA (no backend server). All logic runs in
the browser. Data is embedded in a JS file (WARD_DB.js). AI analysis
uses Google Gemini 2.0 Flash API via direct browser fetch. A
Cloudflare Worker proxy was planned but is NOT yet wired up.

═══════════════════════════════════════════════════════════════════
2. TECH STACK & HARD CONSTRAINTS
═══════════════════════════════════════════════════════════════════

- React 18 via Vite 5.4
- NO external UI libraries (no Tailwind, no Chakra, no MUI, no Bootstrap)
- Styling: CSS custom properties defined in a global stylesheet or <style> tag
- Icons: inline SVG only (no icon libraries)
- Fonts: Google Fonts CDN link in index.html — Inter + JetBrains Mono
- No new npm dependencies allowed
- All images/icons must be SVG or inline data URIs (no external URLs)
- App must work with VITE_GEMINI_API_KEY="" (empty string) — fallback engine handles all scoring
- All responsive behavior via CSS media queries — NO JS-based responsive logic

═══════════════════════════════════════════════════════════════════
3. REPO FILE MAP
═══════════════════════════════════════════════════════════════════

FILES TO UNDERSTAND (read-only, do not modify):
  src/data/WARD_DB.js        — 27 wards × 29 fields each, the core database
  src/utils/matchWard.js     — 3-pass geocoding engine (PIN → keyword → fuzzy)
  src/utils/buildPrompt.js   — builds Gemini system prompt from ward data
  src/utils/fallback.js      — deterministic scoring when AI unavailable (NOW QUANTITATIVE)
  src/utils/parseResult.js   — strict JSON schema validator for AI responses
  index.html                 — Vite entry point, add font CDN link here
  package.json               — do not change dependencies
  vite.config.js             — do not change
  docs/architecture.md       — system architecture docs
  docs/data-methodology.md   — scoring methodology and tier thresholds
  docs/data-sources.md       — all free data sources with URLs
  agents/research-prompt.md  — agent prompt for expanding WARD_DB

FILES TO REWRITE/CREATE for frontend UI work:
  src/VanaRaksha.jsx              — main app component (5-step wizard)
  src/App.css                     — all global and component styles
  src/components/AppHeader.jsx    — sticky top bar with logo + nav links
  src/components/AppFooter.jsx    — fixed bottom stepper bar
  src/components/AppSection.jsx   — reusable section wrapper
  src/components/ScoreGauge.jsx   — SVG donut gauge with tier color + confidence opacity
  src/components/TierBadge.jsx    — colored tier pill (Low/Medium/High/Critical)
  src/components/WardCard.jsx     — ward summary card with tier badges
  src/components/CoverageMap.jsx  — SVG map of all 25+ wards
  src/components/StepDot.jsx      — stepper indicator dot
  src/components/FormInput.jsx       — styled text input
  src/components/FormTextarea.jsx    — styled textarea
  src/components/Button.jsx          — styled button (primary/secondary/danger)
  src/components/PillSelector.jsx    — toggle button group (for Property/Intent)
  src/components/DropZone.jsx        — photo upload drop zone
  src/components/ProgressTracker.jsx — animated progress bar
  src/components/ReasonCard.jsx      — reasoning display card (for results)
  src/components/SummaryCard.jsx     — summary/info card
  src/components/PrintCSS.jsx        — print-only stylesheet component

ASSETS TO CREATE:
  src/assets/logo.svg              — shield + leaf icon
  src/assets/hero-illustration.svg — landing page illustration
  src/assets/icons/flood.svg
  src/assets/icons/heat.svg
  src/assets/icons/water.svg
  src/assets/icons/location.svg
  src/assets/icons/photo.svg
  src/assets/icons/testimony.svg
  src/assets/icons/check.svg
  src/assets/icons/warning.svg

═══════════════════════════════════════════════════════════════════
4. WARD_DB SCHEMA (per ward object)
═══════════════════════════════════════════════════════════════════

Identity:
  key:              string (slug, e.g. "koramangala")
  label:            string (display name, e.g. "Koramangala")
  zone:             string (BBMP zone, e.g. "Bommanahalli")
  pins:             string[] (e.g. ["560034", "560095"])
  lat:              number (e.g. 12.93521)
  lon:              number (e.g. 77.62446)
  area_sqkm:        number | null

Risk Tiers:
  flood:            string — "Critical" | "High" | "Moderate-High" | "Moderate" | "Low-Moderate" | "Low"
  uhi:              string — same options
  water:            string — same options

Quantitative:
  ndvi:             number | null (0 to ~0.6, higher = more green)
  impervious_pct:   number | null (0 to 100)
  lake_count:       number | null
  lake_area_sqkm:   number | null
  lake_names:       string[]
  pop_density:      number | null (persons per sq km)
  drainage_km_per_sqkm: number | null
  soil_type:        string | null (e.g. "Clay-Loam", "Laterite", "Sandy")
  flood_events_10yr: number | null
  water_table_depth_m: number | null
  water_table_year: number | null
  annual_rainage_mm: number | null
  rainfall_station: string | null
  bwssb_sewer_coverage_pct: number | null

Context (text descriptions):
  elevation:        string | null
  flood_incidents:  string | null
  uhi_delta:        string | null (e.g. "+3.5 degC above city mean (MODIS LST)")
  groundwater:      string | null
  bwssb:            string | null
  lakes_nalas:      string | null
  notes:            string | null
  has_landfill_nearby: boolean | null

Provenance:
  _sources:         object — field-name → source description string
  _known_gaps:      string[]
  _proxy_note:      string | null

Interpolation flags (added by matchWard, not in WARD_DB):
  isInterpolated:   boolean
  matchType:        "pin" | "keyword" | "fuzzy"
  confidencePenaltyPct: number | undefined
  interpolationNote: string | undefined

═══════════════════════════════════════════════════════════════════
5. DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════

User Input (address / ward / PIN)
       │
       ▼
matchWard.js  ──►  Returns matched ward object (or null)
       │               - Pass 1: exact PIN match
       │               - Pass 2: keyword map match
       │               - Pass 3: fuzzy Levenshtein match (penalized 15%)
       ▼
User fills: Property Type, Intent, Notes, Photos (up to 5), Testimonies
       │
       ▼
Photo Analysis (if photos uploaded):
  For each photo → analyzePhoto() → Gemini Vision API
  Returns: { flood_signals[], heat_signals[], water_signals[], key_observation, confidence }
  Result stored on photo.aiAnalysis
       │
       ▼
Synthesis (runSynthesis()):
  buildPhotoEvidence() formats all photo.aiAnalysis results
  Prompt = city baseline + ward data + photo evidence + testimony
  Sent to Gemini 2.0 Flash
       │
       ▼
parseResult.js validates JSON schema
  ├─ Valid → display results
  └─ Invalid / null → buildFallback(matchedWard)
       │
       ▼
fallback.js (quantitative):
  floodScore()  = f(flood_events_10yr, impervious_pct, drainage, lakes, soil)
  uhiScore()    = f(ndvi, impervious_pct, pop_density, uhi_delta)
  waterScore()  = f(water_table_depth, bwssb_coverage, landfill, rainfall)
  composite     = flood*0.4 + uhi*0.3 + water*0.3
       │
       ▼
Display Results: ScoreGauge + TierBadge + WardCard + CoverageMap + Reasoning

═══════════════════════════════════════════════════════════════════
6. OBJECT SHAPES (JS type definitions)
═══════════════════════════════════════════════════════════════════

/* Photo object — stored in React state */
{
  id: number|string,
  base64: string,           // base64-encoded image data
  preview: string,          // URL.createObjectURL result
  mediaType: string,        // e.g. "image/jpeg"
  why: string,              // user annotation
  assessment: string,       // user risk assessment
  tags: string[],           // currently always empty (UI not exposed)
  aiAnalysis: {             // from analyzePhoto(), may be undefined
    flood_signals: string[],
    heat_signals: string[],
    water_signals: string[],
    key_observation: string,
    confidence: "Low" | "Medium" | "High"
  } | null
}

/* Testimony object — stored in React state */
{
  id: number,
  who: string,              // person or source name
  said: string,             // testimony text
  concern: "none" | "low" | "medium" | "high",
  credibility: number       // 1-5
}

/* matchWard() return value */
{
  ...wardObject,            // all fields from WARD_DB
  isInterpolated: boolean,
  matchType: "pin" | "keyword" | "fuzzy",
  confidencePenaltyPct: number | undefined,
  interpolationNote: string | undefined
}
OR null if no match found

/* fallback.js / AI synthesis output */
{
  composite_score: number,          // 0-100
  composite_tier: string,           // "Low" | "Medium" | "High" | "Critical"
  flood_score: number | null,
  flood_tier: string,
  flood_confidence: string,
  flood_reasoning: string,
  uhi_score: number | null,
  uhi_tier: string,
  uhi_confidence: string,
  uhi_reasoning: string,
  water_score: number | null,
  water_tier: string,
  water_confidence: string,
  water_reasoning: string,
  compound_risk: string,
  executive_summary: string,
  flags: string[],
  recommendations: string[],
  data_sources: string[],
  _fallback: boolean,
  _ward: string | undefined        // ward key, only in fallback mode
}

// Tier-to-score mapping in fallback:
// Low = 22, Medium = 50, High = 72, Critical = 88

// Confidence in fallback:
// High   = ≥75% of 11 expected data fields present
// Medium = ≥40%
// Low    = <40%

// Score range: 0-100
// Tier thresholds:  <30 = Low, 30-54 = Medium, 55-74 = High, ≥75 = Critical

/* App state (VanaRaksha.jsx useState) */
{
  step: number,                   // 0-5
  location: { address, ward, pin },
  propertyType: string,           // "" | "Residential" | "Commercial" | "Agricultural" | "Institutional"
  userIntent: string,             // "" | "Home Buyer" | "Seller" | "Researcher" | "Planner"
  notes: string,
  photos: PhotoObject[],
  testimonies: TestimonyObject[],
  result: SynthesisResult | null,
  loading: boolean,
  loadingMsg: string,
  apiError: string | null
}

═══════════════════════════════════════════════════════════════════
7. EXISTING COMPONENTS (their current props/behavior)
═══════════════════════════════════════════════════════════════════

/* ScoreGauge.jsx */
Props: score (number 0-100), tier (string), label (string), confidence (string)
- Renders SVG donut chart, 160×160px
- Confidence controls opacity: High=1, Medium=0.7, Low=0.4
- Displays score number in center, label below, tier badge, confidence text
- Uses tier colors: Low=#059669, Medium=#d97706, High=#dc2626, Critical=#7f1d1d

/* TierBadge.jsx */
Props: tier (string), size ("sm" | "md" | "lg" — default "md")
- Renders colored pill with tier text
- Size variants: sm=small padding, md=medium, lg=large

/* WardCard.jsx */
Props: ward (object), isInterpolated (boolean, default false)
- Shows ward label, flood TierBadge
- 3-column row with 🌊🌡️💧 tier badges
- Shows ward.notes if available
- Shows interpolation warning if isInterpolated
- Background: #f0fdf4 if normal, #fffbeb if interpolated

/* CoverageMap.jsx */
Props: userLat (number|null), userLon (number|null), matchStatus (optional)
- SVG map 700×500 viewBox
- Projects ward lat/lon to pixel coords using bounding box:
  lat 12.85-13.20, lon 77.40-77.85
- Circle colors: verified=#059669, in-db=#3b82f6, uncovered=#d1d5db
- Koramangala is larger (7px radius) and green
- Legend box in top-right corner
- Red pulsing circle for user location (if lat/lon provided)

/* StepDot.jsx */
Props: n (number), current (number), label (string)
- Used in landing page for step indicators (steps 0-4)

═══════════════════════════════════════════════════════════════════
8. DESIGN SYSTEM TOKENS
═══════════════════════════════════════════════════════════════════

/* CSS Custom Properties — define in :root or App.css */
--primary:          #059669
--primary-light:    #d1fae5
--primary-dark:     #065f46
--danger:           #dc2626
--danger-light:     #fee2e2
--danger-dark:      #991b1b
--warning:          #d97706
--warning-light:    #fef3c7
--info:             #2563eb
--info-light:       #dbeafe
--text-primary:     #1e293b
--text-secondary:   #475569
--text-muted:       #64748b
--border:           #cbd5e1
--border-light:     #e2e8f0
--bg-primary:       #ffffff
--bg-secondary:     #f8fafc
--bg-tertiary:      #f0fdf4
--bg-card:          #ffffff
--shadow-sm:        0 1px 2px rgba(0,0,0,0.05)
--shadow-md:        0 4px 6px rgba(0,0,0,0.07)
--shadow-lg:        0 10px 15px rgba(0,0,0,0.1)
--radius-sm:        6px
--radius-md:        8px
--radius-lg:        12px
--radius-xl:        16px
--radius-full:      9999px
--font-primary:     'Inter', system-ui, -apple-system, sans-serif
--font-mono:        'JetBrains Mono', 'Fira Code', monospace
--space-xs:         4px
--space-sm:         8px
--space-md:         16px
--space-lg:         24px
--space-xl:         32px
--space-2xl:        48px
--font-xs:          0.75rem
--font-sm:          0.85rem
--font-base:        0.95rem
--font-lg:          1.15rem
--font-xl:          1.4rem
--font-2xl:         1.8rem
--font-3xl:         2rem

/* Tier Colors */
Tier "Low":      bg=#d1fae5  border=#059669  text=#065f46   accent=#059669
Tier "Medium":   bg=#fef3c7  border=#d97706  text=#92400e   accent=#d97706
Tier "High":     bg=#fee2e2  border=#dc2626  text=#991b1b   accent=#dc2626
Tier "Critical": bg=#991b1b  border=#7f1d1d  text=#fca5a5   accent=#7f1d1d

/* Container */
max-width: 860px, margin: 0 auto, padding: 0 var(--space-md)

/* Google Fonts (add to index.html <head>) */
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

═══════════════════════════════════════════════════════════════════
9. RESPONSIVE BREAKPOINTS
═══════════════════════════════════════════════════════════════════

< 640px (Mobile):
  - Form fields full width
  - Photo grid: 1 column
  - Score gauges: stacked vertically, full width
  - Reason cards: stacked
  - Step indicator in footer: dots only, hide labels
  - WardCard: single column
  - CoverageMap: full width, reduced height

640px - 1023px (Tablet):
  - Form fields full width with comfortable padding
  - Photo grid: 2 columns
  - Score gauges: row of 3 (allow horizontal scroll if needed)
  - Reason cards: 1 column
  - Step indicator: show mini labels

≥ 1024px (Desktop):
  - Max-width container 860px
  - Photo grid: repeat(auto-fill, minmax(180px, 1fr))
  - Score gauges: 3 in a row
  - Reason cards: 3 in a row
  - Full step indicator labels visible

═══════════════════════════════════════════════════════════════════
10. ACCESSIBILITY REQUIREMENTS (MANDATORY)
═══════════════════════════════════════════════════════════════════

1. Semantic HTML:
   - <main> wrapping app content
   - <header> with app title
   - <section> for each step
   - <fieldset> + <legend> for form groups (Property Type, Intent)
   - <nav aria-label="Progress"> for step indicator footer
   - <button> for ALL interactive elements
   - <label> properly associated with every input via htmlFor/id

2. ARIA attributes:
   - aria-live="polite" on loading/status messages
   - aria-label on icon-only buttons
   - role="progressbar" on step indicator
   - aria-valuenow/aria-valuemin/aria-valuemax on progress bar
   - aria-describedby linking inputs to helper text
   - aria-expanded on collapsible sections
   - aria-current="step" on active step indicator

3. Keyboard navigation:
   - Logical tab order through all form fields
   - Enter/Space activates buttons
   - Escape dismisses error states
   - Focus returns to relevant element after step transitions
   - Focus visible (outline) on all interactive elements

4. Focus management:
   - When transitioning to a new step, focus the heading (h2) of that step
   - When error appears, focus the error message container
   - After photo upload completes, focus the first photo card

5. Color contrast:
   - All text must pass WCAG AA (4.5:1 for normal text, 3:1 for large text)
   - Tier badges: ensure text is readable against background
   - Do NOT rely on color alone — always include text labels

6. Reduced motion:
   - @media (prefers-reduced-motion: reduce) — disable ALL animations
   - Gauges fill instantly, no transitions, no pulsing

7. Touch targets:
   - Minimum 44x44px on touch devices
   - Adequate spacing between interactive elements

═══════════════════════════════════════════════════════════════════
11. BUILD & RUN INSTRUCTIONS
═══════════════════════════════════════════════════════════════════

# Install dependencies (one time)
npm install

# Create environment file (required for fallback-only mode)
echo "VITE_GEMINI_API_KEY=" > .env.local

# Start dev server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

═══════════════════════════════════════════════════════════════════
12. TASK QUEUE (Build in this order)
═══════════════════════════════════════════════════════════════════

PHASE 1: Run As-Is (verify current state)
  [ ] Install deps, start dev server, confirm localhost:5173 works
  [ ] Click through all 5 steps with no API key (fallback engine)
  [ ] Test with Koramangala (PIN 560034) — should show High/Critical scores
  [ ] Test with Vijayanagar (PIN 560040) — should show Medium scores
  [ ] Test with HSR Layout (PIN 560102) — should show Medium scores
  [ ] Verify scores differ between wards (quantitative fallback working)
  [ ] Upload photos, verify no crash
  [ ] Test "Refine with More Data" button

PHASE 2: Global Styles & Design System
  [ ] Create src/App.css with all design tokens from Section 8
  [ ] Import App.css in src/main.jsx or index.html
  [ ] Add Google Fonts CDN link to index.html
  [ ] Replace all inline styles with CSS class-based styles
  [ ] Verify responsive behavior at <640px, 640-1023px, ≥1024px
  [ ] Verify WCAG AA color contrast on all text/background combos
  [ ] Verify prefers-reduced-motion disables animations

PHASE 3: Layout Components
  [ ] Build AppHeader — sticky top bar with logo + About/Methodology links
  [ ] Build AppFooter — fixed bottom stepper bar with step dots
  [ ] Build AppSection — reusable section wrapper with fade-in animation
  [ ] Build Button — primary/secondary/danger/small variants
  [ ] Build FormInput — styled input with label, placeholder, focus state
  [ ] Build FormTextarea — styled textarea with label, focus state
  [ ] Build PillSelector — toggle button group (Property/Intent selectors)
  [ ] Wire layout into VanaRaksha.jsx

PHASE 4: Result Display Components
  [ ] Rebuild ScoreGauge — 180px, animated arc, confidence opacity
  [ ] Rebuild TierBadge — pill with tier colors
  [ ] Rebuild WardCard — with interpolated ward warning
  [ ] Rebuild CoverageMap — with proper legend and responsive sizing
  [ ] Build ReasonCard — colored left border, consistent card style
  [ ] Build SummaryCard — for compound risk, executive summary
  [ ] Wire all into ResultsPage layout

PHASE 5: Photo Upload Enhancement
  [ ] Build DropZone — drag-and-drop + click to upload
  [ ] Add file size validation (warn >5MB, reject >20MB)
  [ ] Add image preview thumbnails with remove button
  [ ] Add progress bar during analysis (ProgressTracker)
  [ ] Show per-photo AI signal results after analysis

PHASE 6: Accessibility & Polish
  [ ] Add all ARIA attributes (Section 10)
  [ ] Implement keyboard navigation (Section 10)
  [ ] Implement focus management (Section 10)
  [ ] Add <main>, <header>, <nav>, <section>, <fieldset> semantic elements
  [ ] Add aria-live regions for loading/error messages
  [ ] Add PrintCSS component with print-only stylesheet
  [ ] Add error boundary with retry mechanism
  [ ] Add "Report inaccurate data" link on WardCard

PHASE 7: Enhanced Features
  [ ] Add dark mode toggle with prefers-color-scheme support
  [ ] Add micro-animations (gauge fill, card slide-in)
  [ ] Add comparison mode (2-property side-by-side view)
  [ ] Add browser history / localStorage for past assessments
  [ ] Add "Export to PDF" / print report functionality
  [ ] Add "Share link" (URL query params for assessment state)

═══════════════════════════════════════════════════════════════════
13. FORBIDDEN MODIFICATIONS
═══════════════════════════════════════════════════════════════════

DO NOT MODIFY:
  - src/data/WARD_DB.js          (core data, all 27 wards populated)
  - src/utils/matchWard.js       (3-pass geocoding engine)
  - src/utils/buildPrompt.js     (Gemini system prompt builder)
  - src/utils/fallback.js        (quantitative fallback — recently upgraded)
  - src/utils/parseResult.js     (JSON schema validator)
  - package.json                 (do not add dependencies)
  - vite.config.js               (do not change build config)
  - docs/                        (documentation, do not modify)
  - agents/                      (agent prompts, do not modify)
  - .env.example                 (environment template)

DO NOT ADD:
  - New npm dependencies         (use only React + Vite)
  - External image URLs          (all assets must be SVG or data URIs)
  - External CSS frameworks      (no Tailwind, Bootstrap, etc.)

═══════════════════════════════════════════════════════════════════
14. CODING STANDARDS
═══════════════════════════════════════════════════════════════════

- Use functional components with hooks (no class components)
- Name component files PascalCase: MyComponent.jsx
- Name utility files camelCase: myUtility.js
- Use CSS custom properties (not hardcoded hex values) for colors
- Use BEM-style class names: .vr-header, .vr-step, .vr-card__title
- Keep components small and focused (single responsibility)
- Prop types: use PropTypes or TypeScript if available, otherwise JSDoc
- Add comments for non-obvious logic
- Each component should have a comment block at the top:
  // ComponentName — brief description
  // Props: { propName: type, description }

═══════════════════════════════════════════════════════════════════
END OF CONTEXT DOCUMENT
═══════════════════════════════════════════════════════════════════