### VHB1-VD2 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 Hình thang, VD2@p069 (giải p070)
**sach:** Sách dùng đường trung bình của △ACM (DN ∥ AM) rồi đường thẳng qua trung điểm song song cạnh thứ hai để có I, K là trung điểm BD, CE; cuối cùng áp "đoạn nối trung điểm hai đường chéo hình thang BEDC bằng nửa hiệu hai đáy" và ghi "bạn đọc tự chứng minh". Kho chứng minh phần cuối bằng hình bình hành BQDE (Q là trung điểm BC) và đường trung bình của △EQC, không cần định lí về đoạn nối trung điểm hai đường chéo.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** $\dfrac{a}{4}$
**noi_dung:**
Cho tam giác $ABC$ có $BC=a$, các đường trung tuyến $BD$, $CE$. Lấy các điểm $M$, $N$ trên cạnh $BC$ sao cho $BM=MN=NC$. Gọi $I$ là giao điểm của $AM$ và $BD$, $K$ là giao điểm của $AN$ và $CE$. Tính độ dài $IK$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** hai trung tuyến cho sẵn các trung điểm $D$, $E$ nên cả bài chạy bằng đường trung bình: chứng minh $I$, $K$ là trung điểm của $BD$, $CE$, rồi đưa $IK$ về đường trung bình của một tam giác có cạnh đáy $\dfrac{a}{2}$.
**Bước 1.** $BM=MN$ và $MN=NC$ nên $M$, $N$ là trung điểm của $BN$, $MC$. Kết hợp với $D$ là trung điểm của $AC$, ta có $DN$ là đường trung bình của $\triangle ACM$, suy ra $DN\parallel AM$.
**Bước 2.** Trong $\triangle BND$, đường thẳng $MI$ đi qua trung điểm $M$ của $BN$ và song song với $ND$ nên đi qua trung điểm của $BD$; vậy $I$ là trung điểm của $BD$. Làm tương tự cho $K$ trong $\triangle CME$.
**Bước 3.** $IK$ nối trung điểm của hai cạnh $BD$ và $CE$ của tứ giác $BEDC$ nên chưa phải đường trung bình của tam giác nào. Muốn có tam giác, lấy $Q$ là trung điểm của $BC$: khi đó $ED\parallel BQ$ và $ED=BQ=\dfrac a2$ nên $BQDE$ là hình bình hành, hai đường chéo $BD$, $EQ$ cắt nhau tại trung điểm $I$ của $BD$.
**Bước 4.** Trong $\triangle EQC$, $I$ và $K$ là trung điểm của $EQ$ và $EC$ nên $IK=\dfrac12QC=\dfrac a4$.
**Chú ý:** hai đường thẳng $AM$, $AN$ đối xứng nhau qua trung tuyến từ $A$ nên mọi bước làm cho $I$ đều làm lại được cho $K$ bằng cách đổi vai $B\leftrightarrow C$, $D\leftrightarrow E$, $M\leftrightarrow N$.

**Phần 2. Trình bày**
Vì $BD$, $CE$ là các đường trung tuyến nên $D$, $E$ lần lượt là trung điểm của $AC$, $AB$ (gt).
Vì $BM=MN=NC$ (gt) nên $M$ là trung điểm của $BN$ và $N$ là trung điểm của $MC$.
Xét $\triangle ACM$ có $D$ là trung điểm của $AC$ (cmt) và $N$ là trung điểm của $MC$ (cmt)
nên $DN$ là đường trung bình của $\triangle ACM$.
Suy ra $DN\parallel AM$ (tính chất đường trung bình).
Xét $\triangle BND$ có $M$ là trung điểm của $BN$ (cmt) và $MI\parallel ND$ ($I\in AM$, $DN\parallel AM$)
nên $I$ là trung điểm của $BD$ (đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba).
Xét $\triangle ABN$ có $E$ là trung điểm của $AB$ (cmt) và $M$ là trung điểm của $BN$ (cmt)
nên $EM$ là đường trung bình của $\triangle ABN$, suy ra $EM\parallel AN$.
Xét $\triangle CME$ có $N$ là trung điểm của $MC$ (cmt) và $NK\parallel ME$ ($K\in AN$, $EM\parallel AN$)
nên $K$ là trung điểm của $CE$ (cùng lí do như trên).
Gọi $Q$ là trung điểm của $BC$, khi đó $BQ=\dfrac a2$.
Xét $\triangle ABC$ có $E$, $D$ là trung điểm của $AB$, $AC$ (cmt)
nên $ED$ là đường trung bình của $\triangle ABC$.
Suy ra $ED\parallel BC$ và $ED=\dfrac{BC}{2}=\dfrac a2$ (tính chất đường trung bình).
Do đó $ED\parallel BQ$ và $ED=BQ$ nên $BQDE$ là hình bình hành (tứ giác có hai cạnh đối song song và bằng nhau).
Hai đường chéo $BD$ và $EQ$ cắt nhau tại trung điểm của mỗi đường.
Mà $I$ là trung điểm của $BD$ (cmt) nên $I$ là trung điểm của $EQ$.
Xét $\triangle EQC$ có $I$ là trung điểm của $EQ$ và $K$ là trung điểm của $EC$ (cmt)
nên $IK$ là đường trung bình của $\triangle EQC$.
Suy ra $IK=\dfrac12QC=\dfrac12\cdot\dfrac a2=\dfrac a4$ (tính chất đường trung bình).
Vậy $IK=\dfrac a4$.
**hinh:** VHB1-VD2.png
**hinh_lg:** VHB1-VD2_lg.png
**nghi_van:** Đáp số là biểu thức theo $a$ (không phải số) vì đề cho $BC=a$; cổng nhập vẫn nhận "a/4".

