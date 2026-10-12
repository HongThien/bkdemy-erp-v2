KẾT LUẬN: ĐẠT

# NSHM-GKI-2026 — Phần 2 (Bài 3, Bài 4) — biên bản trạm SOÁT (Opus)

- Số câu: **2** (0 TLN · 2 tự luận).
- Khớp Pha 1 (`NSHM-GKI-2026.p2.kiem.md`) ngay từ đầu: **2/2** — Bài 3: $M=x^2-3xy+4y^2$, $M(3;1)=4$, $(x;y)\in\{(-1;-1),(-4;-1)\}$ · Bài 4: $G=x^2-2xy+y^2=(x-y)^2$, $G(5;2)=9$,
  $(x;y)\in\{(2;1),(5;1),(1;-3),(-2;-3)\}$. Máy (`<LV>\tam\soat_p2.mjs`): rút gọn thay 5 bộ số, vét cạn $[-500;500]^2$, kiểm hai đẳng thức then chốt
  $N+2=(x+2)^2+(x-3y)^2-5$ và $4(K+7)=-(2x-3)(4y-2x+7)+7$ — trùng đúng các dòng biến đổi của bản soạn.
- Số câu phải sửa: **0** (không tạo `.soan.goc.md` vì không sửa gì).

## Đã soát

| Hạng mục | Kết quả |
|---|---|
| Chép đề | Đối chiếu ảnh `1.png` phóng to ×3: $M=3x(x-y)-2x^2+4y^2$, $x=3;y=1$, $N=2M+y^2+4x-3$, $N=-2$ · $G=x(3x-2y)-2x^2+y^2$, $x=5;y=2$, $K=G-y^2+3y-5x$, $K=-7$ — khớp |
| Đáp số | Khớp Pha 1 cả 6 ý |
| Lập luận từng dòng | Đúng. 3c: tách đủ hai trường hợp $1+4$, $4+1$, loại $0+5$; xét cả $\pm$; loại nghiệm phân số. 4c: nhân 4 là phép biến đổi tương đương, đủ 4 cách viết $7$ thành tích (kể cả âm) |
| Kiến thức | Chỉ dùng nhân đơn thức với đa thức, thu gọn, hằng đẳng thức bình phương, phân tích nhân tử bằng nhóm / đặt thừa số chung, ước nguyên (lớp 6), $a^2=1\Rightarrow a=\pm1$ (lớp 7) — đều trong phạm vi đề cương. Không phương trình / tập nghiệm / phân thức |
| Phần 1 | 5 bước mỗi bài, bước nghĩ thật, ghi rõ "Ý a/b/c", không lộ đáp số cuối |
| Định dạng · phân loại | `\cdot`, ngoặc–ngoặc viết liền; bài nhiều ý ⇒ `tu_luan`, `dap_an=—` đúng; nhãn, `kho=dai` giữ nguyên |
| Cổng | `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng |

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| — | — | Không sửa | — |

Nhận xét nhỏ (không sửa): 4c chỉ "Thử lại" một cặp — không cần thêm vì mọi bước đều là biến đổi tương đương.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
