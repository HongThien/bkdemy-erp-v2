# ĐỀ | Đề cương ôn tập cuối học kì I Toán 9 — THCS Ái Mộ (Hà Nội) · phần Hình
nam: 2025
bo_sach: KNTT
kieu: de_cuong

## PHẦN 1 | B. Hình học (Bài 1–8) | tu_luan

### Bài 1 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho nửa đường tròn tâm $O$, đường kính $AB=2R$. Trên nửa mặt phẳng bờ $AB$ chứa nửa đường tròn, vẽ các tiếp tuyến $Ax$, $By$. Từ điểm $M$ tùy ý thuộc nửa đường tròn ($M$ khác $A$, $B$) vẽ tiếp tuyến tại $M$ cắt $Ax$, $By$ lần lượt tại $C$, $D$. Gọi $E$ là giao điểm của $CO$ và $AM$, $F$ là giao điểm của $DO$ và $BM$.
a) Chứng minh bốn điểm $A$, $C$, $M$, $O$ cùng thuộc một đường tròn.
b) Chứng minh $AC+BD=CD$ và tứ giác $MEOF$ là hình chữ nhật.
c) Chứng minh tích $AC\cdot BD$ không đổi khi $M$ di động trên nửa đường tròn.
**Hình:** de_P1B1.png
**Hình giải:** giai_P1B1.png
**Ghi chú:** đề in "cơ bờ là AB" hiểu là "bờ $AB$". Ý b dùng thêm $\widehat{AMB}=90^\circ$ (chứng minh từ tam giác cân và tổng ba góc, không dùng góc nội tiếp); ý c dùng tam giác đồng dạng thay cho hệ thức đường cao. Đã kiểm bằng toạ độ số trên 3000 vị trí $M$ ngẫu nhiên (mọi khẳng định ở ba ý, kể cả $M$ nằm giữa $C$, $D$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tiếp tuyến cắt nhau cho các cặp đoạn bằng nhau và các tia phân giác ở tâm; tiếp tuyến vuông góc bán kính cho các góc vuông và các cặp tam giác vuông đồng dạng.

**Bước 1.** Ý a: nhận ra hai tam giác vuông $CAO$, $CMO$ có chung cạnh huyền $CO$, rồi dùng trung điểm của $CO$ để chỉ ra bốn điểm cách đều.

**Bước 2.** Ý b: dùng tính chất hai tiếp tuyến cắt nhau để có $CA=CM$, $DB=DM$, rồi dùng điều kiện $M$ nằm giữa $C$ và $D$ để cộng đoạn thẳng.

**Bước 3.** Ý b: chứng minh $CO\perp AM$ và $DO\perp BM$ nhờ các cặp đoạn bằng nhau, rồi chứng minh $\widehat{AMB}=90^\circ$ từ các tam giác cân có hai cạnh là bán kính.

**Bước 4.** Ý b: đếm ba góc vuông của tứ giác $MEOF$ để kết luận đó là hình chữ nhật.

**Bước 5.** Ý c: dùng hai tia phân giác $OC$, $OD$ để tìm tổng hai góc ở tâm, rồi viết $AC\cdot BD$ thành tích hai đoạn trên tiếp tuyến.

**Bước 6.** Ý c: chứng minh hai tam giác vuông $CMO$, $OMD$ đồng dạng để đổi tích hai đoạn đó thành một đoạn chỉ phụ thuộc vào đường tròn.

**Chú ý:** phải giải thích vì sao $M$ nằm giữa $C$ và $D$ trước khi cộng đoạn thẳng ở ý b.

**Phần 2. Trình bày**

a) Vì $Ax$ là tiếp tuyến của nửa đường tròn tại $A$ (gt)
nên $CA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{CAO}=90^\circ$.
Vì $CD$ là tiếp tuyến của nửa đường tròn tại $M$ (gt)
nên $CM\perp OM$ (tính chất tiếp tuyến),
suy ra $\widehat{CMO}=90^\circ$.
Gọi $I$ là trung điểm của $CO$.
Xét $\triangle CAO$ vuông tại $A$
có $AI$ là đường trung tuyến ứng với cạnh huyền $CO$
nên $IA=\dfrac{CO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle CMO$ vuông tại $M$
có $MI$ là đường trung tuyến ứng với cạnh huyền $CO$
nên $IM=\dfrac{CO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $IC=IO=\dfrac{CO}{2}$ ($I$ là trung điểm của $CO$).
Do đó $IA=IM=IC=IO=\dfrac{CO}{2}$.
Vậy bốn điểm $A$, $C$, $M$, $O$ cùng thuộc đường tròn tâm $I$,
đường kính $CO$.

b) Vì $CA$, $CM$ là hai tiếp tuyến cắt nhau tại $C$ (gt)
nên $CA=CM$ (tính chất hai tiếp tuyến cắt nhau).
Vì $DB$, $DM$ là hai tiếp tuyến cắt nhau tại $D$ (gt)
nên $DB=DM$ (tính chất hai tiếp tuyến cắt nhau).
Vì $Ax\parallel By$ (cùng vuông góc với $AB$)
nên $C$, $D$ nằm trên hai đường thẳng song song.
Mà $M$ thuộc nửa đường tròn, $M$ khác $A$, $B$
nên $M$ nằm giữa hai đường thẳng $Ax$, $By$,
suy ra $M$ nằm giữa $C$ và $D$.
Do đó $CD=CM+MD=CA+DB$.
Vậy $AC+BD=CD$.
Xét $\triangle OAM$ có $OA=OM$ (bán kính)
nên cân tại $O$, suy ra $\widehat{OAM}=\widehat{OMA}$.
Xét $\triangle OBM$ có $OB=OM$ (bán kính)
nên cân tại $O$, suy ra $\widehat{OBM}=\widehat{OMB}$.
Vì $O$ nằm giữa $A$ và $B$
nên tia $MO$ nằm giữa hai tia $MA$, $MB$.
Suy ra $\widehat{AMB}=\widehat{OMA}+\widehat{OMB}=\widehat{MAB}+\widehat{MBA}$.
Xét $\triangle AMB$
có $\widehat{MAB}+\widehat{MBA}+\widehat{AMB}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{AMB}=180^\circ$, hay $\widehat{AMB}=90^\circ$.
Vì $CA=CM$ (cmt) và $OA=OM$ (bán kính)
nên $CO$ là đường trung trực của $AM$
(hai điểm cách đều hai đầu đoạn thẳng).
Suy ra $CO\perp AM$ tại $E$, do đó $\widehat{MEO}=90^\circ$ và $E$ là trung điểm của $AM$.
Vì $DB=DM$ (cmt) và $OB=OM$ (bán kính)
nên $DO$ là đường trung trực của $BM$.
Suy ra $DO\perp BM$ tại $F$, do đó $\widehat{MFO}=90^\circ$ và $F$ là trung điểm của $BM$.
Vì $E$ thuộc tia $MA$, $F$ thuộc tia $MB$
nên $\widehat{EMF}=\widehat{AMB}=90^\circ$.
Tứ giác $MEOF$ có:
$\widehat{EMF}=90^\circ$ (cmt);
$\widehat{MEO}=90^\circ$ (cmt);
$\widehat{MFO}=90^\circ$ (cmt)
nên $MEOF$ là hình chữ nhật (dấu hiệu nhận biết hình chữ nhật).

c) Vì $CA$, $CM$ là hai tiếp tuyến cắt nhau tại $C$ (gt)
nên $OC$ là tia phân giác của $\widehat{AOM}$ (tính chất hai tiếp tuyến cắt nhau),
suy ra $\widehat{COM}=\dfrac{1}{2}\widehat{AOM}$.
Vì $DB$, $DM$ là hai tiếp tuyến cắt nhau tại $D$ (gt)
nên $OD$ là tia phân giác của $\widehat{MOB}$ (tính chất hai tiếp tuyến cắt nhau),
suy ra $\widehat{MOD}=\dfrac{1}{2}\widehat{MOB}$.
Vì $\widehat{AOM}+\widehat{MOB}=180^\circ$ (hai góc kề bù)
nên $\widehat{COM}+\widehat{MOD}=90^\circ$. (1)
Xét $\triangle CMO$ vuông tại $M$
có $\widehat{MCO}+\widehat{COM}=90^\circ$ (hai góc nhọn phụ nhau). (2)
Từ (1) và (2) suy ra $\widehat{MCO}=\widehat{MOD}$.
Vì $CD\perp OM$ tại $M$ (tính chất tiếp tuyến) nên $\widehat{CMO}=\widehat{OMD}=90^\circ$.
Xét $\triangle CMO$ và $\triangle OMD$ có:
$\widehat{CMO}=\widehat{OMD}=90^\circ$ (cmt);
$\widehat{MCO}=\widehat{MOD}$ (cmt)
nên $\triangle CMO\backsim\triangle OMD$ (g.g).
Suy ra $\dfrac{CM}{OM}=\dfrac{OM}{MD}$ (hai tam giác đồng dạng),
tức là $CM\cdot MD=OM^2=R^2$.
Mà $AC=CM$ và $BD=MD$ (cmt)
nên $AC\cdot BD=CM\cdot MD=R^2$.
Vì $R$ không đổi
nên tích $AC\cdot BD$ không đổi khi $M$ di động trên nửa đường tròn.

