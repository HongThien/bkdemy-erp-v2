# ĐỀ | Đề cương ôn tập cuối học kì I Toán 9 — THCS Nguyễn Trường Tộ (Hà Nội) · phần Hình
nam: 2024
bo_sach: KNTT
kieu: de_cuong

## PHẦN 1 | Dạng 4. Bài toán hình học tổng hợp (Bài 18–23) | tu_luan

### Bài 18 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O)$, đường kính $AB=2R$. Vẽ các tiếp tuyến $Ax$, $By$ nằm cùng về một phía so với đường thẳng $AB$. Trên $Ax$, $By$ lần lượt lấy điểm $C$, $D$ sao cho $\widehat{COD}=90^\circ$.
a) Chứng minh $CD=AC+BD$.
b) Chứng minh $CD$ là tiếp tuyến của đường tròn $(O)$ và tích $AC\cdot BD$ không đổi.
c) Gọi $N$ là giao điểm của $AD$ và $BC$. Chứng minh $MN\parallel AC$ với $M$ là tiếp điểm của $CD$ với $(O)$.
**Hình:** de_P1B18.png
**Hình giải:** giai_P1B18.png
**Ghi chú:** đề in thiếu tên tích ("tích không đổi"); đây là bài chuẩn nên hiểu là tích $AC\cdot BD$ (bằng $R^2$). Hình giải dựng thêm $E$ đối xứng với $C$ qua $O$, tiếp điểm $M$ và giao điểm $N$. Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vì $\widehat{COD}=90^\circ$ nên lấy điểm $E$ đối xứng với $C$ qua $O$ để chuyển đoạn $AC$ sang cùng đường thẳng với $BD$; sau đó mọi ý đều xoay quanh hai tiếp tuyến cắt nhau và tam giác vuông $COD$.

**Bước 1.** Ý a: lấy $E$ đối xứng với $C$ qua $O$, chứng minh hai tam giác $OAC$ và $OBE$ bằng nhau để có $E$ nằm trên đường thẳng $By$ và đoạn $BE$ bằng đoạn $AC$.

**Bước 2.** Ý a: dùng $\widehat{COD}=90^\circ$ để chứng minh hai tam giác $DOC$ và $DOE$ bằng nhau, rồi cộng đoạn thẳng trên đường $By$ để đi tới hệ thức cần chứng minh.

**Bước 3.** Ý b: kẻ $OM\perp CD$, so sánh hai tam giác vuông $OMD$ và $OBD$ có chung cạnh huyền để chỉ ra khoảng cách từ $O$ đến $CD$ đúng bằng bán kính.

**Bước 4.** Ý b: dùng tính chất hai tiếp tuyến cắt nhau và hai tam giác vuông đồng dạng chia tam giác $COD$ theo đường cao $OM$ để viết tích $AC\cdot BD$ theo $OM$.

**Bước 5.** Ý c: dùng $AC\parallel BD$ để viết tỉ số $\dfrac{NC}{NB}$ qua hai đoạn song song, rồi so sánh với tỉ số $\dfrac{MC}{MD}$ có từ hai tiếp tuyến cắt nhau.

**Bước 6.** Ý c: dùng định lí Thales đảo trong tam giác $CBD$ để có $MN$ song song với $BD$, rồi chuyển sang song song với $AC$.

**Chú ý:** điểm $E$ nằm ở phía bên kia đường thẳng $AB$ so với $D$ nên phải chứng minh $B$ nằm giữa $D$ và $E$ trước khi cộng $DB+BE$.

**Phần 2. Trình bày**

a) Vì $Ax$, $By$ là hai tiếp tuyến của $(O)$ (gt)
nên $Ax\perp AB$ và $By\perp AB$ (tiếp tuyến vuông góc với bán kính),
suy ra $Ax\parallel By$.
Gọi $E$ là điểm đối xứng với $C$ qua $O$.
Khi đó $O$ là trung điểm của $CE$ nên $OC=OE$.
Xét $\triangle OAC$ và $\triangle OBE$ có:
$OA=OB=R$ (gt);
$\widehat{AOC}=\widehat{BOE}$ (hai góc đối đỉnh);
$OC=OE$ (cmt)
nên $\triangle OAC=\triangle OBE$ (c.g.c).
Suy ra $AC=BE$ (hai cạnh tương ứng). (1)
Suy ra $\widehat{OBE}=\widehat{OAC}=90^\circ$ (hai góc tương ứng, $Ax\perp AB$).
Do đó $BE\perp AB$ tại $B$.
Mà $By\perp AB$ tại $B$ (cmt) nên $E$ thuộc đường thẳng $By$.
Vì $O$ nằm giữa $C$ và $E$ nên $C$, $E$ nằm khác phía đối với $AB$.
Mà $D$, $C$ nằm cùng phía đối với $AB$ (gt)
nên $D$, $E$ nằm khác phía đối với $AB$.
Vì $D$, $E$ cùng thuộc $By$ và $By$ cắt $AB$ tại $B$
nên $B$ nằm giữa $D$ và $E$.
Suy ra $DE=DB+BE=BD+AC$. (2)
Xét $\triangle DOC$ và $\triangle DOE$ có:
$OC=OE$ (cmt);
$\widehat{DOC}=\widehat{DOE}=90^\circ$ ($\widehat{COD}=90^\circ$ (gt); $C$, $O$, $E$ thẳng hàng);
$OD$ chung
nên $\triangle DOC=\triangle DOE$ (c.g.c).
Suy ra $DC=DE$ (hai cạnh tương ứng) (3)
và $\widehat{ODC}=\widehat{ODE}$ (hai góc tương ứng). (4)
Từ (2) và (3) suy ra $CD=AC+BD$.

