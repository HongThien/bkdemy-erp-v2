import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
const q = async (s,p)=> (await c.query(s,p)).rows
console.table(await q(`select c.kho_goc, b.khoi, b.muc_do, count(*)::int cau, count(*) filter (where c.da_duyet)::int duyet, count(*) filter (where f.ma_cau is not null)::int co_form
 from bdm_cau_hoi c join bdm_ban_do b on b.ma_dang=c.dang_chinh left join bdm_cau_form_tn f on f.ma_cau=c.ma_cau and f.xoa_at is null
 where c.xoa_at is null and b.khoi in ('8','9') and c.dap_an is not null and c.dap_an<>'' and c.lua_chon is null and c.menh_de is null
 group by 1,2,3 order by 1,2,3`))
console.table(await q(`select b.khoi, count(*)::int dang, count(muc_do)::int co_muc from hinh_hoc_bai b where khoi in ('8','9') group by 1`))
console.table(await q(`select table_name from information_schema.tables where table_schema='public' and table_name ilike '%hinh%' order by 1`))
await c.end()
