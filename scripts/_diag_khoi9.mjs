import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const t=(await c.query(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d`)).rows[0].d
console.log('Hôm nay =',t,'\n')
const lops=(await c.query(`select id,ten_lop,mon,khoi,trang_thai from lop where (khoi='9' or ten_lop ~* '^9') order by ten_lop`)).rows
for(const l of lops){
  const tkb=(await c.query(`select thu,gio_bat_dau,gio_ket_thuc,hieu_luc_tu,hieu_luc_den from thoi_khoa_bieu where lop_id=$1 and (hieu_luc_den is null or hieu_luc_den>=$2) order by gio_bat_dau,thu`,[l.id,t])).rows
  const day=tkb.filter(s=>String(s.gio_bat_dau)<'17:00:00'), eve=tkb.filter(s=>String(s.gio_bat_dau)>='17:00:00')
  const buoiToday=(await c.query(`select id,gio_bat_dau,trang_thai,ly_do_huy from buoi_hoc where lop_id=$1 and ngay=$2 order by gio_bat_dau`,[l.id,t])).rows
  console.log(`● ${l.ten_lop}/${l.mon} [${l.trang_thai}]`)
  console.log(`   TKB còn hiệu lực: NGÀY=[${day.map(s=>`T${s.thu} ${String(s.gio_bat_dau).slice(0,5)}(đến ${s.hieu_luc_den?String(s.hieu_luc_den).slice(0,10):'∞'})`).join(', ')||'-'}]  TỐI=[${eve.map(s=>`T${s.thu} ${String(s.gio_bat_dau).slice(0,5)}(từ ${String(s.hieu_luc_tu).slice(0,10)})`).join(', ')||'-'}]`)
  if(buoiToday.length) console.log(`   Buổi HÔM NAY: ${buoiToday.map(b=>`${String(b.gio_bat_dau||'').slice(0,5)}·${b.trang_thai}${b.ly_do_huy?`(${b.ly_do_huy})`:''}·${b.id.slice(0,8)}`).join('  |  ')}`)
}
await c.end()
