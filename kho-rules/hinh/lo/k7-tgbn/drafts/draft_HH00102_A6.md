### TL2.1 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ có $AB=AC$ và $\widehat{B}=\widehat{C}$. Điểm $D$ thuộc cạnh $BC$ sao cho $AD$ là tia phân giác của $\widehat{BAC}$.
a) Chứng minh $\triangle ABD=\triangle ACD$.
b) Chứng minh $AD\perp BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Đề cho $AB=AC$ và $AD$ là tia phân giác (cho hai góc bằng nhau tại đỉnh $A$), lại có cạnh $AD$ chung, nên chọn $\triangle ABD$ và $\triangle ACD$ theo trường hợp c.g.c.

**Bước 1.** Ý a) Từ $AD$ là tia phân giác của $\widehat{BAC}$, viết được $\widehat{BAD}=\widehat{CAD}$.

**Bước 2.** Ý a) Ghép với $AB=AC$ (gt) và cạnh chung $AD$. Góc $\widehat{BAD}$ nằm giữa hai cạnh $AB$, $AD$; góc $\widehat{CAD}$ nằm giữa hai cạnh $AC$, $AD$, nên kết luận theo c.g.c.

**Bước 3.** Ý b) Từ hai tam giác bằng nhau suy ra cặp góc tương ứng $\widehat{ADB}=\widehat{ADC}$.

**Bước 4.** Ý b) $D$ nằm giữa $B$ và $C$ nên hai góc này kề bù, tổng bằng $180^\circ$. Hai góc bằng nhau và tổng $180^\circ$ thì mỗi góc bằng $90^\circ$.

**Chú ý:** Trong khối "Xét … có:" phải viết đúng thứ tự đỉnh $A$, $B$, $D$ ↔ $A$, $C$, $D$ để các cặp tương ứng ở ý b) không bị nhầm.

**Phần 2. Trình bày**
a) Xét $\triangle ABD$ và $\triangle ACD$ có:
$AB=AC$ (gt);
$\widehat{BAD}=\widehat{CAD}$ (tia phân giác);
$AD$ chung.
Do đó $\triangle ABD=\triangle ACD$ (c.g.c).

b) Vì $\triangle ABD=\triangle ACD$ (cmt)
nên $\widehat{ADB}=\widehat{ADC}$ (hai góc tương ứng).
Mà $\widehat{ADB}+\widehat{ADC}=180^\circ$ (hai góc kề bù)
nên $\widehat{ADB}=\widehat{ADC}=90^\circ$.
Vậy $AD\perp BC$.
**cấu hình hình / nghi vấn:**
Hình đúng ảnh gốc t-11 (Bài 1): $\triangle ABC$ cân dựng bằng toạ độ, $D$ chân $AD$ trên $BC$; vẽ gạch đôi trên $AB$, $AC$; hai cung đơn ở $A$ (bán kính khác nhau, hai bên $AD$); hai cung đôi ở $B$ và $C$. KHÔNG vẽ ô vuông ở $D$ (ý phải chứng minh).
Đề gốc chỉ ghi "AD là tia phân giác"; $AB=AC$ và $\widehat{B}=\widehat{C}$ lấy từ kí hiệu trên hình, đã đưa vào đề. Hai dữ kiện này thừa nhau (có $AB=AC$ + phân giác đã đủ c.g.c); lời giải chọn c.g.c; có thể làm g.c.g bằng $\widehat{B}=\widehat{C}$ nhưng phải suy thêm $\widehat{ADB}=\widehat{ADC}$ qua tổng ba góc.
Đã verify 2 bộ toạ độ (kiem_A6.mjs): phân giác, $AB=AC$, $\triangle ABD=\triangle ACD$ đúng thứ tự đỉnh, $\widehat{ADB}=\widehat{ADC}=90^\circ$, $D$ giữa $B$, $C$ — PASS. Chỉ dùng c.g.c, kề bù, tia phân giác (trong whitelist).
**hinh:** HH00102_TL2-1.png

### TL2.2 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ bên, biết hai đoạn thẳng $EC$ và $DB$ cắt nhau tại $A$; $AE=AC$; $\widehat{DEA}=\widehat{BCA}$.
a) Chứng minh $\triangle ABC=\triangle ADE$.
b) Chứng minh $ED=BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hai đoạn thẳng cắt nhau tại $A$ tạo cặp góc đối đỉnh, lại có $AE=AC$ và một cặp góc ở đầu mút $E$, $C$, nên chọn $\triangle ABC$ và $\triangle ADE$ theo trường hợp g.c.g.

