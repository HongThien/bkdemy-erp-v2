// Test mig 202611041715 (BTVN app cấp 3 tự đóng khi hết hạn) — 1 transaction rồi ROLLBACK.  node scripts/_test_btvn_app_cap3.mjs [--da-ap]
import pg from 'pg'; import fs from 'node:fs'
const MIG = 'supabase/migrations/202611041715_btvn_app_cap3_tu_dong_khi_het_han.sql'
const url = fs.readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url}); await c.connect()
const q = async (s,a)=>(await c.query(s,a)).rows
let ok = 0, fail = 0
const kiem = (t, d, x = '') => { if (d) { ok++; console.log('  ✔', t) } else { fail++; console.log('  ✘', t, x) } }
const f = (d) => d ? new Date(d).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).replace(/:\d\d /, ' ') : ''
const BUOI = `select b.id, l.ten_lop, b.ngay, b.btvn_dong_at, t.deadline,
   (select count(*) from btvn_ket_qua k where k.buoi_hoc_id=b.id and k.trang_thai_nop is not null)::int tick
   from buoi_hoc b join lop l on l.id=b.lop_id and l.khoi in ('10','11','12')
   join lateral (select * from bai_test bt where bt.lop_id=b.lop_id and bt.ngay=b.ngay and bt.loai='btvn' and bt.hoc_sinh_id is null order by created_at desc limit 1) t on true
   where b.loai='thuong' and b.trang_thai<>'huy' and t.deadline <= now() and b.ngay >= current_date - 30 order by b.ngay, l.ten_lop`
try {
  await q('begin'); await q(`set local statement_timeout='120s'`)
  const truoc = await q(BUOI)
  const kqTruoc = await q(`select k.* from btvn_ket_qua k where k.buoi_hoc_id = any($1)`, [truoc.map((b) => b.id)])
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync(MIG, 'utf8'))
  // wrapper giữ hành vi cũ: buổi đã đóng ⇒ daDong
  const daDong = truoc.find((b) => b.btvn_dong_at)
  if (daDong) kiem('fn_btvn_online_dong_bo (wrapper) với buổi đã đóng vẫn trả daDong', (await q(`select fn_btvn_online_dong_bo($1) j`, [daDong.id]))[0].j.daDong === true)
  const [{ j: lan1 }] = await q(`select _btvn_app_tu_dong() j`)
  console.log('   lượt 1:', JSON.stringify(lan1))
  const sau = await q(BUOI)
  const kqSau = await q(`select k.* from btvn_ket_qua k where k.buoi_hoc_id = any($1)`, [sau.map((b) => b.id)])
  console.table(sau.map((b) => { const t = truoc.find((x) => x.id === b.id); return { lop: b.ten_lop, ngay: b.ngay.toLocaleDateString('vi-VN'), han: f(b.deadline), dong_truoc: f(t.btvn_dong_at), dong_sau: f(b.btvn_dong_at), tick: `${t.tick}→${b.tick}` } }))
  const moiDong = sau.filter((b) => b.btvn_dong_at && !truoc.find((x) => x.id === b.id).btvn_dong_at)
  kiem(`buổi tự đóng có giờ đóng = đúng giờ hạn (${moiDong.length} buổi)`, moiDong.every((b) => +new Date(b.btvn_dong_at) === +new Date(b.deadline)))
  // không đè ô TA đã tick: mọi trạng thái/thái độ đã có trước giữ nguyên, trừ 'khong_lam' → nộp
  const doiSai = kqTruoc.filter((k) => { const s = kqSau.find((x) => x.hoc_sinh_id === k.hoc_sinh_id && x.buoi_hoc_id === k.buoi_hoc_id)
    return (k.trang_thai_nop && k.trang_thai_nop !== 'khong_lam' && s.trang_thai_nop !== k.trang_thai_nop) || (k.thai_do && s.thai_do !== k.thai_do) })
  kiem('không đè trạng thái / thái độ TA đã tick (trừ "Không làm bài" → có nộp)', doiSai.length === 0, JSON.stringify(doiSai.slice(0, 3)))
  const doiKL = kqTruoc.filter((k) => k.trang_thai_nop === 'khong_lam' && kqSau.find((x) => x.hoc_sinh_id === k.hoc_sinh_id && x.buoi_hoc_id === k.buoi_hoc_id).trang_thai_nop !== 'khong_lam')
  console.log(`   "Không làm bài" có bài làm app ⇒ đổi sang nộp: ${doiKL.length}`)
  // luật thái độ: em có làm mà chưa đủ câu, thái độ máy ghi = chua_nghiem_tuc
  const moi = kqSau.filter((k) => !kqTruoc.some((x) => x.hoc_sinh_id === k.hoc_sinh_id && x.buoi_hoc_id === k.buoi_hoc_id && x.trang_thai_nop === k.trang_thai_nop && x.thai_do === k.thai_do))
  const dem = {}; for (const k of moi) { const key = `${k.trang_thai_nop}/${k.thai_do ?? '-'}`; dem[key] = (dem[key] ?? 0) + 1 }
  console.log('   dòng kết quả máy ghi/đổi:', JSON.stringify(dem))
  const [{ j: lan2 }] = await q(`select _btvn_app_tu_dong() j`)
  kiem(`lượt 2 không đổi gì (${JSON.stringify(lan2)})`, lan2.dong === 0 && lan2.hs_ghi === 0)
  const quyen = await q(`select has_function_privilege('authenticated', '_btvn_app_tu_dong()', 'execute') a, has_function_privilege('anon', '_btvn_online_dong_bo_core(uuid,boolean)', 'execute') b`)
  kiem('người dùng app không tự gọi được job; anon không gọi được lõi', !quyen[0].a && !quyen[0].b, JSON.stringify(quyen))
} catch (e) { fail++; console.log('  ✘ LỖI', e.message) }
finally { await q('rollback'); await c.end(); console.log(`\n${ok} ✔ · ${fail} ✘ (ROLLBACK)`); process.exit(fail ? 1 : 0) }
