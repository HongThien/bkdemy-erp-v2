// AK-GKI-2026.ghep-brief.mjs — dựng AK-GKI-2026.brief-soan.md / brief-soat.md = khối "BẢN ÁP DỤNG" (dưới) + brief NS (brief-soan.md / brief-soat.md) đã đổi mã đề.
//   node kho-rules/dai/lo/k9/de-cuong/AK-GKI-2026.ghep-brief.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const DAU = (kind) => `# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG AN KHÁNH (AK-GKI-2026) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã đổi mã đề / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề \`AK-GKI-2026\` (THCS An Khánh, Hà Nội — "ĐỀ CƯƠNG GK1 AN KHÁNH KHỐI 9", năm học 2026–2027, Thùy đưa 24/10). \`<LV>\` = \`C:\\Users\\WBPC\\bk-kho-lam-viec\\de-cuong\\K9\\AK-GKI-2026\`; số phần \`<P>\` = 1–5 (tệp \`AK-GKI-2026.p<P>.soan.md\`, mỗi tệp = MỘT đề). Thay mọi \`NS-GKI-2026\` trong lệnh bằng \`AK-GKI-2026\`.
- **Ảnh đề cương:** \`<LV>\\trang\\p-1.png … p-4.png\` (4 trang, 130 dpi, ảnh chụp/scan, không có lớp chữ) — NGUỒN CHÍNH, đọc từ ảnh; chỗ không chắc phóng to bằng \`pdftoppm\` như mục 2 (toạ độ 260 dpi = 2 × toạ độ trên \`p-N.png\`).
- **Bản đồ tệp → trang ảnh:** p1 = ĐỀ 1 (p-1) · p2 = ĐỀ 2 (p-1 nửa dưới, p-2 nửa trên) · p3 = ĐỀ 3 (p-2 nửa dưới, p-3 nửa trên) · p4 = ĐỀ 4 (p-3 nửa dưới, p-4 đầu) · p5 = ĐỀ 5 (p-4).
- **Nhãn:** PHẦN n = ĐỀ n. Đề 1 in "Bài 1–6", Đề 2–5 in "Câu …" — trong tệp đều ghi nhãn "Bài k" (k = số thứ tự trong đề). Đề 2 in sai số câu ("Câu 11" nằm giữa Câu 1 và Câu 2; hai "Câu 4"): khung đã đánh lại 1–6 theo thứ tự, giữ Ghi chú có sẵn.
- **Phạm vi kiến thức:** Chương I (phương trình quy về bậc nhất, hệ hai phương trình bậc nhất hai ẩn, giải toán bằng cách lập phương trình / hệ) · **Chương II (bất đẳng thức, bất phương trình bậc nhất một ẩn — ĐƯỢC DÙNG)** · Chương IV (tỉ số lượng giác, hệ thức cạnh – góc). Phần cấm giữ nguyên mục 3.4 (không Δ / Viète, không Cô-si dùng thẳng, không hệ thức đường cao dùng thẳng, không \`⇔\`, không "tập nghiệm S").
  Bất phương trình: kết luận "Vậy nghiệm của bất phương trình là $x>…$" (hoặc $x\\le…$), nhân / chia số âm phải đổi chiều và nói rõ.
- **Bài có căn (ĐỀ 3 Bài 6: $E=\\dfrac{x}{\\sqrt{2}}+\\dfrac{2}{\\sqrt{x}}-\\sqrt{x}-\\sqrt{2}$):** đề tự dùng căn nên được dùng căn bậc hai số học + điều kiện $x>0$; đặt $t=\\sqrt{x}$ ($t>0$) rồi hoàn thành bình phương / chứng minh $E\\ge\\dots$ bằng phép biến đổi tương đương (gợi ý: $E=\\dfrac{(t-\\sqrt{2})^2(t+\\sqrt{2})}{\\sqrt{2}\\,t}$), không đạo hàm, không Cô-si dùng thẳng.
  **ĐỀ 4 Bài 6** ($P=\\sum\\dfrac{a^3}{a^2+b^2}$, $a+b+c=3$): tách $\\dfrac{a^3}{a^2+b^2}=a-\\dfrac{ab^2}{a^2+b^2}$ rồi dùng $a^2+b^2\\ge2ab$ (chứng minh từ $(a-b)^2\\ge0$). **ĐỀ 2 Bài 6** (hai bất đẳng thức liên tiếp): chứng minh từng vế từ $(a-b)^2\\ge0$.
- **Câu \`kho=hinh_hoc\`** (Đề 1 Bài 5, 6 · Đề 2 Bài 4, 5 · Đề 3 Bài 4.1, 4.2, 5 · Đề 4 Bài 4, 5 · Đề 5 Bài 5, 6): thay chữ "\`kho=hgt\`" ở brief NS bằng \`kho=hinh_hoc\`; luật được dùng / cấm, thứ tự bài, làm tròn mặc định vẫn là \`Repo\\kho-rules\\hgt\\k9.md\` (đọc thêm file đó).
  Bài có tam giác / hình chữ nhật dùng chung dữ kiện KHÔNG tách ý; Phần 2 ghi a) b). Tên hình giải: \`giai_P<phần>B<bài>.png\` (vd \`giai_P1B5.png\`, \`giai_P2B4.png\`); câu đã có \`**Hình:**\` thì chỉ vẽ thêm hình giải khi hình đề thiếu điểm của lời giải
  (hình đề của Đề 1 Bài 6, Đề 2 Bài 5, Đề 3/4 Bài 5, Đề 5 Bài 5 là hình thật / minh họa, lời giải cần hình tam giác vuông đủ điểm ⇒ vẽ \`giai_…\`). Hình dựng đúng dữ kiện bằng toạ độ, đủ điểm, ghi số đo đề cho, không ghi kết quả phải tìm. Quy ước hình: tam giác vuông tại $A$ ⇒ $AB$ đứng, $AC$ ngang.
- **ĐƯỜNG TRUNG BÌNH của tam giác: CẤM** (Thùy 20/10: chỉ trường Ngôi Sao Hoàng Mai được dùng) — kể cả dùng ngầm. **Hệ thức đường cao dùng thẳng vẫn CẤM** (suy ra từ tam giác đồng dạng).
- **Làm tròn:** theo ĐỀ khi đề nêu; đề không nêu (Đề 1 Bài 5 cạnh $AC$ · Đề 2 Bài 4a góc đã nêu đến độ · Đề 5 Bài 6a) ⇒ mặc định của \`hgt\\k9.md\` (độ; độ dài 1 chữ số thập phân). **KHÔNG ghi \`Chưa chắc\` chỉ vì đề không nêu cách làm tròn** — dùng mặc định và, nếu cần, một dòng \`**Ghi chú:**\`.
- **Đề SAI / thiếu dữ kiện nhưng giải được (Thùy 24/10):** GIẢI BÌNH THƯỜNG theo số liệu / hình, ghi rõ "đề sai" ở dòng \`**Ghi chú:**\` và một dòng "Lưu ý: …" ở đầu Phần 2 để học sinh biết; chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ. \`**Chưa chắc:**\` chỉ dùng khi THỰC SỰ không giải được / hai cách hiểu cho hai đáp số khác nhau.
  Cần kiểm kĩ: **Đề 2 Bài 4b** (đề nhắc $M$, $N$ nhưng câu chứng minh $\\widehat{BHK}=\\widehat{BID}$ không dùng chúng — kiểm bằng toạ độ số xem đẳng thức đúng không; sai thì giải bình thường + ghi rõ "đề sai" + nêu đẳng thức đúng) · **Đề 3 Bài 4.1** ("giải thích tại sao" biểu thức bằng $-2$: dùng $\\sin\\alpha=\\cos(90^\\circ-\\alpha)$, $\\tan\\alpha=\\cot(90^\\circ-\\alpha)$ — kiểm bằng máy) · **Đề 3 Bài 4.2** ($AB=BC\\cdot\\cos B\\approx16{,}18$) · **Đề 3 Bài 2** (các bất đẳng thức mô tả tình huống: $x\\ge18$, $m\\le700$, …; loại \`tu_luan\`, \`dap_an=—\`).
- Đề 3 Bài 5 và Đề 4 Bài 5 trùng nguyên văn — bình thường, máy gom khi ghi.
${kind === 'soat' ? '- **Trạm soát:** mọi phần đều có câu `kho=hinh_hoc` — đọc thêm `hgt\\k9.md`.\n' : ''}
---

`
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(join(HERE, `brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  s = s.replaceAll('NS-GKI-2026', 'AK-GKI-2026')
  writeFileSync(join(HERE, `AK-GKI-2026.brief-${kind}.md`), DAU(kind) + s)
}
console.log('✔ AK-GKI-2026.brief-soan.md, AK-GKI-2026.brief-soat.md')
