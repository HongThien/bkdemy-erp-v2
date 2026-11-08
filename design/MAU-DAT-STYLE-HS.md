# QUY TRÌNH LÀM STYLE MỚI CHO APP HỌC SINH — Claude đọc file này

> **Khi nào đọc:** Thùy gửi **1 ảnh minh họa** + ý "làm style / giao diện / chủ đề mới cho app HS" (thường ở một worktree mới).
> **Việc của Claude:** đọc ảnh → đề xuất quyết định → Thùy chốt → **viết đơn đặt hàng ChatGPT** `design/DON-HANG-STYLE-<TEN>.md` (paste-ready) →
> khi hình về thì kiểm hàng → khi Thùy bảo thì dựng code. **Thùy chỉ làm 2 việc:** gửi ảnh, và mang đơn đi đặt ChatGPT.
> Viết 24/10 (Thùy: "tao chỉ cần gửi ảnh minh họa … claude đọc và tạo cho t một đơn hàng md rồi tao dùng file md đó để cho chat gpt làm"),
> rút từ 3 style đã làm trọn: Khối vuông (03/10) · Lo-fi chill (12/10) · Đáng yêu (13/10).

---

## 1. Đọc trước (theo thứ tự, đừng đọc DEVLOG)

1. `design/STYLE-HS.md` — luật style (§1 một style gồm gì · §2.5 lời chữ · §2.6 nền màn ngoài / màn trong · §2.7 2 chế độ + màn chính "sống" · §4 thêm style).
2. `src/screens/hocsinh/skin/kieu.ts` (hợp đồng `Skin` — mọi thứ đơn phải đặt đủ hình cho) + `skin/registry.ts` (style đang có — style mới phải KHÁC HẲN).
3. **Đơn mẫu đã chạy tốt nhất:** `design/DON-HANG-STYLE-NHO-XINH.md` (Đáng yêu — đọc khung đơn, đừng chép nội dung) + `design/DON-HANG-NHO-XINH-BO-SUNG.md`
   (khuôn đơn bổ sung) + `design/DON-HANG-NHO-XINH-DANH.md` (bộ đánh). Style có 2 chế độ sáng/tối: thêm `design/DON-HANG-STYLE-LOFI.md`.
4. `design/CHATGPT-UI-KIT.md` — chỉ để biết Thùy sẽ dán gì trước đơn (đơn của mình GHI ĐÈ phần giao hàng của kit).

---

## 2. Các bước

### Bước 1 — Đọc ảnh minh họa (Claude tự làm, không hỏi)
- **Nét vẽ:** 2D phẳng / màu nước / pixel / 3D mềm / tranh sơn…; độ dày + màu viền; cách tô; mức chi tiết.
- **Bảng màu:** đo màu thật trên ảnh bằng script (lấy cụm màu chủ đạo), đừng đoán bằng mắt. Ra mã hex cho: nền màn trong · thẻ · chữ chính · chữ phụ ·
  màu nhấn (nút chính) · badge · thẻ "Việc tiếp theo" · viền thẻ. **Kiểm tương phản:** chữ trắng trên màu nhấn ≥ 4,5:1, chữ chính trên thẻ ≥ 7:1
  (Đáng yêu: hồng dâu đẹp nhưng chỉ 2,6:1 ⇒ phải dùng hồng đậm).
- **Không khí + đối tượng:** em nào sẽ chọn style này (1 câu).
- **Bản quyền:** ảnh gợi tới tác phẩm nào ⇒ liệt kê ĐÍCH DANH nhân vật, đồ vật đặc trưng, logo, kiểu chữ logo bị CẤM (khuôn: khối CẤM trong
  PHONG CÁCH CHUNG của Đáng yêu). Giống ở **cách vẽ**, không giống ở **nhân vật**.

### Bước 2 — Đề xuất quyết định cho Thùy (trong chat, CHƯA viết đơn)
Bảng `# | Việc | Đề xuất | Vì sao`, mỗi dòng 1 quyết định — Thùy gõ "chốt cả" hoặc sửa từng số. Hỏi gọn bằng AskUserQuestion nếu chỉ 1–3 câu thật sự cần Thùy.

