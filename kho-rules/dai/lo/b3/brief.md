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

## Luật bổ sung của CEO (Thùy 22/10 — áp mọi khối, đã nằm trong mô tả của các dạng bị ảnh hưởng)
- **Câu thuộc nhiều dạng bài ⇒ đưa vào dạng bài CUỐI CÙNG theo thứ tự trên bản đồ** (dạng học sau cùng; bảng đích `dich.md` đã xếp đúng thứ tự). Vd câu dùng cả quan hệ phụ nhau và bù nhau ⇒ dạng bù; câu nhận diện chứa cả định lí sin và cos ⇒ dạng nhận diện định lí sin.
- **Câu có nhiều cách giải**: chỉ cần MỘT cách giải thuộc một dạng bài thì câu được đưa vào dạng đó (không loại câu chỉ vì cách giải khác thuộc dạng khác). Nếu hai dạng cùng có cách giải hợp lệ ⇒ theo luật trên (dạng sau cùng).
- Đọc kỹ dòng **"Lưu ý"** trong mô tả từng dạng: Thùy ghi các ranh giới ở đó (vd thực tế dùng cả sin và cos ⇒ dạng sin; nhận diện chứa sin + cos + diện tích ⇒ dạng diện tích).

## Luật bổ sung (Thùy 22/10, chủ đề Bất phương trình và hệ bất phương trình bậc nhất 2 ẩn)
- **Câu có hình miền nghiệm mà ĐỀ thiếu số liệu, phụ thuộc vào hình, nhưng HÌNH đã đủ số liệu để làm ⇒ xếp mức `cao` luôn** (không hạ xuống `vua` chỉ vì đề không nêu hệ số/đường thẳng; chỉ hạ khi hình thật sự thiếu/không đọc được dữ kiện, hoặc mô tả dạng chưa phân biệt được đường thẳng đã biết hay phải lập).
- Dạng mới **NDB01400 "Các tính chất cơ bản của bất phương trình bậc nhất 2 ẩn"**: các câu hỏi đơn giản xoay quanh định nghĩa/tính chất của bất phương trình bậc nhất 2 ẩn (đọc mô tả trong `dich.md`).

## Luật chung (Thùy 23/10 — mọi khối): DẠNG SAU THẮNG
- Câu trông thuộc hai (hay nhiều) dạng / nhóm khác nhau ⇒ luôn xếp vào dạng đứng **SAU** trong `dich.md` (số thứ tự lớn hơn), mức `cao`; không cần hạ xuống `vua` chỉ vì hai dạng cùng hợp. Ngoại lệ duy nhất: có bằng chứng thứ hai độc lập.
- Câu "chọn mệnh đề / khẳng định đúng": dạng quyết định bởi phương án ĐÚNG, không bởi các phương án nhiễu.
- Câu **Đúng/Sai** (4 mệnh đề) không gán dạng — nếu gặp thì để trống, `ly_do` "câu Đúng/Sai ⇒ kho riêng cấp chủ đề".
- Đây là đợt K10 28/10 (bản đồ 75 dạng, vừa cập nhật 24–27/10): đọc kỹ mô tả mới của từng dạng trong `dich.md`; dạng mới (NDB01404 BPT bậc nhất 1 ẩn thực tế, NDB01595 tập hợp chứa tham số m khác, NDB01596 tổng số phần tử của cả nhóm …) nay có chỗ — câu từng để trống vì "thiếu dạng" này thì xếp vào đó.
