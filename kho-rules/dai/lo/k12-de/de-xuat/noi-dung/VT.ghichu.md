# GHI CHÚ CHO CEO — VT (gộp từ các lượt soạn)

### VT-A.txt
- Lượt VT-A (chuyên đề C1, 3 nhóm, 9 dạng). Mọi ví dụ đã thử lại bằng số (script `S\soan\VT\thu-A.mjs`, toạ độ cụ thể cho hộp xiên, tứ diện đều, chóp, lăng trụ đều): đẳng thức vectơ, độ dài, tích vô hướng, góc, đếm vectơ ở C1.1.1 đều khớp.
- Hình khối không vẽ được: mọi đề mô tả bằng lời (tên đỉnh, cạnh, góc); ở C1.1.1 ví dụ 2 ghi rõ quy ước $ABCD.EFGH$ (đáy dưới $ABCD$, cạnh bên $AE,BF,CG,DH$) vì đề thi cũng dùng cách đặt tên này.
- Dạng C1.1.1: đề thi có câu "vectơ pháp tuyến của mặt phẳng $(ABCD)$" (lập phương) — không đưa vào vì thuộc chương PP toạ độ (trạm soát xác nhận theo ranh giới Thùy chốt).
- Câu "cho $|\vec a|,|\vec b|,|\vec a+\vec b|$ tính $|\vec a-\vec b|$": trạm soát đã CHUYỂN sang C1.3.1 (cần tích vô hướng; bảng ánh xạ đề thi cũng xếp chính câu $26,28,48$ vào cả C1.1.2 lẫn C1.3.1). C1.1.2 giờ chỉ gồm rút gọn trên hình rồi đo độ dài.
- C1.1.2 (độ dài tổng, hiệu) dùng quy tắc ba điểm / hình bình hành / hình hộp, vốn dạy ở nhóm C1.2 đứng sau; lý thuyết dạng nhắc lại các quy tắc này để dạng tự đứng được.
- C1.2.4: "đồng phẳng" không có trong lý thuyết SGK 2018 (NBV A. LÝ THUYẾT không có), nhưng đề thi và PNL có hỏi nên giữ như cây đã duyệt.
- Dạng C1.2.4 ví dụ 2b (đồng phẳng) và C1.2.3 ví dụ 2c dùng "ba vectơ không đồng phẳng ⇒ hệ số bằng 0"; ý này được nhắc ở lý thuyết cả hai dạng (C1.2.3 trong TC cuối, C1.2.4 ở TC thứ ba).
- Dạng C1.3.1: đề thi có câu công của lực / cầu trượt (A = F·d); đã đưa vào lý thuyết và 2 ví dụ.
- Trạm soát (Opus, 03/11): 14 chỗ sửa, tự giải lại 18 ví dụ bằng toạ độ (`S\soat\VT-A\thu.cjs`, 59 phép kiểm khớp). Biên bản `VT-A.soat.md`.
- Sách: sách tham khảo không thể dùng làm nguồn chữ gọn vì hầu hết công thức ở dạng ảnh; chỉ lấy cấu trúc dạng và ý ví dụ. Không phát hiện lỗi cần ghi.
- Đã đọc: Từ Tâm `C2-B1-VECTƠ và CÁC PHÉP TOÁN TRONG KHÔNG GIAN` (P1 lý thuyết, P2 bài tập); PNL `CHUONG 2. VECTO TRONG KG/BAI 1` (Dạng 01, Dạng 02, Đề 01, bản GV); NBV `12-8. VECTO TRONG KHONG GIAN` (A. LY THUYET, B. TU LUAN) và `12-9. CAC PHEP TOAN VECTO` (A. LY THUYET, B. TU LUAN; phần tích vô hướng); câu đề thi từng dạng bằng `cau-dang.cjs VT <id> 8`.


