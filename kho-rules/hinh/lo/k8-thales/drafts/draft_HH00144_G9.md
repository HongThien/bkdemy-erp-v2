### TL2.2 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $AM$ là đường trung tuyến.
Kẻ $MD$ là tia phân giác của $\widehat{AMB}$ ($D\in AB$).
Kẻ $ME$ là tia phân giác của $\widehat{AMC}$ ($E\in AC$).
Chứng minh:
a) $\dfrac{AE}{EC}=\dfrac{AM}{MC}$.
b) $\dfrac{AE}{EC}=\dfrac{AD}{DB}$ và $DE\parallel BC$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $\dfrac{AE}{EC}=\dfrac{AM}{MC}$
$\Uparrow$ (tính chất đường phân giác trong $\triangle AMC$)
$ME$ là phân giác của $\widehat{AMC}$, $E\in AC$ ✓ (gt)

b) $\dfrac{AE}{EC}=\dfrac{AD}{DB}$ và $DE\parallel BC$
**Nhánh ①:** $\dfrac{AE}{EC}=\dfrac{AD}{DB}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AM}{MC}$)
$\dfrac{AE}{EC}=\dfrac{AM}{MC}$ (câu a) ✓ · $\dfrac{AD}{DB}=\dfrac{AM}{MC}$
$\Uparrow$ (thay $MB=MC$)
$\dfrac{AD}{DB}=\dfrac{AM}{MB}$ · $MB=MC$ ✓ (định nghĩa đường trung tuyến)
$\Uparrow$ (tính chất đường phân giác trong $\triangle AMB$)
$MD$ là phân giác của $\widehat{AMB}$, $D\in AB$ ✓ (gt)
**Nhánh ②:** $DE\parallel BC$
$\Uparrow$ (định lí Thalès đảo)
$\dfrac{AD}{AB}=\dfrac{AE}{AC}$
$\Uparrow$ (tính chất của tỉ lệ thức)
$\dfrac{AD}{DB}=\dfrac{AE}{EC}$ (nhánh ①) ✓

**Phần 2. Trình bày**
a) Xét $\triangle AMC$ có:
$ME$ là tia phân giác của $\widehat{AMC}$ (gt);
$E\in AC$ (gt)
nên $\dfrac{AE}{EC}=\dfrac{AM}{MC}$ (tính chất đường phân giác).

b) Xét $\triangle AMB$ có:
$MD$ là tia phân giác của $\widehat{AMB}$ (gt);
$D\in AB$ (gt)
nên $\dfrac{AD}{DB}=\dfrac{AM}{MB}$ (tính chất đường phân giác).
Mà $MB=MC$ (định nghĩa đường trung tuyến)
nên $\dfrac{AD}{DB}=\dfrac{AM}{MC}$.
Lại có $\dfrac{AE}{EC}=\dfrac{AM}{MC}$ (câu a).
Suy ra $\dfrac{AE}{EC}=\dfrac{AD}{DB}$ (cùng bằng $\dfrac{AM}{MC}$).
Từ $\dfrac{AD}{DB}=\dfrac{AE}{EC}$
ta có $\dfrac{DB}{AD}=\dfrac{EC}{AE}$ (tính chất của tỉ lệ thức)
nên $\dfrac{DB}{AD}+1=\dfrac{EC}{AE}+1$
hay $\dfrac{AB}{AD}=\dfrac{AC}{AE}$ (vì $D\in AB$, $E\in AC$).
Suy ra $\dfrac{AD}{AB}=\dfrac{AE}{AC}$.
Xét $\triangle ABC$ có:
$D\in AB$, $E\in AC$ (gt);
$\dfrac{AD}{AB}=\dfrac{AE}{AC}$ (cmt)
nên $DE\parallel BC$ (định lí Thalès đảo).
Vậy $\dfrac{AE}{EC}=\dfrac{AD}{DB}$ và $DE\parallel BC$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ (A ở trên, B trái, C phải), $M$ là trung điểm $BC$ (gạch $MB=MC$ vì là giả thiết "trung tuyến"), $AM$; $MD$ và $ME$ là phân giác dựng bằng toạ độ (góc $AMD=DMB$ đánh 1 cung, $AME=EMC$ đánh 2 cung); đoạn $DE$ có vẽ (đề nêu $DE$) nhưng KHÔNG đánh dấu song song (đó là điều phải chứng minh) và không ghi tỉ lệ nào.
Verify (kiem_G9.mjs, 6 tam giác ngẫu nhiên): $D\in$ đoạn $AB$, $E\in$ đoạn $AC$; $\widehat{AMD}=\widehat{DMB}$, $\widehat{AME}=\widehat{EMC}$; $\dfrac{AE}{EC}=\dfrac{AM}{MC}$; $\dfrac{AD}{DB}=\dfrac{AM}{MB}$; $MB=MC$; $\dfrac{AE}{EC}=\dfrac{AD}{DB}$; $DE\parallel BC$; $\dfrac{AD}{AB}=\dfrac{AE}{AC}$ — tất cả PASS.
Công cụ trong whitelist: tính chất đường phân giác (bài này), Thalès đảo (bài HH00142), tính chất tỉ lệ thức (lớp 7). Không dùng công cụ ngoài. Đề nguồn không có lỗi in.
**hinh:** TL2-2.png

