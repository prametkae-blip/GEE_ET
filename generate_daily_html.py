#!/usr/bin/env python3
"""
Generate 31 daily HTML files from GEE CSV export
Usage: python generate_daily_html.py input_data.csv
"""

import csv
import os
from datetime import datetime, timedelta

def read_csv_data(csv_file):
    """Read daily ET, GPP, WUE values from CSV"""
    data = {}
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                date = row.get('date', row.get('Date', row.get('system:time_start', '')))
                et = float(row.get('ET_daily_mm', row.get('ET', 0)))
                gpp = float(row.get('GPP_daily_gC_m2', row.get('GPP', 0)))

                # Calculate WUE
                wue = (gpp / et) if et > 0.05 else 0

                data[date] = {'et': round(et, 2), 'gpp': round(gpp, 2), 'wue': round(wue, 2)}
        return data
    except FileNotFoundError:
        print(f"❌ File not found: {csv_file}")
        return {}

def generate_html_template(date_str, et, gpp, wue):
    """Generate HTML for a single day"""
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    date_display = date_obj.strftime('%B %d, %Y')
    day_of_month = date_obj.day

    prev_date = (date_obj - timedelta(days=1)).strftime('%Y-%m-%d')
    next_date = (date_obj + timedelta(days=1)).strftime('%Y-%m-%d')

    prev_disabled = 'disabled' if day_of_month == 1 else ''
    next_disabled = 'disabled' if day_of_month == 31 else ''

    prev_link = f"day_{prev_date.replace('-', '_')}.html" if day_of_month > 1 else '#'
    next_link = f"day_{next_date.replace('-', '_')}.html" if day_of_month < 31 else '#'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily ET, GPP, WUE - {date_display}</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
    }}
    .header {{
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      text-align: center;
    }}
    .header h1 {{
      color: #333;
      font-size: 32px;
      margin-bottom: 10px;
    }}
    .header p {{
      color: #666;
      font-size: 16px;
    }}
    .date-display {{
      font-size: 20px;
      font-weight: bold;
      color: #667eea;
      margin-top: 15px;
    }}
    .cards {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }}
    .card {{
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }}
    .card:hover {{
      transform: translateY(-10px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }}
    .card h2 {{
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }}
    .card .icon {{
      font-size: 48px;
      margin-bottom: 15px;
    }}
    .card .value {{
      font-size: 40px;
      font-weight: bold;
      margin: 20px 0;
      color: #667eea;
    }}
    .card .unit {{
      font-size: 14px;
      color: #999;
      margin-bottom: 15px;
    }}
    .card .description {{
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }}
    .et-card {{ border-top: 4px solid #0570b0; }}
    .gpp-card {{ border-top: 4px solid #238443; }}
    .wue-card {{ border-top: 4px solid #8c510a; }}
    .footer {{
      background: white;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }}
    .footer a {{
      color: #667eea;
      text-decoration: none;
    }}
    .footer a:hover {{
      text-decoration: underline;
    }}
    .navigation {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }}
    .nav-btn {{
      background: white;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      color: #667eea;
      transition: all 0.3s;
    }}
    .nav-btn:hover:not(:disabled) {{
      background: #667eea;
      color: white;
    }}
    .nav-btn:disabled {{
      opacity: 0.5;
      cursor: not-allowed;
    }}
    @media (max-width: 768px) {{
      .cards {{ grid-template-columns: 1fr; }}
      .header h1 {{ font-size: 24px; }}
      .card .value {{ font-size: 32px; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="navigation">
      <a href="{prev_link}" class="nav-btn" {prev_disabled}>← Previous</a>
      <div style="text-align: center; font-weight: bold; color: white;">{date_str}</div>
      <a href="{next_link}" class="nav-btn" {next_disabled}>Next →</a>
    </div>

    <div class="header">
      <h1>🌏 Daily ET, GPP & WUE</h1>
      <p>Thailand • 2026 • Google Earth Engine MLR Predictions</p>
      <div class="date-display">{date_display}</div>
    </div>

    <div class="cards">
      <div class="card et-card">
        <div class="icon">💧</div>
        <h2>Evapotranspiration</h2>
        <div class="value">{et}</div>
        <div class="unit">mm/day</div>
        <div class="description">Water evaporated from soil & plants</div>
      </div>

      <div class="card gpp-card">
        <div class="icon">🌱</div>
        <h2>Gross Primary Productivity</h2>
        <div class="value">{gpp}</div>
        <div class="unit">g C/m²/day</div>
        <div class="description">Carbon fixed by photosynthesis</div>
      </div>

      <div class="card wue-card">
        <div class="icon">💧🌱</div>
        <h2>Water Use Efficiency</h2>
        <div class="value">{wue}</div>
        <div class="unit">g C/kg H₂O</div>
        <div class="description">Productivity per water used</div>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>GEE_ET</strong> • MLR trained on MODIS Jan 2025 • ERA5-Land predictors<br>
        <a href="https://github.com/prametkae-blip/GEE_ET" target="_blank">View on GitHub</a> |
        <a href="./index.html">Back to January Overview</a>
      </p>
    </div>
  </div>
</body>
</html>
"""
    return html

def main():
    import sys

    if len(sys.argv) < 2:
        print("Usage: python generate_daily_html.py <csv_file>")
        print("\nExample:")
        print("  python generate_daily_html.py daily_data.csv")
        print("\nCSV should have columns: date, ET_daily_mm, GPP_daily_gC_m2")
        sys.exit(1)

    csv_file = sys.argv[1]
    data = read_csv_data(csv_file)

    if not data:
        print("No data read from CSV. Exiting.")
        sys.exit(1)

    # Generate HTML files
    count = 0
    for date_str in sorted(data.keys()):
        values = data[date_str]
        html_content = generate_html_template(
            date_str,
            values['et'],
            values['gpp'],
            values['wue']
        )

        filename = f"day_{date_str.replace('-', '_')}.html"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ {filename}")
        count += 1

    print(f"\n✅ Generated {count} daily HTML files!")
    print(f"📍 Files saved as: day_2026_01_01.html, day_2026_01_02.html, etc.")

if __name__ == '__main__':
    main()
