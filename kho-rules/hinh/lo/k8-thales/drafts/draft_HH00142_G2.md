### TL2.4 → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 67,5
**noi_dung:**
Để đo khoảng cách giữa hai vị trí $A$ và $B$ bên bờ một hồ, người ta chọn ba vị trí $C$, $D$, $E$ ở ngoài hồ sao cho ba điểm $C$, $B$, $A$ thẳng hàng ($B$ nằm giữa $C$ và $A$), ba điểm $C$, $D$, $E$ thẳng hàng ($D$ nằm giữa $C$ và $E$) và $BD\parallel AE$.
Sau đó đo được $CD=20$ m, $DE=45$ m và $CB=30$ m.
Hỏi khoảng cách giữa hai vị trí $A$ và $B$ là bao nhiêu mét?
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** $BD\parallel AE$ nên trong tam giác $CAE$ có một đường thẳng song song với cạnh $AE$ và cắt hai cạnh còn lại — dùng định lí Thalès.

**Bước 1.** Tìm tam giác để áp dụng: $B$ thuộc cạnh $CA$, $D$ thuộc cạnh $CE$ và $BD\parallel AE$, nên xét $\triangle CAE$ với đường thẳng $BD$ song song cạnh $AE$.

**Bước 2.** Chọn hệ thức Thalès chứa đoạn cần tìm $AB$ cùng ba đoạn đã biết $CB$, $CD$, $DE$: $\dfrac{CB}{BA}=\dfrac{CD}{DE}$ (phần gần đỉnh $C$ trên mỗi cạnh so với phần còn lại).

**Bước 3.** Thay $CB=30$, $CD=20$, $DE=45$ vào tỉ lệ thức rồi tính $BA$ bằng tích chéo, nhớ ghi đơn vị mét.

**Chú ý:** $30$ m chỉ là đoạn $CB$, không phải cả đoạn $CA$; đoạn cần tìm $AB$ là phần còn lại của $CA$ sau khi bỏ $CB$.

**Phần 2. Trình bày**
Xét $\triangle CAE$ có:
$B\in CA$, $D\in CE$ (gt);
$BD\parallel AE$ (gt).
Do đó $\dfrac{CB}{BA}=\dfrac{CD}{DE}$ (định lí Thalès).
Thay số: $\dfrac{30}{BA}=\dfrac{20}{45}$.
Suy ra $BA=\dfrac{30\cdot 45}{20}=67{,}5$ (m).
Vậy khoảng cách giữa hai vị trí $A$ và $B$ là $67{,}5$ m.
**cấu hình hình / nghi vấn:**
Hình: hồ (hình elip xanh) nằm phía trên đường $CA$, $B$ và $A$ ở mép hồ; $C$ ngoài hồ ở bên trái, $D$, $E$ bên dưới; vẽ đoạn $BD$, $AE$ song song (dựng $B=C+\tfrac{30}{97{,}5}\overrightarrow{CA}$, $D=C+\tfrac{20}{65}\overrightarrow{CE}$ nên $BD\parallel AE$ đúng); tỉ lệ $CB:CD:DE=30:20:45$ đúng; ghi 30 m, 20 m, 45 m (ảnh gốc không ghi số lên hình, số nằm trong đề). Không ghi đáp số $AB$ trên hình.
Đề tài liệu viết "ba điểm $C,B,A$ thẳng hàng" — thêm "($B$ nằm giữa $C$ và $A$)", "($D$ nằm giữa $C$ và $E$)" cho đề tự đủ (đúng theo ảnh).
Verify (kiem_G2.mjs): dựng toạ độ 4 bộ ngẫu nhiên đúng $CB=30$, $CD=20$, $DE=45$, $BD\parallel AE$ ⇒ $AB=67{,}5$ khớp; $CA=97{,}5$ kiểm chéo. Chỉ dùng định lí Thalès (trong whitelist).
**hinh:** TL2-4.png

