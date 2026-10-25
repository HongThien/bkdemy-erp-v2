# STYLE app Học sinh — gói style + luật cho mọi màn/tính năng mới

> Thùy chốt 29/09/2026: *"lưu cái này thành 1 style, các file, icon phục vụ nó. Sau này có thêm nhiều tính năng mới cũng phải
> tự cập nhật UI theo cái style này."* — Style đang dùng thật: **Anime RPG** (duy nhất). Đang làm: **Thị trấn** (`spec-giao-dien-hs.md` §9) ·
> **Khối vuông** — cảm hứng Minecraft, style SÁNG, ĐÃ DỰNG 03/10 (`skin/styles/khoi.ts`, `spec-giao-dien-hs.md` §10, đơn `design/DON-HANG-STYLE-KHOI.md`).
> **Lo-fi chill** — ĐÃ DỰNG 12/10 (`skin/styles/lofi.ts`): style cho em thích học một mình, có CẢ sáng (nắng chiều) lẫn tối (đêm, đèn bàn), màn chính "sống" (§2.7). Đơn + bảng kiểm hàng: `design/DON-HANG-STYLE-LOFI.md` · nén hình: `node scripts/lofi-hinh.mjs`.
> **Đáng yêu** (id `dang_yeu`, cảm hứng Chiikawa; tên làm việc cũ "Nhỏ xinh") — linh vật tròn, viền nâu dày, pastel, chỉ chế độ sáng; **làm song song với Thị trấn** (Thùy 11/10). Đơn `design/DON-HANG-STYLE-NHO-XINH.md` — hình đủ 150/150 · **ĐÃ DỰNG 13/10** (`skin/styles/dangYeu.ts`, màn chính "sống" kiểu linh vật — §2.7; nén hình: `node scripts/dang-yeu-hinh.mjs`); migration `202610131141` đã áp. Bộ tư thế ĐÁNH của linh vật chưa có (đơn `design/DON-HANG-NHO-XINH-DANH.md`) ⇒ màn đấu tạm dùng nhân vật anime chung.
> **Halloween** (id `halloween`, 24–25/10) — đêm ma đáng yêu, CHỈ chế độ tối, 2 bé ma (phù thủy · bí ngô). Đơn + kiểm hàng + tình trạng dựng: `design/DON-HANG-STYLE-HALLOWEEN.md` · nén hình: `node scripts/halloween-hinh.mjs` · **ĐÃ DỰNG 25/10** (`skin/styles/halloween.ts`); migration `202610251545` đã áp 25/10. Style ĐẦU TIÊN có **bộ đánh riêng** (`Skin.dau` — xem §1): bé ma ra trận thay nhân vật anime.
> Biến mới cho style vuông: `radiusPill` ⇒ `--sk-radius-pill` — thứ dáng tròn/viên thuốc trong màn MỚI dùng biến này, đừng gõ `rounded-full`/`999px`.
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
| Bảng màu 3D của bản đồ phiêu lưu (thế giới · lục địa · chặng · màn đấu) | `skin/the3d/bangMau<id>.ts` → khai `the3d` trong style (hợp đồng `skin/the3d/kieuMau.ts`) | Cảnh 3D viết bằng CODE, chỉ đọc màu qua bảng này (không gõ hex trong màn). Thiếu `the3d` ⇒ màn phiêu lưu báo "style chưa có bản đồ 3D". Quái/boss cắm qua `skin/the3d/nguonQuai.ts` (Thùy thiết kế riêng) |
| Sổ hình BẢN ĐỒ PHIÊU LƯU 2D · ảnh QUÁI · hình GAME NHÚNG (07/10) | `skin/styles/<id>BanDo2d.ts` → khai `banDo2d` + `quai2d` · `game` trong style (hợp đồng `BanDo2D` ở `skin/kieu.ts`) | Màn bản đồ (`phieuluu/ban2d/hinh2d.ts`) và game Đấu trường/leo tháp (`src/dautu/hinhGame.ts`, nhận `?skin=`) CHỈ đọc qua đây — cấm gõ `/rpg/` trong màn. Thiếu biome nào ⇒ hình tạm; thiếu `quai2d` ⇒ quái tạm CC0. Mẫu: `rpgBanDo2d.ts` · `khoiBanDo2d.ts` |
| Bộ ĐÁNH riêng (linh vật của style ra trận — Halloween 25/10) | `skin/styles/<id>Dau.ts` (sinh bởi script) → khai `dau` (hợp đồng `BoDau` ở `skin/kieu.ts`) | 15 tư thế × nam/nữ cùng khung + neo chân/điểm phát đòn + 5 vật bay. Mọi màn đấu đọc qua `skin/nhanVat.ts` (`anhDauNv`/`hopDauNv`/`tayDauNv`) và `thuthach/hieuUng.ts` — CẤM màn tự chọn hình theo style. Không khai ⇒ nhân vật em chọn. Màn chọn nhân vật luôn dùng bản gốc (`anhDauNvGoc`) |
| Ảnh gốc từ ChatGPT (chưa nén) | `design/bk-ui-src/…` · ảnh toàn cảnh chuẩn trong `design/handoff/<kit>/reference/` | nguồn để nén lại khi cần |

