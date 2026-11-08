KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-phan-chu-trinh · phần Hình (trạm soát Opus, 03/11/2026)

- Số câu: **13** (P1: 6 bài thực tế · P2: 5 bài hình phẳng · P3: 2 bài nâng cao có hình).
- Pha 0 — sót bài: **0**. Danh sách tự lập từ ảnh trang 4–6 (Dạng 4 thực tế B1–B6, Dạng 5 B1–B5, Dạng 6 B1–B2) khớp đúng 13 nhãn của bản soạn. Dạng 6 B3–B5 (GTNN, bất đẳng thức, phương trình căn) là Đại số thuần — bản soạn bỏ đúng.
- Bài nhập nhầm (Đại số thuần): **0**. Hai bài biên giới P3B1, P3B2 — ý kiến ở mục cuối.
- Khớp Pha 1 ngay từ đầu: **13/13** (đáp số và hướng chứng minh đều trùng; tính lại bằng `tam\soat_pha1.mjs`, 3000 cấu hình ngẫu nhiên mỗi bài hình phẳng, sai số ≤ 5·10⁻¹¹).
- Số câu phải sửa: **6** (P1B2, P1B3, P1B6, P2B3, P2B5, P3B1) — đều là lỗi nhỏ (căn cứ, làm tròn trung gian, nhãn hình), không câu nào sai đáp số. Bản gốc: `CK-2526-phan-chu-trinh.hinh.soan.goc.md`; script hình gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: **✔ đạt cổng** (13 câu · 2 TLN · 11 tự luận · hình 13 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 2 | lập luận | ý b: "$AB=1800$ m và $BH=300$ m (gt)" → "$AB=1800$ m (cmt)" / "$BH=300$ m (gt)" | $AB=1800$ là kết quả vừa tính, không phải giả thiết (luật trình bày Hình: căn cứ đúng) |
| P1 Bài 3 | lập luận | ý 2: thời gian tính từ $\dfrac{300}{50}$ (số đã làm tròn) → $t=\dfrac{520\cdot\tan30^\circ}{50}\approx6$ (phút) | Luật: không tính tiếp từ số đã làm tròn (đáp số không đổi: $6{,}004\approx6$) |
| P3 Bài 1 | định dạng | Mấu chốt "đạt lớn nhất tại đỉnh của nó" → "viết thành hằng số trừ một bình phương"; "$30-2x\ \text{cm}$" → "$30-2x$ (cm)" | "Đỉnh parabol" là kiến thức lớp 10; lời giải thật đi bằng hoàn thành bình phương. Đơn vị sau biểu thức phải để ngoài |
| P1 Bài 6 | hình | `giai_P1B6`: nhãn "120 m" đặt trên đoạn $AH$ → đổi thành "60 m" trên đoạn $HB$ | Nhãn cũ đọc thành $AH=120$ m (sai); lời giải dùng $HB=60$ m |
| P1 Bài 2 | hình | `giai_P1B2`: nhãn $\alpha$ nằm dưới cạnh đáy (đọc như nhãn cạnh $AH$) → đặt vào trong góc $A$ | Nhãn phải chỉ đúng góc |
| P2 Bài 3 | hình | `giai_P2B3`: nhãn $J$ dính sát nhãn $M$ (đọc thành "MJ") → dời sang phải dưới chấm $J$ | Nhãn đè nhau |
| P2 Bài 5 | hình | `de_P2B5`, `giai_P2B5`: nhãn $C$ bị đường thẳng $xy$ cắt ngang → dời vào giữa $xy$ và $CB$ | Nhãn bị đường đè |
| P3 Bài 1 | hình | `de_P3B1`: nhãn "3 m" chạm đường kích thước → dời trái; "x cm" in nghiêng cả chữ "cm" → chỉ $x$ nghiêng | Nhãn đè; đơn vị không in nghiêng |

Không sửa (đã kiểm, đúng): chép đề 13/13 khớp ảnh (P1B3 bản soạn đã sửa lỗi in "câu a) và câu b)" → "câu 1) và câu 2)", có Ghi chú — đồng ý); kiến thức: không góc nội tiếp / tứ giác nội tiếp / đường trung bình / hệ thức đường cao dùng thẳng ($OI\cdot OD=OA^2$ ở P2B3, $AE\cdot AF=R^2$ ở P2B4 đều suy từ tam giác đồng dạng; P2B2 ý 4 và P2B5 ý 2 tránh đường trung bình bằng đồng dạng / tam giác bằng nhau; P2B4 ý 3 dùng Thalès đảo); P3B1, P3B2 không dùng Cô-si (hoàn thành bình phương). Hình đề không lộ điều phải chứng minh (không vẽ $DB$, $KE$, $OM$, $BC$, $BE$, đường tròn qua 4 điểm, góc vuông tại $K$…). `phanloai.json`: không sửa.

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P1 Bài 2 | khong_tt |
| P1 Bài 3 | khong_tt |
| P1 Bài 4 | khong_tt |
| P1 Bài 5 | khong_tt |
| P1 Bài 6 | khong_tt |
| P2 Bài 1 | khong_tt |
| P2 Bài 2 | hai_tt |
| P2 Bài 3 | hai_tt |
| P2 Bài 4 | ba_tt |
| P2 Bài 5 | ba_tt |
| P3 Bài 1 | khong_tt |
| P3 Bài 2 | khong_tt |

Đếm: hai_tt 2 · ba_tt 2 · tt_khac 0 · khong_tt 9.
Ghi kèm: P2B3 — lời giải ý b chứng minh $DB$ là tiếp tuyến bằng tam giác bằng nhau (không viện dẫn tính chất hai tiếp tuyến), nhưng cấu hình chính là mô hình "hai tiếp tuyến $DA$, $DB$ cắt nhau tại $D$, $OD\perp AB$ tại trung điểm $I$" ⇒ giữ `hai_tt`. P2B5 — $AD$, $BC$ là tiếp tuyến tại hai đầu đường kính $CD$ của $(M)$, $AB$ là tiếp tuyến thứ ba tại $H$, $AD+BC=AB$ ⇒ đúng mẫu `ba_tt`. P1B6 — lời giải có dùng "bán kính vuông góc tiếp tuyến tại điểm cao nhất" chỉ để suy ra $OM\perp AB$; bản chất là bài dây – bán kính ⇒ `khong_tt`.

## Câu còn `Chưa chắc`

Không có.

## Việc cần CEO quyết (không phải `Chưa chắc`)

1. **P1 Bài 5 (hai con dê) — đề in THIẾU câu hỏi.** Trạm soạn bổ sung "Hỏi cách buộc nào thì diện tích phần cỏ hai con dê có thể ăn được lớn hơn?" kèm giả thiết trong ngoặc (dê là điểm, dây căng, không vướng, không ra khỏi vườn). Tôi đồng ý: đây là câu hỏi của bài gốc quen thuộc; lời giải tính đủ cả hai diện tích ($200\pi\approx628{,}3$ và $250\pi\approx785{,}4$ m²) nên đúng với mọi cách hỏi thông thường. Đã ghi rõ ở `**Ghi chú:**`. CEO xác nhận có giữ câu hỏi bổ sung vào kho không.
2. **Bài biên giới Hình / Đại (Dạng 6 "Nâng cao"):**
   - **P3 Bài 1 (máng nước) — đề xuất CHUYỂN sang lượt Đại.** Phần hình chỉ là đọc kích thước hình hộp ($V=300x(30-2x)$), không dùng kiến thức Hình nào (không tam giác, đường tròn, lượng giác); toàn bộ độ khó là cực trị biểu thức bậc hai — đúng dạng "giải toán bằng cách lập biểu thức + GTLN" của Đại. Không có tiếp tuyến nên cũng không vào được kho tiếp tuyến.
   - **P3 Bài 2 (vườn vuông $EFGH$) — đề xuất GIỮ ở lượt Hình** (`khong_tt`): lời giải phải dùng bốn tam giác vuông bằng nhau ⇒ bốn cạnh $EFGH$ bằng nhau và định lí Pythagore để lập biểu thức chu vi — có nội dung hình thật; phần cực trị chỉ là một bước hoàn thành bình phương. Nếu lượt Đại cũng đã lấy bài này thì chỉ giữ một bản (ưu tiên bản Hình vì có hình vẽ chuẩn). Bài này không thuộc mô hình tiếp tuyến nên chỉ vào kho Hình chung, không đẩy vào phần tiếp tuyến.
