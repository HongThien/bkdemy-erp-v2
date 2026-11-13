# ⚠️⚠️ BẢN ÁP DỤNG BATCH B022 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 7 TẢI TỪ TOANMATH (5 đề cương, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief khối 7 đã chạy thật cho bộ đề GIỮA kì 1 (10/10), đã đổi sẵn đường dẫn. Khuôn tệp, khuôn lời giải, cổng, bẫy đọc ảnh: GIỮ NGUYÊN.
Khối 7 đã chạy (1) bộ đề CUỐI kì 1 (14/10, mẫu `Repo\kho-rules\dai\lo\k7\CKI-02.soan.md`, `CKI-11.soan.md`, `CKI-19.soan.md`) và (2) 9 ĐỀ CƯƠNG giữa kì
(mẫu khuôn đề cương: `Repo\kho-rules\dai\lo\k7\DC-08.soan.md` — có Đề minh hoạ; `DC-03.soan.md`, `DC-04.soan.md` — nhãn có tiền tố khi đề cương đánh số lại). Chỉ khác những điểm sau:

- `<MA>` = `B022-NN` (01–05). Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B022\ds-de.json` — mỗi đề cương có `don_vi`, `nam` (năm đầu năm học),
  `de` (các trang có BÀI TẬP trong `goc.pdf`), `hd` (rỗng — **không đề cương nào kèm đáp án / lời giải**), `chu` (PDF có lớp chữ hay không), `uoc_cau` (ước số câu).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B022\<MA>` (đã có `goc.pdf` = NGUYÊN file tải về, `trang\p-N.png` 150 dpi — file ≥ 10 trang thì ảnh đánh số
  2 chữ số `p-01.png`…; `img\`, `tam\`, `de.boc.json`).
  Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B022\<MA>.soan.md`; tệp kiểm (trạm soát): `…\B022\<MA>.kiem.md`.
- **⭐ MỘT ĐỀ CƯƠNG = MỘT TỆP** (không chia khúc `a/b/c` như DC-01, DC-02). Đề cương nhiều câu (> 80, vd B022-01, B022-02 ~110–150 câu) vẫn MỘT tệp — trạm soạn làm HẾT,
  không bỏ dở, không tóm tắt. Đọc HẾT mọi trang trong `de`.
- **Đầu tệp (thay khuôn "Đầu tệp" mục 4 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 7 năm <năm học> — <don_vi>
  kieu: de_cuong
  nam: <nam>
  bo_sach: KNTT
  ```
  Dòng **`kieu: de_cuong` BẮT BUỘC** (vào tab Đề cương của Kho đề thi). KHÔNG có `thoi_gian_phut`. Năm học viết `2024–2025` / `2025–2026`. Đối chiếu tiêu đề trên ảnh;
  lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`. (Mọi chỗ "đề kiểm tra giữa học kì 1" bên dưới đọc thành "đề cương ôn tập cuối học kì 1".)
- **PHẦN theo ĐÚNG cách đề cương chia** (I. Trắc nghiệm / II. Tự luận / Dạng 1, Dạng 2… / Hình học / Nâng cao / Đề tham khảo số 1, 2…): mỗi khối một
  `## PHẦN n | <tên như in, kèm khoảng câu> | <trac_nghiem|tu_luan|tra_loi_ngan>` (như DC-08, DC-03). **Phần LÝ THUYẾT chỉ chữ** (phạm vi kiến thức, câu hỏi lý thuyết "Phát biểu…",
  bìa, chữ ký ban giám hiệu) **KHÔNG đưa vào.** Nhãn câu giữ như in và **phải DUY NHẤT trong cả tệp**: đề cương đánh số lại từ 1 ở mỗi phần ⇒ thêm tiền tố như DC-03 / DC-04 / DC-08
  (`Hình Bài 1`, `Khác Bài 2`, `Đề 1 Câu 3`, `ĐMH Bài 4`…). Tách ý theo mục 3.5 bên dưới (chỉ "Tính" và "Tìm $x$"; ý 1) 2) đổi a b … như DC-03).