| # | Việc | Ghi chú khi đề xuất |
|---|---|---|
| 1 | **Tên trong app** (1–2 chữ tiếng Việt) + `id` (không dấu) | CẤM tên tác phẩm có bản quyền (vd "Chiikawa" ⇒ "Đáng yêu"); dòng phụ "giống: …" chỉ để so sánh |
| 2 | Dành cho ai | 1 câu, để Thùy thấy style này bù chỗ trống nào so với các style đang có |
| 3 | **Chế độ:** chỉ sáng / chỉ tối / cả hai | Cả hai ⇒ nền vẽ 2 bản (đơn dài thêm ~6 hình), nhân vật bản tối Claude tự làm bằng code |
| 4 | **2 nhân vật** nam / nữ: người hay linh vật; tư thế gốc; **món đồ luôn cầm** (= vũ khí khi đánh) | Không gán màu theo giới tính; không giống nhân vật trong danh sách CẤM |
| 5 | **3 tranh nền** (id + mô tả, cái nào mặc định) | Phải khác nhau rõ từ xa; nền mặc định giống không khí ảnh minh họa nhất |
| 6 | **Ẩn dụ phiêu lưu:** giữ "đi đánh quái" hay đổi | Lo-fi đổi thành "gỡ rối cho bé tinh linh"; Đáng yêu giữ, đổi giọng "bốp" |
| 7 | **Font** tiêu đề + chữ thường | Google Fonts, PHẢI có bộ tiếng Việt (kiểm `subset=vietnamese` thật); chữ thường đọc đề Toán thoải mái |
| 8 | Màn chính "sống": nhân vật làm gì khi rảnh (2 khung "hành động riêng") | vd ăn bánh, uống trà, lật sách |
| 9 | Quan hệ với style đang có (thêm song song / thay) | Mặc định: thêm song song |

### Bước 3 — Viết đơn `design/DON-HANG-STYLE-<TEN>.md` theo KHUÔN ĐƠN (mục 4)
- Tên file theo tên LÀM VIỆC viết hoa không dấu (vd `DON-HANG-STYLE-LOFI.md`); mã nhóm đơn = 1 chữ cái riêng của style (Lo-fi `L`, Đáng yêu `N`) ⇒ `<X>1…<X>5`.
- **Mọi mô tả phải CỤ THỂ** cho style này: từng icon là đồ vật gì, màu gì · từng quái trông ra sao · 8 tháp làm bằng chất liệu gì · 10 đảo có gì.
  Không để chỗ "<…>" nào cho ChatGPT tự nghĩ — ChatGPT tự nghĩ là trôi nét và bịa.
- Khối đơn dán cho ChatGPT nằm trong ``` ``` để Thùy copy 1 phát. Ngoài khối = ghi chú cho Thùy (cách gửi, đính kèm gì).
- **Đính kèm** ghi đủ đường dẫn: ảnh minh họa (Claude lưu vào `design/handoff/hs-skin-<id>-v1/reference/khong_khi_<id>.<đuôi>`) · ảnh bố cục
  `design/handoff/hs-skin-khoi-v1/reference/bo_cuc_home_ipad.jpg` · `bo_cuc_home_dt.jpg` · `bo_cuc_nhiem_vu_ipad.jpg` · bố cục học tập / sân đấu /
  nền dạng (đường dẫn ở mục 4) · từ Đơn 2 trở đi: hình đã duyệt của Đơn 1 làm mẫu nét.
- Kèm trong đơn: mục **Lời chữ `LOI_<ID>`** (bảng câu formal → câu của style), mục **Token + kế hoạch dựng code**, **Bảng đổi tên** file giao → file code.

### Bước 4 — Báo Thùy
Đường dẫn đơn + cách gửi tóm 3 dòng: mỗi Đơn = 1 cuộc chat ChatGPT mới · dán `CHATGPT-UI-KIT.md` → khối PHONG CÁCH CHUNG → khối Đơn · ảnh `*` vẽ xong
phải duyệt mới gõ "tiếp" · tải hình về `design/bk-ui-src/<id>/` của clone giữ ảnh, không cần đổi tên.

