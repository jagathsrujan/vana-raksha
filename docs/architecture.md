# VanaRaksha — System Architecture

```
USER'S BROWSER
  ??????????????????????????????????????????????????????????????????
  ?  React SPA (Vite)                                             ?
  ?  ??? Step 1: Location (ward matching)                         ?
  ?  ??? Step 2: Property details                                 ?
  ?  ??? Step 3: Photo upload (max 5)                             ?
  ?  ??? Step 4: Local testimony                                  ?
  ?  ??? Step 5: Risk result card                                 ?
  ????????????????????????????????????????????????+????????????????
                          ?
              CLOUDFLARE WORKER PROXY
              (API key hidden server-side)
                          ?
              GOOGLE GEMINI 2.0 FLASH (Free)
              Call 1: Photo Vision Analysis
              Call 2: Risk Synthesis
                          ?
              WARD_DB.js (25 wards, 29 fields each)
```

## Data Flow

1. User types address ? `matchWard()` ? PIN/keyword/fuzzy match ? WardCard renders
2. User adds photos ? base64 stored in React state ? Blob URLs for display
3. User adds testimony ? credibility-weighted statements stored in state
4. "Run AI Analysis" ? Two Gemini API calls:
   - Photo analysis (one call per photo, max 5)
   - Risk synthesis (single call with all evidence)
5. `parseResult()` validates JSON schema ? renders Risk Card
6. If API fails ? `buildFallback()` uses WARD_DB tier labels ? deterministic scores

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React + Vite | Zero-build for demo, fast dev |
| AI Provider | Gemini 2.0 Flash | Free tier, vision + JSON mode |
| Key Security | Cloudflare Worker | Key never exposed to client |
| Ward Data | Single JS file | Easy to audit, version control |
| Photos | Base64 in state | Fully local, no upload needed |
| Schema Validation | Custom parser | Catches malformed AI responses |

## Scaling

- Add live APIs (CGWB, BBMP) ? requires serverless functions
- Expand to 198 wards ? split WARD_DB into zone files
- Add user accounts ? Supabase/Firebase Auth + database