// Read-only: mọi em trong buổi bù mà buổi MẸ có ET nhưng buổi bù KHÔNG có ô ET của em (bug ensureBuoiBuETProblems seed 1 lần/BUỔI).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const r = await c.query(`
  select b.id bu, b.ngay, b.trang_thai, b.et_dong_at is not null et_dong, hs.ma_hs, hs.ho_ten, hh.diem_danh, l.ten_lop, me.ngay me_ngay,
         (select count(*) from gami_session_problems p where p.buoi_hoc_id = me.id and p.phase = 'et') et_me,
         (select count(*) from gami_session_problems p where p.buoi_hoc_id = b.id and p.phase = 'et') et_bu_ca_buoi,
         (select count(*) from gami_grades g where g.buoi_hoc_id = b.id and g.hoc_sinh_id = hh.hoc_sinh_id) diem_em
  from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
  join buoi_hoc me on me.id = hh.bu_cho_buoi_id left join lop l on l.id = me.lop_id
  where b.loai = 'bu' and b.trang_thai <> 'huy'
    and exists (select 1 from gami_session_problems p where p.buoi_hoc_id = me.id and p.phase = 'et')
    and not exists (select 1 from gami_session_problems p where p.buoi_hoc_id = b.id and p.phase = 'et' and p.hoc_sinh_id = hh.hoc_sinh_id)
  order by b.ngay desc, hs.ho_ten`)
console.table(r.rows.map((x) => ({ ...x, ngay: x.ngay.toISOString().slice(0, 10), me_ngay: x.me_ngay.toISOString().slice(0, 10), bu: x.bu.slice(0, 8) })))
console.log('Tổng', r.rows.length, 'em ·', new Set(r.rows.map((x) => x.bu)).size, 'buổi bù · trong đó buổi CÒN ô ET của em khác:', r.rows.filter((x) => Number(x.et_bu_ca_buoi) > 0).length)
await c.end()
