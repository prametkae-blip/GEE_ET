# 🚀 GEE_ET QUICKSTART — ทำให้เสร็จใน 30 นาที

Complete step-by-step guide from zero to interactive maps.

---

## ⏱️ Timeline
- **Step 1** (5 min): Run GEE script
- **Step 2** (20 min): Wait for export
- **Step 3** (2 min): Copy URLs
- **Step 4** (1 min): Paste into HTML
- **Step 5** (2 min): View maps

**Total: ~30 minutes**

---

## 🎯 STEP 1: Run GEE Script (5 min)

### 1.1 Open Google Earth Engine
Go to: **[code.earthengine.google.com](https://code.earthengine.google.com)**

You should see a code editor (left side) and map (right side).

### 1.2 Create New Script
Click **+ New Script** (top left)

Give it a name:
```
Thailand_Daily_ET_GPP_WUE_2026
```

### 1.3 Copy Script Code
Go to your local folder:
```
C:\Users\prame\GEE_ET\gee_daily_et_gpp_wue_2026.js
```

Copy **ALL** the code (Ctrl+A, Ctrl+C).

### 1.4 Paste into GEE
In the Code Editor, select all (Ctrl+A) and paste (Ctrl+V).

You should see the script load with syntax highlighting.

### 1.5 Click RUN
Click the big **RUN** button (middle-top of editor).

**Wait ~2-5 minutes...** (GEE is processing training data)

You'll see a message at the bottom: `Task started...`

---

## 📊 STEP 2: Check Console Output (5 min wait)

### 2.1 Open Console
Look at the right side of the screen. Click the **Console** tab.

You should see messages like:
```
ERA5 training days: 31
ERA5 prediction days: 31
MODIS ET composites: 4
MODIS GPP composites: 4
ET training samples: 85
GPP training samples: 91
ET coefficients: Array
GPP coefficients: Array
Daily predictions: 31
ET URL: https://ee-results.earthengine.app/map/XXXXX/tiles/{z}/{x}/{y}
GPP URL: https://ee-results.earthengine.app/map/YYYYY/tiles/{z}/{x}/{y}
WUE URL: https://ee-results.earthengine.app/map/ZZZZZ/tiles/{z}/{x}/{y}
Export queued!
```

✅ If you see these → SUCCESS!

### 2.2 Also Check Tasks Tab
Click the **Tasks** tab (right side, next to Console).

You should see:
```
Thailand_ET_GPP_WUE_1km_2026_January  [RUN]  [CANCEL]
```

Click **RUN** to export to Google Drive (takes 10-30 min).

---

## 🔗 STEP 3: Copy Tile URLs (1 min)

### 3.1 Find the 3 URLs in Console
In the **Console** tab, look for:
```
ET URL: https://ee-results.earthengine.app/map/XXXXX/tiles/{z}/{x}/{y}
GPP URL: https://ee-results.earthengine.app/map/YYYYY/tiles/{z}/{x}/{y}
WUE URL: https://ee-results.earthengine.app/map/ZZZZZ/tiles/{z}/{x}/{y}
```

### 3.2 Copy Each URL
- Click in the console
- Select and copy the **ET URL** (the part after the colon)
- Paste it somewhere safe (Notepad)
- Repeat for **GPP URL** and **WUE URL**

**You should have 3 URLs like:**
```
https://ee-results.earthengine.app/map/abc123def456ghi/tiles/{z}/{x}/{y}
https://ee-results.earthengine.app/map/xyz789uvw012rst/tiles/{z}/{x}/{y}
https://ee-results.earthengine.app/map/mno345pqr678stu/tiles/{z}/{x}/{y}
```

---

## 📝 STEP 4: Paste into HTML Files (2 min)

### 4.1 Open ET.html
```
C:\Users\prame\GEE_ET\ET.html
```

Open with **Notepad** or text editor.

### 4.2 Find Line ~287
Look for:
```javascript
const ET_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_ET_URL/tiles/{z}/{x}/{y}';
```

### 4.3 Replace PLACEHOLDER_ET_URL
Replace the word `PLACEHOLDER_ET_URL` with the actual URL ID.

**Before:**
```javascript
const ET_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_ET_URL/tiles/{z}/{x}/{y}';
```

**After:**
```javascript
const ET_TILE_URL = 'https://ee-results.earthengine.app/map/abc123def456ghi/tiles/{z}/{x}/{y}';
```

### 4.4 Save ET.html
Press **Ctrl+S** to save.

### 4.5 Repeat for GPP.html
```
C:\Users\prame\GEE_ET\GPP.html
```

Find line ~87:
```javascript
const GPP_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_GPP_URL/tiles/{z}/{x}/{y}';
```

Replace `PLACEHOLDER_GPP_URL` with your GPP URL ID.

Save.

### 4.6 Repeat for WUE.html
```
C:\Users\prame\GEE_ET\WUE.html
```

Find line ~87:
```javascript
const WUE_TILE_URL = 'https://ee-results.earthengine.app/map/PLACEHOLDER_WUE_URL/tiles/{z}/{x}/{y}';
```

Replace `PLACEHOLDER_WUE_URL` with your WUE URL ID.

Save.

---

## 🗺️ STEP 5: View Interactive Maps (2 min)

### 5.1 Open ET.html
**Double-click:**
```
C:\Users\prame\GEE_ET\ET.html
```

It opens in your browser. You should see:
- ✅ Google Satellite basemap
- ✅ Blue ET overlay (Evapotranspiration)
- ✅ Thailand boundary outline
- ✅ Opacity slider
- ✅ Layer toggle

### 5.2 Navigate the Map
- **Zoom**: Scroll or +/- buttons
- **Pan**: Click and drag
- **Adjust opacity**: Slider on right sidebar
- **Toggle layers**: Top-right controls

### 5.3 View Other Maps
In the sidebar, click quick links:
- 💧 **ET Map** (Evapotranspiration)
- 🌱 **GPP Map** (Productivity)
- 💧 **WUE Map** (Water Use Efficiency)

---

## 📈 BONUS: View Timeseries Charts

### 5.4 Open Chart Dashboard
**Double-click:**
```
C:\Users\prame\GEE_ET\timeseries_chart.html
```

You see:
- 📊 3 separate line graphs (31 days each)
- 📈 Combined normalized view
- 📋 Min/Max/Mean/Std statistics
- 📁 CSV upload button (to view your data)

---

## ✅ Checklist

- [ ] Go to code.earthengine.google.com
- [ ] Create new script
- [ ] Copy gee_daily_et_gpp_wue_2026.js
- [ ] Paste into GEE editor
- [ ] Click RUN (wait 2-5 min)
- [ ] Check Console for 3 URLs
- [ ] Copy 3 URLs (ET, GPP, WUE)
- [ ] Paste ET URL into ET.html (line ~287)
- [ ] Paste GPP URL into GPP.html (line ~87)
- [ ] Paste WUE URL into WUE.html (line ~87)
- [ ] Save all 3 HTML files
- [ ] Double-click ET.html → View map
- [ ] Double-click timeseries_chart.html → View charts
- [ ] Test date navigation buttons
- [ ] Test opacity slider

---

## 🔧 Troubleshooting

### Maps Don't Load?
**Check:**
1. Did you replace `PLACEHOLDER_ET_URL` with actual URL ID?
2. Did you save the HTML files?
3. Open in Chrome/Firefox (not Edge or Safari sometimes)

### Can't Find URLs in Console?
**Check:**
1. Did the script finish running? (look for "Export queued!")
2. Is the Console tab open? (bottom right of GEE)
3. Scroll down in Console to find the URL lines

### GEE Script Takes Too Long?
**Normal!** Training on MODIS + ERA5 takes time.
- Small regions: ~2 min
- Thailand: ~5 min
- Africa: ~15+ min

### Export to Drive Takes Too Long?
**Normal!** Image export takes time:
- Small: ~5 min
- Medium: ~20 min
- Large: ~1 hour

Check **Tasks** tab for progress bar.

---

## 🎯 Expected Output

### When Everything Works:

**GEE Console shows:**
```
✅ Daily predictions: 31
✅ Export queued!
```

**Browser shows (ET.html):**
```
✅ Google Satellite basemap loaded
✅ Blue ET layer visible
✅ Thailand outlined
✅ Opacity slider works
✅ Sidebar shows stats
```

**Charts show (timeseries_chart.html):**
```
✅ 3 line graphs with 31 data points
✅ Min/Max/Mean values displayed
✅ All 3 metrics normalized in combined view
```

---

## 📞 Need Help?

Check these files in order:
1. **QUICKSTART.md** (this file) — Step-by-step
2. **WORKFLOW.md** — Detailed workflow
3. **README.md** — Full documentation
4. **GitHub Issues** — Common problems

**GitHub:** https://github.com/prametkae-blip/GEE_ET

---

## 🎉 Next Steps (After Maps Work)

- ✅ Generate 31 daily HTML files (python generate_daily_html.py)
- ✅ Deploy to GitHub Pages
- ✅ Share with colleagues
- ✅ Update with new month's data

**But first:** Get the basic 3 maps (ET, GPP, WUE) working!

---

## 💡 Pro Tips

1. **Save URLs in a text file** — You'll need them again if tiles expire
2. **Test map on mobile** — Scroll works differently
3. **Export CSV from GEE** — For timeseries_chart.html updates
4. **Bookmark the maps** — Share with team

---

ทำได้เลย! 🔥 Follow these 5 steps and you'll have working maps in 30 minutes!
