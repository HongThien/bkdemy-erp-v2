import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const LOP='8d58730a-8918-453a-9df0-4d774b4df8b7'
const t='2026-08-03'
const hs=(await c.query(`select hoc_sinh_id, ngay_vao::text nv from hoc_sinh_lop where lop_id=$1 and trang_thai='dang_hoc' limit 200`,[LOP])).rows
const roster=hs.filter(h=>!h.nv || h.nv<=t)
console.log(`9B2 roster dang_hoc: ${hs.length} · hợp lệ tính tới ${t}: ${roster.length}`)
console.log('  ngay_vao mẫu:', hs.slice(0,3).map(h=>h.nv).join(', '))
const s1=(await c.query(`select tk.id, tk.thu, tk.gio_bat_dau, tk.hieu_luc_den::text hd from thoi_khoa_bieu tk join lop l on l.id=tk.lop_id where l.ten_lop ilike '%9S1%' and tk.gio_bat_dau<'17:00:00' and (tk.hieu_luc_den is null or tk.hieu_luc_den>=$1) order by tk.thu`,[t])).rows
console.log('\n9S1 slot NGÀY còn hiệu lực hôm nay:')
for(const s of s1) console.log(`  id=${s.id} T${s.thu} ${String(s.gio_bat_dau).slice(0,5)} đến ${s.hd}`)
await c.end()
