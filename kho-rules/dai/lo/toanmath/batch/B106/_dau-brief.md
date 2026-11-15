# ⚠️⚠️ BẢN ÁP DỤNG BATCH B106 — ĐỀ GIỮA HỌC KÌ 2 TOÁN 12 CỦA TRƯỜNG, TẢI TỪ TOANMATH (2 đề, 15/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

**PHẠM VI K12 ĐÈ LÊN MỌI DÒNG K11 BÊN DƯỚI.** Brief gốc bên dưới viết cho ĐỀ CƯƠNG Toán 11 (24/10). Khuôn tệp, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN.
Mọi chỗ nói về kiến thức / luật / cổng của **lớp 11** (k11.md §3, "KNTT lớp 11 tập 1", "CẤM đạo hàm…", `--khoi 11`, `ghep-k11.mjs`) ĐỌC THÀNH **lớp 12** theo mục "Phạm vi K12" dưới đây. Chỉ khác những điểm sau:

- `<MA>` = `B106-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B106\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- **B106 là batch "Word" nhưng cả hai bài đều có PDF toanmath cùng đề ⇒ ĐÃ DÙNG PDF** (`goc.pdf` cắt từ PDF). KHÔNG đọc Word đề (lỗi công thức). Word chỉ là nhân chứng đáp án (`dap_an_word`).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B106\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `hd\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B106\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B106/<MA>.soan.md --lam-viec "<LV>" --khoi 12 --chi-kiem`
  (Cổng `--khoi 12` đã nhận dấu nhân `\cdot` từ 14/11 — viết `\cdot`, không `\times`, không dấu chấm. Tên hình `S.ABCD` viết bình thường.)
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Cả hai đề B106 đều có `tach`: `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Bỏ qua trang ma trận / đặc tả / quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra giữa học kì 2 Toán 12 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2025–2026`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in (Phần II/III/IV đánh lại từ "Câu 1"). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô (đề K12 hay có đáp số làm tròn, VD `15,7`, `1720`) ⇒ chỉ giữ `loai=tra_loi_ngan` khi đáp số khớp `^-?\d+(,\d+)?$` và ≤ 4 kí tự (không đếm dấu phẩy); còn lại `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
  Câu tự luận có ý a), b) (VD Núi Thành Câu 1 a/b, Câu 2 a/b) ⇒ giữ MỘT câu, đề ghi đủ các ý, lời giải giải lần lượt từng ý.
