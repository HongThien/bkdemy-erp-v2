/* CHUYÊN ĐỀ THỂ TÍCH THEO THIẾT DIỆN — DANH SÁCH BÀI (dữ liệu). Thêm bài = thêm MỘT mục vào mảng dưới đây; trang thiet-dien.html tự dựng hình + bảng.
   Nguồn: giáo trình 12A1 · Buổi 13 (08/11/2026) "Thể tích của vật thể đặc biệt" — 19 câu của 3 dạng: ① thiết diện không đổi · ② thiết diện thay đổi, cho sẵn · ③ phải tự xây S(x).
   Luật spec-day-hinh-3d.md: A3 công thức CHỮ trước, thay số sau · bài thiết diện giữ đủ bước cắt lát → cộng lát → tích phân (A4).

   QUY ƯỚC DỮ LIỆU
   - id : mã trên địa chỉ (?bai=<id>) — đã phát hành thì KHÔNG đổi          nhom : 1 | 2 | 3 (dạng của giáo trình)          stt : "câu 1 trong giáo trình"
   - maCau : mã câu trong kho ERP (đã đối chiếu đề)    hinh : URL hình đề trong kho ảnh (hiện ở bước Đề bài và ở bảng chọn bài)
   - kieu : 'ring'  = thiết diện ĐỔI theo t: poly(t) trả về đa giác [[p0, p1]…] (số đỉnh KHÔNG đổi, lồi)
            'ep'    = thiết diện KHÔNG đổi (lăng trụ / ép đùn): profile = đa giác [[p0, p1]…] (có thể không lồi), kéo dài từ a tới b
   - truc : 'x' ⇒ trục chạy NGANG; mặt cắt nằm trong mặt phẳng (p0 = y, p1 = độ cao h), đáy lát nằm trên mặt h = 0
            'dung' ⇒ trục chạy THẲNG ĐỨNG (t = độ cao); mặt cắt nằm ngang, p0, p1 là hai toạ độ ngang
   - a, b : hai mốc của t           S : t → diện tích lát (số)           V0 : thể tích đúng (số) — trang TỰ TÍNH lại bằng S và báo lỗi nếu lệch
   - dv : đơn vị thể tích hiện ở kết quả    donVi : đơn vị độ dài trong đề
   - de : { tieuDe, html, chips }    dung : html bước Dựng vật thể    lat : { chu: [{ tex, ghi }…] công thức CHỮ của lát, res: tex, so: t → [tex…] thay số theo vị trí lát }
   - tong : { moc: chữ "Thay số: …", so: tex, ket: html (sau khi thay số) }
   - phu3d : () → [ [[x, y, h]…] … ] nét phụ (đường tròn miệng cốc…) theo toạ độ TOÁN của bài (chỉ bài truc 'x')
   Trong tex: KHÔNG đưa chữ có dấu vào \text{}; số thập phân viết 2{,}40. */
