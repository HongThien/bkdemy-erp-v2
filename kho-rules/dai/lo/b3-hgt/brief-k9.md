# Brief B3 HGT K9 — xếp câu Tỉ số lượng giác lớp 9 vào DẠNG BÀI của bản đồ mới (spec-ban-do-4-tang.md §13)

Bạn xếp câu hỏi Toán lớp 9 (kho Hình giải tích = Tỉ số lượng giác / hệ thức lượng trong tam giác vuông) vào **dạng bài** của bản đồ kiến thức mới.
Kết quả là ĐỀ XUẤT cho CEO duyệt; **thà để "vua"/trống còn hơn gán sai** — gán sai ở mức "cao" là lỗi nặng nhất.

## Đầu vào (thư mục `kho-rules/dai/lo/b3-hgt/k9-2310/`)
- `bang-dich.md` — bảng đích: 11 dạng bài (mã `NDBxxxxx`), xếp theo Chuyên đề › Nhóm bài, kèm mô tả + ví dụ. ĐỌC HẾT trước khi làm lô đầu.
- `lo-NN.json` — mảng câu: `ma_cau`, `loai`, `de`, có thể có `lua_chon`, `dap_an`, `loi_giai` (cắt ngắn), `co_hinh` (đề có hình bạn không thấy), `ban_sao` (bản sao số liệu của một câu khác — xếp như câu thường), `goi_y_cu` (nhãn bản đồ CŨ — chỉ tham khảo).
- CHỈ đọc brief này, `bang-dich.md` và các lô được giao. KHÔNG mở file nào khác.

## Cách xếp
1. Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng phương pháp gì (đọc lời giải) — đối chiếu mô tả + ví dụ. KHÔNG xếp theo từ khoá bề mặt.
2. **DẠNG SAU THẮNG (luật CEO, mọi khối):** câu hợp cả 2 dạng ⇒ chọn dạng đứng SAU trong bảng đích (chuyên đề sau → nhóm sau → dạng sau), mức `cao` nếu chỉ vướng đúng chỗ này. Thứ tự = thứ tự xuất hiện trong `bang-dich.md`.
3. Câu nhiều ý (a, b, c…): xếp theo ý trọng tâm / phần lớn các ý; các ý rải ≥2 dạng khác hẳn nhau ⇒ áp luật 2 (dạng sau), mức `vua`.
4. Mức độ chắc:
   - `cao` — khớp rõ mô tả/ví dụ của một dạng (hoặc vướng 2 dạng và đã áp "dạng sau thắng").
   - `vua` — dạng hợp nhất còn chưa chắc; nội dung phụ thuộc hình (`co_hinh`) mà chữ không đủ; câu trộn nhiều dạng.
   - trống (`dang_bai_id: null`, `chac: null`) — không dạng nào khớp. `ly_do` **bắt đầu bằng đúng một nhãn** rồi dấu hai chấm:
     `KHÔNG THUỘC CHỦ ĐỀ: <chủ đề thật>` · `THIẾU DẠNG: <gợi ý tên dạng nên có>` · `THIẾU HÌNH: …` · `ĐỀ LỖI: …`
5. `dang_bai_id` phải là mã CÓ trong `bang-dich.md`. Không bịa mã. `ly_do`: 1 câu tiếng Việt ≤ 25 từ.

## Đầu ra
Với mỗi `lo-NN.json`, ghi `out-NN.json` cùng thư mục: mảng JSON, **mỗi câu đầu vào đúng 1 phần tử, đủ số câu, đúng thứ tự**:
```json
[{"ma_cau": "T309...", "dang_bai_id": "NDB01358", "chac": "cao", "ly_do": "..."}]
```
Tự xếp từng câu bằng suy xét (không viết script xếp theo từ khoá). Nếu cần script để ghi file thì để nó trong thư mục nháp RIÊNG của bạn (tên có số lô), đừng dùng chung với ai.
Cuối cùng trả lời ngắn: mỗi lô bao nhiêu câu cao / vua / trống. Không làm gì khác (không sửa file khác, không ghi DB).