**Bước 1.** Ý a) Liệt kê yếu tố của đề: $AC=AE$ và $\widehat{ACB}=\widehat{AED}$ (cặp góc ở hai đầu mút của $AC$ và $AE$).

**Bước 2.** Ý a) Tìm góc còn lại ở đỉnh $A$: $\widehat{BAC}$ và $\widehat{DAE}$ là hai góc đối đỉnh nên bằng nhau.

**Bước 3.** Ý a) Cạnh $AC$ nằm xen giữa $\widehat{A}$ và $\widehat{C}$; cạnh $AE$ nằm xen giữa $\widehat{A}$ và $\widehat{E}$, nên kết luận theo g.c.g với thứ tự $A\to A$, $B\to D$, $C\to E$.

**Bước 4.** Ý b) $ED$ và $BC$ là hai cạnh nằm đối diện với góc $\widehat{A}$ trong hai tam giác vừa bằng nhau, nên là cặp cạnh tương ứng.

**Chú ý:** Viết $\triangle ABC=\triangle ADE$ (không phải $\triangle ABC=\triangle AED$): đỉnh $B$ ứng với $D$, đỉnh $C$ ứng với $E$.

**Phần 2. Trình bày**
a) Xét $\triangle ABC$ và $\triangle ADE$ có:
$\widehat{ACB}=\widehat{AED}$ (gt);
$AC=AE$ (gt);
$\widehat{BAC}=\widehat{DAE}$ (hai góc đối đỉnh).
Do đó $\triangle ABC=\triangle ADE$ (g.c.g).

b) Vì $\triangle ABC=\triangle ADE$ (cmt)
nên $BC=DE$ (hai cạnh tương ứng).
Vậy $ED=BC$.
**cấu hình hình / nghi vấn:**
Hình đồng hồ cát như ảnh gốc t-11 (Bài 2): $E$, $D$ trên; $B$, $C$ dưới; $A$ là trung điểm $EC$ và là giao của $EC$, $DB$. Dựng $B=2A-D$ (đúng với $\widehat{E}=\widehat{C}$ ⇒ $ED\parallel BC$). Vẽ gạch đôi $EA$, $AC$ và cung đôi ở $E$, $C$ như ảnh. Ảnh gốc còn đánh dấu cặp góc đối đỉnh ở $A$; KHÔNG vẽ vì là bước phải chứng minh (lý do "đối đỉnh"), đề không ghi.
Đề gốc "Cho hình vẽ bên" không ghi dữ kiện — đã đọc từ kí hiệu hình: $EA=AC$, $\widehat{E}=\widehat{C}$.
Đã verify 2 bộ toạ độ: $EA=AC$, $\widehat{DEA}=\widehat{BCA}$, $ED\parallel BC$, $\triangle ABC=\triangle ADE$ (đỉnh $A,B,C\to A,D,E$), $\widehat{BAC}=\widehat{DAE}$, $ED=BC$ — PASS. Dùng g.c.g (trong whitelist).
**hinh:** HH00102_TL2-2.png

### TL2.3 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ bên, biết $AD$ là tia phân giác của $\widehat{BAC}$ và $DA$ là tia phân giác của $\widehat{BDC}$.
Chứng minh $\triangle ABD=\triangle ACD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Có hai tia phân giác cho hai cặp góc bằng nhau ở hai đầu $A$ và $D$ của cạnh chung $AD$, nên chọn $\triangle ABD$ và $\triangle ACD$ theo trường hợp g.c.g.

**Bước 1.** Từ $AD$ là tia phân giác của $\widehat{BAC}$, viết cặp góc bằng nhau ở đỉnh $A$: $\widehat{BAD}=\widehat{CAD}$.

**Bước 2.** Từ $DA$ là tia phân giác của $\widehat{BDC}$, viết cặp góc bằng nhau ở đỉnh $D$: $\widehat{BDA}=\widehat{CDA}$.

**Bước 3.** Hai tam giác có chung cạnh $AD$, và $AD$ chính là cạnh xen giữa hai góc vừa tìm được, nên kết luận theo g.c.g.

