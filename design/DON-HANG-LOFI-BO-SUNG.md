# Đơn BỔ SUNG ChatGPT — Lo-fi chill: vẽ lại 41 hình chưa đạt

> ✅✅ **XONG 12/10: đủ 41/41, tất cả ĐẠT** (BS32 golem về lượt 2). File này không còn gì phải gửi.
>
> ✅ **KIỂM 12/10 (lượt 1): về 40/41, cả 40 ĐẠT** (đã thêm bản `_v2` vào `lofi/hoc-tap/` · `lofi/phieu-luu/` · `lofi/hoat-hoa/`, bản cũ giữ nguyên).
> **CÒN ĐÚNG 1 HÌNH: BS32 `boss_golem_pha_le`** — gửi lại trong context nhóm B: đính kèm `lofi/phieu-luu/l4_32_boss_golem_pha_le.png` (hình cũ) +
> `lofi/phieu-luu/l4_31_boss_rong_con_v2.png` (boss rồng con vừa vẽ đúng — mẫu nét), gõ `BS32`. Context mất thì dán thêm khối đơn nhóm B bên dưới.

> **Soạn 11/10/2026** sau kiểm hàng 157 hình (bảng kiểm ở đầu `design/DON-HANG-STYLE-LOFI.md`). 116 hình đã dùng được — file này CHỈ gồm 41 hình phải làm lại:
>
> | Nhóm | Số hình | Lỗi | Thư mục hình cũ |
> |---|---|---|---|
> | **A** — khu Học tập (L3) | 21 | 20 hình dính nền (trời mây / nền kem / nền trắng) · 1 góc nhỏ vừa dính nền vừa sai bố cục | `design/bk-ui-src/lofi/hoc-tap/` |
> | **B** — đảo + bé tinh linh + boss (L4) | 13 | dính nền (cảnh / nền kem / nền đen / nền tím) + 3 nét vẽ khác nhau | `design/bk-ui-src/lofi/phieu-luu/` |
> | **C** — nền màn dạng bài (L4) | 6 | không có mặt đường ngang cho nhân vật đứng | `design/bk-ui-src/lofi/phieu-luu/` |
> | **D** — hoạt họa (L2) | 1 | khung khác cỡ, không chồng khít | `design/bk-ui-src/lofi/hoat-hoa/` |
>
> Mã hình **BS01…BS41** chỉ để theo dõi; tên file giữ đúng tên cũ để Claude thay vào đúng chỗ.

---

## Cách gửi

**Mỗi nhóm = 1 context ChatGPT.** Nếu context cũ đã vẽ đơn đó còn mở ⇒ dùng lại context đó (ChatGPT còn nhớ nét), chỉ cần dán khối đơn của nhóm.
Context cũ mất ⇒ mở context MỚI, dán theo thứ tự: `design/CHATGPT-UI-KIT.md` → khối **PHONG CÁCH CHUNG — LO-FI CHILL** (trong `DON-HANG-STYLE-LOFI.md`)
→ khối đơn của nhóm → đính kèm **ảnh mẫu của nhóm** (ghi ở đầu mỗi nhóm).

**Mỗi lượt:** đính kèm **đúng 1 hình cũ** (tên file ghi cạnh mã BS) + gõ **mã hình**, vd `BS07`. ChatGPT vẽ xong 1 hình thì dừng; tải về rồi gửi hình kế.
Nhóm A và B là **giữ nguyên hình, chỉ bỏ nền** ⇒ luôn đính kèm hình cũ để ChatGPT sửa đúng hình đó, không tự vẽ cái mới.

**Tải về** vào `design/bk-ui-src/lofi/bo-sung/` (không cần đổi tên — Claude nhận diện bằng mắt). Xong nhóm nào báo Claude kiểm nhóm đó.

**Tự kiểm nhanh trước khi tải (đỡ một vòng trả hàng):** hình nền trong suốt mà mở ra vẫn thấy trời / nền màu / ô caro vẽ giả ⇒ gõ
"nền chưa trong suốt, làm lại" ngay trong lượt đó.

---

