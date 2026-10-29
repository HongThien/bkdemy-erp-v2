### VN2 → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 200
**noi_dung:**
Để đo khoảng cách giữa hai điểm $A$ và $C$ (không thể đo trực tiếp vì có hồ nước ở giữa), người ta xác định các điểm $B$, $D$, $I$ như hình vẽ.
Cho biết $C$ nằm giữa $A$ và $I$, $D$ nằm giữa $B$ và $I$, $AB\parallel CD$.
Sau đó đo được $IC=300$ m, $ID=450$ m, $BD=300$ m.
Hỏi khoảng cách giữa hai điểm $A$ và $C$ là bao nhiêu mét?
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $C$, $D$ nằm trên hai cạnh $IA$, $IB$ và $CD\parallel AB$, nên dùng định lí Thalès cho $\triangle IAB$ (đỉnh chung $I$).

**Bước 1.** Nhận ra $\triangle IAB$ có $C\in IA$, $D\in IB$ và $CD\parallel AB$.

**Bước 2.** Viết tỉ lệ thức chứa đoạn cần tìm: $\dfrac{IC}{CA}=\dfrac{ID}{DB}$.

**Bước 3.** Thay $IC=300$, $ID=450$, $DB=300$ rồi tính $CA$.

**Bước 4.** Kiểm tra lại bằng tỉ số cùng kiểu trên hai cạnh (cả cạnh): $\dfrac{IC}{IA}=\dfrac{ID}{IB}$.

**Chú ý:** $IC$ và $CA$ là hai phần của cạnh $IA$, không phải cả cạnh. Đừng nhầm $\dfrac{IC}{CA}$ với $\dfrac{IC}{IA}$.

**Phần 2. Trình bày**
Xét $\triangle IAB$ có:
$C\in IA$, $D\in IB$ (gt);
$CD\parallel AB$ (gt)
nên $\dfrac{IC}{CA}=\dfrac{ID}{DB}$ (định lí Thalès).
Thay số: $\dfrac{300}{CA}=\dfrac{450}{300}$.
Suy ra $CA=\dfrac{300\cdot300}{450}=200$ (m).
Vậy khoảng cách $AC=200$ m.
**cấu hình hình / nghi vấn:**
Hình dựng đúng tỉ lệ: $I$ là đỉnh dưới phải, $B$ trái, $A$ trên; $C\in IA$ với $IC/IA=0{,}6$, $D\in IB$ với $ID/IB=0{,}6$ nên $CD\parallel AB$ đúng; hồ nước vẽ bầu dục xanh nhạt chắn đoạn $AC$ (như ảnh gốc, ảnh gốc không ghi số đo nên hình cũng không ghi). Không vẽ sẵn đáp án.
Verify (kiem_G3.mjs): 2 bộ toạ độ, kiểm $CD\parallel AB$, $IA=500$, $AC=200$, $IC/CA=ID/DB$ — PASS hết.
Chỉ dùng định lí Thalès (trong whitelist). Không có nghi vấn.
**hinh:** VN2.png

### VN3 → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 80,8
**noi_dung:**
Để đo chiều rộng $AB$ của một khúc sông, người ta dựng các điểm $A$, $B$, $C$, $D$, $E$ như hình vẽ.
Cho biết ba điểm $C$, $B$, $A$ thẳng hàng ($B$ nằm giữa $C$ và $A$), ba điểm $C$, $D$, $E$ thẳng hàng ($D$ nằm giữa $C$ và $E$) và $BD\parallel AE$.
Đo được $CB=38$ m, $CD=32$ m, $CE=100$ m.
Tính chiều rộng $AB$ của khúc sông (làm tròn đến chữ số thập phân thứ nhất, đơn vị mét).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $B\in CA$, $D\in CE$ và $BD\parallel AE$, nên dùng định lí Thalès cho $\triangle CAE$ (đỉnh chung $C$) để tìm $CA$, rồi trừ $CB$ để được $AB$.

**Bước 1.** Nhận ra $\triangle CAE$ có $B\in CA$, $D\in CE$ và $BD\parallel AE$.

**Bước 2.** Viết tỉ lệ thức cho hai đoạn tính từ đỉnh $C$: $\dfrac{CB}{CA}=\dfrac{CD}{CE}$.

**Bước 3.** Thay $CB=38$, $CD=32$, $CE=100$ rồi tính $CA$.

