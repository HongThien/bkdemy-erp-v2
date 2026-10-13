# Phụ lục brief — hai đề cương Lương Thế Vinh (LTV-GKI-2026) và Đoàn Thị Điểm (DTD-GKI-2026) (13/10)

> Dùng CÙNG `brief-soan.md` / `brief-soat.md` của đề cương Ngôi Sao Hoàng Mai (đọc chúng TRƯỚC, đó là khuôn chính: khuôn lời giải 2 phần, định dạng `\cdot`, luật cấm, cách vẽ hình giải, cách tự kiểm).
> Phụ lục này **THAY** các chỗ riêng của NSHM bằng chỗ riêng của hai đề cương mới. Khi brief cũ nói `NSHM-GKI-2026` / `<LV>` / ảnh `anh\…` / phạm vi kiến thức mục 3.4 ⇒ dùng bảng dưới.

## 1. Thay đường dẫn

| Brief cũ | Đề cương LTV | Đề cương DTD |
|---|---|---|
| `NSHM-GKI-2026` (mã) | `LTV-GKI-2026` | `DTD-GKI-2026` |
| `<LV>` | `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\LTV-GKI-2026` | `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\DTD-GKI-2026` |
| Tệp của bạn | `kho-rules\dai\lo\k8\de-cuong\LTV-GKI-2026.p<P>.soan.md` | `kho-rules\dai\lo\k8\de-cuong\DTD-GKI-2026.p<P>.soan.md` |
| Biên bản soát | `….p<P>.kiem.md` · `….p<P>.soat.md` · `….p<P>.soan.goc.md` (cùng thư mục) | như bên trái, mã DTD |
| Số phần `<P>` | 1–6 | 1–8 |

