# Đơn đặt hàng ChatGPT — Style "Halloween" (id `halloween`) cho app HS

> **Soạn 24/10/2026** theo `design/MAU-DAT-STYLE-HS.md`. Thùy gửi 4 ảnh: ảnh 1 = không khí chính (phố đêm Halloween, ma nhỏ, bí ngô, đèn cam trên nền tím),
> ảnh 2–4 = NÉT VẼ muốn mượn (viền đen dày, má hồng gạch, mắt tròn đen bóng, thân tròn bầu — kiểu Chiikawa/Usagi).
> Thùy chốt: **tên = "Halloween"** · **dành cho** em thích không khí tối / ma / lễ hội · **chỉ chế độ TỐI**. 6 việc còn lại Claude quyết (mục 0) — Thùy không bác thì làm theo.
> - Khuôn = y như Đáng yêu (`DON-HANG-STYLE-NHO-XINH.md`): ảnh toàn cảnh duyệt trước → DỪNG chờ Thùy → từng hình riêng, mỗi lượt đúng 1 hình.
> - Luật 1 style gồm gì / thêm style thế nào: `design/STYLE-HS.md` · hợp đồng code: `src/screens/hocsinh/skin/kieu.ts`.
> - Ảnh tham chiếu (đã lưu): `design/handoff/hs-skin-halloween-v1/reference/` — `khong_khi_halloween.jpg` (ảnh 1) · `net_ve_1.jpg` · `net_ve_2.jpg` · `net_ve_3.jpg` (ảnh 2–4).
>
> | Đơn | Nội dung | Số lượt vẽ | Khi nào gửi |
> |---|---|---|---|
> | **H1** | Màn chính + bộ hình style: 3 nền × 2 khổ · 2 nhân vật ma · 18 icon ô · 2 banner · 2 trang trí | 4 ảnh toàn cảnh + 30 hình | Gửi được ngay |
> | **H2** | **Hoạt họa màn chính** — 9 tư thế × 2 nhân vật · 2 đế · 6 vật hiệu ứng | 26 hình | Sau khi H1 nhóm C (2 nhân vật) được duyệt, trong ĐÚNG context H1 |
> | **H3** | Khu HỌC TẬP: 5 icon · cổng 5 đảo nổi · Chinh phục BK (9 tháp) · sân Đấu trường | 2 ảnh toàn cảnh + 26 hình | Sau khi H1 #01 được duyệt |
> | **H4** | Bản đồ phiêu lưu (10 vùng) + 16 quái + 4 boss (cùng mã với K2 / Đơn 6) | 1 ảnh toàn cảnh + 61 hình | Sau khi H1 #01 được duyệt |
> | **H5** | **Bộ ĐÁNH** — 15 tư thế × 2 nhân vật + 5 vật bay / hiệu ứng | 1 ảnh toàn cảnh + 35 hình | Sau khi H1 nhóm C được duyệt (đừng quên như Đáng yêu — vào trận mới thấy nhân vật anime) |
>
> Không đặt (giống các style trước): bộ khung màn trong (Bảng xếp hạng · Nhiệm vụ · Thành tựu), boss riêng giáo viên, 6 nhân vật chính chạy. Thiếu thì app tự vẽ bằng code / rơi về hình chung, không vỡ.
> Thứ tự ưu tiên: **H1 là đủ để style lên app** (thiếu đơn sau thì dùng hình chung, không vỡ).

## ✅ ĐÃ DỰNG CODE 25/10 (Thùy: "Dựng code style Halloween với bộ hình hiện tại đi, H5 dùng tạm") — nhánh `claude/halloween-style` (clone BK_V2_1)

- **Style:** `skin/styles/halloween.ts` (id `halloween`, hiện trong "Phong cách" sau Đáng yêu; KHÔNG mặc định cho khối nào) · chỉ chế độ TỐI · thẻ tím đêm `#3b2557` viền tím sáng 2,5px bo 22px,
  bóng cứng · chữ thường Be Vietnam Pro, tiêu đề Baloo 2 (cả hai đã có sẵn ở `hs.html` + `index.html` — không thêm font) · 3 nền (Phố đêm mặc định · Nghĩa địa trăng · Vườn bí ngô) × 2 khổ ·
  23 icon ô · 2 banner · góc thẻ (`corner.png` — ôm góc thật, khác Đáng yêu) · gạch ngang · lời chữ `LOI_HALLOWEEN` (mục 5).
- **⚠ Đổi màu nhấn so với đơn:** đơn ghi nút CAM CHÁY `#b8480f` chữ trắng. Soi app thì `acc` còn là màu CHỮ nhấn trên thẻ tím (chuỗi ngày, số liệu) — ở đó cam cháy chỉ 2,5:1, không đọc được
  ⇒ đổi sang **cam đèn `#ff9a4d` + chữ tím đậm `#2a1740` trên nút** (chữ cam trên thẻ 6,3:1 · chữ trên nút 7,7:1 — cùng cách RPG dùng vàng + chữ tối). Bảng token mục 7 đã sửa theo.
- **Màn chính "sống" kiểu LINH VẬT** (như Đáng yêu): bé ma phù thủy / ma bí ngô 9 tư thế + đế riêng. Hình đứng (H1) có lá vẽ ĐÈ lên tà váy, tách mảnh không được ⇒ script thay phần tà dưới 80,5% khung
  bằng tà của tư thế chớp mắt (chồng thử: bóng thân trùng khít), nối mềm 12px.
- **⭐ Bộ đánh H5 — lần đầu dựng hợp đồng `Skin.dau` (`BoDau` ở `skin/kieu.ts`)**: style có `dau` ⇒ `skin/nhanVat.ts` (1 cửa cho mọi chỗ vẽ nhân vật đánh) trả hình + neo của linh vật THAY nhân vật
  em chọn — màn đấu phiêu lưu, Đấu trường, game nhúng, ô nhân vật ở Học tập đổi cùng lúc, không màn nào so id style. Giới của bé ma theo hồ sơ HS (`datGioiDau`, HocSinhApp gắn); chưa biết ⇒ suy
  từ mã nhân vật. Màn **Chọn nhân vật** vẫn hiện 6 nhân vật anime (`anhDauNvGoc`/`hopDauNvGoc`) — lựa chọn của em giữ nguyên trong DB, đổi style khác là dùng lại. 5 vật bay (kẹo ngô · cầu ma ·
  bí ngô rơi · khói tím · bong bóng) thay bộ chung qua `Skin.dau.fx` — `thuthach/hieuUng.ts` giữ kho ảnh theo ĐƯỜNG DẪN nên đổi style giữa chừng nạp đúng bộ. Neo đo bằng script (khung vuông 512²,
  tâm thân + vạch đất của `dung_1` chung mọi tư thế, điểm phát đòn = mép phải / đỉnh vật giơ cao). Style khác không khai `dau` ⇒ y như cũ.
- **Nén hình:** `node scripts/halloween-hinh.mjs` (ảnh gốc ngoài git ⇒ `HALLOWEEN_SRC=<thư mục halloween>` nếu không nằm ở `design/bk-ui-src/halloween/`) → `public/bk-ui/hs/skin/halloween/`
  (~7,5 MB) + sinh `styles/halloweenHocTap.ts` · `styles/halloweenSong.ts` · `styles/halloweenDau.ts` (đừng sửa tay). Ưu tiên bản `_v2` nếu có.
- **✅ Migration `202610251545_hs_giao_dien_skin_halloween.sql` ĐÃ ÁP 25/10 (Thùy, qua SQL Editor).** Trước khi áp đã đối chiếu DB thật bằng `claude_ro`: CHECK cũ đúng 8 giá trị như file. Sau khi áp: cột
  `hs_giao_dien.skin` nhận `… · dang_yeu · halloween`; `schema.md` đã sinh lại. Sổ `_migrations` chưa ghi file này (áp tay) ⇒ `migrate --status` vẫn liệt kê là treo — đừng `npm run migrate` (sổ treo 17 file khác đã áp tay).
- **Đã soi bằng mắt 25/10 (bản dev):** màn chính ngang 1180×820 (Phố đêm, ma phù thủy) · màn chính dọc 430×900 (Nghĩa địa, ma bí ngô) · màn chọn nhân vật · cổng Học tập 5 đảo ·
  thế giới 10 đảo (tên chủ đề dài khối 9 không đè nhau) · màn đấu: 3 câu đúng ⇒ đòn đánh hạ Rùa Đá, sân đấu có bé ma (tư thế `niem_troi_2`) + quái thỏ xác ướp. Kiểm máy: `tsc` (chỉ lỗi có
  sẵn `pdfRender.ts`) · `build:hs` ✔ · `check:style-hs` RỚT 1 chỗ CÓ SẴN từ 17/10 (`CaBoTroHS.tsx` 3 màu > mốc 2 — không do style này; icon + file hình của Halloween đều qua).
- **CHƯA làm / còn lại:** ② chưa soi: Chinh phục BK, lục địa / chặng, Đấu trường BK, game nhúng `src/dautu`, các màn gamification, Vườn bí ngô khổ dọc, máy thật · ③ ô nhân vật ở
  góc Học tập hiện bé ma nhưng TÊN vẫn là nhân vật anime em đã chọn (vd "Nhà thám hiểm") · ④ H5 lá dưới chân (soi trong màn đấu: chấp nhận được ở tư thế đứng; bay / văng thì lá đi theo) ·
  ⑤ 6 hình hiệu ứng `song/fx_*` đã nén, chưa màn nào dùng (như Đáng yêu).

## ✅ KIỂM HÀNG 25/10 — về 187 file = 186 hình + 1 file trùng; **156 dùng ngay · 30 dùng tạm (H5, có lỗi lá dưới chân) · 0 thiếu**

Hình về ở GỐC `bk-ui-src/` (tên mô tả tiếng Việt + "ChatGPT Image…") ⇒ Claude nhận diện **bằng mắt** (tấm ghép từng nhóm, nền xanh lá để lộ chỗ trong suốt),
đổi tên + chuyển vào `design/bk-ui-src/halloween/` (H1) · `halloween/hoat-hoa/` (H2) · `halloween/hoc-tap/` (H3) · `halloween/phieu-luu/` (H4) · `halloween/danh/` (H5) —
sổ `halloween/_doi_ten.log.txt` (hoàn tác được). 195 MB, đã thêm `design/bk-ui-src/halloween/` vào `.gitignore` ⇒ **Thùy cất bản gốc lên Drive** (thư mục `halloween/`) rồi gửi link ghi vào đây.

| Đơn | Dùng được | Phải bổ sung | Ghi chú |
|---|---|---|---|
| **H1** | ✅ **34/34** | — | Đúng nét: viền tím đen dày, tô phẳng, má hồng gạch. Hai bé ma KHÔNG giống nhân vật Chiikawa nào; mũ bí ngô KHÔNG có tai, mũ phù thủy ĐEN dải tím — đúng đơn. 18 icon + 2 banner + 2 trang trí trong suốt thật, có viền sticker kem. `hw_tt_goc` ôm góc trên-trái đúng (khác Đáng yêu). Lệch nhận được: 3 nền NGANG 1505×1045 (tỉ lệ iPad, màn 16:9 xén ~19% dọc — đã biết từ Đáng yêu) · bé ma 1152×1366 thay vì 1122×1402 · gạch phân cách 2172×724 |
| **H2** | ✅ **26/26** | — | 9 tư thế × 2 cùng khung 1122×1402, KHÔNG lá dưới chân (đúng) · 2 đế riêng · 6 hiệu ứng. Nhỏ: `hw_nu_vay_1` / `hw_nu_vay_2` gần như giống nhau (cùng vẫy một phía) ⇒ nhịp vẫy của ma bí ngô yếu, chấp nhận |
| **H3** | ✅ **28/28** | — | 5 icon · 5 đảo · tháp tổng + 8 tháp (gạch đỏ · gỗ · đá · bí ngô · bánh quy gừng · kẹo ngô · xương tròn · mây khói) · 2 đế · cầu đèn lồng · sân đấu 2094×751. `de_cd` 1254² (đơn 1024²), `cau` 1774×887 (đơn 2048×1024) — không ảnh hưởng |
| **H4** | ✅ **62/62** | — | 10 đảo · 10 nền vùng (vật dồn ra mép, giữa trống) · **10 nền dạng ĐẠT ngay lượt đầu**: dải đường sáng liền mép trái→phải nằm đúng 72–76% (đã kẻ vạch soi từng hình) — sơ đồ dải trong đơn có tác dụng · 16 quái + 4 boss đúng dáng, cùng nét, nhóm cuối KHÔNG trôi nét · 6 mốc + 4 vật nhỏ. File trùng: `quai_rua_da` tải 2 lần (md5 giống hệt) ⇒ bản thừa cất `halloween/_thua/`, không xoá |
| **H5** | **36/36 về đủ** — 1 toàn cảnh + 5 hiệu ứng ĐẠT · **30 tư thế dùng TẠM** | Có thể đặt lại 30 tư thế (Thùy quyết) | ① **Cả 30 tư thế đều vẽ lá thu + bí tí hon dưới tà váy** (đơn cấm) — lúc bay / văng / mừng (`niem_troi_2`, `bi_danh_2`, `thang_1` cả nam lẫn nữ) đám lá bay theo người. ② Thân TO hơn đơn (cao ~88% khung kể cả mũ; đơn ~50%), vạch đất ~93–96% thay vì 88% ⇒ script canh lại được, không cần vẽ lại. Đúng dáng 15 tư thế, quay phải, nền trong suốt thật, không vật bay lọt vào |

**Đề xuất:** dựng code với bộ H5 hiện tại; soi trong màn đấu — đám lá dưới chân trông xấu thì mới đặt đơn bổ sung 30 tư thế (bản vẽ lại để cạnh bản cũ tên `_v2`).

---

## 0. Quyết định thiết kế

