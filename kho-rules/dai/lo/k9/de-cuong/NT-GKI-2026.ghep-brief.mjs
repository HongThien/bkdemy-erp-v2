// NT-GKI-2026.ghep-brief.mjs — dựng NT-GKI-2026.brief-soan.md / NT-GKI-2026.brief-soat.md = khối "BẢN ÁP DỤNG" (dưới) + brief NS (brief-soan.md / brief-soat.md) đã đổi mã đề.
//   node kho-rules/dai/lo/k9/de-cuong/NT-GKI-2026.ghep-brief.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const DAU = (kind) => `# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG NGỌC THỤY (NT-GKI-2026) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã đổi mã đề / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề \`NT-GKI-2026\` (THCS Ngọc Thụy, UBND phường Bồ Đề, Hà Nội — "Nội dung ôn tập giữa học kì I môn Toán 9, năm học 2026–2027", Thùy bỏ vào 21/10). \`<LV>\` = \`C:\\Users\\WBPC\\bk-kho-lam-viec\\de-cuong\\K9\\NT-GKI-2026\`;
  số phần \`<P>\` = 1–9 (tệp \`NT-GKI-2026.p<P>.soan.md\`). Thay mọi \`NS-GKI-2026\` trong lệnh bằng \`NT-GKI-2026\`.
- **Ảnh đề cương:** \`<LV>\\trang\\p-01.png … p-11.png\` (11 trang, 130 dpi; số trang in trên giấy = 34–44). PDF sinh từ Word: có lớp chữ NHƯNG công thức mất kí hiệu ⇒ **đọc ảnh, đừng tin pdftotext**.
  Chỗ không chắc phóng to bằng \`pdftoppm\` như mục 2 (toạ độ 260 dpi = 2 × toạ độ trên \`p-NN.png\`).
- **Bản đồ tệp → trang ảnh:** p1 = 4 ví dụ mẫu (p-04 … p-08; Ví dụ 5 ở p-08, p-09) · p2, p3 = dạng 1 phương trình (p-04, p-05) · p4 = dạng 2 hệ (p-06) · p5 = dạng 3 lập phương trình / hệ (p-07, p-08) ·
  p6, p7 = dạng 4 tỉ số lượng giác (p-09, p-10) · p8, p9 = Đề minh họa (p-10, p-11).
- **Nhãn "PHẦN n":** 1 = Ví dụ mẫu (Bài 1 = Ví dụ 1 · Bài 2 = Ví dụ 2 · Bài 3 = Ví dụ 3 · Bài 4 = Ví dụ 5; đề cương không in Ví dụ 4) · 2 = Dạng 1 phương trình quy về bậc nhất (Bài 1 có 8 ý, Bài 2 có 6 ý — ý đánh số 1)–8) trên đề, nhập thành a–h) ·
  3 = Dạng 2 hệ (Bài 1, 4 ý a–d) · 4 = Dạng 3 lập phương trình / hệ (Bài 1–6) · 5 = Dạng 4 tỉ số lượng giác (Bài 1–6, kho=hinh_hoc) · 6 = Đề minh họa (Bài I → "Bài 1" 4 ý a–d; Bài II → "Bài 2.1", "2.2", "2.3"; Bài III → "Bài 3.1", "3.2"; "Bài V" → "Bài 5").
- **Ví dụ mẫu đã có lời giải in sẵn trong đề cương (dạng bảng SEE–THINK–WONDER / Think–Puzzle–Explore): KHÔNG chép.** Giải độc lập theo luật khối 9 và khuôn hai phần; đáp số của bạn phải thử lại bằng máy
  (nếu lời giải mẫu của đề cương lệch đáp số của bạn ⇒ tính lại bằng máy rồi ghi \`**Chưa chắc:**\` nói đề cương sai ở đâu).
- **Phạm vi kiến thức (đề tự ghi):** PHẦN SỐ HỌC = Chương I (phương trình quy về bậc nhất, phương trình và hệ hai phương trình bậc nhất hai ẩn, giải toán bằng cách lập phương trình / hệ) ·
  PHẦN HÌNH HỌC = Chương IV (tỉ số lượng giác, hệ thức giữa cạnh và góc trong tam giác vuông). Đề cương KHÔNG ghi Chương II / III. Bài 5 đề minh họa ($x^2-xy+y^2=9$, tìm giá trị lớn nhất của $x^2+y^2$) là bài cực trị:
  tự chứng minh bằng $(x-y)^2\\ge0$ / hoàn thành bình phương, KHÔNG Cô-si dùng thẳng, KHÔNG căn thức chương III, KHÔNG Δ. Phương trình bậc hai ⇒ phương trình tích (mục 3.4). Các bài phương trình ở đây đều ra nghiệm hữu tỉ; nghiệm vô tỉ ⇒ \`**Chưa chắc:**\`.
- **Câu \`kho=hinh_hoc\`** (P1 Bài 4 · mọi câu của P5 · P6 Bài 3.1, 3.2): thay chữ "\`kho=hgt\`" ở brief NS bằng \`kho=hinh_hoc\`; luật được dùng / cấm, thứ tự bài, làm tròn mặc định vẫn là \`Repo\\kho-rules\\hgt\\k9.md\` (đọc thêm file đó).
  Bài có tam giác KHÔNG tách ý; Phần 2 ghi a) b) c). Tên hình giải: \`giai_P<phần>B<bài>.png\` (vd \`giai_P1B4.png\`, \`giai_P5B5.png\`, \`giai_P6B3_2.png\`); câu có \`**Hình:**\` mà hình đề đã đủ điểm của mọi ý thì không cần vẽ thêm
  (P5 Bài 1: Hình 19 đã có $A,B,C,H,E$). Câu mà hình đề là ảnh thật / hình chưa đủ điểm (P5 Bài 3 cái cây, P5 Bài 4 khúc sông, P6 Bài 3.1 khinh khí cầu) ⇒ vẽ hình giải bằng code tam giác vuông tương ứng, đủ điểm, ghi số đo đề cho, không ghi kết quả phải tìm.
- **ĐƯỜNG TRUNG BÌNH của tam giác: CẤM** (Thùy 20/10: chỉ trường Ngôi Sao Hoàng Mai được dùng) — kể cả dùng ngầm. P5 Bài 5c ($M$, $N$ là trung điểm của $AH$, $BH$ ⇒ $MN=\\dfrac{1}{2}AB$): chứng minh $\\triangle HMN\\backsim\\triangle HAB$ (c.g.c, tỉ số $\\dfrac{1}{2}$, chung góc $H$) rồi suy ra tỉ số cạnh;
  P5 Bài 6d ($I$, $H$, $K$ thẳng hàng): tìm cách chứng minh bằng tam giác đồng dạng / tam giác vuông có trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền; không viện dẫn đường trung bình.
- **Hệ thức đường cao / hệ thức cạnh góc dùng thẳng vẫn CẤM** (P6 Bài 3.2b: $AB^2=BI\\cdot BC$ là điều đề bắt chứng minh ⇒ chứng minh bằng $\\triangle BIA\\backsim\\triangle BAC$).
  P5 Bài 1a ($AH$): dùng tỉ số lượng giác hoặc diện tích, không dùng $\\dfrac{1}{AH^2}=\\dfrac{1}{AB^2}+\\dfrac{1}{AC^2}$ / $AH\\cdot BC=AB\\cdot AC$ như công thức thuộc lòng (diện tích tam giác tính hai cách thì được).
- **Làm tròn:** theo ĐỀ khi đề nêu; đề không nêu (P1 Bài 4: đề ghi "làm tròn số đo góc đến độ" ở mục yêu cầu · P5 Bài 1b, Bài 1c, Bài 3, Bài 4 · P5 Bài 6a · P6 Bài 3.1 "góc hạ") ⇒ mặc định \`hgt\\k9.md\` + \`**Chưa chắc:** đề không nêu cách làm tròn — …\`.
- **P5 Bài 2** (tháp canh): số liệu $BC=5{,}8\\ \\text{m}$, $\\widehat{C}=60^\\circ$ đã viết thêm vào lời văn (từ hình) — giữ. **P2 Bài 1h** ($(5y-4)^2=(4-5y)^2$): hai vế đồng nhất ⇒ nghiệm đúng với mọi $y$ — nêu rõ, \`loai=tu_luan\`.
- **P6 Bài 3.2c** ($\\dfrac{\\sin\\widehat{AMB}}{\\cos\\widehat{ABC}}=\\dfrac{CE}{IM}$): đã kiểm bằng toạ độ số (đẳng thức đúng); phần soạn cần tự tìm cách chứng minh trong phạm vi chương I–IV; không tìm được ngắn gọn ⇒ lời giải dài nhất có thể + \`**Chưa chắc:**\`.
${kind === 'soat' ? '- **Trạm soát:** phần có câu `kho=hinh_hoc` là p1, p6, p7, p9 — đọc thêm `hgt\\k9.md`.\n' : ''}- Đề minh họa của đề cương có Bài 1b trùng P2 Bài 1d ($3x^2-3x=(x-1)(x+3)$) — bình thường, máy gom khi ghi.

---

`
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(join(HERE, `brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  s = s.replaceAll('NS-GKI-2026', 'NT-GKI-2026')
  writeFileSync(join(HERE, `NT-GKI-2026.brief-${kind}.md`), DAU(kind) + s)
}
console.log('✔ NT-GKI-2026.brief-soan.md, NT-GKI-2026.brief-soat.md')
