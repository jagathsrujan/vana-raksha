# VanaRaksha — Data Sources Reference

All data sources used in WARD_DB compilation, organized by type.
Each source is free and publicly accessible.

---

## 🛰️ Satellite & Remote Sensing

| Source | URL | Data Provided | Access Method |
|---|---|---|---|
| **Google Earth Engine** | earthengine.google.com | NDVI, LST, impervious surface, land cover | JavaScript/Python API (free) |
| **MODIS MOD13Q1** | lpdaac.usgs.gov | 250m vegetation indices, 16-day composite | GEE or direct download |
| **MODIS MOD11A2** | lpdaac.usgs.gov | 1km Land Surface Temperature, 8-day composite | GEE or direct download |
| **Sentinel-2 L2A** | scihub.copernicus.eu | 10m land cover, NDBI for built-up areas | GEE, Sentinel Hub, or Copernicus API |
| **Copernicus GLO-30** | portal.opentopography.org | 30m global land cover (impervious surface) | Direct download |
| **SRTM DEM** | earthexplorer.usgs.gov | 30m digital elevation model | GEE or USGS Earth Explorer |

---

## 🏛️ Government & Institutional

| Source | URL | Data Provided | Format |
|---|---|---|---|
| **Census of India 2011** | censusindia.gov.in | Ward-level population, area, density | PDF tables → parse |
| **BBMP** | bengaluruurban.gov.in | Ward delimitation, drainage maps, budgets | PDF/shapefile |
| **CGWB** | cgwb.gov.in | Groundwater data, district brochures | PDF (one per district) |
| **IMD** | imdpune.gov.in | Rainfall station data, gridded rainfall | CSV/API |
| **BWSSB** | bwsb.gov.in | Sewerage coverage, annual reports | PDF |
| **KSPCB** | kspcb.gov.in | Water quality, pollution data | PDF/annual reports |
| **KLR/KSCIS** | kscics.karnataka.gov.in | Lake database, conservation data | Website database |
| **KSNDMC** | ksndmc.org | Disaster events, flood reports | PDF/website |
| **BDA** | bda.karnataka.gov.in | Master plan, urban growth boundaries | PDF/shapefile |

---

## 🗺️ Open Data / Crowdsourced

| Source | URL | Data Provided | Access |
|---|---|---|---|
| **OpenStreetMap** | openstreetmap.org | Roads, waterways, buildings, landuse | Overpass API (free) |
| **Overpass API** | overpass-api.de | Query OSM data by bounding box/tag | REST API (free) |
| **Wikidata** | wikidata.org | Ward metadata, PIN codes, landmarks | SPARQL API (free) |

---

## 📰 News & Reporting (Flood Events)

| Source | URL | Use Case |
|---|---|---|---|
| **Citizen Matters Bengaluru** | citizenmatters.in | Detailed local flood reporting |
| **The Hindu — Bengaluru** | thehindu.com/cities/bengaluru | Major flood event coverage |
| **Times of India Bengaluru** | timesofindia.indiatimes.com | Flood news archive |
| **Kannada Prabha** | kannadaprabha.com | Regional language coverage |
| **BBMP CDMA Reports** | bengaluruurban.gov.in | Official disaster management |

---

## 📊 Research & Academic Papers

| Paper / Report | Authors/Org | Key Contribution |
|---|---|---|
| *Bengaluru Urban Flooding* (2015) | Ramachandra et al., IISc | Flood pattern analysis, land use change |
| *Environmental Impact Assessment* (2020) | KSPCB | Pollution and water quality trends |
| *District Groundwater Brochure — Bangalore Urban* | CGWB | Borewell data, water table trends |
| *Bengaluru Master Plan 2031* | BDA | Growth projections, land use planning |
| *Climate Change and Bengaluru* (2022) | IPCC AR6 WG2 (India chapter) | Downscaled climate projections |
| *Urban Lakes of Bengaluru* | KSCIS | Lake inventory, encroachment status |
| *Groundwater Year Book — Karnataka* | CGWB | Annual water level fluctuations |

---

## 🔧 Data Compilation Process

For each ward in WARD_DB, the research agent should:

1. **Query GEE** → Extract mean NDVI, LST, and impervious surface % from 2024 annual composites
2. **Query OSM Overpass** → Drainage network length, lake polygons, building footprint
3. **Parse Census PDF** → Population and area for ward-level density calculation
4. **Read CGWB PDF** → Water table depth (pre/post monsoon), trend
5. **Read IMD data** → Nearest station rainfall average (2014–2023)
6. **Search news** → Flood events 2015–2024 (minimum 3 sources per event)
7. **Read BWSSB report** → Sewer coverage percentage
8. **Cross-reference KLR** → Lake names, condition, encroachment status

All sources are logged per-field in the `_sources` object within each ward entry.

---

## Source Freshness Policy

| Source | Update Frequency | Acceptable Age |
|---|---|---|
| IMD Rainfall | Daily | ≤ 2 years |
| CGWB Groundwater | Annual | ≤ 3 years |
| MODIS NDVI/LST | 16-day composite | ≤ 1 year |
| Sentinel-2 | 5-day revisit | ≤ 1 year |
| Census | Decennial | ≤ 12 years (2011 ok for now) |
| BBMP Drainage | Periodic | ≤ 5 years |
| OSM | Community updates | ≤ 2 years |
| News events | One-time | Exact dates recorded |
