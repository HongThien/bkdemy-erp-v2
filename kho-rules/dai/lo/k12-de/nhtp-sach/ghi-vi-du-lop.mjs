// Ghi VÍ DỤ HƯỚNG DẪN (Từ Tâm Toán 12 ch.4) vào KHO TRÊN LỚP (dai_cau_lop, vai giang) theo dạng bài NH-TP đã phân (mức cao).
//   node kho-rules/dai/lo/k12-de/nhtp-sach/ghi-vi-du-lop.mjs [--ghi]    (mặc định chạy thử ROLLBACK)
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const B3 = 'kho-rules/dai/lo/b3/k12-nhtp-vidu/'
const goc = JSON.parse(fs.readFileSync(B3 + 'goc-id.json', 'utf8'))
const out = JSON.parse(fs.readFileSync(B3 + 'lo-01.out.json', 'utf8'))
const nfc = (s) => String(s ?? '').normalize('NFC').toLowerCase().replace(/\s+/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const ids = new Set((await c.query(`select id from dai_bdm_dang_bai`)).rows.map((r) => r.id))
  const co = new Set((await c.query(`select noi_dung from dai_cau_lop where xoa_at is null`)).rows.map((r) => nfc(r.noi_dung)))
  let them = 0, trung = 0, bo = 0
  for (const o of out) {
    const g = goc[o.ma_cau]
    if (!g || o.chac !== 'cao' || !o.dang_bai_id || !ids.has(o.dang_bai_id)) { bo++; continue }
    if (co.has(nfc(g.de))) { trung++; continue }
    await c.query(`select fn_dai_lop_them($1, 'giang', $2::jsonb)`, [o.dang_bai_id, JSON.stringify({ loai_cau: 'tu_luan', noi_dung: g.de, loi_giai: g.loi_giai, nguon: 'sach', ghi_chu: `Từ Tâm Toán 12 · Chương 4 · ${g.nhan} (${g.dang_sach})` })])
    co.add(nfc(g.de)); them++
  }
  console.log(`thêm ${them} · trùng ${trung} · bỏ (vừa/trống) ${bo}`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
