// DIAG (READ-ONLY) phần 2 — ngay_khai_giang + TKB ids + audit lop state
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const lops = (await c.query(
  `select id, ten_lop, mon, trang_thai, ngay_khai_giang, created_at, updated_at
     from lop where ten_lop ilike any(array['%8B2%','%9B2%']) order by ten_lop`)).rows
for (const l of lops) {
  console.log(`\n### ${l.ten_lop}/${l.mon} — trang_thai=${l.trang_thai} · khai_giang=${l.ngay_khai_giang?String(l.ngay_khai_giang).slice(0,10):'(NULL!)'} · upd=${String(l.updated_at).slice(0,19)} · id=${l.id}`)
  const tkb = (await c.query(
    `select id,thu,gio_bat_dau,gio_ket_thuc,hieu_luc_tu,hieu_luc_den,phong,created_at
       from thoi_khoa_bieu where lop_id=$1 order by hieu_luc_tu,thu,gio_bat_dau`, [l.id])).rows
  for (const s of tkb) console.log(`   TKB id=${s.id} | T${s.thu} ${String(s.gio_bat_dau).slice(0,5)}-${String(s.gio_ket_thuc).slice(0,5)} | ${String(s.hieu_luc_tu).slice(0,10)}→${s.hieu_luc_den?String(s.hieu_luc_den).slice(0,10):'∞'} | ${s.phong||'-'} | tạo ${String(s.created_at).slice(0,19)}`)
  // roster
  const n = (await c.query(`select count(*)::int c from hoc_sinh_lop where lop_id=$1 and trang_thai='dang_hoc'`, [l.id])).rows[0].c
  console.log(`   HS đang học: ${n}`)
}

// audit log cho buổi 9B2 bị huỷ (nếu có bảng lịch sử)
const tbls = (await c.query(`select table_name from information_schema.tables where table_schema='public' and (table_name ilike '%buoi%log%' or table_name ilike '%log%buoi%' or table_name ilike '%buoi_hoc_ls%' or table_name ilike '%lich_su%')`)).rows
console.log('\nBảng lịch sử khả dĩ:', tbls.map(t=>t.table_name).join(', ')||'(không thấy)')

await c.end()
console.log('\n(READ-ONLY)')
