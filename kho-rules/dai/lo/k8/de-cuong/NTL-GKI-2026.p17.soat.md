KẾT LUẬN: ĐẠT

# Biên bản SOÁT — NTL-GKI-2026 · P17 (Đề tự luyện số 01, II. Tự luận, Bài 1–5) — 27/10

- Số câu: **9** (2 trả lời ngắn: Bài 2a `1`, Bài 2c `8` · 7 tự luận).
- Khớp Pha 1 (`NTL-GKI-2026.p17.kiem.md`) ngay từ đầu: **9/9** về đáp số / hướng chứng minh. Đề chép đúng ảnh `t-09.png`, `t-10.png` ở cả 9 câu.
- Phải sửa: **2 câu** (Bài 3, Bài 4). **Không câu nào sửa vì lỗi toán ở đáp số.** Bài 4 có một khe hở lập luận nhỏ (kết luận không đổi); còn lại là sửa trình bày và hình.
- Bản gốc trước khi sửa: `NTL-GKI-2026.p17.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (sau khi sửa).
- Máy kiểm: `<LV>\tam\soat_p17_kiem.mjs` (đồng nhất thức ngẫu nhiên cho 1a–3, thay ngược nghiệm 2a–2c, lưới số Bài 5, toạ độ số Bài 4); script vẽ lại `<LV>\tam\ve_soat_p17.mjs`.

## Câu sửa vì LỖI TOÁN

Không có. Mọi đáp số, phân tích nhân tử, nghiệm và chuỗi chứng minh của trạm soạn đều đúng.

## Câu sửa vì LẬP LUẬN (khe hở nhỏ, kết luận không đổi)

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 1 Bài 4 b) | lập luận | "Vì $G$, $H$ nằm trên đoạn $AB$ nên $AG=EA-EG$, $BH=EB-EH$" → "Theo hình vẽ, $G$ nằm giữa $A$ và $E$, $H$ nằm giữa $E$ và $B$ nên …"; Ghi chú nói rõ giả định (hai góc $A$, $B$ nhọn) và trường hợp khác vẫn có $AG=BH$ ($G$, $H$ đối xứng qua $E$) | Chỉ biết $G,H\in AB$ thì chưa suy ra được $AG=EA-EG$: khi góc $A$ tù, $H$ nằm giữa $A$ và $E$, $G$ nằm giữa $E$ và $B$ (vẫn trong đoạn $AB$) nên phải là phép cộng. Hình giải vẽ đúng trường hợp hai góc nhọn |

## Câu chỉ sửa TRÌNH BÀY / HÌNH

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 1 Bài 3 | định dạng | `(cm$^3$)` → `$(\text{cm}^3)$` | Đơn vị phải trong công thức, chữ bọc `\text{}` (brief-soan §4) |
| Đề 1 Bài 4 | định dạng (luật trình bày Hình 27/10, đính chính rule 2) | Bỏ mọi dòng trống giữa các bước của Phần 2; các dòng nối bằng xuống dòng đơn; dòng trống chỉ còn trước `b)`, `c)` (và trước `**Phần 2. Trình bày**`) | Đính chính CEO 27/10: "giãn dòng" là việc hiển thị của app, tệp soạn không chèn dòng trống giữa bước |
| Đề 1 Bài 4 | định dạng (rule 1 — dòng ngắn) | Tách các dòng dài/nối "và": dòng Lưu ý (3 dòng); "$AF\parallel DB$ và $AF=DB$"; "$DB=DC$ và $D\in BC$"; "$AF\parallel DC$ và $AF=DC$"; "$EG=EH$ và $FG=DH$"; "$AG=EA-EG$ và $BH=EB-EH$"; khối "Xét tứ giác $FADB$" (2 điều kiện riêng); khối "Xét $\triangle BCQ$" | Mỗi dòng một mệnh đề, ≲ 60 kí tự |
| Đề 1 Bài 4 | định dạng (rule 3 — chú thích) | Thêm lí do còn thiếu: "$DB=DC$ (định nghĩa trung điểm)"; "$AF\parallel DC$ (vì $AF\parallel DB$, cmt)", "$AF=DC$ (cùng bằng $DB$)"; "$A$ là trung điểm của $CQ$ (định nghĩa hai điểm đối xứng qua một điểm)"; "$AI=AB-BI$" (vì $I$ nằm giữa $A$, $B$); "$G'\in FM$ (cmt)". Đổi "(tính chất đường trung tuyến)" ở chỗ suy ra tỉ số $\dfrac{2}{3}$ thành "(tính chất trọng tâm của tam giác)"; "$I$ là trọng tâm" ghi "(tính chất ba đường trung tuyến của tam giác)" | Thiếu chú thích / gọi sai tên = chưa đạt theo luật Hình 7·8·9 |
| Đề 1 Bài 4 | hình | Bỏ hai cặp gạch "‖" của $AE=EB$; dời nhãn $H$ ra xa nét $DH$ | Hai cặp gạch nằm trên đoạn $AG$ và $HB$ nên đọc thành "$AG=BH$" — chính là điều phải chứng minh ở ý b). Vì $G, I, E, H$ đều nằm trên $AB$ nên mọi chỗ đặt gạch cho $AE=EB$ đều gây hiểu nhầm; $E$ là trung điểm đã ghi trong đề. Vẽ lại bằng `tam\ve_soat_p17.mjs` (toạ độ kiểm lại: $FD=AC$, ba cạnh bằng nhau, $F,M,I$ thẳng hàng, $AI/AB=1/3$) |

Phần 1 của Bài 4 giữ nguyên: đúng chiều phân tích đi lên ("muốn có …, cần …"), khớp các mắt xích của Phần 2, không có kiến thức cấm (không đường trung bình: ý c) đi qua trọng tâm $\triangle BCQ$ và $\triangle AFD$; không dùng hình chữ nhật/thoi/vuông theo phạm vi NTL).

## (c) Ý 4b in "BFH=ADG" — đối chiếu ảnh

Phóng to 400 dpi (`<LV>\z\soat_p17_4b-10.png`): đề in đúng "$FD=AC;BFH=ADG.$", **không** có mũ góc, **không** có kí hiệu tam giác. Cách trạm soạn xử lí **hợp lí, đúng luật 24/10 mục 2**:
- Đây là đề thiếu kí hiệu nhưng vẫn làm được ⇒ giải bình thường, ghi `**Ghi chú:** Đề sai: …` + một dòng "Lưu ý" đầu Phần 2, không treo `Chưa chắc` ✓.
- Không nên "sửa chữ đề" (luật cho phép khi lỗi in hiển nhiên) vì không biết đề muốn tam giác hay góc. Chứng minh $\triangle BFH=\triangle ADG$ rồi suy ra $\widehat{BFH}=\widehat{ADG}$ là đủ **cả hai** cách hiểu (máy: ba cặp cạnh bằng nhau, hai góc cùng $22{,}29^\circ$) ⇒ đúng là cách an toàn nhất, giữ nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

## Câu "Đề sai"

- Đề 1 Bài 4 — ý b) in "$BFH=ADG$" thiếu kí hiệu (tam giác hay góc); lời giải chứng minh hai tam giác bằng nhau rồi suy ra cặp góc.
