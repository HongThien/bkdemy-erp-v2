# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 2 | B. Hình học (Bài 20–30) | tu_luan

### Bài 28 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ ($AB\ge AC$). Gọi $E$ là trung điểm của $BC$; $D,\ H$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$.
a) Chứng minh $ADEH$ là hình chữ nhật.
b) Chứng minh $D$ là trung điểm của $AB$.
c) Lấy $F$ sao cho $D$ là trung điểm của $EF$. Chứng minh $AHDF$ là hình bình hành.
d) Gọi $O$ là giao điểm của $AD$ và $HF$. Chứng minh $O$ là trung điểm của $AD$ và $HF$.
**Hình giải:** giai_bai28.png
**Chưa chắc:** dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không (ý b: $E$ là trung điểm $BC$, $ED\parallel AC$ nên $D$ là trung điểm $AB$)

**Phần 1. Hướng dẫn**

**Mấu chốt:** $E$ là trung điểm cạnh huyền nên $EA=EB=EC$; ý a đi từ bốn góc vuông, ý b dùng tam giác cân $EAB$, còn ý c và ý d đều xoay quanh hình bình hành $AHDF$.

**Bước 1.** Ý a: muốn $ADEH$ là hình chữ nhật, cần tứ giác có bốn góc vuông; ba góc $A$, $D$, $H$ đã vuông theo đề, góc $E$ có được từ tổng các góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $D$ là trung điểm của $AB$, cần $\triangle EAB$ cân tại $E$ để đường cao $ED$ cũng là trung tuyến; tam giác cân có được vì $EA=EB$, do $EA$ là trung tuyến ứng với cạnh huyền của tam giác vuông $ABC$ nên bằng nửa cạnh huyền.

**Bước 3.** Ý c: muốn $AHDF$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn cặp $AH$ và $DF$, lấy $AH\parallel DE$ và $AH=DE$ từ hình chữ nhật $ADEH$, còn $DF=DE$ vì $D$ là trung điểm của $EF$.

**Bước 4.** Ý d: muốn $O$ là trung điểm của $AD$ và $HF$, nhận ra $AD$ và $HF$ chính là hai đường chéo của hình bình hành $AHDF$ ở ý c, nên chúng cắt nhau tại trung điểm của mỗi đường.

**Chú ý:** bài này chưa được dùng đường trung bình nên ý b đi qua tam giác cân; điều kiện $AB\ge AC$ chỉ để hình vẽ đẹp, lời giải không cần đến.

**Phần 2. Trình bày**

a) Xét tứ giác $ADEH$ có:

$\widehat{DAH}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ADE}=90^\circ$ (vì $ED\perp AB$)

$\widehat{AHE}=90^\circ$ (vì $EH\perp AC$)

Suy ra $\widehat{DEH}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADEH$ có bốn góc vuông nên $ADEH$ là hình chữ nhật.

b) Tam giác $ABC$ vuông tại $A$ có $AE$ là đường trung tuyến ứng với cạnh huyền $BC$ nên $EA=\dfrac{1}{2}BC$.

Mà $E$ là trung điểm của $BC$ nên $EB=\dfrac{1}{2}BC$.

Do đó $EA=EB$, suy ra $\triangle EAB$ cân tại $E$.

Vì $ED\perp AB$ tại $D$ nên $ED$ là đường cao ứng với đáy $AB$ của tam giác cân $EAB$.

Trong tam giác cân, đường cao ứng với đáy đồng thời là đường trung tuyến nên $D$ là trung điểm của $AB$.

c) Vì $ADEH$ là hình chữ nhật (câu a) nên $AH\parallel DE$ và $AH=DE$.

Vì $D$ là trung điểm của $EF$ nên $F$ nằm trên đường thẳng $DE$ và $DF=DE$.

Do đó $AH\parallel DF$ và $AH=DF$.

Tứ giác $AHDF$ có $AH\parallel DF$ và $AH=DF$ nên $AHDF$ là hình bình hành (dấu hiệu nhận biết).

d) Vì $AHDF$ là hình bình hành (câu c) nên hai đường chéo $AD$ và $HF$ cắt nhau tại trung điểm của mỗi đường.

Mà $O$ là giao điểm của $AD$ và $HF$ nên $O$ là trung điểm của $AD$ và của $HF$.