### VT-B.txt
- Sách đã đối chiếu (trạm soạn + trạm soát): Từ Tâm C2-B2-P1, C2-B3-P1 (công thức nằm trong ảnh WMF, chỉ đọc được cấu trúc dạng và lời đề; công thức đối chiếu theo SGK); NBV 12-9 (A. Lý thuyết, B. Tự luận); PNL Chương 2 Bài 2 Dạng 1–2 và Bài 3 Dạng 1 (bản chữ đã trích sẵn ở `S\sach\vt\pnl-b2d1.md`, `pnl-b2d2.md`, `pnl-b3d1.md`; công thức cũng nằm trong ảnh WMF).
- C2.1.2: đề thi hay hỏi "trung điểm của đoạn nối M với hình chiếu" nên TC có nhắc công thức trung điểm dù bài trung điểm đầy đủ thuộc nhóm C3.2.
- C2.2.1 và C2.2.2: đề thi thường kèm hình vẽ hệ trục; ở đây thay bằng câu chữ nêu rõ gốc và các tia $Ox,Oy,Oz$ (máy vẽ không có hình khối), ví dụ làm được không cần hình.
- C2.2.2: đã thêm kiểu bài máy bay (cho $OM$ và hai góc) vào TC và ví dụ 1 ý b), vì mô tả dạng nói "có góc cho trước… tính bằng lượng giác" và đề thật có 3/21 câu kiểu này (PNL Bài 2 Dạng 2 cũng có). Ví dụ dùng góc đặc biệt cho số đẹp; đề thật dùng góc lẻ và làm tròn. Câu cột điện (góc nhị diện, hỏi côsin góc giữa hai vectơ) và lồng đèn (thể tích) trong danh sách đề của dạng thực chất là bài tích vô hướng / thể tích, chỉ khâu đặt toạ độ thuộc dạng này.
- C2.2.2 ví dụ 2 viết $S_0$ thay cho $S$ (đề thật dùng $S$) để khỏi trùng tên đỉnh $S$. Lưu ý: $S_0=AS^2$ nên đáp số đã có sẵn từ giả thiết (đề thật cũng vậy); lời giải có dòng đối chiếu.
- Mô tả C3.1.1 có ý "tìm vectơ x thoả đẳng thức": giải theo nghĩa $\vec x$ là vectơ ẩn. Thêm kiểu "phân tích $\vec d=x\vec a+y\vec b+z\vec c$" (3 câu trả lời ngắn trong đề của dạng) vào TC và ví dụ 2 ý b).


### VT-C.txt
- Sách đã đối chiếu (trạm soạn + trạm soát): PNL chương 2 (bài 2 dạng 1, dạng 2; bài 3 dạng 1, dạng 2, bản GV), Từ Tâm chương 2 (bài 1 P1, P2; bài 3 P1, P2), NBV 12-9 "Toạ độ của vectơ" (A. Lý thuyết, B. Tự luận, C. Trắc nghiệm, E. Trả lời ngắn — bản trích ở thư mục tạm `sach\vt-nbv`).Công thức trong cả ba bộ là ảnh WMF nên chỉ đối chiếu được khung bài, cách phân dạng và ý ví dụ; công thức viết theo kiến thức chuẩn.
- C3.4.3: NBV 12-9 (bám SGK Cánh Diều) có mục "Cách tìm toạ độ của một vectơ vuông góc với hai vectơ cho trước" và gọi vectơ đó là tích có hướng; PNL bài 3 cũng có "Biểu thức toạ độ tích có hướng". Vậy tích có hướng CÓ trong SGK (ít nhất một bộ), chỉ các công thức diện tích, thể tích, đồng phẳng bằng tích có hướng là ngoài SGK — đề thi và cả ba sách đều dùng nên giữ. Câu T112020302060 ("Đồ thị ở hình sau là đồ thị của hàm số nào") là câu Hàm số gắn nhầm vào dạng này.
- C3.4.3: lý thuyết có "vectơ pháp tuyến của (ABC)" vì đề thi xếp vào dạng này 2 câu hỏi đúng tên gọi đó; không dùng phương trình mặt phẳng.
- C3.3.2: đề thi thật có 7 câu, 3 câu là bài thực tế (camera sân bóng, drone); ví dụ dùng bài thuần toạ độ, phần b) ví dụ 2 mô phỏng kiểu "cách không quá R, đếm tham số nguyên" của câu drone.
- C3.4.2: đề thi có 2 câu khó (điểm M với ba góc vuông; trực tâm khi C chạy trên trục); lý thuyết nêu cách đặt điều kiện, không có ví dụ riêng.
- C3.2.3: "điểm thuộc đường thẳng AB cắt trục/mặt phẳng toạ độ" chỉ dùng dạng $A+t\overrightarrow{AB}$ của vectơ, không dùng phương trình đường thẳng.


