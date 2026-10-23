// Kiểm mig mastery bản đồ mới (202610231446) TRONG ROLLBACK: node scripts/_test_mastery_bdm.mjs [--mig]
// 1) công tắc TẮT ⇒ fn_mastery_cells trùng khít bản cũ · 2) fn_mastery_cells_bdm: K6–12 ra NDB, cấp 1 giữ mã cũ
// 3) bật công tắc ⇒ fn_mastery_cells = fn_mastery_cells_bdm + có log · 4) thời gian
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const khoa = (r) => `${r.hoc_sinh_id}|${r.ma_dang}|${Number(r.score).toFixed(6)}|${r.n}|${r.muc}|${r.tin}`
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  // mẫu HS có lượt đo: 150 HS K6–12 + 40 HS cấp 1
  const hs = (await q(`select id from hoc_sinh where khoi in ('6','7','8','9','10','11','12') and exists (select 1 from gami_grades g where g.hoc_sinh_id = hoc_sinh.id) order by id limit 150`)).map((r) => r.id)
  const hs1 = (await q(`select id from hoc_sinh where khoi in ('3','4','4T','5','5T') and exists (select 1 from gami_grades g where g.hoc_sinh_id = hoc_sinh.id) order by id limit 40`)).map((r) => r.id)
  const tat = [...hs, ...hs1]
  const truoc = (await q(`select * from fn_mastery_cells($1, true)`, [tat])).map(khoa).sort()
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610231446_mastery_ban_do_moi_loi.sql', 'utf8'))
  let t0 = Date.now()
  const sau = (await q(`select * from fn_mastery_cells($1, true)`, [tat])).map(khoa).sort()
  const tCu = Date.now() - t0
  kt(truoc.length === sau.length && truoc.every((x, i) => x === sau[i]), `công tắc TẮT ⇒ trùng khít bản cũ (${truoc.length} ô, ${tCu} ms)`)
  t0 = Date.now()
  const moi = await q(`select * from fn_mastery_cells_bdm($1, true)`, [tat])
  const tMoi = Date.now() - t0
  const moi612 = moi.filter((r) => hs.includes(r.hoc_sinh_id)), moi1 = moi.filter((r) => hs1.includes(r.hoc_sinh_id))
  const cu612 = sau.filter((k) => hs.includes(k.split('|')[0])).length
  kt(moi612.length > 0 && !moi612.some((r) => /^T1\d/.test(r.ma_dang))   /* không còn mã dạng ĐẠI cũ; HGT cũ không có mã câu (T3…) chấp nhận giữ */, `K6–12: ${moi612.filter((r) => /^NDB/.test(r.ma_dang)).length}/${moi612.length} ô là dạng bài NDB (bản cũ ${cu612} ô) — ${tMoi} ms`)
  console.log('     ô K6–12 không phải NDB (Hình/nhánh khác):', [...new Set(moi612.filter((r) => !/^NDB/.test(r.ma_dang)).map((r) => r.ma_dang.slice(0, 4)))].join(', '))
  const cu1 = sau.filter((k) => hs1.includes(k.split('|')[0])).sort(), moi1k = moi1.map(khoa).sort()
  kt(cu1.length === moi1k.length && cu1.every((x, i) => x === moi1k[i]), `cấp 1 giữ nguyên bản đồ cũ (${cu1.length} ô)`)
  await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const bat = (await q(`select * from fn_mastery_cells($1, true)`, [tat])).map(khoa).sort()
  const moiK = moi.map(khoa).sort()
  kt(bat.length === moiK.length && bat.every((x, i) => x === moiK[i]), 'bật công tắc ⇒ fn_mastery_cells = bản đồ mới')
  const [lg] = await q(`select count(*)::int n from he_thong_cong_tac_log where ma = 'mastery_ban_do_moi' and moi = true and cu = false`)
  kt(lg.n === 1, 'có 1 dòng lịch sử bật công tắc')
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
