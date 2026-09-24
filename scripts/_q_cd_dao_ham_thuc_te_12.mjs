// CHỈ ĐỌC. Dò chuyên đề "Ứng dụng đạo hàm ... thực tế" lớp 12 trong dai_ban_do + đếm câu/tham chiếu, phục vụ Luật xoá.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect(); await c.query('begin read only')
const cd = await c.query(`select ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de, count(*) so_dang, array_agg(ma_dang order by ma_dang) dangs
  from dai_ban_do where khoi = '12' and (lower(ten_chuyen_de) like '%thực tế%' or lower(ten_chuyen_de) like '%đạo hàm%')
  group by 1,2,3,4 order by 1`)
console.log('== Chuyên đề khớp (khối 12):'); console.table(cd.rows.map((r) => ({ ...r, dangs: r.dangs.length })))
for (const r of cd.rows) {
  console.log(`\n### ${r.ma_chuyen_de} — ${r.ten_chuyen_de} (chủ đề ${r.ma_chu_de} ${r.ten_chu_de})`)
  const d = await c.query(`select b.ma_dang, b.ten_dang,
      (select count(*) from dai_cau_hoi q where q.dang_chinh = b.ma_dang) so_cau,
      (select count(*) from dai_cau_hoi q where q.dang_chinh = b.ma_dang and q.xoa_at is not null) so_cau_rac
    from dai_ban_do b where b.ma_chuyen_de = $1 order by b.ma_dang`, [r.ma_chuyen_de])
  console.table(d.rows)
}
await c.query('rollback'); await c.end()
