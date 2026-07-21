# PLAN — Ôn tập trong BTVN (spaced repetition tầng LỚP), theo `spec-btvn-ontap.md`

> PHA 0 xong — đọc spec, verify DB thật (`information_schema.columns`, `pg_tables.rowsecurity`, `pg_constraint`,
> `pg_policies`), đọc thật `tailieu.ts`/`TaiLieuBuilder.tsx`/`mastery.ts`/`PrintView.tsx`/`KetQuaScreen.tsx`.
> §10 (5 câu hỏi mở): 4 câu đã hỏi Thùy — trả lời ở mục 2. Câu #5 (số dòng kẻ mặc định) tự quyết theo R2:
> `DEFAULT_BTVN_LINES` (tailieu.ts:24) sẵn là **5** — dùng luôn, không cần default riêng.
> Bản này để Thùy duyệt trước khi code + chạy migration (Claude chỉ có `claude_ro`, không tự chạy được).

---

## 1. Reuse map (đã verify code + DB thật)

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| `tai_lieu_phan.loai_phan` CHECK | ✅ Không cần migration | `pg_constraint` xác nhận **KHÔNG có CHECK constraint thật** trên cột này (chỉ là comment/TS union trong code). Thêm `'ontap'` chỉ cần sửa `PhanLoai` type (tailieu.ts:16). |
| `groupBuois`/`BuoiUI` | ⚠ Private, cần export | Đang nằm riêng trong `TaiLieuBuilder.tsx:19-31`, khác `groupBuoi` (số ít, private trong `tailieu.ts:246`, dùng cho `usedCausOfBuoi`/`setDangOfBuoi`). Bước 1 của engine cần duyệt các buổi TRƯỚC buổi đang gán — dùng `listPhan(masterId)` + logic tương tự `groupBuoi` lặp qua nhiều mốc, KHÔNG cần export `groupBuois` của Builder (viết 1 hàm nhỏ riêng trong `ontap.ts`, tránh đụng Builder — đúng "không sửa builder master"). |
| `getMasteryByDang(scope, mucDo)` | ✅ Dùng thẳng | `mastery.ts` — `RollupScope = {mon, lopId?, khoi?, he?, includeBTVN?}`. Pivot view ④ (`KetQuaScreen.tsx:724`) gọi **KHÔNG set `includeBTVN`** (mặc định falsy → chỉ ET+MT). Engine ôn tập sẽ gọi **giống hệt** (không set `includeBTVN`) — đúng yêu cầu spec "tái dùng logic pivot view ④", và tránh vòng lặp phản hồi (ôn tập tự đo bằng BTVN rồi lại dùng BTVN để chọn ôn tập tiếp theo). |
| `usedCausOfBuoi(taiLieuId, buoiId)` | ✅ Dùng thẳng | Gọi với `(nguonId, buoiId)` — quét trên **master**, vì doc BTVN đích chưa tồn tại lúc gợi ý. |
| `suggestCauForDang(maDang, exclude, cauTbl)` | ✅ Dùng thẳng trong loop | Đã "ít-dùng-nhất trước", đúng nhu cầu Bước 4. Gọi 2 lần/dạng (loop, exclude tích luỹ dần) thay vì viết lại `cmpUsageLe`/`pickRoundRobinByNguon`. |
| `cauUsage`, `listCauByDang`, `khoCuaMon(mon)` | ✅ Dùng thẳng | Dispatch kho theo môn — engine nhận `mon` làm tham số, không tự đoán. |
| `DEFAULT_BTVN_LINES = 5` | ✅ Dùng thẳng | Trả lời câu hỏi mở #5 — không cần hằng số riêng cho ôn tập. |
| `trichXuatBuoi` — điểm chèn | ✅ Xác định rõ | Sau khối `if (opts.btvn && btvnPhans.length) { ...; out.push(nw) }` (tailieu.ts:483-487) — dùng `nw.id`, `t` tiếp tục đếm từ sau btvnPhans. |
| `getTaiLieuFull` — dạng resolve | ⚠ Cần sửa 2 chỗ | `dangMas` (dòng 351) và `dangLike` (dòng 367) đang lọc `loai_phan === 'dang' \|\| 'btvn'` — PHẢI thêm `'ontap'`, nếu không phan ôn tập sẽ không có `p.dang` (tên dạng, chuyên đề…) khi resolve → PrintView vỡ. |
| `getBTVNCaus` | ⚠ Cần sửa 1 dòng | Filter `loai_phan === 'btvn'` → thêm `\|\| 'ontap'`. Dùng bởi chấm (BtvnTab) + `phatHanhTest` (test online) — spec §7.2/§7.3 xác nhận cả 2 đều chỉ cần qua hàm này, không code riêng. |
| `PrintView.tsx` — `buildBuois`/`BtvnSheet` | ⚠ Cần thêm nhánh `ontap` | `buildBuois` (dòng 350-360) hiện gom `dang`/`btvn` — thêm mảng `ontaps: PhanResolved[]`, push khi `loai_phan==='ontap'`. `BtvnSheet` (dòng 481+) nhận thêm prop `ontaps`, render SAU khối btvn, header riêng "PHẦN ÔN TẬP", `bno` (số câu) tiếp tục đếm liên tục — không tạo counter mới. |
| RLS `tai_lieu`/`tai_lieu_phan`/`tai_lieu_cau` | ⚠ **Spec đoán SAI** — xem Phản biện A | Query `pg_tables.rowsecurity` + `pg_policies` thật: cả 3 bảng đều **RLS ENABLED**, policy `{table}_member_all` (`ALL`, qual/with_check = `la_thanh_vien()`). Spec §3.1 viết "RLS: theo convention data table (disable)" — **sai với DB thật**. Bảng mới `btvn_ontap_config` phải ENABLE RLS + policy giống hệt, không disable. |
| `nguon_buoi` kiểu dữ liệu | ⚠ Spec để "..." — đã xác định | `tai_lieu.nguon_buoi` là **`text`** (không phải `uuid`, dù giá trị nó lưu là 1 uuid string của `tai_lieu_phan.id` — xem `trichXuatBuoi` dòng 472: `nguon_buoi: buoiPhanId`). `btvn_ontap_config.nguon_buoi` phải cùng kiểu `text` để join/query nhất quán. |
| Bảng "tiên quyết" (tie-break Bước 3.1) | ❌ Chưa tồn tại | `grep` toàn repo không thấy `tien_quyet`/`spec-link-tienquyet`. Theo đúng chỉ dẫn của spec: bỏ tie-break này, để `// TODO(tienquyet)`, không chặn feature. |
| `SearchCau.tsx` reqId pattern | ✅ Tái dùng | Cho race-guard khi load gợi ý trong `TrichPanel` (đổi buổi/lớp nhanh). |
| `KhoPicker` (exported, `TaiLieuBuilder.tsx:393`), `DangPickerOne` | ✅ Tái dùng nguyên | Cho "✎ đổi câu" / "+ Dạng" trong `OnTapEditor`. |

