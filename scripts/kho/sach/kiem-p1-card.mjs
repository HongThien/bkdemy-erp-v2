// Kiểm hình thức Phần 1 dạng CARD 3–6 bước (README §3, CEO 09/10) — node scripts/kho/sach/kiem-p1-card.mjs <in.json> <out.md>
// Dùng làm thư viện: import { kiemP1, docOut } — kiemP1(phan1) trả mảng lỗi (rỗng = đạt).
// out-NN.md: mỗi câu một khối, mở bằng dòng "=== <ma_cau>", tiếp theo là Phần 1 mới (bắt đầu "**Phần 1. Hướng dẫn**").
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const require = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')
const katex = require('katex')

export function docOut(txt) {
  const kq = {}
  const khoi = txt.replace(/\r\n/g, '\n').split(/^=== /m).slice(1)
  for (const k of khoi) {
    const i = k.indexOf('\n')
    const ma = k.slice(0, i).trim()
    kq[ma] = k.slice(i + 1).replace(/\n{3,}/g, '\n\n').trim()
  }
  return kq
}

const ngoaiCongThuc = (s) => s.replace(/\$[^$]*\$/g, ' ').replace(/\*\*[^*]*\*\*/g, ' ')
const soChu = (s) => ngoaiCongThuc(s).split(/\s+/).filter((w) => /\p{L}/u.test(w)).length

export function kiemP1(p1) {
  const loi = []
  if (!p1) return ['THIẾU câu này']
  const doan = p1.split(/\n\n/)
  if (doan[0] !== '**Phần 1. Hướng dẫn**') loi.push('đoạn đầu phải đúng "**Phần 1. Hướng dẫn**"')
  if (!doan[1]?.startsWith('**Mấu chốt:**')) loi.push('đoạn thứ hai phải mở bằng "**Mấu chốt:**"')
  let k = 2, n = 0
  while (k < doan.length && doan[k].startsWith('**Bước ')) {
    n++
    const m = doan[k].match(/^\*\*Bước (\d+)\.\*\*\s+(.*)$/s)
    if (!m) loi.push(`Bước ${n}: phải mở bằng "**Bước ${n}.** " (có dấu chấm trong phần in đậm)`)
    else {
      if (+m[1] !== n) loi.push(`đánh số bước không liên tục (gặp ${m[1]}, cần ${n})`)
      if (soChu(m[2]) < 5) loi.push(`Bước ${n} quá vụn (ít hơn 5 chữ ngoài công thức): "${m[2].slice(0, 60)}"`)
    }
    k++
  }
  if (n < 3 || n > 6) loi.push(`số bước = ${n}, phải 3–6`)
  for (; k < doan.length; k++) {
    if (!/^(\*\*Chú ý:\*\*|\*\*Thử lại:\*\*|Thử lại:)/.test(doan[k])) loi.push(`sau chuỗi bước chỉ được đoạn "**Chú ý:**" / "Thử lại:" — gặp: "${doan[k].slice(0, 50)}"`)
  }
  if (/\*\*Phần 2/.test(p1)) loi.push('không được chứa Phần 2')
  if (/\*\*Bước \d+\.\*\*/.test(doan.slice(0, 2).join('\n\n'))) loi.push('Mấu chốt không được chứa bước')
  if ((p1.match(/\$/g) || []).length % 2) loi.push('số dấu $ lẻ')
  for (const m of p1.matchAll(/\$([^$]+)\$/g)) {
    const warn = []; const o = console.warn; console.warn = (x) => warn.push(x)
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'warn' }) } catch (e) { warn.push(e.message) }
    console.warn = o
    if (warn.length) loi.push(`KaTeX: ${m[1].slice(0, 50)} | ${String(warn[0]).slice(0, 70)}`)
    if (/[À-ỹ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`chữ Việt trong công thức: ${m[1].slice(0, 50)}`)
  }
  return loi
}

if (process.argv[1]?.endsWith("kiem-p1-card.mjs")) {
  const [fin, fout] = process.argv.slice(2)
  const vao = JSON.parse(readFileSync(fin, 'utf8'))
  const ra = docOut(readFileSync(fout, 'utf8'))
  let bad = 0
  for (const c of vao) {
    const l = kiemP1(ra[c.ma_cau])
    if (l.length) { bad++; console.log(`✖ ${c.ma_cau} ${c.ma}: ${l.join(' · ')}`) }
  }
  const thua = Object.keys(ra).filter((m) => !vao.some((c) => c.ma_cau === m))
  if (thua.length) { bad++; console.log('✖ mã lạ trong out:', thua.join(' ')) }
  console.log(`${vao.length} câu · lỗi ${bad}`)
  process.exit(bad ? 1 : 0)
}
