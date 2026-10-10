// ============================================================================
// ap-chot-2026-10-10.mjs — ÁP quyết định của Thùy sau khi xem trang "câu cần chị xem" (kho-rules/dai/k8T-can-xem.html), 10/10/2026.
//
//   node kho-rules/dai/lo/k8T/ap-chot-2026-10-10.mjs          # chạy thử (ROLLBACK)
//   node kho-rules/dai/lo/k8T/ap-chot-2026-10-10.mjs --ghi    # ghi thật
//
// (1) XOÁ MỀM 2 câu trùng (Thùy: thẻ 1 "Bỏ câu a", thẻ 2 "bỏ câu a") — sách in ý a) là ý b) ở dạng đã tách sẵn:
//       T18T010201025  bài 50a  x^2+3x+2x+6      (giữ 50b  x^2+5x+6)
//       T18T000000002  bài 53a  x^4+4+4x^2-4x^2  (giữ 53b  x^4+4)
//     Mất gì: 2 câu chưa duyệt, mới ghi 10/10, chưa ai dùng. Xoá mềm (xoa_at) ⇒ khôi phục được.
// (2) XẾP NHÓM 7 câu đang ở dạng chờ (Thùy chọn từng thẻ 12–18). Mã câu không đổi; trigger trg_log_doi_dang ghi vết.
// Script một lần — giữ trong repo làm vết của việc đã làm; chạy lại không đổi gì thêm (điều kiện WHERE đã loại dòng đã áp).
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const GHI = process.argv.includes('--ghi')
const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const SACH = 'CĐ BD HSG Toán 8 – Nguyễn Đức Tấn'
const XOA = [['T18T010201025', 'D1.50a@p18'], ['T18T000000002', 'D1.53a@p19']]
const NHOM = [   // [mã nguồn, nhóm Thùy chốt, lời Thùy]
  ['D1.36@p14', 'T18T030101', 'thẻ 12: "cái sau. Ưu tiên các dạng ở đây là dùng biến đổi và phân tích thành nhân tử, chưa có công cụ lớn đâu"'],
  ['D1.55a@p19', 'T18T010203', 'thẻ 13: "Nhẩm nghiệm. bậc 3 hầu như là nhẩm nghiệm"'],
  ['D1.26b@p10', 'T18T010302', 'thẻ 14: "Cái thứ 2"'],
  ['D1.26d@p11', 'T18T040102', 'thẻ 15: "Thứ 2"'],
  ['D1.80a@p27', 'T18T010401', 'thẻ 16: "Thứ 2"'],
  ['D1.80b@p27', 'T18T010401', 'thẻ 17: "Thứ 2"'],
  ['D1.86@p29', 'T18T010302', 'thẻ 18: "Thứ 1"'],
]
const db = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
try {
  await db.query('begin')
  for (const [ma, nguon] of XOA) {
    const { rows } = await db.query(`select ma_cau, da_duyet, xoa_at, ten_de_goc, left(noi_dung, 70) de from dai_cau_hoi where ma_cau = $1`, [ma])
    const r = rows[0]
    if (!r) throw new Error(`không thấy câu ${ma}`)
    if (r.ten_de_goc !== `${SACH} · ${nguon}`) throw new Error(`${ma}: nguồn "${r.ten_de_goc}" không phải ${nguon} — dừng, không xoá nhầm`)
    if (r.da_duyet) throw new Error(`${ma} đã duyệt — dừng`)
    if (r.xoa_at) { console.log(`  ${ma} (${nguon}) đã xoá mềm từ trước`); continue }
    await db.query(`update dai_cau_hoi set xoa_at = now() where ma_cau = $1`, [ma])
    console.log(`  xoá mềm ${ma} (${nguon}): ${r.de}`)
  }
  for (const [nguon, nhom, loi] of NHOM) {
    const { rows } = await db.query(`select ma_cau, dang_chinh from dai_cau_hoi where xoa_at is null and ten_de_goc = $1`, [`${SACH} · ${nguon}`])
    if (rows.length !== 1) throw new Error(`${nguon}: thấy ${rows.length} câu, cần đúng 1`)
    const r = rows[0]
    if (r.dang_chinh === nhom) { console.log(`  ${nguon} (${r.ma_cau}) đã ở ${nhom}`); continue }
    if (r.dang_chinh !== 'T18T000000') throw new Error(`${nguon} (${r.ma_cau}) đang ở ${r.dang_chinh}, không phải dạng chờ — dừng`)
    await db.query(`update dai_cau_hoi set dang_chinh = $2 where ma_cau = $1`, [r.ma_cau, nhom])
    console.log(`  ${nguon} (${r.ma_cau}): dạng chờ → ${nhom}   ← ${loi}`)
  }
  const { rows: [d] } = await db.query(`select count(*) filter (where xoa_at is null) con, count(*) filter (where xoa_at is null and dang_chinh = 'T18T000000') cho, count(*) filter (where xoa_at is not null) da_xoa from dai_cau_hoi where left(dang_chinh, 4) = 'T18T' or ma_cau like 'T18T%'`)
  console.log(`kho Đại 8T: ${d.con} câu · dạng chờ ${d.cho} · đã xoá mềm ${d.da_xoa}`)
  await db.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '■ ĐÃ GHI' : '□ chạy thử — đã ROLLBACK (thêm --ghi để ghi thật)')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
