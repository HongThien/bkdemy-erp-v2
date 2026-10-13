KẾT LUẬN: ĐẠT

# DTD-GKI-2026 — Phần 6 (Bài 37a–37b, 38a–38b, 39, 40a–40d) — biên bản trạm SOÁT (Opus, 13/10)

- Số câu: **9** (0 TLN · 9 tự luận — đúng: cả 9 câu là chứng minh).
- Khớp Pha 1 (`DTD-GKI-2026.p6.kiem.md`) ngay từ đầu: **9/9** — 37a $=-5$ · 37b $=0$ · 38a $=-12$ · 38b (bản in) $=ab(y^2-y^4)$ · 39 $=-4$ · 40a $=6(n+1)$ · 40b $=5(-n^2-n)$ · 40c $=12(n-3)$ · 40d $=16(b-a)$.
- Đề: 9/9 chép đúng ảnh (đối chiếu ảnh 300 dpi `z/s6_a.png`, `z/s6_b.png` + lớp chữ PDF).
- Kiến thức: chỉ Chương I — không hằng đẳng thức nào; $(y-1)(y+1)$, $(n-1)(n+1)$ đều nhân từng hạng tử; chỉ đặt thừa số chung theo tính chất phân phối. Không "phương trình".
- Số câu phải sửa: **2** (cả hai là lời, không đổi đáp số / phân loại). Bản gốc: `DTD-GKI-2026.p6.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 39 | lập luận (lời Phần 1) | Mấu chốt "phép chia hai đơn thức cho một đơn thức" ⇒ "chia đơn thức cho đơn thức, nhân đơn thức với đa thức, nhóm hạng tử đồng dạng" | Câu cũ sai nghĩa (chỉ có một phép chia đơn thức cho đơn thức) |
| Bài 38b | định dạng | Thêm câu kết "Vậy với đề như in, $M=aby^2-aby^4$ không phụ thuộc vào $x$ nhưng còn phụ thuộc vào $y$; nếu số hạng cuối là $-ab(x^4+y^2)$ thì $M=0$…" | Phần 2 thiếu câu kết "Vậy …" (brief soạn §4) |

## Kiểm riêng hai câu trạm soạn nghi đề in sai (tự kiểm, không dựa trạm soạn)

- **Bài 38b** — ảnh 300 dpi đọc chắc: $-x^2y(a^2+b^2)+(ax^2+by)(ay+bx^2)-ab(x^4+y^4)$ (lớp chữ PDF cũng `x 2 y`, `by`, `ay`, `x 4  y 4`). Máy (số hữu tỉ chính xác, 432 bộ $(x,y,a,b)$): biểu thức $\equiv ab(y^2-y^4)$, ra 32 giá trị khác nhau ⇒ còn phụ thuộc $y$ (không phụ thuộc $x$). Vét các biến thể số mũ: chỉ hai bản ra hằng số — ngoặc cuối $(x^4+y^2)$ ⇒ $0$ · hoặc $x^2y^2$, $by^2$, $ay^2$ ⇒ $0$. Đúng như `Chưa chắc` của trạm soạn ⇒ GIỮ.
- **Bài 39** — ảnh rõ $2(x-2)$, điều kiện $(x,\ y\ne0)$. Máy: $A\equiv-4$ với mọi $x,y\ne0$ ⇒ "luôn dương" SAI. Nếu $2(x+2)$ ⇒ $A\equiv4>0$. Đúng như `Chưa chắc` của trạm soạn ⇒ GIỮ.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 38b** — đề in sai: như in thì biểu thức $=ab(y^2-y^4)$, phụ thuộc $y$. Đúng phải là $-ab(x^4+y^2)$ (sửa 1 số mũ) hoặc ba chỗ $y$ thành $y^2$ — cả hai cho $0$. Lời giải làm theo bản in + nêu bản sửa.
- **Bài 39** — đề in sai: $A=-4<0$ với mọi $x,y\ne0$, không "luôn dương". Đúng có lẽ là $2(x+2)$ ($A=4$) hoặc "luôn âm". Lời giải ghi kết quả thật.
- (Bài 40d giữ dòng `Ghi chú` có sẵn của người gõ: "chia hết" với $a,b\in\mathbb R$ hiểu là $E=16(b-a)$ — không phải `Chưa chắc`.)
