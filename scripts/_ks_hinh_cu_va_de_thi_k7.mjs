// Khảo sát (chỉ đọc): (A) mô hình Hình cũ đang được THAM CHIẾU ở đâu — để biết ẩn ở tầng nào thì an toàn;
// (B) kho đề thi khối 7 có bao nhiêu bài Hình nhiều ý, có lời giải chưa. Chạy: node scripts/_ks_hinh_cu_va_de_thi_k7.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const q = async (s, p) => (await c.query(s, p)).rows
console.log('A1 phan theo khối:'); console.table(await q(`select m.khoi, coalesce(m.phan,'(null)') phan, count(distinct m.id)::int mo_hinh, count(b.id)::int bai from hinh_mo_hinh m left join hinh_baitoan b on b.mo_hinh_id=m.id group by 1,2 order by 1,2`))
console.log('A2 FK trỏ vào hinh_baitoan / hinh_mo_hinh:')
const fk = await q(`select cl.relname bang, a.attname cot, cf.relname toi from pg_constraint k join pg_class cl on cl.oid=k.conrelid join pg_class cf on cf.oid=k.confrelid join pg_attribute a on a.attrelid=k.conrelid and a.attnum=k.conkey[1] where k.contype='f' and cf.relname in ('hinh_baitoan','hinh_mo_hinh') order by 1`)
for (const f of fk) {
  const [r] = await q(`select count(*)::int n from ${f.bang} where ${f.cot} is not null`).catch(() => [{ n: 'lỗi' }])
  console.log(`  ${f.bang}.${f.cot} → ${f.toi}: ${r.n} dòng`)
}
console.log('B1 đề thi theo khối/loại:'); console.table(await q(`select khoi, loai, count(*)::int so from tai_lieu where loai in ('de_thi') group by 1,2 order by 1`))
const cols = await q(`select column_name from information_schema.columns where table_name='tai_lieu' order by ordinal_position`)
console.log('cột tai_lieu:', cols.map(x => x.column_name).join(', '))
const cols2 = await q(`select column_name from information_schema.columns where table_name='tai_lieu_cau' order by ordinal_position`)
console.log('cột tai_lieu_cau:', cols2.map(x => x.column_name).join(', '))
await c.query('ROLLBACK'); await c.end()
