// quet-loi-latex.mjs — bắt lỗi LaTeX hỏng do script sinh JSON (thoát `\` sai): ký tự TAB / điều khiển, lệnh mất dấu `\` (infty, sqrt, frac…), `\n` hoá xuống dòng GIỮA công thức.
//   node kho-rules/dai/lo/k11/sach-gioi-han/quet-loi-latex.mjs [tệp.json …]   (không đối số: mọi tệp <đơn-vị>.json trong thư mục)
// Thoát mã 1 nếu còn lỗi. kiem.mjs gọi hàm này luôn.
import { readFileSync, readdirSync } from 'node:fs'
const HERE = new URL('.', import.meta.url).pathname.replace(/^\//, '')
export function quet(q) {
  const loi = []
  const cacTruong = { noi_dung: q.noi_dung, loi_giai: q.loi_giai, dap_an: q.dap_an, ghi_chu: q.ghi_chu, dang_bai_ly_do: q.dang_bai_ly_do }
  ;(q.lua_chon ?? []).forEach((x, i) => (cacTruong[`lua_chon[${i}]`] = x))
  ;(q.menh_de ?? []).forEach((m, i) => (cacTruong[`menh_de[${i}]`] = m.noi_dung))
  for (const [ten, v] of Object.entries(cacTruong)) {
    if (typeof v !== 'string') continue
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v)) loi.push(`${q.id}.${ten}: ký tự điều khiển (BS/FF…) — thoát \\ sai`)
    if (/\t/.test(v)) loi.push(`${q.id}.${ten}: có TAB — nghi \\t (\\text, \\to, \\theta…) bị hỏng`)
    for (const m of v.matchAll(/\$([^$]+)\$/g)) {
      const ct = m[1]
      if (/\n/.test(ct)) loi.push(`${q.id}.${ten}: xuống dòng GIỮA công thức «${ct.slice(0, 40).replace(/\n/g, '⏎')}» — nghi \\n/\\neq/\\nu hỏng`)
      const sach = ct.replace(/\\text\{[^}]*\}/g, '')
      for (const l of ['infty', 'sqrt', 'frac', 'dfrac', 'approx', 'cdot', 'neq', 'geq', 'leq', 'pm', 'mathbb', 'Rightarrow', 'Leftrightarrow', 'limits']) {
        if (new RegExp(`(?<![\\\\A-Za-z])${l}(?![A-Za-z])`).test(sach)) loi.push(`${q.id}.${ten}: «${l}» thiếu dấu \\ trong «${ct.slice(0, 50)}»`)
      }
    }
    // lệnh LaTeX viết trần NGOÀI $…$ (vd Mấu chốt viết "\infty" hay "infty" ngoài công thức)
    const ngoai = v.replace(/\$[^$]*\$/g, ' ')
    for (const l of ['infty', 'sqrt', 'approx', 'cdot', 'neq', 'Rightarrow', 'dfrac']) if (new RegExp(`(?<![A-Za-z])\\\\?${l}(?![A-Za-z])`).test(ngoai)) loi.push(`${q.id}.${ten}: lệnh LaTeX «${l}» nằm ngoài $…$`)
  }
  return loi
}
if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
  const dsTep = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(HERE).filter((x) => /^(pnl|tt|nbv)-.+\.json$/.test(x) && !/\.goc\.json$/.test(x)).map((x) => HERE + x)
  let tong = 0
  for (const f of dsTep) {
    let ds; try { ds = JSON.parse(readFileSync(f, 'utf8')) } catch { console.error(f, 'JSON hỏng'); tong++; continue }
    const loi = ds.flatMap((q) => quet(q))
    console.log(`${f.split(/[\\/]/).pop()}: ${ds.length} câu · ${loi.length ? '✘ ' + loi.length + ' lỗi' : '✔ sạch'}`)
    for (const m of loi.slice(0, 12)) console.error('  ' + m)
    if (loi.length > 12) console.error(`  … +${loi.length - 12} lỗi nữa`)
    tong += loi.length
  }
  process.exit(tong ? 1 : 0)
}