### Bước 5 — Hình về: kiểm hàng
- Hình về **tên mặc định** ⇒ nhận diện **bằng mắt** (tấm ghép), không gán theo giờ tải / thứ tự. Đo: 4 góc trong suốt · cỡ ảnh · nền dạng: dải 72–76% có phải
  mặt đường liền từ trái sang phải · tư thế: cùng khung, cỡ thân lệch ≤ ~12% · không lọt chữ.
- Đổi tên + chuyển vào `design/bk-ui-src/<id>/{,hoat-hoa,hoc-tap,phieu-luu,danh}/`, ghi sổ `_doi_ten.log.txt` (hoàn tác được), thêm thư mục vào `.gitignore`
  (ảnh gốc hàng trăm MB, Thùy cất Drive). File trùng ⇒ cất `_thua/`, KHÔNG xoá (Luật xoá).
- Ghi **bảng kiểm hàng** ở ĐẦU file đơn (Đơn | dùng được | phải bổ sung | ghi chú). Hình hỏng ⇒ đơn bổ sung `DON-HANG-<TEN>-BO-SUNG.md` theo khuôn
  `DON-HANG-NHO-XINH-BO-SUNG.md` (mã `<X>B01…`, mỗi nhóm nói vì sao hỏng + đính hình cũ + hình mẫu ĐÃ ĐÚNG). Bản vẽ lại để cạnh bản cũ tên `_v2`.

### Bước 6 — Dựng code (CHỈ khi Thùy bảo)
1. Copy khuôn `scripts/halloween-hinh.mjs` (mới nhất, có bộ đánh + đế riêng; `scripts/dang-yeu-hinh.mjs` cho style tách cỏ khỏi hình gốc) → `scripts/<id>-hinh.mjs` (nén vào `public/bk-ui/hs/skin/<id>/`, ưu tiên `_v2`, sinh `styles/<id>HocTap.ts` +
   `<id>Song.ts`). Đế nhân vật là lớp RIÊNG trong đơn ⇒ khỏi tách cỏ bằng vùng điểm ảnh liền như Đáng yêu.
2. `skin/styles/<id>.ts` + `<id>BanDo2d.ts` + `the3d/bangMau<Id>.ts` · `LOI_<ID>` trong `skin/loi.ts` · `SkinId` (`kieu.ts`) · `SKINS` (`registry.ts`) ·
   font vào **cả `hs.html` lẫn `index.html`** (vỏ ERP mượn style HS).
3. **Migration nới CHECK `hs_giao_dien.skin`**: đọc danh sách đang có từ DB (role `claude_ro`), giữ hết, thêm id mới — thiếu là em bấm Lưu bị chặn.
   Thùy tự áp; áp xong `npm run schema`, commit `schema.md`.
4. Bộ đánh (Đơn 5): hợp đồng `Skin.dau` (`BoDau` ở `skin/kieu.ts`) — **ĐÃ DỰNG lần đầu với Halloween 25/10**: script đo neo + sinh `styles/<id>Dau.ts` (khuôn phần 5 của `scripts/halloween-hinh.mjs`), style khai `dau`, xong — không sửa màn nào.
5. Kiểm: `npm run check:style-hs` · `npx tsc --noEmit` · `npm run build:hs` · soi bằng trình duyệt `hs.html?xem=gami&skin=<id>&man=home` (ngang 1180×820 + dọc 430×900,
   mọi nền, cả 2 chế độ nếu có) · `?xem=hoc_tap&skin=<id>` · `?xem=phieu_luu&skin=<id>` (+ `&tang=luc_dia&luc=C` · `&tang=chang&luc=C&vung=C1` ·
   `&tang=dau&luc=C&vung=C1`). **Màn thế giới soi với tên chủ đề DÀI THẬT (khối 9)** — xếp cột đảo so le cao/thấp như Đáng yêu, đừng 5 đảo cùng tầm cao.
