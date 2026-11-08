# ĐỀ | Đề cương ôn tập cuối học kì I Toán 9 — THCS Nguyễn Trường Tộ (Hà Nội) · phần Hình
nam: 2025
bo_sach: KNTT
kieu: de_cuong

## PHẦN 1 | Phần II. Hình học (Bài 21–29) | tu_luan

### Bài 21 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho $(O)$, đường kính $AB$ và lấy $M$ thuộc $(O)$. Tiếp tuyến tại $M$ cắt tiếp tuyến tại $A$ và $B$ của $(O)$ lần lượt ở $C$ và $D$. Đường thẳng $AM$ cắt $OC$ tại $E$, đường thẳng $BM$ cắt $OD$ tại $F$. Gọi $I$ là trung điểm của $CD$. Chứng minh:
a) 4 điểm $A$, $C$, $M$, $O$ cùng thuộc một đường tròn
b) $CD=AC+BD$ và tính số đo góc $COD$.
c) Tứ giác $MEOF$ là hình chữ nhật và $AB$ là tiếp tuyến của đường tròn đường kính $CD$.
**Hình:** de_P1B21.png
**Hình giải:** giai_P1B21.png
**Ghi chú:** $M$ là điểm bất kì của $(O)$, khác $A$ và $B$ (để có tiếp tuyến cắt hai tiếp tuyến kia). Đã kiểm bằng toạ độ số trên 3000 vị trí ngẫu nhiên của $M$ (đủ mọi khẳng định và thứ tự điểm).

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba tiếp tuyến tại $A$, $M$, $B$ cho hai cặp tiếp tuyến cắt nhau ở $C$ và $D$, từ đó có $CA=CM$, $DM=DB$ và $OC$, $OD$ là các tia phân giác.

**Bước 1.** Ý a: dùng tính chất tiếp tuyến để có hai góc vuông tại $A$ và $M$, rồi chọn trung điểm của $CO$ làm tâm đường tròn.

**Bước 2.** Ý b: dùng tính chất hai tiếp tuyến cắt nhau để có hai cặp đoạn thẳng bằng nhau, rồi cộng đoạn thẳng vì $M$ nằm giữa $C$ và $D$.

**Bước 3.** Ý b: dùng hai tia phân giác $OC$, $OD$ của hai góc kề bù $\widehat{AOM}$, $\widehat{MOB}$ để tính góc $\widehat{COD}$.

**Bước 4.** Ý c: chứng minh $OC\perp AM$ và $OD\perp BM$ từ hai điểm cách đều hai đầu đoạn thẳng, rồi đếm ba góc vuông của tứ giác $MEOF$.

**Bước 5.** Ý c: dùng trung tuyến ứng với cạnh huyền của tam giác $COD$ vuông để chứng minh $O$ thuộc đường tròn đường kính $CD$.

**Bước 6.** Ý c: chứng minh $IO\parallel AC$ bằng hai góc so le trong rồi suy ra $IO\perp AB$ tại điểm $O$ nằm trên đường tròn.

**Chú ý:** phải giải thích $M$ nằm giữa $C$ và $D$, và $I$, $A$ nằm khác phía đối với đường thẳng $CO$ trước khi dùng hai góc so le trong.

**Phần 2. Trình bày**

a) Vì $CA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $CA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{CAO}=90^\circ$.
Vì $CM$ là tiếp tuyến của $(O)$ tại $M$ (gt)
nên $CM\perp OM$ (tính chất tiếp tuyến),
suy ra $\widehat{CMO}=90^\circ$.
Gọi $J$ là trung điểm của $CO$.
Xét $\triangle CAO$ vuông tại $A$
có $AJ$ là đường trung tuyến ứng với cạnh huyền $CO$
nên $JA=\dfrac{CO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle CMO$ vuông tại $M$
có $MJ$ là đường trung tuyến ứng với cạnh huyền $CO$
nên $JM=\dfrac{CO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $JC=JO=\dfrac{CO}{2}$ ($J$ là trung điểm của $CO$).
Do đó $JA=JM=JC=JO=\dfrac{CO}{2}$.
Vậy bốn điểm $A$, $C$, $M$, $O$ cùng thuộc đường tròn tâm $J$,
bán kính $\dfrac{CO}{2}$.

b) Vì $CA$, $CM$ là hai tiếp tuyến cắt nhau tại $C$ của $(O)$ (gt)
nên $CA=CM$ và $OC$ là tia phân giác của $\widehat{AOM}$
(tính chất hai tiếp tuyến cắt nhau).
Vì $DB$, $DM$ là hai tiếp tuyến cắt nhau tại $D$ của $(O)$ (gt)
nên $DB=DM$ và $OD$ là tia phân giác của $\widehat{MOB}$
(tính chất hai tiếp tuyến cắt nhau).
Vì $OC$ nằm trong góc $\widehat{AOM}$, $OD$ nằm trong góc $\widehat{MOB}$ (cmt)
mà hai góc này nằm ở hai phía của tia $OM$
nên $C$, $D$ nằm khác phía đối với đường thẳng $OM$.
Mà $M$ là giao điểm của $CD$ và $OM$
nên $M$ nằm giữa $C$ và $D$.
Suy ra $CD=CM+MD=AC+BD$ (cmt).
Vì $O$ nằm giữa $A$ và $B$ nên $\widehat{AOM}+\widehat{MOB}=180^\circ$ (hai góc kề bù).
Vì $M$ nằm giữa $C$ và $D$ nên tia $OM$ nằm giữa hai tia $OC$, $OD$.
Suy ra $\widehat{COD}=\widehat{COM}+\widehat{MOD}$.
Mà $\widehat{COM}=\dfrac{1}{2}\widehat{AOM}$ và $\widehat{MOD}=\dfrac{1}{2}\widehat{MOB}$ (cmt).
Do đó $\widehat{COD}=\dfrac{1}{2}(\widehat{AOM}+\widehat{MOB})=\dfrac{1}{2}\cdot180^\circ=90^\circ$.
Vậy $CD=AC+BD$ và $\widehat{COD}=90^\circ$.

c) Vì $CA=CM$ (cmt) và $OA=OM$ (bán kính)
nên $CO$ là đường trung trực của $AM$ (tính chất đường trung trực).
Suy ra $CO\perp AM$ tại $E$, hay $\widehat{MEO}=90^\circ$.
Vì $DB=DM$ (cmt) và $OB=OM$ (bán kính)
nên $DO$ là đường trung trực của $BM$ (tính chất đường trung trực).
Suy ra $DO\perp BM$ tại $F$, hay $\widehat{MFO}=90^\circ$.
Vì $E$ thuộc tia $OC$ và $F$ thuộc tia $OD$
nên $\widehat{EOF}=\widehat{COD}=90^\circ$ (cmt).
Tứ giác $MEOF$ có $\widehat{MEO}=\widehat{MFO}=\widehat{EOF}=90^\circ$ (cmt)
nên $MEOF$ là hình chữ nhật (dấu hiệu nhận biết hình chữ nhật).
Xét $\triangle COD$ vuông tại $O$ ($\widehat{COD}=90^\circ$ (cmt))
có $OI$ là đường trung tuyến ứng với cạnh huyền $CD$ ($I$ là trung điểm của $CD$ (gt))
nên $OI=\dfrac{CD}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Do đó $O$ thuộc đường tròn tâm $I$, đường kính $CD$.
Xét $\triangle IOC$ có $IO=IC=\dfrac{CD}{2}$
nên $\triangle IOC$ cân tại $I$ (định nghĩa tam giác cân).
Suy ra $\widehat{IOC}=\widehat{ICO}$ (tính chất tam giác cân). (1)
Vì $I$ thuộc tia $CM$ nên $\widehat{ICO}=\widehat{MCO}$.
Mà $\widehat{MCO}=\widehat{ACO}$
($CO$ là tia phân giác của $\widehat{ACM}$ (tính chất hai tiếp tuyến cắt nhau)). (2)
Từ (1) và (2) suy ra $\widehat{IOC}=\widehat{ACO}$.
Vì $CO$ là đường trung trực của $AM$ (cmt)
nên $A$, $M$ nằm khác phía đối với đường thẳng $CO$.
Mà $I$ thuộc tia $CM$ nên $I$ cùng phía với $M$,
suy ra $I$, $A$ nằm khác phía đối với đường thẳng $CO$.
Hai góc $\widehat{IOC}$, $\widehat{ACO}$ ở vị trí so le trong
nên $IO\parallel AC$ (dấu hiệu nhận biết hai đường thẳng song song).
Mà $AC\perp AB$ (tính chất tiếp tuyến)
nên $IO\perp AB$ tại $O$ (quan hệ giữa tính vuông góc và tính song song).
Đường tròn tâm $I$, đường kính $CD$ đi qua $O$ (cmt)
và $IO\perp AB$ tại $O$ (cmt)
nên $AB$ là tiếp tuyến của đường tròn đường kính $CD$ (dấu hiệu nhận biết tiếp tuyến).