### TL3.1 → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho hình thang $ABCD$ ($AB\parallel CD$).
Lấy điểm $I$ trên cạnh $AD$ ($I$ khác $A$ và $D$), từ $I$ kẻ đường thẳng song song với $CD$ cắt $AC$, $BC$ lần lượt tại $O$ và $K$.
a) Chứng minh $\dfrac{AI}{ID}=\dfrac{AO}{OC}$.
b) Chứng minh $\dfrac{AI}{ID}=\dfrac{BK}{KC}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $\dfrac{AI}{ID}=\dfrac{AO}{OC}$
$\Uparrow$ (định lí Thalès cho $\triangle ACD$)
$IO\parallel CD$ · $I\in AD$ ✓ · $O\in AC$ ✓
$\Uparrow$ ($O$ thuộc $IK$ và $IK\parallel CD$)
$IK\parallel CD$ ✓ (gt)

b) $\dfrac{AI}{ID}=\dfrac{BK}{KC}$
$\Uparrow$ (bắc cầu: cùng bằng $\dfrac{AO}{OC}$)
$\dfrac{AI}{ID}=\dfrac{AO}{OC}$ (câu a) ✓ · $\dfrac{AO}{OC}=\dfrac{BK}{KC}$
**Nhánh ①:** $\dfrac{AO}{OC}=\dfrac{BK}{KC}$
$\Uparrow$ (nghịch đảo hai vế của tỉ lệ thức)
$\dfrac{CO}{OA}=\dfrac{CK}{KB}$
$\Uparrow$ (định lí Thalès cho $\triangle CAB$)
$OK\parallel AB$ · $O\in CA$ ✓ · $K\in CB$ ✓
$\Uparrow$ ($O$, $K$ thuộc $IK$)
$IK\parallel AB$
$\Uparrow$ (hai đường thẳng cùng song song với $CD$)
$IK\parallel CD$ ✓ (gt) · $AB\parallel CD$ ✓ (gt)

**Phần 2. Trình bày**
a) Vì $IK\parallel CD$ (gt) và $O$ thuộc $IK$
nên $IO\parallel CD$.
Xét $\triangle ACD$ có:
$I\in AD$, $O\in AC$ (gt);
$IO\parallel CD$ (cmt).
Do đó $\dfrac{AI}{ID}=\dfrac{AO}{OC}$ (định lí Thalès).

b) Vì $IK\parallel CD$ (gt) và $AB\parallel CD$ (gt)
nên $IK\parallel AB$ (cùng song song với $CD$).
Mà $O$, $K$ thuộc $IK$ nên $OK\parallel AB$.
Xét $\triangle CAB$ có:
$O\in CA$, $K\in CB$ (gt);
$OK\parallel AB$ (cmt).
Do đó $\dfrac{CO}{OA}=\dfrac{CK}{KB}$ (định lí Thalès).
Suy ra $\dfrac{AO}{OC}=\dfrac{BK}{KC}$ (nghịch đảo hai vế).
Mà $\dfrac{AI}{ID}=\dfrac{AO}{OC}$ (câu a).
Vậy $\dfrac{AI}{ID}=\dfrac{BK}{KC}$.
**cấu hình hình / nghi vấn:**
Sửa lỗi đề: bản in "Lấy điểm $I$ trên cạnh $AB$" mâu thuẫn (đường qua $I\in AB$ song song $CD$ chính là $AB$; hệ thức dùng $ID$) ⇒ **$I$ thuộc cạnh $AD$** (theo chỉ dẫn). Thêm "($I$ khác $A$ và $D$)" để $O$, $K$ không trùng đỉnh (nếu $I=D$ thì $IK$ là $CD$, không cắt $AC$ ở điểm khác $C$).
Hình: hình thang thường (không cân) có $AB$ trên, $CD$ dưới ($AB\parallel CD$ nằm ngang, $AB$ ngắn hơn $CD$), $I=A+0{,}42\,\overrightarrow{AD}$, $IK$ ngang cắt $AC$ tại $O$, $BC$ tại $K$ (dựng bằng giao điểm, $IK\parallel CD$ đúng). Không vẽ sẵn gạch bằng nhau.
Verify (kiem_G2.mjs): 6 hình thang ngẫu nhiên × (O, K thuộc đoạn; $IO\parallel CD$; a) $AI/ID=AO/OC$; $IK\parallel AB$; $OK\parallel AB$; $CO/OA=CK/KB$; $AO/OC=BK/KC$; b)) — PASS hết.
Chỉ dùng định lí Thalès + tiên đề/hệ quả "cùng song song với đường thứ ba" (lớp 7) + tính chất tỉ lệ thức. Không dùng đường trung bình, đồng dạng.
**hinh:** TL3-1.png