---

## 2. Trả lời 4/5 câu hỏi mở §10 (Thùy đã chọn qua AskUserQuestion)

1. **Ngưỡng tin `đã_đo ≥ max(3, ⌈sĩ_số/3⌉)`** → **Giữ nguyên**.
2. **Cửa sổ né-câu-lớp-đã-làm** → **Rút ngắn còn 30 ngày** (spec đề xuất 60).
3. **Cân loại câu (ép ≥1 câu tự luận/TLN)** → **KHÔNG ép, để engine tự do theo pool** (least-used quyết định).
4. **Sửa ôn tập sau khi doc đã có phép đo** → **Chỉ cảnh báo (toast/confirm), KHÔNG chặn cứng**.
5. **Số dòng kẻ mặc định** → tự quyết theo R2: dùng `DEFAULT_BTVN_LINES` (=5) sẵn có, không định nghĩa số riêng.

---

## PHẢN BIỆN (đọc trước khi duyệt)

### A. ⭐ Spec đoán sai RLS — bảng mới phải ENABLE, không disable

Spec §3.1 viết thẳng "RLS: theo convention data table (disable)" và tự đóng khung đó là "convention". Nhưng
`pg_tables.rowsecurity` + `pg_policies` query trực tiếp DB cho thấy **`tai_lieu`, `tai_lieu_phan`, `tai_lieu_cau`
— 3 bảng anh em ruột của bảng mới — đều RLS ENABLED**, policy `la_thanh_vien()` áp cho mọi thao tác. Không có
bảng "data" nào trong nhóm `tai_lieu*` bị disable. Nếu làm theo đúng chữ spec, `btvn_ontap_config` sẽ là bảng
DUY NHẤT trong nhóm này hở RLS — lỗ hổng thật (ai đăng nhập cũng query/sửa config ôn tập lớp khác được qua
API trực tiếp, dù UI có chặn). **Đề xuất: ENABLE RLS + policy giống 3 bảng kia**, xem migration §3.

### B. Điểm chèn `trichXuatBuoi` phụ thuộc thứ tự — phải TEST re-trích nhiều lần