**Chú ý:** Cạnh bằng nhau ở đây là cạnh chung $AD$, không có trong giả thiết, phải tự nhận ra và ghi "chung".

**Phần 2. Trình bày**
Xét $\triangle ABD$ và $\triangle ACD$ có:
$\widehat{BAD}=\widehat{CAD}$ ($AD$ là tia phân giác của $\widehat{BAC}$);
$AD$ chung;
$\widehat{BDA}=\widehat{CDA}$ ($DA$ là tia phân giác của $\widehat{BDC}$).
Do đó $\triangle ABD=\triangle ACD$ (g.c.g).
**cấu hình hình / nghi vấn:**
Hình như ảnh gốc t-11 (Bài 3): tứ giác $ABDC$ đối xứng qua $AD$ (hình cánh diều), $A$ trên, $D$ dưới, $B$ trái, $C$ phải, đoạn $AD$; dựng $C$ đối xứng $B$ qua $AD$ nên hai tia phân giác đúng. Mỗi góc ở $A$ và ở $D$ đánh một cung đơn, hai cung hai bên $AD$ khác bán kính.
Ảnh gốc ghi "CMR: ABD = ACD" (thiếu kí hiệu tam giác) — đã sửa thành $\triangle ABD=\triangle ACD$.
Verify 2 bộ toạ độ ($B$ bất kì, $C$ đối xứng qua $AD$): hai phân giác, $\triangle ABD=\triangle ACD$ — PASS. Chỉ g.c.g + phân giác.
**hinh:** HH00102_TL2-3.png

### VN.1 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho hình vẽ bên, biết hai đoạn thẳng $AC$ và $BD$ cắt nhau tại $O$; $OA=OC$; $OB=OD$.
a) Chứng minh $\triangle AOB=\triangle COD$.
b) Chứng minh $\triangle AOD=\triangle COB$.
c) Chứng minh $AB=CD$ và $AB\parallel CD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $O$ là giao điểm của hai đoạn $AC$, $BD$ và đề cho hai cặp cạnh bằng nhau quanh $O$; góc xen giữa mỗi cặp cạnh là cặp góc đối đỉnh, nên chứng minh các cặp tam giác bằng nhau theo c.g.c rồi suy ra cạnh và góc tương ứng.

**Bước 1.** Ý a) Với $\triangle AOB$ và $\triangle COD$: hai cặp cạnh $OA=OC$, $OB=OD$ cho sẵn; góc xen giữa là $\widehat{AOB}$ và $\widehat{COD}$, hai góc đối đỉnh.

**Bước 2.** Ý b) Làm tương tự với $\triangle AOD$ và $\triangle COB$: góc xen giữa là $\widehat{AOD}$ và $\widehat{COB}$, cũng đối đỉnh.

**Bước 3.** Ý c) Từ $\triangle AOB=\triangle COD$ suy ra $AB=CD$ và một cặp góc tương ứng $\widehat{BAC}=\widehat{DCA}$.

**Bước 4.** Ý c) Hai góc $\widehat{BAC}$, $\widehat{DCA}$ cùng nằm trên cát tuyến $AC$, ở vị trí so le trong và bằng nhau, nên $AB\parallel CD$.

**Chú ý:** Ở ý c) phải chỉ rõ cát tuyến là $AC$ và $B$, $D$ nằm hai phía của $AC$ (đoạn $BD$ cắt $AC$ tại $O$) thì mới gọi là so le trong.

**Phần 2. Trình bày**
a) Xét $\triangle AOB$ và $\triangle COD$ có:
$OA=OC$ (gt);
$\widehat{AOB}=\widehat{COD}$ (hai góc đối đỉnh);
$OB=OD$ (gt).
Do đó $\triangle AOB=\triangle COD$ (c.g.c).

b) Xét $\triangle AOD$ và $\triangle COB$ có:
$OA=OC$ (gt);
$\widehat{AOD}=\widehat{COB}$ (hai góc đối đỉnh);
$OD=OB$ (gt).
Do đó $\triangle AOD=\triangle COB$ (c.g.c).