### TL3.2 → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$, điểm $D$ thuộc cạnh $BC$ ($D$ khác $B$ và $C$).
Kẻ $DE\parallel AC$ ($E\in AB$) và $DF\parallel AB$ ($F\in AC$).
Chứng minh $\dfrac{AE}{AB}+\dfrac{AF}{AC}=1$.
**loi_giai:**
**Phần 1. Hướng dẫn**
$\dfrac{AE}{AB}+\dfrac{AF}{AC}=1$
$\Uparrow$ (cộng hai phân số cùng mẫu $BC$)
$\dfrac{AE}{AB}=\dfrac{CD}{BC}$ · $\dfrac{AF}{AC}=\dfrac{BD}{BC}$ · $CD+BD=BC$ ✓ ($D$ nằm giữa $B$ và $C$)
**Nhánh ①:** $\dfrac{AE}{AB}=\dfrac{CD}{BC}$
$\Uparrow$ (định lí Thalès cho $\triangle ABC$, đường thẳng $ED$)
$ED\parallel AC$ ✓ (gt) · $E\in AB$ ✓ · $D\in BC$ ✓
**Nhánh ②:** $\dfrac{AF}{AC}=\dfrac{BD}{BC}$
$\Uparrow$ (định lí Thalès cho $\triangle ABC$, đường thẳng $DF$)
$DF\parallel AB$ ✓ (gt) · $F\in AC$ ✓ · $D\in BC$ ✓

**Phần 2. Trình bày**
Xét $\triangle ABC$ có:
$E\in AB$, $D\in BC$ (gt);
$ED\parallel AC$ (gt).
Do đó $\dfrac{AE}{AB}=\dfrac{CD}{BC}$ (định lí Thalès). (1)
Xét $\triangle ABC$ có:
$F\in AC$, $D\in BC$ (gt);
$DF\parallel AB$ (gt).
Do đó $\dfrac{AF}{AC}=\dfrac{BD}{BC}$ (định lí Thalès). (2)
Cộng (1) và (2) vế theo vế:
$\dfrac{AE}{AB}+\dfrac{AF}{AC}=\dfrac{CD}{BC}+\dfrac{BD}{BC}=\dfrac{CD+BD}{BC}$.
Vì $D$ nằm giữa $B$ và $C$ (gt) nên $CD+BD=BC$.
Vậy $\dfrac{AE}{AB}+\dfrac{AF}{AC}=\dfrac{BC}{BC}=1$.
**cấu hình hình / nghi vấn:**
Hình: tam giác $ABC$ ($A$ đỉnh trên), $D\in BC$ với $BD:BC=0{,}4$, $E=B+0{,}4\overrightarrow{BA}$, $F=C+0{,}6\overrightarrow{CA}$ ⇒ $DE\parallel AC$, $DF\parallel AB$ đúng (đã kiểm trong script vẽ); $AEDF$ là hình bình hành nhưng KHÔNG đánh dấu gì thêm.
Thêm "($D$ khác $B$ và $C$)" để $E$, $F$ không suy biến.
Dùng dạng Thalès thứ ba của bài ($\dfrac{BD}{AB}=\dfrac{EC}{AC}$: đoạn từ đỉnh đáy tới điểm chia / cả cạnh) lần lượt với đỉnh $B$ và đỉnh $C$ — lời giải chỉ viết "định lí Thalès", không dùng hệ quả $AD/AB=AE/AC=DE/BC$ (chưa học).
Verify (kiem_G2.mjs): 6 tam giác ngẫu nhiên × ($E\in AB$, $F\in AC$ đoạn; $ED\parallel AC$; $DF\parallel AB$; $AE/AB=CD/BC$; $AF/AC=BD/BC$; $BD+CD=BC$; tổng $=1$) — PASS hết.
**hinh:** TL3-2.png

