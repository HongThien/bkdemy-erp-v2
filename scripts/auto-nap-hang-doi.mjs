// AUTO-NẠP HÀNG ĐỢI TỪ POOL TỔNG (Thùy 06/09: "Claude auto giải hết, người chỉ duyệt").
//
// Chạy TRƯỚC hangdoi-giai.mjs trong mỗi lượt tự động: nếu hàng đợi ưu tiên (bài người bấm "⭐ Ưu tiên")
// đang RỖNG, lấy tối đa --n bài từ pool tổng (fn_giaibai_pool, che_do='giai' — câu/bài THIẾU CẢ đáp án
// lẫn lời giải, chưa ai giữ) rồi "đặt Claude giải" giúp (fn_kho_dat_giai/fn_hinh_dat_giai, p_nguoi=NULL —
// không phải người, để phân biệt yêu cầu thật). Sau bước này, hàng đợi có việc → hangdoi-giai.mjs
// --list/--ghi xử lý HỆT như một yêu cầu bình thường, KHÔNG đổi gì ở script đó.
//
// Nếu hàng đợi ưu tiên ĐANG có việc treo (người bấm Ưu tiên) → KHÔNG nạp thêm, để ưu tiên xử lý hết
// hàng đợi người yêu cầu trước (đúng thứ tự "chen ngang" đã bàn).
// Kết nối: DATABASE_URL trong .env (cùng cách các script khác trong scripts/).
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const args = process.argv.slice(2)
const after = (f, dflt) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : dflt }
const N = Number(after('--n', 5))
// Khối KHÔNG tự nạp (Thùy 09/09: "bỏ qua khối 12"). Đổi bằng --bo-khoi "12,11" hoặc --bo-khoi "" để nạp hết.
const BO_KHOI = after('--bo-khoi', '12').split(',').map((x) => x.trim()).filter(Boolean)

const c = new pg.Client({ connectionString: envf(join(root, '.env')).DATABASE_URL })
await c.connect()

const MON = ['toan', 'khtn', 'hgt']
const HINH_NHANH = ['hinh_baitoan', 'hinh_bien_the']

try {
  // 1) Còn yêu cầu ưu tiên treo (của Claude, chưa ai/Claude xử lý) → không nạp thêm, để xử lý hết đã.
  let coUuTien = 0
  for (const mon of MON) {
    const t = (await c.query('select public.fn_kho_tbl($1) t', [mon])).rows[0].t
    const r = await c.query(`select count(*) n from ${t}_cau_hoi_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
    coUuTien += Number(r.rows[0].n)
  }
  {
    const r1 = await c.query(`select count(*) n from hinh_baitoan_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
    const r2 = await c.query(`select count(*) n from hinh_bien_the_yeu_cau_giai where xu_ly_at is null and nguoi_giai is null`)
    coUuTien += Number(r1.rows[0].n) + Number(r2.rows[0].n)
  }
  if (coUuTien > 0) {
    console.log(`Còn ${coUuTien} yêu cầu ưu tiên đang treo — không nạp thêm từ pool, xử lý ưu tiên trước.`)
    process.exit(0)
  }

  // 2) Hàng đợi ưu tiên rỗng → lấy tối đa N bài từ pool tổng (chưa ai giữ). Thứ tự/lọc nằm ở SQL (fn_giaibai_pool):
  //    THCS trước · bỏ khối trong BO_KHOI · KHÔNG nạp lại bài Claude đã --bo (mig 202609091412 — trước đó bài bỏ rơi lại
  //    pool và bị nạp lại mỗi lượt, DC000016 26 lần).
  const nhanh = [...MON, ...HINH_NHANH]
  const pool = await c.query(`select * from public.fn_giaibai_pool($1, null, $2, 'giai', $3, true)`, [nhanh, N, BO_KHOI.length ? BO_KHOI : null])
  if (!pool.rows.length) {
    console.log('Pool tổng cũng rỗng — không còn bài nào cần giải lúc này.')
    process.exit(0)
  }

  let nap = 0
  for (const row of pool.rows) {
    if (MON.includes(row.nhanh)) {
      const n = await c.query('select public.fn_kho_dat_giai($1, $2, $3, null) n', [row.nhanh, [row.key], 'Tự động quét kho'])
      nap += Number(n.rows[0].n)
    } else {
      const loai = row.nhanh === 'hinh_baitoan' ? 'baitoan' : 'bien_the'
      const n = await c.query('select public.fn_hinh_dat_giai($1, $2, $3, null) n', [loai, [row.key], 'Tự động quét kho'])
      nap += Number(n.rows[0].n)
    }
  }
  console.log(`Đã nạp ${nap}/${pool.rows.length} bài từ pool tổng vào hàng đợi cho Claude xử lý lượt này.`)
} finally {
  await c.end()
}
