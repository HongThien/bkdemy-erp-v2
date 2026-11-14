# draft_G2 — NĐT Chương I Hình §3 (Đường trung bình của tam giác, của hình thang), bài 24, 25, 26, 27a, 27b

### NDT-H1.24 → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.24@p115 · tầng nâng cao
**sach:** Gọi N là trung điểm BE (BE = 2AE nên AE = EN = NB), dùng đường trung bình DN của tam giác BEC rồi tính chất "đường thẳng qua trung điểm một cạnh và song song cạnh thứ hai thì qua trung điểm cạnh thứ ba" cho tam giác AND. Một đường phụ (điểm N); không dùng đồng dạng.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $D$, $E$ lần lượt nằm trên các cạnh $BC$, $AB$ sao cho $BD=CD$, $BE=2AE$. Gọi $M$ là giao điểm của $AD$ và $CE$. Chứng minh rằng $MA=MD$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ thêm: gọi $N$ là trung điểm của $BE$. Vì $BE=2AE$ nên $AE=EN=NB$, tức là $E$ là trung điểm của $AN$; còn $D$ là trung điểm của $BC$ nên $DN$ là đường trung bình của $\triangle BEC$, song song với $CE$. Khi đó trong $\triangle AND$, đường thẳng $CE$ đi qua trung điểm $E$ của $AN$ và song song với $DN$ nên đi qua trung điểm $M$ của $AD$.

- n1 | - | $E$ là trung điểm của $AN$ (với $N$ là trung điểm của $BE$) | gt | $BE=2AE$ nên $AE=EN=NB$
- n2 | - | $DN\parallel CE$ | n1, gt | tính chất đường trung bình của $\triangle BEC$
- n3 | - | $MA=MD$ | n1, n2 | đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba (trong $\triangle AND$)

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $N$ là trung điểm của $BE$.
Vì $BE=2AE$ (gt) nên $AE=EN=NB$.
Do đó $E$ là trung điểm của $AN$.
[[so-do:n2]]
Xét $\triangle BEC$ có:
$N$ là trung điểm của $BE$ (cách vẽ);
$D$ là trung điểm của $BC$ (gt)
nên $DN$ là đường trung bình của $\triangle BEC$ (định nghĩa đường trung bình).
Suy ra $DN\parallel CE$ (tính chất đường trung bình).
[[so-do:n3]]
Xét $\triangle AND$ có:
$E$ là trung điểm của $AN$ (cmt);
đường thẳng $CE$ đi qua $E$, song song với $DN$ (cmt) và cắt $AD$ tại $M$
nên $M$ là trung điểm của $AD$
(đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba).
Vậy $MA=MD$.
**hinh:** NDT-H1-24.png
**hinh_lg:** NDT-H1-24_lg.png
**nghi_van:**

### NDT-H1.25 → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.25@p115 · tầng nâng cao
**sach:** Gọi N là trung điểm cạnh bên AD; MN là đường trung bình của hình thang nên MN ∥ AB, mà AB ⊥ AD nên MN ⊥ AD; MN vừa là đường cao vừa là trung tuyến của tam giác MAD nên tam giác MAD cân tại M.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang vuông $ABCD$ ($\widehat{A}=\widehat{D}=90^\circ$). Gọi $M$ là trung điểm của cạnh $BC$. Chứng minh rằng tam giác $MAD$ cân.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ thêm: gọi $N$ là trung điểm của $AD$. Khi đó $MN$ là đường trung bình của hình thang nên song song với hai đáy; mà các đáy vuông góc với $AD$ nên $MN\perp AD$ tại trung điểm $N$, tức $MN$ vừa là trung tuyến vừa là đường cao của $\triangle MAD$ nên tam giác cân.

- n1 | - | $MN\parallel AB$ ($MN$ là đường trung bình của hình thang $ABCD$) | gt | tính chất đường trung bình của hình thang
- n2 | - | $MN\perp AD$ | n1, gt | một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia
- n3 | - | $\triangle MAD$ cân tại $M$ | n2, gt | tam giác có trung tuyến đồng thời là đường cao thì cân

**Phần 2. Trình bày**

