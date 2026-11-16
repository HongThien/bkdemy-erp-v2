// Lời giải viết lại cho ý b, c của bài HHB001455 (gốc HHC000867) — Thùy 16/11 "Viết lại".
// Lời giải cũ chỉ ghi "tương tự Câu 28" (câu khác của tài liệu gốc) ⇒ không tự đứng được.
// Khuôn: spec-giai-bai.md §A6 (câu chứng minh Hình = Sơ đồ tư duy + Phần 2 chia khúc [[so-do:nK]]), dòng liền nhau (§A5),
// K9: không dùng thẳng hệ thức lượng (đi qua tam giác đồng dạng), không dùng đường trung bình (dùng định lí Thalès),
// "ba góc vuông" ⇒ viết qua tổng các góc của tứ giác. LaTeX giữ nguyên nhờ String.raw.
const R = String.raw

export const Y_B = {
  nhan: 'b',
  mau_chot: R`Hai tích $AM\cdot AB$ và $AN\cdot AC$ cùng bằng $AH^2$: mỗi tích lấy từ một cặp tam giác vuông đồng dạng có chung góc nhọn tại $A$.`,
  nut: [
    { k: 'n1', y: '-', tu: ['gt'], noi_dung: R`$\triangle AMH\backsim\triangle AHB$`, ly_do: R`g.g: góc $A$ chung, $\widehat{AMH}=\widehat{AHB}=90^\circ$` },
    { k: 'n2', y: '-', tu: ['n1'], noi_dung: R`$AM\cdot AB=AH^2$`, ly_do: R`hai cặp cạnh tương ứng tỉ lệ: $\dfrac{AM}{AH}=\dfrac{AH}{AB}$` },
    { k: 'n3', y: '-', tu: ['gt'], noi_dung: R`$\triangle ANH\backsim\triangle AHC$`, ly_do: R`g.g: góc $A$ chung, $\widehat{ANH}=\widehat{AHC}=90^\circ$` },
    { k: 'n4', y: '-', tu: ['n3'], noi_dung: R`$AN\cdot AC=AH^2$`, ly_do: R`hai cặp cạnh tương ứng tỉ lệ: $\dfrac{AN}{AH}=\dfrac{AH}{AC}$` },
    { k: 'n5', y: '-', tu: ['n2', 'n4'], noi_dung: R`$AM\cdot AB=AN\cdot AC$`, ly_do: R`hai tích cùng bằng $AH^2$` },
  ],
  loi_giai: R`**Phần 2. Trình bày**
[[so-do:n1]]
Vì $AH$ là đường cao của $\triangle ABC$ (gt)
nên $\widehat{AHB}=\widehat{AHC}=90^\circ$.
Vì $HM\perp AB$ tại $M$ (gt) nên $\widehat{AMH}=90^\circ$.
Xét $\triangle AMH$ và $\triangle AHB$ có:
$\widehat{MAH}=\widehat{HAB}$ (góc chung);
$\widehat{AMH}=\widehat{AHB}=90^\circ$ (cmt)
nên $\triangle AMH\backsim\triangle AHB$ (g.g).
[[so-do:n2]]
Suy ra $\dfrac{AM}{AH}=\dfrac{AH}{AB}$ (hai cặp cạnh tương ứng tỉ lệ).
Do đó $AM\cdot AB=AH^2$ (1).
[[so-do:n3]]
Vì $HN\perp AC$ tại $N$ (gt) nên $\widehat{ANH}=90^\circ$.
Xét $\triangle ANH$ và $\triangle AHC$ có:
$\widehat{NAH}=\widehat{HAC}$ (góc chung);
$\widehat{ANH}=\widehat{AHC}=90^\circ$ (cmt)
nên $\triangle ANH\backsim\triangle AHC$ (g.g).
[[so-do:n4]]
Suy ra $\dfrac{AN}{AH}=\dfrac{AH}{AC}$ (hai cặp cạnh tương ứng tỉ lệ).
Do đó $AN\cdot AC=AH^2$ (2).
[[so-do:n5]]
Từ (1) và (2) suy ra $AM\cdot AB=AN\cdot AC$.
Vậy $AM\cdot AB=AN\cdot AC$.`,
}

