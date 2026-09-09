// FIX (WRITE) — 9B2: biến row huỷ 59f99003 thành CA TỐI 19:30 + mở + seed 9 HS.
//               9S1: đóng 3 slot NGÀY (T2/T4/T6 09:00) tại 02/08 → hôm nay hết ca ban ngày.
// node scripts/_fix_9b2_9s1.mjs        (dry-run)
// node scripts/_fix_9b2_9s1.mjs apply  (ghi)
import { readFileSync } from 'node:fs'; import pg from 'pg'
const APPLY = process.argv[2] === 'apply'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()

const BUOI_9B2 = '59f99003-85dd-4891-a487-e983ccc3a5fe'
const LOP_9B2  = '8d58730a-8918-453a-9df0-4d774b4df8b7'
const GV_9B2   = 'e8573f34-65cf-4069-808c-44f10ee39c2e'
const NGAY     = '2026-08-03'
const S1_DAY_SLOTS = [ // 9S1 slot ngày trong tuần (KHÔNG đụng T8 14:00 ∞)
  '7701c62f-f48b-45d9-a1a2-1ecec86bee91', // T2 09:00
  'a1b1646a-fbbb-4d29-a21a-4e49baf6512b', // T4 09:00
  'd0f8e783-4651-4377-bff5-a345fdd8dbaf', // T6 09:00
]
console.log(`Mode: ${APPLY?'APPLY':'DRY-RUN'}\n`)

// trước
const b0=(await c.query(`select gio_bat_dau,gio_ket_thuc,phong,trang_thai,ly_do_huy,nguoi_day from buoi_hoc where id=$1`,[BUOI_9B2])).rows[0]
const hs0=(await c.query(`select count(*)::int c from buoi_hoc_hs where buoi_hoc_id=$1`,[BUOI_9B2])).rows[0].c
console.log(`9B2 row TRƯỚC: ${String(b0.gio_bat_dau).slice(0,5)}-${String(b0.gio_ket_thuc).slice(0,5)} · ${b0.trang_thai}${b0.ly_do_huy?`(${b0.ly_do_huy})`:''} · phòng=${b0.phong} · GV=${b0.nguoi_day||'∅'} · HS=${hs0}`)
const s0=(await c.query(`select thu,hieu_luc_den::text hd from thoi_khoa_bieu where id=any($1) order by thu`,[S1_DAY_SLOTS])).rows
console.log('9S1 slot ngày TRƯỚC:', s0.map(s=>`T${s.thu}→${s.hd}`).join(' '))

if(APPLY){
  await c.query('begin')
  // 1) 9B2 → ca tối, mở, xoá dấu đóng flow
  await c.query(`update buoi_hoc set gio_bat_dau='19:30:00', gio_ket_thuc='21:30:00', phong=null,
      trang_thai='mo', ly_do_huy=null, nguoi_day=$2,
      ingame_dong_at=null, et_dong_at=null, danh_gia_xong_at=null, btvn_dong_at=null, updated_at=now()
    where id=$1 and trang_thai='huy'`,[BUOI_9B2,GV_9B2])
  // seed roster (idempotent)
  const ins=await c.query(`insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id)
    select $1, hl.hoc_sinh_id from hoc_sinh_lop hl
     where hl.lop_id=$2 and hl.trang_thai='dang_hoc' and (hl.ngay_vao is null or hl.ngay_vao<=$3)
       and not exists (select 1 from buoi_hoc_hs bh where bh.buoi_hoc_id=$1 and bh.hoc_sinh_id=hl.hoc_sinh_id)`,[BUOI_9B2,LOP_9B2,NGAY])
  // 2) 9S1 đóng slot ngày
  const su=await c.query(`update thoi_khoa_bieu set hieu_luc_den='2026-08-02' where id=any($1)`,[S1_DAY_SLOTS])
  await c.query('commit')
  console.log(`\nGHI XONG: seed HS +${ins.rowCount} · 9S1 slots updated ${su.rowCount}`)

  const b1=(await c.query(`select gio_bat_dau,gio_ket_thuc,phong,trang_thai,nguoi_day from buoi_hoc where id=$1`,[BUOI_9B2])).rows[0]
  const hs1=(await c.query(`select count(*)::int c from buoi_hoc_hs where buoi_hoc_id=$1`,[BUOI_9B2])).rows[0].c
  console.log(`9B2 row SAU: ${String(b1.gio_bat_dau).slice(0,5)}-${String(b1.gio_ket_thuc).slice(0,5)} · ${b1.trang_thai} · GV=${b1.nguoi_day} · HS=${hs1}`)
  const s1=(await c.query(`select thu,hieu_luc_den::text hd from thoi_khoa_bieu where id=any($1) order by thu`,[S1_DAY_SLOTS])).rows
  console.log('9S1 slot ngày SAU:', s1.map(s=>`T${s.thu}→${s.hd}`).join(' '))
}else console.log('\n(DRY-RUN — thêm "apply")')
await c.end()
