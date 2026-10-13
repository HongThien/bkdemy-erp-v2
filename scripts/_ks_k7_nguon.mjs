// Khảo sát (chỉ đọc): khối 7 có những tài liệu / câu Hình nào trong DB. Chạy: node scripts/_ks_k7_nguon.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const q = async (s, p) => (await c.query(s, p)).rows
console.log('tai_lieu khối 7 theo loại:'); console.table(await q(`select loai, coalesce(nhanh,'(đại)') nhanh, count(*)::int so from tai_lieu where khoi='7' group by 1,2 order by 3 desc`))
console.log('đề thi mọi khối, theo tháng tạo:'); console.table(await q(`select khoi, to_char(min(created_at),'DD/MM') tu, to_char(max(created_at),'DD/MM') den, count(*)::int so from tai_lieu where loai='de_thi' group by 1 order by 1`))
console.log('câu Hình–Học khối 7 theo nguồn:'); console.table(await q(`
  select coalesce(nullif(split_part(c.nguon,' — ',1),''),'(trống)') nguon, count(*)::int so, count(*) filter (where coalesce(c.loi_giai,'')<>'')::int co_lg
  from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='7' and c.xoa_at is null group by 1 order by 2 desc limit 25`))
await c.query('ROLLBACK'); await c.end()
