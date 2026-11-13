// Ghi tách ý Hình – Học vào DB (Thùy 09/11 "Vụ tách ý cho kho bài tập của hình học lớp 7 và 8 chạy đi").
// Đọc nhap.json (do tach.mjs sinh), CHỈ bài máy cắt SẠCH, CHỈ khối truyền vào. Mỗi bài:
//   1 dòng hinh_hoc_bai_y (lời dẫn + hình của bài, thuộc bài học của câu cũ, ma_cau_goc = câu cũ)
//   n câu ý hinh_hoc_cau_hoi (trigger ghép đề = lời dẫn + câu hỏi ý; ép hình/bài học theo bài) — lời giải riêng từng ý,
//     các cột trạng thái (duyệt, nguồn, kiểm máy, created_at, thu_tu, mô hình, cụm) chép từ câu cũ ⇒ ý giữ ĐÚNG trạng thái kho của bài
//   câu cũ: rut_khoi_kho = true (rút khỏi kho chọn câu; 13/11 kho_chuan thành cột SUY, mig 202611130919). KHÔNG xoá, KHÔNG sửa nội dung — tài liệu/điểm cũ trỏ vào vẫn nguyên.
// Một transaction cho cả lô. Mặc định chạy thử rồi ROLLBACK; thêm --ghi mới COMMIT.
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/ghi.mjs 7,8 [--ghi]
import pg from 'pg'; import fs from 'fs'
const khois = (process.argv[2] ?? '').split(',').filter(Boolean)
const ghi = process.argv.includes('--ghi')
if (!khois.length) { console.error('Thiếu danh sách khối, vd 7,8'); process.exit(1) }
const L = JSON.parse(fs.readFileSync('kho-rules/hinh/lo/tach-y/nhap.json', 'utf8')).filter((o) => o.sach && khois.includes(o.khoi))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query('begin')
let nBai = 0, nY = 0; const boQua = []
try {
  for (const o of L) {
    const q = (await c.query(`select * from hinh_hoc_cau_hoi where ma_cau = $1 for update`, [o.ma_cau])).rows[0]
    if (!q || q.xoa_at || q.rut_khoi_kho || q.bai_y) throw new Error(`${o.ma_cau}: câu cũ không còn ở trạng thái lúc cắt (xoá/đã rút/đã là ý)`)
    if (q.noi_dung !== o.noi_dung || (q.loi_giai ?? '') !== (o.loi_giai ?? '')) throw new Error(`${o.ma_cau}: đề/lời giải đã đổi sau khi cắt — chạy lại tach.mjs`)
    // Câu cũ ở dạng CHỜ (…000000) mà đã duyệt (từ trước luật chặn): ý mới không được mang "đã duyệt" ở dạng chờ ⇒ tách là mất duyệt.
    // Để nguyên, chưa tách — tách sau khi câu được phân dạng thật.
    if (/000000$/.test(q.dang_chinh) && q.da_duyet) { boQua.push(o.ma_cau); continue }
    const b = (await c.query(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, ma_cau_goc, thu_tu) values ($1,$2,$3,$4,$5) returning ma_bai_y`,
      [q.dang_chinh, o.loi_dan, q.anh_de, q.ma_cau, q.thu_tu])).rows[0].ma_bai_y
    for (const y of o.ys) {
      await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, bai_y, nhan_y, cau_hoi_y, loi_giai, anh_dap_an, loai_cau, ma_cum, mo_hinh_id, thu_tu,
                       da_duyet, duyet_boi, duyet_at, duyet_nguon, nguon, nguon_giai, giai_method, kiem_may, kiem_may_boi, kiem_may_ghi, kiem_may_at, created_at)
                     values ($1,'',$2,$3,$4,$5,$6,'tu_luan',$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        [q.dang_chinh, b, y.nhan, y.cau_hoi, y.loi_giai, q.anh_dap_an, q.ma_cum, q.mo_hinh_id, q.thu_tu,
         q.da_duyet, q.duyet_boi, q.duyet_at, q.duyet_nguon, q.nguon, q.nguon_giai, q.giai_method, q.kiem_may, q.kiem_may_boi, q.kiem_may_ghi, q.kiem_may_at, q.created_at])
      nY++
    }
    await c.query(`update hinh_hoc_cau_hoi set rut_khoi_kho = true where ma_cau = $1`, [q.ma_cau])
    nBai++
  }
  // Kiểm sau ghi: mỗi bài đủ ý, đề ghép đúng, trạng thái kho của ý = của câu cũ
  const k = (await c.query(`
    select count(distinct y.ma_bai_y) bai, count(q.*) y,
           count(*) filter (where q.noi_dung <> y.loi_dan || E'\\n' || q.cau_hoi_y) de_sai,
           count(*) filter (where q.anh_de is distinct from g.anh_de or q.dang_chinh <> g.dang_chinh) hinh_sai,
           count(*) filter (where q.da_duyet <> g.da_duyet
                              or _kho_cau_chuan(q.da_duyet, q.kiem_may, q.created_at, q.giai_method) <> _kho_cau_chuan(g.da_duyet, g.kiem_may, g.created_at, g.giai_method)) trang_thai_sai,
           count(*) filter (where not g.rut_khoi_kho) goc_chua_rut
      from hinh_hoc_bai_y y join hinh_hoc_cau_hoi q on q.bai_y = y.ma_bai_y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc
     where y.ma_cau_goc = any($1)`, [L.map((o) => o.ma_cau)])).rows[0]
  console.log('bỏ qua (dạng chờ + đã duyệt, chưa tách):', boQua.length, boQua.join(' '))
  console.log('khối', khois.join(','), '| bài', nBai, '| ý', nY, '| kiểm:', k)
  if (+k.bai !== nBai || +k.y !== nY || +k.de_sai || +k.hinh_sai || +k.trang_thai_sai || +k.goc_chua_rut) throw new Error('Kiểm sau ghi KHÔNG đạt — huỷ cả lô')
  await c.query(ghi ? 'commit' : 'rollback')
  console.log(ghi ? '✔ ĐÃ GHI (commit)' : '(chạy thử — đã ROLLBACK, thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ cả lô:', e.message); process.exitCode = 1 }
await c.end()
