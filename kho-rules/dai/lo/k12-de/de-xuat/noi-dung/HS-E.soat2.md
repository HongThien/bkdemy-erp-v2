KẾT LUẬN: ĐẠT

# Biên bản soát phần BỔ SUNG — HS lượt E (C2.1, C2.3 + C2.1.1–C2.1.5, C2.3.1–C2.3.3) — 03/11

Phạm vi: `diff HS-E.truoc-bs.txt HS-E.txt` (5 ví dụ mới, 1 ví dụ sửa, 7 dòng lý thuyết thêm/sửa, GHI CHÚ). Phần cũ (đã soát đạt lượt 1) rà nhanh: không đổi ngoài các chỗ trong diff, máy kiểm vẫn sạch.

## Đã kiểm
| Chỗ mới | Kiểm | Kết quả |
|---|---|---|
| C2.1 nhóm + C2.1.4: dòng cách làm "cho công thức, chọn hình" | Có câu đề thật (T1120000001467, C2.1.4) | Đúng; dòng ở dạng cụ thể hoá cho trùng phương ($a$ → $ab$ → $(0;c)$), không chép lại dòng nhóm |
| C2.1.4 VD3 ($y=-x^4+2x^2-1$, 4 hình) | Dựng 4 hình ra PNG và NHÌN; tính cực trị bằng số | Hình III: M, cực đại $(\pm1;0)$ chạm $Ox$, cực tiểu $(0;-1)$ — trùng công thức. Nhiễu sai thật: I hai đầu đi lên (W), II một cực trị, IV cắt $Oy$ tại $1$. Không chép đề thật ($x^4/4-2x^2+1$) |
| C2.1.5 lý thuyết: nhiễu parabol, $x+\frac1x$ | Đề thật T1120000002987, T1120000005814 | Có trong đề, đúng |
| C2.1.5 VD3 ($y=\frac{x+3}{x-1}$) | Nhìn hình: TCĐ $x=1$, TCN $y=1$, qua $(0;-3)$, $(3;3)$, cắt $Ox$ tại $-3$ | Khớp đáp án d); b) TCĐ $x=-1$, $y(0)=3$ loại đúng; a), c) khác loại |
| C2.3.1 VD3 a) BBT, đếm số âm | Nhìn BBT (kẻ đôi $x=2$, hai đầu $-1$, hai mũi tên đi xuống); quét $b$: mọi bộ thoả có đúng 2 số âm | Đúng; cùng kiểu T1120000001432/…1344, số khác |
| C2.3.1 VD3 b) TCĐ $x=1$, TCN $y=-2$ | $b=-4$, $a=8$, $ad-bc=20\ne0$, $a-b=12$ | Đúng; cùng kiểu T112000000474, số khác |
| C2.3.2: bỏ "điểm đối xứng qua tâm" (quyết định Thùy) | Lý thuyết, PP, VD2 b), mô tả JSON | Đã bỏ hết; không còn ý nào trong tệp |
| C2.3.2 VD2 b) mới ($T=a\cdot b$) | $J(-2;-\frac23)$, $T=\frac43$ | Đúng; kiểu T…116 (đề), số khác |
| C2.3.2 lý thuyết + VD3 (hàm chia sẵn; tâm của $x+3-\frac2{x-1}$; tâm thuộc đường thẳng) | Kiểm tâm bằng $f(2x_I-x)+f(x)=2y_I$; thay $I(2;3)$ vào 3 đường | Đúng; cả ba kiểu có câu đề thật (dòng 135, 143, 147 của danh sách dạng) |
| C2.3.3 VD3 a) cắt $Oy$ tung độ dương | $m<0$, $m\ne-2$ | Đúng; có câu đề thật cùng kiểu |
| C2.3.3 VD3 b) GTLN $\frac{mx+3}{m-x}$ trên $[1;2]$ bằng 3 | Quét $m\in[-50;50]$ (loại $m\in[1;2]$): nghiệm duy nhất $m=9$ | Đúng; kiểu đề $\frac{2mx+1}{m-x}$ trên $[2;3]$, số khác |

Script soát (độc lập trạm soạn): `S\soat2\HS-E\giai.cjs` (13/13 OK), `S\soat2\HS-E\ve.mjs` → `hinh-moi.png` (6 hình mới, đã nhìn từng hình). Đối chiếu đề thật: `S\soat2\HS-E\de-C2.*.txt` (cau-dang.cjs toàn bộ câu 5 dạng).

## Chỗ đã sửa
| Chỗ | Lỗi | Sửa |
|---|---|---|
| — | Không có lỗi chắc chắn | Không sửa tệp soạn |

Máy kiểm: `kiem-moi.mjs HS HS-E.txt <10 mã>` → 2 nhóm · 8 dạng · 21 ví dụ · 19 hình · **lỗi 0 · cảnh báo 0**.

## Cần CEO xem
- **C2.1.5 ranh giới (giữ từ GHI CHÚ trạm soạn):** mô tả JSON vẫn ghi "bốn phương án thuộc các loại khác nhau", trong khi VD3 mới (đúng với 5/6 câu đề thật) có hai phương án cùng loại nhất biến. Cần chốt mô tả mới mà trạm soạn đề xuất trong GHI CHÚ, hoặc chuyển các câu đó về C2.1.1–C2.1.4.
- **Kỹ thuật (không phải nội dung):** `k12-hs/ve.mjs` đặt cố định `id="kp"` (clipPath) và `id="mt"` cho mọi đồ thị. Khi nhiều đồ thị KHÁC kích thước nằm chung một trang HTML, trình duyệt dùng clipPath của đồ thị đầu tiên ⇒ đồ thị sau bị cắt cụt (lúc soát đã thấy nhánh phải của hình C2.1.5 VD3 bị cắt mất khi ghép chung trang với 4 hình C2.1.4). Nơi hiển thị sau này cần đổi id theo từng hình.