### VHB1-14a → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 14a@p071 (giải p180)
**sach:** Lấy I là trung điểm của AG; dựng AA', BB', CC', II', MM' vuông góc với d; đường trung bình của hình thang BB'C'C và hai tam giác vuông bằng nhau cho AA' = BB' + CC' (sách chỉ ghi đáp số và hình).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trọng tâm $G$. Vẽ đường thẳng $d$ đi qua $G$ và cắt các đoạn thẳng $AB$, $AC$. Gọi $A'$, $B'$, $C'$ lần lượt là hình chiếu vuông góc của $A$, $B$, $C$ trên $d$. Tìm liên hệ giữa các độ dài $AA'$, $BB'$, $CC'$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $M$ là trung điểm của $BC$ và $I$ là trung điểm của $AG$. $MM'$ là đường trung bình của hình thang $BB'C'C$, còn $II'$ là đường trung bình của $\triangle AA'G$; hai đoạn $II'$ và $MM'$ bằng nhau vì $I$, $M$ đối xứng nhau qua $G\in d$. Từ đó $AA'=BB'+CC'$.

- n1 | - | $MM'=\dfrac{BB'+CC'}{2}$ | gt | $BB'\parallel MM'\parallel CC'$ (cùng vuông góc với $d$), $M$ là trung điểm $BC$, đường trung bình của hình thang $BB'C'C$
- n2 | - | $II'=\dfrac{AA'}{2}$ | gt | $I$ là trung điểm $AG$, $II'\parallel AA'$, đường trung bình của $\triangle AA'G$
- n3 | - | $G$ là trung điểm của $IM$ và $I$, $M$ nằm hai phía của $d$ | gt | $AG=2GM$ (trọng tâm) và $IG=\dfrac12AG$
- n4 | - | $II'=MM'$ | n3 | hai tam giác vuông $IGI'$ và $MGM'$ bằng nhau (cạnh huyền - góc nhọn)
- n5 | - | $AA'=BB'+CC'$ | n1, n2, n4 | thay $II'=\dfrac{AA'}{2}$ và $MM'=\dfrac{BB'+CC'}{2}$ vào $II'=MM'$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $M$ là trung điểm của $BC$, $I$ là trung điểm của $AG$; gọi $I'$, $M'$ là hình chiếu vuông góc của $I$, $M$ trên $d$.
Vì $d$ cắt các đoạn $AB$, $AC$ nên $A$ nằm khác phía với $B$, $C$ đối với $d$, còn $B$, $C$ nằm cùng phía.
Ta có $BB'\perp d$, $CC'\perp d$, $MM'\perp d$ nên $BB'\parallel MM'\parallel CC'$.
Xét hình thang $BB'C'C$ có $M$ là trung điểm của cạnh bên $BC$ và $MM'\parallel BB'$
nên $M'$ là trung điểm của $B'C'$ và $MM'$ là đường trung bình của hình thang.
Suy ra $MM'=\dfrac{BB'+CC'}{2}$. (1)
(Nếu $BC\perp d$ thì $B'\equiv C'\equiv M'$ và $MM'=BB'=CC'$, hệ thức (1) vẫn đúng.)
[[so-do:n2]]
Ta có $AA'\perp d$ và $II'\perp d$ nên $II'\parallel AA'$.
Xét $\triangle AA'G$ có $I$ là trung điểm của $AG$ và $II'\parallel AA'$
nên $I'$ là trung điểm của $A'G$ và $II'$ là đường trung bình của $\triangle AA'G$.
Suy ra $II'=\dfrac{AA'}{2}$. (2)
[[so-do:n3]]
Vì $G$ là trọng tâm của $\triangle ABC$ nên $A$, $G$, $M$ thẳng hàng, $G$ nằm giữa $A$ và $M$ và $AG=2GM$.
Mà $I$ là trung điểm của $AG$ nên $IG=\dfrac12AG=GM$.
Do $G\in d$ và $I\in AG$ nên $I$ cùng phía với $A$ đối với $d$, còn $M$ cùng phía với $B$, $C$, tức là $I$ và $M$ nằm hai phía của $d$.
Vậy $G$ là trung điểm của $IM$.
[[so-do:n4]]
Xét hai tam giác vuông $IGI'$ và $MGM'$ có:
$GI=GM$ (cmt);
$\widehat{IGI'}=\widehat{MGM'}$ (đối đỉnh)
nên $\triangle IGI'=\triangle MGM'$ (cạnh huyền - góc nhọn).
Suy ra $II'=MM'$. (3)
(Nếu $IM\perp d$ thì $I'\equiv M'\equiv G$ và $II'=IG=GM=MM'$, hệ thức (3) vẫn đúng.)
[[so-do:n5]]
Từ (1), (2), (3) suy ra $\dfrac{AA'}{2}=\dfrac{BB'+CC'}{2}$.
Vậy $AA'=BB'+CC'$.
**hinh:** VHB1-14a.png
**hinh_lg:** VHB1-14a_lg.png
**nghi_van:**

### VHB1-14b → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 14b@p071 (giải p180)
**sach:** Gọi E là trung điểm AC, M là trung điểm BG; hai lần đường trung bình hình thang (MM', EE') rồi một lần nữa cho GG' vì G là trung điểm ME; cộng các hệ thức thu được AA' + BB' + CC' = 3GG'.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trọng tâm $G$ và đường thẳng $d$ nằm ngoài tam giác $ABC$. Gọi $A'$, $B'$, $C'$, $G'$ lần lượt là hình chiếu vuông góc của $A$, $B$, $C$, $G$ trên $d$. Các độ dài $AA'$, $BB'$, $CC'$, $GG'$ có liên hệ gì?
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $E$ là trung điểm của $AC$ và $M$ là trung điểm của $BG$. Vì $BG=2GE$ nên $G$ là trung điểm của $ME$. Ba lần đường trung bình của hình thang (cho $E$, $M$ rồi $G$) nối $GG'$ với $AA'$, $BB'$, $CC'$.

- n1 | - | $EE'=\dfrac{AA'+CC'}{2}$ | gt | $E$ là trung điểm $AC$, đường trung bình của hình thang $AA'C'C$
- n2 | - | $MM'=\dfrac{BB'+GG'}{2}$ | gt | $M$ là trung điểm $BG$, đường trung bình của hình thang $BB'G'G$
- n3 | - | $G$ là trung điểm của $ME$ và $GG'=\dfrac{MM'+EE'}{2}$ | gt | $BG=2GE$ (trọng tâm), $BM=MG$; đường trung bình của hình thang $MM'E'E$
- n4 | - | $AA'+BB'+CC'=3GG'$ | n1, n2, n3 | thế $EE'$, $MM'$ vào $2GG'=MM'+EE'$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $d$ nằm ngoài tam giác $ABC$ nên $A$, $B$, $C$ và mọi điểm của tam giác nằm cùng một phía đối với $d$.
Gọi $E$ là trung điểm của $AC$, $M$ là trung điểm của $BG$; $E'$, $M'$ là hình chiếu của $E$, $M$ trên $d$.
Các đoạn $AA'$, $CC'$, $EE'$ cùng vuông góc với $d$ nên song song với nhau.
Xét hình thang $AA'C'C$ có $E$ là trung điểm của cạnh bên $AC$ và $EE'\parallel AA'$
nên $EE'$ là đường trung bình của hình thang.
Suy ra $EE'=\dfrac{AA'+CC'}{2}$. (1)
[[so-do:n2]]
Các đoạn $BB'$, $GG'$, $MM'$ cùng vuông góc với $d$ nên song song với nhau.
Xét hình thang $BB'G'G$ có $M$ là trung điểm của cạnh bên $BG$ và $MM'\parallel BB'$
nên $MM'$ là đường trung bình của hình thang.
Suy ra $MM'=\dfrac{BB'+GG'}{2}$. (2)
[[so-do:n3]]
Vì $G$ là trọng tâm của $\triangle ABC$ nên $B$, $G$, $E$ thẳng hàng, $G$ nằm giữa $B$ và $E$ và $BG=2GE$.
Mà $M$ là trung điểm của $BG$ nên $MG=\dfrac12BG=GE$.
Vậy $G$ là trung điểm của $ME$.
Xét hình thang $MM'E'E$ (có $MM'\parallel EE'$) với $G$ là trung điểm của cạnh bên $ME$ và $GG'\parallel MM'$
nên $GG'$ là đường trung bình của hình thang.
Suy ra $GG'=\dfrac{MM'+EE'}{2}$, tức $2GG'=MM'+EE'$. (3)
[[so-do:n4]]
Thế (1) và (2) vào (3) ta được $2GG'=\dfrac{BB'+GG'}{2}+\dfrac{AA'+CC'}{2}$.
Nhân hai vế với 2: $4GG'=AA'+BB'+CC'+GG'$.
Suy ra $AA'+BB'+CC'=3GG'$.
Vậy $AA'+BB'+CC'=3GG'$.
**hinh:** VHB1-14b.png
**hinh_lg:** VHB1-14b_lg.png
**nghi_van:**

### VHB1-15 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 15* @p071 (giải p181) · bài có dấu sao (nâng cao)
**sach:** K = AD ∩ BF thì △ABK đều; tổng khoảng cách từ D, E, F đến AB bằng chiều cao của △ABK, rồi áp kết quả bài 14b cho trọng tâm G của △DEF. Kho không dùng đường phụ K: tính trực tiếp từng khoảng cách là đường cao tam giác đều, và chứng minh lại hệ thức của trọng tâm (hai lần đường trung bình hình thang).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Trên đoạn thẳng $AB$ lấy các điểm $M$ và $N$ ($M$ nằm giữa $A$ và $N$). Vẽ về cùng một phía của $AB$ các tam giác đều $AMD$, $MNE$, $BNF$. Gọi $G$ là trọng tâm của tam giác $DEF$. Chứng minh rằng khoảng cách từ $G$ đến $AB$ không phụ thuộc vào vị trí của các điểm $M$, $N$ trên đoạn thẳng $AB$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Khoảng cách từ $D$, $E$, $F$ đến $AB$ là ba đường cao của ba tam giác đều có tổng ba cạnh bằng $AB$ nên tổng ba khoảng cách là $\dfrac{\sqrt3}{2}AB$ không đổi. Khoảng cách từ trọng tâm $G$ bằng $\dfrac13$ tổng đó, chứng minh bằng hai lần đường trung bình của hình thang (qua trung điểm $P$ của $EF$ và trung điểm $R$ của $DG$).

- n1 | - | $DD'+EE'+FF'=\dfrac{\sqrt3}{2}AB$ | gt | đường cao tam giác đều cạnh $s$ là $\dfrac{s\sqrt3}{2}$ (định lí Pythagore) và $AM+MN+NB=AB$
- n2 | - | $PP'=\dfrac{EE'+FF'}{2}$ | gt | $P$ là trung điểm $EF$, đường trung bình của hình thang $EE'F'F$
- n3 | - | $RR'=\dfrac{DD'+GG'}{2}$ | gt | $R$ là trung điểm $DG$, đường trung bình của hình thang $DD'G'G$
- n4 | - | $G$ là trung điểm của $RP$ và $GG'=\dfrac{RR'+PP'}{2}$ | gt | $DG=2GP$ (trọng tâm), $DR=RG$; đường trung bình của hình thang $RR'P'P$
- n5 | - | $GG'=\dfrac13(DD'+EE'+FF')=\dfrac{\sqrt3}{6}AB$ không đổi | n1, n2, n3, n4 | thế $PP'$, $RR'$ vào $2GG'=RR'+PP'$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $D'$, $E'$, $F'$, $G'$ lần lượt là hình chiếu vuông góc của $D$, $E$, $F$, $G$ trên $AB$.
Trong tam giác đều $AMD$ đường cao hạ từ $D$ rơi vào trung điểm của $AM$ nên $DD'$ là đường cao.
Áp dụng định lí Pythagore: $DD'=\sqrt{AM^2-\left(\dfrac{AM}{2}\right)^2}=\dfrac{\sqrt3}{2}AM$.
Tương tự $EE'=\dfrac{\sqrt3}{2}MN$ và $FF'=\dfrac{\sqrt3}{2}NB$.
Vì $M$ nằm giữa $A$ và $N$, $N$ nằm giữa $M$ và $B$ nên $AM+MN+NB=AB$.
Suy ra $DD'+EE'+FF'=\dfrac{\sqrt3}{2}(AM+MN+NB)=\dfrac{\sqrt3}{2}AB$. (1)
[[so-do:n2]]
Vì $D$, $E$, $F$ cùng nằm về một phía của $AB$ nên các điểm $G$, $P$, $R$ dưới đây cũng nằm về phía đó.
Gọi $P$ là trung điểm của $EF$, $R$ là trung điểm của $DG$; $P'$, $R'$ là hình chiếu của $P$, $R$ trên $AB$.
Các đoạn $EE'$, $FF'$, $PP'$ cùng vuông góc với $AB$ nên song song với nhau.
Xét hình thang $EE'F'F$ có $P$ là trung điểm của cạnh bên $EF$ và $PP'\parallel EE'$
nên $PP'$ là đường trung bình của hình thang.
Suy ra $PP'=\dfrac{EE'+FF'}{2}$. (2)
[[so-do:n3]]
Các đoạn $DD'$, $GG'$, $RR'$ cùng vuông góc với $AB$ nên song song với nhau.
Xét hình thang $DD'G'G$ có $R$ là trung điểm của cạnh bên $DG$ và $RR'\parallel DD'$
nên $RR'$ là đường trung bình của hình thang.
Suy ra $RR'=\dfrac{DD'+GG'}{2}$. (3)
[[so-do:n4]]
Vì $G$ là trọng tâm của $\triangle DEF$ nên $D$, $G$, $P$ thẳng hàng, $G$ nằm giữa $D$ và $P$ và $DG=2GP$.
Mà $R$ là trung điểm của $DG$ nên $RG=\dfrac12DG=GP$.
Vậy $G$ là trung điểm của $RP$.
Xét hình thang $RR'P'P$ có $G$ là trung điểm của cạnh bên $RP$ và $GG'\parallel RR'$
nên $GG'$ là đường trung bình của hình thang.
Suy ra $2GG'=RR'+PP'$. (4)
[[so-do:n5]]
Thế (2) và (3) vào (4): $2GG'=\dfrac{DD'+GG'}{2}+\dfrac{EE'+FF'}{2}$.
Nhân hai vế với 2: $4GG'=DD'+EE'+FF'+GG'$.
Suy ra $GG'=\dfrac{DD'+EE'+FF'}{3}$.
Kết hợp với (1) ta được $GG'=\dfrac13\cdot\dfrac{\sqrt3}{2}AB=\dfrac{\sqrt3}{6}AB$.
Vì $AB$ không đổi nên khoảng cách từ $G$ đến $AB$ bằng $\dfrac{\sqrt3}{6}AB$ không phụ thuộc vào vị trí của $M$, $N$.
**hinh:** VHB1-15.png
**hinh_lg:** VHB1-15_lg.png
**nghi_van:**

