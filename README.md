# GEE_ET — Daily Evapotranspiration, GPP & Water Use Efficiency for Thailand (2026 January)

Interactive web maps showing **daily Evapotranspiration (ET)**, **Gross Primary Productivity (GPP)**, and **Water Use Efficiency (WUE)** for Thailand powered by **Google Earth Engine** and **Leaflet.js**.

🔗 **[View on GitHub](https://github.com/prametkae-blip/GEE_ET)** | 🌍 **[Live Demo](https://prametkae-blip.github.io/GEE_ET/)** ✅

## 🚀 Quick Links

### Daily Maps (January 2026)
- **[💧 View ET Map](https://prametkae-blip.github.io/GEE_ET/ET.html)** — Evapotranspiration (0-8 mm/day)
- **[🌱 View GPP Map](https://prametkae-blip.github.io/GEE_ET/GPP.html)** — Gross Primary Productivity (0-0.5 g C/m²/day)
- **[💧 View WUE Map](https://prametkae-blip.github.io/GEE_ET/WUE.html)** — Water Use Efficiency (GPP/ET)

(Hosted on GitHub Pages • No installation needed • 100% free)

---

## Features

- 🛰️ **Multi-Source Data**:
  - **ET**: ERA5 daily climate data
  - **GPP**: MODIS NPP vegetation index
  - **WUE**: Calculated efficiency (GPP/ET)
- 📅 **Daily Data**: Jan 1 – Jan 31, 2026
- 🗺️ **Interactive Maps**: Leaflet viewer with Google Satellite basemap
- 🔊 **Layer Toggle**: Switch between base and overlay
- 🎚️ **Opacity Slider**: Adjust layer transparency
- 📍 **Thailand Boundary**: FAO/GAUL dataset, visually outlined
- 💚 **100% Free**: No API keys required

---

## Quick Start (3 Steps)

### Step 1: Generate Tile URLs

1. Go to **[Google Earth Engine Code Editor](https://code.earthengine.google.com)**
2. Create a **New Script**
3. Copy entire code from `gee_daily_et_gpp_wue_2026.js`
4. Click **"Run"**
5. In the **Console**, copy the 3 printed URLs:
   - `ET (Evapotranspiration) URL: https://ee-results...`
   - `GPP (Gross Primary Productivity) URL: https://ee-results...`
   - `WUE (Water Use Efficiency) URL: https://ee-results...`

### Step 2: Paste URLs into HTML Files

**For ET:**
1. Open `ET.html` in text editor
2. Find line ~113: `const ET_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_ET_URL/tiles/{z}/{x}/{y}';`
3. Replace `PLACEHOLDER_ET_URL` with your ET URL
4. Save

**For GPP:**
1. Open `GPP.html` in text editor
2. Find line ~113: `const GPP_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_GPP_URL/tiles/{z}/{x}/{y}';`
3. Replace `PLACEHOLDER_GPP_URL` with your GPP URL
4. Save

**For WUE:**
1. Open `WUE.html` in text editor
2. Find line ~113: `const WUE_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_WUE_URL/tiles/{z}/{x}/{y}';`
3. Replace `PLACEHOLDER_WUE_URL` with your WUE URL
4. Save

### Step 3: Open & Explore

- Double-click any HTML file (ET.html, GPP.html, or WUE.html)
- Or open in web browser
- Maps have quick links to each other
- No installation required!

---

## File Structure

```
GEE_ET/
├── ET.html                          # Evapotranspiration viewer
├── GPP.html                         # Gross Primary Productivity viewer
├── WUE.html                         # Water Use Efficiency viewer
├── README.md                        # This file
├── gee_daily_et_gpp_wue_2026.js    # Google Earth Engine script
└── data/
    └── Thailand_Pramet.geojson      # Thailand boundary (FAO/GAUL)
```

---

## Data Details

### Evapotranspiration (ET)
- **Source**: ERA5 Daily Total Evaporation
- **Unit**: mm/day
- **Range**: 0-8 mm/day
- **Processing**: Daily average from climate data
- **Period**: 2026-01-01 to 2026-01-31

### Gross Primary Productivity (GPP)
- **Source**: MODIS MOD17A2HGF
- **Unit**: g C/m²/day
- **Range**: 0-0.5 g C/m²/day
- **Processing**: Daily average from 8-day composite
- **Period**: 2026-01-01 to 2026-01-31

### Water Use Efficiency (WUE)
- **Formula**: WUE = GPP / ET
- **Unit**: g C / kg H₂O (scaled 0-100 for visualization)
- **Meaning**: How efficiently plants use water to produce biomass
- **High WUE**: Efficient water use
- **Low WUE**: Inefficient water use (stressed plants)

---

## How It Works

### The GEE Script (`gee_daily_et_gpp_wue_2026.js`)

Runs in your authenticated Google Earth Engine account:

1. **Data Loading**:
   - ERA5 Daily: climate/evaporation data
   - MODIS MOD17A2H: vegetation productivity

2. **Spatial Filter**: Thailand (FAO/GAUL)

3. **Temporal Filter**: Jan 1 – Jan 31, 2026

4. **Processing**:
   - ET: Direct from ERA5 latent heat flux
   - GPP: MODIS NPP scaled to daily (÷8)
   - WUE: Calculated as GPP/ET

5. **Visualization**:
   - ET: Red palette (low→high water)
   - GPP: Green palette (low→high productivity)
   - WUE: Purple palette (low→high efficiency)

6. **Export**: Generates 3 tile URLs for Leaflet

### The Viewers (ET.html, GPP.html, WUE.html)

- Leaflet map centered on Thailand
- Google Satellite basemap (free, no API key)
- Individual overlay layers (ET, GPP, or WUE)
- Thailand boundary outline (FAO/GAUL)
- Opacity slider & layer toggle
- Quick links between maps

---

## GitHub Repository

📍 **[prametkae-blip/GEE_ET](https://github.com/prametkae-blip/GEE_ET)**

Clone or fork:

```bash
git clone https://github.com/prametkae-blip/GEE_ET.git
cd GEE_ET
# Then open ET.html, GPP.html, or WUE.html in a browser
```

---

## Technology Stack

- **Frontend**:
  - [Leaflet.js](https://leafletjs.com/) — mapping library
  - [Leaflet Proj4](https://github.com/kartena/Proj4Leaflet) — coordinate projection
  - [Google Maps XYZ](https://developers.google.com/maps) — basemap
- **Backend**:
  - [Google Earth Engine](https://earthengine.google.com/) — satellite data processing
  - [ERA5](https://www.ecmwf.int/en/era5-land) — climate reanalysis
  - [MODIS MOD17A2H](https://lpdaac.usgs.gov/products/mod17a2h/) — vegetation productivity
- **Hosting**:
  - GitHub Pages (automatic deployment)

---

## References

- 📚 [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- 🌍 [ERA5 Climate Data](https://www.ecmwf.int/en/era5-land)
- 🛰️ [MODIS MOD17A2H (NASA LPDAAC)](https://lpdaac.usgs.gov/products/mod17a2h/)
- 🗺️ [Leaflet Documentation](https://leafletjs.com/)
- 📊 [Water Use Efficiency in Plants](https://en.wikipedia.org/wiki/Water-use_efficiency)

---

## Version History

- **v1.0** — Initial release (2026-07-14)
  - Daily ET from ERA5
  - Daily GPP from MODIS
  - Calculated WUE (GPP/ET)
  - 3 separate HTML viewers
  - Date range: 2026 Jan-Jun

---

## License

Public domain. Free to use and modify.

## Author

Pramet (Geo_AI)
