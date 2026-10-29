// GKI26-3TRUONG.ghep-brief.mjs — dựng brief soạn / soát cho 3 đề cương K9 giữa kì 2026–27 (29/10): NQ (Ngô Quyền) · TC (Thành Công) · GV2 (Giảng Võ 2)
// = khối "BẢN ÁP DỤNG" (dưới) + brief NS (brief-soan.md / brief-soat.md) đã đổi mã đề.
//   node kho-rules/dai/lo/k9/de-cuong/GKI26-3TRUONG.ghep-brief.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))

const CHUNG = (ma, ten, soPhan, trang, banDo, phamVi, rieng) => `# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG ${ten} (${ma}) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã đổi mã đề / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề \`${ma}\` — đề cương giữa học kì I Toán 9 năm học 2026–2027, Thùy bỏ vào 29/10. \`<LV>\` = \`C:\\Users\\WBPC\\bk-kho-lam-viec\\de-cuong\\K9\\${ma}\`; số phần \`<P>\` = 1–${soPhan} (tệp \`${ma}.p<P>.soan.md\`). Thay mọi \`NS-GKI-2026\` trong lệnh bằng \`${ma}\`.
- **Ảnh đề cương:** \`<LV>\\trang\\p-1.png …\` (${trang}; 130 dpi) — NGUỒN CHÍNH, đọc từ ảnh; chỗ không chắc phóng to bằng \`pdftoppm\` như mục 2 (toạ độ 260 dpi = 2 × toạ độ trên \`p-N.png\`).
- **Bản đồ tệp → trang ảnh:** ${banDo}
- **Phạm vi kiến thức:** ${phamVi}. Phần cấm giữ nguyên mục 3.4 (không Δ / Viète, không Cô-si dùng thẳng, không hệ thức đường cao dùng thẳng, không \`⇔\`, không "tập nghiệm S"). Bất phương trình: kết luận "Vậy nghiệm của bất phương trình là $x>…$", nhân / chia số âm phải đổi chiều và nói rõ.
- **Câu \`kho=hinh_hoc\`:** thay chữ "\`kho=hgt\`" ở brief NS bằng \`kho=hinh_hoc\`; luật được dùng / cấm, thứ tự bài, làm tròn mặc định vẫn là \`Repo\\kho-rules\\hgt\\k9.md\` (đọc thêm file đó). **LUẬT TRÌNH BÀY HÌNH 7·8·9** (Thùy 27/10) trong \`Repo\\kho-rules\\hinh\\k9.md\`: dòng ngắn (~50% bề ngang, khẳng định dài tách nhiều dòng), mỗi kiến thức có ngoặc — dữ kiện đề \`(gt)\`, định lí / tính chất / dấu hiệu ghi đúng tên, kết quả đã chứng minh \`(cmt)\`; dữ liệu vẫn \`\\n\` đơn, dòng trống chỉ trước ý b/c/d và Phần 2.
  Bài có tam giác / hình dùng chung dữ kiện KHÔNG tách ý; Phần 2 ghi a) b) c). Tên hình giải: \`giai_P<phần>B<bài>.png\`; câu đã có \`**Hình:**\` thì chỉ vẽ thêm hình giải khi hình đề thiếu điểm của lời giải hoặc là ảnh thật / minh họa (cần tam giác vuông đủ điểm). Hình dựng đúng dữ kiện bằng toạ độ, đủ điểm, ghi số đo đề cho, không ghi kết quả phải tìm. Quy ước: tam giác vuông tại $A$ ⇒ $AB$ đứng, $AC$ ngang.
- **ĐƯỜNG TRUNG BÌNH của tam giác: CẤM** (Thùy 20/10: chỉ trường Ngôi Sao Hoàng Mai được dùng) — kể cả dùng ngầm. Cần "đoạn nối hai trung điểm" ⇒ chứng minh bằng tam giác đồng dạng (c.g.c, tỉ số $\\dfrac{1}{2}$) hoặc hình bình hành. **Hệ thức đường cao / hệ thức cạnh – hình chiếu dùng thẳng vẫn CẤM** (suy ra từ tam giác đồng dạng hoặc tỉ số lượng giác); riêng những bài ĐỀ BẮT CHỨNG MINH chính các hệ thức đó thì chứng minh từ đồng dạng / tỉ số lượng giác.
- **Làm tròn:** theo ĐỀ khi đề nêu; đề không nêu ⇒ mặc định của \`hgt\\k9.md\` (độ; độ dài 1 chữ số thập phân). **KHÔNG ghi \`Chưa chắc\` chỉ vì đề không nêu cách làm tròn** — dùng mặc định và, nếu cần, một dòng \`**Ghi chú:**\`.
- **Đề SAI / thiếu dữ kiện nhưng giải được (Thùy 24/10):** GIẢI BÌNH THƯỜNG theo số liệu / hình, ghi rõ "đề sai" ở dòng \`**Ghi chú:**\` và một dòng "Lưu ý: …" ở đầu Phần 2 để học sinh biết; chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ. \`**Chưa chắc:**\` chỉ dùng khi THỰC SỰ không giải được / hai cách hiểu cho hai đáp số khác nhau.
- **Bài nâng cao / cực trị:** tự chứng minh bằng hoàn thành bình phương hoặc $(a-b)^2\\ge0$, KHÔNG đạo hàm, KHÔNG Cô-si dùng thẳng. Bài tìm giá trị lớn nhất / nhỏ nhất ra MỘT số (≤ 4 kí tự) ⇒ \`tra_loi_ngan\` theo đúng dạng đề hỏi; hai đại lượng / phương án ⇒ \`tu_luan\`.
${rieng}
- Câu trùng nguyên văn giữa các phần / các đề khác — bình thường, máy gom khi ghi.

---

`

