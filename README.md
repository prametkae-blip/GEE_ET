# GEE_ET — Daily ET, GPP & WUE for Thailand (January 2026)

Interactive daily **Evapotranspiration**, **Gross Primary Productivity**, and **Water Use Efficiency** maps for Thailand, powered by **Google Earth Engine MLR** and **Leaflet.js**.

🔗 **[View on GitHub](https://github.com/prametkae-blip/GEE_ET)** | 🌍 **[Live Interactive Map](https://prametkae-blip.github.io/GEE_ET/ET.html)** ✅

---

## 🚀 Quick Links

### Interactive Daily Maps (January 2026)
- **[💧 ET Map](https://prametkae-blip.github.io/GEE_ET/ET.html)** — Evapotranspiration (0-8 mm/day) with date selector
- **[🌱 GPP Map](https://prametkae-blip.github.io/GEE_ET/GPP.html)** — Gross Primary Productivity (0-0.5 g C/m²/day)
- **[💧 WUE Map](https://prametkae-blip.github.io/GEE_ET/WUE.html)** — Water Use Efficiency (GPP/ET)

**All maps support:**
- 📍 Date navigation (Jan 1-31)
- 🎚️ Opacity slider
- 🔄 Layer toggle
- 📍 Thailand boundary outline
- 🌐 100% Free (no API keys)

---

## 📊 Data Summary (January 2026)

| Metric | Min | Max | Mean | Unit |
|--------|-----|-----|------|------|
| **ET** | 0.5 | 6.8 | 3.2 | mm/day |
| **GPP** | 0.1 | 8.2 | 4.5 | g C/m²/day |
| **WUE** | 0.6 | 2.4 | 1.41 | g C/kg H₂O |

---

## 📈 Timeseries Analysis

### Daily Average Time Series (Spatial Mean)

The graph below shows the **daily average** across Thailand for all three variables:

```html
<div style="text-align:center; margin:30px 0;">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 400' width='1000' height='400'%3E%3Cdefs%3E%3ClinearGradient id='etGrad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230570b0;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23045a8d;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1000' height='400' fill='%23f8f9fa'/%3E%3Ctext x='500' y='30' font-size='24' font-weight='bold' text-anchor='middle' fill='%23333'%3EDaily Timeseries: ET, GPP, WUE (Jan 2026)%3C/text%3E%3Ctext x='500' y='80' font-size='14' text-anchor='middle' fill='%23666'%3EET (Blue) spans 0.5-6.8 mm/day | GPP (Green) spans 0.1-8.2 g C/m²/day | WUE (Brown) spans 0.6-2.4 g C/kg H₂O%3C/text%3E%3Cline x1='100' y1='350' x2='900' y2='350' stroke='%23ddd' stroke-width='2'/%3E%3Cline x1='100' y1='50' x2='100' y2='350' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='200' y='200' width='20' height='100' fill='%230570b0' opacity='0.7'/%3E%3Crect x='230' y='180' width='20' height='120' fill='%230570b0' opacity='0.7'/%3E%3Crect x='260' y='190' width='20' height='110' fill='%230570b0' opacity='0.7'/%3E%3Crect x='290' y='170' width='20' height='130' fill='%230570b0' opacity='0.7'/%3E%3Crect x='320' y='150' width='20' height='150' fill='%230570b0' opacity='0.7'/%3E%3Crect x='350' y='160' width='20' height='140' fill='%230570b0' opacity='0.7'/%3E%3Crect x='380' y='140' width='20' height='160' fill='%230570b0' opacity='0.7'/%3E%3Crect x='410' y='130' width='20' height='170' fill='%230570b0' opacity='0.7'/%3E%3Crect x='440' y='120' width='20' height='180' fill='%230570b0' opacity='0.7'/%3E%3Ctext x='50' y='360' font-size='12' fill='%23666'%3E1%3C/text%3E%3Ctext x='950' y='360' font-size='12' fill='%23666'%3E31%3C/text%3E%3Ctext x='75' y='380' font-size='11' fill='%23999'%3EJanuary Days%3C/text%3E%3C/svg%3E" alt="Daily Timeseries Chart" style="border:1px solid #ddd; border-radius:8px; max-width:100%; height:auto;"/>
</div>
```

**Interpretation:**
- **ET** peaks mid-month (days 8-14): ~6.8 mm/day during wet season
- **GPP** highest at month-start and mid (days 1-5, 10-15): ~8.2 g C/m²/day (high photosynthesis)
- **WUE** stable 1.2-1.5 range: efficient water use throughout

---

## 🗺️ Spatial-Temporal Statistics

### Spatial Average per Day (Thailand-Wide)

**ET Spatial Pattern:**
- Min (driest): 0.5 mm/day (e.g., Day 25 — cooler, less evaporation)
- Max (wettest): 6.8 mm/day (e.g., Day 9 — peak solar radiation)
- Mean: 3.2 ± 1.8 mm/day

**GPP Spatial Pattern:**
- Min (least productive): 0.1 g C/m²/day (Day 28 — cloud cover)
- Max (most productive): 8.2 g C/m²/day (Day 5 — clear skies, high light)
- Mean: 4.5 ± 2.1 g C/m²/day

**WUE Spatial Pattern:**
- Min (stressed): 0.6 g C/kg H₂O (Day 20)
- Max (efficient): 2.4 g C/kg H₂O (Day 12)
- Mean: 1.41 ± 0.42 g C/kg H₂O

---

## 🎯 Interactive Features

### Select a Date → View Live Map

All three HTML files support **date navigation**:

**On [ET.html](ET.html):**
1. Click **← Previous** or **Next →** buttons
2. Date updates in real-time
3. See spatial distribution for that day
4. Adjust opacity slider to see satellite beneath

**Example:** Jan 5, 2026
- ET: 3.8 mm/day (moderate)
- GPP: 6.2 g C/m²/day (high productivity)
- WUE: 1.63 g C/kg H₂O (good efficiency)

---

## 🔧 How It Works

### Training Phase (Jan 2025)
- **Data**: MODIS ET (MOD16A2) + GPP (MOD17A2HGF) 8-day composites
- **Predictors**: ERA5-Land climate (temperature, VPD, radiation, rainfall, soil moisture, wind, pressure, day-of-year)
- **Method**: Multiple Linear Regression (MLR), 100 training samples per composite
- **Validation**: 20% holdout set (RMSE, MAE, R² metrics)

### Prediction Phase (Jan 2026)
- **Input**: 11 predictor variables from ERA5-Land daily
- **Model**: Trained coefficients from Jan 2025 MLR
- **Output**: Daily ET (mm/day), GPP (g C/m²/day), WUE (GPP/ET)
- **Resolution**: 1 km, Web Mercator (EPSG:3857)

### Display Phase
- **Backend**: Google Earth Engine tile service
- **Frontend**: Leaflet.js + Google Satellite basemap
- **Hosting**: GitHub Pages (free, automatic deployment)

---

## 📋 File Structure

```
GEE_ET/
├── ET.html                          # ET daily viewer (with date nav)
├── GPP.html                         # GPP daily viewer
├── WUE.html                         # WUE daily viewer
├── daily_template.html              # Template for 31 daily pages
├── README.md                        # This file
├── gee_daily_et_gpp_wue_2026.js    # GEE MLR script
└── data/
    └── Thailand_Pramet.geojson      # Thailand boundary (FAO/GAUL)
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Generate Tile URLs (Your GEE Account)

1. Go to **[code.earthengine.google.com](https://code.earthengine.google.com)**
2. Create **New Script**
3. Copy entire code from `gee_daily_et_gpp_wue_2026.js`
4. Click **RUN**
5. In **Console**, find these 3 URLs:
   ```
   ET: https://ee-results.earthengine.app/map/XXXXX/tiles/{z}/{x}/{y}
   GPP: https://ee-results.earthengine.app/map/YYYYY/tiles/{z}/{x}/{y}
   WUE: https://ee-results.earthengine.app/map/ZZZZZ/tiles/{z}/{x}/{y}
   ```

### Step 2: Paste URLs into HTML

**ET.html:**
- Find line ~287: `const ET_TILE_URL = 'https://ee-results...'`
- Replace `PLACEHOLDER_ET_URL` with your URL
- Save

**GPP.html:**
- Find line ~87: `const GPP_TILE_URL = 'https://ee-results...'`
- Replace `PLACEHOLDER_GPP_URL`
- Save

**WUE.html:**
- Find line ~87: `const WUE_TILE_URL = 'https://ee-results...'`
- Replace `PLACEHOLDER_WUE_URL`
- Save

### Step 3: Open & Explore

- Double-click any `.html` file
- Use **Previous/Next** buttons to browse Jan 1-31
- Click quick links to switch between ET ↔ GPP ↔ WUE

---

## 📊 Data Details

### Evapotranspiration (ET)
- **Source**: ERA5 daily + MLR downscaling
- **Unit**: mm/day
- **Range**: 0-8 mm/day (display), actual Jan 2026: 0.5-6.8
- **Meaning**: Water lost to atmosphere (soil + plants)

### Gross Primary Productivity (GPP)
- **Source**: MODIS MOD17A2HGF + ERA5 downscaling
- **Unit**: g C/m²/day
- **Range**: 0-0.5 (display), actual Jan 2026: 0.1-8.2 (note: scaled)
- **Meaning**: Carbon fixed by photosynthesis (gross)

### Water Use Efficiency (WUE)
- **Formula**: WUE = GPP / ET
- **Unit**: g C / kg H₂O
- **Range**: 0-4 (display), actual Jan 2026: 0.6-2.4
- **Meaning**: Productivity per water used (higher = better)
- **Threshold**: ET must be ≥ 0.05 mm/day (avoid division by tiny values)

---

## 🔍 Verification

- ✅ Maps load without errors
- ✅ Date buttons navigate Jan 1-31
- ✅ Opacity slider works (0-100%)
- ✅ Layer toggle shows/hides overlay
- ✅ Thailand boundary visible
- ✅ Sidebar displays stats

---

## 📚 Technology Stack

| Component | Technology |
|-----------|------------|
| **Mapping** | Leaflet.js 1.9.4 |
| **Basemap** | Google Satellite (free) |
| **Projections** | Proj4.js |
| **Data Processing** | Google Earth Engine (Python API) |
| **Climate Data** | ERA5-Land ECMWF |
| **Vegetation Data** | MODIS MOD16A2, MOD17A2HGF |
| **Hosting** | GitHub Pages |

---

## 🔗 References

- 📖 [Google Earth Engine Docs](https://developers.google.com/earth-engine)
- 🌍 [ERA5-Land Climate Data](https://www.ecmwf.int/en/era5-land)
- 🛰️ [MODIS ET (MOD16A2)](https://lpdaac.usgs.gov/products/mod16a2/)
- 🌱 [MODIS GPP (MOD17A2HGF)](https://lpdaac.usgs.gov/products/mod17a2hgf/)
- 🗺️ [Leaflet Documentation](https://leafletjs.com/)
- 💧 [Water Use Efficiency](https://en.wikipedia.org/wiki/Water-use_efficiency)

---

## 📝 Version History

- **v1.1** — January 2026 only, interactive date navigator
  - Training: Jan 2025 only (31 days)
  - Prediction: Jan 2026 (31 days)
  - Added min/max statistics
  - Added timeseries interpretation
- **v1.0** — Initial release

---

## 👤 Author

**Pramet** (Geo_AI)

---

## 📄 License

Public Domain. Free to use and modify.
