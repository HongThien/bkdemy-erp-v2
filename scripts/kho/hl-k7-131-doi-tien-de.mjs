// MH.131 (K7): đổi tiền đề hai nhánh (Thùy 21/11 "Đổi tiền đề") — D,B,P thẳng hàng cần AC∥BD (sinh từ B2); D,C,Q thẳng hàng cần AB∥CD (sinh từ B1).
//   BT.07.131.08 (N trung điểm AB, P đối xứng C qua N): tiền đề B1 → B2 · BT.07.131.10 (L trung điểm AC, Q đối xứng B qua L): tiền đề B2 → B1
//   node scripts/kho/hl-k7-131-doi-tien-de.mjs [--ghi]    (không --ghi ⇒ chạy thử rồi ROLLBACK)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const id = async (ma) => (await q(`select id from hinh_baitoan where ma = $1`, [ma]))[0].id
await c.query('begin')
try {
  for (const [ma, cu, moi] of [['BT.07.131.08', 'BT.07.131.01', 'BT.07.131.02'], ['BT.07.131.10', 'BT.07.131.02', 'BT.07.131.01']]) {
    const b = (await q(`select id, phat_bieu, gia_thiet_rieng, anh_chuan from hinh_baitoan where ma = $1`, [ma]))[0]
    const cach = (await q(`select id, loi_giai from hinh_cach_giai where baitoan_id = $1 and la_mac_dinh`, [b.id]))[0]
    const hien = (await q(`select t.ma from hinh_cach_tien_de x join hinh_baitoan t on t.id = x.tien_de_id where x.cach_id = $1`, [cach.id])).map((r) => r.ma)
    if (hien.length !== 1 || hien[0] !== cu) throw new Error(`${ma}: tiền đề hiện tại ${JSON.stringify(hien)} ≠ [${cu}]`)
    await q(`select fn_hl_sua_bai($1, $2, $3, $4, $5, $6::uuid[])`, [b.id, b.phat_bieu, b.gia_thiet_rieng, cach.loi_giai, b.anh_chuan, [await id(moi)]])
  }
  const kq = await q(`select b.ma, string_agg(t.ma, ',') td, bool_and(g.loi_giai is not null and g.loi_giai <> '') co_lg from hinh_baitoan b join hinh_cach_giai g on g.baitoan_id = b.id and g.la_mac_dinh
    left join hinh_cach_tien_de x on x.cach_id = g.id left join hinh_baitoan t on t.id = x.tien_de_id where b.ma in ('BT.07.131.08','BT.07.131.10') group by b.ma order by b.ma`)
  console.log(kq.map((r) => `${r.ma} ← ${r.td} · lời giải giữ: ${r.co_lg}`).join('\n'))
  const g = (await q(`select id from hinh_mo_hinh where ma = 'MH.131' and khoi = '7' and phan = 'luyen' and la_mo_hinh`))[0].id
  const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [g])
  const td = (await q(`select count(*) n from hinh_cach_tien_de x join hinh_cach_giai g on g.id = x.cach_id join hinh_baitoan b on b.id = g.baitoan_id where b.ma like 'BT.07.131.%'`))[0].n
  console.log(`MH.131: ${td} tiền đề (trước 12) · sai nhánh ${sai.length}`)
  if (sai.length || Number(td) !== 12) throw new Error('đọc lại không khớp')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
