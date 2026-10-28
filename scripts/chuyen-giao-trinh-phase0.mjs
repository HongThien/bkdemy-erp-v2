// Chuyển giáo trình Toán·Đại (bản đồ cũ, khối 6–12) sang bản đồ mới, tag phase 0.
// Chạy: node scripts/chuyen-giao-trinh-phase0.mjs [--ghi]   (mặc định ROLLBACK, in báo cáo)
// Hàm DB: fn_tl_bdm_chuyen_luu_tru (mig 202610281051). Mỗi giáo trình 1 transaction; đã chuyển rồi thì bỏ qua.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()]))
const ghi = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const ls = (await c.query(`select id,ten,khoi from tai_lieu t where loai='giao_trinh' and ban_do='cu' and mon='Toán' and nhanh is null
  and khoi in ('6','7','8','9','10','11','12') and not exists (select 1 from tai_lieu x where x.luu_tru_tu=t.id) order by khoi::int, ten`)).rows
const T = { cu: 0, moi: 0, ck: 0, ok: 0, loi: 0 }
for (const l of ls) {
  await c.query('begin')
  try {
    const r = (await c.query('select fn_tl_bdm_chuyen_luu_tru($1) r', [l.id])).rows[0].r
    await c.query(ghi ? 'commit' : 'rollback')
    T.cu += r.cau_cu; T.moi += r.cau_moi; T.ck += r.chua_khop; T.ok++
    console.log(`K${l.khoi} ${l.ten}: ${r.so_buoi} buổi · câu ${r.cau_cu}→${r.cau_moi} · chưa khớp ${r.chua_khop}`)
  } catch (e) { await c.query('rollback'); T.loi++; console.log('LỖI', l.khoi, l.ten, e.message) }
}
console.log(ghi ? 'ĐÃ GHI' : 'THỬ (rollback)', T)
await c.end()
