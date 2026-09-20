// Read-only: HS có buổi bổ trợ yếu ĐÃ XẾP CHƯA HỌC mà lại có "đợt mới" (case khác / dạng mới gộp / duyệt lại) — hình dạng thật trong DB
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s) => (await c.query(s)).rows
console.log('A. HS có ≥2 case dang_xu cùng môn:', JSON.stringify(await q(`select hs.ho_ten, y.mon, count(*)::int n from bo_tro_yeu y join hoc_sinh hs on hs.id=y.hoc_sinh_id where y.trang_thai='dang_xu' group by 1,2 having count(*)>1`)))
console.log('B. trạng thái case:', JSON.stringify(await q(`select trang_thai, count(*)::int n, count(*) filter (where case_truoc_id is not null)::int co_case_truoc from bo_tro_yeu group by 1`)))
const r = await q(`
  with buoi as (select hh.bo_tro_yeu_id cid, count(*) filter (where b.trang_thai='mo' and b.danh_gia_xong_at is null)::int cho_hoc, count(*) filter (where b.trang_thai='hoan_tat' or b.danh_gia_xong_at is not null)::int da_hoc,
      min(b.created_at) filter (where b.trang_thai='mo' and b.danh_gia_xong_at is null) xep_at, min(b.ngay) filter (where b.trang_thai='mo' and b.danh_gia_xong_at is null)::text ngay_hoc
    from buoi_hoc_hs hh join buoi_hoc b on b.id=hh.buoi_hoc_id where hh.bo_tro_yeu_id is not null and b.loai='bo_tro_yeu' group by 1)
  select hs.ho_ten, hs.khoi, y.mon, buoi.cho_hoc, buoi.da_hoc, buoi.ngay_hoc,
    (select count(*)::int from bo_tro_yeu_dang d where d.bo_tro_yeu_id=y.id and d.dong_at is null) dang_mo,
    (select count(*)::int from bo_tro_yeu_dang d where d.bo_tro_yeu_id=y.id and d.created_at > buoi.xep_at) dang_them_sau_khi_xep,
    (select count(*)::int from hs_level_log l where l.hoc_sinh_id=y.hoc_sinh_id and l.mon=y.mon and l.loai='kien_thuc' and l.created_at > buoi.xep_at) duyet_lai_sau_khi_xep
  from bo_tro_yeu y join buoi on buoi.cid=y.id join hoc_sinh hs on hs.id=y.hoc_sinh_id
  where y.trang_thai='dang_xu' and buoi.cho_hoc > 0`)
console.log(`C. case đang có buổi ĐÃ XẾP CHƯA HỌC: ${r.length} · trong đó có dạng thêm sau khi xếp: ${r.filter(x => x.dang_them_sau_khi_xep > 0).length} · có duyệt lại sau khi xếp: ${r.filter(x => x.duyet_lai_sau_khi_xep > 0).length} · có >1 buổi chờ học: ${r.filter(x => x.cho_hoc > 1).length}`)
for (const x of r.filter(x => x.dang_them_sau_khi_xep > 0 || x.duyet_lai_sau_khi_xep > 0 || x.cho_hoc > 1).slice(0, 15)) console.log('  ', JSON.stringify(x))
console.log('D. cột bo_tro_yeu:', (await q(`select column_name from information_schema.columns where table_name='bo_tro_yeu' order by ordinal_position`)).map(x => x.column_name).join(', '))
await c.end()
