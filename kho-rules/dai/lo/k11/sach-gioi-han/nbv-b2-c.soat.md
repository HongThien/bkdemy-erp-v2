KẾT LUẬN: ĐẠT

# nbv-b2-c — soát (nhân chứng thứ hai)

- Số câu: 79 trắc nghiệm, đều `luyen` (sách có Câu 1–84; bỏ 5 câu C14, C15, C16, C71, C77).
- Lệch đáp án Pha 1 (giải mù, `nbv-b2-c.kiem.md`, tính máy hai phía / ở vô cực) so với bản soạn: **trước 0 / sau 0** (79/79 khớp).
- Đề chuẩn hoá: đối chiếu số, dấu, ngoặc, số mũ của cả 79 đề và 316 phương án với nguồn `.txt` bằng máy — khớp hết; chỉ khác ở C12 (phương án viết gọn, xem dưới) và C51 (nguồn ghi ký hiệu ∞ bằng font Symbol, bản soạn đọc đúng $-\infty$ / $+\infty$).
- Phạm vi: không L'Hôpital, không đạo hàm, không `\times` / `\left` / `$$`. Phần 2 đúng toán từng dòng (đã đọc hết 79 câu). `kiem` đều tính lại từ đề (vài câu yếu nhưng không tautology: C2, C35, C76).
- `kiem.mjs` sau sửa: ✔ đạt. Bản gốc: `nbv-b2-c.goc.json`. Chỉ sửa 6 câu, 8 dòng.

## Các điểm trạm soạn nêu — đã tự kiểm

- **Bỏ 5 câu** — đúng, nguồn mất công thức: C14 (đề + 4 phương án là ảnh WMF; lời giải sách cho biết là $\lim_{x\to1}(2x^2-3x+1)=0$ nhưng phương án không đọc được), C15 (như trên, $2+3=5$), C16 (như trên, trùng nội dung C66), C71 (đề lỗi `EQ-FAILED`), C77 (phương án A, B lỗi `EQ-FAILED`). Không dựng lại được phương án ⇒ bỏ là đúng.
- **C3 LỆCH SÁCH** — sách ghi "Chọn C" nhưng gạch chân A và lời giải sách ra $-\infty$; máy: $f(3-10^{-7})\approx-5\cdot10^7$ ⇒ **A** đúng.
- **C65 LỆCH SÁCH** — sách gạch chân / chọn B ($7$), không có lời giải; $(-1)^2-(-1)+7=9$ ⇒ **C** đúng (B=7 là đáp số của C67, $x\to1$).
- **C79 LỆCH SÁCH** — sách chọn B ($+\infty$) nhưng chính lời giải sách ra $2$; máy: $x=10^8$ cho $1{,}99999998$ ⇒ **A** đúng.
- **C12** — nguồn in C và D cùng "$=5$" (phương án viết đủ $\lim\dots=$); bản soạn rút thành giá trị ($+\infty$, $-\infty$, $5$, $5$) — giữ nghĩa. Đáp án A ($+\infty$) không đổi. **Vẫn còn hai phương án trùng** — xem mục CEO.
- **C73 → NDB01169** — đúng: mẫu $x+2\to4\ne0$, không phải $\frac00$, thay trực tiếp ra $\frac14$ (máy kiểm hai phía).
- **Câu "vừa"** C2, C9, C21, C28, C33, C35, C43, C61, C76, C84 — đồng ý mức "vừa", giữ mã (C33, C43 tham số ở vô cực: bản đồ không có dạng "tham số khi $x\to\pm\infty$", để NDB01178 hợp lý).

## Lỗi đã sửa

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b2-c-C9 | lời giải — Mấu chốt LỘ đáp án: nêu sẵn "$x^k$ dần tới vô cực cùng dấu với $x$, $\frac1{x^k}$ dần tới $0$" = chính 3 mệnh đề cần xét | Mấu chốt chỉ nhắc nhớ lại hai giới hạn cơ bản rồi đối chiếu từng mệnh đề |
| nbv-b2-c-C49 | lời giải — Mấu chốt nêu "$\frac1{n^k}$ nhỏ hơn mọi số dương" = định nghĩa giới hạn $0$ ⇒ lộ đáp số | xét $n^k$ khi $n$ tăng vô hạn rồi suy ra $\frac1{n^k}$ |
| nbv-b2-c-C74 | lời giải — Mấu chốt nêu "$\lim\frac1{n^k}=0$" ⇒ lộ đáp số $0$ | tách hằng số rồi dùng giới hạn cơ bản (không nêu giá trị) |
| nbv-b2-c-C76 | lời giải — Mấu chốt "phát biểu sai là phát biểu viết sai thứ tự hoặc dấu" ⇒ chỉ thẳng D | đối chiếu từng phương án với quy tắc đã học |
| nbv-b2-c-C12 | dạng: NDB01182 → NDB01184 | $\frac{f(x)}{(x+1)^2}$ với $\lim f=4$ trùng khuôn ví dụ NDB01184 ($\frac{x-4}{(x-1)^2}$); hợp cả hai, DẠNG SAU THẮNG |
| nbv-b2-c-C60 | dạng: NDB01182 → NDB01184 | như C12 (mẫu $(x+1)^4$) |

Không câu nào sai đáp số / đề / tách ý / phạm vi.

## Ghi nhận (không sửa)

- C59 ($\frac{\sqrt{x^2+x}-\sqrt x}{x^2}$, $x\to0^+$) để NDB01173: dạng $\frac00$ hai căn; sau liên hợp còn $\frac1{0^+}$ nhưng đề không phải dạng $L/0$ ⇒ giữ.
- C10, C56, C64 cùng một đề ($\lim_{x\to3}[f(x)+4x-1]$, $\lim f=-2$), C31 ≡ C81, C3/C19 cặp hai phía — sách lặp, đang giữ cả.
- Phần 1 nhiều câu dùng chung một khuôn theo dạng (thay trực tiếp / quy tắc / $L/0$ / chia luỹ thừa cao nhất): đúng, không lộ đáp số, nhưng ít riêng cho từng câu.

## Câu còn nghi cần CEO

| id | lý do | sách | bản soát |
|---|---|---|---|
| nbv-b2-c-C12 | Hai phương án C, D trùng ($5$) — câu trắc nghiệm hiện 2 lựa chọn giống hệt trên app. Không biết sách định in gì cho một trong hai | A; C = D = 5 | giữ theo sách (không tự bịa phương án); Thùy chọn: giữ / thay D bằng giá trị khác (vd $4$ hoặc $0$) / bỏ câu |
| nbv-b2-c-C10, C56, C64 · C31, C81 | Đề lặp nguyên văn trong cùng phần | có cả | giữ cả, chờ Thùy chọn bỏ bớt hay không |
