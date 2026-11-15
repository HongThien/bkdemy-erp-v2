# ⚠️⚠️ BẢN ÁP DỤNG BATCH B108 — ĐỀ GIỮA HỌC KÌ 2 TOÁN 12 CỦA TRƯỜNG, TẢI TỪ TOANMATH (3 đề GKII, 15/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

**PHẠM VI K12 ĐÈ LÊN MỌI DÒNG K11 BÊN DƯỚI.** Brief gốc bên dưới viết cho ĐỀ CƯƠNG Toán 11 (24/10). Khuôn tệp, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN.
Mọi chỗ nói về kiến thức / luật / cổng của **lớp 11** (k11.md §3, "KNTT lớp 11 tập 1", "CẤM đạo hàm…", `--khoi 11`, `ghep-k11.mjs`) ĐỌC THÀNH **lớp 12** theo mục "Phạm vi K12" dưới đây. Chỉ khác những điểm sau:

- `<MA>` = `B108-NN` (01–03). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B108\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- **B108 lượt này CHỈ 3 đề GKII** (9 bài GKI trong batch.json để lượt sau — không có thư mục làm việc, đừng tìm). Ba đề đều là PDF có lớp chữ, không Word.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B108\<MA>` (đã có `goc.pdf` = NGUYÊN file, `trang\p-N.png` **150 dpi** (B108-02 có 10 trang ⇒ tên ảnh `p-01.png … p-10.png`), `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B108\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B108/<MA>.soan.md --lam-viec "<LV>" --khoi 12 --chi-kiem`
  (Cổng `--khoi 12` đã nhận dấu nhân `\cdot` từ 14/11 — viết `\cdot`, không `\times`, không dấu chấm. Tên hình `S.ABCD` viết bình thường.)
- **Đề nhiều mã ⇒ chỉ MỘT mã.** Cả ba file B108 chỉ in MỘT mã đề (`ma_de`) ⇒ KHÔNG có `tach`: `goc.pdf` là nguyên file, hướng dẫn chấm / bảng đáp án nằm ở `trang\p-<hd>.png`
  (bảng đáp án gộp nhiều mã ⇒ lấy đúng cột / dòng `ma_de`). Bỏ qua trang quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra giữa học kì 2 Toán 12 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2024–2025` / `2025–2026`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in (Phần II/III/IV đánh lại từ "Câu 1"). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô (đề K12 hay có đáp số làm tròn, VD `11,4`, `15,2`, `265`) ⇒ chỉ giữ `loai=tra_loi_ngan` khi đáp số khớp `^-?\d+(,\d+)?$` và ≤ 4 kí tự (không đếm dấu phẩy); còn lại `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
  Câu tự luận có ý a), b) (nếu có) ⇒ giữ MỘT câu, đề ghi đủ các ý, lời giải giải lần lượt từng ý.
- **Phạm vi K12 = GIỮA HỌC KÌ 2 lớp 12 THEO BỘ SÁCH CỦA ĐỀ** (đề không ghi bộ sách ⇒ `bo_sach: KNTT`, "suy đoán" ở `bo_sach_can_cu`):
  - **Cả 3 chương học kì 1** (như B052): C1 Ứng dụng đạo hàm khảo sát hàm số · C2 Vectơ và hệ toạ độ trong không gian · C3 Số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm.
  - **+ Chương IV Nguyên hàm – Tích phân:** nguyên hàm, tính chất, nguyên hàm các hàm sơ cấp (luỹ thừa, $\dfrac1x$, mũ, lượng giác, $\dfrac{1}{\cos^2x}$, $\dfrac{1}{\sin^2x}$); tích phân, tính chất;
    ứng dụng: diện tích hình phẳng, thể tích vật thể (theo $S(x)$) / khối tròn xoay, bài toán chuyển động (vận tốc → quãng đường), chi phí biên / thực tế.
  - **+ Chương V Phương pháp toạ độ trong không gian:** phương trình mặt phẳng, đường thẳng, mặt cầu; vị trí tương đối, góc, khoảng cách theo công thức SGK — **tới đâu thì THEO ĐỀ**.
    **Đề kiểm tra tới đâu (đọc ma trận / nội dung):**
    (Cả ba đề KHÔNG có ma trận trong file — phạm vi đọc từ nội dung câu.)
    - **B108-01 Duy Tân (Quảng Ngãi) 2025–26:** Chương IV + **Chương V bài Phương trình mặt phẳng** (vectơ pháp tuyến, viết phương trình mặt phẳng qua điểm có VTPT / qua hai điểm và vuông góc mặt phẳng / chứa trục $Ox$, điểm thuộc mặt phẳng, vị trí song song, khoảng cách điểm – mặt phẳng). Không có đường thẳng, mặt cầu.
    - **B108-02 Nguyễn Huệ (Huế) 2024–25:** CHỈ Chương IV (nguyên hàm · tích phân · diện tích · thể tích vật thể / khối tròn xoay · chuyển động). Không có câu Oxyz.
    - **B108-03 Thị xã Quảng Trị 2024–25:** Chương IV + **Chương V bài Phương trình mặt phẳng** (phương trình tổng quát, VTPT, mặt phẳng trung trực, mặt phẳng song song, mặt phẳng chứa trục $Ox$ và vuông góc mặt phẳng khác, khoảng cách từ điểm đến mặt phẳng — TLN câu 4 nhà kho).
  - **Cộng toàn bộ lớp ≤ 11** (đạo hàm, mũ–logarit, lượng giác, giới hạn, hình học không gian lớp 11, hình phẳng, parabol / elip lớp 10).
  - **Công cụ:** dùng đúng công cụ của SGK bộ sách đề.
    - Vectơ pháp tuyến từ hai vectơ chỉ phương: nếu hướng dẫn chấm của chính đề dùng tích có hướng thì được dùng; không có nhân chứng ⇒ tìm bằng hệ phương trình (như B052-09).
    - **Nguyên hàm từng phần / đổi biến:** KNTT 12 KHÔNG dạy từng phần / đổi biến tổng quát ⇒ KHÔNG dùng. Đề đòi mà SGK không có ⇒ giải bằng cách SGK cho phép nếu được
      (VD diện tích phần hình tròn ngoài hình vuông ở B108-01 TLN câu 1 = diện tích hình tròn / hình quạt / tam giác — hình học phẳng đã học, KHÔNG $\int\sqrt{36-x^2}\,dx$ bằng đổi biến lượng giác;
      $\int f(x+\pi)\,dx$ ở B108-03 Đ/S 4d: khai triển $f(x+\pi)=2x+2\pi-3\cos(x+\pi)=2x+2\pi+3\cos x$ rồi dùng bảng nguyên hàm, không đổi biến),
      không thì `**Chưa chắc:**`.
    - Thùng rượu elip (B108-02 TLN 4): elip lớp 10 (CTST/KNTT 10 có phương trình chính tắc) ⇒ $y^2$ theo $x$, thể tích khối tròn xoay $V=\pi\int y^2\,dx$; $1\ \text{dm}^3 = 1$ lít.
    - Bài parabol thực tế (cửa sắt, cửa inox, cổng): tự đặt hệ trục, viết parabol từ dữ kiện, ghi rõ hệ trục trong lời giải.
  - **Câu tích phân / diện tích / thể tích: thử máy bằng tích phân số** (script node, Simpson, trong `<LV>\tam\`) cho MỌI đáp số; nguyên hàm thử bằng đạo hàm số tại vài điểm; toạ độ / khoảng cách tính lại bằng máy.
  - **CẤM** (như mọi khối): công cụ ngoài SGK (L'Hôpital, Cauchy–Schwarz / Jensen không chứng minh…) — tự chứng minh bằng cái đã học; câu đề tự đòi thứ ngoài SGK mà không có cách trong phạm vi ⇒ `**Chưa chắc:**`.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Lời giải K12 = "CHI TIẾT như học sinh trình bày"** (`k12-de/de-hoc-ki/brief-giai-chi-tiet.md`): mỗi bước một dòng, công thức trong `$…$` (không `$$`), phân số `\dfrac`, nhân `\cdot`, kết luận "Vậy …" (TN: "Chọn X."); **Phần 2 là bản chính**. Cổng vẫn đòi khuôn 2 phần (Phần 1 Hướng dẫn 3–6 bước + Phần 2 Trình bày) ⇒ GIỮ khuôn; Phần 1 ngắn, không lộ đáp số.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC**: giải xong cả đề rồi mới mở trang `hd` (`<LV>\trang\p-<hd>.png`; B108 không có Word).
  Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho (cổng `--khoi 12` chỉ nhận `dai` / `hgt`):**
  `kho=hgt` cho MỌI câu **toạ độ Oxyz / vectơ không gian** (phương trình mặt phẳng, vectơ pháp tuyến, điểm thuộc mặt phẳng, khoảng cách điểm – mặt phẳng, mặt phẳng song song…);
  `kho=dai` cho mọi câu còn lại — nguyên hàm, tích phân, diện tích, thể tích, chuyển động, chi phí biên, parabol thực tế, hàm số, số đặc trưng.
  Hình không gian thuần (không toạ độ) theo đầu đè thuộc `hinh_hoc`, nhưng cổng `--khoi 12` KHÔNG nhận `hinh_hoc` ⇒ nếu gặp thì để `kho=hgt` + `**Ghi chú:** hình không gian thuần — đầu đè xếp hinh_hoc, cổng K12 chưa nhận` (B108-03 TLN câu 4 "nhà kho hình hộp + mái" và B108-01 tự luận câu 2 "chóp cụt $OAGD.BCFE$" đều cho trong Oxyz / giải bằng toạ độ ⇒ `kho=hgt`). Câu nhập nhằng ⇒ chọn theo bản chất + `**Ghi chú:**`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình (đồ thị $y=f(x)$ / $y=f'(x)$, hình phẳng tô đậm, vườn hoa, cửa sắt / cửa inox parabol, thùng rượu, chóp cụt, nhà kho: **cắt vào `**Hình:**`** — ERP chỉ giữ MỘT hình / câu). Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B108` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Luật chung đã chốt: đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị / giả thiết;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG phương án nào đúng ⇒ giữ nguyên văn, đề sai, `**Chưa chắc:**` (không "chọn gần nhất");
  KHÔNG ghi LaTeX (`\text`, `\frac`, `\notin`, `\neq`…) qua chuỗi JS (dùng Write/Edit).
