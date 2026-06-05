# ERP v2 — Spec UI/UX (dựng shell, view-first)

> **Mục tiêu lần code này:** ra một UI/UX **hoàn chỉnh, view được, click được, điều hướng đầy đủ**.
> Tính năng thật của từng nút **build dần sau**. Lần này chỉ dựng vỏ — nhưng vỏ phải mang đúng cấu trúc logic dưới đây để sau gắn tính năng **không phải đập layout**.

Stack: React + Vite + Zustand + Tailwind. **Chưa đụng Supabase** ở lần này — toàn bộ chạy bằng **mock data** (fixtures + Zustand seed). Không scifi, không design system bespoke. Boring mà chắc ở mọi nơi, chỉ đầu tư vào 2–3 surface nóng (lưới điểm danh/chấm).

---

## 0. Quy ước "build now vs stub"

**BUILD NOW (lần này):**
- Toàn bộ layout, điều hướng, các trạng thái màn hình (empty / có data / quá hạn / đang làm dở).
- Component shell của mọi surface, kể cả popup/sheet làm việc.
- Mock data đủ để mọi màn trông như thật.
- Nút bấm hiện đủ và **điều hướng/mở đúng vỏ** tương ứng.

**STUB (làm sau):**
- Logic thật của mỗi nút (save, ghi DB, derive).
- Supabase queries, RLS, derive engine của việc vận hành.
- Validation "đủ + đúng quy tắc" (lần này chỉ dựng chỗ hiện lỗi, chưa cần luật thật).
- Toàn bộ gami nhân sự.

Quy ước code: mọi action thật để `// TODO: wire later`, onSave = no-op/`console.log`. Mọi số liệu lấy từ fixtures.

---

## 1. Nguyên tắc gốc (đừng đi chệch)

1. **UI = projection của state theo role.** Không phải tập hợp page. Mỗi người thấy lát cắt của mình.
2. **Đơn vị gốc là ROLE, không phải người.** Một người nhiều role → nhiều tập việc/nút/hiệu suất, độc lập. Không hardcode single-role.
3. **Hai loại việc tách hoàn toàn** (dữ liệu + luật + hiển thị): việc **vận hành** (derive) và việc **phát triển** (giao tay). Không trộn bảng, không cho luật cái này rò sang cái kia.
4. **Quyền lên task chảy từ trên xuống.** Người làm không có quyền từ chối/trả ngược. Chỉ cấp trên thu hồi/xóa/hủy.
5. **Mọi thứ derive theo role + phạm vi quyền** — cây điều hướng, nút, dashboard, widget, filter cơ sở.

---

## 2. Nền dữ liệu: Role-assignment (mock cho shell)

Người (1) → có nhiều **role-assignment**. Mỗi role-assignment mang **3 thuộc tính độc lập**:

| Thuộc tính | Quyết định | Dùng ở |
|---|---|---|
| **Vai** (chức danh) | queue/nút nào hiện | màn nhân sự + cây admin |
| **Phạm vi** (lớp/cơ sở) | task nào rơi vào; admin thấy/sửa cơ sở nào | lọc task + lọc quyền admin |
| **Cấp trên của role này** | notice trễ leo lên ai | route notice |

Ba thuộc tính trên **từng role-assignment**, không trên người → một người có thể có 2 sếp khác nhau tùy role; route notice **theo role của việc**, không theo người.

**Mock cho shell:** seed ~4–5 nhân sự, vài người 1 role, ít nhất 1 người 2 role (để test home gộp nhiều role), 1 ca vượt cấp (role cao hơn cấp chính thức — kiểu Cường/Uyên). Seed orgchart 2–3 cấp, 2 cơ sở (để test phạm vi + filter cơ sở).

Lần này **không cần bảng thật** — một fixtures object là đủ. Nhưng đặt shape cho đúng để sau map sang schema.

---

## 3. MÀN NHÂN SỰ

Nền: **desktop-only** (app là phase sau, không dựng responsive mobile lần này).

### 3.1 Layout home
Một màn, ba khối:
- **Thẻ cá nhân** (góc, gọn): avatar + tên + (chỗ chừa cho work-tracking, gami sau).
- **Queue vận hành** — ngôi sao, chiếm trọng tâm.
- **Queue phát triển** — khối thứ hai, tách rõ khỏi queue vận hành.
- **Nút chức năng** — ngăn phụ (tra cứu/sửa), không tranh chỗ chú ý với queue.

