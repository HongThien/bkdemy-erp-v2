# ME4 · CĐ1 "Viết số theo điều kiện cho trước" — ghi chú trạm soạn

Nguồn: `Sách lớp 4 ME.pdf` — đề PDF 7–8 (tr.9–10 in), hướng dẫn PDF 97–102 (tr.93–98 in; tr.97 nằm ở PDF 102, sau tr.98 ở PDF 101 vì scan đảo thứ tự).

## (a) Số bài / số câu
- 10 bài tập vận dụng (B1–B10), tách ý theo §A7 thành **29 câu** (B1 a–d · B2 a–d · B3 a,b · B4 a–d · B5 a,b · B6 a–c · B7 a,b · B8 a,b · B9 a–d · B10 a,b). Mọi ý độc lập nhau nên không có câu `gop_y`.
- Tệp đề `ME4-CD01.bai.json` có 39 bản ghi (10 bản ghi cả bài + 29 bản ghi ý).

## (b) HOÃN
Không có. Không bài nào có hình trong đề. Không câu nào bị bỏ vì đáp án không đọc được (xem (c) về trang rách).

## (c) Chỗ sách có vẻ in sai / chỗ cần biết
- **Trang rách (PDF 101–102, Bài 9–10)**: vết rách và băng dính nằm ở mép phải / giữa trang nhưng đáp án của cả 6 ý (B9 a–d, B10 a–b) đọc được trọn vẹn; riêng chữ số cuối "5" của số lớn nhất B10b bị băng dính phủ nhẹ ("…2014201[5]"). Máy tự tính độc lập từ đề ra đúng chuỗi 44 chữ số `42052006200720082009201020112012201320142015` nên giữ câu, `ghi_chu_nghi` để `null`. Nếu hàng duyệt muốn chắc hơn thì mở lại ảnh PDF 101 (hàng cuối trang in 98).
- **B9 b, d và B10 b — đáp số xoá chữ số**: sách ghi "01111111 hay 1111111" (B9) và "000…0010 2011… hay 1020112012201320142015" (B10). Theo luật Thùy 21/11 (Đ4) `dap_an` bỏ số 0 đứng đầu: `$1111111$` và `$1020112012201320142015$`. Phần 2 ghi dòng trung gian "Số còn lại là 01111111, bỏ chữ số 0 đứng đầu thì …"; Phần 1 có `**Chú ý:**` nói chữ số 0 đứng đầu không phải cách viết số tự nhiên, **không** nêu chữ số cụ thể (để không lộ đáp số trong Phần 1 theo A18).
- **Đề B10 in rút gọn**: "200020012002...20092015" (bỏ 2010–2014 và chỉ viết "2009 2015"), nhưng câu hỏi và hướng dẫn đều dùng đủ 16 số 2000–2015 (64 chữ số). Đề chép đúng như in; lời giải dùng đủ 16 số.
- **Hướng dẫn B10b in nhầm số lần xoá**: đoạn tìm số lớn nhất ghi "sau khi xoá đi 12 chữ số" (đúng phải là 20 chữ số — các câu sau trong cùng đoạn đều nói 20). Lời giải kho dùng 20.
- **B3b**: đề "số đó có 2 chữ số 1 và từ chữ số thứ ba trở đi…" — sách hiểu hai chữ số ĐẦU đều là 1 (hướng dẫn: "2 chữ số ở 2 hàng cao nhất là 1;1"). Máy thử cả hai cách đọc ("hai chữ số đầu là 1;1" và "có đúng hai chữ số 1") đều cho 112358. Phần 1 có `**Chú ý:**` nêu cách hiểu.
- Sách viết "hàng tỷ" (B1d); kho dùng "hàng tỉ".
- Lời giải B1c, B2b, B6b: sách không giải thích vì sao hàng đơn vị lại là chữ số đó; Phần 2 thêm đúng một dòng giải thích ("chữ số lẻ bé nhất chưa dùng", "chữ số chẵn bé nhất", …) — không đổi phép tính, không đổi đáp số.

## (d) `thieu_so_do`
Không có (không bài nào là tổng–hiệu, tổng–tỉ, tuổi…).

## (e) Câu không có hàm kiểm máy
Không có — cả 29 câu đều có hàm trong `me4-kiem-cd01.mjs` (vét cạn mọi số / mọi dãy con; B10b dùng tham lam có kiểm chéo với vét cạn trên chuỗi ngắn; B3b thử hai cách đọc).

## (f) Kết quả chạy kiểm
Dựng lô:
```
✔ 29 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0
→ kho-rules/dai/lo/me4/ME4-CD01.lo.json
```
Máy kiểm đáp số lên lô: **29 đạt · 0 `khong_dat` · 0 `khong_kiem_duoc`**.

Số `ghi_chu_nghi` = 0 · số `thieu_so_do` = 0 · dạng: 24 `cao`, 5 `vua` (B5a, B5b, B6a–c — dạng NDB01507, mô tả dạng nói "cho số chữ số" mà đề không cho).
