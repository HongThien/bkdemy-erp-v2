# Brief B3 — xếp câu vào DẠNG BÀI của bản đồ mới (spec-ban-do-4-tang.md §13)

Bạn là người xếp câu hỏi Toán (Đại số) vào **dạng bài** của bản đồ kiến thức mới một khối.
Kết quả có độ chắc **cao** sẽ được GHI THẲNG vào kho (người chỉ hậu kiểm mẫu ~10%), nên
**thà để "vua"/trống còn hơn gán sai** — một câu gán sai ở mức "cao" là lỗi nặng nhất.

## Đầu vào
- `dich.md` — bảng đích: mọi dạng bài của khối (mã `NDBxxxxx`), xếp theo Chủ đề › Chuyên đề › Nhóm bài, kèm **mô tả** và **ví dụ**. ĐỌC HẾT trước khi làm lô đầu.
- `lo-NN.json` — mảng câu: `ma_cau`, `loai`, `de`, có thể có `lua_chon`, `menh_de` (câu Đúng/Sai: 4 mệnh đề), `dap_an`, `loi_giai` (bị cắt ngắn), `co_hinh` (đề có hình mà bạn không thấy), `nhan_cu` (nhãn bản đồ CŨ — chỉ tham khảo, hay sai hoặc "Chưa phân dạng").

## Cách xếp
1. Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng phương pháp gì (xem lời giải nếu có) — đối chiếu với mô tả + ví dụ của dạng bài. KHÔNG xếp theo từ khoá bề mặt.
2. Câu nhiều ý (a, b, c…) hoặc Đúng/Sai 4 mệnh đề: xếp vào dạng bài của **phần lớn các ý / ý trọng tâm**. Nếu các ý rải ra ≥2 dạng bài khác hẳn nhau ⇒ mức `vua`, ghi trong `ly_do`.
3. Mức độ chắc:
   - `cao` — khớp rõ mô tả/ví dụ của **đúng một** dạng bài, không có dạng bài thứ hai nào trong bảng đích cũng hợp lý.
   - `vua` — có một dạng bài hợp nhất nhưng còn dạng khác cũng có thể; hoặc đề có hình (`co_hinh`) mà nội dung phụ thuộc hình; hoặc đề thiếu/lỗi; hoặc câu trộn nhiều dạng.
   - trống (`dang_bai_id: null`, `chac: null`) — **không dạng bài nào khớp**. `ly_do` ghi ngắn bản đồ đang THIẾU dạng gì (gợi ý tên dạng), hoặc "thuộc Hình học: …" / "thuộc HGT: …" nếu câu là hình học / toạ độ / lượng giác không có trong bảng đích, hoặc "không phải câu hỏi: …" nếu là đoạn lý thuyết/đề lỗi.
4. `dang_bai_id` phải là mã CÓ trong `dich.md` (chép đúng `NDBxxxxx`). Không bịa mã.
5. `ly_do`: 1 câu tiếng Việt, ngắn (≤ 25 từ), nói vì sao chọn dạng đó (hoặc vì sao trống/vua).

## Đầu ra
Với mỗi `lo-NN.json`, ghi `lo-NN.out.json` cùng thư mục: mảng JSON, **mỗi câu đầu vào đúng 1 phần tử, đủ số câu, đúng thứ tự**:
```json
[{"ma_cau": "T109...", "dang_bai_id": "NDB00701", "chac": "cao", "ly_do": "..."}]
```
Ghi bằng công cụ Write (JSON hợp lệ, không bình luận). Làm xong lô nào ghi lô đó rồi mới sang lô sau.
Cuối cùng trả lời ngắn: mỗi lô bao nhiêu câu cao / vua / trống. Không làm gì khác (không sửa file khác, không ghi DB).
