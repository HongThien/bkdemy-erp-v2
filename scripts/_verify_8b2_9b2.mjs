// VERIFY (READ-ONLY) — mô phỏng buoiAoCuaNgay(hôm nay) cho 8B2 & 9B2.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const today = (await c.query(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d, case when extract(isodow from (now() at time zone 'Asia/Ho_Chi_Minh'))=7 then 8 else extract(isodow from (now() at time zone 'Asia/Ho_Chi_Minh'))::int+1 end dow`)).rows[0]
console.log(`Hôm nay=${today.d} thu ISO=${today.dow}\n`)

for (const q of ['8B2','9B2']) {
  const lop = (await c.query(`select id,ten_lop,trang_thai,ngay_khai_giang from lop where ten_lop ilike $1 limit 1`, [`%${q}%`])).rows[0]
  // slot hiệu lực hôm nay (đúng filter buoiAoCuaNgay: thu, hieu_luc_tu<=ngay, hieu_luc_den>=ngay|null, dang_hoc, khai_giang<=ngay)
  const slots = (await c.query(
    `select gio_bat_dau,gio_ket_thuc,phong from thoi_khoa_bieu
      where lop_id=$1 and thu=$2 and hieu_luc_tu<=$3 and (hieu_luc_den is null or hieu_luc_den>=$3)
      order by gio_bat_dau`, [lop.id, today.dow, today.d])).rows
  const okLop = lop.trang_thai==='dang_hoc' && lop.ngay_khai_giang && String(lop.ngay_khai_giang).slice(0,10)<=today.d
  const buoi = (await c.query(`select id,gio_bat_dau,gio_ket_thuc,trang_thai,ly_do_huy from buoi_hoc where lop_id=$1 and ngay=$2 and loai='thuong' limit 1`, [lop.id, today.d])).rows[0]
  console.log(`### ${lop.ten_lop} — lớp ${lop.trang_thai} (hiện ca? ${okLop?'CÓ':'KHÔNG'})`)
  const shown = okLop ? slots : []
  console.log(`   slot hiệu lực hôm nay: ${slots.map(s=>`${String(s.gio_bat_dau).slice(0,5)}-${String(s.gio_ket_thuc).slice(0,5)}`).join(', ')||'(không)'}`)
  console.log(`   → SỐ CA UI hiện hôm nay: ${shown.length}`)
  console.log(`   buoi_hoc row hôm nay: ${buoi?`${String(buoi.gio_bat_dau).slice(0,5)} · ${buoi.trang_thai}${buoi.ly_do_huy?` (${buoi.ly_do_huy})`:''} · id=${buoi.id.slice(0,8)}`:'(chưa đẻ dòng — ảo)'}`)
  if (shown.length && buoi && buoi.trang_thai==='huy') console.log(`   ⚠ CA HIỆN nhưng buoi_hoc gắn là HUỶ → tối nay sẽ hiện ca huỷ/không mở được (cần xử lý row ${buoi.id.slice(0,8)}).`)
  console.log()
}
await c.end()
