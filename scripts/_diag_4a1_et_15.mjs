import pg from 'pg'; import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f,'utf8').split('\n').map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,'')]))
const E = { ...envf('.env') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()

const lop = (await c.query("select id, ten_lop, mon from lop where ten_lop='4A1'")).rows
console.log('LỚP 4A1:', JSON.stringify(lop))
if (!lop.length) { await c.end(); process.exit(0) }
const lopId = lop[0].id

const buoi = (await c.query(`
  select id, ngay, loai, trang_thai, ingame_dong_at, et_dong_at, mt_dong_at, danh_gia_xong_at
  from buoi_hoc where lop_id=$1 and loai='thuong' and trang_thai<>'huy'
  order by ngay`, [lopId])).rows
console.log('\n=== BUỔI THƯỜNG 4A1 (không huỷ) ===')
for (const b of buoi) {
  console.log(`${b.ngay} | tt=${b.trang_thai} | ingame=${b.ingame_dong_at?'ĐÓNG':'—'} | ET=${b.et_dong_at?'ĐÓNG':'—'} | MT=${b.mt_dong_at?'ĐÓNG':'—'} | DG=${b.danh_gia_xong_at?'x':'—'} | id=${b.id}`)
}

// buổi 15/07 chi tiết
const b15 = buoi.find(b => String(b.ngay).slice(0,10) === '2026-07-15')
console.log('\n=== BUỔI 15/07 ===', b15 ? b15.id : 'KHÔNG TÌM THẤY buổi thường 15/07 (không huỷ)')
// thử cả buổi huỷ / mọi loại
const b15all = (await c.query(`select id, ngay, loai, trang_thai, et_dong_at from buoi_hoc where lop_id=$1 and ngay='2026-07-15'`, [lopId])).rows
console.log('MỌI buổi 15/07 (kể cả huỷ/loại khác):', JSON.stringify(b15all))

if (b15) {
  const dd = (await c.query(`select diem_danh, count(*) from buoi_hoc_hs where buoi_hoc_id=$1 group by diem_danh`, [b15.id])).rows
  console.log('Điểm danh 15/07:', JSON.stringify(dd))
  const prob = (await c.query(`select phase, count(*) from gami_session_problems where buoi_hoc_id=$1 group by phase`, [b15.id])).rows
  console.log('gami_session_problems 15/07:', JSON.stringify(prob))
  const grades = (await c.query(`select count(*) from gami_grades g join gami_session_problems p on g.problem_id=p.id where p.buoi_hoc_id=$1 and p.phase='et'`, [b15.id])).rows
  console.log('gami_grades ET 15/07:', JSON.stringify(grades))
}

// tài liệu ET (bai_test) khớp lớp+ngày 15/07
const bt = (await c.query(`select id, ngay, loai, so_cau from bai_test where lop_id=$1 and ngay='2026-07-15'`, [lopId])).rows
console.log('\nbai_test (tài liệu) 15/07:', JSON.stringify(bt))

// buổi thường TRƯỚC 15/07 chưa đóng ET (nguyên nhân khóa thứ tự)
const earlier = (await c.query(`
  select ngay, et_dong_at from buoi_hoc
  where lop_id=$1 and loai='thuong' and trang_thai<>'huy' and ngay<'2026-07-15' and et_dong_at is null
  order by ngay`, [lopId])).rows
console.log('\n=== BUỔI TRƯỚC 15/07 CHƯA ĐÓNG ET (khóa thứ tự) ===')
console.log(earlier.length ? JSON.stringify(earlier) : '(không có — khóa thứ tự KHÔNG chặn)')

await c.end()
