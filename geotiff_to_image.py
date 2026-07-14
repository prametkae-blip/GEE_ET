#!/usr/bin/env python3
"""
Convert GeoTIFF exports from GEE to visualizations (PNG/JPG)
Usage: python geotiff_to_image.py <geotiff_file>
"""

import sys
import numpy as np
from PIL import Image
import os

def normalize_band(band, vmin=None, vmax=None):
    """Normalize band to 0-255 for visualization"""
    if vmin is None:
        vmin = np.nanmin(band)
    if vmax is None:
        vmax = np.nanmax(band)

    normalized = ((band - vmin) / (vmax - vmin) * 255).astype(np.uint8)
    normalized = np.nan_to_num(normalized, nan=0)
    return normalized

def apply_colormap(band, colormap='viridis'):
    """Apply colormap to single-band raster"""
    from matplotlib import cm
    cmap = cm.get_cmap(colormap)

    # Normalize to 0-1
    band_norm = (band - np.nanmin(band)) / (np.nanmax(band) - np.nanmin(band))
    band_norm = np.nan_to_num(band_norm, nan=0)

    # Apply colormap
    colored = cmap(band_norm)
    # Convert to RGB (drop alpha)
    rgb = (colored[:,:,:3] * 255).astype(np.uint8)
    return rgb

def create_et_visualization(tiff_file, output_file):
    """Create ET visualization from GeoTIFF"""
    try:
        import rasterio
    except ImportError:
        print("Installing rasterio...")
        os.system("pip install rasterio")
        import rasterio

    with rasterio.open(tiff_file) as src:
        et_data = src.read(1)  # First band = ET

    # ET colormap: blue (wet) to red (dry)
    et_rgb = apply_colormap(et_data, colormap='RdYlBu_r')
    img = Image.fromarray(et_rgb)
    img.save(output_file)
    print(f"✅ Saved ET visualization: {output_file}")

def create_gpp_visualization(tiff_file, output_file):
    """Create GPP visualization from GeoTIFF"""
    try:
        import rasterio
    except ImportError:
        os.system("pip install rasterio")
        import rasterio

    with rasterio.open(tiff_file) as src:
        if src.count >= 2:
            gpp_data = src.read(2)  # Second band = GPP
        else:
            gpp_data = src.read(1)

    # GPP colormap: green (productive)
    gpp_rgb = apply_colormap(gpp_data, colormap='Greens')
    img = Image.fromarray(gpp_rgb)
    img.save(output_file)
    print(f"✅ Saved GPP visualization: {output_file}")

def create_rgb_composite(tiff_file, output_file):
    """Create RGB composite from ET+GPP bands"""
    try:
        import rasterio
    except ImportError:
        os.system("pip install rasterio")
        import rasterio

    with rasterio.open(tiff_file) as src:
        if src.count >= 2:
            et = src.read(1)
            gpp = src.read(2)

            # Create RGB: R=ET, G=GPP, B=WUE
            r = normalize_band(et)
            g = normalize_band(gpp)
            b = normalize_band(gpp / (et + 0.1))  # WUE

            rgb = np.stack([r, g, b], axis=-1)
            img = Image.fromarray(rgb)
            img.save(output_file)
            print(f"✅ Saved RGB composite: {output_file}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python geotiff_to_image.py <tiff_file> [output_dir]")
        print("\nExample:")
        print("  python geotiff_to_image.py Thailand_ET_GPP_Latest_Month.tif")
        print("\nOutput:")
        print("  - ET_visualization.png")
        print("  - GPP_visualization.png")
        print("  - RGB_composite.png")
        sys.exit(1)

    tiff_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "."

    if not os.path.exists(tiff_file):
        print(f"❌ File not found: {tiff_file}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    # Generate visualizations
    et_output = os.path.join(output_dir, "ET_visualization.png")
    gpp_output = os.path.join(output_dir, "GPP_visualization.png")
    rgb_output = os.path.join(output_dir, "RGB_composite.png")

    print(f"Processing: {tiff_file}")
    print("=" * 50)

    create_et_visualization(tiff_file, et_output)
    create_gpp_visualization(tiff_file, gpp_output)
    create_rgb_composite(tiff_file, rgb_output)

    print("=" * 50)
    print("\n✅ All visualizations created!")
    print(f"\nFiles saved to: {output_dir}/")

if __name__ == '__main__':
    main()