### TL3.3 → HH00142
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ có trung tuyến $AM$. $F$ là trung điểm của $AM$.
Qua $F$ kẻ một đường thẳng bất kì (không song song với $BC$) cắt các cạnh $AB$, $AC$ lần lượt tại $D$, $E$.
Qua $B$, $C$ kẻ các đường thẳng song song với $DE$ cắt $AM$ lần lượt tại $I$, $K$.
a) Chứng minh $\dfrac{AB}{AD}=\dfrac{AI}{AF}$.
b) Chứng minh $M$ là trung điểm của $IK$.
c) Chứng minh $\dfrac{AB}{AD}+\dfrac{AC}{AE}=4$.
**loi_giai:**
**Phần 1. Hướng dẫn**
a) $\dfrac{AB}{AD}=\dfrac{AI}{AF}$
$\Uparrow$ (nghịch đảo hai vế của tỉ lệ thức)
$\dfrac{AD}{AB}=\dfrac{AF}{AI}$
$\Uparrow$ (định lí Thalès cho $\triangle ABI$)
$DF\parallel BI$ · $D\in AB$ ✓ · $F\in AI$ ✓
$\Uparrow$ ($F$ thuộc $DE$ và $BI\parallel DE$)
$BI\parallel DE$ ✓ (gt)

b) $M$ là trung điểm của $IK$
$\Uparrow$ ($K'$ là điểm đối xứng với $I$ qua $M$ nên $M$ là trung điểm $IK'$)
$K'$ trùng $K$
$\Uparrow$ ($K'$ thuộc $AM$; $AM$ và $CK$ cắt nhau tại đúng một điểm $K$)
$K'$ thuộc $CK$
$\Uparrow$ (tiên đề Ơ-clit: qua $C$ chỉ có một đường thẳng song song với $BI$)
$CK'\parallel BI$ · $CK\parallel BI$ ✓ (cùng song song với $DE$)
$\Uparrow$ (hai cạnh đối của hình bình hành)
$BICK'$ là hình bình hành
$\Uparrow$ (dấu hiệu: hai đường chéo cắt nhau tại trung điểm mỗi đường)
$M$ là trung điểm của $BC$ ✓ (gt) · $M$ là trung điểm của $IK'$ ✓ (cách dựng)

c) $\dfrac{AB}{AD}+\dfrac{AC}{AE}=4$
$\Uparrow$ (cộng hai phân số cùng mẫu $AF$)
$\dfrac{AB}{AD}=\dfrac{AI}{AF}$ (câu a) ✓ · $\dfrac{AC}{AE}=\dfrac{AK}{AF}$ · $AI+AK=4AF$
**Nhánh ①:** $\dfrac{AC}{AE}=\dfrac{AK}{AF}$
$\Uparrow$ (nghịch đảo hai vế của tỉ lệ thức)
$\dfrac{AE}{AC}=\dfrac{AF}{AK}$
$\Uparrow$ (định lí Thalès cho $\triangle ACK$)
$EF\parallel CK$ · $E\in AC$ ✓ · $F\in AK$ ✓
$\Uparrow$ ($E$, $F$ thuộc $DE$ và $CK\parallel DE$)
$CK\parallel DE$ ✓ (gt)
**Nhánh ②:** $AI+AK=4AF$
$\Uparrow$ (thay $2AM=4AF$)
$AI+AK=2AM$ · $AM=2AF$ ✓ ($F$ là trung điểm $AM$)
$\Uparrow$ ($M$ là trung điểm $IK$, $A$ nằm ngoài đoạn $IK$)
$M$ là trung điểm của $IK$ (câu b) ✓

**Phần 2. Trình bày**
a) Vì $BI\parallel DE$ (gt) và $F$ thuộc $DE$
nên $DF\parallel BI$.
Xét $\triangle ABI$ có:
$D\in AB$ (gt);
$F\in AI$ ($F$ nằm giữa $A$ và $I$ trên $AM$);
$DF\parallel BI$ (cmt).
Do đó $\dfrac{AD}{AB}=\dfrac{AF}{AI}$ (định lí Thalès).
Suy ra $\dfrac{AB}{AD}=\dfrac{AI}{AF}$ (nghịch đảo hai vế).