### Bài 22 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Từ điểm $M$ nằm ngoài đường tròn $(O)$, kẻ hai tiếp tuyến $MA$, $MB$ với đường tròn $(O)$ ($A$ và $B$ là hai tiếp điểm). Kẻ đường kính $AD$ của đường tròn $(O)$; $MO$ cắt $AB$ tại $H$.
a) Chứng minh bốn điểm $M$, $A$, $O$, $B$ cùng thuộc một đường tròn.
b) Gọi $I$ là trung điểm của đoạn thẳng $BD$. Gọi $K$ là giao điểm của $OI$ và $MB$. Chứng minh tứ giác $OHBI$ là hình chữ nhật và $KD$ là tiếp tuyến của đường tròn $(O)$.
c) Đường thẳng qua $O$ và vuông góc với $MD$ cắt tia $AB$ tại $Q$. Chứng minh $K$ là trung điểm của đoạn thẳng $DQ$.
**Hình:** de_P1B22.png
**Hình giải:** giai_P1B22.png
**Ghi chú:** đề in lỗi: "Kẻ đường kính $AD$ của đường tròn $(O)$, cắt $AB$ tại $H$" — đường kính $AD$ và $AB$ đã có chung điểm $A$ nên không thể cắt nhau ở một điểm $H$ khác (nếu hiểu $H$ trùng $A$ thì $\widehat{OAB}\ne90^\circ$ và $OHBI$ không là hình chữ nhật, ý b vô nghĩa). Ý b chỉ đúng khi $H$ là giao điểm của $MO$ và $AB$ nên đã sửa chữ đề thành "$MO$ cắt $AB$ tại $H$". Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên (đủ mọi khẳng định, thứ tự điểm $B$ giữa $A$, $Q$ và $K$ giữa $D$, $Q$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** $MO$ là đường trung trực của $AB$, $\widehat{ABD}=90^\circ$ vì $OA=OB=OD$ tạo hai tam giác cân, và $K$ nằm trên đường trung trực của $BD$; riêng ý c cần thêm giao điểm của $AB$ với tiếp tuyến tại $D$.

**Bước 1.** Ý a: dùng tính chất tiếp tuyến để có hai tam giác vuông chung cạnh huyền $MO$, rồi chọn trung điểm của $MO$ làm tâm đường tròn.

**Bước 2.** Ý b: chứng minh tứ giác $OHBI$ có ba góc vuông, dựa vào $MO\perp AB$, vào $\widehat{ABD}=90^\circ$ và vào $OI\perp BD$ (đường trung tuyến của tam giác cân $OBD$).

**Bước 3.** Ý b: so sánh hai tam giác $KOB$, $KOD$ theo trường hợp cạnh – cạnh – cạnh, dùng $K$ nằm trên đường trung trực của $BD$, để suy ra $KD\perp OD$.

**Bước 4.** Ý c: gọi $Q'$ là giao điểm của $AB$ với tiếp tuyến tại $D$, rồi chứng minh hai tam giác vuông $OAM$, $Q'DA$ đồng dạng để có hệ thức giữa $AM$ và $DQ'$.

**Bước 5.** Ý c: từ hệ thức đó chứng minh $\triangle MAD\backsim\triangle ODQ'$ rồi suy ra $OQ'\perp MD$, nên $Q'$ trùng với $Q$.

**Bước 6.** Ý c: dùng tam giác $BDQ$ vuông tại $B$ và $KB=KD$ để chứng minh $K$ là trung điểm của cạnh huyền $DQ$.

**Chú ý:** phải giải thích $B$ nằm giữa $A$ và $Q$, và $K$ nằm giữa $D$ và $Q$ trước khi kết luận về trung điểm.

**Phần 2. Trình bày**

a) Vì $MA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $MA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{MAO}=90^\circ$.
Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $MB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{MBO}=90^\circ$.
Gọi $J$ là trung điểm của $MO$.
Xét $\triangle MAO$ vuông tại $A$
có $AJ$ là đường trung tuyến ứng với cạnh huyền $MO$
nên $JA=\dfrac{MO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle MBO$ vuông tại $B$
có $BJ$ là đường trung tuyến ứng với cạnh huyền $MO$
nên $JB=\dfrac{MO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $JM=JO=\dfrac{MO}{2}$ ($J$ là trung điểm của $MO$).
Do đó $JM=JA=JO=JB=\dfrac{MO}{2}$.
Vậy bốn điểm $M$, $A$, $O$, $B$ cùng thuộc đường tròn tâm $J$,
bán kính $\dfrac{MO}{2}$.

b) Vì $MA$, $MB$ là hai tiếp tuyến cắt nhau tại $M$ của $(O)$ (gt)
nên $MA=MB$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OB$ (bán kính)
nên $MO$ là đường trung trực của $AB$ (tính chất đường trung trực).
Suy ra $MO\perp AB$ tại $H$, hay $\widehat{OHB}=90^\circ$. (1)
Vì $AD$ là đường kính nên $O$ nằm giữa $A$ và $D$, $OA=OB=OD$ (bán kính).
Xét $\triangle OAB$ có $OA=OB$ nên cân tại $O$,
suy ra $\widehat{OBA}=\widehat{OAB}$ (tính chất tam giác cân).
Xét $\triangle OBD$ có $OB=OD$ nên cân tại $O$,
suy ra $\widehat{OBD}=\widehat{ODB}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $A$ và $D$ nên tia $BO$ nằm giữa hai tia $BA$, $BD$.
Suy ra $\widehat{ABD}=\widehat{OBA}+\widehat{OBD}=\widehat{BAD}+\widehat{BDA}$.
Xét $\triangle ABD$
có $\widehat{BAD}+\widehat{ABD}+\widehat{BDA}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{ABD}=180^\circ$, hay $\widehat{ABD}=90^\circ$.
Vì $H$ thuộc đoạn $AB$, $I$ thuộc đoạn $BD$
nên $\widehat{HBI}=\widehat{ABD}=90^\circ$. (2)
Xét $\triangle OBD$ cân tại $O$ (cmt)
có $OI$ là đường trung tuyến ($I$ là trung điểm của $BD$ (gt))
nên $OI\perp BD$ (tính chất tam giác cân),
suy ra $\widehat{OIB}=90^\circ$. (3)
Tứ giác $OHBI$ có $\widehat{OHB}=\widehat{HBI}=\widehat{OIB}=90^\circ$ (cmt)
nên $OHBI$ là hình chữ nhật (dấu hiệu nhận biết hình chữ nhật).
Vì $OI\perp BD$ tại trung điểm $I$ của $BD$ (cmt)
nên $OI$ là đường trung trực của $BD$ (tính chất đường trung trực).
Mà $K$ thuộc đường thẳng $OI$ (gt)
nên $KB=KD$ (tính chất đường trung trực).
Xét $\triangle KOB$ và $\triangle KOD$ có:
$KB=KD$ (cmt);
$OB=OD$ (bán kính);
$KO$ chung
nên $\triangle KOB=\triangle KOD$ (c.c.c).
Suy ra $\widehat{KDO}=\widehat{KBO}$ (hai góc tương ứng).
Mà $K$ thuộc $MB$ và $MB\perp OB$ nên $\widehat{KBO}=90^\circ$ (tính chất tiếp tuyến).
Do đó $\widehat{KDO}=90^\circ$, tức là $KD\perp OD$ tại $D$ thuộc $(O)$.
Vậy tứ giác $OHBI$ là hình chữ nhật và $KD$ là tiếp tuyến của $(O)$
(dấu hiệu nhận biết tiếp tuyến).

c) Gọi $Q'$ là giao điểm của đường thẳng $AB$ và tiếp tuyến của $(O)$ tại $D$.
Vì $DQ'$ là tiếp tuyến của $(O)$ tại $D$
nên $DQ'\perp OD$ (tính chất tiếp tuyến),
suy ra $\widehat{ADQ'}=90^\circ$.
Xét $\triangle AOH$ vuông tại $H$ ($MO\perp AB$ (cmt))
có $\widehat{AOH}+\widehat{OAH}=90^\circ$ (hai góc nhọn phụ nhau).
Vì $H$ thuộc đoạn $MO$ và đoạn $AB$, $O$ thuộc tia $AD$
nên $\widehat{AOH}=\widehat{AOM}$ và $\widehat{OAH}=\widehat{DAQ'}$.
Suy ra $\widehat{AOM}+\widehat{DAQ'}=90^\circ$. (4)
Xét $\triangle ADQ'$ vuông tại $D$
có $\widehat{DAQ'}+\widehat{AQ'D}=90^\circ$ (hai góc nhọn phụ nhau). (5)
Từ (4) và (5) suy ra $\widehat{AOM}=\widehat{AQ'D}$.
Xét $\triangle OAM$ và $\triangle Q'DA$ có:
$\widehat{OAM}=\widehat{Q'DA}=90^\circ$ (cmt);
$\widehat{AOM}=\widehat{DQ'A}$ (cmt)
nên $\triangle OAM\backsim\triangle Q'DA$ (g.g).
Suy ra $\dfrac{OA}{Q'D}=\dfrac{AM}{DA}$ (hai tam giác đồng dạng),
hay $\dfrac{AM}{OD}=\dfrac{AD}{DQ'}$ (vì $OA=OD$).
Xét $\triangle MAD$ và $\triangle ODQ'$ có:
$\widehat{MAD}=\widehat{ODQ'}=90^\circ$ (tính chất tiếp tuyến; cmt);
$\dfrac{AM}{OD}=\dfrac{AD}{DQ'}$ (cmt)
nên $\triangle MAD\backsim\triangle ODQ'$ (c.g.c).
Suy ra $\widehat{AMD}=\widehat{DOQ'}$ (hai góc tương ứng).
Gọi $T$ là giao điểm của $MD$ và $OQ'$.
Xét $\triangle MAD$ vuông tại $A$
có $\widehat{ADM}+\widehat{AMD}=90^\circ$ (hai góc nhọn phụ nhau).
Vì $O$ thuộc tia $DA$, $T$ thuộc tia $DM$ và tia $OQ'$
nên $\widehat{ODT}=\widehat{ADM}$ và $\widehat{DOT}=\widehat{DOQ'}=\widehat{AMD}$.
Suy ra $\widehat{ODT}+\widehat{DOT}=90^\circ$.
Xét $\triangle ODT$
có $\widehat{ODT}+\widehat{DOT}+\widehat{OTD}=180^\circ$ (tổng ba góc của tam giác).
Do đó $\widehat{OTD}=90^\circ$, tức là $OQ'\perp MD$.
Mà $OQ\perp MD$ (gt) nên hai đường thẳng $OQ$ và $OQ'$ trùng nhau.
Hai đường thẳng $OQ$ và $AB$ cắt nhau tại $Q$ và tại $Q'$
nên $Q$ trùng với $Q'$.
Vậy $Q$ thuộc tiếp tuyến của $(O)$ tại $D$, tức là $DQ\perp AD$.
Xét $\triangle ADQ$ vuông tại $D$
có $DB\perp AQ$ tại $B$ ($\widehat{ABD}=90^\circ$ (cmt))
nên $B$ nằm giữa $A$ và $Q$,
suy ra $\widehat{DBQ}=90^\circ$.
Vì $K$ cũng thuộc tiếp tuyến tại $D$ (cmt)
nên $K$, $D$, $Q$ thẳng hàng.
Vì $KB=KD$ (cmt) nên $\triangle KBD$ cân tại $K$,
suy ra $\widehat{KBD}=\widehat{KDB}$ (tính chất tam giác cân).
Hai góc này là góc ở đáy tam giác cân nên là góc nhọn,
mà $\widehat{QDB}$ là góc nhọn của tam giác vuông $BDQ$
nên $K$ thuộc tia $DQ$.
Vì $\widehat{DBK}=\widehat{KDB}=\widehat{QDB}<90^\circ=\widehat{DBQ}$
nên tia $BK$ nằm giữa hai tia $BD$, $BQ$,
do đó $K$ nằm giữa $D$ và $Q$.
Suy ra $\widehat{KBQ}=\widehat{DBQ}-\widehat{DBK}=90^\circ-\widehat{QDB}$.
Xét $\triangle BDQ$ vuông tại $B$
có $\widehat{KQB}=\widehat{DQB}=90^\circ-\widehat{QDB}$ (hai góc nhọn phụ nhau).
Do đó $\widehat{KBQ}=\widehat{KQB}$,
suy ra $\triangle KBQ$ cân tại $K$ và $KB=KQ$.
Mà $KB=KD$ (cmt) nên $KD=KQ$.
Vì $K$ nằm giữa $D$ và $Q$ (cmt) và $KD=KQ$
nên $K$ là trung điểm của đoạn thẳng $DQ$.

### Bài 23 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho $(O;R)$, đường kính $AB$. Kẻ tiếp tuyến $Ax$, lấy $P$ trên $Ax$ ($AP>R$). Từ $P$ kẻ tiếp tuyến $PM$ của $(O)$ ($M$ là tiếp điểm)
a) Chứng minh $A$, $P$, $M$, $O$ cùng thuộc một đường tròn
b) Chứng minh $BM\parallel OP$
c) Đường thẳng vuông góc với $AB$ tại $O$ cắt tia $BM$ tại $N$. Chứng minh tứ giác $OBNP$ là hình bình hành
d) Giả sử $AN$ cắt $OP$ tại $K$; $PM$ cắt $ON$ tại $I$; $PN$ cắt $OM$ tại $J$. Chứng minh $I$, $J$, $K$ thẳng hàng
**Hình:** de_P1B23.png
**Hình giải:** giai_P1B23.png
**Ghi chú:** hình giải thêm đường thẳng $IJ$ (đi qua $K$) và các dấu bằng nhau $IO=IP$, $JO=JP$ dùng ở ý d. Đã kiểm bằng toạ độ số trên 3000 vị trí ngẫu nhiên của $P$ với $AP>R$ (đủ mọi khẳng định và thứ tự điểm).

**Phần 1. Hướng dẫn**

**Mấu chốt:** $PO$ là đường trung trực của $AM$ và $\widehat{AMB}=90^\circ$ cho $BM\parallel OP$; sau đó các cặp song song biến $OBNP$ và $APNO$ thành hình bình hành, và ba điểm $I$, $J$, $K$ cùng cách đều hai đầu đoạn $OP$.

**Bước 1.** Ý a: dùng tính chất tiếp tuyến để có hai tam giác vuông chung cạnh huyền $PO$, rồi chọn trung điểm của $PO$ làm tâm đường tròn.

**Bước 2.** Ý b: chứng minh $OP\perp AM$ từ hai điểm cách đều $A$, $M$, và chứng minh $BM\perp AM$ bằng tam giác cân cùng tổng ba góc.

**Bước 3.** Ý c: so sánh hai tam giác vuông $PAO$, $NOB$ có cạnh góc vuông bằng nhau và góc nhọn bằng nhau (nhờ $OP\parallel BN$) để có $PO=NB$.

**Bước 4.** Ý d: chứng minh tứ giác $APNO$ là hình bình hành để $K$ là trung điểm của $OP$, vì $K$ là giao điểm hai đường chéo.

**Bước 5.** Ý d: dùng hai góc so le trong và tính chất hai tiếp tuyến cắt nhau để chỉ ra các tam giác $IOP$, $JOP$ cân tại $I$ và $J$.

**Bước 6.** Ý d: nhận ra ba điểm $I$, $J$, $K$ cùng cách đều hai điểm $O$, $P$ nên cùng nằm trên đường trung trực của $OP$.

**Chú ý:** khi dùng hai góc so le trong phải giải thích $N$ và $A$ nằm khác phía đối với đường thẳng $OP$.

**Phần 2. Trình bày**

a) Vì $PA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $PA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{PAO}=90^\circ$.
Vì $PM$ là tiếp tuyến của $(O)$ tại $M$ (gt)
nên $PM\perp OM$ (tính chất tiếp tuyến),
suy ra $\widehat{PMO}=90^\circ$.
Gọi $S$ là trung điểm của $PO$.
Xét $\triangle PAO$ vuông tại $A$
có $AS$ là đường trung tuyến ứng với cạnh huyền $PO$
nên $SA=\dfrac{PO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle PMO$ vuông tại $M$
có $MS$ là đường trung tuyến ứng với cạnh huyền $PO$
nên $SM=\dfrac{PO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $SP=SO=\dfrac{PO}{2}$ ($S$ là trung điểm của $PO$).
Do đó $SA=SP=SM=SO=\dfrac{PO}{2}$.
Vậy bốn điểm $A$, $P$, $M$, $O$ cùng thuộc đường tròn tâm $S$,
bán kính $\dfrac{PO}{2}$.

b) Vì $PA$, $PM$ là hai tiếp tuyến cắt nhau tại $P$ của $(O)$ (gt)
nên $PA=PM$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OM$ (bán kính)
nên $PO$ là đường trung trực của $AM$ (tính chất đường trung trực).
Suy ra $PO\perp AM$. (1)
Vì $OA=OB=OM$ (bán kính)
nên $\triangle OAM$ và $\triangle OBM$ cân tại $O$.
Suy ra $\widehat{OMA}=\widehat{OAM}$ và $\widehat{OMB}=\widehat{OBM}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $A$ và $B$ nên tia $MO$ nằm giữa hai tia $MA$, $MB$.
Suy ra $\widehat{AMB}=\widehat{OMA}+\widehat{OMB}=\widehat{MAB}+\widehat{MBA}$.
Xét $\triangle MAB$
có $\widehat{MAB}+\widehat{MBA}+\widehat{AMB}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{AMB}=180^\circ$, hay $\widehat{AMB}=90^\circ$,
tức là $BM\perp AM$. (2)
Từ (1) và (2) suy ra $BM\parallel OP$ (cùng vuông góc với $AM$).

c) Vì $ON\perp AB$ (gt) và $PA\perp AB$ (tính chất tiếp tuyến)
nên $PA\parallel ON$ (cùng vuông góc với $AB$).
Vì $N$ thuộc tia $BM$ và $BM\parallel OP$ (cmt)
nên $BN\parallel OP$.
Xét $\triangle PAO$ và $\triangle NOB$ có:
$\widehat{PAO}=\widehat{NOB}=90^\circ$ (tính chất tiếp tuyến; gt);
$OA=OB$ (bán kính);
$\widehat{POA}=\widehat{NBO}$ (hai góc đồng vị, $OP\parallel BN$ (cmt), $P$, $N$ cùng phía đối với $AB$)
nên $\triangle PAO=\triangle NOB$ (g.c.g).
Suy ra $PO=NB$ (hai cạnh tương ứng).
Tứ giác $OBNP$ có $OP\parallel BN$ (cmt) và $OP=BN$ (cmt)
nên $OBNP$ là hình bình hành (dấu hiệu nhận biết hình bình hành).

d) Vì $OBNP$ là hình bình hành (cmt)
nên $PN\parallel OB$ (tính chất hình bình hành),
hay $PN\parallel OA$.
Tứ giác $APNO$ có $PA\parallel ON$ (cmt) và $PN\parallel AO$ (cmt)
nên $APNO$ là hình bình hành (dấu hiệu nhận biết hình bình hành).
Do đó hai đường chéo $AN$ và $OP$ cắt nhau tại trung điểm của mỗi đường
(tính chất hình bình hành).
Mà $K$ là giao điểm của $AN$ và $OP$ (gt)
nên $K$ là trung điểm của $OP$,
suy ra $KO=KP$. (3)
Vì $ON\parallel PA$ (cmt) và $N$, $A$ nằm khác phía đối với đường thẳng $OP$
nên $\widehat{NOP}=\widehat{OPA}$ (hai góc so le trong).
Mà $\widehat{OPA}=\widehat{OPM}$
($PO$ là tia phân giác của $\widehat{APM}$ (tính chất hai tiếp tuyến cắt nhau)).
Vì $I$ thuộc tia $ON$ và tia $PM$
nên $\widehat{IOP}=\widehat{NOP}$ và $\widehat{IPO}=\widehat{MPO}$.
Suy ra $\widehat{IOP}=\widehat{IPO}$,
do đó $\triangle IOP$ cân tại $I$ (dấu hiệu nhận biết tam giác cân)
nên $IO=IP$. (4)
Vì $PN\parallel OA$ (cmt) và $N$, $A$ nằm khác phía đối với đường thẳng $OP$
nên $\widehat{OPN}=\widehat{POA}$ (hai góc so le trong).
Mà $\widehat{POA}=\widehat{POM}$
($OP$ là tia phân giác của $\widehat{AOM}$ (tính chất hai tiếp tuyến cắt nhau)).
Vì $J$ thuộc tia $PN$ và tia $OM$
nên $\widehat{JPO}=\widehat{NPO}$ và $\widehat{JOP}=\widehat{MOP}$.
Suy ra $\widehat{JPO}=\widehat{JOP}$,
do đó $\triangle JOP$ cân tại $J$ (dấu hiệu nhận biết tam giác cân)
nên $JO=JP$. (5)
Từ (3), (4), (5) suy ra $K$, $I$, $J$ đều cách đều hai điểm $O$, $P$
nên cùng thuộc đường trung trực của $OP$ (tính chất đường trung trực).
Vậy $I$, $J$, $K$ thẳng hàng.

### Bài 24 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O;R)$ và dây $AB$ khác đường kính. Kẻ $OI$ vuông góc với $AB$ tại $I$, tiếp tuyến của đường tròn $(O)$ tại $A$ cắt đường thẳng $OI$ tại $M$.
a) Chứng minh: $OI\cdot OM=R^2$
b) Chứng minh $MB$ là tiếp tuyến của $(O)$ và 4 điểm $A$, $B$, $M$, $O$ thuộc một đường tròn.
c) Kẻ đường kính $AD$ của đường tròn $(O)$, tiếp tuyến của đường tròn $(O)$ tại $D$ cắt đường thẳng $AB$ tại $N$. Chứng minh $MD$ vuông góc $ON$.
**Hình:** de_P1B24.png
**Hình giải:** giai_P1B24.png
**Ghi chú:** hình đề không vẽ $MB$ vì đó là điều phải chứng minh ở ý b; hình giải thêm $MB$, đường tròn đường kính $OM$ và giao điểm $T$ của $MD$ với $ON$. Hệ thức ở ý a suy ra từ hai tam giác đồng dạng (không dùng thẳng hệ thức đường cao). Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên (đủ mọi khẳng định và thứ tự điểm).

**Phần 1. Hướng dẫn**

**Mấu chốt:** $OM$ là đường trung trực của $AB$ nên hai tam giác $OAM$, $OBM$ bằng nhau; các hệ thức và góc vuông còn lại đều đi qua các cặp tam giác vuông đồng dạng.

**Bước 1.** Ý a: tìm hai tam giác vuông $OIA$, $OAM$ có chung góc nhọn tại đỉnh $O$ rồi chứng minh đồng dạng để viết tỉ lệ thức.

**Bước 2.** Ý b: chứng minh $\triangle OAM=\triangle OBM$ theo trường hợp cạnh – góc – cạnh, dùng $OI$ là tia phân giác của tam giác cân $OAB$, rồi suy ra $\widehat{OBM}=90^\circ$.

**Bước 3.** Ý b: dùng hai góc vuông $\widehat{OAM}$, $\widehat{OBM}$ cùng nhìn cạnh $OM$ để chọn trung điểm của $OM$ làm tâm đường tròn.

**Bước 4.** Ý c: đổi $\widehat{AOM}$ thành $\widehat{AND}$ qua góc $\widehat{OAB}$, rồi chứng minh hai tam giác vuông $OAM$, $NDA$ đồng dạng.

**Bước 5.** Ý c: từ tỉ lệ thức của hai tam giác đồng dạng đó chứng minh $\triangle MAD\backsim\triangle ODN$ theo trường hợp cạnh – góc – cạnh.

**Bước 6.** Ý c: cộng hai góc nhọn của tam giác vuông $MAD$ rồi chuyển sang tam giác $ODT$ ($T$ là giao của $MD$ và $ON$) để tìm góc $\widehat{OTD}$.

**Chú ý:** hai điểm $M$, $N$ nằm cùng phía đối với đường thẳng $AD$; cần nói rõ $I$ thuộc tia $OM$ và $N$ thuộc tia $AB$ khi đổi các góc.

**Phần 2. Trình bày**

a) Vì $OI\perp AB$ tại $I$ (gt)
nên $\widehat{OIA}=90^\circ$.
Vì $MA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $MA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{OAM}=90^\circ$.
Xét $\triangle OIA$ và $\triangle OAM$ có:
$\widehat{OIA}=\widehat{OAM}=90^\circ$ (cmt);
$\widehat{AOI}=\widehat{MOA}$ (góc chung, $I$ thuộc tia $OM$)
nên $\triangle OIA\backsim\triangle OAM$ (g.g).
Suy ra $\dfrac{OI}{OA}=\dfrac{OA}{OM}$ (hai tam giác đồng dạng).
Do đó $OI\cdot OM=OA^2=R^2$.

b) Xét $\triangle OAB$ có $OA=OB=R$
nên cân tại $O$ (định nghĩa tam giác cân).
Mà $OI\perp AB$ (gt)
nên $OI$ là tia phân giác của $\widehat{AOB}$ (tính chất tam giác cân).
Suy ra $\widehat{AOM}=\widehat{BOM}$ ($I$ thuộc tia $OM$).
Xét $\triangle OAM$ và $\triangle OBM$ có:
$OA=OB$ (bán kính);
$\widehat{AOM}=\widehat{BOM}$ (cmt);
$OM$ chung
nên $\triangle OAM=\triangle OBM$ (c.g.c).
Suy ra $\widehat{OBM}=\widehat{OAM}=90^\circ$ (hai góc tương ứng),
tức là $MB\perp OB$ tại $B$ thuộc $(O)$.
Vậy $MB$ là tiếp tuyến của $(O)$ (dấu hiệu nhận biết tiếp tuyến).
Gọi $S$ là trung điểm của $OM$.
Xét $\triangle OAM$ vuông tại $A$
có $AS$ là đường trung tuyến ứng với cạnh huyền $OM$
nên $SA=\dfrac{OM}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle OBM$ vuông tại $B$ (cmt)
có $BS$ là đường trung tuyến ứng với cạnh huyền $OM$
nên $SB=\dfrac{OM}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $SO=SM=\dfrac{OM}{2}$ ($S$ là trung điểm của $OM$).
Do đó $SA=SB=SO=SM=\dfrac{OM}{2}$.
Vậy bốn điểm $A$, $B$, $M$, $O$ cùng thuộc đường tròn tâm $S$,
bán kính $\dfrac{OM}{2}$.

c) Vì $DN$ là tiếp tuyến của $(O)$ tại $D$ (gt)
nên $DN\perp OD$ (tính chất tiếp tuyến),
suy ra $\widehat{ADN}=90^\circ$ ($O$ thuộc $AD$).
Xét $\triangle OAI$ vuông tại $I$ ($\widehat{OIA}=90^\circ$ (cmt))
có $\widehat{AOI}+\widehat{OAI}=90^\circ$ (hai góc nhọn phụ nhau).
Vì $I$ thuộc tia $OM$ và tia $AB$
nên $\widehat{AOI}=\widehat{AOM}$ và $\widehat{OAI}=\widehat{OAB}$.
Suy ra $\widehat{AOM}+\widehat{OAB}=90^\circ$. (1)
Vì $O$ thuộc tia $AD$ và $N$ thuộc tia $AB$
nên $\widehat{OAB}=\widehat{DAN}$. (2)
Xét $\triangle ADN$ vuông tại $D$
có $\widehat{DAN}+\widehat{AND}=90^\circ$ (hai góc nhọn phụ nhau). (3)
Từ (1), (2), (3) suy ra $\widehat{AOM}=\widehat{AND}$.
Xét $\triangle OAM$ và $\triangle NDA$ có:
$\widehat{OAM}=\widehat{NDA}=90^\circ$ (cmt);
$\widehat{AOM}=\widehat{DNA}$ (cmt)
nên $\triangle OAM\backsim\triangle NDA$ (g.g).
Suy ra $\dfrac{OA}{ND}=\dfrac{AM}{DA}$ (hai tam giác đồng dạng),
hay $\dfrac{AM}{OD}=\dfrac{AD}{DN}$ (vì $OA=OD$).
Xét $\triangle MAD$ và $\triangle ODN$ có:
$\widehat{MAD}=\widehat{ODN}=90^\circ$ (tính chất tiếp tuyến; cmt);
$\dfrac{AM}{OD}=\dfrac{AD}{DN}$ (cmt)
nên $\triangle MAD\backsim\triangle ODN$ (c.g.c).
Suy ra $\widehat{AMD}=\widehat{DON}$ (hai góc tương ứng).
Gọi $T$ là giao điểm của $MD$ và $ON$.
Xét $\triangle MAD$ vuông tại $A$
có $\widehat{ADM}+\widehat{AMD}=90^\circ$ (hai góc nhọn phụ nhau).
Vì $O$ thuộc tia $DA$, $T$ thuộc tia $DM$ và tia $ON$
nên $\widehat{ODT}=\widehat{ADM}$ và $\widehat{DOT}=\widehat{DON}=\widehat{AMD}$.
Suy ra $\widehat{ODT}+\widehat{DOT}=90^\circ$.
Xét $\triangle ODT$
có $\widehat{ODT}+\widehat{DOT}+\widehat{OTD}=180^\circ$ (tổng ba góc của tam giác).
Do đó $\widehat{OTD}=90^\circ$.
Vậy $MD\perp ON$.