| # | Vấn đề | Chọn | Ai chốt | Vì sao |
|---|---|---|---|---|
| 1 | Tên trong app + `id` | **"Halloween"** · `halloween` · dòng phụ "Đêm ma đáng yêu" | ✅ Thùy | |
| 2 | Dành cho ai | Em thích không khí **tối / ma / lễ hội** nhưng vẫn muốn dễ thương (không rợn) | ✅ Thùy | Các style đang có: RPG (anime), Khối (Minecraft), Lo-fi (yên tĩnh), Đáng yêu (pastel sáng). Chưa style nào mang màu đêm + lễ hội |
| 3 | Chế độ | **Chỉ TỐI** (`cheDo: ['toi']`) | ✅ Thùy | Đúng ảnh 1. Một chế độ ⇒ nền chỉ vẽ 6 hình (RPG từng chỉ tối — hợp đồng đã chịu được) |
| 4 | Hai nhân vật | **Nam: MA PHÙ THỦY NHỎ** — thân ma kem tròn, đội mũ phù thủy ĐEN dải tím + 1 ngôi sao vàng nhỏ lủng lẳng ở chóp mũ (như ma lớn trong ảnh 1), luôn ôm **GIỎ BÍ NGÔ đầy kẹo** (= vũ khí khi đánh). **Nữ: MA BÍ NGÔ NHỎ** — thân ma kem tròn, đội MŨ BÍ NGÔ cam khoét 2 mắt tam giác sáng vàng + cuống xanh, luôn cầm **ĐÈN LỒNG NẾN** (= vũ khí khi đánh) | Claude | Linh vật = ma (ảnh 1) nên tự thiết kế hoàn toàn. **Đã bỏ "tai tròn" khỏi mũ bí ngô** (Claude đề xuất ban đầu có tai): mũ bí ngô tai tròn + mặt tam giác là đúng bộ đồ trong ảnh 2 ⇒ dễ bị coi là chép. Không gán màu theo giới tính |
| 5 | 3 tranh nền (cái 1 = mặc định) | `pho_dem` PHỐ ĐÊM HIÊN NHÀ (đúng ảnh 1) · `nghia_dia` NGHĨA ĐỊA TRĂNG TRÒN (nến + bia mộ tròn mập, kiểu ảnh 2) · `vuon_bi` VƯỜN BÍ NGÔ (bù nhìn đội mũ, đom đóm) | Claude | Khác nhau rõ từ xa (khung cảnh / màu trăng / mật độ cam). `pho_dem` giống ảnh minh họa nhất ⇒ mặc định |
| 6 | Ẩn dụ phiêu lưu | **Giữ "đi đánh quái", đổi giọng sang "đi hù ma lấy kẹo"**: đúng ⇒ "hù" 1 phát, quái thua thì NHẢ KẸO. Quái = ma / sinh vật Halloween to tròn ngố, KHÔNG đáng sợ | Claude | Giữ nguyên logic 16 quái + 4 boss + mã loài. Chỉ đổi `LOI_HALLOWEEN` (mục 5) |
| 7 | Font | Tiêu đề + tên ô: **Baloo 2** 800 (tròn, béo — đã nạp ở `hs.html`) · chữ thường: **Be Vietnam Pro** (đã có) | Claude | Cả hai đã có bộ tiếng Việt, 0 font mới ⇒ 0 rủi ro mất dấu. Đề Toán đọc thoải mái |
| 8 | Màn chính "sống" (2 khung hành động riêng) | Nam **ĂN KẸO MÚT** · nữ **THỔI NẾN ĐÈN LỒNG** (hít hơi → thổi, ngọn nến nghiêng) | Claude | Hợp món đồ luôn cầm; ngọn nến tí hon là phần của đèn lồng nên vẽ được |
| 9 | Quan hệ với style đang có | **Thêm song song** (không thay) | Claude | Mặc định theo quy trình. Không đặt làm mặc định cho khối nào |
| 10 | Mức "giống Chiikawa/Usagi" | Giống tối đa về **CÁCH VẼ** (viền đen dày, tô phẳng, má hồng gạch có vạch chéo, mắt tròn đen bóng có 1 chấm sáng, thân tròn bầu, tay tí hon). **KHÔNG vẽ lại nhân vật nào** của Nagano | Claude | Cách vẽ không ai giữ bản quyền; cái bị bảo vệ là từng nhân vật + bộ trang phục. Danh sách CẤM ở PHONG CÁCH CHUNG |
| 11 | Chất liệu nền vs nhân vật | **Nền** = tranh vẽ tay mềm có ÁNH SÁNG ẤM loang (như ảnh 1) nhưng đơn giản hơn nhiều · **Nhân vật + vật + icon + quái** = phẳng viền dày (như ảnh 2–4) | Claude | Nền tối cần ánh đèn mới "ra đêm Halloween"; nhân vật phẳng viền dày mới "đáng yêu" và dễ nén / hoạt họa |

---

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` → dán khối **PHONG CÁCH CHUNG — HALLOWEEN** (ngay dưới) → dán nguyên khối **ĐƠN ĐẶT HÀNG** của đơn đó.
2. Đính kèm:
   - `design/handoff/hs-skin-halloween-v1/reference/khong_khi_halloween.jpg` — **KHÔNG KHÍ + BẢNG MÀU + ÁNH SÁNG** (ảnh 1). Chỉ lấy không khí; chữ trong ảnh ("TRICK or TREAT", "BOO!") KHÔNG vẽ lại.
   - `net_ve_1.jpg` · `net_ve_2.jpg` · `net_ve_3.jpg` (cùng thư mục) — **NÉT VẼ** (viền dày, má, mắt, tô phẳng). Ghi rõ với ChatGPT: **không vẽ lại các nhân vật trong 3 ảnh này, không vẽ bộ trang phục của họ, không vẽ chữ "HALLOWEEN" kiểu đó**.
   - `design/handoff/hs-skin-khoi-v1/reference/bo_cuc_home_ipad.jpg` · `bo_cuc_home_dt.jpg` · `bo_cuc_nhiem_vu_ipad.jpg` — **BỐ CỤC + NỘI DUNG** màn chính / Nhiệm vụ (chụp từ code, style RPG). Chỉ lấy bố cục.
   - `design/bk-ui-src/khoi-20261009T113603Z-1-001/khoi/khoi_man_chinh_ipad.png` — ảnh toàn cảnh đã duyệt của Khối, để thấy **mức hoàn thiện** cần đạt (không lấy phong cách).
   - Đơn H2–H5: đính kèm thêm hình H1 đã duyệt (#01 + 2 icon + 2 nhân vật) làm mẫu NÉT.
3. ChatGPT vẽ **#01** rồi DỪNG ⇒ Thùy duyệt phong cách. Chưa ưng thì sửa #01; ưng rồi mới gõ "tiếp".
4. **Tải về theo ĐÚNG thứ tự #** vào `design/bk-ui-src/halloween/` (H1) · `halloween/hoat-hoa/` (H2) · `halloween/hoc-tap/` (H3) · `halloween/phieu-luu/` (H4) · `halloween/danh/` (H5).
   Không cần đổi tên — Claude nhận diện **bằng mắt**. Hình nào bắt vẽ lại thì ghi chú số # của hình đó.
5. Xong nhóm nào (B, C, D…) báo Claude kiểm nhóm đó, đừng đợi đủ cả đơn.
6. Ảnh gốc KHÔNG lên git — cất bản chính lên Drive (thư mục `halloween/` cạnh `nho-xinh/`, `khoi/`), gửi link để Claude ghi vào đây.
   Claude nén bản app dùng vào `public/bk-ui/hs/skin/halloween/`.
7. **Tự kiểm nhanh trước khi tải** (hình nào cần nền trong suốt): mở ra mà vẫn thấy nền tím / ô caro giả / bãi cỏ dưới chân / bóng đổ ⇒ gõ "nền chưa trong suốt, làm lại" ngay trong lượt đó.
   Hình nào có CHỮ (biển, bia mộ, bảng hiệu) ⇒ gõ "xoá chữ, để trống, làm lại".

---

## PHONG CÁCH CHUNG — HALLOWEEN (dán kèm MỌI đơn)

```
PHONG CÁCH CHUNG — style "Halloween" của app học sinh BK Academy (trung tâm dạy thêm Toán, học sinh lớp 3–12)
MỤC TIÊU:    nhìn vào là thấy NGAY "đêm Halloween đáng yêu": trời tím đêm, trăng khuyết, đèn lồng cam ấm, bí ngô khoét mặt, các bé MA tròn
             trắng kem xin kẹo. Không khí ẤM + HIỀN, không rợn. Giống ở CÁCH VẼ — MỌI nhân vật, sinh vật, đồ vật ĐỀU TỰ THIẾT KẾ.
Nét vẽ:      NHÂN VẬT / SINH VẬT / ĐỒ VẬT / ICON = vẽ tay 2D PHẲNG. NÉT VIỀN TÍM ĐEN #1e1030 DÀY (≈ 3% bề ngang vật), đều, đầu nét tròn,
             hơi mềm tay (không vector sắc lẹm). Tô màu phẳng 1 lớp, tối đa 1 mảng bóng nhạt, KHÔNG chuyển sắc bóng bẩy, KHÔNG viền sáng.
             Chi tiết ÍT: mỗi vật chỉ vài nét. KHÔNG 3D, KHÔNG ảnh chụp, KHÔNG pixel, KHÔNG nét anime tỉ mỉ.
             NỀN (tranh phong cảnh) = vẽ tay mềm hơn, có ÁNH SÁNG ẤM loang nhẹ quanh đèn lồng / cửa sổ / bí ngô phát sáng (như ảnh khong_khi_halloween),
             nhưng ĐƠN GIẢN hơn ảnh đó nhiều: ít chi tiết, mảng màu lớn, nhiều khoảng trống.
Sinh vật:    nhân vật MA = thân tròn bầu như bánh mochi màu KEM #f6ead9, đầu liền thân, phần dưới là tà lượn sóng (3–4 đợt) chạm đất, KHÔNG chân,
             tay tí hon là 2 mẩu tròn, MẮT = 2 hình bầu dục đen bóng có 1 chấm sáng, miệng nhỏ cười, MÁ HỒNG GẠCH #e8a9a0 bầu dục 2 bên
             (kèm 2–3 vạch chéo nhạt như ảnh net_ve). Biểu cảm rõ bằng dáng người + vài nét.
             QUÁI = sinh vật TO TRÒN NGỐ (gấp 3 nhân vật), cùng nét viền, mặt "dỗi" kiểu trẻ con (lông mày chéo, miệng mếu), KHÔNG đáng sợ.
Bảng màu (hex đã ĐO từ ảnh khong_khi_halloween):
             trời đêm #251836 → #362350 → #52316a → #603871 · bóng tối nhà / đường #25141a #3d1c23 #522a2d · ĐÈN / cửa sổ / nến #ffc063
             · bí ngô cam #cc6b2e (sáng #e8893f · đậm #9a3a17) · mũ phù thủy tím nhạt #b89dcb · ma kem #f6ead9 (bóng #e8d9d6) · má hồng #e8a9a0
             · lá thu #bf6d3b · cuống bí / lá xanh #7fa86a · NÉT VIỀN nhân vật + vật #1e1030 · chữ trên nền tối kem #fff3e0.
             Tối nhưng ẤM: KHÔNG đen tuyền, KHÔNG neon, KHÔNG xanh lạnh gắt. Cam + vàng đèn là điểm sáng DUY NHẤT mạnh; tím là màu nền.
Đồ vật:      bí ngô khoét mặt (mặt cười hiền, tam giác tròn góc), đèn lồng sắt có nến, kẹo mút xoắn, kẹo ngô (3 lớp vàng-cam-trắng), mũ phù thủy,
             dơi nhỏ tròn (cánh ngắn, có mặt cười), mèo đen tròn, quạ đen tròn, lá thu, nến, dây đèn tròn cam / tím, bia mộ vòm tròn (KHÔNG chữ).
             Đồ vật KHÔNG có mặt (không mắt miệng) — trừ bí ngô khoét, dơi, mèo, quạ, ma, quái.
ĐƯỢC giống:  CÁCH VẼ của net_ve (viền dày, tô phẳng, má hồng gạch có vạch chéo, mắt tròn đen bóng, thân tròn bầu, tay tí hon, hơi mít ướt) ·
             KHÔNG KHÍ + ÁNH SÁNG + BẢNG MÀU của khong_khi_halloween.
CẤM (bản quyền — có 1 thứ là hỏng cả hình):
             · các nhân vật Chiikawa (tác giả Nagano): bé TRẮNG tai tròn nhỏ hay khóc (Chiikawa) · MÈO trắng tóc mái / tai XANH DƯƠNG chẻ đôi (Hachiware)
               · THỎ VÀNG tai dài lòng tai hồng (Usagi) · sóc bay xám (Momonga) · bé nâu hạt dẻ (Kurimanju) · rái cá (Rakko) · sư tử đá cam (Shisa)
               · các con quái / chimera của truyện.
             · BỘ TRANG PHỤC Halloween trong ảnh net_ve: mũ phù thủy TÍM dải CAM + áo choàng tím · bộ đồ BÍ NGÔ có TAI TRÒN kiểu gấu + mặt tam giác
               · mũ tai sói nâu · giỏ kẹo bí ngô cầm hai tay y như ảnh · dây cờ tam giác mặt bí ngô · con dơi mặt trắng tròn có cánh xám.
               (Mũ phù thủy của ta màu ĐEN dải tím, mũ bí ngô KHÔNG có tai — xem mô tả nhân vật.)
             · kiểu chữ logo "HALLOWEEN" trắng viền dày trong ảnh · mọi chữ "chiikawa" / "ちいかわ" / logo / watermark (kể cả "小紅書").
             · nhân vật hãng khác: Sumikko Gurashi, Rilakkuma, Sanrio (Hello Kitty, Cinnamoroll, Kuromi, My Melody…), Molang, Mofusand, Line Friends,
               Pokémon (Gastly, Misdreavus…), Kirby, Pusheen, Casper, Boo (Mario), Totoro / bồ hóng, Nightmare Before Christmas, Hotel Transylvania.
             Học sinh nhìn ra là ĐÚNG nhân vật hay đúng bộ đồ của ai đó thì coi như hỏng.
