KẾT LUẬN: ĐẠT

# Biên bản soát gói 3 — Dãy luỹ thừa · Tìm x (lý thuyết cấp dạng)

- Trạm soát: Opus · 14/10 · bản gốc lưu `out-3.goc.json`.
- Số dạng đã soát: **13/13** (NDB00365, 366, 367, 348, 349, 350, 351, 357, 358, 359, 364, 362, 363). Đã sửa 7 dạng.
- Kiểm bằng máy (`node`, vét cạn $c=2..5$, $d=1..3$, $a=0..3$, tối đa 7 số hạng): $(c^d-1).S=c^{b+d}-c^a$ (cùng dấu) · $(c^d-1).S+c^a=c^{b+d}$ (tìm m) · $(c^d+1).S=c^{b+d}\pm c^a$, dấu của $c^a$ giữ như trong dãy (đan dấu) — **0 phản ví dụ**.
- Đối chiếu ví dụ: cả 13 dạng có phương pháp trùng cách giải trong `vi_du_hien_co` (hệ số nhân $3$, $7^2$, $2^2$, $5^2$; trừ với cùng dấu, cộng với đan dấu; tìm thành phần trước, nhân chia sau).
- Cổng `kiem-goi.mjs`: ✔ đạt cổng.

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00366 | thiếu điều kiện | Bước cuối: "Kết luận $m=b+d$" → "cho hai số mũ bằng nhau để tìm $m$ (thường $m=b+d$; số mũ vế phải là biểu thức chứa $m$ thì giải tiếp)". CY "hệ số của $S$ phải đúng bằng $c^d-1$" → "thường đúng bằng $c^d-1$ — dấu hiệu chọn số nhân". Bỏ chữ lai "hệ số.$S$ + số", viết thẳng $(c^d-1).S+c^a$. | Đề dạng này có biến thể $3^{2m+1}$, $2A+3=3^m$ (dãy bắt đầu từ $3$); "phải đúng bằng" là khẳng định không đúng cho mọi đề, chỉ là dấu hiệu. |
| NDB00367 | toán (mơ hồ dấu) | CY "chú ý dấu khi dãy bắt đầu bằng dấu $-$" → nêu rõ số hạng nhỏ nhất giữ dấu của nó trong dãy cũ; thêm ví dụ $2^{100}-\ldots+2^2-2$ ⇒ $3A=2^{101}-2$. | Dãy số tự nhiên không "bắt đầu bằng dấu $-$"; ca thật là dãy kết thúc bằng $-c^a$ — đã kiểm bằng máy. |
| NDB00351 | thiếu điều kiện | Mở rộng cụm số trừ: $5x$ **hoặc** $x:5$; bước cuối "chia cho hệ số $k$" → "tìm $x$ từ cụm bằng quy tắc nhân hoặc chia"; thêm $k\ne 0$. | Bản soạn chỉ phủ $a-k.x=b$; đề $90-x:5=35$ cùng dạng sẽ bị bảo "chia cho $5$" (sai, phải nhân). |
| NDB00357 | định dạng / diễn đạt | "thực hiện nhân chia ở vế còn lại" → "các phép nhân chia không chứa $x$, thu gọn vế không chứa $x$". | $2^3.5$ nằm cùng vế với $x$, "vế còn lại" gây hiểu sai. |
| NDB00358 | thiếu điều kiện | Thêm $n\in\mathbb{N}^*$; thêm CY: vế phải nằm giữa hai luỹ thừa liền nhau thì không có $x$ tự nhiên ($x^2=50$). | Phương pháp "đưa về $b^n$" không dùng được khi vế phải không là luỹ thừa bậc $n$ — HS phải biết kết luận vô nghiệm. |
| NDB00364 | kiến thức (chuyển vế) + toán | CY "$-9$ thành $+9$" (giọng chuyển vế, đổi dấu — cấm ở K6 §1) → "$4.(x+5)$ là số bị trừ nên $4.(x+5)=27+9$". CY "không nhân hệ số vào ngoặc … không tính $4.x+4.5$" → "không cần nhân…, lấy ngay $x+5=36:4$" (nhân phân phối không sai). Thêm $k\ne 0$, quy tắc số chia $k:A=m\Rightarrow A=k:m$, bóc ngoặc nhiều tầng từ ngoài vào. | Luật kiến thức K6; câu cũ gọi một phép biến đổi đúng là "sai"; lý thuyết nhóm NNB00901 có nêu thành phần "số chia". |
| NDB00362 | thiếu điều kiện | Thêm $n\in\mathbb{N}^*$ cho $(\ldots)^n=b^n$. | Đủ điều kiện như NDB00358. |

Không sửa: NDB00365 (công thức $(c^d-1).S=c^{b+d}-c^a$ đúng, nhấn hệ số $c^d$ và cộng $d$ vào số mũ cuối), NDB00348, 349, 350, 359, 363 — đúng, khớp ví dụ, có dấu hiệu riêng, không chép nhóm.

## Điểm còn nghi gửi CEO

1. **Lý thuyết nhóm NNB00899** (trường hợp 3, bước 3) vẫn ghi "Chuyển vế, đổi dấu" — lệch luật K6 §1; ví dụ nhóm NNB00895 còn `\cdot` và `\n` chép dở. Lý thuyết dạng gói này đã viết theo thành phần chưa biết, nhưng chữ ở nhóm cần CEO sửa.
2. **Tên cụm cũ** DCUM01596 "Tìm x chứa ngoặc: x ở Cơ số" gom cả 3 dạng NDB00364/362/363; DCUM01572 "Tìm x là Số hạng" gom cả NDB00349 — tên cụm không khớp dạng (đã có trong `ghi_chu`).
3. NDB00366: nếu kho có câu mà hệ số của $S$ **không** bằng $c^d-1$ (vd $4A+2$), biểu thức không là luỹ thừa — lý thuyết hiện chỉ nói "thường"; nếu CEO muốn dạng chỉ nhận đề chuẩn thì giữ nguyên.