c) Vì $\triangle AOB=\triangle COD$ (cmt)
nên $AB=CD$ (hai cạnh tương ứng)
và $\widehat{BAC}=\widehat{DCA}$ (hai góc tương ứng).
Hai góc $\widehat{BAC}$ và $\widehat{DCA}$ ở vị trí so le trong
nên $AB\parallel CD$.
**cấu hình hình / nghi vấn:**
Hình như ảnh gốc t-12: $A$ trái trên, $B$ phải trên, $C$ phải dưới, $D$ trái dưới; $O$ trung điểm của cả $AC$ và $BD$ (dựng bằng toạ độ). Gạch đơn trên $AO$, $OC$; gạch đôi trên $BO$, $OD$ như ảnh. Đề gốc "Cho hình vẽ" — dữ kiện đọc từ gạch, đã đưa vào đề. Không vẽ ô vuông/kí hiệu song song.
Verify 2 bộ toạ độ: hai cặp tam giác bằng nhau đúng thứ tự đỉnh, đối đỉnh, $AB=CD$, $\widehat{BAC}=\widehat{DCA}$, $AB\parallel CD$, $B$, $D$ khác phía $AC$ — PASS. Chỉ c.g.c, đối đỉnh, so le trong (whitelist).
**hinh:** HH00102_VN-1.png

### VN.2 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $MNP$ có $MN=MP$. Kẻ tia $MX$ là tia phân giác của góc $NMP$ ($X$ thuộc cạnh $NP$).
a) Chứng minh $\triangle MNX=\triangle MPX$.
b) Chứng minh $\widehat{MNX}=\widehat{MPX}$.
c) Chứng minh $MX\perp NP$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Có $MN=MP$, tia phân giác $MX$ cho hai góc bằng nhau tại $M$, và $MX$ là cạnh chung, nên chọn $\triangle MNX$ và $\triangle MPX$ theo trường hợp c.g.c.

**Bước 1.** Ý a) Từ $MX$ là tia phân giác của $\widehat{NMP}$, viết $\widehat{NMX}=\widehat{PMX}$.

**Bước 2.** Ý a) Ghép với $MN=MP$ (gt) và $MX$ chung. Góc $\widehat{NMX}$ nằm giữa $MN$, $MX$; góc $\widehat{PMX}$ nằm giữa $MP$, $MX$, nên kết luận theo c.g.c.

**Bước 3.** Ý b) $\widehat{MNX}$ và $\widehat{MPX}$ là hai góc ở đỉnh $N$ và $P$ của hai tam giác bằng nhau, nên là cặp góc tương ứng.

**Bước 4.** Ý c) Cũng từ hai tam giác bằng nhau, $\widehat{MXN}=\widehat{MXP}$; hai góc này kề bù nên mỗi góc bằng $90^\circ$.

**Phần 2. Trình bày**
a) Xét $\triangle MNX$ và $\triangle MPX$ có:
$MN=MP$ (gt);
$\widehat{NMX}=\widehat{PMX}$ (tia phân giác);
$MX$ chung.
Do đó $\triangle MNX=\triangle MPX$ (c.g.c).

b) Vì $\triangle MNX=\triangle MPX$ (cmt)
nên $\widehat{MNX}=\widehat{MPX}$ (hai góc tương ứng).

c) Vì $\triangle MNX=\triangle MPX$ (cmt)
nên $\widehat{MXN}=\widehat{MXP}$ (hai góc tương ứng).
Mà $\widehat{MXN}+\widehat{MXP}=180^\circ$ (hai góc kề bù)
nên $\widehat{MXN}=\widehat{MXP}=90^\circ$.
Vậy $MX\perp NP$.
**cấu hình hình / nghi vấn:**
Đề gốc không có hình; hình dựng từ giả thiết: $\triangle MNP$ cân (đối xứng qua $MX$), $X$ chân phân giác. Vẽ gạch đơn trên $MN$, $MP$ và hai cung ở $M$ (bán kính khác nhau) vì đều là giả thiết; KHÔNG vẽ ô vuông ở $X$ (ý c) và không đánh dấu $\widehat{N}=\widehat{P}$ (ý b).
Ghi chú: đề gốc ý a) viết "$MNX=MPX$" bằng kí hiệu tam giác nhỏ — chuẩn lại thành $\triangle$; ý b) ghi "CMR: $MNX=MPX$" thiếu mũ — là góc, đã sửa thành $\widehat{MNX}=\widehat{MPX}$ (bài này ghi chữ không mũ nhưng ngữ cảnh là hai góc tương ứng).
Verify 2 bộ toạ độ: phân giác, $\triangle MNX=\triangle MPX$, $\widehat{MNX}=\widehat{MPX}$, $\widehat{MXN}=\widehat{MXP}=90^\circ$ — PASS. Không dùng tính chất tam giác cân (cấm ở bài này).
**hinh:** HH00102_VN-2.png

