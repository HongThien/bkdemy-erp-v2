### TL2.1 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ, biết $\widehat{B}=\widehat{C}=90^\circ$ và $DA$ là tia phân giác của $\widehat{BDC}$.
Chứng minh $\triangle ABD=\triangle ACD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai tam giác $ABD$, $ACD$ đều có một góc vuông (ở $B$ và ở $C$) và chung cạnh $AD$ ⇒ dùng trường hợp bằng nhau của tam giác vuông.

**Bước 1.** Nhận ra $\triangle ABD$ vuông tại $B$, $\triangle ACD$ vuông tại $C$; cạnh $AD$ là cạnh huyền của cả hai.

**Bước 2.** Từ "$DA$ là tia phân giác của góc $D$" suy ra hai góc nhọn $\widehat{ADB}$ và $\widehat{ADC}$ bằng nhau.

**Bước 3.** Có cạnh huyền chung và một góc nhọn bằng nhau ⇒ kết luận theo trường hợp cạnh huyền – góc nhọn.

**Chú ý:** viết đúng thứ tự đỉnh tương ứng: $B$ ứng với $C$, $A$ ứng với $A$, $D$ ứng với $D$.

**Phần 2. Trình bày**
Xét hai tam giác vuông $\triangle ABD$ và $\triangle ACD$ có:
$\widehat{ABD}=\widehat{ACD}=90^\circ$ (gt);
$AD$ chung (cạnh huyền);
$\widehat{ADB}=\widehat{ADC}$ ($DA$ là tia phân giác của $\widehat{BDC}$).
Do đó $\triangle ABD=\triangle ACD$ (ch - gn).
**cấu hình hình / nghi vấn:**
Hình lấy đúng bố cục ảnh gốc (t-16, "Dạng 2 – Bài 1"): $A$ trái, $D$ phải, $B$ trên, $C$ dưới, đối xứng qua $AD$. Dựng bằng toạ độ: $B$ thuộc đường tròn đường kính $AD$ (góc $B$ = 90°), $\widehat{ADB}=\widehat{ADC}=50^\circ$. Kí hiệu vẽ: hai ô vuông ở $B$, $C$; hai cung góc ở $D$ (bán kính khác nhau) — ảnh gốc vẽ cung đôi, ở đây dùng cung đơn cho cả hai góc (đủ nhận biết bằng nhau). Đề gốc ghi "DA là phân giác góc D" — viết thành "$\widehat{BDC}$" cho rõ, không đổi nghĩa.
Verify (kiem_A8.mjs): 3 bộ toạ độ, kiểm góc $B$=$C$=90°, $ADB=ADC$, $\triangle ABD=\triangle ACD$ đúng thứ tự đỉnh — PASS.
Chỉ dùng (ch - gn) — trong whitelist. Không nghi vấn.
**hinh:** HH00103_TL2-1.png

### TL2.2 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ có $AB=AC$. Kẻ $AH\perp BC$ tại $H$.
a) Chứng minh $\triangle ABH=\triangle ACH$.
b) Kẻ $HM\perp AB$ tại $M$, $HN\perp AC$ tại $N$. Chứng minh $\triangle AMH=\triangle ANH$.
c) Chứng minh $\triangle MBH=\triangle NCH$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** đề cho các đường vuông góc ($AH\perp BC$, $HM\perp AB$, $HN\perp AC$) ⇒ các tam giác cần chứng minh đều là tam giác vuông ⇒ dùng các trường hợp bằng nhau của tam giác vuông; ý sau dùng kết quả ý trước.

**Bước 1.** Ý a) Xét $\triangle ABH$, $\triangle ACH$ vuông tại $H$: có cạnh huyền $AB=AC$ và cạnh góc vuông $AH$ chung ⇒ (ch - cgv).

**Bước 2.** Ý b) Từ a) lấy ra hai góc tương ứng $\widehat{BAH}=\widehat{CAH}$. Hai tam giác $AMH$, $ANH$ vuông tại $M$, $N$, có chung cạnh huyền $AH$ ⇒ (ch - gn).

**Bước 3.** Ý c) Từ a) lấy ra $BH=CH$, từ b) lấy ra $MH=NH$. Hai tam giác $MBH$, $NCH$ vuông tại $M$, $N$ có cạnh huyền và một cạnh góc vuông bằng nhau ⇒ (ch - cgv).