## Nhóm A — khu Học tập: 21 hình (bỏ nền)

**Ảnh mẫu đính kèm 1 lần đầu context:**
- `lofi/hoc-tap/l3_18_thap_cd_2.png` — tháp ĐÃ ĐÚNG (nền trong suốt, chân chạm đáy) ⇒ mẫu cho các tháp.
- `lofi/lofi_o_tren_lop.png` + `lofi/lofi_o_so_tay.png` — 2 icon L1 đã đúng ⇒ mẫu cho 5 icon.
- `lofi/hoc-tap/l3_01_lofi_hoc_tap_ipad.png` — ảnh toàn cảnh đã duyệt ⇒ mẫu dáng "góc nhỏ lơ lửng" (dùng cho BS10).

```
ĐƠN BỔ SUNG — NHÓM A (khu Học tập, style "Lo-fi chill")
Các hình tôi gửi dưới đây đã vẽ ĐẸP nhưng bị DÍNH NỀN. Việc của bạn với MỖI hình: giữ NGUYÊN vật trong hình (hình dáng, màu, chi tiết,
ánh đèn, dây leo — không vẽ lại kiểu khác, không thêm bớt), chỉ XOÁ NỀN thành TRONG SUỐT THẬT.

LUẬT CHUNG:
- Mỗi lượt tôi gửi 1 hình cũ + 1 mã (BS01…). Bạn trả ĐÚNG 1 HÌNH PNG, dòng đầu ghi mã + tên file. Xong dừng, chờ hình kế.
- NỀN TRONG SUỐT THẬT (kênh alpha): KHÔNG trời, KHÔNG mây, KHÔNG nền kem / trắng / xám, KHÔNG ô caro vẽ giả, KHÔNG mặt đất,
  KHÔNG bóng đổ ra nền, KHÔNG quầng sáng lan ra ngoài vật. 4 góc ảnh phải trống hoàn toàn.
- Chừa lề trong suốt quanh vật (vật không chạm mép ảnh, trừ chỗ ghi "chạm đáy").
- KHÔNG chữ, số, logo. Giữ đúng kích thước ghi ở từng hình.

DANH SÁCH:
5 ICON Ô — vuông 1254×1254, vật ở giữa ~80% khung, CHỈ đồ vật (bỏ mặt bàn, bỏ bóng dài dưới chân), cùng nét với 2 icon mẫu đính kèm:
   BS01 lofi_o_hoc_chu_de    — quả địa cầu để bàn chân gỗ
   BS02 lofi_o_luyen_yeu     — bình tưới đang tưới chậu cây non
   BS03 lofi_o_dau_truong    — bàn cờ mini + 2 quân cờ (1 kem, 1 nâu)
   BS04 lofi_o_chinh_phuc    — chồng sách cao như tháp, lá cờ nhỏ trên đỉnh
   BS05 lofi_o_giai_vo_dich  — huy chương vàng ngôi sao, ruy băng đỏ đất

4 GÓC NHỎ LƠ LỬNG — vuông 1254×1254, góc nhỏ nằm giữa ảnh, giữ nguyên khối đất nổi + rễ + dây đèn bên dưới, BỎ trời mây + mặt trời:
   BS06 goc_hoc_chu_de   — căn gác thư viện có quả địa cầu
   BS07 goc_luyen_yeu    — nhà kính nhỏ đầy chậu cây
   BS08 goc_dau_truong   — quán cà phê nhỏ có bàn cờ
   BS09 goc_chinh_phuc   — tháp sách xoắn ốc

1 GÓC NHỎ VẼ LẠI BỐ CỤC:
   BS10 goc_giai_vo_dich — hình cũ SAI: là cảnh sân khấu nhìn ngang. VẼ LẠI thành GÓC NHỎ LƠ LỬNG cùng kiểu BS06–BS09 (xem ảnh toàn cảnh
        đính kèm: góc dưới-phải): 1 khối đất nổi nhìn chéo từ trên, đáy đất có rễ + dây đèn rủ; trên mặt là SÂN KHẤU NHỎ ngoài trời —
        bục 3 bậc gỗ, CÚP VÀNG ở bậc giữa, thảm đỏ đất, dây đèn + cờ giấy tam giác phía trên, vài chậu cây. Giữ màu + chi tiết của hình cũ.
        Vuông 1254×1254, nền trong suốt.

8 THÁP — đứng 1024×1536, CHỈ tháp, CHÂN THÁP CHẠM ĐÁY ảnh, đỉnh cách mép trên một chút, như tháp mẫu đính kèm:
   BS11 thap_tong   — tháp thư viện nhiều tầng, cửa sổ vàng ấm, đỉnh có đèn (tháp to nhất)
   BS12 thap_cd_1   — tháp đá gạch phủ thường xuân (hình cũ nền TRẮNG)
   BS13 thap_cd_3   — tháp nhà kính khung sắt nhiều tầng (hình cũ nền KEM)
   BS14 thap_cd_4   — tháp đồng hồ đá xám
   BS15 thap_cd_5   — hải đăng trắng sọc cam đất
   BS16 thap_cd_6   — tháp nước gỗ có thang
   BS17 thap_cd_7   — tháp tre treo đèn lồng giấy
   BS18 thap_cd_8   — đài thiên văn mái vòm

2 ĐẾ ĐẢO + 1 CẦU:
   BS19 de_tong — ngang 1536×1024. CHỈ 1 đảo đất nổi lớn: mặt cỏ PHẲNG rộng ở khoảng giữa ngang · 35% chiều cao; đáy đất có rễ + dây đèn.
        BỎ trời, BỎ mây, BỎ các đảo nhỏ bay xung quanh.
   BS20 de_cd   — vuông 1254×1254. CHỈ 1 đảo đất nổi nhỏ cùng kiểu, mặt cỏ phẳng ở khoảng giữa ngang · 40% chiều cao. BỎ trời, mây, đảo nhỏ.
   BS21 cau     — ngang 1774×887. CHỈ cây cầu treo gỗ + dây thừng + dây đèn, nhìn ngang, 2 đầu cầu ở sát mép TRÁI và mép PHẢI ảnh.
        BỎ 2 vách đá hai đầu, BỎ trời mây.
```

