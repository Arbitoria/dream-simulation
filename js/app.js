/* ═══════════════════════════════════════════════════════════
   드림시뮬레이션 — ARBITORIA (v9)
   현실(나의 상황) → 진단(돈의 흐름) → 꿈 → 종자돈(4%) → 세대
   재무 엔진: Family office app GAME_HANDOFF.md 에서 이식.
   금액 단위: '만원'. (1억 = 10000)
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── 꿈 데이터 (price = 일시불가, m = 월 유지비) ── */
const CARS = [
  { id: 'porsche', e: '🏎️', price: 22000, m: 250, nm: { ko: '포르쉐 911', en: 'Porsche 911', fr: 'Porsche 911' } },
  { id: 'huracan', e: '🏎️', price: 40000, m: 450, nm: { ko: '람보르기니 우라칸', en: 'Lamborghini Huracán', fr: 'Lamborghini Huracán' } },
  { id: 'ferrari', e: '🏎️', price: 55000, m: 600, nm: { ko: '페라리 SF90', en: 'Ferrari SF90', fr: 'Ferrari SF90' } },
  { id: 'rolls', e: '🚗', price: 65000, m: 700, nm: { ko: '롤스로이스', en: 'Rolls-Royce', fr: 'Rolls-Royce' } },
  { id: 'bentley', e: '🚗', price: 42000, m: 450, nm: { ko: '벤틀리', en: 'Bentley', fr: 'Bentley' } },
  { id: 'mclaren', e: '🏎️', price: 50000, m: 550, nm: { ko: '맥라렌 720S', en: 'McLaren 720S', fr: 'McLaren 720S' } },
  { id: 'aston', e: '🚗', price: 32000, m: 350, nm: { ko: '애스턴마틴', en: 'Aston Martin', fr: 'Aston Martin' } },
  { id: 'gwagon', e: '🚙', price: 25000, m: 280, nm: { ko: '벤츠 G-바겐', en: 'Mercedes G-Wagon', fr: 'Mercedes Classe G' } },
  { id: 'plaid', e: '⚡', price: 15000, m: 180, nm: { ko: '테슬라 플래드', en: 'Tesla Model S Plaid', fr: 'Tesla Model S Plaid' } },
  { id: 'maserati', e: '🏎️', price: 30000, m: 330, nm: { ko: '마세라티 MC20', en: 'Maserati MC20', fr: 'Maserati MC20' } },
];
const HOMES = [
  { id: 'ny', e: '🗽', price: 500000, m: 800, nm: { ko: '뉴욕', en: 'New York', fr: 'New York' } },
  { id: 'paris', e: '🗼', price: 400000, m: 600, nm: { ko: '파리', en: 'Paris', fr: 'Paris' } },
  { id: 'la', e: '🌴', price: 450000, m: 700, nm: { ko: 'LA 비버리힐스', en: 'Beverly Hills', fr: 'Beverly Hills' } },
  { id: 'dubai', e: '🏜️', price: 350000, m: 500, nm: { ko: '두바이', en: 'Dubai', fr: 'Dubaï' } },
  { id: 'bali', e: '🌺', price: 150000, m: 250, nm: { ko: '발리', en: 'Bali', fr: 'Bali' } },
  { id: 'swiss', e: '🏔️', price: 400000, m: 600, nm: { ko: '스위스 알프스', en: 'Swiss Alps', fr: 'Alpes suisses' } },
  { id: 'singapore', e: '🌆', price: 450000, m: 700, nm: { ko: '싱가포르', en: 'Singapore', fr: 'Singapour' } },
  { id: 'london', e: '🎡', price: 550000, m: 800, nm: { ko: '런던', en: 'London', fr: 'Londres' } },
  { id: 'tokyo', e: '🗾', price: 300000, m: 450, nm: { ko: '도쿄', en: 'Tokyo', fr: 'Tokyo' } },
  { id: 'sydney', e: '🌊', price: 300000, m: 450, nm: { ko: '시드니', en: 'Sydney', fr: 'Sydney' } },
];
const TRIPS = [
  { id: 'cruise', e: '🚢', price: 20000, m: 170, nm: { ko: '세계일주 크루즈', en: 'World cruise', fr: 'Croisière mondiale' } },
  { id: 'space', e: '🚀', price: 300000, m: 800, nm: { ko: '우주여행', en: 'Space trip', fr: 'Voyage spatial' } },
  { id: 'safari', e: '🦁', price: 5000, m: 40, nm: { ko: '아프리카 사파리', en: 'African safari', fr: 'Safari africain' } },
  { id: 'antarctica', e: '🐧', price: 10000, m: 80, nm: { ko: '남극 탐험', en: 'Antarctica', fr: 'Antarctique' } },
  { id: 'island', e: '🏝️', price: 30000, m: 250, nm: { ko: '프라이빗 아일랜드', en: 'Private island', fr: 'Île privée' } },
  { id: 'firstclass', e: '✈️', price: 10000, m: 170, nm: { ko: '퍼스트클래스 세계일주', en: 'First-class world tour', fr: 'Tour du monde 1re classe' } },
  { id: 'maldives', e: '🏖️', price: 5000, m: 40, nm: { ko: '몰디브', en: 'Maldives', fr: 'Maldives' } },
  { id: 'aurora', e: '🌌', price: 3000, m: 25, nm: { ko: '오로라 여행', en: 'Northern lights', fr: 'Aurores boréales' } },
  { id: 'everest', e: '🏔️', price: 4000, m: 30, nm: { ko: '에베레스트 트레킹', en: 'Everest trek', fr: 'Trek Everest' } },
  { id: 'yacht', e: '⛵', price: 20000, m: 170, nm: { ko: '지중해 요트', en: 'Mediterranean yacht', fr: 'Yacht méditerranéen' } },
];
const CATS = { car: CARS, home: HOMES, trip: TRIPS };
const opt = (cat, id) => CATS[cat].find((o) => o.id === id) || CATS[cat][0];
const priceOf = (cat, id) => opt(cat, id).price;
const mOf = (cat, id) => opt(cat, id).m;
const emojiOf = (cat, id) => opt(cat, id).e;

const COUNTRIES = ['kr', 'us', 'fr'];
const TAXES = { kr: 0.154, us: 0.15, fr: 0.30 };
const TENURES = ['none', 'rent', 'own'];
const LOAN_RATE = 4, LOAN_YEARS = 25, DOWN_PCT = 0.2, HOME_GROWTH = 2;

/* ── 직업 (sal = 평균 월수입, 만원 · 단순화 가정) ── */
const JOBS = [
  { id: 'doctor', e: '🩺', sal: 3000, nm: { ko: '의사 (전문의)', en: 'Doctor', fr: 'Médecin' } },
  { id: 'banker', e: '📊', sal: 1800, nm: { ko: '금융가', en: 'Investment banker', fr: 'Banquier' } },
  { id: 'lawyer', e: '⚖️', sal: 1500, nm: { ko: '변호사', en: 'Lawyer', fr: 'Avocat' } },
  { id: 'pilot', e: '✈️', sal: 1200, nm: { ko: '파일럿', en: 'Pilot', fr: 'Pilote' } },
  { id: 'founder', e: '🚀', sal: 900, nm: { ko: '창업가', en: 'Founder', fr: 'Fondateur' } },
  { id: 'dev', e: '💻', sal: 700, nm: { ko: '개발자', en: 'Developer', fr: 'Développeur' } },
  { id: 'creator', e: '🎥', sal: 500, nm: { ko: '크리에이터', en: 'Creator', fr: 'Créateur' } },
  { id: 'designer', e: '🎨', sal: 450, nm: { ko: '디자이너', en: 'Designer', fr: 'Designer' } },
  { id: 'teacher', e: '📚', sal: 400, nm: { ko: '교사', en: 'Teacher', fr: 'Enseignant' } },
  { id: 'chef', e: '👨‍🍳', sal: 380, nm: { ko: '셰프', en: 'Chef', fr: 'Chef' } },
];
const jobOf = (id) => JOBS.find((j) => j.id === id) || null;

/* ── 인생 이벤트 (offset년 뒤 · 선택 A/B → 저축 변화 + 행복 변화) ── */
const EVENTS = [
  { id: 'promo', e: '📈', offset: 4,
    a: { save: 0, happy: 1 }, b: { save: 80, happy: 0 } },
  { id: 'baby', e: '👶', offset: 8,
    a: { save: -60, happy: 3 }, b: { save: 0, happy: 1 } },
  { id: 'crash', e: '📉', offset: 12,
    a: { save: 0, happy: 0 }, b: { save: -30, happy: -1 } },
  { id: 'parents', e: '🧓', offset: 16,
    a: { save: -40, happy: 2 }, b: { save: 0, happy: -1 } },
  { id: 'side', e: '🌱', offset: 22,
    a: { save: 50, happy: 1 }, b: { save: 0, happy: 2 } },
];
const HAPPY_BASE = 5;

