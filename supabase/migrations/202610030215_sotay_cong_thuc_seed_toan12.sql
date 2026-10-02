-- ============================================================================
-- Nạp đợt 1 SỔ TAY CÔNG THỨC — Toán 12 (sinh bằng scripts/sotay-cong-thuc/sinh-seed.mjs, đừng sửa tay)
-- 6 chủ đề · 19 hình (chưa có ảnh) · 77 thẻ, tất cả 'cho_duyet'.
-- MẤT GÌ: không. Chỉ INSERT, on conflict do nothing.
-- ============================================================================

insert into public.sotay_ct_chu_de (mon, khoi, ma, ten, thu_tu) values
  ('Toán', '12', 'HS', 'Ứng dụng đạo hàm — khảo sát hàm số', 1),
  ('Toán', '12', 'VT', 'Vectơ và hệ trục tọa độ trong không gian', 2),
  ('Toán', '12', 'TK', 'Thống kê — mẫu số liệu ghép nhóm', 3),
  ('Toán', '12', 'NH', 'Nguyên hàm — Tích phân', 4),
  ('Toán', '12', 'OX', 'Phương pháp tọa độ trong không gian (Oxyz)', 5),
  ('Toán', '12', 'XS', 'Xác suất có điều kiện', 6)
on conflict do nothing;

insert into public.sotay_ct_hinh (mon, khoi, ma, ten, mo_ta) values
  ('Toán', '12', 'H01', 'Các dạng đồ thị hàm bậc ba', 'Bảng 2 cột (a > 0 | a < 0) × 3 hàng (y''=0 có 2 nghiệm phân biệt | nghiệm kép | vô nghiệm) = 6 đồ thị. Có trục Ox, Oy, gốc O. Hàng 1 đánh dấu 2 điểm cực trị.'),
  ('Toán', '12', 'H02', 'Các dạng đồ thị hàm y = (ax+b)/(cx+d)', '2 đồ thị cạnh nhau: y'' > 0 (hai nhánh đi lên) và y'' < 0 (hai nhánh đi xuống). Vẽ rõ 2 tiệm cận bằng nét đứt, ghi nhãn x = −d/c và y = a/c, đánh dấu giao điểm I.'),
  ('Toán', '12', 'H03', 'Các dạng đồ thị hàm y = (ax²+bx+c)/(mx+n)', '2–4 đồ thị: có 2 cực trị / không có cực trị, mỗi trường hợp a·m > 0 và a·m < 0. Vẽ tiệm cận đứng và tiệm cận XIÊN (nét đứt), ghi nhãn, đánh dấu tâm đối xứng I.'),
  ('Toán', '12', 'H04', 'Minh hoạ 3 loại tiệm cận', '3 hình nhỏ: (1) tiệm cận ngang y = y₀, đồ thị tiến sát khi x → ±∞; (2) tiệm cận đứng x = x₀, đồ thị đi lên/xuống vô hạn khi x → x₀; (3) tiệm cận xiên y = ax + b. Đường tiệm cận nét đứt.'),
  ('Toán', '12', 'H05', 'Diện tích hình phẳng giữa đồ thị và trục hoành', 'Đồ thị y = f(x) cắt Ox, có phần trên và phần dưới trục hoành; tô màu vùng giữa đồ thị và Ox từ x = a đến x = b; ghi nhãn a, b. Thể hiện vì sao cần |f(x)|.'),
  ('Toán', '12', 'H06', 'Diện tích hình phẳng giữa hai đồ thị', 'Hai đường cong y = f(x), y = g(x) cắt nhau; tô vùng giữa hai đường từ x = a đến x = b; ghi nhãn f, g, a, b.'),
  ('Toán', '12', 'H07', 'Thể tích vật thể — thiết diện S(x)', 'Vật thể nằm giữa 2 mặt phẳng x = a và x = b (vuông góc Ox); một mặt cắt vuông góc Ox tại x, tô màu thiết diện, ghi S(x).'),
  ('Toán', '12', 'H08', 'Khối tròn xoay quanh trục Ox', 'Hình phẳng dưới y = f(x) từ a đến b, mũi tên quay quanh Ox, tạo thành khối tròn xoay (vẽ phối cảnh có elip tại x = a, x = b).'),
  ('Toán', '12', 'H09', 'Hệ trục tọa độ Oxyz', '3 trục Ox, Oy, Oz vuông góc từng đôi, gốc O; 3 vectơ đơn vị i, j, k; một điểm M(x; y; z) kèm hình hộp chữ nhật nét đứt chiếu xuống 3 trục.'),
  ('Toán', '12', 'H10', 'Quy tắc hình hộp', 'Hình hộp ABCD.A''B''C''D'', vẽ 3 vectơ AB, AD, AA'' xuất phát từ A và vectơ đường chéo AC'' (màu khác).'),
  ('Toán', '12', 'H11', 'Quy tắc 23 – 31 – 12 (tích có hướng)', 'Sơ đồ nhớ: tam giác 3 đỉnh ghi 1, 2, 3 có mũi tên vòng 2→3→1→2, kèm bảng định thức con cho 3 tọa độ.'),
  ('Toán', '12', 'H12', 'Mặt phẳng — VTPT và cặp VTCP', 'Mặt phẳng (α) dạng hình bình hành, điểm M₀ trên mặt, VTPT n vuông góc mặt phẳng; 2 vectơ a, b nằm trong mặt phẳng (cặp VTCP), ghi n = [a, b].'),
  ('Toán', '12', 'H13', 'Góc giữa đường thẳng và mặt phẳng', 'Đường thẳng d cắt mặt phẳng (P) tại O, hình chiếu d'' của d trên (P), góc φ giữa d và d''; vẽ thêm VTCP u của d và VTPT n của (P) để thấy vì sao dùng sin.'),
  ('Toán', '12', 'H14', 'Góc giữa hai mặt phẳng', 'Hai mặt phẳng (P), (Q) cắt nhau theo giao tuyến; hai VTPT n_P, n_Q; ghi góc giữa hai mặt phẳng.'),
  ('Toán', '12', 'H15', 'Khoảng cách từ điểm đến mặt phẳng', 'Điểm M₀ ở trên mặt phẳng (P), đoạn vuông góc M₀H xuống (P), ký hiệu góc vuông tại H, ghi d(M₀, (P)) = M₀H.'),
  ('Toán', '12', 'H16', 'Hình chiếu của điểm lên mặt phẳng — điểm đối xứng', 'Mặt phẳng (P), điểm M phía trên, H là hình chiếu trên (P), M'' đối xứng phía dưới; đường thẳng MM'' vuông góc (P); đánh dấu MH = HM''.'),
  ('Toán', '12', 'H17', 'Mặt cầu tâm I bán kính R', 'Mặt cầu có đường xích đạo nét đứt, tâm I, một điểm M trên mặt cầu, bán kính R = IM.'),
  ('Toán', '12', 'H18', 'Vị trí tương đối mặt phẳng và mặt cầu', '3 hình: d > R (mặt cầu không chạm mặt phẳng), d = R (tiếp xúc tại H), d < R (cắt theo đường tròn tâm H bán kính r; vẽ tam giác vuông I-H-M với IH = d, IM = R, HM = r).'),
  ('Toán', '12', 'H19', 'Sơ đồ cây — xác suất toàn phần và Bayes', 'Sơ đồ cây 2 tầng: gốc → B (ghi P(B)) và B̄ (ghi P(B̄)); mỗi nhánh tách tiếp → A (ghi P(A|B), P(A|B̄)) và Ā. Tô nổi 2 đường đi tới A để thấy công thức toàn phần; đường qua B để thấy Bayes.')
