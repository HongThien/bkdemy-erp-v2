KẾT LUẬN: ĐẠT

# NT-GKI-2026 · P1 (Ví dụ mẫu) — biên bản trạm SOÁT (Opus) · 21/10

- Số câu: **5** (Bài 1a, 1b, 2, 3, 4) — 1 `tra_loi_ngan` (Bài 3, `dap_an=12`) · 4 `tu_luan`.
- Khớp Pha 1 (`NT-GKI-2026.p1.kiem.md`) ngay từ đầu: **5/5** đáp số / kết luận (cũng khớp lời giải mẫu in trong đề cương).
- Câu phải sửa: **3** (Bài 2, Bài 3, Bài 4) — đều lỗi nhẹ, không câu nào sai đáp số, sai đề hay sai luật kiến thức.
- Đề: 5/5 khớp ảnh `p-04`, `p-05`, `p-06`, `p-08`; phần "(làm tròn số đo góc đến độ)" của Bài 4 là người gõ lấy từ mục "Xác định yêu cầu" (đã ghi ở Ghi chú) — giữ.
- Luật kiến thức: không $\Delta$ / Viète, phương trình bậc hai đưa về phương trình tích bằng tách hạng tử; không `⇔`, không "tập nghiệm $S$";
  Bài 4 (thuộc mục Tỉ số lượng giác) chỉ dùng định nghĩa tỉ số + Pythagore, không viện dẫn hệ thức cạnh – góc, tính $\widehat{C}$ từ số liệu gốc ($\tan C=\dfrac34$), không từ góc $B$ đã làm tròn.
- Phần 1: mỗi câu 4–5 bước nghĩ thật, không lộ đáp số (kể cả Chú ý).
- Hình giải `giai_P1B4.png`: đúng tỉ lệ $AB:AC=3:4$, vuông tại $A$ có kí hiệu, đủ $A,B,C$, chỉ ghi $3$ và $4$ (không ghi $BC$, không ghi góc), nhãn không đè — giữ nguyên.
- Cổng `--chi-kiem`: **✔ đạt cổng** (5 câu · 1 TLN · 4 tự luận · chưa chắc 0).
- Máy: `<LV>\tam\kiem_p1_soat.mjs` (thay nghiệm, quét lưới, kiểm phân tích nhân tử, góc bằng `Math.atan` / `asin` / `acos`).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2 | định dạng | Cách 2: tách "ta được $x+2\cdot1=3$, suy ra $x=1$" thành hai dòng | Mỗi phép biến đổi một dòng (khuôn vở lớp 9). |
| Bài 3 | định dạng | "(không thoả mãn điều kiện $x>0$)" ⇒ "(không thoả mãn điều kiện)" | Điều kiện đã đặt là $x\in\mathbb{N}^*$, không phải $x>0$ — tránh nêu điều kiện lệch với dòng gọi ẩn. |
| Bài 4 | lập luận (câu chữ) | "Tương tự, $\tan C=…$" ⇒ "Cũng theo định nghĩa, ta có $\tan C=…$" | Không "tương tự" (dòng trước dùng $\sin B$, dòng này dùng $\tan C$); căn cứ là định nghĩa tỉ số lượng giác. |
| Bài 4 | Chưa chắc | Xoá dòng `**Chưa chắc:**` về làm tròn (của trạm soạn); sửa câu tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Đã kiểm chắc: đề (mục "Xác định yêu cầu") yêu cầu làm tròn góc đến độ; $BC=5$ là số đúng (máy: $\sqrt{3^2+4^2}=5$), $\widehat B=53{,}13^\circ\approx53^\circ$, $\widehat C=36{,}87^\circ\approx37^\circ$ — không còn gì để CEO phải quyết. Dòng Ghi chú của người gõ giữ nguyên. |

Bản gốc trước khi sửa: `NT-GKI-2026.p1.soan.goc.md`.

## Câu còn `Chưa chắc` (gửi CEO)

Không.
