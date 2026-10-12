// ============================================================================
// cap-nhat-loi-giai.mjs — đề ĐÃ ghi ERP (theo sha256) mà lời giải soạn lại: ghi đè `loi_giai` của các câu CHƯA DUYỆT do chính đề đó đẻ ra.
//
//   node scripts/kho/de-thi/cap-nhat-loi-giai.mjs <thư mục làm việc có de.json>          # chạy thử (ROLLBACK)
//   node scripts/kho/de-thi/cap-nhat-loi-giai.mjs <thư mục làm việc có de.json> --ghi
//
// Nối câu trong de.json ↔ câu trong kho bằng NỘI DUNG (khoá tự nhiên), không bằng vị trí. Chỉ đụng câu `nguon='de_thi'`, `da_duyet=false`,
// nội dung khớp nguyên văn; câu trỏ về câu cũ của kho (trùng) hay câu đã duyệt ⇒ bỏ qua, in ra. Không đổi đề, không đổi đáp án.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const args = process.argv.slice(2)
const dir = args.find((a) => !a.startsWith('--')), GHI = args.includes('--ghi')
const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const { rows: [tl] } = await c.query(`select id, ten from tai_lieu where loai = 'de_thi' and cau_hinh -> 'deThi' ->> 'sha256' = $1`, [de.sha256])
  if (!tl) throw new Error('đề này chưa có trên ERP (theo sha256)')
  const { rows: ds } = await c.query(`select ma_cau, kho from fn_de_thi_cau($1)`, [tl.id])
  let doi = 0, boQua = 0
  for (const kho of ['dai', 'hgt']) {
    const mas = ds.filter((r) => r.kho === kho).map((r) => r.ma_cau)
    if (!mas.length) continue
    const { rows } = await c.query(`select ma_cau, noi_dung, loi_giai, da_duyet, nguon from ${kho}_cau_hoi where ma_cau = any($1)`, [mas])
    for (const q of de.cau.filter((x) => x.kho === kho)) {
      const r = rows.find((x) => x.noi_dung === q.noi_dung)
      if (!r) { console.log(`  ? ${q.nhan ?? q.so}: không thấy câu cùng nội dung trong đề trên ERP — bỏ qua`); boQua++; continue }
      if (r.da_duyet || r.nguon !== 'de_thi') { console.log(`  – ${r.ma_cau} (${q.nhan ?? q.so}): câu đã duyệt / câu cũ của kho — không đụng`); boQua++; continue }
      if (r.loi_giai === q.loi_giai) continue
      await c.query(`update ${kho}_cau_hoi set loi_giai = $1 where ma_cau = $2`, [q.loi_giai, r.ma_cau]); doi++
    }
  }
  console.log(`"${tl.ten}": đổi lời giải ${doi} câu · bỏ qua ${boQua}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
