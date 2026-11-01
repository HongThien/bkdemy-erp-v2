# HANDOFF — Nuôi Heo (app giảm béo gamification) · đọc đầu phiên

> Bản distill từ `DEVLOG.md` cùng thư mục. Spec đầy đủ: **`spec.md`** (đọc trước khi code bất cứ gì).
> Dự án RIÊNG, không phải ERP. Tạm ở repo ERP `docs/nuoi-heo/`, nhánh **`claude/nuoi-heo-spec`** (KHÔNG merge vào main ERP). Có repo `nuoi-heo` thì chuyển cả thư mục sang.
> Cập nhật: 01/11/2026.

## ① Trạng thái hiện tại

- **Pha:** xong sparring + **spec v0.1** (chờ Thùy duyệt tổng thể). **Chưa có code, chưa có repo, chưa có DB.**
- **Đã chốt (Thùy):** pet = con lợn (người gầy ⇒ lợn béo; lỡ ngày ⇒ ốm, mua thuốc) · Trang cùng chơi · iPhone · **web app** (PWA) · **bỏ chụp ảnh** · món = món@quán, tự thêm qua pop-up (số tay hoặc mô tả ⇒ Gemini ước 1 lần) · số đo thật (trung vị) · mâm chung là phụ · quỹ phạt 50–100k/tuần trượt, tạm hiện danh sách âm, **thủ quỹ Lộc Trần** · thưởng theo quỹ (để sau) · đăng nhập **email + mật khẩu, admin cấp** · bí mật không bao giờ công khai · người dùng mở dần: Thùy+Trang → nhân sự → người quen → (có thể) học sinh.
- **Đề xuất trong spec chờ Thùy gật/bác** (§15): lợn không tụt cấp · món + số đo dùng chung trong nhóm · mỗi người 1 nhóm cược · học sinh không cược tiền, không ngân sách thâm hụt.
- **Chặn để bắt đầu P0 — việc của Thùy:**
  1. Tạo repo trống **`nuoi-heo`** trên GitHub (phiên Claude không tự tạo repo được) ⇒ Claude `add_repo` rồi chuyển `docs/nuoi-heo/*` sang.
  2. Tạo **Supabase project ở ORG MỚI, gói Free** (không chung org BKdemy) và đưa chuỗi kết nối vào môi trường phiên (theo bố cục RO/RW như ERP).
  3. Key Gemini dùng lại `GEMINI_API_KEY` sẵn có (env Vercel của project mới).
- **Việc kế tiếp của Claude khi có repo + DB:** P0 = dựng React+Vite+TS+Tailwind, Supabase Auth email+mật khẩu (màn admin cấp tài khoản, mẫu `capTaiKhoan` ERP), hồ sơ, `fn_ngan_sach_ngay`. Rồi P1 (ghi bữa, hoạt động, 3 nhiệm vụ, chốt ngày) ⇒ Thùy + Trang dùng thử 1 tuần.

## ② Bài học còn hiệu lực

- **Chụp ảnh → calo không đáng làm** (NIH 07/2026: 4 app hụt ~33%, hụt béo ~30 g/bữa — sai MỘT CHIỀU, nguy cho người giảm cân). Đừng đề xuất lại trừ khi có bằng chứng mới.
- **Ước lượng lệch ĐỀU vẫn dùng được** nếu có hiệu chỉnh bằng xu hướng cân (adaptive TDEE). Ưu tiên nhất quán hơn chính xác từng bữa.
- **Gamify hành vi, không gamify cân nặng** (cân dao động ±1 kg/ngày do nước).
- Thùy nhập bằng giọng nói ⇒ hay có từ lạ ("NLP" = ERP, "trung âm" = chung mâm, "bs" = với). **Nói lại cách hiểu** trước khi thiết kế theo.
- Thùy muốn **web app như mọi khi**, không native; hỏi thói quen stack trước khi đề xuất nền tảng.
- Luật dữ liệu mang từ ERP vẫn áp: tính ở Postgres (`fn_*`) · thiếu data = không có dòng · append-only cho sổ (quỹ, xu, sự kiện lợn, số đo) · mã gốc bất biến · ngày theo giờ VN · bí mật chặn ở RLS, không ở client.
