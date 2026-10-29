# NGUỒN ĐÃ TRÍCH — "DRAFT ĐỊNH LÍ THALES" (Thùy gửi 28/10) → 3 bài Hình–Học khối 8

Nguồn gốc: `C:\Users\WBPC\Downloads\DRAFT-ĐỊNH-LÍ-THALES.pdf` (20 trang). Ảnh từng trang (110 dpi): `<TH>\trang\t-01.png … t-20.png` với `<TH>` = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\fb8747b7-c80d-4be5-bd47-3c40acf97252\scratchpad\thales`.
Phóng to chỗ không rõ: `pdftoppm -r 200 -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> -png "C:\Users\WBPC\Downloads\DRAFT-ĐỊNH-LÍ-THALES.pdf" "<TH>\z\<tên>"` rồi đọc bằng Read (công cụ Read cũng mở được PDF với `pages`).

## 3 bài đích (đã có sẵn trong `hinh_hoc_bai`, khối 8, 0 câu, chưa có lý thuyết)
| Bài | Tên | Trang nguồn |
|---|---|---|
| **HH00142** | Định lý Thales | lý thuyết t-01 · bài tập t-02…t-06 |
| **HH00143** | Đường trung bình của Tam giác | lý thuyết t-08…t-09 · bài tập t-10…t-14 |
| **HH00144** | Tính chất Đường phân giác | lý thuyết t-15 · bài tập t-16, t-17, t-19 |
(Trang t-18 = lý thuyết định lý Pythagore, KHÔNG có bài tập, KHÔNG có bài trong DB ⇒ bỏ. Các dòng "1 bài cho …, tính …", "2 bài toán thực tế …" trong tài liệu là DÒNG GHI CHÚ CHƯA CÓ ĐỀ ⇒ bỏ.)

## Cách đánh nhãn câu (thứ tự câu trong bài = thứ tự file: TRÊN LỚP trước, VỀ NHÀ sau)
`TL…` = "Bài trên lớp" của tài liệu · `VN…` = "Bài về nhà / BTVN". Nhãn chỉ để ghép; kho Hình–Học không lưu cờ trên lớp / về nhà.
1 câu = 1 số bài trong tài liệu (các ý a), b), c) nằm chung). Riêng bài có HAI HÌNH ĐỘC LẬP (Bài 1 "Tính x, y") tách 2 câu.

## WHITELIST kiến thức (CẤM dùng ngoài — dùng công cụ cấm ⇒ ghi vào nghi vấn, KHÔNG dùng)
Chung: toàn bộ lớp 6, 7 + chương Tứ giác lớp 8 (hình thang, hình thang cân, hình bình hành và dấu hiệu, hình chữ nhật, hình thoi, hình vuông, tam giác bằng nhau 3 trường hợp, tam giác cân, trọng tâm tam giác lớp 7, tính chất tia phân giác, trung điểm, song song/đồng vị/so le trong/trong cùng phía). CẤM ở cả ba bài: tam giác đồng dạng (và mọi hệ quả suy từ nó), Pythagore, lượng giác (sin/cos/tan), công thức diện tích dùng tỉ số.
- **HH00142 Định lý Thales**: + lý thuyết bài này = tỉ số hai đoạn thẳng, đoạn thẳng tỉ lệ; Thalès (`AD/AB = AE/AC`, `AD/DB = AE/EC`, `BD/AB = EC/AC`); Thalès đảo. **CẤM**: đường trung bình; tính chất đường phân giác trong tam giác. (Hệ quả `AD/AB = AE/AC = DE/BC` KHÔNG có trong lý thuyết ⇒ muốn dùng phải tự chứng minh bằng cách kẻ đường song song, tạo hình bình hành rồi dùng Thalès — đúng như câu VN4 gợi ý "tứ giác BMNP là hình gì?".)
- **HH00143 Đường trung bình**: + Thalès (bài trước) + lý thuyết bài này = định nghĩa đường trung bình của tam giác; định lí (song song cạnh thứ ba và bằng nửa cạnh đó); chú ý (qua trung điểm một cạnh, song song cạnh thứ hai ⇒ qua trung điểm cạnh thứ ba). **CẤM**: tính chất đường phân giác trong tam giác.
- **HH00144 Tính chất Đường phân giác**: + Thalès + đường trung bình (hai bài trước) + lý thuyết bài này = định lí tia phân giác chia cạnh đối diện thành hai đoạn tỉ lệ với hai cạnh kề (`DB/DC = AB/AC`); chú ý đảo (D thuộc BC, `DB/DC = AB/AC` ⇒ AD là phân giác).
Đường chéo hình vuông là phân giác của góc vuông: là tính chất của hình vuông (đã học) — được dùng; "đường chéo hình thoi là phân giác các góc" cũng đã học trong chương Tứ giác — được dùng.

## Sửa lỗi đề (đã xem ảnh, xử lý theo luật "lỗi in hiển nhiên thì sửa + ghi chú")
- TL3.1 Thales: bản in "Lấy điểm I trên cạnh AB, từ I kẻ đường thẳng song song với CD" — mâu thuẫn (qua I∈AB kẻ ∥CD chính là AB; và đề dùng ID) ⇒ **I thuộc cạnh AD**; ghi vào nghi vấn.
- TL3 ĐTB TL3: bản in "FN là đường trung bình của tam giác BEC" — N chưa định nghĩa ⇒ **FM** (M là trung điểm BC); ghi nghi vấn.
- VN3 ĐTB: bản in "E là trung điểm của AD, BE cắt AC tại F" — D chưa định nghĩa; bài quen thuộc "E trung điểm AI" ⇒ **E là trung điểm của AI**; ghi nghi vấn.
- VN6 ĐTB (hình thang, M trung điểm AD): bản in "Qua M kẻ đường thẳng song song với BC cắt AC, BC tại N, P" — không thể cắt chính BC ⇒ **song song với AB (đáy)**, hình thang đáy AB ∥ CD; ghi nghi vấn.
- VN5a Thales (G trọng tâm): bản in "MC/MD = MG/MF" — D chưa định nghĩa ⇒ **MC/MP = MG/MF**. Ý b) bản in "MB/MN = MP/MC" SAI (không đúng với mọi tam giác; thử toạ độ) ⇒ **KHÔNG nhập ý b)**; ghi nghi vấn để hỏi Thùy (có thể ý định là `MN/MB + MP/MC = 3`).
- TL2.1 Phân giác: bản in "DE vuông góc với AB" ⇒ **DE vuông góc với AC** (xem câu).
- Ý trùng (có ở nhiều trang) đã gộp: BTVN ĐTB Bài 3, 4 trùng "Bài về nhà" Buổi 1; BTVN ĐTB Bài 6 trùng "Bài trên lớp Buổi 2 Bài 4"; "Bài trên lớp" trang t-10 trùng Buổi 1/2 — mỗi đề chỉ nhập MỘT lần (xem bảng dưới).
- Dấu nhân K8 viết `\cdot`.

---

# HH00142 — ĐỊNH LÝ THALES

Hình (số liệu trên hình PHẢI chuyển thành chữ trong đề; xem ảnh để vẽ lại đúng bố cục).

### TL1a (t-02) — điền chỗ trống, hình cơ bản — tu_luan
Cho tam giác $ABC$, $D$ thuộc $AB$, $E$ thuộc $AC$, $DE\parallel BC$. Điền vào chỗ trống:
$\dfrac{AD}{AB}=\ldots$ ; $\dfrac{AB}{DB}=\ldots$
Đáp (lời giải nêu ĐỦ cách viết đúng, kể cả tỉ số bằng nhau khác): $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ ; $\dfrac{AB}{DB}=\dfrac{AC}{EC}$. Hình: tam giác ABC, D, E, DE∥BC (giống ảnh: A đỉnh trên).

### TL1b (t-02) — điền chỗ trống, hình khó — tu_luan
Cho tam giác $ABC$; $D\in AB$, $E\in AC$, $F\in BC$; $DE\parallel BC$ và $EF\parallel AB$. Điền vào chỗ trống: $\dfrac{AD}{AB}=\ldots$ ; $\dfrac{AB}{DB}=\ldots$ ; $\dfrac{CE}{AE}=\ldots$ ; $\dfrac{BF}{BC}=\ldots$
Gợi đáp: $\dfrac{AE}{AC}$ ; $\dfrac{AC}{EC}$ ; $\dfrac{CF}{BF}$ ; $\dfrac{AE}{AC}$. Mỗi ô nêu 1 đáp án chính (các cách viết bằng nhau khác ghi thêm nếu muốn). Hình: ảnh t-02 (DE∥BC ngang, EF kẻ xuống BC, F nằm trên BC).

### TL2.1a (t-03 Bài 1, hình trái) — tra_loi_ngan, dap_an `6`
Tam giác $ABC$, $E\in AB$, $F\in AC$, $EF\parallel BC$, $AE=4$, $EB=8$, $CF=12$. Tính $x=AF$. (Hình: A ở dưới, BC ở trên — hình "ngược"; vẽ đúng như ảnh.)

### TL2.1b (t-03 Bài 1, hình phải) — tra_loi_ngan, dap_an `6,8`
Tam giác $ABC$ vuông tại $A$ (hình ảnh: $A$ ở dưới, $C$ ở trên, $AC$ thẳng đứng), $D\in BC$, $E\in AC$, $DE\perp AC$; $CD=5$, $DB=3{,}5$, $CE=4$. Tính $y=CA$. (Dữ kiện $DE\perp AC$ và $BA\perp AC$ ⇒ $DE\parallel AB$ — ghi trong lời giải, vẽ ký hiệu vuông góc trên hình.)

### TL2.2 (t-03 Bài 2) — tra_loi_ngan, dap_an `2`
Tam giác $ABC$, $M\in AB$, $N\in AC$, $MN\parallel BC$, $AM=3$, $AN=4{,}5$, $AC=7{,}5$ (hình có cung đứt nét từ $A$ tới $C$ ghi 7,5 = độ dài $AC$). Tính $x=MB$.

### TL2.3 (t-03 Bài 3) — tra_loi_ngan, dap_an `6`
Tam giác $ABC$, $N\in AB$, $M\in AC$, $P\in BC$, $MP\parallel AB$, $MN\parallel BC$; $AN=5$, $MP=3$, $MC=3{,}6$. Tính $x=AM$. (Gợi: $NBPM$ là hình bình hành ⇒ $NB=MP=3$ ⇒ $AB=8$.)

### TL2.4 (t-04 Bài 4, bài thực tế) — tra_loi_ngan, dap_an `67,5`
Đo khoảng cách $AB$ qua hồ: ba điểm $C,B,A$ thẳng hàng; ba điểm $C,D,E$ thẳng hàng; $BD\parallel AE$; $CD=20$ m, $DE=45$ m, $CB=30$ m. Tính $AB$ (m). Hình: như ảnh (hồ ở giữa, $A$ và $B$ bên bờ hồ, $C$ ở ngoài).

### TL3.1 (t-04, "Chứng minh hệ thức Thales") — tu_luan (chứng minh)
Cho hình thang $ABCD$ ($AB\parallel CD$). Lấy điểm $I$ trên cạnh $AD$, từ $I$ kẻ đường thẳng song song với $CD$ cắt $AC$, $BC$ lần lượt tại $O$ và $K$.
a) Chứng minh $\dfrac{AI}{ID}=\dfrac{AO}{OC}$. b) Chứng minh $\dfrac{AI}{ID}=\dfrac{BK}{KC}$.

### TL3.2 (t-04) — tu_luan
Cho tam giác $ABC$, $D$ thuộc $BC$. Kẻ $DE$, $DF$ song song với $AC$, $AB$ ($E\in AB$, $F\in AC$). Chứng minh $\dfrac{AE}{AB}+\dfrac{AF}{AC}=1$.

### TL3.3 (t-04) — tu_luan
Cho tam giác $ABC$ có trung tuyến $AM$. $F$ là trung điểm của $AM$. Qua $F$ kẻ một đường thẳng bất kì cắt $AB$, $AC$ tại $D$, $E$. Qua $B$, $C$ kẻ các đường thẳng song song với $DE$ cắt $AM$ tại $I$, $K$.
a) Chứng minh $\dfrac{AB}{AD}=\dfrac{AI}{AF}$. b) Chứng minh $M$ là trung điểm của $IK$. c) Chứng minh $\dfrac{AB}{AD}+\dfrac{AC}{AE}=4$.

### VN1a (t-05 Bài 1, Hình 1) — tra_loi_ngan, dap_an `15,3`
Tam giác $ABC$, $I\in AB$, $K\in AC$ (hình ảnh có hai góc đồng vị đánh dấu bằng nhau tại $K$ và $C$ ⇒ $IK\parallel BC$ — ghi "biết $\widehat{AKI}=\widehat{ACB}$" vào đề); $AI=17$, $IB=10$, $KC=9$. Tính $x=AK$.

### VN1b (t-05 Bài 1, Hình 2) — tra_loi_ngan, dap_an `28`
Tam giác $PQR$, $E\in PQ$, $F\in PR$; $\widehat{PEF}$... (ảnh: góc $115^\circ$ tại $E$ (góc $QEF$) và $65^\circ$ tại $Q$ (góc $EQR$); hai góc trong cùng phía bù nhau ⇒ $EF\parallel QR$); $PE=16$, $PF=20$, $FR=15$. Tính $x=PQ$ (mũi tên $x$ dọc cạnh $PQ$ chỉ cả cạnh $PQ$). (Nhận ra $EF\parallel QR$ là một bước của lời giải.)

### VN2 (t-05 Bài 2, thực tế) — tra_loi_ngan, dap_an `200`
Đo $AC$ qua hồ: $C\in AI$, $D\in BI$, $AB\parallel CD$; $IC=300$ m, $ID=450$ m, $BD=300$ m. Tính $AC$ (m). (Hình: hồ giữa, như ảnh.)

### VN3 (t-05 Bài 3, thực tế) — tra_loi_ngan, dap_an `80,8`
Chiều rộng $AB$ của khúc sông: $C,B,A$ thẳng hàng; $C,D,E$ thẳng hàng; $BD\parallel AE$; $CB=38$ m, $CD=32$ m, $CE=100$ m. Tính $AB$ (làm tròn đến chữ số thập phân thứ nhất). (Hình: hai bờ sông là hai đường ngang, $A$ bờ trên, $B,E$ bờ dưới, $C,D$ dưới bờ; như ảnh.)

### VN4 (t-05 Bài 4) — tu_luan
Cho $\triangle ABC$, lấy $M$ thuộc cạnh $AB$ ($M\ne A,B$). Đường thẳng qua $M$ song song với $BC$ cắt $AC$ tại $N$. Đường thẳng qua $N$ song song với $AB$ cắt $BC$ tại $P$.
a) Tứ giác $BMNP$ là hình gì? b) Chứng minh $\dfrac{AM}{AB}=\dfrac{AN}{AC}=\dfrac{MN}{BC}$. c) Chứng minh $\dfrac{MB}{AB}=\dfrac{CP}{BC}$.

### VN5 (t-05, t-06 Bài 5, CHỈ ý a) — tu_luan
Cho tam giác $MNP$ có trung tuyến $MA$. $G$ là trọng tâm tam giác $MNP$. Qua $G$ kẻ đường thẳng bất kì cắt $MN$, $MP$ tại $B$ và $C$. Qua $N$ và $P$ kẻ các đường thẳng song song với $BC$ cắt $MA$ tại $E$ và $F$.
a) Chứng minh $\dfrac{MC}{MP}=\dfrac{MG}{MF}$.
(ý b) của tài liệu SAI — không nhập; xem mục sửa lỗi.)

---

# HH00143 — ĐƯỜNG TRUNG BÌNH CỦA TAM GIÁC (đề KHÔNG có hình trong tài liệu, trừ lý thuyết ⇒ phải vẽ hình đề cho MỌI câu)

### TL1 (t-12 Buổi 1 Bài 1) — tu_luan
Cho tam giác $ABC$. Lấy $D$, $E$, $F$ lần lượt là trung điểm của $AB$, $AC$, $BC$. Chứng minh tứ giác $BDEF$ là hình bình hành.

### TL2 (t-10 Bài 1 = t-12 Bài 2) — tu_luan
Cho tứ giác $ABCD$. Gọi $M$, $N$, $P$, $Q$ lần lượt là trung điểm của $AB$, $BC$, $CD$, $DA$. Chứng minh tứ giác $MNPQ$ là hình bình hành.

### TL3 (t-12 Bài 3) — tu_luan
Cho tam giác $ABC$ có đường trung tuyến $AM$. Gọi $I$ là trung điểm của $AM$. Trên $AC$ lấy $E$, $F$ sao cho $AE=EF=FC$. Chứng minh: a) $FM$ là đường trung bình của tam giác $BEC$. b) $IE=\dfrac14BE$. (bản in "FN" ⇒ FM.)

### TL4 (t-10 Bài 2) — tu_luan
Cho tam giác $ABC$ có $D$, $E$ là trung điểm của $AB$, $AC$. $BE$ cắt $CD$ tại $G$. Lấy $M$, $N$ là trung điểm của $GB$, $GC$. Chứng minh $DMNE$ là hình bình hành.

### TL5 (t-10 Bài 3 = t-13 Bài 2) — tu_luan
Cho tam giác $ABC$ có $D$ là trung điểm của $AB$. Qua $D$ kẻ đường thẳng song song với $BC$ cắt $AC$ tại $E$. Qua $E$ kẻ đường thẳng song song với $AB$ cắt $BC$ tại $F$. Chứng minh $DF\parallel AC$.

### TL6 (t-13 Bài 3; t-10 Bài 4 là ý b) — tu_luan
Cho tam giác $ABC$ có $I$ là trung điểm của $BC$. Trên $AC$ lấy $D$, $E$ sao cho $AD=DE=EC$. Gọi $F$ là giao của $BD$ và $AI$. a) Chứng minh $IE\parallel FD$. b) Chứng minh $F$ là trung điểm của $AI$.

### TL7 (t-10 Bài 5) — tu_luan
Cho hình thang $ABCD$ ($AB\parallel CD$). Lấy $H$, $K$, $I$ lần lượt là trung điểm của $AD$, $BC$, $AC$. Chứng minh: a) $IK\parallel AB$. b) $HI\parallel AB$, từ đó suy ra $H$, $K$, $I$ thẳng hàng. c) $HK=\dfrac{AB+CD}{2}$.

### TL8 (t-13 Bài 1) — tu_luan
Cho tam giác $ABC$ có $D$ là trung điểm của $AB$. Qua $D$ kẻ đường thẳng song song với $BC$ cắt $AC$ tại $E$. Chứng minh $E$ là trung điểm của $AC$.

### TL9 (t-13 Bài 4 = t-11 Bài 6) — tu_luan
Cho hình bình hành $ABCD$ có $AC$ cắt $BD$ tại $O$. Trên cạnh $CD$ lấy điểm $E$ sao cho $DE=\dfrac13DC$ và $AE$ cắt $BD$ tại $K$. Từ $O$ kẻ đường thẳng song song với $AE$ cắt $CD$ tại $F$. a) Chứng minh $OF$ là đường trung bình của tam giác $ACE$. b) Chứng minh $KO=KD$.

### VN1 (t-12 Về nhà Bài 3 = t-11 Bài 3) — tu_luan
Cho tam giác $ABC$ cân tại $B$. Gọi $H$, $M$ lần lượt là trung điểm của $AC$ và $BC$. a) Chứng minh $HM\parallel AB$ và $CH\cdot CB=CM\cdot CA$. b) Lấy điểm $K$ sao cho $M$ là trung điểm của $HK$. Chứng minh tứ giác $AHKB$ là hình bình hành.

### VN2 (t-12 Bài 4 = t-11 Bài 4) — tu_luan
Cho tứ giác $ABCD$ có $AB=CD$. Gọi $E$, $F$, $G$, $H$ lần lượt là trung điểm của $AC$, $BD$, $AD$, $BC$. Chứng minh tứ giác $EGFH$ là hình thoi.

### VN3 (t-11 Bài 5) — tu_luan
Cho tam giác $ABC$ có $I$ là trung điểm của $BC$. Gọi $E$ là trung điểm của $AI$, $BE$ cắt $AC$ tại $F$. Chứng minh $EF=\dfrac14BF$. (bản in "AD" ⇒ AI.)

### VN4 (t-13 Về nhà Bài 1) — tu_luan
Cho tam giác $ABC$ vuông tại $A$ có $AM$ là đường trung tuyến. Kẻ $ME$ vuông góc với $AC$ ($E\in AC$). Chứng minh: a) $ME\parallel AB$. b) $ME$ là đường trung bình của tam giác $ABC$.

### VN5 (t-13 Về nhà Bài 2) — tu_luan
Cho tam giác $ABC$ cân tại $A$ có đường trung tuyến $AM$. Qua $M$ kẻ đường thẳng song song với $AB$ cắt $AC$ tại $D$. a) Chứng minh $D$ là trung điểm của $AC$. b) Qua $D$ kẻ đường thẳng vuông góc với $AM$ tại $I$. Chứng minh $DI$ là đường trung bình của tam giác $AMC$.

### VN6 (t-13 Về nhà Bài 3) — tu_luan
Cho hình thang $ABCD$ ($AB\parallel CD$). Lấy $M$ là trung điểm của $AD$. Qua $M$ kẻ đường thẳng song song với $AB$ cắt $AC$, $BC$ tại $N$, $P$. a) Chứng minh $N$ là trung điểm của $AC$. b) Chứng minh $NP$ là đường trung bình của tam giác $ABC$. (bản in "song song với BC" ⇒ AB.)

### VN7 (t-13, t-14 Về nhà Bài 4) — tu_luan
Cho tam giác $ABC$ cân tại $A$ có đường trung tuyến $AM$. Gọi $I$ là trung điểm của $AM$. Qua $I$ kẻ đường thẳng song song với $AC$ cắt $BC$ tại $E$. a) Chứng minh $E$ là trung điểm của $MC$. b) Qua $E$ kẻ đường thẳng song song với $AB$ cắt $AC$ tại $F$. Chứng minh $CF=\dfrac14AC$.

---

# HH00144 — TÍNH CHẤT ĐƯỜNG PHÂN GIÁC

### TL1a (t-16 Dạng 1, hình đầu) — tra_loi_ngan, dap_an `4`
Tam giác $ABC$, $AD$ là tia phân giác của góc $A$ ($D\in BC$), $AB=6$, $AC=8$, $BD=3$. Tính $x=DC$.

### TL1b (t-16 Dạng 1, hình a) — tra_loi_ngan, dap_an `28/3`
Tam giác $ABC$, $BE$ là tia phân giác của góc $B$ ($E\in AC$), $AB=14$, $BC=16$, $AC=20$. Tính $x=AE$. (Hình: cung đứt nét từ $A$ tới $C$ ghi 20 = độ dài $AC$.)

### TL1c (t-16 Dạng 1, hình b) — tra_loi_ngan, dap_an `8,25`
Tam giác $MNP$, $PI$ là tia phân giác của góc $P$ ($I\in MN$), $MP=10$, $NP=12$, $IN=4{,}5$. Tính $x=MN$ (cung đứt nét từ $M$ tới $N$ ghi $x$).

### TL2.1 (t-16 Dạng 2 Bài 1) — tu_luan
Cho tam giác $ABC$ vuông tại $A$. $AD$ là tia phân giác của góc $A$ ($D\in BC$). Kẻ $DE$ vuông góc với $AC$ ($E\in AC$). Chứng minh $\dfrac{AB}{AC}=\dfrac{AE}{EC}$.
(Bản in "DE vuông góc với AB" ⇒ **AC**: nếu $DE\perp AB$ thì $E\in AB$ và hệ thức $\dfrac{AB}{AC}=\dfrac{AE}{EC}$ KHÔNG đúng (thử toạ độ); với $DE\perp AC$ thì $DE\parallel AB$, $E\in AC$ và hệ thức đúng. Ghi vào nghi vấn.) Hướng giải: $DE\parallel AB$ ⇒ Thalès $\dfrac{AE}{EC}=\dfrac{BD}{DC}$; tính chất phân giác $\dfrac{BD}{DC}=\dfrac{AB}{AC}$.

### TL2.2 (t-16, t-17 Dạng 2 Bài 2) — tu_luan
Cho tam giác $ABC$ có $AM$ là đường trung tuyến. Kẻ $MD$ là phân giác của góc $AMB$ ($D\in AB$), $ME$ là phân giác của góc $AMC$ ($E\in AC$). Chứng minh: a) $\dfrac{AE}{EC}=\dfrac{AM}{MC}$. b) $\dfrac{AE}{EC}=\dfrac{AD}{DB}$ và $DE\parallel BC$.

### TL2.3 (t-17 Dạng 2 Bài 3) — tu_luan
Cho tam giác $ABC$ có $D$, $E$ là trung điểm của $AB$, $AC$. Kẻ tia phân giác của góc $A$ cắt $DE$, $BC$ lần lượt tại $M$, $N$. Chứng minh $\dfrac{DM}{ME}=\dfrac{BN}{NC}$.

### TL2.4 (t-17 Dạng 2 Bài 4) — tu_luan
Cho hình bình hành $ABCD$. Phân giác của góc $A$ và góc $D$ cắt các đường chéo $BD$ và $AC$ lần lượt tại $M$ và $N$. a) Chứng minh $\dfrac{BM}{DM}=\dfrac{CN}{AN}$. b) Chứng minh $MN\parallel AD$.

### VN1 (t-19 Bài 2) — tu_luan
Cho tam giác $ABC$ có $AD$, $BE$, $CF$ lần lượt là các đường phân giác của góc $A$, $B$, $C$. a) Chứng minh $\dfrac{CD}{DB}=\dfrac{AC}{AB}$. b) Chứng minh $\dfrac{AE}{EC}\cdot\dfrac{CD}{DB}\cdot\dfrac{BF}{FA}=1$.

### VN2 (t-19 Bài 3) — tra_loi_ngan, dap_an `IM=2; IN=1,5`
Cho hình vuông $ABCD$. Điểm $M$, $N$ lần lượt thuộc các đoạn thẳng $AB$ và $BC$ sao cho $\dfrac{BM}{BN}=\dfrac43$. Đoạn thẳng $BD$ cắt $MN$ tại $I$. Tính độ dài các đoạn thẳng $IM$, $IN$ biết $MN=3{,}5$ cm.

### VN3 (t-19 Bài 4) — tu_luan
Cho hình thoi $ABCD$. Trên cạnh $BC$, $BA$ lần lượt lấy điểm $E$ và $F$ sao cho $\dfrac{BF}{BE}=\dfrac45$. Đoạn thẳng $FE$ cắt đoạn thẳng $BD$ tại $I$. a) Tính $\dfrac{IE}{IF}$. b) Giả sử $FE=18$ cm. Tính độ dài các đoạn $IE$, $IF$.

### VN4 (t-19 Bài 5) — tu_luan
Cho tam giác $ABC$ ($AB<AC$), tia phân giác góc $A$ cắt cạnh $BC$ tại $D$. Gọi $M$ là trung điểm cạnh $BC$, qua $M$ kẻ đường thẳng song song với $AD$, đường thẳng này cắt tia đối của tia $AB$ tại $E$ và cắt cạnh $AC$ tại $F$. Chứng minh $BE=FC$.

---
# PHÂN NHÓM GIAO CHO SUBAGENT
- **G1** (Thales): TL1a TL1b TL2.1a TL2.1b TL2.2 TL2.3 · **G2** (Thales): TL2.4 TL3.1 TL3.2 TL3.3 VN1a VN1b · **G3** (Thales): VN2 VN3 VN4 VN5
- **G4** (ĐTB): TL1 TL2 TL3 TL4 TL5 · **G5** (ĐTB): TL6 TL7 TL8 TL9 · **G6** (ĐTB): VN1 VN2 VN3 VN4 · **G7** (ĐTB): VN5 VN6 VN7
- **G8** (Phân giác): TL1a TL1b TL1c TL2.1 · **G9** (Phân giác): TL2.2 TL2.3 TL2.4 · **G10** (Phân giác): VN1 VN2 VN3 VN4
