KẾT LUẬN: ĐẠT

## Pha 1 — giải mù (viết trước khi mở bai.soan.md)

- G — ĐÚNG. n = 2k: n^3 − 4n = n(n−2)(n+2) = 8(k−1)k(k+1); tích 3 số nguyên liên tiếp chia hết cho 6 ⇒ chia hết 48.
- C1 — ĐÚNG. n^3 + 20n = (n^3 − 4n) + 24n; n^3 − 4n ⋮ 48 (như G), 24n = 48k ⋮ 48.
- C2 — ĐÚNG. n^3 − n = (n−1)n(n+1); n = 2k+1 ⇒ = 4k(k+1)(2k+1); k(k+1) chẵn ⇒ ⋮ 8; tích 3 số nguyên liên tiếp ⋮ 3; (3, 8) = 1 ⇒ ⋮ 24.
- C3 — ĐÚNG. n^3 + 3n^2 − n − 3 = (n+3)(n−1)(n+1); n = 2k+1 ⇒ = 8k(k+1)(k+2); k(k+1)(k+2) ⋮ 6 ⇒ ⋮ 48.
- C4 — ĐÚNG. = n(n−4)(n^2 − 4) = (n−4)(n−2)n(n+2); n = 2k ⇒ = 16(k−2)(k−1)k(k+1); tích 4 số nguyên liên tiếp ⋮ 24 (⋮ 3 và ⋮ 8, nguyên tố cùng nhau) ⇒ ⋮ 384.
- C5 — ĐÚNG. n^3 − 16n = n(n−4)(n+4); n = 4k ⇒ = 64(k−1)k(k+1); tích 3 số liên tiếp ⋮ 6 ⇒ ⋮ 384.
- C6 — ĐÚNG. = n(n^2−1)(n^2−4) = (n−2)(n−1)n(n+1)(n+2); tích 5 số nguyên liên tiếp ⋮ 3, ⋮ 5, ⋮ 8 (có hai số chẵn liên tiếp, một số ⋮ 4); 3, 5, 8 đôi một nguyên tố cùng nhau ⇒ ⋮ 120.
- C7 — ĐÚNG. = n(n+1)(n+2), tích 3 số nguyên liên tiếp ⋮ 2 và ⋮ 3 ⇒ ⋮ 6.
- C8 — ĐÚNG. n^3 − 13n = (n−1)n(n+1) − 12n; tích 3 số liên tiếp ⋮ 6, 12n ⋮ 6.
- C9 — ĐÚNG. = (n^2+n−2)(n^2+n) = (n−1)(n+2)·n(n+1) = (n−1)n(n+1)(n+2); tích 4 số nguyên liên tiếp ⋮ 3 và ⋮ 8 ⇒ ⋮ 24.
- C10 — ĐÚNG. n^2 + 4n + 3 = (n+1)(n+3); n = 2k+1 ⇒ = 4(k+1)(k+2); (k+1)(k+2) chẵn ⇒ ⋮ 8.

## Pha 2 — soát bai.soan.md

Bản gốc trước khi sửa: `bai.soan.goc.md`. Máy `tram-soan-kiem.mjs` sau sửa: 12 827 phép thử, 0 FAIL. Cổng `ghi.mjs` (chạy thử, không `--ghi`): ✔ cổng khuôn 11 bài.

| Bài | Khớp hướng pha 1 | Lỗi tìm thấy (loại) | Đã sửa / mức |
|---|---|---|---|
| G | khớp | trình bày: Bước 2 "rút được một số ra ngoài" tối nghĩa | sửa thành "rút được thừa số $2\cdot 2\cdot 2$ ra ngoài" — nen_sua |
| C1 | khớp kết luận, khác đường (bản soạn đặt $n=2k$ rồi tách $5k=-k+6k$; pha 1 tách $24n$) — cả hai đúng | trình bày: Chú ý "Chỉ có thể tách…" sai ý (không phải cách duy nhất) + vế "thử lại bằng cách cộng ngược" vô ích · lập luận: nhảy cóc $k^3-k\to(k-1)k(k+1)$ | Chú ý viết lại (mức sai); thêm dòng $=8[k(k^2-1)+6k]$ (nen_sua) |
| C2 | khớp | lập luận: "Vì 3 và 8 nguyên tố cùng nhau nên $n^3-n\ \vdots\ 24$" chưa nói rõ $n^3-n$ chia hết cho cả 3 và 8 (hai kết quả trước nằm trên hai biểu thức khác dạng) | thêm "Như vậy $n^3-n$ chia hết cho cả 3 và 8." — nen_sua |
| C3 | khớp | lập luận (Phần 1): Bước 2 nói "ba thừa số lẻ liên tiếp" — sai, $n$ lẻ thì $n-1$, $n+1$, $n+3$ đều chẵn | sửa thành "ba thừa số cách nhau 2 đơn vị" — sai |
| C4 | khớp | không | — |
| C5 | khớp | không | — |
| C6 | khớp | không | — |
| C7 | khớp | không | — |
| C8 | khớp | không | — |
| C9 | khớp | không | — |
| C10 | khớp | không | — |

Đối chiếu chung: không dùng đồng dư, giai thừa, quy nạp; mọi chỗ ghép hai tính chia hết đều nêu "nguyên tố cùng nhau"; lập luận ba/bốn/năm số nguyên liên tiếp đúng cả với $0$ và số âm; LaTeX không có `\times`, `\left`, `\right`, `\frac`; Phần 2 đều kết "Vậy …"; dòng `**Đề:**`, mã `###`, thứ tự bài giữ nguyên.

### Tổng số câu bị sửa theo loại

- lập luận: 3 câu (C1 nhảy cóc, C2 ghép chia hết, C3 Bước 2 sai)
- biến đổi: 0
- trình bày: 2 câu (G Bước 2, C1 Chú ý)
- Số bài có sửa: 4 (G, C1, C2, C3). Cờ `**Chưa chắc:**`: không có, không thêm.

### Mục hoi

- Không có.
