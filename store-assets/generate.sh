#!/bin/bash
# Regenerates all store/GitHub imagery with headless Chrome.
# Run from anywhere: ./store-assets/generate.sh
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/store-assets"

shot() { # url, outfile, WxH, background (RRGGBBAA)
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --default-background-color="$4" \
    --window-size="$3" --screenshot="$2" "$1" 2>/dev/null
}

# ── Panel screenshot (1280×800) ──────────────────────────────────────────────
# demo.html = real panel.html with a chrome-API stub + demo data injected.
sed 's|<script src="panel.js"></script>|<script src="store-assets/demo-data.js"></script><script src="panel.js"></script>|' \
  "$ROOT/panel.html" > "$ROOT/demo.html"
shot "file://$ROOT/demo.html" "$OUT/screenshot-1280x800.png" "1280,800" "1e1e1eff"
rm "$ROOT/demo.html"

# ── Promo tiles ──────────────────────────────────────────────────────────────
shot "file://$OUT/tile-small.html"   "$OUT/promo-small-440x280.png"    "440,280"  "16222eff"
shot "file://$OUT/tile-marquee.html" "$OUT/promo-marquee-1400x560.png" "1400,560" "16222eff"

# ── Icons (transparent background, rounded corners) ──────────────────────────
for size in 16 48 128; do
  shot "file://$OUT/icon.html?size=$size" "$ROOT/icons/icon$size.png" "$size,$size" "00000000"
done

# Re-encode icons with Pillow: headless Chrome writes multi-IDAT PNGs, which
# the Chrome Web Store's image processor rejects. Pillow writes a single IDAT.
python3 - "$ROOT/icons" <<'PY'
import sys
from PIL import Image
for n in (16, 48, 128):
    path = f"{sys.argv[1]}/icon{n}.png"
    Image.open(path).convert("RGBA").save(path, "PNG", optimize=True)
PY

# ── JPEG versions for the Web Store (requires no-alpha; JPEG is always safe) ─
for f in screenshot-1280x800 promo-small-440x280 promo-marquee-1400x560; do
  sips -s format jpeg -s formatOptions best "$OUT/$f.png" --out "$OUT/$f.jpg" >/dev/null
done

echo "Generated:"
ls -la "$OUT"/*.png "$OUT"/*.jpg "$ROOT"/icons/*.png
