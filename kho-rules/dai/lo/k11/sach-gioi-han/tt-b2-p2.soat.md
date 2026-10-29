KẾT LUẬN: ĐẠT

# Soát tt-b2-p2 — Từ Tâm C3-B2 Giới hạn hàm số (phần 2/2)

- Số câu: **45** (30 TN · 5 Đ/S · 10 TLN · 0 giảng — phần này không có mục "Ví dụ", đúng). Nguồn có Câu 14→60 = 47 câu; bỏ C39, C47 ⇒ đủ, không thừa / thiếu.
- Lệch đáp số so với giải mù (Pha 1, `tt-b2-p2.kiem.md`): **0 trước / 0 sau** — cả 45 câu (kể cả từng ý của 5 câu Đ/S) khớp.
- `kiem.mjs`: ✔ đạt (trước và sau khi sửa). Bản gốc: `tt-b2-p2.goc.json`.

## Kiểm các điểm trạm soạn nêu

| Điểm | Kết quả soát |
|---|---|
| C50 LỆCH SÁCH (ý c, d) | Đúng. Nguồn in "$a+2b=1$", "$a+b=1$"; lời giải sách viết "$a-2b=1$" và chọn ĐÚNG (ý d cùng kiểu). Với $L=\frac{a-1}b$: theo số in $L=-2$ và $L=-1$ ⇒ c), d) **Sai**. Đề theo số in vẫn là một câu Đ/S hợp lệ ⇒ giữ Đ S S S. "a, 3, c" sửa thành "a, b, c" đúng (lỗi in hiển nhiên); $c$ vẫn thừa trong đề (vô hại). |
| C24 | Đúng: sách viết bước cuối $\frac{a+1}2=3$, ra $a=5$ (sai số học); đúng là $a=3$, thuộc phương án D — đáp án D sách khớp. |
| C20 | Đúng: sách in nhánh trái $\frac{x-2+a}{x-2}$ (thiếu bước), đáp số D = 12 khớp. "Có giới hạn hữu hạn" được hiểu là giới hạn tại $-2$ tồn tại (trái = phải) — đúng ý sách. |
| C36 sửa đề | Đúng: nguồn in tử "$x^2-x-2+1$", lời giải sách dùng $x^2-x-2$, đáp án A khớp ⇒ lỗi in hiển nhiên. |
| C55 sửa đề | Đúng: hỏi "$AH$" nhưng công thức và lời giải là $OH$. `[[img]]` chỉ minh hoạ, đề đủ chữ. |
| C59 sửa đề | Đúng: "a;b;c;d" thừa $c,d$; đáp số 0 khớp. |
| C57 sách trống đáp số | Đúng: dòng "Trả lời:" trống, lời giải sách ra $a=2,b=3,c=1,d=2$, $P=12$; máy tính lại 12. |
| C47 bỏ | **Hợp lý**: 4 mệnh đề đều đọc từ đồ thị (giới hạn tại $\pm\infty$, tại $1^\pm$) — chữ không đủ để giải. |
| C39 bỏ | **Hợp lý**: $\lim_{x\to0}\frac{1-\cos3x\cos5x\cos7x}{\sin^27x}$ — mọi cách đều cần $\frac{\sin u}u\to1$ (CẤM). Lời giải sách cũng dùng nó. |
| C16 cách giải | Sách dùng $\lim\frac{\sin x}x=0$ tại vô cực; trạm giải bằng chặn $0\le\frac{\sin x+1}x\le\frac2x$ + kẹp qua dãy — không dùng giới hạn đặc biệt cấm. |

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| C57 | dạng | `NDB01178` → **`NDB01183`** (vừa): tử bậc 16 > mẫu bậc 12 khi $x\to-\infty$, cách làm = rút luỹ thừa cao nhất giữ $x^4$ ngoài — khớp cả 01178 lẫn 01183 ⇒ DẠNG SAU THẮNG. |
| C58 | dạng | `NDB01178` → **`NDB01183`** (vừa): tử bậc 18 > mẫu bậc 11, cùng lý do. (C59 tử 16 < mẫu 19 ⇒ giữ 01178.) |
| C36, C55, C59 | lời giải | Bỏ dòng "Lưu ý: đề sách in …" đầu Phần 2: đề đã sửa chữ nên HS không thấy lỗi in đó; Phần 2 là bài HS viết. Thông tin vẫn ở `ghi_chu`. |
| C57 | lời giải | Bỏ dòng "Lưu ý: đáp số trong sách bị bỏ trống …" khỏi Phần 2 (chuyện của sách, không phải bài HS); vẫn ở `ghi_chu`/`sach_dap_so`. |

Không có lỗi đáp số, tách ý, `vai`, phạm vi (không L'Hôpital / đạo hàm / $\frac{\sin x}x$). Phần 1 không lộ đáp số cuối (đã đọc hết 45 câu). `kiem` tính lại từ dữ kiện đề (TN kiểm cả 4 phương án qua `pick`), không tautology. Định dạng do `kiem.mjs` bắt: đạt.

## 8 câu dạng trống — có dạng hiện có nào hợp không

- **C23, C24, C25, C26, C28, C29, C43** (tìm tham số để giới hạn tại vô cực bằng một số / bằng $\pm\infty$): **không có dạng hợp đúng kiểu bài.** Bản đồ có dạng "tìm tham số" cho dãy (`NDB01153`, thuộc chuyên đề dãy số) và cho $\frac00$ (`NDB01174`), không có cho $x\to\pm\infty$. Gán vào dạng tính toán thì chỉ khớp kĩ thuật, không khớp kiểu bài ⇒ giữ trống là đúng luật brief.
  Nếu Thùy muốn tạm xếp thay vì chờ dạng mới, phương án dự phòng theo kĩ thuật: C23, C25, C26 → `NDB01178` · C24, C28 → `NDB01179` · C43 → `NDB01180` · C29 → `NDB01184` (tích một thừa số vô cực sau khi nhân liên hợp mẫu).
- **C16** ($\lim_{x\to+\infty}\frac{\sin x+1}x$): không dạng nào nói về chặn / kẹp tại vô cực ⇒ giữ trống. Dự phòng gần nhất: `NDB01178` (yếu).

## Còn nghi — cần Thùy

1. **Bản đồ thiếu 2 dạng** (chủ đề Giới hạn, chuyên đề Giới hạn hàm số): (a) *Tìm tham số để giới hạn tại vô cực thoả điều kiện* — 7 câu đang chờ (C23–26, C28, C29, C43); (b) *Giới hạn tại vô cực dùng chặn / kẹp (hàm lượng giác)* — C16. Thùy thêm dạng hay cho tạm vào dạng dự phòng ở trên?
2. **C50**: sách chọn c), d) ĐÚNG vì đọc đề là "$a-2b=1$", "$a-b=1$"; bản này giữ số in ⇒ c), d) SAI. Nếu Thùy coi đây là lỗi in hiển nhiên thì sửa đề thành dấu trừ và đổi đáp án thành Đ S Đ Đ.
3. **C16**: lời giải dùng nguyên lí kẹp cho dãy số. Cần Thùy xác nhận kẹp nằm trong phạm vi được dùng (KNTT 11 có nói "$|u_n|\le v_n$, $\lim v_n=0$ ⇒ $\lim u_n=0$" ở mức nhận xét); nếu không, câu này nên bỏ.
