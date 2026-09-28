# Spec — "Thế giới BK": mạng xã hội KHOE nội bộ cho học sinh BK

> Tổng kết các buổi bàn Thùy ↔ CTO 28–29/09/2026. **Trạng thái: logic ĐÃ CHỐT · CHƯA code · chờ bộ sticker (Thùy tự tìm mua) + lịch build.**
> Nguồn gốc các quyết định: `spec-thanh-tuu-nhiem-vu.md` §0.7c (ghi theo từng vòng) · số nền §0.10 · danh mục câu `design/THE-GIOI-BK-danh-muc-tuong-tac.md`.
> File này là bản gom **đọc trước khi build**. Lệch nhau ⇒ file này mới nhất (29/09).

---

## 1. Vì sao làm — đích

- **Gốc (Thùy):** HS học một mình trên app thấy **cô đơn**. Thấy bạn khác cũng đang làm bài, đang đạt thành tích ⇒ hứng thú + động lực; được
  "show hàng" trước bạn bè.
- **Đích cuối:** tăng **gắn bó với app** ⇒ HS có thêm động lực học.
- **KHÔNG làm mạng xã hội đăng bài.** Làm **"mạng xã hội KHOE"**: tin do hệ thống tự sinh từ thành tích thật, HS chỉ tương tác bằng danh mục soạn sẵn
  ⇒ không có nội dung tự do ⇒ không cần kiểm duyệt, không rủi ro.
- Thế giới đã có mẫu: *social presence / body doubling* (Forest, Focusmate, "Study With Me") + *khoe tự động, bạn bè bấm tương tác* (Strava Kudos,
  Duolingo feed). Cơ sở: nhu cầu được ghi nhận (*relatedness* — thuyết Tự quyết, Deci & Ryan) — người ĐƯỢC khen mới là người có động lực.

## 2. Số nền (để đo có hiệu quả không)

Đo 28/09, 4 tuần 31/08–27/09, trước khi có gamification (`node scripts/do-gan-bo-app.mjs <từ> <đến>` — chỉ đọc). Chi tiết: `spec-thanh-tuu-nhiem-vu.md` §0.10.

| Chỉ số | Nền |
|---|---|
| **% HS-tuần dùng app ≥3 ngày/tuần** (chỉ số CHÍNH — thói quen) | **7,1%** |
| % HS dùng app trong tuần (tuần 21/09) | 37% (124/337) |
| % HS làm bài **tự nguyện** trong tuần | 25% |
| Đông nhất | 16–22h, đỉnh **21h**; tối T2–T5 ~27–36 HS; đồng thời max 22 HS / 30 phút |

⚠ App chưa triển khai hết khi đo ⇒ đây là **mốc so**, không phải đánh giá. Hệ quả thiết kế: "N bạn đang học lúc này" thường chỉ vài bạn → ~20.

## 3. Hai lớp sản phẩm

### 3.1 "Đang học cùng em" (ngay trong màn làm bài)
- "🟢 N bạn BK đang học lúc này" — đếm bằng **realtime presence**, không ghi DB.
- Dòng tin chạy nhẹ: "X vừa làm xong 10 câu"… — **chỉ tin nỗ lực / tin tốt**; không bao giờ hiện điểm kém, câu sai, hạng thấp.
- **Không bao giờ vắng:** lúc ít người hiện số tổng "Hôm nay 87 bạn đã luyện 1.240 câu", không hiện "0 bạn".

### 3.2 Kênh khoe
- **🌏 Thế giới BK** (toàn trung tâm, gộp mọi môn) + **🤝 Bạn bè** (MỚI 29/09 — xem §6b) + **🏫 Kênh lớp** (mỗi lớp em học — lớp gắn môn, đúng CLAUDE.md §1.6).
- Mockup bấm được (29/09): https://claude.ai/artifact/QNDbroHiEMNPctHjS5dWTb
- Bấm tên ⇒ **hồ sơ khoe** của bạn đó (`spec-thanh-tuu-nhiem-vu.md` §0.7b: khung avatar theo rank, 3 huy hiệu ghim, danh hiệu).

## 4. Tin nào lên kênh — 3 tầng

| Tầng | Loại tin (tự sinh từ sự kiện thật) | Hiện ở | Hiệu ứng |
|---|---|---|---|
| **S · Cực phẩm** | Lên bậc rank mới · huy hiệu ★4–5 · giải tháng · 🧋 trúng trà sữa | 🌏 Thế giới, **ghim đầu 24h** | Lớn (khung vàng, pháo giấy) |
| **A · Đáng khoe** | Huy hiệu ★1–3 · Nhất buổi · đội thắng game buổi · **chinh phục 1 dạng** (yếu→đạt) · chuỗi 7/30 ngày | 🌏 Thế giới (**gộp thẻ theo loại**) + 🏫 lớp + 🤝 bạn bè (chi tiết) | Thẻ thường |
| **B · Nỗ lực** | Xong nhiệm vụ ngày · chuỗi 3 ngày · tiến bộ so với chính mình · xong bài | 🏫 kênh lớp + 🤝 bạn bè + tin chạy §3.1 (**không** lên Thế giới) | Dòng nhỏ |