| Mã | Đính kèm hình cũ (`design/bk-ui-src/lofi/hoc-tap/`) |
|---|---|
| BS01–BS05 | `l3_02_lofi_o_hoc_chu_de` · `l3_03_lofi_o_luyen_yeu` · `l3_04_lofi_o_dau_truong` · `l3_05_lofi_o_chinh_phuc` · `l3_06_lofi_o_giai_vo_dich` |
| BS06–BS09 | `l3_09_goc_hoc_chu_de` · `l3_10_goc_luyen_yeu` · `l3_11_goc_dau_truong` · `l3_12_goc_chinh_phuc` |
| BS10 | `l3_13_goc_giai_vo_dich` |
| BS11–BS18 | `l3_16_thap_tong` · `l3_17_thap_cd_1` · `l3_19_thap_cd_3` · `l3_20_thap_cd_4` · `l3_21_thap_cd_5` · `l3_22_thap_cd_6` · `l3_23_thap_cd_7` · `l3_24_thap_cd_8` |
| BS19–BS21 | `l3_25_de_tong` · `l3_26_de_cd` · `l3_27_cau` |

---

## Nhóm B — đảo + bé tinh linh + boss: 13 hình (bỏ nền, về cùng một nét)

**Ảnh mẫu đính kèm 1 lần đầu context** (3 bé ĐÃ ĐÚNG — nét chuẩn cho cả nhóm):
`lofi/phieu-luu/l4_53_quai_tho_gio.png` · `l4_56_quai_ech_doc.png` · `l4_57_quai_dom_dom.png` · và 1 đảo đã đúng `l4_03_dao_rung.png`.

