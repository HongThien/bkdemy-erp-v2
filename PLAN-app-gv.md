# PLAN — App Giáo viên (GV)

> Thùy chốt 31/08 (trả lời 4 câu phân tích): **① MT KHÔNG có khái niệm "trung bình"** — 1 tháng
> 1 lần; hiển thị **điểm MT THEO THÁNG + RANK TRONG KHỐI** (nhỏ, bên cạnh) · **② đánh giá sau
> buổi PHẢI CÓ NÚT BÁO ĐỘNG bổ trợ** (chuông đỏ — lâu nay chỉ có ở chấm BTVN, thiếu ở đánh giá
> dù đã nhắc; timeline mastery hiện nguồn `dg` = đúng, giữ) · **③ GV cũng có dashboard "Của tôi"
> nhưng ĐO KHÓ HƠN** — v1 để chỗ + ghi "tính năng phát triển sau"; **bộ chỉ số GV thống nhất
> trước** (đề xuất §6) · **④ phạm vi app = LỚP MÌNH PHỤ TRÁCH** (`phan_cong_lop.vai_tro='gv'`)
> — đề xuất CTO, chờ gật (§8).

---

## 0. Mô hình — không hạ tầng mới ngoài 2 việc DB nhỏ

- App GV = **entry Vite thứ 5**, nhân bản khuôn app TA/OPS y nguyên (2 bài học registerSW
  immediate + `--app-z=1` đã trả tiền rồi — đừng học lại).
- Nghiệp vụ điền dữ liệu của GV chỉ **2 khâu** — nguồn duy nhất `TASKS_BY_VAI` (`gami.ts:904`):
  `danhgia` (Đánh giá sau buổi — ĐẶC TRƯNG GV) + `ingame` (Chấm bài trên lớp — chung với TA).
  Engine task **giữ nguyên**: `getMyTasks()` lọc `vai==='gv'`. GV KHÔNG nhận task buổi
  bù/bổ trợ (route theo `nguoi_day_tg`, Thùy 07-26) — ngoài scope, không đổi.
- Phần XEM tái dùng RPC mastery đã hạ DB 30/08 (`fn_mastery_cells`/`fn_matrix_lop`/
  `fn_rank_diem_mt`) + service `mastery.ts`/`report.ts`. GV **không** đụng điểm danh
  (CLAUDE.md §5 — điểm danh là của OPS, hậu kiểm bằng triangulation).

## 1. Màn (5 tab bottom-bar, khuôn TaHome)

| # | Tab | Nguồn | Nội dung |
|---|---|---|---|
| 1 | **GvHome "Việc của tôi"** | VIẾT MỚI khuôn `TaHome` | `getMyTasks()` lọc vai `gv` (`danhgia`+`ingame`), nhóm theo ngày + còn-nợ, deadline hết ngày buổi; hero + 2 box nghiệp vụ + box Dash |
| 2 | **Chấm & Đánh giá** (`ChamBuoiGv`) | Ingame PORT từ app TA · DanhGiaPanel VIẾT MỚI | 2 tab trong 1 buổi — xem §2 |
| 3 | **Học sinh** | PORT từ `KetQuaScreen` view ① | chọn HS trong lớp phụ trách → sub-tab **Tổng quan** (`getTongQuanHS`) + **Dạng bài** (`getMasteryHS` + Hình; timeline CÓ nguồn `dg` — GV thấy đánh giá mình nhập, dù `dg` không vào mastery); khối MT = **điểm theo THÁNG + rank khối nhỏ** (`getKhoiRankDiemMT` — có sẵn, cửa sổ 25→10) |
| 4 | **Lớp** | VIẾT MỚI trên RPC sẵn | per lớp phụ trách: **ET/BTVN** = lưới `fn_matrix_lop` (HS×buổi % + cột TB) + thanh rollup đạt/cần/yếu (`loadMasteryCells`); **MT** = bảng theo tháng mỗi HS (điểm + rank khối nhỏ bên cạnh) qua fn batch mới §3. KHÔNG có ô "MT trung bình lớp" (chốt ①) |
| 5 | **📈 Của tôi** | PLACEHOLDER | "Bộ chỉ số giáo viên đang được thống nhất — tính năng phát triển sau" (chốt ③). + nút GopY 🐞 route `app_gv:*` |

## 2. Màn Chấm & Đánh giá — lõi đợt này

**Tab Ingame** — port gần nguyên `IngamePanel` (app TA `ChamBuoi.tsx`): 1 bài/màn, nút mức 1-5
cỡ 44px, `DangPickerOne`, `gradeMuc`/`deleteGrade` → `gami_grades`, đóng `fn_dong_phase`.
Dạng gắn ở đây chính là dạng để đánh giá — 2 tab nối nhau tự nhiên.