b) Kẻ $OM\perp CD$ tại $M$ ($M$ thuộc $CD$).
Vì $\triangle COD$ vuông tại $O$ (gt)
nên $\widehat{OCD}$, $\widehat{ODC}$ là hai góc nhọn,
do đó $M$ nằm giữa $C$ và $D$.
Vì $B$ nằm giữa $D$ và $E$ (cmt)
nên hai tia $DB$, $DE$ trùng nhau,
suy ra $\widehat{ODB}=\widehat{ODE}$.
Vì $M$ thuộc tia $DC$ nên $\widehat{ODM}=\widehat{ODC}$.
Từ (4) suy ra $\widehat{ODM}=\widehat{ODB}$.
Xét $\triangle OMD$ và $\triangle OBD$ có:
$\widehat{OMD}=\widehat{OBD}=90^\circ$ ($OM\perp CD$ (cách vẽ); $By\perp OB$ (tiếp tuyến vuông góc với bán kính));
$\widehat{ODM}=\widehat{ODB}$ (cmt);
$OD$ chung
nên $\triangle OMD=\triangle OBD$ (cạnh huyền - góc nhọn).
Suy ra $OM=OB=R$ (hai cạnh tương ứng).
Vậy $M$ thuộc $(O)$ và $CD\perp OM$ tại $M$
nên $CD$ là tiếp tuyến của $(O)$ tại $M$ (dấu hiệu nhận biết tiếp tuyến).
Vì $CA$, $CM$ là hai tiếp tuyến của $(O)$ cắt nhau tại $C$
nên $CA=CM$ (tính chất hai tiếp tuyến cắt nhau).
Vì $DB$, $DM$ là hai tiếp tuyến của $(O)$ cắt nhau tại $D$
nên $DB=DM$ (tính chất hai tiếp tuyến cắt nhau).
Vì $M$ nằm giữa $C$ và $D$ (cmt) nên tia $OM$ nằm giữa hai tia $OC$, $OD$,
suy ra $\widehat{COM}+\widehat{MOD}=\widehat{COD}=90^\circ$. (5)
Xét $\triangle OMD$ vuông tại $M$
có $\widehat{MOD}+\widehat{MDO}=90^\circ$ (hai góc nhọn phụ nhau). (6)
Từ (5) và (6) suy ra $\widehat{COM}=\widehat{MDO}$.
Xét $\triangle MOC$ và $\triangle MDO$ có:
$\widehat{OMC}=\widehat{DMO}=90^\circ$ ($OM\perp CD$ (cách vẽ));
$\widehat{COM}=\widehat{MDO}$ (cmt)
nên $\triangle MOC\backsim\triangle MDO$ (g.g).
Suy ra $\dfrac{MC}{MO}=\dfrac{MO}{MD}$ (hai tam giác đồng dạng),
tức là $MO^2=MC\cdot MD$.
Mà $MO=R$, $MC=AC$, $MD=BD$ (cmt)
nên $AC\cdot BD=R^2$.
Vậy tích $AC\cdot BD=R^2$ không đổi.

c) Vì $AC\parallel BD$ (cmt)
nên $\widehat{NAC}=\widehat{NDB}$ (hai góc so le trong).
Xét $\triangle NAC$ và $\triangle NDB$ có:
$\widehat{NAC}=\widehat{NDB}$ (cmt);
$\widehat{ANC}=\widehat{DNB}$ (hai góc đối đỉnh)
nên $\triangle NAC\backsim\triangle NDB$ (g.g).
Suy ra $\dfrac{NC}{NB}=\dfrac{AC}{BD}$ (hai tam giác đồng dạng). (7)
Mà $CM=CA$ và $DM=DB$ (cmt)
nên $\dfrac{CM}{MD}=\dfrac{AC}{BD}$. (8)
Từ (7) và (8) suy ra $\dfrac{CN}{NB}=\dfrac{CM}{MD}$.
Xét $\triangle CBD$ có $M$ thuộc $CD$, $N$ thuộc $CB$
và $\dfrac{CM}{MD}=\dfrac{CN}{NB}$
nên $MN\parallel BD$ (định lí Thales đảo).
Mà $AC\parallel BD$ (cmt)
nên $MN\parallel AC$.

### Bài 19 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ cân tại $A$. Đường tròn tâm $D$ đường kính $BC$ cắt $AB$, $AC$ lần lượt tại $E$, $F$. Gọi $H$ là giao điểm của $BF$ và $CE$.
a) Chứng minh $A$, $E$, $H$, $F$ cùng thuộc một đường tròn tâm $O$.
b) Chứng minh $DE$ là tiếp tuyến của $(O)$.
**Hình:** de_P1B19.png
**Hình giải:** giai_P1B19.png
**Ghi chú:** đề không nói tam giác nhọn, nhưng đường tròn đường kính $BC$ chỉ cắt hai cạnh $AB$, $AC$ tại $E$, $F$ (khác $B$, $C$) khi $\widehat{BAC}<90^\circ$; lời giải dùng $E$ thuộc cạnh $AB$ và $F$ thuộc cạnh $AC$ như hình vẽ. Hình giải dựng thêm $O$, $AD$, $OE$, $DE$ và đường tròn $(O)$. Đã kiểm bằng toạ độ số trên 3000 tam giác cân ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vì $D$ là trung điểm của $BC$ nên $DE=DB=DC$ cho góc vuông tại $E$ và $F$; hai góc vuông này cùng nhìn đoạn $AH$ nên tìm được tâm $O$, và tiếp tuyến $DE$ suy ra từ hai tam giác cân kết hợp tam giác vuông $DHC$.

**Bước 1.** Ý a: nhận ra $ED$ là đường trung tuyến bằng nửa cạnh $BC$ trong tam giác $BEC$ (và $FD$ trong tam giác $BFC$) để suy ra các góc vuông tại $E$ và $F$.

**Bước 2.** Ý a: từ $CE\perp AB$ và $BF\perp AC$ xét hai tam giác vuông $AEH$, $AFH$ có chung cạnh huyền $AH$ để tìm điểm cách đều cả bốn điểm.

**Bước 3.** Ý b: chứng minh $A$, $H$, $D$ thẳng hàng bằng tam giác cân và ba đường cao đồng quy, rồi xác định thứ tự các điểm $A$, $O$, $H$, $D$ trên đường thẳng đó.

**Bước 4.** Ý b: dùng tam giác cân $OEH$ (hai bán kính) để viết $\widehat{OEH}$ bằng góc đối đỉnh tại $H$, là một góc nhọn của tam giác vuông $DHC$.

**Bước 5.** Ý b: dùng tam giác cân $DEC$ cùng tổng hai góc nhọn của tam giác vuông $DHC$ để cộng hai góc thành $\widehat{OED}$, rồi kết luận bằng dấu hiệu nhận biết tiếp tuyến.

**Chú ý:** phải chỉ ra $H$ nằm giữa $O$ và $D$ thì mới cộng được hai góc $\widehat{OEH}$ và $\widehat{HED}$ thành $\widehat{OED}$.

**Phần 2. Trình bày**

