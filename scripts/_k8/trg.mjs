import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
for (const t of ['hinh_hoc_cau_form_tn','hgt_cau_form_tn']) {
 const r = await c.query(`select tgname, pg_get_triggerdef(oid) d from pg_trigger where tgrelid=$1::regclass and not tgisinternal`,[t])
 console.log(t, r.rows.map(x=>x.tgname+' :: '+x.d))
}
const f = await c.query(`select prosrc from pg_proc where proname in (select p.proname from pg_trigger g join pg_proc p on p.oid=g.tgfoid where g.tgrelid='hinh_hoc_cau_form_tn'::regclass and not g.tgisinternal)`)
for (const x of f.rows) console.log(x.prosrc.slice(0,2500))
console.log((await c.query(`select ma_cau, dap_an, key_gia_tri, nguon, ai_model, lua_chon from hinh_hoc_cau_form_tn where xoa_at is null limit 2`)).rows.map(r=>JSON.stringify(r)).join('\n'))
console.log((await c.query(`select ma_cau, dap_an, key_gia_tri, lua_chon from hgt_cau_form_tn where xoa_at is null limit 2`)).rows.map(r=>JSON.stringify(r)).join('\n'))
await c.end()
