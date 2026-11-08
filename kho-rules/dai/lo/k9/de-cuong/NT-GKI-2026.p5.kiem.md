# NT-GKI-2026 · p5 (PHẦN 4 — Dạng 3: giải bài toán bằng cách lập phương trình / hệ, bài tập thực hành) — GIẢI MÙ của trạm soát

Nguồn: ảnh `trang/p-07.png` (Bài 1–4), `trang/p-08.png` (Bài 5–6). Script kiểm: `<LV>\tam\kiem_p5_soat.mjs` (thay đáp số vào từng dữ kiện + quét lưới; mọi dòng OK).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1 | Gọi giá đã mua $x$ đồng/thùng ($x>0$), giá dự định $x+15000$: $\dfrac{900000}{x}-\dfrac{900000}{x+15000}=2$ ⇒ $x^2+15000x-6750000000=0$ ⇒ $(x-75000)(x+90000)=0$ ⇒ **75 000 đồng/thùng** (mua 12 thùng, dự định 10 thùng, giá gốc 90 000). `tu_luan` (75000 > 4 kí tự) | Đề in "bạn Hoa" (cả bài chỉ có Lan) và "dự đinh" — người gõ đã sửa (giữ). "Giá tiền mỗi thùng mà bạn Lan đã mua" = giá sau giảm. |
| Bài 2 | Vận tốc lượt đi $x$ km/h ($x>6$), về $x-6$: $\dfrac{42}{x-6}=\dfrac{3}{2}\cdot\dfrac{35}{x}$ ⇒ $84x=105(x-6)$ ⇒ $x=30$ ⇒ **lượt đi 30 km/h, lượt về 24 km/h**. `tu_luan` | — |
| Bài 3 | Xe máy $x$ km/h ($x>0$), ô tô $x+10$: $\dfrac{200}{x}-\dfrac{200}{x+10}=1$ ⇒ $x^2+10x-2000=0$ ⇒ $(x-40)(x+50)=0$ ⇒ **xe máy 40 km/h, ô tô 50 km/h**. `tu_luan` | — |
| Bài 4 | Tháng giêng tổ I $x$, tổ II $y$ chi tiết: $x+y=900$; $115\%x+110\%y=1010$ ⇒ **tổ I 400, tổ II 500 chi tiết máy**. `tu_luan` | Đề in "chi tiêt" — người gõ đã sửa. |
| Bài 5 | Vận tốc xuôi $x$, ngược $y$ (km/h): $\dfrac{81}{x}+\dfrac{105}{y}=8$; $\dfrac{54}{x}+\dfrac{42}{y}=4$; đặt $u=\dfrac1x$, $v=\dfrac1y$ ⇒ $u=\dfrac1{27}$, $v=\dfrac1{21}$ ⇒ **xuôi 27 km/h, ngược 21 km/h** (riêng 24, dòng 3 — đề không hỏi). `tu_luan` | Đề hỏi đúng vận tốc xuôi và ngược; câu "biết vận tốc dòng nước và vận tốc riêng không đổi" chỉ là giả thiết. |
| Bài 6 | Giá chưa VAT loại 1 $x$, loại 2 $y$ (triệu đồng): $110\%x+108\%y=2{,}17$; $109\%(x+y)=2{,}18$ ⇒ $x+y=2$ ⇒ **loại 1: 0,5 triệu đồng; loại 2: 1,5 triệu đồng**. `tu_luan` | — |