a) Vì $D$ là tâm của đường tròn đường kính $BC$ (gt)
nên $D$ là trung điểm của $BC$
và $DB=DC=DE=DF=\dfrac{BC}{2}$ (bán kính).
Xét $\triangle BEC$ có $ED$ là đường trung tuyến ứng với cạnh $BC$
và $ED=\dfrac{BC}{2}$ (cmt)
nên $\triangle BEC$ vuông tại $E$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Suy ra $CE\perp AB$.
Xét $\triangle BFC$ có $FD$ là đường trung tuyến ứng với cạnh $BC$
và $FD=\dfrac{BC}{2}$ (cmt)
nên $\triangle BFC$ vuông tại $F$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Suy ra $BF\perp AC$.
Vì $H$ thuộc $CE$ nên $HE\perp AB$, suy ra $\widehat{AEH}=90^\circ$.
Vì $H$ thuộc $BF$ nên $HF\perp AC$, suy ra $\widehat{AFH}=90^\circ$.
Gọi $O$ là trung điểm của $AH$.
Xét $\triangle AEH$ vuông tại $E$
có $EO$ là đường trung tuyến ứng với cạnh huyền $AH$
nên $OE=\dfrac{AH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle AFH$ vuông tại $F$
có $FO$ là đường trung tuyến ứng với cạnh huyền $AH$
nên $OF=\dfrac{AH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $OA=OH=\dfrac{AH}{2}$ ($O$ là trung điểm của $AH$).
Do đó $OA=OE=OH=OF=\dfrac{AH}{2}$.
Vậy $A$, $E$, $H$, $F$ cùng thuộc đường tròn tâm $O$ là trung điểm của $AH$,
bán kính $\dfrac{AH}{2}$.

b) Vì $E$ thuộc cạnh $AB$ và $F$ thuộc cạnh $AC$ (gt)
nên hai đoạn $BF$, $CE$ cắt nhau tại $H$ nằm trong $\triangle ABC$.
Do đó $H$ nằm giữa $B$ và $F$, nằm giữa $C$ và $E$.
Vì $\triangle ABC$ cân tại $A$ (gt) và $D$ là trung điểm của $BC$
nên $AD\perp BC$ (tính chất tam giác cân).
Vì $H$ là giao điểm của hai đường cao $BF$, $CE$ (cmt)
nên $AH\perp BC$ (ba đường cao của tam giác đồng quy).
Do đó $A$, $H$, $D$ thẳng hàng (qua $A$ chỉ có một đường thẳng vuông góc với $BC$).
Mà $H$ nằm trong $\triangle ABC$ nên $H$ nằm giữa $A$ và $D$.
Vì $O$ là trung điểm của $AH$ (cmt)
nên $O$ nằm giữa $A$ và $H$,
suy ra $H$ nằm giữa $O$ và $D$.
Vì $OE=OH$ (cmt) nên $\triangle OEH$ cân tại $O$,
suy ra $\widehat{OEH}=\widehat{OHE}$ (tính chất tam giác cân).
Mà $\widehat{OHE}=\widehat{DHC}$ (hai góc đối đỉnh)
nên $\widehat{OEH}=\widehat{DHC}$. (1)
Vì $DE=DC$ (cmt) nên $\triangle DEC$ cân tại $D$,
suy ra $\widehat{DEC}=\widehat{DCE}$ (tính chất tam giác cân).
Mà $H$ thuộc đoạn $EC$
nên $\widehat{HED}=\widehat{DEC}$ và $\widehat{DCH}=\widehat{DCE}$,
suy ra $\widehat{HED}=\widehat{DCH}$. (2)
Xét $\triangle DHC$ vuông tại $D$ ($AD\perp BC$ (cmt))
có $\widehat{DHC}+\widehat{DCH}=90^\circ$ (hai góc nhọn phụ nhau). (3)
Từ (1), (2) và (3) suy ra $\widehat{OEH}+\widehat{HED}=90^\circ$.
Vì $H$ nằm giữa $O$ và $D$ nên tia $EH$ nằm giữa hai tia $EO$, $ED$.
Do đó $\widehat{OED}=\widehat{OEH}+\widehat{HED}=90^\circ$.
Suy ra $DE\perp OE$ tại $E$.
Mà $E$ thuộc $(O)$ (cmt)
nên $DE$ là tiếp tuyến của $(O)$ tại $E$ (dấu hiệu nhận biết tiếp tuyến).

### Bài 20 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho $(O;R)$, hai tiếp tuyến tại $A$ và $B$ của $(O)$ cắt nhau tại $M$, đoạn $MO$ cắt $(O)$ tại $I$ và cắt $AB$ tại $K$.
a) Chứng minh $OK\cdot OM=R^2$; $KO\cdot KM=\dfrac{AB^2}{4}$.
b) Chứng minh $I$ là tâm đường tròn nội tiếp $\triangle MAB$.
c) Gọi $H$ là trực tâm của $\triangle MAB$. Tứ giác $AOBH$ là hình gì? Tại sao?
d) Biết tứ giác $AOBH$ là hình vuông, hãy tính khoảng cách từ điểm $M$ đến tâm của $(O)$.
**Hình:** de_P1B20.png
**Hình giải:** giai_P1B20.png
**Ghi chú:** đề in "OK.OM", "KO.KM" (dấu chấm là dấu nhân) nên gõ lại bằng $\cdot$. Hình giải dựng thêm hai bán kính $OA$, $OB$, đoạn $AI$ và trực tâm $H$. Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên (cả trường hợp hình vuông $OM=R\sqrt{2}$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tiếp tuyến cắt nhau cho $OM$ là đường trung trực của $AB$, nên $AK$ là đường cao của tam giác vuông $OAM$ và mọi hệ thức đều suy ra từ tam giác vuông này và tam giác cân $OAI$.

**Bước 1.** Ý a: dùng $MA=MB$ và $OA=OB$ để chứng minh $OM$ là đường trung trực của $AB$, từ đó $OM\perp AB$ tại trung điểm $K$.

**Bước 2.** Ý a: trong tam giác vuông $OAM$ (tiếp tuyến vuông góc với bán kính) dùng hai tam giác đồng dạng chung góc $O$ để có tích thứ nhất, rồi dùng định lý Pythagore trong tam giác $OKA$ để viết $KA^2$ qua $OK$ và $KM$.

**Bước 3.** Ý b: tâm đường tròn nội tiếp là giao các đường phân giác; đã có $MI$ là phân giác nên chỉ cần chứng minh $AI$ là phân giác bằng cách tính hai góc $\widehat{MAI}$ và $\widehat{IAB}$ cùng phụ với một góc.

**Bước 4.** Ý c: dùng $BH\perp MA$ và $OA\perp MA$ (tương tự cho cặp còn lại) để có hai cặp cạnh đối song song, rồi dùng $OA=OB$ để xác định loại hình bình hành.

**Bước 5.** Ý d: hình vuông cho $\widehat{AOB}=90^\circ$; dùng $OM$ là tia phân giác để tính góc $\widehat{AOM}$, nhận ra tam giác $OAM$ đặc biệt rồi tính $OM$ bằng định lý Pythagore.

**Chú ý:** ở ý b phải nêu đúng thứ tự các điểm $O$, $K$, $I$, $M$ trên đường thẳng $MO$ thì mới đổi được các góc.

**Phần 2. Trình bày**

a) Vì $MA$, $MB$ là hai tiếp tuyến của $(O)$ cắt nhau tại $M$ (gt)
nên $MA=MB$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OB=R$ (gt)
nên $MO$ là đường trung trực của $AB$ (hai điểm $M$, $O$ cách đều hai đầu mút $A$, $B$).
Suy ra $OM\perp AB$ tại $K$ và $K$ là trung điểm của $AB$.
Vì $MA\perp OA$ (tiếp tuyến vuông góc với bán kính)
nên $\triangle OAM$ vuông tại $A$.
Xét $\triangle OKA$ và $\triangle OAM$ có:
$\widehat{OKA}=\widehat{OAM}=90^\circ$ (cmt);
$\widehat{AOM}$ chung ($K$ thuộc cạnh $OM$)
nên $\triangle OKA\backsim\triangle OAM$ (g.g).
Suy ra $\dfrac{OK}{OA}=\dfrac{OA}{OM}$ (hai tam giác đồng dạng),
tức là $OK\cdot OM=OA^2=R^2$.
Vì $\triangle OAM$ vuông tại $A$ có $AK\perp OM$
nên $K$ nằm giữa $O$ và $M$, suy ra $KM=OM-OK$.
Xét $\triangle OKA$ vuông tại $K$ có:
$AK^2=OA^2-OK^2=R^2-OK^2$ (định lý Pythagore)
$=OK\cdot OM-OK^2$ (cmt)
$=OK(OM-OK)=OK\cdot KM$.
Mà $AK=\dfrac{AB}{2}$ ($K$ là trung điểm của $AB$)
nên $KO\cdot KM=\dfrac{AB^2}{4}$.
Vậy $OK\cdot OM=R^2$ và $KO\cdot KM=\dfrac{AB^2}{4}$.

