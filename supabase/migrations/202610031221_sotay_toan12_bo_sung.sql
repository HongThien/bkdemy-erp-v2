-- ============================================================================
-- Bổ sung 77 thẻ Toán 12 theo KHUÔN MỤC SỔ TAY chung (Thùy 03/10: "Toán cũng kiểu thế" — như mục KHTN).
-- Sinh bằng scripts/sotay-cong-thuc/sinh-bo-sung.mjs — đừng sửa tay.
-- Mỗi thẻ: công thức cũ (noi_dung) → cong_thuc · noi_dung = 1 câu tóm tắt · vd (ví dụ từng bước) · nham (hay nhầm) · bien (kí hiệu, thẻ thống kê) · lq (xem thêm).
-- Chỉ ghi thẻ CHƯA AI SỬA trên ERP (cap_nhat_boi null, cong_thuc null, chờ duyệt) — thẻ người đã sửa giữ nguyên. Thẻ vẫn 'cho_duyet'.
-- Trigger ghi nhật ký 'sua' kèm bản cũ cho từng thẻ.
-- MẤT GÌ: không — nội dung cũ chuyển sang cột cong_thuc, bản cũ còn trong sotay_ct_lich_su.ban_cu.
-- ============================================================================

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Dấu của đạo hàm cho biết hàm số tăng hay giảm trên từng khoảng.',
  vd = '{"de":"Xét tính đơn điệu của $y=x^3-3x$.","buoc":["$y''=3x^2-3=3(x-1)(x+1)$","$y''>0\\Leftrightarrow x<-1$ hoặc $x>1$; $y''<0\\Leftrightarrow -1<x<1$"],"kq":"Đồng biến trên $(-\\infty;-1)$ và $(1;+\\infty)$; nghịch biến trên $(-1;1)$."}'::jsonb, nham = '["Viết \"đồng biến trên $(-\\infty;-1)\\cup(1;+\\infty)$\" — phải nêu TỪNG khoảng, không dùng dấu hợp."]'::jsonb, bien = null, lq = array['CT12-HS-02', 'CT12-HS-03']::text[]
where ma = 'CT12-HS-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hàm bậc ba đơn điệu trên cả $\mathbb{R}$ khi $y''$ không đổi dấu.',
  vd = '{"de":"Tìm $m$ để $y=x^3+3x^2+mx+1$ đồng biến trên $\\mathbb{R}$.","buoc":["$y''=3x^2+6x+m$, hệ số $a=1>0$","Cần $b^2-3ac=9-3m\\le 0$"],"kq":"$m\\ge 3$"}'::jsonb, nham = '["Dùng $b^2-3ac<0$ (bỏ mất dấu $=$) — khi $b^2-3ac=0$ hàm vẫn đồng biến.","Quên xét riêng trường hợp hệ số của $x^3$ bằng $0$ khi hệ số đó chứa tham số."]'::jsonb, bien = null, lq = array['CT12-HS-01', 'CT12-HS-05']::text[]
where ma = 'CT12-HS-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hàm $y=\dfrac{ax+b}{cx+d}$ luôn đơn điệu trên từng khoảng xác định; chiều phụ thuộc dấu của $ad-bc$.',
  vd = '{"de":"Tìm $m$ để $y=\\dfrac{x+m}{x+1}$ đồng biến trên từng khoảng xác định.","buoc":["$ad-bc=1\\cdot 1-m\\cdot 1=1-m$","Cần $1-m>0$"],"kq":"$m<1$"}'::jsonb, nham = '["Viết \"đồng biến trên $\\mathbb{R}$\" — hàm không xác định tại $x=-\\dfrac{d}{c}$.","Lấy $ad-bc\\ge 0$: khi $ad-bc=0$ hàm là hằng, không đồng biến."]'::jsonb, bien = null, lq = array['CT12-HS-11', 'CT12-HS-15']::text[]
where ma = 'CT12-HS-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Xét dấu đạo hàm cấp hai tại điểm có đạo hàm bằng 0 để biết đó là cực đại hay cực tiểu.',
  vd = '{"de":"Tìm cực trị của $y=x^3-3x+2$.","buoc":["$y''=3x^2-3=0\\Leftrightarrow x=\\pm 1$","$y''''=6x$: $y''''(1)=6>0$, $y''''(-1)=-6<0$"],"kq":"Cực tiểu tại $x=1$ (giá trị $0$); cực đại tại $x=-1$ (giá trị $4$)."}'::jsonb, nham = '["Thấy $f''''(x_0)=0$ rồi kết luận \"không có cực trị\" — phải lập bảng biến thiên.","Nhầm điểm cực trị ($x_0$) với giá trị cực trị ($f(x_0)$)."]'::jsonb, bien = null, lq = array['CT12-HS-05', 'CT12-HS-06']::text[]
where ma = 'CT12-HS-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hàm bậc ba có cực trị khi $y''=0$ có hai nghiệm phân biệt.',
  vd = '{"de":"Tìm $m$ để $y=x^3-3x^2+mx$ có hai điểm cực trị.","buoc":["$a=1,\\ b=-3,\\ c=m$","Cần $b^2-3ac=9-3m>0$"],"kq":"$m<3$"}'::jsonb, nham = '["Lấy $b^2-3ac\\ge 0$ — nghiệm kép của $y''$ không tạo ra cực trị."]'::jsonb, bien = null, lq = array['CT12-HS-02', 'CT12-HS-04']::text[]
where ma = 'CT12-HS-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hàm trùng phương luôn có cực trị tại $x=0$; có thêm 2 cực trị khi $a$ và $b$ trái dấu.',
  vd = '{"de":"Tìm $m$ để $y=x^4-2mx^2+1$ có ba điểm cực trị.","buoc":["$a=1,\\ b=-2m$","Cần $ab=-2m<0$"],"kq":"$m>0$"}'::jsonb, nham = '["Quên điều kiện $a\\ne 0$ khi $a$ chứa tham số (khi $a=0$ hàm thành bậc hai, chỉ 1 cực trị)."]'::jsonb, bien = null, lq = array['CT12-HS-04']::text[]
where ma = 'CT12-HS-06' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Trên một đoạn, GTLN và GTNN chỉ có thể đạt ở hai đầu mút hoặc tại điểm đạo hàm bằng 0.',
  vd = '{"de":"Tìm GTLN, GTNN của $y=x^3-3x+1$ trên $[0;2]$.","buoc":["$y''=3x^2-3=0\\Leftrightarrow x=1$ (nhận) hoặc $x=-1$ (loại vì $\\notin[0;2]$)","$y(0)=1,\\ y(1)=-1,\\ y(2)=3$"],"kq":"$\\max=3$ tại $x=2$; $\\min=-1$ tại $x=1$."}'::jsonb, nham = '["Đem cả nghiệm nằm ngoài đoạn $[a;b]$ ra so sánh.","Quên tính giá trị tại hai đầu mút."]'::jsonb, bien = null, lq = array[]::text[]
where ma = 'CT12-HS-07' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tiệm cận ngang là đường $y=y_0$ mà đồ thị tiến sát khi $x\to\pm\infty$.',
  vd = '{"de":"Tìm tiệm cận ngang của $y=\\dfrac{2x+1}{x-3}$.","buoc":["$\\lim\\limits_{x\\to\\pm\\infty}\\dfrac{2x+1}{x-3}=2$"],"kq":"$y=2$"}'::jsonb, nham = '["Chỉ xét $x\\to+\\infty$ — có hàm có hai tiệm cận ngang khác nhau ở hai phía."]'::jsonb, bien = null, lq = array['CT12-HS-09', 'CT12-HS-10', 'CT12-HS-11']::text[]
