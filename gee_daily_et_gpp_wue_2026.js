// ============================================================================
// MULTIPLE LINEAR REGRESSION:
// MODIS ET + GPP 2025 → ERA5-Land predictors → Daily 2026
// Training: 2025-01-01 to 2025-12-31
// Prediction: 2026-01-01 to 2026-06-01 (Jan-May)
// Output: 1 km, EPSG:3857
// ============================================================================

var TRAIN_START = ee.Date('2025-01-01');
var TRAIN_END   = ee.Date('2025-01-31');  // January 2025 only
var PREDICT_START = ee.Date('2026-01-01');
var PREDICT_END = ee.Date('2026-02-01');  // January only

var OUTPUT_CRS = 'EPSG:3857';
var OUTPUT_SCALE = 1000;
var OUTPUT_PROJECTION = ee.Projection(OUTPUT_CRS).atScale(OUTPUT_SCALE);

var TOTAL_TRAINING_SAMPLES = 100;  // Minimal samples for quick test
var RANDOM_SEED = 42;
var MIN_ET_FOR_WUE = 0.05;
var CREATE_DAILY_EXPORTS = false;

var thailand = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Thailand'));
var roi = thailand.geometry();

Map.centerObject(roi, 6);
Map.addLayer(thailand.style({color: '000000', fillColor: '00000000', width: 1}), {}, 'Thailand boundary');

var predictorNames = ['constant', 'Tair_C', 'VPD_kPa', 'Solar_MJ_m2_day', 'Rain_mm_day', 'SM1', 'SM2', 'Wind_m_s', 'Pressure_kPa', 'DOY_sin', 'DOY_cos'];
var numberOfPredictors = predictorNames.length;

// Saturation vapour pressure
function saturationVapourPressure(tempC) {
  return ee.Image.constant(0.6108).multiply(tempC.multiply(17.27).divide(tempC.add(237.3)).exp());
}

function continuousTo1km(image) {
  return image.resample('bilinear').reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});
}

function modis500mTo1km(image) {
  return image.reduceResolution({reducer: ee.Reducer.mean(), maxPixels: 64, bestEffort: false})
    .reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});
}

function addConstantBand(image) {
  var constant = ee.Image.constant(1).rename('constant').reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});
  return image.addBands(constant);
}

function addDateProperties(image) {
  var date = ee.Date(image.get('system:time_start'));
  return image.set({date_string: date.format('YYYY-MM-dd'), year: date.get('year'), month: date.get('month'), doy: date.getRelative('day', 'year').add(1)});
}

// ERA5-Land Daily Predictors
function prepareERA5Daily(image) {
  var date = ee.Date(image.get('system:time_start'));

  var tair = image.select('temperature_2m').subtract(273.15).rename('Tair_C');
  var tdew = image.select('dewpoint_temperature_2m').subtract(273.15).rename('Tdew_C');

  var es = saturationVapourPressure(tair);
  var ea = saturationVapourPressure(tdew);
  var vpd = es.subtract(ea).max(0).rename('VPD_kPa');

  var solar = image.select('surface_solar_radiation_downwards_sum').divide(1e6).max(0).rename('Solar_MJ_m2_day');
  var rain = image.select('total_precipitation_sum').multiply(1000).max(0).rename('Rain_mm_day');

  var sm1 = image.select('volumetric_soil_water_layer_1').clamp(0, 1).rename('SM1');
  var sm2 = image.select('volumetric_soil_water_layer_2').clamp(0, 1).rename('SM2');

  var u10 = image.select('u_component_of_wind_10m');
  var v10 = image.select('v_component_of_wind_10m');
  var wind = u10.pow(2).add(v10.pow(2)).sqrt().rename('Wind_m_s');

  var pressure = image.select('surface_pressure').divide(1000).rename('Pressure_kPa');

  var doy = ee.Number(date.getRelative('day', 'year')).add(1);
  var angle = doy.multiply(2 * Math.PI).divide(365.25);

  var doySin = ee.Image.constant(angle.sin()).rename('DOY_sin').reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});
  var doyCos = ee.Image.constant(angle.cos()).rename('DOY_cos').reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});

  var predictors = ee.Image.cat([continuousTo1km(tair), continuousTo1km(vpd), continuousTo1km(solar), continuousTo1km(rain), continuousTo1km(sm1), continuousTo1km(sm2), continuousTo1km(wind), continuousTo1km(pressure), doySin, doyCos]);

  predictors = addConstantBand(predictors).select(predictorNames).toFloat();

  return addDateProperties(predictors.set('system:time_start', date.millis()));
}

