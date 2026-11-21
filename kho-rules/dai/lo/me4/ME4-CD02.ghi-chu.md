# ME4 · CĐ2 "Lập số và quy tắc đếm" — ghi chú trạm soạn

Nguồn: `Sách lớp 4 ME.pdf` — đề PDF 12–14 (tr.14–16 in; Bài tập vận dụng B1–B20), hướng dẫn PDF 103–115 (tr.99–111 in).

## (a) Số bài / số câu
- 20 bài tập vận dụng (B1–B20). Đưa vào soạn **25 câu** từ B1–B18: B1 a,b,c · B2 a,b,c · B3 · B4 a,b · B5 · B6 · B7 · B8 · B9 · B10 · B11 a,b · B12 · B13 · B14 · B15 · B16 a,b · B17 · B18. Mọi ý nhiều ý (B1, B2, B4, B11, B16) đều độc lập nhau nên tách mỗi ý một câu, không có câu `gop_y`.
- Tệp đề `ME4-CD02.bai.json` có 32 bản ghi (20 bản ghi cả bài + 12 bản ghi ý).

## (b) HOÃN (2 bài, cùng lý do: CÓ HÌNH trong đề, theo §5 hình đề đi đường riêng)
- **B19** (chữ MATH xếp hình thoi, PDF 14 / tr.16 in): đề cần hình lưới chữ cái. `anh` đã ghi mô tả trong `bai.json`. Để tiện cho đường hình: hướng dẫn sách ở PDF 115 (tr.111), đáp số sách là **16 cách** (nhân 2×2×2×2; ghi lại để đối chiếu, KHÔNG đưa vào soạn).
- **B20** (đường đi của kiến A đến B, 3 hướng →, ↑, ↗, PDF 14 / tr.16 in): đề cần hình lưới có hai đường chéo. `anh` đã ghi mô tả. Hướng dẫn sách ở PDF 115 (tr.111), đáp số sách là **5 cách** (3+1+1); hướng dẫn tự dựng lại hình có đánh nhãn C, D, E, H.
Không có bài nào bị hoãn vì trang rách hay đáp án không đọc được: toàn bộ trang CĐ2 rõ nét.

## (c) Chỗ sách in sai / quy ước cần biết
- **B13 (đã đặt `ghi_chu_nghi`)**: đề "cộng nó với số viết theo thứ tự ngược lại" không nói rõ số viết ngược có được bắt đầu bằng chữ số 0 hay không. Sách hiểu số viết ngược cũng là số có 3 chữ số ("a và c khác 0") nên đáp số 170. Nếu cho phép chữ số hàng đơn vị bằng 0 (các số 500; 510; …; 590) thì máy tính ra **180**. Câu soạn theo cách hiểu của sách, Phần 1 có `**Chú ý:**` nêu quy ước; hàm kiểm máy dùng cùng quy ước.
- **B11**: đề "số tạo bởi 2 chữ số cuối" — sách tính cả trường hợp bắt đầu bằng 0 (ví dụ $\overline{cd}=05$ trong dãy 1000; 1001; …; 1009). Phần 1 của B11a có `**Chú ý:**` nêu rõ.
- **B6**: hướng dẫn sách chỉ xét "giả sử x là 2" rồi suy ra cả ba trường hợp; lời giải kho giữ nguyên lập luận của sách (đáp số $x=5$ được máy thử với x = 0..9: duy nhất x = 5 cho đúng 12 số và tổng 66660).
- **B3**: sách liệt kê đủ 24 số; Phần 2 giữ danh sách (máy đã đối chiếu từng số với tập hoán vị).
- **B15**: khung "Phân tích" của sách được chuyển vào Mấu chốt và các Bước của Phần 1 (Phần 2 bắt đầu từ việc đếm các số chia hết cho 3).
- Không phát hiện chỗ sách in sai đáp số trong CĐ2: toàn bộ 25 đáp số máy tự tính từ đề đều khớp sách.

## (d) `thieu_so_do`
Không có (không bài nào có sơ đồ đoạn thẳng).

## (e) Câu không có hàm kiểm máy
Không có — 25 câu đều có hàm trong `me4-kiem-cd02.mjs` (vét cạn mọi số 3–5 chữ số; B6 thử x = 0..9; B7 thử mọi bộ 4 chữ số có tổng 15 và kiểm tổng không đổi; B17, B18 đếm cặp người bắt tay trực tiếp). B19, B20 hoãn nên chưa có hàm.

## (f) Kết quả chạy kiểm
Dựng lô:
```
✔ 25 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0
→ kho-rules/dai/lo/me4/ME4-CD02.lo.json
```
Máy kiểm đáp số lên lô: **25 đạt · 0 `khong_dat` · 0 `khong_kiem_duoc`**.

Số `ghi_chu_nghi` = 1 (B13) · số `thieu_so_do` = 0 · dạng: 19 `cao`, 6 `vua` (B5, B10, B11a, B11b, B13, B16a; B11a/B11b chưa có dạng đúng tên, gán NDB03450 gần nhất — nếu hàng duyệt thấy thiếu dạng thì đề xuất dạng "Đếm số theo điều kiện so sánh hai nửa số").
