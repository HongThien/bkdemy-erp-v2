KẾT LUẬN: ĐẠT

# nbv-b1-b — biên bản soát (nhân chứng thứ hai)

- Số câu: **64** (64 luyen · 0 giang · 0 Đ/S · 0 chưa dạng). Nguồn chỉ có mục "Câu" (không có "Ví dụ") ⇒ toàn bộ `luyen` là đúng.
- Lệch đáp số Pha 1: **trước 1** (20d) · **sau 0**.
  - 20d $\lim(3n-\sqrt{4n^2+1})$: bản mù của tôi ghi $-\infty$ — **tôi sai** (thừa số $3-\sqrt{4+1/n^2}\to3-2=1>0$; máy: $n=10^7$ cho $\approx10^7$). Bản soạn $+\infty$ = sách. Giữ.
- Đề: đối chiếu từng câu với `nbv-b1-b.txt` — đủ 39 câu (64 câu sau tách ý), số / dấu / số mũ / chỉ số giữ đúng. Tách ý đúng luật (2, 3, 6–11, 13, 19, 20, 25, 28 tách; 5, 31, 36, 37, 38 giữ nguyên vì chung dữ kiện / ý sau dùng ý trước).
- Câu có hình 32, 34, 35, 39: **xác nhận** hình chỉ minh hoạ, đề đủ chữ để giải (đã giải mù được cả 4 mà không cần hình). Không có câu bị bỏ nhầm.
- Phạm vi: không L'Hôpital / đạo hàm; 23 dùng $|\cos n|\le1$ + "dãy bị chặn bởi dãy dần về 0" (trong SGK). `kiem` đều tính lại từ đề (không tautology), riêng 28a/28b/30 kiểm bằng so khai triển thập phân — chấp nhận.

## LỆCH SÁCH (phân xử bằng máy)

| id | sách | bản soạn | máy | kết luận |
|---|---|---|---|---|
| 31 | $u_n=3(1-\frac1{3^n})+2$, lim $5$ | $u_n=3-\frac1{3^{n-1}}$, lim $3$ | lặp truy hồi 60 bước: $u\to3$; $u_2=\frac83$ | **sách sai** (lấy $v_1=2$ thay vì $\frac23$); bản soạn đúng |
| 32 | $a(3+2\sqrt3)$ | $a(4+2\sqrt3)$ | cộng 200 đoạn, đoạn đầu $A_1A_2=a$, tỉ số $\cos30^\circ$: $7{,}4641a$ | **sách sai** (bỏ đoạn $A_1A_2$); bản soạn đúng |
| 38c | $S_n=100+2(h_1+\dots+h_n)$ | $S_n=100+2(h_1+\dots+h_{n-1})$ | đếm đến lần chạm đất thứ $n$: $n-1$ cặp lên–xuống | **sách sai công thức $S_n$**, giới hạn $\frac{500}3$ trùng |
| 24 | gộp tắt $\lim(u_n-\frac n{n+1})=\lim(u_n-1)$ | tách hai giới hạn | lim $=1$ | cùng đáp số, chỉ khác trình bày |
| 29 | chỉ xét $0<q<1$ rồi suy $q>1$ | xét $\lvert q\rvert<1$, $\lvert q\rvert>1$ (+ tôi thêm $q=-1$) | $q=4$: tỉ số $\to0{,}75$ | cùng đáp số |

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| 29 | dạng | `NDB01154` → **`NDB01156`** (vừa): $S_n$ là tổng $n$ số hạng CSN, tính theo công thức rồi lấy giới hạn — đúng mô tả 01156, và 01156 đứng SAU 01154 |
| 29 | lời giải | thêm trường hợp $q=-1$ ($S_n=0$ với $n$ chẵn, tỉ số không xác định) — trước đó chia trường hợp chưa phủ hết |
| 35 | lời giải | Phần 2 chỉ nêu "cạnh $a_1=\frac12$, $a_2=\frac12a_1$" không giải thích; thêm lập luận: $\triangle A_1MB_1$ vuông cân ⇒ $A_1M=A_1B_1=OA_1$ ⇒ $a_1=\frac12$, lặp lại ⇒ $a_n=(\frac12)^n$; thêm dòng kết "Vậy" |
| 8a | lời giải (chữ) | Mấu chốt "luỹ thừa của $n$" (sai nghĩa) → "luỹ thừa có số mũ $n$" |
| 1, 4, 3b, 5, 31, 32, 34, 36, 39 | lời giải (khuôn) | Phần 2 chưa kết bằng "Vậy …" ⇒ thêm / đổi dòng kết (không đổi nội dung toán) |

Sau sửa: `kiem.mjs` ✔ đạt. Bản gốc trạm soạn: `nbv-b1-b.goc.json`.

## Dạng — xác nhận các gán trạm soạn nêu

- 1, 4, 15, 23, 24 → `NDB01148` vừa: đồng ý (định nghĩa giới hạn 0 / kẹp; bản đồ không có dạng riêng "nguyên lí kẹp / dãy bị chặn").
- 14 → `NDB01154` vừa: đồng ý (01153 "phân thức chứa tham số" đứng TRƯỚC 01154 nên 01154 thắng).
- 31 → `NDB01163` vừa: đồng ý (ý c tính được bằng tổng CSN lùi vô hạn; 01163 đứng sau 01156).
- 39 → `NDB01151` vừa: đồng ý (lập $S_n$ là phân thức cùng bậc; 01186 là giới hạn HÀM số, không hợp).
- 3b, 9c, 13c, 13d, 20c, 20d → `NDB01161`: đồng ý (rút luỹ thừa / cơ số lớn nhất, giới hạn $\pm\infty$; 01161 đứng sau 01152 / 01154).

## Còn nghi — cần CEO

- **3c** $\lim\dfrac{-3+\frac1n}{\frac1{n^2}}$: trạm gán `NDB01162` cao (quy tắc thương, mẫu → 0⁺, đúng cách sách giải). Nhưng rút gọn ra $\lim(-3n^2+n)$ thì thuộc `NDB01161` — dạng ĐỨNG SAU. Theo chữ luật "một cách thuộc dạng nào thì đưa vào dạng đó + dạng sau thắng" phải là 01161; tôi GIỮ 01162 vì câu được ra để luyện quy tắc thương ($L/0$). Thùy chọn.
- Bản đồ THIẾU dạng "dãy bị chặn bởi dãy dần về 0 / nguyên lí kẹp cho dãy" (15, 23, 24 đang tạm vào 01148).
