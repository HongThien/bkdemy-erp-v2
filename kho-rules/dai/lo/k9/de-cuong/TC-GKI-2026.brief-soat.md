# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG THÀNH CÔNG (TC-GKI-2026) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã đổi mã đề / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề `TC-GKI-2026` — đề cương giữa học kì I Toán 9 năm học 2026–2027, Thùy bỏ vào 29/10. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TC-GKI-2026`; số phần `<P>` = 1–6 (tệp `TC-GKI-2026.p<P>.soan.md`). Thay mọi `NS-GKI-2026` trong lệnh bằng `TC-GKI-2026`.
- **Ảnh đề cương:** `<LV>\trang\p-1.png …` (4 trang bản số; PDF có lớp chữ nhưng công thức mất cấu trúc ⇒ đọc từ ảnh, đừng tin pdftotext; 130 dpi) — NGUỒN CHÍNH, đọc từ ảnh; chỗ không chắc phóng to bằng `pdftoppm` như mục 2 (toạ độ 260 dpi = 2 × toạ độ trên `p-N.png`).
- **Bản đồ tệp → trang ảnh:** p1 = A Đại số Bài 1 (p-1) · p2 = A Bài 2 (p-1) · p3 = A Bài 3–4 (p-1 dưới, p-2 đầu) · p4 = A Bài 5–19 (p-2, p-3 đầu) · p5 = B Hình học Bài 1–10 (p-3, p-4) · p6 = C Nâng cao Bài 1–4 (p-4 dưới). PHẦN 1 = A · PHẦN 2 = B · PHẦN 3 = C. Ý đề in đánh số 1)–n) ⇒ nhập a, b, c… theo đúng thứ tự.
- **Phạm vi kiến thức:** hệ phương trình · phương trình quy về bậc nhất (phương trình tích, chứa ẩn ở mẫu — gồm cả mẫu phải phân tích bằng hằng đẳng thức $a^3\pm b^3$) · hàm số bậc nhất lớp 8 (A Bài 4: đường thẳng qua hai điểm, giao điểm, đồng quy) · giải toán bằng cách lập phương trình / hệ / bất phương trình · tỉ số lượng giác · hệ thức giữa cạnh và góc trong tam giác vuông. Phần cấm giữ nguyên mục 3.4 (không Δ / Viète, không Cô-si dùng thẳng, không hệ thức đường cao dùng thẳng, không `⇔`, không "tập nghiệm S"). Bất phương trình: kết luận "Vậy nghiệm của bất phương trình là $x>…$", nhân / chia số âm phải đổi chiều và nói rõ.
- **Câu `kho=hinh_hoc`:** thay chữ "`kho=hgt`" ở brief NS bằng `kho=hinh_hoc`; luật được dùng / cấm, thứ tự bài, làm tròn mặc định vẫn là `Repo\kho-rules\hgt\k9.md` (đọc thêm file đó). **LUẬT TRÌNH BÀY HÌNH 7·8·9** (Thùy 27/10) trong `Repo\kho-rules\hinh\k9.md`: dòng ngắn (~50% bề ngang, khẳng định dài tách nhiều dòng), mỗi kiến thức có ngoặc — dữ kiện đề `(gt)`, định lí / tính chất / dấu hiệu ghi đúng tên, kết quả đã chứng minh `(cmt)`; dữ liệu vẫn `\n` đơn, dòng trống chỉ trước ý b/c/d và Phần 2.
  Bài có tam giác / hình dùng chung dữ kiện KHÔNG tách ý; Phần 2 ghi a) b) c). Tên hình giải: `giai_P<phần>B<bài>.png`; câu đã có `**Hình:**` thì chỉ vẽ thêm hình giải khi hình đề thiếu điểm của lời giải hoặc là ảnh thật / minh họa (cần tam giác vuông đủ điểm). Hình dựng đúng dữ kiện bằng toạ độ, đủ điểm, ghi số đo đề cho, không ghi kết quả phải tìm. Quy ước: tam giác vuông tại $A$ ⇒ $AB$ đứng, $AC$ ngang.
