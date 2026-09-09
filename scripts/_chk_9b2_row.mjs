import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const id='59f99003'
const b=(await c.query(`select id,ma_buoi,ngay,thu,gio_bat_dau,gio_ket_thuc,phong,nguoi_day,trang_thai,ly_do_huy,ingame_dong_at,et_dong_at,danh_gia_xong_at,btvn_dong_at,mt_dong_at from buoi_hoc where id::text like $1||'%'`,[id])).rows[0]
console.log('BUOI:',JSON.stringify(b,null,1))
const full=b.id
const hs=(await c.query(`select count(*)::int c, count(diem_danh)::int dd from buoi_hoc_hs where buoi_hoc_id=$1`,[full])).rows[0]
console.log(`buoi_hoc_hs: ${hs.c} HS · đã điểm danh: ${hs.dd}`)
// mọi bảng FK→buoi_hoc có tham chiếu row này?
const fks=['gami_session','gami_buoi_problem','gami_session_problems','bo_tro_yeu','bo_tro_duoi','danh_gia_hs_buoi','bai_tap_ve_nha']
for(const t of fks){ try{ const r=(await c.query(`select count(*)::int c from ${t} where buoi_hoc_id=$1`,[full])).rows[0]; if(r.c>0) console.log(`  ${t}: ${r.c} row THAM CHIẾU`) }catch(e){} }
await c.end()
