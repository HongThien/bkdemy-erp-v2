// kiem.mjs — máy kiểm KHUÔN tệp soạn lý thuyết / ví dụ cho bản đồ mới khối 11 (dai_bdm_dang_bai.ly_thuyet / vi_du).
//   node kho-rules/dai/lo/k11/ban-do/kiem.mjs <tệp ra.txt> [<NDB…,NDB…>]      (chạy từ thư mục Repo)
// Khuôn tệp:   === NDB00701            (một khối / dạng, đúng thứ tự giao)
//              @ly_thuyet:             (chỉ khi dạng đang TRỐNG lý thuyết)
//              …##TC / ##PP / ##CY / ##DN / ##DL / ##NX …
//              @vi_du:
//              ##VD …đề… ⏎⏎ Bài giải: ⏎ …lời giải liền dòng…  (≥ 2 ví dụ)
// Luật hiển thị (src/lib/lythuyetBlocks.ts): đoạn tách bởi dòng trống; đoạn mở bằng ##XX là một khung; ##PP mỗi dòng = một bước;
// ##VD = đề trong khung, đoạn "Bài giải:" ngay sau là lời giải (CEO 09/10: lời giải hiện LIỀN DÒNG — không dòng trống bên trong).
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { veHinh } from '../../../../../scripts/kho/hinh-luong-giac.mjs'
const katex = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')('katex')

export function docTep(txt) {
  const kq = []
  let t = txt.replace(/\r\n/g, '\n')
  const iGc = t.search(/^## GHI CHÚ/m)   // mục ghi chú cho CEO ở cuối tệp không thuộc khối nào
  if (iGc >= 0) t = t.slice(0, iGc)
  for (const k of t.split(/^=== /m).slice(1)) {
    const id = k.slice(0, k.indexOf('\n')).trim()
    const than = k.slice(k.indexOf('\n') + 1)
    const iLt = than.search(/^@ly_thuyet:[ \t]*$/m), iVd = than.search(/^@vi_du:[ \t]*$/m)
    const lt = iLt >= 0 ? than.slice(iLt, iVd > iLt ? iVd : undefined).replace(/^@ly_thuyet:[ \t]*\n/, '').trim() : null
    const vd = iVd >= 0 ? than.slice(iVd).replace(/^@vi_du:[ \t]*\n/, '').trim() : null
    kq.push({ id, lt, vd })
  }
  return kq
}

function kiemCongThuc(s, noi, loi) {
  if ((s.match(/(?<!\\)\$/g) || []).length % 2) loi.push(`${noi}: số dấu $ lẻ`)
  if (/\$\$|\\\(|\\\[/.test(s)) loi.push(`${noi}: chỉ dùng $…$ (không $$, \\(, \\[)`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${noi}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 70)}`) }
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${noi}: chữ Việt trong công thức ngoài \\text{}: «${m[1].slice(0, 40)}»`)
    if (/\\times/.test(m[1])) loi.push(`${noi}: dùng \\cdot, không \\times`)
  }
  if (/\*[^*\s][^*]*\*(?!\*)/.test(s.replace(/\*\*[^*]+\*\*/g, ''))) loi.push(`${noi}: có chữ nghiêng *…* (app không hiện) — chỉ dùng **đậm**`)
}

