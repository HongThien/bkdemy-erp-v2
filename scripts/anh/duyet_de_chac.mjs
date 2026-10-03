// ============================================================================
// duyet_de_chac.mjs — DUYỆT ĐỀ THI khi MỌI câu của đề đã chắc chắn (Thùy 02/10: "câu nào chắc chắn rồi thì duyệt luôn,
// câu nào chưa chắc thì để người duyệt").
//
//   node scripts/anh/duyet_de_chac.mjs [--mon "Tiếng Anh"] [--ghi]
//
// KHÔNG gọi fn_de_thi_duyet: hàm đó cần nhân sự đăng nhập VÀ duyệt luôn mọi câu trong đề (kể cả câu đang chờ người).
// Ở đây chỉ đánh dấu ĐỀ đã duyệt khi đề đã sẵn sàng thật — câu nào còn chờ thì đề nằm lại "Chờ duyệt" cho người:
//   · mọi câu đã duyệt (da_duyet — cổng tự duyệt câu chắc chắn) · không câu nào "đã xoá"
//   · fn_de_thi_thieu: so_chan = 0 (đủ đáp án/phương án), so_chua_dang = 0 (không câu ở dạng chờ)
//   · đề không THIẾU số câu so với đề gốc (cau_hinh.deThi.cauThieu rỗng — thiếu câu thì người quyết đề có dùng được không)
// Ghi: tai_lieu.duyet_at = now(), duyet_boi = NULL (trigger ghi tai_lieu_duyet_log với nhan_su_id NULL = máy) +
// cau_hinh.deThi.duyetMay = {at, ly_do} để màn/nhật ký phân biệt đề máy duyệt với đề người duyệt.
// Không --ghi: chạy trong transaction rồi ROLLBACK, in danh sách.
// ============================================================================
import pg from 'pg'
import { env } from './luat_chac_chan.mjs'

const argv = process.argv.slice(2)
const GHI = argv.includes('--ghi')
const MON = argv.includes('--mon') ? argv[argv.indexOf('--mon') + 1] : 'Tiếng Anh'
const c = new pg.Client({ connectionString: env().DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const ds = (await c.query(
    `select t.id, t.ten, coalesce(jsonb_array_length(t.cau_hinh -> 'deThi' -> 'cauThieu'), 0) thieu_so,
            (select count(*) from fn_de_thi_cau(t.id))::int n,
            (select count(*) filter (where not da_duyet or xoa) from fn_de_thi_cau(t.id))::int chua,
            (fn_de_thi_thieu(t.id) ->> 'so_chan')::int chan, (fn_de_thi_thieu(t.id) ->> 'so_chua_dang')::int chua_dang
       from tai_lieu t where t.loai = 'de_thi' and t.mon = $1 and t.duyet_at is null order by t.created_at`, [MON])).rows
  const duoc = ds.filter((d) => d.n > 0 && d.chua === 0 && d.chan === 0 && d.chua_dang === 0 && d.thieu_so === 0)
  for (const d of duoc) {
    await c.query(
      `update tai_lieu set duyet_at = now(), duyet_boi = null, updated_at = now(),
              cau_hinh = jsonb_set(cau_hinh, '{deThi,duyetMay}', jsonb_build_object('at', now(), 'ly_do',
                'mọi câu đã tự duyệt (bên A giải mù trùng đáp án nguồn + A/B thống nhất điểm kiến thức), đủ đáp án, đủ số câu'))
        where id = $1 and duyet_at is null`, [d.id])
  }
  const ly = { 'còn câu chờ người': ds.filter((d) => d.chua > 0).length, 'thiếu đáp án': ds.filter((d) => d.chan > 0).length,
    'câu ở dạng chờ': ds.filter((d) => d.chua_dang > 0).length, 'thiếu số câu so với gốc': ds.filter((d) => d.thieu_so > 0).length }
  console.log(`${GHI ? 'ĐÃ DUYỆT' : 'CHẠY THỬ (rollback)'} — môn ${MON}: ${duoc.length}/${ds.length} đề chưa duyệt đủ điều kiện máy duyệt`)
  for (const d of duoc) console.log('  ✓', d.ten)
  console.log('  còn lại (một đề có thể vướng nhiều lý do):', ly)
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  await c.query('rollback'); console.error('❌', e.message); process.exit(1)
} finally { await c.end() }