/* ═══ 재무 엔진 (GAME_HANDOFF §3, §8 — 그대로 이식) ═══ */
function fv(p, pmt, ratePct, months) {
  const r = ratePct / 100 / 12;
  if (r === 0) return p + pmt * months;
  return p * Math.pow(1 + r, months) + pmt * ((Math.pow(1 + r, months) - 1) / r);
}
function mortgage(P, ratePct, years) {
  const r = ratePct / 100 / 12, n = years * 12;
  if (P <= 0 || n <= 0) return 0;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
function splitPayment(P, ratePct, years) {
  const pay = mortgage(P, ratePct, years);
  const interest = P * (ratePct / 100 / 12);
  const principal = Math.max(0, pay - interest);
  return { pay, interest, principal };
}
function buyVsRent(f) {
  const years = Math.max(1, f.loanYears || 25), N = years * 12;
  const ri = (f.rate || 0) / 100 / 12;
  const rg = (f.homeGrowth || 0) / 100;
  const down = f.downPayment || 0, homeValue = f.homeValue || 0;
  const effLoan = Math.max(0, homeValue - down);
  const mort = mortgage(effLoan, f.loanRate || 0, years);
  const estRent = (f.monthlyRent || 0) > 0 ? f.monthlyRent : homeValue * 0.04 / 12;
  const budget = Math.max(mort, estRent);
  let buyInvest = 0, rentInvest = down, rent = estRent;
  for (let m = 1; m <= N; m++) {
    buyInvest = buyInvest * (1 + ri) + (budget - mort);
    rentInvest = rentInvest * (1 + ri) + (budget - rent);
    if (m % 12 === 0) rent *= (1 + rg);
  }
  const homeFuture = homeValue * Math.pow(1 + rg, years);
  return { buyEnd: homeFuture + buyInvest, rentEnd: rentInvest, diff: (homeFuture + buyInvest) - rentInvest };
}

/* ── i18n ── */
const LANGS = ['ko', 'en', 'fr'];
let lang = 'ko';
const L = {
  ko: {
    'cover.title': '미래의 나를<br/>꿈꾸다', 'cover.sub': '지금의 나를 넣고, 꿈을 고르면 — 시간이 그 사이를 잇습니다.', 'cover.start': '시작하기',
    'nav.back': '뒤로', 'nav.next': '다음',
    'gender.h': '당신은 누구인가요?', 'g.female': '여성', 'g.male': '남성', 'g.other': '그 외',
    'age.h': '지금, 몇 살인가요?', 'age.hint': '이른 시작일수록 시간이 당신 편입니다.',
    'job.step': '직업', 'job.h': '무엇으로 벌고 있나요?', 'job.sub': '평균 월수입 기준 — 같은 비율을 미래로 보내도, 출발선이 도달을 바꿉니다.',
    'job.hint': '직업을 고르면 평균 수입과 저축 30%가 자동으로 채워져요 — 다음 화면에서 조정할 수 있어요.',
    'job.line': '{job} — 평균 {sal}. 수입의 30%인 <b>{save}</b>를 미래로 보내는 것으로 시작해요.',
    'job.custom': '직접 입력', 'job.customPr': '내 월급으로', 'job.customLabel': '나의 한 달 수입',
    'job.customLine': '내 수입 — 월 {sal}. 수입의 30%인 <b>{save}</b>를 미래로 보내는 것으로 시작해요.',
    'fx.krw': '₩ 원', 'fx.usd': '$ 달러', 'fx.eur': '€ 유로',
    'fx.note': '환율 {m} 기준 · $1 = ₩{u} · €1 = ₩{e} — 매달 자동 업데이트',
    'job.mystery': '숨겨진 인생', 'job.hiddenTag': '히든', 'job.hiddenH': '숨겨진 인생들',
    'job.hiddenSub': '카드를 뒤집으면 다른 삶의 출발선이 보여요 — 그 삶으로 계산해볼 수도 있어요.',
    'calc.nextLife': '인생을 살아보기 →',
    'life.step': '인생', 'life.h': '계획대로만 흘러가진 않죠', 'life.sub': '인생이 끼어듭니다. 하나씩, 당신의 선택은?',
    'life.at': '{age}세',
    'ev.promo': '승진의 갈림길', 'ev.promo.a': '승진 수락 — 직급은 오르지만 월급은 그대로', 'ev.promo.b': '이직 — 타이틀 대신 월급 상승',
    'ev.baby': '아이가 찾아왔어요', 'ev.baby.a': '환영하기', 'ev.baby.b': '아직은 둘이서',
    'ev.crash': '시장이 무너졌어요 (−30%)', 'ev.crash.a': '계속 투자 — 폭락은 세일이니까', 'ev.crash.b': '무서워서 투자 줄이기',
    'ev.parents': '부모님이 도움이 필요해요', 'ev.parents.a': '매달 보태기', 'ev.parents.b': '마음만 전하기',
    'ev.side': '부업의 기회', 'ev.side.a': '도전하기', 'ev.side.b': '저녁이 있는 삶',
    'life.resultH': '인생을 반영한 결과', 'life.plan': '계획의 도달', 'life.real': '인생의 도달', 'life.happy': '행복지수',
    'life.note': '도달이 늦어졌어도 행복이 남았다면 — 그게 손해일까요? 숫자와 마음, 둘 다 당신의 자산입니다.',
    'life.next': '세대 곡선으로 →', 'life.scoreJob': '직업', 'life.scoreReach': '도달 나이',
    'life.otherTag': '보너스', 'life.otherJob': '다른 직업은 얼마나 벌까?', 'life.otherSub': '직업을 바꿔서 같은 꿈을 다시 계산해보세요 — 출발선이 바뀝니다.',
    'sit.step': '나의 현실', 'sit.h': '지금의 당신을 알려주세요', 'sit.sub': '한 달의 흐름만 있으면 됩니다 — 정확하지 않아도 괜찮아요.',
    'sit.salary': '한 달 수입', 'sit.tenure': '지금 사는 곳은', 'sit.none': '아직 없음', 'sit.rent': '월세', 'sit.own': '자가',
    'sit.rentAmt': '한 달 월세', 'sit.homeValue': '집값',
    'sit.mort': '대출 {l} 가정 · 월 상환 <b>{p}</b> — 이자 {i} + <b>원금 {pr}</b> · {r}%/{y}년',
    'sit.fixed': '고정비 (차 · 공과금 · 구독)', 'sit.save': '매달 떼어두는 돈', 'sit.assets': '이미 모아둔 돈',
    'sit.next': '내 돈의 흐름 보기 →',
    'diag.step': '진단', 'diag.h': '당신의 돈은 이렇게 흐릅니다', 'diag.sub': '어디로 새는지가 아니라, 어디로 흐르는지를 봅니다.',
    'diag.flowTitle': '한 달의 흐름', 'diag.housing': '주거', 'diag.fixed': '고정비', 'diag.save': '저축·투자', 'diag.living': '삶',
    'diag.saveRate': '저축률 — 미래로 흐르는 비율',
    'diag.v30': '훌륭합니다. 수입의 {r}%가 미래로 흐르고 있어요 — 부자들의 리듬입니다.',
    'diag.v15': '좋은 흐름이에요. {r}%가 미래로 갑니다 — 여기서 조금만 더 밀면 곡선이 달라져요.',
    'diag.v1': '{r}%가 미래로 흐릅니다. 시작이 반 — 흐름이 있다는 것 자체가 힘입니다.',
    'diag.v0': '지금은 모든 것이 오늘에 쓰입니다. 아주 작은 흐름 하나부터 — 그게 시작입니다.',
    'diag.hidden': '모기지 상환 {p} 중 <b>{pr}은 숨은 저축</b>입니다 — 이자가 아니라 당신에게 쌓여요.',
    'diag.next': '이제, 꿈을 고르러 →',
    'car.step': '드림카', 'car.h': '어떤 차를 몰고 싶나요?',
    'home.step': '살 곳', 'home.h': '세계 어디에서 살고 싶나요?',
    'trip.step': '여행', 'trip.h': '어디로 떠나고 싶나요?', 'trip.next': '계산하기 →',
    'trip.freq': '얼마나 자주 떠날까요', 'freq.1': '매달', 'freq.2': '두 달에 한 번', 'freq.6': '반년에 한 번', 'freq.12': '일 년에 한 번',
    'trip.monthEq': '1회 {p} ÷ {f}개월 = 여행의 한 달 <b>{m}</b>',
    'calc.step': '계산', 'calc.h': '이 꿈, 사지 말고 유지하세요',
    'calc.dreamMonth': '이 꿈의 한 달',
    'calc.buyPath': '일시불로 사면', 'calc.buyNote': '사는 순간부터 낡고, 여행은 한 번으로 끝나요.',
    'calc.keepPath': '우리의 길 — 유지하기', 'calc.keepNote': '이 종자돈이면 매달 <b>{m}</b>이 평생 나와요. 부자들의 방식.',
    'calc.seedFlow': '종자돈의 연 4% = <b>월 0.34%</b> — 세금 {t}%를 떼고도 매달 꿈값이 나옵니다. 원금은 줄지 않아요.',
    'calc.assume': '월 비용은 리스·렌트·여행 월예산 기준의 단순화 가정입니다',
    'calc.saveEcho': '매달 미래로 보내는 돈', 'calc.split': '수입 {inc} 중 미래로 <b>{fut}</b>',
    'calc.slow': '지금을 즐기기', 'calc.fast': '미래에 올인',
    'calc.rate': '어떻게 굴릴까', 'calc.safe': '안전 5%', 'calc.index': '지수 7%', 'calc.bold': '공격 10%',
    'calc.country': '세금 기준 나라', 'calc.kr': '🇰🇷 한국 15.4%', 'calc.us': '🇺🇸 미국 15%', 'calc.fr': '🇫🇷 프랑스 30%',
    'calc.partnerH': '함께하는 사람', 'calc.partnerBtn': '동반자 추가', 'calc.partnerOn': '동반자와 함께',
    'calc.partnerAge': '몇 살에 함께하나요', 'calc.partnerM': '동반자도 매달',
    'calc.partnerNote': '동반자 합류로 도달이 {y}년 빨라져요',
    'calc.reach': '지금부터 <b>{y}년</b> — <b>{age}세</b>부터 매달 <b>{m}</b>이 평생 나오기 시작해요.',
    'calc.reachNone': '이 속도로는 한 생을 넘어서요. 저축이나 수입, 동반자를 조정해보세요.',
    'calc.faster': '투자를 두 배로 하면 <b>{y}년</b> 더 빨라져요.',
    'bvr.h': '{city}의 집 — 사기 vs 렌트', 'bvr.sub': '같은 월 예산으로 {y}년, 두 길을 걸으면 (집값 상승 {g}%/년 가정)',
    'bvr.buy': '사는 길 (집 + 남는 돈 투자)', 'bvr.rent': '렌트의 길 (계약금도 투자)',
    'bvr.buyWin': '이 도시에선 <b>사는 쪽이 {d} 앞서요</b>. 그래도 매달의 흐름은 종자돈에서 나옵니다 — 이건 조언이 아니라 이해를 위한 비교예요.',
    'bvr.rentWin': '이 도시에선 <b>렌트 + 투자가 {d} 앞서요</b> — 유지의 길이 숫자로도 이깁니다. 이해를 위한 비교예요.',
    'weight.h': '한 결정의 무게', 'weight.sub': '오늘의 작은 선택이 만드는 차이',
    'weight.plus30': '매달 30만원 더 넣으면', 'weight.plus30f': '도달이 {y}년 빨라져요',
    'weight.delay': '시작을 10년 미루면', 'weight.delayf': '같은 나이에 닿으려면 매달 {x}배 필요해요',
    'weight.nothing': '아무것도 안 하면', 'weight.nothingf': '30년 뒤 이 종자돈은 {v}이 필요해요 (물가 4%/년)',
    'calc.again': '다시 그리기', 'calc.share': '내 꿈 공유하기', 'calc.nextGen': '이 꿈, 그 다음은 →',
    'gen.step': '세대 곡선', 'gen.h': '이 꿈은 당신에서 끝나지 않아요', 'gen.sub': '종자돈은 다 쓰지 않는 돈 — 세대를 건너며 자라는 곡선입니다. 록펠러 가문이 100년간 쓴 구조.',
    'gen.g1': '제 1세대 — 나', 'gen.g1when': '{age}세 · 종자돈 완성', 'gen.g1note': '당신이 완성한 종자돈. 4%만 꺼내 쓰니 원금은 그대로 — 여기서 곡선이 시작됩니다.',
    'gen.g2': '제 2세대 — 자녀', 'gen.g2when': '+30년', 'gen.g2note': '같은 수익률로 재투자만 해도, 자녀 세대엔 이만큼이 됩니다.',
    'gen.g3': '제 3세대 — 손자녀', 'gen.g3when': '+60년', 'gen.g3note': '시간이 세 번째 세대를 건널 때, 복리는 기하급수가 됩니다.',
    'gen.philoTag': '철학', 'gen.philo': '한 사람의 일생만으로는 보이지 않는 곡선이 있습니다. <em>시간을 자산으로</em> 보면, 오늘의 결정은 60년 뒤의 누군가에게 닿습니다.',
    'cta.line': '꿈은 시간이 이룹니다. 지키는 건 <em>구조</em>입니다.', 'cta.btn': 'ARBITORIA Family Office 보기',
    'calc.disclaim': '교육·상상용 시뮬레이션입니다. 수익률·가격·세율·대출 조건은 단순화한 가정이며 투자·세무 조언이 아닙니다.',
    'toast.copied': '링크를 복사했어요.', 'toast.manual': '주소창의 링크를 복사해 공유하세요.',
  },
  en: {
    'cover.title': 'Dreaming of<br/>my future self', 'cover.sub': 'Enter who you are, choose the dream — time draws the line between them.', 'cover.start': 'Begin',
    'nav.back': 'Back', 'nav.next': 'Next',
    'gender.h': 'Who are you?', 'g.female': 'Woman', 'g.male': 'Man', 'g.other': 'Other',
    'age.h': 'How old are you now?', 'age.hint': 'The earlier you start, the more time is on your side.',
    'job.step': 'YOUR WORK', 'job.h': 'How do you earn?', 'job.sub': 'Average monthly income — the same share sent forward, a different starting line, a different arrival.',
    'job.hint': 'Pick a career and its average income + 30% saving fill in — adjust them on the next screen.',
    'job.line': '{job} — average {sal}. You start by sending 30%, <b>{save}</b>, to the future.',
    'job.custom': 'Enter my own', 'job.customPr': 'my salary', 'job.customLabel': 'My monthly income',
    'job.customLine': 'My income — {sal} a month. You start by sending 30%, <b>{save}</b>, to the future.',
    'fx.krw': '₩ KRW', 'fx.usd': '$ USD', 'fx.eur': '€ EUR',
    'fx.note': 'Rates as of {m} · $1 = ₩{u} · €1 = ₩{e} — refreshed monthly',
    'job.mystery': 'A hidden life', 'job.hiddenTag': 'HIDDEN', 'job.hiddenH': 'Hidden lives',
    'job.hiddenSub': 'Flip a card to glimpse another life’s starting line — and try the dream from there.',
    'calc.nextLife': 'Live the life →',
    'life.step': 'LIFE', 'life.h': 'Life rarely follows the plan', 'life.sub': 'Life interrupts. One at a time — what do you choose?',
    'life.at': 'Age {age}',
    'ev.promo': 'The promotion fork', 'ev.promo.a': 'Accept — a title, the same pay', 'ev.promo.b': 'Switch jobs — pay over title',
    'ev.baby': 'A child arrives', 'ev.baby.a': 'Welcome them', 'ev.baby.b': 'Just us, for now',
    'ev.crash': 'The market crashes (−30%)', 'ev.crash.a': 'Keep investing — crashes are sales', 'ev.crash.b': 'Scared — invest less',
    'ev.parents': 'Your parents need help', 'ev.parents.a': 'Send money monthly', 'ev.parents.b': 'Words only',
    'ev.side': 'A side-business chance', 'ev.side.a': 'Take it', 'ev.side.b': 'Keep the evenings',
    'life.resultH': 'The result, with life in it', 'life.plan': 'The plan said', 'life.real': 'Life says', 'life.happy': 'Happiness',
    'life.note': 'If arriving later left you happier — was it a loss? Numbers and heart are both your assets.',
    'life.next': 'To the generations →', 'life.scoreJob': 'Work', 'life.scoreReach': 'Arrival age',
    'life.otherTag': 'BONUS', 'life.otherJob': 'What would another career pay?', 'life.otherSub': 'Swap your work and recalculate the same dream — the starting line moves.',
    'sit.step': 'YOUR PRESENT', 'sit.h': 'Tell us where you stand', 'sit.sub': 'Just one month of flow — rough numbers are fine.',
    'sit.salary': 'Monthly income', 'sit.tenure': 'Where you live now', 'sit.none': 'Not yet', 'sit.rent': 'Renting', 'sit.own': 'Own',
    'sit.rentAmt': 'Monthly rent', 'sit.homeValue': 'Home value',
    'sit.mort': 'Assuming {l} loan · monthly payment <b>{p}</b> — interest {i} + <b>principal {pr}</b> · {r}%/{y}y',
    'sit.fixed': 'Fixed costs (car · utilities · subs)', 'sit.save': 'Set aside each month', 'sit.assets': 'Already saved',
    'sit.next': 'See where my money flows →',
    'diag.step': 'DIAGNOSIS', 'diag.h': 'This is how your money flows', 'diag.sub': 'Not where it leaks — where it flows.',
    'diag.flowTitle': 'One month of flow', 'diag.housing': 'Housing', 'diag.fixed': 'Fixed', 'diag.save': 'Saving', 'diag.living': 'Living',
    'diag.saveRate': 'Savings rate — the share flowing to your future',
    'diag.v30': 'Excellent. {r}% of your income flows to the future — the rhythm of the wealthy.',
    'diag.v15': 'A good current. {r}% goes forward — one push more and the curve changes.',
    'diag.v1': '{r}% flows forward. A stream exists — that itself is power.',
    'diag.v0': 'Right now everything is spent on today. One small stream — that is how it starts.',
    'diag.hidden': 'Of your {p} mortgage payment, <b>{pr} is hidden saving</b> — not interest, but yours.',
    'diag.next': 'Now, choose the dream →',
    'car.step': 'DREAM CAR', 'car.h': 'What would you drive?',
    'home.step': 'WHERE YOU LIVE', 'home.h': 'Where in the world would you live?',
    'trip.step': 'THE JOURNEY', 'trip.h': 'Where would you go?', 'trip.next': 'Calculate →',
    'trip.freq': 'How often would you go', 'freq.1': 'Monthly', 'freq.2': 'Every 2 months', 'freq.6': 'Twice a year', 'freq.12': 'Once a year',
    'trip.monthEq': '{p} per trip ÷ {f} months = <b>{m}</b> a month',
    'calc.step': 'THE NUMBER', 'calc.h': 'Don’t buy this dream. Sustain it.',
    'calc.dreamMonth': 'This dream, per month',
    'calc.buyPath': 'Buy it outright', 'calc.buyNote': 'It ages the day you buy it, and the journey ends once.',
    'calc.keepPath': 'Our way — sustain it', 'calc.keepNote': 'This seed pays <b>{m}</b> every month, for life. The way the wealthy do it.',
    'calc.seedFlow': '4% a year = <b>0.34% a month</b> — even after {t}% tax, the dream pays itself monthly. The principal never shrinks.',
    'calc.assume': 'Monthly costs are simplified lease · rent · travel-budget assumptions',
    'calc.saveEcho': 'Sent to the future each month', 'calc.split': 'Of {inc} income, <b>{fut}</b> flows forward',
    'calc.slow': 'live for now', 'calc.fast': 'all-in future',
    'calc.rate': 'How to grow it', 'calc.safe': 'Safe 5%', 'calc.index': 'Index 7%', 'calc.bold': 'Bold 10%',
    'calc.country': 'Tax country', 'calc.kr': '🇰🇷 Korea 15.4%', 'calc.us': '🇺🇸 US 15%', 'calc.fr': '🇫🇷 France 30%',
    'calc.partnerH': 'Who joins you', 'calc.partnerBtn': 'Add a partner', 'calc.partnerOn': 'With a partner',
    'calc.partnerAge': 'At what age do they join', 'calc.partnerM': 'Partner invests monthly',
    'calc.partnerNote': 'With your partner, you arrive {y} years sooner',
    'calc.reach': 'In <b>{y} years</b> — from <b>age {age}</b>, <b>{m}</b> flows to you every month, for life.',
    'calc.reachNone': 'At this pace it outlasts a lifetime. Adjust saving, income, or add a partner.',
    'calc.faster': 'Double the investment and it comes <b>{y} years</b> sooner.',
    'bvr.h': 'A home in {city} — buy vs rent', 'bvr.sub': 'The same monthly budget, two roads, {y} years (home growth {g}%/yr)',
    'bvr.buy': 'Buying (home + invest the rest)', 'bvr.rent': 'Renting (down payment invested too)',
    'bvr.buyWin': 'In this city, <b>buying ends {d} ahead</b>. The monthly flow still comes from the seed — a comparison for understanding, not advice.',
    'bvr.rentWin': 'In this city, <b>rent + invest ends {d} ahead</b> — the sustaining road wins in numbers too. For understanding, not advice.',
    'weight.h': 'The weight of one decision', 'weight.sub': 'What a small choice today becomes',
    'weight.plus30': 'Add ₩300K a month', 'weight.plus30f': 'You arrive {y} years sooner',
    'weight.delay': 'Delay the start by 10 years', 'weight.delayf': 'Reaching the same age takes {x}× more each month',
    'weight.nothing': 'Do nothing', 'weight.nothingf': 'In 30 years the seed you need becomes {v} (4%/yr inflation)',
    'calc.again': 'Draw again', 'calc.share': 'Share my dream', 'calc.nextGen': 'Beyond this dream →',
    'gen.step': 'GENERATIONS', 'gen.h': 'This dream does not end with you', 'gen.sub': 'A seed is money you never spend — a curve that keeps compounding across generations. The Rockefeller structure.',
    'gen.g1': '1st generation — You', 'gen.g1when': 'Age {age} · seed complete', 'gen.g1note': 'The seed you built. Drawing only 4%, the principal stands — the curve starts here.',
    'gen.g2': '2nd generation — Your child', 'gen.g2when': '+30 years', 'gen.g2note': 'Reinvested at the same rate, it becomes this by your child’s generation.',
    'gen.g3': '3rd generation — Grandchild', 'gen.g3when': '+60 years', 'gen.g3note': 'When time crosses a third generation, compounding turns geometric.',
    'gen.philoTag': 'Philosophy', 'gen.philo': 'Some curves cannot be seen within one lifetime. Treat <em>time as an asset</em>, and today’s decision reaches someone 60 years away.',
    'cta.line': 'Time builds the dream. <em>Structure</em> keeps it.', 'cta.btn': 'See ARBITORIA Family Office',
    'calc.disclaim': 'A simulation for learning and imagining. Returns, prices, taxes and loan terms are simplified assumptions — not financial or tax advice.',
    'toast.copied': 'Link copied.', 'toast.manual': 'Copy the link from your address bar to share.',
  },
  fr: {
    'cover.title': 'Rêver de<br/>mon futur moi', 'cover.sub': 'Entrez qui vous êtes, choisissez le rêve — le temps trace la ligne entre les deux.', 'cover.start': 'Commencer',
    'nav.back': 'Retour', 'nav.next': 'Suivant',
    'gender.h': 'Qui êtes-vous ?', 'g.female': 'Femme', 'g.male': 'Homme', 'g.other': 'Autre',
    'age.h': 'Quel âge avez-vous ?', 'age.hint': 'Plus tôt vous commencez, plus le temps est de votre côté.',
    'job.step': 'VOTRE MÉTIER', 'job.h': 'Comment gagnez-vous ?', 'job.sub': 'Revenu mensuel moyen — la même part envoyée, une autre ligne de départ, une autre arrivée.',
    'job.hint': 'Choisissez un métier : revenu moyen + 30% d’épargne se remplissent — ajustez à l’écran suivant.',
    'job.line': '{job} — moyenne {sal}. Vous commencez en envoyant 30%, <b>{save}</b>, vers le futur.',
    'job.custom': 'Saisir le mien', 'job.customPr': 'mon salaire', 'job.customLabel': 'Mon revenu mensuel',
    'job.customLine': 'Mon revenu — {sal} par mois. Vous commencez en envoyant 30%, <b>{save}</b>, vers le futur.',
    'fx.krw': '₩ KRW', 'fx.usd': '$ USD', 'fx.eur': '€ EUR',
    'fx.note': 'Taux de {m} · 1 $ = ₩{u} · 1 € = ₩{e} — actualisés chaque mois',
    'job.mystery': 'Une vie cachée', 'job.hiddenTag': 'CACHÉ', 'job.hiddenH': 'Les vies cachées',
    'job.hiddenSub': 'Retournez une carte pour entrevoir la ligne de départ d’une autre vie — et tentez le rêve depuis là.',
    'calc.nextLife': 'Vivre la vie →',
    'life.step': 'LA VIE', 'life.h': 'La vie suit rarement le plan', 'life.sub': 'La vie s’invite. Une à une — que choisissez-vous ?',
    'life.at': '{age} ans',
    'ev.promo': 'La promotion', 'ev.promo.a': 'Accepter — un titre, le même salaire', 'ev.promo.b': 'Changer — le salaire plutôt que le titre',
    'ev.baby': 'Un enfant arrive', 'ev.baby.a': 'L’accueillir', 'ev.baby.b': 'Juste nous deux, pour l’instant',
    'ev.crash': 'Le marché s’effondre (−30%)', 'ev.crash.a': 'Continuer — les krachs sont des soldes', 'ev.crash.b': 'La peur — investir moins',
    'ev.parents': 'Vos parents ont besoin d’aide', 'ev.parents.a': 'Aider chaque mois', 'ev.parents.b': 'Des mots seulement',
    'ev.side': 'Une activité annexe', 'ev.side.a': 'La tenter', 'ev.side.b': 'Garder ses soirées',
    'life.resultH': 'Le résultat, avec la vie dedans', 'life.plan': 'Le plan disait', 'life.real': 'La vie dit', 'life.happy': 'Bonheur',
    'life.note': 'Arriver plus tard mais plus heureux — est-ce une perte ? Les chiffres et le cœur sont vos deux actifs.',
    'life.next': 'Vers les générations →', 'life.scoreJob': 'Métier', 'life.scoreReach': 'Âge d’arrivée',
    'life.otherTag': 'BONUS', 'life.otherJob': 'Et avec un autre métier ?', 'life.otherSub': 'Changez de métier et recalculez le même rêve — la ligne de départ bouge.',
    'sit.step': 'VOTRE PRÉSENT', 'sit.h': 'Dites-nous où vous en êtes', 'sit.sub': 'Un mois de flux suffit — des chiffres approximatifs conviennent.',
    'sit.salary': 'Revenu mensuel', 'sit.tenure': 'Votre logement actuel', 'sit.none': 'Pas encore', 'sit.rent': 'Locataire', 'sit.own': 'Propriétaire',
    'sit.rentAmt': 'Loyer mensuel', 'sit.homeValue': 'Valeur du logement',
    'sit.mort': 'Prêt {l} supposé · mensualité <b>{p}</b> — intérêts {i} + <b>capital {pr}</b> · {r}%/{y} ans',
    'sit.fixed': 'Charges fixes (voiture · factures · abonnements)', 'sit.save': 'Mis de côté chaque mois', 'sit.assets': 'Déjà épargné',
    'sit.next': 'Voir où coule mon argent →',
    'diag.step': 'DIAGNOSTIC', 'diag.h': 'Voici comment coule votre argent', 'diag.sub': 'Non pas où il fuit — où il coule.',
    'diag.flowTitle': 'Un mois de flux', 'diag.housing': 'Logement', 'diag.fixed': 'Fixe', 'diag.save': 'Épargne', 'diag.living': 'Vivre',
    'diag.saveRate': 'Taux d’épargne — la part qui coule vers votre futur',
    'diag.v30': 'Excellent. {r}% de vos revenus coulent vers le futur — le rythme des fortunes.',
    'diag.v15': 'Un bon courant. {r}% va de l’avant — encore un effort et la courbe change.',
    'diag.v1': '{r}% coule vers l’avant. Un ruisseau existe — c’est déjà une force.',
    'diag.v0': 'Pour l’instant, tout part dans l’aujourd’hui. Un petit ruisseau — c’est ainsi que tout commence.',
    'diag.hidden': 'Sur votre mensualité de {p}, <b>{pr} est une épargne cachée</b> — pas des intérêts, mais à vous.',
    'diag.next': 'Maintenant, le rêve →',
    'car.step': 'VOITURE DE RÊVE', 'car.h': 'Que conduiriez-vous ?',
    'home.step': 'OÙ VIVRE', 'home.h': 'Où dans le monde vivriez-vous ?',
    'trip.step': 'LE VOYAGE', 'trip.h': 'Où partiriez-vous ?', 'trip.next': 'Calculer →',
    'trip.freq': 'À quelle fréquence partiriez-vous', 'freq.1': 'Chaque mois', 'freq.2': 'Tous les 2 mois', 'freq.6': 'Deux fois par an', 'freq.12': 'Une fois par an',
    'trip.monthEq': '{p} par voyage ÷ {f} mois = <b>{m}</b> par mois',
    'calc.step': 'LE CHIFFRE', 'calc.h': 'N’achetez pas ce rêve. Entretenez-le.',
    'calc.dreamMonth': 'Ce rêve, par mois',
    'calc.buyPath': 'Acheter comptant', 'calc.buyNote': 'Il vieillit dès l’achat, et le voyage ne se vit qu’une fois.',
    'calc.keepPath': 'Notre voie — l’entretenir', 'calc.keepNote': 'Ce capital verse <b>{m}</b> chaque mois, à vie. La méthode des fortunes.',
    'calc.seedFlow': '4% par an = <b>0,34% par mois</b> — même après {t}% d’impôt, le rêve se paie chaque mois. Le capital ne diminue jamais.',
    'calc.assume': 'Coûts mensuels : hypothèses simplifiées de leasing · loyer · budget voyage',
    'calc.saveEcho': 'Envoyé vers le futur chaque mois', 'calc.split': 'Sur {inc} de revenu, <b>{fut}</b> coule vers l’avant',
    'calc.slow': 'vivre maintenant', 'calc.fast': 'tout au futur',
    'calc.rate': 'Comment le faire croître', 'calc.safe': 'Sûr 5%', 'calc.index': 'Indice 7%', 'calc.bold': 'Audacieux 10%',
    'calc.country': 'Pays fiscal', 'calc.kr': '🇰🇷 Corée 15,4%', 'calc.us': '🇺🇸 É.-U. 15%', 'calc.fr': '🇫🇷 France 30%',
    'calc.partnerH': 'Qui vous rejoint', 'calc.partnerBtn': 'Ajouter un partenaire', 'calc.partnerOn': 'Avec un partenaire',
    'calc.partnerAge': 'À quel âge vous rejoint-il', 'calc.partnerM': 'Le partenaire investit par mois',
    'calc.partnerNote': 'Avec votre partenaire, vous arrivez {y} ans plus tôt',
    'calc.reach': 'Dans <b>{y} ans</b> — dès <b>{age} ans</b>, <b>{m}</b> vous revient chaque mois, à vie.',
    'calc.reachNone': 'À ce rythme, cela dépasse une vie. Ajustez l’épargne, le revenu, ou ajoutez un partenaire.',
    'calc.faster': 'Doublez l’investissement et cela arrive <b>{y} ans</b> plus tôt.',
    'bvr.h': 'Un logement à {city} — acheter vs louer', 'bvr.sub': 'Le même budget mensuel, deux routes, {y} ans (immobilier {g}%/an)',
    'bvr.buy': 'Acheter (logement + investir le reste)', 'bvr.rent': 'Louer (apport investi aussi)',
    'bvr.buyWin': 'Dans cette ville, <b>acheter finit {d} devant</b>. Le flux mensuel vient toujours du capital — comparaison pour comprendre, pas un conseil.',
    'bvr.rentWin': 'Dans cette ville, <b>louer + investir finit {d} devant</b> — la voie de l’entretien gagne aussi en chiffres. Pour comprendre, pas un conseil.',
    'weight.h': 'Le poids d’une décision', 'weight.sub': 'Ce que devient un petit choix d’aujourd’hui',
    'weight.plus30': 'Ajoutez 300 k₩ par mois', 'weight.plus30f': 'Vous arrivez {y} ans plus tôt',
    'weight.delay': 'Retardez le départ de 10 ans', 'weight.delayf': 'Atteindre le même âge exige {x}× plus par mois',
    'weight.nothing': 'Ne rien faire', 'weight.nothingf': 'Dans 30 ans le capital requis devient {v} (inflation 4%/an)',
    'calc.again': 'Recommencer', 'calc.share': 'Partager mon rêve', 'calc.nextGen': 'Au-delà de ce rêve →',
    'gen.step': 'GÉNÉRATIONS', 'gen.h': 'Ce rêve ne s’arrête pas à vous', 'gen.sub': 'Un capital qu’on ne dépense jamais — une courbe qui compose à travers les générations. La structure Rockefeller.',
    'gen.g1': '1re génération — Vous', 'gen.g1when': '{age} ans · capital constitué', 'gen.g1note': 'Le capital que vous avez bâti. En ne retirant que 4%, il demeure — la courbe commence ici.',
    'gen.g2': '2e génération — Votre enfant', 'gen.g2when': '+30 ans', 'gen.g2note': 'Réinvesti au même taux, cela devient ceci à la génération suivante.',
    'gen.g3': '3e génération — Petit-enfant', 'gen.g3when': '+60 ans', 'gen.g3note': 'Quand le temps traverse une troisième génération, les intérêts composés deviennent géométriques.',
    'gen.philoTag': 'Philosophie', 'gen.philo': 'Certaines courbes sont invisibles en une seule vie. Voyez le <em>temps comme un actif</em>, et la décision d’aujourd’hui touche quelqu’un dans 60 ans.',
    'cta.line': 'Le temps bâtit le rêve. La <em>structure</em> le garde.', 'cta.btn': 'Voir ARBITORIA Family Office',
    'calc.disclaim': 'Une simulation pour apprendre et imaginer. Rendements, prix, impôts et prêts sont des hypothèses simplifiées — ni conseil financier ni fiscal.',
    'toast.copied': 'Lien copié.', 'toast.manual': 'Copiez le lien de la barre d’adresse pour partager.',
  },
};
function t(k, p) { let s = (L[lang] && L[lang][k]) != null ? L[lang][k] : (L.ko[k] != null ? L.ko[k] : k); if (p) for (const x in p) s = s.replace(new RegExp('\\{' + x + '\\}', 'g'), p[x]); return s; }
const nameOf = (cat, id) => opt(cat, id).nm[lang] || opt(cat, id).nm.ko;

/* ── 상태 ── */
const S = {
  gender: null, age: 30, job: 'custom',
  salary: 330, tenure: 'none', homeValue: 40000, rent: 80, fixedCost: 70, save: 60, assets: 3000,
  car: 'porsche', home: 'bali', trip: 'aurora', tripFreq: 12,
  rate: 7, country: 'kr',
  partner: false, partnerAge: 35, partnerMonthly: 100,
  events: [0, 0, 0, 0, 0],   // 0=미선택, 1=A, 2=B
};
let screen = 0;
const $ = (id) => document.getElementById(id);

/* ── 금액 포맷 ── */
function wonKo(v) {
  v = Math.round(v); if (v <= 0) return '0';
  const eok = Math.floor(v / 10000), man = v % 10000;
  if (eok > 0) { if (man === 0) return `${eok}억`; const c = Math.round(man / 1000); if (c >= 1 && c <= 9 && man % 1000 < 500) return `${eok}억 ${c}천`; return `${eok}억 ${man.toLocaleString()}만`; }
  if (v >= 1000) return `${v.toLocaleString()}만원`; return `${v}만원`;
}
const FX = { en: { cur: 'USD', locale: 'en-US', rate: 1400 }, fr: { cur: 'EUR', locale: 'fr-FR', rate: 1500 } };
let fxMonth = null;
/* 매달 갱신되는 실환율 (같은 오리진의 /api/fx — 없으면 기본값 유지) */
function loadFx() {
  try {
    fetch('/api/fx').then((r) => r.json()).then((d) => {
      if (d && d.usd_krw > 0 && d.eur_krw > 0) {
        FX.en.rate = d.usd_krw; FX.fr.rate = d.eur_krw; fxMonth = d.month;
        if (screen === 3) renderJobs();
        else renderScreen(screen);
      }
    }).catch(() => {});
  } catch (_) {}
}
function money(manwon) {
  if (lang === 'ko') return wonKo(manwon);
  const fx = FX[lang] || FX.en;
  return new Intl.NumberFormat(fx.locale, { style: 'currency', currency: fx.cur, notation: 'compact', maximumFractionDigits: 1 }).format(Math.round(manwon) * 10000 / fx.rate);
}
/* 나머지 두 통화로 환산한 꼬리표 (예: ko면 "$782 · €678") */
function fxCompact(v, cur, loc) { return new Intl.NumberFormat(loc, { style: 'currency', currency: cur, notation: 'compact', maximumFractionDigits: 1 }).format(v); }
function moneyFx(manwon) {
  const krw = Math.round(manwon) * 10000;
  const usd = fxCompact(krw / FX.en.rate, 'USD', 'en-US');
  const eur = fxCompact(krw / FX.fr.rate, 'EUR', 'fr-FR');
  const wk = '₩' + new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(krw);
  if (lang === 'ko') return usd + ' · ' + eur;
  if (lang === 'en') return wk + ' · ' + eur;
  return wk + ' · ' + usd;
}
function money3(manwon) { return money(manwon) + ' <span class="fx-sub">' + moneyFx(manwon) + '</span>'; }

/* ═══ 나의 현실 → 진단 (computeMember 이식·간소화) ═══ */
function computeMe() {
  const income = S.salary;
  const isOwn = S.tenure === 'own', isRent = S.tenure === 'rent';
  const effLoan = isOwn ? S.homeValue * (1 - DOWN_PCT) : 0;
  const sp = isOwn ? splitPayment(effLoan, LOAN_RATE, LOAN_YEARS) : { pay: 0, interest: 0, principal: 0 };
  const rentPaid = isRent ? S.rent : 0;
  const housingOutflow = isOwn ? sp.pay : rentPaid;
  const housingCost = isOwn ? sp.interest : rentPaid;   // 순수 비용(새는 곳)
  const saving = S.save + sp.principal;                  // 진짜 저축(원금 포함)
  const living = Math.max(0, income - housingOutflow - S.fixedCost - S.save);
  const saveRate = income > 0 ? saving / income * 100 : 0;
  return { income, isOwn, isRent, effLoan, ...sp, housingOutflow, housingCost, saving, living, saveRate };
}

/* ═══ 꿈 · 종자돈 ═══ */
/* 여행 1회 비용 = m×12 (기존 월예산은 '1년에 한 번' 기준) → 빈도로 월 환산 */
function tripPerTrip() { return mOf('trip', S.trip) * 12; }
function tripMonthly() { return Math.round(tripPerTrip() / S.tripFreq); }
function dreamMonthly() { return mOf('car', S.car) + mOf('home', S.home) + tripMonthly(); }
function buyTotal() { return priceOf('car', S.car) + priceOf('home', S.home) + priceOf('trip', S.trip); }
function taxRate() { return TAXES[S.country] != null ? TAXES[S.country] : 0.154; }
function seedNeeded() { return dreamMonthly() * 12 / (1 - taxRate()) / 0.04; }

function contribAt(m, extra, noEvents) {
  let c = S.save + (extra || 0);
  if (S.partner && S.age + m / 12 >= S.partnerAge) c += S.partnerMonthly;
  if (!noEvents) {
    for (let i = 0; i < EVENTS.length; i++) {
      const pick = S.events[i];
      if (!pick) continue;
      if (m / 12 >= EVENTS[i].offset) c += (pick === 1 ? EVENTS[i].a : EVENTS[i].b).save;
    }
  }
  return Math.max(0, c);
}
function monthsToReach(N, o) {
  o = o || {};
  const r = S.rate / 100 / 12; let bal = S.assets;
  if (bal >= N) return 0;
  const cap = (100 - S.age) * 12;
  const bak = S.partner;
  if (o.noPartner) S.partner = false;
  for (let m = 1; m <= cap; m++) {
    bal = bal * (1 + r) + contribAt(m, o.extra, o.noEvents);
    if (bal >= N) { S.partner = bak; return m; }
  }
  S.partner = bak;
  return Infinity;
}
function happiness() {
  let h = HAPPY_BASE;
  EVENTS.forEach((ev, i) => { const p = S.events[i]; if (p) h += (p === 1 ? ev.a : ev.b).happy; });
  return Math.max(0, Math.min(10, h));
}
function monthlyNeeded(P, months, ratePct) {
  if (months <= 0 || P <= 0) return 0;
  const r = ratePct / 100 / 12;
  if (r === 0) return P / months;
  return P * r / (Math.pow(1 + r, months) - 1);
}

/* ═══ 화면 전환 & i18n ═══ */
function applyLang(l) { lang = l; document.documentElement.lang = l; document.querySelectorAll('[data-i18n]').forEach((e) => { e.innerHTML = t(e.dataset.i18n); });
  document.querySelectorAll('#langRow .lang-btn').forEach((b) => b.classList.toggle('glow', b.dataset.lang === l)); }
function go(n) {
  screen = n;
  document.querySelectorAll('.screen').forEach((s) => { s.hidden = +s.dataset.screen !== n; });
  $('progressFill').style.width = (n / 11 * 100) + '%';
  renderScreen(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateHash();
  if (n === 11) sendDream();
}

/* 익명 꿈 데이터 수집 (완주 1회 · 같은 오리진에 API 있을 때만 성공) */
let dreamSent = false;
function sendDream() {
  if (dreamSent) return;
  dreamSent = true;
  const N = seedNeeded();
  const months = monthsToReach(N);
  try {
    fetch('/api/dream', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        lang, gender: S.gender, age: S.age, job: S.job, salary: S.salary, save: S.save,
        tenure: S.tenure, assets: S.assets, car: S.car, home: S.home, trip: S.trip,
        tripFreq: S.tripFreq, rate: S.rate, country: S.country,
        partner: S.partner, partnerAge: S.partnerAge, partnerMonthly: S.partnerMonthly,
        events: S.events, happiness: happiness(),
        reachAge: months === Infinity ? null : S.age + Math.round(months / 12),
        seed: Math.round(N),
      }),
    }).catch(() => {});
  } catch (_) {}
}
function renderScreen(n) {
  if (n === 1) renderGender();
  if (n === 2) $('ageBig').textContent = S.age + (lang === 'ko' ? '세' : '');
  if (n === 3) renderJobs();
  if (n === 4) renderSituation();
  if (n === 5) renderDiag();
  if (n === 6) renderGrid('car', 'gridCar');
  if (n === 7) renderGrid('home', 'gridHome');
  if (n === 8) renderGrid('trip', 'gridTrip');
  if (n === 9) renderCalc();
  if (n === 10) renderEvents();
  if (n === 11) renderGen();
}

