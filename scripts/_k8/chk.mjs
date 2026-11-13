import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
for (const t of ['dai_mcq_rule','hgt_mcq_rule','hinh_hoc_mcq_rule']) console.log(t, (await c.query(`select string_agg(ma, ',' order by ma) m, count(*) from ${t} where ma ~ '^R(59|6)\d+$'`)).rows[0])
console.log((await c.query(`select column_name, is_nullable, column_default from information_schema.columns where table_name='hgt_mcq_rule' order by ordinal_position`)).rows.map(r=>r.column_name+':'+r.is_nullable).join(' '))
await c.end()
