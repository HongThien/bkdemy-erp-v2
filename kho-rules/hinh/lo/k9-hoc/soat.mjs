// soát máy các bản nháp draft_<BAI>_*.md: KaTeX render, $ lẻ, 2 phần, hình tồn tại, nhãn trùng/thiếu so với gói nguồn
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')
const katex = require('katex')
const K = 'C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/0b0aaccd-e68b-45b5-96e4-b914b4d1311c/scratchpad/k9b'
const bai = process.argv[2]
const goi = JSON.parse(readFileSync(`${K}/nguon/_tat-ca.json`, 'utf8'))[bai]
const files = readdirSync(K).filter((f) => f.startsWith(`draft_${bai}_`) && f.endsWith('.md')).sort()
const seen = new Map(); let loi = 0
for (const f of files) {
  const nhom = f.replace(`draft_${bai}_`, '').replace('.md', '')
  const txt = readFileSync(`${K}/${f}`, 'utf8').replace(/\r\n/g, '\n')
  for (const b of txt.split(/\n(?=### )/).filter((x) => x.startsWith('### '))) {
    const nh = b.match(/^### (\S+)/)[1]; const vd = []
    if (seen.has(nh)) vd.push('nhãn trùng với ' + seen.get(nh)); seen.set(nh, f)
    const iND = b.indexOf('**noi_dung:**'), iLG = b.indexOf('**loi_giai:**'), iEnd = b.search(/\*\*(cấu hình|nghi vấn)/)
    const body = b.slice(iND, iEnd)
    const lc = b.match(/\*\*lua_chon:\*\*\s*(\[.*\])/)?.[1]
    let texts = [body]
    if (lc) { try { texts.push(...JSON.parse(lc)) } catch { vd.push('lua_chon JSON hỏng') } }
    for (const t of texts) for (const line of t.split('\n')) {
      const n = (line.replace(/\\$/g, '').match(/\$/g) || []).length
      if (n % 2) vd.push('$ lẻ: ' + line.slice(0, 60))
      for (const m of line.matchAll(/\$([^$]+)\$/g)) {
        const tx = m[1].replace(/\\[a-zA-Z]+/g, ' ').match(/(perp|parallel|widehat|frac|triangle|circ|backsim|sqrt|cdot|overset|frown|Uparrow|Rightarrow|alpha)/)
        if (tx) vd.push('lệnh thiếu \\: ' + tx[1] + ' trong ' + m[1].slice(0, 40))
        if (/[à-ỹÀ-Ỹđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, '').replace(/\\mathrm\{[^}]*\}/g, ''))) vd.push('chữ Việt trong công thức: ' + m[1].slice(0, 40))
        try { katex.renderToString(m[1], { throwOnError: true, strict: false }) } catch (e) { vd.push('KaTeX: ' + m[1].slice(0, 50) + ' — ' + e.message.slice(0, 60)) } }
    }
    const lg = b.slice(iLG, iEnd)
    if (!/\*\*Phần 1\. Hướng dẫn\*\*/.test(lg) || !/\*\*Phần 2\. Trình bày\*\*/.test(lg)) vd.push('thiếu Phần 1/Phần 2')
    for (const k of ['hinh', 'hinh_lg']) { const h = b.match(new RegExp('\\*\\*' + k + ':\\*\\*\\s*(\\S+)'))?.[1]; if (h && !existsSync(`${K}/hinh_${bai}_${nhom}/${h}`)) vd.push(`không thấy ${k} ${h}`) }
    if (vd.length) { loi += vd.length; console.log(`⚠ ${f} ${nh}: ${[...new Set(vd)].join(' | ')}`) }
  }
}
const can = goi.map((_, i) => 'c' + String(i + 1).padStart(3, '0'))
const thieu = can.filter((n) => !seen.has(n))
console.log(`${bai}: ${seen.size}/${can.length} câu có nháp · lỗi ${loi}${thieu.length ? ' · CHƯA CÓ: ' + thieu.join(' ') : ''}`)
