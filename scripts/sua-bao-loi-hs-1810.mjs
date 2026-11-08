// Sửa các câu HS báo lỗi 10–17/10 (Thùy 18/10). Thử: node --env-file=.env scripts/sua-bao-loi-hs-1810.mjs   Ghi thật: thêm --ghi
import pg from 'pg';
const GHI = process.argv.includes('--ghi');
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
await c.query('begin');
const q = (s, p) => c.query(s, p).then(r => r.rows);
const log = [];

// ── 1. Sửa NỘI DUNG câu gốc (trigger trg_log_kho_sua tự ghi kho_sua_log) ──
const SUA_CAU = [
  ['dai', 'T106020701004', { dap_an: '33', loi_giai: [
    'Sau khi 3 bạn nam chuyển đi, số bạn nam nhiều hơn số bạn nữ là: $15 - 3 = 12$ (bạn).',
    'Lúc này số bạn nữ bằng $\\dfrac{3}{5}$ số bạn nam, nên $12$ bạn ứng với $1 - \\dfrac{3}{5} = \\dfrac{2}{5}$ số bạn nam.',
    'Số bạn nam lúc này là: $12 : \\dfrac{2}{5} = 30$ (bạn).',
    'Số bạn nam lúc đầu là: $30 + 3 = 33$ (bạn).',
    'Vậy lúc đầu có $33$ bạn nam.'].join('\n') }],
  ['dai', '077020101050', { dap_an: '$0{,}46$; $0{,}41(6)$; $-0{,}35$; $2{,}(27)$', loi_giai: [
    '$\\dfrac{23}{50}=0{,}46$', '$\\dfrac{5}{12}=0{,}41(6)$', '$-\\dfrac{7}{20}=-0{,}35$', '$\\dfrac{25}{11}=2{,}(27)$'].join('\n') }],
  ['dai', 'T107010101013', { lua_chon: ['$\\dfrac{-8}{11}$', '$\\dfrac{2{,}3}{4{,}1}$', '$\\dfrac{10}{0}$', '$\\dfrac{-5{,}9}{6}$'] }],
  ['dai', 'T108010402004', { loi_giai: [
    '$(8x^4y^2 - 10x^2y^3 + 4x^3y^4) : 2x^2y$',
    '$= 8x^4y^2 : 2x^2y - 10x^2y^3 : 2x^2y + 4x^3y^4 : 2x^2y$',
    '$= 4x^2y - 5y^2 + 2xy^3$'].join('\n') }],
  ['dai', 'T108010402015', { loi_giai: [
    '$(10x^6y^4 + 5x^5y^5 - 15x^4y^6) : 5x^4y^3$',
    '$= 10x^6y^4 : 5x^4y^3 + 5x^5y^5 : 5x^4y^3 - 15x^4y^6 : 5x^4y^3$',
    '$= 2x^2y + xy^2 - 3y^3$'].join('\n') }],
  ['dai', 'T108010402019', { loi_giai: [
    '$(18x^5y^4 + 9x^4y^5 - 3x^3y^6) : 3x^3y^3$',
    '$= 18x^5y^4 : 3x^3y^3 + 9x^4y^5 : 3x^3y^3 - 3x^3y^6 : 3x^3y^3$',
    '$= 6x^2y + 3xy^2 - y^3$'].join('\n') }],
  ['dai', 'T108010403018', { noi_dung: 'Tính: $(x^3 + 6x^2 + 11x + 12) : (x + 4)$',
    loi_giai: '$(x^3 + 6x^2 + 11x + 12) : (x + 4) = x^2 + 2x + 3$ dư $0$' }],
  ['dai', 'T108020501043', { noi_dung: 'Điền biểu thức thích hợp vào chỗ chấm: $x^3 + 216 = (x+6)(\\ldots)$' }],
  ['dai', 'T110030201019', { lua_chon: ['$\\dfrac{a}{\\sin B}=\\dfrac{b}{\\sin C}=\\dfrac{c}{\\sin A}$', '$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=R$', '$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}$', '$\\dfrac{b}{\\sin A}=\\dfrac{a}{\\sin B}$'] }],
  ['dai', 'T110030201032', { lua_chon: ['$b^2 = a^2 + c^2 + ac \\cdot 2$', '$b^2 = a^2 + c^2 - 3ac$', '$b^2 = a^2 + c^2 + ac$', '$b^2 = a^2 + c^2 + 3ac$'] }],
  ['dai', 'T110030203035', { dap_an: 'B' }],
  ['dai', 'T111060204042', {
    noi_dung: 'Cho cấp số cộng $(u_n)$ thỏa mãn $\\begin{cases}3u_2+S_4=25\\\\ S_6+2u_5=54\\end{cases}$. Tìm số hạng đầu $u_1$ và công sai $d$.',
    lua_chon: ['$u_1 = 2, d = 1$', '$u_1 = -1, d = 2$', '$u_1 = 1, d = -2$', '$u_1 = 1, d = 2$'],
    loi_giai: [
      'Ta có $u_2 = u_1 + d$, $u_5 = u_1 + 4d$, $S_4 = 2(2u_1 + 3d)$, $S_6 = 3(2u_1 + 5d)$.',
      'Hệ đã cho tương đương $\\begin{cases} 3(u_1 + d) + 2(2u_1 + 3d) = 25 \\\\ 3(2u_1 + 5d) + 2(u_1 + 4d) = 54 \\end{cases} \\Leftrightarrow \\begin{cases} 7u_1 + 9d = 25 \\\\ 8u_1 + 23d = 54 \\end{cases} \\Leftrightarrow \\begin{cases} u_1 = 1 \\\\ d = 2 \\end{cases}$',
      'Chọn D.'].join('\n') }],
  ['hgt', 'T306010101038', { noi_dung_truoc: 'Bà Lan có một mảnh vườn hình chữ nhật chiều dài $20\\,\\text{m}$, chiều rộng $5\\,\\text{m}$. Bà dùng một phần đất hình vuông có cạnh bằng chiều rộng mảnh vườn để trồng hoa, phần còn lại trồng cỏ.\n' }],
  ['hgt', 'T310010102064', { dap_an: 'D' }],
];
for (const [mon, ma, s] of SUA_CAU) {
  const t = `${mon}_cau_hoi`;
  const [cu] = await q(`select noi_dung, lua_chon, dap_an, loi_giai from ${t} where ma_cau = $1`, [ma]);
  if (!cu) throw new Error('không thấy ' + ma);
  const moi = { ...s };
  if (moi.noi_dung_truoc) { if (cu.noi_dung.startsWith('Bà Lan')) delete moi.noi_dung_truoc; else { moi.noi_dung = moi.noi_dung_truoc + cu.noi_dung; delete moi.noi_dung_truoc; } }
  const cols = Object.keys(moi); if (!cols.length) continue;
  const set = cols.map((k, i) => `${k} = $${i + 2}${k === 'lua_chon' ? '::jsonb' : ''}`).join(', ');
  await q(`update ${t} set ${set} where ma_cau = $1`, [ma, ...cols.map(k => k === 'lua_chon' ? JSON.stringify(moi[k]) : moi[k])]);
  log.push({ ma, sua: cols, cu: Object.fromEntries(cols.map(k => [k, cu[k]])), moi });
}

