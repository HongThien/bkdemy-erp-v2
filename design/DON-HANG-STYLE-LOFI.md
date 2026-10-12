# Đơn đặt hàng ChatGPT — Style "Lo-fi chill" cho app HS

> **Soạn 09/10/2026** theo yêu cầu Thùy: *"tạo thêm 1 giao diện mới: lofi chill … thiên hướng là sẽ cho những học sinh thích kiểu học 1 mình,
> chill chill dễ chịu"* + ảnh không khí đính kèm (cô gái đeo tai nghe ngồi viết bên cửa sổ, mèo mướp nằm bậu cửa, phố mái ngói nắng chiều).
> - **Thay Đơn 3 v3 "Lo-fi đêm"** trong `DON-HANG-SKIN-HS.md` (soạn 28/09, CHƯA gửi) và kit `handoff/hs-skin-lofi-v1` (bị trả 28/09 — tranh
>   nền ghép khối bằng code). Đừng gửi bản cũ.
> - **Khuôn = y như Khối vuông** (`DON-HANG-STYLE-KHOI.md`, đã chạy trọn K1–K3): ảnh toàn cảnh duyệt trước → DỪNG chờ Thùy → từng hình riêng,
>   mỗi lượt đúng 1 hình.
> - Luật 1 style gồm gì / thêm style thế nào: `design/STYLE-HS.md` · hợp đồng code: `src/screens/hocsinh/skin/kieu.ts`.
> - Ảnh không khí (đã lưu): `design/handoff/hs-skin-lofi-v2/reference/khong_khi_lofi.webp`.
>
> | Đơn | Nội dung | Số lượt vẽ | Khi nào gửi |
> |---|---|---|---|
> | **L1** | Màn chính + bộ hình style: 3 nền × 2 giờ (chiều/đêm) × 2 khổ · 2 góc học (người ngồi + bàn + mèo) · 18 icon ô · 2 banner · 2 trang trí | 4 ảnh toàn cảnh + 36 hình | Gửi được ngay |
> | **L2** | **Hoạt họa màn chính** — tách lớp nền (trời trôi sau cửa sổ) · khung viết / nghỉ của 2 nhân vật · khung đuôi mèo · 3 vật hiệu ứng | 27 hình | Sau khi L1 nhóm C (2 góc học) được duyệt |
> | **L3** | Khu HỌC TẬP: 5 icon · cổng 5 "góc nhỏ" lơ lửng · Chinh phục BK (9 tháp) · sân Đấu trường | 2 ảnh toàn cảnh + 26 hình | Sau khi L1 #01 được duyệt |
> | **L4** | Bản đồ phiêu lưu (10 khu phố) + 16 "bé tinh linh" + 4 boss (cùng mã với K2/Đơn 6) | 1 ảnh toàn cảnh + 61 hình | Sau khi L1 #01 được duyệt |
>
> Không đặt (giống Khối vuông): bộ khung màn trong (Bảng xếp hạng · Nhiệm vụ · Thành tựu — Đơn 15–18 của RPG), boss riêng giáo viên, 6 nhân vật
> chính chạy/đánh (vẫn dùng bộ anime chung). Thiếu thì app tự vẽ bằng code / rơi về hình chung, không vỡ.

---

## ✅ ĐÃ DỰNG CODE 12/10 (Thùy: "dựng code đi") — nhánh `claude/lofi-chill-interface-fe92b0`

- **Style:** `skin/styles/lofi.ts` (id `lofi`, hiện trong "Phong cách" sau Khối vuông; KHÔNG mặc định cho khối nào) · 2 chế độ: sáng = nắng chiều, tối = đêm đèn bàn ·
  thẻ giấy kem / kính chàm · Nunito · 3 nền (Góc cửa sổ mặc định · Ngày mưa · Sân thượng) × 2 giờ × 2 khổ · 23 icon ô · 2 banner · góc trang trí · lời chữ `LOI_LOFI`.
- **Màn chính "sống":** nền Góc cửa sổ có MÂY TRÔI sau cửa sổ (lớp phòng khoét phông xanh + dải trời) · nhân vật viết bài, thỉnh thoảng ngẩng nhìn cửa sổ / gật gù,
  mèo vẫy đuôi / ngáp — ghép vùng trên canvas (`skin/HomeSong.tsx`). Nhân vật bám đáy màn khi cuộn. Bản đêm của nhân vật = hình ngày phủ chàm + quầng đèn (sinh bằng script).
- **Khu Học tập:** cổng 5 góc nhỏ · Chinh phục BK (tháp tổng + 8 tháp, đế, cầu) · sân Đấu trường · bản đồ phiêu lưu 2D (thế giới 10 đảo · nền vùng · nền dạng · 6 mốc ·
  bệ · sương · cờ · la bàn) · 16 bé tinh linh + 4 boss · bảng màu 3D `the3d/bangMauLofi.ts` · hình game nhúng.
- **Nén hình:** `node scripts/lofi-hinh.mjs` (ảnh gốc ngoài git ⇒ đặt `LOFI_SRC=<thư mục lofi>` nếu không nằm ở `design/bk-ui-src/lofi/`) → `public/bk-ui/hs/skin/lofi/`
  (~19 MB) + sinh `styles/lofiHocTap.ts` · `styles/lofiSong.ts`. Luôn ưu tiên bản `_v2`.
- **Hợp đồng style thêm** (`skin/kieu.ts`, style khác không đổi gì): `theTiep` / `nenTen` theo chế độ · `nhanVatToi` · `nhanVatBoCuc` · `nhanVatLoc` · `homeSong`. Trang xem thử nhận `&che_do=sang|toi`.
- **✅ Migration `202610120117_hs_giao_dien_skin_lofi.sql` ĐÃ ÁP 13/10 (Thùy)** — kiểm trên DB thật bằng role `claude_ro`: `hs_giao_dien_skin_check` = `toi_gian · dau_truong · y2k · soft · rpg · khoi · lofi`
  (CHECK `hinh_nen` là `^[a-z0-9_]{1,40}$` ⇒ `cua_so` / `mua` / `san_thuong` hợp lệ). Hết chặn deploy về phía DB.
  Còn 2 việc sổ sách: ① sổ `_migrations` CHƯA có dòng file này (áp tay qua SQL Editor) ⇒ `migrate --status` sẽ báo còn treo — chạy `npm run migrate` lần tới là tự áp lại
  (file viết kiểu bỏ-rồi-tạo-lại nên chạy lại vô hại) hoặc `node scripts/migrate.mjs --baseline 202610120117_hs_giao_dien_skin_lofi.sql` · ② `schema.md` trên nhánh này CHƯA sinh lại
  (nhánh chậm hơn `main` >130 commit — sinh lại bây giờ sẽ kéo cả thay đổi DB của các luồng khác vào và xung đột khi gộp) ⇒ `npm run schema` SAU khi gộp `main`.
- **Soi không cần đăng nhập** (`npm run dev:hs`): `hs.html?xem=gami&skin=lofi&man=home` (theo sáng/tối của máy; `&nen=mua|san_thuong`; `&tt=2` = nhân vật nữ) ·
  `hs.html?xem=hoc_tap&skin=lofi&che_do=sang` · `hs.html?xem=phieu_luu&skin=lofi&che_do=sang` (+ `&tang=luc_dia&luc=C` · `&tang=chang&luc=C&vung=C1` · `&tang=dau&luc=C&vung=C1`).
- **Đã soi bằng mắt 12/10 (bản dev, 1180×820 + 430×900):** màn chính ngang sáng + tối · màn chính dọc sáng · chọn nhân vật · cổng Học tập · Chinh phục BK · thế giới · lục địa · chặng · màn đấu.
- **CHƯA làm / còn lại:** ① màn đấu còn 1 câu gõ cứng giọng game "chọn đúng để tung phép" (`HocSinhApp.tsx`, dùng chung MỌI style — chưa sửa vì `main` vừa đổi đúng đoạn đó,
  sửa sau khi gộp `main`) · ② mưa rơi trên kính cho nền Ngày mưa, hơi trà, bụi nắng, đèn "thở" (mục 6) chưa làm — 5 hình hiệu ứng đã nén sẵn ở `song/fx_*.webp` ·
  ③ 10 nền vùng nhiều chi tiết, điểm màn đấu đang theo bố cục đường chung (chưa khai `choMoc` từng vùng) · ④ chưa soi: màn chính dọc tối, 2 nền còn lại ở mọi khổ, sân Đấu trường,
  game nhúng `src/dautu`, các màn gamification trên nền sáng của Lo-fi, máy thật (iPad / điện thoại) · ⑤ boss riêng giáo viên, bộ khung màn trong: không có (vẽ bằng code).

---

## ✅ KIỂM HÀNG 11/10 — đủ 157/157 hình (về 10–11/10, tên mặc định ở GỐC `bk-ui-src/`) ⇒ Claude nhận diện bằng mắt + đổi tên

Đã chuyển vào `design/bk-ui-src/lofi/` (L1) · `lofi/hoat-hoa/` (L2) · `lofi/hoc-tap/` (L3) · `lofi/phieu-luu/` (L4) — sổ đổi tên `lofi/_doi_ten.log.txt`
(hoàn tác được). 326 MB, đã thêm vào `.gitignore` ⇒ **Thùy cất bản gốc lên Drive** (thư mục `lofi/` cạnh `khoi/`, `gami/`) rồi gửi link ghi vào đây.
Số lượng khớp đúng 4 đơn (40 + 27 + 28 + 62), thứ tự + nội dung khớp danh sách, không hình trùng / lệch chỗ.

