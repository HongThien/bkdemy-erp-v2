// clc6-cap-nhat-cau-co-san.mjs — CLC→5T 21/11: 2 câu ĐÃ có trong kho (ghi trước đợt sửa đề) được Thùy sửa chữ đề ⇒ cập nhật TẠI CHỖ (noi_dung + loi_giai),
// để lần ghi đề sau trỏ về đúng câu, không đẻ bản sao. Chỉ động vào câu chưa duyệt, đúng nội dung cũ đã biết. Không xoá gì.
//   node scripts/kho/de-thi/clc6-cap-nhat-cau-co-san.mjs [--ghi]    (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/clc6/'
const de = JSON.parse(readFileSync(D + 'de-da-sua.json', 'utf8'))
const nd = new Map(); for (const x of de) for (const q of x.cau) nd.set(q.ma_nguon, { q, de: x.ma })
const ls = (ma) => { const { de: d } = nd.get(ma); const sj = JSON.parse(readFileSync(D + d.replace(/ /g, '-') + '.soan.json', 'utf8')); return (Array.isArray(sj) ? sj : sj.cau).find((x) => x.ma_nguon === ma) }
const DS = [['AMS 2020 · 8', 'T15T0000001736'], ['LTV 2024 · 2', 'T15T0000001145']]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  for (const [ma, mc] of DS) {
    const moi = nd.get(ma).q.noi_dung, s = ls(ma)
    const cu = (await c.query(`select noi_dung, da_duyet, ten_de_goc from dai_cau_hoi where ma_cau=$1 and xoa_at is null`, [mc])).rows[0]
    if (!cu || cu.ten_de_goc !== `Đề thi vào lớp 6 CLC · ${ma}`) throw new Error(`${mc} không phải câu ${ma}`)
    if (cu.da_duyet) throw new Error(`${mc} đã duyệt — không sửa tại chỗ`)
    if (cu.noi_dung === moi) { console.log(ma, mc, '— đã là bản mới, bỏ qua'); continue }
    await c.query(`update dai_cau_hoi set noi_dung=$2, loi_giai=$3, dap_an=$4 where ma_cau=$1`, [mc, moi, s.loi_giai, s.dap_an])
    console.log(ma, mc, '→ cập nhật noi_dung / loi_giai /', 'dap_an =', s.dap_an)
  }
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
