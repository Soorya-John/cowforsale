"""Simplify an attributed Assam outline into the small corner sticker.

Input: scripts/assam-source.svg, downloaded from the Wikimedia source in
assets/assam.svg's description. No source download is needed for normal builds.
"""
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
points = []
for el in ET.parse(root / 'scripts/assam-source.svg').iter():
    if el.tag.endswith('polyline'):
        segment = [tuple(map(float, p.split(','))) for p in el.get('points').split()]
        points.extend(segment if not points else segment[1:])

def simplify(points, tolerance=4):
    if len(points) < 3:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    dx, dy = bx-ax, by-ay
    length = dx*dx + dy*dy
    def distance(p):
        t = max(0, min(1, ((p[0]-ax)*dx + (p[1]-ay)*dy)/length)) if length else 0
        return (p[0]-ax-t*dx)**2 + (p[1]-ay-t*dy)**2
    i = max(range(1, len(points)-1), key=lambda i: distance(points[i]))
    if distance(points[i]) <= tolerance*tolerance:
        return [points[0], points[-1]]
    return simplify(points[:i+1], tolerance)[:-1] + simplify(points[i:], tolerance)

coords = ' '.join(f'{x:.1f},{y:.1f}' for x, y in simplify(points))
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 1002 753">
<title>Assam</title>
<desc>Adapted from Map of Assam outline by SlowPhoton, Wikimedia Commons, CC BY-SA 3.0. Simplified, recolored and outlined for a birthday sticker. Source: https://commons.wikimedia.org/wiki/File:Map_of_Assam_outline.svg License: https://creativecommons.org/licenses/by-sa/3.0/</desc>
<polygon points="{coords}" fill="#efb9c4" stroke="#315b3c" stroke-width="15" stroke-linejoin="round"/>
</svg>'''
(root / 'assets/assam.svg').write_text(svg, encoding='utf-8')
print(f'Assam sticker: {len(svg):,} bytes')
