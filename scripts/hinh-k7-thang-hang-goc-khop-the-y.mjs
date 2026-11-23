// Sau `hinh-k7-cong-goc-them.mjs` (23/11): 29 câu GỐC của các bài–ý vừa đẩy vào HH00170–172 còn `dang_chinh = HH07000000`.
// LUẬT DỜI BÀI (spec-ban-do-toan.md § Hình–Học, 23/11): bài nằm ở THẺ Ý, nhưng câu gốc phải đổi `dang_chinh` cho khớp thẻ ý.
// Chỉ đổi `dang_chinh` của câu gốc (đang `rut_khoi_kho = true`, chưa duyệt) theo thẻ ý của chính nó. Không đổi gì khác, không xoá gì.
//   node scripts/hinh-k7-thang-hang-goc-khop-the-y.mjs          # chạy thử (ROLLBACK)
//   node scripts/hinh-k7-thang-hang-goc-khop-the-y.mjs --ghi
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const ds = (await c.query(`
    select g.ma_cau, g.dang_chinh cu, y.dang_chinh moi, y.ma_bai_y
      from hinh_hoc_bai_y y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc
     where y.xoa_at is null and y.dang_chinh in ('HH00170','HH00171','HH00172') and y.ma_bai_y >= 'HHB001500'
       and g.dang_chinh = 'HH07000000' and g.rut_khoi_kho and not g.da_duyet and g.xoa_at is null
     order by y.ma_bai_y for update of g`)).rows
  console.log('câu gốc cần khớp thẻ ý:', ds.length)
  for (const r of ds) await c.query(`update hinh_hoc_cau_hoi set dang_chinh = $2 where ma_cau = $1`, [r.ma_cau, r.moi])
  const k = (await c.query(`
    select count(*) filter (where g.dang_chinh <> y.dang_chinh) lech, count(*) filter (where not g.rut_khoi_kho) goc_trong_kho, count(*) tong
      from hinh_hoc_bai_y y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc
     where y.xoa_at is null and y.dang_chinh in ('HH00170','HH00171','HH00172')`)).rows[0]
  // đếm bằng ĐÚNG công thức của `count_cau_by_bai_hh` (màn kho; hàm đó có cổng thành viên nên script không gọi thẳng được): câu sống, bỏ câu gốc đã có thẻ ý
  const dem = (await c.query(`
    select c.dang_chinh, count(*) n from hinh_hoc_cau_hoi c
     where c.xoa_at is null and c.dang_chinh in ('HH00170','HH00171','HH00172','HH07000000')
       and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)
     group by 1 order by 1`)).rows
  console.log('kiểm (mọi thẻ ý của 3 bài):', k, '\nđếm theo công thức của màn kho:', dem.map((r) => `${r.dang_chinh}=${r.n}`).join(' · '))
  if (+k.lech || +k.goc_trong_kho) throw new Error('còn câu gốc lệch bài hoặc chưa rút khỏi kho')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '(chạy thử — đã ROLLBACK, thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ:', e.message); process.exitCode = 1 }
await c.end()
