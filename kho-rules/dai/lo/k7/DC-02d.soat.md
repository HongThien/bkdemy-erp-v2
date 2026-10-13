KẾT LUẬN: ĐẠT

# DC-02d — biên bản trạm SOÁT (Opus, 13/10)

Nguồn: Đề cương ôn tập giữa học kì 1 Toán 7 — THCS Tây Mỗ, phần BÀI TẬP NÂNG CAO (PDF tr.9 (in 29): Bài 1; PDF tr.10 (in 30): Bài 2–9; phần KHTN bỏ).
Giải mù: `DC-02d.kiem.md` (đọc đề phóng 400 dpi, số liệu kiểm `node -e`). Bản gốc trạm soạn: `DC-02d.soan.goc.md`.

- Số câu: **9** (3 trả lời ngắn: Bài 2 = 2023, Bài 8 = 14, Bài 9 = 50 · 6 tự luận).
- Khớp đáp án Pha 1 ngay từ đầu: **9/9** (Bài 1 $A>B$ · Bài 2 $2023$ · Bài 3, 5, 6 chứng minh đúng · Bài 4 bốn cặp $(40;0),(-40;1),(8;-2),(-8;3)$ · Bài 7 $c_{min}=-\dfrac23$ · Bài 8 $x=14$, $M_{min}=-28$ · Bài 9 $50$).
- Chép đề: khớp ảnh 9/9 (đã sửa tối thiểu 2 lỗi in của đề gốc, có `Ghi chú`: dấu "−+" ở $D$ Bài 2, "giá tị" Bài 7).
- Câu phải sửa: **4** (1 sửa lập luận; 3 chỉ gọn dòng `Chưa chắc` — bỏ phần đã kiểm chắc).
- Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ **✔ đạt cổng** (9 câu · 0 TN · 3 TLN · 6 tự luận · chưa chắc 9).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 6 | kiến thức / lập luận | $(k+1)^2=(k+1).(k+1)=k^2+2k+1$ ⇒ viết rõ $=k.(k+1)+1.(k+1)=k^2+k+k+1=k^2+2k+1$; `Chú ý` đổi theo (khai triển bằng tính chất phân phối) | Nhảy thẳng ra $k^2+2k+1$ là hằng đẳng thức (lớp 8, `k7.md` §1.5); viết qua tính chất phân phối (lớp 6) thì HS lớp 7 tự suy được |
| Bài 6 | ghi chú | Bỏ ý (1) của `Chưa chắc` ("đề không nói rõ $n$") | $n$ là số tự nhiên khác 0 là cách hiểu duy nhất của dãy (số hạng đầu ứng $n=1$); giữ lại ở mục ghi chú cuối tệp |
| Bài 2 | ghi chú | Bỏ ý (1) của `Chưa chắc` (cách đọc $D$ là suy đoán) | Đã phóng 400 dpi: "−+" là dấu thừa, đọc khác thì biểu thức vô nghĩa; lỗi in vẫn giữ ở `Ghi chú` để CEO thấy |
| Bài 8 | ghi chú | Bỏ ý (2) của `Chưa chắc` (đáp số nhập là $x$) | Đề hỏi đúng "tìm số nguyên $x$" ⇒ đáp số $14$ là chắc chắn |
| Bài 9 | ghi chú | Bỏ câu "cách đọc dấu chấm là dấu nhân suy ra từ quy luật" trong `Chưa chắc` | Chắc chắn là dấu nhân (quy luật $1.99$, $3.97$, …, $99.1$ đối xứng tổng 100); vẫn giữ `Ghi chú` giải thích cho người duyệt |

Đã soát và giữ nguyên: lời giải Bài 1, 3, 4, 5, 7, 8, 9 đúng từng dòng, chặt; Phần 1 đủ 3–6 bước nghĩ, không lộ đáp số; dấu nhân chấm, không `\cdot`/`\times`; phân loại TLN/tự luận đúng luật 4 ô (Bài 7 đáp số phân số ⇒ tự luận đúng). Không có câu hình.

## Câu còn `Chưa chắc` (gửi CEO)

Cả 9 bài đều là bài nâng cao (bồi dưỡng HSG), lời giải **đúng và chặt** nhưng dùng kĩ thuật ngoài lý thuyết K7 trên bản đồ — CEO quyết giữ hay loại:

