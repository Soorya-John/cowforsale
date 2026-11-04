"""Create small web copies. Source screenshots remain untouched."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'photos'
OUT.mkdir(parents=True, exist_ok=True)
PHOTOS = {
    'Screenshot 2026-11-04 232346.png': ('Camera Pashu.webp', False),
    'Screenshot 2026-11-04 232415.png': ('Blue shirt Pashu.webp', False),
    'Screenshot 2026-11-04 232448.png': ('Close up Pashu.webp', False),
    'Screenshot 2026-11-04 232459.png': ('Together portrait.webp', True),
    'Screenshot 2026-11-04 232526.png': ('Together smiling.webp', False),
}
for original, (name, rotate) in PHOTOS.items():
    with Image.open(ROOT / original) as source:
        image = ImageOps.exif_transpose(source).convert('RGB')
        if rotate:
            image = image.rotate(90, expand=True)
        image.thumbnail((1400, 1400))
        image.save(OUT / name, 'WEBP', quality=86, method=6)
        print(f'{name}: {(OUT / name).stat().st_size:,} bytes')
