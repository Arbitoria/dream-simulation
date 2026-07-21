# -*- coding: utf-8 -*-
"""
ARBITORIA harness — 최신 라이브 배포(arbitoria.com)와 소스를 한 번에 점검한다.

무엇을 검사하나
  [LIVE]  게임 · Dream Index · Family Office · Privacy 4개 페이지가 살아있고 핵심 요소를 담고 있는지
  [API]   /api/fx (환율 sane) · /api/insights (집계 형태) · /api/stats
  [I18N]  ko/en/fr 사전 키 동등성 + en/fr 사전 안 한국어 잔재
  [EU]    벨기에·EU 기준 컴플라이언스: 쿠키 안내, 개인정보 정책(벨기에·GDPR 명시),
          추적 스크립트 부재, 수집 필드에 PII 없음

사용법
  python harness/check.py            # 전체 (라이브 + 소스)
  python harness/check.py --local    # 소스만 (오프라인)

기준 (References)
  - EU GDPR (2016/679) — 익명정보는 전문 26조에 따라 적용 제외
  - ePrivacy Directive 2002/58/EC Art. 5(3) — 기능성 저장소는 동의 예외
  - 운영 주체: ARBITORIA, 벨기에(EU) 본거지 → 감독기관 APD/GBA
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://arbitoria.com'
LOCAL_ONLY = '--local' in sys.argv

PASS, FAIL, WARN = '✅', '❌', '⚠️'
results = []


def check(section, name, ok, detail=''):
    mark = PASS if ok else FAIL
    results.append(ok)
    print(f'  {mark} [{section}] {name}' + (f' — {detail}' if detail else ''))
    return ok


def fetch(path, timeout=20):
    req = urllib.request.Request(BASE + path, headers={'User-Agent': 'arbitoria-harness/1.0'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read().decode('utf-8', errors='replace')


KO = re.compile(r'[가-힣]')
TRACKERS = ['googletagmanager', 'google-analytics', 'gtag(', 'fbq(', 'hotjar', 'mixpanel', 'amplitude', 'segment.com', 'doubleclick']


def dict_block(text, pattern):
    m = re.search(pattern, text, re.S | re.M)
    return m.group(1) if m else ''


def keys_of(block):
    return set(re.findall(r"'([a-zA-Z0-9_.]+)':", block))


def korean_values(block):
    """사전 값 문자열 안의 한글만 잡는다 (주석/코드 제외를 위해 값 패턴으로 제한)"""
    hits = []
    for m in re.finditer(r"'[a-zA-Z0-9_.]+':\s*'((?:[^'\\]|\\.)*)'", block):
        if KO.search(m.group(1)):
            hits.append(m.group(1)[:60])
    return hits


def main():
    print('═══ ARBITORIA harness ═══')
    print(f'target: {BASE} (live)' + (' — SKIPPED (--local)' if LOCAL_ONLY else '') + '\n')

    # ── [I18N] 소스 검사 ──
    print('— i18n (source) —')
    js = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')
    ko_b = dict_block(js, r'^\s*ko: \{(.*?)^\s*\},')
    en_b = dict_block(js, r'^\s*en: \{(.*?)^\s*\},')
    fr_b = dict_block(js, r'^\s*fr: \{(.*?)^\s*\},')
    k, e, f = keys_of(ko_b), keys_of(en_b), keys_of(fr_b)
    check('I18N', 'game: ko/en/fr 키 동등', k == e == f and len(k) > 100, f'{len(k)}/{len(e)}/{len(f)} keys')
    check('I18N', 'game: EN 사전에 한국어 잔재 없음', not korean_values(en_b), '; '.join(korean_values(en_b)))
    check('I18N', 'game: FR 사전에 한국어 잔재 없음', not korean_values(fr_b), '; '.join(korean_values(fr_b)))

    for page, en_pat, fr_pat in [
        ('insights', r'^\s*en: \{(.*?)^\s*\},', r'^\s*fr: \{(.*?)^\s*\},'),
        ('family-office', r'^const EN = \{(.*?)^\};', r'^const FR = \{(.*?)^\};'),
    ]:
        html = (ROOT / 'worker' / 'public' / f'{page}.html').read_text(encoding='utf-8')
        en_hits = korean_values(dict_block(html, en_pat))
        fr_hits = korean_values(dict_block(html, fr_pat))
        check('I18N', f'{page}: EN 잔재 없음', not en_hits, '; '.join(en_hits))
        check('I18N', f'{page}: FR 잔재 없음', not fr_hits, '; '.join(fr_hits))

    # ── [EU] 소스 컴플라이언스 ──
    print('\n— EU compliance (source) —')
    priv = (ROOT / 'worker' / 'public' / 'privacy.html').read_text(encoding='utf-8')
    check('EU', 'privacy 페이지 존재 + 벨기에 명시', '벨기에' in priv and 'Belgium' in priv and 'Belgique' in priv)
    check('EU', 'privacy에 GDPR·ePrivacy 근거 명시', 'GDPR' in priv and 'ePrivacy' in priv)
    check('EU', 'privacy에 감독기관(APD/GBA) 안내', 'APD/GBA' in priv)
    idx = (ROOT / 'index.html').read_text(encoding='utf-8')
    check('EU', 'game에 쿠키 안내 배너', 'cookieBar' in idx)
    for page in ['insights.html', 'family-office.html']:
        html = (ROOT / 'worker' / 'public' / page).read_text(encoding='utf-8')
        check('EU', f'{page}에 쿠키 안내 배너', 'cookieBar' in html)
    all_html = idx + priv + js
    for page in ['insights.html', 'family-office.html']:
        all_html += (ROOT / 'worker' / 'public' / page).read_text(encoding='utf-8')
    bad = [t for t in TRACKERS if t in all_html]
    check('EU', '추적 스크립트 없음 (GA·Meta·Hotjar 등)', not bad, ', '.join(bad))
    worker = (ROOT / 'worker' / 'src' / 'index.js').read_text(encoding='utf-8')
    pii = [w for w in ['email', 'phone', 'CF-Connecting-IP', 'ip_address', 'name TEXT'] if w in worker]
    check('EU', '수집 API에 PII 필드 없음', not pii, ', '.join(pii))

    # ── [LIVE] 배포 점검 ──
    if not LOCAL_ONLY:
        print('\n— live (latest deploy) —')
        try:
            s, body = fetch('/')
            check('LIVE', 'game 200 + 쿠키 배너 + privacy 문구', s == 200 and 'cookieBar' in body and 'cover.privacy' in body)
            s, body = fetch('/insights')
            check('LIVE', 'insights 200 + 언어 드롭다운', s == 200 and 'langSel' in body)
            s, body = fetch('/family-office')
            check('LIVE', 'family-office 200 + 언어 드롭다운', s == 200 and 'langSel' in body)
            s, body = fetch('/privacy')
            check('LIVE', 'privacy 200 + Belgium', s == 200 and 'Belgium' in body)
            s, body = fetch('/api/fx')
            fx = json.loads(body)
            check('API', 'fx 환율 sane (800<₩/$<3000)', 800 < fx.get('usd_krw', 0) < 3000 and 800 < fx.get('eur_krw', 0) < 3500, body[:80])
            s, body = fetch('/api/insights')
            ins = json.loads(body)
            check('API', 'insights 집계 형태 (개인 데이터 미반환)', 'summary' in ins and 'cities' in ins and '"id":' not in json.dumps(ins))
            s, body = fetch('/api/stats')
            st = json.loads(body)
            check('API', f'stats total={st.get("total")}', isinstance(st.get('total'), int))
        except Exception as ex:
            check('LIVE', '네트워크 접근', False, str(ex)[:100])

    ok = sum(results)
    print(f'\n═══ {ok}/{len(results)} passed ═══')
    sys.exit(0 if ok == len(results) else 1)


if __name__ == '__main__':
    main()