### Bài 29 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$). Lấy $M\in BC$ sao cho $BM>MC,\ M\neq C$. Gọi $N,\ D$ lần lượt là hình chiếu của $M$ trên $AB,\ AC$.
a) Chứng minh $ADMN$ là hình chữ nhật.
b) Trên tia đối của tia $NM$ lấy $P$ sao cho $NM=NP$. Chứng minh $APND$ là hình bình hành.
c) Gọi $Q$ là hình chiếu của $M$ trên $AP$, $O$ là giao điểm của $QM$ và $ND$. Chứng minh $O$ là trung điểm của $QM$ và $\widehat{AQN}=\widehat{ADN}$.
**Hình giải:** giai_bai29.png
**Chưa chắc:** dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không (ý c: $N$ là trung điểm $MP$, $ND\parallel PQ$ nên $O$ là trung điểm $QM$)
**Chưa chắc:** lời giải ý c chứng minh thêm $A$ nằm giữa $Q$ và $P$ (dùng đúng hai điều kiện $AB<AC$, $BM>MC$) vì nếu $AB>AC$ thì $Q$ có thể rơi vào đoạn $AP$ và $\widehat{AQN}$, $\widehat{ADN}$ bù nhau chứ không bằng nhau; lời giải ngắn hơn thường bỏ qua chỗ này — CEO xem có giữ đoạn chứng minh vị trí điểm $Q$ không

**Phần 1. Hướng dẫn**

**Mấu chốt:** $ADMN$ là hình chữ nhật nên $AD\parallel NM$ và $AD=NM$; từ đó $APND$ là hình bình hành, và $N$ là trung điểm cạnh huyền $MP$ của tam giác vuông $MQP$ nên $NQ=NM=NP$ — hai điều này cho cả hai kết luận của ý c.

**Bước 1.** Ý a: muốn $ADMN$ là hình chữ nhật, cần tứ giác có bốn góc vuông; ba góc $A$, $N$, $D$ đã vuông theo đề, góc $M$ có được từ tổng các góc của tứ giác bằng $360^\circ$.

**Bước 2.** Ý b: muốn $APND$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn cặp $PN$ và $AD$, lấy $NM\parallel AD$ và $NM=AD$ từ hình chữ nhật $ADMN$, còn $NP=NM$ theo đề.

**Bước 3.** Ý c, kết luận $O$ là trung điểm của $QM$: muốn vậy cần $\triangle NQM$ cân tại $N$ và $NO\perp QM$ để $NO$ vừa là đường cao vừa là trung tuyến; $NQ=NM$ nhờ trung tuyến ứng với cạnh huyền $MP$ của tam giác vuông $MQP$, còn $ND\perp QM$ vì $ND\parallel AP$ (hình bình hành $APND$) và $QM\perp AP$.

**Bước 4.** Ý c, kết luận $\widehat{AQN}=\widehat{ADN}$: muốn vậy bắc cầu qua $\widehat{APN}$; $\widehat{ADN}=\widehat{APN}$ vì hai góc đối của hình bình hành $APND$, còn $\widehat{AQN}=\widehat{APN}$ vì tam giác $NQP$ cân tại $N$ (do $NQ=NP$) và $A$ nằm trên đoạn $QP$.

**Bước 5.** Ý c, chỗ cần điều kiện đề: muốn tia $QA$ trùng tia $QP$ cần $A$ nằm giữa $Q$ và $P$; ta chứng minh $NA<NB<NM=NP$ từ $AB<AC$ và $BM>MC$, rồi dùng quan hệ đường xiên và hình chiếu trên đường thẳng $QP$.

**Chú ý:** nếu bỏ điều kiện $AB<AC$ thì $Q$ có thể nằm giữa $A$ và $P$, khi đó $\widehat{AQN}$ và $\widehat{NQP}$ bù nhau và kết luận $\widehat{AQN}=\widehat{ADN}$ không còn đúng; vì vậy đề mới cho hai điều kiện đó.

**Phần 2. Trình bày**

a) Xét tứ giác $ADMN$ có:

$\widehat{NAD}=\widehat{BAC}=90^\circ$ (tam giác $ABC$ vuông tại $A$)

$\widehat{ANM}=90^\circ$ (vì $MN\perp AB$)

$\widehat{ADM}=90^\circ$ (vì $MD\perp AC$)

Suy ra $\widehat{DMN}=360^\circ-90^\circ-90^\circ-90^\circ=90^\circ$ (tổng các góc của tứ giác bằng $360^\circ$).

