import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL }); await c.connect()
const q = async (s,p)=> (await c.query(s,p)).rows
const h = await q(`select q.ma_cau, q.dang_chinh, q.da_duyet, q.kho_chuan, q.loai_cau, q.noi_dung, q.dap_an, q.anh_de from hgt_cau_hoi q join hgt_ban_do b on b.ma_dang=q.dang_chinh where q.xoa_at is null and b.khoi in ('8','9') and b.muc_do<=3 and q.dap_an is not null and q.dap_an<>'' and q.lua_chon is null and q.menh_de is null and not exists (select 1 from hgt_cau_form_tn f where f.ma_cau=q.ma_cau and f.xoa_at is null) order by 1`)
console.log('HGT chưa form:', h.length); for (const r of h) console.log(JSON.stringify(r))
const g = await q(`select q.ma_cau, q.dang_chinh, q.da_duyet, q.kho_chuan, q.loai_cau, q.noi_dung, q.dap_an, q.anh_de from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai=q.dang_chinh where q.xoa_at is null and b.muc_do<=3 and b.khoi in ('8','9') and q.dap_an is not null and q.dap_an<>'' and q.lua_chon is null and q.menh_de is null and not exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau=q.ma_cau and f.xoa_at is null) order by 1`)
console.log('HH mức<=3 chưa form:', g.length); for (const r of g) console.log(JSON.stringify(r))
await c.end()
