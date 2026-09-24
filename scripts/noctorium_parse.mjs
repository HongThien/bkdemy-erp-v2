// ============================================================================
// noctorium_parse.mjs — BÓC bộ đề Noctorium (.docx, Word Equation/OMML) → JSON, 0 token AI.
// Bộ Noctorium = 2 bản CÙNG câu: bản ĐỀ (mỗi file 1 đề, có "Phần n:" + "Câu k." + "Lời giải")
// và bản DẠNG (cùng câu xếp theo Chương/Bài/Dạng của họ). Bản đề là nguồn nội dung + cấu trúc;
// bản dạng CHỈ cho bảng tra câu → (chương, bài, dạng của họ) để thu hẹp ứng viên khi gán dạng BK
// (CEO 21/09: nhãn của họ không lưu DB, dùng xong bỏ). spec-de-thi.md §4b.
//
//   node scripts/noctorium_parse.mjs --de <folder đề> --dang <folder dạng> --khoi 12 --out <dir> [--loc "Toán 12"]
//   (--loc chỉ lọc file ĐỀ theo chuỗi trong đường dẫn; folder dạng đọc hết)
//
// Ra: <out>/de/<sha8>.json (1 đề: meta + phan[] + cau[]), <out>/img/<sha8>_<n>.png (hình),
//     <out>/nhan.json (khoá nội dung → nhãn của họ), <out>/tong_ket.json.
// Việc CẦN AI (chưa làm ở đây, đánh dấu trong JSON): đáp án trắc nghiệm (file không đánh dấu),
// đáp án TLN khi máy không rút được từ "Vậy …", gán dạng BK.
//
// ⚠️ File này đầy backslash — SỬA BẰNG Write tool, KHÔNG patch qua heredoc Bash (nuốt 1 dấu \).
// ============================================================================
import JSZip from 'jszip'
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { createHash } from 'node:crypto'

// ── args ─────────────────────────────────────────────────────────────────────
const A = {}; { const v = process.argv.slice(2); for (let i = 0; i < v.length; i++) if (v[i].startsWith('--')) { A[v[i].slice(2)] = v[i + 1] && !v[i + 1].startsWith('--') ? v[++i] : true } }
if (!A.de || !A.khoi || !A.out) { console.error('Cần --de <folder> --khoi <10|11|12> --out <dir> [--dang <folder>] [--loc "Toán 12"]'); process.exit(2) }
const LOC = A.loc ? String(A.loc).normalize('NFC') : null
const nfc = (s) => String(s).normalize('NFC')
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.docx$/i.test(n) && !/^~\$/.test(n) ? [p] : [] })

// ── XML mini-parser (copy từ docx-doc.mjs) ────────────────────────────────────
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
const kids = (el, name) => el.children.filter((c) => c.name === name)
const kid = (el, name) => el.children.find((c) => c.name === name)
const allText = (el) => el.text != null ? el.text : el.children.map(allText).join('')

