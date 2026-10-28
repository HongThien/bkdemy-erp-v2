KẾT LUẬN: ĐẠT

# tt-b2-p1 — biên bản soát (nhân chứng thứ hai)

- Số câu: **55** (12 ví dụ tách thành 42 câu `giang` + 13 trắc nghiệm `luyen`; 0 Đ/S). Không câu nào bỏ vì hình (các `[[img:]]` trong nguồn là khung trang trí "Phương pháp" / "Lời giải").
- Lệch đáp số so với bản giải mù (`tt-b2-p1.kiem.md`): **trước 0 / sau 0**. 55/55 khớp kết luận lời giải / `dap_an`.
- Đề chuẩn hoá: so từng câu với nguồn `.txt`, đủ 12 ví dụ + Câu 1–13, giữ đúng số / dấu / mũ / phía giới hạn. Phương án C13 nằm ở đầu `tt-b2-p2.txt`; `tt-b2-p2.json` bắt đầu từ C14, nên không lặp câu.
- Phạm vi: không L'Hôpital / đạo hàm / giới hạn đặc biệt. Căn bậc ba dùng hằng đẳng thức $a^3\pm b^3$ (trong phạm vi).
- `kiem`: đều tính lại từ đề (hai phía của điểm / $x$ rất lớn), không tautology. Trắc nghiệm C2–C4, C10–C13 trước chỉ kiểm phương án đúng ⇒ đã thêm kiểm loại từng phương án sai. `kiem.mjs` ✔ đạt sau sửa.

## Phân xử các điểm trạm soạn nêu (bằng máy + đối chiếu nguồn)

| điểm | phán quyết |
|---|---|
| VD2.2b bỏ (căn bậc 4, 5) | **Đồng ý.** Căn bậc $n$ chỉ có ở chương VI (sau chương V) ⇒ ngoài phạm vi lúc học giới hạn. (Đáp số sách $\frac32$ đúng, nếu sau này muốn nhập lại.) |
| VD1.3e LỆCH SÁCH ($-\frac14$, sách $\frac14$) | **Bản soạn đúng.** Máy: $-0{,}2500$ hai phía. Dòng giải của sách có $\frac{(2-x)\dots}{2(x-2)\dots}$ rồi bỏ mất dấu trừ. |
| VD1.3f đề $+x+4$, soạn theo $+x-4$ | **Đồng ý sửa đề.** Với $+x+4$: tử $\to8$, mẫu $\to0$ đổi dấu ⇒ không có giới hạn (máy: $\pm1{,}6\cdot10^6$). Lời giải sách viết ngay dòng đầu $+x-4$ và ra $-\frac4{15}$ (máy: $-0{,}26667$) ⇒ lỗi in hiển nhiên, có đáp án rõ. Có dòng "Lưu ý" đầu Phần 2. |
| VD3.1d mẫu in $2-x^2-3x$ ⇒ $0$, sách $-\frac13$ | **Bản soạn đúng theo đề in** (máy: $\approx0$; mẫu tại 1 bằng $-2$). Ghi thêm: sách sai hai chỗ, phân tích mẫu thành $(1-x)(x+2)=2-x-x^2$ (đề gốc có lẽ là $2-x^2-x$ ⇒ $\frac13$, máy: $0{,}33333$) rồi lại ghi $-\frac13$. Đã viết lại `ghi_chu` cho chính xác. |
| C13 phương án A và D cùng in $-\infty$, soạn sửa A thành $+\infty$ | **Đồng ý.** Nguồn (`tt-b2-p2.txt` dòng 3) đúng là A $-\infty$ / D $-\infty$; sách chọn D; máy: $x\to2^+$ ra $-\infty$. Sửa A thành $+\infty$ là lỗi in hiển nhiên, đáp án D không đổi. |
| id VD3.2 = "Ví dụ 3.1" lần hai | **Đồng ý.** Nguồn dòng 330 và 348 cùng ghi "Ví dụ 3.1", sau đó là 3.3 ⇒ mục thứ hai là 3.2. |
| C6 $\frac{\sin x}{x}$ tại $\frac\pi2$ | **Trong phạm vi.** Chỉ thay giá trị $\sin\frac\pi2=1$, không phải giới hạn đặc biệt tại $0$. Đáp số $\frac2\pi$ (máy khớp). |
| C9 hợp NDB01182 và NDB01183 ⇒ NDB01183 | **Đồng ý** theo luật dạng sau thắng (B, C cần NDB01183; đáp án A là NDB01182), giữ "vừa". |

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| VD1.3f | dạng | NDB01172 → **NDB01173** (vừa): cách giải là tách tử $(\sqrt{2x+7}-3)+(x-1)$ rồi liên hợp từng phần, đúng mô tả NDB01173 "Tách thành hiệu rồi liên hợp từng phần"; dạng sau thắng |
| VD2.1a, VD2.1b | lời giải | Phần 2 dùng $A=$, $B=$ (tên của sách) mà đề chuẩn hoá không đặt ⇒ viết đầy đủ biểu thức giới hạn, kết "Vậy giới hạn bằng …" |
| VD2.3b | lời giải | Phần 2 dùng $a$, $b$ mà chưa đặt (chỉ đặt ở Phần 1) ⇒ thêm dòng "Đặt $a=\sqrt[3]{2x-1}$, $b=\sqrt[3]{2x+1}$." |
| VD1.4d | lời giải | bước thay số thiếu dấu trừ: $\frac{0\cdot3}{2\cdot2}$ ⇒ $\frac{-0\cdot3}{2\cdot2}$ (biểu thức đã rút gọn có dấu $-$) |
| C9 | lời giải | phương án C viết "$\approx x$" không chặt ⇒ rút $x$: $x\cdot\frac{1+\frac1x+\frac1{x^2}}{1-\frac1x}$, phân thức sau $\to1>0$ |
| VD3.1d | lời giải (Phần 1) | Bước 3 "dùng quy tắc thương với tử dần tới $0$" gần như nêu đáp số ⇒ "tính riêng giới hạn của tử và của mẫu rồi dùng quy tắc thương"; viết lại `ghi_chu` (xem trên) |
| C2, C3, C4, C10, C11, C12, C13 | kiem | thêm kiểm loại các phương án sai |