var era5All = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
  .filterDate(TRAIN_START, PREDICT_END).filterBounds(roi).map(prepareERA5Daily);

var era5Train = era5All.filterDate(TRAIN_START, TRAIN_END);
var era5Predict2026 = era5All.filterDate(PREDICT_START, PREDICT_END);

print('ERA5 training days:', era5Train.size());
print('ERA5 prediction days:', era5Predict2026.size());

// MODIS ET 2025
function prepareMODISET(image) {
  var compositeStart = ee.Date(image.get('system:time_start'));
  var nominalEnd = compositeStart.advance(8, 'day');
  var compositeEnd = ee.Date(ee.Algorithms.If(nominalEnd.millis().gt(TRAIN_END.millis()), TRAIN_END, nominalEnd));
  var compositeDays = compositeEnd.difference(compositeStart, 'day');

  var etComposite500m = image.select('ET').multiply(0.1).rename('ET_composite_mm');
  var etQC = image.select('ET_QC');
  var goodQuality = etQC.bitwiseAnd(1).eq(0);

  var etDaily500m = etComposite500m.divide(compositeDays).updateMask(goodQuality).updateMask(etComposite500m.gte(0)).rename('ET_target');
  var etDaily1km = modis500mTo1km(etDaily500m).rename('ET_target');

  return etDaily1km.set({
    'system:time_start': compositeStart.millis(),
    'composite_start': compositeStart.format('YYYY-MM-dd'),
    'composite_end': compositeEnd.format('YYYY-MM-dd'),
    'composite_days': compositeDays
  });
}

var modisET2025 = ee.ImageCollection('MODIS/061/MOD16A2')
  .filterDate(TRAIN_START, TRAIN_END).filterBounds(roi).map(prepareMODISET);

print('MODIS ET composites:', modisET2025.size());

// MODIS GPP 2025
function prepareMODISGPP(image) {
  var compositeStart = ee.Date(image.get('system:time_start'));
  var nominalEnd = compositeStart.advance(8, 'day');
  var compositeEnd = ee.Date(ee.Algorithms.If(nominalEnd.millis().gt(TRAIN_END.millis()), TRAIN_END, nominalEnd));
  var compositeDays = compositeEnd.difference(compositeStart, 'day');

  var gppComposite500m = image.select('Gpp').multiply(0.1).rename('GPP_composite_gC_m2');
  var gppQC = image.select('Psn_QC');
  var goodQuality = gppQC.bitwiseAnd(1).eq(0);

  var gppDaily500m = gppComposite500m.divide(compositeDays).updateMask(goodQuality).updateMask(gppComposite500m.gte(0)).rename('GPP_target');
  var gppDaily1km = modis500mTo1km(gppDaily500m).rename('GPP_target');

  return gppDaily1km.set({
    'system:time_start': compositeStart.millis(),
    'composite_start': compositeStart.format('YYYY-MM-dd'),
    'composite_end': compositeEnd.format('YYYY-MM-dd'),
    'composite_days': compositeDays
  });
}

var modisGPP2025 = ee.ImageCollection('MODIS/061/MOD17A2HGF')
  .filterDate(TRAIN_START, TRAIN_END).filterBounds(roi).map(prepareMODISGPP);

print('MODIS GPP composites:', modisGPP2025.size());