**Chú ý:** trước khi dùng (ch - cgv) hay (ch - gn) phải chỉ rõ cạnh nào là cạnh huyền; không dùng lại $AB=AC$ cho ý c) vì $AB$, $AC$ không thuộc hai tam giác ở ý c).

**Phần 2. Trình bày**
a) Xét hai tam giác vuông $\triangle ABH$ và $\triangle ACH$ có:
$\widehat{AHB}=\widehat{AHC}=90^\circ$ ($AH\perp BC$);
$AB=AC$ (gt, cạnh huyền);
$AH$ chung (cạnh góc vuông).
Do đó $\triangle ABH=\triangle ACH$ (ch - cgv).

b) Vì $\triangle ABH=\triangle ACH$ (cmt)
nên $\widehat{BAH}=\widehat{CAH}$ (hai góc tương ứng).
Vì $M$ nằm trên cạnh $AB$, $N$ nằm trên cạnh $AC$
nên $\widehat{MAH}=\widehat{BAH}$ và $\widehat{NAH}=\widehat{CAH}$.
Suy ra $\widehat{MAH}=\widehat{NAH}$.
Xét hai tam giác vuông $\triangle AMH$ và $\triangle ANH$ có:
$\widehat{AMH}=\widehat{ANH}=90^\circ$ (gt);
$AH$ chung (cạnh huyền);
$\widehat{MAH}=\widehat{NAH}$ (cmt).
Do đó $\triangle AMH=\triangle ANH$ (ch - gn).

c) Vì $\triangle ABH=\triangle ACH$ (cmt)
nên $BH=CH$ (hai cạnh tương ứng).
Vì $\triangle AMH=\triangle ANH$ (cmt)
nên $MH=NH$ (hai cạnh tương ứng).
Xét hai tam giác vuông $\triangle MBH$ và $\triangle NCH$ có:
$\widehat{BMH}=\widehat{CNH}=90^\circ$ (gt);
$BH=CH$ (cmt, cạnh huyền);
$MH=NH$ (cmt, cạnh góc vuông).
Do đó $\triangle MBH=\triangle NCH$ (ch - cgv).
**cấu hình hình / nghi vấn:**
Ảnh gốc t-17 không có hình cho bài này — tự vẽ theo đề: $A$ trên, $B$, $C$ đáy, $H$ trên $BC$; $AB=AC$ (1 gạch); ô vuông ở $H$, $M$, $N$ (đều là điều cho trong đề). Không đánh dấu $\triangle AMH=\triangle ANH$ hay $BH=CH$. Hình cân vì đề buộc $AB=AC$.
Verify (kiem_A8.mjs): 3 bộ toạ độ, kiểm $AB=AC$, $AH\perp BC$, $H$ nằm giữa $B$, $C$ và $BH=CH$, $M\in$ đoạn $AB$, $N\in$ đoạn $AC$, $HM\perp AB$, $HN\perp AC$, ba cặp tam giác bằng nhau đúng thứ tự đỉnh ($ABH=ACH$, $AMH=ANH$, $MBH=NCH$), $\widehat{BAH}=\widehat{CAH}$ — PASS.
Chỗ cần Thùy lưu ý: câu "$M$ nằm trên cạnh $AB$" (lời giải ý b) dựa vào việc $\triangle ABH$ vuông tại $H$ nên chân đường vuông góc hạ từ $H$ xuống cạnh huyền $AB$ nằm trong đoạn $AB$ — đã kiểm bằng toạ độ, hình vẽ đúng; học sinh lớp 7 chấp nhận theo hình. Chỉ dùng (ch - cgv), (ch - gn) — trong whitelist. Không dùng tính chất tam giác cân.
**hinh:** HH00103_TL2-2.png

### TL2.4 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ nhọn có $M$ là trung điểm của $BC$. Kẻ $BD$, $CE$ vuông góc với $AM$ ($D$, $E$ thuộc đường thẳng $AM$).
a) Chứng minh $\triangle BMD=\triangle CME$.
b) Chứng minh $BD\parallel CE$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $BD\perp AM$, $CE\perp AM$ ⇒ $\triangle BMD$, $\triangle CME$ là tam giác vuông; $M$ là trung điểm $BC$ cho hai cạnh huyền bằng nhau; hai góc đối đỉnh tại $M$ cho góc nhọn bằng nhau.