b) Vì $\triangle OAM$ vuông tại $A$ nên $OM>OA=R$ (cạnh huyền là cạnh lớn nhất).
Mà $OK\cdot OM=R^2$ (cmt) nên $OK<R=OI$.
Do đó trên tia $OM$ các điểm $O$, $K$, $I$, $M$ nằm theo thứ tự đó
(vì $OK<OI=R<OM$).
Xét $\triangle OAI$ có $OA=OI=R$
nên $\triangle OAI$ cân tại $O$,
suy ra $\widehat{OAI}=\widehat{OIA}$ (tính chất tam giác cân). (1)
Vì $I$ nằm giữa $O$ và $M$ nên tia $AI$ nằm giữa hai tia $AO$, $AM$.
Mà $\widehat{OAM}=90^\circ$ (tiếp tuyến vuông góc với bán kính)
nên $\widehat{MAI}=90^\circ-\widehat{OAI}$. (2)
Vì $K$ nằm giữa $O$ và $I$ nên hai tia $IK$, $IO$ trùng nhau,
suy ra $\widehat{AIK}=\widehat{AIO}$. (3)
Xét $\triangle AKI$ vuông tại $K$ ($OM\perp AB$ (cmt))
có $\widehat{KAI}=90^\circ-\widehat{AIK}$ (hai góc nhọn phụ nhau). (4)
Vì $K$ nằm giữa $A$ và $B$ nên $\widehat{IAB}=\widehat{KAI}$.
Từ (1), (2), (3) và (4) suy ra $\widehat{MAI}=\widehat{IAB}$.
Vì $I$ nằm giữa $K$ và $M$ nên tia $AI$ nằm giữa hai tia $AM$, $AB$.
Do đó $AI$ là tia phân giác của $\widehat{MAB}$.
Vì $MA$, $MB$ là hai tiếp tuyến cắt nhau tại $M$ (gt)
nên $MO$ là tia phân giác của $\widehat{AMB}$ (tính chất hai tiếp tuyến cắt nhau).
Mà $I$ thuộc $MO$ nên $MI$ là tia phân giác của $\widehat{AMB}$.
Xét $\triangle MAB$ có hai đường phân giác $AI$, $MI$ cắt nhau tại $I$
nên $I$ là tâm đường tròn nội tiếp $\triangle MAB$ (giao điểm các đường phân giác).

c) Vì $H$ là trực tâm của $\triangle MAB$ (gt)
nên $BH\perp MA$ và $AH\perp MB$.
Mà $OA\perp MA$ và $OB\perp MB$ (tiếp tuyến vuông góc với bán kính)
nên $BH\parallel OA$ và $AH\parallel OB$ (cùng vuông góc với một đường thẳng).
Tứ giác $AOBH$ có $BH\parallel OA$ và $AH\parallel OB$
nên $AOBH$ là hình bình hành (dấu hiệu nhận biết hình bình hành).
Mà $OA=OB=R$ (gt)
nên $AOBH$ là hình thoi (hình bình hành có hai cạnh kề bằng nhau).
Vậy tứ giác $AOBH$ là hình thoi.

d) Vì $AOBH$ là hình vuông (gt)
nên $\widehat{AOB}=90^\circ$.
Vì $MA$, $MB$ là hai tiếp tuyến cắt nhau tại $M$ (gt)
nên $OM$ là tia phân giác của $\widehat{AOB}$ (tính chất hai tiếp tuyến cắt nhau).
Suy ra $\widehat{AOM}=\dfrac{1}{2}\widehat{AOB}=45^\circ$.
Xét $\triangle OAM$ vuông tại $A$ có $\widehat{AOM}=45^\circ$
nên $\widehat{AMO}=90^\circ-45^\circ=45^\circ$.
Do đó $\triangle OAM$ vuông cân tại $A$,
suy ra $AM=OA=R$.
Xét $\triangle OAM$ vuông tại $A$ có:
$OM^2=OA^2+AM^2=R^2+R^2=2R^2$ (định lý Pythagore)
nên $OM=R\sqrt{2}$.
Vậy khoảng cách từ $M$ đến tâm $O$ bằng $R\sqrt{2}$.