/* ── 3. 직업 ── */
/* 히든 카드: 뒤집기 전엔 ???, 뒤집으면 그 인생의 출발선이 드러난다 */
let revealed = [];
function renderJobs() {
  const per = lang === 'ko' ? '월 ' : lang === 'fr' ? '/mois' : '/mo';
  $('gridJob').innerHTML = JOBS.map((j) => {
    if (!revealed.includes(j.id)) {
      return `
      <button class="card mystery" data-job="${j.id}" type="button">
        <span class="ce">🎴</span><span class="nm">???</span>
        <span class="pr">${t('job.mystery')}</span>
      </button>`;
    }
    return `
    <button class="card ${S.job === j.id ? 'on' : ''} ${j.id === lastReveal ? 'revealing' : ''}" data-job="${j.id}" type="button">
      <span class="ce">${j.e}</span><span class="nm">${j.nm[lang] || j.nm.ko}</span>
      <span class="pr">${lang === 'ko' ? per + money(j.sal) : money(j.sal) + ' ' + per}</span>
    </button>`;
  }).join('');
  lastReveal = null;
  syncCustomSal();
  syncJobLine();
}
let lastReveal = null;
/* ₩·$·€ 세 바 동기화 — 어느 바를 움직여도 나머지가 따라온다 */
function syncCustomSal() {
  const krw = S.salary;                                    // 만원
  const usd = Math.round(krw * 10000 / FX.en.rate);
  const eur = Math.round(krw * 10000 / FX.fr.rate);
  $('customKrw').value = krw;
  $('customUsd').value = usd;
  $('customEur').value = eur;
  $('customKrwOut').textContent = wonKo(krw);
  $('customUsdOut').textContent = '$' + usd.toLocaleString('en-US');
  $('customEurOut').textContent = '€' + eur.toLocaleString('fr-FR');
  $('fxNote').innerHTML = t('fx.note', {
    m: fxMonth || '—',
    u: Math.round(FX.en.rate).toLocaleString(),
    e: Math.round(FX.fr.rate).toLocaleString(),
  });
}
function syncJobLine() {
  const j = jobOf(S.job);
  $('jobLine').innerHTML = S.job === 'custom'
    ? t('job.customLine', { sal: money(S.salary), save: money(Math.round(S.salary * 0.3)) })
    : j
      ? t('job.line', { job: j.nm[lang] || j.nm.ko, sal: money(j.sal), save: money(Math.round(j.sal * 0.3)) })
      : t('job.hint');
}

