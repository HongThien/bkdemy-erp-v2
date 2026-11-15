### VHB2-198 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 198@p081 (giải p194)
**sach:** Chiếu $M$ lên ba cạnh, hệ quả Thalès đổi mỗi tỉ số thành tỉ số khoảng cách, rồi dùng tổng ba khoảng cách từ một điểm trong tam giác đều tới ba cạnh bằng chiều cao (sách dùng không chứng minh). Kho chứng minh tổng đó bằng đường song song $BC$ qua $M$ và định lí Pythagore.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác đều $ABC$ có trọng tâm $G$. $M$ là một điểm nằm bên trong tam giác, $M\ne G$. Đường thẳng $MG$ cắt các đường thẳng $BC$, $AC$, $AB$ theo thứ tự tại $A'$, $B'$, $C'$. Chứng minh rằng $\dfrac{A'M}{A'G}+\dfrac{B'M}{B'G}+\dfrac{C'M}{C'G}=3$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Hạ $MD'$, $ME'$, $MF'$ vuông góc với $BC$, $CA$, $AB$: mỗi tỉ số $\dfrac{A'M}{A'G}$ bằng tỉ số hai đường vuông góc song song, còn mẫu $GD=GE=GF=\dfrac h3$. Còn lại là tổng ba đường vuông góc từ $M$ bằng $h$, chứng minh bằng đường qua $M$ song song $BC$ và định lí Pythagore.

- n1 | - | $\dfrac{A'M}{A'G}=\dfrac{MD'}{GD}$, $\dfrac{B'M}{B'G}=\dfrac{ME'}{GE}$, $\dfrac{C'M}{C'G}=\dfrac{MF'}{GF}$ | gt | hệ quả của định lí Thalès, $MD'\parallel GD$ cùng vuông góc $BC$ (tương tự hai tỉ số còn lại)
- n2 | - | $GD=GE=GF=\dfrac h3$ | gt | tam giác đều: trung tuyến cũng là đường cao, bằng nhau, $G$ cách chân mỗi trung tuyến $\dfrac13$ độ dài
- n3 | - | tổng ba tỉ số $=\dfrac{3(MD'+ME'+MF')}{h}$ | n1, n2 | thay $GD$, $GE$, $GF$ bằng $\dfrac h3$
- n4 | - | $MD'+ME'+MF'=h$ | gt | đường qua $M$ song song $BC$, tam giác đều nhỏ, định lí Pythagore
- n5 | - | tổng ba tỉ số $=3$ | n3, n4 | thay tổng ba đường vuông góc bằng $h$

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $D$, $E$, $F$ lần lượt là trung điểm của $BC$, $CA$, $AB$; $D'$, $E'$, $F'$ lần lượt là hình chiếu của $M$ trên $BC$, $CA$, $AB$.
Vì $\triangle ABC$ đều nên $AD\perp BC$, mà $G\in AD$ nên $GD\perp BC$.
Lại có $MD'\perp BC$ nên $MD'\parallel GD$.
Xét $\triangle A'GD$ có $MD'\parallel GD$ ($M\in A'G$, $D'\in A'D$)
nên $\dfrac{A'M}{A'G}=\dfrac{MD'}{GD}$ (hệ quả của định lí Thalès).
Nếu $MG\perp BC$ thì $A'\equiv D'\equiv D$ và đẳng thức này hiển nhiên.
Chứng minh tương tự (với $GE\perp CA$, $GF\perp AB$):
$\dfrac{B'M}{B'G}=\dfrac{ME'}{GE}$, $\dfrac{C'M}{C'G}=\dfrac{MF'}{GF}$.
[[so-do:n2]]
Đặt $h=AD$ là chiều cao của $\triangle ABC$.
Trong tam giác đều, ba trung tuyến $AD$, $BE$, $CF$ cũng là ba đường cao nên bằng nhau và bằng $h$.
Vì $G$ là trọng tâm nên $GD=\dfrac13AD=\dfrac h3$, tương tự $GE=GF=\dfrac h3$.
[[so-do:n3]]
Từ đó $\dfrac{A'M}{A'G}+\dfrac{B'M}{B'G}+\dfrac{C'M}{C'G}=\dfrac{MD'+ME'+MF'}{h/3}=\dfrac{3(MD'+ME'+MF')}{h}$. (1)
[[so-do:n4]]
Qua $M$ kẻ đường thẳng song song $BC$, cắt $AB$, $AC$ lần lượt tại $P$, $Q$ ($M$ nằm trong tam giác nên $M$ nằm giữa $P$ và $Q$).
Vì $PQ\parallel BC$ nên $\widehat{APQ}=\widehat{ABC}=60^\circ$ và $\widehat{AQP}=\widehat{ACB}=60^\circ$ (đồng vị).
Do đó $\triangle APQ$ đều, cạnh $PQ$.
Vì $\widehat{APM}=60^\circ$ là góc nhọn nên $F'$ thuộc tia $PA$. Tam giác $PF'M$ vuông tại $F'$ có $\widehat{F'PM}=60^\circ$ nên $\widehat{PMF'}=30^\circ$ và $PF'=\dfrac{PM}{2}$.
Theo định lí Pythagore: $MF'^2=PM^2-\dfrac{PM^2}{4}$, suy ra $MF'=\dfrac{\sqrt3}{2}PM$.
Tương tự $ME'=\dfrac{\sqrt3}{2}MQ$.
Suy ra $MF'+ME'=\dfrac{\sqrt3}{2}(PM+MQ)=\dfrac{\sqrt3}{2}PQ$.
Gọi $K$ là giao điểm của $AD$ và $PQ$. Vì $AD\perp BC$ và $PQ\parallel BC$ nên $AK\perp PQ$, $AK$ là đường cao của tam giác đều $APQ$.
Theo định lí Pythagore: $AK=\dfrac{\sqrt3}{2}PQ$, nên $MF'+ME'=AK$.
$MD'$ và $KD$ cùng vuông góc $BC$, $MK\parallel D'D$ nên $MD'DK$ là hình chữ nhật, suy ra $MD'=KD$.
Vậy $MD'+ME'+MF'=KD+AK=AD=h$. (2)
[[so-do:n5]]
Từ (1) và (2): $\dfrac{A'M}{A'G}+\dfrac{B'M}{B'G}+\dfrac{C'M}{C'G}=\dfrac{3h}{h}=3$.
**hinh:** VHB2-198.png
**hinh_lg:** VHB2-198_lg.png
**nghi_van:** (1) Đề sách không nói $M\ne G$ và đường $MG$ không song song cạnh nào; đã thêm $M\ne G$ (các điểm $A'$, $B'$, $C'$ chỉ tồn tại khi $MG$ không song song cạnh nào). (2) Sách dùng "tổng ba đường vuông góc bằng $h$" không chứng minh; kho chứng minh tại chỗ bằng Pythagore, dài hơn sách nhưng không dùng phương pháp diện tích.

### VHB2-199 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 199@p081 (giải p194)
**sach:** Kẻ $EH\perp AB$, $HE\parallel AC$ nên hệ quả Thalès cho $HE=AD$; suy ra $AH=AF$, hai tam giác $AHE$ và $FAD$ bằng nhau (c.g.c). Sách ghi "dễ dàng chứng minh được $AE\perp DF$"; kho viết đủ.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ vuông cân tại $A$. Các điểm $D$, $E$, $F$ theo thứ tự thuộc các cạnh $AB$, $BC$, $CA$ (khác các đỉnh) sao cho $\dfrac{DA}{DB}=\dfrac{EB}{EC}=\dfrac{FC}{FA}$. Chứng minh rằng $AE=DF$ và $AE\perp DF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ $EH\perp AB$ để có $HE\parallel AC$; hệ quả Thalès cho $HE=BH=DA$, từ đó $AH=AF$ và $\triangle AHE=\triangle FAD$. Hai tam giác bằng nhau cho $AE=DF$ và hai góc phụ nhau, suy ra vuông góc.

- n1 | - | $HE=BH=DA$ | gt | $EH\perp AB$, $HE\parallel AC$, hệ quả của định lí Thalès và $AC=AB$
- n2 | - | $CF=DA$ và $AH=AF$ | n1, gt | từ tỉ số đã cho và $AC=AB$
- n3 | - | $\triangle AHE=\triangle FAD$ | n1, n2 | c.g.c: $AH=FA$, $\widehat{AHE}=\widehat{FAD}=90^\circ$, $HE=AD$
- n4 | - | $AE=DF$ | n3 | hai cạnh tương ứng
- n5 | - | $AE\perp DF$ | n3 | $\widehat{HAE}=\widehat{AFD}$ và $\widehat{HAE}+\widehat{EAF}=90^\circ$

**Phần 2. Trình bày**

[[so-do:n1]]
Kẻ $EH\perp AB$ ($H\in AB$). Vì $AC\perp AB$ nên $HE\parallel AC$.
Từ $\dfrac{EB}{EC}=\dfrac{DA}{DB}$ suy ra $\dfrac{EB}{EB+EC}=\dfrac{DA}{DA+DB}$, tức $\dfrac{BE}{BC}=\dfrac{DA}{AB}$. (1)
Xét $\triangle ABC$ có $HE\parallel AC$ ($H\in AB$, $E\in BC$)
nên $\dfrac{HE}{AC}=\dfrac{BH}{BA}=\dfrac{BE}{BC}$ (hệ quả của định lí Thalès). (2)
Từ (1) và (2): $\dfrac{HE}{AC}=\dfrac{BH}{AB}=\dfrac{DA}{AB}$.
Mà $AC=AB$ (gt) nên $HE=DA$ và $BH=DA$.
[[so-do:n2]]
Từ $\dfrac{FC}{FA}=\dfrac{DA}{DB}$ suy ra $\dfrac{FC}{CA}=\dfrac{DA}{AB}$, mà $CA=AB$ nên $CF=DA$.
Do đó $AH=AB-BH=AB-DA=DB$ và $AF=AC-CF=AB-DA=DB$.
Vậy $AH=AF$.
[[so-do:n3]]
Xét $\triangle AHE$ và $\triangle FAD$ có:
$AH=FA$ (cmt)
$\widehat{AHE}=\widehat{FAD}=90^\circ$
$HE=AD$ (cmt)
nên $\triangle AHE=\triangle FAD$ (c.g.c).
[[so-do:n4]]
Suy ra $AE=DF$ (hai cạnh tương ứng).
[[so-do:n5]]
Từ $\triangle AHE=\triangle FAD$ suy ra $\widehat{HAE}=\widehat{AFD}$.
Gọi $I$ là giao điểm của $AE$ và $DF$.
Vì $E$ nằm trong góc $BAC$ vuông nên $\widehat{HAE}+\widehat{EAF}=90^\circ$, tức $\widehat{AFD}+\widehat{FAI}=90^\circ$.
Xét $\triangle AFI$ có $\widehat{FAI}+\widehat{AFI}=90^\circ$ nên $\widehat{AIF}=90^\circ$.
Vậy $AE\perp DF$.
**hinh:** VHB2-199.png
**hinh_lg:** VHB2-199_lg.png
**nghi_van:** Đề sách ghi "chia trong các cạnh $AB$, $BC$, $CA$ theo cùng một tỉ số"; kho viết rõ $\dfrac{DA}{DB}=\dfrac{EB}{EC}=\dfrac{FC}{FA}$ (đúng với lời giải sách: $BE/BC=AD/AB$ và $CF=AD$).

### VHB2-200 → DE_SAU (HH00166)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 200@p081 (giải p194)
**noi_dung:** Cho hình thang $ABCD$ ($AB\parallel CD$) có diện tích $S$, $AB=\dfrac23CD$. Gọi $E$, $F$ theo thứ tự là trung điểm của $AB$, $CD$. Gọi $M$ là giao điểm của $AF$ và $DE$, $N$ là giao điểm của $BF$ và $CE$. Tính diện tích tứ giác $EMFN$ theo $S$.
**ly_do:** Đề hỏi diện tích theo $S$; lời giải sách dựa hoàn toàn vào tỉ số diện tích (phương pháp diện tích), không có cách chỉ bằng Thalès.

### VHB2-201 → DE_SAU (HH00166)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 201*@p081 (giải p195)
**noi_dung:** a) Cho hình bình hành $ABCD$, $M$ là trung điểm của $BC$. Điểm $N$ trên cạnh $CD$ sao cho $\dfrac{CN}{ND}=2$. Gọi giao điểm của $AM$, $AN$ với $BD$ là $P$, $Q$. Chứng minh rằng $S_{APQ}=\dfrac12S_{AMN}$. b) Chứng minh kết luận ở câu a vẫn đúng nếu thay điều kiện "$M$ là trung điểm của $BC$, $N$ trên cạnh $CD$ sao cho $\dfrac{CN}{ND}=2$" bởi điều kiện tổng quát hơn "$M$ trên cạnh $BC$, $N$ trên cạnh $CD$ sao cho $\dfrac{CN}{ND}=2\cdot\dfrac{BM}{MC}$".
**ly_do:** Kết luận là quan hệ giữa hai diện tích; lời giải sách dùng tỉ số diện tích hai tam giác chung đường cao.

### VHB2-202 → DE_SAU (HH00166)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 202@p081 (giải p196)
**noi_dung:** Cho góc $xOy$ và điểm $M$ cố định thuộc miền trong của góc. Một đường thẳng thay đổi vị trí nhưng luôn đi qua $M$ cắt các tia $Ox$, $Oy$ theo thứ tự ở $A$, $B$. Gọi $S_1$, $S_2$ theo thứ tự là diện tích các tam giác $MOA$, $MOB$. Chứng minh rằng tổng $\dfrac1{S_1}+\dfrac1{S_2}$ có giá trị không đổi.
**ly_do:** Đề và lời giải đều xoay quanh diện tích $S_1$, $S_2$ (tỉ số diện tích hai tam giác chung đường cao), không thể giải không dùng diện tích.

### VHB2-203 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 203*@p082 (giải p196)
**sach:** Dự đoán điểm cố định là giao của phân giác $Oz$ với $AB$; kẻ $CD\parallel Ox$ được tam giác $DOC$ cân, Thalès cho $\dfrac1{OA}+\dfrac1{OB}=\dfrac1a$ nên $a=k$ không đổi.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho góc $xOy$ (khác góc bẹt). Các điểm $A$ và $B$ theo thứ tự chuyển động trên các tia $Ox$ và $Oy$ ($A$, $B$ khác $O$) sao cho $\dfrac1{OA}+\dfrac1{OB}=\dfrac1k$ ($k$ là độ dài không đổi cho trước). Chứng minh rằng đường thẳng $AB$ luôn đi qua một điểm cố định.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $C$ là giao của $AB$ với tia phân giác của góc $xOy$, kẻ $CD\parallel Ox$ ($D\in Oy$). Tam giác $DOC$ cân nên $OD=DC=a$; Thalès cho $\dfrac1{OA}+\dfrac1{OB}=\dfrac1a$, so với giả thiết được $a=k$ không đổi, nên $D$ rồi $C$ cố định.

- n1 | - | $DC=DO=a$ | gt | $CD\parallel Ox$ nên $\widehat{DCO}=\widehat{COA}=\widehat{DOC}$ (so le trong, phân giác)
- n2 | - | $\dfrac{a}{OA}=\dfrac{OB-a}{OB}$ | n1 | hệ quả của định lí Thalès cho $\triangle OAB$ có $DC\parallel OA$
- n3 | - | $\dfrac1{OA}+\dfrac1{OB}=\dfrac1a$ | n2 | chia hai vế cho $a$ và chuyển vế
- n4 | - | $a=k$ | n3, gt | so sánh với giả thiết
- n5 | - | $C$ là điểm cố định | n1, n4 | $D$ thuộc tia $Oy$ với $OD=k$, $DC\parallel Ox$, $DC=k$
- n6 | - | $AB$ luôn đi qua điểm cố định $C$ | n5 | $C\in AB$

**Phần 2. Trình bày**

[[so-do:n1]]
Vẽ tia phân giác $Oz$ của góc $xOy$, cắt $AB$ tại $C$ (tia $Oz$ nằm trong góc nên cắt đoạn $AB$).
Qua $C$ kẻ đường thẳng song song với $Ox$, cắt $OB$ tại $D$ ($D$ thuộc đoạn $OB$ vì $C$ thuộc đoạn $AB$).
Vì $CD\parallel Ox$ nên $\widehat{DCO}=\widehat{COA}$ (so le trong).
Mà $\widehat{COA}=\widehat{DOC}$ ($Oz$ là phân giác) nên $\widehat{DCO}=\widehat{DOC}$.
Suy ra $\triangle DOC$ cân tại $D$, tức $DC=DO$. Đặt $DC=DO=a$.
[[so-do:n2]]
Xét $\triangle OAB$ có $DC\parallel OA$ ($D\in OB$, $C\in AB$)
nên $\dfrac{DC}{OA}=\dfrac{BD}{BO}$ (hệ quả của định lí Thalès).
Mà $BD=OB-OD=OB-a$ nên $\dfrac{a}{OA}=\dfrac{OB-a}{OB}$.
[[so-do:n3]]
Suy ra $\dfrac{a}{OA}=1-\dfrac{a}{OB}$, tức $\dfrac{a}{OA}+\dfrac{a}{OB}=1$.
Chia hai vế cho $a$: $\dfrac1{OA}+\dfrac1{OB}=\dfrac1a$. (1)
[[so-do:n4]]
Theo giả thiết $\dfrac1{OA}+\dfrac1{OB}=\dfrac1k$. (2)
Từ (1) và (2) suy ra $a=k$.
[[so-do:n5]]
Vậy $OD=DC=k$, trong đó $D$ thuộc tia $Oy$ cách $O$ một đoạn $k$ nên $D$ cố định.
Điểm $C$ nằm trên đường thẳng qua $D$ song song $Ox$, cùng phía với tia $Ox$ và cách $D$ đoạn $k$, nên $C$ cố định
(đó là đỉnh thứ tư của hình thoi cạnh $k$ có hai cạnh liền kề là $OD$ trên tia $Oy$ và đoạn $k$ trên tia $Ox$ kể từ $O$).
[[so-do:n6]]
Theo cách vẽ, $C$ thuộc đường thẳng $AB$.
Vậy đường thẳng $AB$ luôn đi qua điểm cố định $C$.
**hinh:** VHB2-203.png
**hinh_lg:** VHB2-203_lg.png
**nghi_van:** Đề sách không nói góc $xOy$ khác góc bẹt; đã thêm (góc bẹt thì $AB$ đi qua $O$ trong mọi trường hợp, bài vô nghĩa). Kho giải chiều thuận "$AB$ đi qua điểm cố định" đúng như sách.

### VHB2-204 → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 204*@p082 (giải p197)
**sach:** Sách hạ các đường vuông góc xuống $BD$ để đổi $\dfrac{EM}{MF}$ thành tỉ số $\dfrac{OA}{OC}$ ($O$ là giao hai đường chéo). Kho dùng cách khác: kẻ các đường song song hai đáy qua $E$, $F$ rồi hệ quả Thalès; chỉ cần Thalès nên giữ ở HH00127 (hồ sơ nghi bổ đề hình thang, không dùng ở đây).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$). Điểm $E$ thuộc cạnh $AD$, điểm $F$ thuộc cạnh $BC$ sao cho $\dfrac{DE}{DA}=\dfrac{BF}{BC}=\dfrac13$. Gọi $M$, $N$ theo thứ tự là giao điểm của $EF$ với $BD$, $AC$. Chứng minh rằng $EM=NF$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $E$, $F$ kẻ các đường song song $AB$ cắt $BD$ (rồi $AC$); các đoạn kẻ thêm có độ dài $\dfrac13AB$, $\dfrac13CD$ (với $BD$) và $\dfrac23CD$, $\dfrac23AB$ (với $AC$). Hệ quả Thalès cho $\dfrac{EM}{MF}=\dfrac{AB}{CD}=\dfrac{NF}{NE}$, từ đó $MF=NE$ và $EM=NF$.

- n1 | - | $EP=\dfrac13AB$ và $FR=\dfrac13CD$ ($P$, $R\in BD$) | gt | hệ quả của định lí Thalès cho $\triangle DAB$ và $\triangle BCD$
- n2 | - | $\dfrac{EM}{MF}=\dfrac{AB}{CD}$ | n1 | $EP\parallel FR$, hệ quả của định lí Thalès
- n3 | - | $EP'=\dfrac23CD$ và $FR'=\dfrac23AB$ ($P'$, $R'\in AC$) | gt | hệ quả của định lí Thalès cho $\triangle ADC$ và $\triangle CBA$
- n4 | - | $\dfrac{NF}{NE}=\dfrac{AB}{CD}$ | n3 | $EP'\parallel FR'$, hệ quả của định lí Thalès
- n5 | - | $MF=NE$ | n2, n4 | cộng $1$ vào hai vế của $\dfrac{EM}{MF}=\dfrac{NF}{NE}$
- n6 | - | $EM=NF$ | n5 | $EM=EF-MF$, $NF=EF-NE$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $E$ kẻ đường thẳng song song $AB$ cắt $BD$ tại $P$; qua $F$ kẻ đường thẳng song song $AB$ cắt $BD$ tại $R$.
Xét $\triangle DAB$ có $EP\parallel AB$ ($E\in DA$, $P\in DB$)
nên $\dfrac{EP}{AB}=\dfrac{DE}{DA}=\dfrac13$ (hệ quả của định lí Thalès), suy ra $EP=\dfrac13AB$.
Vì $AB\parallel CD$ nên $FR\parallel CD$.
Xét $\triangle BCD$ có $FR\parallel CD$ ($F\in BC$, $R\in BD$)
nên $\dfrac{FR}{CD}=\dfrac{BF}{BC}=\dfrac13$ (hệ quả của định lí Thalès), suy ra $FR=\dfrac13CD$.
[[so-do:n2]]
$E$ và $F$ nằm khác phía đối với $BD$ nên $M$ nằm giữa $E$ và $F$.
Có $EP\parallel FR$ (cùng song song $AB$), $M=EF\cap PR$
nên $\dfrac{EM}{MF}=\dfrac{EP}{FR}=\dfrac{AB}{CD}$ (hệ quả của định lí Thalès). (1)
[[so-do:n3]]
Qua $E$ kẻ đường thẳng song song $AB$ cắt $AC$ tại $P'$; qua $F$ kẻ đường thẳng song song $AB$ cắt $AC$ tại $R'$.
Xét $\triangle ADC$ có $EP'\parallel DC$ ($E\in AD$, $P'\in AC$)
nên $\dfrac{EP'}{DC}=\dfrac{AE}{AD}=1-\dfrac13=\dfrac23$ (hệ quả của định lí Thalès), suy ra $EP'=\dfrac23CD$.
Xét $\triangle CBA$ có $FR'\parallel AB$ ($F\in CB$, $R'\in CA$)
nên $\dfrac{FR'}{AB}=\dfrac{CF}{CB}=1-\dfrac13=\dfrac23$ (hệ quả của định lí Thalès), suy ra $FR'=\dfrac23AB$.
[[so-do:n4]]
$E$ và $F$ nằm khác phía đối với $AC$ nên $N$ nằm giữa $E$ và $F$.
Có $EP'\parallel FR'$, $N=EF\cap P'R'$
nên $\dfrac{NF}{NE}=\dfrac{FR'}{EP'}=\dfrac{\frac23AB}{\frac23CD}=\dfrac{AB}{CD}$ (hệ quả của định lí Thalès). (2)
[[so-do:n5]]
Từ (1) và (2): $\dfrac{EM}{MF}=\dfrac{NF}{NE}$.
Suy ra $\dfrac{EM}{MF}+1=\dfrac{NF}{NE}+1$, tức $\dfrac{EM+MF}{MF}=\dfrac{NF+NE}{NE}$, hay $\dfrac{EF}{MF}=\dfrac{EF}{NE}$.
Vậy $MF=NE$.
[[so-do:n6]]
Vì $M$, $N$ nằm giữa $E$, $F$ nên $EM=EF-MF$ và $NF=EF-NE$.
Mà $MF=NE$ nên $EM=NF$.
**hinh:** VHB2-204.png
**hinh_lg:** VHB2-204_lg.png
**nghi_van:** Ở n2 và n4 dùng hệ quả của định lí Thalès dạng "hai đường song song $EP$, $FR$ bị hai đường thẳng $EF$, $PR$ cắt nhau tại $M$" (hình chữ X). Hồ sơ nghi bài thuộc HH00162 (bổ đề hình thang); lời giải kho không cần bổ đề nên xếp HH00127, đổi mã nếu Thùy muốn.

### VHB2-205a → HH00127
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 205a@p082 (giải p197)
**sach:** Sách chỉ ghi "xem câu b" (dùng định lí Mê-nê-la-uýt). Kho giải bằng hệ quả Thalès, kẻ $CK\parallel AB$, để không phụ thuộc định lí Mê-nê-la-uýt.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Trên tia đối của tia $CB$ lấy điểm $A'$ sao cho $BA':A'C=3$. Trên cạnh $CA$ lấy điểm $B'$ sao cho $CB':B'A=1:3$. Gọi $C'$ là giao điểm của $A'B'$ và $AB$. Chứng minh rằng $C'$ là trung điểm của $AB$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Qua $C$ kẻ đường thẳng song song $AB$ cắt $A'B'$ tại $K$. Hệ quả Thalès cho hai tam giác có chung đỉnh $A'$ và $B'$ đều cho $CK=\dfrac13$ của $BC'$ và của $AC'$, nên $BC'=AC'$.

- n1 | - | $\dfrac{CK}{BC'}=\dfrac13$ | gt | hệ quả của định lí Thalès cho $\triangle A'BC'$ có $CK\parallel BC'$ và $\dfrac{A'C}{A'B}=\dfrac13$
- n2 | - | $\dfrac{CK}{AC'}=\dfrac13$ | gt | hệ quả của định lí Thalès cho $\triangle B'AC'$ có $CK\parallel AC'$ và $\dfrac{B'C}{B'A}=\dfrac13$
- n3 | - | $C'$ là trung điểm của $AB$ | n1, n2 | $BC'=AC'=3CK$, $C'$ thuộc đường thẳng $AB$

**Phần 2. Trình bày**

[[so-do:n1]]
Qua $C$ kẻ đường thẳng song song $AB$, cắt đường thẳng $A'B'$ tại $K$.
Vì $BA':A'C=3$ nên $A'C=\dfrac13A'B$, tức $\dfrac{A'C}{A'B}=\dfrac13$.
Xét $\triangle A'BC'$ có $CK\parallel BC'$ ($C\in A'B$, $K\in A'C'$)
nên $\dfrac{CK}{BC'}=\dfrac{A'C}{A'B}=\dfrac13$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Vì $CB':B'A=1:3$ nên $\dfrac{B'C}{B'A}=\dfrac13$.
Xét $\triangle B'AC'$ có $CK\parallel AC'$ ($C\in B'A$, $K\in B'C'$)
nên $\dfrac{CK}{AC'}=\dfrac{B'C}{B'A}=\dfrac13$ (hệ quả của định lí Thalès). (2)
[[so-do:n3]]
Từ (1) và (2) suy ra $BC'=3CK=AC'$.
Mà $C'$ thuộc đường thẳng $AB$ và $A\ne B$ nên $C'$ là trung điểm của $AB$.
**hinh:** VHB2-205a.png
**hinh_lg:** VHB2-205a_lg.png
**nghi_van:** Ở bước (2), $K$ và $C'$ nằm khác phía đối với $B'$ nên đây là dạng hình chữ X của hệ quả Thalès.

### VHB2-205b → TRUNG (TCHH-5.9a)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 205b@p082 (giải p197–198)
**ly_do:** Chứng minh định lí Mê-nê-la-uýt cho ba điểm thẳng hàng trên ba đường thẳng chứa cạnh; đúng là ý a của TCHH-5.9 (chỉ đổi tên điểm và viết tỉ số nghịch đảo).

### VHB2-206a → TRUNG (NDT-H3.17a)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 206a@p082 (giải p198)
**ly_do:** Định lí Xê-va cho ba điểm trên ba cạnh (chiều thuận) đã nằm trong NDT-H3.17a (chứng minh cả hai chiều bằng cùng cách kẻ song song qua $A$).

### VHB2-206b → HH00131
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 206b@p082 (giải p198)
**sach:** "Chứng minh tương tự câu a": qua $A$ kẻ đường thẳng song song $BC$ cắt $BB'$, $CC'$ rồi nhân ba tỉ số. Kho viết đủ cho cấu hình hai điểm ngoài tam giác.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$. Các điểm $A'$, $B'$, $C'$ lần lượt thuộc các đường thẳng $BC$, $CA$, $AB$ (khác các đỉnh), trong đó có đúng hai điểm nằm ngoài tam giác. Chứng minh rằng nếu $AA'$, $BB'$, $CC'$ đồng quy thì $\dfrac{AB'}{B'C}\cdot\dfrac{CA'}{A'B}\cdot\dfrac{BC'}{C'A}=1$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $O$ là điểm đồng quy. Qua $A$ kẻ đường thẳng $d\parallel BC$ cắt $BB'$ tại $N$, $CC'$ tại $M$: hai tỉ số đầu đổi thành $\dfrac{AN}{BC}$ và $\dfrac{BC}{AM}$, tỉ số còn lại đổi thành $\dfrac{MA}{AN}$ nhờ ba đường thẳng đồng quy tại $O$. Nhân ba tỉ số thì triệt tiêu hết.

- n1 | - | $\dfrac{AB'}{B'C}=\dfrac{AN}{BC}$ | gt | hệ quả của định lí Thalès, $AN\parallel BC$, hai đường thẳng $CB'$ và $BB'$ cắt nhau tại $B'$
- n2 | - | $\dfrac{BC'}{C'A}=\dfrac{BC}{AM}$ | gt | hệ quả của định lí Thalès, $AM\parallel BC$, hai đường thẳng $BC'$ và $CC'$ cắt nhau tại $C'$
- n3 | - | $\dfrac{CA'}{A'B}=\dfrac{MA}{AN}$ | gt | hệ quả của định lí Thalès cho các tam giác $OCA'$, $OA'B$ ($O$ là điểm đồng quy)
- n4 | - | $\dfrac{AB'}{B'C}\cdot\dfrac{CA'}{A'B}\cdot\dfrac{BC'}{C'A}=1$ | n1, n2, n3 | nhân vế với vế, $AN$, $AM$, $BC$ triệt tiêu

**Phần 2. Trình bày**

[[so-do:n1]]
Gọi $O$ là giao điểm của $AA'$, $BB'$, $CC'$.
Qua $A$ kẻ đường thẳng $d$ song song $BC$, cắt $BB'$ tại $N$ và $CC'$ tại $M$.
Hai đường thẳng $B'C$ và $B'B$ cắt nhau tại $B'$; $A\in B'C$, $N\in B'B$ và $AN\parallel BC$
nên $\dfrac{B'A}{B'C}=\dfrac{AN}{CB}$ (hệ quả của định lí Thalès). (1)
[[so-do:n2]]
Hai đường thẳng $C'B$ và $C'C$ cắt nhau tại $C'$; $A\in C'B$, $M\in C'C$ và $AM\parallel BC$
nên $\dfrac{C'A}{C'B}=\dfrac{AM}{BC}$ (hệ quả của định lí Thalès), tức $\dfrac{BC'}{C'A}=\dfrac{BC}{AM}$. (2)
[[so-do:n3]]
Điểm $O$ không nằm trên $BC$ (nếu không thì $A'\equiv O$ và $BB'\equiv BC$, suy ra $B'\equiv C$, trái giả thiết).
Xét $\triangle OCA'$ có $MA\parallel CA'$ ($M\in OC$, $A\in OA'$)
nên $\dfrac{MA}{CA'}=\dfrac{OA}{OA'}$ (hệ quả của định lí Thalès).
Xét $\triangle OA'B$ có $AN\parallel A'B$ ($A\in OA'$, $N\in OB$)
nên $\dfrac{AN}{A'B}=\dfrac{OA}{OA'}$ (hệ quả của định lí Thalès).
Suy ra $\dfrac{MA}{CA'}=\dfrac{AN}{A'B}$, tức $\dfrac{CA'}{A'B}=\dfrac{MA}{AN}$. (3)
[[so-do:n4]]
Nhân (1), (2), (3) vế theo vế:
$\dfrac{AB'}{B'C}\cdot\dfrac{CA'}{A'B}\cdot\dfrac{BC'}{C'A}=\dfrac{AN}{BC}\cdot\dfrac{MA}{AN}\cdot\dfrac{BC}{AM}=1$.
**hinh:** VHB2-206b.png
**hinh_lg:** VHB2-206b_lg.png
**nghi_van:** (1) Lập luận dùng tỉ số độ dài không dấu nên không phụ thuộc vị trí $O$, kể cả khi $O$ nằm trong tam giác; đề giữ đúng cấu hình sách yêu cầu (đúng hai điểm ngoài tam giác, khi đó $O$ nằm ngoài). (2) Hình đề vẽ $A'$ trong cạnh $BC$, $B'$, $C'$ ngoài cạnh phía $A$. (3) Ở n3 dùng tam giác $OCA'$ với $M$ trên đường $OC$: cần $O\ne C$, đúng vì $C$ không nằm trên $AA'$ khi $A'\ne C$.

### VHB2-207 → DE_SAU (HH00135)
**nguon:** Nâng cao và phát triển Toán 8 tập 2 – Vũ Hữu Bình · §13 BT 207@p082 (giải p199)
**noi_dung:** Cho tam giác $ABC$. Tâm $O$ của các hình chữ nhật $MNPQ$ thay đổi nhưng luôn có $M$ thuộc $AB$, $N$ thuộc $AC$, $P$ và $Q$ thuộc $BC$, chuyển động trên đường nào?
**ly_do:** Bài tìm quỹ tích (đường chuyển động của tâm $O$, kể cả phần giới hạn "trừ $E$ và $F$" ở lời giải sách); lô sau làm cùng nhóm quỹ tích.
