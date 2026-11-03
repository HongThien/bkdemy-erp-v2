# Brief: xếp câu CHƯA GÁN vào dạng bài — bản đồ mới KHTN (03/11/2026)

> ## ⛔ LUẬT CỨNG (Thùy 02/11 — mọi khối, mọi môn)
> **Để xếp câu, PHẢI đọc MÔ TẢ + LÝ THUYẾT + VÍ DỤ của TỪNG dạng bài trong nhóm.** Không xếp theo tên dạng, không theo từ khoá.
> Dạng có `canh_bao: ⚠ THIẾU` ⇒ câu xếp vào đó tối đa mức `vua`.

Bạn là người xếp câu hỏi KHTN vào **dạng bài** của bản đồ kiến thức mới. Kết quả mức **cao** được GHI THẲNG vào kho
(người chỉ hậu kiểm mẫu), nên **thà để `vua`/trống còn hơn gán sai** — gán sai ở mức `cao` là lỗi nặng nhất.
Không ghi DB, không sửa tệp nào ngoài tệp kết quả. Script phụ (nếu cần) đặt tên riêng có tên lô, không chạy script của trạm khác.

## Đầu vào `<LO>.in.json`
- `nhom[]`: mỗi nhóm có `nhom_id`, tên, `nhom_ly_thuyet`, và `dang_bai[]` (`dang_id`, `thu_tu`, `ten`, `mo_ta`, `ly_thuyet`, `vi_du`) — đầy đủ, không cắt.
- `cau[]`: `ma_cau`, `nhom_id` (nhóm câu đang nằm), `loai`, `de`, có thể có `lua_chon`, `menh_de`, `dap_an`, `loi_giai` (có thể bị cắt), `co_hinh` (đề có hình bạn không thấy).
Đọc HẾT phần `nhom` trước khi xếp câu đầu tiên (tệp lớn thì đọc từng đoạn bằng Read offset/limit, không bỏ phần cuối).

## Cách xếp
1. Mỗi câu chỉ xếp vào một dạng bài **thuộc chính `nhom_id` của câu**.
2. Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng cách nào (xem lời giải) — đối chiếu mô tả + ví dụ, đọc kĩ dòng "Lưu ý" trong mô tả.
3. Câu hợp hai dạng trở lên ⇒ chọn dạng có `thu_tu` LỚN hơn (dạng sau thắng), vẫn được mức `cao`.
   Câu "chọn phát biểu đúng/sai": dạng quyết định bởi nội dung phương án được hỏi, không bởi phương án nhiễu.
4. Mức độ chắc:
   - `cao` — khớp rõ mô tả/ví dụ của đúng một dạng (hoặc nhiều dạng mà luật "dạng sau thắng" chọn được).
   - `vua` — có dạng hợp nhất nhưng còn băn khoăn; đề có hình (`co_hinh`) mà nội dung phụ thuộc hình; đề lỗi/thiếu; dạng đích bị `⚠ THIẾU`.
   - trống (`dang_bai_id: null`, `chac: null`) — không dạng nào trong nhóm khớp. `ly_do` ghi ngắn: nhóm đang THIẾU dạng gì (gợi ý tên), hoặc "lạc nhóm: thuộc <chủ đề/nhóm đúng>", hoặc "không phải câu hỏi".
5. `dang_bai_id` phải là mã có trong nhóm của câu. `ly_do` ≤ 25 từ.

## Đầu ra `<LO>.out.json` (Write tool, JSON hợp lệ)
Mảng, mỗi câu đầu vào đúng 1 phần tử, đúng thứ tự:
```json
[{"ma_cau": "K09...", "dang_bai_id": "KDB01234", "chac": "cao", "ly_do": "..."}]
```
Tự kiểm: đủ số câu, mã câu khớp, mọi `dang_bai_id` thuộc đúng nhóm của câu.
Trả lời cuối ngắn: số câu cao / vua / trống, và nhóm nào có nhiều câu trống (bản đồ thiếu dạng gì).
