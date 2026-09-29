# STYLE app Học sinh — gói style + luật cho mọi màn/tính năng mới

> Thùy chốt 29/09/2026: *"lưu cái này thành 1 style, các file, icon phục vụ nó. Sau này có thêm nhiều tính năng mới cũng phải
> tự cập nhật UI theo cái style này."* — Style đang dùng thật: **Anime RPG** (duy nhất). 4–5 style mới đang làm.
> Đổi style = đổi **hết**: Home + mọi màn bên trong + popup + trạng thái rỗng/lỗi.

## 1. Một style gồm những gì (gói trọn, 1 chỗ)

| Phần | Ở đâu | Ghi chú |
|---|---|---|
| Định nghĩa (màu sáng/tối · font · bo góc · viền · blur · thẻ "Việc tiếp theo" · bóng chữ) | `src/screens/hocsinh/skin/styles/<id>.ts` | khai đủ hợp đồng `skin/kieu.ts` (`Skin`) |
| Tranh nền (bản NGANG cho iPad/PC + bản DỌC cho điện thoại) | `public/bk-ui/hs/skin/<id>/bg_<nền>_ngang.jpg` · `bg_<nền>_doc*.jpg` | JPG ~q80, ≤ 1672px cạnh dài |
| Icon từng ô chức năng | `public/bk-ui/hs/skin/<id>/o_<ô>.png` → khai ở `anhO` | PNG trong suốt, 160–192px |
| Icon banner (lịch bổ trợ, bài kiểm tra lại) | `b_<tên>.png` → `anhBanner` | |
| Nhân vật Home NGANG (PC/iPad) — nam + nữ, PNG trong suốt | `nv_nam.png` · `nv_nu.png` → `nhanVat` | Home ngang đứng nửa trái + bong bóng thoại (bố cục theo ảnh gốc style). Chọn theo giới tính HS, KHÔNG đổi màu theo giới tính. Không có ⇒ Home ngang trải hết bề ngang |
| Trang trí (hoa văn góc, gạch phân cách) | `corner.png`, `divider.png` → `trangTri` | |
| Font | `hs.html` (Google Fonts, có tiếng Việt) | chỉ khai font style thật sự dùng |
| Ảnh gốc từ ChatGPT (chưa nén) | `design/bk-ui-src/…` · ảnh toàn cảnh chuẩn trong `design/handoff/<kit>/reference/` | nguồn để nén lại khi cần |

Style RPG hiện tại: `skin/styles/rpg.ts` + `public/bk-ui/hs/skin/rpg/` (3 nền: Lâu đài — ảnh 37 bản dọc · Đảo trời · Đêm sao; 13 icon ô;
2 icon banner; hoa văn góc + gạch). Ảnh toàn cảnh chuẩn: `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png`.

## 2. Cách style chạy (đừng phá)

- `useApSkinGoc(gd)` (HocSinhApp) + `ganSkinMacDinh()` (main-hs) gắn biến `--sk-*` lên `<html>` theo style em đang chọn.
- Mọi màn CHỈ đọc biến qua **`skin/KhungHS.tsx`**:
  - Khung: `ManHS` (trang) · `DauTrangHS` (nút quay lại + tiêu đề) · `TheHS` (thẻ) · `NutHS` (nút chính / `phu`) · `NhanHS` (nhãn) ·
    `BadgeHS` · `NhomHS` (tiêu đề nhóm) · `TrongHS` (rỗng / đang tải / lỗi).
  - Hằng: `MAU.ink/muted/line/acc/accInk/surface/surface2/badge/bg` + ngữ nghĩa `MAU.dung/sai/canhBao` · `THE` · `THE_TRON` · `HEAD`.
- **CẤM** trong màn HS: mã màu gõ tay (hex, `bg-white`, `text-white` trên nền skin), token cũ `ph-*`/`bg-ios`/`brand`, `font-hand`/Pacifico,
  THEME theo giới tính, `if (skin === '…')`. Màu CÓ NGHĨA (huy chương, bậc Rank, ô vòng quay, nền trắng sau ảnh đề) được giữ — đã nằm
  trong mốc của script.
- Chữ đặt thẳng trên tranh nền (không trong thẻ) chỉ dùng cho tiêu đề — lỗi / đang tải / rỗng PHẢI trong thẻ (`TrongHS` hoặc `style={THE}`).

## 3. Thêm TÍNH NĂNG / MÀN mới (bắt buộc)

1. Dựng màn bằng các mảnh ở mục 2 — không tự đặt màu. Màn làm bài full-height có thể dùng nền `var(--sk-page)` trực tiếp (mẫu `LamBai`).
2. Thêm **ô chức năng mới** vào Home (KHU / KHU_CAP2 trong `HocSinhApp.tsx`) ⇒ MỖI style phải có icon cho ô đó:
   đặt ChatGPT vẽ theo đơn của style (`design/DON-HANG-SKIN-HS.md`, 1 hình/lượt, cùng phong cách ảnh toàn cảnh) → nén PNG vào
   `public/bk-ui/hs/skin/<id>/o_<ô>.png` → khai vào `anhO`. Chưa có hình thì app tạm hiện `dauThayIcon` (✦), script sẽ báo.
3. Chạy **`npm run check:style-hs`** trước khi commit. Phải ✔.
4. Nếu thêm biến màu mới cho style (vd màu cho 1 loại thẻ mới) ⇒ thêm vào hợp đồng `kieu.ts` + `bienCss()` + khai ở MỌI style — không
   gõ màu trong màn.

## 4. Thêm STYLE mới

1. `skin/kieu.ts`: thêm id vào `SkinId`.
2. `skin/styles/<id>.ts`: copy khuôn `rpg.ts`, khai đủ `Skin` (màu, font, nền, `anhO` cho MỌI ô, banner, trang trí).
3. `skin/registry.ts`: thêm vào `SKINS`.
4. Tài nguyên vào `public/bk-ui/hs/skin/<id>/` theo quy ước tên mục 1; font vào `hs.html`.
5. Migration nới CHECK `hs_giao_dien.skin` cho đúng danh sách style (CLAUDE §2.1 — thiếu là DB chặn đúng lúc HS bấm Lưu).
6. `npm run check:style-hs` ✔ (kiểm đủ icon ô + mọi file hình tồn tại) · soi bằng mắt ít nhất Home, 1 màn danh sách, 1 màn làm bài, 1 màn rỗng.

## 5. Script kiểm — `npm run check:style-hs` (`scripts/check-style-hs.mjs`)

- ① **Màu gõ tay kiểu "chỉ giảm"**: mỗi file màn HS có mốc trong `scripts/check-style-hs.moc.json`; vượt mốc ⇒ RỚT. File mới mốc = 0.
  Sửa bớt được thì chạy `npm run check:style-hs -- --ghi-moc` để siết mốc (KHÔNG dùng lệnh này để nới mốc cho màu mới).
- ② **Icon ô**: mọi id ô Home phải có trong `anhO` của mọi style.
- ③ **File hình**: mọi đường dẫn style khai phải có file trong `public/`.
- Không quét: `skin/` (nơi định nghĩa màu) · `HomeHS.tsx` (Home v4 cũ, chỉ còn cho HS không xác định được khối).