**Bước 1.** Ý a) Xác định hai tam giác vuông $BMD$ (vuông tại $D$) và $CME$ (vuông tại $E$); cạnh huyền là $BM$ và $CM$.

**Bước 2.** Dùng $M$ là trung điểm của $BC$ để có $BM=CM$; dùng $D$, $M$, $E$ thẳng hàng để có hai góc đối đỉnh $\widehat{BMD}=\widehat{CME}$ ⇒ (ch - gn).

**Bước 3.** Ý b) Từ a) suy ra hai góc tương ứng $\widehat{DBM}=\widehat{ECM}$. Hai góc này ở vị trí so le trong khi đường thẳng $BC$ cắt $BD$ và $CE$ ⇒ $BD\parallel CE$.

**Chú ý:** $D$ và $E$ nằm ở hai phía của đường thẳng $BC$ (vì $M$ nằm giữa $D$ và $E$), nên hai góc $\widehat{DBC}$, $\widehat{ECB}$ mới là cặp so le trong.

**Phần 2. Trình bày**
a) Xét hai tam giác vuông $\triangle BMD$ và $\triangle CME$ có:
$\widehat{BDM}=\widehat{CEM}=90^\circ$ (gt);
$BM=CM$ ($M$ là trung điểm của $BC$, cạnh huyền);
$\widehat{BMD}=\widehat{CME}$ (hai góc đối đỉnh).
Do đó $\triangle BMD=\triangle CME$ (ch - gn).

b) Vì $\triangle BMD=\triangle CME$ (cmt)
nên $\widehat{DBM}=\widehat{ECM}$ (hai góc tương ứng).
Hay $\widehat{DBC}=\widehat{ECB}$.
Mà hai góc này ở vị trí so le trong
nên $BD\parallel CE$.
**cấu hình hình / nghi vấn:**
Ảnh gốc t-17 không có hình — tự vẽ theo đề: $A$ trên, $B$, $C$ đáy, $M$ trung điểm (hai gạch 1 bằng nhau trên $BM$, $MC$), $D$ nằm giữa $A$ và $M$, $E$ nằm trên tia đối của tia $MA$ (dưới $BC$); ô vuông ở $D$ và $E$. Tam giác $ABC$ nhọn (kiểm máy).
Đề gốc ghi "Kẻ $BD$, $CE$ vuông góc với $AM$" — thêm "($D$, $E$ thuộc đường thẳng $AM$)" cho rõ, không đổi nghĩa.
Verify (kiem_A8.mjs): 3 bộ toạ độ (đều nhọn), kiểm $BM=CM$, $BD\perp AM$, $CE\perp AM$, $M$ nằm giữa $D$ và $E$, $\widehat{BMD}=\widehat{CME}$, $\triangle BMD=\triangle CME$, $\widehat{DBM}=\widehat{ECM}$, $D$ và $E$ khác phía $BC$, $\widehat{DBC}=\widehat{ECB}$, $BD\parallel CE$ — PASS.
Chỗ cần Thùy lưu ý: khi $\widehat{AMB}$ tù thì $D$ nằm trên tia đối của $MA$ và $E$ trên tia $MA$ — vẫn đối đỉnh, lời giải không đổi (lập luận suy ra từ $D$, $E$ luôn đối xứng qua $M$; verify máy chỉ chạy 3 bộ nhọn có $D$ nằm giữa $A$, $M$, CHƯA chạy bộ $\widehat{AMB}$ tù). Chỉ dùng (ch - gn), so le trong — trong whitelist.
**hinh:** HH00103_TL2-4.png

