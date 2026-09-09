# PLAN — App OPS riêng (iPad/iPhone-first)

> Thùy chốt 29/08: **OPS-only** (TA có app chấm bài riêng) · làm **trong kỳ nghỉ, hoàn chỉnh luôn** ·
> nhập liệu chính trên **iPad/iPhone**, sau này OPS **không nhập trên ERP nữa** ·
> **Bổ trợ (bù/đuổi/yếu) NGOÀI scope** — bàn sau · **Scan giữ máy scan** (camera iPad/iPhone không
> đủ chất lượng cho OMR + chậm hơn máy nạp giấy) — app KHÔNG có chức năng scan.

---

## 0. Mô hình chọn (đã bàn 29/08)

**Entry Vite thứ 3 cùng repo — nhân bản đúng khuôn app HS** (tách 21/08, đã chạy production):
cùng Supabase project, cùng auth, cùng `lib/*` seam, **RLS không sửa dòng nào** (mọi policy
`to authenticated`, quyền qua RPC `my_quyen()`). KHÔNG tách repo/DB (bài học PH: chỉ tách khi vốn
khác hệ từ đầu — OPS nằm chính giữa DB ERP).

Bằng chứng lợi ích: bundle HS 676KB vs app đầy đủ 4.66MB (~7×).

ERP desktop **giữ nguyên mọi màn hiện có** — app là bundle mới, không xoá/sửa hành vi ERP.
(Sau khi OPS chuyển hẳn sang app, việc thu gọn màn ERP là đợt riêng, có bàn lại.)

## 1. Scope màn v1 (5 màn) — thuần "tác nghiệp trong ngày"

| # | Màn | Nguồn | Ghi chú |
|---|---|---|---|
| 1 | **Trang chủ "Việc của tôi"** | VIẾT MỚI (`OpsHome`) | Gộp 4 nguồn task theo ngày: buổi cần mở/điểm danh (`buoiAoCuaNgay`/`myBuoiAoCuaKhoang`) · report/tan (`getMyOpsTasks`) · prep (`getMyPrepTasks`) · ca test đang chạy (`listCaTestDangChay`). KHÔNG tái dùng `NhanSuHome` (switch 40 leaf). |
| 2 | **Điểm danh buổi** | VIẾT MỚI (`DiemDanhBuoi`), tách logic từ `BuoiHocScreen` | Mở buổi · 3 nút Có mặt/Vắng/Vắng phép · 📩 Báo đến PH · gỡ HS xếp nhầm · huỷ buổi. Chỉ import `lib/gami` + `lib/hoten` — KHÔNG import `BuoiHocScreen` (file 2115 dòng kéo theo kho Hình/soạn tài liệu). |
| 3 | **Report / Báo tan** | Tái dùng `OpsReportScreen` (tab Việc của tôi) | Đã mobile-ready (camera sau, ẩn dán clipboard). Tab "Leader duyệt" KHÔNG vào app (ở lại ERP). |
| 4 | **Chuẩn bị phòng** | Tái dùng `PrepScreen` | Đã mobile-ready. Phải GỠ import `useStore` (kéo mock + state không liên quan). Cụm GV-chấm/Leader-chốt vẫn gate theo vai như hiện tại. |
| 5 | **Điểm danh test đầu vào** | Tái dùng `DiemDanhTestScreen` | Modal tạo ca (~10 input) phải responsive lại cho iPad dọc. Upload bài + Scan-đã-chấm Ở LẠI ERP (file sinh ra ở PC cắm máy scan). |

**NGOÀI scope v1:** bổ trợ bù/đuổi/yếu (Thùy tính sâu hơn, bàn sau) · scan mọi loại · Leader duyệt
report/tan · Phân công Ops · Lịch phòng/heatmap · dashboard. Tất cả vẫn dùng trên ERP như cũ.

## 2. Kiến trúc & file

```
ops.html                     copy hs.html — đổi title "BK Academy — Vận hành", trỏ /src/main-ops.tsx
src/main-ops.tsx             copy main-hs.tsx NGUYÊN 2 bài học đắt:
                               • registerSW({immediate:true}) qua virtual module (không thì PWA kẹt bản cũ)
                               • document.documentElement.style.setProperty('--app-z','1') (không thì zoom 1.15)
src/AppOps.tsx               session → getMyProfile/my_quyen → gate:
                               • tài khoản HS (my_hoc_sinh_id() ≠ null) → chặn + nút đăng xuất (như AppHS chặn staff)
                               • staff bình thường → vào app; quyền màn theo leaf my_quyen (KHÔNG đẻ khái niệm quyền mới)
src/screens/ops/OpsHome.tsx  shell + trang chủ: bottom-tab (Hôm nay · Điểm danh · Report · Prep · Test)
src/screens/ops/DiemDanhBuoi.tsx   màn điểm danh touch-first (mục §3)
vite.config.ops.ts           copy vite.config.hs.ts: input 'ops.html' · outDir 'dist-ops' ·
                               plugin renameToIndex (dist-ops/ops.html → index.html — bẫy static host đã cắn) ·
                               manifest PWA riêng (name/short_name/theme_color khác HS)
package.json                 + "dev:ops" / "build:ops" / "preview:ops"
```

