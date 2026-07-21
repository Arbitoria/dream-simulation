# ARBITORIA Harness

**최신 라이브 배포(arbitoria.com)와 소스를 한 번에 점검하는 검증 하네스.**
배포할 때마다, 혹은 문구·법적 요소를 바꿀 때마다 돌린다.

## 실행

```bash
python harness/check.py           # 전체: 소스 + 라이브 최신 배포
python harness/check.py --local   # 소스만 (오프라인)
```

통과하면 exit 0, 하나라도 실패하면 exit 1 (CI에 바로 물릴 수 있음).

## 무엇을 검사하나

| 영역 | 검사 |
|---|---|
| **I18N** | 게임 ko/en/fr 사전 키 3자 동등 · en/fr 사전 값에 한국어 잔재 없음 (게임·Dream Index·Family Office 전부) |
| **EU** | 쿠키 안내 배너(3개 페이지) · `/privacy` 정책의 벨기에·GDPR·ePrivacy·APD/GBA 명시 · 추적 스크립트(GA/Meta/Hotjar 등) 부재 · 수집 API에 PII 필드 부재 |
| **LIVE** | 4개 페이지 200 + 핵심 마커 (항상 **최신 배포본** 기준) |
| **API** | `/api/fx` 환율 sane 범위 · `/api/insights` 집계만 반환(개인 행 미노출) · `/api/stats` |

## 법적 기준 (왜 이 검사들인가)

운영 주체 **ARBITORIA — 벨기에(EU) 본거지** 기준:

- **GDPR (EU 2016/679)** — 우리는 개인 식별 데이터를 저장하지 않으므로, 수집물은
  전문(Recital) 26조의 **익명정보**로 GDPR 적용 범위 밖에 있어야 한다.
  → 하네스가 수집 API에 PII 필드가 섞이지 않는지 감시한다.
- **ePrivacy Directive 2002/58/EC Art. 5(3)** — 기기 저장소는 원칙적으로 동의 필요.
  단 *이용자가 요청한 서비스에 엄격히 필요한* 저장(언어 설정 등)은 예외.
  → 우리는 `dreamLang`, `cookieAck` 두 개만 쓰고, 배너로 고지한다. 추적 쿠키가
  하나라도 생기는 순간 동의 관리(CMP)가 필요해진다 — 하네스가 추적 스크립트를 잡는다.
- **감독기관** — 벨기에 데이터보호청 **APD/GBA**. 정책 페이지에 민원 권리를 명시한다.

## 운영 규칙

1. 배포 후 `python harness/check.py` — 전부 ✅ 인지 확인.
2. 새 페이지를 추가하면: 쿠키 배너 + `/privacy` 링크 + 이 하네스에 LIVE 체크 한 줄 추가.
3. 새 수집 필드를 추가하면: **그 필드가 사람을 특정할 수 있는지** 먼저 묻는다.
   특정할 수 있으면 저장하지 않는 게 원칙 (우리의 상품성 = 익명성).
4. 추적/분석 도구를 붙이고 싶어지면: 이 README의 ePrivacy 항목을 다시 읽고,
   CMP(동의 배너) 없이는 붙이지 않는다.

## 참고 링크

- GDPR 전문: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- ePrivacy Directive: https://eur-lex.europa.eu/eli/dir/2002/58/oj
- 벨기에 APD/GBA: https://www.autoriteprotectiondonnees.be / https://www.gegevensbeschermingsautoriteit.be
- Cloudflare GDPR 리소스: https://www.cloudflare.com/trust-hub/gdpr/
