KẾT LUẬN: ĐẠT

# Biên bản SOÁT — CK-2526-nguyen-truong-to · phần Hình · trạm soát Opus · 03/11/2026

- Số câu: **9** (P1 Bài 21–29, đều `tu_luan`, `kho=hinh_hoc`, `dap_an=—`).
- Pha 0: tự lập danh sách từ 5 trang ảnh, đề cương có đúng 9 bài Hình (Phần II, Bài 21–29); Bài 30–34 "nâng cao" là Đại số thuần. **Không sót bài, không nhập nhầm.**
- Khớp Pha 1 (`.hinh.kiem.md`) ngay từ đầu: **9/9 câu** về kết quả / hướng chứng minh (mọi khẳng định thử 3000 cấu hình, `tam/soat_kiem.mjs`; các khẳng định thứ tự điểm trong lời giải Bài 22c, 24c, 26c, 27c thử thêm 5000 cấu hình, `tam/soat_thutu.mjs`, không ca nào sai).
- Số câu phải sửa: **5** (Bài 21, 22, 26, 27, 29) — không lỗi đáp số / lập luận Phần 2; chỉ chép đề, kiến thức ở Phần 1, hình, phân loại. Bản gốc trạm soạn: `CK-2526-nguyen-truong-to.hinh.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (9 câu, hình 9, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 21 | chép đề | "tính số đo góc $\widehat{COD}$" → "tính số đo góc $COD$" | ảnh in "tính số đo góc COD"; bản soạn lặp chữ "góc" với kí hiệu $\widehat{\ }$ |
| P1 Bài 22 | kiến thức (Phần 1) | Mấu chốt: "$\widehat{ABD}=90^\circ$ vì $B$ nằm trên đường tròn đường kính $AD$" → "vì $OA=OB=OD$ tạo hai tam giác cân" | câu cũ là hệ quả góc nội tiếp chắn nửa đường tròn (CẤM cuối kì I); Phần 2 vốn đã chứng minh bằng tam giác cân + tổng ba góc |
| P1 Bài 22 | hình | đoạn $MB$ kéo dài tới $K$ (`seg(M, K)` thay `seg(M, B)`) ở cả hình đề lẫn hình giải | $K$ là giao điểm của $OI$ và $MB$, nằm trên phần kéo dài quá $B$; hình cũ để $K$ lơ lửng, không thấy $K$ thuộc $MB$ |
| P1 Bài 26 | kiến thức (Phần 1) | Mấu chốt: "vì $B$ nằm trên đường tròn đường kính $AC$" → "vì $OA=OB=OC$ tạo hai tam giác cân" | như Bài 22 |
| P1 Bài 27 | kiến thức (Phần 1) | Mấu chốt: "$E$, $F$ nằm trên đường tròn đường kính $AB$ nên tạo các góc vuông" → "$OE=OF=OA=OB$ nên các tam giác cân cho hai góc vuông tại $E$, $F$" | như Bài 22 |
| P1 Bài 29 | phân loại | `tt_khac` → `hai_tt` | từ $A$ có hai tiếp tuyến $AB$, $AC$ (ý a), ý c dùng $AO$ là trung trực của $BC$; ý b từ $D$ có hai tiếp tuyến $DC$, $DE$ ($DC=DE$). Cùng cấu hình với Bài 24 mà trạm soạn xếp `hai_tt` |

**Phân xử hai điểm được giao:**
- **Bài 22** — sửa "MO cắt AB tại H": **đúng, giữ.** Chữ in "Kẻ đường kính $AD$…, cắt $AB$ tại $H$" vô nghĩa ($AD$, $AB$ chung $A$). Ý b đòi $OHBI$ là hình chữ nhật ⇒ $\widehat{OHB}=90^\circ$ ⇒ $H$ là chân đường vuông góc từ $O$ xuống $AB$, tức giao điểm của $MO$ và $AB$ — cách hiểu duy nhất, không treo Chưa chắc. Ghi chú của trạm soạn đủ.
- **Bài 27** — `khong_tt`: **đúng, giữ.** Về hình học $IE\perp OE$ tại $E\in(O)$ nghĩa là $IE$ tiếp xúc $(O)$, nhưng đề không nói "tiếp tuyến" và lời giải chỉ dùng tam giác cân, trực tâm, trung tuyến ứng với cạnh huyền — không dùng tính chất / dấu hiệu tiếp tuyến nào. Đẩy vào mô hình tiếp tuyến thì không luyện được kiến thức tiếp tuyến. Đã ghi lí do vào `phanloai.json`.

**Đã soát, không phải sửa:** chép đề Bài 22–29 khớp ảnh (tên điểm, kí hiệu, đủ ý); Phần 2 cả 9 bài đúng toán từng dòng, có căn cứ (gt)/(cmt)/tên định lí; không góc nội tiếp, tứ giác nội tiếp, đường trung bình (Bài 21c dùng tam giác cân + so le trong, Bài 25c dùng đồng dạng), hệ thức đường cao suy từ đồng dạng (Bài 24a, 25b, 26c); chứng minh tiếp tuyến đều nêu dấu hiệu; hai tiếp tuyến cắt nhau nêu đúng tính chất; Phần 1 3–6 bước, không lộ đáp số ($\widehat{COD}$, $S_{ABC}$ chỉ ở Phần 2). Hình 16 tệp còn lại đúng dữ kiện, không vẽ sẵn điều phải chứng minh ở hình đề (Bài 24 không vẽ $MB$, Bài 28 không vẽ đường tròn), nhãn đọc được. Bài 28: Ghi chú "đề không nói tam giác nhọn" đủ — kết luận đúng cả với tam giác tù (máy kiểm), không phải đề sai nên không cần "Lưu ý".

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 21 | ba_tt |
| P1 Bài 22 | hai_tt |
| P1 Bài 23 | hai_tt |
| P1 Bài 24 | hai_tt |
| P1 Bài 25 | hai_tt |
| P1 Bài 26 | hai_tt |
| P1 Bài 27 | khong_tt |
| P1 Bài 28 | tt_khac |
| P1 Bài 29 | hai_tt |

Đếm: hai_tt 6 · ba_tt 1 · tt_khac 1 · khong_tt 1.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
