KẾT LUẬN: ĐẠT

# Soát nbv-b1-e — NBV Giới hạn dãy số, phần E (trả lời ngắn)

- Số câu: 29 (đều `luyen`, `tra_loi_ngan`; 0 giảng, 0 Đ/S). Nguồn có Câu 1–33 trừ 14, 32 (đã dò: nguồn không có hai câu này) và bỏ 13, 28.
- Lệch đáp số so với giải mù (Pha 1, `nbv-b1-e.kiem.md`): trước sửa **0/29** · sau sửa **0/29**. Mọi đáp số đã tính lại bằng máy (n lớn / tổng 1e6 số hạng / mô phỏng truy hồi).
- `kiem.mjs`: ✔ đạt (trước và sau khi sửa). Bản gốc trước sửa: `nbv-b1-e.goc.json`.

## Các lỗi và chỗ đã sửa

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b1-e-5 | lời giải: Phần 2 không kết bằng "Vậy …" | tách dòng cuối: "Suy ra $a=\dfrac5{27}$." + "Vậy $27a=27\cdot\dfrac5{27}=5$." |
| nbv-b1-e-25 | lời giải: Phần 2 không kết bằng "Vậy …" | thêm dòng "Vậy $\lim(u_1+\dots+u_n)=\dfrac{11}9\approx1{,}22$." |
| nbv-b1-e-26 | lời giải: Phần 2 không kết bằng "Vậy …" | tách thành "$S=…=4\pi$." + "Vậy $a=4$." |

Không có lỗi đáp số, đề, tách ý, phạm vi.

## Đã soát, không sửa (xác nhận các ghi chú của trạm soạn)

- **Câu 3** — LỆCH SÁCH đúng: sách in "Trả lời: 163", lời giải sách ra $S=\{1;3\}$; máy: $\lim=a^2-4a+3=0$ ⇒ tổng 4. Giữ 4.
- **Câu 33** — sách in "$u_n=1$", lời giải sách dùng $u_1=1$ (lỗi in hiển nhiên) ⇒ sửa đề thành $u_1=1$ là đúng; đáp số 0,5 khớp sách (1/2) và máy.
- **Câu 27** — đề thiếu điều kiện để $(a,b,c)$ duy nhất (vd $\dfrac{3^2\sqrt3}{9}$ cho $T=3$). Lời giải có dòng "Lưu ý" đặt điều kiện $b$ không chứa ước chính phương, $\dfrac{a^2}{c}$ tối giản — điều kiện này đúng là ép ra duy nhất $a=1,b=c=3$ ⇒ $T=7$ (đã kiểm). Đề `noi_dung` vẫn giữ nguyên chữ sách.
- **Câu 19, 29, 30, 31** — chỉnh đề giữ nghĩa: 19 bỏ "như Hình a/b/c", thêm "tính diện tích từng hình rồi cộng" (đúng cách sách giải); 29, 30 thêm "ngay sau khi uống" (đúng mô hình $u_n=0{,}05u_{n-1}+D$ của sách); 31 viết rõ bước dựng tiếp $A_2B_2C_2$ (sách chỉ có hình) — diện tích $A_9B_9C_9$ không phụ thuộc cách xoay tam giác ⇒ đề đủ chữ; 713,58 cm² → 714 khớp sách.
- **Câu 13, 28 (BỎ vì hình)** — xác nhận: đề chỉ nói "nối các điểm chia một cách thích hợp (hình vẽ)", cách nối nằm ở hình. (Lời giải sách dùng cấu hình chuẩn: điểm chia cách đỉnh $\tfrac a4$, cạnh mới $\tfrac{a\sqrt{10}}4$, $q=\tfrac58$; câu 13 ⇒ 5400, câu 28 ⇒ $a=3$. Nếu CEO muốn giữ, chỉ cần viết rõ cấu hình vào đề.)
- **Câu 14, 32** — nguồn `.txt` không có (dò cả nhãn "Câu"), không phải trạm bỏ sót.
- **Câu 17** — đề in giản ước được ngay ($\dfrac{(3^n+2)(2^n+1)}{3^n+2}=2^n+1$, biểu thức ≡ 3); lời giải sách cũng ra 3 theo số in. Không coi là đề sai.
- **Dạng**: 26 câu có dạng đều khớp `dich.md` và luật DẠNG SAU THẮNG (vd câu 6, 12 có tham số nhưng NDB01157/NDB01158 đứng sau NDB01153 ⇒ đúng; câu 18 NDB01159 đứng sau NDB01158 ⇒ đúng). Câu 11 NDB01155 "vừa" hợp lý (dãy chứa cả $n$ và $2^n$; NDB01155 đứng sau NDB01162).
- **Phạm vi**: không L'Hôpital/đạo hàm. Câu 33 dùng công thức $\sum k^2$ (như lời giải sách; đã học ở chương Dãy số — quy nạp).
- **Phần 1**: không câu nào lộ đáp số cuối. `kiem`: mọi câu tính lại từ dữ kiện đề (không tautology), riêng câu 12 có thêm một vế số học thuần nhưng vế đầu đã tính lại $b$ bằng máy.

## Câu còn cần CEO

- **nbv-b1-e-1, nbv-b1-e-25** — `dang_bai = null`: bản đồ thiếu dạng "tổng tách phân thức, khử liên tiếp" (25 thêm truy hồi qua nghịch đảo). Không dạng nào trong 51 dạng khớp (NDB01156 chỉ là tổng CSC/CSN).
- **nbv-b1-e-17** — `dang_bai = null`: thiếu dạng "rút gọn biểu thức luỹ thừa trước khi lấy giới hạn". Phương án thay: gán NDB01154 (thương các luỹ thừa — cách quy đồng của sách) mức "vừa". CEO chọn: thêm dạng hay gán NDB01154.
- **nbv-b1-e-27** — đề sách thiếu điều kiện duy nhất cho $(a,b,c)$; đang giữ chữ sách + "Lưu ý" trong lời giải. CEO chọn: giữ như vậy hay sửa chữ đề (thêm "$a,b,c$ nguyên dương, $b$ không chia hết cho số chính phương lớn hơn 1, $\dfrac{a^2}{c}$ tối giản").
- **nbv-b1-e-13, nbv-b1-e-28** (đang BỎ) — nếu muốn nhập: viết rõ cấu hình nối điểm chia vào đề.
