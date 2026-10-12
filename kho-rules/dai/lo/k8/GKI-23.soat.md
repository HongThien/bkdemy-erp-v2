KẾT LUẬN: ĐẠT

# GKI-23 — biên bản soát (trạm soát, 10/10)

Đề: Khảo sát giữa học kì I Toán 8 năm 2025-2026 — THCS Tống Văn Trân, phường Nam Định. 2 trang, có lớp chữ, không in bảng đáp án.

- **Số câu:** 16 (8 trắc nghiệm · Bài 1 · Bài 2a–2d · Bài 3 · Bài 4 · Bài 5).
- **Khớp đáp án Pha 1 ngay từ đầu:** 16 / 16 (bảng giải mù: `GKI-23.kiem.md`; máy kiểm `<LV>\tam\soat_mu.mjs` — thay số hai vế, toạ độ 3 bộ cho Bài 4, quét lưới Bài 5).
- **Số câu phải sửa:** 4 (không câu nào sai đáp số, không câu nào chép sai đề). Bản trước khi sửa: `GKI-23.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (16 câu · 8 TN · 2 TLN · 6 tự luận · chưa chắc 1).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 8 | định dạng (diễn đạt) | `Chú ý`: "hình bình hành không phải hình chữ nhật có hai cạnh bên bằng nhau…" ⇒ "hình bình hành (không phải hình chữ nhật) cũng là hình thang có hai cạnh bên bằng nhau…" | Câu cũ đọc ra hai nghĩa |
| Bài 3 | định dạng (diễn đạt) | `Chú ý`: viết lại vế đầu "khi lấy diện tích khu vườn trừ diện tích mảnh trồng rau, trước ngoặc là dấu trừ…" | Câu cũ ("hiệu hai biểu thức đứng trước có dấu trừ trước ngoặc") tối nghĩa |
| Bài 4 | lập luận (khuôn Phần 1) | Bước 6 (ý c) viết lại theo chiều phân tích đi lên: muốn $AK=3AD$ ⇒ cần $AD=\dfrac{2}{3}AI$ ⇒ cần $D$ là trọng tâm $\triangle AHC$ ⇒ có từ hai trung tuyến $AI$, $CO$ | Bản soạn viết ý c theo chiều xuôi (chép lại Phần 2); brief yêu cầu bài hình chứng minh đi từ kết luận lùi về giả thiết |
| Bài 4 | hình | `ve.mjs`: dời nhãn $O$ lên trên (−15, −9) rồi vẽ lại `giai_bai4.png` | Nhãn $O$ chạm đoạn $MN$ |
| Bài 5 | kiến thức | Phần 2 thêm dòng khai triển $(x+y+z)^2=\left[(x+y)+z\right]^2=\dots$; Bước 1 nói rõ phải tự khai triển; dòng dấu "=" ghi đủ điều kiện ($xyz=0$ và $(2-x)(2-y)(2-z)=0$), $(2;1;0)$ là một bộ ví dụ | "Bình phương của tổng ba số" không nằm trong 7 hằng đẳng thức của SGK ⇒ không trích như công thức có sẵn (k8.md §1.1 luật 3). Dấu "=" bản soạn viết như thể chỉ xảy ra tại một bộ |

## Đã soát, giữ nguyên

- **Chép đề:** 16 câu khớp ảnh trang (số mũ, dấu, phương án, tên điểm). Câu 5 đã phóng 300 dpi: đề gốc in C là $4^{2n-5}$, D là $4^{2n+5}$ (mất chữ $x$) — bản soạn sửa thành $4x^{2n-5}$, $4x^{2n+5}$ và có `Ghi chú`.
- **Luật kiến thức:** đề chạm tới hằng đẳng thức (Câu 4, Bài 2b–2d) và hình chữ nhật + trung tuyến ứng với cạnh huyền (Câu 7, Câu 8) nên các chỗ dùng đều hợp lệ. Bài 4 không dùng đường trung bình (kể cả ngầm): $O$ là trung điểm $AH$ lấy từ hai đường chéo hình chữ nhật $AMHN$; hình chữ nhật đi qua tổng bốn góc $360^\circ$ rồi mới dùng định nghĩa; ý c dùng trọng tâm (lớp 7). Không có phân tích nhân tử, Pythagore, Thalès.
- **Phân loại:** Câu 6, 7, 8, Bài 4 `hinh_hoc`; còn lại `dai`. Bài 2 tách 4 ý (Thực hiện phép tính, độc lập); Bài 1, Bài 3, Bài 4 giữ chung. `tra_loi_ngan`: Bài 2d ($9996$) và Bài 5 ($5$) — số nguyên ≤ 4 ô, cùng cách xếp với các đề đã ĐẠT (GKI-02 Bài 5a, GKI-08 Bài 4a).
- **Hình:** `p2c3_lai.png` (Bài 3) đủ hình, không cụt nhãn "10 (m)". `giai_bai4.png`: dựng bằng toạ độ ($AB=3<AC=4$), đủ $A,B,C,H,M,N,I,K,O,D$, chỉ đánh dấu giả thiết (bốn góc vuông, $HI=IC$, $AI=IK$), không đánh dấu $O$ là trung điểm.

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 5** — đề gốc in phương án C là $4^{2n-5}$ và D là $4^{2n+5}$ (thiếu biến $x$); đọc nguyên văn thì không phương án nào đúng với kết quả $4x^{2n-5}$. Bản soạn đã thêm $x$ vào C, D và chọn C. Hai trạm cùng ra $4x^{2n-5}$; điều cần CEO quyết là có chấp nhận việc sửa hai phương án của đề gốc hay không.
