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
- ⚠️ **Mốc kiến thức GIỮA KÌ II (spec Khối 9 "Giữa kì II: chưa có luật — lô mẫu đầu tiên sẽ rút")** — tạm áp: lời giải dùng kiến thức tới hết phần CHÍNH ĐỀ ĐÓ kiểm tra (§A15), nhìn TOÀN BỘ đề + bảng ma trận / đáp án nếu có. Đề giữa kì II Hà Nội 2024–2026 thường gồm: lập phương trình / hệ, căn thức rút gọn, hàm số $y=ax^2$, phương trình bậc hai + Viète, thống kê – xác suất, hình (đường tròn, góc nội tiếp, tứ giác nội tiếp). Với nội dung C6 đề đã kiểm tra: **được dùng** công thức nghiệm $\\Delta$ / $\\Delta'$, nhẩm nghiệm, Viète (sau khi chỉ ra có hai nghiệm), hàm số $y=ax^2$ và đồ thị; với hình: **được dùng** góc nội tiếp (số đo cung, hệ quả) và tứ giác nội tiếp **chiều thuận** (tổng hai góc đối $180^\\circ$) khi đề thuộc phần đó. Vẫn **CẤM** (spec §Khối 9 "Đã bỏ khỏi chương trình 2018"): dấu hiệu nhận biết tứ giác nội tiếp (chiều đảo) ⇒ chứng minh 4 điểm cùng thuộc đường tròn bằng "bốn điểm cách đều một điểm" hoặc hai góc vuông cùng nhìn một đoạn; góc tạo bởi tia tiếp tuyến và dây cung; góc có đỉnh trong / ngoài đường tròn; phương tích; hệ thức lượng $b^2=ab'$…; định lí sin / côsin; đường trung bình (trừ khi đề cho). Đề khó / chuyên: bài khó dùng được mọi kiến thức tới C8; không giải được trong phạm vi ⇒ giải cách đúng nhất + \`**Chưa chắc:**\`. **Mỗi chỗ bạn phải chọn quy ước (dùng Δ, dùng góc nội tiếp, chứng minh tứ giác nội tiếp bằng cách nào…) ghi vào \`## GHI CHÚ CHO NGƯỜI DUYỆT\`** — đây là LÔ MẪU, người duyệt sẽ rút luật từ đó.
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