b) Vì $BI\parallel DE$ và $CK\parallel DE$ (gt)
nên $BI\parallel CK$ (cùng song song với $DE$).
Gọi $K'$ là điểm đối xứng với $I$ qua $M$.
Khi đó $M$ là trung điểm của $IK'$ và $K'$ thuộc $AM$.
Xét tứ giác $BICK'$ có:
$M$ là trung điểm của $BC$ (gt);
$M$ là trung điểm của $IK'$ (cách dựng)
nên $BICK'$ là hình bình hành (dấu hiệu nhận biết hình bình hành).
Do đó $CK'\parallel BI$ (hai cạnh đối của hình bình hành).
Mà $CK\parallel BI$ (cmt)
nên $CK'$ và $CK$ là một (tiên đề Ơ-clit).
Do đó $K'$ thuộc đường thẳng $CK$.
Lại có $K'$ thuộc $AM$, mà $AM$ cắt $CK$ tại $K$
nên $K'$ trùng $K$.
Vậy $M$ là trung điểm của $IK$.

c) Vì $CK\parallel DE$ (gt) và $E$, $F$ thuộc $DE$
nên $EF\parallel CK$.
Xét $\triangle ACK$ có:
$E\in AC$ (gt);
$F\in AK$ ($F$ nằm giữa $A$ và $K$ trên $AM$);
$EF\parallel CK$ (cmt).
Do đó $\dfrac{AE}{AC}=\dfrac{AF}{AK}$ (định lí Thalès).
Suy ra $\dfrac{AC}{AE}=\dfrac{AK}{AF}$ (nghịch đảo hai vế).
Mà $\dfrac{AB}{AD}=\dfrac{AI}{AF}$ (câu a)
nên $\dfrac{AB}{AD}+\dfrac{AC}{AE}=\dfrac{AI+AK}{AF}$.
Vì $M$ là trung điểm của $IK$ (câu b) và $A$ nằm ngoài đoạn $IK$
nên $AI+AK=2AM$.
Mà $F$ là trung điểm của $AM$ (gt) nên $AM=2AF$.
Do đó $AI+AK=4AF$.
Vậy $\dfrac{AB}{AD}+\dfrac{AC}{AE}=\dfrac{4AF}{AF}=4$.
**cấu hình hình / nghi vấn:**
Đề thêm: "(không song song với $BC$)" và "các cạnh $AB$, $AC$" — nếu $DE\parallel BC$ thì $I=K=M$, ý b) suy biến (hệ thức c) vẫn đúng: $2+2=4$). Bản in chỉ ghi "đường thẳng bất kì cắt $AB$, $AC$".
Hình: $A$ trên, $B$ trái, $C$ phải, $M$ trung điểm $BC$, $F$ trung điểm $AM$ (gạch 2 gạch cho $AF=FM$, 1 gạch cho $BM=MC$ — đều là giả thiết); $D=A+0{,}62\overrightarrow{AB}$, $E$ = giao $DF$ với $AC$ ⇒ $AB/AD=1{,}613$, $AC/AE=2{,}387$ (tổng đúng $4$); $I$ nằm giữa $F$ và $M$, $K$ nằm bên dưới $M$ (kéo dài $AM$), $BI\parallel DE\parallel CK$ dựng đúng. KHÔNG gạch/ghi $MI=MK$ (điều cần chứng minh).
Cách chứng minh ý b): cách thông thường là hai tam giác $BMI$ và $CMK$ bằng nhau (g.c.g) nhưng đòi $I$, $K$ ở hai phía của $M$ (cấu hình) mà đề không nói — nên dùng điểm đối xứng $K'$ + hình bình hành + tiên đề Ơ-clit, không phụ thuộc hình vẽ; vẫn trong whitelist.
Chỗ thừa nhận cấu hình ở ý a), c): "$F$ nằm giữa $A$ và $I$ ($K$)" — đúng với $D$, $E$ thuộc cạnh (đã kiểm 10 bộ ngẫu nhiên) nhưng lời giải không chứng minh vì vị trí này hiển nhiên trên hình; nếu Thùy muốn chứng minh thì cần thêm một nhánh.
Verify (kiem_G2.mjs): 10 bộ ngẫu nhiên ($D\in AB$, $E\in AC$ đoạn) × (F giữa A,I và A,K; I,K cùng tia AM; $BI\parallel CK$; $DF\parallel BI$; $EF\parallel CK$; a) $AB/AD=AI/AF$; $AC/AE=AK/AF$; b) $M$ giữa $I,K$ và $MI=MK$; $K'$ = đối xứng $I$ qua $M$ thì $BICK'$ hình bình hành và $K'=K$; $AI+AK=2AM$; $AM=2AF$; c) tổng $=4$) — PASS hết.
Trạm soát: nhãn $I$ dời sang phải điểm $I$ (bản cũ đè lên nét $BI$) — vẽ lại bằng `ve_G2_soat.mjs`.
**hinh:** TL3-3.png

