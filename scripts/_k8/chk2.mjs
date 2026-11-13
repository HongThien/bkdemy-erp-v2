import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
for (const t of ['hgt_mcq_rule','hinh_hoc_mcq_rule']) console.log(t, (await c.query(`select count(*)::int n from ${t} where ma >= 'R600' and ma < 'R700'`)).rows[0])
await c.end()