Bản gốc của trạm soạn: `tt-b2-p1.goc.json`. Script sửa: `sua-tt-b2-p1.mjs` ở scratchpad phiên soát (đọc `.goc.json`, ghi `.json`).

Đã xem, giữ nguyên: VD1.2f Bước 4 và VD1.4d Bước 4 ("chú ý tử còn thừa nhân tử …") là bước nghĩ thật, không nêu số. Các dạng còn lại khớp `dich.md` (NDB01171 phân tích nhân tử · 01172 một căn · 01173 hai căn / căn bậc ba · 01178/01179/01180/01181 tại vô cực · 01175/01176/01177/01182 một bên · 01169 thay trực tiếp).

## Còn nghi — cần Thùy

1. **VD3.1d**: kho giữ đề in ($2-x^2-3x$ ⇒ $0$, không còn là ví dụ dạng $\frac00$ có trị tuyệt đối, ví dụ giảng hơi "rỗng"). Hai cách: (a) giữ như hiện tại; (b) sửa đề thành $2-x^2-x$ (khớp phép phân tích của sách) ⇒ đáp số $\frac13$, khác cả số in trong sách ($-\frac13$). Bản của tôi: nghiêng (b) vì ví dụ mới đúng mục đích bài giảng, nhưng đây là đoán đề gốc ⇒ để Thùy chọn.
2. **VD1.3e / VD3.1d / C13**: đáp số trong kho khác số in trong sách ($-\frac14$ thay $\frac14$; $0$ thay $-\frac13$; A sửa thành $+\infty$) — GV dùng sách giấy song song sẽ thấy lệch.
3. **VD2.2b** (căn bậc 4, 5) đang bỏ hẳn — nhập lại sau khi học chương VI hay bỏ vĩnh viễn?
