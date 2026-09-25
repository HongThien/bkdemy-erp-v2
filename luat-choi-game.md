# Luật chơi — BK Trung Thu Games

> **Tờ luật dán tường cho học sinh (9 game, mỗi game 1 trang A4): `games-site/luat-choi.html`** — bấm In. File này giữ bản dài + hướng dẫn nhân sự.
> **Trạng thái: BẢN NHÁP chờ Thùy duyệt.** Viết từ code đang chạy trong `games-site/` (chưa có spec riêng
> cho từng game, trừ BK Catan có `spec-game-catan.md`). Số liệu trong luật là **giá trị mặc định** của game;
> nhân sự đổi được trong ⚙ Cài đặt — đổi thì luật in ra phải sửa theo.
> Mỗi game gồm 2 phần: **A. Luật cho người chơi** (đọc/nói cho học sinh) · **B. Hướng dẫn nhân sự** (vận hành).
> Cuối mỗi game là mục **❓ Cần Thùy chốt** — những chỗ code chưa có luật hoặc có thể không đúng ý.

---

## Game 1 — 🎲 Đoán Số Trung Thu

> **Cập nhật 25/09 — Thùy chốt, code đã đổi:** vé **5 xu = 5 lượt × 1 xu**; nhóm = các bạn đoán ở lượt 1; lượt 2–5 cả nhóm **phải đoán đủ** mới quay được (không bỏ lượt); hết 5 lượt ⇒ xu còn lại là xu nhận về, bấm "Nhóm mới". Xu không thể âm nữa (mục ❓1, ❓2, ❓5 bên dưới đã xong). Phần A/B bên dưới còn viết theo luật cũ (10 xu, được bỏ ván) — **bản đúng cho học sinh là `games-site/luat-choi.html`**.

**Một câu:** Mỗi ván, mỗi người đoán một số từ **00 đến 99** và đặt **1 xu**. Máy quay ra một số —
đoán càng gần, thưởng càng to.

### A. Luật cho người chơi

**Chuẩn bị**
- Chơi trên **1 laptop** chiếu lên TV, nhân sự cầm máy. Người chơi không cần thiết bị.
- Mỗi người bắt đầu với **10 xu**. Phòng mặc định **10 người**.

**Một ván diễn ra thế nào**
1. Mỗi người nói cho nhân sự **một số từ 00 đến 99**. Mỗi người chỉ được chọn **1 số** mỗi ván.
2. Ai chọn số thì bị trừ **1 xu** tiền đặt. Ai **không muốn chơi ván đó thì bỏ qua**, không mất xu.
3. Nhân sự bấm **🎲 QUAY SỐ**. Hai cuộn số quay: **cuộn hàng chục dừng trước**, **cuộn hàng đơn vị dừng sau**.
4. Số hiện trên hai cuộn là **số trúng** của ván. Máy tự tính thưởng cho từng người.

**Bảng thưởng** (so khoảng cách giữa số mình đoán và số trúng)

| Kết quả | Khoảng cách | Nhận về | Lãi / lỗ ván đó |
|---|---|---|---|
| 🎯 Trúng đúng | 0 | 30 xu | **+29 xu** |
| 🔥 Rất gần | lệch 1 – 2 | 10 xu | **+9 xu** |
| ✨ Gần | lệch 3 – 5 | 5 xu | **+4 xu** |
| — Trượt | lệch từ 6 trở lên | 0 xu | **−1 xu** |

**Luật "vòng tròn": 99 và 00 đứng cạnh nhau.** Các số xếp thành vòng tròn, nên số ở mép không bị thiệt.
Ví dụ số trúng là **98** thì đoán **01** chỉ lệch 3 (98 → 99 → 00 → 01), vẫn được thưởng.

**Ví dụ một ván — số trúng là 47**

| Người chơi | Đoán | Lệch | Kết quả |
|---|---|---|---|
| An | 47 | 0 | 🎯 +29 xu |
| Bình | 45 | 2 | 🔥 +9 xu |
| Chi | 51 | 4 | ✨ +4 xu |
| Dũng | 60 | 13 | trượt, −1 xu |
| Hà | *(không chơi ván này)* | – | không đổi |

**Những điều cần biết**
- **Nhiều người được chọn trùng số.** Nếu cùng trúng thì **ai cũng nhận đủ thưởng**, không phải chia nhau.
- Số trúng do máy **bốc ngẫu nhiên** — không ai biết trước, kể cả nhân sự.
- Mỗi số đều có cơ hội ngang nhau. Cơ hội được thưởng (lệch ≤ 5) mỗi ván là khoảng **11%**, tức cứ 9 ván
  thì trung bình được thưởng 1 lần.