6. Ghi khối "ĐÃ DỰNG CODE" ở đầu file đơn + `design/STYLE-HS.md` + `spec-giao-dien-hs.md` + `DEVLOG.md`. Commit / đẩy / PR / `thu-nghiem` chỉ khi Thùy bảo.

---

## 3. Bài học đã trả giá (đưa thẳng vào luật đơn, đừng để ChatGPT tự đoán)

- **1 hình / lượt**, dòng đầu ghi mã + tên; KHÔNG zip, KHÔNG DESIGN.md, KHÔNG dựng hình bằng code, KHÔNG cắt từ ảnh toàn cảnh (ghi đè Pha C/D của kit).
- **"Trong suốt" phải là alpha thật** — ChatGPT hay vẽ nền kem, ô caro giả, bãi cỏ dưới chân. Ghi rõ "4 góc trống hoàn toàn".
- **Nền màn dạng bài hỏng ở CẢ 2 style trước** (Lo-fi 6/10, Đáng yêu 9/10): chữ "đường ngang ở 74%" KHÔNG đủ ⇒ đơn phải có SƠ ĐỒ dải + 8 luật bố cục
  (khối nhóm C của `DON-HANG-NHO-XINH-BO-SUNG.md`) + đính ảnh mẫu bố cục `public/bk-ui/hs/skin/khoi/phieuluu2d/nen_dang_rung.jpg` ngay từ đơn đầu.
- **Nhóm cuối danh sách trôi nét** (quái mở rộng của Đáng yêu: viền mảnh, màu loang, dính nền) ⇒ trước nhóm cuối nhắc ChatGPT nhìn lại hình đầu đã duyệt.
- **Tư thế:** cùng khung, cùng cỡ thân, cùng chỗ chân; đế / cỏ dưới chân vẽ RIÊNG 1 hình; hay thiếu 1 tư thế (cánh cụt thiếu chớp mắt) ⇒ đếm đủ.
- **Bộ đánh** (15 tư thế × 2 + 5 hiệu ứng) phải nằm trong đơn từ đầu — Đáng yêu quên, vào trận vẫn là nhân vật anime.
- **Tên file cố định theo code** (`o_tren_lop`, `nen_dang_<vùng>`, `quai_<loài>`…): 10 vùng và 20 loài quái là mã DB gán sẵn, chỉ đổi nét vẽ.
- Nền NGANG ChatGPT hay giao tỉ lệ iPad 1505×1045 thay vì 1672×941 — nhận được nếu vùng bị xén ít chi tiết.

---

## 4. KHUÔN ĐƠN — bộ hình đầy đủ của 1 style (Claude điền CỤ THỂ rồi chép vào đơn)

Chia 5 đơn, mỗi đơn 1 cuộc chat ChatGPT. Mã `*` = ảnh toàn cảnh, vẽ xong DỪNG chờ Thùy duyệt. Thứ tự ưu tiên: Đơn 1 là đủ để style lên app
(thiếu đơn sau thì app tạm dùng hình chung, không vỡ).

### Khối PHONG CÁCH CHUNG (dán kèm MỌI đơn) — điền theo kết quả Bước 1–2
`MỤC TIÊU · Nét vẽ · Sinh vật / Nhân vật · Nền · Bảng màu (hex) · Đồ vật · ĐƯỢC giống · CẤM (bản quyền — có 1 thứ là hỏng cả hình) · Thẻ · Nút · Chữ · Thiết bị
(iPad NGANG 1180×820 trước + điện thoại DỌC 430px) · CẤM thêm (khẩu hiệu, chữ trang trí tiếng Anh/Nhật, máu me)` + nguyên khối **CÁCH GIAO HÀNG** (chép từ
Đáng yêu: 1 hình/lượt · ảnh vẽ ra LÀ file giao · hình cùng họ vẽ dựa trên hình đã duyệt, giữ độ dày nét / màu viền / cách tô / bảng màu).