/** luật CEO 16/10 + hình: dòng [[HINH:{json}]] phải vẽ được; ##TC dùng "•" (không "- "); tiêu đề ##PP không chứa công thức; mỗi công thức một dòng */
export function kiemMoi(text, noi, loi) {
  for (const m of text.matchAll(/^\[\[HINH:(.*)\]\][ \t]*$/gm)) { try { veHinh(JSON.parse(m[1])) } catch (e) { loi.push(`${noi}: [[HINH]] không vẽ được — ${e.message.slice(0, 120)}`) } }
  if (/\[\[HINH/.test(text.replace(/^\[\[HINH:.*\]\][ \t]*$/gm, ''))) loi.push(`${noi}: [[HINH:{…}]] phải nằm trọn một dòng riêng`)
  for (const d of text.split(/\n[ \t]*\n/)) {
    const t = d.trim()
    if (/^##PP[ \t]+[^\n]*\$/.test(t)) loi.push(`${noi}: tiêu đề ##PP không được chứa công thức $…$ (app không hiện): «${t.split('\n')[0].slice(0, 60)}»`)
    if (/^##TC/.test(t)) for (const dong of t.split('\n').slice(1)) {
      if (/^\s*[-–]\s/.test(dong)) loi.push(`${noi}: ##TC dùng "• " đầu dòng, không "- " (dễ nhầm dấu trừ): «${dong.slice(0, 50)}»`)
      const ct = (dong.match(/(?<!\\)\$[^$]+\$/g) || []).length
      if (ct >= 3) loi.push(`${noi}: ##TC mỗi công thức một dòng — dòng này có ${ct} công thức: «${dong.slice(0, 60)}»`)
    }
  }
}

export function kiemKhoi(k, { canLt }) {
  const loi = []
  for (const [nm, t] of [['lý thuyết', k.lt], ['ví dụ', k.vd]]) if (t) kiemMoi(t, nm, loi)
  if (canLt && !k.lt) loi.push('thiếu @ly_thuyet (dạng đang trống lý thuyết)')
  if (!canLt && k.lt) loi.push('dạng ĐÃ CÓ lý thuyết — không được viết @ly_thuyet')
  if (k.lt) {
    kiemCongThuc(k.lt, 'lý thuyết', loi)
    const doan = k.lt.split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
    for (const d of doan) if (!/^##(TC|PP|CY|DN|DL|ĐN|ĐL|NX)\b/.test(d)) loi.push(`lý thuyết: đoạn không mở bằng ##TC/##PP/##CY/##DN/##DL/##NX: «${d.slice(0, 50)}»`)
    if (/##VD|##BT/.test(k.lt)) loi.push('lý thuyết: không đặt ví dụ / bài tập trong lý thuyết (ví dụ nằm ở @vi_du)')
    if (!/^##PP/m.test(k.lt)) loi.push('lý thuyết: thiếu khung ##PP (phương pháp giải)')
    for (const d of doan.filter((x) => x.startsWith('##PP'))) {
      const buoc = d.split('\n').slice(1).filter((x) => x.trim())
      if (buoc.length < 2 || buoc.length > 7) loi.push(`lý thuyết: khung ##PP có ${buoc.length} bước (nên 2–7, mỗi dòng một bước)`)
      if (buoc.some((x) => /^\s*(\*\*)?Bước\s*\d/i.test(x))) loi.push('lý thuyết: ##PP không ghi "Bước N" (app tự đánh số)')
    }
  }
  if (!k.vd) loi.push('thiếu @vi_du')
  else {
    kiemCongThuc(k.vd, 'ví dụ', loi)
    const doan = k.vd.split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
    let so = 0
    for (let i = 0; i < doan.length; i++) {
      if (doan[i].startsWith('##VD')) {
        so++
        if (doan[i].split('\n').length < 2 || !doan[i].split('\n')[1].trim()) loi.push(`ví dụ ${so}: dòng sau ##VD phải là đề`)
        const g = doan[i + 1] ?? ''
        if (!/^Bài giải:[ \t]*\n/.test(g)) loi.push(`ví dụ ${so}: ngay sau đề phải là đoạn "Bài giải:" (xuống dòng rồi lời giải liền dòng)`)
        else if (!/(^|\n)Vậy\b/.test(g)) loi.push(`ví dụ ${so}: lời giải nên kết bằng một câu "Vậy …"`)
        if (/^Bài giải:/m.test(doan[i])) loi.push(`ví dụ ${so}: thiếu dòng trống giữa đề và "Bài giải:"`)
        i++
      } else loi.push(`ví dụ: đoạn lạc (không thuộc ##VD nào — có dòng trống trong lời giải?): «${doan[i].slice(0, 50)}»`)
    }
    if (so < 2) loi.push(`ví dụ: cần ít nhất 2 ##VD (có ${so})`)
  }
  return loi
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [tep, dsArg] = process.argv.slice(2)
  const dang = JSON.parse(readFileSync('C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/dang.json', 'utf8'))
  const khoi = docTep(readFileSync(tep, 'utf8'))
  const loi = []
  const ds = dsArg ? dsArg.split(',') : khoi.map((k) => k.id)
  for (const id of ds) if (!khoi.some((k) => k.id === id)) loi.push(`${id}: THIẾU khối`)
  for (const k of khoi) {
    const d = dang.find((x) => x.d_id === k.id)
    if (k.id.startsWith('NNB')) { for (const l of kiemKhoi(k, { canLt: true })) if (!/thiếu @vi_du|thiếu khung ##PP|##PP có/.test(l)) loi.push(`${k.id}: ${l}`); continue }
    if (!d) { loi.push(`${k.id}: không phải dạng có mô tả của bản đồ mới khối 11`); continue }
    if (dsArg && !ds.includes(k.id)) loi.push(`${k.id}: không thuộc danh sách giao`)
    for (const l of kiemKhoi(k, { canLt: !!k.lt })) { if (!k.vd && /thiếu @vi_du/.test(l)) continue; if (!k.lt && /thiếu @ly_thuyet/.test(l)) continue; loi.push(`${k.id}: ${l}`) }  // bản SỬA 16/10: chỉ kiểm phần có trong tệp
  }
  for (const l of loi) console.log('✖ ' + l)
  console.log(`${tep.split(/[\\/]/).pop()}: ${khoi.length} khối · lý thuyết ${khoi.filter((k) => k.lt).length} · ví dụ ${khoi.reduce((s, k) => s + ((k.vd ?? '').match(/^##VD/gm) || []).length, 0)} · lỗi ${loi.length}`)
  process.exit(loi.length ? 1 : 0)
}
