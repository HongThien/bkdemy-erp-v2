// sua-nhanh-hgt.mjs — đề 12A1 thiếu 4 câu Oxyz trên lưới chấm: câu ở kho HGT phải khai cau_hinh.nhanhByCau[ma_cau]='hinh_gt'
// (quy ước đề MT trộn nhánh — xem src/lib/tailieu.ts nhanhCuaCau; mẫu: "Kiểm tra Khảo sát tháng 8 - Khối 9"). Chỉ UPDATE cau_hinh, không xoá gì.
//   node kho-rules/dai/lo/mt/k12-t10/sua-nhanh-hgt.mjs [--ghi]
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const ket = JSON.parse(fs.readFileSync('kho-rules/dai/lo/mt/k12-t10/ket-qua-kho.json', 'utf8'))
const hgt = Object.entries(ket).filter(([id, v]) => v.kho === 'hgt').map(([id, v]) => v.ma_cau)
const mt = JSON.parse(fs.readFileSync('kho-rules/dai/lo/mt/k12-t10/ket-qua-mt.json', 'utf8'))
const DOCS = [mt.a1.master, mt.a1.mt_buoi, mt.b1.master, mt.b1.mt_buoi]
const nhanh = Object.fromEntries(hgt.map((m) => [m, 'hinh_gt']))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect(); await c.query('begin')
try {
  for (const id of DOCS) {
    const d = (await c.query(`select cau_hinh from tai_lieu where id = $1`, [id])).rows[0]
    // chỉ gắn cho câu thật sự nằm trong đề này
    const trong = new Set((await c.query(`select tc.ma_cau from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1`, [id])).rows.map((r) => r.ma_cau))
    const gan = Object.fromEntries(Object.entries(nhanh).filter(([m]) => trong.has(m)))
    if (!Object.keys(gan).length) { console.log(id, 'không có câu HGT — bỏ qua'); continue }
    const moi = { ...d.cau_hinh, nhanhByCau: { ...(d.cau_hinh.nhanhByCau ?? {}), ...gan } }
    await c.query(`update tai_lieu set cau_hinh = $2, updated_at = now() where id = $1`, [id, moi])
    console.log(id, 'nhanhByCau +', Object.keys(gan).length)
  }
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
