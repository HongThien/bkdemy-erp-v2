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

---

# Brief trạm SOÁT — ĐỀ CƯƠNG Toán 11 (24/10)

> Cặp với `brief-soan.md` (cùng thư mục). `<MA>` = `VD-GKI-2026` · `HVT-GKI-2026` · `YH-HKI-2026` · `TP-GKI-2026`; `<P>` = số tệp khúc; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B106\<MA>`; Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Trạm soạn đã VỪA GÕ đề từ ảnh VỪA giải ⇒ soát phải kiểm CẢ HAI.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT khúc của đề cương Toán 11 đã được trạm khác gõ + soạn lời giải. Đề cương KHÔNG có đáp án, nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả.
Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi khúc của bạn.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc brief trạm soạn `Repo\kho-rules\dai\lo\k11\de-cuong\brief-soan.md` (nguồn ảnh, khuôn tệp, hình, khuôn lời giải) và luật nội dung `Repo\kho-rules\dai\k11.md` §3 (phạm vi kiến thức + điều cấm).
2. Mở ảnh các trang của khúc bạn (điều phối nói: trang nào) `<LV>\trang\p-N.png` bằng công cụ Read; chỗ không chắc phóng to bằng `pdftoppm` như brief soạn §2. **Chưa mở** tệp `kho-rules\dai\lo\toanmath\batch\B106\<MA>.soan.md`.
3. Lấy danh sách nhãn câu của tệp (CHỈ lệnh này, chạy từ Repo — nó in tiêu đề PHẦN, loại câu, và các dòng Ghi chú / Chưa chắc, KHÔNG in đề / lời giải):
   `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/toanmath/batch/B106/<MA>.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ').slice(0,3).join(' | '):l).join('\n'))"`
4. Tự giải mọi câu có nhãn trong danh sách (đọc đề từ ẢNH). Tính bằng script node trong `<LV>\tam\` (Write tool; không heredoc, không `node -e` chứa `\` hay dấu huyền): trắc nghiệm thay từng phương án / quét lưới; PTLG thay nghiệm cho nhiều `k` + quét lưới tìm nghiệm sót;
   min–max quét ≥ 20000 giá trị; dãy số tính 20 số hạng đầu; giới hạn tính giá trị với n / x lớn; hình KG dựng toạ độ số kiểm song song / giao điểm / thiết diện. Không nhẩm.
5. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B106\<MA>.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

6. Mở `kho-rules\dai\lo\toanmath\batch\B106\<MA>.soan.md`, soát TỪNG câu:
   - **Đề gõ** đúng ảnh chưa: đủ câu (không bỏ / không thừa), số, số mũ, chỉ số, dấu, `\alpha\beta\pi`, phân số, ngoặc, tên điểm, đủ ý a) b) c) d), 4 phương án A–D đúng chữ. Lệch ⇒ sửa theo ẢNH.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng. Đề in sẵn đáp số mà khác kết quả ⇒ có dòng Ghi chú của trạm soạn chưa.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (k11.md §3: không đạo hàm, không công thức chưa học, chương 1–2 không giới hạn…, kể cả dùng NGẦM) · ĐKXĐ + đối chiếu · PTLG đủ họ nghiệm, `k\in\mathbb{Z}`, rad / độ nhất quán, nghiệm trên đoạn đếm đủ biên ·
     Phần 2 đúng khuôn vở, mỗi phép biến đổi một dòng, kết bằng "Vậy …" · dấu nhân `\cdot` (không `\times`, không dấu chấm) · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Trắc nghiệm: xét ĐỦ 4 phương án; dòng cuối `Chọn X.` khớp `dap_an`. Đ/S: 4 ý, `dap_an` 4 chữ D/S khớp lời giải từng ý.
     Hình KG: căn cứ (giao tuyến, đường trung bình, định lí song song…) nêu rõ, không "nhìn hình".
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự (`^-?\d+(,\d+)?$`); còn lại `tu_luan` (`dap_an=—`). `kho=hinh_hoc` đúng cho câu hình không gian, `kho=dai` còn lại. Không tách / gộp / đổi nhãn câu.
   - **Hình**: mở từng tệp `<LV>\img\…` ứng với `**Hình:**` (hình đề — đúng câu, cắt đủ, rõ nhãn) và `**Hình giải:**` (vẽ bằng code — đúng dữ kiện, nét khuất đúng, đủ điểm của lời giải, nhãn không đè / cụt). Sai ⇒ sửa script `<LV>\tam\ve.mjs` rồi vẽ lại (`node` từ Repo) hoặc cắt lại hình đề.
     Câu hình KG TỰ LUẬN mà lời giải cần hình mà thiếu `**Hình giải:**` ⇒ bạn vẽ thêm.
   - **Đề sai (Thùy 24/10):** giải bình thường + ghi "đề sai" ở Ghi chú + dòng "Lưu ý" đầu Phần 2; chỉ `Chưa chắc` khi hai cách hiểu cho hai đáp số khác nhau không phân xử được. Đừng ghi tràn lan; dòng `Chưa chắc` của trạm soạn mà bạn kiểm chắc ⇒ xoá, ghi vào biên bản.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
8. Chạy cổng tới khi "✔ đạt cổng" (từ Repo): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B106/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B106\<MA>.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` hoặc "đề sai" (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · các câu `Chưa chắc` / đề sai.