- Tin B của 1 em trong ngày **gộp thành 1**.
- **⭐ Thế giới KHÔNG ngập (Thùy 29/09):** Thế giới chỉ hiện **tin S riêng từng cái** + **tin A GỘP 1 thẻ / loại / ngày** ("🏆 Hôm nay 11 bạn Nhất buổi"
  — bấm mở danh sách, khen từng bạn; huy hiệu ★1–3 gộp theo tuần). **Lớp + Bạn bè hiện CHI TIẾT** đủ S + A + B từng tin.
  Số đo 4 tuần (29/09): ~11 buổi thường/ngày ⇒ không gộp thì ~20–25 tin A/ngày chỉ riêng Nhất buổi + game, ngày chốt huy hiệu vài trăm.
  Chờ Thùy: giữ thẻ gộp A ở Thế giới (mockup) hay bỏ hẳn A, Thế giới chỉ còn S.
- **Chỉ tin tốt** (luật A8 gamification: hạng thấp chỉ em đó thấy). Phải có loại tin **ai chăm cũng đạt** (tầng B) để bạn yếu cũng lên kênh.

## 5. Tương tác — không chat, không chữ tự do

- Mỗi em mỗi tin: **1 icon** (đổi được) **+ 1 câu meme** chọn từ danh mục soạn sẵn. Không có "chỉ 1 nút chúc mừng" (Thùy).
- Dưới tin: đếm theo icon + vài câu mới nhất (tên/mã người gửi) + "+N bạn".
- **"👑 Thầy cô khen":** icon RIÊNG chỉ GV/TA thả được, hiện nổi bật (khen công khai của thầy cô > chục icon bạn bè).
- **Không cộng EXP** cho việc thả tương tác (chống bấm hàng loạt kiếm điểm).
- Danh mục icon/câu nằm ở **DB, admin sửa được** (trend Gen Z sống 3–6 tháng ⇒ làm mới mỗi quý). Ẩn câu = không cho chọn mới; câu đã dùng trên
  tin cũ vẫn hiện nguyên.
- **Danh mục câu (Thùy đã duyệt):** `design/THE-GIOI-BK-danh-muc-tuong-tac.md` — 30 câu gốc + 15 câu trend 2025–26, chia nhóm theo loại tin
  (hype chung · tôn sùng · nỗ lực · game/may mắn), mỗi tin chỉ hiện ~8–10 câu hợp loại. Luật chọn: **chỉ khen một chiều** — đã loại các câu/icon teen
  dùng 2 nghĩa (💀 🗿 🤡 😂 🤓 · "ảo thật đấy" · "con nhà người ta" · flex/cap/sus…), câu chửi thề nhẹ, câu khen ngoại hình. Gợi ý: 1 HS lớp 10–11
  làm "cố vấn trend".

## 6. Danh tính & riêng tư

- Mỗi em **tự chọn hiện TÊN hoặc hiện MÃ SỐ HS** (`hoc_sinh.ma_hs`, dạng `HS####` — 338/338 HS đang học có mã riêng, đo 28/09). Áp mọi chỗ em xuất hiện.
  Chế độ mã: avatar chung, bấm vẫn xem hồ sơ khoe (rank/huy hiệu) nhưng **không lộ tên + lớp**.
- **Chủ tin tự quản:** ẩn từng **tương tác** trên tin mình · ẩn từng **tin** của mình. Admin gỡ được mọi tin.
- **Phụ huynh KHÔNG xem** kênh (riêng tư của HS).
- **Tên LUÔN kèm lớp** (Thùy 29/09: "tên học sinh phải kèm lớp người khác mới nhìn được") — trên tin, lời khen, danh sách bạn, gợi ý kết bạn.
  Chế độ mã HS: ẩn cả tên lẫn lớp.

## 6b. Bạn bè & kết bạn (Thùy 29/09 — "bạn nó là người ảnh hưởng lớn nhất đến nó")

- **Tab 🤝 Bạn bè** trong Thế giới BK: bạn đang học lúc này (chấm xanh) · lời mời kết bạn (Đồng ý / Để sau) · tin khoe của bạn · **cả tin nỗ lực
  tầng B của bạn** (bình thường chỉ ở kênh lớp — với bạn thì thấy hết, vì bạn bè kéo nhau học). Ở tab Thế giới, tin của bạn có nhãn "bạn".
