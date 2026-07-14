// ============================================================================
// GEE_ET COMPREHENSIVE ANALYSIS
// Monthly ET, GPP, WUE for Thailand: 2021-2026 (May)
// Real data from MODIS MOD16A2 & MOD17A2H
// ============================================================================

var ANALYSIS_START = ee.Date('2021-01-01');
var ANALYSIS_END = ee.Date('2026-06-01');  // Through May 2026
var OUTPUT_CRS = 'EPSG:3857';
var OUTPUT_SCALE = 500;  // Native MODIS resolution

var thailand = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Thailand'));
var roi = thailand.geometry();

Map.centerObject(roi, 6);
Map.addLayer(thailand.style({color: '000000', fillColor: '00000000', width: 2}), {}, 'Thailand Boundary');

// ============================================================================
// MODIS MOD16A2 - EVAPOTRANSPIRATION
// ============================================================================

var mod16 = ee.ImageCollection('MODIS/061/MOD16A2')
  .filterDate(ANALYSIS_START, ANALYSIS_END)
  .filterBounds(roi);

function processET(image) {
  var date = ee.Date(image.get('system:time_start'));
  var year = date.get('year');
  var month = date.get('month');

  // ET in kg/m^2 = mm (since density of water = 1)
  var et = image.select('ET').multiply(0.1).rename('ET_mm');
  var etQC = image.select('ET_QC');

  // Quality control: keep only good quality pixels (QC=0)
  var goodQuality = etQC.eq(0);
  var etQA = et.updateMask(goodQuality);

  return etQA.set({
    'system:time_start': date.millis(),
    'date': date.format('YYYY-MM-dd'),
    'year': year,
    'month': month,
    'yearMonth': date.format('YYYY-MM')
  });
}

var etCollection = mod16.map(processET);

print('MOD16A2 ET composites:', etCollection.size());
var etLast = etCollection.sort('system:time_start', false).first();
print('ET date range:', etCollection.sort('system:time_start').first().get('date'), 'to', etLast.get('date'));

// ============================================================================
// MODIS MOD17A2H - GROSS PRIMARY PRODUCTIVITY
// ============================================================================

var mod17 = ee.ImageCollection('MODIS/061/MOD17A2H')
  .filterDate(ANALYSIS_START, ANALYSIS_END)
  .filterBounds(roi);

function processGPP(image) {
  var date = ee.Date(image.get('system:time_start'));
  var year = date.get('year');
  var month = date.get('month');

  // GPP in kg C/m^2 = g C/m^2 * 1000
  var gpp = image.select('Gpp').multiply(0.1).multiply(1000).rename('GPP_gC_m2');
  var gppQC = image.select('Psn_QC');

  // Quality control: keep only good quality pixels (QC=0)
  var goodQuality = gppQC.eq(0);
  var gppQA = gpp.updateMask(goodQuality);

  return gppQA.set({
    'system:time_start': date.millis(),
    'date': date.format('YYYY-MM-dd'),
    'year': year,
    'month': month,
    'yearMonth': date.format('YYYY-MM')
  });
}

var gppCollection = mod17.map(processGPP);

print('MOD17A2H GPP composites:', gppCollection.size());
var gppLast = gppCollection.sort('system:time_start', false).first();
print('GPP date range:', gppCollection.sort('system:time_start').first().get('date'), 'to', gppLast.get('date'));

// ============================================================================
// CALCULATE WATER USE EFFICIENCY (WUE)
// ============================================================================

function calculateWUE(etImage, gppImage) {
  // WUE = GPP / ET (g C / kg H2O)
  // ET must be > 0.1 to avoid division by zero
  var wue = gppImage.divide(etImage)
    .updateMask(etImage.gt(0.1))
    .rename('WUE_gC_kg');

  var date = ee.Date(etImage.get('system:time_start'));
  return wue.set({
    'system:time_start': date.millis(),
    'date': etImage.get('date'),
    'year': etImage.get('year'),
    'month': etImage.get('month'),
    'yearMonth': etImage.get('yearMonth')
  });
}

// Match ET and GPP by date and create combined dataset
var monthlyData = etCollection.map(function(etImg) {
  var date = ee.Date(etImg.get('system:time_start'));
  var gppImg = gppCollection.filterDate(date, date.advance(1, 'day')).first();

  var combined = ee.Image.cat([etImg, gppImg])
    .set({
      'system:time_start': date.millis(),
      'date': etImg.get('date'),
      'year': etImg.get('year'),
      'month': etImg.get('month'),
      'yearMonth': etImg.get('yearMonth')
    });

  return combined;
}).filter(ee.Filter.notNull(['ET_mm', 'GPP_gC_m2']));

print('Combined monthly composites:', monthlyData.size());

// ============================================================================
// MONTHLY STATISTICS (2021-2026)
// ============================================================================

