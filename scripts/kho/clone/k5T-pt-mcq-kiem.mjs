// ============================================================================
// k5T-pt-mcq-kiem.mjs — BỘ KIỂM phương án nhiễu MCQ cho câu 5T chuyên đề Tỉ số phần trăm (28/11).
// Máy MCQ chung (mcq-sinh / parseHuuTi) KHÔNG đọc được đáp số kèm đơn vị / % / hướng ("$288000$ đồng", "Giảm $28\%$") ⇒ đường riêng:
// mỗi lô nhiễu là JSON  [{ noi_dung, nhieu:[{ text, rule, duong_sai }, …≥3 ứng viên theo thứ tự ưu tiên] }]  khớp câu trong kho theo noi_dung.
//   node scripts/kho/clone/k5T-pt-mcq-kiem.mjs <lo-nhieu.json> [--db]      (--db: đối chiếu đáp số + trùng với kho, chỉ đọc)
// Luật (spec-kho-cau-hoi §3.3, mọi phương án sai là KẾT QUẢ THẬT của một đường sai có tên):
//   · phương án đúng = `dap_an` của câu trong kho, nguyên văn (máy ghép, không tin file)
//   · 3 nhiễu: CÙNG khuôn chữ với đáp án đúng (cùng đơn vị / dấu % / dạng phân số; chỉ số — và từ chỉ hướng Tăng/Giảm/Nhiều hơn/Ít hơn — được khác)
//   · giá trị khác nhau đôi một và khác đáp án (so SAU chuẩn hoá: 0,5 = 1/2 = 50 : 100)
//   · 3 rule KHÁC nhau, rule tồn tại + active, ≤ 1 rule dự phòng; mỗi nhiễu có duong_sai ≥ 8 ký tự
//   · nhiễu không âm, không bằng 0, không phi lí (cùng cỡ với đáp án: 1/100 … 100 lần; trừ tỉ lệ phần trăm)
// ============================================================================
export const HUONG = ['Nhiều hơn', 'Ít hơn', 'Tăng', 'Giảm']
const bo = (s) => String(s ?? '').replace(/\\%/g, '%').replace(/\\dfrac|\\frac/g, 'F').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\$/g, '').replace(/\s+/g, ' ').trim()
/** { huong, so: [number…], khuon } — khuon = chữ còn lại sau khi số → # và từ hướng → D */
export function docDapAn(s) {
  let t = bo(s), huong = null
  for (const h of HUONG) { const re = new RegExp('^' + h + '\\s', 'i'); if (re.test(t)) { huong = h; t = t.replace(re, ''); break } }
  const so = []
  // phân số F{a}{b} → a/b ; số "1 200 000" / "162,5"
  t = t.replace(/F\{(\d+)\}\{(\d+)\}/g, (_, a, b) => { so.push(+a / +b); return '#' })
  t = t.replace(/\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:,\d+)?/g, (m) => { so.push(Number(m.replace(/ /g, '').replace(',', '.'))); return '#' })
  return { huong, so, khuon: t.replace(/\s+/g, ' ').trim() }
}
const gan = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
export function trungGiaTri(x, y) { return x.so.length === y.so.length && x.so.every((v, i) => gan(v, y.so[i])) && (x.huong ?? '') === (y.huong ?? '') }
/** Kiểm 1 ứng viên nhiễu so với đáp án đúng. Trả mảng lỗi. */
export function kiemUngVien(dapAn, nv, ruleInfo) {
  const loi = [], d = docDapAn(dapAn), n = docDapAn(nv.text)
  if (!nv.text || !String(nv.text).trim()) return ['text rỗng']
  if (n.khuon !== d.khuon) loi.push(`khác khuôn chữ: "${n.khuon}" ≠ "${d.khuon}"`)
  if (n.so.length !== d.so.length) loi.push('khác số lượng số')
  if (trungGiaTri(d, n)) loi.push('trùng giá trị đáp án đúng')
  if (n.so.some((v) => v < 0)) loi.push('có số âm')
  if (n.so.length === d.so.length) n.so.forEach((v, i) => {
    const g = d.so[i]
    if (v === 0 && g !== 0) loi.push('nhiễu bằng 0')
    else if (g !== 0 && (v / g > 100 || v / g < 0.01)) loi.push(`phi lí (${v} so với ${g})`)
  })
  if (!nv.rule || !ruleInfo.has(nv.rule)) loi.push(`rule "${nv.rule}" không tồn tại/không active`)
  if (!nv.duong_sai || String(nv.duong_sai).trim().length < 8) loi.push('thiếu duong_sai')
  return loi
}
/** Chọn 3 nhiễu từ danh sách ứng viên (ưu tiên theo thứ tự): hợp lệ, rule khác nhau, giá trị khác nhau, ≤1 dự phòng. */
export function chonNhieu(dapAn, ungVien, ruleInfo) {
  const chon = [], lyDo = []
  const rules = new Set(), vals = []
  let dp = 0
  for (const nv of ungVien ?? []) {
    const l = kiemUngVien(dapAn, nv, ruleInfo); if (l.length) { lyDo.push(`${nv.text}: ${l.join(' / ')}`); continue }
    if (rules.has(nv.rule)) { lyDo.push(`${nv.text}: trùng rule ${nv.rule}`); continue }
    const n = docDapAn(nv.text); if (vals.some((v) => trungGiaTri(v, n))) { lyDo.push(`${nv.text}: trùng giá trị nhiễu khác`); continue }
    if (ruleInfo.get(nv.rule)?.du_phong && dp >= 1) { lyDo.push(`${nv.text}: quá 1 rule dự phòng`); continue }
    if (ruleInfo.get(nv.rule)?.du_phong) dp++
    rules.add(nv.rule); vals.push(n); chon.push(nv); if (chon.length === 3) break
  }
  return { chon, lyDo }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-mcq-kiem.mjs')) {
  const { readFileSync } = await import('node:fs')
  const { createRequire } = await import('node:module')
  const a = process.argv.slice(2), tep = a.find((x) => !x.startsWith('--'))
  if (!tep) { console.error('Dùng: node scripts/kho/clone/k5T-pt-mcq-kiem.mjs <lo-nhieu.json> [--db]'); process.exit(2) }
  const pg = createRequire(new URL('../../../package.json', import.meta.url))('pg')
  const env = Object.fromEntries(readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
  const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
  const ruleInfo = new Map((await db.query(`select ma, du_phong from dai_mcq_rule where active`)).rows.map((r) => [r.ma, r]))
  const lo = JSON.parse(readFileSync(tep, 'utf8'))
  const cau = (await db.query(`select ma_cau, noi_dung, dap_an from dai_cau_hoi where xoa_at is null and nguon_giai = 'ai' and noi_dung = any($1)`, [lo.map((x) => x.noi_dung)])).rows
  const theoDe = new Map(cau.map((c) => [c.noi_dung, c]))
  let ok = 0, thieu = 0, khongCau = 0; const ruleDem = {}
  for (const it of lo) {
    const c = theoDe.get(it.noi_dung); if (!c) { khongCau++; console.log('✘ không thấy câu trong kho:', it.noi_dung.slice(0, 70)); continue }
    const { chon, lyDo } = chonNhieu(c.dap_an, it.nhieu, ruleInfo)
    if (chon.length < 3) { thieu++; console.log(`✘ ${c.ma_cau} ${it.noi_dung.slice(0, 60)} → chỉ ${chon.length} nhiễu hợp lệ\n    ${lyDo.slice(0, 4).join('\n    ')}`); continue }
    ok++; for (const n of chon) ruleDem[n.rule] = (ruleDem[n.rule] || 0) + 1
  }
  console.log(`${lo.length} câu · đủ 3 nhiễu hợp lệ ${ok} · thiếu ${thieu} · không có trong kho ${khongCau}`)
  console.log('rule dùng:', JSON.stringify(ruleDem))
  await db.end(); process.exit(thieu || khongCau ? 1 : 0)
}
