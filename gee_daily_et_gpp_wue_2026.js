/*
 * Daily ET, GPP, and WUE for Thailand (2026 Jan-Jun)
 * Data Sources: ERA5 (climate) + MODIS (vegetation/thermal)
 *
 * HOW TO USE:
 * 1. Go to code.earthengine.google.com
 * 2. Paste this entire script
 * 3. Click "Run"
 * 4. In Console, copy the 3 tile URLs
 * 5. Paste into ET.html, GPP.html, WUE.html
 */

// Thailand boundary
var thailand = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Thailand'));

// Date range: Jan 1 - Jun 30, 2026
var startDate = '2026-01-01';
var endDate = '2026-06-30';

// ===== EVAPOTRANSPIRATION (ET) =====
// Using ERA5 latent heat flux to estimate ET
var era5 = ee.ImageCollection('ECMWF/ERA5/DAILY')
  .filterBounds(thailand)
  .filterDate(startDate, endDate)
  .select('total_evaporation'); // kg/m² (convert to mm)

// Calculate daily ET (latent heat = 2.45 MJ/kg, so ET_mm ≈ LE * 0.408)
var et_daily = era5.map(function(image) {
  return image.multiply(1000) // Convert kg/m² to mm
    .clip(thailand)
    .rename('ET');
});

// Get latest ET composite (or median if needed)
var et_composite = et_daily.median();

// ===== GROSS PRIMARY PRODUCTIVITY (GPP) =====
// Using MODIS NPP as proxy for GPP (GPP ≈ NPP / 0.5 approximately)
var modis_npp = ee.ImageCollection('MODIS/006/MOD17A2H')
  .filterBounds(thailand)
  .filterDate(startDate, endDate)
  .select('Gpp'); // GPP in kg C/m²/8days

// Convert to daily average (divide by 8)
var gpp_daily = modis_npp.map(function(image) {
  return image.multiply(0.0001) // Scale factor
    .divide(8) // 8-day to daily
    .clip(thailand)
    .rename('GPP');
});

var gpp_composite = gpp_daily.median();

// ===== WATER USE EFFICIENCY (WUE) =====
// WUE = GPP / ET (g C / kg H2O)
// To make WUE comparable: normalize to reasonable range
var wue_composite = gpp_composite.divide(et_composite.add(0.1)) // Avoid division by zero
  .multiply(100) // Scale for visibility
  .rename('WUE');

// ===== VISUALIZATIONS =====

// ET: Blue palette (low water → high water)
var et_vis = {
  min: 0,
  max: 8,
  palette: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15', '#67000d']
};

// GPP: Green palette (low productivity → high productivity)
var gpp_vis = {
  min: 0,
  max: 0.5,
  palette: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238b45', '#005a32']
};

// WUE: Purple palette (efficiency)
var wue_vis = {
  min: 0,
  max: 100,
  palette: ['#f1eef6', '#d7b5d8', '#df65b0', '#ce1256', '#980043', '#67001f']
};

// Display on map
Map.setCenter(100.99, 15.87, 5);
Map.addLayer(et_composite, et_vis, 'ET (Evapotranspiration)');
Map.addLayer(gpp_composite, gpp_vis, 'GPP (Gross Primary Productivity)');
Map.addLayer(wue_composite, wue_vis, 'WUE (Water Use Efficiency)');

// ===== GENERATE TILE URLS =====
var et_tiles = et_composite.getMapId(et_vis);
var gpp_tiles = gpp_composite.getMapId(gpp_vis);
var wue_tiles = wue_composite.getMapId(wue_vis);

print('=== COPY THESE URLs INTO HTML FILES ===');
print('');
print('📍 ET (Evapotranspiration) URL:');
print(et_tiles.urlFormat);
print('');
print('📍 GPP (Gross Primary Productivity) URL:');
print(gpp_tiles.urlFormat);
print('');
print('📍 WUE (Water Use Efficiency) URL:');
print(wue_tiles.urlFormat);
print('');
print('=== INSTRUCTIONS ===');
print('1. Copy each URL above');
print('2. Paste into ET.html, GPP.html, WUE.html respectively');
print('3. Look for PLACEHOLDER_* variables and replace');
print('4. Save and open in browser');
print('');
print('Date range: 2026-01-01 to 2026-06-30');
print('Data: ERA5 (ET) + MODIS (GPP)');
print('Region: Thailand (FAO/GAUL 2015)');