// ── OMML → LaTeX (mở rộng từ docx-doc.mjs cho đề THPT) ────────────────────────
const SYM = {
  '−': '-', '–': '-', '—': '-', '·': '\\cdot ', '⋅': '\\cdot ', '×': '\\times ', '÷': ':', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '≈': '\\approx ',
  '∈': '\\in ', '∉': '\\notin ', '⊂': '\\subset ', '⊃': '\\supset ', '∪': '\\cup ', '∩': '\\cap ', '∅': '\\varnothing ', '∖': '\\setminus ',
  'ℚ': '\\mathbb{Q}', 'ℤ': '\\mathbb{Z}', 'ℕ': '\\mathbb{N}', 'ℝ': '\\mathbb{R}', '±': '\\pm ', '∓': '\\mp ', '∞': '\\infty ', '…': '\\dots ',
  '→': '\\to ', '⇒': '\\Rightarrow ', '⇔': '\\Leftrightarrow ', '⇐': '\\Leftarrow ', '∀': '\\forall ', '∃': '\\exists ', '∣': '|', '∥': '\\parallel ', '⊥': '\\perp ',
  '∘': '^\\circ ', '°': '^\\circ ', '′': "'", '″': "''", 'π': '\\pi ', 'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'Δ': '\\Delta ', 'φ': '\\varphi ', 'ω': '\\omega ', 'θ': '\\theta ', 'λ': '\\lambda ', 'μ': '\\mu ', 'σ': '\\sigma ', 'ε': '\\varepsilon ',
  '∠': '\\angle ', '△': '\\triangle ', '∑': '\\sum ', '∫': '\\int ', '∏': '\\prod ', '√': '\\sqrt', '≡': '\\equiv ', '∼': '\\sim ', '{': '\\{', '}': '\\}', '%': '\\%',
  '⁡': '', '⁢': '', '⁣': '', '⁤': '', ' ': ' ', '​': '',
}
const SYM_RE = new RegExp(`[${Object.keys(SYM).map((c) => c.length === 1 ? c : '').join('').replace(/[\]\\^-]/g, '\\$&')}]`, 'g')
const FUNCS = ['sin', 'cos', 'tan', 'cot', 'ln', 'log', 'lim', 'min', 'max', 'exp', 'arcsin', 'arccos', 'arctan']
const FUNC_RE = new RegExp(`(^|[^a-zA-Z\\\\])(${FUNCS.join('|')})(?![a-zA-Z])`, 'g')
/** Text của 1 run trong công thức. \text{} CHỈ cho chữ tiếng Việt (có dấu) hoặc cụm có khoảng trắng — "ABCD", "Oxyz", "dm" để trần như kho. */
function mathText(t, sty, scr) {
  if (scr === 'double-struck') return t.replace(/[A-Z]/g, (c) => `\\mathbb{${c}}`)
  t = t.replace(SYM_RE, (ch) => SYM[ch] ?? ch).replace(FUNC_RE, (_, a, fn) => `${a}\\${fn} `)
  const con = t.replace(/\\[a-zA-Z]+/g, '')
  if (/[À-ỹ]/.test(con) || (/\s/.test(con.trim()) && /[a-zA-Z]{2,}/.test(con))) return `\\text{${t}}`
  return t
}
function omml(el) {
  if (el.text != null) return ''
  switch (el.name) {
    case 'm:oMathPara': return kids(el, 'm:oMath').map(omml).join(' ')
    case 'm:oMath': return el.children.map(omml).join('')
    case 'm:r': { const pr = kid(el, 'm:rPr'); const sty = pr && kid(pr, 'm:sty')?.attrs['m:val']; const scr = pr && kid(pr, 'm:scr')?.attrs['m:val']; return mathText(kids(el, 'm:t').map(allText).join(''), sty, scr) }
    case 'm:f': { const num = omml(kid(el, 'm:num')), den = omml(kid(el, 'm:den')); const pr = kid(el, 'm:fPr'); const type = pr && kid(pr, 'm:type')?.attrs['m:val']; return type === 'skw' || type === 'lin' ? `${num}/${den}` : `\\dfrac{${num}}{${den}}` }
    case 'm:sSup': { const e = omml(kid(el, 'm:e')), st = omml(kid(el, 'm:sup')).trim(); return st === '^\\circ' ? `${e}^\\circ` : /^'+$/.test(st) ? `${e}${st}` : `${wrap(e)}^{${st}}` }
    case 'm:sSub': return `${wrap(omml(kid(el, 'm:e')))}_{${omml(kid(el, 'm:sub'))}}`
    case 'm:sSubSup': return `${wrap(omml(kid(el, 'm:e')))}_{${omml(kid(el, 'm:sub'))}}^{${omml(kid(el, 'm:sup'))}}`
    case 'm:sPre': return `{}_{${omml(kid(el, 'm:sub'))}}^{${omml(kid(el, 'm:sup'))}}${omml(kid(el, 'm:e'))}`
    case 'm:d': {
      const pr = kid(el, 'm:dPr'); const b = pr && kid(pr, 'm:begChr')?.attrs['m:val']; const e = pr && kid(pr, 'm:endChr')?.attrs['m:val']
      const open = b === undefined ? '(' : b, close = e === undefined ? ')' : e
      const es = kids(el, 'm:e')
      // Bộ này mã hoá "2x−1" trong ngoặc thành 2 m:e nối bằng sepChr="−" ⇒ PHẢI nối bằng sepChr thật (mặc định OMML là "|")
      const sepRaw = pr && kid(pr, 'm:sepChr')?.attrs['m:val']; const sep = sepRaw === undefined ? '|' : (SYM[sepRaw] ?? sepRaw).trim()
      // Hệ "{" + eqArr ⇒ \begin{cases}; "hoặc" "[" + eqArr ⇒ \left[\begin{array}{l}…\end{array}\right.
      if (close === '' && es.length === 1 && kid(es[0], 'm:eqArr')) {
        const dong = kids(kid(es[0], 'm:eqArr'), 'm:e').map(omml).join(' \\\\ ')
        if (open === '{') return `\\begin{cases} ${dong} \\end{cases}`
        if (open === '[') return `\\left[\\begin{array}{l} ${dong} \\end{array}\\right.`
      }
      const inner = es.map(omml).join(sep)
      const L = { '(': '\\left(', '[': '\\left[', '{': '\\left\\{', '|': '\\left|', '': '\\left.', '⟨': '\\langle ' }[open] ?? open
      const R = { ')': '\\right)', ']': '\\right]', '}': '\\right\\}', '|': '\\right|', '': '\\right.', '⟩': '\\rangle ' }[close] ?? close
      return `${L}${inner}${R}`
    }
    case 'm:rad': { const deg = kid(el, 'm:deg'); const d = deg ? omml(deg) : ''; return `\\sqrt${d ? `[${d}]` : ''}{${omml(kid(el, 'm:e'))}}` }
    case 'm:bar': return `\\overline{${omml(kid(el, 'm:e'))}}`
    case 'm:acc': {
      const pr = kid(el, 'm:accPr'); const ch = (pr && kid(pr, 'm:chr')?.attrs['m:val']) ?? '̂'; const e = omml(kid(el, 'm:e'))
      if (ch === '⃗' || ch === '→') return `\\overrightarrow{${e}}`
      if (ch === '̅' || ch === '¯') return `\\overline{${e}}`
      if (ch === '̃') return `\\tilde{${e}}`
      if (ch === '̇') return `\\dot{${e}}`
      return e.replace(/[\\{}]/g, '').length > 1 ? `\\widehat{${e}}` : `\\hat{${e}}`
    }
    case 'm:nary': {
      const pr = kid(el, 'm:naryPr'); const ch = (pr && kid(pr, 'm:chr')?.attrs['m:val']) || '∫'; const s = kid(el, 'm:sub'), u = kid(el, 'm:sup')
      const op = { '∫': '\\int', '∑': '\\sum', '∏': '\\prod', '∬': '\\iint', '∮': '\\oint' }[ch] ?? ch
      return `${op}${s ? `_{${omml(s)}}` : ''}${u ? `^{${omml(u)}}` : ''} ${omml(kid(el, 'm:e'))}`
    }
    case 'm:eqArr': return `\\begin{array}{l} ${kids(el, 'm:e').map(omml).join(' \\\\ ')} \\end{array}`
    case 'm:limLow': return `${omml(kid(el, 'm:e')).trim()}\\limits_{${omml(kid(el, 'm:lim'))}}`
    case 'm:limUpp': return `${omml(kid(el, 'm:e'))}^{${omml(kid(el, 'm:lim'))}}`
    case 'm:func': return `${omml(kid(el, 'm:fName')).trim()} ${omml(kid(el, 'm:e'))}`
    case 'm:m': return `\\begin{matrix} ${kids(el, 'm:mr').map((r) => kids(r, 'm:e').map(omml).join(' & ')).join(' \\\\ ')} \\end{matrix}`
    case 'm:groupChr': { const pr = kid(el, 'm:groupChrPr'); const ch = pr && kid(pr, 'm:chr')?.attrs['m:val']; const e = omml(kid(el, 'm:e')); return ch === '⏞' ? `\\overbrace{${e}}` : `\\underbrace{${e}}` }
    case 'm:box': case 'm:borderBox': case 'm:e': case 'm:num': case 'm:den': case 'm:sup': case 'm:sub': case 'm:deg': case 'm:fName': case 'm:lim':
      return el.children.map(omml).join('')
    default: return el.name?.endsWith('Pr') ? '' : el.children.map(omml).join('')
  }
}
const wrap = (s) => (s.length === 1 || /^\\[a-zA-Z]+$/.test(s.trim()) || /^\\dfrac\{[^{}]*\}\{[^{}]*\}$/.test(s) || /^\\left.*\\right.$/.test(s) || /^\\(overrightarrow|overline|widehat|sqrt|mathbb)\{[^{}]*\}$/.test(s) ? s : `{${s}}`)
const tidy = (t) => t.replace(/\s+/g, ' ').replace(/\s+([,;.)])/g, '$1').replace(/\( /g, '(').replace(/\s+\\limits/g, '\\limits').trim()

// ── Đoạn văn → { text (chữ + $latex$), imgs[] } ──────────────────────────────
function para(p, rels) {
  let s = ''; const imgs = []
  const walkEl = (el) => {
    if (el.text != null) return
    if (el.name === 'm:oMath' || el.name === 'm:oMathPara') { const t = tidy(omml(el)); if (t) s += `$${t}$`; return }
    if (el.name === 'w:t') { s += allText(el); return }
    if (el.name === 'a:blip' || el.name === 'v:imagedata') { const rid = el.attrs['r:embed'] ?? el.attrs['r:id']; const f = rels[rid]; if (f) imgs.push(f); s += '[[IMG]]'; return }
    if (el.name === 'w:tab') { s += '\t'; return }
    if (el.name === 'w:br') { s += '\n'; return }
    for (const c of el.children) walkEl(c)
  }
  walkEl(p)
  // "$a$$b$" liền nhau ⇒ gộp; "$ $" rỗng ⇒ bỏ
  s = s.replace(/\$\s*\$/g, '').replace(/\$\$/g, ' ').replace(/[ ]{2,}/g, ' ').trim()
  return { text: s, imgs }
}

async function docParas(file) {
  const buf = readFileSync(file)
  const zip = await JSZip.loadAsync(buf)
  const xml = await zip.file('word/document.xml').async('string')
  const relsXml = zip.file('word/_rels/document.xml.rels') ? await zip.file('word/_rels/document.xml.rels').async('string') : ''
  const rels = Object.fromEntries([...relsXml.matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"/g)].map((m) => [m[1], m[2].replace(/^media\//, '')]))
  const doc = parseXml(xml)
  const body = kid(kid(doc, 'w:document') ?? doc, 'w:body')
  const out = []
  // Bảng Word (bảng tần số thống kê, bảng giá trị…) ⇒ 1 "đoạn" LaTeX array có kẻ ô: $\begin{array}{|c|c|}\hline a & b \\ \hline … \end{array}$
  // Ô chữ thường ⇒ \text{}, ô công thức giữ nguyên (bỏ $), ô trộn ⇒ ghép. Hình trong ô: bỏ (hiếm).
  const cell = (tc) => {
    const ps = kids(tc, 'w:p').map((p) => para(p, rels).text).filter(Boolean)
    const t = ps.join(' ').replace(/\[\[IMG\]\]/g, '').replace(/\\cline\s*[\d-]+/g, '').trim() // ô gộp dọc: generator ghi chữ "\cline2-7"
    if (!t) return ''
    return t.split(/(\$[^$]*\$)/).filter(Boolean).map((seg) => seg.startsWith('$') ? seg.slice(1, -1) : `\\text{${seg.replace(/[{}]/g, '').trim()}}`).join(' ')
  }
  const tbl = (el) => {
    const rows = kids(el, 'w:tr').map((tr) => kids(tr, 'w:tc').map(cell))
    const nCol = Math.max(0, ...rows.map((r) => r.length)); if (!nCol) return null
    return { text: `$\\begin{array}{|${'c|'.repeat(nCol)}} \\hline ${rows.map((r) => r.join(' & ')).join(' \\\\ \\hline ')} \\\\ \\hline \\end{array}$`, imgs: [] }
  }
  const walkBody = (el) => { for (const c of el.children) { if (c.name === 'w:p') { const r = para(c, rels); if (r.text || r.imgs.length) out.push(r) } else if (c.name === 'w:tbl') { const r = tbl(c); if (r) out.push(r) } else if (c.children) walkBody(c) } }
  walkBody(body)
  const media = async (name) => zip.file(`word/media/${name}`) ? await zip.file(`word/media/${name}`).async('nodebuffer') : null
  return { paras: out, media, sha256: createHash('sha256').update(buf).digest('hex') }
}

// ── Khoá so trùng nội dung (dùng CHUNG cho bản đề & bản dạng — cùng parser) ──
const keyOf = (stem) => stem.replace(/\[\[IMG\]\]/g, '').replace(/\s+/g, '').toLowerCase().slice(0, 160)

const PHAN_MAP = { 'trắc nghiệm': ['trac_nghiem', 0.25], 'đúng sai': ['dung_sai', 1], 'trả lời ngắn': ['tra_loi_ngan', 0.5], 'tự luận': ['tu_luan', 0.5] }
const CHU = (s) => nfc(s).replace(/\[\[IMG\]\]/g, '').replace(/[ \t]+/g, ' ').trim()

/** Bóc 1 file (đề hoặc dạng) thành danh sách câu theo cấu trúc chung của Noctorium. */
async function bocFile(file) {
  const { paras, media, sha256 } = await docParas(file)
  const ten = CHU(paras[0]?.text ?? basename(file, '.docx'))
  const phan = []; const cau = []
  let curPhan = null, cur = null, mode = null // mode: 'de' | 'giai'
  const flush = () => { if (cur) { cau.push(cur); cur = null } }
  // Tách đoạn theo xuống dòng mềm (w:br): có đề gõ "Câu 1. …⏎a)Cho góc…⏎b)…" trong CÙNG 1 đoạn ⇒ mệnh đề bị nuốt vào đề bài
  const lines = paras.slice(1).flatMap((p) => nfc(p.text).split('\n').map((text, i) => ({ text: text.trim(), imgs: i === 0 ? p.imgs : [] })))
  for (const p of lines) {
    const t = p.text
    const mp = t.match(/^Phần\s+(\d+)\s*:\s*(.+?)\s*$/i)
    if (mp) { flush(); const tenPhan = mp[2].trim(); const [dt, diem] = PHAN_MAP[tenPhan.toLowerCase()] ?? ['tu_luan', 0.5]; curPhan = { thu_tu: +mp[1], ten: tenPhan, dang_thuc: dt, diem_moi_cau: diem }; phan.push(curPhan); continue }
    const mc = t.match(/^Câu\s+(\d+)\s*\.\s*(.*)$/s)
    if (mc) { flush(); cur = { so: +mc[1], phan: curPhan?.thu_tu ?? null, dang_thuc: curPhan?.dang_thuc ?? 'tu_luan', stem: [mc[2].trim()], imgs: [...p.imgs], luaChon: [], menhDe: [], giai: [], imgsGiai: [] }; mode = 'de'; continue }
    if (!cur) continue
    if (/^Lời giải\s*[:.]?\s*$/i.test(t)) { mode = 'giai'; continue }
    if (mode === 'de') {
      cur.imgs.push(...p.imgs)
      if (/^[A-D]\.(\s|\$)/.test(t)) { cur.luaChon.push(t); continue }
      if (/^[a-d]\)/.test(t)) { cur.menhDe.push(t); continue } // có đề viết dính "a)Cho góc…" không khoảng trắng
      if (t && t !== '[[IMG]]') { if (cur.luaChon.length) cur.luaChon[cur.luaChon.length - 1] += '\n' + t; else if (cur.menhDe.length) cur.menhDe[cur.menhDe.length - 1] += '\n' + t; else cur.stem.push(t) }
    } else { cur.imgsGiai.push(...p.imgs); if (t && t !== '[[IMG]]') cur.giai.push(t) }
  }
  flush()
  return { ten, sha256, phan, cau, media }
}

/** Tách phương án: các đoạn "A. x\tB. y" hoặc "A. x" từng dòng ⇒ 4 chuỗi không chữ cái. */
function tachLuaChon(lines) {
  const parts = []
  for (const l of lines) for (const seg of l.split(/\t+/)) {
    // 1 segment có thể chứa 2 phương án cách nhau bằng khoảng trắng: "A. 1. B. 2." — chỉ cắt NGOÀI $…$
    const s = seg; const found = []
    const re = /(^|\s)([A-D])\.\s/g; let m
    while ((m = re.exec(s))) { const before = s.slice(0, m.index); if (((before.match(/\$/g) || []).length) % 2 === 0) found.push(m.index + m[1].length) }
    if (!found.length) { if (parts.length) parts[parts.length - 1] += '\n' + s.trim(); continue }
    for (let i = 0; i < found.length; i++) parts.push(s.slice(found[i], found[i + 1] ?? s.length).trim())
  }
  return parts.map((x) => ({ chu: x[0], text: CHU(x.replace(/^[A-D]\.\s*/, '')) }))
}

/** Đáp án TRẮC NGHIỆM: file không đánh dấu ⇒ máy thử (1) "Chọn A"/"Đáp án A" trong lời giải, (2) đúng 1 phương án
 *  có phần công thức/nội dung xuất hiện nguyên văn trong 3 đoạn cuối lời giải. Không chắc ⇒ null (AI xử sau). */
const chuan = (s) => s.replace(/\\left|\\right|\\text\{[^}]*\}|\\,|\\;|\\ /g, '').replace(/[\s.$]+/g, '').replace(/\{|\}/g, '').toLowerCase()
function rutDapAnTN(luaChon, giai) {
  const duoi = giai.slice(-3).join(' ')
  const m = duoi.match(/(?:Chọn|chọn|Đáp án|đáp án)\s*(?:đáp án\s*)?\(?([A-D])\)?\b/)
  if (m) return { dap_an: m[1], tin: 'may' }
  const cd = chuan(duoi)
  const hit = luaChon.map((o, i) => ({ i, k: chuan(o.replace(/\.$/, '')) })).filter((x) => x.k.length >= 2 && cd.includes(x.k))
  if (hit.length === 1) return { dap_an: 'ABCD'[hit[0].i], tin: 'may' }
  // nhiều phương án cùng xuất hiện ⇒ lấy cái xuất hiện MUỘN nhất nếu chỉ 1 cái nằm ở câu "Vậy …"
  const vay = chuan(giai.slice().reverse().find((l) => /Vậy|Do đó|Suy ra/.test(l)) ?? '')
  const hv = hit.filter((x) => vay.includes(x.k))
  if (hv.length === 1) return { dap_an: 'ABCD'[hv[0].i], tin: 'may' }
  return { dap_an: null, tin: 'chua' }
}

/** Đáp án TLN: máy rút từ câu "Vậy …" cuối lời giải; không chắc ⇒ null (AI/người xử sau). */
function rutDapAnTLN(giai) {
  const last = [...giai].reverse().find((l) => /Vậy|Đáp án|đáp án|Kết luận/.test(l)) ?? giai[giai.length - 1] ?? ''
  const nums = [...last.matchAll(/-?\d+(?:[.,]\d+)?/g)].map((m) => m[0].replace(',', '.'))
  const eq = last.match(/=\s*\$?\s*(-?\d+(?:[.,]\d+)?)\s*\$?\s*(?:\\text\{[^}]*\})?\s*[.)]?\s*$/)
  if (eq) return { dap_an: eq[1].replace(',', '.'), tin: 'may' }
  if (nums.length === 1) return { dap_an: nums[0], tin: 'may' }
  return { dap_an: null, tin: 'chua' }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
