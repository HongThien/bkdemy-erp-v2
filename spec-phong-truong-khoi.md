# PHÒNG LÀM VIỆC TRƯỞNG KHỐI + PHIÊN CLAUDE — spec

> **Đọc file này TRƯỚC khi sửa phiên Claude (bảng `claude_phien*`, `scripts/phien/`) hoặc Phòng làm việc trưởng khối.**
> Thùy chốt qua chuỗi Sparring 30/10 → 01/11/2026. Bản paste-ready cho Notion = cả file này.
> Liên quan: `spec-truong-khoi.md` (phân quyền · hai tầng · KPI) · `kho-rules/README.md` (quy trình kho) · `spec-ban-do-4-tang.md` (bản đồ).

---

## 0. Vấn đề & đích

| | Trước | Đích |
|---|---|---|
| Đường đi | Trưởng khối → **Thùy** → Claude → **Thùy** → trưởng khối. Trưởng khối tự sửa tay cũng phải báo Thùy để Thùy bảo Claude "làm tiếp" | Trưởng khối **chat thẳng** với Claude, kiểu Claude Code |
| Vai Thùy | Trạm chuyển tin ở mọi vòng | **Cầm quyền phát động** (mở đợt, phát động giải bài) + hậu kiểm |
| Chỉ số đích | — | Số lần trưởng khối phải nhắn Thùy về bản đồ / kho → **0** |

Nhân sự hiểu bản đồ rất sâu — thứ thiếu chỉ là **đường nói với Claude**. Không phải "người không hiểu DB".

## 1. Đã chốt (Thùy)

| # | Chốt |
|---|---|
| 1 | **Claude làm**: draft bản đồ, lý thuyết dạng, giải bài, phân dạng. **Người duyệt.** (Thay luật cũ "bản đồ là việc của CEO" — `kho-rules/README.md` §0 đã sửa.) |
| 2 | Nhận xét / duyệt / **chốt** bản đồ: **trưởng khối trở lên** (Phó không). Luật giải mới: **trưởng khối gật là đủ**. |
| 3 | **Mọi việc duyệt, sửa về trưởng khối** (kể cả câu lời giải không chắc). Thùy chỉ **phát động**. Phát động giải bài **chưa giao** (logic phía sau phức tạp). |
| 4 | **Không pilot — làm mọi khối.** Nhưng chạy thử trước rồi mới tính VPS. |
| 5 | Giao tiếp = **khung chat như Claude Code**, chia **PHIÊN theo loại việc**: chọn loại việc → mở → làm → đóng → mở cái mới. Không rải ô chat lên từng nút bản đồ. |
| 6 | Claude chạy **trên máy Thùy**, bằng **subscription Claude Code** (không API). Test xong mới tính VPS. |
| 7 | **Mỗi bản đồ chỉ một phiên sửa tại một thời điểm.** |
| 8 | Bản đồ là **công cụ làm việc chính** của trưởng khối. Trưởng khối có **phòng làm việc riêng** trong ERP (ERP = sảnh chung). |
| 9 | Rủi ro "trưởng khối gộp dạng cho đẹp KPI" **không cần chặn** — bản đồ dùng chung toàn trung tâm, đổi cấu trúc là việc đại sự ai cũng thấy. (Kỹ thuật vẫn giữ: cấu trúc đổi ⇒ chuỗi KPI đánh dấu "gãy", không đem so.) |

## 2. Nghiệp vụ bản đồ & kho — 3 phase

```
PHASE 1 — BẢN ĐỒ          Claude draft → trưởng khối đọc, sửa tay / ra lệnh Claude sửa → lặp → CHỐT DẠNG
PHASE 2 — LÝ THUYẾT DẠNG  Claude draft lý thuyết · ví dụ · mô tả nhận biết → trưởng khối check, sửa → lặp → CHỐT
PHASE 3 — NHẬP KHO & PHÂN DẠNG (vòng xoáy, sau khi Thùy phát động giải cho khối)
   Claude đẩy câu vào kho ─┬─ đủ 3 điều kiện máy kiểm → TỰ DUYỆT
                           └─ không chắc / không phân được dạng → hàng của trưởng khối
                                 → sửa mô tả / thêm dạng (đụng ngược phase 1–2) → bảo Claude PHÂN LẠI → lặp
```