| Câu | Lí do |
|---|---|
| Bài 1 | Ghép tổng lẻ – chẵn, đánh giá $X-Y\ge\dfrac12$ và $Y<505$ (làm trội / làm giảm) |
| Bài 2 | Viết tổng đan dấu thành hiệu hai tổng dương (kèm lỗi in "−+" ở $D$ đã sửa thành "+") |
| Bài 3 | Nhân tổng với 4 rồi cộng để triệt tiêu (tổng dãy luỹ thừa) |
| Bài 4 | Phương trình nghiệm nguyên hai ẩn: đưa về $x.(1-2y)=40$, xét ước lẻ |
| Bài 5 | Làm trội $\dfrac1{n^2}<\dfrac1{(n-1).n}$ rồi triệt tiêu |
| Bài 6 | Tách $\dfrac{2k+1}{k^2.(k+1)^2}=\dfrac1{k^2}-\dfrac1{(k+1)^2}$ rồi triệt tiêu |
| Bài 7 | Cộng bất đẳng thức cùng chiều, giải bất đẳng thức, chỉ dấu "=" (cực trị — kiến thức thứ tự & phép cộng là lớp 8); đề không nói $a,b,c$ thuộc tập nào |
| Bài 8 | Tách $M=\dfrac{27}{x-15}-1$, đánh giá theo dấu mẫu để tìm giá trị nhỏ nhất |
| Bài 9 | Tách $\dfrac1{k.(100-k)}=\dfrac1{100}.\left(\dfrac1k+\dfrac1{100-k}\right)$, ghép đối xứng |

## ẢNH CHO CEO

| Câu | Ảnh (tên tệp) | Trang trong PDF gốc (đề cương Tây Mỗ) | Vấn đề |
|---|---|---|---|
| Bài 1 | `can-xem/DC-02_Bai1.png` | PDF tr.9 (in 29) | Đáp số $A>B$ chắc; lời giải dùng kĩ thuật làm trội ngoài lớp 7 — giữ hay loại? |
| Bài 2 | `can-xem/DC-02_Bai2.png` | PDF tr.10 (in 30) | Đề in thừa dấu "−" trước "$+\dfrac1{1014}$" ở $D$ (đã sửa thành "+", đáp số 2023); kĩ thuật tổng đan dấu ngoài lớp 7 — giữ hay loại? |
| Bài 3 | `can-xem/DC-02_Bai3.png` | PDF tr.10 (in 30) | Chứng minh đúng bằng nhân 4 rồi cộng (tổng dãy luỹ thừa, ngoài lớp 7) — giữ hay loại? |
| Bài 4 | `can-xem/DC-02_Bai4.png` | PDF tr.10 (in 30) | 4 cặp nghiệm chắc; phương trình nghiệm nguyên hai ẩn là dạng HSG — giữ hay loại? |
| Bài 5 | `can-xem/DC-02_Bai5.png` | PDF tr.10 (in 30) | Chứng minh đúng bằng làm trội $\dfrac1{n^2}$ (ngoài lớp 7) — giữ hay loại? |
| Bài 6 | `can-xem/DC-02_Bai6.png` | PDF tr.10 (in 30) | Chứng minh đúng bằng tách hiệu bình phương rồi triệt tiêu (ngoài lớp 7) — giữ hay loại? |
| Bài 7 | `can-xem/DC-02_Bai7.png` | PDF tr.10 (in 30) | Đề in "giá tị" (đã sửa); $c_{min}=-\dfrac23$ chắc nhưng cần cộng/giải bất đẳng thức (lớp 8) — giữ hay loại? |
| Bài 8 | `can-xem/DC-02_Bai8.png` | PDF tr.10 (in 30) | $x=14$ ($M_{min}=-28$) chắc; tìm cực trị phân thức là dạng HSG — giữ hay loại? |
| Bài 9 | `can-xem/DC-02_Bai9.png` | PDF tr.10 (in 30) | $B=50$ chắc (dấu chấm ở mẫu là dấu nhân); kĩ thuật tách ghép đối xứng ngoài lớp 7 — giữ hay loại? |
