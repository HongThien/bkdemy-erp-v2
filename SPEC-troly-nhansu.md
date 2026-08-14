# SPEC — Trợ lý AI cho NHÂN SỰ (worktree `feat/troly-ai`)

> Chốt 14/08 với CEO. Đây là **mục đích của worktree này**, đọc trước khi viết dòng nào.
> Trước đó trợ lý được dựng cho MỘT người (CEO) trên trục "việc của tôi". Bản này đổi trục.

---

## 0. Đổi trục — vì sao bản cũ không dùng lại được

Trợ lý đời đầu đọc `getMyTasks()` = task suy từ **lớp mình được phân công**.
Nhưng **Trần Bảo Lộc (NS003, Lead vận hành) có 0 phân công lớp** ⇒ mở ra là trắng.
Và cái Trang cần — *"lớp nào còn thiếu để follow"* — là việc của **người khác**, không phải của Trang.

⇒ **Trục mới = MẢNG PHỤ TRÁCH.** Mỗi người = một bộ mảng. "Việc của tôi" tụt xuống thành
**một mảng trong đó**, không còn là toàn bộ.
Thêm người thứ 4 = **gán mảng**, không viết code mới. (CEO chốt; loại bỏ phương án hardcode
3 tài khoản vì nghịch luật "quyền bám GHẾ không bám người" của repo, và loại phương án đi
theo cây ghế vì cây hiện có người giữ 6 ghế ⇒ phạm vi rộng ngoài ý muốn.)

---

## 1. Ba người — ai lấy mảng nào

| Mảng | Lộc (NS003) | Trang (NS002) | Thùy (NS001) |
|---|:--:|:--:|:--:|
| `botro_bu` — bổ trợ bù | ✅ | | ✅ |
| `botro_yeu` — HS bị gắn cờ yếu | ✅ | | ✅ |
| `tuyensinh_test` — test đầu vào (chuỗi 4 mốc) | ✅ | phần **trả bài** | ✅ |
| `hoanthanh_buoi` — ET · BTVN · Đánh giá theo LỚP **(làm ĐẦU TIÊN)** | | ✅ | ✅ |
| `nhansu_hieusuat` — ai miss / ai làm tốt | | ✅ | ✅ |
| `viec_cua_toi` — task cá nhân (8 nguồn, đã có) | ✅ | ✅ | ✅ |

**Trang = NS002 Phạm Thị Thùy Trang** (Trưởng khối THCS · Giáo viên trưởng · Quản lý trợ giảng ·
14 lớp) — CEO chốt, KHÔNG phải NS009 Hoàng Thị Quỳnh Trang (QLHT). Hai người cùng tên, đã suýt nhầm.

Việc Trang **tự làm** (nhập liệu · việc phát triển · trả bài) đi qua mảng `viec_cua_toi` sẵn có,
không đẻ mảng mới.

---

## 2. LUẬT ĐO — chỉ đếm khi CÓ BẰNG CHỨNG PHẢI LÀM (CEO chốt)

Đây là luật cứng của bản này, áp cho `hoanthanh_buoi` và `nhansu_hieusuat`.

**Vì sao:** hệ **không có cột nào** ghi lớp nào bắt buộc làm ET/BTVN (đã query `information_schema`).
30 ngày gần nhất: 310 buổi thường — thiếu đánh giá 100 · thiếu ET 82 · thiếu BTVN 121. Nhưng CEO
đã chốt **đánh giá KHÔNG bắt buộc** và **`ingame` là cố tình bỏ**. Đổ nguyên đống đó ra rồi quy về
người là **kết tội người đang làm đúng**. Sai số thì sửa được; mất lòng tin của GV/TA thì không.

**Luật:** một khâu chỉ tính là NỢ khi có hiện vật chứng minh nó phải xảy ra —
- ET: buổi có **đề ET gắn vào** (`tai_lieu loai='et'` khớp lớp+ngày, hoặc `gami_session_problems` phase='et').
- BTVN: buổi có **doc BTVN** gắn vào.
- Đánh giá: **BẮT BUỘC** — CEO đảo lại 14/08, "đòi như ET". Mọi buổi thường đều phải có.
  ⚠ Điều này **ghi đè** dòng cũ ở đây ("không bắt buộc, chỉ hiện như thông tin"). Đo lúc đảo:
  hôm qua 7/9 lớp chưa đánh giá, 30 ngày gần nhất 100/310 buổi ⇒ danh sách mấy tuần đầu sẽ dài.
  CEO chọn đòi hết, KHÔNG kẻ đường ngày như luật 48h của bù — cố ý, đã hỏi rõ.

### 2.1 NHỊP — "theo lịch hôm nay phải có gì, hệ ghi nhận được gì" (CEO chốt 14/08)

Đây là cách đặt đúng cho MỌI khâu, không riêng BTVN:
> *"Theo lịch hôm nay lớp ABC phải nộp nhưng trên hệ thống mới chỉ ghi nhận lớp A"*