Style RPG hiện tại (02/10: nền + nhân vật đã CHIBI — `bg_*_chibi_*.jpg`, `nv_*_chibi.png`; icon/banner còn anime cũ): `skin/styles/rpg.ts` + `public/bk-ui/hs/skin/rpg/` (3 nền: Lâu đài — ảnh 37 bản dọc · Đảo trời · Đêm sao; 13 icon ô;
2 icon banner; hoa văn góc + gạch). Ảnh toàn cảnh chuẩn: `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png`.

## 2. Cách style chạy (đừng phá)

- `useApSkinGoc(gd)` (HocSinhApp) + `ganSkinMacDinh()` (main-hs) gắn biến `--sk-*` lên `<html>` theo style em đang chọn.
- **`laySkin(null)` = style ĐANG ÁP** (07/10 — trước đó rơi thẳng về RPG ⇒ khu Học tập/Chinh phục/quái luôn vẽ hình RPG dù em chọn style khác).
  Màn cần hình của style mà không có `gd` trong tay thì gọi `laySkin(null)`. Trang xem thử: `ganSkinXemThu()` (KhungHS) đọc `&skin=`.
- Mọi màn CHỈ đọc biến qua **`skin/KhungHS.tsx`**:
  - Khung: `ManHS` (trang) · `DauTrangHS` (nút quay lại + tiêu đề) · `TheHS` (thẻ) · `NutHS` (nút chính / `phu`) · `NhanHS` (nhãn) ·
    `BadgeHS` · `NhomHS` (tiêu đề nhóm) · `TrongHS` (rỗng / đang tải / lỗi).
  - Hằng: `MAU.ink/muted/line/acc/accInk/surface/surface2/badge/bg` + ngữ nghĩa `MAU.dung/sai/canhBao` · `THE` · `THE_TRON` · `HEAD`.
- **CẤM** trong màn HS: mã màu gõ tay (hex, `bg-white`, `text-white` trên nền skin), token cũ `ph-*`/`bg-ios`/`brand`, `font-hand`/Pacifico,
  THEME theo giới tính, `if (skin === '…')`. Màu CÓ NGHĨA (huy chương, bậc Rank, ô vòng quay, nền trắng sau ảnh đề) được giữ — đã nằm
  trong mốc của script.
- Chữ đặt thẳng trên tranh nền (không trong thẻ) chỉ dùng cho tiêu đề — lỗi / đang tải / rỗng PHẢI trong thẻ (`TrongHS` hoặc `style={THE}`).
- **⭐ KHÔNG xoá / đổi tên ảnh trong `public/bk-ui/hs/` mà bản đang chạy còn gọi** (Thùy 29/09). App HS là PWA: máy nào để app chạy nền
  vẫn giữ JS cũ tới khi kịp nhận bản mới (tối đa ~30 phút sau khi mở lại, xem `main-hs.tsx`), JS cũ gọi tên file cũ. Đã dính: đổi
  `bg_bau_troi.jpg`/`ill_*.png` ⇒ máy còn bản 28/09 mất tranh nền. Muốn thay ảnh ⇒ **thêm file TÊN MỚI**, sửa style trỏ sang, giữ file cũ
  ≥ 1 tuần sau deploy rồi mới dọn (xoá vẫn theo Luật xoá — hỏi Thùy). Ảnh `.jpg` KHÔNG nằm trong bộ lưu sẵn của SW (chỉ png/svg/js/css) nên
  mất file là mất ngay.