- KHÔNG ghi DB, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.


## Ghi chú riêng từng đề B108

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B108-01 | THPT Duy Tân, Quảng Ngãi (Sở GDĐT Quảng Ngãi) · mã **121** · 2025–2026 | KNTT? | 1–4 → `trang\p-1…p-4` (nguyên file; trong file chỉ có mã 121) | `trang\p-5.png` (bảng đáp án TN · Đ/S · TLN 4 mã, **cột 121**), `trang\p-6.png` (TLN câu 3–4 + hướng dẫn chấm tự luận "Mã đề 121, 123" — dùng **tích có hướng** ⇒ được dùng tích có hướng cho đề này) | Đề in "PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (9 điểm)" gồm 3 mục (1. 12 TN · 2. 4 Đ/S · 3. 4 TLN) + "PHẦN II. TỰ LUẬN (1 điểm)" 2 câu ⇒ tệp soạn tách `## PHẦN 1` TN · `## PHẦN 2` Đ/S · `## PHẦN 3` TLN · `## PHẦN 4` tự luận; nhãn giữ như in (mỗi mục đánh lại từ Câu 1) + ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT` (như B052-02 cùng trường). TN câu 3, Đ/S câu 4 có hình (đồ thị, $y=f'(x)$ với $S_A=4$, $S_B=10$). **Đ/S câu 1 a):** $(\alpha)$ và $(\beta)$ in CÙNG phương trình $x+2y-2z+4=0$ ⇒ hai mặt phẳng trùng nhau, không "song song" — giải theo đề in (đáp án trường: S). TLN câu 1 vườn hoa tròn $R=6$, hình vuông $AB=4$ (hình học phẳng, làm tròn hàng phần mười); câu 2 mặt phẳng qua $M(2;3;-1)$ chứa trục $Ox$; câu 3 cửa rào parabol $5\ \text{m}$ × $2\ \text{m}$/$1{,}5\ \text{m}$ (đọc kĩ hình). Tự luận câu 2 chóp cụt $OAGD.BCFE$ (đọc hình: $A\in Ox$, $D\in Oy$, $G$ đỉnh đáy đối $O$), kết quả làm tròn hàng phần mười |
| B108-02 | THPT Nguyễn Huệ, Huế (Tổ Toán) · mã **218** · 2024–2025 | KNTT? | 1–3 → `trang\p-01…p-03` (nguyên file 10 trang; chỉ có mã 218) | `trang\p-04.png` (bảng đáp án các mã 218, 411, 664, 866 — **dòng 218**) + `trang\p-05…p-09.png` (lời giải chi tiết, nhân chứng). Bỏ `p-10` (quảng cáo) | 12 TN · 2 Đ/S · 4 TLN · tự luận 3 câu; CHỈ Chương IV. Tiêu đề in "Phần III: Trắc nghiệm trả lời ngắn" (bảng đáp án ghi "trả lời ngắn – tự luận") ⇒ vẫn `## PHẦN 3 | Trả lời ngắn`. TN câu 2 đồ thị $f'(x)$ với $a,b,c$ — so sánh $f(a),f(b),f(c)$ cần diện tích (đọc hình kĩ). TLN câu 2 đồ thị gồm đoạn thẳng + parabol trên $[-2;5]$ (đọc toạ độ từ hình, làm tròn hàng phần mười); câu 3 cửa inox parabol cao 3 m rộng 3 m; câu 4 thùng rượu elip (trục lớn 10 dm, trục bé 8 dm, hai đáy cách 6 dm), làm tròn hàng đơn vị (ảnh chụp có viền elip — cắt cả hình) |
| B108-03 | THPT Thị xã Quảng Trị (Sở GD-ĐT Quảng Trị) · mã **101** · 2024–2025 | KNTT? | 1–4 → `trang\p-1…p-4` (nguyên file; chỉ có mã 101) | `trang\p-5.png` (CHỈ bảng đáp án 4 mã, **cột 101**: TN · Đ/S · TLN — không có lời giải) | **16 TN** (không phải 12) · **4 Đ/S** · 4 TLN; KHÔNG có tự luận. TN câu 4 có hình. **Đ/S câu 2 d)** tổng $\dfrac{1}{F(1)}+\dots+\dfrac{1}{F(100)}$ với $F(x)=x^2+x$ (sau khi tìm từ $F(1)=2$) — tách $\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$. **Đ/S câu 3 d)** mặt phẳng chứa $Ox$ và vuông góc $(P)$: KHÔNG có hướng dẫn chấm ⇒ tìm VTPT bằng hệ phương trình (không tích có hướng). TLN câu 3 cổng parabol $GH=4$, $AB=4$, $AC=BD=0{,}9$ (đọc hình); câu 4 nhà kho hình hộp $ABCD.EFGH$, $AB=10$, $AD=24$, $AE=7$, cao 9 m, mái $EFIK$, $HGIK$ — đặt hệ toạ độ, đọc hình kĩ để xác định $I$, $K$ |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu tích phân / cận).

---

# Brief trạm GÕ + GIẢI — ĐỀ CƯƠNG Toán 11 (24/10)

> Dùng cho 4 đề cương giữa/học kì I K11 (Thùy đưa 24/10): `VD-GKI-2026` Việt Đức · `HVT-GKI-2026` Hoàng Văn Thụ · `YH-HKI-2026` Yên Hòa · `TP-GKI-2026` Trần Phú.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B108\<MA>` (có `goc.pdf`, `trang\p-N.png` 130 dpi, `img\`, `tam\`, `z\`).
> Khác K8/K9: K11 chưa có khung gõ sẵn ⇒ **một trạm vừa GÕ câu từ ảnh vừa GIẢI**, ghi thẳng `kho-rules\dai\lo\toanmath\batch\B108\<MA>.soan.md` (tệp chưa tồn tại — bạn tạo).
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

(Nếu điều phối chưa giao đủ các tệp khác, chạy cổng cho riêng tệp của bạn: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B108/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem` — lệnh này đòi mọi `## PHẦN` có câu; tệp của bạn đã có đủ tiêu đề PHẦN riêng nên chạy được.)

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
