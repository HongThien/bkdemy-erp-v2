KẾT LUẬN: ĐẠT

# DC-01c — biên bản SOÁT (Opus, 12/10)

Nguồn: đề cương ôn tập GKI Toán 7 THCS Ngôi Sao Hoàng Mai (MathCare) — phần của tệp c: trang 5/7 (Bài 7a–e, 8a–d, Bài 9, Bài 10).
Bản gốc trước khi sửa: `DC-01c.soan.goc.md`. Giải mù: `DC-01c.kiem.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (11 câu · 7 TLN · 4 tự luận · HGT 2 · hình 1 · chưa chắc 9).

- Số câu: **11** (Bài 7a, 7b, 7c, 7d, 7e, 8a, 8b, 8c, 8d, 9, 10).
- Khớp đáp án Pha 1 ngay từ đầu: **11/11** (7a 2026 · 7b 6 · 7c 2026 · 7d 2 · 7e 100 · 8a 4100625 · 8b 1 · 8c 10000 · 8d $\dfrac{1}{4104676}$ · 9 $122^\circ$ · 10 $80^\circ$, $40^\circ$, phân giác; số lớn và tổng/tích dãy kiểm bằng `node`).
- Chép đề: đúng ảnh ở cả 11 câu. Header `kieu: de_cuong`, không `nam`/`thoi_gian_phut`, đánh số PHẦN 2/PHẦN 3 theo bộ DC-01a/b/c — giữ nguyên.
- Phân loại: đúng (Bài 7–8 là Tìm $x$ ⇒ tách ý; TLN chỉ khi đáp số ≤ 4 ô: 2026, 6, 2026, 2, 100, 1, 122; 8a/8c quá 4 ô, 8d phân số ⇒ tự luận; Bài 9, 10 `kho=hgt`). Hình `c_b9.png` đúng, trọn, $58^\circ$ đã có trong Đề.
- **Bài 8d — kiểm ngoặc (phóng 400 dpi):** ảnh in $\sqrt{x}+\dfrac23\left(1+\dfrac1{2.4}\right)\left(1+\dfrac1{3.5}\right)\dots\left(1+\dfrac1{2024.2026}\right)=1$, **KHÔNG có ngoặc bao $\sqrt x+\dfrac23$**. Theo thứ tự thực hiện phép tính, $\dfrac23$ nhân với cả tích — chỉ có một cách hiểu, không còn mơ hồ ⇒ bỏ ý (2) trong `Chưa chắc` của trạm soạn. Đáp số $\sqrt x=\dfrac1{2026}$, $x=\dfrac1{4104676}$.
- Số câu phải sửa: **6** (7c, 8a, 8b, 8c, 8d, 10 — không câu nào sai đáp số / sai toán).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 8d | ghi chú thừa | Rút `Chưa chắc` chỉ còn phần kĩ thuật (rút gọn tích dãy); bỏ ý "đề không có ngoặc, hai cách hiểu"; sửa gạch đầu dòng tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Phóng 400 dpi: không có ngoặc, đọc theo thứ tự phép tính là duy nhất |
| Bài 8a | kiến thức (thuật ngữ) | "Phương trình trở thành $S.\sqrt x=2025.S$" → "Ta có …" | "Phương trình" là thuật ngữ lớp 8, lớp 7 gọi là đẳng thức / tìm $x$ |
| Bài 8d | kiến thức (thuật ngữ) | "Phương trình trở thành …" → "Do đó …" | Như trên |
| Bài 7c, 8b, 8c | kiến thức (thuật ngữ) | Phần 1: "phương trình" → "đẳng thức" (7c Bước 4; 8b Bước 2 + Chú ý; 8c Bước 2) | Như trên |
| Bài 10 | lập luận (lý do) | b) thêm "(giả thiết)" sau "tia $Ot$ nằm giữa hai tia $Oy$ và $Oz$" trước khi cộng góc | Luật Hình: mỗi khẳng định có lý do trong ngoặc |

## Câu còn `Chưa chắc` (gửi CEO)

Cả 9 câu đều ĐÚNG đáp số và lập luận chặt (đã kiểm từng dòng, khớp giải mù); `Chưa chắc` giữ lại chỉ vì dùng kĩ thuật ngoài lý thuyết bản đồ K7 — CEO quyết giữ hay loại.

- **Bài 7a** — tách $\dfrac1{n(n+1)}=\dfrac1n-\dfrac1{n+1}$ rồi triệt tiêu (tổng dãy phân số có quy luật).
- **Bài 7b** — tổng dãy luỹ thừa: đặt $A$, tính $3A-A$.
- **Bài 7c** — công thức $1+2+\dots+n=\dfrac{n(n+1)}2$ (lớp 6 nâng cao) + tách như 7a.
- **Bài 7d** — đặt $2^x$ chung + tổng $1+2+\dots+2^{2017}$ bằng $2B-B$.
- **Bài 7e** — tổng $5^2+5^4+\dots$ bằng $25C-C$.
- **Bài 8a** — cộng 1 vào từng số hạng $\dfrac{k}{2025-k}$ rồi bù lại, chia hai vế cho tổng $S\ne0$.
- **Bài 8b** — trừ 1 vào từng phân số, đặt $2026\sqrt x-2026$ chung, tích bằng 0.
- **Bài 8c** — cộng 1 vào từng phân số, đặt $100-\sqrt x$ chung, tích bằng 0.
- **Bài 8d** — $1+\dfrac1{n(n+2)}=\dfrac{(n+1).(n+1)}{n(n+2)}$ rồi rút gọn tích dãy (không còn vấn đề đọc ngoặc — đã kiểm).

## ẢNH CHO CEO

| Câu | Ảnh (tên tệp) | Trang trong PDF gốc (đề cương, số trang in) | Vấn đề |
|---|---|---|---|
| Bài 7a | `can-xem/DC-01_Bai7a.png` | 5/7 | Lời giải dùng tách $\dfrac1{n(n+1)}=\dfrac1n-\dfrac1{n+1}$ triệt tiêu (ngoài lý thuyết bản đồ K7) — giữ hay loại câu? |
| Bài 7b | `can-xem/DC-01_Bai7b.png` | 5/7 | Tính tổng dãy luỹ thừa bằng $3A-A$ (ngoài bản đồ K7) — giữ hay loại? |
| Bài 7c | `can-xem/DC-01_Bai7c.png` | 5/7 | Cần công thức $1+2+\dots+n=\dfrac{n(n+1)}2$ và tách triệt tiêu — giữ hay loại? |
| Bài 7d | `can-xem/DC-01_Bai7d.png` | 5/7 | Đặt $2^x$ chung + tổng dãy luỹ thừa $2B-B$ (ngoài bản đồ K7) — giữ hay loại? |
| Bài 7e | `can-xem/DC-01_Bai7e.png` | 5/7 | Tổng dãy luỹ thừa cách đều số mũ bằng $25C-C$ — giữ hay loại? |
| Bài 8a | `can-xem/DC-01_Bai8a.png` | 5/7 | Kĩ thuật cộng 1 vào từng số hạng rồi bù lại để ra $2025.S$ (nâng cao) — giữ hay loại? |
| Bài 8b | `can-xem/DC-01_Bai8b.png` | 5/7 | Kĩ thuật trừ 1 vào từng phân số, đặt thừa số chung (nâng cao) — giữ hay loại? |
| Bài 8c | `can-xem/DC-01_Bai8c.png` | 5/7 | Kĩ thuật cộng 1 vào từng phân số, đặt thừa số chung (nâng cao) — giữ hay loại? |
| Bài 8d | `can-xem/DC-01_Bai8d.png` | 5/7 | Rút gọn tích dãy $\dfrac{(n+1).(n+1)}{n(n+2)}$ (nâng cao); đề không có ngoặc, đọc duy nhất — chỉ cần quyết giữ hay loại |

Ảnh mỗi ý gồm dòng lời dẫn "Bài 7. / Bài 8. Tìm x, biết:" ghép trên dòng của ý (cắt `pdftoppm -r 150 -f 5` hai vùng rồi ghép dọc), đã mở kiểm: trọn, không dính ý khác.