- **Nguồn đề:** `<LV>\trang\p-1.png … p-6.png` (ảnh trang 130 dpi — NGUỒN CHÍNH; mở HẾT bằng công cụ Read) và `<LV>\goc.pdf`. Phóng to chỗ không chắc:
  `pdftoppm -r 220 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ ở 220 dpi = 1,69 × toạ độ ảnh `p-N.png`), rồi Read. KHÔNG dùng `crop.mjs` / thư mục `anh\` (của NSHM).
  LTV là bản SCAN (không có lớp chữ); DTD có lớp chữ (`pdftotext -layout`) nhưng công thức trong lớp chữ hay hỏng — ảnh là nguồn chính.
- **Hình có sẵn trong đề** đã cắt: `<LV>\img\de_bai*.png`, đã khai bằng dòng `**Hình:**` trong tệp khung (giữ nguyên; mở xem đúng hình của câu). Bài hình KHÔNG có hình trong đề ⇒ vẽ **hình giải** (`**Hình giải:** giai_bai<N>.png`) như brief cũ mục 3.5 — script vẽ đặt tên `<LV>\tam\ve_p<P>.mjs`.
- **Lệnh cổng:** `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/<MA>.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem`.
- Tệp khung đã có `kho=` / nhãn / dòng `**Ghi chú:**` (người gõ đề ghi chỗ đề in lỗi / thiếu) — GIỮ. Không tách / gộp / đổi nhãn câu. Nhãn "Bài 23 (B)", "Bài 23 (D)" của DTD giữ nguyên.

## 2. Phạm vi kiến thức (thay mục 3.4 của brief cũ)

Luật chung của khối 8 (k8.md §1): chỉ dùng cái đã học tới đề cương; kết quả chưa học ⇒ **tự chứng minh ngay trong lời giải**. Nền lớp 6–7 luôn được dùng (kể cả: chia đa thức một biến cho đa thức một biến;
tam giác bằng nhau, cân, đường trung tuyến / trọng tâm, đường vuông góc – đường xiên, tia phân giác, tổng ba góc…). **CẤM ở cả hai đề cương:** đường trung bình của tam giác / hình thang · Thalès · đồng dạng · Pythagore · tỉ số lượng giác ·
phân thức đại số · "phương trình / tập nghiệm $S$" · công thức nghiệm — kể cả dùng NGẦM không gọi tên.

| | LTV-GKI-2026 | DTD-GKI-2026 |
|---|---|---|
| **Đại số** | Chương I (đơn thức, đa thức, cộng trừ, nhân, chia đa thức cho đơn thức) **+ Chương II chỉ đến hết bài 7**: hiệu hai bình phương, bình phương của một tổng / hiệu, **lập phương của một tổng / hiệu**. Được viết ngược chiều (vd $x^3+12x^2+48x+56=(x+4)^3-8$, $x^2-1=(x-1)(x+1)$) | **CHỈ Chương I.** Hằng đẳng thức đáng nhớ CHƯA học: $(a+b)^2$ phải viết $(a+b)(a+b)$ rồi nhân từng hạng tử |
| **CẤM thêm** | tổng / hiệu hai lập phương ($A^3\pm B^3$) · các PHƯƠNG PHÁP phân tích nhân tử của Bài 9 (nhóm, tách hạng tử, thêm bớt, dùng $A^3\pm B^3$). Đặt thừa số chung theo tính chất phân phối thì LUÔN được | hằng đẳng thức mọi loại · phân tích nhân tử (trừ đặt thừa số chung theo phân phối) |
| **Hình học** | Chương III **đến hết bài 13 (hình chữ nhật)**: tứ giác, hình thang cân, hình bình hành, hình chữ nhật (+ trung tuyến ứng cạnh huyền $=\dfrac{1}{2}$ cạnh huyền). **Hình thoi, hình vuông CHƯA học** (bài 14) | Chương III trọn: tứ giác, hình thang cân, hình bình hành, hình chữ nhật, **hình thoi và hình vuông** (đề cương ghi đủ 5 bài) |

Đường trung bình: dữ kiện nhiều bài đúng là bài đường trung bình ⇒ **tự chứng minh** bằng hình bình hành / tam giác bằng nhau (lấy điểm đối xứng…), và thêm dòng `**Chưa chắc:**` DÙNG ĐÚNG CÂU:
`dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không` (một dòng / câu, kèm ý nào). Đừng giải thích dài.

## 3. Lưu ý riêng của đề cương (đọc phần của bạn)

**LTV**
- Bài 4: đề cương in thiếu lời dẫn (đã nhập "Thực hiện phép tính"). Ý f) $(x^2-4x+4):(x-2)$ là chia đa thức một biến cho đa thức một biến (lớp 7) — được dùng, nói rõ cách làm (đặt phép chia / hoặc nhận ra $(x-2)(x-2)$).
- Bài 8 (tìm $m$ để chia hết), Bài 9 (đa thức dư): "chia hết" = tồn tại thương là đa thức; chưa học "định lí Bézout / số dư" ⇒ tự lập luận ($f(x)=(x-1)\,q(x)+4$ rồi thay $x=1$…; hoặc thực hiện phép chia đa thức một biến của lớp 7). Phải xét ĐỦ cả chiều "chia hết ⇒ điều kiện" lẫn chiều "điều kiện ⇒ chia hết".
- Bài 14, 15, 18, 19, 13: nâng cao — bước nào dựa vào hằng đẳng thức phải nằm trong danh sách đã học (không tổng / hiệu hai lập phương); số thực ⇒ "tổng bình phương bằng 0 thì từng số bằng 0" được dùng (lớp 7).
- Bài 16, 17: chứng minh chia hết với mọi số nguyên — đưa về dạng tích có thừa số 6 / 7 / 2 (có thể dùng ba số nguyên liên tiếp: tự lập luận vì sao chia hết cho 6).

**DTD**
- Dạng 1 (Bài 1–5): câu hỏi nhận biết — đáp án là DANH SÁCH các biểu thức (`tu_luan`); nói rõ lí do từng biểu thức (vd $\dfrac{x+y^2}{2x}$ có chia cho biến nên không phải đa thức). Số (hằng số, $2\dfrac{1}{4}$) là đơn thức đặc biệt.
- Bài 11b: sau khi thu gọn ra đa thức không thì "bậc" không xác định — nếu đúng vậy, nói rõ và ghi `**Chưa chắc:**` (đề có thể in lỗi); đừng tự bịa bậc.
- Bài 12: tìm $m$ để bậc bằng 3 — xét cả trường hợp bậc giảm.
- Bài 33, 36: để ý ĐƠN VỊ (m, dm, lít, gam); Bài 36 có cạnh $a$ (m) còn gạch tính theo dm — quy đổi rõ.
- Bài 38b: đề in $-x^2y(a^2+b^2)+(ax^2+by)(ay+bx^2)-ab(x^4+y^4)$ — kiểm bằng máy xem có đúng "không phụ thuộc $x,y$" không; nếu không đúng, thử đọc là có số mũ 2 của $y$ (…$y^2$…) và nêu trong `Chưa chắc` (đề in thiếu số mũ), vẫn giải theo bản in.
- Bài 39: kiểm bằng máy — biểu thức thu gọn ra hằng số; nếu hằng số ÂM thì "luôn dương" sai ⇒ giải thật thà (kết quả là gì) + `Chưa chắc` (đề in sai: hằng số âm).
- Bài 40d: số thực + "chia hết" — xem dòng `Ghi chú` có sẵn; trình bày $E=16\,(b-a)$.
- Bài 41: Hình giải vẽ cả bước dựng ($H,\ K,\ E,\ F$). Bài 42: điểm $D$ trên $BC$ (đề không đặt tên — đã bổ sung). Bài 47: dùng bài Hình chữ nhật (trung tuyến ứng cạnh huyền) — không Pythagore, không lượng giác.
- Bài 48: kiểm xem số liệu có hợp lí hình học không (đáy bé 26, đáy lớn 34, cao 20, cạnh bên 30?) — nếu mâu thuẫn, giải theo cách người ra đề muốn (chu vi, diện tích) và ghi `**Chưa chắc:**` nói rõ mâu thuẫn.
