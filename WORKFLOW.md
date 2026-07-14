# GEE_ET Workflow — From GEE Script to Daily Maps

Complete step-by-step guide to generate 31 daily HTML visualizations from Google Earth Engine.

---

## 📋 Complete Workflow

### **Phase 1: Run GEE Script** (Your Account)

#### Step 1.1: Open Google Earth Engine
1. Go to [code.earthengine.google.com](https://code.earthengine.google.com)
2. Click **+ New Script**
3. Give it a name: `Thailand_Daily_ET_GPP_WUE_2026`

#### Step 1.2: Paste GEE Code
1. Copy entire code from `gee_daily_et_gpp_wue_2026.js`
2. Paste into the Code Editor
3. Click **RUN**

#### Step 1.3: Check Console Output
Look for these lines in **Console** (lower right):
```
ERA5 training days: 31
ERA5 prediction days: 31
MODIS ET composites: 4
MODIS GPP composites: 4
ET training samples: ...
GPP training samples: ...
Daily predictions: 31
Export queued!
```

✅ If you see "Daily predictions: 31" → Success!

#### Step 1.4: Export to Google Drive
1. Click **Tasks** tab (right panel)
2. Find: `Thailand_ET_GPP_WUE_1km_2026_January`
3. Click **RUN** button
4. Select folder in Google Drive (default: `GEE_ET_GPP_WUE`)
5. Wait for export to complete (~5-30 min depending on size)

#### Step 1.5: Download Export
1. Go to [Google Drive](https://drive.google.com)
2. Navigate to folder `GEE_ET_GPP_WUE`
3. Find file: `Thailand_ET_GPP_WUE_January.tif` (or `.csv`)
4. Download to your computer

---

### **Phase 2: Convert to CSV** (Optional if not CSV)

If GEE exported GeoTIFF, you need to convert to CSV first.

#### Option A: Use GDAL (Command Line)
```bash
gdal_translate -of CSV Thailand_ET_GPP_WUE_January.tif data.csv
```

#### Option B: Use Python + Rasterio
```python
import rasterio
import pandas as pd
import numpy as np

with rasterio.open('Thailand_ET_GPP_WUE_January.tif') as src:
    data = src.read()
    # Extract bands and create CSV
    # Band 1 = ET, Band 2 = GPP, Band 3 = WUE
```

#### Option C: Already Have CSV
If your export is already CSV with columns:
- `date` or `system:time_start`
- `ET_daily_mm`
- `GPP_daily_gC_m2`

→ Skip to Phase 3!

---

### **Phase 3: Generate Daily HTML Files**

#### Step 3.1: Prepare Your CSV
Ensure your CSV has format:
```
date,ET_daily_mm,GPP_daily_gC_m2
2026-01-01,3.2,4.5
2026-01-02,3.4,4.8
...
```

**Example provided:** `sample_daily_data.csv` (edit values if needed)

#### Step 3.2: Run Python Script
```bash
cd C:\Users\prame\GEE_ET
python generate_daily_html.py sample_daily_data.csv
```

Or with your own CSV:
```bash
python generate_daily_html.py your_daily_data.csv
```

#### Step 3.3: Check Output
You should see:
```
✅ day_2026_01_01.html
✅ day_2026_01_02.html
...
✅ day_2026_01_31.html

✅ Generated 31 daily HTML files!
```

---

### **Phase 4: View the Maps**

#### Option A: Open Directly
Double-click any generated HTML file:
- `day_2026_01_01.html`
- `day_2026_01_02.html`
- etc.

Each file has **← Previous** and **Next →** buttons to navigate through January.

#### Option B: Create Index Page
Create `index.html` (optional) to list all days:

```html
<!DOCTYPE html>
<html>
<head>
  <title>January 2026 Daily ET, GPP, WUE</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    .card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
    .card a { text-decoration: none; color: #667eea; font-weight: bold; }
    .card a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>📅 January 2026 — Daily ET, GPP, WUE Maps</h1>
  <div class="grid">
    <div class="card"><a href="day_2026_01_01.html">January 1</a></div>
    <div class="card"><a href="day_2026_01_02.html">January 2</a></div>
    <div class="card"><a href="day_2026_01_03.html">January 3</a></div>
    <!-- ... repeat for all 31 days ... -->
    <div class="card"><a href="day_2026_01_31.html">January 31</a></div>
  </div>
</body>
</html>
```

---

## 🐍 Python Script Details

### What `generate_daily_html.py` Does

1. **Reads CSV** with date, ET, GPP columns
2. **Calculates WUE** = GPP / ET (with threshold ET ≥ 0.05)
3. **Generates HTML** for each day with:
   - Date navigation (prev/next buttons)
   - Three cards (ET, GPP, WUE) with values
   - Color-coded styling
   - Back link to main page

### Requirements
- Python 3.6+
- CSV file with proper headers

### Usage
```bash
python generate_daily_html.py <csv_file>
```

### Output
- 31 HTML files: `day_2026_01_01.html` → `day_2026_01_31.html`
- Each file is standalone (can open directly)
- Navigation buttons link between consecutive days

---

## 🗺️ Interactive Map Integration (Optional)

To add actual **Leaflet maps** to daily HTMLs, you'd need:

1. **Export GEE as tiles** (not GeoTIFF) → Get tile URL
2. **Embed in HTML** with Leaflet.js

For now, the generated HTMLs show **data values only** (simpler, faster).

If you want maps later:
- Use existing `ET.html`, `GPP.html`, `WUE.html`
- Those have Leaflet + Google Satellite basemap
- Date navigation can be added to those files

---

## 📊 Expected Data Range (January 2026)

From sample data:

| Variable | Min | Max | Mean |
|----------|-----|-----|------|
| ET | 0.5 | 6.8 | 3.8 |
| GPP | 0.1 | 8.2 | 5.2 |
| WUE | 0.01 | 2.4 | 1.4 |

Your actual data may differ based on MODIS + ERA5 predictions.

---

## ✅ Checklist

- [ ] Copy GEE script to code.earthengine.google.com
- [ ] Click RUN and wait for training
- [ ] Export to Google Drive
- [ ] Download GeoTIFF or CSV
- [ ] Convert to CSV if needed (GDAL/Rasterio)
- [ ] Prepare CSV with date, ET_daily_mm, GPP_daily_gC_m2
- [ ] Run: `python generate_daily_html.py sample_daily_data.csv`
- [ ] Open `day_2026_01_01.html` in browser
- [ ] Use ← Previous / Next → to navigate
- [ ] (Optional) Create index page linking all 31 days

---

## 🔧 Troubleshooting

### GEE Export Takes Too Long
- Normal for large regions (Thailand at 1 km resolution = ~500k pixels)
- Check **Tasks** panel for progress
- May take 30 min - 2 hours

### CSV Not Recognized
- Check column headers: must be exactly `date`, `ET_daily_mm`, `GPP_daily_gC_m2`
- Dates format: `2026-01-01` (YYYY-MM-DD)
- Use provided `sample_daily_data.csv` as template

### HTML Files Don't Open
- Make sure you're opening them with a **web browser** (Chrome, Firefox, Edge)
- Not Notepad or text editor
- Double-click the `.html` file

### Missing Previous/Next Buttons
- This is expected for Day 1 (no previous) and Day 31 (no next)
- Buttons will be disabled (grayed out) for boundary days

---

## 📝 Next Steps

1. ✅ Run GEE script
2. ✅ Export data
3. ✅ Generate HTML files
4. ✅ View in browser
5. 📍 Optional: Add Leaflet maps to daily files
6. 📍 Optional: Deploy to GitHub Pages

---

## 🤝 Support

- 📖 Full README: [README.md](README.md)
- 🔗 GitHub: [prametkae-blip/GEE_ET](https://github.com/prametkae-blip/GEE_ET)
- 🌍 GEE Docs: [earthengine.google.com](https://earthengine.google.com)
