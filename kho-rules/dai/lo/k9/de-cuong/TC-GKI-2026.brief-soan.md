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

# Brief giao trạm SOẠN — ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (TC-GKI-2026) (13/10)

> Lưu nguyên văn brief (README §4 việc #5). `<P>` = số phần (1–9). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TC-GKI-2026`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> Cùng dây chuyền đề cương khối 8 (`kho-rules/dai/k8.md` §12, `lo/k8/de-cuong/brief-soan.md`) — khác ở LUẬT KIẾN THỨC (khối 9) và kho hình (hệ thức lượng ⇒ `hgt`).

---

Bạn là trạm SOẠN cho MỘT PHẦN của đề cương ôn tập giữa học kì I Toán 9. Việc: **giải chi tiết mọi câu của phần được giao** theo luật khối 9, viết thẳng vào tệp khung.
Tệp của bạn: `Repo\kho-rules\dai\lo\k9\de-cuong\TC-GKI-2026.p<P>.soan.md` (đã có sẵn tiêu đề + đề từng câu). KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo,
KHÔNG commit. (Được ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. Luật khối 9: câu `kho=dai` ⇒ `Repo\kho-rules\dai\k9.md` (§1 luật kiến thức theo thứ tự bài, §1.5 hai phần, §2 khuôn Phần 2 theo dạng, §3 định dạng);
   câu `kho=hgt` ⇒ thêm `Repo\kho-rules\hgt\k9.md` (được dùng / cấm, thứ tự bài, làm tròn mặc định, hình).
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **khuôn TỆP** đã CEO xem (cách đặt dòng `### …`, `**Đề:**`, `**Phần 1. Hướng dẫn**`, `**Mấu chốt:**`, `**Bước k.**`, `**Phần 2. Trình bày**`).
   Chỉ lấy KHUÔN TỆP ở đó — kiến thức và cách trình bày theo luật khối 9.

## 2. Nguồn

- `<LV>\trang\p-1.png … p-4.png` — 4 trang ảnh đề cương (130 dpi, BẢN SCAN, không có lớp chữ) — NGUỒN CHÍNH. Mở HẾT bằng công cụ Read, đối chiếu từng câu của phần bạn: chữ, số, số mũ, dấu, dấu ngoặc.
  Chỗ không chắc ⇒ phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ trên ảnh `p-N.png`) rồi Read.
- Tệp khung do người gõ — **lệch ảnh thì ảnh đúng** ⇒ sửa dòng `**Đề:**` cho đúng ảnh (sửa tối thiểu, thêm `**Ghi chú:**` nói đã sửa gì).
  NGOẠI LỆ: các chỗ đề cương in thiếu / in sai mà người gõ đã xử lí và ghi rõ ở dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn (thêm "$=0$", sửa bất đẳng thức in sai…) — giữ nguyên như khung, đừng trả về bản in.
- Đề cương đánh số bài lại từ 1 ở mỗi phần (A. Đại số · B. Hình học · C. Nâng cao) — tệp của bạn chỉ thuộc MỘT phần (xem dòng `## PHẦN`), tìm đúng mục đó trên ảnh.
- Hình có sẵn trong đề đã cắt vào `<LV>\img\de_*.png` và khai bằng dòng `**Hình:**` (giữ nguyên; mở xem đúng hình của câu).
- Đề cương KHÔNG có đáp án. Đáp số lấy từ lượt giải của bạn rồi trạm soát (Opus) giải mù đối chiếu.

## 3. Việc phải làm

1. Mỗi câu: điền `loai=` và `dap_an=` ở dòng `### …`, viết lời giải 2 phần (mục 4) ngay sau các dòng `**Đề:**` / `**Hình:**` / `**Ghi chú:**` / `**Chưa chắc:**` có sẵn.
   - `loai=tra_loi_ngan` CHỈ khi đáp số là MỘT số nguyên / thập phân viết được trong 4 ô (chữ số, dấu `-` đầu, dấu `,`; ≤ 4 kí tự: `13`, `-1`, `2,5`) theo ĐÚNG dạng đề hỏi
     (vd "Tìm số nguyên lớn nhất…" ra $1$ ⇒ `tra_loi_ngan`, `dap_an=1`; phương trình có MỘT nghiệm $x=-4$ ⇒ `dap_an=-4`). Hai nghiệm, cặp $(x;y)$, phân số, khoảng nghiệm của bất phương trình,
     vô nghiệm, chứng minh, bài nhiều ý, bài hỏi hai đại lượng ⇒ `loai=tu_luan`, `dap_an=—`. `dap_an` của TLN chỉ ghi số.
   - `kho=` (`dai` / `hgt`) đã điền sẵn — giữ.
2. **Giữ nguyên** nhãn, không tách thêm / gộp câu. Các dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn giữ; chỉ **thêm** khi cần.
3. **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write, KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): hệ / phương trình ⇒ thay nghiệm vào ĐỀ
   (dùng phân số chính xác hoặc sai số $10^{-9}$) và quét lưới xem có sót nghiệm; bất phương trình ⇒ thử hai phía của biên + chính biên; tham số $m$ ⇒ quét lưới $m$; lời văn ⇒ thay đáp số vào từng dữ kiện;
   lượng giác ⇒ `Math.sin(x*Math.PI/180)`; hình ⇒ dựng toạ độ số, kiểm từng khẳng định; bất đẳng thức ⇒ thử ≥ 2000 bộ số ngẫu nhiên (cả biên, cả số âm nếu đề cho số thực). Đừng nhẩm.
