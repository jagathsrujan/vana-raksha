# VanaRaksha — Scoring Methodology & Citations

## Risk Dimensions

VanaRaksha assesses three climate risk dimensions for Bengaluru properties:

### 1. Flood Risk (Weight: 40% in fallback composite)

**What it measures:** Likelihood and severity of urban flooding at a property location.

**Data inputs:**
| Data Point | Source | Role in Scoring |
|---|---|---|
| Historical flood events (2015–2024) | BBMP CDMA reports, Citizen Matters, news archives | Frequency and severity anchor |
| Impervious surface % | Sentinel-2 / Copernicus GLO-30 | Higher % = more runoff = higher flood risk |
| Drainage network density (km/sq km) | OpenStreetMap, BBMP drainage maps | Lower density = higher flood risk |
| Elevation & terrain | SRTM DEM via Google Earth Engine | Low-lying areas = waterlogging risk |
| Lake/nala proximity & condition | KLR database, OSM | Encroached lakes = reduced buffer capacity |
| BWSSB sewer coverage % | BWSSB annual reports | Low coverage = reliance on open drains |
| Soil type | NBSS&LUP soil maps | Clay soils = poor infiltration = surface flooding |

**Tier assignment logic:**
- `Critical` — ≥4 flood events in 10 years AND impervious surface ≥70%
- `High` — ≥2 flood events in 10 years AND impervious surface ≥55%
- `Medium` — ≥1 flood event OR impervious surface ≥40%
- `Low` — No documented floods AND impervious surface <40% AND drainage ≥2 km/sq km

**Key references:**
- BBMP Stormwater Drain Master Plan (2023)
- Karnataka State Natural Disaster Monitoring Centre (KSNDMC) annual reports
- Ramachandra, T.V. et al. (2015). *Ecological Indicators*, 48, 685–698.
- Sudhira, H.S., Ramachandra, T.V. & Jagadish, K.S. (2004). *Current Science*, 87(9), 1267–1269.

---

### 2. Urban Heat Island (UHI) Risk (Weight: 30%)

**What it measures:** Heat exposure due to built environment, lack of vegetation, and anthropogenic heat.

**Data inputs:**
| Data Point | Source | Role in Scoring |
|---|---|---|
| NDVI (Normalized Difference Vegetation Index) | MODIS MOD13Q1, Sentinel-2 | Lower NDVI = less cooling = higher UHI |
| Impervious surface % | Sentinel-2 / Copernicus | Direct driver of heat retention |
| Land Surface Temperature (LST) | MODIS MOD11A2, ECOSTRESS | Direct thermal measurement |
| Population density | Census 2011 | Proxy for anthropogenic heat |
| Building density | OpenStreetMap | Traps heat, reduces airflow |

**Tier assignment logic:**
- `Critical` — NDVI < 0.15 AND impervious surface ≥85%
- `High` — NDVI < 0.25 AND impervious surface ≥70%
- `Medium` — NDVI < 0.40 OR impervious surface ≥50%
- `Low` — NDVI ≥ 0.40 AND impervious surface < 50%

**Delta calculation:**
UHI delta = Ward LST mean − City-wide LST mean (from MODIS summer composites)

**Key references:**
- Ramachandra, T.V., Aithal, B.H. & Sowmyashree, D.V. (2015). *IJEST*, 4(5), 14–23.
- Annegarn, H.J. et al. (1996). *Atmospheric Environment*, 30(23), 4095–4107.
- Google Earth Engine — MODIS LST product documentation.
- Ziter, C.D. et al. (2019). *PNAS*, 116(15), 7575–7580.

---

### 3. Water Stress (Weight: 30%)

**What it measures:** Groundwater availability, water supply infrastructure, and demand-supply gap.

**Data inputs:**
| Data Point | Source | Role in Scoring |
|---|---|---|
| Water table depth (m bgl) | CGWB groundwater brochures | Deeper = more stressed |
| Water table trend (declining/rising) | CGWB year-over-year data | Trend indicates future risk |
| Annual rainfall (mm) | IMD gridded dataset, nearest station | Lower rainfall = higher stress |
| BWSSB sewer coverage % | BWSSB annual reports | Low coverage = reliance on borewells |
| Impervious surface % | Sentinel-2 | Reduces natural recharge |
| Lake count & area | KLR database | Lakes = recharge sources |
| Population density | Census 2011 | Higher density = higher demand |