### Bài 25 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O)$ và điểm $A$ nằm bên ngoài đường tròn. Qua $A$ kẻ hai tiếp tuyến $AB$, $AC$ đến $(O)$ ($B$, $C$ là tiếp điểm).
a) Chứng minh bốn điểm $A$, $B$, $O$, $C$ cùng thuộc một đường tròn. Chỉ rõ tâm và bán kính của đường tròn đó
b) Gọi $H$ là giao điểm của $OA$ và $BC$, kẻ $HK$ vuông góc với $AB$ tại $K$. Chứng minh: $OA\perp BC$ và $OH\cdot HA=BK\cdot BA$
c) Chứng minh $HK$ là tiếp tuyến của đường tròn đường kính $AC$ và $HK$ đi qua trung điểm của đoạn $OC$.
**Hình:** de_P1B25.png
**Hình giải:** giai_P1B25.png
**Ghi chú:** hình giải thêm $I$ là trung điểm của $AC$ (tâm đường tròn đường kính $AC$) và $L$ là giao điểm của $HK$ với $OC$. Hệ thức ở ý b suy ra từ hai cặp tam giác đồng dạng (không dùng thẳng hệ thức đường cao); ý c dùng tam giác đồng dạng thay cho đường trung bình. Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $AO$ là đường trung trực của $BC$, nên $BH$ là đường cao của hai tam giác vuông liên quan và cả hai tích ở ý b cùng bằng $BH^2$; điểm $H$ cũng nằm trên đường tròn đường kính $AC$.