### VN.3 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$. Qua $A$ kẻ đường thẳng $d$ song song với cạnh $BC$. Trên đường thẳng $d$ lấy điểm $M$ sao cho $AM=BC$; $M$ và $C$ nằm cùng phía so với đường thẳng $AB$. Chứng minh:
a) $\widehat{MAC}=\widehat{BCA}$;
b) $\triangle MAC=\triangle BCA$;
c) $AB\parallel MC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $d\parallel BC$ cho cặp góc so le trong, $AM=BC$ đã cho, và $AC$ là cạnh chung của hai tam giác $MAC$, $BCA$, nên chọn c.g.c rồi dùng hai góc tương ứng để chứng minh song song.

**Bước 1.** Ý a) $A\in d$ nên $AM$ nằm trên $d$, mà $d\parallel BC$. Xét cát tuyến $AC$: $\widehat{MAC}$ và $\widehat{BCA}$ là hai góc so le trong nên bằng nhau.

**Bước 2.** Ý b) Ghép cặp cạnh $MA=BC$ (gt), cặp góc $\widehat{MAC}=\widehat{BCA}$ (ý a) và cạnh chung $AC$ nằm giữa hai cạnh/góc đó, nên kết luận c.g.c. Chú ý thứ tự $M\to B$, $A\to C$, $C\to A$.

**Bước 3.** Ý c) Từ $\triangle MAC=\triangle BCA$ suy ra góc tương ứng $\widehat{MCA}=\widehat{BAC}$.

**Bước 4.** Ý c) Hai góc $\widehat{MCA}$, $\widehat{BAC}$ là hai góc so le trong tạo bởi $AB$, $MC$ với cát tuyến $AC$ và bằng nhau, nên $AB\parallel MC$.

**Chú ý:** Điều kiện "$M$ và $C$ cùng phía so với $AB$" bảo đảm $M$ và $B$ nằm hai phía của $AC$, nhờ đó các cặp góc ở trên mới là so le trong.

**Phần 2. Trình bày**
a) Vì $d\parallel BC$ (gt) và $M\in d$ nên $AM\parallel BC$.
Hai góc $\widehat{MAC}$ và $\widehat{BCA}$ ở vị trí so le trong
nên $\widehat{MAC}=\widehat{BCA}$ (hai góc so le trong).

b) Xét $\triangle MAC$ và $\triangle BCA$ có:
$MA=BC$ (gt);
$\widehat{MAC}=\widehat{BCA}$ (cmt);
$AC$ chung.
Do đó $\triangle MAC=\triangle BCA$ (c.g.c).

c) Vì $\triangle MAC=\triangle BCA$ (cmt)
nên $\widehat{MCA}=\widehat{BAC}$ (hai góc tương ứng).
Hai góc này ở vị trí so le trong
nên $AB\parallel MC$.
**cấu hình hình / nghi vấn:**
Đề gốc không có hình; dựng từ giả thiết: $B(0,0)$, $C(4,0)$, $A(1;2,5)$, $d$ qua $A$ ngang, $M=A+\overrightarrow{BC}=(5;2,5)$ ($M$, $C$ cùng phía $AB$). Vẽ gạch đơn trên $AM$ và $BC$ (giả thiết), đường thẳng $d$ kéo dài hai phía. KHÔNG đánh dấu hai góc so le trong (ý a).
Đề gốc ý a) viết "$MAC=BCA$" thiếu mũ — là góc, đã sửa thành $\widehat{MAC}=\widehat{BCA}$.
Cần chú ý: "so le trong" của ý a) và c) chỉ đúng khi $M$, $B$ khác phía $AC$; đã kiểm bằng toạ độ 3 bộ (kể cả tam giác nhọn/tù) — luôn đúng khi $M$, $C$ cùng phía $AB$. Trong lời giải dựa vào "theo hình" (nêu trong Chú ý) thay vì chứng minh chặt chẽ cho HS lớp 7.
Verify 3 bộ toạ độ: $AM\parallel BC$, $AM=BC$, $\widehat{MAC}=\widehat{BCA}$, $\triangle MAC=\triangle BCA$ (thứ tự $M,A,C\to B,C,A$), $\widehat{MCA}=\widehat{BAC}$, $AB\parallel MC$ — PASS.
**hinh:** HH00102_VN-3.png

