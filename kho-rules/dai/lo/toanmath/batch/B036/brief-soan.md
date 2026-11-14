# ⚠️⚠️ BẢN ÁP DỤNG BATCH B036 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 11 CỦA TRƯỜNG, TẢI TỪ TOANMATH (K11 đề cương cuối kì 1/5, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 11 (24/10, kèm `brief-cki.md` 28/10), đã đổi sẵn đường dẫn. Luật kiến thức K11, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B036-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B036\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (+ `bo_sach_can_cu`), `cau_truc` (ước số câu / đề), `de` / `hd` (trang ĐỀ / trang ĐÁP ÁN **trong file PDF gốc**).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B036\<MA>` (đã có `goc.pdf` = NGUYÊN file PDF, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`). Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ CƯƠNG = MỘT TỆP** (đề cương dài hay nhiều đề vẫn một tệp — KHÔNG chia khúc `.p<P>`): tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B036\<MA>.soan.md`. Bạn soạn CẢ đề cương, làm hết, không bỏ dở. **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới và **BỎ mục "Đánh số PHẦN (chia khúc)" của `brief-cki.md`**. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B036/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
- **Đầu tệp (đề cương — thay khuôn §3 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 11 năm <năm học> — <don_vi>
  nam: <nam>
  bo_sach: <KNTT | Cánh Diều | CTST — theo ds-de.json, sửa nếu ảnh cho thấy khác>
  kieu: de_cuong
  ```
  Năm học viết `2024–2025` / `2025–2026` / `2026–2027` đúng như trang bìa trên ảnh; lệch `ds-de.json` thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo đúng cách đề cương chia, đánh số 1, 2, 3… LIÊN TỤC trong tệp:** đề cương gồm nhiều đề (ĐỀ SỐ 1–5, ĐỀ ÔN TẬP…) ⇒ mỗi đề × mỗi mục in (Phần I TN · Phần II Đ/S · Phần III TLN · Phần IV tự luận) là MỘT `## PHẦN n | Đề số k — Phần I Trắc nghiệm | trac_nghiem` (tên PHẦN ghi như đề in, kèm tiền tố đề / chương); đề cương chia theo chương ⇒ tiền tố chương. Nhãn câu giữ như in, **duy nhất trong PHẦN**. Đ/S đủ 4 ý a–d. Phần LÝ THUYẾT, ma trận, bản đặc tả, bìa, quảng cáo "Xem thêm … toanmath.com" KHÔNG đưa vào.
  Đề in "Phần 1 TNKQ gồm cả Đ/S" (vd đề số 4 Linh Trung) ⇒ tách theo dạng thức thật của từng câu, ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 11 THEO BỘ SÁCH CỦA ĐỀ CƯƠNG** (K11 theo `kho-rules/dai/lo/k11/de-cuong/brief-soan.md` §1 + `brief-cki.md`):
  - **KNTT:** C1 Hàm số LG & PTLG · C2 Dãy số, CSC, CSN · C3 Số đặc trưng mẫu ghép nhóm · C4 Quan hệ song song trong không gian · C5 Giới hạn, hàm số liên tục + toàn bộ lớp ≤ 10.
  - **Cánh Diều:** Ch I Hàm số LG & PTLG · Ch II Dãy số, CSC, CSN · Ch III Giới hạn, hàm số liên tục · Ch IV Quan hệ song song (cả lăng trụ, hình hộp, phép chiếu song song) — cùng chủ đề KNTT, thứ tự khác; thống kê mẫu ghép nhóm của Cánh Diều nằm học kì 2.
  - **CTST:** Ch1 LG · Ch2 Dãy số · Ch3 Giới hạn · Ch4 Quan hệ song song · Ch5 Mẫu ghép nhóm — cùng phạm vi KNTT.
  - `bo_sach` trong `ds-de.json` phần lớn là **suy đoán** (đề cương ít khi ghi) — đọc nội dung / thứ tự chương trên ảnh rồi chốt; `bo_sach: không rõ` (Linh Trung) ⇒ tự chốt theo nội dung và ghi căn cứ vào `## GHI CHÚ CHO NGƯỜI DUYỆT`. Đề cương chỉ gồm vài chương (vd Xuân Đỉnh: Chương 4–5) ⇒ giải đúng phạm vi đó.
  - **CẤM** như brief gốc: đạo hàm · mũ–logarit · xác suất lớp 11 · quan hệ vuông góc · L'Hôpital · định lí ngoài SGK (Menelaus, Ceva… — tự chứng minh bằng Thales / đường trung bình / tính chất song song). **Câu khái niệm đạo hàm (học kì II) ⇒ BỎ câu + nêu nhãn trong báo cáo** (B036-01, B037-08 đã biết có). Câu khác đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì BỎ + báo.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC:** đề cương chỉ có đáp án ở những mục có cột "Đáp án" trong bảng dưới (không có Word đáp án). Giải xong cả đề cương rồi mới mở trang đáp án. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`. Lời giải theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn của trường. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai`** (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị; hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10). Câu **trùng nguyên văn** giữa các đề ⇒ giữ nguyên, giải bình thường.
- **Phân kho:** `kho=hinh_hoc` cho hình học không gian (quan hệ song song, giao tuyến, giao điểm, thiết diện, hình chóp / lăng trụ / hộp, phép chiếu song song); còn lại `kho=dai`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B036` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Lớp chữ của PDF mất ký hiệu (chữ Hy Lạp, mũ, căn) nên **gõ đề từ ẢNH** như §2 bên dưới; lớp chữ chỉ để định vị.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề cương B036

| MA | Trường · năm học | Bộ sách | Trang đề | Đáp án | Cấu trúc (ước) · lưu ý |
|---|---|---|---|---|---|
| B036-01 | THPT Xuân Đỉnh, Hà Nội · 2024–2025 | KNTT | 1-22 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | Chương 4: Phần I TN · II Đ/S · III tự luận; Chương 5: Phần I TN · II Đ/S · III tự luận (≈160 câu); phạm vi: CHỈ chương 4 (quan hệ song song) và chương 5 (giới hạn, hàm số liên tục). 1 câu khái niệm đạo hàm (liên tục / có đạo hàm tại x=0, khoảng trang 17–18) ⇒ BỎ + báo |
| B036-02 | THPT Sơn Động số 3, Bắc Ninh · 2025–2026 | Cánh Diều | 2-4 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | Phần I 10 TN · Phần II 1 Đ/S · Phần III 4 TLN · Tự luận 3 câu (≈18 câu; trang 1 chỉ hình thức + nội dung ôn, trang 5 quảng cáo). có thêm bản .docx cùng bài — DÙNG PDF |
| B036-03 | THPT Bắc Thăng Long, Hà Nội · 2025–2026 | Cánh Diều | 1-16 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 5 đề (ĐỀ SỐ 1–5), mỗi đề: Phần 1 12 TN · Phần 2 Đ/S · Phần 3 TLN · Phần 4 tự luận (≈105 câu). có thêm bản .docx cùng bài — DÙNG PDF |
| B036-04 | THPT Ea H’Leo, Đắk Lắk · 2025–2026 | KNTT | 1-14 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 5 đề (mẫu đề 111…), mỗi đề: PHẦN I 12 TN · II 2 Đ/S · III 4 TLN · IV 4 tự luận (≈111 câu). chữ 'ĐÁP ÁN' trong đề chỉ là câu dặn tô phiếu — KHÔNG có đáp án |
| B036-05 | THPT Hướng Hóa, Quảng Trị · 2025–2026 | KNTT | 13-25 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | Ngân hàng ôn tập: PHẦN I TN (~57 câu) · II Đ/S · III TLN · IV tự luận (≈118 câu). trang 1–12 là ma trận + bản đặc tả — BỎ; từ trang 13 là ngân hàng câu hỏi |
| B036-06 | THPT Ngô Quyền, Đà Nẵng · 2024–2025 | KNTT | 12-27 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 5 đề ôn tập, mỗi đề: PHẦN I 12 TN · II 4 Đ/S · III tự luận (≈101 câu). trang 1–11 là nội dung ôn + ma trận + đặc tả — BỎ |
| B036-07 | THPT Nguyễn Bỉnh Khiêm, Gia Lai · 2024–2025 | KNTT | 1-17 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 4 đề (ĐỀ SỐ 1–4), mỗi đề: PHẦN I trắc nghiệm (7 điểm) · PHẦN II tự luận (3 điểm) (≈149 câu). trang 1 có mục A. NỘI DUNG ÔN TẬP (chữ, bỏ) rồi vào ĐỀ SỐ 1 |
| B036-08 | THPT Phúc Thọ, Hà Nội · 2024–2025 | Cánh Diều | 1-22 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | B. Bài tập: PHẦN I TN · PHẦN II Đ/S · PHẦN III TLN, chia Đại số / Hình học (≈126 câu). trang 23–24 trắng (không chữ, không ảnh) — bỏ |

Tất cả đều có lớp chữ (không phải scan) nhưng vẫn gõ từ ảnh.

---

# Brief trạm GÕ + GIẢI — ĐỀ CƯƠNG Toán 11 (24/10)

> Dùng cho 4 đề cương giữa/học kì I K11 (Thùy đưa 24/10): `VD-GKI-2026` Việt Đức · `HVT-GKI-2026` Hoàng Văn Thụ · `YH-HKI-2026` Yên Hòa · `TP-GKI-2026` Trần Phú.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B036\<MA>` (có `goc.pdf`, `trang\p-N.png` 130 dpi, `img\`, `tam\`, `z\`).
> Khác K8/K9: K11 chưa có khung gõ sẵn ⇒ **một trạm vừa GÕ câu từ ảnh vừa GIẢI**, ghi thẳng `kho-rules\dai\lo\toanmath\batch\B036\<MA>.soan.md` (tệp chưa tồn tại — bạn tạo).
> Trạm soát (Opus, `brief-soat.md`) giải mù lại + đối chiếu ảnh. Người làm ≠ người kiểm.

Việc: với **khúc đề cương được giao** (điều phối nói rõ: trang ảnh nào, từ câu nào đến câu nào, PHẦN số mấy), **gõ lại đúng đề** rồi **giải chi tiết** mọi câu. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit.
(Được ghi ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc)

1. `Repo\kho-rules\dai\k11.md` §3 (luật nội dung K11: cấm đạo hàm ở chương 1–2, nghiệm PTLG viết `k\in\mathbb{Z}`, đơn vị rad, `\sin x \cos x \tan x \cot x`, ĐKXĐ kèm hằng đẳng thức, mỗi dòng một bước).
   **Phạm vi kiến thức của đề cương** = chương trình KNTT lớp 11 tập 1 tới hết chương đề nêu (C1 hàm số LG & PTLG · C2 dãy số, CSC, CSN · C3 số đặc trưng mẫu ghép nhóm · C4 quan hệ song song trong không gian · C5 giới hạn, hàm số liên tục) + toàn bộ lớp ≤ 10.
   **CẤM trong mọi lời giải:** đạo hàm · mũ–logarit lớp 11 · số phức · công thức chưa học (hạ bậc bậc 3, `t=\tan\frac x2`). Câu chương 1–2 không dùng giới hạn. Câu giới hạn (C5) dùng giới hạn của dãy / hàm số theo SGK (quy tắc giới hạn, dạng vô định biến đổi, `\lim\dfrac{1}{n^k}=0`), không L'Hôpital.
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **khuôn TỆP** (đặt dòng `### …`, `**Đề:**`, `**Phần 1. Hướng dẫn**`, `**Mấu chốt:**`, `**Bước k.**`, `**Phần 2. Trình bày**`). Chỉ lấy khuôn tệp; kiến thức theo K11.
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
node kho-rules/dai/lo/k11/de-cuong/ghep-k11.mjs <MA> "<LV>" <số tệp ĐÃ CÓ> "<tên đề>" "<nguồn>" --chi-kiem
```

(Nếu điều phối chưa giao đủ các tệp khác, chạy cổng cho riêng tệp của bạn: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B036/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem` — lệnh này đòi mọi `## PHẦN` có câu; tệp của bạn đã có đủ tiêu đề PHẦN riêng nên chạy được.)

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
