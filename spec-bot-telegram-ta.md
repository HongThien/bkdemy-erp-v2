# Bot Telegram cho Trợ giảng — spec

> Thùy chốt 14/10/2026. Đọc file này trước khi sửa bất cứ phần nào của bot (webhook, bản tin 8h, tổng kết 24h, màn duyệt).
> Nối với: `spec-cham-cong-ta.md` (chấm công + lương TA) · hệ Gậy (`gay_de_xuat`, `gay_ledger`).

## 0. Mục tiêu

TA đã dùng Telegram (Thùy yêu cầu). Bot biến nhóm Telegram thành **vòng lặp hằng ngày**:

1. **08:00** — bot đăng lên nhóm: mỗi TA còn việc tồn ⇒ một tin, liệt kê việc tồn lấy từ ERP, tag người phụ trách khối.
2. **Trong ngày** — TA trả lời ngay dưới tin của mình, người phụ trách khối vào trao đổi. Bot **ghi mọi tin vào DB ngay lúc gửi**.
3. **24:00** — Claude đọc trao đổi của từng TA ⇒ bảng tổng kết có cấu trúc (theo từng việc) ⇒ chờ **Trang duyệt**.
4. Kết quả duyệt dùng cho **(a) đánh gậy** và **(b) bản tin 8h hôm sau**.

Hệ quả: Claude nắm toàn bộ ngữ cảnh vận hành của từng TA — đối chiếu được với chấm công (`spec-cham-cong-ta.md`) để đánh giá.

**Đứng trên vai:** mô hình *async standup bot* (Geekbot, Standuply). Khác: bot không hỏi "hôm nay làm gì" chung chung
mà đưa **danh sách việc tồn THẬT từ ERP** ⇒ mỗi câu trả lời bám một việc cụ thể (khoá `ref_key`), đối chiếu được.

## 1. Quyết định đã chốt (Thùy 14/10)

| # | Câu hỏi | Chốt |
|---|---|---|
| 1 | Giờ | Bản tin **08:00**, chốt tổng kết **24:00** (giờ VN) |
| 2 | Nhóm | **1 nhóm chung** tất cả TA (chia nhóm để sau) |
| 3 | Người trao đổi | **Mỗi khối một người phụ trách** — lấy từ `phan_cong_khoi` (khoi × mon), không bảng mới |
| 4 | Kết quả duyệt dùng vào | **Đánh gậy** + **bản tin hôm sau** |
| 5 | Loại việc | **Mọi việc** của TA |

## 2. Quyết định kỹ thuật (CTO tự quyết, R2)

- **Ghi tin bằng webhook, không bằng `getUpdates`.** Telegram chỉ giữ update cho bot **24 giờ**, và Bot API **không đọc lại
  được lịch sử nhóm**. Không ghi ngay = mất. Webhook `api/tg-webhook.mjs` (Vercel) → RPC secret-gated ghi DB.
- **Bot phải tắt privacy mode** (BotFather `/setprivacy` → Disable) **rồi mới thêm vào nhóm** (đổi sau khi đã vào nhóm
  thì phải kick và thêm lại). Bật privacy ⇒ bot chỉ thấy lệnh `/` và tin trả lời bot ⇒ mất phần lớn trao đổi, im lặng.
- **Danh tính = `tg_user_id` nối với `nhan_su.id`** qua mã dùng-1-lần (nút "Kết nối Telegram" trong app TA →
  `t.me/<bot>?start=<mã>`). **Không đoán theo tên hiển thị / username** (đổi được, trùng được — §2 "danh tính bám khoá").
- **Mỗi TA một tin** trong bản tin ⇒ cuộc trao đổi tự gắn đúng người qua chuỗi reply. Tin không reply ⇒ gắn theo người gửi.
- **Danh sách việc tồn = 1 hàm DB duy nhất** `fn_tg_viec_ton(p_ngay)` (CLAUDE.md §2.0) — gom từ các nguồn đã có, không
  viết công thức "việc chưa xong" thứ hai. Mỗi việc mang `ref_key` = **khoá tự nhiên** của việc (cùng khoá với
  `gay_de_xuat.ref_key`, vd `vh:<buoi>|et|<ns>`) ⇒ tổng kết ↔ gậy nối bằng khoá, không bằng vị trí.
- **Việc đã xong tự biến mất** khỏi bản tin hôm sau (tính lại từ ERP) — không ai phải "đánh dấu xong trên Telegram".
- **Claude đọc lúc 24:00 = Claude API** (cron Vercel, `ANTHROPIC_API_KEY` đã có — cùng khuôn `api/troly.mjs`).
  Gọi theo từng TA (ngữ cảnh nhỏ, lỗi 1 TA không hỏng cả lượt). Model mặc định `claude-sonnet-5-5`.
  ⚠ Nội dung chat của TA đi qua Anthropic API.
- **AI gợi ý → người xác nhận** (CLAUDE.md §5): Claude **không** tự đánh gậy, không tự kết luận về TA. Mọi tác động
  lên gậy đi qua Trang duyệt.
