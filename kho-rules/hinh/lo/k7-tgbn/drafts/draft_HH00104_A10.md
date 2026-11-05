### TL3.2 → HH00104
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ cân tại $A$.
Kẻ đường thẳng $d$ song song với $BC$, cắt $AB$, $AC$ lần lượt tại $D$, $E$.
Chứng minh rằng $\triangle ADE$ cân.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Muốn chứng minh tam giác cân thì chứng minh hai góc bằng nhau; có $d\parallel BC$ nên dùng các góc đồng vị, và $\triangle ABC$ cân nên hai góc đáy bằng nhau.

**Bước 1.** Từ $DE\parallel BC$, tìm hai cặp góc đồng vị: $\widehat{ADE}$ với $\widehat{ABC}$ và $\widehat{AED}$ với $\widehat{ACB}$.

**Bước 2.** Dùng $\triangle ABC$ cân tại $A$ để có hai góc đáy $\widehat{ABC}=\widehat{ACB}$.

**Bước 3.** Ghép hai bước trên, suy ra hai góc $\widehat{ADE}$ và $\widehat{AED}$ bằng nhau.

**Bước 4.** Hai góc bằng nhau nằm ở $D$ và $E$ nên tam giác cân tại đỉnh còn lại, đó là $A$.

**Chú ý:** Bài này chỉ cần so sánh góc, không cần dựng tam giác bằng nhau.

**Phần 2. Trình bày**
Vì $DE\parallel BC$ (gt) nên:
$\widehat{ADE}=\widehat{ABC}$ (hai góc đồng vị);
$\widehat{AED}=\widehat{ACB}$ (hai góc đồng vị).
Mà $\widehat{ABC}=\widehat{ACB}$ (tính chất tam giác cân)
nên $\widehat{ADE}=\widehat{AED}$.
Vậy $\triangle ADE$ cân tại $A$ (dấu hiệu nhận biết tam giác cân).
**cấu hình hình / nghi vấn:**
Hình: $\triangle ABC$ cân tại $A$ (đỉnh trên, đáy $BC$ ngang, không đều); $D\in AB$, $E\in AC$ với $AD/AB=AE/AC=0{,}45$ nên $DE\parallel BC$ đúng; đường thẳng $d$ vẽ qua $D$, $E$ kéo dài hai phía, ghi nhãn $d$. Có gạch bằng nhau trên $AB$, $AC$ (dữ kiện "cân tại $A$"). Không đánh dấu hai góc $D$, $E$ (điều phải chứng minh). Tài liệu gốc không có hình cho câu này, hình do tôi dựng từ đề.
Verify (kiem_A10.mjs, 4 tam giác cân × 3 vị trí $d$): $DE\parallel BC$, $\widehat{ADE}=\widehat{ABC}$, $\widehat{AED}=\widehat{ACB}$, $AD=AE$ — PASS hết.
Chỉ dùng: góc đồng vị, tính chất và dấu hiệu tam giác cân (trong whitelist). Không có nghi vấn.
**hinh:** HH00104_TL3-2.png

### TL3.3 → HH00104
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ cân tại $A$.
Kẻ đường thẳng $d$ song song với $AC$, cắt $AB$, $BC$ lần lượt tại $D$, $E$.
Chứng minh rằng $\triangle BDE$ cân.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $DE\parallel AC$ cho góc đồng vị $\widehat{BED}=\widehat{BCA}$; $\triangle ABC$ cân tại $A$ cho $\widehat{BCA}=\widehat{ABC}$, mà $\widehat{ABC}$ cũng chính là góc $\widehat{DBE}$ của $\triangle BDE$.

**Bước 1.** Từ $DE\parallel AC$, nêu cặp góc đồng vị $\widehat{BED}=\widehat{BCA}$ (hai góc cùng nhìn lên cạnh $BC$).

**Bước 2.** Dùng $\triangle ABC$ cân tại $A$ để có $\widehat{BCA}=\widehat{ABC}$.

**Bước 3.** Nhận ra $\widehat{ABC}$ và $\widehat{DBE}$ là cùng một góc (vì $D$ thuộc tia $BA$, $E$ thuộc tia $BC$).