[[so-do:n1]]
Ta có $AB\perp AD$ và $CD\perp AD$ (gt)
nên $AB\parallel CD$ (hai đường thẳng cùng vuông góc với một đường thẳng thứ ba).
Vậy $ABCD$ là hình thang có hai đáy $AB$, $CD$ và hai cạnh bên $AD$, $BC$.
Gọi $N$ là trung điểm của $AD$.
Xét hình thang $ABCD$ có:
$N$ là trung điểm của cạnh bên $AD$ (cách vẽ);
$M$ là trung điểm của cạnh bên $BC$ (gt)
nên $MN$ là đường trung bình của hình thang $ABCD$ (định nghĩa đường trung bình của hình thang).
Suy ra $MN\parallel AB$ (tính chất đường trung bình của hình thang).
[[so-do:n2]]
Mà $AB\perp AD$ (gt)
nên $MN\perp AD$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia).
[[so-do:n3]]
Xét $\triangle MAD$ có:
$MN$ là đường trung tuyến ($N$ là trung điểm của $AD$);
$MN$ là đường cao ($MN\perp AD$)
nên $\triangle MAD$ cân tại $M$ (dấu hiệu nhận biết tam giác cân).
**hinh:** NDT-H1-25.png
**hinh_lg:** NDT-H1-25_lg.png
**nghi_van:**

### NDT-H1.26 → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.26@p115 · tầng nâng cao
**sach:** Gọi I là trung điểm BD; MI, NI là đường trung bình của tam giác ABD, BDC nên MI = AD/2 = BC/2 = NI, tam giác MIN cân; đồng vị (IM ∥ AD) và so le trong (IN ∥ CF) đưa về ∠AEM = ∠MFB. Một đường phụ; không dùng đồng dạng.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$ có $AD=BC$. Đường thẳng đi qua trung điểm $M$ và $N$ của các cạnh $AB$ và $CD$ cắt $AD$ và $BC$ lần lượt ở $E$ và $F$. Chứng minh rằng $\widehat{AEM}=\widehat{MFB}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ thêm: gọi $I$ là trung điểm của $BD$. Vì $M$, $N$ là trung điểm của $AB$, $CD$ nên $IM$, $IN$ là hai đường trung bình (của $\triangle ABD$ và $\triangle BDC$): $IM\parallel AD$, $IN\parallel BC$ nên các góc ở $E$, $F$ chuyển được về các góc ở $M$, $N$; còn $AD=BC$ cho $IM=IN$ nên $\triangle IMN$ cân.

- n1 | - | $IM\parallel AD$, $IM=\dfrac12AD$, $IN\parallel BC$, $IN=\dfrac12BC$ | gt | tính chất đường trung bình của $\triangle ABD$ và $\triangle BDC$ ($I$ là trung điểm của $BD$)
- n2 | - | $\triangle IMN$ cân tại $I$, tức $\widehat{IMN}=\widehat{INM}$ | n1, gt | $IM=IN$ vì $AD=BC$; tính chất tam giác cân
- n3 | - | $\widehat{IMN}=\widehat{AEM}$ và $\widehat{INM}=\widehat{MFB}$ | n1 | hai góc đồng vị ($IM\parallel AD$), hai góc so le trong ($IN\parallel BC$)
- n4 | - | $\widehat{AEM}=\widehat{MFB}$ | n2, n3 | bắc cầu qua $\widehat{IMN}$ và $\widehat{INM}$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $I$ là trung điểm của $BD$.
Xét $\triangle ABD$ có:
$M$ là trung điểm của $AB$ (gt);
$I$ là trung điểm của $BD$ (cách vẽ)
nên $MI$ là đường trung bình của $\triangle ABD$ (định nghĩa đường trung bình).
Suy ra $MI\parallel AD$ và $MI=\dfrac12AD$ (tính chất đường trung bình). (1)
Xét $\triangle BDC$ có:
$I$ là trung điểm của $BD$ (cách vẽ);
$N$ là trung điểm của $CD$ (gt)
nên $NI$ là đường trung bình của $\triangle BDC$ (định nghĩa đường trung bình).
Suy ra $NI\parallel BC$ và $NI=\dfrac12BC$ (tính chất đường trung bình). (2)
[[so-do:n2]]
Mà $AD=BC$ (gt) nên từ (1) và (2) suy ra $MI=NI$.
Do đó $\triangle IMN$ cân tại $I$ (định nghĩa tam giác cân).
Suy ra $\widehat{IMN}=\widehat{INM}$ (tính chất tam giác cân). (3)
[[so-do:n3]]
Vì $MI\parallel AD$ (cmt) nên $\widehat{IMN}=\widehat{AEM}$ (hai góc đồng vị). (4)
Vì $NI\parallel BC$ (cmt) nên $\widehat{INM}=\widehat{NFC}$ (hai góc so le trong).
Mà $\widehat{NFC}=\widehat{MFB}$ (tia $FN$ trùng tia $FM$, tia $FC$ trùng tia $FB$ như hình vẽ). (5)
[[so-do:n4]]
Từ (3), (4), (5) suy ra $\widehat{AEM}=\widehat{MFB}$.
**hinh:** NDT-H1-26.png
**hinh_lg:** NDT-H1-26_lg.png
**nghi_van:** Đề không nói vị trí E, F; lời giải viết cho cấu hình như hình sách (E, F nằm trên tia NM kéo dài về phía M, A nằm giữa D và E, B nằm giữa C và F). Kiểm số 3.081 tứ giác lồi ngẫu nhiên: E, F luôn cùng nằm ngoài đoạn MN và cùng một phía (phía M hoặc phía N), và ∠AEM = ∠MFB đúng cả hai trường hợp (trường hợp phía N: các cặp góc đồng vị, so le trong chuyển thành cặp góc có cạnh song song ngược chiều — cách làm vẫn y hệt, chỉ đổi cách gọi tên cặp góc). Nếu muốn lời giải bao quát cả hai trường hợp thì cần soạn thêm một dòng chú thích.

