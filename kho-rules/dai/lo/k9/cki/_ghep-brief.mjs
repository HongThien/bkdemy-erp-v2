// _ghep-brief.mjs — dựng kho-rules/dai/lo/k9-cki-brief-{soan,soat}.md = đầu CKI (dưới) + brief bộ đề GKI đã đổi tên (GKI→CKI, đường dẫn, kì).
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url)), LO = join(HERE, '..', '..')
const DAU = `# ⚠️ BẢN ÁP DỤNG BỘ ĐỀ CUỐI HỌC KÌ 1 TOÁN 9 (22 đề, 18/10/2026) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG "GIỮA KÌ" BÊN DƯỚI

Brief bên dưới là của bộ đề GIỮA kì 1 khối 9 đã đổi tên sang CUỐI kì. Các điểm KHÁC phải theo đây:

- \`<MA>\` = \`CKI-NN\` (01–22; danh sách + tên trường + trang gốc: \`Repo\\kho-rules\\dai\\lo\\k9\\cki\\ds-de.json\`). \`<LV>\` = \`C:\\Users\\WBPC\\bk-kho-lam-viec\\de-thi\\K9-cki\\<MA>\` (đã có \`goc.pdf\`, \`trang\\p-N.png\`, \`img\\\`, \`tam\\\`). Tệp soạn: \`Repo\\kho-rules\\dai\\lo\\k9\\cki\\<MA>.soan.md\`.
  Nguồn: \`BỘ-ĐỀ-CKI-9.pdf\` (32 trang scan, 22 đề năm học 2025–2026). Tên đề: "Đề kiểm tra cuối học kì 1 Toán 9 năm 2025-2026 — <trường> (<ghi chú>)"; \`nam: 2025\`.
- **⭐ PHẠM VI KIẾN THỨC — cuối học kì 1 (thay mục "Whitelist" của bản giữa kì):** Chương I (phương trình, hệ phương trình bậc nhất hai ẩn, phương trình quy về bậc nhất, giải bài toán bằng cách lập phương trình / hệ) · Chương II (bất đẳng thức, bất phương trình bậc nhất một ẩn) ·
  **Chương III căn thức — ĐƯỢC DÙNG ĐẦY ĐỦ:** căn bậc hai, căn bậc ba, khai căn tích / thương, đưa thừa số ra ngoài / vào trong dấu căn, trục căn thức ở mẫu, rút gọn biểu thức chứa căn, giải phương trình chứa căn, điều kiện xác định, \`|A|\` (luật \`k9.md\` §1 cho căn thức) · Chương IV (tỉ số lượng giác, hệ thức giữa cạnh và góc trong tam giác vuông) ·
  **Chương V đường tròn (nửa đầu):** đường tròn, đường kính – dây, vị trí tương đối của đường thẳng và đường tròn, **tiếp tuyến, hai tiếp tuyến cắt nhau** (tính chất MA = MB, MO là phân giác, MO ⊥ AB), vị trí tương đối của hai đường tròn; lớp 6–8 là nền (đồng dạng, Pythagore, hình chữ nhật, đường trung bình, Thalès…).
  "Bốn điểm cùng thuộc một đường tròn" làm bằng **tâm là trung điểm cạnh huyền / các điểm cách đều một điểm** (định nghĩa đường tròn), KHÔNG bằng tứ giác nội tiếp.
- **CẤM (ngoài các điều cấm cũ về Δ / Viète / đạo hàm / dấu ⇔ / "tập nghiệm S"):** góc nội tiếp, góc ở tâm – số đo cung, góc tạo bởi tia tiếp tuyến và dây cung, tứ giác nội tiếp, định lí sin / côsin; bất đẳng thức Cô-si dùng thẳng (tự chứng minh từ $(a-b)^2\\ge0$ — hay gặp ở bài cực trị cuối đề); hệ thức đường cao $h^2=b'c'$ dùng thẳng. Không làm được trong phạm vi ⇒ \`**Chưa chắc:**\`.
- **Hai đề 120 phút (CKI-17 THPT Chuyên Hà Nội – Amsterdam, CKI-22 Nguyễn Trường Tộ) và CKI-18 (Cụm chuyên môn 14 – KNTT)** khó hơn đề thường: bài khó dùng được mọi kiến thức Chương I–V ở trên; câu không giải được trong phạm vi ⇒ giải bằng cách đúng nhất có thể + \`**Chưa chắc:**\`.
- **Phân kho:** như bản giữa kì — MỌI câu hình học (chứng minh hình, tính trên hình, hệ thức lượng / lượng giác thực tế, đường tròn – tiếp tuyến) là \`kho=hinh_hoc\` (máy gán dạng bài sau, KHÔNG nêu dạng trong tệp soạn); còn lại \`kho=dai\`.
- Đề có hai mã đề 901 / 902 / 903 cùng trường (Phúc Đồng) hoặc mã 902: soạn nguyên từng đề; câu trùng nhau máy tự gom khi ghi.
- Mã chạy cổng: \`node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/cki/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9-cki/<MA>" --khoi 9 --chi-kiem\`.
- Nhãn La Mã (Bài I.1a…) cổng tự đổi sang số; đề in hai lần cùng số bài ⇒ đánh lại theo thang điểm + \`**Ghi chú:**\`. Bài hình chung dữ kiện KHÔNG tách ý.

---

`
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(join(LO, `k9-bo-de-brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  // bỏ khối "BẢN ÁP DỤNG KHỐI 9 — BỘ ĐỀ GIỮA KÌ 1" cũ? Không bỏ: giữ làm nền (luật tách ý, Phần 1/2…); chỉ đổi tên.
  s = s.replaceAll('lo\\k9\\bo-de\\', 'lo\\k9\\cki\\').replaceAll('lo/k9/bo-de/', 'lo/k9/cki/').replaceAll('de-thi\\K9\\', 'de-thi\\K9-cki\\').replaceAll('de-thi/K9/', 'de-thi/K9-cki/')
    .replaceAll('GKI-', 'CKI-').replaceAll('k8\\CKI-01', 'k8\\GKI-01').replaceAll('GKI', 'CKI').replaceAll('k9-bo-de-brief', 'k9-cki-brief').replaceAll('giữa học kì 1', 'cuối học kì 1').replaceAll('GIỮA KÌ 1', 'CUỐI KÌ 1').replaceAll('giữa kì 1', 'cuối kì 1')
    .replaceAll('(58 đề, 18/10/2026)', '(22 đề, 18/10/2026)').replaceAll('"Ôn thi giữa kì I"', '"Ôn thi" của phần Hình')
  writeFileSync(join(LO, `k9-cki-brief-${kind}.md`), DAU + s)
}
console.log('✔ k9-cki-brief-soan.md, k9-cki-brief-soat.md')
