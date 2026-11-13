import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
console.table((await c.query(`select 'hgt' k, count(*)::int n, count(*) filter (where da_duyet)::int duyet from hgt_cau_form_tn where xoa_at is null and ai_model='claude-sonnet-5-5' union all select 'hinh_hoc', count(*)::int, count(*) filter (where da_duyet)::int from hinh_hoc_cau_form_tn where xoa_at is null and ai_model='claude-sonnet-5-5'`)).rows)
await c.end()
