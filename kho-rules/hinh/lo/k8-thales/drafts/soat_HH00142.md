# Biên bản SOÁT (nhân chứng thứ hai) — HH00142 Định lý Thales — 16 câu (G1·G2·G3)

Cách làm: Pha 1 giải mù từ ảnh `trang/t-02…t-06` + `de-nguon.md` TRƯỚC khi mở nháp (đáp số tính bằng node; chứng minh nghĩ hướng trong whitelist Thales). Pha 2 soát nháp theo (a) đề · (b) toán · (c) khuôn 2 phần · (d) luật trình bày Hình 7·8·9 · (e) Phần 1 không lộ đáp số · (f) hình (mở từng bảng + ảnh nghi ngờ ở độ phân giải đầy đủ).
Kiểm độ dài dòng / dòng trống bằng `<TH>\soat_dodai_HH00142.mjs`.

## Pha 1 — đáp số máy
TL2.1a 6 · TL2.1b 6,8 · TL2.2 2 · TL2.3 6 · TL2.4 67,5 · VN1a 15,3 · VN1b 28 · VN2 200 · VN3 80,75 → 80,8.
Chứng minh (hướng tự nghĩ): TL3.1 Thalès △ACD + (IK∥AB do cùng ∥CD) Thalès △CAB · TL3.2 hai lần Thalès dạng thứ ba, cộng · TL3.3 a) Thalès △ABI, b) BI∥CK + M trung điểm BC ⇒ M trung điểm IK, c) cộng ⇒ (AI+AK)/AF = 2AM/AF = 4 · VN4 hbh BMNP; Thalès hai lần + BP=MN · VN5 Thalès △MPF (GC∥FP).

## Bảng soát
| nhãn | khớp Pha 1? | sửa gì (toán / trình bày / hình) |
|---|---|---|
| TL1a | khớp (AE/AC ; AC/EC) | — |
| TL1b | khớp (AE/AC ; AC/EC ; CF/BF ; AE/AC) | trình bày: dòng "CE/EA=CF/FB (Thalès) nên CE/AE=CF/BF" (2 mệnh đề, lặp) → một dòng `CE/AE=CF/BF (định lí Thalès)` |
| TL2.1a | khớp 6 | — |
| TL2.1b | khớp 6,8 | trình bày: thêm (gt) cho "D thuộc cạnh BC" |
| TL2.2 | khớp 2 | **Phần 1 lộ đáp số** ("kết quả vẫn bằng $2$" ở Chú ý) → "kết quả như nhau"; trình bày: thêm (gt) cho "N thuộc cạnh AC" |
| TL2.3 | khớp 6 | trình bày: rút lý do dòng "NB=MP=3" (66 ký tự) → "(tính chất hình bình hành)" |
| TL2.4 | khớp 67,5 | — |
| TL3.1 | khớp (đúng hướng) | trình bày: sơ đồ ý b) đi qua "OK∥CD" trong khi Phần 2 đi qua "IK∥AB ⇒ OK∥AB" ⇒ sửa sơ đồ cho khớp từng mũi tên với Phần 2 (thêm tầng `IK∥AB`, gốc ✓ là `IK∥CD (gt) · AB∥CD (gt)`) |
| TL3.2 | khớp | trình bày: thêm (gt) cho "D nằm giữa B và C" |
| TL3.3 | khớp (b) dùng điểm đối xứng K' + hbh + tiên đề Ơ-clit — đúng, trong whitelist) | trình bày: "(dấu hiệu nhận biết)" → "(dấu hiệu nhận biết hình bình hành)"; **hình**: nhãn $I$ đè lên nét $BI$ → dời sang phải điểm (`ve_G2_soat.mjs`, đã vẽ lại `hinh_G2\TL3-3.png`) |
| VN1a | khớp 15,3 | — |
| VN1b | khớp 28 | trình bày: "F nằm giữa P và R" → "F thuộc cạnh PR (gt)" |
| VN2 | khớp 200 | **Phần 1 lộ đáp số** (Bước 4 "IA=IC+CA=500…") → Bước 4 chỉ còn kiểm tra bằng tỉ số $IC/IA=ID/IB$, không số |
| VN3 | khớp 80,75 → 80,8 | — |
| VN4 | khớp | — |
| VN5 | khớp (chỉ ý a; sửa MD → MP) | — |

