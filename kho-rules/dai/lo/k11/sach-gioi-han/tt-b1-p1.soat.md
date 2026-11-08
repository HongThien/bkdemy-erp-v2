KẾT LUẬN: ĐẠT

# tt-b1-p1 — biên bản soát (nhân chứng thứ hai)

- Số câu: **73** (34 câu từ 13 ví dụ: 32 `giang` + 2 `luyen` [VD3.4a/b]; 39 trắc nghiệm `luyen`; 0 Đ/S). Không câu nào bỏ vì hình (35 `[[img:]]` trong nguồn đều là hình trang trí / khung).
- Lệch đáp số so với bản giải mù (`tt-b1-p1.kiem.md`): **trước 0 / sau 0**. 73/73 khớp `dap_an` + kết luận lời giải.
- Ba câu trạm soạn ghi LỆCH SÁCH — tôi giải mù ra **cùng kết quả với bản soạn**, đối chiếu nguồn xác nhận sách sai:
  - **C7**: sách ghi "Chọn D ($-3$)" nhưng chính dòng tính của sách ra $0$ ⇒ đúng là **B**.
  - **C15**: sách chia sai dấu ra $-\frac13$ (D); $\frac{2-1/n}{3/n-1}\to-2$ ⇒ đúng là **A** (máy: $-2{,}00005$ ở $n=10^5$).
  - **C31**: sách coi $1+5+\dots+(4n-3)$ là cấp số nhân ⇒ $+\infty$ (B); thực ra là CSC công sai 4, tổng $n(2n-1)$ ⇒ $\frac{\sqrt2}{2}$ ⇒ đúng là **C** (máy: $0{,}70711$).
- Đề chuẩn hoá: so từng câu với nguồn `.txt` — đủ 73, giữ đúng số/dấu/mũ. VD2.2c đề sách in lặp ý ⑶ của VD2.1, trạm soạn lấy dãy theo lời giải sách ($\frac{2025n+2024}{n-2023}$) — hợp lý, đã ghi chú.
- Phạm vi: không L'Hôpital / đạo hàm / giới hạn đặc biệt. C28 trước đây dùng $\sum k^2$ như "kết quả đã biết" (ngoài SGK) ⇒ đã viết lại để tự dẫn bằng hằng đẳng thức lập phương + tổng CSC.
- `kiem`: đều tính lại từ đề (n lớn / BigInt cho luỹ thừa / lặp truy hồi), trắc nghiệm kiểm cả 4 phương án qua `pick`; không tautology. `kiem.mjs` ✔ đạt sau sửa.

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| VD1.3b | dạng | NDB01148 → **NDB01158** (vừa): lời giải chính là nhân liên hợp căn trừ đa thức, dạng sau thắng |
| C17 | dạng | NDB01162 → **NDB01151** (cao): $u_n,v_n\to0$, không dùng quy tắc vô cực; rút gọn ra phân thức cùng bậc |
| C32 | dạng | NDB01156 → **NDB01157** (vừa): cùng khuôn với C31 (tổng CSC dưới căn, $\sqrt{n^2}=n$ trong thương) — trạm soạn gán C31 và C32 lệch nhau |
| C28 | phạm vi / lời giải | tự dẫn $1^2+\dots+n^2=\frac{n(n+1)(2n+1)}6$ từ $(k+1)^3-k^3=3k^2+3k+1$ + tổng CSC; thêm 1 `kiem` cho phép dẫn; Phần 1 thành 4 bước |
| C15 | đề (ĐKXĐ) | thêm dòng "Lưu ý: $u_3$ không xác định (mẫu $3-n=0$) …" đầu Phần 2 + ghi_chu "đề sai nhẹ" |
| VD2.2c | đề (ĐKXĐ) | thêm "Lưu ý: $u_{2023}$ không xác định …" + ghi_chu |
| VD1.3b, VD2.1b, VD3.2c, VD3.4a, VD3.4b, VD4.3b, C6, C7, C8, C18, C24, C26, C27, C29, C30, C31 | lời giải (khuôn) | Phần 2 chưa có dòng kết "Vậy …" (kết bằng "Theo quy tắc…", "Suy ra…", "…nên…") ⇒ tách / thêm dòng "Vậy …"; VD3.4a đổi "Vậy $(v_n)$ là CSN" giữa bài thành "Suy ra" |
| VD2.3a | lời giải | câu cụt "Vì … và … ." ⇒ "Ta có … và … ." |
| VD3.3b | định dạng | $\dfrac{3/2}{5/3}$ ⇒ $\dfrac{\dfrac32}{\dfrac53}$ |
| C35 | lời giải | "Chia cả tử và mẫu cho $n$" (sai chữ — thực tế rút $n^2$ ở tử) ⇒ "Rút $n^2$ ở tử và $n$ ở mẫu" |

