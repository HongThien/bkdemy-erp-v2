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

# Brief giao trạm SOẠN — khối 7, bộ đề GKI (bước 1–2, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B022\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k7-brief-soat.md`) chạy Opus.
> Dựng từ `k6-brief-soan.md` (đã qua CEO duyệt khuôn). Chỗ khác K6: không có phần tiếng Anh · không có máy gõ (`de.boc.json` chỉ có 2 trường) ·
> đề trộn bộ sách · có Hình (§3 mục 4).

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa kì 1 Toán 7: **đọc đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\toanmath\batch\B022\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh cắt vào `<LV>\img\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k7.md` — luật giải + trình bày khối 7 (kiến thức được dùng §1, khuôn Phần 2 theo nhóm bài §2, định dạng §3).
2. `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` — **mẫu KHUÔN TỆP đã CEO duyệt (khối 6)**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2.
   Nội dung toán là khối 7 — chỉ lấy hình thức.
3. Câu có Hình (góc, song song, tam giác): xem mẫu lập luận `Repo\docs\log-giai-hinh-hoc-bai.md` (đọc mục R1, R2 và "đề tự đủ dữ kiện").
   Lý thuyết Hình 7 trên ERP (whitelist kiến thức hình): `Repo\kho-rules\dai\lo\k7-ly-thuyet-hinh7.md` (dump từ DB 10/10).

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`… — **ảnh từng trang, NGUỒN DUY NHẤT** (scan 150 dpi, không có lớp chữ). Mở HẾT mọi trang bằng công cụ Read.
- `<LV>\goc.pdf` — để cắt hình / phóng to (lệnh ở mục 3.8).
- `<LV>\de.boc.json` chỉ có `file` + `sha256` — **không có nội dung**, đừng tìm.
- `<LV>\img\` — thư mục TRỐNG lúc đầu; hình tự cắt (mục 3.8).

## 3. Việc phải làm

1. **Chép đề** từng câu từ ảnh: chữ, số, công thức, đủ 4 phương án, đủ các ý, không sót, không thừa. Đề có "ĐỀ 1 / ĐỀ 2" khác nhau trên cùng file ⇒ chỉ làm
   đề đầu tiên và ghi vào `## GHI CHÚ CHO NGƯỜI DUYỆT`.
2. **Lỗi in của đề** (sai chính tả, lệch số câu, thiếu dấu) ⇒ sửa tối thiểu cho đề đúng nghĩa + dòng `**Ghi chú:** …` nói đã sửa gì.
   `Ghi chú` chỉ dành cho lỗi của ĐỀ GỐC và điều người duyệt cần biết về câu.
3. **Bỏ** ô họ tên, khung điểm, hướng dẫn chấm, ma trận / bảng đặc tả (nếu kèm), trang trắng.
4. **Phân kho** từng câu: `kho=hgt` = hình học (góc kề bù / đối đỉnh / phân giác / song song, tam giác, hình hộp chữ nhật, lăng trụ đứng, lập phương,
   thể tích, diện tích xung quanh, vẽ hình); `kho=dai` = còn lại (số hữu tỉ, luỹ thừa, số thực, căn bậc hai, giá trị tuyệt đối, làm tròn, toán thực tế về số).
   Câu thực tế có hình khối (bể nước, phòng học…) ⇒ `hgt` nếu đáp số đòi tính thể tích / diện tích hình khối, `dai` nếu chỉ là %, tiền.
5. **Tách ý — CHỈ bài "Thực hiện phép tính / Tính" và "Tìm $x$"**: mỗi ý một câu, nhãn `Bài 1a`, `Bài 1b`…; đề của câu = lời dẫn của bài + biểu thức của ý
   (vd `Thực hiện phép tính (tính hợp lí nếu có thể): $…$`, `Tìm $x$, biết: $…$`). **Mọi bài khác GIỮ CHUNG một câu** (lời văn, hình, chứng minh, thực tế —
   kể cả khi có ý a) b)); Phần 2 ghi `a)` `b)`. **Ngoại lệ:** "Bài" chỉ là vỏ gom 2 BÀI TOÁN KHÁC HẲN NHAU (đánh số 1) 2), mỗi bài một bộ dữ kiện) ⇒ mỗi bài toán
   MỘT câu, nhãn `Bài 5.1`, `Bài 5.2`, `kho` theo từng bài toán. Ý a) b) c) của CÙNG một bài toán vẫn giữ chung.
