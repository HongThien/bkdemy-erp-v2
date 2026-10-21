// kiem.mjs — máy kiểm KHUÔN tệp soạn lý thuyết + ví dụ cho bản đồ đề xuất K12 Hàm số (chạy từ thư mục Repo).
//   node kho-rules/dai/lo/k12-hs/kiem.mjs <tệp ra.txt> [<mã,mã…>]
// Khuôn tệp (giống k9, mã tạm H…):
//   === N H1.1                 ← khối NHÓM: chỉ có @ly_thuyet: (lý thuyết chung của nhóm: ##TC / ##PP / ##CY …)
//   @ly_thuyet:
//   …
//   === H1.1.1                 ← khối DẠNG: @ly_thuyet: (của dạng) + @vi_du: (≥ 2 ##VD có "Bài giải:")
//   @ly_thuyet: … @vi_du: ##VD …đề… ⏎⏎ Bài giải: ⏎ …lời giải liền dòng… Vậy …
// Hình: một dòng  [[HINH {json}]]  trong đề (xem ve.mjs). Máy kiểm vẽ thử từng hình; dạng cần hình mà không có hình nào → cảnh báo.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CAY } from './cau-truc.mjs'
import { timHinh, veHinh } from './ve.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const katex = createRequire(join(DIR, '../../../../package.json'))('katex')

export const DANG = Object.fromEntries(CAY.flatMap((c) => c.nhom.flatMap((n) => n.dang.map((d) => [d[0], { ten: d[1], mo_ta: d[2], hinh: d[3], nhom: n.id }]))))
export const NHOM = Object.fromEntries(CAY.flatMap((c) => c.nhom.map((n) => [n.id, n])))

export function docTep(txt) {
  const kq = []
  let t = txt.replace(/\r\n/g, '\n')
  const iGc = t.search(/^## GHI CHÚ/m)
  if (iGc >= 0) t = t.slice(0, iGc)
  for (const k of t.split(/^=== /m).slice(1)) {
    const tieuDe = k.slice(0, k.indexOf('\n')).trim()
    const la_nhom = /^N\s+/.test(tieuDe)
    const id = tieuDe.replace(/^N\s+/, '').split(/\s+/)[0]
    const than = k.slice(k.indexOf('\n') + 1)
    const iLt = than.search(/^@ly_thuyet:[ \t]*$/m), iVd = than.search(/^@vi_du:[ \t]*$/m)
    const lt = iLt >= 0 ? than.slice(iLt, iVd > iLt ? iVd : undefined).replace(/^@ly_thuyet:[ \t]*\n/, '').trim() : null
    const vd = iVd >= 0 ? than.slice(iVd).replace(/^@vi_du:[ \t]*\n/, '').trim() : null
    kq.push({ id, la_nhom, lt, vd })
  }
  return kq
}

function kiemCongThuc(s, noi, loi) {
  const sach = s.replace(/\[\[HINH [^\n]*\]\]/g, '') // bỏ JSON hình khỏi phép kiểm công thức
  if ((sach.match(/(?<!\\)\$/g) || []).length % 2) loi.push(`${noi}: số dấu $ lẻ`)
  if (/\$\$|\\\(|\\\[/.test(sach)) loi.push(`${noi}: chỉ dùng $…$ (không $$, \\(, \\[)`)
  for (const m of sach.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${noi}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 70)}`) }
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${noi}: chữ Việt trong công thức ngoài \\text{}: «${m[1].slice(0, 40)}»`)
    if (/\\times/.test(m[1])) loi.push(`${noi}: dùng \\cdot, không \\times`)
  }
  if (/\*[^*\s][^*]*\*(?!\*)/.test(sach.replace(/\*\*[^*]+\*\*/g, ''))) loi.push(`${noi}: có chữ nghiêng *…* (app không hiện) — chỉ dùng **đậm**`)
}

