KẾT LUẬN: ĐẠT

# GKI-34 — biên bản soát (Pha 2) — THCS Bát Tràng, đề 1, giữa kì 1 Toán 8 năm 2025-2026

- Số câu: **21** (12 trắc nghiệm · 3 trả lời ngắn: Bài 3a, 3b, 6 · 6 tự luận: Bài 1, 2a, 2b, 2c, 4, 5).
- Khớp đáp án Pha 1 (giải mù, `GKI-34.kiem.md`) ngay từ đầu: **21/21**. Không có câu nào lệch đáp số.
- Số câu phải sửa: **2** (Câu 2 — một dòng Chú ý; Bài 5 — Mấu chốt của Phần 1 + hình giải) và 1 dòng trong mục GHI CHÚ CHO NGƯỜI DUYỆT. Không sửa đề, không sửa đáp án, không sửa Phần 2 của câu nào.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (sau khi sửa).
- Bản gốc trước khi sửa: `GKI-34.soan.goc.md`.

## Việc đã kiểm

- **Chép đề:** đối chiếu từng câu với ảnh trang; riêng các chỗ trạm soạn báo bản máy gõ sai (Câu 2–6, Bài 2c) đã cắt phóng to 300 dpi (`<LV>\tam\s_c2_4.png`, `s_c5_6.png`, `s_b1_3.png`, `s_b4_6.png`) đọc lại từng số mũ, hệ số, dấu: bản soạn chép **đúng hết** (Câu 2: $3^2x^2y^4$ và 4 phương án; Câu 3: $5x^2y^5:10x^2y^3$; Câu 4: nhân tử thứ hai $\dfrac{-5}{3}x^2z$ có biến $z$; Câu 5: $2x^5y^2+\dfrac{2}{5}x^2y-x^2y^2$; Câu 6: $-y^5+2x^2y-x^2y^2+y^5-3$; Bài 2c: $(6x^5y^3-5x^3y^4+8x^3y^3):(2x^2y^2)$). Đủ 12 câu + 6 bài, không sót ý. Bài 5a đề gốc viết "là hình chữ nhật?" — bản soạn bỏ dấu hỏi thừa, không đổi nghĩa.
- **Đáp số:** tính lại bằng máy độc lập (`<LV>\tam\s_kiem.mjs`): Câu 3, 4, 6, Bài 1a, 1b, 2a, 2b, 2c, 3a, 3b, 4 (thay 6 bộ số), Bài 6 (BigInt đủ 11 hạng tử, $M=1$), Bài 5 (toạ độ 2 bộ: $MH=KC$, $E$, $O$, $C$ thẳng hàng). Ghi nhận: script `kiem.mjs` của trạm soạn kiểm Câu 4 với nhân tử $x^2y$ thay vì $x^2z$ — không ảnh hưởng, vì đề và lời giải trong bản soạn dùng đúng $x^2z$ và bậc vẫn là 8.
- **Bài 6 — dấu "…":** tự đọc: các hạng tử $\pm 2025x^k$ đan dấu, mũ lẻ mang dấu trừ, mũ chẵn mang dấu cộng; phần in ở cả hai đầu dãy đều khớp quy luật này nên phần bị lược chỉ có thể là $+2025x^6-2025x^5+2025x^4$. Một cách hiểu duy nhất hợp lí ⇒ **không** cần `Chưa chắc`. Lời giải (thay $2025=x+1$, triệt tiêu từng cặp) đúng từng dòng, không dùng hằng đẳng thức.
- **Luật kiến thức:** đề KNTT, chạm tới Chương I và Chương III (tới hình chữ nhật, thoi, vuông ở Câu 9–12, Bài 5a); không có hằng đẳng thức, phân tích nhân tử, Pythagore. Bài 2b nhân đa thức với đa thức (không dùng hiệu hai lập phương) ✓. Bài 3 biến đổi bằng chuyển vế, không viết "phương trình / tập nghiệm" ✓. Bài 5: không dùng đường trung bình kể cả ngầm — $MH=KC$ và "$H$ là trung điểm $AB$" lấy từ $\triangle HBM=\triangle KMC$ (cạnh huyền - góc nhọn); hình chữ nhật $AHMK$ đi qua tổng bốn góc $360^\circ$ + định nghĩa (không dùng "ba góc vuông") ✓; mỗi khẳng định có lí do, Phần 1 phân tích đi lên 6 bước khớp từng mắt xích với Phần 2 ✓.
- **Phân loại:** `kho` đúng (Câu 7–12, Bài 5 = `hinh_hoc`; Bài 4 bài thực tế viết đa thức = `dai`). Trả lời ngắn đúng luật (4, 3, 1 là số nguyên). Tách ý: Bài 2 (ba ý, mỗi ý một dữ kiện riêng) và Bài 3 tách; Bài 1 (ý b dùng ý a) và Bài 5 (hình) giữ chung ✓.
- **Hình:** `p2c4_lai.png` (Bài 4) đúng hình của câu, đủ nhãn $x$, $x-13$, $y$, không dính chữ. `giai_bai5.png`: toạ độ dựng đúng dữ kiện ($AB<AC$, $M$ trung điểm $BC$, $MH\perp AB$, $MK\perp AC$, $H$ trung điểm $ME$, $O$ giao $AM$ và $HK$), đủ 8 điểm, nhãn không đè, không vẽ $EC$.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 2 | lập luận (Phần 1, dòng Chú ý) | "cùng hệ số không làm hai đơn thức đồng dạng" → "hệ số trông giống nhau không làm hai đơn thức đồng dạng, phải so phần biến" | Phương án A có hệ số $-3^2=-9$, đơn thức đã cho có hệ số $3^2=9$ — không phải "cùng hệ số" |
| Bài 5 | lập luận (Phần 1, dòng Mấu chốt) | "ý b và ý c cần biết $H$ là trung điểm của $AB$" → "ý b cần $MH=KC$, ý c cần $H$ là trung điểm của $AB$ — cả hai lấy từ cặp tam giác vuông bằng nhau $HBM$ và $KMC$" | Ý b không cần $H$ là trung điểm $AB$ (Phần 2 ý b cũng không dùng); Mấu chốt cũ lệch với chính các bước 2–3 và Phần 2 |
| Bài 5 | hình | `ve.mjs`: thêm hai đoạn $AE$, $BE$ nét đứt, vẽ lại `giai_bai5.png` | Phần 2 ý c dựa vào hai tứ giác $AMBE$, $AEMC$ mà hình cũ không có cạnh $AE$, $BE$ nên không nhìn ra; $EC$ vẫn không vẽ (điều phải chứng minh) |
| GHI CHÚ CHO NGƯỜI DUYỆT | định dạng (ghi chú) | Viết lại dòng về Bài 5 | Dòng cũ ghi "dữ kiện đúng là bài đường trung bình" — không đúng: đề không cho đoạn nối hai trung điểm, và có lời giải trọn vẹn trong phạm vi đã học; nên không thuộc ca phải gắn `Chưa chắc` của brief soạn mục 7 |

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