- **Kết bạn 2 chiều:** gửi lời mời → người kia đồng ý mới thành bạn. Chỉ học sinh BK. Tìm bằng tên / mã HS / lớp; gợi ý = cùng lớp · bạn chung.
- Dải "đang học cùng em" (§3.1) ưu tiên bạn bè: "14 bạn BK đang học · 3 bạn của em"; tin chạy lấy bạn bè trước.
- Vẫn KHÔNG chat, KHÔNG nhắn tin — kết bạn chỉ để thấy nhau cố gắng + khen nhau.
- **Dữ liệu (đề xuất CTO, chưa chốt):** lời mời = dòng thật khi em bấm gửi (người gửi · người nhận · lúc gửi); đồng ý / từ chối / huỷ kết bạn =
  ghi trạng thái + TRIGGER log (CLAUDE §4). Quan hệ bạn là dữ liệu KHÔNG-học-tập ⇒ không nhãn môn. Lọc "tin của bạn" ở hàm Postgres (§2.0).

## 7. Thông báo đẩy — bộ máy kéo HS quay lại

- App HS đã là **PWA**; hạ tầng Web Push (`src/lib/push.ts`, bảng `push_dang_ky`) đang chạy cho app pt/ta ⇒ thêm app `hs`.
- Nội dung: "🔥 Bình và 4 bạn thả tim cho thành tích của em" · "👑 Cô Lan khen em".
- **Gom 1–2 lần/ngày quanh 20h** (giờ đông nhất), không bắn từng cái.
- iPhone: HS phải "Thêm vào màn hình chính" mới nhận push ⇒ cần hướng dẫn HS/PH cài.

## 8. Icon & sticker — nguồn (bàn 29/09)

- **Sticker Zalo / Messenger (Shi & Ngáo, Bư mặt ngáo, Củ hành, Hoàng thượng mèo, Mèo méo meo, Tonton Friends…): KHÔNG dùng được như đang có.**
  Bản quyền thuộc họa sĩ / nền tảng. **Mua gói trong Zalo (vd 30.000đ) = quyền GỬI trong Zalo, dùng cá nhân** — không phải quyền đem sang app khác,
  càng không cho tổ chức dùng lại với ~340 HS. Không tự trích file từ Zalo (vi phạm điều khoản Zalo).
- **Muốn dùng một bộ cụ thể:** tìm tác giả (trang thông tin bộ sticker trong Zalo) → gửi thư xin cấp quyền (phạm vi: biểu tượng tương tác trong app
  học nội bộ BK, không bán, không in hàng hoá, thời hạn, không độc quyền, xin file gốc) → **hợp đồng bằng văn bản** (Luật SHTT: hợp đồng sử dụng quyền
  tác giả phải lập văn bản) → nhận file từ tác giả. Họa sĩ Việt tự do thường vài triệu/năm; thương hiệu nước ngoài (Tonton Friends — Tonton House
  Co., Ltd., Seoul) đi qua đại lý cấp phép, đắt hơn, có thể từ chối.
- **Nguồn miễn phí hợp pháp đã xem (29/09):**
  - **Google Noto Animated Emoji** — CC BY 4.0 (ghi công "Emoji: Google Noto"); 52/59 emoji cần dùng có bản động; Lottie ~20–80KB/cái, WebP 150KB–1,3MB.
  - **LottieFiles** — chỉ trang `/free-animation/…` (Lottie Simple License: dùng thương mại, không bắt ghi công); `/animation/…_số` là hàng trả phí.
    Tìm được 24 sticker (mèo cam 3 con · bộ người ngoài hành tinh 9 · emoji · mèo thần tài) — **Thùy: "hơi xấu"**.
  - Trang xem thử (tạm, không commit): `games-site/_xem-asset/chon-icon-sticker.html`.
- **Quyết định (Thùy 29/09): Thùy tự tìm mua bộ sticker trên mạng.** Khi mua: kiểm **giấy phép cho phép dùng trong app/sản phẩm của tổ chức**
  (không chỉ "dùng cá nhân"), giữ hoá đơn + văn bản giấy phép; định dạng nên có bản động (Lottie/APNG/WebP/GIF). Phương án dự phòng: đặt họa sĩ Việt
  vẽ bộ chó mèo riêng của BK (12–20 sticker theo đúng danh mục câu, BK sở hữu) · tạm chạy bằng emoji Noto.

## 9. Dữ liệu & kỹ thuật (đúng CLAUDE.md)