**Bước 4.** Suy ra $\widehat{BED}=\widehat{DBE}$; hai góc này ở $E$ và $B$ nên tam giác cân tại $D$.

**Chú ý:** Tam giác cân là $\triangle BDE$ cân tại $D$ (đỉnh $D$), không phải cân tại $B$.

**Phần 2. Trình bày**
Vì $DE\parallel AC$ (gt) nên $\widehat{BED}=\widehat{BCA}$ (hai góc đồng vị).
Mà $\widehat{BCA}=\widehat{ABC}$ (tính chất tam giác cân)
và $\widehat{ABC}=\widehat{DBE}$ ($D$ thuộc tia $BA$, $E$ thuộc tia $BC$)
nên $\widehat{BED}=\widehat{DBE}$.
Vậy $\triangle BDE$ cân tại $D$ (dấu hiệu nhận biết tam giác cân).
**cấu hình hình / nghi vấn:**
Hình: $\triangle ABC$ cân tại $A$ (không đều); $D\in AB$, $E\in BC$ với $BD/BA=BE/BC=0{,}6$ nên $DE\parallel AC$ đúng; đường thẳng $d$ qua $D$, $E$ kéo dài hai phía, ghi nhãn $d$; gạch bằng nhau trên $AB$, $AC$ (dữ kiện "cân tại $A$"). Không đánh dấu hai góc $B$, $E$ (điều phải chứng minh). Tài liệu gốc không có hình, hình dựng từ đề.
Verify (kiem_A10.mjs, 4 tam giác × 3 vị trí): $DE\parallel AC$, $\widehat{BED}=\widehat{BCA}$, $\widehat{DBE}=\widehat{ABC}$, $DB=DE$ — PASS hết.
Chỉ dùng góc đồng vị + tính chất/dấu hiệu tam giác cân. Không có nghi vấn.
**hinh:** HH00104_TL3-3.png

### TL3.4 → HH00104
**loai_cau:** tu_luan
**noi_dung:**
Cho $\triangle ABC$ cân tại $A$ có $\widehat{A}$ nhọn.
Kẻ $BD$, $CE$ lần lượt vuông góc với $AC$, $AB$ ($D\in AC$, $E\in AB$).
a) Chứng minh $\triangle ADE$ cân tại $A$.
b) Gọi $BD$ cắt $CE$ tại $I$. Chứng minh rằng $\triangle IBC$ cân.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** Hai tam giác vuông $ABD$ và $ACE$ có cạnh huyền $AB=AC$ và chung góc $A$ nên bằng nhau; từ đó có $AD=AE$ (ý a) và $\widehat{ABD}=\widehat{ACE}$ (dùng cho ý b).

**Bước 1.** Ý a) Chứng minh $\triangle ABD=\triangle ACE$ bằng trường hợp cạnh huyền – góc nhọn (ch - gn).

**Bước 2.** Ý a) Từ hai tam giác bằng nhau suy ra $AD=AE$, rồi kết luận $\triangle ADE$ cân tại $A$ theo dấu hiệu hai cạnh bằng nhau.

**Bước 3.** Ý b) Dùng lại kết quả ý a): $\widehat{ABD}=\widehat{ACE}$ (hai góc tương ứng), và $\widehat{ABC}=\widehat{ACB}$ (tam giác cân).

**Bước 4.** Ý b) Trừ hai đẳng thức góc trên: $\widehat{IBC}=\widehat{ABC}-\widehat{ABD}$ và $\widehat{ICB}=\widehat{ACB}-\widehat{ACE}$, rút ra $\widehat{IBC}=\widehat{ICB}$ nên $\triangle IBC$ cân tại $I$.

**Chú ý:** Khi $\widehat{A}$ nhọn, $D$ thuộc cạnh $AC$ và $E$ thuộc cạnh $AB$ nên tia $BD$ nằm giữa hai tia $BA$, $BC$ (tương tự tia $CE$); đó là lý do được phép trừ góc ở ý b).