**Bước 1.** Ý a: dùng tính chất tiếp tuyến để có hai tam giác vuông $OBA$, $OCA$ chung cạnh huyền $OA$, rồi chọn trung điểm của $OA$ làm tâm.

**Bước 2.** Ý b: dùng $AB=AC$ và $OB=OC$ để có $OA$ là đường trung trực của $BC$, rồi chứng minh hai cặp tam giác vuông đồng dạng cùng cho tích bằng $BH^2$.

**Bước 3.** Ý c: gọi $I$ là trung điểm của $AC$, chứng minh $H$ thuộc đường tròn tâm $I$ rồi cộng hai góc để có $HK\perp HI$.

**Bước 4.** Ý c: nhận ra $HK\parallel OB$ vì cùng vuông góc với $AB$, rồi dùng hai tam giác đồng dạng $CHL$, $CBO$ với $L$ là giao điểm của $HK$ và $OC$.

**Chú ý:** cần giải thích $K$ và $I$ nằm khác phía đối với đường thẳng $AH$ khi cộng góc, và $L$ nằm trên tia $CO$.

**Phần 2. Trình bày**

a) Vì $AB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $AB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{ABO}=90^\circ$.
Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ (gt)
nên $AC\perp OC$ (tính chất tiếp tuyến),
suy ra $\widehat{ACO}=90^\circ$.
Gọi $S$ là trung điểm của $OA$.
Xét $\triangle ABO$ vuông tại $B$
có $BS$ là đường trung tuyến ứng với cạnh huyền $OA$
nên $SB=\dfrac{OA}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle ACO$ vuông tại $C$
có $CS$ là đường trung tuyến ứng với cạnh huyền $OA$
nên $SC=\dfrac{OA}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $SA=SO=\dfrac{OA}{2}$ ($S$ là trung điểm của $OA$).
Do đó $SA=SB=SO=SC=\dfrac{OA}{2}$.
Vậy bốn điểm $A$, $B$, $O$, $C$ cùng thuộc đường tròn tâm $S$ là trung điểm của $OA$,
bán kính $\dfrac{OA}{2}$.

