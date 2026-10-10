// ============================================================================
// can-xem.mjs — dựng trang "câu cần chị xem" của kho 8T (khuôn kho-rules/dai/k6-chua-chac.html): mỗi câu một thẻ gồm
// ẢNH CẮT TỪ SÁCH + đề / đáp án / lời giải đang nằm trong kho + việc cần quyết. Thùy 10/10: "Mấy câu sai cần review thì
// m phải cho t view cụ thể chứ".
//
//   node kho-rules/dai/lo/k8T/can-xem.mjs            → kho-rules/dai/k8T-can-xem.html
//
// Công thức dựng sẵn thành MathML (katex, output 'mathml') ⇒ trang không tải gì từ ngoài. Ảnh cắt bằng pdftoppm từ PDF gốc
// (toạ độ điểm ảnh ở 150 dpi, trang 900 × 1350). Danh sách thẻ viết tay ở mảng THE bên dưới — thêm lô thì thêm thẻ.
// ============================================================================
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import pg from 'pg'

const DIR = dirname(fileURLToPath(import.meta.url)), GOC = join(DIR, '..', '..', '..', '..')
const PDF = 'E:/BK ACADEMY/Tài liệu tham khảo/8T/HSG/Chuyên đề bồi dưỡng HSG Toán 8-NĐT.pdf'
const SACH = 'CĐ BD HSG Toán 8 – Nguyễn Đức Tấn'
const tam = process.env.K8T_XEM_TAM ?? mkdtempSync(join(tmpdir(), 'k8t-xem-'))
let soAnh = 0
/** cắt một dải ngang của trang PDF ⇒ data URI */
function cat(trang, y, cao) {
  const ra = join(tam, `a${++soAnh}`)
  execFileSync('pdftoppm', ['-r', '150', '-gray', '-f', String(trang), '-l', String(trang), '-x', '0', '-y', String(y), '-W', '900', '-H', String(cao), '-png', '-singlefile', PDF, ra])
  return `data:image/png;base64,${readFileSync(ra + '.png').toString('base64')}`
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (tex) => { try { return katex.renderToString(tex, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(tex)}</code>` } }
/** chữ có $…$ và **đậm** ⇒ HTML một dòng */
const dong = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const doan = (s) => String(s).split(/\n\n+/).map((d) => `<p>${dong(d).replace(/\n/g, '<br>')}</p>`).join('')

// ── dữ liệu: lô đã dựng + mã câu trên DB ────────────────────────────────────
const lo = Object.fromEntries(['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot'].flatMap((t) => JSON.parse(readFileSync(join(DIR, t + '.json'), 'utf8'))).map((c) => [c.ma_nguon, c]))
const bai = Object.fromEntries(['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot'].flatMap((t) => JSON.parse(readFileSync(join(DIR, t + '.bai.json'), 'utf8'))).map((b) => [b.ma, b]))
const mu = Object.assign({}, ...['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot'].map((t) => JSON.parse(readFileSync(join(DIR, t + '.mu.json'), 'utf8')).cau))
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')
const { rows: cauDb } = await db.query(`select ma_cau, noi_dung, dap_an, loi_giai, ten_de_goc, dang_chinh, da_duyet from dai_cau_hoi where xoa_at is null and left(dang_chinh, 4) = 'T18T'`)
const { rows: nhomDb } = await db.query(`select ma_dang, ten_chuyen_de, ten_dang from dai_ban_do where khoi = '8T'`)
await db.end()
const theoNguon = Object.fromEntries(cauDb.filter((r) => r.ten_de_goc?.startsWith(SACH)).map((r) => [r.ten_de_goc.slice(SACH.length + 3), r]))
const theoMa = Object.fromEntries(cauDb.map((r) => [r.ma_cau, r]))
const tenNhom = Object.fromEntries(nhomDb.map((r) => [r.ma_dang, `${r.ten_chuyen_de} › ${r.ten_dang}`]))

/** khối "đang nằm trong kho" của một câu theo mã nguồn (lấy từ DB — nguồn sự thật) */
function trongKho(ma, { loiGiai = true } = {}) {
  const r = theoNguon[ma]
  if (!r) { const c = lo[ma]; return c ? `<div class="kho chua"><div class="ma">chưa ghi vào kho · ${esc(ma)}</div>${doan(c.noi_dung)}<p class="da">Đáp án soạn: ${dong(c.dap_an)}</p></div>` : `<div class="kho chua"><div class="ma">chưa ghi vào kho · ${esc(ma)}</div></div>` }
  return `<div class="kho"><div class="ma"><code>${r.ma_cau}</code> · ${r.da_duyet ? 'đã duyệt' : 'chưa duyệt'} · ${esc(tenNhom[r.dang_chinh] ?? r.dang_chinh)}</div>${doan(r.noi_dung)}<p class="da">Đáp án: ${dong(r.dap_an ?? '')}</p>${loiGiai && r.loi_giai ? `<details><summary>Lời giải đang để trong kho</summary><div class="lg">${doan(r.loi_giai)}</div></details>` : ''}</div>`
}
const khoMa = (maCau) => { const r = theoMa[maCau]; return r ? `<div class="kho"><div class="ma"><code>${r.ma_cau}</code> · ${r.da_duyet ? 'đã duyệt' : 'chưa duyệt'} · ${esc(tenNhom[r.dang_chinh] ?? r.dang_chinh)}</div>${doan(r.noi_dung)}<p class="da">Đáp án: ${dong(r.dap_an ?? '')}</p></div>` : '' }
const anh = (trang, y, cao, chu) => `<figure><img alt="${esc(chu)}" src="${cat(trang, y, cao)}"><figcaption>${esc(chu)} · trang PDF ${trang}</figcaption></figure>`

// ── các thẻ ──────────────────────────────────────────────────────────────────
let so = 0
const the = (tieuDe, than, quyet, xong = false) => `<section class="the"><h3><span class="so">${++so}</span>${esc(tieuDe)}</h3>${than}<p class="quyet"><span class="${xong ? 'dang xong' : 'dang'}">${xong ? 'Đã xử lý' : 'Cần chị quyết'}</span> ${dong(quyet)}</p></section>`
const muc = (nhan, html) => `<div class="muc"><div class="nhan">${esc(nhan)}</div><div class="nd">${html}</div></div>`

const A = [
  the('Bài 50 — sách in hai ý cùng một đa thức', anh(18, 1115, 200, 'Bài 50, đề và lời giải của sách')
    + muc('Trả lời câu hỏi của chị', doan('Đây là **đề bài của sách**, không phải bước biến đổi do tôi thêm: ý a) sách in sẵn dạng đã tách $x^2+3x+2x+6$, ý b) mới là dạng thường $x^2+5x+6$. Lời giải ý b) của sách đi qua đúng biểu thức của ý a).'))
    + muc('Ý a) — bản định xoá', trongKho('D1.50a@p18', { loiGiai: false })) + muc('Ý b) — bản giữ', trongKho('D1.50b@p18', { loiGiai: false })),
    'Xoá mềm ý a) (câu T18T010201025) vì cùng một đa thức, cùng đáp án với ý b)? Hay giữ cả hai như sách (ý a là bài tập làm quen cách nhóm)?'),
  the('Bài 53 — ý a) là ý b) đã thêm bớt sẵn', anh(19, 725, 190, 'Bài 53, đề và kết quả của sách')
    + muc('Trả lời câu hỏi của chị', doan('Cũng là **đề của sách**: ý a) in $x^4+4+4x^2-4x^2$ (đã thêm bớt $4x^2$ sẵn), ý b) là $x^4+4$. Hai ý cùng kết quả.'))
    + muc('Ý a) — bản định xoá', trongKho('D1.53a@p19', { loiGiai: false })) + muc('Ý b) — bản giữ', trongKho('D1.53b@p19', { loiGiai: false })),
    'Xoá mềm ý a) (câu T18T000000002)? Hay giữ cả hai?'),
]
const B = [
  the('Bài 35 ý b — đề sách thiếu điều kiện', anh(13, 1205, 90, 'Bài 35, đề') + anh(14, 95, 360, 'Bài 35, lời giải của sách (ý b dừng giữa chừng)')
    + muc('Vấn đề', doan('Sách in "Cho biết $a^4+b^4+c^4+d^4=4abcd$. Chứng minh rằng $a=b=c=d$" — sai khi các số trái dấu: $a=b=1$, $c=d=-1$ vẫn thoả giả thiết mà $a\\ne c$. Lời giải sách dừng ở tổng ba bình phương, không kết luận.'))
    + muc('Trong kho', trongKho('D1.35b@p13')), 'Chị đã bảo thêm "số dương" — đề trong kho đã sửa thành "Cho các số dương $a,b,c,d$ thoả mãn …". Chị xem lời giải.', true),
  the('Bài 55 ý d — sách in sai kết quả', anh(19, 1180, 135, 'Bài 55, đề') + anh(20, 395, 170, 'Bài 55, kết quả của sách cho ý c–f')
    + muc('Vấn đề', doan('Sách ghi $x^8+x^7+1=(x^2+x+1)(x^6-x^4+x^2-x+1)$. Nhân ra không bằng vế trái — hạng tử thứ ba phải là $x^3$: $(x^2+x+1)(x^6-x^4+x^3-x+1)$. Máy thay số bắt được, tôi mở ảnh xác nhận sách in $x^2$.'))
    + muc('Trong kho', trongKho('D1.55d@p19')), 'Kho ghi kết quả đúng. Chị xem lời giải.', true),
  the('Bài 82 ý c — sách in sai một nhân tử', anh(28, 840, 200, 'Bài 82, đề và kết quả của sách')
    + muc('Vấn đề', doan('Sách ghi $3x^4-75x^2y^2=3x^2(x+5y)(x-5xy)$. Nhân tử cuối phải là $(x-5y)$.')) + muc('Trong kho', trongKho('D1.82c@p28')), 'Kho ghi kết quả đúng.', true),
  the('Bài 84 ý b — sách in sai dấu', anh(28, 1195, 105, 'Bài 84, đề') + anh(29, 95, 80, 'Bài 84, kết quả của sách')
    + muc('Vấn đề', doan('Sách ghi kết quả ý b) là $(a-b)(b-c)(c-a)$. Thử $a=0$, $b=1$, $c=2$: đề cho $-2$, kết quả sách cho $+2$. Đúng là $(a-b)(a-c)(b-c)$.')) + muc('Trong kho', trongKho('D1.84b@p28')), 'Kho ghi kết quả đúng.', true),
  the('Bài 38 ý c — một dòng biến đổi của sách sai và lược bước', anh(15, 595, 135, 'Bài 38 c, đề') + anh(15, 1100, 200, 'Bài 38 c, lời giải của sách')
    + muc('Vấn đề', doan('Sách viết "$(a^{102}+b^{102})(a^{100}+b^{100})-2(a^{101}+b^{101})=0 \\Leftrightarrow\\dots\\Leftrightarrow(a^{51}-a^{50})^2+(b^{51}-b^{50})^2=0$". Dòng đầu không đúng (phải là **cộng**, không phải nhân): $(a^{102}+b^{102})-2(a^{101}+b^{101})+(a^{100}+b^{100})=0$. Đáp số $P=2$ của sách vẫn đúng.'))
    + muc('Trong kho', trongKho('D1.38c@p15')), 'Lời giải kho viết lại từ dòng đúng, đủ bước. Chị xem lời giải.', true),
  the('Bài 23 ý b — sách in sai dấu và chưa kết luận', anh(9, 1205, 80, 'Bài 23, đề') + anh(10, 95, 265, 'Bài 23, lời giải của sách')
    + muc('Vấn đề', doan('Dòng cuối sách in $-\\left[\\left(x-\\dfrac{5}{2}\\right)^2-120\\dfrac{3}{4}\\right]$ — phải là $+120\\dfrac{3}{4}$ (vì $127-\\dfrac{25}{4}=120\\dfrac{3}{4}$), và sách chưa nêu giá trị lớn nhất.'))
    + muc('Trong kho', trongKho('D1.23b@p9')), 'Kho ghi GTLN bằng $-\\dfrac{483}{4}$ khi $x=\\dfrac{5}{2}$.', true),
  the('Bài 89 ý b — đề có vấn đề, kết quả sách sai — CHƯA nhập', anh(30, 435, 625, 'Bài 89, đề và lời giải của sách')
    + muc('Vấn đề', doan('(1) Đề nói "gọi $x_1,\\dots,x_5$ là các nghiệm của $P(x)=3x^5+2x^2+2011$" — đa thức này chỉ có **một** nghiệm thực; năm nghiệm thì phải kể nghiệm phức, ngoài tầm lớp 8.\n\n(2) Sách viết $P(x)=(x-x_1)\\dots(x-x_5)$, quên hệ số cao nhất $3$ ⇒ kết quả $129385710$ sai gấp $9$ lần. Tính đúng: $32\\cdot\\dfrac{P\\left(\\frac12\\right)}{3}\\cdot\\dfrac{P(-1)}{3}=14376190$.')),
    'Bỏ hẳn câu này, hay nhập với kết quả đúng $14376190$ (lời giải vẫn dùng cách "phân tích theo nghiệm" như sách)?'),
]
const C = [
  the('Ba câu cùng họ "$a^{100}+b^{100}=a^{101}+b^{101}=a^{102}+b^{102}$"', anh(15, 595, 135, 'NĐT bài 38 c') + anh(18, 95, 170, 'NĐT bài 48')
    + muc('Câu đã duyệt từ trước', khoMa('T18T010301006')) + muc('Bài 38 c (mới)', trongKho('D1.38c@p15', { loiGiai: false })) + muc('Bài 48 (mới)', trongKho('D1.48@p18', { loiGiai: false }))
    + muc('Vì sao máy nghi', doan('Ba câu chỉ khác nguồn đề và số mũ cần tính ($2015$, $2010$, $2004$); đáp số đều bằng $2$, cách giải như nhau. Máy không tự bỏ loại này.')),
    'Giữ cả ba (ba đề thi khác nhau), hay chỉ giữ một?'),
  the('Bài 84 b và bài 57 b — hai đề khác nhau, cùng một đa thức', anh(20, 935, 85, 'NĐT bài 57, đề') + anh(28, 1195, 105, 'NĐT bài 84, đề')
    + muc('Bài 57 b', trongKho('D1.57b@p20', { loiGiai: false })) + muc('Bài 84 b', trongKho('D1.84b@p28', { loiGiai: false }))
    + muc('Vì sao máy nghi', doan('Khai triển đề bài 84 b ra thì được đúng đa thức của bài 57 b, nên kết quả giống nhau. Nhưng đề viết khác hẳn và bước đầu (khai triển, ước lược) là việc riêng của 84 b.')),
    'Tôi nghĩ nên giữ cả hai. Chị gật hay bỏ một?'),
]
const CHO = ['D1.36@p14', 'D1.55a@p19', 'D1.26b@p10', 'D1.26d@p11', 'D1.80a@p27', 'D1.80b@p27', 'D1.86@p29']
const D = CHO.map((ma) => {
  const c = lo[ma], a = c?.nhom_soan, b = mu[ma]?.dang
  const ten = (x) => (!x || /000000$/.test(x) ? 'không nhóm nào khớp (dạng chờ)' : tenNhom[x] ?? x)
  return the(`Bài ${bai[ma]?.bai}${bai[ma]?.y ? ' ' + bai[ma].y : ''} — hai lượt gán nhóm lệch nhau`, muc('Trong kho', trongKho(ma))
    + muc('Lượt soạn chọn', `<p>${esc(ten(a))}</p>`) + muc('Lượt gán độc lập chọn', `<p>${esc(ten(b))}${mu[ma]?.ly_do ? ` <span class="mo">— ${esc(mu[ma].ly_do)}</span>` : ''}</p>`),
    'Chị chọn nhóm ở màn Duyệt › Chưa phân dạng.')
})

const html = `<title>8T — câu cần chị xem</title>
<style>
/* bố cục: một cột đọc, mỗi câu một thẻ: ảnh sách ở trên, các mục nhãn–nội dung ở dưới, việc cần quyết ở cuối thẻ (theo k6-chua-chac.html) */
:root{--nen:#f6f7f9;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e5e7eb;--nhan:#b45309;--nen-nhan:#fffbeb;--xanh:#047857;--nen-xanh:#ecfdf5;--nen-kho:#f3f4f6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#f3f4f6;--mo:#9ca3af;--vien:#374151;--nhan:#fbbf24;--nen-nhan:#3b2f12;--xanh:#6ee7b7;--nen-xanh:#0f2f25;--nen-kho:#273244;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1f2937;--chu:#f3f4f6;--mo:#9ca3af;--vien:#374151;--nhan:#fbbf24;--nen-nhan:#3b2f12;--xanh:#6ee7b7;--nen-xanh:#0f2f25;--nen-kho:#273244;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
main{max-width:900px;margin:0 auto;padding-block:20px 60px;padding-inline:16px}
h1{font-size:22px;margin:8px 0 6px;text-wrap:balance}h2{font-size:17px;margin:36px 0 4px;text-wrap:balance}
p{margin:0 0 8px}p.dan{color:var(--mo);max-width:68ch}.mo{color:var(--mo)}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}nav a{color:var(--chu);border:1px solid var(--vien);background:var(--the);border-radius:999px;padding:4px 12px;text-decoration:none;font-size:14px}
nav a:focus-visible,summary:focus-visible{outline:2px solid var(--nhan);outline-offset:2px}
.the{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:14px 0;display:flex;flex-direction:column;gap:10px}
.the h3{font-size:15.5px;margin:0;display:flex;gap:10px;align-items:center}
.so{flex:none;width:28px;height:28px;border-radius:50%;background:var(--chu);color:var(--the);display:grid;place-items:center;font-size:13px;font-variant-numeric:tabular-nums}
figure{margin:0}figure img{display:block;max-width:100%;height:auto;background:#fff;border:1px solid var(--vien);border-radius:8px}
figcaption{color:var(--mo);font-size:13px;margin-top:3px}
.muc{display:grid;grid-template-columns:150px minmax(0,1fr);gap:4px 14px}.nhan{color:var(--mo)}.nd{min-width:0}.nd p:last-child{margin-bottom:0}
.kho{background:var(--nen-kho);border-radius:8px;padding:10px 12px;overflow-x:auto}.kho.chua{border:1px dashed var(--vien);background:transparent}
.ma{color:var(--mo);font-size:13px;margin-bottom:4px}.da{margin-top:6px}
code{font:13px ui-monospace,Consolas,monospace}
details{margin-top:8px}summary{cursor:pointer;color:var(--mo)}.lg{margin-top:8px;padding-top:8px;border-top:1px solid var(--vien)}
.quyet{margin:2px 0 0;padding-top:10px;border-top:1px solid var(--vien)}
.dang{background:var(--nen-nhan);color:var(--nhan);border-radius:6px;padding:2px 8px;display:inline-block;margin-right:6px;font-size:13.5px}.dang.xong{background:var(--nen-xanh);color:var(--xanh)}
math{font-size:1.08em}.katex{white-space:nowrap}
@media (max-width:600px){.muc{grid-template-columns:1fr}.nhan{margin-top:4px;font-size:13.5px}}
</style>
<main>
<h1>Khối 8T — câu cần chị xem</h1>
<p class="dan">Kho Đại 8T sau hai lô đầu (quyển Chuyên đề bồi dưỡng HSG Toán 8 của Nguyễn Đức Tấn, chương I). Ảnh là trang sách gốc cắt từ PDF. Khung xám là câu đang nằm trong kho; bấm "Lời giải đang để trong kho" để xem lời giải đầy đủ.</p>
<nav><a href="#a">A. Hai cặp trùng (${A.length})</a><a href="#b">B. Sách in sai, đề thiếu (${B.length})</a><a href="#c">C. Máy nghi trùng (${C.length})</a><a href="#d">D. Chưa chốt nhóm (${D.length})</a></nav>
<h2 id="a">A. Hai cặp máy báo trùng — đề sách in đúng như vậy</h2>
<p class="dan">Chị hỏi "cái kia là biến đổi chứ, hay đề bài thế?". Cả hai đều là đề của sách: sách cho ý a) ở dạng đã tách sẵn để dẫn sang ý b).</p>
${A.join('\n')}
<h2 id="b">B. Sách in sai hoặc đề thiếu</h2>
<p class="dan">Sáu câu đầu đã xử lý trong kho — chị xem lại cách xử lý. Câu cuối chưa nhập, chờ chị quyết.</p>
${B.join('\n')}
<h2 id="c">C. Máy nghi trùng nhưng không tự bỏ</h2>
${C.join('\n')}
<h2 id="d">D. Bảy câu chưa chốt nhóm bài</h2>
<p class="dan">Hai lượt gán nhóm độc lập chọn khác nhau nên câu đang ở "Chưa phân dạng". Lời giải thì đã có.</p>
${D.join('\n')}
<h2>Lỗi in nhỏ của sách, không ảnh hưởng đề và đáp số</h2>
<p class="dan">Bài 20 b: dòng đầu lời giải in ${toan('4x^4')} thay cho ${toan('4x^2')}. Bài 26 a: dòng kết luận in "a =" thay cho "A =". Bài 38 b: dòng khai triển in ${toan('3xy')} thiếu mũ. Bài 75 a: in ${toan('(2-2)Q(-2)')} thay cho ${toan('(-2+2)Q(-2)')}. Bài 79 b: in ${toan('(m^3+3)')} thay cho ${toan('(m^2+3)')}. Bài 85: hai chỗ gõ nhầm trong các bước giữa. Lời giải trong kho viết theo biểu thức đúng.</p>
</main>
`
const ra = join(DIR, '..', '..', 'k8T-can-xem.html')
writeFileSync(ra, html)
console.log(`${so} thẻ · ${soAnh} ảnh · ${(html.length / 1024).toFixed(0)} KB → ${ra}`)
