KẾT LUẬN: ĐẠT

# Biên bản soát — lý thuyết dạng, gói 2 (Tính thuận tiện · Luỹ thừa · Thứ tự phép tính · Toán thực tế)

- Đã soát **13/13 dạng**: NDB00342, 00344, 00343, 00345, 00346, 00347 (NNB00893) · NDB00353, 00354 (NNB00897) · NDB00355, 00356 (NNB00898) · NDB00360, 00361 (NNB00900) · NDB00352 (NNB00896).
- Phải sửa **8/13 dạng** (NDB00342, 00343, 00345, 00353, 00355, 00356, 00360, 00361 — sửa thẳng vào `out-2.json`, bản gốc ở `out-2.goc.json`). 5 dạng giữ nguyên: NDB00344, 00346, 00347, 00354, 00352 không có lỗi (00346/00347 có ghi chú, không sửa chữ).
- Kiểm bằng máy (`node -e`): các luỹ thừa bằng nhau ($2^6=4^3=8^2=64$, $3^4=9^2=81$, $2^4=4^2$); $24:6.2=8$; $300:25.2=24$; ví dụ phụ $2^4.37+4^2.63-5^2.10=1350$; vét cạn $0..14$ đẳng thức rút 2 lần $a.b+a.c+d.b+d.c=(b+c).(a+d)$ và bản hiệu (với $b\ge c$) — 0 phản ví dụ; $a^m:a^n=a^{m-n}$ với $m\ge n$.
- Cổng `kiem-goi.mjs`: ✔ đạt cổng (13 dạng, 8 ghi chú).

## 5 dạng nhân chia của NNB00893 — phân biệt nhau

| Dạng | Dấu hiệu riêng trong lý thuyết | Khớp ví dụ |
|---|---|---|
| NDB00344 Nhân giao hoán | toàn phép nhân, ghép cặp tích tròn $2.5$, $4.25$, $8.125$ | ✓ $8.47.125$, $2.25.36.4.5$ |
| NDB00343 Rút nhân tử chung | MỘT thừa số giống hệt có sẵn ở mọi cụm (đổi chỗ nếu lệch vị trí) | ✓ $85.12+85.88$, $29.67+33.29$ |
| NDB00345 Ẩn nhân tử chung | không số nào lặp sẵn; nhân thừa số trong cụm mới ra số chung (một cụm hoặc cả hai cụm) | ✓ sau sửa — trước đó chưa phủ ví dụ 2 |
| NDB00346 Rút 2 lần | hai đôi, sau lần 1 hai ngoặc bằng nhau ⇒ rút tiếp | ✓ $15.34+\dots$, $91.74-\dots$ |
| NDB00347 Hai nhân tử chung | hai đôi, hai ngoặc khác nhau ⇒ tính từng đôi rồi cộng | ✓ $27.64+\dots$, $45.113-\dots$ |

## Bảng sửa

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00342 | toán | `##CY` "ghép 625 với 225 (… đều là số trừ)" → "ghép 625 với số trừ 225 …; trong mỗi ngoặc số mang dấu + đứng trước" | 625 là số hạng đầu (mang dấu +), không phải số trừ; thêm điều kiện để không phải đặt dấu − trước ngoặc / hiệu âm |
| NDB00343 | thiếu điều kiện | $a.b-a.c=a.(b-c)$ thêm "(với $b\ge c$)" | số tự nhiên, hiệu phải có nghĩa |
| NDB00343 | lặp nhóm / phân biệt dạng anh em | `##CY` thêm: cụm chia từng đôi có thừa số chung khác nhau ⇒ dạng "Hai nhân tử chung" / "Rút 2 lần" | trước chỉ phân biệt với "Ẩn nhân tử chung", chưa tách khỏi 2 dạng hai đôi |
| NDB00345 | không khớp ví dụ | `##PP` bước 1: "tìm số trùng với thừa số của cụm khác" → "… trùng với một thừa số (hoặc với tích vài thừa số) của cụm khác"; `##CY` dấu hiệu thêm ca "hai cụm cùng nhân ra một số, như $6.8=2.24=48$" | ví dụ 2 ($6.8.23+2.24.77$) cả hai cụm đều phải nhân mới ra 48 — bước cũ không phủ |
| NDB00345 | định dạng (câu tối nghĩa) | "giữ lại trong ngoặc (… ngoặc chứa 55)" → "giữ nguyên (… khi rút 12 thì 55 vào trong ngoặc)" | câu cũ đọc như 55 nằm trong ngoặc ngay từ $(4.3).55$ |
| NDB00353 | thiếu điều kiện | "$a^n$ là tích của $n$ thừa số $a$" thêm "($n\in\mathbb{N}^*$)" | định nghĩa chỉ cho $n\ge 1$; $a^0$ quy ước riêng |
| NDB00355 | không khớp nội bộ / ví dụ | `##PP` bước 1 thêm ca cùng cơ số khác số mũ (chọn mũ nhỏ nhất, tách) cho khớp `##TC` + mo_ta; `##CY` "Đừng tính luỹ thừa ra số trước khi rút" → "Rút cả $a^n$ ra rồi mới tính nó ra số" | `##TC` nêu mũ nhỏ nhất mà `##PP` chỉ nói "giống hệt"; câu "đừng tính" khẳng định quá (tính trước vẫn đúng, chỉ dài) |
| NDB00356 | không khớp ví dụ (ví dụ nhóm) | `##PP` bước 2 thêm "luỹ thừa của chính số chung thì tách thành tích, như $16^2=16.16$" | ví dụ nhóm $2^4.71+4^2.45-16^2$ cần tách $16^2$; tính $16^2=256$ như bước cũ thì mất thừa số chung |
| NDB00360 | không khớp ví dụ | "Mỗi dòng chỉ phá một tầng ngoặc" → "Mỗi dòng phá nhiều nhất một tầng ngoặc" | ví dụ có nhiều dòng tính trong cùng một tầng ($10+5.9\to10+45$) |
| NDB00361 | không khớp ví dụ | như NDB00360 | như trên |

## Điểm còn nghi gửi CEO (đã ghi vào `ghi_chu`)

1. **NDB00355 ↔ NDB00356** (NNB00898): đề kiểu $3^5.a+3^3.b$ (cùng cơ số, khác số mũ, phải tách $3^5=3^3.3^2$) thuộc dạng nào? mo_ta NDB00355 (chép từ lý thuyết nhóm) có "thường là lũy thừa có số mũ nhỏ nhất" ⇒ đang xếp vào NDB00355; mo_ta NDB00356 "cần biến đổi lũy thừa để xuất hiện nhân tử chung" cũng phủ được. Lý thuyết hiện để: cùng cơ số khác mũ ⇒ 00355; khác cơ số cùng giá trị ⇒ 00356.
2. **NDB00346 / NDB00347**: lý thuyết chỉ nêu ca đôi sau đứng sau dấu $+$ (đúng mọi ví dụ). Đề kiểu $a.b+a.c-d.b-d.c$ phải đặt dấu $-$ trước ngoặc — quy tắc dấu ngoặc là kiến thức chương số nguyên, chưa có trên bản đồ K6.
3. Ghi chú trạm soạn giữ nguyên (mo_ta lỗi chính tả NDB00342/00347, `cum_cu` gắn sai cho 5 dạng nhân chia và NDB00361, NDB00344 tên có "chia" mà không có ví dụ chia, lý thuyết nhóm NNB00898 có `\n` chữ và `\cdot`).
