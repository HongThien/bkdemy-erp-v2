### TL1a → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, điểm $D$ thuộc cạnh $AB$, điểm $E$ thuộc cạnh $AC$ sao cho $DE\parallel BC$.
Điền vào chỗ trống:
$\dfrac{AD}{AB}=\ldots$ ; $\dfrac{AB}{DB}=\ldots$
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có $DE\parallel BC$ nên dùng định lí Thalès; hai tỉ số bằng nhau phải "cùng kiểu" trên hai cạnh $AB$ và $AC$.

**Bước 1.** Nhận ra $DE\parallel BC$ với $D\in AB$, $E\in AC$ nên áp dụng được định lí Thalès cho tam giác $ABC$.

**Bước 2.** Ô thứ nhất là $\dfrac{AD}{AB}$ (đoạn từ đỉnh $A$ tới điểm chia, chia cho cả cạnh); tỉ số cùng kiểu trên cạnh $AC$ là $\dfrac{AE}{AC}$.

**Bước 3.** Ô thứ hai là $\dfrac{AB}{DB}$ (cả cạnh chia cho đoạn còn lại); viết tỉ số cùng kiểu $\dfrac{DB}{AB}=\dfrac{EC}{AC}$ rồi đảo ngược cả hai vế.

**Chú ý:** Không ghép chéo kiểu $\dfrac{AD}{AB}=\dfrac{EC}{AC}$; đoạn trên hai cạnh phải cùng vị trí (cùng gần đỉnh $A$ hoặc cùng gần đáy).

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $DE\parallel BC$ (gt), $D\in AB$, $E\in AC$.
Theo định lí Thalès:
$\dfrac{AD}{AB}=\dfrac{AE}{AC}$ (định lí Thalès);
$\dfrac{DB}{AB}=\dfrac{EC}{AC}$ (định lí Thalès).
Đảo ngược hai vế của đẳng thức thứ hai, ta có $\dfrac{AB}{DB}=\dfrac{AC}{EC}$.
Vậy $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ ; $\dfrac{AB}{DB}=\dfrac{AC}{EC}$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$, $A$ ở trên, $D\in AB$, $E\in AC$ cùng tỉ lệ 0,45 từ $A$ nên $DE\parallel BC$ dựng đúng; không ghi số, không đánh dấu đáp án. Đề đã chuyển "điền chỗ trống" thành câu hoàn chỉnh (không chữ in sai). Đáp án chính $\dfrac{AE}{AC}$ ; $\dfrac{AC}{EC}$. Verify: `kiem_G1.mjs` (3 tam giác × 3 tỉ lệ) PASS. Chỉ dùng Thalès + đảo tỉ lệ thức (lớp 7), không công cụ ngoài whitelist.
**hinh:** TL1a.png

### TL1b → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$; điểm $D$ thuộc cạnh $AB$, điểm $E$ thuộc cạnh $AC$, điểm $F$ thuộc cạnh $BC$ sao cho $DE\parallel BC$ và $EF\parallel AB$.
Điền vào chỗ trống:
$\dfrac{AD}{AB}=\ldots$ ; $\dfrac{AB}{DB}=\ldots$
$\dfrac{CE}{AE}=\ldots$ ; $\dfrac{BF}{BC}=\ldots$
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hình có hai đường song song, mỗi đường là một "đỉnh" Thalès riêng: $DE\parallel BC$ ứng với đỉnh $A$, còn $EF\parallel AB$ ứng với đỉnh $C$.

**Bước 1.** Gọi tên hai đường song song và đỉnh chung của mỗi cái: $DE\parallel BC$ cắt $AB$, $AC$ tại $D$, $E$ (đỉnh $A$); $EF\parallel AB$ cắt $CA$, $CB$ tại $E$, $F$ (đỉnh $C$).

**Bước 2.** Hai ô đầu dùng đỉnh $A$: lấy $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ cho ô một; ô hai viết $\dfrac{DB}{AB}=\dfrac{EC}{AC}$ rồi đảo ngược hai vế.

**Bước 3.** Ô ba là $\dfrac{CE}{AE}$ (đoạn từ đỉnh $C$ tới điểm chia, chia cho đoạn còn lại); dùng đỉnh $C$ với $EF\parallel AB$ để viết tỉ số cùng kiểu trên cạnh $CB$ là $\dfrac{CF}{BF}$.

**Bước 4.** Ô bốn là $\dfrac{BF}{BC}$ (đoạn còn lại chia cho cả cạnh, tính từ phía $B$); tỉ số cùng kiểu trên cạnh $CA$ là $\dfrac{AE}{AC}$, trùng với tỉ số ở ô một.