// ── 2. Sửa / dựng lại FORM trắc nghiệm (dai_cau_form_tn) ──
const F = (text, rule) => rule ? { text, rule, dung: false } : { text, rule: null, dung: true };
const SUA_FORM = {
  '077020101050': ['D', '0,46;0,41(6);-0,35;2,(27)', [F('$0{,}46;\\ 0{,}416;\\ -0{,}35;\\ 2{,}27$', 'R43'), F('$0{,}46;\\ 0{,}(416);\\ -0{,}35;\\ 2{,}(27)$', 'R38'), F('$0{,}46;\\ 0{,}41(6);\\ 0{,}35;\\ 2{,}(27)$', 'R26'), F('$0{,}46;\\ 0{,}41(6);\\ -0{,}35;\\ 2{,}(27)$')]],
  '077022220401080': ['C', '4,5', [F('$9$', 'R343'), F('$5{,}5$', 'R344'), F('$4{,}5$'), F('$3{,}5$', 'R345')]],
  'T104010103026': ['D', '30000;60000', [F('$40\\,000;\\ 60\\,000$', 'R344'), F('$25\\,000;\\ 60\\,000$', 'R345'), F('$30\\,000;\\ 70\\,000$', 'R346'), F('$30\\,000;\\ 60\\,000$')]],
  'T104010103028': ['B', '32000;56000', [F('$30\\,000;\\ 56\\,000$', 'R344'), F('$32\\,000;\\ 56\\,000$'), F('$36\\,000;\\ 56\\,000$', 'R345'), F('$32\\,000;\\ 60\\,000$', 'R346')]],
  'T105040103023': ['C', '10,145', [F('$10{,}0145$', 'R103'), F('$0{,}145$', 'R40'), F('$10{,}145$'), F('$101{,}45$', 'R11')]],
  'T105040103028': ['D', '8 5/10', [F('$8\\dfrac{5}{100}$', 'R103'), F('$5\\dfrac{8}{10}$', 'R27'), F('$85\\dfrac{1}{10}$', 'R27'), F('$8\\dfrac{5}{10}$')]],
  'T106020701004': ['A', '33', [F('$33$'), F('$30$', 'R69'), F('$18$', 'R346'), F('$36$', 'R102')]],
  'T108010402015': ['A', null, [F('$xy^2 + 2x^2y - 3y^3$'), F('$-15x^4y^6 + 5x^5y^5 + 2x^2y$', 'R151'), F('$2x^{10}y^7 - 3x^8y^9 + x^9y^8$', 'R152'), F('$5xy^2 + 10x^2y - 15y^3$', 'R153')]],
  'T108010403018': ['A', null, [F('$x^2 + 2x + 3$ dư $0$'), F('$x^2$ dư $2x^2 + 11x + 12$', 'R155'), F('$x^2 + 10x + 51$ dư $216$', 'R156'), F('$2x^2 + 2x + 3$ dư $0$', 'R158')]],
};
for (const [ma, [da, key, lc]] of Object.entries(SUA_FORM)) {
  const [cu] = await q(`select id, lua_chon, dap_an, key_gia_tri from dai_cau_form_tn where ma_cau = $1 and xoa_at is null`, [ma]);
  await q(`update dai_cau_form_tn set lua_chon = $2::jsonb, dap_an = $3, key_gia_tri = coalesce($4, key_gia_tri), nguon = 'nguoi' where id = $1`, [cu.id, JSON.stringify(lc), da, key]);
  log.push({ ma, form: true, cu: cu.lua_chon.map(e => e.text), moi: lc.map(e => e.text), da });
}