```
ĐƠN BỔ SUNG — NHÓM B (bản đồ phiêu lưu, style "Lo-fi chill")
3 bé tinh linh đính kèm (thỏ khăn xanh, ếch áo mưa, đom đóm đèn lồng) là NÉT CHUẨN: sinh vật nhỏ tròn dễ thương, lông / da mềm, mắt to long lanh,
má hồng, ánh sáng ấm, nền TRONG SUỐT, chỉ có con vật. Các hình dưới phải về ĐÚNG nét đó.

LUẬT CHUNG:
- Mỗi lượt tôi gửi 1 hình cũ + 1 mã (BS22…). Bạn trả ĐÚNG 1 HÌNH PNG, dòng đầu ghi mã + tên file. Xong dừng, chờ hình kế.
- Vuông 1254×1254, NỀN TRONG SUỐT THẬT (kênh alpha): KHÔNG cảnh, KHÔNG nền màu, KHÔNG nền đen, KHÔNG mặt đất, KHÔNG bóng đổ ra nền,
  KHÔNG quầng sáng / tia lửa / bong bóng bay xa khỏi thân. 4 góc ảnh trống hoàn toàn.
- CHỈ con vật, TOÀN THÂN, ở giữa khung ~75%, quay 3/4 về người xem, không chạm mép ảnh.
- Dễ thương, hiền, KHÔNG đáng sợ. KHÔNG chữ, số, logo.

DANH SÁCH:
1 ĐẢO:
   BS22 dao_dong_gio — giữ NGUYÊN đảo đã vẽ (đồng cỏ, cối xay gió, khinh khí cầu nhỏ, đài phun nước), chỉ BỎ nền tím + mây phía sau.
        Đảo nằm gọn giữa khung 1254×1254 như đảo rừng mẫu đính kèm.

8 BÉ TINH LINH — hình cũ vẽ thành tranh có cảnh. GIỮ ĐÚNG con vật trong hình (loài, màu, phụ kiện), BỎ toàn bộ cảnh, vẽ đủ toàn thân theo nét chuẩn:
   BS23 quai_slime_la   — giọt sương xanh lá trong, che 1 chiếc lá to như ô
   BS24 quai_slime_lua  — giọt sáp nến cam, bấc nhỏ trên đầu
   BS25 quai_meo_bang   — mèo con lông xanh băng, khăn len xanh trắng
   BS26 quai_rua_da     — rùa con mai rêu, trên lưng có chậu cây nhỏ
   BS27 quai_cu_dem     — cú tròn đội mũ ngủ xanh sao, mắt lim dim
   BS28 quai_ca_bong    — cá nóc tròn vàng kem, gai mềm, mắt to
   BS29 quai_nam_ma     — nấm nhỏ mũ nâu chấm phát sáng, ngái ngủ
   BS30 quai_chim_set   — chim sẻ vàng lông đầu dựng đứng vì tĩnh điện

4 BOSS — cùng nét chuẩn nhưng TO, tròn, oai hơn một chút; vẫn dễ thương:
   BS31 boss_rong_con      — hình cũ là tranh phẳng nền kem ⇒ VẼ LẠI theo nét chuẩn: rồng con xanh ngọc, sừng vàng nhỏ, quấn chăn kẻ ô,
        ôm gối, vẻ buồn ngủ; 1 cuộn len hồng đất rối quấn quanh người.
   BS32 boss_golem_pha_le  — hình cũ là tranh phẳng nền kem ⇒ VẼ LẠI theo nét chuẩn: người đá cuội tròn, vài mảnh pha lê trên vai,
        ôm chồng sách; 1 cuộn len hồng đất rối quấn quanh người.
   BS33 boss_phuong_hoang  — giữ con phượng hoàng con lông cam đã vẽ, BỎ nền đen; lửa ở đuôi + cánh gọn sát thân (không tia lửa bay xa).
   BS34 boss_bach_tuoc     — giữ con bạch tuộc tím đội vương miện cầm que đan đã vẽ, BỎ nền đen; các cuộn len nằm sát thân.
```