### NDT-H1.27a → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.27a@p115 (lời giải p116) · tầng thi HSG (Quận 1, Tp. Hồ Chí Minh, 2001–2002)
**sach:** Gọi M là trung điểm AC; ME, MF là đường trung bình của △CAD, △ABC nên ME + MF = (AB+CD)/2 ≥ EF, dấu bằng ⇒ E, M, F thẳng hàng ⇒ AB ∥ CD ⇒ hình thang. Sách chỉ làm chiều thuận (kết luận "hình thang"); kho bổ sung chiều đảo bằng đường trung bình hình thang. Hai ý a, b của "bài 27" là hai bài độc lập (hai đề thi khác nhau) nên tách khối.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tứ giác $ABCD$. Gọi $E$, $F$ lần lượt là trung điểm của $AD$, $BC$. Tìm điều kiện của tứ giác để $EF=\dfrac{AB+CD}{2}$.
(Đề thi chọn học sinh giỏi Toán, lớp 8, Quận 1 – Tp. Hồ Chí Minh, năm học 2001 – 2002)
**dap_an:** $ABCD$ là hình thang có hai đáy $AB$, $CD$ (tức $AB\parallel CD$).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Điều kiện cần tìm là $AB\parallel CD$ (hình thang có hai đáy $AB$, $CD$); phải chứng minh cả hai chiều. Chiều thuận: kẻ thêm $M$ là trung điểm của $AC$, khi đó $ME$, $MF$ là đường trung bình của $\triangle ACD$, $\triangle ABC$ nên $ME=\dfrac12CD$, $MF=\dfrac12AB$ — đưa $\dfrac{AB+CD}{2}$ về tổng $ME+MF$ rồi so với $EF$ bằng bất đẳng thức tam giác. Chiều đảo: dùng đường trung bình của hình thang.

- n1 | - | $ME\parallel CD$, $ME=\dfrac12CD$, $MF\parallel AB$, $MF=\dfrac12AB$ (với $M$ là trung điểm của $AC$), suy ra $ME+MF=EF$ | gt | tính chất đường trung bình của $\triangle ACD$ và $\triangle ABC$; giả thiết $EF=\dfrac{AB+CD}{2}$
- n2 | - | $E$, $M$, $F$ thẳng hàng | n1 | bất đẳng thức tam giác $EF\le ME+MF$, dấu "=" chỉ khi $M$ nằm trên đoạn $EF$
- n3 | - | $AB\parallel CD$ (chiều thuận) | n1, n2 | cùng song song với đường thẳng $EF$
- n4 | - | Nếu $AB\parallel CD$ thì $EF=\dfrac{AB+CD}{2}$ (chiều đảo) | gt | tính chất đường trung bình của hình thang
- n5 | - | $EF=\dfrac{AB+CD}{2}$ khi và chỉ khi $ABCD$ là hình thang có hai đáy $AB$, $CD$ | n3, n4 | hai chiều thuận và đảo

**Phần 2. Trình bày**