Thẻ:         thẻ TÍM ĐÊM ĐẶC #3b2557, VIỀN TÍM SÁNG #8a62b0 dày ~2,5px bo góc lớn 22px, bóng CỨNG tím đen #150c22 lệch xuống 4px (không bóng mờ).
             Ô con bên trong = mảng cam ánh #ffc063 độ mờ 14% bo tròn, không viền. Khung gần VUÔNG — KHÔNG thẻ dẹt.
             Thẻ "Việc tiếp theo" = tấm VÀNG ĐÈN #ffc063 viền #1e1030, chữ tím đậm #2a1740 (như ô cửa sổ sáng đèn).
Nút:         nút chính = viên bo tròn CAM CHÁY #B8480F viền #1e1030, chữ trắng, bấm lún xuống · nút phụ = viên tím #3b2557 viền #8a62b0, chữ kem.
             Thanh tiến độ = ống bo tròn viền #8a62b0, ruột vàng đèn #ffc063. Badge số = chấm tròn đỏ mận #c2255c viền #1e1030, chữ trắng.
Chữ:         tiêu đề, tên ô, số to = chữ tròn béo Baloo 2 đậm (đủ dấu tiếng Việt) màu kem #fff3e0 · đề bài, đoạn văn, chữ nhỏ = Be Vietnam Pro
             (phải dễ đọc). KHÔNG chữ thảo, KHÔNG chữ "rợn" (chảy máu, xương). Chữ chính ≥ 15px ở điện thoại, ≥ 16px ở iPad; tiếng Việt đúng dấu.
             Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (nhân vật, vật phẩm, quái, nền) KHÔNG có chữ/số nào — KỂ CẢ biển hiệu, bia mộ, bảng gỗ, bảng hiệu cửa tiệm
             (vẽ TRỐNG hoặc chỉ có hình bí ngô / ngôi sao; đừng cố viết "BOO", "TRICK OR TREAT").
Icon / vật phẩm: vì NỀN THẺ TỐI, mỗi icon / vật rời có thêm VIỀN STICKER KEM #fff3e0 mỏng (≈ 2% khung) bao NGOÀI nét viền tím đen,
             như miếng sticker dán — để nổi trên thẻ tím. Chỉ icon, banner, trang trí; nhân vật và quái KHÔNG viền sticker (thân kem sẵn đã nổi).
             QUÁI phải SÁNG hơn nền (màu pastel-bão hoà vừa, không tím đen, không xanh đen).
Thiết bị:    iPad NGANG 1180×820 (ảnh chính — làm khổ ngang trước) + điện thoại DỌC 430px. Màn được cuộn.
CẤM thêm:    khẩu hiệu · chữ tiếng Anh / tiếng Nhật trang trí · máu me, xương sọ thật, dao kéo, nhện thật to, mặt người chết, quan tài mở,
             cảnh đáng sợ · trái tim / vương miện rải khắp màn · ánh sáng chói trắng.

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#13 hw_o_tren_lop".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (các icon, 2 nhân vật và mọi tư thế của chúng, các quái, các vùng đất) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context
  này: giữ ĐỘ DÀY NÉT VIỀN, màu viền, cách tô phẳng, bảng màu — chỉ đổi vật.
```

---

## Đơn H1 — Màn chính + bộ hình của style

Đính kèm: các ảnh ở "Cách gửi" bước 2.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            style-halloween (màn chính + mọi hình của style "Halloween")
Mô tả:          App học sinh trung tâm dạy thêm BK Academy. Thêm style "Halloween" bên cạnh "Anime RPG", "Khối vuông", "Lo-fi chill", "Đáng yêu":
                em chọn style nào thì TOÀN BỘ app đổi theo (màn chính, mọi màn bên trong, popup). Style này dành cho học sinh thích không khí
                đêm Halloween: tối, huyền bí nhưng dễ thương. Bố cục giữ y như ảnh bo_cuc_* đính kèm (style RPG hiện tại) — CHỈ đổi phong cách theo
                PHONG CÁCH CHUNG. Chỗ "nhân vật" trong bố cục = BÉ MA tròn (không có người).

MÀN CHÍNH khổ NGANG (iPad 1180×820) — đúng khối, đúng thứ tự như bo_cuc_home_ipad.jpg (chữ/số do code vẽ; ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Góc trên trái: TẤM TÊN (thẻ tím đêm viền tím sáng) = avatar tròn (2 chữ "MK") + "Nguyễn Minh Khang" + "HS0412 · 6A1 · Toán" + vạch ngăn +
    biểu tượng bậc rank nhỏ + "Captain" + 2 sao.
  - Góc trên phải: nút "Hình nền" (icon bảng màu + chữ) · nút Hòm thư (badge 3) · nút "⋯".
  - Cột TRÁI ≈ 32%: BÉ MA đứng (thân tròn to, cao ≈ 70% màn, tà chạm gần mép dưới, vài lá thu + 1 quả bí ngô nhỏ dưới chân) +
    BONG BÓNG THOẠI (nền kem #fff3e0, viền #1e1030, chữ tím đậm): "Hôm nay còn 2 nhiệm vụ đó!".
  - Cột PHẢI: "Chào Minh Khang!" chữ to 2 dòng (kem) →
      nhóm "HỌC TẬP": thanh chọn môn [Toán | KHTN] (Toán đang chọn) → thẻ ca bổ trợ (tấm vàng đèn) "THỨ 5 01/10 · 17:30" / "Bổ trợ yếu · Toán" /
      "Phòng 204 · Cô Lan" + icon lịch → LƯỚI Ô 4 cột, mỗi ô: icon đặt GIỮA + tên + 1 dòng trạng thái + badge tròn đỏ mận:
        Học tập "Cùng BK chinh phục thế giới" · Nhiệm vụ "Hôm nay còn 2 nhiệm vụ" (badge 2) · Bảng xếp hạng "Captain ★★ · hạng 12/54" ·
        Thông tin học tập "Xem dạng đang yếu" · Sổ tay kiến thức "Tra lý thuyết & bài mẫu" · Làm đề thi thử "Sắp có" (ô KHOÁ, mờ) ·
        Bài tập trên lớp "2 bài chưa làm" (badge 2)
      → nhóm "GIẢI TRÍ": thẻ ngang "Thế giới BK" (icon + "Xem học sinh BK đang khoe gì nào!" + 2 dòng tin) → lưới ô: Thư viện BK ·
        Trò chơi · Thành tựu · May mắn "Có 1 lượt quay!" (badge 1) · Ví xu "1.240 xu".
MÀN CHÍNH khổ DỌC (điện thoại 430px) — như bo_cuc_home_dt.jpg: hàng đầu (avatar · huy hiệu bậc · Hình nền · Hòm thư · ⋯) → "Chào Minh
  Khang!" → bé ma thu nhỏ + bong bóng thoại → HỌC TẬP (môn · thẻ ca · lưới 4 cột ô nhỏ) → GIẢI TRÍ. Được cuộn.
MÀN CON 1 — Nhiệm vụ (iPad ngang) — như bo_cuc_nhiem_vu_ipad.jpg: 4 khối Chặng tháng · Hôm nay · Nhiệm vụ tuần (+ hàng 4 hộp quà) ·
  Nhiệm vụ tháng, đúng chữ + số trong ảnh. Mục đích: chốt dáng THẺ / NÚT / THANH TIẾN ĐỘ cho mọi màn bên trong.
  Màn trong dùng NỀN ĐƠN SẮC tím đêm #2a1a3f (không tranh nền).
MÀN CON 2 — Làm bài (iPad ngang): đầu trang "Câu 3/10" + thanh tiến độ ống vàng đèn · thẻ đề "Tính: 3/4 + 5/6 − 1/2" ·
  4 đáp án A. 13/12  B. 7/6 (đang chọn — viền vàng đèn)  C. 1  D. 5/4 · nút chính "Câu tiếp" + nút phụ "Câu trước". Bài thật của học sinh ⇒ nghiêm túc,
  gọn, dễ đọc, nền tím đêm trơn #2a1a3f — KHÔNG nhân vật, KHÔNG bí ngô / dơi / trang trí trong màn này.

Biến thể:
  3 TRANH NỀN em tự chọn (đều TỐI, phải khác nhau rõ từ xa):
    pho_dem   : PHỐ ĐÊM HIÊN NHÀ (đúng không khí khong_khi_halloween, đơn giản hơn) — trời tím đêm, trăng khuyết vàng kem, vài ngôi sao, vài con dơi tròn
                nhỏ bay, xa là lâu đài mái nhọn có cửa sổ cam sáng trên đồi, bên TRÁI là mái nhà + hiên + dây đèn tròn cam / tím + cột đèn đường
                + đèn lồng treo + bí ngô khoét mặt phát sáng ở chân tường. KHÔNG biển, KHÔNG chữ. — MẶC ĐỊNH
    nghia_dia : NGHĨA ĐỊA TRĂNG TRÒN — trăng tròn to màu kem sau lưng, bia mộ vòm tròn mập xám tím (TRỐNG, không chữ, không chữ thập), nhiều nến trắng
                nhỏ cháy ấm, cổng sắt cong, dơi bay, sương tím mỏng sát đất. Hiền, không rợn. Điểm sáng vàng chỉ ở nến.
    vuon_bi   : VƯỜN BÍ NGÔ ĐÊM — cánh đồng bí nhiều cỡ (vài quả khoét mặt phát sáng), 1 bù nhìn đội mũ rơm (mặt vải trơn / mặt cười đơn giản),
                hàng rào gỗ thấp, đom đóm vàng, trời tím chàm, trăng khuyết nhỏ, quạ đen tròn đậu hàng rào.
  2 BÉ MA em tự chọn (KHÔNG gán theo giới tính), cùng phong cách, cùng tư thế đứng, cùng cỡ:
    nam : MA PHÙ THỦY NHỎ — thân ma kem tròn bầu, tà lượn sóng chạm đất, đội MŨ PHÙ THỦY ĐEN #2a1740 vành rộng cong, DẢI TÍM #b89dcb quanh mũ,
          1 NGÔI SAO VÀNG nhỏ lủng lẳng ở chóp mũ; mắt bầu dục đen bóng, má hồng gạch, miệng nhỏ cười; 2 tay tí hon ôm 1 GIỎ BÍ NGÔ cam
          (khoét mặt cười, quai đen) đầy kẹo nhiều màu thò lên miệng giỏ.
    nu  : MA BÍ NGÔ NHỎ — thân ma kem tròn bầu, tà lượn sóng chạm đất, đội MŨ BÍ NGÔ cam #cc6b2e khoét 2 mắt tam giác tròn góc phát sáng vàng,
          CUỐNG XANH cong lệch trên đỉnh, 1 chiếc lá xanh nhỏ cuốn xoắn bên cuống, KHÔNG TAI; mắt bầu dục đen bóng, má hồng gạch, miệng nhỏ cười;
          1 tay tí hon cầm ĐÈN LỒNG SẮT nhỏ đen có NẾN trắng cháy ngọn lửa vàng bé, tay kia vẫy.
    Cả hai: nhìn thẳng về phía người xem, vài vạch "rung rung" quanh người, 2–3 chiếc lá thu + 1 quả bí ngô tí hon dưới chân.
    PHẢI khác hẳn các nhân vật + bộ đồ trong danh sách CẤM (mũ phù thủy KHÔNG tím dải cam, mũ bí ngô KHÔNG có tai).

Phiên bản kit:  v3 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô, banner): vuông 1254×1254, nền TRONG SUỐT thật (không nền tím, không ô caro giả), vật ở GIỮA chiếm ~80% khung,
  không chữ/số/badge, không khung ô phía sau, không mặt (mắt miệng — trừ bí ngô khoét). Có VIỀN STICKER KEM mỏng (xem PHONG CÁCH CHUNG).
  CẢ BỘ cùng ĐỘ DÀY NÉT VIỀN, cùng cách tô phẳng, cùng cỡ vật — đặt cạnh nhau như 1 trang sticker.
- BÉ MA: dọc 1122×1402, nền TRONG SUỐT, TOÀN THÂN, tà chạm mép dưới (chừa ~3%), thân chiếm ~80% bề ngang khung.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG chữ. Vật nổi bật (mái nhà, trăng, bí phát sáng, đèn) dồn sang TRÁI và 2 góc;
  65% bên PHẢI là trời / đất TỐI DỊU, ÍT chi tiết, KHÔNG nguồn sáng chói (để đặt thẻ tím lên, chữ kem phải đọc được).
- NỀN DỌC: 941×1672 (9:16), nền đặc, KHÔNG nhân vật. Vật nổi bật (trăng, mái nhà, đèn) ở 35% TRÊN; 65% DƯỚI phẳng, tối dịu, chỉ rải lá thu + vài bí nhỏ.
- TRANG TRÍ: góc 1254×1254 trong suốt (cành cây trụi tròn mập + 1 mạng nhện MẢNH hình tròn nhỏ không có nhện + 2–3 lá thu + 1 con dơi tí hon, ôm góc trên-trái, có viền sticker kem);
  gạch phân cách 1672×200 trong suốt (hàng lá thu rải lưa thưa xen 3–4 quả bí tí hon và 2 cây nến nhỏ, mảnh).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 hw_man_chinh_ipad — màn chính khổ NGANG, nền pho_dem, bé MA PHÙ THỦY (nam)   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 hw_man_chinh_dt   — màn chính khổ DỌC, nền pho_dem, bé MA BÍ NGÔ (nữ)
   #03 hw_nhiem_vu_ipad  — màn Nhiệm vụ khổ ngang
   #04 hw_lam_bai_ipad   — màn Làm bài khổ ngang
B. Nền:
   #05 hw_bg_pho_dem_ngang · #06 hw_bg_pho_dem_doc · #07 hw_bg_nghia_dia_ngang · #08 hw_bg_nghia_dia_doc
   #09 hw_bg_vuon_bi_ngang · #10 hw_bg_vuon_bi_doc
C. Bé ma (vẽ đúng như trong #01 / #02 đã duyệt):
   #11 hw_nv_nam (ma phù thủy) · #12 hw_nv_nu (ma bí ngô)
D. Vật phẩm cho ô chức năng (mỗi ô 1 ĐỒ VẬT KHÁC NHAU):
   #13 hw_o_tren_lop      — CẶP SÁCH đeo vai hình quả BÍ NGÔ cam, quai đen, khoá tròn vàng
   #14 hw_o_et            — ĐỒNG HỒ BÁO THỨC tròn 2 chuông màu tím nhạt, 2 chuông là 2 chiếc cánh dơi nhỏ
   #15 hw_o_btvn          — NGÔI NHÀ MA nhỏ mái nhọn màu tím, cửa sổ cam sáng + 1 quyển vở dựng cạnh
   #16 hw_o_tu_luyen      — BÚT LÔNG VŨ mập màu tím + 1 LỌ MỰC tròn nhỏ (ô "Học tập")
   #17 hw_o_nhiem_vu      — BIỂN GỖ nhỏ cắm đất, ghim 1 tờ giấy có 3 ô tích (không chữ)
   #18 hw_o_rank          — HUY HIỆU ngôi sao vàng có 2 dải ruy băng tím
   #19 hw_o_thong_tin     — KÍNH LÚP tròn tay cầm tím soi lên 1 tờ giấy có 3 cột biểu đồ
   #20 hw_o_so_tay        — QUYỂN SỔ PHÉP bìa tím sẫm có hình trăng khuyết vàng + dây đánh dấu cam
   #21 hw_o_thi_thu       — TỜ ĐỀ cuộn tròn + ổ khoá tròn — tông XÁM TRO nhạt (ô đang khoá)
   #22 hw_o_bai_tap_giao  — PHONG THƯ kem dán 1 miếng dán hình con dơi tròn
   #23 hw_o_cup           — CÚP VÀNG tròn mập 2 quai, chóp cúp gắn 1 ngôi sao (Thành tựu)
   #24 hw_o_xep_hang      — BỤC 3 BẬC làm bằng 3 QUẢ BÍ NGÔ (không khoét mặt) cao thấp, 1 lá cờ tam giác nhỏ cắm bậc cao nhất (không số)
   #25 hw_o_may_man       — MÓNG NGỰA vàng quấn 1 dải ruy băng tím + 2 ngôi sao nhỏ lấp lánh
   #26 hw_o_vi_xu         — TÚI VẢI đựng kẹo miệng buộc dây tím, 2 đồng xu vàng thò ra
   #27 hw_o_hoc_tu_dau    — MẦM BÍ NGÔ 2 lá cuống xoắn trong chậu đất nung nhỏ
   #28 hw_o_the_gioi      — QUẢ CẦU PHA LÊ tròn trên đế gỗ, bên trong có trăng khuyết + vài ngôi sao nhỏ
   #29 hw_o_thu_vien      — CHỒNG 3 CUỐN SÁCH PHÉP bìa tím / cam / xanh rêu có khoá, xếp lệch
   #30 hw_o_tro_choi      — KẸO MÚT XOẮN to cam-tím + 1 con quay gỗ
E. Vật phẩm cho banner:
   #31 hw_b_lich          — TỜ LỊCH XÉ tròn góc, 1 ngày khoanh tròn cam (thẻ ca bổ trợ)
   #32 hw_b_kiem_tra_lai  — TỜ BÀI có dấu tích to + bút lông vũ, viền ánh CAM nhạt (banner bài kiểm tra lại)
F. Trang trí:
   #33 hw_tt_goc          — cành trụi + mạng nhện mảnh + lá thu + dơi (góc)
   #34 hw_tt_gach         — hàng lá thu + bí tí hon + nến (gạch phân cách)

LUẬT RIÊNG:
  - Giữ nguyên danh sách ô, tên, thứ tự, số như mô tả. Không thêm tính năng, không thêm chữ.
  - Câu duy nhất có "giọng" = bong bóng thoại của bé ma, phải có số thật.
  - Chữ đặt trên tranh nền phải đọc được (chữ kem trên vùng tối, hoặc đặt trong thẻ).
  - Mọi sinh vật / đồ vật TỰ THIẾT KẾ theo danh sách ĐƯỢC / CẤM ở PHONG CÁCH CHUNG — đặc biệt KHÔNG ra các nhân vật / bộ đồ trong ảnh net_ve,
    KHÔNG vẽ lại chữ "TRICK or TREAT" / "BOO!" trong ảnh khong_khi_halloween.

Bắt đầu với #01.
```

