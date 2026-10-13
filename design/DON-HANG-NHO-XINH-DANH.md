# Đơn ChatGPT — "Đáng yêu": bộ tư thế ĐÁNH cho cánh cụt + cừu (Đơn N5)

> **Soạn 13/10/2026** — Thùy: *"đặt ChatGPT vẽ thêm bộ tư thế đánh cho cánh cụt và cừu"*.
> Vì sao: style Đáng yêu đã dựng (`design/DON-HANG-STYLE-NHO-XINH.md`), nhưng vào màn đấu người đánh vẫn là **nhân vật anime chung** — màn chính là cánh cụt,
> vào trận lại thành người. Đơn gốc N1–N4 không đặt bộ đánh cho linh vật.
> "Nhỏ xinh" trong các khối đơn dưới là TÊN LÀM VIỆC — giữ nguyên khi dán (ChatGPT đã vẽ 150 hình theo tên đó).
>
> | Nhóm | Nội dung | Số lượt vẽ |
> |---|---|---|
> | **#00** | 1 ảnh toàn cảnh màn đấu — duyệt "linh vật tròn đánh trông thế nào" trước | 1 (rồi DỪNG chờ Thùy) |
> | **A** | Cánh cụt — 15 tư thế đánh | 15 |
> | **B** | Cừu — 15 tư thế đánh | 15 |
> | **C** | 5 vật bay / hiệu ứng đòn đánh theo nét Nhỏ xinh (thay cầu lửa, cầu băng, thiên thạch kiểu anime) | 5 |
>
> Tổng **36 lượt**. 15 tư thế là ĐÚNG bộ code đang dùng cho nhân vật anime (`src/screens/hocsinh/skin/heroDau.ts`) — thiếu 1 tư thế là có đòn không diễn được,
> nên không bớt. Tên file giữ đúng tên tư thế trong code.

---

## 0. Ba điều Claude tự chọn khi soạn — Thùy không bác thì làm theo

| # | Việc | Chọn | Vì sao |
|---|---|---|---|
| 1 | Trong style Đáng yêu, ai ra trận? | **Linh vật của em** (nam = cánh cụt, nữ = cừu — y như màn chính). 6 nhân vật anime em đã chọn KHÔNG dùng trong style này; lựa chọn vẫn lưu, đổi sang style khác là hiện lại | Thêm cánh cụt / cừu vào danh sách 6 nhân vật chọn chung thì ngược lại: cánh cụt nét Chiikawa đứng giữa sân đấu anime. Cách này không phải đổi DB |
| 2 | Linh vật đánh bằng gì? | **Bằng chính đồ nó đang cầm**: cánh cụt vung **bút chì mập** như đũa phép · cừu mở **quyển vở** như sách phép | Hai linh vật đã duyệt đều cầm đồ; bắt bỏ đồ ở tư thế cần hai tay thì hình lúc có lúc mất. Lại hợp app học: "chọn đúng để bốp một phát" |
| 3 | Vật bay khi ra đòn | Đặt luôn 5 hình nét Nhỏ xinh (nhóm C): sao vàng · kẹo băng · sao khổng lồ rơi · cục dỗi tím của quái · bong bóng nhốt quái | Linh vật tròn mà ném cầu lửa vẽ kiểu anime thì vẫn lệch nét. Tia sét do code vẽ — Claude đổi màu, không cần hình |

**Không nằm trong đơn này:** Boss giáo viên ở Đấu trường 3 trận (vẫn là hình anime) · bộ CHẠY trên bản đồ (style Đáng yêu chưa có màn nào cần linh vật chạy; cần thì đặt sau).

---

## Cách gửi

1. **Context ChatGPT đã vẽ linh vật (N1 / N2) còn mở ⇒ dùng lại** (nó còn nhớ nét) — chỉ dán khối đơn dưới + đính kèm hình.
   Context mất ⇒ mở MỚI, dán theo thứ tự: `design/CHATGPT-UI-KIT.md` → khối **PHONG CÁCH CHUNG — NHỎ XINH** (trong `DON-HANG-STYLE-NHO-XINH.md`) → khối đơn dưới.