6. **Loại câu:** `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · `tra_loi_ngan` CHỈ khi đáp số là MỘT số viết được trong 4 ô (chữ số, dấu `-` đầu,
   dấu `,` thập phân; vd `3000`, `-12`, `2,5`; 5 chữ số trở lên thì KHÔNG; phải đổi đơn vị mới vừa 4 ô thì KHÔNG; phân số `\dfrac{a}{b}` thì KHÔNG) ·
   còn lại `tu_luan` (`dap_an=—`). **Câu Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`**, đề giữ đủ các mệnh đề a) b) c) d), lời giải xét từng mệnh đề, thêm
   `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`. Câu "điền vào chỗ trống" có đáp số một số ⇒ `tra_loi_ngan` nếu vừa 4 ô, ngược lại `tu_luan`.
7. **Giải** mọi câu theo `k7.md`, lời giải 2 phần (mục 4). **Mọi đáp số phải thử lại** (thay ngược vào đề / tính lại bằng cách khác; số lớn thì `node -e`).
8. **Hình:** câu nào đề có hình thì thêm dòng `**Hình:** <tên tệp trong img>` (một tệp; nhiều hình nhỏ của cùng một câu ⇒ một ảnh chung).
   Tự cắt từ PDF (toạ độ pixel đo trên ảnh trang 150 dpi):
   `pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/img/<tên-không-đuôi>"`
   rồi MỞ ảnh vừa cắt kiểm: đúng hình của câu, không cụt, không dính chữ câu khác. Tên kiểu `p1c5` (trang 1, câu 5). Bài yêu cầu VẼ hình ⇒ vẫn nhập,
   lời giải tả từng bước vẽ, thêm `**Ghi chú:** lời giải chưa có hình vẽ`.
   **Đề bằng chữ nhưng hình là một phần dữ kiện** (số đo góc, kích thước ghi trên hình) ⇒ BẮT BUỘC có `**Hình:**` và số liệu phải chép cả vào phần Đề
   (đề tự đủ dữ kiện, như bài HH00112).
9. **Không chắc 100% thì NÓI RA** — thêm dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu. CEO xem kĩ đúng những câu này, đừng giấu và đừng ghi tràn lan.
   Ghi khi: ảnh mờ không đọc chắc một số / kí hiệu · đề có hai cách hiểu · đề in lỗi làm không có / có hai phương án đúng · phải dùng kiến thức ngoài SGK 7 ·
   hình trong đề mâu thuẫn dữ kiện chữ (ưu tiên hình, nói rõ) · lời giải theo một quy ước bạn đoán.
10. Cuối tệp mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu đã bỏ (vì sao), bộ sách của đề (KNTT / Chân trời / Cánh Diều — đoán theo nội dung nếu đề không ghi), nhận xét
    chung. Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp:

```
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 7 năm 2025-2026 — THCS <tên trường>, <quận / phường / xã> (mã đề …)
nam: 2025
bo_sach: KNTT
thoi_gian_phut: 90

## PHẦN 1 | Trắc nghiệm | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** …
A. …
B. …
C. …
D. …
**Hình:** p1c5.png
**Ghi chú:** …
**Chưa chắc:** …

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …

**Bước 2.** …

**Bước 3.** …

**Chú ý:** …

**Phần 2. Trình bày**

…

Chọn A.
```

- `nam` = năm đầu của năm học. `bo_sach` = luôn `KNTT` (CEO 10/10: **chỉ dùng sách Kết nối tri thức**; đề thuộc bộ sách khác đã bị loại ở bước phân loại, không tới đây — nếu bạn thấy đề này rõ ràng KHÔNG phải KNTT, DỪNG và báo ở trả lời cuối, đừng soạn). `thoi_gian_phut` = số phút ghi trên đề (không ghi ⇒ 90).
  Tên đề: "giữa học kì 1".
