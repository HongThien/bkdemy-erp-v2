KẾT LUẬN: ĐẠT

# Biên bản soát phần Hình · CK-2425-ban-mai-school (Trường Ban Mai School, 2024–2025) · trạm soát Opus · 03/11/2026

- Số câu: **23** (Bài 69a, 69b, 69c, 70, 71 ở Phần 1 · Bài 72–89 ở Phần 2). 2 câu `tra_loi_ngan` (70: $258$; 79: $1592$), 21 `tu_luan`.
- **Pha 0 — sót bài:** đã mở cả 12 trang, tự lập danh sách trước khi mở bản soạn: Dạng 5 (Bài 69 ba hình độc lập, 70, 71) và Dạng 6 (Bài 72–89). Khớp đúng danh sách bản soạn. **Không sót bài, không nhập nhầm.** Bài 29–31, 34 (tam giác vuông / hình thang trong bài lập phương trình, hệ) là Đại số, không lấy là đúng.
- **Khớp Pha 1 ngay từ đầu (đáp án / đáp số / kết luận): 23/23.** Bài 75 trạm soạn dùng $\pi$ của máy ($1608{,}5$, ghi kèm $1607{,}68$ nếu $\pi\approx3{,}14$) — đề không nêu $\pi$, cả hai đều được, giữ nguyên.
- **Số câu phải sửa: 8** (73, 78, 79, 80, 84, 85, 86, 87) — theo loại lỗi (một câu có thể dính hai loại): kiến thức 3 (80, 84, 85) · định dạng 1 (73) · gỡ `Chưa chắc` 1 (78) · hình 6 (79; 80, 84 hình giải đi theo lời giải mới; 85, 86, 87 nhãn đè) · chép đề 0 · đáp số 0 · phân loại 0 · sót bài 0. Tỉ lệ sửa nội dung lời giải: 4/23.
- Bản gốc trạm soạn: `CK-2425-ban-mai-school.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.soan.goc.mjs`. Máy kiểm của trạm soát: `<LV>\tam\soat_kiem.mjs` (mọi bài), `<LV>\tam\soat_kiem84.mjs` (từng đẳng thức trung gian lời giải mới Bài 84, 5000/5000).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: **✔ đạt cổng** (23 câu, hình 23, chưa chắc 0).

## Hai chỗ trạm soạn nói "buộc dùng góc nội tiếp" — đều TRÁNH ĐƯỢC

- **Bài 80b** ($\widehat{DEF}=\widehat{DMF}$): với tam giác nhọn, tâm $O$ nằm trong tam giác; ba tam giác cân $ODE$, $OEF$, $ODF$ + tổng ba góc của $\triangle DEF$ cho $\widehat{DEF}=90^\circ-\widehat{ODF}$; tam giác vuông $DFM$ (ý a) cho $\widehat{DMF}=90^\circ-\widehat{FDM}=90^\circ-\widehat{ODF}$. Máy: đẳng thức trung gian đúng 1490/1490 tam giác nhọn ngẫu nhiên.
- **Bài 84** (cả hai ý): kẻ đường kính $BB'$; $BA=BC$, $OA=OC$ ⇒ $BB'$ là trung trực của $AC$ (cắt tại $K$); $\widehat{BDB'}=\widehat{BCB'}=90^\circ$ chứng minh bằng tam giác cân + tổng ba góc (như Bài 80a); $\triangle BKN\backsim\triangle BDB'$, $\triangle BKC\backsim\triangle BCB'$ ⇒ $BN\cdot BD=BK\cdot BB'=BC^2$ (ý b); rồi $BA^2=BN\cdot BD$ cho $\triangle BAN\backsim\triangle BDA$, $\triangle BCN\backsim\triangle BDC$ (c.g.c) ⇒ $\dfrac{AN}{AD}=\dfrac{BA}{BD}=\dfrac{BC}{BD}=\dfrac{NC}{DC}$ (ý a). Máy 5000/5000 (cả góc $B$ tù).
- Lý do trạm soạn đưa ra ("đề cương có mục Góc ở tâm, góc nội tiếp") không phải căn cứ: brief soạn mục 6 cấm góc nội tiếp **dù lời giải ngắn hơn**, chỉ cho ngoại lệ khi bài *chỉ làm được* bằng công cụ ngoài phạm vi.

## Bài 78 — phân xử `Chưa chắc` (đã gỡ)

Phóng to hình đề cương (`<LV>\z\soat_78.png`, 260 dpi): mũi tên $10\ \text{cm}$ đi từ trục tới cung trong, mũi tên $25\ \text{cm}$ đi từ trục tới mép ngoài; vùng giấy tô xám chỉ nằm giữa hai cung, phần gần trục để trắng (chỉ có nan). Hình là một phần của đề ⇒ chỉ một cách hiểu: giấy = hình quạt bán kính $25$ trừ hình quạt bán kính $10$, hai mặt: $2\cdot\dfrac{3{,}14\cdot(25^2-10^2)\cdot150}{360}=1373{,}75\ \text{cm}^2$ (trùng lời giải trạm soạn). Giữ `Ghi chú`, bỏ `Chưa chắc`.

## Bài 80b — thiếu giả thiết "tam giác nhọn"