**Tier assignment logic:**
- `Critical` — Water table >30m bgl AND BWSSB coverage <50% (regardless of decline trend)
- `High` — Water table >20m bgl AND impervious surface ≥60%, OR BWSSB <50%
- `Medium` — Water table 10–20m bgl, OR BWSSB coverage 50–75%
- `Low` — Water table <10m bgl AND BWSSB coverage ≥75%

**Tier reassignment rules (added v1.0.1):**
When a ward's quantitative data does not support its originally assigned tier, the tier MUST be downgraded to match the data. Document the override in `notes` and `_known_gaps`. Example: If a ward has `water=Critical` in narrative sources but only `water_table_depth_m=15m` (which maps to Medium), change the tier to `Medium` and note: *"Narrative sources describe severe water stress; quantitative data (15m water table, 80% BWSSB) supports Medium tier. Tier assigned conservatively."*

**Key references:**
- Central Ground Water Board (2023). *District Groundwater Brochures — Bangalore Urban District.*
- CGWB (2022). *Ground Water Year Book — Karnataka.*
- Sukesha, R. (2021). *J. Earth System Science*, 130, 52.
- Vishwanath, S. (2018). *Economic and Political Weekly*, 53(11).
- BWSSB Annual Reports (2020–2023).

---

## Dynamic Weighting (AI-Driven)

The production system uses **OpenCode Zen** (OpenAI GPT-5.4-mini) with **AI-determined dynamic weights**. Zen provides an OpenAI-compatible gateway with vision-capable GPT-5.4-mini for photo analysis and JSON-mode structured output for reliable parsing.

**Prompt instruction to AI:**
> "Based on the evidence provided, determine which dimension (flood, UHI, water) poses the greatest risk to this specific property. Adjust your scoring weight accordingly. A ward with declining water table AND high impervious surface should weight water stress more heavily than a ward with frequent flooding but adequate groundwater."

The AI outputs a `composite_score` that reflects this dynamic weighting. The fallback system uses fixed weights (40/30/30) only when the AI is unavailable.

---

## Confidence Framework

| Confidence Level | Criteria |
|---|---|
| **High** | All 3 dimensions have quantitative data from ≥2 independent sources; ward is in curated database |
| **Medium** | 2 of 3 dimensions have quantitative data; or ward is interpolated from nearest neighbor |
| **Low** | Only 1 dimension has data; or ward is unclassified (city average used) |
| **Very Low** | No ward data at all — pure city-wide estimate |

---

## Cross-Validation Checks

To ensure scoring consistency, the system validates:

1. **Tier–data consistency:** Every tier label MUST be supported by ≥2 quantitative data points. See tier assignment logic tables above for exact thresholds.
2. **Dimensional interaction:** High flood + High UHI should produce a compound risk note about combined infrastructure stress.
3. **Source recency:** All data must be ≤10 years old (≤5 years preferred); older data triggers a confidence downgrade.
4. **Geographic consistency:** Neighboring wards with similar characteristics should have similar risk scores.
5. **Contradiction resolution:** If assigned tier contradicts quantitative data per the tables above, the tier MUST be downgraded. The override must be documented in the ward's `notes` field with rationale.

---

## Known Tier Overrides

| Ward | Dimension | Original Tier | Data-Supported Tier | Reason |
|---|---|---|---|---|
| Vijayanagar | Water | Critical | Medium | Water table at 15m (Medium threshold: 10-20m); BWSSB at 80% (not <50%). Original "Critical" from narrative was not quantitatively supported. |

---

## Citation Format

All sources are cited in the output using a standardized format:

```
[Source Type] — [Organization] — [Year] — [Specific Data Point]
```

Example: `CGWB Groundwater Brochure — Central Ground Water Board — 2023 — Water table depth: 18m bgl`

This allows judges and reviewers to verify any specific claim in the assessment back to its original data source.
