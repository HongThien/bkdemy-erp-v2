// DIAG (READ-ONLY) — 8B2 không hiện ca hôm nay + 9B2 bị huỷ do nhân đôi.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const today = (await c.query(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d, extract(isodow from (now() at time zone 'Asia/Ho_Chi_Minh')) as dow`)).rows[0]
console.log(`\n=== HÔM NAY (giờ VN) = ${String(today.d).slice(0,10)}  (thu ISO=${today.dow}) ===`)

for (const q of ['8B2', '9B2']) {
  console.log(`\n\n########## LỚP "${q}" ##########`)
  const lops = (await c.query(
    `select id, ten_lop, mon, khoi, trang_thai from lop where ten_lop ilike $1 order by ten_lop`, [`%${q}%`])).rows
  console.log('Lớp khớp:', lops.map(l=>`${l.ten_lop}[${l.mon},${l.trang_thai},id=${l.id.slice(0,8)}]`).join(' · ') || '(KHÔNG có)')
  if (!lops.length) continue
  const ids = lops.map(l=>l.id)
  const ten = new Map(lops.map(l=>[l.id, `${l.ten_lop}/${l.mon}`]))

  // TKB slots
  const tkb = (await c.query(
    `select id,lop_id,thu,gio_bat_dau,gio_ket_thuc,hieu_luc_tu,hieu_luc_den,phong
       from thoi_khoa_bieu where lop_id = any($1) order by lop_id,thu,gio_bat_dau`, [ids])).rows
  console.log(`\n-- TKB slots (${tkb.length}) --`)
  for (const s of tkb) console.log(`   ${ten.get(s.lop_id)} | T${s.thu} ${String(s.gio_bat_dau).slice(0,5)}-${String(s.gio_ket_thuc).slice(0,5)} | hiệu lực ${String(s.hieu_luc_tu).slice(0,10)} → ${s.hieu_luc_den?String(s.hieu_luc_den).slice(0,10):'∞'} | ${s.phong||''}`)

  // buoi_hoc quanh hôm nay (±10 ngày) + toàn bộ buổi huỷ gần đây
  const bh = (await c.query(
    `select id,lop_id,ma_buoi,ngay,thu,loai,trang_thai,ly_do_huy,gio_bat_dau,gio_ket_thuc,phong,nguoi_day,created_at,updated_at
       from buoi_hoc
      where lop_id = any($1)
        and ngay between (now() at time zone 'Asia/Ho_Chi_Minh')::date - 12
                     and (now() at time zone 'Asia/Ho_Chi_Minh')::date + 12
      order by ngay, gio_bat_dau`, [ids])).rows
  console.log(`\n-- buoi_hoc quanh hôm nay [${bh.length}] --`)
  for (const b of bh) {
    const mark = String(b.ngay).slice(0,10) === String(today.d).slice(0,10) ? ' <== HÔM NAY' : ''
    console.log(`   ${ten.get(b.lop_id)} | ${String(b.ngay).slice(0,10)} T${b.thu} ${String(b.gio_bat_dau||'').slice(0,5)} | ${b.loai} | ${b.trang_thai}${b.ly_do_huy?` (huỷ: ${b.ly_do_huy})`:''} | id=${b.id.slice(0,8)} | upd=${String(b.updated_at).slice(0,19)}${mark}`)
  }

  // riêng: mọi buổi trạng thái huỷ (bất kể ngày) 30 ngày gần nhất
  const huy = (await c.query(
    `select id,ngay,thu,loai,ly_do_huy,gio_bat_dau,updated_at
       from buoi_hoc where lop_id=any($1) and trang_thai='huy'
        and ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 30
      order by ngay`, [ids])).rows
  console.log(`\n-- buổi HUỶ 30 ngày gần đây [${huy.length}] --`)
  for (const b of huy) console.log(`   ${String(b.ngay).slice(0,10)} T${b.thu} ${String(b.gio_bat_dau||'').slice(0,5)} | ${b.loai} | huỷ:${b.ly_do_huy||'(trống)'} | id=${b.id.slice(0,8)} | upd=${String(b.updated_at).slice(0,19)}`)
}
await c.end()
console.log('\n(READ-ONLY — không ghi gì.)')