### Đơn 1 — Màn chính + bộ hình (≈ 40 hình; ×2 nền nếu có chế độ tối)
- **A. Toàn cảnh:** `man_chinh_ipad*` (ngang, nền mặc định, nhân vật nam — bố cục chép nguyên phần "MÀN CHÍNH khổ NGANG" của Đơn N1 Đáng yêu: tấm tên,
  nút góc phải, cột trái ≈32% nhân vật + bong bóng thoại, cột phải chào + HỌC TẬP + lưới ô 4 cột + GIẢI TRÍ) → DỪNG · `man_chinh_dt` (dọc, nhân vật nữ) ·
  `nhiem_vu_ipad` (màn trong, nền đơn sắc — chốt dáng thẻ / nút / thanh tiến độ) · `lam_bai_ipad` (nền trơn, KHÔNG nhân vật, KHÔNG trang trí).
- **B. Nền:** 3 nền × `_ngang` 1672×941 + `_doc` 941×1672, nền đặc, không nhân vật, không chữ. Ngang: vật nổi bật dồn TRÁI + 2 góc, **65% bên PHẢI sáng / ít chi
  tiết** (đặt thẻ). Dọc: vật nổi bật 35% TRÊN, 65% DƯỚI phẳng. Có chế độ tối ⇒ thêm bản `_toi` cùng bố cục.
- **C. Nhân vật đứng:** `nv_nam` · `nv_nu` — dọc 1122×1402, trong suốt, toàn thân, chân sát mép dưới, thân ~80% bề ngang khung.
- **E. Icon ô** — vuông 1254×1254, trong suốt, 1 đồ vật giữa ~80%, cả bộ cùng nét như 1 trang sticker, mỗi ô 1 đồ vật KHÁC nhau (Claude chọn đồ vật hợp
  style, nhìn là đoán chức năng): `o_tren_lop` · `o_et` · `o_btvn` · `o_tu_luyen` (ô "Học tập") · `o_nhiem_vu` · `o_rank` · `o_thong_tin` · `o_so_tay` ·
  `o_thi_thu` (tông XÁM + ổ khoá) · `o_bai_tap_giao` · `o_cup` · `o_xep_hang` · `o_may_man` · `o_vi_xu` · `o_hoc_tu_dau` · `o_the_gioi` · `o_thu_vien` ·
  `o_tro_choi` · banner `b_lich` · `b_kiem_tra_lai` · trang trí `tt_gach` (1672×200) · `tt_goc` (ôm góc trên-trái — kiểm: hình góc của Đáng yêu về thành
  bụi cây đứng, không ôm góc ⇒ không dùng được).

