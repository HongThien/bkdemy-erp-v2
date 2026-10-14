KẾT LUẬN: ĐẠT

# Biên bản soát gói 3 — bản đồ mới K6 (14/10)

- Gói: `goi-3.json` · bản soạn: `out-3.json` (bản gốc trạm soạn: `out-3.goc.json`).
- Đã soát: **26 ví dụ / 13 dạng** · **0 khối lý thuyết** (cả 5 nhóm NNB00902, 894, 895, 899, 901 đã có lý thuyết, `can_ly_thuyet=false`).
- Cách soát: tự giải lại 26 đề bằng máy (`node`: BigInt cho 6 dãy luỹ thừa, vét cạn $x\in[0;2000)$ cho 20 bài tìm $x$) — **mọi đáp số khớp, mỗi bài đúng một nghiệm**; đọc từng dòng biến đổi theo khuôn k6.md §2 (tìm thành phần chưa biết, không chuyển vế), đối chiếu `mo_ta` từng dạng và dạng anh em.
- Cổng `kiem-goi.mjs`: **✔ đạt cổng** (ví dụ 13 dạng · lý thuyết 0 nhóm · ghi chú 8).

## Chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00367 (cả 2 ví dụ) | kiến thức | $A=1-2+2^2-\ldots+2^{100}$ → $A=2^{100}-2^{99}+\ldots+2^2-2+1$; $B=1-5^2+5^4-\ldots+5^{20}$ → $B=5^{20}-5^{18}+\ldots-5^2+1$ (viết theo số mũ giảm dần); lời giải $2A+A$, $5^2.B+B$ giữ cách làm, đáp số không đổi | Bản soạn có $1-2$, $1-5^2$ ngay đầu dãy (và $2-2^2$ trong $2A$): tính từ trái sang phải phải qua số âm — số nguyên là Ch III, lớp 6 lúc học nhóm này chưa có. Viết giảm dần thì mọi tổng riêng đều $\ge 0$ (máy đã kiểm từng bước) |
| NDB00358 (ví dụ 2) | định dạng | $3.x^4$ → $3x^4$ (5 chỗ) | k6.md §3: trước chữ viết liền ($2x$), như lý thuyết nhóm ($2x^3=54$) |

Không ví dụ nào sai toán, sai dạng, sai khuôn hay đề mơ hồ.

## Phân xử các điểm nghi của trạm soạn

- **Ranh giới 3 dạng NNB00901** (Cơ bản / x ở Cơ số / x ở Số mũ) — **xác nhận đúng**: `mo_ta` 3 dạng khác nhau đúng ở vế cuối (x không là cơ số/số mũ · x là cơ số · x là số mũ), song song 3 dạng NDB00357/358/359 của NNB00899; dữ liệu cụm cũ "Tìm x chứa ngoặc: x ở Cơ số" toàn kiểu $a.(x+c)^n\pm b$ ⇒ cách trạm soạn hiểu "x ở Cơ số" = cụm ngoặc chứa $x$ làm cơ số là đúng.
- **NDB00366 "tìm m" không có dữ liệu thật** — **xác nhận đúng ý**: khớp `mo_ta` ("biểu thức + số = cơ số$^m$") và cùng kiểu ví dụ $3C+1=4^m$ có sẵn trong lý thuyết nhóm NNB00902.
- **NDB00367 "đan dấu" không có dữ liệu thật** — kiểu đề đúng `mo_ta`; đã sửa thứ tự số hạng (bảng trên).
- **NDB00357 không ngoặc, NDB00358 chỉ $x^n$** — xác nhận: tránh đúng chỗ chồng với NNB00901.
- Bỏ khỏi `ghi_chu` 2 mục chỉ mang tính thông tin đã gộp (3 ví dụ cũ của NNB00902 — ví dụ mới không lặp số, soát đã kiểm).

## `ghi_chu` còn lại gửi CEO

1. **NNB00902** — tên nhóm "Dãy lũy thừa cơ số - Dạng cùng dấu" nhưng chứa dạng "Đan dấu" (NDB00367): đổi tên nhóm. Lý thuyết nhóm chỉ nói "Cộng hoặc trừ hai dãy số" — nên thêm: cùng dấu thì TRỪ, đan dấu thì CỘNG.
2. **NNB00895** — `mo_ta` nhóm chép nhầm từ dạng NDB00350; lý thuyết còn `\n` thô và `\cdot` ở ví dụ $55-3x=40$.
3. **NNB00899** — `mo_ta` nhóm chỉ ghi "x là số mũ" trong khi nhóm có 3 trường hợp; TH3 bước 3 còn chữ "Chuyển vế, đổi dấu" (đã biết).
4. **NNB00899 TH3 ↔ NDB00362** — lý thuyết NNB00899 có TH3 $(x\pm c)^n=a$, trùng dạng NDB00362 (NNB00901). Bài trần $(x+1)^3=64$ vào được cả hai chỗ — CEO quyết TH3 ở lại NNB00899 hay chỉ để ở NNB00901.
5. **Dữ liệu gói** — `ung_vien` các dạng anh em cùng cụm cũ giống hệt nhau (không phân biệt được dạng); cụm cũ "Cùng dấu" không có câu "tìm m" / "đan dấu".