- **Không có đáp án ⇒ không có nhân chứng thứ hai từ đề:** tự giải, MỌI đáp số thử lại bằng máy (`node -e`, phân số chính xác BigInt); trạm soát giải mù là nhân chứng thứ hai.
  Chỗ nào chưa tự kiểm chứng được bằng máy ⇒ `**Chưa chắc:**`.
- **⭐ PHẠM VI KIẾN THỨC — cuối học kì 1 KNTT** (chép đúng phạm vi đã dùng cho 13 đề CKI 14/10 — "Mọi câu nằm trong phạm vi cuối học kì 1 (Chương I–V)", GHI CHÚ `CKI-11.soan.md`;
  thay mục whitelist "phạm vi GKI" của `k7.md` §1 luật 1 và mục Kiến thức của brief bên dưới). KNTT Toán 7 **Tập 1** =
  - **Chương I Số hữu tỉ · Chương II Số thực** — như bản giữa kì (`k7.md` §1–§2, khuôn Phần 2 theo nhóm bài).
  - **Chương III Góc và đường thẳng song song** — góc kề bù, đối đỉnh, tia phân giác, hai đường thẳng song song và dấu hiệu nhận biết, tiên đề Euclid, tính chất,
    định lí – giả thiết – kết luận – chứng minh định lí (whitelist `k7-ly-thuyet-hinh7.md`: HH00020–28, HH00112).
  - **Chương IV Tam giác bằng nhau** — tổng ba góc của tam giác (HH00001), góc ngoài của tam giác, hai tam giác bằng nhau, các trường hợp c.c.c · c.g.c · g.c.g, các trường hợp bằng nhau của
    tam giác vuông (kể cả cạnh huyền – cạnh góc vuông, cạnh huyền – góc nhọn), **tam giác cân, đường trung trực của đoạn thẳng** (HH00099–104; mẫu lập luận `CKI-02`, `CKI-11`, `CKI-19`).
  - **Chương V Thu thập và biểu diễn dữ liệu** — phân loại dữ liệu (là số / không là số, định tính / định lượng), tính đại diện của dữ liệu, bảng thống kê, biểu đồ đoạn thẳng,
    biểu đồ hình quạt tròn (đọc %, tính số lượng từ %). Câu thống kê ⇒ `kho=dai`. Bài "vẽ biểu đồ" / "hoàn thiện biểu đồ" ⇒ lời giải lập bảng + tả cách vẽ,
    `**Ghi chú:** lời giải chưa có hình vẽ` (như `CKI-11` Bài 3). Bài "thiết kế phiếu khảo sát" / "đưa ra biện pháp" (câu mở) ⇒ vẫn nhập, lời giải đưa một phương án hợp lí.
  - **CẤM (kiến thức tập 2 / lớp trên):** tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận/nghịch (Ch. VI) · biểu thức đại số, đa thức (Ch. VII) · xác suất (Ch. VIII) ·
    quan hệ góc–cạnh đối diện, bất đẳng thức tam giác, đường xiên – đường vuông góc, các đường đồng quy (Ch. IX) · hình khối (Ch. X) · hằng đẳng thức, Pytago, đồng dạng,
    đường trung bình (lớp 8+). Bài cần một kết quả ngoài phạm vi ⇒ tự lập luận bằng cái đã học (vd đẳng thức dạng $\dfrac ab=\dfrac cd$ chứa $x$ ⇒ nhân chéo / quy đồng,
    như CKI-14 Câu 6b CEO chấp nhận; $\left(\dfrac a b\right)^2$ ⇒ luỹ thừa của thương, không hằng đẳng thức). **Câu bắt buộc dùng tính chất dãy tỉ số bằng nhau / đại lượng tỉ lệ / hình khối
    ⇒ GỠ câu đó** (như DC-02 Bài 2e, 2f; DC-04 Nâng cao Bài 4), liệt kê trong `## GHI CHÚ CHO NGƯỜI DUYỆT` mục "Câu bỏ vì kiến thức kì 2". Không chắc gỡ hay giữ ⇒ giữ + `**Chưa chắc:**`.
  - Kiến thức lớp 6 (chia hết, ước – bội, số nguyên tố, tách phân số, tổng có quy luật) vẫn dùng được cho bài nâng cao; luật "giải được trọn bằng lớp 6–7 thì GIỮ" (DC-03, DC-05, DC-07).