- **ĐƯỜNG TRUNG BÌNH của tam giác: CẤM** (Thùy 20/10: chỉ trường Ngôi Sao Hoàng Mai được dùng) — kể cả dùng ngầm. Cần "đoạn nối hai trung điểm" ⇒ chứng minh bằng tam giác đồng dạng (c.g.c, tỉ số $\dfrac{1}{2}$) hoặc hình bình hành. **Hệ thức đường cao / hệ thức cạnh – hình chiếu dùng thẳng vẫn CẤM** (suy ra từ tam giác đồng dạng hoặc tỉ số lượng giác); riêng những bài ĐỀ BẮT CHỨNG MINH chính các hệ thức đó thì chứng minh từ đồng dạng / tỉ số lượng giác.
- **Làm tròn:** theo ĐỀ khi đề nêu; đề không nêu ⇒ mặc định của `hgt\k9.md` (độ; độ dài 1 chữ số thập phân). **KHÔNG ghi `Chưa chắc` chỉ vì đề không nêu cách làm tròn** — dùng mặc định và, nếu cần, một dòng `**Ghi chú:**`.
- **Đề SAI / thiếu dữ kiện nhưng giải được (Thùy 24/10):** GIẢI BÌNH THƯỜNG theo số liệu / hình, ghi rõ "đề sai" ở dòng `**Ghi chú:**` và một dòng "Lưu ý: …" ở đầu Phần 2 để học sinh biết; chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ. `**Chưa chắc:**` chỉ dùng khi THỰC SỰ không giải được / hai cách hiểu cho hai đáp số khác nhau.
- **Bài nâng cao / cực trị:** tự chứng minh bằng hoàn thành bình phương hoặc $(a-b)^2\ge0$, KHÔNG đạo hàm, KHÔNG Cô-si dùng thẳng. Bài tìm giá trị lớn nhất / nhỏ nhất ra MỘT số (≤ 4 kí tự) ⇒ `tra_loi_ngan` theo đúng dạng đề hỏi; hai đại lượng / phương án ⇒ `tu_luan`.
- **A Bài 13:** đề in "trộn gam bao nhiêu dung dịch" (chữ "gam" sai chỗ, đã sửa); đáp số không nguyên ($\dfrac{2700}{19}\ \text{g}$ dung dịch $30\%$ và $\dfrac{3000}{19}\ \text{g}$ dung dịch $1{,}5\%$) — giải bình thường, nêu cả phân số lẫn số thập phân. **A Bài 16:** bảng điểm đã đổi thành hai dòng chữ; Toán là điều phải tìm (hệ số 2, trung bình ≥ 8, không môn nào dưới 6). **A Bài 15, 17, 18, 19:** bất phương trình bậc nhất, kết luận bằng lời (số nguyên nhỏ nhất / lớn nhất đúng yêu cầu).
- **B Bài 7, 8, 9, 10** có ý đề bắt chứng minh hệ thức đường cao / hình chiếu (7a, 7b, 7c; 8b; 9b) — chứng minh từ tam giác đồng dạng hoặc tỉ số lượng giác, KHÔNG dùng thẳng. **B Bài 8d** ("tam giác $ABC$ cần thỏa mãn điều kiện gì để $S_{BHD}=\dfrac{1}{4}S_{BKC}\cos^2\widehat{ABD}$"): tìm điều kiện bằng suy luận + kiểm toạ độ; nếu đề không có điều kiện đẹp thì giải bình thường và ghi rõ "đề sai" theo quy tắc trên. **B Bài 10c:** $AI$ là đường TRUNG TUYẾN (không phải đường trung bình). Hình thật (B Bài 2–5, C Bài 4) cần hình giải tam giác vuông đủ điểm.
- **C Bài 3:** $x=15$ (diện tích lớn nhất $225\ \text{m}^2$) — hoàn thành bình phương. **C Bài 4:** kích thước $30\ \text{m}\times20\ \text{m}$, diện tích lớn nhất $600\ \text{m}^2$ — dùng tam giác đồng dạng lập quan hệ giữa hai cạnh rồi hoàn thành bình phương.
- Câu trùng nguyên văn giữa các phần / các đề khác — bình thường, máy gom khi ghi.

---

- **Trạm soát:** mọi phần có câu `kho=hinh_hoc` đều đọc thêm `hgt\k9.md`; kiểm cả hình đề và hình giải.

---

# Brief giao trạm SOÁT — ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (TC-GKI-2026) (13/10)

> `<P>` = số phần (1–9). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TC-GKI-2026`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Cùng khuôn `kho-rules/dai/lo/k8/de-cuong/brief-soat.md`, luật kiến thức khối 9.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT PHẦN của đề cương ôn tập giữa học kì I Toán 9 đã được trạm khác soạn lời giải. Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi phần của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k9\de-cuong\brief-soan.md` (mục 2 nguồn, mục 3.4 phạm vi kiến thức + điều cấm, mục 4 khuôn) và luật khối: `Repo\kho-rules\dai\k9.md` (§1, §1.5, §2, §3);
   phần có câu `kho=hgt` (P6, P7, P8, P9) đọc thêm `Repo\kho-rules\hgt\k9.md`.