### TL2.3 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có $D$, $E$ lần lượt là trung điểm của $AB$, $AC$.
Kẻ tia phân giác của góc $A$ cắt $DE$, $BC$ lần lượt tại $M$, $N$.
Chứng minh $\dfrac{DM}{ME}=\dfrac{BN}{NC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$\dfrac{DM}{ME}=\dfrac{BN}{NC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AB}{AC}$)
$\dfrac{DM}{ME}=\dfrac{AB}{AC}$ · $\dfrac{BN}{NC}=\dfrac{AB}{AC}$
**Nhánh ①:** $\dfrac{BN}{NC}=\dfrac{AB}{AC}$
$\Uparrow$ (tính chất đường phân giác trong $\triangle ABC$)
$AN$ là phân giác của $\widehat{BAC}$, $N\in BC$ ✓ (gt)
**Nhánh ②:** $\dfrac{DM}{ME}=\dfrac{AB}{AC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AD}{AE}$)
$\dfrac{DM}{ME}=\dfrac{AD}{AE}$ · $\dfrac{AD}{AE}=\dfrac{AB}{AC}$
**Nhánh ②.1:** $\dfrac{DM}{ME}=\dfrac{AD}{AE}$
$\Uparrow$ (tính chất đường phân giác trong $\triangle ADE$)
$AM$ là phân giác của $\widehat{DAE}$ · $M\in DE$ ✓ (gt)
$\Uparrow$ ($\widehat{DAE}$ chính là $\widehat{BAC}$ vì $D\in AB$, $E\in AC$)
$AM$ là phân giác của $\widehat{BAC}$ ✓ (gt)
**Nhánh ②.2:** $\dfrac{AD}{AE}=\dfrac{AB}{AC}$
$\Uparrow$ (chia vế theo vế)
$AD=\dfrac12AB$ · $AE=\dfrac12AC$
$\Uparrow$ (trung điểm)
$D$ là trung điểm của $AB$ ✓ (gt) · $E$ là trung điểm của $AC$ ✓ (gt)

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$AN$ là tia phân giác của $\widehat{BAC}$ (gt);
$N\in BC$ (gt)
nên $\dfrac{BN}{NC}=\dfrac{AB}{AC}$ (tính chất đường phân giác). (1)
Vì $D$ là trung điểm của $AB$ (gt) nên $AD=\dfrac12AB$.
Vì $E$ là trung điểm của $AC$ (gt) nên $AE=\dfrac12AC$.
Suy ra $\dfrac{AD}{AE}=\dfrac{AB}{AC}$ (chia vế theo vế). (2)
Vì $D\in AB$, $E\in AC$ (gt)
nên $\widehat{DAE}$ chính là $\widehat{BAC}$.
Mà $AM$ là tia phân giác của $\widehat{BAC}$ (gt)
nên $AM$ là tia phân giác của $\widehat{DAE}$.
Xét $\triangle ADE$ có:
$AM$ là tia phân giác của $\widehat{DAE}$ (cmt);
$M\in DE$ (gt)
nên $\dfrac{DM}{ME}=\dfrac{AD}{AE}$ (tính chất đường phân giác). (3)
Từ (1), (2) và (3) suy ra $\dfrac{DM}{ME}=\dfrac{BN}{NC}$ (cùng bằng $\dfrac{AB}{AC}$).
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ không cân ($AB<AC$ trên hình để thấy $DM\neq ME$), $D$, $E$ là trung điểm (gạch $AD=DB$ 1 gạch, $AE=EC$ 2 gạch — đây là giả thiết), đoạn $DE$, phân giác $AN$ (đánh 1 cung cho hai góc $BAN$, $NAC$), $M=AN\cap DE$ dựng bằng toạ độ. Không đánh dấu tỉ lệ nào.
Cách giải chỉ dùng tính chất đường phân giác hai lần (trong $\triangle ABC$ và $\triangle ADE$) và trung điểm; KHÔNG cần đường trung bình (hợp ghi chú whitelist bài này nhưng không bắt buộc). Không dùng Thalès. Lưu ý $M\in$ đoạn $DE$ do $AM$ nằm trong góc $DAE$.
Verify (kiem_G9.mjs, 6 tam giác ngẫu nhiên): $N\in$ đoạn $BC$, $M\in$ đoạn $DE$; $\widehat{BAN}=\widehat{NAC}$; $\widehat{DAE}=\widehat{BAC}$; $\widehat{DAM}=\widehat{MAE}$; $\dfrac{BN}{NC}=\dfrac{AB}{AC}$; $\dfrac{DM}{ME}=\dfrac{AD}{AE}$; $\dfrac{AD}{AE}=\dfrac{AB}{AC}$; $\dfrac{DM}{ME}=\dfrac{BN}{NC}$ — tất cả PASS. Đề nguồn không có lỗi in.
**hinh:** TL2-3.png

