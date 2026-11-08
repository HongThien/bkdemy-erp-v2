// ============================================================================
// duyet-4t-tbc.mjs — DUYỆT NỘI DUNG 27 câu gốc (CĐ13 Trung bình cộng, sách Toán arc 4 Q1) + mọi clone «Clone 4T TBC c1» — Thùy 24/10:
// "auto duyệt 27 câu gốc đi và duyệt luôn clone đi. bài dễ nên m clone là ok rồi".
//   node scripts/kho/duyet-4t-tbc.mjs [--ghi]     (không --ghi = chạy thử rồi ROLLBACK)
// Cách duyệt = đường của `_duyet_nhom_tron_xoay.mjs`: bật cờ phiên kho.duyet_noi_dung (câu còn ở dạng chờ vẫn duyệt được NỘI DUNG; dạng
// do bản đồ mới gán riêng), ghi duyet_boi = tài khoản admin. duyet_nguon = 'may' (duyệt tự động theo lệnh CEO, KHÔNG phải người đọc
// từng câu — đừng khai 'nguoi'). Bỏ qua + liệt kê: câu đã xoá, câu TN/TLN thiếu đáp án, câu kiem_may ≠ 'khop' (chỉ gặp ở gốc, nếu có).
// ============================================================================
import pg from 'pg'
import fs from 'node:fs'

const GHI = process.argv.includes('--ghi')
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const goc = JSON.parse(fs.readFileSync('kho-rules/dai/lo/b3/k4T-tbc/lo-01.json', 'utf8')).map((x) => x.ma_cau)
if (goc.length !== 27 || goc.some((m) => !/^T14T000000\d{3}$/.test(m))) throw new Error(`lo-01.json: mong 27 mã gốc dạng T14T000000nnn, được ${goc.length}`)
try {
  await q('begin')
  const [ad] = await q("select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const ds = await q(`select ma_cau, loai_cau, da_duyet, kiem_may, ten_de_goc,
       (loai_cau in ('trac_nghiem','tra_loi_ngan') and coalesce(btrim(dap_an), '') = '') thieu_da,
       (coalesce(btrim(loi_giai), '') = '') thieu_lg
     from dai_cau_hoi where xoa_at is null and (ma_cau = any($1) or ten_de_goc like 'Clone 4T TBC c1 · %')`, [goc])
  const nGoc = ds.filter((x) => goc.includes(x.ma_cau)).length
  const bo = ds.filter((x) => x.thieu_da || x.thieu_lg || (x.kiem_may && x.kiem_may !== 'khop'))
  const boSet = new Set(bo.map((x) => x.ma_cau))
  const chua = ds.filter((x) => !x.da_duyet && !boSet.has(x.ma_cau)).map((x) => x.ma_cau)
  await q(`select set_config('kho.duyet_noi_dung', 'on', true)`)
  const xong = await q(`update dai_cau_hoi set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = 'may' where ma_cau = any($1) and not da_duyet returning ma_cau`, [chua, ad.nhan_su_id])
  await q(`select set_config('kho.duyet_noi_dung', 'off', true)`)
  console.log(`${ds.length} câu thuộc phạm vi (gốc ${nGoc}/27 + clone ${ds.length - nGoc}) · đã duyệt từ trước ${ds.filter((x) => x.da_duyet).length} · duyệt mới ${xong.length} · bỏ qua ${bo.length}`)
  for (const x of bo) console.log('  ✘ bỏ qua', x.ma_cau, x.thieu_da ? 'thiếu đáp án' : x.thieu_lg ? 'thiếu lời giải' : `kiem_may=${x.kiem_may}`)
  if (GHI) { await q('commit'); console.log('ĐÃ GHI.') } else { await q('rollback'); console.log('THỬ ⇒ ROLLBACK') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