/* ── 10. 인생 이벤트 ── */
function renderEvents() {
  const firstOpen = S.events.findIndex((v) => v === 0);
  $('eventList').innerHTML = EVENTS.map((ev, i) => {
    const state = S.events[i] ? 'done' : (i === (firstOpen === -1 ? -1 : firstOpen) ? 'active' : '');
    const fx = (c) => {
      const parts = [];
      if (c.save) parts.push(`<span class="money-fx ${c.save < 0 ? 'neg' : ''}">${c.save > 0 ? '+' : '−'}${money(Math.abs(c.save))}/${lang === 'ko' ? '월' : 'mo'}</span> <span class="fx-sub">${moneyFx(Math.abs(c.save))}</span>`);
      if (c.happy) parts.push(`<span class="happy-fx ${c.happy < 0 ? 'neg' : ''}">${c.happy > 0 ? '+' : ''}${c.happy} ❤️</span>`);
      if (!parts.length) parts.push(`<span class="faint">—</span>`);
      return parts.join(' ');
    };
    return `<div class="ev-card ${state}">
      <div class="ev-age">${t('life.at', { age: S.age + ev.offset })}</div>
      <div class="ev-title"><span class="ee">${ev.e}</span>${t('ev.' + ev.id)}</div>
      <div class="ev-choices">
        <button class="ev-choice ${S.events[i] === 1 ? 'picked' : ''}" data-ev="${i}" data-pick="1" type="button">
          <span class="cl">${t('ev.' + ev.id + '.a')}</span><span class="cf">${fx(ev.a)}</span></button>
        <button class="ev-choice ${S.events[i] === 2 ? 'picked' : ''}" data-ev="${i}" data-pick="2" type="button">
          <span class="cl">${t('ev.' + ev.id + '.b')}</span><span class="cf">${fx(ev.b)}</span></button>
      </div></div>`;
  }).join('') + `
    <div class="ev-card otherjob" id="otherJobCard" role="button" tabindex="0">
      <div class="ev-age">${t('life.otherTag')}</div>
      <div class="ev-title"><span class="ee">💼</span>${t('life.otherJob')}</div>
      <div class="bvr-sub" style="margin-bottom:0">${t('life.otherSub')}</div>
    </div>`;
  renderLifeResult();
}
function renderLifeResult() {
  const done = S.events.every((v) => v !== 0);
  const box = $('lifeResult');
  box.hidden = !done;
  if (!done) return;
  const N = seedNeeded();
  const plan = monthsToReach(N, { noEvents: true });
  const real = monthsToReach(N);
  const planAge = plan === Infinity ? '∞' : S.age + Math.round(plan / 12);
  const realAge = real === Infinity ? '∞' : S.age + Math.round(real / 12);
  const h = happiness();
  const hearts = '❤️'.repeat(Math.round(h / 2)) + '🤍'.repeat(5 - Math.round(h / 2));
  box.innerHTML = `
    <span class="muted" style="font-weight:700">${t('life.resultH')}</span>
    <div class="lr-row">
      <div class="lr-col"><div class="lr-l">${t('life.plan')}</div><div class="lr-v">${planAge}${lang === 'ko' ? '세' : ''}</div></div>
      <div class="lr-col"><div class="lr-l">${t('life.real')}</div><div class="lr-v">${realAge}${lang === 'ko' ? '세' : ''}</div></div>
      <div class="lr-col"><div class="lr-l">${t('life.happy')}</div><div class="lr-v hearts">${hearts}</div><div class="lr-l" style="margin-top:2px">${h}/10</div></div>
    </div>
    <p class="lr-note">${t('life.note')}</p>`;
}
function renderGender() {
  $('genderRow').innerHTML = [['female', '🌷'], ['male', '🌿'], ['other', '✨']].map(([g, e]) =>
    `<button class="choice ${S.gender === g ? 'on' : ''}" data-gender="${g}" type="button"><span class="ce">${e}</span>${t('g.' + g)}</button>`).join('');
}
function renderGrid(cat, boxId) {
  const per = lang === 'ko' ? '월 ' : lang === 'fr' ? '/mois' : '/mo';
  const perTrip = lang === 'ko' ? '1회 ' : lang === 'fr' ? '/voyage' : '/trip';
  $(boxId).innerHTML = CATS[cat].map((o) => {
    const label = cat === 'trip'
      ? (lang === 'ko' ? perTrip + money(o.m * 12) : money(o.m * 12) + ' ' + perTrip)
      : (lang === 'ko' ? per + money(o.m) : money(o.m) + ' ' + per);
    return `
    <button class="card ${S[cat] === o.id ? 'on' : ''}" data-cat="${cat}" data-id="${o.id}" type="button">
      <span class="ce">${o.e}</span><span class="nm">${o.nm[lang] || o.nm.ko}</span>
      <span class="pr">${label}</span>
    </button>`;
  }).join('');
  if (cat === 'trip') syncTripFreq();
}
function syncTripFreq() {
  [...$('tripFreq').children].forEach((b) => b.classList.toggle('on', +b.dataset.freq === S.tripFreq));
  $('tripMonthLine').innerHTML = t('trip.monthEq', { p: money(tripPerTrip()), f: S.tripFreq, m: money(tripMonthly()) });
}

