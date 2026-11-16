// Ghi GIẢ THIẾT của ý trước vào cột `da_biet` cho các ý trong de-xuat.json (Thùy 16/11: "OK thêm cái đấy nhưng đừng ghi đã biết.
// Chỉ cần highlight để phân biệt giả thiết và câu hỏi thôi") ⇒ chữ ghi vào là NGUYÊN giả thiết, KHÔNG kèm "Đã biết", KHÔNG kèm "(ý b)";
// việc phân biệt giả thiết / câu hỏi do màn hình tô nền (GiaThietY), không do chữ.
// Trigger _trg_hh_y_ghep tự ghép lại đề = lời dẫn + giả thiết thêm + câu hỏi ý. Chỉ ghi ý đang `da_biet` trống. Hoàn tác = set da_biet = null cho đúng các mã trong de-xuat.json.
// Một giao dịch; mặc định chạy thử rồi ROLLBACK; thêm --ghi mới COMMIT.
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/da-biet/ghi.mjs [--ghi]
import pg from 'pg'; import fs from 'fs'
const ghi = process.argv.includes('--ghi')
const d = JSON.parse(fs.readFileSync('kho-rules/hinh/lo/tach-y/da-biet/de-xuat.json', 'utf8'))
const boDuoi = (s) => s.split('\n').map((ln) => ln.replace(/\s*\(ý [^)]*\)\.\s*$/, '.').replace(/\.\.$/, '.')).join('\n')
const L = d.deXuat.map((o) => ({ ma_cau: o.ma_cau, gt: boDuoi(o.da_biet), cau_hoi_y: o.cau_hoi_y, loi_dan: o.loi_dan }))
if (L.some((o) => /\(ý |Đã biết/i.test(o.gt) || !o.gt.trim())) throw new Error('còn đuôi "(ý …)" / chữ "Đã biết" / dòng rỗng trong chữ sắp ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query('begin')
try {
  let n = 0; const lech = []
  for (const o of L) {
    const q = (await c.query(`select q.da_biet, q.cau_hoi_y, q.da_duyet, y.loi_dan from hinh_hoc_cau_hoi q join hinh_hoc_bai_y y on y.ma_bai_y = q.bai_y where q.ma_cau = $1 for update of q`, [o.ma_cau])).rows[0]
    if (!q || (q.da_biet ?? '').trim() || q.cau_hoi_y !== o.cau_hoi_y || q.loi_dan !== o.loi_dan) { lech.push(o.ma_cau); continue }   // đề đã đổi sau lúc rà ⇒ không ghi
    const r = (await c.query(`update hinh_hoc_cau_hoi set da_biet = $2 where ma_cau = $1 returning noi_dung, da_duyet`, [o.ma_cau, o.gt])).rows[0]
    if (r.noi_dung !== q.loi_dan + '\n' + o.gt + '\n' + q.cau_hoi_y) throw new Error(o.ma_cau + ': đề ghép không đúng khuôn lời dẫn + giả thiết + câu hỏi')
    if (r.da_duyet !== q.da_duyet) throw new Error(o.ma_cau + ': trạng thái duyệt bị đổi')
    n++
  }
  console.log('ghi:', n, 'ý · bỏ qua vì đề đã đổi sau lúc rà:', lech.length, lech.join(' '))
  const vd = L[Math.floor(L.length / 2)]
  console.log('ví dụ', vd.ma_cau, '→\n' + (await c.query('select noi_dung from hinh_hoc_cau_hoi where ma_cau = $1', [vd.ma_cau])).rows[0].noi_dung)
  await c.query(ghi ? 'commit' : 'rollback')
  console.log(ghi ? '✔ ĐÃ GHI (commit)' : '(chạy thử — đã ROLLBACK, thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ cả lô:', e.message); process.exitCode = 1 }
await c.end()