### Bài 2 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho điểm $M$ nằm ngoài đường tròn $(O;R)$ sao cho $OM=2R$. Từ $M$ kẻ các tiếp tuyến $MA$, $MB$ với đường tròn $(O)$ ($A$, $B$ là các tiếp điểm). Kẻ đường kính $AC$ của đường tròn $(O)$. Gọi $H$ là giao điểm của $AB$ và $OM$.
1) Chứng minh bốn điểm $A$, $O$, $B$, $M$ cùng thuộc một đường tròn.
2) Tính tỉ số $\dfrac{OH}{OM}$.
3) Gọi $E$ là giao điểm của $CM$ và đường tròn $(O)$. Chứng minh $HE\perp BE$.
**Hình:** de_P1B2.png
**Hình giải:** giai_P1B2.png
**Ghi chú:** $E$ hiểu là giao điểm thứ hai của $CM$ với $(O)$ (khác $C$). Ý 3 không dùng góc nội tiếp, tứ giác nội tiếp: chứng minh qua tam giác đồng dạng rồi định lí Pythagore đảo, dùng $OM=2R$ để tính độ dài. Đã kiểm bằng toạ độ số trên 3000 cấu hình ($R$ và hướng của $M$ ngẫu nhiên): $\dfrac{OH}{OM}=\dfrac{1}{4}$, $MC^2=7R^2$, $EB^2=\dfrac{3R^2}{7}$, $EH^2=\dfrac{9R^2}{28}$, $HB^2=\dfrac{3R^2}{4}$, $\widehat{HEB}=90^\circ$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tiếp điểm cho hai góc vuông cùng nhìn $OM$; điều kiện $OM=2R$ biến mọi độ dài thành biểu thức theo $R$, nên góc vuông ở ý 3 kiểm được bằng định lí Pythagore đảo.

**Bước 1.** Ý 1: dùng tính chất tiếp tuyến vuông góc bán kính để có hai góc vuông tại $A$, $B$, rồi lấy trung điểm của $OM$.

**Bước 2.** Ý 2: chứng minh $OM\perp AB$ tại $H$, rồi dùng hai tam giác vuông $OHA$, $OAM$ có chung góc $O$ để tính $OH$ theo $R$.

**Bước 3.** Ý 3: chứng minh $AE\perp CM$ để có hai tam giác vuông $MEA$, $MAC$ đồng dạng và hai đẳng thức tích có chung vế $MA^2$.

**Bước 4.** Ý 3: từ các đẳng thức tích chứng minh hai cặp tam giác đồng dạng chung đỉnh $M$, rồi viết $EB$, $EH$ theo các đoạn $BC$, $OC$, $MB$, $MH$, $MC$.

**Bước 5.** Ý 3: tính các đoạn còn thiếu bằng tam giác đều $OBC$ và định lí Pythagore, rồi tính $EB^2$, $EH^2$, $HB^2$.

**Bước 6.** Ý 3: so sánh tổng $EH^2+EB^2$ với $HB^2$ rồi dùng định lí Pythagore đảo để kết luận.

**Phần 2. Trình bày**