### Đơn 2 — Hoạt họa màn chính (≈ 20 hình, CÙNG cuộc chat với Đơn 1 sau khi C được duyệt)
Mỗi nhân vật 9 tư thế + 1 đế, cùng khung 1122×1402, cùng cỡ thân, chân đúng chỗ cũ, **KHÔNG vẽ đế / cỏ** trong 9 tư thế:
`<g>_chop_mat` · `<g>_vay_1` · `<g>_vay_2` · `<g>_vui` · `<g>_mung_khoc` · `<g>_lo` · `<g>_ngu` · `<g>_an_1` · `<g>_an_2` (2 khung hành động riêng — quyết định #8) ·
`de_<g>` (CHỈ đế / cỏ dưới chân, đúng vị trí trong khung) — `<g>` = `nam` / `nu`. + 6 vật hiệu ứng nhỏ `fx_*` 512×512 trong suốt hợp không khí style.

### Đơn 3 — Khu HỌC TẬP (≈ 28 hình) — chép khung Đơn N3 của Đáng yêu, đổi "gò cỏ" thành khối nổi của style
`hoc_tap_ipad*` (5 khối: (1) to nhất giữa · (3) trái-trên · (4) phải-trên · (2) trái-dưới · (5) phải-dưới, ≈12% trên trống) · 5 icon `o_hoc_chu_de` `o_luyen_yeu`
`o_dau_truong` `o_chinh_phuc` `o_giai_vo_dich` · `ht_nen_ngang` / `ht_nen_doc` · 5 khối `dao_*` 1024² trong suốt · `chinh_phuc_ipad*` · `cp_nen` · `thap_tong`
1024×1536 chân chạm đáy · 8 `thap_cd_1…8` (mỗi tháp 1 chất liệu — Claude chọn 8 chất liệu hợp style) · `de_tong` · `de_cd` · `cau` 2048×1024 ·
`nen_san_dau` 2400×860 (mặt sân phẳng từ ≈62% cao, giữa 25–75% ngang thoáng, chỗ đứng trái 15% / phải 85% ở ≈78% cao).
Đính bố cục: `design/bk-ui-src/AppHS/hs-hoc-tap-v2/reference/reference_hoc_tap.png` · `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png`.

### Đơn 4 — Bản đồ phiêu lưu + quái (≈ 62 hình) — chép khung Đơn N4 của Đáng yêu
10 vùng CỐ ĐỊNH (giữ nghĩa, vẽ theo style): `rung` · `bang` · `nui_lua` · `bien_dao` · `anh_dao` · `sa_mac` · `dam_lay` · `thanh_co` · `troi_sao` · `dong_gio`.
`ban_do_ipad*` · `nen_the_gioi` · 10 `dao_<vùng>` 1024² trong suốt · 10 `nen_vung_<vùng>` (nhìn chéo từ trên, vật dồn ra MÉP, giữa trống, không đường vẽ sẵn) ·
10 `nen_dang_<vùng>` (**sơ đồ dải bắt buộc** — chép khối nhóm C của `DON-HANG-NHO-XINH-BO-SUNG.md` + đính `khoi/phieuluu2d/nen_dang_rung.jpg`) ·
6 mốc `moc_thanh` `moc_thap` `moc_trai` `moc_den` `moc_cong` `moc_cau` + `be_da` `may_suong` `co_chinh_phuc` `la_ban` (512² trong suốt) ·
16 quái + 4 boss, vuông 1254² trong suốt, **giữ dáng cơ thể** (code dùng dáng để diễn): `quai_slime_la` (giọt) · `quai_slime_lua` (giọt) · `quai_meo_bang` (thú) ·
`quai_rua_da` (rùa) · `quai_cu_dem` (chim) · `quai_ca_bong` (cá) · `quai_nam_ma` (nấm) · `quai_chim_set` (chim) · `quai_tho_gio` (thú) · `quai_be_nham` (người đá) ·
`quai_sao_bien` (sao) · `quai_ech_doc` (giọt) · `quai_dom_dom` (côn trùng) · `quai_soi_bang` (thú) · `quai_bo_giap` (rùa) · `quai_ma_lua` (giọt) ·
`boss_rong_con` (giọt) · `boss_golem_pha_le` (người đá) · `boss_phuong_hoang` (chim) · `boss_bach_tuoc` (thú). Nhắc nhìn lại quái đầu đã duyệt trước nhóm cuối.

### Đơn 5 — Bộ đánh (35 hình) — chép nguyên khung `design/DON-HANG-NHO-XINH-DANH.md`
Vuông 1254², trong suốt, nhân vật quay 3/4 sang PHẢI, thân đứng ~50% cao khung, vạch đất 88%, cỡ thân giữ nguyên mọi tư thế, đánh bằng món đồ luôn cầm
(quyết định #4), không vẽ vật bay / tia sáng: 15 tư thế × 2 (`dung_1` `dung_2` `suy_nghi` `tich_nang_1` `tich_nang_2` `niem_troi_1` `niem_troi_2` `nem_truoc_1`
`nem_truoc_2` `phat_nho` `bi_danh_1` `bi_danh_2` `guc` `thang_1` `thang_2`) + 5 hiệu ứng `fx_cau_lua` `fx_cau_bang` (1774×887, vật ở 82% ngang, đuôi sang trái) ·
`fx_thien_thach` (1254², vật ở góc dưới-phải 78%/78%) · `fx_dan_ma` (đòn của quái) · `fx_bang_boc` (1122×1402, lớp bọc rỗng nhốt quái). Mở đầu bằng 1 ảnh
toàn cảnh màn đấu để duyệt.
