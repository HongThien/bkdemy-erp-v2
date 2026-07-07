// Điều tra READ-ONLY (claude_ro): buổi bù nào gán cho 9C1 nhưng nội dung ET/đánh giá lại ra KHTN.
import pg from 'pg'
import { readFileSync } from 'fs'
// DATABASE_URL_RO không có sẵn trong .env project này (chỉ DATABASE_URL) — dùng DATABASE_URL, script CHỈ SELECT.
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

console.log('-- lớp 9C1 --')
const lop9c1 = await c.query(`select id, ten_lop, mon, khoi from lop where ten_lop ilike '%9C1%'`)
console.table(lop9c1.rows)

console.log('\n-- buổi bù gần đây (loai=bu), kèm roster + buổi MẸ (bu_cho) --')
const bu = await c.query(`
  select b.id as buoi_bu_id, b.ngay, b.created_at, b.nguoi_day, b.nguoi_day_tg,
         hs.ho_ten, hs.ma_hs,
         bhh.bu_cho_buoi_id,
         me.ngay as me_ngay, melop.ten_lop as me_lop, melop.mon as me_mon
  from buoi_hoc b
  join buoi_hoc_hs bhh on bhh.buoi_hoc_id = b.id
  join hoc_sinh hs on hs.id = bhh.hoc_sinh_id
  left join buoi_hoc me on me.id = bhh.bu_cho_buoi_id
  left join lop melop on melop.id = me.lop_id
  where b.loai = 'bu'
  order by b.created_at desc
  limit 40
`)
console.table(bu.rows.map(r => ({
  buoi_bu_id: r.buoi_bu_id.slice(0, 8), ngay: String(r.ngay).slice(0, 10), created: String(r.created_at).slice(0, 16),
  hs: r.ho_ten, ma_hs: r.ma_hs, me_lop: r.me_lop, me_mon: r.me_mon, me_ngay: r.me_ngay ? String(r.me_ngay).slice(0, 10) : null,
})))

console.log('\n-- gami_session_problems (phase=et) của các buổi bù trên, ma_dang + môn suy từ ma_dang --')
const probs = await c.query(`
  select p.buoi_hoc_id, p.hoc_sinh_id, p.ma_dang,
         dai.ten_dang as ten_toan, khtn.ten_dang as ten_khtn
  from gami_session_problems p
  join buoi_hoc b on b.id = p.buoi_hoc_id and b.loai = 'bu'
  left join dai_ban_do dai on dai.ma_dang = p.ma_dang
  left join khtn_ban_do khtn on khtn.ma_dang = p.ma_dang
  where p.phase = 'et'
  order by b.created_at desc
  limit 60
`)
console.table(probs.rows.map(r => ({ buoi: r.buoi_hoc_id.slice(0, 8), ma_dang: r.ma_dang, ten_toan: r.ten_toan, ten_khtn: r.ten_khtn })))

await c.end()