**Tab Đánh giá** — VIẾT MỚI touch-first (CẤM import `BuoiHocScreen` — luật bundle), seam có đủ
trong `lib/gami.ts`, per HS `co_mat`:
- **Mức 1-5 + nhãn `muc_ma`** (`MUC_CATALOG` 11 nhãn, CHECK DB bắt `left(muc_ma,1)=muc`) —
  `setMuc`.
- **Verdict Đ/C/S per dạng** (`dangCuaBuoi` từ ingame) — `setDanhGiaDang` → `buoi_danh_gia_dang`
  (anti-NULL: bỏ chọn = DELETE dòng).
- **Nhận xét** — `setNhanXet`.
- **🚨 CHUÔNG ĐỎ bổ trợ (chốt ②)**: popup chọn dạng + ghi chú (tái khuôn `NutChuongDo` của
  `ChamBtvn`) → `canh_bao_yeu` với `nguon='danhgia'`. **0 công engine**: `napCanhBao`
  (`danhgia.ts:613`) không lọc `nguon`, chuông = kênh "báo động vào thẳng" của luật duyệt bổ trợ
  ≥2/4-HOẶC-báo-động (23/08) → chuông GV tự chảy vào pipeline. Gỡ được nếu bấm nhầm (`xoaCanhBao`).
- Đóng: `dongDanhGia` + `recomputeHoanTat`; tiến độ `danhGiaTienDo` (derive, không cờ).
- **ERP desktop `DanhGiaTab` cũng thêm chuông y hệt** (nhỏ, cùng đợt) — GV chưa dùng app vẫn có.

**Sửa seam kèm:** `themCanhBao` (`gami.ts:660`) đang hard-code `nguon:'btvn'` → thêm param
`nguon` (default `'btvn'` giữ nguyên chỗ gọi cũ).

## 3. DB (luật §2.0 — client không đếm gì)

- **`fn_rank_diem_mt_lop(p_lop uuid, p_mon text, p_ym text)`** → `(hoc_sinh_id, tb, rank_now,
  rank_total)` — bản BATCH của `fn_rank_diem_mt` cho tab Lớp (gọi per-HS N lần là N+1 RPC).
  Cùng luật nguyên văn: điểm CỦA EM ĐI THEO EM (Thùy 08-21), cửa sổ 25/tháng→10/tháng sau,
  roster = mọi lớp cùng (mon, khối), chưa thi = 0đ CHỈ trong xếp hạng (ngoại lệ 08-19); ô hiển
  thị điểm vẫn "—" khi chưa thi.
- **Vá nợ kèm** (bài học cột text không CHECK): `CHECK NOT VALID` cho `canh_bao_yeu.nguon`
  `in ('btvn','danhgia')` — DB hiện chỉ có `'btvn'` (mọi writer đi qua `themCanhBao`).
- **(để dành)** `fn_gv_dashboard` — CHỈ viết sau khi chốt bộ chỉ số §6; không đoán trước.
- Sau migration: `npm run migrate` → `npm run schema` → commit `schema.md` cùng migration.
  ⚠ `schema.md` hiện CŨ hơn 4 migration cuối (30-31/08) — refresh luôn đợt này.
  ⚠ Phiên remote không có credential DB (tiền lệ app TA) — migration viết sẵn, CEO dán/máy thật áp.

## 4. Entry Vite thứ 5

`gv.html` (PWA "BK Giáo viên", theme-color **ĐỀ XUẤT `#ea580c` cam** — teal/indigo/xanh đã thuộc
TA/OPS/HS) · `vite.config.gv.ts` (outDir `dist-gv`, `renameToIndex`, VitePWA manifest riêng,
`navigateFallbackDenylist` API) · `src/main-gv.tsx` (initErrorBuffer + registerSW immediate +
`--app-z=1`) · `src/AppGv.tsx` (gate 3 tầng: chặn tài khoản HS → `getMyProfile` → `myQuyen`;
`<Login staffOnly title="BK Giáo viên">`) · `src/screens/gv/` · scripts `dev:gv|build:gv|preview:gv`
· `.gitignore` + `dist-gv` · `vercel.json` thêm nhánh `claude/teacher-app-bk-cpzxbx` (chống đốt
quota deploy) · Vercel project thứ 5, domain đề xuất `gv.bkacademy.edu.vn`.

Luật bundle như OPS/TA: KHÔNG import `useStore`/`BuoiHocScreen`/`NhanSuHome`/`screens/kho`.
Quyền: leaf `buoihoc` qua `my_quyen()` như app TA — KHÔNG đẻ khái niệm quyền mới; scope lớp =
`phan_cong_lop` (2 trục tách biệt như toàn hệ).

