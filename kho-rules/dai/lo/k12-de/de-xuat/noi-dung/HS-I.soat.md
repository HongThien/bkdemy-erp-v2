KẾT LUẬN: ĐẠT (sau khi sửa)

Trạm soát Opus · 03/11 · tệp `HS-I.txt` (bản gốc trạm soạn: `HS-I.goc.txt`)

- 2 nhóm (C4.1, C4.2) · 7 dạng (C4.1.1–C4.1.4, C4.2.1–C4.2.3) · 14 ví dụ (18 ý) tự giải lại bằng máy · 3 hình kiểm (vẽ lại từ công thức, đối chiếu điểm đọc từ hình) · 17 chỗ sửa.
- Máy kiểm khuôn `kiem-moi.mjs HS … C4.1,C4.2,C4.1.1,…,C4.2.3`: lỗi 0 · cảnh báo 0 (trước và sau sửa).
- Script kiểm độc lập: `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\soat\HS-I\thu.cjs` — 56 phép kiểm, 0 sai: quét lưới 2·10⁶ điểm cho mọi GTLN/GTNN, đạo hàm sai phân + quét dấu, giải lại hệ 4 ẩn bằng Gauss (khinh khí cầu), quét $m$ nguyên cho bài tham số, quét bất phương trình (lãi, tiền xăng), giới hạn bằng số. **Khối chóp từ tấm bìa dựng lại bằng toạ độ** (E, F trên đoạn nối tâm–trung điểm cạnh; kiểm $AE=BE$, $EF=x$, trung đoạn $=BM$ khớp chiều cao dựng từ cạnh bên): $V_{\max}=\frac{2048\sqrt{10}}{375}\approx17{,}27$ tại $x=\frac{16\sqrt2}{5}$; thu về cạnh 6 dm cho 7,29 ≈ 7,3 đúng đáp án đề thật. Hình xuất thử: `…\soat\HS-I\hinh.html`.
- Đối chiếu đề thật: `cau-dang.cjs HS <dạng>` (C4.1.1 68 câu · C4.1.2 15 · C4.1.3 27 · C4.1.4 29 · C4.2.1 133 · C4.2.2 58 · C4.2.3 16), đọc hết câu của C4.1.2, C4.1.3, C4.2.3 và ~40–60 câu của các dạng còn lại.
- Đối chiếu sách: trích Word gốc PNL `BAI 5. UDDH GIAI BAI THUC TE/Bài 05_Dạng 02. Một số bài toán tối ưu đơn giản_GV.docx` và `…Dạng 03. Bài toán thực tế tăng trường _GV.docx` → `S\sach\hsI\pnl-b5d2.md`, `pnl-b5d3.md`; hồ sơ `k12-hs/ho-so/hoso-pnl-3-5.md` (5.2.a), `hoso-nbv-1-2.md` (C29). Quy trình 3 bước PNL khớp ##PP nhóm C4.2; PNL có đúng bài chóp từ bìa vuông (II-2/III-6) và bài $\frac{ax+b}{-x+d}$ ô nhiễm. Công thức sách là ảnh WMF ⇒ chỉ đối chiếu được kiểu bài/cách đặt ẩn. Từ Tâm chương 1 không có bài riêng cho toán thực tế; NBV để trong `17 CĐ TOÁN THỰC TẾ 12 2026.rar` (không giải nén). Ghi chú trạm soạn "đã đọc bản chữ PNL Bài 5 phần tối ưu" không đúng: `S\txt\pnl\BAI 5` chỉ có Dạng 01.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C4.1 | lý thuyết nhóm ##PP | lặp nhóm–dạng | ##PP nhóm trùng gần nguyên ##PP C4.1.1 (tính $f'$, so đầu mút) ⇒ viết lại thành bước chung cho cả 4 dạng: đổi câu hỏi thành việc toán (GTLN·xét dấu·bất phương trình·giới hạn), giữ kết quả thuộc miền, kết luận ngữ cảnh. |
| C4.1 | lý thuyết nhóm ##CY | lặp nhóm–dạng | Bỏ ý "cực đại chưa chắc GTLN" (gộp vào ##CY C4.1.1); mở rộng ý loại nghiệm ngoài miền cho cả bất phương trình. |
| C4.1.1 | lý thuyết dạng | lặp nhóm / bám đề | Bỏ ý "miền đóng/miền mở" (đã ở nhóm), gộp vào bước ##PP; thêm hàm phân thức $\frac{3t}{27+t^3}$ (đề có 3+ câu phân thức); bỏ bước làm tròn trùng nhóm; gộp hai ##CY đầu mút. |
| C4.1.2 | lý thuyết dạng | bám đề (thiếu) | Thêm ý tham số $m$: "tăng/giảm liên tục trên $K$" ⇔ $K$ trong miền xác định + $f'\ge0$ ($\le0$) trên $K$; ##PP thêm bất phương trình; ##CY thay ý "đọc điểm từ hình" (chung chung) bằng bẫy quên miền xác định. |
| C4.1.2 | ví dụ 2 | bám đề (thiếu) | Thêm ý b) $C(x)=\frac{x^2-mx+25}{x-m}$, $x>m$: $m$ nguyên dương để chi phí trung bình giảm trên $(10;12)$ ⇒ $m\in\{7;8;9;10\}$, tổng 34 (kiểu câu đề T112020402095). Hình chuyển lên ngay sau ý a). |
| C4.1.2 | ví dụ 2 a | trình bày | Thêm đơn vị và kết luận chung hai ý. |
| C4.1.3 | lý thuyết dạng | lặp nhóm / bám đề | Bỏ lặp "$f'>0$ tăng, $f'<0$ giảm" (đã ở nhóm); nói rõ "khoảng dài nhất" (tránh đề không xác định — bài học HS-A) và kiểu "bắt đầu tăng từ lúc nào"; thêm ngưỡng phân thức $\frac kv+av$ đưa về tam thức (đề: tiền xăng $\frac{16000}{v}+\frac52v\le500$). |
| C4.1.3 | ví dụ 2 | lạc dạng | Ý c) "lợi nhuận lớn nhất" là C4.1.1 ⇒ bỏ; thay bằng ý ngưỡng phân thức $C(v)=\frac{18000}{v}+2v\le420$, $0<v\le120$ ⇒ $60\le v\le150$ giao miền ⇒ thấp nhất 60 km/h (có bước đối chiếu miền: nghiệm 150 vượt 120). |
| C4.1.3 | ví dụ 2 a | trình bày | Câu hỏi "phải sản xuất bao nhiêu" (đáp số là khoảng) ⇒ "ít nhất bao nhiêu" như đề; kết luận nêu cả khoảng $[35;45]$. |
| C4.2.1 | lý thuyết dạng | lặp nhóm–dạng | Công thức $V$, $S_{tp}$ hình trụ đã ở nhóm ⇒ chỉ giữ ý xô/bể không nắp một đáy. |
| C4.2.1 | ví dụ 2 | toán (hình) | Đề không gán tam giác cắt bỏ với đỉnh nào, lời giải viết "$M$ trung điểm $EF$, $O,M,C$ thẳng hàng" — sai khi $E$ ứng với cạnh $AB$ (đúng là $O,M,B$). Viết lại đề: $EFGH$ cùng tâm $O$, $E,F,G,H$ trên đoạn nối $O$ với trung điểm $AB,BC,CD,DA$, cắt bỏ $AEB,BFC,CGD,DHA$, gập $AEH,BFE,CGF,DHG$ ⇒ hiểu được không cần hình; lời giải sửa thành $BM$, nêu lí do $BM\perp EF$ và $OM=\frac x2$. Đáp số giữ (đã dựng lại bằng toạ độ). |
| C4.2.2 | lý thuyết dạng | lặp nhóm / bám đề | Bỏ "chu vi $2(a+b)$, diện tích $ab$" (đã ở nhóm); thêm hàng rào chữ E với hai đơn giá (đề có ≥4 câu). |
| C4.2.2 | lý thuyết dạng ##CY | toán | "Giá trị lớn nhất nằm ở đầu mút" sai trên khoảng mở $(0;L)$ (không đạt) và đề không hỏi ⇒ thay bằng bẫy trả lời nhầm đoạn dây (đề hỏi đoạn vuông, đoạn tròn, cạnh, tỉ số $a/r$). |
| C4.2.3 | lý thuyết dạng | bám đề (thừa/thiếu) | Bỏ ý tam giác $MHA$ (không câu đề nào hỏi); thêm hình chữ nhật có đáy trên thanh ngang $y=k$ (đề: cửa sổ bảo tàng, xe kéo cao 1 m) và đoạn thẳng đứng $MN=|g(x)-f(x)|$ (đề: cầu qua hẻm núi, dây đèn công viên). |
| C4.2.3 | lý thuyết dạng ##CY | bám đề | Thêm bẫy "$MN$ dài nhất không ở điểm thấp nhất của đường cong"; ý đơn vị đổi thành đổi đơn vị $10$ m/$100$ m về thực tế. |
| C4.2.3 | ví dụ 1 + hình | chép đề | $y=9-x^2$, đáp số $12\sqrt3\approx20{,}8$ trùng nguyên câu đề C4.2.3/C4.2.2 ("đồ thị $y=9-x^2$ trên $(-3;3)$… 20,8") ⇒ cổng cao 6 m rộng 6 m, $y=6-\frac23x^2$, $S_{\max}=8\sqrt3\approx13{,}86$ m² tại khung rộng $2\sqrt3$, cao 4; hình vẽ lại. |
| C4.2.3 | ví dụ 2 + hình | lạc kiểu đề / hình | Bài tam giác $MHA$ không có trong đề, hình cắt mất đỉnh đường cong ($f(4)=64>60$ ngoài khung $y$) ⇒ thay bằng bài cầu qua hẻm núi: lòng hẻm $f(x)=\frac14x^3-\frac32x^2+x$, mặt cầu $OD$ ($y=x$), cột $MN=\frac14x^2(6-x)$ lớn nhất 8 đơn vị = 80 m tại $x=4$ (40 m); điểm sâu nhất lòng hẻm ở $x\approx3{,}63$ khác chỗ cột dài nhất. Hình vẽ cả đường cong và $OD$. |