### VN.1 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho góc $xOy$ nhọn. Lấy hai điểm $A$, $B$ lần lượt thuộc $Ox$, $Oy$ sao cho $OA=OB$.
Từ $A$ kẻ đường thẳng vuông góc với $Oy$ tại $E$.
Từ $B$ kẻ đường thẳng vuông góc với $Ox$ tại $F$.
Chứng minh:
a) $\triangle OAE=\triangle OBF$.
b) $\triangle BAE=\triangle ABF$.
Gọi $I$ là giao điểm của $AE$ và $BF$.
c) $\triangle AIF=\triangle BIE$.
d) $OI$ là tia phân giác của góc $xOy$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** các đường $AE\perp Oy$, $BF\perp Ox$ tạo ra nhiều tam giác vuông ⇒ dùng các trường hợp bằng nhau của tam giác vuông, mỗi ý lấy kết quả của ý trước làm điều kiện cho ý sau.

**Bước 1.** Ý a) $\triangle OAE$ và $\triangle OBF$ vuông tại $E$, $F$: có cạnh huyền $OA=OB$ và góc nhọn chung $\widehat{O}$ ⇒ (ch - gn). Suy ra $AE=BF$.

**Bước 2.** Ý b) $\triangle BAE$ và $\triangle ABF$ vuông tại $E$, $F$: chung cạnh huyền $AB$, có cạnh góc vuông $AE=BF$ (từ a)) ⇒ (ch - cgv). Suy ra $BE=AF$ (hai cạnh tương ứng).

**Bước 3.** Ý c) $\triangle AIF$ và $\triangle BIE$ vuông tại $F$, $E$: có $AF=BE$ (từ b)) và $\widehat{FAI}=\widehat{EBI}$ (lấy từ a)) ⇒ (cgv - gn). Suy ra $IE=IF$.

**Bước 4.** Ý d) $\triangle OEI$ và $\triangle OFI$ vuông tại $E$, $F$: chung cạnh huyền $OI$, có $IE=IF$ (từ c)) ⇒ (ch - cgv) ⇒ hai góc $\widehat{EOI}$, $\widehat{FOI}$ bằng nhau; thêm $I$ nằm trong góc $xOy$ để kết luận tia phân giác.

**Chú ý:** ở ý c) góc nhọn dùng là $\widehat{FAI}$ (kề cạnh góc vuông $AF$), không dùng góc đối đỉnh $\widehat{AIF}$, vì (cgv - gn) cần góc nhọn KỀ cạnh góc vuông đã chọn.

**Phần 2. Trình bày**
a) Xét hai tam giác vuông $\triangle OAE$ và $\triangle OBF$ có:
$\widehat{OEA}=\widehat{OFB}=90^\circ$ (gt);
$OA=OB$ (gt, cạnh huyền);
$\widehat{AOE}=\widehat{BOF}$ (cùng là góc $xOy$).
Do đó $\triangle OAE=\triangle OBF$ (ch - gn).

b) Vì $\triangle OAE=\triangle OBF$ (cmt)
nên $AE=BF$ (hai cạnh tương ứng).
Xét hai tam giác vuông $\triangle BAE$ và $\triangle ABF$ có:
$\widehat{BEA}=\widehat{AFB}=90^\circ$ (gt);
$AB$ chung (cạnh huyền);
$AE=BF$ (cmt, cạnh góc vuông).
Do đó $\triangle BAE=\triangle ABF$ (ch - cgv).

c) Vì $\triangle BAE=\triangle ABF$ (cmt)
nên $BE=AF$ (hai cạnh tương ứng).
Vì $\triangle OAE=\triangle OBF$ (cmt)
nên $\widehat{OAE}=\widehat{OBF}$ (hai góc tương ứng).
Hay $\widehat{FAI}=\widehat{EBI}$.
Xét hai tam giác vuông $\triangle AIF$ và $\triangle BIE$ có:
$\widehat{AFI}=\widehat{BEI}=90^\circ$ (gt);
$AF=BE$ (cmt, cạnh góc vuông);
$\widehat{FAI}=\widehat{EBI}$ (cmt).
Do đó $\triangle AIF=\triangle BIE$ (cgv - gn).