**Bước 4.** $B$ nằm giữa $C$ và $A$ nên $AB=CA-CB$. Làm tròn đến hàng phần mười.

**Chú ý:** $CA$ là cả đoạn từ $C$ đến $A$, chưa phải chiều rộng sông $AB$. Chỉ làm tròn ở kết quả cuối, không làm tròn $CA$ trước.

**Phần 2. Trình bày**
Xét $\triangle CAE$ có:
$B\in CA$, $D\in CE$ (gt);
$BD\parallel AE$ (gt)
nên $\dfrac{CB}{CA}=\dfrac{CD}{CE}$ (định lí Thalès).
Thay số: $\dfrac{38}{CA}=\dfrac{32}{100}$.
Suy ra $CA=\dfrac{38\cdot100}{32}=118{,}75$ (m).
Vì $B$ nằm giữa $C$ và $A$ (gt)
nên $AB=CA-CB=118{,}75-38=80{,}75$ (m).
Làm tròn: $AB\approx80{,}8$ m.
Vậy chiều rộng khúc sông là khoảng $80{,}8$ m.
**cấu hình hình / nghi vấn:**
Hình theo ảnh gốc: hai bờ sông là hai đường nằm ngang, $A$ ở bờ trên, $B$, $E$ ở bờ dưới, $AB$ thẳng đứng nên $C$ nằm dưới bờ dưới trên đường thẳng $AB$; $D$ trên $CE$, nét $BD$ và $AE$ song song. Hình dựng đúng tỉ lệ ($CB=38$, $CD=32$, $CE=100$, $AB=80{,}75$, $BE\perp AB$ theo hình — dữ kiện này đề không nêu và lời giải KHÔNG dùng). Ghi sẵn 38 m, 32 m, 100 m như ảnh gốc; không ghi $AB$ (là đáp án).
Verify (kiem_G3.mjs): $CE=100$, $CD=32$, $BD\parallel AE$, $CA=118{,}75$, $AB=80{,}75\to80{,}8$ và thử thêm 3 vị trí $E$ khác (góc khác nhau) — PASS hết.
Chỉ dùng định lí Thalès (trong whitelist). Không có nghi vấn.
**hinh:** VN3.png

### VN4 → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$, lấy điểm $M$ thuộc cạnh $AB$ ($M$ khác $A$ và $B$).
Đường thẳng qua $M$ song song với $BC$ cắt $AC$ tại $N$.
Đường thẳng qua $N$ song song với $AB$ cắt $BC$ tại $P$.
a) Tứ giác $BMNP$ là hình gì?
b) Chứng minh $\dfrac{AM}{AB}=\dfrac{AN}{AC}=\dfrac{MN}{BC}$.
c) Chứng minh $\dfrac{MB}{AB}=\dfrac{CP}{BC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $BMNP$ là hình bình hành
$\Uparrow$ (dấu hiệu nhận biết hình bình hành)
$MN\parallel BP$ (vì $MN\parallel BC$, $P\in BC$) ✓
$NP\parallel BM$ (vì $NP\parallel AB$, $M\in AB$) ✓

b) $\dfrac{AM}{AB}=\dfrac{AN}{AC}=\dfrac{MN}{BC}$
$\Uparrow$ (chứng minh lần lượt hai đẳng thức)
$\dfrac{AM}{AB}=\dfrac{AN}{AC}$ · $\dfrac{AN}{AC}=\dfrac{MN}{BC}$
**Nhánh ①:** $\dfrac{AM}{AB}=\dfrac{AN}{AC}$
$\Uparrow$ (định lí Thalès cho $\triangle ABC$)
$MN\parallel BC$ ✓ (gt)
**Nhánh ②:** $\dfrac{AN}{AC}=\dfrac{MN}{BC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{BP}{BC}$)
$\dfrac{AN}{AC}=\dfrac{BP}{BC}$ · $\dfrac{BP}{BC}=\dfrac{MN}{BC}$
**Nhánh ②.1:** $\dfrac{AN}{AC}=\dfrac{BP}{BC}$
$\Uparrow$ (định lí Thalès cho $\triangle CAB$ có $N\in CA$, $P\in CB$)
$NP\parallel AB$ ✓ (gt)
**Nhánh ②.2:** $\dfrac{BP}{BC}=\dfrac{MN}{BC}$
$\Uparrow$ (hai phân số cùng mẫu)
$BP=MN$
$\Uparrow$ (hai cạnh đối của hình bình hành)
$BMNP$ là hình bình hành (câu a) ✓