[[so-do:n1]]
Điều kiện cần tìm: $ABCD$ là hình thang có hai đáy $AB$, $CD$ (tức $AB\parallel CD$).
**Điều kiện cần.** Giả sử $EF=\dfrac{AB+CD}{2}$. Gọi $M$ là trung điểm của $AC$.
Xét $\triangle ACD$ có:
$M$ là trung điểm của $AC$ (cách vẽ);
$E$ là trung điểm của $AD$ (gt)
nên $ME$ là đường trung bình của $\triangle ACD$ (định nghĩa đường trung bình).
Suy ra $ME\parallel CD$ và $ME=\dfrac12CD$ (tính chất đường trung bình). (1)
Xét $\triangle ABC$ có:
$M$ là trung điểm của $AC$ (cách vẽ);
$F$ là trung điểm của $BC$ (gt)
nên $MF$ là đường trung bình của $\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $MF\parallel AB$ và $MF=\dfrac12AB$ (tính chất đường trung bình). (2)
Từ (1) và (2) suy ra $ME+MF=\dfrac{AB+CD}{2}=EF$ (gt).
[[so-do:n2]]
Nếu $E$, $M$, $F$ không thẳng hàng thì $EF<ME+MF$ (bất đẳng thức tam giác), trái với kết quả trên.
Do đó $E$, $M$, $F$ thẳng hàng.
[[so-do:n3]]
Khi đó đường thẳng $ME$ và đường thẳng $MF$ cùng là đường thẳng $EF$.
Mà $ME\parallel CD$ (1) và $MF\parallel AB$ (2)
nên $CD\parallel EF$ và $AB\parallel EF$.
Suy ra $AB\parallel CD$ (hai đường thẳng cùng song song với đường thẳng thứ ba).
Vậy $ABCD$ là hình thang có hai đáy $AB$, $CD$.
[[so-do:n4]]
**Điều kiện đủ.** Nếu $ABCD$ là hình thang có hai đáy $AB$, $CD$ thì:
$E$ là trung điểm của cạnh bên $AD$ (gt);
$F$ là trung điểm của cạnh bên $BC$ (gt)
nên $EF$ là đường trung bình của hình thang $ABCD$ (định nghĩa đường trung bình của hình thang).
Suy ra $EF=\dfrac{AB+CD}{2}$ (tính chất đường trung bình của hình thang).
[[so-do:n5]]
Vậy $EF=\dfrac{AB+CD}{2}$ khi và chỉ khi $ABCD$ là hình thang có hai đáy $AB$, $CD$.
**hinh:** NDT-H1-27a.png
**hinh_lg:** NDT-H1-27a_lg.png
**nghi_van:** Đề hỏi "điều kiện của tứ giác" — đáp án chuẩn là hình thang có hai đáy AB, CD (sách kết luận "tứ giác ABCD là hình thang"; hình sách vẽ AB ∥ CD). Sách không làm chiều đảo; kho bổ sung.

### NDT-H1.27b → HH00161
**nguon:** CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · H1.27b@p116 · tầng thi HSG (chuyên Trần Đại Nghĩa, Tp. Hồ Chí Minh, 2009–2010)
**sach:** Gọi Q là trung điểm CD; MN, PQ là đường trung bình của △ABD, △ACD nên MNQP là hình bình hành; E là trực tâm của △NPQ nên QE ⊥ NP, mà NP ∥ CD (sách dùng thẳng tính chất "đường nối trung điểm hai đường chéo hình thang song song hai đáy") nên QE ⊥ CD tại trung điểm Q, EC = ED. Kho chứng minh NP ∥ CD bằng điểm phụ I (trung điểm AD) và hai đường trung bình IN, IP. Hai ý a, b của "bài 27" là hai bài độc lập nên tách khối.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$, $AB<CD$). Gọi $M$, $N$, $P$ theo thứ tự là trung điểm của $AB$, $BD$, $AC$. Đường thẳng vuông góc với $MN$ tại $N$ và đường thẳng vuông góc với $MP$ tại $P$ cắt nhau tại $E$. Chứng minh rằng $EC=ED$.
(Đề thi chọn đội tuyển Toán lớp 8, trường THPT chuyên Trần Đại Nghĩa, Tp. Hồ Chí Minh, năm học 2009 – 2010)
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ thêm: gọi $Q$ là trung điểm của $CD$ — muốn có $EC=ED$ ta chứng minh $E$ nằm trên đường trung trực của $CD$, tức đường thẳng qua $Q$ vuông góc với $CD$ (là đường cao kẻ từ $Q$ của $\triangle NPQ$, vì $E$ là trực tâm). Gọi thêm $I$ là trung điểm của $AD$ để chứng minh $NP\parallel CD$.

