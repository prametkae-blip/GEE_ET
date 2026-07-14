// ============================================================================
// GEE_ET SIMPLE VERSION - 2026 ONLY
// Load MODIS ET & GPP, export to Google Drive
// ============================================================================

var START = ee.Date('2026-01-01');
var END = ee.Date('2026-06-01');
var OUTPUT_CRS = 'EPSG:3857';
var OUTPUT_SCALE = 500;

var thailand = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Thailand'));
var roi = thailand.geometry();

Map.centerObject(roi, 6);
Map.addLayer(thailand.style({color: '000000', fillColor: '00000000', width: 2}), {}, 'Thailand');

// ============================================================================
// LOAD & PROCESS DATA
// ============================================================================

// ET from MOD16A2
var et = ee.ImageCollection('MODIS/061/MOD16A2')
  .filterDate(START, END)
  .filterBounds(roi)
  .map(function(img) {
    var et_mm = img.select('ET').multiply(0.1);
    var qc = img.select('ET_QC');
    var good = qc.eq(0);
    return et_mm.updateMask(good).rename('ET_mm')
      .set('system:time_start', img.get('system:time_start'));
  })
  .select('ET_mm');

// GPP from MOD17A2H
var gpp = ee.ImageCollection('MODIS/061/MOD17A2H')
  .filterDate(START, END)
  .filterBounds(roi)
  .map(function(img) {
    var gpp_gC = img.select('Gpp').multiply(0.1).multiply(1000);
    var qc = img.select('Psn_QC');
    var good = qc.eq(0);
    return gpp_gC.updateMask(good).rename('GPP_gC_m2')
      .set('system:time_start', img.get('system:time_start'));
  })
  .select('GPP_gC_m2');

print('ET composites:', et.size());
print('GPP composites:', gpp.size());

// ============================================================================
// EXPORT LATEST COMPOSITE
// ============================================================================

// Get latest ET
var etLatest = et.sort('system:time_start', false).first();
var etLatestDate = etLatest.get('system:time_start');

// Get latest GPP
var gppLatest = gpp.sort('system:time_start', false).first();

// Combine
var combined = ee.Image.cat([
  etLatest.clip(roi).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE}),
  gppLatest.clip(roi).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE})
]);

var vis = {
  bands: ['ET_mm', 'GPP_gC_m2'],
  min: [0, 0],
  max: [20, 800]
};

Map.addLayer(etLatest.clip(roi).visualize({min: 0, max: 20, palette: ['fff7fb','ece7f2','d0d1e6','a6bddb','74a9cf','3690c0','0570b0','045a8d']}), {}, 'Latest ET');
Map.addLayer(gppLatest.clip(roi).visualize({min: 0, max: 1000, palette: ['ffffe5','f7fcb9','d9f0a3','addd8e','78c679','41ab5d','238443','006837']}), {opacity: 0.7}, 'Latest GPP');

// ============================================================================
// MONTHLY SUMMARIES
// ============================================================================

var months = ee.List.sequence(1, 5);  // Jan to May

var monthlySummaries = months.map(function(month) {
  var m = ee.Number(month);
  var monthStart = ee.Date.fromYMD(2026, m, 1);
  var monthEnd = monthStart.advance(1, 'month');

  var etMonth = et.filterDate(monthStart, monthEnd).mean();
  var gppMonth = gpp.filterDate(monthStart, monthEnd).mean();

  return ee.Image.cat([etMonth, gppMonth])
    .set('month', m)
    .set('monthName', monthStart.format('YYYY-MM'));
});

print('Monthly summaries created:', ee.List(monthlySummaries).size());

// ============================================================================
// EXPORT
// ============================================================================

// Export latest month
Export.image.toDrive({
  image: combined,
  description: 'Thailand_ET_GPP_2026_Latest',
  folder: 'GEE_ET',
  fileNamePrefix: 'Thailand_2026_Latest',
  region: roi,
  crs: OUTPUT_CRS,
  scale: OUTPUT_SCALE,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// Export each month
months.evaluate(function(monthList) {
  monthList.forEach(function(m, i) {
    var summary = ee.Image(ee.List(monthlySummaries).get(i));
    var monthName = summary.get('monthName');

    Export.image.toDrive({
      image: summary.clip(roi).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE}),
      description: 'Thailand_2026_Month_' + (m < 10 ? '0' + m : m),
      folder: 'GEE_ET',
      fileNamePrefix: 'Thailand_2026_' + (m < 10 ? '0' + m : m),
      region: roi,
      crs: OUTPUT_CRS,
      scale: OUTPUT_SCALE,
      maxPixels: 1e13,
      fileFormat: 'GeoTIFF'
    });
  });
});

// ============================================================================
// SUMMARY
// ============================================================================

print('=== EXPORT SUMMARY ===');
print('Region: Thailand');
print('Period: 2026-01-01 to 2026-05-25');
print('Data:');
print('  - ET: MOD16A2 (water loss)');
print('  - GPP: MOD17A2H (productivity)');
print('Resolution: 500m native');
print('Quality: QC=0 only (best pixels)');
print('');
print('Exports queued to Google Drive:');
print('  - Thailand_2026_Latest (latest month)');
print('  - Thailand_2026_01 through Thailand_2026_05 (monthly)');
print('');
print('Download from: Google Drive > GEE_ET folder');
print('Then visualize with: geotiff_to_image.py or map_viewer.html');
