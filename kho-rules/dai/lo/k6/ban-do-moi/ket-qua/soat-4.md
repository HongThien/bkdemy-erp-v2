KẾT LUẬN: ĐẠT

# Biên bản soát gói 4 — Ước bội · Dấu hiệu chia hết · Số nguyên tố (Opus, 14/10)

- Đã soát: **10 dạng = 20 ví dụ** (NDB00368–NDB00377) + **1 nhóm lý thuyết** NNB00910 (ĐN 1 · TC 3 dòng · PP 5 bước · CY 3 dòng · 2 VD).
- Đáp số tính lại bằng máy (`node`, vét cạn): Ư(36), Ư(60), Ư(24)>5, Ư(48)∩[5;20], B(7)<40, B(8)<50, bội 15 có 3 chữ số <200, xét chia hết 6/7, lọc dãy chia hết 2/5/3/9, chữ số $a$ ($\overline{27a}$, $\overline{37a}$, $\overline{52a}$, $\overline{47a5}$, $\overline{a28}$), nguyên tố/hợp số 14 số, phân tích 84/90/756/360, Ư(72) (12 ước), Ư(360) (24 ước) — **tất cả khớp, 0 lỗi đáp số**.
- Kiến thức lớp 6: không chuyển vế, không $(a^m)^n$, không dấu hiệu 4/8/11/25, không căn bậc hai, không công thức số ước.
- Bản gốc: `out-4.goc.json`. Cổng `kiem-goi.mjs`: **✔ đạt cổng**.

## Chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NNB00910 (TC) | toán | Dòng ước theo phân tích thừa số nguyên tố: thêm "(khác $1$)", thêm chiều ngược "mỗi tích như vậy đều là ước của $a$", nhắc $2^0=3^0=1$; lí do duy nhất viết theo đúng chữ của lý thuyết NNB00909 ("bằng cách nào cũng chỉ được một kết quả") | Bản soạn chỉ nêu một chiều (ước ⇒ có dạng tích) trong khi PP và VD dùng chiều ngược (mọi tích đều là ước); ước $1$ không là "tích của một số thừa số nguyên tố" |
| NNB00910 (PP) | khuôn | Tách rõ "Cách 1 (số nhỏ)" / "Cách 2 (số lớn)"; bước nhân luỹ thừa viết lại cho rõ (bắt đầu từ ước $1$, số mũ từ $1$ đến số mũ trong $a$); bỏ bước "kiểm tra lại số ước" | Bước cũ "kiểm tra lại số ước (bước nào cũng đủ 1 và a)" mơ hồ và ngầm dựa công thức đếm ước ngoài whitelist |
| NNB00910 (VD2, 360) | kiến thức + định dạng | Phân tích 360 viết mỗi phép chia một dòng (khuôn NNB00909); bỏ "Số ước là $4.3.2=24$ (mỗi số mũ có 4, 3, 2 cách chọn)" thay bằng "12 ước không chứa thừa số 5 và 12 ước chứa thừa số 5, tất cả 24 ước" | Quy tắc nhân / công thức $(m+1)(n+1)$ chưa có trong lý thuyết K6 |
| NDB00376 (VD1, VD2) | toán (lập luận thiếu) | Chứng minh 13, 29, 37 là số nguyên tố: ghi đủ các phép chia thử tới lúc thương nhỏ hơn số chia (13 tới 4, 29 tới 6, 37 tới 7) rồi mới kết luận Ư = {1; chính nó}; hợp số ghi rõ "có ước … khác 1 và chính nó" | Bản soạn "13 không chia hết cho 2; 3 nên Ư(13)={1;13}" thiếu lí do vì sao dừng ở 3 (thực ra phải xét tới 4). Không viện "thử tới căn bậc hai" |
| NDB00374 (VD1) | khuôn | Câu kết luận "Tổng chia hết cho 3 là 9; 12; 9; 9; 12 …" viết lại thành "Các tổng 9 và 12 chia hết cho 3, tổng 17 không chia hết cho 3 nên …" | Câu cũ khó đọc, liệt kê tổng lặp |
| NDB00368 (VD1a) | khuôn | Thêm "Thử 5 không chia hết" và "(ước 6 chỉ ghi một lần)" | Đồng bộ với cách dừng ở các ví dụ khác |
| NDB00369 (VD2) | khuôn | Thêm dòng "Thử 5 và 7 đều không chia hết; tới 8 thì thương 6 nhỏ hơn số chia nên dừng" | Liệt kê Ư(48) thiếu lí do dừng |

Không sửa (đúng): NDB00370, NDB00371, NDB00372, NDB00373, NDB00375, NDB00377; VD1 của NNB00910 (Ư(72)).

## Ghi chú gửi CEO (trong `ghi_chu` của out-4)

1. NDB00369 / NDB00370 và NDB00373 / NDB00375: gói không có ứng viên đúng dạng (cụm cũ dùng chung với dạng "cơ bản" / "nhận biết") ⇒ ví dụ tự soạn, đáp số đã vét cạn.
2. Ranh giới NDB00368 (cơ bản) vs NDB00369/370 (có điều kiện): "Tìm $x$ sao cho $60\vdots x$" xếp vào cơ bản.
3. NNB00905: tên nhóm có "tích" mà lý thuyết chưa có tính chất chia hết của tích — đề nghị thêm 1 dòng (NDB00371 VD1c tự suy từ định nghĩa).
4. NNB00910: mô tả nhóm rỗng; Claude giả định 2 cách (chia cặp cho số nhỏ, phân tích thừa số nguyên tố cho số lớn).
5. Lý thuyết hiện có NNB00904 dùng $U(a)$, $B(b)$ ASCII; NNB00909 dùng `\cdot` — nên chuẩn hoá.
6. NDB00376 không viện "thử tới căn bậc hai".
7. **(Soát thêm)** NNB00910 trùng nội dung với NDB00368 (ví dụ NDB00368 cũng liệt kê Ư(36), Ư(60)) — CEO chốt ranh giới.
8. **(Soát thêm)** Quy tắc "dừng khi thương nhỏ hơn số chia" chỉ được lập luận ở lý thuyết NNB00910 (nhóm đứng SAU) mà ví dụ NDB00368/369/376 (nhóm đứng trước) đã dùng — đề nghị thêm 1 dòng vào ##PP của NNB00904.