where ma = 'CT12-HS-08' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tiệm cận đứng là đường $x=x_0$ mà đồ thị đi lên hoặc xuống vô hạn khi $x$ tiến tới $x_0$.',
  vd = '{"de":"Tìm tiệm cận đứng của $y=\\dfrac{2x+1}{x-3}$.","buoc":["$\\lim\\limits_{x\\to 3^+}\\dfrac{2x+1}{x-3}=+\\infty$"],"kq":"$x=3$"}'::jsonb, nham = '["Lấy mọi nghiệm của mẫu làm tiệm cận đứng — nếu cũng là nghiệm của tử thì có thể không phải (vd $y=\\dfrac{x^2-1}{x-1}$ không có tiệm cận đứng)."]'::jsonb, bien = null, lq = array['CT12-HS-08', 'CT12-HS-11']::text[]
where ma = 'CT12-HS-09' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tiệm cận xiên là đường $y=ax+b\ (a\ne 0)$ mà đồ thị tiến sát khi $x\to\pm\infty$.',
  vd = '{"de":"Tìm tiệm cận xiên của $y=\\dfrac{x^2+1}{x}$.","buoc":["$y=x+\\dfrac1x$","$\\lim\\limits_{x\\to\\pm\\infty}(y-x)=\\lim\\limits_{x\\to\\pm\\infty}\\dfrac1x=0$"],"kq":"$y=x$"}'::jsonb, nham = '["Ở cùng một phía ($x\\to+\\infty$ hoặc $x\\to-\\infty$) đồ thị không thể vừa có tiệm cận ngang vừa có tiệm cận xiên."]'::jsonb, bien = null, lq = array['CT12-HS-12', 'CT12-HS-08']::text[]
where ma = 'CT12-HS-10' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hàm $y=\dfrac{ax+b}{cx+d}$ có đúng 1 tiệm cận đứng và 1 tiệm cận ngang, đọc thẳng từ hệ số.',
  vd = '{"de":"Tìm các tiệm cận của $y=\\dfrac{3x-1}{2x+4}$.","buoc":["Tiệm cận đứng: $2x+4=0\\Leftrightarrow x=-2$","Tiệm cận ngang: $y=\\dfrac{a}{c}=\\dfrac32$"],"kq":"$x=-2$ và $y=\\dfrac32$"}'::jsonb, nham = '["Lấy tiệm cận ngang bằng $\\dfrac{b}{d}$ (tỉ số hệ số tự do) thay vì $\\dfrac{a}{c}$."]'::jsonb, bien = null, lq = array['CT12-HS-03', 'CT12-HS-13', 'CT12-HS-15']::text[]
where ma = 'CT12-HS-11' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Chia tử cho mẫu: phần đa thức bậc nhất chính là tiệm cận xiên.',
  vd = '{"de":"Tìm các tiệm cận của $y=\\dfrac{x^2+x+2}{x-1}$.","buoc":["Chia: $x^2+x+2=(x-1)(x+2)+4$","$y=x+2+\\dfrac{4}{x-1}$"],"kq":"Tiệm cận đứng $x=1$; tiệm cận xiên $y=x+2$."}'::jsonb, nham = '["Chia đa thức sai phần dư ⇒ sai hệ số tự do của tiệm cận xiên."]'::jsonb, bien = null, lq = array['CT12-HS-10', 'CT12-HS-16']::text[]
