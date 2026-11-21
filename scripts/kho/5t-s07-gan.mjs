// 5t-s07-gan.mjs — gán GỢI Ý bậc tối thiểu + mức độ cho dạng 5T còn trống (Thùy 21/11: "Gán đi, sau này t hậu kiểm rồi sửa sau").
// Gợi ý = dạng đã chốt cùng nhóm → cùng chuyên đề → cùng chủ đề (mode) ; mức độ có điều chỉnh theo tên dạng ("cơ bản…" 2, "kép / nâng cao / tổng hợp…" 4); không có cơ sở ⇒ mức độ 3, bậc B.
// CHỈ điền ô còn trống (không đè ô Thùy đã chốt). Cùng logic với scripts/kho/5t-s07-html.mjs.
//   node scripts/kho/5t-s07-gan.mjs [--ghi]    (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL }); await c.connect()
const mode = (a) => { const m = {}; for (const x of a) m[x] = (m[x] || 0) + 1; const e = Object.entries(m).sort((p, q) => q[1] - p[1]); return e.length ? e[0][0] : null }
const heur = (ten) => /cơ bản|đổi đơn vị|nhận biết|công thức/i.test(ten) ? 2 : /kép|nâng cao|tổng hợp|phức|hai tỉ số|khử|đường tròn|nhiều lần/i.test(ten) ? 4 : null
try {
  await c.query('begin')
  const rows = (await c.query(`select d.id, d.ten, d.muc_do, d.bac_toi_thieu, nh.ten nhom, ch.ten chuyen_de, cd.ten chu_de
    from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chuyen_de ch on ch.id=nh.chuyen_de_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T'`)).rows
  const co = rows.filter((r) => r.muc_do && r.bac_toi_thieu)
  const theo = (k) => { const g = {}; for (const r of co) (g[r[k]] ??= []).push(r); return g }
  const gN = theo('nhom'), gC = theo('chuyen_de'), gD = theo('chu_de')
  const goi = (r) => { for (const [g, co_so] of [[gN[r.nhom], 'cùng nhóm'], [gC[r.chuyen_de], 'cùng chuyên đề'], [gD[r.chu_de], 'cùng chủ đề']]) if (g?.length) return { muc: heur(r.ten) ?? Number(mode(g.map((x) => x.muc_do))), bac: mode(g.map((x) => x.bac_toi_thieu)), co_so }
    return { muc: heur(r.ten) ?? 3, bac: 'B', co_so: 'mặc định' } }
  let n = 0; const dem = {}
  for (const r of rows) {
    if (r.muc_do && r.bac_toi_thieu) continue
    const g = goi(r)
    await c.query(`update dai_bdm_dang_bai set muc_do = coalesce(muc_do, $2), bac_toi_thieu = coalesce(bac_toi_thieu, $3) where id=$1`, [r.id, g.muc, g.bac]); n++
    dem[g.co_so] = (dem[g.co_so] || 0) + 1
  }
  const sau = (await c.query(`select count(*) filter (where d.muc_do is null or d.bac_toi_thieu is null)::int trong from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T'`)).rows[0]
  console.log({ dang_gan: n, theo_co_so: dem, con_trong_sau: sau.trong })
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