- **⭐ Menu vs màn riêng (Thùy 03/10).** Menu / danh sách / chọn chủ đề (các tầng đi xuống) = `ManHS` trên **tranh nền** như trên.
  **Tầng CUỐI** — nơi em thật sự đọc hoặc làm — thì sang **màn riêng**, KHÔNG đặt ô mờ trên tranh nền (rất khó nhìn):
  1. Bấm vào **1 câu hỏi / 1 bài** ⇒ màn làm bài riêng (`LamBai` và các màn đấu đã định nghĩa).
  2. Bấm vào **1 kiến thức** (mục sổ tay, lý thuyết 1 dạng, …) ⇒ **màn đọc** `ManDocHS` (nền SÁNG trơn, thẻ trắng, chữ tối — mẫu file
     gốc KHTN Pocket): `ManDocHS` (trang + nút quay lại + đường dẫn) · `TheDocHS` (chip → tiêu đề → tóm tắt → khối) · `ChipDocHS` ·
     `KhoiDocHS` (`cong_thuc` · `vi_du` · `nham` · `luu_y` · `hinh` · `thuong`) · `TrongDocHS`. Màu đọc từ `--sk-doc-*` (registry
     `DOC_MAC_DINH`, style muốn khác thì khai `Skin.doc`); **màu nhấn theo MÔN/phân môn** truyền vào `mau={mauDocMon(mon, phanMon)}` —
     không tự chọn màu theo môn trong màn. Mẫu dùng: `DocMuc` / `DocDang` trong `SoTayHS.tsx`.
- **Vỏ ERP nhân sự cũng dùng các style này** (13/10): thanh trên cùng + Trang chính + trang nhóm của ERP vẽ bằng `bienCss()` + biến `--sk-*`,
  nhân sự tự chọn giữa "Mặc định" (giao diện ERP cũ, khai riêng trong `erpSkin.ts`) và các style có tranh của `SKINS` (kèm hình nền, sáng/tối; Tối giản
  không đưa vào vì trùng vai với Mặc định) — `src/lib/erpSkin.ts`, lưu `nhan_su.erp_giao_dien`. Hệ quả khi sửa style:
  ① thêm style mới ⇒ ERP tự có thêm lựa chọn, nhưng **font của style phải khai thêm ở `index.html`** (ERP không nạp `hs.html`);
  ② ERP lấy icon theo khoá ô `nhiem_vu` · `giao_trinh` · `thanh_tuu` · `tu_luyen` · `luyen_yeu` · `rank` · `thong_tin` và `nhanVat.nam` — đổi / bỏ khoá thì mở
  `/xem-thu-erp.html` soi lại Trang chính (thiếu hình ⇒ ERP rơi về emoji, không vỡ).
- Màn đăng nhập (`src/auth/Login.tsx`, dùng chung mọi app) tự khoá `colorScheme: 'light'` — skin tối gắn lên `<html>` từ lúc khởi động
  từng làm chữ ô nhập thành trắng trên nền trắng (29/09).

## 2.5 ⭐ LỜI CHỮ: gốc FORMAL, style game được múa máy (Thùy 03/10)

- Bản gốc của mọi câu chữ là **formal** (`skin/loi.ts` → `LOI_FORMAL`). Style game khai `Skin.loi` (vd `LOI_GAME`) ghi đè từng khoá bằng giọng game; khoá không ghi đè rơi về formal. Style mặc định/tối giản KHÔNG khai `loi`.
- Màn đọc chữ qua `useLoi()` (KhungHS) — cấm gõ chữ giọng game (chiêu, quái, tuyệt kỹ…) thẳng trong màn, cấm so id style. Thêm khoá: viết bản formal trước.
- Chỉ đổi câu chữ; logic/số liệu y hệt mọi style.

