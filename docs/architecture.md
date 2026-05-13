# VanaRaksha — System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              React SPA (Vite)                    │    │
│  │                                                  │    │
│  │  VanaRaksha.jsx (Single Page App)               │    │
│  │  ├── Step 1: Location (ward matching)           │    │
│  │  ├── Step 2: Property details                   │    │
│  │  ├── Step 3: Photo upload (max 5)               │    │
│  │  ├── Step 4: Local testimony                    │    │
│  │  └── Step 5: Risk result card                   │    │
│  │                                                  │    │
│  │  State: location, propertyType, intent,         │    │
│  │        photos[], testimonies[], result           │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                               │
│           ┌─────────────┼─────────────┐                 │
│           ▼             ▼             ▼                 │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────┐     │
│  │ matchWard()│ │ buildPrompt()│ │ parseResult() │     │
│  │ utils/     │ │ utils/       │ │ utils/        │     │
│  │ matchWard  │ │ buildPrompt  │ │ parseResult   │     │
│  └─────┬──────┘ └──────┬───────┘ └───────┬───────┘     │
│        │               │                 │              │
└────────┼───────────────┼─────────────────┼──────────────┘
         │               │                 │
         ▼               ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│               CLOUDFLARE WORKER PROXY                    │
│                                                         │
│  - Receives API request from frontend                  │
│  - Attaches API key from secret env variable           │
│  - Forwards to Google Gemini 2.0 Flash API             │
│  - Returns response to frontend                        │
│                                                         │
│  Secret: VITE_GEMINI_API_KEY (never exposed to client) │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────────┐
              │   GOOGLE GEMINI 2.0 FLASH│
              │   (AI Studio - Free Tier) │
              │                           │
              │  Call 1: Photo Vision     │
              │  Call 2: Risk Synthesis   │
              └───────────┬───────────────┘
                          │
                          ▼
              ┌───────────────────────────┐
              │       WARD_DB.js          │
              │  (Static JS data file)    │
              │                           │
              │  25 wards × 29 fields     │
              │  Risk tiers + baselines   │
              │  Source citations         │
              └───────────────────────────┘
```

## Data Flow

### Step 1: Location Input
```
User types "80 Feet Road, Koramangala"
       │
       ▼
matchWard("80 Feet Road, Koramangala", "", "")
       │
       ├── Pass 1: Check PIN codes in WARD_DB
       │   "560034" found in combined string
       │
       └── Returns: { key: "koramangala", ...WARD_DB.koramangala, isInterpolated: false }
       │
       ▼
WardCard renders immediately (showing flood=Critical, uhi=High, water=High)
```

### Step 2: Photo Analysis (Call 1)
```
For each photo (max 5):
  1. Build system prompt with matched ward data
  2. Send to Gemini with image (base64) + user annotations
  3. Receive JSON: { flood_signals, heat_signals, water_signals, confidence }
  4. Store in photoAnalyses[]
```

### Step 3: Risk Synthesis (Call 2)
```
Build synthesis prompt containing:
  - Location + property type + user intent
  - All photo analyses (structured signals)
  - All testimony entries (with credibility scores)
  - Ward baseline from system prompt

Send to Gemini → Receive JSON result → parseResult() validates schema
```

### Step 4: Fallback (if API fails)
```
buildFallback(matchedWard)
  ├── Convert tier labels to scores: Low=22, Medium=50, High=72, Critical=88
  ├── Apply composite weights: flood×0.4 + uhi×0.3 + water×0.3
  ├── Apply interpolation penalty if ward is proxied (-5% per km, max -30%)
  └── Return deterministic result with _fallback: true flag
```

## Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React + Vite | Zero-build-step for demo, fast dev, minimal deps |
| State management | React useState hooks (centralized in VanaRaksha) | Simple for single-page app, no extra libraries |
| AI provider | Google Gemini 2.0 Flash | Free tier, native JSON mode, vision support |
| Key security | Cloudflare Worker proxy | API key never touches client browser |
| Ward data | Single JS file (WARD_DB.js) | Easy to audit, version control, import |
| Photo storage | Base64 in React state (Blob URLs for display) | Fully local, no upload needed |
| Schema validation | Custom parser (parseResult.js) | Catches malformed AI responses before UI render |

## Scaling Considerations

Current architecture is designed for a **competition demo**. To scale:

- **Add live APIs**: Connect CGWB, BBMP, IMD → requires backend (serverless functions)
- **Expand to 198 wards**: Split WARD_DB into zone-based files, add index barrel
- **User accounts**: Add Supabase/Firebase Auth + database for history
- **Production API key mgmt**: Move to proper serverless function with rate limiting
- **Performance**: Web Workers for image encoding, IndexedDB for large photo sets
