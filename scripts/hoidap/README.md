# Bot hỏi–đáp nhân sự — cài đặt & vận hành

Nhân sự hỏi trên ERP (tab **💬 Hỏi hệ thống** trong Việc của tôi) → câu hỏi vào bảng
`hoi_dap_nhan_su` → bot này (Claude Code, chạy máy local có repo) trả lời → hiện lại trên ERP.

Kiến trúc **2 đường nhận job** (chốt với CEO 29/08):
- **Đường nhanh**: `bot.mjs` chạy nền, subscribe Supabase Realtime — trả lời sau vài giây.
- **Lưới vớt**: Task Scheduler chạy `bot.mjs --once` mỗi 15 phút — listener chết thì hệ
  vẫn chạy, chỉ chậm đi, không mất câu nào. Claim atomic ở DB nên 2 đường không giẫm nhau.

## Yêu cầu trước khi chạy

1. Migration `202608291119_hoi_dap_nhan_su.sql` đã áp vào DB (`npm run migrate` — nhớ
   `npm run schema` + commit `schema.md` sau đó, theo CLAUDE.md §2.1).
2. `.env.local` (gitignored) có `VITE_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE`
   (cùng file `worker/troly.mjs` đang dùng — có rồi thì thôi).
3. `claude` CLI đã login trên máy này (gõ `claude` chạy được là được). ⚠ Login CLI
   **hết hạn định kỳ** — bot chết vì login thì heartbeat ngừng, ERP hiện "Bot mất liên
   lạc": mở terminal gõ `claude` login lại rồi chạy lại bot.

## Chạy tay (thử trước khi cài lịch)

```bash
node scripts/hoidap/bot.mjs --once
```

Chạy nền (listener):

```bash
node scripts/hoidap/bot.mjs
```

## Cài Task Scheduler (Windows, chạy 1 lần — PowerShell/CMD đều được)

Đường dẫn repo dưới đây sửa theo máy thật. **Listener** — tự chạy khi đăng nhập máy:

```bash
schtasks /create /tn "BKdemy HoiDap Listener" /sc onlogon /tr "cmd /c cd /d C:\path\to\bkdemy-erp-v2 && node scripts\hoidap\bot.mjs >> scripts\hoidap\bot.log 2>&1"
```

**Lưới vớt** — mỗi 15 phút quét job còn sót:

```bash
schtasks /create /tn "BKdemy HoiDap Luoi Vot" /sc minute /mo 15 /tr "cmd /c cd /d C:\path\to\bkdemy-erp-v2 && node scripts\hoidap\bot.mjs --once >> scripts\hoidap\bot.log 2>&1"
```

Chạy listener ngay không cần logout/login lại: `schtasks /run /tn "BKdemy HoiDap Listener"`.
Gỡ: `schtasks /delete /tn "BKdemy HoiDap Listener" /f` (tương tự cho Lưới Vớt).

## Khi có chuyện

| Triệu chứng | Nguyên nhân thường gặp | Xử lý |
|---|---|---|
| ERP hiện "Bot mất liên lạc" | Listener chết / máy tắt / login CLI hết hạn / hết quota | Xem cuối `scripts/hoidap/bot.log`; login lại `claude` nếu cần; `schtasks /run /tn "BKdemy HoiDap Listener"` |
| Câu hỏi `failed` | Câu đó lỗi 2 lần liên tiếp (timeout, claude trả rỗng) | Đọc cột `error` của dòng đó; hỏi lại câu mới |
| Câu treo `pending` mà bot "đang chạy" | Realtime rớt event | Tự hết trong ≤15' (lưới vớt); muốn ngay thì chạy `--once` |
| Trả lời trùng/2 lần | Không xảy ra được — claim atomic `where trang_thai='pending'` | — |

## Ranh giới an toàn (đừng nới)

- **Claude không có tay ghi**: chỉ được `Read/Grep/Glob` (đọc repo). Mọi thao tác DB nằm
  trong `bot.mjs` (code cố định). Câu hỏi chứa chỉ thị phá hoại cũng không có đường thực thi.
- Câu hỏi đi vào claude qua **stdin**, không qua argv/shell — nội dung gõ gì cũng không thành lệnh.
- Đừng thêm `Bash`/`Write` vào `--allowedTools`, đừng đưa chuỗi kết nối DB cho claude —
  nới cái nào là mở lại đúng lỗ hổng cái đó.
