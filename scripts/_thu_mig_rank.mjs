// Chạy thử mig 202609281711_rank_thu_thach trong 1 transaction rồi ROLLBACK — không ghi DB thật.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const l of readFileSync('.env', 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
const c = new pg.Client({ connectionString: env.DATABASE_URL })
c.on('error', (e) => console.log('pg error', e.message)); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const T = (rows) => console.table(rows)
try {
  await c.query('begin')
  let t = Date.now()
  await c.query(readFileSync('supabase/migrations/202609281711_rank_thu_thach.sql', 'utf8'))
  console.log('mig OK', Date.now() - t, 'ms')

  console.log('① MT tháng 2026-08, khối 9 (top 5 + cuối)')
  const mt = await q(`select * from fn_mt_hang_thang('Toán','2026-08') where khoi='9' order by hang`)
  T([...mt.slice(0, 5), ...mt.slice(-2)].map(r => ({ khoi: r.khoi, tb: r.tb, hang: r.hang, so_em: r.so_em, hq: r.hang_quy, diem: r.diem_bang })))

  console.log('② Sự kiện theo nguồn × tháng (Toán, 07→09)')
  t = Date.now()
  T(await q(`select thang, nguon, count(*)::int n, sum(diem)::int tong, count(distinct hoc_sinh_id)::int hs from fn_rank_su_kien('Toán','2026-07','2026-09') group by 1,2 order by 1,2`))
  console.log('  ', Date.now() - t, 'ms')

  console.log('③ Rank mùa khối 7 hôm nay — phân bố bậc + top 5')
  t = Date.now()
  const rk = await q(`select * from fn_rank_mua('Toán','7')`)
  console.log('  ', Date.now() - t, 'ms, số em', rk.length)
  const pb = {}; for (const r of rk) { const k = r.ghe ?? `${r.bac} ${r.ten_bac}`; pb[k] = (pb[k] ?? 0) + 1 }; console.log('  ', pb)
  T(rk.slice(0, 5).map(r => ({ ten: r.ho_ten, lop: r.ten_lop, diem: r.diem_mua, bac: r.ten_bac, sao: r.sao, ghe: r.ghe, hang: r.hang_khoi, pd: r.phong_do })))

  console.log('④ Rank mùa khối 9 tại 31/08 (sau 2 tháng)')
  const rk9 = await q(`select * from fn_rank_mua('Toán','9','2026-08-31')`)
  const pb9 = {}; for (const r of rk9) { const k = r.ghe ?? `${r.bac} ${r.ten_bac}`; pb9[k] = (pb9[k] ?? 0) + 1 }; console.log('  ', pb9)
  T(rk9.slice(0, 3).map(r => ({ diem: r.diem_mua, bac: r.ten_bac, sao: r.sao, ghe: r.ghe, pd: r.phong_do })))

  console.log('⑤ Đua tháng 2026-08 khối 7 top 5')
  T((await q(`select * from fn_rank_dua_thang('Toán','7','2026-08') limit 5`)).map(r => ({ ten: r.ho_ten, d: r.diem_thang, hang: r.hang, n: r.so_em_co_diem, et: r.et, btvn: r.btvn, mt: r.mt, tt: r.thu_thach })))

  console.log('⑥ Thử thách: giả lập 1 HS làm 3 lượt (10/10 · 8/10 · 6/10) + 1 lượt nữa để chạm trần ngày')
  const hs = (await q(`select hl.hoc_sinh_id, tk.id tk from hoc_sinh_lop hl join lop l on l.id=hl.lop_id join tai_khoan tk on tk.hoc_sinh_id=hl.hoc_sinh_id
                        join lateral (select 1 from bai_test bt where bt.hoc_sinh_id=hl.hoc_sinh_id and bt.loai='tu_luyen' limit 1) x on true
                        where hl.trang_thai='dang_hoc' and l.mon='Toán' and l.khoi='7' limit 1`))[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk, role: 'authenticated' })])
  const dangs = (await q(`select array_agg(distinct btc.ma_dang) d from bai_test bt join bai_test_cau btc on btc.bai_test_id=bt.id where bt.hoc_sinh_id=$1 and bt.loai='tu_luyen' and btc.ma_dang is not null`, [hs.hoc_sinh_id]))[0].d.slice(0, 10)
  const luot = async (soDung) => {
    const v = (await q(`select thu_thach_sinh('Toán', $1::jsonb) v`, [JSON.stringify(Array.from({ length: 10 }, (_, i) => dangs[i % dangs.length]))]))[0].v
    const bt = v.bai_test_id
    const bl = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id) values ($1,$2) returning id`, [bt, hs.hoc_sinh_id]))[0].id
    const caus = await q(`select id, loai_cau, dap_an_key from bai_test_cau where bai_test_id=$1 order by thu_tu`, [bt])
    let i = 0
    for (const cau of caus) {
      const dung = i++ < soDung
      const k = String(cau.dap_an_key).replace(/"/g, '').trim().toUpperCase().charCodeAt(0) - 65
      // câu SAI nhưng ghi verdict 'correct' ⇒ kiểm server đếm lại chứ không tin client
      await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, cham_boi) values ($1,$2,$3::jsonb,'correct','exact')`,
        [bl, cau.id, JSON.stringify(dung ? k : (k + 1) % 4)])
    }
    return { so_cau: caus.length, kq: (await q(`select fn_hs_thu_thach_ket_qua($1) v`, [bt]))[0].v }
  }
  for (const s of [10, 8, 6, 9]) { const r = await luot(s); console.log(`   làm đúng ${s}/${r.so_cau} →`, JSON.stringify(r.kq)) }
  console.log('   luot_do:', (await q(`select thu_thach_luot_do('Toán') v`))[0].v)
  t = Date.now(); const me = (await q(`select fn_hs_rank_cua_toi('Toán') v`))[0].v; console.log('   fn_hs_rank_cua_toi', Date.now() - t, 'ms')
  console.log('⑦ fn_hs_rank_cua_toi:', JSON.stringify({ toi: me.toi, dua: me.dua_thang, tt: me.thu_thach, top1: me.top_mua[0] }))
  console.log('   anon execute?', (await q(`select has_function_privilege('anon','public.fn_hs_rank_cua_toi(text)','execute') a`))[0].a)
} catch (e) { console.log('LỖI:', e.message, e.where ?? '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong') }
