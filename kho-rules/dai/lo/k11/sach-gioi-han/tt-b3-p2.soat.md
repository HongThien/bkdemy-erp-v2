KẾT LUẬN: ĐẠT

# Soát tt-b3-p2 (Từ Tâm C3-B3 Hàm số liên tục, phần 2/2)

- Số câu: 31 (17 trắc nghiệm · 8 Đ/S · 6 trả lời ngắn · 0 giảng). Câu 24–55, thiếu Câu 42 (bỏ, xem dưới).
- Lệch đáp số Pha 1 (giải mù, `tt-b3-p2.kiem.md`) so với bản soạn: **0 trước / 0 sau**. Mọi `dap_an` và `menh_de[].dap_an` khớp bản giải mù của tôi.
- `kiem.mjs` ✔ đạt sau khi sửa. Bản trước khi sửa: `tt-b3-p2.goc.json`.

## Các điểm trạm soạn tự nêu — tôi đã phân xử bằng máy
| Câu | Trạm soạn nói | Phân xử |
|---|---|---|
| 35 | LỆCH SÁCH: sách "Chọn C" nhưng $m=\frac74$ là B | Đúng. Lời giải chính của sách ra $4m+1=8\Rightarrow m=\frac74$ = phương án B; C là $-\frac74$. Giữ B. |
| 46 ý a | LỆCH SÁCH: $f(10)=27$, không phải 17 | Đúng. $f(10)=10+17=27$ (chính sách cũng tính $\lim_{x\to10^-}=27$, chỉ dòng (a) nhầm do gõ $x+7$). Ý a) = Sai. |
| 46 ý c | sửa chữ đề "a>0" → "b>0" | Đồng ý: bản in lặp lại ý b; lời giải sách ghi "(c) $b>0$ … SAI". Lỗi in hiển nhiên. |
| 54 | sửa $x\ne-2$ / $x=-2$ thành 2 | Đồng ý (lời giải sách xét tại $x=2$, đáp số 3). Nếu giữ nguyên chữ in thì đáp số là $m=-1$ — xem mục cần CEO. |
| 29 | công thức hỏng (EQ-FAILED), dựng lại từ lời giải | Đồng ý: lời giải sách có cả $\frac{\sqrt{x+3}-2}{x-1}$ (giới hạn phải) và $f(1)=\lim_{x\to1^-}f=m^2+m+\frac14$ ⇒ nhánh $x\le1$. Đáp số B khớp sách. |
| 42 | bỏ vì công thức hàm hỏng | Đồng ý. Từ lời giải chỉ dựng được nhánh $x>-2$: $\frac{1-\sqrt{5x+11}}{2x^2-5x-18}$ (máy: giới hạn phải $=\frac5{26}$ ✔) và $f(-2)=0=\lim_{x\to-2^-}f$; nhánh trái mất ⇒ không dựng đủ đề. |
| 25 | bổ sung trường hợp thừa số liên hợp bằng 0 | Đúng: $a=b=-4$ ⇒ tử $\sqrt{1-4x^2}+4x-2$ chỉ xác định khi $x\le\frac12$ (và giới hạn trái là $+\infty$, máy kiểm) ⇒ loại. Nghiệm duy nhất $a=b=-3,\ c=-4$, $S=-36$ (giới hạn hai phía đo bằng máy $=-2$). |
| 53 / 55 | trùng nguyên văn | Đúng, hai đề giống hệt từng chữ (chỉ khác "điểm"/"tham số"). Giữ cả hai trong JSON, chờ CEO. |

## Lỗi tìm thấy và đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| tt-b3-p2-48 | lời giải (định dạng): `$pm3$` thiếu dấu `\` (hiển thị chữ "pm3") | → `$\pm3$` |
| tt-b3-p2-29 | `kiem` gần tautology: tính giới hạn bằng biểu thức ĐÃ rút gọn $\frac1{\sqrt{x+3}+2}$ | viết lại: tính từ biểu thức đề $\frac{\sqrt{x+3}-2}{x-1}$ tại $x=1+10^{-7}$, kiểm $L=\frac14$ và đúng 1 phương án (B) |

## Soát thêm (không cần sửa)
- (a) Đề chuẩn hoá giữ nghĩa sách ở 31 câu (đối chiếu dòng đề trong `.txt`); không thiếu / thừa câu ngoài 42.
- (b) `vai`: cả 31 là `luyen` (phần 2 không có "Ví dụ") — đúng.
- (c) `dang_bai`: tham số 1 nhánh tại 1 điểm → NDB01191 (24, 26–29, 31, 50–53, 55); tham số hai nhánh → NDB01193 (25); liên tục trên ℝ có tham số → NDB01197 (30, 33–36, 54); xét liên tục hàm nhiều công thức → NDB01196 (32); 1 nghiệm trong khoảng → NDB01199 (37, 38); đếm nghiệm → NDB01200 (39, 40). Đ/S không dạng. Không thấy gán sai; bản đồ không thiếu dạng.
- (d) Lời giải: đúng toán từng dòng; không L'Hôpital / đạo hàm (38 dùng đồng biến của $x^5$, $x^3$ — kiến thức lớp 10, chấp nhận); Phần 1 không lộ đáp số; Phần 2 kết "Vậy …"/"Chọn X."; không `\times`/`\left`/`$$`; không còn lệnh LaTeX thiếu `\` (quét máy).
- (e) TLN: 0 · 1 · 0,5 · 0 · 3 · 0 — đều ≤ 4 ký tự.
- (g) `kiem` còn lại đều tính lại từ hàm của đề (giới hạn hai phía ở $\pm10^{-7}$, xét đủ 4 phương án hoặc từng ý).

## Còn cần CEO (Thùy) quyết
1. **Câu 53 và 55 trùng nguyên văn** (đáp số cùng $m=0$): nhập cả hai hay bỏ một (đề xuất: giữ 53, bỏ 55 khỏi kho). Tôi chưa xoá gì.
2. **Câu 54** — sách in $x\ne-2$, $x=-2$; trạm soạn sửa thành 2 theo lời giải (đáp số 3). Giữ nguyên chữ in thì bài vẫn giải được nhưng ra $m=-1$. Đề xuất: giữ bản sửa (khớp lời giải + đáp án sách).
3. **Câu 29** — đề dựng lại từ lời giải (MathType hỏng); dấu nhánh $x>1$ / $x\le1$ suy từ lời giải, nên đối chiếu bản in nếu có.
4. **Câu 42** — bỏ (nhánh trái của $f$ mất trong bản chuyển đổi). Nếu có bản in, có thể nhập lại.
5. LỆCH SÁCH đã chốt bằng máy (không cần chọn, chỉ báo): Câu 35 đáp án B (sách in C), Câu 46 ý a) Sai (sách ghi Đúng).
