# PLAN — App Trợ giảng (TA) + luồng PH nộp BTVN bằng ảnh

> Thùy chốt 30/08 (7 câu): **① đi từ app PHỤ HUYNH** (`bkdemy-ph`) — HS cấp 1-2 PH chụp ảnh nộp,
> cấp 3 làm online sẵn rồi · **② đơn vị nộp = XẤP ẢNH** per (HS × buổi), TA tự xử từng ảnh ·
> **③ trả về PH = BÀI CHẤM CỦA TA + ĐÁP ÁN CHI TIẾT trong kho** · **④ app TA v1 = các việc hiện
> tại trước; chấm BTVN-ảnh chạy SONG SONG 2 đường** (ai nộp app → chấm app; còn lại Zalo + nhập tay
> như cũ; hệ thống phải cho TA biết AI ĐÃ NỘP APP) · **⑤ song song đến khi PH quen** — không có
> ngày ép · **⑥ trạng thái nộp = HỆ ĐỀ XUẤT, TA TICK TAY** · **⑦ tư cách đo KHÔNG đổi** — BTVN
> vẫn tham khảo, mastery vẫn 2 chế độ có/không BTVN.

---

## 0. Mô hình tổng — 3 hệ tham gia, chân lý ở MỘT chỗ

```
app PH (repo bkdemy-ph, DB riêng)   ──nộp ảnh──▶   ERP Postgres + Storage   ◀──chấm── app TA (repo này)
        ▲                                                │
        └────────────xem bài chấm + đáp án (FDW đọc)─────┘
```

- **Ảnh + dữ liệu nộp SỐNG TRONG ERP DB** (luật: Postgres ERP = chân lý runtime; TA chấm trên data
  trong ERP, không chấm trên data hệ ngoài). App PH chỉ là CỬA nộp/xem.
- Chiều PH→ERP hiện **chưa tồn tại** (FDW `fdw_bkdemy_web` cố ý chỉ-đọc, đã siết còn 4 bảng) —
  plan này mở nó **hẹp có chủ đích** (§3), không nới FDW ghi.
- Repo này làm: schema + RPC + app TA + badge trên ERP. Repo `bkdemy-ph` làm: UI nộp + UI xem
  (⚠ repo đó có phiên Claude khác hay làm chung — phối hợp, đừng dẫm).

## 1. Data model mới (ERP)

**Bucket `btvn-nop` — PRIVATE** (ảnh bài làm trẻ em, khác `kho-anh` public): staff đọc qua policy
`authenticated`; PH xem qua **signed URL** do server bkdemy-ph tạo. Path `buoi_id/hs_id/*.jpg`.

**`btvn_nop`** — 1 dòng = 1 lượt nộp của (HS × buổi giao BTVN). PK `(hoc_sinh_id, buoi_hoc_id)`
mirror `btvn_ket_qua` (buổi giao luôn ĐÃ MỞ nên dòng `buoi_hoc` có thật):
`hoc_sinh_id FK · buoi_hoc_id FK · nop_at · nguon check ('ph_app') · tra_at · tra_boi FK nhan_su
· updated_at`. **Anti-NULL §1.5: dòng chỉ ra đời khi có ảnh thật** — tạo trong CÙNG transaction
với ảnh đầu (RPC), không insert-trước-điền-sau. Môn = qua `buoi_hoc → lop.mon` (cùng pattern
`btvn_ket_qua`).

**`btvn_nop_anh`** — mỗi ảnh 1 dòng (không jsonb array, vì mỗi ảnh sẽ có bản chấm riêng):
`id PK · nop_id FK cascade · url` (gốc, **immutable — cấm đè**) `· url_cham` (bản TA đánh dấu,
null = chưa chấm ảnh đó) `· thu_tu` (CHỈ hiển thị — danh tính là id, không phải vị trí, luật §2)
`· created_at`.

**Vá nợ đi kèm** (đụng bảng thì vá luôn): thêm CHECK cho `btvn_ket_qua.trang_thai_nop`
(4 giá trị) + `.thai_do` (4 giá trị) — hiện text tự do, giá trị lạ làm `fn_exp_btvn_bai` trả 0
âm thầm.

**Đã có sẵn, KHÔNG đẻ mới:** chấm per-câu vẫn `gami_session_problems(phase='btvn')` +
`gami_grades` · trạng thái nộp/thái độ vẫn `btvn_ket_qua` · đóng vẫn `fn_dong_btvn` (EXP,
idempotent) · deadline vẫn `han_nop_bai_test(lop, ngay, 'btvn')`.

