// clc6-de-xuat-dang.mjs — ghi ĐỀ XUẤT dạng 5T (dai_bdm_de_xuat, chờ duyệt — KHÔNG tự gán) cho câu CLC chưa có dạng, theo
// kho-rules/dai/lo/clc6/gan-de-xuat-5t.json (nguồn: câu làm chứng của bản chi tiết + xếp sơ bộ theo đầu đề). Chỉ câu chưa có gán và chưa có đề xuất.
//   node scripts/kho/de-thi/clc6-de-xuat-dang.mjs [--ghi]     (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const { gan } = JSON.parse(readFileSync('kho-rules/dai/lo/clc6/gan-de-xuat-5t.json', 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  const truoc = (await c.query(`select count(*)::int n from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau=x.ma_cau where q.ten_de_goc like 'Đề thi vào l%'`)).rows[0].n
  let moi = 0, bo = 0
  for (const [ma, v] of Object.entries(gan)) {
    const q = (await c.query(`select q.ma_cau, exists(select 1 from bdm_cau_dang g where g.ma_cau=q.ma_cau and g.kho='dai') da_gan from dai_cau_hoi q where q.ma_cau=$1 and q.xoa_at is null and q.ten_de_goc like 'Đề thi vào l%'`, [ma])).rows[0]
    if (!q || q.da_gan) { bo++; continue }
    const r = await c.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1,$2,'vua',$3,'ai') on conflict (ma_cau) do nothing`, [ma, v.dang_id, v.ly_do])
    moi += r.rowCount
  }
  const sau = (await c.query(`select count(*)::int n from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau=x.ma_cau where q.ten_de_goc like 'Đề thi vào l%'`)).rows[0].n
  console.log({ trong_file: Object.keys(gan).length, de_xuat_moi: moi, bo_qua: bo, de_xuat_CLC_truoc: truoc, sau })
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
