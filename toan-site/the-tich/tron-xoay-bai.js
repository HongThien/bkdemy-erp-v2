/* CHUYÊN ĐỀ KHỐI TRÒN XOAY — DANH SÁCH BÀI (dữ liệu). Thêm bài = thêm MỘT mục vào mảng dưới đây; trang tron-xoay.html tự dựng hình + bảng.
   Luật của spec-day-hinh-3d.md: A3 công thức CHỮ trước, thay số sau · A4 bài tròn xoay KHÔNG cắt lát: chia miền rồi lắp thẳng công thức.

   QUY ƯỚC DỮ LIỆU
   - Mọi hàm là BÁN KÍNH (khoảng cách có dấu tới trục quay) theo toạ độ dọc trục t.  truc: 'x' ⇒ t = x, bán kính = y  ·  truc: 'y' ⇒ t = y, bán kính = x.
   - id        : mã trên địa chỉ (?bai=48) — đã phát hành thì KHÔNG đổi, không dùng lại          ten, nguon, moTa : hiện ở tên bài + bảng chọn bài
   - maCau     : mã câu trong kho ERP — null cho tới khi khớp THẬT (đối chiếu đề + đáp số; thà trống còn hơn sai). Sổ: docs/hinh-3d/so-theo-doi.md
   - dapSo     : đáp số bằng số — trang TỰ TÍNH lại thể tích từ `mien` và báo lỗi đỏ nếu lệch (đừng bỏ)
   - ve        : { t: [min, max] trục quay · r: [min, max] trục kia · ngam: { tx, ty, tz, r } điểm ngắm + bán kính cần thấy }
   - de        : { tieuDe, html, chips: [...], chuY }     (đề viết lại bằng lời của mình)
   - duong     : các đường vẽ  { fn, t: [từ, tới], nhan, o: [t đặt nhãn, dx, dy] }          dung: [t…] các đường thẳng vuông góc trục quay đề cho
   - to        : các dải tô của (H)  { t: [từ, tới], tren: hàm|null, duoi: hàm|null, phia: 'tren'|'duoi' }   (null = trục quay)
                 dải phia 'duoi' là phần nằm DƯỚI trục — trang tự làm hoạt cảnh gấp lên
   - vach, vachR : vạch số trên trục quay / trục kia     giong: [[t, r]…] nét gióng từ điểm xuống hai trục     diem: [[t, r]…] chấm điểm
   - vet       : [[t, r, 'tren'|'duoi']…] điểm để lại vết tròn khi quay
   - moc       : mốc chia miền trên trục quay  { chu, t, dy?, an? }   (an: chỉ hiện từ bước Chia miền)
   - mien      : từng miền  { t: [từ, tới], ngoai: hàm, trong: hàm|null, tex: công thức CHỮ, chu: chú thích ngắn, so: dòng THAY SỐ, nhan: [t, r] chỗ đặt số miền }
   - chia      : { tieuDe, html, mocTen, mocDong: [tex…], mocKq: tex }      (bỏ nếu bài chỉ có 1 miền)
   - bay       : cái bẫy (bỏ nếu không có)  { tieuDe, html, tex, giai, soTen, so: [tex…], kq: tex, ketLuan, sai: [html…], luu,
                   doan: [{ t, ngoai, trong, dau: 1|-1 }] }   — phần khối mà công thức sai cộng (xanh) / trừ (đỏ)
   - tong      : { tieuDe, tex: công thức CHỮ, soTen, kq: tex, nguyenHam: [tex…], luu }
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
        kq: String.raw`\begin{aligned}V&=\frac{64\pi}{5}+\frac{37\pi}{3}+\frac{153\pi}{5}\[0.4em]&=\frac{836\pi}{15}\approx 175{,}09\end{aligned}`,
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

  return DS
})()