**Chú ý:** Khi dùng $EF\parallel AB$ phải lấy đỉnh $C$, không phải đỉnh $A$; các tỉ số ở ô một và ô bốn cùng bằng $\dfrac{AE}{AC}$.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $DE\parallel BC$ (gt), $D\in AB$, $E\in AC$:
$\dfrac{AD}{AB}=\dfrac{AE}{AC}$ (định lí Thalès);
$\dfrac{DB}{AB}=\dfrac{EC}{AC}$ (định lí Thalès)
nên $\dfrac{AB}{DB}=\dfrac{AC}{EC}$ (đảo ngược hai vế).
Xét $\triangle ABC$ có $EF\parallel AB$ (gt), $E\in CA$, $F\in CB$:
$\dfrac{CE}{AE}=\dfrac{CF}{BF}$ (định lí Thalès);
$\dfrac{BF}{BC}=\dfrac{AE}{AC}$ (định lí Thalès).
Mà $\dfrac{AE}{AC}=\dfrac{AD}{AB}$ (cmt) nên $\dfrac{BF}{BC}=\dfrac{AD}{AB}$.
Vậy $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ ; $\dfrac{AB}{DB}=\dfrac{AC}{EC}$ ; $\dfrac{CE}{AE}=\dfrac{CF}{BF}$ ; $\dfrac{BF}{BC}=\dfrac{AE}{AC}$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$, $A$ ở trên, $DE\parallel BC$ ngang (D, E ở tỉ lệ 0,6 từ $A$), $F\in BC$ dựng sao cho $CF/CB=CE/CA$ nên $EF\parallel AB$ đúng; không ghi đáp án. Đáp án chính: $\dfrac{AE}{AC}$ ; $\dfrac{AC}{EC}$ ; $\dfrac{CF}{BF}$ ; $\dfrac{AE}{AC}$ (ô bốn cũng bằng $\dfrac{AD}{AB}$, đã ghi trong Phần 2). Verify: `kiem_G1.mjs` PASS (kể cả BDEF là hình bình hành, chỉ để kiểm, KHÔNG dùng trong lời giải). Chỉ dùng Thalès (kể cả dạng "$\dfrac{BD}{AB}=\dfrac{EC}{AC}$" áp vào đỉnh $C$), không công cụ ngoài whitelist.
**hinh:** TL1b.png

### TL2.1a → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 6
**noi_dung:**
Cho tam giác $ABC$, điểm $E$ thuộc cạnh $AB$, điểm $F$ thuộc cạnh $AC$ sao cho $EF\parallel BC$.
Biết $AE=4$, $EB=8$, $CF=12$.
Tính $x=AF$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** $EF\parallel BC$ nên các đoạn trên $AB$ và $AC$ tỉ lệ với nhau; chọn tỉ lệ thức chứa $AE$, $EB$, $CF$ và $x$.

**Bước 1.** Nhận ra $EF\parallel BC$ với $E\in AB$, $F\in AC$ nên dùng được định lí Thalès, dù hình đặt đỉnh $A$ ở dưới.

**Bước 2.** Lập tỉ lệ thức giữa các đoạn của hai cạnh: $\dfrac{AE}{EB}=\dfrac{AF}{FC}$, trong đó chỉ $AF=x$ chưa biết.

**Bước 3.** Thay số vào tỉ lệ thức rồi tìm $x$ bằng cách nhân chéo.

**Chú ý:** Đoạn cần tìm $AF$ nằm cùng vị trí với $AE$ (kề đỉnh $A$), nên ghép $AE$ với $AF$ và $EB$ với $FC$, không đổi chỗ.

**Phần 2. Trình bày**
Xét $\triangle ABC$ có $EF\parallel BC$ (gt), $E\in AB$, $F\in AC$
nên $\dfrac{AE}{EB}=\dfrac{AF}{FC}$ (định lí Thalès).
Thay số: $\dfrac{4}{8}=\dfrac{x}{12}$ (gt).
Suy ra $x=\dfrac{4\cdot12}{8}=6$.
Vậy $AF=6$.
**cấu hình hình / nghi vấn:**
Hình "ngược" như ảnh gốc: $B$, $C$ ở trên, $A$ ở dưới; $E$, $F$ chia $AB$, $AC$ theo tỉ lệ 1/3 từ $A$ (vì $AE:EB=4:8$ và $AF:FC=6:12$) nên $EF\parallel BC$ dựng đúng. Ghi 4, 8, 12 và $x$ (không ghi 6). Verify: `kiem_G1.mjs` PASS (dựng $AB=12$, $AC=18$: $AF=6$, $CF=12$, $EF\parallel BC$). Không công cụ ngoài whitelist.
**hinh:** TL2-1a.png

