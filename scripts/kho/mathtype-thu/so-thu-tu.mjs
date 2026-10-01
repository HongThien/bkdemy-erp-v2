// so-thu-tu.mjs — dựng lại NHÃN đánh số tự động của Word ("Câu 1.", "» Câu 2.", "a)", "•") từ word/numbering.xml.
//
// Word không lưu chữ "Câu 1." trong document.xml — đoạn chỉ mang <w:numPr><w:numId/><w:ilvl/></w:numPr>,
// nhãn được suy lúc hiển thị. Bỏ qua bước này là mất hết số câu (lỗ chặn #1 của bản thử 28/09).
//
// Luật đếm (theo cách Word làm, đã đối chiếu trên 10 file NBV/PNL/Từ Tâm):
//   - Mỗi <w:num> trỏ một <w:abstractNum>. Các num CÙNG abstractNum mà KHÔNG có <w:lvlOverride>
//     thì ĐẾM CHUNG (đây là bẫy kinh điển của Word: hai danh sách "khác nhau" vẫn nối số).
//   - num có <w:lvlOverride>/<w:startOverride> ở cấp đó ⇒ đếm RIÊNG cho num đó, bắt đầu từ startOverride.
//   - Tăng một cấp thì mọi cấp thấp hơn về lại start.
//   - lvlText: "%1" … "%9" = số của cấp tương ứng (cấp 1 = %1). numFmt: decimal · upperLetter · lowerLetter ·
//     upperRoman · lowerRoman · decimalZero · bullet · none.
//   - bullet: chữ trong lvlText là ký tự font Symbol/Wingdings (U+F0xx) ⇒ in thống nhất là "•".

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
const decode = (s) => s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
  return ENT[e] ?? m
})
const val = (xml, tag) => { const m = new RegExp('<' + tag + '\\b[^>]*\\bw:val="([^"]*)"').exec(xml); return m ? decode(m[1]) : null }

/** Đọc numbering.xml → { abstract: {id: {lvl: {start, fmt, text}}}, nums: {numId: {abs, override: {lvl: start|null}}} } */
export function docNumbering(xml) {
  const abstract = {}
  for (const m of xml.matchAll(/<w:abstractNum\b[^>]*\bw:abstractNumId="(\d+)"[^>]*>([\s\S]*?)<\/w:abstractNum>/g)) {
    const lvls = {}
    for (const l of m[2].matchAll(/<w:lvl\b[^>]*\bw:ilvl="(\d+)"[^>]*>([\s\S]*?)<\/w:lvl>/g)) {
      lvls[+l[1]] = { start: +(val(l[2], 'w:start') ?? 1), fmt: val(l[2], 'w:numFmt') ?? 'decimal', text: val(l[2], 'w:lvlText') ?? '' }
    }
    abstract[m[1]] = lvls
  }
  const nums = {}
  for (const m of xml.matchAll(/<w:num\b[^>]*\bw:numId="(\d+)"[^>]*>([\s\S]*?)<\/w:num>/g)) {
    const override = {}
    for (const o of m[2].matchAll(/<w:lvlOverride\b[^>]*\bw:ilvl="(\d+)"[^>]*(?:\/>|>([\s\S]*?)<\/w:lvlOverride>)/g)) {
      const so = o[2] ? val(o[2], 'w:startOverride') : null
      override[+o[1]] = so === null ? null : +so
    }
    nums[m[1]] = { abs: val(m[2], 'w:abstractNumId'), override }
  }
  return { abstract, nums }
}

function chu(n, hoa) {
  // 1→A, 26→Z, 27→AA (kiểu Word)
  let s = ''
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) }
  return hoa ? s : s.toLowerCase()
}
function laMa(n, hoa) {
  const b = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let s = ''
  for (const [v, r] of b) while (n >= v) { s += r; n -= v }
  return hoa ? s : s.toLowerCase()
}
export function dinhDangSo(n, fmt) {
  switch (fmt) {
    case 'decimal': return String(n)
    case 'decimalZero': return n < 10 ? '0' + n : String(n)
    case 'upperLetter': return chu(n, true)
    case 'lowerLetter': return chu(n, false)
    case 'upperRoman': return laMa(n, true)
    case 'lowerRoman': return laMa(n, false)
    case 'bullet': return '•'
    case 'none': return ''
    default: return String(n) // kiểu lạ (chineseCounting…) — ra số cho khỏi mất, đánh dấu ở stats
  }
}

/** Bộ đếm sống suốt một tài liệu. Gọi nhan(numId, ilvl) theo đúng thứ tự đoạn xuất hiện. */
export function taoBoDem(numbering) {
  const dem = {} // key (abs:<id> | num:<id>) → { [lvl]: số hiện tại | undefined }
  const daKhoiTao = new Set()
  const fmtLa = {}
  return {
    fmtLa,
    nhan(numId, ilvl = 0) {
      const num = numbering.nums[numId]
      if (!num) return null
      const lvls = numbering.abstract[num.abs]
      if (!lvls) return null
      const lv = lvls[ilvl]
      if (!lv) return null
      const rieng = ilvl in num.override
      const key = rieng ? 'num:' + numId : 'abs:' + num.abs
      const c = (dem[key] ??= {})
      // cấp này lần đầu xuất hiện trong bộ đếm ⇒ bắt đầu từ start (hoặc startOverride)
      const k0 = key + '/' + ilvl
      if (!daKhoiTao.has(k0)) {
        daKhoiTao.add(k0)
        c[ilvl] = (rieng && num.override[ilvl] !== null ? num.override[ilvl] : lv.start) - 1
      }
      c[ilvl] = (c[ilvl] ?? lv.start - 1) + 1
      for (const l of Object.keys(c)) if (+l > ilvl) delete c[l] // cấp con về lại đầu
      if (!['decimal', 'decimalZero', 'upperLetter', 'lowerLetter', 'upperRoman', 'lowerRoman', 'bullet', 'none'].includes(lv.fmt)) fmtLa[lv.fmt] = (fmtLa[lv.fmt] || 0) + 1
      if (lv.fmt === 'bullet') return { text: '•', numId, ilvl, fmt: 'bullet' }
      const text = lv.text.replace(/%(\d)/g, (_, d) => {
        const l = +d - 1
        const lvL = lvls[l]
        const soL = c[l] ?? lvL?.start ?? 1
        return dinhDangSo(soL, lvL?.fmt ?? 'decimal')
      })
      return { text, numId, ilvl, fmt: lv.fmt, so: c[ilvl] }
    },
  }
}
