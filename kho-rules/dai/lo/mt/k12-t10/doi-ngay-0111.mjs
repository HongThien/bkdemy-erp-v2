// doi-ngay-0111.mjs — Thùy 06/11: 12A1 và 12B1 thi ngày 01/11 (không phải 30/10) ⇒ chuyển bản đề đã gán (mt_buoi) sang buổi 01/11 CÓ SẴN của từng lớp.
//   node kho-rules/dai/lo/mt/k12-t10/doi-ngay-0111.mjs [--ghi]     (mặc định ROLLBACK)
// KHÔNG xoá gì. Làm như app khi re-gán sang ngày khác: update tai_lieu.ngay của bản mt_buoi + đóng 4 phase khác của buổi mới (chỉ nơi còn NULL).
// Việc XOÁ buổi 30/10 (buổi_hoc + dòng phụ thuộc) là bước riêng, chờ Thùy gật (CLAUDE.md "Luật xoá").
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const MT = { '12A1': 'e3b0ea4f-d1d3-43ba-ab23-b291bccec7f7', '12B1': '2225e68a-b3e6-4c56-a022-a5762df07d44' }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  for (const [ten, id] of Object.entries(MT)) {
    const d = (await c.query(`select t.id, t.ngay::text, t.lop_id, t.loai, l.ten_lop from tai_lieu t join lop l on l.id = t.lop_id where t.id = $1`, [id])).rows[0]
    if (!d || d.loai !== 'mt_buoi' || d.ten_lop !== ten) throw new Error('bản đề không đúng: ' + ten)
    const buoi = (await c.query(`select id, trang_thai from buoi_hoc where lop_id = $1 and ngay = '2026-11-01' and loai = 'thuong' and trang_thai <> 'huy'`, [d.lop_id])).rows
    if (buoi.length !== 1) throw new Error(`${ten}: kỳ vọng đúng 1 buổi 01/11, thấy ${buoi.length}`)
    const khac = (await c.query(`select id from tai_lieu where loai = 'mt_buoi' and lop_id = $1 and ngay = '2026-11-01'`, [d.lop_id])).rows
    if (khac.length) throw new Error(`${ten}: buổi 01/11 đã có bản MT khác`)
    await c.query(`update tai_lieu set ngay = '2026-11-01', updated_at = now() where id = $1`, [id])
    for (const col of ['danh_gia_xong_at', 'ingame_dong_at', 'et_dong_at', 'btvn_dong_at']) await c.query(`update buoi_hoc set ${col} = now() where id = $1 and ${col} is null`, [buoi[0].id])
    console.log(`${ten}: đề ${d.ngay} → 2026-11-01 · buổi ${buoi[0].id} (${buoi[0].trang_thai})`)
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