2. Mở HẾT ảnh `<LV>\trang\p-1.png … p-4.png` bằng công cụ Read (bản scan — chỗ không chắc phóng to:
   `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"`, toạ độ ở 260 dpi = 2 × toạ độ trên `p-N.png`). **Chưa mở** tệp `TC-GKI-2026.p<P>.soan.md`.
3. Tự giải các câu của phần bạn. Danh sách nhãn câu + phần (A / B / C) của tệp: lấy bằng lệnh (chạy từ Repo)
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/de-cuong/TC-GKI-2026.p<P>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ')[0]:l).join('\n'))"`
   — chỉ lệnh này (nó in cả các dòng Ghi chú / Chưa chắc của NGƯỜI GÕ ĐỀ: chỗ đề cương in thiếu / in sai đã được nhập thế nào — bạn giải theo bản đã nhập đó), KHÔNG đọc nội dung bản soạn.
   Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc): hệ / phương trình thay nghiệm vào đề + quét lưới tìm nghiệm sót; bất phương trình thử hai phía biên; tham số quét lưới $m$;
   lời văn thay đáp số vào từng dữ kiện; lượng giác bằng `Math`; hình dựng toạ độ số; bất đẳng thức thử ≥ 2000 bộ số ngẫu nhiên. Không nhẩm.
4. Ghi `Repo\kho-rules\dai\lo\k9\de-cuong\TC-GKI-2026.p<P>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

5. Đọc khuôn tệp mẫu `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ lấy khuôn tệp).
6. Mở `Repo\kho-rules\dai\lo\k9\de-cuong\TC-GKI-2026.p<P>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, dấu, tên điểm, đủ ý) — trừ các chỗ người gõ đã ghi rõ là xử lí đề in thiếu / in sai (giữ; nếu bạn thấy cách xử lí đó SAI thì nêu trong `Chưa chắc` + biên bản).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (brief soạn mục 3.4: KHÔNG $\Delta$ / công thức nghiệm / Viète, KHÔNG biến đổi căn thức chương III, KHÔNG Cô-si dùng thẳng, KHÔNG hệ thức đường cao /
     định lí sin, côsin dùng thẳng, KHÔNG `⇔`, KHÔNG "tập nghiệm $S$" — kể cả dùng NGẦM không gọi tên) · điều kiện xác định + đối chiếu điều kiện · đổi chiều bất phương trình khi nhân / chia số âm ·
     Phần 2 đúng khuôn vở lớp 9, mỗi phép biến đổi một dòng, kết luận bằng lời đủ mọi đại lượng đề hỏi · dấu nhân `\cdot` ·
     Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Bài tham số: xét điều kiện có nghiệm trước, đối chiếu sau. Bất đẳng thức: mỗi bước đúng với MỌI giá trị biến trong điều kiện (kiểm cả biên, số âm).
   - **Lượng giác / hình (`kho=hgt`)**: nêu tam giác vuông nào, vuông tại đâu; `\tan\cdot\cot=1`, `\sin^2+\cos^2=1`, tỉ số hai góc phụ nhau có ghi căn cứ như `hgt\k9.md`;
     làm tròn theo ĐỀ (đề không nêu ⇒ mặc định của `hgt\k9.md` + `Chưa chắc`); không tính tiếp từ số đã làm tròn; bài có tam giác không tách ý.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`) theo đúng dạng đề hỏi; còn lại `tu_luan` (`dap_an=—`). Không tách / gộp / đổi nhãn câu; `kho` giữ nguyên.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với dòng `**Hình:**` (hình của đề — đúng câu, không dính chữ câu khác) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện đề, đủ điểm của mọi ý, tên điểm đúng chỗ,
     chỉ ghi số đo đề cho, không ghi kết quả phải tìm, nhãn không đè / không cụt). Sai ⇒ sửa script `<LV>\tam\ve_p<P>.mjs` rồi vẽ lại (`node` từ thư mục Repo).
     Bài `kho=hgt` có tam giác / hình thang mà không có `**Hình:**` lẫn `**Hình giải:**` ⇒ bạn vẽ thêm (cách vẽ: brief soạn mục 3.5).
   - **Ghi chú / Chưa chắc**: dòng của người gõ đề giữ. Dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề cương in sai mà trạm soạn bỏ sót ⇒ thêm
     `**Chưa chắc:**` nói rõ đề sai ở đâu và đúng phải là gì (chứng minh bằng máy khi có thể). Đừng ghi tràn lan.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `TC-GKI-2026.p<P>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `…p<P>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ thêm / giữ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/de-cuong/TC-GKI-2026.p<P>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TC-GKI-2026" --khoi 9 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\k9\de-cuong\TC-GKI-2026.p<P>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
