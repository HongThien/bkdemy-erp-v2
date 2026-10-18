// 4 bài "thể tích hình có thiết diện" (PDF Thùy gửi 18/10) → dạng cũ T112040403 «Thể tích vật thể tính theo mặt cắt vuông góc trục hoành».
//   node kho-rules/dai/lo/k12-the-tich-thiet-dien/ghi.mjs [--ghi]     (mặc định chạy thử rồi ROLLBACK)
// Cả 4 bài ĐÃ CÓ trong kho (dạng chờ T112000000) ⇒ KHÔNG nhập trùng; chỉ:
//   ① chuyển dạng (mã câu bất biến; trg_log_doi_dang tự ghi vết) · ② điền đáp án còn thiếu (đã tự giải kiểm) ·
//   ③ sửa ký hiệu Word sót "[[sym:Symbol:F0B7]]" → "•". Lời giải / hình / da_duyet giữ nguyên.
import pg from 'pg'
import fs from 'node:fs'
const GHI = process.argv.includes('--ghi')
const DANG = 'T112040403'
const CAU = [
  { ma: 'T1120000002698', bai: 'Câu 67 — lều parabol', dap_an: null },                            // đã có 2.7
  { ma: 'T1120000001262', bai: 'Câu 1 — cốc nước nghiêng', dap_an: '240' },                        // TLN, cm³
  { ma: 'T1120000002741', bai: 'Câu 2 — Sport Hub', dap_an: String.raw`$V\approx 115586\ m^3$` },
  { ma: 'T1120000002743', bai: 'Câu 3 — giao hai ¼ trụ', dap_an: String.raw`$V_{(H)}=\dfrac{2a^3}{3}$` },
]
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
await c.query('begin')
try {
  const d = (await c.query(`select ten_dang, khoi, xoa_at from dai_ban_do where ma_dang = $1`, [DANG])).rows[0]
  if (!d || d.xoa_at || d.khoi !== '12') throw new Error(`dạng ${DANG} không hợp lệ`)
  for (const q of CAU) {
    const r = (await c.query(`select dang_chinh, dap_an, loi_giai, xoa_at, da_duyet from dai_cau_hoi where ma_cau = $1`, [q.ma])).rows[0]
    if (!r || r.xoa_at) throw new Error(`${q.ma} không có / đã vào kho rác`)
    if (r.dang_chinh !== 'T112000000') throw new Error(`${q.ma} đang ở ${r.dang_chinh}, không phải dạng chờ — dừng, hỏi lại`)
    const lg = (r.loi_giai ?? '').replaceAll('[[sym:Symbol:F0B7]]', '•')
    const daMoi = r.dap_an ?? q.dap_an
    await c.query(`update dai_cau_hoi set dang_chinh = $2, dap_an = $3, loi_giai = $4 where ma_cau = $1`, [q.ma, DANG, daMoi, lg])
    console.log(`  ${q.ma} (${q.bai}): T112000000 → ${DANG}${r.dap_an ? '' : ` · điền đáp án ${daMoi}`}${lg !== (r.loi_giai ?? '') ? ' · sửa ký hiệu •' : ''}`)
  }
  const n = +(await c.query(`select count(*) from dai_cau_hoi where dang_chinh = $1 and xoa_at is null`, [DANG])).rows[0].count
  const log = +(await c.query(`select count(*) from kho_doi_dang_log where ma_cau = any($1)`, [CAU.map((q) => q.ma)])).rows[0].count
  console.log(`dạng ${DANG} «${d.ten_dang}» giờ có ${n} câu · vết đổi dạng ${log} dòng`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử — thêm --ghi để ghi)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
