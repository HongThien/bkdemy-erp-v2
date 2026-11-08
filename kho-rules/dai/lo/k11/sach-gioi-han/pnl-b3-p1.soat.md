KẾT LUẬN: ĐẠT

# Soát pnl-b3-p1 (PNL — Hàm số liên tục, phần 1)

- Số câu: 59 (bản soạn) → **60** sau soát (thêm C2). Tất cả `luyen`, 0 `giang`, 0 Đ/S, 0 câu chưa dạng.
- Lệch đáp số Pha 1 (giải mù) với bản soạn: **trước 0 / sau 0**. Cả 59 câu khớp đáp số/phương án của tôi; các câu LỆCH SÁCH đã được máy xác nhận bản soạn đúng (xem dưới).
- `kiem.mjs`: ✔ đạt (60 câu). Bản gốc trước khi sửa: `pnl-b3-p1.goc.json`.

## Phân xử các điểm trạm soạn nêu (bằng máy + đối chiếu nguồn `.txt`)

| điểm | phân xử |
|---|---|
| Bỏ TN2 (công thức mất) | **KHÔNG đồng ý** — lời giải sách đủ dựng lại hàm: $f(0)=0$, trái $x\to0$, phải $x^2+2\to2$ (giống cách đã dựng C4/C7/C8). Đã thêm `C2`, đáp án B (mệnh đề sai), dạng NDB01188 `vua`, ghi ĐỀ KHÔI PHỤC. |
| Bỏ TN10 (công thức mất) | Đồng ý — lời giải chỉ cho hai nhánh gần 0 ($\frac{\sqrt{1+2x}-1}{x}$, $x+2021$); không biết điểm chia, $f(0)$, và phương án B/D nhắc $x=3$, $x=1$ ⇒ hàm có thể có thêm nhánh/mẫu. Không dựng chắc được. |
| Bỏ TN3 (trùng TN21) | Đồng ý — nguồn: đề, 4 phương án, lời giải TN3 ≡ C21. |
| Dựng lại D1BT2 | Chắc: lời giải viết rõ $\lim_{x\to7}(-3x^2+2x+1)$ hai phía và $f(7)=5a+1$ ⇒ $x\ne7$ / $x=7$. |
| Dựng lại D2BT5 | Chắc: lời giải dùng phân thức cho $x\to-4^-$, $|mx|-\frac{41}{81}$ cho $x\to-4^+$ và $f(-4)$ ⇒ $x<-4$ / $x\ge-4$. Máy: lim trái $=40/81$ ✔, $m=\pm\frac14$ ✔. |
| Dựng lại C4 | Chắc: trái $2x^2-1$, phải $x+1$, $f(0)=1$ ⇒ $x<0$ / $x\ge0$. |
| Dựng lại C7 | Gần chắc: lời giải chỉ ghi "$\lim\ne f(1)\Leftrightarrow m\ne3$" ⇒ $f(1)=m$ (giả định duy nhất khớp). Nghi nhẹ. |
| Dựng lại C8 | Chắc: lim trái $(3x+m)=12+m=f(4)$ ⇒ $x\le4$ là $3x+m$. |
| D1BT2 LỆCH SÁCH | Bản soạn đúng: $-3\cdot49+14+1=-132$ (sách −125 là lỗi số học) ⇒ $a=-\frac{133}{5}$ (sách $-\frac{126}{5}$). |
| D1BT5 LỆCH SÁCH | Nguồn: đề in $m^2+5m$, lời giải sách dùng $f(1)=2m+3$. Giải theo đề in: lim phải $=\frac13$ (máy ✔), gián đoạn ⇔ $m\ne\frac{-15\pm\sqrt{237}}6$. Giữ. |
| D3BT6 LỆCH SÁCH | Nguồn: đề in $2x^2$, lời giải $3x^2$ (f(−3)=−32, f(1)=−12, f(2)=8 khớp $3x^2$). Với $2x^2$: f(−3)=−41, f(0)=10, f(1)=−13, f(2)=4 ⇒ ba khoảng $(-3;0),(0;1),(1;2)$ (máy ✔). Kết luận như nhau. Giữ. |
| D3BT7/D3BT8 → NDB01201 | Đồng ý (phương trình chứa tham số $a,b(,c)$ luôn có nghiệm; cách 4 điểm có tổng 0 chỉ dùng định lí giá trị trung gian). Giữ `vua`. |
| `kiem` yếu | Đã viết lại kiểm thật (xem bảng sửa). Các `kiem` khác: đã đọc, đều tính lại từ đề (giới hạn số hai phía, thay lại tham số, chia đôi tìm nghiệm thật cho D3BT3/9/10). |

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| C2 (mới) | soạn bỏ nhầm câu dựng lại được | thêm câu đủ trường, đáp án B, kiem kiểm cả 4 mệnh đề |
| C25 | lời giải: Phần 1 Bước 2 lộ đáp án qua loại trừ ("loại phương án chứa tan, cot, 1/sin" ⇒ còn A) | viết lại bước thành câu hỏi chung, không chỉ phương án |
| D2BT5 | lời giải: Phần 2 thiếu bước quy về điểm ghép (mẫu ≠ 0 khi $x<-4$, liên tục trên từng khoảng) | thêm 1 dòng đầu Phần 2 |
| D1BT2 | ghi_chu: `cdot` mất dấu `\` | sửa thành `\cdot` |
| C11, C23, C24, C25, C26 | kiem chỉ `true` | kiểm liên tục bằng số (giá trị hữu hạn + không nhảy hai phía tại các điểm mẫu, gồm điểm kì dị) cho cả 4 phương án, so khớp mẫu đúng/sai |
| C1, C7 | kiem gần tautology | C7: tính lim bằng số rồi đối chiếu 4 phương án; C1: đối chiếu 4 phương án với giới hạn đề cho |
| D1BT2 | kiem cứng số | tính lim hai phía từ hàm, thay $a=0$ và $a=-133/5$ |

Soát thêm, KHÔNG phải sửa: đề chuẩn hoá khớp nguồn ở mọi câu đối chiếu (số, dấu, nhánh, điều kiện); tách ý D1BT1a–h, D2BT1a–c, D2BT2a–b đúng (ý độc lập); D1BT2 giữ nguyên bài (ý b dùng chung hàm); dạng đúng `dich.md` (01187/01188/01191/01193/01194/01195/01196/01197/01199/01200/01201) và luật dạng sau thắng; lời giải đúng toán, không L'Hôpital/đạo hàm, ĐKXĐ có ở D3BT9/D3BT10, dùng `\cdot`, kết "Vậy …"/"Chọn X."; D1BT1h trùng nội dung e) (sách in cả hai) — giữ, đã ghi chú.

## Câu CÒN nghi — cần CEO

1. **D1BT5** — sách: đề $f=m^2+5m$ (x≤1) nhưng lời giải dùng $2m+3$ ⇒ $m\ne-\frac43$. Bản kho: theo đề in ⇒ $m\ne\frac{-15\pm\sqrt{237}}6$ (đáp số xấu). Thùy chọn: giữ đề in, hay sửa đề thành $2m+3$ cho khớp lời giải sách (đáp số đẹp $m\ne-\frac43$)?
2. **D3BT6** — đề in $2x^2$, lời giải sách $3x^2$; kết luận như nhau, kho giải theo $2x^2$. Chỉ cần đối chiếu bản gốc nếu muốn đổi đề.
3. **Câu đề dựng lại** (D1BT2, D2BT5, C2, C4, C7, C8) — công thức trong Word bị mất; dựng từ lời giải. C7 nghi nhẹ nhất ($f(1)=m$ là giả định). Cần người nhìn bản gốc 1 lượt.
4. **TN10** bỏ — muốn nhập thì cần bản gốc (công thức mất, không dựng được).
