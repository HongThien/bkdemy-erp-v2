// Khảo sát (chỉ đọc): đề thi của một khối có bao nhiêu câu HÌNH (kho hinh_hoc_cau_hoi), gom thành bao nhiêu BÀI nhiều ý,
// có lời giải / hình chưa. Chạy: node scripts/_ks_de_thi_hinh.mjs 7
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const khoi = process.argv[2] || '7'
const q = async (s, p) => (await c.query(s, p)).rows
const cot = (await q(`select column_name from information_schema.columns where table_name='hinh_hoc_cau_hoi' order by ordinal_position`)).map(x => x.column_name)
console.log('cột hinh_hoc_cau_hoi:', cot.join(', '))
const de = await q(`
  select t.id, t.ten, t.created_at::date ngay,
    (select count(*) from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id where p.tai_lieu_id=t.id)::int so_cau,
    (select count(*) from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=t.id)::int cau_hinh_hoc,
    (select count(*) from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=t.id and coalesce(h.loi_giai,'')<>'')::int co_loi_giai,
    jsonb_array_length(coalesce(t.cau_hinh->'deThi'->'nhomBai','[]'::jsonb)) so_nhom_bai,
    (t.cau_hinh->'deThi' ? 'nhanCau') co_nhan
  from tai_lieu t where t.loai='de_thi' and t.khoi=$1 order by t.created_at`, [khoi]).catch(async e => { console.log('lỗi:', e.message); return [] })
console.table(de)
await c.query('ROLLBACK'); await c.end()