- **Bản tin 8h dùng tổng kết hôm trước kể cả khi Trang chưa duyệt** cho phần *lời hẹn* (đó là lời của chính TA, ghi nguyên);
  phần *gậy* chỉ hiện sau khi Trang duyệt.
- **Telegram giới hạn ~20 tin/phút vào cùng 1 nhóm** ⇒ bản tin gửi giãn ~3 giây/tin; 20 TA ≈ 1 phút (trong trần thời gian function).
- Cron trong `vercel.json` áp cho MỌI project cùng repo ⇒ handler thoát 204 nếu thiếu `TG_BOT_TOKEN` (chỉ khai trên project TA),
  y khuôn `api/ta-nhac-viec.mjs`.
- Giờ cron (UTC): 08:00 VN = `0 1 * * *` · 24:00 VN = `0 17 * * *`.

## 3. Luồng chi tiết

### 3.1 Bản tin 08:00 (`api/tg-ban-tin.mjs`)
1. Gọi `fn_tg_ban_tin(p_secret, p_ngay)` → danh sách theo TA: việc tồn (từ `fn_tg_viec_ton`) + kèm từ tổng kết hôm trước:
   lời hẹn của TA (*"hẹn xong 15/10"*), hẹn đã quá mà chưa xong, quyết định gậy Trang đã duyệt.
2. Tin đầu (tiêu đề): *"Bản tin 15/10 — 12 TA còn việc · 5 TA sạch việc ✅ (tên…)"* + TA chưa kết nối Telegram.
3. Mỗi TA còn việc ⇒ 1 tin: tag TA (text mention theo `tg_user_id`; chưa kết nối ⇒ ghi tên thường) + tag người phụ trách
   các khối liên quan; liệt kê việc (loại · lớp · ngày gốc · trễ bao lâu), nhóm theo khối.
4. Ghi lại **bản tin đã đăng** (`tg_ban_tin`: ngày, TA, message_id, snapshot danh sách việc kèm `ref_key`) — bất biến,
   để sau biết hôm đó đã hỏi đúng những gì (ERP đổi sau đó không làm sai lịch sử).
5. Idempotent: đã đăng ngày đó cho TA đó thì không đăng lại (unique `(ngay, nhan_su_id)`).

### 3.2 Trong ngày (`api/tg-webhook.mjs`)
- Xác thực header `X-Telegram-Bot-Api-Secret-Token`. Trả 200 ngay.
- `/start <mã>` trong chat riêng ⇒ nối tài khoản, bot trả lời xác nhận tên nhân sự.
- Tin nhóm ⇒ append `tg_tin` (nguyên văn + raw JSON, `reply_to`, người gửi đã resolve sang `nhan_su_id` nếu đã nối).
- Tin bị sửa ⇒ append bản sửa (không đè bản gốc). Ảnh/file ⇒ ghi caption + `file_id` (chưa tải về).

### 3.3 Tổng kết 24:00 (`api/tg-tong-ket.mjs`)
1. Với mỗi bản tin của ngày: gom **luồng trao đổi** = mọi tin trong chuỗi reply của tin bản tin đó + tin không-reply của chính TA
   trong ngày. Tin đến sau 24:00 vẫn thuộc luồng (theo chuỗi reply) và vào tổng kết hôm sau.
2. Claude nhận: danh sách việc (snapshot, có `ref_key`) + luồng trao đổi + **trạng thái ERP hiện tại** của từng việc
   (đã đóng chưa, lúc nào) + công đã khai hôm đó (`ta_cham_cong` / `ta_cong_viec`).
3. Claude trả JSON theo từng việc:
   `ref_key · tinh_trang` ∈ {`da_xong` (TA báo xong) · `hen` (hẹn ngày) · `ly_do` (giải thích, chưa hẹn) · `khong_phan_hoi` · `khac`}
   `· hen_den · ly_do (tóm tắt) · trich_dan (message_id) · lech_erp (mô tả mâu thuẫn, rỗng nếu không) · de_xuat_gay` ∈ {`danh` · `bo_qua` · `chua_den_luc`}.
   Thêm 1 dòng `chung` cho ý không gắn việc cụ thể (TA xin nghỉ, báo vấn đề…).
4. Ghi `tg_tong_ket` (trạng thái `cho_duyet`) — **thà để trống còn hơn đoán** (§1.5): không chắc việc nào ⇒ `khac`, không gán bừa.

**Đối chiếu chéo (triangulation §5) — Claude phải nêu cờ `lech_erp` khi:**
TA báo xong mà ERP chưa đóng · TA báo nghỉ mà có checkin · hẹn ngày X đã qua mà việc vẫn mở · TA khai công việc Y mà việc Y vẫn tồn.