`mk()` xoá-rồi-tạo doc BTVN mỗi lần gán/re-gán (unique `loai+lop_id+ngay`). Vì `saveOnTapConfig` chạy TRƯỚC
`trichXuatBuoi` (đúng thứ tự spec §5 yêu cầu) và `trichXuatBuoi` tự đọc lại config mỗi lần — logic tự nhiên
idempotent, nhưng cần test tay: gán → sửa ôn tập qua modal (rebuild-tại-chỗ §8) → gán lại buổi đó lần nữa
(TrichPanel) → confirm config từ modal KHÔNG bị ghi đè bởi 1 lần "Gợi ý lại" cũ nào còn cache trong state UI.
Đây là chỗ dễ vỡ nhất theo kiểu "im lặng mất lựa chọn của GV" — sẽ verify tay ở bước E2E (§9.8).

### C. `getTaiLieuFull` sửa 2 chỗ, ảnh hưởng MỌI nơi gọi hàm này (không riêng ôn tập)

`dangMas`/`dangLike` là logic DÙNG CHUNG cho toàn bộ resolver (`layCauTheoThuTu`, mọi PrintView, BtvnTab…).
Thêm `'ontap'` vào 2 điều kiện lọc này là đổi 1 hàm lõi — rủi ro thấp (chỉ MỞ RỘNG tập hợp, phan `ontap` trước
đây không tồn tại nên không có doc nào bị ảnh hưởng ngược), nhưng cần chạy thử 1 doc BTVN cũ (chưa có ôn tập)
để confirm byte-level không đổi — đúng acceptance criteria "buổi không cấu hình → doc y hệt hiện tại".

---

## 3. Migration (chạy tay qua Supabase SQL Editor)

```sql
-- 01xx_btvn_ontap_config.sql
create table btvn_ontap_config (
  id           uuid primary key default gen_random_uuid(),
  nguon_id     uuid not null references tai_lieu(id) on delete cascade,
  nguon_buoi   text not null,
  lop_id       uuid not null references lop(id) on delete cascade,
  config       jsonb not null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid,
  unique (nguon_id, nguon_buoi, lop_id)
);

alter table btvn_ontap_config enable row level security;

create policy btvn_ontap_config_member_all on btvn_ontap_config
  for all using (la_thanh_vien()) with check (la_thanh_vien());
```

> Đã verify thật: `lop` là tên bảng đúng (`tai_lieu.lop_id` FK → `lop(id)`), policy 3 bảng anh em đều
> `{table}_member_all` / `la_thanh_vien()` — copy đúng convention. `updated_by` KHÔNG có FK (giống
> `tai_lieu.created_by`: cột `uuid` trần, không ràng buộc bảng nhân sự nào — theo đúng convention hiện tại).
> `nguon_id`/`lop_id` ở đây dùng `ON DELETE CASCADE` (khác `tai_lieu` dùng `SET NULL`) vì cột NOT NULL —
> config vô nghĩa khi mất master/lớp nên xoá theo, còn `tai_lieu` cố tình cho phép nullable để giữ lại doc.

---

## 4. Thứ tự build (giữ nguyên §9 spec)

1. ✅ Migration trên (Thùy chạy tay).
2. `src/lib/ontap.ts` — `goiYOnTap` (4 bước) + `getOnTapConfig`/`saveOnTapConfig`.
3. `trichXuatBuoi` (tailieu.ts) — append phan `ontap` sau btvn, revalidate câu còn tồn tại trong kho.
4. `getTaiLieuFull` — mở `dangMas`/`dangLike` cho `'ontap'`. `getBTVNCaus` — thêm `'ontap'` vào filter.
5. `PrintView.tsx` — `buildBuois` + `BtvnSheet` thêm khối "PHẦN ÔN TẬP", số câu liên tục — soi PDF bằng mắt.
6. `OnTapEditor` (component chung, file mới) — dùng trong `TrichPanel` (`BuoiTrichRow`, ngay dưới chọn ngày).
7. Modal "✎ Ôn tập" ở `KhoTaiLieuScreen` — bọc `OnTapEditor`, lưu = rebuild-tại-chỗ phan `ontap`.
8. E2E tay: gán có ôn tập → in → chấm → re-trích cùng buổi (config sống sót) → phát hành online → đủ câu.

Không đụng `TaiLieuBuilder.tsx` (master) — đúng non-goal.

---

## Open — chờ Thùy duyệt bản này (đặc biệt Phản biện A) rồi mới chạy migration + code.