d) Vì $\triangle AIF=\triangle BIE$ (cmt)
nên $IF=IE$ (hai cạnh tương ứng).
Xét hai tam giác vuông $\triangle OEI$ và $\triangle OFI$ có:
$\widehat{OEI}=\widehat{OFI}=90^\circ$ (gt);
$OI$ chung (cạnh huyền);
$IE=IF$ (cmt, cạnh góc vuông).
Do đó $\triangle OEI=\triangle OFI$ (ch - cgv).
Suy ra $\widehat{EOI}=\widehat{FOI}$ (hai góc tương ứng).
Mà tia $OI$ nằm trong góc $xOy$ ($I$ là giao của hai đoạn $AE$, $BF$ nằm trong góc $xOy$)
nên $OI$ là tia phân giác của góc $xOy$.
**cấu hình hình / nghi vấn:**
Ảnh gốc t-17 không có hình — tự vẽ theo đề: góc $xOy$ = 55° (nhọn), $OA=OB$ (1 gạch mỗi cạnh), ô vuông ở $E$ (trên $Oy$) và $F$ (trên $Ox$), nối $AB$, $AE$, $BF$ cắt nhau tại $I$. Không đánh dấu $AF=BE$, $IE=IF$ hay hai góc ở $O$.
CHỈ SỬA ĐỀ: đề gốc dùng $I$ ở ý c) mà chưa định nghĩa ⇒ thêm dòng "Gọi $I$ là giao điểm của $AE$ và $BF$." đứng ngay trước ý c) (theo brief), và ghi ý d) là "góc $xOy$" thay vì "góc $O$" cho rõ — không đổi nghĩa.
Verify (kiem_A8.mjs): 3 bộ toạ độ (góc 55°, 40°, 70°), kiểm: $OA=OB$, hai ô vuông, $\triangle OAE=\triangle OBF$, $\triangle BAE=\triangle ABF$, $E\in OB$, $F\in OA$, $I$ nằm giữa $A,E$ và giữa $B,F$, $BE=AF$, $\widehat{FAI}=\widehat{OAE}$, $\widehat{EBI}=\widehat{OBF}$, $\triangle AIF=\triangle BIE$, $IE=IF$, $\triangle OEI=\triangle OFI$, $OI$ là phân giác — PASS.
Chỉ dùng (ch - gn), (ch - cgv), (cgv - gn) — trong whitelist; không dùng tính chất tam giác cân. Các chỗ HS có thể thắc mắc: "$I$ nằm trong góc $xOy$" (dựa vào hình — đã kiểm: $I$ nằm giữa $A$ và $E$); "$\widehat{OAE}=\widehat{FAI}$" vì $F$ thuộc tia $AO$ và $I$ thuộc tia $AE$.
**hinh:** HH00103_VN-1.png

### VN.2 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), $BD$ là tia phân giác của góc $B$ ($D$ thuộc $AC$). Kẻ $DE$ vuông góc với $BC$ ($E$ thuộc $BC$).
a) Chứng minh $\triangle ABD=\triangle EBD$.
b) Gọi $I$ là giao điểm của $AE$ và $BD$. Chứng minh $\triangle BAI=\triangle BEI$.
c) Chứng minh $BI\perp AE$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $BD$ là phân giác góc $B$ và $DE\perp BC$ ⇒ có hai tam giác vuông $ABD$, $EBD$ chung cạnh huyền $BD$ và có một cặp góc nhọn bằng nhau ⇒ (ch - gn).

**Bước 1.** Ý a) $\triangle ABD$ vuông tại $A$, $\triangle EBD$ vuông tại $E$; cạnh huyền chung $BD$; $\widehat{ABD}=\widehat{EBD}$ do $BD$ là phân giác ⇒ (ch - gn). Suy ra $BA=BE$.

**Bước 2.** Ý b) $\triangle BAI$ và $\triangle BEI$ có $BA=BE$ (từ a)), $\widehat{ABI}=\widehat{EBI}$ (gt), cạnh $BI$ chung ⇒ (c.g.c).

**Bước 3.** Ý c) Từ b) lấy hai góc tương ứng $\widehat{BIA}=\widehat{BIE}$. Hai góc này kề bù (vì $I$ nằm giữa $A$ và $E$) nên mỗi góc bằng $90^\circ$ ⇒ $BI\perp AE$.

**Chú ý:** ở ý b) hai tam giác không dùng góc vuông, nên dùng c.g.c (không phải các trường hợp của tam giác vuông).

