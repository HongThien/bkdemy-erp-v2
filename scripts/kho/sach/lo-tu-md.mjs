// ============================================================================
// lo-tu-md.mjs — dựng LÔ CÂU (JSON) từ file lô giải thử đã CEO duyệt (kho-rules/dai/k<khối>-mau-thu.md) + bản tách bài của sách.
//
//   node scripts/kho/sach/lo-tu-md.mjs <mau-thu.md> <bai.json> --khoi 4T --ra <lo.json> [--lo 1,2,3,4]
//
// - ĐỀ lấy NGUYÊN VĂN từ sách theo mã bài (bai.json của tach-bai.mjs) — không lấy câu chữ tóm tắt ở tiêu đề md.
//   Chỉ chuẩn hoá định dạng theo luật kho (\frac → \dfrac, \text{a} → a). Ngoại lệ: bài có nhiều biểu thức A, B, C… không
//   đánh a) b) (vd LT 18.14 B) ⇒ đề lấy ở tiêu đề md, cổng sẽ kiểm nó có NẰM TRONG bài gốc không.
// - Dạng · Phần 1 · Phần 2 lấy từ md. Dòng hình sơ đồ "![mô tả](so-do/x.svg)" ⇒ thay bằng dòng mô tả bằng lời (alt, để in giấy
//   khi chưa có hình), sơ đồ đi theo trường `so_do` (mô tả JSON — máy vẽ + kiểm lúc ghi). Dòng chú thích nghiêng "*(…)*" bỏ.
// - Đáp số = dòng "Đáp số: …" cuối Phần 2; câu không có dòng đó (lập luận, tính) ⇒ phải có trong bảng `DAP_AN_TAY` dưới đây,
//   thiếu thì script DỪNG và liệt kê (không đoán đáp án — CLAUDE.md §1.5).
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

/** Câu không có dòng "Đáp số:" — đáp án lấy từ dòng kết luận của chính lời giải đã duyệt (ghi tay một lần, có người soát). */
export const DAP_AN_TAY = {
  'LT 1.5b': '$83$', 'LT 1.9c': '$1456789$', 'LT 1.4a': '$986$', 'LT 4.7d': '$1612$',
  'LT 3.1': '1 kg 512 g ; 1 kg 51 dag ; 1 kg 5 hg ; 10 hg 50 g', 'LT 3.6': 'Chủ nhật',
  'LT 10.5b': '$360$ ; $630$', 'LT 10.12': '$a=2,\\ b=2$ hoặc $a=7,\\ b=6$', 'LT 10.14': '$*=6$',
  'LT 16.6c': '$\\dfrac{27}{26}$', 'LT 16.8e': '$\\dfrac{35}{105};\\dfrac{63}{105};\\dfrac{75}{105}$',
  'LT 17.9c': '$\\dfrac{2026}{2023}>\\dfrac{2027}{2024}$', 'LT 17.12a': '$\\dfrac{41}{42}>\\dfrac{37}{39}$',
  'LT 19.2d': '$1$', 'LT 19.4b': '$\\dfrac{7}{8}$', 'LT 19.6b': '$\\dfrac{8}{7}$', 'LT 18.14B': '$B=\\dfrac{4}{15}$',
  'LT 19.15E': '$E=\\dfrac{200}{101}$', 'LT 19.15D': '$D=\\dfrac{9}{10}$', 'PTL 5.5b': '$\\dfrac{1}{20}$',
}