b) Vì $AB$, $AC$ là hai tiếp tuyến cắt nhau tại $A$ của $(O)$ (gt)
nên $AB=AC$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OB=OC$ (bán kính)
nên $AO$ là đường trung trực của $BC$ (tính chất đường trung trực).
Suy ra $OA\perp BC$ tại $H$, và $H$ là trung điểm của $BC$.
Xét $\triangle OBA$ vuông tại $B$ (cmt)
có $\widehat{BOA}+\widehat{BAO}=90^\circ$ (hai góc nhọn phụ nhau). (1)
Xét $\triangle BHA$ vuông tại $H$ ($OA\perp BC$ (cmt))
có $\widehat{HBA}+\widehat{BAH}=90^\circ$ (hai góc nhọn phụ nhau). (2)
Vì $H$ thuộc tia $OA$ và tia $AO$
nên $\widehat{BOA}=\widehat{BOH}$ và $\widehat{BAO}=\widehat{BAH}$.
Từ (1) và (2) suy ra $\widehat{BOH}=\widehat{HBA}$.
Xét $\triangle OHB$ và $\triangle BHA$ có:
$\widehat{OHB}=\widehat{BHA}=90^\circ$ (cmt);
$\widehat{HOB}=\widehat{HBA}$ (cmt)
nên $\triangle OHB\backsim\triangle BHA$ (g.g).
Suy ra $\dfrac{OH}{BH}=\dfrac{BH}{HA}$ (hai tam giác đồng dạng),
tức là $OH\cdot HA=BH^2$. (3)
Xét $\triangle BKH$ và $\triangle BHA$ có:
$\widehat{BKH}=\widehat{BHA}=90^\circ$ ($HK\perp AB$ (gt); cmt);
$\widehat{KBH}=\widehat{HBA}$ (góc chung, $K$ thuộc tia $BA$)
nên $\triangle BKH\backsim\triangle BHA$ (g.g).
Suy ra $\dfrac{BK}{BH}=\dfrac{BH}{BA}$ (hai tam giác đồng dạng),
tức là $BK\cdot BA=BH^2$. (4)
Từ (3) và (4) suy ra $OH\cdot HA=BK\cdot BA$ (cùng bằng $BH^2$).

c) Gọi $I$ là trung điểm của $AC$.
Vì $OA\perp BC$ tại $H$ (cmt) nên $\widehat{AHC}=90^\circ$.
Xét $\triangle AHC$ vuông tại $H$
có $HI$ là đường trung tuyến ứng với cạnh huyền $AC$
nên $IH=IA=IC=\dfrac{AC}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Do đó $H$ thuộc đường tròn tâm $I$, đường kính $AC$.
Xét $\triangle IAH$ có $IA=IH$ nên cân tại $I$,
suy ra $\widehat{IHA}=\widehat{IAH}$ (tính chất tam giác cân).
Vì $AO$ là tia phân giác của $\widehat{BAC}$ (tính chất hai tiếp tuyến cắt nhau)
nên $\widehat{CAH}=\widehat{BAH}$.
Vì $I$ thuộc tia $AC$ nên $\widehat{IAH}=\widehat{CAH}$.
Suy ra $\widehat{IHA}=\widehat{BAH}$.
Xét $\triangle AKH$ vuông tại $K$ ($HK\perp AB$ (gt))
có $\widehat{KAH}+\widehat{KHA}=90^\circ$ (hai góc nhọn phụ nhau).
Mà $\widehat{KAH}=\widehat{BAH}$ ($K$ thuộc tia $AB$)
nên $\widehat{IHA}+\widehat{KHA}=90^\circ$.
Vì $K$ thuộc cạnh $AB$, $I$ thuộc cạnh $AC$ nên $K$, $I$ nằm khác phía đối với đường thẳng $AH$.
Suy ra $\widehat{KHI}=\widehat{KHA}+\widehat{AHI}=90^\circ$.
Do đó $HK\perp HI$ tại $H$ thuộc đường tròn tâm $I$, đường kính $AC$.
Vậy $HK$ là tiếp tuyến của đường tròn đường kính $AC$ (dấu hiệu nhận biết tiếp tuyến).
Gọi $L$ là giao điểm của $HK$ và $OC$.
Vì $HK\perp AB$ (gt) và $OB\perp AB$ (tính chất tiếp tuyến)
nên $HK\parallel OB$ (cùng vuông góc với $AB$),
hay $HL\parallel BO$.
Vì $H$ nằm giữa $B$ và $C$ nên $L$ nằm trên tia $CO$.
Xét $\triangle CHL$ và $\triangle CBO$ có:
$\widehat{CHL}=\widehat{CBO}$ (hai góc đồng vị, $HL\parallel BO$);
$\widehat{HCL}=\widehat{BCO}$ (góc chung, $H$ thuộc tia $CB$, $L$ thuộc tia $CO$)
nên $\triangle CHL\backsim\triangle CBO$ (g.g).
Suy ra $\dfrac{CL}{CO}=\dfrac{CH}{CB}=\dfrac{1}{2}$ ($H$ là trung điểm của $BC$ (cmt)).
Mà $L$ thuộc tia $CO$ nên $L$ là trung điểm của $OC$.
Vậy $HK$ đi qua trung điểm $L$ của đoạn $OC$.

### Bài 26 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O)$, có bán kính $R$, điểm $K$ bên ngoài đường tròn. Vẽ hai tiếp tuyến $KA$, $KB$ với đường tròn $(O)$ ($A$, $B$ là các tiếp điểm).
a) Chứng minh bốn điểm $K$, $A$, $O$, $B$ cùng thuộc một đường tròn
b) Vẽ đường kính $AC$ của đường tròn $(O)$. Chứng minh $BC\parallel KO$.
c) Chứng minh $BC\cdot KO=2R^2$. Tính diện tích tam giác $ABC$ theo $R$, biết $OK=2R$.
**Hình:** de_P1B26.png
**Hình giải:** giai_P1B26.png
**Ghi chú:** hình vẽ theo $OK=2R$ (giả thiết của phần cuối ý c); hình giải thêm giao điểm $H$ của $AB$ và $KO$ cùng các dấu góc vuông, đoạn bằng nhau. Hệ thức $BC\cdot KO=2R^2$ suy ra từ hai tam giác đồng dạng. Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên và 1000 cấu hình có $OK=2R$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $KO$ là đường trung trực của $AB$, và $\widehat{ABC}=90^\circ$ vì $OA=OB=OC$ tạo hai tam giác cân; hai tam giác vuông $ABC$, $KAO$ có một góc nhọn bằng nhau.