### VHB1-16a → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 16a@p071 (giải p181)
**sach:** Gọi K là trung điểm AC; KE, KF là đường trung bình của △ACD, △ABC nên EK = CD/2, KF = AB/2; bất đẳng thức tam giác EF ≤ KE + KF.
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Tứ giác $ABCD$ có $E$, $F$ theo thứ tự là trung điểm của $AD$, $BC$. Chứng minh rằng $EF\le\dfrac{AB+CD}{2}$.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Kẻ thêm $K$ là trung điểm của $AC$ để $KE$, $KF$ là đường trung bình của hai tam giác $ACD$, $ABC$; khi đó $KE+KF=\dfrac{AB+CD}{2}$ và so với $EF$ bằng bất đẳng thức tam giác.

- n1 | - | $EK=\dfrac{CD}{2}$ | gt | $E$, $K$ là trung điểm $AD$, $AC$, đường trung bình của $\triangle ACD$
- n2 | - | $KF=\dfrac{AB}{2}$ | gt | $K$, $F$ là trung điểm $AC$, $BC$, đường trung bình của $\triangle ABC$
- n3 | - | $EF\le\dfrac{AB+CD}{2}$ | n1, n2 | bất đẳng thức tam giác $EF\le EK+KF$

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $K$ là trung điểm của $AC$.
Xét $\triangle ACD$ có $E$ là trung điểm của $AD$ (gt) và $K$ là trung điểm của $AC$ (cách vẽ)
nên $EK$ là đường trung bình của $\triangle ACD$.
Suy ra $EK=\dfrac{CD}{2}$ (tính chất đường trung bình). (1)
[[so-do:n2]]
Xét $\triangle ABC$ có $F$ là trung điểm của $BC$ (gt) và $K$ là trung điểm của $AC$ (cách vẽ)
nên $KF$ là đường trung bình của $\triangle ABC$.
Suy ra $KF=\dfrac{AB}{2}$ (tính chất đường trung bình). (2)
[[so-do:n3]]
Với ba điểm $E$, $K$, $F$ ta có $EF\le EK+KF$ (bất đẳng thức tam giác, dấu "=" khi $E$, $K$, $F$ thẳng hàng và $K$ nằm giữa $E$, $F$).
Từ (1) và (2) suy ra $EF\le\dfrac{CD}{2}+\dfrac{AB}{2}=\dfrac{AB+CD}{2}$.
Vậy $EF\le\dfrac{AB+CD}{2}$.
**hinh:** VHB1-16a.png
**hinh_lg:** VHB1-16a_lg.png
**nghi_van:**