1) Vì $MA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $MA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{OAM}=90^\circ$.
Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $MB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{OBM}=90^\circ$.
Gọi $K$ là trung điểm của $OM$.
Xét $\triangle OAM$ vuông tại $A$
có $AK$ là đường trung tuyến ứng với cạnh huyền $OM$
nên $KA=\dfrac{OM}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle OBM$ vuông tại $B$
có $BK$ là đường trung tuyến ứng với cạnh huyền $OM$
nên $KB=\dfrac{OM}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $KO=KM=\dfrac{OM}{2}$ ($K$ là trung điểm của $OM$).
Do đó $KA=KB=KO=KM=\dfrac{OM}{2}$.
Vậy bốn điểm $A$, $O$, $B$, $M$ cùng thuộc đường tròn tâm $K$,
đường kính $OM$.

2) Vì $MA$, $MB$ là hai tiếp tuyến cắt nhau tại $M$ (gt)
nên $MA=MB$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OB=R$ (bán kính)
nên $OM$ là đường trung trực của $AB$
(hai điểm cách đều hai đầu đoạn thẳng).
Suy ra $OM\perp AB$ tại $H$ và $H$ là trung điểm của $AB$.
Xét $\triangle OHA$ và $\triangle OAM$ có:
$\widehat{OHA}=\widehat{OAM}=90^\circ$ (cmt);
$\widehat{AOM}$ chung ($H$ thuộc cạnh $OM$)
nên $\triangle OHA\backsim\triangle OAM$ (g.g).
Suy ra $\dfrac{OH}{OA}=\dfrac{OA}{OM}$ (hai tam giác đồng dạng).
Do đó $OH=\dfrac{OA^2}{OM}=\dfrac{R^2}{2R}=\dfrac{R}{2}$.
Suy ra $\dfrac{OH}{OM}=\dfrac{R}{2}:2R=\dfrac{1}{4}$.
Vậy $\dfrac{OH}{OM}=\dfrac{1}{4}$.

3) Vì $E$ thuộc $(O)$ nên $OE=OA=OC=R$.
Vì $MA\perp AC$ (cmt) nên $A$ không nằm trên đường thẳng $CM$,
do đó $E$ khác $A$ (và $E$ khác $C$).
Xét $\triangle OAE$ có $OA=OE$ (cmt)
nên cân tại $O$, suy ra $\widehat{OAE}=\widehat{OEA}$.
Xét $\triangle OCE$ có $OC=OE$ (cmt)
nên cân tại $O$, suy ra $\widehat{OCE}=\widehat{OEC}$.
Vì $O$ nằm giữa $A$ và $C$
nên tia $EO$ nằm giữa hai tia $EA$, $EC$.
Suy ra $\widehat{AEC}=\widehat{OEA}+\widehat{OEC}=\widehat{EAC}+\widehat{ECA}$.
Xét $\triangle AEC$
có $\widehat{EAC}+\widehat{ECA}+\widehat{AEC}=180^\circ$ (tổng ba góc của tam giác).
Do đó $\widehat{AEC}=90^\circ$, suy ra $AE\perp CM$ tại $E$.
Xét $\triangle MAC$ vuông tại $A$ ($MA\perp AC$ (cmt))
có $AE\perp MC$ (cmt)
nên $E$ nằm giữa $M$ và $C$.
Xét $\triangle MEA$ và $\triangle MAC$ có:
$\widehat{MEA}=\widehat{MAC}=90^\circ$ (cmt);
$\widehat{AMC}$ chung ($E$ thuộc cạnh $MC$)
nên $\triangle MEA\backsim\triangle MAC$ (g.g).
Suy ra $\dfrac{ME}{MA}=\dfrac{MA}{MC}$ (hai tam giác đồng dạng),
tức là $MA^2=ME\cdot MC$. (1)
Xét $\triangle MHA$ và $\triangle MAO$ có:
$\widehat{MHA}=\widehat{MAO}=90^\circ$ (cmt);
$\widehat{AMO}$ chung ($H$ thuộc cạnh $MO$)
nên $\triangle MHA\backsim\triangle MAO$ (g.g).
Suy ra $\dfrac{MH}{MA}=\dfrac{MA}{MO}$ (hai tam giác đồng dạng),
tức là $MA^2=MH\cdot MO$. (2)
Mà $MB=MA$ (cmt)
nên từ (1) và (2) ta có $MB^2=ME\cdot MC$ (3)
và $ME\cdot MC=MH\cdot MO$ (4).
Từ (3) suy ra $\dfrac{ME}{MB}=\dfrac{MB}{MC}$.
Xét $\triangle MEB$ và $\triangle MBC$ có:
$\dfrac{ME}{MB}=\dfrac{MB}{MC}$ (cmt);
$\widehat{BMC}$ chung ($E$ thuộc cạnh $MC$)
nên $\triangle MEB\backsim\triangle MBC$ (c.g.c).
Suy ra $\dfrac{EB}{BC}=\dfrac{MB}{MC}$ (hai tam giác đồng dạng). (5)
Từ (4) suy ra $\dfrac{ME}{MO}=\dfrac{MH}{MC}$.
Xét $\triangle MEH$ và $\triangle MOC$ có:
$\dfrac{ME}{MO}=\dfrac{MH}{MC}$ (cmt);
$\widehat{HME}=\widehat{OMC}$ (góc chung, $H$ thuộc cạnh $MO$, $E$ thuộc cạnh $MC$)
nên $\triangle MEH\backsim\triangle MOC$ (c.g.c).
Suy ra $\dfrac{EH}{OC}=\dfrac{MH}{MC}$ (hai tam giác đồng dạng). (6)
Xét $\triangle OAM$ vuông tại $A$
có $MA^2=OM^2-OA^2=4R^2-R^2=3R^2$ (định lí Pythagore).
Xét $\triangle MAC$ vuông tại $A$
có $MC^2=MA^2+AC^2=3R^2+4R^2=7R^2$ (định lí Pythagore, $AC=2R$).
Vì $H$ nằm giữa $O$ và $M$
nên $MH=OM-OH=2R-\dfrac{R}{2}=\dfrac{3R}{2}$ (theo ý 2).
Xét $\triangle OAM$ vuông tại $A$
có $\cos\widehat{AOM}=\dfrac{OA}{OM}=\dfrac{R}{2R}=\dfrac{1}{2}$ (định nghĩa tỉ số $\cos$)
nên $\widehat{AOM}=60^\circ$.
Vì $OM$ là tia phân giác của $\widehat{AOB}$ (tính chất hai tiếp tuyến cắt nhau)
nên $\widehat{AOB}=2\cdot60^\circ=120^\circ$.
Vì $A$, $O$, $C$ thẳng hàng
nên $\widehat{BOC}=180^\circ-120^\circ=60^\circ$ (hai góc kề bù).
Xét $\triangle OBC$ có $OB=OC=R$ (bán kính) và $\widehat{BOC}=60^\circ$
nên $\triangle OBC$ là tam giác đều (dấu hiệu nhận biết tam giác đều),
suy ra $BC=R$.
Từ (5) ta có
$EB^2=BC^2\cdot\dfrac{MB^2}{MC^2}=R^2\cdot\dfrac{3R^2}{7R^2}=\dfrac{3R^2}{7}$.
Từ (6) ta có
$EH^2=OC^2\cdot\dfrac{MH^2}{MC^2}=R^2\cdot\dfrac{9R^2}{4\cdot7R^2}=\dfrac{9R^2}{28}$.
Xét $\triangle OHB$ vuông tại $H$ ($OM\perp AB$ (cmt))
có $HB^2=OB^2-OH^2=R^2-\dfrac{R^2}{4}=\dfrac{3R^2}{4}$ (định lí Pythagore).
Ta có $EH^2+EB^2=\dfrac{9R^2}{28}+\dfrac{12R^2}{28}=\dfrac{21R^2}{28}=\dfrac{3R^2}{4}$.
Do đó $EH^2+EB^2=HB^2$.
Xét $\triangle HEB$ có $EH^2+EB^2=HB^2$
nên $\triangle HEB$ vuông tại $E$ (định lí Pythagore đảo).
Vậy $HE\perp BE$.