on conflict do nothing;

insert into public.sotay_cong_thuc (ma, mon, khoi, chu_de, thu_tu, ten, ten_khac, noi_dung, luu_y, cau_nho, hinh, nguon, ct2018, ghi_chu_kiem) values
  ('CT12-HS-01', 'Toán', '12', 'HS', 1, 'Tính đơn điệu của hàm số (dấu đạo hàm)', array['đồng biến', 'nghịch biến', 'đơn điệu', 'hàm số tăng giảm', 'xét chiều biến thiên']::text[],
   'Cho hàm số $y=f(x)$ có đạo hàm trên khoảng $K$:
$f''(x)>0,\ \forall x\in K \Rightarrow f$ đồng biến trên $K$
$f''(x)<0,\ \forall x\in K \Rightarrow f$ nghịch biến trên $K$',
   'Nếu $f''(x)\ge 0$ (hoặc $\le 0$) và $f''(x)=0$ chỉ tại hữu hạn điểm thì vẫn đồng biến (nghịch biến) trên $K$.', null, null, array['TD:12', 'BK']::text[], 'co', null),
  ('CT12-HS-02', 'Toán', '12', 'HS', 2, 'Điều kiện hàm bậc ba đơn điệu trên ℝ', array['hàm bậc ba đồng biến trên R', 'hàm bậc 3 nghịch biến trên R', 'tìm m để hàm số đồng biến', 'đơn điệu bậc ba']::text[],
   '$y=ax^3+bx^2+cx+d\ (a\ne 0)$, $y''=3ax^2+2bx+c$
Đồng biến trên $\mathbb{R}$ $\Leftrightarrow \begin{cases} a>0 \\ b^2-3ac\le 0 \end{cases}$
Nghịch biến trên $\mathbb{R}$ $\Leftrightarrow \begin{cases} a<0 \\ b^2-3ac\le 0 \end{cases}$',
   '$b^2-3ac$ chính là $\Delta''$ của $y''$. Nếu hệ số $a$ chứa tham số, xét riêng trường hợp $a=0$.', null, null, array['TD:12']::text[], 'co', null),
  ('CT12-HS-03', 'Toán', '12', 'HS', 3, 'Đơn điệu của hàm phân thức y = (ax+b)/(cx+d)', array['hàm nhất biến', 'hàm phân thức bậc nhất', 'đạo hàm hàm nhất biến', 'ad-bc']::text[],
   '$y=\dfrac{ax+b}{cx+d}$, $D=\mathbb{R}\setminus\left\{-\dfrac{d}{c}\right\}$, $y''=\dfrac{ad-bc}{(cx+d)^2}$
Đồng biến trên từng khoảng xác định $\Leftrightarrow ad-bc>0$
Nghịch biến trên từng khoảng xác định $\Leftrightarrow ad-bc<0$',
   'Không có dấu "=": $ad-bc=0$ thì hàm là hằng.', null, null, array['TD:10', 'TD:12']::text[], 'co', null),
  ('CT12-HS-04', 'Toán', '12', 'HS', 4, 'Cực trị — dùng đạo hàm cấp hai', array['cực đại', 'cực tiểu', 'điểm cực trị', 'đạo hàm cấp 2 cực trị', 'f''''']::text[],
   '$\begin{cases} f''(x_0)=0 \\ f''''(x_0)<0 \end{cases} \Rightarrow x_0$ là điểm cực đại
$\begin{cases} f''(x_0)=0 \\ f''''(x_0)>0 \end{cases} \Rightarrow x_0$ là điểm cực tiểu',
   'Đây chỉ là điều kiện ĐỦ. Nếu $f''''(x_0)=0$ thì chưa kết luận được — lập bảng biến thiên (vd $y=x^4$ có cực tiểu tại $0$ dù $y''''(0)=0$).', null, null, array['TD:12']::text[], 'co', 'Nguồn TD tr.12 ghi "đạt cực trị tại $x_0$ ⇔ $y''(x_0)=0,\ y''''(x_0)\ne 0$" — dấu ⇔ là SAI (phản ví dụ $y=x^4$). Đã sửa thành ⇒.'),
  ('CT12-HS-05', 'Toán', '12', 'HS', 5, 'Cực trị của hàm bậc ba', array['hàm bậc 3 có 2 cực trị', 'hàm bậc ba không có cực trị', 'tìm m để hàm số có cực trị']::text[],
   '$y=ax^3+bx^2+cx+d\ (a\ne 0)$, $y''=3ax^2+2bx+c$
Có 2 cực trị $\Leftrightarrow y''=0$ có 2 nghiệm phân biệt $\Leftrightarrow b^2-3ac>0$
Không có cực trị $\Leftrightarrow b^2-3ac\le 0$',
   null, null, null, array['TD:12']::text[], 'co', null),
  ('CT12-HS-06', 'Toán', '12', 'HS', 6, 'Cực trị của hàm trùng phương', array['hàm bậc bốn trùng phương', 'trùng phương 3 cực trị', 'trùng phương 1 cực trị', 'ab<0']::text[],
   '$y=ax^4+bx^2+c\ (a\ne 0)$, $y''=4ax^3+2bx=2x(2ax^2+b)$
Có 3 cực trị $\Leftrightarrow ab<0$
Có đúng 1 cực trị $\Leftrightarrow ab\ge 0$',
   null, null, null, array['TD:13']::text[], 'nghi_van', 'CT 2018 chỉ khảo sát bậc ba, y=(ax+b)/(cx+d), y=(ax²+bx+c)/(mx+n) — trùng phương có thể đã ra khỏi CT. GV xác nhận giữ hay bỏ.'),
  ('CT12-HS-07', 'Toán', '12', 'HS', 7, 'Giá trị lớn nhất, nhỏ nhất trên đoạn [a; b]', array['GTLN', 'GTNN', 'max min', 'giá trị lớn nhất', 'giá trị nhỏ nhất', 'max min trên đoạn']::text[],
   '$f$ liên tục trên $[a;b]$:
① Tính $f''(x)$, tìm các nghiệm $x_i\in(a;b)$ của $f''(x)=0$ (và điểm $f''$ không xác định)
② Tính $f(a),\ f(b),\ f(x_i)$
③ Số lớn nhất là $\max\limits_{[a;b]} f$, số nhỏ nhất là $\min\limits_{[a;b]} f$',
   'Trên khoảng (không phải đoạn) thì phải lập bảng biến thiên rồi kết luận.', null, null, array['TD:13']::text[], 'co', null),
  ('CT12-HS-08', 'Toán', '12', 'HS', 8, 'Tiệm cận ngang', array['TCN', 'đường tiệm cận ngang']::text[],
   'Đường thẳng $y=y_0$ là tiệm cận ngang của đồ thị $y=f(x)$ nếu
$\lim\limits_{x\to+\infty} f(x)=y_0$ hoặc $\lim\limits_{x\to-\infty} f(x)=y_0$',
   null, null, 'H04', array['BK']::text[], 'co', null),
  ('CT12-HS-09', 'Toán', '12', 'HS', 9, 'Tiệm cận đứng', array['TCĐ', 'đường tiệm cận đứng']::text[],
   'Đường thẳng $x=x_0$ là tiệm cận đứng của đồ thị $y=f(x)$ nếu ít nhất một trong các điều kiện sau thỏa:
$\lim\limits_{x\to x_0^+} f(x)=\pm\infty$ hoặc $\lim\limits_{x\to x_0^-} f(x)=\pm\infty$',
   null, null, 'H04', array['BK']::text[], 'co', null),
  ('CT12-HS-10', 'Toán', '12', 'HS', 10, 'Tiệm cận xiên', array['TCX', 'đường tiệm cận xiên']::text[],
   'Đường thẳng $y=ax+b\ (a\ne 0)$ là tiệm cận xiên của đồ thị $y=f(x)$ nếu
$\lim\limits_{x\to+\infty}[f(x)-(ax+b)]=0$ hoặc $\lim\limits_{x\to-\infty}[f(x)-(ax+b)]=0$
Cách tìm: $a=\lim\limits_{x\to\pm\infty}\dfrac{f(x)}{x}$, $b=\lim\limits_{x\to\pm\infty}[f(x)-ax]$',
   null, null, 'H04', array['BK']::text[], 'co', null),
  ('CT12-HS-11', 'Toán', '12', 'HS', 11, 'Tiệm cận của hàm y = (ax+b)/(cx+d)', array['tiệm cận hàm nhất biến', 'tiệm cận hàm phân thức bậc nhất']::text[],
   '$y=\dfrac{ax+b}{cx+d}\ (c\ne 0,\ ad-bc\ne 0)$
Tiệm cận đứng: $x=-\dfrac{d}{c}$
Tiệm cận ngang: $y=\dfrac{a}{c}$',
   null, null, 'H02', array['BK']::text[], 'co', null),
  ('CT12-HS-12', 'Toán', '12', 'HS', 12, 'Tiệm cận của hàm y = (ax²+bx+c)/(mx+n)', array['tiệm cận hàm phân thức bậc hai trên bậc nhất', 'tiệm cận xiên phân thức']::text[],
   'Chia đa thức: $y=\dfrac{ax^2+bx+c}{mx+n}=px+q+\dfrac{r}{mx+n}\ (m\ne 0,\ r\ne 0)$
Tiệm cận đứng: $x=-\dfrac{n}{m}$
Tiệm cận xiên: $y=px+q$',
   null, null, 'H03', array['BK']::text[], 'co', null),
  ('CT12-HS-13', 'Toán', '12', 'HS', 13, 'Tâm đối xứng của đồ thị', array['tâm đối xứng', 'điểm uốn', 'giao hai tiệm cận']::text[],
   'Hàm bậc ba $y=ax^3+bx^2+cx+d$: tâm đối xứng $I$ có hoành độ $x_0=-\dfrac{b}{3a}$ (nghiệm của $y''''=0$)
Hàm $y=\dfrac{ax+b}{cx+d}$: tâm đối xứng $I\left(-\dfrac{d}{c};\ \dfrac{a}{c}\right)$ = giao của 2 tiệm cận
Hàm $y=\dfrac{ax^2+bx+c}{mx+n}$: tâm đối xứng = giao của tiệm cận đứng và tiệm cận xiên',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-HS-14', 'Toán', '12', 'HS', 14, 'Các dạng đồ thị hàm bậc ba', array['đồ thị bậc 3', 'hình dạng đồ thị hàm bậc ba', 'nhận dạng đồ thị']::text[],
   '$y=ax^3+bx^2+cx+d\ (a\ne 0)$ — hình dạng phụ thuộc dấu của $a$ và số nghiệm của $y''=0$:
$y''=0$ có 2 nghiệm phân biệt: đồ thị có 2 cực trị
$y''=0$ có nghiệm kép hoặc vô nghiệm: đồ thị không có cực trị
$a>0$: nhánh phải đi lên; $a<0$: nhánh phải đi xuống',
   null, null, 'H01', array['TD:11']::text[], 'co', null),
  ('CT12-HS-15', 'Toán', '12', 'HS', 15, 'Các dạng đồ thị hàm y = (ax+b)/(cx+d)', array['đồ thị hàm nhất biến', 'đồ thị hypebol', 'đồ thị phân thức']::text[],
   '$y''>0$ ($ad-bc>0$): hai nhánh đi lên
$y''<0$ ($ad-bc<0$): hai nhánh đi xuống
Hai nhánh đối xứng qua giao điểm của 2 tiệm cận',
   null, null, 'H02', array['TD:12']::text[], 'co', null),
  ('CT12-HS-16', 'Toán', '12', 'HS', 16, 'Các dạng đồ thị hàm y = (ax²+bx+c)/(mx+n)', array['đồ thị phân thức bậc hai trên bậc nhất', 'đồ thị có tiệm cận xiên']::text[],
   'Đồ thị có 1 tiệm cận đứng và 1 tiệm cận xiên, gồm 2 nhánh đối xứng qua giao điểm 2 tiệm cận.
$y''=0$ có 2 nghiệm phân biệt: đồ thị có 2 cực trị
$y''=0$ vô nghiệm: đồ thị không có cực trị',
   null, null, 'H03', array['BK']::text[], 'co', null),
  ('CT12-HS-17', 'Toán', '12', 'HS', 17, 'Số giao điểm của hai đồ thị', array['tương giao', 'phương trình hoành độ giao điểm', 'giao điểm hai đồ thị']::text[],
   '$(C_1): y=f(x)$ và $(C_2): y=g(x)$
Phương trình hoành độ giao điểm: $f(x)=g(x)\ (*)$
Số giao điểm của $(C_1)$ và $(C_2)$ = số nghiệm của $(*)$',
   'Trục hoành có phương trình $y=0$.', null, null, array['TD:13']::text[], 'co', null),
  ('CT12-HS-18', 'Toán', '12', 'HS', 18, 'Dùng đồ thị biện luận số nghiệm phương trình', array['biện luận số nghiệm', 'f(x)=m', 'số nghiệm theo m', 'tìm m để phương trình có nghiệm']::text[],
   'Đưa phương trình về dạng $f(x)=m$
Số nghiệm = số giao điểm của đồ thị $y=f(x)$ với đường thẳng nằm ngang $y=m$',
   null, null, null, array['TD:14']::text[], 'co', null),
  ('CT12-VT-01', 'Toán', '12', 'VT', 1, 'Quy tắc hình hộp', array['hình hộp', 'cộng vectơ trong không gian', 'quy tắc hình hộp vectơ']::text[],
   'Hình hộp $ABCD.A''B''C''D''$: $\overrightarrow{AC''}=\overrightarrow{AB}+\overrightarrow{AD}+\overrightarrow{AA''}$',
   null, null, 'H10', array['BK']::text[], 'co', null),
  ('CT12-VT-02', 'Toán', '12', 'VT', 2, 'Tích vô hướng của hai vectơ (định nghĩa)', array['tích vô hướng', 'a.b', 'góc giữa hai vectơ']::text[],
   '$\vec a\cdot\vec b=|\vec a|\cdot|\vec b|\cdot\cos(\vec a,\vec b)$
$\vec a\perp\vec b\Leftrightarrow\vec a\cdot\vec b=0$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-VT-03', 'Toán', '12', 'VT', 3, 'Hệ trục tọa độ Oxyz — tọa độ điểm, tọa độ vectơ', array['hệ tọa độ Oxyz', 'tọa độ điểm', 'tọa độ vectơ', 'vectơ đơn vị i j k', 'hoành độ tung độ cao độ']::text[],
   '$\vec u=(x;y;z)\Leftrightarrow\vec u=x\vec i+y\vec j+z\vec k$
$M(x;y;z)\Leftrightarrow\overrightarrow{OM}=(x;y;z)$ ($x$: hoành độ, $y$: tung độ, $z$: cao độ)
$\vec i=(1;0;0),\ \vec j=(0;1;0),\ \vec k=(0;0;1),\ \vec 0=(0;0;0)$',
   null, null, 'H09', array['TD:35']::text[], 'co', null),
  ('CT12-VT-04', 'Toán', '12', 'VT', 4, 'Phép toán vectơ theo tọa độ', array['cộng trừ vectơ tọa độ', 'nhân vectơ với một số', 'hai vectơ bằng nhau']::text[],
   '$\vec a=(a_1;a_2;a_3),\ \vec b=(b_1;b_2;b_3)$
$\vec a\pm\vec b=(a_1\pm b_1;\ a_2\pm b_2;\ a_3\pm b_3)$
$k\vec a=(ka_1;\ ka_2;\ ka_3)$
$\vec a=\vec b\Leftrightarrow a_1=b_1,\ a_2=b_2,\ a_3=b_3$',
   null, 'Hoành bằng hoành, tung bằng tung, cao bằng cao', null, array['TD:35']::text[], 'co', null),
  ('CT12-VT-05', 'Toán', '12', 'VT', 5, 'Tọa độ vectơ AB và độ dài đoạn thẳng AB', array['vectơ AB', 'độ dài AB', 'khoảng cách hai điểm', 'độ dài vectơ']::text[],
   '$\overrightarrow{AB}=(x_B-x_A;\ y_B-y_A;\ z_B-z_A)$
$AB=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2+(z_B-z_A)^2}$
$|\vec a|=\sqrt{a_1^2+a_2^2+a_3^2}$',
   null, null, null, array['TD:36']::text[], 'co', null),
  ('CT12-VT-06', 'Toán', '12', 'VT', 6, 'Tọa độ trung điểm, trọng tâm tam giác', array['trung điểm', 'trọng tâm', 'trọng tâm tam giác Oxyz']::text[],
   'Trung điểm $I$ của $AB$: $I\left(\dfrac{x_A+x_B}{2};\ \dfrac{y_A+y_B}{2};\ \dfrac{z_A+z_B}{2}\right)$
Trọng tâm $G$ của $\triangle ABC$: $G\left(\dfrac{x_A+x_B+x_C}{3};\ \dfrac{y_A+y_B+y_C}{3};\ \dfrac{z_A+z_B+z_C}{3}\right)$',
   null, null, null, array['TD:36']::text[], 'co', null),
  ('CT12-VT-07', 'Toán', '12', 'VT', 7, 'Tích vô hướng theo tọa độ — góc giữa hai vectơ', array['biểu thức tọa độ tích vô hướng', 'cos góc giữa hai vectơ', 'hai vectơ vuông góc']::text[],
   '$\vec a\cdot\vec b=a_1b_1+a_2b_2+a_3b_3$
$\cos(\vec a,\vec b)=\dfrac{a_1b_1+a_2b_2+a_3b_3}{\sqrt{a_1^2+a_2^2+a_3^2}\cdot\sqrt{b_1^2+b_2^2+b_3^2}}$
$\vec a\perp\vec b\Leftrightarrow a_1b_1+a_2b_2+a_3b_3=0$',
   null, 'Hoành nhân hoành + tung nhân tung + cao nhân cao', null, array['TD:36']::text[], 'co', null),
  ('CT12-VT-08', 'Toán', '12', 'VT', 8, 'Hai vectơ cùng phương', array['cùng phương', 'ba điểm thẳng hàng', 'a = kb']::text[],
   '$\vec a$ cùng phương $\vec b\ (\vec b\ne\vec 0)\Leftrightarrow\vec a=k\vec b$
$\Leftrightarrow\dfrac{a_1}{b_1}=\dfrac{a_2}{b_2}=\dfrac{a_3}{b_3}$ (khi $b_1,b_2,b_3\ne 0$)',
   null, null, null, array['TD:35']::text[], 'co', null),
  ('CT12-VT-09', 'Toán', '12', 'VT', 9, 'Hình chiếu của điểm lên trục và mặt phẳng tọa độ', array['hình chiếu lên Ox', 'hình chiếu lên mặt phẳng Oxy', 'điểm thuộc trục', 'điểm thuộc mặt phẳng tọa độ']::text[],
   '$M(x_M;y_M;z_M)$ chiếu lên:
$Ox: (x_M;0;0)\quad Oy: (0;y_M;0)\quad Oz: (0;0;z_M)$
$(Oxy): (x_M;y_M;0)\quad (Oxz): (x_M;0;z_M)\quad (Oyz): (0;y_M;z_M)$',
   'Chiếu lên trục nào thì GIỮ tọa độ đó; chiếu lên mặt nào thì cho tọa độ còn thiếu bằng $0$.', null, null, array['TD:35']::text[], 'co', null),
  ('CT12-VT-10', 'Toán', '12', 'VT', 10, 'Tích có hướng của hai vectơ', array['tích có hướng', '[a,b]', 'quy tắc 23-31-12', 'tích chéo']::text[],
   '$[\vec a,\vec b]=(a_2b_3-a_3b_2;\ a_3b_1-a_1b_3;\ a_1b_2-a_2b_1)$
$[\vec a,\vec b]$ vuông góc với cả $\vec a$ và $\vec b$
$\vec a,\vec b$ cùng phương $\Leftrightarrow[\vec a,\vec b]=\vec 0$',
   null, 'Quy tắc 23 – 31 – 12', 'H11', array['TD:36', 'TD:37']::text[], 'nghi_van', 'SGK 2018 có thể chỉ giới thiệu tích có hướng ở mục đọc thêm — GV xác nhận.'),
  ('CT12-VT-11', 'Toán', '12', 'VT', 11, 'Ứng dụng tích có hướng — diện tích, thể tích', array['diện tích tam giác Oxyz', 'thể tích tứ diện Oxyz', 'bốn điểm đồng phẳng', 'thể tích hình hộp']::text[],
   '$S_{\triangle ABC}=\dfrac12\left|[\overrightarrow{AB},\overrightarrow{AC}]\right|$
Hình bình hành $ABCD$: $S=\left|[\overrightarrow{AB},\overrightarrow{AD}]\right|$
Tứ diện $ABCD$: $V=\dfrac16\left|[\overrightarrow{AB},\overrightarrow{AC}]\cdot\overrightarrow{AD}\right|$
Hình hộp $ABCD.A''B''C''D''$: $V=\left|[\overrightarrow{AB},\overrightarrow{AD}]\cdot\overrightarrow{AA''}\right|$
$A,B,C,D$ đồng phẳng $\Leftrightarrow[\overrightarrow{AB},\overrightarrow{AC}]\cdot\overrightarrow{AD}=0$',
   null, null, null, array['TD:37']::text[], 'nghi_van', null),
  ('CT12-TK-01', 'Toán', '12', 'TK', 1, 'Khoảng biến thiên của mẫu số liệu ghép nhóm', array['khoảng biến thiên', 'biên độ mẫu ghép nhóm']::text[],
   'Mẫu ghép nhóm có các nhóm $[a_1;a_2),\ [a_2;a_3),\ \dots,\ [a_k;a_{k+1})$:
$R=a_{k+1}-a_1$ (đầu mút phải nhóm cuối − đầu mút trái nhóm đầu)',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-TK-02', 'Toán', '12', 'TK', 2, 'Tứ phân vị của mẫu số liệu ghép nhóm', array['tứ phân vị', 'Q1', 'Q3', 'trung vị ghép nhóm', 'Q2']::text[],
   'Cỡ mẫu $n$. Tìm nhóm $[a_p;a_{p+1})$ chứa vị trí thứ $\dfrac{in}{4}$ ($i=1,2,3$):
$Q_i=a_p+\dfrac{\dfrac{in}{4}-C}{m_p}\cdot(a_{p+1}-a_p)$
$m_p$: tần số nhóm $p$; $C$: tổng tần số các nhóm đứng TRƯỚC nhóm $p$',
   '$Q_2$ chính là trung vị $M_e$.', null, null, array['BK']::text[], 'co', null),
  ('CT12-TK-03', 'Toán', '12', 'TK', 3, 'Khoảng tứ phân vị', array['khoảng tứ phân vị', 'delta Q', 'Q3-Q1']::text[],
   '$\Delta_Q=Q_3-Q_1$',
   'Đo độ phân tán của nửa giữa mẫu số liệu; ít bị ảnh hưởng bởi giá trị bất thường hơn khoảng biến thiên.', null, null, array['BK']::text[], 'co', null),
  ('CT12-TK-04', 'Toán', '12', 'TK', 4, 'Số trung bình của mẫu số liệu ghép nhóm', array['số trung bình', 'trung bình cộng ghép nhóm', 'giá trị đại diện']::text[],
   '$\overline{x}=\dfrac{m_1c_1+m_2c_2+\dots+m_kc_k}{n}$
$c_i=\dfrac{a_i+a_{i+1}}{2}$: giá trị đại diện (trung điểm) của nhóm $i$; $m_i$: tần số',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-TK-05', 'Toán', '12', 'TK', 5, 'Phương sai của mẫu số liệu ghép nhóm', array['phương sai', 's bình', 's^2']::text[],
   '$s^2=\dfrac{m_1(c_1-\overline{x})^2+m_2(c_2-\overline{x})^2+\dots+m_k(c_k-\overline{x})^2}{n}$
$\phantom{s^2}=\dfrac{m_1c_1^2+m_2c_2^2+\dots+m_kc_k^2}{n}-\overline{x}^2$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-TK-06', 'Toán', '12', 'TK', 6, 'Độ lệch chuẩn của mẫu số liệu ghép nhóm', array['độ lệch chuẩn', 's']::text[],
   '$s=\sqrt{s^2}$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-01', 'Toán', '12', 'NH', 1, 'Định nghĩa nguyên hàm', array['nguyên hàm', 'F''(x)=f(x)']::text[],
   '$F$ là một nguyên hàm của $f$ trên $K$ nếu $F''(x)=f(x),\ \forall x\in K$
$\displaystyle\int f(x)\,dx=F(x)+C$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-02', 'Toán', '12', 'NH', 2, 'Tính chất của nguyên hàm', array['tính chất nguyên hàm']::text[],
   '$\displaystyle\int kf(x)\,dx=k\int f(x)\,dx\ (k\ne 0)$
$\displaystyle\int[f(x)\pm g(x)]\,dx=\int f(x)\,dx\pm\int g(x)\,dx$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-03', 'Toán', '12', 'NH', 3, 'Bảng nguyên hàm cơ bản', array['bảng nguyên hàm', 'nguyên hàm x mũ', 'nguyên hàm 1/x', 'nguyên hàm sin cos', 'nguyên hàm e mũ x', 'nguyên hàm a mũ x']::text[],
   '$\displaystyle\int dx=x+C$
$\displaystyle\int x^\alpha dx=\dfrac{x^{\alpha+1}}{\alpha+1}+C\ (\alpha\ne -1)$
$\displaystyle\int\dfrac{1}{x}dx=\ln|x|+C$
$\displaystyle\int\cos x\,dx=\sin x+C$
$\displaystyle\int\sin x\,dx=-\cos x+C$
$\displaystyle\int\dfrac{1}{\cos^2x}dx=\tan x+C$
$\displaystyle\int\dfrac{1}{\sin^2x}dx=-\cot x+C$
$\displaystyle\int e^x dx=e^x+C$
$\displaystyle\int a^x dx=\dfrac{a^x}{\ln a}+C\ (0<a\ne 1)$',
   null, null, null, array['TD:16', 'TD:17']::text[], 'co', null),
  ('CT12-NH-04', 'Toán', '12', 'NH', 4, 'Nguyên hàm mở rộng theo (ax + b)', array['nguyên hàm mở rộng', 'nguyên hàm ax+b', 'nguyên hàm hàm hợp']::text[],
   '$(a\ne 0)$
$\displaystyle\int(ax+b)^\alpha dx=\dfrac1a\cdot\dfrac{(ax+b)^{\alpha+1}}{\alpha+1}+C\ (\alpha\ne -1)$
$\displaystyle\int\dfrac{1}{ax+b}dx=\dfrac1a\ln|ax+b|+C$
$\displaystyle\int\cos(ax+b)\,dx=\dfrac1a\sin(ax+b)+C$
$\displaystyle\int\sin(ax+b)\,dx=-\dfrac1a\cos(ax+b)+C$
$\displaystyle\int e^{ax+b}dx=\dfrac1a e^{ax+b}+C$',
   null, null, null, array['TD:16', 'TD:17']::text[], 'nghi_van', 'SGK 2018 chỉ dạy nguyên hàm hàm sơ cấp cơ bản; dạng ax+b là mở rộng hay dùng — GV xác nhận giữ.'),
  ('CT12-NH-05', 'Toán', '12', 'NH', 5, 'Tích phân — công thức Newton–Leibniz', array['tích phân', 'Newton Leibniz', 'Niu-tơn Lai-bơ-nít', 'F(b)-F(a)']::text[],
   '$\displaystyle\int_a^b f(x)\,dx=F(x)\Big|_a^b=F(b)-F(a)$ ($F$ là một nguyên hàm của $f$)',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-06', 'Toán', '12', 'NH', 6, 'Tính chất của tích phân', array['tính chất tích phân', 'tách cận tích phân', 'đổi cận đổi dấu']::text[],
   '$\displaystyle\int_a^a f(x)\,dx=0\qquad\int_a^b f(x)\,dx=-\int_b^a f(x)\,dx$
$\displaystyle\int_a^b kf(x)\,dx=k\int_a^b f(x)\,dx$
$\displaystyle\int_a^b[f(x)\pm g(x)]\,dx=\int_a^b f(x)\,dx\pm\int_a^b g(x)\,dx$
$\displaystyle\int_a^b f(x)\,dx=\int_a^c f(x)\,dx+\int_c^b f(x)\,dx$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-07', 'Toán', '12', 'NH', 7, 'Diện tích hình phẳng giới hạn bởi đồ thị và trục hoành', array['diện tích hình phẳng', 'diện tích dưới đồ thị', 'ứng dụng tích phân diện tích']::text[],
   'Hình phẳng giới hạn bởi $y=f(x)$, trục $Ox$, $x=a$, $x=b$:
$\displaystyle S=\int_a^b|f(x)|\,dx$',
   null, null, 'H05', array['TD:17']::text[], 'co', null),
  ('CT12-NH-08', 'Toán', '12', 'NH', 8, 'Diện tích hình phẳng giới hạn bởi hai đồ thị', array['diện tích giữa hai đồ thị', 'diện tích hai đường cong']::text[],
   'Hình phẳng giới hạn bởi $y=f(x)$, $y=g(x)$, $x=a$, $x=b$:
$\displaystyle S=\int_a^b|f(x)-g(x)|\,dx$',
   'Chưa cho $a,b$ thì giải $f(x)=g(x)$ để tìm cận.', null, 'H06', array['TD:17']::text[], 'co', null),
  ('CT12-NH-09', 'Toán', '12', 'NH', 9, 'Thể tích vật thể (biết diện tích thiết diện)', array['thể tích vật thể', 'thiết diện S(x)', 'ứng dụng tích phân thể tích']::text[],
   'Vật thể nằm giữa 2 mặt phẳng $x=a$, $x=b$; thiết diện vuông góc với $Ox$ tại $x$ có diện tích $S(x)$:
$\displaystyle V=\int_a^b S(x)\,dx$',
   null, null, 'H07', array['BK']::text[], 'co', null),
  ('CT12-NH-10', 'Toán', '12', 'NH', 10, 'Thể tích khối tròn xoay', array['khối tròn xoay', 'thể tích tròn xoay', 'quay quanh trục Ox', 'pi tích phân f bình']::text[],
   'Hình phẳng giới hạn bởi $y=f(x)$, $Ox$, $x=a$, $x=b$ quay quanh $Ox$:
$\displaystyle V=\pi\int_a^b f^2(x)\,dx$',
   null, null, 'H08', array['TD:18']::text[], 'co', null),
  ('CT12-NH-11', 'Toán', '12', 'NH', 11, 'Tích phân của tốc độ thay đổi (quãng đường từ vận tốc)', array['quãng đường vận tốc', 'tích phân vận tốc', 'bài toán chuyển động tích phân']::text[],
   '$\displaystyle\int_a^b f''(x)\,dx=f(b)-f(a)$
Quãng đường vật đi từ $t=a$ đến $t=b$ với vận tốc $v(t)\ge 0$: $\displaystyle s=\int_a^b v(t)\,dt$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-NH-12', 'Toán', '12', 'NH', 12, 'Tích phân từng phần', array['từng phần', 'udv', 'nhất log nhì đa tam lượng tứ mũ']::text[],
   '$\displaystyle\int_a^b u\,dv=uv\Big|_a^b-\int_a^b v\,du$',
   null, 'Thứ tự ưu tiên đặt $u$: $\ln x\to$ đa thức $\to$ lượng giác, mũ', null, array['TD:17']::text[], 'nghi_van', 'Phương pháp từng phần nhiều khả năng đã ra khỏi CT 2018 — GV xác nhận giữ hay bỏ.'),
  ('CT12-NH-13', 'Toán', '12', 'NH', 13, 'Đổi biến số trong tích phân', array['đổi biến', 'đặt t', 'đổi cận']::text[],
   '$\displaystyle\int_a^b f[u(x)]\,u''(x)\,dx=\int_{u(a)}^{u(b)} f(t)\,dt$ (đặt $t=u(x)$)',
   null, null, null, array['TD:17']::text[], 'nghi_van', 'Phương pháp đổi biến nhiều khả năng đã ra khỏi CT 2018 — GV xác nhận giữ hay bỏ.'),
  ('CT12-OX-01', 'Toán', '12', 'OX', 1, 'Phương trình tổng quát của mặt phẳng', array['phương trình mặt phẳng', 'vectơ pháp tuyến', 'VTPT', 'Ax+By+Cz+D=0']::text[],
   'Mặt phẳng qua $M_0(x_0;y_0;z_0)$, VTPT $\vec n=(A;B;C)\ne\vec 0$:
$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$
Mặt phẳng $Ax+By+Cz+D=0$ có VTPT $\vec n=(A;B;C)$',
   null, null, 'H12', array['TD:37', 'TD:38']::text[], 'co', null),
  ('CT12-OX-02', 'Toán', '12', 'OX', 2, 'Mặt phẳng qua 1 điểm, có cặp vectơ chỉ phương', array['cặp vectơ chỉ phương', 'mặt phẳng chứa hai vectơ', 'VTPT bằng tích có hướng']::text[],
   'Mặt phẳng có cặp vectơ chỉ phương $\vec a,\vec b$ (không cùng phương) có VTPT $\vec n=[\vec a,\vec b]$',
   null, null, 'H12', array['TD:38']::text[], 'co', null),
  ('CT12-OX-03', 'Toán', '12', 'OX', 3, 'Mặt phẳng đi qua 3 điểm', array['mặt phẳng qua ba điểm', 'mặt phẳng (ABC)', 'phương trình mặt phẳng ABC']::text[],
   'Qua 3 điểm không thẳng hàng $A,B,C$: VTPT $\vec n=[\overrightarrow{AB},\overrightarrow{AC}]$, đi qua $A$',
   null, null, 'H12', array['TD:38']::text[], 'co', null),
  ('CT12-OX-04', 'Toán', '12', 'OX', 4, 'Phương trình mặt phẳng theo đoạn chắn', array['đoạn chắn', 'x/a+y/b+z/c=1', 'mặt phẳng cắt ba trục']::text[],
   'Mặt phẳng qua $A(a;0;0),\ B(0;b;0),\ C(0;0;c)\ (abc\ne 0)$:
$\dfrac{x}{a}+\dfrac{y}{b}+\dfrac{z}{c}=1$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-OX-05', 'Toán', '12', 'OX', 5, 'Phương trình các mặt phẳng tọa độ', array['mặt phẳng Oxy', 'mặt phẳng Oxz', 'mặt phẳng Oyz']::text[],
   '$(Oxy): z=0\qquad(Oxz): y=0\qquad(Oyz): x=0$',
   null, null, null, array['TD:38']::text[], 'co', null),
  ('CT12-OX-06', 'Toán', '12', 'OX', 6, 'Mặt phẳng song song, vuông góc — mặt phẳng trung trực', array['hai mặt phẳng song song', 'hai mặt phẳng vuông góc', 'mặt phẳng trung trực', 'mặt phẳng vuông góc đường thẳng AB']::text[],
   '$(\alpha)\parallel(\beta)$: dùng chung VTPT $\vec n_\alpha=\vec n_\beta$
$(\alpha)\perp AB$: VTPT $\vec n_\alpha=\overrightarrow{AB}$
Mặt phẳng trung trực của $MN$: qua trung điểm $I$ của $MN$, VTPT $\overrightarrow{MN}$',
   null, null, null, array['TD:38', 'TD:39']::text[], 'co', null),
  ('CT12-OX-07', 'Toán', '12', 'OX', 7, 'Vị trí tương đối của hai mặt phẳng', array['hai mặt phẳng cắt nhau', 'hai mặt phẳng trùng nhau', 'điều kiện vuông góc hai mặt phẳng']::text[],
   '$(P): A_1x+B_1y+C_1z+D_1=0,\quad(Q): A_2x+B_2y+C_2z+D_2=0$
$(P)\parallel(Q)\Leftrightarrow\dfrac{A_1}{A_2}=\dfrac{B_1}{B_2}=\dfrac{C_1}{C_2}\ne\dfrac{D_1}{D_2}$
$(P)\equiv(Q)\Leftrightarrow\dfrac{A_1}{A_2}=\dfrac{B_1}{B_2}=\dfrac{C_1}{C_2}=\dfrac{D_1}{D_2}$
$(P)$ cắt $(Q)\Leftrightarrow A_1:B_1:C_1\ne A_2:B_2:C_2$
$(P)\perp(Q)\Leftrightarrow A_1A_2+B_1B_2+C_1C_2=0$',
   null, null, null, array['TD:47']::text[], 'co', null),
  ('CT12-OX-08', 'Toán', '12', 'OX', 8, 'Phương trình tham số của đường thẳng', array['phương trình đường thẳng', 'vectơ chỉ phương', 'VTCP', 'phương trình tham số']::text[],
   'Đường thẳng qua $M_0(x_0;y_0;z_0)$, VTCP $\vec u=(a;b;c)\ne\vec 0$:
$\begin{cases} x=x_0+at \\ y=y_0+bt \\ z=z_0+ct \end{cases}\ (t\in\mathbb{R})$',
   null, null, null, array['TD:43']::text[], 'co', null),
  ('CT12-OX-09', 'Toán', '12', 'OX', 9, 'Phương trình chính tắc của đường thẳng', array['phương trình chính tắc']::text[],
   '$\dfrac{x-x_0}{a}=\dfrac{y-y_0}{b}=\dfrac{z-z_0}{c}$ (khi $abc\ne 0$)',
   null, null, null, array['TD:43']::text[], 'co', null),
  ('CT12-OX-10', 'Toán', '12', 'OX', 10, 'Đường thẳng qua 2 điểm / vuông góc mặt phẳng / song song đường thẳng', array['đường thẳng qua hai điểm', 'đường thẳng vuông góc mặt phẳng', 'đường thẳng song song đường thẳng']::text[],
   'Qua $A,B$: VTCP $\vec u=\overrightarrow{AB}$
Vuông góc với $(P)$: VTCP $\vec u=\vec n_P$
Song song với $\Delta$: VTCP $\vec u=\vec u_\Delta$',
   null, null, null, array['TD:43']::text[], 'co', null),
  ('CT12-OX-11', 'Toán', '12', 'OX', 11, 'Vị trí tương đối của đường thẳng và mặt phẳng', array['đường thẳng cắt mặt phẳng', 'đường thẳng song song mặt phẳng', 'đường thẳng nằm trong mặt phẳng', 'giao điểm đường thẳng và mặt phẳng']::text[],
   'Thay $x=x_0+at,\ y=y_0+bt,\ z=z_0+ct$ vào $(P)$ được phương trình bậc nhất ẩn $t$:
Có đúng 1 nghiệm: $d$ cắt $(P)$ (nghiệm $t$ cho giao điểm)
Vô nghiệm: $d\parallel(P)$
Vô số nghiệm: $d\subset(P)$
Đặc biệt: $d\perp(P)\Leftrightarrow\vec u_d$ cùng phương $\vec n_P$',
   null, null, null, array['TD:47']::text[], 'co', null),
  ('CT12-OX-12', 'Toán', '12', 'OX', 12, 'Vị trí tương đối của hai đường thẳng', array['hai đường thẳng chéo nhau', 'hai đường thẳng cắt nhau', 'hai đường thẳng song song', 'hai đường thẳng vuông góc']::text[],
   '$d_1$ qua $A$, VTCP $\vec u_1$; $d_2$ qua $B$, VTCP $\vec u_2$:
$d_1\parallel d_2\Leftrightarrow[\vec u_1,\vec u_2]=\vec 0$ và $A\notin d_2$
$d_1\equiv d_2\Leftrightarrow[\vec u_1,\vec u_2]=\vec 0$ và $A\in d_2$
$d_1$ cắt $d_2\Leftrightarrow[\vec u_1,\vec u_2]\ne\vec 0$ và $[\vec u_1,\vec u_2]\cdot\overrightarrow{AB}=0$
$d_1$ chéo $d_2\Leftrightarrow[\vec u_1,\vec u_2]\cdot\overrightarrow{AB}\ne 0$
$d_1\perp d_2\Leftrightarrow\vec u_1\cdot\vec u_2=0$',
   null, null, null, array['TD:47']::text[], 'nghi_van', 'Dùng tích có hướng — phụ thuộc quyết định giữ CT12-VT-10.'),
  ('CT12-OX-13', 'Toán', '12', 'OX', 13, 'Góc giữa hai đường thẳng', array['góc giữa hai đường thẳng Oxyz', 'cos góc hai đường thẳng']::text[],
   '$\cos(d_1,d_2)=\dfrac{|\vec u_1\cdot\vec u_2|}{|\vec u_1|\cdot|\vec u_2|}$',
   'Góc giữa hai đường thẳng luôn trong $[0^\circ;90^\circ]$ nên có dấu giá trị tuyệt đối.', null, null, array['BK']::text[], 'co', null),
  ('CT12-OX-14', 'Toán', '12', 'OX', 14, 'Góc giữa đường thẳng và mặt phẳng', array['góc giữa đường thẳng và mặt phẳng Oxyz', 'sin góc đường thẳng mặt phẳng']::text[],
   '$\sin(d,(P))=\dfrac{|\vec u\cdot\vec n|}{|\vec u|\cdot|\vec n|}$',
   'Là SIN, không phải cos — vì VTPT vuông góc với mặt phẳng.', null, 'H13', array['BK']::text[], 'co', null),
  ('CT12-OX-15', 'Toán', '12', 'OX', 15, 'Góc giữa hai mặt phẳng', array['góc giữa hai mặt phẳng Oxyz', 'cos góc hai mặt phẳng']::text[],
   '$\cos((P),(Q))=\dfrac{|\vec n_P\cdot\vec n_Q|}{|\vec n_P|\cdot|\vec n_Q|}$',
   null, null, 'H14', array['BK']::text[], 'co', null),
  ('CT12-OX-16', 'Toán', '12', 'OX', 16, 'Khoảng cách từ điểm đến mặt phẳng', array['khoảng cách điểm mặt phẳng', 'd(M,(P))']::text[],
   '$M_0(x_0;y_0;z_0),\ (P): Ax+By+Cz+D=0$:
$d(M_0,(P))=\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}$',
   null, null, 'H15', array['TD:38', 'TD:48']::text[], 'co', null),
  ('CT12-OX-17', 'Toán', '12', 'OX', 17, 'Khoảng cách giữa hai mặt phẳng song song', array['khoảng cách hai mặt phẳng song song']::text[],
   'Bằng khoảng cách từ 1 điểm bất kỳ trên mặt này đến mặt kia.
$(P): Ax+By+Cz+D_1=0,\ (Q): Ax+By+Cz+D_2=0$: $d=\dfrac{|D_1-D_2|}{\sqrt{A^2+B^2+C^2}}$',
   null, null, null, array['TD:48', 'BK']::text[], 'co', null),
  ('CT12-OX-18', 'Toán', '12', 'OX', 18, 'Khoảng cách từ điểm đến đường thẳng', array['khoảng cách điểm đường thẳng Oxyz', 'd(M,Δ)']::text[],
   '$\Delta$ qua $M_0$, VTCP $\vec u$: $d(M,\Delta)=\dfrac{\left|[\overrightarrow{M_0M},\vec u]\right|}{|\vec u|}$',
   null, null, null, array['TD:48']::text[], 'nghi_van', null),
  ('CT12-OX-19', 'Toán', '12', 'OX', 19, 'Khoảng cách giữa hai đường thẳng chéo nhau', array['khoảng cách hai đường thẳng chéo nhau Oxyz']::text[],
   '$\Delta_1$ qua $M_1$, VTCP $\vec u_1$; $\Delta_2$ qua $M_2$, VTCP $\vec u_2$:
$d(\Delta_1,\Delta_2)=\dfrac{\left|[\vec u_1,\vec u_2]\cdot\overrightarrow{M_1M_2}\right|}{\left|[\vec u_1,\vec u_2]\right|}$',
   null, null, null, array['TD:49']::text[], 'nghi_van', null),
  ('CT12-OX-20', 'Toán', '12', 'OX', 20, 'Hình chiếu của điểm lên mặt phẳng — điểm đối xứng', array['hình chiếu vuông góc', 'điểm đối xứng qua mặt phẳng', 'hình chiếu điểm lên mặt phẳng']::text[],
   'Hình chiếu $H$ của $M$ lên $(P)$: lập đường thẳng $d$ qua $M$, VTCP $\vec n_P$; $H=d\cap(P)$
Điểm $M''$ đối xứng với $M$ qua $(P)$: $H$ là trung điểm $MM''$
$x_{M''}=2x_H-x_M,\ y_{M''}=2y_H-y_M,\ z_{M''}=2z_H-z_M$',
   null, null, 'H16', array['TD:46']::text[], 'co', null),
  ('CT12-OX-21', 'Toán', '12', 'OX', 21, 'Phương trình mặt cầu', array['mặt cầu', 'phương trình mặt cầu tâm I bán kính R']::text[],
   'Tâm $I(a;b;c)$, bán kính $R$: $(x-a)^2+(y-b)^2+(z-c)^2=R^2$',
   null, null, 'H17', array['TD:41', 'TD:42']::text[], 'co', null),
  ('CT12-OX-22', 'Toán', '12', 'OX', 22, 'Phương trình mặt cầu dạng khai triển', array['x²+y²+z²-2ax-2by-2cz+d=0', 'điều kiện là phương trình mặt cầu', 'tìm tâm và bán kính mặt cầu']::text[],
   '$x^2+y^2+z^2-2ax-2by-2cz+d=0$ là mặt cầu $\Leftrightarrow a^2+b^2+c^2-d>0$
Khi đó tâm $I(a;b;c)$, bán kính $R=\sqrt{a^2+b^2+c^2-d}$',
   null, null, null, array['TD:41']::text[], 'co', null),
  ('CT12-OX-23', 'Toán', '12', 'OX', 23, 'Mặt cầu có đường kính AB / đi qua điểm / tiếp xúc mặt phẳng', array['mặt cầu đường kính AB', 'mặt cầu tiếp xúc mặt phẳng', 'mặt cầu đi qua điểm']::text[],
   'Đường kính $AB$: tâm $I$ = trung điểm $AB$, $R=\dfrac{AB}{2}$
Tâm $I$, đi qua $M$: $R=IM$
Tâm $I$, tiếp xúc $(P)$: $R=d(I,(P))$',
   null, null, null, array['TD:42']::text[], 'co', null),
  ('CT12-OX-24', 'Toán', '12', 'OX', 24, 'Vị trí tương đối của mặt phẳng và mặt cầu', array['mặt phẳng cắt mặt cầu', 'tiếp diện', 'bán kính đường tròn giao tuyến', 'r = căn R bình trừ d bình']::text[],
   'Mặt cầu tâm $I$ bán kính $R$; $d=d(I,(P))$:
$d>R$: $(P)$ và mặt cầu không có điểm chung
$d=R$: $(P)$ tiếp xúc mặt cầu (tiếp diện)
$d<R$: $(P)$ cắt mặt cầu theo đường tròn bán kính $r=\sqrt{R^2-d^2}$, tâm là hình chiếu của $I$ lên $(P)$',
   null, null, 'H18', array['TD:48']::text[], 'nghi_van', null),
  ('CT12-XS-01', 'Toán', '12', 'XS', 1, 'Xác suất có điều kiện', array['P(A|B)', 'xác suất của A khi biết B']::text[],
   '$P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}\ (P(B)>0)$
Khi các kết quả đồng khả năng: $P(A\mid B)=\dfrac{n(A\cap B)}{n(B)}$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-XS-02', 'Toán', '12', 'XS', 2, 'Công thức nhân xác suất', array['quy tắc nhân xác suất', 'P(AB)']::text[],
   '$P(A\cap B)=P(B)\cdot P(A\mid B)=P(A)\cdot P(B\mid A)$',
   null, null, null, array['BK']::text[], 'co', null),
  ('CT12-XS-03', 'Toán', '12', 'XS', 3, 'Công thức xác suất toàn phần', array['xác suất toàn phần', 'sơ đồ cây']::text[],
   '$P(A)=P(B)\cdot P(A\mid B)+P(\overline{B})\cdot P(A\mid\overline{B})$',
   null, null, 'H19', array['BK']::text[], 'co', null),
  ('CT12-XS-04', 'Toán', '12', 'XS', 4, 'Công thức Bayes', array['Bayes', 'Bay-ét', 'Bai-ơ', 'Bayet', 'xác suất hậu nghiệm']::text[],
   '$P(B\mid A)=\dfrac{P(B)\cdot P(A\mid B)}{P(A)}=\dfrac{P(B)\cdot P(A\mid B)}{P(B)\cdot P(A\mid B)+P(\overline{B})\cdot P(A\mid\overline{B})}$',
   null, null, 'H19', array['BK']::text[], 'co', null),
  ('CT12-XS-05', 'Toán', '12', 'XS', 5, 'Hai biến cố độc lập', array['biến cố độc lập', 'độc lập']::text[],
   '$A,B$ độc lập $\Leftrightarrow P(A\cap B)=P(A)\cdot P(B)$
$\Leftrightarrow P(A\mid B)=P(A)$ (khi $P(B)>0$)',
   null, null, null, array['BK']::text[], 'co', null)
on conflict (ma) do nothing;