- **Kênh = SUY RA** từ bảng sự kiện đã có bằng hàm `fn_*` ở Postgres (§2.0) — **KHÔNG có bảng "bài đăng"**, không đẻ dòng chờ (§1.5).
  Nguồn tin bước 1: `buoi_giai` (Nhất buổi) · `buoi_game_luot` / `buoi_ban_qua_doi` / `buoi_game_qua` (game buổi, 🧋) · `bai_lam` (nỗ lực) ·
  nhiệm vụ · rank · huy hiệu (lõi gamification build 28/09 — xem HANDOFF mục GAMIFICATION HS).
- **Chỉ ghi thêm:** lượt tương tác (ai · tin nào · icon/câu nào) · lựa chọn tên/mã của em · cờ ẩn tin/tương tác của chủ tin · danh mục icon/câu.
- **Tương tác gắn KHOÁ TỰ NHIÊN của sự kiện gốc** (vd `huy_hieu:<id>`, `buoi_giai:<buổi>:<hs>`), không gắn vị trí trong feed (CLAUDE.md §2).
- Tin là dữ liệu học tập ⇒ mang `mon`; kênh Thế giới gộp mọi môn, kênh lớp theo lớp (môn).
- **"Chinh phục dạng":** mastery KHÔNG lưu (§1) ⇒ cần **nhật ký append-only mỗi lần vượt ngưỡng** (sự kiện thật, không phải lưu mastery) — tốn công hơn
  ⇒ bước 2.
- Hiện tên/mã, ẩn tin, quyền xem ⇒ lọc ở DB (RLS / hàm), không load-all rồi lọc client (§6).

## 10. Build

| Bước | Nội dung | Ước lượng |
|---|---|---|
| **1** | Tin từ sự kiện ĐÃ CÓ (Nhất buổi · game buổi · 🧋 · bài làm · nhiệm vụ · rank · huy hiệu) · 2 kênh · icon + câu meme · 👑 Thầy cô khen · chọn tên/mã · ẩn tin/tương tác · push HS gom 20h · "đang học cùng em" | ~1,5–2 tuần |
| **2** | Tin "chinh phục dạng" (nhật ký vượt ngưỡng) · "tiến bộ so với chính mình" | sau bước 1 |

- Nên build **cùng đợt giao diện gamification** (đơn ChatGPT) để màn đồng bộ. Chưa chốt lịch.
- Sau ra mắt: đo lại bằng `scripts/do-gan-bo-app.mjs`, so 3 chỉ số §2 (chính: **≥3 ngày/tuần**, nền 7,1%).

## 11. Còn mở (bàn sau — detail)

- **Bạn bè (29/09):** giới hạn số bạn (đề xuất 50) · có nút huỷ kết bạn + CHẶN (đề xuất có, im lặng) · em để chế độ Mã HS thì bạn đã kết bạn
  thấy tên thật (đề xuất) hay chỉ mã · thông báo đẩy khi có lời mời / bạn lên bậc · Đơn 5 ChatGPT phải thêm màn tab Bạn bè + tấm Kết bạn
  + icon tab/lời mời (sửa đơn SAU khi chốt mockup).

- **Bộ sticker** (Thùy đang tìm mua) · danh mục icon cuối cùng. **Đơn ChatGPT đã soạn (29/09):** `design/DON-HANG-GAMI-HS.md` Đơn 5 — 4 ảnh toàn cảnh + 41 hình vẽ riêng (gồm 20 icon tương tác vẽ theo style — CTO đề xuất thay cho mua sticker, chờ Thùy chốt).
- Danh sách loại tin + ngưỡng cụ thể (vd "xong 10 câu" hay "xong 1 bài") · trần tin/em/ngày ở Thế giới · giới hạn tương tác/ngày.
- Vị trí trên app HS (tab riêng hay ô trên Home) · giao diện (đơn ChatGPT).
- Lịch build.

## 12. Ý tưởng liên quan (CTO đề xuất 28/09, CHƯA chốt — để cùng bàn khi làm gamification)

- **Khởi động trước buổi:** app giao 5 câu đúng dạng sắp học; đầu buổi TV lớp hiện "12/15 bạn đã khởi động" + gọi tên — HS làm vì mai bạn bè thấy.
- **Tổ học** 3–4 bạn cố định/tháng, mục tiêu chung, tiến độ trên kênh lớp (*social accountability*, như Duolingo Friends Quest).
- Buổi luyện cực ngắn (mở app ⇒ vào ngay 5 câu ~3 phút) · chuỗi ngày có "lá chắn" (streak freeze).
- Cảnh báo: thưởng ngoài quá nhiều làm hỏng hứng thú tự thân (*overjustification*) · điểm rank nên nặng về làm đúng/mastery, không chỉ số câu
  (*Goodhart*) · vòng quay/trà sữa giữ nhỏ, không cho mua lượt bằng xu.