/** Tiêu đề md → mã bài trong sách. `cha` = mã của tiêu đề "## Câu" khi đang ở "### Câu 7a". */
export function maTuTieuDe(t, cha) {
  let m
  if ((m = t.match(/^Câu \d+([a-z])\s*—/)) && cha) return cha + m[1]
  const src = t.replace(/^Câu \d+[a-z]?\s*—\s*/, '').split(' · ')[0].replace(/\s*\(.*$/, '').trim()
  if ((m = src.match(/^LT (\d+\.\d+)\s*([A-F])$/))) return `LT ${m[1]}${m[2]}`             // biểu thức A/B/C… (không phải ý a/b)
  if ((m = src.match(/^LT (\d+\.\d+[a-h]?)$/))) return `LT ${m[1]}`
  if ((m = src.match(/^Phiếu tự luyện (\d+), bài (\d+)([a-h]?)$/))) return `PTL ${m[1]}.${m[2]}${m[3]}`
  if ((m = src.match(/^Phiếu cuối tuần (\d+), Phần (I|II) bài (\d+)([a-h]?)$/))) return `PCT ${m[1]} ${m[2]}.${m[3]}${m[4]}`
  if ((m = src.match(/^PCT (\d+)\.(\d+)$/))) return `PCT ${m[1]} ?.${m[2]}`                  // lô 1 viết tắt, chưa ghi phần ⇒ tra
  return null
}

export const chuanDinhDang = (s) => s
  .replace(/\\frac\b/g, '\\dfrac').replace(/\\text\{\s*([a-zA-Z])\s*\}/g, '$1').replace(/\\overline\{\\text\{([^}]*)\}\}/g, '\\overline{$1}')
  .replace(/\\left\(\s+/g, '\\left(').replace(/\s+\\right\)/g, '\\right)').replace(/\\left\( /g, '\\left(').replace(/[ \t]{2,}/g, ' ')

export function dungLo(md, bai, khoi, chiLo = null) {
  const theoMa = new Map(bai.map((b) => [b.ma, b]))
  const dong = md.split(/\r?\n/)
  const cau = [], loi = []
  let lo = 0, cha = null, cur = null
  const xong = () => { if (cur) { cau.push(cur); cur = null } }
  for (const d of dong) {
    let m
    if ((m = d.match(/^# 4T · LÔ GIẢI THỬ(?: (\d+))? —/))) { xong(); lo = m[1] ? Number(m[1]) : 1; cha = null; continue }
    if (/^## Bảng tóm tắt/.test(d)) { xong(); continue }
    if ((m = d.match(/^(##|###) (Câu .*)$/))) {
      xong()
      const tieuDe = m[2]
      const ma = maTuTieuDe(tieuDe, cha)
      if (m[1] === '##') cha = ma
      // tiêu đề "## Câu 7 — LT 6.6 · … (tách 3 câu …)" chỉ là cha — câu thật là các "### Câu 7a"
      if (m[1] === '##' && /\(tách \d+ câu/.test(tieuDe)) continue
      cur = { lo, tieu_de: tieuDe, ma, _p: [], phan: null }
      continue
    }
    if (!cur) continue
    if (/^---\s*$/.test(d)) { xong(); continue }
    if ((m = d.match(/^\*\*Dạng:\*\* `(T\w+)`/))) { cur.dang_chinh = m[1]; continue }
    if (/^\*\*Phần 1\. Hướng dẫn\*\*/.test(d)) { cur.phan = 1; cur.p1 = []; continue }
    if (/^\*\*Phần 2\. Trình bày\*\*/.test(d)) { cur.phan = 2; cur.p2 = []; continue }
    if (cur.phan === 1) cur.p1.push(d)
    else if (cur.phan === 2) cur.p2.push(d)
  }
  xong()

  const ra = []
  for (const c of cau) {
    if (chiLo && !chiLo.includes(c.lo)) continue
    const nhan = `lô ${c.lo} · ${c.tieu_de.slice(0, 40)}`
    if (!c.ma) { loi.push(`${nhan}: không đọc được mã bài từ tiêu đề`); continue }
    // PCT viết tắt (lô 1 "PCT 3.7") ⇒ tra phần I/II trong sách, phải ra ĐÚNG một bài
    if (c.ma.includes(' ?.')) {
      const ung = ['I', 'II'].map((p) => c.ma.replace('?', p)).filter((k) => theoMa.has(k))
      if (ung.length !== 1) { loi.push(`${nhan}: "${c.ma}" khớp ${ung.length} bài trong sách (${ung.join(', ')}) — ghi rõ phần`); continue }
      c.ma = ung[0]
    }
    const goc = theoMa.get(c.ma) ?? theoMa.get(c.ma.replace(/[A-F]$/, ''))
    if (!goc) { loi.push(`${nhan}: mã "${c.ma}" không có trong sách`); continue }
    if (!c.dang_chinh) { loi.push(`${nhan}: thiếu dòng **Dạng:**`); continue }
    if (!c.p1?.length || !c.p2?.length) { loi.push(`${nhan}: thiếu Phần 1 hoặc Phần 2`); continue }
    // đề: nguyên văn sách; riêng biểu thức A/B/C… thì lấy ở tiêu đề md (cổng kiểm có nằm trong bài gốc)
    const laBieuThuc = /[A-F]$/.test(c.ma)
    const noi_dung = laBieuThuc ? chuanDinhDang(c.tieu_de.split(' · ').slice(1).join(' · ').trim()) : chuanDinhDang(goc.noi_dung)
    // lời giải: bỏ chú thích nghiêng, thay hình sơ đồ bằng mô tả bằng lời; gom dòng trống thừa
    let so_do = null
    const sach = (ds) => ds.filter((l) => !/^\*\(.*\)\*\s*$/.test(l.trim())).map((l) => {
      const h = l.match(/^!\[(?:Sơ đồ: )?([^\]]*)\]\(so-do\/([^)]+)\.svg\)/)
      if (h) { so_do = `${h[2]}.json`; return `(${h[1]})` }
      return l
    }).join('\n').replace(/\n{3,}/g, '\n\n').trim()
    const p1 = sach(c.p1), p2 = sach(c.p2.map((l) => l.replace(/^\*\*Phần 2\. Trình bày\*\*.*$/, '')))
    const loi_giai = `**Phần 1. Hướng dẫn**\n\n${p1}\n\n**Phần 2. Trình bày**\n\n${p2}`
    const dongDS = p2.split('\n').reverse().find((l) => /^Đáp số:/.test(l.trim()))
    const dap_an = dongDS ? dongDS.trim().replace(/^Đáp số:\s*/, '') : DAP_AN_TAY[c.ma]
    if (!dap_an) { loi.push(`${nhan} (${c.ma}): không có dòng "Đáp số:" và chưa có trong DAP_AN_TAY`); continue }
    const nhieu = /;|\bvà\b/.test(dap_an.replace(/\$[^$]*\$/g, 'x')) && !/^\$[^$]*\$$/.test(dap_an)
    ra.push({
      ma_nguon: c.ma, lo: c.lo, khoi, dang_chinh: c.dang_chinh, loai_cau: nhieu ? 'tu_luan' : 'tra_loi_ngan',
      noi_dung, noi_dung_sach: goc.noi_dung, dap_an, loi_giai, so_do, anh_sach: goc.anh,
    })
  }
  // một mã nguồn chỉ được xuất hiện một lần (danh tính)
  const dem = {}; for (const c of ra) dem[c.ma_nguon] = (dem[c.ma_nguon] || 0) + 1
  for (const [k, n] of Object.entries(dem)) if (n > 1) loi.push(`mã nguồn "${k}" xuất hiện ${n} lần`)
  return { cau: ra, loi }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2)
  const [mdTep, baiTep] = a, iK = a.indexOf('--khoi'), iR = a.indexOf('--ra'), iL = a.indexOf('--lo')
  if (!mdTep || !baiTep || iK < 0 || iR < 0) { console.error('Dùng: node scripts/kho/sach/lo-tu-md.mjs <mau-thu.md> <bai.json> --khoi 4T --ra <lo.json> [--lo 1,2]'); process.exit(2) }
  const chiLo = iL > 0 ? a[iL + 1].split(',').map(Number) : null
  const { cau, loi } = dungLo(readFileSync(mdTep, 'utf8'), JSON.parse(readFileSync(baiTep, 'utf8')), a[iK + 1], chiLo)
  const thuMucSoDo = join(dirname(mdTep), 'so-do')
  for (const c of cau) if (c.so_do && !existsSync(join(thuMucSoDo, c.so_do))) loi.push(`${c.ma_nguon}: thiếu file sơ đồ ${c.so_do}`)
  if (loi.length) { console.error(`✘ ${loi.length} lỗi — KHÔNG ghi lô:`); for (const l of loi) console.error('  ', l); process.exit(1) }
  writeFileSync(a[iR + 1], JSON.stringify(cau, null, 1))
  const tk = cau.reduce((o, c) => ((o[`lô ${c.lo}`] = (o[`lô ${c.lo}`] || 0) + 1), o), {})
  console.log(`✔ ${cau.length} câu`, JSON.stringify(tk), '· có sơ đồ:', cau.filter((c) => c.so_do).length, '· có ảnh sách:', cau.filter((c) => c.anh_sach.length).map((c) => c.ma_nguon).join(', ') || 0)
  console.log('→', a[iR + 1])
}