// Create composite-mean predictors
function createCompositePredictors(targetImage) {
  targetImage = ee.Image(targetImage);
  var compositeStart = ee.Date(targetImage.get('system:time_start'));
  var compositeDays = ee.Number(targetImage.get('composite_days'));
  var compositeEnd = compositeStart.advance(compositeDays, 'day');

  var compositePredictors = era5Train.filterDate(compositeStart, compositeEnd).select(predictorNames).mean()
    .select(predictorNames).reproject({crs: OUTPUT_CRS, scale: OUTPUT_SCALE});

  return compositePredictors.set({
    'system:time_start': compositeStart.millis(),
    'composite_start': compositeStart.format('YYYY-MM-dd'),
    'composite_end': compositeEnd.format('YYYY-MM-dd'),
    'composite_days': compositeDays
  });
}

// Sampling
function createTrainingSamples(targetCollection, targetBand, samplesPerComposite, seed) {
  var targetList = targetCollection.toList(targetCollection.size());
  var indices = ee.List.sequence(0, targetCollection.size().subtract(1));

  var samples = ee.FeatureCollection(
    indices.iterate(function(index, accumulator) {
      index = ee.Number(index);
      accumulator = ee.FeatureCollection(accumulator);

      var targetImage = ee.Image(targetList.get(index));
      var predictors = createCompositePredictors(targetImage);
      var target = targetImage.select(targetBand);

      var trainingImage = predictors.addBands(target).updateMask(target.mask()).updateMask(target.gte(0)).toFloat();

      var compositeSamples = trainingImage.sample({
        region: roi, projection: OUTPUT_PROJECTION, scale: OUTPUT_SCALE,
        numPixels: samplesPerComposite, seed: ee.Number(seed).add(index),
        dropNulls: true, tileScale: 8, geometries: false
      });

      return accumulator.merge(compositeSamples);
    }, ee.FeatureCollection([]))
  );

  return samples.filter(ee.Filter.notNull(predictorNames.concat([targetBand])));
}

var etSamplesPerComposite = ee.Number(TOTAL_TRAINING_SAMPLES).divide(modisET2025.size()).ceil();
var gppSamplesPerComposite = ee.Number(TOTAL_TRAINING_SAMPLES).divide(modisGPP2025.size()).ceil();

var etSamplesAll = createTrainingSamples(modisET2025, 'ET_target', etSamplesPerComposite, RANDOM_SEED);
var gppSamplesAll = createTrainingSamples(modisGPP2025, 'GPP_target', gppSamplesPerComposite, RANDOM_SEED + 1000);

print('ET training samples:', etSamplesAll.size());
print('GPP training samples:', gppSamplesAll.size());

// Train/validate split
var etSamplesSplit = etSamplesAll.randomColumn('random', RANDOM_SEED);
var etTrainingSamples = etSamplesSplit.filter(ee.Filter.lt('random', 0.8));
var etValidationSamples = etSamplesSplit.filter(ee.Filter.gte('random', 0.8));

var gppSamplesSplit = gppSamplesAll.randomColumn('random', RANDOM_SEED + 1);
var gppTrainingSamples = gppSamplesSplit.filter(ee.Filter.lt('random', 0.8));
var gppValidationSamples = gppSamplesSplit.filter(ee.Filter.gte('random', 0.8));

// Train MLR
var etRegressionResult = etTrainingSamples.reduceColumns({
  reducer: ee.Reducer.linearRegression({numX: numberOfPredictors, numY: 1}),
  selectors: predictorNames.concat(['ET_target'])
});
var etCoefficients = ee.Array(etRegressionResult.get('coefficients'));

var gppRegressionResult = gppTrainingSamples.reduceColumns({
  reducer: ee.Reducer.linearRegression({numX: numberOfPredictors, numY: 1}),
  selectors: predictorNames.concat(['GPP_target'])
});
var gppCoefficients = ee.Array(gppRegressionResult.get('coefficients'));