Home = derive từ tập role của người đang đăng nhập. Đa role → các queue/nút cộng lại. (Lần này: chọn mock user qua một switcher dev để xem các role khác nhau.)

### 3.2 Queue vận hành (build vỏ + mock)
- **List dọc phẳng + scroll.** Không nhóm, không tab.
- Sort theo **deadline**, gần hết hạn lên đầu.
- Đầu khối có **số đếm xuống**: "Còn lại hôm nay: N việc". **Không hiện %.**
- Việc **quá hạn** → dòng **đỏ**, leo lên đầu.
- Mỗi dòng task: hiện đủ để biết là việc gì + lớp/đối tượng + deadline. Click → mở surface làm việc (3.6).
- Việc làm dở (vd "đã chấm 8/15") → hiện tiến độ trên dòng, mở lại **resume** đúng chỗ.
- **Refresh khi mở home / khi đóng surface xong một việc.** KHÔNG real-time (không để list rung dưới chân lúc đang làm). Lần này: refresh = đọc lại mock store.

### 3.3 Queue phát triển (build vỏ + mock)
- Queue **thứ hai**, list riêng, tách khỏi vận hành.
- **Có deadline hiển thị** (để nhân sự tự liệu) nhưng **không "dí trong ngày"** — không đỏ/notice tự động kiểu vận hành.
- Mỗi dòng: tiêu đề + mô tả ngắn + deadline + trạng thái.
- Trạng thái hiển thị: **đang làm / đã nộp** (chờ người giao duyệt). Người làm **chỉ có nút "Nộp"** — không có nút "Xong", không có "Trả lại". (Wire sau; lần này nút Nộp đổi trạng thái trong mock.)

### 3.4 Nút chức năng — tra cứu & sửa (build vỏ)
- Mục đích: **tìm lại một bản ghi cụ thể để sửa lỗi.** KHÔNG phải nơi làm việc mới (việc mới chỉ qua queue).
- UI: mỗi nút mở một surface có **ô tìm/lọc** (lớp X → buổi Y → học sinh Z), ra bản ghi, mở để sửa.
- Lần này: dựng ô tìm + bảng kết quả mock + nút mở sửa (mở lại đúng surface 3.6 ở chế độ edit). Không cần search thật.

### 3.5 Thẻ cá nhân
- Avatar + tên + vai (các role).
- **Chừa chỗ** cho work-tracking & thanh gami (sẽ đổ vào sau). Lần này để placeholder rõ ràng (`{/* gami slot */}`).

### 3.6 Surface làm việc — popup vs sheet (HOT, đầu tư ở đây)
Nguyên tắc tương tác: **một cú nhảy vào việc → làm → tắt là xong → tự về home.** Không click nhiều nấc.

- **Việc nhẹ** = **popup** thật (modal nhỏ, canh giữa).
- **Việc nặng** (lưới ~15 học sinh: điểm danh, chấm ET/BTVN) = **sheet màn lớn** có **thanh bar** (action bar) cố định. Vẫn "tắt là xong".
  - Lưới = 15 dòng/ô **to, một chạm**, phản hồi tức thì, **không animation chặn thao tác**. Tham chiếu cảm giác: màn order POS, không phải form. Tốc độ là tất cả.
  - Có **resume** (mở lại thấy 8/15 đã làm).
  - Đóng (Esc / nút tắt) → về home.
- **"Xong" = đủ + đúng quy tắc.** Lần này dựng **chỗ hiện trạng thái thiếu/sai** (vd ô chưa điền viền đỏ, nút Lưu disable khi thiếu) nhưng **luật validation thật để stub.** Không có đường "lách cho xong" — vỏ phải thể hiện điều này (không cho đánh dấu xong khi còn ô trống).

### 3.7 Việc trễ ("dí") — build vỏ hiển thị
- (a) Đỏ trên queue cá nhân, leo đầu (đã ở 3.2).
- (b) **Notice (không chặn)** nổi lên cho **quản lý trực tiếp** (route theo role của việc). **Không popup chặn. Không broadcast có tên.**
- Lần này: dựng component notice (toast/inbox không chặn) + chỗ nó đáp xuống ở màn quản lý (ngăn "cần chú ý", xem 4.3). Logic route = đọc mock orgchart.