Bản gốc của trạm soạn: `tt-b1-p1.goc.json`. Script sửa: `sua.mjs` ở scratchpad phiên soát (đọc từ `.goc.json`, ghi đè `.json`).

## Xét lại dạng theo yêu cầu

- **VD1.1a–VD1.3a (7 câu, NDB01148 vừa — giữ)**: đề "Chứng minh rằng $\lim u_n=L$", sách dạy bằng định nghĩa (chặn $|u_n-L|$). Bản đồ KHÔNG có dạng "chứng minh giới hạn dãy bằng định nghĩa"; NDB01148 (kể từ số hạng nào $|u_n|$ nhỏ hơn…, $q^n$ với $|q|<1$) là gần nhất và khớp với cách giải. Nếu áp cứng "một cách giải thuộc dạng sau ⇒ dạng sau" thì VD1.1a/b, VD1.2a/b → NDB01151, VD1.2c/d → NDB01154 — nhưng khi đó lời giải mẫu (chặn hiệu) không còn dạy đúng kĩ năng của dạng đó. Tôi không đổi, đưa Thùy chọn.
- **VD1.3b**: đổi sang NDB01158 vì chính lời giải dùng liên hợp (khác các câu trên).
- **VD3.4a/b (để `luyen`, `dang_bai: null` — giữ)**: kĩ năng chính là "dãy truy hồi → đặt dãy phụ là CSN → công thức $u_n$"; bước cuối chỉ là $\lim q^n=0$ (NDB01148). Gán NDB01148 sẽ đặt một ví dụ truy hồi khó làm ví dụ giảng cho dạng nhận biết cơ bản ⇒ thà bỏ trống. Bản đồ thiếu dạng này.
- **VD4.2b (NDB01157 vừa — giữ, ghi nghi)**: tử $n^2+\sqrt[3]{1-n^6}$ là dạng $\infty-\infty$ khử được bằng liên hợp bậc ba (NDB01159, đứng sau); sách giải bằng rút $n^2$ (NDB01157). Theo luật "dạng sau thắng" thì là NDB01159.

## Còn nghi — cần Thùy

1. **VD1.1a–VD1.3a**: giữ NDB01148 "vừa" + thêm dạng "Chứng minh giới hạn dãy bằng định nghĩa" vào bản đồ, HAY áp luật dạng sau thắng (→ NDB01151/NDB01154, phải viết lại lời giải theo cách chia luỹ thừa)? Bản của tôi: giữ + thêm dạng.
2. **VD3.4a/b**: thêm dạng "Giới hạn dãy truy hồi (đưa về CSN)" để đưa 2 ví dụ về lại `giang`? Hiện `luyen`, chưa dạng.
3. **VD4.2b**: NDB01157 (theo cách sách) hay NDB01159 (theo luật dạng sau thắng)?
4. **C28**: chấp nhận cách tự dẫn $\sum k^2$ bằng $(k+1)^3-k^3$ (trong phạm vi) hay bỏ câu khỏi kho vì ngoài SGK? Bản đồ cũng chưa có dạng tổng bình phương (đang NDB01156 "vừa").
5. **C7 / C15 / C31**: đáp án kho khác đáp án in trong sách (B / A / C thay vì D / D / B) — nếu GV dùng sách giấy song song sẽ thấy lệch.