### VN1a → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 15,3
**noi_dung:**
Cho tam giác $ABC$, điểm $I$ thuộc cạnh $AB$, điểm $K$ thuộc cạnh $AC$ sao cho $\widehat{AKI}=\widehat{ACB}$.
Biết $AI=17$, $IB=10$ và $KC=9$.
Tính $x=AK$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai góc đồng vị $\widehat{AKI}$ và $\widehat{ACB}$ bằng nhau nên $IK\parallel BC$; có song song rồi mới dùng được định lí Thalès.

**Bước 1.** Nhận ra song song: $\widehat{AKI}=\widehat{ACB}$ là hai góc ở vị trí đồng vị (cát tuyến $AC$ cắt $IK$ và $BC$), nên $IK\parallel BC$.

**Bước 2.** Chọn hệ thức Thalès trong $\triangle ABC$ chứa đoạn cần tìm $AK$ cùng ba đoạn đã biết $AI$, $IB$, $KC$: $\dfrac{AI}{IB}=\dfrac{AK}{KC}$.

**Bước 3.** Thay $AI=17$, $IB=10$, $KC=9$ vào tỉ lệ thức rồi tính $AK$ bằng tích chéo.

**Chú ý:** $17$ là độ dài đoạn $AI$ và $10$ là đoạn $IB$; nếu muốn dùng cả cạnh $AB$ thì phải lấy $AB=17+10$, đừng gán $17$ cho $AB$.

**Phần 2. Trình bày**
Vì $\widehat{AKI}=\widehat{ACB}$ (gt)
mà hai góc này ở vị trí đồng vị
nên $IK\parallel BC$ (dấu hiệu nhận biết hai đường thẳng song song).
Xét $\triangle ABC$ có:
$I\in AB$, $K\in AC$ (gt);
$IK\parallel BC$ (cmt).
Do đó $\dfrac{AI}{IB}=\dfrac{AK}{KC}$ (định lí Thalès).
Thay số: $\dfrac{17}{10}=\dfrac{AK}{9}$.
Suy ra $AK=\dfrac{17\cdot 9}{10}=15{,}3$.
Vậy $x=AK=15{,}3$.
**cấu hình hình / nghi vấn:**
Đề tài liệu: hình có hai góc đồng vị đánh dấu bằng nhau tại $K$ và $C$ (cung đơn) ⇒ đưa vào đề "$\widehat{AKI}=\widehat{ACB}$" (đúng như ảnh trang t-05).
Hình: $A$ trên, $B$ trái, $C$ phải, $BC$ ngang; dựng đúng $AI:IB=17:10$ và $KC=9$ theo cùng tỉ lệ (cạnh $AB=27s$, $AC=24{,}3s$, $s=8{,}4$ px), $IK$ kéo dài hai phía như ảnh gốc; hai cung đơn tại $K$ ($\widehat{AKI}$) và $C$ ($\widehat{ACB}$); ghi 17, 10, 9 và $x$ (không ghi 15,3).
Verify (kiem_G2.mjs): 4 tam giác ngẫu nhiên ($AB=27$, $AC=24{,}3$): $AI=17$, $IB=10$, $KC=9$; $\widehat{AKI}=\widehat{ACB}$; $IK\parallel BC$; $AI/IB=AK/KC$; $AK=15{,}3$; suy ngược từ dữ kiện đề cho $AK=15{,}3$ — PASS hết.
**hinh:** VN1a.png

