# ME4 · CĐ10 Phân số — ghi chú trạm soạn

Nguồn: `Sách lớp 4 ME.pdf`. Đề: PDF 49–63 (trang in 51–65; Bài tập vận dụng ở PDF 58–63). Hướng dẫn: PDF 167–187 (trang in 163–183; CĐ10 Bài 1 bắt đầu ở cuối PDF 167).

## (a) Số bài / số câu
- 25 bài tập (B1–B25). 21 bài nhiều ý, tách mỗi ý một câu (mọi ý độc lập, không ý nào dùng kết quả ý trước): B1 2 ý · B2 4 · B5 3 · B8 3 · B9 2 · B13 2 · B14 6 · B15 5 · B17 4 · B18 5 · B19 4 · B20 5 · B21 2 · B22 2 · B23 6 · B24 2 · B25 2. Các bài một ý: B3, B4, B6, B7, B10, B11, B12, B16.
- `bai.json`: 84 bản ghi (25 bài + 59 ý). `soan.json`: 67 câu. Dạng: 40 `cao`, 24 `vua`, 3 `—` (B14c, B14d, B14e).

## (b) HOÃN
Không có. Cả 25 bài có đề đọc rõ (đã phóng to các bài nhiều chữ số: B1b, B10, B16, B19, B20, B23) và lời giải của sách đọc được.
Trang hướng dẫn nhàu, rách ở PDF 175–178 (trang in 171–174: Bài 16–20) nhưng chỉ mất mép trang, chữ và số vẫn đọc rõ; mọi đáp số đọc từ đó đều được máy kiểm tính lại từ đề và khớp.

## (c) Chỗ sách có vẻ in sai / mơ hồ
Không phát hiện đáp án sách lệch với máy (67/67 khớp). Các điểm cần người duyệt biết:
1. **B9a, B9b (đề mở)**: "Tìm 7 phân số nằm giữa…", "Tìm 8 phân số nằm giữa…" có vô số đáp án đúng. `dap_an` giữ đáp án của sách (mẫu số chung 72 và 36); máy kiểm tính ra đúng tập này (mẫu số chung nhỏ nhất đủ số lượng). Đáp án khác (mẫu số khác) cũng đúng nhưng máy không nhận ra. Đã ghi một câu `**Chú ý:**` ở Phần 1 nói "bài có nhiều đáp án".
2. **B13a, B13b**: sách ngầm hiểu mẫu số $327-x$ là số tự nhiên khác 0 (nên $x\le 326$). Đề chỉ nói $x$ là số tự nhiên; nếu cho $x>327$ thì mẫu số âm (không thuộc lớp 4). Giữ cách hiểu của sách; máy kiểm quét $x$ từ 0 đến 326. Phần 1 có nhắc "mẫu số phải là số tự nhiên khác 0".
3. **B22a, B22b (chứng tỏ)**: không có kết quả số; `dap_an` ghi kết luận bất đẳng thức của sách (`$A<1$`, `$B<\dfrac{1}{2}$`). Máy kiểm tính chính xác tổng của dãy rồi so sánh với 1 và 1/2.
4. **B14c, B14d, B14e**: so sánh hai phân số lớn hơn 1 bằng "phần hơn" (tách $1+\dots$ hoặc $2+\dots$) — bản đồ chỉ có dạng phần bù cho phân số bé hơn 1. Để `dang = —`. Đề xuất dạng mới: "So sánh phân số bằng phần hơn (hai phân số lớn hơn 1, tử số hơn mẫu số cùng một số đơn vị / cùng phần nguyên)"; dạng gần nhất NDB01562; câu làm chứng B14c, B14d, B14e; không gộp vào NDB01562 vì ở đó mô tả chỉ cho phân số bé hơn 1.
5. **B15a–e**: tìm $x$ trong biểu thức có phân số; chưa có dạng riêng, gán tạm NDB03460 (`vua`). Đề xuất dạng mới "Tìm $x$ trong biểu thức có phân số (quy tắc tìm thành phần chưa biết)", câu làm chứng B15a–e.
6. **B24a, B25a, B23b, B23c**: sách nhân cả hai vế với một số (hoặc phân số) rồi tách hiệu. Giữ nguyên cách của sách (luật "ghép, không giải lại"); đề có sẵn chữ $y$ nên không vi phạm bảng cấm tiểu học.
7. Sách dùng gạch chéo để rút gọn ở B18, B19: đã viết thành lời "Rút gọn các thừa số … giống nhau ở tử số và mẫu số".
8. B19d: hướng dẫn của sách đánh dấu "d*)" (bài khó), đề in "d)". Không ảnh hưởng.

## (d) `thieu_so_do`
Không câu nào. B11 (thêm $x$ vào tử và mẫu của $\dfrac{39}{64}$) có `so_do_mo_ta`: sơ đồ hai đoạn thẳng "Tử số mới 3 phần, Mẫu số mới 4 phần, hiệu 25", máy vẽ được (không bị từ chối số lệch). Các bài khác không có sơ đồ đoạn thẳng trong sách.

## (e) Bài không có hàm kiểm máy
Không. 67/67 câu có hàm kiểm tính từ đề bằng phân số BigInt chính xác:
- Các dãy có "…": máy dựng dãy theo quy luật rồi kiểm khớp đúng các số hạng đề in (đầu và cuối) trước khi cộng (B19c, B19d, B20, B23, B24, B25).
- Tìm $x$, $y$: quét lưới số hữu tỉ (B15, B21a) hoặc quét số tự nhiên rồi thay ngược (các bài còn lại).
- B16: vét cạn $\overline{ab}$ (10–99), $n$ (1–200), $m$ (0–400) thoả "kết quả sai = 29/38" rồi tính hiệu đúng, kiểm hiệu đúng chỉ có một giá trị.
- B9a, B9b: xem (c).1. B22: xem (c).3.

## (f) Kết quả chạy kiểm + lô (lần cuối)
- Dựng lô: `✔ 67 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0` (KaTeX sạch, sơ đồ B11 được máy vẽ chấp nhận).
- Máy kiểm: `lo 67 khong dat/khong kiem duoc 0` — tất cả 67 câu `dat`.
- Phần 1 mọi câu qua `kiemP1` (card 3–6 bước) và quét ký tự cấm (`→ ⇒ ∈ ≤ ≥ …`, `\frac`, in nghiêng) không lỗi; `ME4-CD10.dang.json` đủ 67 câu, mã dạng đều có trong `ban-do-4t.txt`.
