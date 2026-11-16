// Ghi lời giải viết lại của ý b, c bài HHB001455 (gốc HHC000867): cập nhật loi_giai của 2 câu ý + sơ đồ tư duy (hinh_hoc_cau_so_do).
// KHÔNG đổi đề, không đổi trạng thái duyệt. Nhãn: nguon_giai 'ai' + giai_method 'claude_code' (lời giải do Claude viết); sơ đồ nguon 'claude'.
// Lời giải cũ lưu ra loi-giai-cu.json trước khi ghi. Mặc định chạy thử rồi ROLLBACK; thêm --ghi mới COMMIT.
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/hhc000867/ghi.mjs [--ghi]
import pg from 'pg'; import fs from 'fs'
import { Y_B, Y_C } from './loi-giai.mjs'
const ghi = process.argv.includes('--ghi'), DIR = 'kho-rules/hinh/lo/tach-y/hhc000867/'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query('begin')
try {
  const cu = (await c.query(`select q.ma_cau, q.nhan_y, q.loi_giai, q.noi_dung, q.da_duyet, q.nguon_giai, q.giai_method
                               from hinh_hoc_cau_hoi q join hinh_hoc_bai_y y on y.ma_bai_y = q.bai_y
                              where y.ma_cau_goc = 'HHC000867' and q.nhan_y in ('b','c') order by q.nhan_y for update of q`)).rows
  if (cu.length !== 2) throw new Error('không thấy đúng 2 ý b, c')
  if (!fs.existsSync(DIR + 'loi-giai-cu.json')) fs.writeFileSync(DIR + 'loi-giai-cu.json', JSON.stringify(cu, null, 1))
  for (const y of [Y_B, Y_C]) {
    const q = cu.find((x) => x.nhan_y === y.nhan)
    await c.query(`update hinh_hoc_cau_hoi set loi_giai = $2, nguon_giai = 'ai', giai_method = 'claude_code' where ma_cau = $1`, [q.ma_cau, y.loi_giai])
    await c.query(`insert into hinh_hoc_cau_so_do (ma_cau, mau_chot, nut, nguon) values ($1, $2, $3::jsonb, 'claude')
                   on conflict (ma_cau) do update set mau_chot = excluded.mau_chot, nut = excluded.nut, nguon = excluded.nguon, updated_at = now()`,
      [q.ma_cau, y.mau_chot, JSON.stringify(y.nut)])
  }
  const sau = (await c.query(`select q.ma_cau, q.nhan_y, q.loi_giai, q.noi_dung, q.da_duyet, q.nguon_giai, s.mau_chot, jsonb_array_length(s.nut) so_o
                                from hinh_hoc_cau_hoi q left join hinh_hoc_cau_so_do s on s.ma_cau = q.ma_cau where q.ma_cau = any($1) order by q.nhan_y`, [cu.map((x) => x.ma_cau)])).rows
  for (const y of [Y_B, Y_C]) {
    const s = sau.find((x) => x.nhan_y === y.nhan), q = cu.find((x) => x.nhan_y === y.nhan)
    if (s.loi_giai !== y.loi_giai || s.mau_chot !== y.mau_chot || s.so_o !== y.nut.length) throw new Error(`ý ${y.nhan}: đọc lại không khớp bản soạn`)
    if (s.noi_dung !== q.noi_dung || s.da_duyet !== q.da_duyet) throw new Error(`ý ${y.nhan}: đề hoặc trạng thái duyệt bị đổi`)
    console.log(`ý ${y.nhan} ${s.ma_cau}: lời giải ${q.loi_giai.length} → ${s.loi_giai.length} ký tự · sơ đồ ${s.so_o} ô · đề giữ nguyên · duyệt ${s.da_duyet} · nguồn giải ${q.nguon_giai} → ${s.nguon_giai}`)
  }
  await c.query(ghi ? 'commit' : 'rollback')
  console.log(ghi ? '✔ ĐÃ GHI (commit)' : '(chạy thử — đã ROLLBACK, thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ:', e.message); process.exitCode = 1 }
await c.end()
