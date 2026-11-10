// duyet-de-ai.mjs — "Duyệt đề" cho đề đã qua dây chuyền AI 2 nhân chứng (Sonnet soạn + Opus soát mù), khi Thùy bảo "đưa lên app".
//
//   node scripts/kho/de-thi/duyet-de-ai.mjs <tai_lieu_id>… [--ghi]          (không --ghi = chạy thử, ROLLBACK)
//
// Làm ĐÚNG 2 việc của fn_de_thi_duyet (màn Duyệt đề) nhưng không mạo danh người bấm (hàm đó đòi current_nhan_su_id):
//   1. duyệt nội dung mọi câu của đề (kể cả câu còn dạng chờ — cờ phiên kho.duyet_noi_dung như hàm gốc), duyet_nguon 'ai', duyet_boi để trống;
//   2. tai_lieu.duyet_at = now(), duyet_boi = NULL (= duyệt bởi dây chuyền AI, không phải một nhân sự) ⇒ app HS (fn_hs_on_thi_ds) thấy đề.
// Chặn như hàm gốc: fn_de_thi_thieu còn câu "chặn" (thiếu đáp án / phương án) ⇒ không duyệt đề đó.
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL').gia_tri })
await c.connect()
try {
  await c.query('begin')
  await c.query(`select set_config('kho.duyet_noi_dung', 'on', true)`)
  for (const id of ids) {
    const { rows: [t] } = await c.query(`select ten, duyet_at, fn_de_thi_thieu(id) v from tai_lieu where id = $1 and loai = 'de_thi'`, [id])
    if (!t) throw new Error(`${id}: không có đề`)
    if (t.duyet_at) { console.log(`· ${t.ten}: đã duyệt từ trước — bỏ qua`); continue }
    if (+t.v.so_chan > 0) { console.log(`✘ ${t.ten}: còn ${t.v.so_chan} câu chặn — KHÔNG duyệt`); continue }
    let n = 0
    for (const r of (await c.query(`select ma_cau, kho, loai_cau from fn_de_thi_cau($1)`, [id])).rows) {
      if (r.loai_cau === 'dung_sai') await c.query(`update ${r.kho}_cau_menh_de set da_duyet = true, duyet_at = now(), duyet_nguon = 'ai' where ma_cau_cha = $1 and xoa_at is null and not da_duyet`, [r.ma_cau])
      n += (await c.query(`update ${r.kho}_cau_hoi set da_duyet = true, duyet_at = now(), duyet_nguon = 'ai' where ma_cau = $1 and not da_duyet`, [r.ma_cau])).rowCount
    }
    await c.query(`update tai_lieu set duyet_at = now(), duyet_boi = null, updated_at = now() where id = $1`, [id])
    console.log(`✔ ${t.ten}: duyệt đề · bật duyệt ${n} câu`)
  }
  await c.query(`select set_config('kho.duyet_noi_dung', 'off', true)`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? 'ĐÃ GHI' : 'CHẠY THỬ — ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('❌', e.message); process.exitCode = 1 }
await c.end()
