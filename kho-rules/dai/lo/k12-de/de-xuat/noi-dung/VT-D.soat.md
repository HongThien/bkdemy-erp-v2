KẾT LUẬN: ĐẠT

Lượt VT-D · 4 nhóm (C3.5, C4.1, C4.2, C4.3) · 8 dạng · 16 ví dụ đã tự giải lại bằng máy (16/16 đúng đáp số) + 2 câu đề thật dùng để xác nhận cách giải (T312000000296, T312000000166) · 0 hình `[[HINH]]` (lượt này không có hình) · 24 chỗ đã sửa · máy kiểm `kiem-moi.mjs` lỗi 0, cảnh báo 0.

Bản gốc trạm soạn: `noi-dung/VT-D.goc.txt`. Script soát (độc lập trạm soạn): `S\soat\VT-D\kiem.mjs` — quét lưới tìm cực trị trực tiếp (không dùng công thức tâm tỉ cự/đối xứng), giải hệ lực căng bằng Cramer, tính lại toạ độ từ góc, tam thức khoảng cách theo t; 34/34 OK.

Đã đối chiếu: đề thật qua `cau-dang.cjs` (C3.5.1 19 câu, C3.5.2 23 câu, C4.1.1 72, C4.1.2 13, C4.2.1 44, C4.2.2 11, C4.3.1 73, C4.3.2 48 — xem phần lớn mỗi dạng); grep toàn kho đề tìm "MA−MB" (0 câu). Sách: NBV 12-9 `S\sach\vt-nbv\` (A._LY_THUYET, B._TU_LUAN Dạng 3 Ứng dụng, C._BAI_TAP_TRAC_NGHIEM, E._TRA_LOI_NGAN); các bản Từ Tâm/PNL trạm soạn đã trích ở `S\sach\vt\` (tt-b3p1, pnl-b3d2) dùng để đối chiếu tâm tỉ cự và radar. Công thức trong Word là ảnh WMF ⇒ chỉ đối chiếu lời văn/cách giải; các cách giải trong lượt khớp sách.

Ranh giới VT/PP toạ độ: sau sửa, thân tệp không còn phương trình mặt cầu/mặt phẳng/đường thẳng (grep "phương trình|mặt cầu|đường thẳng|hình cầu" chỉ còn "hệ phương trình" lực căng và mục GHI CHÚ). C4.3.2 VD2 cũ (flycam trong vùng kết nối, $OM(t)^2\le150^2$ với tâm cố định O) đúng là bài đường bay cắt hình cầu ⇒ đã thay bằng phương án hai UAV (27 km) của trạm soạn. Nhóm C4.1: công thức hợp lực, bình phương vô hướng, lực căng theo vectơ đơn vị, giá đỡ $F_i=k\overrightarrow{SA_i}$ với tổng = trọng lực (đúng quy ước đề thật và NBV/CD12), cân bằng dây treo $\sum F_i=-\overrightarrow{P}$ — đúng vật lý; hệ 3×3 VD2 kiểm lại ra 10, 30, 40 N.

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C3.5 | lý thuyết nhóm (TC) | trình bày | "tung độ cao $z$" → "cao độ $z$" |
| C3.5 | lý thuyết nhóm (PP) | phạm vi | "giao của đường thẳng với mặt phẳng toạ độ" → "giao điểm của một đoạn thẳng" |
| C3.5.1 | lý thuyết dạng (TC) | toán | $k<0$: GTLN đạt khi $MI$ **nhỏ nhất** (bản gốc ghi "hoặc lớn nhất") |
| C3.5.1 | lý thuyết dạng (TC) | thiếu kiểu đề | thêm ý tổng tích vô hướng $a\,\overrightarrow{MA}\cdot\overrightarrow{MB}+\ldots=(a+b+c)MI^2+$hằng, $I$ hệ số $a+c,a+b,b+c$ (câu T296; đã kiểm bằng số) |
| C3.5.1 | lý thuyết dạng (TC) | thiếu theo mô tả | thêm ý M chạy trên cạnh hình khối: $\overrightarrow{PM}=t\overrightarrow{PQ}$, $t\in[0;1]$ (mô tả + mục moi + T112070308026, T1120000003680) |
| C3.5.1 | lý thuyết dạng (PP) | toán/trình bày | bước 1: $k=0$ ⇒ "không có tâm tỉ cự" (bản gốc nói biểu thức không phụ thuộc M — sai với tổng bình phương); bước 5 thêm trường hợp cạnh hình khối |
| C3.5.2 | lý thuyết dạng (TC, PP, tên khung) | ý thừa | xoá ý \|MA−MB\| lớn nhất — toàn kho đề 0 câu hỏi hiệu |
| C3.5.2 | lý thuyết dạng (TC) | phạm vi | "giao điểm đường thẳng AB với (Oxy), $M=A+t\overrightarrow{AB}$" → "$A'$, $M$, $B$ thẳng hàng: $\overrightarrow{A'M}=t\overrightarrow{A'B}$" |
| C3.5.2 | lý thuyết dạng (TC) | thiếu kiểu đề | thêm ý $p\lvert\ldots\rvert+q\lvert\ldots\rvert$ → tâm tỉ cự → $c(MI+MJ)$ (T312000000178, T1120000004788) |
| C3.5.2 | lý thuyết dạng (CY) | trình bày | bỏ bẫy "$t\in[0;1]$" (khác phía thì luôn đúng, không phải bẫy thật); thêm bẫy thật của đề: hệ trục đổi hướng ($Ox$ Nam, $Oy$ Đông) |
| C3.5.2 | ví dụ 1 | phạm vi/trình bày | tham số hoá bằng $\overrightarrow{AM}=t\overrightarrow{AB}$ (thẳng hàng) thay cho viết đường thẳng |
| C3.5.2 | ví dụ 2 | phạm vi/trình bày | như trên với $\overrightarrow{A'M}=t\overrightarrow{A'B}$ |
| C4.1 | lý thuyết nhóm (TC) | lặp | bỏ ý công của lực (đã có ở C4.1.2, mô tả xếp công vào C4.1.2) |
| C4.1.1 | lý thuyết dạng (TC) | thiếu theo mô tả/đề | thêm: vật đứng yên ⇒ lực còn lại bằng độ lớn hợp lực (T112070109033, T112070109032, đèn tròn ba dây); vận tốc cộng gió (T1120000003720) |
| C4.1.2 | lý thuyết dạng (CY) | trình bày/vật lý | "bốn dây đối xứng hướng xuống" → cạnh bên chóp đều, $4F\cos\varphi=P$ |
| C4.2.1 | lý thuyết dạng (TC) | lặp nhóm | bỏ toạ độ đỉnh chóp đều (đã ở nhóm); thêm ý đọc "cách trần", "chính giữa bức tường" (đề quạt treo tường hỏi nhiều) |
| C4.2.1 | lý thuyết dạng (PP) | lặp nhóm | viết lại PP riêng cho phòng/nhà (bản gốc gần trùng PP nhóm) |
| C4.2.1 | ví dụ 1 | trình bày | "ổ điện đặt ở góc phòng có toạ độ sàn (0;6;0)" (mơ hồ) → "gắn trên mép tường đứng đi qua (0;6;0)" (đề + lời giải) |
| C4.3 | lý thuyết nhóm (TC) | lặp dạng | bỏ ý khoảng cách là căn tam thức theo t (thuộc C4.3.1), thay bằng ý chung khoảng cách hai vật tại một thời điểm |
| C4.3 | lý thuyết nhóm (PP) | lặp dạng | PP nhóm viết lại chung 3 bước (bản gốc gần trùng PP C4.3.1) |
| C4.3.1 | lý thuyết dạng (PP) | lặp nhóm | PP riêng: hai cách tìm vận tốc, hỏi thời gian, đưa về $a(t-t_1)^2+c$ |
| C4.3.2 | lý thuyết dạng (TC, PP) | phạm vi | bỏ ý "vào–ra vùng phủ: giải $IM(t)^2=R^2$" (đường cắt hình cầu); thêm ý tỉ lệ thời gian và khoảng cách nhiều vật |
| C4.3.2 | lý thuyết dạng (CY) | phạm vi | bỏ bẫy nhắc mặt cầu; thay bằng bẫy "khoảng cách gấp 3, không cộng thêm" |
| C4.3.2 | ví dụ 2 | phạm vi | thay bài flycam trong vùng kết nối bằng bài hai UAV: sau 15 phút $(-4;3;2)$, $(4;7;3)$; sau 45 phút cách nhau 27 km (đã kiểm) |

Kiểm khác đã đạt (không sửa): ví dụ 2 khó hơn ví dụ 1 ở cả 8 dạng; hai ví dụ khác hẳn nhau; không ca suy biến (VD tâm tỉ cự có $k\ne0$, VD tổng khoảng cách hai điểm không nằm trên mặt phẳng, hệ lực căng có định thức khác 0); số liệu đẹp; PP 3–5 bước; phạm vi Toán 12.

## Cần CEO xem
- T312000000296 (tổng tích vô hướng) và T312000000166 ($(MA/MD)^2$…): **xác nhận** giải bằng tâm tỉ cự (T296: $I=\frac{5A+3B+4C}{12}$, hình chiếu lên $(Oxz)$ ra $T=12$; T166: tâm tỉ cự $J(4;6;-4)$ có cùng hình chiếu với $D$ lên $(Oyz)$, ra $y=6$) ⇒ đề nghị gắn sang C3.5.1. Cùng loại đang nằm ở C3.5.2: T1120000003441, T1120000004026, T1120000004316, T112070307043.
- T112010102173 (khảo sát hàm số $y=x^3-3x^2$) và T312000000630 (hải đăng phủ sáng 4 km — vùng phủ hình cầu, thuộc PP toạ độ) gắn nhầm vào C4.3.2.
- C3.5.2: mô tả có "|MA−MB| lớn nhất" nhưng kho đề 0 câu ⇒ đã xoá khỏi lý thuyết; đề nghị bỏ khỏi mô tả. Hai kiểu đề có mà lý thuyết chưa có: $M,N\in(Oxy)$ với $MN$ không đổi (T312000000069, T312000000090) và M thuộc trục (T312000000269) — có đưa vào không?
- C4.3.2: mô tả trong `VT.json` vẫn ghi "giải |IM(t)| = R, hoặc giải hệ khoảng cách (GPS)" — trái ranh giới Thùy chốt; đề nghị sửa mô tả thành "khoảng cách giữa các vật, radar thấy vật tại một vị trí".
- C3.5.1: phần lớn câu đề gắn dạng này cho M thuộc mặt phẳng (P) theo phương trình / mặt cầu / đường thẳng (thuộc PP toạ độ) ⇒ phần VT chỉ còn khoảng 1/3 số câu của dạng; có thể cần tách khi gắn lại.
- C4.2.1 mục moi (dây ngắn nhất dọc tường, bóng nảy, cung Trái Đất) và C4.2.2 mục moi (hình hộp nghiêng) chưa có trong lý thuyết — chốt có đưa không.