---

## Đơn H2 — Hoạt họa bé ma (gửi SAU khi H1 #11 + #12 được duyệt, trong ĐÚNG context đã vẽ H1)

> Hết context thì mở mới, đính kèm #11, #12 + 2 icon. Đường viền "sôi" và nhịp nhún do **code** làm (như Đáng yêu mục 6) — đơn này chỉ vẽ TƯ THẾ.
> Màn chính "sống" kiểu LINH VẬT (`homeSong.linhVat`): mọi tư thế CÙNG MỘT KHUNG, thay cả hình. Khác Đáng yêu: **ma không có chân**, tà váy chạm đất ⇒ "đế" là 1 mảng bóng + lá thu vẽ RIÊNG.

```
ĐƠN BỔ SUNG — TƯ THẾ BÉ MA (vẫn luật cũ: ĐÚNG 1 HÌNH mỗi lượt, dòng đầu ghi số + tên file, chờ "tiếp")
Mục đích: bé ma ở màn chính cử động nhẹ — chớp mắt, vẫy tay, ăn kẹo / thổi nến, ngủ gật, mừng. Tôi tự ghép các hình thành chuyển động.
MỌI hình tư thế: dọc 1122×1402, nền TRONG SUỐT, CÙNG bé ma đã duyệt (#11 / #12): cùng cỡ thân, cùng vị trí tà váy chạm đất trong khung
(đúng chỗ cũ, sát mép dưới), cùng độ dày nét viền, cùng màu, cùng mũ + món đồ. CHỈ đổi tư thế + biểu cảm nêu dưới.
KHÔNG vẽ lá thu, bí ngô, bóng đổ dưới chân trong các hình tư thế (đế vẽ riêng ở C). KHÔNG chữ.

A. Ma phù thủy (#11):
   #01 hw_nam_chop_mat   — y hệt #11, chỉ 2 mắt thành 2 vạch cong nhắm lại
   #02 hw_nam_vay_1      — 1 tay giơ cao vẫy (nghiêng trái), tay kia ôm giỏ bí ngô      #03 hw_nam_vay_2 — tay vẫy nghiêng sang phải
   #04 hw_nam_vui        — nhảy cẫng: cả người BAY LÊN khỏi mặt đất một chút (tà váy rời mép dưới), 2 tay giơ giỏ bí ngô lên trời, mắt cười, 3 vạch rung quanh người
   #05 hw_nam_mung_khoc  — giỏ đặt cạnh người (cả giỏ vẫn nằm trong khung, chạm mép tà), 2 tay áp lên má, mắt to long lanh rưng rưng, 2 giọt nước nhỏ ở khoé mắt
   #06 hw_nam_lo         — co người lại, run (vạch rung 2 bên), 1 giọt mồ hôi trên trán, miệng méo, chóp mũ sụp xuống, ôm giỏ chặt
   #07 hw_nam_ngu        — người xẹp thấp, tà váy bẹp xoè ra đất, mắt nhắm, đầu gục, mũ trượt che nửa mặt, 1 bong bóng mũi nhỏ, ôm giỏ trong lòng
   #08 hw_nam_an_1       — 1 tay ôm giỏ, tay kia cầm 1 KẸO MÚT XOẮN to (cam-tím) đưa lên gần miệng, mắt sáng
   #09 hw_nam_an_2       — kẹo mút đã đưa vào miệng, má phồng một bên, mắt cười cong, 1–2 vạch rung vui
B. Ma bí ngô (#12):
   #10 hw_nu_chop_mat · #11 hw_nu_vay_1 · #12 hw_nu_vay_2 (tay không cầm đèn vẫy; tay cầm đèn giữ trước bụng) · #13 hw_nu_vui (bay lên, 2 tay giơ đèn lồng
   lên trời) · #14 hw_nu_mung_khoc (đèn lồng đặt cạnh người) · #15 hw_nu_lo (ngọn nến co nhỏ run) · #16 hw_nu_ngu (ôm đèn lồng, ngọn nến nhỏ yếu, mũ bí ngô trượt)
   · #17 hw_nu_an_1 (THỔI NẾN 1 — hít hơi: giơ đèn lồng lên ngang miệng, 2 má phồng tròn, mắt nhìn nến, ngọn nến thẳng)
   · #18 hw_nu_an_2 (THỔI NẾN 2 — chu miệng thành vòng tròn nhỏ "ooo", ngọn nến NGHIÊNG sang phải và bé lại, mắt cười hí)
   (đúng 9 tư thế như ma phù thủy; tên "an_1 / an_2" giữ nguyên dù nữ thổi nến, vì code dùng chung tên tư thế)
C. ĐẾ (vẽ RIÊNG, cùng khung dọc 1122×1402, nền TRONG SUỐT, CHỈ có phần dưới chân, đúng vị trí trong khung để đặt dưới tà váy — KHÔNG có bé ma):
   #19 hw_de_nam — 1 mảng bóng tròn dẹt tím đen #150c22 (mờ, không viền) dưới chân + 4–5 chiếc lá thu rải + 1 quả bí ngô tí hon khoét mặt cười
   #20 hw_de_nu  — mảng bóng + vài lá thu + 1 cây nến nhỏ đã tắt (không lửa) + 1 viên kẹo bọc giấy
D. VẬT NHỎ cho hiệu ứng (512×512, nền TRONG SUỐT, 1 vật ở giữa ~60% khung, cùng nét viền #1e1030, có viền sticker kem mỏng):
   #21 hw_fx_sao      — 1 ngôi sao 4 cánh vàng đèn tròn mập
   #22 hw_fx_rung     — cụm 3 vạch ngắn song song màu kem (dấu "rung rung")
   #23 hw_fx_mo_hoi   — 1 giọt mồ hôi xanh nhạt
   #24 hw_fx_bui      — 1 cụm khói "bụp" màu tím nhạt (3 cục mây nhỏ dính nhau)
   #25 hw_fx_la       — 1 chiếc lá thu cam nâu
   #26 hw_fx_doi      — 1 con dơi tí hon tròn, cánh xoè ngắn, mặt cười nhỏ (màu tím sẫm sáng #6b4a94 để nổi trên nền tối)

Bắt đầu với #01.
```

---

## Đơn H3 — Khu HỌC TẬP — gửi sau khi H1 #01 được duyệt

> Bố cục y như RPG / Khối / Đáng yêu (vị trí 5 "đảo" đặt bằng code). Đường nối giữa các đảo do code vẽ.
> **Cách gửi:** context MỚI → kit → PHONG CÁCH CHUNG → khối dưới. Đính kèm: H1 #01 + 2 icon + 2 bé ma đã duyệt (mẫu NÉT) · bố cục:
> `design/bk-ui-src/AppHS/hs-hoc-tap-v2/reference/reference_hoc_tap.png` (cổng 5 đảo) · ảnh Chinh phục K3 #14 trong `bk-ui-src/khoi/hoc-tap/` ·
> `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png` (sân đấu) — ghi rõ "chỉ lấy bố cục, vẽ mới hoàn toàn".

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            hoc-tap-halloween (khu HỌC TẬP của style "Halloween": cổng 5 đảo nổi · Chinh phục BK · sân Đấu trường)
Mô tả:          Bấm "Học tập" ngoài màn chính ⇒ ra 5 chế độ học, mỗi chế độ là 1 ĐẢO NỔI TRÒN lơ lửng trên bầu trời đêm (gò đất tối, mặt trên
                phủ cỏ khô tím, đáy đất nâu tím tròn), trên mỗi đảo có 1 công trình nhỏ: Học theo chủ đề · Luyện dạng yếu · Đấu trường BK ·
                Chinh phục BK (leo tháp) · Giải Vô địch BK. Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — HALLOWEEN + hình đã duyệt đính kèm: viền #1e1030 dày, tô phẳng, rất ít chi tiết. Trời tím đêm, trăng khuyết,
                mây tím như khói, sao vàng nhỏ. Ánh đèn cam ẤM từ cửa sổ / đèn lồng trên đảo. Hiền, huyền bí.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô): như H1 — vuông 1254×1254, TRONG SUỐT, vật giữa ~80%, viền sticker kem, cùng nét với icon đã duyệt.