### VT-D.txt
- Sách đã đọc/trích (vào `S\sach\vt\`): Từ Tâm C2-B1-P1, C2-B1-P2, C2-B3-P1 (có "Dạng 6. Tâm tỷ cự": VD6.1 điểm trên mặt phẳng, VD6.2 điểm trên trục), C2-B3-P2; PNL Chương 2: Bài 1 Dạng 02 (hợp lực), Bài 2 Dạng 01, Dạng 02 (toạ độ hoá, máy bay/radar), Bài 3 Dạng 01, Dạng 02 (có bài radar giàn khoan, bài hai UAV) và Đề 03 GV (cực trị M thuộc mặt phẳng). Trạm soát đối chiếu thêm NBV 12-9 (bản trạm soạn VT-B/VT-C đã trích ở `S\sach\vt-nbv\`: A. Lý thuyết, B. Tự luận Dạng 3 Ứng dụng, C. Trắc nghiệm, E. Trả lời ngắn) — khớp cách giải của các dạng này (tâm tỉ cự với M thuộc (Oxy), tổng khoảng cách hai flycam bằng đối xứng, chóp đều đèn chùm, ba dây cáp đều, radar). Công thức trong Word là ảnh WMF nên chỉ đối chiếu lời văn/cách giải; mọi ví dụ đã tự giải lại bằng số (trạm soạn `S\soan\VT\thu.mjs`; trạm soát `S\soat\VT-D\kiem.mjs`, 34/34 OK).
- C3.5.1: nhiều câu đề thật gắn dạng này cho M thuộc mặt phẳng $(P)$ cho bằng phương trình, mặt cầu, đường thẳng (T312000000560, 819, 148, 7080, T312010403001…) — thuộc chương Phương pháp toạ độ nên không đưa; lý thuyết chỉ cho M thuộc mặt phẳng/trục toạ độ hoặc cạnh hình khối gắn hệ trục.
- Câu T312000000296 (tổng tích vô hướng) và T312000000166 ($(MA/MD)^2$…) đang xếp ở C3.5.2 nhưng giải bằng tâm tỉ cự (đã kiểm bằng số: T296 dùng $I$ với hệ số $5,3,4$ ra $T=12$; T166 dùng tâm tỉ cự trùng hình chiếu của $D$, ra $y=6$) — đề nghị gắn sang C3.5.1. Cũng vậy với T1120000003441, T1120000004026, T1120000004316, T112070307043 (tổng bình phương, đang ở C3.5.2). Lý thuyết C3.5.1 đã thêm ý tổng tích vô hướng.
- C3.5.2: mô tả có "|MA−MB| lớn nhất" nhưng toàn bộ kho đề không có câu nào hỏi hiệu ⇒ trạm soát đã xoá ý này khỏi lý thuyết (luật "không đề nào hỏi thì không đưa"); đề nghị bỏ khỏi mô tả. Đề có 2 kiểu chưa vào lý thuyết: hai điểm $M$, $N$ trên $(Oxy)$ với $MN$ không đổi (T312000000069, T312000000090; NBV có 1 câu) và $M$ thuộc trục toạ độ (T312000000269) — CEO chốt có đưa không.
- C4.1.2: ví dụ 1 (giá đỡ ba chân) bám T312000000255/T1120000004160 nhưng số liệu khác; công của lực chỉ có trong ##TC (đề ~1 câu). Theo mô tả, các câu dây treo chóp đều/đèn tròn ba dây hiện vẫn nằm ở C4.1.1 (P1.5.1) chờ gắn lại.
- C4.2.1: các mục "moi" (dây điện ngắn nhất dọc tường, bóng nảy parabol, độ dài cung trên Trái Đất) chưa có ví dụ; bài Trái Đất (T312000000072) cho mặt cầu bằng phương trình — nếu đưa vào thì chỉ nên lấy phần góc giữa hai vectơ. C4.2.2: mục "moi" hình hộp nghiêng (bể nước T312000000213) chưa có trong lý thuyết.
- C4.3.1: đề thật có câu viên đạn cho bằng phương trình tham số đường thẳng (T312000000676) — thuộc PP toạ độ theo ranh giới; ví dụ chỉ dùng $A+t\overrightarrow{v}$.
- C4.3.2: trạm soát đã thay ví dụ 2 cũ (flycam trong vùng kết nối, giải $OM(t)^2\le R^2$ — thực chất là đường bay cắt hình cầu tâm cố định) bằng ví dụ khoảng cách hai UAV sau 45 phút (27 km), và bỏ ý "vào–ra vùng phủ theo $t$" khỏi lý thuyết. Mô tả dạng trong `VT.json` vẫn ghi "giải |IM(t)| = R, hoặc giải hệ khoảng cách (GPS)" — trái ranh giới Thùy chốt, đề nghị sửa mô tả.
- Gắn nhầm chương: T112010102173 (khảo sát hàm số $y=x^3-3x^2$) và T312000000630 (hải đăng phủ sáng bán kính 4 km, người đi trên đoạn ID — vùng phủ hình cầu, thuộc PP toạ độ) đang xếp ở C4.3.2.