### VN.4 → HH00102
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$, điểm $D$ thuộc cạnh $BC$ sao cho $\widehat{ABD}=\widehat{ACD}$, $AD\perp BC$ và $D$ là trung điểm của $BC$.
a) Chứng minh $\triangle ABD=\triangle ACD$.
b) Chứng minh $AD$ là tia phân giác của $\widehat{BAC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Ở hai tam giác $ABD$ và $ACD$ có sẵn cặp góc $\widehat{B}=\widehat{C}$, cặp cạnh $BD=CD$ (trung điểm) và cặp góc vuông tại $D$ (do $AD\perp BC$); cạnh $BD$, $CD$ nằm xen giữa hai góc nên chọn g.c.g.

**Bước 1.** Ý a) Từ $AD\perp BC$ suy ra $\widehat{ADB}=\widehat{ADC}=90^\circ$.

**Bước 2.** Ý a) Từ $D$ là trung điểm của $BC$ suy ra $BD=CD$.

**Bước 3.** Ý a) Cạnh $BD$ nằm xen giữa $\widehat{ABD}$ và $\widehat{ADB}$; cạnh $CD$ nằm xen giữa $\widehat{ACD}$ và $\widehat{ADC}$, nên kết luận g.c.g.

**Bước 4.** Ý b) Từ hai tam giác bằng nhau suy ra $\widehat{BAD}=\widehat{CAD}$; $D$ nằm giữa $B$ và $C$ nên tia $AD$ nằm giữa hai tia $AB$, $AC$. Hai điều này là định nghĩa tia phân giác.

**Phần 2. Trình bày**
a) Vì $AD\perp BC$ (gt)
nên $\widehat{ADB}=\widehat{ADC}=90^\circ$.
Xét $\triangle ABD$ và $\triangle ACD$ có:
$\widehat{ABD}=\widehat{ACD}$ (gt);
$BD=CD$ ($D$ là trung điểm của $BC$);
$\widehat{ADB}=\widehat{ADC}$ (cmt).
Do đó $\triangle ABD=\triangle ACD$ (g.c.g).

b) Vì $\triangle ABD=\triangle ACD$ (cmt)
nên $\widehat{BAD}=\widehat{CAD}$ (hai góc tương ứng).
Lại có $D$ nằm giữa $B$ và $C$ nên tia $AD$ nằm giữa hai tia $AB$, $AC$.
Vậy $AD$ là tia phân giác của $\widehat{BAC}$ (định nghĩa tia phân giác).
**cấu hình hình / nghi vấn:**
Đề gốc không có hình; dựng từ giả thiết: $A$ trên, $B$, $C$ đối xứng qua $AD$, $D$ trung điểm $BC$ (ba dữ kiện đã tự khớp nhau). Vẽ ô vuông ở $D$, gạch đơn $BD$, $DC$, cung đơn ở $B$ và ở $C$ (đều là giả thiết); KHÔNG vẽ hai cung ở $A$ (ý b).
Đề gốc ghi "$ABD=ACD$" thiếu mũ — là góc, đã sửa thành $\widehat{ABD}=\widehat{ACD}$; thêm "$D$ thuộc cạnh $BC$" (ngầm trong đề).
Giả thiết thừa nhau (chỉ cần $BD=CD$, $AD\perp BC$ đã c.g.c); lời giải dùng g.c.g để dùng $\widehat{B}=\widehat{C}$ đúng bài học.
Verify 2 bộ toạ độ: $\widehat{ABD}=\widehat{ACD}$, $AD\perp BC$, $D$ trung điểm, $\triangle ABD=\triangle ACD$, $\widehat{BAD}=\widehat{CAD}$, $D$ giữa $B$, $C$ — PASS.
**hinh:** HH00102_VN-4.png
