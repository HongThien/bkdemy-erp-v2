KẾT LUẬN: ĐẠT

# Biên bản SOÁT — NTL-GKI-2026 phần 15 (Hình Dạng 2 Bài 1–5) — trạm Opus, 27/10

- **Số câu:** 5 (đều `hinh_hoc`, `tu_luan`, không tách ý — đúng luật).
- **Khớp Pha 1 ngay từ đầu:** 5/5 — kết luận mọi ý trùng lượt giải mù (`NTL-GKI-2026.p15.kiem.md`): B1 hình thang cân / $\triangle EBK$ cân tại $E$ / $D,E$ chân phân giác; B2 hình bình hành / $M$ trung điểm $BC$ / $EIFJ$ HBH; B3 HBH bốn cạnh bằng nhau / hình thang cân / thẳng hàng / $\widehat{DMC}=90^\circ$; B4 đủ 4 ý ($FN:FC=2:3$); B5 bổ đề $AB+AC>HA+HB+HC$ đúng.
- **Đề:** đối chiếu ảnh `t-08.png`, `t-09.png` — chép đúng cả 5 bài (tên điểm, $60^\circ$, $AB=2AD$, $\dfrac{2}{3}FC$, $\dfrac{3}{2}(HA+HB+HC)$).
- **Câu phải sửa:** 5/5 — **KHÔNG câu nào sửa vì lỗi toán** (không đổi kết luận, không đổi đáp án, không có bước sai về toán). Sửa vì: trình bày (luật Hình 27/10) 5 câu · kiến thức (ngoài phạm vi NTL) 1 câu · lí do ghi sai / thiếu 3 câu · hình 3 câu.
- Bản gốc trước khi sửa: `NTL-GKI-2026.p15.soan.goc.md`. Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: **✔ đạt cổng** (5 câu tự luận, 0 chưa chắc).
- Máy kiểm của trạm soát: `<LV>\tam\kiem_soat_p15.mjs` (toạ độ số, ≥ 2 bộ / bài; B5 vét 200 000 tam giác nhọn — bổ đề không vỡ, tỉ số chu vi / $\frac32$tổng nhỏ nhất ≈ 1,138).

## Hai ý được dặn soát sâu

**Bài 3a (hình gì — đề cương NTL chưa học hình thoi).** Lập luận toán của trạm soạn đúng: $AMND$ là HBH (cặp cạnh đối $AM\parallel DN$, $AM=DN$), $AM=AD$ ⇒ bốn cạnh bằng nhau (tính chất cạnh đối) — không dùng dấu hiệu hình thoi. Chỗ chưa đạt: Phần 2 kết bằng "(hình thoi)" — tức gọi tên hình theo **định nghĩa hình thoi**, kiến thức NTL chưa học (phụ lục 24/10 §4: KHÔNG HCN / thoi / vuông). Đã sửa: Phần 2 kết "Vậy $AMND$ là hình bình hành có bốn cạnh bằng nhau."; tên "hình thoi" chuyển xuống dòng **Chú ý** của Phần 1 ("sẽ được gọi là hình thoi ở bài sau"); Ghi chú + ghi chú người duyệt cập nhật theo. Kèm: ý b dùng lí do "(hai góc kề một cạnh của hình bình hành bù nhau)" — không phải tính chất HBH trong SGK ⇒ đổi thành "$AM\parallel DN$ (cmt) nên … (hai góc trong cùng phía)".

