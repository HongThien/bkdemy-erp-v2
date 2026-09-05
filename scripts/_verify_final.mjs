import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const t='2026-08-03', thu=2  // Mon = T2
async function sim(name){
  const l=(await c.query(`select id,ten_lop,trang_thai,ngay_khai_giang::text kg from lop where ten_lop ilike $1 limit 1`,[`%${name}%`])).rows[0]
  const okLop = l.trang_thai==='dang_hoc' && l.kg && l.kg<=t
  const slots=(await c.query(`select gio_bat_dau,gio_ket_thuc from thoi_khoa_bieu where lop_id=$1 and thu=$2 and hieu_luc_tu<=$3 and (hieu_luc_den is null or hieu_luc_den>=$3) order by gio_bat_dau`,[l.id,thu,t])).rows
  const buoi=(await c.query(`select gio_bat_dau,trang_thai,ly_do_huy from buoi_hoc where lop_id=$1 and ngay=$2 and loai='thuong' order by created_at limit 1`,[l.id,t])).rows[0]
  const shown = okLop? slots.length:0
  const hs=buoi? (await c.query(`select count(*)::int c from buoi_hoc_hs bh join buoi_hoc b on b.id=bh.buoi_hoc_id where b.lop_id=$1 and b.ngay=$2 and b.loai='thuong'`,[l.id,t])).rows[0].c : 0
  console.log(`${l.ten_lop.padEnd(5)} [${l.trang_thai}] → ${shown} ca hôm nay: [${slots.map(s=>String(s.gio_bat_dau).slice(0,5)).join(',')||'—'}]  | row: ${buoi?`${String(buoi.gio_bat_dau).slice(0,5)}·${buoi.trang_thai}${buoi.ly_do_huy?`(${buoi.ly_do_huy})`:''}·${hs}HS`:'(ảo, chưa đẻ)'}`)
}
console.log('=== Ca hôm nay (T2 03/08) sau khi sửa ===')
for(const n of ['8B2','9B2','9S1','9A1','9C1']) await sim(n)
await c.end()
