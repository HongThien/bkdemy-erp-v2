# ME4 · CĐ7 — Dấu hiệu và tính chất chia hết

Nguồn: `Sách lớp 4 ME.pdf`. Đề: PDF 34–36 (in tr.38–40, phần B "Bài tập vận dụng"). Hướng dẫn: PDF 139–143 (in tr.135–143). Trang quét sạch, đọc được hết, không có trang rách.

## (a) Số bài / số câu
- Bài tập thấy trong đề: **18** (Bài 1–18), không phải 15 như ghi trong lời giao việc; hướng dẫn cũng có đủ 18 bài.
- Bản ghi đề `ME4-CD07.bai.json`: 38 (18 bài + 20 bản ghi ý: B1 a b, B4 a b, B5 a–d, B6 a b, B7 a b, B12 a–d, B16 a b, B18 a b).
- Câu đưa vào soạn / lô: **30** = 10 bài đơn (B2, 3, 8, 9, 10, 11, 13, 14, 15, 17) + 20 ý tách. Mọi bài nhiều ý đều có các ý độc lập (mỗi ý tự giải được, không dùng kết quả ý khác) nên tách hết, không có câu `gop_y`.

## (b) HOÃN
Không có. Cả 18 bài đều có đáp số/kết luận rõ trong sách, không bài nào có hình trong ĐỀ. Bài "giải thích có thể hay không" (B13, B14, B15, B16a, B16b) và B1a đều có kết luận gọn nên có `dap_an` ngắn ("Không"; "Có ; mỗi cạnh xếp 3 đoạn dài 25 cm và 5 đoạn dài 21 cm"; "Không có chữ số nào").

## (c) Chỗ sách có vẻ in sai / đề–đáp án lệch / cách hiểu đề
- Không phát hiện đáp số sách sai. Mọi đáp số máy tự tính từ đề đều khớp sách (30/30).
- **B11** (số đại biểu): đề viết "Nếu mỗi dãy bố trí 5 người 1 ghế thì có 1 người ngồi riêng một mình". Sách hiểu là TOÀN BỘ số đại biểu chia cho 5 dư 1 (đáp số 36). Nếu hiểu "mỗi dãy" dư 1 người thì ra cặp khác (12, 42). Đã theo sách (36); không đặt `ghi_chu_nghi` vì cách đọc của sách là cách đọc tự nhiên của "một người ngồi riêng một mình"; trưởng khối cần thì xem lại.
- **B1a** sách kết luận "Không có chữ số nào" (cả hai chữ số 0 và 5 đều bị loại) — khớp máy.
- **B16b**: sách chỉ nêu cách xếp bằng cách chia đều 12 và 20 que cho 4 cạnh. Máy xác nhận cách chia đều (mỗi cạnh 3 que 25 cm và 5 que 21 cm, dài 180 cm) là cách DUY NHẤT dùng hết que.
- **B12d** sách ghi "b khác 0" khi loại chia hết cho 5; giữ nguyên. Máy thử b = 2, 4, 6, 8 đều cho cùng kết quả.
- Các chỗ Phần 2 có thêm một câu giải thích để lời giải không nhảy bước (giữ nguyên phép tính, đáp số của sách): B2 và B6a/B6b ("$a+25$ / $*+13$ / $*+20$ nằm trong khoảng nào, chỉ một giá trị chia hết cho 9"), B8 (chia 5 dư 2 nên tận cùng 2 hoặc 7, chia 2 dư 1 nên là 7; hai hàng giữa bằng 0), B15 (số vở thưởng mỗi loại = số bạn nhân số vở mỗi bạn nhận).
- Sách dùng "→" trong lời giải; đã đổi sang chữ ("nên", "suy ra", "loại") theo luật Thùy 21/11.

## (d) `thieu_so_do`
Không câu nào (CĐ7 không có bài tổng–hiệu / số phần).

## (e) Không có hàm kiểm máy
Không. Cả 30 câu đều có hàm trong `me4-kiem-cd07.mjs`. Lưu ý mức "bằng chứng" của máy ở bài lập luận:
- B13 (duyệt mọi số mảnh đạt được từ 3, mỗi lần +4), B14 (duyệt mọi cách gán 5 chữ cái, chữ đầu khác 0, cho phép trùng chữ số), B15 (tìm nghiệm nguyên dương của 21g + 18k = 200): kiểm bằng vét cạn nên là bằng chứng thật.
- B16a: máy chỉ kiểm điều kiện cần (tổng độ dài các que phải chẵn vì chu vi hình chữ nhật chẵn), không dựng thử mọi cách xếp. Đáp số "Không" của câu này do đó chỉ có nhân chứng là điều kiện cần.

## (f) Kết quả chạy kiểm (lần cuối)
- Dựng lô: `✔ 30 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm lên lô: **30 `dat`**, **0 `khong_dat`**, **0 `khong_kiem_duoc`**.
- `ghi_chu_nghi`: 0. `thieu_so_do`: 0.
- Dạng (`ME4-CD07.dang.json`): NDB03473 cho B1a, B1b, B2, B3, B4a, B4b (viết thêm / tìm chữ số để chia hết cho 12, 36, 45, 225; `vua` ở B1, B3 vì cũng hợp NDB01533 / NDB00653 / NDB03472) · NDB01534 cho B5a–d (`vua`, còn NDB00656) · NDB00655 cho B6a, B6b · NDB01536 cho B7a, B7b · NDB01506 cho B8 (`vua`, còn NDB01536) · NDB01539 cho B9, B10 (B11 `vua`) · NDB03474 cho B12a–d · NDB03475 cho B13, B14, B15 (B16a, B16b `vua`) · **"—" (THIẾU DẠNG) cho B17** (lời văn dùng chia hết cho 4 của số trứng đã bán) **và B18a, B18b** (thêm / bớt ít nhất bao nhiêu đơn vị để số 55…5 chia hết cho 15, 45; gần nhất NDB01535). Bản đồ có nhiều dạng chồng nhau ở nhóm "Ứng dụng tính chất chia hết" (NDB01533 / 00653 / 00654 / 00655 / 03472 / 03473): nên để trưởng khối xem lại ranh giới.
