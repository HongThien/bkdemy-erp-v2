KẾT LUẬN: ĐẠT

# NS-GKI-2026 · Phần 2 — BIÊN BẢN SOÁT (13/10)

Phạm vi: phần A. Đại số — Bài 3 (a–c), Bài 4 (a–c), Bài 5 (trang 1 của đề cương). Tất cả `kho=dai`, `loai=tu_luan`.
Giải mù: `NS-GKI-2026.p2.kiem.md` · máy: `<LV>/tam/soat_p2.mjs` (phân số chính xác, thay nghiệm vào đề, quét lưới $m$ trên $[-200;200]$ bước $0{,}001$) ·
ảnh phóng to: `<LV>/z/soat2_b34.png`, `<LV>/z/soat2_b45.png` · bản gốc trước khi sửa: `NS-GKI-2026.p2.soan.goc.md` · cổng: ✔ đạt cổng (7 câu, chưa chắc 1).

- Số câu: **7**
- Khớp Pha 1 ngay từ đầu (đáp số): **7 / 7**
- Số câu phải sửa: **2** (Bài 3a — một cụm chữ ở Phần 1; Bài 5 — lập luận + tách đoạn) · thêm 1 câu chỉ xoá dòng `Chưa chắc` (Bài 3c). Không có lỗi chép đề, đáp số, kiến thức, phân loại.

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3a | định dạng (Phần 1) | Bước 4: "rồi kết luận công thức hàm số" → "rồi kết luận giá trị của $a$ và $b$ như đề hỏi" | Đề hỏi $a$, $b$ và Phần 2 kết luận "Vậy $a=…$ và $b=…$" — bước nghĩ phải khớp với cái trình bày |
| Bài 3c | (xoá `Chưa chắc` của trạm soạn) | Bỏ dòng `**Chưa chắc:** đáp số là phân số "xấu"…` | Đã phóng to 260 dpi: đề in đúng $A(5;-2)$, $B(-2;-11)$; giải mù ra cùng $a=\dfrac{9}{7}$, $b=-\dfrac{59}{7}$; máy thay lại qua cả hai điểm đúng tuyệt đối. Không còn gì chưa chắc (dòng này không phải của người gõ đề — `de.json` không có cảnh báo cho câu này) |
| Bài 5 | lập luận | "Ba đường thẳng đồng quy khi và chỉ khi $(d_3)$ đi qua $M(1;2)$" → "Để ba đường thẳng đồng quy thì $(d_3)$ phải đi qua điểm $M(1;2)$"; câu cuối phần kiểm thêm "khi đó ba đường thẳng phân biệt cùng đi qua điểm $M(1;2)$"; kết luận ghi đủ "thì ba đường thẳng đã cho đồng quy" | "Khi và chỉ khi" mâu thuẫn với việc ngay sau đó còn phải kiểm $(d_3)$ không trùng $(d_1)$, $(d_2)$: đi qua $M$ mới là điều kiện cần, kiểm phân biệt xong mới đủ |
| Bài 5 | định dạng | Tách 3 đoạn đang dồn hai câu (thử lại + kết luận giao điểm; phương trình $(d_3)$ + hệ số góc; hệ số góc + kết luận) thành mỗi câu một đoạn | Brief soạn mục 4: mỗi dòng biến đổi / mỗi câu một đoạn riêng |

## Đã soát, không phải sửa

- **Đề** 7 câu khớp ảnh (số, dấu, toạ độ). Câu dẫn Bài 3, Bài 4 viết lại cho số ít khi tách ý — đúng luật tách ý.
- **Bài 5 — cách nhập $\sqrt{2}x$** (đề in dấu căn trùm "$2x$"): đúng ý đề (đề gọi $(d_2)$ là đường thẳng). Máy kiểm thêm: kể cả đọc theo bản in $\sqrt{2x}+y=\sqrt{2}+2$ thì giao với $(d_1)$ vẫn chỉ là $(1;2)$ ⇒ $m=\dfrac{7}{6}$ không đổi. Giữ dòng `Ghi chú`, không cần `Chưa chắc`.
- **Kiến thức**: chỉ dùng hệ phương trình bậc nhất hai ẩn (thế / cộng đại số) và hệ số góc của đường thẳng (lớp 8). Không $\Delta$, không định thức / tỉ lệ hệ số, không `⇔`, không "tập nghiệm $S$". Bài 5 coi $\sqrt{2}$ là một số, chỉ nhóm thừa số chung $(1+2\sqrt{2})x=1+2\sqrt{2}$ — không dùng biến đổi căn thức chương III.
- **Phần 1**: 3–4 bước mỗi câu, là bước nghĩ thật, không lộ đáp số (kể cả dòng Chú ý của Bài 3c).
- **Phân loại**: cả 7 câu `tu_luan`, `dap_an=—` là đúng (hai đại lượng $a$, $b$ · cặp toạ độ · $m$ là phân số).
- **Hình**: phần này không có hình.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 4b** — đề cương in "$(d)\colon y=x+y+1=0$" (thừa "$y=$"). Đã nhập và giải theo $(d)\colon x+y+1=0$ ⇒ giao điểm $(-2;1)$ (cùng dạng với $(d')$ và ý c — cách hiểu hợp lí nhất). Nếu ý đề là $(d)\colon y=x+1$ thì giao điểm là $(2;3)$. Dòng của người gõ đề, giữ nguyên; cần CEO chốt cách hiểu.