### Bài 21 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$. Vẽ đường cao $AH$. Đường tròn $(I)$ đường kính $BH$ cắt $AB$ ở $D$, đường tròn $(K)$ đường kính $CH$ cắt $AC$ ở $E$. Giả sử $AH$ cắt $DE$ ở $O$, $IO$ cắt $DH$ tại $M$, $KO$ cắt $EH$ tại $N$.
a) Tứ giác $ADHE$ là hình gì? Tại sao?
b) Chứng minh $DE$ là tiếp tuyến của đường tròn $(I)$ và tiếp tuyến của đường tròn $(K)$.
c) Chứng minh $\widehat{IOK}=90^\circ$ và $MN\parallel DE$.
**Hình:** de_P1B21.png
**Hình giải:** giai_P1B21.png
**Ghi chú:** hình giải dựng thêm hai bán kính $ID$, $KE$, đoạn $MN$ và các dấu góc vuông tại $D$, $E$. Ý c chứng minh $MN\parallel DE$ bằng hai tam giác đồng dạng c.g.c (không dùng đường trung bình). Đã kiểm bằng toạ độ số trên 3000 tam giác vuông ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $I$, $K$ là trung điểm của $BH$, $CH$ nên $ID=IH=IB$ và $KE=KH=KC$, tức là các tam giác có trung tuyến bằng nửa cạnh; từ đó có hai góc vuông tại $D$, $E$ để nhận dạng tứ giác $ADHE$ và dùng điểm $O$ cách đều bốn đỉnh của nó.

**Bước 1.** Ý a: dùng trung tuyến bằng nửa cạnh trong tam giác $BDH$ và tam giác $CEH$ để chỉ ra $HD\perp AB$, $HE\perp AC$, rồi đếm số góc vuông của tứ giác $ADHE$.

**Bước 2.** Ý b: nhận ra $O$ cách đều $D$ và $H$, rồi so sánh hai tam giác $IDO$, $IHO$ có ba cặp cạnh bằng nhau để chuyển góc vuông tại $H$ sang góc tại $D$; làm tương tự với đường tròn $(K)$.

**Bước 3.** Ý c: chứng minh $IO$ và $KO$ lần lượt là đường trung trực của $DH$ và $EH$ (mỗi đường đi qua hai điểm cách đều hai đầu đoạn) để $M$, $N$ là trung điểm.

**Bước 4.** Ý c: dùng $DH\perp EH$ (hai cạnh kề của tứ giác ở ý a) cùng hai quan hệ vuông góc ở bước trước để suy ra $IO\parallel EH$, $KO\parallel DH$ và hai đường $IO$, $KO$ vuông góc.

**Bước 5.** Ý c: hai tam giác $HMN$, $HDE$ có góc chung và hai cặp cạnh kề tỉ lệ nên đồng dạng, từ đó có hai góc đồng vị bằng nhau.

**Chú ý:** ở ý b phải nói rõ $I$ thuộc đoạn $HB$ và $O$ thuộc đoạn $HA$ thì mới đổi được $\widehat{IHO}$ thành góc $\widehat{BHA}$.

**Phần 2. Trình bày**

a) Vì $I$ là tâm của đường tròn đường kính $BH$ (gt)
nên $I$ là trung điểm của $BH$
và $ID=IB=IH=\dfrac{BH}{2}$ (bán kính).
Xét $\triangle BDH$ có $DI$ là đường trung tuyến ứng với cạnh $BH$
và $DI=\dfrac{BH}{2}$ (cmt)
nên $\triangle BDH$ vuông tại $D$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Suy ra $HD\perp AB$, do đó $\widehat{ADH}=90^\circ$.
Vì $K$ là tâm của đường tròn đường kính $CH$ (gt)
nên $K$ là trung điểm của $CH$
và $KE=KC=KH=\dfrac{CH}{2}$ (bán kính).
Xét $\triangle CEH$ có $EK$ là đường trung tuyến ứng với cạnh $CH$
và $EK=\dfrac{CH}{2}$ (cmt)
nên $\triangle CEH$ vuông tại $E$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Suy ra $HE\perp AC$, do đó $\widehat{AEH}=90^\circ$.
Tứ giác $ADHE$ có:
$\widehat{DAE}=90^\circ$ ($\triangle ABC$ vuông tại $A$ (gt));
$\widehat{ADH}=90^\circ$ (cmt);
$\widehat{AEH}=90^\circ$ (cmt)
nên $ADHE$ là hình chữ nhật (tứ giác có ba góc vuông).
Vậy tứ giác $ADHE$ là hình chữ nhật.

b) Vì $ADHE$ là hình chữ nhật (cmt) và $O$ là giao điểm của $AH$, $DE$ (gt)
nên $OD=OE=OH=OA$ (tính chất hai đường chéo hình chữ nhật).
Xét $\triangle IDO$ và $\triangle IHO$ có:
$ID=IH$ (bán kính của $(I)$);
$OD=OH$ (cmt);
$IO$ chung
nên $\triangle IDO=\triangle IHO$ (c.c.c).
Suy ra $\widehat{IDO}=\widehat{IHO}$ (hai góc tương ứng). (1)
Vì $I$ thuộc đoạn $HB$ và $O$ thuộc đoạn $HA$
nên $\widehat{IHO}=\widehat{BHA}=90^\circ$ ($AH\perp BC$ (gt)). (2)
Từ (1) và (2) suy ra $\widehat{IDO}=90^\circ$.
Vì $O$ nằm giữa $D$ và $E$ nên hai tia $DO$, $DE$ trùng nhau,
suy ra $ID\perp DE$ tại $D$.
Mà $D$ thuộc $(I)$
nên $DE$ là tiếp tuyến của $(I)$ tại $D$ (dấu hiệu nhận biết tiếp tuyến).
Xét $\triangle KEO$ và $\triangle KHO$ có:
$KE=KH$ (bán kính của $(K)$);
$OE=OH$ (cmt);
$KO$ chung
nên $\triangle KEO=\triangle KHO$ (c.c.c).
Suy ra $\widehat{KEO}=\widehat{KHO}$ (hai góc tương ứng).
Vì $K$ thuộc đoạn $HC$ và $O$ thuộc đoạn $HA$
nên $\widehat{KHO}=\widehat{CHA}=90^\circ$ ($AH\perp BC$ (gt)).
Do đó $\widehat{KEO}=90^\circ$.
Vì $O$ nằm giữa $D$ và $E$ nên hai tia $EO$, $ED$ trùng nhau,
suy ra $KE\perp DE$ tại $E$.
Mà $E$ thuộc $(K)$
nên $DE$ là tiếp tuyến của $(K)$ tại $E$ (dấu hiệu nhận biết tiếp tuyến).
Vậy $DE$ là tiếp tuyến của đường tròn $(I)$ và của đường tròn $(K)$.

