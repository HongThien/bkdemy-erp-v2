import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
for (const t of ['hgt_mcq_rule','hinh_hoc_mcq_rule']) { console.log(t); console.table((await c.query(`select ma, left(ten,70) ten, nhom, du_phong, active from ${t} order by ma`)).rows) }
console.table((await c.query(`select ma, left(ten,60) ten, nhom, du_phong from dai_mcq_rule where active and (ten ilike '%góc%' or ten ilike '%sin%' or ten ilike '%cos%' or ten ilike '%tan%' or ten ilike '%lượng giác%' or ten ilike '%làm tròn%' or ten ilike '%tiếp tuyến%' or ten ilike '%chu vi%' or ten ilike '%đơn vị%' or ten ilike '%chia đôi%' or ten ilike '%gấp đôi%') order by ma`)).rows)
await c.end()