- **Phạm vi K12 = GIỮA HỌC KÌ 2 lớp 12 THEO BỘ SÁCH CỦA ĐỀ** (đề không ghi bộ sách ⇒ `bo_sach: KNTT`, "suy đoán" ở `bo_sach_can_cu`):
  - **Cả 3 chương học kì 1** (như B052): C1 Ứng dụng đạo hàm khảo sát hàm số · C2 Vectơ và hệ toạ độ trong không gian · C3 Số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm.
  - **+ Chương IV Nguyên hàm – Tích phân:** nguyên hàm, tính chất, nguyên hàm các hàm sơ cấp (luỹ thừa, $\dfrac1x$, mũ, lượng giác, $\dfrac{1}{\cos^2x}$, $\dfrac{1}{\sin^2x}$); tích phân, tính chất;
    ứng dụng: diện tích hình phẳng, thể tích vật thể (theo $S(x)$) / khối tròn xoay, bài toán chuyển động (vận tốc → quãng đường), chi phí biên / thực tế.
  - **+ Chương V Phương pháp toạ độ trong không gian:** phương trình mặt phẳng, đường thẳng, mặt cầu; vị trí tương đối, góc, khoảng cách theo công thức SGK — **tới đâu thì THEO ĐỀ**.
    **Đề kiểm tra tới đâu (đọc ma trận / nội dung):**
    - **B106-01 Núi Thành:** CHỈ Chương IV (nguyên hàm · tích phân · diện tích · thể tích · chi phí biên). Không có câu Oxyz.
    - **B106-02 Bình Dương (Gia Lai):** Chương IV + **Chương V chỉ bài Phương trình mặt phẳng** (ma trận p11: "Nguyên hàm. Bảng nguyên hàm của một số hàm số sơ cấp (5 tiết)" · "Tích phân. Ứng dụng hình học của tích phân (8 tiết)" · "Phương trình mặt phẳng (6 tiết)"): phương trình tổng quát, vectơ pháp tuyến, điểm thuộc mặt phẳng, mặt phẳng song song, khoảng cách điểm – mặt phẳng.
  - **Cộng toàn bộ lớp ≤ 11** (đạo hàm, mũ–logarit, lượng giác, giới hạn, hình học không gian lớp 11, hình phẳng, parabol / elip lớp 10).
  - **Công cụ:** dùng đúng công cụ của SGK bộ sách đề.
    - Vectơ pháp tuyến từ hai vectơ chỉ phương: nếu hướng dẫn chấm của chính đề dùng tích có hướng thì được dùng; không có nhân chứng ⇒ tìm bằng hệ phương trình (như B052-09).
    - **Nguyên hàm từng phần / đổi biến:** KNTT 12 KHÔNG dạy từng phần / đổi biến tổng quát ⇒ KHÔNG dùng. Đề đòi mà SGK không có ⇒ giải bằng cách SGK cho phép nếu được
      (VD $\int_0^5\sqrt{25-x^2}\,dx$ = diện tích một phần tư hình tròn bán kính 5 — dùng **ý nghĩa hình học của tích phân**, không đổi biến lượng giác; $\int\sqrt{e^x}\,dx=\int e^{x/2}\,dx$ — nguyên hàm $e^{ax}$ theo bảng),
      không thì `**Chưa chắc:**`.
    - Thể tích chỏm cầu / khối cầu: tính bằng tích phân khối tròn xoay ($V=\pi\int (R^2-x^2)\,dx$) hoặc công thức khối cầu đã học — KHÔNG dùng công thức chỏm cầu ngoài SGK nếu không chứng minh.
    - Bài parabol thực tế (cổng, khu vui chơi): tự đặt hệ trục, viết parabol từ dữ kiện, ghi rõ hệ trục trong lời giải.
  - **Câu tích phân / diện tích / thể tích: thử máy bằng tích phân số** (script node, Simpson, trong `<LV>\tam\`) cho MỌI đáp số; nguyên hàm thử bằng đạo hàm số tại vài điểm; toạ độ / khoảng cách tính lại bằng máy.
  - **CẤM** (như mọi khối): công cụ ngoài SGK (L'Hôpital, Cauchy–Schwarz / Jensen không chứng minh…) — tự chứng minh bằng cái đã học; câu đề tự đòi thứ ngoài SGK mà không có cách trong phạm vi ⇒ `**Chưa chắc:**`.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Lời giải K12 = "CHI TIẾT như học sinh trình bày"** (`k12-de/de-hoc-ki/brief-giai-chi-tiet.md`): mỗi bước một dòng, công thức trong `$…$` (không `$$`), phân số `\dfrac`, nhân `\cdot`, kết luận "Vậy …" (TN: "Chọn X."); **Phần 2 là bản chính**. Cổng vẫn đòi khuôn 2 phần (Phần 1 Hướng dẫn 3–6 bước + Phần 2 Trình bày) ⇒ GIỮ khuôn; Phần 1 ngắn, không lộ đáp số.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC**: giải xong cả đề rồi mới mở `<LV>\hd\` (và/hoặc Word `dap_an_word` — `.docx` đọc bằng node + `jszip`, đường dẫn có dấu nên không dùng poppler; `.doc` nhị phân thì không đọc được, dùng trang `hd`).
  Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho (cổng `--khoi 12` chỉ nhận `dai` / `hgt`):**
  `kho=hgt` cho MỌI câu **toạ độ Oxyz / vectơ không gian** (phương trình mặt phẳng, vectơ pháp tuyến, điểm thuộc mặt phẳng, khoảng cách điểm – mặt phẳng, mặt phẳng song song…);
  `kho=dai` cho mọi câu còn lại — nguyên hàm, tích phân, diện tích, thể tích, chuyển động, chi phí biên, parabol thực tế, hàm số, số đặc trưng.
  Hình không gian thuần (không toạ độ) theo đầu đè thuộc `hinh_hoc`, nhưng cổng `--khoi 12` KHÔNG nhận `hinh_hoc` ⇒ nếu gặp thì để `kho=hgt` + `**Ghi chú:** hình không gian thuần — đầu đè xếp hinh_hoc, cổng K12 chưa nhận` (B106 không có câu loại này). Câu nhập nhằng ⇒ chọn theo bản chất + `**Ghi chú:**`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình (đồ thị $y=f(x)$, hình phẳng tô đậm, đồ lưu niệm chỏm cầu + trụ, khu vui chơi parabol: **cắt vào `**Hình:**`** — ERP chỉ giữ MỘT hình / câu; ảnh chụp + hình vẽ cạnh nhau thì cắt HÌNH VẼ). Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B106` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Luật chung đã chốt: đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị / giả thiết;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG phương án nào đúng ⇒ giữ nguyên văn, đề sai, `**Chưa chắc:**` (không "chọn gần nhất");
  KHÔNG ghi LaTeX (`\text`, `\frac`, `\notin`, `\neq`…) qua chuỗi JS (dùng Write/Edit).
- KHÔNG ghi DB, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B106

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B106-01 | THPT Núi Thành, Đà Nẵng (Sở GD&ĐT TP Đà Nẵng) · mã **1001** · 2025–2026 | KNTT? | 1–4 → `trang\p-1…p-4` (`goc.pdf` chỉ chứa mã 1001; file gốc còn mã 1002 ở p5–8 — BỎ) | `hd\p-9.png` (bảng đáp án TN · Đ/S · TLN 8 mã, **cột 1001**) + `hd\p-10.png`, `hd\p-11.png` (đáp án tự luận, cột "mã đề 1001, 1003, 1005, 1007" bên PHẢI); Word `dap_an_word` | **⚠️ PDF tô ĐỎ phương án đúng ở Phần I** (ảnh trang 1–2) = đáp án của trường lộ sẵn ⇒ vẫn TỰ GIẢI, coi chữ đỏ là nhân chứng như `hd`; gõ đề KHÔNG đánh dấu phương án nào. 12 TN · 2 Đ/S · 4 TLN (câu 2 đồ thị $f$ trên $[0;5]$ + $\int_0^5\sqrt{25-x^2}\,dx$ — ý nghĩa hình học; câu 3 $y=\dfrac{2}{\cos x}$ quay quanh $Ox$; câu 4 đồ lưu niệm chỏm cầu + trụ, làm tròn hàng đơn vị — ảnh chụp + hình vẽ, cắt hình vẽ) · tự luận 3 câu (Câu 1 a/b nguyên hàm – tích phân $\int_{-3}^{-1}\dfrac2x\,dx$; Câu 2 a/b chi phí biên chiếu cói, lợi nhuận tối đa — dùng đạo hàm; Câu 3 diện tích giới hạn bởi $y=2x^2$, $y=\dfrac2x$, $x=4$, trục hoành). Chỉ Chương IV |
| B106-02 | THPT Bình Dương, Gia Lai · mã **101** · 2025–2026 | KNTT? | 1–3 → `trang\p-1…p-3` (`goc.pdf` chỉ chứa mã 101; file gốc còn mã 102 ở p4–6 — BỎ) | `hd\p-7.png` (đáp án TN · Đ/S · TLN mã 101 ở NỬA TRÊN) … `hd\p-10.png` (hướng dẫn chấm tự luận); Word `.doc` nhị phân (không đọc) | 12 TN · 2 Đ/S · 4 TLN · tự luận 4 câu (1 + 1 + 0,5 + 0,5 đ). **Đ/S Câu 1 lỗi dàn trang:** dòng "$2x-y+2z-9=0$" in lệch lên TRÊN ý a) — đó là phần cuối của ý a) ("…có phương trình tổng quát là $2x-y+2z-9=0$") ⇒ gõ ghép vào ý a) + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT` (lỗi in hiển nhiên). TLN câu 4 $y=\sqrt{e^x}$ quay quanh $Ox$ từ $\ln2$ đến $\ln7$, làm tròn hàng phần mười. Tự luận Câu 3 chi phí trung bình $c(t)$ trên $[0;12]$ (giá trị trung bình = $\dfrac{1}{12}\int_0^{12}c(t)\,dt$ — nếu SGK bộ sách không có khái niệm này thì giải theo cách đề hiểu + `**Ghi chú:**`); Câu 4 khu vui chơi 2 phần parabol (đặt hệ trục). Bỏ qua p11–14 (ma trận, đặc tả) |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu tích phân / cận).