**Bài 5\* (góc $\widehat{XHY}=90^\circ$).** Đọc từng dòng, **đúng hoàn toàn**:
$\widehat{ABH}=\widehat{ACH}=90^\circ-\widehat A$ ✓ · $\widehat{AHB}=180^\circ-\widehat C$ (tứ giác $CDHE$ + đối đỉnh) ✓ ⇒ tù ⇒ $AB>HB$ ✓ · $\triangle BHX$ cân: $\widehat{BHX}=45^\circ+\frac{\widehat A}{2}$ ✓ · $X$ thuộc đoạn $AB$ nên tia $HX$ nằm trong góc $AHB$: $\widehat{AHX}=135^\circ-\widehat C-\frac{\widehat A}{2}$ ✓, tương tự $\widehat{AHY}$ ✓ · $X$, $Y$ ở hai phía đường thẳng $AH$ và tổng hai góc $=90^\circ<180^\circ$ nên $\widehat{XHY}$ đúng bằng tổng ✓ (= $270^\circ-180^\circ$) · cả hai góc dương ⇒ nhọn ⇒ $K\ne H$, $AKH$ không thẳng hàng ✓ · $\widehat{AXH}=135^\circ-\frac{\widehat A}{2}>90^\circ$ ⇒ $X\ne K$ ⇒ $AX>AK$ ✓ · $AKHL$ là HBH (thật ra là HCN, lời giải khéo tránh gọi tên) ⇒ $AL=KH$ ✓ · $AK+KH>AH$ ✓. Máy: 200 000 tam giác nhọn ngẫu nhiên, bổ đề không vỡ lần nào. Chỉ sửa trình bày (tách dòng dài, thêm lí do "quan hệ giữa góc và cạnh đối diện", tách bước tính $\widehat{BHX}$ thành hai dòng có (cmt)). *(Lượt giải mù dùng đường khác ngắn hơn — kẻ $HD\parallel AC$, $HE\parallel AB$, $BH<BD$, $CH<CE$, $AH<AD+AE$ — cùng bổ đề; giữ lời giải của trạm soạn vì đúng và trong phạm vi.)*

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Cả 5 bài | định dạng (trình bày Hình) | Bỏ mọi dòng trống giữa các bước của Phần 2; chỉ giữ dòng trống trước `b)` `c)` `d)` (và trước `**Phần 2. Trình bày**`). Phần 1 giữ khuôn card (Mấu chốt / Bước k cách một dòng trống) | Đính chính luật 27/10: "giãn dòng" là việc hiển thị (+20% line-height), dữ liệu nối `\n` đơn |
| Cả 5 bài | định dạng (dòng ngắn) | Tách các dòng dài (khẳng định nối "và / mà / dấu phẩy", lí do dài) thành nhiều dòng ≲ 60 kí tự hiển thị (vài dòng kết "… (dấu hiệu nhận biết hình bình hành)" 61–64 kí tự, giữ nguyên như mẫu CEO) | Luật Hình 1 |
| Bài 1 | lập luận (thiếu lí do) | a: tách "($\triangle ABC$ cân tại $A$ (gt))" lồng ngoặc thành dòng riêng + (tính chất tam giác cân); hai dòng $\frac{180^\circ-\widehat A}{2}$ thêm "tính chất tam giác cân". c: thêm (định nghĩa tam giác cân), (tính chất tia phân giác), (tam giác có hai góc bằng nhau), "($BE$ là tia phân giác)" cho $\widehat{ABE}=\frac12\widehat{ABC}$ | Luật Hình 3: mọi mệnh đề có (gt)/(cmt)/tên |
| Bài 2 | lập luận (thiếu lí do) | Thêm (gt)/(cmt) cho $CF=\frac13AC$, $AE=\frac13AC$, $AO=\frac12AC$, "$F$/$E$ nằm trên đoạn $CO$/$AO$ (cmt)"; dòng $AJ=CI$ thêm "Mà $J$, $I$ là trung điểm … (cmt)" | Luật Hình 3 |
| Bài 3 | kiến thức | 3a bỏ "(hình thoi)" ở Phần 2, thêm Chú ý ở Phần 1; 3b đổi lí do "hai góc kề một cạnh của HBH bù nhau" → "hai góc trong cùng phía" | Phạm vi NTL chỉ tới HBH (phụ lục 24/10 §4); lí do phải thuộc whitelist |
| Bài 3 | lập luận (thiếu lí do) | 3a "$AM=DN$ và $AM\parallel DN$" tách hai mệnh đề, mỗi cái có lí do ($AB=CD$ (cmt); $M\in AB$, $N\in CD$, $AB\parallel CD$); 3b $\widehat{EDN}=60^\circ$ nêu rõ $N$ thuộc tia $DC$, $E$ thuộc tia $DA$; 3d $MB=AD$ thêm "(gt)"; (tính chất tam giác đều) | Luật Hình 3 |
| Bài 4 | lập luận (lí do ghi sai chỗ) | 4b: "(tiên đề Euclid) nên $E,C,F$ thẳng hàng **và $CE=CF$**" — $CE=CF$ không suy từ Euclid ⇒ tách: Euclid ⇒ thẳng hàng; "Mà $CE=BD$, $CF=BD$ (cmt) nên $CE=CF$"; đoạn "giao điểm … chính là $C$" viết lại thành hai mệnh đề rõ | Lí do phải đúng với từng mệnh đề (không phải lỗi toán — kết luận đúng) |
| Bài 5 | định dạng + lí do | Tách các dòng dài (tính $\widehat{DHE}$, $\widehat{BHX}$, $\widehat{XHY}$, dấu "=", đường xiên); thêm (quan hệ giữa góc và cạnh đối diện trong tam giác), (gt) cho $\triangle ABC$ nhọn và $\widehat A<90^\circ$ | Luật Hình 1, 3 |
| Bài 2 | hình | Nhãn $E$ chạm đường $DE$, nhãn $F$ đè đường $FB$ ⇒ dời $E$ sang trái, $F$ lên góc giữa $FI$ và $FC$ | Nhãn không đè nét |
| Bài 3 | hình | Nhãn $M$ đè đường $MC$ ⇒ dời lên trên-phải | Nhãn không đè nét |
| Bài 4 | hình | Nhãn $M$ bị đường $BF$ cắt ngang, $K$ chạm đường $AM$, $G$ chạm đường $DE$ ⇒ dời cả ba | Nhãn không đè nét |

Hình vẽ lại bằng `<LV>\tam\ve_soat_p15.mjs` (bản sao `ve_p15.mjs`, chỉ đổi toạ độ nhãn; Bài 1, 5 vẽ lại y nguyên). Đã mở cả 5 ảnh kiểm: dữ kiện đúng (trung điểm, $AE=EF=FC$, $60^\circ$, góc vuông, $BX=BH$, $CY=CH$), đủ điểm mọi ý, không đánh dấu điều phải chứng minh. Bài 3: nhãn $60^\circ$ nằm trong cung $\widehat{ADC}$ dưới đường $DM$ — cung trải hết góc $ADC$ nên đọc đúng, giữ.

**Câu sửa vì lỗi toán:** không có.
**Câu chỉ sửa trình bày / lí do / phạm vi kiến thức / hình:** Bài 1, 2, 3, 4, 5 (cả 5).

## Câu còn `Chưa chắc` (gửi CEO)

Không có. Không có câu "Đề sai".
