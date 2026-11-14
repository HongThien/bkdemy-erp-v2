// Bản đồ Hình–Học khối 8T — CHỐT (Thùy 14/11: "Ok. Rồi chốt bản đồ 8T đi"). Nguồn thiết kế: kho-rules/dai/k8T-hinh-hoc-ban-do-de-xuat.html (v4).
//   Một chiều duy nhất = KIẾN THỨC: chuyên đề (đối tượng / định lí có lý thuyết riêng) → bài. "Yêu cầu của đề" (chứng minh vuông góc, tính góc…) là nhãn câu, KHÔNG phải tầng bản đồ.
//   Mỗi chuyên đề nằm trọn một phía của "đồng dạng". Kết quả: 5 chuyên đề · 20 bài.
//   • đổi tên 4 bài (HH00089, HH00129, HH00131, HH00132) + đổi tên chuyên đề HH8T03, HH8T05, HH8T06
//   • thêm 6 bài mới (mã tự sinh từ hinh_hoc_bai_seq) + chuyên đề mới HH8T07 "Tam giác đồng dạng"
//   • HH00129 chuyển HH8T03 → HH8T07; HH00131 chuyển HH8T04 → HH8T03 (mã bài không đổi)
//   • điền mo_ta cho 20 bài (chỉ ô đang trống)
//   • XOÁ 4 bài HH00125, HH00126, HH00130, HH00133 (tạo 10/10, 0 câu, 0 lý thuyết, 0 tham chiếu) — Thùy gật ("Ok" sau khi liệt kê, 14/11).
//     Hai chuyên đề HH8T02, HH8T04 rỗng theo (chuyên đề chỉ là cột ma_chuyen_de/ten_chuyen_de của bài ⇒ không có dòng riêng để xoá).
//     Trước khi xoá: đếm mọi dòng trỏ vào 4 mã qua MỌI khoá ngoại vào hinh_hoc_bai; có ≥1 ⇒ ROLLBACK, không xoá.
//   1 transaction; lệch số ⇒ ROLLBACK.      node scripts/hinh-k8t-ghi-ban-do.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const CD = {
  HH8T01: 'Tứ giác',
  HH8T03: 'Định lí Thalès',
  HH8T07: 'Tam giác đồng dạng',
  HH8T05: 'Đa giác và diện tích',
  HH8T06: 'Cực trị, quỹ tích, dựng hình',
}
const mo = (kt, y) => `Các bài toán dùng kiến thức: ${kt}. Yêu cầu hay gặp: ${y.join('; ')}.`
// [ma_bai | null nếu mới, chuyên đề, tên bài, kiến thức, yêu cầu hay gặp]  — thứ tự mảng = thu_tu 1..20
const BAI = [
  ['HH00089', 'HH8T01', 'Hình thang, hình thang cân', 'định nghĩa, tổng góc tứ giác, hình thang vuông, hình thang cân, dấu hiệu nhận biết', ['tính góc', 'chứng minh hình thang cân', 'so sánh đoạn thẳng', 'bất đẳng thức đoạn thẳng']],
  ['HH00090', 'HH8T01', 'Hình bình hành', 'định nghĩa, tính chất, 5 dấu hiệu nhận biết', ['chứng minh hình bình hành', 'thẳng hàng', 'đồng quy', 'dựng hình bình hành phụ']],
  ['HH00091', 'HH8T01', 'Hình chữ nhật', 'định nghĩa, tính chất, dấu hiệu; trung tuyến ứng với cạnh huyền; khoảng cách giữa hai đường song song', ['chứng minh hình chữ nhật', 'quỹ tích', 'bình phương khoảng cách']],
  ['HH00092', 'HH8T01', 'Hình thoi', 'định nghĩa, tính chất (hai đường chéo vuông góc, là phân giác), dấu hiệu', ['chứng minh hình thoi', 'vuông góc', 'tính góc']],
  ['HH00093', 'HH8T01', 'Hình vuông', 'tính chất của hình chữ nhật và hình thoi, 5 dấu hiệu nhận biết', ['chứng minh hình vuông', 'tam giác vuông cân dựng ngoài', 'hệ thức 1/x²+1/y²=1/z²', 'thẳng hàng, điểm cố định', 'cực trị']],
  ['HH00094', 'HH8T01', 'Đối xứng trục, đối xứng tâm', 'hai điểm / hai hình đối xứng, hình có trục / tâm đối xứng; tâm đối xứng của hình bình hành', ['chứng minh bằng điểm đối xứng', 'cực trị MA+MB', 'bất đẳng thức']],
  ['HH00127', 'HH8T03', 'Định lí Thalès (thuận, đảo, hệ quả)', 'tỉ số hai đoạn thẳng, định lí Thalès, định lí đảo, hệ quả', ['tính độ dài', 'chứng minh song song', 'chứng minh tỉ lệ thức', 'tỉ số không đổi']],
  [null, 'HH8T03', 'Đường trung bình của tam giác, của hình thang', 'đường trung bình của tam giác (song song cạnh thứ ba, bằng nửa cạnh ấy), của hình thang', ['chứng minh trung điểm', 'chứng minh song song', 'EF ≤ (AB+CD)/2', 'lấy trung điểm phụ']],
  ['HH00128', 'HH8T03', 'Tính chất đường phân giác', 'tính chất đường phân giác trong và ngoài của tam giác', ['tính đoạn do phân giác chia', 'chứng minh song song', 'tính tỉ số', 'hệ thức đại số trong tam giác đặc biệt']],
  [null, 'HH8T03', 'Bổ đề hình thang', 'giao hai đường chéo, giao hai cạnh bên, trung điểm hai đáy — ba điểm thẳng hàng', ['chứng minh thẳng hàng', 'tính tỉ số', '1/OE = 1/a + 1/b']],
  ['HH00131', 'HH8T03', 'Định lí Mê-nê-la-uýt, định lí Xê-va', 'Mê-nê-la-uýt (thuận, đảo), Xê-va; chứng minh ba điểm thẳng hàng, ba đường đồng quy bằng tích tỉ số', ['chứng minh thẳng hàng', 'chứng minh đồng quy', 'chứng minh hệ thức tỉ số']],
  ['HH00129', 'HH8T07', 'Tam giác đồng dạng — ba trường hợp', 'khái niệm tam giác đồng dạng, ba trường hợp c.c.c, c.g.c, g.g', ['chứng minh đồng dạng', 'suy ra tỉ số, góc', 'chứng minh tích AB·AC = AD·AE', 'hình thang bằng đồng dạng']],
  [null, 'HH8T07', 'Đồng dạng tam giác vuông, hệ thức lượng', 'các trường hợp đồng dạng của tam giác vuông; AB² = BH·BC, AH² = BH·HC; Pythagore', ['tính cạnh, đường cao', 'chứng minh hệ thức', 'chu vi, diện tích']],
  [null, 'HH8T07', 'Tỉ số đường cao, tỉ số diện tích hai tam giác đồng dạng', 'tỉ số đường cao, tỉ số diện tích bằng bình phương tỉ số đồng dạng; ứng dụng đo gián tiếp', ['hình vuông nội tiếp tam giác', 'tính diện tích theo tỉ số', 'đo chiều cao, độ sâu']],
  [null, 'HH8T05', 'Đa giác, đa giác đều', 'đa giác lồi, đa giác đều, tổng góc (n−2)·180°, số đường chéo', ['tính góc, tìm số cạnh', 'lục giác có các góc bằng nhau', 'đếm đường chéo']],
  ['HH00132', 'HH8T05', 'Công thức diện tích', 'diện tích hình chữ nhật, tam giác, hình thang, bình hành, thoi; chia đa giác thành tam giác', ['tính diện tích theo số đo', 'diện tích thay đổi theo kích thước', 'chia đôi diện tích', 'cực trị diện tích']],
  [null, 'HH8T05', 'Phương pháp diện tích', 'tỉ số diện tích hai tam giác chung đường cao hoặc chung đáy; dùng diện tích để thiết lập quan hệ độ dài', ['chứng minh quan hệ độ dài', 'chứng minh bằng nhau, phân giác', 'tổng khoảng cách không đổi', 'tính tỉ số diện tích']],
  ['HH00134', 'HH8T06', 'Cực trị hình học', 'cực trị bằng đối xứng, bất đẳng thức tam giác, Cô-si; hình nội tiếp; đường gấp khúc ngắn nhất', ['min / max độ dài', 'min / max diện tích', 'đường đi ngắn nhất']],
  ['HH00135', 'HH8T06', 'Tìm tập hợp điểm', 'quỹ tích cơ bản; phần thuận – giới hạn – phần đảo', ['quỹ tích trung điểm, trọng tâm', 'điểm cố định, đường cố định']],
  ['HH00136', 'HH8T06', 'Dựng hình', 'bài toán dựng hình; các bước phân tích – cách dựng – chứng minh – biện luận', ['dựng hình thang, tam giác theo yếu tố', 'dựng điểm thoả hệ thức', 'chia diện tích']],
]
const BO = ['HH00125', 'HH00126', 'HH00130', 'HH00133']