## 2. RPC (theo luật §2.0 — mọi logic ở Postgres, client chỉ gọi)

- `fn_btvn_nop_tao(p_hs, p_buoi, p_urls text[])` — validate: HS thuộc buổi + buổi có doc
  `tai_lieu(loai='btvn')` khớp lớp+ngày + mảng ảnh ≥1 → insert `btvn_nop` + N dòng ảnh, 1
  transaction. Idempotent theo PK (nộp lại = thêm ảnh, không đẻ dòng nộp thứ 2).
- `fn_btvn_nop_them_anh(p_hs, p_buoi, p_urls text[])` — PH bổ sung ảnh (chỉ khi `tra_at is null`).
- `fn_btvn_de_xuat_trang_thai(p_buoi)` → per HS: `nop_dung_han`/`nop_muon` từ `nop_at` vs
  `han_nop_bai_test` — **đề xuất thôi**, TA tick xác nhận vào `btvn_ket_qua` như cũ (chốt ⑥;
  `xin_phep`/`khong_lam` thuần tick tay).
- `fn_btvn_tra_bai(p_hs, p_buoi)` — set `tra_at` (guard: đã có ít nhất 1 verdict hoặc
  `btvn_ket_qua` của HS đó); gọi được per-HS hoặc gọi cả buổi lúc đóng BTVN.
- View cho PH đọc qua FDW (gate `tra_at is not null`, security_invoker phù hợp role FDW):
  - `v_btvn_tra_anh` — ảnh `url_cham` (fallback `url`) per (HS × buổi).
  - `v_btvn_tra_ket_qua` — Đ/C/S per câu từ `gami_grades` + trạng thái nộp.
  - `v_btvn_dap_an` — đề + đáp án + lời giải per câu của doc btvn buổi đó (join
    `tai_lieu_cau` → kho theo môn). Chỉ lộ SAU khi trả (không cho HS liếc đáp án trước hạn).

## 3. Đường GHI PH→ERP — rào cứng, không lời hứa

- **Role DB riêng `ph_nop`**: KHÔNG SELECT bảng nào, chỉ `EXECUTE` đúng 2 hàm nộp (§2, hàm
  `security definer` tự validate) + INSERT storage vào đúng bucket `btvn-nop`. Connection string
  chỉ nằm **server-side bkdemy-ph** (Next.js API route) — không bao giờ xuống client PH.
- Chiều đọc giữ nguyên FDW `fdw_bkdemy_web`: mở thêm SELECT cho 3 view §2 (+ `btvn_nop` để PH
  thấy "đã nộp/đã trả") — mirror đúng cách `hoc_sinh_he_so` đã mở (grant + policy `using(true)`
  for select).
- "Gửi qua app" = PH mở app thấy (pull). **Push notification = pha sau** — ERP chưa có hạ tầng
  thông báo, không chặn v1.

## 4. App TA — entry Vite thứ 4, nhân bản đúng khuôn app OPS

`ta.html` · `src/main-ta.tsx` (copy main-ops: registerSW immediate + huỷ zoom 1.15) ·
`src/AppTa.tsx` (gate: chặn tài khoản HS; quyền theo leaf `my_quyen()`, KHÔNG đẻ khái niệm quyền
mới) · `vite.config.ta.ts` (outDir `dist-ta` + renameToIndex + manifest PWA riêng) · scripts
`dev:ta`/`build:ta`. Luật bundle như OPS: không import `useStore`/`BuoiHocScreen`/`NhanSuHome`/
`screens/kho`; touch-first mặc định.

**Màn v1 (chốt ④ — việc hiện tại trước, 4 màn):**

| # | Màn | Nguồn | Ghi chú |
|---|---|---|---|
| 1 | **TaHome "Việc của tôi"** | VIẾT MỚI | `getMyTasks()` lọc vai tg (ingame/et/btvn/mt/baosai đếm, bấm vào màn); bottom-tab |
| 2 | **Chấm BTVN** (lõi đợt này) | VIẾT MỚI `ChamBtvn.tsx` | Hợp nhất 2 đường — xem §5 |
| 3 | **Chấm ET** | VIẾT MỚI touch-first | tái dùng seam `lib/gami`: `gradeET`/`fn_dong_phase`; Đ/C/S + 6 ô lỗi |
| 4 | **Chấm bài trên lớp** | VIẾT MỚI theo tinh thần `ChamMobile` | 5 mức 1-click |