- Xu của từng người hiện ở bảng bên phải màn hình, kèm số xu vừa được/mất ở ván vừa rồi.

### B. Hướng dẫn nhân sự

**Chạy game:** mở hub BK Games trên laptop (đăng ký máy là 📺 TV), chọn **🎲 Đoán Số**.
Game chỉ chạy trên laptop — iPad trong phòng sẽ hiện "nhìn lên TV".

**Mỗi ván**
1. Gõ số đoán của từng người vào cột **Số đoán** (Enter để nhảy xuống người tiếp theo). Bỏ trống = người đó
   không chơi ván này. Góc trên bảng hiện "x/10 người đặt".
2. Bấm **🎲 QUAY SỐ** (hoặc phím **Space / Enter** khi không đang gõ ô nào). Quay mất khoảng 4 giây.
3. Đọc kết quả: dòng người thắng tô màu, cột **Kết quả** hiện 🎯/🔥/✨, cột **Xu** hiện +/−.
4. Bấm **Ván mới ▶** (hoặc Space/Enter) để xoá số đoán và sang ván kế.

**Các nút khác**
- **Tên người chơi:** bấm vào ô tên để sửa (gõ tên thật học sinh trước khi chơi).
- **⚙ Cài đặt:** đổi số người (1–30), xu khởi điểm, xu đặt mỗi ván, hệ số thưởng, khoảng lệch từng mức,
  bật/tắt vòng tròn, âm thanh. Hộp dưới cùng tự tính **"Kỳ vọng xu chi / xu thu"** — gần 1.00 là hoà vốn,
  lớn hơn 1 là BK phát ra nhiều xu hơn thu vào.
  *Đổi số người hoặc xu khởi điểm chỉ có hiệu lực sau khi bấm "Chơi lại từ đầu".*
- **Nhập số thủ công** (bật trong Cài đặt): thay vì máy quay ngẫu nhiên, nhân sự gõ số trúng rồi mới quay —
  dùng khi muốn bốc số bằng cách khác (bốc thăm, xúc xắc thật…).
- **↺ Chơi lại từ đầu:** xoá toàn bộ xu và lịch sử, mọi người về xu khởi điểm. **Tên đã gõ được giữ lại.**
- **📊 Tổng kết nội bộ** (nút trong Cài đặt, hoặc **Ctrl + Shift + T**): số ván, tổng xu thu/chi, tỉ lệ chi/thu,
  từng ván ra số mấy ai trúng, từng người đang lãi/lỗ bao nhiêu. **Không chiếu màn này lên TV.**

**Dữ liệu:** lưu ngay trên trình duyệt của laptop. Tắt trình duyệt / tải lại trang **không mất**. Đổi laptop,
đổi trình duyệt hoặc xoá dữ liệu duyệt web thì **mất**. Game **không** tự cộng xu vào ví xu của học sinh.

**Cân bằng với cài đặt mặc định** (để nhân sự biết, không cần nói cho học sinh):
mỗi lượt đoán, xác suất trúng đúng 1% · rất gần 4% · gần 6% · trượt 89%. Kỳ vọng xu chi / xu thu = **1.00**,
tức về lâu dài BK không lãi không lỗ xu.

### ❓ Cần Thùy chốt (Đoán Số)

1. **Hết xu thì sao?** Code hiện **không chặn**: người hết xu vẫn đặt được và xu bị **âm**. Chọn một:
   (a) hết xu thì không được chơi tiếp · (b) cho âm, cuối buổi tính nợ · (c) hết xu được cấp lại.
2. **Game kết thúc lúc nào?** Code không có điểm dừng — nhân sự tự dừng. Cần chốt: chơi **bao nhiêu ván**
   hoặc **bao nhiêu phút**, và cuối cùng **người nhiều xu nhất có giải gì** không.
3. **Xu trong game có đổi ra xu ví thật không?** Hiện là xu riêng của game, không nối ví. Nếu có quy đổi thì
   cần tỉ lệ (vd 10 xu game = 1 xu ví) và ai là người nhập vào ví.
4. **Tiền đặt cố định 1 xu/ván cho cả phòng.** Có muốn cho mỗi người **tự chọn đặt nhiều xu hơn** không
   (code hiện không làm được, phải sửa)?
5. **Có mua vé vào chơi không?** Đập Chuột và các game iPad có mục "vé vào chơi"; Đoán Số không có.