try {
  await c.query('begin')
  // ── 0. Trước: hiện trạng phải đúng như lúc thiết kế
  const truoc = await q(`select ma_bai, ten_bai, ma_chuyen_de from hinh_hoc_bai where khoi='8T' and ma_bai <> 'HH8T000000' order by thu_tu`)
  if (truoc.length !== 18) throw new Error(`kỳ vọng 18 bài 8T trước khi ghi, thấy ${truoc.length} — dừng`)
  const tonTai = new Set(truoc.map(x => x.ma_bai))
  for (const m of BO) if (!tonTai.has(m)) throw new Error(`${m} không còn — dừng`)
  for (const b of BAI) if (b[0] && !tonTai.has(b[0])) throw new Error(`${b[0]} không có — dừng`)

  // ── 1. Cổng xoá: đếm mọi dòng trỏ vào 4 bài sẽ bỏ, qua MỌI khoá ngoại vào hinh_hoc_bai
  const fks = await q(`select conrelid::regclass::text t, a.attname col from pg_constraint k
      join pg_attribute a on a.attrelid = k.conrelid and a.attnum = any(k.conkey)
     where k.confrelid = 'hinh_hoc_bai'::regclass and k.contype = 'f'`)
  let ref = 0
  for (const f of fks) {
    const n = +(await q(`select count(*) n from ${f.t} where "${f.col}" = any($1)`, [BO]))[0].n
    console.log(`  tham chiếu ${f.t}.${f.col}: ${n}`)
    ref += n
  }
  const lt = +(await q(`select count(*) n from hinh_hoc_bai where ma_bai = any($1) and (mo_ta <> '' or vi_du <> '' or da_duyet is distinct from true)`, [BO]))[0].n
  if (ref > 0) throw new Error(`còn ${ref} dòng trỏ vào bài sắp xoá — ROLLBACK, không xoá`)
  console.log(`  cổng xoá: 0 tham chiếu · ${lt} bài có mô tả/ví dụ/khác duyệt (chỉ để ghi nhận)`)

  // ── 2. Bài mới (mã tự sinh) — chưa có thì thêm
  const maMoi = {}
  for (let i = 0; i < BAI.length; i++) {
    const [ma, cd, ten] = BAI[i]
    if (ma) continue
    const co = await q(`select ma_bai from hinh_hoc_bai where khoi='8T' and ten_bai = $1`, [ten])
    if (co.length) { maMoi[ten] = co[0].ma_bai; continue }
    const r = await q(`insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet, ma_chuyen_de, ten_chuyen_de) values ('8T', $1, $2, true, $3, $4) returning ma_bai`, [ten, i + 1, cd, CD[cd]])
    maMoi[ten] = r[0].ma_bai
  }

  // ── 3. Đặt tên / chuyên đề / thứ tự / mô tả cho cả 20 bài
  for (let i = 0; i < BAI.length; i++) {
    const [ma0, cd, ten, kt, y] = BAI[i]
    const ma = ma0 ?? maMoi[ten]
    await c.query(`update hinh_hoc_bai set ten_bai=$2, thu_tu=$3, ma_chuyen_de=$4, ten_chuyen_de=$5,
        mo_ta = case when coalesce(mo_ta,'') = '' then $6 else mo_ta end
      where ma_bai = $1`, [ma, ten, i + 1, cd, CD[cd], mo(kt, y)])
  }

  // ── 4. Xoá 4 bài (cổng ở bước 1 đã qua)
  const xoa = await c.query(`delete from hinh_hoc_bai where khoi='8T' and ma_bai = any($1) returning ma_bai`, [BO])
  if (xoa.rowCount !== BO.length) throw new Error(`xoá ${xoa.rowCount}/${BO.length} — ROLLBACK`)

  // ── 5. Kiểm sau
  const sau = await q(`select ma_chuyen_de, ten_chuyen_de, count(*)::int bai, min(thu_tu) tu, max(thu_tu) den, count(*) filter (where mo_ta<>'')::int co_mo_ta
      from hinh_hoc_bai where khoi='8T' and ma_bai <> 'HH8T000000' group by 1,2 order by min(thu_tu)`)
  console.table(sau)
  const tong = sau.reduce((a, x) => a + x.bai, 0)
  const cauSau = +(await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and dang_chinh in (select ma_bai from hinh_hoc_bai where khoi='8T')`))[0].n
  console.log(`tổng ${tong} bài · ${sau.length} chuyên đề · câu 8T còn nguyên ${cauSau}`)
  const ok = tong === 20 && sau.length === 5 && sau.every(x => x.co_mo_ta === x.bai) && cauSau === 48
  if (!ok) throw new Error('lệch số (kỳ vọng 20 bài · 5 chuyên đề · mô tả đủ · 48 câu) — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
