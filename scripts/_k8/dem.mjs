import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
const q = async (s,p)=> (await c.query(s,p)).rows
console.log('HGT theo khối × mức độ (câu đã duyệt, có đáp án, chưa MCQ gốc, chưa có form)')
console.table(await q(`select b.khoi, b.muc_do, count(*)::int cau, count(*) filter (where exists (select 1 from hgt_cau_form_tn f where f.ma_cau=q.ma_cau and f.xoa_at is null))::int co_form
 from hgt_cau_hoi q join hgt_ban_do b on b.ma_dang=q.dang_chinh
 where q.xoa_at is null and b.khoi in ('8','9') and q.da_duyet and q.dap_an is not null and q.dap_an<>'' and q.lua_chon is null and q.menh_de is null
 group by 1,2 order by 1,2`))
console.log('HÌNH HỌC theo khối × mức độ')
console.table(await q(`select b.khoi, b.muc_do, count(*)::int cau, count(*) filter (where exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau=q.ma_cau and f.xoa_at is null))::int co_form
 from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai=q.dang_chinh
 where q.xoa_at is null and b.khoi in ('8','9') and q.dap_an is not null and q.dap_an<>'' and q.lua_chon is null and q.menh_de is null
 group by 1,2 order by 1,2`))
console.log('HÌNH HỌC da_duyet')
console.table(await q(`select b.khoi, q.da_duyet, q.kho_chuan, count(*)::int n from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai=q.dang_chinh where q.xoa_at is null and b.khoi in ('8','9') group by 1,2,3 order by 1,2,3`))
await c.end()
