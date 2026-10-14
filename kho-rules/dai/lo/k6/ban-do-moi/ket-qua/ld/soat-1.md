KẾT LUẬN: ĐẠT

# Biên bản soát gói 1 — Lý thuyết cấp dạng bài, bản đồ mới K6 (Tập hợp · Số La Mã · Tính toán số tự nhiên)

- Trạm soát: Opus · 14/10 · không ghi DB, không commit.
- Đã soát **6/6 dạng** cần viết: NDB00336, NDB00337, NDB00338, NDB00339, NDB00340, NDB00341 (NDB00335 đã có lý thuyết của CEO, bỏ qua).
- Bản gốc trạm soạn: `out-1.goc.json`. Đã sửa thẳng vào `out-1.json`. Cổng `kiem-goi.mjs`: **✔ đạt cổng** (lý thuyết dạng 6 · ghi chú 4).
- Kiểm bằng máy (`node -e`): số La Mã 1–30 theo luật "cụm chục (X, XX, XXX) + cụm đơn vị (I…IX)": không số nào có 4 chữ giống nhau liền nhau hoặc VV, đọc ngược đúng cả 30 số. Đã chọn ví dụ chia có chữ số 0 ở thương ($1224:12=102$).

## Bảng sửa

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00337 | thiếu điều kiện | `##PP` bước 3: "phần tử lớn nhất là $m$ thì ghi $x\le m$" → "nhỏ nhất $k$, lớn nhất $m$ thì ghi $k\le x\le m$ (hoặc $k-1<x<m+1$); bỏ cận dưới chỉ khi $k$ là số nhỏ nhất của tập số gốc ($0$ với $\mathbb{N}$, $1$ với $\mathbb{N}^*$)" | Bản soạn chỉ nêu cận trên. Áp vào tập như $\{11;13;15;17;19\}$ hoặc $\{3;4;5\}$ thì ra sai tập (thừa phần tử nhỏ). Vì vậy phương pháp chưa đúng cho mọi đề của dạng. |
| NDB00336 | thiếu điều kiện | thêm 1 dòng `##CY`: tập vô số phần tử thì viết vài phần tử đầu theo quy luật rồi thêm "...", vd $\{0; 2; 4; 6; ...\}$ | Bước "viết lần lượt mọi số thoả mãn" không dùng được với tập vô hạn (SGK có $\mathbb{N}=\{0;1;2;...\}$, lý thuyết nhóm có nêu "vô số phần tử"). |
| NDB00341 | thiếu (bẫy chính của dạng) | thêm 1 dòng `##CY`: hạ chữ số mà số mới vẫn nhỏ hơn số chia thì viết $0$ vào thương rồi mới hạ tiếp (vd $1224:12=102$) | Đây là lỗi hay gặp nhất của phép chia viết, nhưng bản soạn không nêu. Phương pháp chia ở `##PP` cũng không nói tới ca này. |

**Đã soát, không phải sửa:**
- **NDB00338:** đúng kiến thức, khớp 2 ví dụ ("NHA TRANG" bỏ chữ lặp, tháng có 30 ngày, $\notin$). Số ngày từng tháng đúng.
- **NDB00339:** đúng phạm vi lý thuyết nhóm (tới XXX). Khớp cách đọc trong ví dụ XVIII, XXIX, XXIV.
- **NDB00340:** đúng. Có nêu điều kiện $a\ge b$ cho phép trừ trong $\mathbb{N}$.
- Định dạng của cả 6 dạng: không có `\cdot`/`\times`, không có `##VD`, `##PP` mỗi dòng một bước. Không chép nguyên văn lý thuyết nhóm. Không có kiến thức ngoài lớp 6.

## Điểm còn nghi, gửi CEO

1. **Ghi chú của trạm soạn (giữ nguyên trong `out-1.json`):** NDB00341 (Nhân – Chia) đang gắn cụm cũ DCUM01564 "Cộng – Trừ". NDB00336/337/338 cùng gắn cụm DCUM01587 "Liệt kê". Mô tả NDB00338 chỉ nói "chữ cái" trong khi ví dụ có cả tháng. Nhóm NNB00890 không có mô tả. Đây là việc gom cụm/mô tả trên bản đồ, thuộc quyền CEO.
2. **NDB00338:** với cụm từ tiếng Việt có dấu (vd "HỌC SINH"), chưa có quy ước tính chữ có dấu là một phần tử riêng hay gộp về chữ gốc. Lý thuyết dạng hiện chưa nêu. Nếu đề có loại này, CEO cần chốt quy ước.
3. Ví dụ NDB00341 trong bản đồ còn dùng `\times` (`$14\times7$`), lệch luật dấu chấm của k6.md §3. Lý thuyết dạng không bị ảnh hưởng, nhưng nên chuẩn hoá ví dụ.
