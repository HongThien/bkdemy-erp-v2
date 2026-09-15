// ĐỌC .docx → text có công thức LaTeX (OMML của Word → LaTeX). Không cần pandoc/python.
//   node scripts/docx-doc.mjs file.docx [--out file.md]
// Hỗ trợ OMML thường gặp trong đề toán cấp 2: m:f (phân số), m:sSup/m:sSub (mũ/chỉ số), m:d (ngoặc, có begChr/endChr),
// m:rad (căn), m:r/m:t (chữ), m:bar/m:acc (gạch/mũ), m:eqArr, m:nary (tổng). Ký tự Unicode toán (−, ·, ×, ÷, ≤, ≥) giữ nguyên.
// Xuất mỗi đoạn văn 1 dòng; công thức bọc $…$. Dùng để nhập kho từ file Word (CEO 08/09: "file word dễ nhất").
import JSZip from 'jszip'
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) { console.error('Cần đường dẫn .docx'); process.exit(1) }
const outIdx = process.argv.indexOf('--out'); const out = outIdx > 0 ? process.argv[outIdx + 1] : null
const zip = await JSZip.loadAsync(readFileSync(file))
const xml = await zip.file('word/document.xml').async('string')
// rId → tên file media (word/_rels/document.xml.rels)
const relsXml = zip.file('word/_rels/document.xml.rels') ? await zip.file('word/_rels/document.xml.rels').async('string') : ''
const rels = Object.fromEntries([...relsXml.matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"/g)].map((m) => [m[1], m[2].replace(/^media\//, '')]))

// ── XML mini-parser (đủ cho document.xml: phần tử, thuộc tính, text; bỏ comment/CDATA hiếm) ──
function parseXml(s) {
  const root = { name: '#root', attrs: {}, children: [] }; const stack = [root]; let i = 0
  const dec = (t) => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&')
  while (i < s.length) {
    if (s[i] === '<') {
      if (s.startsWith('<?', i) || s.startsWith('<!--', i)) { i = s.indexOf('>', i) + 1; continue }
      const j = s.indexOf('>', i); const tag = s.slice(i + 1, j); i = j + 1
      if (tag[0] === '/') { stack.pop(); continue }
      const selfClose = tag.endsWith('/'); const body = selfClose ? tag.slice(0, -1) : tag
      const m = body.match(/^([^\s]+)\s*(.*)$/s); const name = m[1]; const attrs = {}
      for (const a of (m[2] || '').matchAll(/([^\s=]+)="([^"]*)"/g)) attrs[a[1]] = dec(a[2])
      const el = { name, attrs, children: [] }; stack[stack.length - 1].children.push(el)
      if (!selfClose) stack.push(el)
    } else { const j = s.indexOf('<', i); const t = s.slice(i, j < 0 ? s.length : j); if (t) stack[stack.length - 1].children.push({ text: dec(t) }); i = j < 0 ? s.length : j }
  }
  return root
}
const doc = parseXml(xml)
const kids = (el, name) => el.children.filter((c) => c.name === name)
const kid = (el, name) => el.children.find((c) => c.name === name)
const allText = (el) => el.text != null ? el.text : el.children.map(allText).join('')

// ── OMML → LaTeX ──
const SYM = { '−': '-', '–': '-', '·': '\\cdot ', '×': '\\times ', '÷': ':', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '∈': '\\in ', 'ℚ': '\\mathbb{Q}', 'ℤ': '\\mathbb{Z}', 'ℕ': '\\mathbb{N}', '±': '\\pm ', '∞': '\\infty ', '…': '\\dots ', '√': '\\sqrt' }
const mathText = (t) => t.replace(/[−–·×÷≤≥≠∈ℚℤℕ±∞…]/g, (ch) => SYM[ch] ?? ch)
function omml(el) {
  if (el.text != null) return ''
  switch (el.name) {
    case 'm:oMathPara': return kids(el, 'm:oMath').map(omml).join(' ')
    case 'm:oMath': return el.children.map(omml).join('')
    case 'm:r': return mathText(kids(el, 'm:t').map(allText).join(''))
    case 'm:f': { const num = omml(kid(el, 'm:num')), den = omml(kid(el, 'm:den')); const pr = kid(el, 'm:fPr'); const type = pr && kid(pr, 'm:type')?.attrs['m:val']; return type === 'skw' || type === 'lin' ? `${num}/${den}` : `\\dfrac{${num}}{${den}}` }
    case 'm:sSup': return `${wrap(omml(kid(el, 'm:e')))}^{${omml(kid(el, 'm:sup'))}}`
    case 'm:sSub': return `${wrap(omml(kid(el, 'm:e')))}_{${omml(kid(el, 'm:sub'))}}`
    case 'm:sSubSup': return `${wrap(omml(kid(el, 'm:e')))}_{${omml(kid(el, 'm:sub'))}}^{${omml(kid(el, 'm:sup'))}}`
    case 'm:d': {
      const pr = kid(el, 'm:dPr'); const b = pr && kid(pr, 'm:begChr')?.attrs['m:val']; const e = pr && kid(pr, 'm:endChr')?.attrs['m:val']
      const open = b === undefined ? '(' : b, close = e === undefined ? ')' : e
      const inner = kids(el, 'm:e').map(omml).join('; ')
      const L = { '(': '\\left(', '[': '\\left[', '{': '\\left\\{', '|': '\\left|', '': '' }[open] ?? open
      const Rr = { ')': '\\right)', ']': '\\right]', '}': '\\right\\}', '|': '\\right|', '': '' }[close] ?? close
      return `${L}${inner}${Rr}`
    }
    case 'm:rad': { const deg = kid(el, 'm:deg'); const d = deg ? omml(deg) : ''; return `\\sqrt${d ? `[${d}]` : ''}{${omml(kid(el, 'm:e'))}}` }
    case 'm:bar': return `\\overline{${omml(kid(el, 'm:e'))}}`
    case 'm:acc': { const pr = kid(el, 'm:accPr'); const ch = pr && kid(pr, 'm:chr')?.attrs['m:val']; return `\\${ch === '̂' ? 'hat' : ch === '⃗' ? 'vec' : 'hat'}{${omml(kid(el, 'm:e'))}}` }
    case 'm:nary': { const pr = kid(el, 'm:naryPr'); const ch = (pr && kid(pr, 'm:chr')?.attrs['m:val']) || '∫'; const s = kid(el, 'm:sub'), u = kid(el, 'm:sup'); return `${ch === '∑' ? '\\sum' : ch}${s ? `_{${omml(s)}}` : ''}${u ? `^{${omml(u)}}` : ''} ${omml(kid(el, 'm:e'))}` }
    case 'm:eqArr': return kids(el, 'm:e').map(omml).join(' \\\\ ')
    case 'm:func': return `${omml(kid(el, 'm:fName'))} ${omml(kid(el, 'm:e'))}`
    case 'm:box': case 'm:borderBox': case 'm:groupChr': case 'm:limLow': case 'm:limUpp': case 'm:e': case 'm:num': case 'm:den': case 'm:sup': case 'm:sub': case 'm:deg': case 'm:fName':
      return el.children.map(omml).join('')
    default: return el.name?.endsWith('Pr') ? '' : el.children.map(omml).join('')
  }
}
const wrap = (s) => (s.length === 1 || /^\\dfrac\{[^{}]*\}\{[^{}]*\}$/.test(s) || /^\\left.*\\right.$/.test(s) ? s : `{${s}}`)

// ── Đoạn văn: chữ thường + công thức $…$ theo thứ tự xuất hiện ──
function para(p) {
  let s = ''
  const walk = (el) => {
    if (el.text != null) return
    if (el.name === 'm:oMath' || el.name === 'm:oMathPara') { const t = omml(el).trim(); if (t) s += `$${t}$`; return }
    if (el.name === 'w:t') { s += allText(el); return }
    // Công thức dạng OLE (MathType) / ảnh: không có text → placeholder [[img:tên file]] để ghép với ảnh đã render
    if (el.name === 'v:imagedata' || el.name === 'a:blip') { const rid = el.attrs['r:id'] ?? el.attrs['r:embed']; s += `[[img:${rels[rid] ?? rid}]]`; return }
    if (el.name === 'w:tab') { s += ' '; return }
    if (el.name === 'w:br') { s += '\n'; return }
    for (const c of el.children) walk(c)
  }
  walk(p)
  return s.replace(/\$\s*\$/g, '').replace(/[ \t]+/g, ' ').trim()
}
const docEl = doc.children.find((c) => c.name === 'w:document') ?? doc
const body = kid(docEl, 'w:body') ?? docEl
const lines = []
const walkBody = (el) => { for (const c of el.children) { if (c.name === 'w:p') { const t = para(c); if (t) lines.push(t) } else if (c.children) walkBody(c) } }
walkBody(body)
const text = lines.join('\n')
if (out) { writeFileSync(out, text, 'utf8'); console.log(`→ ${out} (${lines.length} đoạn)`) } else console.log(text)
