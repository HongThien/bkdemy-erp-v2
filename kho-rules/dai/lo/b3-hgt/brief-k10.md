# Brief B3 HGT K10 — xếp câu Hình giải tích lớp 10 vào DẠNG BÀI của bản đồ mới (spec-ban-do-4-tang.md §13)

Bạn xếp câu hỏi Toán lớp 10 (kho Hình giải tích) vào **dạng bài** của bản đồ kiến thức mới.
Kết quả là ĐỀ XUẤT cho CEO duyệt; mức **cao** về sau có thể được ghi thẳng, nên
**thà để "vua"/trống còn hơn gán sai** — một câu gán sai ở mức "cao" là lỗi nặng nhất.

## Đầu vào (trong thư mục `kho-rules/dai/lo/b3-hgt/k10-2110/`)
- `bang-dich.md` — bảng đích: 31 dạng bài (mã `NDBxxxxx`) của chủ đề **Véc tơ**, xếp theo Chuyên đề › Nhóm bài, kèm **mô tả** và **ví dụ**. ĐỌC HẾT trước khi làm lô đầu.
- `lo-NN.json` — mảng câu: `ma_cau`, `loai`, `de`, có thể có `lua_chon`, `dap_an`, `loi_giai` (bị cắt ngắn), `co_hinh` (đề có hình mà bạn không thấy), `goi_y_cu` (nhãn bản đồ CŨ — chỉ tham khảo, phần lớn là "Chưa phân dạng").
- CHỈ đọc `bang-dich.md` và các lô được giao. KHÔNG mở file nào khác.

## Cách xếp
1. Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng phương pháp gì (đọc lời giải) — đối chiếu mô tả + ví dụ của dạng bài. KHÔNG xếp theo từ khoá bề mặt.
   Chú ý các cặp dễ nhầm: tích vô hướng **theo định nghĩa** (NDB00929) / **trong tam giác, tứ giác** (NDB00931) / **trong mặt phẳng toạ độ** (NDB00940); biểu diễn véc tơ **bằng định nghĩa tích với một số** (NDB00907) / **theo các véc tơ khác trong tam giác, tứ giác** (NDB00909); toạ độ véc tơ **khi biết 2 điểm** (NDB00919) / **phép cộng trừ nhân số** (NDB00921).
2. Câu nhiều ý (a, b, c…): xếp vào dạng bài của **phần lớn các ý / ý trọng tâm**. Các ý rải ra ≥2 dạng bài khác hẳn nhau ⇒ mức `vua`, ghi trong `ly_do`.
3. Mức độ chắc:
   - `cao` — khớp rõ mô tả/ví dụ của **đúng một** dạng bài, không có dạng thứ hai nào cũng hợp lý.
   - `vua` — có một dạng hợp nhất nhưng dạng khác cũng có thể; hoặc nội dung phụ thuộc hình (`co_hinh`) mà đề chữ không đủ; hoặc câu trộn nhiều dạng.
   - trống (`dang_bai_id: null`, `chac: null`) — không dạng bài nào khớp. `ly_do` **bắt đầu bằng đúng một nhãn** sau rồi dấu hai chấm:
     - `KHÔNG THUỘC CHỦ ĐỀ: <chủ đề thật>` — câu không phải Véc tơ (vd phương trình đường thẳng, đường tròn, elip/hypebol/parabol, hệ thức lượng trong tam giác, tỉ số lượng giác, thống kê…).
     - `THIẾU DẠNG: <gợi ý tên dạng bài nên có>` — câu là Véc tơ nhưng bản đồ chưa có dạng phù hợp.
     - `THIẾU HÌNH: …` — không xác định được vì đề dựa hẳn vào hình không có trong chữ.
     - `ĐỀ LỖI: …` — đề cụt/lỗi/không phải câu hỏi.
4. `dang_bai_id` phải là mã CÓ trong `bang-dich.md` (chép đúng `NDBxxxxx`). Không bịa mã.
5. `ly_do`: 1 câu tiếng Việt ngắn (≤ 25 từ).

## Đầu ra
Với mỗi `lo-NN.json`, ghi `out-NN.json` cùng thư mục: mảng JSON, **mỗi câu đầu vào đúng 1 phần tử, đủ số câu, đúng thứ tự**:
```json
[{"ma_cau": "T310...", "dang_bai_id": "NDB00919", "chac": "cao", "ly_do": "..."}]
```
Ghi bằng công cụ Write (JSON hợp lệ, không bình luận). Làm xong lô nào ghi lô đó rồi mới sang lô sau.
Cuối cùng trả lời ngắn: mỗi lô bao nhiêu câu cao / vua / trống. Không làm gì khác (không sửa file khác, không ghi DB).