### VHB1-16b → TRUNG (NDT-H1.27a)
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 16b@p071 (giải p181)
**noi_dung:** Tứ giác $ABCD$ có $E$, $F$ theo thứ tự là trung điểm của $AD$, $BC$. Tứ giác $ABCD$ có điều kiện gì thì $EF=\dfrac{AB+CD}{2}$?
**ly_do:** giống hệt NDT-H1.27a (cùng tứ giác, cùng E, F, cùng hỏi điều kiện để EF = (AB+CD)/2; đáp án hình thang có hai đáy AB, CD); lời giải sách cũng chỉ là E, K, F thẳng hàng ⇔ AB ∥ CD.

### VHB1-17 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 17@p072 (giải p181)
**sach:** Gọi M là trung điểm AD; MI, MK là đường trung bình của △ACD, △ABD nên MI = CD/2 = AB/2 = MK, △MIK cân; hai góc đáy bằng nhau, mỗi góc bằng góc của IK với CD, AB nhờ các cặp góc so le trong (sách vẽ E, F là giao của IK với AB, CD).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Tứ giác $ABCD$ có $AB=CD$. Chứng minh rằng đường thẳng đi qua trung điểm của hai đường chéo $AC$, $BD$ tạo với hai đường thẳng $AB$ và $CD$ những góc nhọn bằng nhau.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Lấy $M$ là trung điểm của $AD$: $MI$ và $MK$ là đường trung bình của $\triangle ACD$, $\triangle ABD$ nên $MI\parallel CD$, $MK\parallel AB$ và $MI=\dfrac{CD}{2}=\dfrac{AB}{2}=MK$. Tam giác $MIK$ cân tại $M$ và góc nhọn của $IK$ với mỗi đường thẳng $AB$, $CD$ chính là một góc ở đáy của nó.