where ma = 'CT12-HS-12' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Đồ thị bậc ba và đồ thị phân thức đều có một tâm đối xứng.',
  vd = '{"de":"Tìm tâm đối xứng của đồ thị $y=x^3-3x^2+2$.","buoc":["$y''''=6x-6=0\\Leftrightarrow x=1$","$y(1)=0$"],"kq":"$I(1;0)$"}'::jsonb, nham = '["Lấy $x_0=-\\dfrac{b}{a}$ (thiếu số 3 ở mẫu)."]'::jsonb, bien = null, lq = array['CT12-HS-14', 'CT12-HS-11']::text[]
where ma = 'CT12-HS-13' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Nhìn dấu của $a$ (nhánh bên phải) và số cực trị để nhận dạng đồ thị bậc ba.',
  vd = '{"de":"Đồ thị bậc ba đi lên ở bên phải và có 2 điểm cực trị. Dấu của $a$ và $b^2-3ac$?","buoc":["Nhánh phải đi lên ⇒ $a>0$","Có 2 cực trị ⇒ $y''=0$ có 2 nghiệm phân biệt ⇒ $b^2-3ac>0$"],"kq":"$a>0$ và $b^2-3ac>0$"}'::jsonb, nham = '["Nhìn nhánh TRÁI để xét dấu $a$ — phải nhìn nhánh phải (khi $x\\to+\\infty$)."]'::jsonb, bien = null, lq = array['CT12-HS-05', 'CT12-HS-13']::text[]
where ma = 'CT12-HS-14' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Đồ thị hàm $y=\dfrac{ax+b}{cx+d}$ gồm 2 nhánh, cùng đi lên hoặc cùng đi xuống.',
  vd = '{"de":"Đồ thị $y=\\dfrac{x+1}{x-1}$ có hai nhánh đi lên hay đi xuống? Tâm đối xứng?","buoc":["$ad-bc=1\\cdot(-1)-1\\cdot 1=-2<0$"],"kq":"Hai nhánh đi xuống; tâm đối xứng $I(1;1)$."}'::jsonb, nham = '["Đọc ngược tọa độ tâm: $I\\left(-\\dfrac dc;\\ \\dfrac ac\\right)$ — hoành độ là tiệm cận đứng."]'::jsonb, bien = null, lq = array['CT12-HS-03', 'CT12-HS-11']::text[]
where ma = 'CT12-HS-15' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Đồ thị $y=\dfrac{ax^2+bx+c}{mx+n}$ có tiệm cận đứng và tiệm cận xiên, 2 nhánh đối xứng qua giao điểm của chúng.',
  vd = '{"de":"Đồ thị $y=\\dfrac{x^2+1}{x}$ có cực trị không?","buoc":["$y''=\\dfrac{x^2-1}{x^2}=0\\Leftrightarrow x=\\pm1$"],"kq":"Có 2 cực trị, tại $x=-1$ và $x=1$."}'::jsonb, nham = '["Xét dấu $y''$ mà quên điểm làm mẫu bằng 0 (không thuộc tập xác định)."]'::jsonb, bien = null, lq = array['CT12-HS-12']::text[]
where ma = 'CT12-HS-16' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Số giao điểm của hai đồ thị bằng số nghiệm của phương trình hoành độ giao điểm.',
  vd = '{"de":"Đồ thị $y=x^3-3x$ cắt trục hoành tại mấy điểm?","buoc":["$x^3-3x=0\\Leftrightarrow x(x^2-3)=0$","$x=0,\\ x=\\pm\\sqrt3$"],"kq":"3 giao điểm."}'::jsonb, nham = '["Đếm nghiệm kép thành 2 giao điểm — tiếp xúc vẫn chỉ là 1 điểm chung."]'::jsonb, bien = null, lq = array['CT12-HS-18']::text[]
where ma = 'CT12-HS-17' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Cô lập $m$ về một vế: số nghiệm = số giao điểm của đồ thị với đường thẳng nằm ngang $y=m$.',
  vd = '{"de":"Tìm $m$ để $x^3-3x=m$ có 3 nghiệm phân biệt.","buoc":["$f(x)=x^3-3x$ có cực đại $f(-1)=2$, cực tiểu $f(1)=-2$","$y=m$ cắt đồ thị tại 3 điểm khi nằm giữa hai giá trị cực trị"],"kq":"$-2<m<2$"}'::jsonb, nham = '["Chưa cô lập $m$ (còn $m$ dính với $x$) đã dùng đồ thị.","Lấy cả dấu $=$: khi $m=\\pm2$ phương trình chỉ có 2 nghiệm."]'::jsonb, bien = null, lq = array['CT12-HS-17', 'CT12-HS-04']::text[]
where ma = 'CT12-HS-18' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tổng ba vectơ cạnh xuất phát từ một đỉnh của hình hộp bằng vectơ đường chéo từ đỉnh đó.',
  vd = '{"de":"Hình hộp $ABCD.A''B''C''D''$. Rút gọn $\\overrightarrow{AB}+\\overrightarrow{AD}+\\overrightarrow{AA''}$.","buoc":["$\\overrightarrow{AB}+\\overrightarrow{AD}=\\overrightarrow{AC}$ (quy tắc hình bình hành)","$\\overrightarrow{AC}+\\overrightarrow{AA''}=\\overrightarrow{AC}+\\overrightarrow{CC''}=\\overrightarrow{AC''}$"],"kq":"$\\overrightarrow{AC''}$"}'::jsonb, nham = '["Ba vectơ phải CÙNG xuất phát từ một đỉnh mới cộng theo quy tắc hình hộp."]'::jsonb, bien = null, lq = array[]::text[]
where ma = 'CT12-VT-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích vô hướng là một SỐ, bằng tích hai độ dài nhân cosin góc giữa hai vectơ.',
  vd = '{"de":"$|\\vec a|=2,\\ |\\vec b|=3,\\ (\\vec a,\\vec b)=60^\\circ$. Tính $\\vec a\\cdot\\vec b$.","buoc":["$\\vec a\\cdot\\vec b=2\\cdot 3\\cdot\\cos 60^\\circ$"],"kq":"$3$"}'::jsonb, nham = '["Góc giữa hai vectơ phải đặt CHUNG GỐC; góc nằm trong $[0^\\circ;180^\\circ]$ (có thể tù)."]'::jsonb, bien = null, lq = array['CT12-VT-07']::text[]
where ma = 'CT12-VT-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Mỗi điểm, mỗi vectơ trong không gian ứng với đúng một bộ ba số $(x;y;z)$.',
  vd = '{"de":"Cho $\\vec u=2\\vec i-\\vec j+3\\vec k$. Tìm tọa độ $\\vec u$.","kq":"$\\vec u=(2;-1;3)$"}'::jsonb, nham = '["Bỏ sót thành phần bằng 0: $\\vec u=2\\vec i+3\\vec k$ thì $\\vec u=(2;0;3)$, không phải $(2;3)$."]'::jsonb, bien = null, lq = array['CT12-VT-04', 'CT12-VT-09']::text[]
where ma = 'CT12-VT-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Cộng, trừ, nhân số với vectơ: làm riêng trên từng tọa độ.',
  vd = '{"de":"$\\vec a=(1;2;-1),\\ \\vec b=(3;0;2)$. Tính $2\\vec a-\\vec b$.","buoc":["$2\\vec a=(2;4;-2)$"],"kq":"$2\\vec a-\\vec b=(-1;4;-4)$"}'::jsonb, nham = '["Nhân hệ số vào 1–2 tọa độ mà quên tọa độ còn lại."]'::jsonb, bien = null, lq = array['CT12-VT-05']::text[]
where ma = 'CT12-VT-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tọa độ vectơ $\overrightarrow{AB}$ = tọa độ điểm CUỐI trừ điểm ĐẦU; độ dài là căn tổng bình phương.',
  vd = '{"de":"$A(1;2;3),\\ B(3;0;4)$. Tính độ dài $AB$.","buoc":["$\\overrightarrow{AB}=(2;-2;1)$"],"kq":"$AB=\\sqrt{4+4+1}=3$"}'::jsonb, nham = '["Lấy tọa độ đầu trừ tọa độ cuối — $\\overrightarrow{AB}$ là CUỐI trừ ĐẦU."]'::jsonb, bien = null, lq = array['CT12-VT-06']::text[]
where ma = 'CT12-VT-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Trung điểm: trung bình cộng tọa độ 2 điểm; trọng tâm: trung bình cộng tọa độ 3 đỉnh.',
  vd = '{"de":"$A(1;0;2),\\ B(3;2;0),\\ C(2;4;1)$. Tìm trọng tâm $G$ của tam giác $ABC$.","buoc":["$x_G=\\dfrac{1+3+2}{3}=2,\\ y_G=\\dfrac{0+2+4}{3}=2,\\ z_G=\\dfrac{2+0+1}{3}=1$"],"kq":"$G(2;2;1)$"}'::jsonb, nham = '["Chia 2 (công thức trung điểm) khi tính trọng tâm — trọng tâm chia 3."]'::jsonb, bien = null, lq = array['CT12-VT-05']::text[]
where ma = 'CT12-VT-06' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích vô hướng theo tọa độ: nhân từng cặp tọa độ rồi cộng lại; dùng để tính góc và xét vuông góc.',
  vd = '{"de":"$\\vec a=(1;2;2),\\ \\vec b=(2;-1;2)$. Tính góc giữa hai vectơ.","buoc":["$\\vec a\\cdot\\vec b=2-2+4=4$","$|\\vec a|=3,\\ |\\vec b|=3$","$\\cos(\\vec a,\\vec b)=\\dfrac49$"],"kq":"$(\\vec a,\\vec b)\\approx 63{,}6^\\circ$"}'::jsonb, nham = '["Lấy trị tuyệt đối như góc giữa hai ĐƯỜNG THẲNG — góc giữa hai VECTƠ có thể tù."]'::jsonb, bien = null, lq = array['CT12-VT-02', 'CT12-OX-13']::text[]
where ma = 'CT12-VT-07' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hai vectơ cùng phương khi vectơ này bằng $k$ lần vectơ kia.',
  vd = '{"de":"$\\vec a=(2;-4;6)$ và $\\vec b=(1;-2;3)$ có cùng phương không?","kq":"Có, vì $\\vec a=2\\vec b$."}'::jsonb, nham = '["Dùng dạng tỉ số khi có tọa độ bằng 0 (chia cho 0) — khi đó kiểm tra trực tiếp $\\vec a=k\\vec b$."]'::jsonb, bien = null, lq = array['CT12-VT-10']::text[]
where ma = 'CT12-VT-08' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Chiếu lên trục: giữ 1 tọa độ; chiếu lên mặt phẳng tọa độ: giữ 2 tọa độ, tọa độ còn lại bằng 0.',
  vd = '{"de":"$M(2;-3;5)$. Tìm hình chiếu của $M$ lên trục $Oy$ và lên mặt phẳng $(Oxz)$.","kq":"Lên $Oy$: $(0;-3;0)$; lên $(Oxz)$: $(2;0;5)$."}'::jsonb, nham = '["Nhầm \"chiếu lên trục\" với \"chiếu lên mặt phẳng tọa độ\"."]'::jsonb, bien = null, lq = array['CT12-VT-03']::text[]
where ma = 'CT12-VT-09' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích có hướng của hai vectơ là một VECTƠ vuông góc với cả hai.',
  vd = '{"de":"$\\vec a=(1;2;3),\\ \\vec b=(2;0;1)$. Tính $[\\vec a,\\vec b]$.","buoc":["Thành phần 1: $2\\cdot 1-3\\cdot 0=2$","Thành phần 2: $3\\cdot 2-1\\cdot 1=5$","Thành phần 3: $1\\cdot 0-2\\cdot 2=-4$"],"kq":"$[\\vec a,\\vec b]=(2;5;-4)$"}'::jsonb, nham = '["Sai dấu thành phần thứ hai: đúng là $a_3b_1-a_1b_3$, không phải $a_1b_3-a_3b_1$."]'::jsonb, bien = null, lq = array['CT12-VT-11', 'CT12-OX-02']::text[]
where ma = 'CT12-VT-10' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Độ lớn tích có hướng cho diện tích; tích hỗn tạp cho thể tích và xét đồng phẳng.',
  vd = '{"de":"$A(0;0;0),\\ B(1;0;0),\\ C(0;2;0),\\ D(0;0;3)$. Tính thể tích tứ diện $ABCD$.","buoc":["$[\\overrightarrow{AB},\\overrightarrow{AC}]=(0;0;2)$","$[\\overrightarrow{AB},\\overrightarrow{AC}]\\cdot\\overrightarrow{AD}=6$"],"kq":"$V=\\dfrac16\\cdot 6=1$"}'::jsonb, nham = '["Quên hệ số $\\dfrac16$ (tứ diện) hoặc $\\dfrac12$ (tam giác).","Quên trị tuyệt đối ⇒ ra thể tích âm."]'::jsonb, bien = null, lq = array['CT12-VT-10']::text[]
where ma = 'CT12-VT-11' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Khoảng biến thiên đo độ trải rộng của cả mẫu: từ đầu nhóm đầu tới cuối nhóm cuối.',
  vd = '{"de":"Mẫu ghép nhóm có các nhóm $[40;45),\\ [45;50),\\ [50;55),\\ [55;60)$. Tính khoảng biến thiên.","kq":"$R=60-40=20$"}'::jsonb, nham = '["Lấy hiệu GIÁ TRỊ ĐẠI DIỆN (trung điểm) của nhóm cuối và nhóm đầu."]'::jsonb, bien = null, lq = array['CT12-TK-03']::text[]
where ma = 'CT12-TK-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tìm nhóm chứa tứ phân vị rồi nội suy tuyến tính bên trong nhóm đó.',
  vd = '{"de":"Nhóm $[0;10),\\ [10;20),\\ [20;30),\\ [30;40)$ có tần số $8,\\ 12,\\ 14,\\ 6$ ($n=40$). Tính $Q_1$.","buoc":["$\\dfrac n4=10$; tần số tích lũy $8,\\ 20,\\dots$ ⇒ $Q_1$ thuộc nhóm $[10;20)$","$C=8,\\ m_p=12$"],"kq":"$Q_1=10+\\dfrac{10-8}{12}\\cdot 10=\\dfrac{35}{3}\\approx 11{,}67$"}'::jsonb, nham = '["Lấy $C$ đã cộng cả tần số của nhóm chứa $Q$ — $C$ chỉ là tổng các nhóm đứng TRƯỚC.","Nhân với độ dài sai nhóm."]'::jsonb, bien = '[["$n$","cỡ mẫu"],["$[a_p;a_{p+1})$","nhóm chứa tứ phân vị"],["$m_p$","tần số của nhóm đó"],["$C$","tổng tần số các nhóm đứng TRƯỚC nhóm đó"]]'::jsonb, lq = array['CT12-TK-03']::text[]
where ma = 'CT12-TK-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Khoảng tứ phân vị đo độ trải rộng của nửa giữa mẫu số liệu.',
  vd = '{"de":"Mẫu: nhóm $[0;10),\\ [10;20),\\ [20;30),\\ [30;40)$, tần số $8,\\ 12,\\ 14,\\ 6$. Tính $\\Delta_Q$.","buoc":["$Q_1=\\dfrac{35}{3}$ (xem thẻ Tứ phân vị)","$\\dfrac{3n}{4}=30$ ⇒ $Q_3$ thuộc $[20;30)$: $Q_3=20+\\dfrac{30-20}{14}\\cdot 10=\\dfrac{190}{7}$"],"kq":"$\\Delta_Q=\\dfrac{190}{7}-\\dfrac{35}{3}=\\dfrac{325}{21}\\approx 15{,}48$"}'::jsonb, nham = '["Lấy $Q_3-Q_1$ từ giá trị đại diện thay vì tính $Q_1, Q_3$ bằng công thức nội suy."]'::jsonb, bien = null, lq = array['CT12-TK-02', 'CT12-TK-01']::text[]
where ma = 'CT12-TK-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Thay mỗi nhóm bằng giá trị đại diện (trung điểm) rồi lấy trung bình có trọng số theo tần số.',
  vd = '{"de":"Nhóm $[0;10),\\ [10;20),\\ [20;30)$ có tần số $2,\\ 5,\\ 3$. Tính số trung bình.","buoc":["Giá trị đại diện: $5,\\ 15,\\ 25$"],"kq":"$\\overline{x}=\\dfrac{2\\cdot 5+5\\cdot 15+3\\cdot 25}{10}=16$"}'::jsonb, nham = '["Dùng đầu mút của nhóm thay cho trung điểm."]'::jsonb, bien = '[["$c_i$","giá trị đại diện (trung điểm) nhóm $i$"],["$m_i$","tần số nhóm $i$"],["$n$","cỡ mẫu"]]'::jsonb, lq = array['CT12-TK-05']::text[]
where ma = 'CT12-TK-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Phương sai đo độ phân tán quanh số trung bình.',
  vd = '{"de":"Nhóm $[0;10),\\ [10;20),\\ [20;30)$, tần số $2,\\ 5,\\ 3$ ($\\overline{x}=16$). Tính phương sai.","buoc":["$\\dfrac{2\\cdot 25+5\\cdot 225+3\\cdot 625}{10}=305$"],"kq":"$s^2=305-16^2=49$"}'::jsonb, nham = '["Quên trừ $\\overline{x}^2$, hoặc trừ $\\overline{x}$ chưa bình phương."]'::jsonb, bien = '[["$c_i$","giá trị đại diện nhóm $i$"],["$m_i$","tần số nhóm $i$"],["$\\overline{x}$","số trung bình"]]'::jsonb, lq = array['CT12-TK-04', 'CT12-TK-06']::text[]
where ma = 'CT12-TK-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Độ lệch chuẩn là căn bậc hai của phương sai, cùng đơn vị với dữ liệu.',
  vd = '{"de":"Mẫu ở thẻ Phương sai có $s^2=49$. Tính độ lệch chuẩn.","kq":"$s=\\sqrt{49}=7$"}'::jsonb, nham = '["Ghi phương sai thay cho độ lệch chuẩn (quên lấy căn)."]'::jsonb, bien = null, lq = array['CT12-TK-05']::text[]
where ma = 'CT12-TK-06' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Nguyên hàm là phép ngược của đạo hàm; các nguyên hàm của một hàm chỉ khác nhau hằng số $C$.',
  vd = '{"de":"Chứng tỏ $F(x)=x^3+2$ là một nguyên hàm của $f(x)=3x^2$.","kq":"$F''(x)=3x^2=f(x)$."}'::jsonb, nham = '["Quên $+C$ khi viết họ nguyên hàm."]'::jsonb, bien = null, lq = array['CT12-NH-03']::text[]
where ma = 'CT12-NH-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Nguyên hàm tách được qua phép cộng, trừ và đưa hằng số ra ngoài.',
  vd = '{"de":"Tính $\\displaystyle\\int(2x+\\cos x)\\,dx$.","kq":"$x^2+\\sin x+C$"}'::jsonb, nham = '["Dùng \"nguyên hàm của tích bằng tích các nguyên hàm\" — không có tính chất đó."]'::jsonb, bien = null, lq = array['CT12-NH-03']::text[]
where ma = 'CT12-NH-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Bảng nguyên hàm của các hàm sơ cấp thường gặp — học thuộc để tính nhanh.',
  vd = '{"de":"Tính $\\displaystyle\\int\\left(x^2+\\dfrac1x+e^x\\right)dx$.","kq":"$\\dfrac{x^3}{3}+\\ln|x|+e^x+C$"}'::jsonb, nham = '["$\\displaystyle\\int\\sin x\\,dx=\\cos x$ — sai dấu, đúng là $-\\cos x+C$.","Quên trị tuyệt đối trong $\\ln|x|$."]'::jsonb, bien = null, lq = array['CT12-NH-04', 'CT12-NH-02']::text[]
where ma = 'CT12-NH-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Thay $x$ bằng $ax+b$ trong bảng nguyên hàm rồi nhân thêm $\dfrac1a$.',
  vd = '{"de":"Tính $\\displaystyle\\int e^{2x+1}\\,dx$.","kq":"$\\dfrac12e^{2x+1}+C$"}'::jsonb, nham = '["Quên nhân $\\dfrac1a$."]'::jsonb, bien = null, lq = array['CT12-NH-03']::text[]
where ma = 'CT12-NH-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích phân = hiệu giá trị một nguyên hàm tại cận trên và cận dưới.',
  vd = '{"de":"Tính $\\displaystyle\\int_1^2 2x\\,dx$.","kq":"$x^2\\Big|_1^2=4-1=3$"}'::jsonb, nham = '["Tính $F(a)-F(b)$ (ngược thứ tự cận)."]'::jsonb, bien = null, lq = array['CT12-NH-06']::text[]
where ma = 'CT12-NH-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích phân cộng được theo cận và đổi dấu khi đảo cận.',
  vd = '{"de":"Biết $\\displaystyle\\int_0^2 f(x)\\,dx=3$ và $\\displaystyle\\int_2^5 f(x)\\,dx=4$. Tính $\\displaystyle\\int_0^5 f(x)\\,dx$.","kq":"$3+4=7$"}'::jsonb, nham = '["Đảo cận mà quên đổi dấu."]'::jsonb, bien = null, lq = array['CT12-NH-05']::text[]
where ma = 'CT12-NH-06' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Diện tích giữa đồ thị và trục hoành là tích phân của TRỊ TUYỆT ĐỐI hàm số.',
  vd = '{"de":"Tính diện tích hình phẳng giới hạn bởi $y=x^2-1$, trục hoành, $x=0$, $x=2$.","buoc":["$x^2-1$ đổi dấu tại $x=1$","$S=\\displaystyle\\int_0^1(1-x^2)\\,dx+\\int_1^2(x^2-1)\\,dx=\\dfrac23+\\dfrac43$"],"kq":"$S=2$"}'::jsonb, nham = '["Bỏ trị tuyệt đối: $\\displaystyle\\int_0^2(x^2-1)\\,dx=\\dfrac23$ — sai vì hàm đổi dấu trên đoạn."]'::jsonb, bien = null, lq = array['CT12-NH-08']::text[]
where ma = 'CT12-NH-07' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Diện tích giữa hai đồ thị là tích phân trị tuyệt đối của hiệu hai hàm.',
  vd = '{"de":"Tính diện tích hình phẳng giới hạn bởi $y=x^2$ và $y=x$.","buoc":["Giao điểm: $x^2=x\\Leftrightarrow x=0$ hoặc $x=1$","$S=\\displaystyle\\int_0^1|x-x^2|\\,dx=\\dfrac12-\\dfrac13$"],"kq":"$S=\\dfrac16$"}'::jsonb, nham = '["Đề không cho $x=a,\\ x=b$ mà quên giải phương trình hoành độ giao điểm để tìm cận."]'::jsonb, bien = null, lq = array['CT12-NH-07']::text[]
where ma = 'CT12-NH-08' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Thể tích vật thể = tích phân diện tích thiết diện vuông góc với trục.',
  vd = '{"de":"Vật thể nằm giữa $x=0$ và $x=2$; thiết diện vuông góc với $Ox$ tại $x$ là hình vuông cạnh $x$. Tính thể tích.","buoc":["$S(x)=x^2$"],"kq":"$V=\\displaystyle\\int_0^2x^2\\,dx=\\dfrac83$"}'::jsonb, nham = '["Dùng $\\pi\\displaystyle\\int f^2(x)\\,dx$ cho vật thể không phải khối tròn xoay."]'::jsonb, bien = null, lq = array['CT12-NH-10']::text[]
where ma = 'CT12-NH-09' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Quay quanh $Ox$: mỗi thiết diện là hình tròn bán kính $|f(x)|$.',
  vd = '{"de":"Quay hình phẳng giới hạn bởi $y=\\sqrt x$, trục $Ox$, $x=0$, $x=4$ quanh $Ox$. Tính thể tích.","kq":"$V=\\pi\\displaystyle\\int_0^4 x\\,dx=8\\pi$"}'::jsonb, nham = '["Quên $\\pi$ hoặc quên bình phương $f(x)$."]'::jsonb, bien = null, lq = array['CT12-NH-09']::text[]
where ma = 'CT12-NH-10' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tích phân của tốc độ thay đổi cho lượng thay đổi — vd tích phân vận tốc cho quãng đường.',
  vd = '{"de":"Vật chuyển động với vận tốc $v(t)=3t^2$ (m/s). Tính quãng đường từ $t=0$ đến $t=2$ (s).","kq":"$s=\\displaystyle\\int_0^2 3t^2\\,dt=8$ (m)"}'::jsonb, nham = '["Lấy $v(2)\\times 2$ — chỉ đúng khi vận tốc không đổi."]'::jsonb, bien = null, lq = array[]::text[]
where ma = 'CT12-NH-11' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Tách biểu thức thành $u\,dv$, chuyển việc tính về $\int v\,du$ dễ hơn.',
  vd = '{"de":"Tính $\\displaystyle\\int_0^1 xe^x\\,dx$.","buoc":["Đặt $u=x,\\ dv=e^x dx$ ⇒ $du=dx,\\ v=e^x$","$=xe^x\\Big|_0^1-\\displaystyle\\int_0^1 e^x\\,dx=e-(e-1)$"],"kq":"$1$"}'::jsonb, nham = '["Đặt $u=e^x$ ⇒ tích phân mới còn khó hơn."]'::jsonb, bien = null, lq = array['CT12-NH-13']::text[]
where ma = 'CT12-NH-12' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Đặt biến mới để đưa tích phân về dạng có trong bảng — nhớ đổi cả cận.',
  vd = '{"de":"Tính $\\displaystyle\\int_0^1 2x(x^2+1)^3\\,dx$.","buoc":["Đặt $t=x^2+1$ ⇒ $dt=2x\\,dx$; $x=0\\to t=1,\\ x=1\\to t=2$","$=\\displaystyle\\int_1^2 t^3\\,dt=\\dfrac{t^4}{4}\\Big|_1^2$"],"kq":"$\\dfrac{15}{4}$"}'::jsonb, nham = '["Đổi biến mà quên đổi cận."]'::jsonb, bien = null, lq = array['CT12-NH-12']::text[]
where ma = 'CT12-NH-13' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Viết phương trình mặt phẳng cần 1 điểm đi qua và 1 vectơ pháp tuyến.',
  vd = '{"de":"Viết phương trình mặt phẳng qua $M(1;2;-1)$, có VTPT $\\vec n=(2;-1;3)$.","buoc":["$2(x-1)-(y-2)+3(z+1)=0$"],"kq":"$2x-y+3z+3=0$"}'::jsonb, nham = '["Nhầm VTPT (vuông góc mặt phẳng) với VTCP (nằm trong mặt phẳng).","Sai dấu khi thay tọa độ âm: $z-(-1)=z+1$."]'::jsonb, bien = null, lq = array['CT12-OX-02', 'CT12-OX-03']::text[]
where ma = 'CT12-OX-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Biết hai vectơ nằm trong mặt phẳng (không cùng phương) thì VTPT là tích có hướng của chúng.',
  vd = '{"de":"Viết phương trình mặt phẳng qua $O$, có cặp VTCP $\\vec a=(1;0;1),\\ \\vec b=(0;1;1)$.","buoc":["$\\vec n=[\\vec a,\\vec b]=(-1;-1;1)$"],"kq":"$x+y-z=0$"}'::jsonb, nham = '["Lấy $\\vec a+\\vec b$ làm VTPT."]'::jsonb, bien = null, lq = array['CT12-VT-10', 'CT12-OX-03']::text[]
where ma = 'CT12-OX-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Mặt phẳng qua 3 điểm: VTPT là tích có hướng của hai vectơ nối các điểm.',
  vd = '{"de":"Viết phương trình mặt phẳng qua $A(1;0;0),\\ B(0;2;0),\\ C(0;0;3)$.","buoc":["$\\overrightarrow{AB}=(-1;2;0),\\ \\overrightarrow{AC}=(-1;0;3)$","$\\vec n=[\\overrightarrow{AB},\\overrightarrow{AC}]=(6;3;2)$"],"kq":"$6x+3y+2z-6=0$"}'::jsonb, nham = '["Ba điểm thẳng hàng thì không xác định được mặt phẳng (tích có hướng bằng $\\vec 0$)."]'::jsonb, bien = null, lq = array['CT12-OX-04', 'CT12-OX-02']::text[]
where ma = 'CT12-OX-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Mặt phẳng cắt ba trục tọa độ tại ba điểm khác gốc: viết nhanh bằng đoạn chắn.',
  vd = '{"de":"Mặt phẳng cắt các trục tại $A(2;0;0),\\ B(0;-1;0),\\ C(0;0;4)$.","kq":"$\\dfrac x2-y+\\dfrac z4=1$"}'::jsonb, nham = '["Dùng dạng đoạn chắn khi mặt phẳng đi qua gốc tọa độ — khi đó không có đoạn chắn."]'::jsonb, bien = null, lq = array['CT12-OX-03']::text[]
where ma = 'CT12-OX-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Mặt phẳng tọa độ THIẾU biến nào thì biến đó bằng 0.',
  vd = '{"de":"Phương trình mặt phẳng $(Oxz)$ và một VTPT của nó?","kq":"$y=0$; VTPT $\\vec j=(0;1;0)$."}'::jsonb, nham = '["Viết $(Oxy)$ là $x=0$ — đúng là $z=0$."]'::jsonb, bien = null, lq = array[]::text[]
where ma = 'CT12-OX-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Song song: dùng chung VTPT. Mặt phẳng trung trực: qua trung điểm, VTPT là vectơ nối hai điểm.',
  vd = '{"de":"Viết phương trình mặt phẳng trung trực của $AB$ với $A(1;2;3),\\ B(3;0;1)$.","buoc":["Trung điểm $I(2;1;2)$; $\\overrightarrow{AB}=(2;-2;-2)$","$2(x-2)-2(y-1)-2(z-2)=0$"],"kq":"$x-y-z+1=0$"}'::jsonb, nham = '["Lấy $A$ (thay vì trung điểm $I$) làm điểm đi qua."]'::jsonb, bien = null, lq = array['CT12-OX-01', 'CT12-VT-06']::text[]
where ma = 'CT12-OX-06' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'So tỉ số các hệ số $A, B, C$ (và $D$) để biết hai mặt phẳng song song, trùng hay cắt nhau.',
  vd = '{"de":"$(P): x+2y-z+1=0$ và $(Q): 2x+4y-2z+5=0$. Xét vị trí tương đối.","buoc":["$\\dfrac12=\\dfrac24=\\dfrac{-1}{-2}\\ne\\dfrac15$"],"kq":"$(P)\\parallel(Q)$"}'::jsonb, nham = '["So tỉ số $A,B,C$ mà quên so $D$ ⇒ nhầm song song với trùng nhau."]'::jsonb, bien = null, lq = array['CT12-OX-17']::text[]
where ma = 'CT12-OX-07' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Phương trình tham số: điểm đi qua + $t$ lần vectơ chỉ phương.',
  vd = '{"de":"Viết phương trình tham số của đường thẳng qua $A(1;-1;2)$, VTCP $\\vec u=(2;1;-3)$.","kq":"$\\begin{cases} x=1+2t \\\\ y=-1+t \\\\ z=2-3t \\end{cases}$"}'::jsonb, nham = '["Đảo vai trò: lấy tọa độ điểm làm hệ số của $t$."]'::jsonb, bien = null, lq = array['CT12-OX-09', 'CT12-OX-10']::text[]
where ma = 'CT12-OX-08' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Phương trình chính tắc: ba tỉ số bằng nhau, mẫu là tọa độ VTCP.',
  vd = '{"de":"Viết phương trình chính tắc của đường thẳng qua $A(1;0;-2)$, VTCP $(3;-1;2)$.","kq":"$\\dfrac{x-1}{3}=\\dfrac{y}{-1}=\\dfrac{z+2}{2}$"}'::jsonb, nham = '["Viết dạng chính tắc khi VTCP có tọa độ bằng 0 (mẫu bằng 0)."]'::jsonb, bien = null, lq = array['CT12-OX-08']::text[]
where ma = 'CT12-OX-09' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Đường thẳng vuông góc mặt phẳng nhận VTPT của mặt phẳng làm VTCP.',
  vd = '{"de":"Viết phương trình đường thẳng qua $A(1;2;3)$ và vuông góc với $(P): 2x-y+z-1=0$.","kq":"$\\begin{cases} x=1+2t \\\\ y=2-t \\\\ z=3+t \\end{cases}$"}'::jsonb, nham = '["Lấy một vectơ nằm trong $(P)$ làm VTCP."]'::jsonb, bien = null, lq = array['CT12-OX-08', 'CT12-OX-20']::text[]
where ma = 'CT12-OX-10' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Thay phương trình tham số vào mặt phẳng: số nghiệm $t$ cho vị trí tương đối.',
  vd = '{"de":"$d: x=1+t,\\ y=2t,\\ z=3-t$ và $(P): x+y+z-6=0$. Tìm giao điểm.","buoc":["$(1+t)+2t+(3-t)-6=0\\Leftrightarrow 2t-2=0\\Leftrightarrow t=1$"],"kq":"$d$ cắt $(P)$ tại $(2;2;2)$."}'::jsonb, nham = '["Thấy $\\vec u\\cdot\\vec n=0$ rồi kết luận song song — còn có thể nằm trong mặt phẳng, phải thử thêm 1 điểm."]'::jsonb, bien = null, lq = array['CT12-OX-14']::text[]
where ma = 'CT12-OX-11' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Dùng tích có hướng của hai VTCP và vectơ nối hai điểm để phân biệt song song, cắt nhau, chéo nhau.',
  vd = '{"de":"$d_1$ qua $A(0;0;0)$, VTCP $(1;0;0)$; $d_2$ qua $B(0;1;1)$, VTCP $(0;1;0)$. Xét vị trí tương đối.","buoc":["$[\\vec u_1,\\vec u_2]=(0;0;1)$","$\\overrightarrow{AB}=(0;1;1)$; $[\\vec u_1,\\vec u_2]\\cdot\\overrightarrow{AB}=1\\ne 0$"],"kq":"Chéo nhau."}'::jsonb, nham = '["Thấy hai VTCP không cùng phương rồi kết luận \"cắt nhau\" — còn có thể chéo nhau."]'::jsonb, bien = null, lq = array['CT12-OX-19', 'CT12-VT-10']::text[]
where ma = 'CT12-OX-12' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Góc giữa hai đường thẳng tính qua góc giữa hai VTCP, luôn lấy trị tuyệt đối.',
  vd = '{"de":"Tính góc giữa hai đường thẳng có VTCP $\\vec u_1=(1;1;0),\\ \\vec u_2=(0;1;1)$.","buoc":["$\\cos=\\dfrac{|0+1+0|}{\\sqrt2\\cdot\\sqrt2}=\\dfrac12$"],"kq":"$60^\\circ$"}'::jsonb, nham = '["Bỏ trị tuyệt đối ⇒ ra góc tù."]'::jsonb, bien = null, lq = array['CT12-OX-14', 'CT12-OX-15', 'CT12-VT-07']::text[]
where ma = 'CT12-OX-13' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Góc giữa đường thẳng và mặt phẳng dùng SIN, vì VTPT vuông góc với mặt phẳng.',
  vd = '{"de":"Đường thẳng có VTCP $\\vec u=(1;0;1)$, mặt phẳng có VTPT $\\vec n=(0;0;1)$. Tính góc giữa chúng.","buoc":["$\\sin\\varphi=\\dfrac{|1|}{\\sqrt2\\cdot 1}=\\dfrac{\\sqrt2}{2}$"],"kq":"$\\varphi=45^\\circ$"}'::jsonb, nham = '["Dùng $\\cos$ thay cho $\\sin$ ⇒ ra góc phụ ($90^\\circ-\\varphi$)."]'::jsonb, bien = null, lq = array['CT12-OX-13', 'CT12-OX-15']::text[]
where ma = 'CT12-OX-14' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Góc giữa hai mặt phẳng tính qua góc giữa hai VTPT, luôn lấy trị tuyệt đối.',
  vd = '{"de":"Tính góc giữa $(P): x-y+1=0$ và $(Q): x-3=0$.","buoc":["$\\vec n_P=(1;-1;0),\\ \\vec n_Q=(1;0;0)$","$\\cos=\\dfrac{|1|}{\\sqrt2\\cdot 1}=\\dfrac{\\sqrt2}{2}$"],"kq":"$45^\\circ$"}'::jsonb, nham = '["Góc giữa hai mặt phẳng không vượt quá $90^\\circ$ — phải lấy trị tuyệt đối."]'::jsonb, bien = null, lq = array['CT12-OX-13', 'CT12-OX-14']::text[]
where ma = 'CT12-OX-15' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Thay tọa độ điểm vào vế trái phương trình mặt phẳng, lấy trị tuyệt đối, chia độ dài VTPT.',
  vd = '{"de":"Tính khoảng cách từ $M(1;2;3)$ đến $(P): 2x-y+2z-3=0$.","buoc":["$d=\\dfrac{|2-2+6-3|}{\\sqrt{4+1+4}}$"],"kq":"$d=1$"}'::jsonb, nham = '["Quên trị tuyệt đối ở tử hoặc quên lấy căn ở mẫu."]'::jsonb, bien = null, lq = array['CT12-OX-17', 'CT12-OX-20']::text[]
where ma = 'CT12-OX-16' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Khoảng cách giữa hai mặt phẳng song song = khoảng cách từ một điểm của mặt này đến mặt kia.',
  vd = '{"de":"Tính khoảng cách giữa $(P): x+2y+2z-1=0$ và $(Q): x+2y+2z+8=0$.","kq":"$d=\\dfrac{|-1-8|}{\\sqrt{1+4+4}}=3$"}'::jsonb, nham = '["Dùng công thức $|D_1-D_2|$ khi hệ số $A,B,C$ hai mặt chưa giống hệt (vd $2x+4y+4z+16=0$ phải chia 2 trước)."]'::jsonb, bien = null, lq = array['CT12-OX-16', 'CT12-OX-07']::text[]
where ma = 'CT12-OX-17' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Khoảng cách từ điểm đến đường thẳng = độ lớn tích có hướng chia độ dài VTCP.',
  vd = '{"de":"Tính khoảng cách từ $M(1;1;1)$ đến trục $Ox$ (qua $O$, VTCP $\\vec u=(1;0;0)$).","buoc":["$\\overrightarrow{OM}=(1;1;1)$, $[\\overrightarrow{OM},\\vec u]=(0;1;-1)$"],"kq":"$d=\\dfrac{\\sqrt2}{1}=\\sqrt2$"}'::jsonb, nham = '["Chia cho $|\\overrightarrow{M_0M}|$ thay vì $|\\vec u|$."]'::jsonb, bien = null, lq = array['CT12-OX-19']::text[]
where ma = 'CT12-OX-18' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Khoảng cách giữa hai đường thẳng chéo nhau = |tích hỗn tạp| chia độ lớn tích có hướng hai VTCP.',
  vd = '{"de":"$d_1$ qua $O$, VTCP $(1;0;0)$; $d_2$ qua $B(0;1;1)$, VTCP $(0;1;0)$. Tính khoảng cách.","buoc":["$[\\vec u_1,\\vec u_2]=(0;0;1)$, $\\overrightarrow{OB}=(0;1;1)$"],"kq":"$d=\\dfrac{|0+0+1|}{1}=1$"}'::jsonb, nham = '["Quên trị tuyệt đối ở tử."]'::jsonb, bien = null, lq = array['CT12-OX-12', 'CT12-OX-18']::text[]
where ma = 'CT12-OX-19' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hình chiếu của điểm lên mặt phẳng = giao của mặt phẳng với đường thẳng vuông góc qua điểm đó.',
  vd = '{"de":"Tìm hình chiếu của $M(1;2;3)$ lên $(P): x+y+z-3=0$ và điểm đối xứng của $M$ qua $(P)$.","buoc":["$d$ qua $M$, VTCP $(1;1;1)$: $x=1+t,\\ y=2+t,\\ z=3+t$","$(1+t)+(2+t)+(3+t)-3=0\\Leftrightarrow t=-1$"],"kq":"$H(0;1;2)$; điểm đối xứng $M''(-1;0;1)$."}'::jsonb, nham = '["Lấy $M''=H-M$ — đúng là $M''=2H-M$ (vì $H$ là trung điểm $MM''$)."]'::jsonb, bien = null, lq = array['CT12-OX-10', 'CT12-OX-16']::text[]
where ma = 'CT12-OX-20' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Viết phương trình mặt cầu cần tâm và bán kính.',
  vd = '{"de":"Viết phương trình mặt cầu tâm $I(1;-2;0)$, bán kính $3$.","kq":"$(x-1)^2+(y+2)^2+z^2=9$"}'::jsonb, nham = '["Viết $R$ thay vì $R^2$ ở vế phải."]'::jsonb, bien = null, lq = array['CT12-OX-22', 'CT12-OX-23']::text[]
where ma = 'CT12-OX-21' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Từ dạng khai triển: tâm lấy từ hệ số bậc nhất (đổi dấu, chia 2), bán kính tính bằng căn.',
  vd = '{"de":"Tìm tâm và bán kính mặt cầu $x^2+y^2+z^2-2x+4y-6z+5=0$.","buoc":["$a=1,\\ b=-2,\\ c=3,\\ d=5$"],"kq":"Tâm $I(1;-2;3)$, $R=\\sqrt{1+4+9-5}=3$."}'::jsonb, nham = '["Lấy tâm cùng dấu với hệ số (tâm là $(1;-2;3)$, không phải $(-1;2;-3)$).","Quên kiểm tra $a^2+b^2+c^2-d>0$."]'::jsonb, bien = null, lq = array['CT12-OX-21']::text[]
where ma = 'CT12-OX-22' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Ba cách hay gặp để có tâm và bán kính: đường kính, đi qua một điểm, tiếp xúc mặt phẳng.',
  vd = '{"de":"Viết phương trình mặt cầu đường kính $AB$ với $A(1;0;2),\\ B(3;4;2)$.","buoc":["Tâm $I(2;2;2)$","$R=\\dfrac{AB}{2}=\\dfrac{\\sqrt{4+16+0}}{2}=\\sqrt5$"],"kq":"$(x-2)^2+(y-2)^2+(z-2)^2=5$"}'::jsonb, nham = '["Lấy $R=AB$ (quên chia 2)."]'::jsonb, bien = null, lq = array['CT12-OX-21', 'CT12-OX-16']::text[]
where ma = 'CT12-OX-23' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'So khoảng cách từ tâm đến mặt phẳng với bán kính để biết mặt phẳng cắt, tiếp xúc hay không cắt mặt cầu.',
  vd = '{"de":"Mặt cầu tâm $O$, bán kính $5$ và mặt phẳng $(P): z=3$. Xét vị trí tương đối.","buoc":["$d(O,(P))=3<5$"],"kq":"Cắt nhau theo đường tròn bán kính $r=\\sqrt{25-9}=4$."}'::jsonb, nham = '["Tính $r=R-d$ thay vì $r=\\sqrt{R^2-d^2}$."]'::jsonb, bien = null, lq = array['CT12-OX-16', 'CT12-OX-21']::text[]
where ma = 'CT12-OX-24' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Xác suất của A khi đã biết B xảy ra: thu hẹp không gian mẫu về B.',
  vd = '{"de":"Gieo một con xúc xắc. Biết đã ra mặt chẵn, tính xác suất ra mặt 6.","buoc":["$B$ = \"mặt chẵn\": $n(B)=3$; $A\\cap B=\\{6\\}$"],"kq":"$P(A\\mid B)=\\dfrac13$"}'::jsonb, nham = '["Nhầm $P(A\\mid B)$ với $P(B\\mid A)$.","Chia cho $n(\\Omega)$ thay vì $n(B)$."]'::jsonb, bien = null, lq = array['CT12-XS-02', 'CT12-XS-04']::text[]
where ma = 'CT12-XS-01' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Xác suất hai biến cố cùng xảy ra = xác suất cái trước nhân xác suất cái sau khi đã biết cái trước.',
  vd = '{"de":"Hộp có 5 bi đỏ, 3 bi xanh. Lấy lần lượt 2 bi, không hoàn lại. Tính xác suất cả hai bi đều đỏ.","kq":"$\\dfrac58\\cdot\\dfrac47=\\dfrac{5}{14}$"}'::jsonb, nham = '["Không hoàn lại mà vẫn nhân $\\dfrac58\\cdot\\dfrac58$."]'::jsonb, bien = null, lq = array['CT12-XS-01', 'CT12-XS-03']::text[]
where ma = 'CT12-XS-02' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Chia trường hợp theo B và không-B, cộng xác suất từng nhánh của sơ đồ cây.',
  vd = '{"de":"Máy A làm 60%, máy B làm 40% sản phẩm; tỉ lệ lỗi lần lượt 2% và 5%. Lấy ngẫu nhiên 1 sản phẩm, tính xác suất sản phẩm đó lỗi.","buoc":["Gọi $L$: \"sản phẩm lỗi\". $P(L)=P(A)\\cdot P(L\\mid A)+P(B)\\cdot P(L\\mid B)$"],"kq":"$0{,}6\\cdot 0{,}02+0{,}4\\cdot 0{,}05=0{,}032$"}'::jsonb, nham = '["Cộng thẳng $2\\%+5\\%$ mà không nhân tỉ lệ sản phẩm của từng máy."]'::jsonb, bien = null, lq = array['CT12-XS-04', 'CT12-XS-02']::text[]
where ma = 'CT12-XS-03' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Bayes: biết kết quả A đã xảy ra, tính ngược xác suất của nguyên nhân B.',
  vd = '{"de":"Tiếp ví dụ máy A/B: lấy được một sản phẩm lỗi. Tính xác suất sản phẩm đó do máy B làm.","buoc":["Gọi $L$: \"sản phẩm lỗi\"; $P(L)=0{,}032$ (công thức toàn phần)"],"kq":"$P(B\\mid L)=\\dfrac{0{,}4\\cdot 0{,}05}{0{,}032}=0{,}625$"}'::jsonb, nham = '["Lấy $P(L\\mid B)=5\\%$ làm đáp số — đề hỏi chiều ngược lại $P(B\\mid L)$."]'::jsonb, bien = null, lq = array['CT12-XS-03', 'CT12-XS-01']::text[]
where ma = 'CT12-XS-04' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';

update public.sotay_cong_thuc set cong_thuc = noi_dung, noi_dung = 'Hai biến cố độc lập khi việc xảy ra của biến cố này không ảnh hưởng xác suất biến cố kia.',
  vd = '{"de":"Gieo 2 đồng xu. A: đồng thứ nhất sấp; B: đồng thứ hai sấp. A và B có độc lập không?","kq":"$P(A\\cap B)=\\dfrac14=\\dfrac12\\cdot\\dfrac12=P(A)\\cdot P(B)$ ⇒ độc lập."}'::jsonb, nham = '["Nhầm \"độc lập\" với \"xung khắc\" (xung khắc là $P(A\\cap B)=0$)."]'::jsonb, bien = null, lq = array['CT12-XS-02']::text[]
where ma = 'CT12-XS-05' and mon = 'Toán' and cong_thuc is null and cap_nhat_boi is null and trang_thai = 'cho_duyet';
