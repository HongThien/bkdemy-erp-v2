import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const { rows } = await c.query(`
  select jsonb_pretty(coalesce(jsonb_agg(jsonb_build_object(
    'loai', b.loai, 'ngay', b.ngay, 'gio', b.gio_bat_dau, 'phong', b.phong,
    'mon', case b.loai when 'bo_tro_yeu' then y.mon else l.mon end,
    'nguoi', coalesce(ns.ho_ten, ns2.ho_ten), 'dd', hh.diem_danh,
    'vao_ca', coalesce(b.loai = 'bo_tro_yeu' and b.ngay = public._btyeu_today() and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null, false)
  ) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)) as j
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id
  left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
  left join lop l on l.id = coalesce(bg.lop_id, d.lop_id)
  left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day
  where hh.hoc_sinh_id = '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb' and b.loai in ('bo_tro_yeu','bu','bo_tro_duoi') and b.trang_thai='mo' and b.ngay >= public._btyeu_today()`)
console.log('Tùng:', rows[0].j)
const f = await c.query(`select proname, prosecdef from pg_proc where proname = 'fn_hs_lich_bo_tro'`)
console.log('fn:', JSON.stringify(f.rows))
const n = await c.query(`select b.loai, count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id=hh.buoi_hoc_id where b.loai in ('bo_tro_yeu','bu','bo_tro_duoi') and b.trang_thai='mo' and b.ngay >= public._btyeu_today() group by 1`)
console.log('toàn hệ, buổi mở sắp tới theo loại:', JSON.stringify(n.rows))
await c.end()