### TL2.4 → HH00144
**loai_cau:** tu_luan
**noi_dung:**
Cho hình bình hành $ABCD$ ($AB\ne AD$).
Tia phân giác của $\widehat{A}$ cắt đường chéo $BD$ tại $M$.
Tia phân giác của $\widehat{D}$ cắt đường chéo $AC$ tại $N$.
a) Chứng minh $\dfrac{BM}{DM}=\dfrac{CN}{AN}$.
b) Chứng minh $MN\parallel AD$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $\dfrac{BM}{DM}=\dfrac{CN}{AN}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AB}{AD}$)
$\dfrac{BM}{DM}=\dfrac{AB}{AD}$ · $\dfrac{CN}{AN}=\dfrac{AB}{AD}$
**Nhánh ①:** $\dfrac{BM}{DM}=\dfrac{AB}{AD}$
$\Uparrow$ (tính chất đường phân giác trong $\triangle ABD$)
$AM$ là phân giác của $\widehat{BAD}$, $M\in BD$ ✓ (gt)
**Nhánh ②:** $\dfrac{CN}{AN}=\dfrac{AB}{AD}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{CD}{AD}$)
$\dfrac{CN}{AN}=\dfrac{CD}{AD}$ · $CD=AB$
**Nhánh ②.1:** $\dfrac{CN}{AN}=\dfrac{CD}{AD}$
$\Uparrow$ (tính chất đường phân giác trong $\triangle ACD$)
$DN$ là phân giác của $\widehat{ADC}$, $N\in AC$ ✓ (gt)
**Nhánh ②.2:** $CD=AB$
$\Uparrow$ (hai cạnh đối của hình bình hành)
$ABCD$ là hình bình hành ✓ (gt)

