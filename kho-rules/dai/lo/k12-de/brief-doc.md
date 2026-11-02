# Brief trạm ĐỌC — gắn CHƯƠNG + DẠNG cho câu đề thi K12 (03/11)

> Thùy 03/11: bản đồ K12 phải **bám vào ĐỀ THI** (khảo sát · giữa kì · cuối kì · thi thử tốt nghiệp · đề cương đã có trên ERP), không bám sách (nhiều câu sách không thi nữa). Bước 1 = đọc TOÀN BỘ câu đề thi của cả 6 chương Toán 12, gắn chương và dạng; sau đó đếm tần suất để đề xuất bản đồ.

Bạn đọc **một lô ~100 câu** (mỗi dòng là một câu đã khử trùng) và ghi kết quả vào một tệp TSV. Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`. Dữ liệu và kết quả nằm ở thư mục lô dưới (viết tắt `K`):
`K` = `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\k12de`

## Đọc
1. **Thực đơn dạng ứng viên:** `Repo\kho-rules\dai\lo\k12-de\thuc-don.md` — 6 chương: `HS` Hàm số · `NHTP` Nguyên hàm–Tích phân · `VT` Vectơ và hệ trục toạ độ · `XS` Xác suất có điều kiện · `SDT` Số đặc trưng mẫu ghép nhóm · `PPTD` Phương pháp toạ độ trong không gian · và `O` = ngoài 6 chương (kiến thức lớp 10/11, hoặc chương khác). Mỗi dòng "- mã tên" là một DẠNG ứng viên. **Thực đơn chỉ là gợi ý để gắn nhãn thống nhất — KHÔNG phải đáp án:** nó do người dựng từ sách/ bản đồ cũ, chưa kiểm bằng đề thi. Câu nào không khớp sạch dạng nào thì ghi `NEW` (xem dưới), đừng ép.
2. **Lô:** `K\lo-NNN.jsonl` (một câu / dòng JSON). Trường: `id` · `loai_cau` (trac_nghiem · dung_sai · tra_loi_ngan · tu_luan) · `noi_dung` · `lua_chon` (JSON, TN) · `menh_de` (JSON, câu Đúng–Sai a–d) · `dap_an` · `hinh` (có hình thật nhưng bạn không xem được — suy từ lời dẫn) · `loai_de` · `nam` · `hk` · `n_de` (số đề có câu này). KHÔNG có nhãn cũ — gắn nhãn thuần từ nội dung câu.

## Ghi `K\kq\lo-NNN.tsv` (UTF-8, tab, KHÔNG dòng tiêu đề, đúng 1 dòng / câu, đúng thứ tự lô)
`id` ⇥ `chuong` ⇥ `dang` ⇥ `mo_ta` ⇥ `muc` ⇥ `chac` ⇥ `ghi_chu`
- `chuong`: `HS` · `NHTP` · `VT` · `XS` · `SDT` · `PPTD` · `O` · `HONG` (đề hỏng/không đọc được).
- `dang`: mã dạng trong thực đơn của chương đó (vd `P1.3.1`) · với chương CHƯA có dạng (XS, SDT, một số nhóm của PPTD): `NHOM:<mã nhóm>` · không khớp sạch: `NEW` · không chắc chương: `?`.
- `mo_ta`: để trống nếu `dang` là mã khớp. Nếu `NEW`, `O` hoặc `?`: **MỘT cụm ≤ 14 từ** mô tả KIỂU câu (dấu hiệu đề + việc phải làm, KHÔNG nêu số liệu), chuẩn hoá để câu cùng kiểu có cùng cách viết (đọc lướt cả lô trước khi đặt tên, rồi dùng lại tên đã đặt). Với `O` ghi chủ đề (vd `lượng giác: giải phương trình`).
- `muc`: 1 nhận biết · 2 thông hiểu · 3 vận dụng · 4 vận dụng cao (ước theo độ phức tạp + vị trí câu trong đề thường gặp).
- `chac`: `1` nếu chắc chương và dạng · `0` nếu còn lưỡng lự (ghi lý do ngắn ở `ghi_chu`, vd "giữa dạng A và B").
- `ghi_chu`: để trống nếu không cần.
Câu Đúng–Sai (4 ý a–d) thường thuộc **một** dạng chủ đạo: gắn dạng chủ đạo, ghi `ghi_chu=DS nhiều ý` nếu 4 ý thuộc dạng khác hẳn nhau. Câu bài toán thực tế: gắn theo mô hình thực tế nếu thực đơn có dạng thực tế của chương, ngược lại theo kiến thức lõi.

## Cách làm
- Đọc từng câu thật kỹ (đề + lựa chọn/mệnh đề + đáp án) rồi mới gắn. Đừng gắn theo từ khoá đơn lẻ (vd "toạ độ" có ở cả Vectơ lẫn PP toạ độ; "đồ thị" ở cả Hàm số lẫn Nguyên hàm). Phân biệt: **VT** = vectơ trong không gian, toạ độ vectơ/điểm Oxyz, tích vô hướng/tích có hướng, hình hộp–lăng trụ–chóp bằng vectơ · **PPTD** = phương trình mặt phẳng, đường thẳng, mặt cầu trong Oxyz, vị trí tương đối, góc, khoảng cách.
- Không cần giải bài; nhưng cần hiểu câu hỏi đòi làm gì.
- Dùng công cụ Read để đọc lô (nếu quá dài đọc theo khoảng dòng), Write để ghi TSV một lần. Sau khi ghi, tự kiểm: đúng số dòng, mỗi dòng 7 cột, `id` khớp lô (có thể chạy `node -e` đếm).

## Trả lời cuối (≤ 80 từ)
Số dòng · phân bố chương (đếm) · số `NEW`/`?`/`HONG` · các kiểu `NEW` hay lặp (tên chuẩn hoá).