c) $\dfrac{MB}{AB}=\dfrac{CP}{BC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{CN}{AC}$)
$\dfrac{MB}{AB}=\dfrac{CN}{AC}$ · $\dfrac{CN}{AC}=\dfrac{CP}{BC}$
**Nhánh ①:** $\dfrac{MB}{AB}=\dfrac{CN}{AC}$
$\Uparrow$ (định lí Thalès cho $\triangle ABC$)
$MN\parallel BC$ ✓ (gt)
**Nhánh ②:** $\dfrac{CN}{AC}=\dfrac{CP}{BC}$
$\Uparrow$ (định lí Thalès cho $\triangle CAB$ có $N\in CA$, $P\in CB$)
$NP\parallel AB$ ✓ (gt)

**Phần 2. Trình bày**
a) Vì $MN\parallel BC$ (gt) và $P\in BC$
nên $MN\parallel BP$.
Vì $NP\parallel AB$ (gt) và $M\in AB$
nên $NP\parallel BM$.
Xét tứ giác $BMNP$ có:
$MN\parallel BP$ (cmt);
$NP\parallel BM$ (cmt)
nên $BMNP$ là hình bình hành (dấu hiệu nhận biết hình bình hành).
Vậy tứ giác $BMNP$ là hình bình hành.

b) Xét $\triangle ABC$ có $M\in AB$, $N\in AC$
và $MN\parallel BC$ (gt)
nên $\dfrac{AM}{AB}=\dfrac{AN}{AC}$ (định lí Thalès). (1)
Xét $\triangle CAB$ có $N\in CA$, $P\in CB$
và $NP\parallel AB$ (gt)
nên $\dfrac{AN}{AC}=\dfrac{BP}{BC}$ (định lí Thalès). (2)
Vì $BMNP$ là hình bình hành (câu a)
nên $BP=MN$ (hai cạnh đối của hình bình hành).
Do đó $\dfrac{BP}{BC}=\dfrac{MN}{BC}$. (3)
Từ (2) và (3) suy ra $\dfrac{AN}{AC}=\dfrac{MN}{BC}$. (4)
Từ (1) và (4) suy ra $\dfrac{AM}{AB}=\dfrac{AN}{AC}=\dfrac{MN}{BC}$.

c) Xét $\triangle ABC$ có $MN\parallel BC$ (gt)
nên $\dfrac{MB}{AB}=\dfrac{CN}{AC}$ (định lí Thalès). (5)
Xét $\triangle CAB$ có $N\in CA$, $P\in CB$
và $NP\parallel AB$ (gt)
nên $\dfrac{CN}{CA}=\dfrac{CP}{CB}$ (định lí Thalès). (6)
Từ (5) và (6) suy ra $\dfrac{MB}{AB}=\dfrac{CP}{BC}$.
**cấu hình hình / nghi vấn:**
Hình: $\triangle ABC$ không cân ($A$ đỉnh trên, hơi lệch trái), $M\in AB$ với $AM/AB=0{,}4$, $MN\parallel BC$ ($N\in AC$), $NP\parallel AB$ ($P\in BC$) dựng đúng bằng toạ độ. Không đánh dấu gì thêm (câu a hỏi hình gì nên không vẽ ký hiệu song song/bằng nhau).
Verify (kiem_G3.mjs): 6 bộ toạ độ ngẫu nhiên (tam giác bất kì, $t$ ngẫu nhiên): song song, $BMNP$ có cạnh đối song song và bằng nhau, $AM/AB=AN/AC=MN/BC$, $AN/AC=BP/BC$, $BP=MN$, $MB/AB=CN/AC$, $CN/CA=CP/CB$, $MB/AB=CP/BC$ — PASS hết.
Ý b) chứng minh $\dfrac{AN}{AC}=\dfrac{MN}{BC}$ bằng cách tận dụng hình bình hành ở ý a) (đúng gợi ý của tài liệu), không dùng đồng dạng/hệ quả Thalès chưa học. Chỉ dùng: Thalès, dấu hiệu và tính chất hình bình hành (whitelist). Không có nghi vấn.
**hinh:** VN4.png

