KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 10 (V. Chủ đề chuyên, Bài 16–20) — trạm soát Opus, 11/10

- Số câu: **5** (0 TN · 0 TLN · 5 tự luận — cả 5 là chứng minh / đáp số bộ ba ⇒ `tu_luan` đúng).
- Khớp Pha 1 (`.kiem.md`) ngay từ đầu: **5/5** (16a cùng cách tách; 16b cùng cách chia chẵn/lẻ + hai số lẻ hơn kém 2 hoặc 4; 17 cùng ghép cặp ước, cùng phát hiện đề in $a^3$ thay vì $a^{39}$; 18 cùng đặt khối 50 chữ số 1; 19 cùng tách 8 và 3; 20 cùng bộ $\{2;3;5\}$ và cùng cách kẹp).
- Số câu phải sửa: **2** (Bài 17, Bài 19) — đều là bổ sung một mắt lập luận, không đổi đáp số. Bài 17 thêm ghi chú kiểm máy vào dòng `Chưa chắc` có sẵn.
- Đề: chép đúng ảnh `trang/p-3.png` cả 5 bài.
- Kiến thức: không dùng đồng dư, hằng đẳng thức, chuyển vế, công thức số ước. Bình phương $(3K)^2$ ở Bài 18 ra bằng $9K^2=3.3.K.K$; chữ số tận cùng của số chính phương ở Bài 19 tự suy ra bằng tính chất phân phối; chia hết cho 24 qua $\text{ƯCLN}(8,3)=1$ (đúng luật CEO 10/10, GKI-06 Bài 5), không dùng dấu hiệu chia hết cho 8.
- Máy kiểm (`node`, BigInt): 16a vét cạn mọi cách tách; 16b cách tách đúng mọi $n$ từ 7 tới 100000; 17 tích các ước của 5 số nhỏ nhất có 39 ước đều bằng $a^{39}$; 18 $M-N=(33\dots3)^2$; 19 $A \bmod 24=0$, tận cùng 8; 20 vét số nguyên tố < 200 chỉ ra $(2,3,5)$.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 17 | lập luận | Ý b: "$d.d=a.a$ nên $d=a$" ⇒ thêm "Nếu $d<a$ thì $d.d<a.a$, nếu $d>a$ thì $d.d>a.a$, nên $d=a$" | Bước dùng để khẳng định chỉ có MỘT ước ghép với chính nó (ra đúng 19 cặp) — đang nhảy cóc, HS lớp 6 cần lí do so sánh |
| Bài 17 | (ghi chú) | Thêm vào dòng `Chưa chắc` có sẵn: đã phóng to ảnh xác nhận in $a^3$ + máy kiểm 5 số có 39 ước, đề nghị sửa đề thành $a^{39}$ | Để CEO có bằng chứng quyết nhanh |
| Bài 19 | lập luận | Ý b: dòng "$k=10q+c$, nên $k^2=10.(qk+qc)+c^2$" ⇒ viết đủ các bước phân phối $m^2=m.(10q+c)=10qm+c.(10q+c)=10qm+10qc+c^2=10.(qm+qc)+c^2$ và nêu vì sao $10.(\dots)$ không ảnh hưởng chữ số tận cùng; đổi tên biến $k\to m$ | Dòng cũ gộp 3 lần phân phối thành một bước (HS lớp 6 dễ tưởng là hằng đẳng thức); biến $k$ trùng tên với $k$ ở ý a ($10^k$, $k\ge 3$) |

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Bài 17 | **Đề in sai số mũ ở ý b:** ảnh ghi "Tích các ước của $n$ bằng $a^3$", đúng phải là $a^{39}$ ($a^3$ chỉ đúng khi $n$ có 3 ước). Lời giải đang chứng minh $a^{39}$. CEO quyết sửa chữ đề thành $a^{39}$ trước khi nhập. |

## Ghi chú thêm (không sửa)

- Bài 16a: 7 và 9 còn cách thứ hai ($7=3+4$, $9=4+5$); bản soạn ghi một cách + Chú ý nhắc có nhiều cách — đủ.
- Bài 16b TH 2.2 và Bài 20 đã lập luận chặt (không chuyển vế: dùng "bớt cùng một số ở hai vế" dạng $bc+bc<bc+(2b+2c)$).
