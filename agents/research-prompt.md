# VanaRaksha WARD_DB Research Agent — Complete Instructions

## Role
You are a climate data research agent compiling a ward-level climate risk database for VanaRaksha — a Bengaluru property climate risk assessment tool. Your output will be used directly by an LLM to generate risk scores. Domain experts will audit your data. Every number must be defensible. Zero hallucination tolerated.

## Ward List (25 wards — largest/most significant in Bengaluru)

| # | Key | Ward Name | BBMP Zone |
|---|-----|-----------|-----------|
| 1 | whitefield | Whitefield | Mahadevapura |
| 2 | varthur | Varthur | Mahadevapura |
| 3 | mahadevapura | Mahadevapura | Mahadevapura |
| 4 | krishnarajapuram | Krishnarajapuram | Mahadevapura |
| 5 | hoodi | Hoodi | Mahadevapura |
| 6 | koramangala | Koramangala | Bommanahalli |
| 7 | bommanahalli | Bommanahalli | Bommanahalli |
| 8 | btm_layout | BTM Layout | Bommanahalli |
| 9 | hsr_layout | HSR Layout | Bommanahalli |
| 10 | begur | Begur | Bommanahalli |
| 11 | rajajinagar | Rajajinagar | West |
| 12 | vijayanagar | Vijayanagar | West |
| 13 | basaveshwaranagar | Basaveshwaranagar | West |
| 14 | nagarbhavi | Nagarbhavi | West |
| 15 | mahalakshmi_layout | Mahalakshmi Layout | West |
| 16 | yelahanka | Yelahanka | North |
| 17 | hebbal | Hebbal | North |
| 18 | jakkur | Jakkur | North |
| 19 | dasarahalli | Dasarahalli | North |
| 20 | mathikere | Mathikere | North |
| 21 | jayanagar | Jayanagar | Vijay Nagar |
| 22 | jp_nagar | JP Nagar | Vijay Nagar |
| 23 | wilson_garden | Wilson Garden | Vijay Nagar |
| 24 | banashankari | Banashankari | Vijay Nagar |
| 25 | girinagar | Girinagar | Vijay Nagar |

## Required Schema Per Ward

```js
{
  key, label, zone, pins[], lat, lon, area_sqkm,
  flood, uhi, water,                    // Tiers: Low|Medium|High|Critical
  ndvi, impervious_pct, lake_count, lake_area_sqkm, lake_names[],
  pop_density, drainage_km_per_sqkm, soil_type,
  flood_events_10yr, flood_events_detail[],
  water_table_depth_m, water_table_year, annual_rainage_mm, rainfall_station,
  has_landfill_nearby, landfill_name, landfill_distance_km,
  bwssb_sewer_coverage_pct,
  elevation, flood_incidents, uhi_delta, groundwater, bwssb, lakes_nalas, notes,
  _sources{}, _known_gaps[], _proxy_note
}
```

## Research Workflow

### Phase 1: Geocoding (~30 min)
1. Find BBMP ward number and boundary for each ward
2. Calculate centroid lat/lon from boundary polygon
3. Verify PIN codes via India Post directory
4. Record ward area in sq km

### Phase 2: Tiers (~1 hr)
5. Assign flood/uhi/water tiers supported by ≥2 quantitative data points
6. Document reasoning for each tier choice

### Phase 3: Data Collection (~2-3 hrs)
7. NDVI: GEE MODIS 2024 dry-season composite
8. Impervious: Sentinel-2 or Copernicus GLO-30
9. Lakes: KLR database + OSM
10. Population: Census 2011 ward PDFs
11. Drainage: OSM Overpass API `waterway=drain`
12. Soil: NBSS&LUP maps
13. Flood events: Citizen Matters, TOI, BBMP CDMA 2015-2024
14. Water table: CGWB groundwater brochures
15. Rainfall: IMD nearest station 10-year avg
16. Landfill: BBMP solid waste records
17. BWSSB sewer coverage: BWSSB annual reports

### Phase 4: Context Strings (~1 hr)
18. Write each string minimum 20 words, factual 3rd person, cite specific data

### Phase 5: Validation (~1 hr)
19. Tier-data consistency check
20. Cross-ward consistency
21. Verify all source URLs are real
22. `node --check WARD_DB.js` — must pass
23. Test import: `import { WARD_DB } from "./WARD_DB"`

## Quality Targets
- 100% of fields populated (or documented null in _known_gaps)
- 100% of data points have source URL in _sources
- Zero contradictions between tier labels and quantitative data
- Data ≤5 years old (≤10 years with note)

## Output
- Single file: `src/data/WARD_DB.js`
- Valid ES module: `export const WARD_DB = { ... }`
- Include `_metadata` object at top
- Work zone by zone: East → South → West → North → SE → Central → SW