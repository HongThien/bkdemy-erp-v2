// Thùy 16/11: kho Thẳng hàng phải HIỆN ĐỦ a–b–c. 45 ý đi kèm (bản chép) trước đó để rut_khoi_kho=true ⇒ bị ẩn khi lọc "kho chuẩn". Bật lại rut_khoi_kho=false.
//   node scripts/hinh-k7-thang-hang-hien-du-y.mjs [--ghi]
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const ids = JSON.parse(readFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-sua-bai-y.json', 'utf8')).them_y_boi_canh.map((x) => x.ma_cau)
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
try {
  await c.query('begin')
  const r = await c.query(`update hinh_hoc_cau_hoi set rut_khoi_kho = false where ma_cau = any($1) and rut_khoi_kho and xoa_at is null returning ma_cau`, [ids])
  if (r.rowCount !== ids.length) throw new Error(`cần ${ids.length}, được ${r.rowCount}`)
  const dem = (await c.query(`select b.ma_bai, count(*) filter (where h.bai_y is not null) y, count(*) filter (where h.kho_chuan) kho_chuan, count(*) filter (where h.da_duyet) duyet from hinh_hoc_bai b join hinh_hoc_cau_hoi h on h.dang_chinh=b.ma_bai and h.xoa_at is null where b.ma_bai in ('HH00170','HH00171','HH00172') group by 1 order by 1`)).rows
  console.table(dem)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