### TL2.1b → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 6,8
**noi_dung:**
Cho tam giác $ABC$ vuông tại $A$, điểm $D$ thuộc cạnh $BC$, điểm $E$ thuộc cạnh $AC$ sao cho $DE\perp AC$.
Biết $CD=5$, $DB=3{,}5$, $CE=4$.
Tính $y=CA$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề chưa cho đường song song; $DE\perp AC$ và $AB\perp AC$ chính là chỗ để suy ra $DE\parallel AB$, rồi mới dùng Thalès.

**Bước 1.** Chứng minh $DE\parallel AB$: hai đường thẳng $DE$ và $AB$ cùng vuông góc với $AC$ ($AB\perp AC$ vì tam giác vuông tại $A$).

**Bước 2.** Tính cạnh $CB$ từ hai đoạn đã cho: $D$ nằm giữa $C$ và $B$ nên $CB=CD+DB$.

**Bước 3.** Với $DE\parallel AB$ trong tam giác $CAB$, lập tỉ lệ thức đỉnh $C$ chứa $CD$, $CB$, $CE$ và $y=CA$.

**Bước 4.** Thay số vào tỉ lệ thức rồi tìm $y$ bằng cách nhân chéo.

**Chú ý:** Đỉnh chung ở đây là $C$ (không phải $A$); tỉ lệ thức dùng cả cạnh $CB$, $CA$ chứ không dùng $DB$, vì $y$ là cả cạnh $CA$.

**Phần 2. Trình bày**
Vì $DE\perp AC$ (gt)
và $AB\perp AC$ (gt: $\triangle ABC$ vuông tại $A$)
nên $DE\parallel AB$ (cùng vuông góc với $AC$).
Vì $D$ thuộc cạnh $BC$ (gt) nên $CB=CD+DB=5+3{,}5=8{,}5$.
Xét $\triangle ABC$ có $DE\parallel AB$ (cmt), $D\in CB$, $E\in CA$
nên $\dfrac{CD}{CB}=\dfrac{CE}{CA}$ (định lí Thalès).
Thay số: $\dfrac{5}{8{,}5}=\dfrac{4}{y}$.
Suy ra $y=\dfrac{4\cdot8{,}5}{5}=6{,}8$.
Vậy $CA=6{,}8$.
**cấu hình hình / nghi vấn:**
Hình như ảnh gốc: $A$ ở dưới phải, $AC$ thẳng đứng, $B$ bên trái cùng độ cao $A$, $C$ ở trên; $D\in BC$, $E\in AC$ với $DE$ nằm ngang; ô vuông ở $A$ và $E$; mũi tên $y$ dọc $AC$. Dựng đúng tỉ lệ theo đáp số ($AC=6{,}8$, $CB=8{,}5$, $AB=5{,}1$ chỉ dùng để dựng hình). Ghi 5, 3,5, 4 và $y$ (không ghi 6,8). Verify: `kiem_G1.mjs` PASS ($\cos C=4/5$ duy nhất; $CD=5$, $DB=3{,}5$, $CE=4$, $DE\perp AC$, $DE\parallel AB$). Không dùng Pythagore/lượng giác trong lời giải (chúng chỉ nằm trong script dựng hình). Dữ kiện "$DE\perp AC$" lấy từ ô vuông trên hình.
**hinh:** TL2-1b.png

### TL2.2 → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 2
**noi_dung:**
Cho tam giác $ABC$, điểm $M$ thuộc cạnh $AB$, điểm $N$ thuộc cạnh $AC$ sao cho $MN\parallel BC$.
Biết $AM=3$, $AN=4{,}5$, $AC=7{,}5$.
Tính $x=MB$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho $AC$ nguyên cạnh nhưng $AN$ chỉ là một phần; phải tách ra đoạn còn lại $NC$ mới ghép được với $MB$ trong định lí Thalès.

**Bước 1.** Nhận ra $MN\parallel BC$ với $M\in AB$, $N\in AC$ nên dùng được định lí Thalès cho tam giác $ABC$.

**Bước 2.** Tính đoạn còn lại $NC$ từ $AC$ và $AN$ (vì $N$ nằm giữa $A$ và $C$).

**Bước 3.** Lập tỉ lệ thức $\dfrac{AM}{MB}=\dfrac{AN}{NC}$, trong đó chỉ $MB=x$ chưa biết.

**Bước 4.** Thay số rồi tìm $x$ bằng cách nhân chéo.

**Chú ý:** Có thể thay bằng cách tìm $AB$ trước từ $\dfrac{AM}{AB}=\dfrac{AN}{AC}$ rồi lấy $MB=AB-AM$; kết quả như nhau.