2. **Đính kèm 1 lần ở đầu** (thư mục gốc ảnh: `BK_V2/bkdemy-erp-v2/design/bk-ui-src/nho-xinh/`):
   - `nx_nv_nam.png` + `nx_nv_nu.png` — 2 linh vật đã duyệt ⇒ **mẫu NÉT + màu + phụ kiện** (quan trọng nhất).
   - `hoat-hoa/nx_nam_vui.png` + `hoat-hoa/nx_nu_lo.png` — mẫu "cùng linh vật, đổi tư thế".
   - `hoc-tap/n3_28_nen_san_dau.png` — sân đấu đã duyệt (cho #00).
   - `phieu-luu/n4_26_quai_rua_da.png` — 1 con quái đã duyệt (cho #00 và mẫu nét nhóm C).
   - `design/bk-ui-src/AppHS/Animation/chien_dau/nam/reference/reference_chien_dau_nam.png` — **bảng 15 tư thế của nhân vật anime**: CHỈ lấy DÁNG từng tư thế, KHÔNG lấy nét vẽ.
3. ChatGPT vẽ **#00** rồi DỪNG ⇒ Thùy duyệt. Ưng rồi gõ "tiếp" ⇒ mỗi lượt đúng 1 hình.
4. **Sang nhóm B (cừu):** đính kèm lại `nx_nv_nu.png` + hình **A01 vừa nhận** (để cừu cùng cỡ, cùng chỗ đứng với cánh cụt).
5. **Tải về** vào `BK_V2/bkdemy-erp-v2/design/bk-ui-src/nho-xinh/danh/` — không cần đổi tên, Claude nhận diện bằng mắt. Xong nhóm nào báo Claude kiểm nhóm đó.
6. **Tự kiểm nhanh trước khi tải:** ① nền phải trong suốt (không kem, không ô caro vẽ giả, không cỏ dưới chân) · ② linh vật quay sang PHẢI · ③ thân to bằng hình đứng A01 / B01
   (ChatGPT hay phóng to tư thế gục, thu nhỏ tư thế nhảy) · ④ trong hình KHÔNG có sao, lửa, tia sáng, vật bay. Sai ⇒ gõ ngay trong lượt đó: "làm lại: <lỗi>".

---

## Khối đơn (dán nguyên)

```
ĐƠN N5 — TƯ THẾ ĐÁNH CỦA LINH VẬT (style "Nhỏ xinh") — vẫn luật cũ: MỖI LƯỢT ĐÚNG 1 HÌNH, dòng đầu ghi mã + tên file, vẽ xong DỪNG chờ tôi gõ "tiếp".

BỐI CẢNH: trong app có màn ĐẤU kiểu game đi cảnh nhìn ngang. LINH VẬT của học sinh đứng bên TRÁI sân, quay mặt sang PHẢI; con QUÁI đứng bên phải.
Học sinh trả lời đúng thì linh vật ra đòn. Tôi tự ghép các tư thế thành chuyển động và tự vẽ vật bay / tia sáng bằng code.
⇒ Tôi cần CÙNG 2 linh vật đã duyệt (cánh cụt nx_nv_nam, cừu nx_nv_nu — đính kèm), vẽ ở 15 tư thế đánh.
Bảng 15 tư thế của nhân vật anime đính kèm CHỈ để xem DÁNG từng tư thế — KHÔNG lấy nét vẽ, KHÔNG lấy tỉ lệ người.

VŨ KHÍ = ĐỒ LINH VẬT ĐANG CẦM:
- CÁNH CỤT dùng cây BÚT CHÌ MẬP như đũa phép (phép phát ra từ ĐẦU NHỌN bút chì). Cặp chéo xanh bạc hà luôn đeo trên người.
- CỪU dùng QUYỂN VỞ như sách phép (phép phát ra từ TRANG VỞ đang mở). Nơ luôn ở trên đầu.
Bút chì / quyển vở có mặt trong MỌI tư thế (kể cả lúc ngã thì rơi ngay cạnh), không lúc có lúc mất.

LUẬT CHUNG CHO 30 HÌNH TƯ THẾ (sai 1 điều là không dùng được):
1. Khung VUÔNG 1254×1254, NỀN TRONG SUỐT THẬT (kênh alpha). KHÔNG nền kem / trắng, KHÔNG cỏ, hoa, mặt đất, KHÔNG bóng đổ dưới chân.
2. CHỈ có linh vật + đồ nó cầm. TUYỆT ĐỐI KHÔNG vẽ: sao, lửa, tia sét, quầng sáng, vệt gió, vật bay, đạn, dấu nổ, chữ, số.
   (Riêng các nét nằm SÁT trên người thì được: 2–3 vạch "rung rung", 1 giọt mồ hôi, 1 giọt nước mắt.)
3. Linh vật quay 3/4 sang PHẢI (thấy cả 2 mắt, mũi / mỏ hướng phải). Mọi đòn đánh hướng sang PHẢI.
4. CÙNG MỘT CỠ THÂN trong mọi hình: ở tư thế đứng (A01 / B01) thân cao ~50% chiều cao khung, đứng giữa khung theo chiều ngang, 2 chân chạm một
   vạch ngang tưởng tượng ở 88% chiều cao khung. Các tư thế khác GIỮ NGUYÊN cỡ thân đó và vạch đất đó — KHÔNG phóng to cho đầy khung,
   KHÔNG thu nhỏ. Khoảng trống quanh người là cố ý: để chỗ cho tay giơ, bước lao tới, cú nhảy.
5. Không bộ phận nào chạm mép khung (bút chì giơ cao, tay duỗi, đuôi, nơ đều nằm trọn trong khung, cách mép ≥ 4%).
6. Giữ ĐÚNG linh vật đã duyệt: thân mochi tròn, tay chân tí hon, nét viền nâu sẫm dày hơi run tay, tô phẳng pastel, má hồng, mắt chấm
   (hoặc vạch cong khi nhắm / cười), cùng màu, cùng phụ kiện. Chỉ đổi dáng + biểu cảm.
7. Linh vật tròn, tay ngắn ⇒ diễn tả bằng CẢ THÂN: nghiêng người, co người, giãn người, nhón chân, nhảy. Dễ thương, hơi vụng, KHÔNG ngầu, KHÔNG dữ.

#00 nx_dau_toan_canh — ẢNH TOÀN CẢNH để duyệt (ngang 1672×941, nền đặc, đây là ảnh DUY NHẤT có nền và có vật bay):
     nền = sân đấu đính kèm; bên TRÁI là cánh cụt ở tư thế "lao tới đẩy bút chì" (A09), từ đầu bút chì bay ra 1 NGÔI SAO VÀNG MẬP có đuôi lấp lánh
     ngắn đang bay ngang sang phải; bên PHẢI là con rùa đá đính kèm đang giật mình. Nửa dưới ảnh để trống (chỗ đặt khung câu hỏi).
     KHÔNG chữ. → Vẽ xong DỪNG, chờ tôi duyệt.

A. CÁNH CỤT (15 hình — tên file nx_dau_nam_<tư thế>):
   A01 dung_1       — đứng thủ thế: 2 chân hơi dang, 2 cánh ôm bút chì chếch trước ngực, đầu bút hướng lên phải; mặt tập trung, hơi thở ra (thân hơi xẹp)
   A02 dung_2       — y hệt A01, chỉ khác hít vào: thân phồng cao hơn một chút, bút chì nhích lên một chút. Khác rất NHẸ
   A03 suy_nghi     — 1 cánh chống cằm, mắt nhìn lên chếch phải, đầu nghiêng, cánh kia chống bút chì xuống đất như cây gậy. KHÔNG dấu hỏi
   A04 tich_nang_1  — gom sức: 2 cánh nắm bút chì dựng đứng trước ngực, người co thấp xuống, 2 mắt nhắm chặt, má phồng, 2 vạch rung 2 bên
   A05 tich_nang_2  — gom sức mạnh hơn: người chồm tới trước, 2 cánh chĩa bút chì NGANG sang phải ngang tầm ngực, mắt mở to quyết tâm.
                      Phía trước đầu bút là KHOẢNG TRỐNG (tôi sẽ đặt quả cầu sáng ở đó) — KHÔNG vẽ gì ở đầu bút
   A06 niem_troi_1  — chuẩn bị gọi phép trời: 1 cánh giơ bút chì lên cao quá đầu, người hơi ngả ra sau, mặt ngước lên chếch phải, cánh kia áp ngực
   A07 niem_troi_2  — gọi phép trời: CẢ 2 cánh nắm bút chì giơ THẲNG ĐỨNG lên trời, đầu nhọn chĩa lên, kiễng 2 chân, mặt ngước lên, miệng há hô to
   A08 nem_truoc_1  — lấy đà: xoay người, 2 cánh kéo bút chì ra SAU về phía TRÁI (như vung gậy), dồn người lên chân sau, mặt vẫn nhìn sang PHẢI, mím miệng
   A09 nem_truoc_2  — ra đòn mạnh: lao người tới, 1 cánh đẩy bút chì DUỖI THẲNG NGANG sang PHẢI (đầu nhọn chĩa phải), chân trước bước dài, chân sau duỗi,
                      cánh kia văng ra sau giữ thăng bằng, mặt hăng. KHÔNG vẽ gì bay ra
   A10 phat_nho     — đòn nhẹ: đứng thẳng thong thả, 1 cánh vẩy bút chì chếch sang phải như gõ nhẹ, cánh kia chống hông, mặt tự tin nhếch mép
   A11 bi_danh_1    — trúng đòn: người giật ngả ra sau về bên TRÁI, 2 mắt nhắm tịt thành dấu ">  <", 2 cánh giơ che mặt, bút chì vẫn nắm, 1 giọt nước mắt
   A12 bi_danh_2    — văng mạnh: cả người ngả hẳn ra sau gần ngã, 1 chân nhấc khỏi đất, 2 cánh chới với, bút chì tuột khỏi tay lơ lửng ngay cạnh, mặt mếu
   A13 guc          — chịu thua: ngồi bệt bẹp xuống đất, đầu gục, 2 mắt thành 2 vòng xoắn chóng mặt, bút chì rơi nằm ngang ngay trước mặt.
                      GIỮ NGUYÊN cỡ thân (hình này linh vật chỉ chiếm nửa dưới khung — đúng như vậy), KHÔNG vẽ sao quay trên đầu
   A14 thang_1      — nhảy mừng: CẢ 2 chân rời hẳn vạch đất, 1 cánh giơ bút chì lên trời, cánh kia giơ nắm, mắt cười cong, miệng cười to
   A15 thang_2      — tiếp đất mừng: 2 chân chạm đất, người nghiêng, 1 cánh chống bút chì xuống đất, cánh kia giơ lên vẫy, nháy 1 mắt, cười

B. CỪU (15 hình — tên file nx_dau_nu_<tư thế>; đúng 15 tư thế như cánh cụt, đổi bút chì thành QUYỂN VỞ):
   B01 dung_1       — đứng thủ thế: 2 chân hơi dang, 2 tay ôm quyển vở ĐÓNG trước ngực; mặt tập trung, hơi thở ra (thân hơi xẹp)
   B02 dung_2       — y hệt B01, chỉ khác hít vào: thân phồng cao hơn một chút, lông xù hơn một chút. Khác rất NHẸ
   B03 suy_nghi     — 1 tay chống cằm, mắt nhìn lên chếch phải, đầu nghiêng, tay kia kẹp quyển vở đóng bên hông. KHÔNG dấu hỏi
   B04 tich_nang_1  — gom sức: 2 tay ôm chặt quyển vở đóng vào ngực, người co thấp xuống, 2 mắt nhắm chặt, má phồng, 2 vạch rung 2 bên
   B05 tich_nang_2  — gom sức mạnh hơn: người chồm tới trước, 2 tay MỞ quyển vở, trang vở hướng sang PHẢI ngang tầm ngực, mắt mở to quyết tâm.
                      Phía trước trang vở là KHOẢNG TRỐNG (tôi sẽ đặt quả cầu sáng ở đó) — KHÔNG vẽ gì bay ra từ vở, trang vở để trắng
   B06 niem_troi_1  — chuẩn bị gọi phép trời: 1 tay nâng quyển vở mở lên cao quá đầu, người hơi ngả ra sau, mặt ngước lên chếch phải, tay kia áp ngực
   B07 niem_troi_2  — gọi phép trời: CẢ 2 tay nâng quyển vở MỞ lên THẲNG trên đầu, trang vở ngửa lên trời, kiễng 2 chân, mặt ngước lên, miệng há hô to
   B08 nem_truoc_1  — lấy đà: xoay người, 2 tay kéo quyển vở đóng ra SAU về phía TRÁI, dồn người lên chân sau, mặt vẫn nhìn sang PHẢI, mím miệng
   B09 nem_truoc_2  — ra đòn mạnh: lao người tới, 2 tay đẩy quyển vở MỞ ra hết tầm tay sang PHẢI, trang vở hướng thẳng sang phải, chân trước bước dài,
                      chân sau duỗi, nơ và lông tạt về sau, mặt hăng. KHÔNG vẽ gì bay ra
   B10 phat_nho     — đòn nhẹ: đứng thẳng thong thả, 1 tay ôm quyển vở mở, tay kia chỉ nhẹ sang phải như búng, mặt tự tin nhếch mép
   B11 bi_danh_1    — trúng đòn: người giật ngả ra sau về bên TRÁI, 2 mắt nhắm tịt thành dấu ">  <", giơ quyển vở lên che mặt, 1 giọt nước mắt
   B12 bi_danh_2    — văng mạnh: cả người ngả hẳn ra sau gần ngã, 1 chân nhấc khỏi đất, 2 tay chới với, quyển vở tuột khỏi tay lơ lửng ngay cạnh, mặt mếu
   B13 guc          — chịu thua: ngồi bệt bẹp xuống đất, đầu gục, 2 mắt thành 2 vòng xoắn chóng mặt, quyển vở rơi úp ngay trước mặt.
                      GIỮ NGUYÊN cỡ thân (linh vật chỉ chiếm nửa dưới khung — đúng như vậy), KHÔNG vẽ sao quay trên đầu
   B14 thang_1      — nhảy mừng: CẢ 2 chân rời hẳn vạch đất, 1 tay giơ quyển vở đóng lên trời, tay kia giơ nắm, mắt cười cong, miệng cười to
   B15 thang_2      — tiếp đất mừng: 2 chân chạm đất, người nghiêng, 1 tay ôm quyển vở vào ngực, tay kia giơ lên vẫy, nháy 1 mắt, cười

C. VẬT BAY / HIỆU ỨNG ĐÒN ĐÁNH (5 hình — nền TRONG SUỐT, cùng nét viền nâu dày + tô phẳng pastel như con quái đính kèm; vật KHÔNG có mắt miệng,
   KHÔNG chữ; đúng khổ + đúng HƯỚNG ghi dưới vì tôi đặt hình theo vị trí "đầu" của vật):
   C01 nx_fx_cau_lua     — ngang 1774×887. 1 NGÔI SAO VÀNG BƠ mập 5 cánh tròn đang bay sang PHẢI: sao nằm ở bên phải ảnh (tâm sao ở 82% bề ngang,
                           giữa chiều cao), phía sau kéo 1 đuôi sang TRÁI gồm vài ngôi sao nhỏ + chấm tròn vàng nhạt dần
   C02 nx_fx_cau_bang    — ngang 1774×887. 1 VIÊN KẸO BĂNG tròn xanh trời nhạt (như viên bi đá, 1 mảng sáng trắng) bay sang PHẢI: viên kẹo ở 82% bề ngang,
                           giữa chiều cao, đuôi sang TRÁI là vài bông tuyết 6 cánh nhỏ + chấm trắng xanh nhạt dần
   C03 nx_fx_thien_thach — vuông 1254×1254. 1 NGÔI SAO KHỔNG LỒ cam đào rơi chéo từ trên-trái xuống dưới-phải: sao to nằm ở góc dưới-phải
                           (tâm ở 78% ngang, 78% dọc), đuôi kéo lên góc trên-trái gồm 3 dải cong vàng + vài cụm bụi tròn kem
   C04 nx_fx_dan_ma      — ngang 1774×887. Đòn của QUÁI: 1 CỤC DỖI tròn màu tím hoa (như cục khói xù, mép lượn sóng, bên trong vài vạch xoắn nâu) bay sang PHẢI:
                           cục dỗi ở 82% bề ngang, giữa chiều cao, đuôi sang TRÁI là vài cục khói tím nhỏ dần
   C05 nx_fx_bang_boc    — dọc 1122×1402. 1 BONG BÓNG to trong veo xanh nhạt để NHỐT con quái: vòng tròn lớn gần kín khung, viền nâu dày, ruột RỖNG TRONG SUỐT
                           (nhìn xuyên qua được — chỉ tô 1 lớp xanh rất nhạt), 2 vệt sáng trắng cong ở góc trên-trái, vài bong bóng con quanh mép. KHÔNG có con vật bên trong

Bắt đầu với #00.
```

---

## Khi hình về (Claude làm)

1. **Nhận diện bằng mắt** (tấm ghép), đối chiếu mã — không gán theo giờ tải. Chuyển vào `nho-xinh/danh/` với tên `nx_dau_<nam|nu>_<tư thế>.png`, ghi sổ `_doi_ten.log.txt`.
2. **Đo từng hình:** 4 góc trong suốt · hướng mặt · hộp bao thân · vạch đất (đáy hộp bao; 2 tư thế nhảy / văng dùng vạch đất của hình đứng) · cỡ thân so với hình đứng
   (lệch quá ~12% ⇒ bắt vẽ lại, lệch ít hơn thì script bù) · trong hình có lọt vật bay / tia sáng không.
3. **Điểm phát đòn** (đầu bút chì / giữa trang vở) ở 4 tư thế `tich_nang_2` · `nem_truoc_2` · `phat_nho` · `niem_troi_2`: đo trên hình, ghi vào bảng neo — đạn bay ra từ đúng chỗ đó.
4. Hình nào chưa đạt ⇒ ghi mã + lý do vào đầu file này để Thùy gửi lại đúng lượt đó (bản cũ giữ nguyên, bản mới thêm `_v2`).

## Kế hoạch dựng code (sau khi hình đạt)

- `scripts/dang-yeu-hinh.mjs`: nén 30 tư thế → `public/bk-ui/hs/skin/dang_yeu/dau/<nam|nu>/<tư thế>.webp` + 5 hiệu ứng → `dau/fx_*.webp`; sinh `styles/dangYeuDau.ts`
  (neo đất, trục thân, cỡ thân đứng, điểm phát đòn — cùng dạng số đo với `heroDau.ts`).
- Hợp đồng style thêm 1 mục tuỳ chọn `Skin.dau { nv: { nam, nu }, fx? }` (`skin/kieu.ts`). Style không khai ⇒ y như hiện tại (6 nhân vật anime).
- `skin/nhanVat.ts` — 1 cửa duy nhất cho mọi chỗ vẽ nhân vật đánh (`anhDauNv` · `hopDauNv` · `tayDauNv`): style có `dau` ⇒ trả hình + số đo của linh vật theo giới tính.
  Nhờ vậy màn đấu phiêu lưu, Đấu trường, game nhúng, ô nhân vật ở cổng Học tập đổi theo cùng lúc, KHÔNG có `if (skin === …)` ở từng màn.
- `thuthach/hieuUng.ts`: đường dẫn hình hiệu ứng lấy từ style (`fx`), không khai thì dùng bộ chung; màu tia sét theo bảng màu style.
- Màn "Chọn nhân vật" trong style Đáng yêu: không hiện 6 nhân vật anime nữa (đi thẳng vào Học tập bằng linh vật) — lựa chọn cũ của em vẫn nằm nguyên trong DB.
- Nhân vật nhỏ đứng trên bệ ở màn chặng (đang là hình anime) ⇒ dùng `dung_1` của linh vật.
- Kiểm: `check:style-hs` · `tsc` · `build:hs` · soi đủ 3 loại đòn + thua + thắng ở `hs.html?xem=phieu_luu&skin=dang_yeu&tang=dau&luc=C&vung=C1` (cả `&tt=2`).
