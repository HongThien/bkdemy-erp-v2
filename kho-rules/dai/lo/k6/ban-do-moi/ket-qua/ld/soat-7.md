KẾT LUẬN: ĐẠT

# Biên bản soát gói 7 — ƯC · ƯCLN · BC · BCNN (cơ bản + thực tế)

- Trạm soát: Opus · 14/10 · bản gốc giữ ở `out-7.goc.json`.
- Đã soát **15/15 dạng**: NDB00400, 401, 402, 405, 406, 403, 404, 407, 408, 409, 413, 414, 410, 411, 412.
- Kiểm máy (`node -e`, vét cạn): với $a,b\le 60$: $n\mid a,\ n\mid b \Leftrightarrow n\mid\text{ƯCLN}$ và $a\mid n,\ b\mid n \Leftrightarrow \text{BCNN}\mid n$ (0 lỗi); mẹo "thừa khác nhau ⇒ thiếu như nhau" với $a,b\le 20$, $x<3000$ (0 lỗi); ƯCLN/BCNN của mọi ví dụ trong gói tính lại khớp.
- Cổng `kiem-goi.mjs`: **✔ đạt cổng** (trước và sau khi sửa).

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00407 | thiếu điều kiện | "Số 0 là bội chung của mọi số" → "Số 0 là bội của mọi số **khác 0**" | SGK: 0 là bội của mọi số tự nhiên khác 0 |
| NDB00413 | thiếu điều kiện (mơ hồ) | "Chú ý số 0" → nói rõ: khoảng của đề chứa 0 (vd $n<100$) thì $n=0$ cũng thỏa | câu cũ không nói phải làm gì với số 0 |
| NDB00410 | thiếu dấu hiệu nhận biết | thêm dấu hiệu "đều vừa đủ, không thừa không thiếu" và phân biệt với dạng thừa thiếu NDB00411 | 2 dạng anh em chỉ khác nhau ở dữ kiện thừa/thiếu |
| NDB00411 | thiếu điều kiện / chưa đủ cho mọi đề | thêm "số thừa < số người một hàng"; thêm cách xử lý khi số thừa mỗi cách xếp KHÁC nhau (đổi sang số thiếu $a-r$, vd thừa 3 ở hàng 10, thừa 5 ở hàng 12 ⇒ đều thiếu 7, xét $x+7$) | biến thể hay gặp của dạng "dữ kiện thừa thiếu"; đã vét cạn kiểm đúng |
| NDB00412 | chưa đủ cho mọi đề | TC/PP mở rộng từ "chu kỳ thời gian" sang mọi đại lượng nhỏ nhất (số HS xếp hàng vừa đủ ít nhất…); CY thêm: $x\in\mathbb{N}^*$ loại 0 nên lấy BCNN; đề có thêm khoảng ("ít nhất, biết lớn hơn 100") ⇒ liệt kê B(BCNN) rồi chọn số nhỏ nhất trong khoảng | mô tả dạng là "bài toán thực tế về BCNN" nói chung, bản soạn chỉ phủ bài chu kỳ; "ít nhất" + khoảng mà lấy thẳng BCNN là sai |

Các dạng còn lại (NDB00400, 401, 402, 405, 406, 403, 404, 408, 409, 414): toán đúng, đủ điều kiện, phương pháp khớp ví dụ (liệt kê / phân tích TSNT, ƯC = Ư(ƯCLN), BC = B(BCNN)), có dấu hiệu phân biệt dạng anh em ("lớn nhất" vs có điều kiện; "nhỏ nhất khác 0" vs có khoảng), không dùng kiến thức ngoài whitelist, định dạng đúng (dấu `.`, `\text{Ư}`, không `##VD`, `##PP` mỗi dòng một bước).

## Điểm gửi CEO (đã ghi `ghi_chu`)

1. NNB00924: mô tả nhóm ghi "tìm BCNN bằng định nghĩa" nhưng nhóm có cả dạng phân tích TSNT (NDB00409).
2. Lý thuyết nhóm NNB00926 (đã có, trạm không sửa): viết `$n:7$` với nghĩa "chia hết cho 7", dùng `\cdot`, BC/BCNN không bọc `\text` — lệch k6.md §3.
3. Nhãn `cum_cu` lệch: NDB00406 trùng cụm NDB00405; NDB00404 trỏ cụm "Ước chung"; NDB00411/412 trỏ cụm "(không thừa thiếu)". Không ảnh hưởng lý thuyết.
4. Phần NDB00411 thêm mẹo "thừa khác nhau ⇒ thiếu như nhau" không có trong ví dụ hiện có — toán đúng, cấp lớp 6; CEO bỏ nếu muốn dạng chỉ gói gọn trong số thừa/thiếu bằng nhau.