**Bước 1.** Ý a: dùng tính chất tiếp tuyến để có hai tam giác vuông chung cạnh huyền $KO$, rồi chọn trung điểm của $KO$ làm tâm đường tròn.

**Bước 2.** Ý b: chứng minh $\widehat{ABC}=90^\circ$ bằng hai tam giác cân và tổng ba góc, rồi so sánh với $KO\perp AB$ để có hai đường thẳng song song.

**Bước 3.** Ý c: đổi góc $\widehat{AOK}$ thành góc $\widehat{ACB}$ qua hai góc phụ nhau, rồi chứng minh $\triangle ABC\backsim\triangle KAO$.

**Bước 4.** Ý c: từ tỉ lệ thức của hai tam giác đồng dạng suy ra tích $BC\cdot KO$ theo $OA$ và $AC$, rồi thay $AC$ bằng hai lần bán kính.

**Bước 5.** Ý c: thay độ dài $OK$ đã cho vào hệ thức để có $BC$, rồi dùng định lí Pythagore tính $AB$ và công thức diện tích tam giác vuông.

**Chú ý:** hệ thức của ý c không dùng thẳng hệ thức đường cao mà suy ra từ tam giác đồng dạng.

**Phần 2. Trình bày**

a) Vì $KA$ là tiếp tuyến của $(O)$ tại $A$ (gt)
nên $KA\perp OA$ (tính chất tiếp tuyến),
suy ra $\widehat{KAO}=90^\circ$.
Vì $KB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $KB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{KBO}=90^\circ$.
Gọi $S$ là trung điểm của $KO$.
Xét $\triangle KAO$ vuông tại $A$
có $AS$ là đường trung tuyến ứng với cạnh huyền $KO$
nên $SA=\dfrac{KO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle KBO$ vuông tại $B$
có $BS$ là đường trung tuyến ứng với cạnh huyền $KO$
nên $SB=\dfrac{KO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $SK=SO=\dfrac{KO}{2}$ ($S$ là trung điểm của $KO$).
Do đó $SK=SA=SO=SB=\dfrac{KO}{2}$.
Vậy bốn điểm $K$, $A$, $O$, $B$ cùng thuộc đường tròn tâm $S$,
bán kính $\dfrac{KO}{2}$.

b) Vì $KA$, $KB$ là hai tiếp tuyến cắt nhau tại $K$ của $(O)$ (gt)
nên $KA=KB$ (tính chất hai tiếp tuyến cắt nhau).
Mà $OA=OB$ (bán kính)
nên $KO$ là đường trung trực của $AB$ (tính chất đường trung trực).
Suy ra $KO\perp AB$ tại $H$. (1)
Vì $AC$ là đường kính nên $O$ nằm giữa $A$ và $C$, $OA=OB=OC=R$.
Xét $\triangle OAB$ có $OA=OB$ nên cân tại $O$,
suy ra $\widehat{OBA}=\widehat{OAB}$ (tính chất tam giác cân).
Xét $\triangle OBC$ có $OB=OC$ nên cân tại $O$,
suy ra $\widehat{OBC}=\widehat{OCB}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $A$ và $C$ nên tia $BO$ nằm giữa hai tia $BA$, $BC$.
Suy ra $\widehat{ABC}=\widehat{OBA}+\widehat{OBC}=\widehat{BAC}+\widehat{BCA}$.
Xét $\triangle ABC$
có $\widehat{BAC}+\widehat{BCA}+\widehat{ABC}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{ABC}=180^\circ$, hay $\widehat{ABC}=90^\circ$,
tức là $BC\perp AB$. (2)
Từ (1) và (2) suy ra $BC\parallel KO$ (cùng vuông góc với $AB$).

c) Xét $\triangle AHO$ vuông tại $H$ ($KO\perp AB$ (cmt))
có $\widehat{AOH}+\widehat{OAH}=90^\circ$ (hai góc nhọn phụ nhau).
Vì $H$ thuộc tia $OK$, $H$ thuộc tia $AB$ và $O$ thuộc tia $AC$
nên $\widehat{AOH}=\widehat{AOK}$ và $\widehat{OAH}=\widehat{CAB}$.
Suy ra $\widehat{AOK}+\widehat{CAB}=90^\circ$. (3)
Xét $\triangle ABC$ vuông tại $B$ (cmt)
có $\widehat{ACB}+\widehat{CAB}=90^\circ$ (hai góc nhọn phụ nhau). (4)
Từ (3) và (4) suy ra $\widehat{AOK}=\widehat{ACB}$.
Xét $\triangle ABC$ và $\triangle KAO$ có:
$\widehat{ABC}=\widehat{KAO}=90^\circ$ (cmt);
$\widehat{ACB}=\widehat{KOA}$ (cmt)
nên $\triangle ABC\backsim\triangle KAO$ (g.g).
Suy ra $\dfrac{BC}{AO}=\dfrac{AC}{KO}$ (hai tam giác đồng dạng).
Do đó $BC\cdot KO=AO\cdot AC=R\cdot2R=2R^2$.
Khi $OK=2R$ thì $BC=\dfrac{2R^2}{OK}=\dfrac{2R^2}{2R}=R$.
Xét $\triangle ABC$ vuông tại $B$ có $AC=2R$ và $BC=R$
nên $AB^2=AC^2-BC^2=4R^2-R^2=3R^2$ (định lý Pythagore),
suy ra $AB=R\sqrt{3}$.
Diện tích tam giác $ABC$ là
$S_{ABC}=\dfrac{1}{2}\cdot AB\cdot BC=\dfrac{1}{2}\cdot R\sqrt{3}\cdot R=\dfrac{R^2\sqrt{3}}{2}$.
Vậy $S_{ABC}=\dfrac{R^2\sqrt{3}}{2}$.

### Bài 27 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O,R)$ đường kính $AB$ và một điểm $M$ nằm bên ngoài đường tròn $(O)$. Đoạn thẳng $MA$, $MB$ cắt đường tròn $(O)$ lần lượt tại điểm $E$, $F$.
a) Chứng minh $BE$ vuông góc với $MA$ và $AF$ vuông góc với $MB$
b) $BE$ cắt $AF$ tại $H$. Chứng minh bốn điểm $M$, $E$, $H$, $F$ cùng thuộc một đường tròn.
c) Gọi $I$ là trung điểm của $MH$. Chứng minh $IE$ vuông góc với $OE$.
d) Chứng minh bốn điểm $I$, $E$, $O$, $F$ cùng thuộc một đường tròn.
**Hình:** de_P1B27.png
**Hình giải:** giai_P1B27.png
**Ghi chú:** hình giải thêm giao điểm $G$ của $MH$ với $AB$, các đoạn $IE$, $IF$, $OE$, $OF$ và dấu góc vuông. Đã kiểm bằng toạ độ số trên 6000 vị trí ngẫu nhiên của $M$ (chỉ lấy vị trí để $E$, $F$ nằm trên các đoạn $MA$, $MB$, tức tam giác $MAB$ có hai góc ở $A$, $B$ nhọn); đủ mọi khẳng định và thứ tự điểm.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $OE=OF=OA=OB$ nên các tam giác cân cho hai góc vuông tại $E$, $F$; $H$ là trực tâm của tam giác $MAB$, và trung điểm $I$ của $MH$ cách đều $M$, $E$, $H$, $F$.

**Bước 1.** Ý a: dùng bán kính bằng nhau để có hai tam giác cân rồi tổng ba góc, từ đó có $\widehat{AEB}=90^\circ$ và làm tương tự cho $F$.

**Bước 2.** Ý b: dùng hai góc vuông $\widehat{MEH}$, $\widehat{MFH}$ cùng nhìn cạnh $MH$ để chọn trung điểm $I$ của $MH$ làm tâm đường tròn.

**Bước 3.** Ý c: dùng $IE=IH$ để đổi $\widehat{IEH}$ thành góc đối đỉnh của một góc trong tam giác vuông $GHB$, với $G$ là giao điểm của $MH$ và $AB$.

**Bước 4.** Ý c: đổi $\widehat{HEO}$ qua tam giác cân $OEB$, rồi cộng hai góc và dùng hai góc nhọn của tam giác vuông $GHB$ để tính góc $\widehat{IEO}$.

**Bước 5.** Ý d: chứng minh tương tự $IF\perp OF$ rồi chọn trung điểm của $IO$ làm tâm đường tròn qua bốn điểm.

**Chú ý:** phải giải thích $H$ nằm giữa $B$ và $E$, và $I$, $O$ nằm khác phía đối với đường thẳng $BE$ khi cộng góc.

**Phần 2. Trình bày**

