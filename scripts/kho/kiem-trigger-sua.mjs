// ============================================================================
// kiem-trigger-sua.mjs — thử trigger ghi vết `kho_sua_log` chạy THẬT, rồi HOÀN TÁC toàn bộ.
//
// Mọi thao tác nằm trong 1 giao dịch kết thúc bằng ROLLBACK: không dòng nào của câu hay của log còn lại.
// Cần role GHI (DATABASE_URL_RW truyền lúc gọi, hoặc DATABASE_URL trong .env) vì phải UPDATE thử 1 câu.
//
//   node scripts/kho/kiem-trigger-sua.mjs
//
// ĐIỀU KIỆN: role đang nối phải ĐỌC được kho_sua_log. Bảng do `postgres` tạo (áp tay qua SQL Editor) + bật RLS
// ⇒ role CLI đọc ra 0 dòng, im lặng. Chạy SQL thêm policy ở spec-luong-kho-p0.md §4 trước, không thì script
// này báo "không thấy dòng log" dù trigger chạy đúng.
// ============================================================================
import pg from 'pg'
import { bien } from './cau-hinh.mjs'

const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('❌ Không có chuỗi kết nối GHI (DATABASE_URL_RW hoặc DATABASE_URL).'); process.exit(2) }
const c = new pg.Client({ connectionString: url })
await c.connect()
const kq = []
const ghi = (ten, dat, them = '') => { kq.push(dat); console.log(`${dat ? '✔' : '✖'} ${ten}${them ? ' — ' + them : ''}`) }

try {
  await c.query('begin')
  const { rows: [cau] } = await c.query(`select ma_cau, loi_giai, dap_an from dai_cau_hoi
    where xoa_at is null and coalesce(loi_giai, '') <> '' and coalesce(dap_an, '') <> '' order by ma_cau limit 1`)
  if (!cau) throw new Error('Không tìm được câu Đại nào có sẵn lời giải + đáp số để thử.')
  console.log('Câu thử:', cau.ma_cau, '(mọi thay đổi sẽ bị hoàn tác)\n')
  const dem = async () => (await c.query('select khau, truong, nguon, actor, cu, moi from kho_sua_log where ma_cau = $1 order by sua_at, truong', [cau.ma_cau])).rows

  // 1) MÁY sửa (không có jwt) — đổi đáp số
  const truoc = (await dem()).length
  await c.query('update dai_cau_hoi set dap_an = $2 where ma_cau = $1', [cau.ma_cau, cau.dap_an + ' (thử)'])
  let ds = await dem()
  ghi('máy đổi đáp số ⇒ thêm đúng 1 dòng log', ds.length === truoc + 1, `trước ${truoc}, sau ${ds.length}`)
  const d1 = ds.at(-1)
  ghi('dòng đó mang khâu dap_so, nguồn may, actor trống', !!d1 && d1.khau === 'dap_so' && d1.nguon === 'may' && d1.actor === null, d1 ? `${d1.khau}/${d1.nguon}/${d1.actor}` : 'không có dòng')

  // 2) NGƯỜI sửa (giả lập jwt của app) — đổi lời giải
  const uid = '00000000-0000-4000-8000-000000000001'
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid })])
  await c.query('update dai_cau_hoi set loi_giai = $2 where ma_cau = $1', [cau.ma_cau, cau.loi_giai + '\nDòng thêm để thử.'])
  ds = await dem()
  const d2 = ds.at(-1)
  ghi('người đổi lời giải ⇒ khâu loi_giai, nguồn nguoi, actor đúng người', !!d2 && d2.khau === 'loi_giai' && d2.nguon === 'nguoi' && d2.actor === uid, d2 ? `${d2.khau}/${d2.nguon}/${d2.actor}` : 'không có dòng')

  // 3) Ghi lại Y NGUYÊN + chỉ khác khoảng trắng ⇒ KHÔNG được tính là sửa
  const n3 = ds.length
  await c.query(`update dai_cau_hoi set loi_giai = '  ' || replace(loi_giai, E'\\n', E'\\r\\n') || ' ' where ma_cau = $1`, [cau.ma_cau])
  ds = await dem()
  ghi('chỉ khác khoảng trắng / kiểu xuống dòng ⇒ không thêm dòng log', ds.length === n3, `trước ${n3}, sau ${ds.length}`)

  // 4) Đổi cột KHÔNG thuộc nội dung ⇒ không log
  const n4 = ds.length
  await c.query(`update dai_cau_hoi set kiem_may_ghi = 'thử' where ma_cau = $1`, [cau.ma_cau])
  ghi('đổi cột ngoài nội dung ⇒ không thêm dòng log', (await dem()).length === n4)

  if (ds.length === truoc) console.log('\n⚠ Không thấy dòng log nào. Hai khả năng: trigger không chạy, HOẶC role này không đọc được kho_sua_log (RLS). Kiểm policy trước.')
} catch (e) {
  console.error('❌', e.message)
  kq.push(false)
} finally {
  await c.query('rollback').catch(() => {})
  const { rows: [r] } = await c.query(`select count(*)::int n from kho_sua_log where cu like '%(thử)%' or moi like '%(thử)%' or moi like '%Dòng thêm để thử.%'`).catch(() => ({ rows: [{ n: null }] }))
  console.log(`\nĐã ROLLBACK. Dòng thử còn sót trong log: ${r.n} (phải là 0).`)
  await c.end()
}
process.exit(kq.every(Boolean) ? 0 : 1)
