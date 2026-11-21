// dau-brief-k9-gkii.mjs — dựng batch/<ma>/_dau-brief.md cho phần GIỮA KÌ II KHỐI 9 của một batch toanmath (bảng đề lấy từ ds-de.json; KHÔNG chứa luật —
// luật cắt từ spec-giai-bai.md bởi ghep-brief.mjs). Dùng:  node kho-rules/dai/lo/toanmath/dau-brief-k9-gkii.mjs B055  rồi  node kho-rules/dai/lo/toanmath/ghep-brief.mjs B055 9
import fs from 'node:fs'; import path from 'node:path'
const MA = process.argv[2]
if (!MA) { console.error('Dùng: dau-brief-k9-gkii.mjs <BATCH>'); process.exit(2) }
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const D = path.join(HERE, 'batch', MA)
const ds = JSON.parse(fs.readFileSync(path.join(D, 'ds-de.json'), 'utf8'))
const LV = `${process.env.BK_LV || 'C:/Users/WBPC/bk-kho-lam-viec'}/de-thi/toanmath/${MA}`.replace(/\//g, '\\')
const REPO = 'C:\\Users\\WBPC\\Desktop\\BKERP\\bkdemy-erp-v2'
const BD = `${(process.env.BK_LV || 'C:/Users/WBPC/bk-kho-lam-viec').replace(/\//g, '\\')}\\de-thi\\toanmath\\_ban-do-k9`
const co = (e) => (e.loai === 'de_cuong' ? 'đề cương' : 'đề thi')
const rows = ds.map((e) => `| ${e.ma} | ${co(e)} | ${e.don_vi} · ${e.nam}–${e.nam + 1} | ${e.de || '—'} | ${e.hd || '—'} | ${e.co_chu ? 'chữ' : '**SCAN**'} | ${e.ghi_chu || ''} |`).join('\n')
const out = `# ĐẦU RIÊNG BATCH ${MA} — K9 GIỮA KÌ II (phần \`Đề thi/GKII\` + \`Đề cương/GKII\` của batch; đề GKI nằm chung batch KHÔNG thuộc việc này) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- \`<MA>\` = \`${MA}-NN\`. Danh sách: \`${REPO}\\kho-rules\\dai\\lo\\toanmath\\batch\\${MA}\\ds-de.json\` — mỗi mục có \`don_vi\`, \`nam\` (năm đầu năm học), \`de\` / \`hd\` (trang đề / trang đáp án trong file PDF gốc, DÒ TỰ ĐỘNG ⇒ bạn kiểm lại bằng ảnh trang), \`co_chu\` (false = SCAN: gõ lại từ ảnh).
- \`<LV>\` = \`${LV}\\<MA>\` (\`goc.pdf\` nguyên file · \`trang\\p-N.png\` 150 dpi theo trang file gốc · \`img\\\` · \`tam\\\` · \`de.boc.json\`). Phóng to chỗ không chắc: spec §A11.
- Tệp soạn: \`${REPO}\\kho-rules\\dai\\lo\\toanmath\\batch\\${MA}\\<MA>.soan.md\` (đề cương dài > ~120 câu: chia khúc, spec §A10). Đề cương: đầu tệp có \`kieu: de_cuong\`. Tên đề: \`Đề kiểm tra giữa học kì 2 Toán 9 năm <năm học> — <trường (phường/quận)> (<mã đề>)\` (đề cương: \`Đề cương ôn tập giữa học kì II Toán 9 — <trường>\`); \`nam:\` = năm đầu năm học; \`bo_sach: KNTT\` (đề ghi bộ khác ⇒ ghi đúng).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): \`node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/${MA}/<MA>.soan.md --lam-viec "${LV.replace(/\\/g, '/')}/<MA>" --khoi 9 --chi-kiem\`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy \`node kho-rules/dai/lo/toanmath/anh-batch.mjs day ${MA}\`. Trạm không tự chạy.

## ⭐ Bản đồ K9 — PHÂN DẠNG TRƯỚC KHI GIẢI (spec §A3; truy vấn từ DB lúc ${new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ')} giờ VN)

- Danh mục dạng (mã · chủ đề · chuyên đề · tên): \`${BD}\\ban-do-k9-muc-luc.md\`. Lý thuyết + mô tả + ví dụ đầy đủ của TỪNG dạng: \`${BD}\\ban-do-k9-chi-tiet.txt\` (tìm theo mã \`[NDB…]\`; đọc ĐỦ mô tả + lý thuyết + ví dụ của dạng ứng viên rồi mới gán — chỉ đọc tên dạng mà gán = sai luật).
- Mã dạng: Đại / hgt = \`NDB…\` (mục lục). Hình = mã bài \`HH…\` theo mục "Phân dạng riêng" của Khối 9 (HH00105–HH00110, HH00095…). Câu **không khớp rõ dạng nào** ⇒ \`dang=—\` + \`chac=—\` + MỘT dòng lí do mở bằng đúng một nhãn \`THIẾU DẠNG: <tên nên có>\` | \`KHÔNG THUỘC CHỦ ĐỀ: …\` | \`THIẾU HÌNH: …\` | \`ĐỀ LỖI: …\` (ghi ở dòng \`**Ghi chú:**\` hoặc ngay sau \`chac=—\`; chép lí do vào mục \`## GHI CHÚ CHO NGƯỜI DUYỆT\` dạng bảng "nhãn câu → nhãn lí do"). **Không tự thêm dạng vào bản đồ.**
- ⚠️ **Bản đồ Đại K9 HIỆN CHỈ CÓ NHÓM, CHƯA CÓ dạng** cho: hàm số bậc hai $y=ax^2$ (nhóm NNB01075; phương trình bậc hai + Viète chưa có cả nhóm) · tần số / tần số tương đối / biểu đồ (NNB01076) · xác suất (NNB01077) · hình hộp chữ nhật (NNB01078; trụ – nón – cầu chưa có). Câu thuộc các nội dung này ⇒ \`dang=—\`, \`THIẾU DẠNG: <tên dạng nên có> (nhóm NNB… gần nhất)\` (gom lại ở GHI CHÚ CHO NGƯỜI DUYỆT: nhãn câu + tên dạng nên có + mô tả một dòng) — điều phối tổng hợp thành đề xuất cho trưởng khối. Hình K9: câu hợp bài \`HH00105–HH00110\` / \`HH00095\` thì gán; góc nội tiếp, tứ giác nội tiếp, đường tròn ngoại – nội tiếp, hình tổng hợp, hình trụ – nón – cầu **chưa có bài đích** ⇒ \`dang=—\` + \`THIẾU DẠNG: <tên bài nên có>\`.
- ⚠️ **Mốc kiến thức GIỮA KÌ II: ĐÃ CÓ LUẬT (lô mẫu B055 duyệt 21/11) — đọc kỹ mục "Giữa kì II" trong mục Khối 9 ở dưới và ÁP ĐÚNG** (phạm vi theo chính đề; được dùng Δ/Δ′ / nhẩm nghiệm / Viète sau khi chỉ ra hai nghiệm; góc nội tiếp, tứ giác nội tiếp chiều thuận; hình trụ khi đề ra; đề Hình thiếu "nhọn" ⇒ thử toạ độ cả cấu hình tù rồi thêm "nhọn" + Ghi chú; cực trị không Cô-si dùng thẳng; …). Đề khó / chuyên: bài khó dùng được mọi kiến thức tới C8; không giải được trong phạm vi ⇒ giải cách đúng nhất + \`**Chưa chắc:**\`. Chỗ nào luật chưa phủ mà bạn phải chọn quy ước mới ⇒ ghi vào \`## GHI CHÚ CHO NGƯỜI DUYỆT\` (điều phối sẽ gom thành luật).
- **Đề ghi "hệ chuẩn / hệ nâng cao" hoặc nhiều mã đề cùng trường:** soạn nguyên từng phần; Bài "chọn một trong hai ý" ⇒ nhập cả hai. Hướng dẫn chấm in kèm là nhân chứng, KHÔNG phải nguồn chép (§A4): tự giải trước.
- Phân kho: mọi câu hình học (đường tròn, góc nội tiếp, chứng minh hình, tính trên hình) \`kho=hinh_hoc\`; tỉ số lượng giác / giải tam giác vuông \`kho=hgt\`; còn lại (kể cả thống kê, xác suất, hàm số, hình trụ – nón – cầu) \`kho=dai\`.
- Loại câu K9: Đúng/Sai nhập \`tu_luan\` (Khối 9 mục "Loại câu"); tách ý chỉ theo danh sách K9 (§Khối 9 Đại (b) "Tách ý").
- Ảnh hình đề: nguồn hình theo §A8 (gốc ổn ⇒ cắt từ \`goc.pdf\`, vào \`img\\\`, ghi \`**Hình:** <tệp> | nguon=goc\`; tệ ⇒ vẽ lại bằng code, \`nguon=ve_lai:<a–f>\`). Mở ảnh kiểm từng hình.

## Bảng đề

| MA | Loại | Trường · năm học | Trang đề | Trang đáp án | Lớp chữ | Ghi chú |
|---|---|---|---|---|---|---|
${rows}
`
fs.writeFileSync(path.join(D, '_dau-brief.md'), out)
console.log('✔', path.join(D, '_dau-brief.md'), ds.length, 'đề')
