import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const docs = (await c.query(`select id, ten, loai, khoi, mon, nhanh, ngay, updated_at from tai_lieu where loai in ('mt','mt_buoi') and khoi::text='7' order by updated_at desc limit 8`)).rows
console.table(docs.map(d=>({id:d.id.slice(0,8), ten:d.ten, loai:d.loai, mon:d.mon, ngay:d.ngay, upd:d.updated_at?.toISOString().slice(0,16)})))
for (const d of docs.filter(x=>x.loai==='mt').slice(0,2)) {
  const ch = (await c.query(`select cau_hinh from tai_lieu where id=$1`, [d.id])).rows[0].cau_hinh ?? {}
  console.log(`\n=== ${d.ten} — etFormByCau:`, JSON.stringify(ch.etFormByCau), '\n btvnLinesByCau:', JSON.stringify(ch.btvnLinesByCau), '\n colByCau:', JSON.stringify(ch.colByCau), '\n keys:', Object.keys(ch).join(','))
  const tl = Object.entries(ch.etFormByCau ?? {}).filter(([,f])=>f==='tu_luan').map(([m])=>m)
  if (tl.length) {
    const q = await c.query(`select ma_cau, loai_cau, coalesce(jsonb_array_length(to_jsonb(lua_chon)),0) n_lc, (menh_de is not null and jsonb_array_length(to_jsonb(menh_de))>0) co_md, left(noi_dung,160) nd from dai_cau_hoi where ma_cau = any($1)`, [tl])
    console.table(q.rows)
  }
}
await c.end()