## 5. Phần XEM — ghi chú nguồn số (chống "2 màn 2 số")

- Cửa sổ mastery mặc định = **Tất cả** (khớp ERP KetQuaScreen — tránh GV và admin nhìn 2 số khác).
- `getTongQuanHS` còn tính ở client (nợ chiến dịch 177 chỗ) — dùng lại nguyên trạng cho v1,
  KHÔNG chặn app GV; hạ DB thuộc phase chiến dịch, làm ở đó để ERP + app GV cùng hưởng.
- Đánh giá GV (`dg`) KHÔNG vào mastery (Thùy 07-15) — app hiển thị timeline nguồn `dg` để GV
  thấy dữ liệu mình nhập sống ở đâu, nhưng KHÔNG nói nó đổi điểm mastery.

## 6. Bộ chỉ số GV — ĐỀ XUẤT để thống nhất (chốt ③, CHƯA build)

3 tầng, độ khó đo tăng dần:

- **A. Kỷ luật vận hành** (đo được NGAY, đối xứng `fn_ta_dashboard`): % việc đạt-chuẩn/đến-hạn
  của 2 khâu (đánh giá + ingame, deadline hết ngày buổi) + **độ phủ đánh giá** (HS `co_mat` có
  mức/verdict). ⚠ Nếu độ phủ vào chuẩn thì phải thêm guard đóng-thiếu-chặn cho đánh giá —
  `dongDanhGia` hiện update thẳng, KHÔNG có guard như `fn_dong_phase` v4 (lỗ đối xứng).
- **B. Chất lượng đánh giá** (đo từ data sẵn có, ngưỡng RÚT TỪ PHÂN PHỐI THẬT — không bịa,
  triết lý troly.ts): ① **độ phân giải** — cả lớp cùng 1 mức/verdict = đánh giá "cho có"
  (variance thấp) · ② **độ khớp tiên lượng** — verdict `dg` của (HS×dạng) so với ET/MT khách
  quan đúng dạng đó 1-2 tuần sau (thế giới gọi là *calibration* — R7); GV bảo "đạt" mà ET sau
  đó "yếu" nhiều = lệch · ③ **chất lượng chuông** — % chuông về sau thành case bổ trợ được
  duyệt (precision, đo được từ `hs_level_log` + `bo_tro_yeu`).
- **C. Outcome** (khó nhất — đúng chỗ "đo sẽ khó hơn"): tiến bộ mastery lớp mình dạy theo thời
  gian (*value-added model* — R7: nổi tiếng khó vì nhiễu đầu vào band/lớp/HS), retention HS,
  trend MT. KHÔNG vào bar thưởng khi chưa chuẩn hoá đầu vào.
- **Lộ trình đề xuất:** v1 = placeholder (chốt ③) → Thùy gật tầng A → `fn_gv_dashboard` vòng 2
  (bar + mốc thưởng nếu có) → tầng B chạy chế độ THAM KHẢO 1-2 tháng lấy phân phối rồi mới đặt
  ngưỡng → tầng C = pha nghiên cứu riêng.

## 7. Thứ tự làm (vòng, mỗi vòng verify)

1. **Migration** (`fn_rank_diem_mt_lop` + CHECK `nguon`) + sửa `themCanhBao` param → schema refresh
   (máy có credential).
2. **Scaffold entry thứ 5** → `build:gv` pass, đo bundle, gate login đúng (staff vào / HS chặn).
3. **ChamBuoiGv** (Ingame port + DanhGiaPanel + chuông đỏ) — e2e trên data thật 1 buổi.
4. **Tab Học sinh + Lớp** (xem) — đối chiếu số với ERP KetQuaScreen cùng HS/lớp.
5. **GvHome wire + Dash placeholder + GopY**; chuông sang ERP `DanhGiaTab`.
6. **Tổng verify**: tsc sạch · build CẢ 5 bundle không vỡ nhau · viewport iPad/iPhone · size
   dist-gv. Vercel project + domain (CEO tạo).

## 8. Câu hỏi mở (chờ Thùy gật trước vòng 2)

1. Màu PWA **cam `#ea580c`** + domain `gv.bkacademy.edu.vn` — gật?
2. Phạm vi = **chỉ lớp mình phụ trách** (④) — gật? (ERP desktop vẫn xem mọi lớp như cũ.)
3. Chuông đỏ: chọn dạng là đủ hay **bắt buộc ghi chú**? (hiện ChamBtvn để ghi chú optional.)
4. Bộ chỉ số §6: gật **tầng A** làm nền `fn_gv_dashboard` vòng 2? GV có **mốc thưởng tiền**
   theo bar như TA không?