- n1 | - | $MNQP$ là hình bình hành ($MN\parallel PQ$, $MN=PQ$), suy ra $MP\parallel NQ$ | gt | $MN$, $PQ$ cùng song song với $AD$ và cùng bằng $\dfrac12AD$ (đường trung bình của $\triangle ABD$, $\triangle ACD$)
- n2 | - | $EN\perp PQ$ và $EP\perp NQ$ | n1, gt | $EN\perp MN$, $EP\perp MP$ và $MN\parallel PQ$, $MP\parallel NQ$
- n3 | - | $NP\parallel CD$ và $N$, $P$, $Q$ không thẳng hàng | gt | $I$ là trung điểm của $AD$: $IN\parallel AB\parallel CD$, $IP\parallel CD$ nên $I$, $N$, $P$ thẳng hàng; $AB<CD$ nên $N\ne P$
- n4 | - | Đường cao kẻ từ $Q$ của $\triangle NPQ$ đi qua $E$ | n2, n3 | $E$ là giao của hai đường cao kẻ từ $N$, $P$; ba đường cao của tam giác đồng quy
- n5 | - | Đường thẳng đó vuông góc với $CD$ tại trung điểm $Q$, tức là đường trung trực của $CD$ | n3, n4 | một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia
- n6 | - | $EC=ED$ | n5 | điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu đoạn thẳng

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $Q$, $I$ lần lượt là trung điểm của $CD$, $AD$.
Xét $\triangle ABD$ có:
$M$ là trung điểm của $AB$ (gt);
$N$ là trung điểm của $BD$ (gt)
nên $MN$ là đường trung bình của $\triangle ABD$ (định nghĩa đường trung bình).
Suy ra $MN\parallel AD$ và $MN=\dfrac12AD$ (tính chất đường trung bình). (1)
Xét $\triangle ACD$ có:
$P$ là trung điểm của $AC$ (gt);
$Q$ là trung điểm của $CD$ (cách vẽ)
nên $PQ$ là đường trung bình của $\triangle ACD$ (định nghĩa đường trung bình).
Suy ra $PQ\parallel AD$ và $PQ=\dfrac12AD$ (tính chất đường trung bình). (2)
Từ (1) và (2) suy ra $MN\parallel PQ$ và $MN=PQ$.
Do đó $MNQP$ là hình bình hành (dấu hiệu nhận biết hình bình hành),
suy ra $NQ\parallel MP$ (tính chất hình bình hành). (3)
[[so-do:n2]]
Ta có $EN\perp MN$ (gt) và $MN\parallel PQ$ (cmt) nên $EN\perp PQ$.
Ta có $EP\perp MP$ (gt) và $MP\parallel NQ$ (3) nên $EP\perp NQ$.
[[so-do:n3]]
Xét $\triangle ABD$ có:
$I$ là trung điểm của $AD$ (cách vẽ);
$N$ là trung điểm của $BD$ (gt)
nên $IN\parallel AB$ (tính chất đường trung bình).
Xét $\triangle ACD$ có:
$I$ là trung điểm của $AD$ (cách vẽ);
$P$ là trung điểm của $AC$ (gt)
nên $IP\parallel CD$ (tính chất đường trung bình).
Mà $AB\parallel CD$ (gt) nên $IN\parallel CD$.
Qua $I$ có hai đường thẳng $IN$, $IP$ cùng song song với $CD$ nên chúng trùng nhau (tiên đề Ơ-clít).
Do đó $I$, $N$, $P$ thẳng hàng và $NP\parallel CD$. (4)
Vì $AB<CD$ nên $ABCD$ không là hình bình hành, hai đường chéo $AC$, $BD$ không cắt nhau tại trung điểm của mỗi đường nên $N\ne P$.
Lại có $NP\parallel CD$ (4) và $N\notin CD$ nên $Q\notin NP$, tức $N$, $P$, $Q$ không thẳng hàng.
[[so-do:n4]]
Trong $\triangle NPQ$: $EN\perp PQ$ và $EP\perp NQ$ (cmt)
nên $E$ là giao điểm của hai đường cao kẻ từ $N$ và $P$.
Suy ra đường cao kẻ từ $Q$ của $\triangle NPQ$ cũng đi qua $E$ (ba đường cao của tam giác đồng quy).
[[so-do:n5]]
Đường cao này vuông góc với $NP$, mà $NP\parallel CD$ (4)
nên nó vuông góc với $CD$ tại $Q$ (một đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng kia).
Vì $Q$ là trung điểm của $CD$ nên đường thẳng này là đường trung trực của $CD$.
[[so-do:n6]]
Mà đường thẳng này đi qua $E$ nên $EC=ED$ (tính chất đường trung trực).
**hinh:** NDT-H1-27b.png
**hinh_lg:** NDT-H1-27b_lg.png
**nghi_van:** Sách dùng thẳng "NP ∥ CD" ("hình thang ABCD có N, P là trung điểm BD, AC ⇒ NP ∥ CD") không chứng minh; kho chứng minh bằng điểm I (trung điểm AD). Điều kiện AB < CD dùng để N ≠ P (nếu AB = CD thì ABCD là hình bình hành, N trùng P và E không xác định).