**Phần 2. Trình bày**
a) Xét $\triangle ABD$ và $\triangle ACE$ có:
$\widehat{ADB}=\widehat{AEC}=90^\circ$ (gt);
$AB=AC$ ($\triangle ABC$ cân tại $A$);
$\widehat{A}$ chung.
Do đó $\triangle ABD=\triangle ACE$ (ch - gn).
Suy ra $AD=AE$ (hai cạnh tương ứng).
Vậy $\triangle ADE$ cân tại $A$ (dấu hiệu nhận biết tam giác cân).

b) Vì $\triangle ABD=\triangle ACE$ (cmt) nên $\widehat{ABD}=\widehat{ACE}$ (hai góc tương ứng).
Vì $\triangle ABC$ cân tại $A$ nên $\widehat{ABC}=\widehat{ACB}$ (tính chất tam giác cân).
Tia $BD$ nằm giữa hai tia $BA$, $BC$ và $I$ thuộc tia $BD$, nên:
$\widehat{IBC}=\widehat{ABC}-\widehat{ABD}$.
Tương tự, tia $CE$ nằm giữa hai tia $CA$, $CB$ và $I$ thuộc tia $CE$, nên:
$\widehat{ICB}=\widehat{ACB}-\widehat{ACE}$.
Từ các đẳng thức trên suy ra $\widehat{IBC}=\widehat{ICB}$.
Vậy $\triangle IBC$ cân tại $I$ (dấu hiệu nhận biết tam giác cân).
**cấu hình hình / nghi vấn:**
Hình: $\triangle ABC$ cân tại $A$ (đỉnh $A$ nhọn, không đều); $D=$ chân đường vuông góc hạ từ $B$ xuống $AC$, $E=$ chân hạ từ $C$ xuống $AB$; vẽ ô vuông ở $D$ và $E$ (đúng dữ kiện đề), vẽ cả đoạn $DE$ (cần cho ý a)), $I=BD\cap CE$; gạch bằng nhau trên $AB$, $AC$. Không đánh dấu $AD=AE$, $\widehat{IBC}=\widehat{ICB}$ (điều phải chứng minh). Tài liệu gốc không có hình.
NGHI VẤN (đã xử lý): đề gốc không nói $\widehat{A}$ nhọn. Nếu $\widehat{A}$ tù thì $D$, $E$ nằm NGOÀI cạnh $AC$, $AB$ ("$\widehat{A}$ chung" và phép trừ góc ở ý b) sai), đã kiểm bằng toạ độ. Tôi thêm "có $\widehat{A}$ nhọn" và "$D\in AC$, $E\in AB$" vào đề cho lời giải đúng; điều phối quyết định giữ hay bỏ (nếu bỏ thì cần ghi chú đề lấy hình nhọn như thường lệ). Với $\widehat{A}=90^\circ$ thì $D\equiv E\equiv A$, không có tam giác $ADE$ — càng cần điều kiện nhọn.
Verify (kiem_A10.mjs, 4 tam giác nhọn × 3 lần lặp): $BD\perp AC$, $CE\perp AB$, $D\in AC$, $E\in AB$, $AB=AC$, $\widehat{BAD}=\widehat{CAE}$, $BD=CE$, $AD=AE$, $\widehat{ABD}=\widehat{ACE}$, tia $BD$/$CE$ nằm giữa, $I\in BD\cap CE$ (trong đoạn), $\widehat{IBC}=\widehat{ABC}-\widehat{ABD}$, $\widehat{ICB}=\widehat{ACB}-\widehat{ACE}$, $\widehat{IBC}=\widehat{ICB}$, $IB=IC$ — PASS hết.
Công cụ: (ch - gn), tính chất/dấu hiệu tam giác cân, trừ góc (tia nằm giữa) — trong whitelist. Không dùng "phân giác/đường cao trùng nhau".
**hinh:** HH00104_TL3-4.png

### VN.1 → HH00104
**loai_cau:** tu_luan
**noi_dung:**
Cho tam giác $ABC$ cân tại $A$.
Tính số đo các góc còn lại của tam giác biết:
a) $\widehat{B}=70^\circ$;
b) $\widehat{A}=50^\circ$;
c) $\widehat{B}=\widehat{A}$.
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $\triangle ABC$ cân tại $A$ nên hai góc đáy $\widehat{B}$, $\widehat{C}$ bằng nhau; cộng với tổng ba góc $180^\circ$ là đủ để tính mọi trường hợp.