- NỀN: nền ĐẶC, KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ. Ngang 1672×941 · dọc 941×1672.
- ĐẢO / THÁP / ĐẾ / CẦU: nền TRONG SUỐT thật, đúng 1 vật, chừa lề trong suốt quanh vật, không bóng đổ ra nền.
- KHÔNG chữ, số, logo, khung trong MỌI hình (trừ 2 ảnh toàn cảnh #01, #14 được có chữ mẫu). Biển chỉ đường, bia, cờ: TRỐNG hoặc hình mũi tên / bí ngô.

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 hw_hoc_tap_ipad — ảnh toàn cảnh iPad NGANG 1672×941: trời tím đêm, trăng khuyết, mây khói tím, 5 ĐẢO NỔI (đúng 5 đảo ở mục C),
       bố cục: (1) TO NHẤT ở giữa hơi cao · (3) trái-trên · (4) phải-trên · (2) trái-dưới · (5) phải-dưới; đường chấm chấm vàng đèn nối 4 đảo về đảo giữa;
       dưới mỗi đảo có tên + 1 dòng chú thích mẫu (chữ kem); trên cùng thanh tiêu đề "Học tập". ≈12% trên cùng KHÔNG đặt đảo.   → DỪNG, chờ Thùy duyệt
B. 5 icon ô (mỗi ô 1 ĐỒ VẬT KHÁC HẲN các icon H1)
   #02 hw_o_hoc_chu_de   — TẤM BẢN ĐỒ KHO BÁU giấy cuộn mở, có đường chấm chấm và 1 dấu X cam
   #03 hw_o_luyen_yeu    — BÌNH THUỐC tròn mập xanh lá sủi bong bóng, nút bần
   #04 hw_o_dau_truong   — 2 LÁ CỜ tam giác bắt chéo (1 cam, 1 tím), mỗi lá có 1 hình dơi tí hon (không chữ)
   #05 hw_o_chinh_phuc   — LÂU ĐÀI MA tròn mập 3 tầng màu tím, mái nón nhọn, cửa sổ cam sáng, cờ nhỏ trên đỉnh
   #06 hw_o_giai_vo_dich — VƯƠNG MIỆN vàng tròn mập 3 chóp, gắn 3 viên đá cam
C. Cổng Học tập (vẽ lại ĐÚNG như #01 đã duyệt)
   #07 hw_ht_nen_ngang — đúng cảnh #01 nhưng KHÔNG 5 đảo, KHÔNG đường chấm, KHÔNG chữ. Vùng dưới mỗi vị trí đảo TỐI DỊU, ít chi tiết. 1672×941.
   #08 hw_ht_nen_doc   — như #07 khổ DỌC 941×1672 (1 đảo giữa ở trên + 2 hàng đôi).
   #09 dao_hoc_chu_de   — đảo TO NHẤT: 1 cây khô to tán tròn lá cam + biển chỉ đường nhiều mũi tên (TRỐNG, không chữ) + đèn lồng treo + lối mòn chấm chấm
   #10 dao_luyen_yeu    — đảo VƯỜN BÍ NGÔ nhỏ: 3 luống bí con, hàng rào gỗ thấp, 1 VẠC tròn xanh sủi bọt
   #11 dao_dau_truong   — đảo SÂN ĐẤU: vòng tròn vẽ vôi trắng trên cỏ khô, 2 cột cờ cam + tím 2 bên, 2 cây đuốc nến nhỏ
   #12 dao_chinh_phuc   — đảo có LÂU ĐÀI MA tròn mập cao nhiều tầng, mái nón, cửa sổ cam sáng, mây khói vắt ngang thân tháp, dơi nhỏ bay quanh
   #13 dao_giai_vo_dich — đảo có BỤC 3 BẬC + CÚP VÀNG to ở bậc giữa + dây cờ tam giác nhiều màu (không mặt, không chữ) phía trên + 2 đèn lồng
       #09–#13: vuông 1024×1024 (cạnh ≥1024), đảo nằm GIỮA ảnh, công trình chiếm phần lớn mặt đảo — nhìn hình là biết chế độ gì.
D. Chinh phục BK (màn chọn tháp để leo)
   #14 hw_chinh_phuc_ipad — ảnh toàn cảnh iPad NGANG 1672×941: CHÍNH GIỮA 1 THÁP TỔNG tròn mập thật cao (lâu đài ma nhiều tầng màu tím, cửa sổ cam sáng,
       mái nón nhọn, mây khói vắt ngang) trên 1 ĐẢO nổi; xung quanh vòng cung 2 bên, thấp và xa hơn: 8 THÁP CHỦ ĐỀ nhỏ, mỗi tháp trên 1 đảo nhỏ,
       nối về giữa bằng CẦU VÁN cong. Dưới chân mỗi tháp tên + "Tầng 12" mẫu. ≈12% trên + ≈14% dưới không đặt tháp.     → DỪNG, chờ Thùy duyệt
   #15 hw_cp_nen     — đúng cảnh #14 CHỈ trời + mây + trăng + sao: KHÔNG tháp, KHÔNG đảo, KHÔNG cầu, KHÔNG chữ. 1672×941.
   #16 thap_tong     — tháp tổng vẽ lại đúng #14, KHÔNG đảo dưới chân. 1024×1536 (đứng), chân tháp CHẠM ĐÁY ảnh.
   #17–#24 thap_cd_1 … thap_cd_8 — 8 tháp chủ đề, MỖI THÁP 1 CHẤT LIỆU khác nhau, cùng nét, đều có cửa sổ cam sáng:
       1 gạch đỏ sẫm xếp tầng · 2 gỗ ván xiêu cũ · 3 đá bia mộ xám tím · 4 BÍ NGÔ khổng lồ xếp chồng nhiều tầng · 5 bánh quy gừng xếp tầng (viền kem như kem đường) ·
       6 KẸO NGÔ xếp tầng (vàng-cam-trắng) + kẹo mút cắm làm cột cờ · 7 xương trắng TRÒN MẬP xếp tầng (hiền, không sọ người) · 8 mây khói tím bông.
       Mỗi tháp 1024×1536, chân chạm đáy, KHÔNG đảo dưới chân.
   #25 de_tong — ĐẢO nổi LỚN dưới tháp tổng (mặt cỏ khô PHẲNG rộng, đáy đất nâu tím tròn). Ngang 1536×1024, mặt phẳng ở ~50% ngang · 35% cao.
   #26 de_cd   — ĐẢO nhỏ cùng kiểu #25. Vuông 1024×1024, mặt phẳng ở ~50% ngang · 40% cao.
   #27 cau     — CẦU VÁN GỖ cong nhẹ nhìn ngang, lan can dây thừng có 3 đèn lồng nhỏ cam, 2 đầu cầu sát mép TRÁI và PHẢI ảnh, ngang 2048×1024.
E. Sân Đấu trường
   #28 nen_san_dau — ngang 2400×860, nền đặc, góc nhìn ngang nhẹ từ trên: SÂN ĐẤT / cỏ khô phẳng chiếm dải dưới (mặt sân từ ≈62% chiều cao), 2 bên là
       hàng rào gỗ thấp + bí ngô khoét mặt phát sáng + đèn lồng, nền xa là đồi tối + lâu đài mái nhọn + trăng khuyết + dây cờ tam giác (trống). Vùng GIỮA (25–75% ngang)
       THOÁNG, tối dịu (đặt khung câu hỏi). Chỗ đứng: bên TRÁI và bên PHẢI, cùng ở ≈78% chiều cao. KHÔNG nhân vật, KHÔNG chữ.

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình (trừ #01, #14). KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## Đơn H4 — Bản đồ phiêu lưu + quái (bản Halloween của K2) — gửi sau khi H1 #01 được duyệt

> Cây kiến thức → bản đồ (`spec-v1-app-hs.md` §4): chủ đề = lục địa · chuyên đề = khu vực · dạng = màn đấu · cụm = quái.
> **Cùng mã file với K2/K3/N4** (DB gán cố định) — chỉ đổi nét vẽ. 10 biome giữ nguyên nghĩa: `rung` · `bang` · `nui_lua` · `bien_dao` · `anh_dao` ·
> `sa_mac` · `dam_lay` · `thanh_co` · `troi_sao` · `dong_gio`.
> **Bài học Đáng yêu:** 9 nền dạng và 10 quái cuối về hỏng ở lượt đầu (xem `DON-HANG-NHO-XINH-BO-SUNG.md`). Đơn này đã đưa sơ đồ dải + 8 luật vào ngay từ đầu, và có nhắc nhìn lại hình đã duyệt trước nhóm quái cuối.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-halloween (bản đồ phiêu lưu + quái vật, style "Halloween")
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đi hù ma lấy kẹo". Mỗi chủ đề kiến thức là 1 vùng đất, mỗi dạng bài là
                1 màn đấu, mỗi nhóm bài là 1 con quái. Học sinh làm đúng câu hỏi = "hù" quái, quái thua thì nhả kẹo. Ở style này: bé ma NHỎ XÍU
                dũng cảm đi hù những sinh vật Halloween TO TRÒN NGỐ. Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — HALLOWEEN + hình đã duyệt đính kèm. Vùng đất vẽ như tranh truyện thiếu nhi ban đêm: mảng màu phẳng, viền
                tím đen, đồi tròn, cây tròn, rất ít chi tiết, có điểm sáng cam ấm (đèn lồng, cửa sổ, bí ngô). QUÁI = sinh vật thân tròn TO (gấp 3 bé ma), viền #1e1030 dày,
                mắt bầu dục đen bóng, má hồng gạch, vẻ mặt HẬM HỰC / DỖI kiểu trẻ con (lông mày chéo, miệng mếu) — buồn cười, KHÔNG đáng sợ,
                không nanh vuốt nhọn, không máu me. Loài TỰ THIẾT KẾ: KHÔNG giống quái / chimera của Chiikawa, Pokémon, Kirby, slime Dragon Quest.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN ══
- NỀN VÙNG (nen_vung_*): ngang 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ, KHÔNG đường đi vẽ sẵn. Nhìn từ trên cao chéo
  (như bản đồ game), cảnh trải đều cả khung, NHIỀU khoảng đất bằng trống để đặt 6–10 điểm màn đấu. Vật cao / sáng dồn ra MÉP, giữa trống, tối dịu.
- NỀN DẠNG (nen_dang_*): ngang 1672×941, nền đặc, nhìn NGANG như màn game đi ngang — SƠ ĐỒ DẢI BẮT BUỘC (theo tỉ lệ chiều cao ảnh, từ trên xuống):

      0% ┌──────────────────────────────────────────┐
         │  TRỜI ĐÊM + trăng / sao                  │
         │  cảnh của vùng Ở XA (đồi, nhà, cây…)     │   0 – 65%   cảnh, vật cao ở 2 góc
     65% ├──────────────────────────────────────────┤
         │  dải đệm: đất / cỏ xa, THẤP, phẳng       │   65 – 72%
     72% ╞══════════════════════════════════════════╡
         │  MẶT ĐƯỜNG ĐẤT: phẳng, ngang tuyệt đối,  │   72 – 76%   tâm 74%
         │  LIỀN từ mép TRÁI tới mép PHẢI, TRỐNG    │              (màu be-tím sáng hơn xung quanh 1 bậc)
     76% ╞══════════════════════════════════════════╡
         │  cỏ khô / cát / tuyết phẳng, vài bụi nhỏ │   76 – 100%
    100% └──────────────────────────────────────────┘

  8 LUẬT BỐ CỤC (sai 1 điều là không dùng được):
   1. Góc nhìn THẲNG TỪ BÊN HÔNG như game đi ngang — KHÔNG nhìn chéo từ trên, KHÔNG bản đồ.
   2. 1 CON ĐƯỜNG ĐẤT chạy THẲNG NGANG từ sát mép TRÁI tới sát mép PHẢI, LIỀN MẠCH, không uốn lượn, không đứt quãng.
   3. MẶT ĐƯỜNG PHẲNG, nằm ngang tuyệt đối, dải 72–76% tính từ trên xuống. Màu be-tím nhạt (#a98fb0) sáng hơn phần đất xung quanh để nhân vật kem nổi lên.
   4. TRÊN mặt đường TRỐNG suốt bề ngang: KHÔNG phiến đá, KHÔNG biển, KHÔNG cầu, KHÔNG hàng rào, KHÔNG cây / bí / đèn lồng / bia mộ ở tiền cảnh.
   5. Nước / dung nham / mây / vực / sương chỉ được nằm PHÍA SAU con đường (xa hơn). Dưới đường (76–100%) là 1 dải phẳng rải vài bụi nhỏ.
   6. Cảnh của vùng dồn lên NỬA TRÊN (0–65%), ở phía xa. Vật ở mép trái / phải (cây, nhà, bí) không vươn vào giữa che ngang tầm nhân vật. Điểm sáng cam chỉ ở xa + 2 góc.
   7. NÉT VẼ: viền tím đen dày, tô PHẲNG, rất ÍT chi tiết, nhiều khoảng trống — như nền vùng đã duyệt. KHÔNG tả kỹ từng viên đá, KHÔNG thác nước chi tiết.
   8. KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ (kể cả biển hiệu, bia mộ).
- ĐẢO (dao_*): 1024×1024, nền TRONG SUỐT, 1 gò đất tròn nổi nhìn chéo từ trên, đúng vùng đất tương ứng, đáy đất nâu tím tròn, có viền sticker kem mỏng.
- QUÁI: 1254×1254, nền TRONG SUỐT, toàn thân, giữa khung ~75–80%, quay 3/4 về người xem, GIỮ ĐÚNG DÁNG CƠ THỂ ghi trong ngoặc
  (giọt / thú 4 chân / rùa / chim / cá / sao / nấm / người đá / côn trùng). Mỗi con 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt, SÁNG hơn nền tối.
- BOSS: như QUÁI nhưng to, oai hơn (vương miện nhỏ lệch / áo choàng / vài tia hào quang dạng vạch), vẫn ngố.
- KHÔNG chữ, số, logo, khung, nền phía sau quái. 4 góc ảnh trống hoàn toàn. KHÔNG cỏ / bóng đổ dưới chân.

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 Ảnh toàn cảnh iPad ngang: bản đồ vùng RỪNG ĐÊM nhìn chéo từ trên, 8 điểm màn đấu nối bằng đường chấm chấm vàng đèn, 3 điểm đã cắm cờ, 1 điểm
       đang sáng có 1 con quái to tròn đứng trên, phần cuối bản đồ phủ sương khói tím; góc trái là bé MA PHÙ THỦY của H1.   → DỪNG, chờ duyệt.
B. Thế giới + 10 đảo
   #02 nen_the_gioi — trời tím đêm + biển mây khói tím nhìn từ trên cao, vài ngôi sao, trăng khuyết nhỏ, trống để đặt các đảo (ngang 1672×941, nền đặc)
   #03 dao_rung (rừng cây khô tròn lá cam, nấm sáng, đom đóm) · #04 dao_bang (đồi tuyết xanh lam, người tuyết KHÔNG mặt đội mũ phù thủy nhỏ, cực quang tím mảnh)
   · #05 dao_nui_lua (núi lửa lùn phun khói tròn cam, hồ dung nham) · #06 dao_bien_dao (bãi cát xám, cọ lùn, sóng lượn, thuyền buồm cũ treo đèn lồng)
   · #07 dao_anh_dao (cây hoa anh đào hồng tím phát sáng nhẹ như kẹo bông, đèn lồng giấy treo) · #08 dao_sa_mac (cồn cát tím xám, xương rồng tròn, 1 kim tự tháp nhỏ, trăng to)
   · #09 dao_dam_lay (ao lá súng tròn, liễu rủ, đom đóm, sương) · #10 dao_thanh_co (tường thành đá tròn mập, cổng vòm, lâu đài mái nhọn cửa sổ cam)
   · #11 dao_troi_sao (đồi tím nhạt, sao vàng mập cắm trên đất, hành tinh nhỏ) · #12 dao_dong_gio (đồng lúa vàng sẫm, bù nhìn, chong chóng giấy to, 1 con quạ đen tròn)
C. 10 nền vùng
   #13 nen_vung_rung · #14 nen_vung_bang · #15 nen_vung_nui_lua · #16 nen_vung_bien_dao · #17 nen_vung_anh_dao · #18 nen_vung_sa_mac
   · #19 nen_vung_dam_lay · #20 nen_vung_thanh_co · #21 nen_vung_troi_sao · #22 nen_vung_dong_gio   (cùng cảnh với đảo tương ứng, trải đều cả khung)
D. 8 con quái đầu tiên (dáng cơ thể trong ngoặc — PHẢI giữ; màu chủ đạo mỗi con KHÁC nhau)
   #23 quai_slime_la  (giọt) cục thạch XANH CHANH, 1 chiếc lá bí cuống xoắn mọc trên đầu
   #24 quai_slime_lua (giọt) cục thạch CAM kẹo ngô (ba tầng vàng-cam-trắng), 1 cây nến tí hon cháy trên đầu
   #25 quai_meo_bang  (thú)  mèo tròn XANH TÍM sáng #8b8de8, mắt vàng to, đuôi là 1 cây kẹo mút xoắn
   #26 quai_rua_da    (rùa)  rùa tròn XANH RÊU, mai là 1 quả bí ngô trắng khoét mặt
   #27 quai_cu_dem    (chim) cú tròn TÍM NHO sáng, mắt vàng to, lông mày rậm
   #28 quai_ca_bong   (cá)   cá nóc tròn XANH NGỌC, gai là các viên kẹo tròn nhỏ
   #29 quai_nam_ma    (nấm)  nấm lùn mũ ĐỎ GẠCH chấm kem, 2 chân ngắn
   #30 quai_chim_set  (chim) chim-dơi tròn VÀNG CHANH, 2 cánh dơi xoè ngắn hai bên thân, 2 chân ngắn đứng, mào hình tia chớp
E. 2 boss
   #31 boss_rong_con     (giọt) rồng con tròn XANH LỤC BẢO, bụng kem, cánh dơi nhỏ, vương miện bí ngô nhỏ đội lệch
   #32 boss_golem_pha_le (người đá) người đá cuội tròn xám nâu, vài mảnh pha lê HỒNG TÍM mọc trên vai, mắt sáng cam
F. Nền màn dạng bài (ĐÍNH KÈM public/bk-ui/hs/skin/khoi/phieuluu2d/nen_dang_rung.jpg làm mẫu BỐ CỤC con đường — chỉ lấy vị trí + dáng đường, KHÔNG lấy nét)
   #33 nen_dang_rung · #34 nen_dang_bang · #35 nen_dang_nui_lua · #36 nen_dang_bien_dao · #37 nen_dang_anh_dao · #38 nen_dang_sa_mac
   · #39 nen_dang_dam_lay · #40 nen_dang_thanh_co · #41 nen_dang_troi_sao · #42 nen_dang_dong_gio
   Phía sau con đường (xa) của từng vùng: rung = hàng cây khô + nấm sáng + trăng · bang = đồi tuyết xanh lam + 1 lều + tảng băng · nui_lua = núi lửa lùn khói tròn + hồ dung nham cam phía sau đường
   · bien_dao = biển xanh đen sóng lượn + 2 đảo cọ lùn xa, dưới đường là cát xám · anh_dao = dãy cây anh đào hồng tím tròn, cành chỉ ở 2 góc TRÊN · sa_mac = cồn cát tím xám + xương rồng + kim tự tháp xa + trăng to
   · dam_lay = ao lá súng phía sau đường + liễu rủ xa + lau sậy thấp ở 2 mép + sương · thanh_co = tường thành + cổng vòm + lâu đài mái nhọn xa, đường lát đá be-tím
   · troi_sao = đồi tím + sao vàng mập cắm xa + hành tinh tròn, đường đất tím nhạt · dong_gio = đồng lúa vàng sẫm + 2 chong chóng giấy to xa + bù nhìn xa, dưới đường là cỏ khô
G. Mốc + đồ vật nhỏ (512×512 trong suốt, nhìn chéo từ trên, giữa khung ~70%, viền sticker kem)
   #43 moc_thanh (lâu đài ma tròn mập mái nón) · #44 moc_thap (tháp canh gỗ lùn treo đèn lồng) · #45 moc_trai (lều tam giác + đống lửa trại nhỏ)
   · #46 moc_den (ngôi đền đá 4 cột tròn, thắp nến) · #47 moc_cau (cầu ván cong qua suối) · #48 moc_cong (cổng vòm gỗ có dây cờ tam giác trống)
   #49 be_da (phiến đá tròn dẹt viền cỏ khô — chỗ quái đứng) · #50 may_suong (1 đám mây khói tím tròn, ngang 1024×512)
   #51 co_chinh_phuc (lá cờ tam giác CAM cắm que gỗ) · #52 la_ban (la bàn tròn mập vỏ vàng)
H. Mở rộng — NHẮC: trước khi vẽ nhóm này, hãy NHÌN LẠI các quái đã duyệt ở nhóm D và boss ở nhóm E (nét viền dày, tô phẳng, thân to ~75–80% khung,
   nền TRONG SUỐT, KHÔNG bãi cỏ dưới chân). Nhóm cuối của bộ trước đã trôi nét (viền mảnh, màu loang, con vật nhỏ, dính nền) — đừng lặp lại.
   #53–#60 thêm 8 quái:
       quai_tho_gio (thú) thỏ tròn XÁM TRO tai CỤP ngắn, quấn vài vòng băng gạc trắng bay trong gió (KHÔNG vàng, KHÔNG tai dài dựng)
       · quai_be_nham (người đá) bia mộ vòm tròn mập xám nâu có 1 khe nứt cam phát sáng chạy chéo, 2 tay đá nhỏ (bia TRỐNG, không chữ)
       · quai_sao_bien (sao) sao mập HỒNG CAM kiểu kẹo, chấm trắng nhỏ ở đầu cánh
       · quai_ech_doc (giọt) ếch tròn TÍM NHẠT chấm vàng, bụng kem
       · quai_dom_dom (côn trùng) đom đóm tròn NÂU VÀNG, 2 râu tròn, cánh mỏng, đuôi phát sáng vàng
       · quai_soi_bang (thú) sói con tròn lông XANH BẠC xù, tai nhọn, đuôi xù, lông mày chéo
       · quai_bo_giap (rùa) bọ hung tròn mai giáp màu ĐỒNG, 1 sừng ngắn trên đầu
       · quai_ma_lua (giọt) BÓNG MA LỬA tròn màu XANH NGỌC NHẠT trong mờ (KHÁC hẳn ma kem của nhân vật), 1 ngọn lửa xanh nhỏ trên đầu, mặt hậm hực
   #61 boss_phuong_hoang (chim) chim tròn ĐỎ CAM TO, đuôi 3 lông dài cong như lửa, mào nhỏ, vài tia hào quang dạng vạch
   #62 boss_bach_tuoc (thú) bạch tuộc tròn TÍM TO, 8 xúc tu ngắn mập, vương miện nhỏ đội lệch

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## Đơn H5 — Bộ ĐÁNH (15 tư thế × 2 + 5 hiệu ứng) — gửi sau khi H1 nhóm C được duyệt

> Bài học Đáng yêu: đơn gốc quên bộ đánh ⇒ vào trận vẫn là nhân vật anime chung (`design/DON-HANG-NHO-XINH-DANH.md`). Style này đặt từ đầu.
> 15 tư thế là ĐÚNG bộ code đang dùng (`src/screens/hocsinh/skin/heroDau.ts`) — thiếu 1 tư thế là có đòn không diễn được, nên không bớt. Tên file giữ đúng tên tư thế trong code.
> **Cách gửi:** context ChatGPT đã vẽ bé ma (H1 / H2) còn mở ⇒ dùng lại; mất thì mở MỚI: kit → PHONG CÁCH CHUNG → khối dưới. Đính kèm 1 lần ở đầu:
> `hw_nv_nam` + `hw_nv_nu` (mẫu NÉT + màu + phụ kiện — quan trọng nhất) · `hoat-hoa/hw_nam_vui` + `hoat-hoa/hw_nu_lo` (mẫu "cùng bé ma, đổi tư thế") ·
> `hoc-tap/nen_san_dau` (sân đấu đã duyệt, cho #00) · 1 con quái đã duyệt, vd `phieu-luu/quai_rua_da` (cho #00 và mẫu nét nhóm C) ·
> `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png` — bảng 15 tư thế của nhân vật anime: CHỈ lấy DÁNG, KHÔNG lấy nét / tỉ lệ người.
> **Sang nhóm B (nữ):** đính kèm lại `hw_nv_nu` + hình **A01 vừa nhận** (để cùng cỡ, cùng chỗ đứng với nam).
> **Tự kiểm nhanh:** ① nền trong suốt ② quay sang PHẢI ③ cỡ thân bằng A01 / B01 ④ KHÔNG có sao, lửa, tia sáng, vật bay trong hình tư thế. Sai ⇒ gõ ngay "làm lại: <lỗi>".

```
ĐƠN H5 — TƯ THẾ ĐÁNH CỦA BÉ MA (style "Halloween") — vẫn luật cũ: MỖI LƯỢT ĐÚNG 1 HÌNH, dòng đầu ghi mã + tên file, vẽ xong DỪNG chờ tôi gõ "tiếp".

BỐI CẢNH: trong app có màn ĐẤU kiểu game đi cảnh nhìn ngang. BÉ MA của học sinh đứng bên TRÁI sân, quay mặt sang PHẢI; con QUÁI đứng bên phải.
Học sinh trả lời đúng thì bé ma "hù" ra đòn. Tôi tự ghép các tư thế thành chuyển động và tự vẽ vật bay / tia sáng bằng code.
⇒ Tôi cần CÙNG 2 bé ma đã duyệt (ma phù thủy hw_nv_nam, ma bí ngô hw_nv_nu — đính kèm), vẽ ở 15 tư thế đánh.

VŨ KHÍ = ĐỒ BÉ MA ĐANG CẦM:
- MA PHÙ THỦY dùng GIỎ BÍ NGÔ đầy kẹo: phép phát ra từ MIỆNG GIỎ (hất giỏ, đẩy giỏ, giơ giỏ). Mũ phù thủy + ngôi sao ở chóp mũ luôn trên đầu.
- MA BÍ NGÔ dùng ĐÈN LỒNG NẾN: phép phát ra từ ngọn nến (giơ đèn, vung đèn). Mũ bí ngô luôn trên đầu. Ngọn nến trong đèn là ngọn lửa BÉ XÍU cố định cùng cỡ mọi hình
  (là phần của đèn, được vẽ; nhưng KHÔNG vẽ lửa lớn bay ra).
Giỏ / đèn có mặt trong MỌI tư thế (kể cả lúc ngã thì rơi ngay cạnh), không lúc có lúc mất.

LUẬT CHUNG CHO 30 HÌNH TƯ THẾ (sai 1 điều là không dùng được):
1. Khung VUÔNG 1254×1254, NỀN TRONG SUỐT THẬT (kênh alpha). KHÔNG nền tím / kem / trắng, KHÔNG cỏ, lá, mặt đất, KHÔNG bóng đổ dưới chân.
2. CHỈ có bé ma + đồ nó cầm. TUYỆT ĐỐI KHÔNG vẽ: sao, lửa lớn, tia sét, quầng sáng, vệt gió, vật bay, đạn, dấu nổ, chữ, số.
   (Riêng các nét nằm SÁT trên người thì được: 2–3 vạch "rung rung", 1 giọt mồ hôi, 1 giọt nước mắt.)
3. Bé ma quay 3/4 sang PHẢI (thấy cả 2 mắt, mặt hướng phải). Mọi đòn đánh hướng sang PHẢI.
4. CÙNG MỘT CỠ THÂN trong mọi hình: ở tư thế đứng (A01 / B01) thân cao ~50% chiều cao khung (chưa kể mũ cao), đứng giữa khung theo chiều ngang, tà váy chạm
   một vạch ngang tưởng tượng ở 88% chiều cao khung. Các tư thế khác GIỮ NGUYÊN cỡ thân đó và vạch đất đó — KHÔNG phóng to cho đầy khung,
   KHÔNG thu nhỏ. Khoảng trống quanh người là cố ý: để chỗ cho tay giơ, lao tới, cú bay.
5. Không bộ phận nào chạm mép khung (mũ, giỏ / đèn giơ cao, tay duỗi đều nằm trọn trong khung, cách mép ≥ 4%).
6. Giữ ĐÚNG bé ma đã duyệt: thân tròn bầu màu kem, tà lượn sóng, KHÔNG chân, tay tí hon, nét viền #1e1030 dày, tô phẳng, má hồng gạch, mắt bầu dục đen bóng
   (hoặc vạch cong khi nhắm / cười), cùng màu, cùng mũ. Chỉ đổi dáng + biểu cảm.
7. Bé ma tròn, tay ngắn, KHÔNG chân ⇒ diễn tả bằng CẢ THÂN: nghiêng người, co người, giãn người, chồm tới, bay lên. "Bước / nhảy" = thân và tà váy NHẤC LÊN khỏi vạch
   đất. Dễ thương, hơi vụng, KHÔNG ngầu, KHÔNG dữ.

#00 hw_dau_toan_canh — ẢNH TOÀN CẢNH để duyệt (ngang 1672×941, nền đặc, đây là ảnh DUY NHẤT có nền và có vật bay):
     nền = sân đấu đính kèm; bên TRÁI là ma phù thủy ở tư thế "lao tới đẩy giỏ" (A09), từ miệng giỏ bay ra 1 VIÊN KẸO NGÔ vàng-cam-trắng mập có đuôi lấp lánh
     ngắn đang bay ngang sang phải; bên PHẢI là con rùa bí ngô trắng đính kèm đang giật mình. Nửa dưới ảnh để trống (chỗ đặt khung câu hỏi).
     KHÔNG chữ. → Vẽ xong DỪNG, chờ tôi duyệt.

A. MA PHÙ THỦY (15 hình — tên file hw_dau_nam_<tư thế>):
   A01 dung_1       — đứng thủ thế: thân hơi nghiêng tới, 2 tay ôm giỏ bí ngô chếch trước ngực, miệng giỏ hướng lên phải; mặt tập trung, hơi thở ra (thân hơi xẹp)
   A02 dung_2       — y hệt A01, chỉ khác hít vào: thân phồng cao hơn một chút, giỏ nhích lên một chút. Khác rất NHẸ
   A03 suy_nghi     — 1 tay chống cằm, mắt nhìn lên chếch phải, đầu nghiêng (mũ nghiêng theo), tay kia kẹp giỏ bí ngô bên hông. KHÔNG dấu hỏi
   A04 tich_nang_1  — gom sức: 2 tay ôm giỏ dựng sát ngực, người co thấp xuống, 2 mắt nhắm chặt, má phồng, 2 vạch rung 2 bên
   A05 tich_nang_2  — gom sức mạnh hơn: người chồm tới trước, 2 tay đưa giỏ NGANG sang phải ngang tầm ngực, miệng giỏ hướng phải, mắt mở to quyết tâm.
                      Phía trước miệng giỏ là KHOẢNG TRỐNG (tôi sẽ đặt quả cầu sáng ở đó) — KHÔNG vẽ gì bay ra, kẹo trong giỏ nằm yên
   A06 niem_troi_1  — chuẩn bị gọi phép trời: 1 tay nâng giỏ lên cao quá đầu, người hơi ngả ra sau, mặt ngước lên chếch phải, tay kia áp ngực
   A07 niem_troi_2  — gọi phép trời: CẢ 2 tay nâng giỏ THẲNG LÊN trời, miệng giỏ ngửa lên, thân kiễng lên nhấc khỏi vạch đất, mặt ngước lên, miệng há hô to
   A08 nem_truoc_1  — lấy đà: xoay người, 2 tay kéo giỏ ra SAU về phía TRÁI (như quăng), dồn người về sau, mặt vẫn nhìn sang PHẢI, mím miệng
   A09 nem_truoc_2  — ra đòn mạnh: lao người tới, thân + tà váy nhấc nghiêng về trước, 1 tay đẩy giỏ DUỖI THẲNG NGANG sang PHẢI (miệng giỏ chĩa phải),
                      tay kia văng ra sau giữ thăng bằng, mặt hăng. KHÔNG vẽ gì bay ra
   A10 phat_nho     — đòn nhẹ: đứng thẳng thong thả, 1 tay vẩy giỏ chếch sang phải như hất nhẹ, tay kia chống hông, mặt tự tin nhếch mép
   A11 bi_danh_1    — trúng đòn: người giật ngả ra sau về bên TRÁI, 2 mắt nhắm tịt thành dấu ">  <", 2 tay giơ che mặt, giỏ vẫn kẹp, 1 giọt nước mắt
   A12 bi_danh_2    — văng mạnh: cả người ngả hẳn ra sau gần ngã, tà váy nhấc khỏi đất, 2 tay chới với, giỏ tuột khỏi tay lơ lửng ngay cạnh (vài viên kẹo văng ra
                      NẰM SÁT giỏ), mặt mếu, mũ bay lệch
   A13 guc          — chịu thua: bẹp xuống đất, tà váy xoè bẹt, đầu gục, 2 mắt thành 2 vòng xoắn chóng mặt, giỏ rơi nằm nghiêng ngay trước mặt, mũ lệch.
                      GIỮ NGUYÊN cỡ thân (hình này bé ma chỉ chiếm nửa dưới khung — đúng như vậy), KHÔNG vẽ sao quay trên đầu
   A14 thang_1      — bay mừng: cả người BAY LÊN khỏi vạch đất, 1 tay giơ giỏ lên trời, tay kia giơ nắm, mắt cười cong, miệng cười to
   A15 thang_2      — hạ xuống mừng: tà váy chạm đất, người nghiêng, 1 tay ôm giỏ vào ngực, tay kia giơ lên vẫy, nháy 1 mắt, cười

B. MA BÍ NGÔ (15 hình — tên file hw_dau_nu_<tư thế>; đúng 15 tư thế như ma phù thủy, đổi GIỎ thành ĐÈN LỒNG NẾN):
   B01 dung_1       — đứng thủ thế: thân hơi nghiêng tới, 2 tay ôm đèn lồng chếch trước ngực; mặt tập trung, hơi thở ra (thân hơi xẹp)
   B02 dung_2       — y hệt B01, chỉ khác hít vào: thân phồng cao hơn một chút, đèn nhích lên một chút. Khác rất NHẸ
   B03 suy_nghi     — 1 tay chống cằm, mắt nhìn lên chếch phải, đầu nghiêng, tay kia xách đèn lồng thõng bên hông. KHÔNG dấu hỏi
   B04 tich_nang_1  — gom sức: 2 tay ôm chặt đèn lồng vào ngực, người co thấp xuống, 2 mắt nhắm chặt, má phồng, 2 vạch rung 2 bên
   B05 tich_nang_2  — gom sức mạnh hơn: người chồm tới trước, 2 tay đưa đèn lồng NGANG sang phải ngang tầm ngực (cửa đèn hướng phải), mắt mở to quyết tâm.
                      Phía trước đèn là KHOẢNG TRỐNG (tôi sẽ đặt quả cầu sáng ở đó) — KHÔNG vẽ gì bay ra, ngọn nến vẫn bé xíu trong đèn
   B06 niem_troi_1  — chuẩn bị gọi phép trời: 1 tay nâng đèn lồng lên cao quá đầu, người hơi ngả ra sau, mặt ngước lên chếch phải, tay kia áp ngực
   B07 niem_troi_2  — gọi phép trời: CẢ 2 tay nâng đèn lồng THẲNG LÊN trời, thân kiễng lên nhấc khỏi vạch đất, mặt ngước lên, miệng há hô to
   B08 nem_truoc_1  — lấy đà: xoay người, 2 tay kéo đèn lồng ra SAU về phía TRÁI, dồn người về sau, mặt vẫn nhìn sang PHẢI, mím miệng
   B09 nem_truoc_2  — ra đòn mạnh: lao người tới, 1 tay đẩy đèn lồng DUỖI THẲNG NGANG sang PHẢI (cửa đèn chĩa phải), tay kia văng ra sau, thân + tà váy nhấc nghiêng,
                      mũ bí ngô và cuống tạt về sau, mặt hăng. KHÔNG vẽ gì bay ra
   B10 phat_nho     — đòn nhẹ: đứng thẳng thong thả, 1 tay giơ đèn lồng chếch phải, tay kia búng nhẹ sang phải, mặt tự tin nhếch mép
   B11 bi_danh_1    — trúng đòn: người giật ngả ra sau về bên TRÁI, 2 mắt nhắm tịt thành dấu ">  <", giơ đèn lồng lên che mặt, 1 giọt nước mắt
   B12 bi_danh_2    — văng mạnh: cả người ngả hẳn ra sau gần ngã, tà váy nhấc khỏi đất, 2 tay chới với, đèn lồng tuột khỏi tay lơ lửng ngay cạnh (ngọn nến co nhỏ),
                      mặt mếu, mũ lệch
   B13 guc          — chịu thua: bẹp xuống đất, tà váy xoè bẹt, đầu gục, 2 mắt thành 2 vòng xoắn chóng mặt, đèn lồng rơi nằm nghiêng ngay trước mặt (ngọn nến mờ).
                      GIỮ NGUYÊN cỡ thân (bé ma chỉ chiếm nửa dưới khung — đúng như vậy), KHÔNG vẽ sao quay trên đầu
   B14 thang_1      — bay mừng: cả người BAY LÊN khỏi vạch đất, 1 tay giơ đèn lồng lên trời, tay kia giơ nắm, mắt cười cong, miệng cười to
   B15 thang_2      — hạ xuống mừng: tà váy chạm đất, người nghiêng, 1 tay ôm đèn lồng vào ngực, tay kia giơ lên vẫy, nháy 1 mắt, cười

C. VẬT BAY / HIỆU ỨNG ĐÒN ĐÁNH (5 hình — nền TRONG SUỐT, cùng nét viền #1e1030 dày + tô phẳng như con quái đính kèm; vật KHÔNG có mắt miệng,
   KHÔNG chữ; đúng khổ + đúng HƯỚNG ghi dưới vì tôi đặt hình theo vị trí "đầu" của vật):
   C01 hw_fx_cau_lua     — ngang 1774×887. 1 VIÊN KẸO NGÔ mập (3 lớp vàng-cam-trắng, góc bo tròn) đang bay sang PHẢI: kẹo nằm ở bên phải ảnh (tâm kẹo ở 82% bề ngang,
                           giữa chiều cao), phía sau kéo 1 đuôi sang TRÁI gồm vài ngôi sao nhỏ vàng + chấm tròn cam nhạt dần
   C02 hw_fx_cau_bang    — ngang 1774×887. 1 QUẢ CẦU MA trong veo XANH NGỌC (như viên bi, 1 mảng sáng trắng) bay sang PHẢI: quả cầu ở 82% bề ngang,
                           giữa chiều cao, đuôi sang TRÁI là vài bông tuyết 6 cánh nhỏ + chấm trắng xanh nhạt dần
   C03 hw_fx_thien_thach — vuông 1254×1254. 1 QUẢ BÍ NGÔ KHỔNG LỒ (không khoét mặt) rơi chéo từ trên-trái xuống dưới-phải: bí to nằm ở góc dưới-phải
                           (tâm ở 78% ngang, 78% dọc), đuôi kéo lên góc trên-trái gồm 3 dải cong vàng đèn + vài cụm khói tím
   C04 hw_fx_dan_ma      — ngang 1774×887. Đòn của QUÁI: 1 CỤC KHÓI TÍM HOA CÀ (xù, mép lượn sóng, bên trong vài vạch xoắn tím đậm) bay sang PHẢI:
                           cục khói ở 82% bề ngang, giữa chiều cao, đuôi sang TRÁI là vài cục khói tím nhỏ dần
   C05 hw_fx_bang_boc    — dọc 1122×1402. 1 BONG BÓNG to trong veo xanh nhạt để NHỐT con quái: vòng tròn lớn gần kín khung, viền #1e1030 dày, ruột RỖNG TRONG SUỐT
                           (nhìn xuyên qua được — chỉ tô 1 lớp xanh rất nhạt), 2 vệt sáng trắng cong ở góc trên-trái, vài bong bóng con quanh mép. KHÔNG có con vật bên trong

Bắt đầu với #00.
```

Khi hình về (Claude làm): nhận diện bằng mắt → chuyển vào `halloween/danh/` tên `hw_dau_<nam|nu>_<tư thế>.png` → đo 4 góc trong suốt · hướng mặt · hộp bao thân · vạch đất (2 tư thế bay / văng dùng vạch đất của hình đứng) · cỡ thân so với hình đứng (lệch quá ~12% ⇒ vẽ lại) · có lọt vật bay không ·
đo **điểm phát đòn** (miệng giỏ / cửa đèn) ở 4 tư thế `tich_nang_2` · `nem_truoc_2` · `phat_nho` · `niem_troi_2`. Kế hoạch dựng `Skin.dau` giống `DON-HANG-NHO-XINH-DANH.md` mục cuối (chưa dựng tới 24/10 — style nào có hình trước thì dựng lần đầu).

---

## 5. Lời chữ `LOI_HALLOWEEN` (Claude viết vào `skin/loi.ts` khi dựng — Thùy sửa câu nào thì sửa ở đây trước)

= `LOI_GAME` + đè các khoá dưới (logic / số liệu y hệt). `layLoi` gộp nông ⇒ đè `yeu` thì phải khai đủ cả nhóm `yeu`.

| Khoá | Game (RPG/Khối) | **Halloween** |
|---|---|---|
| `chieu` | Chiêu xịt — quái đánh trả, hồi 1 máu · Chiêu nhẹ · Chiêu mạnh · TUYỆT KỸ! | **Hụt mất rồi — quái hù lại, hồi 1 máu · Hù nhẹ · Hù mạnh · SIÊU HÙ!** |
| `nhanCombo` | Chiêu | **Hù** |
| `moMan` | X xuất hiện! | **X chui ra kìa!** |
| `huongDan` | Mỗi 3 câu tung 1 chiêu — đúng cả 3 là TUYỆT KỸ | **Mỗi 3 câu hù 1 phát — đúng cả 3 là SIÊU HÙ** |
| `daXong` · `hetDoiHinh` | Đã bị hạ · Hạ hết đội hình! | **Đã nhả kẹo · Cả đám nhả kẹo hết rồi!** |
| `yeu.tieuDe` · `hoi` · `nut` | Rèn lại điểm yếu · …đối đầu quái vật điểm yếu chưa? · Vào trận! | **Rèn lại điểm yếu · Hơi rợn một chút… nhưng mình làm được, sẵn sàng chưa? · Đi hù ma!** |
| còn lại (`chieuChiTiet`, `doiHinh`, `nhanBoss`, `nhanThuong`, `con`, `yeu.dong*`, `ketQua`) | — | giữ nguyên `LOI_GAME` |

---

## 6. Hoạt họa — cách dựng (Claude làm, không đặt ChatGPT)

Giống Đáng yêu (mục 6 của `DON-HANG-STYLE-NHO-XINH.md`): tắt hết khi máy bật `prefers-reduced-motion`, dừng đồng hồ khi tab ẩn, màn làm bài KHÔNG hoạt họa. Khác ở chỗ bé ma **lơ lửng**:
- Thay nhịp "thở" bằng **bồng bềnh**: dịch lên xuống 6px / 2,4 giây + co giãn nhẹ tà váy; đế (bóng + lá) đứng yên, bóng co nhỏ khi ma bay lên.
- Đổi tư thế: dẹt 8% → giãn 6% → về, 220 ms (che bước nhảy giữa 2 hình). Đường viền "sôi" (bộ lọc SVG, 6 hình/giây, ≤1,5px) áp cho bé ma.
- Kịch bản Home: mở màn ⇒ `vay_1 ↔ vay_2` × 3 rồi về đứng · chớp mắt 120 ms mỗi 3–6 giây · ngẫu nhiên 20–40 giây: `an_1 → an_2 → an_1` (nam ăn kẹo / nữ thổi nến) ·
  để yên > 60 giây ⇒ `ngu` (chạm vào ⇒ giật mình `lo` rồi về đứng) · chạm vào bé ma ⇒ `vui` 1 nhịp.
- Hiệu ứng nền (code): ngọn đèn lồng / nến chớp nhẹ · 1–2 con dơi bay ngang mỗi 30–50 giây · đom đóm (nền `vuon_bi`).

Dùng `homeSong.linhVat` (đã có, `LinhVatSong` ở `kieu.ts`) — không đẻ hợp đồng mới.

---

## 7. Token + kế hoạch dựng code (Claude làm khi hình về)

**Token đề xuất** (`skin/styles/halloween.ts` — chỉnh lại theo #01 được duyệt; số đo tương phản tính tay, script sẽ đo lại):

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `id` · `ten` · `moTa` · `giongGi` | `halloween` · Halloween · Đêm ma đáng yêu · Halloween · Chiikawa (chỉ nét vẽ) | "giống:" chỉ để so sánh, như các style trước |
| `font` · `fontHead` | `'Be Vietnam Pro'` · `'Baloo 2'` (800) | cả hai đã có ở `hs.html` — kiểm `index.html` (vỏ ERP) có đủ chưa |
| `headCase` · `headTrack` | `none` · `0.01em` | |
| `radius` · `radiusPill` · `cardClip` · `blur` | `22px` · `999px` · `none` · `none` | |
| `cheDo` | `['toi']` | chỉ tối; `theTiep` / `nenTen` giữ kiểu 1 chế độ |
| `toi.bg` · `nenTrong` | `#251836` · `#2a1a3f` | trời đêm (nền dự phòng) · tím đêm cho màn trong |
| `toi.surface` · `surface2` | `rgba(59,37,87,0.96)` · `rgba(255,192,99,0.14)` | tím đêm đặc · ánh cam mờ |
| `toi.ink` · `muted` · `line` | `#fff3e0` · `#c9b3e0` · `rgba(184,157,203,0.35)` | chữ kem trên thẻ ≈ **12:1** (≥ 7 ✔) · chữ phụ ≈ 6,9:1 (≥ 4,5 ✔) |
| `toi.acc` · `accInk` | ~~`#B8480F` · `#ffffff`~~ ⇒ **`#ff9a4d` · `#2a1740`** (sửa lúc dựng 25/10) | acc còn là màu CHỮ nhấn trên thẻ: cam cháy chỉ 2,5:1 ⇒ cam đèn 6,3:1 trên thẻ, chữ tím đậm trên nút 7,7:1 |
| `toi.badge` · `badgeInk` | `#c2255c` · `#ffffff` | đo lại khi dựng |
| `toi.cardBorder` · `cardShadow` | `2.5px solid #8a62b0` · `0 4px 0 #150c22` | viền tím sáng (viền đen mất trên nền tối) + bóng cứng |
| `theTiep` | nền `#ffc063`, chữ `#2a1740`, viền `2.5px solid #1e1030` | ô cửa sổ sáng đèn |
| `nenTen` | `rgba(37,24,54,0.88)` | |
| `hinhNen` | `pho_dem` (mặc định) · `nghia_dia` · `vuon_bi` — mỗi cái `toi` + `toiDoc` | phủ gradient tím rất nhẹ ở 1/4 trên cho tiêu đề chữ kem |
| `loi` · `dauThayIcon` | `LOI_HALLOWEEN` (mục 5) · `🎃` hoặc `✦` | chọn ký tự không cần font emoji nếu app chạy máy cũ |

**Thứ tự dựng** (CHỈ khi Thùy bảo):
1. `skin/kieu.ts`: `SkinId` thêm `'halloween'` · `skin/styles/halloween.ts` · `registry.ts` thêm vào `SKINS` · font vào **cả `hs.html` lẫn `index.html`**.
2. **Migration nới CHECK** `hs_giao_dien.skin` thêm `'halloween'` — ĐỌC danh sách đang có từ DB bằng role `claude_ro` (đã biết tới 13/10: `toi_gian · dau_truong · y2k · soft · rpg · khoi · lofi · dang_yeu`; có thể đã thêm sau) và GIỮ hết;
   khuôn `202610131141_hs_giao_dien_skin_dang_yeu.sql`, tạo bằng `npm run new-migration hs_giao_dien_skin_halloween`. Thùy tự áp → `npm run schema` → commit `schema.md`.
3. `scripts/halloween-hinh.mjs` (copy khuôn `scripts/dang-yeu-hinh.mjs`): nén vào `public/bk-ui/hs/skin/halloween/`, ưu tiên bản `_v2`, sinh `styles/halloweenHocTap.ts` · `styles/halloweenSong.ts`. Đế là lớp RIÊNG trong đơn ⇒ khỏi tách cỏ bằng vùng điểm ảnh liền.
4. H2 `homeSong.linhVat` · H3 `hocTap` + `chinhPhuc` + `sanDau` · H4 `banDo2d` + `quai2d` (`halloweenBanDo2d.ts`) + bảng màu 3D `skin/the3d/bangMauHalloween.ts` + `game`.
5. H5 `Skin.dau` (hợp đồng theo kế hoạch cuối `DON-HANG-NHO-XINH-DANH.md`).
6. Kiểm: `npm run check:style-hs` ✔ · `npx tsc --noEmit` · `npm run build:hs` · soi bằng trình duyệt `hs.html?xem=gami&skin=halloween&man=home` (ngang 1180×820 + dọc 430×900, 3 nền, `&tt=2` = nữ) ·
   `?xem=hoc_tap&skin=halloween` · `?xem=phieu_luu&skin=halloween` (+ `&tang=luc_dia&luc=C` · `&tang=chang&luc=C&vung=C1` · `&tang=dau&luc=C&vung=C1`).
   **Màn thế giới soi với tên chủ đề DÀI THẬT (khối 9)** — xếp cột đảo so le cao / thấp như Đáng yêu (cột 1·3·5 cao, 2·4 thấp 10%, cột ngoài lùi vào 14%), đừng 5 đảo cùng tầm cao.

---

## Bảng đổi tên: file ChatGPT giao → file code (Claude làm, Thùy không cần làm)

| ChatGPT giao | Code dùng (`public/bk-ui/hs/skin/halloween/`) | Nén |
|---|---|---|
| H1 #01–#04 ảnh toàn cảnh | `design/handoff/hs-skin-halloween-v1/reference/*.jpg` (ảnh chuẩn, không vào app) | JPG q85 |
| `hw_bg_<nền>_ngang` · `hw_bg_<nền>_doc` | `bg_<nền>_ngang.jpg` · `bg_<nền>_doc.jpg` (`pho_dem` · `nghia_dia` · `vuon_bi`) | JPG ~q80, ≤ 1672px |
| `hw_nv_nam` · `hw_nv_nu` | `nv_nam.png` · `nv_nu.png` | PNG 640×800 |
| `hw_o_<ô>` | `o_<ô>.png` — `o_tren_lop` · `o_et` · `o_btvn` · `o_tu_luyen` · `o_nhiem_vu` · `o_rank` · `o_thong_tin` · `o_so_tay` · `o_thi_thu` · `o_bai_tap_giao` · `o_cup` · `o_xep_hang` · `o_may_man` · `o_vi_xu` · `o_hoc_tu_dau` · `o_the_gioi` · `o_thu_vien` · `o_tro_choi` | PNG 160px |
| `hw_b_lich` · `hw_b_kiem_tra_lai` | `b_lich.png` · `b_kiem_tra_lai.png` | PNG 160px |
| `hw_tt_goc` · `hw_tt_gach` | `corner.png` · `divider.png` | PNG 192px · 768×96 |
| H2 `hw_<nam\|nu>_<tư thế>` | `song/<nam\|nu>/<tư thế>.webp` | WebP 640×800 |
| H2 `hw_de_<nam\|nu>` | `song/de_<nam\|nu>.webp` | WebP 640×800 |
| H2 `hw_fx_*` | `song/fx_<tên>.webp` | WebP 128–256px |
| H3 #02–#06 `hw_o_*` | `o_hoc_chu_de.png` · `o_luyen_yeu.png` · `o_dau_truong.png` · `o_chinh_phuc.png` · `o_giai_vo_dich.png` | PNG 160px |
| H3 #07–#13 | `hoctap/nen_ngang.jpg` · `hoctap/nen_doc.jpg` · `hoctap/dao_<ô>.webp` | JPG q82 · WebP 768² |
| H3 #15–#27 | `chinhphuc/nen.jpg` · `thap_tong.webp` · `thap_cd_<i>.webp` · `de_tong.webp` · `de_cd.webp` · `cau_sang.webp` | như Khối |
| H3 #28 | `dau_truong/nen_san_dau.jpg` | JPG 1600×574 |
| H4 `nen_the_gioi` · `dao_*` · `nen_vung_*` · `nen_dang_*` · `moc_*` · `be_da` · `may_suong` · `co_chinh_phuc` · `la_ban` | `phieuluu2d/` cùng tên như `khoi/phieuluu2d/` | nền JPG q82 1672×941 · mốc WebP 256² |
| H4 `quai_*` · `boss_*` | `quai/<loài>.webp` (như `khoi/quai/`) | WebP 512² |
| H5 `hw_dau_<nam\|nu>_<tư thế>` · `hw_fx_*` | `dau/<nam\|nu>/<tư thế>.webp` · `dau/fx_*.webp` | WebP 512² · fx theo khổ |

Ô → icon (khai `anhO` trong `skin/styles/halloween.ts`): `giao_trinh → o_tren_lop` · `thanh_tuu → o_cup` · `xep_hang → o_xep_hang` ·
`tu_luyen_rieng → o_tu_luyen` · `de_thi_thu → o_thi_thu` · còn lại cùng tên ô.

---

## ✅ HOẠT CẢNH ERP 30/10 (Thùy: "làm giao diện Halloween cho ERP — bí ngô phát sáng rồi tắt rồi sáng, vài con dơi bay, con ma di chuyển, không bị khựng") — nhánh `claude/erp-halloween`

- Style Halloween đã có sẵn trong bảng Giao diện ERP (vỏ ERP lấy mọi style của app HS — `lib/erpSkin.ts`). Việc mới = **hoạt cảnh** trên tranh nền Trang chính:
  `skin/HoatCanhNen.tsx` + cấu hình `hoatCanh` trong `styles/halloween.ts` (hợp đồng `HoatCanh` ở `skin/kieu.ts`, dùng lại được cho app HS / style khác).
  - **Điểm sáng** đo trên 3 tranh ngang (lưới %): phố đêm 3 bí ngô (sáng → TẮT → sáng, lệch pha) + đèn hiên, đèn đường, 5 bóng đèn dây (chập chờn) ·
    nghĩa địa 3 cụm nến (lay) + trăng (thở chậm) · vườn bí 2 bí ngô + 5 đom đóm (loé rồi tắt).
  - **Tiền cảnh bí ngô:** bí ngô trong tranh ở màn rộng bị XÉN (tranh phủ theo bề ngang, đáy rơi ra ngoài khung — đo 1904×929: bí ngô ở y 964–1077),
    màn hẹp bị bé ma che ⇒ cắt cụm 3 bí (phố đêm) + quả bí khoét mặt (vườn bí) thành ảnh mép mờ dần (`tien_canh/bi_trai.webp` · `bi_phai.webp`,
    `scripts/halloween-hinh.mjs` phần 6), đặt 2 góc dưới, có quầng sáng tắt/bật. Cụm trái đứng TRƯỚC bé ma khi có cột nhân vật (như ảnh mẫu), không có cột ⇒ lùi ra sau thẻ.
  - **6 con dơi** bay ngang trời (đường thẳng đều + nhấp nhô sin + vỗ cánh co giãn 0,2 giây), nửa số bay ngược chiều · **2 bé ma nhỏ** trôi rất chậm ở xa ·
    **bé ma chính bồng bềnh** (thân trôi, đế lá đứng yên — dùng 2 lớp `homeSong.linhVat`).
- **Vì sao không khựng** (ghi luật chung ở `design/STYLE-HS.md` §2.7): chỉ `transform` + `opacity` (kiểm bằng `document.getAnimations()`: 44 chuyển động, đúng 2 thuộc tính
  này), không đổi hình theo nấc, `will-change`, keyframe không `var()`, thông số tất định + memo, gốc `contain: strict`. Máy bật giảm chuyển động ⇒ đứng yên.
- Trang chính ERP: tranh nền giờ nằm trên `section` NGOÀI (không cuộn), nội dung cuộn trong khối bên trong ⇒ hoạt cảnh đứng yên khớp tranh. Style khác (đã soi Đáng yêu) cuộn y như cũ.
- **Đã soi (trang `/xem-thu-erp.html` lấy lại TẠM từ lịch sử, không commit):** 1600×860 cả 3 nền · điện thoại 375×812. **Chưa đo được khung hình/giây thật** — khung trình duyệt
  của Claude chạy ngầm nên bị hạ nhịp; cần mở trên máy thật để cảm nhận.
