import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,20))}
await p('AI đang GHI hoá đơn (kiểm trước khi xoá quyền ghi)', `
  select coalesce(ns.ma_ns,'(không rõ)') as ma_ns, coalesce(ns.ho_ten,'(không map được)') as ho_ten,
         count(*) as so_hoa_don, max(h.created_at)::date as gan_nhat
  from hoa_don h
  left join tai_khoan tk on tk.id = h.created_by
  left join nhan_su ns on ns.id = tk.nhan_su_id
  group by 1,2 order by 3 desc`)
await p('Hàm quyền đang có — để policy mới bám đúng khuôn', `
  select proname, pg_get_function_identity_arguments(oid) as args, prosecdef as security_definer
  from pg_proc where pronamespace='public'::regnamespace
    and proname in ('la_thanh_vien','my_quyen','jwt_uid','my_hoc_sinh_id','hs_o_lop')
  order by proname`)
const d = await c.query(`select prosrc from pg_proc where proname='la_thanh_vien' and pronamespace='public'::regnamespace`)
console.log('\n▸ la_thanh_vien() nguồn:\n', d.rows[0]?.prosrc?.trim())
const q = await c.query(`select prosrc from pg_proc where proname='my_quyen' and pronamespace='public'::regnamespace`)
console.log('\n▸ my_quyen() nguồn:\n', (q.rows[0]?.prosrc ?? '(không có)').trim().slice(0, 1200))
await c.end()
