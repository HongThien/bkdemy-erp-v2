// dc-lib.mjs — dựng KHUNG đề cương ôn tập KHỐI 9 (de.json chưa lời giải + các tệp `<MA>.p<N>.soan.md` cho trạm soạn) từ danh sách câu gõ tay.
// Cùng khuôn `kho-rules/dai/lo/k8/de-cuong/dc-lib.mjs` (k8.md §12); khác ở ba chỗ của khối 9:
//   · khoi = '9', kho được phép = dai / hgt (hệ thức lượng — hgt/k9.md); hình phẳng đường tròn không có ở giữa kì I
//   · đề cương khối 9 đánh số bài LẠI TỪ 1 ở mỗi phần (A. Đại số Bài 1–22 · B. Hình học Bài 1–10 · C. Nâng cao Bài 1–5)
//     ⇒ nhãn chỉ duy nhất TRONG một phần; khoá câu = (phần, nhãn)
//   · NHOM chia tệp theo (phần, từ bài, đến bài)
//
//   dung({ MA, TEN, NGUON, FILE, PHAN, CAU, NHOM, LV, HERE })
//     CAU[i] = { phan, kho: 'dai'|'hgt', nhan, noi_dung, anh?: ['de_B6.png'], canh_bao?: ['…' | 'CHƯA CHẮC — …'] }
//     NHOM   = [[phan, tuBai, denBai], …] — mỗi nhóm một tệp phần cho một trạm soạn
//   Cần sẵn: <LV>/goc.pdf (tệp gốc) và <LV>/img/<hình đề>.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

export const khoa = (q) => `P${q.phan} ${q.nhan}`

export function dung({ MA, TEN, NGUON, FILE, PHAN, CAU, NHOM, LV, HERE, NAM = 2026, BO_SACH = 'KNTT', KHONG_NHAP = [] }) {
  const require = createRequire(join(HERE, '../../../../../package.json'))
  const katex = require('katex')
  const loi = []
  for (const q of CAU) {
    const s = q.noi_dung
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${khoa(q)}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${khoa(q)}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
      if (/\\times/.test(m[1])) loi.push(`${khoa(q)}: khối 9 không dùng \\times`)
      if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${khoa(q)}: chữ Việt ngoài \\text{} trong công thức`)
    }
    if (!['dai', 'hgt'].includes(q.kho)) loi.push(`${khoa(q)}: kho phải là dai / hgt`)
    for (const a of q.anh ?? []) if (!existsSync(join(LV, 'img', a))) loi.push(`${khoa(q)}: thiếu hình đề img/${a}`)
    if (!PHAN.some((p) => p.thu_tu === q.phan)) loi.push(`${khoa(q)}: phần ${q.phan} không có`)
  }
  if (new Set(CAU.map(khoa)).size !== CAU.length) loi.push('trùng (phần, nhãn) câu')
  if (loi.length) { console.error('❌\n  ' + loi.join('\n  ')); process.exit(3) }

  const pdf = join(LV, 'goc.pdf')
  if (!existsSync(pdf)) { console.error('thiếu ' + pdf); process.exit(2) }
  const sha256 = createHash('sha256').update(readFileSync(pdf)).digest('hex')

  // de.json (khung)
  const cau = CAU.map((q) => ({ phan: q.phan, so: 0, nhan: q.nhan, kho: q.kho, loai_cau: 'tu_luan', noi_dung: q.noi_dung, lua_chon: null, dap_an: null, dap_an_nguon: null,
    menh_de: null, loi_giai: null, anh: q.anh ?? [], anh_giai: [], dang: null, canh_bao: q.canh_bao ?? [], ...(q.lap ? { lap: q.lap } : {}) }))
  const dem = {}
  for (const q of cau) q.so = (dem[q.phan] = (dem[q.phan] ?? 0) + 1)
  const de = {
    khoi: '9', mon: 'Toán', nam: NAM, nguon: NGUON, kieu: 'de_cuong', ten: TEN, file: FILE, sha256, thoi_gian_phut: null, thang_diem: 10,
    phan: PHAN.map((p) => ({ ...p, dang_thuc: 'tu_luan', diem_moi_cau: 0 })), cau,
    // ý đề cương in thiếu hẳn một vế ⇒ không nhập; ghep-chung liệt kê vào <MA>.chua-chac.md cho CEO
    ...(KHONG_NHAP.length ? { khong_nhap: KHONG_NHAP } : {}),
  }
  mkdirSync(join(LV, 'img'), { recursive: true })
  writeFileSync(join(LV, 'de.json'), JSON.stringify(de, null, 1))

  // tệp khung cho trạm soạn
  const baiCua = (nhan) => +nhan.match(/^Bài (\d+)/)[1]
  const dung_ = new Set()
  NHOM.forEach(([pt, tu, den], n) => {
    const cs = CAU.filter((q) => !q.lap && q.phan === pt && baiCua(q.nhan) >= tu && baiCua(q.nhan) <= den)
    cs.forEach((q) => { if (dung_.has(khoa(q))) throw new Error('trùng ' + khoa(q)); dung_.add(khoa(q)) })
    const p = PHAN.find((x) => x.thu_tu === pt)
    let md = `# ĐỀ | ${TEN}\nnam: ${NAM}\nbo_sach: ${BO_SACH}\nkieu: de_cuong\n\n## PHẦN ${pt} | ${p.ten} | tu_luan\n`
    for (const q of cs) {
      md += `\n### ${q.nhan} | kho=${q.kho} | loai=tu_luan | dap_an=—\n**Đề:** ${q.noi_dung}\n`
      for (const a of q.anh ?? []) md += `**Hình:** ${a}\n`
      for (const cb of q.canh_bao ?? []) md += cb.startsWith('CHƯA CHẮC — ') ? `**Chưa chắc:** ${cb.slice(12)}\n` : `**Ghi chú:** ${cb}\n`
    }
    writeFileSync(join(HERE, `${MA}.p${n + 1}.soan.md`), md)
    console.log(`p${n + 1} (phần ${pt}): ${cs.length} câu — ${cs.map((q) => q.nhan.replace('Bài ', '')).join(' ')}`)
  })
  // câu `lap: 'P2 Bài 5'` = đề cương in LẶP nguyên văn một bài khác ⇒ không giao soạn lần hai; ghep-chung chép lời giải của bài gốc
  for (const q of CAU.filter((x) => x.lap)) if (!CAU.some((x) => !x.lap && khoa(x) === q.lap)) throw new Error(`${khoa(q)}: lap trỏ tới câu không có (${q.lap})`)
  const canSoan = CAU.filter((q) => !q.lap).length
  if (dung_.size !== canSoan) throw new Error(`thiếu câu: ${dung_.size}/${canSoan}`)
  const tk = PHAN.map((p) => `${p.ten}: ${cau.filter((q) => q.phan === p.thu_tu).length}`).join(' · ')
  console.log(`✔ ${join(LV, 'de.json')} — ${cau.length} câu (${tk}) · HGT ${CAU.filter((q) => q.kho === 'hgt').length} · hình đề ${CAU.filter((q) => q.anh?.length).length} · ghi chú ${CAU.filter((q) => q.canh_bao?.length).length} câu · sha256 ${sha256.slice(0, 12)}…`)
}
