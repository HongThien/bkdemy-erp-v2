// Kiểm fn_tong_quan_hs (mig 202610261821) TRONG ROLLBACK: node scripts/_test_tong_quan_hs.mjs [apply]
//   apply = áp file migration trong transaction (trước khi migrate thật); bỏ trống khi hàm đã có trên DB.
// ① hoàn thành toàn bộ (không lọc tháng) = đếm đúng ô mastery của `_mastery_cells_core` (cùng công thức) trên dạng của môn — TẮT và BẬT
// ② cấp 1: BẬT y hệt TẮT · ③ BẬT: K6–12 có dạng bài NDB, CB/NC chỉ gồm dạng bài đã có độ khó · ④ tốc độ 1 HS + cả lớp (Report PH in cả lớp).
// So với getTongQuanHS JS cũ: đã chạy 1 lần lúc chuyển (26/10, xem DEVLOG) — luật cũ trên cùng nguồn đo khớp 36/36 (TẮT) · 36/36 (BẬT).
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
const LOP = ['6A3', '7S2', '8A2', '9A2', '10B1', '11A1', '12B1', '3A1', '5A1']
const YM = ['2026-10', '2026-09']
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [J({ sub: ad.id, role: 'authenticated' })])
  if (process.argv[2] === 'apply') await q(fs.readFileSync('supabase/migrations/202610261821_fn_tong_quan_hs_ban_do_moi.sql', 'utf8'))
  // mỗi lớp: em có nhiều lượt chấm nhất
  const hs = await q(`select distinct on (l.ten_lop) l.ten_lop, h.id, h.khoi from lop l join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
                        join hoc_sinh h on h.id = hl.hoc_sinh_id where l.ten_lop = any($1) and l.mon = 'Toán'
                       order by l.ten_lop, (select count(*) from gami_grades g where g.hoc_sinh_id = h.id) desc`, [LOP])
  const tq = async (id, ym) => (await q('select fn_tong_quan_hs($1, $2, $3) x', [id, 'Toán', ym]))[0].x
  const kq = {}
  for (const bat of [false, true]) {
    await q("update he_thong_cong_tac set bat = $1 where ma = 'mastery_ban_do_moi'", [bat])
    const nhan = bat ? 'BẬT' : 'TẮT'
    let khop = 0
    for (const h of hs) {
      const x = await tq(h.id, null)
      kq[`${bat}|${h.id}|null`] = x
      for (const ym of YM) kq[`${bat}|${h.id}|${ym}`] = await tq(h.id, ym)
      const dem = async (btvn) => (await q(`select count(*) filter (where o.muc = 'dat')::int dat, count(*) filter (where o.muc = 'can_luyen')::int can_luyen,
                                                    count(*) filter (where o.muc = 'yeu')::int yeu, count(*)::int total
                                               from _mastery_cells_core(_mastery_bdm_bat(), array[$1]::uuid[], $2) o
                                              where o.ma_dang in (select ma_dang from _tq_dang_info('Toán', (select array_agg(ma_dang) from _mastery_lan_do(_mastery_bdm_bat(), array[$1]::uuid[], true))))`, [h.id, btvn]))[0]
      const [a, b] = [await dem(false), await dem(true)]
      const bo = (k) => ({ dat: k.dat, can_luyen: k.can_luyen, yeu: k.yeu, total: k.total })
      if (J(bo(x.hoanThanh.toanBo.etMt)) === J(a) && J(bo(x.hoanThanh.toanBo.coBTVN)) === J(b)) khop++
      else console.log('    lệch', h.ten_lop, J(x.hoanThanh.toanBo), J(a), J(b))
    }
    kt(khop === hs.length, `${nhan}: hoàn thành toàn bộ (etMt + coBTVN) = đếm ô _mastery_cells_core — ${khop}/${hs.length} lớp`)
  }
  const cap1 = hs.filter((h) => ['3', '4', '4T', '5', '5T'].includes(h.khoi))
  kt(cap1.length > 0 && cap1.every((h) => [null, ...YM].every((ym) => J(kq[`false|${h.id}|${ym}`]) === J(kq[`true|${h.id}|${ym}`]))),
    `cấp 1 (${cap1.map((h) => h.ten_lop).join(', ')}): BẬT y hệt TẮT`)
  // BẬT: dạng của K6–12 là dạng bài NDB; CB/NC chỉ gồm dạng có độ khó
  const c612 = hs.filter((h) => !['3', '4', '4T', '5', '5T'].includes(h.khoi))
  let coNdb = 0, cbncDung = 0
  for (const h of c612) {
    const [r] = await q(`select count(*) filter (where d.ma_dang like 'NDB%')::int ndb, count(*) filter (where d.muc_do_bc is not null)::int co_do_kho
                           from _tq_dang_info('Toán', (select array_agg(ma_dang) from _mastery_lan_do(true, array[$1]::uuid[], true))) d`, [h.id])
    const x = kq[`true|${h.id}|null`].hoanThanh
    const cbnc = ['daiCoBan', 'daiNangCao', 'hinhCoBan', 'hinhNangCao'].reduce((s, k) => s + x[k].coBTVN.total, 0)
    if (r.ndb > 0) coNdb++
    if (cbnc === r.co_do_kho) cbncDung++
    console.log(`    ${h.ten_lop}: ${r.ndb} dạng bài NDB · ${r.co_do_kho} dạng có độ khó = Σ CB/NC ${cbnc} · toàn bộ ${x.toanBo.coBTVN.total}`)
  }
  kt(coNdb === c612.length && cbncDung === c612.length, `BẬT: K6–12 đo theo dạng bài NDB, Σ ô CB/NC = số dạng có độ khó (${cbncDung}/${c612.length})`)
  // tốc độ: cả lớp 11A1 + 8A2, tháng hiện tại (Report PH in cả lớp)
  for (const ten of ['11A1', '8A2']) {
    const ids = (await q(`select hl.hoc_sinh_id id from lop l join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc' where l.ten_lop = $1 and l.mon = 'Toán'`, [ten])).map((r) => r.id)
    const t = Date.now(); let max = 0
    for (const id of ids) { const t1 = Date.now(); await tq(id, '2026-10'); max = Math.max(max, Date.now() - t1) }
    const ms = Date.now() - t
    kt(max < 2000, `BẬT ${ten}: ${ids.length} em · tổng ${ms} ms (tuần tự) · chậm nhất ${max} ms/em`)
  }
} catch (e) { sai++; console.log('  ✘ LỖI', e.message, e.where ?? '') } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
