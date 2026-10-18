// xep-hinh.mjs [--ghi] — xếp 43 câu Hình của bộ đề CKI (đang tạm ở HH00108) vào đúng bài theo chủ đề (Thùy 18/10: "đẩy vào tiếp tuyến đường tròn, không cần Ôn thi").
// Chỉ đổi dang_chinh (mã câu bất biến). Điều kiện UPDATE: câu vẫn ở HH00108 và chưa xoá ⇒ chạy lại an toàn. Mặc định ROLLBACK.
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const B = { DT: 'HH00105', LG: 'HH00095', CUNG: 'HH00106', QUAT: 'HH00107', TT: 'HH00108', TT2: 'HH00109' }
// ma_cau → bài đích (HH00108 giữ nguyên = tiếp tuyến/vị trí đt–đường tròn)
const MAP = {
  HHC003217: B.LG, HHC003218: B.TT2, HHC003219: B.LG, HHC003220: B.TT2, HHC003221: B.QUAT, HHC003222: B.TT2,
  HHC003223: B.LG, HHC003224: B.TT, HHC003225: B.TT2, HHC003226: B.QUAT, HHC003227: B.TT2, HHC003228: B.QUAT,
  HHC003229: B.TT2, HHC003230: B.QUAT, HHC003231: B.TT2, HHC003232: B.CUNG, HHC003233: B.TT2, HHC003234: B.QUAT,
  HHC003235: B.TT2, HHC003236: B.QUAT, HHC003237: B.TT2, HHC003238: B.QUAT, HHC003239: B.TT2, HHC003240: B.LG,
  HHC003241: B.TT2, HHC003242: B.LG, HHC003243: B.TT2, HHC003244: B.QUAT, HHC003245: B.TT2, HHC003246: B.QUAT,
  HHC003247: B.TT2, HHC003248: B.LG, HHC003249: B.TT2, HHC003250: B.QUAT, HHC003251: B.TT2, HHC003252: B.TT2,
  HHC003253: B.TT2, HHC003254: B.LG, HHC003255: B.TT2, HHC003256: B.TT,
  HHC003257: B.TT2, HHC003258: B.QUAT, HHC003259: B.DT,   // CKI-21/22 (thêm sau)
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('begin')
const dem = {}
for (const [ma, dich] of Object.entries(MAP)) {
  if (dich === B.TT) { dem[dich] = (dem[dich] ?? 0) + 1; continue }
  const r = await c.query(`update hinh_hoc_cau_hoi set dang_chinh=$2 where ma_cau=$1 and dang_chinh='HH00108' and xoa_at is null returning ma_cau`, [ma, dich])
  if (r.rowCount !== 1) { console.log('⚠', ma, 'không đổi được (không còn ở HH00108?)'); continue }
  dem[dich] = (dem[dich] ?? 0) + 1
}
console.log(dem)
if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('Chạy thử — ROLLBACK. Thêm --ghi để ghi thật.') }
await c.end()