| Mã | Đính kèm hình cũ (`design/bk-ui-src/lofi/phieu-luu/`) |
|---|---|
| BS22 | `l4_12_dao_dong_gio` |
| BS23–BS30 | `l4_23_quai_slime_la` · `l4_24_quai_slime_lua` · `l4_25_quai_meo_bang` · `l4_26_quai_rua_da` · `l4_27_quai_cu_dem` · `l4_28_quai_ca_bong` · `l4_29_quai_nam_ma` · `l4_30_quai_chim_set` |
| BS31–BS34 | `l4_31_boss_rong_con` · `l4_32_boss_golem_pha_le` · `l4_61_boss_phuong_hoang` · `l4_62_boss_bach_tuoc` |

---

## Nhóm C — nền màn dạng bài: 6 hình (vẽ lại bố cục)

> Vì sao hỏng: màn dạng bài là màn **đi ngang** — code đặt nhân vật, công trình và bé tinh linh đứng trên một đường ngang ở **72,8% chiều cao**.
> 6 hình cũ là tranh phong cảnh phối cảnh chéo: ở độ cao đó là nước / mây / lan can ⇒ nhân vật đứng lơ lửng.

**Ảnh mẫu đính kèm 1 lần đầu context:**
- `public/bk-ui/hs/skin/khoi/phieuluu2d/nen_dang_rung.jpg` — **MẪU BỐ CỤC ĐÚNG** (style Khối vuông): chỉ lấy vị trí + dáng con đường, KHÔNG lấy nét vẽ.
- `lofi/phieu-luu/l4_33_nen_dang_rung.png` + `l4_34_nen_dang_bang.png` — 2 nền lo-fi đã nhận ⇒ mẫu NÉT VẼ + màu.

```
ĐƠN BỔ SUNG — NHÓM C (nền màn dạng bài, style "Lo-fi chill")
Đây là NỀN cho màn game ĐI NGANG: nhân vật và các bé tinh linh sẽ được đặt ĐỨNG TRÊN MỘT CON ĐƯỜNG NGANG. 6 hình cũ tôi gửi vẽ rất đẹp nhưng
là tranh phong cảnh nhìn chéo, không có đường ⇒ phải vẽ lại. GIỮ không khí, màu, loại cảnh của hình cũ — ĐỔI bố cục theo đúng luật dưới.

LUẬT BỐ CỤC (bắt buộc, sai 1 điều là không dùng được):
1. Ngang 1672×941 (16:9), nền ĐẶC. Góc nhìn THẲNG TỪ BÊN HÔNG như game đi ngang — KHÔNG phối cảnh chéo, KHÔNG nhìn từ trên xuống.
2. Có 1 CON ĐƯỜNG (lát đá / ván gỗ / đất nện, tuỳ cảnh) chạy THẲNG NGANG từ sát mép TRÁI tới sát mép PHẢI ảnh, LIỀN MẠCH, không đứt quãng.
3. MẶT ĐƯỜNG PHẲNG, nằm ngang tuyệt đối, tâm đường ở 74% CHIỀU CAO ảnh (mặt đường chiếm dải 72–76% tính từ trên xuống) — như ảnh mẫu bố cục.
4. TRÊN mặt đường phải TRỐNG suốt bề ngang: KHÔNG bậc thang, KHÔNG lan can / hàng rào, KHÔNG thùng hộp, đèn lồng, chậu cây, nhà, cột ở tiền cảnh.
   Không có vật gì che phía trước con đường.
5. Nước / mây / vực / dung nham chỉ được nằm PHÍA SAU con đường (xa hơn) hoặc PHÍA DƯỚI mép đường. Dưới đường (76–100%) là đất / cỏ / đá kè đơn giản.
6. Cảnh đẹp (núi, nhà, cây, thác, trời) dồn lên NỬA TRÊN (0–65%), ở phía xa sau con đường. Không cây to hay nhà cao mọc từ mép đường che ngang tầm nhân vật.
7. KHÔNG người, KHÔNG con vật, KHÔNG chữ, KHÔNG biển hiệu có chữ. Cùng nét vẽ + độ ấm với 2 nền lo-fi mẫu đính kèm.

- Mỗi lượt tôi gửi 1 hình cũ + 1 mã (BS35…). Bạn trả ĐÚNG 1 HÌNH, dòng đầu ghi mã + tên file. Xong dừng, chờ hình kế.

DANH SÁCH:
   BS35 nen_dang_bien_dao  — đường = CẦU TÀU VÁN GỖ chạy ngang suốt ảnh; sau đường là biển xanh ngọc, đảo đá có vòm, hải đăng xa; dưới đường là cọc gỗ + bãi cát.
   BS36 nen_dang_anh_dao   — đường = LỐI LÁT ĐÁ rải cánh hoa; sau đường là suối, cầu gỗ đỏ, đồi hoa anh đào, ngôi đền xa; cành anh đào chỉ ở 2 góc TRÊN.
   BS37 nen_dang_dam_lay   — đường = LỐI VÁN GỖ trên cọc chạy ngang suốt ảnh; sau đường là hồ sen hoàng hôn, nhà sàn, cây cổ thụ; dưới đường là mặt nước + lá súng.
   BS38 nen_dang_thanh_co  — đường = MẶT TƯỜNG THÀNH lát đá phẳng (không lỗ châu mai phía trước); sau đường là thị trấn mái ngói, lâu đài trên đồi, hoàng hôn.
   BS39 nen_dang_troi_sao  — đường = SÂN ĐÁ đài thiên văn chạy ngang suốt ảnh; sau đường là trời đêm dải ngân hà, hành tinh có vành, đảo bay xa; kính viễn vọng đặt
                             PHÍA SAU đường, lệch góc trái.
   BS40 nen_dang_dong_gio  — đường = ĐƯỜNG ĐẤT trên sườn đồi cỏ, phẳng ngang; sau đường là biển mây hoàng hôn, cối xay gió xa, vài chiếc lá bay; dưới đường là cỏ.
```

