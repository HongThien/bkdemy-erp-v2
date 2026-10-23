// du-lieu.mjs — DỮ LIỆU bản đồ 4 tầng chương 5 Toán 11 (đã CEO chốt 19/10). Dùng bởi de-xuat.mjs (trang xem) và tao-ban-do.mjs (ghi bản đồ mới).
// de = mã câu THẬT trong 107 đề giữa kì K11 đã up (đang nằm dạng chờ T111000000…) mà dạng này nhận được
export const CD = [
  { ten: 'Giới hạn của dãy số', sgk: 'Bài 15 (tr.104–110)', nhom: [
    { ten: 'Giới hạn của dãy số: định nghĩa và quy tắc', nguon: 'SGK §1–2 · Từ Tâm D1 · PNL D1', dang: [
      ['Nhận biết dãy số có giới hạn $0$ hoặc giới hạn hữu hạn', 'Cho dãy $u_n$, hỏi có giới hạn không / kể từ số hạng nào $|u_n|$ nhỏ hơn một số dương cho trước; các giới hạn cơ bản $\\dfrac1{n^k}$, $q^n$ với $|q|<1$.', 'HĐ1, VD1, LT1'],
      ['Chứng minh giới hạn của dãy số bằng định nghĩa hoặc nguyên lí kẹp', 'Chứng minh $\\lim u_n=a$ bằng $\\lim(u_n-a)=0$; hoặc dùng $|u_n|\\le v_n$, $v_n\\to0$.', 'HĐ2, VD2, LT2'],
      ['Tính giới hạn khi biết giới hạn của các dãy thành phần', 'Cho $\\lim u_n=a$, $\\lim v_n=b$; tính giới hạn của tổng, hiệu, tích, thương, căn các dãy đó.', 'HĐ3, 5.2', ['T111000000205']],
    ]},
    { ten: 'Giới hạn dãy số dạng phân thức', nguon: 'SGK VD3 · Từ Tâm D2 · PNL D2', dang: [
      ['Phân thức có tử và mẫu cùng bậc, hoặc tử bậc thấp hơn', 'Chia cả tử và mẫu cho luỹ thừa cao nhất của $n$ rồi dùng quy tắc.', 'VD3, 5.1a', ['T111000000206']],
      ['Phân thức có tử bậc cao hơn mẫu (giới hạn $\\pm\\infty$)', 'Rút luỹ thừa cao nhất, xét dấu hệ số.', 'PNL D2'],
      ['Phân thức chứa tham số', 'Tìm tham số để giới hạn bằng giá trị cho trước, hoặc để giới hạn hữu hạn, hoặc để giới hạn là số nguyên.', 'PNL D2 BT3–4', ['T111000000133']],
    ]},
    { ten: 'Giới hạn dãy số dạng luỹ thừa và dạng tổng', nguon: 'Từ Tâm D3 · PNL D3 · SGK 5.19', dang: [
      ['Thương các luỹ thừa $a^n$, $b^n$', 'Chia tử và mẫu cho luỹ thừa có cơ số lớn nhất.', 'Từ Tâm D3'],
      ['Dãy chứa cả $n^k$ và $q^n$', 'Nhận ra $q^n$ ($q>1$) lớn hơn mọi $n^k$, rút ra ngoài rồi xét.', 'PNL D3'],
      ['Dãy là tổng $n$ số hạng của cấp số cộng hoặc cấp số nhân', 'Tính tổng theo công thức rồi lấy giới hạn, ví dụ $\\dfrac{1+2+\\dots+n}{n^2}$, $\\dfrac{2+2^2+\\dots+2^n}{2^n}$.', '5.19'],
    ]},
    { ten: 'Giới hạn dãy số dạng căn thức', nguon: 'SGK LT3, 5.1b, 5.3b, 5.18 · Từ Tâm D4', dang: [
      ['Căn thức dưới dấu thương, đưa $n$ ra ngoài căn', 'Chia tử và mẫu cho $n$, chú ý $\\sqrt{n^2}=n$.', 'LT3'],
      ['Hiệu hai căn hoặc căn trừ đa thức (dạng $\\infty-\\infty$)', 'Nhân và chia cho biểu thức liên hợp.', '5.1b, 5.3b, 5.18'],
      ['Căn bậc ba, liên hợp bậc ba', 'Dùng $a-b=\\dfrac{a^3-b^3}{a^2+ab+b^2}$ cho căn bậc ba.', 'Từ Tâm D4 (trường hợp 2)'],
    ]},
    { ten: 'Giới hạn vô cực của dãy số', nguon: 'SGK §4 · HĐ5, VD6, LT5', dang: [
      ['Nhận biết dãy có giới hạn $+\\infty$ hoặc $-\\infty$', '$\\lim n^k$, $\\lim q^n$ với $q>1$; dãy vượt mọi số dương kể từ một số hạng nào đó.', 'HĐ5'],
      ['Tính giới hạn $\\pm\\infty$ bằng cách rút luỹ thừa cao nhất', 'Như $\\lim(n^2-2n)$, $\\lim(n-\\sqrt n)$: rút $n^2$ hoặc $n$, dùng quy tắc tích.', 'VD6, LT5'],
      ['Quy tắc thương và tích khi có giới hạn vô cực', '$\\dfrac{u_n}{v_n}$ với $v_n\\to0$ hoặc $v_n\\to\\pm\\infty$; $u_nv_n$ khi $u_n\\to\\pm\\infty$.', 'khung tr.109'],
    ]},
    { ten: 'Tổng của cấp số nhân lùi vô hạn', nguon: 'SGK §3 · VD4–5, LT4, 5.4, 5.20', dang: [
      ['Nhận biết cấp số nhân lùi vô hạn và tính tổng', 'Kiểm $|q|<1$, tính $S=\\dfrac{u_1}{1-q}$.', 'VD4, LT4, 5.20'],
      ['Biểu diễn số thập phân vô hạn tuần hoàn dưới dạng phân số', 'Tách thành tổng cấp số nhân lùi vô hạn, ví dụ $2{,}222\\dots$, $1{,}(12)$.', 'VD5, 5.4'],
      ['Tìm số hạng đầu hoặc công bội khi biết tổng (bài toán ngược)', 'Từ $S=\\dfrac{u_1}{1-q}$ tìm đại lượng còn lại; ngoài SGK, mức nâng cao.', '(ngoài SGK)'],
    ]},
    { ten: 'Bài toán thực tế về giới hạn dãy số', nguon: 'SGK Vận dụng 1–2, HĐ4, 5.5, 5.6', dang: [
      ['Đại lượng giảm dần hoặc tích luỹ lặp lại (bóng nảy, lượng thuốc trong cơ thể)', 'Lập dãy theo chu kì, chứng minh dần về $0$ hoặc tính giá trị ổn định.', 'Vận dụng 1, 5.5'],
      ['Hình học lặp vô hạn (hình vuông tô màu, đường gấp khúc, nghịch lí Zeno)', 'Lập cấp số nhân lùi vô hạn của độ dài hoặc diện tích, tính tổng.', 'HĐ4, Vận dụng 2, 5.6'],
    ]},
  ]},
  { ten: 'Giới hạn của hàm số', sgk: 'Bài 16 (tr.111–118)', nhom: [
    { ten: 'Giới hạn hữu hạn của hàm số tại một điểm: định nghĩa và quy tắc', nguon: 'SGK §1 · HĐ1, VD1–2, 5.7', dang: [
      ['Dùng định nghĩa (dãy $x_n$) chứng minh hoặc tính giới hạn', 'Lấy dãy $x_n\\ne x_0$, $x_n\\to x_0$, tính $f(x_n)$.', 'HĐ1, VD1'],
      ['Tính giới hạn bằng thay trực tiếp và quy tắc tổng, hiệu, tích, thương', 'Hàm xác định tại $x_0$, mẫu khác $0$.', 'VD2'],
      ['Nhận biết khẳng định đúng về giới hạn', 'Hai hàm khác nhau tại một điểm nhưng cùng giới hạn; cho $\\lim f$, $\\lim g$ tính giới hạn biểu thức.', '5.7'],
    ]},
    { ten: 'Giới hạn dạng vô định $\\dfrac00$', nguon: 'SGK VD3, LT1, 5.8 · Từ Tâm D1 · PNL D1', dang: [
      ['Phân thức hữu tỉ: phân tích nhân tử (có thể dùng chia Horner)', 'Triệt nhân tử chung $x-x_0$.', 'Từ Tâm D1, 5.8a'],
      ['Có một căn thức: nhân liên hợp', 'Nhân tử và mẫu với biểu thức liên hợp.', 'VD3, LT1, 5.8b'],
      ['Có hai căn thức, căn bậc ba, hoặc nhân liên hợp nhiều lần', 'Tách thành hiệu rồi liên hợp từng phần.', 'Từ Tâm D1, PNL D1'],
      ['Tìm tham số để giới hạn dạng $\\dfrac00$ bằng giá trị cho trước', 'Điều kiện tử có nghiệm $x_0$, phân tích rồi so giới hạn.', 'PNL D1 (nâng cao)'],
    ]},
    { ten: 'Giới hạn một bên', nguon: 'SGK §1 · HĐ2, VD4, LT2, 5.9–5.11', dang: [
      ['Hàm số cho bởi nhiều công thức', 'Giới hạn trái, phải tại điểm chia nhánh, kể cả hàm Heaviside.', 'VD4, LT2, 5.9'],
      ['Hàm chứa dấu giá trị tuyệt đối hoặc căn tại điểm biên', 'Bỏ dấu giá trị tuyệt đối theo từng bên.', 'HĐ2, 5.11, 5.22'],
      ['Điều kiện tồn tại giới hạn: giới hạn trái bằng giới hạn phải', 'Kết luận $\\lim$ tồn tại hay không, tìm tham số để tồn tại.', 'khung kiến thức tr.113'],
    ]},
    { ten: 'Giới hạn hữu hạn của hàm số tại vô cực', nguon: 'SGK §2 · VD5–6, LT3, 5.12, 5.21 · Từ Tâm D2', dang: [
      ['Phân thức hữu tỉ khi $x\\to\\pm\\infty$', 'Chia tử và mẫu cho luỹ thừa cao nhất của $x$.', 'Từ Tâm D2 (1)', ['T111000000209']],
      ['Biểu thức chứa căn khi $x\\to\\pm\\infty$ (chú ý dấu khi $x\\to-\\infty$)', 'Đưa $|x|$ ra ngoài căn, $\\sqrt{x^2}=-x$ khi $x<0$.', 'VD6, LT3, 5.12a'],
      ['Dạng $\\infty-\\infty$', 'Nhân liên hợp đưa về $\\dfrac\\infty\\infty$.', '5.12b, 5.21, Từ Tâm D2 (2)'],
      ['Dạng $0\\cdot\\infty$', 'Đưa về $\\dfrac00$ hoặc $\\dfrac\\infty\\infty$.', 'Từ Tâm D2 (3), ngoài SGK'],
    ]},
    { ten: 'Giới hạn vô cực của hàm số', nguon: 'SGK §3 · VD7–10, LT4–5, 5.10, 5.13', dang: [
      ['Giới hạn tại một điểm dạng $\\dfrac L0$ (xét dấu mẫu theo từng bên)', 'Giới hạn một bên bằng $+\\infty$ hoặc $-\\infty$.', 'VD7, VD9, VD10, 5.10, 5.13', ['T111000000210']],
      ['Giới hạn $\\pm\\infty$ khi $x\\to\\pm\\infty$ của đa thức hoặc phân thức tử bậc cao hơn', 'Dùng $x^k$ chẵn hoặc lẻ khi $x\\to-\\infty$.', 'Chú ý tr.116, PNL D2'],
      ['Giới hạn của tích khi một hàm có giới hạn vô cực', 'Áp bảng dấu quy tắc tích $f(x)g(x)$.', 'khung tr.117'],
    ]},
    { ten: 'Bài toán thực tế về giới hạn hàm số', nguon: 'SGK VD8, Vận dụng tr.115', dang: [
      ['Mô hình vật lí hoặc kinh tế có giới hạn', 'Khối lượng theo vận tốc ($v\\to c^-$), chi phí trung bình, nồng độ.', 'VD8'],
      ['Điểm dịch chuyển trong hình học (đường cao khi $A\\to O$ hoặc $A\\to\\infty$)', 'Lập hàm theo tham số rồi lấy giới hạn.', 'Vận dụng tr.115'],
    ]},
  ]},
  { ten: 'Hàm số liên tục', sgk: 'Bài 17 (tr.119–122)', nhom: [
    { ten: 'Tính liên tục của hàm số tại một điểm', nguon: 'SGK §1 · HĐ1, VD1–2, LT1 · Từ Tâm D1', dang: [
      ['Xét tính liên tục tại một điểm của hàm một công thức', 'Kiểm $x_0$ thuộc tập xác định, $\\lim f=f(x_0)$.', 'VD1'],
      ['Xét tính liên tục tại điểm chia nhánh của hàm nhiều công thức', 'So giới hạn trái, phải với $f(x_0)$.', 'HĐ1, VD2, LT1'],
      ['Nhận biết hàm liên tục hoặc gián đoạn qua đồ thị', 'Đồ thị liền nét hay đứt tại điểm đang xét (đề cần hình).', 'HĐ2'],
      ['Nhận biết khẳng định đúng về giới hạn và liên tục tại một điểm', 'Trắc nghiệm: có giới hạn nhưng không liên tục, hàm nào gián đoạn tại điểm cho trước.', 'PNL TN', ['T111000000207']],
    ]},
    { ten: 'Tìm tham số để hàm số liên tục hoặc gián đoạn tại một điểm', nguon: 'SGK 5.24 · Từ Tâm D2 · PNL D1', dang: [
      ['Tham số nằm ở giá trị tại điểm chia nhánh', 'Tính giới hạn rồi cho bằng $f(x_0)$.', 'Từ Tâm D2', ['T111000000208']],
      ['Giới hạn dạng $\\dfrac00$ cho bằng giá trị hàm tại điểm', 'Phân tích hoặc liên hợp rồi tìm tham số.', '5.24'],
      ['Tham số ở cả hai nhánh', 'Giới hạn trái bằng giới hạn phải bằng $f(x_0)$.', 'PNL D1'],
      ['Tìm tham số để hàm số gián đoạn tại một điểm', 'Phủ định điều kiện liên tục.', 'Từ Tâm D2'],
    ]},
    { ten: 'Tính liên tục trên một khoảng, đoạn, tập xác định', nguon: 'SGK §2–3 · VD3–5, LT2, 5.15–5.17, 5.23', dang: [
      ['Tìm các khoảng liên tục của hàm sơ cấp', 'Đa thức, phân thức, căn, lượng giác, tổng hiệu tích thương hàm liên tục.', 'VD3–5, LT2, 5.15a, 5.23'],
      ['Xét tính liên tục của hàm nhiều công thức trên tập xác định', 'Liên tục trên từng khoảng rồi xét điểm chia nhánh.', '5.15b'],
      ['Tìm tham số để hàm số liên tục trên $\\mathbb R$ hoặc trên một khoảng', 'Điều kiện liên tục tại điểm ghép.', '5.16'],
      ['Bài toán thực tế về hàm số liên tục', 'Cước taxi, bảng giá bậc thang, hàm Heaviside, hàm dấu.', '5.17, 5.9'],
    ]},
    { ten: 'Chứng minh phương trình có nghiệm', nguon: 'SGK Nhận xét tr.122, VD6 · Từ Tâm D3', dang: [
      ['Chứng minh phương trình có ít nhất một nghiệm trong khoảng cho trước', 'Hàm liên tục trên $[a;b]$ và $f(a)f(b)<0$.', 'VD6, Từ Tâm D3'],
      ['Chứng minh phương trình có ít nhất $k$ nghiệm', 'Chia thành nhiều khoảng, mỗi khoảng đổi dấu.', 'PNL (nâng cao)'],
      ['Phương trình chứa tham số luôn có nghiệm', 'Chọn $a,b$ không phụ thuộc tham số sao cho $f(a)f(b)<0$.', 'PNL (nâng cao)'],
      ['Bài toán thực tế dùng tính liên tục (giá trị trung gian)', 'Như bài vận tốc $60$ km/h ở phần mở đầu.', 'Vận dụng tr.122'],
    ]},
  ]},
]