**Bước 1.** Ý a) Biết góc đáy $\widehat{B}$, suy ra $\widehat{C}=\widehat{B}$, rồi tính $\widehat{A}$ từ tổng ba góc.

**Bước 2.** Ý b) Biết góc ở đỉnh $\widehat{A}$, suy ra tổng hai góc đáy là $180^\circ-\widehat{A}$ rồi chia đôi.

**Bước 3.** Ý c) Từ $\widehat{B}=\widehat{A}$ và $\widehat{B}=\widehat{C}$ suy ra ba góc bằng nhau.

**Bước 4.** Ý c) Dùng tổng ba góc bằng $180^\circ$ để tính số đo mỗi góc.

**Chú ý:** Cân tại $A$ thì hai góc bằng nhau là $\widehat{B}$ và $\widehat{C}$ (hai góc ở đáy), không phải $\widehat{A}$.

**Phần 2. Trình bày**
a) Vì $\triangle ABC$ cân tại $A$ nên $\widehat{C}=\widehat{B}=70^\circ$ (tính chất tam giác cân).
Xét $\triangle ABC$ có $\widehat{A}+\widehat{B}+\widehat{C}=180^\circ$ (tổng ba góc của tam giác)
nên $\widehat{A}=180^\circ-70^\circ-70^\circ=40^\circ$.
Vậy $\widehat{C}=70^\circ$, $\widehat{A}=40^\circ$.

b) Xét $\triangle ABC$ có $\widehat{B}+\widehat{C}=180^\circ-\widehat{A}=180^\circ-50^\circ=130^\circ$ (tổng ba góc của tam giác).
Vì $\triangle ABC$ cân tại $A$ nên $\widehat{B}=\widehat{C}$ (tính chất tam giác cân)
nên $\widehat{B}=\widehat{C}=130^\circ:2=65^\circ$.
Vậy $\widehat{B}=\widehat{C}=65^\circ$.

c) Vì $\triangle ABC$ cân tại $A$ nên $\widehat{B}=\widehat{C}$ (tính chất tam giác cân).
Mà $\widehat{B}=\widehat{A}$ (gt)
nên $\widehat{A}=\widehat{B}=\widehat{C}$.
Xét $\triangle ABC$ có $\widehat{A}+\widehat{B}+\widehat{C}=180^\circ$ (tổng ba góc của tam giác)
nên $3\widehat{A}=180^\circ$, suy ra $\widehat{A}=60^\circ$.
Vậy $\widehat{A}=\widehat{B}=\widehat{C}=60^\circ$.
**cấu hình hình / nghi vấn:**
Hình: một $\triangle ABC$ cân tại $A$ (đỉnh $A$ trên, đáy $BC$ ngang, không đều), gạch bằng nhau trên $AB$, $AC$ (dữ kiện "cân tại $A$"), không ghi số đo nào (ba ý có số đo khác nhau, đáp số không được lộ). Tài liệu gốc không có hình; hình chỉ minh hoạ chung cho cả ba ý.
Verify (kiem_A10.mjs): dựng từ số đo $\widehat{A}=40^\circ,50^\circ,60^\circ$, đọc góc đáy từ toạ độ: $70^\circ$, $65^\circ$, $60^\circ$ — khớp đáp số; kiểm số học $180-70-70=40$, $(180-50)/2=65$, $180/3=60$.
Đáp số: a) $\widehat{C}=70^\circ$, $\widehat{A}=40^\circ$; b) $\widehat{B}=\widehat{C}=65^\circ$; c) $60^\circ$ cả ba góc ($\triangle ABC$ đều). Ý a), b) trùng nội dung HHC001955 (kho trên lớp) nhưng đây là câu bài về nhà → kho luyện, kèm ý c) mới. Không có nghi vấn.
**hinh:** HH00104_VN1.png

### VN.2 → HH00104
**loai_cau:** tu_luan
**noi_dung:**
Tính số đo $x$ trong hình vẽ.
Biết $D$ nằm trên cạnh $BC$, $DA=DB=DC$ và $\widehat{ABC}=35^\circ$ ($x$ là số đo của $\widehat{ACB}$).
**loi_giai:**
**Phần 1. Hướng dẫn**
**Mấu chốt:** $DA=DB$ và $DA=DC$ cho hai tam giác cân tại $D$ ($\triangle DAB$ và $\triangle DAC$); dùng góc đáy của chúng rồi tổng ba góc của $\triangle ABC$ để tìm $x$.

