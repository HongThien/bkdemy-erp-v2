import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
const q = async (s,p)=> (await c.query(s,p)).rows
console.table(await q(`select count(*)::int n, count(*) filter (where da_duyet)::int duyet from hinh_hoc_cau_form_tn where xoa_at is null`))
console.table(await q(`select ma, ten, nhom, ap_dung from hinh_hoc_mcq_rule where active order by ma limit 40`))
console.table(await q(`select b.khoi, b.ma_bai, left(b.ten_bai,40) ten, b.muc_do, count(q.*)::int cau, count(*) filter (where q.dap_an is not null and q.dap_an<>'' and q.lua_chon is null and q.menh_de is null and q.xoa_at is null)::int co_dap_an from hinh_hoc_bai b left join hinh_hoc_cau_hoi q on q.dang_chinh=b.ma_bai and q.xoa_at is null where b.khoi in ('8','9') group by 1,2,3,4 order by 1,2`))
console.table(await q(`select q.ma_cau, q.dang_chinh, q.loai_cau, left(q.noi_dung,170) nd, left(q.dap_an,60) da from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai=q.dang_chinh where q.xoa_at is null and b.khoi in ('8','9') and q.dap_an is not null and q.lua_chon is null and q.menh_de is null order by random() limit 14`))
await c.end()
