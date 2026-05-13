// WARD_DB.js
// VanaRaksha — Ward-Level Climate Risk Database
// Version: 0.1.0
// Compiled: 2026-05-13
// Author: VanaRaksha Research Agent (PENDING — agent has not run yet)
//
// Data sources: Census 2011, CGWB, BBMP, ISRO, IMD, Sentinel-2, OSM, KLR
// License: Open data — see individual sources for licensing
//
// STATUS: SKELETON — Only Koramangala is pre-filled as example.
//         Research agent must fill all 25 wards.

export const _metadata = {
  version: "0.1.0",
  compiled: "2026-05-13",
  author: "VanaRaksha Research Agent",
  model: "PENDING",
  total_wards: 25,
  total_fields_per_ward: 29,
  fields_populated_count: 72,
  data_completeness_pct: "11.5",
  avg_sources_per_field: "0.0",
  known_gaps: [
    "24 of 25 wards have NO data yet — skeleton only",
    "Koramangala is pre-filled as example; all values need verification"
  ],
  confidence_overall: "Low",
  last_validated: "2026-05-13"
};

export const WARD_DB = {
  // ═══════════════════════════════════════════════════════════
  // EXAMPLE WARD — Koramangala (pre-filled, needs verification)
  // ═══════════════════════════════════════════════════════════
  koramangala: {
    key: "koramangala", label: "Koramangala", zone: "Bommanahalli",
    pins: ["560034", "560095"], lat: 12.93521, lon: 77.62446, area_sqkm: 8.2,
    flood: "Critical", uhi: "High", water: "High",
    ndvi: 0.18, impervious_pct: 78, lake_count: 2, lake_area_sqkm: 0.4,
    lake_names: ["Kowdenahalli Lake", "KC Valley Lake"],
    pop_density: 28000, drainage_km_per_sqkm: 1.2, soil_type: "Clay-Loam",
    flood_events_10yr: 6,
    flood_events_detail: [
      { year: 2022, month: "October", description: "Major inundation in KC Valley, 60+ homes affected" },
      { year: 2023, month: "September", description: "Flash flooding after 150mm rainfall in 6 hours" },
      { year: 2020, month: "August", description: "Waterlogging on 80 Feet Road" },
      { year: 2019, month: "October", description: "Nala overflow near Dairy Circle" },
      { year: 2018, month: "July", description: "Urban flooding after consecutive heavy rain days" },
      { year: 2016, month: "November", description: "Drain blockage caused localized flooding" }
    ],
    water_table_depth_m: 18, water_table_year: 2023, annual_rainage_mm: 980,
    rainfall_station: "Bengaluru", has_landfill_nearby: true,
    landfill_name: "Srinivasapura landfill", landfill_distance_km: 2.3,
    bwssb_sewer_coverage_pct: 45,
    elevation: "Approximately 895m MSL — low-lying KC Valley drainage bowl",
    flood_incidents: "6 major flood events 2015-2024. Oct 2022: KC Valley inundation.",
    uhi_delta: "+3.5 degC above city mean (MODIS LST). NDVI 0.18 — lowest in South Zone.",
    groundwater: "18m bgl, declining 1.2m/yr (CGWB). Over-extraction stress.",
    bwssb: "45% sewerage coverage. Remaining area on septic tanks and open drains.",
    lakes_nalas: "Kowdenahalli Lake (0.15 sq km, encroached). KC Valley nala is primary drain.",
    notes: "One of Bengaluru's most climate-vulnerable wards. Critical flood + High UHI + High water stress = compounding risk.",
    _sources: {
      ndvi: "Google Earth Engine — MODIS MOD13Q1 2024 annual composite",
      impervious_pct: "Copernicus GLO-30 Land Cover 2020 via GEE",
      lake_count: "KLR Database 2024",
      lake_area_sqkm: "KLR Database + Sentinel-2 measurement",
      pop_density: "Census India 2011 — Ward 162",
      drainage_km_per_sqkm: "OpenStreetMap Overpass API waterway=drain",
      soil_type: "NBSS&LUP Karnataka District Resource Profile",
      flood_events_10yr: "Citizen Matters Bengaluru, BBMP CDMA Reports 2015-2024",
      flood_events_detail: "Citizen Matters, Times of India, BBMP CDMA, KSDMA",
      water_table_depth_m: "CGWB Karnataka District Groundwater Brochure 2023",
      annual_rainage_mm: "IMD Gridded Rainfall Dataset 2014-2023",
      rainfall_station: "IMD Open Data portal",
      has_landfill_nearby: "BBMP SWM Reports 2023",
      landfill_name: "BBMP SWM Reports 2023",
      landfill_distance_km: "Google Maps measurement",
      bwssb_sewer_coverage_pct: "BWSSB Annual Report 2022-23",
      elevation: "SRTM DEM 30m via GEE",
      flood_incidents: "Citizen Matters, TOI, BBMP CDMA",
      uhi_delta: "MODIS LST MOD11A2 2024 summer mean via GEE",
      groundwater: "CGWB District Groundwater Brochure Bangalore Urban 2023",
      bwssb: "BWSSB Annual Report 2022-23",
      lakes_nalas: "KLR Database + BBMP Lake Register",
      notes: "Synthesized from all above sources"
    },
    _known_gaps: [],
    _proxy_note: null
  },

  // ——— EAST ZONE (Mahadevapura) ———

  whitefield: {
    key: "whitefield", label: "Whitefield", zone: "Mahadevapura",
    pins: ["560066", "560067", "560103"], lat: 12.9698, lon: 77.7497, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  varthur: {
    key: "varthur", label: "Varthur", zone: "Mahadevapura",
    pins: ["560087"], lat: 12.9882, lon: 77.7638, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  mahadevapura: {
    key: "mahavadevapura", label: "Mahadevapura", zone: "Mahadevapura",
    pins: ["560048"], lat: 12.9895, lon: 77.6972, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  krishnarajapuram: {
    key: "krishnarajapuram", label: "Krishnarajapuram", zone: "Mahadevapura",
    pins: ["560036"], lat: 12.9523, lon: 77.7014, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  hoodi: {
    key: "hoodi", label: "Hoodi", zone: "Mahadevapura",
    pins: ["560048"], lat: 12.9728, lon: 77.7389, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  // ——— SOUTH ZONE (Bommanahalli) ———

  bommanahalli: {
    key: "bommanahalli", label: "Bommanahalli", zone: "Bommanahalli",
    pins: ["560037", "560068"], lat: 12.9144, lon: 77.6239, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  btm_layout: {
    key: "btm_layout", label: "BTM Layout", zone: "Bommanahalli",
    pins: ["560029", "560068"], lat: 12.9158, lon: 77.6101, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  hsr_layout: {
    key: "hsr_layout", label: "HSR Layout", zone: "Bommanahalli",
    pins: ["560102"], lat: 12.9196, lon: 77.6489, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  begur: {
    key: "begur", label: "Begur", zone: "Bommanahalli",
    pins: ["560068"], lat: 12.8981, lon: 77.6169, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  // ——— WEST ZONE ———

  rajajinagar: {
    key: "rajajinagar", label: "Rajajinagar", zone: "West",
    pins: ["560010"], lat: 12.9753, lon: 77.5546, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  vijayanagar: {
    key: "vijayanagar", label: "Vijayanagar", zone: "West",
    pins: ["560040"], lat: 12.9657, lon: 77.5311, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  basaveshwaranagar: {
    key: "basaveshwaranagar", label: "Basaveshwaranagar", zone: "West",
    pins: ["560079"], lat: 12.9778, lon: 77.5383, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  nagarbhavi: {
    key: "nagarbhavi", label: "Nagarbhavi", zone: "West",
    pins: ["560072"], lat: 12.9616, lon: 77.5136, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  mahalakshmi_layout: {
    key: "mahalakshmi_layout", label: "Mahalakshmi Layout", zone: "West",
    pins: ["560086"], lat: 12.9724, lon: 77.5474, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  // ——— NORTH ZONE ———

  yelahanka: {
    key: "yelahanka", label: "Yelahanka", zone: "North",
    pins: ["560064"], lat: 13.1381, lon: 77.5919, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  hebbal: {
    key: "hebbal", label: "Hebbal", zone: "North",
    pins: ["560024"], lat: 13.0432, lon: 77.5964, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  jakkur: {
    key: "jakkur", label: "Jakkur", zone: "North",
    pins: ["560064"], lat: 13.0694, lon: 77.5925, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  dasarahalli: {
    key: "dasarahalli", label: "Dasarahalli", zone: "North",
    pins: ["560057"], lat: 13.0447, lon: 77.5693, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  mathikere: {
    key: "mathikere", label: "Mathikere", zone: "North",
    pins: ["560054"], lat: 13.0297, lon: 77.5841, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  // ——— SOUTH-EAST ZONE (Vijay Nagar) ———

  jayanagar: {
    key: "jayanagar", label: "Jayanagar", zone: "Vijay Nagar",
    pins: ["560011", "560041"], lat: 12.9367, lon: 77.5575, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  jp_nagar: {
    key: "jp_nagar", label: "JP Nagar", zone: "Vijay Nagar",
    pins: ["560078"], lat: 12.9091, lon: 77.5578, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  wilson_garden: {
    key: "wilson_garden", label: "Wilson Garden", zone: "Vijay Nagar",
    pins: ["560027"], lat: 12.9502, lon: 77.5834, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  banashankari: {
    key: "banashankari", label: "Banashankari", zone: "Vijay Nagar",
    pins: ["560050", "560085"], lat: 12.9247, lon: 77.5455, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  girinagar: {
    key: "girinagar", label: "Girinagar", zone: "Vijay Nagar",
    pins: ["560085"], lat: 12.9277, lon: 77.5287, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: null,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  // ——— SOUTH-WEST ZONE ———

  kengeri: {
    key: "kengeri", label: "Kengeri", zone: "Bommanahalli",
    pins: ["560072"], lat: 12.9887, lon: 77.4820, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: false,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  },

  uttarahalli: {
    key: "uttarahalli", label: "Uttarahalli", zone: "Bommanahalli",
    pins: ["560061"], lat: 12.9119, lon: 77.5334, area_sqkm: null,
    flood: null, uhi: null, water: null, ndvi: null, impervious_pct: null,
    lake_count: null, lake_area_sqkm: null, lake_names: [], pop_density: null,
    drainage_km_per_sqkm: null, soil_type: null, flood_events_10yr: null,
    flood_events_detail: [], water_table_depth_m: null, water_table_year: null,
    annual_rainage_mm: null, rainfall_station: null, has_landfill_nearby: false,
    landfill_name: null, landfill_distance_km: null, bwssb_sewer_coverage_pct: null,
    elevation: null, flood_incidents: null, uhi_delta: null, groundwater: null,
    bwssb: null, lakes_nalas: null, notes: null,
    _sources: {}, _known_gaps: ["ALL FIELDS PENDING"], _proxy_note: null
  }
};