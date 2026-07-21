/* 드림시뮬레이션 — 수집 API (익명 꿈 데이터 → D1) */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/dream' && request.method === 'POST') {
      try {
        const d = await request.json();
        const s = (v, max) => (typeof v === 'string' ? v.slice(0, max || 32) : null);
        const n = (v, lo, hi) => (Number.isFinite(+v) ? Math.max(lo, Math.min(hi, Math.round(+v))) : null);
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

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const row = await env.DB.prepare('SELECT COUNT(*) AS total FROM dreams').first();
      return new Response(JSON.stringify({ total: row.total }), { headers: { 'content-type': 'application/json' } });
    }

    return env.ASSETS.fetch(request);
  },
};