| Đơn | Dùng được ngay | Phải làm lại | Ghi chú |
|---|---|---|---|
| **L1** | ✅ **40/40** | — | Nét đúng, không ra Lofi Girl (nam kính tròn áo xanh rêu + mèo đen · nữ áo len sọc + mèo xám). 18 icon + 2 banner + 2 trang trí nền trong suốt thật. Lệch nhận được: nền NGANG về 1504×1046 (tỉ lệ iPad, không phải 16:9 ⇒ máy tính 16:9 bị xén ~19% chiều dọc) · 2 góc học về gần VUÔNG 1246×1262 (đơn ghi dọc 1122×1402), bàn chạm cả 2 mép trái–phải ⇒ code làm mờ mép phải |
| **L2** | ✅ **26/27** | **1** — `nv_nu_gat_gu` | Khung nữ gật gù về cỡ KHÁC (1381×1139, các khung khác 1241×1268) ⇒ không chồng khít. Còn lại: phông xanh sạch (3–4% khung xanh thuần, lem < 1%) · lớp phòng cửa sổ NGANG về đúng 1672×941 ⇒ dùng làm nền `cua_so` cho màn 16:9 · trời đêm nối mép tốt, trời chiều lệch mép nhẹ (code hoà mép). Đo thật: mỗi khung vẽ lại lệch 8–27% điểm ảnh so với hình gốc, rải khắp hình ⇒ **bắt buộc ghép vùng** như mục 6, không thay cả hình |
| **L3** | **7/28** — 2 ảnh toàn cảnh · 2 nền cổng · nền Chinh phục · `thap_cd_2` · sân đấu | **21** | 20 hình **nền KHÔNG trong suốt** (dính trời mây / nền kem / nền trắng): 5 icon ô · 4 góc nhỏ · tháp tổng + 7 tháp chủ đề (1, 3–8) · 2 đế đảo · cầu. Thêm `goc_giai_vo_dich` vừa dính nền vừa sai bố cục (cảnh sân khấu nhìn ngang 1536×1024, không phải góc nhỏ lơ lửng) |
| **L4** | **43/62** — toàn cảnh · nền thế giới · 9 đảo · 10 nền vùng · 4 nền dạng · 6 mốc · 4 vật nhỏ · 8 bé nhóm mở rộng | **19** | ① `dao_dong_gio` dính nền tím · ② **8 bé đầu** (#23–#30) vẽ thành TRANH CÓ CẢNH (không trong suốt) · ③ **4 boss**: rồng con + golem nền kem, phượng hoàng + bạch tuộc nền đen · ④ **6 nền dạng** không có mặt đường ngang ở 72–76% (ở độ cao đó là nước / mây / lan can): `bien_dao` · `anh_dao` · `dam_lay` · `thanh_co` · `troi_sao` · `dong_gio`. Dùng được: `rung` · `bang` · `sa_mac` · `nui_lua` (núi lửa hơi gồ ghề) |

**Tổng: 116/157 dùng được · 41 phải làm lại** (33 chỉ vì nền không trong suốt · 1 góc nhỏ dính nền + sai bố cục · 6 nền dạng sai bố cục · 1 khung khác cỡ).

**Nhận xét phong cách (không chặn, Thùy quyết):**
- L4 lệch khỏi "lo-fi chill": đảo + nền vùng + nền dạng là **cảnh phiêu lưu rực rỡ** (thác nước, dung nham, lâu đài) chứ không phải "khu phố" theo bảng ánh xạ
  (hẻm đèn lồng, nhà ga, hồ sen…). Đẹp, ấm, cùng tông hoàng hôn với L3 ⇒ t đề xuất **nhận**, không vẽ lại vì lý do này.
- **Bé tinh linh có 3 nét vẽ khác nhau:** 8 bé đầu = tranh 3D có cảnh · 8 bé mở rộng = 3D dễ thương nền trong suốt (đều nhau, đẹp) · rồng + golem = tranh
  phẳng pastel. Vẽ bù ⇒ **lấy 8 bé mở rộng làm chuẩn**. Không bé nào quấn cuộn len (trừ rồng, golem) ⇒ code đặt `fx_cuon_len` lên, không cần vẽ lại.
- 10 nền vùng là cảnh phối cảnh nhiều chi tiết, ít khoảng đất trống ⇒ dùng được nhưng phải đặt điểm màn đấu **bằng tay** từng vùng (`choMoc`).
- `la_ban` có chữ N/E/S/W nhỏ — thu về 256px không đọc được, nhận.

> ✅✅ **12/10 (lượt 2): `boss_golem_pha_le` (BS32) ĐÃ VỀ, đạt ⇒ BỘ LO-FI ĐỦ 157/157 HÌNH DÙNG ĐƯỢC** (116 bản gốc + 41 bản `_v2`). Hết nợ hình — sẵn sàng dựng code.
>
> ✅ **KIỂM HÀNG BỔ SUNG 12/10 (lượt 1) — về 40/41, cả 40 ĐẠT ⇒ bộ Lo-fi đủ 156/157 hình dùng được. CÒN THIẾU 1: `boss_golem_pha_le` (mã BS32)** — nhóm B về
> 12 hình thay vì 13. Hình đạt đã thêm cạnh bản cũ với tên `<tên cũ>_v2.png` (bản cũ giữ nguyên) — **khi dựng code dùng bản `_v2` nếu có**.
> Chi tiết: nhóm A 21/21 trong suốt thật (7 tháp chủ đề về khung vuông 1254² thay vì 1024×1536 — tháp vẫn cao hết khung, chân chạm đáy, code đo hộp
> nhìn thấy nên không sao) · nhóm B 12/13 cùng nét với 8 bé chuẩn · nhóm C 6/6 có mặt đường phẳng liền mạch đúng dải 72–76% · nhóm D khung nữ gật gù
> đúng cỡ 1241×1268. Thiếu golem KHÔNG chặn dựng (thiếu ảnh boss ⇒ app rơi về quái tạm).
>
> ✅ **Thùy chọn 11/10: nhờ ChatGPT làm lại cả 41 hình** ⇒ đơn gửi nằm ở **`design/DON-HANG-LOFI-BO-SUNG.md`** (mã BS01–BS41, 4 nhóm, kèm đường dẫn hình cũ
> phải đính kèm từng lượt). **Gửi theo file đó** — 3 khối đơn ngắn bên dưới là bản nháp lúc kiểm, đừng gửi.

**Hai cách xử 33 hình chỉ dính nền** (chọn 1):
- **A — ChatGPT vẽ lại** theo đơn bổ sung dưới (chắc ăn, nhưng 33 lượt và hình vẽ lại sẽ khác bản cũ đôi chút).
- **B — Claude tách nền tại máy** bằng công cụ tách nền AI (`rembg`): giữ nguyên hình đã vẽ, không tốn lượt. Cần Thùy cho phép cài (tải ~170 MB). Hình nào tách
  xấu (đèn toả sáng, dây leo mảnh) mới gửi vẽ lại. **T đề xuất B trước** — chưa thử nên chưa biết tỉ lệ tách đẹp.

**Đơn bổ sung — dán vào ĐÚNG context ChatGPT đã vẽ đơn đó:**

L2 (context vẽ L1 + L2):
```
BỔ SUNG — 1 hình sai cỡ. Vẽ lại, vẫn luật cũ: ĐÚNG 1 HÌNH, dòng đầu ghi số + tên file.
   #19 lofi_nv_nu_gat_gu — Y HỆT góc học nữ đã duyệt (CÙNG KHUNG 1241×1268, cùng vị trí bàn / đèn / mèo / chậu cây, không thu phóng, không cắt lại),
       CHỈ đổi ĐẦU: nghiêng nhẹ sang phải, mắt nhắm, mỉm cười như đang nghe nhạc; tay để yên. Nền TRONG SUỐT.
```

L3 (context vẽ khu Học tập) — nếu chọn cách B thì CHỈ gửi dòng #13:
```
BỔ SUNG — các hình dưới bị DÍNH NỀN (trời mây / nền kem / nền trắng). Vẽ lại ĐÚNG vật đó, giữ nguyên thiết kế đã vẽ, nhưng NỀN TRONG SUỐT THẬT
(không trời, không mây, không nền màu, không bóng đổ ra nền), chừa lề trong suốt quanh vật. Vẫn luật cũ: ĐÚNG 1 HÌNH mỗi lượt, dòng đầu ghi số + tên file.
   #02 lofi_o_hoc_chu_de · #03 lofi_o_luyen_yeu · #04 lofi_o_dau_truong · #05 lofi_o_chinh_phuc · #06 lofi_o_giai_vo_dich
       — vuông 1254×1254, chỉ đồ vật, cùng nét với icon L1 đính kèm (không mặt đất, không bóng dài).
   #09 goc_hoc_chu_de · #10 goc_luyen_yeu · #11 goc_dau_truong · #12 goc_chinh_phuc — vuông 1254×1254, đúng góc nhỏ lơ lửng đã vẽ, bỏ trời mây.
   #13 goc_giai_vo_dich — VẼ LẠI BỐ CỤC: phải là GÓC NHỎ LƠ LỬNG như #09–#12 (khối đất nổi nhìn chéo từ trên, đáy đất có rễ + dây đèn), trên đó là
       sân khấu nhỏ: bục 3 bậc gỗ, cúp vàng ở bậc giữa, dây đèn + cờ giấy. Vuông 1254×1254, nền trong suốt. KHÔNG vẽ cảnh nhìn ngang.
   #16 thap_tong · #17 thap_cd_1 · #19 thap_cd_3 · #20 thap_cd_4 · #21 thap_cd_5 · #22 thap_cd_6 · #23 thap_cd_7 · #24 thap_cd_8
       — đứng 1024×1536, chân tháp chạm đáy ảnh, chỉ tháp (như #18 thap_cd_2 đã vẽ đúng).
   #25 de_tong (1536×1024) · #26 de_cd (1254×1254) — chỉ đảo đất nổi, mặt cỏ phẳng, KHÔNG trời, KHÔNG đảo nhỏ bay quanh.
   #27 cau (1774×887) — chỉ cây cầu gỗ + dây đèn, 2 đầu cầu sát mép trái / phải, KHÔNG vách đá, KHÔNG trời.
```

L4 (context vẽ bản đồ + bé tinh linh) — nếu chọn cách B thì CHỈ gửi nhóm B:
```
BỔ SUNG. Vẫn luật cũ: ĐÚNG 1 HÌNH mỗi lượt, dòng đầu ghi số + tên file.
A. Dính nền — vẽ lại ĐÚNG vật đó, NỀN TRONG SUỐT THẬT:
   #12 dao_dong_gio — đúng đảo đã vẽ, bỏ nền tím, vuông 1254×1254 như 9 đảo kia.
   #23 quai_slime_la · #24 quai_slime_lua · #25 quai_meo_bang · #26 quai_rua_da · #27 quai_cu_dem · #28 quai_ca_bong · #29 quai_nam_ma · #30 quai_chim_set
       — đúng con đã vẽ, nhưng CHỈ con vật: KHÔNG cảnh, KHÔNG nền. Vuông 1254×1254, toàn thân, giữa khung ~75%,
       CÙNG NÉT với 8 bé #53–#60 đã vẽ (thỏ khăn xanh, ếch áo mưa, đom đóm đèn lồng…) — đính kèm 2 hình mẫu.
   #31 boss_rong_con · #32 boss_golem_pha_le · #61 boss_phuong_hoang · #62 boss_bach_tuoc — CÙNG NÉT với 8 bé #53–#60, to tròn hơn, nền trong suốt
       (không nền kem, không nền đen). Rồng: quấn chăn ôm gối. Golem: ôm chồng sách. Phượng hoàng: lông cam hoàng hôn, khăn quàng dài.
       Bạch tuộc: tím, cầm que đan len.
B. Nền màn dạng bài sai bố cục — vẽ lại 6 hình: #36 nen_dang_bien_dao · #37 nen_dang_anh_dao · #39 nen_dang_dam_lay · #40 nen_dang_thanh_co
   · #41 nen_dang_troi_sao · #42 nen_dang_dong_gio
       Giữ nguyên không khí + màu đã vẽ, nhưng PHẢI là màn game ĐI NGANG: nhìn thẳng từ bên hông (không phối cảnh chéo), có 1 CON ĐƯỜNG lát đá /
       ván gỗ / đất nện THẲNG NGANG chạy từ mép TRÁI tới mép PHẢI ảnh, mặt đường PHẲNG, liền mạch, tâm đường ở 74% chiều cao (dải 72–76%).
       Trên mặt đường TRỐNG suốt bề ngang (không bậc thang, không lan can, không thùng hộp, không nhà ở tiền cảnh). Nước / mây / vực chỉ được nằm
       PHÍA SAU hoặc PHÍA DƯỚI con đường. Cảnh đẹp dồn lên nửa trên. Ngang 1672×941, nền đặc, không người, không chữ.
       (Gần đúng nhất trong các hình đã vẽ: #33 nen_dang_rung và #34 nen_dang_bang — nhưng đường phải thẳng và rõ hơn nữa.)
```

---

## 0. Quyết định thiết kế (Claude đề xuất 09/10 — ✅ Thùy chốt cả bảng 09/10)

| # | Vấn đề | Chọn | Vì sao |
|---|---|---|---|
| 1 | Tên style trong app | **"Lo-fi chill"** (id `lofi`), mô tả "Góc học yên tĩnh, nắng chiều, mưa đêm", dòng phụ "giống: Lofi Girl · study with me" | Như RPG ghi "Genshin · Star Rail", Khối ghi "Minecraft · Roblox" — chỉ nêu tên để so sánh |
| 2 | Học sinh nào chọn | Em **thích học một mình, yên tĩnh, không thích ồn ào cạnh tranh**. Không đặt làm mặc định cho khối nào (mặc định vẫn: lớp 4–7 Khối vuông, 8–12 Anime — `skinMacDinhTheoKhoi`) | Style "chọn vào", không ép |
| 3 | **"Chill" thể hiện bằng gì** (style chỉ được đổi HÌNH · MÀU · CHỮ, logic y hệt mọi style — luật đối xứng) | 5 cần gạt: ① màu ấm, bão hoà thấp, badge **cam đất** thay đỏ chói · ② chuyển động **chậm, biên độ nhỏ** (chu kỳ 3–8 giây), không rung màn, không chớp · ③ **lời chữ riêng `LOI_LOFI`**: không "chiêu / quái / TUYỆT KỸ!", không chấm than dồn dập (mục 5) · ④ **Home có nhân vật NGỒI HỌC cùng em** (không đứng tạo dáng) — đây chính là lý thuyết *body doubling* / video *study with me*: học một mình nhưng có "người ngồi học cạnh" thì dễ tập trung hơn · ⑤ tranh nền ÍT chi tiết, mờ dịu phía đặt thẻ | Ai đã nghe nhạc Lofi Girl đều nhận ra công thức: 1 người + 1 con mèo + 1 cửa sổ + chuyển động lặp rất chậm |
| 4 | Sáng hay tối | **CẢ HAI — cùng 1 căn phòng, khác giờ:** chế độ SÁNG = nắng chiều (đúng ảnh Thùy gửi) · chế độ TỐI = đêm, đèn bàn cam. Chế độ "Theo hệ thống" ⇒ điện thoại tối buổi tối thì phòng cũng sang đêm | Lo-fi gắn với giờ học tối. RPG chỉ tối, Khối chỉ sáng ⇒ Lo-fi là style ẢNH đầu tiên có đủ 2 chế độ (cần vá 1 lỗ hợp đồng — mục 7, bước 4) |
| 5 | Giữ lớp game "Giải cứu thế giới — đánh quái" không | **GIỮ cấu trúc, ĐỔI ẨN DỤ:** bản đồ = **dạo các khu phố**, mỗi khu 1 không khí; "quái" = **bé tinh linh đang RỐI** (mỗi bé quấn 1 cuộn len rối); trả lời đúng = **gỡ 1 nút rối**; hết máu = bé **hết rối, ngủ ngon / mỉm cười**. Không vũ khí, không đánh nhau | DB gán `biome` / `loai_quai` cố định — đổi style chỉ đổi thư mục hình (`spec-v1-app-hs.md` §4.4). Bỏ hẳn bản đồ thì rẻ hơn (không khai `hocTap`/`banDo2d` ⇒ chạy như Tối giản) nhưng em chọn Lo-fi mất trọn phần phiêu lưu |
| 6 | Nhân vật | 2 học sinh **tự thiết kế**, khác hẳn Lofi Girl (danh sách CẤM ở PHONG CÁCH CHUNG). Hình giao = **"góc học" trọn gói**: người ngồi + bàn + đèn + cốc + mèo, PNG trong suốt chạm đáy — vừa khít chỗ `nhanVat` của hợp đồng, Home ngang KHÔNG phải sửa bố cục | Lofi Girl là nhân vật có thương hiệu (kênh Lofi Girl / Lofi Records). Giống ở **không khí và cách vẽ** được, giống **từng chi tiết nhận dạng** thì không |
| 7 | Hoạt họa Home | **Ghép lớp (cutout) + ghép vùng**, KHÔNG nhờ ChatGPT vẽ 1 chuỗi khung hoàn chỉnh. Lớp tĩnh: phòng. Lớp động: trời + mây trôi sau cửa sổ (khoét bằng **phông xanh** — chroma key), tay viết / ngẩng đầu (khung vẽ lại, Claude chỉ lấy VÙNG tay/đầu dán lên khung gốc), đuôi mèo. Hiệu ứng thuần code: mưa trên kính, hơi trà bốc, bụi nắng, đèn "thở", đom đóm | ChatGPT vẽ lại cả hình thì mỗi khung lệch chút ít ⇒ nhấp nháy (bài học `Animation/ANIMATION.md`). Chỉ lấy vùng thay đổi ⇒ phần còn lại đứng im tuyệt đối |
| 8 | Font | **Nunito** (thân) + **Nunito 800** (tiêu đề, số). Không chữ viết tay, không Pacifico | Tròn, mềm, đủ dấu tiếng Việt; Đơn 3 v3 cũng đã chọn. Đo dấu bằng chụp thử lúc dựng như Khối |
| 9 | Thẻ / nút | **Kiểu GIẤY**: thẻ giấy kem bo 16px, bóng mềm, viền mảnh nâu nhạt (sáng) · kính chàm trong mờ, viền ánh cam (tối). Nút chính cam đất. Thanh tiến độ = **dải băng dính washi**. Thẻ "Việc tiếp theo" = **tờ giấy note** cam vàng | Đồ trên bàn học = ngôn ngữ của style, như "túi đồ" của Khối |
| 10 | Bản đồ + quái | **CÙNG mã biome + mã loài với K2 / Đơn 6**, chỉ khác hình. Giữ **dáng cơ thể** của từng loài (giọt thạch / thú 4 chân / rùa / chim / cá / sao / nấm / người đá / côn trùng) | Hoạt ảnh quái đọc theo dáng (`skin/the3d/loai.ts` → `KeHoach`): đổi dáng là chuyển động sai |

✅ **Thùy chốt 09/10 ("ok chốt cả 3"):** #4 cả 2 chế độ, cùng 1 phòng chiều/đêm · #5 giữ bản đồ, đổi ẩn dụ "gỡ rối cho bé tinh linh" ·
#6 trang phục 2 nhân vật như Đơn L1. Các mục còn lại theo đề xuất ⇒ **đơn gửi được ngay** (L1 trước).

---

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` → dán khối **PHONG CÁCH CHUNG — LO-FI CHILL** (ngay dưới) → dán nguyên khối **ĐƠN ĐẶT HÀNG** của đơn đó.
2. Đính kèm:
   - `design/handoff/hs-skin-lofi-v2/reference/khong_khi_lofi.webp` — **KHÔNG KHÍ** Thùy chọn 09/10: lấy ánh nắng chiều, bảng màu, nét vẽ anime
     phẳng có viền, độ "chill". Ghi rõ với ChatGPT: **không chép người, con mèo, góc nhìn hay khung cảnh phố trong ảnh**.
   - `design/handoff/hs-skin-khoi-v1/reference/bo_cuc_home_ipad.jpg` · `bo_cuc_home_dt.jpg` · `bo_cuc_nhiem_vu_ipad.jpg` — **BỐ CỤC + NỘI DUNG**
     màn chính / Nhiệm vụ (chụp từ code, style RPG). Chỉ lấy bố cục.
   - `design/bk-ui-src/khoi-20261009T113603Z-1-001/khoi/khoi_man_chinh_ipad.png` — ảnh toàn cảnh Khối vuông đã duyệt, để ChatGPT thấy **mức hoàn thiện**
     cần đạt (không lấy phong cách).
   - Đơn L2 / L3 / L4: đính kèm thêm các hình L1 đã duyệt (#01 + 2 icon + góc học) làm mẫu nét.
3. ChatGPT vẽ **#01** rồi DỪNG ⇒ Thùy duyệt phong cách. Chưa ưng thì sửa #01; ưng rồi mới gõ "tiếp".
4. **Tải về theo ĐÚNG thứ tự #** vào `design/bk-ui-src/lofi/` (L1) · `lofi/hoat-hoa/` (L2) · `lofi/hoc-tap/` (L3) · `lofi/phieu-luu/` (L4).
   Không cần đổi tên — Claude nhận diện **bằng mắt**, giờ tải chỉ để đối chiếu (bài học 01/10: gán theo thứ tự giờ tải là gắn nhầm).
   Hình nào bắt vẽ lại thì ghi chú số # của hình đó.
5. Xong nhóm nào (B, C, D…) báo Claude kiểm nhóm đó, đừng đợi đủ cả đơn.
6. Ảnh gốc KHÔNG lên git (`design/README.md`) — cất bản chính lên Drive (thư mục mới `lofi/` cạnh `khoi/`, `gami/`), gửi link để Claude ghi vào đây.
   Claude nén bản app dùng vào `public/bk-ui/hs/skin/lofi/`.

---

## PHONG CÁCH CHUNG — LO-FI CHILL (dán kèm MỌI đơn)

```
PHONG CÁCH CHUNG — style "Lo-fi chill" của app học sinh BK Academy (trung tâm dạy thêm Toán, học sinh lớp 3–12)
MỤC TIÊU:    nhìn vào là thấy NGAY không khí "lofi hip hop radio – beats to relax/study to": một góc học yên tĩnh, nắng chiều hoặc
             đèn bàn ban đêm, một con mèo, ngoài cửa sổ là phố. Dành cho học sinh THÍCH HỌC MỘT MÌNH, cần dễ chịu, thư giãn, tập trung.
             Giống ở KHÔNG KHÍ và CÁCH VẼ — MỌI người, vật, cảnh ĐỀU TỰ THIẾT KẾ.
Nét vẽ:      tranh nền anime vẽ tay kiểu phim hoạt hình 2D: mảng màu PHẲNG có chuyển sắc nhẹ, nét viền nâu sẫm mềm (không đen tuyền),
             bóng đổ 2 tầng rõ ràng, ánh sáng ấm hắt từ cửa sổ hoặc đèn bàn, chi tiết đồ vật nhiều nhưng ÊM (không rối mắt),
             hạt nhiễu giấy rất nhẹ. KHÔNG 3D, KHÔNG ảnh chụp, KHÔNG chibi, KHÔNG pixel, KHÔNG vector phẳng kiểu icon app.
Ánh sáng:    2 GIỜ cho cùng một cảnh:
             · CHIỀU (chế độ sáng): nắng vàng cam xiên từ trái, trời xanh nhạt, bóng đổ ấm dài, không khí trong.
             · ĐÊM (chế độ tối): trời chàm tím, đèn bàn cam là nguồn sáng chính, cửa sổ thấy đèn phố / đèn nhà xa, ánh trăng xanh nhạt.
Bảng màu:    CHIỀU: kem giấy #f4ead9 · nắng #ffd59a · cam đèn #f0a35e · cam đất #b4532e · gạch #c96f4a · xanh lá cây trồng #6f9a5b
             · xanh trời nhạt #bcd9e6 · gỗ #a8754f / #6e4a33 · chữ nâu cà phê #3a2e28 · chữ phụ #76655a.
             ĐÊM: chàm #1d1b3a → tím mận #3b2b52 · đèn cam #ffb066 · trăng #cfe0ff · gỗ đêm #4a3a3f · chữ kem #f2e8da · chữ phụ #b8aec6.
             Độ bão hoà THẤP-VỪA, ấm. KHÔNG neon chói, KHÔNG đỏ tươi, KHÔNG tím điện tử.
Đồ vật:      đồ trên bàn học đời thường: sách, vở, bút chì, bút máy, tai nghe, cốc trà/cacao bốc khói, đèn bàn, chậu cây (trầu bà, xương rồng),
             giấy note, băng dính washi, đồng hồ, radio cũ, hũ thuỷ tinh, quả cầu tuyết, dây đèn nhỏ, rèm vải mỏng.
             Đồ điện tử (laptop, điện thoại, radio) TỰ THIẾT KẾ, không logo, không giống sản phẩm thật của hãng nào.
Người:       học sinh Việt Nam tuổi 13–17, tỉ lệ anime cân đối (KHÔNG chibi), nét mặt hiền, đang tập trung, trang phục KÍN ĐÁO, đời thường.
ĐƯỢC giống:  không khí lofi (người đeo tai nghe học bên cửa sổ, mèo, đèn bàn, phố ngoài cửa sổ, mưa trên kính) · nét tranh nền anime ·
             loại đồ vật đời thường ở trên.
CẤM (có 1 thứ là hỏng cả hình):
             · CHÉP "Lofi Girl": cô gái tóc nâu sẫm buộc đuôi ngựa cao + tai nghe to kem-đỏ + áo khoác xanh lá có mũ hoodie hồng;
               mèo mướp CAM nằm trên bậu cửa sổ; khung cảnh mái nhà phố Lyon; bố cục "người quay nghiêng sang trái viết bài, cửa sổ sau lưng"
               y hệt ảnh mẫu; cậu bé "Synthwave Boy" ngồi ban công đêm của cùng kênh.
             · logo / chữ "lofi girl", "lofi hip hop radio", logo YouTube, logo hãng tai nghe / laptop / điện thoại.
             · nhân vật của phim / game khác (Ghibli: bồ hóng, Totoro, Kiki, mèo Jiji…).
             · khói thuốc, đồ uống có cồn, cảnh u buồn / cô đơn ủ rũ, đêm đáng sợ.
Thẻ:         kiểu GIẤY. Sáng: tấm giấy kem #fffaf2 (~90% đục), bo góc 16px, viền mảnh nâu nhạt, bóng mềm ấm, đôi khi có 1 mẩu băng dính washi
             ở góc. Tối: tấm kính chàm trong mờ, viền mảnh ánh cam, nền phía sau nhoè. Khung gần VUÔNG — KHÔNG thẻ dẹt trải ngang.
             Thẻ "Việc tiếp theo" = TỜ GIẤY NOTE cam vàng dán băng dính, chữ nâu sẫm.
Nút:         nút chính = viên bo tròn cam đất #b4532e chữ kem (tối: cam đèn #ffb066 chữ nâu sẫm) · nút phụ = viền nâu mảnh, nền trong.
             Thanh tiến độ = DẢI BĂNG DÍNH WASHI có hoạ tiết chấm nhỏ. Badge số = viên tròn cam đất, chữ kem — KHÔNG đỏ chói.
Chữ:         Nunito (tiêu đề đậm 800, thân 400–600), đủ dấu tiếng Việt. KHÔNG chữ viết tay, KHÔNG Pacifico.
             Chữ chính ≥ 15px ở điện thoại, ≥ 16px ở iPad. Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (nền, nhân vật, vật phẩm) KHÔNG chữ/số nào.
Thiết bị:    iPad NGANG 1180×820 (ảnh chính — làm khổ ngang trước) + điện thoại DỌC 430px. Màn được cuộn.
CẤM thêm:    khẩu hiệu động viên · chữ tiếng Anh trang trí ("study with me", "chill vibes"…) · trái tim / doodle trang trí · nốt nhạc rải
             khắp màn (chỉ được ở đúng chỗ đơn ghi).

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#19 lofi_o_tren_lop".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (các icon, 2 góc học, các bé tinh linh, các khu phố) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context này: giữ nét viền,
  hướng sáng, độ chi tiết, bảng màu — chỉ đổi đồ vật.
```

---

## Đơn L1 — Màn chính + bộ hình của style

Đính kèm: các ảnh ở "Cách gửi" bước 2.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            style-lofi (màn chính + mọi hình của style "Lo-fi chill")
Mô tả:          App học sinh trung tâm dạy thêm BK Academy. Thêm style "Lo-fi chill" bên cạnh "Anime RPG" và "Khối vuông" đã có: em chọn
                style nào thì TOÀN BỘ app đổi theo (màn chính, mọi màn bên trong, popup). Style này dành cho học sinh thích học MỘT MÌNH,
                yên tĩnh, dễ chịu. Bố cục giữ y như ảnh bo_cuc_* đính kèm (style RPG hiện tại) — CHỈ đổi phong cách theo PHONG CÁCH CHUNG.
                Điểm khác duy nhất về bố cục: nhân vật KHÔNG đứng mà NGỒI HỌC ở bàn (cả góc học là 1 hình), như đang học cùng em.

MÀN CHÍNH khổ NGANG (iPad 1180×820) — đúng khối, đúng thứ tự như bo_cuc_home_ipad.jpg (chữ/số do code vẽ; ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Góc trên trái: TẤM TÊN (thẻ giấy) = avatar tròn (2 chữ "MK") + "Nguyễn Minh Khang" + "HS0412 · 9A1 · Toán" + vạch ngăn + biểu tượng
    bậc rank nhỏ + "Captain" + 2 sao.
  - Góc trên phải: nút "Hình nền" (icon bảng màu + chữ) · nút Hòm thư (badge 3) · nút "⋯".
  - Cột TRÁI ≈ 34%: GÓC HỌC (cửa sổ phía sau, bàn gỗ, đèn bàn, cốc trà bốc khói, chồng sách, chậu cây, nhân vật nam đeo tai nghe ngồi
    viết, mèo nằm cạnh) — đáy góc học chạm mép dưới. BONG BÓNG THOẠI nhỏ cạnh nhân vật: "Hôm nay còn 2 nhiệm vụ, mình làm từ từ nhé."
  - Cột PHẢI: "Chào Minh Khang!" chữ to 2 dòng →
      nhóm "HỌC TẬP": thanh chọn môn [Toán | KHTN] (Toán đang chọn) → thẻ ca bổ trợ (giấy note) "THỨ 5 01/10 · 17:30" / "Bổ trợ yếu · Toán" /
      "Phòng 204 · Cô Lan" + icon lịch → LƯỚI Ô 4 cột, mỗi ô: icon đặt GIỮA + tên + 1 dòng trạng thái + badge tròn cam đất:
        Học tập "Cùng BK chinh phục thế giới" · Nhiệm vụ "Hôm nay còn 2 nhiệm vụ" (badge 2) · Bảng xếp hạng "Captain ★★ · hạng 12/54" ·
        Thông tin học tập "Xem dạng đang yếu" · Sổ tay kiến thức "Tra lý thuyết & bài mẫu" · Làm đề thi thử "Sắp có" (ô KHOÁ, mờ) ·
        Bài tập trên lớp "2 bài chưa làm" (badge 2)
      → nhóm "GIẢI TRÍ": thẻ ngang "Thế giới BK" (icon + "Xem học sinh BK đang khoe gì nào!" + 2 dòng tin) → lưới ô: Thư viện BK ·
        Trò chơi · Thành tựu · May mắn "Có 1 lượt quay!" (badge 1) · Ví xu "1.240 xu".
MÀN CHÍNH khổ DỌC (điện thoại 430px) — như bo_cuc_home_dt.jpg: hàng đầu (avatar · huy hiệu bậc · Hình nền · Hòm thư · ⋯) → "Chào Minh
  Khang!" → góc học thu nhỏ + bong bóng thoại → HỌC TẬP (môn · thẻ ca · lưới 4 cột ô nhỏ) → GIẢI TRÍ. Được cuộn.
MÀN CON 1 — Nhiệm vụ (iPad ngang) — như bo_cuc_nhiem_vu_ipad.jpg: 4 khối Chặng tháng · Hôm nay · Nhiệm vụ tuần (+ hàng 4 hộp quà) ·
  Nhiệm vụ tháng, đúng chữ + số trong ảnh. Mục đích: chốt dáng THẺ / NÚT / THANH TIẾN ĐỘ (băng washi) cho mọi màn bên trong.
  Màn trong dùng NỀN ĐƠN SẮC kem giấy (không tranh nền).
MÀN CON 2 — Làm bài (iPad ngang): đầu trang "Câu 3/10" + thanh tiến độ băng washi · thẻ đề "Rút gọn biểu thức A = √48 − 2√27 + √75" ·
  4 đáp án A. 3√3  B. 2√3 (đang chọn)  C. √3  D. 0 · nút chính "Câu tiếp" + nút phụ "Câu trước". Bài thật của học sinh ⇒ nghiêm túc,
  gọn, dễ đọc, nền kem trơn (không trang trí rườm rà).

Biến thể:
  3 TRANH NỀN em tự chọn, MỖI NỀN có 2 GIỜ (chiều = chế độ sáng · đêm = chế độ tối) — CÙNG một cảnh, chỉ đổi ánh sáng / trời / đèn.
  Ba nền phải khác nhau rõ từ xa:
    cua_so    : GÓC CỬA SỔ — cửa sổ lớn khung gỗ nhìn ra phố Việt Nam (nhà ống nhiều tầng, ban công cây xanh, dây điện, mái tôn/ngói
                xen kẽ — KHÔNG mái nhà châu Âu), rèm vải mỏng. Chiều: nắng xiên vàng. Đêm: cửa sổ nhà đối diện sáng đèn vàng, trăng. — MẶC ĐỊNH
    mua       : NGÀY MƯA — cùng kiểu phòng, cửa sổ đầy giọt mưa và vệt nước chảy, phố ngoài nhoè. Chiều: trời xám ấm, đèn bàn đã bật.
                Đêm: đèn đường nhoè thành đốm tròn, phản chiếu mặt đường ướt.
    san_thuong: SÂN THƯỢNG — sân thượng nhà phố với chậu cây, dây đèn nhỏ, ghế gỗ, nhìn ra mái nhà thành phố. Chiều: hoàng hôn cam hồng.
                Đêm: trời sao, dây đèn sáng, ánh đèn thành phố xa.
  2 GÓC HỌC (KHÔNG gán theo giới tính — em tự chọn), cùng phong cách, cùng góc nhìn 3/4, cùng bố cục bàn:
    nam : nam sinh tóc đen ngắn hơi rối, kính gọng tròn mảnh, áo len cardigan XANH RÊU ngoài áo phông kem, tai nghe chụp tai màu KEM-NÂU,
          tay phải cầm bút chì đang viết vào vở; trên bàn: đèn bàn kim loại xanh rêu, cốc trà bốc khói, chồng sách, chậu xương rồng;
          bạn đồng hành = MÈO ĐEN nhỏ mắt vàng cuộn tròn ngủ trên chồng sách.
    nu  : nữ sinh tóc đen dài ngang vai, kẹp tóc vàng mù tạt, áo len cổ tròn màu KEM có hoạ tiết sọc nâu, tai nghe chụp tai TRẮNG,
          tay cầm bút máy viết vào sổ; trên bàn: đèn bàn gỗ chụp vải, cốc cacao, chậu trầu bà rủ lá, lọ bút;
          bạn đồng hành = MÈO XÁM TRẮNG (mèo mướp xám, KHÔNG cam) nằm duỗi trên bàn cạnh sổ, đuôi buông xuống mép bàn.
    Kín đáo, đời thường, nét mặt bình yên đang tập trung. Ghế + bàn + đèn + người + mèo = MỘT hình liền.

Phiên bản kit:  v3 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô, banner): vuông 1254×1254, nền TRONG SUỐT thật (không nền trắng, không ô caro giả), vật ở GIỮA chiếm ~80% khung,
  không chữ/số/badge, không khung ô phía sau. Vẽ cùng nét tranh nền (viền nâu mềm, bóng 2 tầng), nhìn 3/4 từ trên nhẹ, nguồn sáng ấm
  từ TRÁI-TRÊN. CẢ BỘ cùng góc nhìn, cùng độ chi tiết, cùng cỡ vật — đặt cạnh nhau như đồ trên cùng một mặt bàn.
- GÓC HỌC (nhân vật): dọc 1122×1402, nền TRONG SUỐT thật (chỉ người + ghế + bàn + đồ trên bàn + mèo; KHÔNG tường, KHÔNG cửa sổ),
  mép bàn / chân ghế CHẠM MÉP DƯỚI khung, người quay 3/4 về phía người xem (KHÔNG quay lưng, KHÔNG nghiêng hẳn sang trái như ảnh mẫu).
  Tay cầm bút, vai, đầu, đuôi mèo TÁCH BẠCH, không đè lên nhau (để làm hoạt họa sau).
- NỀN NGANG: 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG bàn học ở tiền cảnh, KHÔNG chữ. Cửa sổ / cảnh chính dồn sang TRÁI (34% trái là chỗ
  đặt góc học); 66% bên PHẢI là tường ấm phẳng / rèm / bầu trời ÍT chi tiết (để đặt thẻ lên; chiều: sáng dịu cho chữ nâu · đêm: tối dịu
  cho chữ kem).
- NỀN DỌC: 941×1672 (9:16), nền đặc, KHÔNG nhân vật. Cửa sổ / cảnh chính ở 40% TRÊN; 60% DƯỚI phẳng, ít chi tiết.
- CẶP CHIỀU / ĐÊM của cùng 1 nền: CÙNG bố cục, cùng vị trí mọi vật (chồng lên nhau phải khớp), chỉ đổi ánh sáng / trời / đèn.
- TRANG TRÍ: góc 1254×1254 trong suốt (1 cành trầu bà rủ theo 2 cạnh vuông góc ở góc trên-trái + 1 dây đèn nhỏ quấn qua);
  gạch phân cách 1672×200 trong suốt (1 dây đèn nhỏ bóng tròn chạy ngang, võng nhẹ, mảnh).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 lofi_man_chinh_ipad      — màn chính khổ NGANG, nền cua_so giờ CHIỀU, góc học nam   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 lofi_man_chinh_ipad_dem  — đúng #01 nhưng giờ ĐÊM (thẻ kính chàm, chữ kem), góc học nam ban đêm (đèn bàn sáng)
   #03 lofi_man_chinh_dt        — màn chính khổ DỌC, nền mua giờ CHIỀU, góc học nu
   #04 lofi_lam_bai_ipad        — màn Làm bài khổ ngang (giờ chiều)
   (Màn Nhiệm vụ không cần ảnh riêng nếu #01–#04 đã chốt đủ thẻ / nút / băng washi; ChatGPT hỏi thì vẽ thêm #04b lofi_nhiem_vu_ipad.)
B. Nền (mỗi nền 4 hình: chiều ngang · chiều dọc · đêm ngang · đêm dọc):
   #05 lofi_bg_cua_so_chieu_ngang · #06 lofi_bg_cua_so_chieu_doc · #07 lofi_bg_cua_so_dem_ngang · #08 lofi_bg_cua_so_dem_doc
   #09 lofi_bg_mua_chieu_ngang    · #10 lofi_bg_mua_chieu_doc    · #11 lofi_bg_mua_dem_ngang    · #12 lofi_bg_mua_dem_doc
   #13 lofi_bg_san_thuong_chieu_ngang · #14 lofi_bg_san_thuong_chieu_doc · #15 lofi_bg_san_thuong_dem_ngang · #16 lofi_bg_san_thuong_dem_doc
C. Góc học (vẽ đúng như trong #01 / #03 đã duyệt, giờ CHIỀU; bản đêm do code phủ ánh đèn — không vẽ riêng):
   #17 lofi_nv_nam · #18 lofi_nv_nu
D. Vật phẩm cho ô chức năng (mỗi ô 1 ĐỒ VẬT KHÁC NHAU):
   #19 lofi_o_tren_lop      — BA LÔ vải be, sách giáo khoa thò ra khỏi miệng ba lô
   #20 lofi_o_et            — ĐỒNG HỒ CÁT khung gỗ + 1 tờ bài nhỏ gấp đôi tựa vào
   #21 lofi_o_btvn          — CHỒNG VỞ 3 cuốn + cốc cacao bốc khói đặt trên
   #22 lofi_o_tu_luyen      — QUYỂN NHÁP mở + bút chì vàng + cục tẩy hồng (ô "Học tập")
   #23 lofi_o_nhiem_vu      — TẤM BẢNG BẦN nhỏ ghim 3 tờ giấy note có ô tích (không chữ)
   #24 lofi_o_rank          — HUY HIỆU VẢI THÊU tròn hình ngôi sao, viền chỉ vàng
   #25 lofi_o_thong_tin     — TỜ GIẤY KẺ Ô có đường biểu đồ đi lên vẽ tay + bút dạ quang
   #26 lofi_o_so_tay        — SỔ TAY bìa da nâu có dây buộc + bút máy
   #27 lofi_o_thi_thu       — TỜ ĐỀ kẹp trên bìa kẹp hồ sơ + ổ khoá nhỏ — tông XÁM, không nắng (ô đang khoá)
   #28 lofi_o_bai_tap_giao  — PHONG BÌ giấy kraft dán tem
   #29 lofi_o_cup           — CÚP NHỎ màu đồng đặt trên khúc kệ sách (dùng cho Thành tựu)
   #30 lofi_o_xep_hang      — TẤM GỖ ghim 3 tấm ảnh polaroid TRỐNG xếp bậc cao–vừa–thấp + 1 ngôi sao giấy gấp (không mặt người, không số)
   #31 lofi_o_may_man       — QUẢ CẦU TUYẾT phát sáng nhẹ, trong có ngôi nhà nhỏ
   #32 lofi_o_vi_xu         — HŨ THUỶ TINH đầy đồng xu vàng, nắp gỗ
   #33 lofi_o_hoc_tu_dau    — BẬC THANG xếp bằng sách (4 bậc)
   #34 lofi_o_the_gioi      — CHIẾC RADIO cũ tự thiết kế (vỏ gỗ, núm vặn, ăng-ten) có 2 vòng sóng nhỏ
   #35 lofi_o_thu_vien      — KỆ SÁCH gỗ nhỏ 2 tầng đầy sách màu ấm
   #36 lofi_o_tro_choi      — HỘP XẾP HÌNH mở nắp + 3 mảnh ghép rơi ra
E. Vật phẩm cho banner:
   #37 lofi_b_lich          — LỊCH ĐỂ BÀN gáy lò xo, vài ngày khoanh tròn đỏ cam (thẻ ca bổ trợ)
   #38 lofi_b_kiem_tra_lai  — TỜ BÀI có dấu tích + bút chì, viền ánh HỒNG nhạt (banner bài kiểm tra lại)
F. Trang trí:
   #39 lofi_tt_goc          — cành trầu bà rủ + dây đèn nhỏ (góc)
   #40 lofi_tt_gach         — dây đèn nhỏ chạy ngang (gạch phân cách)

LUẬT RIÊNG:
  - Giữ nguyên danh sách ô, tên, thứ tự, số như mô tả. Không thêm tính năng, không thêm chữ.
  - Câu duy nhất có "giọng" = bong bóng thoại của nhân vật: nhẹ nhàng, có số thật, KHÔNG chấm than.
  - Chữ trên tranh nền phải đọc được (chiều: chữ nâu trên vùng sáng dịu · đêm: chữ kem trên vùng tối dịu, hoặc đặt trong thẻ).
  - Mọi người / vật / cảnh TỰ THIẾT KẾ theo danh sách ĐƯỢC / CẤM ở PHONG CÁCH CHUNG — đặc biệt KHÔNG ra Lofi Girl.

Bắt đầu với #01.
```

---

## Đơn L2 — Hoạt họa màn chính (gửi SAU khi L1 #17 + #18 được duyệt, trong ĐÚNG context đã vẽ L1)

> Phải gửi trong context L1 (ChatGPT còn nhớ đúng nét #05, #07, #17, #18). Hết context thì mở mới, đính kèm 4 hình đó.
> **Claude làm phần ghép** (mục 6 bên dưới): khoét phông xanh, lấy đúng VÙNG thay đổi của mỗi khung dán lên khung gốc, xếp lớp, đặt nhịp.

```
ĐƠN BỔ SUNG — HOẠT HỌA MÀN CHÍNH (vẫn luật cũ: ĐÚNG 1 HÌNH mỗi lượt, dòng đầu ghi số + tên file, chờ "tiếp")
Mục đích: màn chính "sống" rất nhẹ, như video lofi lặp: mây trôi sau cửa sổ, người đang viết / thỉnh thoảng ngẩng lên, mèo vẫy đuôi.
Tôi sẽ tự ghép các hình thành chuyển động. Vì vậy MỌI hình "vẽ lại" phải GIỐNG HỆT hình gốc (cùng khung, cùng cỡ, cùng vị trí từng
vật, cùng màu, cùng ánh sáng) — CHỈ đổi đúng bộ phận được nêu. Lệch 1 cái cốc là hỏng.

A. TÁCH LỚP NỀN cua_so (để mây trôi sau cửa sổ):
   #01 lofi_lop_cua_so_chieu_ngang — y hệt #05, nhưng toàn bộ phần BẦU TRỜI nhìn qua cửa sổ tô ĐẶC một màu xanh lá #00FF00 (phông xanh).
       Nhà, cây, dây điện ngoài cửa sổ GIỮ nguyên; chỉ trời là xanh #00FF00. 1672×941.
   #02 lofi_lop_cua_so_chieu_doc   — như #01 cho #06. 941×1672.
   #03 lofi_lop_cua_so_dem_ngang   — như #01 cho #07 (trời đêm tô #00FF00; trăng, đèn nhà GIỮ).
   #04 lofi_lop_cua_so_dem_doc     — như #01 cho #08.
   #05 lofi_troi_chieu — DẢI TRỜI chiều xanh nhạt có mây trắng hồng xốp, 3344×900, nền đặc, NỐI LIỀN 2 MÉP TRÁI–PHẢI (lặp ngang không thấy vết).
   #06 lofi_troi_dem   — dải trời đêm chàm tím, sao nhỏ thưa, mây mỏng ánh trăng, 3344×900, nối liền 2 mép.
B. KHUNG ĐỘNG TÁC (vẽ lại Y HỆT góc học đã duyệt; nền TRONG SUỐT; CHỈ đổi bộ phận nêu):
   Nam (#17):
   #07 lofi_nv_nam_viet_2 — chỉ BÀN TAY cầm bút dịch sang phải ~1 chữ trên trang vở
   #08 lofi_nv_nam_viet_3 — bàn tay dịch thêm ~1 chữ nữa
   #09 lofi_nv_nam_viet_4 — bàn tay nhấc bút lên khỏi trang (đầu bút cách giấy một chút)
   #10 lofi_nv_nam_ngang_len — chỉ ĐẦU + cổ: ngẩng lên, nhìn ra phía cửa sổ (trái), mắt mở, nét mặt thư thái; tay để yên
   #11 lofi_nv_nam_gat_gu    — chỉ ĐẦU: nghiêng nhẹ sang phải, mắt nhắm, mỉm cười như đang nghe nhạc; tay để yên
   #12 lofi_meo_nam_duoi_2   — chỉ ĐUÔI mèo đen: đổi vị trí (cong lên)  ·  #13 lofi_meo_nam_duoi_3 — đuôi cong sang hướng ngược lại
   #14 lofi_meo_nam_ngap     — chỉ ĐẦU mèo đen: ngáp, mắt nhắm
   Nữ (#18):
   #15 lofi_nv_nu_viet_2 · #16 lofi_nv_nu_viet_3 · #17 lofi_nv_nu_viet_4   (như #07–#09)
   #18 lofi_nv_nu_ngang_len · #19 lofi_nv_nu_gat_gu                       (như #10–#11)
   #20 lofi_meo_nu_duoi_2 · #21 lofi_meo_nu_duoi_3 · #22 lofi_meo_nu_ngap  (đuôi buông mép bàn đung đưa; ngáp)
C. VẬT NHỎ cho hiệu ứng (512×512, nền TRONG SUỐT, 1 vật ở giữa ~60% khung, cùng nét):
   #23 lofi_fx_la        — 1 chiếc lá trầu bà nhỏ đang rơi (nghiêng)
   #24 lofi_fx_not_nhac  — 1 nốt nhạc móc đơn màu kem, viền cam mảnh (hiện khi em làm đúng câu)
   #25 lofi_fx_sao_giay  — 1 ngôi sao giấy gấp màu vàng nhạt
   #26 lofi_fx_hoi_nuoc  — 1 làn hơi nước trắng mờ uốn lượn, cao gấp 2 rộng (512×1024)
   #27 lofi_fx_cuon_len  — 1 cuộn len RỐI màu hồng đất, vài sợi tung ra (dùng cho "bé tinh linh đang rối" ở L4)

KHÔNG chữ trong mọi hình. Bắt đầu với #01.
```

---

## Đơn L3 — Khu HỌC TẬP (bản lo-fi của K3) — gửi sau khi L1 #01 được duyệt

> Bố cục y như RPG / Khối (vị trí 5 "đảo" đặt bằng code `VT_NGANG`/`VT_DOC`, dùng chung mọi style ⇒ không sửa code). Đường nối giữa các góc
> do code vẽ. **Cách gửi:** context MỚI → kit → PHONG CÁCH CHUNG → khối dưới. Đính kèm: L1 #01 + 2 icon đã duyệt (mẫu NÉT) · bố cục:
> `design/bk-ui-src/AppHS/hs-hoc-tap-v2/reference/reference_hoc_tap.png` (cổng 5 đảo) · `khoi/hoc-tap/` K3 #14 (Chinh phục) ·
> `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png` (sân đấu) — ghi rõ "chỉ lấy bố cục, vẽ mới hoàn toàn".

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            hoc-tap-lofi (khu HỌC TẬP của style "Lo-fi chill": cổng 5 góc · Chinh phục BK · sân Đấu trường)
Mô tả:          Bấm "Học tập" ngoài màn chính ⇒ ra 5 chế độ học, mỗi chế độ là 1 "GÓC NHỎ" — một căn phòng / một khoảnh sân thu nhỏ kiểu
                mô hình ISOMETRIC ấm cúng, lơ lửng giữa trời mây hoàng hôn: Học theo chủ đề · Luyện dạng yếu · Đấu trường BK ·
                Chinh phục BK (leo tháp) · Giải Vô địch BK. Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — LO-FI CHILL + hình đã duyệt đính kèm. Trời hoàng hôn pastel cam-hồng-tím, mây xốp, ánh nắng ấm.
                Mỗi góc nhỏ = 1 khối phòng cắt lát nhìn chéo từ trên (sàn gỗ + 2 bức tường thấp hoặc 1 khoảnh sân), đáy là khối đất có rễ cây
                và dây đèn rủ xuống. Dễ chịu, không hoành tráng, không u tối.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô): như L1 — vuông 1254×1254, TRONG SUỐT, vật giữa ~80%, cùng nét với icon đã duyệt.
- NỀN: nền ĐẶC, KHÔNG nhân vật, KHÔNG chữ. Ngang 1672×941 · dọc 941×1672.
- GÓC NHỎ / THÁP / ĐẾ / CẦU: nền TRONG SUỐT thật, đúng 1 vật, chừa lề trong suốt quanh vật, không bóng đổ ra nền.
- KHÔNG chữ, số, logo, khung trong MỌI hình (trừ 2 ảnh toàn cảnh #01, #14 được có chữ mẫu).

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 lofi_hoc_tap_ipad — ảnh toàn cảnh iPad NGANG 1672×941: trời hoàng hôn pastel, biển mây bên dưới, 5 GÓC NHỎ lơ lửng (đúng 5 góc ở mục C),
       bố cục: (1) TO NHẤT ở giữa hơi cao · (3) trái-trên · (4) phải-trên · (2) trái-dưới · (5) phải-dưới; dây đèn mảnh nối 4 góc về góc giữa;
       dưới mỗi góc có tên + 1 dòng chú thích mẫu (chữ nâu sẫm); trên cùng thanh tiêu đề "Học tập". ≈12% trên cùng KHÔNG đặt góc.  → DỪNG
B. 5 icon ô (mỗi ô 1 ĐỒ VẬT KHÁC HẲN các icon L1):
   #02 lofi_o_hoc_chu_de   — QUẢ ĐỊA CẦU để bàn chân gỗ
   #03 lofi_o_luyen_yeu    — BÌNH TƯỚI nhỏ đang tưới chậu cây non (chăm chỗ còn yếu)
   #04 lofi_o_dau_truong   — BÀN CỜ mini với 2 quân cờ đối diện (1 kem, 1 nâu)
   #05 lofi_o_chinh_phuc   — CHỒNG SÁCH cao như ngọn tháp, lá cờ đuôi nheo nhỏ trên đỉnh
   #06 lofi_o_giai_vo_dich — HUY CHƯƠNG VÀNG dây ruy băng đỏ đất
C. Cổng Học tập (vẽ lại ĐÚNG như #01 đã duyệt)
   #07 lofi_ht_nen_ngang — đúng cảnh #01 nhưng KHÔNG 5 góc, KHÔNG dây đèn, KHÔNG chữ. Vùng dưới mỗi vị trí góc SÁNG DỊU, ít chi tiết. 1672×941.
   #08 lofi_ht_nen_doc   — như #07 khổ DỌC 941×1672 (1 góc giữa ở trên + 2 hàng đôi).
   #09 goc_hoc_chu_de    — góc TO NHẤT: căn gác thư viện, QUẢ ĐỊA CẦU lớn trên chân gỗ, bản đồ ghim tường, giá sách, đèn bàn sáng
   #10 goc_luyen_yeu     — NHÀ KÍNH nhỏ khung gỗ đầy chậu cây non, bình tưới, nắng xuyên kính
   #11 goc_dau_truong    — QUÁN CÀ PHÊ nhỏ: 2 ghế đối diện qua 1 bàn có bàn cờ, cờ đuôi nheo 2 màu (đỏ đất + xanh rêu)
   #12 goc_chinh_phuc    — THÁP SÁCH xoắn ốc cao có cầu thang gỗ quấn quanh, ngọn đèn ấm trên đỉnh
   #13 goc_giai_vo_dich  — SÂN KHẤU nhỏ ngoài trời: bục 3 bậc gỗ, CÚP VÀNG ở bậc giữa, dây đèn và cờ giấy phía trên
       #09–#13: vuông 1024×1024 (cạnh ≥1024), góc nhỏ nằm GIỮA ảnh, nhìn hình là biết chế độ gì.
D. Chinh phục BK (màn chọn tháp để leo)
   #14 lofi_chinh_phuc_ipad — ảnh toàn cảnh iPad NGANG 1672×941: CHÍNH GIỮA 1 THÁP TỔNG thật cao (THƯ VIỆN THÁP nhiều tầng, cửa sổ vàng ấm,
       dây thường xuân, đỉnh có đèn toả sáng) trên 1 ĐẢO ĐẤT nổi; xung quanh vòng cung 2 bên, thấp và xa hơn: 8 THÁP CHỦ ĐỀ nhỏ, mỗi tháp trên
       1 đảo nhỏ, nối về giữa bằng CẦU GỖ có dây đèn. Trời hoàng hôn. Dưới chân mỗi tháp tên + "Tầng 12" mẫu. ≈12% trên + ≈14% dưới không đặt tháp. → DỪNG
   #15 lofi_cp_nen   — đúng cảnh #14 CHỈ trời + mây: KHÔNG tháp, KHÔNG đảo, KHÔNG cầu, KHÔNG chữ. 1672×941.
   #16 thap_tong     — tháp tổng vẽ lại đúng #14, KHÔNG đảo dưới chân. 1024×1536 (đứng), chân tháp CHẠM ĐÁY ảnh.
   #17–#24 thap_cd_1 … thap_cd_8 — 8 tháp chủ đề, MỖI THÁP 1 CHẤT LIỆU khác nhau, cùng nét + ánh sáng: 1 gạch đỏ phủ thường xuân ·
       2 gỗ cabin mái xanh rêu · 3 nhà kính khung sắt nhiều tầng · 4 tháp đồng hồ đá xám · 5 hải đăng trắng sọc cam đất · 6 tháp nước gỗ
       có thang · 7 tháp tre treo đèn lồng giấy · 8 đài thiên văn mái vòm. Mỗi tháp 1024×1536, chân chạm đáy, KHÔNG đảo.
   #25 de_tong — ĐẢO ĐẤT nổi LỚN dưới tháp tổng (mặt cỏ PHẲNG rộng, đáy đất có rễ rủ + 1 dây đèn). Ngang 1536×1024, mặt phẳng ở ~50% ngang · 35% cao.
   #26 de_cd   — ĐẢO nhỏ cùng kiểu #25. Vuông 1024×1024, mặt phẳng ở ~50% ngang · 40% cao.
   #27 cau     — CẦU GỖ nhìn ngang, dây thừng 2 bên + dây đèn nhỏ, 2 đầu cầu sát mép TRÁI và PHẢI ảnh, ngang 2048×1024.
E. Sân Đấu trường
   #28 nen_san_dau — ngang 2400×860, nền đặc, góc nhìn ngang nhẹ từ trên: SÂN THƯỢNG lúc hoàng hôn, sàn gỗ phẳng chiếm dải dưới (mặt sàn từ
       ≈62% chiều cao), 2 bên chậu cây + cột treo dây đèn, nền xa là mái nhà thành phố + trời cam hồng. Vùng GIỮA (25–75% ngang) THOÁNG.
       Chỗ đứng: bên TRÁI và bên PHẢI, cùng ở ≈78% chiều cao. KHÔNG nhân vật, KHÔNG chữ.

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình (trừ #01, #14). KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## Đơn L4 — Bản đồ phiêu lưu "dạo phố" + bé tinh linh (bản lo-fi của K2) — gửi sau khi L1 #01 được duyệt

> Cây kiến thức → bản đồ (`spec-v1-app-hs.md` §4): chủ đề = **khu phố** (lục địa) · chuyên đề = khu vực · dạng = màn · cụm = **bé tinh linh**.
> **Cùng mã file với K2/K3** (DB gán cố định) — chỉ đổi nội dung hình. Bảng ánh xạ không khí từng `biome`:
>
> | biome (mã giữ nguyên) | Khu phố lo-fi |
> |---|---|
> | `rung` | Rừng thông + cabin gỗ khói bếp |
> | `bang` | Thị trấn tuyết, cửa sổ vàng ấm |
> | `nui_lua` | Hẻm đèn lồng đỏ cam buổi tối, quán ăn bốc hơi |
> | `bien_dao` | Làng chài ven biển lúc chiều |
> | `anh_dao` | Con dốc hoa anh đào mùa xuân |
> | `sa_mac` | Đồi cỏ khô vàng mùa thu + đường ray tàu nhỏ |
> | `dam_lay` | Hồ sen mưa phùn, cầu gỗ |
> | `thanh_co` | Phố cổ mái ngói + thư viện cổ |
> | `troi_sao` | Đồi đài thiên văn đêm sao |
> | `dong_gio` | Cánh đồng lúa + cối xay gió + diều |

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-lofi (bản đồ phiêu lưu + bé tinh linh, style "Lo-fi chill")
Mô tả:          App học Toán cho học sinh. Ở style này cuộc phiêu lưu là MỘT CHUYẾN DẠO PHỐ thong thả: mỗi chủ đề kiến thức là 1 khu phố,
                mỗi dạng bài là 1 điểm dừng chân, mỗi nhóm bài là 1 "BÉ TINH LINH ĐANG RỐI" (mỗi bé bị quấn 1 cuộn len rối). Học sinh làm
                đúng câu hỏi = gỡ 1 nút rối giúp bé; gỡ hết thì bé hết rối, ngủ ngon. KHÔNG đánh nhau, KHÔNG vũ khí.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — LO-FI CHILL + hình đã duyệt đính kèm. Khu phố vẽ kiểu tranh nền anime ấm nhìn chéo từ trên cao.
                Bé tinh linh: sinh vật NHỎ, TRÒN, mềm, mắt to, vẻ mặt BỐI RỐI / NGÁI NGỦ (không giận dữ, không nhe nanh), màu pastel ấm,
                mỗi bé quấn 1 cuộn len rối màu khác. Học sinh lớp 3–12 ⇒ dễ thương nhưng không trẻ con quá.
                KHÔNG giống bồ hóng / Totoro / Pokémon / Sumikko Gurashi hay linh vật có sẵn nào.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN ══
- NỀN VÙNG (nen_vung_*): ngang 1672×941, nền đặc, KHÔNG người, KHÔNG bé tinh linh, KHÔNG chữ, KHÔNG đường đi vẽ sẵn. Nhìn từ trên cao chéo
  (như bản đồ game), cảnh trải đều cả khung, NHIỀU khoảng đất / sân bằng phẳng trống để đặt 6–10 điểm dừng. Hơi tối nhẹ ở viền.
- NỀN DẠNG (nen_dang_*): ngang 1672×941, nền đặc, nhìn NGANG như màn game đi ngang: trời + cảnh xa nửa trên; 1 CON ĐƯỜNG lát gạch/đá THẲNG
  NGANG chạy hết bề ngang ảnh, mặt đường bằng phẳng, TÂM đường ở ≈74% chiều cao (dải ≈72–76%); dưới đường là cỏ / vỉa hè; phía trên đường
  thoáng (không cây to, không nhà che đường). KHÔNG người, KHÔNG chữ.
- ĐẢO KHU PHỐ (dao_*): 1024×1024, nền TRONG SUỐT, 1 khu phố thu nhỏ trên 1 đảo đất nổi nhìn chéo từ trên, đáy đất có rễ + dây đèn rủ.
- BÉ TINH LINH: 1024×1024, nền TRONG SUỐT, toàn thân, giữa khung ~75%, quay 3/4 về người xem, GIỮ ĐÚNG DÁNG CƠ THỂ ghi trong ngoặc
  (giọt / thú 4 chân / rùa / chim / cá / sao / nấm / người đá / côn trùng). Mỗi bé 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt.
- BOSS: như bé tinh linh nhưng TO, tròn hơn, cuộn len rối LỚN quấn nhiều vòng, có 1 phụ kiện riêng; vẫn dễ thương, vẫn không giận dữ.
- KHÔNG chữ, số, logo, khung, nền phía sau bé tinh linh.

══ DANH SÁCH (đúng thứ tự ưu tiên — dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 Ảnh toàn cảnh iPad ngang: bản đồ khu phố cabin rừng thông nhìn chéo từ trên, 8 điểm dừng nối bằng lối mòn lát đá, 3 điểm đã cắm cờ giấy,
       1 điểm đang sáng có 1 bé tinh linh rối đứng trên, phần cuối bản đồ phủ sương; góc trái là góc học nam thu nhỏ của L1.   → DỪNG, chờ duyệt.
B. Thế giới + 10 đảo khu phố
   #02 nen_the_gioi — biển mây hoàng hôn pastel nhìn từ trên cao, trống để đặt các đảo (ngang 1672×941, nền đặc)
   #03 dao_rung · #04 dao_bang · #05 dao_nui_lua · #06 dao_bien_dao · #07 dao_anh_dao · #08 dao_sa_mac · #09 dao_dam_lay
   · #10 dao_thanh_co · #11 dao_troi_sao · #12 dao_dong_gio   (đúng không khí từng khu theo bảng đính kèm)
C. 10 nền vùng
   #13 nen_vung_rung · #14 nen_vung_bang · #15 nen_vung_nui_lua · #16 nen_vung_bien_dao · #17 nen_vung_anh_dao · #18 nen_vung_sa_mac
   · #19 nen_vung_dam_lay · #20 nen_vung_thanh_co · #21 nen_vung_troi_sao · #22 nen_vung_dong_gio
D. 8 bé tinh linh đầu tiên (dáng cơ thể trong ngoặc — PHẢI giữ)
   #23 quai_slime_la  (giọt) giọt sương xanh lá đội 1 chiếc lá        #24 quai_slime_lua (giọt) giọt sáp nến cam, bấc nhỏ trên đầu đã tắt
   #25 quai_meo_bang  (thú)  mèo con lông xanh băng quấn khăn len      #26 quai_rua_da    (rùa)  rùa con mai rêu, trên lưng có chậu cây nhỏ
   #27 quai_cu_dem    (chim) cú tròn đội mũ ngủ, mắt lim dim           #28 quai_ca_bong   (cá)   cá nóc tròn như bóng bay, gai mềm
   #29 quai_nam_ma    (nấm)  nấm nhỏ mũ chấm phát sáng, ngái ngủ      #30 quai_chim_set  (chim) chim sẻ vàng tóc dựng đứng vì tĩnh điện
E. 2 boss
   #31 boss_rong_con       (giọt) rồng con quấn chăn, ôm gối, cuộn len rối lớn
   #32 boss_golem_pha_le   (người đá) người đá cuội có mảnh pha lê trên vai, ôm chồng sách, cuộn len rối lớn
F. Nền màn dạng bài
   #33 nen_dang_rung · #34 nen_dang_bang · #35 nen_dang_nui_lua · #36 nen_dang_bien_dao · #37 nen_dang_anh_dao · #38 nen_dang_sa_mac
   · #39 nen_dang_dam_lay · #40 nen_dang_thanh_co · #41 nen_dang_troi_sao · #42 nen_dang_dong_gio
G. Mốc + đồ vật nhỏ (512×512 trong suốt, nhìn chéo từ trên, giữa khung ~70%)
   #43 moc_thanh (thư viện cổ nhỏ) · #44 moc_thap (tháp nước gỗ) · #45 moc_trai (lều cắm trại + lửa trại nhỏ + đèn dây)
   · #46 moc_den (nhà ga nhỏ có mái hiên) · #47 moc_cau (cầu đá vòm qua suối) · #48 moc_cong (cổng vòm hoa giấy)
   #49 be_da (bục gỗ tròn thấp phủ tấm thảm đan len — chỗ bé tinh linh đứng) · #50 may_suong (1 đám sương mờ trắng kem, mép thưa dần, ngang 1024×512)
   #51 co_chinh_phuc (cờ đuôi nheo giấy kraft cắm trên que gỗ) · #52 la_ban (la bàn vỏ đồng cũ)
H. Mở rộng (làm nếu còn thời gian)
   #53–#60 thêm 8 bé: quai_tho_gio (thú) thỏ tai dài quấn khăn bay gió · quai_be_nham (người đá) bé đá cuội ấm có vết nứt cam như than hồng ·
       quai_sao_bien (sao) sao biển đeo kính lặn · quai_ech_doc (giọt) ếch con mặc áo mưa vàng · quai_dom_dom (côn trùng) đom đóm đuôi đèn lồng ·
       quai_soi_bang (thú) sói con lông trắng len xù · quai_bo_giap (rùa) bọ rùa vỏ đồng ngủ gật · quai_ma_lua (giọt) bé ma trùm chăn mỏng
   #61 boss_phuong_hoang (chim) phượng hoàng lông cam hoàng hôn, khăn quàng dài · #62 boss_bach_tuoc (thú) bạch tuộc tím cầm 8 que đan len

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## 5. Lời chữ `LOI_LOFI` (Claude viết vào `skin/loi.ts` khi dựng — Thùy sửa câu nào thì sửa ở đây trước)

Đè các khoá của `LoiHS`; logic / số liệu y hệt (chỉ đổi câu chữ). `giongGame: false` — trang Hướng dẫn chơi dùng bản formal (không múa giọng game).

| Khoá | Formal (gốc) | Game (RPG/Khối) | **Lo-fi** |
|---|---|---|---|
| `chieu` | Chưa đạt mức nào · Mức 1/3 · Mức 2/3 · Hoàn thành tốt 3/3 | Chiêu xịt… · Chiêu nhẹ · Chiêu mạnh · TUYỆT KỸ! | **Nút rối thắt thêm một chút · Gỡ được một nút · Gỡ được hai nút · Gỡ trọn cả ba** |
| `chieuChiTiet` | 2/3 câu đúng · tính 2 điểm · … | 2/3 câu đúng · −2 máu · … | **2/3 câu đúng · gỡ 2 nút · …** |
| `nhanCombo` | Chuỗi | Chiêu | **Nhịp** |
| `doiHinh` | Các nhóm câu hỏi | Đội hình | **Các bé đang rối** |
| `nhanBoss` · `nhanThuong` | CUỐI CHẶNG · NHÓM 1/4 | BOSS · ELITE 1/4 | **CUỘN RỐI LỚN · BÉ 1/4** |
| `moMan` | Bắt đầu: X | X xuất hiện! | **X đang rối — mình gỡ cùng nhé** |
| `huongDan` | Cứ 3 câu là một lượt tính… | Mỗi 3 câu tung 1 chiêu… | **Mỗi 3 câu là một nhịp — đúng cả 3 là gỡ trọn** |
| `con` · `daXong` · `hetDoiHinh` | Còn n điểm · Đã hoàn thành · Hoàn thành toàn bộ! | Còn n đòn · Đã bị hạ · Hạ hết đội hình! | **Còn n nút · Đã hết rối · Mọi thứ đã gọn gàng** |
| `yeu.tieuDe` · `hoi` · `nut` | Luyện dạng yếu · Em đã sẵn sàng…? · Bắt đầu luyện | Rèn lại điểm yếu · …đối đầu quái vật… · Vào trận! | **Góc ôn chỗ yếu · Pha một cốc trà rồi mình bắt đầu nhé? · Bắt đầu thong thả** |
| `yeu.dongLuat` | Mỗi lượt gồm n câu… Mục tiêu: đúng từ 7 câu. | Mỗi câu đúng là một đòn… | **Mỗi lượt n câu về những dạng em còn chưa chắc. Đúng từ 7 câu là lượt này trọn vẹn.** |
| `yeu.dongDau` · `dangYeu` | Hãy làm kỹ… · Các dạng em đang yếu nhất | Ra đòn nhanh… · Quái vật điểm yếu của em | **Cứ từ từ — lượt chỉ được tính khi em không bấm quá vội. · Những dạng em đang cần ôn** |
| `ketQua` | …được tính vào chuỗi và nhiệm vụ · Luyện tiếp · Về chặng đường · Về khu Học tập | …Đánh tiếp… | **Lượt này đã được ghi vào chuỗi và nhiệm vụ. · Làm thêm một lượt · Về con phố · Về góc Học tập** |

---

## 6. Hoạt họa — cách dựng (Claude làm, không đặt ChatGPT)

**Nguyên tắc chill:** mọi chuyển động chậm (chu kỳ ≥ 3 giây trừ khung viết), biên độ nhỏ, không đổi nhịp đột ngột; tắt hết khi máy bật
`prefers-reduced-motion`; dừng đồng hồ khi tab ẩn; tính khung theo **delta thời gian**, không đếm `requestAnimationFrame` (luật `Animation/ANIMATION.md`).
Tải đủ khung trước khi chạy (không nhấp nháy). Màn làm bài: **không** hoạt họa nền — bài thật cần tập trung.

| Lớp (dưới → trên) | Nguồn | Chuyển động |
|---|---|---|
| Trời | L2 #05/#06 (dải nối liền) | Trôi ngang 1 vòng / 180 giây, chỉ hiện qua lỗ cửa sổ |
| Phòng | L2 #01–#04 (phông xanh `#00FF00` khoét thành trong suốt — chroma key, làm mềm mép 1–2px) | Đứng yên. Nền `mua` / `san_thuong` không tách lớp ⇒ tranh tĩnh nguyên tấm |
| Hiệu ứng nền (code) | — | `mua`: giọt + vệt chảy trên kính (canvas, chỉ trong vùng cửa sổ) · chiều: bụi nắng trôi · đêm: đèn bàn "thở" 6 giây (quầng cam ±8%), 1–2 đom đóm / sao lấp lánh |
| Góc học | L1 #17/#18 làm khung gốc | **Ghép vùng:** mỗi khung L2 chỉ lấy VÙNG tay / đầu / đuôi (mặt nạ vẽ 1 lần) dán lên khung gốc ⇒ phần còn lại đứng im tuyệt đối. Kịch bản: viết 4 khung × 180 ms lặp 6–12 lần → nhấc bút → ngẩng lên nhìn cửa sổ 3–5 giây → (ngẫu nhiên) gật gù 2 giây → viết tiếp. Thân "thở" scale 1% / 4 giây |
| Mèo | L2 #12–#14 / #20–#22 | Đuôi 3 khung × 400 ms, nghỉ 2–6 giây giữa các lần vẫy · ngáp ngẫu nhiên 25–50 giây/lần |
| Cốc | L2 #26 | 2 làn hơi lệch pha, bay lên + mờ dần, 5 giây |
| Đêm | — | Góc học không vẽ bản đêm: phủ lớp màu chàm (multiply) + quầng cam quanh đèn bàn (screen) bằng code |
| Đúng câu (màn đấu) | L2 #24, #27 | Nốt nhạc kem bay lên nhẹ; cuộn len trên bé tinh linh nhỏ dần theo máu — không chớp đỏ, không rung màn |

Hợp đồng cần thêm (mục 7, bước 4): `Skin.homeSong?` — khai lớp + khung + mặt nạ + vị trí cửa sổ / đèn bàn theo từng nền. Style không khai ⇒ Home tĩnh như cũ (RPG, Khối không đổi gì).

---

## 7. Token + kế hoạch dựng code (Claude làm khi hình về)

**Token đề xuất** (`skin/styles/lofi.ts` — chỉnh lại theo #01/#02 được duyệt):

| Biến | Sáng (chiều) | Tối (đêm) |
|---|---|---|
| `font` · `fontHead` | `'Nunito'` · `'Nunito'` 800 | (chung) |
| `headCase` · `headTrack` · `radius` · `radiusPill` | `none` · `0` · `16px` · `999px` | (chung) |
| `blur` | `blur(10px)` | (chung) |
| `bg` · `nenTrong` | `#f4ead9` · `#f6efe3` | `#1d1b3a` · `#211e3d` |
| `surface` · `surface2` | `rgba(255,250,242,0.9)` · `rgba(214,190,160,0.22)` | `rgba(38,33,68,0.8)` · `rgba(255,176,102,0.1)` |
| `ink` · `muted` · `line` | `#3a2e28` · `#76655a` · `rgba(90,64,44,0.18)` | `#f2e8da` · `#b8aec6` · `rgba(255,214,170,0.16)` |
| `acc` · `accInk` | `#b4532e` · `#fffaf2` (≈4,6:1) | `#ffb066` · `#2a1d12` |
| `badge` · `badgeInk` | `#c25a36` · `#fffaf2` | `#ff9f6b` · `#2a1d12` |
| `cardBorder` · `cardShadow` | `1px solid rgba(90,64,44,0.14)` · `0 6px 18px rgba(80,55,30,0.10)` | `1px solid rgba(255,214,170,0.14)` · `0 8px 24px rgba(0,0,0,0.35)` |
| `theTiep` | giấy note `linear-gradient(180deg,#fbe2a8,#f4c987)`, chữ `#3a2e28` | **cần bản riêng** (lỗ ④) |
| `nenTen` | `rgba(255,250,242,0.85)` | **cần bản riêng** (lỗ ④) |
| `hinhNen` | `cua_so` (mặc định) · `mua` · `san_thuong` — mỗi cái đủ `sang` · `sangDoc` · `toi` · `toiDoc` | |
| `loi` · `dauThayIcon` | `LOI_LOFI` (mục 5) · `✿` | |

**Thứ tự dựng:**
1. `skin/kieu.ts`: `SkinId` thêm `'lofi'` · `skin/styles/lofi.ts` · `registry.ts` thêm vào `SKINS` (sau Khối vuông) · `hs.html` thêm `Nunito:wght@400;600;700;800`.
2. **Migration nới CHECK** `hs_giao_dien.skin` thêm `'lofi'` (giữ 6 giá trị đang có: `toi_gian · dau_truong · y2k · soft · rpg · khoi`), khuôn như
   `202610030147_hs_giao_dien_skin_khoi.sql`. Thùy áp bằng chuỗi GHI → `npm run schema` → deploy. Thiếu bước này ⇒ em chọn Lo-fi bấm Lưu là DB chặn.
3. Nén hình L1 theo bảng đổi tên (`public/bk-ui/hs/skin/lofi/`) · `npm run check:style-hs` ✔.
4. **Lỗ hợp đồng — style ẢNH đầu tiên có đủ 2 chế độ:** `theTiep` và `nenTen` hiện chỉ có 1 giá trị cho mọi chế độ (RPG chỉ tối, Khối chỉ sáng nên
   chưa lộ). Vá: cho phép `{ sang, toi }` (giữ kiểu cũ cho style 1 chế độ) + `bienCss()` chọn theo chế độ đang áp. Thêm `Skin.homeSong?` cho hoạt họa (mục 6).
5. L2 hoạt họa (sau khi có #17/#18 + L2) · L3 `hocTap` + `chinhPhuc` + `sanDau` (file sinh `lofiHocTap.ts` như `khoiHocTap.ts`) · L4 `banDo2d` + `quai2d`
   (`lofiBanDo2d.ts`) + bảng màu 3D `skin/the3d/bangMauLofi.ts` + `game` (nền menu / màn đấu / 5 icon).
6. Soi bằng mắt cả 2 chế độ: Home ngang + dọc · 1 màn danh sách · 1 màn làm bài · 1 màn rỗng · Học tập · bản đồ.
   Xem không cần đăng nhập: `hs.html?xem=gami&skin=lofi&man=home` (+ `&nen=mua|san_thuong`).

---

## Bảng đổi tên: file ChatGPT giao → file code (Claude làm, Thùy không cần làm)

| ChatGPT giao | Code dùng (`public/bk-ui/hs/skin/lofi/`) | Nén |
|---|---|---|
| L1 #01–#04 ảnh toàn cảnh | `design/handoff/hs-skin-lofi-v2/reference/*.jpg` (ảnh chuẩn, không vào app) | JPG q85 |
| `lofi_bg_<nền>_<chieu\|dem>_<ngang\|doc>` | `bg_<nền>_<chieu\|dem>_<ngang\|doc>.jpg` | JPG ~q80, ≤ 1672px |
| `lofi_nv_nam` · `lofi_nv_nu` | `nv_nam.png` · `nv_nu.png` | PNG 640×800 |
| `lofi_o_<ô>` | `o_<ô>.png` — `o_tren_lop` · `o_et` · `o_btvn` · `o_tu_luyen` · `o_nhiem_vu` · `o_rank` · `o_thong_tin` · `o_so_tay` · `o_thi_thu` · `o_bai_tap_giao` · `o_cup` · `o_xep_hang` · `o_may_man` · `o_vi_xu` · `o_hoc_tu_dau` · `o_the_gioi` · `o_thu_vien` · `o_tro_choi` | PNG 160px |
| `lofi_b_lich` · `lofi_b_kiem_tra_lai` | `b_lich.png` · `b_kiem_tra_lai.png` | PNG 160px |
| `lofi_tt_goc` · `lofi_tt_gach` | `corner.png` · `divider.png` | PNG 192px · 768×96 |
| L2 `lofi_lop_*` · `lofi_troi_*` | `song/phong_<giờ>_<khổ>.webp` (đã khoét) · `song/troi_<giờ>.jpg` | WebP / JPG q80 |
| L2 khung `lofi_nv_*_*` · `lofi_meo_*` | `song/<nam\|nu>/<động tác>_<i>.webp` (đã ghép vùng) | WebP 640×800 |
| L2 `lofi_fx_*` | `song/fx_<tên>.webp` | WebP 128–256px |
| L3 #02–#06 `lofi_o_*` | `o_hoc_chu_de.png` · `o_luyen_yeu.png` · `o_dau_truong.png` · `o_chinh_phuc.png` · `o_giai_vo_dich.png` | PNG 160px |
| L3 #07–#13 | `hoctap/nen_ngang.jpg` · `hoctap/nen_doc.jpg` · `hoctap/dao_<ô>.webp` (`goc_*` ⇒ `dao_*`) | JPG q82 · WebP 768² |
| L3 #15–#27 | `chinhphuc/nen.jpg` · `thap_tong.webp` · `thap_cd_<i>.webp` · `de_tong.webp` · `de_cd.webp` · `cau_sang.webp` | như Khối |
| L3 #28 | `dau_truong/nen_san_dau.jpg` | JPG 1600×574 |
| L4 `nen_the_gioi` · `dao_*` · `nen_vung_*` · `nen_dang_*` · `moc_*` · `be_da` · `may_suong` · `co_chinh_phuc` · `la_ban` | `phieuluu2d/` cùng tên như `khoi/phieuluu2d/` (`dao_<vùng>` ⇒ tên đảo theo `lofiBanDo2d.ts`) | nền JPG q82 1672×941 · mốc WebP 256² |
| L4 `quai_*` · `boss_*` | `quai/<loài>.webp` (như `khoi/quai/`) | WebP 512² |

Ô → icon (khai `anhO` trong `skin/styles/lofi.ts`): `giao_trinh → o_tren_lop` · `thanh_tuu → o_cup` · `xep_hang → o_xep_hang` ·
`tu_luyen_rieng → o_tu_luyen` · `de_thi_thu → o_thi_thu` · còn lại cùng tên ô.

---

## Ngoài phạm vi style — đề xuất riêng, CHỜ Thùy (không làm khi dựng style)

Style chỉ đổi hình / màu / chữ (luật đối xứng). Hai thứ dưới đây mới thật sự làm "học một mình cho chill" nhưng là **tính năng** — có thì mọi
style đều dùng được, nên phải Thùy quyết riêng:

1. **Nhạc nền + đồng hồ tập trung** (kỹ thuật *Pomodoro* 25 phút học / 5 phút nghỉ; spec-giao-dien-hs §6 đã ghi "hẹn giờ tập trung" ở P2).
   Lo-fi mà không có nhạc là mới được nửa. Cần: nguồn nhạc được phép dùng (nhạc không bản quyền / mua giấy phép — KHÔNG lấy từ kênh Lofi Girl),
   nút bật/tắt (mặc định TẮT — nhiều em học ở lớp / nơi công cộng). Style có thể khai `Skin.nhac?` (danh sách bài) như khai tranh nền.
2. **Ẩn bớt phần cạnh tranh theo lựa chọn của em** (Bảng xếp hạng, Đấu trường trên Home) — hợp gu em thích học một mình. Là quyết định
   sản phẩm (ảnh hưởng động lực / số liệu đo), không gắn vào style.