**Luật bundle (quyết định lợi ích của cả việc tách):**
- KHÔNG import `store/useStore` (kéo `mock/fixtures` + state học phí/soạn tài liệu). Cần state
  thì `useState` cục bộ; nếu thật sự cần store chung → `store/useOpsStore.ts` mới, nhỏ.
- KHÔNG import `BuoiHocScreen` / `NhanSuHome` / bất cứ gì thuộc `screens/kho`.
- `lib/gami.ts` (1713 dòng) chấp nhận vào nguyên khối v1 — đo size sau build, nếu tệ mới tách
  `lib/gami-buoi.ts` (không tách trước, tránh đụng file nóng khi chưa cần).
- Toàn app **touch-first mặc định** (nút ≥44px, không gate qua `useIsMobile`) — mở trên desktop
  vẫn dùng được, chỉ là nút to. Không thêm tier tablet vào ERP trong đợt này.

**Quyền:** tái dùng nguyên leaf-id hiện có — `buoihoc` (điểm danh) · `ops_report` · `prep` ·
`test_dau_vao`. App ẩn tab không có quyền; `getMyScope().opsToanHe` quyết "việc của tôi".
Không migration. Không đổi RLS. ⚠ Nhớ kiểm role OPS đã được cấp đủ 4 leaf này ở màn Phân quyền
(precedent: `tuyensinh`/`botro` từng quên cấp).

## 3. Tách màn điểm danh — cách làm

KHÔNG refactor `BuoiHocScreen.tsx` (ERP giữ nguyên, tránh rủi ro file nóng 2115 dòng giữa kỳ nghỉ).
Viết `DiemDanhBuoi.tsx` MỚI, import đúng seam:

- `lib/gami`: `buoiAoCuaNgay` · `moBuoi` · `getBuoi` · `getRoster` · `diemDanh` · `markBaoDen` ·
  `xoaHSKhoiBuoi` · `dongBoSiSo` · `huyBuoiCuaNgay` · `setNguoiDay` (+ types).
- `lib/hoten` (`tenHienThiDs`), `components/SearchSelect` (đổi GV).
- Logic ghi = CÙNG hàm service với ERP → 1 sự thật, 2 UI. UI viết mới cho chạm:
  hàng HS cao ≥52px, 3 nút mức to, tick là ghi ngay (giữ nguyên hành vi không-nút-Lưu),
  tiến độ `daDanh/tong` trên header, nhóm "Báo đến PH" giữ luồng copy-Zalo hiện tại.

Trade-off ghi nhận: 2 chỗ UI điểm danh (ERP + app). Chấp nhận vì (a) service chung nên hành vi
data không thể lệch, (b) đích đã chốt là OPS rời ERP — UI ERP sẽ thành read-only ở đợt dọn sau.

## 4. Deploy

- Vercel project **thứ 3, cùng repo GitHub**: build `npm run build:ops`, output `dist-ops`,
  env `VITE_SUPABASE_URL`/`VITE_SUPABASE_KEY` copy từ project hiện có.
- Domain đề xuất: `ops.bkacademy.edu.vn` (Thùy gắn DNS như đã làm với `hs.`).
- iPad/iPhone: mở domain → "Thêm vào MH chính" → app standalone full-screen (PWA sẵn khuôn HS).
- Git: nhánh `feat/app-ops` → PR → merge (workflow chốt 07-09). Không đụng migration.

## 5. Thứ tự làm (vòng, mỗi vòng verify)

1. **Scaffolding**: ops.html + main-ops + AppOps + vite.config.ops + scripts → `build:ops` chạy,
   đo bundle, login gate đúng (staff vào / HS chặn).
2. **DiemDanhBuoi + OpsHome** (lõi): e2e preview thật — mở buổi, điểm danh, báo đến PH, đối chiếu DB.
3. **Wire Report/Tan + Prep** vào shell (gỡ useStore khỏi PrepScreen) + polish chạm.
4. **Điểm danh test** (responsive modal tạo ca).
5. **Tổng verify**: `tsc` sạch · build CẢ 3 bundle (chính/HS/ops) không vỡ nhau · preview iPad
   viewport (768×1024 + 1024×768) + iPhone (390×844) · đo size dist-ops.
6. **Deploy**: Vercel project + domain + cài PWA lên iPad thật của OPS → chạy song song ERP
   (kỳ nghỉ = ít ca, đúng lúc thử).

## 6. Câu hỏi mở (không chặn scaffolding, cần chốt trước vòng 6)

1. Domain: `ops.bkacademy.edu.vn` — ok?
2. Icon/màu app riêng cho dễ phân biệt với app HS trên màn hình iPad? (đề xuất: cùng logo, đổi
   theme_color — 15 phút, cần Thùy gật màu.)
3. App cho MỌI staff có quyền leaf vào (admin/leader xem được) hay chặn cứng chỉ team ops?
   (đề xuất: theo quyền leaf như ERP, không chặn cứng — admin vào xem là tiện, quyền vẫn 1 nguồn.)