Tổng: 16/16 khớp Pha 1 (không câu nào sai toán). Sửa: lộ đáp số Phần 1 ×2 (TL2.2, VN2) · trình bày ×8 câu (TL1b, TL2.1b, TL2.2, TL2.3, TL3.1, TL3.2, TL3.3, VN1b) · hình ×1 (TL3.3). Đề: 16/16 khớp ảnh/`de-nguon.md`; các điều kiện thêm vào (I khác A, D; D khác B, C; "không song song BC" ở TL3.3; "B nằm giữa C và A"…) đều hợp lý.
Hình (f): đã mở 3 bảng + TL1b, TL2-1b, TL2-2, TL3-3, VN3, VN5 cỡ đầy đủ — dữ kiện dựng đúng tỉ lệ, không ghi đáp số, không đánh dấu điều phải chứng minh (TL3.3 chỉ gạch AF=FM, BM=MC là giả thiết; VN5 gạch NA=AP là giả thiết).
Whitelist: không chỗ nào dùng đường trung bình / phân giác / đồng dạng / Pythagore / hệ quả DE/BC (VN4 b tự chứng minh qua hbh BMNP đúng gợi ý tài liệu).

## Để nguyên, ghi nhận (không phải lỗi chắc chắn)
- 5 dòng còn 62–69 ký tự hiển thị — đều do tên lý do dài ("(dấu hiệu nhận biết hình bình hành)") hoặc dòng sơ đồ nhiều ý nối "·" (TL3.3 P1 b, VN5 P1). Mốc ≲60 là mốc tay, không tách.
- Định dạng Phần 1 câu tính: G1, G2 có dòng trống ngay sau `**Phần 1. Hướng dẫn**`, G3 (VN2, VN3) không có — `nhap_hh_tu_draft.mjs` chuẩn hoá; không sửa.
- VN4 a) sơ đồ ghi hai điều ✓ trên hai dòng thay vì một dòng "·" — gộp sẽ quá 60 ký tự, để nguyên.

## Nghi vấn cần Thùy
1. **VN5 ý b)** tài liệu "MB/MN = MP/MC" sai (thử toạ độ) ⇒ không nhập; hỏi Thùy có phải ý định là $\dfrac{MN}{MB}+\dfrac{MP}{MC}=3$ (đúng, đã kiểm máy) không.
2. **TL3.1** bản in "I trên cạnh AB" ⇒ đã sửa thành **AD** (lỗi in hiển nhiên).
3. **TL3.3** lời giải thừa nhận cấu hình không chứng minh: "$F$ nằm giữa $A$ và $I$ (và $K$)" ở a), c) và "$A$ nằm ngoài đoạn $IK$" ở c) — đúng mọi trường hợp $D$, $E$ thuộc cạnh (vì $AI/AF=AB/AD\ge1$), soát đồng ý để như hình; Thùy muốn chặt thì thêm một nhánh.
4. **VN5** tương tự: "$G\in MF$" hiểu là $G$ nằm giữa $M$ và $F$ (đúng khi $C$ thuộc đoạn $MP$); $E$, $F$ nằm trên đường thẳng $MA$ (một điểm ra ngoài đoạn $MA$) — đề "cắt $MA$" hiểu là cắt đường thẳng $MA$.
5. **VN1b** dùng "hai góc trong cùng phía bù nhau ⇒ song song" (gọi là dấu hiệu nhận biết hai đường thẳng song song) — lớp 7 chương trình mới chính thức chỉ có đồng vị / so le trong; nếu Thùy muốn chặt, đổi thành: góc kề bù $\widehat{PEF}=65^\circ=\widehat{EQR}$ (đồng vị).