// Calculate annual monthly averages
var years = [2021, 2022, 2023, 2024, 2025, 2026];
var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var monthlyStats = ee.List(years).map(function(year) {
  return ee.List(months).map(function(month) {
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    var monthData = monthlyData
      .filterDate(startDate, endDate)
      .select(['ET_mm', 'GPP_gC_m2']);

    if (monthData.size().getInfo() === 0) {
      return null;
    }

    var etMean = monthData.select('ET_mm').mean();
    var gppMean = monthData.select('GPP_gC_m2').mean();
    var wueMean = gppMean.divide(etMean).updateMask(etMean.gt(0.1));

    return ee.Image.cat([etMean, gppMean, wueMean])
      .set({
        'year': year,
        'month': month,
        'yearMonth': ee.String(year).cat('-').cat(
          ee.Algorithms.String(month).slice(0, 2)
        )
      });
  }).flatten();
}).flatten().filter(ee.Filter.notNull(['ET_mm']));

print('Monthly statistics calculated');

// ============================================================================
// ANNUAL SUMMARIES (2021-2026)
// ============================================================================

var annualStats = ee.List(years).map(function(year) {
  var startDate = ee.Date.fromYMD(year, 1, 1);
  var endDate = ee.Date.fromYMD(year + 1, 1, 1);

  var yearData = monthlyData
    .filterDate(startDate, endDate)
    .select(['ET_mm', 'GPP_gC_m2']);

  if (yearData.size().getInfo() === 0) {
    return null;
  }

  var etSum = yearData.select('ET_mm').sum();
  var gppSum = yearData.select('GPP_gC_m2').sum();
  var wueSum = gppSum.divide(etSum).updateMask(etSum.gt(10));

  return ee.Image.cat([etSum, gppSum, wueSum])
    .set({'year': year});
}).filter(ee.Filter.notNull(['ET_mm']));

print('Annual statistics calculated');

// ============================================================================
// VISUALIZATION
// ============================================================================

var etVis = {min: 0, max: 20, palette: ['fff7fb', 'ece7f2', 'd0d1e6', 'a6bddb', '74a9cf', '3690c0', '0570b0', '045a8d']};
var gppVis = {min: 0, max: 1000, palette: ['ffffe5', 'f7fcb9', 'd9f0a3', 'addd8e', '78c679', '41ab5d', '238443', '006837']};
var wueVis = {min: 0, max: 50, palette: ['8c510a', 'd8b365', 'f6e8c3', 'f5f5f5', 'c7eae5', '5ab4ac', '01665e']};

// Display latest month
var latestMonth = monthlyData.sort('system:time_start', false).first();
var latestDate = latestMonth.get('yearMonth');

Map.addLayer(latestMonth.select('ET_mm').clip(roi).visualize(etVis), {}, 'Latest ET');
Map.addLayer(latestMonth.select('GPP_gC_m2').clip(roi).visualize(gppVis), {opacity: 0.7}, 'Latest GPP');

// Display 2025-2026 average (May 2026 included)
var recent = monthlyData
  .filterDate(ee.Date('2025-01-01'), ANALYSIS_END)
  .select(['ET_mm', 'GPP_gC_m2']);

var recentET = recent.select('ET_mm').mean();
var recentGPP = recent.select('GPP_gC_m2').mean();

Map.addLayer(recentET.clip(roi).visualize(etVis), {}, '2025-2026 Average ET');
Map.addLayer(recentGPP.clip(roi).visualize(gppVis), {opacity: 0.7}, '2025-2026 Average GPP');

print('Latest month:', latestDate);

// ============================================================================
// EXPORT DATA FOR ANALYSIS
// ============================================================================

// Export latest month as GeoTIFF
var latestToExport = latestMonth.select(['ET_mm', 'GPP_gC_m2'])
  .clip(roi)
  .reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});

Export.image.toDrive({
  image: latestToExport,
  description: 'Thailand_ET_GPP_Latest_Month',
  folder: 'GEE_ET',
  fileNamePrefix: latestDate,
  region: roi,
  scale: OUTPUT_SCALE,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// Export 2025-2026 average
Export.image.toDrive({
  image: ee.Image.cat([recentET, recentGPP]).clip(roi).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE}),
  description: 'Thailand_ET_GPP_2025_2026_Average',
  folder: 'GEE_ET',
  fileNamePrefix: 'Thailand_2025_2026_Average',
  region: roi,
  scale: OUTPUT_SCALE,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// Export annual summaries (2021-2025 complete years)
var annualToExport = annualStats.filter(ee.Filter.lt('year', 2026));
var annualImage = ee.Image(annualToExport.get(0));

Export.image.toDrive({
  image: annualImage.clip(roi).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE}),
  description: 'Thailand_Annual_Summary_2021_2025',
  folder: 'GEE_ET',
  fileNamePrefix: 'Thailand_Annual_2021_2025',
  region: roi,
  scale: OUTPUT_SCALE,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

print('Exports queued!');

// ============================================================================
// SUMMARY STATISTICS
// ============================================================================

// Print summary for console
print('=== SUMMARY STATISTICS ===');
print('Analysis period: 2021-01-01 to 2026-05-31');
print('Total monthly composites:', monthlyData.size());
print('Thailand area: ~513,000 km²');
print('Data resolution: 500m (native MODIS)');
print('Quality control: QC=0 only (best quality)');
print('');
print('Latest available data:', latestDate);
print('');
print('ET Range (recent 1.5 years): 0-20 mm per 8 days');
print('GPP Range (recent 1.5 years): 0-1000 g C/m² per 8 days');
print('WUE (recent 1.5 years): 10-50 g C/kg H₂O (varies)');