// ── 3. (BỎ 18/10) Thu hồi form máy sinh hỏng — CHUYỂN sang phiên "Sinh lại form TN" (form-tn-sinh-lai-1810.md).
// Bộ lọc cũ `\d,\d` bắt NHẦM 15 form ĐÚNG (T103020304001–013, T104010302012/013): ở đó phẩy là dấu LIỆT KÊ nhiều đáp số
// ("8,20,28,36"), không phải phẩy thập phân. Bài học: phẩy giữa 2 chữ số chưa chắc là thập phân — phải nhìn cả dạng đáp số.
const thuHoi = [];

// ── 4. Chấm lại bài đã làm: key ảnh chụp sai (đúng theo NỘI DUNG phương án, không theo vị trí) ──
const CHAM = [
  ['T110030203035', '$30^{\\circ}$', 'đáp án đúng 30° (sin C = 1/2, C < B) — key cũ D=45°'],
  ['T110030201029', '$AB^2 = BC^2 + CA^2 - 2BC \\cdot CA \\cdot \\cos B$', 'phương án SAI là AB² = … cos B — key cũ C'],
  ['T310010102064', '$\\vec{OB}-\\vec{OA}=\\vec{OC}-\\vec{OD}$.', 'OB − OA = OC − OD ⇔ AB = DC — key cũ B'],
];
const chamLai = [];
for (const [ma, text, ly] of CHAM) {
  const snaps = await q(`select id, lua_chon, dap_an_key from bai_test_cau where ma_cau = $1 and loai_cau = 'trac_nghiem' and form_tn_id is null`, [ma]);
  for (const s of snaps) {
    const i = (s.lua_chon || []).findIndex(t => t.trim() === text);
    if (i < 0) { chamLai.push({ ma, id: s.id, bo_qua: 'không tìm thấy phương án theo nội dung' }); continue; }
    const k = 'ABCD'[i];
    if (s.dap_an_key === k) continue;
    const [r] = await q(`select public.fn_sua_key_va_cham_lai($1, to_jsonb($2::text), $3) r`, [s.id, k, `[18/10 HS báo lỗi] ${ly}`]);
    chamLai.push({ ma, id: s.id, key_cu: s.dap_an_key, key_moi: k, ...r.r });
  }
}