**Phần 2. Trình bày**
a) Xét hai tam giác vuông $\triangle ABD$ và $\triangle EBD$ có:
$\widehat{BAD}=\widehat{BED}=90^\circ$ (gt);
$BD$ chung (cạnh huyền);
$\widehat{ABD}=\widehat{EBD}$ ($BD$ là tia phân giác của $\widehat{ABC}$).
Do đó $\triangle ABD=\triangle EBD$ (ch - gn).

b) Vì $\triangle ABD=\triangle EBD$ (cmt)
nên $BA=BE$ (hai cạnh tương ứng).
Vì $I$ thuộc $BD$ nên $\widehat{ABI}=\widehat{ABD}$ và $\widehat{EBI}=\widehat{EBD}$.
Suy ra $\widehat{ABI}=\widehat{EBI}$.
Xét $\triangle BAI$ và $\triangle BEI$ có:
$BA=BE$ (cmt);
$\widehat{ABI}=\widehat{EBI}$ (cmt);
$BI$ chung.
Do đó $\triangle BAI=\triangle BEI$ (c.g.c).

c) Vì $\triangle BAI=\triangle BEI$ (cmt)
nên $\widehat{BIA}=\widehat{BIE}$ (hai góc tương ứng).
Mà $I$ nằm giữa $A$ và $E$
nên $\widehat{BIA}+\widehat{BIE}=180^\circ$ (hai góc kề bù).
Suy ra $\widehat{BIA}=\widehat{BIE}=90^\circ$.
Vậy $BI\perp AE$.
**cấu hình hình / nghi vấn:**
Ảnh gốc t-17 không có hình — tự vẽ theo đề: $A$ dưới trái, $AB$ đứng, $AC$ ngang, $AB=160<AC=280$; $D$ là giao của phân giác góc $B$ với $AC$ (dựng bằng toạ độ); $E$ là chân đường vuông góc hạ từ $D$ xuống $BC$; $I=AE\cap BD$. Kí hiệu: ô vuông ở $A$ và $E$ (đều là điều cho), hai cung góc ở $B$ (phân giác, bán kính khác nhau). Không đánh dấu $BI\perp AE$.
Đề: thêm "($E$ thuộc $BC$)" cho rõ — không đổi nghĩa.
Verify (kiem_A8.mjs): 3 bộ toạ độ ($AB<AC$ và cả $AB\approx AC$), kiểm $D\in AC$, $E\in BC$, $\widehat{ABD}=\widehat{EBD}$, $\triangle ABD=\triangle EBD$, $BA=BE$, $\triangle BAI=\triangle BEI$, $I$ nằm giữa $A$, $E$, $\widehat{BIA}+\widehat{BIE}=180^\circ$, $BI\perp AE$ — PASS.
Chỗ cần Thùy lưu ý: câu "$I$ nằm giữa $A$ và $E$" dùng ở ý c) (hai góc kề bù) dựa vào hình ($A$, $E$ ở hai phía của $BD$ do đối xứng) — chưa chứng minh chặt trong lời giải, theo đúng mức hình học lớp 7. Bài tương tự đã có trong kho: HH00103055 (không trùng đề, khác ý c)). Chỉ dùng (ch - gn), (c.g.c) — trong whitelist.
**hinh:** HH00103_VN-2.png

### VN.3 → HH00103
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ có $AB=AC$. Lấy điểm $E$ thuộc tia phân giác của góc $BAC$ sao cho $E$ nằm ngoài $\triangle ABC$.
Kẻ $EN\perp AB$ tại $N$, $EP\perp AC$ tại $P$.
Chứng minh:
a) $\triangle AEN=\triangle AEP$.
b) $\triangle ABE=\triangle ACE$.
c) $\triangle BNE=\triangle CPE$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $E$ nằm trên phân giác góc $A$ nên hai góc $\widehat{BAE}$, $\widehat{CAE}$ bằng nhau; $EN\perp AB$, $EP\perp AC$ cho các tam giác vuông ở ý a) và ý c); ý b) là tam giác thường (c.g.c).

**Bước 1.** Ý a) $\triangle AEN$ và $\triangle AEP$ vuông tại $N$, $P$: chung cạnh huyền $AE$, có $\widehat{NAE}=\widehat{PAE}$ (phân giác) ⇒ (ch - gn). Suy ra $EN=EP$.

