// Read-only: hiện trạng retest + case đang "Chờ retest" (trước khi hold luồng retest, 29/09).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (t, sql) => { const r = await c.query(sql); console.log('\n## ' + t); console.table(r.rows) }
await q('bài retest theo trạng thái', `select bt.trang_thai, (bl.trang_thai = 'da_nop') as da_nop, bt.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date as qua_han, count(*)
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id where bt.loai = 'retest' group by 1,2,3 order by 1,2,3`)
await q('bài retest chưa nộp theo ngày', `select bt.ngay, count(*) from bai_test bt where bt.loai='retest' and bt.trang_thai='mo'
  and not exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai='da_nop') group by 1 order by 1`)
await q('case theo bước (fn_btyeu_trang_thai_ca logic)', `select x->>'buoc' buoc, count(*) from jsonb_array_elements(
  (select coalesce(jsonb_agg(v), '[]') from (select jsonb_array_elements(public.fn_btyeu_trang_thai_ca(60)) v) s)) x group by 1`)
await q('dạng: trạng thái trong case dang_xu', `select (d.day_at is not null) da_day, d.dat, (d.dong_at is not null) da_dong, d.retest_nguon, count(*)
  from bo_tro_yeu_dang d join bo_tro_yeu y on y.id = d.bo_tro_yeu_id where y.trang_thai='dang_xu' group by 1,2,3,4 order by 1,2,3`)
await q('dạng đã đóng: đóng bằng gì', `select d.retest_nguon, d.dat, count(*) from bo_tro_yeu_dang d where d.dong_at is not null group by 1,2`)
await q('case hoàn thành: kết quả', `select ket_qua, count(*) from bo_tro_yeu where trang_thai='hoan_thanh' group by 1`)
await c.end()