- n1 | - | $MI\parallel CD$ và $MI=\dfrac{CD}{2}$ | gt | $M$, $I$ là trung điểm $AD$, $AC$, đường trung bình của $\triangle ACD$
- n2 | - | $MK\parallel AB$ và $MK=\dfrac{AB}{2}$ | gt | $M$, $K$ là trung điểm $AD$, $BD$, đường trung bình của $\triangle ABD$
- n3 | - | $\triangle MIK$ cân tại $M$, $\widehat{MIK}=\widehat{MKI}$ (nhọn) | n1, n2, gt | $MI=MK$ vì $AB=CD$; hai góc đáy của tam giác cân
- n4 | - | $IK$ tạo với $AB$ và với $CD$ các góc nhọn cùng bằng $\widehat{MIK}$ | n1, n2, n3 | góc giữa hai đường thẳng không đổi khi thay một đường thẳng bằng đường thẳng song song với nó

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $M$ là trung điểm của $AD$, $I$, $K$ lần lượt là trung điểm của $AC$, $BD$ (gt).
Xét $\triangle ACD$ có $M$ là trung điểm của $AD$ và $I$ là trung điểm của $AC$
nên $MI$ là đường trung bình của $\triangle ACD$.
Suy ra $MI\parallel CD$ và $MI=\dfrac{CD}{2}$ (tính chất đường trung bình). (1)
[[so-do:n2]]
Xét $\triangle ABD$ có $M$ là trung điểm của $AD$ và $K$ là trung điểm của $BD$
nên $MK$ là đường trung bình của $\triangle ABD$.
Suy ra $MK\parallel AB$ và $MK=\dfrac{AB}{2}$ (tính chất đường trung bình). (2)
[[so-do:n3]]
Vì $AB=CD$ (gt) nên từ (1) và (2) suy ra $MI=MK$.
(Nếu $M$, $I$, $K$ thẳng hàng thì từ (1), (2) ta có $AB\parallel IK\parallel CD$ và cả hai góc cần so sánh đều bằng $0^\circ$, kết luận hiển nhiên; xét tiếp trường hợp $M$, $I$, $K$ không thẳng hàng.)
Khi đó $\triangle MIK$ cân tại $M$ nên $\widehat{MIK}=\widehat{MKI}$ (hai góc ở đáy).
Hai góc này nhọn vì là hai góc ở đáy của tam giác cân.
[[so-do:n4]]
Vì $MK\parallel AB$ (cmt) nên góc nhọn giữa đường thẳng $IK$ và $AB$ bằng góc nhọn giữa $IK$ và $MK$, tức là $\widehat{MKI}$.
Vì $MI\parallel CD$ (cmt) nên góc nhọn giữa đường thẳng $IK$ và $CD$ bằng góc nhọn giữa $IK$ và $MI$, tức là $\widehat{MIK}$.
Mà $\widehat{MIK}=\widehat{MKI}$ (cmt).
Vậy đường thẳng $IK$ tạo với $AB$ và $CD$ những góc nhọn bằng nhau.
**hinh:** VHB1-17.png
**hinh_lg:** VHB1-17_lg.png
**nghi_van:** Đề không nói rõ "góc" là góc nào (sách vẽ E, F là giao của IK với AB, CD rồi so sánh một cặp góc so le); kho phát biểu bằng góc nhọn giữa hai đường thẳng để đúng với mọi vị trí. Đã kiểm số trên nhiều tứ giác lồi ngẫu nhiên có AB = CD. Giả thiết ngầm I ≠ K.