c) Vì $ID=IH$ (bán kính của $(I)$) nên $I$ thuộc đường trung trực của $DH$.
Vì $OD=OH$ (cmt) nên $O$ thuộc đường trung trực của $DH$.
Mà $I\ne O$ nên $IO$ là đường trung trực của $DH$.
Suy ra $IO\perp DH$ tại trung điểm của $DH$.
Mà $M$ là giao điểm của $IO$ và $DH$ (gt)
nên $M$ là trung điểm của $DH$.
Vì $KE=KH$ (bán kính của $(K)$) nên $K$ thuộc đường trung trực của $EH$.
Vì $OE=OH$ (cmt) nên $O$ thuộc đường trung trực của $EH$.
Mà $K\ne O$ nên $KO$ là đường trung trực của $EH$.
Suy ra $KO\perp EH$ tại trung điểm của $EH$.
Mà $N$ là giao điểm của $KO$ và $EH$ (gt)
nên $N$ là trung điểm của $EH$.
Vì $ADHE$ là hình chữ nhật (cmt)
nên $\widehat{DHE}=90^\circ$, tức $DH\perp EH$.
Vì $IO\perp DH$ và $EH\perp DH$ nên $IO\parallel EH$.
Vì $KO\perp EH$ và $DH\perp EH$ nên $KO\parallel DH$.
Mà $DH\perp EH$ (cmt)
nên $IO\perp KO$, tức là $\widehat{IOK}=90^\circ$.
Vì $M$, $N$ lần lượt là trung điểm của $DH$, $EH$ (cmt)
nên $\dfrac{HM}{HD}=\dfrac{HN}{HE}=\dfrac{1}{2}$.
Xét $\triangle HMN$ và $\triangle HDE$ có:
$\dfrac{HM}{HD}=\dfrac{HN}{HE}$ (cmt);
$\widehat{MHN}=\widehat{DHE}$ (góc chung, $M$ thuộc $HD$, $N$ thuộc $HE$)
nên $\triangle HMN\backsim\triangle HDE$ (c.g.c).
Suy ra $\widehat{HMN}=\widehat{HDE}$ (hai góc tương ứng).
Hai góc này ở vị trí đồng vị
nên $MN\parallel DE$ (dấu hiệu nhận biết hai đường thẳng song song).

### Bài 22 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho điểm $M$ nằm ngoài đường tròn $(O;R)$. Gọi $MA$, $MB$ là hai tiếp tuyến với đường tròn $(O)$ ($A$ và $B$ là hai tiếp điểm). Kẻ đường kính $AD$ của đường tròn $(O)$. Gọi $H$ là giao điểm của $OM$ và $AB$, $I$ là trung điểm của đoạn thẳng $BD$.
a) Chứng minh tứ giác $OHBI$ là hình chữ nhật.
b) Cho biết $OI$ cắt $MB$ tại $K$, chứng minh $KD$ là tiếp tuyến của $(O)$.
**Hình:** de_P1B22.png
**Hình giải:** giai_P1B22.png
**Ghi chú:** ở ý b, "$MB$" hiểu là đường thẳng $MB$: giao điểm $K$ của $OI$ với $MB$ luôn nằm trên tia đối của tia $BM$ (đã kiểm bằng toạ độ). Hình giải dựng thêm $OI$ kéo dài tới $K$, đoạn $KD$ và bán kính $OB$. Đã kiểm trên 3000 cấu hình ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hình chữ nhật $OHBI$ có ba góc vuông, mỗi góc đến từ một tính chất khác nhau (hai tiếp tuyến cắt nhau, trung tuyến bằng nửa cạnh, đường trung tuyến của tam giác cân); ý b chuyển góc vuông tại $B$ sang góc tại $D$ bằng hai tam giác bằng nhau.

**Bước 1.** Ý a: dùng hai tiếp tuyến cắt nhau để có $OM\perp AB$ tại $H$, suy ra góc vuông thứ nhất của tứ giác $OHBI$.

**Bước 2.** Ý a: nhận ra $OB=OA=OD$ nên $BO$ là trung tuyến bằng nửa cạnh $AD$ của tam giác $ABD$, suy ra góc vuông thứ hai tại $B$.

**Bước 3.** Ý a: vì $OB=OD$ và $I$ là trung điểm của $BD$ nên $OI$ là trung tuyến của tam giác cân, suy ra góc vuông thứ ba rồi kết luận về loại tứ giác.

**Bước 4.** Ý b: chỉ ra $OI$ là đường trung trực của $BD$ để có $KB=KD$.

**Bước 5.** Ý b: so sánh hai tam giác $KOB$, $KOD$ có ba cặp cạnh bằng nhau để chuyển góc vuông tại $B$ (do $MB$ là tiếp tuyến) sang góc tại $D$.

**Phần 2. Trình bày**