/* ── 3. 나의 현실 ── */
function renderSituation() {
  $('salary').value = S.salary; $('rent').value = S.rent; $('homeValue').value = S.homeValue;
  $('fixedCost').value = S.fixedCost; $('saveAmt').value = S.save; $('assets').value = S.assets;
  [...$('tenure').children].forEach((b) => b.classList.toggle('on', b.dataset.tenure === S.tenure));
  syncSitOutputs();
}
function syncSitOutputs() {
  $('salaryOut').innerHTML = money3(S.salary);
  $('rentOut').innerHTML = money3(S.rent);
  $('homeValueOut').innerHTML = money3(S.homeValue);
  $('fixedOut').innerHTML = money3(S.fixedCost);
  $('saveOut').innerHTML = money3(S.save);
  $('assetsOut').innerHTML = money3(S.assets);
  $('rentField').hidden = S.tenure !== 'rent';
  $('ownFields').hidden = S.tenure !== 'own';
  if (S.tenure === 'own') {
    const sp = splitPayment(S.homeValue * (1 - DOWN_PCT), LOAN_RATE, LOAN_YEARS);
    $('mortNote').innerHTML = t('sit.mort', { l: Math.round((1 - DOWN_PCT) * 100) + '%', p: money(sp.pay), i: money(sp.interest), pr: money(sp.principal), r: LOAN_RATE, y: LOAN_YEARS });
  }
}