Trạm soạn đã xử lý đúng brief mục 7 (Ghi chú + "Lưu ý:" đầu Phần 2, giải theo tam giác nhọn, không treo `Chưa chắc`). Máy trạm soát xác nhận: góc $E$ nhọn ⇒ hai góc bằng nhau 4162/4162; góc $E$ tù ⇒ hai góc bù nhau 1254/1254; ý a, c đúng mọi trường hợp. Giữ nguyên.

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 73 | định dạng | Thêm căn cứ "(tính chất tam giác đều)" cho $\widehat{ABC}=60^\circ$ và "(tính chất đường trung trực)" cho $OB=OC$, $OA=OC$; tách dòng | Luật trình bày Hình: mọi bước phải có căn cứ trong ngoặc |
| Bài 78 | ghi chú | Gỡ `Chưa chắc`, viết lại `Ghi chú` nêu căn cứ đọc hình | Ảnh phóng to cho một cách hiểu duy nhất (xem trên) |
| Bài 79 | hình | Hình đề vẽ lại thành MỘT hình tròn tô nhạt, bỏ vành lốp | Nhãn $S=400\pi$ nằm trong vòng trong của vành lốp dễ hiểu nhầm là diện tích hình tròn trong |
| Bài 80 | kiến thức + hình | Viết lại ý b bằng ba tam giác cân + tổng ba góc + tam giác vuông $DFM$ (bỏ "hai góc nội tiếp cùng chắn một cung"); sửa Phần 1 (Bước 2–5, Chú ý), Ghi chú; hình giải vẽ thêm $OE$, $OF$ (nét đứt) | Góc nội tiếp bị CẤM (brief soạn mục 6) và tránh được |
| Bài 84 | kiến thức + hình | Viết lại toàn bộ Phần 1, Phần 2 (đường kính $BB'$, hai cặp tam giác vuông đồng dạng, hai cặp c.g.c), Ghi chú; hình giải: thêm $B'$, $K$, $BB'$, $DB'$, $CB'$, ba góc vuông, bỏ bốn dấu góc nội tiếp | Góc nội tiếp bị CẤM và tránh được |
| Bài 85 | kiến thức + hình | Ý a: thay "tâm đường tròn ngoại tiếp tam giác vuông là trung điểm cạnh huyền" bằng trung tuyến ứng với cạnh huyền + hai đường trung trực cắt nhau tại một điểm; sửa Bước 1. Hình: chuyển nhãn $P$ lên trên (bị nét đứt $OK$ đè) | "Đường tròn ngoại tiếp" là nội dung học kì II, không có căn cứ trong whitelist; nhãn đè |
| Bài 86 | hình | Chuyển nhãn $K$ (đè lên tiếp tuyến $CM$) xuống dưới điểm $K$ | Nhãn đè đường |
| Bài 87 | hình | Chuyển nhãn $O$ (đè lên đoạn $MF$ ở hình giải) sang phải dưới | Nhãn đè đường |

Ngoài ra: cập nhật mục "GHI CHÚ CHO NGƯỜI DUYỆT" cuối tệp soạn (bỏ dòng "buộc dùng góc nội tiếp", bỏ dòng `Chưa chắc` Bài 78); `phanloai.json` sửa dòng `ghi` của Bài 84 (bỏ "dùng góc nội tiếp"), không đổi `tt`.

Đã soát và giữ nguyên: đề chép đúng ảnh (số, tên điểm, đủ ý) cả 23 câu; Bài 69a/b/c đặt tên đỉnh khớp vị trí số liệu trên hình (đã phóng to `<LV>\z\soat_69.png`); 71 làm tròn 3 chữ số cả hai ý; 72, 73 làm tròn mặc định; 76 $1648{,}5\to1649$; 81–83, 86, 88, 89 lời giải đúng toán, đủ căn cứ, không dùng công cụ cấm (83c dùng định lí Thalès cho ba đường thẳng song song + tam giác đồng dạng — hợp lệ; 88b dùng trung tuyến ứng với cạnh huyền, không đường trung bình; 82a, 86c, 89b hệ thức tích chứng minh bằng tam giác đồng dạng). Hình đề 81, 85: $M$ / $O$ nằm trên đường thẳng $AB$ là hệ quả bắt buộc của dựng đúng toạ độ, không vẽ đoạn nối nên không lộ kết quả.

## Bảng phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 69a | khong_tt |
| P1 Bài 69b | khong_tt |
| P1 Bài 69c | khong_tt |
| P1 Bài 70 | khong_tt |
| P1 Bài 71 | khong_tt |
| P2 Bài 72 | khong_tt |
| P2 Bài 73 | khong_tt |
| P2 Bài 74 | khong_tt |
| P2 Bài 75 | khong_tt |
| P2 Bài 76 | khong_tt |
| P2 Bài 77 | khong_tt |
| P2 Bài 78 | khong_tt |
| P2 Bài 79 | khong_tt |
| P2 Bài 80 | khong_tt |
| P2 Bài 81 | hai_tt |
| P2 Bài 82 | hai_tt |
| P2 Bài 83 | ba_tt |
| P2 Bài 84 | khong_tt |
| P2 Bài 85 | khong_tt |
| P2 Bài 86 | hai_tt |
| P2 Bài 87 | khong_tt |
| P2 Bài 88 | khong_tt |
| P2 Bài 89 | ba_tt |

Đếm: hai_tt 3 · ba_tt 2 · tt_khac 0 · khong_tt 18. Không sửa `tt` câu nào. Ghi chú phân xử: Bài 82 giữ `hai_tt` — $EC$, $ED$ là hai tiếp tuyến cắt nhau tại $E$, lời giải ý b dựng đúng $EC=ED$ và $OE$ là trục đối xứng (cốt lõi tính chất hai tiếp tuyến); Bài 83, 89 là `ba_tt` (tiếp tuyến tại hai đầu đường kính $AB$ / $AD$ và tiếp tuyến thứ ba tại $C$ / $M$, lời giải dùng $E'A=E'C$, $DB=DC$ / $BA=BM$, $KD=KM$).

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.