### Các state của màn nhân sự phải dựng được để view
- Queue vận hành: rỗng (về 0 — empty state "hết việc"), có việc, có việc quá hạn, có việc làm dở.
- Queue phát triển: rỗng, đang làm, đã nộp.
- Surface: popup nhẹ, sheet lưới 15 (mới / làm dở / đủ-cho-lưu).
- Đa role: home gộp nhiều role.

---

## 4. MÀN ADMIN

Chấp nhận **không đồng nhất** như màn nhân sự — admin là nhiều việc khác tính chất gom dưới một mái (giám sát / thiết kế cấu trúc / bảo trì danh mục). Làm tốt từng khu, đừng ép một khuôn.

Bố cục tổng: **cây điều hướng trái — khu nội dung phải.**

### 4.1 Cây điều hướng trái (HOT, đầu tư ở đây)
Kiểu **tree expand tại chỗ** (như panel folder VS Code / file explorer), KHÔNG hover-flyout, KHÔNG đi tầng tuần tự rồi back.

- Cả cây nằm bên trái, **luôn hiện**.
- Folder (nhóm) bấm → **xổ/thu ngay tại chỗ** trong chính panel (không nhảy trang, không che màn).
- Lá (chức năng) bấm → mở ở **khu nội dung phải**.
- **Mặc định xổ sẵn** (chỉ ~20 mục, bày hết được) → tới lá nào cũng **đúng một cú**.
- **Sticky**: nhớ trạng thái xổ/thu, không tự reset (reset = "back" trá hình, cấm).
- **Highlight** lá đang mở.
- **Ô search** trên đầu cây: gõ → nhảy thẳng tới lá.
- Cây **derive theo role/quyền**: founder thấy cả ~20; admin cơ sở chỉ thấy lá trong phạm vi mình. (Lần này: lọc theo mock role.)

> Cây để **mắt nhìn (phân nhóm)**, không phải để **chân bước (đi tuần tự)**.

### 4.2 Phân loại chức năng (quyết cách dựng từng lá)
Hai loài, dựng khác nhau:

- **Danh mục** (CRUD chán-mà-chắc): học sinh, nhân sự, kho tài liệu, bản đồ kiến thức. → Bảng + tìm + sửa. Không đầu tư đẹp. Lần này: bảng mock + form sửa vỏ.
- **Quan hệ** (hiển thị theo cấu trúc — đầu tư ở đây): orgchart, phân công, thời khóa biểu. → KHÔNG bảng phẳng. Phải làm nổi **xung đột** & **chỗ trống**.
  - Orgchart: cây/sơ đồ ai-trên-ai.
  - Phân công: lưới role × phạm vi, làm nổi "lớp chưa ai dạy".
  - TKB: lưới giáo viên × lớp × phòng × giờ, làm nổi trùng giờ.
  - Lần này: dựng các view cấu trúc này với mock, có thể chưa kéo-thả, nhưng phải **hiện được xung đột/chỗ trống** trên mock.

### 4.3 Khu nội dung phải — Dashboard (2 tầng + filter)
**Tầng 1 — Tổng quan (mặc định khi mở admin):** vài widget cao nhất + **ngăn "cần chú ý"** (việc trễ nổi lên qua notice, lỗ phân công, bất thường). Đây là chỗ notice "dí" (3.7b) đáp xuống.
- Dựng như **khung rỗng đón widget** (container nhận widget rời), KHÔNG phải trang cứng. Giờ đổ vài widget mock; sau thả thêm là xong, không sửa cấu trúc.

**Tầng 2 — Dashboard chuyên đề (vài chục cái):** tài chính, chất lượng, marketing, tuyển dụng... → là **các lá trong nhóm "Dashboard" của cây trái**. Không cần bộ chọn riêng — cây chính là bộ chọn. Lần này: dựng 2–3 dashboard chuyên đề mẫu với widget mock.

**Filter NẰM TRONG mỗi dashboard** (≠ chọn dashboard nào):
- **Cơ sở**: mặc định theo phạm vi quyền; chỉ nới rộng **trong** phạm vi (admin cơ sở khóa ở cơ sở mình, founder thấy toàn hệ + gộp).
- **Thời gian/kỳ**: tự do, không dính quyền.

