KẾT LUẬN: ĐẠT

# Biên bản soát gói 4 — Ước bội · Dấu hiệu chia hết · Số nguyên tố (lý thuyết cấp dạng)

- Trạm soát: Opus · 14/10 · bản gốc trạm soạn giữ ở `out-4.goc.json`.
- Số dạng đã soát: **10/10** (NDB00368–NDB00377). Nhóm NNB00910 không có dạng — đúng, không cần viết.
- Cổng `kiem-goi.mjs`: ✔ đạt cổng (lý thuyết dạng 10 · ghi chú 4).
- Kiểm bằng vét cạn (`node -e`): (1) liệt kê ước "chia 1, 2, 3…, ghi cặp, dừng khi thương < số chia" đúng với mọi $a\le 5000$; (2) thử nguyên tố theo cùng luật dừng đúng với mọi $2\le a\le 5000$; (3) tổng 3 số / hiệu có đúng một số hạng không chia hết cho $m$ ⇒ không chia hết: 0 phản ví dụ ($m\le 12$, số $<40$); (4) chữ số $a$ để tổng chữ số chia hết cho 9: chỉ một giá trị, hoặc đúng hai giá trị $\{0;9\}$ — khớp `##CY` NDB00375.

## Đã sửa

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00368 | thiếu điều kiện | `##ĐN`: thêm $a>0$ cho ước, $b\ne 0$ cho bội | "Ước hữu hạn, không lớn hơn $a$" sai với $a=0$; "bội có vô số phần tử" sai với $b=0$ ($\text{B}(0)=\{0\}$). Lý thuyết nhóm cũng ghi "bội của một số khác 0". |
| NDB00369 | thiếu điều kiện | `##TC`: "với $x\ne 0$" → "với $a>0$, $x\ne 0$" | $a=0$ thì $\text{Ư}(0)$ vô hạn, cách liệt kê không dùng được. |
| NDB00369 | định dạng / diễn đạt | `##CY`: thay "nằm trong khoảng khác từ … đến …" bằng ví dụ cụ thể $5<x<20$ / $5\le x\le 20$ | Câu cũ mơ hồ ("nằm trong khoảng" tiếng Việt không rõ có lấy đầu mút). |
| NDB00371 | toán (bẫy diễn đạt sai) | `##CY`: bỏ câu "phải có ít nhất một số hạng chia hết cho $m$ mới kết luận được…"; thay bằng "từ hai số hạng trở lên không chia hết ⇒ chưa kết luận được ($5+7=12\vdots 6$ nhưng $5+8=13\not\vdots 6$)" + "tổng chia hết không suy ra từng số hạng chia hết" | Câu cũ ngụ ý chỉ cần một số hạng chia hết là kết luận được — sai với tổng 3 số có 2 số không chia hết. Điều kiện đúng là **đúng một** số hạng không chia hết (đã nêu ở `##TC`). |
| NDB00373 | thiếu điều kiện (PP không đủ cho mọi đề) | `##PP` bước 1: thêm trường hợp $a$ không ở hàng đơn vị (vd $\overline{a75}$, $\overline{2a4}$) — chia hết cho 2, 5 không phụ thuộc $a$ | PP cũ chỉ xử lý $a$ ở tận cùng, đề có $a$ ở giữa/đầu thì HS không có hướng. |
| NDB00375 | thiếu điều kiện (PP không đủ cho mọi đề) | `##PP` bước cuối: thêm "đề hỏi không chia hết thì lấy các chữ số $a$ còn lại" | Mô tả dạng gồm cả "không chia hết"; PP cũ chỉ có nhánh chia hết. |
| NDB00376 | thiếu điều kiện / không khớp ví dụ | `##PP` bước 2: thêm "số lớn hơn 3 có tổng các chữ số chia hết cho 3 là hợp số"; "riêng 2" → "riêng $2; 3; 5$" | Bước 1 nói dùng dấu hiệu 2, 5, 3 nhưng bước 2 bỏ mất dấu hiệu 3 — trong khi ví dụ hiện có ($51$, $57$) giải đúng bằng dấu hiệu 3. "Riêng 2" bỏ sót 3 và 5 là số nguyên tố. |

Không sửa: NDB00370, NDB00372, NDB00374, NDB00377 — toán đúng, đủ điều kiện, khớp cách giải trong ví dụ, kiến thức trong §1, định dạng đúng (dấu chấm nhân, `\text{Ư}`, `\text{B}`, không `##VD`, `##PP` mỗi dòng một bước).

## Điểm còn nghi gửi CEO

1. **NDB00376 `##ĐN`** gần như phát biểu lại định nghĩa trong lý thuyết nhóm NNB00908 (nhóm chỉ có đúng một dạng nên khó tránh). Giữ vì ngắn và HS cần ngay; nếu CEO muốn lý thuyết dạng không lặp chữ nào của nhóm thì bỏ khối `##ĐN`, giữ `##PP` + `##CY`.
2. **NDB00371 `##TC`** dùng "một tích có một thừa số chia hết cho $m$ thì tích chia hết cho $m$" — lý thuyết nhóm NNB00905 chỉ ghi tính chất của tổng/hiệu. Suy thẳng từ định nghĩa chia hết và ví dụ hiện có dùng đúng điều này (tên dạng có chữ "tích"), nên giữ; CEO xác nhận có muốn bổ sung tính chất này vào lý thuyết nhóm cho khớp không.
3. Ghi chú trạm soạn còn hiệu lực: lý thuyết nhóm NNB00904 / NNB00908 / NNB00909 (chỉ đọc) còn `##DN` không dấu, kí hiệu `U`, `B`, `N` và `\cdot` — lệch §3 k6.md, chờ CEO chuẩn hoá.