b) $MN\parallel AD$
**Kẻ thêm:** đường thẳng $d$ đi qua $M$, $d\parallel AD$;
$d$ cắt $AB$ tại $P$, cắt $AC$ tại $N'$ (hình lời giải)
$\Uparrow$ ($M\in d$, $d\parallel AD$)
$N$ thuộc $d$, tức là $N\equiv N'$
$\Uparrow$ ($N$, $N'$ cùng thuộc đoạn $AC$, cách $A$ cùng một khoảng)
$\dfrac{AN'}{AC}=\dfrac{AN}{AC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{DM}{DB}$)
$\dfrac{AN'}{AC}=\dfrac{DM}{DB}$ · $\dfrac{AN}{AC}=\dfrac{DM}{DB}$
**Nhánh ①:** $\dfrac{AN'}{AC}=\dfrac{DM}{DB}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AP}{AB}$)
$\dfrac{AN'}{AC}=\dfrac{AP}{AB}$ · $\dfrac{AP}{AB}=\dfrac{DM}{DB}$
**Nhánh ①.1:** $\dfrac{AN'}{AC}=\dfrac{AP}{AB}$
$\Uparrow$ (định lí Thalès trong $\triangle ABC$)
$PN'\parallel BC$
$\Uparrow$ (cùng song song với $AD$)
$PN'\parallel AD$ ✓ (cách kẻ $d$) · $AD\parallel BC$ ✓ (định nghĩa hình bình hành)
**Nhánh ①.2:** $\dfrac{AP}{AB}=\dfrac{DM}{DB}$
$\Uparrow$ (định lí Thalès trong $\triangle ABD$)
$PM\parallel AD$ ✓ (cách kẻ $d$)
**Nhánh ②:** $\dfrac{AN}{AC}=\dfrac{DM}{DB}$
$\Uparrow$ (tính chất của tỉ lệ thức)
$\dfrac{BM}{DM}=\dfrac{CN}{AN}$ (câu a) ✓ · $BM+DM=BD$ ✓ · $CN+AN=AC$ ✓

**Phần 2. Trình bày**
a) Xét $\triangle ABD$ có:
$AM$ là tia phân giác của $\widehat{BAD}$ (gt);
$M\in BD$ (gt)
nên $\dfrac{BM}{DM}=\dfrac{AB}{AD}$ (tính chất đường phân giác).
Xét $\triangle ACD$ có:
$DN$ là tia phân giác của $\widehat{ADC}$ (gt);
$N\in AC$ (gt)
nên $\dfrac{CN}{AN}=\dfrac{CD}{AD}$ (tính chất đường phân giác).
Mà $CD=AB$ (hai cạnh đối của hình bình hành $ABCD$)
nên $\dfrac{CN}{AN}=\dfrac{AB}{AD}$.
Vậy $\dfrac{BM}{DM}=\dfrac{CN}{AN}$ (cùng bằng $\dfrac{AB}{AD}$).

b) Kẻ đường thẳng $d$ đi qua $M$ và song song với $AD$.
Gọi $P$ là giao điểm của $d$ và $AB$.
Vì $AD\parallel BC$ (định nghĩa hình bình hành)
nên $d\parallel BC$ (cùng song song với $AD$).
Do đó $d$ cắt $AC$ tại một điểm, gọi là $N'$.
Xét $\triangle ABC$ có $PN'\parallel BC$ (cmt)
nên $\dfrac{AN'}{AC}=\dfrac{AP}{AB}$ (định lí Thalès). (1)
Xét $\triangle ABD$ có $PM\parallel AD$ (cách kẻ)
nên $\dfrac{AP}{AB}=\dfrac{DM}{DB}$ (định lí Thalès). (2)
Từ câu a) có $\dfrac{BM}{DM}=\dfrac{CN}{AN}$
nên $\dfrac{BM}{DM}+1=\dfrac{CN}{AN}+1$.
Mà $BM+DM=BD$ (vì $M\in BD$)
và $CN+AN=AC$ (vì $N\in AC$)
nên $\dfrac{BD}{DM}=\dfrac{AC}{AN}$ (tính chất của tỉ lệ thức).
Suy ra $\dfrac{DM}{DB}=\dfrac{AN}{AC}$. (3)
Từ (1), (2) và (3) suy ra $\dfrac{AN'}{AC}=\dfrac{AN}{AC}$
nên $AN'=AN$.
Mà $N'$ và $N$ cùng thuộc đoạn $AC$ nên $N'\equiv N$.
Do đó $M$, $N$ cùng thuộc $d$.
Mà $d\parallel AD$ (cách kẻ).
Vậy $MN\parallel AD$.
**cấu hình hình / nghi vấn:**
Hình đề: hình bình hành $ABCD$ ($A$ trên-trái, $B$ trên-phải, $C$ dưới-phải, $D$ dưới-trái; $AB=330$, $AD\approx242$ nên $AB\ne AD$), hai đường chéo $AC$, $BD$, phân giác $AM$ ($M\in BD$) và $DN$ ($N\in AC$) dựng bằng toạ độ, đoạn $MN$ (đề nêu $MN$) KHÔNG đánh song song; ký hiệu gạch $AB=CD$, $AD=BC$ (tính chất hình bình hành là giả thiết); đánh góc bằng nhau: $BAM=MAD$ (1 cung), $ADN=NDC$ (2 cung).
Hình lời giải (hinh_lg): thêm đường thẳng $d$ qua $M$ song song $AD$ (nét đứt) cắt $AB$ tại $P$, đi qua $N$; nhãn "N ≡ N′" vì $N'$ trùng $N$ (điều được chứng minh trong lời giải; hình vẽ đúng toạ độ nên hai điểm trùng nhau).
SỬA/THÊM ĐỀ: thêm điều kiện "($AB\ne AD$)" — nếu $AB=AD$ (hình thoi) thì $M=N=O$ (tâm) và đoạn $MN$ suy biến, mệnh đề "$MN\parallel AD$" vô nghĩa. Đề nguồn không có điều kiện này; nếu Thùy muốn giữ đề gốc thì bỏ cụm "($AB\ne AD$)" (lời giải vẫn đúng với mọi hình bình hành có $M\ne N$).
Cách giải b): không có công cụ nào đủ gọn trong whitelist cho mọi dáng hình bình hành (cách "tâm $O$, $OM/OB=ON/OC$" phải chia trường hợp $AB<AD$/$AB>AD$ vì $M$ có thể nằm ngoài đoạn $OD$). Dùng kẻ thêm $d$ rồi so sánh $\dfrac{AN'}{AC}$ với $\dfrac{AN}{AC}$: không chia trường hợp; chỉ dùng Thalès thuận, tính chất đường phân giác, tính chất tỉ lệ thức, tiên đề Ơ-clit (qua một điểm chỉ có một đường thẳng song song với đường thẳng cho trước).
Verify (kiem_G9.mjs, 40 hình bình hành ngẫu nhiên, 37 hợp lệ: 15 trường hợp $AB>AD$ và 22 trường hợp $AB<AD$): $M\in$ đoạn $BD$, $N\in$ đoạn $AC$; $\widehat{BAM}=\widehat{MAD}$, $\widehat{ADN}=\widehat{NDC}$; $\dfrac{BM}{DM}=\dfrac{AB}{AD}$; $\dfrac{CN}{AN}=\dfrac{DC}{DA}$; $\dfrac{BM}{DM}=\dfrac{CN}{AN}$; $MN\parallel AD$; $P\in$ đoạn $AB$, $N'\in$ đoạn $AC$; $PN'\parallel BC$; (1) $\dfrac{AN'}{AC}=\dfrac{AP}{AB}$; (2) $\dfrac{AP}{AB}=\dfrac{DM}{DB}$; (3) $\dfrac{DM}{DB}=\dfrac{AN}{AC}$; $N'\equiv N$ — tất cả PASS.
**hinh:** TL2-4.png
**hinh_lg:** TL2-4_lg.png
