// TM-GKI-2024.can-xem.mjs — trang xem cho CEO: các câu của đề cương Tây Mỗ cần quyết (ảnh đề gốc + đề + lời giải đang nằm trong kho + việc cần quyết).
//   node kho-rules/dai/lo/k9/de-cuong/TM-GKI-2024.can-xem.mjs <thư mục làm việc>   → kho-rules/dai/k9-de-cuong-TM-can-xem.html
// Nội dung câu lấy từ bản soạn đã soát (TM-GKI-2024.soan.md = bản đã ghi kho). Công thức dựng MathML bằng katex ⇒ không tải gì từ ngoài.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TM-GKI-2024.can-xem.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const GOC = join(HERE, '../../../../..')
const katex = createRequire(join(GOC, 'package.json'))('katex')
const md = readFileSync(join(HERE, 'TM-GKI-2024.soan.md'), 'utf8').replace(/\r\n/g, '\n')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toi = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, m) => {
  try { return katex.renderToString(m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'), { output: 'mathml', throwOnError: false }) } catch { return m }
}).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
const anh = (f) => { try { return `<img alt="" src="data:image/png;base64,${readFileSync(join(LV, f)).toString('base64')}">` } catch { return '' } }

/** lấy khối câu theo (số phần trong tệp, nhãn) */
function khoiCau(phan, nhan) {
  const kp = md.split(/^(?=## PHẦN )/m).find((x) => x.startsWith(`## PHẦN ${phan} `))
  const kc = kp?.split(/^(?=### )/m).find((x) => x.startsWith(`### ${nhan} |`))
  return kc ?? ''
}
function chiTiet(phan, nhan) {
  const k = khoiCau(phan, nhan)
  if (!k) return '<p><i>(không tìm thấy câu)</i></p>'
  const de = k.match(/\*\*Đề:\*\*([\s\S]*?)(?=\n\*\*(Hình|Hình giải|Ghi chú|Chưa chắc|Phần 1)|\n\n)/)?.[1]?.trim() ?? ''
  const tt = k.split('**Phần 2. Trình bày**')[1]?.trim() ?? ''
  const head = k.split('\n')[0]
  return `<div class="de">${toi(de).replace(/\n/g, '<br>')}</div><details><summary>Lời giải đang trong kho — ${esc(head.replace('### ', ''))}</summary><div class="gi">${tt.split(/\n\n+/).map((p) => `<p>${toi(p).replace(/\n/g, '<br>')}</p>`).join('')}</div></details>`
}

const THE = [
  { tieu: 'Bài 17 (Dạng 4) — đề KHÔNG nêu làm tròn', anh: ['img/de_P4B17.png'], phan: 4, nhan: 'Bài 17',
    viec: 'Lời giải đang làm tròn đến 1 chữ số thập phân theo mặc định khối 9: **7,7 m** (chưa làm tròn ≈ 7,67 m; làm tròn đến mét: 8 m). Vì đáp số phụ thuộc cách làm tròn nên để **tự luận**, không để trả lời ngắn. Chị muốn chốt đáp số nào?' },
  { tieu: 'Bài 19 (Dạng 4) — "sau bao nhiêu phút" tính từ lúc nào?', anh: ['img/de_P4B19.png'], phan: 4, nhan: 'Bài 19',
    viec: 'Hai trạm hiểu "sau bao nhiêu phút xe đến chân tháp" là tính từ **lần nhìn thứ hai (góc hạ 60°)** ⇒ **3 phút**. Nếu tính từ lần nhìn đầu (góc hạ 30°) thì là 9 phút (3 + 6). Kết quả "3" đang để trả lời ngắn. Đúng ý đề chưa?' },
  { tieu: 'Bài 25a (Dạng 4) — đề không nêu làm tròn', anh: [], phan: 4, nhan: 'Bài 25',
    viec: 'Ý a "giải tam giác BCA": độ dài giữ giá trị đúng (3,6 cm; 4,8 cm), góc làm tròn đến độ (53°, 37°). Nếu thầy cô yêu cầu đến phút thì 53°8′ và 36°52′.' },
  { tieu: 'Bài 28 (Dạng 5) — đề ghi "như hình dưới đây" nhưng KHÔNG in hình', anh: [], phan: 5, nhan: 'Bài 28',
    viec: 'Mặt đáy $ABCD$ hình vuông, đáy dưới $MNPQ$, chiều cao $AM$ lấy theo lời văn. Đáp số: $MN=2$ dm, $AM=1$ dm, diện tích mạ nhỏ nhất 12 dm² — hai trạm giải độc lập khớp nhau, lời giải KHÔNG dùng Cô-si / đạo hàm (phân tích $(x+4)(x-2)^2$). Chị xem lập luận có hợp lớp 9 không.' },
  { tieu: 'Bài 1a (Dạng 1) — KHÔNG nhập, đề cương in hỏng', anh: ['z/b1.png'], phan: 1, nhan: 'Bài 1b',
    viec: 'Ảnh trên: ý a) chỉ in chữ "z" (mất phương trình) nên **không nhập**. Ý b) có vết mực giữa "2x" và "3", nét dưới là dấu trừ — nhập thành $(2x-3)(\\frac14x-1)=0$ (đúng như ảnh). Chị có đề gốc của ý a) thì gửi em bổ sung.' },
  { tieu: 'Bài 4a, 21a, 5 (đề minh hoạ) — phân loại / giả định', anh: ['img/de_P6B5.png'], phan: 6, nhan: 'Bài 5',
    viec: '**Bài 4a** (nghiệm $x=\\frac35$) và **Bài 21a** (kết quả $\\frac12$) em đổi sang *trả lời ngắn* với đáp án $0{,}6$ / $0{,}5$ — cùng cách đã làm ở đề Nguyễn Siêu (6n). Cần chị chốt một cách chung. **Bài 5 đề minh hoạ**: đáp số 800 m², ngầm giả định tường toà nhà dài ≥ 40 m (đề không nêu, hình vẽ phù hợp).' },
]

const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề cương Tây Mỗ — câu cần xem</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--nhan:#2D9CDB;--cb:#b45309}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#e5e7eb;--mo:#9ca3af;--vien:#374151;--nhan:#56b4ee;--cb:#fbbf24}}
body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:860px;margin:0 auto;padding:16px}
h1{font-size:1.3rem}.sub{color:var(--mo);margin:-8px 0 16px}
.the{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:0 0 16px}
.the h2{font-size:1.05rem;margin:0 0 8px;color:var(--nhan)}
.the img{max-width:100%;border:1px solid var(--vien);border-radius:8px;margin:6px 0}
.viec{border-left:4px solid var(--cb);padding:6px 10px;background:rgba(180,83,9,.07);margin:8px 0}
.de{margin:8px 0}details{margin-top:6px}summary{cursor:pointer;color:var(--mo)}.gi p{margin:6px 0}
math{font-size:1.05em}
</style><main>
<h1>Đề cương Tây Mỗ (Toán 9) — các câu cần chị xem</h1>
<p class="sub">55 câu đã vào kho ở dạng chờ (chưa duyệt) · 2 lượt giải độc lập khớp 55/55 · dưới đây là những chỗ cần chị quyết.</p>
${THE.map((t) => `<section class="the"><h2>${esc(t.tieu)}</h2>${t.anh.map(anh).join('')}${chiTiet(t.phan, t.nhan)}<div class="viec">${toi(t.viec)}</div></section>`).join('\n')}
</main></html>`
const out = join(GOC, 'kho-rules', 'dai', 'k9-de-cuong-TM-can-xem.html')
writeFileSync(out, html)
console.log(`✔ ${out} — ${(html.length / 1024).toFixed(0)} KB`)