### VHB1-18 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 18@p072 (giải p181)
**sach:** E, F là trung điểm AC, BD; I là trung điểm A'C; EI ∥ AA' (đường trung bình) nên AA' đi qua trung điểm M của EF; tương tự các đường còn lại (sách viết rất tắt, không nói vì sao A', I, F thẳng hàng và A' là trung điểm IF).
**loai:** don
**loai_cau:** tu_luan
**noi_dung:**
Trong tứ giác $ABCD$, gọi $A'$, $B'$, $C'$, $D'$ thứ tự là trọng tâm của các tam giác $BCD$, $ACD$, $ABD$, $ABC$. Chứng minh rằng bốn đường thẳng $AA'$, $BB'$, $CC'$, $DD'$ đồng quy.
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $E$, $F$ là trung điểm của hai đường chéo $AC$, $BD$ và $M$ là trung điểm của $EF$; chứng minh cả bốn đường thẳng đi qua $M$. $A'$ nằm trên trung tuyến $CF$ của $\triangle BCD$ với $CA'=2A'F$; lấy $I$ là trung điểm của $CA'$ thì $EI\parallel AA'$ (đường trung bình) và $A'$ là trung điểm của $IF$, nên đường thẳng qua $A'$ song song $EI$ đi qua trung điểm $M$ của $EF$.