Mọi dashboard + widget **derive theo role/phạm vi**.

### 4.4 Module tạo + giao việc phát triển (vỏ)
Một lá trong cây admin. Admin: tạo task (tiêu đề + mô tả + deadline) → giao đích danh → hiện ở queue phát triển người nhận (3.3).
- **Bước duyệt + chấm** (khi người nhận đã nộp): mở task đã nộp → chấm **3 trục** (khối lượng / tiến độ / chất lượng) → chọn lỗi **cấp 1/2/3 = −5/−10/−15%** cộng dồn từ 100% → **note lý do** → đóng.
- Dựng vỏ form chấm với 3 trục + bộ chọn lỗi + ô note. **Lưu đủ "vì sao"** (lỗi/cấp/note/người chấm) để sau mang ra đối chất khi khiếu nại — đặt field từ đầu.
- Quyền task: cấp trên có nút **thu hồi/xóa/hủy**. Người làm không có. (Wire sau.)

---

## 5. Mock data tối thiểu để view

- **Users + role-assignments:** ~5 người; ≥1 người 2 role; ≥1 ca vượt cấp; orgchart 2–3 cấp; 2 cơ sở.
- **Việc vận hành:** vài task mỗi role — gồm: bình thường, quá hạn (đỏ), làm dở (8/15). Đủ để queue có mọi state.
- **Việc phát triển:** vài task — đang làm, đã nộp (chờ duyệt).
- **Lưới điểm danh/chấm:** 1 lớp ~15 học sinh.
- **Danh mục:** ít dòng học sinh/nhân sự/tài liệu/bản đồ kiến thức.
- **Quan hệ:** 1 phân công có **lỗ** (lớp chưa ai dạy); 1 TKB có **trùng giờ** — để view làm nổi xung đột.
- **Dashboard:** số liệu mock cho tổng quan + 2–3 chuyên đề.
- **Notice:** 1–2 notice trễ để view ngăn "cần chú ý" của quản lý.

---

## 6. Stub rõ ràng — KHÔNG làm lần này

- Supabase / RLS / derive engine vận hành (queue thật).
- Validation "đủ + đúng quy tắc" (chỉ dựng chỗ hiện lỗi, chưa cần luật).
- Tính hiệu suất thật, lưu vĩnh viễn, review cuối kỳ.
- Route notice thật (lần này đọc mock).
- Kéo-thả phân công/TKB (nếu nặng — ưu tiên hiện xung đột trước).
- Toàn bộ gami nhân sự.

---

## 7. Gác lại (chưa tới lúc, có chủ ý)

- **Gami nhân sự:** số chỉ-tăng; thanh bar mốc thưởng; mục tiêu chung dạng **cộng dồn / ngưỡng tỉ lệ** (KHÔNG nhị phân 1-người); số tổng **không-tên** ("trung tâm còn N việc trễ"); **tường lửa với L4/EXP** (gami là đồ chơi, không phải input lương). Để **slot** sẵn ở thẻ cá nhân + tổng quan admin.
- **Logic gộp nhiều hiệu suất** của một người (nhiều role): để 3 con số riêng, xử case-by-case. Không gộp lần này.

---

## 8. Mấy quyết định "vì sao KHÔNG" — đừng vô tình phá khi dựng

- **KHÔNG broadcast notice trễ có tên** → tránh bêu tên người yếu (đã bỏ leaderboard/all-or-nothing vì cùng lý do). Notice chỉ lên quản lý trực tiếp.
- **KHÔNG real-time queue** → tránh list rung dưới chân lúc nhập; refresh khi mở/đóng.
- **KHÔNG bảng tasks cho việc vận hành** → derive-only; chỉ việc phát triển mới có bảng.
- **KHÔNG quyền từ chối/trả task cho người làm** → quyền task chảy từ trên xuống; bỏ luôn ngăn "đang chờ".
- **Hiệu suất gắn role, KHÔNG gắn người** → một người nhiều role = nhiều hiệu suất độc lập.
- **Cây để phân nhóm, KHÔNG để đi tuần tự** → xổ sẵn + nhảy thẳng, không back.