function kiemLyThuyet(lt, loi, { nhom }) {
  kiemCongThuc(lt, 'lý thuyết', loi)
  const doan = lt.split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
  for (const d of doan) if (!/^##(TC|PP|CY|DN|DL|ĐN|ĐL|NX)\b/.test(d)) loi.push(`lý thuyết: đoạn không mở bằng ##TC/##PP/##CY/##DN/##DL/##NX: «${d.slice(0, 50)}»`)
  if (/##VD|##BT/.test(lt)) loi.push('lý thuyết: không đặt ví dụ / bài tập trong lý thuyết')
  if (/\[\[HINH/.test(lt)) loi.push('lý thuyết: hình chỉ đặt trong ví dụ (@vi_du)')
  if (!/^##PP/m.test(lt)) loi.push('lý thuyết: thiếu khung ##PP (phương pháp)')
  for (const d of doan.filter((x) => x.startsWith('##PP'))) {
    const buoc = d.split('\n').slice(1).filter((x) => x.trim())
    if (buoc.length < 2 || buoc.length > 7) loi.push(`lý thuyết: khung ##PP có ${buoc.length} bước (nên 2–7, mỗi dòng một bước)`)
    if (buoc.some((x) => /^\s*(\*\*)?Bước\s*\d/i.test(x))) loi.push('lý thuyết: ##PP không ghi "Bước N"')
  }
  if (!nhom && !/^##TC/m.test(lt)) loi.push('lý thuyết dạng: nên có khung ##TC (kiến thức riêng của dạng)')
}

export function kiemKhoi(k, canh = []) {
  const loi = [], canhBao = []
  const d = k.la_nhom ? null : DANG[k.id]
  if (k.la_nhom) {
    if (!NHOM[k.id]) loi.push(`không có nhóm ${k.id}`)
    if (!k.lt) loi.push('khối nhóm thiếu @ly_thuyet')
    if (k.vd) loi.push('khối nhóm không có @vi_du')
    if (k.lt) kiemLyThuyet(k.lt, loi, { nhom: true })
    return { loi, canhBao }
  }
  if (!d) { loi.push(`không có dạng ${k.id} trong cau-truc.mjs`); return { loi, canhBao } }
  if (!k.lt) loi.push('thiếu @ly_thuyet')
  else kiemLyThuyet(k.lt, loi, { nhom: false })
  if (!k.vd) loi.push('thiếu @vi_du')
  else {
    kiemCongThuc(k.vd, 'ví dụ', loi)
    let hinh = []
    try { hinh = timHinh(k.vd); for (const h of hinh) veHinh(h.sp) } catch (e) { loi.push(`hình: ${e.message}`) }
    if (/\[\[HINH/.test(k.vd) && hinh.length !== (k.vd.match(/\[\[HINH/g) || []).length) loi.push('hình: có dòng [[HINH …]] không đúng cú pháp (phải nằm riêng trên một dòng, đóng ]])')
    if (d.hinh !== 'khong' && !hinh.length) canhBao.push(`dạng cần hình (${d.hinh}) nhưng ví dụ không có [[HINH]]`)
    const doan = k.vd.split(/\n[ \t]*\n/).map((x) => x.trim()).filter(Boolean)
    let so = 0
    for (let i = 0; i < doan.length; i++) {
      if (doan[i].startsWith('##VD')) {
        so++
        const dong = doan[i].split('\n')
        if (dong.length < 2 || !dong[1].trim()) loi.push(`ví dụ ${so}: dòng sau ##VD phải là đề`)
        const g = doan[i + 1] ?? ''
        if (!/^Bài giải:[ \t]*\n/.test(g)) loi.push(`ví dụ ${so}: ngay sau đề phải là đoạn "Bài giải:" (xuống dòng rồi lời giải liền dòng)`)
        else if (!/(^|\n)Vậy\b/.test(g)) loi.push(`ví dụ ${so}: lời giải nên kết bằng một câu "Vậy …"`)
        if (/^Bài giải:/m.test(doan[i])) loi.push(`ví dụ ${so}: thiếu dòng trống giữa đề và "Bài giải:"`)
        i++
      } else loi.push(`ví dụ: đoạn lạc (có dòng trống trong lời giải?): «${doan[i].slice(0, 50)}»`)
    }
    if (so < 2) loi.push(`ví dụ: cần ít nhất 2 ##VD (có ${so})`)
  }
  return { loi, canhBao }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [tep, dsArg] = process.argv.slice(2)
  const khoi = docTep(readFileSync(tep, 'utf8'))
  const loi = [], canh = []
  const ds = dsArg ? dsArg.split(',') : null
  if (ds) for (const id of ds) if (!khoi.some((k) => k.id === id)) loi.push(`${id}: THIẾU khối`)
  for (const k of khoi) {
    if (ds && !ds.includes(k.id)) { loi.push(`${k.id}: không thuộc danh sách giao`); continue }
    const r = kiemKhoi(k)
    for (const l of r.loi) loi.push(`${k.id}: ${l}`)
    for (const l of r.canhBao) canh.push(`${k.id}: ${l}`)
  }
  for (const l of loi) console.log('✖ ' + l)
  for (const l of canh) console.log('⚠ ' + l)
  const dang = khoi.filter((k) => !k.la_nhom)
  console.log(`${tep.split(/[\\/]/).pop()}: ${khoi.filter((k) => k.la_nhom).length} nhóm · ${dang.length} dạng · lý thuyết dạng ${dang.filter((k) => k.lt).length} · ví dụ ${dang.reduce((s, k) => s + ((k.vd ?? '').match(/^##VD/gm) || []).length, 0)} · hình ${dang.reduce((s, k) => s + ((k.vd ?? '').match(/\[\[HINH/g) || []).length, 0)} · lỗi ${loi.length} · cảnh báo ${canh.length}`)
  process.exit(loi.length ? 1 : 0)
}
