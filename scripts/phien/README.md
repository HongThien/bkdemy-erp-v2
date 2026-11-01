# Bot phiên Claude — trưởng khối chat thẳng với Claude Code trên ERP

Spec: `spec-phong-truong-khoi.md`. Loại việc đang mở: **Bản đồ** (Phase 1, mig `202611011822`) · **Lý thuyết dạng** (Phase 2, mig `202611011910`).
Hướng dẫn Claude theo loại việc: `scripts/phien/loai/<loại>.md` + luật chung `scripts/phien/CHUNG.md`.

Trưởng khối mở **Phòng làm việc trưởng khối › 🤖 Phiên Claude** trên ERP → chọn
loại việc + khối → chat. Tin vào bảng `claude_phien_tin` → bot này (Claude Code, chạy **máy Thùy**, **subscription**)
trả lời, chữ chạy dần trên màn. Đóng phiên ⇒ Claude viết tổng kết.

Khuôn hạ tầng giống bot hỏi–đáp (`scripts/hoidap/`): Realtime là đường nhanh, quét định kỳ là lưới vớt, nhận việc
atomic ở DB (`fn_phien_bot_nhan`) nên chạy chồng listener + `--once` vẫn không trả lời trùng.

## Cài lần đầu (máy Thùy)

1. Áp 2 migration `202611011822_phien_claude_truong_khoi.sql` + `202611011910_phien_claude_ly_thuyet.sql`: `npm run migrate` → `npm run schema` → commit `schema.md`.
   Migration cảnh báo thiếu quyền Realtime thì chạy tay trong SQL Editor (câu lệnh in sẵn trong warning):
   `alter publication supabase_realtime add table public.claude_phien;` và `… public.claude_phien_tin;`
2. `.env.local` đã có `VITE_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE` (cùng file bot hỏi–đáp). Thêm nếu cần:
   - `PHIEN_TAI_LIEU_DIR=E:\BK ACADEMY\Tài liệu tham khảo` — để Claude đọc được sách khi dựng bản đồ nháp.
   - `PHIEN_SONG_SONG=1` (mặc định) — số phiên chạy cùng lúc. Một subscription, chung hạn mức với việc riêng của Thùy.
   - `PHIEN_TIMEOUT_PHUT=30` (mặc định).
3. **Đăng nhập subscription**: mở terminal, chạy `claude`, gõ `/login`. Bot **bỏ hẳn** `ANTHROPIC_API_KEY` khỏi env
   của Claude (còn key là Claude Code ưu tiên key, âm thầm trả tiền API). Muốn dùng API thì đặt `PHIEN_DUNG_API=1`.
4. Thử tay: `node scripts/phien/bot.mjs --once` (làm hết việc đang chờ rồi thoát).
5. Chạy nền: `node scripts/phien/bot.mjs`. Cài tự chạy khi đăng nhập máy (sửa đường dẫn repo):
   ```
   schtasks /create /tn "BKdemy Phien Claude" /sc onlogon /tr "cmd /c cd /d C:\path\to\bkdemy-erp-v2 && node scripts\phien\bot.mjs >> scripts\phien\bot.log 2>&1"
   schtasks /create /tn "BKdemy Phien Luoi Vot" /sc minute /mo 15 /tr "cmd /c cd /d C:\path\to\bkdemy-erp-v2 && node scripts\phien\bot.mjs --once >> scripts\phien\bot.log 2>&1"
   ```

## Khi có chuyện

| Màn hiện | Nguyên nhân | Xử lý |
|---|---|---|
| "Claude mất liên lạc" | bot chết / máy tắt / mất mạng | xem cuối `scripts/phien/bot.log`; `schtasks /run /tn "BKdemy Phien Claude"` |
| "Claude chưa đăng nhập" | login subscription hết hạn | `claude` → `/login`, rồi chạy lại bot |
| "Claude nghỉ tới hh:mm" | chạm hạn mức subscription | tự chạy lại khi tới giờ; việc không mất |
| Tin báo lỗi đỏ | lượt hỏng 2 lần (timeout, lỗi lạ) | đọc dòng lỗi; nhắn lại câu mới |

## Ranh giới an toàn (đừng nới)

- Claude chỉ được `Read/Grep/Glob` (repo + thư mục tài liệu) và **đúng một** lệnh Bash ghi: `node scripts/phien/ban-do.mjs`.
  Không Write/Edit, không Bash tự do, không WebFetch, **không đọc `.env*`**.
  - Đo thật 01/11 (Claude Code 2.1.316, `-p`): Claude Code **tự cho** các lệnh Bash CHỈ ĐỌC (`cat`, `head`, `ls`…) dù không có trong
    danh sách — chấp nhận được (chỉ đọc). Luật chặn `Read(.env*)` áp cả cho `cat/grep/head .env.local` và cho Grep (file `.env*` bị bỏ
    qua, không lộ) ⇒ khoá trong `.env.local` không tới tay Claude. Heredoc `<<'HET'` vẫn khớp quyền `Bash(node scripts/phien/ban-do.mjs:*)`.
- `ban-do.mjs` lấy mã phiên từ biến `PHIEN_ID` do bot đặt — không từ tham số — nên Claude không trỏ sang phiên khác.
- Rào thật ở DB (`fn_phien_bd_*`, chỉ service_role gọi được): phiên phải đang mở; hàm **đóng vai người mở phiên** rồi
  kiểm lại "trưởng khối trở lên" của khối; mọi nút phải thuộc đúng khối; **không có lệnh xoá**.
- Trigger log bản đồ ghi actor = người mở phiên (họ ra lệnh). `claude_phien_ghi` giữ vết từng lệnh của Claude.
- Đừng thêm `Bash` tự do / `Write` vào `--allowedTools`, đừng đưa chuỗi kết nối DB cho Claude.