| Mã | Đính kèm hình cũ (`design/bk-ui-src/lofi/phieu-luu/`) |
|---|---|
| BS35–BS40 | `l4_36_nen_dang_bien_dao` · `l4_37_nen_dang_anh_dao` · `l4_39_nen_dang_dam_lay` · `l4_40_nen_dang_thanh_co` · `l4_41_nen_dang_troi_sao` · `l4_42_nen_dang_dong_gio` |

---

## Nhóm D — hoạt họa: 1 hình (vẽ lại đúng cỡ)

**Đính kèm 2 hình:** `lofi/lofi_nv_nu.png` (hình GỐC — khung chuẩn 1241×1268) + `lofi/hoat-hoa/lofi_nv_nu_gat_gu.png` (hình cũ sai cỡ — chỉ để thấy dáng đầu).

```
ĐƠN BỔ SUNG — NHÓM D
   BS41 lofi_nv_nu_gat_gu — hình thứ nhất tôi gửi là hình GỐC. Vẽ lại Y HỆT hình gốc: CÙNG KHUNG 1241×1268, cùng vị trí và cỡ của bàn, ghế, đèn, cốc,
        chồng sách, chậu cây, mèo, thân người — KHÔNG thu phóng, KHÔNG cắt lại khung, KHÔNG đổi góc nhìn. CHỈ đổi ĐẦU cô gái: nghiêng nhẹ sang phải,
        mắt nhắm, mỉm cười như đang nghe nhạc (dáng đầu như hình thứ hai). Tay để yên như hình gốc. Nền TRONG SUỐT THẬT. Đúng 1 hình PNG.
```

---

## Khi hình về (Claude làm)

1. Soi bằng mắt từng hình, đối chiếu mã BS — không gán theo giờ tải. Đo: 4 góc trong suốt · cỡ ảnh · nhóm C đo dải 72–76% có phải mặt đường liền từ trái sang phải.
2. Hình đạt ⇒ **thêm vào** thư mục gốc của nó với tên mới `<tên cũ>_v2.png`; hình cũ GIỮ nguyên (không xoá, không ghi đè — Luật xoá), ghi vào `lofi/_doi_ten.log.txt`.
3. Cập nhật bảng kiểm ở đầu `DON-HANG-STYLE-LOFI.md`. Hình nào vẫn chưa đạt ⇒ ghi lại mã BS + lý do để Thùy gửi lại đúng lượt đó.
