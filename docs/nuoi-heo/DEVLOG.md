# DEVLOG — Nuôi Heo (app giảm béo gamification) · nhật ký THÔ

> Append-only theo ngày (*làm / sai / sửa / quyết định*). Không sửa/xoá mục cũ. Bản tổng kết đọc đầu phiên: `HANDOFF.md` cùng thư mục.
> Dự án RIÊNG, không phải ERP — tạm sống trong repo ERP (`docs/nuoi-heo/`, nhánh `claude/nuoi-heo-spec`) tới khi có repo `nuoi-heo`.

## 2026-11-01 — Sparring ý tưởng → spec v0.1

**Làm**
- Thùy đặt bài toán: app giảm béo cho người thích game/progress, thích ăn, thích pickleball, ghét cardio, kỷ luật chưa cao; chơi cùng Trang.
  Yêu cầu gốc: plan + tracking hoạt động (list đủ, sex = bí mật), báo ăn để ước calo, mục tiêu ngày, dashboard, bước chân/nhịp tim nếu được, bạn bè xem calo nhau (trừ bí mật).
- Tham khảo app: MyFitnessPal / Lose It! / Yazio (ngân sách calo) · Cal AI / SnapCalorie (chụp ảnh) · MacroFactor (adaptive TDEE) · Noom · Apple rings · Duolingo (streak) · Habitica · Zombies Run · Strava · Beeminder/StickK (cược) · Finch (pet).
- Viết `docs/nuoi-heo/spec.md` v0.1 (16 mục), commit `629138e`; cập nhật chốt §15 ở `ea55fac`. Nhánh `claude/nuoi-heo-spec` (tách từ main, KHÔNG merge).

**Quyết định của Thùy (theo thứ tự trong phiên)**
- Trang = **cùng chơi** (không phải giám sát). Thiết bị: **iPhone**.
- Game = **nuôi pet, pet là con LỢN**: nhiệm vụ daily thưởng đồ ăn; chăm thì béo, lên cấp; lười thì gầy (có sụt tự nhiên); lỡ ngày ⇒ **ốm nặng 2–3 ngày**, phải mua thuốc. ⇒ Claude chốt ý "người gầy đi ⇒ lợn béo lên".
- Bí mật: không quan trọng tổng có cộng hay không, **chỉ cần không ghi công khai**.
- Hay bỏ cuộc vì **bận nên quên**; cardio không hứng nên miss; **pick thì luôn đi khi có cơ hội**.
- Nền tảng: **web app như vẫn làm** (Claude đề xuất native — Thùy bác). Bước chân lách bằng Phím tắt iPhone gửi lên endpoint.
- Cược tiền: **có, thử luôn**. Mức phạt để nhóm thống nhất, tầm **50–100k/tuần trượt**; xuất sắc thì thưởng **theo quỹ** (quỹ nhiều thưởng nhiều, ít thì ít, không có thì không). Quỹ giữ trong app, **tạm hiện danh sách âm**.
- Cân nặng/đích **không quan trọng ở spec** — mỗi người tự nhập; tập trung logic.
- Người dùng: Thùy + Trang → nhân sự trung tâm → người quen → có thể học sinh. Trước mắt cộng đồng nhỏ.
- Lo chi phí Supabase ⇒ Claude đề xuất **Supabase Free ở ORG RIÊNG** ($0); không đặt trong org BKdemy (nếu org là Pro, mỗi project thêm ~$10/tháng — các nguồn blog nói khác nhau, chưa kiểm trang giá chính thức).
- AI: Thùy muốn dùng **Gemini sẵn có**, Claude nếu Gemini không được. Claude kiểm repo: ERP đã có mẫu `api/kho-ai.mjs` (Vercel serverless, key ở server, `gemini-2.5-flash`) ⇒ dùng lại mẫu.
- **BỎ CHỤP ẢNH** (Thùy, sau khi Claude dẫn nghiên cứu NIH 07/2026: 4 app đoán thấp ~33%, hụt béo ~30 g/bữa) — "vừa tốn tiền vừa sai".
  Thay bằng chọn món + khẩu phần đời thường; **mâm chung** (cơm đếm riêng, thức ăn chia phần theo hệ số ×0.7/×1/×1.3/×1.6, tự cân 100% giữa người trong mâm).
- **Số đo thật** (Thùy): đầu tư 1 ngày cân bát/đĩa ở quán quen, nhập số chính xác; món có số đo thì dùng số đo, không thì ước. Claude thêm: mỗi lần đo 1 dòng, lấy trung vị; ô trừ bì; gợi ý món nên đo.
- **Món = món + quán** (Thùy): cơm quán A ≠ cơm quán B; giống thì dùng lại món quán cũ; người dùng tự thêm món qua pop-up — biết số thì điền, không thì **viết mô tả để hệ ước** (AI chỉ chạy 1 lần lúc tạo món, đọc chữ ⇒ gần như 0đ).
- Chốt cuối phiên: **thủ quỹ = Lộc Trần** · đăng nhập **email + mật khẩu, tài khoản riêng giống ERP** (admin cấp) · bữa trưa **trộn** (cơm/bún quán na ná nhau, có lúc chung mâm, tự nấu, ăn nhà) ⇒ mâm chung là tính năng phụ.

**Claude tự quyết (ghi ở spec, chờ Thùy phản đối nếu có)**
- Ngày chốt (12:00 hôm sau) ⇒ kết quả **đóng băng**; số đo mới không tính lại lịch sử lợn/quỹ.
- Macro (đạm/tinh bột/béo) để sau; MVP chỉ kcal.
- Chỉ cộng 50% kcal vận động vào ngân sách; hiệu chỉnh TDEE bằng xu hướng cân (kiểu MacroFactor) để hấp thụ sai số ước lượng lệch đều.
- Bí mật chặn bằng RLS ở DB.

**Sai / suýt sai**
- Câu "ốp t bs Trang" và "đăng nhập giống trên NLP" / "trung âm" là lỗi gõ/giọng nói — đã hiểu lần lượt là "với Trang", "ERP", "chung mâm". Hiểu sai là thiết kế lệch ⇒ luôn nói lại cách hiểu khi gặp từ lạ.
- Claude ban đầu đề xuất native app; Thùy muốn web như mọi khi ⇒ hỏi thói quen stack TRƯỚC khi đề xuất nền tảng.
