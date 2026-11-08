// NT-GKI-2026.can-xem.mjs — trang xem cho CEO: các câu của đề cương Ngọc Thụy cần quyết (ảnh đề gốc + đề + lời giải đang nằm trong kho + việc cần quyết).
//   node kho-rules/dai/lo/k9/de-cuong/NT-GKI-2026.can-xem.mjs <thư mục làm việc>   → kho-rules/dai/k9-de-cuong-NT-can-xem.html
// Nội dung câu lấy từ bản soạn đã soát (NT-GKI-2026.soan.md = bản đã ghi kho). Công thức dựng MathML bằng katex ⇒ không tải gì từ ngoài.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NT-GKI-2026.can-xem.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const GOC = join(HERE, '../../../../..')
const katex = createRequire(join(GOC, 'package.json'))('katex')
const md = readFileSync(join(HERE, 'NT-GKI-2026.soan.md'), 'utf8').replace(/\r\n/g, '\n')

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

const R = String.raw
const THE = [
  { tieu: 'Bài 1 (Dạng 4 · Tỉ số lượng giác) — đề không nêu làm tròn', anh: ['img/de_P5B1.png'], phan: 5, nhan: 'Bài 1',
    viec: R`Ý b làm tròn số đo góc **đến độ** ($\widehat{B}\approx53^\circ$, $\widehat{C}\approx37^\circ$); ý c giữ phân số rồi làm tròn độ dài đến 1 chữ số thập phân ($BE\approx2{,}1$ cm, $CE\approx2{,}9$ cm) — mặc định của luật khối 9. Thầy cô muốn đến phút thì $53^\circ8'$, $36^\circ52'$.` },
  { tieu: 'Bài 3 (Dạng 4) — góc hợp bởi tia nắng với thân cây', anh: ['img/de_P5B3.png'], phan: 5, nhan: 'Bài 3',
    viec: R`Đề không nêu làm tròn: $\approx28{,}07^\circ$ ⇒ lấy **28°**; vì vậy ghi *tự luận*, không ghi trả lời ngắn. Hình của đề chỉ vẽ mặt trời + cái cây (không vẽ bóng $3{,}2$ m).` },
  { tieu: 'Bài 4 (Dạng 4) — chiếc đò bị dòng nước đẩy lệch', anh: ['img/de_P5B4.png'], phan: 5, nhan: 'Bài 4',
    viec: R`Đề không nêu làm tròn: $\alpha\approx38{,}6^\circ$ ⇒ lấy **39°** (tự luận). Hình đề không đặt tên điểm, lời giải tự đặt $A$, $B$, $C$ (có hình giải).` },
  { tieu: 'Bài 6a (Dạng 4) — giải tam giác $ABC$, đề không nêu làm tròn', anh: [], phan: 5, nhan: 'Bài 6',
    viec: R`Góc làm tròn đến độ: $\widehat{B}\approx37^\circ$, $\widehat{C}\approx53^\circ$ (đến phút: $36^\circ52'$, $53^\circ8'$). Ý c, d (kiểm bằng toạ độ 3000 tam giác ngẫu nhiên) chứng minh bằng đồng dạng, không dùng đường trung bình.` },
  { tieu: 'Đề minh hoạ · Bài 3.1 — góc hạ của tia AB', anh: ['img/de_P6B3_1.png'], phan: 6, nhan: 'Bài 3.1',
    viec: R`Đề không nêu làm tròn góc hạ ($\approx27{,}76^\circ$) ⇒ lấy **28°**; độ cao khi góc hạ $46^\circ$ là **295 m** (làm tròn đến mét theo đề).` },
]

const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề cương Ngọc Thụy — câu cần xem</title>
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
<h1>Đề cương Ngọc Thụy (Toán 9) — các câu cần xem</h1>
<p class="sub">45 câu đã vào Kho đề thi (tab Đề cương, chưa duyệt) · hai lượt giải độc lập khớp 45/45 · cả 5 cờ chỉ là cách làm tròn (đáp số đã chắc) — bấm vào từng thẻ xem ảnh đề + lời giải.</p>
${THE.map((t) => `<section class="the"><h2>${esc(t.tieu)}</h2>${t.anh.map(anh).join('')}${chiTiet(t.phan, t.nhan)}<div class="viec">${toi(t.viec)}</div></section>`).join('\n')}
</main></html>`
const out = join(GOC, 'kho-rules', 'dai', 'k9-de-cuong-NT-can-xem.html')
writeFileSync(out, html)
console.log(`✔ ${out} — ${(html.length / 1024).toFixed(0)} KB`)
