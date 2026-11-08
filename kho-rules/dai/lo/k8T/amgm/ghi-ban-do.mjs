// ghi-ban-do.mjs — ghi nội dung AM–GM (noi-dung-gop.json) vào bản đồ 8T. CHỈ GHI VÀO Ô TRỐNG (mô tả / lý thuyết / ví dụ rỗng), không đè gì có sẵn. 1 transaction.
//   node kho-rules/dai/lo/k8T/amgm/ghi-ban-do.mjs [--ghi]       (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const nd = JSON.parse(readFileSync('kho-rules/dai/lo/k8T/amgm/noi-dung-gop.json', 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  let n = 0
  for (const [id, v] of Object.entries(nd.nhom)) {
    const r = await c.query(`update dai_bdm_nhom set mo_ta = case when coalesce(mo_ta,'')='' then $2 else mo_ta end, ly_thuyet = case when coalesce(ly_thuyet,'')='' then $3 else ly_thuyet end
      where id = $1 and (coalesce(mo_ta,'')='' or coalesce(ly_thuyet,'')='') returning id`, [id, v.mo_ta, v.ly_thuyet]); n += r.rowCount
  }
  let d = 0
  for (const [id, v] of Object.entries(nd.dang)) {
    const r = await c.query(`update dai_bdm_dang_bai set mo_ta = case when coalesce(mo_ta,'')='' then $2 else mo_ta end, ly_thuyet = case when coalesce(ly_thuyet,'')='' then $3 else ly_thuyet end,
      vi_du = case when coalesce(vi_du,'')='' then $4 else vi_du end where id = $1 returning id`, [id, v.mo_ta, v.ly_thuyet, v.vi_du]); d += r.rowCount
  }
  const kiem = (await c.query(`select count(*) filter (where coalesce(mo_ta,'')<>'')::int mo_ta, count(*) filter (where coalesce(ly_thuyet,'')<>'')::int lt, count(*) filter (where coalesce(vi_du,'')<>'')::int vd, count(*)::int tong
    from dai_bdm_dang_bai where id = any($1)`, [Object.keys(nd.dang)])).rows[0]
  console.log(`nhóm cập nhật ${n}/${Object.keys(nd.nhom).length} · dạng cập nhật ${d}/${Object.keys(nd.dang).length} · sau: `, kiem)
  if (kiem.mo_ta !== kiem.tong || kiem.lt !== kiem.tong || kiem.vd !== kiem.tong) throw new Error('còn dạng thiếu mô tả/lý thuyết/ví dụ — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