/* ── 4. 진단 ── */
function renderDiag() {
  const me = computeMe();
  const segs = [
    { k: 'housing', v: me.housingOutflow, c: '#C9A961' },
    { k: 'fixed', v: S.fixedCost, c: '#D08B6A' },
    { k: 'save', v: S.save, c: '#3FA37C' },
    { k: 'living', v: me.living, c: '#51695C' },
  ];
  const sum = Math.max(1, segs.reduce((a, s) => a + s.v, 0));
  $('flowBar').innerHTML = segs.map((s) => `<i style="width:${(s.v / sum * 100).toFixed(1)}%;background:${s.c}"></i>`).join('');
  $('flowLegend').innerHTML = segs.map((s) => `
    <div class="fl-row"><span class="fl-dot" style="background:${s.c}"></span>
      <span class="fl-name">${t('diag.' + s.k)}</span>
      <span class="fl-pct">${me.income > 0 ? Math.round(s.v / me.income * 100) : 0}%</span>
      <span class="fl-amt">${money(s.v)}</span></div>`).join('');
  const r = Math.round(me.saveRate);
  const big = $('saveRateBig');
  big.textContent = r + '%';
  big.classList.toggle('warn', r < 10);
  $('diagVerdict').innerHTML = r >= 30 ? t('diag.v30', { r }) : r >= 15 ? t('diag.v15', { r }) : r >= 1 ? t('diag.v1', { r }) : t('diag.v0');
  const hs = $('hiddenSave');
  if (me.isOwn && me.principal > 0) { hs.hidden = false; hs.innerHTML = t('diag.hidden', { p: money(me.pay), pr: money(me.principal) }); }
  else hs.hidden = true;
}

