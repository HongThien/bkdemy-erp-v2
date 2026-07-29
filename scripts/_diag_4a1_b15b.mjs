import pg from 'pg'; import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f,'utf8').split('\n').map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,'')]))
const E = { ...envf('.env') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()
const id='3ddfa851-73f6-4501-b25c-cd68e50c6dba'
const b=(await c.query('select id,ngay,loai,trang_thai,ingame_dong_at,et_dong_at,mt_dong_at,danh_gia_xong_at,nguoi_day,nguoi_day_tg from buoi_hoc where id=$1',[id])).rows[0]
console.log('BUỔI:', JSON.stringify(b,null,1))
const dd=(await c.query('select diem_danh, count(*) c from buoi_hoc_hs where buoi_hoc_id=$1 group by diem_danh',[id])).rows
console.log('Điểm danh:', JSON.stringify(dd))
const prob=(await c.query('select phase, count(*) c from gami_session_problems where buoi_hoc_id=$1 group by phase',[id])).rows
console.log('session_problems:', JSON.stringify(prob))
const g=(await c.query("select count(*) c from gami_grades gr join gami_session_problems p on gr.problem_id=p.id where p.buoi_hoc_id=$1 and p.phase='et'",[id])).rows
console.log('grades ET:', JSON.stringify(g))
// người phụ trách tên
const staff=(await c.query('select id, ho_ten from nhan_su where id = any($1)',[[b.nguoi_day,b.nguoi_day_tg].filter(Boolean)])).rows
console.log('GV/TG:', JSON.stringify(staff))
await c.end()