**Phần 2. Trình bày**
Vì $N$ thuộc cạnh $AC$ (gt) nên $NC=AC-AN=7{,}5-4{,}5=3$.
Xét $\triangle ABC$ có $MN\parallel BC$ (gt), $M\in AB$, $N\in AC$
nên $\dfrac{AM}{MB}=\dfrac{AN}{NC}$ (định lí Thalès).
Thay số: $\dfrac{3}{x}=\dfrac{4{,}5}{3}$.
Suy ra $x=\dfrac{3\cdot3}{4{,}5}=2$.
Vậy $MB=2$.
**cấu hình hình / nghi vấn:**
Hình như ảnh gốc: $A$ ở trên, $BC$ đáy; $M\in AB$, $N\in AC$ ở tỉ lệ 3/5 từ $A$ ($AM:AB=AN:AC=3:5$, đã dựng đúng $AC=1{,}5\cdot AB$); cung đứt nét từ $A$ tới $C$ ghi 7,5. Ghi 3, $x$, 4,5, 7,5 (không ghi 2). Ảnh gốc có hai cung đánh dấu góc đồng vị tại $N$ và $C$ (để chỉ $MN\parallel BC$), không vẽ lại vì đề đã ghi $MN\parallel BC$. Verify: `kiem_G1.mjs` PASS (3 tam giác). Không công cụ ngoài whitelist.
**hinh:** TL2-2.png

### TL2.3 → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 6
**noi_dung:**
Cho tam giác $ABC$, điểm $N$ thuộc cạnh $AB$, điểm $M$ thuộc cạnh $AC$, điểm $P$ thuộc cạnh $BC$ sao cho $MP\parallel AB$ và $MN\parallel BC$.
Biết $AN=5$, $MP=3$, $MC=3{,}6$.
Tính $x=AM$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề không cho $NB$ nhưng cho $MP$; $NBPM$ là hình bình hành nên $NB=MP$, từ đó dùng Thalès với $AN$, $NB$, $AM$, $MC$.

**Bước 1.** Nhận ra tứ giác $NBPM$ có hai cặp cạnh đối song song: $MN\parallel BP$ (vì $MN\parallel BC$) và $MP\parallel NB$ (vì $MP\parallel AB$), nên là hình bình hành.

**Bước 2.** Từ hình bình hành suy ra hai cạnh đối bằng nhau: $NB=MP$, nên biết ngay đoạn $NB$.

**Bước 3.** Lập tỉ lệ thức Thalès cho tam giác $ABC$ với $MN\parallel BC$: $\dfrac{AN}{NB}=\dfrac{AM}{MC}$, trong đó chỉ $AM=x$ chưa biết.

**Bước 4.** Thay số rồi tìm $x$ bằng cách nhân chéo.

**Chú ý:** Không được dùng ngay tỉ số $\dfrac{AN}{AB}$ vì chưa biết $AB$; $NB$ chỉ có được qua hình bình hành $NBPM$.

**Phần 2. Trình bày**
Xét tứ giác $NBPM$ có:
$MN\parallel BP$ (vì $MN\parallel BC$ (gt), $P\in BC$);
$MP\parallel NB$ (vì $MP\parallel AB$ (gt), $N\in AB$).
Do đó $NBPM$ là hình bình hành (dấu hiệu nhận biết hình bình hành).
Suy ra $NB=MP=3$ (tính chất hình bình hành).
Xét $\triangle ABC$ có $MN\parallel BC$ (gt), $N\in AB$, $M\in AC$
nên $\dfrac{AN}{NB}=\dfrac{AM}{MC}$ (định lí Thalès).
Thay số: $\dfrac{5}{3}=\dfrac{x}{3{,}6}$.
Suy ra $x=\dfrac{5\cdot3{,}6}{3}=6$.
Vậy $AM=6$.
**cấu hình hình / nghi vấn:**
Hình như ảnh gốc: $A$ ở trên, $B$ bên trái đáy, $C$ bên phải, $P$ trên $BC$, $N\in AB$, $M\in AC$; dựng $N$, $M$ ở tỉ lệ 5/8 từ $A$ (nên $MN\parallel BC$), $P$ với $CP/CB=3/8$ (nên $MP\parallel AB$). Ghi 5, $x$, 3,6, 3 (không ghi 6). Đề nhất quán: $MP=AB\cdot CM/CA=8\cdot3{,}6/9{,}6=3$ (đã kiểm máy, chỉ để kiểm đề, không dùng trong lời giải). Verify: `kiem_G1.mjs` PASS ($NBPM$ là hình bình hành, $NB=3$, $AB=8$, $AM=6$, 3 tam giác). Không công cụ ngoài whitelist.
**hinh:** TL2-3.png
