KẾT LUẬN: ĐẠT

# Soát phần BỔ SUNG — HS, lượt G (C2.4, C2.5; C2.4.1–3, C2.5.1–C2.5.6) — 03/11

Phạm vi: `diff HS-G.truoc-bs.txt HS-G.txt` (C2.5.3 viết lại; dạng mới C2.5.5, C2.5.6; C2.4.3 VD1 d) + VD3; C2.5.2 VD3; C2.5.4 VD3, VD4; hai hình C2.4.1, C2.5.1 đổi khoảng cho tỉ lệ 1:1). Bản trước khi soát lượt này: `HS-G.truoc-soat2.txt`.

## Đối chiếu đề thật (`cau-dang.cjs HS C2.5.3 14`, phân loại tay 14 câu cũ)
- C2.5.3 (tham số trong công thức, 7): 5694, 2200, 2168 (cos), 5921, 5672, 5716, 2172.
- C2.5.5 (hàm ẩn từ đồ thị, 3): 1053 ($f(u)+m$), 5652, 1141 (đồ thị $f'$ + đẳng thức).
- C2.5.6 (ứng dụng max–min, 4): 2167 (bpt có nghiệm, $f'$ cho bằng bảng), 4084 (pt có nghiệm), 6622, 2164 (hai biến).
Khớp với GHI CHÚ của trạm bổ sung (7/3/4). Ví dụ mới đúng kiểu đề; số liệu đã đổi, không chép đề. C2.4.3 (xúc xắc, hình chữ nhật) và C2.5.4 (h/f bậc ba từ đồ thị, mẫu chứa căn) đối chiếu `cau-dang.cjs` khớp kiểu.

## Tự giải lại (script `S\soat2\HS-G\giai.mjs`, độc lập)
13 ý/ví dụ mới đều khớp: C2.4.3 VD1 d) = 8; VD3 a) $m\le-1$, b) 24/36 ⇒ 5 · C2.5.2 VD3 3 và 5 cực trị · C2.5.3 VD1 5/10, VD2 $\pm\sqrt5$, VD3 4 · C2.5.4 VD3 = 3, VD4 = 18 · C2.5.5 VD1 $m=3$, min 1; VD2 $a=1$, $b=0$ · C2.5.6 VD1 7 và $m=0$; VD2 9/2.
Đẳng thức hình $f'=(x-1)(x-3)^2/2$: tích phân số cho $f(0)+f(1)=f(3)+f(4)=-1{,}7917$ (đúng với hình), argmin 1, argmax 0.

## Hình (dựng ra PNG bằng `S\soat2\HS-G\ve.mjs` + Chrome, đã nhìn 6/6 đồ thị)
Ô lưới vuông, hai trục cùng đơn vị ở cả 6 hình; giá trị đọc từ hình khớp đề + lời giải (điểm cực trị, nghiệm, đường $y=3$, $y=-1$, tiệm cận).

## Chỗ đã sửa
| Chỗ | Loại lỗi | Sửa |
|---|---|---|
| C2.5.6 VD1 b) (cũ) | Ý đề không hỏi ("nghiệm đúng với mọi $x$": 0 câu đề; đề chỉ hỏi "có nghiệm") | Xoá ý, đổi c) thành b); đáp số "a) 7; b) $m=0$" |
| C2.5.6 TC ý 2, PP bước 2, CY ý 1 | Cùng lỗi trên | Chỉ giữ điều kiện "có nghiệm"; CY nhắc chiều min/max |
| C2.5.5 TC ý 2 | Lặp lý thuyết nhóm C2.5 (dấu $f'$ ⇒ đồng/nghịch biến, chạm $Ox$) | Rút gọn: từ dấu $f'$ lập BBT, ứng viên = đầu mút + điểm đổi dấu |
| C2.5.5 CY ý 2 | Lặp CY nhóm ("đồ thị $f'$ chỉ cho dấu") | Thay bằng: BBT không so được $f(0)$, $f(4)$ — phải dùng đẳng thức |
| C2.5.3 TC | Câu lượng giác (đề 2168: $m$ trong hệ số) đặt nhầm dưới ý "tham số chỉ cộng thêm" | Chuyển sang ý "tham số trong hệ số" |
| Hình C2.4.1 VD (dòng 47) | Nhãn "y=f(x)" bị cắt ở mép phải sau khi thu khoảng | `xt` 6 → 4.6 |
| GHI CHÚ CHO CEO | Cập nhật | Ghi lý do bỏ "nghiệm đúng với mọi $x$" |

Không có đoạn bị nhân đôi (dò dòng trùng = 0). Máy kiểm: `kiem-moi.mjs HS HS-G.txt <11 mã>` → 9 dạng · 23 ví dụ · 8 hình · lỗi 0 · cảnh báo 0.

## Cần CEO xem
- C2.5.5 TC ý 4 (so sánh bằng diện tích $\int f'$): có trong mô tả `HS.json` nhưng 3 câu đề thật đều giải bằng đẳng thức, không câu nào cần tích phân; giữ theo mô tả — nếu áp chặt "đề không hỏi thì bỏ" thì xoá ý này và sửa mô tả JSON.
- C2.5.5 VD1 b) hỏi GTNN của $f(u)+m$ (đề 1053 chỉ hỏi GTLN): giữ vì tên dạng là "GTLN, GTNN"; xoá được nếu muốn chặt.
- `HS-cau.tsv` vẫn gom 14 câu vào C2.5.3 — cần tách theo bảng phân loại trên khi nhập kho.
