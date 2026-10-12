KẾT LUẬN: ĐẠT

# GKI-25 — biên bản soát (THCS Nguyễn Trường Tộ, giữa học kì 1 Toán 8, 2025–2026)

- **Số câu:** 17 (8 trắc nghiệm · 2 trả lời ngắn · 7 tự luận). Đề scan 2 trang, không in đáp án ⇒ hai nguồn: bản soạn và lượt giải mù (`GKI-25.kiem.md`, máy kiểm `<LV>\tam\s_kiem.mjs`).
- **Khớp đáp án Pha 1 ngay từ đầu:** 17 / 17 (Bài 4 cùng hướng chứng minh; Bài 5 hai bên đi hai đường khác nhau, cả hai đều đúng — đã thay số kiểm).
- **Chép đề:** 17 / 17 đúng ảnh (đối chiếu bản cắt 300 dpi: số mũ, dấu, phương án, tên điểm). Lỗi in "của của $NK$" ở Bài 4b trạm soạn đã sửa và ghi chú.
- **Số câu phải sửa:** 4 (Câu 8, Bài 2a, Bài 4, Bài 5) — không câu nào sai đáp số. Bản trước khi sửa: `GKI-25.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (17 câu, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 8 | kiến thức | Phần 2: bỏ câu "$AC=BD$ chỉ đúng khi $ABCD$ là hình chữ nhật; $AB=AD$ chỉ đúng khi là hình thoi", thay bằng "hai đường chéo, hai cạnh kề, một cạnh và một đường chéo của hình bình hành không nhất thiết bằng nhau" | Đề chỉ chạm tới hình bình hành; dấu hiệu nhận biết hình chữ nhật / hình thoi là bài sau (k8.md §10) |
| Bài 2a | lập luận | Mấu chốt: "hạng tử bậc cao nhất sẽ triệt tiêu" ⇒ "tích của $2xy^2$ với hạng tử đầu tiên trong ngoặc sẽ triệt tiêu" | Hạng tử triệt tiêu là $6x^3y^2$ (bậc 5), còn hạng tử bậc cao nhất là $18x^2y^4$ (bậc 6) vẫn còn trong kết quả |
| Bài 4 | lập luận | Phần 1 Bước 3 + Phần 2: "kéo dài $BN$ cắt $HD$ tại $E$" ⇒ "$E$ là giao điểm của $BN$ với **đường thẳng** $HD$"; thêm lí do "(cùng vuông góc với $AD$)" cho $BN\parallel KQ$ và "(các cạnh đối song song)" cho hình bình hành $ENKQ$ | $E$ nằm giữa $B$ và $N$, trên tia đối của tia $HD$ — không phải kéo dài $BN$, và $E$ không thuộc đoạn $HD$; hai khẳng định hình chưa kèm lí do |
| Bài 4 | ghi chú | Xoá dòng `Chưa chắc` của trạm soạn; ghi vào `Ghi chú` rằng thứ tự điểm ở ý c lấy theo hình vẽ, đã chứng minh và kiểm máy | Xem mục "Bài 4 ý c" dưới |
| Bài 4 | hình | `giai_bai4.png`: dời nhãn $E$ vào trong tam giác $BEH$ (chỗ cũ đè lên cạnh $AB$); dời nhãn $D$ sang phải điểm $D$ (chỗ cũ cách mép dưới chưa tới 35px). Bản `ve.mjs` cũ giữ ở `<LV>\tam\ve.goc.mjs` | Nhãn không được đè đường, chừa ≥ 35px dưới nhãn đáy |
| Bài 5 | định dạng | Thêm dòng khai triển 12 hạng tử của $(a^2+2ab+b^2)(a^3+3a^2b+3ab^2+b^3)$ trước dòng kết quả $(a+b)^5$ | Bản soạn nhảy thẳng từ tích hai đa thức sang kết quả; khuôn nhân đa thức với đa thức cần dòng khai triển tường minh (k8.md §2, B4 D3) |
| Ghi chú cho người duyệt | ghi chú | "hình không vẽ đoạn $NK$" ⇒ "chỉ vẽ đoạn $NM$, không vẽ $MK$" | Đúng với hình thật |

## Bài 4 ý c — lượt tự giải của trạm soát (theo yêu cầu riêng)

Pha 1 tự tìm lời giải trong phạm vi đề (tới hình bình hành, không đường trung bình), ra hai cách:

1. **Hình bình hành $ENKQ$** (trùng cách của trạm soạn): $ANKC$ là hình bình hành ⇒ $NK\parallel AC$ ⇒ $MN\perp AB$ ⇒ $N$ là trực tâm $\triangle ABM$ ⇒ $BN\perp AD$ ⇒ $BN\parallel KQ$; $NHDK$ là hình bình hành ⇒ $NK\parallel HD$; $E=BN\cap HD$ ⇒ $ENKQ$ có các cạnh đối song song ⇒ hai góc đối bằng nhau.
2. **Góc ngoài của hai tam giác vuông:** $\widehat{BNM}=90^\circ+\widehat{NMA}$, $\widehat{KQH}=90^\circ+\widehat{ADH}$, $\widehat{NMA}=\widehat{ADH}$ (đồng vị).

Cách 2 không cần điểm $E$ nhưng dựa vào **6** điều về vị trí điểm đọc từ hình (chân đường vuông góc nằm trong đoạn nào, tia nào trùng tia nào…); cách 1 chỉ cần **2** điều. Không tìm được cách nào gọn và chặt hơn cách 1 ⇒ **giữ cách của trạm soạn**, không thay.

Hai điều về thứ tự điểm của cách 1 đều chứng minh được (không đưa vào Phần 2 vì học sinh lớp 8 không trình bày phần này, đã ghi ở `Ghi chú` của câu):

- **$E$ nằm giữa $B$ và $N$:** $H$ nằm giữa $B$ và $C$ nên $B$, $C$ khác phía đối với đường thẳng $HD$. $NK\parallel HD$ nên $N$, $K$ cùng phía; đoạn $CK$ nằm trong đoạn $CD$, chỉ gặp đường thẳng $HD$ tại $D\neq K$, nên $K$, $C$ cùng phía. Vậy $B$ và $N$ khác phía đối với $HD$ ⇒ đoạn $BN$ cắt đường thẳng $HD$ tại $E$ nằm giữa $B$ và $N$.
- **$H$ nằm giữa $E$ và $Q$:** $E$ thuộc đoạn $BN$ (khác $N$) nên cùng phía với $B$ đối với đường thẳng $AH$; $D$ cùng phía với $C$ (vì $CD\parallel AH$); $B$, $C$ khác phía ⇒ $E$, $D$ khác phía đối với $AH$ ⇒ $H$ nằm giữa $E$ và $D$; $Q$ thuộc tia $HD$ ⇒ $H$ nằm giữa $E$ và $Q$.

Máy (`s_kiem.mjs`, 2000 tam giác vuông ngẫu nhiên có $AB<AC$): $BN\perp AM$, $E$ nằm giữa $B$ và $N$, $E$ trên tia đối của tia $HD$, $Q$ nằm trong đoạn $HD$, $\widehat{BNM}=\widehat{KQH}$ — đúng cả 2000.

⇒ Dòng `Chưa chắc` của trạm soạn ("không chứng minh thứ tự điểm; đáp án gốc có thể đi cách khác") **đã kiểm chắc chắn đúng, xoá**.

## Các điểm đã soát, không phải sửa

- Luật kiến thức: không đường trung bình (mọi quan hệ song song ở Bài 4 đều qua hình bình hành: $HNCK$, $ANKC$, $NHDK$, $ENKQ$), không hình chữ nhật / trung tuyến ứng cạnh huyền, không Pythagore; "ba đường cao đồng quy" là Hình 7. Bài 5 chỉ đặt thừa số chung theo tính chất phân phối (được phép), không dùng phương pháp phân tích nhân tử của Chương II. Tìm $x$ không viết "phương trình", "tập nghiệm".
- Phân loại: Câu 6, 7, 8 và Bài 4 `hinh_hoc`, còn lại `dai`. Bài 2, Bài 3 tách ý (các ý độc lập); Bài 1 (chung dữ kiện), Bài 4 (hình), Bài 5 giữ một câu. Bài 3a ($-2$), 3b ($0$) trả lời ngắn; Bài 3c ($\dfrac{27}{8}$) tự luận.
- Phần 1: mọi câu 3–6 bước, không lộ đáp số cuối; Bài 4 đi theo chiều phân tích đi lên và Phần 2 đi ngược lại, khớp từng mắt xích.
- Hình giải `giai_bai4.png`: dựng đúng dữ kiện ($a^2=bc$, $AB<AC$, $M$, $N$, $K$ là trung điểm, $KQ\perp AD$), đủ 10 điểm, chỉ đánh dấu giả thiết.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
