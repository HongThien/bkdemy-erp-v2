# ⚠️⚠️ BẢN ÁP DỤNG BATCH B050 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 12 CỦA TRƯỜNG, TẢI TỪ TOANMATH (2 đề, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

**PHẠM VI K12 ĐÈ LÊN MỌI DÒNG K11 BÊN DƯỚI.** Brief gốc bên dưới viết cho ĐỀ CƯƠNG Toán 11 (24/10). Khuôn tệp, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN.
Mọi chỗ nói về kiến thức / luật / cổng của **lớp 11** (k11.md §3, "KNTT lớp 11 tập 1", "CẤM đạo hàm…", `--khoi 11`, `ghep-k11.mjs`) ĐỌC THÀNH **lớp 12** theo mục "Phạm vi K12" dưới đây. Chỉ khác những điểm sau:

- `<MA>` = `B050-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B050\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B050\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`; đề có `tach` thì còn `hd\p-N.png`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B050\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B050/<MA>.soan.md --lam-viec "<LV>" --khoi 12 --chi-kiem`
  ⚠️ **Cổng `--khoi 12` có luật dấu nhân RIÊNG (dòng 43 của `dung-de-tu-soan.mjs`: khối 12 chưa nằm trong danh sách `['8','9','10','11']` ⇒ bị xếp vào nhóm "dấu nhân là dấu chấm như SGK" như khối 6/7 và BÁO LỖI mọi `\cdot`).**
  Luật K12 đã chốt (`de-hoc-ki/brief-giai-chi-tiet.md`, 05/11) là **`\cdot`**. Ở đây VẪN VIẾT `\cdot` (không `\times`, không dấu chấm). Nếu cổng chỉ còn lỗi "dấu nhân phải là dấu chấm" ⇒ coi là ĐẠT về mọi mục khác và ghi số lỗi đó vào báo cáo cuối;
  người điều phối thêm `'12'` vào danh sách ở dòng 43 trước khi ghi (ngoài phạm vi trạm này — KHÔNG sửa cổng).
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Với đề có `tach`, `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Đề không có `tach` ⇒
  `goc.pdf` là nguyên file, hướng dẫn chấm (nếu có) nằm ở `trang\p-<hd>.png`. Bỏ qua trang ma trận / đặc tả / quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra cuối học kì 1 Toán 12 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2024–2025` / `2025–2026`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in ("Câu 1"…, đề đánh số liên tục thì giữ số liên tục; đề đánh lại từ "Câu 1" ở mỗi phần thì giữ vậy). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô (đề K12 hay có đáp số 3–4 chữ số, số thập phân làm tròn, VD `26,6`, `0,53`, `3200`) ⇒ chỉ giữ `loai=tra_loi_ngan` khi đáp số khớp `^-?\d+(,\d+)?$` và ≤ 4 kí tự (không đếm dấu phẩy); còn lại `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
  Đề lệch khuôn 3 phần (vd đề chỉ có "A. Trắc nghiệm 35 câu" + "B. Tự luận", hoặc PHẦN đặt tên lẫn "tự luận" / "trả lời ngắn") ⇒ theo `cau_truc` trong `ds-de.json`, ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Phạm vi K12 (đọc từ `de-hoc-ki/brief-giai-chi-tiet.md`, `de-xuat/brief-chung.md` + `thuc-don.md` — chưa có `kho-rules/dai/k12.md`; Thùy chốt 05/11: "K12 chỉ cần lời giải chi tiết") = CUỐI HỌC KÌ 1 lớp 12 THEO BỘ SÁCH CỦA ĐỀ** (KNTT = Cánh Diều = CTST tập 1, cùng ba chương; `bo_sach_can_cu` nói căn cứ — "suy đoán" nghĩa là đề không ghi):
  - **C1 — Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số** (`chương HS`): tính đơn điệu · cực trị · GTLN–GTNN · đường tiệm cận (đứng, ngang, xiên) · khảo sát & nhận dạng đồ thị hàm bậc ba, phân thức bậc nhất/bậc nhất, bậc hai/bậc nhất · tương giao, tiếp tuyến · bài toán thực tế / tối ưu hoá (chi phí, lợi nhuận, thuốc trong máu, tấm tôn…).
  - **C2 — Vectơ và hệ toạ độ trong không gian** (`chương VT`): vectơ, tổng – hiệu – tích với số, quy tắc hình hộp / tứ diện / lăng trụ · toạ độ vectơ, điểm; biểu thức toạ độ các phép toán · tích vô hướng, góc, độ dài · ứng dụng (lực, hợp lực, vận tốc máy bay / flycam / khinh khí cầu, định vị).
  - **C3 — Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm** (`chương SDT`): khoảng biến thiên · khoảng tứ phân vị · phương sai · độ lệch chuẩn (ghép nhóm); công thức SGK, làm tròn theo yêu cầu đề.
  - **Cộng toàn bộ lớp ≤ 11 — KHÁC K11: ĐƯỢC dùng ĐẠO HÀM** (đạo hàm hàm hợp, quy tắc, bảng biến thiên), mũ–logarit, lượng giác, giới hạn, hình học không gian lớp 11.
  - **Ngoài 3 chương trên** (nguyên hàm – tích phân, phương trình mặt phẳng / đường thẳng / mặt cầu Oxyz, xác suất có điều kiện — thuộc học kì 2): **không bị cấm.** Nếu ĐỀ kiểm tra tới thì giải đúng cái đề hỏi, KHÔNG `**Chưa chắc:**` chỉ vì "chưa học", ghi `**Ghi chú:** đề kiểm tra kiến thức ngoài ba chương học kì 1 (…)`. (Đề B052-09 Trần Cao Vân có nguyên hàm + phương trình mặt phẳng.)
  - **CẤM** (như mọi khối): công cụ ngoài SGK (L'Hôpital, Cauchy–Schwarz / Jensen không chứng minh, định lí Menelaus / Ceva…) — tự chứng minh bằng cái đã học; câu đề tự đòi thứ ngoài SGK mà không có cách trong phạm vi ⇒ giải bằng cái đã học nếu được, không thì `**Chưa chắc:**`.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Lời giải K12 = "CHI TIẾT như học sinh trình bày"** (`brief-giai-chi-tiet.md`): mỗi bước một dòng, công thức trong `$…$` (không `$$`), phân số `\dfrac`, nhân `\cdot`, kết luận "Vậy …" (TN: "Chọn X."); **Phần 2 là bản chính** — viết kĩ như lời giải chi tiết của K12. Cổng của dây chuyền toanmath vẫn đòi khuôn 2 phần (Phần 1 Hướng dẫn 3–6 bước + Phần 2 Trình bày) ⇒ GIỮ khuôn để qua cổng; Phần 1 ngắn, không lộ đáp số.
  Kiểm bằng máy mọi đáp số (script node trong `<LV>\tam\`): đạo hàm số, quét lưới GTLN–GTNN / cực trị, thay phương án TN, tính toạ độ / tích vô hướng, phương sai & độ lệch chuẩn ghép nhóm (đủ chữ số rồi mới làm tròn theo đề).
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC**: giải xong cả đề rồi mới mở trang `hd` (và/hoặc Word `dap_an_word` — Word K12 của batch này là `.doc` nhị phân, `jszip` không đọc; đáp án đã có ở trang `hd` của PDF). Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho (K12 chỉ có `dai` / `hgt` — cổng `--khoi 12` chấp nhận đúng hai giá trị này; đối chiếu `de-hoc-ki/ghi-giai.mjs`, kho K12 hiện có):**
  `kho=hgt` cho MỌI câu **vectơ & toạ độ trong không gian** (vectơ hình hộp / tứ diện / lăng trụ, tích vô hướng, toạ độ điểm – vectơ, lực – hợp lực, vận tốc máy bay, flycam, khinh khí cầu, radar, định vị Oxyz, và nếu có: phương trình mặt phẳng / đường thẳng / mặt cầu Oxyz) và hình học không gian thuần nếu đề có;
  `kho=dai` cho mọi câu còn lại — hàm số (đơn điệu, cực trị, GTLN–GTNN, tiệm cận, đồ thị, thực tế tối ưu), số đặc trưng mẫu ghép nhóm, nguyên hàm – tích phân nếu có. KHÔNG dùng `kho=hinh_hoc`. Câu nhập nhằng ⇒ chọn theo bản chất + `**Ghi chú:**`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình (đề K12 nhiều hình đồ thị, bảng biến thiên, biểu đồ cột, hình hộp: **cắt cả hình đồ thị / bảng biến thiên / biểu đồ vào `**Hình:**`** — ERP chỉ giữ MỘT hình / câu). Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B050` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Luật chung đã chốt: đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit).
- KHÔNG ghi DB, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B050

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B050-01 | THPT Trần Quang Diệu, Quảng Ngãi (Sở GD&ĐT Quảng Ngãi) · mã **149** | KNTT? | 1–4 → `trang\p-1…p-4` (`goc.pdf` chỉ chứa mã 149; file gốc còn mã 317 ở p5–8 — BỎ) | `hd\p-9.png` (bảng đáp án + thang điểm) và `hd\p-10…p-12.png` (lời giải chi tiết các câu Đ/S, TLN, tự luận); Word `.doc` (không đọc được bằng jszip) | Có lớp chữ nhưng vẫn gõ từ ảnh. 12 TN · 4 Đ/S · 2 TLN · tự luận 2 câu (Câu 1 hình lăng trụ đứng $ABC.A'B'C'$ đặt $\vec a,\vec b,\vec c$; Câu 2 bảng khảo sát năng suất ghép nhóm: lập bảng tần số, khoảng tứ phân vị, độ lệch chuẩn). TN câu 12 dùng đạo hàm của vận tốc (gia tốc tức thời). `kho=hgt` cho vectơ/Oxyz, `kho=dai` cho hàm số + số đặc trưng. Bỏ qua p13–14 (ma trận) |
| B050-02 | THPT chuyên Lê Thánh Tông, Quảng Nam (Sở GD&ĐT Quảng Nam) · mã **135** | KNTT? | 1–5 → `trang\p-1…p-5` (nguyên file; trong file chỉ có mã 135) | `trang\p-6…p-8.png` (bảng đáp án TN 4 mã 135/213/359/487 + Đ/S + TLN ở p6; tự luận p7–8); Word `.doc` | **Đánh số câu LIÊN TỤC 1–24**: TN câu 1–16 · Đ/S câu 17–18 · TLN câu 19–22 · tự luận câu 23–24 ⇒ GIỮ nhãn như in; chân trang in nhầm "Trang 1/2 – Mã đề 135" (không quan trọng). Câu 23 tấm tôn hình tam giác đều (tối ưu — xem ảnh), câu 24 căn phòng hình hộp chữ nhật trong hệ Oxyz (giỏ hoa, đèn). Bỏ qua p9 (quảng cáo toanmath) |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

---

# Brief trạm GÕ + GIẢI — (gốc: ĐỀ CƯƠNG Toán 11, 24/10; ĐÃ ĐỔI SANG ĐỀ THI CUỐI KÌ 1 TOÁN 12 — phạm vi K12 ở đầu tệp đè lên mọi dòng K11 dưới đây)

> (Gốc K11: 4 đề cương giữa/học kì I — KHÔNG áp dụng.) Batch này = đề thi cuối học kì 1 Toán 12 của trường; một đề = một tệp; điều phối giao `<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B050\<MA>` (có `goc.pdf`, `trang\p-N.png` 130 dpi, `img\`, `tam\`, `z\`).
> Khác K8/K9: K12 chưa có khung gõ sẵn ⇒ **một trạm vừa GÕ câu từ ảnh vừa GIẢI**, ghi thẳng `kho-rules\dai\lo\toanmath\batch\B050\<MA>.soan.md` (tệp chưa tồn tại — bạn tạo).
> Trạm soát (Opus, `brief-soat.md`) giải mù lại + đối chiếu ảnh. Người làm ≠ người kiểm.

Việc: với **đề được giao** (`<MA>`; trang đề / trang hướng dẫn chấm đã ghi ở "Ghi chú riêng từng đề" đầu tệp), **gõ lại đúng đề** rồi **giải chi tiết** mọi câu. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit.
(Được ghi ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc)

1. **Luật nội dung K12** — KHÔNG có `kho-rules/dai/k12.md`. Đọc: mục "Phạm vi K12" ở đầu tệp này (3 chương học kì 1: ứng dụng đạo hàm · vectơ & toạ độ trong không gian · số đặc trưng mẫu ghép nhóm, + lớp ≤ 11, ĐƯỢC dùng đạo hàm), `Repo\kho-rules\dai\lo\k12-de\de-hoc-ki\brief-giai-chi-tiet.md` (lời giải chi tiết K12: mỗi bước một dòng, `\cdot`, `\dfrac`, "Vậy …"/"Chọn X.", đáp số kiểm bằng máy) và `Repo\kho-rules\dai\lo\k12-de\thuc-don.md` (tên dạng 6 chương K12, chỉ để biết cách gọi). **Không dùng** quy định K11 (cấm đạo hàm, nghiệm PTLG `k\in\mathbb{Z}`, chương 1–2 không giới hạn…).
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **khuôn TỆP** (đặt dòng `### …`, `**Đề:**`, `**Phần 1. Hướng dẫn**`, `**Mấu chốt:**`, `**Bước k.**`, `**Phần 2. Trình bày**`). Chỉ lấy khuôn tệp; kiến thức theo K12 (mục "Phạm vi K12" ở đầu tệp).
3. Mẫu một tệp khúc đã chạy: `Repo\kho-rules\dai\lo\k9\de-cuong\AK-GKI-2026.p1.soan.md` (đọc 2–3 câu đầu để thấy nhịp).

## 2. Nguồn — ĐỌC TỪ ẢNH

- `<LV>\trang\p-1.png …` (130 dpi) là NGUỒN CHÍNH. Mở bằng công cụ Read. Lớp chữ trong PDF thiếu chữ Hy Lạp / ký hiệu ⇒ **không dùng pdftotext để gõ đề**, chỉ đọc ảnh.
  Chỗ không chắc (mũ, dấu, chỉ số, ký hiệu `\alpha\beta\pi`, phân số) ⇒ phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ trên `p-N.png`) rồi Read. Đừng đoán.
- Đề cương KHÔNG có đáp án (trừ khi ảnh in sẵn đáp án — khi đó vẫn tự giải và đối chiếu; lệch ⇒ ghi `**Chưa chắc:**`).
- **Chỉ gõ câu của khúc được giao.** Đúng thứ tự in. Bỏ qua trang bìa / bảng ma trận / phần lý thuyết tóm tắt (chỉ lấy ĐỀ BÀI cần làm). Phần lý thuyết in sẵn trong đề cương (không phải bài tập) KHÔNG đưa vào.
- **Nhãn câu** = nhãn in trên đề ("Câu 7", "Bài 2a", "Câu 3b"…). Nhãn phải **duy nhất trong cùng một PHẦN**; đề in trùng / sai số ⇒ đánh lại theo thứ tự trong PHẦN và ghi `**Ghi chú:**`. Đề nhiều đề minh hoạ (ĐỀ SỐ 1, 2…) ⇒ mỗi đề là một PHẦN riêng (điều phối đã đánh số PHẦN cho bạn).
  Bài tự luận nhiều ý có **dữ kiện chung** (cùng hình, cùng giả thiết) ⇒ GIỮ MỘT câu (a, b, c trong cùng `**Đề:**`). Chỉ tách thành các câu riêng khi mỗi ý có dữ kiện / đề riêng hoàn toàn độc lập (vd "Bài 1. Giải các phương trình: a) … b) …" ⇒ nhãn `Bài 1a`, `Bài 1b`).

## 3. Khuôn TỆP bạn tạo

```
# ĐỀ | <tên đề cương>
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN <n> | <tên phần> | trac_nghiem|dung_sai|tra_loi_ngan|tu_luan
### <nhãn> | kho=dai|hinh_hoc | loai=trac_nghiem|dung_sai|tra_loi_ngan|tu_luan | dap_an=<…>
**Đề:** …
[**Hình:** <tệp trong img/>]  [**Hình giải:** <tệp trong img/>]  [**Ghi chú:** …]  [**Chưa chắc:** …]

**Phần 1. Hướng dẫn**
**Mấu chốt:** …
**Bước 1.** … (3–6 bước)
[**Chú ý:** …]

**Phần 2. Trình bày**
…
```

- `## PHẦN n | …`: dùng ĐÚNG số n, tên, dạng thức điều phối giao (cùng số PHẦN ở nhiều tệp phải khớp tên). Câu thuộc PHẦN có `dang_thuc` nào thì `loai=` giống vậy (PHẦN TN ⇒ câu TN…). Đề cương ghi phần Đ/S, TLN, TL thì mỗi phần một PHẦN.
- **Trắc nghiệm** (`loai=trac_nghiem`, `dap_an=A|B|C|D`): dòng `**Đề:**` là đề, rồi 4 dòng `A. ` `B. ` `C. ` `D. ` (mỗi phương án một dòng, KHÔNG gộp hai phương án một dòng). Dòng cuối Phần 2 đúng chữ `Chọn X.`
  Câu đề có phương án dài / hình ảnh ⇒ vẫn đủ 4 dòng A–D (hình đề khai bằng `**Hình:**`).
- **Đúng/Sai** (`loai=dung_sai`, `dap_an=DSSD` — 4 chữ D/S theo thứ tự a b c d): `**Đề:**` là dữ kiện chung; rồi đúng 4 dòng `a) …` `b) …` `c) …` `d) …` (mỗi ý một dòng, được dài; tiếp dòng tiếp theo nếu cần, KHÔNG bắt đầu dòng bằng `a)` trừ khi là ý). Phần 2 xét từng ý: "Ý a) … Đúng/Sai vì …".
  Đề chỉ có 2–3 ý ⇒ ghi `**Chưa chắc:**` nói rõ (cổng cần đủ 4).
- **Trả lời ngắn** (`loai=tra_loi_ngan`, `dap_an=<số>`): CHỈ khi đáp số là MỘT số nguyên / thập phân tô được trên 4 ô (chữ số, dấu `-` đầu, dấu `,`; ≤ 4 kí tự: `13`, `-1`, `2,5`). Không thì `loai=tu_luan`, `dap_an=—`. Đáp án TLN chỉ ghi số.
- **Tự luận**: `loai=tu_luan`, `dap_an=—`. Dòng `### …` luôn đủ 4 mục `| kho=… | loai=… | dap_an=…`.
- `kho=dai` cho Đại số & Giải tích (LG, dãy số, giới hạn, số đặc trưng…). `kho=hinh_hoc` cho câu **quan hệ song song / hình học không gian** (giao tuyến, thiết diện, đường thẳng // mặt phẳng, hai mặt phẳng song song, phép chiếu song song, hình chóp / lăng trụ).
  Nhập nhằng (vd tọa độ?) ⇒ chọn theo bản chất, nói ở `**Ghi chú:**`.

## 4. Hình

- **Hình đề** (đề in sẵn hình): cắt từ trang PDF bằng `pdftoppm -r 200 -png -singlefile -f <trang> -l <trang> -x … -y … -W … -H … "<LV>/goc.pdf" "<LV>/img/de_<PHẦN><NHÃN>"` (vd `de_P1C1.png`; chỉ chữ + số, không dấu cách / dấu Việt), chừa biên trắng nhỏ, **Read kiểm** hình đúng và đủ nhãn điểm. Khai `**Hình:** de_P1C1.png`. Chỉ khai MỘT hình / câu (ERP chỉ giữ hình đầu — đề có 2 hình ⇒ cắt chung vào MỘT ảnh).
  Hình là một biểu đồ / đồ thị / bảng số liệu có ý nghĩa với đề ⇒ phải cắt; không chắc thì cắt.
- **Hình giải** (câu `kho=hinh_hoc` TỰ LUẬN mà lời giải cần hình — giao tuyến, thiết diện, chứng minh song song; **không bắt buộc cho câu TN / Đ/S khái niệm ngắn**): vẽ BẰNG CODE, khai `**Hình giải:** giai_<PHẦN><NHÃN>.png`.
  Cách vẽ: viết `<LV>\tam\ve.mjs` (tạo bằng công cụ Write, KHÔNG heredoc), import
  `import { P, seg, segDash, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`, chạy `node "<LV>/tam/ve.mjs"` với thư mục hiện hành là Repo;
  mỗi hình `await luu('<LV>/img', 'giai_P4C3', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu dùng thư viện: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`.
  Hình không gian dùng **phép chiếu xiên**: đặt toạ độ 3D `(x,y,z)` rồi `P(sx, sy)` với `sx = x + 0.5·y·cos30°`, `sy = −z − 0.5·y·sin30°` (hoặc tương tự), nét **khuất** bằng `segDash`, nét thấy bằng `seg`; vẽ đủ mọi điểm có tên trong lời giải (giao điểm, trung điểm…) bằng PHÉP TÍNH toạ độ (không vẽ tay). Giao tuyến / thiết diện tô nét đậm hoặc đỏ.
  Canvas cao ≤ 450 px, nhãn không đè đường, chừa ≥ 35 px dưới nhãn đáy. **Vẽ xong mở ảnh bằng Read để kiểm** (nét khuất đúng, đủ điểm); sai thì sửa. Một ảnh / câu.
- Đề tự luận hình không gian KHÔNG có hình đề (HS tự vẽ) ⇒ không đặt `**Hình:**`, chỉ `**Hình giải:**`.

## 5. Việc phải làm cho mỗi câu

1. **Gõ đề đúng ảnh** (LaTeX `$…$`): chữ, số, dấu, chỉ số, số mũ, đơn vị. Đề dùng độ `90^0` ⇒ viết `$90^\circ$`; `\alpha` v.v. viết đúng lệnh. Công thức một cặp `$…$` (không `$$`, không `\(`).
2. **Giải bằng lập luận + THỬ LẠI BẰNG MÁY** — viết script node trong `<LV>\tam\` (tạo bằng Write, KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): trắc nghiệm ⇒ thay từng phương án / quét lưới x, k; PTLG ⇒ thay nghiệm vào đề cho nhiều giá trị `k`, quét lưới tìm nghiệm sót trên miền đề cho;
   min–max ⇒ quét ≥ 20000 giá trị; dãy số ⇒ tính 20 số hạng đầu; giới hạn ⇒ tính giá trị với n / x lớn; hình KG ⇒ dựng toạ độ số kiểm song song / giao điểm / thiết diện. Đừng nhẩm; **đừng tin đáp án in sẵn** — đối chiếu.
3. Điền `loai=` và `dap_an=` ở dòng `###`; viết lời giải 2 phần theo khuôn §6 ngay sau các dòng `**Đề:**` / phương án / `**Hình:**` / `**Hình giải:**` / `**Ghi chú:**` / `**Chưa chắc:**`.
4. **Đề SAI / thiếu dữ kiện nhưng giải được (Thùy 24/10):** GIẢI BÌNH THƯỜNG theo số liệu đề cho (hoặc theo cách hiểu hợp lí nhất), ghi rõ **"đề sai"** ở dòng `**Ghi chú:**` và một dòng "Lưu ý: …" ở đầu Phần 2. Chỉ sửa chữ đề khi lỗi in hiển nhiên có đáp án rõ (vd phương án in sai đơn vị) + Ghi chú.
   Đề nhập nhằng cho hai đáp số khác nhau mà không chọn được ⇒ mới dùng `**Chưa chắc:**` (nêu cả hai). `**Chưa chắc:**` còn dùng khi ảnh mờ không đọc chắc. Không ghi tràn lan; không tự sửa dữ kiện để ra số đẹp.
   Đề tự có đáp số in sẵn và tự giải ra khác ⇒ GIỮ lời giải của mình, ghi `**Ghi chú:** đề cương in đáp số … lệch kết quả tính (…)` rồi nói lý do.
5. Câu **trùng nguyên văn** nhau trong đề cương: vẫn giữ nguyên số câu, giải bình thường (máy gom khi ghi).
6. Cuối tệp thêm `## GHI CHÚ CHO NGƯỜI DUYỆT` (câu cần CEO xem + nhận xét chung). Không có gì thì ghi "Không".

## 6. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …` → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối** (kể cả ở Chú ý), không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước ⇒ gộp ý ngắn lại.
- Phần 2 = đúng cái học sinh viết vào bài kiểm tra. Mỗi dòng biến đổi / mỗi câu một đoạn riêng (cách nhau một dòng trống). Kết bằng một câu "Vậy …" (trắc nghiệm: "Chọn X." là dòng cuối cùng).
  Dấu $\Leftrightarrow$ được dùng cho biến đổi tương đương PTLG / ĐKXĐ — **mỗi dòng một bước**, không nối quá 2 phép.
- **Định dạng:** mỗi công thức một cặp `$…$` · dấu nhân tường minh là **`\cdot`** — **CẤM `\times` và CẤM dấu chấm làm dấu nhân** (cả `2.3`, `a.b`; số thập phân dùng `2{,}5`) · phân số `\dfrac` · hệ `$\begin{cases} … \\ … \end{cases}$` (cả hệ MỘT dòng) · độ `^\circ` · `\widehat{ABC}`, `\triangle ABC`, `\perp`, `\parallel`, `\approx`, `\ge`, `\le` ·
  chữ tiếng Việt trong công thức bọc `\text{…}` · số lớn ngoài công thức viết "12 600 000 đồng" · chỉ dùng `**đậm**` cho các nhãn quy định (không `*nghiêng*`, không bảng Markdown, không emoji).
- Quy ước trình bày PTLG: nghiệm viết đủ `k\in\mathbb{Z}`, đơn vị radian (đổi độ → rad rõ ràng); nghiệm trên khoảng / đoạn: giải bất phương trình theo `k` rồi liệt kê / đếm `k` nguyên.
  Hình KG: khẳng định song song / giao tuyến phải nêu căn cứ (định lí giao tuyến, đường trung bình, tính chất…), không "nhìn hình thấy".

## 7. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B050/<MA>.soan.md --lam-viec "<LV>" --khoi 12 --chi-kiem
# (KHÔNG chạy ghep-k11.mjs — một đề một tệp)
```

(Cổng này đòi mọi `## PHẦN` có câu — tệp của bạn đã có đủ tiêu đề PHẦN riêng. Nhắc lại: lỗi "dấu nhân phải là dấu chấm" của cổng `--khoi 12` là lỗi LUẬT CỔNG chưa cập nhật cho K12, không phải lỗi của bạn — xem đầu tệp.)

## 8. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TN / Đ/S / TLN / tự luận) · các câu có `Chưa chắc` hoặc "đề sai" (nhãn + một câu lí do) · hình đề cắt / hình giải vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 9. Bẫy đã cắn thật (rút từ đề cương K8/K9)

- Bẫy đọc ảnh: số mũ nhỏ, dấu trừ, dấu ngoặc, phân số, chỉ số dưới, `\pi` — không chắc ⇒ phóng to.
- Phần 1 lộ đáp số ở dòng Chú ý ("phương trình vô nghiệm", "loại $x=2$") — trạm soát bắt lại nhiều lần.
- Dồn 3–4 phép biến đổi vào một dòng nối "suy ra" — mỗi phép một dòng.
- PTLG: quên ĐKXĐ của `\tan`, `\cot`, mẫu số; quên họ nghiệm thứ hai; gộp / rút họ nghiệm sai; đổi độ ↔ rad quên `k`; đếm nghiệm trên đoạn sót biên.
- Min–max hàm LG: đặt `t=\sin x` rồi quên `t\in[-1;1]`; bậc hai theo `t` xét đỉnh parabol không đối chiếu đoạn.
- Dãy số / CSC / CSN: nhầm `u_1` với `u_0`; công thức tổng `S_n` dùng sai biến.
- Hình KG: nhầm giao tuyến với đường thẳng cắt; thiết diện thiếu một cạnh; "đường thẳng // mặt phẳng" không nêu đường thẳng nằm trong mặt phẳng song song với nó.
- Trắc nghiệm "mệnh đề đúng / sai": xét ĐỦ 4 phương án rồi mới kết luận, không dừng ở phương án đầu thấy đúng.

## 10. Bẫy riêng K12 (đề xuất từ đề CKI đã đọc 14/11 — thêm vào §9)

- Đồ thị / bảng biến thiên / bảng xét dấu $f'(x)$: đọc ẢNH kĩ (khoảng đồng biến, điểm cực trị, tiệm cận chấm đứt); câu "đồ thị hàm $f'$" ≠ đồ thị hàm $f$ — xác định đúng hàm trước khi kết luận.
- Tiệm cận: xét ĐỦ ngang · đứng · xiên; phân thức bậc 2/1 chia đa thức để tìm tiệm cận xiên; kiểm điều kiện mẫu số khác 0 và nghiệm trùng tử số.
- GTLN–GTNN trên đoạn: so cả hai đầu mút với các điểm tới hạn thuộc đoạn; bài thực tế (chi phí, lợi nhuận, nồng độ thuốc, tấm tôn / tấm nhôm gập hộp) ghi RÕ miền xác định của biến.
- Số đặc trưng ghép nhóm: nhóm đầu / cuối có khoảng không đều; tứ phân vị dùng đúng công thức SGK (nhóm chứa $Q_k$, cỡ mẫu $n$); phương sai & độ lệch chuẩn tính trên giá trị đại diện, làm tròn CUỐI CÙNG theo yêu cầu đề.
- Vectơ – Oxyz: quy tắc hình hộp / tứ diện / trọng tâm; tích vô hướng và góc giữa hai vectơ (cos có thể âm); hình bình hành $ABCD$ ⇒ $\overrightarrow{AB}=\overrightarrow{DC}$ (đúng thứ tự đỉnh); bài flycam / khinh khí cầu / máy bay: đổi đơn vị (km ↔ m, phút ↔ giờ) trước khi tính vận tốc.
- Đ/S nhiều ý a–d: xét từng ý độc lập, đừng suy ý sau từ ý trước khi đề không nói; kết quả D/S ghi đúng thứ tự a b c d.
- TLN: đáp số làm tròn — giữ đủ chữ số khi tính trung gian; số phải tô được 4 ô (≤ 4 kí tự không kể dấu phẩy), nếu không thì `loai=tu_luan` + Ghi chú.