a) Vì $MA$, $MB$ là hai tiếp tuyến của $(O)$ cắt nhau tại $M$ (gt)
nên $MA=MB$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OB=R$ (gt)
nên $MO$ là đường trung trực của $AB$ (hai điểm $M$, $O$ cách đều hai đầu mút $A$, $B$).
Suy ra $OM\perp AB$ tại $H$,
do đó $\widehat{OHB}=90^\circ$. (1)
Vì $AD$ là đường kính của $(O)$ (gt)
nên $O$ là trung điểm của $AD$
và $OA=OB=OD=\dfrac{AD}{2}$ (bán kính).
Xét $\triangle ABD$ có $BO$ là đường trung tuyến ứng với cạnh $AD$
và $BO=\dfrac{AD}{2}$ (cmt)
nên $\triangle ABD$ vuông tại $B$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Mà $H$ thuộc $AB$ và $I$ thuộc $BD$
nên $\widehat{HBI}=\widehat{ABD}=90^\circ$. (2)
Xét $\triangle OBD$ có $OB=OD$ (bán kính)
nên $\triangle OBD$ cân tại $O$.
Mà $OI$ là đường trung tuyến ($I$ là trung điểm của $BD$ (gt))
nên $OI$ cũng là đường cao (tính chất tam giác cân),
suy ra $OI\perp BD$, do đó $\widehat{OIB}=90^\circ$. (3)
Tứ giác $OHBI$ có $\widehat{OHB}=\widehat{HBI}=\widehat{OIB}=90^\circ$ (cmt)
nên $OHBI$ là hình chữ nhật (tứ giác có ba góc vuông).

b) Vì $OB=OD$ (cmt) và $IB=ID$ (gt)
nên $OI$ là đường trung trực của $BD$ (hai điểm $O$, $I$ cách đều hai đầu mút $B$, $D$).
Mà $K$ thuộc $OI$
nên $KB=KD$ (điểm thuộc đường trung trực cách đều hai đầu mút).
Xét $\triangle KOB$ và $\triangle KOD$ có:
$OB=OD$ (cmt);
$KB=KD$ (cmt);
$KO$ chung
nên $\triangle KOB=\triangle KOD$ (c.c.c).
Suy ra $\widehat{KDO}=\widehat{KBO}$ (hai góc tương ứng).
Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ (gt) và $K$ thuộc $MB$
nên $KB\perp OB$ (tiếp tuyến vuông góc với bán kính),
suy ra $\widehat{KBO}=90^\circ$.
Do đó $\widehat{KDO}=90^\circ$, tức $KD\perp OD$ tại $D$.
Mà $D$ thuộc $(O)$
nên $KD$ là tiếp tuyến của $(O)$ tại $D$ (dấu hiệu nhận biết tiếp tuyến).

### Bài 23 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn tâm $O$ bán kính $3\ \text{cm}$. Từ một điểm $A$ cách $O$ là $5\ \text{cm}$ vẽ hai tiếp tuyến $AB$, $AC$ với $(O)$ ($B$, $C$ là các tiếp điểm).
a) Chứng minh $AO\perp BC$.
b) Kẻ đường kính $BD$ của $(O)$. Chứng minh $DC\parallel OA$.
c) Tính chu vi và diện tích tam giác $ABC$.
d) Qua $O$ kẻ đường thẳng vuông góc với $BD$, đường thẳng này cắt tia $DC$ tại $E$. Đường thẳng $AE$ và $OC$ cắt nhau ở $I$, đường thẳng $OE$ và $AC$ cắt nhau ở $G$. Chứng minh $IG$ là trung trực của đoạn $OA$.
**Hình:** de_P1B23.png
**Hình giải:** giai_P1B23.png
**Ghi chú:** ý d dựng được $E$ đúng như đề (tia $DC$ cắt đường thẳng qua $O$ vuông góc $BD$); chứng minh dùng hai cặp tam giác bằng nhau để có $AE\perp OE$, rồi hai cặp góc so le trong, không dùng góc nội tiếp. Đáp số ý c: chu vi $12{,}8\ \text{cm}$, diện tích $7{,}68\ \text{cm}^2$ (đáp số hai đại lượng nên để tự luận). Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tiếp tuyến cắt nhau cho $OA$ là đường trung trực của $BC$; ở ý d, tứ giác tạo bởi $A$, $B$, $O$, $E$ có góc vuông nên $AE\parallel OB$ và $OE\parallel AB$, từ đó hai điểm $I$, $G$ đều cách đều $O$ và $A$.

**Bước 1.** Ý a và b: dùng $AB=AC$ và $OB=OC$ để chứng minh $OA$ là đường trung trực của $BC$, rồi dùng $OB=OC=OD$ để nhận ra $\triangle BCD$ vuông tại $C$ và so sánh hai đường cùng vuông góc với $BC$.

**Bước 2.** Ý c: tính $AB$ bằng định lý Pythagore trong tam giác vuông $OBA$, tính $BK$ bằng cách viết diện tích tam giác $OBA$ theo hai cách, rồi tính $AK$ và các cạnh của tam giác $ABC$.

**Bước 3.** Ý d: dùng $OE\perp BD$ và $AB\perp BD$ để có $OE\parallel AB$, rồi dùng $OA\parallel DE$ để chứng minh hai tam giác $OBA$ và $DOE$ bằng nhau và suy ra $OA=DE$.

**Bước 4.** Ý d: dùng $OA=DE$ và hai góc so le trong để chứng minh tam giác $AOE$ bằng tam giác $DEO$, từ đó suy ra $AE\perp OE$ và $AE\parallel OB$.

**Bước 5.** Ý d: từ $OE\parallel AB$ và $AE\parallel OB$ viết hai cặp góc so le trong bằng nhau, kết hợp việc $OA$ là tia phân giác của $\widehat{BAC}$ và của $\widehat{BOC}$ để chỉ ra $GO=GA$ và $IO=IA$.

**Bước 6.** Ý d: chỉ ra $I$ và $G$ là hai điểm phân biệt cùng thuộc đường trung trực của $OA$ rồi kết luận.

**Chú ý:** phải nói rõ các điểm nằm cùng phía hay khác phía đối với một đường thẳng thì mới dùng được tính chất hai góc đồng vị và so le trong.

**Phần 2. Trình bày**

a) Vì $AB$, $AC$ là hai tiếp tuyến của $(O)$ cắt nhau tại $A$ (gt)
nên $AB=AC$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OB=OC$ (bán kính)
nên $AO$ là đường trung trực của $BC$ (hai điểm $A$, $O$ cách đều hai đầu mút $B$, $C$).
Gọi $K$ là giao điểm của $AO$ và $BC$.
Khi đó $AO\perp BC$ tại $K$ và $K$ là trung điểm của $BC$.

b) Vì $BD$ là đường kính của $(O)$ (gt)
nên $O$ là trung điểm của $BD$
và $OB=OC=OD=\dfrac{BD}{2}$ (bán kính).
Xét $\triangle BCD$ có $CO$ là đường trung tuyến ứng với cạnh $BD$
và $CO=\dfrac{BD}{2}$ (cmt)
nên $\triangle BCD$ vuông tại $C$ (tam giác có trung tuyến bằng nửa cạnh tương ứng).
Suy ra $DC\perp BC$.
Mà $OA\perp BC$ (cmt)
nên $DC\parallel OA$ (hai đường thẳng cùng vuông góc với $BC$).

