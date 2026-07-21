# 드림시뮬레이션 — 작업 규칙

> 2026-07-15 "버튼이 안 눌려요" 8라운드 삽질에서 나온 규칙. 반드시 지킬 것. 배경: [POSTMORTEM.md](POSTMORTEM.md)

## 1. 검증 규칙 (가장 중요 — 여기서 다 터졌다)
- **눈에 보이는 결과로 검증한다. 내부 플래그로 검증하지 않는다.**
  - 화면 전환 확인: `el.hidden`(❌) 대신 **`getComputedStyle(el).display !== 'none'`** 또는 `getBoundingClientRect()`, 보이는 텍스트로 확인(✅).
  - "상태 변수가 바뀌었다"는 "화면이 바뀌었다"가 아니다.
- **사용자가 "안 된다"는데 내 테스트가 통과하면 → 내 검증 방법을 먼저 의심한다.** 절대 "캐시/환경 탓"으로 먼저 돌리지 않는다. 환경 탓은 **증거가 있을 때만**.
- 증상 전부를 설명하는 **가장 단순한 가설**부터. (예: "클릭해도 안 넘어감 + JS 에러 없음 + 해시는 바뀜" = 클릭 문제 아님, **렌더/CSS 문제**.)
- 이 환경에서는 **스크린샷 타임아웃 + 클릭 도구가 이벤트 0개 전달**(진짜 클릭 불가). 시각 확인이 필요하면 일찍 인정하고 사용자에게 콘솔 한 줄(예: `getComputedStyle(document.querySelector('.screen:not([hidden])')).display`)로 확인 요청.

## 2. CSS 함정
- `[hidden]{display:none}`은 우선순위가 낮아서 `.foo{display:flex/grid/block}`에 **덮인다.** 화면/모달을 `hidden`으로 감출 때는 반드시 `.screen[hidden]{display:none!important}` 같은 방어 규칙을 둔다.

## 3. 실행 & 빌드 (이 프로젝트 전용)
- **서버:** 캐시 금지 + 멀티스레드 파이썬 서버. 파일: `<scratchpad>/nocache_server.py` (ThreadingHTTPServer, `Cache-Control: no-store`, 포트 8777).
  - 실행은 **PowerShell `Start-Process python <script> -WindowStyle Hidden`** 로 detached. (bash `&`/`run_in_background`는 이 환경에서 죽거나 python을 못 찾음 → exit 127.)
  - python 경로: `C:\Users\kimwo\AppData\Local\Programs\Python\Python312\python.exe`
- **단일 파일 빌드:** `<scratchpad>/build.py` 가 `index.html`의 css/js 링크를 인라인해서 **`dream.html`** 생성. 소스 편집(index/css/js) 후 이 빌드를 다시 돌린다.
- **사용자가 여는 주소:** `http://localhost:8777/dream.html` (단일 파일 = 버전 엇갈림 없음, 새 파일명 = 옛날 탭 없음).

## 4. 반복 비용 줄이기
- 매번 파일명을 그대로 두면 브라우저 캐시가 계속 발목 잡는다. 소스는 나눠 작업하되 **테스트/전달은 no-cache 서버 + dream.html 단일 파일**로.
- 코드 고친 뒤: ① 소스 편집 → ② build.py 재실행 → ③ 미리보기에서 **computed display / 보이는 텍스트**로 검증 → ④ 사용자에게 dream.html 안내.

## 5. 프로젝트 개요
몽환 3D 톤의 웹 게임. 페이지 흐름: 언어(ko/en/fr) → 성별 → 나이 → 미래 인트로 → 드림카(10) → 도시(10) → 여행(10) → 계산(총액 + 투자 슬라이더로 도달 시간 시각화). 상세: 메모리 `dream-simulation-vision`, `dream-simulation-buildlog`.
- 미완: 실제 3D 렌더 이미지(Higgsfield 크레딧 필요, 현재 무료·0크레딧이라 CSS 3D로 대체).
