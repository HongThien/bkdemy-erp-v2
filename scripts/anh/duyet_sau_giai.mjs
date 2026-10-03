// ============================================================================
// duyet_sau_giai.mjs — Thùy 03/10: "Những câu đã được duyệt lại cho thẳng vào kho luôn — coi như đã duyệt. Chỉ những câu m ko chắc mới phải đưa lên GV."
// Câu ĐANG CHỜ mà lượt AI giải mù (giai_a) CHẮC về đáp án ⇒ duyệt (duyet_nguon 'ai'). "Chắc" =
//   A "chac" + không phương án 2 + không báo lỗi đề + đáp án A = đáp án đang lưu (đáp án GV/nguồn, hoặc đáp án 2 bên A/B vừa ghi).
// GIỮ chờ GV (không phải "không chắc đáp án" nhưng là quyết định khác):
//   - câu ở ĐIỂM CHỜ (…000000): trigger chặn duyệt tới khi có điểm kiến thức thật.
//   - câu A+B thấy NGOÀI PHẠM VI: luật CEO 02/10 loại khỏi kho luyện thi vào 10 — lệnh 03/10 không nói tới, không tự gỡ.
// MẶC ĐỊNH CHẠY THỬ. --ghi để commit. node scripts/anh/duyet_sau_giai.mjs <thư mục anh_giai> [--ghi]
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')
const dir = process.argv[2]; const GHI = process.argv.includes('--ghi')
const A = new Map()
for (const f of fs.readdirSync(path.join(dir, 'giai_a')).filter((f) => /^lo-\d+\.json$/.test(f))) for (const g of JSON.parse(fs.readFileSync(path.join(dir, 'giai_a', f), 'utf8'))) A.set(g.ma, g)
const db = new pg.Client({ connectionString: process.env.DATABASE_URL }); await db.connect()
const cho = (await db.query(`select ma_cau, dap_an, dang_chinh, coalesce(kiem_may_ghi, '') ghi from anh_cau_hoi where xoa_at is null and not da_duyet`)).rows
const dem = { cho: cho.length, duyet: 0, khong_chac: 0, lech: 0, de_loi: 0, diem_cho: 0, ngoai_pham_vi: 0, thieu_da: 0, chua_giai: 0 }
const duyet = []
for (const r of cho) {
  const a = A.get(r.ma_cau)
  if (!a) { dem.chua_giai++; continue }
  if (!r.dap_an) { dem.thieu_da++; continue }
  if (a.chac !== 'chac' || a.pa_thu_hai) { dem.khong_chac++; continue }
  if (a.dap_an !== r.dap_an) { dem.lech++; continue }
  if (a.de_loi) { dem.de_loi++; continue }
  if (r.dang_chinh.endsWith('000000')) { dem.diem_cho++; continue }
  if (/ngoài phạm vi/i.test(r.ghi)) { dem.ngoai_pham_vi++; continue }
  duyet.push(r.ma_cau)
}
dem.duyet = duyet.length
await db.query('begin')
try {
  const u = await db.query(`update anh_cau_hoi set da_duyet = true, duyet_nguon = 'ai', kiem_may = 'khop', kiem_may_boi = 'claude_code',
      kiem_may_ghi = coalesce(kiem_may_ghi || ' · ', '') || '03/10: AI giải mù ra đúng đáp án, chắc, không phương án 2 ⇒ duyệt (Thùy 03/10)'
    where ma_cau = any($1) and not da_duyet and xoa_at is null`, [duyet])
  const kq = (await db.query(`select count(*) filter (where da_duyet)::int duyet, count(*) filter (where not da_duyet)::int cho from anh_cau_hoi where xoa_at is null`)).rows[0]
  console.log(dem); console.log(`cập nhật ${u.rowCount} · DB sau: đã duyệt ${kq.duyet} · còn chờ ${kq.cho}`)
  if (GHI) { await db.query('commit'); console.log('ĐÃ GHI') } else { await db.query('rollback'); console.log('CHẠY THỬ — rollback') }
} catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