Không sửa (đã kiểm đúng): C4.1.1 hai ví dụ; C4.1.2 ví dụ 1; C4.1.3 ví dụ 1; C4.1.4 lý thuyết + hai ví dụ (giới hạn, $C(t)=40-\frac{1500}{t+50}$, $t=100$); C4.2 lý thuyết nhóm; C4.2.1 ví dụ 1 (bể 2×4×2, 14,4 triệu); C4.2.2 hai ví dụ (trang 15×25, 240 cm²; dây $x=\frac{324}{4\sqrt3+9}\approx20{,}34$, $S\approx35{,}23$).

## Cần CEO xem

- C4.1.2: câu đề gốc tham số $m$ ($\frac{x^2-mx+9}{9x-9m}$, $x\in(50;53)$, đáp số tích $=2650$ tức $m\in\{50;53\}$) bỏ qua miền thực tế — với $m=53$ chi phí âm và $\to-\infty$ khi $x\to53^-$. Ví dụ mới đặt $x>m$ để tránh; CEO xem có cần báo sai câu đề này.
- C4.1.3: đề có câu hàm mũ (bất phương trình mũ, cần lôgarit lớp 11), hàm căn, thuế suất chia khúc — chưa có ví dụ; CEO quyết có thêm.
- C4.2.2: kiểu "đường thẳng qua điểm cố định cắt hai bờ, diện tích tam giác nhỏ nhất" (≥2 câu đề) và ẩn là góc (máng nước gập góc $\theta$, nửa đường tròn theo $\alpha$, ≥5 câu) chỉ có ở lý thuyết, chưa có ví dụ — dạng có nhiều kiểu con, 2 ví dụ không phủ hết.
- C4.2.3: câu "khoảng cách từ điểm trên bờ hồ đến con đường" cần công thức khoảng cách điểm–đường thẳng (lớp 10), chưa đưa vào lý thuyết; câu chi phí theo diện tích phần parabol cần tích phân (ngoài chương).