export const Y_C = {
  nhan: 'c',
  mau_chot: R`Tứ giác $AMHN$ là hình chữ nhật nên $MN$ đi qua trung điểm $O$ của $AH$; chỉ cần chứng minh $I$ cũng là trung điểm của $AH$. Muốn vậy, gọi $D$ là giao điểm của đường thẳng $CK$ với đường thẳng $AB$, chứng minh $K$ là trung điểm của $CD$ rồi dùng hệ quả của định lí Thalès với $AH\parallel CD$.`,
  nut: [
    { k: 'n1', y: '-', tu: ['gt'], noi_dung: R`$AMHN$ là hình chữ nhật; $O$ là trung điểm của $AH$ và $MN$, $OA=ON$`, ly_do: R`tứ giác có bốn góc vuông; tính chất hai đường chéo của hình chữ nhật` },
    { k: 'n2', y: '-', tu: ['n1', 'gt'], noi_dung: R`$KA=KC$`, ly_do: R`$\widehat{KAC}=\widehat{MNA}=\widehat{HAC}=\widehat{KCA}$ (so le trong vì $AK\parallel MN$, $CK\parallel AH$; $\triangle OAN$ cân tại $O$)` },
    { k: 'n3', y: '-', tu: ['n2', 'gt'], noi_dung: R`$K$ là trung điểm của $CD$`, ly_do: R`$E$ là trung điểm $AC$ thì $KE\perp AC$ nên $KE\parallel AD$; định lí Thalès trong $\triangle CAD$` },
    { k: 'n4', y: '-', tu: ['n3', 'gt'], noi_dung: R`$I$ là trung điểm của $AH$`, ly_do: R`hệ quả của định lí Thalès với $AI\parallel DK$ và $IH\parallel KC$: $\dfrac{AI}{DK}=\dfrac{BI}{BK}=\dfrac{IH}{KC}$` },
    { k: 'n5', y: '-', tu: ['n1', 'n4'], noi_dung: R`$M$, $I$, $N$ thẳng hàng`, ly_do: R`$I$ trùng $O$ mà $O$ thuộc $MN$` },
  ],
  loi_giai: R`**Phần 2. Trình bày**
[[so-do:n1]]
Vì $HM\perp AB$ tại $M$ và $HN\perp AC$ tại $N$ (ý b)
nên $\widehat{AMH}=\widehat{ANH}=90^\circ$.
Tứ giác $AMHN$ có $\widehat{MAN}=90^\circ$ (gt),
$\widehat{AMH}=\widehat{ANH}=90^\circ$ (cmt)
nên $\widehat{MHN}=360^\circ-3\cdot90^\circ=90^\circ$ (tổng các góc của tứ giác).
Do đó $AMHN$ là hình chữ nhật (tứ giác có bốn góc vuông).
Gọi $O$ là giao điểm của $AH$ và $MN$.
Suy ra $O$ là trung điểm của $AH$ và $OA=ON$
(tính chất hai đường chéo của hình chữ nhật).
[[so-do:n2]]
Vì $OA=ON$ (cmt) nên $\triangle OAN$ cân tại $O$.
Suy ra $\widehat{ONA}=\widehat{OAN}$, tức là $\widehat{MNA}=\widehat{HAC}$ (1).
Vì $AK\parallel MN$ (gt)
nên $\widehat{KAC}=\widehat{MNA}$ (hai góc so le trong) (2).
Vì $CK\parallel AH$ (gt)
nên $\widehat{KCA}=\widehat{HAC}$ (hai góc so le trong) (3).
Từ (1), (2) và (3) suy ra $\widehat{KAC}=\widehat{KCA}$.
Do đó $\triangle KAC$ cân tại $K$, nên $KA=KC$.
[[so-do:n3]]
Gọi $D$ là giao điểm của đường thẳng $CK$ và đường thẳng $AB$.
Gọi $E$ là trung điểm của $AC$.
Vì $\triangle KAC$ cân tại $K$ (cmt)
nên trung tuyến $KE$ cũng là đường cao, tức là $KE\perp AC$.
Mà $AD\perp AC$ (vì $\widehat{BAC}=90^\circ$) nên $KE\parallel AD$.
Xét $\triangle CAD$ có $E\in CA$, $K\in CD$ và $EK\parallel AD$ (cmt)
nên $\dfrac{CK}{CD}=\dfrac{CE}{CA}=\dfrac12$ (định lí Thalès).
Do đó $K$ là trung điểm của $CD$, tức là $DK=KC$.
[[so-do:n4]]
Vì $CK\parallel AH$ (gt) và $D$ thuộc đường thẳng $CK$
nên $AI\parallel DK$ và $IH\parallel KC$.
Xét $\triangle BDK$ có $A\in BD$, $I\in BK$ và $AI\parallel DK$
nên $\dfrac{AI}{DK}=\dfrac{BI}{BK}$ (hệ quả của định lí Thalès) (4).
Xét $\triangle BKC$ có $I\in BK$, $H\in BC$ và $IH\parallel KC$
nên $\dfrac{IH}{KC}=\dfrac{BI}{BK}$ (hệ quả của định lí Thalès) (5).
Từ (4) và (5) suy ra $\dfrac{AI}{DK}=\dfrac{IH}{KC}$.
Mà $DK=KC$ (cmt) nên $AI=IH$.
Mà $I$ thuộc đoạn thẳng $AH$ nên $I$ là trung điểm của $AH$.
[[so-do:n5]]
Vì $O$ và $I$ cùng là trung điểm của $AH$ (cmt)
nên $I$ trùng với $O$.
Mà $O$ thuộc $MN$ nên $I$ thuộc đường thẳng $MN$.
Vậy ba điểm $M$, $I$, $N$ thẳng hàng.`,
}
