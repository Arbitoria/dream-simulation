/* 드림시뮬레이션 — 수집 API (익명 꿈 데이터 → D1) */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/dream' && request.method === 'POST') {
      try {
        const d = await request.json();
        const s = (v, max) => (typeof v === 'string' ? v.slice(0, max || 32) : null);
        const n = (v, lo, hi) => (Number.isFinite(+v) ? Math.max(lo, Math.min(hi, Math.round(+v))) : null);
        // 중복 방어: 최근 10분 내 동일한 꿈(주요 필드 일치)은 저장하지 않음 — IP 없이 하는 프라이버시 클린 dedupe
        const dup = await env.DB.prepare(
          `SELECT COUNT(*) AS c FROM dreams WHERE created_at > datetime('now','-10 minutes')
           AND age IS ? AND salary IS ? AND car IS ? AND home IS ? AND trip IS ? AND seed IS ?`
        ).bind(n(d.age, 10, 100), n(d.salary, 0, 100000), s(d.car), s(d.home), s(d.trip), n(d.seed, 0, 100000000)).first();
        if (dup && dup.c > 0) return new Response(JSON.stringify({ ok: true, dedup: true }), { headers: { 'content-type': 'application/json' } });
        await env.DB.prepare(
          `INSERT INTO dreams (lang, gender, age, job, salary, save, tenure, assets,
             car, home, trip, trip_freq, rate, country,
             partner, partner_age, partner_monthly, events, happiness, reach_age, seed)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        ).bind(
          s(d.lang), s(d.gender), n(d.age, 10, 100),
          s(d.job), n(d.salary, 0, 100000), n(d.save, 0, 100000), s(d.tenure), n(d.assets, 0, 10000000),
          s(d.car), s(d.home), s(d.trip), n(d.tripFreq, 1, 24),
          n(d.rate, 0, 30), s(d.country),
          d.partner ? 1 : 0, n(d.partnerAge, 0, 100), n(d.partnerMonthly, 0, 100000),
          s(JSON.stringify(d.events || []), 40), n(d.happiness, 0, 10), n(d.reachAge, 0, 200), n(d.seed, 0, 100000000)
        ).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'content-type': 'application/json' } });
      }
    }

    /* 환율: 매달 첫 요청 때 ECB(frankfurter) 시세를 받아 D1에 캐시 */
    if (url.pathname === '/api/fx' && request.method === 'GET') {
      const month = new Date().toISOString().slice(0, 7);
      let row = null;
      try { row = await env.DB.prepare('SELECT month, usd_krw, eur_krw FROM fx WHERE month = ?').bind(month).first(); } catch (_) {}
      if (!row) {
        try {
          const r = await fetch('https://api.frankfurter.dev/v1/latest?base=KRW&symbols=USD,EUR');
          const j = await r.json();
          if (j && j.rates && j.rates.USD && j.rates.EUR) {
            const usd_krw = Math.round(1 / j.rates.USD * 100) / 100;
            const eur_krw = Math.round(1 / j.rates.EUR * 100) / 100;
            await env.DB.prepare('INSERT OR REPLACE INTO fx (month, usd_krw, eur_krw, updated) VALUES (?,?,?,datetime(\'now\'))')
              .bind(month, usd_krw, eur_krw).run();
            row = { month, usd_krw, eur_krw };
          }
        } catch (_) {}
      }
      if (!row) row = { month, usd_krw: 1400, eur_krw: 1500 }; // 폴백
      return new Response(JSON.stringify(row), {
        headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=86400' },
      });
    }

    /* 익명 시작 신호 — 완주율 측정용 (kind·lang만 저장) */
    if (url.pathname === '/api/ping' && request.method === 'POST') {
      try {
        const d = await request.json();
        const kind = d.kind === 'start' ? 'start' : 'other';
        const lg = typeof d.lang === 'string' ? d.lang.slice(0, 8) : null;
        await env.DB.prepare('INSERT INTO pings (kind, lang) VALUES (?, ?)').bind(kind, lg).run();
      } catch (_) {}
      return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const [row, st] = await Promise.all([
        env.DB.prepare('SELECT COUNT(*) AS total FROM dreams').first(),
        env.DB.prepare("SELECT COUNT(*) AS starts FROM pings WHERE kind = 'start'").first(),
      ]);
      const completion = st.starts > 0 ? Math.round(row.total / st.starts * 100) : null;
      return new Response(JSON.stringify({ total: row.total, starts: st.starts, completion_pct: completion }), { headers: { 'content-type': 'application/json' } });
    }

    /* Dream Index — 익명 꿈들의 집계 (개인 단위 데이터는 절대 반환하지 않음) */
    if (url.pathname === '/api/insights' && request.method === 'GET') {
      const [summary, cities, cars, trips, countries, rates, tenures, happy] = await Promise.all([
        env.DB.prepare(`SELECT COUNT(*) AS total,
            ROUND(AVG(age),1) AS avg_age,
            ROUND(AVG(salary),0) AS avg_salary,
            ROUND(AVG(CASE WHEN salary>0 THEN CAST(save AS REAL)/salary*100 END),1) AS avg_save_pct,
            ROUND(AVG(reach_age),1) AS avg_reach,
            ROUND(AVG(happiness),1) AS avg_happy,
            ROUND(AVG(seed),0) AS avg_seed,
            ROUND(AVG(partner)*100,0) AS partner_pct
          FROM dreams`).first(),
        env.DB.prepare(`SELECT home AS k, COUNT(*) AS c FROM dreams WHERE home IS NOT NULL GROUP BY home ORDER BY c DESC LIMIT 10`).all(),
        env.DB.prepare(`SELECT car AS k, COUNT(*) AS c FROM dreams WHERE car IS NOT NULL GROUP BY car ORDER BY c DESC LIMIT 10`).all(),
        env.DB.prepare(`SELECT trip AS k, COUNT(*) AS c FROM dreams WHERE trip IS NOT NULL GROUP BY trip ORDER BY c DESC LIMIT 10`).all(),
        env.DB.prepare(`SELECT country AS k, COUNT(*) AS c FROM dreams WHERE country IS NOT NULL GROUP BY country ORDER BY c DESC`).all(),
        env.DB.prepare(`SELECT rate AS k, COUNT(*) AS c FROM dreams WHERE rate IS NOT NULL GROUP BY rate ORDER BY c DESC`).all(),
        env.DB.prepare(`SELECT tenure AS k, COUNT(*) AS c FROM dreams WHERE tenure IS NOT NULL GROUP BY tenure ORDER BY c DESC`).all(),
        env.DB.prepare(`SELECT happiness AS k, COUNT(*) AS c FROM dreams WHERE happiness IS NOT NULL GROUP BY happiness ORDER BY k`).all(),
      ]);
      return new Response(JSON.stringify({
        summary,
        cities: cities.results, cars: cars.results, trips: trips.results,
        countries: countries.results, rates: rates.results, tenures: tenures.results, happy: happy.results,
      }), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' } });
    }

    return env.ASSETS.fetch(request);
  },
};
