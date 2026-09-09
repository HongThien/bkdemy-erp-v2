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
2. `.env.local` (gitignored) có `VITE_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE` +
   `ANTHROPIC_API_KEY` (cùng file `worker/troly.mjs` đang dùng — có rồi thì thôi).
3. Auth cho claude: bot **mặc định dùng `ANTHROPIC_API_KEY`** (trả tiền API per-token,
   không bao giờ chết vì login — daemon không người trông mà dựa login CLI là dính
   "Not logged in" định kỳ, đã dính ngay 29/08). Muốn ăn quota subscription thay vì
   trả API: `claude /login` trên máy chạy bot + đặt `HOIDAP_DUNG_LOGIN=1` vào `.env.local`.
4. Máy cài `claude` chỗ lạ (không phải `%USERPROFILE%\.local\bin\claude.exe`, không
   trong PATH) thì đặt `CLAUDE_BIN=đường\dẫn\claude.exe` vào `.env.local`.
5. Realtime (đường nhanh vài giây) cần bảng nằm trong publication — `claude_build`
   không đủ quyền nên migration chỉ cảnh báo. Chạy 1 lần trong Supabase SQL Editor:
   `alter publication supabase_realtime add table public.hoi_dap_nhan_su;`
   Chưa chạy thì bot vẫn hoạt động, độ trễ tối đa = chu kỳ quét 5 phút.

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

## Kho lệnh tra cứu (tools.mjs) — cách nuôi

Nguyên tắc (CEO 29/08): **AI chọn lệnh viết sẵn, không tự viết SQL** — `tools.mjs` là
danh mục (11 lệnh đầu: thieu_btvn · vang_hoc · bang_elo_exp · hoc_tap_hoc_sinh ·
hoc_phi_no · viec_dang_treo · buoi_hom_nay · tuyen_sinh_dem · diem_et · diem_mt · bo_tro),
`tracuu.mjs` là runner (read-only transaction, tham số parameterized). SELECT tự do
(`query.mjs`) chỉ là fallback khi chưa có lệnh khớp.

Thêm lệnh mới: viết 1 entry vào `tools.mjs` (khuôn có sẵn), chạy thử
`node scripts/hoidap/tracuu.mjs <ten_lenh> key=value` ra data đúng rồi mới commit.
Câu hỏi nào nhân sự hay hỏi mà bot phải dùng fallback → đó là ứng viên thăng cấp thành lệnh.

Hai bẫy schema đã dính khi viết 11 lệnh đầu (tránh lặp): `btvn_ket_qua.hoan_thanh/dung_han`
là cột đời cũ — tín hiệu thật là `trang_thai_nop`; `buoi_hoc` chỉ có dòng khi buổi ĐÃ MỞ —
lịch của ngày phải derive từ `thoi_khoa_bieu` (thu = isodow+1, 2=T2…8=CN).

## Ranh giới an toàn (đừng nới)

- **Claude không có tay ghi**: chỉ được `Read/Grep/Glob` (đọc repo). Mọi thao tác DB nằm
  trong `bot.mjs` (code cố định). Câu hỏi chứa chỉ thị phá hoại cũng không có đường thực thi.
- Câu hỏi đi vào claude qua **stdin**, không qua argv/shell — nội dung gõ gì cũng không thành lệnh.
- Đừng thêm `Bash`/`Write` vào `--allowedTools`, đừng đưa chuỗi kết nối DB cho claude —
  nới cái nào là mở lại đúng lỗ hổng cái đó.
