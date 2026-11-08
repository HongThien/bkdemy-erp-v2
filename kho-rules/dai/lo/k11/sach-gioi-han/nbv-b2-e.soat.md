KẾT LUẬN: ĐẠT

# Soát nbv-b2-e (NBV bài 2 — phần E trả lời ngắn, giới hạn hàm số)

- Số câu: 55 (53 trả lời ngắn + 2 tự luận: câu 1 = -0,25 và câu 25 = -0,75, đáp số 5 ký tự). Tất cả `luyen`, không Đ/S, 0 câu chưa dạng.
- Bỏ 4 câu (23, 38, 41 mất công thức EQ-FAILED; 48 dùng $e^{-0,2t}$ — ngoài phạm vi): đúng.
- Lệch Pha 1: trước 1 câu (56) / sau 0. Câu 56: bản mù của tôi gõ nhầm $\sqrt{1-t}$ thay cho $\sqrt{1-t^{2}}$; tính lại đúng đề ra 1/4 ⇒ bản soạn đúng (0,25), giữ.
- 3 câu LỆCH SÁCH của trạm soạn đều kiểm lại bằng máy, bản soạn đúng:
  - Câu 2: $1000/(-4)=-250$ (sách -125).
  - Câu 18: $2025/24=84{,}375\approx84$ (sách 88).
  - Câu 20: với $x\to-\infty$ giới hạn là $2/5$ ⇒ $2a-b=-1$ (sách 11, sách giữ căn dương = kết quả của $x\to+\infty$).
- `kiem.mjs` (kể cả bộ quét LaTeX hỏng): ✔ đạt, không lỗi. Không có `\times`, `\left`, `\right`, `$$`.
- `kiem` của từng câu đều tính lại bằng số từ dữ kiện đề (không tautology).

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b2-e-44 | dạng | NDB01173 → **NDB01174** (vừa): đề là tìm tham số $a,b$ để giới hạn $\frac00$ bằng $4048$; NDB01174 đứng sau NDB01173 ⇒ dạng sau thắng. Lý do cũ "bản đồ thiếu dạng tham số" là sai — bản đồ có NDB01174. |
| nbv-b2-e-24 | lời giải (Phần 1 lộ) | Bước 3 cũ nêu sẵn giá trị giới hạn $\frac{-\sqrt2}{4}$ (lộ kết quả then chốt, đọc ra luôn $a,b$) ⇒ viết lại "Tính giới hạn của thương vừa thu được rồi trục căn ở mẫu để mẫu số bằng $4$." |

Đã soát, không sửa: đề chuẩn hoá giữ nghĩa (đối chiếu nguồn câu 1, 2, 3, 9, 17, 18, 20, 28, 53, 54, 57); câu 3 thêm "tối giản" (cần để $a,b$ duy nhất) — hợp lý; câu 9 / 54 hiểu $x,t\to+\infty$ — đúng (câu 9: với $-\infty$ giới hạn là $-2\sqrt a<0$; câu 54: $t>0$ vì $\sqrt t$); câu 57 sửa Ox→Oy có dòng "Lưu ý" đầu Phần 2 — đúng (với Ox thì D trùng B); câu 17, 28, 53 sửa chữ đề — đáp số không đổi. Lời giải đều trong phạm vi (không đạo hàm/L'Hôpital; câu 19, 39 "vận tốc tức thời" làm bằng phân tích nhân tử; câu 59 dùng định lí côsin lớp 10). Nhóm "hàm ẩn" (4–8 → NDB01169 vừa; 18 → NDB01172 vừa; 21, 29 → NDB01173 vừa) và nhóm "tham số ở vô cực" (9, 14, 26, 45 → NDB01180; 42 → NDB01179) giữ nguyên.

## Câu còn nghi — cần CEO
- **nbv-b2-e-20**: sách 11 (= kết quả nếu $x\to+\infty$), đề in $x\to-\infty$ cho -1. Có thể đề gốc là $+\infty$; hiện giữ đề in + đáp số -1.
- **nbv-b2-e-2**: sách -125; đề in cho -250 (nếu đề gốc là $500x^{4}$ thì -125). Giữ -250.
- **nbv-b2-e-1**: dạng NDB01172 (vừa) — thực chất rút nhân tử $\sqrt x$ ở giới hạn một bên $x\to0^{+}$, không nhân liên hợp; bản đồ không có dạng "0/0 rút nhân tử chứa căn". Có thể cân NDB01176 (căn tại điểm biên).
- **Câu 23, 38 bỏ** nhưng khôi phục được từ lời giải sách nếu Thùy muốn: câu 23 ($f$ đa thức, $\lim_{x\to1}\frac{f(x)-5}{x-1}=10$, $T=\lim_{x\to1}\frac{\sqrt[3]{4f(x)+7}-\sqrt{f(x)+4}}{x^{2}+x-2}$, $81T=-5$ — giả thiết "10" chỉ suy từ dòng cuối lời giải); câu 38 ($N(t)=\frac{50t}{t+4}$, tối đa $=\lim_{t\to+\infty}N(t)=50$). Câu 41 không khôi phục được.