### Bài 3 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O;R)$ và một điểm $A$ nằm ngoài đường tròn đó, qua $A$ vẽ các tiếp tuyến $AB$, $AC$ với $(O;R)$, $B$ và $C$ là các tiếp điểm. Vẽ đường kính $BOD$ của $(O)$.
a) Chứng minh bốn điểm $A$, $B$, $O$, $C$ cùng thuộc một đường tròn.
b) Chứng minh rằng $DC\parallel OA$.
c) Đường trung trực của $BD$ cắt đường thẳng $CD$ tại $E$. Chứng minh rằng tứ giác $OCEA$ là hình thang cân.
**Hình:** de_P1B3.png
**Hình giải:** giai_P1B3.png
**Ghi chú:** ý b dùng các tam giác cân có cạnh là bán kính để có $\widehat{BCD}=90^\circ$ (không dùng góc nội tiếp, không dùng đường trung bình); ý c chứng minh hình thang cân bằng dấu hiệu hai đường chéo bằng nhau. Đã kiểm bằng toạ độ số trên 3000 cấu hình ($R$ và vị trí $A$ ngẫu nhiên).

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tiếp tuyến cắt nhau cho $AB=AC$ và $OA\perp BC$; đường kính $BD$ cho $DC\perp BC$, nên $DC$ và $OA$ cùng vuông góc một đường thẳng; ở ý c hai đường chéo của tứ giác cùng bằng một đoạn thứ ba.

**Bước 1.** Ý a: lập hai tam giác vuông $ABO$, $ACO$ từ tính chất tiếp tuyến, rồi dùng trung điểm của cạnh huyền chung $AO$.

**Bước 2.** Ý b: chứng minh $OA\perp BC$ nhờ hai tiếp tuyến cắt nhau, và chứng minh $DC\perp BC$ nhờ các tam giác cân có hai cạnh là bán kính.

**Bước 3.** Ý b: kết luận hai đường thẳng cùng vuông góc với $BC$ thì song song với nhau.

**Bước 4.** Ý c: dùng $OA\parallel CE$ để nhận ra $OCEA$ là hình thang, rồi chọn dấu hiệu hai đường chéo bằng nhau để chứng minh hình thang cân.

**Bước 5.** Ý c: chứng minh hai tam giác vuông $ABO$, $EOD$ bằng nhau theo trường hợp góc – cạnh – góc để suy ra $OE=AB$.

**Bước 6.** Ý c: dùng $AB=AC$ để thấy hai đường chéo $OE$, $CA$ bằng nhau rồi kết luận.

**Chú ý:** hai góc nhọn của hai tam giác vuông ở ý c bằng nhau vì hai đường thẳng song song tạo với $BD$ các góc nhọn bằng nhau.

**Phần 2. Trình bày**

a) Vì $AB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $AB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{ABO}=90^\circ$.
Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ (gt)
nên $AC\perp OC$ (tính chất tiếp tuyến),
suy ra $\widehat{ACO}=90^\circ$.
Gọi $I$ là trung điểm của $AO$.
Xét $\triangle ABO$ vuông tại $B$
có $BI$ là đường trung tuyến ứng với cạnh huyền $AO$
nên $IB=\dfrac{AO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle ACO$ vuông tại $C$
có $CI$ là đường trung tuyến ứng với cạnh huyền $AO$
nên $IC=\dfrac{AO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $IA=IO=\dfrac{AO}{2}$ ($I$ là trung điểm của $AO$).
Do đó $IA=IB=IC=IO=\dfrac{AO}{2}$.
Vậy bốn điểm $A$, $B$, $O$, $C$ cùng thuộc đường tròn tâm $I$,
đường kính $AO$.

b) Vì $AB$, $AC$ là hai tiếp tuyến cắt nhau tại $A$ (gt)
nên $AB=AC$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OB=OC=R$ (bán kính)
nên $OA$ là đường trung trực của $BC$
(hai điểm cách đều hai đầu đoạn thẳng).
Suy ra $OA\perp BC$. (1)
Xét $\triangle OBC$ có $OB=OC$ (bán kính)
nên cân tại $O$, suy ra $\widehat{OBC}=\widehat{OCB}$.
Xét $\triangle OCD$ có $OC=OD$ (bán kính)
nên cân tại $O$, suy ra $\widehat{OCD}=\widehat{ODC}$.
Vì $O$ nằm giữa $B$ và $D$
nên tia $CO$ nằm giữa hai tia $CB$, $CD$.
Suy ra $\widehat{BCD}=\widehat{OCB}+\widehat{OCD}=\widehat{CBD}+\widehat{CDB}$.
Xét $\triangle BCD$
có $\widehat{CBD}+\widehat{CDB}+\widehat{BCD}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{BCD}=180^\circ$, hay $\widehat{BCD}=90^\circ$.
Suy ra $DC\perp BC$. (2)
Từ (1) và (2) suy ra $DC\parallel OA$
(hai đường thẳng cùng vuông góc với một đường thẳng thì song song).

c) Vì $E$ thuộc đường thẳng $CD$ và $DC\parallel OA$ (cmt)
nên $CE\parallel OA$.
Do đó tứ giác $OCEA$ là hình thang (có hai đáy $CE$, $OA$).
Vì $O$ là trung điểm của $BD$ và đường trung trực của $BD$ đi qua $O$
nên $OE\perp BD$ tại $O$,
suy ra $\widehat{EOD}=90^\circ$.
Vì $OA\parallel DE$ ($E$ thuộc đường thẳng $CD$)
nên $\widehat{AOB}$ và $\widehat{ODE}$ bằng nhau hoặc bù nhau
(hai góc tạo bởi hai đường thẳng song song với cát tuyến $BD$).
Mà $\widehat{AOB}$ là góc nhọn của $\triangle ABO$ vuông tại $B$
và $\widehat{ODE}$ là góc nhọn của $\triangle EOD$ vuông tại $O$
nên $\widehat{AOB}=\widehat{ODE}$.
Xét $\triangle ABO$ và $\triangle EOD$ có:
$\widehat{ABO}=\widehat{EOD}=90^\circ$ (cmt);
$OB=OD$ (bán kính);
$\widehat{AOB}=\widehat{EDO}$ (cmt)
nên $\triangle ABO=\triangle EOD$ (g.c.g).
Suy ra $AB=EO$ (hai cạnh tương ứng).
Mà $AB=AC$ (cmt)
nên $OE=AC$.
Hình thang $OCEA$ có hai đường chéo $OE$, $CA$ bằng nhau
nên $OCEA$ là hình thang cân (dấu hiệu nhận biết hình thang cân).

