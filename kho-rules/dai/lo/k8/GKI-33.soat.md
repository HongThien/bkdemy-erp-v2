KẾT LUẬN: ĐẠT

# Biên bản soát GKI-33 — THCS Chu Văn An, phường Yên Sở (đề số 2 — đề chính thức), giữa học kì 1 Toán 8, 2025–2026

- Trạm soát: Opus (giải mù Pha 1 → `GKI-33.kiem.md`; máy kiểm `<LV>/tam/soat-kiem.mjs`: thay số ngẫu nhiên mọi câu Đại, toạ độ 4 bộ $(AB, AC)$ cho Bài 5 — tất cả OK).
- Đề: scan 1 trang, 6 bài tự luận, **không có** bảng đáp án in. Đọc lại từ ảnh cắt 300 dpi (`tam/s1.png`, `s2.png`, `s3.png`).
- **Số câu: 10** (Bài 1 · 2.1a · 2.1b · 2.1c · 2.2 · 3.1 · 3.2 · 4 · 5 · 6) — 9 tự luận, 1 trả lời ngắn (Bài 6).
- **Khớp đáp án Pha 1 ngay từ đầu: 10/10.**
- **Số câu phải sửa: 2** (Bài 4 — định dạng; Bài 5 — lập luận + hình). Bản gốc trước khi sửa: `GKI-33.soan.goc.md`.
- Cổng: `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (10 câu, chưa chắc 1).

## Đã soát, không sửa

- **Chép đề:** 10/10 câu đúng ảnh (số mũ, dấu, ngoặc, tên điểm, đủ ý; không sót câu). Chỉ chuẩn hoá hình thức (bỏ điểm số, thêm dấu "?", đơn vị).
- **Phân loại:** `kho` đúng (Bài 5 `hinh_hoc`; Bài 4 bối cảnh thửa ruộng vẫn là `dai`). Tách ý đúng luật (Bài 2.1 a b c và Bài 3 ý 1, 2 độc lập ⇒ tách; Bài 1, 2.2, 4, 5 chung dữ kiện ⇒ giữ một câu). Bài 3.1, 3.2 đáp số $-\dfrac{1}{2}$ ⇒ `tu_luan`; Bài 6 đáp số $25$ ⇒ `tra_loi_ngan`.
- **Luật kiến thức:** đề chạm hằng đẳng thức (Bài 2.2, 3.2) và hình chữ nhật (Bài 5.1) ⇒ dùng bình phương một tổng / hiệu, hiệu hai bình phương, tính chất đường chéo hình chữ nhật, trung tuyến ứng với cạnh huyền là hợp lệ. Không có đường trung bình, Thalès, đồng dạng, Pythagore, "phương trình – tập nghiệm" — kể cả dùng ngầm. Bài 5.1 đi qua tổng góc $360^\circ$ + định nghĩa (không dùng "ba góc vuông"). Bài 6 đặt $-2$ làm thừa số chung là tính chất phân phối.
- **Bài 5 ý 2:** bản soạn tự chứng minh $OI\parallel AF$ bằng đường trung trực ($OH=OM$, $IH=IM$ ⇒ $OI\perp HM$) — trùng với cách giải mù của trạm soát, chặt, chỉ dùng kiến thức lớp 7 + hình bình hành. Giữ nguyên + giữ dòng `Chưa chắc` cho CEO.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 4 (ý 2) | định dạng | Thêm hai dòng $10x-x^2=441-416$ và $10x-x^2=25$ giữa $416+10x-x^2=441$ và $x^2-10x+25=0$ | Bản soạn gộp hai lần chuyển vế + đổi dấu vào một dòng; khuôn Phần 2 yêu cầu mỗi phép biến đổi một dòng |
| Bài 5 (ý 3) | lập luận | Thêm đoạn chứng minh $K$ khác $E$ (phản chứng: nếu $K\equiv E$ thì $AE\perp OE$ ⇒ $AE<AO$; mà $AE\ge AH>AO$ — vô lí) và câu "ba điểm $A$, $K$, $E$ tạo thành tam giác"; thêm lí do "qua $A$ chỉ có một đường thẳng vuông góc với $OE$"; Phần 1 thêm **Bước 6** ứng với mắt xích này | Bản soạn xét $\triangle AKE$ và trực tâm mà chưa chứng minh tam giác tồn tại (tự ghi `Chưa chắc (2)`). Chứng minh bổ sung chỉ dùng quan hệ đường vuông góc – đường xiên và cạnh huyền lớn nhất (lớp 7) ⇒ đã chặt, **xoá mục (2) của dòng `Chưa chắc`** |
| Bài 5 (ý 2) | lập luận | "Mà $M$ thuộc tia $AC$, $F$ thuộc tia $AC$ nên…" ⇒ "Mà $A$, $M$, $F$ cùng thuộc đường thẳng $AC$ nên $HN\parallel MF$" | Lí do cần là ba điểm thẳng hàng trên $AC$ (đề không nói "$M$ thuộc tia $AC$") |
| Bài 5 | hình | `tam/ve.mjs`: nhãn $C$ dời sang trái (trước bị đường $FN$ cắt qua), nhãn $M$ dời lên trên – phải (trước chạm đường thẳng $xy$), thu tỉ lệ 42 → 38 và dời hình lên để nhãn $x$ cách đáy ≥ 35 px (trước chỉ còn ~12 px). Vẽ lại `img/giai_bai5.png` (bản script cũ: `tam/ve.goc.mjs`) | Luật hình giải: nhãn không đè đường, chừa ≥ 35 px dưới nhãn đáy. Dữ kiện hình (toạ độ, gạch trung điểm $M$, $E$, bốn góc vuông giả thiết) vốn đúng, không đổi |
| Ghi chú cho người duyệt | — | Thêm một câu nói ý 3 đã chứng minh đủ hai điều kiện tồn tại của $\triangle AKE$ | Để người duyệt biết vì sao không còn `Chưa chắc` ở ý 3 |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 5 (ý 2)** — dữ kiện đúng là bài đường trung bình ($M$ trung điểm $AF$, $O$ trung điểm $AH$ ⇒ $MN\parallel FH$; $OI$ nối trung điểm $AH$ và $HM$). Lời giải **không dùng** đường trung bình: chứng minh qua hình bình hành $NHFM$ và đường trung trực của $HM$. CEO quyết có cho dùng đường trung bình ở đề này không (nếu cho thì lời giải ngắn hơn, nhưng lời giải hiện tại vẫn đúng và đủ).

## Ghi chú thêm

- Bài 5 ý 3: hình giải có vẽ điểm $K$ và đường thẳng $xy$ đi qua $K$ (hình dựng đúng toạ độ thì ba đường tự đồng quy) — không có kí hiệu đánh dấu điều phải chứng minh; giữ như bản soạn.
- Bài 6: lời giải không nêu điều kiện "$n$ nguyên dương, $n<50$"; đáp số $n=25$ thoả, không ảnh hưởng kết quả — không sửa.
- Tệp tạm của trạm soát trong `<LV>/tam`: `soat-kiem.mjs` (máy kiểm Pha 1), `s_full.png`, `s1–s3.png` (ảnh cắt), `ve.goc.mjs` (bản script vẽ trước khi sửa), `soat-sua.mjs` (script sửa hàng loạt chạy hỏng, KHÔNG ghi gì — các chỗ sửa làm tay; có thể bỏ).