/* ── 8. 계산 ── */
function renderCalc() {
  $('dreamSummary').innerHTML = ['car', 'home', 'trip'].map((c) =>
    `<span class="ds"><span class="e">${emojiOf(c, S[c])}</span>${nameOf(c, S[c])}</span>`).join('');
  $('calcSave').value = S.save;
  $('partnerAge').value = Math.max(S.age, S.partnerAge);
  $('partnerMonthly').value = S.partnerMonthly;
  [...$('rate').children].forEach((b) => b.classList.toggle('on', +b.dataset.rate === S.rate));
  [...$('country').children].forEach((b) => b.classList.toggle('on', b.dataset.country === S.country));
  $('partnerBtn').classList.toggle('on', S.partner);
  $('partnerBtn').innerHTML = t(S.partner ? 'calc.partnerOn' : 'calc.partnerBtn');
  $('partnerFields').hidden = !S.partner;
  updateReach();
}
function updateReach() {
  const N = seedNeeded();
  const dm = dreamMonthly();
  $('monthNum').textContent = (lang === 'ko' ? '월 ' : '') + money(dm) + (lang === 'ko' ? '' : lang === 'fr' ? ' /mois' : ' /mo');
  $('twoPath').innerHTML = `
    <div class="path-col"><div class="pc-t">${t('calc.buyPath')}</div>
      <div class="pc-v">${money(buyTotal())}</div><div class="pc-n">${t('calc.buyNote')}</div></div>
    <div class="path-col hero"><div class="pc-t">${t('calc.keepPath')}</div>
      <div class="pc-v">${money(N)}</div><div class="pc-n">${t('calc.keepNote', { m: money(dm) })}</div></div>`;
  $('seedFlow').innerHTML = t('calc.seedFlow', { t: (taxRate() * 100).toFixed(1).replace('.0', '') });
  $('calcSaveOut').textContent = money(S.save);
  $('splitLine').innerHTML = t('calc.split', { inc: money(S.salary), fut: money(S.save) });
  $('partnerAgeOut').textContent = S.partnerAge + (lang === 'ko' ? '세' : '');
  $('partnerMOut').textContent = money(S.partnerMonthly);

  const months = monthsToReach(N);
  if (months === Infinity) $('reachLine').innerHTML = t('calc.reachNone');
  else {
    const years = Math.max(1, Math.round(months / 12));
    const reachAge = S.age + Math.round(months / 12);
    let s = t('calc.reach', { y: years, age: reachAge, m: money(dm) });
    const fast = monthsToReach(N, { extra: S.save });
    if (fast !== Infinity) {
      const saved = Math.round((months - fast) / 12);
      if (saved >= 1) s += ` <span class="faint" style="font-size:.8em">— ${t('calc.faster', { y: saved })}</span>`;
    }
    $('reachLine').innerHTML = s;
  }
  if (S.partner) {
    const solo = monthsToReach(N, { noPartner: true });
    const dy = (solo !== Infinity && months !== Infinity) ? Math.round((solo - months) / 12) : null;
    $('partnerNote').textContent = dy !== null && dy >= 1 ? t('calc.partnerNote', { y: dy }) : '';
  }
  drawViz(N, months);
  renderBvr();
  renderWeight(N, months);
}

/* ── 사기 vs 렌트 (선택 도시 · GAME_HANDOFF §8) ── */
function renderBvr() {
  const city = opt('home', S.home);
  const r = buyVsRent({ loanYears: LOAN_YEARS, rate: S.rate, homeGrowth: HOME_GROWTH,
    downPayment: city.price * DOWN_PCT, homeValue: city.price, loanRate: LOAN_RATE, monthlyRent: city.m });
  const buyWin = r.diff >= 0;
  const d = money(Math.abs(r.diff));
  $('bvrCard').innerHTML = `
    <h3>${t('bvr.h', { city: nameOf('home', S.home) })}</h3>
    <div class="bvr-sub">${t('bvr.sub', { y: LOAN_YEARS, g: HOME_GROWTH })}</div>
    <div class="bvr-cols">
      <div class="bvr-col ${buyWin ? 'win' : ''}"><div class="t">${t('bvr.buy')}</div><div class="v">${money(r.buyEnd)}</div></div>
      <div class="bvr-col ${buyWin ? '' : 'win'}"><div class="t">${t('bvr.rent')}</div><div class="v">${money(r.rentEnd)}</div></div>
    </div>
    <div class="bvr-verdict">${buyWin ? t('bvr.buyWin', { d }) : t('bvr.rentWin', { d })}</div>`;
}

/* ── 한 결정의 무게 ── */
function renderWeight(N, months) {
  const plus = monthsToReach(N, { extra: 30 });
  const savedY = (months !== Infinity && plus !== Infinity) ? Math.round((months - plus) / 12) : null;
  let delayX = null;
  if (months !== Infinity) {
    const lateMonths = months - 120;
    if (lateMonths > 0 && S.save > 0) delayX = (monthlyNeeded(N, lateMonths, S.rate) / S.save).toFixed(1);
  }
  const infl = N * Math.pow(1.04, 30);
  $('weightCards').innerHTML = `
    <div class="wcard"><div class="wt">${t('weight.plus30')}</div>
      <div class="wv good">${savedY !== null && savedY >= 1 ? t('weight.plus30f', { y: savedY }) : '—'}</div></div>
    <div class="wcard"><div class="wt">${t('weight.delay')}</div>
      <div class="wv bad">${delayX !== null && delayX > 1 ? t('weight.delayf', { x: delayX }) : '—'}</div></div>
    <div class="wcard"><div class="wt">${t('weight.nothing')}</div>
      <div class="wv bad">${t('weight.nothingf', { v: money(infl) })}</div></div>`;
}

/* ── 11. 세대 ── */
function renderGen() {
  const N = seedNeeded();
  const months = monthsToReach(N);
  const reachAge = months === Infinity ? S.age + 30 : S.age + Math.round(months / 12);
  const h = happiness();
  const j = jobOf(S.job);
  const jName = S.job === 'custom' ? t('job.custom') : (j ? (j.nm[lang] || j.nm.ko) : '—');
  $('lifeScore').innerHTML = `
    <div class="ls-col"><div class="lr-l">${t('life.scoreJob')}</div><div class="lr-v">${jName}</div></div>
    <div class="ls-col"><div class="lr-l">${t('life.scoreReach')}</div><div class="lr-v">${months === Infinity ? '∞' : reachAge + (lang === 'ko' ? '세' : '')}</div></div>
    <div class="ls-col"><div class="lr-l">${t('life.happy')}</div><div class="lr-v">${'❤️'.repeat(Math.round(h / 2))} ${h}/10</div></div>`;
  const r = S.rate / 100;
  const g2 = N * Math.pow(1 + r, 30), g3 = N * Math.pow(1 + r, 60);
  $('genTrack').innerHTML = `
    <div class="gen-card"><div class="gen-tag">${t('gen.g1')}</div>
      <h4>${t('gen.g1when', { age: reachAge })}</h4>
      <div class="gen-amt">${money(N)}</div><div class="gen-note">${t('gen.g1note')}</div></div>
    <div class="gen-card mid"><div class="gen-tag">${t('gen.g2')}</div>
      <h4>${t('gen.g2when')}</h4>
      <div class="gen-amt">${money(g2)}</div><div class="gen-note">${t('gen.g2note')}</div></div>
    <div class="gen-card"><div class="gen-tag">${t('gen.g3')}</div>
      <h4>${t('gen.g3when')}</h4>
      <div class="gen-amt">${money(g3)}</div><div class="gen-note">${t('gen.g3note')}</div></div>`;
}