### Bài 4 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho nửa đường tròn $(O)$ đường kính $AB=2R$ và điểm $C$ nằm ngoài nửa đường tròn. $CA$ cắt nửa đường tròn tại $M$, $CB$ cắt nửa đường tròn tại $N$. Gọi $H$ là giao điểm của $AN$ và $BM$.
a) Chứng minh rằng $CH\perp AB$.
b) Gọi $I$ là trung điểm của $CH$. Chứng minh rằng $MI$ là tiếp tuyến của nửa đường tròn $(O)$.
**Hình:** de_P1B4.png
**Hình giải:** giai_P1B4.png
**Ghi chú:** dựng hình chuẩn: $C$ cùng phía với nửa đường tròn, $M$, $N$ nằm trên các cạnh $CA$, $CB$ (khi đó tam giác $ABC$ nhọn). Chứng minh $\widehat{AMB}=\widehat{ANB}=90^\circ$ bằng tam giác cân và tổng ba góc (không dùng góc nội tiếp). Đã kiểm bằng toạ độ số trên 30000 cấu hình tam giác nhọn ngẫu nhiên (kể cả thứ tự các điểm và $\widehat{IMO}=90^\circ$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** $M$, $N$ thuộc đường tròn đường kính $AB$ nên $AN$, $BM$ là hai đường cao của tam giác $ABC$ và $H$ là trực tâm; tiếp tuyến cần chứng minh phải vuông góc với bán kính $OM$.

**Bước 1.** Ý a: chứng minh $\widehat{AMB}=90^\circ$ và $\widehat{ANB}=90^\circ$ từ các tam giác cân có hai cạnh là bán kính và tổng ba góc của tam giác.

**Bước 2.** Ý a: nhận ra $BM$, $AN$ là hai đường cao của $\triangle ABC$ cắt nhau tại $H$, nên $H$ là trực tâm và $CH$ vuông góc với $AB$.

**Bước 3.** Ý b: dùng tam giác vuông $CMH$ có $I$ là trung điểm cạnh huyền để có $IM=IH$, từ đó đổi góc $\widehat{IMH}$ sang góc $\widehat{IHM}$.

**Bước 4.** Ý b: gọi $K$ là chân đường cao hạ từ $C$, dùng hai góc đối đỉnh và tam giác cân $OMB$ để đổi hai góc ở đỉnh $M$ thành hai góc nhọn của tam giác vuông $BHK$.

**Bước 5.** Ý b: cộng hai góc ở đỉnh $M$ để có $\widehat{IMO}=90^\circ$, rồi dùng dấu hiệu nhận biết tiếp tuyến.

**Chú ý:** phải giải thích $H$ nằm giữa $B$, $M$ và $I$, $O$ nằm khác phía đối với đường thẳng $BM$ trước khi cộng góc.

**Phần 2. Trình bày**

a) Vì $OA=OB=OM$ (bán kính)
nên $\triangle OAM$ và $\triangle OBM$ cân tại $O$.
Suy ra $\widehat{OMA}=\widehat{OAM}$ và $\widehat{OMB}=\widehat{OBM}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $A$ và $B$
nên tia $MO$ nằm giữa hai tia $MA$, $MB$.
Suy ra $\widehat{AMB}=\widehat{OMA}+\widehat{OMB}=\widehat{MAB}+\widehat{MBA}$.
Xét $\triangle AMB$
có $\widehat{MAB}+\widehat{MBA}+\widehat{AMB}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{AMB}=180^\circ$, hay $\widehat{AMB}=90^\circ$.
Suy ra $BM\perp AC$ ($M$ thuộc $AC$).
Chứng minh tương tự (dùng $ON=OA=OB$) ta có $\widehat{ANB}=90^\circ$,
suy ra $AN\perp BC$ ($N$ thuộc $BC$).
Xét $\triangle ABC$ có $BM\perp AC$ và $AN\perp BC$ (cmt),
mà $BM$, $AN$ cắt nhau tại $H$ (gt)
nên $H$ là trực tâm của $\triangle ABC$.
Suy ra $CH\perp AB$ (ba đường cao của tam giác đồng quy).

