import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR; const AP = process.argv.includes('--chi-ghi');
const sql = `-- ĐỢT 2 — BƯỚC 2b (13/11/2026): view bdm_cau_dang đọc BẢNG TRA SẴN kho_cau_dang thay cho UNION 8 nhánh (mig 202611132043 đã dựng bảng + trigger, khớp từng dòng).
-- Giữ nguyên 4 cột và phạm vi (kho dai + hgt) ⇒ view bdm_cau_hoi, _do_o_bdm, _do_o_bdm_core… không phải sửa.
-- Hoàn tác: dựng lại view theo định nghĩa cũ (lưu trong lịch sử schema.md trước commit này).
create or replace view public.bdm_cau_dang with (security_invoker = on) as
  select t.ma_cau, t.kho, t.dang_bai_id, t.nguon
    from public.kho_cau_dang t
   where t.kho in ('dai', 'hgt');
`;
fs.writeFileSync(S + '/view.sql', sql);
if (AP) process.exit(0);
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const do_ = async (q, p, lan = 3) => { let best = 1e9, v; for (let i = 0; i < lan; i++) { const t = Date.now(); v = await one(q, p); best = Math.min(best, Date.now() - t); } return [best, v]; };
const bl = async (q, p) => { const r = await c.query('explain (analyze, buffers, format json) ' + q, p); const pl = r.rows[0]['QUERY PLAN'][0]; return { ms: Math.round(pl['Execution Time']), blk: (pl.Plan['Shared Hit Blocks'] || 0) + (pl.Plan['Shared Read Blocks'] || 0) }; };
try {
  await c.query('begin');
  const ns = (await one(`select t.id from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai='dang_lam' and n.la_admin_he_thong limit 1`)).id;
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: ns })]);
  const mas = (await c.query(`select ma_cau from dai_cau_hoi where xoa_at is null order by md5(ma_cau) limit 30`)).rows.map(r => r.ma_cau);
  const dang = (await one(`select dang_bai_id from kho_cau_dang where kho='dai' group by 1 order by count(*) desc limit 1`)).dang_bai_id;
  const Q = {
    'đọc 30 câu theo mã qua bdm_cau_hoi': [`select count(*)::int n, md5(string_agg(md5(to_jsonb(x)::text), ',' order by x.ma_cau)) h from public.bdm_cau_hoi x where x.ma_cau = any($1)`, [mas]],
    'câu của 1 dạng bài qua bdm_cau_hoi': [`select count(*)::int n, md5(string_agg(x.ma_cau, ',' order by x.ma_cau)) h from public.bdm_cau_hoi x where x.dang_chinh = $1`, [dang]],
    'đếm cả bdm_cau_hoi': [`select count(*)::int n from public.bdm_cau_hoi`, []],
    '_do_o_bdm cho 30 câu': [`select count(*)::int n, md5(string_agg(coalesce(public._do_o_bdm(m, null)::text, '∅'), ',' order by m)) h from unnest($1::text[]) m`, [mas]],
  };
  const fp = async () => one(`select count(*)::int n, md5(string_agg(md5(to_jsonb(x)::text), ',' order by x.kho, x.ma_cau)) h from public.bdm_cau_dang x`);
  const fph = async () => one(`select count(*)::int n, md5(string_agg(h, ',' order by h)) h from (select md5(to_jsonb(x)::text) h from public.bdm_cau_hoi x) y`);
  const truoc = {}, sau = {};
  const fT = await fp(), hT = await fph();
  for (const [k, [q, p]] of Object.entries(Q)) { let e = null; try { e = await bl(q, p); } catch (er) { e = { loi: er.message.slice(0, 80) }; } truoc[k] = { ...(await do_(q, p))[1], ...e }; }
  await c.query(sql);
  const fS = await fp(), hS = await fph();
  for (const [k, [q, p]] of Object.entries(Q)) { let e = null; try { e = await bl(q, p); } catch (er) { e = { loi: er.message.slice(0, 80) }; } sau[k] = { ...(await do_(q, p))[1], ...e }; }
  console.log('view bdm_cau_dang  trước', fT.n, '→ sau', fS.n, fT.h === fS.h ? 'NỘI DUNG KHỚP' : 'LỆCH');
  console.log('view bdm_cau_hoi   trước', hT.n, '→ sau', hS.n, hT.h === hS.h ? 'NỘI DUNG KHỚP (mọi cột, mọi dòng)' : 'LỆCH');
  for (const k of Object.keys(Q)) { const a = truoc[k], b = sau[k]; console.log('  ' + k.padEnd(40), 'kết quả', (a.n === b.n && a.h === b.h) ? 'khớp' : 'LỆCH', '|', a.ms + ' ms / ' + a.blk + ' blk', '→', b.ms + ' ms / ' + b.blk + ' blk'); }
  const opt = await one(`select coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') inv from pg_class c where c.relname='bdm_cau_dang'`); console.log('security_invoker sau khi đổi:', opt.inv);
} catch (e) { console.log('!!! LỖI:', e.code, e.message, (e.where || '').slice(0, 200)); }
finally { await c.query('rollback'); await c.end(); console.log('ĐÃ ROLLBACK'); }