a) Vì $AB$ là đường kính nên $O$ nằm giữa $A$ và $B$, $OA=OB=OE=R$.
Xét $\triangle OAE$ có $OA=OE$ nên cân tại $O$,
suy ra $\widehat{OEA}=\widehat{OAE}$ (tính chất tam giác cân).
Xét $\triangle OBE$ có $OB=OE$ nên cân tại $O$,
suy ra $\widehat{OEB}=\widehat{OBE}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $A$ và $B$ nên tia $EO$ nằm giữa hai tia $EA$, $EB$.
Suy ra $\widehat{AEB}=\widehat{OEA}+\widehat{OEB}=\widehat{EAB}+\widehat{EBA}$.
Xét $\triangle AEB$
có $\widehat{EAB}+\widehat{EBA}+\widehat{AEB}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{AEB}=180^\circ$, hay $\widehat{AEB}=90^\circ$.
Suy ra $BE\perp AE$, mà $E$ thuộc $MA$ nên $BE\perp MA$.
Chứng minh tương tự (dùng $OF=OA=OB$) ta có $\widehat{AFB}=90^\circ$,
suy ra $AF\perp MB$.

b) Vì $BE\perp MA$ tại $E$ (cmt) và $H$ thuộc $BE$
nên $\widehat{MEH}=90^\circ$.
Vì $AF\perp MB$ tại $F$ (cmt) và $H$ thuộc $AF$
nên $\widehat{MFH}=90^\circ$.
Gọi $I$ là trung điểm của $MH$.
Xét $\triangle MEH$ vuông tại $E$
có $EI$ là đường trung tuyến ứng với cạnh huyền $MH$
nên $IE=\dfrac{MH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle MFH$ vuông tại $F$
có $FI$ là đường trung tuyến ứng với cạnh huyền $MH$
nên $IF=\dfrac{MH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $IM=IH=\dfrac{MH}{2}$ ($I$ là trung điểm của $MH$).
Do đó $IM=IE=IH=IF=\dfrac{MH}{2}$.
Vậy bốn điểm $M$, $E$, $H$, $F$ cùng thuộc đường tròn tâm $I$,
bán kính $\dfrac{MH}{2}$.

c) Xét $\triangle IEH$ có $IE=IH$ (cmt)
nên cân tại $I$ (định nghĩa tam giác cân),
suy ra $\widehat{IEH}=\widehat{IHE}$ (tính chất tam giác cân). (1)
Vì $H$ là giao điểm của hai đường cao $BE$, $AF$ của $\triangle MAB$ (gt)
nên $H$ là trực tâm của $\triangle MAB$,
suy ra $MH\perp AB$ (ba đường cao của tam giác đồng quy).
Gọi $G$ là giao điểm của $MH$ và $AB$ thì $MG\perp AB$ tại $G$.
Vì $H$ nằm giữa $B$ và $E$ nên tia $HE$ và tia $HB$ là hai tia đối nhau.
Vì $H$ nằm giữa $M$ và $G$ nên tia $HI$ và tia $HG$ là hai tia đối nhau.
Do đó $\widehat{IHE}=\widehat{GHB}$ (hai góc đối đỉnh). (2)
Xét $\triangle GHB$ vuông tại $G$
có $\widehat{GHB}+\widehat{GBH}=90^\circ$ (hai góc nhọn phụ nhau). (3)
Xét $\triangle OEB$ có $OE=OB$ nên cân tại $O$,
suy ra $\widehat{OEB}=\widehat{OBE}$ (tính chất tam giác cân).
Mà $\widehat{OBE}=\widehat{GBH}$ (cùng là góc $\widehat{ABE}$). (4)
Vì $E$ nằm giữa $M$ và $A$ nên $M$, $A$ nằm khác phía đối với đường thẳng $BE$.
Mà $I$ cùng phía với $M$ ($H$ thuộc $BE$), $O$ cùng phía với $A$ ($B$ thuộc $BE$)
nên $I$, $O$ nằm khác phía đối với đường thẳng $BE$.
Suy ra $\widehat{IEO}=\widehat{IEH}+\widehat{HEO}$ ($EH$ trùng $EB$).
Từ (1), (2), (3), (4) ta có
$\widehat{IEO}=\widehat{IHE}+\widehat{OEB}=\widehat{GHB}+\widehat{GBH}=90^\circ$.
Vậy $IE\perp OE$.

d) Chứng minh tương tự ý c) (đổi vai $A$, $B$ và $E$, $F$) ta có $IF\perp OF$,
hay $\widehat{IFO}=90^\circ$.
Gọi $S$ là trung điểm của $IO$.
Xét $\triangle IEO$ vuông tại $E$ (cmt)
có $ES$ là đường trung tuyến ứng với cạnh huyền $IO$
nên $SE=\dfrac{IO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle IFO$ vuông tại $F$ (cmt)
có $FS$ là đường trung tuyến ứng với cạnh huyền $IO$
nên $SF=\dfrac{IO}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $SI=SO=\dfrac{IO}{2}$ ($S$ là trung điểm của $IO$).
Do đó $SI=SE=SO=SF=\dfrac{IO}{2}$.
Vậy bốn điểm $I$, $E$, $O$, $F$ cùng thuộc đường tròn tâm $S$,
bán kính $\dfrac{IO}{2}$.

### Bài 28 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ có hai đường cao $BD$, $CE$ cắt nhau tại $H$.
a) Chứng minh bốn điểm $A$, $D$, $H$, $E$ cùng nằm trên một đường tròn.
b) Gọi $O$ là tâm đường tròn đi qua bốn điểm $A$, $D$, $H$, $E$ và $M$ là trung điểm của $BC$. Chứng minh $ME$ là tiếp tuyến của $(O)$.
**Hình:** de_P1B28.png
**Hình giải:** giai_P1B28.png
**Ghi chú:** đề không nói tam giác $ABC$ nhọn; lời giải và hình vẽ trình bày theo hình chuẩn (tam giác nhọn, $D$, $E$ nằm trên các cạnh). Kết luận $ME\perp OE$ vẫn đúng khi tam giác tù (đã kiểm bằng toạ độ số trên hàng nghìn tam giác tù, nhưng thứ tự các điểm khác nên cách cộng góc phải đổi). Hình đề chỉ đánh dấu điểm $O$ (trung điểm của $AH$), chưa vẽ đường tròn vì đó là kết quả của ý a; hình giải thêm đường tròn $(O)$, chân đường cao $F$ của đỉnh $A$. Đã kiểm bằng toạ độ số trên hơn 1800 tam giác nhọn ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai đường cao tạo hai góc vuông cùng nhìn cạnh $AH$ nên tâm $O$ là trung điểm của $AH$; $ME$ là trung tuyến ứng với cạnh huyền của tam giác vuông $BEC$, và $AH\perp BC$ vì $H$ là trực tâm.

**Bước 1.** Ý a: dùng hai tam giác vuông $ADH$, $AEH$ chung cạnh huyền $AH$ để chọn trung điểm của $AH$ làm tâm đường tròn.

**Bước 2.** Ý b: nhận ra $O$ là trung điểm của $AH$, dùng tam giác cân $OEA$ để đổi $\widehat{OEA}$ thành $\widehat{HAB}$, và tam giác cân $MEB$ để đổi $\widehat{MEB}$ thành $\widehat{CBA}$.

**Bước 3.** Ý b: dùng $H$ là trực tâm để có $AH\perp BC$ rồi hai góc nhọn phụ nhau của tam giác vuông tạo bởi chân đường cao hạ từ $A$ và đỉnh $B$.

**Bước 4.** Ý b: cộng các góc tại $E$ trên đường thẳng $AB$ để tính góc $\widehat{OEM}$, rồi dùng dấu hiệu nhận biết tiếp tuyến.

**Chú ý:** phải giải thích $O$, $M$ nằm cùng phía đối với $AB$ và tia $EO$ nằm giữa hai tia $EA$, $EM$ trước khi trừ góc.

**Phần 2. Trình bày**

a) Vì $BD\perp AC$ (gt) và $H$ thuộc $BD$
nên $HD\perp AD$, suy ra $\widehat{ADH}=90^\circ$.
Vì $CE\perp AB$ (gt) và $H$ thuộc $CE$
nên $HE\perp AE$, suy ra $\widehat{AEH}=90^\circ$.
Gọi $O$ là trung điểm của $AH$.
Xét $\triangle ADH$ vuông tại $D$
có $DO$ là đường trung tuyến ứng với cạnh huyền $AH$
nên $OD=\dfrac{AH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Xét $\triangle AEH$ vuông tại $E$
có $EO$ là đường trung tuyến ứng với cạnh huyền $AH$
nên $OE=\dfrac{AH}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Mà $OA=OH=\dfrac{AH}{2}$ ($O$ là trung điểm của $AH$).
Do đó $OA=OD=OH=OE=\dfrac{AH}{2}$.
Vậy bốn điểm $A$, $D$, $H$, $E$ cùng thuộc đường tròn tâm $O$ là trung điểm của $AH$,
bán kính $\dfrac{AH}{2}$.

b) Tâm của đường tròn đi qua $A$, $D$, $H$, $E$ là trung điểm $O$ của $AH$ (cmt).
Suy ra $OA=OE$.
Xét $\triangle OEA$ có $OE=OA$ nên cân tại $O$,
suy ra $\widehat{OEA}=\widehat{OAE}$ (tính chất tam giác cân).
Vì $O$ thuộc tia $AH$ và $E$ thuộc tia $AB$
nên $\widehat{OAE}=\widehat{HAB}$.
Do đó $\widehat{OEA}=\widehat{HAB}$. (1)
Xét $\triangle BEC$ vuông tại $E$ ($CE\perp AB$ (gt))
có $EM$ là đường trung tuyến ứng với cạnh huyền $BC$
($M$ là trung điểm của $BC$ (gt))
nên $ME=MB=\dfrac{BC}{2}$ (tính chất trung tuyến ứng với cạnh huyền).
Suy ra $\triangle MEB$ cân tại $M$,
do đó $\widehat{MEB}=\widehat{MBE}$ (tính chất tam giác cân).
Mà $\widehat{MBE}=\widehat{CBA}$ ($M$ thuộc tia $BC$, $E$ thuộc tia $BA$).
Suy ra $\widehat{MEB}=\widehat{CBA}$. (2)
Vì $H$ là giao điểm của hai đường cao $BD$, $CE$ (gt)
nên $H$ là trực tâm của $\triangle ABC$,
suy ra $AH\perp BC$ (ba đường cao của tam giác đồng quy).
Gọi $F$ là giao điểm của $AH$ và $BC$ thì $AF\perp BC$ tại $F$.
Xét $\triangle ABF$ vuông tại $F$
có $\widehat{FAB}+\widehat{FBA}=90^\circ$ (hai góc nhọn phụ nhau).
Mà $\widehat{FAB}=\widehat{HAB}$ và $\widehat{FBA}=\widehat{CBA}$
nên $\widehat{HAB}+\widehat{CBA}=90^\circ$. (3)
Từ (1) và (3) suy ra $\widehat{OEA}=90^\circ-\widehat{CBA}$.
Vì $E$ nằm giữa $A$ và $B$ nên $\widehat{AEM}+\widehat{MEB}=180^\circ$ (hai góc kề bù).
Từ (2) suy ra $\widehat{AEM}=180^\circ-\widehat{CBA}$.
Vì $O$, $M$ cùng phía đối với đường thẳng $AB$ ($O$, $M$ cùng phía với $C$)
và $\widehat{AEO}=90^\circ-\widehat{CBA}<180^\circ-\widehat{CBA}=\widehat{AEM}$
nên tia $EO$ nằm giữa hai tia $EA$, $EM$.
Suy ra $\widehat{OEM}=\widehat{AEM}-\widehat{AEO}$
$=(180^\circ-\widehat{CBA})-(90^\circ-\widehat{CBA})=90^\circ$.
Do đó $ME\perp OE$ tại $E$ thuộc $(O)$.
Vậy $ME$ là tiếp tuyến của $(O)$ (dấu hiệu nhận biết tiếp tuyến).