b) Gọi $K$ là giao điểm của $CH$ và $AB$.
Khi đó $CK\perp AB$ tại $K$ (cmt).
Vì $M$, $N$ nằm trên các cạnh $CA$, $CB$ nên chân các đường cao $BM$, $AN$ nằm trên cạnh,
do đó $\triangle ABC$ nhọn và trực tâm $H$ nằm trong tam giác.
Suy ra $H$ nằm giữa $B$ và $M$, $H$ nằm giữa $C$ và $K$.
Vì $BM\perp AC$ (cmt) và $H$ thuộc $BM$
nên $\widehat{CMH}=90^\circ$.
Xét $\triangle CMH$ vuông tại $M$
có $MI$ là đường trung tuyến ứng với cạnh huyền $CH$ ($I$ là trung điểm của $CH$ (gt))
nên $IM=IH$ (tính chất trung tuyến ứng với cạnh huyền).
Suy ra $\triangle IMH$ cân tại $I$, do đó $\widehat{IMH}=\widehat{IHM}$. (1)
Vì $I$ thuộc tia $HC$, $K$ thuộc tia đối của tia $HC$
và $M$ thuộc tia đối của tia $HB$
nên $\widehat{IHM}=\widehat{BHK}$ (hai góc đối đỉnh). (2)
Xét $\triangle BHK$ vuông tại $K$
có $\widehat{BHK}+\widehat{HBK}=90^\circ$ (hai góc nhọn phụ nhau). (3)
Xét $\triangle OMB$ có $OM=OB$ (bán kính)
nên cân tại $O$, suy ra $\widehat{OMB}=\widehat{OBM}$.
Mà $\widehat{OBM}=\widehat{HBK}$ (cùng là góc $\widehat{MBA}$). (4)
Vì $M$ nằm giữa $A$ và $C$
nên $A$, $C$ nằm khác phía đối với đường thẳng $BM$.
Mà $O$ cùng phía với $A$ ($O$ thuộc đoạn $AB$, $B$ thuộc $BM$)
và $I$ cùng phía với $C$ ($I$ thuộc đoạn $HC$, $H$ thuộc $BM$)
nên $I$, $O$ nằm khác phía đối với đường thẳng $BM$.
Mà tia $MH$ trùng tia $MB$ ($H$ nằm giữa $B$ và $M$)
nên $\widehat{IMO}=\widehat{IMH}+\widehat{BMO}$.
Từ (1), (2), (3), (4) ta có
$\widehat{IMO}=\widehat{IHM}+\widehat{OBM}=\widehat{BHK}+\widehat{HBK}=90^\circ$.
Suy ra $MI\perp OM$ tại $M$.
Mà $M$ thuộc nửa đường tròn $(O)$
nên $MI$ là tiếp tuyến của nửa đường tròn $(O)$
(dấu hiệu nhận biết tiếp tuyến).

### Bài 5 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O)$ đường kính $AB$. Qua trung điểm $I$ của bán kính $OB$ kẻ dây $CD\perp AB$. Kẻ dây $CE$ song song với $AB$. Chứng minh rằng:
a) $\overset{\frown}{AE}=\overset{\frown}{BC}=\overset{\frown}{BD}$.
b) $E$, $O$, $D$ thẳng hàng.
c) $ADBE$ là hình chữ nhật.
**Hình:** de_P1B5.png
**Hình giải:** giai_P1B5.png
**Ghi chú:** ba cung ở ý a hiểu là các cung nhỏ; số đo cung lấy bằng số đo góc ở tâm (bài hỏi về cung nên được dùng). Ý b không dùng góc nội tiếp: chứng minh qua $\widehat{ECD}=90^\circ$ và tính duy nhất của đường tròn đi qua ba điểm. Đã kiểm bằng toạ độ số: $\widehat{AOE}=\widehat{BOC}=\widehat{BOD}=60^\circ$, $O$ là trung điểm của $DE$, $ADBE$ có ba góc vuông.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $I$ là trung điểm của $OB$ và $CD\perp OB$ nên $CD$ là đường trung trực của $OB$, từ đó có các tam giác đều; các cung bằng nhau suy ra từ các góc ở tâm bằng nhau.

**Bước 1.** Ý a: dùng $CD$ là đường trung trực của $OB$ để chứng minh $\triangle OBC$ và $\triangle OBD$ đều, rồi so sánh hai góc ở tâm $\widehat{BOC}$, $\widehat{BOD}$.

**Bước 2.** Ý a: hạ $EJ\perp AB$, dùng hai đường thẳng song song cách đều để chứng minh hai tam giác vuông $OIC$, $OJE$ bằng nhau rồi tính góc ở tâm $\widehat{AOE}$.

**Bước 3.** Ý a: so sánh ba góc ở tâm $\widehat{AOE}$, $\widehat{BOC}$, $\widehat{BOD}$ rồi đổi sang số đo ba cung.

**Bước 4.** Ý b: chứng minh $CE\perp CD$, rồi dùng trung điểm của cạnh huyền $DE$ và tính duy nhất của đường tròn đi qua ba điểm để kết luận $O$ là trung điểm của $DE$.

**Bước 5.** Ý c: dùng hai đường chéo $AB$, $DE$ cắt nhau tại trung điểm mỗi đường và bằng nhau để kết luận hình chữ nhật.

**Phần 2. Trình bày**

a) Vì $I$ là trung điểm của $OB$ (gt)
và $CD\perp OB$ tại $I$ (gt)
nên $CD$ là đường trung trực của $OB$.
Suy ra $CO=CB$ và $DO=DB$ (tính chất đường trung trực).
Mà $OB=OC=OD=R$ (bán kính).
Do đó $OB=OC=CB$ và $OB=OD=DB$.
Suy ra $\triangle OBC$ và $\triangle OBD$ là các tam giác đều (dấu hiệu nhận biết tam giác đều).
Do đó $\widehat{BOC}=\widehat{BOD}=60^\circ$. (1)
Kẻ $EJ\perp AB$ tại $J$.
Vì $CE\parallel AB$ (gt)
nên khoảng cách từ $E$ đến $AB$ bằng khoảng cách từ $C$ đến $AB$
(hai đường thẳng song song cách đều),
tức là $EJ=CI$.
Xét $\triangle OJE$ vuông tại $J$ và $\triangle OIC$ vuông tại $I$ có:
$OE=OC=R$ (bán kính);
$EJ=CI$ (cmt)
nên $\triangle OJE=\triangle OIC$ (cạnh huyền – cạnh góc vuông).
Suy ra $OJ=OI$ và $\widehat{EOJ}=\widehat{COI}$ (hai cạnh, hai góc tương ứng).
Vì $OJ=OI$ nên $J$ trùng $I$ hoặc $J$ đối xứng với $I$ qua $O$.
Nếu $J$ trùng $I$ thì $E$, $C$ cùng thuộc đường thẳng $CD$,
mà $E$, $C$ cùng phía đối với $AB$ và $EJ=CI$
nên $E$ trùng $C$, vô lí vì $CE$ là dây cung.
Do đó $J$ đối xứng với $I$ qua $O$,
suy ra $J$ thuộc tia $OA$ và $\widehat{AOE}=\widehat{EOJ}$.
Vì $I$ thuộc tia $OB$ nên $\widehat{COI}=\widehat{BOC}=60^\circ$ (cmt).
Suy ra $\widehat{AOE}=\widehat{EOJ}=\widehat{COI}=60^\circ$. (2)
Từ (1) và (2) suy ra $\widehat{AOE}=\widehat{BOC}=\widehat{BOD}$.
Vì số đo của cung nhỏ bằng số đo góc ở tâm chắn cung đó
nên $\text{sđ}\ \overset{\frown}{AE}=\text{sđ}\ \overset{\frown}{BC}=\text{sđ}\ \overset{\frown}{BD}$.
Vậy $\overset{\frown}{AE}=\overset{\frown}{BC}=\overset{\frown}{BD}$.