Tứ giác $ADMN$ có bốn góc vuông nên $ADMN$ là hình chữ nhật.

b) Vì $ADMN$ là hình chữ nhật (câu a) nên $NM\parallel AD$ và $NM=AD$.

Vì $P$ thuộc tia đối của tia $NM$ nên $P$, $N$, $M$ thẳng hàng, do đó $NP\parallel AD$.

Mà $NP=NM$ (đề) nên $NP=AD$.

Tứ giác $APND$ có $PN\parallel AD$ và $PN=AD$ nên $APND$ là hình bình hành (dấu hiệu nhận biết).

c) Chứng minh $O$ là trung điểm của $QM$.

Vì $APND$ là hình bình hành (câu b) nên $ND\parallel AP$.

Mà $QM\perp AP$ ($Q$ là hình chiếu của $M$ trên $AP$) nên $QM\perp ND$. Do đó $NO\perp QM$ tại $O$.

Tam giác $MQP$ vuông tại $Q$ có $N$ là trung điểm của cạnh huyền $MP$ (vì $NM=NP$) nên $NQ=\dfrac{1}{2}MP=NM$ (trung tuyến ứng với cạnh huyền).

Suy ra $\triangle NQM$ cân tại $N$, có $NO\perp QM$ nên $NO$ là đường cao ứng với đáy $QM$.

Trong tam giác cân, đường cao ứng với đáy đồng thời là đường trung tuyến nên $O$ là trung điểm của $QM$.

Chứng minh $\widehat{AQN}=\widehat{ADN}$.

Trước hết ta chứng minh $A$ nằm giữa $Q$ và $P$.

Vì $AB<AC$ nên $\widehat{C}<\widehat{B}$ (trong một tam giác, cạnh lớn hơn thì đối diện góc lớn hơn).

Vì $MN\perp AB$ và $AC\perp AB$ nên $MN\parallel AC$, suy ra $\widehat{NMB}=\widehat{C}$ (hai góc đồng vị). Do đó $\widehat{NMB}<\widehat{NBM}$ (vì $\widehat{NBM}=\widehat{B}$).

Trong $\triangle NMB$, cạnh $NB$ đối diện góc $\widehat{NMB}$ nhỏ hơn góc $\widehat{NBM}$ đối diện cạnh $NM$ nên $NB<NM$. (1)

Vì $BM>MC$ và $BM+MC=BC$ nên $BM>\dfrac{1}{2}BC=BE$, suy ra $E$ nằm giữa $B$ và $M$ và $BM=BE+EM$.

Mà $EA=EB$ (câu b) nên $MB=EA+EM>MA$ (bất đẳng thức tam giác $AEM$).

Vì $MN\perp AB$ nên $NA$ và $NB$ là hình chiếu của $MA$ và $MB$ trên $AB$. Do $MA<MB$ nên $NA<NB$. (2)

Từ (1) và (2) ta có $NA<NB<NM=NP$, tức $NA<NP$.

Gọi $K$ là chân đường vuông góc kẻ từ $N$ xuống đường thẳng $QP$. Vì $NQ=NP$ nên $\triangle NQP$ cân tại $N$, do đó $K$ là trung điểm của $QP$ và $KQ=KP$.

Vì $NA<NP$ nên hình chiếu $KA<KP$, tức $KA<KQ=KP$. Vậy $A$ nằm giữa $Q$ và $P$.

Do đó tia $QA$ trùng tia $QP$ và tia $PA$ trùng tia $PQ$, suy ra $\widehat{AQN}=\widehat{PQN}$ và $\widehat{APN}=\widehat{QPN}$.

Vì $\triangle NQP$ cân tại $N$ nên $\widehat{PQN}=\widehat{QPN}$. Do đó $\widehat{AQN}=\widehat{APN}$.

Vì $APND$ là hình bình hành (câu b) nên $\widehat{APN}=\widehat{ADN}$ (hai góc đối).

Vậy $\widehat{AQN}=\widehat{ADN}$.

### Bài 30 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$. Gọi $M$ là trung điểm của $BC$; lấy $D$ sao cho $M$ là trung điểm của $AD$.
a) Chứng minh $ABDC$ là hình chữ nhật.
b) Trên tia đối của tia $CA$, lấy $E$ sao cho $CE=CA$. Chứng minh $BDEC$ là hình bình hành.
c) Gọi $O$ là trung điểm của $CD$. Chứng minh $O$ là trung điểm của $BE$.
**Hình giải:** giai_bai30.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai đường chéo $AD$ và $BC$ cắt nhau tại trung điểm $M$ nên $ABDC$ là hình bình hành; hình bình hành $BDEC$ cho ý c vì $BE$ và $CD$ chính là hai đường chéo của nó.