**Bước 1.** Nhận $\triangle DAB$ cân tại $D$ (vì $DA=DB$), suy ra $\widehat{DAB}=\widehat{DBA}=35^\circ$.

**Bước 2.** Nhận $\triangle DAC$ cân tại $D$ (vì $DA=DC$), suy ra $\widehat{DAC}=\widehat{DCA}=x$.

**Bước 3.** Vì $D$ nằm giữa $B$ và $C$ nên tia $AD$ nằm giữa hai tia $AB$, $AC$, do đó $\widehat{BAC}=\widehat{DAB}+\widehat{DAC}=35^\circ+x$.

**Bước 4.** Viết tổng ba góc của $\triangle ABC$ rồi giải phương trình để tìm $x$.

**Chú ý:** Hai tam giác cân đều có đỉnh cân là $D$; đừng nhầm cặp góc đáy.

**Phần 2. Trình bày**
Vì $DA=DB$ (gt) nên $\triangle DAB$ cân tại $D$ (dấu hiệu nhận biết tam giác cân).
Suy ra $\widehat{DAB}=\widehat{DBA}=35^\circ$ (tính chất tam giác cân).
Vì $DA=DC$ (gt) nên $\triangle DAC$ cân tại $D$ (dấu hiệu nhận biết tam giác cân).
Suy ra $\widehat{DAC}=\widehat{DCA}=x$ (tính chất tam giác cân).
Vì $D$ nằm giữa $B$ và $C$ nên tia $AD$ nằm giữa hai tia $AB$, $AC$,
do đó $\widehat{BAC}=\widehat{DAB}+\widehat{DAC}=35^\circ+x$.
Xét $\triangle ABC$ có $\widehat{ABC}+\widehat{ACB}+\widehat{BAC}=180^\circ$ (tổng ba góc của tam giác)
nên $35^\circ+x+(35^\circ+x)=180^\circ$.
Suy ra $2x=110^\circ$, do đó $x=55^\circ$.
Vậy $x=55^\circ$.
**cấu hình hình / nghi vấn:**
Hình vẽ theo ảnh gốc: $A$ góc dưới phải, $C$ dưới trái, $B$ trên (cạnh $BA$ thẳng đứng, $CA$ nằm ngang); $D$ trên $BC$, 1 gạch trên mỗi đoạn $DB$, $DC$, $DA$; số $35^\circ$ ghi trong góc $B$, chữ $x$ ghi trong góc $C$. Ảnh gốc KHÔNG có ô vuông ở $A$ nên không vẽ (hình dựng đúng $\widehat{B}=35^\circ$ với $D$ là trung điểm $BC$; tam giác $ABC$ vuông tại $A$ là hệ quả, lời giải không dùng). Không ghi đáp số.
Đề gốc "Tính số đo $x$ trong hình vẽ" không ghi dữ kiện bằng chữ; tôi đưa dữ kiện từ hình vào đề: $D\in BC$ (nằm giữa $B$, $C$ theo hình), $DA=DB=DC$ (gạch), $\widehat{ABC}=35^\circ$, $x=\widehat{ACB}$ (nhãn $x$ cạnh đỉnh $C$ trong góc $\widehat{ACB}$).
Verify (kiem_A10.mjs, 3 cỡ hình): $DA=DB=DC$, $\widehat{DAB}=35^\circ$, $\widehat{DAC}=\widehat{DCA}=55^\circ$, $\widehat{BAC}=\widehat{DAB}+\widehat{DAC}$, tổng ba góc $=180^\circ$, $x=55^\circ$ — PASS hết.
Đáp số $x=55^\circ$ (cũng phù hợp: $\widehat{A}=90^\circ$ vì $35+55=90$, đúng như hình). Chỉ dùng tính chất tam giác cân + tổng ba góc, trong whitelist. Không có nghi vấn ngoài chi tiết ô vuông ở $A$ nêu trên.
**hinh:** HH00104_VN2.png
