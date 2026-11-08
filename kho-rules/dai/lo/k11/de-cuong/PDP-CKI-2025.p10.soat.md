KẾT LUẬN: ĐẠT

# Biên bản soát — PDP-CKI-2025 khúc 10 (tr.37–40, ĐỀ ÔN TẬP HỌC KÌ 1)

- Số câu: 30 (PHẦN 101: 25 TN · PHẦN 102: 5 tự luận — Bài 1a, 1b, 1c, 2, 3).
- Đáp án khớp giải mù Pha 1 (`PDP-CKI-2025.p10.kiem.md`, thử máy `<LV>\tam\soat_mu_p10.mjs`) ngay từ đầu: 30/30 (Câu 2 khớp ở nhận định "đề sai, A và D cùng đúng").
- Số câu phải sửa: 4 (1 chép đề · 3 định dạng / lập luận nhỏ). Không câu nào đổi đáp án.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (30 câu, hình 3, chưa chắc 1).
- Bản gốc trước khi sửa: `PDP-CKI-2025.p10.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P101 Câu 22 | chép đề | Phương án D `$(HA'C')$` → `$(HA'C)$`; câu loại D ở Phần 2 viết lại: $(HA'C)$ chứa $A'B'$ nên chứa $B'$, lại chứa $C$ ⇒ $B'C\subset(HA'C)$; Bước 4 Phần 1 thêm "hoặc chỉ ra mặt phẳng chứa cả $B'C$" | Phóng to tr.39 (260 dpi): đề in `HA'C`, C không có phẩy. Đáp án A không đổi |
| P101 Câu 8 | định dạng | Tách chuỗi 5 đẳng thức một dòng thành 3 dòng | Mỗi phép biến đổi một dòng |
| P101 Câu 24 | lập luận | Thêm dòng "$A$, $C'$, $B'$ thẳng hàng (cùng nằm trên giao tuyến của đáy với mặt phẳng thẳng đứng chứa thước)"; Ghi chú thêm liên hệ định lí Thalès trong không gian | Đồng dạng $ACC'\sim ABB'$ cần ba điểm đó thẳng hàng — trước đó chỉ có ở Phần 1 |
| P102 Bài 2 | định dạng | Tách dòng $f(1)=\lim=\ldots=\ldots=a^2-\frac76$ thành 2 dòng | Mỗi phép biến đổi một dòng |
| GHI CHÚ CHO NGƯỜI DUYỆT | — | Bài 1c: ghi đã phóng to xác nhận `+n`; thêm mục Câu 22 | |

## Các điểm điều phối dặn soát — kết quả

- **Câu 2**: phóng to tr.37 xác nhận đề in $\cos x=\frac{\sqrt3}{2}$, A $\frac{5\pi}{6}$, D $\frac{7\pi}{6}$; cả hai có cos $=-\frac{\sqrt3}{2}$ ⇒ đều "không là nghiệm" (B, C là nghiệm). Đề sai thật, hai phương án cùng đúng. Giữ `Ghi chú` đề sai + dòng `Lưu ý` + `Chưa chắc` (đáp án một chữ không phân xử được A hay D); `dap_an=A` tạm.
- **Câu 4**: chỉ A ($t=\frac59$, $k=2$ ở họ $t=-\frac19+\frac k3$) cho $x=2$; B, C, D cho $x=-4,-2,-2$. Ghi chú về "thời điểm nào" hợp lí, không phải đề sai.
- **Câu 10**: C ($(\frac53)^n\to+\infty$); A, B, D → 0. Ghi chú hợp lí.
- **Câu 24**: `kho=hinh_hoc` đúng — bản chất là ba mặt phẳng song song (đáy, mặt nước, miệng bể) cắt thước và thành bể (Thalès trong không gian, KNTT 11 bài 13).
- **Bài 1b**: dấu chấm in là dấu nhân (đúng quy ước sách cũ), đáp số $\frac4{15}$ (thử máy n = 60 ra 0,266666…).
- **Bài 1c**: phóng to tr.40 — đề in `+n` ⇒ $+\infty$. Lời giải đúng (không dạng vô định).
- **Hình**: de_P101C19 (đúng câu, đủ nhãn S M N A B C D), de_P101C24 (bể gạch đủ), de_P101C25 (đủ 4 bước tô) đạt. giai_P102B3: kiểm toạ độ ảnh — D = A + C − B, O trung điểm AC và BD, M, N, E, F đúng trung điểm; nét khuất (SD, AD, DC, đường chéo, MN, NE, EF) đúng; MF trên mặt SAB nét liền đỏ; nhãn không đè. Đạt.
- Kiến thức: không đạo hàm / L'Hôpital; Bài 3c dùng góc giữa hai vectơ (lớp 10) — trong phạm vi.

## Gửi CEO (Chưa chắc / đề sai)

- **P101 Câu 2** — đề sai: hai phương án A ($\frac{5\pi}{6}$) và D ($\frac{7\pi}{6}$) cùng không là nghiệm của $\cos x=\frac{\sqrt3}{2}$; đang để `dap_an=A`, cần CEO chọn (giữ A / bỏ câu / sửa đề, vd đổi D thành một nghiệm).