- **⭐ Phân kho (đè mục 3.4 của brief bên dưới):** mọi câu hình học (góc, song song, tam giác, chứng minh hình, tính góc trên hình) là **`kho=hinh_hoc`** (dạng chờ `HH07000000`,
  `k7.md` §7 Q2) — KHÔNG dùng `kho=hgt` (cổng khối 7 chỉ nhận `dai` / `hinh_hoc`). Còn lại `kho=dai` (số, thống kê, bài thực tế về số, nâng cao số).
- **Đúng/Sai nhiều mệnh đề, điền Đ/S vào ô:** `loai=tu_luan` `dap_an=—`, xét từng mệnh đề + `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận` (như `CKI-02` Câu 7).
  Trả lời ngắn: `tra_loi_ngan` chỉ khi đáp số là MỘT số vừa 4 ô (mục 3.6).
- **⭐ Mã chạy cổng (đè mục 5 của brief soạn và bước 8 của brief soát — PHẢI có `--khoi 7`, thiếu là cổng chạy luật khối 6 và chặn `hinh_hoc`):**
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B022/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B022/<MA>" --khoi 7 --chi-kiem`
- **Hình:** cắt hình đề theo mục 3.8 bên dưới, Read kiểm từng hình; số đo / tên điểm đọc từ hình chép cả vào phần Đề. Biểu đồ (quạt tròn, đoạn thẳng) là dữ kiện ⇒ BẮT BUỘC `**Hình:**`
  + chép số liệu đọc được vào Đề. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B022` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- **Trạm soát — ảnh cho CEO:** lưu vào `Repo\kho-rules\dai\lo\toanmath\batch\B022\can-xem\<MA>_<nhãn>.png`; cột "Trang trong PDF gốc" = số trang trong `goc.pdf`.
  Mọi chỗ "kiểm tra giữa kì" trong brief soát đọc thành "đề cương cuối kì 1" với phạm vi kiến thức ở trên.
- **Cảnh báo trạm:** KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (`"\t"`, `"\f"`, `"\n"` biến thành ký tự thật) — dùng công cụ Write/Edit trực tiếp.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` (trạm soát: `<MA>.kiem.md`, `<MA>.soat.md`, `can-xem\`) và `<LV>\img\`, `<LV>\tam\`.

## Ghi chú riêng từng đề cương B022

| MA | Trường · năm học | Trang `de` (trong `goc.pdf`) | Chữ / scan | Ước câu | Cấu trúc & lưu ý |
|---|---|---|---|---|---|
| B022-01 | Archimedes School · 2025–2026 | 1–13 (`p-01`…`p-13`) | **ảnh** (không lớp chữ, ảnh sạch) | ~150 | p1 nửa trên "I. Kiến thức trọng tâm" (bỏ). "II. Bài tập theo chủ đề" Bài 1–37 (p1–8: tính / tìm x nhiều ý — tách; thống kê; Bài 16–28 hình; Bài 29–37 nâng cao số). "II. Một số đề tham khảo" (đề in nhầm số II) **Đề số 1–5** (p8–13), mỗi đề một khối PHẦN, tiền tố `Đề 1 Câu 1a`… / `Đề 4 Bài 2b`… (Đề 1–3 đánh "Câu", từ Đề 4 đánh "Bài" — giữ như in). ⚠ Đề 1 Câu 5 ($\frac{19}{x+y}=\frac{19}{y+z}=\frac{19}{z+x}=\frac{7x}{y+z}+…=\frac{133}{10}$) và Bài 34–36 (điều kiện $abc=1$, $\frac{a}{b+c}+…=1$): kiểm phạm vi — giải trọn bằng phân số / biến đổi lớp 7 thì giữ, phải dùng dãy tỉ số bằng nhau thì gỡ. Cùng trường 2024–25 = B021-05 |
| B022-02 | Trường Ngôi Sao Hoàng Mai · 2025–2026 | 1–13 (`p-01`…`p-13`) | **ảnh** (không lớp chữ, ảnh sạch) | ~110 | A. Phần Đại số: I. Trắc nghiệm Câu 1–25 (Câu 21–25 biểu đồ; Câu 25 ý a) b) mỗi ý 4 phương án ⇒ `Câu 25a`, `Câu 25b`) · II. Tự luận: 1. Bài tập cơ bản (1.1 Cộng trừ nhân chia, 1.2…, 1.3 Thu thập và biểu diễn dữ liệu — Bài 1–11) · Bài tập nâng cao Bài 12–17. B. Phần Hình học (p10–13): I. Trắc nghiệm Câu 1–… (**trùng số với Câu Đại** ⇒ tiền tố `Hình Câu 1`…; Câu 7 lưới ô vuông có hình) · II. Tự luận Bài 1–10 (⇒ `Hình Bài 1`…). Nội dung gần y hệt B021-04 (bản 2024–25, đánh số lại) — vẫn soạn đủ, KHÔNG chép từ tệp B021-04: số liệu có chỗ khác (vd Câu 8 "$x^3=64$ thì $\sqrt x$ bằng") |
| B022-03 | THCS Phúc Diễn (UBND phường Phú Diễn) · 2025–2026 | 1–9 (nguyên file) | chữ (lớp chữ mất ký hiệu ⇒ **đọc từ ẢNH**) | ~75 | p1 nửa trên "A. Lý thuyết" (bỏ). B. Bài tập: I. Trắc nghiệm Câu 1–25 (p1–5; Câu 8–13 biểu đồ; Câu 14–25 hình, Câu 25 bốn phương án là bốn hình ⇒ mô tả bằng chữ như DC-03 Câu 15) · II. Tự luận: Dạng 1 Bài 1.1 (tính), 1.2 (tìm x) — nhãn `Bài 1.1a`… · Dạng 2 Bài 2.1–2.5 thực tế (Bài 2.3 ti vi 21 in-sơ: chỉ đổi đơn vị, không Pytago; Bài 2.5 đổi pao) · Dạng 3 Bài 3.1–3.7 dữ liệu (Bài 3.6 vẽ biểu đồ) · Dạng 4 Hình Bài 4.1–4.10 · Dạng 5 nâng cao Bài 5.1–5.x |
| B022-04 | THCS Thăng Long · 2025–2026 | 1–5 (nguyên file) | chữ (đọc từ ẢNH) | ~45 | I. Đại số Bài 1–7 (Bài 1 phân loại số, Bài 2 sắp xếp số thực, Bài 3 tính, Bài 4 tìm x, Bài 5–7 dữ liệu/biểu đồ) · Phần Hình học Bài 1–10 (⇒ `Hình Bài 1`…; Bài 2–5 thực tế có hình: hồ nước, mái nhà $126^\circ$, tháp Pisa $5^\circ$, máy tính mở $126^\circ$) · III. Một số bài toán nâng cao Bài 1–4 (⇒ `Khác Bài 1`…; Bài 1 có hai nhóm 1) GTNN 2) GTLN — mỗi nhóm một câu `Khác Bài 1.1`, `Khác Bài 1.2`; Bài 2 tam giác $\widehat B=\widehat C=50^\circ$, điểm $K$: dựng tam giác đều phụ — chỉ dùng tam giác cân/đều + trường hợp bằng nhau). Cùng trường 2024–25 = B021-06 (phần Hình gần y hệt) |
| B022-05 | THCS Thành Công · 2024–2025 (file "on-tap") | 1–8 (nguyên file) | chữ (đọc từ ẢNH) | ~55 | p1 đầu "A/ Nội dung kiến thức" (bỏ). "B. Đề tham khảo" = **Đề số 1–5**, mỗi đề Bài 1–5 (Bài 1 dữ liệu: 1) đọc biểu đồ quạt, 2) vẽ biểu đồ đoạn thẳng — hai bài toán khác nhau ⇒ `Đề 1 Bài 1.1`, `Đề 1 Bài 1.2`; Bài 2 tính, Bài 3 tìm x — tách ý; Bài 4 hình; Bài 5 nâng cao). Mỗi đề một (hoặc hai: dữ liệu+đại số / hình) khối PHẦN, tiền tố `Đề 1 …`…`Đề 5 …`. Đề 2 Bài 5 ($C=3+3^2+…+3^{24}$) trùng B021-03 Bài 6 — vẫn soạn |

Mọi đề cương: bộ sách KNTT (phạm vi in trên đề cương / nội dung: Ch. I–V, không tỉ lệ thức, không hình khối). Thấy câu nào thuộc tập 2 ⇒ gỡ theo luật ở trên, KHÔNG DỪNG cả đề cương.
Thấy cả một phần lớn đề cương là bộ sách khác ⇒ DỪNG, báo ở trả lời cuối.

---

# Brief giao trạm SOÁT — khối 7, bộ đề GKI (10/10)

> `<MA>` = mã đề. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B022\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Dựng từ `k6-brief-soat.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho MỘT đề kiểm tra giữa kì Toán 7 đã được trạm khác soạn lời giải. Đề gốc KHÔNG có đáp án, nên đáp số
chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit.

## Pha 1 — giải MÙ (chưa được mở bản soạn)

1. Đọc `Repo\kho-rules\dai\k7.md` (luật khối 7) và, nếu đề có hình: `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md`.
2. Mở HẾT ảnh trang `<LV>\trang\p-*.png` bằng công cụ Read. **Chưa mở** `<MA>.soan.md`. (Đề là ảnh scan, không có lớp chữ.)
3. Tự chép đề rồi giải mọi câu. Số lớn tính bằng `node -e`, không nhẩm. Gặp số mũ / dấu trừ / chu kì / hỗn số / `|…|` chưa rõ ⇒ cắt phóng to 400 dpi từ
   `<LV>\goc.pdf` (`pdftoppm -r 400 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <w> -H <h> goc.pdf <ra>`) trước khi giải.
4. Ghi `Repo\kho-rules\dai\lo\toanmath\batch\B022\<MA>.kiem.md`: một bảng `| Nhãn (Câu 1 / Bài 2a…) | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |`.

## Pha 2 — soát bản soạn

5. Đọc mẫu khuôn tệp `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` và brief của trạm soạn `Repo\kho-rules\dai\lo\toanmath\batch\B022\brief-soan.md` (để biết luật họ phải theo).
6. Mở `Repo\kho-rules\dai\lo\toanmath\batch\B022\<MA>.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, dấu âm, ngoặc, gạch ngang, phương án, đủ ý, không sót câu). Chữ khung họ tên / điểm phải bị bỏ.
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết AI sai (có thể chính bạn sai ở Pha 1) — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · đúng kiến thức lớp 7 tại thời điểm kiểm tra giữa kì (`k7.md` §1: không hằng đẳng thức, Pytago, đồng dạng…; chuyển vế được dùng) ·
     Phần 2 đúng khuôn nhóm bài `k7.md` §2 · dấu nhân là dấu chấm · Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, không lộ đáp số cuối,
     không chép lại Phần 2) · câu Hình: mỗi khẳng định có lý do trong ngoặc, tia nằm giữa được nêu trước khi cộng góc, đề tự đủ dữ kiện.
   - **Phân loại**: `kho` (hgt = hình: góc, song song, tam giác, hình khối) · `loai` (trả lời ngắn chỉ khi đáp số là một số ≤ 4 ô theo ĐÚNG đơn vị đề hỏi, không phải
     phân số; Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`) · tách ý đúng luật (chỉ bài Tính và Tìm $x$; ngoại lệ "Bài" gom 2 bài toán khác hẳn nhau ⇒ `Bài 5.1`, `Bài 5.2`;
     bản soạn chưa tách thì bạn tách; các ý a) b) của cùng một bài toán vẫn giữ chung).
   - **Ghi chú**: dòng `**Ghi chú:**` chỉ dành cho lỗi của ĐỀ GỐC / điều người duyệt cần biết; ghi chú kiểu "bản máy gõ nhầm…" thì xoá.
   - **Hình**: mở tệp trong `<LV>\img\` ứng với dòng `**Hình:**` — đúng hình của câu, không cụt, không dính chữ câu khác. Câu cần hình mà thiếu ⇒ cắt lại
     theo lệnh `pdftoppm` trong brief soạn. Số đo / kích thước ghi trên hình phải có trong phần Đề.
7. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.soan.goc.md` (để đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.soan.md` những lỗi bạn **chắc chắn**.
   Chỗ bạn không chắc (đề mơ hồ, hai cách hiểu, ảnh mờ, hai bên lệch mà không phân xử được) ⇒ thêm / giữ dòng `**Chưa chắc:** …` trong câu đó (đặt sau đề, trước
   `**Phần 1. Hướng dẫn**`) — CEO xem kĩ các câu này. Dòng `Chưa chắc` của trạm soạn mà bạn đã kiểm chắc chắn đúng ⇒ xoá, ghi vào biên bản.
8. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B022/<MA>.soan.md --lam-viec "<LV>" --chi-kiem`
9. Ghi biên bản `Repo\kho-rules\dai\lo\toanmath\batch\B022\<MA>.soat.md`:
   - dòng đầu: `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp đáp án Pha 1 ngay từ đầu · số câu phải sửa;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |`;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Ảnh cho CEO (CEO 10/10: "các câu có vấn đề chụp ảnh câu đấy để t sửa, viết thế kia t khó tìm")

Với MỖI câu còn `**Chưa chắc:**` sau khi soát, và MỖI câu có `**Ghi chú:**` báo lỗi / thiếu dữ kiện của ĐỀ GỐC: cắt ảnh **NGUYÊN câu đó từ đề gốc** (đủ lời đề, hình, các phương án — cả khối câu, không cắt vụn)
vào `Repokho-rulesdailok7can-xem<MA>_<nhãn>.png` (nhãn bỏ khoảng trắng: `GKI-09_Cau8.png`, `GKI-01_Bai3.1b.png`). Lệnh cắt như brief soạn mục 3.8
(`pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x … -y … -W … -H … "<LV>/goc.pdf" "<ra không đuôi>"`; câu vắt qua 2 trang thì cắt 2 ảnh `…_a.png`, `…_b.png`).
MỞ ảnh vừa cắt kiểm: thấy trọn câu, không cụt, không dính câu khác. Cuối biên bản `<MA>.soat.md` thêm mục `## ẢNH CHO CEO`, mỗi câu một dòng:
`| Câu | Ảnh (tên tệp) | Trang trong PDF gốc BỘ-ĐỀ-GKI-7 | Vấn đề (MỘT câu, nói thẳng chỗ CEO cần sửa/quyết) |`
— **Trang trong PDF gốc** = số trang của `BỘ-ĐỀ-GKI-7.pdf` (trang đầu của đề này là trang <trang bắt đầu> của file gốc, xem bảng `k7.md` §5), để CEO mở đúng chỗ.
Không có câu nào cần CEO xem ⇒ ghi "Không".

## Trả lời cuối

Vài dòng: kết luận · số câu sửa theo loại lỗi · các câu `Chưa chắc`.
