# -*- coding: utf-8 -*-
"""countries.geo.json → 경량 세계지도 SVG 패스 (남극 제외, 1000×460 등장방형)

출력
  worldpath.txt     — 전 세계 배경 실루엣 (한 개의 패스 문자열)
  worldnations.txt  — 선택 가능한 14개국 개별 패스 (JS 객체 리터럴)

app.js의 WORLD_LAND / WORLD_NATIONS 상수에 주입해서 쓴다.
데이터: https://github.com/johan/world.geo.json (Natural Earth 계열, 퍼블릭 도메인)
"""
import json
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE / 'world.geo.json'
SRC_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
W, H = 1000.0, 460.0
TOP_LAT, BOT_LAT = 85.0, -60.0

# 게임에서 선택 가능한 나라 (ISO3 → 게임 id)
TARGETS = {'KOR': 'kr', 'JPN': 'jp', 'VNM': 'vn', 'THA': 'th', 'SGP': 'sg', 'AUS': 'au',
           'USA': 'us', 'CAN': 'ca', 'BRA': 'br', 'GBR': 'uk', 'FRA': 'fr', 'ESP': 'es',
           'DEU': 'de', 'CHE': 'ch'}

def proj(lon, lat):
    return (lon + 180.0) / 360.0 * W, (TOP_LAT - lat) / (TOP_LAT - BOT_LAT) * H

def ring_path(ring, step):
    pts = [proj(lon, lat) for lon, lat in ring]
    out = [pts[0]]
    for p in pts[1:]:
        if abs(p[0] - out[-1][0]) >= step or abs(p[1] - out[-1][1]) >= step:
            out.append(p)
    if len(out) < 4:
        return None, 0.0, (0, 0)
    xs = [p[0] for p in out]; ys = [p[1] for p in out]
    bbox = (max(xs) - min(xs)) * (max(ys) - min(ys))
    cx = (max(xs) + min(xs)) / 2
    d = 'M' + ' '.join(f'{p[0]:.0f},{p[1]:.0f}' for p in out) + 'Z'
    return d, bbox, (cx, (max(ys) + min(ys)) / 2)

def main():
    if not SRC.exists():
        print('downloading', SRC_URL)
        urllib.request.urlretrieve(SRC_URL, SRC)
    data = json.loads(SRC.read_text(encoding='utf-8'))

    land, nations = [], {}
    for f in data['features']:
        fid = f.get('id')
        if fid == 'ATA':
            continue
        g = f['geometry']
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        # 배경 실루엣 (거친 간략화)
        for poly in polys:
            d, bbox, _ = ring_path(poly[0], 3.2)
            if d and bbox >= 30:
                land.append(d)
        # 선택국 개별 패스 (더 촘촘하게 · 크기 필터 없음)
        if fid in TARGETS:
            parts = []
            for poly in polys:
                d, bbox, (cx, cy) = ring_path(poly[0], 1.6)
                if not d:
                    continue
                if fid == 'FRA' and cx < 440:   # 프랑스령 기아나 제외 — 본토만
                    continue
                if bbox < 2:
                    continue
                parts.append(d)
            if parts:
                nations[TARGETS[fid]] = ''.join(parts)

    (HERE / 'worldpath.txt').write_text(''.join(land), encoding='utf-8')
    nat_js = '{' + ','.join(f"{k}:'{v}'" for k, v in nations.items()) + '}'
    (HERE / 'worldnations.txt').write_text(nat_js, encoding='utf-8')
    print(f'land rings: {len(land)}  chars: {len("".join(land))}')
    print(f'nations: {sorted(nations)}  chars: {len(nat_js)}')

if __name__ == '__main__':
    main()
