/* CHUYÊN ĐỀ KHỐI TRÒN XOAY — DANH SÁCH BÀI (dữ liệu). Thêm bài = thêm MỘT mục vào mảng dưới đây; trang tron-xoay.html tự dựng hình + bảng.
   Luật của spec-day-hinh-3d.md: A3 công thức CHỮ trước, thay số sau · A4 bài tròn xoay KHÔNG cắt lát: chia miền rồi lắp thẳng công thức.

   QUY ƯỚC DỮ LIỆU
   - Mọi hàm là BÁN KÍNH (khoảng cách có dấu tới trục quay) theo toạ độ dọc trục t.  truc: 'x' ⇒ t = x, bán kính = y  ·  truc: 'y' ⇒ t = y, bán kính = x.
   - id        : mã trên địa chỉ (?bai=48) — đã phát hành thì KHÔNG đổi, không dùng lại          ten, nguon, moTa : hiện ở tên bài + bảng chọn bài
   - maCau     : mã câu trong kho ERP — null cho tới khi khớp THẬT (đối chiếu đề + đáp số; thà trống còn hơn sai). Sổ: docs/hinh-3d/so-theo-doi.md
   - dapSo     : đáp số bằng số — trang TỰ TÍNH lại thể tích từ `mien` và báo lỗi đỏ nếu lệch (đừng bỏ)
   - ve        : { t: [min, max] trục quay · r: [min, max] trục kia · ngam: { tx, ty, tz, r } điểm ngắm + bán kính cần thấy }
   - de        : { tieuDe, html, chips: [...], chuY }     (đề viết lại bằng lời của mình)
   - thucTe    : (bài thực tế — thùng, mũ…) { tieuDe, html, tex: [phương trình CHỮ…], soTen, so: [dòng thay số…, dòng cuối là kết quả] }
                 ⇒ thêm bước "Đặt hệ trục"; ở bước Đề bài chỉ hiện vật thật (khối đã quay), chưa có trục / đường / nhãn
                 thucTe.dePhang: true ⇒ đề cho sẵn HÌNH PHẲNG (mặt cắt qua trục, hình hình học): bước Đề bài hiện hình phẳng + tên điểm, chưa có trục
                 thucTe.deCoO: true ⇒ điểm O đã có tên ngay trong đề
   - quayLoi   : (tuỳ chọn) câu dẫn riêng cho bước Quay
   - doiXung   : true ⇒ đề vẽ hình ở CẢ HAI BÊN trục quay (hình thu nhỏ lấy khung đối xứng)     toMo: dải tô của nửa bên kia trục (cùng dạng với `to`, không quay)
   - mauDau    : true ⇒ dồn điểm mẫu về hai đầu mỗi đoạn — dùng khi đường có tiếp tuyến vuông góc trục quay ở đầu mút (đỉnh parabol, cung tròn)
   - doan      : [[t1, r1, t2, r2, 'dut'?]…] đoạn thẳng lẻ của hình ('dut' = nét đứt)     nhanDiem: [[t, r, 'A', dx, dy]…] tên điểm
   - duong     : các đường vẽ  { fn, t: [từ, tới], nhan, o: [t đặt nhãn, dx, dy] }          dung: [t…] các đường thẳng vuông góc trục quay đề cho
   - to        : các dải tô của (H)  { t: [từ, tới], tren: hàm|null, duoi: hàm|null, phia: 'tren'|'duoi' }   (null = trục quay)
                 dải phia 'duoi' là phần nằm DƯỚI trục — trang tự làm hoạt cảnh gấp lên
   - vach, vachR : vạch số trên trục quay / trục kia (vachR nhận cả [r, 'R'] ⇒ hiện "R = 10")     giong: [[t, r]…] nét gióng từ điểm xuống hai trục     diem: [[t, r]…] chấm điểm
   - vet       : [[t, r, 'tren'|'duoi']…] điểm để lại vết tròn khi quay
   - moc       : mốc chia miền trên trục quay  { chu, t, dy?, an? }   (an: chỉ hiện từ bước Chia miền)
   - mien      : từng miền  { t: [từ, tới], ngoai: hàm, trong: hàm|null, tex: công thức CHỮ, chu: chú thích ngắn, so: dòng THAY SỐ, nhan: [t, r] chỗ đặt số miền }
                 an: true ⇒ miền đối xứng với miền đã kể: không liệt kê, không đánh số, chỉ để trang tự kiểm thể tích
   - chia      : { tieuDe, html, mocTen, mocDong: [tex…], mocKq: tex, luu }      (bỏ nếu bài chỉ có 1 miền; mocDong bỏ được nếu mốc đã rõ từ trước)
   - bay       : cái bẫy (bỏ nếu không có)  { tieuDe, html, tex, giai, soTen, so: [tex…], kq: tex, ketLuan, sai: [html…], luu,
                   doan: [{ t, ngoai, trong, dau: 1|-1 }] }   — phần khối mà công thức sai cộng (xanh) / trừ (đỏ)
   - tong      : { tieuDe, tex: công thức CHỮ, soTen, kq: tex, nguyenHam: [tex…], nguyenHamTen, luu }
   Trong tex: KHÔNG đưa chữ có dấu vào \text{}; số thập phân viết 2{,}40. */