mkdirSync(join(A.out, 'de'), { recursive: true }); mkdirSync(join(A.out, 'img'), { recursive: true })
const loc = (f) => !LOC || nfc(f).includes(LOC)

// 1) Bản DẠNG → bảng tra khoá → nhãn (nếu có). Đọc HẾT folder dạng (không lọc --loc).
const nhan = {}
if (A.dang && existsSync(A.dang)) {
  const files = walk(A.dang)
  for (const f of files) {
    const parts = nfc(f).split(/[\\/]/); const n = parts.length
    const lbl = { chuong: parts[n - 3], bai: parts[n - 2], dang: parts[n - 1].replace(/\.docx$/i, '').replace(/_Phần \d+$/, '') }
    const r = await bocFile(f)
    for (const c of r.cau) { const k = keyOf(CHU(c.stem.join(' '))); if (!nhan[k]) nhan[k] = lbl }
  }
  writeFileSync(join(A.out, 'nhan.json'), JSON.stringify(nhan), 'utf8')
  console.error(`bản dạng: ${files.length} file → ${Object.keys(nhan).length} khoá`)
}

// 2) Bản ĐỀ → JSON từng đề
const tk = { de: 0, cau: 0, phan: {}, tn_khong_du_4: 0, ds_khong_du_4: 0, tn_may_rut: 0, tn_chua: 0, tln_may_rut: 0, tln_chua: 0, co_nhan: 0, khong_nhan: 0, anh: 0, cau_it: [] }
const BO = A.bo ? String(A.bo).normalize('NFC') : null // --bo "Toán 11" = loại file đề có chuỗi này
for (const f of walk(A.de).filter(loc).filter((f) => !BO || !nfc(f).includes(BO))) {
  const r = await bocFile(f)
  const sha8 = r.sha256.slice(0, 8)
  const cauOut = []; let nImg = 0
  for (const c of r.cau) {
    const stem = CHU(c.stem.join('\n'))
    const k = keyOf(stem); const lbl = nhan[k] ?? null; lbl ? tk.co_nhan++ : tk.khong_nhan++
    const imgs = []; for (const m of c.imgs) { const buf = await r.media(m); if (buf) { const name = `${sha8}_${++nImg}.png`; writeFileSync(join(A.out, 'img', name), buf); imgs.push(name) } }
    const imgsGiai = []; for (const m of c.imgsGiai) { const buf = await r.media(m); if (buf) { const name = `${sha8}_${++nImg}.png`; writeFileSync(join(A.out, 'img', name), buf); imgsGiai.push(name) } }
    tk.anh += imgs.length + imgsGiai.length
    const q = { thu_tu: c.so, phan: c.phan, loai_cau: c.dang_thuc, noi_dung: stem, anh: imgs, anh_giai: imgsGiai, nhan: lbl, key: k }
    if (c.dang_thuc === 'trac_nghiem') {
      const lc = tachLuaChon(c.luaChon); q.lua_chon = lc.map((x) => x.text)
      if (lc.length !== 4 || lc.map((x) => x.chu).join('') !== 'ABCD') tk.tn_khong_du_4++
      const g = c.giai.map(CHU); q.loi_giai = g.join('\n\n')
      const d = rutDapAnTN(q.lua_chon, g); q.dap_an = d.dap_an; q.dap_an_tin = d.tin; d.tin === 'may' ? tk.tn_may_rut++ : tk.tn_chua++
    } else if (c.dang_thuc === 'dung_sai') {
      // Mệnh đề a)…d); lời giải có "a) Đúng." / "a)  Sai." mở đầu từng ý
      const md = c.menhDe.map((t) => ({ chu: t[0], noi_dung: CHU(t.replace(/^[a-d]\)\s*/, '')) }))
      let cur = null
      for (const l of c.giai) { const m = nfc(l).match(/^([a-d])\)\s*(Đúng|Sai)\s*[.:]?\s*(.*)$/s); if (m) { cur = md.find((x) => x.chu === m[1]); if (cur) { cur.dap_an = m[2] === 'Đúng' ? 'D' : 'S'; cur.loi_giai = CHU(m[3]) } continue } if (cur) cur.loi_giai = (cur.loi_giai ? cur.loi_giai + '\n\n' : '') + CHU(l) }
      q.menh_de = md.map(({ noi_dung, dap_an, loi_giai }) => ({ noi_dung, dap_an: dap_an ?? null, loi_giai: loi_giai ?? null }))
      if (md.length !== 4 || md.some((x) => !x.dap_an)) tk.ds_khong_du_4++
      q.loi_giai = null
    } else if (c.dang_thuc === 'tra_loi_ngan') {
      const g = c.giai.map(CHU); q.loi_giai = g.join('\n\n'); const d = rutDapAnTLN(g); q.dap_an = d.dap_an; q.dap_an_tin = d.tin; d.tin === 'may' ? tk.tln_may_rut++ : tk.tln_chua++
    } else { q.loi_giai = c.giai.map(CHU).join('\n\n'); q.dap_an = null; q.y = c.menhDe.map((t) => CHU(t)) }
    cauOut.push(q)
  }
  const nam = (r.ten.match(/(20\d\d)\s*-\s*20\d\d/) ?? r.ten.match(/(20\d\d)/))?.[1] ?? null
  const truong = r.ten.match(/(?:trường|trung tâm|liên trường|sở GD&ĐT|sở)\s+(.+)$/i)?.[1]?.trim() ?? null
  const de = { file: basename(f), sha256: r.sha256, ten: r.ten, khoi: String(A.khoi), nam: nam ? +nam : null, truong, phan: r.phan, cau: cauOut }
  writeFileSync(join(A.out, 'de', `${sha8}.json`), JSON.stringify(de, null, 1), 'utf8')
  tk.de++; tk.cau += cauOut.length; for (const p of r.phan) tk.phan[p.dang_thuc] = (tk.phan[p.dang_thuc] ?? 0) + cauOut.filter((q) => q.phan === p.thu_tu).length
  if (cauOut.length < 10) tk.cau_it.push(`${cauOut.length} | ${basename(f)}`)
}
writeFileSync(join(A.out, 'tong_ket.json'), JSON.stringify(tk, null, 1), 'utf8')
console.log(JSON.stringify(tk, null, 1))