/* ═══ 시각화 ═══ */
function drawViz(N, months) {
  const svg = $('viz'), W = 520, H = 240, padL = 14, padR = 14, padT = 20, padB = 30;
  const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
  const r = S.rate / 100 / 12;
  const endM = months === Infinity ? (100 - S.age) * 12 : Math.round(months * 1.12);
  const pts = []; let bal = S.assets;
  for (let m = 0; m <= endM; m++) {
    if (m % Math.max(1, Math.round(endM / 110)) === 0 || m === endM) pts.push({ m, bal });
    bal = bal * (1 + r) + contribAt(m);
  }
  const maxY = Math.max(N * 1.1, pts[pts.length - 1].bal, 1);
  const sx = (m) => x0 + m / endM * (x1 - x0);
  const sy = (v) => y0 - Math.min(v, maxY) / maxY * (y0 - y1);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.m).toFixed(1)},${sy(p.bal).toFixed(1)}`).join(' ');
  const area = `${path} L${x1},${y0} L${x0},${y0} Z`;
  const pY = sy(N);
  const rx = months === Infinity ? null : sx(months);

  let ticks = '';
  for (let yy = 10; yy <= (100 - S.age); yy += 10) {
    const mm = yy * 12; if (mm > endM) break;
    ticks += `<text x="${sx(mm).toFixed(1)}" y="${y0 + 18}" font-size="10.5" fill="#7E9284" text-anchor="middle" font-family="Pretendard">${S.age + yy}${lang === 'ko' ? '세' : ''}</text>`;
  }
  let joinMark = '';
  if (S.partner) {
    const jm = (S.partnerAge - S.age) * 12;
    if (jm > 0 && jm < endM) {
      const jx = sx(jm);
      joinMark = `<line x1="${jx.toFixed(1)}" y1="${y1}" x2="${jx.toFixed(1)}" y2="${y0}" stroke="#3FA37C" stroke-width="1.2" stroke-dasharray="3 4"/>
        <text x="${jx.toFixed(1)}" y="${y1 - 6}" font-size="10.5" fill="#3FA37C" text-anchor="middle" font-family="Pretendard" font-weight="700">💑 ${S.partnerAge}${lang === 'ko' ? '세' : ''}</text>`;
    }
  }
  svg.innerHTML = `
    <defs><linearGradient id="vz" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#C9A961" stop-opacity=".4"/><stop offset="1" stop-color="#C9A961" stop-opacity="0"/></linearGradient></defs>
    <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="rgba(255,255,255,.12)" stroke-width="1"/>${ticks}
    <line x1="${x0}" y1="${pY.toFixed(1)}" x2="${x1}" y2="${pY.toFixed(1)}" stroke="#E4C77B" stroke-width="1.2" stroke-dasharray="3 5"/>
    <text x="${x1}" y="${(pY - 19).toFixed(1)}" font-size="11.5" fill="#E4C77B" text-anchor="end" font-family="Pretendard" font-weight="700">${money(N)}</text>
    <text x="${x1}" y="${(pY - 6).toFixed(1)}" font-size="10.5" fill="#E4C77B" text-anchor="end" font-family="Pretendard">${lang === 'ko' ? '여기부터 월 ' + money(dreamMonthly()) : '→ ' + money(dreamMonthly()) + (lang === 'fr' ? ' /mois' : ' /mo')}</text>
    ${joinMark}
    <path d="${area}" fill="url(#vz)"/>
    <path d="${path}" fill="none" stroke="#C9A961" stroke-width="2.5" stroke-linejoin="round"/>
    ${rx !== null ? `<circle cx="${rx.toFixed(1)}" cy="${pY.toFixed(1)}" r="5.5" fill="#C9A961" stroke="#0B1F17" stroke-width="2"/>` : ''}`;
}

/* ═══ 공유 (해시 · 19필드) ═══ */
const ci = (cat, id) => CATS[cat].findIndex((o) => o.id === id);
function encodeState() {
  return [LANGS.indexOf(lang), ['female', 'male', 'other'].indexOf(S.gender) + 1, S.age,
    S.salary, TENURES.indexOf(S.tenure), S.homeValue, S.rent, S.fixedCost, S.save, S.assets,
    ci('car', S.car), ci('home', S.home), ci('trip', S.trip),
    S.rate, COUNTRIES.indexOf(S.country),
    S.partner ? 1 : 0, S.partnerAge, S.partnerMonthly, S.tripFreq,
    S.job === 'custom' ? 11 : JOBS.findIndex((j) => j.id === S.job) + 1,
    S.events.reduce((a, v, i) => a + v * Math.pow(3, i), 0),
    screen].join('.');
}
function decodeState(str) {
  const p = str.split('.').map(Number); if (p.length < 22 || p.some(isNaN)) return;
  lang = LANGS[p[0]] || 'ko';
  S.gender = ['female', 'male', 'other'][p[1] - 1] || null;
  S.age = clamp(p[2], 15, 70);
  S.salary = clamp(p[3], 0, 2000); S.tenure = TENURES[p[4]] || 'none';
  S.homeValue = clamp(p[5], 0, 300000); S.rent = clamp(p[6], 0, 500);
  S.fixedCost = clamp(p[7], 0, 600); S.save = clamp(p[8], 0, 1200); S.assets = clamp(p[9], 0, 200000);
  S.car = (CARS[p[10]] || CARS[0]).id; S.home = (HOMES[p[11]] || HOMES[0]).id; S.trip = (TRIPS[p[12]] || TRIPS[0]).id;
  S.rate = [5, 7, 10].includes(p[13]) ? p[13] : 7;
  S.country = COUNTRIES[p[14]] || 'kr';
  S.partner = !!p[15]; S.partnerAge = clamp(p[16], 15, 80); S.partnerMonthly = clamp(p[17], 0, 1500);
  S.tripFreq = [1, 2, 6, 12].includes(p[18]) ? p[18] : 12;
  S.job = p[19] === 11 ? 'custom' : (p[19] >= 1 && p[19] <= JOBS.length ? JOBS[p[19] - 1].id : 'custom');
  if (S.job !== 'custom' && !revealed.includes(S.job)) revealed.push(S.job);
  let ec = clamp(p[20], 0, 242);
  S.events = S.events.map(() => { const v = ec % 3; ec = Math.floor(ec / 3); return v; });
  return clamp(p[21] || 0, 0, 11);
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, Math.round(v || 0))); }
function updateHash() { const u = new URL(location.href); u.hash = 'd=' + encodeState(); history.replaceState(null, '', u); }
async function share() {
  updateHash();
  try { if (navigator.share) { await navigator.share({ title: 'Dream Simulation — ARBITORIA', url: location.href }); return; } } catch (_) {}
  try { await navigator.clipboard.writeText(location.href); toast(t('toast.copied')); } catch (_) { toast(t('toast.manual')); }
}
let toastT; function toast(m) { const el = $('toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2400); }

/* ═══ 이벤트 ═══ */
let rafP = false; function schedule(fn) { if (rafP) return; rafP = true; requestAnimationFrame(() => { rafP = false; fn(); }); }

function bind() {
  document.body.addEventListener('click', (e) => {
    const lb = e.target.closest('[data-lang]'); if (lb) { applyLang(lb.dataset.lang); S.country = { ko: 'kr', en: 'us', fr: 'fr' }[lb.dataset.lang] || 'kr'; updateHash(); return; }
    const g = e.target.closest('[data-go]'); if (g) { go(+g.dataset.go); return; }
    const gd = e.target.closest('[data-gender]'); if (gd) { S.gender = gd.dataset.gender; renderGender(); updateHash(); return; }
    const jb = e.target.closest('[data-job]'); if (jb) {
      const id = jb.dataset.job;
      const j = jobOf(id);
      if (j) {
        if (!revealed.includes(id)) { revealed.push(id); lastReveal = id; }
        S.job = id; S.salary = j.sal; S.save = Math.round(j.sal * 0.3);
      }
      renderJobs(); updateHash(); return;
    }
    const ec = e.target.closest('.ev-choice'); if (ec) {
      S.events[+ec.dataset.ev] = +ec.dataset.pick;
      renderEvents(); updateHash(); return;
    }
    if (e.target.closest('#otherJobCard')) { go(3); return; }
    const tn = e.target.closest('#tenure button'); if (tn) { S.tenure = tn.dataset.tenure; [...tn.parentElement.children].forEach((x) => x.classList.toggle('on', x === tn)); syncSitOutputs(); updateHash(); return; }
    const card = e.target.closest('.card'); if (card && card.dataset.cat) { S[card.dataset.cat] = card.dataset.id; [...card.parentElement.children].forEach((x) => x.classList.toggle('on', x === card)); if (card.dataset.cat === 'trip') syncTripFreq(); updateHash(); return; }
    const fq = e.target.closest('#tripFreq button'); if (fq) { S.tripFreq = +fq.dataset.freq; syncTripFreq(); updateHash(); return; }
    const rb = e.target.closest('#rate button'); if (rb) { S.rate = +rb.dataset.rate; [...rb.parentElement.children].forEach((x) => x.classList.toggle('on', x === rb)); schedule(updateReach); updateHash(); return; }
    const cb = e.target.closest('#country button'); if (cb) { S.country = cb.dataset.country; [...cb.parentElement.children].forEach((x) => x.classList.toggle('on', x === cb)); schedule(updateReach); updateHash(); return; }
    if (e.target.closest('#partnerBtn')) {
      S.partner = !S.partner;
      if (S.partner && S.partnerAge < S.age) S.partnerAge = Math.min(80, S.age + 5);
      $('partnerBtn').classList.toggle('on', S.partner);
      $('partnerBtn').innerHTML = t(S.partner ? 'calc.partnerOn' : 'calc.partnerBtn');
      $('partnerFields').hidden = !S.partner;
      $('partnerAge').value = S.partnerAge;
      schedule(updateReach); updateHash(); return;
    }
    if (e.target.closest('#shareBtn')) { share(); return; }
    if (e.target.closest('#ctaBtn')) { window.open('https://arbitoria.com/family-office', '_blank'); return; }
  });
  document.body.addEventListener('input', (e) => {
    const el = e.target; if (el.type !== 'range') return;
    const v = +el.value;
    if (el.id === 'age') { S.age = v; $('ageBig').textContent = S.age + (lang === 'ko' ? '세' : ''); updateHash(); return; }
    if (el.id === 'customKrw' || el.id === 'customUsd' || el.id === 'customEur') {
      if (el.id === 'customKrw') S.salary = v;
      else if (el.id === 'customUsd') S.salary = Math.round(v * FX.en.rate / 10000);
      else S.salary = Math.round(v * FX.fr.rate / 10000);
      S.salary = clamp(S.salary, 50, 5000);
      S.save = Math.round(S.salary * 0.3);
      if (S.job !== 'custom') { S.job = 'custom'; renderJobs(); }
      else { syncCustomSal(); syncJobLine(); }
      updateHash(); return;
    }
    if (el.id === 'salary') S.salary = v;
    else if (el.id === 'rent') S.rent = v;
    else if (el.id === 'homeValue') S.homeValue = v;
    else if (el.id === 'fixedCost') S.fixedCost = v;
    else if (el.id === 'saveAmt') S.save = v;
    else if (el.id === 'assets') S.assets = v;
    else if (el.id === 'calcSave') { S.save = v; schedule(updateReach); updateHash(); return; }
    else if (el.id === 'partnerAge') { S.partnerAge = Math.max(S.age, v); el.value = S.partnerAge; schedule(updateReach); updateHash(); return; }
    else if (el.id === 'partnerMonthly') { S.partnerMonthly = v; schedule(updateReach); updateHash(); return; }
    else return;
    syncSitOutputs(); updateHash();
  });

  // 직접 핸들러 (위임 실패 대비)
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); applyLang(b.dataset.lang); S.country = { ko: 'kr', en: 'us', fr: 'fr' }[b.dataset.lang] || 'kr'; updateHash(); }));
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); go(+b.dataset.go); }));
}

/* 엔진 검증 (GAME_HANDOFF §10 예제 — 콘솔에서 __validate()) */
window.__validate = function () {
  return {
    mortgage_256k_3p5_25: Math.round(mortgage(256000, 3.5, 25)),      // ≈1282
    split_interest: Math.round(splitPayment(256000, 3.5, 25).interest), // ≈747
    split_principal: Math.round(splitPayment(256000, 3.5, 25).principal), // ≈535
    fv_28k_600_5_396: Math.round(fv(28000, 600, 5, 396)),             // ≈748536
  };
};

function init() {
  const h = location.hash.match(/d=([\d.]+)/); let start = 0;
  if (h) { const s = decodeState(h[1]); if (s !== undefined) start = s; }
  applyLang(lang); bind(); go(start || 0);
  loadFx();
}
init();
