# CKI-26 — Pha 1: giải MÙ từ ảnh trang (trạm soát, 10/10)

> Đề: THCS Lê Ngọc Hân — Kiểm tra học kì I, Toán 6, năm học 2025–2026, 90 phút. 2 trang, không có phần tiếng Anh "Hệ T".
> Giải từ `trang/p-1.png`, `trang/p-2.png` + ảnh cắt phóng to 400 / 600 dpi từ `goc.pdf` (Câu 3–4, Câu 8, Bài 1, Bài 2). Chưa mở `CKI-26.soan.md`.
> Mọi đáp số đã tính lại bằng `node -e`.

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |
|---|---|---|
| Câu 1 | **C** (280) | Chia hết cho cả 2 và 5 ⇒ tận cùng 0. |
| Câu 2 | **C** ($\{3; 5; 7; 11\}$) | A có 1 (không là số nguyên tố); B có 9; D có 15. |
| Câu 3 | **B** ($-21; -19; -3; 0; 1; 5; 8$) | Đã phóng to 400 dpi: dãy đề là $-21; 8; 0; -19; 5; -3; 1$. |
| Câu 4 | **B** (22) | Điều kiện đọc ở 400 dpi: $-21\le x\le 22$. Các cặp đối nhau từ $-21$ đến $21$ triệt tiêu, còn lại 22. |
| Câu 5 | **D** | Khẳng định SAI: "Số nguyên âm nhỏ nhất có hai chữ số là $-10$" (đúng phải là $-99$). A, B, C đều đúng. |
| Câu 6 | **C** ($AC=BD$) | A sai cả số lẫn đơn vị (chu vi $=20$ cm; đề in "$25cm^2$"); B sai ($AB\perp AD$); D sai (đường chéo dài hơn cạnh). |
| Câu 7 | **D** (20 cm) | Nửa chu vi $120:2=60$; $60-40=20$. |
| Câu 8 | **D** (Hình a và Hình c) | Phóng to 600 dpi: a (biển cấm đi ngược chiều — hình tròn đỏ, vạch trắng ngang) có trục đối xứng; b (tam giác có hình người đi xe đạp) không; c (hình vuông xanh, mũi tên trắng có thanh ngang, đuôi khía chữ V) đối xứng qua trục dọc; d (người đi bộ sang đường) không, vì hình người không đối xứng. |
| Bài 1a | $0$ | $45+(-128)+55+28=(45+55)+[(-128)+28]=100+(-100)$. |
| Bài 1b | $-696$ | $(-53-23)-(567+53)=-76-620$. Tính hợp lí: bỏ ngoặc, ghép $-53-53$ … hoặc $-23-567$; kết quả như nhau. |
| Bài 1c | $100$ | Đọc ở 400 dpi: $65.37+65.63-4^3.10^2$ (dấu chấm là dấu nhân; có một khoảng trắng thừa sau "65." thứ hai). $65.100-64.100=6500-6400$. |
| Bài 2a | $x=-32$ | $x+13=-19$. |
| Bài 2b | $x=4$ | $(-14)+2.(x+3)=0$. |
| Bài 2c | $x=0$ | Đọc ở 400 dpi: $2^{x+3}.2^2=2^2.3+20$ — số mũ là $x+3$ (ẩn nằm ở số mũ). Vế phải $=32=2^5$ ⇒ $x+3+2=5$. |
| Bài 3 | $540$ học sinh | $\text{BCNN}(12,18,30)=180$; bội của 180 trong khoảng 500 đến 700 chỉ có 540. |
| Bài 4a | $240$ m | Chu vi hình thoi cạnh 60 m: $4.60$. |
| Bài 4b | $2000$ m² | $EF=60-20=40$ m; $S=(60+40).40:2$. |
| Bài 4c | $9000$ kg | $2000:2.9$. |
| Bài 5 | $729$ viên | Sàn $n\times n$ viên. Hai đường chéo có $2n-1$ viên khi $n$ lẻ (viên chính giữa tính một lần), $2n$ viên khi $n$ chẵn. 53 lẻ ⇒ $2n-1=53$, $n=27$, $27.27=729$. Trường hợp $n$ chẵn bị loại vì $2n$ chẵn. |

## Điều cần lưu ý về đề

- Không thấy lỗi in làm đổi đáp án. Câu 6 phương án A in đơn vị chu vi là "$cm^2$" — vẫn là phương án sai, không ảnh hưởng.
- Bài 4: hình vẽ kèm (lưới ô vuông, hình thoi $ABCD$ cạnh 60 m, hình thang cân $ABEF$, $FH=40$ m) là dữ kiện của bài ⇒ câu cần hình.
- Câu 8: bốn biển báo là dữ kiện ⇒ câu cần hình (đủ cả 4 biển và nhãn a, b, c, d).