**NGOÀI scope v1:** MT · bù/bổ trợ yếu/đuổi (tiền lệ OPS — bàn sau) · duyệt báo sai + duyệt chấm
TLN (ở lại ERP desktop) · chấm test đầu vào · báo cáo. ERP giữ nguyên mọi màn (song song, chốt ⑤).

## 5. Màn Chấm BTVN — hợp nhất 2 nguồn (chốt ④)

Danh sách HS của buổi, mỗi HS 1 hàng + **badge 📱 "Đã nộp app · N ảnh · giờ nộp"** (từ
`btvn_nop`) — TA nhìn 1 phát biết ai chấm trên app, ai chờ Zalo:

- **HS có 📱**: mở → viewer xấp ảnh (swipe) · **annotate** = canvas vẽ đơn giản lên ảnh (bút đỏ +
  undo), lưu thành PNG **mới** lên bucket → `url_cham` (ảnh gốc không đụng) · tick Đ/C/S per câu
  (ghi `gami_grades` — ĐÚNG đường cũ, không đẻ hệ chấm thứ 2) · trạng thái nộp hiện **đề xuất**
  từ `fn_btvn_de_xuat_trang_thai`, TA bấm xác nhận (⑥) · thái độ tick tay · nút **"Trả bài"** →
  `fn_btvn_tra_bai` → PH thấy bài chấm + đáp án (③).
- **HS không 📱**: chấm y hệt `BtvnTab` hiện tại (nhập tay từ bài Zalo) — không trả gì qua app.
- Đóng BTVN = `fn_dong_btvn` như cũ (EXP không đổi công thức — chốt ⑦); đóng buổi tự trả nốt
  các HS đã chấm mà chưa bấm trả.
- **ERP desktop `BtvnTab` cũng thêm badge 📱 + link ảnh** (đợt này, nhỏ): TA chưa dùng app vẫn
  biết ai nộp app — tránh ca "PH nộp app mà TA chờ Zalo mãi".

## 6. Đo lường — KHÔNG đổi (chốt ⑦)

BTVN vẫn = tham khảo: không vào Elo, không vào mastery mặc định (`fn_mastery_cells
p_include_btvn=false` giữ nguyên 2 chế độ có/không BTVN). Kênh nộp đổi ≠ bản chất
không-giám-sát đổi. Chỉ thêm: `nop_at` làm nguồn đề xuất đúng-hạn/muộn thay vì TA đoán.

## 7. Thứ tự làm (vòng, mỗi vòng verify — luật parity §2.0)

1. **Migration + RPC** (`btvn_nop`/`btvn_nop_anh`/bucket/role `ph_nop`/CHECK vá nợ/5 fn + 3 view)
   → smoke transaction-rollback trên DB thật (giả JWT), verify RLS: role `ph_nop` không SELECT
   được gì, HS/staff đọc đúng phạm vi. `npm run schema` + commit schema.md cùng migration.
2. **Scaffold app TA** → build:ta chạy, đo bundle, gate login đúng (staff vào / HS chặn).
3. **Chấm BTVN hợp nhất** (viewer ảnh + đề xuất trạng thái + Đ/C/S) — e2e preview: seed 1 lượt nộp
   giả bằng RPC, chấm, đối chiếu DB.
4. **Annotate + Trả bài** + badge 📱 bên ERP `BtvnTab`.
5. **Chấm ET + ingame** wire vào shell.
6. **Tổng verify**: tsc sạch · build CẢ 4 bundle không vỡ nhau · viewport iPad/iPhone · size dist-ta.
7. **Phối hợp bkdemy-ph** (repo kia): API route nộp (giữ key `ph_nop`) + màn nộp xấp ảnh + màn xem
   bài chấm/đáp án (FDW view). Deploy Vercel project thứ 4 + domain (đề xuất `ta.bkacademy.edu.vn`).

## 8. Câu hỏi mở (không chặn vòng 1–2, cần chốt trước vòng 4/7)

1. **"Bài chấm của TA"** = ảnh đánh dấu + bảng Đ/C/S (đang giả định) — có cần thêm ô NHẬN XÉT text
   per lượt nộp gửi PH không?
2. Bucket ảnh bài làm để **private + signed URL** (đề xuất, vì là bài làm học sinh nhỏ) — ok?
3. Domain `ta.bkacademy.edu.vn` + màu/icon PWA riêng — Thùy gật màu.
4. Phần bkdemy-ph ai làm — phiên này sang repo đó làm luôn, hay phiên đang giữ ph-app làm (tránh
   va như vụ PhApp.tsx thiếu file)?
