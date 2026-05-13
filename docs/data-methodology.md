# VanaRaksha — Scoring Methodology & Citations

## Risk Dimensions

### 1. Flood Risk (Fallback Weight: 40%)
**Data:** Historical floods (2015-2024), impervious surface %, drainage density, elevation, lake/nala proximity, BWSSB sewer coverage, soil type.

**Tier Logic:**
- Critical: ≥4 floods in 10yr AND impervious ≥70% AND drainage <1.5 km/sqkm
- High: ≥2 floods in 10yr AND impervious ≥55%
- Medium: ≥1 flood OR impervious ≥40%
- Low: No floods AND impervious <40% AND drainage ≥2 km/sqkm

**References:** Ramachandra et al. (2015), Sudhira et al. (2004), BBMP Stormwater Drain Master Plan

### 2. UHI Risk (Fallback Weight: 30%)
**Data:** NDVI (MODIS), impervious surface, LST, population density, building density.

**Tier Logic:**
- Critical: NDVI <0.15 AND impervious ≥85%
- High: NDVI <0.25 AND impervious ≥70%
- Medium: NDVI <0.40 OR impervious ≥50%
- Low: NDVI ≥0.40 AND impervious <50%

**References:** Ramachandra et al. (2015), Ziter et al. (2019) PNAS

### 3. Water Stress (Fallback Weight: 30%)
**Data:** Water table depth (CGWB), rainfall (IMD), BWSSB coverage, impervious surface, lake count.

**Tier Logic:**
- Critical: Water table >30m AND declining AND BWSSB <50%
- High: Water table >20m AND impervious ≥60%
- Medium: Water table 10-20m OR BWSSB 50-75%
- Low: Water table <10m AND BWSSB ≥75%

**References:** CGWB District Groundwater Brochure 2023, Vishwanath (2018) EPW

## Dynamic Weighting
Production: AI determines weights per case. Fallback: fixed 40/30/30.

## Confidence Framework
| Level | Criteria |
|---|---|
| High | All 3 dims with data from ≥2 sources; ward in curated DB |
| Medium | 2 of 3 dims with data; or interpolated from neighbor |
| Low | Only 1 dim has data |
| Very Low | No ward data — city average |

## Cross-Validation
1. Tier-data consistency (Critical flood → ≥4 events, ≥60% impervious)
2. Dimensional interaction check
3. Source recency ≤10 years
4. Geographic consistency between neighboring wards