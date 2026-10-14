KẾT LUẬN: ĐẠT

# Biên bản soát gói 5 — Nâng cao quan hệ chia hết (lý thuyết cấp dạng bài)

- Trạm soát: Opus · 14/10 · bản gốc giữ ở `out-5.goc.json`.
- Số dạng đã soát: **11/11** (NNB00913: 384, 385, 387, 386, 815 · NNB00911: 379, 380, 381, 378 · NNB00912: 382, 383). NNB00914/915 không có dạng.
- Cổng `kiem-goi.mjs`: **✔ đạt cổng** (lý thuyết dạng 11 · ghi chú 3).
- Kiểm bằng máy (vét cạn $a,c\le 12$; $b,d\le 40$; $n\le 200$): phương pháp nhóm NNB00911 (chọn $t=c:\text{ƯCLN}(a;c)$, tách, lấy ước của $|t.b-q.d|$, loại ước $<d$ và ước làm $(u-d)$ không chia hết cho $c$, thử lại) cho **đúng tập nghiệm thật ở mọi bộ số — 0 sai**. Riêng: $t=1$ (hệ số chia hết) thì không cần thử lại vẫn đúng; $t>1$ và $t.b=q.d$ thì **không có $n$ nào**; $t=1$ và $b=q.d$ thì **mọi $n$**.

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00383 | kiến thức + không khớp ví dụ | Bỏ câu viện dẫn "Nếu $q.B\vdots m$ và $q$, $m$ nguyên tố cùng nhau thì $B\vdots m$" như một quy tắc; thay bằng LẬP LUẬN khử hệ số: tìm $t$ để $t.q=m.s+1$, rồi $B=t.q.B-m.s.B\vdots m$. CY thêm phản ví dụ $2.3\vdots 6$ mà $3$ không chia hết cho $6$. Mở rộng cách chọn $p,q$: hoặc hệ số một biến bằng nhau rồi trừ, hoặc tổng hệ số mỗi biến là bội của $m$ rồi cộng. | Tính chất "nguyên tố cùng nhau ⇒ bỏ được hệ số" (bổ đề Gauss) KHÔNG có trong lý thuyết bản đồ K6 — k6.md §1 luật 2: kết quả ngoài whitelist phải tự lập luận, không viện dẫn. Hai ví dụ hiện có đều làm đúng kiểu lập luận này ($8.(3x+4y)-7.(3x+4y)$; $12.(x+3y)-11.(x+3y)$). Ví dụ 2 dùng TỔNG ($2A+3B=11x+11y$), không làm bằng hệ số — bản soạn chỉ nêu cách "hệ số bằng nhau". |
| NDB00378 | thiếu điều kiện | PP bước tách thêm điều kiện "Với $t.b\ge q.d$"; CY ca $t.b<q.d$ ghi rõ "rồi vẫn thử lại"; ca $t.b=q.d$ đổi "xét trực tiếp đề gốc" thành kết luận cụ thể **không có $n$ nào** + ví dụ $3n+3$ / $2n+2$ lập luận bằng kiến thức lớp 6; "ra nhiều giá trị thừa" → "có thể ra giá trị thừa"; bước cuối "thử lại từng $n$ vào đề gốc, loại giá trị không thoả". | Phép tách chỉ hợp lệ (số tự nhiên) khi $t.b\ge q.d$. Ca biên đã vét cạn bằng máy. Ví dụ 1 không có giá trị thừa nên "nhiều" là sai. |
| NDB00381 | thiếu điều kiện | PP bước tách thêm "Với $b\ge q.d$"; bước cuối thêm "thử lại". | TC có điều kiện $b\ge q.d$ nhưng PP thì không; ca $b<q.d$, $b=q.d$ ở CY đã đúng (máy xác nhận). Thử lại thống nhất với cả nhóm (khuôn nhóm k6.md §2 "cuối thử lại"); ở dạng này bước tách là tương đương nên thử lại không đổi kết quả. |
| 384, 385, 387, 386, 815 | — | Không sửa. | Đúng toán, khớp ví dụ (đếm số số hạng, giữ số hạng đầu, ghép cách $2d$ số hạng/khối), có dấu hiệu phân biệt anh em. |
| 379, 380, 382 | — | Không sửa. | Đúng; 380 có ca $b<d$, $b=d$ ở CY; 382 có cả hai cách (bằng hệ số / tổng là bội $m$) khớp 2 ví dụ. |

## Điểm còn nghi — gửi CEO

1. **NDB00382 vs NDB00383 không phân biệt được bằng đề** (ghi_chu của trạm soạn, máy xác nhận): cả 2 ví dụ của "Nhân 2 biểu thức" đều giải được bằng "Nhân 1 biểu thức" ($2.(2x+5y)+(3x+4y)=7x+14y$; $8.(4x+y)+(x+3y)=33x+11y$). Khi $m$ là số nguyên tố thì LUÔN nhân một biểu thức là đủ. CEO quyết: giữ 2 dạng theo cách trình bày, hay gộp.
2. **Lý thuyết nhóm NNB00912 (của CEO)** ví dụ 2 viết "$3\nmid 13\Rightarrow 3y-2x\vdots 13$" — vừa sai kí hiệu ($3\nmid 13$ nghĩa là "3 không chia hết 13", ý muốn nói 3 và 13 nguyên tố cùng nhau), vừa viện dẫn bổ đề ngoài whitelist lớp 6. Lý thuyết dạng 383 đã viết theo cách lập luận khử hệ số; đề nghị CEO sửa chữ ở nhóm cho khớp.
3. NDB00387 trỏ cụm cũ "DCUM01547 ghép 3 số hạng" trong khi nội dung là ghép 2 (ghi_chu trạm soạn) — cần soát cụm.
4. NDB00379 không ghi bước thử lại (khớp ví dụ, bước suy ra là tương đương nên không cần); nếu CEO muốn mọi dạng nhóm NNB00911 đều có "thử lại" thì thêm một chữ ở bước cuối.