## 2.6 ⭐ NỀN: màn NGOÀI dùng tranh, màn TRONG đơn sắc (Thùy 06/10)
- **Màn NGOÀI** (có tranh nền của style): Home · khu Học tập (5 đảo) · bản đồ thế giới/lục địa/chặng (có cảnh riêng). Chỉ các màn này được xin tranh: `<ManHS nen="tranh">` hoặc dùng `var(--sk-page)`.
- **Màn TRONG** (mọi màn còn lại — Nhiệm vụ, Thư viện, Hướng dẫn, Hồ sơ, Album, Thành tựu, Ví xu, Trò chơi, Thông tin học tập, danh sách bài, làm bài…): **nền ĐƠN SẮC/tối riêng** của style = biến `--sk-nen-trong` (mặc định `Mau.bg`; style khai `nenTrong` nếu muốn khác). `ManHS` MẶC ĐỊNH là màn trong; chữ không cần bóng. Cấm đặt tranh nền (`--sk-page`) ở màn trong.

## 2.7 ⭐ Style 2 CHẾ ĐỘ + màn chính "SỐNG" (Lo-fi chill 12/10)

- **Style ẢNH có cả sáng lẫn tối** (trước 12/10: RPG chỉ tối, Khối chỉ sáng): mỗi `hinhNen` khai đủ `sang` · `sangDoc` · `toi` · `toiDoc`; `theTiep` và
  `nenTen` khai `{ sang, toi }` (style 1 chế độ giữ kiểu cũ — `bienCss()` tự chọn); nhân vật Home có bản đêm thì khai thêm `nhanVatToi`.
- **Nhân vật Home không phải "một người đứng"** (Lo-fi: cả góc học gần vuông, mép mờ dần): `nhanVatBoCuc { cot, cao, lech, bong?, dinh? }` chỉnh cột trái /
  chiều cao / độ lệch / chỗ bong bóng thoại / bám đáy khung nhìn khi cuộn; `nhanVatLoc` thay bóng đổ mặc định. Không khai ⇒ y như RPG / Khối.
- **Màn chính "sống"** = `Skin.homeSong` (hợp đồng `HomeSong` ở `kieu.ts`, vẽ bởi `skin/HomeSong.tsx`): `nen` (lớp phòng đã khoét trời + dải trời trôi sau cửa sổ,
  khai theo hình nền × chế độ × khổ màn) · `nv` (mảnh hoạt họa GHÉP VÙNG trên canvas: động tác chính lặp lại · nghỉ · thú cưng vẫy đuôi · ngáp).
  Style không khai ⇒ Home tĩnh. Luật: chuyển động chậm, biên độ nhỏ · máy bật "giảm chuyển động" ⇒ đứng yên · KHÔNG đặt hoạt họa ở màn làm bài.
- Hình + số đo của `homeSong` do script của style sinh ra (Lo-fi: `scripts/lofi-hinh.mjs` → `styles/lofiSong.ts`) — đừng sửa tay; khung vẽ lại lệch 8–27% điểm ảnh
  so với hình gốc nên chỉ lấy MẢNH thay đổi, không thay cả hình (chi tiết: `design/DON-HANG-STYLE-LOFI.md` mục 6).
- **Màn chính "sống" kiểu LINH VẬT** (Đáng yêu 13/10) = `homeSong.linhVat { nam, nu }` (`LinhVatSong`): nhân vật là MỘT con vật nguyên hình đổi tư thế (đứng · chớp mắt · vẫy ·
  vui · lo · ngủ · ăn), mọi tư thế cùng một khung, cỏ dưới chân là lớp riêng. Khác `nv` (ghép vùng) ở chỗ thay CẢ hình ⇒ chỉ dùng khi mọi tư thế vẽ cùng khung và script đã canh thân
  trùng nhau. Vẽ bởi `LinhVatHome`: nhịp vẫy / chớp / ăn / ngủ / giật mình dậy, nét rung tay, co giãn khi đổi tư thế. Bản đồ thế giới kiểu đảo rời: xếp cột so le CAO / THẤP,
  đừng để 5 đảo cùng một tầm cao — tên dài (rộng tới 290px) sẽ đè lên nhau.
- Soi trang xem thử ở chế độ sáng: thêm `&che_do=sang` (mặc định các trang `?xem=` gắn chế độ tối).

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
