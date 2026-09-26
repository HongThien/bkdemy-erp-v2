# spec-su-kien.md — Hệ thống tổ chức SỰ KIỆN (Trung thu 26/09/2026 + các sự kiện sau)

> Trạng thái (26/09 ~03h30): **ĐÃ BUILD + ĐÃ ÁP DB + ĐÃ DEPLOY app riêng `bkdemy-erp-v2-sukien.vercel.app`** · test app thật đủ
> luồng trên sự kiện "TEST (xoá được)" (đã đóng) · **CHƯA test với iPad thật** (Thùy test 26/09) — xem §10. Mục §1–§6 là
> yêu cầu gốc 25/09; các thay đổi sau đó ở §7–§9 (§9 THẮNG §1 nếu lệch: bỏ Quầy quà, thêm Bàn quay, tách Đăng ký game).
> Dữ liệu **KHÔNG gắn môn** (vận hành, không phải học tập — §1.6). Tiền tệ **riêng của sự kiện**, KHÔNG đụng ví `qlht_xu_ledger`.
> Tên gọi quốc tế: **event check-in + virtual queue** (kiểu hàng đợi ảo Disney FastPass / waitlist nhà hàng).

---

## 1. Quyết định CEO (25/09)

| # | Chủ đề | Chốt |
|---|---|---|
| 1 | Hạn | Chạy thật **ngày mai 26/09**, làm bản đầy đủ |
| 2 | Quy mô | BK >300 HS, dự **~100–160** + HS ngoài |
| 3 | Tổng quát | Các sự kiện sau vận hành **y như nhau** → cấu hình theo sự kiện, không code cứng Trung thu |
| 4 | Check-in | **Nhân sự trực bấm** trên laptop (HS không tự thao tác) |
| 5 | Tìm HS BK | Theo **tên** (lấy từ `hoc_sinh` DB BK) |
| 6 | HS ngoài BK | Chỉ ghi **tên**; hệ **cấp số thứ tự** (#37) để phân biệt trùng tên — quản trò hô "Lan số 37" |
| 7 | Check-in bắt buộc? | **Không.** HS ngoài không check-in được nhưng **vẫn đăng ký game** |
| 8 | Xu | **Tiền tệ riêng của sự kiện** (không vào ví BK). HS ngoài cũng nhận xu như thường |
| 9 | Vòng quay | Chỉ HS BK **đã check-in**, **1 lần/sự kiện**: 15 / 20 / 25 xu, tỉ lệ **70 / 20 / 10 %** (Thùy 26/09; trước 25/50/25) — **KHÔNG công bố**: vòng quay chia ô ĐỀU 3 mức, tỉ lệ thật chỉ ở fn_sk_quay |
| 10 | Màn quay | Check-in trên **laptop**, vòng quay hiện trên **TV riêng** đặt gần đó |
| 11 | Phí chơi | Đăng ký game **miễn phí** |
| 12 | Phòng | Nhiều phòng chơi, nhưng **chỉ 1 phòng dùng hàng đợi** (phòng iPad). Vẫn thiết kế theo `phong` để sau thêm được |
| 13 | 1 lần vào phòng | = **3 ván liền**; **xu trả NGAY sau mỗi ván** (Nhất 5 · Nhì 3 · còn lại 2), quản trò không giữ/cộng dồn gì; **đủ 3 ván lượt tự kết thúc** (Thùy 26/09 chiều — trước đó: cộng tổng 3 ván rồi bấm Kết thúc) |
| 14 | Xếp hàng | Mỗi HS chỉ **1 chỗ chờ** tại 1 thời điểm; chơi xong **đăng ký lại được**, không giới hạn |
| 15 | Mỗi lượt | Tối đa **6 HS** mọi game; quản trò chủ động bắt đầu khi <6 |
| 16 | Bỏ qua | HS vắng lần 1 → **giữ vị trí**, được gọi lại thêm 1 lần; vắng lần 2 → **loại khỏi hàng** (đăng ký lại từ đầu nếu muốn) |
| 17 | Gọi HS | **Quản trò hô** là chính; **có màn TV thông báo** hàng chờ |
| 18 | Kết quả | Lấy **từ iPad** tự động (fallback: quản trò nhập tay/trả thẳng) |
| 19 | Quản trò | **Nhân sự ERP** (đăng nhập tài khoản ERP) |
| 20 | Thiết bị | Check-in: **laptop** · Quản trò: **điện thoại** · Wifi ổn |
| 21 | Tiêu xu | **Đổi quà tại quầy** → cần màn trừ xu + số dư từng HS |

---

## 2. Luồng vận hành

```
[Cửa] Laptop check-in (nhân sự)
  ├─ HS BK: gõ tên → chọn → CHECK-IN ──► bấm QUAY ──► TV vòng quay chạy → +15/20/25 xu
  ├─ HS ngoài: gõ tên → cấp số #N (không check-in, không quay)
  └─ ĐĂNG KÝ GAME (cả 2 loại) ──► vào hàng chờ phòng iPad
                                        │ realtime
[Phòng iPad] Điện thoại quản trò        ▼
  Danh sách chờ (theo thứ tự) → hô tên → ✔ Có mặt  /  ✖ Bỏ qua (lần 2 = loại)
  Đủ 6 (hoặc quản trò quyết) → BẮT ĐẦU → HS được gán slot iPad 1..6
  Mỗi ván xong → xu vào ví sự kiện ngay (fn_sk_tra_xu_van) → đủ 3 ván lượt TỰ kết thúc, HS rảnh, đăng ký lại được
                                        │ realtime
[TV hàng chờ] "Đang chơi: … · Mời vào: … · Đang chờ: N bạn"   (+ đồng thời số liệu hiện ở laptop check-in)

[Quầy quà] Nhân sự tìm HS (tên / số) → xem số dư → trừ xu đổi quà
```

---

## 3. Thiết kế DB (đề xuất CTO — R2, tự quyết)

Tiền tố `sk_`. Mọi phép tính ở Postgres (§2.0), client chỉ gọi `fn_sk_*`.

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `sk_su_kien` | 1 dòng / sự kiện | `ten`, `ngay`, `cau_hinh jsonb` = `{vong_quay:[{xu:15,ti_le:25},{xu:20,ti_le:50},{xu:25,ti_le:25}], toi_da_luot:6, so_van:3}` |
| `sk_phong` | Phòng chơi | `su_kien_id`, `ten`, `hang_doi bool`, `ma_hub` (room code iPad hub), `thu_tu` |
| `sk_nguoi_choi` | Người tham gia | `su_kien_id`, `so` (số thứ tự trong sự kiện), `hoc_sinh_id` (**NULL = HS ngoài** — "không áp dụng", đúng §1.5), `ten`. Unique `(su_kien_id, so)`, `(su_kien_id, hoc_sinh_id)` |
| `sk_checkin` | Dòng tồn tại = đã check-in | PK `nguoi_choi_id`, `at`, `by`. Chỉ HS BK |
| `sk_xu` | **Sổ cái xu sự kiện** (append-only) | `so_xu` (±), `nguon` ∈ `vong_quay · game · doi_qua · dieu_chinh`, `luot_id`, `ghi_chu`, `at`, `by`. **Unique partial** `(nguoi_choi_id) where nguon='vong_quay'` ⇒ DB chặn quay 2 lần; `(luot_id, nguoi_choi_id) where nguon='game'` ⇒ không cộng đúp. Dòng vòng quay = chính kết quả quay (không cần bảng riêng) |
| `sk_dang_ky` | 1 lần xếp hàng | `phong_id`, `nguoi_choi_id`, `trang_thai` ∈ `cho · co_mat · dang_choi · xong · bo · huy`, `so_lan_bo_qua`, `luot_id`, `slot`. Unique partial `(nguoi_choi_id) where trang_thai in ('cho','co_mat','dang_choi')` ⇒ **1 chỗ chờ/HS ở mức DB**. Thứ tự hàng = `created_at` (bỏ qua lần 1 không đổi vị trí) |
| `sk_dang_ky_log` | Vết đổi trạng thái | **Trigger** tự ghi (actor, ts, cũ→mới) — §4, app không tự log |
| `sk_luot` | 1 lượt chơi của phòng | `phong_id`, `game`, `bat_dau_at`, `ket_thuc_at`. 1 phòng chỉ 1 lượt đang chạy |

RLS: `select` cho `authenticated using (la_thanh_vien())`; ghi **chỉ qua RPC**. Thêm các bảng `sk_*` vào `supabase_realtime`.

### RPC

| Hàm | Việc |
|---|---|
| `fn_sk_tim_hs(su_kien, q)` | Tìm `hoc_sinh` đang học theo tên (`fn_bo_dau`, không có unaccent) + lớp + cờ đã check-in/đã quay/đang chờ |
| `fn_sk_checkin(su_kien, hoc_sinh_id)` | Tạo `sk_nguoi_choi` (nếu chưa) + `sk_checkin`, idempotent |
| `fn_sk_them_khach(su_kien, ten)` | HS ngoài → cấp `so` (khoá dòng `sk_su_kien` khi cấp số) |
| `fn_sk_quay(nguoi_choi)` | **Random có trọng số ở Postgres** theo `cau_hinh`, ghi `sk_xu` — client/TV chỉ diễn hoạt ảnh dừng đúng ô |
| `fn_sk_dang_ky(phong, nguoi_choi)` | Vào hàng; đang có chỗ khác ⇒ báo lỗi rõ |
| `fn_sk_danh_dau(dang_ky, 'co_mat'\|'bo_qua'\|'tra_ve'\|'huy')` | `co_mat` chặn khi đã đủ 6; `bo_qua` lần 1 +1, lần 2 → `bo` |
| `fn_sk_bat_dau(phong, game)` | Tạo `sk_luot`, gán slot 1..n cho HS `co_mat` → `dang_choi` |
| `fn_sk_ket_thuc(luot, ket_qua jsonb [{slot, xu}])` | Ghi `sk_xu` nguồn `game` + `dang_ky → xong`, 1 transaction |
| `fn_sk_doi_qua(nguoi_choi, xu, ghi_chu)` | Khoá dòng, kiểm số dư ≥ xu, ghi âm |
| `fn_sk_tong_quan(su_kien)` | Theo phòng: đang chơi / sắp vào (co_mat) / đang chờ (thứ tự) + tổng check-in, tổng xu phát ra |
| `fn_sk_so_du(su_kien, q)` | Tìm theo tên/số → số dư + lịch sử xu (quầy quà) |

---

## 4. Màn hình (staff app ERP, đăng nhập nhân sự)

| Màn | Thiết bị | Nội dung |
|---|---|---|
| **Check-in** | Laptop | Ô tìm tên → Check-in · Quay · Đăng ký game; tab "HS ngoài" (tên → số #N → Đăng ký game); khung tóm tắt hàng chờ realtime (đang chơi / đang chờ) |
| **TV Vòng quay** | TV gần bàn check-in | Toàn màn hình; nghe `sk_xu` nguồn `vong_quay` mới → quay dừng đúng ô, hiện tên + số xu |
| **Quản trò** | Điện thoại (mobile-first) | Danh sách chờ; nút lớn ✔ Có mặt / ✖ Bỏ qua (hiện "đã bỏ qua 1 lần"); khung "Lượt kế" ≤6; Bắt đầu; Kết thúc lượt (kết quả tự điền từ iPad, sửa được) |
| **TV Hàng chờ** | TV phòng/hành lang | Đang chơi · Mời vào · N bạn đang chờ + 10 tên kế tiếp |
| **Quầy quà** | Laptop/điện thoại | Tìm tên/số → số dư → trừ xu |
| **Cài đặt sự kiện** | Admin | Tạo sự kiện, phòng, tỉ lệ vòng quay (mặc định seed sẵn cho Trung thu) |

Mutation trong cùng màn: **vá tại chỗ**, không reload trắng (§2); realtime chỉ refetch nền.

---

## 5. Nối iPad hub (`games-site/`) — đã dò 25/09

**Hiện trạng:**
- Hub `index.html`: kênh `bk-hub:<room>`, TV gửi `open {game}`, iPad nhận `slot 1..8` và nạp iframe `<game>.html?role&slot&room`.
- Mỗi game có kênh riêng (`bk-dapchuot:<room>`, `bk-mecung:`, `bk-timdiem:`, `bk-timnhanvat:`, `bk-xepthap:`…). Mẫu `dap-chuot.html`:
  - **TV (laptop phòng game) là trọng tài.** Nó phát `state` mỗi 1s. Khi ván kết thúc, `phase:'result'` mang `{matchId, results:{[slot]:{rank, xu, score, name}}}`, với `xu = prizes[hạng]` (5·3·2).
  - **TV đã có ô gõ sẵn tên theo slot** (`state.names`), iPad tự điền từ đó. Có sẵn cả nhập điểm tay (`tvManual`).
  - **Xu không ghi DB**, chỉ nằm ở localStorage của TV (`bk-dapchuot-tvhist`).

**Cách nối (chốt):**
1. **Điện thoại quản trò join kênh game của phòng** (`bk-<game>:<ma_hub>`) bằng supabase-js broadcast. Không cần sửa code từng game.
2. `fn_sk_bat_dau` trả `[{slot, ten, so}]`. Quản trò gửi xuống TV game để **điền sẵn `names` theo slot**.
   Cách tối thiểu: sửa TV game nhận thêm 1 message `names`. Fallback: quản trò gõ tay tên vào TV như hiện nay.
3. ~~Cộng dồn 3 ván rồi bấm Kết thúc lượt~~ → **(26/09 chiều, mig `202609261450`) trả xu TỪNG VÁN:** điện thoại nghe `state.phase==='result'` → gọi
   `fn_sk_tra_xu_van(luot, matchId, [{slot,xu}])` ngay ⇒ `sk_xu` 1 dòng/người/ván (cột `van` = matchId, unique `(luot_id, nguoi_choi_id, van)`
   ⇒ TV phát lại mỗi 1s / 2 điện thoại cùng nghe không cộng đúp). Số ván = số `van` khác nhau trong sổ (suy động); đủ `cau_hinh.so_van`
   ⇒ hàm tự kết thúc lượt. `sk_names` mang thêm `{luot, van, soVan}`: TV nhớ lượt, gắn `skLuot` vào mọi `state` (điện thoại chỉ trả xu
   ván mang ĐÚNG mã lượt — khoá tự nhiên, không đoán theo giờ; TV chưa nhận mã thì mới lùi về mốc `matchId > bat_dau − 30s`),
   hiện "Lượt sự kiện · xong x/3 ván", đủ thì chặn BẮT ĐẦU (vẫn cho chơi thêm nếu xác nhận — ván thêm không được xu).
   Lượt mới chỉ nhận khi TV ở sảnh chờ ⇒ kết quả ván cũ đang chiếu không bị gắn sang lượt mới. `fn_sk_huy_luot` chặn khi đã trả xu ván nào
   (huỷ ⇒ HS về Lượt kế ⇒ nhận xu 2 lần) — dùng **Kết thúc sớm** (`fn_sk_ket_thuc` với `[]`). "Game khác" vẫn nhập tay xu cả lượt như cũ.
4. **iPad/anon không ghi DB.** Chỉ điện thoại quản trò (đã đăng nhập) ghi. Fallback: nhập tay xu từng slot.
5. Chênh lệch nhỏ: hub cho 8 slot, sự kiện tối đa 6 → `fn_sk_bat_dau` gán slot 1..6.

**Ghi chú app ERP (dò 25/09):**
- Màn mới = leaf trong `adminLeaves` (`src/mock/fixtures.ts`) + nhánh route `NhanSuHome.tsx` + cấp `chuc_nang` cho nhân sự trực (Phân quyền).
- `src/` **chưa dùng Realtime ở đâu** (màn đều poll 5–7s). Sự kiện dùng `postgres_changes` trên bảng `sk_*` (thêm vào `supabase_realtime` như mig `202608291119_hoi_dap_nhan_su`). Kèm **poll 5s dự phòng**, rớt socket không kẹt màn.
- TV vòng quay / TV hàng chờ: đăng nhập bằng 1 tài khoản nhân sự, mở route toàn màn hình.

## 6. Thứ tự build (ưu tiên nếu thiếu giờ)

1. Migration `sk_*` + RPC + seed sự kiện Trung thu + phòng iPad → `npm run migrate` → `npm run schema`.
2. Màn **Check-in** + **Quản trò** + **TV hàng chờ** (lõi hàng đợi — thiếu là sự kiện kẹt).
3. **TV vòng quay** + **Quầy quà**.
4. Nối iPad hub (tự điền kết quả). Chưa kịp ⇒ quản trò nhập tay xu, hệ vẫn chạy đủ.
5. Test tải giả: 150 người chơi, 1 phòng, 2 điện thoại quản trò mở cùng lúc (chống bấm đúp/đua).

## 7. App riêng "BK Sự kiện" (Thùy 26/09: "tách khỏi ERP cho đỡ lẫn")

- Bundle thứ 11, khuôn y hệt app Khảo sát: `sukien.html` · `vite.config.sukien.ts` · `src/main-sukien.tsx` · `src/AppSuKien.tsx`
  (không kéo `NhanSuHome`/`useStore`). Dùng lại nguyên `src/screens/sukien/*` — ERP vẫn giữ lá `su_kien` (cùng component).
- Đăng nhập nhân sự; quyền thật ở DB (`fn_sk_*` kiểm `la_thanh_vien()`) ⇒ app riêng **không cần cấp lá** ở Phân quyền.
- Link theo vị trí trực: `/#man=checkin` · `/#man=quantro` · `/#man=quaqua` (tab Cài đặt có nút Copy). TV: `/#sk-tv=quay|hang&sk=<id>`.
- Deploy: Vercel project `bkdemy-erp-v2-sukien` · Build `npm run build:sukien` · Output `dist-sukien` · env `VITE_SUPABASE_URL` + `VITE_SUPABASE_KEY` (anon)
  · domain đề xuất `sukien.bkacademy.edu.vn`. Dev: `npm run dev:sukien` → `http://localhost:5186/sukien.html`.

## 8. Giao việc (Thùy 26/09: "giao task check-in, quản trò cho nhân sự — đứa nào không giao thì không thấy gì")

- Bảng `sk_phan_cong` (sự kiện × nhân sự × vai), vai ∈ `checkin · quantro · quaqua · quanly`. Mig `202609260219`.
- **DB chặn**: mọi `fn_sk_*` gọi `_sk_can(su_kien, vai[])`. Admin hệ thống (`la_admin_he_thong`) = quanly mọi sự kiện;
  `quanly` = đủ 4 vai + cài đặt + giao việc + điều chỉnh xu. Tạo sự kiện mới: chỉ admin hệ thống.
- Màn: chỉ hiện sự kiện được giao (`fn_sk_cua_toi`). 1 việc ⇒ vào thẳng; nhiều việc ⇒ chọn (máy nhớ); chưa giao ⇒ "chưa được giao việc".
  Giao việc ở Cài đặt › 👥 Giao việc (tìm tên → bấm chip, lưu ngay). Vết giao/gỡ: trigger `sk_phan_cong_log`.
- Máy nối TV phải đăng nhập tài khoản có việc (dùng tài khoản quản lý).

## 9. Thay đổi 26/09 (sau test thật)

- **Bỏ Quầy quà** khỏi app — Thùy: "việc đổi quà không liên quan đến hệ thống này". Vai `quaqua` + `fn_sk_doi_qua` để nguyên trong DB (không ai được giao ⇒ vô hại).
- **Bàn quay riêng** (vai `quay`, mig `202609260307`): 2 laptop — 1 người check-in, 1 người ở bàn quay. Bàn quay = vòng quay to +
  danh sách HS đã check-in mà chưa quay (`fn_sk_cho_quay`, đến trước quay trước); HS tìm tên mình, bấm 🎡 QUAY ⇒ quay ngay trên màn đó
  (TV riêng nếu có cũng quay theo). `fn_sk_quay` chỉ cho vai `quay`; màn Check-in bỏ nút Quay, hiện "→ Mời ra bàn quay".
- **Tách Check-in / Đăng ký game** (vai `dangky`, mig `202609260315`): Check-in chỉ HS BK + danh sách đã check-in ngay bên dưới
  (`fn_sk_da_checkin`, mới nhất trên cùng, có cột đã quay/chưa quay). Đăng ký game: HS BK + khách (cấp số), tóm tắt hàng chờ.
  Dự kiến 1 người làm cả 2 ⇒ giao cả 2 vai, thấy 2 tab. Bỏ màn "chọn việc": mỗi việc được giao = 1 tab.

## 10. Hiện trạng cuối phiên 26/09 ~03h30 + checklist test iPad

**DB (Thùy dán SQL Editor, đã verify DB thật):** `202609260129` (bảng + hàm gốc) · `0156` (thu quyền ghi tầng bảng) · `0219` (giao việc) ·
`0243` (vá cổng 3 hàm quản trò) · `0307` (vai quay) · `0315` (vai đăng ký). ⚠ Áp qua SQL Editor ⇒ **sổ `_migrations` CHƯA ghi 6 file** —
khi có chuỗi ghi: `node scripts/migrate.mjs --baseline <file>` từng file (cả 6 chạy lại vô hại, nhưng đừng để migrate chạy lại mù).

**App:** Vercel `bkdemy-erp-v2-sukien` (build `npm run build:sukien`, out `dist-sukien`). ERP chính vẫn có lá `su_kien` (cùng component).
**Việc (vai) → tab:** 🚪 Check-in · 📝 Đăng ký game · 🎡 Bàn quay · 🎮 Quản trò · ⚙️ Quản lý (= mọi tab + Cài đặt + giao việc). Admin hệ thống = Quản lý mọi sự kiện.
**Sự kiện thật:** "Trung thu 2026" — sạch (0 check-in), phòng "Phòng iPad" hub `BK01`, vòng quay 15/20/25 · 70/20/10 % (từ 26/09 chiều), 6 người/lượt, 3 ván.
**TEST (xoá được):** đã ĐÓNG, còn dữ liệu test (2 HS check-in, 1 khách, 2 lượt chờ) — không ảnh hưởng Trung thu. Xoá thật thì hỏi Thùy (Luật xoá).

**Checklist trước giờ mở cửa (Thùy):**
1. Cài đặt › 👥 Giao việc cho "Trung thu 2026": laptop 1 → Check-in + Đăng ký game · laptop 2 → Bàn quay · phòng iPad → Quản trò · 1–2 người Quản lý.
2. Máy nối TV (nếu dùng): đăng nhập tài khoản có việc (Quản lý), Cài đặt › 📺 TV Vòng quay / TV Hàng chờ → F11.
3. Mã hub `BK01` ở Cài đặt › Phòng chơi phải TRÙNG mã phòng đang đặt ở hub iPad (`games-site/index.html`, mặc định `BK01`).
4. `games-site` phải deploy bản có handler `sk_names` (5 game: dap-chuot, me-cung, tim-diem-khac-nhau, tim-nhan-vat-an, xep-thap) —
   chưa deploy thì tên KHÔNG tự điền, quản trò gõ tay trên TV game.

**Test iPad (chưa làm — Thùy 26/09):**
- Quản trò: có mặt 2–3 bạn → chọn game đang mở trên hub (tự chọn theo event `open` của `bk-hub:<ma_hub>`) → BẮT ĐẦU.
- TV game (laptop phòng) phải tự điền tên "Tên #số" vào ô slot 1..n (event `sk_names`, chỉ nhận khi TV ở sảnh `lobby`). Từ 26/09 chiều TV **giữ tên** qua "Trận mới", iPad **tự lưu tên** (localStorage `bk-games-pname`, dùng chung 5 game) — tên quản trò gửi đè tên iPad khi khác.
- HS ngồi ĐÚNG iPad số slot (iPad số = slot hub). Chơi 3 ván.
- Điện thoại: "Ván x/3" + toast "💰 Ván x/3 — đã cộng xu" sau mỗi ván; cột xu từng bạn = tổng đã vào sổ (đọc DB). Ván 3 xong ⇒ lượt tự kết thúc.
- TV: góc dưới trái "🎟 Lượt sự kiện · đã xong x/3 ván" → đủ thì đỏ "✅ Đủ 3 ván". Số dư HS tăng sau từng ván. Hỏng tự động ⇒ quản lý dùng Điều chỉnh xu.

**Còn mở:** 1 lần tìm `#1` ra rỗng ngay sau khi chuyển tab (không tái hiện, DB luôn trả đúng) · chưa test tải 150 người / 2 điện thoại ·
xu sự kiện dùng vào đâu (đổi quà ngoài hệ) — nếu cần số dư từng HS thì làm trang xem/xuất Excel.
