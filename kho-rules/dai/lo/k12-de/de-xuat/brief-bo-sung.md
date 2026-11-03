# Brief BỔ SUNG nội dung bản đồ K12 (03/11, sau khi Thùy duyệt đợt 1)

Đã qua: Sonnet soạn → Opus soát (tệp `noi-dung/<CH>-<JOB>.txt`, biên bản `<CH>-<JOB>.soat.md`, GHI CHÚ cuối tệp). Thùy đã đọc và chốt (03/11): **"các đề xuất của m ok" + "các ví dụ còn thiếu m bổ sung đi"**. Việc của bạn: áp các quyết định bên dưới và **bổ sung ví dụ / lý thuyết cho mọi kiểu đề THẬT mà biên bản/GHI CHÚ đã ghi là "còn thiếu"** trong lượt của bạn.

Đọc trước: `kho-rules/dai/lo/k12-de/de-xuat/brief-soan-moi.md` (khuôn, định dạng, cú pháp hình, máy kiểm, phần BỔ SUNG), `brief-soat-moi.md`, tệp lượt của bạn + biên bản `.soat.md` + GHI CHÚ cuối tệp. `S` = `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad`; chạy lệnh từ Repo `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`.

## Quy tắc
1. **Bám đề thi**: chỉ bổ sung kiểu đề CÓ câu thật (xem `node S\cau-dang.cjs <CH> <id_dạng> 12`; ánh xạ `<CH>-cau.tsv`). Kiểu không có câu đề thật → không thêm, dù sách có.
2. Bổ sung = thêm một `##VD` (ví dụ 3) vào dạng thiếu (hoặc thêm ý a) b) vào ví dụ sẵn nếu hợp), và/hoặc bổ sung ý vào lý thuyết dạng. Dạng vẫn giữ ≥ 2 ví dụ; ví dụ mới thuộc kiểu đề thiếu, số liệu đẹp, KHÔNG chép đề thật, tự giải lại đầy đủ.
3. **Thử lại bằng số mọi ví dụ MỚI** bằng script node (đặt ở `S\bs\<CH>-<JOB>\`), kiểm hình mới (nếu có) khớp đề + lời giải. Không đụng phần đã soát đạt trừ khi quyết định dưới yêu cầu.
4. Trước khi sửa: chép tệp lượt sang `noi-dung/<CH>-<JOB>.truoc-bs.txt` (SDT: `SDT.truoc-bs.txt`). Sửa thẳng tệp lượt. Chạy `node kho-rules/dai/lo/k12-de/de-xuat/kiem-moi.mjs <CH> <tệp> <mã giao, KHÔNG chữ N>` tới lỗi 0. Cập nhật GHI CHÚ CHO CEO cuối tệp: xoá điểm đã giải quyết, ghi chỗ bạn thêm; kiểu đề thiếu mà bạn KHÔNG bổ sung kèm lý do (đề không có câu / quá lẻ).
5. Câu đề đã bị loại khỏi kho (kho rác) vì nghi sai: `T112010402145`, `T112020401365`, `T1120000004411`, `T1120000006168`, `T112020402008`, `T1120000003566`, `T1120000006707`, `T1120000005532`, `T1120000005624` — đừng dựa vào chúng.

## Quyết định của Thùy (đã chốt) — áp dụng nếu thuộc lượt của bạn
- **HS C2.5.3 tách 3 dạng:** C2.5.3 "GTLN, GTNN chứa tham số trong công thức" (viết lại cho hẹp đúng tên mới) · C2.5.5 "GTLN, GTNN của hàm ẩn f(u(x)) từ đồ thị, bảng của f hoặc f′" (MỚI) · C2.5.6 "Ứng dụng max–min: phương trình, bất phương trình chứa m, biểu thức nhiều biến" (MỚI, dạng hiếm). Mô tả trong `HS.json`. Dạng mới phải có đủ lý thuyết dạng + 2 ví dụ, đặt ngay sau khối C2.5.4 (thứ tự trong tệp: C2.5.3, C2.5.4, C2.5.5, C2.5.6 sau khối nhóm C2.5 và C2.5.1–C2.5.2).
- **HS C4.3.3** đổi tên: "Thang, sào, xe qua góc hành lang; độ chiếu sáng lớn nhất" (mô tả trong JSON). **HS C2.5.4**: bỏ "1/(f+m)" khỏi lý thuyết (đề không có); thêm ví dụ kiểu h(x)/f(x). **HS C3.2.1**: bỏ ý song song/vuông góc (đề không hỏi). **HS C2.3.2**: bỏ ý "điểm đối xứng qua tâm" (đề không hỏi) — sửa cả VD2 b). **HS C1.2.2** VD2 b): đổi hàm |x²−4x+3| sang hàm logarit (đề không có hàm trị tuyệt đối). **HS C1.5.1/C1.4**: không dùng f″ trong lý thuyết cực trị nếu đề không hỏi.
- **VT**: quy tắc cộng–trừ vectơ dạy ở C1.2 mà C1.1.2 cần → giữ thứ tự nhóm, NHẮC LẠI quy tắc trong lý thuyết C1.1.2. Bỏ "thể tích hình hộp" (C3.4.3) và "|MA−MB| lớn nhất" (C3.5.2) khỏi mô tả/lý thuyết; C4.3.2 theo mô tả MỚI trong `VT.json` (chỉ vectơ; mặt cầu/mặt phẳng/đường thẳng thuộc PP toạ độ); "vectơ pháp tuyến của (ABC)" chỉ nêu như kết quả của tích có hướng, không dùng phương trình mặt phẳng.
- **SDT (rà "bám đề thi")**: bỏ các ý đề không hỏi: giá trị ngoại lệ (Q1−1,5ΔQ…, 0 câu), hiệu chỉnh nhóm đã bỏ; giữ R ghép ≥ R gốc, rủi ro đầu tư (có đề). Rà TỪNG ý lý thuyết + ví dụ của 10 dạng: ý nào không ứng với kiểu câu đề thật (`cau-dang.cjs SDT <id> 12`) thì xoá; kiểu câu đề thật mà chưa phủ thì bổ sung (ví dụ). Chỗ ghi "Cần CEO xem" nào đã có quyết định ở đây thì xoá.
- Chung: quy ước "tiệm cận ngang khi ad−bc=0" theo SGK (có TCN y=a/c, không TCĐ); nhóm chứa Q_k = nhóm ĐẦU TIÊN có tích luỹ ≥ kn/4 (SGK).

## Trả lời cuối (≤120 từ)
Số ví dụ/ý thêm · dạng mới (nếu có) · số ví dụ mới đã tự thử bằng máy · máy kiểm lỗi 0 chưa · kiểu đề thiếu KHÔNG bổ sung (kèm lý do).