**Bước 2.** Ý b) $\triangle ABE$ và $\triangle ACE$: có $AB=AC$ (gt), $\widehat{BAE}=\widehat{CAE}$ (gt), $AE$ chung ⇒ (c.g.c). Suy ra $BE=CE$.

**Bước 3.** Ý c) $\triangle BNE$ và $\triangle CPE$ vuông tại $N$, $P$: cạnh huyền $BE=CE$ (từ b)), cạnh góc vuông $NE=PE$ (từ a)) ⇒ (ch - cgv).

**Chú ý:** hai tam giác ở ý c) có cạnh huyền là $BE$, $CE$ — chính là hai cạnh tương ứng thu được ở ý b); cạnh góc vuông $NE$, $PE$ thu được ở ý a). Phải làm đúng thứ tự a) → b) → c).

**Phần 2. Trình bày**
a) Vì $N$ thuộc tia $AB$ và $P$ thuộc tia $AC$
nên $\widehat{NAE}=\widehat{BAE}$ và $\widehat{PAE}=\widehat{CAE}$.
Mà $\widehat{BAE}=\widehat{CAE}$ ($AE$ là tia phân giác của $\widehat{BAC}$)
nên $\widehat{NAE}=\widehat{PAE}$.
Xét hai tam giác vuông $\triangle AEN$ và $\triangle AEP$ có:
$\widehat{ANE}=\widehat{APE}=90^\circ$ (gt);
$AE$ chung (cạnh huyền);
$\widehat{NAE}=\widehat{PAE}$ (cmt).
Do đó $\triangle AEN=\triangle AEP$ (ch - gn).

b) Xét $\triangle ABE$ và $\triangle ACE$ có:
$AB=AC$ (gt);
$\widehat{BAE}=\widehat{CAE}$ ($AE$ là tia phân giác của $\widehat{BAC}$);
$AE$ chung.
Do đó $\triangle ABE=\triangle ACE$ (c.g.c).

c) Vì $\triangle AEN=\triangle AEP$ (cmt)
nên $NE=PE$ (hai cạnh tương ứng).
Vì $\triangle ABE=\triangle ACE$ (cmt)
nên $BE=CE$ (hai cạnh tương ứng).
Xét hai tam giác vuông $\triangle BNE$ và $\triangle CPE$ có:
$\widehat{BNE}=\widehat{CPE}=90^\circ$ (gt);
$BE=CE$ (cmt, cạnh huyền);
$NE=PE$ (cmt, cạnh góc vuông).
Do đó $\triangle BNE=\triangle CPE$ (ch - cgv).
**cấu hình hình / nghi vấn:**
Ảnh gốc t-17 không có hình — tự vẽ theo đề: $A$ trên đỉnh, $AB=AC$ (1 gạch), tia phân giác $AE$ (hai cung góc ở $A$, bán kính khác nhau — là điều cho trong đề), $E$ nằm dưới $BC$ (ngoài tam giác), $N\in AB$, $P\in AC$ (ô vuông ở $N$, $P$); nối $BE$, $CE$. Hình cân vì đề buộc $AB=AC$. Không đánh dấu $EN=EP$, $BE=CE$.
Verify (kiem_A8.mjs): 3 bộ toạ độ ($\theta$=35°/30°/25°), kiểm $AB=AC$, $AE$ phân giác, $E$ ngoài tam giác, $EN\perp AB$, $EP\perp AC$, $N\in$ tia $AB$, $P\in$ tia $AC$, $\triangle AEN=\triangle AEP$, $\triangle ABE=\triangle ACE$, $BE=CE$, $NE=PE$, $\triangle BNE=\triangle CPE$, $N\ne B$ — PASS.
Ghi chú: đề này là bản rút gọn của HHC001952 (đã có trong kho, thêm ý d)); VN.3 ở đây KHÔNG có ý d). Điểm $N$ trong hình nằm giữa $A$ và $B$; nếu $E$ ở xa hơn thì $N$ nằm ngoài đoạn $AB$ — lời giải vẫn đúng (chỉ cần $N$ thuộc tia $AB$, $\widehat{BNE}=90^\circ$). Chỉ dùng (ch - gn), (c.g.c), (ch - cgv) — trong whitelist; không dùng tính chất tam giác cân.
**hinh:** HH00103_VN-3.png