- n1 | - | $CI=IA'=A'F$ (với $I$ là trung điểm của $CA'$) | gt | $A'$ là trọng tâm $\triangle BCD$ nên nằm trên trung tuyến $CF$ và $CA'=2A'F$
- n2 | - | $EI\parallel AA'$ | n1 | $E$, $I$ là trung điểm $CA$, $CA'$, đường trung bình của $\triangle CAA'$
- n3 | - | $AA'$ đi qua trung điểm $M$ của $EF$ | n1, n2 | trong $\triangle FEI$, $A'$ là trung điểm $FI$ và $AA'\parallel EI$
- n4 | - | $BB'$, $CC'$, $DD'$ cũng đi qua $M$ | n3 | làm tương tự, đổi vai trò các đỉnh

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $E$, $F$ lần lượt là trung điểm của $AC$, $BD$ và $M$ là trung điểm của $EF$.
Vì $A'$ là trọng tâm của $\triangle BCD$ và $F$ là trung điểm của $BD$ nên $A'$ nằm trên trung tuyến $CF$ và $CA'=2A'F$ (tính chất trọng tâm).
Gọi $I$ là trung điểm của $CA'$. Khi đó $CI=IA'=\dfrac12CA'$.
Mà $A'F=\dfrac12CA'$ nên $CI=IA'=A'F$.
Do đó $C$, $I$, $A'$, $F$ nằm theo thứ tự trên đường thẳng $CF$ và $A'$ là trung điểm của $IF$.
[[so-do:n2]]
Xét $\triangle CAA'$ có $E$ là trung điểm của $CA$ và $I$ là trung điểm của $CA'$
nên $EI$ là đường trung bình của $\triangle CAA'$.
Suy ra $EI\parallel AA'$ (tính chất đường trung bình).
[[so-do:n3]]
Xét $\triangle FEI$ có $A'$ là trung điểm của $FI$ (cmt) và đường thẳng $AA'$ đi qua $A'$ song song với $EI$ (cmt)
nên $AA'$ đi qua trung điểm của $FE$ (đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba).
Vậy $AA'$ đi qua $M$.
[[so-do:n4]]
Với $BB'$, $CC'$, $DD'$ lập luận hoàn toàn tương tự, chỉ đổi vai trò như sau.
Với $CC'$: đổi $(A,C,E,F)$ thành $(C,A,E,F)$, tức dùng $C'$ là trọng tâm $\triangle ABD$ nằm trên trung tuyến $AF$, $I$ là trung điểm của $AC'$.
Với $BB'$: đổi $(A,C,E,F)$ thành $(B,D,F,E)$, tức dùng $B'$ là trọng tâm $\triangle ACD$ nằm trên trung tuyến $DE$, $I$ là trung điểm của $DB'$, đường trung bình $FI$ và trung điểm của $EF$ vẫn là $M$.
Với $DD'$: đổi $(A,C,E,F)$ thành $(D,B,F,E)$, tức dùng $D'$ là trọng tâm $\triangle ABC$ nằm trên trung tuyến $BE$, $I$ là trung điểm của $BD'$.
Trong cả ba trường hợp đường thẳng đó đi qua trung điểm của đoạn nối trung điểm hai đường chéo, chính là $M$.
Vậy bốn đường thẳng $AA'$, $BB'$, $CC'$, $DD'$ cùng đi qua $M$, tức là đồng quy.
**hinh:** VHB1-18.png
**hinh_lg:** VHB1-18_lg.png
**nghi_van:** Phần "tương tự" cho B', C', D' đã kiểm số: B' ∈ DE với DB' = 2B'E, C' ∈ AF với AC' = 2C'F, D' ∈ BE với BD' = 2D'E; cả bốn đường đồng quy tại trung điểm EF (60 tứ giác lồi ngẫu nhiên). Hình lời giải chỉ vẽ trường hợp của AA'.

### VHB1-19 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 19@p072 (giải p182)
**sach:** Ý a: MH là đường trung bình của △CBD nên MH ∥ BD, mà MH ⊥ EF nên BD ⊥ EF, BA ⊥ HD ⇒ E là trực tâm. Ý b: △DHG = △CHK (cạnh huyền – góc nhọn) ⇒ HG = HK, rồi △HGE = △HKF (g.c.g) ⇒ HE = HF. Kho thay cặp góc đối đỉnh bằng "góc nhọn giữa hai đường thẳng" để không phụ thuộc cấu hình.
**loai:** nhieu_y
**loi_dan:**
Cho tam giác nhọn $ABC$, trực tâm $H$, $M$ là trung điểm của $BC$. Qua $H$ kẻ đường thẳng vuông góc với $HM$, cắt $AB$ và $AC$ theo thứ tự ở $E$ và $F$.
**hinh:** VHB1-19.png
#### y a
**loai_cau:** tu_luan
**cau_hoi:** Trên tia đối của tia $HC$ lấy điểm $D$ sao cho $HD=HC$. Chứng minh rằng $E$ là trực tâm của tam giác $DBH$.
**da_biet:**
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** $H$ là trung điểm của $CD$ và $M$ là trung điểm của $CB$ nên $MH$ là đường trung bình của $\triangle CBD$, suy ra $MH\parallel BD$. Vì $EF\perp MH$ nên $HE\perp BD$ (đường cao từ $H$ của $\triangle DBH$). Đường cao thứ hai là $BE$ vì $AB\perp CH$.

- n1 | - | $MH\parallel BD$ | gt | $M$, $H$ là trung điểm $CB$, $CD$, đường trung bình của $\triangle CBD$
- n2 | - | $HE\perp BD$ | n1, gt | $EF\perp MH$ và $MH\parallel BD$
- n3 | - | $BE\perp HD$ | gt | $H$ là trực tâm $\triangle ABC$ nên $CH\perp AB$; $E\in AB$, $D\in CH$
- n4 | - | $E$ là trực tâm của $\triangle DBH$ | n2, n3 | $E$ là giao điểm của hai đường cao kẻ từ $H$ và từ $B$

**Phần 2. Trình bày**
[[so-do:n1]]
Vì $HD=HC$ và $D$ nằm trên tia đối của tia $HC$ nên $H$ là trung điểm của $CD$.
Xét $\triangle CBD$ có $M$ là trung điểm của $CB$ (gt) và $H$ là trung điểm của $CD$ (cmt)
nên $MH$ là đường trung bình của $\triangle CBD$.
Suy ra $MH\parallel BD$ (tính chất đường trung bình).
[[so-do:n2]]
Vì $EF\perp MH$ (gt) và $MH\parallel BD$ (cmt) nên $EF\perp BD$.
Đường thẳng $EF$ đi qua $H$ và $E$ nên $HE\perp BD$.
[[so-do:n3]]
Vì $H$ là trực tâm của $\triangle ABC$ nên $CH\perp AB$.
Mà $E\in AB$ và $D\in CH$ nên $BE\perp HD$.
[[so-do:n4]]
Xét $\triangle DBH$ có $BE\perp HD$ (cmt) và $HE\perp BD$ (cmt)
nên $BE$ và $HE$ là hai đường cao của tam giác, cắt nhau tại $E$.
Vậy $E$ là trực tâm của $\triangle DBH$.
**hinh_lg:** VHB1-19_a_lg.png
#### y b
**loai_cau:** tu_luan
**cau_hoi:** Chứng minh rằng $HE=HF$.
**da_biet:** Biết $D$ là điểm trên tia đối của tia $HC$ sao cho $HD=HC$ và $E$ là trực tâm của tam giác $DBH$ (ý a).
**loi_giai:**
**Sơ đồ tư duy**

**Mấu chốt:** Gọi $G$ là giao điểm của $DE$ với $BH$, $K$ là giao điểm của $BH$ với $AC$. Hai tam giác vuông $DHG$ và $CHK$ bằng nhau (cạnh huyền $HD=HC$, góc nhọn bằng nhau) cho $HG=HK$; rồi hai tam giác vuông $HGE$ và $HKF$ bằng nhau cho $HE=HF$.

- n1 | - | $DG\perp BH$ tại $G$, $CK\perp BH$ tại $K$ | gt | $E$ là trực tâm $\triangle DBH$ (ý a) và $H$ là trực tâm $\triangle ABC$
- n2 | - | $HG=HK$ | n1, gt | $\triangle DHG=\triangle CHK$ (cạnh huyền - góc nhọn)
- n3 | - | $\triangle HGE=\triangle HKF$ | n1, n2 | g.c.g: $\widehat{HGE}=\widehat{HKF}=90^\circ$, $HG=HK$, $\widehat{GHE}=\widehat{KHF}$
- n4 | - | $HE=HF$ | n3 | hai cạnh tương ứng của hai tam giác bằng nhau

**Phần 2. Trình bày**
[[so-do:n1]]
Gọi $G$ là giao điểm của $DE$ và $BH$, $K$ là giao điểm của $BH$ và $AC$.
Vì $E$ là trực tâm của $\triangle DBH$ (ý a) nên $DE\perp BH$ tại $G$.
Vì $H$ là trực tâm của $\triangle ABC$ nên $BH\perp AC$ tại $K$, tức $CK\perp BH$.
[[so-do:n2]]
Xét $\triangle DHG$ và $\triangle CHK$ vuông tại $G$ và $K$ có:
$HD=HC$ (gt);
$\widehat{DHG}=\widehat{CHK}$ (cùng bằng góc nhọn tạo bởi hai đường thẳng $CD$ và $BH$)
nên $\triangle DHG=\triangle CHK$ (cạnh huyền - góc nhọn).
Suy ra $HG=HK$.
[[so-do:n3]]
Vì $F\in AC$ và $K\in AC$ nên $FK\perp BH$, tức $\widehat{HKF}=90^\circ$.
Vì $E\in DE$ và $G\in DE$ nên $EG\perp BH$, tức $\widehat{HGE}=90^\circ$.
Xét $\triangle HGE$ và $\triangle HKF$ có:
$\widehat{HGE}=\widehat{HKF}=90^\circ$;
$HG=HK$ (cmt);
$\widehat{GHE}=\widehat{KHF}$ (cùng bằng góc nhọn tạo bởi hai đường thẳng $EF$ và $BH$)
nên $\triangle HGE=\triangle HKF$ (g.c.g).
[[so-do:n4]]
Suy ra $HE=HF$ (hai cạnh tương ứng).
Vậy $HE=HF$.
**hinh_lg:** VHB1-19_b_lg.png
**nghi_van:** Ý b của sách dùng cặp góc đối đỉnh; kho dùng "góc nhọn giữa hai đường thẳng" cho an toàn cấu hình. Đã kiểm số trên 300 tam giác nhọn ngẫu nhiên: DE ⊥ BH, H luôn là trung điểm của GK và nằm giữa E, F, HE = HF đều đúng.

### VHB1-20 → HH00161
**nguon:** Nâng cao và phát triển Toán 8 tập 1 – Vũ Hữu Bình · §2 BT 20@p072 (giải p182)
**sach:** OB là đường trung trực của AC (BA = BC, OA = OC) nên OH là đường trung bình của △ACD; lập hai biểu thức cho AH² qua Pythagore (△ABH, △AOH) rồi giải phương trình theo x = CD.
**loai:** don
**loai_cau:** tra_loi_ngan
**dap_an:** 7
**noi_dung:**
Tứ giác $ABCD$ có $B$ và $C$ nằm trên đường tròn đường kính $AD$. Tính độ dài $CD$, biết rằng $AD=8$ và $AB=BC=2$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** gọi $O$ là tâm đường tròn (trung điểm $AD$) thì $OA=OB=OC=4$; $OB$ là đường trung trực của $AC$ nên giao điểm $H$ của $OB$ và $AC$ là trung điểm $AC$, từ đó $OH$ là đường trung bình của $\triangle ACD$ và $OH=\dfrac{CD}{2}$. Tính $AH^2$ bằng Pythagore theo hai cách rồi lập phương trình ẩn $CD$.
**Bước 1.** Đặt $CD=x$. Vì $B$, $C$ thuộc đường tròn đường kính $AD$ nên tâm là trung điểm $O$ của $AD$ và $OA=OB=OC=OD=4$.
**Bước 2.** $B$ và $O$ cùng cách đều hai đầu $A$, $C$ của đoạn $AC$ ($BA=BC$, $OA=OC$) nên $OB$ là đường trung trực của $AC$: $OB\perp AC$ tại trung điểm $H$ của $AC$.
**Bước 3.** Trong $\triangle ACD$, $O$ và $H$ là trung điểm của $AD$ và $AC$ nên $OH=\dfrac x2$; do $H$ nằm giữa $O$ và $B$ nên $BH=OB-OH=4-\dfrac x2$.
**Bước 4.** $AH$ là cạnh chung của hai tam giác vuông $ABH$ và $AOH$: viết $AH^2$ theo $AB$, $BH$ và theo $OA$, $OH$ rồi cho hai biểu thức bằng nhau, thu được phương trình bậc nhất ẩn $x$.
**Chú ý:** phải chỉ ra $H$ nằm giữa $O$ và $B$, nếu không dễ nhầm thành $BH=4+\dfrac x2$.

**Phần 2. Trình bày**
Gọi $O$ là trung điểm của $AD$; vì $B$, $C$ thuộc đường tròn đường kính $AD$ nên $O$ là tâm và $OA=OB=OC=\dfrac{AD}{2}=4$.
Ta có $BA=BC$ ($=2$) và $OA=OC$ ($=4$) nên $B$ và $O$ cùng nằm trên đường trung trực của $AC$.
Do đó $OB$ là đường trung trực của $AC$.
Gọi $H$ là giao điểm của $OB$ và $AC$, suy ra $OB\perp AC$ tại $H$ và $H$ là trung điểm của $AC$.
Đặt $CD=x$.
Xét $\triangle ACD$ có $O$ là trung điểm của $AD$ và $H$ là trung điểm của $AC$
nên $OH$ là đường trung bình của $\triangle ACD$.
Suy ra $OH=\dfrac{CD}{2}=\dfrac x2$ (tính chất đường trung bình).
Vì $ABCD$ là tứ giác nên $A$, $B$, $C$, $D$ nằm theo thứ tự trên cùng một nửa đường tròn.
Do đó $B$ thuộc cung nhỏ $AC$, tia $OB$ nằm trong góc $AOC$ và cắt đoạn $AC$ tại $H$.
Vì $H$ nằm trong đường tròn nên $OH<OB$, suy ra $H$ nằm giữa $O$ và $B$.
Vậy $BH=OB-OH=4-\dfrac x2$.
Xét $\triangle ABH$ vuông tại $H$ có $AH^2=AB^2-BH^2=4-\left(4-\dfrac x2\right)^2$ (định lí Pythagore).
Xét $\triangle AOH$ vuông tại $H$ có $AH^2=OA^2-OH^2=16-\dfrac{x^2}{4}$ (định lí Pythagore).
Suy ra $4-\left(4-\dfrac x2\right)^2=16-\dfrac{x^2}{4}$.
Khai triển: $4-16+4x-\dfrac{x^2}{4}=16-\dfrac{x^2}{4}$.
Rút gọn: $4x-12=16$, suy ra $x=7$.
Vậy $CD=7$.
**hinh:** VHB1-20.png
**hinh_lg:** VHB1-20_lg.png
**nghi_van:** Đề không nói thứ tự điểm trên đường tròn; vì ABCD là tứ giác (không tự cắt) nên buộc B, C cùng phía AD và theo thứ tự A, B, C, D, đã dùng ở lời giải. Đã kiểm số: CD = 8cosθ = 7 với sin(θ/2) = 1/4.