window.BAI_TRON_XOAY = (function () {
  const DS = [], PI = Math.PI

  // ───────── Câu 48 (NBV 12-18 F) ─────────
  { const f = x => x * x - 8 * x + 12, g = x => 6 - x
    DS.push({
      id: '48', maCau: null, ten: 'Miền vắt qua trục quay', nguon: 'NBV 12-18 F · câu 48',
      moTa: 'Parabol và đường thẳng; hình phẳng nằm ở cả hai phía của trục Ox. Ba miền, có cái bẫy công thức ra 0.',
      truc: 'x', dapSo: 836 * PI / 15,
      ve: { t: [-1.2, 7.7], r: [-5.3, 6.4], ngam: { tx: 2.4, ty: 0.95, tz: 0, r: 6.9 } },
      de: { tieuDe: 'Quay hình phẳng quanh trục Ox',
        html: String.raw`<p>Hình phẳng <i>(H)</i> giới hạn bởi parabol <i>y</i> = <i>f</i>(<i>x</i>) = <i>x</i>² − 8<i>x</i> + 12 và đường thẳng <i>y</i> = <i>g</i>(<i>x</i>) = −<i>x</i> + 6 (phần tô màu).</p>
          <p>Quay <i>(H)</i> quanh trục hoành. Tính thể tích khối tròn xoay tạo thành.</p>`,
        chips: ['f(x) = x² − 8x + 12', 'g(x) = −x + 6'],
        chuY: String.raw`Chú ý: <i>(H)</i> nằm ở <b>cả hai phía</b> của trục quay. Phần <b class="tren">xanh</b> ở trên trục <i>Ox</i>, phần <b class="duoi">hồng</b> ở dưới trục.` },
      duong: [{ fn: f, t: [0.75, 6.75], nhan: 'y = f(x)', o: [6.75, 2.5, -0.2] }, { fn: g, t: [-0.4, 7.2], nhan: 'y = g(x)', o: [7.2, 0.9, 1.05] }],
      to: [{ t: [1, 2], tren: g, duoi: f, phia: 'tren' }, { t: [2, 6], tren: g, duoi: null, phia: 'tren' }, { t: [2, 6], tren: null, duoi: f, phia: 'duoi' }],
      vach: [1, 2, 6], vachR: [5], giong: [[1, 5]], diem: [[1, 5], [6, 0]], vet: [[1, 5, 'tren'], [4, -4, 'duoi']],
      moc: [{ chu: 'a', t: 1 }, { chu: 'p', t: 2, dy: 2.7 }, { chu: 'q', t: 3, an: true }, { chu: 'b', t: 6, dx: 0.9 }],
      mien: [
        { t: [1, 2], ngoai: g, trong: f, chu: 'giữa hai đường', nhan: [1.62, 3.2],
          tex: String.raw`V_1=\pi\int_a^p\left(g^2-f^2\right)\mathrm{d}x`, so: String.raw`V_1=\pi\int_1^2\left(g^2-f^2\right)\mathrm{d}x=\frac{64\pi}{5}` },
        { t: [2, 3], ngoai: g, trong: null, chu: 'từ trục tới g', nhan: [2.5, 1.5],
          tex: String.raw`V_2=\pi\int_p^q g^2\,\mathrm{d}x`, so: String.raw`V_2=\pi\int_2^3 g^2\,\mathrm{d}x=\frac{37\pi}{3}` },
        { t: [3, 6], ngoai: x => -f(x), trong: null, chu: 'từ trục tới −f', nhan: [4.4, 1.7],
          tex: String.raw`V_3=\pi\int_q^b f^2\,\mathrm{d}x`, so: String.raw`V_3=\pi\int_3^6 f^2\,\mathrm{d}x=\frac{153\pi}{5}` },
      ],
      chia: { tieuDe: 'Gấp phần dưới lên, chia ba miền',
        html: String.raw`<p>Quay phần hồng quanh <i>Ox</i> cho ra đúng khối mà <b>ảnh đối xứng của nó qua <i>Ox</i></b> tạo ra. Vậy cứ gấp phần hồng lên trên trục: <i>y</i> = <i>f</i>(<i>x</i>) thành <i>y</i> = −<i>f</i>(<i>x</i>).</p>`,
        mocTen: 'a, b: f = g · p: f = 0 · q: g = −f',
        mocDong: [String.raw`f=g\iff x^2-7x+6=0\iff x=1,\ x=6`, String.raw`f=0\iff x=2,\ x=6`, String.raw`g=-f\iff x^2-9x+18=0\iff x=3,\ x=6`],
        mocKq: String.raw`a=1,\quad p=2,\quad q=3,\quad b=6` },
      bay: { tieuDe: 'Áp một công thức cho cả đoạn thì sao?',
        html: String.raw`<p>Nhiều bạn không chia miền mà áp luôn công thức “hình phẳng giữa hai đường” cho cả đoạn [<i>a</i>; <i>b</i>]:</p>`,
        tex: String.raw`V_{?}=\pi\int_a^b\left(g^2-f^2\right)\mathrm{d}x`,
        giai: String.raw`<p>Công thức này tính phần khối nằm <b>giữa</b> hai mặt bán kính <i>g</i> và |<i>f</i>|. Trên [<i>a</i>; <i>q</i>] thì <i>g</i> ≥ |<i>f</i>| nên phần đó được <b class="tren">cộng</b>; trên [<i>q</i>; <i>b</i>] thì |<i>f</i>| &gt; <i>g</i> nên phần đó bị <b class="am">trừ</b>.</p>`,
        soTen: 'a = 1, q = 3, b = 6',
        so: [String.raw`\pi\int_1^3\left(g^2-f^2\right)\mathrm{d}x=+\frac{108\pi}{5}`, String.raw`\pi\int_3^6\left(g^2-f^2\right)\mathrm{d}x=-\frac{108\pi}{5}`],
        kq: String.raw`V_{?}=\frac{108\pi}{5}-\frac{108\pi}{5}=0`,
        ketLuan: String.raw`<b>Thể tích bằng 0</b>: vô lý, vì khối có thật. Sai ở hai chỗ:`,
        sai: [String.raw`Miền 2: khối đặc tới tận trục, công thức lại khoét đi phần bán kính |<i>f</i>| ở giữa.`, String.raw`Miền 3: mặt ngoài là |<i>f</i>| chứ không phải <i>g</i>, nên kết quả mang dấu âm.`],
        luu: String.raw`Công thức π∫(<i>g</i>² − <i>f</i>²)d<i>x</i> chỉ đúng khi hình phẳng nằm hẳn một phía của trục quay (như miền 1).`,
        doan: [{ t: [1, 3], ngoai: g, trong: x => Math.abs(f(x)), dau: 1 }, { t: [3, 6], ngoai: x => -f(x), trong: g, dau: -1 }] },
      tong: { tieuDe: 'Cộng ba miền',
        tex: String.raw`\begin{aligned}V&=V_1+V_2+V_3\\[0.5em]&=\pi\int_a^p\left(g^2-f^2\right)\mathrm{d}x\\[0.5em]&\quad+\pi\int_p^q g^2\,\mathrm{d}x+\pi\int_q^b f^2\,\mathrm{d}x\end{aligned}`,
        soTen: 'a = 1, p = 2, q = 3, b = 6',
        kq: String.raw`\begin{aligned}V&=\frac{64\pi}{5}+\frac{37\pi}{3}+\frac{153\pi}{5}\\[0.4em]&=\frac{836\pi}{15}\approx 175{,}09\end{aligned}`,
        nguyenHam: [String.raw`\int g^2\,\mathrm{d}x=-\frac{(6-x)^3}{3}`, String.raw`\begin{aligned}\int f^2\,\mathrm{d}x&=\frac{x^5}{5}-4x^4+\frac{88x^3}{3}\\[0.4em]&\quad-96x^2+144x\end{aligned}`],
        luu: String.raw`Cùng hai hàm <i>f</i>, <i>g</i> như ở bước “Cái bẫy”, nhưng chia miền theo vị trí của <i>(H)</i> so với trục quay rồi mới lắp công thức.` },
    }) }

  // ───────── Câu 49 (NBV 12-18 F) ─────────
  { const f = x => x * x + 1, g = x => -x - 1
    DS.push({
      id: '49', maCau: null, ten: 'Hai đường ở hai phía trục', nguon: 'NBV 12-18 F · câu 49',
      moTa: 'Parabol nằm trên trục, đường thẳng nằm dưới trục, chặn bởi x = −1 và x = 1. Hai miền, không có lỗ.',
      truc: 'x', dapSo: 21 * PI / 5,
      ve: { t: [-2.4, 2.6], r: [-2.7, 3.5], ngam: { tx: 0.35, ty: 0.55, tz: 0, r: 3.9 } },
      de: { tieuDe: 'Quay hình phẳng quanh trục Ox',
        html: String.raw`<p>Hình phẳng <i>(H)</i> giới hạn bởi parabol <i>y</i> = <i>f</i>(<i>x</i>) = <i>x</i>² + 1, đường thẳng <i>y</i> = <i>g</i>(<i>x</i>) = −<i>x</i> − 1 và hai đường thẳng <i>x</i> = −1, <i>x</i> = 1 (phần tô màu).</p>
          <p>Quay <i>(H)</i> quanh trục hoành. Tính thể tích khối tròn xoay tạo thành.</p>`,
        chips: ['f(x) = x² + 1', 'g(x) = −x − 1', 'x = −1, x = 1'],
        chuY: String.raw`Chú ý: parabol nằm <b class="tren">trên</b> trục <i>Ox</i>, đường thẳng nằm <b class="duoi">dưới</b> trục. <i>(H)</i> chứa cả trục quay.` },
      duong: [{ fn: f, t: [-1.5, 1.5], nhan: 'y = f(x)', o: [1.5, 1.9, 0] }, { fn: g, t: [-2.1, 1.6], nhan: 'y = g(x)', o: [1.6, 2, 0.3] }],
      dung: [-1, 1],
      to: [{ t: [-1, 1], tren: f, duoi: null, phia: 'tren' }, { t: [-1, 1], tren: null, duoi: g, phia: 'duoi' }],
      vach: [-1, 1], vachR: [1, 2, -2], giong: [], diem: [[-1, 2], [1, 2], [1, -2], [-1, 0]], vet: [[1, 2, 'tren'], [1, -2, 'duoi']],
      moc: [{ chu: 'a', t: -1, dx: -0.6 }, { chu: 'c', t: 0, an: true, dy: 2.7 }, { chu: 'b', t: 1, dx: 0.9 }],
      mien: [
        { t: [-1, 0], ngoai: f, trong: null, chu: 'từ trục tới f', nhan: [-0.5, 0.75],
          tex: String.raw`V_1=\pi\int_a^c f^2\,\mathrm{d}x`, so: String.raw`V_1=\pi\int_{-1}^{0}\left(x^2+1\right)^2\mathrm{d}x=\frac{28\pi}{15}` },
        { t: [0, 1], ngoai: x => -g(x), trong: null, chu: 'từ trục tới −g', nhan: [0.5, 0.75],
          tex: String.raw`V_2=\pi\int_c^b g^2\,\mathrm{d}x`, so: String.raw`V_2=\pi\int_{0}^{1}\left(x+1\right)^2\mathrm{d}x=\frac{7\pi}{3}` },
      ],
      chia: { tieuDe: 'Gấp phần dưới lên, chia hai miền',
        html: String.raw`<p>Gấp phần hồng lên trên trục: <i>y</i> = <i>g</i>(<i>x</i>) thành <i>y</i> = −<i>g</i>(<i>x</i>) = <i>x</i> + 1. Hai phần chồng lên nhau, khối tròn xoay chỉ phụ thuộc <b>đường nằm ngoài cùng</b>.</p>`,
        mocTen: 'a, b: hai đường thẳng đề cho · c: f = −g',
        mocDong: [String.raw`f=-g\iff x^2+1=x+1\iff x=0,\ x=1`, String.raw`[-1;\,0]:\ f\ge -g\qquad [0;\,1]:\ -g\ge f`],
        mocKq: String.raw`a=-1,\quad c=0,\quad b=1` },
      bay: { tieuDe: 'Lấy hiệu hai bình phương thì sao?',
        html: String.raw`<p>Thấy hai đường <i>f</i>, <i>g</i> là nhiều bạn viết ngay:</p>`,
        tex: String.raw`V_{?}=\pi\int_a^b\left(f^2-g^2\right)\mathrm{d}x`,
        giai: String.raw`<p>Công thức này tính phần khối nằm <b>giữa</b> hai mặt bán kính <i>f</i> và |<i>g</i>|: trên [<i>a</i>; <i>c</i>] phần đó được <b class="tren">cộng</b>, trên [<i>c</i>; <i>b</i>] bị <b class="am">trừ</b>. Phần lõi sát trục bị bỏ quên hoàn toàn.</p>`,
        soTen: 'a = −1, c = 0, b = 1',
        so: [String.raw`\pi\int_{-1}^{0}\left(f^2-g^2\right)\mathrm{d}x=+\frac{23\pi}{15}`, String.raw`\pi\int_{0}^{1}\left(f^2-g^2\right)\mathrm{d}x=-\frac{7\pi}{15}`],
        kq: String.raw`V_{?}=\frac{23\pi}{15}-\frac{7\pi}{15}=\frac{16\pi}{15}`,
        ketLuan: String.raw`<b>Ra 16π/15, nhỏ hơn gần 4 lần</b> so với thể tích thật (21π/5 = 63π/15). Sai ở chỗ:`,
        sai: [String.raw`<i>(H)</i> chứa trục quay nên khối <b>đặc tới tận trục</b>; không có cái lỗ nào để trừ.`],
        luu: String.raw`Công thức π∫(<i>f</i>² − <i>g</i>²)d<i>x</i> chỉ dùng khi hai đường nằm <b>cùng một phía</b> của trục quay.`,
        doan: [{ t: [-1, 0], ngoai: f, trong: x => -g(x), dau: 1 }, { t: [0, 1], ngoai: x => -g(x), trong: f, dau: -1 }] },
      tong: { tieuDe: 'Cộng hai miền',
        tex: String.raw`\begin{aligned}V&=V_1+V_2\\[0.5em]&=\pi\int_a^c f^2\,\mathrm{d}x+\pi\int_c^b g^2\,\mathrm{d}x\end{aligned}`,
        soTen: 'a = −1, c = 0, b = 1',
        kq: String.raw`V=\frac{28\pi}{15}+\frac{7\pi}{3}=\frac{21\pi}{5}\approx 13{,}19`,
        nguyenHam: [String.raw`\int\left(x^2+1\right)^2\mathrm{d}x=\frac{x^5}{5}+\frac{2x^3}{3}+x`, String.raw`\int\left(x+1\right)^2\mathrm{d}x=\frac{(x+1)^3}{3}`],
        luu: String.raw`Mỗi miền chỉ lấy <b>một</b> đường: đường nằm ngoài cùng sau khi gấp.` },
    }) }

  // ───────── Câu 50 (NBV 12-18 F) — bài thực tế ─────────
  { const a = 5, b = 3, d = 4, f = x => b * Math.sqrt(Math.max(0, 1 - x * x / (a * a)))
    DS.push({
      id: '50', maCau: null, ten: 'Thùng rượu đường sinh elip', nguon: 'NBV 12-18 F · câu 50',
      moTa: 'Thùng gỗ tròn xoay, mặt bên là một phần elip, hai đáy phẳng. Phải tự đặt hệ trục; một miền, lắp thẳng công thức.',
      truc: 'x', dapSo: 1416 * PI / 25,
      ve: { t: [-6.4, 6.6], r: [-4.3, 4.6], ngam: { tx: 0, ty: 0.15, tz: 0, r: 6.2 } },
      de: { tieuDe: 'Thùng chứa được bao nhiêu lít?',
        html: String.raw`<p>Một thùng rượu bằng gỗ là khối tròn xoay, hai đáy là hai hình tròn bằng nhau, cách nhau <b>8 dm</b>.</p>
          <p>Đường cong của mặt bên là một phần của đường elip có trục lớn <b>10 dm</b>, trục bé <b>6 dm</b>. Hỏi thùng chứa được bao nhiêu lít rượu?</p>`,
        chips: ['hai đáy cách nhau 8 dm', 'trục lớn 10 dm', 'trục bé 6 dm'] },
      thucTe: { tieuDe: 'Cắt dọc thùng, đặt hệ trục',
        html: String.raw`<p>Cắt thùng bằng một mặt phẳng chứa trục của thùng. Đặt gốc <i>O</i> ở tâm thùng, trục <i>Ox</i> dọc theo trục thùng.</p>
          <p>Mặt bên hiện ra là một phần của elip <i>(E)</i>; hai đáy là hai đường thẳng <i>x</i> = −<i>d</i> và <i>x</i> = <i>d</i>. Thùng là phần <b>ở giữa</b> của elip, hai chỏm ngoài bị cắt đi.</p>`,
        tex: [String.raw`(E):\ \frac{x^2}{a^2}+\frac{y^2}{b^2}=1`, String.raw`y^2=b^2\left(1-\frac{x^2}{a^2}\right)`],
        soTen: 'trục lớn 2a = 10 · trục bé 2b = 6 · hai đáy cách nhau 2d = 8',
        so: [String.raw`a=5,\quad b=3,\quad d=4`, String.raw`y^2=9\left(1-\frac{x^2}{25}\right)`] },
      quayLoi: 'Quay phần hình phẳng nằm giữa elip và trục <i>Ox</i>, từ <i>x</i> = −<i>d</i> tới <i>x</i> = <i>d</i>, quanh trục <i>Ox</i>: ra đúng cái thùng.',
      duong: [{ fn: f, t: [-a, a], nhan: '(E)', o: [-2.6, -0.9, -0.9] }, { fn: x => -f(x), t: [-a, a] }],
      dung: [-d, d],
      to: [{ t: [-d, d], tren: f, duoi: null, phia: 'tren' }],
      vach: [-5, -4, 4, 5], vachR: [3], giong: [], diem: [[-4, f(4)], [4, f(4)], [0, 3]], vet: [[0, 3, 'tren'], [4, f(4), 'tren']],
      moc: [{ chu: '−d', t: -4 }, { chu: 'd', t: 4 }],
      mien: [{ t: [-d, d], ngoai: f, trong: null }],
      tong: { tieuDe: 'Lắp công thức tròn xoay',
        tex: String.raw`\begin{aligned}V&=\pi\int_{-d}^{d}y^2\,\mathrm{d}x=\pi\int_{-d}^{d}b^2\left(1-\frac{x^2}{a^2}\right)\mathrm{d}x\\[0.5em]&=\pi b^2\left[x-\frac{x^3}{3a^2}\right]_{-d}^{d}=2\pi b^2\left(d-\frac{d^3}{3a^2}\right)\end{aligned}`,
        soTen: 'a = 5, b = 3, d = 4',
        kq: String.raw`\begin{aligned}V&=2\pi\cdot 9\left(4-\frac{64}{75}\right)=\frac{1416\pi}{25}\\[0.4em]&\approx 177{,}9\ \text{dm}^3\end{aligned}`,
        luu: String.raw`1 dm³ = 1 lít, nên thùng chứa được khoảng <b>177,9 lít</b>.` },
    }) }

  // ───────── Câu 52 (NBV 12-18 F) — bài thực tế, tính bằng dm để 1 dm³ = 1 lít ─────────
  { const R = 5, r = 4, l = 10, k = 4 * (R - r) / (l * l), f = x => R - k * x * x
    DS.push({
      id: '52', maCau: null, ten: 'Thùng rượu đường sinh parabol', nguon: 'NBV 12-18 F · câu 52',
      moTa: 'Bảy thùng rượu, đường sinh là cung parabol. Đặt hệ trục, lắp công thức, rồi tính tiền. Có chỗ dễ sai vì làm tròn sớm.',
      truc: 'x', dapSo: 656 * PI / 3,
      ve: { t: [-7.4, 7.6], r: [-6.3, 6.7], ngam: { tx: 0, ty: 0.2, tz: 0, r: 7.6 } },
      de: { tieuDe: 'Phải trả bao nhiêu tiền rượu?',
        html: String.raw`<p>Một cơ sở đặt mua <b>7 thùng rượu</b> giống nhau. Mỗi thùng là khối tròn xoay có đường sinh là một cung parabol: bán kính hai mặt đáy <b>40 cm</b>, bán kính ở giữa thùng <b>50 cm</b>, thùng dài <b>100 cm</b>.</p>
          <p>Các thùng chứa đầy rượu, mỗi lít giá <b>30 nghìn đồng</b>. Số tiền phải trả gần nhất với <i>M</i> nghìn đồng (<i>M</i> nguyên). Tìm <i>M</i>.</p>`,
        chips: ['đáy: 40 cm', 'giữa: 50 cm', 'dài 100 cm', '7 thùng', '30 nghìn / lít'] },
      thucTe: { tieuDe: 'Cắt dọc thùng, đặt hệ trục',
        html: String.raw`<p>Cắt thùng bằng một mặt phẳng chứa trục của thùng. Đặt gốc <i>O</i> ở tâm thùng, <i>Ox</i> dọc trục thùng. Gọi <i>R</i> là bán kính ở giữa, <i>r</i> là bán kính đáy, <i>l</i> là chiều dài thùng.</p>
          <p>Đường sinh là parabol có đỉnh (0; <i>R</i>) và đi qua (<i>l</i>/2; <i>r</i>). Đổi sang <b>đề-xi-mét</b> để thể tích ra thẳng lít.</p>`,
        tex: [String.raw`y=R-kx^2`, String.raw`y\!\left(\tfrac{l}{2}\right)=r\ \Rightarrow\ k=\frac{4(R-r)}{l^2}`],
        soTen: 'đổi sang dm: R = 5, r = 4, l = 10',
        so: [String.raw`k=\frac{4(5-4)}{10^2}=0{,}04`, String.raw`y=5-0{,}04\,x^2`] },
      quayLoi: 'Quay phần hình phẳng nằm giữa parabol và trục <i>Ox</i>, từ <i>x</i> = −<i>l</i>/2 tới <i>x</i> = <i>l</i>/2, quanh trục <i>Ox</i>: ra đúng một thùng rượu.',
      duong: [{ fn: f, t: [-6.6, 6.6], nhan: 'y = R − kx²', o: [6.6, 2.6, 0.3] }],
      dung: [-5, 5],
      to: [{ t: [-5, 5], tren: f, duoi: null, phia: 'tren' }],
      vach: [-5, 5], vachR: [4, 5], giong: [[5, 4]], diem: [[-5, 4], [5, 4], [0, 5]], vet: [[0, 5, 'tren'], [5, 4, 'tren']],
      moc: [{ chu: '−l/2', t: -5, dx: -0.4 }, { chu: 'l/2', t: 5, dx: 0.4 }],
      mien: [{ t: [-5, 5], ngoai: f, trong: null }],
      tong: { tieuDe: 'Lắp công thức, rồi tính tiền',
        tex: String.raw`\begin{aligned}V&=\pi\int_{-l/2}^{l/2}\left(R-kx^2\right)^2\mathrm{d}x\\[0.5em]&=\frac{\pi l}{15}\left(8R^2+4Rr+3r^2\right)\end{aligned}`,
        soTen: 'R = 5, r = 4, l = 10 (dm) · tiền = 7 thùng × 30 nghìn × V',
        kq: String.raw`\begin{aligned}V&=\frac{10\pi}{15}\left(200+80+48\right)=\frac{656\pi}{3}\\[0.4em]&\approx 686{,}96\ \text{dm}^3\\[0.6em]210\,V&=45\,920\,\pi\approx 144\,261{,}9\\[0.4em]M&=144\,262\end{aligned}`,
        luu: String.raw`<b>Đừng làm tròn giữa chừng.</b> Nếu lấy mỗi thùng 687 lít rồi mới nhân thì ra 144 270, lệch 8 nghìn đồng so với kết quả đúng.` },
    }) }

  // ───────── Câu 45 (NBV 12-18 F) — đề cho mặt cắt qua trục; quay quanh Oy ─────────
  { const R = 10, h1 = 5, h2 = 20, f = y => R * (1 - Math.sqrt(Math.max(0, y) / h2)), tru = () => R
    DS.push({
      id: '45', maCau: null, ten: 'Mũ ông già Noel', nguon: 'NBV 12-18 F · câu 45',
      moTa: 'Đề cho mặt cắt qua trục của cái mũ: vành mũ là hình chữ nhật, thân mũ là cung parabol. Quay quanh Oy nên phải viết x theo y. Hai miền.',
      truc: 'y', dapSo: 2500 * PI / 3, doiXung: true, mauDau: true,
      ve: { t: [-9.5, 24.5], r: [-14.5, 15.5], ngam: { tx: 0.5, ty: 7, tz: 0, r: 19.5 } },
      de: { tieuDe: 'Thể tích chiếc mũ là bao nhiêu?',
        html: String.raw`<p>Bạn An làm một cái mũ “cách điệu” cho ông già Noel. Cái mũ có dạng một <b>khối tròn xoay</b>; hình bên là <b>mặt cắt qua trục</b> của nó.</p>
          <p>Biết <i>OO′</i> = 5 cm, <i>OA</i> = 10 cm, <i>OB</i> = 20 cm; đường cong <i>AB</i> là một phần của parabol có <b>đỉnh là điểm <i>A</i></b>. Tính thể tích của chiếc mũ.</p>`,
        chips: ['OO′ = 5 cm', 'OA = 10 cm', 'OB = 20 cm', 'cung AB: parabol đỉnh A'] },
      thucTe: { dePhang: true, deCoO: true, tieuDe: 'Đặt hệ trục trên mặt cắt',
        html: String.raw`<p>Đặt gốc tại <i>O</i>, trục <i>Oy</i> trùng với trục của mũ, trục <i>Ox</i> đi qua <i>A</i>. Mặt cắt đối xứng qua <i>Oy</i> nên chỉ cần quay <b>nửa bên phải</b>.</p>
          <p>Gọi <i>R</i> = <i>OA</i>, <i>h</i>₁ = <i>OO′</i>, <i>h</i>₂ = <i>OB</i>. Cung <i>AB</i> là parabol đỉnh <i>A</i>(<i>R</i>; 0), đi qua <i>B</i>(0; <i>h</i>₂). Quay quanh <i>Oy</i> thì bán kính là <i>x</i>, nên phải viết <b><i>x</i> theo <i>y</i></b>.</p>`,
        tex: [String.raw`y=k\left(x-R\right)^2,\quad y(0)=h_2\ \Rightarrow\ k=\frac{h_2}{R^2}`, String.raw`x=R\left(1-\sqrt{\frac{y}{h_2}}\right)\quad (0\le x\le R)`],
        soTen: 'R = 10 · h₁ = 5 · h₂ = 20 (cm)',
        so: [String.raw`k=\frac{20}{10^2}=\frac15\ \Rightarrow\ y=\frac{(x-10)^2}{5}`, String.raw`x=10-\sqrt{5y}`] },
      quayLoi: 'Quay nửa bên phải của mặt cắt quanh trục <i>Oy</i>. Hình chữ nhật vạch ra vành mũ, phần nằm dưới cung parabol vạch ra thân mũ.',
      duong: [{ fn: f, t: [0, h2], nhan: 'x = R(1 − √(y/h₂))', o: [12, 5.4, 0] }, { fn: y => -f(y), t: [0, h2] }, { fn: tru, t: [-h1, 0] }, { fn: () => -R, t: [-h1, 0] }],
      doan: [[-h1, -R, -h1, R], [0, -R, 0, R, 'dut'], [-h1, 0, h2, 0, 'dut']],
      to: [{ t: [-h1, 0], tren: tru, duoi: null, phia: 'tren' }, { t: [0, h2], tren: f, duoi: null, phia: 'tren' }],
      toMo: [{ t: [-h1, 0], tren: null, duoi: () => -R, phia: 'tren' }, { t: [0, h2], tren: null, duoi: y => -f(y), phia: 'tren' }],
      vach: [-5, 20], vachR: [[10, 'R']], giong: [],
      diem: [[0, 10], [h2, 0], [-h1, 0]],
      nhanDiem: [[0, 10, 'A', 0.75, -0.85], [h2, 0, 'B', 0.75, -0.3], [-h1, 0, 'O′', 1.25, 0.95]],
      vet: [[0, 10, 'tren'], [-h1, 10, 'tren']],
      moc: [{ chu: '−h₁', t: -5, dy: 1.15, dx: -1.3 }, { chu: 'h₂', t: 20, dx: -0.6 }],
      mien: [
        { t: [-h1, 0], ngoai: tru, trong: null, chu: 'vành mũ: khối trụ', nhan: [-2.5, 5],
          tex: String.raw`V_1=\pi\int_{-h_1}^{0}R^2\,\mathrm{d}y=\pi R^2h_1`, so: String.raw`V_1=\pi\cdot 10^2\cdot 5=500\pi` },
        { t: [0, h2], ngoai: f, trong: null, chu: 'thân mũ: tới parabol', nhan: [4.2, 2.6],
          tex: String.raw`V_2=\pi\int_{0}^{h_2}x^2\,\mathrm{d}y`, so: String.raw`V_2=\pi\int_0^{20}\left(10-\sqrt{5y}\right)^2\mathrm{d}y=\frac{1000\pi}{3}` },
      ],
      chia: { tieuDe: 'Chia hai miền theo chiều cao',
        html: String.raw`<p>Đi dọc trục quay <i>Oy</i>, bán kính của khối đổi theo hai quy luật khác nhau, nên chia làm hai miền tại <i>y</i> = 0.</p>
          <p><b>Miền 1</b> (vành mũ): bán kính luôn bằng <i>R</i>, quay ra một <b>khối trụ</b>. <b>Miền 2</b> (thân mũ): bán kính là hoành độ <i>x</i> của điểm trên cung parabol, giảm từ <i>R</i> về 0.</p>`,
        luu: String.raw`Quay quanh <i>Oy</i>: công thức là π∫<i>x</i>²d<i>y</i>, cận lấy theo <i>y</i>.` },
      tong: { tieuDe: 'Cộng hai miền',
        tex: String.raw`\begin{aligned}V&=V_1+V_2\\[0.5em]&=\pi R^2h_1+\pi\int_0^{h_2}R^2\left(1-\sqrt{\frac{y}{h_2}}\right)^2\mathrm{d}y\\[0.5em]&=\pi R^2h_1+\frac{\pi R^2h_2}{6}=\pi R^2\left(h_1+\frac{h_2}{6}\right)\end{aligned}`,
        soTen: 'R = 10, h₁ = 5, h₂ = 20 (cm)',
        kq: String.raw`\begin{aligned}V&=500\pi+\frac{1000\pi}{3}=\frac{2500\pi}{3}\\[0.4em]&\approx 2618\ \text{cm}^3\end{aligned}`,
        nguyenHamTen: 'Tích phân đã dùng',
        nguyenHam: [String.raw`u=\frac{y}{h_2}\ \Rightarrow\ \mathrm{d}y=h_2\,\mathrm{d}u`, String.raw`\int_0^{h_2}x^2\,\mathrm{d}y=R^2h_2\int_0^1\left(1-\sqrt{u}\right)^2\mathrm{d}u`, String.raw`\int_0^1\left(1-2\sqrt{u}+u\right)\mathrm{d}u=1-\frac43+\frac12=\frac16`],
        luu: String.raw`Thân mũ chỉ bằng <b>1/6</b> khối trụ có cùng đáy và cùng chiều cao (π<i>R</i>²<i>h</i>₂), vì cung parabol lõm sâu vào phía trục.` },
    }) }

  return DS
})()
