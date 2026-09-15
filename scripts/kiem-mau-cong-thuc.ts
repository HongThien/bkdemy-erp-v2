// Kiểm MỌI mẫu trong bảng mẫu công thức render được bằng KaTeX (cùng tiền xử lý + macro như MathText).
// Preview / trang in / test online đều đi qua MathText → mẫu qua được đây = qua được cả 3 nơi.
// Chạy: npm run kiem:mau   — lỗi ⇒ exit 1 (mẫu đó phải BỎ khỏi bảng theo yêu cầu).
import katex from 'katex'
import { katexMacros } from '../src/lib/math/macros'
import { MATH_TEMPLATES, toMathLive, toPreview } from '../src/lib/math/templates'

const fixTex = (s: string) => s
  .replace(/\\frac(?![a-zA-Z])/g, '\\dfrac')
  .replace(/\\vec\s*\{([A-Za-z][A-Za-z0-9']*)\}/g, (m, arg: string) => (arg.length >= 2 ? `\\overrightarrow{${arg}}` : m))
const render = (s: string) => katex.renderToString(fixTex(s), { throwOnError: true, output: 'html', macros: katexMacros() })
// Giả lập lúc LƯU: MathPopup bỏ \placeholder{} → {} ; và lúc ĐÃ ĐIỀN: ô trống → "x".
const filled = (s: string) => s.replace(/#\?/g, 'x')
const saved = (s: string) => s.replace(/#\?/g, '{}')

let fail = 0
for (const t of MATH_TEMPLATES) {
  const cases: [string, string][] = [['nút preview', toPreview(t)], ['mathlive (ô trống)', toMathLive(t)], ['đã điền', filled(t.latex)], ['lưu còn ô trống', saved(t.latex)]]
  const errs: string[] = []
  for (const [name, s] of cases) { try { render(s) } catch (e: any) { errs.push(`${name}: ${String(e?.message ?? e).replace(/^KaTeX parse error: /, '')}`) } }
  if (errs.length) { fail++; console.log(`❌ ${t.id.padEnd(18)} ${t.ten}\n     ${errs.join('\n     ')}`) }
  else console.log(`✓  ${t.id.padEnd(18)} ${t.ten}`)
}
console.log(`\n${MATH_TEMPLATES.length} mẫu · ${fail} lỗi`)
process.exit(fail ? 1 : 0)
