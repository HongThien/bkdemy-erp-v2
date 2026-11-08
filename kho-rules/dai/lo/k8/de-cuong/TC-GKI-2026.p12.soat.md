KẾT LUẬN: ĐẠT

# TC-GKI-2026 — Phần 12 — biên bản SOÁT (Opus, 19/10)

Phạm vi: ĐỀ THAM KHẢO 1 Bài 4, 5, 6 · ĐỀ THAM KHẢO 2 Câu 1–6. Nguồn đối chiếu: `anh\t-6.png`, `anh\t-7.png`, `img\de_bai_dt1b4.png`. Lượt giải mù: `TC-GKI-2026.p12.kiem.md` (kiểm máy: vét cạn $a,b$ Bài 6; thay số hai vế Câu 2, 3; toạ độ Bài 5).

- **Số câu:** 9 (4 trả lời ngắn: Đề 2 Câu 1, 4, 5, 6 · 5 tự luận).
- **Khớp Pha 1 ngay từ đầu:** 9/9 đáp số / hướng chứng minh (Bài 4: 21 cm · Bài 6: $a=-2$, $b=-21$ · Câu 1: 5 · Câu 2: $20x^2y^5$ · Câu 3: $6x^2y-\dfrac{1}{8}x$ · Câu 4: 110 · Câu 5: 4,5 · Câu 6: 10). Phân loại TLN / tự luận khớp.
- **Đề:** 9/9 câu chép đúng ảnh.
- **Kiến thức:** không câu nào dùng đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác, kể cả ngầm. Bài 5b đi qua hình bình hành $ABMP$ (từ hình chữ nhật $AMCP$ của ý a — đúng con đường đề dựng sẵn điểm $P$); Bài 5c chỉ dùng trọng tâm (lớp 7), có nêu $E$ nằm giữa $M,N$, $G$ nằm giữa $N,P$ trước khi trừ đoạn. Bài 6 chia đa thức một biến tường minh, không gọi định lí số dư, có thử lại cả hai chiều.
- **Số câu phải sửa:** 2 (1 lời Phần 1 · 1 hình) + 1 hình đề cắt lại.
- **Cổng:** `✔ đạt cổng` (9 câu · 4 TLN · 5 tự luận · chưa chắc 1).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 2 Câu 6 | định dạng (Phần 1) | Bỏ "Bước 3. Viết lại kết luận về $AC$ kèm đơn vị cm."; viết lại 3 bước: cần đường chéo trung gian $BD$ → $OB$ là nửa $BD$ → hai đường chéo bằng nhau | Bước 3 cũ không phải bước nghĩ (bước bịa cho đủ số bước) |
| Đề 1 Bài 5 | hình | `tam\ve_p12.mjs`: nhãn $G$ dời từ (−20, −2) sang (−10, −18), vẽ lại `img\giai_dt1b5.png` | Đường $AK$ cắt ngang chữ "G" |
| Đề 1 Bài 4 | hình (hình đề) | Cắt lại `img\de_bai_dt1b4.png` từ `goc.pdf` trang 6 ở 300 dpi (`pdftoppm -x 1725 -y 2172 -W 510 -H 380`); bản cũ lưu ở `z\de_bai_dt1b4.goc-truoc-soat-p12.png` | Bản cũ dính mẩu ngoặc "( … )" của Bài 3d ở mép trên. Dữ kiện hình không đổi (ba cung đơn ở $\widehat{EAB}$, $\widehat{ABC}$, $\widehat{ADC}$ — khớp `Ghi chú`) |

Hình giải `giai_dt1b5.png` đã kiểm: dựng đúng dữ kiện bằng toạ độ ($N$ trung điểm $AC$ và $MP$, $D$, $K$ trung điểm, $E$, $G$ là giao thật), đủ điểm mọi ý, đánh dấu giả thiết (gạch $AN=NC$, $MN=NP$, $MD=DC$, $CK=KP$), không đánh dấu góc vuông ở $M$ hay điều phải chứng minh; sau sửa không nhãn nào đè đường.

## Câu còn `Chưa chắc` (gửi CEO)

- **Đề 1 Bài 5** — giữ dòng của trạm soạn: dữ kiện ý b là cấu hình đường trung bình ($M$, $N$ trung điểm $BC$, $AC$ ⇒ $MP\parallel AB$). Lời giải hiện tại **đầy đủ và đúng phạm vi** (hình bình hành $ABMP$, không cần đường trung bình); cờ chỉ để CEO quyết chung câu hỏi "có cho dùng đường trung bình ở đề cương TC không" (cùng nhóm với 5 đề GKI Hà Nội §11 và TC Hình Bài 4, 9b). Nếu CEO cho dùng thì ý b có thể rút gọn, ý c vẫn giữ (trọng tâm).
