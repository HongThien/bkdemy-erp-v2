// ============================================================================
// can-xem.mjs — dựng trang "câu cần chị xem" của ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (NS-GKI-2026), khuôn kho-rules/dai/lo/k8T/can-xem.mjs:
// mỗi thẻ gồm ẢNH CẮT TỪ ĐỀ CƯƠNG (và ảnh sách gốc khi tìm được) + đề / đáp án / lời giải đang nằm trong kho + việc cần quyết.
// (Thùy 10/10: "Mấy câu sai cần review thì m phải cho t view cụ thể chứ".)
//
//   node kho-rules/dai/lo/k9/de-cuong/can-xem.mjs <thư mục làm việc>      → kho-rules/dai/k9-de-cuong-NS-can-xem.html
//
// Nội dung câu lấy từ DB (nguồn sự thật) theo tai_lieu của đề; ảnh cắt bằng pdftoppm từ <LV>/goc.pdf (toạ độ theo ảnh trang 130 dpi).
// Công thức dựng sẵn thành MathML (katex) ⇒ trang không tải gì từ ngoài.
// ============================================================================
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import pg from 'pg'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/can-xem.mjs <thư mục làm việc>'); process.exit(2) }
const DIR = dirname(fileURLToPath(import.meta.url)), GOC = join(DIR, '..', '..', '..', '..', '..')
const TAI_LIEU = '39a6f176-7bee-482b-8e36-873a0d94de40'
const PDF = join(LV, 'goc.pdf')
const PDF_NDT = 'E:/BK ACADEMY/Tài liệu tham khảo/K9/ly-thuyet-va-phan-dang-bai-tap-toan-9-hoc-ki-1-ngo-duc-tai.pdf'
const PDF_NT = 'E:/BK ACADEMY/Tài liệu tham khảo/K9/tai-lieu-hoc-tap-mon-toan-9-hoc-ki-1-nam-hoc-2025-2026.pdf'
const tam = mkdtempSync(join(tmpdir(), 'k9dc-xem-'))
let soAnh = 0
/** cắt một vùng của trang PDF (toạ độ x, y, rộng, cao tính trên ảnh 130 dpi) ⇒ data URI, xuất ở 170 dpi */
function cat(pdf, trang, x, y, w, h, dpiGoc = 130) {
  const k = 170 / dpiGoc, ra = join(tam, `a${++soAnh}`)
  execFileSync('pdftoppm', ['-r', '170', '-gray', '-f', String(trang), '-l', String(trang), '-x', String(Math.round(x * k)), '-y', String(Math.round(y * k)), '-W', String(Math.round(w * k)), '-H', String(Math.round(h * k)), '-png', '-singlefile', pdf, ra])
  return `data:image/png;base64,${readFileSync(ra + '.png').toString('base64')}`
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (tex) => { try { return katex.renderToString(tex, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(tex)}</code>` } }
const dong = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const doan = (s) => String(s).split(/\n\n+/).map((d) => `<p>${dong(d).replace(/\n/g, '<br>')}</p>`).join('')

// ── dữ liệu từ DB ────────────────────────────────────────────────────────────
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')
const { rows: [tl] } = await db.query(`select ten, cau_hinh from tai_lieu where id = $1`, [TAI_LIEU])
const { rows: thuTu } = await db.query(`select p.thu_tu as phan, c.ma_cau from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id where p.tai_lieu_id = $1 order by p.thu_tu, c.thu_tu`, [TAI_LIEU])
const ds = thuTu.map((r) => r.ma_cau)
const { rows: cauDb } = await db.query(`select ma_cau, noi_dung, dap_an, loi_giai, loai_cau, da_duyet, anh_de, anh_dap_an from dai_cau_hoi where ma_cau = any($1) union all select ma_cau, noi_dung, dap_an, loi_giai, loai_cau, da_duyet, anh_de, anh_dap_an from hgt_cau_hoi where ma_cau = any($1)`, [ds])
await db.end()
const theoMa = Object.fromEntries(cauDb.map((r) => [r.ma_cau, r]))
// khoá = "A 6b" / "B 10" / "C 1a": chữ phần + nhãn gốc (nhanCau trên DB chỉ có nhãn, trùng giữa các phần ⇒ ghép với phần của tai_lieu_cau)
const PHAN = ['A', 'B', 'C'], nhan = tl.cau_hinh.deThi.nhanCau
const theoNhan = {}
for (const r of thuTu) { const k = `${PHAN[r.phan]} ${nhan[r.ma_cau].replace('Bài ', '')}`; if (!theoNhan[k] || r.phan === 1) theoNhan[k] = theoMa[r.ma_cau] }   // Bài 5 phần C trỏ cùng câu với B 5

/** khối "đang nằm trong kho" */
function kho(k, { loiGiai = true } = {}) {
  const r = theoNhan[k]
  if (!r) throw new Error('không thấy câu ' + k)
  const da = r.loai_cau === 'tra_loi_ngan' ? `<p class="da">Đáp án (trả lời ngắn): ${dong(r.dap_an)}</p>` : ''
  return `<div class="kho"><div class="ma"><code>${r.ma_cau}</code> · ${r.da_duyet ? 'đã duyệt' : 'chưa duyệt'} · ${r.loai_cau === 'tra_loi_ngan' ? 'trả lời ngắn' : 'tự luận'}</div>${doan(r.noi_dung)}${da}${loiGiai && r.loi_giai ? `<details><summary>Lời giải đang để trong kho</summary><div class="lg">${doan(r.loi_giai)}</div></details>` : ''}</div>`
}
const anh = (trang, y, cao, chu, x = 55, w = 1000) => `<figure><img alt="${esc(chu)}" src="${cat(PDF, trang, x, y, w, cao)}"><figcaption>${esc(chu)} · đề cương, trang ${trang}</figcaption></figure>`
const anhSach = (pdf, trang, x, y, w, h, chu, dpi) => `<figure><img alt="${esc(chu)}" src="${cat(pdf, trang, x, y, w, h, dpi)}"><figcaption>${esc(chu)}</figcaption></figure>`

let so = 0
const the = (tieuDe, than, quyet, xong = false) => `<section class="the"><h3><span class="so">${++so}</span>${esc(tieuDe)}</h3>${than}<p class="quyet"><span class="${xong ? 'dang xong' : 'dang'}">${xong ? 'Đã làm — chị xem' : 'Cần chị quyết'}</span> ${dong(quyet)}</p></section>`
const muc = (nh, html) => `<div class="muc"><div class="nhan">${esc(nh)}</div><div class="nd">${html}</div></div>`

// ── thẻ CẦN QUYẾT ────────────────────────────────────────────────────────────
const E = [
  the('A. Bài 2a — đề cương in thiếu vế phải, chưa nhập', anh(1, 518, 150, 'Bài 2, ý a) ở góc trái')
    + muc('Vấn đề', doan('Phương trình thứ nhất của ý a) chỉ in $\\dfrac{x+y}{2}+\\dfrac{x-y}{4}$ rồi hết, không có dấu "$=$" và vế phải. Không có gì để giải nên tôi **không nhập** ý này (Bài 2 trong kho có 5 ý b–f). Tôi đã tìm trong hai quyển sách lớp 9 đang có nhưng không thấy hệ này.')),
    'Chị cho vế phải (hoặc ảnh đề đủ) thì tôi nhập thêm ý a).'),
  the('A. Bài 8b — đề cương in thiếu dấu bất đẳng thức và vế phải, chưa nhập', anh(2, 232, 100, 'Bài 8')
    + muc('Vấn đề', doan('Ý b) chỉ in $\\dfrac{3x-17}{20}-\\dfrac{5x+1}{15}$. Không biết so sánh với gì nên tôi **không nhập** (Bài 8 trong kho chỉ có ý a).')),
    'Chị cho phần còn thiếu thì tôi nhập thêm ý b).'),
  the('A. Bài 6b — đề cương in dấu "=" thành dấu "−"; sách gốc cho đề khác bản đang trong kho', anh(1, 1035, 105, 'Bài 6, các ý a) b) c) đều không có dấu "="')
    + anhSach(PDF_NT, 5, 55, 225, 840, 265, 'Bản gốc tìm được: Tài liệu học tập Toán 9 HK1 2025–2026 (Nhóm Toán 9, THCS Nguyễn Trãi), trang 4, Bài 1 — các ý 6, 10, 11, 12 chính là 6a, 6b, 6c, 6e của đề cương', 110)
    + muc('Vấn đề', doan('Ba ý a), b), c) in không có dấu "$=$". Lúc gõ tôi hiểu là thiếu "$=0$" và nhập $3(x-5)(x+2)-x^2-5x=0$ — ra nghiệm vô tỉ $x=\\dfrac{7\\pm\\sqrt{109}}{2}$.\n\nSau đó tôi tìm được bản gốc trong quyển Tài liệu học tập Toán 9 (THCS Nguyễn Trãi): $2x(3x-1)=3x-1$ · $3(x-5)(x+2)=x^2-5x$ · $(x-1)(2x+3)+2x=2$. Tức là đề cương in dấu "$=$" thành dấu "$-$" ở cả ba ý. Với ý a) và c) hai cách đọc cho cùng một phương trình; riêng ý b) thì khác: bản gốc cho $x=5$ và $x=-3$.'))
    + muc('Đang trong kho', kho('A 6b')),
    'Tôi đề nghị **sửa ý b) theo bản gốc** $3(x-5)(x+2)=x^2-5x$ (nghiệm $5$ và $-3$). Chị gật thì tôi soạn lại lời giải, soát lại rồi thay câu trong kho.'),
  the('A. Bài 6h, 6i, 6j — nghi in sai số mũ', anh(1, 1160, 85, 'Bài 6, các ý g) – k)')
    + muc('Vấn đề', doan('Ba ý này in khác thường: ý h) có hai hạng tử cùng bậc hai, ý i) cũng vậy, ý j) có $9x^3$ đứng sau $8x^2$ và ra nghiệm vô tỉ. Tôi không tìm được bản gốc, nên đang giải **đúng như in**.'))
    + muc('Ý h) trong kho', kho('A 6h')) + muc('Ý i) trong kho', kho('A 6i')) + muc('Ý j) trong kho', kho('A 6j'))
    + muc('Nếu đề gốc khác', doan('h) $2x^3+3x^2-5=0$ thì $x=1$.\n\ni) $x^3-4x^2+4-x=0$ thì $x=4$; $x=1$; $x=-1$.\n\nj) $x^4-8x^2-9=0$ thì $x=3$; $x=-3$. Hoặc $x^4-8x^3-9x^2=0$ thì $x=0$; $x=9$; $x=-1$.')),
    'Giữ như in, hay sửa theo bản nào? Chị có đề gốc của trường thì gửi tôi đối chiếu.'),
  the('A. Bài 4b — đề cương in thừa "y ="', anh(1, 845, 115, 'Bài 4')
    + muc('Vấn đề', doan('Ý b) in "$(d)\\colon y=x+y+1=0$". Tôi nhập $(d)\\colon x+y+1=0$ (cùng dạng với $(d\')$ và với ý c), ra giao điểm $(-2;1)$. Nếu ý đề là $(d)\\colon y=x+1$ thì giao điểm là $(2;3)$.'))
    + muc('Đang trong kho', kho('A 4b')),
    'Giữ $x+y+1=0$?'),
  the('A. Bài 12 — hình của đề cương vẽ khác bài gốc', anh(2, 585, 135, 'Bài 12 và hình của đề cương')
    + anhSach(PDF_NDT, 54, 80, 610, 760, 250, 'Bài gốc: Lý thuyết và phân dạng bài tập Toán 9 HK1 (Ngô Đức Tài), trang 53, Dạng 5 Ví dụ 1 — sân vườn hình chữ L, hai bề rộng x và x + 2', 110)
    + muc('Vấn đề', doan('Lời văn giống hệt bài gốc, nhưng hình của đề cương chỉ còn một dải sân vườn rộng $x$ ở bên phải. Theo hình đề cương: $12(14-x)=100$, ra $x=\\dfrac{17}{3}$ m. Theo hình gốc: nhà là hình vuông cạnh $12-x$, $(12-x)^2=100$, ra $x=2$ m.'))
    + muc('Đang trong kho', kho('A 12')),
    'Tôi đề nghị **thay bằng hình gốc** (vẽ lại bằng code) và giải ra $x=2$. Chị gật thì tôi làm lại câu này.'),
  the('A. Bài 20 — câu "xe cuối cùng nhiều 3 học sinh" không rõ nghĩa', anh(3, 355, 105, 'Bài 20')
    + muc('Vấn đề', doan('Tôi nhập "xe cuối cùng **thiếu** $3$ học sinh" (bài quen thuộc), ra $8$ xe và $325$ học sinh. Hiểu là xe cuối chỉ có $3$ học sinh thì ra $43$ xe, $1725$ học sinh; hiểu là còn thừa $3$ em thì ra $2$ xe, $85$ học sinh.'))
    + muc('Đang trong kho', kho('A 20')),
    'Giữ "thiếu $3$ học sinh"?'),
  the('B. Bài 2b — đề cương in hai lần cot 30°', anh(3, 870, 115, 'Phần B, Bài 2')
    + muc('Vấn đề', doan('Ý b) in $B=\\tan45^\\circ\\cdot\\cot30^\\circ\\cdot\\cot30^\\circ$. Giải đúng như in thì $B=3$. Một tích lặp lại cùng một thừa số là bất thường; nếu đề gốc là $\\tan45^\\circ\\cdot\\cot30^\\circ\\cdot\\cot60^\\circ$ thì $B=1$.'))
    + muc('Đang trong kho', kho('B 2b')),
    'Giữ như in ($B=3$)?'),
  the('B. Bài 3 và Bài 9 — đề không nêu cách làm tròn', anh(3, 1000, 115, 'Phần B, Bài 3') + anh(4, 280, 225, 'Phần B, Bài 9 và hình của đề cương', 55, 520)
    + muc('Vấn đề', doan('Bài 4 và Bài 5 có ghi cách làm tròn (độ dài hai chữ số thập phân, góc đến phút); Bài 3 và Bài 9 thì không. Tôi đang lấy độ dài một chữ số thập phân, góc đến độ.'))
    + muc('Bài 3 trong kho', kho('B 3')) + muc('Bài 9 trong kho', kho('B 9')),
    'Giữ cách làm tròn này, hay làm tròn giống Bài 4, 5 (Bài 3: $56^\\circ19\'$; $5{,}35$; $4{,}72$ · Bài 9: $2{,}31$; $6{,}13$)?'),
  the('B. Bài 10 — hình của đề cương lệch lời văn', anh(4, 505, 200, 'Phần B, Bài 10 và hình của đề cương')
    + muc('Vấn đề', doan('Lời văn: từ nóc cao ốc $50$ m nhìn **chân** cột dưới góc hạ $62^\\circ$ và **đỉnh** cột dưới góc nâng $34^\\circ$ — cột cao hơn cao ốc. Hình lại vẽ cột thấp hơn cao ốc và đặt góc $34^\\circ$ giữa hai tia ngắm. Tôi giải theo lời văn (khoảng $67{,}9$ m) và không đưa hình này vào đề; lời giải có hình vẽ lại theo lời văn. Theo hình thì cột cao khoảng $32{,}1$ m.'))
    + muc('Đang trong kho', kho('B 10')),
    'Giữ lời giải theo lời văn?'),
  the('C. Bài 1 — bốn bất đẳng thức in sai', anh(4, 668, 160, 'Phần C, Bài 1')
    + muc('Vấn đề', doan('Đúng như in thì ba ý đầu là mệnh đề **sai** (thử $a=b=1$; ý c thử $a=b=\\dfrac{1}{2}$), và bất đẳng thức cuối dòng không có nhãn ý, dùng dấu "$>$" nên sai khi $a=b=c$. Tôi nhập theo dạng quen thuộc:\n\na) $ab\\le\\left(\\dfrac{a+b}{2}\\right)^2\\le\\dfrac{a^2+b^2}{2}$ (đề in $\\dfrac{(a+b)^2}{2}$).\n\nb) $\\dfrac{a^3+b^3}{2}\\ge\\left(\\dfrac{a+b}{2}\\right)^3$ (đề in $\\dfrac{(a+b)^3}{2}$).\n\nc) $a^4+b^4\\ge a^3b+ab^3$ (đề in $a^2b$).\n\ne) $a^2+b^2+c^2\\ge ab+bc+ca$ (đề in dấu "$>$", không nhãn). Dấu ngoặc nhọn kèm "với $a,b,c>0$" có thể là phần sót của một ý khác đã mất.'))
    + muc('Ý a) trong kho', kho('C 1a')) + muc('Ý b) trong kho', kho('C 1b')) + muc('Ý c) trong kho', kho('C 1c')) + muc('Ý e) trong kho', kho('C 1e')),
    'Giữ bốn bản đã nhập?'),
  the('C. Bài 2 — lời dẫn in "Tính giá trị của biểu thức"', anh(4, 838, 100, 'Phần C, Bài 2')
    + muc('Vấn đề', doan('Hai ý đều là bất đẳng thức kép, không phải biểu thức để tính, và đề không nêu điều kiện của $a,b,c,d$ (bất đẳng thức chỉ đúng với số dương). Tôi nhập lời dẫn "Cho $a,b,c,d$ là các số dương. Chứng minh:".'))
    + muc('Ý a) trong kho', kho('C 2a')) + muc('Ý b) trong kho', kho('C 2b')),
    'Giữ lời dẫn đã nhập?'),
]

// ── thẻ ĐÃ LÀM ───────────────────────────────────────────────────────────────
const F = [
  the('B. Bài 7 — số liệu chỉ có trên hình, tôi viết thêm vào lời văn', anh(4, 70, 210, 'Phần B, Bài 6 và Bài 7')
    + muc('Trong kho', kho('B 7', { loiGiai: false })),
    'Đề cương chỉ in "Tính chiều cao của tháp canh trong hình bên"; tôi viết thêm $6{,}8$ m và $60^\\circ$ vào lời văn để câu tự đủ khi đứng riêng trong kho.', true),
  the('B. Bài 8 — hình ghi x, y ngược lời văn', anh(4, 280, 215, 'Phần B, Bài 9 và Bài 8')
    + muc('Trong kho', kho('B 8')),
    'Lời văn: $x$ là góc với mặt đất, $y$ là góc với cạnh $AB$; hình ghi ngược lại. Hai góc phụ nhau nên đáp số không đổi; tôi giữ hình của đề cương và ghi chú trên câu. Hình của Bài 9 đánh dấu các đoạn bằng nhau không khớp lời văn nên tôi không đưa vào, lời giải có hình vẽ lại.', true),
  the('C. Bài 4 — hình của đề cương không khớp lời văn', anh(4, 1020, 165, 'Phần C, Bài 4')
    + muc('Trong kho', kho('C 4')),
    'Lời văn cho $\\widehat{A}=\\widehat{D}=90^\\circ$ nên hai đáy là $AB$ và $CD$; hình lại vẽ hai đáy $BC$ và $AD$. Tôi không đưa hình này vào đề; lời giải có hình vẽ lại theo lời văn.', true),
]

const dem = (f) => Object.values(theoMa).filter(f).length
const html = `<title>Đề cương Toán 9 Nguyễn Siêu</title>
<style>
/* bố cục: một cột đọc, mỗi câu một thẻ: ảnh đề cương ở trên, các mục nhãn–nội dung ở dưới, việc cần quyết ở cuối thẻ (theo k8T-can-xem.html) */
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
.kho{background:var(--nen-kho);border-radius:8px;padding:10px 12px;overflow-x:auto}
.ma{color:var(--mo);font-size:13px;margin-bottom:4px}.da{margin-top:6px}
code{font:13px ui-monospace,Consolas,monospace}
details{margin-top:8px}summary{cursor:pointer;color:var(--mo)}.lg{margin-top:8px;padding-top:8px;border-top:1px solid var(--vien)}
.quyet{margin:2px 0 0;padding-top:10px;border-top:1px solid var(--vien)}
.dang{background:var(--nen-nhan);color:var(--nhan);border-radius:6px;padding:2px 8px;display:inline-block;margin-right:6px;font-size:13.5px}.dang.xong{background:var(--nen-xanh);color:var(--xanh)}
math{font-size:1.08em}
@media (max-width:600px){.muc{grid-template-columns:1fr}.nhan{margin-top:4px;font-size:13.5px}}
</style>
<main>
<h1>Đề cương giữa kì I Toán 9, Nguyễn Siêu — câu cần chị xem</h1>
<p class="dan">Đề cương đã lên Kho đề thi (tab Đề cương, chưa duyệt): ${thuTu.length} câu trên đề, ${Object.keys(theoMa).length} câu trong kho (${dem((r) => /^T1/.test(r.ma_cau))} Đại số, ${dem((r) => /^T3/.test(r.ma_cau))} hệ thức lượng), ${dem((r) => r.loai_cau === 'tra_loi_ngan')} câu trả lời ngắn. Mỗi câu được giải hai lượt độc lập và mọi đáp số khớp nhau. Bản scan của đề cương in thiếu và in sai nhiều chỗ; các thẻ dưới đây là những chỗ cần chị quyết. Ảnh cắt từ đề cương; khung xám là câu đang nằm trong kho, bấm "Lời giải đang để trong kho" để xem lời giải.</p>
<nav><a href="#e">Cần chị quyết (${E.length})</a><a href="#f">Đã làm, chị xem (${F.length})</a><a href="#g">Lỗi gõ đã sửa</a></nav>
<h2 id="e">Cần chị quyết — ${E.length} thẻ</h2>
<p class="dan">Hai thẻ đầu là hai ý chưa nhập được. Thẻ 3 và thẻ 6 có bản gốc tìm thấy trong sách lớp 9 đang có, tôi đề nghị sửa theo bản gốc. Các thẻ còn lại đang giải theo cách hiểu hợp lí nhất và chờ chị xác nhận.</p>
${E.join('\n')}
<h2 id="f">Đã làm — chị xem</h2>
${F.join('\n')}
<h2 id="g">Lỗi gõ của đề cương đã sửa khi nhập</h2>
<p class="dan">Mỗi chỗ đều có ghi chú trên câu ở màn Kho đề thi.</p>
<p class="dan">Phần A: Bài 5 in dấu căn trùm cả ${toan('2x')}, nhập ${toan('\\sqrt{2}x+y=\\sqrt{2}+2')} (là đường thẳng). Bài 6a, 6c in thiếu dấu "=", nhập thêm "${toan('=0')}" (trùng với bản gốc). Bài 10 in "${toan('mx+4)y=9')}", nhập ${toan('mx+4y=9')}. Bài 12 in "Bác có định", Bài 14 in "bị điện đi".</p>
<p class="dan">Phần B: Bài 2d đặt tên biểu thức trùng với ý c) (giữ như in). Bài 4b in "Kẻ đường cao của tam giác AH. của tam giác ABC". Bài 6 in "không cách tường", nhập "chân thang cách tường".</p>
<p class="dan">Phần C: Bài 5 in lặp nguyên văn Bài 5 phần B; trên đề vẫn có đủ hai chỗ, trong kho là một câu.</p>
</main>
`
const ra = join(DIR, '..', '..', '..', 'k9-de-cuong-NS-can-xem.html')
writeFileSync(ra, html)
console.log(`${so} thẻ · ${soAnh} ảnh · ${(html.length / 1024).toFixed(0)} KB → ${ra}`)