### VN5 → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $MNP$ có trung tuyến $MA$. Gọi $G$ là trọng tâm tam giác $MNP$.
Qua $G$ kẻ đường thẳng bất kì cắt $MN$, $MP$ tại $B$ và $C$.
Qua $N$ và $P$ kẻ các đường thẳng song song với $BC$, cắt $MA$ lần lượt tại $E$ và $F$.
Chứng minh $\dfrac{MC}{MP}=\dfrac{MG}{MF}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$\dfrac{MC}{MP}=\dfrac{MG}{MF}$
$\Uparrow$ (định lí Thalès cho $\triangle MPF$ có $C\in MP$, $G\in MF$)
$C\in MP$ ✓ (gt) · $G\in MF$ ✓ ($G$ thuộc trung tuyến $MA$, $F$ thuộc $MA$) · $CG\parallel PF$
**Nhánh ①:** $CG\parallel PF$
$\Uparrow$ ($C$, $G$ thuộc đường thẳng $BC$)
$PF\parallel BC$ ✓ (gt)

**Phần 2. Trình bày**
Vì $PF\parallel BC$ (gt)
mà $C$, $G$ thuộc đường thẳng $BC$
nên $CG\parallel PF$.
Xét $\triangle MPF$ có:
$C\in MP$ (gt);
$G\in MF$ ($G$ thuộc trung tuyến $MA$, $F$ thuộc $MA$);
$CG\parallel PF$ (cmt)
nên $\dfrac{MC}{MP}=\dfrac{MG}{MF}$ (định lí Thalès).
Vậy $\dfrac{MC}{MP}=\dfrac{MG}{MF}$.
**cấu hình hình / nghi vấn:**
Chữ in sai đã sửa: bản in "MC/MD = MG/MF" ($D$ chưa định nghĩa) ⇒ $\dfrac{MC}{MP}=\dfrac{MG}{MF}$. Ý b) của tài liệu "MB/MN = MP/MC" SAI nên KHÔNG nhập: thử toạ độ (kiem_G3.mjs) được $MB/MN=0{,}7328$ còn $MP/MC=1{,}6354$ (khác nhau); hệ thức đúng là $\dfrac{MN}{MB}+\dfrac{MP}{MC}=3$ (đã kiểm = 3,0000) — hỏi Thùy xem ý b) có ý định này không.
Đề: thêm "lần lượt" vào "cắt $MA$ lần lượt tại $E$ và $F$" để biết $E$ từ $N$, $F$ từ $P$. Chỉ còn một ý nên bỏ nhãn "a)" khỏi đề và lời giải (nếu sau này bổ sung ý b) thì thêm lại "a) ").
Ý này không dùng tính chất trọng tâm: chỉ cần $G$ thuộc $MA$. $E$, $F$ nằm trên đường thẳng $MA$ (một trong hai điểm nằm ngoài đoạn $MA$ — vì $A$ là trung điểm $NP$ nên $E$, $F$ đối xứng nhau qua $A$ — nên đề "cắt $MA$" hiểu là cắt đường thẳng $MA$); hình vẽ đúng như vậy ($F$ nằm dưới $A$).
Chỗ chưa chốt trong lời giải: "$G\in MF$" ghi theo nghĩa $G$, $F$ cùng thuộc đường thẳng $MA$ (và $G$ nằm giữa $M$, $F$ — đã kiểm bằng toạ độ trên 8 bộ).
Hình: $M$ đỉnh trên, $N$ trái, $P$ phải, $A$ trung điểm $NP$ (đánh dấu bằng nhau $NA$, $AP$ theo giả thiết), $G$ trọng tâm (dựng bằng toạ độ), $B\in MN$ với $MB/MN=5/6$, $C\in MP$ với $MC/MP=5/9$ nên $B$, $G$, $C$ thẳng hàng đúng; $NE\parallel BC$, $PF\parallel BC$ dựng đúng.
Verify (kiem_G3.mjs): 8 bộ toạ độ ngẫu nhiên (tam giác bất kì, đường qua $G$ bất kì) + bộ vẽ hình: $G$ thuộc $MA$ với $MG=\tfrac23MA$, $B,G,C$ thẳng hàng, $NE\parallel BC$, $PF\parallel BC$, $CG\parallel PF$, $G$ nằm giữa $M$ và $F$, $MC/MP=MG/MF$ — PASS hết.
Chỉ dùng Thalès (whitelist). Không dùng đường trung bình, tính chất phân giác.
**hinh:** VN5.png