// ── 5. Đóng các báo lỗi câu (trạng thái + ghi chú xử lý) ──
const KQ = {
  da_xu_ly: {
    '077020101050': 'Form trắc nghiệm sai (máy đổi số thập phân thành phân số) — dựng lại 4 phương án; đáp số kho đổi sang dấu phẩy',
    '077022220401080': 'Form đọc 4,5 thành "4;5" — dựng lại phương án',
    'T104010103026': 'Form đọc 30 000 thành "0" — dựng lại phương án',
    'T104010103028': 'Form đọc 32 000 thành "0" — dựng lại phương án',
    'T105040103023': 'Đề hỏi số thập phân mà phương án là phân số — đổi phương án sang số thập phân',
    'T105040103028': 'Đề hỏi hỗn số mà phương án là phân số — đổi phương án sang hỗn số',
    'T105040205037': 'Đề đúng (1460). Lỗi hiển thị: số thập phân trong công thức hiện "1, 46" — sửa bộ hiển thị',
    'T106020701004': 'Đáp số kho SAI (30 là số nam SAU khi chuyển) — sửa thành 33, viết lại lời giải + phương án',
    'T107010101013': 'Đổi 2.3 / 5.9 sang dấu phẩy 2,3 / 5,9',
    'T108010402004': 'Đáp án đúng; lời giải trống (chỉ chép lại đề) — viết lời giải',
    'T108010402015': 'Đáp án đúng; phương án C hỏng công thức x^10 — sửa; viết lời giải',
    'T108010402019': 'Đáp án đúng (A); viết lời giải',
    'T108010403018': 'Đề thiếu ngoặc; chữ "dư" nằm trong công thức nên dính chữ — sửa đề + phương án',
    'T108020501043': 'Đề mất vế trái (chỉ còn chấm chấm) — viết lại đề x³ + 216 = (x + 6)(…)',
    'T110030201019': 'Có 2 phương án đúng (A và C chỉ đổi thứ tự) — thay phương án A',
    'T110030201029': 'Key cũ C sai (đã sửa kho 16/10) — chấm lại bài theo key D',
    'T110030201032': 'Không phương án nào đúng (đúng là b² = a² + c² + ac) — sửa phương án C',
    'T110030203035': 'Đáp án kho D sai, đúng là B (30°) — sửa + chấm lại',
    'T111060204042': 'Đề mâu thuẫn đáp án (với S_3 không phương án nào đúng; lời giải tính ra 7u₁+9d=25 ứng với S_4) — sửa đề thành S_4, viết lại lời giải (đang lỗi \\n)',
    'T306010101038': 'Đề thiếu dữ kiện (kích thước vườn) — bổ sung từ lời giải',
    'T310010102064': 'Đáp án kho B sai, đúng là D (AB = DC) — sửa + chấm lại',
  },
  khong_loi: {
    'T104020102015': 'Câu đúng (62 500). Ghi chú của em là về nút "Xem kết quả" — chuyển sang lỗi app',
    'T105010202013': 'Câu đúng (2500) — tài khoản TEST',
    'T107010206055': 'Câu đúng (10)',
    'T107010403001': 'Câu đúng (−19/10). Ghi chú "ấn câu này chọn câu khác" — chuyển sang lỗi app',
    'T110030201031': 'Chỉ D đúng (B sai mẫu 2ab, C thiếu hệ số 2)',
    'T14T180201057': 'Câu đúng (4/5). Em hỏi vì sao 4T có phân số — câu hỏi chương trình, chuyển Thùy',
    'T15T010101052': 'Câu đúng (276; 253) — phương án D',
    'T15T010103023': 'Câu đúng (37)',
    'T15T010103038': 'Câu đúng (39)',
    'T15T010202005': 'Câu đúng (49; 42; 56)',
  },
};
const dong = {};
for (const [kq, m] of Object.entries(KQ)) for (const [ma, gc] of Object.entries(m)) {
  const r = await q(`update bai_cau_bao_loi set trang_thai = $1, xu_ly_at = now(), xu_ly_ghi_chu = $3 where ma_cau = $2 and trang_thai = 'moi' returning id`, [kq, ma, '[Claude 18/10] ' + gc]);
  dong[ma] = r.length;
}
const conMoi = await q(`select ma_cau from bai_cau_bao_loi where trang_thai = 'moi'`);

console.log(JSON.stringify({ log, thu_hoi: thuHoi.length, cham_lai: chamLai, dong, con_moi: conMoi }, null, 1));
await c.query(GHI ? 'commit' : 'rollback');
console.log(GHI ? '== ĐÃ GHI ==' : '== THỬ (rollback) ==');
await c.end();