4. **Kiến thức — luật quan trọng nhất.** Phạm vi của đề cương (đề tự ghi "Chương I; chương II; chương IV"):
   **Chương I** (phương trình quy về bậc nhất: phương trình tích, phương trình chứa ẩn ở mẫu; phương trình và hệ hai phương trình bậc nhất hai ẩn — phương pháp thế, cộng đại số; giải toán bằng cách lập phương trình / hệ phương trình),
   **Chương II** (bất đẳng thức và tính chất; bất phương trình bậc nhất một ẩn), **Chương IV** (tỉ số lượng giác của góc nhọn; hệ thức giữa cạnh và góc trong tam giác vuông). Lớp 6–8 là nền
   (hằng đẳng thức, phân tích đa thức thành nhân tử, phân thức, hàm số bậc nhất và đồ thị, tam giác đồng dạng, định lí Pythagore, tính chất đường phân giác của tam giác, căn bậc hai số học của lớp 7…).
   **CẤM (dù lời giải ngắn hơn):** công thức nghiệm / $\Delta$ / định lí Viète (chương sau) · các phép biến đổi căn thức của Chương III (đưa thừa số ra ngoài dấu căn, trục căn thức…) ·
   kiến thức đường tròn · bất đẳng thức Cô-si dùng thẳng (phải tự chứng minh từ $(a-b)^2\ge0$) · hệ thức đường cao $h^2=b'c'$, $b^2=ab'$, $\dfrac{1}{h^2}=\dfrac{1}{b^2}+\dfrac{1}{c^2}$ dùng thẳng,
   định lí sin / côsin (xem `hgt\k9.md`) · dấu `⇔` · "tập nghiệm $S=\{…\}$" (kết luận bằng LỜI: "Vậy phương trình có nghiệm $x=…$", "Vậy hệ phương trình có nghiệm duy nhất $(x;y)=(…;…)$").
   Phương trình bậc hai, bậc cao: đưa về PHƯƠNG TRÌNH TÍCH bằng phân tích nhân tử (tách hạng tử, nhóm, hằng đẳng thức). Nhân tử bậc hai vô nghiệm ⇒ chứng minh nó luôn dương bằng hoàn thành bình phương.
   Nghiệm vô tỉ (chỉ ở bài không phân tích được trên số hữu tỉ) ⇒ hoàn thành bình phương rồi dùng căn bậc hai số học lớp 7 ($X^2=k$ với $k>0$ thì $X=\sqrt{k}$ hoặc $X=-\sqrt{k}$), và thêm `**Chưa chắc:**` nếu khung chưa có.
   Hệ có ẩn ở mẫu ⇒ điều kiện xác định, đặt ẩn phụ, giải, trả lại ẩn, đối chiếu điều kiện. Hệ vô nghiệm / vô số nghiệm ⇒ nêu rõ và viết nghiệm tổng quát.
5. **Câu `kho=hgt`** (phần B và Bài 3–4 phần C): theo `hgt\k9.md`. Bài có tam giác **không tách ý**; Phần 2 ghi `a)` `b)` `c)`. Nêu rõ tam giác vuông nào, vuông tại đâu trước khi viết tỉ số lượng giác.
   **Làm tròn:** theo đúng yêu cầu của đề; đề không nêu ⇒ theo mặc định của `hgt\k9.md` và thêm `**Chưa chắc:** đề không nêu cách làm tròn — …`. Tính tiếp bằng giá trị ĐÚNG (không tính tiếp từ số đã làm tròn), chỉ làm tròn ở kết quả cuối của từng đại lượng.
   Bài KHÔNG có dòng `**Hình:**` mà có tam giác / hình thang (B Bài 3, 4, 5, 9, 10 · C Bài 3, 4) ⇒ **vẽ hình cho lời giải bằng code** rồi thêm dòng `**Hình giải:** giai_<B|C><số bài>.png`
   (vd `giai_B3.png`; một tệp / bài, đủ mọi điểm của mọi ý). Cách vẽ: viết `<LV>\tam\ve_p<P>.mjs`, import
   `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
   chạy `node "<LV>/tam/ve_p<P>.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'giai_B3', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu dùng thư viện: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`.
   Hình **dựng đúng dữ kiện bằng toạ độ** (đúng tỉ lệ cạnh, góc vuông, chân đường cao, chân phân giác tính bằng phép tính), đủ mọi điểm, ghi số đo ĐỀ CHO, đánh dấu góc vuông cho trước, **không ghi kết quả phải tìm**;
   canvas cao ≤ 450 px, chừa ≥ 35 px dưới nhãn đáy, nhãn không đè đường. **Vẽ xong mở ảnh bằng Read để kiểm, sai thì sửa.**