- `## PHẦN <n> | <tên> | <trac_nghiem|tu_luan|tra_loi_ngan>` — theo các phần của đề, đánh số từ 1. Phần Đúng/Sai ⇒ `tu_luan` (mục 3.6).
- `### <nhãn gốc của đề: Câu 3 / Bài 2a> | kho=… | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Ghi chú:**`, `**Chưa chắc:**` là tuỳ chọn, mỗi loại một dòng,
  đứng SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn (đã sửa lỗi in), mọi công thức trong `$…$`. Đề nhiều dòng thì xuống dòng đơn. Ký hiệu góc `\widehat{xOy}`; song song `\parallel`;
  vuông góc `\perp`; độ `^\circ`; chu kì `0,(3)`; hỗn số `2\dfrac{1}{3}`; giá trị tuyệt đối `\left|x\right|`.
- **Phần 1 — khuôn CARD, bắt buộc đúng từng chữ:** đoạn `**Phần 1. Hướng dẫn**` → đoạn `**Mấu chốt:** …` (một câu: điều phải nhận ra) →
  **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn đoạn `**Chú ý:** …` và / hoặc `Thử lại: …`. Các đoạn cách nhau MỘT dòng trống;
  trong một bước không có dòng trống. Mỗi bước là một **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ít nhất 5 chữ ngoài công thức, **không ghi đáp số cuối**,
  không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài ngắn ⇒ tách đúng thao tác thật thành 3 bước.
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra, theo khuôn nhóm bài ở `k7.md` §2. Mỗi dòng viết / mỗi phép tính một đoạn (cách nhau dòng trống).
  Bài tính mở bằng dòng chép lại biểu thức. Tìm $x$ theo cột. Câu trắc nghiệm: dòng cuối cùng phải đúng là `Chọn X.` (X trùng `dap_an`).
  **Hình:** mỗi khẳng định kèm lý do trong ngoặc `(hai góc kề bù)`, `(hai góc so le trong)`, `(giả thiết)`…; kết ý bằng `Vậy …`; nêu rõ vì sao tia nằm giữa
  trước khi cộng góc.
- **Định dạng:** dấu nhân là dấu chấm như SGK (`$25.4$`, `$\dfrac{-5}{11}.\dfrac{4}{13}$`, `$2.\left(x+\dfrac12\right)$`) — CẤM `\cdot`, `\times` · chia `:` ·
  phân số `\dfrac` · số trong công thức viết liền (`125000`) · số thập phân dùng dấu phẩy `0,25` · chữ tiếng Việt trong công thức bọc `\text{…}` ·
  đơn vị `$cm^2$`, `$cm^3$`, `(m)` · số âm trong phép tính để trong ngoặc `$(-4)$`.
- **Kiến thức:** theo `k7.md` §1. Quy tắc chuyển vế ĐƯỢC DÙNG. Không dùng kiến thức lớp 8+ (hằng đẳng thức, Pytago, đồng dạng, lượng giác, đa thức).

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B022/<MA>.soan.md --lam-viec "<LV>" --chi-kiem
```

## 6. Trả lời cuối

Vài dòng: số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · câu đã bỏ · bộ sách đoán · cổng đã đạt chưa.

## 7. Bẫy đọc ảnh đã cắn thật (đọc kĩ)

- **Kí hiệu "không chia hết"** ở ảnh 150 dpi rất dễ đọc nhầm thành "chia hết" (GKI-21 khối 6 lật ngược đáp án Đúng/Sai) — gặp ⇒ cắt phóng to 400 dpi.
- **K7 thêm:** dấu trừ trước phân số / số mũ nhỏ ($(-2)^3$ ↔ $-2^3$) · dấu gạch trên chu kì · hỗn số hay bị đọc thành phép nhân · dấu `|…|` · căn $\sqrt{\ }$
  dài ngắn · chỉ số của góc ($\widehat{A_1}$) · hình lăng trụ: số đo ghi trên hình khối thường nhỏ, phóng to trước khi chép.
- Không chắc ⇒ phóng to từ `goc.pdf` (`pdftoppm -r 400 …`), không đoán.