b) Vì $CE\parallel AB$ (gt) và $CD\perp AB$ (gt)
nên $CE\perp CD$ (quan hệ giữa tính vuông góc và tính song song),
suy ra $\widehat{ECD}=90^\circ$.
Gọi $O'$ là trung điểm của $DE$.
Xét $\triangle ECD$ vuông tại $C$
có $CO'$ là đường trung tuyến ứng với cạnh huyền $DE$
nên $O'C=O'D=O'E=\dfrac{DE}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Suy ra $O'$ là tâm đường tròn đi qua ba điểm $C$, $D$, $E$.
Mà $OC=OD=OE=R$ (bán kính)
nên $O$ cũng là tâm đường tròn đi qua ba điểm $C$, $D$, $E$.
Vì qua ba điểm không thẳng hàng chỉ vẽ được một đường tròn
nên $O$ trùng $O'$,
suy ra $O$ là trung điểm của $DE$.
Vậy $E$, $O$, $D$ thẳng hàng.

c) Xét tứ giác $ADBE$ có:
$O$ là trung điểm của $AB$ (gt);
$O$ là trung điểm của $DE$ (cmt)
nên $ADBE$ là hình bình hành (hai đường chéo cắt nhau tại trung điểm mỗi đường).
Mà $AB=DE=2R$ (hai đường chéo bằng nhau)
nên $ADBE$ là hình chữ nhật (dấu hiệu nhận biết hình chữ nhật).

### Bài 6 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Hình quạt tô màu đỏ ở hình vẽ bên dưới có bán kính bằng $2\ \text{dm}$ và góc ở tâm bằng $150^\circ$.
a) Tính diện tích của hình quạt đó.
b) Tính chiều dài cung tương ứng với hình quạt tròn đó.
**Hình:** de_P1B6.png
**Ghi chú:** hình gốc là tranh chiếc quạt nên vẽ lại thành hình quạt tròn có đủ tâm $O$, hai đầu cung $A$, $B$. Đề không nêu cách làm tròn nên làm tròn một chữ số thập phân (mặc định); giá trị đúng của cả hai ý là $\dfrac{5\pi}{3}$. Hai ý hỏi hai đại lượng khác nhau nên để tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích hình quạt và độ dài cung đều tỉ lệ với số đo góc ở tâm so với một vòng đầy, nên chỉ cần bán kính và số đo góc ở tâm.

**Bước 1.** Gọi tên tâm và hai đầu cung rồi ghi lại bán kính và số đo góc ở tâm mà đề cho.

**Bước 2.** Ý a: dùng công thức diện tích hình quạt tròn theo bán kính và số đo góc ở tâm, rồi thay số.

**Bước 3.** Ý b: dùng công thức độ dài cung tròn theo bán kính và số đo góc ở tâm, rồi thay số.

**Bước 4.** Rút gọn phân số rồi làm tròn từng kết quả theo mặc định một chữ số thập phân.

**Phần 2. Trình bày**

Gọi $O$ là tâm, $A$, $B$ là hai đầu cung của hình quạt.
Ta có $R=2\ \text{dm}$ và $n=150^\circ$ (gt).

a) Diện tích hình quạt là:
$S=\dfrac{\pi\cdot R^2\cdot n}{360}$ (công thức diện tích hình quạt tròn)
$=\dfrac{\pi\cdot2^2\cdot150}{360}$
$=\dfrac{5\pi}{3}$
$\approx5{,}2\ \text{dm}^2$ (làm tròn đến chữ số thập phân thứ nhất).

b) Độ dài cung $AB$ là:
$l=\dfrac{\pi\cdot R\cdot n}{180}$ (công thức độ dài cung tròn)
$=\dfrac{\pi\cdot2\cdot150}{180}$
$=\dfrac{5\pi}{3}$
$\approx5{,}2\ \text{dm}$ (làm tròn đến chữ số thập phân thứ nhất).

Vậy diện tích hình quạt là $\dfrac{5\pi}{3}\approx5{,}2\ \text{dm}^2$;
độ dài cung tương ứng là $\dfrac{5\pi}{3}\approx5{,}2\ \text{dm}$.

### Bài 7 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Một con lắc di chuyển từ vị trí $A$ đến vị trí $B$ (Hình vẽ). Tính độ dài quãng đường $AB$ mà con lắc đó đã di chuyển, biết rằng sợi dây $OA$ có độ dài bằng $l=2\ \text{cm}$ và tia $OA$ tạo với phương thẳng đứng góc $\alpha=15^\circ$.
**Hình:** de_P1B7.png
**Ghi chú:** theo hình gốc (hai góc ở hai bên phương thẳng đứng có dấu bằng nhau), $B$ đối xứng với $A$ qua phương thẳng đứng nên $\widehat{AOB}=2\alpha=30^\circ$; quãng đường $AB$ là độ dài cung tròn $AB$ tâm $O$ bán kính $l$. Đề không nêu cách làm tròn nên làm tròn một chữ số thập phân (mặc định); giá trị đúng là $\dfrac{\pi}{3}$ cm.

**Phần 1. Hướng dẫn**

**Mấu chốt:** quãng đường con lắc đi là độ dài một cung tròn tâm $O$ có bán kính bằng độ dài sợi dây, nên cần số đo góc ở tâm $\widehat{AOB}$ mà hình vẽ cho hai góc bằng nhau.