### 3.4 Trang duyệt (màn ERP, cạnh màn duyệt chấm công)
- Mặc định mở ngày hôm qua; mỗi TA một khối; mỗi việc một dòng: việc · TA nói gì · trích dẫn (bấm xem luồng gốc) · cờ lệch · đề xuất gậy.
- Duyệt **cả lượt** như chấm công (§9 `spec-cham-cong-ta.md`): đọc lướt, sửa dòng sai, bấm duyệt hết phần còn lại.
- Sửa được: `tinh_trang`, `hen_den`, quyết định gậy. Mọi đổi ghi vết bằng trigger (actor + cũ/mới).
- **Nối gậy:** việc có `gay_de_xuat` đang `cho` cùng `ref_key` ⇒ quyết định của Trang đi qua **đúng đường quyết định gậy
  đang có** (không viết đường ghi gậy thứ hai): `bo_qua` ⇒ đề xuất `bo_qua` với `ly_do_bo_qua` = lý do TA đã được chấp nhận;
  `danh` ⇒ đánh như màn Gậy. `chua_den_luc` ⇒ để nguyên, hôm sau xét lại.
- Sau mutation: vá dòng tại chỗ (CLAUDE.md §2 React).

## 4. Dữ liệu (dự kiến — chốt khi viết migration)

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `tg_lien_ket` | `nhan_su_id` ↔ `tg_user_id` | unique cả 2 phía; đổi máy/tài khoản ⇒ dòng mới, giữ lịch sử |
| `tg_ma_lien_ket` | mã dùng 1 lần | hết hạn 30 phút |
| `tg_nhom` | nhóm bot hoạt động | `chat_id`, vai `ta_chung` |
| `tg_tin` | tin thô | PK `(chat_id, message_id, phien_ban)`, append-only, trigger chặn sửa/xoá |
| `tg_ban_tin` | bản tin đã đăng | snapshot việc + `message_id`, bất biến |
| `tg_tong_ket` | tổng kết theo việc | `trang_thai` `cho_duyet`/`da_duyet` + trigger log |

Hàm: `fn_tg_viec_ton` · `fn_tg_ban_tin` · `fn_tg_nhan` (webhook, secret) · `fn_tg_luong_trao_doi` · `fn_tg_ghi_tong_ket` (secret) ·
`fn_tg_tong_ket_ngay` (màn duyệt) · `fn_tg_duyet` (RPC transactional: duyệt + ghi gậy cùng transaction).
Quyền duyệt = `ta_cong_duyet` (Core team: Thùy, Trang, Lộc). Revoke `anon` trên mọi hàm không secret-gated.

**Nhãn môn (§1.6):** tin nhắn là dữ liệu vận hành (không nhãn môn). Mỗi *việc* trong bản tin/tổng kết mang `mon` + `khoi`
của lớp — người phụ trách tra theo `(mon, khoi)` trong `phan_cong_khoi`.

## 5. "Mọi việc" — nguồn gom vào `fn_tg_viec_ton`

| Loại | Nguồn có sẵn |
|---|---|
| Chấm bài trên lớp · ET · BTVN | `fn_viec_buoi_thuong(…, true)`, `tab in ('ingame','et','btvn')`, `dong_at is null` |
| Bổ trợ (yếu · bù · đuổi) | nguồn của `fn_btyeu_dem` (cần bản trả danh sách, không chỉ số đếm) |
| Duyệt HS báo sai | hiện tính ở client (`gami.ts`) — **phải đưa xuống DB trước** (§2.0) |
| Chấm công | `fn_ta_buoi_thieu_cong` (buổi/ca chưa ghi công) · ca quên checkout · ca bị trả lại cần khai lại |

⚠ Kiểm trước khi build: tổng số việc mỗi TA của `fn_tg_viec_ton` phải **khớp nội dung** (không chỉ số lượng) với badge app TA.

## 6. Thứ tự build

1. **B1** — migration bảng + `fn_tg_viec_ton` (test: so từng `ref_key` với app TA của 3 TA thật).
2. **B2** — bot + webhook + nối tài khoản (nút trong app TA). *Cần Thùy tạo bot trước, xem §7.*
3. **B3** — bản tin 08:00 (chạy thử vào nhóm test trước, rồi nhóm thật).
4. **B4** — tổng kết 24:00 (chạy tay vài ngày, Thùy/Trang xem chất lượng trước khi bật cron).
5. **B5** — màn duyệt của Trang + nối gậy.
6. **B6** — bản tin dùng tổng kết hôm trước (lời hẹn, gậy đã duyệt).

## 7. Việc của Thùy (Claude không làm được)

1. Telegram → **@BotFather** → `/newbot` → đặt tên (vd *BK Trợ giảng*) + username (kết thúc bằng `bot`).
2. `/setprivacy` → chọn bot → **Disable**. (Làm TRƯỚC khi thêm vào nhóm.)
3. Thêm bot vào nhóm TA, cho làm **quản trị viên**.
4. Token bot: **không dán vào chat**. Thêm dòng `TG_BOT_TOKEN=...` vào `.env.local` của máy công ty (Claude dùng để test),
   và khai biến cùng tên trên Vercel project app TA.
5. (Nên có) một **nhóm test** nhỏ (Thùy + 1–2 người) để chạy B3/B4 trước khi vào nhóm thật.

## 8. Còn mở

- Chấm công: tổng kết có nên **đề xuất việc ngoài lịch** cho Trang (TA kể làm việc X mà không khai công)? — để sau B4, xem dữ liệu thật.
- Khi đông TA: tách nhóm theo khối (bảng `tg_nhom` đã chừa cột vai).