const BO = {
  'NQ-GKI-2026': {
    ten: 'NGÔ QUYỀN', so: 4, trang: '3 trang; trang 1 = lịch kiểm tra các môn, KHÔNG có bài',
    banDo: 'p1 = Dạng 1 (p-2) · p2 = Dạng 2 (p-2) · p3 = Dạng 3 Hình học (p-2 dưới, p-3 trên) · p4 = Dạng 4 Toán nâng cao (p-3). PHẦN n = Dạng n. Dạng 1 đề in 5 mục 1)–5) không đánh số bài ⇒ nhập Bài 1a–1e.',
    phamVi: 'Đại số hết bài 6 "Bất phương trình bậc nhất một ẩn" (Chương I, II) · Hình học hết bài 12 "Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng" (Chương IV). Phương trình bậc hai ⇒ phương trình tích',
    rieng: `- **Dạng 3 Bài 2:** đề có "Chú ý" (ý 1 làm tròn 2 chữ số thập phân, đến phút; kết quả ý 1 KHÔNG được dùng cho ý 2) — giữ trong đề; ý 2 chứng minh $NA\\cdot NK=MK^2+KN^2$ bằng tam giác đồng dạng / Pythagore, không dùng kết quả ý 1. **Dạng 4 Bài 1 (kim cương):** giả sử giá $=k\\cdot m^2$; cắt thành ba phần khối lượng $a,b,c$ ($a+b+c=m$) ⇒ tổng tiền $k(a^2+b^2+c^2)<km^2$ (giảm); giảm nhiều nhất khi $a=b=c=\\dfrac{m}{3}$, khi đó giảm $3$ lần — chứng minh bằng $(a-b)^2+(b-c)^2+(c-a)^2\\ge0$. **Dạng 4 Bài 2:** phân tích mẫu $(x+4)(x+5)$, $(x+5)(x+6)$, $(x+6)(x+7)$ rồi tách phân thức.
- Phần Dạng 3 Bài 1 là ảnh Lotte Center (hình thật): cần hình giải tam giác vuông đủ điểm.`,
  },
  'TC-GKI-2026': {
    ten: 'THÀNH CÔNG', so: 6, trang: '4 trang bản số; PDF có lớp chữ nhưng công thức mất cấu trúc ⇒ đọc từ ảnh, đừng tin pdftotext',
    banDo: 'p1 = A Đại số Bài 1 (p-1) · p2 = A Bài 2 (p-1) · p3 = A Bài 3–4 (p-1 dưới, p-2 đầu) · p4 = A Bài 5–19 (p-2, p-3 đầu) · p5 = B Hình học Bài 1–10 (p-3, p-4) · p6 = C Nâng cao Bài 1–4 (p-4 dưới). PHẦN 1 = A · PHẦN 2 = B · PHẦN 3 = C. Ý đề in đánh số 1)–n) ⇒ nhập a, b, c… theo đúng thứ tự.',
    phamVi: 'hệ phương trình · phương trình quy về bậc nhất (phương trình tích, chứa ẩn ở mẫu — gồm cả mẫu phải phân tích bằng hằng đẳng thức $a^3\\pm b^3$) · hàm số bậc nhất lớp 8 (A Bài 4: đường thẳng qua hai điểm, giao điểm, đồng quy) · giải toán bằng cách lập phương trình / hệ / bất phương trình · tỉ số lượng giác · hệ thức giữa cạnh và góc trong tam giác vuông',
    rieng: `- **A Bài 13:** đề in "trộn gam bao nhiêu dung dịch" (chữ "gam" sai chỗ, đã sửa); đáp số không nguyên ($\\dfrac{2700}{19}\\ \\text{g}$ dung dịch $30\\%$ và $\\dfrac{3000}{19}\\ \\text{g}$ dung dịch $1{,}5\\%$) — giải bình thường, nêu cả phân số lẫn số thập phân. **A Bài 16:** bảng điểm đã đổi thành hai dòng chữ; Toán là điều phải tìm (hệ số 2, trung bình ≥ 8, không môn nào dưới 6). **A Bài 15, 17, 18, 19:** bất phương trình bậc nhất, kết luận bằng lời (số nguyên nhỏ nhất / lớn nhất đúng yêu cầu).
- **B Bài 7, 8, 9, 10** có ý đề bắt chứng minh hệ thức đường cao / hình chiếu (7a, 7b, 7c; 8b; 9b) — chứng minh từ tam giác đồng dạng hoặc tỉ số lượng giác, KHÔNG dùng thẳng. **B Bài 8d** ("tam giác $ABC$ cần thỏa mãn điều kiện gì để $S_{BHD}=\\dfrac{1}{4}S_{BKC}\\cos^2\\widehat{ABD}$"): tìm điều kiện bằng suy luận + kiểm toạ độ; nếu đề không có điều kiện đẹp thì giải bình thường và ghi rõ "đề sai" theo quy tắc trên. **B Bài 10c:** $AI$ là đường TRUNG TUYẾN (không phải đường trung bình). Hình thật (B Bài 2–5, C Bài 4) cần hình giải tam giác vuông đủ điểm.
- **C Bài 3:** $x=15$ (diện tích lớn nhất $225\\ \\text{m}^2$) — hoàn thành bình phương. **C Bài 4:** kích thước $30\\ \\text{m}\\times20\\ \\text{m}$, diện tích lớn nhất $600\\ \\text{m}^2$ — dùng tam giác đồng dạng lập quan hệ giữa hai cạnh rồi hoàn thành bình phương.`,
  },
  'GV2-GKI-2026': {
    ten: 'GIẢNG VÕ 2', so: 8, trang: '6 trang bản số; trang 1 = bìa, KHÔNG có bài',
    banDo: 'p1 = Dạng 1 Bài 1 (p-2) · p2 = Dạng 1 Bài 2 (p-2) · p3 = Dạng 2 Bài 3 (p-2 dưới) · p4 = Dạng 3 Bài 4–8 (p-3) · p5 = Dạng 4 Bài 9–12 (p-3 dưới, p-4 đầu) · p6 = Dạng 5 Bài 13–17 (p-4) · p7 = Dạng 6 Bài 18–22 (p-4 dưới, p-5) · p8 = Đề minh họa (p-6). PHẦN n = Dạng n (n ≤ 6), PHẦN 7 = Đề minh họa; Bài 1–22 đánh số LIÊN TỤC qua các dạng. Đề in nhãn ý bỏ chữ f (Bài 1: a,b,c,d,e,g,h,i · Bài 2: a–e,g · Bài 3: a–e,g,h) — khung đã nhập lại liên tiếp a–h / a–f / a–g theo đúng thứ tự.',
    phamVi: 'hệ phương trình bậc nhất hai ẩn · phương trình quy về bậc nhất · lập phương trình / hệ · tỉ số lượng giác · hệ thức giữa cạnh và góc trong tam giác vuông · **đường tròn (đề ghi "chứng minh nhiều điểm thuộc đường tròn")**: chỉ dùng định nghĩa đường tròn (các điểm cách đều một điểm) và "tam giác có đường trung tuyến ứng với một cạnh bằng nửa cạnh ấy thì vuông" / "tâm = trung điểm cạnh huyền"; KHÔNG góc nội tiếp, KHÔNG góc ở tâm – số đo cung, KHÔNG tứ giác nội tiếp. Bài 12c chương trình lớp 8 (hình chóp tứ giác đều, hình hộp chữ nhật) dùng được',
    rieng: `- **Bài 13c** ($OI\\parallel AH$ với $O$ = trung điểm $AK$, $I$ = trung điểm $HK$): chứng minh bằng $\\triangle KOI\\backsim\\triangle KAH$ (c.g.c, tỉ số $\\dfrac{1}{2}$, chung góc $K$), KHÔNG đường trung bình. **Bài 17** ($M$, $N$ thuộc đường tròn đường kính $BC$): $\\widehat{BMC}=\\widehat{BNC}=90^\\circ$ chứng minh từ $OM=OB=OC$ (tam giác cân, tổng ba góc), KHÔNG dùng "góc nội tiếp chắn nửa đường tròn"; ý b ($\\widehat{INO}$) và ý c ($BM\\cdot BA+CN\\cdot CA=4OC^2$) dùng tam giác đồng dạng. **Bài 15c:** $\\widehat{DBC}=30^\\circ$ ⇒ tính $DM$ qua tam giác vuông.
- **Bài 18:** giá khuyến mãi $=25-t$ (nghìn), số đèn $=200+20t$, lợi nhuận $=(18-t)(200+20t)=20(18-t)(10+t)$ lớn nhất khi $t=4$ ⇒ hoàn thành bình phương. **Bài 19** (hình chóp tứ giác đều, diện tích xung quanh $=4\\cdot\\dfrac{1}{2}\\cdot8\\cdot$ trung đoạn): làm bằng Pythagore; hình thật ⇒ vẽ hình giải. **Bài 20:** $S=a^2+\\dfrac{16}{a}$ nhỏ nhất khi $a=2$ — chứng minh $S-12=\\dfrac{(a-2)^2(a+4)}{a}\\ge0$ (không Cô-si). **Bài 21:** bài quy hoạch nguyên nhỏ (đặt đơn vị $100\\,000$ đồng) — chỉ ra phương án tối ưu bằng suy luận chặt (kiểm bằng máy duyệt mọi bộ $(x,y,z)$), trình bày được cho học sinh lớp 9. **Bài 22:** $15x+8y=4000$ nghiệm nguyên dương: nêu nghiệm tổng quát ($x=8k$, $y=500-15k$, $k=1,\\dots,33$) và giải thích cách tìm; \`tu_luan\`.
- **Đề minh họa Bài 2.1** (hai số tự nhiên, thương 2 dư 124), **2.2** (ô tô), **3.2b** ($A,E,H,D$ cùng thuộc đường tròn: tâm là trung điểm $AH$ vì $\\widehat{ADH}=\\widehat{AEH}=90^\\circ$), **3.2c** (chứng minh bằng đồng dạng), **Bài 4** (lợi nhuận lớn nhất, hoàn thành bình phương).`,
  },
}

for (const [ma, o] of Object.entries(BO)) {
  for (const kind of ['soan', 'soat']) {
    let s = readFileSync(join(HERE, `brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n').replaceAll('NS-GKI-2026', ma)
    const dau = CHUNG(ma, o.ten, o.so, o.trang, o.banDo, o.phamVi, o.rieng) + (kind === 'soat' ? '- **Trạm soát:** mọi phần có câu `kho=hinh_hoc` đều đọc thêm `hgt\\k9.md`; kiểm cả hình đề và hình giải.\n\n---\n\n' : '')
    writeFileSync(join(HERE, `${ma}.brief-${kind}.md`), dau + s)
  }
  console.log('✔', ma)
}