c) Vì $AB\perp OB$ (tiếp tuyến vuông góc với bán kính)
nên $\triangle OBA$ vuông tại $B$.
Xét $\triangle OBA$ vuông tại $B$ có:
$AB^2=OA^2-OB^2=5^2-3^2=16$ (định lý Pythagore)
nên $AB=4\ \text{cm}$.
Mà $AC=AB$ (cmt) nên $AC=4\ \text{cm}$.
Vì $BK\perp OA$ (cmt)
nên $BK$ là đường cao của $\triangle OBA$.
Tính diện tích $\triangle OBA$ theo hai cách:
$S_{OBA}=\dfrac{1}{2}\cdot OB\cdot AB=\dfrac{1}{2}\cdot BK\cdot OA$.
Suy ra $BK=\dfrac{OB\cdot AB}{OA}=\dfrac{3\cdot4}{5}=2{,}4\ \text{cm}$.
Vì $K$ là trung điểm của $BC$ (cmt)
nên $BC=2BK=4{,}8\ \text{cm}$.
Xét $\triangle ABK$ vuông tại $K$ có:
$AK^2=AB^2-BK^2=16-5{,}76=10{,}24$ (định lý Pythagore)
nên $AK=3{,}2\ \text{cm}$.
Chu vi $\triangle ABC$ là:
$AB+AC+BC=4+4+4{,}8=12{,}8\ \text{cm}$.
Diện tích $\triangle ABC$ là:
$S_{ABC}=\dfrac{1}{2}\cdot BC\cdot AK=\dfrac{1}{2}\cdot4{,}8\cdot3{,}2=7{,}68\ \text{cm}^2$.
Vậy tam giác $ABC$ có chu vi $12{,}8\ \text{cm}$ và diện tích $7{,}68\ \text{cm}^2$.

d) Vì $AB\perp OB$ (tiếp tuyến vuông góc với bán kính)
mà $B$, $O$, $D$ thẳng hàng
nên $AB\perp BD$.
Mà $OE\perp BD$ (gt)
nên $OE\parallel AB$. (1)
Vì $K$ nằm giữa $B$, $C$ và $K$ thuộc tia $OA$
nên $A$, $C$ cùng phía đối với $BD$.
Mà $E$ thuộc tia $DC$ (gt)
nên $A$, $E$ cùng phía đối với $BD$.
Vì $DC\parallel OA$ (cmt) và $E$ thuộc $DC$
nên $DE\parallel OA$.
Suy ra $\widehat{BOA}=\widehat{ODE}$ (hai góc đồng vị).
Xét $\triangle OBA$ và $\triangle DOE$ có:
$\widehat{OBA}=\widehat{DOE}=90^\circ$ ($AB\perp OB$; $OE\perp BD$ (gt));
$OB=DO$ (bán kính);
$\widehat{BOA}=\widehat{ODE}$ (cmt)
nên $\triangle OBA=\triangle DOE$ (g.c.g).
Suy ra $OA=DE$ (hai cạnh tương ứng). (2)
Vì $AB\parallel OE$ (cmt) nên $A$, $B$ cùng phía đối với $OE$.
Mà $O$ nằm giữa $B$ và $D$ nên $B$, $D$ khác phía đối với $OE$.
Do đó $A$, $D$ khác phía đối với $OE$,
suy ra $\widehat{AOE}=\widehat{DEO}$ (hai góc so le trong, $OA\parallel DE$).
Xét $\triangle AOE$ và $\triangle DEO$ có:
$OA=ED$ (cmt);
$\widehat{AOE}=\widehat{DEO}$ (cmt);
$OE=EO$ (chung)
nên $\triangle AOE=\triangle DEO$ (c.g.c).
Suy ra $\widehat{AEO}=\widehat{DOE}=90^\circ$ (hai góc tương ứng).
Do đó $AE\perp OE$.
Mà $BD\perp OE$ (gt)
nên $AE\parallel BD$, tức $AE\parallel OB$. (3)
Vì $DE\parallel OA$ nên $C$, $E$ cùng phía đối với $OA$.
Mà $K$ nằm giữa $B$, $C$ và $K$ thuộc $OA$ nên $B$, $C$ khác phía đối với $OA$.
Suy ra $B$, $E$ khác phía đối với $OA$.
Vì $G$ thuộc tia $OE$ và $OE\parallel AB$ (cmt)
nên $\widehat{GOA}=\widehat{EOA}=\widehat{OAB}$ (hai góc so le trong).
Vì $AB$, $AC$ là hai tiếp tuyến cắt nhau tại $A$ (gt)
nên $AO$ là tia phân giác của $\widehat{BAC}$ (tính chất hai tiếp tuyến cắt nhau),
suy ra $\widehat{OAB}=\widehat{OAC}=\widehat{OAG}$ ($G$ thuộc tia $AC$).
Do đó $\widehat{GOA}=\widehat{GAO}$,
suy ra $\triangle GOA$ cân tại $G$ và $GO=GA$. (4)
Vì $I$ thuộc tia $AE$ và $AE\parallel OB$ (cmt)
nên $\widehat{IAO}=\widehat{EAO}=\widehat{AOB}$ (hai góc so le trong).
Vì $OA$ là tia phân giác của $\widehat{BOC}$ (tính chất hai tiếp tuyến cắt nhau)
nên $\widehat{AOB}=\widehat{AOC}=\widehat{AOI}$ ($I$ thuộc tia $OC$).
Do đó $\widehat{IAO}=\widehat{IOA}$,
suy ra $\triangle IOA$ cân tại $I$ và $IO=IA$. (5)
Từ (4) và (5) suy ra $G$ và $I$ cùng thuộc đường trung trực của $OA$.
Trong $\triangle OAB$ có $AB=4\ \text{cm}>OB=3\ \text{cm}$
nên $\widehat{AOB}>\widehat{OAB}$ (cạnh lớn hơn đối diện góc lớn hơn),
tức là $\widehat{IOA}>\widehat{GOA}$.
Do đó $I$ và $G$ là hai điểm phân biệt.
Vậy $IG$ là đường trung trực của đoạn $OA$.
