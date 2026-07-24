# -*- coding: utf-8 -*-
"""countries.geo.json → 경량 세계지도 SVG 패스 (남극 제외, 1000×460 등장방형)"""
import json, math
from pathlib import Path

SRC = Path(__file__).parent / 'world.geo.json'
W, H = 1000.0, 460.0
TOP_LAT, BOT_LAT = 85.0, -60.0

def proj(lon, lat):
    x = (lon + 180.0) / 360.0 * W
    y = (TOP_LAT - lat) / (TOP_LAT - BOT_LAT) * H
    return x, y

def ring_path(ring):
    pts = [proj(lon, lat) for lon, lat in ring]
    # 촘촘한 링 데시메이션: 1px 미만 이동은 스킵
    out = [pts[0]]
    for p in pts[1:]:
        if abs(p[0] - out[-1][0]) >= 3.2 or abs(p[1] - out[-1][1]) >= 3.2:
            out.append(p)
    if len(out) < 4:
        return None, 0.0
    xs = [p[0] for p in out]; ys = [p[1] for p in out]
    bbox = (max(xs) - min(xs)) * (max(ys) - min(ys))
    d = 'M' + ' '.join(f'{p[0]:.0f},{p[1]:.0f}' for p in out) + 'Z'
    return d, bbox

paths = []
data = json.loads(SRC.read_text(encoding='utf-8'))
for f in data['features']:
    if f.get('id') == 'ATA':   # 남극 제외
        continue
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys:
        d, bbox = ring_path(poly[0])   # 외곽 링만 (구멍 무시 — 실루엣 용도)
        if d and bbox >= 30:           # 너무 작은 섬 제거
            paths.append(d)

full = ''.join(paths)
out = Path(__file__).parent / 'worldpath.txt'
out.write_text(full, encoding='utf-8')
print(f'rings: {len(paths)}  chars: {len(full)}')