Nghĩa vụ **suy từ LỊCH**, không phải từ "hôm qua có gì chưa xong". Cụ thể:
- **ET · đánh giá** — nghĩa vụ của buổi VỪA DẠY. Đo thật: ET đóng ngay trong ngày **244/339 ca
  (72%)**, thêm 43 ca sau 1 ngày ⇒ hỏi vào sáng hôm sau là ĐÚNG nhịp.
- **BTVN** — chấm ở buổi KẾ TIẾP (thiết kế, không phải lười). Đo thật: đóng sau 2–6 ngày là chuẩn;
  đóng trong vòng 1 ngày chỉ **2/250 ca**. ⇒ Nhắc theo ngày là **sai nhịp và sai 100%**: sáng hôm
  sau thì lớp nào cũng "thiếu BTVN", kể cả lớp đang làm rất chuẩn. Đúng phải là: **lớp nào HÔM NAY
  có ca ⇒ BTVN của buổi trước đến hạn hôm nay**, rồi so với cái đã ghi nhận.

**Đánh đổi đã biết, không giấu:** luật này **bỏ sót** lớp đáng lẽ phải có ET mà chưa ai soạn đề —
hệ sẽ im. Chấp nhận, vì thà sót còn hơn đổ oan. Muốn hết sót thì phải khai cờ bắt buộc theo lớp
(~46 lớp, tick một lượt) — để dành, không làm lần này.

---

## 3. LUẬT NÓI — thiếu dữ liệu thì nói thẳng là thiếu (CEO chốt)

> *"có gì hiện đấy. chưa có bổ trợ yếu thì báo chưa có thông tin"*

Áp cho mọi mảng. Cụ thể lần này:
- `botro_yeu`: `canh_bao_yeu` = **24 dòng đang sống** (mới nhất 13/08) ⇒ hiện làm **hàng đợi cờ yếu
  chưa ai xử**. `bo_tro_yeu` = **0 dòng và không có đường ghi nào trong repo** ⇒ nói thẳng
  *"chưa có ca bổ trợ yếu nào — hệ chưa có chỗ tạo"*, KHÔNG im lặng bỏ qua, cũng KHÔNG vờ như đang theo dõi.
- `tuyensinh_test`: 4 ca — đã test 4 · đã scan 4 · **chấm 0 · trả 0**. Hiện đúng như vậy kèm câu
  *"kẹt ở khâu chấm, chưa chốt ai làm"* (xem §5).

---

## 4. Ranh giới AI — không đổi

Giữ nguyên từ bản trước: **CODE tính hết số → bảng sạch; MODEL chỉ đọc rồi trò chuyện.**
Mọi mảng phải gộp sẵn số trước khi đưa cho model. Mỗi mảng tự khai mục `khongBiet` của nó.
Ba khối không-chat vẫn chạy khi worker tắt.

⚠ Bảng sạch giờ có **việc của người khác** (Trang xem hiệu suất nhân sự). Tầng DB **không lọc gì
giữa các nhân sự** (86/117 policy chỉ là cổng nhị phân `la_thanh_vien()`), và worker chạy
`SUPABASE_SERVICE_ROLE` bypass toàn bộ RLS ⇒ **"ai thấy gì" phải chặn ở code dựng context**,
không được dựa vào DB.

---

## 4.5 THỨ TỰ LÀM — vận hành buổi học TRƯỚC

CEO chốt 14/08: module này **đang chạy đầy đủ nhất** nên khai trước. Mấy mảng còn lại
(bù · đuổi · yếu · test đầu vào) có mảng dữ liệu mỏng hơn hoặc còn chặn ở quyết định.
Đặt trong **tab 🤖 Trợ lý**, không đẻ lá mới — để hỏi được ngay trong khung chat.

---

## 5. CÒN CHẶN — chưa có câu trả lời

**Ai CHẤM bài test đầu vào.** Chặn cả `tuyensinh_test` của Lộc lẫn vế "trả bài" của Trang: 4/4 ca
đã scan xong rồi nằm im, mốc `cham_xong_at` trống hết. Luật TRẢ kết quả thì đã chốt (khối 3–6 →
Thùy · 7·8·9 + cấp 3 nhánh A → Trang · cấp 3 nhánh B,C → Đạt), nhưng khâu trước nó thì chưa.
Trước khi có câu trả lời, trợ lý **hiện đúng sự thật "kẹt ở khâu chấm, chưa chốt ai làm"** thay vì
gán bừa cho ai.

⚠ Kèm chặn kỹ thuật đã biết: cấp 3 phân theo **nhánh lớp A/B/C** nhưng `ung_vien.khoi` chỉ ra
`'11'`/`'12'`, và `lop_du_kien_id` null ở cả 4 ca ⇒ ca cấp 3 chưa định tuyến được cho tới khi có
ô chọn lớp dự kiến lúc tạo ca test.
