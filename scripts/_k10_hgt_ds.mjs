import fs from 'node:fs'; import pg from 'pg'
const D = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
const r = await c.query(`insert into hgt_bdm_kho_ds (ma_cau, chu_de_id, nguon) select t.m, t.c, 'ai' from unnest($1::text[], $2::text[]) t(m, c)
  join hgt_cau_hoi q on q.ma_cau = t.m and q.xoa_at is null and q.loai_cau = 'dung_sai' on conflict (ma_cau) do nothing`, [D.ds.map(x=>x.ma_cau), D.ds.map(x=>x.chu_de_id)])
console.log({ kho_ds_chen: r.rowCount, ky_vong: D.ds.length })
if (r.rowCount !== D.ds.length) { await c.query('rollback'); console.log('lệch ⇒ rollback') } else { await c.query('commit'); console.log('ĐÃ GHI') }
await c.end()