**Bước 1.** Nhìn hình để xác định cung $AB$ có tâm $O$ và bán kính bằng độ dài sợi dây $l$.

**Bước 2.** Dùng hai góc bằng nhau ở hai bên phương thẳng đứng để tính số đo góc ở tâm $\widehat{AOB}$ theo $\alpha$.

**Bước 3.** Dùng công thức độ dài cung tròn với bán kính $l$ và số đo góc ở tâm vừa tính, rồi thay số.

**Bước 4.** Rút gọn phân số và làm tròn kết quả theo mặc định một chữ số thập phân.

**Phần 2. Trình bày**

Quãng đường con lắc đi từ $A$ đến $B$ là độ dài cung $AB$
của đường tròn tâm $O$, bán kính $R=l=2\ \text{cm}$.
Theo hình vẽ, phương thẳng đứng là tia phân giác của $\widehat{AOB}$
(hai góc ở hai bên phương thẳng đứng bằng nhau).
Suy ra $\widehat{AOB}=2\alpha=2\cdot15^\circ=30^\circ$.
Độ dài cung $AB$ là:
$s=\dfrac{\pi\cdot R\cdot n}{180}$ (công thức độ dài cung tròn)
$=\dfrac{\pi\cdot2\cdot30}{180}$
$=\dfrac{\pi}{3}$
$\approx1{,}0\ \text{cm}$ (làm tròn đến chữ số thập phân thứ nhất).
Vậy con lắc đã di chuyển quãng đường $AB$ dài $\dfrac{\pi}{3}\approx1{,}0\ \text{cm}$.

### Bài 8 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Hình vẽ bên dưới mô tả mặt cắt của chiếc đèn led có dạng hình vành khuyên màu trắng với bán kính các đường tròn lần lượt là $15\ \text{cm}$, $18\ \text{cm}$, $21\ \text{cm}$, $24\ \text{cm}$. Tính diện tích hai hình vành khuyên đó.
**Hình:** de_P1B8.png
**Ghi chú:** hình gốc là ảnh chụp chiếc đèn nên vẽ lại: bốn đường tròn đồng tâm $O$, hai hình vành khuyên (phần tô) nằm giữa cặp $15$–$18$ và cặp $21$–$24$ (theo ảnh gốc). Đề không nêu cách làm tròn nên làm tròn một chữ số thập phân (mặc định); giá trị đúng là $234\pi$. Hai ý hỏi hai đại lượng nên để tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích hình vành khuyên bằng hiệu diện tích hai hình tròn đồng tâm, nên mỗi vành khuyên ứng với một cặp bán kính liền kề đã cho.

**Bước 1.** Nhìn hình để xác định hai vành khuyên: vành trong nằm giữa hai đường tròn nhỏ, vành ngoài nằm giữa hai đường tròn lớn.

**Bước 2.** Dùng công thức diện tích hình vành khuyên để tính diện tích vành khuyên trong từ hai bán kính của nó.

**Bước 3.** Làm tương tự để tính diện tích vành khuyên ngoài từ hai bán kính của nó.

**Bước 4.** Cộng hai diện tích rồi làm tròn kết quả theo mặc định một chữ số thập phân.

**Phần 2. Trình bày**

Gọi $O$ là tâm chung của bốn đường tròn.
Vành khuyên thứ nhất nằm giữa hai đường tròn có bán kính
$R_1=18\ \text{cm}$ và $r_1=15\ \text{cm}$.
Vành khuyên thứ hai nằm giữa hai đường tròn có bán kính
$R_2=24\ \text{cm}$ và $r_2=21\ \text{cm}$.
Diện tích vành khuyên thứ nhất là:
$S_1=\pi\cdot(R_1^2-r_1^2)$ (công thức diện tích hình vành khuyên)
$=\pi\cdot(18^2-15^2)$
$=99\pi\ \text{cm}^2$.
Diện tích vành khuyên thứ hai là:
$S_2=\pi\cdot(R_2^2-r_2^2)$ (công thức diện tích hình vành khuyên)
$=\pi\cdot(24^2-21^2)$
$=135\pi\ \text{cm}^2$.
Diện tích hai hình vành khuyên là:
$S=S_1+S_2=99\pi+135\pi$
$=234\pi$
$\approx735{,}1\ \text{cm}^2$ (làm tròn đến chữ số thập phân thứ nhất).
Vậy diện tích hai hình vành khuyên là $234\pi\approx735{,}1\ \text{cm}^2$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Đề cương có 8 bài Hình (B. HÌNH HỌC, Bài 1–8), cả 8 bài là `tu_luan` (chứng minh nhiều ý hoặc hai đại lượng); không có `tra_loi_ngan`, không có câu `Chưa chắc`.
- Hình đề vẽ lại bằng code cho cả 8 bài (`de_P1B1` … `de_P1B8`); hình giải cho Bài 1–5 (dựng thêm điểm / đoạn dùng trong lời giải). Bài 6, 7, 8 lời giải không dựng thêm gì nên không có hình giải.
- Bài 1b, 2.3, 3b, 4a, 5b: ý "tứ giác $MEOF$ hình chữ nhật" / "góc vuông cùng nhìn" chỉ dùng tam giác cân + tổng ba góc, trung tuyến ứng với cạnh huyền, tính duy nhất của đường tròn qua ba điểm — không dùng góc nội tiếp, tứ giác nội tiếp, đường trung bình, hệ thức đường cao dùng thẳng.
- Bài 2.3 (HE ⊥ BE) chứng minh bằng định lí Pythagore đảo, dùng $OM=2R$ để tính cụ thể; đã kiểm $EH^2+EB^2=HB^2$ bằng toạ độ số.
- Bài 4: giải theo hình chuẩn ($M$, $N$ trên các cạnh, tam giác $ABC$ nhọn). Bài 7: giả định theo hình gốc $B$ đối xứng với $A$ qua phương thẳng đứng ($\widehat{AOB}=30^\circ$) — nếu người duyệt hiểu khác (góc ở tâm $15^\circ$) thì độ dài cung là $\dfrac{\pi}{6}$ cm.
- Bài bậc làm tròn (6, 7, 8): đề không nêu nên theo mặc định một chữ số thập phân, đồng thời ghi giá trị đúng ($\dfrac{5\pi}{3}$, $\dfrac{\pi}{3}$, $234\pi$).
- Không có đề sai.