6. **Bài lời văn (A Bài 12–22):** mỗi bài MỘT câu. Khuôn: gọi ẩn + đơn vị + điều kiện → biểu diễn các đại lượng theo ẩn → lập phương trình / hệ → giải (trình bày đủ) → đối chiếu điều kiện → trả lời bằng lời đủ MỌI đại lượng đề hỏi.
7. **Bất đẳng thức (C Bài 1, 2):** chứng minh bằng biến đổi tương đương về tổng các bình phương / xét hiệu, mỗi bước một dòng có lí do; nêu khi nào dấu "=" xảy ra (nếu có). Bất đẳng thức kép ⇒ chứng minh từng vế.
8. **Không chắc 100% thì NÓI RA** — dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó (sau đề, trước `**Phần 1. Hướng dẫn**`). CEO xem kĩ đúng những câu này, nên đừng giấu và đừng ghi tràn lan. Ghi khi:
   ảnh mờ không đọc chắc · đề hai cách hiểu · đề in lỗi (chứng minh bằng máy, nêu "nếu sửa thành … thì …") · cần kiến thức ngoài phạm vi mục 4 · làm tròn tự chọn · kết quả "xấu" bất thường so với các ý anh em.
   KHÔNG tự sửa dữ kiện đề để ra số đẹp.
9. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT` (câu nào cần CEO xem + nhận xét chung). Không có gì thì ghi "Không".

## 4. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …`
  → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối** (kể cả ở Chú ý), không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề".
  Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước ⇒ gộp ý ngắn lại.
- Phần 2 = đúng cái học sinh viết vào bài kiểm tra, theo khuôn của dạng (`dai\k9.md` §2 / `hgt\k9.md` §2). Mỗi dòng biến đổi / mỗi câu một đoạn riêng (cách nhau một dòng trống). Kết bằng một câu "Vậy …".
- **Định dạng:** mỗi công thức một cặp `$…$` (không `$$`, không `\(`) · dấu nhân tường minh là **`\cdot`** — **CẤM `\times` và CẤM dấu chấm làm dấu nhân**; số với chữ, chữ với chữ, ngoặc với ngoặc viết liền ·
  chia `:` · phân số `\dfrac` · hệ `$\begin{cases} … \\ … \end{cases}$` (cả hệ trên MỘT dòng) · số thập phân dấu phẩy `2{,}5` · độ `^\circ`, phút `'` (`$67^\circ23'$`) · `\widehat{ABC}`, `\triangle ABC`, `\perp`, `\parallel`,
  `\approx`, `\ge`, `\le` · chữ tiếng Việt trong công thức phải bọc `\text{…}` · đơn vị `$10\ \text{cm}$`, `\text{m}^2`, `\text{km/h}` · số lớn ngoài công thức viết "12 600 000 đồng".
  App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định. Không dùng bảng Markdown.

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/de-cuong/TC-GKI-2026.p<P>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TC-GKI-2026" --khoi 9 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TLN / tự luận) · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật (rút từ đề cương khối 8 và kho khối 9)

- Bẫy đọc ảnh scan: số mũ nhỏ, dấu trừ, dấu ngoặc, phân số — không chắc ⇒ phóng to, đừng đoán.
- Phần 1 lộ đáp số ở dòng Chú ý ("phương trình vô nghiệm", "loại $x=2$") — bị trạm soát bắt lại nhiều lần.
- Dồn 3–4 phép biến đổi vào một dòng nối "suy ra" — mỗi phép một dòng.
- Phương trình chứa ẩn ở mẫu: quên điều kiện xác định / quên đối chiếu ⇒ nhận nghiệm ngoại lai.
- Bất phương trình: nhân / chia hai vế với số ÂM phải đổi chiều và nói rõ.
- Lượng giác: tính tiếp từ số đã làm tròn; viện dẫn `\tan\cdot\cot=1`, `\sin^2+\cos^2=1` mà không ghi căn cứ như `hgt\k9.md` yêu cầu; bài hai kết quả ghi `tra_loi_ngan`.
- Bài tham số ("hệ có nghiệm thoả mãn…"): phải xét điều kiện để hệ có nghiệm duy nhất TRƯỚC, rồi đối chiếu $m$ tìm được với điều kiện (và với mẫu số của điều kiện đề cho).