### VN1b → HH00142
**loai_cau:** tra_loi_ngan
**dap_an:** 28
**noi_dung:**
Cho tam giác $PQR$, điểm $E$ thuộc cạnh $PQ$, điểm $F$ thuộc cạnh $PR$.
Biết $\widehat{QEF}=115^\circ$, $\widehat{EQR}=65^\circ$, $PE=16$, $PF=20$ và $FR=15$.
Tính $x=PQ$.
**loi_giai:**
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề không cho song song; hai góc trong cùng phía $\widehat{QEF}$ và $\widehat{EQR}$ có tổng $180^\circ$ nên $EF\parallel QR$, rồi mới áp dụng định lí Thalès.

**Bước 1.** Nhận ra song song: $\widehat{QEF}$ và $\widehat{EQR}$ ở vị trí trong cùng phía (cát tuyến $PQ$ cắt $EF$ và $QR$) và có tổng $115^\circ+65^\circ=180^\circ$, nên $EF\parallel QR$.

**Bước 2.** Tính cạnh $PR$ từ hai đoạn kề nhau: $F$ nằm giữa $P$ và $R$ nên $PR=PF+FR$.

**Bước 3.** Chọn hệ thức Thalès trong $\triangle PQR$ chứa đoạn cần tìm $PQ$ (cả cạnh) cùng các đoạn $PE$, $PF$, $PR$: $\dfrac{PE}{PQ}=\dfrac{PF}{PR}$.

**Bước 4.** Thay số $PE=16$, $PF=20$, $PR$ vừa tính vào tỉ lệ thức rồi tính $PQ$ bằng tích chéo.

**Chú ý:** $x$ là cả cạnh $PQ$ (mũi tên $x$ chạy từ $P$ đến $Q$), không phải $EQ$; và $20$ chỉ là đoạn $PF$, chưa phải cả cạnh $PR$.

**Phần 2. Trình bày**
Ta có $\widehat{QEF}+\widehat{EQR}=115^\circ+65^\circ=180^\circ$ (gt).
Hai góc này ở vị trí trong cùng phía
nên $EF\parallel QR$ (dấu hiệu nhận biết hai đường thẳng song song).
Vì $F$ thuộc cạnh $PR$ (gt) nên $PR=PF+FR=20+15=35$.
Xét $\triangle PQR$ có:
$E\in PQ$, $F\in PR$ (gt);
$EF\parallel QR$ (cmt).
Do đó $\dfrac{PE}{PQ}=\dfrac{PF}{PR}$ (định lí Thalès).
Thay số: $\dfrac{16}{PQ}=\dfrac{20}{35}$.
Suy ra $PQ=\dfrac{16\cdot 35}{20}=28$.
Vậy $x=PQ=28$.
**cấu hình hình / nghi vấn:**
Đề tài liệu: ảnh ghi góc $115^\circ$ tại $E$ (góc $QEF$, trong tam giác) và $65^\circ$ tại $Q$ (góc $EQR$), $16$ trên $PE$, $20$ trên $PF$, $15$ trên $FR$, mũi tên $x$ song song $PQ$ chỉ cả cạnh $PQ$ — đưa tất cả vào đề bằng chữ.
Hình: dựng đúng $\widehat{EQR}=65^\circ$ (đo bằng hàm góc: $65{,}00^\circ$), $PQ:PR=28:35$, $PE=16$, $PF=20$, $FR=15$ cùng tỉ lệ ($s=7$ px) ⇒ $EF\parallel QR$ và $\widehat{QEF}=115^\circ$ đúng; hai cung góc kèm số $115^\circ$, $65^\circ$ ghi trong tam giác; mũi tên $x$ đặt ngoài cạnh $PQ$, song song $PQ$. Không ghi 28.
Verify (kiem_G2.mjs): 4 bộ ($PQ=28$, $PR=35$, $\widehat{Q}=65^\circ$): $PE=16$, $PF=20$, $FR=15$; $\widehat{EQR}=65^\circ$; $\widehat{QEF}=115^\circ$; hai góc bù nhau; $EF\parallel QR$; $PE/PQ=PF/PR$; $PR=35$; $PQ=28$ — PASS hết.
**hinh:** VN1b.png