### Bài 29 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho đường tròn $(O,R)$ và điểm $A$ nằm ngoài $(O;R)$. Vẽ tiếp tuyến $AB$ của đường tròn $(O)$ ($B$ là tiếp điểm). Lấy điểm $C$ thuộc đường tròn $(O)$ sao cho $AB=AC$.
a) Chứng minh $AC$ là tiếp tuyến của đường tròn $(O)$.
b) $D$ là điểm trên đoạn thẳng $AC$. Đường thẳng qua $C$ vuông góc với $OD$ tại $M$ cắt đường tròn $(O)$ tại $E$ ($E$ khác $C$). Chứng minh $DE$ là tiếp tuyến của đường tròn $(O)$.
c) Vẽ đường kính $BK$. Chứng minh $CK\parallel AO$
**Hình:** de_P1B29.png
**Hình giải:** giai_P1B29.png
**Ghi chú:** $C$ khác $B$ (nếu $C$ trùng $B$ thì không có điều cần chứng minh); $D$ khác $C$ (nếu $D$ trùng $C$ thì đường thẳng qua $C$ vuông góc với $OD$ là chính tiếp tuyến $AC$, không cắt $(O)$ tại điểm $E$ khác $C$). Hình giải thêm các bán kính $OB$, $OC$, $OE$, các dấu góc vuông và đoạn bằng nhau. Đã kiểm bằng toạ độ số trên 3000 cấu hình ngẫu nhiên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $AB=AC$ cùng $OB=OC$ cho các cặp tam giác bằng nhau theo trường hợp cạnh – cạnh – cạnh, từ đó suy ra góc vuông tại tiếp điểm và $AO$ là đường trung trực của $BC$.

**Bước 1.** Ý a: chứng minh $\triangle OAB=\triangle OAC$ theo trường hợp cạnh – cạnh – cạnh để suy ra $\widehat{OCA}=\widehat{OBA}$, rồi dùng tính chất tiếp tuyến tại $B$.

**Bước 2.** Ý b: nhận ra $M$ là trung điểm của $CE$ vì tam giác $OCE$ cân có $OM$ là đường cao, nên $D$ cách đều hai điểm $C$, $E$.

**Bước 3.** Ý b: so sánh hai tam giác $ODC$, $ODE$ theo trường hợp cạnh – cạnh – cạnh để có $\widehat{OED}=\widehat{OCD}=90^\circ$.

**Bước 4.** Ý c: dùng $AB=AC$, $OB=OC$ để có $AO\perp BC$, rồi chứng minh $BC\perp CK$ bằng hai tam giác cân và tổng ba góc.

**Chú ý:** ở ý b, hai điểm $C$ và $E$ đối xứng nhau qua đường thẳng $OD$ nên cần dùng cả tính chất tam giác cân và tính chất đường trung trực.

**Phần 2. Trình bày**

a) Xét $\triangle OAB$ và $\triangle OAC$ có:
$OB=OC$ (bán kính);
$AB=AC$ (gt);
$OA$ chung
nên $\triangle OAB=\triangle OAC$ (c.c.c).
Suy ra $\widehat{OCA}=\widehat{OBA}$ (hai góc tương ứng).
Vì $AB$ là tiếp tuyến của $(O)$ tại $B$ (gt)
nên $AB\perp OB$ (tính chất tiếp tuyến),
suy ra $\widehat{OBA}=90^\circ$.
Do đó $\widehat{OCA}=90^\circ$, tức là $AC\perp OC$ tại $C$ thuộc $(O)$.
Vậy $AC$ là tiếp tuyến của $(O)$ (dấu hiệu nhận biết tiếp tuyến).

b) Vì $CE\perp OD$ tại $M$ (gt)
nên $OM\perp CE$ tại $M$.
Xét $\triangle OCE$ có $OC=OE=R$
nên cân tại $O$ (định nghĩa tam giác cân).
Mà $OM$ là đường cao (cmt)
nên $OM$ cũng là đường trung tuyến (tính chất tam giác cân),
suy ra $M$ là trung điểm của $CE$.
Vì $M$ thuộc $OD$ nên $D$ thuộc đường thẳng $OM$,
mà $OM\perp CE$ tại trung điểm $M$ của $CE$
nên $DM$ là đường trung trực của $CE$ (định nghĩa đường trung trực).
Suy ra $DC=DE$ (tính chất đường trung trực).
Xét $\triangle ODC$ và $\triangle ODE$ có:
$OC=OE$ (bán kính);
$DC=DE$ (cmt);
$OD$ chung
nên $\triangle ODC=\triangle ODE$ (c.c.c).
Suy ra $\widehat{OED}=\widehat{OCD}$ (hai góc tương ứng).
Vì $D$ thuộc đoạn $AC$ và $AC\perp OC$ (cmt)
nên $\widehat{OCD}=90^\circ$.
Do đó $\widehat{OED}=90^\circ$, tức là $DE\perp OE$ tại $E$ thuộc $(O)$.
Vậy $DE$ là tiếp tuyến của $(O)$ (dấu hiệu nhận biết tiếp tuyến).

c) Vì $AB=AC$ (gt) và $OB=OC$ (bán kính)
nên $AO$ là đường trung trực của $BC$ (tính chất đường trung trực).
Suy ra $AO\perp BC$. (1)
Vì $BK$ là đường kính nên $O$ nằm giữa $B$ và $K$, $OB=OK=OC$ (bán kính).
Xét $\triangle OBC$ có $OB=OC$ nên cân tại $O$,
suy ra $\widehat{OCB}=\widehat{OBC}$ (tính chất tam giác cân).
Xét $\triangle OCK$ có $OC=OK$ nên cân tại $O$,
suy ra $\widehat{OCK}=\widehat{OKC}$ (tính chất tam giác cân).
Vì $O$ nằm giữa $B$ và $K$ nên tia $CO$ nằm giữa hai tia $CB$, $CK$.
Suy ra $\widehat{BCK}=\widehat{OCB}+\widehat{OCK}=\widehat{CBK}+\widehat{CKB}$.
Xét $\triangle BCK$
có $\widehat{CBK}+\widehat{CKB}+\widehat{BCK}=180^\circ$ (tổng ba góc của tam giác).
Do đó $2\widehat{BCK}=180^\circ$, hay $\widehat{BCK}=90^\circ$,
tức là $CK\perp BC$. (2)
Từ (1) và (2) suy ra $CK\parallel AO$ (cùng vuông góc với $BC$).

## GHI CHÚ CHO NGƯỜI DUYỆT

- Đề cương có 9 bài hình (Bài 21–29), cả 9 là `tu_luan`; Bài 30–34 là bài nâng cao Đại số (không lấy). Mỗi bài có hình đề và hình giải (18 ảnh), dựng bằng toạ độ và đã mở xem.
- Bài 22: đề in lỗi ở chữ "cắt $AB$ tại $H$" — đã sửa thành "$MO$ cắt $AB$ tại $H$" (xem Ghi chú trong bài).
- Bài 28: đề không loại tam giác tù; lời giải theo hình nhọn.
- Không dùng góc nội tiếp, tứ giác nội tiếp, đường trung bình, hệ thức đường cao thẳng; ý "bốn điểm cùng thuộc một đường tròn" dùng trung tuyến ứng với cạnh huyền; góc $90^\circ$ nhìn đường kính chứng minh bằng tam giác cân và tổng ba góc.
- Bài 22c và Bài 24c cùng một ý tưởng (giao điểm của $AB$ với tiếp tuyến tại đầu đường kính, hai cặp tam giác vuông đồng dạng, góc $\widehat{OTD}=90^\circ$).
- Không có câu `Chưa chắc`. Mọi mệnh đề (đẳng thức, góc, thứ tự điểm) đã thử bằng script toạ độ số `tam/kiem.mjs`.
