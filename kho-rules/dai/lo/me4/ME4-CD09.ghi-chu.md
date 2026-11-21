# ME4 · CĐ9 Dãy số — ghi chú trạm soạn

Nguồn: `Sách lớp 4 ME.pdf`. Đề: PDF 43–48 (trang in 45–50; Bài 1 ở PDF 45, Bài 20 ở PDF 48). Hướng dẫn: PDF 155–167 (trang in 151–163; PDF = trang in + 4 ở phần hướng dẫn, khác phần đề).

## (a) Số bài / số câu
- 20 bài tập (B1–B20). 11 bài nhiều ý (B1 9 ý · B2 2 · B4 4 · B5 3 · B6 3 · B7 2 · B11 2 · B14 3 · B17 2 · B18 2 · B19 3), tách mỗi ý một câu (ý độc lập, không ý nào dùng kết quả ý trước).
- `bai.json`: 55 bản ghi (20 bài + 35 ý). `soan.json`: 44 câu. Dạng: 34 `cao`, 10 `vua`.

## (b) HOÃN
Không có. Cả 20 bài đều có đề đọc rõ và lời giải sách đọc được.
- B3 (ô điền) và B20 (bảng 4 cột ngoằn ngoèo) là bảng số thuần chữ nên chép thành chữ, `anh: []`. B3 chép là "Dãy gồm 10 ô liền nhau, từ trái sang phải: …; 996; …; …; …; 496; …; …; …; …" (số ô và vị trí 996, 496 lấy từ ảnh đề và đối chiếu bảng đáp án của sách). B20 chép theo hàng (4 hàng đầu + "các hàng tiếp theo").

## (c) Chỗ sách có vẻ in sai / mơ hồ
1. **B10 (đề)**: ảnh in `Viết liên tiếp các số tự nhiên 1235678…` (thiếu chữ số 4). Hướng dẫn của sách viết `12345678…99100101…`. Đã chép đề thành `12345678…`, kèm `ghi_chu_nghi` để trưởng khối thấy.
2. **B17 (đề)**: "từ chữ số thứ 11 của số đó xuất hiện 3 chữ số 1 liền nhau". Tính chặt thì ba chữ số 1 bắt đầu ở chữ số thứ 12 (chữ số thứ 10 là `1`, thứ 11 là `0` của số 10). Sách đếm vị trí kiểu "đã viết 11 chữ số thì tới nhóm". **B17b** sách trả lời 555 theo đúng cách đếm đó (555 chữ số đã viết xong số 221, năm chữ số 2 bắt đầu ngay sau); tính chặt là chữ số thứ 556. Đã giữ 555 theo sách, trong Phần 1 có `**Chú ý:**` nói đề đếm theo cách này; hàm kiểm lấy cách đếm từ chính câu dẫn của đề (nhóm 111 bắt đầu sau 11 chữ số) rồi áp cho nhóm 22222 — ra 555, khớp sách. Không đặt `ghi_chu_nghi` (đọc chắc, chỉ khác quy ước đếm).
3. **B19b (đề mơ hồ)**: "Người ta đếm được trong dãy có 100 chữ T. Hỏi có bao nhiêu chữ I, bao nhiêu chữ A?" Sách hiểu là dãy gồm đủ 50 nhóm trọn vẹn (100 chữ I, 50 chữ A). Nếu dừng đúng ở chữ T thứ 100 (chữ T của tiếng TAM, nhóm thứ 50) thì chưa viết GIOI nên được 98 chữ I, 49 chữ A. Máy kiểm viết theo nghĩa đen ra 98 ; 49 ⇒ `khong_dat`; đã đọc lại đề và đáp án (đề không nói rõ), giữ `dap_an` theo sách, đặt `ghi_chu_nghi`.
4. B18b: sách ghi "chữ cái thứ 1491 được tô màu Vàng hay chữ V thứ 150..." — không sai, chỉ là cách nói "hay". Giữ đáp án Vàng ; Vàng.

## (d) `thieu_so_do`
Không câu nào (CĐ9 không có bài cần sơ đồ đoạn thẳng). `so_do_mo_ta` = null cả 44 câu.

## (e) Bài không có hàm kiểm máy
Không. 44/44 câu có hàm. Bài "tìm quy luật" (B1a–i, B6a): máy thử một quy luật, kiểm quy luật tái tạo đúng các số đề cho rồi sinh 3 số tiếp (kiểm "quy luật hợp lý" chứ không chứng minh quy luật là duy nhất).

## (f) Kết quả chạy kiểm + lô (lần cuối)
- Dựng lô: `✔ 44 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0` (KaTeX sạch).
- Máy kiểm: `TỔNG 44 câu: dat 43 · khong_dat 1 · khong_kiem_duoc 0`
  - `CĐ9 · B19b khong_dat máy tính ra 98 ; 49 — đáp án thiếu/khác: 98 ; 49` — xem (c).3, `dap_an` giữ theo sách, có `ghi_chu_nghi`.
- Phần 1 mọi câu qua `kiemP1` (card 3–6 bước) và quét ký tự cấm (`→ ⇒ ∈ ≤ ≥ …`) không lỗi.