window.BAI_THIET_DIEN = (function () {
  const DS = [], PI = Math.PI, R3 = Math.sqrt(3)
  const tn = (v, d = 2) => (Math.abs(v) < 5e-7 ? 0 : v).toFixed(d).replace('.', '{,}')       // số trong TeX
  const xt = v => (Number.isInteger(v) ? tn(v, 0) : tn(v, 2).replace(/0+$/, ''))   // bỏ số 0 thừa
  const xb = v => (v < 0 ? '(' + xt(v) + ')' : xt(v))                                                   // số âm trong ngoặc
  const tg = s => [[-s / 2, 0], [s / 2, 0], [0, s * R3 / 2]]                                              // tam giác đều cạnh s, đáy nằm trên h = 0
  const HINH = {
    cau: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/6e52c0ed-8da0-4316-8cf5-0b464542ceec.png',
    leuParabol: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/1e91f624-2ef8-4553-aaf4-b0daeac89ac0.png',
    leuHoiCho: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/1a242c16-d5c5-4d5b-9b25-79c4846b61f6.png',
    beTong: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/180d90e9-d8ad-4430-9b42-c84b574f52bd.png',
    binhHoa: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/1286e9a1-c3c7-4ccb-96b4-f5c4b1d73aa6.png',
    beNuoc: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/960e6989-035b-4a23-a85f-628532b26d9b.png',
    coc: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/fff92ee4-ce26-4461-b576-4f0f21740292.png',
    coc2: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-10/99271e29-89b8-4b01-9854-3417cc6b6c36.png',
    nui: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-09/075c37d1-631d-4770-9838-cea06b335b1b_a339358b_c1.png',
    beTru: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-09/032ce04f-b6f7-486f-a810-927d911ff0bf_52dc3029_c1.png',
    lavabo: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/nhap_kho/2026-11/c57ab216-7c78-4760-8a33-1cc14c0cdc45_40572ad6_p4c1.png',
    leuVai: 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/dd961dd6-93ae-4d55-9cb1-02a21a35e5ec.png',
  }
  // Số liệu dùng chung: tích phân số (Simpson) để dựng đáp số khi bài không có nguyên hàm gọn
  const simp = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3 }

  // ═════════════ DẠNG 1 — THIẾT DIỆN KHÔNG ĐỔI ═════════════
  // Câu 1 — cầu bê tông
  { const dk = 9, par = x => 4 - x * x / 100
    const prof = []; for (let i = 0; i <= 40; i++) { const x = -20 + i; prof.push([x, par(x)]) }; prof.push([20, 5], [-20, 5])
    const Sp = 320 / 3, S = 200 - Sp
    DS.push({ id: 'cau-be-tong', nhom: 1, stt: 'Dạng 1 · câu 1', maCau: 'T112050103003', hinh: HINH.cau, ten: 'Cầu bê tông', dapSo: '840 m³',
      kieu: 'ep', truc: 'x', a: 0, b: dk, profile: prof, S: () => S, V0: S * dk, dv: 'm³', donVi: 'm',
      de: { tieuDe: 'Thể tích bê tông đúc một nhịp cầu',
        html: String.raw`<p>Hình bên là <b>mặt cắt dọc</b> của một nhịp cầu bê tông: hình chữ nhật rộng 40 m, cao 5 m, bị khoét đi phần dưới vòm parabol <i>y</i> = 4 − <i>x</i>²/100 (phần tô đậm là bê tông).</p><p>Cầu rộng <b>9 m</b>. Tính thể tích bê tông cần để đúc cầu.</p>`,
        chips: ['mặt cắt: chữ nhật 40 × 5 trừ vòm', 'vòm: y = 4 − x²/100', 'bề rộng 9 m', 'V = ?'] },
      dung: { html: String.raw`<p>Mặt cắt dọc <b>giữ nguyên</b> từ đầu cầu tới cuối cầu: cho lát cắt chạy dọc bề rộng 9 m, hình lát không đổi.</p>` },
      lat: { chu: [{ tex: String.raw`S_1=d\cdot c`, ghi: 'hình chữ nhật dài d, cao c' }, { tex: String.raw`S_2=\int_{-20}^{20}\left(4-\dfrac{x^2}{100}\right)\mathrm{d}x`, ghi: 'phần dưới vòm' }],
        res: String.raw`S=S_1-S_2`,
        so: () => [String.raw`S_1=40\cdot 5=200,\quad S_2=\dfrac{320}{3}`, String.raw`S=200-\dfrac{320}{3}=\dfrac{280}{3}\approx ${tn(S)}`] },
      tong: { moc: 'bề rộng h = 9 m', so: String.raw`V=S\cdot h=\dfrac{280}{3}\cdot 9=840\ \text{m}^3`, ket: String.raw`<p>Diện tích lát không đổi nên chỉ cần lấy <b>diện tích lát nhân độ dài</b>. Ở đây cũng là tích phân của hằng số: <i>V</i> = ∫<sub>0</sub><sup>9</sup> <i>S</i> d<i>x</i> = 9<i>S</i>.</p>` } })
  }
  // Câu 2 — lều parabol
  { const par = x => -(4 / 3) * x * x + 3, prof = []; for (let i = 0; i <= 40; i++) { const x = -1.5 + 3 * i / 40; prof.push([x, par(x)]) }
    DS.push({ id: 'leu-parabol', nhom: 1, stt: 'Dạng 1 · câu 2', maCau: 'T1120000002560', hinh: HINH.leuParabol, ten: 'Lều trại hình parabol', dapSo: '36 m³',
      kieu: 'ep', truc: 'x', a: 0, b: 6, profile: prof, S: () => 6, V0: 36, dv: 'm³', donVi: 'm',
      de: { tieuDe: 'Thể tích phần không gian trong lều',
        html: String.raw`<p>Lều trại có <b>mặt trước là một parabol</b> (nền rộng 3 m, đỉnh cao 3 m). Lều được căng thẳng từ trước ra sau dài <b>6 m</b>, mặt sau cũng là parabol như mặt trước.</p><p>Tính thể tích phần không gian bên trong lều.</p>`,
        chips: ['nền rộng 3 m', 'đỉnh cao 3 m', 'dài 6 m', 'V = ?'] },
      dung: { html: String.raw`<p>Mọi mặt cắt song song với mặt trước đều là <b>cùng một hình parabol</b>. Cho lát chạy từ trước ra sau.</p>` },
      lat: { chu: [{ tex: String.raw`y=-\dfrac{4}{3}x^2+3`, ghi: 'parabol đỉnh (0; 3), qua (±3/2; 0)' }], res: String.raw`S=\int_{-3/2}^{3/2}\left(-\dfrac43x^2+3\right)\mathrm{d}x`,
        so: () => [String.raw`S=\left[-\dfrac49x^3+3x\right]_{-3/2}^{3/2}=6`] },
      tong: { moc: 'dài h = 6 m', so: String.raw`V=S\cdot h=6\cdot 6=36\ \text{m}^3`, ket: String.raw`<p>Cách nhanh: diện tích hình parabol bằng <b>2/3</b> hình chữ nhật bao ngoài: <i>S</i> = (2/3)·3·3 = 6.</p>` } })
  }
  // Câu 3 — lều hội chợ
  { const top = x => 20 * Math.exp(-Math.abs(x) / 40), prof = [[-10, 0], [10, 0]]; for (let i = 0; i <= 40; i++) { const x = 10 - 20 * i / 40; prof.push([x, top(x)]) }
    const S = 1600 * (1 - Math.exp(-0.25)), V = S * 30
    DS.push({ id: 'leu-hoi-cho', nhom: 1, stt: 'Dạng 1 · câu 3', maCau: 'T1120000002689', hinh: HINH.leuHoiCho, ten: 'Lều hội chợ', dapSo: '10,6 ML',
      kieu: 'ep', truc: 'x', a: 0, b: 30, profile: prof, S: () => S, V0: V, dv: 'm³', donVi: 'm',
      de: { tieuDe: 'Thể tích không khí trong lều hội chợ',
        html: String.raw`<p>Mặt cắt ngang của lều có hai mái dốc đối xứng, biên mái cho bởi <i>f</i>(<i>x</i>) = 20·e<sup>−<i>x</i>/40</sup> (nửa phải) và <i>g</i>(<i>x</i>) = 20·e<sup><i>x</i>/40</sup> (nửa trái), với −10 ≤ <i>x</i> ≤ 10.</p><p>Lều dài <b>30 m</b>. Tính thể tích không khí trong lều, đổi ra ML (1 ML = 1000 m³), làm tròn đến hàng phần mười.</p>`,
        chips: ['f(x) = 20e^(−x/40)', 'g(x) = 20e^(x/40)', 'dài 30 m', 'V = ? ML'] },
      dung: { html: String.raw`<p>Mặt cắt ngang giống nhau từ đầu tới cuối lều dài 30 m. Cho lát chạy dọc chiều dài.</p>` },
      lat: { chu: [{ tex: String.raw`A_1=\int_{0}^{10}f(x)\,\mathrm{d}x`, ghi: 'nửa phải' }, { tex: String.raw`A_2=A_1`, ghi: 'hai nửa đối xứng' }], res: String.raw`S=A_1+A_2=2A_1`,
        so: () => [String.raw`A_1=\int_0^{10}20e^{-x/40}\mathrm{d}x=800\left(1-e^{-1/4}\right)\approx ${tn(S / 2)}`, String.raw`S=2A_1\approx ${tn(S)}\ \text{m}^2`] },
      tong: { moc: 'dài h = 30 m', so: String.raw`\begin{aligned}V&=S\cdot h\approx ${tn(S)}\cdot 30\approx ${tn(V, 1)}\ \text{m}^3\\[0.4em]&\approx ${tn(V / 1000, 1)}\ \text{ML}\end{aligned}`, ket: String.raw`<p>Đổi đơn vị cuối cùng: 10 617,6 m³ ≈ <b>10,6 ML</b>.</p>` } })
  }
  // Câu 4 — thiết diện diện tích 5 (ví dụ trừu tượng)
  { const s = Math.sqrt(5 / (3 * R3 / 2)), hex = []; for (let k = 0; k < 6; k++) hex.push([s * Math.cos(PI / 3 * k), s * Math.sin(PI / 3 * k) + s * 0.87 + 0.05])
    DS.push({ id: 'dien-tich-5', nhom: 1, stt: 'Dạng 1 · câu 4 (ví dụ)', maCau: 'LOP004931', hinh: null, ten: 'Mọi thiết diện đều bằng 5', dapSo: '30',
      kieu: 'ep', truc: 'x', a: 0, b: 6, profile: hex, S: () => 5, V0: 30, dv: '', donVi: '',
      de: { tieuDe: 'Thiết diện luôn có diện tích 5',
        html: String.raw`<p>Một vật thể nằm giữa hai mặt phẳng <i>x</i> = 0 và <i>x</i> = 6. Mọi thiết diện cắt bởi mặt phẳng vuông góc với <i>Ox</i> đều có diện tích bằng <b>5</b>. Tính thể tích vật thể.</p>`,
        chips: ['x = 0 → x = 6', 'S(x) = 5', 'V = ?'] },
      dung: { html: String.raw`<p>Hình dạng lát không quan trọng, chỉ cần biết <b>diện tích</b> lát. Ở đây dùng một hình sáu cạnh minh họa có diện tích 5.</p>` },
      lat: { chu: [{ tex: String.raw`S(x)=S`, ghi: 'diện tích lát không đổi' }], res: String.raw`S(x)=5`, so: () => [String.raw`S(x)=5`] },
      tong: { moc: 'x từ 0 tới 6', so: String.raw`V=\int_0^6 5\,\mathrm{d}x=5\cdot 6=30`, ket: String.raw`<p>Diện tích lát không đổi nên <i>V</i> = <i>S</i>·<i>h</i> với <i>h</i> = 6 − 0 = 6.</p>` } })
  }

  // ═════════════ DẠNG 2 — THIẾT DIỆN THAY ĐỔI, CHO SẴN ═════════════
  // Câu 1 — tam giác đều cạnh x
  { DS.push({ id: 'tam-giac-canh-x', nhom: 2, stt: 'Dạng 2 · câu 1', maCau: 'T1120000002363', hinh: null, ten: 'Tam giác đều cạnh x', dapSo: '√3/12',
      kieu: 'ring', truc: 'x', a: 0, b: 1, poly: t => tg(t), S: t => R3 / 4 * t * t, V0: R3 / 12, dv: '', donVi: '', mauDau: false, buocX: 0.05,
      de: { tieuDe: 'Thiết diện là tam giác đều cạnh x',
        html: String.raw`<p>Vật thể nằm giữa hai mặt phẳng <i>x</i> = 0 và <i>x</i> = 1. Cắt vật thể bằng mặt phẳng vuông góc với <i>Ox</i> tại điểm có hoành độ <i>x</i> (0 ≤ <i>x</i> ≤ 1), thiết diện là <b>tam giác đều có cạnh bằng <i>x</i></b>.</p><p>Tính thể tích vật thể.</p>`,
        chips: ['0 ≤ x ≤ 1', 'tam giác đều cạnh x', 'V = ?'] },
      dung: { html: String.raw`<p>Tại <i>x</i> = 0 lát chỉ là một điểm, càng đi xa lát càng to. Vật thể có dạng một cái <b>chóp</b> cong.</p>` },
      lat: { chu: [{ tex: String.raw`S=\dfrac{\sqrt3}{4}\,a^2`, ghi: 'tam giác đều cạnh a' }], res: String.raw`S(x)=\dfrac{\sqrt3}{4}\,x^2\quad(a=x)`,
        so: x => [String.raw`S(${xt(x)})=\dfrac{\sqrt3}{4}\cdot ${xb(x)}^2=${tn(R3 / 4 * x * x, 4)}`] },
      tong: { moc: 'x từ 0 tới 1', so: String.raw`\begin{aligned}V&=\frac{\sqrt3}{4}\int_0^1x^2\,\mathrm{d}x=\frac{\sqrt3}{4}\cdot\frac{x^3}{3}\Big|_0^1\\[0.4em]&=\frac{\sqrt3}{12}\approx ${tn(R3 / 12, 4)}\end{aligned}`, ket: String.raw`<p>Chọn đáp án có <b>√3/12</b>. Đáp án có chữ π là sai vì lát là tam giác, không phải hình tròn.</p>` } })
  }
  // Câu 2 — khối bê tông, lát nằm ngang chữ nhật 5 × 0,5^x
  { const w = t => Math.pow(0.5, t), V = 15 / (4 * Math.LN2)
    DS.push({ id: 'be-tong-khoi', nhom: 2, stt: 'Dạng 2 · câu 2', maCau: 'T1120000002577', hinh: HINH.beTong, ten: 'Khối bê tông cắt ngang', dapSo: '5,41 m³',
      kieu: 'ring', truc: 'dung', a: 0, b: 2, poly: t => [[-2.5, -w(t) / 2], [2.5, -w(t) / 2], [2.5, w(t) / 2], [-2.5, w(t) / 2]], S: t => 5 * w(t), V0: V, dv: 'm³', donVi: 'm', mauDau: false, buocX: 0.1,
      de: { tieuDe: 'Khối bê tông cao 2 m',
        html: String.raw`<p>Khối bê tông cao <b>2 m</b> đặt trên mặt đất. Cắt khối bằng mặt phẳng <b>nằm ngang</b> cách mặt đất <i>x</i> (m), 0 ≤ <i>x</i> ≤ 2, được mặt cắt là hình chữ nhật dài <b>5 m</b>, rộng <b>(0,5)<sup><i>x</i></sup></b> m.</p><p>Tính thể tích khối bê tông, làm tròn đến hàng phần trăm.</p>`,
        chips: ['cao 2 m', 'dài 5 m', 'rộng (0,5)^x', 'V = ?'] },
      dung: { html: String.raw`<p>Trục <i>Ox</i> thẳng đứng, gốc ở mặt đất. Lát nằm ngang, <b>dài 5 m không đổi</b> còn chiều rộng <b>hẹp dần</b> khi lên cao.</p>` },
      lat: { chu: [{ tex: String.raw`S=d\cdot r`, ghi: 'hình chữ nhật dài d, rộng r' }], res: String.raw`S(x)=5\cdot(0{,}5)^x`,
        so: x => [String.raw`S(${xt(x)})=5\cdot(0{,}5)^{${xt(x)}}=${tn(5 * w(x), 3)}\ \text{m}^2`] },
      tong: { moc: 'x từ 0 tới 2', so: String.raw`\begin{aligned}V&=\int_0^2 5\left(\tfrac12\right)^x\mathrm{d}x=\left.\frac{5}{\ln\frac12}\left(\tfrac12\right)^x\right|_0^2\\[0.4em]&=\frac{15}{4\ln 2}\approx ${tn(V)}\ \text{m}^3\end{aligned}`, ket: String.raw`<p>Nguyên hàm của <i>a</i><sup><i>x</i></sup> là <i>a</i><sup><i>x</i></sup>/ln <i>a</i>. Ở đây <i>a</i> = 1/2 nên ln <i>a</i> = −ln 2.</p>` } })
  }
  // Câu 3, 4, 5 — ví dụ của sách (kho trên lớp)
  { DS.push({ id: 'chu-nhat-3x-x2', nhom: 2, stt: 'Dạng 2 · câu 3 (ví dụ)', maCau: 'LOP006367', hinh: null, ten: 'Chữ nhật 3x và x²', dapSo: '60',
      kieu: 'ring', truc: 'x', a: 1, b: 3, poly: t => [[-1.5 * t, 0], [1.5 * t, 0], [1.5 * t, t * t], [-1.5 * t, t * t]], S: t => 3 * t ** 3, V0: 60, dv: '', donVi: '', mauDau: false, buocX: 0.1,
      de: { tieuDe: 'Thiết diện là hình chữ nhật 3x và x²',
        html: String.raw`<p>Vật thể nằm giữa hai mặt phẳng <i>x</i> = 1 và <i>x</i> = 3. Cắt bởi mặt phẳng vuông góc với <i>Ox</i> tại <i>x</i> (1 ≤ <i>x</i> ≤ 3), thiết diện là <b>hình chữ nhật có hai cạnh 3<i>x</i> và <i>x</i>²</b>.</p><p>Tính thể tích vật thể.</p>`,
        chips: ['1 ≤ x ≤ 3', 'chữ nhật 3x × x²', 'V = ?'] },
      dung: { html: String.raw`<p>Lát to dần rất nhanh: cạnh 3<i>x</i> tăng bậc 1, cạnh <i>x</i>² tăng bậc 2.</p>` },
      lat: { chu: [{ tex: String.raw`S=d\cdot r`, ghi: 'chữ nhật dài d, rộng r' }], res: String.raw`S(x)=3x\cdot x^2=3x^3`, so: x => [String.raw`S(${xt(x)})=3\cdot ${xb(x)}^3=${tn(3 * x ** 3, 2)}`] },
      tong: { moc: 'x từ 1 tới 3', so: String.raw`V=\int_1^3 3x^3\,\mathrm{d}x=\frac{3x^4}{4}\Big|_1^3=\frac{3}{4}(81-1)=60`, ket: '' } })
  }
  { DS.push({ id: 'tam-giac-sin', nhom: 2, stt: 'Dạng 2 · câu 4 (ví dụ)', maCau: 'LOP006368', hinh: null, ten: 'Tam giác đều cạnh 2√(sin x)', dapSo: '2√3',
      kieu: 'ring', truc: 'x', a: 0, b: PI, poly: t => tg(2 * Math.sqrt(Math.max(0, Math.sin(t)))), S: t => R3 * Math.sin(t), V0: 2 * R3, dv: '', donVi: '', mauDau: true, buocX: PI / 20,
      de: { tieuDe: 'Thiết diện là tam giác đều cạnh 2√(sin x)',
        html: String.raw`<p>Vật thể nằm giữa hai mặt phẳng <i>x</i> = 0 và <i>x</i> = π. Thiết diện cắt bởi mặt phẳng vuông góc với <i>Ox</i> tại <i>x</i> (0 ≤ <i>x</i> ≤ π) là <b>tam giác đều cạnh 2√(sin <i>x</i>)</b>.</p><p>Tính thể tích vật thể.</p>`,
        chips: ['0 ≤ x ≤ π', 'tam giác đều cạnh 2√(sin x)', 'V = ?'] },
      dung: { html: String.raw`<p>Tại hai đầu <i>x</i> = 0 và <i>x</i> = π lát thu về một điểm, lớn nhất ở giữa (<i>x</i> = π/2).</p>` },
      lat: { chu: [{ tex: String.raw`S=\dfrac{\sqrt3}{4}\,a^2`, ghi: 'tam giác đều cạnh a' }], res: String.raw`S(x)=\dfrac{\sqrt3}{4}\left(2\sqrt{\sin x}\right)^2=\sqrt3\sin x`,
        so: x => [String.raw`S(${tn(x, 2)})=\sqrt3\sin ${tn(x, 2)}=${tn(R3 * Math.sin(x), 4)}`] },
      tong: { moc: 'x từ 0 tới π', so: String.raw`V=\sqrt3\int_0^{\pi}\sin x\,\mathrm{d}x=-\sqrt3\cos x\Big|_0^{\pi}=2\sqrt3\approx ${tn(2 * R3, 4)}`, ket: '' } })
  }
  { DS.push({ id: 'tam-giac-x-can-2-x', nhom: 2, stt: 'Dạng 2 · câu 5 (ví dụ)', maCau: 'LOP006369', hinh: null, ten: 'Tam giác đều cạnh x√(2 − x)', dapSo: '√3/3',
      kieu: 'ring', truc: 'x', a: 0, b: 2, poly: t => tg(t * Math.sqrt(Math.max(0, 2 - t))), S: t => R3 / 4 * t * t * (2 - t), V0: R3 / 3, dv: '', donVi: '', mauDau: true, buocX: 0.1,
      de: { tieuDe: 'Thiết diện là tam giác đều cạnh x√(2 − x)',
        html: String.raw`<p>Vật thể (𝔍) giới hạn bởi hai mặt phẳng <i>x</i> = 0 và <i>x</i> = 2. Cắt bởi mặt phẳng vuông góc với <i>Ox</i> tại <i>x</i> (0 ≤ <i>x</i> ≤ 2), thiết diện là <b>tam giác đều cạnh <i>x</i>√(2 − <i>x</i>)</b>.</p><p>Tính thể tích <i>V</i> của vật thể.</p>`,
        chips: ['0 ≤ x ≤ 2', 'tam giác đều cạnh x√(2−x)', 'V = ?'] },
      dung: { html: String.raw`<p>Lát bằng 0 ở hai đầu (<i>x</i> = 0 và <i>x</i> = 2), to nhất quanh <i>x</i> = 4/3.</p>` },
      lat: { chu: [{ tex: String.raw`S=\dfrac{\sqrt3}{4}\,a^2`, ghi: 'tam giác đều cạnh a' }], res: String.raw`S(x)=\dfrac{\sqrt3}{4}\,x^2(2-x)`,
        so: x => [String.raw`S(${xt(x)})=\dfrac{\sqrt3}{4}\cdot ${xb(x)}^2\,(2-${xb(x)})=${tn(R3 / 4 * x * x * (2 - x), 4)}`] },
      tong: { moc: 'x từ 0 tới 2', so: String.raw`\begin{aligned}V&=\frac{\sqrt3}{4}\int_0^2\left(2x^2-x^3\right)\mathrm{d}x=\frac{\sqrt3}{4}\left[\frac{2x^3}{3}-\frac{x^4}{4}\right]_0^2\\[0.4em]&=\frac{\sqrt3}{4}\cdot\frac{4}{3}=\frac{\sqrt3}{3}\end{aligned}`, ket: '' } })
  }
  // Câu 6 — bình hoa
  { const Rb = t => 4 / 9 * t ** 3 - 5 / 3 * t * t + 4 / 3 * t + 25 / 36
    const Vt = simp(t => PI * Rb(t) ** 2, 0, 2.5), Vn = simp(t => PI * Rb(t) ** 2, 0, 5 / 3), tl = Vn / Vt * 100
    DS.push({ id: 'binh-hoa', nhom: 2, stt: 'Dạng 2 · câu 6', maCau: 'T1120000002697', hinh: HINH.binhHoa, ten: 'Bình hoa', dapSo: '92 %',
      kieu: 'ring', truc: 'dung', a: 0, b: 2.5, poly: t => { const r = Rb(t), P = []; for (let k = 0; k < 40; k++) { const g = 2 * PI * k / 40; P.push([r * Math.cos(g), r * Math.sin(g)]) } return P },
      S: t => PI * Rb(t) ** 2, V0: Vt, dv: 'dm³', donVi: 'dm', mauDau: false, buocX: 0.125, nuoc: 5 / 3, dapSoSo: tl,
      de: { tieuDe: 'Nước trong bình hoa',
        html: String.raw`<p>Bình hoa là khối tròn xoay cao 25 cm (2,5 dm). Cắt bằng mặt phẳng vuông góc với trục, thiết diện là hình tròn bán kính <i>R</i> = (4/9)<i>x</i>³ − (5/3)<i>x</i>² + (4/3)<i>x</i> + 25/36 (dm), với <i>x</i> ∈ [0; 5/2] là khoảng cách từ mặt cắt tới đáy.</p><p>Nước đổ vào bình cao bằng <b>2/3 chiều cao</b> bình. Lượng nước đó bằng bao nhiêu phần trăm thể tích bình? (làm tròn đến hàng đơn vị)</p>`,
        chips: ['x ∈ [0; 5/2] dm', 'lát: hình tròn bán kính R(x)', 'nước cao 2/3', 'tỉ lệ = ? %'] },
      dung: { html: String.raw`<p>Trục <i>Ox</i> thẳng đứng, gốc ở đáy bình. Phần <b>màu hổ phách</b> ở bước sau là mực nước cao 2/3 bình (<i>x</i> = 5/3).</p>` },
      lat: { chu: [{ tex: String.raw`S=\pi R^2`, ghi: 'hình tròn bán kính R' }], res: String.raw`S(x)=\pi\left(\tfrac49x^3-\tfrac53x^2+\tfrac43x+\tfrac{25}{36}\right)^2`,
        so: x => [String.raw`R(${xt(x)})=${tn(Rb(x), 3)}\ \text{dm}`, String.raw`S(${xt(x)})=\pi\cdot ${tn(Rb(x), 3)}^2=${tn(PI * Rb(x) ** 2, 3)}\ \text{dm}^2`] },
      tong: { moc: 'đầy bình x ∈ [0; 5/2], nước x ∈ [0; 5/3]', so: String.raw`\begin{aligned}V_{\text{binh}}&=\int_0^{5/2}S(x)\,\mathrm{d}x\approx ${tn(Vt)}\ \text{dm}^3\\[0.4em]V_{\text{nuoc}}&=\int_0^{5/3}S(x)\,\mathrm{d}x\approx ${tn(Vn)}\ \text{dm}^3\\[0.4em]&\Rightarrow\ \frac{V_{\text{nuoc}}}{V_{\text{binh}}}\approx ${tn(tl / 100, 3)}\approx ${tn(tl, 0)}\,\%\end{aligned}`, ket: String.raw`<p>Nước chỉ cao 2/3 nhưng chiếm tới <b>92%</b> thể tích: phần trên của bình hẹp (cổ bình) nên chứa rất ít.</p>` } })
  }
  // Câu 7 — bể nước mặt vuông
  { const sq = t => Math.sqrt(2 + t * t / 4)
    DS.push({ id: 'be-nuoc-vuong', nhom: 2, stt: 'Dạng 2 · câu 7', maCau: 'T1120000002880', hinh: HINH.beNuoc, ten: 'Bình chứa nước mặt vuông', dapSo: '40/3 dm³',
      kieu: 'ring', truc: 'dung', a: 0, b: 4, poly: t => { const s = sq(t) / 2; return [[-s, -s], [s, -s], [s, s], [-s, s]] }, S: t => 2 + t * t / 4, V0: 40 / 3, dv: 'dm³', donVi: 'dm', mauDau: false, buocX: 0.25,
      de: { tieuDe: 'Dung tích của bình chứa nước',
        html: String.raw`<p>Khi nước trong bình có chiều cao <i>x</i> (dm), 0 ≤ <i>x</i> ≤ 4, thì <b>mặt nước là hình vuông</b> có cạnh √(2 + <i>x</i>²/4) (dm).</p><p>Tính dung tích của bình.</p>`,
        chips: ['0 ≤ x ≤ 4 dm', 'mặt nước: hình vuông', 'cạnh √(2 + x²/4)', 'V = ?'] },
      dung: { html: String.raw`<p>Bình <b>loe dần</b> về phía miệng: mặt nước càng cao càng rộng. Cho mặt nước dâng từ đáy tới miệng bình.</p>` },
      lat: { chu: [{ tex: String.raw`S=a^2`, ghi: 'hình vuông cạnh a' }], res: String.raw`S(x)=\left(\sqrt{2+\tfrac{x^2}{4}}\right)^2=2+\dfrac{x^2}{4}`, so: x => [String.raw`S(${xt(x)})=2+\dfrac{${xb(x)}^2}{4}=${tn(2 + x * x / 4, 3)}\ \text{dm}^2`] },
      tong: { moc: 'x từ 0 tới 4', so: String.raw`V=\int_0^4\left(2+\frac{x^2}{4}\right)\mathrm{d}x=\left[2x+\frac{x^3}{12}\right]_0^4=\frac{40}{3}\approx ${tn(40 / 3)}\ \text{dm}^3`, ket: String.raw`<p>1 dm³ = 1 lít, nên bình chứa được khoảng <b>13,33 lít</b>.</p>` } })
  }

  // ═════════════ DẠNG 3 — PHẢI TỰ XÂY S(x) ═════════════
  // Cốc nghiêng — chung một khuôn cho R = 6 (câu 1) và R = 8 (câu 4)
  const coc = (id, stt, maCau, hinh, R, H, dapSo, ten) => {
    const w = t => Math.sqrt(Math.max(0, R * R - t * t)), k = H / R
    const V = (k / 2) * (4 * R ** 3 / 3), cc = (r, h) => { const P = []; for (let i = 0; i <= 64; i++) { const g = 2 * PI * i / 64; P.push([R * Math.cos(g), R * Math.sin(g), h]) } return P }
    DS.push({ id, nhom: 3, stt, maCau, hinh, ten, dapSo,
      kieu: 'ring', truc: 'x', a: -R, b: R, poly: t => [[0, 0], [w(t), 0], [w(t), k * w(t)]], S: t => 0.5 * k * (R * R - t * t), V0: V, dv: 'cm³', donVi: 'cm', mauDau: true, buocX: R / 12,
      de: { tieuDe: 'Nước trong cốc nghiêng',
        html: String.raw`<p>Cốc hình trụ có bán kính đáy <b><i>R</i> = ${R}</b> cm, cao <b><i>h</i> = ${H}</b> cm. Nghiêng cốc tới khi nước <b>vừa chạm miệng cốc</b>, lúc đó ở đáy mực nước trùng với một <b>đường kính của đáy</b>.</p><p>Tính thể tích nước trong cốc (cm³). Gắn trục <i>Ox</i> theo đường kính đó.</p>`,
        chips: ['R = ' + R + ' cm', 'h = ' + H + ' cm', 'nước chạm miệng cốc', 'V = ?'] },
      dung: { html: String.raw`<p>Khối nước là cái <b>nêm</b> cắt từ hình trụ. Mặt phẳng vuông góc với đường kính <i>Ox</i> cắt nêm theo một <b>tam giác vuông</b>: một cạnh góc vuông nằm trên đáy cốc, cạnh kia thẳng đứng.</p>` },
      lat: { chu: [{ tex: String.raw`d=\sqrt{R^2-x^2}`, ghi: 'cạnh góc vuông nằm trên đáy' }, { tex: String.raw`c=\dfrac{h}{R}\,d`, ghi: 'cạnh thẳng đứng (đồng dạng)' }], res: String.raw`S(x)=\dfrac12\,d\,c=\dfrac{h}{2R}\left(R^2-x^2\right)`,
        so: x => [String.raw`S(${xt(x)})=\dfrac{${H}}{${2 * R}}\left(${R * R}-${xb(x)}^2\right)=${tn(0.5 * k * (R * R - x * x), 3)}\ \text{cm}^2`] },
      tong: { moc: 'x từ −R tới R: −' + R + ' tới ' + R, so: String.raw`\begin{aligned}V&=\frac{h}{2R}\int_{-R}^{R}\left(R^2-x^2\right)\mathrm{d}x=\frac{h}{2R}\cdot\frac{4R^3}{3}=\frac{2hR^2}{3}\\[0.4em]&=\frac{2\cdot ${H}\cdot ${R}^2}{3}\approx ${tn(V, 2)}\ \text{cm}^3\end{aligned}`, ket: String.raw`<p>Chữ lộ ra điều số che mất: thể tích nước bằng <b>2/3 thể tích hình trụ</b> <i>πR</i>²<i>h</i> chia cho π, tức tỉ số nước/cốc là 2/(3π), không phụ thuộc <i>R</i>, <i>h</i>.</p><p>Muốn xem cốc nghiêng chuyển động: <a href="coc-nghieng.html">mô hình cốc nghiêng</a> (R = 6, h = 10).</p>` },
      phu3d: () => [cc(R, 0), cc(R, H), [[-R, 0, 0], [-R, 0, H]], [[R, 0, 0], [R, 0, H]], [[0, -R, 0], [0, -R, H]], [[0, R, 0], [0, R, H]]] })
  }
  coc('coc-nghieng-6', 'Dạng 3 · câu 1', 'T112050103002', HINH.coc, 6, 10, '240 cm³', 'Cốc nước nghiêng (R = 6)')
  // Lều vải — lát nằm ngang là hình vuông xoay 45°
  { const d = t => Math.sqrt(Math.max(0, 2 - 40 / 27 * t))
    DS.push({ id: 'leu-vai', nhom: 3, stt: 'Dạng 3 · câu 3 (ví dụ)', maCau: 'LOP004928', hinh: HINH.leuVai, ten: 'Lều vải du lịch', dapSo: '2,7 m³',
      kieu: 'ring', truc: 'dung', a: 0, b: 1.35, poly: t => [[d(t), 0], [0, d(t)], [-d(t), 0], [0, -d(t)]], S: t => 2 * d(t) ** 2, V0: 2.7, dv: 'm³', donVi: 'm', mauDau: false, buocX: 0.075,
      de: { tieuDe: 'Thể tích chiếc lều vải',
        html: String.raw`<p>Lều có đáy là <b>hình vuông cạnh 2 m</b>, và hai xương dây <i>a</i>, <i>b</i> nằm trên các parabol có đỉnh <i>S</i>. Chiều cao <i>SO</i> = 1,35 m (<i>O</i> là tâm đáy).</p><p>Tính thể tích chiếc lều (m³).</p>`,
        chips: ['đáy vuông cạnh 2 m', 'SO = 1,35 m', 'xương dây là parabol', 'V = ?'] },
      dung: { html: String.raw`<p>Hai parabol nằm trong hai mặt phẳng đứng đi qua <b>hai đường chéo</b> của đáy. Mặt phẳng nằm ngang cắt lều theo một <b>hình vuông</b> có hai đỉnh trên mỗi parabol.</p>` },
      lat: { chu: [{ tex: String.raw`h=\dfrac{27}{20}-\dfrac{27}{40}d^2`, ghi: 'parabol qua (±√2; 0), đỉnh cao 27/20' }, { tex: String.raw`d^2=2-\dfrac{40}{27}\,h`, ghi: 'nửa đường chéo của lát ở độ cao h' }], res: String.raw`S=2d^2`,
        so: h => [String.raw`d^2=2-\dfrac{40}{27}\cdot ${xb(h)}=${tn(d(h) ** 2, 4)}`, String.raw`S(${xt(h)})=2d^2=${tn(2 * d(h) ** 2, 4)}\ \text{m}^2`] },
      tong: { moc: 'độ cao h từ 0 tới 27/20', so: String.raw`\begin{aligned}V&=\int_0^{27/20}\left(4-\frac{80}{27}h\right)\mathrm{d}h=\left[4h-\frac{40}{27}h^2\right]_0^{27/20}\\[0.4em]&=\frac{27}{5}-\frac{27}{10}=2{,}7\ \text{m}^3\end{aligned}`, ket: '' } })
  }
  coc('coc-nghieng-8', 'Dạng 3 · câu 4', 'T1120000002675', HINH.coc2, 8, 10, '427 cm³', 'Cốc nước nghiêng (R = 8)')
  // Núi — thiết diện parabol có đỉnh trên nửa đường tròn
  { const w = x => 0.5 * Math.sqrt(Math.max(0, 200 * 200 - x * x)), k = x => Math.sqrt(Math.max(0, 200 * 200 - x * x)), V = 2 / 3 * (2 * 40000 * 200 - 2 * 200 ** 3 / 3)
    DS.push({ id: 'ngon-nui', nhom: 3, stt: 'Dạng 3 · câu 5', maCau: 'T1120000001014', hinh: HINH.nui, ten: 'Ngọn núi san lấp', dapSo: '7,11 triệu m³',
      kieu: 'ring', truc: 'x', a: -200, b: 200, poly: t => { const P = [], ww = w(t), kk = k(t); for (let j = 0; j <= 30; j++) { const u = -ww + 2 * ww * j / 30; P.push([u, ww > 0 ? kk * (1 - (u / ww) ** 2) : 0]) } return P },
      S: t => 2 / 3 * (2 * w(t)) * k(t), V0: V, dv: 'm³', donVi: 'm', mauDau: true, buocX: 10,
      de: { tieuDe: 'Thể tích ngọn núi',
        html: String.raw`<p>Chân núi là elip có trục lớn <i>AB</i> = 400 m, trục bé <i>CD</i> = 200 m. Mặt cắt bởi mặt phẳng chứa <i>AB</i> và vuông góc với mặt đất là <b>nửa hình tròn</b> đường kính <i>AB</i>. Mặt cắt bởi các mặt phẳng <b>vuông góc với <i>AB</i></b> là <b>parabol</b> có đỉnh thuộc nửa đường tròn đó.</p><p>Tính thể tích ngọn núi (triệu m³), làm tròn đến hàng phần trăm.</p>`,
        chips: ['elip: 400 m × 200 m', 'mặt cắt dọc: nửa hình tròn', 'mặt cắt ngang: parabol', 'V = ? triệu m³'] },
      dung: { html: String.raw`<p>Đặt <i>Ox</i> theo <i>AB</i>. Tại mỗi <i>x</i>, lát là một <b>hình parabol</b>: đáy nằm trên mặt đất (một dây của elip), đỉnh nằm trên nửa đường tròn <i>x</i>² + <i>z</i>² = 200².</p>` },
      lat: { chu: [{ tex: String.raw`b=2y=\sqrt{200^2-x^2}`, ghi: 'đáy parabol: dây của elip' }, { tex: String.raw`c=\sqrt{200^2-x^2}`, ghi: 'cao parabol: đỉnh ở nửa đường tròn' }], res: String.raw`S(x)=\dfrac23\,b\,c=\dfrac23\left(200^2-x^2\right)`,
        so: x => [String.raw`b=c=\sqrt{${40000}-${xb(x)}^2}=${tn(k(x), 2)}`, String.raw`S(${xt(x)})=\dfrac23\cdot ${tn(k(x), 2)}^2=${tn(2 / 3 * k(x) ** 2, 1)}\ \text{m}^2`] },
      tong: { moc: 'x từ −200 tới 200', so: String.raw`\begin{aligned}V&=\frac23\int_{-200}^{200}\left(200^2-x^2\right)\mathrm{d}x=\frac23\cdot\frac{4\cdot 200^3}{3}\\[0.4em]&\approx ${tn(V / 1e6, 4)}\cdot 10^6\ \text{m}^3\approx ${tn(V / 1e6, 2)}\cdot 10^6\ \text{m}^3\end{aligned}`, ket: String.raw`<p>Diện tích parabol (bị cắt bởi dây) bằng <b>2/3 đáy × cao</b>. Kết quả: <b>7,11 triệu m³</b>.</p>` },
      phu3d: () => { const E = [], A = []; for (let i = 0; i <= 80; i++) { const g = 2 * PI * i / 80; E.push([200 * Math.cos(g), 100 * Math.sin(g), 0]) } for (let i = 0; i <= 60; i++) { const g = PI * i / 60; A.push([200 * Math.cos(g), 0, 200 * Math.sin(g)]) } return [E, A] } })
  }
  // Bể trụ nằm ngang — mặt cắt là hình viên phân, không đổi dọc chiều dài
  { const Rr = 2, L = 6, f0 = 2 * PI / 3, prof = []; for (let i = 0; i <= 48; i++) { const g = -f0 + 2 * f0 * i / 48; prof.push([Rr * Math.sin(g), Rr - Rr * Math.cos(g)]) }
    const Sv = 8 * PI / 3 + R3, V = L * Sv
    const cc = h => { const P = []; for (let i = 0; i <= 64; i++) { const g = 2 * PI * i / 64; P.push([h, Rr * Math.sin(g), Rr + Rr * Math.cos(g)]) } return P }
    DS.push({ id: 'be-tru-ngang', nhom: 3, stt: 'Dạng 3 · câu 6', maCau: 'T112000000482', hinh: HINH.beTru, ten: 'Bể nhiên liệu hình trụ nằm ngang', dapSo: '60,7 m³',
      kieu: 'ep', truc: 'x', a: 0, b: L, profile: prof, S: () => Sv, V0: V, dv: 'm³', donVi: 'm',
      de: { tieuDe: 'Thể tích nhiên liệu trong bể',
        html: String.raw`<p>Bể chứa nhiên liệu hình trụ <b>nằm ngang</b>, dài <i>L</i> = 6 m, bán kính đáy <i>R</i> = 2 m. Mực nhiên liệu cao <i>h</i> = 3 m (tính từ điểm thấp nhất của đáy bể).</p><p>Tính thể tích nhiên liệu trong bể (m³), làm tròn đến hàng phần mười.</p>`,
        chips: ['dài 6 m', 'R = 2 m', 'mực nhiên liệu cao 3 m', 'V = ?'] },
      dung: { html: String.raw`<p>Cắt bể bằng mặt phẳng vuông góc với trục bể: lát là <b>hình viên phân</b> (phần hình tròn nằm dưới mặt thoáng), và lát <b>giống nhau</b> dọc chiều dài 6 m. Phần đường nét mảnh là thành bể.</p>` },
      lat: { chu: [{ tex: String.raw`\cos\alpha=\dfrac{h-R}{R}`, ghi: '2α: góc ở tâm của phần KHÔNG chứa nhiên liệu' }, { tex: String.raw`S_{\text{vp}}=\dfrac{R^2}{2}\left(2\alpha-\sin 2\alpha\right)`, ghi: 'viên phân không chứa nhiên liệu' }], res: String.raw`S=\pi R^2-S_{\text{vp}}`,
        so: () => [String.raw`\cos\alpha=\dfrac{3-2}{2}=\dfrac12\Rightarrow\alpha=\dfrac{\pi}{3}`, String.raw`S_{\text{vp}}=2\left(\dfrac{2\pi}{3}-\dfrac{\sqrt3}{2}\right),\quad S=4\pi-S_{\text{vp}}=\dfrac{8\pi}{3}+\sqrt3\approx ${tn(Sv)}`] },
      tong: { moc: 'dài L = 6 m', so: String.raw`V=S\cdot L=\left(\frac{8\pi}{3}+\sqrt3\right)\cdot 6=16\pi+6\sqrt3\approx ${tn(V, 2)}\ \text{m}^3`, ket: '' },
      phu3d: () => [cc(0), cc(L), [[0, -Rr, Rr], [L, -Rr, Rr]], [[0, Rr, Rr], [L, Rr, Rr]]] })
  }
  // Lavabo — thiết diện parabol, đáy ở miệng, đỉnh dưới đáy
  { const w = x => Math.sqrt(Math.max(0, 400 - x * x)), V = 4 / 3 * (2 * 400 * 20 - 2 * 8000 / 3)
    DS.push({ id: 'lavabo', nhom: 3, stt: 'Dạng 3 · câu 7', maCau: 'T1120000005007', hinh: HINH.lavabo, ten: 'Lavabo', dapSo: '14,2 lít',
      kieu: 'ring', truc: 'x', a: -20, b: 20, poly: t => { const P = [], ww = w(t); for (let j = 0; j <= 30; j++) { const u = -ww + 2 * ww * j / 30; P.push([u, ww > 0 ? -ww * (1 - (u / ww) ** 2) : 0]) } return P },
      S: t => 4 / 3 * w(t) ** 2, V0: V, dv: 'cm³', donVi: 'cm', mauDau: true, buocX: 1,
      de: { tieuDe: 'Thể tích chứa nước của lavabo',
        html: String.raw`<p>Lavabo có vành mép là đường tròn bán kính <b>20 cm</b>. Cắt dọc theo đường kính của vành bởi mặt phẳng vuông góc với mặt vành thì thiết diện là <b>nửa đường tròn</b> bán kính 20 cm. Cắt bởi mặt phẳng <b>vuông góc với đường kính đó</b> thì thiết diện là <b>parabol</b> có đỉnh thuộc nửa đường tròn cắt dọc.</p><p>Tính thể tích chứa nước của lavabo, theo lít, làm tròn đến hàng phần mười.</p>`,
        chips: ['vành tròn R = 20 cm', 'mặt cắt dọc: nửa đường tròn', 'mặt cắt ngang: parabol', 'V = ? lít'] },
      dung: { html: String.raw`<p>Đặt <i>Ox</i> theo đường kính vành. Tại mỗi <i>x</i>, lát là <b>hình parabol</b> có đáy <i>BC</i> nằm ở mặt vành, đỉnh <i>M</i> <b>nằm sâu phía dưới</b> trên nửa đường tròn cắt dọc.</p>` },
      lat: { chu: [{ tex: String.raw`BC=2\sqrt{R^2-x^2}`, ghi: 'đáy parabol: dây của vành' }, { tex: String.raw`IM=\sqrt{R^2-x^2}`, ghi: 'độ sâu: đỉnh ở nửa đường tròn' }], res: String.raw`S(x)=\dfrac23\,BC\cdot IM=\dfrac43\left(R^2-x^2\right)`,
        so: x => [String.raw`IM=\sqrt{400-${xb(x)}^2}=${tn(w(x), 2)}`, String.raw`S(${xt(x)})=\dfrac43\left(400-${xb(x)}^2\right)=${tn(4 / 3 * w(x) ** 2, 2)}\ \text{cm}^2`] },
      tong: { moc: 'x từ −20 tới 20', so: String.raw`\begin{aligned}V&=\frac43\int_{-20}^{20}\left(400-x^2\right)\mathrm{d}x=\frac43\cdot\frac{4\cdot 20^3}{3}\approx ${tn(V, 0)}\ \text{cm}^3\\[0.4em]&\approx ${tn(V / 1000, 1)}\ \text{lit}\end{aligned}`, ket: String.raw`<p>1000 cm³ = 1 lít, nên lavabo chứa được khoảng <b>14,2 lít</b>.</p>` },
      phu3d: () => { const E = [], A = []; for (let i = 0; i <= 80; i++) { const g = 2 * PI * i / 80; E.push([20 * Math.cos(g), 20 * Math.sin(g), 0]) } for (let i = 0; i <= 60; i++) { const g = PI * i / 60; A.push([20 * Math.cos(g), 0, -20 * Math.sin(g)]) } return [E, A] } })
  }

  // ═════════════ BÀI ĐÃ CÓ MÔ HÌNH RIÊNG (trang riêng) — chỉ hiện ở bảng chọn bài ═════════════
  const RIENG = [
    { id: 'day-tron-tam-giac-deu', nhom: 2, stt: 'Dạng 2 · câu 8', maCau: 'T1120000002914', hinh: null, ten: 'Đáy tròn, thiết diện tam giác đều', dapSo: '259', lienKet: 'thiet-dien-day-tron.html' },
    { id: 'mai-vom', nhom: 3, stt: 'Dạng 3 · câu 2', maCau: 'T1120000002741', hinh: null, ten: 'Mái vòm sân vận động', dapSo: '≈ 115 586 m³', lienKet: 'mai-vom.html' },
  ]
  DS.RIENG = RIENG
  return DS
})()