export const DE_THAT = [
  ['T111000000133', 'Cần Thơ (chuyên Vị Thanh) 2025–26', 'Cho $L=\\lim\\sqrt{4+\\frac{an^2-1}{4+n^2}-\\frac1{3^n}}$, đếm $a$ nguyên để $L$ nguyên', 'Dãy phân thức · tham số'],
  ['T111000000205', 'giữa kì I', 'Cho $\\lim u_n=3$, tính $\\lim(u_n+2)$', 'Dãy · quy tắc từ giới hạn cho trước'],
  ['T111000000206', 'giữa kì I', 'Tính $\\lim\\frac{2n+1}{1+n}$', 'Dãy phân thức cùng bậc'],
  ['T111000000207', 'giữa kì I', 'Hàm số nào gián đoạn tại $x=2$?', 'Liên tục tại một điểm (nhận biết)'],
  ['T111000000208', 'giữa kì I', 'Tìm $m$ để $f$ liên tục tại $x=3$', 'Tham số liên tục tại điểm'],
  ['T111000000209', 'giữa kì I', 'Tìm $\\lim_{x\\to-\\infty}\\frac{-2x-3}{2+x}$', 'Hàm số tại vô cực (phân thức)'],
  ['T111000000210', 'giữa kì I', 'Tìm $\\lim_{x\\to1^+}\\frac{4x-3}{x-1}$', 'Giới hạn vô cực, một bên'],
]