**Bước 1.** Ý a: muốn $ABDC$ là hình chữ nhật, cần nó là hình bình hành có một góc vuông; hình bình hành có được vì hai đường chéo $AD$, $BC$ cắt nhau tại trung điểm $M$ của mỗi đường, góc vuông là $\widehat{A}$ theo đề.

**Bước 2.** Ý b: muốn $BDEC$ là hình bình hành, cần một cặp cạnh đối vừa song song vừa bằng nhau; chọn cặp $BD$ và $CE$, vì $BD$ song song và bằng $AC$ (cạnh đối trong hình chữ nhật) còn $CE$ nằm trên đường thẳng $AC$ và $CE=CA$.

**Bước 3.** Ý c: muốn $O$ là trung điểm của $BE$, nhận ra $BE$ và $CD$ là hai đường chéo của hình bình hành $BDEC$ ở ý b, nên cắt nhau tại trung điểm của mỗi đường; trung điểm của $CD$ chính là $O$.

**Chú ý:** trong tứ giác $BDEC$ các đỉnh liên tiếp là $B$, $D$, $E$, $C$ nên hai đường chéo là $BE$ và $DC$.

**Phần 2. Trình bày**

a) Vì $M$ là trung điểm của $BC$ và là trung điểm của $AD$ nên hai đường chéo $AD$ và $BC$ của tứ giác $ABDC$ cắt nhau tại trung điểm của mỗi đường.

Do đó $ABDC$ là hình bình hành (dấu hiệu nhận biết).

Hình bình hành $ABDC$ có $\widehat{BAC}=90^\circ$ nên $ABDC$ là hình chữ nhật (dấu hiệu nhận biết).

b) Vì $ABDC$ là hình chữ nhật (câu a) nên $BD\parallel AC$ và $BD=AC$.

Vì $E$ thuộc tia đối của tia $CA$ nên $E$ nằm trên đường thẳng $AC$, do đó $BD\parallel CE$.

Lại có $CE=CA$ (đề) và $BD=AC$ nên $BD=CE$.

Tứ giác $BDEC$ có $BD\parallel CE$ và $BD=CE$ nên $BDEC$ là hình bình hành (dấu hiệu nhận biết).

c) Vì $BDEC$ là hình bình hành (câu b) nên hai đường chéo $BE$ và $CD$ cắt nhau tại trung điểm của mỗi đường.

Do đó trung điểm của $CD$ cũng là trung điểm của $BE$.

Mà $O$ là trung điểm của $CD$ nên $O$ là trung điểm của $BE$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 28 ý b và Bài 29 ý c: dữ kiện đúng là bài đường trung bình (chiều đảo). Lời giải không dùng đường trung bình: Bài 28 ý b đi qua trung tuyến ứng cạnh huyền + tam giác cân; Bài 29 ý c đi qua trung tuyến ứng cạnh huyền + đường cao của tam giác cân.
- Bài 29 ý c, kết luận $\widehat{AQN}=\widehat{ADN}$: lời giải chứng minh thêm $A$ nằm giữa $Q$ và $P$ (đoạn "Trước hết ta chứng minh…"). Đã kiểm bằng toạ độ: với $AB>AC$ (vd $AB:AC=5:1$, $BM=0{,}7\,BC$) hai góc là $115{,}02^\circ$ và $64{,}98^\circ$ — bù nhau, không bằng nhau — nên hai điều kiện của đề thật sự được dùng. Nếu CEO muốn lời giải gọn như sách thì bỏ đoạn đó (ba đường: $NB<NM$, $MA<MB$, hình chiếu) và coi $A$ nằm giữa $Q$ và $P$ như hiển nhiên trên hình.
- Bài 30: không có chỗ cần xem.
- Kiến thức dùng: Chương III đến hết bài Hình chữ nhật (hình bình hành, hình chữ nhật, trung tuyến ứng với cạnh huyền) và nền lớp 7 (tam giác cân, quan hệ góc – cạnh đối diện, đường vuông góc – đường xiên, bất đẳng thức tam giác). Không dùng đường trung bình, Thalès, đồng dạng, Pythagore, hình thoi, hình vuông.
