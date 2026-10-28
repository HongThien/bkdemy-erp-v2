KẾT LUẬN: ĐẠT

# Soát nbv-b1-c — NBV, giới hạn dãy số, phần C (trắc nghiệm)

- Số câu: 65 (đều `luyen`, `trac_nghiem`; giảng 0 · Đ/S 0). Nguồn có Câu 1–70; trạm soạn bỏ 25, 27, 32, 34, 58.
- Lệch đáp số Pha 1 (bản giải mù `nbv-b1-c.kiem.md`) so với JSON: **trước 0 / sau 0**. Mọi phương án được quét bằng máy (n = 1e7, tổng 200–500 số hạng).
- 3 câu LỆCH SÁCH đã xác nhận bằng máy, bản soạn đúng, giữ nguyên:
  - Câu 8: sách đánh "Chọn B" (= 0) nhưng lời giải sách ra $\lim u_n=2$ → **C** đúng.
  - Câu 61: sách đánh "Chọn D" (+∞) nhưng lời giải sách kết luận −∞ → **C** đúng.
  - Câu 50: sách chọn A (0,0977) do viết $u_9=50\cdot(1/2)^9$; đúng là $100\cdot(1/2)^9=0{,}1953125$ → **B** (độ lệch so với B là 1,25·10⁻⁵).
- Câu 37: nguồn in nhãn "B. 2 · B. 0 · C. +∞ · D. 4" (nhãn B lặp, B thứ hai gạch chân). Sắp lại A=2, B=0 đúng theo vị trí in; đáp án B (= 0) khớp cả "Chọn B" của sách.
- Câu 12: 8 + 2·24 = 56 m → C, khớp sách (biểu thức tổng riêng của sách in thiếu hệ số 16 nhưng đáp số đúng).
- Đề chuẩn hoá: đối chiếu từng câu với nguồn — giữ đủ số, dấu, số mũ, phương án. Câu 12 rút gọn lời dẫn (bỏ "Đoàn trường Nguyễn Khuyến…"), giữ đủ dữ kiện.

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b1-c-3 | lời giải (định dạng) | Mấu chốt viết `$dfrac{1}{sqrt{n}}$`, `$dfrac{1}{n}$` thiếu dấu `\` → `$\dfrac{1}{\sqrt{n}}$`, `$\dfrac{1}{n}$` |
| nbv-b1-c-2 | lời giải (Phần 1 lộ đáp án) | Mấu chốt "phát biểu sai là phát biểu bỏ sót điều kiện" + Bước 2 "căn bậc hai" chỉ thẳng vào B → viết lại Mấu chốt trung tính |
| nbv-b1-c-18 | lời giải (Phần 1 lộ đáp án) | Mấu chốt nêu nguyên văn "dần về 0 khi \|q\|<1" = phương án A → viết lại: xét vị trí của q so với −1 và 1 |
| nbv-b1-c-35 | lời giải (Phần 1 lộ đáp án) | Mấu chốt "giới hạn của tổng bằng tổng hai giới hạn" = phương án a+b → chỉ nêu "dùng quy tắc giới hạn của tổng, thử lại bằng dãy cụ thể" |
| nbv-b1-c-60 | lời giải (Phần 1 lộ đáp án) | như câu 35, với hiệu (a−b) |
| nbv-b1-c-40 | lời giải (Phần 1 lộ đáp số) | Mấu chốt "phân thức … dần về 0" = đáp số → chỉ nêu cách đi (giới hạn mẫu trước, rồi quy tắc thương) |
| nbv-b1-c-46 | lời giải (Phần 1 gợi đáp án) | Mấu chốt nhắm riêng "cơ số âm có trị tuyệt đối > 1" (chỉ phương án D có) → nêu chung "xét dấu và trị tuyệt đối của cơ số" |

Không sửa đáp số, đề, tách ý, `vai`, `dang_bai`. `kiem.mjs` ✔ đạt sau sửa. Bản trước khi sửa: `nbv-b1-c.goc.json`.

## Câu bỏ (trạm soạn) — kiểm lại trong nguồn

| Câu | Nguồn | Nhận xét |
|---|---|---|
| 25 | đề + 4 phương án đều là ảnh WMF | Lời giải sách lộ biểu thức $\lim\frac{2n+5}{3n+9}=\frac23$ nhưng không khôi phục được 3 phương án còn lại → bỏ đúng |
| 27 | đề + phương án A, C là ảnh | Lời giải sách lộ biểu thức $\lim\frac{7\cdot2^n+4^n}{2\cdot3^n+4^n}=1$; thiếu A, C → bỏ đúng (dựng lại được nếu đổi sang tự luận) |
| 32 | đề in thành "Tính $0$." | Phương án đủ (L=2/1/0/3); biểu thức chỉ còn trong dòng đầu lời giải $\lim\frac{n-1}{n^3+3}$ → **khôi phục được**, nhưng phải đoán đề từ lời giải ⇒ để CEO quyết |
| 34 | đề in thành "Tính giới hạn $3$." | Lời giải chỉ còn bước trung gian $\lim\frac{n^2}{3n^2+4}$, không chắc là đề gốc → bỏ đúng |
| 58 | $(u_n)$, $q$, $\|q\|<1$ là ảnh | Nghĩa đoán được ("cấp số nhân vô hạn có công bội q, \|q\|<1") nhưng phương án B và C in GIỐNG HỆT nhau ($S=\frac{-u_1}{1-q}$) → câu hỏng, bỏ đúng |

## Câu còn nghi / cần CEO

1. **Câu 32** — có thể khôi phục đề $\lim\dfrac{n-1}{n^{3}+3}$ (đáp án C, L=0) từ dòng đầu lời giải sách. Thêm hay bỏ? (Nhân chứng thứ hai duy nhất là chính lời giải sách.)
2. **Trùng câu trong cùng tệp**: 19 ≡ 65 (chỉ khác "a khác 0" và thứ tự phương án), 33 ≡ 38 (đảo thứ tự phương án). Giữ cả hai hay bỏ một khi nhập kho?
3. **Dạng của câu "chọn mệnh đề / chọn giới hạn bằng 0"** trộn nhiều dạng (10, 13, 36, 52, 56…): trạm soạn gán theo phương án ĐÚNG (vd 52 → NDB01151, 36/56 → NDB01148). Nếu áp DẠNG SAU THẮNG theo mọi phương án phải xét thì 10/56 → NDB01160, 36/52 → NDB01161. Tôi chưa đổi (không phải "sai rõ ràng"); cần Thùy chốt quy ước một lần cho mọi tệp trắc nghiệm.
4. Câu 2: phương án B "Nếu $\lim u_n=c$ thì $\lim\sqrt{u_n}=\sqrt c$" sai vì thiếu điều kiện $u_n\ge0$ — khớp sách (B). Không nghi, chỉ ghi để biết câu phụ thuộc cách hiểu "thiếu điều kiện = sai".