print('ET coefficients:', etCoefficients);
print('GPP coefficients:', gppCoefficients);

// Predict daily 2026
function predictDaily2026(image) {
  image = ee.Image(image);
  var date = ee.Date(image.get('system:time_start'));
  var predictors = image.select(predictorNames);

  var etPrediction = predictors.multiply(ee.Image.constant(etCoefficients).arrayProject([0]).arrayFlatten([predictorNames]))
    .reduce(ee.Reducer.sum()).max(0).rename('ET_daily_mm');

  var gppPrediction = predictors.multiply(ee.Image.constant(gppCoefficients).arrayProject([0]).arrayFlatten([predictorNames]))
    .reduce(ee.Reducer.sum()).max(0).rename('GPP_daily_gC_m2');

  var wue = gppPrediction.divide(etPrediction).updateMask(etPrediction.gt(MIN_ET_FOR_WUE)).rename('WUE_gC_kgH2O');

  return ee.Image.cat([etPrediction, gppPrediction, wue]).toFloat().set({
    'system:time_start': date.millis(),
    date_string: date.format('YYYY-MM-dd'),
    year: 2026,
    month: date.get('month'),
    doy: date.getRelative('day', 'year').add(1)
  });
}

var dailyPredictions2026 = era5Predict2026.map(predictDaily2026).sort('system:time_start');
print('Daily predictions:', dailyPredictions2026.size());

// January summary
var etJanuary = dailyPredictions2026.select('ET_daily_mm').sum().rename('ET_January_mm');
var gppJanuary = dailyPredictions2026.select('GPP_daily_gC_m2').sum().rename('GPP_January_gC_m2');
var wueJanuary = gppJanuary.divide(etJanuary).updateMask(etJanuary.gt(1)).rename('WUE_January_gC_kgH2O');

var summaryJanuary = ee.Image.cat([etJanuary, gppJanuary, wueJanuary]).toFloat();

// Visualization
var etVis = {min: 0, max: 700, palette: ['fff7fb', 'ece7f2', 'd0d1e6', 'a6bddb', '74a9cf', '3690c0', '0570b0', '045a8d']};
var gppVis = {min: 0, max: 1200, palette: ['ffffe5', 'f7fcb9', 'd9f0a3', 'addd8e', '78c679', '41ab5d', '238443', '006837']};
var wueVis = {min: 0, max: 4, palette: ['8c510a', 'd8b365', 'f6e8c3', 'f5f5f5', 'c7eae5', '5ab4ac', '01665e']};

Map.addLayer(etJanuary, etVis, 'ET January 2026');
Map.addLayer(gppJanuary, gppVis, 'GPP January 2026');
Map.addLayer(wueJanuary, wueVis, 'WUE January 2026');

// Generate tile URLs for Leaflet maps
var etImage = dailyPredictions2026.select('ET_daily_mm').mean().visualize(etVis);
var gppImage = dailyPredictions2026.select('GPP_daily_gC_m2').mean().visualize(gppVis);
var wueImage = dailyPredictions2026.select('WUE_gC_kgH2O').mean().visualize(wueVis);

var etTiles = etImage.getMapId(etVis);
print('ET URL:', etTiles.urlFormat);

var gppTiles = gppImage.getMapId(gppVis);
print('GPP URL:', gppTiles.urlFormat);

var wueTiles = wueImage.getMapId(wueVis);
print('WUE URL:', wueTiles.urlFormat);

// Export summary
Export.image.toDrive({
  image: summaryJanuary,
  description: 'Thailand_ET_GPP_WUE_1km_2026_January',
  folder: 'GEE_ET_GPP_WUE',
  fileNamePrefix: 'Thailand_ET_GPP_WUE_January',
  region: roi,
  crs: OUTPUT_CRS,
  scale: OUTPUT_SCALE,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  formatOptions: {cloudOptimized: true}
});

print('Export queued!');
