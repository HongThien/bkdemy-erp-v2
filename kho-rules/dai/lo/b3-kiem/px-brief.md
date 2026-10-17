# Brief PHÂN XỬ — câu hỏi Toán này thuộc dạng bài A hay B?

Mỗi câu trong `px-NN.json` đã bị hai nguồn xếp vào hai dạng bài KHÁC nhau (A và B) của bản đồ kiến thức khối.
Bạn là người phân xử độc lập: KHÔNG biết (và không cần biết) nguồn nào là nguồn nào. Thứ tự A/B là ngẫu nhiên.

## Đầu vào
- `../dich.md` — bảng đích: mọi dạng bài của khối (mã `NDBxxxxx`) theo Chủ đề › Chuyên đề › Nhóm bài, kèm mô tả + ví dụ.
  Đọc kỹ ít nhất phần chứa các mã A/B xuất hiện trong lô của bạn (tìm theo mã) và các dạng anh em cùng nhóm.
- `px-NN.json` — mảng câu: `ma_cau`, `loai`, `de`, có thể có `lua_chon`, `menh_de`, `dap_an`, `loi_giai` (cắt ngắn), `co_hinh` (đề có hình bạn không thấy), và `A`, `B` = {id, ten}.

## Cách phân xử
Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng phương pháp gì (xem lời giải) — đối chiếu mô tả + ví dụ của A và B trong `dich.md`. Không theo từ khoá bề mặt.
- `A` — A đúng rõ, B không hợp (hoặc kém hợp hẳn).
- `B` — B đúng rõ, A không hợp (hoặc kém hợp hẳn).
- `ca_hai` — cả hai đều chấp nhận được, không phân định được rõ (câu trộn nhiều ý, ranh giới mô tả mờ, phụ thuộc hình…).
- `khong` — cả A lẫn B đều sai; ghi trong `ly_do` dạng bài đúng (mã trong `dich.md`) nếu thấy.
Thà chọn `ca_hai` còn hơn chọn bừa: câu bạn chọn A/B có thể bị chuyển dạng bài thật.

## Đầu ra
Với mỗi `px-NN.json` ghi `px-NN.out.json` cùng thư mục: mảng JSON, mỗi câu đầu vào đúng 1 phần tử, đủ số câu, đúng thứ tự:
```json
[{"ma_cau": "T109...", "chon": "A", "ly_do": "≤ 30 từ, vì sao"}]
```
Ghi bằng công cụ Write (JSON hợp lệ). Cuối cùng trả lời ngắn: số câu A / B / ca_hai / khong mỗi lô, và nếu thấy cả loạt câu cùng một cặp A/B nghiêng hẳn về một phía thì nói cặp đó.