- **Tự duyệt** = đủ cả 3: dạng khớp mô tả và không dạng thứ hai ngang ngửa · lời giải đúng luật `kho-rules/<nhánh>/k<khối>.md` ·
  **kiểm độc lập khớp** (code tính lại hoặc model khác giải mù). "Chắc" KHÔNG phải Claude tự thấy chắc. (Đảo luật 09/09 "lời giải
  Claude ghi phải duyệt" — chờ Thùy xác nhận cứng khi mở Phase 3.)
- **Lưới an toàn**: trợ giảng **báo sai** ⇒ câu tự rút khỏi kho (spec-luong-kho §5.7) · trưởng khối xem mẫu nhỏ câu tự duyệt · tỉ lệ
  lọt vượt ngưỡng ⇒ khối đó tắt tự duyệt.
- **Vòng xoáy hội tụ nhanh**: Claude gom câu không chắc **thành cụm** theo lý do (không khớp dạng nào → đề xuất dạng mới · phân vân
  A/B → sửa mô tả · nghi đề lỗi); sửa mô tả dạng X ⇒ rà lại cả câu đã vào X; mỗi vòng báo số câu chưa phân (phải giảm dần).
- **Trợ giảng**: kiểm tra, báo sai — không có phiên chat.

## 3. Phiên Claude — logic

### 3.1 Vòng đời
```
[+ Phiên mới] → loại việc + (môn × khối) → chat → [Đóng phiên] → Claude viết TỔNG KẾT → đã đóng (mở lại được)
```
- **Loại việc = "skill" của phiên**: mỗi loại nạp sẵn đúng ngữ cảnh + đúng bộ công cụ (`scripts/phien/loai/<loai>.md`).
  `ban_do` (Phase 1) · `ly_thuyet` (Phase 2) · `nhap_kho` (Phase 3) · `bao_sai` (câu bị báo sai) · `giai_bai` (Thùy).
- Hai đường trong một phiên: **(A)** ra lệnh → Claude sửa → báo đã sửa gì · **(B)** tự sửa tay trên màn Bản đồ → nhắn "làm tiếp" →
  Claude đọc thay đổi (biết dòng nào "SỬA TAY", dòng nào do Claude) → làm tiếp → báo.

### 3.2 Luật
1. **Phiên khoá vào (môn × khối).** Claude chỉ đụng được khối đó.
2. **Rào cứng ở DB, không ở lời dặn Claude.** Mọi lệnh ghi qua `fn_phien_bd_*` (chỉ service_role): phiên đang mở · **đóng vai người
   mở phiên** rồi kiểm lại "trưởng khối trở lên" (AI không bao giờ có quyền lớn hơn người nhờ nó; mất phân công giữa chừng ⇒ lệnh sau
   bị chặn) · nút phải thuộc đúng khối · **không có lệnh xoá** (Claude đề xuất, trưởng khối xoá tay — Luật xoá).
3. **Claude của trưởng khối hẹp hơn Claude của Thùy**: Read/Grep/Glob (repo + thư mục tài liệu) + đúng một lệnh Bash
   `node scripts/phien/ban-do.mjs`. Không Write/Edit, không Bash tự do, không đọc `.env*`.
4. **Đóng phiên là quên** ⇒ bài học phải ghi ra ngoài: Claude đề xuất luật cho `k<khối>.md`, trưởng khối gật. (Bản thử: Claude chưa có
   tay ghi file luật — đề xuất nằm trong chat/tổng kết.)
5. **Mã gốc bất biến**: đổi tên, chuyển chỗ, sắp xếp đều giữ mã. Log bản đồ ghi actor = người mở phiên; `claude_phien_ghi` giữ vết
   từng lệnh của Claude.
6. **Mỗi lệnh kết thúc bằng một trong ba**: đã làm xong · không làm, vì… · đang chờ trả lời. Không lệnh nào bị im.

### 3.3 Gần realtime
- **Nhận ngay** (DB) → **"Claude đang đọc, đang làm…"** (việc đã được bot nhận) → **chữ chạy dần** (bot đẩy chữ ~1 giây/lần) +
  dòng thao tác mờ "🗺 bản đồ: them_nhom …" → báo xong.
- Một phiên một tiến trình Claude; tin gõ thêm lúc Claude đang bận được gom vào lượt sau (như Claude Code xếp hàng tin).
- **Subscription**: chung hạn mức với việc riêng của Thùy ⇒ mặc định 1 phiên chạy cùng lúc; chạm trần ⇒ màn ghi "Claude nghỉ tới
  hh:mm", việc không mất. Máy Thùy tắt ⇒ "Claude mất liên lạc", tin vẫn giữ. Việc nặng (giải lô) nên dồn ban đêm (Phase 3).

## 4. Phòng làm việc trưởng khối

- **Sảnh (ERP chung)** thiết kế cho mọi người, tới việc nhỏ nhất. **Phòng** cắt đúng theo việc của ghế trưởng khối.
  Việc vận hành của bản thân đi được cả hai đường.
- **Phòng là lối đi tắt, không phải bản sao**: mỗi ô mở đúng màn/hàm đang có; không số riêng, không logic riêng.
- Phòng **theo ghế**, là **khuôn dùng lại** (về sau Trang có phòng y hệt, phạm vi toàn hệ).
- Ba việc của trưởng khối: ① vận hành (ERP sẵn có, không thuộc phòng) · ② **học thuật & chất lượng** (bản đồ · kho · dashboard học
  tập · phiên Claude) · ③ **quản trị** như Trang thu nhỏ (BTVN/ET/dữ liệu đủ chưa · bổ trợ · gậy).
- Đích bố cục: **Hôm nay** (một hàng việc suy theo invariant) · **Học thuật** · **Quản trị** · cửa sang việc vận hành của tôi.

## 5. Bản thử đã dựng (01/11) — mig `202611011822`

| Phần | Chỗ |
|---|---|
| Bảng `claude_phien` · `claude_phien_tin` · `claude_phien_ghi` · `claude_phien_lich_su` · `claude_phien_bot` + RLS | migration |
| RPC người: `fn_phien_pham_vi` · `fn_phien_mo` · `fn_phien_gui` · `fn_phien_dong` · `fn_phien_mo_lai` · `fn_phien_ds` | migration |
| RPC Claude (service_role): `fn_phien_bd_xem` · `fn_phien_bd_ghi` · `fn_phien_bd_thay_doi`; bot: `fn_phien_bot_nhan` · `_tra` · `_nhat_mo_coi` | migration |
| Bot chạy máy Thùy (Realtime + quét vớt + heartbeat, subscription, chữ chạy) | `scripts/phien/bot.mjs` · README cùng thư mục |
| Tay ghi duy nhất của Claude | `scripts/phien/ban-do.mjs` |
| Hướng dẫn cho Claude | `scripts/phien/CHUNG.md` · `scripts/phien/loai/ban_do.md` |
| Lá **🧑‍💼 Phòng làm việc trưởng khối** (`phong_tk`): 🤖 Phiên Claude · 🗺 Bản đồ (màn Bản đồ mới) · 📋 Quản trị (dạng yếu + báo cáo sư phạm) | `src/screens/phongtk/` · `src/lib/phien.ts` |

Đã kiểm trên Postgres 16 dựng tạm (stub các hàm phụ thuộc): mở phiên · chặn phiên thứ hai cùng bản đồ · chặn Phó / khối khác / loại việc
chưa mở · bot nhận 2 tin một lượt, không nhận chồng · Claude ghi đủ 8 lệnh · chặn chéo khối, mã lạ, tên trống, tiêm SQL qua tên và loại
nút · actor log = người mở phiên · `thay-doi` tách SỬA TAY / CLAUDE · đóng phiên → tổng kết → đóng; tổng kết hỏng 2 lần vẫn đóng ·
hạn mức trả việc không tính lần · mất phân công giữa chừng ⇒ chặn · `anon` không gọi được gì. **Chưa** kiểm trên DB thật + app thật.

**Chưa làm (theo thứ tự đề xuất):** Phase 2 `ly_thuyet` (lệnh sửa lý thuyết/ví dụ) → Phase 3 `nhap_kho` (gom cụm câu không chắc, tự duyệt
3 điều kiện, đo lọt) → `bao_sai` (nối báo sai → rút khỏi kho → hàng trưởng khối) → hàng việc "Hôm nay" trong phòng → Claude ghi luật khối
(đề xuất → trưởng khối gật → file luật) → nút "Dừng" lượt đang chạy → kiểm phiên bản trước khi ghi (chống ghi đè khi người sửa tay cùng
lúc — hiện mới dựa "một phiên một bản đồ").

## 6. Chạy thử (máy Thùy)

`scripts/phien/README.md`: `npm run migrate` → `npm run schema` (commit `schema.md`) → `claude` + `/login` → `node scripts/phien/bot.mjs --once`
để thử → chạy nền. Trên ERP: lá **Phòng làm việc trưởng khối** (vai trò Core team · Quản lý chất lượng · Quản lý môn).
